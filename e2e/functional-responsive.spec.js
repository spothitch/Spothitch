/**
 * Phase 7A: Responsive layout tests
 * Verifies app works on different viewport sizes
 */
import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:4173'
const BYPASS = {
  spothitch_cookie_consent: 'true', spothitch_landing_v2: '1',
  spothitch_age_verified: 'true', spothitch_welcomed: 'true', spothitch_sos_intro_seen: '1',
}

async function setupWithViewport(page, width, height) {
  await page.setViewportSize({ width, height })
  await page.addInitScript((s) => { for (const [k,v] of Object.entries(s)) localStorage.setItem(k,v) }, BYPASS)
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForFunction(() => typeof window.setState === 'function', { timeout: 45000 }).catch(() => {})
  await page.evaluate(() => {
    window.setState?.({
      showWelcome: false, showLanding: false, showAgeVerification: false, showCookieBanner: false,
      isLoggedIn: true,
      user: { uid: 'test-uid', displayName: 'TestUser', email: 'test@test.com' },
      username: 'testuser',
    })
  })
  await page.waitForTimeout(2000)
}

test.describe('Responsive — iPhone 14 (390x844)', () => {
  test('app loads without horizontal overflow', async ({ page }) => {
    await setupWithViewport(page, 390, 844)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    expect(overflow).toBe(false)
  })

  test('navigation bar is visible', async ({ page }) => {
    await setupWithViewport(page, 390, 844)
    const nav = await page.evaluate(() => {
      const el = document.querySelector('nav, [role="navigation"], .bottom-nav, #nav')
      return el ? el.getBoundingClientRect().height > 0 : false
    })
    expect(nav).toBe(true)
  })

  test('profile tab renders content', async ({ page }) => {
    await setupWithViewport(page, 390, 844)
    await page.evaluate(() => window.changeTab?.('profile'))
    await page.waitForTimeout(2000)
    const text = await page.evaluate(() => document.getElementById('app')?.innerText || '')
    expect(text.length).toBeGreaterThan(50)
  })
})

test.describe('Responsive — iPad (768x1024)', () => {
  test('app loads on tablet viewport', async ({ page }) => {
    await setupWithViewport(page, 768, 1024)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    expect(overflow).toBe(false)
  })
})

test.describe('Responsive — Desktop (1440x900)', () => {
  test('app loads on desktop viewport', async ({ page }) => {
    await setupWithViewport(page, 1440, 900)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('no horizontal overflow on desktop', async ({ page }) => {
    await setupWithViewport(page, 1440, 900)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    expect(overflow).toBe(false)
  })
})
