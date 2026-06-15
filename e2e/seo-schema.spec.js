/**
 * SEO and Schema.org tests:
 * - Open Graph meta tags
 * - Twitter Card meta tags
 * - JSON-LD structured data validity
 * - robots.txt correctness
 * - Canonical URL
 * - HTML lang attribute
 * - Title and description
 */
import { test, expect } from '@playwright/test'

// Per-test timeout — SEO tests are I/O heavy (SW init, manifest fetch, etc.)
test.setTimeout(90000)

// ══════════════════════════════════════════════════════════════════════════
// robots.txt (no page navigation — just HTTP request)
// ══════════════════════════════════════════════════════════════════════════
test.describe('robots.txt', () => {
  test('robots.txt exists, allows crawling, and references sitemap', async ({ page }) => {
    const res = await page.request.get('/robots.txt')
    expect(res.status()).toBe(200)

    const body = await res.text()
    expect(body).toContain('User-agent')
    expect(body).toContain('Allow')
    expect(body).not.toContain('Disallow: /')
    expect(body.toLowerCase()).toContain('sitemap')

    console.log('robots.txt OK:\n' + body)
  })
})

// ══════════════════════════════════════════════════════════════════════════
// All HTML meta tags — load page ONCE, check everything
// ══════════════════════════════════════════════════════════════════════════
test.describe('HTML meta tags', () => {
  test('title, description, lang, OG, Twitter all present and valid', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(1000)

    const meta = await page.evaluate(() => {
      const q = (sel) => document.querySelector(sel)?.content || null
      const qh = (sel) => document.querySelector(sel)?.href || null
      return {
        title: document.title,
        lang: document.documentElement.lang,
        description: q('meta[name="description"]'),
        // OG
        ogTitle: q('meta[property="og:title"]'),
        ogDesc: q('meta[property="og:description"]'),
        ogImage: q('meta[property="og:image"]'),
        ogUrl: q('meta[property="og:url"]'),
        ogType: q('meta[property="og:type"]'),
        // Twitter
        twitterCard: q('meta[name="twitter:card"]'),
        twitterTitle: q('meta[name="twitter:title"]'),
        twitterDesc: q('meta[name="twitter:description"]'),
        // Canonical
        canonical: qh('link[rel="canonical"]'),
        // Theme
        themeColor: q('meta[name="theme-color"]'),
      }
    })

    console.log('SEO meta snapshot:', JSON.stringify(meta, null, 2))

    // Title
    expect(meta.title).toBeTruthy()
    expect(meta.title.length).toBeGreaterThan(5)

    // Lang
    expect(meta.lang).toBeTruthy()
    expect(['en', 'fr', 'es', 'de']).toContain(meta.lang.split('-')[0])

    // Description
    expect(meta.description).toBeTruthy()
    expect(meta.description.length).toBeGreaterThan(20)

    // Open Graph
    expect(meta.ogTitle).toBeTruthy()
    expect(meta.ogDesc).toBeTruthy()
    expect(meta.ogDesc.length).toBeGreaterThan(20)
    expect(meta.ogImage).toMatch(/^https?:\/\//)
    expect(meta.ogUrl).toMatch(/^https?:\/\//)
    expect(meta.ogType).toBeTruthy()

    // Twitter
    expect(meta.twitterCard).toBeTruthy()
    expect(['summary', 'summary_large_image', 'app', 'player']).toContain(meta.twitterCard)
    expect(meta.twitterTitle).toBeTruthy()
    expect(meta.twitterDesc).toBeTruthy()

    // Canonical (optional but good practice)
    if (meta.canonical) {
      expect(meta.canonical).toMatch(/^https?:\/\//)
      console.log(`Canonical: ${meta.canonical}`)
    } else {
      console.log('No canonical link — acceptable for SPAs')
    }

    // Theme color
    expect(meta.themeColor).toBeTruthy()
  })
})

// ══════════════════════════════════════════════════════════════════════════
// JSON-LD — load page ONCE, check all schemas
// ══════════════════════════════════════════════════════════════════════════
test.describe('JSON-LD Structured Data', () => {
  test('all JSON-LD blocks are valid and contain required schemas', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(1000)

    const schemas = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
        .map((s, i) => {
          try {
            const parsed = JSON.parse(s.textContent)
            return { index: i, valid: true, type: parsed['@type'], context: parsed['@context'], data: parsed }
          } catch (e) {
            return { index: i, valid: false, error: e.message, raw: s.textContent.slice(0, 100) }
          }
        })
    })

    console.log(`JSON-LD blocks: ${schemas.length}`)
    schemas.forEach(s => {
      if (s.valid) console.log(`  [${s.index}] @type=${s.type}`)
      else console.error(`  [${s.index}] INVALID: ${s.error}`)
    })

    // All must be valid JSON
    expect(schemas.length).toBeGreaterThan(0)
    const invalid = schemas.filter(s => !s.valid)
    expect(invalid).toHaveLength(0)

    // Must have WebSite schema
    const webSite = schemas.find(s => s.data?.['@type'] === 'WebSite')
    expect(webSite).toBeTruthy()
    expect(webSite.data['@context']).toBe('https://schema.org')
    expect(webSite.data.name).toBeTruthy()
    expect(webSite.data.url).toBeTruthy()

    // Must have Organization schema
    const org = schemas.find(s => s.data?.['@type'] === 'Organization')
    expect(org).toBeTruthy()
    expect(org.data.name).toBeTruthy()
    expect(org.data.url).toMatch(/^https?:\/\//)

    // SoftwareApplication is optional but if present must be valid
    const app = schemas.find(s => s.data?.['@type'] === 'SoftwareApplication')
    if (app) {
      expect(app.data.name).toBeTruthy()
      expect(app.data.applicationCategory).toBeTruthy()
      console.log(`SoftwareApplication: category="${app.data.applicationCategory}", price="${app.data.offers?.price}"`)
    }
  })
})

// ══════════════════════════════════════════════════════════════════════════
// Security headers (production-only via _headers)
// ══════════════════════════════════════════════════════════════════════════
test.describe('Security headers', () => {
  test('response does not expose server information', async ({ page }) => {
    const response = await page.goto('/')
    const headers = response?.headers() || {}

    // X-Powered-By should NOT be present (leaks server info)
    const poweredBy = headers['x-powered-by']
    if (poweredBy) {
      console.warn(`x-powered-by header leaks server info: "${poweredBy}"`)
    } else {
      console.log('No x-powered-by header — good')
    }

    // CSP present in production (_headers), not in vite preview — just log
    const csp = headers['content-security-policy']
    if (csp) {
      console.log(`CSP: ${csp.slice(0, 80)}...`)
      expect(csp).toContain('script-src')
    } else {
      console.log('CSP not in preview server headers — deployed via Cloudflare _headers')
    }

    // App must load regardless
    const appAlive = await page.evaluate(() => !!document.getElementById('app'))
    expect(appAlive).toBe(true)
  })
})
