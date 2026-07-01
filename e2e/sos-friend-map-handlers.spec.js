import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — two handlers:
 *  - sosSearchFriend('a') (short query) hides the #sos-friend-results list (SOS modal).
 *  - showFriendOnMap(id, lat, lng) navigates to the map tab.
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

test('sosSearchFriend hides the results list for a too-short query', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ showSOS: true }))
    ok = await page.waitForFunction(() => typeof window.sosSearchFriend === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'sosSearchFriend should register').toBe(true)

  await page.evaluate(() => {
    const el = document.createElement('div')
    el.id = 'sos-friend-results'
    document.body.appendChild(el)
  })
  await page.evaluate(() => window.sosSearchFriend('a'))
  expect(await page.evaluate(() => document.getElementById('sos-friend-results').classList.contains('hidden'))).toBe(true)
})

test('showFriendOnMap navigates to the map tab', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.showFriendOnMap === 'function', { timeout: 15000 })
  await page.evaluate(() => window.showFriendOnMap('f1', 48.8566, 2.3522))
  await expect.poll(() => page.evaluate(() => window.getState().activeTab), { timeout: 8000 }).toBe('map')
})
