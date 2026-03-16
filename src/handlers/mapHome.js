/**
 * Home Map Handlers
 * Search, navigation, zoom, legend for the home map view
 */

import { escapeHTML, escapeJSString } from '../utils/sanitize.js'

// Country code (ISO 2-letter) to flag emoji
function countryCodeToFlag(cc) {
  if (!cc || cc.length !== 2) return ''
  return String.fromCodePoint(...[...cc.toUpperCase()].map(c => 0x1F1A5 + c.charCodeAt(0)))
}

// Home search with debounce — search a place, show city panel option, center map
let homeDestDebounce = null

function _buildSuggestionHTML(results) {
  const t = window.t || ((k) => k)
  if (!results?.length) return ''
  return `
    <div class="bg-dark-secondary/95 backdrop-blur rounded-xl border border-white/10 overflow-hidden shadow-xl">
      ${results.map((r, i) => {
        const shortName = escapeHTML(r.fullName || r.name || '')
        const cityName = escapeHTML(r.name || '')
        const countryName = escapeHTML(r.countryName || '')
        const cc = (r.countryCode || '').toUpperCase()
        const slug = cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        return `
        <div class="border-b border-white/5 last:border-0">
          <button
            onclick="homeSelectPlace(${Number(r.lat)}, ${Number(r.lng)}, '${escapeJSString(shortName)}')"
            class="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors"
            data-home-suggestion="${i}"
          >
            <div class="flex items-center gap-2">
              ${cc ? `<span class="text-base flex-shrink-0">${countryCodeToFlag(cc)}</span>` : ''}
              <div class="min-w-0">
                <span class="font-medium text-sm truncate block">${cityName}</span>
                ${countryName ? `<span class="text-xs text-slate-400">${countryName}</span>` : ''}
              </div>
            </div>
          </button>
          <button
            onclick="openCityPanel('${slug}', '${escapeJSString(cityName)}', ${Number(r.lat)}, ${Number(r.lng)}, '${cc}', '${escapeJSString(countryName)}')"
            class="w-full px-4 py-2 text-left text-primary-400 hover:bg-primary-500/10 transition-colors text-xs font-medium border-t border-white/5"
          >
            📍 ${t('hitchhikingFrom') || 'Hitchhiking from'} ${cityName}
          </button>
        </div>`
      }).join('')}
    </div>
  `
}

window.homeSearchDestination = (query) => {
  const t = window.t || ((k) => k)
  clearTimeout(homeDestDebounce)
  const container = document.getElementById('home-dest-suggestions')
  if (!container) return
  if (!query || query.trim().length < 2) {
    container.classList.add('hidden')
    return
  }
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
      // Check input still matches (user may have typed more)
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
    }
  }, 100)
}

window.homeSelectFirstSuggestion = () => {
  const btn = document.querySelector('[data-home-suggestion="0"]')
  if (btn) btn.click()
}

// Select a place → center map there + actively load spots for the area
window.homeSelectPlace = async (lat, lng, name) => {
  const input = document.getElementById('home-destination')
  if (input) input.value = name
  document.getElementById('home-dest-suggestions')?.classList.add('hidden')
  window.setState({ homeSearchLabel: name })

  if (window.homeMapInstance) {
    window.homeMapInstance.setView([lat, lng], 12)
  }

  // Actively load spots for the searched area (don't rely solely on moveend)
  try {
    const { loadSpotsInRadius } = await import('../services/spotLoader.js')
    await loadSpotsInRadius(lat, lng, 50)
    // Trigger map refresh to show loaded spots
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
  const t = window.t || ((k) => k)
  const existing = document.getElementById('map-legend-overlay')
  if (existing) {
    existing.remove()
    return
  }
  const mapEl = document.getElementById('home-map')
  if (!mapEl) return
  import('../utils/mapMarkers.js').then(({ buildLegendHTML }) => {
    const overlay = document.createElement('div')
    overlay.id = 'map-legend-overlay'
    overlay.className = 'map-legend-overlay'
    overlay.innerHTML = buildLegendHTML(t)
    mapEl.appendChild(overlay)
  })
}
