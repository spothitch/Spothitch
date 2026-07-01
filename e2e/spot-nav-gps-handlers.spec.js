import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — two handlers.
 *  - startSpotNavigation clears state.selectedSpot then starts navigation (window.open spied).
 *  - useGPSForSpot writes the GPS coords into window.spotFormData (getCurrentPosition mocked).
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

test('startSpotNavigation clears the selected spot (and no-coords is a no-op)', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.startSpotNavigation === 'function', { timeout: 15000 })
  await page.evaluate(() => { window.open = () => null })

  // No coords → no state change.
  await page.evaluate(() => window.setState({ selectedSpot: { id: 'keep' } }))
  await page.evaluate(() => window.startSpotNavigation())
  expect(await page.evaluate(() => window.getState().selectedSpot?.id)).toBe('keep')

  // With coords → selectedSpot cleared.
  await page.evaluate(() => window.startSpotNavigation(48.8566, 2.3522, 'Spot'))
  await expect.poll(() => page.evaluate(() => window.getState().selectedSpot), { timeout: 8000 }).toBe(null)
})

test('useGPSForSpot writes the mocked GPS coords into the spot form', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ showAddSpot: true }))
    ok = await page.waitForFunction(() => typeof window.useGPSForSpot === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'useGPSForSpot should register').toBe(true)

  await page.evaluate(() => {
    window.spotFormData.lat = null
    navigator.geolocation.getCurrentPosition = (success) => success({ coords: { latitude: 45.5, longitude: 4.5 } })
  })
  await page.evaluate(() => window.useGPSForSpot())
  await expect.poll(() => page.evaluate(() => window.spotFormData.lat), { timeout: 8000 }).toBe(45.5)
  expect(await page.evaluate(() => window.spotFormData.lng)).toBe(4.5)
})
