/**
 * Trip Journal Handlers
 * All window.* functions for the journal UI
 */

import {
  createTrip, addLeg, endTrip, updateTrip,
  setDayNote, setDayExpenses, setDayPhoto, getTrip,
  flushPendingSync, EXPENSE_CATEGORIES,
} from '../services/tripJournal.js'

// ==================== NAVIGATION ====================

window.journalBack = () => {
  const state = window.getState?.() || {}
  // Flush pending Firestore sync before navigating away
  if (state.journalTripId) flushPendingSync(state.journalTripId)
  if (state.journalView === 'add-leg' || state.journalView === 'expenses' || state.journalView === 'day-note') {
    window.setState?.({ journalView: 'detail' })
  } else if (state.journalView === 'detail' || state.journalView === 'new-trip' || state.journalView === 'stats') {
    window.setState?.({ journalView: 'list', journalTripId: null })
  } else {
    window.setState?.({ journalView: 'list' })
  }
}

window.journalNewTrip = () => {
  window.setState?.({ journalView: 'new-trip' })
}

window.journalOpenTrip = (tripId) => {
  window.setState?.({ journalView: 'detail', journalTripId: tripId })
}

window.journalAddLeg = (tripId) => {
  window.setState?.({ journalView: 'add-leg', journalTripId: tripId, journalTransport: 'hitchhike' })
}

window.journalShowStats = (tripId) => {
  window.setState?.({ journalView: 'stats', journalTripId: tripId })
}

window.journalEditExpenses = (tripId, date) => {
  window.setState?.({ journalView: 'expenses', journalTripId: tripId, journalDate: date })
}

window.journalEditDayNote = (tripId, date) => {
  window.setState?.({ journalView: 'day-note', journalTripId: tripId, journalDate: date })
}

// ==================== ACTIONS ====================

window.journalCreateTrip = () => {
  const title = document.getElementById('journal-trip-title')?.value?.trim() || ''
  const startDate = document.getElementById('journal-start-date')?.value || new Date().toISOString().slice(0, 10)
  const trip = createTrip({ title, startDate })
  if (trip) {
    window.setState?.({ journalView: 'detail', journalTripId: trip.id })
    window.showToast?.('Voyage créé !', 'success')
  } else {
    window.showToast?.('Un voyage est déjà en cours. Termine-le d\'abord.', 'error')
  }
}

window.journalSaveLeg = (tripId) => {
  const departure = document.getElementById('journal-departure')?.value?.trim()
  const arrival = document.getElementById('journal-arrival')?.value?.trim()
  const note = document.getElementById('journal-note')?.value?.trim() || ''
  const transport = window.getState?.()?.journalTransport || 'hitchhike'

  if (!departure || !arrival) {
    window.showToast?.('Le départ et l\'arrivée sont obligatoires', 'error')
    return
  }

  // Calculate distance via OSRM (async, update after)
  // Get coords from autocomplete or spot
  const depCoords = window._journalDep || null
  const arrCoords = window._journalArr || null

  const waitEl = document.getElementById('journal-wait-time')
  const priceEl = document.getElementById('journal-price')
  const durationEl = document.getElementById('journal-duration')
  const waitMinutes = parseInt(waitEl?.value, 10) || window._journalSpotWaitMinutes || null
  const price = parseFloat(priceEl?.value) || null
  const rideDuration = parseInt(durationEl?.value, 10) || null

  const legData = {
    transport,
    departureName: departure,
    departureLat: depCoords?.lat || null,
    departureLng: depCoords?.lng || null,
    arrivalName: arrival,
    arrivalLat: arrCoords?.lat || null,
    arrivalLng: arrCoords?.lng || null,
    note,
    date: new Date().toISOString().slice(0, 10),
    // Spot data (if linked)
    spotId: window._journalSelectedSpotId || null,
    spotName: window._journalSelectedSpotName || null,
    spotCreated: window._journalSpotCreated || false,
    waitMinutes,
    rideDuration,
    price,
  }

  const leg = addLeg(tripId, legData)
  if (leg) {
    // Clear spot selection
    window._journalSelectedSpotId = null
    window._journalSelectedSpotName = null
    window._journalSpotCreated = false
    window._journalSpotWaitMinutes = null

    _clearLegDraft()
    window.setState?.({ journalView: 'detail', journalTripId: tripId })
    window.showToast?.(window.t?.('legAdded') || 'Étape ajoutée !', 'success')

    // Auto-calculate distance (non-blocking)
    _calculateDistance(tripId, leg.id, departure, arrival)
  }
}

