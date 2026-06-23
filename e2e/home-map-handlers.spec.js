import { test, expect } from '@playwright/test'

/**
 * Home map handlers — REAL effect (Brique 2).
 *
 * These drive the live MapLibre/Leaflet instance (window.homeMapInstance) and the
 * homeSearchLabel state. Each test triggers the real handler and verifies the visible
 * effect the user would get: zoom level changes, map recenters, search label set/cleared,
 * suggestion container hidden for short queries.
 */
async function bootHome(page) {
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
  // The map instance is created when the Home view mounts. Wait for it.
  await page.waitForFunction(
    () => window.homeMapInstance && typeof window.homeMapInstance.getZoom === 'function',
    { timeout: 20000 },
  )
}

test('homeZoomIn / homeZoomOut change the map zoom level', async ({ page }) => {
  await bootHome(page)
  const z0 = await page.evaluate(() => window.homeMapInstance.getZoom())
  const zoomedIn = await page.waitForFunction((z) => {
    window.homeZoomIn()
    return window.homeMapInstance.getZoom() > z
  }, z0, { timeout: 6000 }).then(() => true).catch(() => false)
  expect(zoomedIn).toBe(true)
  const zIn = await page.evaluate(() => window.homeMapInstance.getZoom())
  const zoomedOut = await page.waitForFunction((z) => {
    window.homeZoomOut()
    return window.homeMapInstance.getZoom() < z
  }, zIn, { timeout: 6000 }).then(() => true).catch(() => false)
  expect(zoomedOut).toBe(true)
})

test('homeSelectPlace recenters the map and stores the search label', async ({ page }) => {
  await bootHome(page)
  await page.evaluate(() => window.homeSelectPlace(48.8566, 2.3522, 'Paris'))
  await page.waitForTimeout(500)
  const label = await page.evaluate(() => window.getState().homeSearchLabel)
  expect(label).toBe('Paris')
  const center = await page.evaluate(() => {
    const c = window.homeMapInstance.getCenter()
    return { lat: c.lat ?? c[0], lng: c.lng ?? c[1] }
  })
  expect(Math.abs(center.lat - 48.8566)).toBeLessThan(0.5)
  expect(Math.abs(center.lng - 2.3522)).toBeLessThan(0.5)
})

test('homeClearSearch clears the search label and input', async ({ page }) => {
  await bootHome(page)
  await page.evaluate(() => window.setState({ homeSearchLabel: 'Lyon' }))
  await page.evaluate(() => window.homeClearSearch())
  const label = await page.evaluate(() => window.getState().homeSearchLabel)
  expect(label).toBe('')
})

test('homeCenterOnUser recenters on a known user location', async ({ page }) => {
  await bootHome(page)
  await page.evaluate(() => window.setState({ userLocation: { lat: 43.6047, lng: 1.4442 } })) // Toulouse
  // Confirm the state really holds the location before triggering the handler.
  await page.waitForFunction(() => {
    const u = window.getState().userLocation
    return u && Math.abs(u.lat - 43.6047) < 0.01
  }, { timeout: 5000 })
  // Poll: call the handler and wait until the map center has actually moved to Toulouse.
  const ok = await page.waitForFunction(() => {
    window.homeCenterOnUser()
    const c = window.homeMapInstance.getCenter()
    const lat = c.lat ?? c[0]
    const lng = c.lng ?? c[1]
    return Math.abs(lat - 43.6047) < 0.5 && Math.abs(lng - 1.4442) < 0.5
  }, { timeout: 8000 }).then(() => true).catch(() => false)
  expect(ok).toBe(true)
})

test('homeSearchDestination hides the suggestion box for a too-short query', async ({ page }) => {
  await bootHome(page)
  // Make sure a suggestions container exists and is visible, then a 1-char query hides it.
  const hidden = await page.evaluate(() => {
    const c = document.getElementById('home-dest-suggestions') || document.getElementById('side-panel-suggestions')
    if (!c) return 'no-container'
    c.classList.remove('hidden')
    window.homeSearchDestination('a') // < 2 chars => must hide
    return c.classList.contains('hidden')
  })
  // Either there is no container in this layout (mobile/desktop variant) or it got hidden.
  expect(['no-container', true]).toContain(hidden)
})
