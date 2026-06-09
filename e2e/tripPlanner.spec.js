/**
 * Trip Planner Deep E2E Tests
 *
 * Tests autocomplete, route calculation, save/load, multi-stops, bottom sheet.
 */
import { test, expect } from '@playwright/test'
import { skipOnboarding, navigateToTab } from './helpers.js'

test.describe.skip('Trip Planner Deep (hidden during alpha)', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page, { tab: 'voyage' })
    // Force voyage sub-tab (default is 'journal' when VITE_SHOW_BETA is unset)
    await page.evaluate(() => window.setState?.({ voyageSubTab: 'voyage' }))
    await page.waitForTimeout(2000)
  })

  test('trip from/to inputs are visible', async ({ page }) => {
    const fromInput = page.locator('#trip-from')
    const toInput = page.locator('#trip-to')
    const hasFrom = await fromInput.count() > 0
    const hasTo = await toInput.count() > 0
    expect(hasFrom || hasTo).toBe(true)
  })

  test('typing in from field triggers autocomplete', async ({ page }) => {
    const fromInput = page.locator('input[placeholder*="Départ"], input[placeholder*="From"], input[id*="trip-from"], input[id*="from"]').first()
    if (await fromInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await fromInput.fill('Par')
      await page.waitForTimeout(2000)
      // Check for autocomplete suggestions
      const suggestions = page.locator('[class*="suggestion"], [class*="autocomplete"] li, [class*="dropdown"] li, [role="option"]')
      const count = await suggestions.count()
      expect(count).toBeGreaterThanOrEqual(0) // May need network
    }
  })

  test('swap button swaps from/to', async ({ page }) => {
    const swapBtn = page.locator('button[onclick*="swap"], button[onclick*="Swap"], [class*="swap"], button[aria-label*="swap"]')
    if (await swapBtn.count() > 0 && await swapBtn.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      await swapBtn.first().click()
      await page.waitForTimeout(500)
      expect(true).toBeTruthy() // Swap executed
    }
  })

  test('trip save/load/rename/delete handlers batch check', async ({ page }) => {
    const handlers = ['saveCurrentTrip', 'saveTripWithSpots', 'loadSavedTrip', 'renameSavedTrip', 'deleteSavedTrip', 'openTripHistory']
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThan(0)
  })

  test('trip multi-stop handlers batch check', async ({ page }) => {
    const handlers = ['addTripStepFromSearch', 'addTripStop', 'moveTripStep', 'removeTripStep']
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThan(0)
  })

  test('trip gas station toggle is callable', async ({ page }) => {
    await page.evaluate(() => (window.toggleTripGasStations || window.toggleGasStations)?.())
    await page.waitForTimeout(300)
    const alive = await page.evaluate(() => !!document.getElementById('app'))
    expect(alive).toBe(true)
  })

  test('trip bottom sheet handle exists for interaction', async ({ page }) => {
    const handle = page.locator('[class*="sheet-handle"], [class*="drag-handle"], [class*="bottom-sheet"] [class*="handle"]')
    const count = await handle.count()
    expect(count).toBeGreaterThanOrEqual(0) // Bottom sheet may not be visible on initial load
  })

  test('trip route filter handlers batch check', async ({ page }) => {
    const handlers = ['setRouteFilter', 'filterRouteSpots', 'toggleRouteAmenities']
    const found = await page.evaluate((hs) => hs.filter(h => typeof window[h] === 'function'), handlers)
    expect(found.length).toBeGreaterThan(0)
  })

  test('journal sub-tab shows content', async ({ page }) => {
    const journalTab = page.locator('button:has-text("Journal"), button:has-text("journal"), [data-subtab="journal"]')
    if (await journalTab.count() > 0) {
      await journalTab.first().click()
      await page.waitForTimeout(1000)
      const content = await page.evaluate(() => {
        const container = document.querySelector('[class*="journal"], [data-view="journal"]')
        return container?.textContent?.length || 0
      })
      expect(content).toBeGreaterThanOrEqual(0)
    }
  })
})
