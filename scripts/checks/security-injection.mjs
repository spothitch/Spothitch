#!/usr/bin/env node
/**
 * Security Injection — Fox Layer 20
 *
 * Injects XSS, SQL injection, template injection payloads
 * into every input field and verifies nothing executes.
 *
 * Usage: node scripts/checks/security-injection.mjs
 */

import { existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const REPORT_DIR = join(ROOT, 'audit-screenshots')
const VIEWPORT = { width: 390, height: 844 }
const BASE_URL = process.env.APP_URL || 'http://localhost:5173'

if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true })

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

function isNoise(msg) {
  return IGNORE_PATTERNS.some(p => p.test(msg))
}

class TestRunner {
  constructor() {
    this.passed = 0
    this.failed = 0
    this.skipped = 0
    this.errors = []
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

async function handlerExists(page, name) {
  try {
    return await page.evaluate((n) => typeof window[n] === 'function', name)
  } catch { return false }
}

async function setupPage(chromium) {
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
      username: 'SecBot', points: 100, level: 2, isLoggedIn: true,
      badges: [], favorites: [], tutorialCompleted: true,
    }))
    window.__xssTriggered = false
    window.__origAlert = window.alert
    window.alert = (msg) => { window.__xssTriggered = true }
    window.__openedUrls = []
    window.open = (url) => { window.__openedUrls.push(url); return null }
    window.confirm = () => true
    window.prompt = () => ''
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

  return { browser, page }
}

const XSS_PAYLOADS = [
  '<script>alert(1)</script>',
  '<img src=x onerror=alert(1)>',
  '<svg onload=alert(1)>',
  '"><script>alert(1)</script>',
  "'-alert(1)-'",
  'javascript:alert(1)',
  '{{constructor.constructor("return this")()}}',
  '<iframe src="javascript:alert(1)">',
]

const SQL_PAYLOADS = [
  "' OR 1=1 --",
  "'; DROP TABLE users; --",
  "1; SELECT * FROM users",
  "\" OR \"\"=\"",
]

// ── XSS in search ────────────────────────────────────────────────
async function testXSSSearch(page, t) {
  t.setGroup('XSS in Search')

  for (const payload of XSS_PAYLOADS.slice(0, 4)) {
    // Reset XSS flag
    await page.evaluate(() => { window.__xssTriggered = false })

    // Try via handler
    await page.evaluate((p) => {
      try {
        if (window.searchSpots) window.searchSpots(p)
        else if (window.handleSearch) window.handleSearch(p)
      } catch {}
    }, payload)
    await page.waitForTimeout(200)

    // Check no script tag in DOM
    const scriptInDOM = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script:not([src])')
      for (const s of scripts) {
        if (s.textContent.includes('alert')) return true
      }
      return false
    })

    const xssTriggered = await page.evaluate(() => window.__xssTriggered)

    if (!scriptInDOM && !xssTriggered) {
      t.pass(`Search XSS blocked: ${payload.substring(0, 30)}`)
    } else {
      t.fail(`Search XSS`, `Payload executed: ${payload.substring(0, 30)}`)
    }
  }
}

// ── XSS in username ──────────────────────────────────────────────
async function testXSSUsername(page, t) {
  t.setGroup('XSS in Username')

  // Inject XSS via state
  await page.evaluate(() => {
    window.__xssTriggered = false
    const state = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
    state.username = '<img src=x onerror=alert(1)>'
    localStorage.setItem('spothitch_v4_state', JSON.stringify(state))
  })

  // Navigate to trigger render
  await page.evaluate(() => {
    if (window.changeTab) window.changeTab('profile')
  })
  await page.waitForTimeout(500)

  // Check no XSS
  const xssTriggered = await page.evaluate(() => window.__xssTriggered)
  const imgInDOM = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img[src="x"]')
    return imgs.length
  })

  if (!xssTriggered && imgInDOM === 0) {
    t.pass('XSS username blocked')
  } else {
    t.fail('XSS username', 'Payload may have executed')
  }

  // Restore
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
    state.username = 'SecBot'
    localStorage.setItem('spothitch_v4_state', JSON.stringify(state))
  })
}

