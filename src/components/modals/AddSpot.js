import { t } from '../../i18n/index.js'
import { icon } from '../../utils/icons.js'
import { escapeHTML } from '../../utils/sanitize.js'
import { renderAddSpot, renderGmapsTipCard, WAIT_STEPS, detectSeason, renderStep1, renderStep2, renderStep3, renderOfflineDraftButton, renderStepProgress } from './addSpotRender.js'
export { renderAddSpot }

// Form state — ALL data structured for export/analysis
window.spotFormData = window.spotFormData || {
 photos: [],
 lat: null,
 lng: null,
 ratings: { safety: 0, traffic: 0, accessibility: 0 },
 tags: {
 shelter: false,
 waterFood: false,
 toilets: false,
 visibility: false,
 stoppingSpace: false,
 },
 country: null,
 countryName: null,
 departureCity: null,
 departureCityCoords: null,
 directionCity: null,
 directionCityCoords: null,
 locationName: null,
 roadNumber: null,
 positionSource: null,
 method: null, // 'sign' | 'thumb' | 'asking'
 groupSize: null, // 'solo' | 'duo' | 'group'
 timeOfDay: null, // 'morning' | 'afternoon' | 'evening' | 'night'
 waitTime: null, // minutes (number)
 season: null, // auto-detected
 extraDestinations: [], // additional destinations [{city, coords}]
}

// Star rating descriptions map
const starDescriptions = {
 safety: (v) => t(`safetyDesc${v}`) || '',
 traffic: (v) => t(`trafficDesc${v}`) || '',
 accessibility: (v) => t(`accessibilityDesc${v}`) || '',
}

// Global handlers
window.triggerPhotoUpload = () => {
 document.getElementById('spot-photo')?.click()
}

window.handlePhotoSelect = async (event) => {
 const file = event.target.files?.[0]
 if (!file) return

 if (!window.spotFormData.photos) window.spotFormData.photos = []
 if (window.spotFormData.photos.length >= 5) {
 const { showError } = await import('../../services/notifications.js')
 showError(t('maxPhotos'))
 return
 }

 try {
 const { compressImage } = await import('../../utils/image.js')
 const compressed = await compressImage(file, 1200, 0.75)
 window.spotFormData.photos.push(compressed)

 // Update photo thumbnails inline (avoid full re-render that resets type)
 const photoZone = document.getElementById('spot-photo-zone')
 if (photoZone) {
 // Add thumbnail directly
 const thumb = document.createElement('div')
 thumb.style.cssText = 'width:60px;height:60px;border-radius:8px;overflow:hidden;position:relative;flex-shrink:0'
 thumb.innerHTML = `<img src="${compressed}" style="width:100%;height:100%;object-fit:cover" alt="Photo ${window.spotFormData.photos.length}">
 <button type="button" onclick="removeSpotPhoto(${window.spotFormData.photos.length - 1})" style="position:absolute;top:2px;right:2px;width:18px;height:18px;background:rgba(0,0,0,0.6);border-radius:50%;border:none;color:white;font-size:10px;cursor:pointer;display:flex;align-items:center;justify-content:center" aria-label="${escapeHTML(t('removePhoto') || 'Remove photo')}">✕</button>`
 const uploadBtn = photoZone.querySelector('label, [for="spot-photo"]')?.parentElement
 if (uploadBtn) photoZone.insertBefore(thumb, uploadBtn)
 // Hide upload button if max reached
 if (window.spotFormData.photos.length >= 5 && uploadBtn) uploadBtn.style.display = 'none'
 } else {
 // Fallback: full re-render
 const { setState } = await import('../../stores/state.js')
 setState({ _photoRefresh: Date.now() })
 }
 } catch (error) {
 console.error('Photo processing failed:', error)
 const { showError } = await import('../../services/notifications.js')
 showError(t('photoError') || 'Erreur lors du traitement de la photo')
 }
}

window.removeSpotPhoto = async (index) => {
 if (!window.spotFormData.photos) return
 window.spotFormData.photos.splice(index, 1)
 const { setState } = await import('../../stores/state.js')
 setState({ _photoRefresh: Date.now() })
}

window.setSpotRating = (criterion, value) => {
 window.spotFormData.ratings = window.spotFormData.ratings || {}
 window.spotFormData.ratings[criterion] = value

 // Update bar segments (v3 design)
 const buttons = document.querySelectorAll(`button[data-criterion="${criterion}"]`)
 buttons.forEach((btn) => {
 const star = parseInt(btn.dataset.star, 10)
 btn.style.background = star <= value ? '#f59e0b' : '#1a1f2e'
 })

 const valueEl = document.getElementById(`spot-rating-value-${criterion}`)
 if (valueEl) valueEl.textContent = `${value}/5`

 const descEl = document.getElementById(`spot-rating-desc-${criterion}`)
 if (descEl) {
 const descFn = starDescriptions[criterion]
 descEl.textContent = descFn ? descFn(value) : ''
 }
}

// Spot type selection (big buttons) — DOM-only update, no re-render
window.selectSpotType = (type) => {
 window.spotFormData.spotType = type
 // Update button styles directly (must override inline styles)
 document.querySelectorAll('.spot-type-btn').forEach(btn => {
 const btnType = btn.getAttribute('onclick')?.match(/'(\w+)'/)?.[1]
 const isActive = btnType === type
 if (isActive) {
 btn.classList.add('active')
 btn.style.border = '1px solid #f59e0b'
 btn.style.background = 'rgba(245,158,11,0.07)'
 btn.style.color = '#f59e0b'
 } else {
 btn.classList.remove('active')
 btn.style.border = '1px solid #1a1f2e'
 btn.style.background = '#1a1f2e'
 btn.style.color = '#64748b'
 }
 })
 // Store in spotFormData AND state for persistence (no re-render)
 window.spotFormData.spotType = type
 import('../../stores/state.js').then(({ setState }) => {
 setState({ addSpotType: type, _skipRender: true })
 })
}

// Wait time slider — DOM-only, no re-render
window.setWaitTime = (sliderIndex) => {
 const idx = parseInt(sliderIndex, 10)
 const minutes = WAIT_STEPS[idx] || 10
 window.spotFormData.waitTime = minutes
 const display = document.getElementById('wait-time-display')
 if (display) {
 display.textContent = minutes >= 180 ? '3h+' : minutes + ' min'
 }
}

// Helper: update tab bar inline styles (inline styles override CSS classes)
function updateTabBar(selector, activeValue, activeColor = '#f59e0b') {
 document.querySelectorAll(selector).forEach(btn => {
 const val = btn.getAttribute('onclick')?.match(/'(\w+)'/)?.[1]
 const isActive = val === activeValue
 btn.style.color = isActive ? activeColor : '#64748b'
 btn.style.borderBottom = isActive ? `2px solid ${activeColor}` : 'none'
 btn.style.marginBottom = isActive ? '-1px' : ''
 })
}

// Method selection — DOM-only, no re-render
window.setMethod = (method) => {
 window.spotFormData.method = method
 updateTabBar('[onclick*="setMethod"]', method)
}

// Group size selection — DOM-only, no re-render
window.setGroupSize = (size) => {
 window.spotFormData.groupSize = size
 updateTabBar('[onclick*="setGroupSize"]', size)
}

// Time of day selection — DOM-only, no re-render
window.setTimeOfDay = (time) => {
 window.spotFormData.timeOfDay = time
 updateTabBar('[onclick*="setTimeOfDay"]', time)
}

// Ride result — DOM-only, no re-render (prevents data loss)
window.setRideResult = (result) => {
 window.spotFormData.rideResult = result
 const color = result === 'yes' ? '#22c55e' : result === 'no' ? '#ef4444' : '#64748b'
 updateTabBar('[onclick*="setRideResult"]', result, color)
}

// Multi-destination handlers
window.addSpotDestination = async () => {
 if (!window.spotFormData.extraDestinations) window.spotFormData.extraDestinations = []
 if (window.spotFormData.extraDestinations.length >= 4) {
 const { showError } = await import('../../services/notifications.js')
 showError(t('maxDestinations'))
 return
 }
 const wrapper = document.getElementById('extra-dest-wrapper')
 const btn = document.getElementById('add-dest-btn')
 if (wrapper && btn) {
 wrapper.style.display = 'block'
 btn.style.display = 'none'
 const input = document.getElementById('spot-extra-dest')
 if (input) {
 input.focus()
 // Init autocomplete for extra destination
 import('../../utils/autocomplete.js').then(({ initAutocomplete }) => {
 import('../../services/osrm.js').then(({ searchPhoton }) => {
 initAutocomplete({
 inputId: 'spot-extra-dest',
 searchFn: (q) => {
 const depCoords = window.spotFormData.departureCityCoords
 const spotLat = window.spotFormData.lat
 const spotLng = window.spotFormData.lng
 const biasLat = depCoords?.lat || spotLat || null
 const biasLng = depCoords?.lng || spotLng || null
 return searchPhoton(q, { biasLat, biasLng })
 },
 debounceMs: 100,
 forceSelection: true,
 onSelect: async (item) => {
 const city = item.name
 const coords = { lat: item.lat, lng: item.lng }
 // Check for duplicates
 const mainDest = window.spotFormData.directionCity || ''
 const extras = window.spotFormData.extraDestinations || []
 const allCities = [mainDest, ...extras.map(d => d.city)].map(c => c.toLowerCase())
 if (allCities.includes(city.toLowerCase())) {
 const { showError } = await import('../../services/notifications.js')
 showError(t('destinationAlreadyExists'))
 return
 }
 window.spotFormData.extraDestinations.push({ city, coords })
 // Re-render step 2
 document.activeElement?.blur()
 const { setState } = await import('../../stores/state.js')
 setState({ addSpotStep: 2 })
 },
 onClear: () => {},
 })
 })
 })
 }
 }
}

window.removeSpotDestination = (index) => {
 if (!window.spotFormData.extraDestinations) return
 window.spotFormData.extraDestinations.splice(index, 1)
 // Remove the destination chip from DOM directly (no re-render)
 const chips = document.querySelectorAll('[onclick*="removeSpotDestination"]')
 const chip = chips[index]
 if (chip) {
 const row = chip.closest('.flex.items-center')
 if (row) row.remove()
 // Re-index remaining remove buttons
 document.querySelectorAll('[onclick*="removeSpotDestination"]').forEach((btn, i) => {
 btn.setAttribute('onclick', `removeSpotDestination(${i})`)
 })
 }
}

