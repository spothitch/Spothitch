import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — city-page demo flow (real DOM, profileRender.js).
 *  - showCityPageDemo builds the demo overlay (intro screen visible).
 *  - startCityPageDemo hides the intro, reveals the main demo screen.
 *  - switchCityDemoTab activates the tapped tab + its panel.
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

test('city demo flow: show → start → switch tab', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  // profileRender.js (owner of these handlers) loads with the profile tab.
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => { window.setState({ isLoggedIn: true }); window.changeTab('profil') })
    ok = await page.waitForFunction(() => typeof window.showCityPageDemo === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'showCityPageDemo should register').toBe(true)

  // Show the demo overlay.
  await page.evaluate(() => window.showCityPageDemo())
  await expect(page.locator('#city-page-demo-overlay')).toBeVisible({ timeout: 8000 })
  await expect(page.locator('#city-demo-main-screen')).toBeHidden()

  // Start the demo → intro hidden, main revealed with the demo content.
  await page.evaluate(() => window.startCityPageDemo())
  expect(await page.evaluate(() => document.getElementById('city-demo-intro-screen').style.display)).toBe('none')
  await expect(page.locator('#city-demo-main-screen [data-city-demo]')).toBeVisible({ timeout: 8000 })

  // Switch to a non-active tab via the real handler and assert it becomes active.
  const switched = await page.evaluate(() => {
    const tabs = [...document.querySelectorAll('#city-demo-main-screen .cd-tab')]
    const target = tabs.find(t => !t.classList.contains('cd-tab-active'))
    if (!target) return 'no-inactive-tab'
    const tabName = target.getAttribute('onclick')?.match(/,\s*'([^']+)'/)?.[1] || ''
    window.switchCityDemoTab(target, tabName)
    return target.classList.contains('cd-tab-active') ? 'ok' : 'not-active'
  })
  expect(switched).toBe('ok')
})
