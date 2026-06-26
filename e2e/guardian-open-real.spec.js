import { test, expect } from '@playwright/test'

/**
 * Guardian Mode — REAL click open (journey-map: Guardian family).
 *
 * Clicks the ACTUAL header guardian button (onclick="showGuardianModal()"), not the handler in
 * isolation. Proves the safety feature's entry point works end to end: button → lazy-load
 * Guardian.js → modal dialog renders, with the page staying responsive (no hang from the
 * Firestore chat subscription). The retry-click absorbs the heavy boot window where the header
 * re-renders (map/tile load) — a real user taps once the UI has settled.
 */
const BASE = 'http://localhost:4173'

test('guardian modal opens via the REAL header button without hanging', async ({ page, context }) => {
  test.setTimeout(90000)
  await context.grantPermissions(['geolocation'])
  await page.addInitScript(() => {
    ;['spothitch_welcomed', 'spothitch_age_verified', 'spothitch_cookie_consent', 'spothitch_landing_v2', 'spothitch_sos_intro_seen']
      .forEach((k) => localStorage.setItem(k, '1'))
  })
  await page.goto(BASE, { waitUntil: 'load', timeout: 30000 })
  await page.waitForFunction(() => typeof window.setState === 'function', { timeout: 15000 })
  await page.evaluate(() => window.setState?.({ isLoggedIn: true, user: { uid: 'probe', displayName: 'Probe' }, username: 'probe' }))

  // Let the heavy boot window (map + tiles) settle so the header stops re-rendering under us —
  // a 200ms in-page sleep that returns near-instant means the main thread is idle.
  await expect
    .poll(
      async () => page.evaluate(async () => {
        const s = performance.now()
        await new Promise((r) => setTimeout(r, 200))
        return Math.round(performance.now() - s)
      }),
      { timeout: 30000, intervals: [500] },
    )
    .toBeLessThan(500)

  // Click the REAL guardian button in the header, retrying until the modal opens (the header can
  // still re-render mid-tap; a real user just taps again).
  await expect
    .poll(
      async () => {
        await page.locator('button[onclick="showGuardianModal()"]').first().click({ timeout: 3000 }).catch(() => {})
        return page.evaluate(() => window.getState().showGuardianModal === true)
      },
      { timeout: 20000, intervals: [600] },
    )
    .toBe(true)

  // The modal dialog renders and the page is still responsive (no hang from the chat sub).
  await expect(page.locator('[role="dialog"],[aria-modal="true"]').first()).toBeVisible({ timeout: 8000 })
  expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
})
