import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — addCustomGuideCategory. When signed out it prompts auth
 * (openAuth). We assert the auth flow opens.
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

test('addCustomGuideCategory prompts auth when signed out', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.showGuides?.())
    ok = await page.waitForFunction(() => typeof window.addCustomGuideCategory === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'addCustomGuideCategory should register').toBe(true)
  await page.evaluate(() => { window.__authOpened = false; const o = window.openAuth; window.openAuth = (...a) => { window.__authOpened = true; return o?.(...a) } })
  await page.evaluate(() => window.addCustomGuideCategory('FR'))
  await expect.poll(() => page.evaluate(() => window.__authOpened || window.getState().showAuth === true), { timeout: 8000 }).toBe(true)
})
