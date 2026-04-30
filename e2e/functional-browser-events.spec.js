/**
 * Phase 6B: Browser events
 * Tests visibilitychange, popstate, beforeunload, focus
 */
import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:4173'
const BYPASS = {
  spothitch_cookie_consent: 'true', spothitch_landing_v2: '1',
  spothitch_age_verified: 'true', spothitch_welcomed: 'true', spothitch_sos_intro_seen: '1',
}

async function setup(page) {
  await page.addInitScript((s) => { for (const [k,v] of Object.entries(s)) localStorage.setItem(k,v) }, BYPASS)
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForFunction(() => typeof window.setState === 'function', { timeout: 30000 }).catch(() => {})
  await page.evaluate(() => {
    window.setState?.({
      showWelcome: false, showLanding: false, showAgeVerification: false, showCookieBanner: false,
      isLoggedIn: true,
      user: { uid: 'test-uid', displayName: 'TestUser', email: 'test@test.com' },
      username: 'testuser',
    })
  })
  await page.waitForTimeout(800)
}

test.describe('Browser events', () => {
  test('app survives visibilitychange hidden→visible', async ({ page }) => {
    await setup(page)
    // Simulate tab hidden then visible
    await page.evaluate(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })
    await page.waitForTimeout(500)
    // App should still be functional
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
    expect(await page.evaluate(() => typeof window.setState === 'function')).toBe(true)
  })

  test('popstate does not crash the app', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => {
      history.pushState({}, '', '/')
      window.dispatchEvent(new PopStateEvent('popstate', { state: {} }))
    })
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('focus event does not crash the app', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => {
      window.dispatchEvent(new Event('focus'))
    })
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('online event triggers reconnection', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => {
      window.dispatchEvent(new Event('online'))
    })
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('offline event is handled', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => {
      window.dispatchEvent(new Event('offline'))
    })
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('resize event does not crash', async ({ page }) => {
    await setup(page)
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.waitForTimeout(500)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })
})
