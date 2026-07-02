import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — toast-only handlers. Their user-visible effect is a toast;
 * we spy window.showToast and assert it fires.
 *  - showFriendOptions (sos.js, boot).
 *  - roadmapVote (profileRender.js, profile view).
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

const spyToast = (page) => page.evaluate(() => { window.__toasted = false; window.showToast = () => { window.__toasted = true } })

test('showFriendOptions shows a toast', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.showFriendOptions === 'function', { timeout: 15000 })
  await spyToast(page)
  await page.evaluate(() => window.showFriendOptions())
  expect(await page.evaluate(() => window.__toasted)).toBe(true)
})

test('roadmapVote shows a toast', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => { window.setState({ isLoggedIn: true }); window.changeTab('profil') })
    ok = await page.waitForFunction(() => typeof window.roadmapVote === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'roadmapVote should register').toBe(true)
  await spyToast(page)
  await page.evaluate(() => window.roadmapVote())
  expect(await page.evaluate(() => window.__toasted)).toBe(true)
})
