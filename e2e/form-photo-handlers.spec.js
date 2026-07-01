import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — form photo handlers.
 *  - clearPhotoPreview resets identityVerificationState.photoPreview (identity modal).
 *  - removeSpotPhoto splices a photo out of window.spotFormData.photos (AddSpot modal).
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

async function openUntil(page, opener, handlerName, tries = 4) {
  let ok = false
  for (let i = 0; i < tries && !ok; i++) {
    await page.evaluate(opener)
    ok = await page.waitForFunction((n) => typeof window[n] === 'function', handlerName, { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, `handler ${handlerName} should register`).toBe(true)
}

test('clearPhotoPreview resets the identity photo preview', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openUntil(page, () => window.setState({ showIdentityVerification: true }), 'clearPhotoPreview')
  await page.evaluate(() => { window.identityVerificationState.photoPreview = 'data:image/png;base64,AAAA' })
  await page.evaluate(() => window.clearPhotoPreview())
  expect(await page.evaluate(() => window.identityVerificationState.photoPreview)).toBe(null)
})

test('removeSpotPhoto removes the photo at the given index', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openUntil(page, () => window.setState({ showAddSpot: true }), 'removeSpotPhoto')
  await page.evaluate(() => { window.spotFormData.photos = ['p0', 'p1', 'p2'] })
  await page.evaluate(() => window.removeSpotPhoto(1))
  await expect.poll(() => page.evaluate(() => window.spotFormData.photos), { timeout: 8000 }).toEqual(['p0', 'p2'])
})
