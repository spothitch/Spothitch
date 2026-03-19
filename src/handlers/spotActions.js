/**
 * Spot Action Handlers
 * Select, add, checkin, review, report, navigate spots
 */

import { escapeHTML } from '../utils/sanitize.js'
import { announceAction } from '../utils/a11y.js'
import { startNavigation } from '../services/navigation.js'

// Spot handlers
window.selectSpot = async (idOrSpot) => {
  _ensureSelectSpotOverride()
  const { actions } = window._appInternals
  // Accept either a plain ID string or an object {id, coordinates}
  const spotId = typeof idOrSpot === 'object' ? idOrSpot?.id : idOrSpot
  const coords = typeof idOrSpot === 'object' ? idOrSpot?.coordinates : null

  const { spots } = window.getState();
  // eslint-disable-next-line eqeqeq
  let spot = spots.find(s => s.id === spotId || s.id == spotId);
  // Also check dynamically loaded spots
  if (!spot) {
    try {
      const { getAllLoadedSpots: getAll } = await import('../services/spotLoader.js');
      const allLoaded = getAll();
      // eslint-disable-next-line eqeqeq
      spot = allLoaded.find(s => s.id === spotId || s.id == spotId);
    } catch (e) { /* spotLoader not available */ }
  }
  // For community spots: always refresh from Firestore (ratings may have been updated by other users)
  if (spotId && (spot?.dataSource === 'community' || !spot)) {
    try {
      const { getSpotById } = await import('../services/firebase.js');
      if (typeof getSpotById === 'function') {
        const fresh = await getSpotById(spotId)
        if (fresh) spot = fresh
      }
    } catch { /* no-op — use cached version */ }
  }
  // Fallback: build minimal spot from passed coordinates
  if (!spot && coords?.lat && coords?.lng) {
    spot = { id: spotId, coordinates: coords, lat: coords.lat, lng: coords.lng }
  }
  if (spot) {
    // Auto-fix BEFORE showing: if community spot has no lastValidated, set it to createdAt
    if (spot.dataSource === 'community' && !spot.lastValidated && spot.createdAt) {
      const createdAt = typeof spot.createdAt === 'string' ? spot.createdAt
        : (spot.createdAt?.toDate ? spot.createdAt.toDate().toISOString() : new Date().toISOString())
      spot.lastValidated = createdAt
      spot.lastTested = createdAt
      spot.validationCount = Math.max(spot.validationCount || 0, 1)
      spot.testCount = Math.max(spot.testCount || 0, 1)
      // Persist fix to Firestore (fire-and-forget)
      import('../services/firebase.js').then(({ updateSpot }) => {
        updateSpot(spot.id, {
          lastValidated: createdAt,
          lastTested: createdAt,
          lastValidatedBy: spot.creator || 'Anonyme',
          lastTestedBy: spot.creator || 'Anonyme',
          validationCount: Math.max(spot.validationCount || 0, 1),
          testCount: Math.max(spot.testCount || 0, 1),
        }).catch(() => {})
      }).catch(() => {})
    }
    // Show spot detail (awaits live data before rendering)
    await actions.selectSpot(spot)
    // Center map
    const lat = spot.coordinates?.lat || spot.lat
    const lng = spot.coordinates?.lng || spot.lng
    if (lat && lng && window.homeMapInstance) {
      window.homeMapInstance.flyTo({ center: [lng, lat], zoom: 14, duration: 800 })
    }
  }
};
window.openSpotDetail = window.selectSpot; // alias for services that use openSpotDetail

// Guard: on mobile, the touch/click that opens SpotDetail can propagate to the
// backdrop's onclick="closeSpotDetail()" if the modal renders under the finger.
// Ignore close calls within 600ms of opening to prevent the open→close→reopen flicker.
let _spotDetailOpenedAt = 0
let _origSelectSpot = null

// Deferred setup: runs when _appInternals is available (after main.js init)
function _ensureSelectSpotOverride() {
  if (_origSelectSpot) return
  const internals = window._appInternals
  if (!internals) return
  _origSelectSpot = internals.actions.selectSpot.bind(internals.actions)
  internals.actions.selectSpot = async (spot) => {
    if (spot) {
      _spotDetailOpenedAt = Date.now()
      // Load live Firebase data BEFORE showing the modal
      try {
        const { fetchSpotValidations, mergeSpotData } = await import('../services/spotLiveData.js')
        const validations = await fetchSpotValidations(spot.id)
        const enriched = mergeSpotData({ ...spot, _liveLoaded: false }, validations)
        if (enriched) spot = enriched
      } catch { /* offline — show static data */ }
    }
    _origSelectSpot(spot)
  }
}
// Try immediately, and retry on first selectSpot call
setTimeout(_ensureSelectSpotOverride, 0)

