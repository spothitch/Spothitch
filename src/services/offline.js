/**
 * Offline Service
 * Handles offline detection, UI feedback, and data syncing
 */

import { Storage } from '../utils/storage.js';
import { t } from '../i18n/index.js';

// Offline state
let isOffline = !navigator.onLine;
let offlineIndicator = null;
let pendingActions = [];

/**
 * Initialize offline handling
 */
export function initOfflineHandler() {
  // Create offline indicator
  createOfflineIndicator();

  // Listen for online/offline events
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Initial state check
  if (isOffline) {
    showOfflineIndicator();
  }

  // Load pending actions from storage
  loadPendingActions();
}

/**
 * Create offline indicator element
 */
function createOfflineIndicator() {
  offlineIndicator = document.createElement('div');
  offlineIndicator.className = 'offline-indicator hidden';
  offlineIndicator.setAttribute('role', 'alert');
  offlineIndicator.setAttribute('aria-live', 'assertive');
  offlineIndicator.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;gap:8px">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
      <span>${t('offlineModeActivated') || 'No connection. Saved spots remain accessible.'}</span>
    </div>
  `;
  document.body.prepend(offlineIndicator);
}

/**
 * Handle going online
 */
function handleOnline() {
  isOffline = false;
  hideOfflineIndicator();
  syncPendingActions();

  // Announce to screen readers
  announceToSR(t('offlineConnectionRestored') || 'Connection restored');
}

/**
 * Handle going offline
 */
function handleOffline() {
  isOffline = true;
  showOfflineIndicator();

  // Announce to screen readers
  announceToSR(t('offlineModeActivated') || 'Offline mode activated');
}

/**
 * Show offline indicator
 */
function showOfflineIndicator() {
  if (offlineIndicator) {
    offlineIndicator.classList.remove('hidden');
    document.body.style.paddingTop = '40px';
  }
}

/**
 * Hide offline indicator
 */
function hideOfflineIndicator() {
  if (offlineIndicator) {
    offlineIndicator.classList.add('hidden');
    document.body.style.paddingTop = '0';
  }
}

/**
 * Check if currently offline
 * @returns {boolean}
 */
export function isCurrentlyOffline() {
  return isOffline;
}

/**
 * Queue an action for when online
 * @param {Object} action - Action to queue
 */
export function queueOfflineAction(action) {
  pendingActions.push({
    ...action,
    timestamp: Date.now(),
  });
  savePendingActions();
}

/**
 * Load pending actions from storage
 */
function loadPendingActions() {
  const stored = Storage.get('pendingActions');
  if (stored && Array.isArray(stored)) {
    pendingActions = stored;
  }
}

/**
 * Save pending actions to storage
 */
function savePendingActions() {
  Storage.set('pendingActions', pendingActions);
}

/**
 * Sync pending actions when online
 */
async function syncPendingActions() {
  if (pendingActions.length === 0) return;

  const actionsToSync = [...pendingActions];
  pendingActions = [];
  savePendingActions();

  for (const action of actionsToSync) {
    try {
      await processAction(action);
    } catch (error) {
      console.error(`Failed to sync action: ${action.type}`, error);
      // Re-queue failed action
      pendingActions.push(action);
    }
  }

  savePendingActions();
}

/**
 * Process a queued action
 * @param {Object} action - Action to process
 */
async function processAction(action) {
  // Dynamic import to avoid circular dependencies
  const fb = await import('./firebase.js')

  switch (action.type) {
    case 'ADD_SPOT': {
      console.log('[OfflineSync] Syncing ADD_SPOT:', action.data?.name || 'unnamed')
      const result = await fb.addSpot(action.data)
      if (!result.success) throw new Error(result.error || 'addSpot failed')
      console.log('[OfflineSync] ADD_SPOT synced, id:', result.id)
      break
    }
    case 'ADD_REVIEW': {
      console.log('[OfflineSync] Syncing ADD_REVIEW for spot:', action.spotId)
      const result = await fb.addReview(action.spotId, action.data)
      if (!result.success) throw new Error(result.error || 'addReview failed')
      console.log('[OfflineSync] ADD_REVIEW synced')
      break
    }
    case 'ADD_VALIDATION': {
      console.log('[OfflineSync] Syncing ADD_VALIDATION for spot:', action.data?.spotId)
      const result = await fb.addValidation(action.data)
      if (!result.success) throw new Error(result.error || 'addValidation failed')
      console.log('[OfflineSync] ADD_VALIDATION synced')
      break
    }
    case 'SEND_DM': {
      console.log('[OfflineSync] Syncing SEND_DM')
      const dm = await import('./directMessages.js')
      await dm.sendDirectMessage(action.conversationId, action.data.text)
      console.log('[OfflineSync] SEND_DM synced')
      break
    }
    case 'CREATE_EVENT': {
      console.log('[OfflineSync] Syncing CREATE_EVENT')
      const events = await import('./events.js')
      events.createEvent(action.data)
      console.log('[OfflineSync] CREATE_EVENT synced')
      break
    }
    case 'SEND_FRIEND_REQUEST': {
      console.log('[OfflineSync] Syncing SEND_FRIEND_REQUEST')
      const friends = await import('./friends.js')
      await friends.sendFriendRequest(action.data.targetUid)
      console.log('[OfflineSync] SEND_FRIEND_REQUEST synced')
      break
    }
    case 'SUBMIT_REPORT': {
      console.log('[OfflineSync] Syncing SUBMIT_REPORT')
      const mod = await import('./moderation.js')
      await mod.submitReport(action.data)
      console.log('[OfflineSync] SUBMIT_REPORT synced')
      break
    }
    case 'BLOCK_USER': {
      console.log('[OfflineSync] Syncing BLOCK_USER')
      const blocking = await import('./userBlocking.js')
      blocking.blockUser(action.data.userId, action.data.reason)
      console.log('[OfflineSync] BLOCK_USER synced')
      break
    }
    default:
      console.warn('Unknown action type:', action.type);
  }
}

/**
 * Announce message to screen readers
 * @param {string} message
 */
function announceToSR(message) {
  const region = document.getElementById('aria-live-assertive');
  if (region) {
    region.textContent = '';
    setTimeout(() => {
      region.textContent = message;
    }, 100);
  }
}

/**
 * Cache spots data for offline use
 * @param {Array} spots - Spots to cache
 */
export function cacheSpots(spots) {
  Storage.set('cachedSpots', {
    data: spots,
    timestamp: Date.now(),
  });
}

/**
 * Get cached spots
 * @returns {Array|null}
 */
export function getCachedSpots() {
  const cached = Storage.get('cachedSpots');
  if (cached && cached.data) {
    // Check if cache is less than 24 hours old
    const maxAge = 24 * 60 * 60 * 1000;
    if (Date.now() - cached.timestamp < maxAge) {
      return cached.data;
    }
  }
  return null;
}

/**
 * Check if data is cached and fresh
 * @param {string} key - Cache key
 * @param {number} maxAge - Max age in ms
 * @returns {boolean}
 */
export function isCacheFresh(key, maxAge = 3600000) {
  const cached = Storage.get(key);
  if (!cached || !cached.timestamp) return false;
  return Date.now() - cached.timestamp < maxAge;
}

/**
 * Guard for network-dependent actions.
 * Shows a toast if offline and returns true (= blocked).
 * @returns {boolean} true if offline (action should be blocked)
 */
export async function requireOnline() {
  if (!isOffline) return false;
  try {
    const { showToast } = await import('./notifications.js');
    showToast(t('offlineActionBlocked') || 'This action requires an internet connection', 'warning');
  } catch {
    // notifications not loaded yet
  }
  return true;
}

/**
 * Detect slow connection and show indicator
 */
export function checkSlowConnection() {
  if (!navigator.connection) return;
  const conn = navigator.connection;
  const isSlow = conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g' || conn.effectiveType === '3g';
  if (isSlow && !document.getElementById('slow-connection-indicator')) {
    const indicator = document.createElement('div');
    indicator.id = 'slow-connection-indicator';
    indicator.setAttribute('role', 'status');
    indicator.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#7c3aed;color:#fff;text-align:center;padding:6px;font-size:12px;font-weight:500;z-index:9998;animation:slideDown 0.3s ease-out';
    indicator.textContent = t('slowConnection') || 'Slow connection. Loading may take longer.';
    document.body.prepend(indicator);
    // Auto-remove after 8 seconds
    setTimeout(() => indicator.remove(), 8000);
  }
}

export default {
  initOfflineHandler,
  isCurrentlyOffline,
  queueOfflineAction,
  requireOnline,
  checkSlowConnection,
  cacheSpots,
  getCachedSpots,
  isCacheFresh,
};
