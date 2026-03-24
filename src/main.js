/**
 * SpotHitch - Main Entry Point
 * La communauté des autostoppeurs
 */

// Styles
import './styles/main.css';

// State & Store
import { getState, setState, subscribe, actions } from './stores/state.js';

// Firebase — lazy-loaded to save 115KB gzip on initial load
let _firebase = null
async function getFirebase() {
  if (!_firebase) _firebase = await import('./services/firebase.js')
  return _firebase
}
// Sentry — lazy-loaded (non-critical for FCP)
import { initNotifications, showToast } from './services/notifications.js';
import { initOfflineHandler } from './services/offline.js';
function preloadMap() {
  // Start MapLibre download IMMEDIATELY (not idle/2s delay)
  import('maplibre-gl').then(() => {
    markLoaded('mapModule')
  }).catch(() => {
    markLoaded('mapModule') // Don't block progress on error
  })
  // Preload OpenFreeMap style in parallel (fetch only, browser caches it)
  fetch('https://tiles.openfreemap.org/styles/liberty', { mode: 'cors' })
    .then(() => markLoaded('mapStyle'))
    .catch(() => markLoaded('mapStyle'))
}

function preloadTabChunks() {
  const preload = () => {
    import('./components/views/Voyage.js').catch(() => {})
    import('./components/views/Social.js').catch(() => {})
    import('./components/views/Profile.js').catch(() => {})
  }
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(preload, { timeout: 5000 })
  } else {
    setTimeout(preload, 4000)
  }
}
// i18n
import { t, setLanguage, initI18n } from './i18n/index.js';

// Components
import { renderApp, afterRender, getActiveTabPanelId, renderActiveView, renderModals, renderOverlays } from './components/App.js';
import { renderHeader } from './components/Header.js';
import { renderNavigation } from './components/Navigation.js';
import { initSplashScreen, hideSplashScreen, markLoaded } from './components/SplashScreen.js';

// Data
import { sampleSpots } from './data/spots.js';
// guides.js loaded dynamically to reduce main bundle size

// Utils
import { initSEO, trackPageView } from './utils/seo.js';
import { prefersReducedMotion } from './utils/a11y.js';
import { initPWA, showInstallBanner, dismissInstallBanner, installPWA } from './utils/pwa.js';
import { initNetworkMonitor, cleanupOldData, requireOnline } from './utils/network.js';
import { scheduleRender, shouldRerender, clearRenderCache } from './utils/render.js';
import { debounce } from './utils/performance.js';
import { observeAllLazyImages } from './utils/lazyImages.js';
import { initWebVitals } from './utils/webVitals.js';
import { initHoverPrefetch, prefetchNextTab } from './utils/prefetch.js';
import { trackTabChange } from './utils/analytics.js';
import { cleanupDrafts } from './utils/formPersistence.js';
import { initWasm } from './utils/wasmGeo.js';
import { escapeHTML, escapeJSString } from './utils/sanitize.js';
import { runAllCleanup } from './utils/cleanup.js';
import { initDeepLinkListener, captureShareParams } from './utils/deeplink.js';
import { initBackButton, goBack } from './utils/backButton.js';
import { setupGlobalErrorHandlers as setupErrorHandlers } from './utils/errorBoundary.js';
import { resetFilters as resetFiltersUtil } from './components/modals/Filters.js';
import './components/modals/Leaderboard.js'; // Register global handlers
import './components/modals/FeatureSlides.js'; // Feature Slides (openFeatureSlides, closeFeatureSlides, etc.)
import './components/modals/FeatureIntroModal.js'; // Feature Intro glassmorphism (showFeatureIntro, closeFeatureIntro, etc.)
import { registerCheckinHandlers } from './components/modals/CheckinModal.js'; // Checkin modal handlers
import './services/navigation.js'; // stopNavigation/openExternalNavigation registered by navigation.js itself
import './services/gasStations.js'; // Gas stations (registers window.toggleGasStations)
import {
  initScreenReaderSupport,
  announce as srAnnounce,
  announceViewChange,
} from './services/screenReader.js'; // Accessibility
import {
  loadModal,
  preloadModals,
  preloadOnIdle,
} from './utils/lazyLoad.js';
import { ADMIN_EMAILS } from './utils/constants.js'
import {
  restoreCompanionMode,
  onOverdue as onCompanionOverdue,
} from './services/companion.js'
import {
  showLoading,
  hideLoading,
  setLoadingMessage,
  setLoadingProgress,
  isLoading,
  withLoading,
} from './components/LoadingIndicator.js';

// ==================== STALE CACHE RECOVERY ====================
// If a dynamic import fails (e.g. stale hash after deploy), clear caches and reload.
// This prevents "site inaccessible" errors when the PWA serves outdated assets.
window.addEventListener('error', (e) => {
  const msg = e.message || ''
  if (msg.includes('Failed to fetch dynamically imported module')
    || msg.includes('Importing a module script failed')
    || msg.includes('Loading chunk')
    || msg.includes('Loading CSS chunk')) {
    // Already handled by index.html inline script? Skip.
    if (window.__swRecovery) return
    // Already reloading? Don't loop
    if (sessionStorage.getItem('spothitch_cache_recovery')) return
    sessionStorage.setItem('spothitch_cache_recovery', '1')
    // If a share flow is active, clear caches but DON'T reload
    // (the cleared cache will let subsequent dynamic imports fetch from network)
    const isShareFlow = window._shareInProgress
      || window.location.search.includes('action=share')
      || sessionStorage.getItem('spothitch_share_flow')
    // Guarded reload: only reload if NOT in share flow (visibilityState irrelevant for cache recovery)
    const safeReload = () => { if (!isShareFlow) window.location.reload() }
    if (window.caches) {
      caches.keys().then(keys =>
        Promise.all(keys.map(k => caches.delete(k)))
      ).then(safeReload).catch(safeReload)
    } else {
      safeReload()
    }
  }
})
// Clear recovery flag on successful load
sessionStorage.removeItem('spothitch_cache_recovery')

// ==================== AUTO-UPDATE ====================
import { startVersionCheck } from './services/autoUpdate.js'

function updateAppBadge(count) {
  if (!('setAppBadge' in navigator)) return
  try {
    if (count > 0) {
      navigator.setAppBadge(count).catch(() => {})
    } else {
      navigator.clearAppBadge().catch(() => {})
    }
  } catch (_e) {
    // Badging API not available or permission denied — ignore silently
  }
}

// ==================== INITIALIZATION ====================

/**
 * Initialize the application
 */
