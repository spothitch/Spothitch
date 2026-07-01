import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — file-upload handlers. They read event.target.files[0] and
 * FileReader-decode it into identityVerificationState.*Preview. We inject a real <input type=file>,
 * setInputFiles a tiny PNG, invoke the handler with that input as the event target, then assert the
 * preview becomes a data URL.
 */
// 1x1 transparent PNG
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

async function openVerif(page, handlerName) {
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ showIdentityVerification: true }))
    ok = await page.waitForFunction((n) => typeof window[n] === 'function', handlerName, { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, `handler ${handlerName} should register`).toBe(true)
}

// Inject a file input, load the PNG into it, and fire the handler with it as the event target.
async function uploadThrough(page, handlerName, previewField) {
  await page.evaluate(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.id = 'e2e-upload-input'
    document.body.appendChild(input)
  })
  await page.setInputFiles('#e2e-upload-input', { name: 'id.png', mimeType: 'image/png', buffer: PNG })
  await page.evaluate((h) => window[h]({ target: document.getElementById('e2e-upload-input') }), handlerName)
  await expect.poll(
    () => page.evaluate((f) => window.identityVerificationState[f], previewField),
    { timeout: 8000 },
  ).toMatch(/^data:image\/png/)
}

test('handlePhotoUpload decodes the file into photoPreview', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openVerif(page, 'handlePhotoUpload')
  await uploadThrough(page, 'handlePhotoUpload', 'photoPreview')
})

test('handleDocumentUpload decodes the file into documentPreview', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openVerif(page, 'handleDocumentUpload')
  await uploadThrough(page, 'handleDocumentUpload', 'documentPreview')
})
