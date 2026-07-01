import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — feature-intro flow (boot handlers, real DOM overlay).
 *  - showFeatureIntro builds the #feature-intro-overlay for a feature.
 *  - selectIntroVote marks a vote button aria-pressed + reveals the comment area.
 *  - closeFeatureIntro removes the overlay.
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

test('feature-intro flow: show → vote → close', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.showFeatureIntro === 'function', { timeout: 15000 })

  await page.evaluate(() => window.showFeatureIntro('carte'))
  await expect(page.locator('#feature-intro-overlay')).toBeVisible({ timeout: 8000 })

  // Vote: pick the first vote button's type and select it.
  const pressed = await page.evaluate(() => {
    const btn = document.querySelector('#feature-intro-overlay .intro-vote-btn')
    if (!btn) return 'no-vote-btn'
    window.selectIntroVote(btn.dataset.vote, 'carte')
    return btn.getAttribute('aria-pressed')
  })
  expect(pressed).toBe('true')

  await page.evaluate(() => window.closeFeatureIntro())
  await expect(page.locator('#feature-intro-overlay')).toHaveCount(0)
})
