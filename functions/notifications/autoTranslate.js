/**
 * Auto-translate spot descriptions to FR/EN/ES/DE
 * Uses Google Cloud Translation API (free tier: 500k chars/month)
 * Triggers when a spot is created — stores translations in spot document.
 */

const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { getFirestore } = require('firebase-admin/firestore')
const https = require('https')

const TARGET_LANGS = ['fr', 'en', 'es', 'de']

/**
 * Detect language and translate text via Google Cloud Translation API
 */
function translateText(text, targetLang, projectId) {
  return new Promise((resolve) => {
    if (!text || text.length < 3) return resolve(null)

    const body = JSON.stringify({
      q: text,
      target: targetLang,
      format: 'text',
    })

    // Use the Translation API v2 with API key from default credentials
    const options = {
      hostname: 'translation.googleapis.com',
      path: `/language/translate/v2?key=`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }

    // Use service account auth instead of API key
    const { GoogleAuth } = require('google-auth-library')
    const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-translation'] })

    auth.getAccessToken().then(token => {
      const req = https.request({
        hostname: 'translation.googleapis.com',
        path: '/language/translate/v2',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
          try {
            const result = JSON.parse(data)
            const translated = result?.data?.translations?.[0]?.translatedText
            resolve(translated || null)
          } catch {
            resolve(null)
          }
        })
      })
      req.on('error', () => resolve(null))
      req.write(body)
      req.end()
    }).catch(() => resolve(null))
  })
}

exports.autoTranslateSpot = onDocumentCreated('spots/{spotId}', async (event) => {
  const spot = event.data?.data()
  if (!spot) return null

  const description = spot.description || ''
  const tips = spot.tips || ''
  const name = spot.name || ''

  // Skip if nothing to translate
  if (!description && !tips) return null

  const db = getFirestore()
  const translations = {}

  for (const lang of TARGET_LANGS) {
    const t = {}
    if (description) {
      const translated = await translateText(description, lang)
      if (translated && translated !== description) t.description = translated
    }
    if (tips) {
      const translated = await translateText(tips, lang)
      if (translated && translated !== tips) t.tips = translated
    }
    if (Object.keys(t).length > 0) translations[lang] = t
  }

  if (Object.keys(translations).length > 0) {
    await db.doc(`spots/${event.params.spotId}`).update({ translations })
    console.log(`[Translate] Spot ${event.params.spotId}: translated to ${Object.keys(translations).join(', ')}`)
  }

  return null
})
