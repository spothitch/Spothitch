/**
 * OSRM Routing Service
 * Handles route calculation with debouncing and caching
 */

const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving/';

// Nominatim rate limiter: minimum 1000ms between requests
let _lastNominatimRequest = 0
const NOMINATIM_MIN_INTERVAL = 1000

/**
 * Wait if needed to respect Nominatim rate limit (1 req/sec).
 * Returns a promise that resolves when it's safe to send the request.
 */
async function waitForNominatimSlot() {
  const now = Date.now()
  const elapsed = now - _lastNominatimRequest
  if (elapsed < NOMINATIM_MIN_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, NOMINATIM_MIN_INTERVAL - elapsed))
  }
  _lastNominatimRequest = Date.now()
}

// Cache for route results
const routeCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Debounce timer
let debounceTimer = null;

/**
 * Calculate route between waypoints
 * @param {Array<{lat: number, lng: number}>} waypoints - Array of coordinates
 * @returns {Promise<Object>} Route data
 */
export async function getRoute(waypoints) {
  if (!waypoints || waypoints.length < 2) {
    throw new Error('At least 2 waypoints required');
  }

  // Build coordinates string
  const coords = waypoints
    .map(wp => `${wp.lng.toFixed(6)},${wp.lat.toFixed(6)}`)
    .join(';');

  // Build URL
  const url = `${OSRM_BASE_URL}${coords}?overview=full&geometries=geojson&steps=true`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OSRM error: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 'Ok') {
      throw new Error(`OSRM error: ${data.code}`);
    }

    const route = data.routes[0];

    return {
      distance: route.distance, // meters
      duration: route.duration, // seconds
      geometry: route.geometry.coordinates, // GeoJSON coordinates
      steps: route.legs.flatMap(leg => leg.steps),
    };
  } catch (error) {
    console.error('Route calculation failed:', error);
    throw error;
  }
}

/**
 * Get route with debouncing (rate limiting)
 * @param {Array<{lat: number, lng: number}>} waypoints - Array of coordinates
 * @param {number} delay - Debounce delay in ms (default 500)
 * @returns {Promise<Object>} Route data
 */
export function getRouteDebounced(waypoints, delay = 500) {
  return new Promise((resolve, reject) => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
      try {
        // Check cache first
        const cacheKey = waypoints
          .map(wp => `${wp.lat.toFixed(3)},${wp.lng.toFixed(3)}`)
          .join('|');

        const cached = routeCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          resolve(cached.data);
          return;
        }

        // Fetch new route
        const result = await getRoute(waypoints);

        // Cache result
        routeCache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        });

        // Trim cache if too large
        if (routeCache.size > 50) {
          const oldestKey = routeCache.keys().next().value;
          routeCache.delete(oldestKey);
        }

        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, delay);
  });
}

/**
 * Format distance for display
 * @param {number} meters - Distance in meters
 * @returns {string} Formatted distance
 */
export function formatDistance(meters) {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Format duration for display
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes} min`;
  }

  return `${hours}h ${minutes}min`;
}

/**
 * Get geocoding suggestion from Nominatim
 * @param {string} query - Search query
 * @returns {Promise<Array>} Suggestions
 */
export async function searchLocation(query) {
  if (!query || query.length < 2) {
    return [];
  }

  // Get app language for localized results
  let lang = 'fr'
  try { lang = (await import('../stores/state.js')).getState().lang || 'fr' } catch (e) { /* no-op */ }

  // Use featuretype=city to only get cities/towns (not streets, buildings etc.)
  // Results are sorted by "importance" by default (popular cities first)
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8&accept-language=${lang}&featuretype=settlement&addressdetails=1`;

  try {
    await waitForNominatimSlot()
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SpotHitch/2.0 (https://spothitch.com)',
        'Accept-Language': lang,
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim error: ${response.status}`);
    }

    const data = await response.json();

    // Sort by importance (highest first = most popular cities)
    data.sort((a, b) => (parseFloat(b.importance) || 0) - (parseFloat(a.importance) || 0))

    const results = data.map(item => {
      // Build a cleaner name: City, Country
      const addr = item.address || {}
      const city = addr.city || addr.town || addr.village || item.display_name.split(',')[0]
      const country = addr.country || ''
      const cleanName = country ? `${city}, ${country}` : city
      return {
        name: cleanName,
        fullName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type,
        class: item.class,
        countryCode: (addr.country_code || '').toUpperCase(),
        importance: parseFloat(item.importance) || 0,
      }
    });

    // Deduplicate: aggressively remove entries with same city name nearby
    const seen = new Set()
    return results.filter(r => {
      const cityName = r.name.split(',')[0].trim().toLowerCase()
      const coordKey = `${r.lat.toFixed(1)},${r.lng.toFixed(1)}`
      const key = `${cityName}|${coordKey}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }).slice(0, 5);
  } catch (error) {
    console.error('Geocoding failed:', error);
    return [];
  }
}

