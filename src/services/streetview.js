/**
 * Google Street View Service
 * Generates free Street View links (no API key needed)
 */

/**
 * Generate a Google Street View URL for coordinates
 * Opens in the user's browser/Google Maps app
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} heading - Camera heading in degrees (0-360, 0=north)
 * @returns {string} Google Maps Street View URL
 */
export function getStreetViewUrl(lat, lng, heading = 0) {
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}&heading=${heading}`
}

/**
 * Calculate heading from one point toward another
 * Useful for pointing Street View camera toward the destination
 * @param {number} fromLat
 * @param {number} fromLng
 * @param {number} toLat
 * @param {number} toLng
 * @returns {number} Heading in degrees (0-360)
 */
export function calculateHeading(fromLat, fromLng, toLat, toLng) {
  const toRad = Math.PI / 180
  const dLng = (toLng - fromLng) * toRad
  const lat1 = fromLat * toRad
  const lat2 = toLat * toRad

  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)
  const bearing = Math.atan2(y, x) * (180 / Math.PI)

  return (bearing + 360) % 360
}

/**
 * Open Street View in a new tab
 * @param {number} lat
 * @param {number} lng
 * @param {number} heading - Optional heading
 */
export function openStreetView(lat, lng, heading = 0) {
  const url = getStreetViewUrl(lat, lng, heading)
  window.open(url, '_blank', 'noopener,noreferrer')
}

export default { getStreetViewUrl, calculateHeading, openStreetView }
