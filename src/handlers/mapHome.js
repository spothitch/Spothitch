/**
 * Home Map Handlers
 * Search, navigation, zoom, legend for the home map view
 */

import { escapeHTML, escapeJSString } from '../utils/sanitize.js'

// Country code (ISO 2-letter) to flag emoji
function countryCodeToFlag(cc) {
  if (!cc || cc.length !== 2 || !/^[A-Za-z]{2}$/.test(cc)) return ''
  return String.fromCodePoint(...[...cc.toUpperCase()].map(c => 0x1F1A5 + c.charCodeAt(0)))
}

// Validate coordinates are finite numbers within Earth bounds
function isValidCoord(lat, lng) {
  return isFinite(lat) && isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
}

// Home search with debounce — search a place, show city panel option, center map
let homeDestDebounce = null

function _buildSuggestionHTML(results) {
  const t = window.t || ((k) => k)
  if (!results?.length) return ''

  // Build places list (left column)
  const places = results.filter(r => isValidCoord(Number(r.lat), Number(r.lng))).map((r, i) => {
    const shortName = escapeHTML(r.fullName || r.name || '')
    const cityName = escapeHTML(r.name || '')
    const countryName = escapeHTML(r.countryName || '')
    const cc = (r.countryCode || '').toUpperCase()
    return `<button onclick="homeSelectPlace(${Number(r.lat)}, ${Number(r.lng)}, '${escapeJSString(shortName)}')"
      class="w-full px-3 py-2.5 text-left hover:bg-white/10 transition-colors" data-home-suggestion="${i}">
      <div class="flex items-center gap-2">
        ${cc ? `<span class="text-sm flex-shrink-0">${countryCodeToFlag(cc)}</span>` : ''}
        <div class="min-w-0"><span class="font-medium text-sm text-white truncate block">${cityName}</span>
        ${countryName ? `<span class="text-[10px] text-slate-400">${countryName}</span>` : ''}</div>
      </div></button>`
  }).join('')

  // Build guides list (right column, deduplicated by country)
  const seen = new Set()
  const guides = results.filter(r => {
    const cc = (r.countryCode || '').toUpperCase()
    if (!cc || seen.has(cc)) return false
    seen.add(cc)
    return true
  }).slice(0, 4).map(r => {
    const cityName = escapeHTML(r.name || '')
    const cc = (r.countryCode || '').toUpperCase()
    const countryName = escapeHTML(r.countryName || '')
    const slug = cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return `<button onclick="openCityPanel('${slug}', '${escapeJSString(cityName)}', ${Number(r.lat)}, ${Number(r.lng)}, '${cc}', '${escapeJSString(countryName)}')"
      class="w-full px-3 py-2.5 text-left hover:bg-primary-500/10 transition-colors">
      <div class="font-medium text-sm text-primary-400 truncate">${t('hitchhikingGuide') || 'Guide'}: ${cityName}</div>
      <div class="text-[10px] text-slate-500">${countryName}</div>
    </button>`
  }).join('')

  return `
    <div class="bg-dark-secondary/95 backdrop-blur rounded-xl border border-white/10 overflow-hidden shadow-xl">
      <div class="flex">
        <div class="flex-1" style="border-right:1px solid rgba(255,255,255,0.08)">
          <div class="px-3 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider" style="background:rgba(255,255,255,0.03)">📍 ${t('places') || 'Lieux'}</div>
          ${places}
        </div>
        <div class="flex-1" style="background:rgba(245,158,11,0.03)">
          <div class="px-3 py-1.5 text-[10px] font-semibold text-primary-400 uppercase tracking-wider" style="background:rgba(245,158,11,0.08)">📖 ${t('guides') || 'Guides'}</div>
          ${guides || `<div class="px-3 py-3 text-xs text-slate-500">${t('noGuides') || 'Aucun guide'}</div>`}
        </div>
      </div>
    </div>`
}

