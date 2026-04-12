/**
 * Guardian Mode Service
 * Real-time safety feature for hitchhikers.
 * The user sets a trusted contact ("guardian"), starts a trip,
 * and the app periodically asks them to "check in".
 * If they don't check in, an alert is sent to their guardian
 * with their last known position.
 *
 * Features:
 * - Push notification alerts (push-only, no SMS)
 * - GPS breadcrumb trail (#24)
 * - Safe arrival notification (#25)
 * - Departure notification (#26)
 * - Battery low auto-alert (#27)
 * - ETA estimation (#28)
 * - Check-in reminder notification (#29)
 * - Trusted contacts circle (#30)
 * - Travel timeline history (#31)
 */

import { sendLocalNotification, showToast as showToastFn } from './notifications.js'
import { t } from '../i18n/index.js'
import { haversineKm } from '../utils/geo.js'

/**
 * Sync SOS timer to Firestore so the server can monitor it.
 * If the phone dies, the server-side Cloud Function detects the expired timer
 * and sends a push notification to the guardian.
 */
async function syncSOSTimerToFirestore(action, data = {}) {
  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { doc, setDoc, deleteDoc, serverTimestamp } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return

    const timerRef = doc(db, 'sosTimers', user.uid)

    if (action === 'start') {
      await setDoc(timerRef, {
        userId: user.uid,
        userName: user.displayName || 'Voyageur',
        guardianName: data.guardianName || '',
        guardianIds: data.guardianIds || [],
        checkInIntervalMinutes: data.interval || 30,
        lastCheckIn: serverTimestamp(),
        tripStart: serverTimestamp(),
        destination: data.destination || '',
        lastPosition: data.position || null,
        licensePlate: data.licensePlate || '',
        customMessage: data.customMessage || '',
        active: true,
      })
    } else if (action === 'checkin') {
      await setDoc(timerRef, {
        lastCheckIn: serverTimestamp(),
        lastPosition: data.position || null,
        alertSent: false, // Reset so Cloud Function can re-alert on next overdue
        active: true,
      }, { merge: true })
    } else if (action === 'alert') {
      await setDoc(timerRef, {
        lastPosition: data.position || null,
        alertSent: true, // Prevent Cloud Function from sending duplicate alert
        active: true,
      }, { merge: true })
    } else if (action === 'message') {
      // Add message to Firestore for guardian to see
      const { collection, addDoc } = await import('firebase/firestore')
      await addDoc(collection(db, 'sosTimers', user.uid, 'messages'), {
        sender: data.sender || user.displayName || 'Voyageur',
        text: data.text || '',
        createdAt: serverTimestamp(),
      })
    } else if (action === 'stop') {
      await deleteDoc(timerRef)
    }
    return true // sync succeeded
  } catch (err) {
    console.warn('[Guardian] Failed to sync SOS timer to Firestore:', err.message)
    return false // sync failed
  }
}

/**
 * Resolve guardian names to Firebase UIDs by matching against friends list.
 * If a guardian's name matches a friend, use the friend's UID.
 * @param {Array<{name: string, phone?: string}>} guardians
 * @returns {Promise<string[]>} array of Firebase UIDs
 */
async function resolveGuardianIds(guardians) {
  try {
    const { getState } = await import('../stores/state.js')
    const friends = getState().friends || []
    const ids = []
    for (const g of guardians) {
      const nameLower = (g.name || '').toLowerCase().trim()
      if (!nameLower) continue
      const match = friends.find(f =>
        (f.name || '').toLowerCase().trim() === nameLower
      )
      if (match?.id) ids.push(match.id)
    }
    return ids
  } catch {
    return []
  }
}

// Rate limit: max 1 SOS alert per 5 minutes
let _lastSOSAlertTime = 0

/**
 * Create a sosAlerts document in Firestore to trigger the onSOSAlert Cloud Function.
 * This sends REAL push notifications to guardians on their phones.
 * Rate-limited to 1 per 5 minutes to prevent spam.
 */
async function createSOSAlertDocument(state) {
  const now = Date.now()
  if (now - _lastSOSAlertTime < 5 * 60 * 1000) {
    console.warn('[Guardian] SOS alert rate-limited (max 1 per 5 minutes)')
    return
  }
  _lastSOSAlertTime = now
  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return

    const lastPos = state.positions?.length > 0
      ? state.positions[state.positions.length - 1]
      : null

    const guardianIds = await resolveGuardianIds(state.guardians || [])
    if (guardianIds.length === 0) {
      console.warn('[Guardian] No guardian UIDs resolved — push alert will not be sent')
      return
    }

    await addDoc(collection(db, 'sosAlerts'), {
      userId: user.uid,
      userName: user.displayName || state.guardian?.name || 'Voyageur',
      guardianIds,
      position: lastPos ? { lat: lastPos.lat, lng: lastPos.lng } : null,
      type: 'emergency',
      licensePlate: state.licensePlate || '',
      customMessage: state.customMessage || '',
      createdAt: serverTimestamp(),
    })
  } catch (err) {
    console.error('[Guardian] Failed to create SOS alert:', err.message)
  }
}

const STORAGE_KEY = 'spothitch_guardian'
const HISTORY_KEY = 'spothitch_trip_history'
const CHECK_INTERVAL_MS = 30_000 // check every 30 seconds (was 10s — saves battery)
const MAX_POSITIONS = 50
const MAX_HISTORY_TRIPS = 20
const BATTERY_ALERT_THRESHOLD = 0.15 // 15%
// 2-minute reminder fires when this many seconds remain before check-in deadline
const REMINDER_SECONDS_THRESHOLD = 120

// ---- Guardian v2 constants ----
const GUARDIAN_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#06b6d4', '#a855f7']
const MAX_GUARDIANS = 5
const MAX_TRIP_EVENTS = 100

