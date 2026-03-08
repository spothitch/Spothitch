/**
 * Firebase Auth E2E Tests
 *
 * Tests real Firebase authentication flows with dedicated test accounts.
 * Uses shared session to minimize logins and avoid rate limiting.
 */
import { test, expect } from '@playwright/test'
import { skipOnboarding } from './helpers.js'
import {
  TEST_ACCOUNTS,
  firebaseLogin,
  firebaseLogout,
  getCurrentUid,
} from './firebase-helpers.js'

test.describe('Firebase Auth - Login flows', () => {
  test.describe.configure({ mode: 'serial' })

  /** @type {import('@playwright/test').BrowserContext} */
  let context
  /** @type {import('@playwright/test').Page} */
  let page

  test.beforeAll(async ({ browser }) => {
    if (!process.env.E2E_TEST_PASSWORD) return
    context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    page = await context.newPage()
    await skipOnboarding(page)
  })

  test.afterAll(async () => {
    await context?.close()
  })

  test('login with valid email/password', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    await firebaseLogin(page, TEST_ACCOUNTS.alice.email)
    const uid = await getCurrentUid(page)
    expect(uid).toBeTruthy()

    const state = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
    )
    expect(state.userProfile?.email).toBe(TEST_ACCOUNTS.alice.email)
  })

  test('auth modal closes after successful login', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const authForm = page.locator('#auth-form')
    await expect(authForm).toHaveCount(0, { timeout: 5000 })
  })

  test('Firestore user profile exists after login', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const uid = await getCurrentUid(page)
    expect(uid).toBeTruthy()

    const profile = await page.evaluate(async (testUid) => {
      try {
        const fb = window.__fb
        const db = fb.getDb()
        const snap = await fb.getDoc(fb.doc(db, 'users', testUid))
        return snap.exists() ? snap.data() : null
      } catch {
        return null
      }
    }, uid)

    expect(profile).toBeTruthy()
    expect(profile.email).toBe(TEST_ACCOUNTS.alice.email)
  })

  test('token refresh keeps user logged in', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const refreshed = await page.evaluate(async () => {
      try {
        const fb = window.__fb
        const auth = fb.getAuth()
        if (auth.currentUser) {
          await auth.currentUser.getIdToken(true)
          return true
        }
        return false
      } catch {
        return false
      }
    })

    expect(refreshed).toBe(true)
    const uid = await getCurrentUid(page)
    expect(uid).toBeTruthy()
  })

  test('logout clears auth state', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    await firebaseLogout(page)
    const uid = await getCurrentUid(page)
    expect(uid).toBeFalsy()
  })

  test('login then logout then re-login works', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    await firebaseLogin(page, TEST_ACCOUNTS.alice.email)
    const uid = await getCurrentUid(page)
    expect(uid).toBeTruthy()
    await firebaseLogout(page)
  })

  test('different users get different UIDs', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    await firebaseLogin(page, TEST_ACCOUNTS.alice.email)
    const aliceUid = await getCurrentUid(page)
    await firebaseLogout(page)

    await firebaseLogin(page, TEST_ACCOUNTS.bob.email)
    const bobUid = await getCurrentUid(page)
    await firebaseLogout(page)

    expect(aliceUid).toBeTruthy()
    expect(bobUid).toBeTruthy()
    expect(aliceUid).not.toBe(bobUid)
  })
})

test.describe('Firebase Auth - Error handling', () => {
  test('login with wrong password shows error', async ({ page }) => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    await skipOnboarding(page)
    await page.evaluate(() => window.openAuth?.('email'))
    await page.waitForSelector('#auth-form', { timeout: 5000 })

    const loginTab = page.locator('button[onclick*="setAuthMode(\'login\')"]')
    if (await loginTab.count() > 0) await loginTab.click()
    await page.waitForTimeout(300)

    await page.fill('#auth-email', TEST_ACCOUNTS.alice.email)
    await page.fill('#auth-password', 'wrong-password-12345')
    await page.click('#auth-submit-btn')

    const errorDiv = page.locator('#auth-error-msg')
    await expect(errorDiv).toBeVisible({ timeout: 10000 })
    const uid = await getCurrentUid(page)
    expect(uid).toBeFalsy()
  })

  test('empty email/password does not submit', async ({ page }) => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    await skipOnboarding(page)
    await page.evaluate(() => window.openAuth?.('email'))
    await page.waitForSelector('#auth-form', { timeout: 5000 })

    await page.click('#auth-submit-btn')
    await expect(page.locator('#auth-form')).toBeVisible()
    const uid = await getCurrentUid(page)
    expect(uid).toBeFalsy()
  })
})
