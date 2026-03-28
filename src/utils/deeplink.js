/**
 * Deep Linking Utility
 * Handles URL parameters and navigation state
 */

import { setState, getState } from '../stores/state.js';
import { extractCoordsFromShare, resolveShortMapUrl, detectOpaqueMapUrl } from './mapsUrlParser.js';

// Base path for the app (e.g., '/' for deployed app)
const BASE_PATH = import.meta.env.BASE_URL || '/';

// Route mappings
const ROUTES = {
  map: { tab: 'map' },
  spots: { tab: 'spots' },
  travel: { tab: 'challenges' },
  planner: { tab: 'challenges', subTab: 'planner' },
  guides: { tab: 'challenges', subTab: 'guides' },
  challenges: { tab: 'challenges' },
  social: { tab: 'social' },
  chat: { tab: 'social', subTab: 'general' },
  friends: { tab: 'social', subTab: 'friends' },
  profile: { tab: 'profile' },
};

// Debug log for share flow — stored in localStorage so user can check on device
function shareLog(step, detail) {
  console.log(`[Share] ${step}:`, detail || '')
  try {
    const log = JSON.parse(localStorage.getItem('spothitch_share_debug') || '[]')
    log.push({ t: Date.now(), step, detail: String(detail || '').slice(0, 200) })
    // Keep only last 20 entries
    if (log.length > 20) log.splice(0, log.length - 20)
    localStorage.setItem('spothitch_share_debug', JSON.stringify(log))
  } catch { /* no-op */ }
}

// Track which exact share has been processed (per-URL guard)
let _lastProcessedShareId = ''

/**
 * Save share params to sessionStorage immediately on page load.
 * Called from main.js BEFORE any async work, so the data is preserved
 * even if the URL changes or the page reloads.
 */
export function captureShareParams() {
  const search = window.location.search
  // Detect share: either explicit action=share OR title/text/url params from share_target
  const params = new URLSearchParams(search)
  const hasShareAction = search.includes('action=share')
  const hasShareParams = params.get('title') || params.get('text') || params.get('url')
  if (!hasShareAction && !hasShareParams) return false
  try {
    const params = new URLSearchParams(search)
    const data = {
      url: params.get('url') || '',
      text: params.get('text') || '',
      title: params.get('title') || '',
      ts: Date.now(),
      search,
    }
    sessionStorage.setItem('spothitch_pending_share', JSON.stringify(data))
    shareLog('captured', search.slice(0, 150))
  } catch { /* no-op */ }
  return true
}

/**
 * Get share params from URL or sessionStorage fallback.
 * Returns null if no share is pending.
 */
function getShareParams() {
  // Source 1: Current URL — detect via action=share OR any share-like params
  const search = window.location.search
  const params = new URLSearchParams(search)
  const hasShareAction = search.includes('action=share')
  const hasShareParams = params.get('title') || params.get('text') || params.get('url')
  if (hasShareAction || hasShareParams) {
    return {
      url: params.get('url') || '',
      text: params.get('text') || '',
      title: params.get('title') || '',
      source: 'url',
      id: search,
    }
  }

  // Source 2: sessionStorage (saved earlier by captureShareParams or by SW message)
  try {
    const stored = sessionStorage.getItem('spothitch_pending_share')
    if (stored) {
      const data = JSON.parse(stored)
      // Only use if less than 60 seconds old
      if (data.ts && Date.now() - data.ts < 60000) {
        return {
          url: data.url || '',
          text: data.text || '',
          title: data.title || '',
          source: 'sessionStorage',
          id: data.search || `ss-${data.ts}`,
        }
      }
    }
  } catch { /* no-op */ }

  return null
}

/**
 * Process a share from Google Maps (or other maps app).
 * Can be called from multiple entry points: initial load, focus, pageshow, launchQueue.
 * Idempotent: won't process the same share twice.
 */
