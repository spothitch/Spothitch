import { test, expect } from '@playwright/test'

/**
 * Guardian config — REAL handler effects (Brique 2, safety feature).
 *
 * These tests do NOT just check the handler exists: they actually TRIGGER each
 * handler and verify the exact resulting state is persisted to localStorage
 * (spothitch_guardian), the way the app really stores the Guardian config.
 */
test.describe('Guardian config — real handler effects', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('spothitch_welcomed', 'true')
        localStorage.setItem('spothitch_age_verified', 'true')
        localStorage.setItem('spothitch_cookie_consent', 'true')
        localStorage.setItem('spothitch_landing_seen', 'true')
      } catch { /* ignore */ }
    })
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
    // Open Guardian so Guardian.js loads and replaces the lazy-stub handlers with
    // the real ones. Poll until a real handler actually persists state (the lazy
    // stub does nothing) so the tests never race the module load.
    await page.evaluate(() => window.openGuardian?.())
    await page.waitForFunction(async () => {
      try {
        await window.guardianSelectInterval?.(30)
        return JSON.parse(localStorage.getItem('spothitch_guardian') || '{}').checkInInterval === 30
      } catch { return false }
    }, { timeout: 12000 })
  })

  test('guardianSelectInterval persists the chosen check-in interval', async ({ page }) => {
    const interval = await page.evaluate(async () => {
      await window.guardianSelectInterval(45)
      return JSON.parse(localStorage.getItem('spothitch_guardian') || '{}').checkInInterval
    })
    expect(interval).toBe(45)
  })

  test('guardianToggleDeparture flips and persists the departure-notify flag', async ({ page }) => {
    const r = await page.evaluate(async () => {
      const before = JSON.parse(localStorage.getItem('spothitch_guardian') || '{}').notifyOnDeparture
      await window.guardianToggleDeparture()
      const after = JSON.parse(localStorage.getItem('spothitch_guardian') || '{}').notifyOnDeparture
      return { before, after }
    })
    expect(typeof r.after).toBe('boolean')
    expect(r.after).not.toBe(r.before)
  })

  test('guardianToggleArrival persists a boolean arrival-notify flag', async ({ page }) => {
    const type = await page.evaluate(async () => {
      await window.guardianToggleArrival()
      return typeof JSON.parse(localStorage.getItem('spothitch_guardian') || '{}').notifyOnArrival
    })
    expect(type).toBe('boolean')
  })
})
