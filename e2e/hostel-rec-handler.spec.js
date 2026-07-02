import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — submitHostelRec (boot handler). Validates the form then
 * persists to localStorage spothitch_hostel_recs (before the optional Firestore hostel_recs sync).
 * Covers the valid path + the missing-name validation.
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
  await page.waitForFunction(() => typeof window.submitHostelRec === 'function', { timeout: 15000 })
}

const recs = (page) => page.evaluate(() => {
  try { return JSON.parse(localStorage.getItem('spothitch_hostel_recs') || '[]') } catch { return [] }
})
const run = (page, name, category, city) => page.evaluate(({ name, category, city }) => {
  window.requireOnline = () => true
  window.setState({ user: { uid: 'local-user' }, isLoggedIn: true })
  const mk = (id, val) => {
    let el = document.getElementById(id)
    if (!el) { el = document.createElement('input'); el.id = id; document.body.appendChild(el) }
    el.value = val
  }
  mk('hostel-name', name)
  mk('selected-category', category)
  return window.submitHostelRec(city)
}, { name, category, city })

test('submitHostelRec persists a valid recommendation to localStorage', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.evaluate(() => localStorage.setItem('spothitch_hostel_recs', '[]'))
  const name = 'Cool Hostel ' + Date.now()
  await run(page, name, 'budget', 'Lyon')
  await expect.poll(async () => (await recs(page)).some(r => r.name === name || r.hostelName === name), { timeout: 8000 }).toBe(true)
})

test('submitHostelRec rejects a recommendation with no name', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.evaluate(() => localStorage.setItem('spothitch_hostel_recs', '[]'))
  await run(page, '   ', 'budget', 'Lyon')
  await page.waitForTimeout(1500)
  expect((await recs(page)).length).toBe(0)
})
