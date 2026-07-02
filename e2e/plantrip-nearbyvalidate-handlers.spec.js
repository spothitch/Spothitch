import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — two handlers.
 *  - planTrip navigates to the voyage tab.
 *  - nearbySpotChooseValidate closes AddSpot to validate an existing nearby spot.
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

test('planTrip navigates to the voyage tab', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.planTrip === 'function', { timeout: 15000 })
  await page.evaluate(() => window.setState({ isLoggedIn: true, activeTab: 'map' }))
  await page.evaluate(() => window.planTrip())
  await expect.poll(() => page.evaluate(() => window.getState().activeTab), { timeout: 8000 }).toBe('voyage')
})

test('nearbySpotChooseValidate closes AddSpot to validate the existing spot', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ showAddSpot: true }))
    ok = await page.waitForFunction(() => typeof window.nearbySpotChooseValidate === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'nearbySpotChooseValidate should register').toBe(true)
  await page.evaluate(() => window.setState({ showAddSpot: true, nearbySpotChoiceData: { id: 's1' } }))
  await page.evaluate(() => window.nearbySpotChooseValidate('s1'))
  await expect.poll(() => page.evaluate(() => window.getState().showAddSpot), { timeout: 8000 }).toBe(false)
  expect(await page.evaluate(() => window.getState().nearbySpotChoiceData)).toBe(null)
})
