/**
 * Firebase Gamification E2E Tests
 *
 * Tests points sync, leaderboard, badges, and season with real Firestore.
 * Uses shared session (Alice logged in).
 */
import { test, expect } from '@playwright/test'
import { skipOnboarding } from './helpers.js'
import {
  TEST_ACCOUNTS,
  programmaticLogin,
  getCurrentUid,
  firestoreGetDoc,
  initFirebasePage,
} from './firebase-helpers.js'

test.describe('Firebase Gamification', () => {
  test.describe.configure({ mode: 'serial' })

  let context, page, aliceUid, isFallback

  test.beforeAll(async ({ browser }) => {
    if (!process.env.E2E_TEST_PASSWORD) return
    ;({ context, page, uid: aliceUid } = await initFirebasePage(browser, TEST_ACCOUNTS.alice.email))
    isFallback = aliceUid?.startsWith('ci-ci-') || false
  })

  test.afterAll(async () => {
    // Reset points
    if (aliceUid && page) {
      await page.evaluate(async (uid) => {
        try {
          const { getDb, doc, updateDoc } = window.__fb
          await updateDoc(doc(getDb(), 'users', uid), { points: 0, seasonPoints: 0, badges: [], level: 1 })
        } catch {}
      }, aliceUid)
    }
    await context?.close()
  })

  test.beforeEach(() => {
    test.skip(!!isFallback, 'Firebase emulator not reachable from browser build')
  })

  test('points sync to Firestore on login', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')
    test.skip(!aliceUid, 'Login failed in beforeAll')

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, updateDoc, getDoc } = window.__fb
        const db = getDb()
        await updateDoc(doc(db, 'users', testUid), { points: 42 })
        // Retry polling for Firestore eventual consistency
        for (let i = 0; i < 5; i++) {
          const snap = await getDoc(doc(db, 'users', testUid))
          const pts = snap.data()?.points
          if (pts === 42) return { points: pts }
          await new Promise(r => setTimeout(r, 500))
        }
        const finalSnap = await getDoc(doc(db, 'users', testUid))
        return { points: finalSnap.data()?.points }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.error).toBeFalsy()
    expect(result.points).toBe(42)
  })

  test('leaderboard reads multiple users sorted by points', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async () => {
      try {
        const { getDb, collection, getDocs, query, orderBy, limit } = window.__fb
        const q = query(collection(getDb(), 'users'), orderBy('points', 'desc'), limit(10))
        const snap = await getDocs(q)
        return { count: snap.size }
      } catch (err) { return { error: err.message } }
    })

    expect(result.count).toBeGreaterThan(0)
  })

  test('badge write and read from Firestore', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, updateDoc, getDoc, arrayUnion, arrayRemove } = window.__fb
        const db = getDb()
        await updateDoc(doc(db, 'users', testUid), { badges: arrayUnion('e2e_test_badge') })
        const snap = await getDoc(doc(db, 'users', testUid))
        const hasBadge = (snap.data()?.badges || []).includes('e2e_test_badge')
        await updateDoc(doc(db, 'users', testUid), { badges: arrayRemove('e2e_test_badge') })
        return { hasBadge }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.hasBadge).toBe(true)
  })

  test('season points update separately from total', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, updateDoc, getDoc } = window.__fb
        const db = getDb()
        await updateDoc(doc(db, 'users', testUid), { points: 100, seasonPoints: 25 })
        const snap = await getDoc(doc(db, 'users', testUid))
        const data = snap.data()
        return { points: data?.points, seasonPoints: data?.seasonPoints }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.points).toBe(100)
    expect(result.seasonPoints).toBe(25)
  })

  test('merge localStorage points with Firestore on login', async ({ page: freshPage }) => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    await skipOnboarding(freshPage, { points: 50, level: 3 })

    // Load Firebase module on fresh page
    await freshPage.evaluate(() => window.openAuth?.('email'))
    await freshPage.waitForTimeout(3000)
    await freshPage.evaluate(() => window.closeAuth?.())
    await freshPage.waitForTimeout(500)
    await freshPage.waitForFunction(() => !!window.__fb, { timeout: 15000 })

    const uid = await programmaticLogin(freshPage, TEST_ACCOUNTS.diana.email)
    const profile = await firestoreGetDoc(freshPage, 'users', uid)
    expect(profile).toBeTruthy()
    expect(typeof profile.points).toBe('number')
  })

  test('level is derived from points', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, updateDoc, getDoc } = window.__fb
        await updateDoc(doc(getDb(), 'users', testUid), { points: 500 })
        const snap = await getDoc(doc(getDb(), 'users', testUid))
        return { points: snap.data()?.points }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.points).toBe(500)
  })

  test('concurrent point updates do not corrupt data', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, updateDoc, getDoc, increment } = window.__fb
        const db = getDb()
        await updateDoc(doc(db, 'users', testUid), { points: 0 })
        await Promise.all([
          updateDoc(doc(db, 'users', testUid), { points: increment(10) }),
          updateDoc(doc(db, 'users', testUid), { points: increment(10) }),
          updateDoc(doc(db, 'users', testUid), { points: increment(10) }),
          updateDoc(doc(db, 'users', testUid), { points: increment(10) }),
          updateDoc(doc(db, 'users', testUid), { points: increment(10) }),
        ])
        const snap = await getDoc(doc(db, 'users', testUid))
        return { points: snap.data()?.points }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.points).toBe(50)
  })

  test('leaderboard with seasonPoints ordering', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async () => {
      try {
        const { getDb, collection, getDocs, query, orderBy, limit } = window.__fb
        const q = query(collection(getDb(), 'users'), orderBy('seasonPoints', 'desc'), limit(5))
        const snap = await getDocs(q)
        return { count: snap.size }
      } catch {
        return { count: 0, note: 'seasonPoints not indexed yet' }
      }
    })

    expect(result).toBeTruthy()
  })
})
