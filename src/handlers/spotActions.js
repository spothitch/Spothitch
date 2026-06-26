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
    // Enrich with live Firebase data (validations with correct experienceDates)
    try {
      const { enrichSpotWithLiveData } = await import('../services/spotLiveData.js')
      spot = await enrichSpotWithLiveData(spot)
    } catch { /* offline — use spot data as-is */ }
    // Show spot detail
    await actions.selectSpot(spot)
    // Center map (validate coords first)
    const lat = spot.coordinates?.lat || spot.lat
    const lng = spot.coordinates?.lng || spot.lng
    if (lat && lng && isFinite(lat) && isFinite(lng) && window.homeMapInstance) {
      try {
        window.homeMapInstance.flyTo({ center: [lng, lat], zoom: 14, duration: 800 })
      } catch { /* map not ready */ }
    }
  }
};
window.openSpotDetail = window.selectSpot; // alias for services that use openSpotDetail

// Guard: on mobile, the touch/click that opens SpotDetail can propagate to the
// backdrop's onclick="closeSpotDetail()" if the modal renders under the finger.
// Ignore close calls within 600ms of opening to prevent the open→close→reopen flicker.
let _spotDetailOpenedAt = 0
let _origSelectSpot = null
let _selectSpotRequestId = 0

// Deferred setup: runs when _appInternals is available (after main.js init)
function _ensureSelectSpotOverride() {
  if (_origSelectSpot) return
  const internals = window._appInternals
  if (!internals) return
  _origSelectSpot = internals.actions.selectSpot.bind(internals.actions)
  internals.actions.selectSpot = async (spot) => {
    if (spot) {
      _spotDetailOpenedAt = Date.now()
      // Cancel stale requests: only the latest selectSpot call shows its result
      const requestId = ++_selectSpotRequestId
      // Load live Firebase data BEFORE showing the modal
      try {
        const { fetchSpotValidations, mergeSpotData } = await import('../services/spotLiveData.js')
        const validations = await fetchSpotValidations(spot.id)
        // Abort if a newer request was started while we were fetching
        if (requestId !== _selectSpotRequestId) return
        const enriched = mergeSpotData({ ...spot, _liveLoaded: false }, validations)
        if (enriched) spot = enriched
      } catch { /* offline — show static data */ }
      // Final check: still the latest request?
      if (requestId !== _selectSpotRequestId) return
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

/** Close SpotDetail, switch to map tab, and fly to the spot location */
window.flyToSpotOnMap = (lat, lng) => {
  if (!lat || !lng || !isFinite(lat) || !isFinite(lng)) return
  // Close the spot detail modal
  window.closeSpotDetail?.()
  // Switch to map tab
  window.setState?.({ activeTab: 'map' })
  // Fly to the spot on the map
  setTimeout(() => {
    if (window.homeMapInstance) {
      try {
        window.homeMapInstance.flyTo({ center: [lng, lat], zoom: 15, duration: 1000 })
      } catch { /* map not ready */ }
    }
  }, 300)
}

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
            if (locDisplay) locDisplay.innerHTML = `${escapeHTML(loc.road || loc.city)} <span class="text-[#475569] text-[11px]">${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}</span>`
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
    if (window._pendingShareNoCoords) {
      window._pendingShareNoCoords = false
      setTimeout(() => {
        window.showToast(t('shareNoCoordsFound') || 'Position exacte non trouvée. Place le point manuellement sur la carte.', 'warning')
      }, 500)
    } else if (window._pendingShareText) {
      window.showToast(t('sharePickLocation') || 'Pick the spot location on the map', 'info')
    }
  }
}
window.openAddSpotPreview = () => window.setState({ showAddSpot: true, addSpotPreview: true });

// Start auto-save draft when AddSpot opens
setTimeout(() => {
  import('../components/modals/AddSpot.js').then(m => m.startAutoSaveDraft?.()).catch(() => {})
}, 1000)

window.closeAddSpot = () => {
  // If user has data entered, ask for confirmation
  const step = window.getState?.()?.addSpotStep || 1
  if (step > 1 && window.spotFormData?.lat) {
    if (!confirm(window.t?.('confirmDiscardSpot') || 'Quitter ? Les données saisies seront perdues.')) return
  }
  // Cleanup AddSpot event listeners + auto-save draft
  import('../components/modals/AddSpot.js').then(m => {
    m.cleanupAddSpotListeners?.()
    m.stopAutoSaveDraft?.()
  }).catch(() => {})
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
  const spot = (state.spots || []).find(
    s => String(s.id) === String(spotId),
  ) || state.selectedSpot

  // Pre-fill form from existing spot
  const lat = spot?.coordinates?.lat ?? spot?.lat ?? null
  const lng = spot?.coordinates?.lng ?? spot?.lng ?? spot?.lon ?? null

  // GPS proximity check before opening
  let gpsVerifiedOnOpen = false
  let gpsDistanceOnOpen = null
  let forceCustomDate = false

  if (lat && lng) {
    const { checkGpsForAction } = await import('../services/gpsTrust.js')
    const gpsResult = await checkGpsForAction(lat, lng, 'validation')
    if (!gpsResult.proceed) {
      if (gpsResult.chooseDate) {
        forceCustomDate = true // will open date picker
      } else {
        return // user cancelled
      }
    }
    gpsVerifiedOnOpen = gpsResult.gpsVerified
    gpsDistanceOnOpen = gpsResult.gpsDistance
  }

  // Strip "#N" suffix from spot names (e.g. "Namur #1" → "Namur")
  const rawFrom = spot?.from || spot?.departureCity || spot?.fromCity || null
  const cleanCity = rawFrom
    ? rawFrom.replace(/\s*#\d+$/, '').trim()
    : null
  window.spotFormData = {
    photos: [],
    lat, lng,
    spotType: spot?.spotType || 'custom',
    // Validating a KNOWN spot: skip the "nearby duplicate" detection (it would otherwise find
    // the very spot being validated and block step 1 → step 2 with a confusing "Spot nearby!" modal).
    _duplicateConfirmed: true,
    ratings: {
      safety: 0, traffic: 0, accessibility: 0,
    },
    tags: {
      shelter: false, waterFood: false, toilets: false,
      visibility: false, stoppingSpace: false,
    },
    country: spot?.country || null,
    countryName: spot?.countryName || null,
    departureCity: cleanCity,
    departureCityCoords: spot?.departureCityCoords || null,
    directionCity: null,
    directionCityCoords: null,
    locationName: spot?.locationName || spot?.from || null,
    roadNumber: spot?.roadNumber || null,
    positionSource: 'existing_spot',
    method: null, groupSize: null, timeOfDay: null,
    waitTime: null, season: null,
    rideResult: null, stationName: spot?.stationName || '',
    extraDestinations: [],
    // GPS verification flags for submission
    _gpsVerifiedOnOpen: gpsVerifiedOnOpen,
    _gpsDistance: gpsDistanceOnOpen,
    _forceCustomDate: forceCustomDate,
  }

  setState({
    showAddSpot: true,
    addSpotPreview: false,
    addSpotStep: 1,
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
window.openRating = (spotId) => {
  window.setState({ showRating: true, ratingSpotId: spotId, currentRating: 0 })
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

  const spot = window.getState().selectedSpot
  const currentUid = window.getState().user?.uid || window.getState().currentUser?.uid
  if (!currentUid) {
    window.showToast(t('mustBeConnected') || 'Tu dois être connecté', 'error')
    return
  }

  // Prevent self-review
  if (currentUid && spot?.creatorId === currentUid) {
    window.showToast(t('cannotReviewOwnSpot') || 'Tu ne peux pas noter ton propre spot', 'warning')
    return
  }

  const comment = (document.getElementById('review-comment')?.value || '').trim()
  const rating = window.getState().currentRating || 0

  if (!rating) {
    window.showToast(t('reviewSelectRating') || 'Sélectionne une note', 'warning')
    return
  }

  if (comment && comment.length < 10) {
    window.showToast(t('reviewTooShort') || 'Ton avis doit faire au moins 10 caractères', 'warning')
    return
  }

  // 1 review per user per spot (localStorage check first, Firestore checks in saveCommentToFirebase)
  const reviewKey = `spothitch_review_${spotId}_${currentUid}`
  if (localStorage.getItem(reviewKey)) {
    window.showToast(t('reviewAlreadySubmitted') || 'Tu as déjà publié un avis pour ce spot', 'warning')
    return
  }

  try {
    const fb1 = await getFirebase()
    const result = await fb1.saveCommentToFirebase({ spotId, text: comment, rating })
    if (!result.success) {
      if (result.error === 'duplicate') {
        localStorage.setItem(reviewKey, Date.now().toString())
        window.showToast(t('reviewAlreadySubmitted') || 'Tu as déjà publié un avis pour ce spot', 'warning')
      } else {
        window.showToast(t('reviewNetworkError') || 'Erreur. Vérifie ta connexion.', 'error')
      }
      return
    }
    localStorage.setItem(reviewKey, Date.now().toString())
    // Gamification only after successful Firebase write
    const { recordReview } = await import('../services/gamification.js')
    recordReview()
    // Invalidate spot cache so the review appears immediately
    try {
      const { invalidateSpotCache } = await import('../services/spotLiveData.js')
      invalidateSpotCache(spotId)
    } catch { /* optional */ }
    window.showToast(t('reviewPublished') || 'Avis publié !', 'success')
    window.setState({ showRating: false, currentRating: 0 })
  } catch (err) {
    console.error('Review submit failed:', err)
    window.showToast(t('reviewNetworkError') || 'Ton avis n\'a pas été envoyé. Vérifie ta connexion.', 'error')
  }
};
window.setRating = (rating) => window.setState({ currentRating: rating });
// reportSpotAction → delegates to the modal report system (openReport)
window.reportSpotAction = (spotId) => {
  window.openReport('SPOT', String(spotId))
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