async function init() {
  // Restore last known position from localStorage (instant, no GPS wait)
  const savedPos = localStorage.getItem('spothitch_last_position')
  if (savedPos) {
    try {
      const loc = JSON.parse(savedPos)
      if (loc.lat && loc.lng) actions.setUserLocation(loc)
    } catch { /* corrupted data — ignore */ }
  }

  // GPS ready promise — resolved when fresh GPS arrives or after 3s timeout
  let resolveGpsReady
  const gpsReadyPromise = new Promise((r) => { resolveGpsReady = r })
  const gpsTimeout = setTimeout(resolveGpsReady, 3000)

  // Request geolocation early (during loading screen) so the map is ready at user's position
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        localStorage.setItem('spothitch_last_position', JSON.stringify(loc)) // lgtm[js/clear-text-storage-of-sensitive-data] — geolocation for map centering, declared in RGPD registry
        // Only set if we don't already have a location (avoid overwriting high-accuracy result)
        if (!getState().userLocation) {
          actions.setUserLocation(loc)
          loadNearbySpots(loc)
        }
        clearTimeout(gpsTimeout)
        resolveGpsReady()
      },
      () => { clearTimeout(gpsTimeout); resolveGpsReady() },
      { timeout: 5000, enableHighAccuracy: false }
    )
  } else {
    clearTimeout(gpsTimeout)
    resolveGpsReady()
  }

  // Initialize splash screen (tips + progress tracking)
  // The splash HTML is already in index.html for instant display
  initSplashScreen();

  // Always preload map module during initial loading (onboarding or splash)
  // so MapLibre is ready when user opens the map tab
  preloadMap()
  // Preload other tab chunks during idle for instant first switch
  preloadTabChunks()

  // Check for reset parameter in URL
  if (window.location.search.includes('reset')) {
    localStorage.clear();
    window.history.replaceState({}, '', window.location.pathname);
  }

  // EARLY share target detection: capture share params to sessionStorage IMMEDIATELY
  // before any async work. This preserves share data even if the URL changes later.
  const _isShareTarget = captureShareParams() || window.location.search.includes('action=share')
  if (_isShareTarget) {
    try { localStorage.setItem('spothitch_landing_v2', '1') } catch { /* no-op */ }
    try { localStorage.setItem('spothitch_beta_seen', '1') } catch { /* no-op */ }
    try { localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({ preferences: { necessary: true }, timestamp: Date.now(), version: '1.0' })) } catch { /* no-op */ }
    setState({ showLanding: false, showWelcome: false })
    // Block ALL auto-reload mechanisms during the share flow (survives page reloads)
    try { sessionStorage.setItem('spothitch_share_flow', String(Date.now())) } catch { /* no-op */ }
    window._shareInProgress = true
  }

  try {
    // Load detected language translations (only active language, not all 4)
    const lang = await initI18n();
    setState({ lang });
    document.documentElement.lang = lang;

    // Initialize SEO
    initSEO();

    // Check reduced motion preference
    if (prefersReducedMotion()) {
      document.documentElement.classList.add('reduce-motion');
    }

    // === CRITICAL PATH: render first, init services after ===

    // Show landing page for first-time visitors (skip if already logged in)
    if (!localStorage.getItem('spothitch_landing_v2') && !getState().isLoggedIn) {
      setState({ showLanding: true })
    }

    // Purge stale spot-data caches (SW + IDB)
    if (!localStorage.getItem('spothitch_spot_cache_purged_v2')) {
      localStorage.setItem('spothitch_spot_cache_purged_v2', '1')
      if (window.caches) {
        caches.delete('spot-data').catch(() => {})
        caches.delete('spot-index').catch(() => {})
      }
      import('./utils/idb.js').then(({ clear }) => {
        clear('spots').catch(() => {})
      }).catch(() => {})
    }

    // Initialize offline handler (needed for first render)
    try { initOfflineHandler() } catch (e) { /* optional */ }

    // Expose _forceRender for lazy-loaded modules (bypasses dirty-checking + fingerprint)
    window._forceRender = () => {
      clearRenderCache('app')
      _lastModalFingerprint = '' // Always reset so lazy-loaded modals appear
      // Force re-render of the active tab so lazy-loaded content appears
      const currentState = getState()
      const activePanel = getActiveTabPanelId(currentState)
      if (activePanel !== 'map') {
        _renderedTabs.delete(activePanel) // force re-render of this tab
      }
      scheduleRender(() => render(currentState))
    }

    // Subscribe to state changes and render IMMEDIATELY
    subscribe((state) => {
      scheduleRender(() => render(state));
    });

    // Subscribe to unread count changes and update app badge
    let _lastBadgeCount = -1
    subscribe((state) => {
      const count = (state.unreadFriendMessages || 0) + (state.unreadDMCount || 0)
      if (count !== _lastBadgeCount) {
        _lastBadgeCount = count
        updateAppBadge(count)
      }
    });

    // Load initial data (spots) — triggers render via state change
    loadInitialData();

    // === NON-CRITICAL: defer everything else after first paint ===
    requestAnimationFrame(() => setTimeout(async () => {
      try {
        // Draggable feedback button
        try { initDraggableFeedbackBtn() } catch (e) { /* optional */ }

        // Screen reader support
        try { initScreenReaderSupport() } catch (e) { /* optional */ }

        // PWA
        try { initPWA() } catch (e) { /* optional */ }

        // Network monitor + offline guard for Firebase writes
        try { initNetworkMonitor() } catch (e) { /* optional */ }
        window.requireOnline = requireOnline

        // Notifications
        try { await initNotifications() } catch (e) { console.warn('Notifications init failed:', e.message) }

        // Error tracking (Sentry)
        // NOTE: only initSentry — do NOT call setupGlobalErrorHandlers here,
        // errorBoundary already handles global errors and Sentry SDK auto-captures them.
        try {
          const { initSentry } = await import('./services/sentry.js')
          await initSentry()
        } catch (e) { console.warn('Sentry init failed:', e.message) }

        // Firebase — always initialize and listen for auth state
        // Firebase Auth persists sessions in IndexedDB, so a returning user
        // may already be signed in even without anything in localStorage.
        try {
          const fb = await getFirebase()
          const firebaseOk = fb.initializeFirebase()

          // App Check disabled for alpha — re-enable for public launch
          // import('./services/appCheck.js').then(ac => ac.initAppCheck()).catch(() => {})

          // Initialize Remote Config (non-blocking, uses defaults if fails)
          import('./services/remoteConfig.js').then(rc => rc.initRemoteConfig()).catch(() => {})

          if (!firebaseOk) {
            // Show a visible banner when Firebase fails to initialize
            const banner = document.createElement('div')
            banner.id = 'firebase-init-banner'
            banner.setAttribute('role', 'alert')
            banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:#f59e0b;color:#000;text-align:center;padding:10px 16px;font-size:14px;font-weight:500;display:flex;align-items:center;justify-content:center;gap:8px'
            const msg = (typeof t === 'function' && t('firebaseInitFailed')) || 'Connection issue. Some features may not work.'
            banner.innerHTML = `<span>${msg}</span><button onclick="location.reload()" style="background:#000;color:#f59e0b;border:none;border-radius:6px;padding:4px 12px;font-size:13px;font-weight:600;cursor:pointer">${(typeof t === 'function' && t('retry')) || 'Retry'}</button>`
            document.body.prepend(banner)
          }

          // Handle auth state changes (fires immediately with current state, then on every change)
          fb.onAuthChange(async (user) => {
            if (user) {
              // Skip if handleGoogleSignIn/handleAuth already set the same user.
              // Checking only UID (not showAuth) prevents the race condition where
              // onAuthStateChanged fires before the signin handler finishes setState,
              // which would erase showCompleteProfile and cause a double re-render.
              const current = getState()
              if (current.currentUser?.uid === user.uid) {
                // User already set by the sign-in handler — just ensure isLoggedIn is synced
                if (!current.isLoggedIn) {
                  actions.setUser(user)
                }
                return
              }
              actions.setUser(user)
              const updates = {
                currentUser: user,
                isAdmin: ADMIN_EMAILS.includes(user.email?.toLowerCase()),
                userProfile: {
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName,
                  photoURL: user.photoURL,
                },
              }
              // Auto-dismiss landing for logged-in users
              if (getState().showLanding) {
                updates.showLanding = false
                try { localStorage.setItem('spothitch_landing_v2', '1') } catch { /* no-op */ }
              }
              // Start Firebase subscriptions for friends + DMs + favorites
              try {
                const [friendsModule, dmModule, gcModule, favsModule] = await Promise.all([
                  import('./services/friends.js'),
                  import('./services/directMessages.js'),
                  import('./services/groupConversations.js'),
                  import('./services/favorites.js'),
                ])
                friendsModule.subscribeFriendsList(user.uid)
                dmModule.subscribeToAllConversations(user.uid)
                gcModule.subscribeToAllGroupConversations(user.uid)
                favsModule.subscribeFavorites(user.uid)
                favsModule.syncLocalFavoritesToFirestore(user.uid)
                // Start watching for friends in Guardian mode
                import('./services/guardianWatch.js').then(gw => {
                  gw.startGuardianWatch(() => scheduleRender(() => window._appInternals.render()))
                }).catch(() => {})
              } catch { /* non-bloquant */ }
              // If we're returning from a Google redirect, close the auth modal
              // (getRedirectResult can return null on some browsers — this is the backup)
              if (sessionStorage.getItem('spothitch_auth_redirect')) {
                sessionStorage.removeItem('spothitch_auth_redirect')
                updates.showAuth = false
                updates.authPendingAction = null
                updates.showAuthReason = null
                fb.createOrUpdateUserProfile(user).catch(err => console.error('Profile sync failed:', err))
                // Execute pending action
                const pendingAction = sessionStorage.getItem('spothitch_auth_pending_action')
                sessionStorage.removeItem('spothitch_auth_pending_action')
                if (pendingAction === 'addSpot') setTimeout(() => window.openAddSpot?.(), 300)
                else if (pendingAction === 'sos') setTimeout(() => window.openSOS?.(), 300)
                else if (pendingAction === 'companion') setTimeout(() => window.showCompanionModal?.(), 300)
                else if (pendingAction === 'social') setTimeout(() => setState({ activeTab: 'social' }), 300)
                else if (pendingAction === 'tripPlanner') setTimeout(() => window.openTripPlanner?.(), 300)
              }
              setState(updates)
              // Hydrate profile from Firestore (bio, languages, etc.)
              fb.hydrateLocalProfileFromFirestore(user.uid).catch(() => {})
              // Sync points/badges from Firestore (multi-device sync)
              import('./services/gamification.js').then(m => m.loadPointsFromFirestore(user.uid)).catch(() => {})
              // Hydrate ALL local data from Firestore (checkins, streaks, achievements, etc.)
              import('./services/firebaseSync.js').then(m => m.hydrateAllFromFirestore(user.uid)).catch(() => {})
              // Sync trips from Firestore (merge with localStorage, Firebase wins)
              import('./services/firebase.js').then(async fbModule => {
                try {
                  const TRIPS_KEY = 'spothitch_saved_trips'
                  const localTrips = (() => { try { return JSON.parse(localStorage.getItem(TRIPS_KEY) || '[]') } catch { return [] } })()
                  const { success, trips: remoteTrips } = await fbModule.getUserTrips(user.uid)
                  if (!success) return
                  // Build merged map: local trips + remote trips (remote wins on id collision)
                  const merged = new Map()
                  localTrips.forEach(t => t.id && merged.set(t.id, t))
                  remoteTrips.forEach(t => t.id && merged.set(t.id, t))
                  const mergedArr = [...merged.values()].sort((a, b) => (b.savedAt || '') > (a.savedAt || '') ? 1 : -1)
                  localStorage.setItem(TRIPS_KEY, JSON.stringify(mergedArr))
                  // Push local-only trips to Firebase (migration)
                  const remoteIds = new Set(remoteTrips.map(t => t.id))
                  const uid = user.uid
                  const localOnly = localTrips.filter(t => t.id && !remoteIds.has(t.id))
                  localOnly.forEach(t => fbModule.saveTrip(uid, t).catch(() => {}))
                  window._forceRender?.()
                } catch { /* non-bloquant */ }
              }).catch(() => {})
            } else {
              actions.setUser(null)
              setState({ currentUser: null, userProfile: null, isAdmin: false })
            }
            try {
              import('./services/sentry.js').then(m => m.setUser(user))
            } catch (_e) { /* sentry optional */ }
          })

          // Check for pending Google redirect result (signInWithRedirect)
          try {
            const redirectResult = await fb.checkRedirectResult()
            if (redirectResult?.success && redirectResult.user) {
              const user = redirectResult.user
              await fb.createOrUpdateUserProfile(user)
              fb.hydrateLocalProfileFromFirestore(user.uid).catch(() => {})
              import('./services/firebaseSync.js').then(m => m.hydrateAllFromFirestore(user.uid)).catch(() => {})
              actions.setUser(user)
              setState({
                showAuth: false,
                authPendingAction: null,
                showAuthReason: null,
                currentUser: user,
                isAdmin: ADMIN_EMAILS.includes(user.email?.toLowerCase()),
                userProfile: {
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName,
                  photoURL: user.photoURL,
                },
              })
              // Execute pending action that was saved before the redirect
              const pendingAction = sessionStorage.getItem('spothitch_auth_pending_action')
              sessionStorage.removeItem('spothitch_auth_pending_action')
              if (pendingAction === 'addSpot') setTimeout(() => window.openAddSpot?.(), 300)
              else if (pendingAction === 'sos') setTimeout(() => window.openSOS?.(), 300)
              else if (pendingAction === 'companion') setTimeout(() => window.showCompanionModal?.(), 300)
              else if (pendingAction === 'social') setTimeout(() => setState({ activeTab: 'social' }), 300)
              else if (pendingAction === 'tripPlanner') setTimeout(() => window.openTripPlanner?.(), 300)
            }
          } catch (_e) { /* redirect check optional */ }
        } catch (e) { console.warn('Firebase init failed:', e.message) }

        // Lazy background services
        try { const { initNearbyFriendsTracking } = await import('./services/nearbyFriends.js'); initNearbyFriendsTracking() } catch (e) { /* optional */ }
        try { const { initProximityAlerts } = await import('./services/proximityAlerts.js'); initProximityAlerts() } catch (e) { /* optional */ }
        try { const { initProximityNotify } = await import('./services/proximityNotify.js'); initProximityNotify() } catch (e) { /* optional */ }
        try { const { startLocationTracking } = await import('./services/locationHistory.js'); startLocationTracking() } catch (e) { /* optional */ }
        try { const { initPostHog } = await import('./utils/posthog.js'); initPostHog() } catch (e) { /* optional */ }

        // Request persistent storage (prevents browser from evicting IDB data)
        try { navigator.storage?.persist?.() } catch (e) { /* optional */ }

        // Preload, cleanup, monitoring
        try { preloadOnIdle() } catch (e) { /* optional */ }
        try { cleanupOldData() } catch (e) { /* optional */ }
        try { initWebVitals() } catch (e) { /* optional */ }
        try { initWasm() } catch (e) { /* optional */ }
        try { initHoverPrefetch() } catch (e) { /* optional */ }
        try { cleanupDrafts() } catch (e) { /* optional */ }
      } catch (e) {
        console.warn('Non-critical init error:', e.message)
      }
    }, 0))

    // Trigger initial render
    scheduleRender(() => render(getState()));

    // Handle deep links from URL params
    try {
      initDeepLinkListener();
    } catch (e) {
      console.warn('Deep link init skipped:', e.message);
    }

    // Android back button (History API + popstate)
    try {
      initBackButton();
    } catch (e) {
      console.warn('Back button init skipped:', e.message);
    }

    // Setup global error handlers (errorBoundary only — Sentry has its own via initSentry)
    // NOTE: Sentry's setupGlobalErrorHandlers is intentionally NOT called to avoid
    // double-reporting. Sentry SDK auto-captures unhandled errors via its integration.
    try {
      setupErrorHandlers();
    } catch (e) {
      console.warn('Error handlers skipped:', e.message);
    }

    // Mark app as ready — splash will hide when all steps complete + min time elapsed
    markLoaded('appReady')
    // GPS ready (non-blocking for splash, but mark it)
    if (savedPos) {
      gpsReadyPromise.then(() => {}).catch(() => {})
    }
    // Fallback: force hide after 6s max (safety net)
    setTimeout(() => hideLoader(), 6000)

    // Register service worker
    registerServiceWorker();

    // Setup keyboard shortcuts
    setupKeyboardShortcuts();

    // Desktop: set initial tab-map class
    const initTab = getState().activeTab
    document.body.classList.toggle('tab-map', initTab === 'map' || !initTab)


    // Register checkin modal handlers
    try {
      registerCheckinHandlers();
    } catch (e) {
      console.warn('Checkin handlers skipped:', e.message);
    }

    // Initialize auto offline sync (lazy-loaded, no permanent interval)
    try {
      const { initAutoOfflineSync } = await import('./services/autoOfflineSync.js')
      initAutoOfflineSync()
    } catch (e) {
      console.warn('Auto offline sync skipped:', e.message);
    }

    // Initialize push notifications (if previously enabled)
    try {
      const { initPushNotifications } = await import('./services/pushNotifications.js')
      initPushNotifications()
    } catch (e) {
      console.warn('Push notifications skipped:', e.message)
    }

    // Restore companion mode if it was active
    try {
      const wasActive = restoreCompanionMode()
      if (wasActive) {
        onCompanionOverdue(() => {
          setState({ showCompanionModal: true })
        })
      }
    } catch (e) {
      console.warn('Companion mode restore skipped:', e.message)
    }

    // Listen for service worker messages (push notification actions)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'COMPANION_CHECKIN') {
          window.companionCheckIn?.()
        } else if (event.data?.type === 'COMPANION_ALERT') {
          window.companionSendAlert?.()
        }
      })
    }

    // Register cleanup on page unload (pagehide = iOS fallback, beforeunload unreliable on iOS)
    window.addEventListener('beforeunload', runAllCleanup);
    window.addEventListener('pagehide', runAllCleanup);

    // Auto-update check: reload if a new version is deployed
    startVersionCheck()
  } catch (error) {
    console.error('❌ Init error:', error);
    // Show error to user but still try to render
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.innerHTML = `
        <div style="text-align:center;padding:20px">
          <div style="color:#ef4444;font-size:48px;margin-bottom:16px">⚠️</div>
          <div style="color:#fff;font-size:18px;margin-bottom:8px">${t('loadingError') || 'Erreur de chargement'}</div>
          <div style="color:#94a3b8;font-size:14px" id="init-error-msg"></div>
          <button onclick="location.reload()" class="reload-btn">${t('retry') || 'Réessayer'}</button>
          <style>.reload-btn{margin-top:16px;padding:8px 16px;background:#f59e0b;color:#fff;
            border:none;border-radius:8px;cursor:pointer}</style>
        </div>
      `;
      const errorMsg = document.getElementById('init-error-msg');
      if (errorMsg) errorMsg.textContent = error.message;
    }
  }
}

