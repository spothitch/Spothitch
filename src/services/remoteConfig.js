/**
 * Firebase Remote Config Service
 * Allows changing app behavior from the Firebase console without redeploying.
 *
 * Usage: import { getConfigValue } from './remoteConfig.js'
 *   const minReports = getConfigValue('min_reports_auto_hide', 3)
 */

let _remoteConfig = null
let _initialized = false
const _defaults = {
  // Feature flags
  guardian_mode_enabled: true,
  sos_mode_enabled: true,
  group_chat_enabled: false,
  real_time_tracking_enabled: true,

  // Moderation
  min_reports_auto_hide: 3,
  profanity_filter_enabled: true,

  // Limits
  max_spots_per_day: 10,
  max_photos_per_spot: 5,
  max_message_length: 2000,
  check_in_grace_minutes: 5,

  // UX
  show_maintenance_banner: false,
  maintenance_message: '',
  announcement_text: '',
  announcement_active: false,

  // Beta
  beta_invite_required: true,
  force_update_version: '',
  feedback_prompt_enabled: false,

  // Analytics
  enable_posthog: false,
}

/**
 * Initialize Remote Config with defaults.
 * Called once at app startup. Fetches latest values from Firebase.
 */
export async function initRemoteConfig() {
  if (_initialized) return

  try {
    const { getRemoteConfig, fetchAndActivate } = await import('firebase/remote-config')
    const { getApp } = await import('firebase/app')

    _remoteConfig = getRemoteConfig(getApp())
    _remoteConfig.settings.minimumFetchIntervalMillis = 3600000 // 1 hour in production
    _remoteConfig.defaultConfig = _defaults

    await fetchAndActivate(_remoteConfig)
    _initialized = true
    console.log('[RemoteConfig] Initialized and activated')
  } catch (err) {
    console.warn('[RemoteConfig] Failed to init, using defaults:', err.message)
    _initialized = true // use defaults silently
  }
}

/**
 * Get a config value. Returns the default if Remote Config hasn't loaded.
 * @param {string} key
 * @param {*} fallback
 * @returns {string|number|boolean}
 */
export function getConfigValue(key, fallback) {
  if (_remoteConfig) {
    try {
      const { getValue } = require('firebase/remote-config')
      const val = getValue(_remoteConfig, key)
      // getValue returns a Value object, use asString/asNumber/asBoolean
      if (typeof fallback === 'boolean' || typeof _defaults[key] === 'boolean') {
        return val.asBoolean()
      }
      if (typeof fallback === 'number' || typeof _defaults[key] === 'number') {
        return val.asNumber()
      }
      return val.asString()
    } catch {
      // fallthrough
    }
  }
  // Fallback: use defaults
  if (key in _defaults) return _defaults[key]
  return fallback
}

/**
 * Check if a feature is enabled via Remote Config.
 * Shorthand for boolean flags.
 * @param {string} flag - e.g. 'guardian_mode_enabled'
 * @returns {boolean}
 */
export function isFeatureEnabled(flag) {
  return getConfigValue(flag, _defaults[flag] ?? false)
}