window.closeSpotDetail = () => {
  if (Date.now() - _spotDetailOpenedAt < 600) return // ignore immediate close
  _ensureSelectSpotOverride()
  if (_origSelectSpot) _origSelectSpot(null)
  else window._appInternals?.actions?.selectSpot?.(null)
};

window.openAddSpot = () => {
  const t = window.t
  // Auth is checked at submission (showSpotSummary), not here.
  // Checking here caused a race condition: Firebase session loads ~1s after page load,
  // so isLoggedIn is false at open → auth modal shown → Firebase resolves → openAddSpot
  // called again → resets form to step 1. Users can fill the form without auth.
  // Reset form data for a fresh start (drafts use openSpotDraft instead)
  window.spotFormData = {
    photos: [], lat: null, lng: null, spotType: null,
    ratings: { safety: 0, traffic: 0, accessibility: 0 },
    tags: { shelter: false, waterFood: false, toilets: false, visibility: false, stoppingSpace: false },
    country: null, countryName: null,
    departureCity: null, departureCityCoords: null,
    directionCity: null, directionCityCoords: null,
    locationName: null, roadNumber: null, positionSource: null,
    method: null, groupSize: null, timeOfDay: null, waitTime: null, season: null,
    rideResult: null, stationName: '', extraDestinations: [],
  }
  // If share target already has coordinates → skip map picker, go straight to form
  if (window._pendingShareCoords) {
    const coords = window._pendingShareCoords
    window.spotFormData.lat = coords.lat
    window.spotFormData.lng = coords.lng
    window.spotFormData.positionSource = 'share'
    window._pendingShareCoords = null
    // Check if a spot type was pre-selected (e.g. from gas station click)
    const pendingType = window._pendingSpotType || null
    window._pendingSpotType = null
    if (pendingType) {
      window.spotFormData.spotType = pendingType
    }
    // Reverse geocode to get city name + country — update DOM directly (no full re-render)
    import('../services/osrm.js').then(({ reverseGeocode }) => {
      reverseGeocode(coords.lat, coords.lng).then(loc => {
        if (loc) {
          if (loc.city) {
            window.spotFormData.departureCity = loc.city
            window.spotFormData.locationName = loc.road || loc.city
            // Update departure input + location display without re-rendering
            const depInput = document.getElementById('spot-departure-city')
            if (depInput) depInput.value = loc.city
            const locDisplay = document.querySelector('#addspot-modal [style*="font-size:13px"][style*="color:#e2e8f0"]')
            if (locDisplay) locDisplay.innerHTML = `${escapeHTML(loc.road || loc.city)} <span style="color:#475569;font-size:11px">${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}</span>`
          }
          if (loc.countryCode) {
            window.spotFormData.country = loc.countryCode
            window.spotFormData.countryName = loc.country
          }
        }
      }).catch(() => {})
    }).catch(() => {})
    window.setState({ showAddSpot: true, addSpotPreview: false, addSpotStep: 1, addSpotType: pendingType })
  } else {
    window.setState({ showAddSpot: true, addSpotPreview: false, addSpotStep: 1, addSpotType: null })
    if (window._pendingShareText) {
      window.showToast(t('sharePickLocation') || 'Pick the spot location on the map', 'info')
    }
  }
}
window.openAddSpotPreview = () => window.setState({ showAddSpot: true, addSpotPreview: true });
window.closeAddSpot = () => {
  // Cleanup AddSpot event listeners to prevent memory leaks
  import('../components/modals/AddSpot.js').then(m => m.cleanupAddSpotListeners?.()).catch(() => {})
  window.setState({
    showAddSpot: false, addSpotPreview: false, addSpotStep: 1, addSpotType: null,
    addSpotValidateId: null,
  })
}

