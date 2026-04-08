/**
 * Push Notifications Service
 * Handles FCM push notifications with opt-in permission
 * Integrates with proximity alerts to notify nearby hitchhikers
 */

import { requestNotificationPermission, onForegroundMessage } from './firebase.js'
import { renderToggle } from '../utils/toggle.js'
import { t } from '../i18n/index.js'

const STORAGE_KEY = 'spothitch_push_config'
const TOKEN_KEY = 'spothitch_fcm_token'
const NUDGE_KEY = 'spothitch_push_nudge_dismissed'

// Track foreground listener unsubscribe to prevent memory leaks
let _foregroundUnsubscribe = null

/**
 * Get push notification config
 */
function getConfig() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

/**
 * Save push notification config
 */
function saveConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

/**
 * Check if push notifications are enabled
 * @returns {boolean}
 */
export function isPushEnabled() {
  return getConfig().enabled === true
}

/**
 * Check if user has been asked for push permission
 * @returns {boolean}
 */
export function hasBeenAsked() {
  return getConfig().asked === true
}

/**
 * Request push notification permission (opt-in)
 * Only call this after user explicitly enables notifications
 * @returns {Promise<{success: boolean, token: string|null}>}
 */
export async function enablePushNotifications() {
  try {
    const token = await requestNotificationPermission()

    if (token) {
      saveConfig({
        enabled: true,
        asked: true,
        enabledAt: Date.now(),
      })
      localStorage.setItem(TOKEN_KEY, token)

      // Start listening for foreground messages
      startForegroundListener()

      return { success: true, token }
    }

    // Permission denied
    saveConfig({
      enabled: false,
      asked: true,
      deniedAt: Date.now(),
    })
    return { success: false, token: null }
  } catch (error) {
    console.error('[Push] Enable failed:', error)
    return { success: false, token: null }
  }
}

/**
 * Disable push notifications
 */
