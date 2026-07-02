import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — two handlers.
 *  - featureIntroCTA marks the feature seen (spothitch_feature_seen) + runs its action (boot).
 *  - closeCompleteProfile closes the complete-profile modal (state.showCompleteProfile → false).
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

test('featureIntroCTA marks the feature as seen', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.featureIntroCTA === 'function', { timeout: 15000 })
  await page.evaluate(() => localStorage.removeItem('spothitch_feature_seen'))
  await page.evaluate(() => window.featureIntroCTA('carte'))
  await expect.poll(
    () => page.evaluate(() => { try { return 'carte' in JSON.parse(localStorage.getItem('spothitch_feature_seen') || '{}') } catch { return false } }),
    { timeout: 8000 },
  ).toBe(true)
})

test('closeCompleteProfile closes the complete-profile modal', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  // Load Auth.js (owner) via the complete-profile modal flag.
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ showCompleteProfile: true }))
    ok = await page.waitForFunction(() => typeof window.closeCompleteProfile === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'closeCompleteProfile should register').toBe(true)
  await page.evaluate(() => window.setState({ showCompleteProfile: true }))
  await page.evaluate(() => window.closeCompleteProfile())
  await expect.poll(() => page.evaluate(() => window.getState().showCompleteProfile), { timeout: 8000 }).toBe(false)
})
