import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — two boot handlers.
 *  - handleSearch sets state.searchQuery (debounced).
 *  - openValidateSpot opens AddSpot to validate an existing spot.
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

test('handleSearch sets the search query (debounced)', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.handleSearch === 'function', { timeout: 15000 })
  await page.evaluate(() => window.handleSearch('Paris'))
  await expect.poll(() => page.evaluate(() => window.getState().searchQuery), { timeout: 8000 }).toBe('Paris')
})

test('openValidateSpot opens AddSpot to validate a spot', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.openValidateSpot === 'function', { timeout: 15000 })
  await page.evaluate(() => window.setState({ showAddSpot: false }))
  await page.evaluate(() => { window.openValidateSpot('spot1'); return true })
  await expect.poll(() => page.evaluate(() => window.getState().showAddSpot), { timeout: 8000 }).toBe(true)
})
