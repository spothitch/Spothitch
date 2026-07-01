import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — saved-trip journal handlers (Voyage view). Effect is on the
 * `spothitch_saved_trips` localStorage list. Each test seeds trips, opens the voyage panel so the
 * REAL handler loads, runs it, then asserts the list really changed.
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

async function openVoyage(page, handlerName) {
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => { window.setState({ isLoggedIn: true }); window.changeTab('voyage') })
    ok = await page.waitForFunction(
      (n) => typeof window[n] === 'function', handlerName, { timeout: 10000 },
    ).then(() => true).catch(() => false)
  }
  expect(ok, `handler ${handlerName} should register`).toBe(true)
}

const seedTrips = (page) => page.evaluate(() => localStorage.setItem(
  'spothitch_saved_trips',
  JSON.stringify([
    { from: 'Paris, France', to: 'Lyon, France', public: false },
    { from: 'Berlin, DE', to: 'Praha, CZ', public: false },
  ]),
))
const trips = (page) => page.evaluate(() =>
  JSON.parse(localStorage.getItem('spothitch_saved_trips') || '[]'))

test('toggleTripPublic flips the public flag of a saved trip', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openVoyage(page, 'toggleTripPublic')
  await seedTrips(page)
  await page.evaluate(() => window.toggleTripPublic(0))
  await expect.poll(async () => (await trips(page))[0]?.public, { timeout: 8000 }).toBe(true)
  // Second trip untouched
  expect((await trips(page))[1]?.public).toBe(false)
})

test('deleteJournalTrip removes the trip after confirmation', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  page.on('dialog', (d) => d.accept())
  await openVoyage(page, 'deleteJournalTrip')
  await seedTrips(page)
  expect((await trips(page)).length).toBe(2)
  await page.evaluate(() => window.deleteJournalTrip(0))
  await expect.poll(async () => (await trips(page)).length, { timeout: 8000 }).toBe(1)
  // The remaining trip is the one that wasn't deleted
  expect((await trips(page))[0]?.to).toBe('Praha, CZ')
})
