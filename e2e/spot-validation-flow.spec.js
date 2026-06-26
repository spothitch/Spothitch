import { test, expect } from '@playwright/test'

/**
 * Spot validation flow — REAL button click (Brique 1, regression).
 *
 * Antoine's first manual test failed: validating a spot, at step 1 he changed nothing and
 * clicked "Suivant" and nothing happened. Root cause: the nearby-duplicate detection ran during
 * VALIDATION and found the very spot being validated, opening a "Spot nearby!" modal instead of
 * advancing. Fix: openTestSpot marks _duplicateConfirmed so validation skips that check.
 *
 * This test CLICKS THE ACTUAL "Suivant" button (not the handler) and asserts the flow advances.
 */
test('validating a spot: clicking Suivant at step 1 advances to step 2', async ({ page, context }) => {
  test.setTimeout(60000)
  await context.grantPermissions(['geolocation'])
  await context.setGeolocation({ latitude: 50.4674, longitude: 4.8718 }) // Namur
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

  // Seed the spot in Namur the user is validating.
  await page.evaluate(() => {
    const s = { id: 'namur1', from: 'Namur', spotType: 'custom', coordinates: { lat: 50.4674, lng: 4.8718 }, lat: 50.4674, lng: 4.8718 }
    window.setState({ spots: [s], selectedSpot: s })
  })
  await page.waitForFunction(() => typeof window.openTestSpot === 'function', { timeout: 15000 })
  await page.evaluate(() => window.openTestSpot('namur1'))

  // Step 1 form is shown.
  await expect.poll(() => page.evaluate(() => window.getState().addSpotStep), { timeout: 10000 }).toBe(1)
  const suivant = page.locator('button[onclick="addSpotNextStep()"]').first()
  await expect(suivant).toBeVisible({ timeout: 10000 })

  // Click the REAL button — like a user. It must advance to step 2 (NOT show a "Spot nearby!" modal).
  await suivant.click()
  await expect.poll(() => page.evaluate(() => window.getState().addSpotStep), { timeout: 10000 }).toBe(2)
  expect(await page.evaluate(() => !!window.getState().nearbySpotChoiceData)).toBe(false)
})
