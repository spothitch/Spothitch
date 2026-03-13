/**
 * Spot Live Data Service
 * Fetches Firebase validations and merges with static Hitchwiki data
 * to produce live, dynamic spot statistics.
 */

// In-memory cache: spotId → { data, fetchedAt }
const _cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Fetch validations for a spot from Firestore
 * @param {string} spotId
 * @returns {Array} validations sorted by date desc
 */
export async function fetchSpotValidations(spotId) {
  // Check cache
  const cached = _cache.get(spotId)
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return cached.data
  }

  try {
    const { getFirestore } = await import('firebase/firestore')
    const { collection, query, orderBy, limit, getDocs } = await import('firebase/firestore')
    const { getApps, getApp } = await import('firebase/app')

    // Get existing Firebase app
    const app = getApps().length > 0 ? getApp() : null
    if (!app) return []

    const db = getFirestore(app)
    const validationsRef = collection(db, 'spots', String(spotId), 'validations')
    const q = query(validationsRef, orderBy('createdAt', 'desc'), limit(50))
    const snapshot = await getDocs(q)

    const validations = snapshot.docs.map(doc => {
      const d = doc.data()
      return {
        ...d,
        id: doc.id,
        // Normalize createdAt to ISO string
        date: d.createdAt?.toDate?.()?.toISOString?.() || d.timestamp || null,
      }
    })

    _cache.set(spotId, { data: validations, fetchedAt: Date.now() })
    return validations
  } catch {
    return []
  }
}

/**
 * Merge static spot data with live Firebase validations (pure function)
 *
 * RULE: when at least 1 community validation exists for a Hitchwiki spot,
 * ALL Hitchwiki data (comments, ratings, wait time, test count) is replaced
 * by community data only. The goal is to phase out Hitchwiki entirely.
 *
 * @param {object} staticSpot - The static Hitchwiki spot
 * @param {Array} validations - Firebase validation records
 * @returns {object} merged spot with live* fields
 */
export function mergeSpotData(staticSpot, validations) {
  if (!validations || validations.length === 0) {
    return { ...staticSpot, _liveLoaded: true }
  }

  const isHitchwiki = staticSpot.source === 'hitchwiki'
  const testValidations = validations.filter(v => v.type === 'test')
  const allValidations = validations

  // When community data exists for a Hitchwiki spot → ignore Hitchwiki data
  // Community-created spots keep adding to their own data normally
  const ignoreStatic = isHitchwiki

  // Live test count
  const liveTestCount = ignoreStatic
    ? testValidations.length
    : (staticSpot.testCount || 0) + testValidations.length

  // Live average wait time
  const waitTimes = []
  if (!ignoreStatic && staticSpot.avgWaitTime) waitTimes.push(staticSpot.avgWaitTime)
  for (const v of allValidations) {
    if (v.waitTime && typeof v.waitTime === 'number') waitTimes.push(v.waitTime)
  }
  const liveAvgWaitTime = waitTimes.length > 0
    ? Math.round(waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length)
    : null

  // Live success rate
  const rideResults = allValidations.filter(v => v.rideResult)
  let liveSuccessRate = null
  if (rideResults.length > 0) {
    const successes = rideResults.filter(v => v.rideResult === 'yes').length
    let totalEntries = rideResults.length
    let totalSuccesses = successes
    // Only count static rideResult for non-Hitchwiki spots
    if (!ignoreStatic) {
      if (staticSpot.rideResult === 'yes') {
        totalEntries += 1
        totalSuccesses += 1
      } else if (staticSpot.rideResult === 'no' || staticSpot.rideResult === 'gaveUp') {
        totalEntries += 1
      }
    }
    liveSuccessRate = Math.round((totalSuccesses / totalEntries) * 100)
  }

  // Live ratings
  const ratingVotes = { safety: [], traffic: [], accessibility: [] }
  // Only include static ratings for non-Hitchwiki spots
  if (!ignoreStatic) {
    const staticRatings = staticSpot.ratings || {}
    if (staticRatings.safety) ratingVotes.safety.push(staticRatings.safety)
    if (staticRatings.traffic) ratingVotes.traffic.push(staticRatings.traffic)
    if (staticRatings.accessibility) ratingVotes.accessibility.push(staticRatings.accessibility)
  }

  for (const v of allValidations) {
    const r = v.ratings || {}
    if (r.safety) ratingVotes.safety.push(r.safety)
    if (r.traffic) ratingVotes.traffic.push(r.traffic)
    if (r.accessibility) ratingVotes.accessibility.push(r.accessibility)
  }

  const avg = arr => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length * 10) / 10 : 0
  const liveRatings = {
    safety: avg(ratingVotes.safety),
    traffic: avg(ratingVotes.traffic),
    accessibility: avg(ratingVotes.accessibility),
  }

  // Live last tested
  const dates = allValidations.map(v => v.date).filter(Boolean)
  const liveLastTested = dates.length > 0 ? dates[0] : staticSpot.lastTested

  // Live comments: community only for Hitchwiki spots, merged for others
  const firebaseComments = allValidations
    .filter(v => v.comment)
    .map(v => ({
      text: v.comment,
      userName: v.userName || v.userId || 'SpotHitch',
      date: v.date,
      waitTime: v.waitTime,
      method: v.method,
      groupSize: v.groupSize,
      rating: v.ratings ? Math.round((
        (v.ratings.safety || 0) + (v.ratings.traffic || 0) + (v.ratings.accessibility || 0)
      ) / 3) : null,
    }))

  let liveComments
  if (ignoreStatic) {
    // Hitchwiki spot with community data → only community comments
    liveComments = firebaseComments
  } else {
    const staticComments = (staticSpot.comments || []).map(c => ({
      ...c,
      userName: c.userName || 'Hitchwiki',
    }))
    liveComments = [...firebaseComments, ...staticComments]
  }

  // Aggregated destinations from Firebase validations
  const liveDestinations = []
  const destCounts = {}
  for (const v of allValidations) {
    if (v.directionCity) {
      destCounts[v.directionCity] = (destCounts[v.directionCity] || 0) + 1
    }
  }
  for (const [city, count] of Object.entries(destCounts)) {
    liveDestinations.push({ city, count })
  }
  liveDestinations.sort((a, b) => b.count - a.count)

  const result = {
    ...staticSpot,
    liveTestCount,
    liveAvgWaitTime,
    liveSuccessRate,
    liveRatings,
    liveLastTested,
    liveComments,
    liveDestinations,
    _liveLoaded: true,
  }

  // Hitchwiki spot with community data → mark as community, clear old descriptions
  if (ignoreStatic) {
    result.source = 'community'
    result.descriptionEn = ''
    result.descriptionFr = ''
    result.descriptionEs = ''
    result.descriptionDe = ''
  }

  return result
}

/**
 * Enrich a spot with live Firebase data
 * Fetches validations and returns the merged spot
 * @param {object} spot - The static spot
 * @returns {object} enriched spot
 */
export async function enrichSpotWithLiveData(spot) {
  if (!spot || spot._liveLoaded) return spot
  const validations = await fetchSpotValidations(spot.id)
  return mergeSpotData(spot, validations)
}

/**
 * Invalidate cache for a spot (after submitting a new validation)
 */
export function invalidateSpotCache(spotId) {
  _cache.delete(String(spotId))
}
