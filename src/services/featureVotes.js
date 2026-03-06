/**
 * Feature Votes — Firebase-connected voting system for roadmap features
 *
 * Firestore collections:
 *   featureVotes/{featureId}        — { essential: N, useful: N, notUrgent: N }
 *   featureUserVotes/{oderId}_{fId} — { userId, featureId, vote, comment, userName, avatar, timestamp }
 *
 * localStorage fallback:
 *   spothitch_feature_votes  — { [featureId]: { vote, comment, timestamp } }
 *   spothitch_votes_cache    — { [featureId]: { essential, useful, notUrgent }, _ts }
 */

const VOTES_KEY = 'spothitch_feature_votes'
const CACHE_KEY = 'spothitch_votes_cache'
const CACHE_TTL = 5 * 60 * 1000 // 5 min

// ==================== LOCAL STORAGE ====================

export function getUserVote(featureId) {
  try {
    const all = JSON.parse(localStorage.getItem(VOTES_KEY) || '{}')
    return all[featureId] || null
  } catch { return null }
}

export function getAllUserVotes() {
  try {
    return JSON.parse(localStorage.getItem(VOTES_KEY) || '{}')
  } catch { return {} }
}

function saveUserVoteLocal(featureId, vote, comment) {
  try {
    const all = JSON.parse(localStorage.getItem(VOTES_KEY) || '{}')
    all[featureId] = { vote, comment: comment || '', timestamp: new Date().toISOString() }
    localStorage.setItem(VOTES_KEY, JSON.stringify(all))
  } catch { /* ignore */ }
}

// ==================== CACHE ====================

function getCachedTotals() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (Date.now() - (data._ts || 0) > CACHE_TTL) return null
    return data
  } catch { return null }
}

function setCachedTotals(totals) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...totals, _ts: Date.now() }))
  } catch { /* ignore */ }
}

// ==================== FIREBASE ====================

async function getFirestoreDB() {
  const { getFirestore } = await import('firebase/firestore')
  const { getApp } = await import('firebase/app')
  return getFirestore(getApp())
}

async function getCurrentUser() {
  const { getState } = await import('../stores/state.js')
  const state = getState()
  return state.user?.uid ? state : null
}

/**
 * Submit or update a vote for a feature
 * @param {string} featureId
 * @param {'essential'|'useful'|'notUrgent'} vote
 * @param {string} comment
 */
export async function submitVote(featureId, vote, comment = '') {
  const prevVote = getUserVote(featureId)
  saveUserVoteLocal(featureId, vote, comment)

  try {
    const state = await getCurrentUser()
    if (!state?.user?.uid) return

    const db = await getFirestoreDB()
    const { doc, setDoc, increment, getDoc } = await import('firebase/firestore')

    const userId = state.user.uid
    const userVoteRef = doc(db, 'featureUserVotes', `${userId}_${featureId}`)
    const totalsRef = doc(db, 'featureVotes', featureId)

    // Save individual vote
    await setDoc(userVoteRef, {
      userId,
      featureId,
      vote,
      comment: comment || '',
      userName: state.username || '',
      avatar: state.avatar || '🤙',
      timestamp: new Date().toISOString(),
    }, { merge: true })

    // Update counters (beta + available vote types)
    const voteFieldMap = { essential: 'essential', useful: 'useful', notUrgent: 'notUrgent', love: 'love', works: 'works', improve: 'improve' }
    const field = voteFieldMap[vote]
    if (!field) return

    const updates = { [field]: increment(1) }

    // If changing vote, decrement old one
    if (prevVote && prevVote.vote !== vote && voteFieldMap[prevVote.vote]) {
      updates[voteFieldMap[prevVote.vote]] = increment(-1)
    }

    // Check if doc exists first
    const totalsSnap = await getDoc(totalsRef)
    if (!totalsSnap.exists()) {
      const init = { essential: 0, useful: 0, notUrgent: 0, love: 0, works: 0, improve: 0 }
      init[vote] = 1
      await setDoc(totalsRef, init)
    } else {
      await setDoc(totalsRef, updates, { merge: true })
    }

    // Invalidate cache
    localStorage.removeItem(CACHE_KEY)
  } catch { /* Firebase not critical — localStorage has the vote */ }
}

/**
 * Get vote totals for all features (cached 5min)
 * @returns {Object} { [featureId]: { essential, useful, notUrgent } }
 */
export async function getVoteTotals() {
  const cached = getCachedTotals()
  if (cached) {
    const result = { ...cached }
    delete result._ts
    return result
  }

  try {
    const db = await getFirestoreDB()
    const { collection, getDocs } = await import('firebase/firestore')
    const snap = await getDocs(collection(db, 'featureVotes'))
    const totals = {}
    snap.forEach(docSnap => {
      const data = docSnap.data()
      totals[docSnap.id] = {
        essential: data.essential || 0,
        useful: data.useful || 0,
        notUrgent: data.notUrgent || 0,
      }
    })
    setCachedTotals(totals)
    return totals
  } catch {
    return {}
  }
}

/**
 * Get public comments for a feature (with userName + avatar)
 * @param {string} featureId
 * @returns {Array} [{ userName, avatar, comment, vote, timestamp }]
 */
export async function getFeatureComments(featureId) {
  try {
    const db = await getFirestoreDB()
    const { collection, query, where, orderBy, limit, getDocs } = await import('firebase/firestore')
    const q = query(
      collection(db, 'featureUserVotes'),
      where('featureId', '==', featureId),
      where('comment', '!=', ''),
      orderBy('comment'),
      orderBy('timestamp', 'desc'),
      limit(20)
    )
    const snap = await getDocs(q)
    return snap.docs.map(d => {
      const data = d.data()
      return {
        userName: data.userName || 'Voyageur',
        avatar: data.avatar || '🤙',
        comment: data.comment,
        vote: data.vote,
        timestamp: data.timestamp,
      }
    })
  } catch {
    return []
  }
}
