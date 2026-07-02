import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — three handlers of different kinds.
 *  - exportFeedbackCSV downloads a CSV of admin feedback data (download event).
 *  - closeReportModal closes the report modal (state.showReport → false).
 *  - editSocialLinks opens the social-links input overlay.
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

test('exportFeedbackCSV downloads a feedback CSV', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ isAdmin: true, showAdminPanel: true }))
    ok = await page.waitForFunction(() => typeof window.exportFeedbackCSV === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'exportFeedbackCSV should register').toBe(true)
  await page.evaluate(() => window.setState({ adminFeedbackData: [
    { type: 'bug', message: 'test feedback', rating: 5, date: '2026-01-01', page: 'map', email: 'x@y.z' },
  ] }))
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 10000 }),
    page.evaluate(() => { window.exportFeedbackCSV(); return true }),
  ])
  expect(download.suggestedFilename()).toMatch(/^spothitch-feedback-.*\.csv$/)
})

test('closeReportModal closes the report modal', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.closeReportModal === 'function', { timeout: 15000 })
  await page.evaluate(() => window.setState({ showReport: true }))
  await page.evaluate(() => window.closeReportModal())
  await expect.poll(() => page.evaluate(() => window.getState().showReport), { timeout: 8000 }).toBe(false)
})

test('editSocialLinks opens the social-links input overlay', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => { window.setState({ isLoggedIn: true }); window.changeTab('profil') })
    ok = await page.waitForFunction(() => typeof window.editSocialLinks === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'editSocialLinks should register').toBe(true)
  await page.evaluate(() => { window.editSocialLinks(); return true })
  await expect(page.locator('#spothitch-input-overlay')).toBeVisible({ timeout: 8000 })
})
