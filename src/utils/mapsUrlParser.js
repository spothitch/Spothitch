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
 * Check if a URL is a Google Maps URL with an opaque identifier (no coords).
 * These need server-side resolution to extract actual coordinates.
 * Covers: ?cid=, ?ftid=, ?place_id=, /place/ without @coords
 * @param {string} url
 * @returns {string|null} The URL if it needs resolution, null otherwise
 */
export function detectOpaqueMapUrl(url) {
  if (!url) return null
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace('www.', '')
    if (!host.includes('google') && !host.includes('maps.google')) return null
    // URLs with CID, FTID or place_id but no extractable coordinates
    if (parsed.searchParams.get('cid') || parsed.searchParams.get('ftid') || parsed.searchParams.get('place_id')) {
      return url
    }
    // /place/NAME without @lat,lng coordinates
    if (parsed.pathname.includes('/place/') && !url.includes('@')) {
      return url
    }
  } catch { /* not a valid URL */ }
  return null
}

/**
 * Try to resolve a shortened or opaque Google Maps URL
 * Uses Cloudflare Worker proxy to follow redirects server-side (bypasses CORS).
 * Also handles CID/FTID/place_id URLs by fetching og:image meta tag.
 * @param {string} shortUrl
 * @returns {Promise<{ lat: number, lng: number } | null>}
 */
export async function resolveShortMapUrl(shortUrl) {
  const PROXY_URL = 'https://spothitch-resolve-map-url.antoine-v-ville.workers.dev'

  // Strategy 1: Cloudflare Worker proxy (works for short URLs)
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
    // Proxy unavailable or rejected URL
  }

  // Strategy 2: Fetch page HTML and extract coords from og:image meta tag
  // Google Maps embeds center=lat,lng in the static map thumbnail URL
  try {
    const res = await fetch(shortUrl, { redirect: 'follow', signal: AbortSignal.timeout(8000) })
    // Check resolved URL for coordinates
    if (res.url && res.url !== shortUrl) {
      const fromResolved = parseMapUrl(res.url)
      if (fromResolved) return fromResolved
    }
    // Parse HTML for og:image with coordinates
    const html = await res.text()
    const ogMatch = html.match(/og:image[^>]*content="([^"]*center=([^&"]+))/i)
    if (ogMatch) {
      const centerParam = decodeURIComponent(ogMatch[2])
      const coordMatch = centerParam.match(/(-?\d{1,3}\.\d{3,8})\s*[,%]\s*(-?\d{1,3}\.\d{3,8})/)
      if (coordMatch) {
        const lat = parseFloat(coordMatch[1])
        const lng = parseFloat(coordMatch[2])
        if (isValidCoord(lat, lng)) return { lat, lng }
      }
    }
  } catch {
    // CORS or network error — expected in browser
  }

  return null
}

/**
 * Try a single geocode query against Photon then Nominatim.
 * @param {string} query
 * @returns {Promise<{ lat: number, lng: number } | null>}
 */
async function tryGeocode(query) {
  // Photon API (Komoot, fast, no rate limit)
  try {
    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=1&lang=${document.documentElement.lang || 'en'}`,
      { signal: AbortSignal.timeout(3000) }
    )
    const data = await res.json()
    const feature = data?.features?.[0]
    if (feature?.geometry?.coordinates) {
      const [lng, lat] = feature.geometry.coordinates
      if (isValidCoord(lat, lng)) return { lat, lng }
    }
  } catch { /* Photon unavailable */ }

  // Nominatim (OpenStreetMap, more reliable, 1 req/s limit)
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&accept-language=${document.documentElement.lang || 'en'}`,
      { signal: AbortSignal.timeout(5000), headers: { 'User-Agent': 'SpotHitch/2.0' } }
    )
    const data = await res.json()
    if (data?.[0]?.lat && data?.[0]?.lon) {
      const lat = parseFloat(data[0].lat)
      const lng = parseFloat(data[0].lon)
      if (isValidCoord(lat, lng)) return { lat, lng }
    }
  } catch { /* Both failed */ }

  return null
}

/**
 * Extract city name from administrative address parts.
 * Google Maps addresses go from small → large: Tambon → District → Province.
 * Returns the LAST valid part (= highest admin level = city/province).
 * "Mueang Chiang Mai District" → "Chiang Mai"
 * "Chang Wat Chiang Mai 50300" → "Chiang Mai"
 */
