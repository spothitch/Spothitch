import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — two handlers.
 *  - replyEventComment posts a reply to an event comment (spothitch_event_comments). Social.
 *  - tripSelectFirst clicks the first trip suggestion (Travel.js, voyage panel).
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

async function loadUntil(page, opener, handlerName, tries = 5) {
  let ok = false
  for (let i = 0; i < tries && !ok; i++) {
    await page.evaluate(opener)
    ok = await page.waitForFunction((n) => typeof window[n] === 'function', handlerName, { timeout: 12000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, `handler ${handlerName} should register`).toBe(true)
}

test('replyEventComment posts a reply to an event comment', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await loadUntil(page, () => { window.setState({ isLoggedIn: true, user: { uid: 'local-user' } }); window.changeTab('social') }, 'replyEventComment')
  await page.evaluate(() => {
    localStorage.setItem('spothitch_v4_spothitch_event_comments', JSON.stringify({ e1: [{ id: 'c1', userId: 'x', text: 'parent' }] }))
    const inp = document.createElement('input'); inp.id = 'reply-input-c1'; inp.value = 'My reply here'; document.body.appendChild(inp)
  })
  await page.evaluate(() => window.replyEventComment('e1', 'c1'))
  await expect.poll(
    () => page.evaluate(() => {
      try { return JSON.parse(localStorage.getItem('spothitch_v4_spothitch_event_comments') || '{}').e1?.some(c => c.text === 'My reply here') } catch { return false }
    }),
    { timeout: 8000 },
  ).toBe(true)
})

test('tripSelectFirst clicks the first trip suggestion', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await loadUntil(page, () => { window.setState({ isLoggedIn: true }); window.changeTab('voyage') }, 'tripSelectFirst')
  await page.evaluate(() => {
    window.__tripSuggClicked = false
    const btn = document.createElement('button')
    btn.setAttribute('data-trip-from-suggestion', '0')
    btn.onclick = () => { window.__tripSuggClicked = true }
    document.body.appendChild(btn)
  })
  await page.evaluate(() => window.tripSelectFirst('from'))
  expect(await page.evaluate(() => window.__tripSuggClicked)).toBe(true)
})
