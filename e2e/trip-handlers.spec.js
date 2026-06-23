import { test, expect } from '@playwright/test'

/**
 * Trip-planner handlers — REAL effect (Brique 2).
 *
 * Mounts the Voyage view (changeTab('voyage') loads the module so the real handlers
 * replace any lazy stub), then triggers each handler and verifies the concrete effect:
 * form collapse flag, gas-station toggle, removed-spot list, and the map bridge calls
 * (tripFitBounds / tripMapShowSpot) which we observe through installed spies.
 */
async function bootVoyage(page) {
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
  await page.evaluate(() => window.changeTab('voyage'))
  await page.waitForFunction(() => typeof window.tripExpandForm === 'function' && typeof window.tripFitBounds === 'function', { timeout: 15000 })
}

test('tripExpandForm / tripCollapseForm flip the form-collapsed flag', async ({ page }) => {
  await bootVoyage(page)
  await page.evaluate(() => window.tripCollapseForm())
  expect(await page.evaluate(() => window.getState().tripFormCollapsed)).toBe(true)
  await page.evaluate(() => window.tripExpandForm())
  expect(await page.evaluate(() => window.getState().tripFormCollapsed)).toBe(false)
})

test('toggleTripGasStations toggles the gas-station flag', async ({ page }) => {
  await bootVoyage(page)
  const before = await page.evaluate(() => !!window.getState().tripShowGasStations)
  await page.evaluate(() => window.toggleTripGasStations())
  const after = await page.evaluate(() => !!window.getState().tripShowGasStations)
  expect(after).toBe(!before)
})

test('removeTripMapSpot records the removed spot id in state', async ({ page }) => {
  await bootVoyage(page)
  await page.evaluate(() => { window._tripMapUpdateSpots = () => {} })
  await page.evaluate(() => window.removeTripMapSpot('spot-xyz'))
  const removed = await page.evaluate(() => window.getState().tripRemovedSpots || [])
  expect(removed).toContain('spot-xyz')
})

test('tripFitBounds passes route + spot coordinates to the map bridge', async ({ page }) => {
  await bootVoyage(page)
  await page.evaluate(() => {
    window.__fitArgs = null
    window._tripMapFitBounds = (coords) => { window.__fitArgs = coords }
    window.setState({
      tripResults: {
        fromCoords: [48.8566, 2.3522], // [lat, lng]
        toCoords: [45.7640, 4.8357],
        spots: [{ id: 's1', coordinates: { lat: 47.0, lng: 3.5 } }],
      },
    })
  })
  await page.evaluate(() => window.tripFitBounds())
  const args = await page.evaluate(() => window.__fitArgs)
  expect(Array.isArray(args)).toBe(true)
  expect(args.length).toBe(3) // from + to + 1 spot, as [lng, lat]
})

test('tripMapShowSpot flies the map to the requested spot', async ({ page }) => {
  await bootVoyage(page)
  await page.evaluate(() => {
    window.__flyTo = null
    window._tripMapFlyTo = (lng, lat) => { window.__flyTo = { lng, lat } }
    window._tripMapShowPopup = () => {}
    window.setState({
      tripResults: { spots: [{ id: 's1', coordinates: { lat: 47.0, lng: 3.5 } }] },
    })
  })
  await page.evaluate(() => window.tripMapShowSpot('s1'))
  const flyTo = await page.evaluate(() => window.__flyTo)
  expect(flyTo).toEqual({ lng: 3.5, lat: 47.0 })
})
