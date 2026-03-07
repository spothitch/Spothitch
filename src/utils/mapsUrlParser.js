/**
 * Maps URL Parser
 * Extracts coordinates from Google Maps URLs and shared text
 */

/**
 * Extract lat/lng from a share payload (url + text)
 * Supports:
 * - Google Maps ?q=lat,lng
 * - Google Maps /@lat,lng,zoom
 * - Google Maps /place/.../@lat,lng
 * - Raw coords in text: "48.8566, 2.3522"
 * @param {string} [url] - Shared URL
 * @param {string} [text] - Shared text
 * @returns {{ lat: number, lng: number } | null}
 */
export function extractCoordsFromShare(url, text) {
  // Try URL first
  if (url) {
    const fromUrl = parseMapUrl(url)
    if (fromUrl) return fromUrl
  }

  // Try extracting a URL from text (Google Maps often puts URL in text)
  if (text) {
    const urlMatch = text.match(/https?:\/\/[^\s]+/i)
    if (urlMatch) {
      const fromTextUrl = parseMapUrl(urlMatch[0])
      if (fromTextUrl) return fromTextUrl
    }

    // Try raw coords in text: "48.8566, 2.3522" or "48.8566,2.3522"
    const coordMatch = text.match(/(-?\d{1,3}\.\d{3,8})\s*,\s*(-?\d{1,3}\.\d{3,8})/)
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1])
      const lng = parseFloat(coordMatch[2])
      if (isValidCoord(lat, lng)) return { lat, lng }
    }
  }

  return null
}

/**
 * Parse a maps URL for coordinates
 * @param {string} url
 * @returns {{ lat: number, lng: number } | null}
 */
function parseMapUrl(url) {
  try {
    const parsed = new URL(url)

    // ?q=lat,lng (Google Maps share format)
    const q = parsed.searchParams.get('q')
    if (q) {
      const match = q.match(/^(-?\d{1,3}\.\d{3,8})\s*,\s*(-?\d{1,3}\.\d{3,8})$/)
      if (match) {
        const lat = parseFloat(match[1])
        const lng = parseFloat(match[2])
        if (isValidCoord(lat, lng)) return { lat, lng }
      }
    }

    // /@lat,lng,zoom or /place/.../@lat,lng
    const atMatch = url.match(/@(-?\d{1,3}\.\d{3,8}),(-?\d{1,3}\.\d{3,8})/)
    if (atMatch) {
      const lat = parseFloat(atMatch[1])
      const lng = parseFloat(atMatch[2])
      if (isValidCoord(lat, lng)) return { lat, lng }
    }

    // ll=lat,lng (alternate format)
    const ll = parsed.searchParams.get('ll')
    if (ll) {
      const match = ll.match(/^(-?\d{1,3}\.\d{3,8})\s*,\s*(-?\d{1,3}\.\d{3,8})$/)
      if (match) {
        const lat = parseFloat(match[1])
        const lng = parseFloat(match[2])
        if (isValidCoord(lat, lng)) return { lat, lng }
      }
    }
  } catch {
    // Not a valid URL
  }
  return null
}

/**
 * Try to resolve a shortened Google Maps URL (maps.app.goo.gl/xxx)
 * by following the redirect to get the full URL with coordinates.
 * Falls back gracefully if CORS blocks the request.
 * @param {string} shortUrl
 * @returns {Promise<{ lat: number, lng: number } | null>}
 */
export async function resolveShortMapUrl(shortUrl) {
  try {
    const res = await fetch(shortUrl, { redirect: 'follow', signal: AbortSignal.timeout(5000) })
    // The final URL after redirect should contain coordinates
    if (res.url && res.url !== shortUrl) {
      return parseMapUrl(res.url)
    }
  } catch {
    // CORS or network error — expected, fail silently
  }
  return null
}

/**
 * Validate coordinates are within valid ranges
 */
function isValidCoord(lat, lng) {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}