// Toggle amenity chip — DOM-only, no re-render
window.toggleAmenity = (name) => {
 window.spotFormData.tags = window.spotFormData.tags || {}
 window.spotFormData.tags[name] = !window.spotFormData.tags[name]
 const isActive = window.spotFormData.tags[name]
 const chip = document.querySelector(`[onclick*="toggleAmenity('${name}')"]`)
 if (chip) {
 chip.style.borderBottom = isActive ? '2px solid #f59e0b' : 'none'
 chip.style.color = isActive ? '#f59e0b' : '#64748b'
 }
}

// Experience date handlers (Step 3)
window.setExperienceDate = (mode) => {
 const isCustom = mode === 'custom'
 window.spotFormData._expCustom = isCustom

 // Update button styles
 const todayBtn = document.getElementById('exp-date-today')
 const customBtn = document.getElementById('exp-date-custom')
 const selectors = document.getElementById('exp-date-selectors')
 if (todayBtn) {
 todayBtn.style.borderBottom = !isCustom ? '2px solid #f59e0b' : 'none'
 todayBtn.style.color = !isCustom ? '#f59e0b' : '#64748b'
 }
 if (customBtn) {
 customBtn.style.borderBottom = isCustom ? '2px solid #f59e0b' : 'none'
 customBtn.style.color = isCustom ? '#f59e0b' : '#64748b'
 }
 if (selectors) selectors.style.display = isCustom ? 'flex' : 'none'

 if (!isCustom) {
 // Today
 const now = new Date()
 window.spotFormData.experienceYear = now.getFullYear()
 window.spotFormData.experienceMonth = now.getMonth() + 1
 window.spotFormData.experienceDay = now.getDate()
 } else {
 // Custom — read from selectors
 delete window.spotFormData.experienceDay
 window.updateExperienceDate()
 }
}

window.updateExperienceDate = () => {
 const monthEl = document.getElementById('exp-month')
 const yearEl = document.getElementById('exp-year')
 const now = new Date()
 let month = monthEl ? parseInt(monthEl.value, 10) : now.getMonth() + 1
 let year = yearEl ? parseInt(yearEl.value, 10) : now.getFullYear()
 // Clamp to valid range: not in the future, not before 2000
 if (year > now.getFullYear() || (year === now.getFullYear() && month > now.getMonth() + 1)) {
 year = now.getFullYear()
 month = now.getMonth() + 1
 }
 if (year < 2000) year = 2000
 if (month < 1) month = 1
 if (month > 12) month = 12
 window.spotFormData.experienceMonth = month
 window.spotFormData.experienceYear = year
 delete window.spotFormData.experienceDay
}

// Keep backward compat for setSpotTag — DOM-only, no re-render
window.setSpotTag = (tagName, value) => {
 window.spotFormData.tags = window.spotFormData.tags || {}
 if (tagName === 'signMethod') {
 window.spotFormData.tags.signMethod = window.spotFormData.tags.signMethod === value ? null : value
 } else {
 window.spotFormData.tags[tagName] = value === true || value === 'true'
 }
 // Update chip visuals directly
 const chip = document.querySelector(`[onclick*="setSpotTag('${tagName}'"]`)
 if (chip) chip.classList.toggle('active')
}

// Alias for wiring compatibility
window.onSpotTypeChange = (spotType) => { window.selectSpotType(spotType) }

// Fast step swap — updates only the form content instead of re-rendering the entire page
function swapStepContent(newStep, state) {
 const form = document.getElementById('add-spot-form')
 if (!form) return false
 const stepHtml =
 newStep === 1 ? renderStep1(state) :
 newStep === 2 ? renderStep2(state) :
 newStep === 3 ? renderStep3(state) + (renderOfflineDraftButton() || '') : ''
 if (!stepHtml) return false
 form.innerHTML = stepHtml
 // Update step progress (find the container above the form)
 const formParent = form.parentElement
 if (formParent) {
 const progressEl = formParent.querySelector('[style*="display:flex"][style*="align-items:center"][style*="gap:12px"]')
 const titleEl = formParent.querySelector('[style*="font-size:22px"]')
 if (progressEl) {
 // renderStepProgress includes both circles and title — remove old title first
 if (titleEl) titleEl.remove()
 progressEl.outerHTML = renderStepProgress(newStep)
 } else if (titleEl) {
 const stepTitles = [
 t('stepWhereIsSpot') || 'Où est le spot ?',
 t('stepExperience') || 'Ton expérience',
 t('stepDetails') || 'Derniers détails',
 ]
 titleEl.textContent = stepTitles[newStep - 1]
 }
 }
 // Scroll to top
 formParent?.scrollTo?.({ top: 0 })
 // Re-init autocomplete for the new step
 requestAnimationFrame(() => {
 cleanupAutocompletes()
 if (newStep === 1) { initStep1Autocomplete(); initMiniMapPreview() }
 else if (newStep === 2) {
 initStep2Autocomplete()
 // Auto-focus destination input — fixes iOS touch/focus issues after step swap
 const dirInput = document.getElementById('spot-direction-city')
 if (dirInput) {
 // Small delay to let iOS process the DOM change before focusing
 setTimeout(() => dirInput.focus(), 150)
 }
 }
 })
 return true
}

// Step navigation
window.addSpotNextStep = async () => {
 // Rate limit: prevent rapid clicks
 if (window.addSpotNextStep._busy) return
 window.addSpotNextStep._busy = true
 setTimeout(() => { window.addSpotNextStep._busy = false }, 1000)

 const { getState, setState } = await import('../../stores/state.js')
 const { showError } = await import('../../services/notifications.js')
 const state = getState()
 const currentStep = state.addSpotStep || 1

 if (currentStep === 1) {
 // Validate type + position + departure city (photo is optional for bonus points)
 const spotType = state.addSpotType || window.spotFormData.spotType
 if (!spotType) {
 showError(t('selectSpotType') || 'Choisis un type de spot')
 return
 }
 if (!window.spotFormData.lat || !window.spotFormData.lng) {
 showError(t('positionRequired') || 'Position obligatoire')
 return
 }
 if (!window.spotFormData.departureCity) {
 showError(t('departureRequired') || 'Ville de départ obligatoire')
 return
 }
 document.activeElement?.blur()

 // Check for nearby existing spots BEFORE going to step 2
 if (!window.spotFormData._duplicateConfirmed) {
 const allSpots = state.spots || []
 const userLat = Number(window.spotFormData.lat)
 const userLng = Number(window.spotFormData.lng)
 if (isFinite(userLat) && isFinite(userLng) && allSpots.length > 0) {
 const { distanceMeters } = await import('../../services/locationHistory.js')
 const nearby = allSpots
 .map(s => {
 const sLat = s.coordinates?.lat || s.lat
 const sLng = s.coordinates?.lng || s.lng
 if (!sLat || !sLng) return null
 const dist = distanceMeters(userLat, userLng, sLat, sLng)
 return dist < 500 ? { ...s, _distance: Math.round(dist) } : null
 })
 .filter(Boolean)
 .sort((a, b) => a._distance - b._distance)
 .slice(0, 3)
 if (nearby.length > 0) {
 setState({
 nearbySpotChoiceData: nearby,
 nearbyUserPin: { lat: userLat, lng: userLng },
 addSpotType: spotType,
 })
 return // Stop here — user chooses via modal
 }
 }
 }

 // No nearby spots (or user already confirmed) → go to step 2
 const newState = { ...state, addSpotStep: 2, addSpotType: spotType }
 if (swapStepContent(2, newState)) {
 document.activeElement?.blur()
 setState({ addSpotStep: 2, addSpotType: spotType, _skipRender: true })
 } else {
 document.activeElement?.blur()
 setState({ addSpotStep: 2, addSpotType: spotType })
 }
 } else if (currentStep === 2) {
 // Validate direction + experience fields (all mandatory)
 if (!window.spotFormData.directionCity) {
 showError(t('destinationRequired') || 'Destination obligatoire')
 return
 }
 if (!window.spotFormData.method) {
 showError(t('methodRequired'))
 return
 }
 if (!window.spotFormData.groupSize) {
 showError(t('groupSizeRequired'))
 return
 }
 if (!window.spotFormData.timeOfDay) {
 showError(t('timeOfDayRequired'))
 return
 }
 if (!window.spotFormData.rideResult) {
 showError(t('rideResultRequired'))
 return
 }
 document.activeElement?.blur()
 const newState = { ...state, addSpotStep: 3 }
 if (swapStepContent(3, newState)) {
 setState({ addSpotStep: 3, _skipRender: true })
 } else {
 setState({ addSpotStep: 3 })
 }
 }
}

window.addSpotPrevStep = async () => {
 const { getState, setState } = await import('../../stores/state.js')
 const state = getState()
 const currentStep = state.addSpotStep || 1
 if (currentStep > 1) {
 document.activeElement?.blur()
 const newStep = currentStep - 1
 const newState = { ...state, addSpotStep: newStep }
 if (swapStepContent(newStep, newState)) {
 setState({ addSpotStep: newStep, _skipRender: true })
 } else {
 document.activeElement?.blur()
 setState({ addSpotStep: newStep })
 }
 }
}

// Google Maps share tip handlers
window._dismissGmapsTip = (checked) => {
 try {
 if (checked) {
 localStorage.setItem('spothitch_gmaps_tip_hidden', '1')
 const card = document.getElementById('gmaps-tip-card')
 if (card) {
 card.outerHTML = `<div class="text-center pt-2">
 <span onclick="window._showGmapsTipFull()"
 class="text-[11px] text-amber-500 cursor-pointer underline" role="button" tabindex="0">
 ${t('gmapsTipLink')}
 </span></div>`
 }
 } else {
 localStorage.removeItem('spothitch_gmaps_tip_hidden')
 }
 } catch { /* no-op */ }
}

window._showGmapsTipFull = () => {
 try { localStorage.removeItem('spothitch_gmaps_tip_hidden') } catch { /* no-op */ }
 // Replace the link with the full tip card via DOM
 const link = document.querySelector('[onclick*="_showGmapsTipFull"]')
 if (link?.parentElement) {
 const wrapper = link.parentElement
 wrapper.outerHTML = renderGmapsTipCard()
 }
}


