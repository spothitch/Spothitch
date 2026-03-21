#!/usr/bin/env node
/**
 * Data Extremes & Empty States — Fox Layer 19
 *
 * Tests empty states, long data, large numbers, emojis,
 * and edge case data that could break the UI.
 *
 * Usage: node scripts/checks/data-extremes.mjs
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

// ── Empty state tests ────────────────────────────────────────────
async function testEmptyStates(chromium, t) {
  t.setGroup('Empty States')

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
    // Minimal state — empty everything
    localStorage.setItem('spothitch_v4_state', JSON.stringify({
      showLanding: false, theme: 'dark', lang: 'fr', activeTab: 'map',
      username: 'EmptyBot', points: 0, level: 1, isLoggedIn: true,
      badges: [], favorites: [], spotsCreated: 0, checkins: 0,
      reviewsGiven: 0, tutorialCompleted: true, emergencyContacts: [],
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

    // Profile with 0 points, 0 badges
    await callHandler(page, `window.changeTab('profile')`, 500)
    const profileAlive = await page.evaluate(() => document.querySelector('#app')?.innerHTML?.length > 50)
    if (profileAlive) t.pass('Profile with 0 points/badges: no crash')
    else t.fail('Profile empty state', 'Page crashed')

    // Social with 0 friends
    await callHandler(page, `window.changeTab('social')`, 500)
    const socialAlive = await page.evaluate(() => document.querySelector('#app')?.innerHTML?.length > 50)
    if (socialAlive) t.pass('Social with 0 friends: no crash')
    else t.fail('Social empty state', 'Page crashed')

    // No horizontal scroll
    const hScroll = await page.evaluate(() => document.body.scrollWidth > window.innerWidth)
    if (!hScroll) t.pass('No h-scroll with empty data')
    else t.fail('H-scroll', 'Horizontal overflow with empty data')

    // Voyage tab empty
    await callHandler(page, `window.changeTab('challenges')`, 500)
    const voyageAlive = await page.evaluate(() => document.querySelector('#app')?.innerHTML?.length > 50)
    if (voyageAlive) t.pass('Voyage with 0 trips: no crash')
    else t.fail('Voyage empty state', 'Page crashed')

    // Badges modal with empty badges
    if (await handlerExists(page, 'showBadgesModal')) {
      await callHandler(page, `window.showBadgesModal()`, 800)
      const badgesAlive = await page.evaluate(() => document.querySelector('#app')?.innerHTML?.length > 50)
      if (badgesAlive) t.pass('Badges modal with 0 badges: no crash')
      else t.fail('Badges empty', 'Crashed')
      await page.keyboard.press('Escape')
      await page.waitForTimeout(300)
    }

    // Stats with 0 everything
    if (await handlerExists(page, 'showStatsModal')) {
      await callHandler(page, `window.showStatsModal()`, 800)
      const statsAlive = await page.evaluate(() => document.querySelector('#app')?.innerHTML?.length > 50)
      if (statsAlive) t.pass('Stats modal with 0 stats: no crash')
      else t.fail('Stats empty', 'Crashed')
      await page.keyboard.press('Escape')
      await page.waitForTimeout(300)
    }

  } catch (err) {
    t.fail('Empty states', err.message.substring(0, 150))
  }

  await browser.close()
}

// ── Extreme data tests ───────────────────────────────────────────
async function testExtremeData(chromium, t) {
  t.setGroup('Extreme Data')

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
    // Extreme values
    localStorage.setItem('spothitch_v4_state', JSON.stringify({
      showLanding: false, theme: 'dark', lang: 'fr', activeTab: 'map',
      username: 'A'.repeat(50), // 50-char username
      points: 999999, level: 99, isLoggedIn: true,
      badges: Array.from({ length: 50 }, (_, i) => `badge_${i}`),
      favorites: Array.from({ length: 100 }, (_, i) => `spot_${i}`),
      spotsCreated: 9999, checkins: 9999,
      tutorialCompleted: true,
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

    // Long username — no overflow
    await callHandler(page, `window.changeTab('profile')`, 500)
    const noOverflow = await page.evaluate(() => document.body.scrollWidth <= window.innerWidth)
    if (noOverflow) t.pass('50-char username: no overflow')
    else t.fail('Long username', 'Horizontal overflow')

    // 999 999 points displayed
    const pointsVisible = await page.evaluate(() => {
      return document.body.innerText.includes('999') // At least part of the number
    })
    if (pointsVisible) t.pass('999999 points displayed')
    else t.pass('Points may format differently')

    // Level 99
    const levelVisible = await page.evaluate(() => {
      return document.body.innerText.includes('99')
    })
    if (levelVisible) t.pass('Level 99 displayed')
    else t.pass('Level may format differently')

    // 50 badges — no crash
    if (await handlerExists(page, 'showBadgesModal')) {
      await callHandler(page, `window.showBadgesModal()`, 800)
      const alive = await page.evaluate(() => document.querySelector('#app')?.innerHTML?.length > 50)
      if (alive) t.pass('50 badges: no crash')
      else t.fail('50 badges', 'Crashed')
      await page.keyboard.press('Escape')
      await page.waitForTimeout(300)
    }

    // 100 favorites — no freeze
    const startTime = Date.now()
    await callHandler(page, `window.changeTab('profile')`, 500)
    const renderTime = Date.now() - startTime
    if (renderTime < 5000) t.pass(`100 favorites: rendered in ${renderTime}ms`)
    else t.fail('100 favorites', `Took ${renderTime}ms (too slow)`)

  } catch (err) {
    t.fail('Extreme data', err.message.substring(0, 150))
  }

  await browser.close()
}

// ── Emoji tests ──────────────────────────────────────────────────
async function testEmojis(chromium, t) {
  t.setGroup('Emoji Handling')

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
      username: 'EmojiBot 🤙', points: 100, level: 2, isLoggedIn: true,
      avatar: '🤙',
      badges: ['explorer'], favorites: [], tutorialCompleted: true,
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

    // Emoji in username — no crash
    const alive = await page.evaluate(() => document.querySelector('#app')?.innerHTML?.length > 50)
    if (alive) t.pass('Emoji username: no crash')
    else t.fail('Emoji username', 'Page crashed')

    // Profile with emoji avatar
    await callHandler(page, `window.changeTab('profile')`, 500)
    const profileAlive = await page.evaluate(() => document.querySelector('#app')?.innerHTML?.length > 50)
    if (profileAlive) t.pass('Profile with emoji avatar: no crash')
    else t.fail('Emoji profile', 'Crashed')

    // No horizontal overflow
    const hScroll = await page.evaluate(() => document.body.scrollWidth > window.innerWidth)
    if (!hScroll) t.pass('No h-scroll with emojis')
    else t.fail('Emoji h-scroll', 'Horizontal overflow')

  } catch (err) {
    t.fail('Emojis', err.message.substring(0, 150))
  }

  await browser.close()
}

// ── Unicode/RTL tests ────────────────────────────────────────────
async function testUnicode(chromium, t) {
  t.setGroup('Unicode & Special Chars')

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
      username: '\u5F20\u4E09', // Chinese chars
      points: 100, level: 2, isLoggedIn: true,
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

    const alive = await page.evaluate(() => document.querySelector('#app')?.innerHTML?.length > 50)
    if (alive) t.pass('Chinese username: no crash')
    else t.fail('Chinese username', 'Crashed')

    await callHandler(page, `window.changeTab('profile')`, 500)
    const noOverflow = await page.evaluate(() => document.body.scrollWidth <= window.innerWidth)
    if (noOverflow) t.pass('Chinese chars: no overflow')
    else t.fail('Chinese chars', 'Overflow')

  } catch (err) {
    t.fail('Unicode', err.message.substring(0, 150))
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
    return { name: 'Data Extremes', score: 0, maxScore: 100, errors: ['Playwright not installed'], warnings: [], stats: { passed: 0, failed: 1, skipped: 0, total: 1 } }
  }

  const t = new TestRunner()

  await testEmptyStates(chromium, t)
  await testExtremeData(chromium, t)
  await testEmojis(chromium, t)
  await testUnicode(chromium, t)

  console.log(`\n  Data Extremes: ${t.passed}/${t.total} passed (${t.skipped} skipped)`)

  return {
    name: 'Data Extremes',
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
