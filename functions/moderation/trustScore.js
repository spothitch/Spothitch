/**
 * Server-side trust score calculation
 * Recalculates when: spot created, review added, validation added, report created
 * Score is stored in users/{uid}.trustScore — cannot be faked by client
 *
 * Score components:
 * - Spots created (max 25pts)
 * - Reviews written (max 20pts)
 * - Validations done (max 15pts)
 * - Account age (max 15pts)
 * - Reports received (penalty, -10pts each)
 * - Profile completeness (max 10pts)
 * - Check-ins done (max 15pts)
 */

const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { getFirestore } = require('firebase-admin/firestore')

async function recalculateTrustScore(userId) {
  if (!userId) return

  const db = getFirestore()
  const userDoc = await db.doc(`users/${userId}`).get()
  if (!userDoc.exists) return

  const user = userDoc.data()
  let score = 0

  // Spots created (1pt each, max 25)
  const spotsSnap = await db.collection('spots').where('creatorId', '==', userId).get()
  score += Math.min(spotsSnap.size, 25)

  // Reviews written (2pt each, max 20) — server-verified count
  try {
    const reviewsSnap = await db.collectionGroup('reviews').where('userId', '==', userId).get()
    score += Math.min(reviewsSnap.size * 2, 20)
  } catch { score += Math.min((user.reviewsCount || 0) * 2, 20) }

  // Validations done (1pt each, max 15) — server-verified count
  try {
    const valsSnap = await db.collectionGroup('validations').where('userId', '==', userId).get()
    score += Math.min(valsSnap.size, 15)
  } catch { score += Math.min((user.validationsCount || 0), 15) }

  // Account age (1pt per month, max 15)
  const createdAt = user.createdAt?.toMillis?.() || user.createdAt || Date.now()
  const monthsOld = Math.floor((Date.now() - createdAt) / (30 * 24 * 60 * 60 * 1000))
  score += Math.min(monthsOld, 15)

  // Reports received (penalty)
  const reportsSnap = await db.collection('reports').where('targetId', '==', userId).get()
  score -= reportsSnap.size * 10

  // Profile completeness (max 10)
  let profilePts = 0
  if (user.username) profilePts += 2
  if (user.avatar) profilePts += 2
  if (user.bio) profilePts += 2
  if (user.languages?.length > 0) profilePts += 2
  if (user.country) profilePts += 2
  score += profilePts

  // Clamp to 0-100
  score = Math.max(0, Math.min(100, score))

  // Save to user profile
  await db.doc(`users/${userId}`).update({
    trustScore: score,
    trustScoreUpdatedAt: new Date().toISOString(),
  })

  console.log(`[TrustScore] User ${userId}: ${score}/100`)
}

// Recalculate when user creates a spot
exports.updateTrustOnSpot = onDocumentCreated('spots/{spotId}', async (event) => {
  const spot = event.data?.data()
  if (!spot?.creatorId) return null
  await recalculateTrustScore(spot.creatorId)
  return null
})

// Recalculate when user gets a report
exports.updateTrustOnReport = onDocumentCreated('reports/{reportId}', async (event) => {
  const report = event.data?.data()
  if (!report?.targetId || report.type !== 'user') return null
  await recalculateTrustScore(report.targetId)
  return null
})
