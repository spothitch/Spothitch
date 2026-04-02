/**
 * Gas Stations Service
 * Fetches fuel stations along a route using Overpass API (OpenStreetMap)
 * Results cached in IndexedDB (7-day TTL, grid-based keys at 0.1° resolution)
 */

import { getState, setState } from '../stores/state.js'
import { icon } from '../utils/icons.js'
import { t } from '../i18n/index.js'
import { cacheGet, cacheSet } from '../utils/idb.js'
import { haversineKm } from '../utils/geo.js'

const OVERPASS_APIS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
]
const STATION_CACHE_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days

/**
 * Build a cache key from bounds (rounded to 0.1° grid)
 */
function stationCacheKey(south, west, north, east) {
  const r = (v) => Math.round(v * 10) / 10
  return `stations_${r(south)}_${r(west)}_${r(north)}_${r(east)}`
}

/**
 * Fetch gas stations along a route geometry
 * @param {Array} routeCoords - Array of [lng, lat] from OSRM
 * @param {number} bufferKm - Search buffer in km (default 2km)
 * @returns {Array} Array of {lat, lng, name, brand}
 */
export async function fetchGasStationsAlongRoute(routeCoords, bufferKm = 2) {
  if (!routeCoords || routeCoords.length < 2) return []

  // Sample every ~20 points to build a reasonable bounding polygon
  const step = Math.max(1, Math.floor(routeCoords.length / 20))
  const sampled = []
  for (let i = 0; i < routeCoords.length; i += step) {
    sampled.push(routeCoords[i])
  }
  // Always include last point
  if (sampled[sampled.length - 1] !== routeCoords[routeCoords.length - 1]) {
    sampled.push(routeCoords[routeCoords.length - 1])
  }

  // Build bounding box from sampled points
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity
  sampled.forEach(([lng, lat]) => {
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
    if (lng < minLng) minLng = lng
    if (lng > maxLng) maxLng = lng
  })

  // Expand bbox by buffer
  const bufferDeg = bufferKm / 111 // ~111km per degree
  minLat -= bufferDeg
  maxLat += bufferDeg
  minLng -= bufferDeg
  maxLng += bufferDeg

  // Check IDB cache for route stations
  const routeKey = stationCacheKey(minLat, minLng, maxLat, maxLng)
  try {
    const cached = await cacheGet(routeKey)
    if (cached) return cached
  } catch { /* IDB unavailable */ }

  // Overpass query for fuel stations in bbox
  const query = `[out:json][timeout:10];
    (
      node["amenity"="fuel"](${minLat},${minLng},${maxLat},${maxLng});
      way["amenity"="fuel"](${minLat},${minLng},${maxLat},${maxLng});
    );
    out center body;`

  try {
    let data = null
    for (const api of OVERPASS_APIS) {
      try {
        const ctrl = new AbortController()
        const timer = setTimeout(() => ctrl.abort(), 8000)
        const response = await fetch(api, {
          method: 'POST',
          body: `data=${encodeURIComponent(query)}`,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          signal: ctrl.signal,
        })
        clearTimeout(timer)
        if (response.ok) { data = await response.json(); break }
      } catch { /* try next */ }
    }
    if (!data) return []

    // Filter stations that are actually near the route (within bufferKm)
    const stations = (data.elements || [])
      .filter(el => (el.lat && el.lon) || (el.center?.lat && el.center?.lon))
      .map(el => ({
        id: el.id,
        lat: el.lat || el.center?.lat,
        lng: el.lon || el.center?.lon,
        name: el.tags?.name || el.tags?.brand || t('gasStation') || 'Station-service',
        brand: el.tags?.brand || '',
        fuel_types: el.tags?.['fuel:diesel'] === 'yes' ? 'Diesel' : '',
        opening_hours: el.tags?.opening_hours || '',
      }))
      .filter(station => isNearRoute(station, routeCoords, bufferKm))

    // Cache route stations (7 days)
    try { await cacheSet(routeKey, stations, STATION_CACHE_TTL) } catch { /* optional */ }

    return stations
  } catch (error) {
    // Silently fail — gas stations are a nice-to-have
    return []
  }
}

