import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — more file-upload handlers.
 *  - handleSelfieIdPhotoUpload(event, step) sets the selfie/id-card/selfie-with-id photo per step.
 *  - handlePhotoSelect(event) compresses + pushes into window.spotFormData.photos (AddSpot).
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

async function openUntil(page, opener, handlerName) {
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(opener)
    ok = await page.waitForFunction((n) => typeof window[n] === 'function', handlerName, { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, `handler ${handlerName} should register`).toBe(true)
}

async function injectFile(page) {
  await page.evaluate(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.id = 'e2e-upload-input'
    document.body.appendChild(input)
  })
  await page.setInputFiles('#e2e-upload-input', { name: 'x.png', mimeType: 'image/png', buffer: PNG })
}

test('handleSelfieIdPhotoUpload sets the id-card photo (step 2)', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openUntil(page, () => window.setState({ showIdentityVerification: true }), 'handleSelfieIdPhotoUpload')
  await injectFile(page)
  await page.evaluate(() => window.handleSelfieIdPhotoUpload({ target: document.getElementById('e2e-upload-input') }, 2))
  await expect.poll(
    () => page.evaluate(() => window.identityVerificationState.idCardPhoto),
    { timeout: 8000 },
  ).toMatch(/^data:image\/png/)
})

test('handlePhotoSelect compresses and adds a photo to the spot form', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openUntil(page, () => window.setState({ showAddSpot: true }), 'handlePhotoSelect')
  await page.evaluate(() => { window.spotFormData.photos = [] })
  await injectFile(page)
  await page.evaluate(() => window.handlePhotoSelect({ target: document.getElementById('e2e-upload-input') }))
  await expect.poll(() => page.evaluate(() => window.spotFormData.photos.length), { timeout: 8000 }).toBe(1)
  expect(await page.evaluate(() => window.spotFormData.photos[0])).toMatch(/^data:image/)
})