function extractCityFromParts(parts) {
  const adminPrefixes = /\b(Tambon|Mueang|District|Chang\s*Wat|Changwat)\b/gi
  const adminPrefixes2 = /\b(Sub.?district|Province|Amphoe|Amphur|Khet|Khwaeng|Phum|Sangkat)\b/gi

  let last = null
  for (const part of parts) {
    const cleaned = part
      .replace(adminPrefixes, '')
      .replace(adminPrefixes2, '')
      .replace(/\b\d{4,6}\b/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim()
    if (cleaned.length >= 3) {
      last = cleaned
    }
  }
  return last
}

/**
 * Generate simplified versions of a place name for progressive geocoding.
 * Google Maps titles are often "Business Name Street, District, City, Country"
 * which geocoders can't handle, but "Street, City, Country" works.
 */
function simplifyPlaceName(place) {
  const variants = []
  const parts = place.split(',').map(p => p.trim())

  // Road/street keywords to detect address parts
  const roadWords = 'Rd|Road|Ave|Avenue|St|Street|Blvd|Boulevard'
    + '|Lane|Ln|Dr|Drive|Way|Hwy|Highway|Soi|Alley|Route'
    + '|Rue|Straße|Strasse|Calle|Camino|Via|Viale|Corso'
    + '|Passage|Chemin|Place|Platz|Plaza'
  const roadRe = new RegExp(`\\b(${roadWords})\\b`, 'i')
  const hasNumber = /\d+\/?[\d]*/

  // Extract city from admin parts
  const middleParts = parts.slice(1, -1)
  const cityName = parts.length >= 3 ? extractCityFromParts(middleParts) : null
  const country = parts.length >= 2 ? parts[parts.length - 1] : ''
  const street = parts[0]

  // 1. Original name
  variants.push(place)

  // 2. After the last dash (often contains the location part)
  if (place.includes(' - ')) {
    variants.push(place.split(' - ').pop().trim())
  }

  // 3. Street without business name + city + country (BEST for addresses)
  if (parts.length >= 3 && roadRe.test(street) && hasNumber.test(street) && cityName) {
    const numMatch = street.match(/(\d+\/?[\d]*\s+.*)/)
    if (numMatch) {
      variants.push(`${numMatch[1]}, ${cityName}, ${country}`)
    }
  }

  // 4. Full street + city + country
  if (cityName && country) {
    variants.push(`${street}, ${cityName}, ${country}`)
  }

  // 5. Address without business name + full remaining
  if (parts.length >= 2 && roadRe.test(street) && hasNumber.test(street)) {
    const numMatch = street.match(/(\d+\/?[\d]*\s+.*)/)
    if (numMatch) {
      variants.push([numMatch[1], ...parts.slice(1)].join(', '))
    }
  }

  // 6. After the first comma onward (fallback)
  const commaIdx = place.indexOf(',')
  if (commaIdx > 0) {
    variants.push(place.slice(commaIdx + 1).trim())
  }

  // 7. City + Country
  if (cityName && country) {
    variants.push(`${cityName}, ${country}`)
  }

  // 8. Last 2-3 words (often city + country)
  const words = place.replace(/[,]/g, '').split(/\s+/).filter(w => w.length > 1)
  if (words.length > 3) {
    variants.push(words.slice(-3).join(' '))
    variants.push(words.slice(-2).join(' '))
  }

  // 9. Remove common noise words (ATM, branch, store, etc.) and retry
  const noNoise = place
    .replace(/\b(ATM|branch|store|shop|mart|outlet|kiosk|located at|plot|phum)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
  if (noNoise !== place && noNoise.length > 2) {
    variants.push(noNoise)
  }

  // Deduplicate and filter
  return [...new Set(variants)].filter(v => v.length >= 2)
}

/**
 * Geocode a place name with progressive simplification.
 * Tries the full name first, then simplified versions.
 * @param {string} place
 * @returns {Promise<{ lat: number, lng: number } | null>}
 */
export async function geocodePlace(place) {
  const variants = simplifyPlaceName(place)
  for (const query of variants) {
    const result = await tryGeocode(query)
    if (result) return result
  }
  return null
}

/**
 * Validate coordinates are within valid ranges
 */
function isValidCoord(lat, lng) {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}