/**
 * Check if a point is near a route (simplified — checks distance to nearest route segment)
 */
function isNearRoute(point, routeCoords, maxDistKm) {
  const step = Math.max(1, Math.floor(routeCoords.length / 50))
  for (let i = 0; i < routeCoords.length; i += step) {
    const [lng, lat] = routeCoords[i]
    const dist = haversineKm(point.lat, point.lng, lat, lng)
    if (dist <= maxDistKm) return true
  }
  return false
}

/**
 * Haversine distance — imported from utils/geo.js
 */

/**
 * Fetch gas stations in map viewport
 * Cached in IDB with 7-day TTL on a 0.1° grid
 * @param {Object} bounds - { north, south, east, west }
 * @returns {Promise<Array>} stations
 */
export async function fetchGasStationsInBounds(bounds) {
  if (!bounds) return []

  // Check IDB cache first
  const key = stationCacheKey(bounds.south, bounds.west, bounds.north, bounds.east)
  try {
    const cached = await cacheGet(key)
    if (cached) return cached
  } catch { /* IDB unavailable */ }

  const query = `[out:json][timeout:10];
    (
      node["amenity"="fuel"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      way["amenity"="fuel"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
    );
    out center body;`

  try {
    // Try each Overpass server (fallback if first one fails/timeouts)
    let data = null
    for (const api of OVERPASS_APIS) {
      try {
        const ctrl = new AbortController()
        const timer = setTimeout(() => ctrl.abort(), 8000)
        const response = await fetch(api, {
          method: 'POST',
          body: `data=${encodeURIComponent(query)}`,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          signal: ctrl.signal,
        })
        clearTimeout(timer)
        if (response.ok) {
          data = await response.json()
          break
        }
      } catch { /* try next server */ }
    }

    if (!data) {
      // All servers failed — try expired cache
      try {
        const expired = await cacheGet(key)
        if (expired) return expired
      } catch { /* no fallback */ }
      return []
    }

    const stations = (data.elements || [])
      .filter(el => (el.lat && el.lon) || (el.center?.lat && el.center?.lon))
      .map(el => ({
        id: el.id,
        lat: el.lat || el.center?.lat,
        lng: el.lon || el.center?.lon,
        name: el.tags?.name || el.tags?.brand || t('gasStation') || 'Station-service',
        brand: el.tags?.brand || '',
      }))

    // Save to IDB cache (7 days)
    try { await cacheSet(key, stations, STATION_CACHE_TTL) } catch { /* optional */ }

    return stations
  } catch {
    // Offline: try IDB cache even if expired
    try {
      const { get } = await import('../utils/idb.js')
      const item = await get('cache', key)
      if (item?.data) return item.data
    } catch { /* no fallback */ }
    return []
  }
}

/**
 * Toggle gas stations visibility on map
 */
export function toggleGasStations() {
  const state = getState()
  const show = !state.showGasStationsOnMap
  setState({ showGasStationsOnMap: show })

  if (show) {
    loadGasStations()
  } else {
    hideGasStationMarkers()
    setState({ gasStations: [] })
  }
}

/**
 * Load and display gas stations on the map (called by toggle AND on map init)
 */