// GPS position
window.useGPSForSpot = () => {
 const display = document.getElementById('location-display')

 if (!navigator.geolocation) {
 if (display) display.textContent = t('geoNotSupported') || 'Géolocalisation non supportée'
 return
 }

 if (display) display.innerHTML = `${icon('loader-circle', 'w-5 h-5 animate-spin')} ${t('locating') || 'Localisation...'}`

 navigator.geolocation.getCurrentPosition(
 async (position) => {
 window.spotFormData.lat = position.coords.latitude
 window.spotFormData.lng = position.coords.longitude
 window.spotFormData.positionSource = 'gps'

 try {
 const { reverseGeocode } = await import('../../services/osrm.js')
 const location = await reverseGeocode(position.coords.latitude, position.coords.longitude)

 if (location) {
 if (location.countryCode) {
 window.spotFormData.country = location.countryCode
 window.spotFormData.countryName = location.country
 }
 if (location.city) {
 const departureCityInput = document.getElementById('spot-departure-city')
 if (departureCityInput && !departureCityInput.value) {
 departureCityInput.value = location.city
 window.spotFormData.departureCity = location.city
 window.spotFormData.departureCityCoords = {
 lat: position.coords.latitude,
 lng: position.coords.longitude,
 }
 }
 }
 if (display) {
 display.innerHTML = `
 ${icon('circle-check', 'w-5 h-5 text-success-400')}
 ${location.city || 'Position'} (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})
 `
 }
 }
 } catch { /* no-op */ }

 // Re-render to show position preview card
 document.activeElement?.blur()
 const { setState } = await import('../../stores/state.js')
 setState({ addSpotStep: 1 })
 },
 (error) => {
 if (display) display.textContent = t('positionError') || "Impossible d'obtenir la position"
 console.error('Geolocation error:', error)
 },
 { enableHighAccuracy: true, timeout: 10000 }
 )
}


// Fullscreen map picker for AddSpot
let fullscreenMap = null
let fullscreenMapMarker = null

// Open fullscreen map picker overlay
window.openFullscreenMapPicker = async () => {
 // Create overlay
 const overlay = document.createElement('div')
 overlay.id = 'fullscreen-map-picker'
 overlay.className = 'fixed inset-0 z-[60] bg-dark-primary flex flex-col'
 overlay.innerHTML = `
 <div class="flex items-center justify-between px-4 py-3 bg-dark-primary/90 backdrop-blur-sm border-b border-white/10">
 <button type="button" id="fmp-cancel" class="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5">
 ${icon('arrow-left', 'w-4 h-4 inline mr-1')} ${t('cancel') || 'Annuler'}
 </button>
 <span class="text-sm font-medium text-slate-300">${t('chooseOnMap') || 'Choisir sur la carte'}</span>
 <div class="w-20"></div></div>
 <div id="fmp-map" class="flex-1 relative"></div>
 <div id="fmp-info" class="px-4 py-2 bg-dark-primary/90 backdrop-blur-sm border-t border-white/10 text-center text-xs text-amber-400/80 font-medium">
 ${t('tapToPlaceSpot') || 'Touche la carte pour placer ton spot'}
 </div>
 <div class="px-4 py-3 bg-dark-primary/90 backdrop-blur-sm border-t border-white/10">
 <button type="button" id="fmp-confirm" class="btn btn-primary w-full text-base" disabled>
 ${icon('check', 'w-5 h-5')} ${t('confirmPosition') || 'Confirmer la position'}
 </button></div>
 `
 document.body.appendChild(overlay)

 // Prevent body scroll
 document.body.style.overflow = 'hidden'

 let pickedLat = window.spotFormData?.lat || null
 let pickedLng = window.spotFormData?.lng || null
 let pickedCity = ''

 try {
 await import('maplibre-gl/dist/maplibre-gl.css')
 const maplibregl = await import('maplibre-gl')

 // Center on existing position, user location, or default
 let center = [2.35, 48.85]
 let zoom = 5
 if (window._pendingShareCoords) {
 center = [window._pendingShareCoords.lng, window._pendingShareCoords.lat]
 zoom = 14
 pickedLat = window._pendingShareCoords.lat
 pickedLng = window._pendingShareCoords.lng
 } else if (pickedLat && pickedLng) {
 center = [pickedLng, pickedLat]
 zoom = 14
 } else {
 try {
 const { getState } = await import('../../stores/state.js')
 const loc = getState().userLocation
 if (loc?.lat && loc?.lng) {
 center = [loc.lng, loc.lat]
 zoom = 13
 }
 } catch { /* no-op */ }
 }

 // Try to reuse the home map's already-loaded style for instant tiles
 let styleToUse = 'https://tiles.openfreemap.org/styles/liberty'
 try {
 const homeMap = window.homeMapInstance
 if (homeMap && typeof homeMap.getStyle === 'function') {
 const s = homeMap.getStyle()
 if (s && s.sources) styleToUse = s
 }
 } catch { /* use default URL */ }

 fullscreenMap = new maplibregl.default.Map({
 container: document.getElementById('fmp-map'),
 style: styleToUse,
 center,
 zoom,
 })

 // Ensure map renders properly after container is visible
 fullscreenMap.on('load', () => fullscreenMap.resize())
 setTimeout(() => fullscreenMap.resize(), 200)

 const confirmBtn = document.getElementById('fmp-confirm')
 const infoBar = document.getElementById('fmp-info')

 // Place existing marker if editing
 if (pickedLat && pickedLng) {
 fullscreenMapMarker = new maplibregl.default.Marker({ color: '#f59e0b' })
 .setLngLat([pickedLng, pickedLat])
 .addTo(fullscreenMap)
 confirmBtn.disabled = false
 // Reverse geocode existing position
 try {
 const { reverseGeocode } = await import('../../services/osrm.js')
 const location = await reverseGeocode(pickedLat, pickedLng)
 pickedCity = location?.city || ''
 if (infoBar) {
 infoBar.innerHTML = `<span class="text-green-400">${icon('map-pin', 'w-3.5 h-3.5 inline')} ${escapeHTML(pickedCity || '')} ${pickedLat.toFixed(5)}, ${pickedLng.toFixed(5)}</span>`
 }
 } catch { /* no-op */ }
 }

 // Handle share coords
 if (window._pendingShareCoords) {
 window._pendingShareCoords = null
 }

 fullscreenMap.on('click', async (e) => {
 pickedLat = e.lngLat.lat
 pickedLng = e.lngLat.lng

 // Move or create marker
 if (fullscreenMapMarker) {
 fullscreenMapMarker.setLngLat([pickedLng, pickedLat])
 } else {
 fullscreenMapMarker = new maplibregl.default.Marker({ color: '#f59e0b' })
 .setLngLat([pickedLng, pickedLat])
 .addTo(fullscreenMap)
 }

 confirmBtn.disabled = false

 // Update info bar with loading
 if (infoBar) {
 infoBar.innerHTML = `<span class="text-amber-400">${pickedLat.toFixed(5)}, ${pickedLng.toFixed(5)}</span>`
 }

 // Reverse geocode
 try {
 const { reverseGeocode } = await import('../../services/osrm.js')
 const location = await reverseGeocode(pickedLat, pickedLng)
 pickedCity = location?.city || ''
 if (location?.countryCode) {
 window.spotFormData.country = location.countryCode
 window.spotFormData.countryName = location.country
 }
 if (infoBar) {
 infoBar.innerHTML = `<span class="text-green-400">${icon('map-pin', 'w-3.5 h-3.5 inline')} ${pickedCity ? escapeHTML(pickedCity) + ' \u00b7 ' : ''}${pickedLat.toFixed(5)}, ${pickedLng.toFixed(5)}</span>`
 }
 } catch {
 if (infoBar) {
 infoBar.innerHTML = `<span class="text-green-400">${icon('map-pin', 'w-3.5 h-3.5 inline')} ${pickedLat.toFixed(5)}, ${pickedLng.toFixed(5)}</span>`
 }
 }
 })

 // Confirm button
 confirmBtn.addEventListener('click', async () => {
 if (pickedLat == null || pickedLng == null) return

 window.spotFormData.lat = pickedLat
 window.spotFormData.lng = pickedLng
 window.spotFormData.positionSource = 'map'
 if (pickedCity) {
 window.spotFormData.locationName = pickedCity
 const departureCityInput = document.getElementById('spot-departure-city')
 if (departureCityInput && !departureCityInput.value) {
 departureCityInput.value = pickedCity
 window.spotFormData.departureCity = pickedCity
 window.spotFormData.departureCityCoords = { lat: pickedLat, lng: pickedLng }
 }
 if (!window.spotFormData.departureCity) {
 window.spotFormData.departureCity = pickedCity
 window.spotFormData.departureCityCoords = { lat: pickedLat, lng: pickedLng }
 }
 }

 closeFullscreenMapPicker()

 // Re-render step 1 to show the position preview card
 document.activeElement?.blur()
 const { setState } = await import('../../stores/state.js')
 setState({ addSpotStep: 1 })
 })

 // Cancel button
 document.getElementById('fmp-cancel').addEventListener('click', closeFullscreenMapPicker)

 } catch (error) {
 console.error('Fullscreen map init failed:', error)
 closeFullscreenMapPicker()
 }
}

function closeFullscreenMapPicker() {
 if (fullscreenMap) {
 try { fullscreenMap.remove() } catch { /* no-op */ }
 fullscreenMap = null
 fullscreenMapMarker = null
 }
 const overlay = document.getElementById('fullscreen-map-picker')
 if (overlay) overlay.remove()
 document.body.style.overflow = ''
}

// Legacy stubs for backward compat (wiring tests)
window.toggleSpotMapPicker = async () => {}
window.spotMapPickLocation = () => {}

