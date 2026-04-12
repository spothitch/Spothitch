/**
 * Direct Messages Service — Firebase
 * 1-to-1 private DM conversations backed by Firestore
 * Falls back to localStorage when not authenticated
 *
 * Firestore schema:
 *   directMessages/{convId}                 → conversation metadata
 *   directMessages/{convId}/messages/{id}   → messages
 *
 *   convId = [uid1, uid2].sort().join('_dm_')
 */

import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
} from 'firebase/firestore'
import { getApps, getApp } from 'firebase/app'
import { getState, setState } from '../stores/state.js'
import { Storage } from '../utils/storage.js'
import { t } from '../i18n/index.js'
import { containsProfanity } from './firebase.js'

// ==================== STORAGE (FALLBACK) ====================

const DM_KEY = 'spothitch_direct_messages'

function getDMStorage() {
  try {
    return Storage.get(DM_KEY) || {}
  } catch {
    return {}
  }
}

function saveDMStorage(data) {
  try {
    Storage.set(DM_KEY, data)
  } catch {
    /* quota */
  }
}

// ==================== HELPERS ====================

function getDb() {
  return getApps().length > 0 ? getFirestore(getApp()) : null
}

function getCurrentUid() {
  return getState().user?.uid || null
}

export function getConversationId(userId1, userId2) {
  return [userId1, userId2].sort().join('_dm_')
}

// ==================== IN-MEMORY CACHE ====================

// convId → messages[]
const messagesCache = new Map()
// List of conversations (sorted by last message)
let conversationsCache = []
// Active per-conversation subscriptions (convId → unsubscribe fn)
const activeSubscriptions = new Map()
// Global conversations list subscription
let _unsubConversations = null

// ==================== SUBSCRIPTIONS ====================

/**
 * Subscribe to all DM conversations for a user (real-time)
 * Updates conversationsCache and triggers re-render
 * @param {string} uid
 */
export function subscribeToAllConversations(uid) {
  const db = getDb()
  if (!db || !uid) return

  _unsubConversations?.()

  const q = query(
    collection(db, 'directMessages'),
    where('participants', 'array-contains', uid),
    orderBy('updatedAt', 'desc'),
    limit(50)
  )

  _unsubConversations = onSnapshot(
    q,
    (snap) => {
      const state = getState()
      const prevUnreadTotal = conversationsCache.reduce((sum, c) => sum + (c.unreadCount || 0), 0)
      conversationsCache = snap.docs.map((d) => {
        const data = d.data()
        const otherId = data.participants?.find((p) => p !== uid) || ''
        const friends = state.friends || []
        const friend = friends.find((f) => f.id === otherId)
        const lastMsg = data.lastMessage || {}
        const unread = data.unread?.[uid] || 0
        const ts = lastMsg.createdAt?.toDate?.()?.toISOString() || lastMsg.createdAt || ''
        return {
          recipientId: otherId,
          recipientName: friend?.name || lastMsg.senderName || t('traveler') || 'Voyageur',
          recipientAvatar: friend?.avatar || lastMsg.senderAvatar || 'thumbs-up',
          lastMessage: lastMsg.text || '',
          lastMessageTime: ts,
          lastMessageSenderId: lastMsg.senderId || '',
          unreadCount: unread,
          online: friend?.online || false,
        }
      })
      // Local notification fallback: if push is not enabled and new unread arrived,
      // show a local notification via notifyNewMessage (avoids duplicates with push)
      const newUnreadTotal = conversationsCache.reduce((sum, c) => sum + (c.unreadCount || 0), 0)
      if (newUnreadTotal > prevUnreadTotal) {
        import('./pushNotifications.js').then(({ isPushEnabled }) => {
          if (!isPushEnabled()) {
            const newest = conversationsCache.find((c) => c.unreadCount > 0 && c.lastMessageSenderId !== uid)
            if (newest) {
              import('./notifications.js').then(({ notifyNewMessage }) => {
                notifyNewMessage({
                  senderId: newest.recipientId,
                  senderName: newest.recipientName,
                  senderAvatar: newest.recipientAvatar,
                  text: newest.lastMessage,
                })
              })
            }
          }
        })
      }
      setState({ dmLastUpdated: Date.now() })
    },
    (err) => {
      // Suppress permission-denied (normal during auth transition) and index errors (auto-resolved)
      if (err?.code === 'permission-denied' || err?.code === 'failed-precondition') return
      console.warn('[DM] Conversations subscription error:', err?.message || err)
    }
  )
}

