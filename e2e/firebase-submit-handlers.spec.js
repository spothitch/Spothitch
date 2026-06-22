/**
 * Firebase submit-handler E2E (Brique 2 + 4) — the REAL window.submit* handlers run
 * end to end against the emulator, and we assert the data actually landed in Firestore.
 * This is stronger than the data-layer specs: it exercises the handler's own validation,
 * write path and state effects exactly as a user click would.
 */
import { test, expect } from '@playwright/test'
import {
  TEST_ACCOUNTS,
  programmaticLogin,
  getCurrentUid,
  getUidByEmail,
  cleanupTestData,
  initFirebasePage,
} from './firebase-helpers.js'

test.describe('Firebase submit handlers', () => {
  test.describe.configure({ mode: 'serial' })

  let context, page, aliceUid, isFallback

  test.beforeAll(async ({ browser }) => {
    if (!process.env.E2E_TEST_PASSWORD) return
    ;({ context, page, uid: aliceUid } = await initFirebasePage(browser, TEST_ACCOUNTS.alice.email))
    isFallback = aliceUid?.startsWith('ci-ci-') || false
  })

  test.afterAll(async () => {
    if (aliceUid && page && !isFallback) await cleanupTestData(page, aliceUid)
    await context?.close()
  })

  test.beforeEach(() => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')
    test.skip(!!isFallback, 'Firebase emulator not reachable from browser build')
  })

  test('submitReview writes a validation/review doc to Firestore (Bob reviews Alice spot)', async () => {
    // 1. Alice creates a spot.
    const spotId = await page.evaluate(async () => {
      const { getDb, getAuth, collection, addDoc, serverTimestamp } = window.__fb
      const db = getDb()
      const uid = getAuth().currentUser?.uid
      const ref = await addDoc(collection(db, 'spots'), {
        lat: 48.8566, lng: 2.3522, direction: 'north', type: 'city_exit',
        description: 'submitReview target spot', creatorId: uid, createdAt: serverTimestamp(),
        rating: { safety: 4, traffic: 3, accessibility: 4 },
      })
      return ref.id
    })
    expect(spotId).toBeTruthy()
    const aliceUidNow = await getCurrentUid(page)

    // 2. Switch to Bob (a different user — no self-review).
    await programmaticLogin(page, TEST_ACCOUNTS.bob.email)
    const bobUid = await getCurrentUid(page)
    expect(bobUid).toBeTruthy()
    expect(bobUid).not.toBe(aliceUidNow)

    // 3. Set up the exact state submitReview reads, then run the REAL handler.
    const ran = await page.evaluate(async ({ spotId, aliceUid, bobUid }) => {
      window.setState({
        username: 'BobReviewer',
        selectedSpot: { id: spotId, creatorId: aliceUid },
        user: { uid: bobUid },
        currentRating: 4,
      })
      // No comment element → review with rating only (allowed).
      try { localStorage.removeItem(`spothitch_review_${spotId}_${bobUid}`) } catch { /* ignore */ }
      await window.submitReview(spotId)
      return true
    }, { spotId, aliceUid: aliceUidNow, bobUid })
    expect(ran).toBe(true)

    // 4. The handler must have written a validation doc authored by Bob.
    await expect.poll(async () => {
      return await page.evaluate(async ({ spotId, bobUid }) => {
        const { getDb, collection, getDocs, query, where } = window.__fb
        const db = getDb()
        const snap = await getDocs(query(collection(db, 'spots', spotId, 'validations'), where('userId', '==', bobUid)))
        return snap.size
      }, { spotId, bobUid })
    }, { timeout: 10000 }).toBeGreaterThan(0)

    // 5. And the handler cleared the rating state on success.
    expect(await page.evaluate(() => window.getState().currentRating)).toBe(0)
  })
})
