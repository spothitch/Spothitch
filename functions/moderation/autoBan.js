/**
 * Auto-ban: suspend user after 5 reports
 * Auto-hide Telegram alert: notify admin when spot is auto-hidden
 */

const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { getFirestore } = require('firebase-admin/firestore')
const { defineString } = require('firebase-functions/params')
const https = require('https')

const TELEGRAM_BOT_TOKEN = defineString('TELEGRAM_BOT_TOKEN', { default: '' })
const TELEGRAM_CHAT_ID = defineString('TELEGRAM_CHAT_ID', { default: '' })

const BAN_THRESHOLD = 5

function sendTelegram(botToken, chatId, text) {
  if (!botToken || !chatId) return Promise.resolve()
  const data = JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
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

/**
 * When a report is created, check if the target user has reached the ban threshold
 */
exports.checkAutoBan = onDocumentCreated('reports/{reportId}', async (event) => {
  const report = event.data?.data()
  if (!report || report.type !== 'user') return null

  const targetId = report.targetId
  if (!targetId) return null

  const db = getFirestore()

  // Count reports against this user
  const reportsSnap = await db
    .collection('reports')
    .where('targetId', '==', targetId)
    .where('type', '==', 'user')
    .get()

  const reportCount = reportsSnap.size

  if (reportCount >= BAN_THRESHOLD) {
    // Suspend the user
    await db.doc(`users/${targetId}`).update({
      suspended: true,
      suspendedAt: new Date().toISOString(),
      suspendedReason: `auto_ban_${reportCount}_reports`,
    })

    const msg = [
      `*Utilisateur suspendu (auto)*`,
      ``,
      `User : \`${targetId}\``,
      `Signalements : ${reportCount}`,
      `Raison : seuil de ${BAN_THRESHOLD} signalements atteint`,
    ].join('\n')

    await sendTelegram(TELEGRAM_BOT_TOKEN.value(), TELEGRAM_CHAT_ID.value(), msg)
    console.log(`[AutoBan] User ${targetId} suspended after ${reportCount} reports`)
  }

  return null
})

/**
 * When a spot is updated with hidden=true, notify admin via Telegram
 */
exports.onSpotHidden = onDocumentCreated('reports/{reportId}', async (event) => {
  const report = event.data?.data()
  if (!report || report.type !== 'spot') return null

  const spotId = report.targetId
  if (!spotId) return null

  const db = getFirestore()
  const spotSnap = await db.doc(`spots/${spotId}`).get()
  const spot = spotSnap.data()

  if (!spot || !spot.hidden) return null

  const msg = [
    `*Spot auto-masqué*`,
    ``,
    `Spot : ${spot.name || 'Sans nom'}`,
    `ID : \`${spotId}\``,
    `Créé par : ${spot.creator || 'Anonyme'}`,
    `Signalements : ${spot.reports || '?'}`,
    ``,
    `Le spot a été masqué de la carte.`,
  ].join('\n')

  await sendTelegram(TELEGRAM_BOT_TOKEN.value(), TELEGRAM_CHAT_ID.value(), msg)
  console.log(`[Moderation] Spot ${spotId} hidden, admin notified`)
  return null
})
