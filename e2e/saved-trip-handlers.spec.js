import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — saved-trip handlers (Travel.js, loaded when the voyage panel
 * imports it). Poll for the real handler (it registers a moment after voyage loads).
 *  - loadSavedTrip loads a saved trip into the planner state.
 *  - deleteSavedTrip removes a saved trip from spothitch_saved_trips (confirm accepted).
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

test('loadSavedTrip loads a saved trip into the planner', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await loadVoyage(page, 'loadSavedTrip')
  await page.evaluate(() => localStorage.setItem('spothitch_saved_trips', JSON.stringify([
    { id: 't1', from: 'Paris, France', to: 'Lyon, France' },
  ])))
  await page.evaluate(() => window.loadSavedTrip(0))
  await expect.poll(() => page.evaluate(() => window.getState().tripFrom), { timeout: 8000 }).toBe('Paris, France')
  expect(await page.evaluate(() => window.getState().tripTo)).toBe('Lyon, France')
})

test('deleteSavedTrip removes a saved trip after confirmation', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  page.on('dialog', (d) => d.accept())
  await loadVoyage(page, 'deleteSavedTrip')
  await page.evaluate(() => localStorage.setItem('spothitch_saved_trips', JSON.stringify([
    { id: 't1', from: 'A', to: 'B' }, { id: 't2', from: 'C', to: 'D' },
  ])))
  await page.evaluate(() => window.deleteSavedTrip(0))
  await expect.poll(
    () => page.evaluate(() => JSON.parse(localStorage.getItem('spothitch_saved_trips') || '[]').length),
    { timeout: 8000 },
  ).toBe(1)
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('spothitch_saved_trips') || '[]')[0].id)).toBe('t2')
})
