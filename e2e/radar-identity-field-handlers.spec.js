import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — field/setter handlers whose effect is a LOCAL state or
 * localStorage change (no Firestore), so they are verifiable here without the emulator.
 *  - Radar setters (Voyageurs social view) persist to `spothitch_proximity_radar`.
 *  - Identity-verification field updaters mutate `window.identityVerificationState`.
 * Each test opens the lazy module that owns the handler, runs the REAL handler, then asserts
 * the value the app reads back really changed.
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

// Retry a lazy-module open until the target handler is registered (cold-start races).
async function openUntil(page, opener, handlerName, tries = 4) {
  let ok = false
  for (let i = 0; i < tries && !ok; i++) {
    await page.evaluate(opener)
    ok = await page.waitForFunction(
      (n) => typeof window[n] === 'function', handlerName, { timeout: 10000 },
    ).then(() => true).catch(() => false)
  }
  expect(ok, `handler ${handlerName} should register`).toBe(true)
}

const radar = (page) => page.evaluate(() =>
  JSON.parse(localStorage.getItem('spothitch_proximity_radar') || '{}'))

const openSocial = () => { window.setState({ isLoggedIn: true }); window.changeTab('social') }

test('setRadarRadius persists a numeric radius to the radar settings', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openUntil(page, openSocial, 'setRadarRadius')
  await page.evaluate(() => window.setRadarRadius('42'))
  await expect.poll(async () => (await radar(page)).radius, { timeout: 8000 }).toBe(42)
})

test('setRadarVisibility toggles a visibility entry in the radar settings', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openUntil(page, openSocial, 'setRadarVisibility')
  const before = ((await radar(page)).visibility || []).includes('femmes')
  await page.evaluate(() => window.setRadarVisibility('femmes'))
  await expect.poll(
    async () => ((await radar(page)).visibility || []).includes('femmes'),
    { timeout: 8000 },
  ).toBe(!before)
})

test('setRadarMessage persists the radar broadcast message', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openUntil(page, openSocial, 'setRadarMessage')
  await page.evaluate(() => window.setRadarMessage('En route vers Lyon'))
  await expect.poll(async () => (await radar(page)).message, { timeout: 8000 })
    .toBe('En route vers Lyon')
})

test('updatePhoneNumber strips non-digits into the verification state', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openUntil(page, () => window.setState({ showIdentityVerification: true }), 'updatePhoneNumber')
  await page.evaluate(() => window.updatePhoneNumber('06 12-ab-34'))
  expect(await page.evaluate(() => window.identityVerificationState.phoneNumber)).toBe('061234')
})

test('updateVerificationCode keeps digits only, max 6', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openUntil(page, () => window.setState({ showIdentityVerification: true }), 'updateVerificationCode')
  await page.evaluate(() => window.updateVerificationCode('12x34y56789'))
  expect(await page.evaluate(() => window.identityVerificationState.verificationCode)).toBe('123456')
})
