import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — a few more handlers.
 *  - homeSelectFirstSuggestion clicks the first home destination suggestion.
 *  - openRoadmapFeature opens the feature-intro overlay for a feature.
 *  - closeRoadmapFeature clears state.roadmapFeatureId.
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

test('homeSelectFirstSuggestion clicks the first suggestion button', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.homeSelectFirstSuggestion === 'function', { timeout: 15000 })
  await page.evaluate(() => {
    window.__suggestionClicked = false
    const btn = document.createElement('button')
    btn.setAttribute('data-home-suggestion', '0')
    btn.onclick = () => { window.__suggestionClicked = true }
    document.body.appendChild(btn)
  })
  await page.evaluate(() => window.homeSelectFirstSuggestion())
  expect(await page.evaluate(() => window.__suggestionClicked)).toBe(true)
})

test('openRoadmapFeature opens the feature intro; closeRoadmapFeature clears the id', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => { window.setState({ isLoggedIn: true }); window.changeTab('profil') })
    ok = await page.waitForFunction(() => typeof window.openRoadmapFeature === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'openRoadmapFeature should register').toBe(true)

  await page.evaluate(() => window.openRoadmapFeature('carte'))
  await expect(page.locator('#feature-intro-overlay')).toBeVisible({ timeout: 8000 })

  await page.evaluate(() => window.setState({ roadmapFeatureId: 'carte' }))
  await page.evaluate(() => window.closeRoadmapFeature())
  expect(await page.evaluate(() => window.getState().roadmapFeatureId)).toBe(null)
})