/**
 * Load initial spot data
 */
function loadInitialData() {
  // Load sample spots for demo
  actions.setSpots(sampleSpots);

  // Load saved trips from localStorage
  try {
    const savedTrips = JSON.parse(localStorage.getItem('spothitch_saved_trips') || '[]')
    if (savedTrips.length > 0) setState({ savedTrips })
  } catch (e) { /* no-op */ }

  // Try to get user location with high accuracy (upgrades the early low-accuracy request)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        actions.setUserLocation(loc)
        // Load nearby spots if not already loaded by early request
        loadNearbySpots(loc)
      },
      () => {
        // Location not available - continue without
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }
}

/**
 * Load spots near a location via spotLoader
 */
async function loadNearbySpots(loc) {
  try {
    const { loadSpotsInBounds, autoDownloadUserCountry } = await import('./services/spotLoader.js')
    const bounds = {
      north: loc.lat + 3,
      south: loc.lat - 3,
      east: loc.lng + 3,
      west: loc.lng - 3,
    }
    const spots = await loadSpotsInBounds(bounds)
    if (spots.length > 0) {
      const current = getState().spots || []
      const existingIds = new Set(current.map(s => s.id))
      const newSpots = spots.filter(s => !existingIds.has(s.id))
      if (newSpots.length > 0) {
        actions.setSpots([...current, ...newSpots])
      }
    }
    // Auto-download user's country to IDB for offline use
    autoDownloadUserCountry(loc.lat, loc.lng).catch(() => {})
  } catch (e) {
    console.warn('loadNearbySpots failed:', e)
  }
}