let timerInterval = null
let overdueCallback = null
let overdueNotified = false
let _overdueCallbackFired = false
let reminderNotified = false
let batteryAlertSent = false
// _batteryRef: kept for future cleanup of battery event listeners
// eslint-disable-next-line no-unused-vars
let _batteryRef = null

/**
 * Default guardian state
 */
function getDefaultState() {
  return {
    active: false,
    guardian: { name: '', phone: '' },
    trustedContacts: [], // [{name, phone}] — up to 5 additional contacts
    guardians: [], // [{name, phone, color}] — max 5 (v2 multi-guardian)
    tripEvents: [], // [{type, timestamp, data, sender?}] (v2 trip timeline)
    tripPhoto: null, // base64 data URL (v2 trip photo)
    checkInInterval: 30, // minutes
    lastCheckIn: null, // timestamp
    tripStart: null, // timestamp
    positions: [], // [{lat, lng, timestamp}]
    alertSent: false,
    destination: '', // optional — for ETA
    notifyOnDeparture: true,
    notifyOnArrival: true,
    licensePlate: '', // optional — car plate number included in alerts
    customMessage: '', // optional — pre-configured message included in alerts
  }
}

/**
 * Load guardian state from localStorage
 */
function loadState() {
  try {
    // Migrate from old key name (companion → guardian)
    const oldKey = 'spothitch_companion'
    const oldRaw = localStorage.getItem(oldKey)
    if (oldRaw && !localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, oldRaw)
      localStorage.removeItem(oldKey)
    }

    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      // Migrate: if old single guardian exists but no guardians array, create it
      if (parsed.guardian?.name && (!parsed.guardians || parsed.guardians.length === 0)) {
        parsed.guardians = [{
          name: parsed.guardian.name,
          phone: parsed.guardian.phone || '',
          color: '#22c55e',
        }]
      }
      // Ensure guardians array exists
      if (!Array.isArray(parsed.guardians)) parsed.guardians = []
      // Ensure tripEvents array exists
      if (!Array.isArray(parsed.tripEvents)) parsed.tripEvents = []
      return { ...getDefaultState(), ...parsed }
    }
  } catch {
    // corrupted data — reset
  }
  return getDefaultState()
}

/**
 * Save guardian state to localStorage
 */
function saveState(state) {
  try {
    // lgtm[js/clear-text-storage-of-sensitive-data]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage full — ignore
  }
}

/**
 * Get the current guardian state
 */
export function getGuardianState() {
  return loadState()
}

/**
 * Check if guardian mode is currently active
 * Auto-stops stale trips (>8h total or >2h silence) so the banner disappears
 */
export function isGuardianActive() {
  const state = loadState()
  if (!state.active) return false

  // Auto-stop stale trips even if the app was never restarted
  const now = Date.now()
  const maxTrip = 8 * 60 * 60 * 1000 // 8 hours
  const maxSilence = 2 * 60 * 60 * 1000 // 2 hours without check-in
  const tripAge = state.tripStart ? now - state.tripStart : 0
  const silenceAge = state.lastCheckIn ? now - state.lastCheckIn : tripAge

  if (tripAge > maxTrip || silenceAge > maxSilence) {
    // Notify guardians before auto-stopping (write Firestore message)
    const reason = tripAge > maxTrip ? 'max_duration' : 'silence'
    try {
      _notifyGuardiansAutoStop(state, reason)
    } catch (e) { console.warn('[Guardian] Failed to notify auto-stop:', e?.message) }
    stopGuardianMode({ sendArrivalNotification: false })
    return false
  }

  return true
}

/**
 * Notify guardians when trip auto-stops due to timeout or silence.
 * Writes a sosAlerts doc so the existing Cloud Function sends push notifications.
 */
async function _notifyGuardiansAutoStop(state, reason) {
  try {
    const { getFirestore, collection, addDoc, serverTimestamp } = await import('firebase/firestore')
    const { getCurrentUser } = await import('./firebase.js')
    const user = getCurrentUser()
    if (!user) return
    const db = getFirestore()
    await addDoc(collection(db, 'sosAlerts'), {
      userId: user.uid,
      userName: user.displayName || state.guardian?.name || 'Voyageur',
      type: 'auto_stop',
      reason,
      guardianIds: (state.guardians || []).map(g => g.friendId).filter(Boolean),
      createdAt: serverTimestamp(),
    })
  } catch (e) { console.warn('[Guardian] auto-stop notification error:', e?.message) }
}

// ---- Trusted contacts circle (#30) ----

/**
 * Get all alert recipients (primary guardian + trusted contacts)
 * @param {object} state
 * @returns {Array<{name: string, phone: string}>}
 */
function getAllContacts(state) {
  const contacts = []
  // Use guardians array (v2) first
  if (Array.isArray(state.guardians) && state.guardians.length > 0) {
    for (const g of state.guardians) {
      if (g?.name) contacts.push({ name: g.name, phone: g.phone || '' })
    }
  } else if (state.guardian?.name) {
    // Fallback to old single guardian
    contacts.push({ name: state.guardian.name, phone: state.guardian.phone || '' })
  }
  // Also add trusted contacts if any (legacy)
  if (Array.isArray(state.trustedContacts)) {
    for (const c of state.trustedContacts) {
      if (c?.name && !contacts.some(e => e.name === c.name)) contacts.push(c)
    }
  }
  return contacts
}

// ---- Trip history (#31) ----

/**
 * Load trip history from localStorage
 * @returns {Array}
 */
export function loadTripHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // corrupted — reset
  }
  return []
}

/**
 * Save a completed trip to history
 * @param {object} trip
 */