export function disablePushNotifications() {
  stopForegroundListener()
  saveConfig({
    enabled: false,
    asked: true,
    disabledAt: Date.now(),
  })
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Get stored FCM token
 * @returns {string|null}
 */
export function getFCMToken() {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Start listening for foreground push messages.
 * Guards against multiple registrations (memory leak prevention).
 */
export function startForegroundListener() {
  if (!isPushEnabled()) return

  // Unsubscribe previous listener to prevent duplicates
  stopForegroundListener()

  _foregroundUnsubscribe = onForegroundMessage((payload) => {
    const data = payload.data || {}
    const { title, body } = payload.notification || {}

    // Community SOS alert → show special banner (was in notifications.js)
    if (data.type === 'community_sos_alert' && typeof window._showCommunitySOSBanner === 'function') {
      window._showCommunitySOSBanner(data)
      return
    }

    // Show in-app notification
    if (typeof window.showToast === 'function') {
      window.showToast(`${title}: ${body}`, 'info')
    }

    // Handle specific notification types
    if (data.type === 'proximity_alert') {
      handleProximityPush(data)
    }
  })
}

/**
 * Stop the foreground listener (on disable/logout)
 */
export function stopForegroundListener() {
  if (_foregroundUnsubscribe) {
    _foregroundUnsubscribe()
    _foregroundUnsubscribe = null
  }
}

/**
 * Handle proximity alert push notification
 * "Un autostoppeur est à 2km de toi"
 */
function handleProximityPush(data) {
  const { distance, username, spotId } = data || {}
  // Sanitize username — Notification API escapes body natively but be safe
  const safeName = (username || '').replace(/[<>"'&]/g, '') || 'Un autostoppeur'

  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification('SpotHitch', {
      body: `${safeName} est à ${distance || '~2'}km de toi`,
      icon: '/icon-192.png',
      badge: '/icon-72.png',
      tag: 'proximity-alert',
      data: { spotId },
    })

    notification.onclick = () => {
      window.focus()
      if (spotId && window.selectSpot) {
        window.selectSpot(spotId)
      }
      notification.close()
    }
  }
}

/**
 * Send a local proximity notification (for when user is in the app)
 * @param {Object} params
 * @param {string} params.username - Name of nearby user
 * @param {number} params.distance - Distance in km
 * @param {string} [params.spotId] - Optional spot ID
 */
export function showProximityNotification({ username, distance, spotId }) {
  if (!isPushEnabled()) return

  // In-app toast — sanitize username
  const safeName = (username || '').replace(/[<>"'&]/g, '') || 'Un autostoppeur'
  if (typeof window.showToast === 'function') {
    window.showToast(
      `${safeName} est à ${distance.toFixed(1)}km de toi`,
      'info'
    )
  }

  // Browser notification if app is in background
  if (document.hidden && 'Notification' in window && Notification.permission === 'granted') {
    handleProximityPush({ username, distance: distance.toFixed(1), spotId })
  }
}

/**
 * Render push notification settings section (for Settings page)
 * @returns {string} HTML
 */
export function renderPushSettings() {
  const enabled = isPushEnabled()
  const asked = hasBeenAsked()

  return `
    <div class="p-4 bg-dark-secondary/50 rounded-xl border border-white/5">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="font-medium text-white text-sm">${t('pushNotificationsTitle') || 'Notifications push'}</h4>
          <p class="text-xs text-slate-400 mt-0.5">
            ${enabled ? (t('pushEnabled') || 'Activées') : asked ? (t('pushDisabled') || 'Désactivées') : (t('pushDescription') || 'Recevez des alertes quand un autostoppeur est proche')}
          </p>
        </div>
        ${renderToggle(enabled, "togglePushNotifications()", t('pushNotificationsTitle') || 'Notifications push')}
      </div>
    </div>
  `
}

/**
 * Initialize push notifications on app start (if already enabled).
 * Also refreshes the FCM token if it's older than 7 days.
 */
export async function initPushNotifications() {
  if (!isPushEnabled()) return

  startForegroundListener()

  // Refresh token if older than 7 days
  const config = getConfig()
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000
  const lastRefresh = config.enabledAt || 0
  if (Date.now() - lastRefresh > SEVEN_DAYS) {
    try {
      const token = await requestNotificationPermission()
      if (token) {
        localStorage.setItem(TOKEN_KEY, token)
        saveConfig({ ...config, enabledAt: Date.now() })
        // Save refreshed token to Firestore
        const { saveFCMToken } = await import('./firebase.js')
        await saveFCMToken(token)
      }
    } catch { /* non-blocking — token refresh is best-effort */ }
  }
}

/**
 * Show a smart nudge banner to enable push notifications.
 * Called after meaningful actions (Guardian start, first DM).
 * Won't show if push is already enabled, was dismissed, or was denied.
 * @param {'guardian' | 'message'} context - Why we're nudging
 */
export function nudgePushNotifications(context = 'guardian') {
  // Don't nudge if already enabled, already asked, or dismissed
  if (isPushEnabled()) return
  if (hasBeenAsked()) return
  try {
    if (localStorage.getItem(NUDGE_KEY)) return
  } catch { /* ignore */ }

  // Don't nudge if browser doesn't support notifications
  if (!('Notification' in window) || !('PushManager' in window)) return

  const tFn = window.t || ((k) => k)

  const messages = {
    guardian: {
      text: tFn('pushNudgeGuardian') || 'Active les notifications push pour recevoir les alertes Guardian même quand l\'app est fermée.',
      icon: 'shield',
    },
    message: {
      text: tFn('pushNudgeMessage') || 'Active les notifications push pour ne pas manquer les messages de tes amis.',
      icon: 'message-circle',
    },
  }
  const msg = messages[context] || messages.guardian

  // Create a non-intrusive banner at the top
  const existing = document.getElementById('push-nudge-banner')
  if (existing) existing.remove()

  const banner = document.createElement('div')
  banner.id = 'push-nudge-banner'
  banner.className = 'fixed top-[60px] left-1/2 -translate-x-1/2 z-[9998] max-w-[340px] w-[90%] bg-dark-primary/95 backdrop-blur-lg border border-brand/30 rounded-2xl p-3.5 shadow-2xl animate-[toastSlideDown_.3s_ease-out]'
  banner.innerHTML = `
    <div class="text-[13px] text-slate-200 leading-snug mb-2.5">${msg.text}</div>
    <div class="flex gap-2">
      <button onclick="window._acceptPushNudge()" class="flex-1 py-2 px-3 rounded-[10px] border-none bg-brand text-dark-primary font-bold text-xs cursor-pointer">${tFn('enablePushNotifications') || 'Activer'}</button>
      <button onclick="window._dismissPushNudge()" class="py-2 px-3 rounded-[10px] border border-white/15 bg-transparent text-slate-400 text-xs cursor-pointer">${tFn('notNow') || 'Plus tard'}</button>
    </div>
  `
  document.body.appendChild(banner)

  // Auto-dismiss after 15 seconds
  const autoTimer = setTimeout(() => banner.remove(), 15000)

  window._acceptPushNudge = async () => {
    clearTimeout(autoTimer)
    banner.remove()
    window.togglePushNotifications?.()
  }

  window._dismissPushNudge = () => {
    clearTimeout(autoTimer)
    banner.remove()
    try { localStorage.setItem(NUDGE_KEY, Date.now().toString()) } catch { /* ignore */ }
  }
}

export default {
  isPushEnabled,
  hasBeenAsked,
  enablePushNotifications,
  disablePushNotifications,
  getFCMToken,
  startForegroundListener,
  stopForegroundListener,
  showProximityNotification,
  renderPushSettings,
  initPushNotifications,
  nudgePushNotifications,
}
