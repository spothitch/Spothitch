import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — two handlers.
 *  - openNavigation opens a Google Maps directions URL (spied via window.open).
 *  - nearbySpotChooseCreate confirms a non-duplicate spot (spotFormData._duplicateConfirmed).
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

test('openNavigation opens a Google Maps directions link', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.openNavigation === 'function', { timeout: 15000 })
  await page.evaluate(() => { window.__openedUrl = null; window.open = (url) => { window.__openedUrl = url; return null } })
  await page.evaluate(() => window.openNavigation(48.8566, 2.3522))
  const url = await page.evaluate(() => window.__openedUrl)
  expect(url).toContain('google.com/maps/dir')
  expect(url).toContain('48.8566,2.3522')
})

test('nearbySpotChooseCreate confirms a non-duplicate spot', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ showAddSpot: true }))
    ok = await page.waitForFunction(() => typeof window.nearbySpotChooseCreate === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'nearbySpotChooseCreate should register').toBe(true)
  await page.evaluate(() => { window.spotFormData._duplicateConfirmed = false })
  await page.evaluate(() => window.nearbySpotChooseCreate())
  expect(await page.evaluate(() => window.spotFormData._duplicateConfirmed)).toBe(true)
})