async function _calculateDistance(tripId, legId, from, to) {
  try {
    const { calculateRoute } = await import('../services/osrm.js')
    // Geocode cities first
    const { searchCity } = await import('../services/osrm.js')
    const fromResult = await searchCity(from)
    const toResult = await searchCity(to)
    if (fromResult?.[0] && toResult?.[0]) {
      const fromCoords = fromResult[0]
      const toCoords = toResult[0]
      const route = await calculateRoute(
        { lat: fromCoords.lat, lng: fromCoords.lon || fromCoords.lng },
        { lat: toCoords.lat, lng: toCoords.lon || toCoords.lng }
      )
      if (route?.distance) {
        const km = Math.round(route.distance / 1000)
        // Update the leg with the distance
        const { getTrips } = await import('../services/tripJournal.js')
        const trips = getTrips()
        const trip = trips.find(t => t.id === tripId)
        if (trip) {
          const leg = trip.legs.find(l => l.id === legId)
          if (leg) {
            leg.distanceKm = km
            leg.departure.lat = fromCoords.lat
            leg.departure.lng = fromCoords.lon || fromCoords.lng
            leg.departure.country = fromCoords.country_code?.toUpperCase() || null
            leg.arrival.lat = toCoords.lat
            leg.arrival.lng = toCoords.lon || toCoords.lng
            leg.arrival.country = toCoords.country_code?.toUpperCase() || null
            localStorage.setItem('spothitch_journal_trips', JSON.stringify(trips))
            window._forceRender?.()
          }
        }
      }
    }
  } catch { /* distance calculation failed, leg still saved without it */ }
}

window.journalEndTrip = (tripId) => {
  if (!confirm(window.t?.('confirmEndTrip') || 'Terminer ce voyage ? Cette action est irréversible.')) return
  const trip = getTrip(tripId)
  if (!trip) return
  endTrip(tripId)
  window.setState?.({ journalView: 'stats', journalTripId: tripId })
  window.showToast?.(window.t?.('tripEnded') || 'Voyage terminé !', 'success')
}

window.journalTogglePublic = async (tripId) => {
  const trip = getTrip(tripId)
  if (!trip) return
  const newPublic = !trip.isPublic
  updateTrip(tripId, { isPublic: newPublic })
  // Publish/unpublish in Firestore
  if (newPublic) {
    const { publishTripPublicly } = await import('../services/tripJournal.js')
    const result = await publishTripPublicly(tripId)
    if (result.success) {
      window.showToast?.(window.t?.('tripPublished') || 'Voyage publié !', 'success')
    }
  } else {
    // Remove public copy
    try {
      const fb = await import('../services/firebase.js')
      const db = fb.getDb()
      if (db) {
        const { doc, deleteDoc } = await import('firebase/firestore')
        await deleteDoc(doc(db, 'publicTrips', tripId.slice(5, 13)))
      }
    } catch { /* ignore */ }
    window.showToast?.(window.t?.('tripUnpublished') || 'Voyage dépublié', 'info')
  }
  window._forceRender?.()
}

window.journalSaveExpenses = (tripId, date) => {
  const expenses = {}
  for (const cat of EXPENSE_CATEGORIES) {
    const input = document.getElementById(`exp-${cat}`)
    const val = parseFloat(input?.value) || 0
    if (val > 0) expenses[cat] = val
  }
  setDayExpenses(tripId, date, expenses)
  window.setState?.({ journalView: 'detail', journalTripId: tripId })
  window.showToast?.('Dépenses enregistrées', 'success')
}

