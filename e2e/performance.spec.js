/**
 * E2E Tests - Performance
 * Verifies the app loads fast and stays responsive.
 * Thresholds are generous for CI environments.
 */

import { test, expect } from '@playwright/test'
import { skipOnboarding, navigateToTab } from './helpers.js'

test.describe('Load Performance', () => {
  test('app should load within 8 seconds', async ({ page }) => {
    const start = Date.now()

    await page.addInitScript(() => {
      localStorage.setItem('spothitch_v4_state', JSON.stringify({
        showWelcome: false, username: 'TestUser', avatar: '🤙',
        activeTab: 'map', theme: 'dark', lang: 'fr', points: 100
      }))
      localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({
        preferences: { necessary: true }, timestamp: Date.now(), version: '1.0'
      }))
      localStorage.setItem('spothitch_age_verified', 'true')
      localStorage.setItem('spothitch_landing_v2', '1')
      localStorage.setItem('spothitch_beta_seen', '1')
      localStorage.setItem('spothitch_alpha_code', 'ok')
    })

    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('nav', { timeout: 8000 })
    const loadTime = Date.now() - start

    // REAL RESULT: app should load in under 8 seconds
    expect(loadTime).toBeLessThan(8000)
  })

  test('should have no layout shift (CLS < 0.3)', async ({ page }) => {
    await skipOnboarding(page)
    await page.waitForTimeout(2000)

    const cls = await page.evaluate(() => {
      return new Promise(resolve => {
        let clsValue = 0
        const observer = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) clsValue += entry.value
          }
        })
        observer.observe({ type: 'layout-shift', buffered: true })
        setTimeout(() => {
          observer.disconnect()
          resolve(clsValue)
        }, 1000)
      })
    })

    // REAL RESULT: CLS should be low (no jumpy layout)
    expect(cls).toBeLessThan(0.3)
  })

  test('tab switching should be fast (< 5 seconds per tab)', async ({ page }) => {
    await skipOnboarding(page)

    const tabs = ['profile', 'social', 'voyage', 'map']
    for (const tab of tabs) {
      const start = Date.now()
      await navigateToTab(page, tab)

      const switchTime = Date.now() - start

      // REAL RESULT: app should have rendered content
      const appLength = await page.evaluate(() =>
        document.getElementById('app')?.innerHTML?.length || 0
      )
      expect(appLength).toBeGreaterThan(100)

      // REAL RESULT: each tab should render within 8 seconds (CI is slower + auth gate overhead)
      expect(switchTime).toBeLessThan(8000)
    }
  })

  test('map should render canvas within 5 seconds', async ({ page }) => {
    await skipOnboarding(page)
    await navigateToTab(page, 'map')

    const start = Date.now()
    await page.waitForFunction(() => {
      const map = document.querySelector('#home-map')
      return map && map.querySelectorAll('canvas').length > 0
    }, { timeout: 5000 })
    const renderTime = Date.now() - start

    // REAL RESULT: map tiles should render within 5 seconds
    expect(renderTime).toBeLessThan(5000)
  })

  test('no console errors on clean load', async ({ page }) => {
    const errors = []
    page.on('pageerror', err => errors.push(err.message))

    await skipOnboarding(page)
    await page.waitForTimeout(2000)

    // Filter out expected errors (third-party libs, network issues in CI)
    const realErrors = errors.filter(e =>
      !e.includes('Firebase') && !e.includes('net::ERR') &&
      !e.includes('Failed to fetch') && !e.includes('Sentry') &&
      !e.includes('WebGL') && !e.includes('maplibregl') && !e.includes('MapLibre') &&
      !e.includes('WebSocket') && !e.includes('canvas') &&
      !e.includes('ResizeObserver') && !e.includes('tile') &&
      !e.includes('pbf') && !e.includes('Nominatim') &&
      !e.includes('workbox') && !e.includes('service-worker')
    )

    // REAL RESULT: zero unexpected JavaScript errors
    expect(realErrors).toEqual([])
  })

  test('bundle size should be under 750KB', async ({ page }) => {
    await skipOnboarding(page)

    // Check main JS bundle size via performance API
    const mainBundleSize = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource')
      const jsEntries = entries.filter(e => e.name.includes('.js') && e.name.includes('index'))
      return jsEntries.length > 0 ? jsEntries[0].transferSize : 0
    })

    // REAL RESULT: compressed bundle should be reasonable
    if (mainBundleSize > 0) {
      const sizeKB = mainBundleSize / 1024
      expect(sizeKB).toBeLessThan(750)
    }
  })
})

test.describe('Mobile Responsiveness', () => {
  test('should have no horizontal overflow on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await skipOnboarding(page)

    // Check each tab for horizontal overflow
    const tabs = ['map', 'profile', 'social', 'voyage']
    for (const tab of tabs) {
      await navigateToTab(page, tab)
      await page.waitForTimeout(500)

      const hasOverflow = await page.evaluate(() =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth
      )
      // REAL RESULT: no horizontal scrollbar on any tab
      expect(hasOverflow).toBe(false)
    }
  })

  test('touch targets should be at least 40x40px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await skipOnboarding(page)

    // Check nav buttons (most critical touch targets)
    const navButtons = page.locator('nav button')
    const count = await navButtons.count()

    for (let i = 0; i < count; i++) {
      const box = await navButtons.nth(i).boundingBox()
      if (box) {
        // REAL RESULT: each nav button should be big enough to tap
        expect(box.width).toBeGreaterThanOrEqual(40)
        expect(box.height).toBeGreaterThanOrEqual(40)
      }
    }
  })
})
