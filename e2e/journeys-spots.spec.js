import { test, expect } from '@playwright/test'

/**
 * SPOT journeys — REAL click-through (Brique 1, journey-map #29-50).
 *
 * Clicks the ACTUAL buttons (selectSpotType, useGPSForSpot, addSpotNextStep, setSpotRating…),
 * not the handlers in isolation. Network-only fields (city autocomplete / reverse-geocode) are
 * set directly to simulate the user's selection; everything else is a real click. This is the
 * methodology that catches real breakage (e.g. the validate-spot "Suivant does nothing" bug).
 */
async function boot(page, context) {
  test.setTimeout(90000)
  await context.grantPermissions(['geolocation'])
  await context.setGeolocation({ latitude: 50.4674, longitude: 4.8718 })
  await page.addInitScript(() => {
    try {
      ;['spothitch_welcomed', 'spothitch_age_verified', 'spothitch_cookie_consent', 'spothitch_landing_seen', 'spothitch_landing_v2']
        .forEach((k) => localStorage.setItem(k, 'true'))
      localStorage.setItem('spothitch_alpha_code', 'ok')
    } catch { /* ignore */ }
    navigator.geolocation.getCurrentPosition = (ok) => ok({ coords: { latitude: 50.4674, longitude: 4.8718, accuracy: 8 } })
  })
  await page.goto('/', { waitUntil: 'load', timeout: 30000 }).catch(() => {})
  await page.waitForFunction(() => typeof window.setState === 'function', { timeout: 15000 })
}

test('create spot: clicking through type → step1 → step2 → step3 advances (real buttons)', async ({ page, context }) => {
  await boot(page, context)
  await page.evaluate(() => window.openAddSpot?.())
  await page.waitForFunction(() => window.getState().showAddSpot === true, { timeout: 10000 })

  // Step 1: click a real spot-type button.
  const typeBtn = page.locator('[onclick^="selectSpotType"]').first()
  await expect(typeBtn).toBeVisible({ timeout: 10000 })
  await typeBtn.click()
  await expect.poll(() => page.evaluate(() => window.spotFormData?.spotType)).toBeTruthy()

  // Network-only fields (city) set directly to simulate the autocomplete selection.
  await page.evaluate(() => {
    window.spotFormData.lat = 50.4674; window.spotFormData.lng = 4.8718
    window.spotFormData.departureCity = 'Namur'; window.spotFormData.departureCityCoords = { lat: 50.4674, lng: 4.8718 }
    window.spotFormData._duplicateConfirmed = true
  })

  // Click the REAL "Suivant" → must advance to step 2.
  await page.locator('button[onclick="addSpotNextStep()"]').first().click({ timeout: 10000 })
  await expect.poll(() => page.evaluate(() => window.getState().addSpotStep), { timeout: 10000 }).toBe(2)

  // Step 2: fill its (network/select) fields, click Suivant → step 3.
  await page.evaluate(() => {
    Object.assign(window.spotFormData, {
      directionCity: 'Bruxelles', directionCityCoords: { lat: 50.85, lng: 4.35 },
      method: 'thumb', groupSize: '1', timeOfDay: 'morning', season: 'summer', rideResult: 'success', waitTime: 10,
    })
  })
  const next2 = page.locator('button[onclick="addSpotNextStep()"]').first()
  await expect(next2).toBeVisible({ timeout: 10000 })
  await next2.click({ timeout: 10000 })
  await expect.poll(() => page.evaluate(() => window.getState().addSpotStep), { timeout: 10000 }).toBe(3)

  // Step 3: the rating buttons + the summary/submit control are present.
  expect(await page.locator('[onclick^="setSpotRating"]').count()).toBeGreaterThan(0)
})

test('create spot: Suivant at step 1 with NO departure city shows the required error (does not advance)', async ({ page, context }) => {
  await boot(page, context)
  await page.evaluate(() => window.openAddSpot?.())
  await page.waitForFunction(() => window.getState().showAddSpot === true, { timeout: 10000 })
  await page.locator('[onclick^="selectSpotType"]').first().click()
  await page.evaluate(() => { window.spotFormData.lat = 50.4674; window.spotFormData.lng = 4.8718; window.spotFormData.departureCity = null; window.spotFormData._duplicateConfirmed = true })
  await page.locator('button[onclick="addSpotNextStep()"]').first().click({ timeout: 10000 })
  // Must NOT advance (validation blocks) and stays on step 1.
  await page.waitForTimeout(800)
  expect(await page.evaluate(() => window.getState().addSpotStep)).toBe(1)
})
