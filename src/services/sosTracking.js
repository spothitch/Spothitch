/**
 * SOS Real-time Location Tracking Service
 * Share your location in real-time with emergency contacts via Firestore.
 * Creates a sosAlerts document → triggers Cloud Function push to guardians.
 */

import { getState, setState } from '../stores/state.js'
import { showToast } from './notifications.js'
import { t } from '../i18n/index.js'
import { icon } from '../utils/icons.js'

// Tracking configuration
const TRACKING_CONFIG = {
  updateInterval: 10000, // 10 seconds
  accuracyThreshold: 100, // meters
  maxAge: 30000, // 30 seconds
  timeout: 15000, // 15 seconds
}

// Store references
let watchId = null
let trackingSessionId = null
let lastPosition = null
let trackingListeners = []

/**
 * Start real-time SOS tracking
 * @param {Object} options - Tracking options
 * @returns {Promise<string|null>} Session ID
 */
export async function startSOSTracking(options = {}) {
  if (!navigator.geolocation) {
    showToast(t('gpsNotAvailable') || 'GPS non disponible', 'error')
    return null
  }

  // Generate unique session ID with 128-bit entropy
  const randomBytes = crypto.getRandomValues(new Uint8Array(16))
  const hex = Array.from(randomBytes, b => b.toString(16).padStart(2, '0')).join('')
  trackingSessionId = `sos_${hex}`

  const state = getState()

  // Create tracking session
  const session = {
    id: trackingSessionId,
    startTime: new Date().toISOString(),
    userId: state.user?.uid || 'anonymous',
    userName: state.username || (t('user') || 'Utilisateur'),
    userAvatar: state.avatar || 'thumbs-up',
    status: 'active',
    reason: options.reason || (t('sosActivated') || 'SOS activated'),
    positions: [],
    contacts: options.contacts || state.emergencyContacts || [],
  }

  // Save session to state
  setState({
    sosActive: true,
    sosSession: session,
    sosTrackingId: trackingSessionId,
  })

  // Start watching position
  watchId = navigator.geolocation.watchPosition(
    (position) => handlePositionUpdate(position, session),
    handlePositionError,
    {
      enableHighAccuracy: true,
      maximumAge: TRACKING_CONFIG.maxAge,
      timeout: TRACKING_CONFIG.timeout,
    }
  )

  // Create Firestore SOS alert document → triggers Cloud Function push
  await createSOSTrackingDocument(session)

  // Also offer native share
  notifyContacts(session)

  showToast(t('sosLocationSharingActive') || 'SOS: position sharing active', 'warning')

  return trackingSessionId
}

/**
 * Stop SOS tracking
 */
export async function stopSOSTracking() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId)
    watchId = null
  }

  // Delete Firestore tracking document
  await deleteSOSTrackingDocument()

  setState({
    sosActive: false,
    sosSession: null,
    sosTrackingId: null,
  })

  trackingSessionId = null
  lastPosition = null

  showToast(t('sosSharingStopped') || 'SOS stopped. You are safe.', 'success')
}

/**
 * Create SOS tracking document in Firestore for real-time sharing
 */
async function createSOSTrackingDocument(session) {
  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return

    // Write to sosTracking/{userId} (readable by guardians)
    const trackingRef = doc(db, 'sosTracking', user.uid)
    await setDoc(trackingRef, {
      userId: user.uid,
      userName: session.userName,
      sessionId: session.id,
      status: 'active',
      reason: session.reason,
      positions: [],
      lastPosition: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    // Also create sosAlerts document to trigger Cloud Function push to guardians
    const { collection, addDoc } = await import('firebase/firestore')
    const friends = getState().friends || []
    const guardianIds = friends.map(f => f.id).filter(Boolean)

    if (guardianIds.length > 0) {
      await addDoc(collection(db, 'sosAlerts'), {
        userId: user.uid,
        userName: session.userName,
        guardianIds,
        position: null, // Will be updated with first GPS fix
        type: 'emergency',
        createdAt: serverTimestamp(),
      })
    }
  } catch (err) {
    console.error('[SOS] Failed to create Firestore tracking document:', err.message)
  }
}

/**
 * Update position in Firestore (called on each GPS update)
 */
async function updateSOSPositionFirestore(positionData) {
  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return

    const trackingRef = doc(db, 'sosTracking', user.uid)
    await updateDoc(trackingRef, {
      lastPosition: {
        lat: positionData.lat,
        lng: positionData.lng,
        accuracy: positionData.accuracy || null,
        timestamp: positionData.timestamp,
      },
      updatedAt: serverTimestamp(),
    })
  } catch {
    // Non-blocking — position still stored locally
  }
}

/**
 * Delete SOS tracking document on stop
 */
async function deleteSOSTrackingDocument() {
  try {
    const { db, getCurrentUser } = await import('./firebase.js')
    const { doc, deleteDoc } = await import('firebase/firestore')
    const user = getCurrentUser()
    if (!user || !db) return

    await deleteDoc(doc(db, 'sosTracking', user.uid))
  } catch {
    // Non-blocking
  }
}

/**
 * Handle position update
 */
