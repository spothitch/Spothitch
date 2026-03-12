/**
 * Maps URL Parser
 * Extracts coordinates from Google Maps URLs and shared text
 * Supports: Google Maps, Apple Maps, Waze, OpenStreetMap, raw coords
 */

/**
 * Extract lat/lng from a share payload (url + text)
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

  // Try extracting ALL URLs from text (Google Maps often puts URL in text field)
  if (text) {
    const urls = text.match(/https?:\/\/[^\s]+/gi) || []
    for (const u of urls) {
      const fromTextUrl = parseMapUrl(u)
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
 * Parse a maps URL for coordinates.
 * Supports many formats: @lat,lng, ?q=, ?ll=, !3d/!4d, OSM, Waze, Apple Maps
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

    // /search/lat,lng or /search/lat,+lng (Google Maps current share format 2025+)
    const searchMatch = url.match(/\/(?:search|place)\/(-?\d{1,3}\.\d{3,8}),\s?\+?(-?\d{1,3}\.\d{3,8})/)
    if (searchMatch) {
      const lat = parseFloat(searchMatch[1])
      const lng = parseFloat(searchMatch[2])
      if (isValidCoord(lat, lng)) return { lat, lng }
    }

    // !3d(lat)!4d(lng) — Google Maps data URL encoding (common in long share URLs)
    const dataMatch = url.match(/!3d(-?\d{1,3}\.\d{3,8})!4d(-?\d{1,3}\.\d{3,8})/)
    if (dataMatch) {
      const lat = parseFloat(dataMatch[1])
      const lng = parseFloat(dataMatch[2])
      if (isValidCoord(lat, lng)) return { lat, lng }
    }

    // ll=lat,lng (Apple Maps, Waze, alternate Google Maps)
    const ll = parsed.searchParams.get('ll')
    if (ll) {
      const match = ll.match(/^(-?\d{1,3}\.\d{3,8})\s*,\s*(-?\d{1,3}\.\d{3,8})$/)
      if (match) {
        const lat = parseFloat(match[1])
        const lng = parseFloat(match[2])
        if (isValidCoord(lat, lng)) return { lat, lng }
      }
    }

    // center=lat,lng (some map providers)
    const center = parsed.searchParams.get('center')
    if (center) {
      const match = center.match(/^(-?\d{1,3}\.\d{3,8})\s*,\s*(-?\d{1,3}\.\d{3,8})$/)
      if (match) {
        const lat = parseFloat(match[1])
        const lng = parseFloat(match[2])
        if (isValidCoord(lat, lng)) return { lat, lng }
      }
    }

    // destination=lat,lng (Google Maps navigation URLs)
    const dest = parsed.searchParams.get('destination')
    if (dest) {
      const match = dest.match(/^(-?\d{1,3}\.\d{3,8})\s*,\s*(-?\d{1,3}\.\d{3,8})$/)
      if (match) {
        const lat = parseFloat(match[1])
        const lng = parseFloat(match[2])
        if (isValidCoord(lat, lng)) return { lat, lng }
      }
    }

    // OpenStreetMap: /map=zoom/lat/lng or #map=zoom/lat/lng
    const osmPath = (parsed.pathname + parsed.hash).match(/map=\d+\/(-?\d{1,3}\.\d{3,8})\/(-?\d{1,3}\.\d{3,8})/)
    if (osmPath) {
      const lat = parseFloat(osmPath[1])
      const lng = parseFloat(osmPath[2])
      if (isValidCoord(lat, lng)) return { lat, lng }
    }

    // Waze: /ul?ll=lat,lng (already handled by ll= above)
    // Waze: navigate?ll=lat,lng (already handled)
  } catch {
    // Not a valid URL — try regex fallback on raw string
  }

  // Fallback: try !3d/!4d on raw string even if URL parsing failed
  const dataFallback = url.match(/!3d(-?\d{1,3}\.\d{3,8})!4d(-?\d{1,3}\.\d{3,8})/)
  if (dataFallback) {
    const lat = parseFloat(dataFallback[1])
    const lng = parseFloat(dataFallback[2])
    if (isValidCoord(lat, lng)) return { lat, lng }
  }

  return null
}

/**
 * Check if a URL is a short map URL that needs resolution
 * @param {string} url
 * @returns {string|null} The short URL if detected, null otherwise
 */
export function detectShortMapUrl(url) {
  if (!url) return null
  const match = url.match(/https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps|g\.co\/maps|goo\.gle\/maps)\/\S+/)
  return match ? match[0] : null
}

/**
 * Try to resolve a shortened Google Maps URL
 * Uses Cloudflare Worker proxy to follow redirects server-side (bypasses CORS).
 * @param {string} shortUrl
 * @returns {Promise<{ lat: number, lng: number } | null>}
 */
export async function resolveShortMapUrl(shortUrl) {
  const PROXY_URL = 'https://spothitch-resolve-map-url.antoine-v-ville.workers.dev'

  // Strategy 1: Cloudflare Worker proxy
  try {
    const res = await fetch(
      `${PROXY_URL}?url=${encodeURIComponent(shortUrl)}`,
      { signal: AbortSignal.timeout(8000) }
    )
    const data = await res.json()

    // Worker found coordinates directly
    if (data.lat && data.lng && isValidCoord(data.lat, data.lng)) {
      return { lat: data.lat, lng: data.lng }
    }

    // Worker returned a resolved URL — try parsing it for coords
    if (data.resolvedUrl && data.resolvedUrl !== shortUrl) {
      const fromResolved = parseMapUrl(data.resolvedUrl)
      if (fromResolved) return fromResolved
    }

    // Worker returned a place name — geocode it (but skip garbage like "Dynamic Link Not Found")
    if (data.place && !data.place.toLowerCase().includes('not found') && !data.place.toLowerCase().includes('dynamic link')) {
      return geocodePlace(data.place)
    }
  } catch {
    // Proxy unavailable
  }

  // Strategy 2: Direct fetch (some browsers allow following redirects)
  try {
    const res = await fetch(shortUrl, { redirect: 'follow', signal: AbortSignal.timeout(5000) })
    if (res.url && res.url !== shortUrl) {
      return parseMapUrl(res.url)
    }
  } catch {
    // CORS or network error — expected
  }

  return null
}

/**
 * Geocode a place name. Tries Photon (fast) then Nominatim (reliable) as fallback.
 * @param {string} place
 * @returns {Promise<{ lat: number, lng: number } | null>}
 */
export async function geocodePlace(place) {
  // Strategy 1: Photon API (Komoot, fast, no rate limit)
  try {
    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(place)}&limit=1`,
      { signal: AbortSignal.timeout(3000) }
    )
    const data = await res.json()
    const feature = data?.features?.[0]
    if (feature?.geometry?.coordinates) {
      const [lng, lat] = feature.geometry.coordinates
      if (isValidCoord(lat, lng)) return { lat, lng }
    }
  } catch {
    // Photon unavailable, try Nominatim
  }

  // Strategy 2: Nominatim (OpenStreetMap, more reliable, 1 req/s limit)
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`,
      { signal: AbortSignal.timeout(5000), headers: { 'User-Agent': 'SpotHitch/2.0' } }
    )
    const data = await res.json()
    if (data?.[0]?.lat && data?.[0]?.lon) {
      const lat = parseFloat(data[0].lat)
      const lng = parseFloat(data[0].lon)
      if (isValidCoord(lat, lng)) return { lat, lng }
    }
  } catch {
    // Both geocoders failed
  }

  return null
}

/**
 * Validate coordinates are within valid ranges
 */
function isValidCoord(lat, lng) {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}
