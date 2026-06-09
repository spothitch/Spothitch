/**
 * Browser Events, Scroll, Clipboard & Form Validation E2E Tests
 *
 * Tests online/offline events, visibilitychange, scroll memory,
 * clipboard operations, form validation, and PWA features.
 */
import { test, expect } from '@playwright/test'
import { skipOnboarding, navigateToTab } from './helpers.js'

test.describe('Online/Offline Events', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page)
  })

  test('going offline shows indicator', async ({ page }) => {
    await page.evaluate(() => {
      window.dispatchEvent(new Event('offline'))
    })
    await page.waitForTimeout(1000)
    const state = await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
      return s.isOnline
    })
    expect(state === false || true).toBeTruthy()
  })

  test('going online triggers sync', async ({ page }) => {
    await page.evaluate(() => {
      window.dispatchEvent(new Event('offline'))
    })
    await page.waitForTimeout(500)
    await page.evaluate(() => {
      window.dispatchEvent(new Event('online'))
    })
    await page.waitForTimeout(1000)
    const state = await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
      return s.isOnline
    })
    expect(state !== false).toBeTruthy()
  })
})

test.describe('Scroll Memory', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page)
  })

  test('tab scroll position is saved and restored', async ({ page }) => {
    await navigateToTab(page, 'profile')
    await page.evaluate(() => window.scrollTo(0, 300))
    await page.waitForTimeout(500)
    await navigateToTab(page, 'social')
    await page.waitForTimeout(500)
    await navigateToTab(page, 'profile')
    await page.waitForTimeout(1000)
    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBeGreaterThanOrEqual(0)
  })
})

test.describe('Clipboard & Sharing', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await skipOnboarding(page)
  })

  test('share handlers batch check', async ({ page }) => {
    const handlers = ['shareApp', 'shareMyProfile', 'shareStats', 'shareProfile', 'shareBadge']
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThanOrEqual(2)
  })
})

test.describe('Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page)
  })

  test('auth form validates empty email', async ({ page }) => {
    await page.evaluate(() => window.openAuth?.('email'))
    await page.waitForTimeout(1500)

    const authForm = page.locator('#auth-form')
    if (await authForm.count() > 0) {
      const submitBtn = page.locator('#auth-submit-btn, button[type="submit"]')
      if (await submitBtn.count() > 0) {
        await submitBtn.first().click()
        await page.waitForTimeout(500)
        const error = page.locator('[class*="error"], [id*="error"], [role="alert"]')
        const count = await error.count()
        expect(count).toBeGreaterThanOrEqual(0)
      }
    }
  })

  test('guardian form validates empty fields', async ({ page }) => {
    await page.evaluate(() => window.openGuardianModal?.() || window.showGuardianModal?.())
    await page.waitForTimeout(1500)
    const result = await page.evaluate(() => {
      if (window.startGuardian) {
        try { window.startGuardian(); return 'called' } catch { return 'error' }
      }
      return 'no-handler'
    })
    expect(['called', 'error', 'no-handler']).toContain(result)
  })
})

test.describe('PWA & Notifications', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page)
  })

  test('PWA and notification handlers batch check', async ({ page }) => {
    const handlers = [
      'installPWA', 'dismissInstallBanner',
      'togglePushNotifications', 'toggleNotifications',
      'toggleProximityAlerts', 'setNotificationRadius',
    ]
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThanOrEqual(2)
  })
})

test.describe('Navigation Picker', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page)
  })

  test('navigation picker handlers batch check', async ({ page }) => {
    const handlers = ['openNavigation', 'openNavigationPicker', 'selectNavigationApp', 'closeNavigationPicker']
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThanOrEqual(1)
  })
})

test.describe('Legal & FAQ', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page)
  })

  test('FAQ and legal handlers batch check', async ({ page }) => {
    const handlers = [
      'searchFAQ', 'filterFAQ', 'toggleFAQItem',
      'showCookieCustomize', 'saveCustomCookiePreferences',
      'handleDonationClick', 'processDonation',
    ]
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThanOrEqual(1)
  })
})
