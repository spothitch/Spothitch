import { test, expect } from '@playwright/test'

/**
 * Real-click marathon (Brique 2) — map/country navigation (boot handlers).
 *  - showCountryDetail sets state.selectedCountryCode.
 *  - flyToCity navigates to the map tab when there is no map instance; ignores invalid coords.
 *  - showCommunitySOSOnMap switches to the map tab and removes the SOS banner.
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

test('showCountryDetail stores the selected country code', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.showCountryDetail === 'function', { timeout: 15000 })
  await page.evaluate(() => window.showCountryDetail('FR'))
  expect(await page.evaluate(() => window.getState().selectedCountryCode)).toBe('FR')
})

test('flyToCity navigates to the map (no map instance) and ignores invalid coords', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.flyToCity === 'function', { timeout: 15000 })
  // Invalid coords → no navigation.
  await page.evaluate(() => { window.homeMapInstance = null; window.setState({ activeTab: 'profil', isLoggedIn: true }) })
  await page.evaluate(() => window.flyToCity('abc', 'def'))
  expect(await page.evaluate(() => window.getState().activeTab)).toBe('profil')
  // Valid coords, no map → navigate to map.
  await page.evaluate(() => window.flyToCity(48.8566, 2.3522))
  await expect.poll(() => page.evaluate(() => window.getState().activeTab), { timeout: 8000 }).toBe('map')
})

test('showCommunitySOSOnMap switches to the map tab and removes the banner', async ({ page }) => {
  test.setTimeout(60000)
  await boot(page)
  await page.waitForFunction(() => typeof window.showCommunitySOSOnMap === 'function', { timeout: 15000 })
  await page.evaluate(() => {
    const b = document.createElement('div'); b.id = 'community-sos-banner'; document.body.appendChild(b)
    window.setState({ activeTab: 'profil' })
  })
  await page.evaluate(() => window.showCommunitySOSOnMap(48.8, 2.3, 'Alice'))
  await expect.poll(() => page.evaluate(() => window.getState().activeTab), { timeout: 8000 }).toBe('map')
  expect(await page.evaluate(() => document.getElementById('community-sos-banner'))).toBe(null)
})
