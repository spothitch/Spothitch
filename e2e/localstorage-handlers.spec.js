import { test, expect } from '@playwright/test'

/**
 * Handlers that persist a preference to localStorage — REAL effect (Brique 2). Each opens
 * the lazy module that owns the handler, runs it, and asserts the localStorage key really
 * changed (the value the app reads back on next launch).
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

const ls = (page, key) => page.evaluate((k) => localStorage.getItem(k), key)

test('acceptRoadmapIntro marks the roadmap intro seen', async ({ page }) => {
  await boot(page)
  await page.evaluate(() => { localStorage.removeItem('spothitch_roadmap_intro_seen'); window.changeTab('profil') })
  await page.waitForFunction(() => typeof window.acceptRoadmapIntro === 'function', { timeout: 15000 })
  await page.evaluate(() => window.acceptRoadmapIntro())
  expect(await ls(page, 'spothitch_roadmap_intro_seen')).toBe('1')
})

test('dismissRoadmapDetailIntro marks the roadmap detail seen', async ({ page }) => {
  await boot(page)
  await page.evaluate(() => { localStorage.removeItem('spothitch_roadmap_detail_seen'); window.changeTab('profil') })
  await page.waitForFunction(() => typeof window.dismissRoadmapDetailIntro === 'function', { timeout: 15000 })
  await page.evaluate(() => window.dismissRoadmapDetailIntro())
  expect(await ls(page, 'spothitch_roadmap_detail_seen')).toBe('1')
})

test('sosToggleSilent flips the silent-SOS preference', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.evaluate(() => window.setState({ showSOS: true }))
  await page.waitForFunction(() => typeof window.sosToggleSilent === 'function', { timeout: 15000 })
  const before = await ls(page, 'spothitch_sos_silent')
  await page.evaluate(() => window.sosToggleSilent())
  await expect.poll(async () => ls(page, 'spothitch_sos_silent'), { timeout: 8000 }).not.toBe(before)
})