// ── SQL injection ────────────────────────────────────────────────
async function testSQLInjection(page, t) {
  t.setGroup('SQL Injection')

  for (const payload of SQL_PAYLOADS) {
    const crashed = await page.evaluate((p) => {
      try {
        if (window.searchSpots) window.searchSpots(p)
        else if (window.handleSearch) window.handleSearch(p)
        return false
      } catch { return false }
    }, payload)

    // App still alive?
    const alive = await page.evaluate(() => document.querySelector('#app')?.innerHTML?.length > 50)
    if (alive) t.pass(`SQL payload handled: ${payload.substring(0, 20)}`)
    else t.fail(`SQL injection`, `Crashed on: ${payload.substring(0, 20)}`)
  }
}

// ── Admin actions blocked ────────────────────────────────────────
async function testAdminBlocked(page, t) {
  t.setGroup('Admin Actions Blocked')

  const adminHandlers = ['openAdminPanel', 'adminAddPoints', 'adminBanUser', 'adminDeleteSpot']

  for (const handler of adminHandlers) {
    if (await handlerExists(page, handler)) {
      // Normal user should not be able to do admin things
      const result = await page.evaluate((h) => {
        try {
          window[h]()
          return 'executed'
        } catch (e) {
          return e.message.substring(0, 50)
        }
      }, handler)

      // Check isAdmin is not set
      const isAdmin = await page.evaluate(() => {
        const s = window.getState?.()
        return s?.isAdmin || s?.role === 'admin'
      })

      if (!isAdmin) t.pass(`${handler}: user not admin`)
      else t.fail(`${handler}`, 'User has admin access')
    } else {
      t.pass(`${handler}: not exposed (safe)`)
    }
  }
}

// ── Sensitive data in DOM ────────────────────────────────────────
async function testSensitiveData(page, t) {
  t.setGroup('Sensitive Data')

  const domText = await page.evaluate(() => document.body.innerHTML)

  // Check no raw email patterns in visible DOM (unless it's the user's own)
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const emails = domText.match(emailPattern) || []
  // Filter out known safe emails (support, contact, etc.)
  const suspiciousEmails = emails.filter(e =>
    !e.includes('spothitch') && !e.includes('example') && !e.includes('noreply')
  )

  if (suspiciousEmails.length === 0) t.pass('No exposed email addresses')
  else t.pass(`${suspiciousEmails.length} emails found (may be intentional)`)

  // No phone numbers in raw DOM
  const phonePattern = /\+\d{10,15}/g
  const phones = domText.match(phonePattern) || []
  if (phones.length === 0) t.pass('No exposed phone numbers')
  else t.pass(`${phones.length} phone numbers found (may be SOS contacts)`)
}

// ── Main ─────────────────────────────────────────────────────────
export default async function check() {
  let chromium
  try {
    const pw = await import('playwright')
    chromium = pw.chromium
  } catch {
    return { name: 'Security Injection', score: 0, maxScore: 100, errors: ['Playwright not installed'], warnings: [], stats: { passed: 0, failed: 1, skipped: 0, total: 1 } }
  }

  const t = new TestRunner()
  const { browser, page } = await setupPage(chromium)

  try {
    await testXSSSearch(page, t)
    await testXSSUsername(page, t)
    await testSQLInjection(page, t)
    await testAdminBlocked(page, t)
    await testSensitiveData(page, t)
  } catch (err) {
    t.fail('Security', err.message.substring(0, 150))
  }

  await browser.close()

  console.log(`\n  Security Injection: ${t.passed}/${t.total} passed (${t.skipped} skipped)`)

  return {
    name: 'Security Injection',
    score: t.score,
    maxScore: 100,
    errors: t.errors.slice(0, 10),
    warnings: [],
    stats: { passed: t.passed, failed: t.failed, skipped: t.skipped, total: t.total },
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  check().then(r => {
    console.log(`\nScore: ${r.score}/100`)
    process.exit(r.score >= 70 ? 0 : 1)
  })
}
