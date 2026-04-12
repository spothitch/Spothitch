/**
 * Feature Intro Service — localStorage tracker for "first seen" feature intros
 * Key: spothitch_feature_seen
 * Value: { featureId: timestamp }
 */

const KEY = 'spothitch_feature_seen'

export function isFeatureSeen(id) {
  try {
    const seen = JSON.parse(localStorage.getItem(KEY) || '{}')
    return !!seen[id]
  } catch (e) {
    return false
  }
}

export function markFeatureSeen(id) {
  try {
    const seen = JSON.parse(localStorage.getItem(KEY) || '{}')
    seen[id] = Date.now()
    localStorage.setItem(KEY, JSON.stringify(seen))
  } catch { /* ignore */ }
}

export function getSeenCount() {
  try {
    return Object.keys(JSON.parse(localStorage.getItem(KEY) || '{}')).length
  } catch (e) {
    return 0
  }
}