async function processShare() {
  const share = getShareParams()
  if (!share) {
    shareLog('no-params', `url=${window.location.search.slice(0, 80)}`)
    return
  }

  // Per-share guard: don't process the same share twice
  if (_lastProcessedShareId === share.id) {
    shareLog('already-processed', share.id.slice(0, 80))
    return
  }
  _lastProcessedShareId = share.id
  // Block auto-reload during entire share processing (prevents freeze/reload during spot creation)
  window._shareInProgress = true
  shareLog('processing', `source=${share.source} url=${share.url.slice(0, 60)} text=${share.text.slice(0, 60)} title=${share.title}`)

  // Preload AddSpot module into lazy cache so the first render is instant
  // (prevents the "empty → form appears" flash from lazy loading)
  import('../components/App.js').then(({ preloadLazyModule }) => {
    preloadLazyModule('renderAddSpot')
  }).catch(() => {})

  // Clear sessionStorage so this share isn't re-processed on next focus
  try { sessionStorage.removeItem('spothitch_pending_share') } catch { /* no-op */ }

  // Clean share params from URL so focus/visibility events don't re-trigger
  try {
    const cleanUrl = window.location.pathname
    window.history.replaceState({}, '', cleanUrl)
  } catch { /* no-op */ }

  // Dismiss ALL blocking popups immediately
  setState({ showLanding: false, showWelcome: false })
  try { localStorage.setItem('spothitch_landing_v2', '1') } catch { /* no-op */ }
  try { localStorage.setItem('spothitch_beta_seen', '1') } catch { /* no-op */ }
  try { localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({ preferences: { necessary: true, analytics: false, marketing: false, personalization: false }, timestamp: Date.now(), version: '1.0' })) } catch { /* no-op */ }
  // Remove blocking overlays from DOM (now + observe for late renders)
  const removeBlockers = () => {
    document.getElementById('alpha-welcome-overlay')?.remove()
    document.getElementById('cookie-banner')?.remove()
  }
  removeBlockers()
  // Some popups render later — watch DOM for 10s to catch them
  try {
    const obs = new MutationObserver(() => removeBlockers())
    obs.observe(document.body || document.documentElement, { childList: true, subtree: true })
    setTimeout(() => obs.disconnect(), 10000)
  } catch { /* no-op */ }

  // Share processing happens silently — no toast needed here

  const { url, text, title } = share

  // Store shared text for place name fallback
  if (title || text) {
    window._pendingShareText = title || text.split('\n')[0] || ''
  }

  // Resolve coordinates — try multiple strategies
  let coords = null
  try {
    // Strategy 1: Extract coords directly from URL or text
    coords = extractCoordsFromShare(url, text)
    if (coords) shareLog('strategy1-ok', `${coords.lat},${coords.lng}`)

    // Strategy 2a: Resolve shortened Google Maps URLs (maps.app.goo.gl / goo.gl)
    if (!coords) {
      const allText = `${url} ${text}`
      const shortRe = /https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps|g\.co\/maps|goo\.gle\/maps)\/\S+/
      const shortUrl = allText.match(shortRe)?.[0]
      if (shortUrl) {
        shareLog('strategy2a-try', shortUrl)
        coords = await resolveShortMapUrl(shortUrl)
        if (coords) shareLog('strategy2a-ok', `${coords.lat},${coords.lng}`)
        else shareLog('strategy2a-fail')
      }
    }

    // Strategy 2b: Resolve opaque Google Maps URLs (?cid=, ?ftid=, ?place_id=, /place/ without @)
    if (!coords) {
      const opaqueUrl = detectOpaqueMapUrl(url) || (text ? (() => {
        const urls = text.match(/https?:\/\/[^\s]+/gi) || []
        for (const u of urls) { const r = detectOpaqueMapUrl(u); if (r) return r }
        return null
      })() : null)
      if (opaqueUrl) {
        shareLog('strategy2b-try', opaqueUrl)
        coords = await resolveShortMapUrl(opaqueUrl)
        if (coords) shareLog('strategy2b-ok', `${coords.lat},${coords.lng}`)
        else shareLog('strategy2b-fail')
      }
    }

    // Strategy 3: REMOVED — geocoding place names gives approximate positions
    // (city center instead of exact pin). Only exact coordinates from the URL matter.
    // If no coords found, AddSpot opens without position and user places pin manually.
  } catch (e) {
    shareLog('coord-error', e.message)
  }

  if (coords) {
    window._pendingShareCoords = coords
    shareLog('coords-ready', `${coords.lat},${coords.lng}`)
  } else {
    shareLog('no-coords', 'will open AddSpot without position')
    // Warn user they need to place the pin manually
    window._pendingShareNoCoords = true
  }

  // Wait for app to be fully initialized before opening AddSpot
  const waitForApp = () => new Promise((resolve) => {
    if (window.openAddSpot) return resolve()
    let attempts = 0
    const check = setInterval(() => {
      attempts++
      if (window.openAddSpot || attempts > 150) {
        clearInterval(check)
        resolve()
      }
    }, 100)
  })

  try {
    await waitForApp()
    shareLog('opening-addspot', window.openAddSpot ? 'via-handler' : 'via-setState')
    if (window.openAddSpot) {
      window.openAddSpot()
    } else {
      setState({ showAddSpot: true, addSpotPreview: false, addSpotStep: 1 })
    }
    shareLog('done', 'AddSpot opened')
    // Keep share guard active for 60s to protect form filling from reload
    // The sessionStorage flag (spothitch_share_flow) provides a 120s window
    setTimeout(() => {
      window._shareInProgress = false
      try { sessionStorage.removeItem('spothitch_share_flow') } catch { /* no-op */ }
    }, 60000)
  } catch (e) {
    shareLog('open-error', e.message)
    window._shareInProgress = false
    try {
      if (window.openAddSpot) {
        window.openAddSpot()
      } else {
        setState({ showAddSpot: true, addSpotPreview: false, addSpotStep: 1 })
      }
      // Keep share guard active for 60s even on fallback path
      window._shareInProgress = true
      setTimeout(() => {
        window._shareInProgress = false
        try { sessionStorage.removeItem('spothitch_share_flow') } catch { /* no-op */ }
      }, 60000)
    } catch {
      window._shareInProgress = false
    }
  }
}

