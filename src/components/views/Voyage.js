/**
 * Voyage View Component
 * 3 sub-tabs: Voyage (planifier + radar en route) | Guides | Journal
 */

import { t } from '../../i18n/index.js'
import { icon } from '../../utils/icons.js'
import { renderEmptyState } from '../EmptyState.js'
// toggle imports removed — no longer needed after Journal refactor
// Use the full Guides.js component (6 sections with vote/suggest)
import { renderGuides } from './Guides.js'
import { safeSetItem } from '../../utils/storage.js'
import { haversineKm } from '../../utils/geo.js'
import { escapeHTML, escapeJSString } from '../../utils/sanitize.js'
import { applyTripFilter, countByFilter } from '../../utils/tripFilters.js'

// Load Travel.js handlers (calculateTrip, syncTripFieldsAndCalculate, swapTripPoints, etc.)
// Travel.js defines the window.* handlers that the trip form buttons call
const _travelReady = import('./Travel.js')

// Bridge stubs: if user clicks before Travel.js loads, wait for it then delegate
if (!window.syncTripFieldsAndCalculate) {
 window.syncTripFieldsAndCalculate = async () => {
 await _travelReady
 window.syncTripFieldsAndCalculate?.()
 }
}
if (!window.calculateTrip) {
 window.calculateTrip = async () => {
 await _travelReady
 window.calculateTrip?.()
 }
}
if (!window.swapTripPoints) {
 window.swapTripPoints = () => {
 // Swap DOM values directly (no async needed)
 const fromInput = document.getElementById('trip-from')
 const toInput = document.getElementById('trip-to')
 const newFrom = toInput?.value || ''
 const newTo = fromInput?.value || ''
 if (fromInput) fromInput.value = newFrom
 if (toInput) toInput.value = newTo
 }
}
// Bridge stubs for handlers defined in Travel.js (lazy-loaded)
if (!window.setRouteFilter) {
 window.setRouteFilter = async (filter) => {
 await _travelReady
 window.setRouteFilter?.(filter)
 }
}
if (!window.clearTripResults) {
 window.clearTripResults = async () => {
 await _travelReady
 window.clearTripResults?.()
 }
}
if (!window.centerTripMapOnGps) {
 window.centerTripMapOnGps = async () => {
 await _travelReady
 window.centerTripMapOnGps?.()
 }
}
if (!window.saveTripWithSpots) {
 window.saveTripWithSpots = async () => {
 await _travelReady
 window.saveTripWithSpots?.()
 }
}

const SAVED_TRIPS_KEY = 'spothitch_saved_trips'
const ACTIVE_TRIP_KEY = 'spothitch_active_trip'
const FAVORITES_KEY = 'spothitch_favorites'

function formatRelativeDate(isoStr) {
 try {
 const diff = Date.now() - new Date(isoStr).getTime()
 const mins = Math.floor(diff / 60000)
 if (mins < 60) return t('justNow') || "à l'instant"
 const hours = Math.floor(mins / 60)
 if (hours < 24) return `${hours}h`
 const days = Math.floor(hours / 24)
 if (days < 7) return `${days}j`
 if (days < 30) return `${Math.floor(days / 7)}sem`
 return new Date(isoStr).toLocaleDateString()
 } catch { return '' }
}

// ==================== MAIN RENDER ====================

export function renderVoyage(state) {
 // Trip planner hidden during alpha — default to guides
 const subTab = state.voyageSubTab === 'voyage' ? 'guides' : (state.voyageSubTab || 'guides')

 return `
 <div class="flex flex-col min-h-[calc(100vh-140px)] pb-28 overflow-x-hidden">
 ${renderVoyageSubTabs(subTab)}
 <div class="flex-1 p-4 space-y-4">
 ${subTab === 'guides' ? renderVoyageGuidesTab(state) : ''}
 ${subTab === 'journal' ? renderJournalTab(state) : ''}
 </div></div>
 `
}

// ==================== SUB-TABS BAR ====================

function renderVoyageSubTabs(active) {
 // Trip planner (voyage/itinéraire) hidden during alpha
 const tabs = [
 { id: 'guides', icon: 'book-open', label: t('voyageTabGuides') || 'Guides' },
 { id: 'journal', icon: 'notebook-pen', label: t('voyageTabJournal') || 'Journal' },
 ]
 return `
 <div class="flex gap-2 p-1.5 bg-dark-secondary rounded-xl mx-4 mt-2">
 ${tabs.map(tab => `
 <button
 onclick="setVoyageSubTab('${tab.id}')"
 class="flex-1 py-2.5 px-2 rounded-xl font-medium text-xs transition-colors relative flex items-center justify-center gap-1.5 ${
 active === tab.id
 ? 'bg-primary-500 text-white'
 : 'text-slate-400 hover:text-white hover:bg-white/5'
 }"
 aria-selected="${active === tab.id}"
 >
 ${icon(tab.icon, 'w-4 h-4')}
 <span>${tab.label}</span>
 ${tab.dot ? `<span class="absolute top-1.5 right-[22%] w-2 h-2 bg-emerald-500 rounded-full border border-dark-primary"></span>` : ''}
 </button>
 `).join('')}
 </div>
 `
}

// ==================== TAB 1: VOYAGE (planifier + radar) — hidden during alpha ====================

// eslint-disable-next-line no-unused-vars
function renderVoyageTab(state, activeTrip) {
 if (activeTrip) {
 return renderEnRouteRadar(state, activeTrip)
 }

 // Map-first view when trip results exist
 if (state.tripResults && state.tripFormCollapsed) {
 return renderMapFirstView(state)
 }

 return `
 <div class="space-y-4">
 ${renderTripForm(state)}
 ${state.tripResults ? renderTripResultsSummary(state) : ''}
 ${!state.tripResults ? renderSavedTripsPreview(state) : ''}
 </div>
 `
}

// ==================== MAP-FIRST VIEW (carte plein ecran + bottom sheet) ====================

