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

    // Build notification based on type
    let title, body
    if (type === 'emergency') {
      title = `SOS de ${userName || 'Un voyageur'} !`
      body = 'Alerte d\'urgence. Position partagée en direct.'
    } else if (type === 'silent') {
      title = `Alerte silencieuse de ${userName || 'Un voyageur'}`
      body = 'Position partagée. Vérifiez que tout va bien.'
    } else {
      title = `${userName || 'Un voyageur'} a besoin d'aide`
      body = 'Alerte déclenchée avec position.'
    }

    // Append license plate and custom message if available
    if (licensePlate) {
      body += ` Plaque: ${licensePlate}.`
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
          try {
            await messaging.send({
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
          } catch (err) {
            if (
              err.code === 'messaging/invalid-registration-token' ||
              err.code === 'messaging/registration-token-not-registered'
            ) {
              staleTokens.push(token)
            }
          }
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
