/**
 * Trip Journal Handlers
 * All window.* functions for the journal UI
 */

import {
  createTrip, addLeg, endTrip, updateTrip,
  setDayNote, setDayExpenses, setDayPhoto, getTrip,
  EXPENSE_CATEGORIES,
} from '../services/tripJournal.js'

// ==================== NAVIGATION ====================

window.journalBack = () => {
  const state = window.getState?.() || {}
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
    waitMinutes: window._journalSpotWaitMinutes || null,
  }

  const leg = addLeg(tripId, legData)
  if (leg) {
    // Clear spot selection
    window._journalSelectedSpotId = null
    window._journalSelectedSpotName = null
    window._journalSpotCreated = false
    window._journalSpotWaitMinutes = null

    window.setState?.({ journalView: 'detail', journalTripId: tripId })
    window.showToast?.('Étape ajoutée !', 'success')

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
            leg.arrival.lat = toCoords.lat
            leg.arrival.lng = toCoords.lon || toCoords.lng
            localStorage.setItem('spothitch_journal_trips', JSON.stringify(trips))
            window._forceRender?.()
          }
        }
      }
    }
  } catch { /* distance calculation failed, leg still saved without it */ }
}

window.journalEndTrip = (tripId) => {
  const trip = getTrip(tripId)
  if (!trip) return
  // Check all days have notes
  // (soft check — just warn, don't block)
  endTrip(tripId)
  window.setState?.({ journalView: 'stats', journalTripId: tripId })
  window.showToast?.('Voyage terminé !', 'success')
}

window.journalTogglePublic = (tripId) => {
  const trip = getTrip(tripId)
  if (!trip) return
  updateTrip(tripId, { isPublic: !trip.isPublic })
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

// ==================== SPOT PICKER ====================

window.journalPickSpot = (mode) => {
  // For now: prompt-based (will be replaced with map overlay later)
  if (mode === 'use') {
    window.showToast?.('Ouvre la carte, tape sur un spot, puis clique "Ajouter au voyage"', 'info')
  } else {
    window.showToast?.('Ouvre la carte, crée un spot, il sera automatiquement lié', 'info')
  }
}

window.journalSelectTransport = (transport) => {
  window.setState?.({ journalTransport: transport })
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
    window.showToast?.('Lien copié !', 'success')
  } catch { /* clipboard API not available */ }
}
