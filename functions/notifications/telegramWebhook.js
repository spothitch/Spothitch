/**
 * Telegram Bot Integration — Notifications + Inline Actions
 *
 * Features:
 *   - Report notifications with action buttons (delete spot, ban user, ignore)
 *   - New spot notifications with action buttons (view, delete)
 *   - New user notifications with milestone alerts (10, 25, 50, 100, 250, 500, 1000)
 *   - Sentry critical error webhook
 *   - Callback query handler for inline button actions
 *
 * Setup:
 *   1. Create a Telegram bot via @BotFather → get the token
 *   2. Get your chat ID (message @userinfobot on Telegram)
 *   3. Set Firebase params:
 *      firebase functions:config:set telegram.bot_token="TOKEN" telegram.chat_id="CHAT_ID"
 *   4. Deploy functions
 *   5. Set webhook: curl "https://api.telegram.org/botTOKEN/setWebhook?url=FUNCTION_URL/telegramCallback"
 */

const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { onRequest } = require('firebase-functions/v2/https')
const { defineString } = require('firebase-functions/params')
const https = require('https')
const { getFirestore, FieldValue } = require('firebase-admin/firestore')
const { isIgnoredAccount } = require('../config/ignoredAccounts')

const TELEGRAM_BOT_TOKEN = defineString('TELEGRAM_BOT_TOKEN', {
  description: 'Telegram Bot API token from @BotFather',
  default: '',
})
const TELEGRAM_CHAT_ID = defineString('TELEGRAM_CHAT_ID', {
  description: 'Telegram chat ID to send notifications to',
  default: '',
})

// ==================== USER MILESTONES ====================
const MILESTONES = [10, 25, 50, 100, 250, 500, 1000]

// ==================== REPORT NOTIFICATION ====================
exports.onNewReport = onDocumentCreated(
  'reports/{reportId}',
  async (event) => {
    const report = event.data?.data()
    if (!report) return null

    const botToken = TELEGRAM_BOT_TOKEN.value()
    const chatId = TELEGRAM_CHAT_ID.value()
    if (!botToken || !chatId) return null
    if (isIgnoredAccount(report.reporterEmail)) return null

    const type = report.type || 'unknown'
    const reason = report.reason || 'non précisé'
    const reporter = report.reporterName || 'Anonyme'
    const targetId = report.targetId || '?'
    const description = report.description || ''
    const severity = report.severity || 'low'
    const reportId = event.params.reportId

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
    ].filter(Boolean).join('\n')

    // Inline action buttons
    const buttons = []
    if (type === 'SPOT' || type === 'spot') {
      buttons.push([
        { text: '🗑 Supprimer le spot', callback_data: `delete_spot:${targetId}:${reportId}` },
      ])
    }
    if (type === 'USER' || type === 'user') {
      buttons.push([
        { text: '⛔ Bannir', callback_data: `ban_user:${targetId}:${reportId}` },
      ])
    }
    buttons.push([
      { text: '✅ Ignorer', callback_data: `ignore_report:${reportId}` },
      { text: '🔗 Admin', url: 'https://spothitch.com/?tab=profile&admin=true' },
    ])

    await sendTelegramMessage(botToken, chatId, text, { reply_markup: { inline_keyboard: buttons } })
    console.log(`[Telegram] Report: ${type} by ${reporter}`)
    return null
  }
)

