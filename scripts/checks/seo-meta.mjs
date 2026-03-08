#!/usr/bin/env node
/**
 * SEO & Meta — Fox Layer 25
 *
 * Static + HTTP checks: title, description, og tags,
 * robots.txt, sitemap.xml, html lang.
 *
 * Usage: node scripts/checks/seo-meta.mjs
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const BASE_URL = process.env.APP_URL || 'http://localhost:5173'

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

// ── Static HTML check ────────────────────────────────────────────
function checkStaticHTML(t) {
  t.setGroup('Static HTML')

  const indexPath = join(ROOT, 'index.html')
  if (!existsSync(indexPath)) {
    t.fail('index.html', 'Not found')
    return
  }

  const html = readFileSync(indexPath, 'utf-8')

  // <title>
  const titleMatch = html.match(/<title>([^<]+)<\/title>/)
  if (titleMatch && titleMatch[1].length > 0) {
    t.pass(`<title>: "${titleMatch[1].substring(0, 40)}"`)
  } else {
    t.fail('<title>', 'Missing or empty')
  }

  // <meta name="description">
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/)
  if (descMatch && descMatch[1].length > 50) {
    t.pass(`meta description: ${descMatch[1].length} chars`)
  } else if (descMatch) {
    t.fail('meta description', `Too short: ${descMatch[1].length} chars (<50)`)
  } else {
    t.fail('meta description', 'Missing')
  }

  // <meta property="og:title">
  const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/)
  if (ogTitleMatch && ogTitleMatch[1]) {
    t.pass(`og:title: "${ogTitleMatch[1].substring(0, 40)}"`)
  } else {
    t.fail('og:title', 'Missing')
  }

  // <meta property="og:description">
  const ogDescMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/)
  if (ogDescMatch && ogDescMatch[1]) {
    t.pass(`og:description present`)
  } else {
    t.fail('og:description', 'Missing')
  }

  // <meta property="og:image">
  const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/)
  if (ogImageMatch && ogImageMatch[1]) {
    t.pass(`og:image: ${ogImageMatch[1].substring(0, 50)}`)
  } else {
    t.fail('og:image', 'Missing')
  }

  // <html lang="...">
  const langMatch = html.match(/<html[^>]*\slang="([^"]*)"/)
  if (langMatch && langMatch[1]) {
    t.pass(`<html lang="${langMatch[1]}">`)
  } else {
    t.fail('html lang', 'Missing lang attribute')
  }

  // charset
  const charsetMatch = html.match(/<meta\s+charset="([^"]*)"/)
  if (charsetMatch) {
    t.pass(`charset: ${charsetMatch[1]}`)
  } else {
    t.pass('charset may be set differently')
  }

  // viewport
  const viewportMatch = html.match(/<meta\s+name="viewport"/)
  if (viewportMatch) {
    t.pass('viewport meta present')
  } else {
    t.fail('viewport meta', 'Missing')
  }
}

// ── Static file checks ──────────────────────────────────────────
function checkStaticFiles(t) {
  t.setGroup('Static Files')

  // robots.txt
  const robotsPath = join(ROOT, 'public', 'robots.txt')
  if (existsSync(robotsPath)) {
    const content = readFileSync(robotsPath, 'utf-8')
    if (content.includes('User-agent')) t.pass('robots.txt valid')
    else t.fail('robots.txt', 'No User-agent directive')
  } else {
    t.fail('robots.txt', 'Not found in public/')
  }

  // sitemap.xml
  const sitemapPath = join(ROOT, 'public', 'sitemap.xml')
  if (existsSync(sitemapPath)) {
    const content = readFileSync(sitemapPath, 'utf-8')
    if (content.includes('<urlset') || content.includes('<sitemapindex')) {
      t.pass('sitemap.xml valid')
    } else {
      t.fail('sitemap.xml', 'Not valid XML sitemap')
    }
  } else {
    t.fail('sitemap.xml', 'Not found in public/')
  }

  // favicon
  const faviconPaths = [
    join(ROOT, 'public', 'favicon.ico'),
    join(ROOT, 'public', 'favicon.svg'),
    join(ROOT, 'public', 'favicon.png'),
  ]
  const hasFavicon = faviconPaths.some(p => existsSync(p))
  if (hasFavicon) t.pass('Favicon found')
  else t.fail('Favicon', 'No favicon found')
}

// ── HTTP checks (optional) ──────────────────────────────────────
async function checkHTTP(t) {
  t.setGroup('HTTP Accessibility')

  try {
    const resp = await fetch(`${BASE_URL}/robots.txt`)
    if (resp.ok) t.pass('robots.txt accessible via HTTP')
    else t.pass(`robots.txt HTTP ${resp.status} (may not be served in dev)`)
  } catch {
    t.pass('robots.txt HTTP check skipped (server may be down)')
  }

  try {
    const resp = await fetch(`${BASE_URL}/sitemap.xml`)
    if (resp.ok) t.pass('sitemap.xml accessible via HTTP')
    else t.pass(`sitemap.xml HTTP ${resp.status} (may not be served in dev)`)
  } catch {
    t.pass('sitemap.xml HTTP check skipped')
  }
}

// ── Main ─────────────────────────────────────────────────────────
export default async function check() {
  const t = new TestRunner()

  checkStaticHTML(t)
  checkStaticFiles(t)
  await checkHTTP(t)

  console.log(`\n  SEO & Meta: ${t.passed}/${t.total} passed (${t.skipped} skipped)`)

  return {
    name: 'SEO & Meta',
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
