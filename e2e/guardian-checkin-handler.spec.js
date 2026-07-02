import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — guardianQuickCheckin. With an active Guardian session it
 * increments checkInsCount + updates lastCheckIn in localStorage spothitch_guardian.
 */
async function boot(page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('spothitch_welcomed', 'true')
      localStorage.setItem('spothitch_age_verified', 'true')
      localStorage.setItem('spothitch_cookie_consent', 'true')
      localStorage.setItem('spothitch_landing_seen', 'true')
      // Active guardian session (checkIn returns early if !active).
      localStorage.setItem('spothitch_guardian', JSON.stringify({ active: true, checkInsCount: 0, lastCheckIn: 0 }))
    } catch { /* ignore */ }
  })
  await page.goto('/', { waitUntil: 'load', timeout: 30000 }).catch(() => {})
  await page.waitForFunction(() => typeof window.setState === 'function', { timeout: 15000 })
}

test('guardianQuickCheckin increments the check-in count', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.showGuardianModal?.())
    ok = await page.waitForFunction(() => typeof window.guardianQuickCheckin === 'function', { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, 'guardianQuickCheckin should register').toBe(true)

  const count = () => page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('spothitch_guardian') || '{}').checkInsCount } catch { return -1 }
  })
  await page.evaluate(() => window.guardianQuickCheckin())
  await expect.poll(count, { timeout: 8000 }).toBe(1)
})
