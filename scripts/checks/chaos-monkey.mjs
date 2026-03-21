#!/usr/bin/env node
/**
 * Chaos Monkey Check (Playwright-based)
 *
 * Randomly clicks, scrolls, types, and interacts with the app
 * using individual Playwright actions (resilient to page navigations).
 * Catches:
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
const BASE_URL = process.env.APP_URL || 'http://localhost:3000'

if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true })

// Duration per screen in seconds
const DURATION_ARG = process.argv.find(a => a.startsWith('--duration='))
const DURATION = DURATION_ARG ? parseInt(DURATION_ARG.split('=')[1]) : 10

const CHAOS_TEXTS = ['', '   ', '<script>alert(1)</script>', 'a'.repeat(500),
  '-99999', '0', 'null', 'undefined', 'DROP TABLE users', '../../../etc/passwd',
  '\n\r\t', '日本語テスト']

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Neutralize all navigation-triggering functions */
async function blockNavigation(page) {
  try {
    await page.evaluate(() => {
      window.open = () => null
      window.alert = () => {}
      window.confirm = () => true
      window.prompt = () => ''
      if (window.setLanguage) window.setLanguage = () => {}
      if (window.changeLanguageHandler) window.changeLanguageHandler = () => {}
      if (window.clearAllData) window.clearAllData = () => {}
      if (window._forceRender) window._forceRender = () => {}
      // Remove reload buttons
      document.querySelectorAll('[onclick*="reload"]').forEach(el => {
        el.removeAttribute('onclick')
        el.onclick = () => {}
      })
      // Remove external links
      document.querySelectorAll('a[href^="http"], a[href^="//"], a[href^="mailto:"], a[href^="tel:"]').forEach(a => {
        a.removeAttribute('href')
      })
    })
  } catch {}
}