// Open AddSpot in validation mode — "J'ai testé ce spot"
// Reuses the same 3-step wizard but with position/type/city pre-filled from the existing spot
window.openTestSpot = async (spotId) => {
  const { getState, setState } = await import('../stores/state.js')
  const state = getState()
  const spot = (state.spots || []).find(s => String(s.id) === String(spotId)) || state.selectedSpot

  // Pre-fill form from existing spot
  const lat = spot?.coordinates?.lat ?? spot?.lat ?? null
  const lng = spot?.coordinates?.lng ?? spot?.lng ?? spot?.lon ?? null
  // Strip "#N" suffix from spot names (e.g. "Namur #1" → "Namur")
  const rawFrom = spot?.from || spot?.departureCity || spot?.fromCity || null
  const cleanCity = rawFrom ? rawFrom.replace(/\s*#\d+$/, '').trim() : null
  window.spotFormData = {
    photos: [],
    lat, lng,
    spotType: spot?.spotType || 'custom',
    ratings: { safety: 0, traffic: 0, accessibility: 0 },
    tags: { shelter: false, waterFood: false, toilets: false, visibility: false, stoppingSpace: false },
    country: spot?.country || null,
    countryName: spot?.countryName || null,
    departureCity: cleanCity,
    departureCityCoords: spot?.departureCityCoords || null,
    directionCity: null, // User fills their own direction
    directionCityCoords: null,
    locationName: spot?.locationName || spot?.from || null,
    roadNumber: spot?.roadNumber || null,
    positionSource: 'existing_spot',
    method: null, groupSize: null, timeOfDay: null, waitTime: null, season: null,
    rideResult: null, stationName: spot?.stationName || '', extraDestinations: [],
  }

  setState({
    showAddSpot: true,
    addSpotPreview: false,
    addSpotStep: 1, // Start at step 1 so user can add photos
    addSpotType: spot?.spotType || 'custom',
    addSpotValidateId: spotId,
  })
}

// Alias — both buttons use the same validation flow
window.openValidateSpot = window.openTestSpot;

// Location Permission handlers
window.acceptLocationPermission = async () => {
  const t = window.t
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      })
    })
    window.setState({
      showLocationPermission: false,
      locationPermissionGranted: true,
      userLocation: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    })
  } catch (error) {
    console.error('Geolocation error:', error)
    window.showToast(t('locationFailed') || 'Impossible d\'obtenir la localisation', 'error')
    window.setState({ showLocationPermission: false })
  }
}
window.declineLocationPermission = () => {
  window.setState({ showLocationPermission: false, locationPermissionDenied: true })
  /* silent — user can always enable location later from settings */
}
window.closeLocationPermission = () => window.setState({ showLocationPermission: false })
window.openRating = (_spotId) => {
  // Rating modal not yet implemented — no-op
};
window.closeRating = () => window.setState({ showRating: false, ratingSpotId: null });
window.openNavigation = (lat, lng) => {
  if (lat && lng) {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  }
};
window.getSpotLocation = () => {
  const t = window.t
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        const latInput = document.getElementById('spot-lat');
        const lngInput = document.getElementById('spot-lng');
        if (latInput) latInput.value = lat;
        if (lngInput) lngInput.value = lng;
      },
      () => window.showToast(t('positionFailed') || 'GPS indisponible. Place le spot manuellement.', 'error'),
      { enableHighAccuracy: true }
    );
  }
};
// AddSpot 3-step form handlers → defined in AddSpot.js (with validation)
window.doCheckin = async (spotId) => {
  const t = window.t
  const { getFirebase } = window._appInternals
  const { recordCheckin } = await import('../services/gamification.js')
  recordCheckin()
  getFirebase().then(fb => fb.saveValidationToFirebase(spotId, window.getState().user?.uid))
  window.showToast(t('checkinSuccess'), 'success')
  announceAction('checkin', true)

  // Show share card after checkin
  const { spots } = window.getState()
  const spot = spots.find(s => s.id === spotId)
  if (spot) {
    setTimeout(async () => {
      try {
        const { showShareModal } = await import('../services/shareCard.js')
        showShareModal(spot)
      } catch (err) {
        console.warn('Failed to show share modal:', err)
      }
    }, 500)
  }
  // Log to trip history
  try {
    const { logTripEvent } = await import('../services/tripHistory.js')
    logTripEvent('checkin', { spotId })
  } catch (e) { /* trip history optional */ }
};
window.submitReview = async (spotId) => {
  const t = window.t
  const { getFirebase } = window._appInternals
  if (!window.requireProfile('review')) return
  const comment = document.getElementById('review-comment')?.value
  const rating = window.getState().currentRating || 4
  if (comment) {
    // Proximity check for reviews
    const spot = window.getState().selectedSpot
    const spotLat = spot?.coordinates?.lat || spot?.lat
    const spotLng = spot?.coordinates?.lng || spot?.lng
    if (spotLat && spotLng) {
      const { checkProximity } = await import('../services/proximityVerification.js')
      const proximity = checkProximity(spotLat, spotLng, window.getState().userLocation)
      if (!proximity.allowed) {
        window.showToast(t('proximityRequired') || 'Tu es trop loin de ce spot pour valider.', 'error')
        return
      }
    }
    try {
      const fb1 = await getFirebase()
      await fb1.saveCommentToFirebase({ spotId, text: comment, rating })
      const { recordReview } = await import('../services/gamification.js')
      recordReview()
      window.showToast(t('reviewPublished') || 'Avis publié !', 'success')
      window.setState({ showRating: false })
    } catch (err) {
      console.error('Review submit failed:', err)
      window.showToast(t('reviewNetworkError') || 'Ton avis n\'a pas été envoyé. Vérifie ta connexion.', 'error')
    }
  }
};
window.setRating = (rating) => window.setState({ currentRating: rating });
window.reportSpotAction = async (spotId) => {
  const t = window.t
  const { getFirebase } = window._appInternals
  const reason = prompt(t('reportReason') || 'Raison du signalement ?');
  if (reason) {
    try {
      const fb2 = await getFirebase()
      const result = await fb2.reportSpot(spotId, reason);
      if (result?.success === false) throw new Error(result.error || 'Report failed')
      window.showToast(t('reportSent') || 'Signalement envoyé', 'success');
    } catch (err) {
      console.error('Report failed:', err)
      window.showToast(t('reportNetworkError') || 'Signalement non envoyé. Vérifie ta connexion.', 'error');
    }
  }
};

