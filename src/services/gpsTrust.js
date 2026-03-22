/**
 * GPS Trust Service
 *
 * Handles GPS confirmation dialogs, trust score tracking,
 * and validation gating based on GPS ratio.
 *
 * Trust rule: minimum 1/3 (33%) of validations must have GPS confirmation.
 * Grace period: trust score only kicks in after 3 total validations.
 */

import { t } from '../i18n/index.js'
import { icon } from '../utils/icons.js'

// ── localStorage keys ────────────────────────────────────────────────
const LS_GPS_COUNT = 'spothitch_validation_gps_count'
const LS_NOGPS_COUNT = 'spothitch_validation_nogps_count'
const MIN_RATIO = 0.33
const GRACE_PERIOD = 3 // trust score ignored below this total

// ── Trust score ──────────────────────────────────────────────────────

export function updateTrustCounters(gpsVerified) {
  const key = gpsVerified ? LS_GPS_COUNT : LS_NOGPS_COUNT
  const current = parseInt(localStorage.getItem(key) || '0', 10)
  localStorage.setItem(key, String(current + 1))

  // Sync to Firestore (fire-and-forget)
  syncTrustToFirestore().catch(() => {})
}

export function getTrustRatio() {
  const gps = parseInt(localStorage.getItem(LS_GPS_COUNT) || '0', 10)
  const noGps = parseInt(localStorage.getItem(LS_NOGPS_COUNT) || '0', 10)
  const total = gps + noGps
  if (total < GRACE_PERIOD) return 1 // trusted during grace period
  return gps / total
}

export function isValidationTrusted() {
  return getTrustRatio() >= MIN_RATIO
}

async function syncTrustToFirestore() {
  try {
    const { getCurrentUser, db } = await import('./firebase.js')
    const user = getCurrentUser()
    if (!user || !db) return
    const { doc, updateDoc } = await import('firebase/firestore')
    const gps = parseInt(localStorage.getItem(LS_GPS_COUNT) || '0', 10)
    const noGps = parseInt(localStorage.getItem(LS_NOGPS_COUNT) || '0', 10)
    await updateDoc(doc(db, 'users', user.uid), {
      validationGpsCount: gps,
      validationNoGpsCount: noGps,
    })
  } catch { /* non-blocking */ }
}

/**
 * Restore trust counters from Firestore (called on login)
 */
export async function restoreTrustCounters() {
  try {
    const localGps = parseInt(localStorage.getItem(LS_GPS_COUNT) || '0', 10)
    const localNoGps = parseInt(localStorage.getItem(LS_NOGPS_COUNT) || '0', 10)
    if (localGps > 0 || localNoGps > 0) return // already have local data

    const { getCurrentUser, db } = await import('./firebase.js')
    const user = getCurrentUser()
    if (!user || !db) return
    const { doc, getDoc } = await import('firebase/firestore')
    const snap = await getDoc(doc(db, 'users', user.uid))
    if (snap.exists()) {
      const data = snap.data()
      if (data.validationGpsCount) {
        localStorage.setItem(LS_GPS_COUNT, String(data.validationGpsCount))
      }
      if (data.validationNoGpsCount) {
        localStorage.setItem(LS_NOGPS_COUNT, String(data.validationNoGpsCount))
      }
    }
  } catch { /* non-blocking */ }
}

// ── GPS check wrapper ────────────────────────────────────────────────

/**
 * Check GPS proximity for a spot and show confirmation dialog if needed.
 *
 * @param {number} spotLat
 * @param {number} spotLng
 * @param {'validation'|'checkin'} type
 * @returns {Promise<{proceed: boolean, gpsVerified: boolean, gpsDistance: number|null, chooseDate?: boolean}>}
 */
export async function checkGpsForAction(spotLat, spotLng, type = 'validation') {
  if (!spotLat || !spotLng) {
    return { proceed: true, gpsVerified: false, gpsDistance: null }
  }

  try {
    const { verifyProximity } = await import('./locationHistory.js')
    const proximity = await verifyProximity(spotLat, spotLng, type)

    if (proximity.allowed) {
      return {
        proceed: true,
        gpsVerified: true,
        gpsDistance: proximity.closestM,
      }
    }
  } catch { /* GPS unavailable */ }

  // GPS didn't confirm — show dialog
  return showGpsConfirmDialog(type === 'validation')
}

// ── Confirmation dialog ──────────────────────────────────────────────

/**
 * Show a glassmorphism confirmation dialog when GPS can't confirm.
 * Returns { proceed, gpsVerified: false, chooseDate? }
 */
function showGpsConfirmDialog(showDateOption = false) {
  return new Promise((resolve) => {
    const id = 'gps-confirm-overlay'
    document.getElementById(id)?.remove()

    const overlay = document.createElement('div')
    overlay.id = id
    overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4'
    overlay.innerHTML = `
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <div class="relative bg-dark-primary border border-slate-800 rounded-2xl max-w-[340px] w-full p-5 text-center" onclick="event.stopPropagation()">
        <div class="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
          ${icon('map-pin', 'w-6 h-6 text-amber-400')}
        </div>
        <h3 class="text-[15px] font-semibold text-slate-200 mb-2">
          ${t('gpsCantConfirmTitle') || 'Position non confirmée'}
        </h3>
        <p class="text-[13px] text-slate-400 mb-5 leading-relaxed">
          ${t('gpsCantConfirmMessage') || 'On ne peut pas confirmer ta position. Es-tu bien à côté de ce spot ?'}
        </p>
        <div class="space-y-2">
          <button id="gps-confirm-yes" type="button"
            class="w-full py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
            ${icon('check', 'w-4 h-4 inline mr-1')}
            ${t('yesImHere') || 'Oui, je suis sur place'}
          </button>
          ${showDateOption ? `
          <button id="gps-confirm-date" type="button"
            class="w-full py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold">
            ${icon('calendar', 'w-4 h-4 inline mr-1')}
            ${t('chooseAnotherDate') || 'Choisir une autre date'}
          </button>` : ''}
          <button id="gps-confirm-cancel" type="button"
            class="w-full py-2.5 text-slate-500 text-sm">
            ${t('cancel') || 'Annuler'}
          </button>
        </div>
      </div>
    `
    document.body.appendChild(overlay)

    const cleanup = () => overlay.remove()

    document.getElementById('gps-confirm-yes')?.addEventListener('click', () => {
      cleanup()
      resolve({ proceed: true, gpsVerified: false, gpsDistance: null })
    })
    document.getElementById('gps-confirm-date')?.addEventListener('click', () => {
      cleanup()
      resolve({ proceed: false, gpsVerified: false, gpsDistance: null, chooseDate: true })
    })
    document.getElementById('gps-confirm-cancel')?.addEventListener('click', () => {
      cleanup()
      resolve({ proceed: false, gpsVerified: false, gpsDistance: null })
    })
    // Click backdrop to cancel
    overlay.querySelector('.absolute')?.addEventListener('click', () => {
      cleanup()
      resolve({ proceed: false, gpsVerified: false, gpsDistance: null })
    })
  })
}
