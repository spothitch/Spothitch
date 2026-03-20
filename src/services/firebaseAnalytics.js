/**
 * Firebase Analytics + Performance Monitoring
 * Activated after user accepts cookies/analytics.
 * Tracks: screen views, button clicks, feature usage.
 * Performance: page load time, network latency.
 */

let _analytics = null
let _performance = null

/**
 * Initialize Firebase Analytics (call after cookie consent)
 */
export async function initFirebaseAnalytics() {
  try {
    const { getAnalytics, logEvent, setUserId } = await import('firebase/analytics')
    const { getApp } = await import('firebase/app')
    _analytics = getAnalytics(getApp())

    // Set user ID if logged in
    const state = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
    if (state.user?.uid) {
      setUserId(_analytics, state.user.uid)
    }

    console.log('[Analytics] Firebase Analytics initialized')
  } catch (err) {
    console.warn('[Analytics] Failed to init:', err.message)
  }
}

/**
 * Initialize Firebase Performance Monitoring
 */
export async function initPerformanceMonitoring() {
  try {
    const { getPerformance } = await import('firebase/performance')
    const { getApp } = await import('firebase/app')
    _performance = getPerformance(getApp())
    console.log('[Performance] Firebase Performance initialized')
  } catch (err) {
    console.warn('[Performance] Failed to init:', err.message)
  }
}

/**
 * Log a custom event to Firebase Analytics
 * @param {string} eventName
 * @param {object} params
 */
export function trackEvent(eventName, params = {}) {
  if (!_analytics) return
  try {
    const { logEvent } = require('firebase/analytics')
    logEvent(_analytics, eventName, params)
  } catch { /* silent */ }
}

/**
 * Log screen view
 * @param {string} screenName
 */
export function trackScreen(screenName) {
  trackEvent('screen_view', { firebase_screen: screenName })
}

/**
 * Log feature usage
 * @param {string} feature
 */
export function trackFeature(feature) {
  trackEvent('feature_used', { feature_name: feature })
}