export function loadGasStations() {
  const map = window.homeMapInstance
  if (!map) {
    setState({ showGasStationsOnMap: false })
    return
  }

  // Check zoom level — require zoom >= 8 for manageable results
  const zoom = map.getZoom?.() || 0
  if (zoom < 8) {
    // Auto-zoom to level 10 centered on current view
    try {
      const center = map.getCenter?.()
      if (center) {
        map.flyTo?.({ center: [center.lng, center.lat], zoom: 10, duration: 800 })
        // Retry after zoom animation (loadGasStations, NOT toggle — avoids double-flip)
        setTimeout(() => loadGasStations(), 1000)
        return
      }
    } catch { /* fallback: just show message */ }
    import('../services/notifications.js').then(n => n.showToast(
      t('zoomInForStations') || 'Zoome sur une zone pour voir les stations',
      'info'
    ))
    setState({ showGasStationsOnMap: false })
    return
  }

  // Show loading feedback
  import('../services/notifications.js').then(n => n.showToast(
    t('loadingStations') || 'Chargement des stations...',
    'info'
  ))

  const bounds = map.getBounds?.()
  if (bounds) {
    const ne = bounds.getNorthEast()
    const sw = bounds.getSouthWest()
    fetchGasStationsInBounds({
      north: ne.lat,
      south: sw.lat,
      east: ne.lng,
      west: sw.lng,
    }).then(stations => {
      setState({ gasStations: stations })
      showGasStationMarkers(stations)
      if (stations.length === 0) {
        import('../services/notifications.js').then(n => n.showToast(
          t('noStationsFound') || 'Aucune station trouvée, zoome plus',
          'info'
        ))
      }
    }).catch(() => {
      import('../services/notifications.js').then(n => n.showToast(
        t('stationsError') || 'Erreur de chargement des stations',
        'error'
      ))
      setState({ showGasStationsOnMap: false })
    })
  }
}

/**
 * Show gas station markers on the home map
 */
function showGasStationMarkers(stations) {
  const map = window.homeMapInstance
  if (!map || !stations?.length) return

  // Remove existing gas station layer
  if (map.getLayer('gas-stations')) map.removeLayer('gas-stations')
  if (map.getSource('gas-stations')) map.removeSource('gas-stations')

  const features = stations.map(s => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
    properties: { name: s.name, brand: s.brand },
  }))

  map.addSource('gas-stations', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features },
  })

  map.addLayer({
    id: 'gas-stations',
    type: 'circle',
    source: 'gas-stations',
    paint: {
      'circle-color': '#ef4444',
      'circle-radius': 6,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-width': 2,
      'circle-opacity': 0.9,
    },
  })

  // Click handler for gas station → propose creating a spot
  map.on('click', 'gas-stations', (e) => {
    if (!e.features?.length) return
    const coords = e.features[0].geometry.coordinates
    const lngLat = { lng: coords[0], lat: coords[1] }
    import('maplibre-gl').then((mod) => {
      const maplibregl = mod.default || mod
      const label = t('createSpotStation') || 'Créer un spot station'
      const popup = new maplibregl.Popup({ offset: 10, closeButton: false, className: 'create-spot-popup' })
        .setLngLat(coords)
        .setHTML(`<button onclick="this.closest('.maplibregl-popup').remove();window._createSpotFromBubble(${lngLat.lat},${lngLat.lng},'gas_station')" style="display:flex;align-items:center;gap:6px;padding:8px 14px;background:#f59e0b;color:#0f172a;border:none;border-radius:20px;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap">${icon("fuel", "w-4 h-4 inline")}${label}</button>`)
        .addTo(map)
      setTimeout(() => { try { popup.remove() } catch { /* already removed */ } }, 4000)
    })
  })
  map.on('mouseenter', 'gas-stations', () => { map.getCanvas().style.cursor = 'pointer' })
  map.on('mouseleave', 'gas-stations', () => { map.getCanvas().style.cursor = '' })
}

/**
 * Hide gas station markers from map
 */
function hideGasStationMarkers() {
  const map = window.homeMapInstance
  if (!map) return
  if (map.getLayer('gas-stations')) map.removeLayer('gas-stations')
  if (map.getSource('gas-stations')) map.removeSource('gas-stations')
}

// ==================== OFFLINE COUNTRY STATIONS ====================

const STATION_OFFLINE_TTL = 30 * 24 * 60 * 60 * 1000 // 30 days

/**
 * Download all fuel stations for a country via Overpass API
 * Stores lightweight data (GPS + name + brand) in IDB cache
 * For large countries (>200K km²), splits into sub-regions to avoid Overpass timeout
 *
 * @param {string} code - Country code
 * @param {Function} [onProgress] - Progress callback (0-100)
 * @returns {Promise<{ stations: Array, count: number }>}
 */
