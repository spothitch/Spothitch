import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — Street View confirm handlers (SpotDetail modal).
 *  - confirmStreetViewAvailable opens the auth modal when the user isn't signed in.
 *  - doConfirmStreetView removes the confirm overlay.
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

async function openSpotDetail(page, handlerName) {
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ selectedSpot: { id: 'spot1', lat: 48.85, lng: 2.35 } }))
    ok = await page.waitForFunction((n) => typeof window[n] === 'function', handlerName, { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, `handler ${handlerName} should register`).toBe(true)
}

test('confirmStreetViewAvailable opens auth when signed out', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openSpotDetail(page, 'confirmStreetViewAvailable')
  await page.evaluate(() => window.setState({ showAuth: false }))
  await page.evaluate(() => window.confirmStreetViewAvailable('spot1'))
  await expect.poll(() => page.evaluate(() => window.getState().showAuth), { timeout: 8000 }).toBe(true)
})

test('doConfirmStreetView removes the confirm overlay', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openSpotDetail(page, 'doConfirmStreetView')
  await page.evaluate(() => {
    const o = document.createElement('div'); o.id = 'sv-confirm-overlay'; document.body.appendChild(o)
  })
  await page.evaluate(() => window.doConfirmStreetView('spot1'))
  await expect.poll(() => page.evaluate(() => !!document.getElementById('sv-confirm-overlay')), { timeout: 8000 }).toBe(false)
})
