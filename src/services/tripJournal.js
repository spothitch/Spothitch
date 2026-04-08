/**
 * Trip Journal Service
 * CRUD operations for trips and legs, stored in localStorage + Firebase sync
 *
 * Data structure:
 * - trips: array of trip objects
 * - Each trip has legs (sub-array)
 * - Each day has expenses and a note
 */

const STORAGE_KEY = 'spothitch_journal_trips'

// ─── Firestore sync ─────────────────────────────────────────────────────────

let _syncTimer = null

function debouncedSyncToFirestore(tripId) {
  clearTimeout(_syncTimer)
  _syncTimer = setTimeout(() => syncTripToFirestore(tripId), 1500)
}

/** Force flush pending sync (call before navigation away) */
export function flushPendingSync(tripId) {
  if (_syncTimer) {
    clearTimeout(_syncTimer)
    _syncTimer = null
    syncTripToFirestore(tripId)
  }
}

async function syncTripToFirestore(tripId) {
  try {
    const fb = await import('./firebase.js')
    const db = fb.getDb()
    if (!db) return
    const auth = fb.getAuth()
    const uid = auth?.currentUser?.uid
    if (!uid) return

    const trip = getTrip(tripId)
    if (!trip) return

    // Write to users/{uid}/journal/{tripId} (no photos to avoid Firestore size limits)
    const { dayPhotos: _photos, ...tripWithoutPhotos } = trip // eslint-disable-line no-unused-vars
    await fb.setDoc(fb.doc(db, 'users', uid, 'journal', tripId), tripWithoutPhotos, { merge: true })
  } catch (e) {
    console.warn('[TripJournal] Firestore sync failed:', e.message)
  }
}

async function deleteTripFromFirestore(tripId) {
  try {
    const fb = await import('./firebase.js')
    const db = fb.getDb()
    if (!db) return
    const auth = fb.getAuth()
    const uid = auth?.currentUser?.uid
    if (!uid) return
    await fb.deleteDoc(fb.doc(db, 'users', uid, 'journal', tripId))
  } catch (e) {
    console.warn('[TripJournal] Firestore delete failed:', e.message)
  }
}

/**
 * Hydrate local journal from Firestore (call on login)
 */
export async function hydrateJournalFromFirestore() {
  try {
    const fb = await import('./firebase.js')
    const db = fb.getDb()
    if (!db) return
    const auth = fb.getAuth()
    const uid = auth?.currentUser?.uid
    if (!uid) return

    const snap = await fb.getDocs(fb.collection(db, 'users', uid, 'journal'))
    if (snap.empty) return

    const remoteTrips = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    const localTrips = getTrips()
    const localIds = new Set(localTrips.map(t => t.id))

    const merged = [...localTrips]
    for (const rt of remoteTrips) {
      if (!localIds.has(rt.id)) {
        merged.push(rt)
      } else {
        // Update if remote is newer
        const localIdx = merged.findIndex(t => t.id === rt.id)
        if (localIdx >= 0 && rt.updatedAt > (merged[localIdx].updatedAt || '')) {
          const dayPhotos = merged[localIdx].dayPhotos || {}
          merged[localIdx] = { ...rt, dayPhotos }
        }
      }
    }
    saveTrips(merged)
  } catch (e) {
    console.warn('[TripJournal] Firestore hydrate failed:', e.message)
  }
}

// ==================== TRIPS ====================

export function getTrips() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

function saveTrips(trips) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
  } catch { /* quota */ }
}

export function getTrip(tripId) {
  return getTrips().find(t => t.id === tripId) || null
}

export function getActiveTrip() {
  return getTrips().find(t => t.status === 'active') || null
}

