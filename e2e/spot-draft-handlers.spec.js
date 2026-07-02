import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — spot draft handlers.
 *  - openSpotDraft opens AddSpot for an existing draft (state.showAddSpot + editDraftId).
 *  - saveDraftAndClose saves the form as a draft (spothitch_spot_drafts) + closes AddSpot.
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

test('openSpotDraft opens AddSpot for a draft', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.openSpotDraft === 'function', { timeout: 15000 })
  await page.evaluate(() => window.setState({ showAddSpot: false, editDraftId: null }))
  await page.evaluate(() => window.openSpotDraft('draft_x'))
  await expect.poll(() => page.evaluate(() => window.getState().showAddSpot), { timeout: 8000 }).toBe(true)
  expect(await page.evaluate(() => window.getState().editDraftId)).toBe('draft_x')
})

test('saveDraftAndClose saves a draft and closes AddSpot', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ showAddSpot: true }))
    ok = await page.waitForFunction(() => typeof window.saveDraftAndClose === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'saveDraftAndClose should register').toBe(true)
  await page.evaluate(() => {
    window.requireOnline = () => true
    localStorage.setItem('spothitch_spot_drafts', '[]')
    window.spotFormData = { ...(window.spotFormData || {}), spotType: 'highway', lat: 48.85, lng: 2.35, departureCity: 'Paris' }
    window.saveDraftAndClose()
  })
  await expect.poll(
    () => page.evaluate(() => { try { return JSON.parse(localStorage.getItem('spothitch_spot_drafts') || '[]').length } catch { return 0 } }),
    { timeout: 8000 },
  ).toBeGreaterThan(0)
  await expect.poll(() => page.evaluate(() => window.getState().showAddSpot), { timeout: 8000 }).toBe(false)
})
