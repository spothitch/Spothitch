/**
 * Firebase Sync Service
 * Centralizes ALL localStorage → Firestore sync for multi-device support.
 *
 * Two directions:
 * - syncAllToFirestore(): push local data to Firestore (called on changes)
 * - hydrateAllFromFirestore(): pull Firestore data to local (called on login)
 *
 * All user data that matters across devices goes through here.
 */

import { setState } from '../stores/state.js'

// Debounce timer for batching rapid changes
let _syncTimer = null
const SYNC_DEBOUNCE_MS = 3000

/**
 * Sync all local user data to Firestore (debounced).
 * Called after any meaningful data change.
 */
export function syncAllToFirestore() {
  clearTimeout(_syncTimer)
  _syncTimer = setTimeout(_doSync, SYNC_DEBOUNCE_MS)
}

async function _doSync() {
  try {
    const { getCurrentUser } = await import('./firebase.js')
    const user = getCurrentUser()
    if (!user) return

    const { getFirestore, doc, setDoc } = await import('firebase/firestore')
    const { getApp, getApps } = await import('firebase/app')
    if (!getApps().length) return

    const db = getFirestore(getApp())

    // Gather all local-only data that needs syncing
    const checkinHistory = _getJSON('spothitch_checkin_history', [])
    const dailyStreak = _getJSON('spothitch_daily_reward_streak', 0)
    const dailyLastClaim = _getStr('spothitch_last_daily_reward_claim')
    const dailyHistory = _getJSON('spothitch_daily_rewards_history', [])
    const geoAchievements = _getJSON('spothitch_geo_achievements', {})
    const bordersCrossed = _getJSON('spothitch_borders_crossed', [])
    const capitalsVisited = _getJSON('spothitch_capitals_visited', [])
    const quizScores = _getJSON('spothitch_country_quiz_scores', {})
    const privacy = _getJSON('spothitch_privacy', {})
    const savedTrips = _getJSON('spothitch_saved_trips', [])
    const seasonHistory = _getJSON('spothitch_season_history', [])
    const seasonRewards = _getJSON('spothitch_season_rewards', [])
    const seasonData = _getJSON('spothitch_season_data', {})
    const blockedUsers = _getJSON('spothitch_blocked_users', [])
    const roadmapVotes = _getJSON('spothitch_roadmap_votes', {})
    const featureOpinions = _getJSON('spothitch_feature_opinions', {})

    // Write to users/{uid}/syncData (merge to avoid overwriting other fields)
    await setDoc(doc(db, 'users', user.uid, 'syncData', 'local'), {
      checkinHistory: checkinHistory.slice(-200), // Cap at 200 entries
      dailyStreak,
      dailyLastClaim,
      dailyHistory: dailyHistory.slice(-90), // Cap at 90 days
      geoAchievements,
      bordersCrossed,
      capitalsVisited,
      quizScores,
      privacy,
      savedTrips: savedTrips.slice(-50), // Cap at 50 trips
      seasonHistory: seasonHistory.slice(-10), // Cap at 10 seasons
      seasonRewards: seasonRewards.slice(-50),
      seasonData,
      blockedUsers: blockedUsers.slice(-100),
      roadmapVotes,
      featureOpinions,
      syncedAt: new Date().toISOString(),
    }, { merge: true })
  } catch {
    // Silent fail — localStorage remains source of truth when offline
  }
}

/**
 * Hydrate all local data from Firestore (called on login).
 * Firestore wins for most data (multi-device source of truth).
 * @param {string} userId
 */