export async function downloadCountryStations(code, onProgress) {
  const { getCountryBoundsBuffered } = await import('../data/countryBounds.js')
  const countryCode = code.toUpperCase()
  const bounds = getCountryBoundsBuffered(countryCode, 0)
  if (!bounds) throw new Error(`No bounds for ${countryCode}`)

  // Estimate area to decide if we need to split
  const latRange = bounds.north - bounds.south
  const lngRange = bounds.east - bounds.west
  const approxArea = latRange * lngRange * 111 * 111 // rough km²

  let allStations = []

  if (approxArea > 200000) {
    // Split into sub-regions (grid)
    const latStep = Math.max(5, latRange / 4)
    const lngStep = Math.max(5, lngRange / 4)
    const subRegions = []
    for (let lat = bounds.south; lat < bounds.north; lat += latStep) {
      for (let lng = bounds.west; lng < bounds.east; lng += lngStep) {
        subRegions.push({
          south: lat,
          west: lng,
          north: Math.min(lat + latStep, bounds.north),
          east: Math.min(lng + lngStep, bounds.east),
        })
      }
    }

    for (let i = 0; i < subRegions.length; i++) {
      try {
        const regionStations = await fetchStationsInBounds(subRegions[i])
        allStations.push(...regionStations)
        // Rate limit: Overpass allows ~2 requests per 10s
        if (i < subRegions.length - 1) {
          await new Promise(r => setTimeout(r, 2000))
        }
      } catch { /* skip failed sub-region */ }
      if (onProgress) onProgress(Math.round(((i + 1) / subRegions.length) * 100))
    }
  } else {
    // Single query for small countries
    if (onProgress) onProgress(20)
    allStations = await fetchStationsInBounds(bounds)
    if (onProgress) onProgress(90)
  }

  // Deduplicate by id
  const seen = new Set()
  const unique = allStations.filter(s => {
    if (seen.has(s.id)) return false
    seen.add(s.id)
    return true
  })

  // Save to IDB with 30-day TTL
  const cacheKey = `stations_${countryCode}`
  try {
    await cacheSet(cacheKey, unique, STATION_OFFLINE_TTL)
  } catch (e) {
    console.warn('[GasStations] Failed to cache stations:', e)
  }

  if (onProgress) onProgress(100)
  return { stations: unique, count: unique.length }
}

/**
 * Fetch stations in a bounding box (internal helper)
 */
async function fetchStationsInBounds(bounds) {
  const query = `[out:json][timeout:25];
    node["amenity"="fuel"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
    out body;`

  let response = null
  for (const api of OVERPASS_APIS) {
    try {
      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), 15000)
      response = await fetch(api, {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal: ctrl.signal,
      })
      clearTimeout(timer)
      if (response.ok) break
    } catch { /* try next */ }
  }
  if (!response?.ok) throw new Error('All Overpass servers failed')
  const data = await response.json()

  return (data.elements || [])
    .filter(el => el.lat && el.lon)
    .map(el => ({
      id: el.id,
      lat: el.lat,
      lng: el.lon,
      name: el.tags?.name || el.tags?.brand || '',
      brand: el.tags?.brand || '',
    }))
}

/**
 * Get offline-cached stations for a country
 * @param {string} code - Country code
 * @returns {Promise<Array|null>}
 */
export async function getOfflineStations(code) {
  return cacheGet(`stations_${code.toUpperCase()}`)
}

/**
 * Delete offline stations for a country
 * @param {string} code - Country code
 */
export async function deleteOfflineStations(code) {
  const { remove } = await import('../utils/idb.js')
  await remove('cache', `stations_${code.toUpperCase()}`)
}

// Global handlers
window.toggleGasStations = toggleGasStations

export default {
  fetchGasStationsAlongRoute,
  fetchGasStationsInBounds,
  toggleGasStations,
  downloadCountryStations,
  getOfflineStations,
  deleteOfflineStations,
}
