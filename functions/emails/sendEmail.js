/**
 * Email sending via Resend API
 * Simple HTTP-based sender — no SDK dependency needed.
 *
 * Setup:
 *   firebase functions:secrets:set RESEND_API_KEY
 *   (paste the key from resend.com/api-keys)
 */

const https = require('https')
const { defineSecret } = require('firebase-functions/params')

const RESEND_API_KEY = defineSecret('RESEND_API_KEY')

/**
 * Send an email via Resend API
 * @param {object} opts
 * @param {string} opts.to - Recipient email
 * @param {string} opts.subject - Email subject
 * @param {string} opts.html - HTML body
 * @param {string} [opts.from] - Sender (default: SpotHitch <noreply@spothitch.com>)
 * @param {string} [opts.replyTo] - Reply-to address
 * @returns {Promise<{id: string} | null>}
 */
function sendEmail({ to, subject, html, from, replyTo }) {
  const apiKey = RESEND_API_KEY.value()
  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY not set, skipping email')
    return Promise.resolve(null)
  }

  const body = JSON.stringify({
    from: from || 'SpotHitch <noreply@spothitch.com>',
    to: [to],
    subject,
    html,
    reply_to: replyTo || undefined,
  })

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)) } catch { resolve({ id: 'ok' }) }
        } else {
          console.error(`[Email] Resend error ${res.statusCode}:`, data)
          resolve(null)
        }
      })
    })
    req.on('error', (err) => {
      console.error('[Email] Request failed:', err.message)
      resolve(null) // Don't reject — email failure should not crash the function
    })
    req.write(body)
    req.end()
  })
}

module.exports = { sendEmail, RESEND_API_KEY }
