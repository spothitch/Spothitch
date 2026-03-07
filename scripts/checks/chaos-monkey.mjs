#!/usr/bin/env node
/**
 * Chaos Monkey Check (Playwright-based)
 *
 * Randomly clicks, scrolls, types, and interacts with the app
 * for a configurable duration per screen. Catches:
 * - Unhandled exceptions from unexpected interactions
 * - Console errors from edge cases
 * - App crashes (blank screen, unresponsive)
 * - Memory leaks (DOM node count explosion)
 *
 * Usage: node scripts/checks/chaos-monkey.mjs [--duration=10]
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

// Duration per screen in seconds
const DURATION_ARG = process.argv.find(a => a.startsWith('--duration='))
const DURATION = DURATION_ARG ? parseInt(DURATION_ARG.split('=')[1]) : 10

const CHAOS_SCRIPT = `(duration) => {
  return new Promise((resolve) => {
    const errors = []
    const startNodes = document.querySelectorAll('*').length
    let clicks = 0, scrolls = 0, types = 0

    // Capture errors
    const origError = console.error
    console.error = (...args) => {
      errors.push(args.map(a => String(a)).join(' ').substring(0, 200))
      origError.apply(console, args)
    }

    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    function randomAction() {
      const action = randomInt(0, 4)

      switch (action) {
        case 0: // Random click
        case 1: {
          const x = randomInt(10, window.innerWidth - 10)
          const y = randomInt(10, window.innerHeight - 10)
          try {
            const el = document.elementFromPoint(x, y)
            if (el) {
              el.click()
              clicks++
            }
          } catch (e) {
            errors.push('Click error: ' + e.message)
          }
          break
        }
        case 2: { // Random scroll
          const scrollTarget = randomInt(-500, 500)
          window.scrollBy(0, scrollTarget)
          // Also try scrolling modal content
          const scrollable = document.querySelector('.modal-overlay, [style*="overflow"]')
          if (scrollable) scrollable.scrollTop += scrollTarget
          scrolls++
          break
        }
        case 3: { // Random type in any input
          const inputs = document.querySelectorAll('input, textarea, select')
          if (inputs.length > 0) {
            const input = inputs[randomInt(0, inputs.length - 1)]
            const chaosText = ['', '   ', '<script>alert(1)</script>', '🎉🔥💀', 'a'.repeat(1000),
              '-99999', '0', 'null', 'undefined', 'DROP TABLE users', '../../../etc/passwd',
              '\\n\\r\\t', String.fromCharCode(0), '日本語テスト'][randomInt(0, 12)]
            try {
              input.focus()
              input.value = chaosText
              input.dispatchEvent(new Event('input', { bubbles: true }))
              input.dispatchEvent(new Event('change', { bubbles: true }))
              types++
            } catch (e) {
              errors.push('Type error: ' + e.message)
            }
          }
          break
        }
        case 4: { // Random touch event
          const x = randomInt(10, window.innerWidth - 10)
          const y = randomInt(10, window.innerHeight - 10)
          try {
            const touch = new Touch({ identifier: 1, target: document.body, clientX: x, clientY: y })
            document.dispatchEvent(new TouchEvent('touchstart', { touches: [touch], bubbles: true }))
            document.dispatchEvent(new TouchEvent('touchend', { touches: [], bubbles: true }))
          } catch (e) {
            // TouchEvent not supported in some browsers, ignore
          }
          break
        }
      }
    }

    // Run chaos at ~20 actions per second
    const interval = setInterval(randomAction, 50)

    setTimeout(() => {
      clearInterval(interval)
      console.error = origError

      const endNodes = document.querySelectorAll('*').length
      const appAlive = !!document.querySelector('#app, [id="app"], body')
      const bodyVisible = document.body.offsetHeight > 0

      resolve({
        duration,
        actions: { clicks, scrolls, types },
        errors: errors.slice(0, 20),
        errorCount: errors.length,
        domGrowth: endNodes - startNodes,
        startNodes,
        endNodes,
        appAlive,
        bodyVisible,
        crashed: !appAlive || !bodyVisible
      })
    }, duration * 1000)
  })
}`

async function runChaosAudit() {
  let chromium
  try {
    const pw = await import('playwright')
    chromium = pw.chromium
  } catch {
    console.error('Playwright not installed.')
    process.exit(1)
  }

  const results = {
    screens: [],
    totalErrors: 0,
    totalCrashes: 0,
    totalActions: { clicks: 0, scrolls: 0, types: 0 },
  }

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  })

  await context.addInitScript(() => {
    localStorage.setItem('spothitch_onboarding_complete', 'true')
    localStorage.setItem('spothitch_landing_v2', '1')
    localStorage.setItem('spothitch_beta_seen', '1')
    localStorage.setItem('spothitch_cookies_accepted', 'true')
    localStorage.setItem('spothitch_v4_state', JSON.stringify({
      showLanding: false, theme: 'dark', lang: 'fr', activeTab: 'home',
      username: 'ChaosBot', points: 500, level: 5,
    }))
    localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({
      preferences: { necessary: true, analytics: true, marketing: false },
      timestamp: Date.now(), version: '1'
    }))
  })

  const page = await context.newPage()

  // Capture page errors
  const pageErrors = []
  page.on('pageerror', err => pageErrors.push(err.message))

  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(3000)

    const screens = [
      { name: 'map', setup: null },
      { name: 'voyage', setup: `document.querySelector('[data-tab="voyage"]')?.click()` },
      { name: 'social', setup: `document.querySelector('[data-tab="social"]')?.click()` },
      { name: 'profile', setup: `document.querySelector('[data-tab="profile"]')?.click()` },
      { name: 'spotdetail', setup: `window.setState?.({ selectedSpot: {
        id: 'chaos-1', lat: 48.8566, lon: 2.3522, rating: 4,
        country: 'FR', city: 'Paris', direction: 'Lyon',
        type: 'city_exit', security: 4, traffic: 3, accessibility: 5,
        description: 'Chaos test spot', votes: 12, addedBy: 'user1', photos: [],
        destinations: [{direction: 'Lyon', waitTime: 15}]
      }})` },
    ]

    for (const screen of screens) {
      console.log(`\n  Chaos on: ${screen.name} (${DURATION}s)...`)

      if (screen.setup) {
        await page.evaluate(screen.setup)
        await page.waitForTimeout(1500)
      }

      pageErrors.length = 0 // Reset

      try {
        const chaosResult = await page.evaluate(CHAOS_SCRIPT, DURATION)

        // Combine page-level errors with in-page errors
        chaosResult.pageErrors = [...pageErrors]
        chaosResult.totalPageErrors = pageErrors.length
        chaosResult.name = screen.name

        results.screens.push(chaosResult)
        results.totalErrors += chaosResult.errorCount + chaosResult.totalPageErrors
        results.totalActions.clicks += chaosResult.actions.clicks
        results.totalActions.scrolls += chaosResult.actions.scrolls
        results.totalActions.types += chaosResult.actions.types

        if (chaosResult.crashed) {
          results.totalCrashes++
          console.log(`    CRASHED! App not responsive`)
        }

        console.log(`    ${chaosResult.actions.clicks} clicks, ${chaosResult.actions.scrolls} scrolls, ${chaosResult.actions.types} types`)
        console.log(`    Errors: ${chaosResult.errorCount + chaosResult.totalPageErrors} | DOM growth: ${chaosResult.domGrowth > 0 ? '+' : ''}${chaosResult.domGrowth} nodes`)

        if (chaosResult.domGrowth > 500) {
          console.log(`    [WARN] DOM grew by ${chaosResult.domGrowth} nodes — possible memory leak`)
        }

        // Take screenshot after chaos
        await page.screenshot({
          path: join(REPORT_DIR, `chaos-${screen.name}.png`),
          fullPage: false,
          timeout: 5000,
        })

        // Clean up modal if needed
        if (screen.name === 'spotdetail') {
          await page.evaluate(() => {
            if (window.setState) window.setState({ selectedSpot: null })
            document.querySelectorAll('.modal-overlay').forEach(m => m.remove())
          })
          await page.waitForTimeout(500)
        }

        // Verify app is still alive
        const alive = await page.evaluate(() => !!document.querySelector('#app, [id="app"]'))
        if (!alive) {
          console.log(`    [CRITICAL] App destroyed after chaos!`)
          // Try to recover
          await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 10000 })
          await page.waitForTimeout(2000)
        }
      } catch (err) {
        console.log(`    [ERROR] Chaos session crashed: ${err.message}`)
        results.totalCrashes++
        results.screens.push({ name: screen.name, crashed: true, error: err.message })

        // Try to recover
        try {
          await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 10000 })
          await page.waitForTimeout(2000)
        } catch {}
      }
    }
  } catch (err) {
    console.error(`Failed to load app: ${err.message}`)
  }

  await browser.close()
  return results
}

export default async function checkChaosMonkey(opts = {}) {
  try {
    const results = await runChaosAudit()

    console.log('\n' + '='.repeat(60))
    console.log('  CHAOS MONKEY REPORT')
    console.log('='.repeat(60))
    console.log(`  Screens tested: ${results.screens.length}`)
    console.log(`  Total actions: ${results.totalActions.clicks} clicks, ${results.totalActions.scrolls} scrolls, ${results.totalActions.types} types`)
    console.log(`  Total errors: ${results.totalErrors}`)
    console.log(`  Crashes: ${results.totalCrashes}`)

    if (results.totalErrors > 0) {
      console.log('\n  Errors by screen:')
      for (const s of results.screens) {
        if (s.errorCount > 0 || s.totalPageErrors > 0) {
          console.log(`    ${s.name}: ${(s.errorCount || 0) + (s.totalPageErrors || 0)} errors`)
          ;(s.errors || []).slice(0, 3).forEach(e => console.log(`      ${e.substring(0, 100)}`))
        }
      }
    }

    console.log('='.repeat(60))

    writeFileSync(
      join(REPORT_DIR, 'chaos-monkey-report.json'),
      JSON.stringify(results, null, 2)
    )

    // Crashes are critical, errors are warnings
    const score = Math.max(0, 100 - results.totalCrashes * 30 - Math.min(30, results.totalErrors))

    return {
      name: 'Chaos Monkey',
      score,
      maxScore: 100,
      errors: results.totalCrashes > 0 ? [`${results.totalCrashes} screen(s) crashed during chaos`] : [],
      warnings: results.totalErrors > 0 ? [`${results.totalErrors} errors during ${results.totalActions.clicks + results.totalActions.scrolls + results.totalActions.types} random actions`] : [],
      stats: {
        screens: results.screens.length,
        crashes: results.totalCrashes,
        totalErrors: results.totalErrors,
        totalActions: results.totalActions.clicks + results.totalActions.scrolls + results.totalActions.types,
      }
    }
  } catch (err) {
    return {
      name: 'Chaos Monkey',
      score: 0,
      maxScore: 100,
      errors: [`Chaos audit failed: ${err.message}`],
      warnings: [],
      stats: {}
    }
  }
}

if (process.argv[1]?.includes('chaos-monkey')) {
  checkChaosMonkey().then(result => {
    process.exit(result.score >= 70 ? 0 : 1)
  })
}