function saveTripToHistory(trip) {
  // Save to localStorage (offline-first)
  try {
    const history = loadTripHistory()
    history.unshift(trip) // newest first
    const trimmed = history.slice(0, MAX_HISTORY_TRIPS)
    // lgtm[js/clear-text-storage-of-sensitive-data]
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed))
  } catch {
    // ignore
  }
  // Also sync to Firestore for cross-device access
  syncTripHistoryToFirestore(trip)
}

async function syncTripHistoryToFirestore(trip) {
  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return
    await addDoc(collection(db, 'users', user.uid, 'tripHistory'), {
      ...trip,
      syncedAt: serverTimestamp(),
    })
  } catch { /* non-blocking */ }
}

/**
 * Clear trip history
 */
export function clearTripHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch {
    // ignore
  }
}

// ---- Battery monitoring (#27) ----

/**
 * Start battery level monitoring.
 * Sends alert when battery drops below 15%.
 */
async function startBatteryMonitor() {
  batteryAlertSent = false
  if (!navigator.getBattery) return

  try {
    const battery = await navigator.getBattery()

    const checkBattery = () => {
      const state = loadState()
      if (!state.active) return

      const level = battery.level
      if (level <= BATTERY_ALERT_THRESHOLD && !batteryAlertSent) {
        batteryAlertSent = true
        const pct = Math.round(level * 100)
        const title = t('guardianBatteryAlertTitle') || 'Battery low!'
        const body = (t('guardianBatteryAlertBody') || 'Battery at {pct}%. Alert sent to guardian.').replace('{pct}', pct)
        sendLocalNotification(title, body, {
          type: 'guardian_battery',
          tag: 'guardian-battery',
        })

        // Auto-send alert to all contacts
        sendAlertToAll(
          buildBatteryAlertMessage(state, pct),
          state
        )
      }
    }

    battery.addEventListener('levelchange', checkBattery)
    checkBattery() // check immediately

    _batteryRef = battery
  } catch {
    // Battery API not available — ignore
  }
}

/**
 * Stop battery monitoring
 */
function stopBatteryMonitor() {
  batteryAlertSent = false
  _batteryRef = null
}

/**
 * Get current battery level (0-1), or null if not available
 * @returns {Promise<number|null>}
 */
export async function getBatteryLevel() {
  if (!navigator.getBattery) return null
  try {
    const battery = await navigator.getBattery()
    return battery.level
  } catch {
    return null
  }
}

// ---- ETA estimation (#28) ----

/**
 * Calculate average speed from GPS positions (km/h)
 * @param {Array<{lat, lng, timestamp}>} positions
 * @returns {number|null}
 */
function calculateAverageSpeed(positions) {
  if (positions.length < 2) return null

  let totalDistanceKm = 0
  let totalTimeMs = 0

  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1]
    const curr = positions[i]
    const dist = haversineKm(prev.lat, prev.lng, curr.lat, curr.lng)
    const dt = curr.timestamp - prev.timestamp
    totalDistanceKm += dist
    totalTimeMs += dt
  }

  if (totalTimeMs === 0) return null
  return (totalDistanceKm / (totalTimeMs / 3_600_000)) // km/h
}

/**
 * Haversine distance — imported from utils/geo.js
 */

/**
 * Get ETA info based on current speed and remaining distance
 * @param {object} state
 * @param {{ lat: number, lng: number } | null} destinationCoords
 * @returns {{ speedKmh: number|null, distanceKm: number|null, etaMinutes: number|null }}
 */
export function getETAInfo(state, destinationCoords = null) {
  const speedKmh = calculateAverageSpeed(state.positions)
  const lastPos = state.positions.length > 0
    ? state.positions[state.positions.length - 1]
    : null

  let distanceKm = null
  let etaMinutes = null

  if (lastPos && destinationCoords) {
    distanceKm = haversineKm(lastPos.lat, lastPos.lng, destinationCoords.lat, destinationCoords.lng)
    if (speedKmh && speedKmh > 0.5) { // Ignore near-zero speed (stationary)
      etaMinutes = Math.round((distanceKm / speedKmh) * 60)
      if (!Number.isFinite(etaMinutes)) etaMinutes = null
    }
  }

  return { speedKmh, distanceKm, etaMinutes }
}

// ---- Message builders ----

/**
 * Generate alert message with position info
 */
function getAlertMessage(state) {
  const lastPos = state.positions.length > 0
    ? state.positions[state.positions.length - 1]
    : null

  const mapLink = lastPos
    ? `https://www.google.com/maps?q=${lastPos.lat},${lastPos.lng}`
    : ''

  const tripDuration = state.tripStart
    ? formatDurationMs(Date.now() - state.tripStart)
    : ''

  const guardianName = state.guardian.name ? state.guardian.name + ', ' : ''
  const alertIntro = t('guardianAlertIntro') || "I haven't checked in on SpotHitch."
  const alertHelp = t('guardianAlertHelp') || 'I may need help.'
  const alertTrip = t('guardianAlertTrip') || 'Trip duration'
  const alertPosition = t('guardianAlertPosition') || 'My last known position'
  const alertFooter = t('guardianAlertFooter') || 'Sent automatically by SpotHitch Guardian Mode.'

  let msg = `SpotHitch Safety Alert\n\n`
  msg += `${guardianName}${alertIntro}\n`
  msg += `${alertHelp}\n\n`
  if (state.licensePlate) {
    const plateLabel = t('licensePlateLabel') || 'License plate'
    msg += `${plateLabel}: ${state.licensePlate}\n`
  }
  if (state.customMessage) {
    msg += `${state.customMessage}\n`
  }
  if (tripDuration) {
    msg += `${alertTrip}: ${tripDuration}\n`
  }
  if (mapLink) {
    msg += `${alertPosition}:\n${mapLink}\n`
  }
  msg += `\n${alertFooter}`

  return msg
}

