import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — profile account handlers that open an input overlay.
 * Each opens the #spothitch-input-overlay edit dialog (Profile.js). Fire-and-forget: the handler
 * promise only resolves when the overlay closes.
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

async function openProfile(page, handlerName) {
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => { window.setState({ isLoggedIn: true, user: { uid: 'u1', email: 'a@b.c' } }); window.changeTab('profil') })
    ok = await page.waitForFunction((n) => typeof window[n] === 'function', handlerName, { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, `handler ${handlerName} should register`).toBe(true)
}

for (const handler of ['openChangeEmail', 'openEditPersonalInfo', 'openAppealForm']) {
  test(`${handler} opens an input overlay`, async ({ page }) => {
    test.setTimeout(60000)
    await boot(page)
    await openProfile(page, handler)
    await page.evaluate((h) => { window[h](); return true }, handler)
    await expect(page.locator('#spothitch-input-overlay')).toBeVisible({ timeout: 8000 })
  })
}