// Gas station verification — checks Overpass for fuel amenity within 300m
async function verifyGasStationNearby(lat, lng) {
 try {
 const radius = 300
 const query = `[out:json][timeout:5];(node["amenity"="fuel"](around:${radius},${lat},${lng}););out center 1;`
 const resp = await Promise.race([
  fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`),
  new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000)),
 ])
 if (!resp.ok) return { verified: false, error: 'api' }
 const ct = resp.headers.get('content-type') || ''
 if (!ct.includes('json')) return { verified: false, error: 'overloaded' }
 const data = await resp.json()
 const found = data.elements && data.elements.length > 0
 return { verified: found }
 } catch {
 return { verified: false, error: 'network' }
 }
}

// Show gas station confirmation overlay — returns 'keep' or 'change'
function showGasStationConfirm() {
 return new Promise((resolve) => {
 const overlay = document.createElement('div')
 overlay.id = 'gas-station-confirm'
 overlay.className = 'fixed inset-0 z-[10000] bg-black/70 flex items-center justify-center p-5'
 overlay.innerHTML = `
 <div class="bg-[#0f1520] rounded-2xl p-6 max-w-[340px] w-full border border-[#1a1f2e]">
 <div class="text-center mb-4">
 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></div>
 <div class="text-base font-semibold text-slate-200 mb-2 text-center">${t('noStationConfirmTitle')}</div>
 <div class="text-sm text-slate-400 mb-6 text-center leading-relaxed">${t('noStationConfirmMessage')}</div>
 <div class="flex flex-col gap-2.5">
 <button id="gas-confirm-keep" class="p-3.5 rounded-[10px] border border-slate-700 bg-transparent text-slate-200 text-sm cursor-pointer">${t('noStationKeep')}</button>
 <button id="gas-confirm-change" class="p-3.5 rounded-[10px] border-0 bg-amber-500 text-[#0f1520] text-sm font-semibold cursor-pointer">${t('noStationChange')}</button></div></div>
 `
 document.body.appendChild(overlay)
 document.getElementById('gas-confirm-keep').addEventListener('click', () => {
 overlay.remove()
 resolve('keep')
 })
 document.getElementById('gas-confirm-change').addEventListener('click', () => {
 overlay.remove()
 resolve('change')
 })
 })
}

// Auto-detect spot type based on GPS position
window.autoDetectStation = async () => {
 const { showSuccess, showError } = await import('../../services/notifications.js')
 const lat = window.spotFormData?.lat
 const lng = window.spotFormData?.lng
 if (!lat || !lng) {
 showError(t('placeSpotFirst') || 'Place d\'abord ton spot sur la carte')
 return
 }
 try {
 const btn = document.querySelector('[onclick*="autoDetectStation"]')
 if (btn) btn.disabled = true
 const radius = 300
 const query = `[out:json][timeout:10];(node["amenity"="fuel"](around:${radius},${lat},${lng}););out center 1;`
 const resp = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
 const data = await resp.json()
 if (data.elements && data.elements.length > 0) {
 window.selectSpotType('gas_station')
 showSuccess(t('stationDetected') || 'Station-service detectee a proximite !')
 } else {
 showSuccess(t('noStationNearby') || 'Pas de station-service dans un rayon de 300m')
 }
 if (btn) btn.disabled = false
 } catch {
 showError(t('detectionFailed') || 'Detection impossible (pas de connexion ?)')
 }
}

window.autoDetectRoad = async () => {
 const { showSuccess, showError } = await import('../../services/notifications.js')
 const lat = window.spotFormData?.lat
 const lng = window.spotFormData?.lng
 if (!lat || !lng) {
 showError(t('placeSpotFirst') || 'Place d\'abord ton spot sur la carte')
 return
 }
 try {
 const btn = document.querySelector('[onclick*="autoDetectRoad"]')
 if (btn) btn.disabled = true
 const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=16&accept-language=${document.documentElement.lang || 'en'}`)
 const data = await resp.json()
 const road = (data.address?.road || '').toLowerCase()
 const roadType = data.address?.highway || ''
 const isHighway = /autoroute|motorway|highway|autobahn|autopista/i.test(road) ||
 /motorway|trunk/i.test(roadType)
 if (isHighway) {
 window.selectSpotType('on_ramp')
 showSuccess(t('highwayDetected') || 'Autoroute/voie rapide detectee !')
 } else {
 window.selectSpotType('roadside')
 showSuccess(t('roadDetected') || 'Route detectee')
 }
 if (btn) btn.disabled = false
 } catch {
 showError(t('detectionFailed') || 'Detection impossible (pas de connexion ?)')
 }
}

// Draft saving — saves ALL form data
window.saveDraftAndClose = async () => {
 const { saveSpotDraft } = await import('../../services/spotDrafts.js')
 const { setState, getState } = await import('../../stores/state.js')
 const { showSuccess } = await import('../../services/notifications.js')
 const state = getState()

 saveSpotDraft({
 ...window.spotFormData,
 spotType: state.addSpotType,
 addSpotStep: state.addSpotStep,
 addSpotMethod: state.addSpotMethod,
 addSpotGroupSize: state.addSpotGroupSize,
 addSpotTimeOfDay: state.addSpotTimeOfDay,
 addSpotWaitTime: state.addSpotWaitTime,
 })

 showSuccess(t('draftSaved') || 'Brouillon sauvegardé !')
 setState({ showAddSpot: false })
}

// Keep backward compat
window.saveSpotAsDraft = window.saveDraftAndClose

// Auto-save draft every 30s while AddSpot is open
let _autoSaveDraftTimer = null
export function startAutoSaveDraft() {
 stopAutoSaveDraft()
 _autoSaveDraftTimer = setInterval(async () => {
  const { getState } = await import('../../stores/state.js')
  if (!getState().showAddSpot) { stopAutoSaveDraft(); return }
  if (!window.spotFormData?.lat) return // Nothing to save
  try {
   const { saveSpotDraft } = await import('../../services/spotDrafts.js')
   const state = getState()
   saveSpotDraft({
    ...window.spotFormData,
    spotType: state.addSpotType,
    addSpotStep: state.addSpotStep,
    _autoSaved: true,
   })
  } catch { /* ignore */ }
 }, 30000)
}
export function stopAutoSaveDraft() {
 if (_autoSaveDraftTimer) { clearInterval(_autoSaveDraftTimer); _autoSaveDraftTimer = null }
}

window.openSpotDraft = async (draftId) => {
 const { getSpotDrafts } = await import('../../services/spotDrafts.js')
 const { setState } = await import('../../stores/state.js')
 const drafts = getSpotDrafts()
 const draft = drafts.find(d => d.id === draftId)
 if (!draft) return

 // Restore ALL form data
 window.spotFormData = {
 photos: draft.photos || (draft.photo ? [draft.photo] : []),
 lat: draft.lat,
 lng: draft.lng,
 ratings: draft.ratings || { safety: 0, traffic: 0, accessibility: 0 },
 tags: draft.tags || {},
 country: draft.country,
 countryName: draft.countryName,
 departureCity: draft.departureCity,
 departureCityCoords: draft.departureCityCoords,
 directionCity: draft.directionCity,
 directionCityCoords: draft.directionCityCoords,
 locationName: draft.locationName,
 roadNumber: draft.roadNumber,
 positionSource: draft.positionSource,
 method: draft.method,
 groupSize: draft.groupSize,
 timeOfDay: draft.timeOfDay,
 waitTime: draft.waitTime,
 season: draft.season,
 stationName: draft.stationName || '',
 experienceYear: draft.experienceYear || new Date().getFullYear(),
 experienceMonth: draft.experienceMonth || (new Date().getMonth() + 1),
 experienceDay: draft.experienceDay || new Date().getDate(),
 _expCustom: draft._expCustom || false,
 }

 setState({
 showAddSpot: true,
 addSpotStep: draft.addSpotStep || 2,
 addSpotType: draft.spotType,
 addSpotMethod: draft.addSpotMethod || draft.method,
 addSpotGroupSize: draft.addSpotGroupSize || draft.groupSize,
 addSpotTimeOfDay: draft.addSpotTimeOfDay || draft.timeOfDay,
 addSpotWaitTime: draft.addSpotWaitTime || draft.waitTime,
 spotDraftsBannerVisible: false,
 })
}

window.deleteSpotDraft = async (draftId) => {
 const { deleteSpotDraft } = await import('../../services/spotDrafts.js')
 deleteSpotDraft(draftId)
 const { showToast } = await import('../../services/notifications.js')
 showToast(t('deleteDraft') || 'Brouillon supprimé', 'info')
 import('../../stores/state.js').then(({ setState }) => {
 setState({ spotDraftsBannerVisible: false })
 })
}

// Initialize autocomplete fields when step renders
let autocompleteCleanups = []

function initStep1Autocomplete() {
 if (!navigator.onLine) return

 import('../../utils/autocomplete.js').then(({ initAutocomplete }) => {
 import('../../services/osrm.js').then(({ searchPhoton }) => {
 const depInput = document.getElementById('spot-departure-city')
 if (depInput) {
 const ac = initAutocomplete({
 inputId: 'spot-departure-city',
 searchFn: (q) => searchPhoton(q, { countryCode: window.spotFormData.country }),
 debounceMs: 100,
 forceSelection: true,
 onSelect: (item) => {
 window.spotFormData.departureCity = item.name
 window.spotFormData.departureCityCoords = { lat: item.lat, lng: item.lng }
 if (item.countryCode && !window.spotFormData.country) {
 window.spotFormData.country = item.countryCode
 window.spotFormData.countryName = item.countryName
 }
 },
 onClear: () => {
 window.spotFormData.departureCity = null
 window.spotFormData.departureCityCoords = null
 },
 })
 // Restore selected item if city was already chosen (after re-render)
 if (window.spotFormData.departureCity && ac.setSelectedItem) {
 ac.setSelectedItem({
 name: window.spotFormData.departureCity,
 lat: window.spotFormData.departureCityCoords?.lat,
 lng: window.spotFormData.departureCityCoords?.lng,
 })
 }
 autocompleteCleanups.push(ac)
 }
 })
 })
}

function initStep2Autocomplete() {
 if (!navigator.onLine) return

 import('../../utils/autocomplete.js').then(({ initAutocomplete }) => {
 import('../../services/osrm.js').then(({ searchPhoton }) => {
 const dirInput = document.getElementById('spot-direction-city')
 if (dirInput) {
 const ac = initAutocomplete({
 inputId: 'spot-direction-city',
 searchFn: (q) => {
 // Bias results toward departure city / spot location for relevant suggestions
 const depCoords = window.spotFormData.departureCityCoords
 const spotLat = window.spotFormData.lat
 const spotLng = window.spotFormData.lng
 const biasLat = depCoords?.lat || spotLat || null
 const biasLng = depCoords?.lng || spotLng || null
 return searchPhoton(q, { biasLat, biasLng })
 },
 debounceMs: 100,
 forceSelection: false,
 onSelect: (item) => {
 window.spotFormData.directionCity = item.name
 window.spotFormData.directionCityCoords = { lat: item.lat, lng: item.lng }
 },
 onClear: () => {
 window.spotFormData.directionCityCoords = null
 },
 })
 // Restore selected item if direction was already chosen (after re-render)
 if (window.spotFormData.directionCity && ac.setSelectedItem) {
 ac.setSelectedItem({
 name: window.spotFormData.directionCity,
 lat: window.spotFormData.directionCityCoords?.lat,
 lng: window.spotFormData.directionCityCoords?.lng,
 })
 }
 autocompleteCleanups.push(ac)
 }
 })
 })
}

// Init mini-map preview — try to snapshot the existing home map, fallback to lightweight MapLibre
let miniMapInstance = null
function initMiniMapPreview() {
 const container = document.getElementById('addspot-mini-map')
 const lat = window.spotFormData?.lat
 const lng = window.spotFormData?.lng
 if (!container || !lat || !lng) return
 if (container.dataset.initialized === 'true') return
 container.dataset.initialized = 'true'

 // Try to use existing home map for instant snapshot
 const homeMap = window.homeMapInstance
 if (homeMap && typeof homeMap.getCanvas === 'function') {
 try {
 // Save current state, fly to spot, capture, restore
 const origCenter = homeMap.getCenter()
 const origZoom = homeMap.getZoom()
 homeMap.jumpTo({ center: [lng, lat], zoom: 14 })
 // Wait for tiles to render then capture
 const capture = () => {
 try {
 const srcCanvas = homeMap.getCanvas()
 const destCanvas = document.createElement('canvas')
 destCanvas.width = srcCanvas.width
 destCanvas.height = srcCanvas.height
 destCanvas.style.width = '100%'
 destCanvas.style.height = '100%'
 destCanvas.style.objectFit = 'cover'
 destCanvas.getContext('2d').drawImage(srcCanvas, 0, 0)
 container.innerHTML = ''
 container.appendChild(destCanvas)
 // Add amber marker overlay
 const marker = document.createElement('div')
 marker.innerHTML = '<svg width="28" height="38" viewBox="0 0 28 38"><path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.27 21.73 0 14 0z" fill="#f59e0b"/><circle cx="14" cy="14" r="6" fill="#fff"/></svg>'
 marker.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-100%);pointer-events:none'
 container.style.position = 'relative'
 container.appendChild(marker)
 } catch { /* canvas tainted — fall through to MapLibre */ }
 // Restore home map position
 homeMap.jumpTo({ center: origCenter, zoom: origZoom })
 }
 // Give a frame for tiles to render
 homeMap.once('idle', capture)
 setTimeout(capture, 500) // safety fallback
 return
 } catch { /* fall through to MapLibre */ }
 }

 // Fallback: create a lightweight MapLibre instance
 import('maplibre-gl').then(maplibregl => {
 if (miniMapInstance) {
 try { miniMapInstance.remove() } catch { /* ok */ }
 }
 miniMapInstance = new maplibregl.default.Map({
 container,
 style: 'https://tiles.openfreemap.org/styles/liberty',
 center: [lng, lat],
 zoom: 14,
 interactive: false,
 attributionControl: false,
 })
 new maplibregl.default.Marker({ color: '#f59e0b' })
 .setLngLat([lng, lat])
 .addTo(miniMapInstance)
 miniMapInstance.on('load', () => miniMapInstance.resize())
 setTimeout(() => miniMapInstance.resize(), 300)
 })
}