/**
 * Generate departure notification message
 */
function getDepartureMessage(state) {
  const depMsg = t('guardianDepartureMsg') || 'I am starting my hitchhiking trip. I will check in regularly. · SpotHitch Guardian'
  const guardianName = state.guardian.name ? state.guardian.name + ', ' : ''
  let msg = `SpotHitch · ${guardianName}${depMsg}`
  if (state.destination) {
    const destLabel = t('guardianDestination') || 'Destination'
    msg += `\n${destLabel}: ${state.destination}`
  }
  if (state.licensePlate) {
    const plateLabel = t('licensePlateLabel') || 'License plate'
    msg += `\n${plateLabel}: ${state.licensePlate}`
  }
  if (state.customMessage) {
    msg += `\n${state.customMessage}`
  }
  return msg
}

/**
 * Generate safe arrival message
 */
function getArrivalMessage(state) {
  const arrMsg = t('guardianArrivalMsg') || 'I have arrived safely. My trip is now complete. · SpotHitch Guardian'
  const guardianName = state.guardian.name ? state.guardian.name + ', ' : ''
  const tripDuration = state.tripStart
    ? formatDurationMs(Date.now() - state.tripStart)
    : ''
  let msg = `SpotHitch · ${guardianName}${arrMsg}`
  if (tripDuration) {
    const durLabel = t('guardianAlertTrip') || 'Trip duration'
    msg += `\n${durLabel}: ${tripDuration}`
  }
  if (state.licensePlate) {
    const plateLabel = t('licensePlateLabel') || 'License plate'
    msg += `\n${plateLabel}: ${state.licensePlate}`
  }
  return msg
}

/**
 * Generate low battery alert message
 */
function buildBatteryAlertMessage(state, pct) {
  const battMsg = (t('guardianBatteryMsg') || "My phone battery is at {pct}%. I may lose contact soon. · SpotHitch Guardian").replace('{pct}', pct)
  const guardianName = state.guardian.name ? state.guardian.name + ', ' : ''
  const lastPos = state.positions.length > 0
    ? state.positions[state.positions.length - 1]
    : null
  let msg = `SpotHitch — ${guardianName}${battMsg}`
  if (state.licensePlate) {
    const plateLabel = t('licensePlateLabel') || 'License plate'
    msg += `\n${plateLabel}: ${state.licensePlate}`
  }
  if (lastPos) {
    const posLabel = t('guardianAlertPosition') || 'My last known position'
    msg += `\n${posLabel}:\nhttps://www.google.com/maps?q=${lastPos.lat},${lastPos.lng}`
  }
  return msg
}

// ---- Alert sending — Push notifications only (no SMS) ----

/**
 * Send push notification alerts to all contacts.
 * Guardian mode uses ONLY app push notifications — no SMS.
 * The guardian must have the SpotHitch app or open the web link.
 * @param {string} message - Alert message
 * @param {object} state - Guardian state
 * @returns {number} - number of notifications sent
 */
function sendAlertToAll(message, state) {
  const contacts = getAllContacts(state)
  if (contacts.length === 0) return 0

  const lastPos = state.positions?.length > 0
    ? state.positions[state.positions.length - 1]
    : null
  const mapLink = lastPos
    ? `https://www.google.com/maps?q=${lastPos.lat},${lastPos.lng}`
    : ''

  // Send push notification (works even abroad, no SMS cost)
  const title = t('guardianAlertPushTitle') || 'SpotHitch Safety Alert'
  sendLocalNotification(title, message, {
    type: 'guardian_alert',
    tag: 'guardian-alert',
    requireInteraction: true,
    url: mapLink || '/?guardian=true',
  })

  // Also fire a custom event so the app can react (e.g. show position on map)
  try {
    window.dispatchEvent(new CustomEvent('spothitch:guardian-alert', {
      detail: { message, contacts, position: lastPos },
    }))
  } catch {
    // ignore
  }

  return contacts.length
}

// ---- Public API ----

/**
 * Start guardian mode with guardian(s) and check-in interval
 * @param {{ name: string, phone: string }} guardian
 * @param {number} interval - check-in interval in minutes
 * @param {object} options - { trustedContacts, destination, notifyOnDeparture, notifyOnArrival }
 */
