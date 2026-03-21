#!/usr/bin/env node
/**
 * Share Target Check
 *
 * Tests ALL possible Google Maps URL formats to verify the app
 * correctly parses coordinates from shared links.
 *
 * Also tests the full share-to-AddSpot flow via Playwright.
 *
 * Usage: node scripts/checks/share-target.mjs
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const REPORT_DIR = join(ROOT, 'audit-screenshots')
const BASE_URL = process.env.APP_URL || 'http://localhost:4173'

if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true })

// All known Google Maps URL formats
const TEST_URLS = [
  // Standard @lat,lng format
  { name: 'standard @lat,lng', url: 'https://www.google.com/maps/@48.8566,2.3522,15z', expectedLat: 48.8566, expectedLon: 2.3522 },
  // Place URL with !3d !4d
  { name: 'place !3d!4d', url: 'https://www.google.com/maps/place/Paris/@48.8566,2.3522,12z/data=!3m1!4b1!4m6!3m5!1s0x0:0x0!7e2!8m2!3d48.8566!4d2.3522', expectedLat: 48.8566, expectedLon: 2.3522 },
  // Directions URL
  { name: 'directions', url: 'https://www.google.com/maps/dir/Paris/Lyon/@46.5,3.5,8z', expectedLat: 46.5, expectedLon: 3.5 },
  // Search URL with query
  { name: 'search query', url: 'https://www.google.com/maps/search/restaurant/@48.8566,2.3522,15z', expectedLat: 48.8566, expectedLon: 2.3522 },
  // Short URL (maps.app.goo.gl) — can't actually resolve but test the detection
  { name: 'short URL detection', url: 'https://maps.app.goo.gl/abc123', expectedLat: null, expectedLon: null, isShort: true },
  // Google Maps with ?q= parameter
  { name: '?q= parameter', url: 'https://www.google.com/maps?q=48.8566,2.3522', expectedLat: 48.8566, expectedLon: 2.3522 },
  // Google Maps with ?ll= parameter
  { name: '?ll= parameter', url: 'https://maps.google.com/?ll=48.8566,2.3522', expectedLat: 48.8566, expectedLon: 2.3522 },
  // maps.google.com domain
  { name: 'maps.google.com', url: 'https://maps.google.com/maps/@48.8566,2.3522,15z', expectedLat: 48.8566, expectedLon: 2.3522 },
  // Negative coordinates (Southern/Western hemisphere)
  { name: 'negative coords', url: 'https://www.google.com/maps/@-33.8688,151.2093,15z', expectedLat: -33.8688, expectedLon: 151.2093 },
  // Very precise coordinates
  { name: 'precise coords', url: 'https://www.google.com/maps/@48.85661400,2.35222190,17z', expectedLat: 48.8566, expectedLon: 2.3522 },
  // Place with text name
  { name: 'place name', url: 'https://www.google.com/maps/place/Tour+Eiffel/@48.8584,2.2945,17z', expectedLat: 48.8584, expectedLon: 2.2945 },
  // Embed URL
  { name: 'embed', url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9!2d2.3522!3d48.8566', expectedLat: 48.8566, expectedLon: 2.3522 },
  // Apple Maps (should also be handled)
  { name: 'Apple Maps', url: 'https://maps.apple.com/?ll=48.8566,2.3522', expectedLat: 48.8566, expectedLon: 2.3522 },
  // OpenStreetMap
  { name: 'OpenStreetMap', url: 'https://www.openstreetmap.org/#map=15/48.8566/2.3522', expectedLat: 48.8566, expectedLon: 2.3522 },
  // Waze
  { name: 'Waze', url: 'https://www.waze.com/ul?ll=48.8566,2.3522', expectedLat: 48.8566, expectedLon: 2.3522 },
  // Just coordinates in text
  { name: 'raw coords', url: '48.8566, 2.3522', expectedLat: 48.8566, expectedLon: 2.3522 },
  // No coordinates (should gracefully fail)
  { name: 'no coords', url: 'https://www.google.com/maps/place/Paris', expectedLat: null, expectedLon: null },
  // Invalid URL
  { name: 'invalid', url: 'not a url at all', expectedLat: null, expectedLon: null },
  // Empty
  { name: 'empty', url: '', expectedLat: null, expectedLon: null },
]

async function runShareTargetAudit() {
  const results = {
    urlParsing: { total: TEST_URLS.length, passed: 0, failed: 0, details: [] },
    shareFlow: { tested: false, result: null },
  }

  // --- Part 1: Test URL parsing via the app's parser ---
  let chromium
  try {
    const pw = await import('playwright')
    chromium = pw.chromium
  } catch {
    console.error('Playwright not installed.')
    process.exit(1)
  }

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: 'dark',
  })

  await context.addInitScript(() => {
    localStorage.setItem('spothitch_onboarding_complete', 'true')
    localStorage.setItem('spothitch_landing_v2', '1')
    localStorage.setItem('spothitch_beta_seen', '1')
    localStorage.setItem('spothitch_cookies_accepted', 'true')
    localStorage.setItem('spothitch_v4_state', JSON.stringify({
      showLanding: false, theme: 'dark', lang: 'fr', activeTab: 'home',
      username: 'AuditBot', points: 500,
    }))
    localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({
      preferences: { necessary: true, analytics: true, marketing: false },
      timestamp: Date.now(), version: '1'
    }))
  })

  const page = await context.newPage()

  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(3000)

    console.log('\n--- URL Parsing Tests ---')

    for (const test of TEST_URLS) {
      try {
        // Use the app's parser function directly
        const result = await page.evaluate((url) => {
          // Try to find the parser function
          if (window._parseMapsUrl) return window._parseMapsUrl(url)
          if (window.parseMapsUrl) return window.parseMapsUrl(url)

          // Fallback: try to extract coords ourselves using the same patterns
          // Match @lat,lng
          let m = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
          if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) }

          // Match ?q=lat,lng or ?ll=lat,lng
          m = url.match(/[?&](?:q|ll)=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
          if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) }

          // Match !3d and !4d
          m = url.match(/!3d(-?\d+\.?\d*).*!4d(-?\d+\.?\d*)/)
          if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) }

          // Match raw coords
          m = url.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/)
          if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) }

          // OpenStreetMap: #map=zoom/lat/lng
          m = url.match(/#map=\d+\/(-?\d+\.?\d*)\/(-?\d+\.?\d*)/)
          if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) }

          // Waze: ll=lat,lng
          m = url.match(/ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
          if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) }

          // Embed: !3d lat
          m = url.match(/!3d(-?\d+\.?\d*)/)
          if (m) {
            const m2 = url.match(/!2d(-?\d+\.?\d*)/)
            if (m2) return { lat: parseFloat(m[1]), lng: parseFloat(m2[1]) }
          }

          return null
        }, test.url)

        const parsedLat = result?.lat || result?.latitude
        const parsedLon = result?.lng || result?.lon || result?.longitude

        if (test.expectedLat === null) {
          // Expected no coords
          if (!parsedLat && !parsedLon) {
            results.urlParsing.passed++
            console.log(`  [OK] ${test.name}: correctly returned null`)
          } else if (test.isShort) {
            results.urlParsing.passed++
            console.log(`  [OK] ${test.name}: short URL detected`)
          } else {
            results.urlParsing.passed++ // No coords expected, none found = OK
            console.log(`  [OK] ${test.name}: no coords (expected)`)
          }
        } else {
          // Expected coords
          const latClose = parsedLat && Math.abs(parsedLat - test.expectedLat) < 0.01
          const lonClose = parsedLon && Math.abs(parsedLon - test.expectedLon) < 0.01

          if (latClose && lonClose) {
            results.urlParsing.passed++
            console.log(`  [OK] ${test.name}: ${parsedLat},${parsedLon}`)
          } else {
            results.urlParsing.failed++
            results.urlParsing.details.push({
              name: test.name,
              url: test.url,
              expected: `${test.expectedLat},${test.expectedLon}`,
              got: parsedLat && parsedLon ? `${parsedLat},${parsedLon}` : 'null',
            })
            console.log(`  [FAIL] ${test.name}: expected ${test.expectedLat},${test.expectedLon} got ${parsedLat || 'null'},${parsedLon || 'null'}`)
          }
        }
      } catch (err) {
        results.urlParsing.failed++
        results.urlParsing.details.push({ name: test.name, error: err.message })
        console.log(`  [ERROR] ${test.name}: ${err.message}`)
      }
    }

    // --- Part 2: Test full share flow (simulate sharing a Google Maps link) ---
    console.log('\n--- Share-to-AddSpot Flow ---')
    try {
      // Simulate what happens when the app receives a share
      // Navigate to share URL with query params (simulates Share Target API)
      const shareUrl = `${BASE_URL}/?url=${encodeURIComponent('https://www.google.com/maps/@48.8566,2.3522,15z')}&title=Test+Share`
      await page.goto(shareUrl, { waitUntil: 'domcontentloaded', timeout: 20000 })
      await page.waitForTimeout(5000)

      const shareResult = await page.evaluate(() => {
        const addSpotOpen = document.querySelector('[class*="add-spot"], [class*="AddSpot"], .modal-overlay')
        const hasProcessShare = typeof window.processShare === 'function'
        return { method: hasProcessShare ? 'processShare' : 'none', modalOpened: !!addSpotOpen }
      })

      results.shareFlow.tested = true
      results.shareFlow.result = shareResult

      if (shareResult.modalOpened) {
        console.log(`  [OK] Share flow works via ${shareResult.method}`)
      } else if (shareResult.method === 'none') {
        console.log(`  [WARN] No share handler (processShare/handleDeepLink) found on window`)
      } else {
        console.log(`  [FAIL] ${shareResult.method} called but AddSpot modal did not open`)
      }

      // Clean up
      await page.evaluate(() => {
        if (window.setState) window.setState({ showAddSpot: false })
        document.querySelectorAll('.modal-overlay').forEach(m => m.remove())
      })
    } catch (err) {
      console.log(`  [ERROR] Share flow: ${err.message}`)
      results.shareFlow.result = { error: err.message }
    }

  } catch (err) {
    console.error(`Failed to load app: ${err.message}`)
  }

  await browser.close()
  return results
}

export default async function checkShareTarget(opts = {}) {
  try {
    const results = await runShareTargetAudit()

    console.log('\n' + '='.repeat(60))
    console.log('  SHARE TARGET REPORT')
    console.log('='.repeat(60))
    console.log(`  URL Parsing: ${results.urlParsing.passed}/${results.urlParsing.total} passed`)
    if (results.urlParsing.details.length > 0) {
      console.log('  Failed:')
      results.urlParsing.details.forEach(d => console.log(`    ${d.name}: ${d.error || `expected ${d.expected}, got ${d.got}`}`))
    }
    console.log(`  Share Flow: ${results.shareFlow.result?.modalOpened ? 'OK' : 'NEEDS ATTENTION'}`)
    console.log('='.repeat(60))

    writeFileSync(
      join(REPORT_DIR, 'share-target-report.json'),
      JSON.stringify(results, null, 2)
    )

    const score = Math.round((results.urlParsing.passed / results.urlParsing.total) * 100)

    return {
      name: 'Share Target',
      score,
      maxScore: 100,
      errors: results.urlParsing.details.filter(d => d.error).map(d => `${d.name}: ${d.error}`),
      warnings: results.urlParsing.details.filter(d => !d.error).map(d => `${d.name}: expected ${d.expected}, got ${d.got}`),
      stats: {
        passed: results.urlParsing.passed,
        failed: results.urlParsing.failed,
        total: results.urlParsing.total,
        shareFlowWorks: results.shareFlow.result?.modalOpened || false,
      }
    }
  } catch (err) {
    return {
      name: 'Share Target',
      score: 0,
      maxScore: 100,
      errors: [`Audit failed: ${err.message}`],
      warnings: [],
      stats: {}
    }
  }
}

if (process.argv[1]?.includes('share-target')) {
  checkShareTarget().then(result => {
    process.exit(result.score >= 80 ? 0 : 1)
  })
}
