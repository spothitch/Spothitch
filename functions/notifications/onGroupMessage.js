/**
 * Cloud Function: onGroupMessage
 * Sends push notification to all group members (except sender)
 * when a new message is posted in a group conversation.
 * Works for country chats and custom groups.
 */

const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { getFirestore } = require('firebase-admin/firestore')
const { getMessaging } = require('firebase-admin/messaging')

exports.onGroupMessage = onDocumentCreated(
  'groupConversations/{groupId}/messages/{msgId}',
  async (event) => {
    const message = event.data?.data()
    if (!message) return null

    const { senderId, senderName, text } = message
    const groupId = event.params.groupId

    const db = getFirestore()

    // Get group info (name + members)
    const groupSnap = await db.doc(`groupConversations/${groupId}`).get()
    if (!groupSnap.exists) return null

    const group = groupSnap.data()
    const members = group.members || []
    const groupName = group.name || 'Groupe'

    // Notify all members EXCEPT the sender
    const recipients = members.filter(uid => uid !== senderId)
    if (recipients.length === 0) return null

    const messaging = getMessaging()
    const notification = {
      title: groupName,
      body: senderName
        ? `${senderName}: ${text?.length > 80 ? text.slice(0, 80) + '...' : (text || '')}`
        : (text?.length > 100 ? text.slice(0, 100) + '...' : (text || '')),
    }

    const data = {
      type: 'group_message',
      groupId,
      senderId: senderId || '',
      senderName: senderName || '',
    }

    let totalSent = 0

    for (const recipientId of recipients) {
      const tokensSnap = await db
        .collection('users')
        .doc(recipientId)
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
              notification,
              data,
              webpush: {
                fcmOptions: { link: 'https://spothitch.com' },
                notification: {
                  icon: 'https://spothitch.com/icon-192.png',
                  badge: 'https://spothitch.com/icon-72.png',
                  tag: `group-${groupId}`,
                  renotify: true,
                },
              },
            })
            totalSent++
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

    console.log(`[Notif] Group message in ${groupName}: ${senderName} → ${totalSent} notifications sent`)
    return null
  }
)
