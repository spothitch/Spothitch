/**
 * Spot Destinations Utilities
 * Normalizes and provides helpers for multi-destination spots.
 *
 * A spot can have multiple destinations (e.g. Lyon AND Marseille from the same ramp).
 * Legacy spots only have `directionCity` / `to` — this module bridges the two formats.
 */

/**
 * Normalize a spot so it always has a `destinations` array.
 * If the spot already has `destinations`, returns as-is.
 * If it has `directionCity` or `to`, builds a single-element array.
 * Mutates the spot in-place for performance (called on every loaded spot).
 *
 * @param {object} spot
 * @returns {object} the same spot, with `destinations` guaranteed
 */
export function normalizeSpotDestinations(spot) {
  if (spot.destinations && spot.destinations.length > 0) return spot

  const city = spot.directionCity || spot.to || spot.direction || ''
  if (!city) {
    spot.destinations = []
    return spot
  }

  spot.destinations = [{
    city,
    coords: spot.directionCityCoords || null,
    addedBy: spot.creatorId || null,
    addedByName: spot.creator || null,
    addedAt: spot.createdAt || null,
    method: spot.method || null,
    waitTime: spot.avgWaitTime || spot.waitTime || null,
  }]

  return spot
}

/**
 * Get all destination city names for a spot.
 * @param {object} spot
 * @returns {string[]}
 */
export function getDestinationsCities(spot) {
  const dests = spot.destinations || []
  return dests.map(d => d.city).filter(Boolean)
}

/**
 * Compact display string for destinations.
 * "Lyon" for 1 destination, "Lyon (+2)" for 3 destinations.
 * @param {object} spot
 * @returns {string}
 */
export function getDestinationsDisplay(spot) {
  const dests = spot.destinations || []
  if (dests.length === 0) return spot.to || spot.directionCity || spot.direction || ''
  const first = dests[0].city || ''
  if (dests.length === 1) return first
  return `${first} (+${dests.length - 1})`
}

/**
 * Check if a destination city already exists in the spot.
 * Case-insensitive comparison.
 * @param {object} spot
 * @param {string} cityName
 * @returns {boolean}
 */
export function hasDestination(spot, cityName) {
  const dests = spot.destinations || []
  const lower = cityName.toLowerCase()
  return dests.some(d => (d.city || '').toLowerCase() === lower)
}