function renderMapFirstView(state) {
 const results = state.tripResults
 const allSpots = results.spots || []
 const removedSet = new Set((state.tripRemovedSpots || []).map(String))
 const visibleSpots = allSpots.filter(s => !removedSet.has(String(s.id)))
 const routeFilter = state.routeFilter
 const favSet = getFavoritesSet()
 const filteredSpots = applyTripFilter(visibleSpots, routeFilter)
 const counts = countByFilter(visibleSpots)
 const sheetState = state.tripBottomSheetState || 'collapsed'
 const showGas = state.tripShowGasStations || false

 // Bottom sheet heights (account for nav bar at bottom = 76px)
 const sheetHeights = { collapsed: '80px', half: 'calc(50vh - 38px)', full: 'calc(85vh - 76px)' }
 const sheetHeight = sheetHeights[sheetState] || '80px'

 return `
 <div class="relative h-dvh m-0 p-0">
 <!-- MAP (fills entire space) — wrapper handles absolute positioning so MapLibre can't override it -->
 <div class="absolute inset-0 z-0 overflow-hidden">
 <div id="trip-map" class="w-full h-full"></div></div>

 <!-- COLLAPSED FORM BAR (top) — matches mockup top-bar -->
 <div class="absolute top-0 left-0 right-0 z-30 pt-[env(safe-area-inset-top,0)]">
 <div class="flex items-center justify-between px-4 py-2 bg-dark-secondary/95 backdrop-blur-xl border-b border-white/10">
 <div class="flex items-center gap-2 min-w-0 flex-1">
 <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
 <span class="text-[15px] font-semibold text-white truncate">
 ${results.from?.split(',')[0] || '?'} <span class="text-primary-400">&rarr;</span> ${results.to?.split(',')[0] || '?'}
 </span></div>
 <div class="flex gap-2 shrink-0 ml-2">
 <button
 onclick="tripExpandForm()"
 class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
 aria-label="${t('tripEditRoute') || 'Modifier le trajet'}"
 >
 ${icon('pencil', 'w-4 h-4')}
 </button>
 <button
 onclick="clearTripResults()"
 class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/20 transition-colors"
 aria-label="${t('tripCloseResults') || 'Fermer'}"
 >
 ${icon('x', 'w-4 h-4')}
 </button></div></div></div>

 <!-- MAP CONTROLS (right side, below top bar) -->
 <div class="absolute right-3 z-20 flex flex-col gap-2 top-[60px]">
 <button
 onclick="centerTripMapOnGps()"
 class="w-10 h-10 rounded-xl bg-dark-secondary/90 backdrop-blur border border-white/10 flex items-center justify-center text-blue-400 hover:text-blue-300 transition-colors shadow-lg"
 aria-label="${t('myPosition') || 'Ma position'}"
 >
 ${icon('crosshair', 'w-5 h-5')}
 </button>
 <button
 onclick="toggleTripGasStations()"
 class="w-10 h-10 rounded-xl ${showGas ? 'bg-amber-500/20 border-amber-500/40' : 'bg-dark-secondary/90 border-white/10'} backdrop-blur border flex items-center justify-center transition-colors shadow-lg"
 aria-label="${t('tripGasStations') || 'Stations-service'}"
 >
 ${icon('fuel', 'w-5 h-5')}
 </button>
 <button
 onclick="tripFitBounds()"
 class="w-10 h-10 rounded-xl bg-dark-secondary/90 backdrop-blur border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors shadow-lg"
 aria-label="${t('tripFitBounds') || 'Voir tout'}"
 >
 ${icon('expand', 'w-5 h-5')}
 </button></div>

 <!-- BOTTOM SHEET (above nav bar) -->
 <div
 id="trip-bottom-sheet"
 data-sheet-state="${sheetState}"
 class="trip-bottom-sheet absolute left-0 right-0 z-40 bg-dark-primary/95 backdrop-blur-xl border-t border-white/10 rounded-t-2xl shadow-2xl"
 style="bottom:76px;height:${sheetHeight};max-height:calc(85vh - 76px)"
 >
 <!-- Handle -->
 <div
 class="trip-sheet-handle flex justify-center pt-2.5 pb-2 cursor-grab active:cursor-grabbing"
 ontouchstart="tripSheetTouchStart(event)"
 ontouchmove="tripSheetTouchMove(event)"
 ontouchend="tripSheetTouchEnd(event)"
 onclick="tripSheetCycleState()"
 role="button" tabindex="0"
 aria-label="${t('tripExpandSheet') || 'Voir les details'}"
 >
 <div class="w-10 h-1 rounded-full bg-white/25"></div></div>

 <!-- Summary line (always visible) -->
 <div class="px-4 pb-2 flex items-center justify-center gap-4 text-[13px]">
 <span class="flex items-center gap-1">
 <span class="text-white font-semibold">${results.distance || '?'} km</span></span>
 <span class="text-slate-600">&middot;</span>
 <span class="flex items-center gap-1">
 <span class="text-white font-semibold">~${results.estimatedTime || '?'}</span></span>
 <span class="text-slate-600">&middot;</span>
 <span class="flex items-center gap-1">
 <span class="text-white font-semibold">${filteredSpots.length} spots</span></span>
 <span data-trip-chevron class="text-slate-500 ml-auto">${icon(sheetState === 'collapsed' ? 'chevron-up' : 'chevron-down', 'w-4 h-4')}</span></div>

 <!-- Scrollable content (always in DOM, hidden when collapsed) -->
 <div style="${sheetState === 'collapsed' ? 'display:none' : ''}">
 <div data-trip-scroll class="trip-sheet-scroll overflow-y-auto px-4 pb-6" style="max-height:calc(${sheetHeight} - 80px)">
 <!-- Filter chips -->
 <div class="flex gap-2 overflow-x-auto scrollbar-none pb-3 pr-4">
 ${renderFilterChip('all', `${t('tripFilterAll') || 'Tous'} (${counts.all})`, !routeFilter || routeFilter === 'all', false)}
 ${renderFilterChip('rating4', `⭐ 4+ (${counts.rating4})`, routeFilter === 'rating4', counts.rating4 === 0)}
 ${renderFilterChip('wait20', `⏱ <20min (${counts.wait20})`, routeFilter === 'wait20', counts.wait20 === 0)}
 ${renderFilterChip('station', `${icon('fuel', 'w-3 h-3 inline mr-0.5')} Station (${counts.station})`, routeFilter === 'station', counts.station === 0)}
 ${renderFilterChip('verified', `✓ ${t('tripFilterVerified') || 'Vérifié'} (${counts.verified})`, routeFilter === 'verified', counts.verified === 0)}
 ${renderFilterChip('shelter', `${icon('home', 'w-3 h-3 inline mr-0.5')} ${t('filterShelter') || 'Abri'} (${counts.shelter})`, routeFilter === 'shelter', counts.shelter === 0)}
 ${renderFilterChip('recent', `${icon('clock', 'w-3 h-3 inline mr-0.5')} ${t('filterRecent') || 'Récent'} (${counts.recent})`, routeFilter === 'recent', counts.recent === 0)}
 </div>

 <!-- Spot list -->
 <div class="space-y-1.5 mb-4">
 ${filteredSpots.map((spot, i) => renderBottomSheetSpotItem(spot, i, results, favSet)).join('')}
 ${filteredSpots.length === 0 ? `
 <div class="text-center py-6 text-slate-500 text-sm">
 ${icon('search', 'w-6 h-6 mb-1')}
 <p>${t('noSpotsFound') || 'Aucun spot'}</p></div>
 ` : ''}
 </div>

 <!-- Action buttons (only in full mode) -->
 <div data-trip-actions class="grid grid-cols-2 gap-3 pt-3 border-t border-white/5" style="${sheetState !== 'full' ? 'display:none' : ''}">
 <button onclick="saveTripWithSpots()" class="btn-secondary py-3 text-sm">
 ${icon('bookmark', 'w-4 h-4 mr-1.5')}
 ${t('tripSaveTrip') || 'Sauvegarder'}
 </button>
 <button onclick="startTrip()" class="btn-primary py-3 text-sm">
 ${icon('navigation', 'w-4 h-4 mr-1.5')}
 ${t('tripStartTrip') || 'Demarrer'}
 </button></div></div></div></div>

 <!-- EXPANDED FORM OVERLAY (when editing) -->
 ${!state.tripFormCollapsed ? `
 <div class="absolute inset-0 z-50 bg-dark-primary/80 backdrop-blur-sm flex items-start justify-center pt-12 px-4">
 <div class="w-full max-w-md">
 ${renderTripForm(state)}
 <button onclick="tripCollapseForm()" class="w-full mt-3 py-2.5 rounded-xl bg-white/5 text-slate-400 text-sm font-medium hover:bg-white/10 transition-colors">
 ${icon('x', 'w-4 h-4 mr-1.5')}
 ${t('close') || 'Fermer'}
 </button></div></div>
 ` : ''}
 </div>
 `
}

