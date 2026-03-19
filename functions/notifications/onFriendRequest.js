/**
 * Cloud Function: onFriendRequest
 * Sends push notification when someone sends a friend request.
 */

const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { getFirestore } = require('firebase-admin/firestore')
const { getMessaging } = require('firebase-admin/messaging')

exports.onFriendRequest = onDocumentCreated(
  'users/{userId}/friendRequests/{requestId}',
  async (event) => {
    const request = event.data?.data()
    if (!request) return null

    const recipientId = event.params.userId
    const senderName = request.fromName || request.fromUsername || 'Un voyageur'

    const db = getFirestore()
    const tokensSnap = await db
      .collection('users')
      .doc(recipientId)
      .collection('fcmTokens')
      .get()

    if (tokensSnap.empty) return null

    const messaging = getMessaging()
    const tokens = tokensSnap.docs.map(d => d.data().token).filter(Boolean)
    const staleTokens = []

    await Promise.all(
      tokens.map(async (token) => {
        try {
          await messaging.send({
            token,
            notification: {
              title: 'Nouvelle demande d\'ami',
              body: `${senderName} veut devenir ton ami sur SpotHitch`,
            },
            data: {
              type: 'friend_request',
              fromId: request.fromUid || '',
              fromName: senderName,
            },
            webpush: {
              fcmOptions: { link: 'https://spothitch.com' },
              notification: {
                icon: 'https://spothitch.com/icons/icon-192x192.png',
                badge: 'https://spothitch.com/icons/badge-72x72.png',
                tag: 'friend-request',
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
      const batch = db.batch()
      for (const doc of tokensSnap.docs) {
        if (staleTokens.includes(doc.data().token)) batch.delete(doc.ref)
      }
      await batch.commit()
    }

    console.log(`[Notif] Friend request: ${senderName} → ${recipientId}`)
    return null
  }
)
