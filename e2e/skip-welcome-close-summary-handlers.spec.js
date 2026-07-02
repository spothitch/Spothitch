import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — two handlers.
 *  - skipWelcome dismisses the welcome/landing once logged in (state.showWelcome → false).
 *  - closeSpotSummary removes the #spot-summary-overlay (AddSpot).
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

test('skipWelcome dismisses the welcome when logged in', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.skipWelcome === 'function', { timeout: 15000 })
  await page.evaluate(() => window.setState({ isLoggedIn: true, showWelcome: true }))
  await page.evaluate(() => window.skipWelcome())
  await expect.poll(() => page.evaluate(() => window.getState().showWelcome), { timeout: 8000 }).toBe(false)
})

test('closeSpotSummary removes the spot summary overlay', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ showAddSpot: true }))
    ok = await page.waitForFunction(() => typeof window.closeSpotSummary === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'closeSpotSummary should register').toBe(true)
  await page.evaluate(() => {
    const o = document.createElement('div'); o.id = 'spot-summary-overlay'; document.body.appendChild(o)
  })
  await page.evaluate(() => window.closeSpotSummary())
  await expect.poll(() => page.evaluate(() => !!document.getElementById('spot-summary-overlay')), { timeout: 8000 }).toBe(false)
})
