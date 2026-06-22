/**
 * Firebase profile-handler E2E (Brique 2 + 4). Runs the real profile handlers and asserts
 * the change is persisted to the user's Firestore document.
 */
import { test, expect } from '@playwright/test'
import {
  TEST_ACCOUNTS,
  getCurrentUid,
  cleanupTestData,
  initFirebasePage,
} from './firebase-helpers.js'

test.describe('Firebase profile handlers', () => {
  test.describe.configure({ mode: 'serial' })

  let context, page, uid, isFallback

  test.beforeAll(async ({ browser }) => {
    if (!process.env.E2E_TEST_PASSWORD) return
    ;({ context, page, uid } = await initFirebasePage(browser, TEST_ACCOUNTS.alice.email))
    isFallback = uid?.startsWith('ci-ci-') || false
  })

  test.afterAll(async () => {
    if (uid && page && !isFallback) await cleanupTestData(page, uid)
    await context?.close()
  })

  test.beforeEach(() => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')
    test.skip(!!isFallback, 'Firebase emulator not reachable from browser build')
  })

  test('saveBio persists the bio to the user Firestore doc', async () => {
    const bio = 'E2E bio ' + Date.now()
    // Load the Profile module (real saveBio) and make sure the user doc exists (updateUserProfile
    // uses updateDoc, which needs an existing doc).
    await page.evaluate(async () => {
      window.changeTab('profile')
      const { getDb, getAuth, doc, setDoc } = window.__fb
      await setDoc(doc(getDb(), 'users', getAuth().currentUser.uid), { createdAt: Date.now() }, { merge: true })
    })
    await page.waitForFunction(() => typeof window.saveBio === 'function', { timeout: 15000 })
    await page.evaluate((bio) => window.saveBio(bio), bio)

    await expect.poll(async () => {
      return await page.evaluate(async (uid) => {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'users', uid))
        return snap.exists() ? snap.data().bio : null
      }, uid)
    }, { timeout: 12000 }).toBe(bio)
  })
})
