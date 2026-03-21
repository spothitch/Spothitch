/**
 * E2E Tests - User Flow Chains
 * Tests SEQUENTIAL actions where each step depends on the previous one.
 * These catch bugs that only appear when doing multiple things in a row.
 */

import { test, expect } from '@playwright/test'
import { skipOnboarding, navigateToTab, getAppState } from './helpers.js'

test.describe('Chain: Search → Spot Detail → Back to Map', () => {
  test('map should keep position after closing spot detail', async ({ page }) => {
    await skipOnboarding(page)
    await navigateToTab(page, 'map')

    // Step 1: Search for a city
    const searchInput = page.locator('#home-destination')
    await expect(searchInput).toBeVisible({ timeout: 10000 })
    await searchInput.fill('Lyon')
    await searchInput.dispatchEvent('input')

    const suggestions = page.locator('#home-dest-suggestions')
    try {
      await expect(suggestions).toBeVisible({ timeout: 8000 })
      await suggestions.locator('button').first().click({ force: true })
      await page.waitForTimeout(1500)
    } catch {
      // Geocoding unavailable in CI, use Enter instead
      await searchInput.press('Enter')
      await page.waitForTimeout(2000)
    }

    // Step 2: Record map position after search
    const centerAfterSearch = await page.evaluate(() => {
      const map = window.homeMapInstance
      if (map && map.getCenter) {
        const c = map.getCenter()
        return { lat: c.lat, lng: c.lng }
      }
      return null
    })

    // Step 3: Open a spot detail (simulate with handler)
    await page.evaluate(() => {
      window.openSpotDetail?.({
        id: 'test-chain-spot',
        name: 'Test Spot Lyon',
        lat: 45.75,
        lng: 4.85,
        safety: 4, traffic: 3, accessibility: 4,
        type: 'city_exit', direction: 'Paris'
      })
    })
    await page.waitForTimeout(1000)

    // Step 4: Close the spot detail
    await page.evaluate(() => window.closeSpotDetail?.())
    await page.waitForTimeout(500)

    // REAL RESULT: Map should still be at the same position (not reset)
    const centerAfterClose = await page.evaluate(() => {
      const map = window.homeMapInstance
      if (map && map.getCenter) {
        const c = map.getCenter()
        return { lat: c.lat, lng: c.lng }
      }
      return null
    })

    if (centerAfterSearch && centerAfterClose) {
      expect(Math.abs(centerAfterClose.lat - centerAfterSearch.lat)).toBeLessThan(1)
      expect(Math.abs(centerAfterClose.lng - centerAfterSearch.lng)).toBeLessThan(1)
    }
  })
})

test.describe('Chain: Tab Switching → State Persistence', () => {
  test('profile data should persist after switching to map and back', async ({ page }) => {
    await skipOnboarding(page, { points: 250 })

    // Step 1: Go to profile and verify data
    await navigateToTab(page, 'profile')
    let hasUsername = await page.evaluate(() =>
      document.body.innerText.includes('TestUser')
    )
    expect(hasUsername).toBe(true)

    // Step 2: Switch to map
    await navigateToTab(page, 'map')
    await expect(page.locator('#home-map').first()).toBeVisible({ timeout: 10000 })

    // Step 3: Switch to social
    await navigateToTab(page, 'social')
    await page.waitForTimeout(500)

    // Step 4: Go back to profile
    await navigateToTab(page, 'profile')

    // REAL RESULT: Username and points should still be there
    hasUsername = await page.evaluate(() =>
      document.body.innerText.includes('TestUser')
    )
    expect(hasUsername).toBe(true)

    // State should not have been corrupted
    const state = await getAppState(page)
    expect(state.username).toBe('TestUser')
    expect(state.points).toBe(250)
  })
})

test.describe('Chain: Theme Toggle → Navigate → Theme Persists', () => {
  test('theme should persist across tab switches', async ({ page }) => {
    await skipOnboarding(page)

    // Step 1: Go to profile settings and toggle theme to light
    await navigateToTab(page, 'profile')
    await page.evaluate(() => window.setProfileSubTab?.('reglages'))
    await page.waitForTimeout(300)
    await page.evaluate(() => window.toggleSettingsSection?.('appearance'))
    await page.waitForTimeout(300)
    const themeToggle = page.locator('[role="switch"]').first()
    if (await themeToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
      await themeToggle.click()
      await page.waitForTimeout(500)
    }

    const bgAfterToggle = await page.evaluate(() =>
      getComputedStyle(document.body).backgroundColor
    )

    // Step 2: Navigate to map
    await navigateToTab(page, 'map')
    await page.waitForTimeout(500)

    // Step 3: Navigate to social
    await navigateToTab(page, 'social')
    await page.waitForTimeout(500)

    // REAL RESULT: Background color should still be the toggled theme
    const bgAfterNavigation = await page.evaluate(() =>
      getComputedStyle(document.body).backgroundColor
    )
    expect(bgAfterNavigation).toBe(bgAfterToggle)

    // Step 4: Go back to profile
    await navigateToTab(page, 'profile')

    // REAL RESULT: Theme state should still be changed
    const state = await getAppState(page)
    expect(state.theme).toBe('light')
  })
})

test.describe('Chain: State Survives Page Reload', () => {
  test('user data should persist after page reload', async ({ page }) => {
    await skipOnboarding(page, { points: 500 })

    // Step 1: Verify initial state
    let state = await getAppState(page)
    expect(state.username).toBe('TestUser')
    expect(state.points).toBe(500)

    // Step 2: Navigate to profile to trigger any lazy saves
    await navigateToTab(page, 'profile')
    await page.waitForTimeout(500)

    // Step 3: Reload the page
    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(3000)

    // REAL RESULT: State should have survived the reload
    state = await getAppState(page)
    expect(state).toBeTruthy()
    expect(state.username).toBe('TestUser')
    expect(state.points).toBe(500)
  })
})

test.describe('Chain: Multiple Rapid Actions', () => {
  test('rapid tab switching should not crash or corrupt state', async ({ page }) => {
    await skipOnboarding(page)
    const errors = []
    page.on('pageerror', err => errors.push(err.message))

    // Rapidly switch between all tabs multiple times
    const tabs = ['map', 'social', 'challenges', 'profile', 'map', 'challenges', 'social', 'map']
    for (const tab of tabs) {
      await page.evaluate((id) => {
        const btn = document.querySelector(`[data-tab="${id}"]`)
        if (btn) btn.click()
      }, tab)
      await page.waitForTimeout(200) // Very short wait to simulate rapid clicking
    }

    // Wait for everything to settle
    await page.waitForTimeout(1000)

    // REAL RESULT: No crashes
    const criticalErrors = errors.filter(e =>
      !e.includes('Firebase') && !e.includes('net::ERR') &&
      !e.includes('Failed to fetch') && !e.includes('Sentry') &&
      !e.includes('WebGL') && !e.includes('maplibregl') &&
      !e.includes('WebSocket') && !e.includes('canvas') &&
      !e.includes('ResizeObserver') && !e.includes('tile') &&
      !e.includes('pbf')
    )
    expect(criticalErrors).toEqual([])

    // REAL RESULT: State should not be corrupted
    const state = await getAppState(page)
    expect(state).toBeTruthy()
    expect(state.username).toBe('TestUser')

    // REAL RESULT: Nav should still be functional
    await expect(page.locator('nav')).toBeVisible()
  })
})
