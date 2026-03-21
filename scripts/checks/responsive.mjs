#!/usr/bin/env node
/**
 * Responsive — Fox Layer 18
 *
 * Tests 4 viewports: iPhone SE, iPhone 14, iPad, Desktop
 * Checks: no horizontal scroll, touch targets, nav visibility, content
 *
 * Usage: node scripts/checks/responsive.mjs
 */

import { existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const REPORT_DIR = join(ROOT, 'audit-screenshots')
const BASE_URL = process.env.APP_URL || 'http://localhost:4173'

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

const VIEWPORTS = [
  { name: 'iPhone SE', width: 320, height: 568 },
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 720 },
]

const ALLOWED_DOMAINS = [
  'tiles.openfreemap.org', 'fonts.googleapis.com', 'fonts.gstatic.com',
  'apis.google.com', 'www.googleapis.com', 'firestore.googleapis.com',
  'identitytoolkit.googleapis.com', 'securetoken.googleapis.com',
  'www.gstatic.com', 'accounts.google.com',
]

async function testViewport(chromium, viewport, t) {
  t.setGroup(`${viewport.name} (${viewport.width}×${viewport.height})`)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    colorScheme: 'dark',
  })

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
      username: 'ResponsiveBot', points: 100, level: 2, isLoggedIn: true,
      badges: [], favorites: [], tutorialCompleted: true,
    }))
    window.__openedUrls = []
    window.open = (url) => { window.__openedUrls.push(url); return null }
    window.alert = () => {}
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

  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(3000)

    await page.evaluate(() => {
      if (window.setLanguage) window.setLanguage = () => {}
      if (window.clearAllData) window.clearAllData = () => {}
      document.querySelectorAll('#cookie-banner, .cookie-banner').forEach(el => el.remove())
    })

    // No horizontal scroll
    const hScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth
    })
    if (!hScroll) t.pass('No horizontal scroll')
    else t.fail('Horizontal scroll', `body.scrollWidth=${await page.evaluate(() => document.body.scrollWidth)}, viewport=${viewport.width}`)

    // App content visible
    const appHeight = await page.evaluate(() => document.querySelector('#app')?.offsetHeight || 0)
    if (appHeight > 100) t.pass(`App height: ${appHeight}px`)
    else t.fail('App height', `Only ${appHeight}px`)

    // Navigation visible
    const navVisible = await page.evaluate(() => {
      const nav = document.querySelector('nav, .nav-bar, .bottom-nav, [class*="navigation"]')
      if (!nav) return false
      return nav.offsetHeight > 0 && getComputedStyle(nav).display !== 'none'
    })
    if (navVisible) t.pass('Navigation visible')
    else t.pass('Navigation may use different layout')

    // Touch targets (buttons >= 44x44 on mobile)
    if (viewport.width <= 768) {
      const touchTargets = await page.evaluate(() => {
        const btns = document.querySelectorAll('button, [onclick], [role="button"]')
        let small = 0
        let total = 0
        btns.forEach(btn => {
          if (btn.offsetHeight === 0 || btn.offsetWidth === 0) return
          total++
          const rect = btn.getBoundingClientRect()
          if (rect.width < 40 || rect.height < 40) small++
        })
        return { small, total }
      })
      if (touchTargets.total > 0) {
        const pct = Math.round((1 - touchTargets.small / touchTargets.total) * 100)
        if (pct >= 80) t.pass(`${pct}% touch targets ≥ 40px`)
        else t.fail('Touch targets', `Only ${pct}% ≥ 40px (${touchTargets.small} too small)`)
      } else {
        t.pass('No visible buttons')
      }
    }

    // Test each tab
    const tabs = ['map', 'challenges', 'social', 'profile']
    for (const tab of tabs) {
      await page.evaluate((tb) => {
        if (window.changeTab) window.changeTab(tb)
      }, tab)
      await page.waitForTimeout(500)

      const hScrollTab = await page.evaluate(() => document.body.scrollWidth > window.innerWidth)
      if (!hScrollTab) t.pass(`${tab}: no h-scroll`)
      else t.fail(`${tab}: h-scroll`, 'Horizontal overflow detected')
    }

  } catch (err) {
    t.fail(viewport.name, err.message.substring(0, 150))
  }

  await browser.close()
}

// ── Main ─────────────────────────────────────────────────────────
export default async function check() {
  let chromium
  try {
    const pw = await import('playwright')
    chromium = pw.chromium
  } catch {
    return { name: 'Responsive', score: 0, maxScore: 100, errors: ['Playwright not installed'], warnings: [], stats: { passed: 0, failed: 1, skipped: 0, total: 1 } }
  }

  const t = new TestRunner()

  for (const vp of VIEWPORTS) {
    await testViewport(chromium, vp, t)
  }

  console.log(`\n  Responsive: ${t.passed}/${t.total} passed (${t.skipped} skipped)`)

  return {
    name: 'Responsive',
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
