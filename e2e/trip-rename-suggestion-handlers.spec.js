import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — Travel.js handlers (voyage panel imports Travel.js; poll).
 *  - renameSavedTrip opens the rename input overlay for a saved trip.
 *  - tripSelectSuggestion fills the trip-from/to input with the chosen suggestion.
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

async function loadVoyage(page, handlerName) {
  let ok = false
  for (let i = 0; i < 5 && !ok; i++) {
    await page.evaluate(() => { window.setState({ isLoggedIn: true }); window.changeTab('voyage') })
    ok = await page.waitForFunction((n) => typeof window[n] === 'function', handlerName, { timeout: 12000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, `handler ${handlerName} should register`).toBe(true)
}

test('renameSavedTrip opens the rename input overlay', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await loadVoyage(page, 'renameSavedTrip')
  await page.evaluate(() => localStorage.setItem('spothitch_saved_trips', JSON.stringify([{ id: 't1', from: 'A', to: 'B' }])))
  await page.evaluate(() => { window.renameSavedTrip(0); return true })
  await expect(page.locator('#spothitch-input-overlay')).toBeVisible({ timeout: 8000 })
})

test('tripSelectSuggestion fills the trip-from input', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await loadVoyage(page, 'tripSelectSuggestion')
  await page.evaluate(() => {
    if (!document.getElementById('trip-from')) {
      const i = document.createElement('input'); i.id = 'trip-from'; document.body.appendChild(i)
    }
  })
  await page.evaluate(() => window.tripSelectSuggestion('from', 'Paris, France'))
  await expect.poll(() => page.evaluate(() => document.getElementById('trip-from')?.value), { timeout: 8000 }).toBe('Paris, France')
})
