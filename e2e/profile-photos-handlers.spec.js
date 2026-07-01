import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — profile photo management (Profile view).
 *  - removeProfilePhoto(index) removes a photo from state.profilePhotos + localStorage.
 *  - setMainProfilePhoto(index) moves a photo to the front (main).
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

const photos = (page) => page.evaluate(() => window.getState().profilePhotos)

test('removeProfilePhoto removes the photo at the given index', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openProfile(page, 'removeProfilePhoto')
  await page.evaluate(() => window.setState({ profilePhotos: ['a', 'b', 'c'] }))
  await page.evaluate(() => { window.removeProfilePhoto(1); return true })
  await expect.poll(() => photos(page), { timeout: 8000 }).toEqual(['a', 'c'])
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('spothitch_profile_photos') || '[]'))).toEqual(['a', 'c'])
})

test('setMainProfilePhoto moves the chosen photo to the front', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await openProfile(page, 'setMainProfilePhoto')
  await page.evaluate(() => window.setState({ profilePhotos: ['a', 'b', 'c'] }))
  await page.evaluate(() => { window.setMainProfilePhoto(2); return true })
  await expect.poll(() => photos(page), { timeout: 8000 }).toEqual(['c', 'a', 'b'])
})
