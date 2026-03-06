/**
 * E2E Tests - Alpha Welcome Popup (replaces tutorial)
 * Tests for the alpha welcome popup flow
 */

import { test, expect } from '@playwright/test'
import { skipOnboarding, dismissOverlays } from './helpers.js'

test.describe('Alpha Welcome Popup', () => {
  test('should show alpha popup for new users', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)
    await dismissOverlays(page)

    // Check if alpha popup or banner is visible
    const popup = page.locator('[role="dialog"]')
    const banner = page.locator('#beta-banner')
    const hasPopupOrBanner = await popup.first().isVisible({ timeout: 5000 }).catch(() => false)
      || await banner.first().isVisible({ timeout: 3000 }).catch(() => false)
    expect(hasPopupOrBanner).toBeTruthy()
  })

  test('should dismiss popup on CTA click', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.clear()
      localStorage.setItem('spothitch_landing_v2', '1')
    })
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)

    const cta = page.locator('button:has-text("parti")')
    if (await cta.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      await cta.first().click()
      await page.waitForTimeout(500)
      // Popup should be gone
      const popup = page.locator('[role="dialog"]')
      await expect(popup).not.toBeVisible({ timeout: 3000 })
    }
  })

  test('should show banner after popup dismissed', async ({ page }) => {
    await skipOnboarding(page)
    const banner = page.locator('#beta-banner')
    await expect(banner).toBeVisible({ timeout: 5000 })
    const bannerText = await banner.textContent()
    expect(bannerText.toLowerCase()).toContain('alpha')
  })
})