window.journalSaveDayNote = (tripId, date) => {
  const note = document.getElementById('journal-day-note')?.value?.trim() || ''
  if (!note) {
    window.showToast?.('La note du jour est obligatoire', 'error')
    return
  }
  setDayNote(tripId, date, note)
  window.setState?.({ journalView: 'detail', journalTripId: tripId })
  window.showToast?.('Note enregistrée', 'success')
}

window.journalAddDayPhoto = (tripId, date) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setDayPhoto(tripId, date, reader.result)
      window._forceRender?.()
      window.showToast?.('Photo ajoutée', 'success')
    }
    reader.readAsDataURL(file)
  }
  input.click()
}

window.journalDeleteDayPhoto = (tripId, date) => {
  if (!confirm(window.t?.('confirmDeletePhoto') || 'Supprimer cette photo ?')) return
  setDayPhoto(tripId, date, null)
  window._forceRender?.()
  window.showToast?.(window.t?.('photoRemoved') || 'Photo supprimée', 'success')
}

// ==================== SPOT PICKER ====================

window.journalPickSpot = (mode) => {
  window.setState?.({ journalSpotOverlay: mode, journalSelectedSpotFromMap: null })
  // Init map after render
  setTimeout(() => _initJournalSpotMap(), 300)
}

window.journalCloseSpotOverlay = () => {
  // Cleanup map
  if (window._journalSpotMapInstance) {
    window._journalSpotMapInstance.remove()
    window._journalSpotMapInstance = null
  }
  window.setState?.({ journalSpotOverlay: null, journalSelectedSpotFromMap: null })
}

window.journalSelectSpotFromMap = () => {
  const selected = window.getState?.()?.journalSelectedSpotFromMap
  if (!selected) return
  window._journalSelectedSpotId = selected.id
  window._journalSelectedSpotName = selected.name || selected.id
  window._journalSpotCreated = false
  // Cleanup map
  if (window._journalSpotMapInstance) {
    window._journalSpotMapInstance.remove()
    window._journalSpotMapInstance = null
  }
  window.setState?.({ journalSpotOverlay: null, journalSelectedSpotFromMap: null })
  window._forceRender?.()
  window.showToast?.(window.t?.('spotSelected') || 'Spot sélectionné', 'success')
}

async function _initJournalSpotMap() {
  const container = document.getElementById('journal-spot-map')
  if (!container || window._journalSpotMapInstance) return
  try {
    const maplibregl = (await import('maplibre-gl')).default
    const map = new maplibregl.Map({
      container: 'journal-spot-map',
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [2.3, 48.8], // Default Paris, will be overridden by GPS
      zoom: 10,
    })
    window._journalSpotMapInstance = map

    // Try to center on user position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        map.setCenter([pos.coords.longitude, pos.coords.latitude])
        map.setZoom(12)
      }, () => {}, { timeout: 5000 })
    }

    // Load spots and add markers
    map.on('load', async () => {
      try {
        const state = window.getState?.() || {}
        const spots = state.spots || []
        spots.forEach(spot => {
          if (!spot.lat || !spot.lng) return
          const el = document.createElement('div')
          el.style.cssText = 'width:24px;height:24px;border-radius:50%;background:#22c55e;border:2px solid #fff;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.3)'
          new maplibregl.Marker({ element: el }).setLngLat([spot.lng, spot.lat]).addTo(map)
          el.addEventListener('click', () => {
            const spotData = { id: spot.id, name: spot.name || spot.city || spot.id, lat: spot.lat, lng: spot.lng }
            window.setState?.({ journalSelectedSpotFromMap: spotData })
            window._forceRender?.()
          })
        })
      } catch { /* spots not loaded */ }
    })
  } catch (err) {
    console.warn('[JournalSpotMap] Init failed:', err.message)
    container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#f87171;font-size:13px">${err.message}</div>`
  }
}

window.journalClearSpot = () => {
  window._journalSelectedSpotId = null
  window._journalSelectedSpotName = null
  window._journalSpotCreated = false
  window._journalSpotWaitMinutes = null
  window._forceRender?.()
}