/**
 * Hide the loading screen (splash screen)
 */
function hideLoader() {
  // Use the splash screen hide function
  hideSplashScreen();
}

// Scroll position storage
const scrollPositions = new Map();
let previousTab = null;

/**
 * Save scroll position for current tab
 */
function saveScrollPosition(tab) {
  if (tab) {
    scrollPositions.set(tab, window.scrollY || document.documentElement.scrollTop || 0);
  }
}

/**
 * Restore scroll position for tab
 */
function restoreScrollPosition(tab) {
  const saved = scrollPositions.get(tab);
  if (saved !== undefined) {
    window.scrollTo(0, saved);
  }
}

/**
 * Main render function
 */
// Dynamic render fingerprint — hashes all primitive state values (bool/string/number/null)
// Skips arrays/objects by default, but tracks null↔object transitions for key result states
const OBJECT_PRESENCE_KEYS = new Set(['tripResults', 'userProfile', 'currentUser', 'roadmapVotes', 'selectedSpot'])
function getRenderFingerprint(state) {
  let fp = ''
  for (const key in state) {
    const v = state[key]
    if (v === null || v === undefined) { fp += '0|'; continue }
    const t = typeof v
    if (t === 'boolean') { fp += v ? '1|' : '2|'; continue }
    if (t === 'string') { fp += v + '|'; continue }
    if (t === 'number') { fp += v + '|'; continue }
    // For key result objects, track null↔present transition (not full content)
    if (t === 'object' && OBJECT_PRESENCE_KEYS.has(key)) { fp += 'obj|'; continue }
    // Skip other arrays/objects — they're data, not layout flags
  }
  return fp
}

/**
 * SELECTIVE RENDER — only updates DOM sections that actually changed.
 * First call does a full render (app.innerHTML). Subsequent calls update
 * individual containers (header, active tab, modals, overlays, nav).
 * Tab panels are PERSISTENT — switching tabs shows/hides them via display:none.
 */
let _appInitialized = false
const _renderedTabs = new Set() // tracks which tab panels have been rendered at least once
let _lastModalFingerprint = ''

// Modal fingerprint: tracks only the state keys that affect which modals are rendered.
// This prevents re-rendering modals (destroying AddSpot form, etc.) on unrelated state changes.
function getModalFingerprint(state) {
  return [
    state.showAgeVerification, state.showIdentityVerification,
    state.selectedSpot?.id, state.showRating, state.currentRating,
    state.showAddSpot, state.addSpotStep, state.addSpotPreview,
    state.showSOS, state.showAuth, state.authMode, state.showCompleteProfile,
    state.showFilters, state.showStats, state.showBadges, state.showChallenges,
    state.showShop, state.showMyRewards, state.showQuiz, state.showLeaderboard,
    !!state.checkinSpot, state.showDailyReward, state.showBadgePopup,
    state.showBadgeDetail, state.selectedBadgeId,
    state.navigationActive, state.showDonation, state.showDonationThankYou,
    state.showAmbassadorSuccess, state.showContactAmbassador, !!state.selectedAmbassador,
    state.showProfileCustomization, state.showNearbyFriends, state.showReport, state.selectedReportReason,
    state.showCompanionModal, state.showMyData, state.showAdmin,
    state.showFeatureSlides, state.showFeatureIntro,
  ].join('|')
}