// Expose globally so it can be called from main.js or console for debugging
window.processShare = processShare

// Action mappings
const ACTIONS = {
  'add-spot': () => setState({ showAddSpot: true }),
  'login': () => setState({ showAuth: true }),
  'register': () => { setState({ showAuth: true }); window.setAuthMode?.('register'); },
  'sos': () => setState({ showSOS: true }),
  'quiz': () => setState({ showQuiz: true }),
  'shop': () => setState({ showShop: true }),
  'badges': () => setState({ showBadges: true }),
  'challenges': () => setState({ showChallenges: true }),
  'settings': () => setState({ activeTab: 'profile' }),
  'filters': () => setState({ showFilters: true }),
  'share': () => processShare(),
};

/**
 * Parse URL parameters
 * @returns {URLSearchParams} Parsed parameters
 */
export function getUrlParams() {
  return new URLSearchParams(window.location.search);
}

/**
 * Handle deep link on app load
 */
export function handleDeepLink() {
  const params = getUrlParams();

  // Handle tab/route
  const route = params.get('route') || params.get('tab');
  if (route && ROUTES[route]) {
    const { tab, subTab } = ROUTES[route];
    const updates = { activeTab: tab };
    if (subTab) updates.activeSubTab = subTab;
    setState(updates);
  }

  // Handle action (validated against known whitelist)
  const action = params.get('action');

  // Detect share even without action=share: if title/text/url params are present
  const hasShareParams = !action && (params.get('title') || params.get('text') || params.get('url'))
  const effectiveAction = action || (hasShareParams ? 'share' : null)

  // Early share detection: immediately dismiss ALL blocking popups so share can take priority
  if (effectiveAction === 'share') {
    setState({ showLanding: false, showWelcome: false })
    try { localStorage.setItem('spothitch_landing_v2', '1') } catch { /* no-op */ }
    try { localStorage.setItem('spothitch_beta_seen', '1') } catch { /* no-op */ }
    try { localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({ preferences: { necessary: true, analytics: false, marketing: false, personalization: false }, timestamp: Date.now(), version: '1.0' })) } catch { /* no-op */ }
    try { document.getElementById('alpha-welcome-overlay')?.remove() } catch { /* no-op */ }
    try { document.getElementById('cookie-banner')?.remove() } catch { /* no-op */ }
  }

  if (effectiveAction && Object.prototype.hasOwnProperty.call(ACTIONS, effectiveAction)) {
    const handler = ACTIONS[effectiveAction];
    setTimeout(() => {
      try {
        const result = handler()
        // Catch async handler rejections
        if (result && typeof result.catch === 'function') {
          result.catch(e => console.error('[DeepLink] Action handler failed:', e))
        }
      } catch (e) {
        console.error('[DeepLink] Action handler failed:', e)
      }
    }, 100);
  }

  // Handle spot ID
  const spotId = params.get('spot');
  if (spotId) {
    const state = getState();
    const spot = state.spots?.find(s => s.id === parseInt(spotId) || s.id === spotId);
    if (spot) {
      setState({ selectedSpot: spot, activeTab: 'spots' });
    }
  }

  // Handle country guide
  const guide = params.get('guide');
  if (guide) {
    setState({
      activeTab: 'challenges',
      voyageSubTab: 'guides',
      selectedCountryGuide: guide.toUpperCase(),
    });
  }

  // Handle user profile link (?u=uid)
  const userUid = params.get('u');
  if (userUid) {
    setTimeout(() => {
      setState({ activeTab: 'social' });
      window.showFriendProfile?.(userUid);
    }, 300);
  }

  // Handle search query
  const search = params.get('search') || params.get('q');
  if (search) {
    setState({ searchQuery: search });
    // Trigger search
    setTimeout(() => window.searchLocation?.(search), 200);
  }
}

/**
 * Update URL with current state (for sharing)
 * @param {Object} options - Options to encode in URL
 */
