import { test, expect } from '@playwright/test'

/**
 * REGRESSION (bug reported 2026-07-02): validating an existing spot ("Mon expérience / J'ai fait du
 * stop ici") must NOT show the "create a new spot / nearby duplicate" dialog — the user is reviewing
 * THAT spot, not creating a new one. The nearby-duplicate check at step 1 → step 2 would otherwise
 * find the very spot being validated (within 500m) and prompt to create a second one.
 *
 * Fix: skip the duplicate check when state.addSpotValidateId is set. This test drives the exact
 * step-1→step-2 transition in validate mode with a nearby spot and asserts NO dialog + advance to
 * step 2. (Uses state.addSpotValidateId, which survives spotFormData resets — unlike the older
 * spotFormData._duplicateConfirmed guard.)
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

test('validating an existing spot does NOT trigger the create-duplicate dialog', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  // Open AddSpot in VALIDATE mode for spot1, with spot1 itself nearby in the spots list.
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({
      showAddSpot: true, addSpotStep: 1, addSpotValidateId: 'spot1',
      nearbySpotChoiceData: null,
      spots: [{ id: 'spot1', lat: 48.8566, lng: 2.3522, spotType: 'highway' }],
    }))
    ok = await page.waitForFunction(() => typeof window.addSpotNextStep === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'addSpotNextStep should register').toBe(true)

  // spotFormData as after opening a validation (position on the existing spot), WITHOUT the
  // _duplicateConfirmed flag — reproduces the reset scenario that surfaced the bug.
  await page.evaluate(() => {
    window.spotFormData = {
      ...(window.spotFormData || {}),
      spotType: 'highway', lat: 48.8566, lng: 2.3522, departureCity: 'Paris',
      extraDestinations: [],
    }
    delete window.spotFormData._duplicateConfirmed
  })

  await page.evaluate(() => window.addSpotNextStep())

  // The create/validate duplicate dialog must NOT appear...
  await page.waitForTimeout(1200)
  expect(await page.evaluate(() => window.getState().nearbySpotChoiceData)).toBe(null)
  // ...and the wizard advances to step 2 (the review/experience form).
  expect(await page.evaluate(() => window.getState().addSpotStep)).toBe(2)
})
