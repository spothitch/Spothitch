/**
 * Cloud Function: onNewDirectMessage
 * Triggers when a new message is created in a DM conversation.
 * Sends a push notification to the recipient.
 */

const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { getFirestore } = require('firebase-admin/firestore')
const { getMessaging } = require('firebase-admin/messaging')

exports.onNewDirectMessage = onDocumentCreated(
  'directMessages/{convId}/messages/{msgId}',
  async (event) => {
    const message = event.data?.data()
    if (!message) return null

    const { senderId, senderName, recipientId, text } = message

    // Don't notify yourself
    if (!recipientId || recipientId === senderId) return null

    const db = getFirestore()

    // Get recipient's FCM tokens
    const tokensSnap = await db
      .collection('users')
      .doc(recipientId)
      .collection('fcmTokens')
      .get()

    if (tokensSnap.empty) {
      console.log(`[Notif] No FCM tokens for user ${recipientId}, skipping`)
      return null
    }

    // Build notification
    const notification = {
      title: senderName || 'Nouveau message',
      body: text?.length > 100 ? text.slice(0, 100) + '...' : (text || ''),
    }

    const data = {
      type: 'new_message',
      conversationId: event.params.convId,
      senderId: senderId || '',
      senderName: senderName || '',
    }

    // Send to all tokens (user may have multiple devices)
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
                tag: `dm-${event.params.convId}`,
                renotify: true,
              },
            },
          })
          console.log(`[Notif] Push sent to ${recipientId} from ${senderName}`)
        } catch (err) {
          // Token expired or invalid — mark for cleanup
          if (
            err.code === 'messaging/invalid-registration-token' ||
            err.code === 'messaging/registration-token-not-registered'
          ) {
            staleTokens.push(token)
          } else {
            console.error(`[Notif] Failed to send to token: ${err.message}`)
          }
        }
      })
    )

    // Clean up stale tokens
    if (staleTokens.length > 0) {
      try {
        const batch = db.batch()
        for (const doc of tokensSnap.docs) {
          if (staleTokens.includes(doc.data().token)) {
            batch.delete(doc.ref)
          }
        }
        await batch.commit()
        console.log(`[Notif] Cleaned ${staleTokens.length} stale FCM tokens for ${recipientId}`)
      } catch (e) {
        console.warn(`[Notif] Failed to clean stale tokens for ${recipientId}:`, e.message)
      }
    }

    return null
  }
)
