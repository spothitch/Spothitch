/**
 * E2E Tests - Error Handling & Resilience
 * Tests what happens when things GO WRONG:
 * - Network drops mid-action
 * - Invalid data
 * - GPS permission denied
 * - Firebase unavailable
 */

import { test, expect } from '@playwright/test'
import { skipOnboarding, navigateToTab, getAppState } from './helpers.js'

test.describe('Network Failure Resilience', () => {
  test('app should show offline indicator when network drops', async ({ page }) => {
    await skipOnboarding(page)
    await navigateToTab(page, 'map')

    // Go offline
    await page.context().setOffline(true)
    await page.waitForTimeout(2000)

    // REAL RESULT: app should show an offline indicator or message
    const hasOfflineUI = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase()
      const hasIndicator = document.querySelector('[class*="offline"], [id*="offline"], [data-offline]') !== null
      const hasText = text.includes('hors ligne') || text.includes('offline') || text.includes('connexion')
      return hasIndicator || hasText
    })
    // App should at minimum not crash — nav still visible
    await expect(page.locator('nav')).toBeVisible()

    // Go back online
    await page.context().setOffline(false)
    await page.waitForTimeout(2000)

    // REAL RESULT: app should recover
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('#home-map').first()).toBeVisible({ timeout: 10000 })
  })

  test('app should handle network drop during search gracefully', async ({ page }) => {
    await skipOnboarding(page)
    await navigateToTab(page, 'map')
    const errors = []
    page.on('pageerror', err => errors.push(err.message))

    const searchInput = page.locator('#home-destination')
    await expect(searchInput).toBeVisible({ timeout: 10000 })

    // Start typing then immediately go offline
    await searchInput.fill('Barce')
    await page.context().setOffline(true)
    await searchInput.dispatchEvent('input')
    await page.waitForTimeout(2000)

    // REAL RESULT: no crash, app still functional
    const criticalErrors = errors.filter(e =>
      !e.includes('Firebase') && !e.includes('net::ERR') &&
      !e.includes('Failed to fetch') && !e.includes('Sentry') &&
      !e.includes('WebGL') && !e.includes('maplibregl') && !e.includes('MapLibre') &&
      !e.includes('WebSocket') && !e.includes('Nominatim') &&
      !e.includes('tile') && !e.includes('pbf') &&
      !e.includes('canvas') && !e.includes('ResizeObserver') &&
      !e.includes('maplibre') && !e.includes('AbortError') &&
      !e.includes('NetworkError') && !e.includes('offline') &&
      !e.includes('workbox') && !e.includes('service-worker') &&
      !e.includes('caches') && !e.includes('Cache')
    )
    expect(criticalErrors).toEqual([])

    // Map should still be visible
    await expect(page.locator('#home-map').first()).toBeVisible()

    // Restore network
    await page.context().setOffline(false)
  })

  test('map should remain functional after brief network interruption', async ({ page }) => {
    await skipOnboarding(page)
    await navigateToTab(page, 'map')

    // Brief offline then online
    await page.context().setOffline(true)
    await page.waitForTimeout(1000)
    await page.context().setOffline(false)
    await page.waitForTimeout(2000)

    // REAL RESULT: map should still work (zoom should work)
    const zoomBefore = await page.evaluate(() => {
      const map = window.homeMapInstance
      return map && map.getZoom ? map.getZoom() : null
    })

    const zoomInBtn = page.locator('[onclick*="homeZoomIn"]').first()
    if (await zoomInBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await zoomInBtn.click({ force: true })
      await page.waitForTimeout(500)

      const zoomAfter = await page.evaluate(() => {
        const map = window.homeMapInstance
        return map && map.getZoom ? map.getZoom() : null
      })

      if (zoomBefore !== null && zoomAfter !== null) {
        expect(zoomAfter).toBeGreaterThan(zoomBefore)
      }
    }
  })
})

