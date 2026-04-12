/**
 * Scheduled cleanup — runs daily at 3am Paris time
 * - Delete DM messages older than 90 days
 * - Delete stale FCM tokens (no refresh in 60 days)
 * - Delete expired SOS sessions
 */

const { onSchedule } = require('firebase-functions/v2/scheduler')
const { getFirestore } = require('firebase-admin/firestore')

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000
const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000

exports.dailyCleanup = onSchedule(
  {
    schedule: 'every day 03:00',
    timeZone: 'Europe/Paris',
  },
  async () => {
    const db = getFirestore()
    const now = Date.now()
    let totalDeleted = 0

    // 1. Delete old DM messages (>90 days)
    try {
      const cutoff = new Date(now - NINETY_DAYS_MS)
      const convSnap = await db.collection('directMessages').get()

      for (const conv of convSnap.docs) {
        const oldMsgs = await db
          .collection('directMessages')
          .doc(conv.id)
          .collection('messages')
          .where('createdAt', '<', cutoff)
          .limit(500)
          .get()

        if (oldMsgs.size > 0) {
          const batch = db.batch()
          oldMsgs.docs.forEach(d => batch.delete(d.ref))
          await batch.commit()
          totalDeleted += oldMsgs.size
        }
      }
      console.log(`[Cleanup] Deleted ${totalDeleted} old DM messages`)
    } catch (err) {
      console.error('[Cleanup] DM cleanup failed:', err.message)
    }

    // 2. Delete stale FCM tokens (no refresh in 60 days)
    try {
      let staleTokens = 0
      const cutoff = new Date(now - SIXTY_DAYS_MS)
      const usersSnap = await db.collection('users').get()

      for (const userDoc of usersSnap.docs) {
        const tokensSnap = await db
          .collection('users')
          .doc(userDoc.id)
          .collection('fcmTokens')
          .where('lastRefresh', '<', cutoff)
          .get()

        if (tokensSnap.size > 0) {
          const batch = db.batch()
          tokensSnap.docs.forEach(d => batch.delete(d.ref))
          await batch.commit()
          staleTokens += tokensSnap.size
        }
      }
      console.log(`[Cleanup] Deleted ${staleTokens} stale FCM tokens`)
    } catch (err) {
      console.error('[Cleanup] FCM cleanup failed:', err.message)
    }

    // 3. Delete expired SOS timers (trip ended but document still exists, >24h old)
    try {
      let expiredTimers = 0
      const cutoff = new Date(now - 24 * 60 * 60 * 1000)
      const timersSnap = await db
        .collection('sosTimers')
        .where('active', '==', false)
        .get()

      for (const timerDoc of timersSnap.docs) {
        const data = timerDoc.data()
        const lastCheckIn = data.lastCheckIn?.toMillis?.() || 0
        if (lastCheckIn < cutoff.getTime()) {
          await timerDoc.ref.delete()
          expiredTimers++
        }
      }
      console.log(`[Cleanup] Deleted ${expiredTimers} expired SOS timers`)
    } catch (err) {
      console.error('[Cleanup] SOS cleanup failed:', err.message)
    }

    // 4. Process scheduled account deletions (30-day grace period)
    try {
      let deletedAccounts = 0
      const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000)
      const pendingSnap = await db
        .collection('users')
        .where('deletionScheduledAt', '!=', null)
        .get()

      for (const userDoc of pendingSnap.docs) {
        const data = userDoc.data()
        const scheduledAt = data.deletionScheduledAt?.toMillis?.() || data.deletionScheduledAt
        if (!scheduledAt || scheduledAt > thirtyDaysAgo.getTime()) continue

        const userId = userDoc.id
        console.log(`[Cleanup] Deleting account ${userId} (scheduled ${new Date(scheduledAt).toISOString()})`)

        // Delete subcollections
        const subcollections = ['friends', 'friendRequests', 'favorites', 'trips', 'syncData', 'fcmTokens', 'tripHistory', 'blockedUsers', 'journal', 'guideVotes']
        for (const sub of subcollections) {
          const subSnap = await db.collection('users').doc(userId).collection(sub).limit(500).get()
          if (subSnap.size > 0) {
            const batch = db.batch()
            subSnap.docs.forEach(d => batch.delete(d.ref))
            await batch.commit()
          }
        }

        // Delete username reservation
        if (data.username) {
          try { await db.collection('usernames').doc(data.username).delete() } catch { /* ok */ }
        }

        // Delete user document
        await userDoc.ref.delete()

        // Delete Firebase Auth account
        try {
          const { getAuth } = require('firebase-admin/auth')
          await getAuth().deleteUser(userId)
        } catch (e) { console.warn(`[Cleanup] Auth delete failed for ${userId}:`, e.message) }

        deletedAccounts++
      }
      console.log(`[Cleanup] Deleted ${deletedAccounts} expired accounts`)
    } catch (err) {
      console.error('[Cleanup] Account deletion cleanup failed:', err.message)
    }

    console.log(`[Cleanup] Daily cleanup complete. Total deleted: ${totalDeleted}`)
  }
)
