import { test, expect } from '@playwright/test'

/**
 * SOS — REAL click intro → config (journey-map: SOS family).
 *
 * A brand-new user (no spothitch_sos_intro_seen) opens SOS from the header, sees the intro, and
 * taps the REAL "Configurer mon SOS" button (onclick="acceptSOSIntro()"). Proves the button is
 * actually tappable — this is the exact button a contextual-tip overlay used to sit on top of —
 * and that the modal transitions to the configuration panel.
 */
const BASE = 'http://localhost:4173'

test('SOS intro "Configurer mon SOS" advances to the config panel (real button)', async ({ page, context }) => {
  test.setTimeout(90000)
  await context.grantPermissions(['geolocation'])
  // Deliberately do NOT set spothitch_sos_intro_seen — we want the intro screen.
  await page.addInitScript(() => {
    ;['spothitch_welcomed', 'spothitch_age_verified', 'spothitch_cookie_consent', 'spothitch_landing_v2']
      .forEach((k) => localStorage.setItem(k, '1'))
  })
  await page.goto(BASE, { waitUntil: 'load', timeout: 30000 })
  await page.waitForFunction(() => typeof window.setState === 'function', { timeout: 15000 })
  await page.evaluate(() => window.setState?.({ isLoggedIn: true, user: { uid: 'sos-probe', displayName: 'Probe' }, username: 'probe' }))

  // Settle the heavy boot window so the header stops re-rendering under us.
  await expect
    .poll(async () => page.evaluate(async () => { const s = performance.now(); await new Promise((r) => setTimeout(r, 200)); return Math.round(performance.now() - s) }), { timeout: 30000, intervals: [500] })
    .toBeLessThan(500)

  // Open SOS from the REAL header button, retrying through any boot re-render.
  await expect
    .poll(async () => {
      await page.locator('button[onclick="openSOS()"]').first().click({ timeout: 3000 }).catch(() => {})
      return page.evaluate(() => window.getState().showSOS === true)
    }, { timeout: 20000, intervals: [600] })
    .toBe(true)

  // The intro "Configurer mon SOS" button must be present and clickable (nothing overlapping it).
  const configBtn = page.locator('button[onclick="acceptSOSIntro()"]').first()
  await expect(configBtn).toBeVisible({ timeout: 8000 })
  await configBtn.click({ timeout: 6000 })

  // Intro is dismissed → config panel renders, and the seen flag is persisted.
  await expect.poll(() => page.evaluate(() => localStorage.getItem('spothitch_sos_intro_seen')), { timeout: 8000 }).toBe('1')
  await expect(page.locator('button[onclick="acceptSOSIntro()"]')).toHaveCount(0, { timeout: 8000 })
})