window.journalToggleExpenses = (el) => {
  const parent = el?.closest('.journal-day-expenses')
  if (parent) parent.classList.toggle('open')
}

window.journalSelectTransport = (transport) => {
  window.setState?.({ journalTransport: transport })
  _saveLegDraft()
}

// ==================== LEG DRAFT (auto-save) ====================

const LEG_DRAFT_KEY = 'spothitch_journal_leg_draft'

function _saveLegDraft() {
  try {
    const draft = {
      departure: document.getElementById('journal-departure')?.value || '',
      arrival: document.getElementById('journal-arrival')?.value || '',
      distance: document.getElementById('journal-distance')?.value || '',
      waitTime: document.getElementById('journal-wait-time')?.value || '',
      rideDuration: document.getElementById('journal-ride-duration')?.value || '',
      price: document.getElementById('journal-price')?.value || '',
      note: document.getElementById('journal-note')?.value || '',
      transport: window.getState?.()?.journalTransport || 'hitchhike',
      savedAt: Date.now(),
    }
    sessionStorage.setItem(LEG_DRAFT_KEY, JSON.stringify(draft))
  } catch { /* ignore */ }
}

function _restoreLegDraft() {
  try {
    const raw = sessionStorage.getItem(LEG_DRAFT_KEY)
    if (!raw) return
    const draft = JSON.parse(raw)
    // Only restore if saved less than 1 hour ago
    if (Date.now() - draft.savedAt > 3600000) return
    setTimeout(() => {
      const fields = {
        'journal-departure': draft.departure,
        'journal-arrival': draft.arrival,
        'journal-distance': draft.distance,
        'journal-wait-time': draft.waitTime,
        'journal-ride-duration': draft.rideDuration,
        'journal-price': draft.price,
        'journal-note': draft.note,
      }
      for (const [id, val] of Object.entries(fields)) {
        const el = document.getElementById(id)
        if (el && val) el.value = val
      }
      if (draft.transport) window.setState?.({ journalTransport: draft.transport })
    }, 200)
  } catch { /* ignore */ }
}

function _clearLegDraft() {
  try { sessionStorage.removeItem(LEG_DRAFT_KEY) } catch { /* ignore */ }
}

// ==================== AUTOCOMPLETE ====================

// Attach Photon autocomplete to journal departure/arrival inputs
let _journalAutocompleteInit = false
function _initJournalAutocomplete() {
  if (_journalAutocompleteInit) return
  const depInput = document.getElementById('journal-departure')
  const arrInput = document.getElementById('journal-arrival')
  if (!depInput || !arrInput) return
  _journalAutocompleteInit = true

  _attachAutocomplete(depInput, '_journalDep')
  _attachAutocomplete(arrInput, '_journalArr')

  // Auto-save draft on any input change
  const draftInputs = ['journal-departure', 'journal-arrival', 'journal-distance',
    'journal-wait-time', 'journal-ride-duration', 'journal-price', 'journal-note']
  draftInputs.forEach(id => {
    const el = document.getElementById(id)
    if (el) el.addEventListener('input', () => setTimeout(_saveLegDraft, 300))
  })

  // Restore draft if available
  _restoreLegDraft()
}

function _attachAutocomplete(input, storeKey) {
  let debounce = null
  input.addEventListener('input', () => {
    clearTimeout(debounce)
    const q = input.value.trim()
    if (q.length < 2) { _hideDropdown(input); return }
    debounce = setTimeout(async () => {
      try {
        const { searchCities } = await import('../services/osrm.js')
        const results = await searchCities(q)
        _showDropdown(input, results, storeKey)
      } catch { /* offline */ }
    }, 150)
  })
}

