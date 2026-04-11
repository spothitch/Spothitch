/**
 * Guardian Watch Service
 * Listens for friends who are in Guardian mode.
 * When a friend has an active sosTimer with your UID in guardianIds,
 * you can see their position and status.
 * Also handles real-time chat between guardian and traveler.
 */

import { getState } from '../stores/state.js'

let _unsubscribe = null
let _activeTimers = []
let _onUpdateCallback = null
const _chatUnsubscribes = new Map() // travelerId → unsubscribe
const _chatMessages = new Map() // travelerId → messages[]
let _onChatCallback = null

/**
 * Start watching for friends in Guardian mode.
 * Listens to sosTimers where guardianIds contains current user's UID.
 * Also auto-subscribes to chat messages for each active timer.
 * @param {Function} onUpdate - callback when timers change
 */
export async function startGuardianWatch(onUpdate) {
  stopGuardianWatch()
  _onUpdateCallback = onUpdate

  const state = getState()
  const uid = state.user?.uid
  if (!uid) return

  try {
    const { collection, query, where, onSnapshot } = await import('firebase/firestore')
    const { db } = await import('./firebase.js')
    if (!db) return

    const q = query(
      collection(db, 'sosTimers'),
      where('guardianIds', 'array-contains', uid),
      where('active', '==', true)
    )

    _unsubscribe = onSnapshot(q, (snapshot) => {
      _activeTimers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to millis
        lastCheckIn: doc.data().lastCheckIn?.toMillis?.() || 0,
        tripStart: doc.data().tripStart?.toMillis?.() || 0,
      }))

      // Auto-subscribe to chat for new timers
      const activeIds = new Set(_activeTimers.map(t => t.id))
      for (const timer of _activeTimers) {
        if (!_chatUnsubscribes.has(timer.id)) {
          _subscribeToTimerChat(timer.id)
        }
      }
      // Cleanup chat subs for removed timers
      for (const [id, unsub] of _chatUnsubscribes) {
        if (!activeIds.has(id)) {
          unsub()
          _chatUnsubscribes.delete(id)
          _chatMessages.delete(id)
        }
      }

      if (_onUpdateCallback) _onUpdateCallback(_activeTimers)
    })
  } catch (err) {
    console.warn('[GuardianWatch] Failed to start:', err.message)
  }
}

/**
 * Subscribe to chat messages for a specific timer (traveler).
 * @param {string} travelerId
 */
async function _subscribeToTimerChat(travelerId) {
  try {
    const { collection, query, orderBy, onSnapshot, limit } = await import('firebase/firestore')
    const { db } = await import('./firebase.js')
    if (!db) return

    const q = query(
      collection(db, 'sosTimers', travelerId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(100),
    )

    const unsub = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const d = doc.data()
        return {
          id: doc.id,
          senderId: d.senderId || '',
          senderName: d.senderName || d.sender || '',
          text: d.text || '',
          type: d.type || 'text',
          photoUrl: d.photoUrl || null,
          createdAt: d.createdAt?.toMillis?.() || Date.now(),
        }
      })
      _chatMessages.set(travelerId, messages)
      if (_onChatCallback) _onChatCallback(travelerId, messages)
      if (_onUpdateCallback) _onUpdateCallback(_activeTimers)
    })

    _chatUnsubscribes.set(travelerId, unsub)
  } catch (err) {
    console.warn('[GuardianWatch] Chat subscribe failed for', travelerId, err.message)
  }
}

/**
 * Set a callback for chat message updates.
 * @param {Function} callback - (travelerId, messages[]) => void
 */
export function onChatUpdate(callback) {
  _onChatCallback = callback
}

/**
 * Get chat messages for a specific traveler.
 * @param {string} travelerId
 * @returns {Array}
 */
export function getChatMessages(travelerId) {
  return _chatMessages.get(travelerId) || []
}

/**
 * Stop watching
 */
export function stopGuardianWatch() {
  if (_unsubscribe) {
    _unsubscribe()
    _unsubscribe = null
  }
  _activeTimers = []
}

/**
 * Get current active timers (friends in Guardian mode)
 * @returns {Array}
 */
export function getActiveGuardianTimers() {
  return _activeTimers
}

/**
 * Get time since last check-in for a timer
 * @param {object} timer
 * @returns {string} e.g. "il y a 8 min"
 */
export function getTimeSinceCheckIn(timer) {
  if (!timer.lastCheckIn) return '?'
  const diffMs = Date.now() - timer.lastCheckIn
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return '< 1 min'
  if (mins < 60) return `${mins} min`
  const hours = Math.floor(mins / 60)
  return `${hours}h${String(mins % 60).padStart(2, '0')}`
}

/**
 * Check if a timer is overdue (check-in missed)
 * @param {object} timer
 * @returns {boolean}
 */
export function isTimerOverdue(timer) {
  if (!timer.lastCheckIn || !timer.checkInIntervalMinutes) return false
  const deadlineMs = timer.lastCheckIn + (timer.checkInIntervalMinutes * 60 * 1000)
  return Date.now() > deadlineMs
}

/**
 * Get trip duration string
 * @param {object} timer
 * @returns {string}
 */
export function getTripDuration(timer) {
  if (!timer.tripStart) return '?'
  const diffMs = Date.now() - timer.tripStart
  const mins = Math.floor(diffMs / 60000)
  if (mins < 60) return `${mins} min`
  const hours = Math.floor(mins / 60)
  return `${hours}h${String(mins % 60).padStart(2, '0')}`
}
