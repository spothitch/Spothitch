import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — clipboard handlers. We spy on navigator.clipboard.writeText
 * (deterministic, avoids clipboard-permission flakiness) and assert the copied value.
 *  - copyFriendLink copies the invite link (boot handler).
 *  - copyCode copies the given reward code (Shop modal).
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

const spyClipboard = (page) => page.evaluate(() => {
  window.__copied = null
  if (!navigator.clipboard) navigator.clipboard = {}
  navigator.clipboard.writeText = (txt) => { window.__copied = txt; return Promise.resolve() }
})

test('copyFriendLink copies the invite link', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.copyFriendLink === 'function', { timeout: 15000 })
  await spyClipboard(page)
  await page.evaluate(() => window.copyFriendLink())
  expect(await page.evaluate(() => window.__copied)).toBe('spothitch.app/add/user123')
})

test('copyCode copies the given reward code', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ showShop: true }))
    ok = await page.waitForFunction(() => typeof window.copyCode === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'copyCode should register').toBe(true)
  await spyClipboard(page)
  await page.evaluate(() => window.copyCode('WELCOME10'))
  expect(await page.evaluate(() => window.__copied)).toBe('WELCOME10')
})
