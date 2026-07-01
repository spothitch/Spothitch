import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — AddSpot wizard handlers.
 *  - addSpotPrevStep decrements state.addSpotStep (clamped at 1).
 *  - onSpotTypeChange sets window.spotFormData.spotType.
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

async function openAddSpot(page, handlerName) {
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ showAddSpot: true }))
    ok = await page.waitForFunction((n) => typeof window[n] === 'function', handlerName, { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, `handler ${handlerName} should register`).toBe(true)
}

test('addSpotPrevStep decrements the wizard step and clamps at 1', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openAddSpot(page, 'addSpotPrevStep')
  await page.evaluate(() => window.setState({ addSpotStep: 3 }))
  await page.evaluate(() => { window.addSpotPrevStep(); return true })
  await expect.poll(() => page.evaluate(() => window.getState().addSpotStep), { timeout: 8000 }).toBe(2)
  // Down to 1, then clamp
  await page.evaluate(() => window.setState({ addSpotStep: 1 }))
  await page.evaluate(() => { window.addSpotPrevStep(); return true })
  expect(await page.evaluate(() => window.getState().addSpotStep)).toBe(1)
})

test('onSpotTypeChange sets the spot type in the form data', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openAddSpot(page, 'onSpotTypeChange')
  await page.evaluate(() => window.onSpotTypeChange('highway'))
  expect(await page.evaluate(() => window.spotFormData.spotType)).toBe('highway')
})
