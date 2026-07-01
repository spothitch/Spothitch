import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — two state handlers:
 *  - selectAvatar sets state.selectedAvatar (boot handler).
 *  - reactToEventComment bumps state.eventsLastUpdate (events.js, social panel).
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

test('selectAvatar stores the chosen avatar in state', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.selectAvatar === 'function', { timeout: 15000 })
  await page.evaluate(() => window.selectAvatar('astronaut'))
  expect(await page.evaluate(() => window.getState().selectedAvatar)).toBe('astronaut')
})

test('reactToEventComment bumps the events-last-update timestamp', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => { window.setState({ isLoggedIn: true }); window.changeTab('social') })
    ok = await page.waitForFunction(() => typeof window.reactToEventComment === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'reactToEventComment should register').toBe(true)

  await page.evaluate(() => window.setState({ eventsLastUpdate: 1 }))
  await page.evaluate(() => window.reactToEventComment('e1', 'c1', '\u{1F44D}'))
  await expect.poll(() => page.evaluate(() => window.getState().eventsLastUpdate), { timeout: 8000 })
    .not.toBe(1)
})