function cleanupAutocompletes() {
 autocompleteCleanups.forEach(c => c.destroy())
 autocompleteCleanups = []
}

// Init autocomplete when AddSpot modal DOM is ready
// Called from afterRender in App.js instead of using a global MutationObserver
let lastAutocompleteStep = 0

export function initAddSpotAfterRender() {
 const depInput = document.getElementById('spot-departure-city')
 const dirInput = document.getElementById('spot-direction-city')

 if (depInput && !dirInput) {
 // Always cleanup + re-init: DOM is recreated on each render
 cleanupAutocompletes()
 lastAutocompleteStep = 1
 initStep1Autocomplete()
 // Init mini-map preview if position is set
 initMiniMapPreview()
 // If share coords pending, auto-open fullscreen map picker
 if (window._pendingShareCoords) {
 requestAnimationFrame(() => window.openFullscreenMapPicker?.())
 }
 } else if (dirInput) {
 cleanupAutocompletes()
 lastAutocompleteStep = 2
 initStep2Autocomplete()
 } else if (!depInput && !dirInput && lastAutocompleteStep !== 0) {
 lastAutocompleteStep = 0
 cleanupAutocompletes()
 // Cleanup fullscreen map if modal closes
 closeFullscreenMapPicker()
 }
}

// Show summary overlay before publishing — user must confirm
window.showSpotSummary = async () => {
 const fd = window.spotFormData
 const { getState, setState } = await import('../../stores/state.js')
 const state = getState()
 const spotType = state.addSpotType || 'custom'
 const description = document.getElementById('spot-description')?.value.trim() || ''

 // Auth check — check Firebase Auth directly (state.isLoggedIn can lag)
 let isAuthed = state.isLoggedIn
 if (!isAuthed) {
 try {
 const fb = await import('../../services/firebase.js')
 const auth = fb.getFirebaseAuth?.()
 isAuthed = !!auth?.currentUser
 if (isAuthed) setState({ isLoggedIn: true, currentUser: auth.currentUser })
 } catch { /* no-op */ }
 }
 if (!isAuthed) {
 const { showError } = await import('../../services/notifications.js')
 showError(t('authRequiredAddSpot'))
 setState({
 showAuth: true,
 authPendingAction: 'submitSpot',
 showAuthReason: t('authRequiredAddSpot'),
 })
 return
 }

 // Quick validation first (same checks as handleAddSpot)
 const { showError } = await import('../../services/notifications.js')
 if (!fd.lat || !fd.lng) { showError(t('positionRequired') || 'Position obligatoire'); return }
 if (!fd.departureCity) { showError(t('departureRequired') || 'Ville de départ obligatoire'); return }
 if (!fd.directionCity) { showError(t('directionRequired')); return }
 if (!fd.method) { showError(t('methodRequired')); return }
 if (!fd.groupSize) { showError(t('groupSizeRequired')); return }
 if (!fd.timeOfDay) { showError(t('timeOfDayRequired')); return }
 if (!fd.rideResult) { showError(t('rideResultRequired')); return }
 const r = fd.ratings || {}
 if (!r.safety || !r.traffic || !r.accessibility) { showError(t('ratingsRequired') || 'Note les 3 critères'); return }

 // Type labels
 const typeLabels = {
 gas_station: t('spotTypeGasStation') || 'Station / Aire',
 toll: t('spotTypeToll') || 'Péage',
 roundabout: t('spotTypeRoundabout') || 'Rond-point',
 on_ramp: t('spotTypeOnRamp') || 'Bretelle',
 roadside: t('spotTypeRoadside') || 'Bord de route',
 custom: t('spotTypeCustom') || 'Autre',
 }
 const methodLabels = {
 sign: t('methodSign') || 'Panneau', thumb: t('methodThumb') || 'Pouce', asking: t('methodAsking') || 'En demandant',
 }
 const groupLabels = {
 solo: 'Solo', duo: 'Duo', group: t('groupTrioPlus') || 'Groupe 3+',
 }
 const timeLabels = {
 morning: t('timeMorning') || 'Matin', afternoon: t('timeAfternoon') || 'Après-midi',
 evening: t('timeEvening') || 'Soir', night: t('timeNight') || 'Nuit',
 }
 const rideLabels = {
 yes: icon('circle-check', 'w-4 h-4 inline text-emerald-400') + ' ' + (t('yes') || 'Oui'), no: icon('circle-x', 'w-4 h-4 inline text-red-400') + ' ' + (t('no') || 'Non'), gaveUp: icon('flag', 'w-4 h-4 inline text-slate-400') + ' ' + (t('gaveUp') || 'Abandonné'),
 }

 // Build destinations text
 const allDests = [fd.directionCity, ...(fd.extraDestinations || []).map(d => d.city)].filter(Boolean)

 // Build amenities list
 const tags = fd.tags || {}
 const amenityList = []
 if (tags.shelter) amenityList.push(t('amenityShelter') || 'Abri')
 if (tags.waterFood) amenityList.push(t('amenityWater') || 'Eau')
 if (tags.toilets) amenityList.push(t('amenityToilets') || 'Toilettes')
 if (tags.food) amenityList.push(t('amenityFood') || 'Nourriture')
 if (tags.stoppingSpace) amenityList.push(t('stoppingSpaceTag') || 'Parking')

 const row = (label, value) => value ? `
 <div class="flex justify-between py-2 border-b border-[#1e293b]">
 <span class="text-xs text-slate-500">${escapeHTML(label)}</span>
 <span class="text-xs text-slate-200 text-right max-w-[60%]">${escapeHTML(String(value))}</span></div>` : ''

 const photoCount = (fd.photos || []).length

 const overlay = document.createElement('div')
 overlay.id = 'spot-summary-overlay'
 overlay.className = 'fixed inset-0 z-[60] flex items-center justify-center p-4'
 overlay.innerHTML = `
 <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" onclick="closeSpotSummary()" role="button" tabindex="0" aria-label="Fermer"></div>
 <div class="relative bg-[#0f1520] border border-[#1e293b] rounded-xl max-w-[400px] w-full max-h-[80vh] overflow-y-auto p-5" onclick="event.stopPropagation()">
 <h3 class="text-lg font-semibold text-slate-200 mb-4 text-center">${state.addSpotValidateId ? (t('summaryTitle') || 'Récapitulatif') : (t('summaryTitle') || 'Récapitulatif du spot')}</h3>

 ${!state.addSpotValidateId ? row(t('spotTypeLabel') || 'Type', typeLabels[spotType] || spotType) : ''}
 ${!state.addSpotValidateId ? row(t('departureCity') || 'Départ', fd.departureCity) : ''}
 ${row(t('position') || 'Position', fd.locationName || (fd.lat?.toFixed(4) + ', ' + fd.lng?.toFixed(4)))}
 ${row(t('destinationCity') || 'Direction', allDests.join(', '))}
 ${row(t('waitTimeLabel') || 'Attente', fd.waitTime ? (fd.waitTime >= 180 ? '3h+' : fd.waitTime + ' min') : '')}
 ${row(t('practicalTips') || 'Méthode', methodLabels[fd.method] || '')}
 ${row(t('groupSizeLabel') || 'Groupe', groupLabels[fd.groupSize] || '')}
 ${row(t('timeOfDayLabel') || 'Moment', timeLabels[fd.timeOfDay] || '')}
 ${row(t('gotARide') || 'Lift obtenu', rideLabels[fd.rideResult] || '')}
 ${row(t('safety') || 'Sécurité', r.safety + '/5')}
 ${row(t('traffic') || 'Trafic', r.traffic + '/5')}
 ${row(t('accessibility') || 'Accessibilité', r.accessibility + '/5')}
 ${amenityList.length > 0 ? row(t('amenitiesLabel') || 'Commodités', amenityList.join(', ')) : ''}
 ${description ? row(t('description') || 'Description', description.length > 80 ? description.slice(0, 80) + '...' : description) : ''}
 ${row(t('photoLabel') || 'Photos', photoCount > 0 ? photoCount + ' photo' + (photoCount > 1 ? 's' : '') : (t('noPhoto') || 'Aucune photo'))}

 <!-- Street View check -->
 ${!state.addSpotValidateId && fd.lat ? `
 <div class="my-3.5 bg-[rgba(15,30,60,0.6)] border border-blue-400/20 rounded-[10px] px-3 py-2.5 flex items-center gap-2.5">
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" stroke-width="2" class="shrink-0"><circle cx="12" cy="5" r="3"/><path d="M12 8v8"/><path d="M8 21l4-5 4 5"/></svg>
 <div class="flex-1">
 <div class="text-[11px] text-blue-300" id="sv-check-label">${t('streetViewCheckLabel') || 'Street View disponible ici ?'}</div></div>
 <button type="button" onclick="checkStreetViewForNewSpot(${fd.lat}, ${fd.lng})"
 id="sv-check-btn"
 class="bg-blue-400/20 border border-blue-400/30 text-blue-300 px-2.5 py-1 rounded-lg text-[11px] cursor-pointer whitespace-nowrap">
 ${t('streetViewCheck') || 'Vérifier'}
 </button></div>
 ` : ''}

 ${!state.addSpotValidateId ? `<p class="text-[11px] text-slate-500 text-center my-4">${t('summaryWarning') || 'Une fois publié, ce spot ne pourra plus être modifié.'}</p>` : '<div class="mt-4"></div>'}

 <div class="flex gap-2.5">
 <button type="button" onclick="closeSpotSummary()"
 class="flex-1 bg-transparent border border-slate-700 text-slate-500 p-3 text-[13px] cursor-pointer rounded-lg">
 ${t('modify') || 'Modifier'}
 </button>
 <button type="button" onclick="closeSpotSummary();document.getElementById('add-spot-form')?.dispatchEvent(new Event('submit',{cancelable:true}))"
 class="flex-[2] bg-amber-500 border-0 text-[#0f1520] p-3 text-sm font-semibold cursor-pointer rounded-lg">
 ${state.addSpotValidateId ? (t('confirmSubmit') || 'Confirmer et envoyer') : (t('confirmPublish') || 'Confirmer et publier')}
 </button></div></div>
 `
 document.body.appendChild(overlay)
}

