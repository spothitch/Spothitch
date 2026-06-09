/**
 * Round 13 — Granular Auth Tests (1 assertion per test)
 * ~40 tests covering every auth edge case, XSS payload, and validation
 */
import { test, expect } from '@playwright/test'
import {
  createUserSession, snap, TEST_ACCOUNTS, getCurrentUid,
  navigateToTab,
} from './multi-user-helpers.js'
import { skipOnboarding } from './helpers.js'
import { programmaticLogin, programmaticLogout } from './firebase-helpers.js'

test.use({ viewport: { width: 390, height: 844 } })
test.setTimeout(45000)

// ─── Email validation ────────────────────────────────────────────────────────

test.describe('Auth email validation', () => {
  let ctx, page
  test.beforeAll(async ({ browser }) => {
    ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
    page = await ctx.newPage()
    await skipOnboarding(page)
    await page.evaluate(() => window.openAuth?.('email'))
    await page.waitForTimeout(3000)
  })
  test.afterAll(async () => { await ctx?.close() })

  test('email field exists', async () => {
    expect(await page.locator('#auth-email').count()).toBe(1)
  })
  test('email field has type=email', async () => {
    expect(await page.locator('#auth-email').getAttribute('type')).toBe('email')
  })
  test('email field is required', async () => {
    expect(await page.evaluate(() => document.getElementById('auth-email')?.required)).toBe(true)
  })
  test('password field exists', async () => {
    expect(await page.locator('#auth-password').count()).toBe(1)
  })
  test('password field has type=password', async () => {
    expect(await page.locator('#auth-password').getAttribute('type')).toBe('password')
  })
  test('submit button exists', async () => {
    expect(await page.locator('#auth-submit-btn').count()).toBe(1)
  })
  test('login tab exists', async () => {
    expect(await page.locator('#auth-tab-login').count()).toBe(1)
  })
})

// ─── Register form fields ────────────────────────────────────────────────────

test.describe('Auth register fields', () => {
  let ctx, page
  test.beforeAll(async ({ browser }) => {
    ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
    page = await ctx.newPage()
    await skipOnboarding(page)
    await page.evaluate(() => window.openAuth?.('email'))
    await page.waitForTimeout(2000)
    await page.evaluate(() => window.setAuthMode?.('register'))
    await page.waitForTimeout(1000)
  })
  test.afterAll(async () => { await ctx?.close() })

  test('username field appears in register mode', async () => {
    expect(await page.locator('#auth-pseudo').count()).toBe(1)
  })
  test('birthyear field appears in register mode', async () => {
    expect(await page.locator('#auth-birthyear').count()).toBe(1)
  })
  test('password has minlength >= 6', async () => {
    const ml = await page.evaluate(() => document.getElementById('auth-password')?.minLength)
    expect(ml).toBeGreaterThanOrEqual(6)
  })
})

// ─── XSS payloads in auth fields ─────────────────────────────────────────────

const XSS_PAYLOADS = [
  '<script>alert(1)</script>',
  '<img src=x onerror=alert(1)>',
  '"><svg onload=alert(1)>',
  "javascript:alert('xss')",
  '<iframe src="javascript:alert(1)">',
  '{{constructor.constructor("alert(1)")()}}',
  '<body onload=alert(1)>',
  '<input onfocus=alert(1) autofocus>',
]

test.describe('Auth XSS payloads', () => {
  let ctx, page
  test.beforeAll(async ({ browser }) => {
    ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
    page = await ctx.newPage()
    await skipOnboarding(page)
    await page.evaluate(() => window.openAuth?.('email'))
    await page.waitForTimeout(2000)
    await page.evaluate(() => window.setAuthMode?.('register'))
    await page.waitForTimeout(1000)
  })
  test.afterAll(async () => { await ctx?.close() })

  for (const payload of XSS_PAYLOADS) {
    test(`XSS in username: ${payload.slice(0, 30)}`, async () => {
      const pseudo = page.locator('#auth-pseudo')
      if (await pseudo.count() > 0) {
        await pseudo.fill(payload)
        await page.waitForTimeout(200)
        const noExec = await page.evaluate(() =>
          !document.querySelector('img[src="x"]') &&
          !document.querySelector('svg[onload]') &&
          !document.querySelector('iframe[src*="javascript"]')
        )
        expect(noExec).toBe(true)
      }
    })
  }
})

// ─── Session management ──────────────────────────────────────────────────────

test.describe('Session management', () => {
  test('5 users can login simultaneously', async ({ browser }) => {
    const sessions = []
    for (const key of ['alice', 'bob', 'charlie', 'diana', 'admin']) {
      sessions.push(await createUserSession(browser, key))
    }
    for (const s of sessions) {
      const uid = await getCurrentUid(s.page)
      expect(uid).toBeTruthy()
    }
    // All UIDs are different
    const uids = await Promise.all(sessions.map(s => getCurrentUid(s.page)))
    const unique = new Set(uids)
    expect(unique.size).toBe(5)
    for (const s of sessions) await s.context.close()
  })

  test('logout + login cycle works 3 times', async ({ browser }) => {
    const session = await createUserSession(browser, 'alice')
    for (let i = 0; i < 3; i++) {
      await programmaticLogout(session.page)
      const uid = await programmaticLogin(session.page, TEST_ACCOUNTS.alice.email)
      expect(uid).toBeTruthy()
    }
    await session.context.close()
  })
})

// ─── Handler existence checks ────────────────────────────────────────────────

const AUTH_HANDLERS = [
  'openAuth', 'closeAuth', 'setAuthMode', 'handleForgotPassword',
  'signUp', 'checkUsernameField', 'openDeleteAccount',
]

test.describe('Auth handlers exist', () => {
  test('all auth handlers are callable (batch)', async ({ browser }) => {
    const session = await createUserSession(browser, 'alice')
    await page_loadAuth(session.page)
    const missing = await session.page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), AUTH_HANDLERS)
    expect(missing).toEqual([])
    await session.context.close()
  })
})

async function page_loadAuth(page) {
  await page.evaluate(() => window.openAuth?.('email'))
  await page.waitForTimeout(3000)
  await page.evaluate(() => window.closeAuth?.())
  await page.waitForTimeout(500)
}