// Navigation GPS handlers
window.startSpotNavigation = async (lat, lng, name) => {
  const t = window.t
  if (!lat || !lng) {
    window.showToast(t('missingCoordinates') || 'Coordonnées manquantes', 'error');
    return;
  }
  // Close spot detail modal
  window.setState({ selectedSpot: null });
  // Start navigation
  await startNavigation(lat, lng, name || t('hitchhikingSpot') || 'Spot d\'autostop');
};
// stopNavigation and openExternalNavigation registered by navigation.js (static import above)

// Translate a spot text element (description or comment)
window.translateSpotText = async (elementId) => {
  const el = document.getElementById(elementId)
  if (!el) return

  const originalText = el.dataset.originalText
  if (!originalText) return

  // If already translated, show original
  if (el.dataset.translated === 'true') {
    el.textContent = el.dataset.isComment === 'true' ? `"${originalText}"` : originalText
    el.dataset.translated = 'false'
    const btn = el.nextElementSibling
    if (btn?.tagName === 'BUTTON') btn.textContent = window.t?.('translate') || 'Traduire'
    return
  }

  // Get user's language
  const userLang = window.getState?.()?.lang || 'fr'

  // Check cache
  const cacheKey = `spothitch_tr_${userLang}_${originalText.substring(0, 40)}`
  const cached = localStorage.getItem(cacheKey)
  if (cached) {
    el.textContent = el.dataset.isComment === 'true' ? `"${cached}"` : cached
    el.dataset.translated = 'true'
    const btn = el.nextElementSibling
    if (btn?.tagName === 'BUTTON') btn.textContent = window.t?.('showOriginal') || 'Original'
    return
  }

  // Show loading
  const btn = el.nextElementSibling
  if (btn?.tagName === 'BUTTON') btn.textContent = '⏳...'

  try {
    const { translateViaAPI } = await import('../services/autoTranslate.js')
    const translated = await translateViaAPI(originalText, 'autodetect', userLang, 8000)

    if (translated && translated.toLowerCase() !== originalText.toLowerCase()) {
      el.textContent = el.dataset.isComment === 'true' ? `"${translated}"` : translated
      el.dataset.translated = 'true'
      if (btn?.tagName === 'BUTTON') btn.textContent = window.t?.('showOriginal') || 'Original'
      try { localStorage.setItem(cacheKey, translated) } catch { /* quota */ }
    } else {
      if (btn?.tagName === 'BUTTON') btn.textContent = window.t?.('sameLanguage') || 'Même langue'
      setTimeout(() => { if (btn?.tagName === 'BUTTON') btn.textContent = window.t?.('translate') || 'Traduire' }, 2000)
    }
  } catch {
    if (btn?.tagName === 'BUTTON') btn.textContent = window.t?.('translationFailed') || 'Erreur'
    setTimeout(() => { if (btn?.tagName === 'BUTTON') btn.textContent = window.t?.('translate') || 'Traduire' }, 2000)
  }
}
