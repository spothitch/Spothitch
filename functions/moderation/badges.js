/**
 * Server-side badge attribution
 * Awards badges based on user activity — cannot be cheated.
 * Triggers when spots/reviews/validations are created.
 */

const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { getFirestore } = require('firebase-admin/firestore')

const BADGES = {
  first_spot: { id: 'first_spot', threshold: 1, field: 'spotsCount', name: 'Premier Spot' },
  explorer_5: { id: 'explorer_5', threshold: 5, field: 'spotsCount', name: 'Explorateur' },
  cartographer_20: { id: 'cartographer_20', threshold: 20, field: 'spotsCount', name: 'Cartographe' },
  legend_50: { id: 'legend_50', threshold: 50, field: 'spotsCount', name: 'Légende' },
  first_review: { id: 'first_review', threshold: 1, field: 'reviewsCount', name: 'Premier Avis' },
  critic_10: { id: 'critic_10', threshold: 10, field: 'reviewsCount', name: 'Critique' },
  first_validation: { id: 'first_validation', threshold: 1, field: 'validationsCount', name: 'Validateur' },
  guardian_10: { id: 'guardian_10', threshold: 10, field: 'validationsCount', name: 'Gardien des Spots' },
  trusted: { id: 'trusted', threshold: 75, field: 'trustScore', name: 'Confiance' },
}

async function checkAndAwardBadges(userId) {
  if (!userId) return

  const db = getFirestore()
  const userDoc = await db.doc(`users/${userId}`).get()
  if (!userDoc.exists) return

  const user = userDoc.data()
  const currentBadges = user.badges || []
  const newBadges = []

  // Count spots
  const spotsSnap = await db.collection('spots').where('creatorId', '==', userId).get()
  const counts = {
    spotsCount: spotsSnap.size,
    reviewsCount: user.reviewsCount || 0,
    validationsCount: user.validationsCount || 0,
    trustScore: user.trustScore || 0,
  }

  for (const [key, badge] of Object.entries(BADGES)) {
    const value = counts[badge.field] || 0
    if (value >= badge.threshold && !currentBadges.includes(badge.id)) {
      newBadges.push(badge.id)
    }
  }

  if (newBadges.length > 0) {
    const allBadges = [...currentBadges, ...newBadges]
    await db.doc(`users/${userId}`).update({
      badges: allBadges,
      badgesUpdatedAt: new Date().toISOString(),
    })
    console.log(`[Badges] User ${userId}: awarded ${newBadges.join(', ')} (total: ${allBadges.length})`)
  }
}

exports.checkBadgesOnSpot = onDocumentCreated('spots/{spotId}', async (event) => {
  const spot = event.data?.data()
  if (!spot?.creatorId) return null
  await checkAndAwardBadges(spot.creatorId)
  return null
})

exports.checkBadgesOnReport = onDocumentCreated('reports/{reportId}', async (event) => {
  const report = event.data?.data()
  if (!report?.targetId) return null
  await checkAndAwardBadges(report.targetId)
  return null
})