/** Perform one random action on the page via individual evaluate calls */
async function doRandomAction(page) {
  const action = randomInt(0, 3)

  switch (action) {
    case 0: // Random click
    case 1: {
      const x = randomInt(10, VIEWPORT.width - 10)
      const y = randomInt(10, VIEWPORT.height - 10)
      const result = await page.evaluate(({ x, y }) => {
        const el = document.elementFromPoint(x, y)
        if (!el) return 'miss'
        // Skip external links
        const link = el.closest?.('a[href]')
        if (link) {
          const href = link.getAttribute('href') || ''
          if (href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return 'skip-link'
          }
        }
        el.click()
        return 'click'
      }, { x, y })
      return result === 'click' ? 'click' : null
    }
    case 2: { // Random scroll
      await page.evaluate((delta) => {
        window.scrollBy(0, delta)
        const scrollable = document.querySelector('[role="dialog"], [style*="overflow"]')
        if (scrollable) scrollable.scrollTop += delta
      }, randomInt(-500, 500))
      return 'scroll'
    }
    case 3: { // Random type in any input
      const typed = await page.evaluate((text) => {
        const inputs = document.querySelectorAll('input, textarea')
        if (inputs.length === 0) return false
        const input = inputs[Math.floor(Math.random() * inputs.length)]
        try {
          input.focus()
          input.value = text
          input.dispatchEvent(new Event('input', { bubbles: true }))
          input.dispatchEvent(new Event('change', { bubbles: true }))
          return true
        } catch { return false }
      }, CHAOS_TEXTS[randomInt(0, CHAOS_TEXTS.length - 1)])
      return typed ? 'type' : null
    }
  }
  return null
}

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

  // Block external navigation
  await page.route('**/*', (route) => {
    const url = route.request().url()
    if (url.startsWith(BASE_URL) || url.startsWith('data:') || url.startsWith('blob:')) {
      route.continue()
    } else {
      route.abort('blockedbyclient')
    }
  })

  // Capture page errors (filter expected noise)
  const PAGE_ERROR_IGNORE = [
    /Failed to fetch/i, /Style is not done loading/i, /Sentry/i,
    /blockedbyclient/i, /ResizeObserver/i, /maplibre/i, /AJAXError/i,
    /ServiceWorker/i, /Geolocation/i, /Firestore/i, /firebase/i, /Could not reach/i,
  ]
  const pageErrors = []
  page.on('pageerror', err => {
    if (!PAGE_ERROR_IGNORE.some(p => p.test(err.message))) {
      pageErrors.push(err.message)
    }
  })

  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(3000)
    await blockNavigation(page)

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

      try {
        if (screen.setup) {
          await page.evaluate(screen.setup)
          await page.waitForTimeout(1500)
        }

        await blockNavigation(page)
        pageErrors.length = 0

        // Get initial DOM count
        const startNodes = await page.evaluate(() => document.querySelectorAll('*').length).catch(() => 0)

        // Start error capture in browser (filter out expected noise)
        await page.evaluate(() => {
          window.__chaosErrors = []
          const origError = console.error
          window.__chaosOrigError = origError
          const IGNORE = [
            /Failed to fetch/i,
            /Style is not done loading/i,
            /Sentry not initialized/i,
            /blockedbyclient/i,
            /ResizeObserver loop/i,
            /City search failed/i,
            /Geolocation error/i,
            /ServiceWorker/i,
            /maplibre/i,
            /AJAXError/i,
            /Firestore/i,
            /firebase/i,
            /Could not reach/i,
          ]
          console.error = (...args) => {
            const msg = args.map(a => String(a)).join(' ').substring(0, 200)
            if (!IGNORE.some(p => p.test(msg))) {
              window.__chaosErrors.push(msg)
            }
            origError.apply(console, args)
          }
        }).catch(() => {})

        // Perform individual actions for DURATION seconds
        const actions = { clicks: 0, scrolls: 0, types: 0 }
        const endTime = Date.now() + DURATION * 1000
        let contextLost = false

        while (Date.now() < endTime) {
          try {
            const result = await doRandomAction(page)
            if (result === 'click') actions.clicks++
            else if (result === 'scroll') actions.scrolls++
            else if (result === 'type') actions.types++
          } catch (err) {
            if (err.message?.includes('Execution context was destroyed') || err.message?.includes('navigation')) {
              // Page navigated — wait for it to settle and re-block navigation
              contextLost = true
              await page.waitForTimeout(2000)
              try {
                await blockNavigation(page)
                contextLost = false // Recovered
              } catch {
                // Still navigating, try goto
                try {
                  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 10000 })
                  await page.waitForTimeout(1500)
                  await blockNavigation(page)
                  contextLost = false
                } catch { break }
              }
            }
            // Other errors: just skip this action
          }
          // ~10 actions per second (each action has network overhead)
          await page.waitForTimeout(50)
        }

        // Collect results
        let errorCount = 0
        let errors = []
        let endNodes = startNodes
        let appAlive = true
        try {
          const browserData = await page.evaluate(() => {
            // Restore console.error
            if (window.__chaosOrigError) console.error = window.__chaosOrigError
            return {
              errors: (window.__chaosErrors || []).slice(0, 20),
              errorCount: (window.__chaosErrors || []).length,
              endNodes: document.querySelectorAll('*').length,
              appAlive: !!document.querySelector('#app, [id="app"]'),
            }
          })
          errorCount = browserData.errorCount
          errors = browserData.errors
          endNodes = browserData.endNodes
          appAlive = browserData.appAlive
        } catch {}

        const domGrowth = endNodes - startNodes
        const totalPageErrors = pageErrors.length

        const screenResult = {
          name: screen.name,
          actions,
          errors,
          errorCount,
          domGrowth,
          startNodes,
          endNodes,
          appAlive,
          crashed: !appAlive,
          contextLost,
          pageErrors: [...pageErrors],
          totalPageErrors,
        }

        results.screens.push(screenResult)
        results.totalErrors += errorCount + totalPageErrors
        results.totalActions.clicks += actions.clicks
        results.totalActions.scrolls += actions.scrolls
        results.totalActions.types += actions.types

        if (!appAlive) {
          results.totalCrashes++
          console.log(`    CRASHED! App not responsive`)
        }

        console.log(`    ${actions.clicks} clicks, ${actions.scrolls} scrolls, ${actions.types} types`)
        console.log(`    Errors: ${errorCount + totalPageErrors} | DOM growth: ${domGrowth > 0 ? '+' : ''}${domGrowth} nodes`)
        if (contextLost) console.log(`    [WARN] Context was lost and recovered during chaos`)

        if (domGrowth > 500) {
          console.log(`    [WARN] DOM grew by ${domGrowth} nodes — possible memory leak`)
        }

        // Take screenshot after chaos
        await page.screenshot({
          path: join(REPORT_DIR, `chaos-${screen.name}.png`),
          fullPage: false,
          timeout: 5000,
        }).catch(() => {})

        // Clean up modal if needed
        if (screen.name === 'spotdetail') {
          await page.evaluate(() => {
            if (window.setState) window.setState({ selectedSpot: null })
            document.querySelectorAll('.modal-overlay, [role="dialog"]').forEach(m => m.remove())
          }).catch(() => {})
          await page.waitForTimeout(500)
        }

        // Verify app is still alive, recover if needed
        const alive = await page.evaluate(() => !!document.querySelector('#app, [id="app"]')).catch(() => false)
        if (!alive) {
          console.log(`    [CRITICAL] App destroyed after chaos — recovering`)
          await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {})
          await page.waitForTimeout(2000)
          await blockNavigation(page)
        }
      } catch (err) {
        console.log(`    [ERROR] Chaos session failed: ${err.message.substring(0, 100)}`)
        results.screens.push({ name: screen.name, crashed: true, error: err.message, actions: { clicks: 0, scrolls: 0, types: 0 }, errorCount: 0 })

        // Try to recover
        try {
          await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 10000 })
          await page.waitForTimeout(2000)
          await blockNavigation(page)
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

    // Honest scoring: 0 actions = 0 score (nothing was tested)
    const totalActions = results.totalActions.clicks + results.totalActions.scrolls + results.totalActions.types
    const minActions = results.screens.length * 20 // Expect at least 20 actions per screen
    let score
    if (totalActions === 0) {
      score = 0 // Nothing tested
    } else if (totalActions < minActions) {
      score = Math.max(10, Math.round((totalActions / minActions) * 50)) // Partial testing
    } else {
      score = Math.max(0, 100 - results.totalCrashes * 30 - Math.min(30, results.totalErrors))
    }

    const errors = []
    if (totalActions === 0) errors.push('Chaos monkey performed 0 actions (context lost on all screens)')
    if (results.totalCrashes > 0) errors.push(`${results.totalCrashes} screen(s) crashed during chaos`)

    return {
      name: 'Chaos Monkey',
      score,
      maxScore: 100,
      errors,
      warnings: results.totalErrors > 0 ? [`${results.totalErrors} errors during ${totalActions} random actions`] : [],
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
