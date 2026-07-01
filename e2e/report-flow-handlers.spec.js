import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — report/moderation flow. These are lazy-delegation handlers
 * (main.js stub → import moderation.js → real handler). Real state effects:
 *  - openReport opens the report modal (showReport + reportType).
 *  - selectReportReason records the chosen reason.
 *  - closeReport clears the report state.
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

const st = (page, key) => page.evaluate((k) => window.getState()[k], key)

test('report flow: openReport → selectReportReason → closeReport', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.openReport === 'function', { timeout: 15000 })

  // Open the report modal for a spot (lazy-loads moderation.js, then opens).
  await page.evaluate(() => { window.openReport('spot', 'spot123'); return true })
  await expect.poll(() => st(page, 'showReport'), { timeout: 8000 }).toBe(true)
  expect(await st(page, 'reportType')).toBe('spot')

  // Pick a reason.
  await page.evaluate(() => { window.selectReportReason('spam'); return true })
  await expect.poll(() => st(page, 'selectedReportReason'), { timeout: 8000 }).toBe('spam')

  // Close clears the report state.
  await page.evaluate(() => window.closeReport())
  await expect.poll(() => st(page, 'showReport'), { timeout: 8000 }).toBe(false)
  expect(await st(page, 'selectedReportReason')).toBe(null)
})
