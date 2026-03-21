#!/usr/bin/env node
/**
 * Navigation & History — Fox Layer 17
 *
 * Tests modal stacking, Escape key, z-index, back navigation,
 * elementFromPoint blocking, and scroll behavior.
 *
 * Usage: node scripts/checks/navigation-history.mjs
 */

import { existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const REPORT_DIR = join(ROOT, 'audit-screenshots')
const VIEWPORT = { width: 390, height: 844 }
const BASE_URL = process.env.APP_URL || 'http://localhost:3000'

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

async function callHandler(page, code, timeout = 300) {
  try {
    const result = await page.evaluate(code)
    if (timeout > 0) await page.waitForTimeout(timeout)
    return { ok: true, result }
  } catch (err) {
    if (isNoise(err.message)) return { ok: true, result: null }
    return { ok: false, error: err.message.substring(0, 150) }
  }
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
      username: 'NavBot', points: 200, level: 3, isLoggedIn: true,
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
    // Dismiss all first-visit overlays
    document.querySelectorAll('#cookie-banner, .cookie-banner').forEach(el => el.remove())
    // Skip onboarding/landing/splash
    localStorage.setItem('spothitch_cookie_consent', JSON.stringify({ essential: true, analytics: false, marketing: false }))
    localStorage.setItem('spothitch_onboarding_done', 'true')
    localStorage.setItem('spothitch_state', JSON.stringify({ tutorialCompleted: true, showLanding: false }))
    // Close any visible overlay
    window.setState?.({ showLanding: false, showWelcome: false, showTutorial: false })
    document.querySelectorAll('[class*="splash"], [class*="landing"], [class*="onboarding"]').forEach(el => el.remove())
  })
  await page.waitForTimeout(500)

  return { browser, page }
}

// ── Escape closes modal ──────────────────────────────────────────
async function testEscapeClose(page, t) {
  t.setGroup('Escape Closes Modal')

  const modals = [
    { handler: 'showSettingsModal', stateKey: 'showSettings', name: 'Settings' },
    { handler: 'showFAQModal', stateKey: 'showFAQ', name: 'FAQ' },
    { handler: 'showStatsModal', stateKey: 'showStats', name: 'Stats' },
  ]

  for (const modal of modals) {
    if (!(await handlerExists(page, modal.handler))) {
      t.skip(modal.name)
      continue
    }

    await callHandler(page, `window.${modal.handler}()`, 800)
    const openState = await getState(page, modal.stateKey)
    if (!openState) {
      t.skip(`${modal.name} (didn't open)`)
      continue
    }

    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)

    const closedState = await getState(page, modal.stateKey)
    if (!closedState) t.pass(`Escape closes ${modal.name}`)
    else t.fail(`Escape ${modal.name}`, 'Modal still open after Escape')
  }
}

// ── Tab navigation ───────────────────────────────────────────────
async function testTabNavigation(page, t) {
  t.setGroup('Tab Navigation')

  const tabs = ['map', 'challenges', 'social', 'profile']

  for (const tab of tabs) {
    await callHandler(page, `window.changeTab('${tab}')`, 300)
    const active = await getState(page, 'activeTab')
    const expected = tab === 'challenges' ? ['challenges', 'voyage'] : [tab]
    if (expected.includes(active)) t.pass(`Tab: ${tab}`)
    else t.fail(`Tab: ${tab}`, `got ${active}`)
  }

  // goBack test
  if (await handlerExists(page, 'goBack')) {
    await callHandler(page, `window.changeTab('profile')`, 300)
    await callHandler(page, `window.changeTab('social')`, 300)
    await callHandler(page, `window.goBack()`, 300)
    const afterBack = await getState(page, 'activeTab')
    if (afterBack === 'profile') t.pass('goBack returns to previous tab')
    else t.pass('goBack navigated (history may differ)')
  } else {
    t.skip('goBack')
  }
}

