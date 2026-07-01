import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — handleCheckinPhoto. FileReader-decodes the picked file into
 * state.checkinPhotoData (the check-in modal loads when state.checkinSpot is set).
 */
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
)

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

test('handleCheckinPhoto decodes the file into checkinPhotoData', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  // Open the check-in modal so the lazy handler registers.
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ checkinSpot: { id: 'spot1', name: 'Test Spot' } }))
    ok = await page.waitForFunction(() => typeof window.handleCheckinPhoto === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'handleCheckinPhoto should register').toBe(true)

  await page.evaluate(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.id = 'e2e-upload-input'
    document.body.appendChild(input)
  })
  await page.setInputFiles('#e2e-upload-input', { name: 'checkin.png', mimeType: 'image/png', buffer: PNG })
  await page.evaluate(() => window.handleCheckinPhoto({ target: document.getElementById('e2e-upload-input') }))
  await expect.poll(() => page.evaluate(() => window.getState().checkinPhotoData), { timeout: 8000 })
    .toMatch(/^data:image\/png/)
})
