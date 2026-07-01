import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — a couple more locally-verifiable handlers:
 *  - setDocumentType mutates window.identityVerificationState (identity flow).
 *  - openExportData actually fires a JSON data-export download (RGPD portability).
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
    ok = await page.waitForFunction(
      (n) => typeof window[n] === 'function', handlerName, { timeout: 10000 },
    ).then(() => true).catch(() => false)
  }
  expect(ok, `handler ${handlerName} should register`).toBe(true)
}

test('setDocumentType records the chosen document type in the verification state', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openUntil(page, () => window.setState({ showIdentityVerification: true }), 'setDocumentType')
  await page.evaluate(() => window.setDocumentType('passport'))
  expect(await page.evaluate(() => window.identityVerificationState.documentType)).toBe('passport')
})

test('openExportData starts a JSON data-export download (RGPD)', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openUntil(page, () => { window.setState({ isLoggedIn: true }); window.changeTab('profil') }, 'openExportData')
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 10000 }),
    page.evaluate(() => window.openExportData()),
  ])
  expect(download.suggestedFilename()).toMatch(/^spothitch-data-.*\.json$/)
})
