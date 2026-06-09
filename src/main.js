/**
 * SpotHitch - Main Entry Point
 * La communauté des autostoppeurs
 */

// Styles
import './styles/main.css';
import { icon } from './utils/icons.js'

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
 import('maplibre-gl').catch(() => {})
 // Preload OpenFreeMap style in parallel (fetch only, browser caches it)
 fetch('https://tiles.openfreemap.org/styles/liberty', { mode: 'cors' }).catch(() => {})
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
// SplashScreen removed — simple logo loader in index.html hides when app is ready

// Data
import { sampleSpots } from './data/spots.js';
// guides.js loaded dynamically to reduce main bundle size

// Utils
import { initSEO, trackPageView } from './utils/seo.js';
import { prefersReducedMotion } from './utils/a11y.js';
import { initPWA, showInstallBanner, dismissInstallBanner, installPWA } from './utils/pwa.js';
import { initNetworkMonitor, cleanupOldData, requireOnline } from './utils/network.js';
import { scheduleRender, shouldRerender, clearRenderCache } from './utils/render.js';
// debounce moved to handlers/filters.js
import { observeAllLazyImages } from './utils/lazyImages.js';
import { initWebVitals } from './utils/webVitals.js';
import { initHoverPrefetch, prefetchNextTab } from './utils/prefetch.js';
import { trackTabChange } from './utils/analytics.js';
import { cleanupDrafts } from './utils/formPersistence.js';
import { initWasm } from './utils/wasmGeo.js';
// escapeHTML/escapeJSString moved to handler files
import { runAllCleanup } from './utils/cleanup.js';
import { initDeepLinkListener, captureShareParams, checkPublicTripRoute } from './utils/deeplink.js';
import { initBackButton, goBack } from './utils/backButton.js';
import { setupGlobalErrorHandlers as setupErrorHandlers } from './utils/errorBoundary.js';
// resetFilters moved to handlers/filters.js
import './components/modals/Leaderboard.js'; // Register global handlers
import './components/modals/FeatureSlides.js'; // Feature Slides (openFeatureSlides, closeFeatureSlides, etc.)
import './components/modals/FeatureIntroModal.js'; // Feature Intro glassmorphism (showFeatureIntro, closeFeatureIntro, etc.)
import { registerCheckinHandlers } from './components/modals/CheckinModal.js'; // Checkin modal handlers
import './services/navigation.js'; // stopNavigation/openExternalNavigation registered by navigation.js itself
import './utils/navigation.js'; // showNavigationPicker/openInNavigationApp/selectNavigationApp/closeNavigationPicker
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
import './handlers/closeModals.js'
import './handlers/filters.js'
import './handlers/sharing.js'
import './handlers/tripPlanner.js'
import {
 restoreGuardianMode,
 onOverdue as onGuardianOverdue,
} from './services/guardian.js'
import {
 showLoading,
 hideLoading,
 setLoadingMessage,
 setLoadingProgress,
 isLoading,
 withLoading,
} from './components/LoadingIndicator.js';

