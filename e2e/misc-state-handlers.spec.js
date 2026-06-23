import { test, expect } from '@playwright/test'

/**
 * Miscellaneous standalone handlers — REAL effect (Brique 2). These don't fit the auto
 * nets (they take args / touch the form buffer / a DOM node) but are reachable in the bare
 * app shell. Each test triggers the real handler and verifies its concrete effect.
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

test('selectAvatar stores the chosen avatar in state', async ({ page }) => {
  await boot(page)
  await page.evaluate(() => window.selectAvatar('fox-gold'))
  expect(await page.evaluate(() => window.getState().selectedAvatar)).toBe('fox-gold')
})

test('selectCityRoute stores the selected route', async ({ page }) => {
  await boot(page)
  await page.evaluate(() => window.selectCityRoute('paris', 'paris-lyon'))
  expect(await page.evaluate(() => window.getState().selectedRoute)).toBe('paris-lyon')
})

test('removeSpotDestination removes the destination from the form buffer', async ({ page }) => {
  await boot(page)
  await page.evaluate(() => {
    window.spotFormData = window.spotFormData || {}
    window.spotFormData.extraDestinations = ['Lyon', 'Marseille', 'Nice']
    window.removeSpotDestination(1) // remove 'Marseille'
  })
  const dests = await page.evaluate(() => window.spotFormData.extraDestinations)
  expect(dests).toEqual(['Lyon', 'Nice'])
})

test('clearTrip clears the trip results', async ({ page }) => {
  await boot(page)
  await page.evaluate(() => window.setState({ tripResults: { from: 'A', to: 'B' } }))
  await page.evaluate(() => window.clearTrip())
  const tr = await page.evaluate(() => window.getState().tripResults)
  expect(tr === null || tr === undefined).toBe(true)
})

test('updateDonationLink sets the PayPal link to the clamped amount', async ({ page }) => {
  await boot(page)
  const href = await page.evaluate(() => {
    const a = document.createElement('a')
    a.id = 'donation-paypal-link'
    document.body.appendChild(a)
    window.updateDonationLink(25)
    return a.href
  })
  expect(href).toContain('25EUR')
})

test('selectReportReason records the chosen reason (lazy moderation)', async ({ page }) => {
  await boot(page)
  await page.evaluate(() => window.selectReportReason('spam'))
  await page.waitForFunction(() => window.getState().selectedReportReason === 'spam', { timeout: 8000 })
  expect(await page.evaluate(() => window.getState().selectedReportReason)).toBe('spam')
})
