import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — two DOM handlers.
 *  - showCookieCustomize reveals the cookie-customize modal (removes 'hidden'). Boot.
 *  - scrollToFAQCategory scrolls to a FAQ category element (FAQ.js, lazy).
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

test('showCookieCustomize reveals the cookie-customize modal', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.showCookieCustomize === 'function', { timeout: 15000 })
  await page.evaluate(() => {
    const m = document.createElement('div'); m.id = 'cookie-customize-modal'; m.className = 'hidden'; document.body.appendChild(m)
  })
  await page.evaluate(() => window.showCookieCustomize())
  await expect.poll(() => page.evaluate(() => document.getElementById('cookie-customize-modal')?.classList.contains('hidden')), { timeout: 8000 }).toBe(false)
})

test('scrollToFAQCategory scrolls to the category element', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ showFAQ: true }))
    ok = await page.waitForFunction(() => typeof window.scrollToFAQCategory === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'scrollToFAQCategory should register').toBe(true)
  await page.evaluate(() => {
    window.__scrolled = false
    const el = document.createElement('div'); el.id = 'faq-safety'
    el.scrollIntoView = () => { window.__scrolled = true }
    document.body.appendChild(el)
  })
  await page.evaluate(() => window.scrollToFAQCategory('safety'))
  await expect.poll(() => page.evaluate(() => window.__scrolled), { timeout: 8000 }).toBe(true)
})
