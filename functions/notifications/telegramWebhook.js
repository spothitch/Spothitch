/**
 * Cloud Function: onNewReport → Telegram notification
 * Sends a message to Antoine's Telegram when a spot/user is reported.
 *
 * Setup:
 * 1. Create a Telegram bot via @BotFather → get the token
 * 2. Get your chat ID (message @userinfobot on Telegram)
 * 3. Set Firebase config:
 *    firebase functions:config:set telegram.bot_token="YOUR_TOKEN" telegram.chat_id="YOUR_CHAT_ID" --project spothitch
 * 4. Redeploy functions
 */

const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { defineString } = require('firebase-functions/params')
const https = require('https')
const { isIgnoredAccount } = require('../config/ignoredAccounts')

// Config params (set via Firebase console or CLI)
const TELEGRAM_BOT_TOKEN = defineString('TELEGRAM_BOT_TOKEN', {
  description: 'Telegram Bot API token from @BotFather',
  default: '',
})
const TELEGRAM_CHAT_ID = defineString('TELEGRAM_CHAT_ID', {
  description: 'Telegram chat ID to send notifications to',
  default: '',
})

exports.onNewReport = onDocumentCreated(
  'reports/{reportId}',
  async (event) => {
    const report = event.data?.data()
    if (!report) return null

    const botToken = TELEGRAM_BOT_TOKEN.value()
    const chatId = TELEGRAM_CHAT_ID.value()

    if (!botToken || !chatId) {
      console.log('[Telegram] Bot token or chat ID not configured, skipping')
      return null
    }

    // Skip reports from ignored accounts (tests, admin)
    if (isIgnoredAccount(report.reporterEmail)) {
      console.log(`[Telegram] Skipping report from ignored account: ${report.reporterEmail}`)
      return null
    }

    // Build message
    const type = report.type || 'unknown'
    const reason = report.reason || 'non précisé'
    const reporter = report.reporterName || 'Anonyme'
    const targetId = report.targetId || '?'
    const description = report.description || ''
    const severity = report.severity || 'low'

    const severityIcon = severity === 'critical' ? '🔴' : severity === 'high' ? '🟠' : '🟡'

    const text = [
      `${severityIcon} *Nouveau signalement*`,
      ``,
      `Type : ${type}`,
      `Raison : ${reason}`,
      `Sévérité : ${severity}`,
      `Signalé par : ${reporter}`,
      `Cible : \`${targetId}\``,
      description ? `Description : ${description}` : '',
      ``,
      `[Ouvrir l'admin](https://spothitch.com/?tab=profile&admin=true)`,
    ].filter(Boolean).join('\n')

    // Send to Telegram
    await sendTelegramMessage(botToken, chatId, text)
    console.log(`[Telegram] Report notification sent: ${type} by ${reporter}`)
    return null
  }
)

// Ignored accounts filtering is now handled by ../config/ignoredAccounts.js

/**
 * Telegram alert: new user registered
 */
exports.onNewUser = onDocumentCreated(
  'users/{userId}',
  async (event) => {
    const user = event.data?.data()
    if (!user) return null

    const botToken = TELEGRAM_BOT_TOKEN.value()
    const chatId = TELEGRAM_CHAT_ID.value()
    if (!botToken || !chatId) return null

    // Skip ignored accounts (admin + CI tests)
    if (isIgnoredAccount(user.email)) return null

    const name = user.username || user.displayName || 'Anonyme'
    const text = [
      `*Nouvel utilisateur*`,
      ``,
      `Nom : ${name}`,
      user.email ? `Email : ${user.email}` : '',
      `ID : \`${event.params.userId}\``,
    ].filter(Boolean).join('\n')

    await sendTelegramMessage(botToken, chatId, text)
    console.log(`[Telegram] New user: ${name}`)
    return null
  }
)

/**
 * Telegram alert: new spot created
 */
exports.onSpotCreatedTelegram = onDocumentCreated(
  'spots/{spotId}',
  async (event) => {
    const spot = event.data?.data()
    if (!spot) return null

    const botToken = TELEGRAM_BOT_TOKEN.value()
    const chatId = TELEGRAM_CHAT_ID.value()
    if (!botToken || !chatId) return null

    // Skip spots created by ignored accounts (admin + CI tests)
    if (isIgnoredAccount(spot.creatorEmail)) return null

    const name = spot.name || 'Sans nom'
    const creator = spot.creator || 'Anonyme'
    const city = spot.city || spot.countryName || ''
    const lat = spot.lat || spot.coordinates?.lat || ''
    const lng = spot.lng || spot.coordinates?.lng || ''

    const text = [
      `*Nouveau spot*`,
      ``,
      `Nom : ${name}`,
      city ? `Lieu : ${city}` : '',
      `Créé par : ${creator}`,
      lat ? `Position : ${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}` : '',
      ``,
      `[Voir sur SpotHitch](https://spothitch.com)`,
    ].filter(Boolean).join('\n')

    await sendTelegramMessage(botToken, chatId, text)
    console.log(`[Telegram] New spot: ${name} by ${creator}`)
    return null
  }
)

/**
 * Send a message via Telegram Bot API
 */
function sendTelegramMessage(botToken, chatId, text) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    })

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${botToken}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    }

    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => body += chunk)
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(body))
        } else {
          console.error(`[Telegram] API error ${res.statusCode}: ${body}`)
          resolve(null) // don't throw, best-effort
        }
      })
    })

    req.on('error', (err) => {
      console.error('[Telegram] Request failed:', err.message)
      resolve(null)
    })

    req.write(data)
    req.end()
  })
}