export function startGuardianMode(guardian, interval = 30, options = {}) {
  const now = Date.now()

  // Build guardians array from current state + new guardian
  const existingState = loadState()
  const guardians = Array.isArray(existingState.guardians) && existingState.guardians.length > 0
    ? existingState.guardians
    : [{
        name: guardian.name || '',
        phone: cleanPhone(guardian.phone || ''),
        color: GUARDIAN_COLORS[0],
      }]

  const state = {
    active: true,
    guardian: {
      name: guardian.name || '',
      phone: cleanPhone(guardian.phone || ''),
    },
    guardians,
    trustedContacts: (options.trustedContacts || [])
      .slice(0, 5)
      .map(c => ({ name: c.name || '', phone: cleanPhone(c.phone || '') }))
      .filter(c => c.phone),
    tripEvents: [],
    tripPhoto: null,
    checkInInterval: interval,
    lastCheckIn: now,
    tripStart: now,
    positions: [],
    alertSent: false,
    destination: options.destination || '',
    notifyOnDeparture: options.notifyOnDeparture !== false,
    notifyOnArrival: options.notifyOnArrival !== false,
    checkInsCount: 0,
    travelerPhone: options.travelerPhone ? cleanPhone(options.travelerPhone) : '',
    licensePlate: options.licensePlate || '',
    customMessage: options.customMessage || '',
  }

  // Try to get current position immediately
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const current = loadState()
        current.positions.push({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: Date.now(),
        })
        if (current.positions.length > MAX_POSITIONS) {
          current.positions = current.positions.slice(-MAX_POSITIONS)
        }
        saveState(current)
      },
      () => {
        // GPS denied or unavailable — warn user
        const gpsMsg = t('guardianNoGPS') || 'GPS indisponible. La position ne sera pas partagée avec ton gardien.'
        showToastFn(gpsMsg, 'warning')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  saveState(state)

  // Add departure event to trip timeline
  addTripEvent('departure', { destination: state.destination })

  startTimer()
  startBatteryMonitor()

  // Sync to Firestore for server-side monitoring (Brique 5)
  // Resolve guardian UIDs from friends list (name matching)
  resolveGuardianIds(state.guardians).then(guardianIds => {
    if (guardianIds.length === 0) {
      // Warn user: guardians not found as SpotHitch friends → push won't work
      const warnMsg = t('guardianNoFriendMatch') || 'Tes gardiens ne sont pas dans ta liste d\'amis SpotHitch. Ajoute-les en ami pour recevoir les alertes push.'
      showToastFn(warnMsg, 'warning')
    }
    syncSOSTimerToFirestore('start', {
      guardianName: guardian.name,
      guardianIds,
      guardians: state.guardians.map(g => ({ name: g.name, color: g.color })),
      interval,
      destination: options.destination,
      licensePlate: options.licensePlate || '',
      customMessage: options.customMessage || '',
    })
  })

  // Departure notification (#26)
  if (state.notifyOnDeparture) {
    setTimeout(() => {
      const current = loadState()
      if (current.active) {
        sendAlertToAll(getDepartureMessage(current), current)
      }
    }, 2000) // short delay to let position update
  }

  return state
}

/**
 * Stop guardian mode and save trip to history
 * @param {{ sendArrivalNotification?: boolean }} options
 */
export function stopGuardianMode(options = {}) {
  const state = loadState()

  // Add arrival event to trip timeline before clearing
  if (state.active) {
    addTripEvent('arrival', { duration: Date.now() - (state.tripStart || Date.now()) })
  }

  // Save arrival notification (#25)
  if (state.active && state.notifyOnArrival && options.sendArrivalNotification !== false) {
    sendAlertToAll(getArrivalMessage(state), state)
  }

  // Save to history (#31)
  if (state.active && state.tripStart) {
    saveTripToHistory({
      id: state.tripStart,
      startTime: state.tripStart,
      endTime: Date.now(),
      guardian: state.guardian,
      guardians: state.guardians || [],
      trustedContacts: state.trustedContacts || [],
      positions: state.positions,
      tripEvents: state.tripEvents || [],
      checkInsCount: state.checkInsCount || 0,
      destination: state.destination || '',
    })
  }

  stopTimer()
  stopBatteryMonitor()

  // GDPR: Delete position data from Firestore when session ends
  // The sosTimers document contains lastPosition — deleting it removes all position data
  syncSOSTimerToFirestore('stop')

  // Clear trip photo and events
  clearTripPhoto()
  clearTripEvents()

  const defaultState = getDefaultState()
  saveState(defaultState)
  return defaultState
}

/**
 * User confirms they are safe — resets the timer
 */
export function checkIn() {
  const state = loadState()
  if (!state.active) return state

  state.lastCheckIn = Date.now()
  state.alertSent = false
  state.checkInsCount = (state.checkInsCount || 0) + 1
  overdueNotified = false
  _overdueCallbackFired = false
  reminderNotified = false

  // Update position on check-in
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const current = loadState()
        current.positions.push({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: Date.now(),
        })
        if (current.positions.length > MAX_POSITIONS) {
          current.positions = current.positions.slice(-MAX_POSITIONS)
        }
        saveState(current)
      },
      () => { /* ignore */ },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  saveState(state)

  // Add check-in event to trip timeline
  addTripEvent('checkin', {})

  // Sync to Firestore for server-side monitoring
  const lastPos = state.positions?.[state.positions.length - 1] || null
  syncSOSTimerToFirestore('checkin', { position: lastPos }).then(ok => {
    if (!ok) {
      showToastFn(t('guardianSyncFailed') || 'Check-in local OK, but server sync failed. Your guardian may not see this.', 'warning')
    }
  })

  // Auto-arrival detection: if destination coords set and within 500m, suggest arrival
  checkAutoArrival(state)

  return state
}

/**
 * Get time remaining until next check-in (in seconds)
 * Returns negative if past due
 */
export function getTimeUntilNextCheckIn() {
  const state = loadState()
  if (!state.active || !state.lastCheckIn) return 0

  const intervalMs = state.checkInInterval * 60 * 1000
  const elapsed = Date.now() - state.lastCheckIn
  const remaining = intervalMs - elapsed

  return Math.floor(remaining / 1000)
}

/**
 * Check if the check-in is overdue
 */
export function isCheckInOverdue() {
  return getTimeUntilNextCheckIn() < 0
}

/**
 * Add a position to the tracking history
 */
export function addPosition(lat, lng) {
  const state = loadState()
  if (!state.active) return

  state.positions.push({
    lat,
    lng,
    timestamp: Date.now(),
  })

  if (state.positions.length > MAX_POSITIONS) {
    state.positions = state.positions.slice(-MAX_POSITIONS)
  }

  saveState(state)
}

/**
 * Get a Google Maps link with the last known position
 */
export function getShareLink() {
  const state = loadState()
  const lastPos = state.positions.length > 0
    ? state.positions[state.positions.length - 1]
    : null

  if (!lastPos) return null
  return `https://www.google.com/maps?q=${lastPos.lat},${lastPos.lng}`
}

