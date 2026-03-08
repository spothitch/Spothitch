#!/usr/bin/env node
/**
 * Firebase Test Cleanup
 *
 * Resets the 5 test accounts to a clean state after E2E runs.
 * Deletes: spots, conversations, messages, reviews, votes, tips, friend requests.
 * Resets: points, badges, season points.
 *
 * Usage:
 *   E2E_TEST_PASSWORD=xxx node scripts/firebase-test-cleanup.mjs
 *   APP_URL=http://localhost:4173 E2E_TEST_PASSWORD=xxx node scripts/firebase-test-cleanup.mjs
 */

import { chromium } from 'playwright'

const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD
if (!TEST_PASSWORD) {
  console.error('E2E_TEST_PASSWORD environment variable is required')
  process.exit(1)
}

const ACCOUNTS = [
  'ci-alice@spothitch.com',
  'ci-bob@spothitch.com',
  'ci-charlie@spothitch.com',
  'ci-diana@spothitch.com',
  'ci-admin@spothitch.com',
]

const BASE_URL = process.env.APP_URL || 'http://localhost:4173'

async function cleanup() {
  console.log('Starting Firebase test cleanup...')
  console.log(`Base URL: ${BASE_URL}`)

  const browser = await chromium.launch({ headless: true })

  for (const email of ACCOUNTS) {
    console.log(`\nCleaning up ${email}...`)

    const context = await browser.newContext()
    const page = await context.newPage()

    // Skip onboarding
    await page.addInitScript(() => {
      localStorage.setItem('spothitch_v4_state', JSON.stringify({
        showWelcome: false, username: 'Cleanup', avatar: '🤙',
        activeTab: 'map', theme: 'dark', lang: 'en',
        points: 0, level: 1, badges: [], rewards: [],
        savedTrips: [], emergencyContacts: [],
      }))
      localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({
        preferences: { necessary: true, analytics: false, marketing: false, personalization: false },
        timestamp: Date.now(), version: '1.0',
      }))
      localStorage.setItem('spothitch_age_verified', 'true')
      localStorage.setItem('spothitch_landing_v2', '1')
      localStorage.setItem('spothitch_beta_seen', '1')
    })

    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(3000)

    // Force remove splash
    await page.evaluate(() => {
      const app = document.getElementById('app')
      if (app && !app.classList.contains('loaded')) app.classList.add('loaded')
      const splash = document.getElementById('splash-screen')
      if (splash) splash.remove()
    })

    const result = await page.evaluate(async ({ email, password }) => {
      try {
        const fb = await import('/src/services/firebase.js')
        fb.initializeFirebase()

        // Sign in
        const loginResult = await fb.signIn(email, password)
        if (!loginResult.success) {
          return { success: false, error: `Login failed: ${loginResult.error}` }
        }

        const uid = loginResult.user.uid
        const { getFirestore, collection, query, where, getDocs, deleteDoc, doc, updateDoc } = await import('firebase/firestore')
        const db = getFirestore()

        let deleted = 0

        // Delete spots created by this user
        try {
          const spotsQ = query(collection(db, 'spots'), where('createdBy', '==', uid))
          const spots = await getDocs(spotsQ)
          for (const d of spots.docs) { await deleteDoc(d.ref); deleted++ }
        } catch {}

        // Delete reviews
        try {
          const reviewsQ = query(collection(db, 'reviews'), where('userId', '==', uid))
          const reviews = await getDocs(reviewsQ)
          for (const d of reviews.docs) { await deleteDoc(d.ref); deleted++ }
        } catch {}

        // Delete conversations (and messages subcollection)
        try {
          const convsQ = query(collection(db, 'conversations'), where('participants', 'array-contains', uid))
          const convs = await getDocs(convsQ)
          for (const c of convs.docs) {
            try {
              const msgs = await getDocs(collection(db, 'conversations', c.id, 'messages'))
              for (const m of msgs.docs) { await deleteDoc(m.ref); deleted++ }
            } catch {}
            await deleteDoc(c.ref)
            deleted++
          }
        } catch {}

        // Delete friend requests
        try {
          for (const field of ['from', 'to']) {
            const reqsQ = query(collection(db, 'friendRequests'), where(field, '==', uid))
            const reqs = await getDocs(reqsQ)
            for (const d of reqs.docs) { await deleteDoc(d.ref); deleted++ }
          }
        } catch {}

        // Delete groups created by this user
        try {
          const groupsQ = query(collection(db, 'groups'), where('createdBy', '==', uid))
          const groups = await getDocs(groupsQ)
          for (const g of groups.docs) {
            try {
              const msgs = await getDocs(collection(db, 'groups', g.id, 'messages'))
              for (const m of msgs.docs) { await deleteDoc(m.ref); deleted++ }
            } catch {}
            await deleteDoc(g.ref)
            deleted++
          }
        } catch {}

        // Delete feature votes by this user
        try {
          const votesQ = query(collection(db, 'featureVotes'), where('userId', '==', uid))
          const votes = await getDocs(votesQ)
          for (const d of votes.docs) { await deleteDoc(d.ref); deleted++ }
        } catch {}

        // Delete guide tips by this user
        try {
          const tipsQ = query(collection(db, 'guideTips'), where('userId', '==', uid))
          const tips = await getDocs(tipsQ)
          for (const d of tips.docs) { await deleteDoc(d.ref); deleted++ }
        } catch {}

        // Delete favorites subcollection
        try {
          const favs = await getDocs(collection(db, 'users', uid, 'favorites'))
          for (const d of favs.docs) { await deleteDoc(d.ref); deleted++ }
        } catch {}

        // Delete trips subcollection
        try {
          const trips = await getDocs(collection(db, 'users', uid, 'trips'))
          for (const d of trips.docs) { await deleteDoc(d.ref); deleted++ }
        } catch {}

        // Reset profile to clean state
        try {
          await updateDoc(doc(db, 'users', uid), {
            points: 0,
            seasonPoints: 0,
            badges: [],
            bio: '',
            level: 1,
          })
        } catch {}

        // Sign out
        const { getAuth, signOut } = await import('firebase/auth')
        await signOut(getAuth())

        return { success: true, deleted, uid }
      } catch (err) {
        return { success: false, error: err.message }
      }
    }, { email, password: TEST_PASSWORD })

    if (result.success) {
      console.log(`  Cleaned: ${result.deleted} documents deleted (uid: ${result.uid})`)
    } else {
      console.error(`  FAILED: ${result.error}`)
    }

    await context.close()
  }

  await browser.close()
  console.log('\nCleanup complete!')
}

cleanup().catch(err => {
  console.error('Cleanup failed:', err)
  process.exit(1)
})
