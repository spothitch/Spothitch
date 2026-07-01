import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — two handlers.
 *  - requireProfile returns true when a username exists, else opens the welcome flow + returns false.
 *  - checkStreetViewForNewSpot opens Street View (window.open spied) + marks the form checked.
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

test('requireProfile gates on the username', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.requireProfile === 'function', { timeout: 15000 })
  // No username → false + welcome opened.
  await page.evaluate(() => window.setState({ username: null, showWelcome: false }))
  expect(await page.evaluate(() => window.requireProfile('addSpot'))).toBe(false)
  expect(await page.evaluate(() => window.getState().showWelcome)).toBe(true)
  // With username → true.
  await page.evaluate(() => window.setState({ username: 'alice' }))
  expect(await page.evaluate(() => window.requireProfile('addSpot'))).toBe(true)
})

test('checkStreetViewForNewSpot opens Street View and marks the form', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ showAddSpot: true }))
    ok = await page.waitForFunction(() => typeof window.checkStreetViewForNewSpot === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'checkStreetViewForNewSpot should register').toBe(true)
  await page.evaluate(() => { window.__svUrl = null; window.open = (u) => { window.__svUrl = u; return null }; window.spotFormData._streetViewChecked = false })

  // Invalid coords → no-op.
  await page.evaluate(() => window.checkStreetViewForNewSpot('x', 'y'))
  expect(await page.evaluate(() => window.spotFormData._streetViewChecked)).toBe(false)

  // Valid coords → opens Street View + marks checked.
  await page.evaluate(() => window.checkStreetViewForNewSpot(48.8566, 2.3522))
  expect(await page.evaluate(() => window.__svUrl)).toContain('map_action=pano')
  expect(await page.evaluate(() => window.spotFormData._streetViewChecked)).toBe(true)
})
