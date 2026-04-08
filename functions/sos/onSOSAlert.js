/**
 * Cloud Function: onSOSAlert
 * Triggers when a user creates an SOS alert document in Firestore.
 * Sends IMMEDIATE push notification to all guardians with position.
 *
 * The client writes to: sosAlerts/{alertId}
 * Document contains: userId, userName, guardianIds[], position, type, timestamp
 */

const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { getFirestore } = require('firebase-admin/firestore')
const { getMessaging } = require('firebase-admin/messaging')

/**
 * Send FCM push with retry (max 3 attempts, exponential backoff).
 * For SOS alerts, reliability is critical — a single failure could mean
 * a guardian never receives the alert.
 */
async function sendWithRetry(messaging, message, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await messaging.send(message)
      return { success: true }
    } catch (err) {
      // Stale tokens — don't retry, just report
      if (
        err.code === 'messaging/invalid-registration-token' ||
        err.code === 'messaging/registration-token-not-registered'
      ) {
        return { success: false, stale: true }
      }
      // Last attempt — give up
      if (attempt === maxRetries - 1) {
        console.error(`[SOS] Push failed after ${maxRetries} attempts:`, err.message)
        return { success: false, stale: false }
      }
      // Wait before retry: 500ms, 1500ms, 3500ms
      await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempt)))
    }
  }
  return { success: false, stale: false }
}

exports.onSOSAlert = onDocumentCreated(
  'sosAlerts/{alertId}',
  async (event) => {
    const alert = event.data?.data()
    if (!alert) return null

    const { userId, userName, guardianIds, position, type, licensePlate, customMessage } = alert

    if (!guardianIds || guardianIds.length === 0) {
      console.log(`[SOS Alert] No guardians for user ${userId}`)
      return null
    }

    const db = getFirestore()
    const messaging = getMessaging()

    // Build notification with basic i18n (EN default)
    const name = userName || 'A traveler'
    let title, body
    if (type === 'emergency') {
      title = `SOS from ${name}!`
      body = 'Emergency alert. Position shared in real-time.'
    } else if (type === 'silent') {
      title = `Silent alert from ${name}`
      body = 'Position shared. Check if they are OK.'
    } else {
      title = `${name} needs help`
      body = 'Alert triggered with position.'
    }
    if (licensePlate) {
      body += ` ${licensePlate}.`
    }
    if (customMessage) {
      body += ` ${customMessage}`
    }

    // Send push to each guardian
    for (const guardianId of guardianIds) {
      const tokensSnap = await db
        .collection('users')
        .doc(guardianId)
        .collection('fcmTokens')
        .get()

      if (tokensSnap.empty) continue

      const tokens = tokensSnap.docs.map(d => d.data().token).filter(Boolean)
      const staleTokens = []

      await Promise.all(
        tokens.map(async (token) => {
          const result = await sendWithRetry(messaging, {
            token,
            notification: { title, body },
            data: {
              type: 'sos_alert',
              alertType: type || 'unknown',
              voyagerId: userId || '',
              voyagerName: userName || '',
              lat: String(position?.lat || ''),
              lng: String(position?.lng || ''),
            },
            webpush: {
              fcmOptions: { link: 'https://spothitch.com' },
              notification: {
                icon: 'https://spothitch.com/icon-192.png',
                badge: 'https://spothitch.com/icon-72.png',
                tag: `sos-emergency-${userId}`,
                requireInteraction: true,
                vibrate: [300, 100, 300, 100, 300, 100, 300],
              },
            },
          })
          if (result.stale) staleTokens.push(token)
        })
      )

      // Clean stale tokens
      if (staleTokens.length > 0) {
        try {
          const batch = db.batch()
          for (const doc of tokensSnap.docs) {
            if (staleTokens.includes(doc.data().token)) batch.delete(doc.ref)
          }
          await batch.commit()
        } catch (e) {
          console.warn('[SOS] Failed to clean stale tokens:', e.message)
        }
      }
    }

    console.log(`[SOS Alert] ${type} alert from ${userName} sent to ${guardianIds.length} guardian(s)`)
    return null
  }
)
