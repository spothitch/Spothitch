/**
 * Cloud Function: checkSOSTimers (scheduled every 5 minutes)
 * Scans all active sosTimers documents.
 * If a timer has expired (lastCheckIn + interval + grace period),
 * sends push notification to all guardians.
 *
 * This runs on the SERVER — even if the voyager's phone is dead.
 */

const { onSchedule } = require('firebase-functions/v2/scheduler')
const { getFirestore } = require('firebase-admin/firestore')
const { getMessaging } = require('firebase-admin/messaging')

const GRACE_MINUTES = 5 // extra time before alerting

exports.checkSOSTimers = onSchedule(
  {
    schedule: 'every 5 minutes',
    timeZone: 'Europe/Paris',
  },
  async () => {
    const db = getFirestore()
    const messaging = getMessaging()
    const now = Date.now()

    // Get all active SOS timers
    const snapshot = await db
      .collection('sosTimers')
      .where('active', '==', true)
      .get()

    if (snapshot.empty) {
      console.log('[SOS Timer] No active timers')
      return
    }

    console.log(`[SOS Timer] Checking ${snapshot.size} active timer(s)`)

    for (const timerDoc of snapshot.docs) {
      const timer = timerDoc.data()
      const lastCheckIn = timer.lastCheckIn?.toMillis?.() || 0
      const intervalMs = (timer.checkInIntervalMinutes || 30) * 60 * 1000
      const graceMs = GRACE_MINUTES * 60 * 1000
      const deadline = lastCheckIn + intervalMs + graceMs

      // Not expired yet
      if (now < deadline) continue

      // Already alerted for this missed check-in
      if (timer.alertSent) continue

      console.log(`[SOS Timer] EXPIRED for user ${timer.userId} (${timer.userName}). Last check-in: ${new Date(lastCheckIn).toISOString()}`)

      // Mark alert as sent (prevent duplicate alerts)
      await timerDoc.ref.update({ alertSent: true })

      // Get guardian IDs
      const guardianIds = timer.guardianIds || []
      if (guardianIds.length === 0) {
        console.log(`[SOS Timer] No guardian IDs for user ${timer.userId}, skipping notification`)
        continue
      }

      // Build notification body with license plate and custom message if available
      let body = `Pas de check-in depuis ${timer.checkInIntervalMinutes + GRACE_MINUTES} min.`
      if (timer.licensePlate) {
        body += ` Plaque: ${timer.licensePlate}.`
      }
      if (timer.customMessage) {
        body += ` ${timer.customMessage}`
      }
      body += ' Dernière position connue disponible.'

      // Send push to each guardian
      for (const guardianId of guardianIds) {
        await sendPushToUser(db, messaging, guardianId, {
          title: `${timer.userName || 'Un voyageur'} n'a pas donné de nouvelles`,
          body,
        }, {
          type: 'sos_timer_expired',
          voyagerId: timer.userId,
          voyagerName: timer.userName || '',
          destination: timer.destination || '',
          licensePlate: timer.licensePlate || '',
        })
      }

      console.log(`[SOS Timer] Alert sent to ${guardianIds.length} guardian(s) for ${timer.userName}`)
    }
  }
)

/**
 * Send push notification to a user by their UID
 */
async function sendPushToUser(db, messaging, userId, notification, data) {
  const tokensSnap = await db
    .collection('users')
    .doc(userId)
    .collection('fcmTokens')
    .get()

  if (tokensSnap.empty) return

  const tokens = tokensSnap.docs.map(d => d.data().token).filter(Boolean)
  const staleTokens = []

  await Promise.all(
    tokens.map(async (token) => {
      try {
        await messaging.send({
          token,
          notification,
          data,
          webpush: {
            fcmOptions: { link: 'https://spothitch.com' },
            notification: {
              icon: 'https://spothitch.com/icon-192.png',
              badge: 'https://spothitch.com/icon-72.png',
              tag: `sos-${data.voyagerId || 'alert'}`,
              requireInteraction: true,
              vibrate: [200, 100, 200, 100, 200],
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
