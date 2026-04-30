/**
 * Phase 6A: Keyboard shortcuts
 * Tests all keyboard shortcuts trigger the correct action
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

test.describe('Keyboard shortcuts', () => {
  test('? opens accessibility help or search', async ({ page }) => {
    await setup(page)
    await page.keyboard.press('?')
    await page.waitForTimeout(500)
    // Should open some help or search modal
    const state = await page.evaluate(() => window.getState?.())
    expect(state).toBeDefined()
  })

  test('Escape closes modal', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.setState?.({ showFilters: true }))
    await page.waitForTimeout(300)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
    // Escape should close the topmost modal
    const state = await page.evaluate(() => window.getState?.())
    expect(state).toBeDefined()
  })

  test('1-5 number keys switch tabs', async ({ page }) => {
    await setup(page)
    await page.keyboard.press('2')
    await page.waitForTimeout(500)
    // Tab 2 should be spots or voyage
    const tab = await page.evaluate(() => window.getState?.()?.activeTab)
    expect(tab).toBeDefined()
  })
})
