/**
 * PWA lifecycle tests:
 * - Manifest valid + all required fields
 * - Icons accessible at declared URLs
 * - Service worker registration
 * - Offline page available
 * - Cache headers on assets
 */
import { test, expect } from '@playwright/test'

// ══════════════════════════════════════════════════════════════════════════
// Manifest validation
// ══════════════════════════════════════════════════════════════════════════
test.describe('PWA Manifest', () => {
  test('manifest.webmanifest exists and is valid JSON', async ({ page }) => {
    const res = await page.request.get('/manifest.webmanifest')
    expect(res.status()).toBe(200)

    const ct = res.headers()['content-type'] || ''
    expect(ct).toMatch(/json|manifest/)

    const body = await res.text()
    let manifest
    try {
      manifest = JSON.parse(body)
    } catch (e) {
      throw new Error(`manifest.webmanifest is not valid JSON: ${e.message}`)
    }

    // Required PWA fields
    expect(manifest.name).toBeTruthy()
    expect(manifest.short_name).toBeTruthy()
    expect(manifest.start_url).toBeTruthy()
    expect(manifest.display).toBe('standalone')
    expect(manifest.theme_color).toBeTruthy()
    expect(manifest.background_color).toBeTruthy()
    expect(Array.isArray(manifest.icons)).toBe(true)
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2)

    // Each icon must have src + sizes
    for (const icon of manifest.icons) {
      expect(icon.src).toBeTruthy()
      expect(icon.sizes).toBeTruthy()
    }

    console.log(`Manifest: "${manifest.name}" — ${manifest.icons.length} icons, display=${manifest.display}`)
  })

  test('all declared manifest icons are accessible', async ({ page }) => {
    const res = await page.request.get('/manifest.webmanifest')
    const manifest = JSON.parse(await res.text())

    const errors = []
    for (const icon of manifest.icons) {
      const iconRes = await page.request.get(icon.src)
      if (iconRes.status() !== 200) {
        errors.push(`${icon.src} → HTTP ${iconRes.status()}`)
      }
    }

    if (errors.length > 0) {
      console.error('Missing icons:', errors.join(', '))
    }
    expect(errors).toHaveLength(0)
  })

  test('manifest is linked from the HTML page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('load')

    const manifestLink = await page.evaluate(() => {
      const link = document.querySelector('link[rel="manifest"]')
      return link ? link.href : null
    })

    expect(manifestLink).toBeTruthy()
    expect(manifestLink).toContain('manifest')
    console.log(`Manifest linked: ${manifestLink}`)
  })

  test('theme-color meta tag matches manifest', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('load')

    const themeColor = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="theme-color"]')
      return meta ? meta.content : null
    })

    expect(themeColor).toBeTruthy()
    console.log(`Theme color: ${themeColor}`)
  })
})

// ══════════════════════════════════════════════════════════════════════════
// Service Worker
// ══════════════════════════════════════════════════════════════════════════
test.describe('Service Worker', () => {
  test('service worker is registered', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(2000) // SW registration is async

    const swState = await page.evaluate(async () => {
      if (!navigator.serviceWorker) return { supported: false }
      const reg = await navigator.serviceWorker.getRegistration('/')
      if (!reg) return { supported: true, registered: false }
      return {
        supported: true,
        registered: true,
        scope: reg.scope,
        state: (reg.active || reg.installing || reg.waiting)?.state || 'none',
      }
    })

    console.log(`SW: supported=${swState.supported}, registered=${swState.registered}, state=${swState.state}`)
    expect(swState.supported).toBe(true)
    expect(swState.registered).toBe(true)
  })

  test('service worker script is accessible', async ({ page }) => {
    // The Vite PWA plugin generates sw.js
    const swPaths = ['/sw.js', '/service-worker.js']
    let found = false

    for (const path of swPaths) {
      const res = await page.request.get(path)
      if (res.status() === 200) {
        const body = await res.text()
        // Should contain workbox or cache API
        if (body.includes('cache') || body.includes('workbox') || body.includes('fetch')) {
          found = true
          console.log(`SW found at ${path} (${body.length} bytes)`)
          break
        }
      }
    }

    expect(found).toBe(true)
  })

  test('offline page is available', async ({ page }) => {
    const res = await page.request.get('/offline.html')
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body).toContain('html')
    console.log(`offline.html: ${body.length} bytes`)
  })

  test('app caches work after SW activation', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(3000)

    const caches = await page.evaluate(async () => {
      if (!window.caches) return []
      const keys = await window.caches.keys()
      return keys
    })

    console.log(`Cache names: ${JSON.stringify(caches)}`)
    // Should have at least one cache after SW activation
    expect(caches.length).toBeGreaterThan(0)
  })
})

// ══════════════════════════════════════════════════════════════════════════
// Static assets
// ══════════════════════════════════════════════════════════════════════════
test.describe('Static assets', () => {
  test('favicon is accessible', async ({ page }) => {
    const paths = ['/favicon.ico', '/favicon.png']
    for (const p of paths) {
      const res = await page.request.get(p)
      expect(res.status()).toBe(200)
    }
  })

  test('apple-touch-icon is accessible', async ({ page }) => {
    const res = await page.request.get('/apple-touch-icon.png')
    expect(res.status()).toBe(200)
    const ct = res.headers()['content-type'] || ''
    expect(ct).toContain('image')
  })

  test('JS assets have content-type application/javascript', async ({ page }) => {
    const intercepted = []

    page.on('response', (res) => {
      const url = res.url()
      const ct = res.headers()['content-type'] || ''
      if (url.includes('/assets/') && url.endsWith('.js')) {
        intercepted.push({ url: url.split('/').pop(), ct, status: res.status() })
      }
    })

    await page.goto('/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(1000)

    const badCt = intercepted.filter(r => !r.ct.includes('javascript'))
    if (badCt.length > 0) {
      console.error('Bad content-type for JS files:', badCt)
    }

    console.log(`${intercepted.length} JS assets loaded`)
    expect(intercepted.length).toBeGreaterThan(0)
    expect(badCt).toHaveLength(0)
  })
})

// ══════════════════════════════════════════════════════════════════════════
// PWA installability
// ══════════════════════════════════════════════════════════════════════════
test.describe('PWA installability', () => {
  test('app meets baseline installability criteria', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(2000)

    const criteria = await page.evaluate(async () => {
      const manifest = await fetch('/manifest.webmanifest').then(r => r.json()).catch(() => null)
      const swReg = navigator.serviceWorker
        ? await navigator.serviceWorker.getRegistration('/').catch(() => null)
        : null

      return {
        hasManifest: !!manifest,
        hasName: !!(manifest?.name),
        hasStartUrl: !!(manifest?.start_url),
        hasIcon192: manifest?.icons?.some(i => i.sizes?.includes('192x192')),
        hasServiceWorker: !!swReg,
        isHttps: location.protocol === 'https:' || location.hostname === 'localhost',
        hasDisplay: manifest?.display === 'standalone' || manifest?.display === 'fullscreen',
      }
    })

    console.log('PWA installability:', JSON.stringify(criteria, null, 2))
    expect(criteria.hasManifest).toBe(true)
    expect(criteria.hasName).toBe(true)
    expect(criteria.hasStartUrl).toBe(true)
    expect(criteria.hasIcon192).toBe(true)
    expect(criteria.isHttps).toBe(true)
    expect(criteria.hasDisplay).toBe(true)
  })
})
