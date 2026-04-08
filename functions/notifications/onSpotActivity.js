/**
 * Cloud Functions: onNewValidation + onNewReview
 * Sends push notification to spot creator when their spot gets validated or reviewed.
 */

const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { getFirestore } = require('firebase-admin/firestore')
const { getMessaging } = require('firebase-admin/messaging')

/**
 * Send push notification to a user by their UID
 * Shared helper for all spot activity notifications
 */
async function notifyUser(recipientId, notification, data) {
  const db = getFirestore()
  const tokensSnap = await db
    .collection('users')
    .doc(recipientId)
    .collection('fcmTokens')
    .get()

  if (tokensSnap.empty) return

  const messaging = getMessaging()
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
              tag: `spot-${data.spotId || 'activity'}`,
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
      console.warn('[Notif] Failed to clean stale tokens:', e.message)
    }
  }
}

/**
 * When a spot gets a new validation → notify the creator
 */
exports.onNewValidation = onDocumentCreated(
  'spots/{spotId}/validations/{valId}',
  async (event) => {
    const validation = event.data?.data()
    if (!validation) return null

    const db = getFirestore()
    const spotSnap = await db.doc(`spots/${event.params.spotId}`).get()
    const spot = spotSnap.data()
    if (!spot?.creatorId) return null

    // Don't notify if the creator validated their own spot
    if (validation.userId === spot.creatorId) return null

    const validatorName = validation.userName || 'Un voyageur'
    const spotName = spot.name || spot.city || 'ton spot'

    await notifyUser(spot.creatorId, {
      title: `${spotName} validé !`,
      body: `${validatorName} a confirmé que ton spot est toujours bon.`,
    }, {
      type: 'spot_validated',
      spotId: event.params.spotId,
    })

    console.log(`[Notif] Validation: ${validatorName} → ${spot.creatorId} for spot ${event.params.spotId}`)
    return null
  }
)

/**
 * When a spot gets a new review → notify the creator
 */
exports.onNewReview = onDocumentCreated(
  'spots/{spotId}/reviews/{revId}',
  async (event) => {
    const review = event.data?.data()
    if (!review) return null

    const db = getFirestore()
    const spotSnap = await db.doc(`spots/${event.params.spotId}`).get()
    const spot = spotSnap.data()
    if (!spot?.creatorId) return null

    // Don't notify if the creator reviewed their own spot
    if (review.userId === spot.creatorId) return null

    const reviewerName = review.userName || 'Un voyageur'
    const spotName = spot.name || spot.city || 'ton spot'
    const ratingText = review.rating ? ` (${review.rating}/5)` : ''

    await notifyUser(spot.creatorId, {
      title: `Nouvel avis sur ${spotName}${ratingText}`,
      body: review.text?.length > 80 ? review.text.slice(0, 80) + '...' : (review.text || `${reviewerName} a noté ton spot.`),
    }, {
      type: 'spot_reviewed',
      spotId: event.params.spotId,
    })

    console.log(`[Notif] Review: ${reviewerName} → ${spot.creatorId} for spot ${event.params.spotId}`)
    return null
  }
)
