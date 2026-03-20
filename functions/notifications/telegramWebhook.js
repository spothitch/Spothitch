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
