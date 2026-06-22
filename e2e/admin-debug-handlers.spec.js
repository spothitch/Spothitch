import { test, expect } from '@playwright/test'

/**
 * Admin debug handlers — REAL state effect (Brique 2). These dev tools mutate the local
 * progression state directly. Each test triggers the handler and verifies the exact
 * resulting value the admin would see. (adminResetState is destructive — confirm + reload —
 * and is excluded from the no-crash fuzz too; the moderation handlers that hit Firestore
 * live in the firebase-* emulator specs.)
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
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.waitForFunction(() => typeof window.setState === 'function', { timeout: 15000 })
  // Admin debug handlers are lazy-loaded with the admin panel (gated by isAdmin). Open it
  // so the real handlers are installed over the boot stubs.
  await page.evaluate(() => window.setState({ isAdmin: true, showAdminPanel: true }))
  await page.waitForFunction(() => typeof window.adminAddThumbs === 'function' && typeof window.adminMaxStats === 'function', { timeout: 15000 })
}

test('adminAddSkillPoints increments skillPoints by the given amount', async ({ page }) => {
  await boot(page)
  const before = await page.evaluate(() => window.getState().skillPoints || 0)
  await page.evaluate(() => window.adminAddSkillPoints(5))
  expect(await page.evaluate(() => window.getState().skillPoints)).toBe(before + 5)
})

test('adminAddThumbs increments thumbs by the given amount', async ({ page }) => {
  await boot(page)
  const before = await page.evaluate(() => window.getState().thumbs || 0)
  await page.evaluate(() => window.adminAddThumbs(10))
  expect(await page.evaluate(() => window.getState().thumbs)).toBe(before + 10)
})

test('adminLevelUp raises level by 1 and adds 3 skill points', async ({ page }) => {
  await boot(page)
  const s0 = await page.evaluate(() => ({ level: window.getState().level || 1, sp: window.getState().skillPoints || 0 }))
  await page.evaluate(() => window.adminLevelUp())
  const s1 = await page.evaluate(() => ({ level: window.getState().level, sp: window.getState().skillPoints }))
  expect(s1.level).toBe(s0.level + 1)
  expect(s1.sp).toBe(s0.sp + 3)
})

test('adminMaxStats maxes out the progression stats', async ({ page }) => {
  await boot(page)
  await page.evaluate(() => window.adminMaxStats())
  const s = await page.evaluate(() => window.getState())
  expect(s.points).toBe(99999)
  expect(s.level).toBe(50)
  expect(s.thumbs).toBe(9999)
})

test('adminExportState builds a downloadable state blob', async ({ page }) => {
  await boot(page)
  const created = await page.evaluate(() => {
    let url = null
    const origCreate = URL.createObjectURL
    URL.createObjectURL = (blob) => { url = { size: blob.size, type: blob.type }; return 'blob:fake' }
    const origClick = HTMLAnchorElement.prototype.click
    HTMLAnchorElement.prototype.click = () => {} // don't actually navigate/download
    try { window.adminExportState() } finally {
      URL.createObjectURL = origCreate
      HTMLAnchorElement.prototype.click = origClick
    }
    return url
  })
  expect(created).not.toBeNull()
  expect(created.type).toContain('application/json')
  expect(created.size).toBeGreaterThan(2)
})
