/**
 * Proximity Radar Service
 * Lets travelers see nearby travelers and be visible to them.
 * Position is approximate (~1km) for privacy.
 * 15-minute cooldown on toggle off to prevent abuse.
 * Real-time updates via onSnapshot listener.
 */

import { haversineKm } from '../utils/geo.js'

const RADAR_KEY = 'spothitch_proximity_radar'
const COOLDOWN_MS = 15 * 60 * 1000 // 15 minutes
const POSITION_PRECISION = 2 // decimal places (~1.1km)
const MIN_DISPLAY_DISTANCE = 5 // never show less than 5km
const POSITION_UPDATE_THROTTLE_MS = 60 * 1000 // Max 1 position update per minute

let _radarListener = null // onSnapshot unsubscribe
let _positionInterval = null
let _lastPositionUpdate = 0

const DEFAULTS = {
  enabled: false,
  radius: 50,
  visibility: ['tous'],
  message: '',
  cooldownUntil: 0,
}

// ─── Settings read/write ─────────────────────────────────────────────────────

export function getRadarSettings() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(RADAR_KEY) || '{}') }
  } catch { return { ...DEFAULTS } }
}

export function saveRadarSettings(settings) {
  const current = getRadarSettings()
  const updated = { ...current, ...settings }
  localStorage.setItem(RADAR_KEY, JSON.stringify(updated))
  return updated
}

// ─── Cooldown helpers ────────────────────────────────────────────────────────

export function isRadarInCooldown() {
  const settings = getRadarSettings()
  return settings.cooldownUntil > Date.now()
}

export function getRemainingCooldownMinutes() {
  const settings = getRadarSettings()
  const remaining = settings.cooldownUntil - Date.now()
  return remaining > 0 ? Math.ceil(remaining / 60000) : 0
}

// ─── Radar activation / deactivation ─────────────────────────────────────────

export async function activateRadar() {
  if (isRadarInCooldown()) {
    const mins = getRemainingCooldownMinutes()
    return { success: false, error: 'cooldown', remainingMinutes: mins }
  }

  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return { success: false, error: 'auth' }

    const pos = await _getCurrentPosition()
    if (!pos) return { success: false, error: 'gps' }

    const approxLat = _roundPosition(pos.lat)
    const approxLng = _roundPosition(pos.lng)

    const { getState } = await import('../stores/state.js')
    const state = getState()
    const settings = getRadarSettings()
    const displayName = state.firstName
      ? `${state.firstName} ${(state.lastName || '').charAt(0)}.`
      : (user.displayName || state.username || '')

    await setDoc(doc(db, 'radarUsers', user.uid), {
      userId: user.uid,
      userName: displayName,
      photoURL: state.profilePhotos?.[0] || state.userProfile?.photoURL || user.photoURL || null,
      gender: state.gender || null,
      lat: approxLat,
      lng: approxLng,
      radius: settings.radius,
      visibility: settings.visibility,
      message: (settings.message || '').substring(0, 200),
      updatedAt: serverTimestamp(),
    })

    saveRadarSettings({ enabled: true })

    // Start real-time listener + periodic position updates
    _startRadarListener()
    _startPositionUpdates()

    return { success: true }
  } catch (err) {
    console.warn('[ProximityRadar] Activation failed:', err.message)
    saveRadarSettings({ enabled: false })
    return { success: false, error: 'firestore' }
  }
}

export async function deactivateRadar() {
  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { doc, deleteDoc } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return { success: false, error: 'auth' }

    await deleteDoc(doc(db, 'radarUsers', user.uid))

    // Stop listener + position updates
    _stopRadarListener()
    _stopPositionUpdates()

    saveRadarSettings({
      enabled: false,
      cooldownUntil: Date.now() + COOLDOWN_MS,
    })
    return { success: true }
  } catch (err) {
    console.warn('[ProximityRadar] Deactivation failed:', err.message)
    return { success: false, error: 'firestore' }
  }
}

// ─── Real-time listener ──────────────────────────────────────────────────────

async function _startRadarListener() {
  _stopRadarListener()
  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { collection, onSnapshot } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return

    _radarListener = onSnapshot(collection(db, 'radarUsers'), (snapshot) => {
      _processRadarSnapshot(snapshot, user.uid)
    }, (err) => {
      console.warn('[ProximityRadar] Listener error:', err.message)
    })
  } catch { /* offline */ }
}

function _stopRadarListener() {
  if (_radarListener) {
    _radarListener()
    _radarListener = null
  }
}