function renderBottomSheetSpotItem(spot, i, results, favSet) {
 const sLat = spot.coordinates?.lat || spot.lat
 const sLng = spot.coordinates?.lng || spot.lng
 const distFromStart = (sLat && sLng && results.fromCoords)
 ? Math.round(haversineKm(results.fromCoords[0], results.fromCoords[1], sLat, sLng))
 : null
 const isFav = favSet.has(spot.id) || favSet.has(String(spot.id))
 const spotName = escapeHTML(spot.from || spot.city || spot.stationName || spot.description?.substring(0, 50) || (spot.country ? `${t('spot')} · ${spot.country}` : `${t('spot')} #${i + 1}`))

 // Spot type label
 const spotType = spot.spotType || ''
 // Wait time
 const waitTime = spot.avgWaitTime || spot.avgWait
 // Stars display (1-5 based on rating)
 const rating = spot.globalRating || 0
 const stars = rating > 0 ? '★'.repeat(Math.round(Math.min(5, rating))) + '☆'.repeat(5 - Math.round(Math.min(5, rating))) : ''
 const safeSpotId = escapeJSString(String(spot.id))

 return `
 <div class="flex items-center gap-1">
 <button
 onclick="tripMapShowSpot(${spot.id})"
 class="flex-1 flex items-center gap-3 p-3 rounded-xl bg-dark-secondary hover:bg-white/5 transition-colors text-left ${isFav ? 'border border-amber-500/30' : 'border border-transparent'}"
 role="button" tabindex="0"
 >
 <span class="w-7 h-7 rounded-full ${isFav ? 'bg-amber-500' : 'bg-emerald-500'} flex items-center justify-center shrink-0">
 <span class="text-xs font-bold text-white">${i + 1}</span></span>
 <div class="flex-1 min-w-0">
 <div class="text-sm font-semibold text-white truncate">${spotName}</div>
 <div class="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
 ${stars ? `<span class="text-primary-400">${stars}</span>` : ''}
 ${spotType ? `<span>${spotType}</span>` : ''}
 ${waitTime ? `<span>~${waitTime}min</span>` : ''}
 </div></div>
 <div class="text-xs text-slate-500 font-medium shrink-0 text-right">
 ${distFromStart !== null ? `${distFromStart} km` : ''}
 </div></button>
 <button
 onclick="toggleFavorite('${safeSpotId}')"
 class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isFav ? 'text-red-500' : 'text-slate-600 hover:text-red-400'}"
 aria-label="${isFav ? (t('removeFromFavorites') || 'Retirer des favoris') : (t('addToFavorites') || 'Ajouter aux favoris')}"
 >
 ${icon(isFav ? 'heart' : 'heart', isFav ? 'w-5 h-5 text-red-400 fill-red-400' : 'w-5 h-5 text-slate-400')}
 </button></div>
 `
}

// Simplified summary card that shows when form is NOT collapsed but results exist
function renderTripResultsSummary(state) {
 const results = state.tripResults
 const spots = results.spots || []

 return `
 <div class="card p-4 space-y-3 border-primary-500/30">
 <div class="flex items-center justify-between">
 <h4 class="font-bold text-base truncate pr-2">
 ${results.from?.split(',')[0] || '?'} → ${results.to?.split(',')[0] || '?'}
 </h4>
 <button onclick="clearTripResults()" class="text-slate-400 hover:text-white transition-colors" aria-label="${t('close') || 'Fermer'}">
 ${icon('x', 'w-5 h-5')}
 </button></div>

 <div class="flex gap-4 text-sm">
 <div class="flex items-center gap-2">
 ${icon('milestone', 'w-4 h-4 text-slate-400')}
 <span>${results.distance || '?'} km</span></div>
 <div class="flex items-center gap-2">
 ${icon('clock', 'w-4 h-4 text-slate-400')}
 <span>~${results.estimatedTime || '?'}</span></div>
 <div class="flex items-center gap-2">
 ${icon('map-pin', 'w-4 h-4 text-primary-400')}
 <span class="text-primary-400 font-semibold">${spots.length} spots</span></div></div>

 <button onclick="tripCollapseForm()" class="btn-primary w-full py-3">
 ${icon('map', 'w-5 h-5 mr-2')}
 ${t('viewOnMap') || 'Voir sur la carte'}
 </button></div>
 `
}

// ==================== EN ROUTE: RADAR DE ROUTE ====================

