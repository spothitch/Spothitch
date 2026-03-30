/**
 * Proximity Radar Service
 * Lets travelers see nearby travelers and be visible to them.
 * Position is approximate (~1km) for privacy.
 * 15-minute cooldown on toggle off to prevent abuse.
 */

import { haversineKm } from '../utils/geo.js'

const RADAR_KEY = 'spothitch_proximity_radar'
const COOLDOWN_MS = 15 * 60 * 1000 // 15 minutes
const POSITION_PRECISION = 2 // decimal places (~1.1km)
const MIN_DISPLAY_DISTANCE = 5 // never show less than 5km

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
  // Check cooldown first
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

    // Round to ~1km (2 decimal places) for privacy
    const approxLat = _roundPosition(pos.lat)
    const approxLng = _roundPosition(pos.lng)

    const { getState } = await import('../stores/state.js')
    const state = getState()
    const settings = getRadarSettings()

    await setDoc(doc(db, 'radarUsers', user.uid), {
      userId: user.uid,
      userName: user.displayName || state.username || '',
      lat: approxLat,
      lng: approxLng,
      radius: settings.radius,
      visibility: settings.visibility,
      message: settings.message,
      updatedAt: serverTimestamp(),
    })

    saveRadarSettings({ enabled: true })
    return { success: true }
  } catch (err) {
    console.warn('[ProximityRadar] Activation failed:', err.message)
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

    // Set cooldown
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

// ─── Position update (called periodically while radar is on) ─────────────────

export async function updateRadarPosition() {
  const settings = getRadarSettings()
  if (!settings.enabled) return

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

// ─── Query nearby travelers ──────────────────────────────────────────────────

export async function getNearbyTravelers() {
  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { collection, getDocs } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return []

    const { getState } = await import('../stores/state.js')
    const state = getState()
    const settings = getRadarSettings()
    const userPos = state.userLocation
    if (!userPos) return []

    const snapshot = await getDocs(collection(db, 'radarUsers'))
    const travelers = []

    snapshot.forEach((docSnap) => {
      const data = docSnap.data()
      // Skip self
      if (data.userId === user.uid) return

      // Calculate distance
      const dist = haversineKm(userPos.lat, userPos.lng, data.lat, data.lng)

      // Only include travelers within our radius
      if (dist > settings.radius) return

      travelers.push({
        userId: data.userId,
        userName: data.userName,
        distance: dist,
        displayDistance: formatRadarDistance(dist),
        message: data.message || '',
        visibility: data.visibility || ['tous'],
        updatedAt: data.updatedAt,
      })
    })

    // Sort by distance (closest first)
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