export function updateUrl(options = {}) {
  const params = new URLSearchParams();

  if (options.tab) params.set('tab', options.tab);
  if (options.action) params.set('action', options.action);
  if (options.spot) params.set('spot', options.spot);
  if (options.guide) params.set('guide', options.guide);
  if (options.search) params.set('q', options.search);

  const queryString = params.toString();
  const newUrl = queryString
    ? `${BASE_PATH}?${queryString}`
    : BASE_PATH;

  window.history.replaceState({}, '', newUrl);
}

/**
 * Generate shareable URL for current state
 * @param {Object} options - State to encode
 * @returns {string} Shareable URL
 */
export function generateShareUrl(options = {}) {
  const baseUrl = `${window.location.origin}${BASE_PATH}`;
  const params = new URLSearchParams();

  if (options.tab) params.set('tab', options.tab);
  if (options.spotId) params.set('spot', options.spotId);
  if (options.guide) params.set('guide', options.guide);

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Clear URL parameters
 */
export function clearUrlParams() {
  window.history.replaceState({}, '', BASE_PATH);
}

/**
 * Share current page/spot
 * @param {Object} options - Share options
 */
export async function shareLink(options = {}) {
  const url = generateShareUrl(options);
  const title = options.title || 'SpotHitch';
  const text = options.text || 'Découvre SpotHitch !';

  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return { success: true };
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error('Share failed:', e);
      }
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(url);
    return { success: true, copied: true };
  } catch (e) {
    console.error('Copy failed:', e);
    return { success: false };
  }
}

/**
 * Listen for deep link triggers:
 * - popstate: back/forward navigation
 * - pageshow: PWA launched via share target
 * - visibilitychange: app brought to foreground with new URL
 * - LaunchParams: modern PWA launch queue API
 * - focus: PWA window receives focus
 */
export function initDeepLinkListener() {
  window.addEventListener('popstate', () => {
    handleDeepLink();
  });

  // Check for share target on every focus/visibility change.
  // processShare() checks both URL and sessionStorage, so it works
  // even if the URL wasn't updated.
  const checkForShare = () => {
    // Don't re-trigger if AddSpot is already open
    if (window.getState?.()?.showAddSpot) return

    const search = window.location.search
    const params = new URLSearchParams(search)
    // Check URL: action=share OR title/text/url params from share_target
    if (search.includes('action=share') || params.get('title') || params.get('text') || params.get('url')) {
      processShare()
      return
    }
    // Also check sessionStorage (share params may have been saved earlier)
    try {
      if (sessionStorage.getItem('spothitch_pending_share')) {
        processShare()
      }
    } catch { /* no-op */ }
  }

  // Also check with a short delay (some browsers update URL asynchronously)
  const checkForShareDelayed = () => {
    checkForShare()
    setTimeout(checkForShare, 500)
  }

  // pageshow fires when the page is shown (including BFCache restore)
  window.addEventListener('pageshow', checkForShareDelayed);

  // visibilitychange fires when the app comes to foreground
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkForShareDelayed();
    }
  });

  // focus fires when the PWA window receives focus
  window.addEventListener('focus', checkForShareDelayed);

  // Modern Launch Queue API (Chrome 110+): handles PWA launch with URL
  if ('launchQueue' in window) {
    window.launchQueue.setConsumer((launchParams) => {
      if (launchParams.targetURL) {
        shareLog('launchQueue', launchParams.targetURL)
        const parsed = new URL(launchParams.targetURL)
        const lqParams = new URLSearchParams(parsed.search)
        const isShare = launchParams.targetURL.includes('action=share') || lqParams.get('title') || lqParams.get('text') || lqParams.get('url')
        if (isShare) {
          // Save share params to sessionStorage and update URL
          try {
            const data = {
              url: lqParams.get('url') || '',
              text: lqParams.get('text') || '',
              title: lqParams.get('title') || '',
              ts: Date.now(),
              search: parsed.search,
            }
            sessionStorage.setItem('spothitch_pending_share', JSON.stringify(data))
          } catch { /* no-op */ }

          if (window.location.search !== parsed.search) {
            window.history.replaceState({}, '', launchParams.targetURL)
          }
          // Reset guard so this new share gets processed
          _lastProcessedShareId = ''
          processShare()
        }
      }
    });
  }

  // Handle initial load
  handleDeepLink();
}

// Register global handlers
window.shareLink = shareLink;
window.generateShareUrl = generateShareUrl;

export default {
  handleDeepLink,
  updateUrl,
  generateShareUrl,
  clearUrlParams,
  shareLink,
  initDeepLinkListener,
  getUrlParams,
  captureShareParams,
};