/**
 * Send push notification alert to ALL contacts (guardian + trusted contacts).
 * Guardian mode is app-only — no SMS.
 * Marks alert as sent. Returns number of notifications sent.
 */
export function sendAlert() {
  const state = loadState()
  const contacts = getAllContacts(state)
  if (contacts.length === 0) return null

  const message = getAlertMessage(state)

  // Mark alert as sent
  state.alertSent = true
  saveState(state)

  // Send local notification (this device)
  const count = sendAlertToAll(message, state)

  // Create Firestore sosAlerts document → triggers Cloud Function → REAL push to guardians
  createSOSAlertDocument(state)

  // Sync alertSent=true to Firestore so Cloud Function doesn't re-send
  syncSOSTimerToFirestore('alert', {
    position: state.positions?.[state.positions.length - 1] || null,
  })

  return count > 0 ? count : null
}

/**
 * Register a callback for when check-in is overdue
 */
export function onOverdue(callback) {
  overdueCallback = callback
}

/**
 * Start the periodic timer that checks if check-in is overdue
 * Also handles 2-minute reminder notification (#29)
 */
export function startTimer() {
  stopTimer()

  overdueNotified = false
  _overdueCallbackFired = false
  reminderNotified = false

  timerInterval = setInterval(() => {
    const state = loadState()
    if (!state.active) {
      stopTimer()
      return
    }

    const secondsRemaining = getTimeUntilNextCheckIn()

    // 2-minute reminder (#29)
    if (
      secondsRemaining > 0 &&
      secondsRemaining <= REMINDER_SECONDS_THRESHOLD &&
      !reminderNotified
    ) {
      reminderNotified = true
      const title = t('guardianReminderTitle') || 'Check-in reminder'
      const body = (t('guardianReminderBody') || 'You have {min} minutes to check in!').replace('{min}', Math.ceil(secondsRemaining / 60))
      sendLocalNotification(title, body, {
        type: 'guardian_reminder',
        tag: 'guardian-reminder',
        url: '/?guardian=true',
      })

      // Gentle vibration for reminder
      try {
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200])
        }
      } catch {
        // ignore
      }
    }

    // Reset reminder flag when timer resets
    if (secondsRemaining > REMINDER_SECONDS_THRESHOLD) {
      reminderNotified = false
    }

    if (isCheckInOverdue() && !state.alertSent) {
      // Overdue push notification + vibration (once only, not every 10s)
      if (!overdueNotified) {
        overdueNotified = true

        // Strong vibration (once)
        try {
          if (navigator.vibrate) {
            navigator.vibrate([500, 200, 500, 200, 500])
          }
        } catch {
          // vibration not supported
        }
        const title = t('guardianOverdueTitle') || 'Check-in overdue!'
        const body = t('guardianOverdueBody') || 'Your check-in timer has expired. Are you safe?'
        sendLocalNotification(title, body, {
          type: 'guardian_overdue',
          tag: 'guardian-checkin',
          requireInteraction: true,
          url: '/?guardian=true',
        })
      }

      // Fire callback only once per overdue cycle (prevents render loop every 10s)
      if (overdueCallback && !_overdueCallbackFired) {
        _overdueCallbackFired = true
        overdueCallback(state)
      }
    }
  }, CHECK_INTERVAL_MS)
}

/**
 * Stop the periodic timer
 */
export function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

/**
 * Restore guardian mode on app start (if was active)
 */
export function restoreGuardianMode() {
  const state = loadState()
  if (state.active) {
    // Auto-stop stale trips: 8h total OR 2h since last check-in
    const now = Date.now()
    const maxTrip = 8 * 60 * 60 * 1000 // 8 hours
    const maxSilence = 2 * 60 * 60 * 1000 // 2 hours without check-in
    const tripAge = state.tripStart ? now - state.tripStart : 0
    const silenceAge = state.lastCheckIn ? now - state.lastCheckIn : tripAge

    if (tripAge > maxTrip || silenceAge > maxSilence) {
      // Trip is stale — auto-stop with notification
      stopGuardianMode()
      const title = t('guardianAutoStopTitle') || 'Guardian mode stopped'
      const body = tripAge > maxTrip
        ? (t('guardianAutoStopMaxTrip') || 'Trip exceeded 8 hours. Guardian mode auto-stopped.')
        : (t('guardianAutoStopNoCheckin') || 'No check-in for 2 hours. Guardian mode auto-stopped.')
      sendLocalNotification(title, body, { type: 'guardian_auto_stop', tag: 'guardian-auto-stop' })
      return false
    }

    startTimer()
    startBatteryMonitor()
    return true
  }
  return false
}

// ---- Auto-arrival detection (#6) ----

let _arrivalNotified = false

/**
 * Check if user is within 500m of destination.
 * If so, show a toast suggesting to stop Guardian mode.
 */
function checkAutoArrival(state) {
  if (!state.destination || !state.active || _arrivalNotified) return
  const lastPos = state.positions?.[state.positions.length - 1]
  if (!lastPos) return

  // Check if destinationCoords are available (set when user picks a destination on map)
  const destCoords = state.destinationCoords
  if (!destCoords?.lat || !destCoords?.lng) return

  const distance = haversineKm(lastPos.lat, lastPos.lng, destCoords.lat, destCoords.lng)
  if (distance < 0.5) { // Within 500m
    _arrivalNotified = true
    const msg = t('guardianNearDestination') || 'You seem to have arrived! Stop Guardian mode?'
    showToastFn(msg, 'info')
  }
}

// ---- Send guardian message to Firestore (#2) ----

/**
 * Send a message from the traveler to Firestore so guardians can read it.
 * @param {string} text
 */