export async function hydrateAllFromFirestore(userId) {
  try {
    const { getFirestore, doc, getDoc } = await import('firebase/firestore')
    const { getApp, getApps } = await import('firebase/app')
    if (!getApps().length) return

    const db = getFirestore(getApp())
    const snap = await getDoc(doc(db, 'users', userId, 'syncData', 'local'))
    if (!snap.exists()) return

    const d = snap.data()

    // Merge strategy: Firestore wins for array data (longer = more complete)
    // For numbers: take the max (avoid losing progress)

    if (Array.isArray(d.checkinHistory) && d.checkinHistory.length > 0) {
      const local = _getJSON('spothitch_checkin_history', [])
      const merged = _mergeArraysById(local, d.checkinHistory)
      _setJSON('spothitch_checkin_history', merged.slice(-200))
      setState({ checkinHistory: merged.slice(-200) })
    }

    if (d.dailyStreak !== undefined) {
      const localStreak = _getJSON('spothitch_daily_reward_streak', 0)
      const best = Math.max(localStreak, d.dailyStreak || 0)
      _setJSON('spothitch_daily_reward_streak', best)
    }

    if (d.dailyLastClaim) {
      const local = _getStr('spothitch_last_daily_reward_claim')
      // Take the most recent claim
      if (!local || d.dailyLastClaim > local) {
        _setStr('spothitch_last_daily_reward_claim', d.dailyLastClaim)
      }
    }

    if (Array.isArray(d.dailyHistory) && d.dailyHistory.length > 0) {
      const local = _getJSON('spothitch_daily_rewards_history', [])
      const merged = _mergeArraysById(local, d.dailyHistory)
      _setJSON('spothitch_daily_rewards_history', merged.slice(-90))
    }

    if (d.geoAchievements && Object.keys(d.geoAchievements).length > 0) {
      const local = _getJSON('spothitch_geo_achievements', {})
      _setJSON('spothitch_geo_achievements', { ...local, ...d.geoAchievements })
    }

    if (Array.isArray(d.bordersCrossed)) {
      const local = _getJSON('spothitch_borders_crossed', [])
      _setJSON('spothitch_borders_crossed', _mergeUnique(local, d.bordersCrossed))
    }

    if (Array.isArray(d.capitalsVisited)) {
      const local = _getJSON('spothitch_capitals_visited', [])
      _setJSON('spothitch_capitals_visited', _mergeUnique(local, d.capitalsVisited))
    }

    if (d.quizScores && Object.keys(d.quizScores).length > 0) {
      const local = _getJSON('spothitch_country_quiz_scores', {})
      // Take the best score per country
      const merged = { ...local }
      for (const [k, v] of Object.entries(d.quizScores)) {
        merged[k] = Math.max(merged[k] || 0, v || 0)
      }
      _setJSON('spothitch_country_quiz_scores', merged)
    }

    if (d.privacy && Object.keys(d.privacy).length > 0) {
      _setJSON('spothitch_privacy', d.privacy)
    }

    if (Array.isArray(d.savedTrips) && d.savedTrips.length > 0) {
      const local = _getJSON('spothitch_saved_trips', [])
      const merged = _mergeArraysById(local, d.savedTrips)
      _setJSON('spothitch_saved_trips', merged.slice(-50))
      setState({ savedTrips: merged.slice(-50) })
    }

    if (Array.isArray(d.seasonHistory)) {
      const local = _getJSON('spothitch_season_history', [])
      const merged = _mergeArraysById(local, d.seasonHistory)
      _setJSON('spothitch_season_history', merged.slice(-10))
    }

    if (Array.isArray(d.seasonRewards)) {
      const local = _getJSON('spothitch_season_rewards', [])
      _setJSON('spothitch_season_rewards', _mergeUnique(local, d.seasonRewards))
    }

    if (d.seasonData && Object.keys(d.seasonData).length > 0) {
      const local = _getJSON('spothitch_season_data', {})
      _setJSON('spothitch_season_data', { ...local, ...d.seasonData })
    }

    if (Array.isArray(d.blockedUsers)) {
      _setJSON('spothitch_blocked_users', d.blockedUsers)
      setState({ blockedUsers: d.blockedUsers })
    }

    if (d.roadmapVotes && Object.keys(d.roadmapVotes).length > 0) {
      const local = _getJSON('spothitch_roadmap_votes', {})
      _setJSON('spothitch_roadmap_votes', { ...local, ...d.roadmapVotes })
    }

    if (d.featureOpinions && Object.keys(d.featureOpinions).length > 0) {
      const local = _getJSON('spothitch_feature_opinions', {})
      _setJSON('spothitch_feature_opinions', { ...local, ...d.featureOpinions })
    }
  } catch {
    // Silent fail — localStorage remains source of truth
  }
}

// ==================== HELPERS ====================

function _getJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback } catch { return fallback }
}
function _setJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* no-op */ }
}
function _getStr(key) {
  try { return localStorage.getItem(key) || '' } catch { return '' }
}
function _setStr(key, value) {
  try { localStorage.setItem(key, value) } catch { /* no-op */ }
}

/** Merge two arrays, deduplicating by .id or by stringified value */
function _mergeArraysById(local, remote) {
  const map = new Map()
  for (const item of local) {
    const key = item?.id || JSON.stringify(item)
    map.set(key, item)
  }
  for (const item of remote) {
    const key = item?.id || JSON.stringify(item)
    if (!map.has(key)) map.set(key, item)
  }
  return Array.from(map.values())
}

/** Merge two arrays of primitives, keeping unique values */
function _mergeUnique(local, remote) {
  return [...new Set([...local, ...remote])]
}
