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

// BRIQUE 1 — onNewSpot test function removed, replaced by onSpotCreatedTelegram

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

// ==================== BRIQUE 5 — SOS Server-side ====================
const { checkSOSTimers } = require('./sos/checkTimers')
exports.checkSOSTimers = checkSOSTimers

const { onSOSAlert } = require('./sos/onSOSAlert')
exports.onSOSAlert = onSOSAlert

// ==================== BRIQUE 6 — Telegram alerts (reports, new users, new spots) ====================
const { onNewReport, onNewUser, onSpotCreatedTelegram } = require('./notifications/telegramWebhook')
exports.onNewReport = onNewReport
exports.onNewUser = onNewUser
exports.onSpotCreatedTelegram = onSpotCreatedTelegram

// ==================== FUTURE BRIQUES ====================
// Brique 7: exports.dailyCleanup = require('./scheduled/cleanup')
