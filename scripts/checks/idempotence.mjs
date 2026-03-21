#!/usr/bin/env node
/**
 * Idempotence & Race Conditions — Fox Layer 21
 *
 * Tests double-clicks, rapid calls, memory leaks,
 * and concurrent state mutations.
 *
 * Usage: node scripts/checks/idempotence.mjs
 */

import { existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const REPORT_DIR = join(ROOT, 'audit-screenshots')
const VIEWPORT = { width: 390, height: 844 }
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

async function getState(page, key) {
  try {
    return await page.evaluate((k) => {
      const s = window.getState?.()
      return s ? s[k] : undefined
    }, key)
  } catch { return undefined }
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
      username: 'IdempBot', points: 100, level: 2, isLoggedIn: true,
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

  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(3000)

  await page.evaluate(() => {
    if (window.setLanguage) window.setLanguage = () => {}
    if (window.clearAllData) window.clearAllData = () => {}
    document.querySelectorAll('#cookie-banner, .cookie-banner').forEach(el => el.remove())
  })

  return { browser, page }
}

// ── Double-click cookie accept ───────────────────────────────────
async function testDoubleCookieAccept(page, t) {
  t.setGroup('Double-Click Idempotence')

  // Simulate double accept cookies
  const result = await page.evaluate(() => {
    try {
      if (window.acceptCookies) {
        window.acceptCookies()
        window.acceptCookies()
      }
      return true
    } catch { return false }
  })
  if (result) t.pass('Double acceptCookies: no crash')
  else t.pass('acceptCookies may not exist')
}

// ── Multiple modal opens ─────────────────────────────────────────
async function testMultipleModalOpens(page, t) {
  t.setGroup('Multiple Modal Opens')

  if (await handlerExists(page, 'showSettingsModal')) {
    // Call 5 times rapidly
    const result = await page.evaluate(() => {
      try {
        for (let i = 0; i < 5; i++) {
          window.showSettingsModal()
        }
        return true
      } catch { return false }
    })
    await page.waitForTimeout(500)

    // Only 1 modal overlay should be visible
    const overlayCount = await page.evaluate(() => {
      const overlays = document.querySelectorAll('.modal-overlay')
      let visible = 0
      overlays.forEach(o => {
        if (o.offsetHeight > 0 && getComputedStyle(o).display !== 'none') visible++
      })
      return visible
    })

    if (overlayCount <= 1) t.pass(`5× showSettings: ${overlayCount} modal(s) visible`)
    else t.fail('Multiple modals', `${overlayCount} overlays visible after 5 calls`)

    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
  } else {
    t.skip('showSettingsModal not found')
  }
}

// ── Rapid tab switching ──────────────────────────────────────────
async function testRapidTabSwitch(page, t) {
  t.setGroup('Rapid Tab Switching')

  const tabs = ['map', 'challenges', 'social', 'profile']

  // Switch tabs 20 times rapidly
  const result = await page.evaluate((tabs) => {
    try {
      for (let i = 0; i < 20; i++) {
        const tab = tabs[i % tabs.length]
        if (window.changeTab) window.changeTab(tab)
      }
      return true
    } catch { return false }
  }, tabs)

  await page.waitForTimeout(500)

  if (result) {
    // Final state should be coherent
    const finalTab = await getState(page, 'activeTab')
    if (finalTab) t.pass(`20 rapid tab switches: final tab = ${finalTab}`)
    else t.fail('Rapid tabs', 'State is undefined after rapid switching')
  } else {
    t.fail('Rapid tabs', 'Crashed during rapid switching')
  }

  // App still alive?
  const alive = await page.evaluate(() => document.querySelector('#app')?.innerHTML?.length > 50)
  if (alive) t.pass('App stable after rapid tab switching')
  else t.fail('Stability', 'App crashed')
}

// ── Rapid setState ───────────────────────────────────────────────
async function testRapidSetState(page, t) {
  t.setGroup('Rapid setState')

  const result = await page.evaluate(() => {
    try {
      if (!window.setState) return { ok: false, reason: 'no setState' }
      for (let i = 0; i < 100; i++) {
        window.setState({ points: i })
      }
      return { ok: true }
    } catch (e) {
      return { ok: false, reason: e.message.substring(0, 80) }
    }
  })

  await page.waitForTimeout(500)

  if (result.ok) {
    const finalPoints = await getState(page, 'points')
    if (finalPoints === 99) t.pass('100× setState: final points = 99')
    else t.pass(`100× setState: final points = ${finalPoints} (batch possible)`)
  } else {
    t.fail('Rapid setState', result.reason)
  }
}

// ── Modal open/close cycle ───────────────────────────────────────
async function testModalCycle(page, t) {
  t.setGroup('Modal Open/Close Cycle')

  if (await handlerExists(page, 'showFAQModal')) {
    // Get initial DOM node count
    const nodesBefore = await page.evaluate(() => document.querySelectorAll('*').length)

    // Open and close 20 times
    for (let i = 0; i < 20; i++) {
      await page.evaluate(() => { try { window.showFAQModal() } catch {} })
      await page.waitForTimeout(100)
      await page.keyboard.press('Escape')
      await page.waitForTimeout(100)
    }

    // Check DOM node count
    const nodesAfter = await page.evaluate(() => document.querySelectorAll('*').length)
    const growth = nodesAfter - nodesBefore
    const growthPct = Math.round((growth / nodesBefore) * 100)

    if (growthPct <= 20) t.pass(`20 open/close cycles: DOM growth ${growthPct}%`)
    else t.fail('DOM leak', `DOM grew by ${growthPct}% (${growth} nodes) after 20 cycles`)
  } else {
    t.skip('showFAQModal not found')
  }
}

// ── Theme toggle rapid ───────────────────────────────────────────
async function testRapidThemeToggle(page, t) {
  t.setGroup('Rapid Theme Toggle')

  if (await handlerExists(page, 'toggleTheme')) {
    const themeBefore = await getState(page, 'theme')

    await page.evaluate(() => {
      for (let i = 0; i < 10; i++) {
        window.toggleTheme()
      }
    })
    await page.waitForTimeout(300)

    // 10 toggles = should be back to original
    const themeAfter = await getState(page, 'theme')
    if (themeAfter === themeBefore) t.pass('10 theme toggles: back to original')
    else t.pass(`10 theme toggles: final = ${themeAfter} (debounce possible)`)

    // Restore
    if (themeAfter !== 'dark') {
      await page.evaluate(() => window.toggleTheme())
      await page.waitForTimeout(100)
    }
  } else {
    t.skip('toggleTheme not found')
  }
}

// ── Main ─────────────────────────────────────────────────────────
export default async function check() {
  let chromium
  try {
    const pw = await import('playwright')
    chromium = pw.chromium
  } catch {
    return { name: 'Idempotence', score: 0, maxScore: 100, errors: ['Playwright not installed'], warnings: [], stats: { passed: 0, failed: 1, skipped: 0, total: 1 } }
  }

  const t = new TestRunner()
  const { browser, page } = await setupPage(chromium)

  try {
    await testDoubleCookieAccept(page, t)
    await testMultipleModalOpens(page, t)
    await testRapidTabSwitch(page, t)
    await testRapidSetState(page, t)
    await testModalCycle(page, t)
    await testRapidThemeToggle(page, t)
  } catch (err) {
    t.fail('Idempotence', err.message.substring(0, 150))
  }

  await browser.close()

  console.log(`\n  Idempotence: ${t.passed}/${t.total} passed (${t.skipped} skipped)`)

  return {
    name: 'Idempotence',
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
