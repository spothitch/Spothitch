/**
 * Deep Linking Utility
 * Handles URL parameters and navigation state
 */

import { setState, getState } from '../stores/state.js';
import { showToast } from '../services/notifications.js';

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

// Track which exact share URL has been processed (not a boolean — per-URL guard)
let _lastProcessedShareUrl = ''

/**
 * Process a share from Google Maps (or other maps app).
 * Can be called from multiple entry points: initial load, focus, pageshow, launchQueue.
 * Idempotent: won't process the same URL twice.
 */
async function processShare() {
  const currentSearch = window.location.search
  if (!currentSearch.includes('action=share')) return

  // Per-URL guard: don't process the same share URL twice
  if (_lastProcessedShareUrl === currentSearch) {
    console.log('[Share] Already processed this URL, skipping')
    return
  }
  _lastProcessedShareUrl = currentSearch
  console.log('[Share] Processing share:', currentSearch)

  // Dismiss landing/welcome immediately
  setState({ showLanding: false, showWelcome: false })
  try { localStorage.setItem('spothitch_landing_v2', '1') } catch { /* no-op */ }

  // Show immediate feedback so user knows something is happening
  try { showToast('📍 Resolving shared location...', 'info') } catch { /* notifications not loaded yet */ }

  try {
    const params = new URLSearchParams(currentSearch)
    const url = params.get('url') || ''
    const text = params.get('text') || ''
    const title = params.get('title') || ''

    console.log('[Share] Params:', { url: url.slice(0, 80), text: text.slice(0, 80), title })

    // Store shared text for place name fallback
    if (title || text) {
      window._pendingShareText = title || text.split('\n')[0] || ''
    }

    // Resolve coordinates — try multiple strategies
    let coords = null
    try {
      const { extractCoordsFromShare, resolveShortMapUrl, geocodePlace } = await import('./mapsUrlParser.js')

      // Strategy 1: Extract coords directly from URL or text
      coords = extractCoordsFromShare(url, text)
      if (coords) console.log('[Share] Strategy 1 (direct extract):', coords)

      // Strategy 2: Resolve shortened Google Maps URLs (maps.app.goo.gl / goo.gl)
      if (!coords) {
        const allText = `${url} ${text}`
        const shortRe = /https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps|g\.co\/maps|goo\.gle\/maps)\/\S+/
        const shortUrl = allText.match(shortRe)?.[0]
        if (shortUrl) {
          console.log('[Share] Strategy 2: resolving short URL:', shortUrl)
          coords = await resolveShortMapUrl(shortUrl)
          if (coords) console.log('[Share] Strategy 2 resolved:', coords)
          else console.log('[Share] Strategy 2 failed')
        }
      }

      // Strategy 3: Geocode the place name from title/text
      if (!coords && (title || text)) {
        const placeName = title || text.split('\n')[0] || ''
        const cleanName = placeName
          .replace(/https?:\/\/\S+/g, '')
          .replace(/google\s*maps?/gi, '')
          .replace(/\s{2,}/g, ' ')
          .trim()
        if (cleanName.length >= 2 && !cleanName.toLowerCase().includes('not found') && !cleanName.toLowerCase().includes('dynamic link')) {
          console.log('[Share] Strategy 3: geocoding:', cleanName)
          coords = await geocodePlace(cleanName)
          if (coords) console.log('[Share] Strategy 3 resolved:', coords)
          else console.log('[Share] Strategy 3 failed')
        }
      }
    } catch (e) {
      console.warn('[Share] Coord resolution failed:', e.message)
    }

    if (coords) {
      window._pendingShareCoords = coords
      console.log('[Share] Coords ready:', coords.lat, coords.lng)
    } else {
      console.log('[Share] No coords found, will open AddSpot without position')
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
    await waitForApp()

    // Open AddSpot
    console.log('[Share] Opening AddSpot, coords:', coords ? 'yes' : 'no')
    if (window.openAddSpot) {
      window.openAddSpot()
    } else {
      setState({ showAddSpot: true, addSpotPreview: false, addSpotStep: 1 })
    }
  } catch (e) {
    console.error('[Share] Handler failed:', e)
    try {
      if (window.openAddSpot) {
        window.openAddSpot()
      } else {
        setState({ showAddSpot: true, addSpotPreview: false, addSpotStep: 1 })
      }
    } catch { /* give up */ }
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

  // Early share detection: immediately dismiss landing/welcome so share can take priority
  if (action === 'share') {
    setState({ showLanding: false, showWelcome: false })
    try { localStorage.setItem('spothitch_landing_v2', '1') } catch { /* no-op */ }
  }

  if (action && Object.prototype.hasOwnProperty.call(ACTIONS, action)) {
    const handler = ACTIONS[action];
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
 * - pageshow: PWA launched via share target (navigate-existing)
 * - visibilitychange: app brought to foreground with new URL
 * - LaunchParams: modern PWA launch queue API
 * - focus: PWA window receives focus
 */
export function initDeepLinkListener() {
  window.addEventListener('popstate', () => {
    handleDeepLink();
  });

  // Check for share target on every focus/visibility change.
  // On Android, Chrome may navigate the existing window to the share URL
  // but the events may fire before or after the URL updates.
  const checkForShareUrl = () => {
    const search = window.location.search
    if (search.includes('action=share')) {
      // processShare() has its own per-URL guard to prevent double-processing
      processShare()
    }
  };

  // Also check with a short delay (some browsers update URL asynchronously)
  const checkForShareUrlDelayed = () => {
    checkForShareUrl()
    // Retry after 500ms in case URL was updated late
    setTimeout(checkForShareUrl, 500)
  }

  // pageshow fires when the page is shown (including BFCache restore)
  window.addEventListener('pageshow', checkForShareUrlDelayed);

  // visibilitychange fires when the app comes to foreground
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkForShareUrlDelayed();
    }
  });

  // focus fires when the PWA window receives focus
  window.addEventListener('focus', checkForShareUrlDelayed);

  // Modern Launch Queue API (Chrome 110+): handles PWA launch with URL
  if ('launchQueue' in window) {
    window.launchQueue.setConsumer((launchParams) => {
      if (launchParams.targetURL) {
        console.log('[LaunchQueue] Received URL:', launchParams.targetURL)
        // Update URL if needed (some browsers don't navigate automatically)
        if (launchParams.targetURL.includes('action=share')) {
          const url = new URL(launchParams.targetURL)
          if (window.location.search !== url.search) {
            window.history.replaceState({}, '', launchParams.targetURL)
          }
          // Reset guard so this new share gets processed
          _lastProcessedShareUrl = ''
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
};
