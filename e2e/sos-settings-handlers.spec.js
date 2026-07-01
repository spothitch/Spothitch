import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — SOS safety settings handlers (SOS modal). Real effects:
 *  - removeEmergencyContact mutates state.emergencyContacts.
 *  - toggleCommunityAlerts flips receiveAlerts in `spothitch_community_sos` (raw localStorage).
 * Each test opens the SOS modal so the REAL handler loads, then asserts the effect.
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

async function openSOS(page, handlerName) {
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => window.setState({ showSOS: true }))
    ok = await page.waitForFunction(
      (n) => typeof window[n] === 'function', handlerName, { timeout: 10000 },
    ).then(() => true).catch(() => false)
  }
  expect(ok, `handler ${handlerName} should register`).toBe(true)
}

test('removeEmergencyContact removes the contact at the given index', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openSOS(page, 'removeEmergencyContact')
  await page.evaluate(() => window.setState({
    emergencyContacts: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Carol' }],
  }))
  await page.evaluate(() => window.removeEmergencyContact(1))
  await expect.poll(
    async () => page.evaluate(() => window.getState().emergencyContacts.map(c => c.name)),
    { timeout: 8000 },
  ).toEqual(['Alice', 'Carol'])
})

test('toggleCommunityAlerts flips the receiveAlerts preference', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openSOS(page, 'toggleCommunityAlerts')
  // Seed ON, then toggle → OFF (avoids triggering geolocation position sharing).
  await page.evaluate(() => localStorage.setItem('spothitch_community_sos', JSON.stringify({ receiveAlerts: true })))
  await page.evaluate(() => window.toggleCommunityAlerts())
  await expect.poll(
    async () => page.evaluate(() => JSON.parse(localStorage.getItem('spothitch_community_sos') || '{}').receiveAlerts),
    { timeout: 8000 },
  ).toBe(false)
})
