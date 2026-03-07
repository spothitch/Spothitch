#!/usr/bin/env node
/**
 * Network Resilience Check (Playwright-based)
 *
 * Tests the app under adverse network conditions:
 * 1. Offline mode — app should still render and show cached data
 * 2. Slow 3G — app should load (maybe slower) without errors
 * 3. Network cut mid-action — should handle gracefully
 * 4. Failed API requests — should show error states, not crash
 *
 * Usage: node scripts/checks/network-resilience.mjs
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const REPORT_DIR = join(ROOT, 'audit-screenshots')
const VIEWPORT = { width: 390, height: 844 }
const BASE_URL = process.env.APP_URL || 'http://localhost:5173'

if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true })

async function runNetworkAudit() {
  let chromium
  try {
    const pw = await import('playwright')
    chromium = pw.chromium
  } catch {
    console.error('Playwright not installed.')
    process.exit(1)
  }

  const results = {
    offline: { tested: false, appRenders: false, errors: [], details: '' },
    slow3g: { tested: false, loaded: false, loadTime: 0, errors: [] },
    networkCut: { tested: false, handled: false, errors: [] },
    failedApi: { tested: false, graceful: false, errors: [] },
  }

  // --- Test 1: Offline mode ---
  console.log('\n--- Test 1: Offline Mode ---')
  try {
    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
      viewport: VIEWPORT,
      colorScheme: 'dark',
    })

    await context.addInitScript(() => {
      localStorage.setItem('spothitch_onboarding_complete', 'true')
      localStorage.setItem('spothitch_landing_v2', '1')
      localStorage.setItem('spothitch_beta_seen', '1')
      localStorage.setItem('spothitch_cookies_accepted', 'true')
      localStorage.setItem('spothitch_v4_state', JSON.stringify({
        showLanding: false, theme: 'dark', lang: 'fr', activeTab: 'home',
        username: 'OfflineBot', points: 500,
      }))
      localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({
        preferences: { necessary: true, analytics: true, marketing: false },
        timestamp: Date.now(), version: '1'
      }))
    })

    const page = await context.newPage()

    // First load online to cache resources
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(3000)

    // Now go offline
    await context.setOffline(true)

    // Try to navigate between tabs
    const pageErrors = []
    page.on('pageerror', err => pageErrors.push(err.message))

    // Navigate tabs while offline
    for (const tab of ['voyage', 'social', 'profile', 'home']) {
      await page.evaluate((t) => {
        document.querySelector(`[data-tab="${t}"]`)?.click()
      }, tab)
      await page.waitForTimeout(800)
    }

    const appVisible = await page.evaluate(() => {
      return document.querySelector('#app, [id="app"]')?.offsetHeight > 0
    })

    results.offline.tested = true
    results.offline.appRenders = appVisible
    results.offline.errors = pageErrors.slice(0, 10)

    await page.screenshot({
      path: join(REPORT_DIR, 'network-offline.png'),
      fullPage: false,
      timeout: 5000,
    })

    console.log(`  App renders offline: ${appVisible ? 'YES' : 'NO'}`)
    console.log(`  Errors while offline: ${pageErrors.length}`)

    await browser.close()
  } catch (err) {
    console.log(`  [ERROR] ${err.message}`)
    results.offline.errors.push(err.message)
  }

  // --- Test 2: Slow 3G ---
  console.log('\n--- Test 2: Slow 3G ---')
  try {
    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
      viewport: VIEWPORT,
      colorScheme: 'dark',
    })

    await context.addInitScript(() => {
      localStorage.setItem('spothitch_onboarding_complete', 'true')
      localStorage.setItem('spothitch_landing_v2', '1')
      localStorage.setItem('spothitch_beta_seen', '1')
      localStorage.setItem('spothitch_cookies_accepted', 'true')
      localStorage.setItem('spothitch_v4_state', JSON.stringify({
        showLanding: false, theme: 'dark', lang: 'fr', activeTab: 'home',
        username: 'Slow3GBot', points: 500,
      }))
      localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({
        preferences: { necessary: true, analytics: true, marketing: false },
        timestamp: Date.now(), version: '1'
      }))
    })

    const page = await context.newPage()

    // Simulate slow 3G via CDP
    const cdp = await context.newCDPSession(page)
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 50 * 1024, // 50 KB/s (slow 3G)
      uploadThroughput: 25 * 1024,
      latency: 400, // 400ms latency
    })

    const startTime = Date.now()
    const pageErrors = []
    page.on('pageerror', err => pageErrors.push(err.message))

    try {
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
      await page.waitForTimeout(5000) // Give extra time for slow network

      const loadTime = Date.now() - startTime
      const appVisible = await page.evaluate(() => {
        return document.querySelector('#app, [id="app"]')?.offsetHeight > 0
      })

      results.slow3g.tested = true
      results.slow3g.loaded = appVisible
      results.slow3g.loadTime = loadTime
      results.slow3g.errors = pageErrors.slice(0, 10)

      console.log(`  Loaded: ${appVisible ? 'YES' : 'NO'} in ${loadTime}ms`)
      console.log(`  Errors: ${pageErrors.length}`)

      await page.screenshot({
        path: join(REPORT_DIR, 'network-slow3g.png'),
        fullPage: false,
        timeout: 10000,
      })
    } catch (err) {
      results.slow3g.loadTime = Date.now() - startTime
      console.log(`  [TIMEOUT] Page did not load in 60s on slow 3G`)
      results.slow3g.errors.push(err.message)
    }

    await browser.close()
  } catch (err) {
    console.log(`  [ERROR] ${err.message}`)
    results.slow3g.errors.push(err.message)
  }

  // --- Test 3: Network cut mid-action ---
  console.log('\n--- Test 3: Network Cut Mid-Action ---')
  try {
    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
      viewport: VIEWPORT,
      colorScheme: 'dark',
    })

    await context.addInitScript(() => {
      localStorage.setItem('spothitch_onboarding_complete', 'true')
      localStorage.setItem('spothitch_landing_v2', '1')
      localStorage.setItem('spothitch_beta_seen', '1')
      localStorage.setItem('spothitch_cookies_accepted', 'true')
      localStorage.setItem('spothitch_v4_state', JSON.stringify({
        showLanding: false, theme: 'dark', lang: 'fr', activeTab: 'home',
        username: 'CutBot', points: 500,
      }))
      localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({
        preferences: { necessary: true, analytics: true, marketing: false },
        timestamp: Date.now(), version: '1'
      }))
    })

    const page = await context.newPage()
    const pageErrors = []
    page.on('pageerror', err => pageErrors.push(err.message))

    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(3000)

    // Start an action that requires network (e.g., navigate to a tab that loads data)
    await page.evaluate(() => {
      document.querySelector('[data-tab="social"]')?.click()
    })

    // Cut network immediately
    await context.setOffline(true)
    await page.waitForTimeout(3000)

    // Check if app handled it gracefully
    const appAlive = await page.evaluate(() => {
      const app = document.querySelector('#app, [id="app"]')
      return app?.offsetHeight > 0
    })

    results.networkCut.tested = true
    results.networkCut.handled = appAlive && pageErrors.length === 0
    results.networkCut.errors = pageErrors.slice(0, 10)

    console.log(`  App alive after cut: ${appAlive ? 'YES' : 'NO'}`)
    console.log(`  Unhandled errors: ${pageErrors.length}`)

    await page.screenshot({
      path: join(REPORT_DIR, 'network-cut.png'),
      fullPage: false,
      timeout: 5000,
    })

    await browser.close()
  } catch (err) {
    console.log(`  [ERROR] ${err.message}`)
    results.networkCut.errors.push(err.message)
  }

  // --- Test 4: Failed API requests ---
  console.log('\n--- Test 4: Failed API Requests ---')
  try {
    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
      viewport: VIEWPORT,
      colorScheme: 'dark',
    })

    await context.addInitScript(() => {
      localStorage.setItem('spothitch_onboarding_complete', 'true')
      localStorage.setItem('spothitch_landing_v2', '1')
      localStorage.setItem('spothitch_beta_seen', '1')
      localStorage.setItem('spothitch_cookies_accepted', 'true')
      localStorage.setItem('spothitch_v4_state', JSON.stringify({
        showLanding: false, theme: 'dark', lang: 'fr', activeTab: 'home',
        username: 'ErrorBot', points: 500,
      }))
      localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({
        preferences: { necessary: true, analytics: true, marketing: false },
        timestamp: Date.now(), version: '1'
      }))
    })

    const page = await context.newPage()
    const pageErrors = []
    page.on('pageerror', err => pageErrors.push(err.message))

    // Intercept Firebase/API calls and return errors
    await page.route('**/*firestore*/**', route => {
      route.fulfill({ status: 500, body: 'Internal Server Error' })
    })
    await page.route('**/*firebase*/**', route => {
      route.fulfill({ status: 503, body: 'Service Unavailable' })
    })

    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(5000)

    // Navigate through tabs
    for (const tab of ['social', 'profile', 'voyage', 'home']) {
      await page.evaluate((t) => {
        document.querySelector(`[data-tab="${t}"]`)?.click()
      }, tab)
      await page.waitForTimeout(1000)
    }

    const appAlive = await page.evaluate(() => {
      return document.querySelector('#app, [id="app"]')?.offsetHeight > 0
    })

    results.failedApi.tested = true
    results.failedApi.graceful = appAlive
    results.failedApi.errors = pageErrors.slice(0, 10)

    console.log(`  App survives API errors: ${appAlive ? 'YES' : 'NO'}`)
    console.log(`  Unhandled errors: ${pageErrors.length}`)

    await page.screenshot({
      path: join(REPORT_DIR, 'network-failed-api.png'),
      fullPage: false,
      timeout: 5000,
    })

    await browser.close()
  } catch (err) {
    console.log(`  [ERROR] ${err.message}`)
    results.failedApi.errors.push(err.message)
  }

  return results
}

export default async function checkNetworkResilience(opts = {}) {
  try {
    const results = await runNetworkAudit()

    console.log('\n' + '='.repeat(60))
    console.log('  NETWORK RESILIENCE REPORT')
    console.log('='.repeat(60))
    console.log(`  Offline: ${results.offline.appRenders ? 'OK' : 'FAIL'}`)
    console.log(`  Slow 3G: ${results.slow3g.loaded ? `OK (${results.slow3g.loadTime}ms)` : 'FAIL'}`)
    console.log(`  Network cut: ${results.networkCut.handled ? 'OK' : 'ISSUES'}`)
    console.log(`  Failed API: ${results.failedApi.graceful ? 'OK' : 'CRASH'}`)
    console.log('='.repeat(60))

    writeFileSync(
      join(REPORT_DIR, 'network-resilience-report.json'),
      JSON.stringify(results, null, 2)
    )

    let score = 100
    if (!results.offline.appRenders) score -= 30
    if (!results.slow3g.loaded) score -= 20
    if (!results.networkCut.handled) score -= 25
    if (!results.failedApi.graceful) score -= 25

    return {
      name: 'Network Resilience',
      score: Math.max(0, score),
      maxScore: 100,
      errors: [
        !results.offline.appRenders && 'App does not render offline',
        !results.failedApi.graceful && 'App crashes on failed API calls',
      ].filter(Boolean),
      warnings: [
        !results.slow3g.loaded && 'App does not load on slow 3G',
        !results.networkCut.handled && 'Unhandled errors on network cut',
      ].filter(Boolean),
      stats: {
        offlineWorks: results.offline.appRenders,
        slow3gWorks: results.slow3g.loaded,
        slow3gLoadTime: results.slow3g.loadTime,
        networkCutHandled: results.networkCut.handled,
        failedApiGraceful: results.failedApi.graceful,
      }
    }
  } catch (err) {
    return {
      name: 'Network Resilience',
      score: 0,
      maxScore: 100,
      errors: [`Network audit failed: ${err.message}`],
      warnings: [],
      stats: {}
    }
  }
}

if (process.argv[1]?.includes('network-resilience')) {
  checkNetworkResilience().then(result => {
    process.exit(result.score >= 70 ? 0 : 1)
  })
}
