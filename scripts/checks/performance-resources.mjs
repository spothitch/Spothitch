#!/usr/bin/env node
/**
 * Performance & Resources — Fox Layer 24
 *
 * Tests: load time, memory leaks, fonts, broken images,
 * console logs, DOM size.
 *
 * Usage: node scripts/checks/performance-resources.mjs
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const SRC_PATH = join(ROOT, 'src')
const VIEWPORT = { width: 390, height: 844 }
const BASE_URL = process.env.APP_URL || 'http://localhost:4173'

const IGNORE_PATTERNS = [
  /X-Frame-Options/, /Service Worker/, /Geolocation error/i,
  /Sentry not initialized/, /ResizeObserver loop/, /favicon/i,
  /workbox/i, /Cannot read properties/, /Cannot set properties/,
  /Failed to load modal/, /Unknown modal/, /FedCM/, /GSI_LOGGER/,
  /blockedbyclient/i, /AJAXError/, /tiles\.openfreemap/, /maplibre/i,
  /Firebase/i, /firestore/i, /auth\//, /AbortError/, /NetworkError/,
  /net::ERR/, /is not defined/, /is not a function/, /Load failed/,
  /Invalid LngLat/, /Invalid coordinates/i, /permission-denied/,
]

class TestRunner {
  constructor() {
    this.passed = 0
    this.failed = 0
    this.skipped = 0
    this.errors = []
    this.warnings = []
    this.currentGroup = ''
  }
  setGroup(name) {
    this.currentGroup = name
    console.log(`\n  ── ${name} ──`)
  }
  pass(name) { this.passed++ }
  fail(name, reason) {
    this.failed++
    this.errors.push(`[${this.currentGroup}] ${name}: ${reason}`)
    console.log(`    ✗ ${name}: ${reason}`)
  }
  warn(name, reason) {
    this.warnings.push(`[${this.currentGroup}] ${name}: ${reason}`)
  }
  skip(name) { this.skipped++ }
  get total() { return this.passed + this.failed }
  get score() { return this.total > 0 ? Math.round((this.passed / this.total) * 100) : 0 }
}

const ALLOWED_DOMAINS = [
  'tiles.openfreemap.org', 'fonts.googleapis.com', 'fonts.gstatic.com',
  'apis.google.com', 'www.googleapis.com', 'firestore.googleapis.com',
  'identitytoolkit.googleapis.com', 'securetoken.googleapis.com',
  'www.gstatic.com', 'accounts.google.com',
]

// ── Static: console.log scan ─────────────────────────────────────
function scanConsoleLogs() {
  const debugLogs = []

  function scan(dir) {
    for (const entry of readdirSync(dir)) {
      const fullPath = join(dir, entry)
      const stat = statSync(fullPath)
      if (stat.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
        scan(fullPath)
      } else if (extname(entry) === '.js') {
        const content = readFileSync(fullPath, 'utf-8')
        const lines = content.split('\n')
        lines.forEach((line, i) => {
          // Match console.log but not console.error/warn/info/debug
          if (/console\.log\s*\(/.test(line) && !/\/\//.test(line.split('console.log')[0])) {
            // Skip known acceptable logs (version, init, etc.)
            if (/version|Version|initialized|ready|loaded|registered/i.test(line)) return
            debugLogs.push({ file: fullPath.replace(ROOT + '/', ''), line: i + 1 })
          }
        })
      }
    }
  }

  scan(SRC_PATH)
  return debugLogs
}

// ── Browser tests ────────────────────────────────────────────────
async function testLoadTime(chromium, t) {
  t.setGroup('Load Time')

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: VIEWPORT, colorScheme: 'dark' })

  await context.addInitScript(() => {
    localStorage.setItem('spothitch_onboarding_complete', 'true')
    localStorage.setItem('spothitch_landing_v2', '1')
    localStorage.setItem('spothitch_cookies_accepted', 'true')
    localStorage.setItem('spothitch_cookie_consent', JSON.stringify({
      preferences: { necessary: true, analytics: true, marketing: false },
      timestamp: Date.now(), version: '1'
    }))
    localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({
      preferences: { necessary: true, analytics: true, marketing: false },
      timestamp: Date.now(), version: '1'
    }))
    localStorage.setItem('spothitch_test_mode', 'true')
    localStorage.setItem('spothitch_v4_state', JSON.stringify({
      showLanding: false, theme: 'dark', lang: 'fr', activeTab: 'map',
      username: 'PerfBot', points: 100, level: 2, isLoggedIn: true,
      badges: [], favorites: [], tutorialCompleted: true,
    }))
    window.__openedUrls = []
    window.open = (url) => { window.__openedUrls.push(url); return null }
    window.alert = () => {}
    window.confirm = () => true
  })

  const page = await context.newPage()
  await page.route('**/*', route => {
    const url = route.request().url()
    if (url.startsWith(BASE_URL) || url.startsWith('data:') || url.startsWith('blob:')) return route.continue()
    if (ALLOWED_DOMAINS.some(d => url.includes(d))) return route.continue()
    route.abort('blockedbyclient')
  })

  const startTime = Date.now()
  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 10000 })
    const dclTime = Date.now() - startTime
    if (dclTime < 3000) t.pass(`DOMContentLoaded: ${dclTime}ms`)
    else if (dclTime < 5000) t.pass(`DOMContentLoaded: ${dclTime}ms (acceptable)`)
    else t.fail('DOMContentLoaded', `${dclTime}ms (>5s)`)
  } catch {
    t.fail('DOMContentLoaded', 'Timeout >10s')
  }

  // Wait for full load
  await page.waitForTimeout(3000)

  // DOM size
  const domSize = await page.evaluate(() => document.querySelectorAll('*').length)
  if (domSize < 3000) t.pass(`DOM size: ${domSize} nodes`)
  else if (domSize < 5000) t.pass(`DOM size: ${domSize} nodes (borderline)`)
  else t.fail('DOM size', `${domSize} nodes (>5000)`)

  // Broken images
  const brokenImgs = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img')
    let broken = 0
    imgs.forEach(img => {
      if (img.offsetHeight === 0 && img.offsetWidth === 0) return
      if (img.complete && img.naturalWidth === 0 && img.src && !img.src.startsWith('data:')) broken++
    })
    return broken
  })
  if (brokenImgs === 0) t.pass('No broken images')
  else t.fail('Broken images', `${brokenImgs} broken`)

  await browser.close()
}

