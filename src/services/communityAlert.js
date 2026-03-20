/**
 * Community SOS Alert Service
 *
 * Opt-in system: users can choose to receive SOS alerts from nearby hitchhikers.
 * When opted-in, shares approximate position (~1km) to Firestore.
 * When SOS is triggered, broadcasts the EXACT position to nearby opted-in users.
 *
 * Both sides choose a radius:
 *   - Sender (broadcastRadius): how far to broadcast SOS
 *   - Receiver (helpRadius): how far they are willing to help
 * Alert is sent only if distance <= min(broadcastRadius, helpRadius)
 *
 * Gender filter: sender can choose to alert only women.
 */

import { t } from '../i18n/index.js'

// ─── localStorage key ────────────────────────────────────────────────────────
const COMMUNITY_ALERT_KEY = 'spothitch_community_sos'

const DEFAULTS = {
  receiveAlerts: false,
  helpRadius: 10,         // km — how far am I willing to help
  broadcastRadius: 10,    // km — how far should my SOS reach
  genderFilter: 'all',    // 'all' | 'women'
  lastPositionUpdate: 0,
}

// ─── Settings read/write ─────────────────────────────────────────────────────

export function getCommunityAlertSettings() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(COMMUNITY_ALERT_KEY) || '{}') }
  } catch { return { ...DEFAULTS } }
}

export function saveCommunityAlertSettings(settings) {
  const current = getCommunityAlertSettings()
  const updated = { ...current, ...settings }
  localStorage.setItem(COMMUNITY_ALERT_KEY, JSON.stringify(updated))
  return updated
}

// ─── Position sharing (approximate ~1km for helpers' privacy) ────────────────

const POSITION_UPDATE_INTERVAL = 5 * 60 * 1000 // 5 minutes
let positionUpdateTimer = null

/**
 * Start periodic position sharing to Firestore.
 * Called when user opts-in to community alerts.
 */
export function startPositionSharing() {
  updateCommunityPosition()
  if (positionUpdateTimer) clearInterval(positionUpdateTimer)
  positionUpdateTimer = setInterval(updateCommunityPosition, POSITION_UPDATE_INTERVAL)
}

/**
 * Stop position sharing and remove from Firestore.
 */
export function stopPositionSharing() {
  if (positionUpdateTimer) {
    clearInterval(positionUpdateTimer)
    positionUpdateTimer = null
  }
  removeCommunityPosition()
}

/**
 * Update approximate position in Firestore userLocations collection.
 * Position is rounded to ~1km for the helper's privacy.
 */
async function updateCommunityPosition() {
  const settings = getCommunityAlertSettings()
  if (!settings.receiveAlerts) return

  // Throttle: max every 5 minutes
  if (Date.now() - settings.lastPositionUpdate < POSITION_UPDATE_INTERVAL) return

  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return

    const pos = await _getCurrentPosition()
    if (!pos) return

    // Round to ~1km (2 decimal places = ~1.1km) for privacy
    const approxLat = Math.round(pos.lat * 100) / 100
    const approxLng = Math.round(pos.lng * 100) / 100

    // Get gender from state
    const { getState } = await import('../stores/state.js')
    const state = getState()

    await setDoc(doc(db, 'userLocations', user.uid), {
      userId: user.uid,
      userName: user.displayName || state.username || '',
      lat: approxLat,
      lng: approxLng,
      helpRadius: settings.helpRadius,
      gender: state.gender || '',
      receiveAlerts: true,
      updatedAt: serverTimestamp(),
    })

    saveCommunityAlertSettings({ lastPositionUpdate: Date.now() })
  } catch (err) {
    console.warn('[CommunityAlert] Position update failed:', err.message)
  }
}

/**
 * Remove user from userLocations (opt-out).
 */
async function removeCommunityPosition() {
  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { doc, deleteDoc } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return

    await deleteDoc(doc(db, 'userLocations', user.uid))
  } catch (err) {
    console.warn('[CommunityAlert] Failed to remove position:', err.message)
  }
}

// ─── Broadcast SOS to community ──────────────────────────────────────────────

/**
 * Write a community alert to Firestore.
 * Triggers the onCommunitySOSAlert Cloud Function which finds nearby users.
 * Position is EXACT (not rounded) — critical for emergency response.
 *
 * @param {{lat: number, lng: number}} position - Exact GPS position
 * @param {string} type - 'emergency' | 'silent'
 */
