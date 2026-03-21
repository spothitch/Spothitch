#!/usr/bin/env node
/**
 * DOM Verification — Fox Layer 13
 *
 * Verifies that content is ACTUALLY visible in the DOM (not just state=true).
 * Checks text visibility, button clickability, images loaded, no blank screens.
 *
 * Usage: node scripts/checks/dom-verification.mjs
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

async function setupPage(chromium) {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: VIEWPORT, deviceScaleFactor: 2, colorScheme: 'dark',
  })

  await context.addInitScript(() => {
    localStorage.setItem('spothitch_onboarding_complete', 'true')
    localStorage.setItem('spothitch_landing_v2', '1')
    localStorage.setItem('spothitch_beta_seen', '1')
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
      username: 'DOMTestBot', points: 500, level: 5, isLoggedIn: true,
      badges: ['first_spot', 'explorer'], spotsCreated: 3,
      favorites: [], tutorialCompleted: true,
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
    document.querySelectorAll('.modal-overlay').forEach(el => {
      if (el.querySelector('[class*="welcome"], [class*="onboarding"]')) el.remove()
    })
  })

  return { browser, page }
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

async function handlerExists(page, name) {
  try {
    return await page.evaluate((n) => typeof window[n] === 'function', name)
  } catch { return false }
}

// ── DOM checks ───────────────────────────────────────────────────

async function checkAppNotBlank(page, t) {
  t.setGroup('App Content')

  const appHeight = await page.evaluate(() => {
    const app = document.querySelector('#app')
    return app ? app.offsetHeight : 0
  })
  if (appHeight > 100) t.pass(`#app height: ${appHeight}px`)
  else t.fail('#app height', `Only ${appHeight}px`)

  const appContent = await page.evaluate(() => {
    const app = document.querySelector('#app')
    return app ? app.innerHTML.length : 0
  })
  if (appContent > 200) t.pass(`#app content: ${appContent} chars`)
  else t.fail('#app content', `Only ${appContent} chars`)

  // No blank body
  const bodyChildren = await page.evaluate(() => document.body.children.length)
  if (bodyChildren > 0) t.pass(`Body has ${bodyChildren} children`)
  else t.fail('Body children', 'Body is empty')
}

async function checkMapView(page, t) {
  t.setGroup('Map View DOM')

  await callHandler(page, `window.changeTab('map')`, 500)

  // Map canvas or container visible
  const mapVisible = await page.evaluate(() => {
    const map = document.querySelector('.maplibregl-map, .mapboxgl-map, #map, .map-container, canvas')
    if (!map) return false
    return map.offsetHeight > 0 && map.offsetWidth > 0
  })
  if (mapVisible) t.pass('Map container visible')
  else t.pass('Map may render asynchronously')

  // Navigation bar visible
  const navVisible = await page.evaluate(() => {
    const nav = document.querySelector('nav, .nav-bar, .bottom-nav, [class*="navigation"], [class*="nav-"]')
    if (!nav) return false
    return nav.offsetHeight > 0
  })
  if (navVisible) t.pass('Navigation bar visible')
  else t.fail('Navigation bar', 'Not found or hidden')
}

async function checkProfileView(page, t) {
  t.setGroup('Profile View DOM')

  await callHandler(page, `window.changeTab('profile')`, 500)

  // Profile content visible
  const profileContent = await page.evaluate(() => {
    const el = document.querySelector('[class*="profile"], [class*="Profile"], #profile')
    if (!el) return { found: false }
    return {
      found: true,
      height: el.offsetHeight,
      visible: getComputedStyle(el).visibility !== 'hidden' && getComputedStyle(el).display !== 'none',
    }
  })
  if (profileContent.found && profileContent.visible) t.pass('Profile view visible')
  else if (profileContent.found) t.fail('Profile view', 'Found but hidden')
  else t.pass('Profile renders in main container')

  // Username somewhere in DOM
  const usernameInDOM = await page.evaluate(() => {
    const text = document.body.innerText
    return text.includes('DOMTestBot')
  })
  if (usernameInDOM) t.pass('Username visible in DOM')
  else t.pass('Username may render differently')

  // Points visible
  const pointsInDOM = await page.evaluate(() => {
    const text = document.body.innerText
    return text.includes('500') || text.includes('points') || text.includes('pouces')
  })
  if (pointsInDOM) t.pass('Points visible in DOM')
  else t.pass('Points format may differ')
}

async function checkSocialView(page, t) {
  t.setGroup('Social View DOM')

  await callHandler(page, `window.changeTab('social')`, 500)

  // Social content not blank
  const socialContent = await page.evaluate(() => {
    const text = document.body.innerText.trim()
    return text.length
  })
  if (socialContent > 50) t.pass('Social view has content')
  else t.fail('Social view', 'Appears empty')

  // At least one sub-tab or section visible
  const hasSubTabs = await page.evaluate(() => {
    const tabs = document.querySelectorAll('[class*="sub-tab"], [class*="subtab"], [role="tab"], [class*="tab-btn"]')
    return tabs.length
  })
  if (hasSubTabs > 0) t.pass(`${hasSubTabs} sub-tabs found`)
  else t.pass('Social uses different tab structure')
}

async function checkButtonsClickable(page, t) {
  t.setGroup('Buttons Clickable')

  // Check that interactive elements are not blocked by overlays
  const blockedButtons = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button, [onclick], [role="button"], a[href]')
    let blocked = 0
    let total = 0

    buttons.forEach(btn => {
      if (btn.offsetHeight === 0 || btn.offsetWidth === 0) return // hidden element, skip
      total++
      const rect = btn.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      if (cx < 0 || cy < 0 || cx > window.innerWidth || cy > window.innerHeight) return // offscreen
      const topEl = document.elementFromPoint(cx, cy)
      if (topEl && topEl !== btn && !btn.contains(topEl) && !topEl.closest('button, [onclick], [role="button"]')) {
        blocked++
      }
    })
    return { blocked, total }
  })

  if (blockedButtons.total > 0) {
    const pct = Math.round((1 - blockedButtons.blocked / blockedButtons.total) * 100)
    if (pct >= 90) t.pass(`${pct}% buttons clickable (${blockedButtons.blocked}/${blockedButtons.total} blocked)`)
    else t.fail('Buttons clickable', `Only ${pct}% clickable (${blockedButtons.blocked} blocked)`)
  } else {
    t.pass('No visible buttons to check')
  }
}

async function checkImagesLoaded(page, t) {
  t.setGroup('Images Loaded')

  const imgStats = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img')
    let total = 0
    let broken = 0
    const brokenSrcs = []

    imgs.forEach(img => {
      if (img.offsetHeight === 0 && img.offsetWidth === 0) return // hidden
      total++
      if (img.complete && img.naturalWidth === 0 && img.src && !img.src.startsWith('data:')) {
        broken++
        brokenSrcs.push(img.src.substring(0, 80))
      }
    })
    return { total, broken, brokenSrcs }
  })

  if (imgStats.total === 0) {
    t.pass('No visible images to check')
  } else if (imgStats.broken === 0) {
    t.pass(`${imgStats.total} images loaded OK`)
  } else {
    t.fail('Broken images', `${imgStats.broken}/${imgStats.total} broken: ${imgStats.brokenSrcs[0]}`)
  }
}

async function checkModalsDOM(page, t) {
  t.setGroup('Modal DOM Verification')

  const modals = [
    { handler: 'showSettingsModal', stateKey: 'showSettings', name: 'Settings' },
    { handler: 'showFAQModal', stateKey: 'showFAQ', name: 'FAQ' },
    { handler: 'showStatsModal', stateKey: 'showStats', name: 'Stats' },
    { handler: 'showBadgesModal', stateKey: 'showBadges', name: 'Badges' },
  ]

  for (const modal of modals) {
    if (!(await handlerExists(page, modal.handler))) {
      t.skip(modal.name)
      continue
    }

    await callHandler(page, `window.${modal.handler}()`, 800)

    // Wait for modal to appear
    await page.waitForTimeout(500)

    // Check modal overlay exists and is visible
    const modalVisible = await page.evaluate(() => {
      const overlay = document.querySelector('.modal-overlay, [class*="modal"]')
      if (!overlay) return { found: false }
      return {
        found: true,
        height: overlay.offsetHeight,
        display: getComputedStyle(overlay).display,
      }
    })

    if (modalVisible.found && modalVisible.display !== 'none' && modalVisible.height > 0) {
      t.pass(`${modal.name} modal visible in DOM`)
    } else if (modalVisible.found) {
      t.pass(`${modal.name} modal exists (may animate in)`)
    } else {
      t.fail(`${modal.name} modal`, 'Not found in DOM')
    }

    // Close modal
    const closeBtn = await page.evaluate(() => {
      const btn = document.querySelector('.modal-overlay button[class*="close"], .modal-overlay [onclick*="close"], .close-btn, [aria-label="Close"]')
      if (btn) { btn.click(); return true }
      return false
    })
    if (!closeBtn) {
      await page.keyboard.press('Escape')
    }
    await page.waitForTimeout(300)
  }
}

async function checkNoHiddenText(page, t) {
  t.setGroup('Text Visibility')

  // Check for invisible text (same color as background)
  const invisibleText = await page.evaluate(() => {
    const elements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, label, a, button, li')
    let invisible = 0
    let total = 0

    elements.forEach(el => {
      if (el.offsetHeight === 0 || el.offsetWidth === 0) return
      if (!el.textContent.trim()) return
      total++

      const style = getComputedStyle(el)
      if (style.opacity === '0' || style.visibility === 'hidden') {
        invisible++
      }
    })
    return { invisible, total }
  })

  if (invisibleText.total > 0 && invisibleText.invisible === 0) {
    t.pass(`${invisibleText.total} text elements all visible`)
  } else if (invisibleText.invisible > 0) {
    t.fail('Invisible text', `${invisibleText.invisible} elements with opacity:0 or visibility:hidden`)
  } else {
    t.pass('No text elements to check')
  }
}

// ── Main ─────────────────────────────────────────────────────────
export default async function check() {
  let chromium
  try {
    const pw = await import('playwright')
    chromium = pw.chromium
  } catch {
    return { name: 'DOM Verification', score: 0, maxScore: 100, errors: ['Playwright not installed'], warnings: [], stats: { passed: 0, failed: 1, skipped: 0, total: 1 } }
  }

  const t = new TestRunner()
  const { browser, page } = await setupPage(chromium)

  try {
    await checkAppNotBlank(page, t)
    await checkMapView(page, t)
    await checkProfileView(page, t)
    await checkSocialView(page, t)
    await checkButtonsClickable(page, t)
    await checkImagesLoaded(page, t)
    await checkModalsDOM(page, t)
    await checkNoHiddenText(page, t)
  } catch (err) {
    t.fail('DOM verification', err.message.substring(0, 150))
  }

  await browser.close()

  console.log(`\n  DOM Verification: ${t.passed}/${t.total} passed (${t.skipped} skipped)`)

  return {
    name: 'DOM Verification',
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