async function _processRadarSnapshot(snapshot, currentUid) {
  try {
    const { getState, setState } = await import('../stores/state.js')
    const state = getState()
    const settings = getRadarSettings()

    let userPos = state.userLocation || state.lastKnownPosition
    if (!userPos) {
      const pos = await _getCurrentPosition()
      if (!pos) return
      userPos = pos
    }
    if (!userPos.lat || !userPos.lng) return

    const friends = state.friends || []
    const friendIds = new Set(friends.map(f => f.id))

    let blockedIds = new Set()
    try {
      const blocked = JSON.parse(localStorage.getItem('spothitch_blocked_users') || '[]')
      blockedIds = new Set(blocked.map(b => typeof b === 'string' ? b : b.id || b.uid).filter(Boolean))
    } catch { /* ignore */ }

    const now = Date.now()
    const MAX_AGE_MS = 2 * 60 * 60 * 1000
    const userGender = state.gender || null
    const travelers = []

    snapshot.forEach((docSnap) => {
      const data = docSnap.data()
      if (data.userId === currentUid) return
      if (blockedIds.has(data.userId)) return
      if (!data.lat || !data.lng) return

      const updatedMs = data.updatedAt?.toMillis?.() || data.updatedAt?.seconds * 1000 || 0
      if (updatedMs && now - updatedMs > MAX_AGE_MS) return

      // Visibility filtering
      const vis = data.visibility || ['tous']
      if (!vis.includes('tous')) {
        if (vis.includes('amis') && !friendIds.has(data.userId)) return
        if (vis.includes('femmes') && userGender !== 'female') return
        if (vis.includes('verifies') && !state.verificationLevel) return
      }

      const dist = haversineKm(userPos.lat, userPos.lng, data.lat, data.lng)
      if (dist > settings.radius) return

      travelers.push({
        userId: data.userId,
        userName: data.userName,
        photoURL: data.photoURL || null,
        gender: data.gender || null,
        distance: dist,
        displayDistance: formatRadarDistance(dist),
        message: data.message || '',
        visibility: vis,
        updatedAt: data.updatedAt,
      })
    })

    travelers.sort((a, b) => a.distance - b.distance)
    setState({ nearbyTravelers: travelers })
  } catch (err) {
    console.warn('[ProximityRadar] Snapshot processing error:', err.message)
  }
}

// ─── Periodic position updates (throttled) ───────────────────────────────────

function _startPositionUpdates() {
  _stopPositionUpdates()
  _positionInterval = setInterval(() => {
    updateRadarPosition()
  }, POSITION_UPDATE_THROTTLE_MS)
}

function _stopPositionUpdates() {
  if (_positionInterval) {
    clearInterval(_positionInterval)
    _positionInterval = null
  }
}

export async function updateRadarPosition() {
  const settings = getRadarSettings()
  if (!settings.enabled) return

  // Throttle: max 1 update per minute
  const now = Date.now()
  if (now - _lastPositionUpdate < POSITION_UPDATE_THROTTLE_MS) return
  _lastPositionUpdate = now

  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return

    const pos = await _getCurrentPosition()
    if (!pos) return

    const approxLat = _roundPosition(pos.lat)
    const approxLng = _roundPosition(pos.lng)

    await updateDoc(doc(db, 'radarUsers', user.uid), {
      lat: approxLat,
      lng: approxLng,
      updatedAt: serverTimestamp(),
    })
  } catch (err) {
    console.warn('[ProximityRadar] Position update failed:', err.message)
  }
}

// ─── Resume listener on page load (if radar was enabled) ─────────────────────

export function resumeRadarIfEnabled() {
  const settings = getRadarSettings()
  if (settings.enabled) {
    _startRadarListener()
    _startPositionUpdates()
  }
}

// ─── Query nearby travelers (fallback for non-listener contexts) ─────────────

export async function getNearbyTravelers() {
  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { collection, getDocs } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return []

    const { getState } = await import('../stores/state.js')
    const state = getState()
    const settings = getRadarSettings()

    let userPos = state.userLocation || state.lastKnownPosition
    if (!userPos) {
      const pos = await _getCurrentPosition()
      if (!pos) return []
      userPos = pos
    }
    if (!userPos.lat || !userPos.lng) return []

    const snapshot = await getDocs(collection(db, 'radarUsers'))
    const travelers = []
    const now = Date.now()
    const MAX_AGE_MS = 2 * 60 * 60 * 1000

    const friends = state.friends || []
    const friendIds = new Set(friends.map(f => f.id))
    const userGender = state.gender || null

    let blockedIds = new Set()
    try {
      const blocked = JSON.parse(localStorage.getItem('spothitch_blocked_users') || '[]')
      blockedIds = new Set(blocked.map(b => typeof b === 'string' ? b : b.id || b.uid).filter(Boolean))
    } catch { /* ignore */ }

    snapshot.forEach((docSnap) => {
      const data = docSnap.data()
      if (data.userId === user.uid) return
      if (blockedIds.has(data.userId)) return
      if (!data.lat || !data.lng) return

      const updatedMs = data.updatedAt?.toMillis?.() || data.updatedAt?.seconds * 1000 || 0
      if (updatedMs && now - updatedMs > MAX_AGE_MS) return

      const vis = data.visibility || ['tous']
      if (!vis.includes('tous')) {
        if (vis.includes('amis') && !friendIds.has(data.userId)) return
        if (vis.includes('femmes') && userGender !== 'female') return
        if (vis.includes('verifies') && !state.verificationLevel) return
      }

      const dist = haversineKm(userPos.lat, userPos.lng, data.lat, data.lng)
      if (dist > settings.radius) return

      travelers.push({
        userId: data.userId,
        userName: data.userName,
        photoURL: data.photoURL || null,
        gender: data.gender || null,
        distance: dist,
        displayDistance: formatRadarDistance(dist),
        message: data.message || '',
        visibility: vis,
        updatedAt: data.updatedAt,
      })
    })

    travelers.sort((a, b) => a.distance - b.distance)
    return travelers
  } catch (err) {
    console.warn('[ProximityRadar] Query failed:', err.message)
    return []
  }
}

// ─── Distance formatting ─────────────────────────────────────────────────────

export function formatRadarDistance(km) {
  if (km < MIN_DISPLAY_DISTANCE) return null // caller will display "< 5 km"
  return Math.round(km)
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function _roundPosition(coord) {
  const factor = 10 ** POSITION_PRECISION
  return Math.round(coord * factor) / factor
}

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