function handlePositionUpdate(position, session) {
  const { latitude, longitude, accuracy, altitude, speed, heading } = position.coords

  const positionData = {
    lat: latitude,
    lng: longitude,
    accuracy,
    altitude,
    speed,
    heading,
    timestamp: new Date().toISOString(),
  }

  lastPosition = positionData

  // Add to session history
  if (session) {
    session.positions.push(positionData)

    // Keep only last 100 positions
    if (session.positions.length > 100) {
      session.positions = session.positions.slice(-100)
    }

    setState({ sosSession: { ...session } })
  }

  // Notify listeners
  trackingListeners.forEach(listener => {
    try {
      listener(positionData)
    } catch (e) {
      console.error('Tracking listener error:', e)
    }
  })

  // Sync to Firestore for real-time sharing with guardians
  updateSOSPositionFirestore(positionData)
}

/**
 * Handle position error
 */
function handlePositionError(error) {
  console.error('Position error:', error)

  switch (error.code) {
    case error.PERMISSION_DENIED:
      showToast(t('gpsAccessDenied') || 'GPS access denied', 'error')
      stopSOSTracking()
      break
    case error.POSITION_UNAVAILABLE:
      showToast(t('positionUnavailable') || 'Position unavailable', 'warning')
      break
    case error.TIMEOUT:
      showToast(t('gpsTimeout') || 'GPS timeout', 'warning')
      break
  }
}

/**
 * Notify emergency contacts via native share API
 */
function notifyContacts(session) {
  const contacts = session.contacts || []

  if (contacts.length === 0) {
    showToast(t('noEmergencyContacts') || 'No emergency contacts configured', 'warning')
    return
  }

  // Generate share URL
  const baseUrl = window.location.origin + window.location.pathname
  const shareUrl = `${baseUrl}?sos=${session.id}`

  // Offer to share via native share API
  if (navigator.share) {
    navigator.share({
      title: t('sosShareTitle') || 'SOS SpotHitch',
      text: (t('sosShareText') || '{name} needs help. Track position:').replace('{name}', session.userName),
      url: shareUrl,
    }).catch(() => {})
  }
}

/**
 * Get current tracking position
 */
export function getCurrentPosition() {
  return lastPosition
}

/**
 * Add tracking listener
 */
export function addTrackingListener(listener) {
  trackingListeners.push(listener)
  return () => {
    trackingListeners = trackingListeners.filter(l => l !== listener)
  }
}

/**
 * Check if tracking is active
 */
export function isTrackingActive() {
  return watchId !== null
}

/**
 * Get tracking session info
 */
export function getTrackingSession() {
  return getState().sosSession
}

/**
 * Render SOS tracking status widget
 */
export function renderSOSTrackingWidget(state) {
  if (!state.sosActive || !state.sosSession) return ''

  const session = state.sosSession
  const lastPos = session.positions[session.positions.length - 1]
  const duration = session.startTime
    ? Math.floor((Date.now() - new Date(session.startTime).getTime()) / 1000)
    : 0

  return `
    <div class="fixed top-20 left-4 right-4 z-50 bg-red-600 rounded-xl p-4 shadow-2xl animate-pulse">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          ${icon('siren', 'w-6 h-6 text-white')}
        </div>
        <div class="flex-1">
          <div class="font-bold text-white">${t('sosActive') || 'SOS Active'}</div>
          <div class="text-white/80 text-sm">
            ${t('positionShared') || 'Position shared'} · ${formatDuration(duration)}
          </div>
          ${lastPos ? `
            <div class="text-white/60 text-xs mt-1">
              ${icon('map-pin', 'w-3 h-3 inline mr-1')}
              ${lastPos.lat.toFixed(5)}, ${lastPos.lng.toFixed(5)}
              ${lastPos.accuracy ? `(±${Math.round(lastPos.accuracy)}m)` : ''}
            </div>
          ` : ''}
        </div>
        <button
          onclick="stopSOSTracking()"
          class="px-4 py-2 rounded-xl bg-white text-red-600 font-bold text-sm"
        >
          ${t('iAmSafe') || 'I am safe'}
        </button>
      </div>

      <div class="flex gap-2 mt-3">
        <button
          onclick="shareSOSLink()"
          class="flex-1 py-2 rounded-xl bg-white/20 text-white text-sm font-medium"
        >
          ${icon('share-2', 'w-4 h-4 inline mr-1')}
          ${t('shareLink') || 'Share link'}
        </button>
        <button
          onclick="callEmergency()"
          class="flex-1 py-2 rounded-xl bg-white text-red-600 text-sm font-bold"
        >
          ${icon('phone', 'w-4 h-4 inline mr-1')}
          112
        </button>
      </div>
    </div>
  `
}

/**
 * Format duration in human readable format
 */
function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}min`
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}min`
}

// Global handlers
window.startSOSTracking = startSOSTracking
window.stopSOSTracking = stopSOSTracking
window.shareSOSLink = () => {
  const session = getState().sosSession
  if (session) {
    const baseUrl = window.location.origin + window.location.pathname
    const url = `${baseUrl}?sos=${session.id}`
    if (navigator.share) {
      navigator.share({
        title: t('sosShareTitle') || 'SOS SpotHitch',
        text: t('sosShareFollowText') || 'Track my position in real-time:',
        url,
      })
    } else {
      navigator.clipboard?.writeText(url).catch(() => {})
      showToast(t('linkCopied') || 'Link copied!', 'success')
    }
  }
}
window.callEmergency = () => {
  window.location.href = 'tel:112'
}

export default {
  startSOSTracking,
  stopSOSTracking,
  getCurrentPosition,
  addTrackingListener,
  isTrackingActive,
  getTrackingSession,
  renderSOSTrackingWidget,
}
