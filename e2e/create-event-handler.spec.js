import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — submitCreateEvent. It validates the event form then persists
 * to localStorage (spothitch_events, via the Storage wrapper) before the optional Firestore sync.
 * We seed an old account-created date to pass the 24h anti-spam gate, inject + fill the real form
 * fields, run the handler, and assert the event landed + the modal-close state. Also covers the
 * validation path (missing title → rejected, nothing persisted).
 *
 * NOTE: we do NOT setState({showCreateEvent:true}) before filling — rendering the real modal would
 * create empty #event-* inputs that shadow the injected ones (duplicate ids).
 */
async function boot(page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('spothitch_welcomed', 'true')
      localStorage.setItem('spothitch_age_verified', 'true')
      localStorage.setItem('spothitch_cookie_consent', 'true')
      localStorage.setItem('spothitch_landing_seen', 'true')
      localStorage.setItem('spothitch_v4_spothitch_account_created', JSON.stringify('2020-01-01T00:00:00.000Z'))
    } catch { /* ignore */ }
  })
  await page.goto('/', { waitUntil: 'load', timeout: 30000 }).catch(() => {})
  await page.waitForFunction(() => typeof window.setState === 'function', { timeout: 15000 })
}

async function openSocial(page) {
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => { window.setState({ isLoggedIn: true, user: { uid: 'local-user' } }); window.changeTab('social') })
    ok = await page.waitForFunction(() => typeof window.submitCreateEvent === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'submitCreateEvent should register').toBe(true)
}

const events = (page) => page.evaluate(() => {
  try { return JSON.parse(localStorage.getItem('spothitch_v4_spothitch_events') || '[]') } catch { return [] }
})

// Fill form + run the handler in ONE evaluate (no real modal render → no id shadowing).
const runCreate = (page, title) => page.evaluate(async (title) => {
  window.requireOnline = () => true
  const mk = (id, val, tag = 'input') => {
    let el = document.getElementById(id)
    if (!el) { el = document.createElement(tag); el.id = id; document.body.appendChild(el) }
    el.value = val
  }
  const future = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  mk('event-title', title)
  mk('event-type', 'meetup')
  mk('event-location', 'Paris, Place de la République')
  mk('event-date', future)
  mk('event-time', '18:00')
  mk('event-description', 'Rencontre autostoppeurs', 'textarea')
  mk('event-visibility', 'public')
  await window.submitCreateEvent()
}, title)

test('submitCreateEvent validates + persists the event to localStorage', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openSocial(page)
  await page.evaluate(() => localStorage.setItem('spothitch_v4_spothitch_events', '[]'))

  const title = 'E2E Event ' + Date.now()
  await runCreate(page, title)

  await expect.poll(async () => (await events(page)).some(e => e.title === title), { timeout: 8000 }).toBe(true)
  await expect.poll(() => page.evaluate(() => window.getState().showCreateEvent), { timeout: 8000 }).toBe(false)
})

test('submitCreateEvent rejects an event with no title', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openSocial(page)
  await page.evaluate(() => localStorage.setItem('spothitch_v4_spothitch_events', '[]'))

  await runCreate(page, '   ') // blank title → validation rejects
  await page.waitForTimeout(1500)
  expect((await events(page)).length).toBe(0)
})