let _searchRequestId = 0
window.homeSearchDestination = (query) => {
  const t = window.t || ((k) => k)
  clearTimeout(homeDestDebounce)
  // Desktop: side panel suggestions; Mobile: floating suggestions
  const container = document.getElementById('side-panel-suggestions') || document.getElementById('home-dest-suggestions')
  if (!container) return
  if (!query || query.trim().length < 2) {
    container.classList.add('hidden')
    return
  }
  const requestId = ++_searchRequestId
  homeDestDebounce = setTimeout(async () => {
    // Show loading indicator
    container.classList.remove('hidden')
    container.innerHTML = `<div class="bg-dark-secondary/95 backdrop-blur rounded-xl border border-white/10 px-4 py-3 shadow-xl">
      <div class="flex items-center gap-2 text-slate-400 text-sm">
        <span class="animate-spin">⏳</span> ${t('searching') || 'Recherche...'}
      </div>
    </div>`
    try {
      // Search: Photon + Nominatim in parallel (~1s total)
      // Bias toward user location if GPS is available
      const { searchPhoton } = await import('../services/osrm.js')
      const userLoc = window.getState().userLocation
      const results = await searchPhoton(query, {
        biasLat: userLoc?.lat || null,
        biasLng: userLoc?.lng || null,
      })
      // Discard stale results (user typed more or started new search)
      if (requestId !== _searchRequestId) return
      const currentInput = document.getElementById('home-destination')
      if (currentInput && currentInput.value.trim() !== query.trim()) return
      if (results?.length > 0) {
        container.classList.remove('hidden')
        container.innerHTML = _buildSuggestionHTML(results)
      } else {
        container.classList.add('hidden')
      }
    } catch (e) {
      container.classList.add('hidden')
      // Show toast if network error (not just empty results)
      if (e?.message?.includes('fetch') || e?.message?.includes('network') || !navigator.onLine) {
        window.showToast?.(t('searchFailed') || 'Recherche indisponible, vérifie ta connexion', 'warning')
      }
    }
  }, 100)
}

window.homeSelectFirstSuggestion = () => {
  const btn = document.querySelector('[data-home-suggestion="0"]')
  if (btn) btn.click()
}

// Select a place → center map there + actively load spots for the area
let _selectPlaceRequestId = 0
window.homeSelectPlace = async (lat, lng, name) => {
  // Validate coordinates
  if (!isValidCoord(lat, lng)) return

  const requestId = ++_selectPlaceRequestId
  const input = document.getElementById('side-panel-destination') || document.getElementById('home-destination')
  if (input) input.value = name
  document.getElementById('side-panel-suggestions')?.classList.add('hidden')
  document.getElementById('home-dest-suggestions')?.classList.add('hidden')
  window.setState({ homeSearchLabel: name })

  if (window.homeMapInstance) {
    // Use current zoom if already zoomed in more than 12, otherwise default to 12
    const currentZoom = window.homeMapInstance.getZoom?.() || 5
    const targetZoom = Math.max(12, currentZoom)
    try { window.homeMapInstance.setView([lat, lng], targetZoom) } catch { /* */ }
  }

  // Actively load spots for the searched area (cancel if newer request started)
  try {
    const { loadSpotsInRadius } = await import('../services/spotLoader.js')
    await loadSpotsInRadius(lat, lng, 50)
    if (requestId !== _selectPlaceRequestId) return // stale request
    if (window._refreshMapSpots) window._refreshMapSpots()
    if (window._refreshCountryBubbles) window._refreshCountryBubbles()
  } catch { /* spots will load via moveend fallback */ }
}

window.homeClearSearch = () => {
  window.setState({ homeSearchLabel: '' })
  const input = document.getElementById('home-destination')
  if (input) input.value = ''
}

// Keep old handler names as aliases (for compatibility)
window.homeSelectDestination = window.homeSelectPlace
window.homeClearDestination = window.homeClearSearch

window.homeCenterOnUser = () => {
  const t = window.t || ((k) => k)
  const { userLocation } = window.getState()
  if (userLocation && window.homeMapInstance) {
    window.homeMapInstance.setView([userLocation.lat, userLocation.lng], 13)
  } else if (navigator.geolocation) {
    // Request GPS permission and center when available
    const { actions } = window._appInternals || {}
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        if (actions) actions.setUserLocation(loc)
        if (window.homeMapInstance) {
          window.homeMapInstance.setView([loc.lat, loc.lng], 13)
        }
      },
      () => {
        window.showToast(t('gpsUnavailable') || 'GPS non disponible', 'warning')
      },
      { timeout: 10000, enableHighAccuracy: true }
    )
  }
}

window.homeZoomIn = () => {
  if (window.homeMapInstance) window.homeMapInstance.zoomIn()
}

window.homeZoomOut = () => {
  if (window.homeMapInstance) window.homeMapInstance.zoomOut()
}

window.toggleMapLegend = () => {
  const current = window.getState?.()?.showMapLegend || false
  window.setState({ showMapLegend: !current })
}

// Render/update legend overlay inside #home-map (called from ensureMapControls)
window._ensureLegendOverlay = (show) => {
  const existing = document.getElementById('map-legend-overlay')
  if (!show) {
    if (existing) existing.remove()
    return
  }
  if (existing) return // already visible
  const mapEl = document.getElementById('home-map')
  if (!mapEl) return
  const t = window.t || ((k) => k)
  import('../utils/mapMarkers.js').then(({ buildLegendHTML }) => {
    // Check again after async import
    if (document.getElementById('map-legend-overlay')) return
    const overlay = document.createElement('div')
    overlay.id = 'map-legend-overlay'
    overlay.className = 'map-legend-overlay'
    overlay.innerHTML = buildLegendHTML(t)
    mapEl.appendChild(overlay)
  })
}