function render(state) {
  const app = document.getElementById('app')
  if (!app) return

  // Desktop: sync tab-map class on body for CSS header constraint
  const isMap = state.activeTab === 'map' || !state.activeTab
  document.body.classList.toggle('tab-map', isMap)

  // Skip re-render if user is actively typing in an input (prevents losing focus/value)
  const focused = document.activeElement
  const tripJustFinished = !state.tripLoading && state.tripResults
  if (focused && (focused.tagName === 'INPUT' || focused.tagName === 'TEXTAREA' || focused.tagName === 'SELECT') && !tripJustFinished) {
    return
  }

  // Render fingerprint: skip if nothing visual changed
  const fp = getRenderFingerprint(state)
  if (!shouldRerender('app', fp)) return

  // Save scroll position before tab switches
  const savedScroll = window.scrollY || document.documentElement.scrollTop || 0
  if (previousTab && previousTab !== state.activeTab) {
    saveScrollPosition(previousTab)
  }

  // === FIRST RENDER: full innerHTML (creates all persistent containers) ===
  if (!_appInitialized) {
    // Preserve map containers across initial render
    const homeMapContainer = document.getElementById('home-map')
    const savedHomeMap = (homeMapContainer && window.homeMapInstance) ? homeMapContainer : null
    const tripMapContainer = document.getElementById('trip-map')
    const savedTripMap = (tripMapContainer && tripMapContainer.dataset.initialized === 'true') ? tripMapContainer : null

    app.innerHTML = renderApp(state)
    _appInitialized = true

    // Track which tab was rendered
    const activePanel = getActiveTabPanelId(state)
    _renderedTabs.add(activePanel)
    _renderedTabs.add('map') // map is always rendered

    // Re-insert preserved map containers
    if (savedHomeMap) {
      const slot = document.getElementById('home-map')
      if (slot) slot.replaceWith(savedHomeMap)
    }
    if (savedTripMap) {
      const slot = document.getElementById('trip-map')
      if (slot) slot.replaceWith(savedTripMap)
    }

    afterRender(state)
    requestAnimationFrame(() => observeAllLazyImages())
    previousTab = state.activeTab
    return
  }

  // === SELECTIVE RENDER: only update what changed ===
  const activePanel = getActiveTabPanelId(state)
  const tabChanged = previousTab !== state.activeTab
  const isVoyageMapFirst = state.activeTab === 'challenges' && state.tripResults && state.tripFormCollapsed

  // 1. Update header (only if needed)
  const headerEl = document.getElementById('app-header')
  if (headerEl) {
    const newHeader = isVoyageMapFirst ? '' : renderHeader(state)
    headerEl.innerHTML = newHeader
  }

  // 2. Update main-content class for voyage map-first
  const mainEl = document.getElementById('main-content')
  if (mainEl) {
    mainEl.className = isVoyageMapFirst
      ? 'min-h-screen overflow-x-hidden'
      : 'pb-28 pt-[4.5rem] min-h-screen overflow-x-hidden'
  }

  // 3. Switch tab panels visibility (NO re-render of inactive tabs)
  const allPanels = ['map', 'challenges', 'social', 'profile', 'spots']
  for (const panelId of allPanels) {
    const panel = document.getElementById(`panel-${panelId}`)
    if (!panel) continue
    const isActive = panelId === activePanel
    panel.style.display = isActive ? '' : 'none'
  }

  // 4. Render the active tab content
  // Always re-render non-map tabs to ensure fresh data (cost: ~5ms)
  if (activePanel !== 'map') {
    const panel = document.getElementById(`panel-${activePanel}`)
    if (panel) {
      panel.innerHTML = renderActiveView(state)
      _renderedTabs.add(activePanel)
    }
  }

  // 5. Update navigation (only on tab change)
  if (tabChanged) {
    const navEl = document.getElementById('app-nav')
    if (navEl) {
      navEl.innerHTML = renderNavigation(state)
    }
  }

  // 6. Update modals container
  // Only re-render if modal-related state changed (prevents destroying AddSpot form
  // during unrelated state changes like spots loading, GPS updates, etc.)
  const modalFp = getModalFingerprint(state)
  if (modalFp !== _lastModalFingerprint) {
    _lastModalFingerprint = modalFp
    // Preserve misplaced map across re-renders (MapLibre GL canvas)
    const modalsEl = document.getElementById('app-modals')
    if (modalsEl) {
      const misplacedMap = document.getElementById('report-misplaced-wrapper')
      const savedMisplacedMap = (misplacedMap && misplacedMap.querySelector('canvas')) ? misplacedMap : null

      modalsEl.innerHTML = renderModals(state)

      if (savedMisplacedMap) {
        const slot = document.getElementById('report-misplaced-wrapper')
        if (slot) slot.replaceWith(savedMisplacedMap)
      }
    }
  }

  // 7. Update overlays container
  const overlaysEl = document.getElementById('app-overlays')
  if (overlaysEl) {
    const landingEl = document.getElementById('landing-page')
    const savedLanding = (landingEl && state.showLanding) ? landingEl : null

    overlaysEl.innerHTML = renderOverlays(state)

    if (savedLanding) {
      const slot = document.getElementById('landing-page')
      if (slot) slot.replaceWith(savedLanding)
    }
  }

  // Post-render hooks
  afterRender(state)
  requestAnimationFrame(() => observeAllLazyImages())

  // Track tab changes
  if (tabChanged) {
    trackTabChange(state.activeTab)
    prefetchNextTab(state.activeTab)
    setTimeout(() => restoreScrollPosition(state.activeTab), 50)
  } else {
    // Same tab: restore exact scroll position (prevents jump to top)
    requestAnimationFrame(() => {
      if (savedScroll > 0) window.scrollTo(0, savedScroll)
    })
  }

  previousTab = state.activeTab

  // If switching to spots map view, navigate to home map instead
  if (state.activeTab === 'spots' && state.viewMode === 'map') {
    setState({ activeTab: 'map', viewMode: null })
  }
}

/**
 * Register service worker — non-aggressive update strategy
 * New SW activates on next natural page load, no forced reloads
 */
async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return

  try {
    const registration = await navigator.serviceWorker.register('/sw.js')

    // Check for SW updates every 2 minutes
    setInterval(() => registration.update(), 2 * 60 * 1000)

    // Check for updates when user returns to the app
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        registration.update()
      }
    })

    // Check on online recovery
    window.addEventListener('online', () => registration.update())

    // When a new SW is found, it will skipWaiting (configured in vite.config.js)
    // Then controllerchange fires → handled in startVersionCheck() → auto-reload
  } catch (error) {
    console.error('Service Worker registration failed:', error)
  }
}

/**
 * Setup keyboard shortcuts
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Escape to close modals
    if (e.key === 'Escape') {
      setState({
        showAddSpot: false,
        showRating: false,
        showSOS: false,
        showSettings: false,
        showQuiz: false,
        showAuth: false,
        showBadges: false,
        showChallenges: false,
        showShop: false,
        showMyRewards: false,
        showStats: false,
        showFilters: false,
        showSideMenu: false,
        showLeaderboard: false,
        showDonation: false,
        showCompanionModal: false,
        showFeedbackPanel: false,
        feedbackDetailFeature: null,
        selectedSpot: null,
      });
    }

    // Ctrl+K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.querySelector('#search-input');
      if (searchInput) searchInput.focus();
    }
  });
}

// ==================== GLOBAL HANDLERS ====================

// Make functions available globally for onclick handlers

// Reset App
window.resetApp = async () => {
  if (confirm(t('resetAppConfirm') || 'Réinitialiser l\'application ? Toutes les données locales seront effacées.')) {
    localStorage.clear();
    sessionStorage.clear();
    // Clear Service Worker caches so everything reloads fresh
    if ('caches' in window) {
      const names = await caches.keys()
      await Promise.all(names.map(n => caches.delete(n)))
    }
    location.reload();
  }
};

// Back button (Android hardware/gesture back)
window.goBack = goBack

// Navigation
window.changeTab = (tab) => {
  // Cleanup map listeners when leaving map tab
  if (tab !== 'map' && window._cleanupMapListeners) {
    window._cleanupMapListeners()
  }
  // Close panels that shouldn't persist across tabs
  const { showOfflinePanel } = getState()
  if (showOfflinePanel) setState({ showOfflinePanel: false })
  actions.changeTab(tab);
  // Desktop: toggle body class for CSS header constraint
  document.body.classList.toggle('tab-map', tab === 'map' || !tab)
  trackPageView(tab);
  announceViewChange(tab);
};

// Open full map — just navigate to home map tab
window.openFullMap = () => {
  setState({ activeTab: 'map' });
  trackPageView('map');
};
window.toggleTheme = () => {
  const s = getState()
  const newTheme = s.theme === 'dark' ? 'light' : 'dark'
  setState({ theme: newTheme })
  document.body.classList.toggle('light-theme', newTheme === 'light')
  // Persist immediately (don't wait for microtask debounce) so reload preserves theme
  try { localStorage.setItem('spothitch_theme_override', newTheme) } catch { /* no-op */ }
}
window.setViewMode = (mode) => {
  if (mode === 'map') {
    // Redirect to home map instead of old map service
    setState({ activeTab: 'map' })
  } else {
    setState({ viewMode: mode })
  }
};
window.t = t;
window.setState = setState;
window.getState = getState;
window.showToast = showToast;
// Expose internals for extracted handler files (actions, render helpers)
window._appInternals = { actions, getFirebase, render: () => render(getState()), scheduleRender, clearRenderCache }