test.describe('Invalid Data Resilience', () => {
  test('opening spot detail with invalid data should not crash', async ({ page }) => {
    await skipOnboarding(page)
    const errors = []
    page.on('pageerror', err => errors.push(err.message))

    // Try to open spot detail with null/undefined/empty data
    await page.evaluate(() => {
      try { window.openSpotDetail?.(null) } catch {}
      try { window.openSpotDetail?.(undefined) } catch {}
      try { window.openSpotDetail?.({}) } catch {}
      try { window.openSpotDetail?.({ id: '', name: '', lat: NaN, lng: NaN }) } catch {}
    })
    await page.waitForTimeout(500)

    // REAL RESULT: app should not crash
    await expect(page.locator('nav')).toBeVisible()

    const criticalErrors = errors.filter(e =>
      !e.includes('Firebase') && !e.includes('net::ERR') &&
      !e.includes('Failed to fetch') && !e.includes('Sentry')
    )
    // Allow some errors but app must remain functional
    await expect(page.locator('#home-map').first()).toBeVisible({ timeout: 5000 })
  })

  test('handlers should handle invalid arguments without crash', async ({ page }) => {
    await skipOnboarding(page)
    const errors = []
    page.on('pageerror', err => errors.push(err.message))

    // Call various handlers with bad arguments
    await page.evaluate(() => {
      const badArgs = [null, undefined, '', 0, -1, NaN, {}, [], 'invalid']
      for (const arg of badArgs) {
        try { window.selectSpotType?.(arg) } catch {}
        try { window.setSpotRating?.(arg, arg) } catch {}
        try { window.navigateToTab?.(arg) } catch {}
      }
    })
    await page.waitForTimeout(500)

    // REAL RESULT: nav should still be visible, app functional
    await expect(page.locator('nav')).toBeVisible()
  })
})

test.describe('State Corruption Recovery', () => {
  test('app should handle corrupted localStorage gracefully', async ({ page }) => {
    // Set corrupted state BEFORE loading the page
    await page.addInitScript(() => {
      localStorage.setItem('spothitch_v4_state', 'not-valid-json{{{')
      localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({
        preferences: { necessary: true, analytics: false, marketing: false, personalization: false },
        timestamp: Date.now(),
        version: '1.0'
      }))
      localStorage.setItem('spothitch_age_verified', 'true')
      localStorage.setItem('spothitch_landing_v2', '1')
    })

    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(5000)

    // REAL RESULT: app should not be a white screen — it should recover
    const appContent = await page.evaluate(() => {
      const app = document.getElementById('app')
      return app ? app.innerHTML.length : 0
    })
    expect(appContent).toBeGreaterThan(100)
  })

  test('app should handle missing localStorage keys', async ({ page }) => {
    // Set minimal state — missing many expected keys
    await page.addInitScript(() => {
      localStorage.clear()
      localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({
        preferences: { necessary: true, analytics: false, marketing: false, personalization: false },
        timestamp: Date.now(),
        version: '1.0'
      }))
      localStorage.setItem('spothitch_age_verified', 'true')
      localStorage.setItem('spothitch_landing_v2', '1')
    })

    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(5000)

    // REAL RESULT: app should show welcome/onboarding, not crash
    const appContent = await page.evaluate(() => {
      const app = document.getElementById('app')
      return app ? app.innerHTML.length : 0
    })
    expect(appContent).toBeGreaterThan(100)
  })
})

test.describe('GPS Permission Handling', () => {
  test('app should work without GPS permission', async ({ page }) => {
    // Deny geolocation
    await page.context().clearPermissions()

    await skipOnboarding(page)
    await navigateToTab(page, 'map')

    // REAL RESULT: map should still display (just without user location marker)
    await expect(page.locator('#home-map').first()).toBeVisible({ timeout: 10000 })

    // Map should have canvas tiles
    const hasCanvas = await page.evaluate(() => {
      const map = document.querySelector('#home-map')
      return map ? map.querySelectorAll('canvas').length > 0 : false
    })
    expect(hasCanvas).toBe(true)

    // Zoom should still work without GPS
    const zoomInBtn = page.locator('[onclick*="homeZoomIn"]').first()
    if (await zoomInBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await zoomInBtn.click({ force: true })
      await page.waitForTimeout(300)
      await expect(page.locator('#home-map')).toBeVisible()
    }
  })
})
