import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — guardianSendAlert triggers the guardian alert (shows a toast).
 * Boot handler (handlers/guardian.js).
 */
async function boot(page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('spothitch_welcomed', 'true')
      localStorage.setItem('spothitch_age_verified', 'true')
      localStorage.setItem('spothitch_cookie_consent', 'true')
      localStorage.setItem('spothitch_landing_seen', 'true')
    } catch { /* ignore */ }
  })
  await page.goto('/', { waitUntil: 'load', timeout: 30000 }).catch(() => {})
  await page.waitForFunction(() => typeof window.setState === 'function', { timeout: 15000 })
}

test('guardianSendAlert shows a toast', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.guardianSendAlert === 'function', { timeout: 15000 })
  await page.evaluate(() => { window.__toasted = false; window.showToast = () => { window.__toasted = true } })
  await page.evaluate(() => window.guardianSendAlert())
  await expect.poll(() => page.evaluate(() => window.__toasted), { timeout: 8000 }).toBe(true)
})
