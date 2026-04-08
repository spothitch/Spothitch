/**
 * Friends Service — Firebase
 * Manages friend requests and friendships via Firestore
 *
 * Collections:
 *   users/{uid}/friends/{friendId}        → friendship relation
 *   users/{uid}/friendRequests/{id}       → received friend requests
 */

import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  limit,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { getApps, getApp } from 'firebase/app'
import { getCurrentUser } from './firebase.js'
import { getState, setState } from '../stores/state.js'
import { t } from '../i18n/index.js'

// ==================== HELPERS ====================

function getDb() {
  return getApps().length > 0 ? getFirestore(getApp()) : null
}

// Active subscriptions
let _unsubFriends = null
let _unsubRequests = null

// ==================== SUBSCRIPTIONS ====================

/**
 * Subscribe to friends list and pending requests — syncs to state
 * Call once after auth succeeds
 * @param {string} uid
 */
export function subscribeFriendsList(uid) {
  const db = getDb()
  if (!db || !uid) return

  // Cleanup previous
  _unsubFriends?.()
  _unsubRequests?.()

  const friendsRef = collection(db, 'users', uid, 'friends')
  _unsubFriends = onSnapshot(
    friendsRef,
    (snap) => {
      const friends = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      // Enrich with DM unread counts from conversations cache
      try {
        const state = getState()
        const dmConversations = state.dmConversations || []
        for (const friend of friends) {
          const conv = dmConversations.find(c => c.recipientId === friend.id)
          if (conv) {
            friend.unreadCount = conv.unreadCount || 0
          }
        }
      } catch { /* non-blocking enrichment */ }
      setState({ friends })
    },
    (err) => {
      if (err?.code === 'permission-denied') return
      console.warn('[Friends] Friends snapshot error:', err?.message || err)
    }
  )

  const requestsRef = collection(db, 'users', uid, 'friendRequests')
  _unsubRequests = onSnapshot(
    requestsRef,
    (snap) => {
      const friendRequests = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setState({ friendRequests })
    },
    (err) => {
      if (err?.code === 'permission-denied') return
      console.warn('[Friends] Requests snapshot error:', err?.message || err)
    }
  )
}

/**
 * Unsubscribe from friend listeners (on logout)
 */
export function unsubscribeFriendsList() {
  _unsubFriends?.()
  _unsubRequests?.()
  _unsubFriends = null
  _unsubRequests = null
  setState({ friends: [], friendRequests: [], friendSearchResults: null })
}

/**
 * Update lastSeen timestamp for current user (call on app start)
 * This allows friends to see "last active X minutes ago"
 */
export async function updatePresence() {
  const db = getDb()
  const user = getCurrentUser()
  if (!db || !user) return
  try {
    const userRef = doc(db, 'users', user.uid)
    await updateDoc(userRef, { lastSeen: serverTimestamp() })
  } catch { /* non-blocking */ }
}

// ==================== SEARCH ====================

/**
 * Search users by username (prefix match)
 * @param {string} searchQuery
 * @returns {Promise<Array>}
 */
export async function searchUsers(searchQuery) {
  const db = getDb()
  if (!db || !searchQuery?.trim()) return []

  const q = searchQuery.trim().toLowerCase()
  const user = getCurrentUser()

  try {
    const usersRef = collection(db, 'users')

    // Try username search first (lowercase)
    const usernameQ = query(
      usersRef,
      where('username', '>=', q),
      where('username', '<=', q + '\uf8ff'),
      limit(10)
    )
    const snap = await getDocs(usernameQ)
    let results = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((u) => u.id !== user?.uid) // exclude self

    if (results.length === 0) {
      // Fallback: displayName search — try exact case first, then capitalized
      const searchTerm = searchQuery.trim()
      const nameQ = query(
        usersRef,
        where('displayName', '>=', searchTerm),
        where('displayName', '<=', searchTerm + '\uf8ff'),
        limit(10)
      )
      const nameSnap = await getDocs(nameQ)
      results = nameSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((u) => u.id !== user?.uid)

      // If still no results and query is lowercase, try capitalized
      if (results.length === 0 && searchTerm === searchTerm.toLowerCase()) {
        const capitalized = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)
        const capQ = query(
          usersRef,
          where('displayName', '>=', capitalized),
          where('displayName', '<=', capitalized + '\uf8ff'),
          limit(10)
        )
        const capSnap = await getDocs(capQ)
        results = capSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((u) => u.id !== user?.uid)
      }
    }

    // Filter out users already in friends list
    const state = getState()
    const friendIds = new Set((state.friends || []).map(f => f.id))
    results = results.filter(u => !friendIds.has(u.id))

    return results
  } catch (error) {
    // Distinguish error types
    if (error?.code === 'failed-precondition') {
      console.error('[Friends] Missing Firestore index for search:', error.message)
    } else {
      console.error('[Friends] Search error:', error)
    }
    return []
  }
}

// ==================== FRIEND REQUESTS ====================

