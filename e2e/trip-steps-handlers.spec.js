import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — trip-planner step handlers (boot, tripPlanner.js).
 *  - moveTripStep reorders state.tripSteps.
 *  - clearTripSteps empties state.tripSteps.
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

const names = (page) => page.evaluate(() => (window.getState().tripSteps || []).map(s => s.name))

test('moveTripStep reorders the trip steps', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.moveTripStep === 'function', { timeout: 15000 })
  await page.evaluate(() => window.setState({ tripSteps: [{ name: 'A' }, { name: 'B' }, { name: 'C' }] }))
  await page.evaluate(() => window.moveTripStep(0, 2))
  await expect.poll(() => names(page), { timeout: 8000 }).toEqual(['B', 'C', 'A'])
})

test('clearTripSteps empties the trip steps', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.clearTripSteps === 'function', { timeout: 15000 })
  await page.evaluate(() => window.setState({ tripSteps: [{ name: 'A' }, { name: 'B' }] }))
  await page.evaluate(() => window.clearTripSteps())
  await expect.poll(() => names(page), { timeout: 8000 }).toEqual([])
})
