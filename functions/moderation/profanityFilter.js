/**
 * Server-side profanity filter
 * Runs on Firestore writes — impossible to bypass from client.
 * If profanity detected: deletes the document + notifies admin via Telegram.
 */

const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { getFirestore } = require('firebase-admin/firestore')
const { defineString } = require('firebase-functions/params')
const https = require('https')
const { isIgnoredAccount } = require('../config/ignoredAccounts')

const TELEGRAM_BOT_TOKEN = defineString('TELEGRAM_BOT_TOKEN', { default: '' })
const TELEGRAM_CHAT_ID = defineString('TELEGRAM_CHAT_ID', { default: '' })

const PROFANITY_LIST = [
  'fuck', 'shit', 'bitch', 'dick', 'cock', 'pussy', 'nigger', 'faggot',
  'merde', 'putain', 'connard', 'connasse', 'salope', 'enculer', 'nique',
  'puta', 'mierda', 'coño', 'joder', 'cabron',
  'scheiße', 'scheisse', 'arschloch', 'hurensohn', 'fotze', 'wichser',
]

function containsProfanity(text) {
  if (!text) return false
  const lower = text.toLowerCase().replace(/[._\-\s]/g, '')
  return PROFANITY_LIST.some(w => lower.includes(w))
}

function checkFields(data, fields) {
  for (const field of fields) {
    if (containsProfanity(data[field])) return field
  }
  return null
}

async function notifyAdmin(type, field, text, userId) {
  const botToken = TELEGRAM_BOT_TOKEN.value()
  const chatId = TELEGRAM_CHAT_ID.value()
  if (!botToken || !chatId) return

  const msg = [
    `*Profanité détectée (serveur)*`,
    ``,
    `Type : ${type}`,
    `Champ : ${field}`,
    `Contenu : ${(text || '').slice(0, 100)}`,
    `User : \`${userId || '?'}\``,
    ``,
    `Document supprimé automatiquement.`,
  ].join('\n')

  const data = JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' })
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${botToken}/sendMessage`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    }, () => resolve())
    req.on('error', () => resolve())
    req.write(data)
    req.end()
  })
}

// Check new spots
exports.checkSpotProfanity = onDocumentCreated('spots/{spotId}', async (event) => {
  const spot = event.data?.data()
  if (!spot) return null
  // Skip Telegram alert for ignored accounts (still delete if profanity found)
  const skipTelegram = isIgnoredAccount(spot.creatorEmail)

  const badField = checkFields(spot, ['name', 'description', 'tips'])
  if (!badField) return null

  console.log(`[Moderation] Profanity in spot ${event.params.spotId} field ${badField}`)
  await getFirestore().doc(`spots/${event.params.spotId}`).delete()
  if (!skipTelegram) await notifyAdmin('spot', badField, spot[badField], spot.creatorId)
  return null
})

// Check new reviews
exports.checkReviewProfanity = onDocumentCreated('spots/{spotId}/reviews/{reviewId}', async (event) => {
  const review = event.data?.data()
  if (!review) return null

  const badField = checkFields(review, ['text', 'comment'])
  if (!badField) return null

  console.log(`[Moderation] Profanity in review ${event.params.reviewId}`)
  await getFirestore().doc(`spots/${event.params.spotId}/reviews/${event.params.reviewId}`).delete()
  if (!isIgnoredAccount(review.userEmail)) await notifyAdmin('review', badField, review[badField], review.userId)
  return null
})

// Check new DM messages
exports.checkMessageProfanity = onDocumentCreated('directMessages/{convId}/messages/{msgId}', async (event) => {
  const msg = event.data?.data()
  if (!msg) return null

  if (!containsProfanity(msg.text)) return null

  console.log(`[Moderation] Profanity in DM ${event.params.msgId}`)
  await getFirestore().doc(`directMessages/${event.params.convId}/messages/${event.params.msgId}`).delete()
  if (!isIgnoredAccount(msg.senderEmail)) await notifyAdmin('message', 'text', msg.text, msg.senderId)
  return null
})
