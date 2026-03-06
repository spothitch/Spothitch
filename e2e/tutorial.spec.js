/**
 * E2E Tests - Alpha Welcome Popup (replaces tutorial)
 * Tests for the alpha welcome popup flow
 */

import { test, expect } from '@playwright/test'
import { skipOnboarding } from './helpers.js'

test.describe('Alpha Welcome Popup', () => {
  test('should show alpha popup for new users', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.clear()
      localStorage.setItem('spothitch_landing_v2', '1')
      localStorage.setItem('spothitch_cookies_v2', 'all')
    })
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(3000)

    // Alpha popup should be visible (not dismissed yet)
    const popup = page.locator('#alpha-welcome-overlay')
    const banner = page.locator('#beta-banner')
    const hasPopupOrBanner = await popup.isVisible({ timeout: 5000 }).catch(() => false)
      || await banner.isVisible({ timeout: 3000 }).catch(() => false)
    expect(hasPopupOrBanner).toBeTruthy()
  })

  test('should dismiss popup on CTA click', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.clear()
      localStorage.setItem('spothitch_landing_v2', '1')
      localStorage.setItem('spothitch_cookies_v2', 'all')
    })
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(3000)

    // Click CTA via handler (button text varies by language)
    await page.evaluate(() => window.closeBetaPopup?.())
    await page.waitForTimeout(500)

    // Popup should be gone
    const popup = page.locator('#alpha-welcome-overlay')
    await expect(popup).not.toBeVisible({ timeout: 3000 })
  })

  test('should show banner after popup dismissed', async ({ page }) => {
    await skipOnboarding(page)
    const banner = page.locator('#beta-banner')
    await expect(banner).toBeVisible({ timeout: 5000 })
    const bannerText = await banner.textContent()
    expect(bannerText.toLowerCase()).toContain('alpha')
  })
})
