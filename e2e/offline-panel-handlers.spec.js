import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — offline panel handlers (boot-registered via
 * handlers/offlineDownload.js, no lazy race). Real state effects:
 *  - openOfflinePanel/closeOfflinePanel flip state.showOfflinePanel.
 *  - toggleAutoOfflineDownload flips state.offlineAutoDownloadEnabled.
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

test('openOfflinePanel opens the panel, closeOfflinePanel closes it', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.openOfflinePanel === 'function', { timeout: 15000 })
  await page.evaluate(() => { window.openOfflinePanel(); return true })
  await expect.poll(() => page.evaluate(() => window.getState().showOfflinePanel), { timeout: 8000 }).toBe(true)
  await page.evaluate(() => window.closeOfflinePanel())
  await expect.poll(() => page.evaluate(() => window.getState().showOfflinePanel), { timeout: 8000 }).toBe(false)
})

test('toggleAutoOfflineDownload flips the auto-download preference', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.toggleAutoOfflineDownload === 'function', { timeout: 15000 })
  const before = await page.evaluate(() => window.getState().offlineAutoDownloadEnabled)
  await page.evaluate(() => window.toggleAutoOfflineDownload())
  expect(await page.evaluate(() => window.getState().offlineAutoDownloadEnabled)).toBe(!before)
})