export async function broadcastCommunitySOSAlert(position, type = 'emergency') {
  const settings = getCommunityAlertSettings()

  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return

    const { getState } = await import('../stores/state.js')
    const state = getState()

    await addDoc(collection(db, 'communityAlerts'), {
      userId: user.uid,
      userName: user.displayName || state.username || '',
      position: { lat: position.lat, lng: position.lng },
      broadcastRadius: settings.broadcastRadius,
      genderFilter: settings.genderFilter,
      type,
      createdAt: serverTimestamp(),
    })

    console.log(`[CommunityAlert] SOS broadcast (${type}, radius ${settings.broadcastRadius}km, filter ${settings.genderFilter})`)
  } catch (err) {
    console.warn('[CommunityAlert] Broadcast failed:', err.message)
  }
}

// ─── Render community alert settings section (inside SOS modal) ──────────────

const RADIUS_OPTIONS = [5, 10, 15, 25]

/**
 * Render the community alert settings card for the SOS modal.
 */
export function renderCommunityAlertSettings() {
  const settings = getCommunityAlertSettings()

  const radiusButtons = (key, current) => RADIUS_OPTIONS.map(r =>
    `<button
      onclick="setCommunityRadius('${key}', ${r})"
      class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${r === current
      ? 'bg-primary-500 text-dark-primary'
      : 'bg-white/5 text-slate-400 hover:bg-white/10'}"
      type="button"
    >${r}km</button>`
  ).join('')

  return `
    <div class="bg-dark-secondary rounded-2xl p-4 space-y-4 border border-white/5">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
          <span class="w-8 h-8 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </span>
          ${t('communityAlertTitle') || 'Alerte communautaire'}
        </h3>
        <button
          onclick="toggleCommunityAlerts()"
          class="w-11 h-6 rounded-full ${settings.receiveAlerts ? 'bg-emerald-500' : 'bg-white/10'} relative transition-colors shrink-0"
          type="button"
          role="switch"
          aria-checked="${settings.receiveAlerts}"
          aria-label="${t('communityAlertToggle') || 'Activer les alertes communautaires'}"
        >
          <span class="absolute w-4 h-4 rounded-full bg-white top-1 transition-transform ${settings.receiveAlerts ? 'right-1' : 'left-1'}" aria-hidden="true"></span>
        </button>
      </div>

      <p class="text-xs text-slate-500 leading-relaxed">
        ${t('communityAlertDesc') || 'Recevez une alerte quand un autostoppeur près de vous a besoin d\'aide. Votre position approximative est partagée uniquement avec les utilisateurs à proximité.'}
      </p>

      ${settings.receiveAlerts ? `
        <!-- Help radius (receiver) -->
        <div>
          <label class="text-xs font-semibold text-slate-400 mb-2 block">
            ${t('communityHelpRadius') || 'Je veux bien aider jusqu\'à'}
          </label>
          <div class="flex gap-2">
            ${radiusButtons('helpRadius', settings.helpRadius)}
          </div>
        </div>
      ` : ''}

      <!-- Broadcast radius (sender) -->
      <div>
        <label class="text-xs font-semibold text-slate-400 mb-2 block">
          ${t('communityBroadcastRadius') || 'Mon SOS alerte les gens dans un rayon de'}
        </label>
        <div class="flex gap-2">
          ${radiusButtons('broadcastRadius', settings.broadcastRadius)}
        </div>
      </div>

      <!-- Gender filter (sender) -->
      <div>
        <label class="text-xs font-semibold text-slate-400 mb-2 block">
          ${t('communityGenderFilter') || 'Qui reçoit mon alerte SOS'}
        </label>
        <div class="flex gap-2">
          <button
            onclick="setCommunityGenderFilter('all')"
            class="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${settings.genderFilter === 'all'
              ? 'bg-primary-500 text-dark-primary'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'}"
            type="button"
          >${t('communityFilterAll') || 'Tout le monde'}</button>
          <button
            onclick="setCommunityGenderFilter('women')"
            class="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${settings.genderFilter === 'women'
              ? 'bg-primary-500 text-dark-primary'
              : 'bg-white/5 text-slate-400 hover:bg-white/10'}"
            type="button"
          >${t('communityFilterWomen') || 'Femmes uniquement'}</button>
        </div>
        ${settings.genderFilter === 'women' ? `
          <p class="text-xs text-amber-400/70 mt-1.5">
            ${t('communityFilterWomenNote') || 'Seules les utilisatrices ayant indiqué "Femme" dans leur profil recevront votre alerte.'}
          </p>
        ` : ''}
      </div>
    </div>
  `
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function _getCurrentPosition() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(null); return }
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 10000 }
    )
  })
}
