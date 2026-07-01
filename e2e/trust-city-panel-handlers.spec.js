import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — trust + city-panel handlers (boot).
 *  - getTrustLevel reads state.trustLevel (fallback verificationLevel, else 0).
 *  - selectCityRoute sets state.selectedRoute.
 *  - closeCityPanel clears the city-panel selection state.
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

test('getTrustLevel reads the trust level from state', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.getTrustLevel === 'function', { timeout: 15000 })
  expect(await page.evaluate(() => window.getTrustLevel())).toBe(0)
  await page.evaluate(() => window.setState({ trustLevel: 4 }))
  expect(await page.evaluate(() => window.getTrustLevel())).toBe(4)
})

test('selectCityRoute sets the selected route', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.selectCityRoute === 'function', { timeout: 15000 })
  await page.evaluate(() => window.selectCityRoute('paris', 'north'))
  expect(await page.evaluate(() => window.getState().selectedRoute)).toBe('north')
})

test('closeCityPanel clears the city-panel selection', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.closeCityPanel === 'function', { timeout: 15000 })
  await page.evaluate(() => window.setState({ selectedCity: 'paris', selectedRoute: 'north', cityData: { lat: 48 } }))
  await page.evaluate(() => window.closeCityPanel())
  const s = await page.evaluate(() => {
    const g = window.getState()
    return { city: g.selectedCity, route: g.selectedRoute, data: g.cityData }
  })
  expect(s).toEqual({ city: null, route: null, data: null })
})
