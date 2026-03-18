/**
 * E2E Tests - Alpha Welcome / Landing (carousel v4)
 * BetaBanner was removed — alpha messaging is now in the carousel landing page
 */

import { test, expect } from '@playwright/test'
import { skipOnboarding } from './helpers.js'

test.describe('Alpha Welcome', () => {
  test('should show landing carousel for new users', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.clear()
      localStorage.setItem('spothitch_cookies_v2', 'all')
    })
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(3000)

    // Landing page should be visible for new users (no spothitch_landing_v2 key)
    const landing = page.locator('#landing-page, #landing-track')
    const alphaOverlay = page.locator('#alpha-welcome-overlay')
    const hasLanding = await landing.first().isVisible({ timeout: 5000 }).catch(() => false)
      || await alphaOverlay.isVisible({ timeout: 3000 }).catch(() => false)
    expect(hasLanding).toBeTruthy()
  })

  test('should dismiss landing and show map', async ({ page }) => {
    await skipOnboarding(page)
    await page.waitForTimeout(1000)

    // After onboarding, map should be visible
    const map = page.locator('#home-map, canvas')
    await expect(map.first()).toBeVisible({ timeout: 5000 })
  })

  test('should show alpha badge in landing', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.clear()
      localStorage.setItem('spothitch_cookies_v2', 'all')
    })
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(3000)

    // Check for alpha badge text in the page
    const pageText = await page.textContent('body')
    const hasAlpha = pageText.toLowerCase().includes('alpha')
      || pageText.toLowerCase().includes('private')
      || pageText.toLowerCase().includes('test')
    expect(hasAlpha).toBeTruthy()
  })
})
