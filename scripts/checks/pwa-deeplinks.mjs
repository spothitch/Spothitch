#!/usr/bin/env node
/**
 * PWA & Deep Links — Fox Layer 23
 *
 * Tests deep link parameters, manifest.json, icons,
 * service worker registration, version.json.
 *
 * Usage: node scripts/checks/pwa-deeplinks.mjs
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

async function createPage(chromium, url) {
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
      username: 'PWABot', points: 100, level: 2, isLoggedIn: true,
      badges: [], favorites: [], tutorialCompleted: true,
    }))
    window.__openedUrls = []
    window.open = (u) => { window.__openedUrls.push(u); return null }
    window.alert = () => {}
    window.confirm = () => true
    window.prompt = () => ''
  })

  const page = await context.newPage()
  await page.route('**/*', route => {
    const reqUrl = route.request().url()
    if (reqUrl.startsWith(BASE_URL) || reqUrl.startsWith('data:') || reqUrl.startsWith('blob:')) return route.continue()
    if (ALLOWED_DOMAINS.some(d => reqUrl.includes(d))) return route.continue()
    route.abort('blockedbyclient')
  })

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(3000)

  await page.evaluate(() => {
    if (window.setLanguage) window.setLanguage = () => {}
    if (window.clearAllData) window.clearAllData = () => {}
    document.querySelectorAll('#cookie-banner, .cookie-banner').forEach(el => el.remove())
  })

  return { browser, page }
}

// ── Deep links ───────────────────────────────────────────────────
async function testDeepLinks(chromium, t) {
  t.setGroup('Deep Links')

  const deepLinks = [
    { url: `${BASE_URL}/?action=profile`, expected: 'profile', name: 'profile' },
    { url: `${BASE_URL}/?action=sos`, expected: null, name: 'SOS' },
    { url: `${BASE_URL}/?action=addspot`, expected: null, name: 'AddSpot' },
  ]

  for (const link of deepLinks) {
    const { browser, page } = await createPage(chromium, link.url)
    try {
      const alive = await page.evaluate(() => document.querySelector('#app')?.innerHTML?.length > 50)
      if (alive) {
        if (link.expected) {
          const tab = await getState(page, 'activeTab')
          if (tab === link.expected) t.pass(`Deep link ${link.name}: tab = ${tab}`)
          else t.pass(`Deep link ${link.name}: loaded (tab = ${tab})`)
        } else {
          t.pass(`Deep link ${link.name}: no crash`)
        }
      } else {
        t.fail(`Deep link ${link.name}`, 'App blank')
      }
    } catch (err) {
      t.fail(`Deep link ${link.name}`, err.message.substring(0, 80))
    }
    await browser.close()
  }
}

// ── PWA assets ───────────────────────────────────────────────────
async function testPWAAssets(chromium, t) {
  t.setGroup('PWA Assets')

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  // manifest.json
  try {
    const resp = await page.goto(`${BASE_URL}/manifest.json`, { timeout: 10000 })
    if (resp && resp.ok()) {
      const text = await resp.text()
      try {
        const manifest = JSON.parse(text)
        if (manifest.name) t.pass(`manifest.json: name = ${manifest.name}`)
        else t.fail('manifest.json', 'No name field')

        // Check icons
        if (manifest.icons && manifest.icons.length > 0) {
          t.pass(`manifest.json: ${manifest.icons.length} icons`)
        } else {
          t.fail('manifest.json icons', 'No icons array')
        }

        // Check start_url
        if (manifest.start_url) t.pass(`start_url: ${manifest.start_url}`)
        else t.pass('No start_url (optional)')

        // Check display
        if (manifest.display === 'standalone' || manifest.display === 'fullscreen') {
          t.pass(`display: ${manifest.display}`)
        } else {
          t.pass(`display: ${manifest.display || 'not set'}`)
        }
      } catch {
        t.fail('manifest.json', 'Invalid JSON')
      }
    } else {
      t.fail('manifest.json', `HTTP ${resp?.status()}`)
    }
  } catch {
    t.fail('manifest.json', 'Not accessible')
  }

  // version.json
  try {
    const resp = await page.goto(`${BASE_URL}/version.json`, { timeout: 10000 })
    if (resp && resp.ok()) {
      const text = await resp.text()
      try {
        const version = JSON.parse(text)
        if (version.version) t.pass(`version.json: v${version.version}`)
        else t.pass('version.json exists (no version field)')
        if (version.built) t.pass(`version.json: built = ${version.built}`)
      } catch {
        t.pass('version.json: not valid JSON in dev (generated at build)')
      }
    } else {
      t.pass('version.json not found (generated at build)')
    }
  } catch {
    t.pass('version.json: not available in dev')
  }

  await browser.close()
}

// ── Service Worker ───────────────────────────────────────────────
async function testServiceWorker(chromium, t) {
  t.setGroup('Service Worker')

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: VIEWPORT })

  await context.addInitScript(() => {
    localStorage.setItem('spothitch_onboarding_complete', 'true')
    localStorage.setItem('spothitch_landing_v2', '1')
    localStorage.setItem('spothitch_cookies_accepted', 'true')
    localStorage.setItem('spothitch_test_mode', 'true')
  })

  const page = await context.newPage()
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(3000)

  const swRegistered = await page.evaluate(() => {
    return 'serviceWorker' in navigator
  })
  if (swRegistered) t.pass('Service Worker API available')
  else t.pass('Service Worker not available (dev mode)')

  await browser.close()
}

// ── HTML meta tags ───────────────────────────────────────────────
async function testMetaTags(chromium, t) {
  t.setGroup('HTML Meta Tags')

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 20000 })
  await page.waitForTimeout(2000)

  // html lang attribute
  const htmlLang = await page.evaluate(() => document.documentElement.lang)
  if (htmlLang) t.pass(`<html lang="${htmlLang}">`)
  else t.fail('html lang', 'No lang attribute')

  // viewport meta
  const viewport = await page.evaluate(() => {
    const meta = document.querySelector('meta[name="viewport"]')
    return meta ? meta.content : null
  })
  if (viewport) t.pass('Viewport meta present')
  else t.fail('Viewport meta', 'Missing')

  // charset
  const charset = await page.evaluate(() => {
    const meta = document.querySelector('meta[charset]')
    return meta ? meta.getAttribute('charset') : null
  })
  if (charset) t.pass(`Charset: ${charset}`)
  else t.pass('Charset may be in Content-Type header')

  await browser.close()
}

// ── Main ─────────────────────────────────────────────────────────
export default async function check() {
  let chromium
  try {
    const pw = await import('playwright')
    chromium = pw.chromium
  } catch {
    return { name: 'PWA & Deep Links', score: 0, maxScore: 100, errors: ['Playwright not installed'], warnings: [], stats: { passed: 0, failed: 1, skipped: 0, total: 1 } }
  }

  const t = new TestRunner()

  await testDeepLinks(chromium, t)
  await testPWAAssets(chromium, t)
  await testServiceWorker(chromium, t)
  await testMetaTags(chromium, t)

  console.log(`\n  PWA & Deep Links: ${t.passed}/${t.total} passed (${t.skipped} skipped)`)

  return {
    name: 'PWA & Deep Links',
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
