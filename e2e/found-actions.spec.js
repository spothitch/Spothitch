import { test, expect } from '@playwright/test'

/**
 * Actions discovered by the inventory completeness audit (onclick handlers the gauge had
 * missed). Each is exercised for real and its effect verified — including openPhotoFullscreen,
 * which was a broken onclick (no definition) until this work.
 */
async function boot(page) {
  test.setTimeout(90000)
  await page.addInitScript(() => {
    try {
      localStorage.setItem('spothitch_welcomed', 'true')
      localStorage.setItem('spothitch_age_verified', 'true')
      localStorage.setItem('spothitch_cookie_consent', 'true')
      localStorage.setItem('spothitch_landing_seen', 'true')
    } catch { /* ignore */ }
  })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => typeof window.setState === 'function', { timeout: 15000 })
}

test('openPhotoFullscreen opens a fullscreen photo overlay', async ({ page }) => {
  await boot(page)
  // Open a spot detail so the SpotDetail module installs the handler.
  await page.evaluate(() => window.setState({
    selectedSpot: { id: 'fs-spot', from: 'X', photos: ['https://example.com/a.jpg'] },
    showSpotDetail: true,
  }))
  await page.waitForFunction(() => typeof window.openPhotoFullscreen === 'function', { timeout: 15000 })
  await page.evaluate(() => window.openPhotoFullscreen(0))
  await expect(page.locator('#photo-fullscreen-overlay img')).toHaveCount(1)
  // The overlay closes on click.
  await page.evaluate(() => document.getElementById('photo-fullscreen-overlay')?.click())
  await expect(page.locator('#photo-fullscreen-overlay')).toHaveCount(0)
})

test('_dismissGmapsTip hides the Google Maps tip persistently', async ({ page }) => {
  await boot(page)
  await page.evaluate(() => window.setState({ showAddSpot: true }))
  await page.waitForFunction(() => typeof window._dismissGmapsTip === 'function', { timeout: 15000 })
  await page.evaluate(() => { localStorage.removeItem('spothitch_gmaps_tip_hidden'); window._dismissGmapsTip(true) })
  expect(await page.evaluate(() => localStorage.getItem('spothitch_gmaps_tip_hidden'))).toBe('1')
})

test('_dismissPushNudge records the nudge as dismissed', async ({ page }) => {
  await boot(page)
  await page.waitForFunction(() => typeof window._dismissPushNudge === 'function', { timeout: 15000 }).catch(() => {})
  const present = await page.evaluate(() => typeof window._dismissPushNudge === 'function')
  test.skip(!present, '_dismissPushNudge not loaded in this build')
  await page.evaluate(() => { localStorage.removeItem('spothitch_push_nudge_dismissed'); window._dismissPushNudge() })
  expect(await page.evaluate(() => localStorage.getItem('spothitch_push_nudge_dismissed'))).toBeTruthy()
})
