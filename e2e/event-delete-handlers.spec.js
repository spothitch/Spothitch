import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — event deletion handlers (events.js, social panel; localStorage).
 *  - deleteEventAction removes an event the user created (confirm dialog accepted).
 *  - deleteEventCommentAction removes a comment authored by the user.
 * Ownership is checked against state.user.uid (we seed 'local-user' as both creator/author).
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

async function openSocial(page, handlerName) {
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => { window.setState({ isLoggedIn: true, user: { uid: 'local-user' } }); window.changeTab('social') })
    ok = await page.waitForFunction((n) => typeof window[n] === 'function', handlerName, { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, `handler ${handlerName} should register`).toBe(true)
}

const events = (page) => page.evaluate(() => {
  try { return JSON.parse(localStorage.getItem('spothitch_v4_spothitch_events') || '[]') } catch { return [] }
})
const comments = (page) => page.evaluate(() => {
  try { return JSON.parse(localStorage.getItem('spothitch_v4_spothitch_event_comments') || '{}') } catch { return {} }
})

test('deleteEventAction removes an event created by the user', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  page.on('dialog', (d) => d.accept())
  await openSocial(page, 'deleteEventAction')
  await page.evaluate(() => { window.setState({ user: { uid: 'local-user' } }); localStorage.setItem('spothitch_v4_spothitch_events', JSON.stringify([{ id: 'e1', title: 'My event', creatorId: 'local-user', date: '2026-12-01' }])) })
  await page.evaluate(() => window.deleteEventAction('e1'))
  await expect.poll(async () => (await events(page)).some(e => e.id === 'e1'), { timeout: 8000 }).toBe(false)
})

test('deleteEventCommentAction removes a comment authored by the user', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openSocial(page, 'deleteEventCommentAction')
  await page.evaluate(() => {
    window.setState({ user: { uid: 'local-user' } })
    localStorage.setItem('spothitch_v4_spothitch_event_comments', JSON.stringify({ e1: [{ id: 'c1', userId: 'local-user', text: 'hi' }, { id: 'c2', userId: 'other', text: 'yo' }] }))
  })
  await page.evaluate(() => window.deleteEventCommentAction('e1', 'c1'))
  await expect.poll(async () => ((await comments(page)).e1 || []).some(c => c.id === 'c1'), { timeout: 8000 }).toBe(false)
  // Other user's comment untouched.
  expect(((await comments(page)).e1 || []).some(c => c.id === 'c2')).toBe(true)
})