// ==================== NEW USER + MILESTONES ====================
exports.onNewUser = onDocumentCreated(
  {
    document: 'users/{userId}',
    secrets: ['RESEND_API_KEY'],
  },
  async (event) => {
    const user = event.data?.data()
    if (!user) return null

    if (isIgnoredAccount(user.email)) return null

    const name = user.username || user.displayName || 'Anonyme'
    const uid = event.params.userId

    // ---- Welcome email (Resend) ----
    try {
      const { sendWelcomeEmail } = require('../emails/welcomeEmail')
      const lang = user.lang || user.language || 'en'
      await sendWelcomeEmail(user.email, name, lang)
      console.log(`[Email] Welcome email sent to ${user.email} (${lang})`)
    } catch (e) {
      console.error('[Email] Welcome email failed:', e.message)
    }

    // ---- Telegram notification ----
    const botToken = TELEGRAM_BOT_TOKEN.value()
    const chatId = TELEGRAM_CHAT_ID.value()
    if (!botToken || !chatId) return null

    const text = [
      `👤 *Nouvel utilisateur*`,
      ``,
      `Nom : ${name}`,
      user.email ? `Email : ${user.email}` : '',
      `ID : \`${uid}\``,
    ].filter(Boolean).join('\n')

    const buttons = [[
      { text: '👁 Voir profil', url: `https://spothitch.com/?u=${uid}` },
    ]]

    await sendTelegramMessage(botToken, chatId, text, { reply_markup: { inline_keyboard: buttons } })

    // Check user milestones
    try {
      const db = getFirestore()
      const usersSnap = await db.collection('users').count().get()
      const totalUsers = usersSnap.data().count

      if (MILESTONES.includes(totalUsers)) {
        const milestoneText = [
          `🎉🎉🎉 *${totalUsers} UTILISATEURS !* 🎉🎉🎉`,
          ``,
          `SpotHitch vient d'atteindre ${totalUsers} utilisateurs inscrits.`,
          `Dernier inscrit : ${name}`,
        ].join('\n')

        await sendTelegramMessage(botToken, chatId, milestoneText)
      }
    } catch (e) {
      console.error('[Telegram] Milestone check failed:', e.message)
    }

    console.log(`[Telegram] New user: ${name}`)
    return null
  }
)

// ==================== NEW SPOT ====================
exports.onSpotCreatedTelegram = onDocumentCreated(
  'spots/{spotId}',
  async (event) => {
    const spot = event.data?.data()
    if (!spot) return null

    const botToken = TELEGRAM_BOT_TOKEN.value()
    const chatId = TELEGRAM_CHAT_ID.value()
    if (!botToken || !chatId) return null
    if (isIgnoredAccount(spot.creatorEmail)) return null

    const spotId = event.params.spotId
    const name = spot.name || spot.departureCity || spot.city || 'Sans nom'
    const creator = spot.creator || 'Anonyme'
    const city = spot.city || spot.countryName || ''
    const lat = spot.lat || spot.coordinates?.lat || ''
    const lng = spot.lng || spot.coordinates?.lng || ''

    const text = [
      `📍 *Nouveau spot*`,
      ``,
      `Nom : ${name}`,
      city ? `Lieu : ${city}` : '',
      `Créé par : ${creator}`,
      lat ? `Position : ${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}` : '',
    ].filter(Boolean).join('\n')

    const buttons = [[
      { text: '🗺 Voir sur la carte', url: `https://spothitch.com/?spot=${spotId}` },
      { text: '🗑 Supprimer', callback_data: `delete_spot:${spotId}:none` },
    ]]

    await sendTelegramMessage(botToken, chatId, text, { reply_markup: { inline_keyboard: buttons } })
    console.log(`[Telegram] New spot: ${name} by ${creator}`)
    return null
  }
)

// ==================== SENTRY CRITICAL ERROR WEBHOOK ====================
exports.sentryWebhook = onRequest(
  { cors: true, region: 'europe-west1' },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method not allowed')
      return
    }

    const botToken = TELEGRAM_BOT_TOKEN.value()
    const chatId = TELEGRAM_CHAT_ID.value()
    if (!botToken || !chatId) {
      res.status(200).send('OK (no Telegram config)')
      return
    }

    try {
      const payload = req.body
      // Sentry webhook sends different formats, handle the main ones
      const title = payload.event?.title || payload.message || payload.data?.event?.title || 'Unknown error'
      const url = payload.url || payload.data?.event?.web_url || ''
      const level = payload.event?.level || payload.level || payload.data?.event?.level || 'error'
      const project = payload.project_name || payload.project || ''

      // Only notify on error/fatal (not warning/info)
      if (level !== 'error' && level !== 'fatal') {
        res.status(200).send('OK (not critical)')
        return
      }

      const icon = level === 'fatal' ? '💀' : '🔴'
      const text = [
        `${icon} *Erreur ${level}* ${project ? `(${project})` : ''}`,
        ``,
        `\`${title}\``,
        url ? `[Voir sur Sentry](${url})` : '',
      ].filter(Boolean).join('\n')

      await sendTelegramMessage(botToken, chatId, text)
      res.status(200).send('OK')
    } catch (e) {
      console.error('[Telegram] Sentry webhook error:', e.message)
      res.status(200).send('OK (error logged)')
    }
  }
)

