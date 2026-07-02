import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — more input-overlay openers.
 *  - openChangePassword / openChangeUsername (Profile.js).
 *  - openAddWebhook (miscSettings.js, boot).
 * Each opens the #spothitch-input-overlay. Fire-and-forget (handler promise resolves on close).
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

async function ensure(page, handlerName, opener) {
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    if (opener) await page.evaluate(opener)
    ok = await page.waitForFunction((n) => typeof window[n] === 'function', handlerName, { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, `handler ${handlerName} should register`).toBe(true)
}

const openProfile = () => { window.setState({ isLoggedIn: true, user: { uid: 'u1' } }); window.changeTab('profil') }

test('openChangePassword opens an input overlay', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await ensure(page, 'openChangePassword', openProfile)
  await page.evaluate(() => { window.openChangePassword(); return true })
  await expect(page.locator('#spothitch-input-overlay')).toBeVisible({ timeout: 8000 })
})

test('openChangeUsername opens an input overlay', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await ensure(page, 'openChangeUsername', openProfile)
  await page.evaluate(() => window.setState({ lastUsernameChange: 0, username: 'old' }))
  await page.evaluate(() => { window.openChangeUsername(); return true })
  await expect(page.locator('#spothitch-input-overlay')).toBeVisible({ timeout: 8000 })
})

test('openAddWebhook opens an input overlay', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await ensure(page, 'openAddWebhook')
  await page.evaluate(() => { window.openAddWebhook(); return true })
  await expect(page.locator('#spothitch-input-overlay')).toBeVisible({ timeout: 8000 })
})