/**
 * Subscribe to messages in a specific conversation (real-time)
 * @param {string} recipientId
 * @param {Function} callback - called when messages update
 * @returns {Function} unsubscribe
 */
export function subscribeToConversation(recipientId, callback) {
  const db = getDb()
  const uid = getCurrentUid()
  if (!db || !uid) return () => {}

  const convId = getConversationId(uid, recipientId)

  // Cleanup existing subscription for this conv
  activeSubscriptions.get(convId)?.()

  const q = query(
    collection(db, 'directMessages', convId, 'messages'),
    orderBy('createdAt', 'asc'),
    limit(100)
  )

  const unsub = onSnapshot(
    q,
    (snap) => {
      const messages = snap.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || '',
        }
      })
      messagesCache.set(convId, messages)
      callback?.(messages)
    },
    (err) => {
      console.error('[DM] Conversation subscription error:', err)
    }
  )

  activeSubscriptions.set(convId, unsub)
  return unsub
}

/**
 * Unsubscribe from a specific conversation
 * @param {string} recipientId
 */
export function unsubscribeFromConversation(recipientId) {
  const uid = getCurrentUid()
  if (!uid) return
  const convId = getConversationId(uid, recipientId)
  activeSubscriptions.get(convId)?.()
  activeSubscriptions.delete(convId)
}

/**
 * Unsubscribe from everything (on logout)
 */
export function unsubscribeFromAllConversations() {
  _unsubConversations?.()
  _unsubConversations = null
  activeSubscriptions.forEach((unsub) => unsub())
  activeSubscriptions.clear()
  messagesCache.clear()
  conversationsCache = []
}

// ==================== CORE API ====================

/**
 * Send a direct message
 * @param {string} recipientId
 * @param {string} text
 * @param {Object} options - { type, spot, location }
 * @returns {Promise<{success: boolean, message?: Object}>}
 */