// ==================== CALLBACK QUERY HANDLER ====================
exports.telegramCallback = onRequest(
  { cors: true, region: 'europe-west1' },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method not allowed')
      return
    }

    const botToken = TELEGRAM_BOT_TOKEN.value()
    if (!botToken) {
      res.status(200).send('OK')
      return
    }

    const update = req.body
    const callback = update.callback_query
    if (!callback) {
      res.status(200).send('OK')
      return
    }

    const callbackId = callback.id
    const data = callback.data || ''
    const messageId = callback.message?.message_id
    const chatId = callback.message?.chat?.id

    // Validate callback data format (action:targetId:reportId)
    if (!data || data.length > 200 || !/^[a-z_]+:[a-zA-Z0-9_-]+/.test(data)) {
      res.status(200).send('OK')
      return
    }

    try {
      const db = getFirestore()
      const parts = data.split(':')
      const action = parts[0]
      const targetId = parts[1]
      const reportId = parts[2]
      let responseText = ''

      switch (action) {
        case 'delete_spot': {
          await db.collection('spots').doc(targetId).delete()
          responseText = `🗑 Spot ${targetId} supprimé`
          if (reportId && reportId !== 'none') {
            await db.collection('reports').doc(reportId).update({
              status: 'resolved',
              resolution: 'spot_deleted',
              resolvedAt: FieldValue.serverTimestamp(),
            })
          }
          break
        }
        case 'ban_user': {
          await db.collection('users').doc(targetId).update({
            banned: true,
            bannedAt: FieldValue.serverTimestamp(),
            bannedReason: 'Banned via Telegram moderation',
          })
          responseText = `⛔ Utilisateur ${targetId} banni`
          if (reportId && reportId !== 'none') {
            await db.collection('reports').doc(reportId).update({
              status: 'resolved',
              resolution: 'user_banned',
              resolvedAt: FieldValue.serverTimestamp(),
            })
          }
          break
        }
        case 'ignore_report': {
          const rid = targetId || reportId
          if (rid) {
            await db.collection('reports').doc(rid).update({
              status: 'dismissed',
              resolvedAt: FieldValue.serverTimestamp(),
            })
          }
          responseText = '✅ Signalement ignoré'
          break
        }
        default:
          responseText = '❓ Action inconnue'
      }

      // Answer callback (removes loading spinner on button)
      await answerCallbackQuery(botToken, callbackId, responseText)

      // Edit original message to show result
      if (chatId && messageId) {
        const originalText = callback.message?.text || ''
        const newText = `${originalText}\n\n✅ *Action : ${responseText}*`
        await editMessageText(botToken, chatId, messageId, newText)
      }

      console.log(`[Telegram] Action: ${action} on ${targetId}`)
    } catch (e) {
      console.error('[Telegram] Callback error:', e.message)
      await answerCallbackQuery(botToken, callbackId, `❌ Erreur : ${e.message}`)
    }

    res.status(200).send('OK')
  }
)

// ==================== TELEGRAM API HELPERS ====================

function sendTelegramMessage(botToken, chatId, text, extra = {}) {
  return new Promise((resolve) => {
    const payload = {
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      ...extra,
    }
    telegramApiCall(botToken, 'sendMessage', payload).then(resolve).catch(() => resolve(null))
  })
}

function answerCallbackQuery(botToken, callbackQueryId, text) {
  return telegramApiCall(botToken, 'answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text,
    show_alert: true,
  })
}

function editMessageText(botToken, chatId, messageId, text) {
  return telegramApiCall(botToken, 'editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
  })
}

function telegramApiCall(botToken, method, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload)
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${botToken}/${method}`,
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
          try { resolve(JSON.parse(body)) } catch { resolve(null) }
        } else {
          console.error(`[Telegram] API error ${res.statusCode}: ${body}`)
          resolve(null)
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
