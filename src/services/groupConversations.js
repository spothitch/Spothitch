/**
 * Group Conversations Service (Firebase)
 *
 * Collections :
 *   groupConversations/{groupId}
 *     name, icon, creator, members (uid[]), memberProfiles, lastMessage, updatedAt, createdAt
 *   groupConversations/{groupId}/messages/{id}
 *     text, senderId, senderName, senderAvatar, createdAt, type
 */

import { getApp, getApps } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { getState, setState } from '../stores/state.js'
import { t } from '../i18n/index.js'

// --- DB helper ---
function getDb() {
  try {
    const apps = getApps()
    if (!apps.length) return null
    return getFirestore(getApp())
  } catch {
    return null
  }
}

function getCurrentUser() {
  return getState().user || null
}

// --- In-memory cache ---
const groupMessagesCache = new Map() // groupId → messages[]
const _activeGroupSubs = new Map()   // groupId → unsubscribe fn
let _unsubAllGroups = null

// --- Getters (sync) ---

export function getGroupConversationMessages(groupId) {
  return groupMessagesCache.get(groupId) || []
}

export function getGroupConversationsList() {
  return getState().groupConversations || []
}

// --- Create ---

export async function createGroupConversation(name, memberIds, icon = '👥') {
  const db = getDb()
  const user = getCurrentUser()
  if (!db || !user) return { success: false, error: 'not_authenticated' }
  if (!name?.trim()) return { success: false, error: 'empty_name' }
  if (!Array.isArray(memberIds) || memberIds.length < 1) return { success: false, error: 'no_members' }

  const allMembers = [...new Set([user.uid, ...memberIds])]

  const friends = getState().friends || []
  const memberProfiles = {}
  memberProfiles[user.uid] = {
    name: user.displayName || getState().username || t('traveler'),
    avatar: user.photoURL || getState().avatar || '🤙',
  }
  memberIds.forEach(uid => {
    const f = friends.find(fr => fr.id === uid)
    if (f) memberProfiles[uid] = { name: f.name, avatar: f.avatar || '🤙' }
  })

  try {
    const groupRef = await addDoc(collection(db, 'groupConversations'), {
      name: name.trim(),
      icon,
      creator: user.uid,
      members: allMembers,
      memberProfiles,
      lastMessage: null,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    })
    return { success: true, groupId: groupRef.id }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

// --- Send message ---

export async function sendGroupConversationMessage(groupId, text) {
  const db = getDb()
  const user = getCurrentUser()
  if (!db || !user) return { success: false, error: 'not_authenticated' }
  if (!text?.trim()) return { success: false, error: 'empty_message' }

  const state = getState()
  const senderName = user.displayName || state.username || t('traveler')
  const senderAvatar = user.photoURL || state.avatar || '🤙'

  try {
    await addDoc(collection(db, `groupConversations/${groupId}/messages`), {
      text: text.trim(),
      senderId: user.uid,
      senderName,
      senderAvatar,
      createdAt: serverTimestamp(),
      type: 'text',
    })
    await updateDoc(doc(db, 'groupConversations', groupId), {
      lastMessage: { text: text.trim(), senderName, senderId: user.uid },
      updatedAt: serverTimestamp(),
    })
    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

// --- Subscriptions ---

export function subscribeToGroupConversation(groupId, callback) {
  const db = getDb()
  if (!db) return () => {}

  if (_activeGroupSubs.has(groupId)) _activeGroupSubs.get(groupId)()

  const q = query(
    collection(db, `groupConversations/${groupId}/messages`),
    orderBy('createdAt', 'asc'),
    limit(100)
  )

  const unsub = onSnapshot(q, (snap) => {
    const messages = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }))
    groupMessagesCache.set(groupId, messages)
    callback?.(messages)
    setState({ dmLastUpdated: Date.now() })
  }, () => {})

  _activeGroupSubs.set(groupId, unsub)
  return unsub
}

export function unsubscribeFromGroupConversation(groupId) {
  if (_activeGroupSubs.has(groupId)) {
    _activeGroupSubs.get(groupId)()
    _activeGroupSubs.delete(groupId)
  }
}

export function subscribeToAllGroupConversations(uid) {
  const db = getDb()
  if (!db) return

  if (_unsubAllGroups) { _unsubAllGroups(); _unsubAllGroups = null }

  const q = query(
    collection(db, 'groupConversations'),
    where('members', 'array-contains', uid),
    orderBy('updatedAt', 'desc'),
    limit(20)
  )

  _unsubAllGroups = onSnapshot(q, (snap) => {
    const groups = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      updatedAt: d.data().updatedAt?.toDate?.()?.toISOString() || null,
      createdAt: d.data().createdAt?.toDate?.()?.toISOString() || null,
    }))
    setState({ groupConversations: groups })
  }, () => {})
}

export function unsubscribeFromAllGroupConversations() {
  if (_unsubAllGroups) { _unsubAllGroups(); _unsubAllGroups = null }
  _activeGroupSubs.forEach(u => u())
  _activeGroupSubs.clear()
}

// --- Members ---

export async function addMemberToGroupConversation(groupId, userId) {
  const db = getDb()
  const user = getCurrentUser()
  if (!db || !user) return { success: false, error: 'not_authenticated' }

  const friends = getState().friends || []
  const friend = friends.find(f => f.id === userId)

  const updates = { members: arrayUnion(userId), updatedAt: serverTimestamp() }
  if (friend) updates[`memberProfiles.${userId}`] = { name: friend.name, avatar: friend.avatar || '🤙' }

  try {
    await updateDoc(doc(db, 'groupConversations', groupId), updates)
    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
}

export async function leaveGroupConversation(groupId) {
  const db = getDb()
  const user = getCurrentUser()
  if (!db || !user) return { success: false, error: 'not_authenticated' }

  try {
    await updateDoc(doc(db, 'groupConversations', groupId), {
      members: arrayRemove(user.uid),
      updatedAt: serverTimestamp(),
    })
    const groups = getState().groupConversations || []
    setState({ groupConversations: groups.filter(g => g.id !== groupId) })
    return { success: true }
  } catch (e) {
    return { success: false, error: e.message }
  }
}
