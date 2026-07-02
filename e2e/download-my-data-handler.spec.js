import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — downloadMyData (RGPD data portability). Builds a JSON export of
 * the user's data and triggers a real download. MyData.js loads when state.showMyData is set.
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

test('downloadMyData triggers a JSON data-export download', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ showMyData: true, isLoggedIn: true }))
    ok = await page.waitForFunction(
      () => typeof window.downloadMyData === 'function' && !window.downloadMyData.toString().includes('[lazy]'),
      { timeout: 10000 },
    ).then(() => true).catch(() => false)
  }
  expect(ok, 'downloadMyData should register').toBe(true)

  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 10000 }),
    page.evaluate(() => { window.downloadMyData(); return true }),
  ])
  expect(download.suggestedFilename()).toMatch(/^spothitch-data-.*\.json$/)
})