// ==================== STALE CACHE RECOVERY ====================
// If a dynamic import fails (e.g. stale hash after deploy), clear caches silently.
// The next app open will load fresh assets. NEVER reload automatically.
window.addEventListener('error', (e) => {
 const msg = e.message || ''
 if (msg.includes('Failed to fetch dynamically imported module')
 || msg.includes('Importing a module script failed')
 || msg.includes('Loading chunk')
 || msg.includes('Loading CSS chunk')) {
 if (window.__swRecovery) return
 // Clear stale caches so next app open loads fresh assets
 if (window.caches) {
 caches.keys().then(keys =>
 Promise.all(keys.map(k => caches.delete(k)))
 ).catch(() => {})
 }
 }
})

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

 // Logo loader is in index.html — no splash to initialize

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
 _lastTabContentFingerprint = '' // Reset tab fingerprint too
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
 // Draggable feedback button + preload panel module
 try { initDraggableFeedbackBtn() } catch (e) { /* optional */ }
 try { import('./components/modals/FeedbackPanel.js') } catch { /* preload */ }

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
 if (!current.isLoggedIn || current.authLoading) {
 actions.setUser(user)
 setState({ authLoading: false })
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
 friendsModule.updatePresence() // Set lastSeen timestamp for friends to see
 dmModule.subscribeToAllConversations(user.uid)
 gcModule.subscribeToAllGroupConversations(user.uid)
 favsModule.subscribeFavorites(user.uid)
 favsModule.syncLocalFavoritesToFirestore(user.uid)
 // Start watching for friends in Guardian mode
 import('./services/guardianWatch.js').then(gw => {
 gw.startGuardianWatch((timers) => {
 setState({ watchedGuardianTimers: timers })
 scheduleRender(() => window._appInternals.render())
 })
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
 else if (pendingAction === 'guardian') setTimeout(() => window.showGuardianModal?.(), 300)
 else if (pendingAction === 'social') setTimeout(() => setState({ activeTab: 'social' }), 300)
 else if (pendingAction === 'tripPlanner') setTimeout(() => window.openTripPlanner?.(), 300)
 }
 updates.authLoading = false
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
 setState({ currentUser: null, userProfile: null, isAdmin: false, authLoading: false })
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
 else if (pendingAction === 'guardian') setTimeout(() => window.showGuardianModal?.(), 300)
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
 checkPublicTripRoute();
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

 // Splash stays visible until map fires 'load' event (in App.js).
 // Fallback: hide after 8s max if map never loads (offline, error).
 setTimeout(hideLoader, 8000)
 // GPS ready (non-blocking)
 if (savedPos) {
 gpsReadyPromise.then(() => {}).catch(() => {})
 }

 // Register service worker
 registerServiceWorker();

 // Setup keyboard shortcuts
 setupKeyboardShortcuts();



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

 // Initialize push notifications (if previously enabled) and sync state
 try {
 const { initPushNotifications, isPushEnabled } = await import('./services/pushNotifications.js')
 initPushNotifications()
 setState({ pushEnabled: isPushEnabled() })
 } catch (e) {
 console.warn('Push notifications skipped:', e.message)
 }

 // Restore guardian mode if it was active (auto-stops stale trips)
 try {
 const wasActive = restoreGuardianMode()
 if (wasActive) {
 onGuardianOverdue(() => {
 // Only auto-open modal if user hasn't manually closed it
 const s = getState()
 if (!s._guardianDismissed) {
 setState({ showGuardianModal: true })
 }
 })
 }
 } catch (e) {
 console.warn('Guardian mode restore skipped:', e.message)
 }

 // Listen for service worker messages (push notification actions)
 if ('serviceWorker' in navigator) {
 navigator.serviceWorker.addEventListener('message', (event) => {
 if (event.data?.type === 'GUARDIAN_CHECKIN') {
 window.guardianCheckIn?.()
 } else if (event.data?.type === 'GUARDIAN_ALERT') {
 window.guardianSendAlert?.()
 }
 })
 }

 // Register cleanup on page unload (pagehide = iOS fallback, beforeunload unreliable on iOS)
 window.addEventListener('beforeunload', runAllCleanup);
 window.addEventListener('pagehide', runAllCleanup);

 // Auto-update check: reload if a new version is deployed
 startVersionCheck()
 } catch (error) {
 console.error('Init error:', error);
 // Show error to user but still try to render
 const loader = document.getElementById('app-loader');
 if (loader) {
 loader.innerHTML = `
 <div style="text-align:center;padding:20px">
 <div style="color:#ef4444;margin-bottom:16px">${icon ? icon("alert-triangle", "w-12 h-12") : ""}</div>
 <div style="color:#fff;font-size:18px;margin-bottom:8px">${t('loadingError') || 'Erreur de chargement'}</div>
 <div style="color:#94a3b8;font-size:14px" id="init-error-msg"></div>
 <button onclick="location.reload()" class="reload-btn">${t('retry') || 'Réessayer'}</button>
 <style>.reload-btn{margin-top:16px;padding:8px 16px;background:#f59e0b;color:#fff;
 border:none;border-radius:8px;cursor:pointer}</style></div>
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
 * Hide the logo loader
 */
function hideLoader() {
 const loader = document.getElementById('app-loader')
 if (loader) {
 loader.classList.add('hidden')
 setTimeout(() => loader.remove(), 400)
 }
 const app = document.getElementById('app')
 if (app) app.classList.add('loaded')
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
let _lastTabContentFingerprint = ''

// ─── SINGLE SOURCE OF TRUTH: modal-only state keys ───
// Keys listed here ONLY affect modals/overlays (rendered in #app-modals/#app-overlays).
// They do NOT trigger tab content re-render (#panel-*).
// When adding a new modal: add its state key(s) here. That's it.
// Both getModalFingerprint and getTabContentFingerprint use this list automatically.
const MODAL_ONLY_KEYS = new Set([
 // Auth + onboarding
 'showAuth', 'authMode', 'showCompleteProfile',
 'showAgeVerification', 'showIdentityVerification',
 'showLocationPermission', 'showLanding', 'showWelcome',
 // Spot detail
 'selectedSpot', 'showRating', 'currentRating',
 // AddSpot
 'showAddSpot', 'addSpotStep', 'addSpotPreview', 'addSpotType', 'addSpotValidateId',
 'spotDraftsBannerVisible',
 // Core modals
 'showSOS', 'sosSession',
 'showGuardianModal',
 'showFilters', 'showStats', 'showBadges',
 'showChallenges', 'showTeamChallenges', 'showCreateTeam',
 'showShop', 'showMyRewards', 'showQuiz',
 'showLeaderboard', 'showTitles',
 // Gamification modals
 'checkinSpot', 'showDailyReward',
 'showBadgePopup', 'showBadgeDetail', 'selectedBadgeId',
 // Navigation + offline modals
 'navigationActive', 'showOfflinePanel',
 'showSafety', 'routeAmenities', 'showTripHistory',
 // Donation + ambassador
 'showDonation', 'showDonationThankYou',
 'showAmbassadorSuccess', 'showContactAmbassador', 'selectedAmbassador',
 // Social modals
 'showProfileCustomization', 'showNearbyFriends', 'nearbyFriendsEnabled',
 'showFriendProfile', 'showAddFriend',
 'showBlockModal', 'showUnblockModal', 'showBlockedUsers',
 // Reports + feedback
 'showReport', 'selectedReportReason',
 'showFeedbackPanel', 'showFeatureSlides', 'showFeatureIntro',
 // Settings + admin + misc modals
 'showMyData', 'showAdminPanel', 'showDeleteAccount',
 'showContactForm', 'showFAQ', 'showLegal',
 'showLanguageSelector', 'showInstallBanner', 'showAccessibilityHelp',
 // Spot interaction modals
 'proximityAlertSpot', 'selectedCity', 'pendingGuideCountry',
])

// Tab content fingerprint: includes ALL state keys EXCEPT MODAL_ONLY_KEYS.
// Any state change that isn't a modal triggers a tab re-render.
// New state keys are automatically included — zero maintenance.
function getTabContentFingerprint(state) {
 let fp = ''
 for (const key in state) {
 if (MODAL_ONLY_KEYS.has(key)) continue
 const v = state[key]
 if (v === null || v === undefined) { fp += '0|'; continue }
 const t = typeof v
 if (t === 'boolean') { fp += v ? '1|' : '2|'; continue }
 if (t === 'string') { fp += v + '|'; continue }
 if (t === 'number') { fp += v + '|'; continue }
 if (t === 'object') { fp += 'o|'; continue }
 }
 return fp
}

// Modal fingerprint: built automatically from MODAL_ONLY_KEYS.
// No manual list to maintain — uses the same source of truth.
function getModalFingerprint(state) {
 let fp = ''
 for (const key of MODAL_ONLY_KEYS) {
 const v = state[key]
 if (v === null || v === undefined) { fp += '0|'; continue }
 const t = typeof v
 if (t === 'boolean') { fp += v ? '1|' : '2|'; continue }
 if (t === 'string') { fp += v + '|'; continue }
 if (t === 'number') { fp += v + '|'; continue }
 // For objects (selectedSpot, etc.), track presence not content
 if (t === 'object') { fp += 'obj|'; continue }
 }
 return fp
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
 const isVoyageMapFirst = state.activeTab === 'voyage' && state.tripResults && state.tripFormCollapsed
 const tabFp = getTabContentFingerprint(state)
 const tabContentChanged = tabChanged || tabFp !== _lastTabContentFingerprint

 // 1. Update header (only when tab or tab-content changed, not on modal open)
 const headerEl = document.getElementById('app-header')
 if (headerEl && tabContentChanged) {
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
 const allPanels = ['map', 'voyage', 'social', 'profile', 'spots']
 for (const panelId of allPanels) {
 const panel = document.getElementById(`panel-${panelId}`)
 if (!panel) continue
 const isActive = panelId === activePanel
 panel.style.display = isActive ? '' : 'none'
 }

 // 4. Render the active tab content
 // Only re-render when tab-relevant state changed (NOT when a modal opens/closes)
 if (activePanel !== 'map' && tabContentChanged) {
 _lastTabContentFingerprint = tabFp
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
 // Preserve feedback panel across re-renders (slide animation + scroll)
 const feedbackPanel = document.querySelector('.slide-panel-in')
 const savedFeedback = (feedbackPanel && state.showFeedbackPanel) ? feedbackPanel.parentElement : null

 modalsEl.innerHTML = renderModals(state)

 if (savedMisplacedMap) {
 const slot = document.getElementById('report-misplaced-wrapper')
 if (slot) slot.replaceWith(savedMisplacedMap)
 }
 if (savedFeedback && state.showFeedbackPanel) {
 const newFb = modalsEl.querySelector('.slide-panel-in')?.parentElement
 if (newFb) newFb.replaceWith(savedFeedback)
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
 // New version activates on next app open — no reload during use
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
 showGuardianModal: false,
 showFeedbackPanel: false,
 feedbackDetailFeature: null,
 selectedSpot: null,
 });
 }

 // Ctrl+K or / for search
 if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
 e.preventDefault()
 const searchInput = document.querySelector('#search-input')
 if (searchInput) searchInput.focus()
 }
 if (e.key === '/' && !e.ctrlKey && !e.metaKey && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
 e.preventDefault()
 const searchInput = document.querySelector('#search-input')
 if (searchInput) searchInput.focus()
 }

 // Number keys 1-4 for tab switching (desktop only, not in inputs)
 if (['1','2','3','4'].includes(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
 const tabs = ['map', 'voyage', 'social', 'profile']
 const tab = tabs[parseInt(e.key) - 1]
 if (tab) window.changeTab?.(tab)
 }
 })
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
 // Auth gate: all tabs except map require login
 if (tab !== 'home' && tab !== 'map' && !getState().isLoggedIn) {
 window.requireAuth?.('tab_' + tab)
 return
 }
 // Cleanup map listeners when leaving map tab
 if (tab !== 'map' && window._cleanupMapListeners) {
 window._cleanupMapListeners()
 }
 // Close panels that shouldn't persist across tabs
 const { showOfflinePanel } = getState()
 if (showOfflinePanel) setState({ showOfflinePanel: false })
 actions.changeTab(tab);
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
 setState({ theme: newTheme, themeMode: newTheme })
 document.body.classList.toggle('light-theme', newTheme === 'light')
 // Persist immediately (don't wait for microtask debounce) so reload preserves theme
 try { localStorage.setItem('spothitch_theme_override', newTheme) } catch { /* no-op */ }
}
window.setThemeMode = (mode) => {
 let effectiveTheme = mode
 if (mode === 'auto') {
  effectiveTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
 }
 setState({ theme: effectiveTheme, themeMode: mode })
 document.body.classList.toggle('light-theme', effectiveTheme === 'light')
 try { localStorage.setItem('spothitch_theme_override', mode === 'auto' ? 'auto' : effectiveTheme) } catch { /* no-op */ }
}
window.toggleAccessibility = (setting) => {
 const s = getState()
 const newVal = !s[setting]
 setState({ [setting]: newVal })
 // Map camelCase state keys to snake_case localStorage keys (matching storageRegistry)
 const keyMap = { bigText: 'spothitch_big_text', reducedMotion: 'spothitch_reduced_motion', highContrast: 'spothitch_high_contrast' }
 try { localStorage.setItem(keyMap[setting] || ('spothitch_' + setting), newVal ? '1' : '0') } catch { /* no-op */ }
 // Apply CSS classes
 if (setting === 'bigText') document.body.classList.toggle('big-text', newVal)
 if (setting === 'reducedMotion') document.body.classList.toggle('reduce-motion', newVal)
 if (setting === 'highContrast') document.body.classList.toggle('high-contrast', newVal)
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

// Filter handlers → handlers/filters.js

// Gamification handlers (extracted to handlers/gamification.js)
import './handlers/gamification.js'
import './handlers/tripJournal.js'

// UI toggles — close handlers moved to handlers/closeModals.js
// toggleGasStations is registered by gasStations.js (import at top)
window.sendAmbassadorMessage = () => {
 const msg = document.getElementById('ambassador-message')?.value?.trim()
 if (!msg) return
 window.showToast?.(t('ambassadorMessageSent') || 'Message envoyé !', 'success')
 setState({ showContactAmbassador: false, selectedAmbassador: null })
}

// Trip planner handlers → handlers/tripPlanner.js
window.openGuidesOverlay = () => setState({ activeTab: 'voyage', voyageSubTab: 'guides' })

// Guides handlers (guides is a sub-tab of Voyage/challenges — ERR-020)
window.showGuides = () => setState({ activeTab: 'voyage', voyageSubTab: 'guides', selectedCountryCode: null, showSafety: false });
window.showCountryDetail = (code) => setState({ selectedCountryCode: code });
window.showSafetyPage = () => setState({ showSafety: true });
window.reportGuideError = async (countryCode) => {
 const { getGuideByCode } = await import('./data/guides.js');
 const { showInputOverlay } = await import('./utils/inputOverlay.js');
 const guide = getGuideByCode(countryCode);
 const name = guide?.name || countryCode;
 const errorType = await showInputOverlay({
 title: t('guideErrorReport') || `Quelle information est incorrecte dans le guide ${name} ?`,
 placeholder: t('guideErrorPlaceholder') || 'Decris le probleme...',
 multiline: true,
 maxLength: 500,
 });
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

// Sharing handlers → handlers/sharing.js
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

// Side menu handlers (no render function yet — stub with toast)
window.openSideMenu = () => {
 /* not yet implemented */
};

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

// Resume radar listener if it was enabled (page reload)
import('./services/proximityRadar.js').then(m => m.resumeRadarIfEnabled?.()).catch(() => {})

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

// Guardian Mode handlers (extracted to handlers/guardian.js)
import './handlers/guardian.js'

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
 window.navigate?.('voyage')
 setTimeout(() => window.setVoyageSubTab?.('voyage'), 100)
}

window.clearTrip = () => window.clearTripResults?.()

window.openGuides = () => {
 window.navigate?.('voyage')
 setTimeout(() => window.setVoyageSubTab?.('guides'), 100)
}

window.openChallengesHub = () => window.navigate?.('voyage')

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
if (!window.closeAdminPanel) window.closeAdminPanel = () => setState({ showAdminPanel: false })
if (!window.setAdminTab) window.setAdminTab = (tab) => setState({ adminActiveTab: tab })
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
if (!window.setFeedbackTab) {
 window.setFeedbackTab = async (tab) => {
 await import('./components/modals/FeedbackPanel.js')
 window.setFeedbackTab(tab)
 }
}
if (!window.closeFeedbackDetail) {
 window.closeFeedbackDetail = () => setState({ feedbackDetailFeature: null })
}
if (!window.submitFeedback) {
 window.submitFeedback = async (id) => {
 await import('./components/modals/FeedbackPanel.js')
 window.submitFeedback(id)
 }
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
if (!window.closeMyData) window.closeMyData = () => setState({ showMyData: false })
if (!window.downloadMyData) window.downloadMyData = () => {}
// Ambassador handlers — lazy-loaded with ambassadors.js (via Friends.js)
if (!window.registerAmbassador) window.registerAmbassador = () => {}
if (!window.searchAmbassadors) window.searchAmbassadors = () => {}
if (!window.contactAmbassador) window.contactAmbassador = () => {}
if (!window.unregisterAmbassador) window.unregisterAmbassador = () => {}
if (!window.updateAmbassadorAvailability) window.updateAmbassadorAvailability = () => {}
if (!window.searchAmbassadorsByCity) window.searchAmbassadorsByCity = () => {}
// Identity verification handlers — lazy-loaded with IdentityVerification.js
if (!window.closeIdentityVerification) window.closeIdentityVerification = () => {}
if (!window.startVerificationStep) window.startVerificationStep = () => {}
// FAQ handlers — lazy-loaded with FAQ.js
if (!window.toggleFAQItem) window.toggleFAQItem = () => {}
if (!window.scrollToFAQCategory) window.scrollToFAQCategory = () => {}
if (!window.filterFAQ) window.filterFAQ = () => {}
if (!window.clearFAQSearch) window.clearFAQSearch = () => {}
if (!window.searchFAQ) window.searchFAQ = () => {}
if (!window.getFAQQuestionById) window.getFAQQuestionById = () => {}
// Profile view — sortMySpots is inside a render function, add stub
if (!window.sortMySpots) window.sortMySpots = (mode) => setState({ _mySpotsSort: mode })
// Friend profile / blocking handlers — lazy-loaded with FriendProfile.js / userBlocking.js
if (!window.closeFriendProfile) window.closeFriendProfile = () => setState({ showFriendProfile: false })
if (!window.openBlockModal) window.openBlockModal = () => {}
if (!window.closeBlockModal) window.closeBlockModal = () => {}
if (!window.confirmBlockUser) window.confirmBlockUser = () => {}
if (!window.openUnblockModal) window.openUnblockModal = () => {}
if (!window.closeUnblockModal) window.closeUnblockModal = () => {}
if (!window.confirmUnblockUser) window.confirmUnblockUser = () => {}
if (!window.unblockUserById) window.unblockUserById = () => {}
// Guide nudge handlers — lazy-loaded with GuideNudge.js
if (!window.closeGuideNudge) window.closeGuideNudge = () => setState({ showGuideNudge: false })
if (!window.acceptGuideNudge) window.acceptGuideNudge = () => {}
if (!window.dismissGuideNudgeForCountry) window.dismissGuideNudgeForCountry = () => {}
if (!window.dismissGuideNudgeGlobal) window.dismissGuideNudgeGlobal = () => {}
// Spot verification handler — lazy-loaded with verification.js via Spots.js
if (!window.voteSpot) window.voteSpot = () => {}
// Alpha code validation — lazy-loaded with Landing.js
if (!window.validateAlphaCode) window.validateAlphaCode = () => {}
// Voyage view handlers — lazy-loaded with Voyage.js
if (!window.openTripDetail) window.openTripDetail = (i) => setState({ tripDetailIndex: i })
if (!window.openEditTrip) window.openEditTrip = (i) => setState({ editTripIndex: i })
if (!window.openAddTripNote) window.openAddTripNote = () => setState({ activeTab: 'voyage', voyageSubTab: 'journal' })
if (!window.openTripPhotoUpload) window.openTripPhotoUpload = () => setState({ activeTab: 'voyage', voyageSubTab: 'journal' })

// openLeaderboard/closeLeaderboard registered by Leaderboard.js (static import above)

// Guardian shortcuts
window.openGuardian = () => window.showGuardianModal?.()
window.closeGuardian = () => setState({ showGuardianModal: false })

// SOS lazy-loaded handlers stubs — real handlers in SOS.js and sosTracking.js (override these)
if (!window.callEmergency) window.callEmergency = () => {}
if (!window.sosToggleSilent) window.sosToggleSilent = () => {}
if (!window.sosOpenFakeCall) window.sosOpenFakeCall = () => {}
if (!window.sosFakeCallAnswer) window.sosFakeCallAnswer = () => {}
// Guardian lazy-loaded handler stub — real handler in Guardian.js (overrides this)
if (!window.guardianSendMessage) window.guardianSendMessage = () => {}
// Community alerts handlers — lazy-loaded with SOS.js (override these)
if (!window.toggleCommunityAlerts) window.toggleCommunityAlerts = () => {}
if (!window.setCommunityRadius) window.setCommunityRadius = () => {}
if (!window.setCommunityGenderFilter) window.setCommunityGenderFilter = () => {}
// Social interaction handlers — lazy-loaded with Social.js / directMessages.js
if (!window.sendFriendRequest) window.sendFriendRequest = () => {}
if (!window.sendDM) window.sendDM = () => {}
// Profile sub-tab — lazy-loaded with Profile.js (overrides this)
if (!window.setProfileSubTab) window.setProfileSubTab = (tab) => setState({ profileSubTab: tab })
// Delete account close — lazy-loaded with DeleteAccount.js
if (!window.closeDeleteAccount) window.closeDeleteAccount = () => setState({ showDeleteAccount: false })
// Cookie customize close — lazy-loaded with CookieBanner.js
if (!window.hideCookieCustomize) window.hideCookieCustomize = () => setState({ showCookieCustomize: false })
// Trust score handlers — lazy-loaded with trustScore.js
if (!window.getUserTrustScore) window.getUserTrustScore = () => {}
if (!window.showTrustDetails) window.showTrustDetails = () => {}

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

// Trip planner handlers — canonical in Travel.js (lazy), Voyage.js has partial stubs
if (!window.calculateTrip) window.calculateTrip = async () => {}
if (!window.clearTripResults) window.clearTripResults = () => {}
if (!window.saveTripWithSpots) window.saveTripWithSpots = () => {}
if (!window.loadSavedTrip) window.loadSavedTrip = () => {}
if (!window.deleteSavedTrip) window.deleteSavedTrip = () => {}
if (!window.renameSavedTrip) window.renameSavedTrip = () => {}
if (!window.viewTripOnMap) window.viewTripOnMap = () => {}
if (!window.closeTripMap) window.closeTripMap = () => {}
// removeSpotFromTrip — canonical in Travel.js
// Voyage sub-tab handler — lazy-loaded with Voyage.js (overrides this)
if (!window.setVoyageSubTab) window.setVoyageSubTab = (tab) => setState({ voyageSubTab: tab })
// Social conversation handlers — lazy-loaded with directMessages.js / Conversations.js
if (!window.openConversation) window.openConversation = () => {}
if (!window.closeConversation) window.closeConversation = () => {}
if (!window.shareDMSpot) window.shareDMSpot = () => {}
if (!window.shareDMPosition) window.shareDMPosition = () => {}
if (!window.openCreateGroupConversation) window.openCreateGroupConversation = () => {}
if (!window.createGroupConversation) window.createGroupConversation = () => {}
if (!window.sendGroupConversationMessage) window.sendGroupConversationMessage = () => {}
// Event handlers — lazy-loaded with events.js
if (!window.joinEvent) window.joinEvent = () => {}
if (!window.leaveEvent) window.leaveEvent = () => {}
if (!window.postEventComment) window.postEventComment = () => {}
if (!window.reactToEventComment) window.reactToEventComment = () => {}
// Buddy announcement handlers — lazy-loaded with Voyageurs.js
if (!window.submitBuddyAnnouncement) window.submitBuddyAnnouncement = () => {}
if (!window.deleteBuddyAnnouncement) window.deleteBuddyAnnouncement = () => {}

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