export async function sendGuardianMessage(text) {
  if (!text?.trim()) return false
  const trimmed = text.trim().slice(0, 500) // max 500 chars
  const state = loadState()
  if (!state.active) return false

  // Save locally to timeline
  const username = (() => {
    try {
      const s = window.getState?.() || {}
      return s.firstName ? `${s.firstName} ${(s.lastName || '')[0] || ''}.`.trim() : s.username || t('me') || 'Me'
    } catch { return 'Me' }
  })()
  addTripEvent('message', { sender: username, senderColor: '#f59e0b', text: trimmed })

  // Sync to Firestore with senderId for rules validation
  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (user && db) {
      await addDoc(collection(db, 'sosTimers', user.uid, 'messages'), {
        senderId: user.uid,
        senderName: username,
        text: trimmed,
        type: 'text',
        createdAt: serverTimestamp(),
      })
    }
  } catch (err) {
    console.warn('[Guardian] Failed to sync message:', err.message)
  }
  return true
}

// ---- Real-time chat listener ----

let _chatUnsubscribe = null
let _chatCallback = null

/**
 * Subscribe to real-time guardian chat messages from Firestore.
 * Works for both traveler (own sosTimer) and guardian (watched timers).
 * @param {string} travelerId — UID of the traveler (for guardian, this is the watched user)
 * @param {Function} onMessage — callback with array of messages [{senderId, senderName, text, type, createdAt}]
 */
export async function subscribeToGuardianChat(travelerId, onMessage) {
  unsubscribeGuardianChat()
  _chatCallback = onMessage

  try {
    const { db } = await import('./firebase.js')
    const { collection, query, orderBy, onSnapshot, limit } = await import('firebase/firestore')
    if (!db || !travelerId) return

    const q = query(
      collection(db, 'sosTimers', travelerId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(100),
    )

    _chatUnsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const d = doc.data()
        return {
          id: doc.id,
          senderId: d.senderId || '',
          senderName: d.senderName || d.sender || '',
          text: d.text || '',
          type: d.type || 'text',
          photoUrl: d.photoUrl || null,
          createdAt: d.createdAt?.toMillis?.() || Date.now(),
        }
      })
      if (_chatCallback) _chatCallback(messages)
    })
  } catch (err) {
    console.warn('[Guardian] Chat subscribe failed:', err.message)
  }
}

/**
 * Unsubscribe from guardian chat
 */
export function unsubscribeGuardianChat() {
  if (_chatUnsubscribe) {
    _chatUnsubscribe()
    _chatUnsubscribe = null
  }
  _chatCallback = null
}

/**
 * Send a message as a guardian (reply to traveler).
 * Guardian writes to sosTimers/{travelerId}/messages.
 * @param {string} travelerId
 * @param {string} text
 */
export async function sendGuardianReply(travelerId, text) {
  if (!text?.trim() || !travelerId) return false
  const trimmed = text.trim().slice(0, 500)

  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return false

    const senderName = (() => {
      try {
        const s = window.getState?.() || {}
        return s.firstName ? `${s.firstName} ${(s.lastName || '')[0] || ''}.`.trim() : s.username || 'Guardian'
      } catch { return 'Guardian' }
    })()

    await addDoc(collection(db, 'sosTimers', travelerId, 'messages'), {
      senderId: user.uid,
      senderName,
      text: trimmed,
      type: 'text',
      createdAt: serverTimestamp(),
    })
    return true
  } catch (err) {
    console.warn('[Guardian] Reply failed:', err.message)
    return false
  }
}

// ---- Trip photo Firestore sync ----

/**
 * Upload trip photo to Firestore as a message with type 'photo'.
 * The photo is stored as base64 in the message (max ~200KB compressed).
 * @param {string} travelerId
 * @param {string} base64DataUrl
 */
export async function syncTripPhotoToFirestore(base64DataUrl) {
  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db || !base64DataUrl) return

    const senderName = (() => {
      try {
        const s = window.getState?.() || {}
        return s.firstName ? `${s.firstName} ${(s.lastName || '')[0] || ''}.`.trim() : s.username || 'Traveler'
      } catch { return 'Traveler' }
    })()

    await addDoc(collection(db, 'sosTimers', user.uid, 'messages'), {
      senderId: user.uid,
      senderName,
      text: '',
      type: 'photo',
      photoUrl: base64DataUrl,
      createdAt: serverTimestamp(),
    })
  } catch (err) {
    console.warn('[Guardian] Photo sync failed:', err.message)
  }
}

// ---- Guardian from friends list (#9-10) ----

/**
 * Add a guardian from the friends list (uses UID for push resolution).
 * @param {{ id: string, name: string }} friend
 * @returns {boolean}
 */
export function addGuardianFromFriend(friend) {
  if (!friend?.id || !friend?.name?.trim()) return false
  const state = loadState()
  if (state.guardians.length >= MAX_GUARDIANS) return false
  // Dedup by name
  const nameLower = friend.name.toLowerCase().trim()
  if (state.guardians.some(g => (g.name || '').toLowerCase().trim() === nameLower)) return false
  const nameHash = nameLower.split('').reduce((h, c) => ((h << 5) - h) + c.charCodeAt(0), 0)
  const color = GUARDIAN_COLORS[Math.abs(nameHash) % GUARDIAN_COLORS.length] || '#64748b'
  state.guardians.push({ name: friend.name, phone: '', color, friendId: friend.id })
  if (state.guardians.length === 1) {
    state.guardian = { name: friend.name, phone: '' }
  }
  saveState(state)
  return true
}

// ---- Input validation (#14) ----

