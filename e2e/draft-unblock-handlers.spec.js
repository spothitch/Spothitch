import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — two handlers.
 *  - clearFormDraft removes a persisted form draft (spothitch_draft_{formId}). Boot handler.
 *  - confirmUnblockUser unblocks a user + closes the unblock modal (userBlocking.js, lazy).
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

test('clearFormDraft removes the persisted draft', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.clearFormDraft === 'function', { timeout: 15000 })
  await page.evaluate(() => localStorage.setItem('spothitch_draft_addSpot', JSON.stringify({ ts: Date.now(), data: { x: 1 } })))
  await page.evaluate(() => window.clearFormDraft('addSpot'))
  await expect.poll(() => page.evaluate(() => localStorage.getItem('spothitch_draft_addSpot')), { timeout: 8000 }).toBe(null)
})

test('confirmUnblockUser unblocks the user and closes the modal', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  // Load userBlocking.js (real handlers) via the block modal.
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ showBlockModal: true, blockTargetId: 'x', blockTargetName: 'X' }))
    ok = await page.waitForFunction(
      () => typeof window.confirmUnblockUser === 'function' && !window.confirmUnblockUser.toString().includes('[lazy]'),
      { timeout: 10000 },
    ).then(() => true).catch(() => false)
  }
  expect(ok, 'confirmUnblockUser should register').toBe(true)

  // Seed a blocked user, then confirm-unblock them.
  await page.evaluate(() => window.confirmBlockUser('u_x'))
  await expect.poll(() => page.evaluate(() => (window.getState().blockedUsers || []).map(b => b.id)), { timeout: 8000 }).toContain('u_x')
  await page.evaluate(() => window.setState({ showUnblockModal: true, unblockTargetId: 'u_x' }))
  await page.evaluate(() => window.confirmUnblockUser('u_x'))
  await expect.poll(() => page.evaluate(() => (window.getState().blockedUsers || []).map(b => b.id)), { timeout: 8000 }).not.toContain('u_x')
  expect(await page.evaluate(() => window.getState().showUnblockModal)).toBe(false)
})