// Spot handlers (extracted to handlers/spotActions.js)
import './handlers/spotActions.js'

// SOS handlers (extracted to handlers/sos.js)
import './handlers/sos.js'

// Auth + Identity + Welcome handlers (extracted to handlers/authIdentity.js)
import './handlers/authIdentity.js'

// Settings handlers — Settings is a sub-tab in Profile, not a standalone modal
window.openSettings = () => setState({ activeTab: 'profile', profileSubTab: 'reglages' });

// Delete account stub — real handler in DeleteAccount.js overrides after lazy-load
window.openDeleteAccount = () => {
  const state = getState()
  if (!state.isLoggedIn) { showToast(t('mustBeConnected') || 'Vous devez être connecté', 'error'); return }
  setState({ showDeleteAccount: true })
}
window.closeSettings = () => setState({ profileSubTab: 'profil' });
window.setLanguage = async (lang) => {
  // Write lang directly to localStorage BEFORE anything else
  // This ensures it survives the reload regardless of state/render timing
  try {
    const stored = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
    stored.lang = lang
    localStorage.setItem('spothitch_v4_state', JSON.stringify(stored))
  } catch (e) { /* no-op */ }
  // Load new language translations then reload
  await setLanguage(lang)
  // Force full page reload to apply translations everywhere
  window.location.href = window.location.href.split('#')[0]
};

// Tutorial handlers — retired (replaced by Alpha Welcome Popup)
// Stubs kept so onclick references in AdminPanel don't throw
window.startTutorial = () => { /* retired */ }
window.nextTutorial = () => { /* retired */ }
window.prevTutorial = () => { /* retired */ }
window.skipTutorial = () => { /* retired */ }
window.closeTutorial = () => { /* retired */ }
window.finishTutorial = () => { /* retired */ }

// Filter handlers
window.setFilter = (filter) => actions.setFilter(filter);
window.handleSearch = (query) => debounce('search', () => actions.setSearchQuery(query), 250);
window.openFilters = () => setState({ showFilters: true });
window.closeFilters = () => setState({ showFilters: false });
window.toggleSplitView = () => {
  const s = getState()
  setState({ splitView: !s.splitView })
};
window.openActiveTrip = () => {
  setState({ showTripPlanner: true })
};
window.setFilterCountry = (country) => setState({ filterCountry: country });
window.setFilterMinRating = (rating) => setState({ filterMinRating: rating });
window.setFilterMaxWait = (wait) => setState({ filterMaxWait: wait });
window.toggleVerifiedFilter = () => {
  const { filterVerifiedOnly } = getState();
  setState({ filterVerifiedOnly: !filterVerifiedOnly });
};
window.setSortBy = (sortBy) => setState({ sortBy });
window.applyFilters = () => {
  // Close overlay + update state
  const overlay = document.getElementById('filters-overlay')
  if (overlay) overlay.remove()
  setState({ showFilters: false })
  // Refresh spots on map with new filter settings (no map destroy)
  if (window._refreshMapSpots) window._refreshMapSpots()
};
window.resetFilters = () => resetFiltersUtil();

// Gamification handlers (extracted to handlers/gamification.js)
import './handlers/gamification.js'

// UI toggles
window.closeFavoritesOnMap = () => setState({ showFavoritesOnMap: false, filterFavorites: false });
// toggleGasStations is registered by gasStations.js (import at top)

// Missing close handlers for modals/overlays
window.closeTitlePopup = () => setState({ showTitlePopup: false, newTitle: null })
window.closeSeasonRewards = () => setState({ showSeasonRewards: false })
window.closeAnniversaryModal = () => setState({ showAnniversaryModal: false })
window.closeAmbassadorSuccess = () => setState({ showAmbassadorSuccess: false })
window.closeAmbassadorProfile = () => setState({ showAmbassadorProfile: false })
window.closeContactAmbassador = () => setState({ showContactAmbassador: false })
window.sendAmbassadorMessage = () => {
  const msg = document.getElementById('ambassador-message')?.value?.trim()
  if (!msg) return
  window.showToast?.(t('ambassadorMessageSent') || 'Message envoyé !', 'success')
  setState({ showContactAmbassador: false, selectedAmbassador: null })
}
window.closeReviewForm = () => setState({ showReviewForm: false, reviewSpotId: null })
window.closeReplyModal = () => setState({ showReplyModal: false, replyToReviewId: null })
window.closeAddForbiddenWordModal = () => setState({ showAddForbiddenWordModal: false })
window.closeRouteAmenities = () => setState({ showRouteAmenities: false, routeAmenities: [] })
window.closePostTravelPlan = () => setState({ showPostTravelPlan: false })
window.closePhotoUpload = () => setState({ showPhotoUpload: false, photoUploadSpotId: null })
window.closeAdminModeration = () => setState({ showAdminModeration: false })
window.closeTravelPlanDetail = () => setState({ showTravelPlanDetail: false, selectedTravelPlan: null })
window.closeLanguageSelector = () => setState({ showLanguageSelector: false })
window.closeCookieBanner = () => setState({ showCookieBanner: false })
window.closeReportModal = () => window.closeReport?.()
window.closeDangerReportModal = () => setState({ showDangerReport: false })

// Trip handlers are now defined in Travel.js (calculateTrip, saveTrip, etc.)
// Only keep backward-compatible aliases for old planner step-based mode
window.searchTripCity = (query) => {
  if (query.length < 3) {
    document.getElementById('city-suggestions')?.classList.add('hidden')
    return
  }
  debounce('tripCity', async () => {
    const { searchTripLocation } = await import('./services/planner.js')
    const results = await searchTripLocation(query)
    const container = document.getElementById('city-suggestions')
    if (container && results.length > 0) {
      container.classList.remove('hidden')
      container.innerHTML = `
        <div class="bg-white/5 rounded-xl shadow-xl border border-white/10 overflow-hidden">
          ${results.map(r => `
            <button onclick="addTripStepFromSearch('${escapeJSString(r.name)}', ${Number(r.lat)}, ${Number(r.lng)}, '${escapeJSString(r.fullName)}')"
                    class="w-full px-4 py-3 text-left text-white hover:bg-white/10 border-b border-white/10 last:border-0">
              <div class="font-medium">${escapeHTML(r.name)}</div>
              <div class="text-xs text-slate-400 truncate">${escapeHTML(r.fullName)}</div>
            </button>
          `).join('')}
        </div>
      `
    }
  }, 400)
}
window.addTripStepFromSearch = async (name, lat, lng, fullName) => {
  const { addTripStep } = await import('./services/planner.js')
  addTripStep({ name, lat, lng, fullName })
  const stepInput = document.getElementById('step-input')
  if (stepInput) stepInput.value = ''
  document.getElementById('city-suggestions')?.classList.add('hidden')
}
window.addFirstSuggestion = () => {
  const firstBtn = document.querySelector('#city-suggestions button')
  if (firstBtn) firstBtn.click()
}
window.removeTripStep = async (index) => {
  const { removeTripStep } = await import('./services/planner.js')
  removeTripStep(index)
}
window.moveTripStep = async (from, to) => {
  const { reorderTripSteps } = await import('./services/planner.js')
  reorderTripSteps(from, to)
}
window.clearTripSteps = async () => {
  const { clearTripSteps } = await import('./services/planner.js')
  clearTripSteps()
}

