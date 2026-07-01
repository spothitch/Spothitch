import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — toggleReplyInput. Pure DOM: toggles the `hidden` class on the
 * reply section for a given comment id (events.js, loaded with the social panel).
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

test('toggleReplyInput shows then hides the reply section for a comment', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  // Load the social panel so events.js registers the handler.
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => { window.setState({ isLoggedIn: true }); window.changeTab('social') })
    ok = await page.waitForFunction(() => typeof window.toggleReplyInput === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'toggleReplyInput should register').toBe(true)

  // Inject a reply section (starts hidden) for comment "c1".
  await page.evaluate(() => {
    const sec = document.createElement('div')
    sec.id = 'reply-section-c1'
    sec.className = 'hidden'
    const input = document.createElement('input')
    input.id = 'reply-input-c1'
    sec.appendChild(input)
    document.body.appendChild(sec)
  })

  const hidden = () => page.evaluate(() => document.getElementById('reply-section-c1').classList.contains('hidden'))
  expect(await hidden()).toBe(true)
  await page.evaluate(() => window.toggleReplyInput('c1'))
  expect(await hidden()).toBe(false)
  await page.evaluate(() => window.toggleReplyInput('c1'))
  expect(await hidden()).toBe(true)
})