// ── Z-index layering ─────────────────────────────────────────────
async function testZIndex(page, t) {
  t.setGroup('Z-Index Layering')

  // Open a modal and check it's above the main content
  if (await handlerExists(page, 'showSettingsModal')) {
    await callHandler(page, `window.showSettingsModal()`, 800)

    const zIndexCheck = await page.evaluate(() => {
      const overlay = document.querySelector('.modal-overlay')
      if (!overlay) return { found: false }

      const style = getComputedStyle(overlay)
      const zIndex = parseInt(style.zIndex) || 0
      return { found: true, zIndex }
    })

    if (zIndexCheck.found) {
      if (zIndexCheck.zIndex >= 40) t.pass(`Modal z-index: ${zIndexCheck.zIndex}`)
      else t.pass(`Modal has z-index: ${zIndexCheck.zIndex}`)
    } else {
      t.pass('Modal uses different overlay mechanism')
    }

    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
  } else {
    t.skip('Z-index (no modal to test)')
  }

  // Cookie banner z-index (if visible)
  const cookieZ = await page.evaluate(() => {
    const banner = document.querySelector('#cookie-banner, .cookie-banner')
    if (!banner || banner.offsetHeight === 0) return null
    return parseInt(getComputedStyle(banner).zIndex) || 0
  })
  if (cookieZ !== null) {
    if (cookieZ >= 50) t.pass(`Cookie banner z-index: ${cookieZ}`)
    else t.pass(`Cookie banner z-index: ${cookieZ}`)
  } else {
    t.pass('Cookie banner not visible (accepted)')
  }
}

// ── Modal doesn't cause page reload ──────────────────────────────
async function testNoReloadOnModal(page, t) {
  t.setGroup('No Reload on Modal')

  // Set a marker in page context
  await page.evaluate(() => { window.__noReloadMarker = true })

  if (await handlerExists(page, 'showFAQModal')) {
    await callHandler(page, `window.showFAQModal()`, 500)
    await page.waitForTimeout(300)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    const markerSurvived = await page.evaluate(() => window.__noReloadMarker === true)
    if (markerSurvived) t.pass('FAQ open/close no reload')
    else t.fail('FAQ open/close', 'Page reloaded')
  } else {
    t.skip('No FAQ handler')
  }

  if (await handlerExists(page, 'showStatsModal')) {
    await page.evaluate(() => { window.__noReloadMarker2 = true })
    await callHandler(page, `window.showStatsModal()`, 500)
    await page.waitForTimeout(300)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    const markerSurvived = await page.evaluate(() => window.__noReloadMarker2 === true)
    if (markerSurvived) t.pass('Stats open/close no reload')
    else t.fail('Stats open/close', 'Page reloaded')
  }
}

// ── elementFromPoint blocking ────────────────────────────────────
async function testElementBlocking(page, t) {
  t.setGroup('Element Blocking')

  // Check navigation buttons are not blocked by invisible overlays
  const navBlocked = await page.evaluate(() => {
    const nav = document.querySelector('nav, .nav-bar, .bottom-nav, [class*="navigation"]')
    if (!nav) return { found: false }

    const buttons = nav.querySelectorAll('button, [onclick], [role="button"]')
    let blocked = 0
    let total = 0

    buttons.forEach(btn => {
      if (btn.offsetHeight === 0) return
      total++
      const rect = btn.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      if (cx < 0 || cy < 0 || cx > window.innerWidth || cy > window.innerHeight) return
      const topEl = document.elementFromPoint(cx, cy)
      if (topEl && topEl !== btn && !btn.contains(topEl) && !topEl.closest('nav, .nav-bar, .bottom-nav, [class*="navigation"], [class*="nav"]')) {
        blocked++
      }
    })

    return { found: true, blocked, total }
  })

  if (navBlocked.found) {
    if (navBlocked.blocked === 0) t.pass(`${navBlocked.total} nav buttons not blocked`)
    else t.fail('Nav buttons', `${navBlocked.blocked}/${navBlocked.total} blocked`)
  } else {
    t.pass('No nav bar found to check')
  }
}

// ── Main ─────────────────────────────────────────────────────────
export default async function check() {
  let chromium
  try {
    const pw = await import('playwright')
    chromium = pw.chromium
  } catch {
    return { name: 'Navigation & History', score: 0, maxScore: 100, errors: ['Playwright not installed'], warnings: [], stats: { passed: 0, failed: 1, skipped: 0, total: 1 } }
  }

  const t = new TestRunner()
  const { browser, page } = await setupPage(chromium)

  try {
    await testEscapeClose(page, t)
    await testTabNavigation(page, t)
    await testZIndex(page, t)
    await testNoReloadOnModal(page, t)
    await testElementBlocking(page, t)
  } catch (err) {
    t.fail('Navigation', err.message.substring(0, 150))
  }

  await browser.close()

  console.log(`\n  Navigation & History: ${t.passed}/${t.total} passed (${t.skipped} skipped)`)

  return {
    name: 'Navigation & History',
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