window.closeSpotSummary = () => {
 document.getElementById('spot-summary-overlay')?.remove()
}

// Handler: check Street View availability during spot creation
window.checkStreetViewForNewSpot = (lat, lng) => {
 if (!isFinite(Number(lat)) || !isFinite(Number(lng))) return
 // Open Street View so user can check manually
 const url = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}&heading=0`
 window.open(url, '_blank', 'noopener,noreferrer')
 // Mark as verified (user clicked to check)
 window.spotFormData._streetViewChecked = true
 const btn = document.getElementById('sv-check-btn')
 const label = document.getElementById('sv-check-label')
 if (btn) {
 btn.style.background = 'rgba(34,197,94,0.2)'
 btn.style.borderColor = 'rgba(34,197,94,0.4)'
 btn.style.color = '#22c55e'
 btn.textContent = '✓ ' + (t('streetViewChecked') || 'Vérifié')
 }
 if (label) {
 label.style.color = '#22c55e'
 label.textContent = t('streetViewCheckedLabel') || 'Street View vérifié pour ce spot'
 }
}

window.handleAddSpot = async (event) => {
 event.preventDefault()
 if (window.handleAddSpot._busy) return
 if (!window.requireOnline?.()) return
 window.handleAddSpot._busy = true
 setTimeout(() => { window.handleAddSpot._busy = false }, 3000)

 const { getState, setState } = await import('../../stores/state.js')
 const state = getState()

 // Auth check — check Firebase Auth directly (state.isLoggedIn can lag behind on slow connections)
 let isAuthed = state.isLoggedIn
 if (!isAuthed) {
 try {
 const fb = await import('../../services/firebase.js')
 const auth = fb.getFirebaseAuth?.()
 isAuthed = !!auth?.currentUser
 if (isAuthed) setState({ isLoggedIn: true, currentUser: auth.currentUser })
 } catch { /* no-op */ }
 }
 if (!isAuthed) {
 const { showError } = await import('../../services/notifications.js')
 showError(t('authRequiredAddSpot'))
 setState({
 showAuth: true,
 authPendingAction: 'submitSpot',
 showAuthReason: t('authRequiredAddSpot'),
 })
 return
 }

 let spotType = state.addSpotType || 'custom'
 const description = document.getElementById('spot-description')?.value.trim()
 const submitBtn = document.getElementById('submit-spot-btn')

 // Build fields
 const from = window.spotFormData.departureCity || ''
 const to = window.spotFormData.directionCity || ''
 const direction = window.spotFormData.directionCity || ''

 // Validation — ALL fields mandatory EXCEPT photo (bonus points)
 const { showError } = await import('../../services/notifications.js')

 const lat = Number(window.spotFormData.lat)
 const lng = Number(window.spotFormData.lng)
 if (!lat || !lng || !isFinite(lat) || !isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
 showError(t('positionRequired') || 'Position obligatoire')
 return
 }
 if (!window.spotFormData.departureCity) {
 showError(t('departureRequired') || 'Ville de départ obligatoire')
 return
 }
 if (!direction) {
 showError(t('directionRequired'))
 return
 }

 // Duplicate detection now happens at step 1 (addSpotNextStep)
 // No need to check again here — eliminates the infinite loop bug
 if (!window.spotFormData.method) {
 showError(t('methodRequired'))
 return
 }
 if (!window.spotFormData.groupSize) {
 showError(t('groupSizeRequired'))
 return
 }
 if (!window.spotFormData.timeOfDay) {
 showError(t('timeOfDayRequired'))
 return
 }
 if (!window.spotFormData.rideResult) {
 showError(t('rideResultRequired'))
 return
 }
 // Description is optional — skip validation

 // Ratings validation — all 3 criteria required
 const ratingsCheck = window.spotFormData.ratings || {}
 if (!ratingsCheck.safety || !ratingsCheck.traffic || !ratingsCheck.accessibility) {
 showError(t('ratingsRequired') || 'Note les 3 critères (sécurité, trafic, accessibilité)')
 return
 }

 // Gas station verification — check Overpass for nearby fuel amenity
 if (spotType === 'gas_station' && window.spotFormData.lat && window.spotFormData.lng) {
 if (submitBtn) {
 submitBtn.disabled = true
 submitBtn.innerHTML = `${icon('loader-circle', 'w-5 h-5 animate-spin')} ${t('verifyingStation')}`
 }
 const verification = await verifyGasStationNearby(window.spotFormData.lat, window.spotFormData.lng)
 if (!verification.verified) {
 if (submitBtn) {
 submitBtn.disabled = false
 submitBtn.innerHTML = t('submit') || 'Publier'
 }
 const decision = await showGasStationConfirm()
 if (decision === 'change') {
 spotType = 'custom'
 window.selectSpotType('custom')
 import('../../stores/state.js').then(({ getState: gs }) => {
 gs().addSpotType = 'custom'
 })
 }
 // Either way, continue with submission
 }
 }

 // Proximity check disabled — users need to add spots from memory
 // (places they hitchhiked from in the past without being there now)

 // Disable button
 if (submitBtn) {
 submitBtn.disabled = true
 submitBtn.innerHTML = `${icon('loader-circle', 'w-5 h-5 animate-spin')} ${t('submittingSpot') || 'Envoi...'}`
 }

 const ratings = window.spotFormData.ratings || { safety: 0, traffic: 0, accessibility: 0 }
 const ratingValues = [ratings.safety, ratings.traffic, ratings.accessibility].filter(v => v > 0)
 const globalRating = ratingValues.length > 0
 ? Math.round((ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length) * 10) / 10
 : 0

 try {
 const { uploadImage, addSpot } = await import('../../services/firebase.js')

 // Photos are optional — upload if provided (bonus points for at least 1)
 const photosToUpload = window.spotFormData.photos || []
 const hasPhoto = photosToUpload.length > 0
 const uploadedUrls = []
 let photoUploadFailed = false
 for (let i = 0; i < photosToUpload.length; i++) {
 const photoPath = `spots/${Date.now()}_${i}.jpg`
 const photoResult = await uploadImage(photosToUpload[i], photoPath)
 if (photoResult.success) {
 uploadedUrls.push(photoResult.url)
 } else {
 photoUploadFailed = true
 console.error('Photo upload failed:', photoResult.error)
 }
 }
 if (photoUploadFailed && uploadedUrls.length === 0 && hasPhoto) {
 window.showToast?.(t('photoUploadFailed') || 'La photo n\'a pas pu être envoyée. Le spot sera créé sans photo.', 'warning')
 }
 const photoUrl = uploadedUrls[0] || ''

 // --- VALIDATION MODE: save as validation on existing spot ---
 if (state.addSpotValidateId) {
 const destinations = [{ city: to, coords: window.spotFormData.directionCityCoords || null }]
 for (const extra of (window.spotFormData.extraDestinations || [])) {
 destinations.push({ city: extra.city, coords: extra.coords || null })
 }
 const validationData = {
 spotId: state.addSpotValidateId,
 type: 'test',
 waitTime: window.spotFormData.waitTime || 10,
 method: window.spotFormData.method,
 groupSize: window.spotFormData.groupSize,
 timeOfDay: window.spotFormData.timeOfDay,
 rideResult: window.spotFormData.rideResult,
 directionCity: to,
 destinations,
 ratings: {
 safety: ratings.safety || 0,
 traffic: ratings.traffic || 0,
 accessibility: ratings.accessibility || 0,
 },
 tags: window.spotFormData.tags || {},
 comment: description,
 season: detectSeason(),
 timestamp: new Date().toISOString(),
 dataSource: 'community',
 experienceDate: {
 year: window.spotFormData.experienceYear || new Date().getFullYear(),
 month: window.spotFormData.experienceMonth || (new Date().getMonth() + 1),
 ...(window.spotFormData.experienceDay ? { day: window.spotFormData.experienceDay } : {}),
 },
 // GPS verification from openTestSpot check
 gpsVerified: !!window.spotFormData._gpsVerifiedOnOpen,
 gpsDistance: window.spotFormData._gpsDistance || null,
 }
 if (uploadedUrls.length > 0) {
 validationData.photoUrl = uploadedUrls[0]
 validationData.photos = uploadedUrls
 }

 // Update GPS trust counters
 try {
 const { updateTrustCounters, isValidationTrusted } = await import('../../services/gpsTrust.js')
 updateTrustCounters(!!window.spotFormData._gpsVerifiedOnOpen)
 if (!isValidationTrusted()) {
 const { showToast } = await import('../../services/notifications.js')
 showToast(t('enableGpsForValidation') || 'Active le GPS pour que tes validations soient comptées', 'warning')
 // Still save locally but don't send to Firebase
 return
 }
 } catch { /* non-blocking */ }

 const { addValidation } = await import('../../services/firebase.js')
 if (typeof addValidation === 'function') {
 await addValidation(validationData)
 }

 // Local checkin history + points
 const { actions } = await import('../../stores/state.js')
 actions.addCheckinToHistory({
 spotId: state.addSpotValidateId,
 type: 'test',
 ...validationData,
 })
 actions.incrementCheckins()
 if (hasPhoto) actions.addPoints?.(50)

 const { showSuccess } = await import('../../services/notifications.js')
 const photoMsg = hasPhoto ? ' +50 pts' : ''
 showSuccess((t('testSubmitted') || 'Test envoyé ! Merci') + photoMsg)
 setState({
 showAddSpot: false, addSpotStep: 1, addSpotType: null,
 addSpotValidateId: null,
 addSpotMethod: null,
 addSpotGroupSize: null,
 addSpotTimeOfDay: null,
 addSpotWaitTime: null,
 addSpotRideResult: null,
 })

 // Refresh live data so SpotDetail shows updated stats
 try {
 const { invalidateSpotCache, enrichSpotWithLiveData } = await import('../../services/spotLiveData.js')
 invalidateSpotCache(state.addSpotValidateId)
 const currentSpot = getState().selectedSpot
 if (currentSpot && String(currentSpot.id) === String(state.addSpotValidateId)) {
 const enriched = await enrichSpotWithLiveData({ ...currentSpot, _liveLoaded: false })
 setState({ selectedSpot: enriched })
 }
 } catch { /* non-blocking */ }

 // Reset form
 window.spotFormData = {
 photos: [], lat: null, lng: null,
 ratings: { safety: 0, traffic: 0, accessibility: 0 },
 tags: { shelter: false, waterFood: false, toilets: false, visibility: false, stoppingSpace: false },
 country: null, countryName: null,
 departureCity: null, departureCityCoords: null,
 directionCity: null, directionCityCoords: null,
 locationName: null, roadNumber: null, positionSource: null,
 method: null, groupSize: null, timeOfDay: null, waitTime: null, season: null,
 rideResult: null, stationName: '', extraDestinations: [],
 experienceYear: new Date().getFullYear(),
 experienceMonth: new Date().getMonth() + 1,
 experienceDay: new Date().getDate(), _expCustom: false,
 }
 return
 }

 // --- CREATION MODE: create new spot ---

 // Build destinations array (primary + extras)
 const destinations = [{
 city: to,
 coords: window.spotFormData.directionCityCoords || null,
 addedBy: null, // will be set by Firebase addSpot
 addedByName: null,
 addedAt: new Date().toISOString(),
 method: window.spotFormData.method || null,
 waitTime: window.spotFormData.waitTime || null,
 }]
 for (const extra of (window.spotFormData.extraDestinations || [])) {
 destinations.push({
 city: extra.city,
 coords: extra.coords || null,
 addedBy: null,
 addedByName: null,
 addedAt: new Date().toISOString(),
 method: null,
 waitTime: null,
 })
 }

 // Safety net: if country is empty but we have coordinates, reverse geocode now
 if (!window.spotFormData.country && window.spotFormData.lat && window.spotFormData.lng) {
 try {
 const { reverseGeocode } = await import('../../services/osrm.js')
 const loc = await reverseGeocode(window.spotFormData.lat, window.spotFormData.lng)
 if (loc?.countryCode) {
 window.spotFormData.country = loc.countryCode
 window.spotFormData.countryName = loc.country
 }
 } catch { /* continue without country */ }
 }
 if (!window.spotFormData.country) {
  const { showToast } = await import('../../services/notifications.js')
  showToast(t('countryNotDetected') || 'Pays non détecté. Le spot sera quand même créé.', 'warning')
 }

 // Calculate cityNumber: count existing spots in the same city + 1
 let cityNumber = 1
 try {
 const allSpots = window.getState?.()?.spots || []
 const cityName = (window.spotFormData.departureCity || from || '').toLowerCase().trim()
 if (cityName) {
 const sameCity = allSpots.filter(s => {
 const sCity = (s.departureCity || s.from || s.fromCity || s.city || '').toLowerCase().trim()
 return sCity === cityName
 })
 cityNumber = sameCity.length + 1
 }
 } catch { /* default to 1 */ }

 // Build complete spot data — ALL fields structured
 const spotData = {
 // Structured fields (unique data!)
 country: window.spotFormData.country || '',
 countryName: window.spotFormData.countryName || '',
 departureCity: window.spotFormData.departureCity || '',
 departureCityCoords: window.spotFormData.departureCityCoords || null,
 directionCity: window.spotFormData.directionCity || '',
 directionCityCoords: window.spotFormData.directionCityCoords || null,
 locationName: window.spotFormData.locationName || '',
 roadNumber: window.spotFormData.roadNumber || '',
 positionSource: window.spotFormData.positionSource || 'gps',

 // Experience data (ALL mandatory!)
 method: window.spotFormData.method,
 groupSize: window.spotFormData.groupSize,
 timeOfDay: window.spotFormData.timeOfDay,
 waitTime: window.spotFormData.waitTime || 10,
 rideResult: window.spotFormData.rideResult,
 season: detectSeason(),

 // Legacy fields (backward compat)
 from: from,
 to: to,
 direction: direction,

 // Standard fields
 description,
 photoUrl: photoUrl,
 photos: uploadedUrls,
 hasPhoto: hasPhoto,
 coordinates: {
 lat: window.spotFormData.lat,
 lng: window.spotFormData.lng,
 },
 ratings: {
 safety: ratings.safety || 0,
 traffic: ratings.traffic || 0,
 accessibility: ratings.accessibility || 0,
 },
 globalRating,
 avgWaitTime: window.spotFormData.waitTime || 30,
 spotType,
 fromCity: from,
 tags: {
 ...(window.spotFormData.tags || {}),
 signMethod: window.spotFormData.method || null,
 },
 cityNumber,
 stationName: window.spotFormData.stationName || '',
 streetViewVerified: !!window.spotFormData._streetViewChecked,
 dataSource: 'community',
 createdAt: new Date().toISOString(),
 experienceDate: {
 year: window.spotFormData.experienceYear || new Date().getFullYear(),
 month: window.spotFormData.experienceMonth || (new Date().getMonth() + 1),
 ...(window.spotFormData.experienceDay ? { day: window.spotFormData.experienceDay } : {}),
 },
 destinations,
 }

 // GPS check for spot creation when date = today
 const expYear = window.spotFormData.experienceYear || new Date().getFullYear()
 const expMonth = window.spotFormData.experienceMonth || (new Date().getMonth() + 1)
 const isToday = expYear === new Date().getFullYear()
 && expMonth === (new Date().getMonth() + 1)
 if (isToday && window.spotFormData.lat && window.spotFormData.lng) {
 try {
 const { verifyProximity } = await import('../../services/locationHistory.js')
 const proximity = await verifyProximity(
 window.spotFormData.lat,
 window.spotFormData.lng,
 'validation',
 )
 if (proximity.allowed) {
 spotData.gpsVerified = true
 spotData.gpsDistance = proximity.closestM
 }
 } catch { /* GPS unavailable */ }
 }

 const result = await addSpot(spotData)

 if (result.success) {
 const { showSuccess } = await import('../../services/notifications.js')
 const { actions, setState: setStateFn } = await import('../../stores/state.js')

 showSuccess(hasPhoto
 ? (t('spotShared') || 'Spot partagé !') + ` +50 pts (${uploadedUrls.length} photo${uploadedUrls.length > 1 ? 's' : ''})`
 : (t('spotShared') || 'Spot partagé avec succès !'))
 actions.incrementSpotsCreated()
 // Add new spot to map immediately (so user sees it without reload)
 try {
 const { getState: getStateFn } = await import('../../stores/state.js')
 const currentSpots = getStateFn().spots || []
 const newSpot = {
 ...spotData,
 id: result.id,
 creatorId: window.__firebaseUser?.uid || 'anonymous',
 creator: window.__firebaseUser?.displayName || 'Anonyme',
 }
 setStateFn({ spots: [...currentSpots, newSpot] })
 if (window._refreshMapSpots) window._refreshMapSpots()
 } catch { /* map refresh is nice-to-have, not critical */ }
 // Record country visit for "Pays visités" in profile
 if (spotData.country) {
 try {
 const { recordCountryVisit } = await import('../../services/gamification.js')
 recordCountryVisit(spotData.country)
 } catch { /* no-op */ }
 }
 // Bonus points for photo (50 pts if at least 1 photo)
 if (hasPhoto) {
 actions.addPoints?.(50)
 }
 setStateFn({
 showAddSpot: false,
 addSpotStep: 1,
 addSpotType: null,
 addSpotMethod: null,
 addSpotGroupSize: null,
 addSpotTimeOfDay: null,
 addSpotWaitTime: null,
 addSpotRideResult: null,
 })

 // Reset form data
 window.spotFormData = {
 photos: [], lat: null, lng: null,
 ratings: { safety: 0, traffic: 0, accessibility: 0 },
 tags: { shelter: false, waterFood: false, toilets: false, visibility: false, stoppingSpace: false },
 country: null, countryName: null,
 departureCity: null, departureCityCoords: null,
 directionCity: null, directionCityCoords: null,
 locationName: null, roadNumber: null, positionSource: null,
 method: null, groupSize: null, timeOfDay: null, waitTime: null, season: null,
 rideResult: null, stationName: '',
 extraDestinations: [],
 }

 // Show contextual tip for first spot created
 try {
 const { triggerSpotCreatedTip } = await import('../../services/contextualTips.js')
 triggerSpotCreatedTip()
 } catch { /* no-op */ }

 // Guide nudge: invite user to share tips for the country they just added a spot in
 try {
 const countryCode = spotData.country
 const countryName = spotData.countryName
 if (countryCode) {
 const nudgeSeenGlobal = localStorage.getItem('spothitch_guide_nudge_seen')
 const dismissedCountries = JSON.parse(localStorage.getItem('spothitch_guide_nudge_countries') || '[]')
 const countryDismissed = dismissedCountries.includes(countryCode)
 const shouldShow = !nudgeSeenGlobal && !countryDismissed
 // Get country flag emoji from country code
 const flagEmoji = countryCode
 .toUpperCase()
 .replace(/./g, ch => String.fromCodePoint(127397 + ch.charCodeAt(0)))
 setStateFn({
 pendingGuideCountry: { code: countryCode, name: countryName || countryCode, flag: flagEmoji },
 showGuideNudge: shouldShow,
 })
 }
 } catch { /* no-op */ }
 } else {
 throw new Error('Failed to add spot')
 }
 } catch (error) {
 console.error('Add spot failed:', error)
 const { showError } = await import('../../services/notifications.js')
 showError(t('addSpotError') || "Erreur lors de l'ajout du spot")
 } finally {
 if (submitBtn) {
 submitBtn.disabled = false
 submitBtn.innerHTML = `${icon('share', 'w-5 h-5')} ${t('shareThisSpot') || t('create')}`
 }
 }
}

// Character counter for description (named handler for cleanup)
function _addSpotInputHandler(e) {
 if (e.target.id === 'spot-description') {
 const count = document.getElementById('desc-count')
 if (count) count.textContent = e.target.value.length
 }
}
document.addEventListener('input', _addSpotInputHandler)

/**
 * Cleanup AddSpot event listeners — called from closeAddSpot
 */
export function cleanupAddSpotListeners() {
 document.removeEventListener('input', _addSpotInputHandler)
}

/**
 * Re-attach AddSpot event listeners — called when modal opens
 */
export function attachAddSpotListeners() {
 document.removeEventListener('input', _addSpotInputHandler) // prevent duplicates
 document.addEventListener('input', _addSpotInputHandler)
}

// ==================== NEARBY SPOT CHOICE MODAL ====================

export function renderNearbySpotChoice(state) {
 const nearbySpots = state.nearbySpotChoiceData
 if (!nearbySpots || nearbySpots.length === 0) return ''

 const spotsHtml = nearbySpots.slice(0, 3).map(spot => {
 const name = spot.departureCity || spot.city || spot.fromCity || spot.locationName || 'Spot'
 const dir = spot.directionCity || spot.to || ''
 const r = spot.liveRatings || spot.ratings || {}
 const avgRating = ((r.safety || 0) + (r.traffic || 0) + (r.accessibility || 0)) / 3
 const ratingStr = avgRating > 0 ? `${avgRating.toFixed(1)}/5` : ''
 const tests = spot.liveTestCount || spot.testCount || spot.validationCount || 0
 const waitTime = spot.liveAvgWaitTime || spot.avgWaitTime || ''
 const dist = spot._distance || ''
 const spotId = spot.id

 return `
 <button onclick="nearbySpotChooseValidate('${escapeHTML(String(spotId))}')"
 class="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left flex items-center gap-3">
 <div class="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center shrink-0">
 ${icon('map-pin', 'w-5 h-5 text-primary-400')}
 </div>
 <div class="flex-1 min-w-0">
 <div class="font-medium text-sm truncate">${escapeHTML(name)}${dir ? ' → ' + escapeHTML(dir) : ''}</div>
 <div class="text-xs text-slate-400 flex flex-wrap gap-x-2">
 ${dist ? `<span>${dist}m</span>` : ''}
 ${tests ? `<span>${tests} ${t('validations') || 'validations'}</span>` : ''}
 ${ratingStr ? `<span>${ratingStr}</span>` : ''}
 ${waitTime ? `<span>${waitTime} min</span>` : ''}
 </div></div>
 <div class="text-primary-400 text-xs font-medium shrink-0 flex items-center gap-1">
 ${icon('check-circle', 'w-3.5 h-3.5')}
 ${t('sameSpotValidate') || 'Valider'}
 </div></button>`
 }).join('')

 return `
 <div class="fixed inset-0 bg-black/80 z-[60] flex items-end sm:items-center justify-center"
 onclick="if(event.target===this)closeNearbySpotChoice()" role="dialog" aria-modal="true">
 <div class="modal-panel w-full sm:max-w-md sm:rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
 <div class="bg-gradient-to-r from-primary-500 to-amber-500 p-4">
 <h2 class="text-lg font-bold text-white">${t('nearbySpotFound') || 'Spot à proximité'}</h2>
 <p class="text-white/80 text-sm mt-1">${t('nearbySpotDescription') || 'Un spot existe déjà près de cet endroit. Vérifie sur la carte si c\'est le même.'}</p></div>

 <!-- Mini-map comparing positions -->
 <div id="nearby-comparison-map" class="w-full h-[180px] bg-[#161b28]"></div>
 <div class="flex justify-around text-[10px] text-slate-500 py-1.5 px-4 bg-[#0f1520]">
 <span class="flex items-center gap-1">
 <span class="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
 ${t('nearbyYourPosition') || 'Ta position'}
 </span>
 <span class="flex items-center gap-1">
 <span class="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
 ${t('nearbyExistingSpot') || 'Spot existant'}
 </span></div>

 <div class="p-4 space-y-2">
 <p class="text-xs text-slate-400 mb-1">${t('nearbySpotExisting') || 'Spots existants à moins de 500m :'}</p>
 ${spotsHtml}
 </div>

 <div class="p-4 border-t border-white/10">
 <button onclick="nearbySpotChooseCreate()" class="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors flex items-center justify-center gap-2">
 ${icon('circle-plus', 'w-4 h-4')}
 ${t('differentSpotCreate') || 'C\'est un autre spot, je crée'}
 </button></div></div></div>
 `
}

/** Initialize the comparison mini-map showing user pin + existing spot(s) */
export async function initNearbyComparisonMap() {
 const container = document.getElementById('nearby-comparison-map')
 if (!container || container.dataset.init) return
 container.dataset.init = '1'

 const state = window.getState?.() || {}
 const userPin = state.nearbyUserPin
 const spots = state.nearbySpotChoiceData
 if (!userPin || !spots?.length) return

 try {
 const maplibregl = await import('maplibre-gl')
 const bounds = new maplibregl.LngLatBounds()
 bounds.extend([userPin.lng, userPin.lat])
 spots.forEach(s => {
 const lat = s.coordinates?.lat || s.lat
 const lng = s.coordinates?.lng || s.lng
 if (lat && lng) bounds.extend([lng, lat])
 })

 const map = new maplibregl.Map({
 container,
 style: 'https://tiles.openfreemap.org/styles/positron',
 bounds,
 fitBoundsOptions: { padding: 40, maxZoom: 16 },
 interactive: false,
 attributionControl: false,
 })

 map.on('load', () => {
 // User pin (orange)
 const userEl = document.createElement('div')
 userEl.style.cssText = 'width:14px;height:14px;background:#f59e0b;border:2px solid #fff;border-radius:50%;box-shadow:0 0 6px rgba(245,158,11,0.5)'
 new maplibregl.Marker({ element: userEl }).setLngLat([userPin.lng, userPin.lat]).addTo(map)

 // Existing spot(s) (blue)
 spots.forEach(s => {
 const lat = s.coordinates?.lat || s.lat
 const lng = s.coordinates?.lng || s.lng
 if (!lat || !lng) return
 const spotEl = document.createElement('div')
 spotEl.style.cssText = 'width:14px;height:14px;background:#3b82f6;border:2px solid #fff;border-radius:50%;box-shadow:0 0 6px rgba(59,130,246,0.5)'
 new maplibregl.Marker({ element: spotEl }).setLngLat([lng, lat]).addTo(map)
 })
 })
 } catch (e) {
 console.warn('Nearby comparison map init failed:', e)
 }
}

window.nearbySpotChooseValidate = (spotId) => {
 // Close nearby modal + AddSpot, then open the spot detail for validation
 window.setState?.({
 nearbySpotChoiceData: null,
 nearbyUserPin: null,
 showAddSpot: false,
 })
 // Open spot detail with the existing spot so user can validate via CheckinModal
 setTimeout(() => {
 window.selectSpot?.(spotId)
 window.showToast?.(
 window.t?.('nearbySpotValidateHint') || 'Utilise le bouton "Check-in" pour donner ton avis sur ce spot',
 'info'
 )
 }, 400)
}

window.nearbySpotChooseCreate = () => {
 // User confirmed it's a different spot → continue to step 2
 window.spotFormData._duplicateConfirmed = true
 window.setState?.({ nearbySpotChoiceData: null, nearbyUserPin: null })
 // Continue the step 1 → step 2 transition
 setTimeout(() => window.addSpotNextStep?.(), 100)
}

window.closeNearbySpotChoice = () => {
 window.setState?.({ nearbySpotChoiceData: null, nearbyUserPin: null })
}

export default { renderAddSpot, renderNearbySpotChoice }
