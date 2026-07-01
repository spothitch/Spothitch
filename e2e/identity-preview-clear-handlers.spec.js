import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — identity-verification preview clearing.
 *  - clearDocumentPreview resets identityVerificationState.documentPreview.
 *  - clearSelfieIdPhoto(step) nulls the selfie / id-card / selfie-with-id photo per step.
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

async function openVerif(page, handlerName) {
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ showIdentityVerification: true }))
    ok = await page.waitForFunction((n) => typeof window[n] === 'function', handlerName, { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, `handler ${handlerName} should register`).toBe(true)
}

test('clearDocumentPreview resets the document preview', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openVerif(page, 'clearDocumentPreview')
  await page.evaluate(() => { window.identityVerificationState.documentPreview = 'data:image/png;base64,AAAA' })
  await page.evaluate(() => window.clearDocumentPreview())
  expect(await page.evaluate(() => window.identityVerificationState.documentPreview)).toBe(null)
})

test('clearSelfieIdPhoto nulls the photo for the given step', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openVerif(page, 'clearSelfieIdPhoto')
  await page.evaluate(() => {
    const s = window.identityVerificationState
    s.selfiePhoto = 'a'; s.idCardPhoto = 'b'; s.selfieWithIdPhoto = 'c'
  })
  await page.evaluate(() => window.clearSelfieIdPhoto(2))
  let s = await page.evaluate(() => {
    const x = window.identityVerificationState
    return { selfie: x.selfiePhoto, id: x.idCardPhoto, both: x.selfieWithIdPhoto }
  })
  expect(s).toEqual({ selfie: 'a', id: null, both: 'c' })

  await page.evaluate(() => window.clearSelfieIdPhoto(1))
  await page.evaluate(() => window.clearSelfieIdPhoto(3))
  s = await page.evaluate(() => {
    const x = window.identityVerificationState
    return { selfie: x.selfiePhoto, id: x.idCardPhoto, both: x.selfieWithIdPhoto }
  })
  expect(s).toEqual({ selfie: null, id: null, both: null })
})
