import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — submitEditTrip. Edits a saved trip in place: updates
 * localStorage spothitch_saved_trips (before the optional Firestore updateTrip sync).
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

test('submitEditTrip updates the saved trip in localStorage', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => { window.setState({ isLoggedIn: true, user: { uid: 'local-user' } }); window.changeTab('voyage') })
    ok = await page.waitForFunction(() => typeof window.submitEditTrip === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'submitEditTrip should register').toBe(true)

  await page.evaluate(() => localStorage.setItem('spothitch_saved_trips', JSON.stringify([
    { id: 't1', from: 'Paris', to: 'Lyon', date: '2026-01-01', distance: 400, lifts: 2, notes: 'old' },
  ])))

  // All in one evaluate → no real edit-modal render shadowing the injected inputs.
  await page.evaluate(() => {
    window.requireOnline = () => true
    window.setState({ editTripIndex: 0 })
    const mk = (id, val, tag = 'input') => {
      let el = document.getElementById(id)
      if (!el) { el = document.createElement(tag); el.id = id; document.body.appendChild(el) }
      el.value = val
    }
    mk('edit-trip-from', 'Marseille')
    mk('edit-trip-to', 'Nice')
    mk('edit-trip-date', '2026-05-05')
    mk('edit-trip-km', '200')
    mk('edit-trip-lifts', '5')
    mk('edit-trip-notes', 'updated notes', 'textarea')
    window.submitEditTrip()
  })

  const trip = () => page.evaluate(() => JSON.parse(localStorage.getItem('spothitch_saved_trips') || '[]')[0])
  await expect.poll(async () => (await trip())?.from, { timeout: 8000 }).toBe('Marseille')
  const t = await trip()
  expect(t.to).toBe('Nice')
  expect(t.lifts).toBe(5)
})
