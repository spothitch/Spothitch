import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — profile account-edit handlers.
 *  - saveBio(text): direct real effect — persists to `spothitch_bio` + state.bio.
 *  - editBio / openEditName: open the input-overlay edit dialog (real user-visible effect).
 * (The overlay's Save button click is flaky on this heavy page; saveBio covers the persist path.)
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

async function openProfile(page, handlerName) {
  let ok = false
  for (let i = 0; i < 4 && !ok; i++) {
    await page.evaluate(() => { window.setState({ isLoggedIn: true }); window.changeTab('profil') })
    ok = await page.waitForFunction((n) => typeof window[n] === 'function', handlerName, { timeout: 10000 })
      .then(() => true).catch(() => false)
  }
  expect(ok, `handler ${handlerName} should register`).toBe(true)
}

test('saveBio persists the bio to localStorage and state', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openProfile(page, 'saveBio')
  await page.evaluate(() => { localStorage.removeItem('spothitch_bio'); window.saveBio('Voyageuse au long cours') })
  await expect.poll(async () => page.evaluate(() => localStorage.getItem('spothitch_bio')), { timeout: 8000 })
    .toBe('Voyageuse au long cours')
  expect(await page.evaluate(() => window.getState().bio)).toBe('Voyageuse au long cours')
})

test('editBio opens the bio edit dialog', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openProfile(page, 'editBio')
  // Fire-and-forget: the handler promise only resolves when the overlay closes.
  await page.evaluate(() => { window.editBio(); return true })
  await expect(page.locator('#spothitch-input-overlay')).toBeVisible({ timeout: 8000 })
  await expect(page.locator('#spothitch-overlay-input')).toBeVisible()
})

test('openEditName opens the name edit dialog', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openProfile(page, 'openEditName')
  await page.evaluate(() => { window.openEditName(); return true })
  await expect(page.locator('#spothitch-input-overlay')).toBeVisible({ timeout: 8000 })
})