export async function sendDirectMessage(recipientId, text, options = {}) {
  if (!recipientId) return { success: false, error: 'no_recipient' }
  if (!text?.trim()) return { success: false, error: 'empty_message' }
  if (text.length > 10000) return { success: false, error: 'message_too_long' }
  if (containsProfanity(text)) return { success: false, error: 'profanity_detected' }

  const state = getState()
  const uid = state.user?.uid

  if (!uid) {
    return sendDMLocalStorage(recipientId, text, options, state)
  }

  const db = getDb()
  if (!db) return { success: false, error: 'no_db' }

  const convId = getConversationId(uid, recipientId)
  const senderName = state.username || state.user?.displayName || t('traveler') || 'Voyageur'
  const senderAvatar = state.avatar || 'thumbs-up'

  const message = {
    text: text.trim(),
    senderId: uid,
    senderName,
    senderAvatar,
    recipientId,
    createdAt: serverTimestamp(),
    type: options.type || 'text',
    read: false,
  }

  if (options.spot) message.spot = options.spot
  if (options.location) message.location = options.location

  try {
    // Add message to subcollection
    await addDoc(collection(db, 'directMessages', convId, 'messages'), message)

    // Create/update conversation metadata using setDoc (merge) + increment
    const convRef = doc(db, 'directMessages', convId)
    await setDoc(
      convRef,
      {
        participants: [uid, recipientId],
        lastMessage: {
          text: text.trim(),
          senderId: uid,
          senderName,
          senderAvatar,
          createdAt: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
    // Increment unread for recipient
    await updateDoc(convRef, {
      [`unread.${recipientId}`]: increment(1),
    })

    return { success: true }
  } catch (error) {
    console.error('[DM] Send error:', error)
    return { success: false, error: error.message }
  }
}

function sendDMLocalStorage(recipientId, text, options, state) {
  const userId = 'local-user'
  const storage = getDMStorage()
  const convId = getConversationId(userId, recipientId)
  if (!storage[convId]) storage[convId] = []

  const message = {
    id: `dm_${Date.now()}_${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`,
    text: text.trim(),
    senderId: userId,
    senderName: state.username || t('traveler') || 'Voyageur',
    senderAvatar: state.avatar || 'thumbs-up',
    recipientId,
    createdAt: new Date().toISOString(),
    read: false,
    type: options.type || 'text',
  }

  if (options.spot) message.spot = options.spot
  if (options.location) message.location = options.location

  storage[convId].push(message)
  if (storage[convId].length > 200) storage[convId] = storage[convId].slice(-200)
  saveDMStorage(storage)

  return { success: true, message }
}

/**
 * Get messages for a conversation (from cache — sync)
 * @param {string} recipientId
 * @returns {Array}
 */
export function getConversationMessages(recipientId) {
  const uid = getCurrentUid()

  if (!uid) {
    const storage = getDMStorage()
    const convId = getConversationId('local-user', recipientId)
    return storage[convId] || []
  }

  const convId = getConversationId(uid, recipientId)
  return messagesCache.get(convId) || []
}

/**
 * Get list of all conversations (from cache — sync)
 * @returns {Array}
 */
export function getConversationsList() {
  const uid = getCurrentUid()

  if (!uid) {
    return getConversationsListLocalStorage()
  }

  return conversationsCache
}

function getConversationsListLocalStorage() {
  const state = getState()
  const userId = 'local-user'
  const storage = getDMStorage()
  const friends = state.friends || []
  const conversations = []

  const friendMap = {}
  friends.forEach((f) => {
    friendMap[f.id] = f
  })

  Object.entries(storage).forEach(([convId, messages]) => {
    if (!messages || messages.length === 0) return
    const parts = convId.split('_dm_')
    const otherId = parts[0] === userId ? parts[1] : parts[0]
    if (!otherId) return
    const friend = friendMap[otherId]
    const lastMsg = messages[messages.length - 1]
    const unread = messages.filter((m) => m.recipientId === userId && !m.read).length
    conversations.push({
      recipientId: otherId,
      recipientName: friend?.name || lastMsg?.senderName || t('traveler') || 'Voyageur',
      recipientAvatar: friend?.avatar || lastMsg?.senderAvatar || 'thumbs-up',
      lastMessage: lastMsg?.text || '',
      lastMessageTime: lastMsg?.createdAt || '',
      lastMessageSenderId: lastMsg?.senderId || '',
      unreadCount: unread,
      online: friend?.online || false,
    })
  })

  conversations.sort((a, b) => {
    if (!a.lastMessageTime) return 1
    if (!b.lastMessageTime) return -1
    return b.lastMessageTime.localeCompare(a.lastMessageTime)
  })

  return conversations
}

/**
 * Mark a conversation as read
 * @param {string} recipientId
 */
export async function markConversationRead(recipientId) {
  const uid = getCurrentUid()

  if (!uid) {
    const storage = getDMStorage()
    const convId = getConversationId('local-user', recipientId)
    if (storage[convId]) {
      storage[convId] = storage[convId].map((msg) =>
        msg.recipientId === 'local-user' && !msg.read ? { ...msg, read: true } : msg
      )
      saveDMStorage(storage)
    }
    return
  }

  const db = getDb()
  if (!db) return

  const convId = getConversationId(uid, recipientId)
  try {
    await updateDoc(doc(db, 'directMessages', convId), { [`unread.${uid}`]: 0 })
  } catch {
    /* conv may not exist yet */
  }
}

/**
 * Get unread count for a conversation
 * @param {string} recipientId
 * @returns {number}
 */
export function getUnreadCount(recipientId) {
  const uid = getCurrentUid()

  if (!uid) {
    const storage = getDMStorage()
    const convId = getConversationId('local-user', recipientId)
    return (storage[convId] || []).filter((m) => m.recipientId === 'local-user' && !m.read).length
  }

  return conversationsCache.find((c) => c.recipientId === recipientId)?.unreadCount || 0
}

/**
 * Get total unread DM count across all conversations
 * @returns {number}
 */
export function getTotalUnreadCount() {
  const uid = getCurrentUid()

  if (!uid) {
    const storage = getDMStorage()
    let total = 0
    Object.values(storage).forEach((msgs) => {
      msgs.forEach((m) => {
        if (m.recipientId === 'local-user' && !m.read) total++
      })
    })
    return total
  }

  return conversationsCache.reduce((sum, c) => sum + (c.unreadCount || 0), 0)
}

/**
 * Delete a conversation (local only — Firebase subcollections require cloud functions to delete)
 * @param {string} recipientId
 * @returns {Promise<{success: boolean}>}
 */
export async function deleteConversation(recipientId) {
  const uid = getCurrentUid()

  if (!uid) {
    const storage = getDMStorage()
    const convId = getConversationId('local-user', recipientId)
    delete storage[convId]
    saveDMStorage(storage)
    return { success: true }
  }

  // For Firebase: remove from local cache + unsubscribe (messages stay in Firestore)
  const convId = getConversationId(uid, recipientId)
  unsubscribeFromConversation(recipientId)
  messagesCache.delete(convId)
  conversationsCache = conversationsCache.filter((c) => c.recipientId !== recipientId)
  setState({ dmLastUpdated: Date.now() })
  return { success: true }
}

/**
 * Share a spot in DM
 * @param {string} recipientId
 * @param {Object} spot
 * @returns {Promise<Object>}
 */
export function shareSpotInDM(recipientId, spot) {
  return sendDirectMessage(recipientId, t('checkThisSpot') || 'Check ce spot !', {
    type: 'spot_share',
    spot: {
      id: spot.id,
      name: spot.name,
      city: spot.city,
      country: spot.country,
      rating: spot.rating,
      lat: spot.lat,
      lng: spot.lng,
    },
  })
}

/**
 * Share position in DM
 * @param {string} recipientId
 * @param {Object} location - { lat, lng, address }
 * @returns {Promise<Object>}
 */
export function sharePositionInDM(recipientId, location) {
  return sendDirectMessage(recipientId, t('hereIsMyPosition') || 'Voici ma position', {
    type: 'location_share',
    location,
  })
}

// ==================== WINDOW HANDLERS ====================

window.openConversation = (recipientId) => {
  markConversationRead(recipientId)
  setState({ activeDMConversation: recipientId, activeTab: 'social' })
  // Set up real-time subscription when opening conversation
  const uid = getCurrentUid()
  if (uid) {
    subscribeToConversation(recipientId, () => {
      setState({ dmLastReceived: Date.now() })
    })
  }
}

window.closeConversation = () => {
  const state = getState()
  if (state.activeDMConversation) {
    unsubscribeFromConversation(state.activeDMConversation)
  }
  setState({ activeDMConversation: null })
}

window.sendDM = async (recipientId) => {
  if (window.sendDM._busy) return
  window.sendDM._busy = true
  if (!window.requireOnline?.()) { window.sendDM._busy = false; return }
  setTimeout(() => { window.sendDM._busy = false }, 1500)
  const input = document.getElementById('dm-input')
  if (!input?.value?.trim()) { window.sendDM._busy = false; return }

  const text = input.value.trim()
  input.value = ''

  const result = await sendDirectMessage(recipientId, text)
  if (result.success) {
    // For localStorage fallback, trigger re-render manually
    if (!getCurrentUid()) {
      setState({ dmLastSent: Date.now() })
    }
    // Scroll to bottom
    setTimeout(() => {
      const chatEl = document.getElementById('dm-messages')
      if (chatEl) chatEl.scrollTop = chatEl.scrollHeight
    }, 50)
    // Nudge push notifications after first message sent
    setTimeout(async () => {
      try {
        const { nudgePushNotifications } = await import('./pushNotifications.js')
        nudgePushNotifications('message')
      } catch { /* optional */ }
    }, 3000)
  }
}

window.shareDMSpot = async (recipientId) => {
  const state = getState()
  if (state.selectedSpot) {
    await shareSpotInDM(recipientId, state.selectedSpot)
    setState({ dmLastSent: Date.now() })
  }
}

window.shareDMPosition = async (recipientId) => {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      await sharePositionInDM(recipientId, {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        address: t('sharedPosition') || 'Position partagée',
      })
      setState({ dmLastSent: Date.now() })
    },
    () => {
      window.showToast?.(t('positionFailed') || 'Impossible de récupérer la position', 'error')
    },
    { enableHighAccuracy: true, timeout: 10000 }
  )
}

// Programmatic DM send (for tests and external callers)
window.sendDirectMessageTo = async (recipientId, text) => {
  const result = await sendDirectMessage(recipientId, text)
  return result
}

// Get conversation with a user (for tests)
window.getConversationWith = async (recipientId) => {
  const msgs = getConversationMessages(recipientId)
  const list = getConversationsList()
  const conv = list.find(c => c.recipientId === recipientId || c.recipientName === recipientId)
  return conv || (msgs.length > 0 ? { messages: msgs } : null)
}

window.deleteDMConversation = async (recipientId) => {
  if (window.confirm(t('confirmDeleteConversation') || 'Supprimer cette conversation ?')) {
    await deleteConversation(recipientId)
    setState({ activeDMConversation: null, dmLastSent: Date.now() })
    window.showToast?.(t('conversationDeleted') || 'Conversation supprimée', 'info')
  }
}

export default {
  sendDirectMessage,
  getConversationMessages,
  getConversationsList,
  markConversationRead,
  getUnreadCount,
  getTotalUnreadCount,
  deleteConversation,
  shareSpotInDM,
  sharePositionInDM,
  subscribeToConversation,
  subscribeToAllConversations,
  unsubscribeFromConversation,
  unsubscribeFromAllConversations,
}
