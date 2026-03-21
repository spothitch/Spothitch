/**
 * Location History Service
 *
 * Records user positions while the app is open (foreground only).
 * Stores in IndexedDB, keeps last 24 hours.
 * Used to verify check-ins (500m) and validations (2km).
 *
 * NOTE: PWA limitation — only works when app is in foreground.
 * When SpotHitch becomes a native app, this will use background location.
 */

const STORE_NAME = 'locationHistory'
const MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24 hours
const RECORD_INTERVAL_MS = 60 * 1000 // 1 minute between recordings
const CHECK_IN_RADIUS_M = 500 // Must be within 500m for check-in
const VALIDATION_RADIUS_M = 2000 // Must be within 2km for validation

let _watchId = null
let _lastRecordTime = 0

/**
 * Calculate distance between two points in meters (Haversine formula)
 */
function distanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Start recording location history.
 * Call this when the app initializes.
 */
export function startLocationTracking() {
  if (_watchId !== null) return
  if (!navigator.geolocation) return

  _watchId = navigator.geolocation.watchPosition(
    (position) => {
      const now = Date.now()
      if (now - _lastRecordTime < RECORD_INTERVAL_MS) return
      _lastRecordTime = now

      const entry = {
        id: `loc_${now}`,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: now,
      }

      putEntry(entry).catch(() => {})

      // Clean old entries (older than 24h)
      cleanOldEntries().catch(() => {})
    },
    () => {}, // Silent fail on error
    {
      enableHighAccuracy: false, // Save battery
      maximumAge: 60000,
      timeout: 10000,
    }
  )
}

/**
 * Stop recording.
 */
export function stopLocationTracking() {
  if (_watchId !== null) {
    navigator.geolocation.clearWatch(_watchId)
    _watchId = null
  }
}

/**
 * Remove entries older than 24 hours.
 */
async function cleanOldEntries() {
  try {
    const cutoff = Date.now() - MAX_AGE_MS
    const all = await getAllEntries()
    for (const entry of all) {
      if (entry.timestamp < cutoff) {
        await deleteEntry(entry.id).catch(() => {})
      }
    }
  } catch { /* non-critical */ }
}

/**
 * Get all location history entries.
 */
async function getAllEntries() {
  try {
    const db = await openDb()
    return new Promise((resolve, _reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req = store.getAll()
      req.onsuccess = () => resolve(req.result || [])
      req.onerror = () => resolve([])
    })
  } catch {
    return []
  }
}

/**
 * Store a location entry in IndexedDB.
 */
async function putEntry(entry) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put(entry)
    tx.oncomplete = resolve
    tx.onerror = () => reject(tx.error)
  })
}

/**
 * Delete a location entry from IndexedDB.
 */
async function deleteEntry(id) {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(id)
    tx.oncomplete = resolve
    tx.onerror = () => reject(tx.error)
  })
}

/**
 * Open IndexedDB for location history.
 */
function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('spothitch_location_history', 1)
    req.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

/**
 * Check if the user was near a spot within the last 24 hours.
 *
 * @param {number} spotLat
 * @param {number} spotLng
 * @param {'checkin' | 'validation'} type — checkin = 500m, validation = 2km
 * @returns {{ allowed: boolean, confidence: string, closestM: number|null, matchedAt: number|null }}
 *
 * Confidence levels:
 * - 'verified_on_spot' : GPS < 500m (check-in quality)
 * - 'position_confirmed' : GPS < 2km (validation quality)
 * - 'nearby_24h' : was within radius in last 24h but not currently
 * - 'no_history' : no GPS data available
 */
export async function verifyProximity(spotLat, spotLng, type = 'checkin') {
  const maxRadius = type === 'checkin' ? CHECK_IN_RADIUS_M : VALIDATION_RADIUS_M

  // 1. Check current position first
  const currentPos = await getCurrentPosition().catch(() => null)
  if (currentPos) {
    const dist = distanceMeters(currentPos.lat, currentPos.lng, spotLat, spotLng)
    if (dist <= CHECK_IN_RADIUS_M) {
      return { allowed: true, confidence: 'verified_on_spot', closestM: Math.round(dist), matchedAt: Date.now() }
    }
    if (dist <= VALIDATION_RADIUS_M) {
      return {
        allowed: type === 'validation',
        confidence: 'position_confirmed',
        closestM: Math.round(dist),
        matchedAt: Date.now(),
      }
    }
  }

  // 2. Check location history (last 24h)
  const entries = await getAllEntries()
  const cutoff = Date.now() - MAX_AGE_MS
  let closestM = null
  let closestTime = null

  for (const entry of entries) {
    if (entry.timestamp < cutoff) continue
    const dist = distanceMeters(entry.lat, entry.lng, spotLat, spotLng)
    if (closestM === null || dist < closestM) {
      closestM = Math.round(dist)
      closestTime = entry.timestamp
    }
  }

  if (closestM !== null && closestM <= maxRadius) {
    const confidence = closestM <= CHECK_IN_RADIUS_M ? 'verified_on_spot' : 'position_confirmed'
    return { allowed: true, confidence, closestM, matchedAt: closestTime }
  }

  if (closestM !== null) {
    return { allowed: false, confidence: 'too_far', closestM, matchedAt: closestTime }
  }

  // 3. No GPS data at all
  return { allowed: false, confidence: 'no_history', closestM: null, matchedAt: null }
}

/**
 * Get current position (promise wrapper).
 */
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('no geolocation'))
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
      reject,
      { enableHighAccuracy: false, maximumAge: 30000, timeout: 5000 }
    )
  })
}

// Export constants for tests
export { CHECK_IN_RADIUS_M, VALIDATION_RADIUS_M, MAX_AGE_MS, distanceMeters }