/**
 * Validate guardian mode inputs before starting.
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateGuardianInputs(state) {
  if (!state.guardians?.length || !state.guardians[0]?.name?.trim()) {
    return { valid: false, error: 'guardian_name_required' }
  }
  for (const g of state.guardians) {
    if (g.name && g.name.length > 100) return { valid: false, error: 'guardian_name_too_long' }
  }
  if (state.destination && state.destination.length > 200) {
    return { valid: false, error: 'destination_too_long' }
  }
  if (state.customMessage && state.customMessage.length > 500) {
    return { valid: false, error: 'message_too_long' }
  }
  if (state.licensePlate && state.licensePlate.length > 20) {
    return { valid: false, error: 'plate_too_long' }
  }
  return { valid: true }
}

// ---- Multi-guardian management (v2) ----

/**
 * Get all guardians
 * @returns {Array<{name: string, phone: string, color: string}>}
 */
export function getGuardians() {
  return loadState().guardians || []
}

/**
 * Add a guardian (max 5)
 * @param {{ name: string, phone?: string }} guardian
 * @returns {boolean} true if added, false if at max
 */
export function addGuardian(guardian) {
  const state = loadState()
  if (state.guardians.length >= MAX_GUARDIANS) return false
  // Prevent duplicate (same name)
  const nameLower = (guardian.name || '').toLowerCase().trim()
  if (!nameLower) return false
  if (state.guardians.some(g => (g.name || '').toLowerCase().trim() === nameLower)) return false
  // Color based on name hash (stable across add/remove)
  const nameHash = nameLower.split('').reduce((h, c) => ((h << 5) - h) + c.charCodeAt(0), 0)
  const color = GUARDIAN_COLORS[Math.abs(nameHash) % GUARDIAN_COLORS.length] || '#64748b'
  state.guardians.push({ name: guardian.name, phone: guardian.phone || '', color })
  // Keep backward compat: mirror first guardian to state.guardian
  if (state.guardians.length === 1) {
    state.guardian = { name: guardian.name, phone: guardian.phone || '' }
  }
  saveState(state)
  return true
}

/**
 * Remove a guardian by index
 * @param {number} index
 */
export function removeGuardian(index) {
  const state = loadState()
  if (index < 0 || index >= state.guardians.length) return
  state.guardians.splice(index, 1)
  // Update backward compat guardian
  state.guardian = state.guardians.length > 0
    ? { name: state.guardians[0].name, phone: state.guardians[0].phone || '' }
    : { name: '', phone: '' }
  saveState(state)
}

/**
 * Update a guardian by index
 * @param {number} index
 * @param {object} data - partial guardian data to merge
 */
export function updateGuardian(index, data) {
  const state = loadState()
  if (index < 0 || index >= state.guardians.length) return
  state.guardians[index] = { ...state.guardians[index], ...data }
  if (index === 0) {
    state.guardian = { name: state.guardians[0].name, phone: state.guardians[0].phone || '' }
  }
  saveState(state)
}

// ---- Trip events (v2 timeline) ----

/**
 * Add a trip event to the timeline
 * @param {string} type - event type (departure, checkin, arrival, photo, etc.)
 * @param {object} data - event-specific data
 */
export function addTripEvent(type, data = {}) {
  const state = loadState()
  if (!state.active) return
  state.tripEvents.push({ type, timestamp: Date.now(), data })
  if (state.tripEvents.length > MAX_TRIP_EVENTS) {
    state.tripEvents = state.tripEvents.slice(-MAX_TRIP_EVENTS)
  }
  saveState(state)
}

/**
 * Get all trip events
 * @returns {Array<{type: string, timestamp: number, data: object}>}
 */
export function getTripEvents() {
  return loadState().tripEvents || []
}

/**
 * Clear all trip events
 */
export function clearTripEvents() {
  const state = loadState()
  state.tripEvents = []
  saveState(state)
}

// ---- Trip photo (v2) ----

/**
 * Set trip photo (base64 data URL)
 * @param {string|null} dataUrl
 */
export function setTripPhoto(dataUrl) {
  const state = loadState()
  state.tripPhoto = dataUrl
  saveState(state)
  addTripEvent('photo', { thumbnail: dataUrl?.substring(0, 100) })
}

/**
 * Get trip photo
 * @returns {string|null}
 */
export function getTripPhoto() {
  return loadState().tripPhoto || null
}

/**
 * Clear trip photo
 */
export function clearTripPhoto() {
  const state = loadState()
  state.tripPhoto = null
  saveState(state)
}

// ---- Utility helpers ----

/**
 * Clean phone number: keep only digits and leading +
 */
function cleanPhone(phone) {
  if (!phone) return ''
  return phone.replace(/[^0-9+]/g, '')
}

/**
 * Format a duration in milliseconds to a human-readable string
 */
function formatDurationMs(ms) {
  const totalMinutes = Math.floor(ms / 60_000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0) {
    return `${hours}h${minutes > 0 ? String(minutes).padStart(2, '0') : '00'}`
  }
  return `${minutes}min`
}

export default {
  startGuardianMode,
  stopGuardianMode,
  checkIn,
  getGuardianState,
  isGuardianActive,
  getTimeUntilNextCheckIn,
  isCheckInOverdue,
  sendAlert,
  getShareLink,
  addPosition,
  onOverdue,
  startTimer,
  stopTimer,
  restoreGuardianMode,
  loadTripHistory,
  clearTripHistory,
  getBatteryLevel,
  getETAInfo,
  // v2 multi-guardian
  getGuardians,
  addGuardian,
  removeGuardian,
  updateGuardian,
  // v2 trip events
  addTripEvent,
  getTripEvents,
  clearTripEvents,
  // v2 trip photo
  setTripPhoto,
  getTripPhoto,
  clearTripPhoto,
  // v2 real-time chat
  subscribeToGuardianChat,
  unsubscribeGuardianChat,
  sendGuardianReply,
  syncTripPhotoToFirestore,
}
