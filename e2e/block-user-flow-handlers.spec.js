import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — user block/unblock safety flow. These handlers live in the
 * lazy `services/userBlocking.js` (loaded when the block modal renders). Each test forces the
 * lazy load, runs the REAL handler, then asserts the real effect: the `spothitch_blocked_users`
 * list changes, and the modal state flags flip.
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

// Force the lazy userBlocking module to load and wait until the REAL (non-stub) handler is live.
async function loadBlocking(page) {
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ showBlockModal: true, blockTargetId: 'u_evil', blockTargetName: 'Evil' }))
    ok = await page.waitForFunction(
      () => typeof window.confirmBlockUser === 'function' && !window.confirmBlockUser.toString().includes('[lazy]'),
      { timeout: 10000 },
    ).then(() => true).catch(() => false)
  }
  expect(ok, 'real userBlocking handlers should load').toBe(true)
}

// blockUser persists via the Storage wrapper (prefixed key) and mirrors into app state.
// Assert against the canonical state the whole app reads.
const blocked = (page) => page.evaluate(() =>
  (window.getState().blockedUsers || []).map(b => b.id))

test('confirmBlockUser adds the user to the blocked list and closes the modal', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await loadBlocking(page)
  await page.evaluate(() => { localStorage.removeItem('spothitch_v4_spothitch_blocked_users'); window.setState({ blockedUsers: [] }) })
  await page.evaluate(() => window.confirmBlockUser('u_evil'))
  await expect.poll(() => blocked(page), { timeout: 8000 }).toContain('u_evil')
  expect(await page.evaluate(() => window.getState().showBlockModal)).toBe(false)
})

test('unblockUserById removes the user from the blocked list', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await loadBlocking(page)
  await page.evaluate(() => window.confirmBlockUser('u_evil'))
  await expect.poll(() => blocked(page), { timeout: 8000 }).toContain('u_evil')
  await page.evaluate(() => window.unblockUserById('u_evil'))
  await expect.poll(() => blocked(page), { timeout: 8000 }).not.toContain('u_evil')
})

test('openUnblockModal / closeUnblockModal flip the unblock modal state', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await loadBlocking(page)
  await page.evaluate(() => window.openUnblockModal('u_x', 'Xavier'))
  expect(await page.evaluate(() => window.getState().showUnblockModal)).toBe(true)
  expect(await page.evaluate(() => window.getState().unblockTargetId)).toBe('u_x')
  await page.evaluate(() => window.closeUnblockModal())
  expect(await page.evaluate(() => window.getState().showUnblockModal)).toBe(false)
})
