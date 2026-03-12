/**
 * Deep Linking Utility
 * Handles URL parameters and navigation state
 */

import { setState, getState } from '../stores/state.js';

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
  'share': async () => {
    const params = getUrlParams()
    const url = params.get('url') || ''
    const text = params.get('text') || ''
    const title = params.get('title') || ''
    const { extractCoordsFromShare, resolveShortMapUrl, geocodePlace } = await import('./mapsUrlParser.js')
    let coords = extractCoordsFromShare(url, text)
    // Try resolving shortened Google Maps URLs (maps.app.goo.gl)
    if (!coords) {
      const shortUrl = (url || '').match(/https?:\/\/maps\.app\.goo\.gl\/\S+/)?.[0]
        || (text || '').match(/https?:\/\/maps\.app\.goo\.gl\/\S+/)?.[0]
      if (shortUrl) {
        coords = await resolveShortMapUrl(shortUrl)
      }
    }
    // Fallback: geocode the place name from title/text when no coords found
    if (!coords && (title || text)) {
      const placeName = title || text.split('\n')[0] || ''
      // Clean place name: remove URLs, "Google Maps", extra whitespace
      const cleanName = placeName
        .replace(/https?:\/\/\S+/g, '')
        .replace(/google\s*maps?/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim()
      if (cleanName.length >= 2) {
        coords = await geocodePlace(cleanName)
      }
    }
    if (coords) {
      window._pendingShareCoords = coords
    }
    // Store shared text for place name fallback
    if (title || text) {
      window._pendingShareText = title || text.split('\n')[0] || ''
    }
    // Wait for app to be fully initialized before opening AddSpot
    // (on share target launch, the app restarts and openAddSpot may not exist yet)
    const waitForApp = () => new Promise((resolve) => {
      if (window.openAddSpot) return resolve()
      let attempts = 0
      const check = setInterval(() => {
        attempts++
        if (window.openAddSpot || attempts > 50) {
          clearInterval(check)
          resolve()
        }
      }, 100)
    })
    await waitForApp()
    window.openAddSpot?.()
  },
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
  if (action && Object.prototype.hasOwnProperty.call(ACTIONS, action)) {
    const handler = ACTIONS[action];
    setTimeout(() => handler(), 100);
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

  // Clear URL params after handling (optional - keeps URL clean)
  // clearUrlParams()
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
 */
export function initDeepLinkListener() {
  window.addEventListener('popstate', () => {
    handleDeepLink();
  });

  // PWA share target: when the app is already open and receives a share,
  // the browser navigates the existing window. Detect this via pageshow/focus.
  let lastHandledUrl = window.location.href;

  const checkForNewShareUrl = () => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastHandledUrl && currentUrl.includes('action=share')) {
      lastHandledUrl = currentUrl;
      handleDeepLink();
    }
  };

  // pageshow fires when the page is shown (including BFCache restore)
  window.addEventListener('pageshow', checkForNewShareUrl);

  // visibilitychange fires when the app comes to foreground
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkForNewShareUrl();
    }
  });

  // focus fires when the PWA window receives focus
  window.addEventListener('focus', checkForNewShareUrl);

  // Modern Launch Queue API (Chrome 110+): handles PWA launch with URL
  if ('launchQueue' in window) {
    window.launchQueue.setConsumer((launchParams) => {
      if (launchParams.targetURL && launchParams.targetURL.includes('action=share')) {
        lastHandledUrl = launchParams.targetURL;
        handleDeepLink();
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
