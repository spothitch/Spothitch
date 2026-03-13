/**
 * Mapillary Service
 * Fetch street-level photos near GPS coordinates (free, open-source)
 * API v4: https://www.mapillary.com/developer/api-documentation
 */

const MAPILLARY_TOKEN = import.meta.env.VITE_MAPILLARY_TOKEN || ''
const API_BASE = 'https://graph.mapillary.com'

// In-memory cache: "lat,lng" → { photos, timestamp }
const photoCache = new Map()
const CACHE_TTL = 30 * 60 * 1000 // 30 min

/**
 * Fetch Mapillary photos near coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters (default 100)
 * @param {number} limit - Max photos to return (default 3)
 * @returns {Promise<Array<{id: string, url: string, thumbUrl: string, source: string}>>}
 */
export async function fetchMapillaryPhotos(lat, lng, radius = 100, limit = 3) {
  if (!MAPILLARY_TOKEN) return []

  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`
  const cached = photoCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.photos
  }

  try {
    // Bounding box approach: create a small box around the coordinates
    const delta = radius / 111000 // ~111km per degree
    const bbox = [
      lng - delta, // west
      lat - delta, // south
      lng + delta, // east
      lat + delta, // north
    ].join(',')

    const fields = 'id,thumb_256_url,thumb_1024_url,captured_at,compass_angle'
    const url = `${API_BASE}/images?access_token=${MAPILLARY_TOKEN}&fields=${fields}&bbox=${bbox}&limit=${limit}`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)

    if (!response.ok) {
      photoCache.set(cacheKey, { photos: [], timestamp: Date.now() })
      return []
    }

    const data = await response.json()
    const photos = (data.data || []).map(img => ({
      id: img.id,
      thumbUrl: img.thumb_256_url || '',
      url: img.thumb_1024_url || img.thumb_256_url || '',
      capturedAt: img.captured_at || '',
      source: 'mapillary',
    }))

    photoCache.set(cacheKey, { photos, timestamp: Date.now() })
    return photos
  } catch {
    // Network error, timeout, etc. — return empty silently
    photoCache.set(cacheKey, { photos: [], timestamp: Date.now() })
    return []
  }
}

/**
 * Check if Mapillary is configured
 * @returns {boolean}
 */
export function isMapillaryConfigured() {
  return !!MAPILLARY_TOKEN
}

/**
 * Clear the photo cache (for testing)
 */
export function clearMapillaryCache() {
  photoCache.clear()
}

export default { fetchMapillaryPhotos, isMapillaryConfigured, clearMapillaryCache }