/**
 * Reverse geocoding - get address from coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Location info
 */
export async function reverseGeocode(lat, lng) {
  const lang = document.documentElement.lang || 'en'
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=${lang}`;

  try {
    await waitForNominatimSlot()
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SpotHitch/2.0 (https://spothitch.com)',
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim error: ${response.status}`);
    }

    const data = await response.json();

    return {
      name: data.display_name,
      city: data.address?.city || data.address?.town || data.address?.village,
      country: data.address?.country,
      countryCode: data.address?.country_code?.toUpperCase(),
    };
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return null;
  }
}

/**
 * Search cities with optional country filter
 * @param {string} query - Search query
 * @param {Object} options - Options
 * @param {string} [options.countryCode] - ISO country code to filter (e.g. 'FR')
 * @returns {Promise<Array>} City suggestions
 */
export async function searchCities(query, { countryCode } = {}) {
  if (!query || query.length < 2) return []

  let lang = 'fr'
  try { lang = (await import('../stores/state.js')).getState().lang || 'fr' } catch { /* no-op */ }

  let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8&accept-language=${lang}&featuretype=city&addressdetails=1`
  if (countryCode) {
    url += `&countrycodes=${countryCode.toLowerCase()}`
  }

  try {
    await waitForNominatimSlot()
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SpotHitch/2.0 (https://spothitch.com)',
        'Accept-Language': lang,
      },
    })

    if (!response.ok) throw new Error(`Nominatim error: ${response.status}`)

    const data = await response.json()
    data.sort((a, b) => (parseFloat(b.importance) || 0) - (parseFloat(a.importance) || 0))

    const results = data.map(item => {
      const addr = item.address || {}
      const city = addr.city || addr.town || addr.village || item.display_name.split(',')[0]
      const country = addr.country || ''
      const countryCodeResult = (addr.country_code || '').toUpperCase()
      return {
        name: city,
        fullName: country ? `${city}, ${country}` : city,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        countryCode: countryCodeResult,
        countryName: country,
        importance: parseFloat(item.importance) || 0,
      }
    })

    const seen = new Set()
    return results.filter(r => {
      const key = `${r.name.toLowerCase()}|${r.lat.toFixed(1)},${r.lng.toFixed(1)}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }).slice(0, 5)
  } catch (error) {
    console.error('City search failed:', error)
    return []
  }
}

/**
 * Search countries by name
 * @param {string} query - Country name query
 * @returns {Promise<Array>} Country suggestions
 */
