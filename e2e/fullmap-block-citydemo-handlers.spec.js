import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — three handlers.
 *  - openFullMap switches to the map tab.
 *  - openBlockModal opens the block modal for a target user (userBlocking.js).
 *  - closeCityPageDemo removes the #city-page-demo-overlay (profileRender.js).
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

test('openFullMap switches to the map tab', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.openFullMap === 'function', { timeout: 15000 })
  await page.evaluate(() => window.setState({ activeTab: 'profil', isLoggedIn: true }))
  await page.evaluate(() => window.openFullMap())
  await expect.poll(() => page.evaluate(() => window.getState().activeTab), { timeout: 8000 }).toBe('map')
})

test('openBlockModal opens the block modal for a user', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  // Load userBlocking.js (real openBlockModal, not the no-op stub).
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ showBlockModal: true, blockTargetId: 'seed', blockTargetName: 'S' }))
    ok = await page.waitForFunction(
      () => typeof window.openBlockModal === 'function' && !window.openBlockModal.toString().includes('[lazy]'),
      { timeout: 10000 },
    ).then(() => true).catch(() => false)
  }
  expect(ok, 'openBlockModal should register').toBe(true)
  await page.evaluate(() => window.setState({ showBlockModal: false, blockTargetId: null }))
  await page.evaluate(() => window.openBlockModal('u_target', 'Target'))
  await expect.poll(() => page.evaluate(() => window.getState().showBlockModal), { timeout: 8000 }).toBe(true)
  expect(await page.evaluate(() => window.getState().blockTargetId)).toBe('u_target')
})

test('closeCityPageDemo removes the demo overlay', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => { window.setState({ isLoggedIn: true }); window.changeTab('profil') })
    ok = await page.waitForFunction(() => typeof window.closeCityPageDemo === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'closeCityPageDemo should register').toBe(true)
  await page.evaluate(() => { const o = document.createElement('div'); o.id = 'city-page-demo-overlay'; document.body.appendChild(o) })
  await page.evaluate(() => window.closeCityPageDemo())
  await expect.poll(() => page.evaluate(() => !!document.getElementById('city-page-demo-overlay')), { timeout: 8000 }).toBe(false)
})
