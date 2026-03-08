/**
 * Firebase Auth E2E Tests
 *
 * Tests real Firebase authentication flows with dedicated test accounts.
 * Uses programmatic login (window.__fb.signIn) for reliability in CI.
 */
import { test, expect } from '@playwright/test'
import { skipOnboarding } from './helpers.js'
import {
  TEST_ACCOUNTS,
  getCurrentUid,
  programmaticLogin,
  programmaticLogout,
  initFirebasePage,
} from './firebase-helpers.js'

test.describe('Firebase Auth - Login flows', () => {
  test.describe.configure({ mode: 'serial' })

  let context, page, aliceUid

  test.beforeAll(async ({ browser }) => {
    if (!process.env.E2E_TEST_PASSWORD) return
    ;({ context, page, uid: aliceUid } = await initFirebasePage(browser, TEST_ACCOUNTS.alice.email))
  })

  test.afterAll(async () => {
    await context?.close()
  })

  test('login sets currentUser in localStorage', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const uid = await getCurrentUid(page)
    expect(uid).toBeTruthy()
    expect(uid).toBe(aliceUid)

    // Verify Firebase Auth state directly (app may manage localStorage differently)
    const authUid = await page.evaluate(() => window.__fb.getAuth().currentUser?.uid)
    expect(authUid).toBe(aliceUid)
  })

  test('Firestore user profile exists after login', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const profile = await page.evaluate(async (testUid) => {
      try {
        const fb = window.__fb
        const db = fb.getDb()
        const snap = await fb.getDoc(fb.doc(db, 'users', testUid))
        return snap.exists() ? snap.data() : null
      } catch {
        return null
      }
    }, aliceUid)

    expect(profile).toBeTruthy()
    expect(profile.email).toBe(TEST_ACCOUNTS.alice.email)
  })

  test('token refresh keeps user logged in', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const refreshed = await page.evaluate(async () => {
      try {
        const auth = window.__fb.getAuth()
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

    await programmaticLogout(page)
    const uid = await getCurrentUid(page)
    expect(uid).toBeFalsy()

    const authUser = await page.evaluate(() => window.__fb.getAuth().currentUser)
    expect(authUser).toBeFalsy()
  })

  test('re-login after logout works', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const uid = await programmaticLogin(page, TEST_ACCOUNTS.alice.email)
    expect(uid).toBeTruthy()
    expect(uid).toBe(aliceUid)
  })

  test('different users get different UIDs', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    await programmaticLogout(page)
    const bobUid = await programmaticLogin(page, TEST_ACCOUNTS.bob.email)
    expect(bobUid).toBeTruthy()
    expect(bobUid).not.toBe(aliceUid)

    // Switch back to Alice
    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.alice.email)
  })

  test('Firebase Auth currentUser is set after login', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(() => {
      const auth = window.__fb.getAuth()
      return {
        authUid: auth.currentUser?.uid || null,
        email: auth.currentUser?.email || null,
      }
    })

    expect(result.authUid).toBeTruthy()
    expect(result.authUid).toBe(aliceUid)
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
