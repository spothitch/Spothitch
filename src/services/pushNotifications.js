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
 * Start listening for foreground push messages
 */
export function startForegroundListener() {
  if (!isPushEnabled()) return

  onForegroundMessage((payload) => {
    const { title, body, data } = payload.notification || {}

    // Show in-app notification
    if (typeof window.showToast === 'function') {
      window.showToast(`${title}: ${body}`, 'info')
    }

    // Handle specific notification types
    if (data?.type === 'proximity_alert') {
      handleProximityPush(data)
    }
  })
}

/**
 * Handle proximity alert push notification
 * "Un autostoppeur est à 2km de toi"
 */
function handleProximityPush(data) {
  const { distance, username, spotId } = data || {}

  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification('SpotHitch', {
      body: `${username || 'Un autostoppeur'} est à ${distance || '~2'}km de toi`,
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

  // In-app toast
  if (typeof window.showToast === 'function') {
    window.showToast(
      `${username || 'Un autostoppeur'} est à ${distance.toFixed(1)}km de toi`,
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
 * Initialize push notifications on app start (if already enabled)
 */
export function initPushNotifications() {
  if (isPushEnabled()) {
    startForegroundListener()
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
  banner.style.cssText = `
    position: fixed; top: 60px; left: 50%; transform: translateX(-50%);
    z-index: 9998; max-width: 340px; width: 90%;
    background: rgba(15,27,45,.95); backdrop-filter: blur(14px);
    border: 1px solid rgba(240,168,48,.3); border-radius: 16px;
    padding: 14px 16px; animation: toastSlideDown .3s ease-out;
    box-shadow: 0 8px 32px rgba(0,0,0,.4);
  `
  banner.innerHTML = `
    <div style="font-size:13px;color:#e2e8f0;line-height:1.4;margin-bottom:10px">${msg.text}</div>
    <div style="display:flex;gap:8px">
      <button onclick="window._acceptPushNudge()" style="
        flex:1;padding:8px 12px;border-radius:10px;border:none;
        background:#F0A830;color:#0F1B2D;font-weight:700;font-size:12px;cursor:pointer;
      ">${tFn('enablePushNotifications') || 'Activer'}</button>
      <button onclick="window._dismissPushNudge()" style="
        padding:8px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.15);
        background:transparent;color:#94a3b8;font-size:12px;cursor:pointer;
      ">${tFn('notNow') || 'Plus tard'}</button>
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
  showProximityNotification,
  renderPushSettings,
  initPushNotifications,
  nudgePushNotifications,
}