// Trip Planner (redirects to Voyage tab now)
window.openTripPlanner = () => setState({ activeTab: 'challenges', voyageSubTab: 'voyage' })
window.closeTripPlanner = () => setState({ showTripPlanner: false })
window.openGuidesOverlay = () => setState({ activeTab: 'challenges', voyageSubTab: 'guides' })
window.closeGuidesOverlay = () => setState({ showGuidesOverlay: false })

// Guides handlers (guides is a sub-tab of Voyage/challenges — ERR-020)
window.showGuides = () => setState({ activeTab: 'challenges', voyageSubTab: 'guides', selectedCountryCode: null, showSafety: false });
window.showCountryDetail = (code) => setState({ selectedCountryCode: code });
window.showSafetyPage = () => setState({ showSafety: true });
window.closeSafety = () => setState({ showSafety: false })
window.reportGuideError = async (countryCode) => {
  const { getGuideByCode } = await import('./data/guides.js');
  const guide = getGuideByCode(countryCode);
  const name = guide?.name || countryCode;
  const errorType = prompt(t('guideErrorReport') || `Quelle information est incorrecte dans le guide ${name} ?`);
  if (errorType) {
    // Store reports in localStorage as fallback
    const reports = JSON.parse(localStorage.getItem('spothitch_guide_reports') || '[]');
    reports.push({ countryCode, error: errorType, date: new Date().toISOString() });
    localStorage.setItem('spothitch_guide_reports', JSON.stringify(reports));

    // Also save to Firestore (only if authenticated — ERR-002)
    const currentUser = getState().user
    if (currentUser?.uid) {
      try {
        const { db } = await import('./services/firebase.js');
        const { collection, addDoc } = await import('firebase/firestore');
        await addDoc(collection(db, 'guide_reports'), {
          countryCode,
          error: errorType,
          date: new Date().toISOString(),
          userId: currentUser.uid
        });
      } catch (error) {
        // Firestore save failed - report stored locally
      }
    }

    showToast(t('thankYouReport') || 'Merci pour le signalement ! Nous allons vérifier.', 'success');
  }
};

// Friends handlers (friends is a sub-tab of Social — ERR-020)
window.showFriends = () => setState({ activeTab: 'social', socialSubTab: 'friends', selectedFriendId: null });
window.openFriendsChat = (friendId) => setState({ selectedFriendId: friendId });

// Sharing handlers (global) — lazy-loaded
window.shareSpot = async (...args) => {
  const { shareSpot } = await import('./utils/share.js')
  shareSpot(...args)
}
window.shareBadge = async (...args) => {
  const { shareBadge } = await import('./utils/share.js')
  shareBadge(...args)
}
window.shareStats = async (...args) => {
  const { shareStats } = await import('./utils/share.js')
  shareStats(...args)
}
window.shareApp = async (...args) => {
  const { shareApp } = await import('./utils/share.js')
  shareApp(...args)
}
window.openShareCard = async () => {
  const state = getState()
  const spot = state.selectedSpot
  if (!spot) return
  const { showShareModal } = await import('./services/shareCard.js')
  showShareModal(spot)
}
// showAddFriend — canonical in Social.js
window.closeAddFriend = () => setState({ showAddFriend: false });
// acceptFriendRequest — canonical in Social.js
// declineFriendRequest — canonical in Social.js
// sendPrivateMessage — canonical in Social.js
window.copyFriendLink = () => {
  navigator.clipboard?.writeText('spothitch.app/add/user123').catch(() => {});
};

// Legal handlers
window.showLegalPage = (page = 'cgu') => setState({ showLegal: true, legalPage: page });
window.closeLegal = () => setState({ showLegal: false });

// Side menu handlers (no render function yet — stub with toast)
window.openSideMenu = () => {
  /* not yet implemented */
};
window.closeSideMenu = () => setState({ showSideMenu: false });

// Accessibility handlers
// showAccessibilityHelp — canonical in screenReader.js
// closeAccessibilityHelp — canonical in screenReader.js
window.srAnnounce = srAnnounce; // Allow components to announce

// PWA handlers
window.showInstallBanner = showInstallBanner;
window.dismissInstallBanner = dismissInstallBanner;
window.installPWA = installPWA;

// Map handlers
window.centerOnUser = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        if (window.homeMapInstance) {
          window.homeMapInstance.flyTo({ center: [longitude, latitude], zoom: 13, duration: 800 })
        }
      },
      () => { /* silently fail */ },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }
};

// Titles modal handler
window.openTitles = () => setState({ showTitles: true });
window.closeTitles = () => setState({ showTitles: false });

// Report / moderation handlers (moderation.js is lazy-loaded)
// All report handlers need stubs so onclick="" in the modal HTML works
async function _loadModeration() {
  const mod = await import('./services/moderation.js')
  return mod
}
if (!window.openReport) {
  window.openReport = async (type, targetId) => {
    await _loadModeration()
    window.openReport(type, targetId)
  }
}
if (!window.closeReport) {
  window.closeReport = () => setState({
    showReport: false, reportType: null,
    reportTargetId: null, selectedReportReason: null,
  })
}
if (!window.selectReportReason) {
  window.selectReportReason = async (reason) => {
    await _loadModeration()
    window.selectReportReason(reason)
  }
}
if (!window.submitCurrentReport) {
  window.submitCurrentReport = async () => {
    await _loadModeration()
    window.submitCurrentReport()
  }
}

// Nearby friends handlers — lazy-loaded
window.toggleNearbyFriends = async (...args) => {
  const { toggleNearbyFriends } = await import('./services/nearbyFriends.js')
  return toggleNearbyFriends(...args)
}
window.openNearbyFriends = () => setState({ showNearbyFriends: true })
window.closeNearbyFriends = () => setState({ showNearbyFriends: false })

// Proximity alerts handlers — lazy-loaded
window.toggleProximityAlerts = async (...args) => {
  const { toggleProximityAlerts } = await import('./services/proximityAlerts.js')
  return toggleProximityAlerts(...args)
}
window.setProximityRadius = async (...args) => {
  const { setProximityRadius } = await import('./services/proximityAlerts.js')
  return setProximityRadius(...args)
}

// Trip history handlers — lazy-loaded
window.openTripHistory = () => setState({ showTripHistory: true })
window.closeTripHistory = () => setState({ showTripHistory: false })
window.clearTripHistory = async () => {
  if (confirm(t('clearTripHistory') || 'Effacer tout l\'historique de voyage ?')) {
    const { clearTripHistory } = await import('./services/tripHistory.js')
    clearTripHistory()
    setState({ showTripHistory: false })
  }
}

// Image handlers — lazy-loaded
window.compressImage = async (...args) => {
  const { compressImage } = await import('./utils/imageOptimizer.js')
  return compressImage(...args)
}
window.generateThumbnail = async (...args) => {
  const { generateThumbnail } = await import('./utils/imageOptimizer.js')
  return generateThumbnail(...args)
}
window.validateImage = async (...args) => {
  const { validateImage } = await import('./utils/imageOptimizer.js')
  return validateImage(...args)
}

