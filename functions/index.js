/**
 * SpotHitch Cloud Functions
 * Entry point — imports all function modules
 *
 * Structure:
 *   notifications/  → push notifications (DM, spot validated, friend request)
 *   sos/            → SOS server-side timer and alerts
 *   moderation/     → server-side profanity filter, auto-ban
 *   scheduled/      → cleanup old messages, expired tokens
 */

const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

// Initialize Firebase Admin (uses default service account)
initializeApp()

/**
 * BRIQUE 1 — Test function: logs when a new spot is created.
 * This verifies Cloud Functions are correctly connected to Firestore.
 * Will be replaced by real notification logic in Brique 3.
 */
exports.onNewSpot = onDocumentCreated('spots/{spotId}', (event) => {
  const spot = event.data?.data()
  if (!spot) return null

  console.log(`[SpotHitch] New spot created: ${spot.name || 'unnamed'} by ${spot.creator || 'anonymous'} (ID: ${event.params.spotId})`)

  return null
})

// ==================== BRIQUE 2 — Notifications DM ====================
const { onNewDirectMessage } = require('./notifications/onNewMessage')
exports.onNewDirectMessage = onNewDirectMessage

// ==================== BRIQUE 3 — Notifications spot activity ====================
const { onNewValidation, onNewReview } = require('./notifications/onSpotActivity')
exports.onNewValidation = onNewValidation
exports.onNewReview = onNewReview

// ==================== BRIQUE 4 — Notification friend request ====================
const { onFriendRequest } = require('./notifications/onFriendRequest')
exports.onFriendRequest = onFriendRequest

// ==================== FUTURE BRIQUES ====================
// Brique 5: exports.onTripStart = require('./sos/onTripStart')
// Brique 6: exports.onReportCreated = require('./moderation/onReport')
// Brique 7: exports.dailyCleanup = require('./scheduled/cleanup')