function renderEnRouteRadar(_state, activeTrip) {
 const spots = activeTrip.spots || []
 const totalKm = parseInt(activeTrip.distance) || 0
 const closestSpot = spots[0] // First spot = closest ahead
 const remaining = spots.length

 return `
 <div class="space-y-4">
 <!-- Route header -->
 <div class="card p-4 border-emerald-500/30 bg-emerald-500/5">
 <div class="flex items-center gap-2 mb-1">
 <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
 <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider">${t('activeTrip') || 'Voyage en cours'}</span></div>
 <div class="font-bold text-base mb-3">
 ${activeTrip.from?.split(',')[0] || '?'} → ${activeTrip.to?.split(',')[0] || '?'}
 </div>

 <!-- Route strip with spots -->
 <div class="relative flex items-center gap-1 mb-1">
 <!-- Start dot -->
 <span class="w-3 h-3 rounded-full bg-emerald-500 shrink-0 z-10"></span>
 <!-- Line + spot dots -->
 <div class="relative flex-1 h-1.5 bg-white/10 rounded-full overflow-visible">
 <div class="absolute inset-y-0 left-0 bg-emerald-500/50 rounded-full" style="width: 30%"></div>
 ${spots.slice(0, 8).map((_, i) => {
 const pct = Math.round(((i + 1) / (spots.length + 1)) * 100)
 return `<span class="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-dark-primary z-10 ${
 i === 0 ? 'bg-amber-400' : 'bg-slate-500'
 }" style="left: ${pct}%"></span>`
 }).join('')}
 </div>
 <!-- End dot -->
 <span class="w-3 h-3 rounded-full bg-primary-500 shrink-0 z-10"></span></div>
 <div class="flex justify-between text-[10px] text-slate-500">
 <span>${activeTrip.from?.split(',')[0] || '?'}</span>
 <span class="text-amber-400">${remaining} ${t('voyageRadarSpots') || 'spots devant toi'}</span>
 <span>${activeTrip.to?.split(',')[0] || '?'}</span></div></div>

 <!-- Closest spot card -->
 ${closestSpot ? `
 <div class="card p-4 border-amber-500/30 bg-amber-500/5">
 <div class="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2">
 ${icon('map-pin', 'w-3 h-3 inline mr-0.5')} ${t('voyageClosestSpot') || 'Spot le plus proche devant toi'}
 </div>
 <div class="flex items-center gap-3 mb-3">
 <div class="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
 ⭐
 </div>
 <div class="flex-1 min-w-0">
 <div class="font-semibold truncate">${escapeHTML(closestSpot.from || closestSpot.city || closestSpot.stationName || closestSpot.description?.substring(0, 50) || (closestSpot.country ? `${t('spot')} · ${closestSpot.country}` : t('spot')))}</div>
 <div class="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
 ${closestSpot.spotType ? `<span>${closestSpot.spotType}</span>` : ''}
 ${(closestSpot.avgWaitTime || closestSpot.avgWait) ? `<span>${icon('clock', 'w-3 h-3 inline')} ~${closestSpot.avgWaitTime || closestSpot.avgWait}min</span>` : ''}
 </div></div></div>
 <button
 onclick="selectSpot(${closestSpot.id})"
 class="w-full py-2.5 rounded-xl bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 active:scale-95 transition-colors"
 >
 ${icon('map-pin', 'w-4 h-4')}
 ${t('voyageSeeSpot') || 'Voir ce spot'}
 </button></div>
 ` : `
 <div class="card p-4 text-center border-amber-500/30 bg-amber-500/5">
 <p class="text-amber-400 font-semibold">${icon('party-popper', 'w-4 h-4 inline mr-1')} ${t('voyageAlmostThere') || 'Presque arrivé !'}</p></div>
 `}

 <!-- All spots ahead -->
 ${spots.length > 1 ? `
 <div class="card p-4">
 <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
 ${icon('map-pin', 'w-3 h-3 inline mr-0.5')} ${t('voyageAllSpotsAhead') || 'Tous les spots devant toi'} (${spots.length})
 </div>
 <div class="space-y-2 max-h-64 overflow-y-auto">
 ${spots.map((spot, i) => {
 const sLat = spot.coordinates?.lat || spot.lat
 const sLng = spot.coordinates?.lng || spot.lng
 const distFromStart = (sLat && sLng && activeTrip.fromCoords)
 ? Math.round(haversineKm(activeTrip.fromCoords[0], activeTrip.fromCoords[1], sLat, sLng))
 : null
 return `
 <button
 onclick="selectSpot(${spot.id})"
 class="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
 >
 ${distFromStart !== null
 ? `<span class="text-[10px] font-bold text-slate-500 w-10 shrink-0 text-right">+${distFromStart}km</span>`
 : `<span class="text-[10px] font-bold text-slate-500 w-10 shrink-0 text-center">#${i + 1}</span>`
 }
 <span class="w-2.5 h-2.5 rounded-full shrink-0 ${i === 0 ? 'bg-amber-400' : 'bg-slate-600'}"></span>
 <div class="flex-1 min-w-0">
 <div class="text-sm font-medium truncate">${escapeHTML(spot.from || spot.city || spot.stationName || spot.description?.substring(0, 50) || (spot.country ? `${t('spot')} · ${spot.country}` : `${t('spot')} #${i + 1}`))}</div>
 <div class="text-[10px] text-slate-500">${spot.spotType || ''} ${spot.userValidations ? `· ✓${spot.userValidations}` : ''}</div></div>
 ${icon('chevron-right', 'w-3.5 h-3.5 text-slate-600 shrink-0')}
 </button>
 `
 }).join('')}
 </div></div>
 ` : ''}

 <!-- Route stats + finish button -->
 <div class="flex gap-3">
 <div class="flex-1 card p-3 text-center">
 <div class="text-lg font-bold">${totalKm || '?'}</div>
 <div class="text-[10px] text-slate-400">km</div></div>
 <div class="flex-1 card p-3 text-center">
 <div class="text-lg font-bold text-amber-400">${remaining}</div>
 <div class="text-[10px] text-slate-400">spots</div></div>
 <div class="flex-1 card p-3 text-center">
 <div class="text-lg font-bold">${activeTrip.estimatedTime || '?'}</div>
 <div class="text-[10px] text-slate-400">trajet</div></div></div>

 <button
 onclick="finishTrip()"
 class="w-full py-3 rounded-xl bg-white/5 text-slate-400 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/10 hover:text-white transition-colors"
 >
 ${icon('flag', 'w-4 h-4')}
 ${t('voyageFinishTrip') || 'Terminer le voyage'}
 </button></div>
 `
}

// ==================== PLANIFIER FORM ====================

function renderTripForm(state) {
 return `
 <div class="card p-4 space-y-4 !overflow-visible">
 <h3 class="font-bold text-base flex items-center gap-2">
 ${icon('signpost', 'w-5 h-5 text-primary-400')}
 ${t('newTrip') || 'Nouveau voyage'}
 </h3>

 <div class="space-y-3">
 <div class="relative">
 <label for="trip-from" class="block text-xs text-slate-400 mb-1 uppercase tracking-wider">${t('departure') || 'Départ'}</label>
 <input
 type="text"
 id="trip-from"
 placeholder="${t('searchCity') || 'Ex: Paris, Lyon...'}"
 class="input-field w-full"
 value="${state.tripFrom || ''}"
 oninput="tripSearchSuggestions('from', this.value)"
 onblur="setTimeout(()=>{document.getElementById('trip-from-suggestions')?.classList.add('hidden')},200)"
 onkeydown="if(event.key==='Enter'){event.preventDefault();tripSelectFirst('from')}"
 autocomplete="off"
 />
 <div id="trip-from-suggestions" class="absolute top-full left-0 right-0 mt-1 z-50 hidden"></div></div>

 <div class="flex justify-center -my-1">
 <button
 onclick="swapTripPoints()"
 class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
 aria-label="${t('swap') || 'Inverser'}"
 >
 ${icon('arrow-right-left', 'w-5 h-5 rotate-90')}
 </button></div>

 <div class="relative">
 <label for="trip-to" class="block text-xs text-slate-400 mb-1 uppercase tracking-wider">${t('destination') || 'Destination'}</label>
 <input
 type="text"
 id="trip-to"
 placeholder="${t('searchCity') || 'Ex: Berlin, Barcelone...'}"
 class="input-field w-full"
 value="${state.tripTo || ''}"
 oninput="tripSearchSuggestions('to', this.value)"
 onblur="setTimeout(()=>{document.getElementById('trip-to-suggestions')?.classList.add('hidden')},200)"
 onkeydown="if(event.key==='Enter'){event.preventDefault();tripSelectFirst('to')}"
 autocomplete="off"
 />
 <div id="trip-to-suggestions" class="absolute top-full left-0 right-0 mt-1 z-50 hidden"></div></div></div>

 <button
 onclick="syncTripFieldsAndCalculate()"
 class="btn-primary w-full py-3"
 ${state.tripLoading ? 'disabled' : ''}
 >
 ${state.tripLoading
 ? icon('loader-circle', 'w-5 h-5 animate-spin mr-2') + (t('calculating') || 'Calcul en cours...')
 : icon('route', 'w-5 h-5 mr-2') + (t('findSpotsOnRoute') || 'Trouver les spots sur le trajet')
 }
 </button></div>
 `
}

// renderTripResults removed — replaced by renderMapFirstView + renderTripResultsSummary

function renderFilterChip(filter, label, active, disabled = false) {
 return `
 <button
 onclick="setRouteFilter('${filter}')"
 ${disabled ? 'disabled' : ''}
 class="px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors border ${
 active
 ? 'bg-primary-500 text-dark-primary font-semibold border-primary-500'
 : disabled
 ? 'bg-dark-secondary text-slate-600 border-white/5 opacity-50 cursor-not-allowed'
 : 'bg-dark-secondary text-slate-400 border-white/10 hover:bg-white/10'
 }"
 >${label}</button>
 `
}

// renderAmenityChip + renderSpotsTimeline removed — replaced by bottom sheet in renderMapFirstView

function renderSavedTripsPreview(_state) {
 const savedTrips = getSavedTrips()
 const notCompleted = savedTrips.filter(t => !t.completed)
 if (notCompleted.length === 0) {
 return renderEmptyState('trips', { compact: true })
 }
 return `
 <div class="space-y-2">
 <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-2">
 ${icon('bookmark', 'w-4 h-4 text-amber-400')}
 ${t('savedTrips') || 'Voyages sauvegardés'}
 </h3>
 ${notCompleted.slice(0, 3).map((trip, _i) => {
 const idx = savedTrips.indexOf(trip)
 const tripLabel = trip.name || `${trip.from?.split(',')[0] || '?'} → ${trip.to?.split(',')[0] || '?'}`
 const dateStr = trip.savedAt ? formatRelativeDate(trip.savedAt) : ''
 return `
 <div class="card p-3 flex items-center gap-3">
 <button onclick="loadSavedTrip(${idx})" class="flex-1 flex items-center gap-3 text-left">
 <div class="w-9 h-9 rounded-lg bg-primary-500/15 flex items-center justify-center flex-shrink-0">
 ${icon('route', 'w-4 h-4 text-primary-400')}
 </div>
 <div class="min-w-0">
 <div class="text-sm font-medium truncate">${tripLabel}</div>
 <div class="text-xs text-slate-500">${trip.spots?.length || 0} spots · ${trip.distance || '?'} km${dateStr ? ` · ${dateStr}` : ''}</div></div></button>
 <button onclick="startTrip(${idx})" class="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/25 transition-colors flex-shrink-0">
 ${icon('navigation', 'w-3.5 h-3.5')}
 </button>
 <button onclick="deleteSavedTrip(${idx})" class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-danger-400 hover:bg-danger-500/10 transition-colors flex-shrink-0">
 ${icon('trash', 'w-3.5 h-3.5')}
 </button></div>
 `}).join('')}
 ${notCompleted.length > 3 ? `
 <button onclick="setVoyageSubTab('journal')" class="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 mx-auto">
 ${t('seeAll') || 'Voir tout'} (${notCompleted.length}) ${icon('chevron-right', 'w-3 h-3')}
 </button>
 ` : ''}
 </div>
 `
}

// renderTripMapView removed — replaced by renderMapFirstView

// ==================== TAB 2: GUIDES ====================

function renderVoyageGuidesTab(state) {
 return renderGuides(state)
}

// ==================== TAB 3: JOURNAL ====================

// Lazy-load the new Journal component (trip diary with timeline, expenses, day notes)
let _journalModule = null
async function _loadJournal() {
 if (!_journalModule) _journalModule = await import('./Journal.js')
 return _journalModule
}

function renderJournalTab(state) {
 if (!_journalModule) {
 _loadJournal().then(() => window._forceRender?.())
 return `<div style="text-align:center;padding:40px;color:#64748b">${t('loading') || 'Chargement...'}</div>`
 }
 return _journalModule.renderJournal(state)
}

// applyVoyageFilter removed — unified in src/utils/tripFilters.js

function getSavedTrips() {
 try {
 return JSON.parse(localStorage.getItem(SAVED_TRIPS_KEY) || '[]')
 } catch { return [] }
}

function getActiveTrip() {
 try {
 return JSON.parse(localStorage.getItem(ACTIVE_TRIP_KEY) || 'null')
 } catch { return null }
}

function getFavoritesSet() {
 try {
 return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]').map(String))
 } catch { return new Set() }
}

// ==================== WINDOW HANDLERS ====================

window.setVoyageSubTab = (tab) => {
 if (!import.meta.env.VITE_SHOW_BETA && tab === 'voyage') {
 window.showFeatureIntro?.('itineraire')
 return
 }
 window.setState?.({ voyageSubTab: tab })
}

window.setJournalSubTab = (tab) => {
 window.setState?.({ journalSubTab: tab })
}

// highlightTripSpot removed — replaced by toggleFavorite ( system)

window.startTrip = (savedTripIndex) => {
 try {
 let tripData = null
 if (savedTripIndex !== undefined) {
 const savedTrips = getSavedTrips()
 tripData = savedTrips[savedTripIndex] || null
 } else {
 const state = window.getState?.() || {}
 if (state.tripResults) {
 tripData = { ...state.tripResults, savedAt: new Date().toISOString() }
 }
 }
 if (!tripData) {
 window.showToast?.('Aucun voyage à démarrer', 'warning')
 return
 }
 const activeTrip = {
 ...tripData,
 currentStopIndex: 0,
 startedAt: new Date().toISOString(),
 }
 safeSetItem(ACTIVE_TRIP_KEY, JSON.stringify(activeTrip))
 window.setState?.({ voyageSubTab: 'voyage' })
 window.showToast?.(t('activeTrip') || 'Voyage démarré !', 'success')
 } catch (e) {
 console.error('startTrip error:', e)
 }
}

// Kept for backward compatibility (wiring tests)
window.tripNextStop = () => {
 try {
 const active = getActiveTrip()
 if (!active) return
 const next = { ...active, currentStopIndex: (active.currentStopIndex || 0) + 1 }
 safeSetItem(ACTIVE_TRIP_KEY, JSON.stringify(next))
 window.setState?.({})
 } catch (e) {
 console.error('tripNextStop error:', e)
 }
}

window.finishTrip = () => {
 try {
 const active = getActiveTrip()
 if (!active) return

 // Save as completed in journal
 const savedTrips = getSavedTrips()
 const now = new Date().toISOString()
 const completedTrip = {
 ...active,
 completed: true,
 finishedAt: now,
 notes: active.notes || '',
 photos: active.photos || [],
 public: active.public || false,
 }

 const idx = savedTrips.findIndex(t => t.from === active.from && t.to === active.to && !t.completed)
 if (idx >= 0) {
 savedTrips[idx] = completedTrip
 } else {
 savedTrips.push(completedTrip)
 }
 safeSetItem(SAVED_TRIPS_KEY, JSON.stringify(savedTrips))
 localStorage.removeItem(ACTIVE_TRIP_KEY)
 window.setState?.({ voyageSubTab: 'journal', journalSubTab: 'mes-voyages' })
 window.showToast?.(t('voyageTripFinished') || 'Voyage terminé ! ', 'success')
 } catch (e) {
 console.error('finishTrip error:', e)
 }
}

window.toggleTripPublic = (tripIndex) => {
 try {
 const savedTrips = getSavedTrips()
 if (!savedTrips[tripIndex]) return
 savedTrips[tripIndex].public = !savedTrips[tripIndex].public
 safeSetItem(SAVED_TRIPS_KEY, JSON.stringify(savedTrips))
 window.setState?.({})
 } catch (e) {
 console.error('toggleTripPublic error:', e)
 }
}

window.openTripDetail = (tripIndex) => {
 window.setState?.({ tripDetailIndex: tripIndex })
}

window.closeTripDetail = () => {
 window.setState?.({ tripDetailIndex: null })
}

window.deleteJournalTrip = (tripIndex) => {
 if (!confirm(window.t?.('confirmDeleteTrip') || 'Supprimer ce voyage ? Cette action est irréversible.')) return
 try {
 const savedTrips = getSavedTrips()
 const trip = savedTrips[tripIndex]
 savedTrips.splice(tripIndex, 1)
 safeSetItem(SAVED_TRIPS_KEY, JSON.stringify(savedTrips))
 window.setState?.({ tripDetailIndex: null })
 window.showToast?.(window.t?.('tripDeleted') || 'Voyage supprimé', 'success')
 // Sync delete to Firebase if user is logged in
 const user = window.getState?.()?.currentUser
 if (user?.uid && trip?.id) {
 import('../../services/firebase.js').then(async (fb) => {
  try { await fb.deleteTrip(user.uid, trip.id) }
  catch (err) { console.warn('Firestore trip delete failed:', err.message) }
 })
 }
 } catch (e) {
 console.error('deleteJournalTrip error:', e)
 }
}

window.openEditTrip = (tripIndex) => {
 window.setState?.({ editTripIndex: tripIndex })
}

window.closeEditTrip = () => {
 window.setState?.({ editTripIndex: null })
}

window.submitEditTrip = () => {
 if (window.submitEditTrip._busy) return
 window.submitEditTrip._busy = true
 setTimeout(() => { window.submitEditTrip._busy = false }, 2000)
 const state = window.getState?.()
 const tripIndex = state?.editTripIndex
 if (tripIndex == null) { window.submitEditTrip._busy = false; return }

 const savedTrips = getSavedTrips()
 const trip = savedTrips[tripIndex]
 if (!trip) return

 const from = document.getElementById('edit-trip-from')?.value?.trim() || trip.from || ''
 const to = document.getElementById('edit-trip-to')?.value?.trim() || trip.to || ''
 const date = document.getElementById('edit-trip-date')?.value || trip.date || ''
 const km = parseInt(document.getElementById('edit-trip-km')?.value || '0', 10) || 0
 const lifts = parseInt(document.getElementById('edit-trip-lifts')?.value || '0', 10) || 0
 const notes = document.getElementById('edit-trip-notes')?.value?.trim() ?? trip.notes ?? ''

 if (!from || !to) {
 window.showToast?.(t('tripFromToRequired') || 'Départ et arrivée requis', 'error')
 return
 }

 const updated = { ...trip, from, to, date, distance: km, lifts, notes, updatedAt: new Date().toISOString() }
 savedTrips[tripIndex] = updated
 safeSetItem(SAVED_TRIPS_KEY, JSON.stringify(savedTrips))

 // Sync to Firebase if user is logged in
 const user = window.getState?.()?.currentUser
 if (user?.uid && updated.id) {
 import('../../services/firebase.js').then(fb => fb.updateTrip(user.uid, updated.id, { from, to, date, distance: km, lifts, notes, updatedAt: updated.updatedAt })).catch(() => {})
 }

 window.setState?.({ editTripIndex: null })
 window.showToast?.(t('tripUpdated') || 'Voyage mis à jour !', 'success')
 window._forceRender?.()
}

window.openAddTripNote = (tripIndex) => {
 const savedTrips = getSavedTrips()
 const trip = savedTrips[tripIndex]
 if (!trip) return

 // Remove any existing note modal
 document.getElementById('trip-note-modal')?.remove()

 const overlay = document.createElement('div')
 overlay.id = 'trip-note-modal'
 overlay.style.cssText = 'position:fixed;inset:0;z-index:9998;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);padding:1rem'

 const card = document.createElement('div')
 card.style.cssText = 'background:#1e293b;border-radius:1rem;padding:1.25rem;max-width:24rem;width:100%;border:1px solid rgba(255,255,255,0.1)'

 const title = document.createElement('h3')
 title.textContent = t('voyageAddNote') || 'Ajouter une note...'
 title.style.cssText = 'color:white;font-weight:600;font-size:1rem;margin-bottom:0.75rem'

 const textarea = document.createElement('textarea')
 textarea.value = trip.notes || ''
 textarea.placeholder = t('voyageNotePlaceholder') || 'Ton ressenti, tes anecdotes...'
 textarea.style.cssText = 'width:100%;min-height:100px;background:#0f172a;color:white;border:1px solid rgba(255,255,255,0.1);border-radius:0.75rem;padding:0.75rem;font-size:0.875rem;resize:vertical;outline:none;box-sizing:border-box'

 const btnRow = document.createElement('div')
 btnRow.style.cssText = 'display:flex;gap:0.5rem;margin-top:0.75rem'

 const cancelBtn = document.createElement('button')
 cancelBtn.textContent = t('cancel') || 'Annuler'
 cancelBtn.style.cssText = 'flex:1;padding:0.625rem;border-radius:0.75rem;background:rgba(255,255,255,0.05);color:#94a3b8;font-weight:600;font-size:0.875rem;border:none;cursor:pointer'
 cancelBtn.onclick = () => overlay.remove()

 const saveBtn = document.createElement('button')
 saveBtn.textContent = t('save') || 'Enregistrer'
 saveBtn.style.cssText = 'flex:1;padding:0.625rem;border-radius:0.75rem;background:#22c55e;color:white;font-weight:600;font-size:0.875rem;border:none;cursor:pointer'
 saveBtn.onclick = () => {
 savedTrips[tripIndex].notes = textarea.value
 safeSetItem(SAVED_TRIPS_KEY, JSON.stringify(savedTrips))
 overlay.remove()
 window.setState?.({})
 }

 btnRow.appendChild(cancelBtn)
 btnRow.appendChild(saveBtn)
 card.appendChild(title)
 card.appendChild(textarea)
 card.appendChild(btnRow)
 overlay.appendChild(card)

 // Close on overlay click (outside card)
 overlay.onclick = (e) => { if (e.target === overlay) overlay.remove() }

 document.body.appendChild(overlay)
 textarea.focus()
}

window.openTripPhotoUpload = (tripIndex) => {
 // Compress image to max 800px wide, quality 0.7
 const compressImage = (file) => new Promise((resolve, reject) => {
 const img = new Image()
 const url = URL.createObjectURL(file)
 img.onload = () => {
 const MAX = 800
 let w = img.width, h = img.height
 if (w > MAX) { h = Math.round(h * MAX / w); w = MAX }
 if (h > MAX) { w = Math.round(w * MAX / h); h = MAX }
 const canvas = document.createElement('canvas')
 canvas.width = w; canvas.height = h
 canvas.getContext('2d').drawImage(img, 0, 0, w, h)
 URL.revokeObjectURL(url)
 resolve(canvas.toDataURL('image/jpeg', 0.7))
 }
 img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image load failed')) }
 img.src = url
 })

 const input = document.createElement('input')
 input.type = 'file'
 input.accept = 'image/*'
 input.multiple = true
 input.onchange = async (e) => {
 const files = Array.from(e.target.files || [])
 if (files.length === 0) return
 const savedTrips = getSavedTrips()
 if (!savedTrips[tripIndex]) return
 if (!savedTrips[tripIndex].photos) savedTrips[tripIndex].photos = []
 // Limit to 3 photos max per trip
 const remaining = Math.max(0, 3 - savedTrips[tripIndex].photos.length)
 if (remaining === 0) {
 window.showToast?.(t('maxPhotosReached') || 'Maximum 3 photos', 'info')
 return
 }
 for (const file of files.slice(0, remaining)) {
 try {
 const compressed = await compressImage(file)
 savedTrips[tripIndex].photos.push(compressed)
 } catch (err) {
 console.error('photo compress error', err)
 }
 }
 safeSetItem(SAVED_TRIPS_KEY, JSON.stringify(savedTrips))
 window.setState?.({})
 }
 input.click()
}

// ==================== MAP-FIRST HANDLERS ====================

// Bottom sheet touch drag state
let _sheetTouchStartY = 0
let _sheetStartHeight = 0
let _sheetDragging = false

window.tripSheetTouchStart = (e) => {
 const sheet = document.getElementById('trip-bottom-sheet')
 if (!sheet) return
 _sheetTouchStartY = e.touches[0].clientY
 _sheetStartHeight = sheet.getBoundingClientRect().height
 _sheetDragging = true
 sheet.classList.add('dragging')
}

window.tripSheetTouchMove = (e) => {
 if (!_sheetDragging) return
 const deltaY = _sheetTouchStartY - e.touches[0].clientY
 // Only prevent default scroll if drag exceeds 10px threshold
 if (Math.abs(deltaY) < 10) return
 e.preventDefault()
 const sheet = document.getElementById('trip-bottom-sheet')
 if (!sheet) return
 const newHeight = Math.max(80, Math.min(window.innerHeight * 0.85, _sheetStartHeight + deltaY))
 sheet.style.height = newHeight + 'px'
}

// Local sheet state to avoid setState re-renders
let _currentSheetState = 'collapsed'

function _applySheetState(sheet, state) {
 const heights = { collapsed: '80px', half: 'calc(50vh - 38px)', full: 'calc(85vh - 76px)' }
 sheet.style.height = heights[state] || '80px'
 _currentSheetState = state
 sheet.dataset.sheetState = state
 // Show/hide scrollable content using data attributes (avoid querySelector CSS class issues)
 const scrollArea = sheet.querySelector('[data-trip-scroll]')
 const actionsArea = sheet.querySelector('[data-trip-actions]')
 if (scrollArea) scrollArea.parentElement.style.display = (state === 'collapsed') ? 'none' : ''
 if (actionsArea) actionsArea.style.display = (state === 'full') ? '' : 'none'
 // Update chevron direction
 const chevron = sheet.querySelector('[data-trip-chevron]')
 if (chevron) {
 chevron.innerHTML = state === 'collapsed'
 ? icon('chevron-up', 'w-4 h-4')
 : icon('chevron-down', 'w-4 h-4')
 }
}

window.tripSheetTouchEnd = () => {
 if (!_sheetDragging) return
 _sheetDragging = false
 const sheet = document.getElementById('trip-bottom-sheet')
 if (!sheet) return
 sheet.classList.remove('dragging')
 const h = sheet.getBoundingClientRect().height
 const vh = window.innerHeight
 // Snap to nearest state
 let newState = 'collapsed'
 if (h > vh * 0.65) {
 newState = 'full'
 } else if (h > vh * 0.25) {
 newState = 'half'
 }
 sheet.style.height = ''
 _applySheetState(sheet, newState)
}

window.tripSheetCycleState = () => {
 const sheet = document.getElementById('trip-bottom-sheet')
 if (!sheet) return
 // Read from data attribute to stay in sync after re-renders
 const current = sheet.dataset.sheetState || _currentSheetState || 'collapsed'
 const next = current === 'collapsed' ? 'half' : current === 'half' ? 'full' : 'collapsed'
 _applySheetState(sheet, next)
}

window.tripExpandForm = () => {
 window.setState?.({ tripFormCollapsed: false })
}

window.tripCollapseForm = () => {
 window.setState?.({ tripFormCollapsed: true })
}

window.removeTripMapSpot = (spotId) => {
 const state = window.getState?.() || {}
 const removed = [...(state.tripRemovedSpots || []), String(spotId)]
 window.setState?.({ tripRemovedSpots: removed })
 // Update the map spots without full re-render
 window._tripMapUpdateSpots?.()
}

window.toggleTripGasStations = () => {
 const state = window.getState?.() || {}
 const show = !state.tripShowGasStations
 window.setState?.({ tripShowGasStations: show })
 if (show) {
 // Load and show gas stations along route
 const results = state.tripResults
 if (results?.routeGeometry?.length > 1) {
 window.showToast?.(t('loadingGasStations') || 'Chargement des stations...', 'info')
 import('../../services/overpass.js').then(({ getAmenitiesAlongRoute }) => {
 getAmenitiesAlongRoute(results.routeGeometry, 2, { showFuel: true, showRestAreas: true })
 .then(amenities => {
 if (amenities.length === 0) {
 window.showToast?.(t('noGasStationsFound') || 'Aucune station trouvée', 'warning')
 } else {
 window._tripMapAddAmenities?.(amenities)
 window.showToast?.(`${amenities.length} ${t('gasStationsFound') || 'stations trouvées'}`, 'success')
 }
 })
 .catch(() => {
 window.showToast?.(t('gasStationsError') || 'Erreur de chargement des stations', 'error')
 window.setState?.({ tripShowGasStations: false })
 })
 }).catch(() => {
 window.showToast?.(t('gasStationsError') || 'Erreur de chargement des stations', 'error')
 window.setState?.({ tripShowGasStations: false })
 })
 }
 } else {
 window._tripMapRemoveAmenities?.()
 }
}

window.tripFitBounds = () => {
 const state = window.getState?.() || {}
 const results = state.tripResults
 if (!results?.fromCoords || !results?.toCoords) return
 const from = results.fromCoords
 const to = results.toCoords
 const spots = results.spots || []
 const allCoords = [[from[1], from[0]], [to[1], to[0]]]
 spots.forEach(s => {
 const lat = s.coordinates?.lat || s.lat
 const lng = s.coordinates?.lng || s.lng
 if (lat && lng) allCoords.push([lng, lat])
 })
 window._tripMapFitBounds?.(allCoords)
}

window.tripMapShowSpot = (spotId) => {
 const state = window.getState?.() || {}
 const spot = state.tripResults?.spots?.find(s => s.id === spotId)
 if (!spot) return
 const lat = spot.coordinates?.lat || spot.lat
 const lng = spot.coordinates?.lng || spot.lng
 if (lat && lng) {
 window._tripMapFlyTo?.(lng, lat)
 window._tripMapShowPopup?.(spotId)
 }
}

// swapTripPoints — canonical in Travel.js
// syncTripFieldsAndCalculate — canonical in Travel.js

// tripSearchSuggestions — 3 couches : villes populaires, cache localStorage, pays offline, API Photon
// Se surcharge si Travel.js est déjà chargé (window.tripSearchSuggestions déjà défini)
if (!window.tripSearchSuggestions) {
 // Layer 1: 150 villes populaires (instantané, sans réseau)
 const POPULAR_CITIES_VOYAGE = [
 // Europe West
 'Paris, France', 'Lyon, France', 'Marseille, France', 'Toulouse, France', 'Nice, France',
 'Nantes, France', 'Montpellier, France', 'Strasbourg, France', 'Bordeaux, France', 'Lille, France',
 'Rennes, France', 'Grenoble, France', 'Rouen, France', 'Toulon, France', 'Dijon, France',
 'London, United Kingdom', 'Birmingham, United Kingdom', 'Manchester, United Kingdom',
 'Edinburgh, United Kingdom', 'Glasgow, United Kingdom', 'Bristol, United Kingdom',
 'Berlin, Germany', 'Hamburg, Germany', 'Munich, Germany', 'Cologne, Germany', 'Frankfurt, Germany',
 'Stuttgart, Germany', 'Düsseldorf, Germany', 'Dresden, Germany', 'Leipzig, Germany',
 'Amsterdam, Netherlands', 'Rotterdam, Netherlands', 'The Hague, Netherlands', 'Utrecht, Netherlands',
 'Brussels, Belgium', 'Antwerp, Belgium', 'Ghent, Belgium', 'Liège, Belgium',
 'Zurich, Switzerland', 'Geneva, Switzerland', 'Bern, Switzerland', 'Basel, Switzerland',
 'Vienna, Austria', 'Graz, Austria', 'Salzburg, Austria', 'Innsbruck, Austria',
 // Europe South
 'Madrid, Spain', 'Barcelona, Spain', 'Valencia, Spain', 'Seville, Spain', 'Bilbao, Spain',
 'Zaragoza, Spain', 'Málaga, Spain', 'Alicante, Spain', 'Granada, Spain',
 'Rome, Italy', 'Milan, Italy', 'Naples, Italy', 'Turin, Italy', 'Florence, Italy',
 'Venice, Italy', 'Bologna, Italy', 'Genoa, Italy', 'Palermo, Italy',
 'Lisbon, Portugal', 'Porto, Portugal', 'Braga, Portugal', 'Coimbra, Portugal',
 'Athens, Greece', 'Thessaloniki, Greece', 'Patras, Greece',
 // Europe North
 'Stockholm, Sweden', 'Gothenburg, Sweden', 'Malmö, Sweden',
 'Oslo, Norway', 'Bergen, Norway', 'Trondheim, Norway',
 'Copenhagen, Denmark', 'Aarhus, Denmark', 'Odense, Denmark',
 'Helsinki, Finland', 'Tampere, Finland', 'Turku, Finland',
 'Dublin, Ireland', 'Cork, Ireland',
 // Europe East
 'Warsaw, Poland', 'Kraków, Poland', 'Łódź, Poland', 'Wrocław, Poland', 'Gdańsk, Poland',
 'Prague, Czech Republic', 'Brno, Czech Republic', 'Ostrava, Czech Republic',
 'Budapest, Hungary', 'Debrecen, Hungary', 'Pécs, Hungary',
 'Bratislava, Slovakia', 'Košice, Slovakia',
 'Bucharest, Romania', 'Cluj-Napoca, Romania', 'Timișoara, Romania',
 'Sofia, Bulgaria', 'Plovdiv, Bulgaria', 'Varna, Bulgaria',
 'Zagreb, Croatia', 'Split, Croatia', 'Rijeka, Croatia',
 'Ljubljana, Slovenia', 'Belgrade, Serbia', 'Novi Sad, Serbia',
 'Tallinn, Estonia', 'Riga, Latvia', 'Vilnius, Lithuania',
 // Eastern Europe / Caucasus
 'Istanbul, Turkey', 'Ankara, Turkey', 'Izmir, Turkey', 'Antalya, Turkey',
 'Kyiv, Ukraine', 'Kharkiv, Ukraine', 'Lviv, Ukraine', 'Odessa, Ukraine',
 'Moscow, Russia', 'Saint Petersburg, Russia', 'Novosibirsk, Russia',
 'Tbilisi, Georgia', 'Yerevan, Armenia', 'Baku, Azerbaijan',
 // North Africa / Middle East
 'Marrakech, Morocco', 'Casablanca, Morocco', 'Rabat, Morocco', 'Tangier, Morocco',
 'Tunis, Tunisia', 'Algiers, Algeria', 'Cairo, Egypt', 'Alexandria, Egypt',
 'Tel Aviv, Israel', 'Jerusalem, Israel',
 // Americas
 'New York, United States', 'Los Angeles, United States', 'Chicago, United States',
 'San Francisco, United States', 'Seattle, United States', 'Miami, United States',
 'Toronto, Canada', 'Montreal, Canada', 'Vancouver, Canada',
 'Mexico City, Mexico', 'Guadalajara, Mexico',
 'Buenos Aires, Argentina', 'Córdoba, Argentina',
 'São Paulo, Brazil', 'Rio de Janeiro, Brazil',
 'Bogotá, Colombia', 'Lima, Peru', 'Santiago, Chile',
 // Asia / Pacific
 'Tokyo, Japan', 'Osaka, Japan', 'Kyoto, Japan',
 'Seoul, South Korea', 'Busan, South Korea',
 'Beijing, China', 'Shanghai, China', 'Guangzhou, China',
 'Bangkok, Thailand', 'Chiang Mai, Thailand',
 'Ho Chi Minh City, Vietnam', 'Hanoi, Vietnam',
 'Kuala Lumpur, Malaysia', 'Singapore, Singapore',
 'Sydney, Australia', 'Melbourne, Australia', 'Brisbane, Australia',
 'Auckland, New Zealand',
 ]

 // Layer 2: cache localStorage (résultats API précédents)
 const _getCachedCities = (query) => {
 try {
 const cache = JSON.parse(localStorage.getItem('spothitch_city_cache') || '{}')
 return cache[query] || []
 } catch { return [] }
 }

 // Layer 2: sauvegarder résultats API dans le cache
 const _saveCityCache = (query, results) => {
 try {
 const cacheKey = 'spothitch_city_cache'
 const cache = JSON.parse(localStorage.getItem(cacheKey) || '{}')
 cache[query] = results
 const keys = Object.keys(cache)
 if (keys.length > 500) delete cache[keys[0]]
 localStorage.setItem(cacheKey, JSON.stringify(cache))
 } catch { /* ignore */ }
 }

 // Layer 3: villes du pays téléchargé offline
 const _getOfflineCountryCities = (query) => {
 try {
 const countries = JSON.parse(localStorage.getItem('spothitch_offline_countries') || '[]')
 const results = []
 for (const { code } of countries) {
 const citiesRaw = localStorage.getItem(`spothitch_cities_${code}`)
 if (!citiesRaw) continue
 const cities = JSON.parse(citiesRaw)
 for (const city of cities) {
 if (city.toLowerCase().includes(query)) results.push(city)
 }
 }
 return results
 } catch { return [] }
 }

 const renderVoyageSuggestions = (field, names) => {
 if (!names?.length) return ''
 return `<div class="bg-slate-800/95 backdrop-blur rounded-xl border border-white/10 overflow-hidden shadow-xl">
 ${names.slice(0, 5).map(name => {
 const safe = escapeJSString(name)
 return `<button onmousedown="event.preventDefault();(window.tripSelectSuggestion||function(f,n){var i=document.getElementById('trip-'+f);if(i)i.value=n;document.getElementById('trip-from-suggestions')?.classList.add('hidden');document.getElementById('trip-to-suggestions')?.classList.add('hidden')})('${field}','${safe}')" class="w-full px-3 py-2.5 text-left text-white hover:bg-white/10 border-b border-white/5 last:border-0 transition-colors"><div class="font-medium text-sm truncate">${safe}</div></button>`
 }).join('')}
 </div>`
 }

 let voyageDebounce = null
 let suggestionDismissTimer = null
 // Guarded by if (!window.tripSearchSuggestions) at line 1237
 window.tripSearchSuggestions = (field, query) => {
 clearTimeout(voyageDebounce)
 // Auto-dismiss suggestions after 4s of no typing (user probably moved on)
 clearTimeout(suggestionDismissTimer)
 suggestionDismissTimer = setTimeout(() => {
 document.getElementById('trip-from-suggestions')?.classList.add('hidden')
 document.getElementById('trip-to-suggestions')?.classList.add('hidden')
 }, 4000)
 const container = document.getElementById(`trip-${field}-suggestions`)
 if (!container) return
 if (!query || query.trim().length < 1) {
 container.classList.add('hidden')
 return
 }

 const q = query.trim().toLowerCase()

 // Layer 1: villes populaires (instant)
 const localMatches = POPULAR_CITIES_VOYAGE.filter(c => c.toLowerCase().includes(q))
 // Layer 2: cache localStorage
 const cachedMatches = _getCachedCities(q)
 // Layer 3: pays offline
 const offlineMatches = _getOfflineCountryCities(q)

 const instantMatches = [...new Set([...localMatches, ...cachedMatches, ...offlineMatches])].slice(0, 5)

 if (instantMatches.length > 0) {
 container.classList.remove('hidden')
 container.innerHTML = renderVoyageSuggestions(field, instantMatches)
 }

 // Layer 4: API search (Photon + Nominatim in parallel), sauvegarde dans le cache
 voyageDebounce = setTimeout(async () => {
 try {
 const trimQ = query.trim()
 const { searchPhoton } = await import('../../services/osrm.js')
 const results = await searchPhoton(trimQ)
 const currentInput = document.getElementById(`trip-${field}`)
 if (!currentInput || currentInput.value.trim() !== trimQ) return
 if (results?.length > 0) {
 const apiNames = results.map(r => r.fullName || r.name)
 _saveCityCache(q, apiNames.slice(0, 5))
 const merged = [...new Set([...localMatches, ...offlineMatches, ...apiNames])].slice(0, 5)
 container.classList.remove('hidden')
 container.innerHTML = renderVoyageSuggestions(field, merged)
 } else if (instantMatches.length === 0) {
 container.classList.add('hidden')
 }
 } catch {
 // API failed — fallback to Nominatim
 try {
 const trimQ = query.trim()
 const currentInput = document.getElementById(`trip-${field}`)
 if (!currentInput || currentInput.value.trim() !== trimQ) return
 const { searchLocation } = await import('../../services/osrm.js')
 const results = await searchLocation(trimQ)
 if (!currentInput || currentInput.value.trim() !== trimQ) return
 if (results?.length) {
 _saveCityCache(q, results.map(r => r.name).slice(0, 5))
 const merged = [...new Set([...instantMatches, ...results.map(r => r.name)])].slice(0, 5)
 container.classList.remove('hidden')
 container.innerHTML = renderVoyageSuggestions(field, merged)
 } else if (instantMatches.length === 0) {
 container.classList.add('hidden')
 }
 } catch { /* both APIs failed, keep instant results */ }
 }
 }, 100)
 }

 // Dismiss suggestions when clicking outside input/suggestion area
 document.addEventListener('mousedown', (e) => {
 const target = e.target
 if (target.closest('#trip-from, #trip-to, #trip-from-suggestions, #trip-to-suggestions')) return
 document.getElementById('trip-from-suggestions')?.classList.add('hidden')
 document.getElementById('trip-to-suggestions')?.classList.add('hidden')
 })

 // Dismiss suggestions on Escape key
 document.addEventListener('keydown', (e) => {
 if (e.key === 'Escape') {
 document.getElementById('trip-from-suggestions')?.classList.add('hidden')
 document.getElementById('trip-to-suggestions')?.classList.add('hidden')
 }
 })
}
