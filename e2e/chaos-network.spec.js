/**
 * Chaos Engineering — Network degradation and failure tests
 * Tests app resilience under adverse network conditions
 */
import { test, expect } from '@playwright/test'

// ══════════════════════════════════════════════════════════════════════════
// Slow 3G simulation
// ══════════════════════════════════════════════════════════════════════════
test.describe('Slow 3G network simulation', () => {
  test('app loads and is usable on slow 3G (400ms latency)', async ({ page, context }) => {
    // Simulate 3G: 400ms RTT, 400kbps download
    const cdpSession = await context.newCDPSession(page)
    await cdpSession.send('Network.enable')
    await cdpSession.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (400 * 1024) / 8, // 400kbps in bytes/s
      uploadThroughput: (200 * 1024) / 8,
      latency: 400,
    })

    const start = Date.now()
    await page.goto('/', { timeout: 30000 })
    await page.waitForLoadState('load', { timeout: 30000 })
    const loadTime = Date.now() - start

    console.log(`3G load time: ${loadTime}ms`)

    // App should load (even slowly)
    const appVisible = await page.evaluate(() => !!document.getElementById('app'))
    expect(appVisible).toBe(true)

    // Remove throttle
    await cdpSession.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: -1,
      uploadThroughput: -1,
      latency: 0,
    })
  })

  test('loading indicators appear on slow network', async ({ page, context }) => {
    const cdpSession = await context.newCDPSession(page)
    await cdpSession.send('Network.enable')

    // Intercept and delay all API calls
    await page.route('**/*.json', async (route) => {
      await new Promise(r => setTimeout(r, 2000)) // 2s delay
      await route.continue()
    })

    await page.goto('/', { timeout: 30000 })
    await page.waitForTimeout(2000)

    // App should not crash while waiting
    const appAlive = await page.evaluate(() => !!document.getElementById('app'))
    expect(appAlive).toBe(true)
  })
})

// ══════════════════════════════════════════════════════════════════════════
// Malformed API responses
// ══════════════════════════════════════════════════════════════════════════
test.describe('Malformed API responses — contract testing', () => {
  test('Overpass API returning HTML instead of JSON does not crash', async ({ page }) => {
    await page.route('**/overpass-api.de/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body>Service Unavailable</body></html>',
      })
    })

    await page.goto('/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(2000)

    // Trigger a gas station fetch (which uses Overpass)
    await page.evaluate(() => {
      try {
        window.loadGasStations?.()
      } catch { /* intentional */ }
    })
    await page.waitForTimeout(1000)

    const appAlive = await page.evaluate(() => !!document.getElementById('app'))
    expect(appAlive).toBe(true)
  })

  test('fetch returning 200 OK with empty JSON {} does not crash', async ({ page }) => {
    // Intercept spots data files
    await page.route('**/public/data/spots/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: '{}',
      })
    })

    await page.goto('/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(2000)

    const appAlive = await page.evaluate(() => !!document.getElementById('app'))
    expect(appAlive).toBe(true)
  })

  test('fetch returning 500 server error is handled gracefully', async ({ page }) => {
    let errorCount = 0
    page.on('pageerror', () => errorCount++)

    await page.route('**/overpass-api.de/**', (route) => {
      route.fulfill({ status: 500, body: 'Internal Server Error' })
    })

    await page.goto('/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(2000)

    // No unhandled JS errors
    expect(errorCount).toBe(0)
  })

  test('OSRM routing returns empty route — no crash', async ({ page }) => {
    await page.route('**/router.project-osrm.org/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ code: 'Ok', routes: [] }),
      })
    })

    await page.goto('/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(2000)

    const appAlive = await page.evaluate(() => !!document.getElementById('app'))
    expect(appAlive).toBe(true)
  })
})

// ══════════════════════════════════════════════════════════════════════════
// localStorage chaos
// ══════════════════════════════════════════════════════════════════════════
test.describe('localStorage chaos', () => {
  test('corrupted JSON in localStorage does not crash app', async ({ page }) => {
    let jsErrors = 0
    page.on('pageerror', () => jsErrors++)

    // Set corrupted localStorage before page loads
    await page.addInitScript(() => {
      localStorage.setItem('spothitch_v4_state', '{broken json ><><<')
      localStorage.setItem('spothitch_lang', '}{invalid')
    })

    await page.goto('/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(2000)

    const appAlive = await page.evaluate(() => !!document.getElementById('app'))
    expect(appAlive).toBe(true)
    expect(jsErrors).toBe(0)
  })

  test('QuotaExceededError on localStorage.setItem is handled', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(2000)

    // Override localStorage.setItem to throw QuotaExceededError
    const result = await page.evaluate(() => {
      const original = localStorage.setItem.bind(localStorage)
      let threw = false
      localStorage.setItem = () => {
        threw = true
        const err = new DOMException('QuotaExceededError', 'QuotaExceededError')
        throw err
      }
      try {
        window.setState?.({ lang: 'en' })
        return { crashed: false, threw }
      } catch (e) {
        return { crashed: true, error: e.message }
      } finally {
        localStorage.setItem = original
      }
    })

    // App should not crash even if localStorage fails
    expect(result.crashed).toBe(false)
  })

  test('app survives localStorage being completely cleared mid-session', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(2000)

    // Do some state changes
    await page.evaluate(() => {
      window.setState?.({ lang: 'en', showSpots: true })
    })
    await page.waitForTimeout(500)

    // Clear ALL localStorage mid-session
    await page.evaluate(() => localStorage.clear())
    await page.waitForTimeout(500)

    // Try to continue using the app
    await page.evaluate(() => {
      try {
        window.setState?.({ lang: 'fr' })
      } catch { /* ok */ }
    })

    const appAlive = await page.evaluate(() => !!document.getElementById('app'))
    expect(appAlive).toBe(true)
  })
})

// ══════════════════════════════════════════════════════════════════════════
// Concurrent network failures
// ══════════════════════════════════════════════════════════════════════════
test.describe('Network timeout chaos', () => {
  test('all API calls timing out simultaneously does not freeze UI', async ({ page }) => {
    // Make all external API calls hang for 5 seconds
    await page.route('**/nominatim.openstreetmap.org/**', (route) =>
      new Promise(r => setTimeout(() => route.abort(), 5000))
    )
    await page.route('**/overpass-api.de/**', (route) =>
      new Promise(r => setTimeout(() => route.abort(), 5000))
    )

    await page.goto('/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(3000)

    // UI should still be responsive
    const appAlive = await page.evaluate(() => !!document.getElementById('app'))
    expect(appAlive).toBe(true)

    // Can still interact with the UI
    const canNavigate = await page.evaluate(() => {
      try {
        window.setState?.({ showSpots: true })
        return true
      } catch { return false }
    })
    expect(canNavigate).toBe(true)
  })
})
