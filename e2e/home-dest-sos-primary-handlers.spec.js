import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — home destination selection + SOS primary contact.
 *  - homeSelectDestination sets state.homeSearchLabel; homeClearDestination clears it.
 *  - sosSetPrimaryContact writes/toggles `spothitch_sos_primary` (raw localStorage).
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

async function waitHandler(page, name, opener) {
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    if (opener) await page.evaluate(opener)
    ok = await page.waitForFunction((n) => typeof window[n] === 'function', name, { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, `handler ${name} should register`).toBe(true)
}

test('homeSelectDestination sets the search label, homeClearDestination clears it', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await waitHandler(page, 'homeSelectDestination')
  await page.evaluate(() => window.homeSelectDestination(48.8566, 2.3522, 'Paris'))
  await expect.poll(async () => page.evaluate(() => window.getState().homeSearchLabel), { timeout: 8000 }).toBe('Paris')
  await page.evaluate(() => window.homeClearDestination())
  await expect.poll(async () => page.evaluate(() => window.getState().homeSearchLabel), { timeout: 8000 }).toBe('')
})

test('sosSetPrimaryContact sets then toggles off the primary contact index', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await waitHandler(page, 'sosSetPrimaryContact', () => window.setState({ showSOS: true }))
  await page.evaluate(() => window.sosSetPrimaryContact(2))
  expect(await page.evaluate(() => localStorage.getItem('spothitch_sos_primary'))).toBe('2')
  // Selecting the same index again clears it
  await page.evaluate(() => window.sosSetPrimaryContact(2))
  expect(await page.evaluate(() => localStorage.getItem('spothitch_sos_primary'))).toBe(null)
})