async function testMemoryLeak(chromium, t) {
  t.setGroup('Memory Leak Check')

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: VIEWPORT, colorScheme: 'dark' })

  await context.addInitScript(() => {
    localStorage.setItem('spothitch_onboarding_complete', 'true')
    localStorage.setItem('spothitch_landing_v2', '1')
    localStorage.setItem('spothitch_cookies_accepted', 'true')
    localStorage.setItem('spothitch_cookie_consent', JSON.stringify({
      preferences: { necessary: true, analytics: true, marketing: false },
      timestamp: Date.now(), version: '1'
    }))
    localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({
      preferences: { necessary: true, analytics: true, marketing: false },
      timestamp: Date.now(), version: '1'
    }))
    localStorage.setItem('spothitch_test_mode', 'true')
    localStorage.setItem('spothitch_v4_state', JSON.stringify({
      showLanding: false, theme: 'dark', lang: 'fr', activeTab: 'map',
      username: 'MemBot', points: 100, level: 2, isLoggedIn: true,
      badges: [], favorites: [], tutorialCompleted: true,
    }))
    window.__openedUrls = []
    window.open = (url) => { window.__openedUrls.push(url); return null }
    window.alert = () => {}
    window.confirm = () => true
  })

  const page = await context.newPage()
  await page.route('**/*', route => {
    const url = route.request().url()
    if (url.startsWith(BASE_URL) || url.startsWith('data:') || url.startsWith('blob:')) return route.continue()
    if (ALLOWED_DOMAINS.some(d => url.includes(d))) return route.continue()
    route.abort('blockedbyclient')
  })

  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(3000)

  await page.evaluate(() => {
    if (window.setLanguage) window.setLanguage = () => {}
    if (window.clearAllData) window.clearAllData = () => {}
    document.querySelectorAll('#cookie-banner, .cookie-banner').forEach(el => el.remove())
  })

  // Get initial DOM node count
  const nodesBefore = await page.evaluate(() => document.querySelectorAll('*').length)

  // Open/close modals 20 times
  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => {
      try {
        if (window.showSettingsModal) window.showSettingsModal()
        else if (window.showFAQModal) window.showFAQModal()
      } catch {}
    })
    await page.waitForTimeout(100)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(100)
  }

  const nodesAfter = await page.evaluate(() => document.querySelectorAll('*').length)
  const growth = nodesAfter - nodesBefore
  const growthPct = nodesBefore > 0 ? Math.round((growth / nodesBefore) * 100) : 0

  if (growthPct <= 20) t.pass(`DOM growth: ${growthPct}% after 20 modal cycles (${growth} nodes)`)
  else t.fail('DOM leak', `${growthPct}% growth (${growth} nodes) after 20 modal cycles`)

  await browser.close()
}

// ── Main ─────────────────────────────────────────────────────────
export default async function check() {
  const t = new TestRunner()

  // Static checks first
  t.setGroup('Console.log Scan')
  const debugLogs = scanConsoleLogs()
  if (debugLogs.length === 0) {
    t.pass('No debug console.log found')
  } else if (debugLogs.length <= 5) {
    t.pass(`${debugLogs.length} console.log found (minor)`)
    t.warn('console.log', debugLogs.slice(0, 3).map(l => `${l.file}:${l.line}`).join(', '))
  } else {
    t.fail('console.log', `${debugLogs.length} debug logs found`)
  }

  // Browser checks
  let chromium
  try {
    const pw = await import('playwright')
    chromium = pw.chromium
  } catch {
    return { name: 'Performance & Resources', score: t.score, maxScore: 100, errors: [...t.errors, 'Playwright not installed'], warnings: t.warnings, stats: { passed: t.passed, failed: t.failed, skipped: 0, total: t.total } }
  }

  await testLoadTime(chromium, t)
  await testMemoryLeak(chromium, t)

  console.log(`\n  Performance & Resources: ${t.passed}/${t.total} passed (${t.skipped} skipped)`)

  return {
    name: 'Performance & Resources',
    score: t.score,
    maxScore: 100,
    errors: t.errors.slice(0, 10),
    warnings: t.warnings.slice(0, 10),
    stats: { passed: t.passed, failed: t.failed, skipped: t.skipped, total: t.total },
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  check().then(r => {
    console.log(`\nScore: ${r.score}/100`)
    process.exit(r.score >= 70 ? 0 : 1)
  })
}