function _showDropdown(input, results, storeKey) {
  _hideDropdown(input)
  if (!results || results.length === 0) return
  const dropdown = document.createElement('div')
  dropdown.className = 'journal-autocomplete'
  dropdown.style.cssText = 'position:absolute;left:0;right:0;top:100%;z-index:20;background:#1a2332;border:1px solid rgba(255,255,255,.1);border-radius:10px;max-height:200px;overflow-y:auto;box-shadow:0 8px 24px rgba(0,0,0,.5)'
  results.slice(0, 5).forEach(r => {
    const item = document.createElement('div')
    item.style.cssText = 'padding:10px 14px;font-size:13px;color:#e2e8f0;cursor:pointer;border-bottom:1px solid rgba(255,255,255,.04)'
    item.textContent = r.display_name || r.name || `${r.city || ''}, ${r.country || ''}`
    item.addEventListener('click', () => {
      input.value = r.city || r.name || r.display_name?.split(',')[0] || ''
      window[storeKey] = { lat: r.lat, lng: r.lon || r.lng, name: input.value }
      _hideDropdown(input)
    })
    dropdown.appendChild(item)
  })
  input.parentElement.style.position = 'relative'
  input.parentElement.appendChild(dropdown)
}

function _hideDropdown(input) {
  const existing = input.parentElement?.querySelector('.journal-autocomplete')
  if (existing) existing.remove()
}

// Re-init autocomplete after render
const _origJournalAddLeg = window.journalAddLeg
window.journalAddLeg = (tripId) => {
  _journalAutocompleteInit = false
  _origJournalAddLeg?.(tripId) || window.setState?.({ journalView: 'add-leg', journalTripId: tripId, journalTransport: 'hitchhike' })
  setTimeout(_initJournalAutocomplete, 500)
}

// ==================== SHARE ====================

window.journalShareTrip = async (tripId) => {
  const trip = getTrip(tripId)
  if (!trip) return
  const text = `${trip.title || 'Mon voyage'} sur SpotHitch`
  try {
    if (navigator.share) {
      await navigator.share({ title: text, text, url: `https://spothitch.com/trip/${tripId.slice(5, 13)}` })
    } else {
      await navigator.clipboard.writeText(`https://spothitch.com/trip/${tripId.slice(5, 13)}`)
      window.showToast?.('Lien copié !', 'success')
    }
  } catch { /* cancelled */ }
}

window.journalCopyLink = async (tripId) => {
  try {
    await navigator.clipboard.writeText(`https://spothitch.com/trip/${tripId.slice(5, 13)}`)
    window.showToast?.(window.t?.('shareCopied') || 'Lien copié !', 'success')
  } catch { /* clipboard API not available */ }
}

window.journalUseMyPosition = async (field) => {
  if (!navigator.geolocation) {
    window.showToast?.(window.t?.('gpsRequired') || 'GPS non disponible', 'warning')
    return
  }
  window.showToast?.(window.t?.('gpsSearching') || 'Recherche GPS...', 'info')
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        // Reverse geocode with Photon
        const res = await fetch(`https://photon.komoot.io/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&lang=fr`)
        const data = await res.json()
        const place = data?.features?.[0]?.properties
        const name = place?.city || place?.name || place?.county || `${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`
        const input = document.getElementById(`journal-${field}`)
        if (input) {
          input.value = name
          // Store coords for distance calculation
          if (field === 'departure') {
            window._journalDepartureLat = pos.coords.latitude
            window._journalDepartureLng = pos.coords.longitude
          } else {
            window._journalArrivalLat = pos.coords.latitude
            window._journalArrivalLng = pos.coords.longitude
          }
        }
        window.showToast?.(name, 'success')
      } catch {
        const input = document.getElementById(`journal-${field}`)
        if (input) input.value = `${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`
      }
    },
    () => window.showToast?.(window.t?.('gpsRequired') || 'Active la géolocalisation', 'warning'),
    { enableHighAccuracy: true, timeout: 10000 }
  )
}

window.journalExportTrip = (tripId) => {
  const trip = getTrip(tripId)
  if (!trip) return
  // Remove base64 photos from export (too large)
  const exportData = { ...trip, dayPhotos: undefined, coverPhoto: undefined }
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `spothitch-trip-${(trip.title || 'voyage').replace(/[^a-zA-Z0-9]/g, '_')}.json`
  a.click()
  URL.revokeObjectURL(url)
  window.showToast?.(window.t?.('dataExportReady') || 'Export prêt !', 'success')
}