// Landing, feedback, contact handlers (extracted to handlers/landing.js)
import { initDraggableFeedbackBtn } from './handlers/landing.js'

// Companion Mode handlers (extracted to handlers/companion.js)
import './handlers/companion.js'

// City Panel handlers (extracted to handlers/cityPanel.js)
import './handlers/cityPanel.js'

// Lazy load handlers
window.loadModal = loadModal;
window.preloadModals = preloadModals;

// Loading indicator handlers
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.setLoadingMessage = setLoadingMessage;
window.setLoadingProgress = setLoadingProgress;
window.isLoading = isLoading;
window.withLoading = withLoading;

// Hostel handlers (extracted to handlers/hostel.js)
import './handlers/hostel.js'

// Webhook, push notifications, form persistence handlers (extracted to handlers/miscSettings.js)
import './handlers/miscSettings.js'

// Country bubble + offline download handlers (extracted to handlers/offlineDownload.js)
import './handlers/offlineDownload.js'

// ==================== HOME HANDLERS (extracted to handlers/mapHome.js) ====================
import './handlers/mapHome.js'

// ==================== HANDLERS MANQUANTS (Wolf audit) ====================

// Navigation shortcuts
window.flyToCity = (lat, lng, zoom = 12) => {
  const nLat = Number(lat), nLng = Number(lng)
  if (!isFinite(nLat) || !isFinite(nLng)) return
  if (window.homeMapInstance) window.homeMapInstance.flyTo({ center: [nLng, nLat], zoom })
  else window.navigate?.('map')
}

window.openProfile = () => window.navigate?.('profile')
window.openEditProfile = () => {
  window.navigate?.('profile')
  setState({ profileSubTab: 'profil' })
}

window.planTrip = () => {
  window.navigate?.('challenges')
  setTimeout(() => window.setVoyageSubTab?.('voyage'), 100)
}

window.clearTrip = () => window.clearTripResults?.()

window.openGuides = () => {
  window.navigate?.('challenges')
  setTimeout(() => window.setVoyageSubTab?.('guides'), 100)
}

window.openChallengesHub = () => window.navigate?.('challenges')

// Auth shortcut
window.loginWithEmail = () => window.openAuth?.('email')

// Gamification shortcuts
window.claimDailyReward = () => window.openDailyReward?.()

// SOS shortcuts
window.triggerSOS = async () => window.openSOS?.()
window.shareSOS = () => window.shareSOSLink?.()

// Lazy modal stubs — canonical handlers defined in their respective modules,
// these stubs ensure buttons always work before the module is first loaded.
if (!window.toggleFavorite) {
  window.toggleFavorite = async (spotId) => {
  if (!spotId) return
  try {
    const { isFavorite, addFavorite, removeFavorite } = await import('./services/favorites.js')
    const currently = isFavorite(spotId)
    if (currently) {
      await removeFavorite(spotId)
    } else {
      await addFavorite(spotId)
    }
    // Update heart icon in SpotDetail
    const heartBtn = document.querySelector('[data-favorite-btn]')
    if (heartBtn) {
      const isFav = isFavorite(spotId)
      const svg = heartBtn.querySelector('svg')
      if (svg) svg.setAttribute('fill', isFav ? '#f59e0b' : 'none')
    }
  } catch (e) {
    console.error('toggleFavorite failed:', e)
  }
  }
}
if (!window.openAdminPanel) window.openAdminPanel = () => setState({ showAdminPanel: true })
if (!window.openMyData) window.openMyData = () => setState({ showMyData: true })
// openConsentSettings — canonical in MyData.js, rendered inside that modal
// openTestSpot/openValidateSpot defined in spotActions.js — stubs open AddSpot in validation mode
if (!window.openTestSpot) {
  window.openTestSpot = (id) => setState({ showAddSpot: true, addSpotStep: 1, addSpotValidateId: id })
}
if (!window.openValidateSpot) window.openValidateSpot = window.openTestSpot
if (!window.openSpotDraft) window.openSpotDraft = (id) => setState({ showAddSpot: true, editDraftId: id })
if (!window.openFeedbackDetail) {
  window.openFeedbackDetail = (id) => setState({ showFeedbackPanel: true, feedbackDetailId: id })
}
if (!window.openFeedbackOnFeature) {
  window.openFeedbackOnFeature = (id) => setState({ showFeedbackPanel: true, feedbackFeatureId: id })
}
// Profile view handlers — lazy-loaded with Profile.js
if (!window.openAddPastTrip) window.openAddPastTrip = () => setState({ showAddPastTrip: true })
if (!window.openBlockedUsers) window.openBlockedUsers = () => setState({ showBlockedUsers: true })
if (!window.openComingSoonProximity) window.openComingSoonProximity = () => { /* not yet implemented */ }
if (!window.openReferences) window.openReferences = () => { /* not yet implemented */ }
if (!window.openMySpots) window.openMySpots = () => setState({ profileDetailView: 'spots' })
if (!window.openMyValidations) window.openMyValidations = () => setState({ profileDetailView: 'validations' })
if (!window.openMyCountries) window.openMyCountries = () => setState({ profileDetailView: 'countries' })
if (!window.openProgressionStats) window.openProgressionStats = () => setState({ showBadges: true })
if (!window.openRoadmapFeature) window.openRoadmapFeature = (id) => window.showFeatureIntro?.(id)
// Social view handlers — lazy-loaded with Social.js
if (!window.openFriendChat) window.openFriendChat = (id) => setState({ socialSubTab: 'messagerie', activeDMConversation: id })
if (!window.openWriteReview) window.openWriteReview = (uid) => setState({ showWriteReview: true, reviewTargetUid: uid })
// Map view handlers — lazy-loaded with Map.js
if (!window.openCountryGuide) {
  window.openCountryGuide = (code) => setState({ selectedCountryGuide: code, activeSubTab: 'guides' })
}
// MyData modal handlers — lazy-loaded
if (!window.openConsentSettings) window.openConsentSettings = () => { /* not yet implemented */ }
// Voyage view handlers — lazy-loaded with Voyage.js
if (!window.openTripDetail) window.openTripDetail = (i) => setState({ tripDetailIndex: i })
if (!window.openEditTrip) window.openEditTrip = (i) => setState({ editTripIndex: i })
if (!window.openAddTripNote) window.openAddTripNote = () => setState({ activeTab: 'challenges', voyageSubTab: 'journal' })
if (!window.openTripPhotoUpload) window.openTripPhotoUpload = () => setState({ activeTab: 'challenges', voyageSubTab: 'journal' })

// openLeaderboard/closeLeaderboard registered by Leaderboard.js (static import above)

// Companion shortcuts
window.openCompanion = () => window.showCompanionModal?.()
window.closeCompanion = () => setState({ showCompanionModal: false })

// AddSpot shortcut
window.submitNewSpot = () => window.openAddSpot?.()

// swapTripPoints — canonical in Travel.js (Voyage.js has guarded fallback)
// syncTripFieldsAndCalculate — canonical in Travel.js (Voyage.js has guarded fallback)
// Early stub: prevents ReferenceError if user clicks before Voyage.js/Travel.js load (Sentry issue #41)
if (!window.syncTripFieldsAndCalculate) {
  window.syncTripFieldsAndCalculate = () => {
    /* loading — Travel.js will override this handler */
  }
}

// saveTripWithSpots — canonical in Travel.js
// loadSavedTrip — canonical in Travel.js
// deleteSavedTrip — canonical in Travel.js
// removeSpotFromTrip — canonical in Travel.js

// Feature intro wrappers + Beta guards (extracted to handlers/betaGuards.js)
// MUST remain AFTER all handler definitions
import './handlers/betaGuards.js'

// ==================== START APP ====================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
