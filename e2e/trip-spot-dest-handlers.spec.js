import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — three more handlers.
 *  - addFirstSuggestion clicks the first #city-suggestions button (boot, tripPlanner.js).
 *  - removeSpotDestination splices window.spotFormData.extraDestinations (AddSpot).
 *  - openAddTripNote opens the #trip-note-modal for a saved trip (Voyage).
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

async function openUntil(page, opener, handlerName) {
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(opener)
    ok = await page.waitForFunction((n) => typeof window[n] === 'function', handlerName, { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, `handler ${handlerName} should register`).toBe(true)
}

test('addFirstSuggestion clicks the first city suggestion', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.addFirstSuggestion === 'function', { timeout: 15000 })
  await page.evaluate(() => {
    window.__citySuggestionClicked = false
    const wrap = document.createElement('div')
    wrap.id = 'city-suggestions'
    const btn = document.createElement('button')
    btn.onclick = () => { window.__citySuggestionClicked = true }
    wrap.appendChild(btn)
    document.body.appendChild(wrap)
  })
  await page.evaluate(() => window.addFirstSuggestion())
  expect(await page.evaluate(() => window.__citySuggestionClicked)).toBe(true)
})

test('removeSpotDestination splices the extra destinations', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openUntil(page, () => window.setState({ showAddSpot: true }), 'removeSpotDestination')
  await page.evaluate(() => { window.spotFormData.extraDestinations = ['Lyon', 'Marseille'] })
  await page.evaluate(() => window.removeSpotDestination(0))
  expect(await page.evaluate(() => window.spotFormData.extraDestinations)).toEqual(['Marseille'])
})

test('openAddTripNote opens the trip-note modal for a saved trip', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openUntil(page, () => { window.setState({ isLoggedIn: true }); window.changeTab('voyage') }, 'openAddTripNote')
  await page.evaluate(() => localStorage.setItem('spothitch_saved_trips', JSON.stringify([{ from: 'Paris', to: 'Lyon' }])))
  await page.evaluate(() => window.openAddTripNote(0))
  await expect(page.locator('#trip-note-modal')).toBeVisible({ timeout: 8000 })
})