export async function searchCountries(query) {
  if (!query || query.length < 2) return []

  let lang = 'fr'
  try { lang = (await import('../stores/state.js')).getState().lang || 'fr' } catch { /* no-op */ }

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=${lang}&featuretype=country&addressdetails=1`

  try {
    await waitForNominatimSlot()
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SpotHitch/2.0 (https://spothitch.com)',
        'Accept-Language': lang,
      },
    })

    if (!response.ok) throw new Error(`Nominatim error: ${response.status}`)

    const data = await response.json()
    return data.map(item => ({
      name: item.address?.country || item.display_name.split(',')[0],
      code: (item.address?.country_code || '').toUpperCase(),
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    })).filter(c => c.code)
  } catch (error) {
    console.error('Country search failed:', error)
    return []
  }
}

/**
 * Clear route cache
 */
export function clearCache() {
  routeCache.clear();
}

/**
 * Fast city search via Photon API (Komoot)
 * ~50-100ms response time vs ~300-500ms for Nominatim
 * @param {string} query - Search query
 * @param {Object} [options] - Options
 * @param {string} [options.countryCode] - Not supported by Photon, ignored
 * @returns {Promise<Array>} City suggestions
 */
// Cache for Photon results — avoids re-fetching same queries (e.g. typing backspace)
const _photonCache = new Map()
const PHOTON_CACHE_MAX = 50

// Resolve lang dynamically from document.documentElement.lang (updated by i18n)
function getPhotonLang() {
  return document.documentElement.lang || 'en'
}

// Parse Photon API response into normalized results
function _parsePhotonResponse(data) {
  if (!data?.features?.length) return []
  const placeTypes = new Set(['city', 'town', 'village', 'locality', 'district', 'borough'])
  return data.features
    .filter(f => placeTypes.has(f.properties.type))
    .map(f => {
      const p = f.properties
      return {
        name: p.name || '',
        fullName: p.country ? `${p.name}, ${p.country}` : p.name || '',
        lat: f.geometry?.coordinates?.[1] || 0,
        lng: f.geometry?.coordinates?.[0] || 0,
        countryCode: (p.countrycode || '').toUpperCase(),
        countryName: p.country || '',
        importance: p.importance || 0,
      }
    })
}

// Parse Nominatim API response into normalized results
function _parseNominatimResponse(data) {
  if (!data?.length) return []
  const seen = new Set()
  // Filter out state/country-level results — keep only city-level (place_rank >= 12)
  const cityLevel = new Set(['city', 'town', 'village', 'municipality', 'hamlet', 'suburb', 'borough', 'quarter', 'neighbourhood'])
  return data
    .filter(item => {
      // Keep results that are city-level: either addresstype is a city type or place_rank >= 12
      const at = item.addresstype || ''
      const pr = item.place_rank || 0
      return cityLevel.has(at) || pr >= 12
    })
    .map(item => {
      const addr = item.address || {}
      const city = addr.city || addr.town || addr.village || item.display_name.split(',')[0]
      const cc = (addr.country_code || '').toUpperCase()
      return {
        name: city,
        fullName: addr.country ? `${city}, ${addr.country}` : city,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        countryCode: cc,
        countryName: addr.country || '',
        importance: parseFloat(item.importance) || 0,
      }
    }).filter(r => {
      const key = `${r.name.toLowerCase()}|${r.countryCode}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

// Merge and deduplicate results from two sources
function _mergeResults(primary, secondary) {
  const merged = [...primary]
  const seenCoords = new Set(merged.map(r => `${r.lat.toFixed(0)},${r.lng.toFixed(0)}`))
  const seenNameCountry = new Set(merged.map(r => `${r.name.toLowerCase()}|${r.countryCode}`))
  for (const r of secondary) {
    const coordKey = `${r.lat.toFixed(0)},${r.lng.toFixed(0)}`
    const nameKey = `${r.name.toLowerCase()}|${r.countryCode}`
    if (!seenCoords.has(coordKey) && !seenNameCountry.has(nameKey)) {
      seenCoords.add(coordKey)
      seenNameCountry.add(nameKey)
      merged.push(r)
    }
  }
  merged.sort((a, b) => (b.importance || 0) - (a.importance || 0))
  return merged.slice(0, 5)
}

/**
 * Search cities — Photon + Nominatim in parallel, merged results.
 * Cached for instant repeat queries. Results sorted by importance.
 * @param {string} query
 * @param {Object} [options]
 * @returns {Promise<Array>} Merged and deduplicated results (max 5)
 */
export async function searchPhoton(query, { countryCode, biasLat, biasLng } = {}) {
  if (!query || query.length < 2) return []

  const lang = getPhotonLang()
  const biasKey = biasLat ? `|${biasLat.toFixed(1)},${biasLng.toFixed(1)}` : ''
  const cacheKey = `${query.toLowerCase()}|${lang}${biasKey}`
  if (_photonCache.has(cacheKey)) return _photonCache.get(cacheKey)

  // Add location bias to Photon if coordinates provided (e.g. from departure city)
  const biasSuffix = biasLat ? `&lat=${biasLat}&lon=${biasLng}` : ''
  const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=8&lang=${lang}${biasSuffix}`
  const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=${lang}&featuretype=city&addressdetails=1`

  try {
    // Abort after 5s to avoid "Searching..." staying visible forever
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 5000)
    // Fire both APIs in parallel — Photon (~100ms) + Nominatim (~800ms)
    const [photonRes, nominatimRes] = await Promise.allSettled([
      fetch(photonUrl, { signal: ctrl.signal }).then(r => r.ok ? r.json() : null),
      fetch(nominatimUrl, {
        headers: { 'User-Agent': 'SpotHitch/2.0 (https://spothitch.com)' },
        signal: ctrl.signal,
      }).then(r => r.ok ? r.json() : null),
    ])
    clearTimeout(timer)

    const photonResults = photonRes.status === 'fulfilled' ? _parsePhotonResponse(photonRes.value) : []
    const nominatimResults = nominatimRes.status === 'fulfilled' ? _parseNominatimResponse(nominatimRes.value) : []

    // Merge: Nominatim first (better ranking), Photon extras
    const final = _mergeResults(nominatimResults, photonResults)

    // Cache
    if (_photonCache.size >= PHOTON_CACHE_MAX) {
      _photonCache.delete(_photonCache.keys().next().value)
    }
    _photonCache.set(cacheKey, final)
    return final
  } catch {
    return searchCities(query, { countryCode })
  }
}

export default {
  getRoute,
  getRouteDebounced,
  formatDistance,
  formatDuration,
  searchLocation,
  searchCities,
  searchCountries,
  searchPhoton,
  reverseGeocode,
  clearCache,
};
