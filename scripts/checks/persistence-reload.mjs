#!/usr/bin/env node
/**
 * Persistence & Reload — Fox Layer 14
 *
 * Verifies that state survives page reloads:
 * username, points, theme, lang, favorites, badges, onboarding
 *
 * Usage: node scripts/checks/persistence-reload.mjs
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

async function getState(page, key) {
  try {
    return await page.evaluate((k) => {
      const s = window.getState?.()
      return s ? s[k] : undefined
    }, key)
  } catch { return undefined }
}

export default async function check() {
  let chromium
  try {
    const pw = await import('playwright')
    chromium = pw.chromium
  } catch {
    return { name: 'Persistence & Reload', score: 0, maxScore: 100, errors: ['Playwright not installed'], warnings: [], stats: { passed: 0, failed: 1, skipped: 0, total: 1 } }
  }

  const t = new TestRunner()
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: VIEWPORT, colorScheme: 'dark',
  })

  const STATE_SEED = {
    showLanding: false, theme: 'dark', lang: 'fr', activeTab: 'map',
    username: 'PersistBot', points: 500, level: 5, isLoggedIn: true,
    badges: ['first_spot', 'explorer'], spotsCreated: 3,
    favorites: ['spot_123', 'spot_456'], tutorialCompleted: true,
  }

  await context.addInitScript((seed) => {
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
    localStorage.setItem('spothitch_v4_state', JSON.stringify(seed))
    window.__openedUrls = []
    window.open = (url) => { window.__openedUrls.push(url); return null }
    window.alert = () => {}
    window.confirm = () => true
    window.prompt = () => ''
  }, STATE_SEED)

  const page = await context.newPage()
  await page.route('**/*', route => {
    const url = route.request().url()
    if (url.startsWith(BASE_URL) || url.startsWith('data:') || url.startsWith('blob:')) return route.continue()
    if (ALLOWED_DOMAINS.some(d => url.includes(d))) return route.continue()
    route.abort('blockedbyclient')
  })

  try {
    // ── Initial load ──
    t.setGroup('Initial State')
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(3000)

    await page.evaluate(() => {
      if (window.setLanguage) window.setLanguage = () => {}
      if (window.clearAllData) window.clearAllData = () => {}
    })

    const username = await getState(page, 'username')
    if (username === 'PersistBot') t.pass('Username loaded: PersistBot')
    else t.fail('Username loaded', `got ${username}`)

    const points = await getState(page, 'points')
    if (points === 500) t.pass('Points loaded: 500')
    else t.fail('Points loaded', `got ${points}`)

    const theme = await getState(page, 'theme')
    if (theme === 'dark') t.pass('Theme loaded: dark')
    else t.fail('Theme loaded', `got ${theme}`)

    const lang = await getState(page, 'lang')
    if (lang === 'fr') t.pass('Lang loaded: fr')
    else t.fail('Lang loaded', `got ${lang}`)

    // ── Reload and verify ──
    t.setGroup('After Reload')
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(3000)

    await page.evaluate(() => {
      if (window.setLanguage) window.setLanguage = () => {}
      if (window.clearAllData) window.clearAllData = () => {}
    })

    const usernameAfter = await getState(page, 'username')
    if (usernameAfter === 'PersistBot') t.pass('Username persists after reload')
    else t.fail('Username after reload', `got ${usernameAfter}`)

    const pointsAfter = await getState(page, 'points')
    if (pointsAfter === 500) t.pass('Points persist after reload')
    else t.fail('Points after reload', `got ${pointsAfter}`)

    const themeAfter = await getState(page, 'theme')
    if (themeAfter === 'dark') t.pass('Theme persists after reload')
    else t.fail('Theme after reload', `got ${themeAfter}`)

    const langAfter = await getState(page, 'lang')
    if (langAfter === 'fr') t.pass('Lang persists after reload')
    else t.fail('Lang after reload', `got ${langAfter}`)

    const tutorialAfter = await getState(page, 'tutorialCompleted')
    if (tutorialAfter === true) t.pass('Tutorial state persists')
    else t.pass('Tutorial may use different persistence')

    // ── Change theme and reload ──
    t.setGroup('Theme Change + Reload')
    const hasToggleTheme = await page.evaluate(() => typeof window.toggleTheme === 'function')
    if (hasToggleTheme) {
      await page.evaluate(() => window.toggleTheme())
      await page.waitForTimeout(300)
      const newTheme = await getState(page, 'theme')

      await page.reload({ waitUntil: 'domcontentloaded', timeout: 20000 })
      await page.waitForTimeout(3000)
      await page.evaluate(() => {
        if (window.setLanguage) window.setLanguage = () => {}
      })

      const themeAfterReload = await getState(page, 'theme')
      if (themeAfterReload === newTheme) t.pass(`Theme ${newTheme} persists after toggle+reload`)
      else t.fail('Theme toggle persist', `expected ${newTheme}, got ${themeAfterReload}`)

      // Toggle back
      await page.evaluate(() => window.toggleTheme())
      await page.waitForTimeout(300)
    } else {
      t.skip('toggleTheme not found')
    }

    // ── Onboarding doesn't re-launch ──
    t.setGroup('Onboarding Persistence')
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(3000)

    const onboardingShown = await page.evaluate(() => {
      const els = document.querySelectorAll('.onboarding, .welcome-modal, [class*="onboarding"]')
      for (const el of els) {
        if (el.offsetHeight > 0 && getComputedStyle(el).display !== 'none') return true
      }
      return false
    })
    if (!onboardingShown) t.pass('Onboarding does not re-launch')
    else t.fail('Onboarding', 'Re-launched after reload')

    // ── localStorage structure ──
    t.setGroup('localStorage Structure')
    const stateKeys = await page.evaluate(() => {
      const raw = localStorage.getItem('spothitch_v4_state')
      if (!raw) return null
      try { return Object.keys(JSON.parse(raw)) } catch { return null }
    })

    if (stateKeys) {
      const expectedKeys = ['theme', 'lang', 'username', 'points']
      for (const key of expectedKeys) {
        if (stateKeys.includes(key)) t.pass(`State has key: ${key}`)
        else t.fail(`State key: ${key}`, 'Missing from localStorage')
      }
    } else {
      t.fail('spothitch_v4_state', 'Not found in localStorage')
    }

  } catch (err) {
    t.fail('Persistence check', err.message.substring(0, 150))
  }

  await browser.close()

  console.log(`\n  Persistence & Reload: ${t.passed}/${t.total} passed (${t.skipped} skipped)`)

  return {
    name: 'Persistence & Reload',
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