export function createTrip(data = {}) {
  const trips = getTrips()
  // Only one active trip at a time
  if (trips.some(t => t.status === 'active')) return null

  const trip = {
    id: 'trip_' + Date.now() + '_' + Array.from(crypto.getRandomValues(new Uint8Array(4))).map(b => b.toString(36)).join('').slice(0, 6),
    title: data.title || '',
    startDate: data.startDate || new Date().toISOString().slice(0, 10),
    endDate: null,
    status: 'active',
    coverPhoto: null,
    isPublic: false,
    legs: [],
    dayNotes: {},    // { "2026-03-24": "Note du jour..." }
    dayExpenses: {}, // { "2026-03-24": { transport: 12, lodging: 0, food: 7, ... } }
    dayPhotos: {},   // { "2026-03-24": "data:image/..." }
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  trips.unshift(trip)
  saveTrips(trips)
  debouncedSyncToFirestore(trip.id)
  return trip
}

export function updateTrip(tripId, updates) {
  const trips = getTrips()
  const idx = trips.findIndex(t => t.id === tripId)
  if (idx === -1) return null
  trips[idx] = { ...trips[idx], ...updates, updatedAt: new Date().toISOString() }
  saveTrips(trips)
  debouncedSyncToFirestore(tripId)
  return trips[idx]
}

export function endTrip(tripId) {
  return updateTrip(tripId, {
    status: 'completed',
    endDate: new Date().toISOString().slice(0, 10),
  })
}

export function deleteTrip(tripId) {
  const trips = getTrips().filter(t => t.id !== tripId)
  saveTrips(trips)
  deleteTripFromFirestore(tripId)
}

// ==================== LEGS ====================

export function addLeg(tripId, legData) {
  const trips = getTrips()
  const trip = trips.find(t => t.id === tripId)
  if (!trip) return null

  const leg = {
    id: 'leg_' + Date.now() + '_' + Array.from(crypto.getRandomValues(new Uint8Array(4))).map(b => b.toString(36)).join('').slice(0, 6),
    order: trip.legs.length + 1,
    transport: legData.transport, // hitchhike, walk, bus, train, plane, boat, bike, car, other
    departure: {
      name: legData.departureName || '',
      lat: legData.departureLat || null,
      lng: legData.departureLng || null,
    },
    arrival: {
      name: legData.arrivalName || '',
      lat: legData.arrivalLat || null,
      lng: legData.arrivalLng || null,
    },
    distanceKm: legData.distanceKm || 0,
    rideDuration: legData.rideDuration || null, // travel time in minutes (e.g. 65 = 1h05)
    price: legData.price || null, // cost in local currency (for paid transport)
    // Hitchhike-specific (auto-filled from spot)
    spotId: legData.spotId || null,
    spotName: legData.spotName || null,
    spotCreated: legData.spotCreated || false,
    waitMinutes: legData.waitMinutes || null,
    // Note (optional per leg)
    note: legData.note || '',
    // Date
    date: legData.date || new Date().toISOString().slice(0, 10),
    timestamp: new Date().toISOString(),
  }

  trip.legs.push(leg)
  // Auto-generate title from first and last cities
  _updateTripTitle(trip)
  trip.updatedAt = new Date().toISOString()
  saveTrips(trips)
  debouncedSyncToFirestore(tripId)
  return leg
}

export function deleteLeg(tripId, legId) {
  const trips = getTrips()
  const trip = trips.find(t => t.id === tripId)
  if (!trip) return
  trip.legs = trip.legs.filter(l => l.id !== legId)
  // Re-order
  trip.legs.forEach((l, i) => { l.order = i + 1 })
  _updateTripTitle(trip)
  trip.updatedAt = new Date().toISOString()
  saveTrips(trips)
  debouncedSyncToFirestore(tripId)
}

// ==================== DAY NOTES ====================

export function setDayNote(tripId, date, note) {
  const trips = getTrips()
  const trip = trips.find(t => t.id === tripId)
  if (!trip) return
  if (!trip.dayNotes) trip.dayNotes = {}
  trip.dayNotes[date] = note
  trip.updatedAt = new Date().toISOString()
  saveTrips(trips)
  debouncedSyncToFirestore(tripId)
}

// ==================== DAY EXPENSES ====================

const EXPENSE_CATEGORIES = ['transport', 'lodging', 'food', 'leisure', 'logistics', 'other']

export function setDayExpenses(tripId, date, expenses) {
  const trips = getTrips()
  const trip = trips.find(t => t.id === tripId)
  if (!trip) return
  if (!trip.dayExpenses) trip.dayExpenses = {}
  // Only keep valid categories
  const clean = {}
  for (const cat of EXPENSE_CATEGORIES) {
    const val = parseFloat(expenses[cat])
    if (val > 0) clean[cat] = val
  }
  // Store currency from the country
  if (expenses.currency) clean.currency = expenses.currency
  trip.dayExpenses[date] = clean
  trip.updatedAt = new Date().toISOString()
  saveTrips(trips)
  debouncedSyncToFirestore(tripId)
}

export { EXPENSE_CATEGORIES }

// ==================== DAY PHOTOS ====================

export function setDayPhoto(tripId, date, photoDataUrl) {
  const trips = getTrips()
  const trip = trips.find(t => t.id === tripId)
  if (!trip) return
  if (!trip.dayPhotos) trip.dayPhotos = {}
  if (photoDataUrl) {
    trip.dayPhotos[date] = photoDataUrl
    // Auto-set cover photo to first photo added
    if (!trip.coverPhoto) trip.coverPhoto = photoDataUrl
  } else {
    // Delete photo
    delete trip.dayPhotos[date]
    // If deleted photo was cover, pick next available
    if (trip.coverPhoto === photoDataUrl || !trip.coverPhoto) {
      const remaining = Object.values(trip.dayPhotos).filter(Boolean)
      trip.coverPhoto = remaining[0] || null
    }
  }
  trip.updatedAt = new Date().toISOString()
  saveTrips(trips)
  // Photos stay in localStorage only (too large for Firestore)
}

// ==================== STATS ====================

export function getTripStats(trip) {
  if (!trip || !trip.legs) return null
  const legs = trip.legs

  const hitchLegs = legs.filter(l => l.transport === 'hitchhike')
  const paidLegs = legs.filter(l => ['bus', 'train', 'plane', 'boat', 'car'].includes(l.transport))

  const hitchKm = hitchLegs.reduce((s, l) => s + (l.distanceKm || 0), 0)
  const paidKm = paidLegs.reduce((s, l) => s + (l.distanceKm || 0), 0)
  const walkKm = legs.filter(l => l.transport === 'walk').reduce((s, l) => s + (l.distanceKm || 0), 0)
  const totalKm = legs.reduce((s, l) => s + (l.distanceKm || 0), 0)

  const totalWaitMin = hitchLegs.reduce((s, l) => s + (l.waitMinutes || 0), 0)
  const rides = hitchLegs.length

  const countries = new Set()
  legs.forEach(l => {
    // Extract country from departure/arrival names or lat/lng later
    if (l.departure?.country) countries.add(l.departure.country)
    if (l.arrival?.country) countries.add(l.arrival.country)
  })

  const spotsUsed = legs.filter(l => l.spotId && !l.spotCreated).length
  const spotsCreated = legs.filter(l => l.spotCreated).length

  // Days
  const dates = new Set(legs.map(l => l.date))
  const days = dates.size || 1

  // Expenses
  const expenses = trip.dayExpenses || {}
  let totalExpenses = 0
  const expByCategory = {}
  for (const dateExpenses of Object.values(expenses)) {
    for (const [cat, val] of Object.entries(dateExpenses)) {
      if (cat === 'currency') continue
      totalExpenses += val || 0
      expByCategory[cat] = (expByCategory[cat] || 0) + (val || 0)
    }
  }

  // Estimated savings (avg bus/train cost ~0.12€/km)
  const estimatedSavings = Math.round(hitchKm * 0.12)

  // Transport ratio — per-type breakdown
  const transportBreakdown = {}
  legs.forEach(l => {
    const tp = l.transport || 'other'
    const km = l.distanceKm || 0
    transportBreakdown[tp] = (transportBreakdown[tp] || 0) + km
  })
  const transportRatio = {}
  for (const [tp, km] of Object.entries(transportBreakdown)) {
    transportRatio[tp] = totalKm > 0 ? Math.round((km / totalKm) * 100) : 0
  }
  // Keep legacy keys for backward compat
  transportRatio.hitchhike = transportRatio.hitchhike || 0
  transportRatio.paid = totalKm > 0 ? Math.round((paidKm / totalKm) * 100) : 0
  transportRatio.walk = transportRatio.walk || 0

  // Country flags
  const countryFlags = [...countries].map(cc => {
    if (!cc || cc.length !== 2) return ''
    const a = 0x1F1E6 - 65 + cc.toUpperCase().charCodeAt(0)
    const b = 0x1F1E6 - 65 + cc.toUpperCase().charCodeAt(1)
    return String.fromCodePoint(a, b)
  }).filter(Boolean)

  return {
    totalKm, hitchKm, paidKm, walkKm,
    totalWaitMin, rides, days,
    countries: countries.size,
    countryFlags,
    countryCodes: [...countries],
    spotsUsed, spotsCreated,
    totalExpenses, expByCategory,
    estimatedSavings, transportRatio,
    transportBreakdown,
  }
}

// ==================== HELPERS ====================

function _updateTripTitle(trip) {
  if (trip.title && !trip._autoTitle) return // User set a manual title
  const legs = trip.legs
  if (legs.length === 0) {
    trip.title = ''
    return
  }
  const first = legs[0].departure?.name || ''
  const last = legs[legs.length - 1].arrival?.name || ''
  if (first && last && first !== last) {
    trip.title = `${first} → ${last}`
  } else if (first) {
    trip.title = `${first} → ?`
  }
  trip._autoTitle = true
}

/**
 * Get legs grouped by date
 */
export function getLegsByDay(trip) {
  if (!trip || !trip.legs) return []
  const days = {}
  for (const leg of trip.legs) {
    const date = leg.date || trip.startDate
    if (!days[date]) days[date] = []
    days[date].push(leg)
  }
  // Sort by date
  return Object.entries(days)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, legs], i) => ({ date, dayNumber: i + 1, legs }))
}

