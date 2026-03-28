/**
 * Spot Live Data Service
 * Fetches Firebase validations and merges with static spot data
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
      // Prefer experienceDate (when the user actually hitchhiked) over createdAt (when they submitted)
      let date = d.createdAt?.toDate?.()?.toISOString?.()
        || d.validatedAt?.toDate?.()?.toISOString?.()
        || d.timestamp || null
      if (d.experienceDate?.year && d.experienceDate?.month) {
        const day = d.experienceDate.day || 15
        const expD = new Date(d.experienceDate.year, d.experienceDate.month - 1, day, 12, 0, 0)
        if (!isNaN(expD.getTime())) date = expD.toISOString()
      }
      return {
        ...d,
        id: doc.id,
        date,
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
 * Merges static spot data with live community validations.
 *
 * @param {object} staticSpot - The spot data
 * @param {Array} validations - Firebase validation records
 * @returns {object} merged spot with live* fields
 */
export function mergeSpotData(staticSpot, validations) {
  if (!validations || validations.length === 0) {
    return {
      ...staticSpot,
      _liveLoaded: true,
      liveTestCount: 0,
      liveSuccessRate: null,
      liveAvgWaitTime: null,
      liveRatings: null,
      liveComments: [],
      liveDestinations: [],
      liveLastTested: null,
      liveLastTestedBy: null,
    }
  }

  const testValidations = validations.filter(v => v.type === 'test')
  const allValidations = validations

  // Live test count (additive with static data)
  const liveTestCount = (staticSpot.testCount || 0) + testValidations.length

  // Live average wait time
  const waitTimes = []
  if (staticSpot.avgWaitTime) waitTimes.push(staticSpot.avgWaitTime)
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
    if (staticSpot.rideResult === 'yes') {
      totalEntries += 1
      totalSuccesses += 1
    } else if (staticSpot.rideResult === 'no' || staticSpot.rideResult === 'gaveUp') {
      totalEntries += 1
    }
    liveSuccessRate = Math.round((totalSuccesses / totalEntries) * 100)
  }

  // Live ratings
  const ratingVotes = { safety: [], traffic: [], accessibility: [] }
  const staticRatings = staticSpot.ratings || {}
  if (staticRatings.safety) ratingVotes.safety.push(staticRatings.safety)
  if (staticRatings.traffic) ratingVotes.traffic.push(staticRatings.traffic)
  if (staticRatings.accessibility) ratingVotes.accessibility.push(staticRatings.accessibility)

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

  // Live last tested + who tested/validated
  // Sort by actual experience date (not submission date) to find the most recent
  const validationsWithDate = allValidations.filter(v => v.date)
  const sortedByDate = [...validationsWithDate].sort((a, b) => new Date(b.date) - new Date(a.date))
  const liveLastTested = sortedByDate.length > 0 ? sortedByDate[0].date : staticSpot.lastTested
  const testsWithDate = testValidations.filter(v => v.date)
  const sortedTests = [...testsWithDate].sort((a, b) => new Date(b.date) - new Date(a.date))
  const liveLastTestedBy = sortedTests[0]?.userName || sortedByDate[0]?.userName || staticSpot.lastTestedBy || ''
  const liveLastValidatedBy = sortedByDate[0]?.userName || staticSpot.lastValidatedBy || ''

  // Find most recent GPS-verified validation
  const gpsValidation = allValidations.find(v => v.gpsVerified)
  const liveLastGpsVerified = gpsValidation?.date || staticSpot.lastGpsVerified || null
  const liveLastGpsVerifiedBy = gpsValidation?.userName || staticSpot.lastGpsVerifiedBy || null
  const liveLastGpsDistance = gpsValidation?.gpsDistance ?? staticSpot.lastGpsDistance ?? null

  // Live comments from community validations
  const firebaseComments = allValidations
    .filter(v => v.comment)
    .map(v => ({
      text: v.comment,
      userName: v.userName || 'SpotHitch',
      userId: v.userId || null,
      date: v.date,
      waitTime: v.waitTime,
      method: v.method,
      groupSize: v.groupSize,
      timeOfDay: v.timeOfDay,
      rideResult: v.rideResult,
      rating: v.ratings ? Math.round((
        (v.ratings.safety || 0) + (v.ratings.traffic || 0) + (v.ratings.accessibility || 0)
      ) / 3) : null,
    }))

  const staticComments = (staticSpot.comments || []).map(c => ({
    ...c,
    userName: c.userName || 'SpotHitch',
  }))
  const liveComments = [...firebaseComments, ...staticComments]

  // Aggregated destinations from Firebase validations
  const liveDestinations = []
  const destCounts = {}
  for (const v of allValidations) {
    if (v.directionCity) {
      destCounts[v.directionCity] = (destCounts[v.directionCity] || 0) + 1
    }
  }
  // Include static spot direction
  if (staticSpot.directionCity) {
    destCounts[staticSpot.directionCity] = (destCounts[staticSpot.directionCity] || 0) + 1
  }
  for (const [city, count] of Object.entries(destCounts)) {
    liveDestinations.push({ city, count })
  }
  liveDestinations.sort((a, b) => b.count - a.count)

  // Aggregated methods (thumb, sign, asking)
  const methodCounts = {}
  if (staticSpot.method) methodCounts[staticSpot.method] = (methodCounts[staticSpot.method] || 0) + 1
  for (const v of allValidations) {
    if (v.method) methodCounts[v.method] = (methodCounts[v.method] || 0) + 1
  }
  const liveMethods = Object.entries(methodCounts)
    .map(([method, count]) => ({ method, count }))
    .sort((a, b) => b.count - a.count)

  // Aggregated group sizes
  const groupCounts = {}
  if (staticSpot.groupSize) groupCounts[staticSpot.groupSize] = (groupCounts[staticSpot.groupSize] || 0) + 1
  for (const v of allValidations) {
    if (v.groupSize) groupCounts[v.groupSize] = (groupCounts[v.groupSize] || 0) + 1
  }
  const liveGroupSizes = Object.entries(groupCounts)
    .map(([groupSize, count]) => ({ groupSize, count }))
    .sort((a, b) => b.count - a.count)

  // Aggregated time of day
  const timeCounts = {}
  if (staticSpot.timeOfDay) timeCounts[staticSpot.timeOfDay] = (timeCounts[staticSpot.timeOfDay] || 0) + 1
  for (const v of allValidations) {
    if (v.timeOfDay) timeCounts[v.timeOfDay] = (timeCounts[v.timeOfDay] || 0) + 1
  }
  const liveTimesOfDay = Object.entries(timeCounts)
    .map(([timeOfDay, count]) => ({ timeOfDay, count }))
    .sort((a, b) => b.count - a.count)

  const result = {
    ...staticSpot,
    liveTestCount,
    liveAvgWaitTime,
    liveSuccessRate,
    liveRatings,
    liveLastTested,
    liveLastTestedBy,
    liveLastValidatedBy,
    liveComments,
    liveDestinations,
    liveMethods,
    liveGroupSizes,
    liveTimesOfDay,
    _liveLoaded: true,
  }
  // Merge GPS verification data from live validations
  if (liveLastGpsVerified) {
    result.lastGpsVerified = liveLastGpsVerified
    result.lastGpsVerifiedBy = liveLastGpsVerifiedBy
    result.lastGpsDistance = liveLastGpsDistance
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
