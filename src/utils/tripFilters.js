/**
 * Unified trip/route filter logic
 * Single source of truth — used by Voyage.js, Travel.js, and App.js
 */

/**
 * Apply a trip filter to an array of spots
 * @param {Array} spots - spots to filter
 * @param {string} filter - filter key (all, station, rating4, wait20, etc.)
 * @returns {Array} filtered spots
 */
export function applyTripFilter(spots, filter) {
  if (!filter || filter === 'all') return spots
  switch (filter) {
    case 'station':
      return spots.filter(s =>
        (s.spotType || '').toLowerCase().includes('station') ||
        (s.description || '').toLowerCase().includes('station')
      )
    case 'rating4':
      return spots.filter(s => (s.globalRating || 0) >= 4)
    case 'wait20':
      return spots.filter(s => s.avgWaitTime && s.avgWaitTime <= 20)
    case 'verified':
      return spots.filter(s => s.userValidations > 0 || s.verified)
    case 'recent':
      return spots.filter(s => {
        if (!s.lastUsed) return false
        return new Date(s.lastUsed).getTime() > Date.now() - 365 * 24 * 60 * 60 * 1000
      })
    case 'shelter':
      return spots.filter(s => {
        const desc = (s.description || '').toLowerCase()
        return desc.includes('shelter') || desc.includes('abri') ||
          desc.includes('roof') || desc.includes('toit') ||
          desc.includes('covered') || desc.includes('couvert')
      })
    default:
      return spots
  }
}

/**
 * Count spots for each filter
 * @param {Array} spots - visible spots
 * @returns {Object} counts keyed by filter name
 */
export function countByFilter(spots) {
  return {
    all: spots.length,
    station: applyTripFilter(spots, 'station').length,
    rating4: applyTripFilter(spots, 'rating4').length,
    wait20: applyTripFilter(spots, 'wait20').length,
    verified: applyTripFilter(spots, 'verified').length,
    recent: applyTripFilter(spots, 'recent').length,
    shelter: applyTripFilter(spots, 'shelter').length,
  }
}