/**
 * Get currency for a country code
 */
const COUNTRY_CURRENCIES = {
  FR: 'EUR', DE: 'EUR', ES: 'EUR', IT: 'EUR', PT: 'EUR', NL: 'EUR', BE: 'EUR',
  AT: 'EUR', GR: 'EUR', FI: 'EUR', IE: 'EUR', LU: 'EUR', SI: 'EUR', SK: 'EUR',
  EE: 'EUR', LV: 'EUR', LT: 'EUR', HR: 'EUR', ME: 'EUR', XK: 'EUR',
  GB: 'GBP', CH: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK', IS: 'ISK',
  PL: 'PLN', CZ: 'CZK', HU: 'HUF', RO: 'RON', BG: 'BGN',
  TR: 'TRY', GE: 'GEL', AM: 'AMD', UA: 'UAH',
  US: 'USD', CA: 'CAD', MX: 'MXN', BR: 'BRL', AR: 'ARS', CL: 'CLP',
  CO: 'COP', PE: 'PEN', BO: 'BOB', UY: 'UYU',
  MA: 'MAD', TN: 'TND', EG: 'EGP', ZA: 'ZAR', KE: 'KES',
  TH: 'THB', VN: 'VND', IN: 'INR', JP: 'JPY', KR: 'KRW', CN: 'CNY',
  AU: 'AUD', NZ: 'NZD', IL: 'ILS', JO: 'JOD', IR: 'IRR',
  PK: 'PKR', NP: 'NPR', LK: 'LKR', KH: 'KHR', MM: 'MMK',
  MY: 'MYR', ID: 'IDR', PH: 'PHP', TW: 'TWD', MN: 'MNT',
  KZ: 'KZT', KG: 'KGS', UZ: 'UZS',
  RS: 'RSD', BA: 'BAM', MK: 'MKD', AL: 'ALL',
}

export function getCurrencyForCountry(countryCode) {
  return COUNTRY_CURRENCIES[countryCode?.toUpperCase()] || 'EUR'
}