/**
 * Send a friend request to another user
 * @param {string} targetUserId
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function sendFriendRequest(targetUserId) {
  const db = getDb()
  const user = getCurrentUser()
  if (!db || !user) return { success: false, error: 'not_authenticated' }
  if (targetUserId === user.uid) return { success: false, error: 'cannot_add_self' }

  // Guard: max 500 friends
  if ((getState().friends || []).length >= 500) return { success: false, error: 'too_many_friends' }

  try {
    // Check if target has blocked the sender
    const blockedDoc = doc(db, 'users', targetUserId, 'blockedUsers', user.uid)
    try {
      const blockedSnap = await getDoc(blockedDoc)
      if (blockedSnap.exists()) return { success: false, error: 'user_unavailable' }
    } catch { /* blockedUsers may not be readable — skip check silently */ }

    // Check if already friends
    const friendDoc = doc(db, 'users', user.uid, 'friends', targetUserId)
    const friendSnap = await getDoc(friendDoc)
    if (friendSnap.exists()) return { success: false, error: 'already_friends' }

    // Check if request already sent
    const requestDoc = doc(db, 'users', targetUserId, 'friendRequests', user.uid)
    const reqSnap = await getDoc(requestDoc)
    if (reqSnap.exists()) return { success: false, error: 'request_already_sent' }

    // Write request to target's friendRequests subcollection
    await setDoc(requestDoc, {
      id: user.uid,
      fromUserId: user.uid,
      name: user.displayName || t('traveler') || 'Traveler',
      avatar: user.photoURL || 'thumbs-up',
      createdAt: serverTimestamp(),
    })

    return { success: true }
  } catch (error) {
    console.error('[Friends] Send request error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Accept a friend request
 * @param {string} requestId - The sender's userId
 * @returns {Promise<{success: boolean}>}
 */
export async function acceptFriendRequest(requestId) {
  const db = getDb()
  const user = getCurrentUser()
  if (!db || !user) return { success: false, error: 'not_authenticated' }

  try {
    // Guard: max 500 friends to prevent listener overload
    const state = getState()
    if ((state.friends || []).length >= 500) return { success: false, error: 'too_many_friends' }

    const requestRef = doc(db, 'users', user.uid, 'friendRequests', requestId)
    const reqSnap = await getDoc(requestRef)
    if (!reqSnap.exists()) return { success: false, error: 'request_not_found' }

    const reqData = reqSnap.data()
    const batch = writeBatch(db)

    // Add to my friends
    batch.set(doc(db, 'users', user.uid, 'friends', requestId), {
      id: requestId,
      name: reqData.name || t('traveler') || 'Traveler',
      avatar: reqData.avatar || 'thumbs-up',
      online: false,
      addedAt: serverTimestamp(),
    })

    // Add me to their friends
    batch.set(doc(db, 'users', requestId, 'friends', user.uid), {
      id: user.uid,
      name: user.displayName || t('traveler') || 'Traveler',
      avatar: user.photoURL || 'thumbs-up',
      online: false,
      addedAt: serverTimestamp(),
    })

    // Delete the request
    batch.delete(requestRef)

    await batch.commit()

    // Local notification (non-push fallback)
    try {
      const { notifyNewFriend } = await import('./notifications.js')
      notifyNewFriend({ id: requestId, name: reqData.name || '' })
    } catch { /* non-blocking */ }

    return { success: true }
  } catch (error) {
    console.error('[Friends] Accept request error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Decline a friend request
 * @param {string} requestId - The sender's userId
 * @returns {Promise<{success: boolean}>}
 */
export async function declineFriendRequest(requestId) {
  const db = getDb()
  const user = getCurrentUser()
  if (!db || !user) return { success: false, error: 'not_authenticated' }

  try {
    const requestRef = doc(db, 'users', user.uid, 'friendRequests', requestId)
    await deleteDoc(requestRef)
    return { success: true }
  } catch (error) {
    console.error('[Friends] Decline request error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Remove a friend (both sides)
 * @param {string} friendId
 * @returns {Promise<{success: boolean}>}
 */
export async function removeFriend(friendId) {
  const db = getDb()
  const user = getCurrentUser()
  if (!db || !user) return { success: false, error: 'not_authenticated' }

  try {
    // Delete from both sides in a batch
    const batch = writeBatch(db)
    batch.delete(doc(db, 'users', user.uid, 'friends', friendId))
    batch.delete(doc(db, 'users', friendId, 'friends', user.uid))
    await batch.commit()
    return { success: true }
  } catch (error) {
    // If batch fails (e.g. permissions), try at least removing from our side
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'friends', friendId))
      console.warn('[Friends] Removed from our side only — other side may remain:', error.message)
      return { success: true }
    } catch (fallbackError) {
      console.error('[Friends] Remove friend error:', fallbackError)
      return { success: false, error: fallbackError.message }
    }
  }
}

/**
 * Compute the number of mutual friends between current user and another user.
 * Reads the other user's friends list and intersects with ours (from state).
 * @param {string} otherUserId
 * @returns {Promise<number>}
 */
export async function getMutualFriendsCount(otherUserId) {
  const db = getDb()
  const user = getCurrentUser()
  if (!db || !user) return 0

  try {
    const myFriends = new Set((getState().friends || []).map(f => f.id))
    if (myFriends.size === 0) return 0

    // Read other user's friends list
    const otherFriendsRef = collection(db, 'users', otherUserId, 'friends')
    const snap = await getDocs(otherFriendsRef)
    let count = 0
    for (const d of snap.docs) {
      if (myFriends.has(d.id) && d.id !== user.uid) count++
    }
    return count
  } catch {
    return 0
  }
}

export default {
  updatePresence,
  getMutualFriendsCount,
  subscribeFriendsList,
  unsubscribeFriendsList,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
}
