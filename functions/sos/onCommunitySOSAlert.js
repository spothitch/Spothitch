/**
 * Cloud Function: onCommunitySOSAlert
 * Triggers when a user creates a community SOS alert document in Firestore.
 * Finds nearby opted-in users and sends them a push notification
 * with the EXACT position of the person in distress.
 *
 * Collection: communityAlerts/{alertId}
 * Document: { userId, userName, position {lat, lng}, broadcastRadius, genderFilter, type, createdAt }
 *
 * Matching logic:
 *   distance <= min(sender.broadcastRadius, receiver.helpRadius)
 *   if genderFilter === 'women' → only female receivers
 */

const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { getFirestore } = require('firebase-admin/firestore')
const { getMessaging } = require('firebase-admin/messaging')

// Haversine distance in km
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

exports.onCommunitySOSAlert = onDocumentCreated(
  'communityAlerts/{alertId}',
  async (event) => {
    const alert = event.data?.data()
    if (!alert) return null

    const { userId, userName, position, broadcastRadius = 10, genderFilter = 'all', type } = alert

    if (!position?.lat || !position?.lng) {
      console.log('[Community SOS] No position in alert, skipping')
      return null
    }

    const db = getFirestore()
    const messaging = getMessaging()

    // Compute bounding box (broadcastRadius capped at 25km)
    const maxRadius = Math.min(broadcastRadius, 25)
    const latDelta = maxRadius / 111 // 1° lat ≈ 111km

    // Query opted-in users within lat range
    const candidates = await db.collection('userLocations')
      .where('receiveAlerts', '==', true)
      .where('lat', '>=', position.lat - latDelta)
      .where('lat', '<=', position.lat + latDelta)
      .get()

    if (candidates.empty) {
      console.log('[Community SOS] No nearby opted-in users found')
      return null
    }

    // Longitude delta (varies with latitude)
    const lngDelta = maxRadius / (111 * Math.cos(position.lat * Math.PI / 180))

    // Filter candidates by exact distance, lng bounds, gender, help radius
    const nearbyUsers = []
    for (const doc of candidates.docs) {
      const user = doc.data()

      // Skip the sender
      if (doc.id === userId) continue

      // Longitude check
      if (user.lng < position.lng - lngDelta || user.lng > position.lng + lngDelta) continue

      // Exact haversine distance
      const distance = haversineKm(position.lat, position.lng, user.lat, user.lng)

      // Must be within BOTH radii: sender's broadcast AND receiver's help radius
      const userHelpRadius = user.helpRadius || 10
      if (distance > maxRadius || distance > userHelpRadius) continue

      // Gender filter: if sender wants women-only, skip non-female receivers
      if (genderFilter === 'women' && user.gender !== 'female') continue

      nearbyUsers.push({
        userId: user.userId,
        userName: user.userName,
        distance: Math.round(distance * 10) / 10,
      })
    }

    console.log(`[Community SOS] ${nearbyUsers.length} match(es) within ${maxRadius}km of ${userName || userId}`)

    if (nearbyUsers.length === 0) return null

    // Send push notification to each nearby user
    let sentCount = 0
    for (const receiver of nearbyUsers) {
      const tokensSnap = await db
        .collection('users')
        .doc(receiver.userId)
        .collection('fcmTokens')
        .get()

      if (tokensSnap.empty) continue

      const tokens = tokensSnap.docs.map(d => d.data().token).filter(Boolean)
      const staleTokens = []

      const title = type === 'silent'
        ? 'SOS silencieux proche'
        : `SOS ${receiver.distance < 1 ? 'tout près' : `à ${receiver.distance}km`}`

      const body = userName
        ? `${userName} a besoin d'aide. Appuyez pour voir sa position.`
        : 'Un voyageur a besoin d\'aide près de vous.'

      await Promise.all(
        tokens.map(async (token) => {
          try {
            await messaging.send({
              token,
              notification: { title, body },
              data: {
                type: 'community_sos_alert',
                alertId: event.params.alertId,
                voyagerId: userId || '',
                voyagerName: userName || '',
                lat: String(position.lat),
                lng: String(position.lng),
                distance: String(receiver.distance),
                alertType: type || 'emergency',
              },
              webpush: {
                fcmOptions: { link: 'https://spothitch.com' },
                notification: {
                  icon: 'https://spothitch.com/icons/icon-192x192.png',
                  badge: 'https://spothitch.com/icons/badge-72x72.png',
                  tag: `community-sos-${userId}`,
                  requireInteraction: true,
                  vibrate: [300, 100, 300, 100, 300],
                },
              },
            })
            sentCount++
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
        for (const d of tokensSnap.docs) {
          if (staleTokens.includes(d.data().token)) batch.delete(d.ref)
        }
        await batch.commit()
      }
    }

    // Record how many were notified
    try {
      await event.data.ref.update({
        notifiedCount: sentCount,
        processedAt: new Date(),
      })
    } catch { /* non-critical */ }

    console.log(`[Community SOS] Sent ${sentCount} push notification(s) to ${nearbyUsers.length} user(s)`)
    return null
  }
)
