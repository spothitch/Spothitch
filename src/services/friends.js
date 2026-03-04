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
import { setState } from '../stores/state.js'
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
      setState({ friends })
    },
    (err) => {
      console.error('[Friends] Friends snapshot error:', err)
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
      console.error('[Friends] Requests snapshot error:', err)
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
      // Fallback: displayName search (case-sensitive prefix)
      const nameQ = query(
        usersRef,
        where('displayName', '>=', searchQuery.trim()),
        where('displayName', '<=', searchQuery.trim() + '\uf8ff'),
        limit(10)
      )
      const nameSnap = await getDocs(nameQ)
      results = nameSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((u) => u.id !== user?.uid)
    }

    return results
  } catch (error) {
    console.error('[Friends] Search error:', error)
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

  try {
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
      avatar: user.photoURL || '🤙',
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
    const requestRef = doc(db, 'users', user.uid, 'friendRequests', requestId)
    const reqSnap = await getDoc(requestRef)
    if (!reqSnap.exists()) return { success: false, error: 'request_not_found' }

    const reqData = reqSnap.data()
    const batch = writeBatch(db)

    // Add to my friends
    batch.set(doc(db, 'users', user.uid, 'friends', requestId), {
      id: requestId,
      name: reqData.name || t('traveler') || 'Traveler',
      avatar: reqData.avatar || '🤙',
      online: false,
      addedAt: serverTimestamp(),
    })

    // Add me to their friends
    batch.set(doc(db, 'users', requestId, 'friends', user.uid), {
      id: user.uid,
      name: user.displayName || t('traveler') || 'Traveler',
      avatar: user.photoURL || '🤙',
      online: false,
      addedAt: serverTimestamp(),
    })

    // Delete the request
    batch.delete(requestRef)

    await batch.commit()
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
    const batch = writeBatch(db)
    batch.delete(doc(db, 'users', user.uid, 'friends', friendId))
    batch.delete(doc(db, 'users', friendId, 'friends', user.uid))
    await batch.commit()
    return { success: true }
  } catch (error) {
    console.error('[Friends] Remove friend error:', error)
    return { success: false, error: error.message }
  }
}

export default {
  subscribeFriendsList,
  unsubscribeFriendsList,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
}
