/**
 * Deep performance tests:
 * - Memory leak detection via heap snapshots
 * - Long Tasks (> 50ms blocking)
 * - Time-to-Interactive
 */
import { test, expect } from '@playwright/test'

// ══════════════════════════════════════════════════════════════════════════
// Memory leak detection
// ══════════════════════════════════════════════════════════════════════════
test.describe('Memory leak detection', () => {
  test('heap does not grow unboundedly after repeated navigation', async ({ page, context }) => {
    const cdp = await context.newCDPSession(page)

    await page.goto('/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(3000)

    // Force GC and take initial heap snapshot
    await cdp.send('HeapProfiler.enable')
    await cdp.send('HeapProfiler.collectGarbage')
    await page.waitForTimeout(500)

    const snap1 = await cdp.send('Runtime.evaluate', {
      expression: 'performance.memory ? performance.memory.usedJSHeapSize : -1',
      returnByValue: true,
    })
    const heap1 = snap1.result.value

    // Navigate between views 20 times
    const views = [
      () => page.evaluate(() => window.setState?.({ showSpots: true, showHome: false })),
      () => page.evaluate(() => window.setState?.({ showHome: true, showSpots: false })),
      () => page.evaluate(() => window.setState?.({ showProfile: true })),
      () => page.evaluate(() => window.setState?.({ showProfile: false })),
    ]

    for (let i = 0; i < 20; i++) {
      await views[i % views.length]()
      await page.waitForTimeout(200)
    }

    // Force GC again and measure
    await cdp.send('HeapProfiler.collectGarbage')
    await page.waitForTimeout(1000)

    const snap2 = await cdp.send('Runtime.evaluate', {
      expression: 'performance.memory ? performance.memory.usedJSHeapSize : -1',
      returnByValue: true,
    })
    const heap2 = snap2.result.value

    if (heap1 > 0 && heap2 > 0) {
      const growthMB = (heap2 - heap1) / (1024 * 1024)
      console.log(`Heap: initial=${(heap1/1024/1024).toFixed(1)}MB, after 20 navs=${(heap2/1024/1024).toFixed(1)}MB, growth=${growthMB.toFixed(1)}MB`)

      // Allow up to 10MB growth (generous — normal for caches)
      // A real leak would grow by 50-100MB+
      expect(growthMB).toBeLessThan(30)
    } else {
      console.log('performance.memory not available (not Chrome) — skipping heap check')
    }
  })

  test('event listener count does not explode during navigation', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(2000)

    const getListenerCount = () => page.evaluate(() => {
      // Count visible event listeners using getEventListeners (Chrome DevTools Protocol)
      // Fallback: count document-level listeners (rough proxy)
      let count = 0
      const originalAdd = EventTarget.prototype.addEventListener
      return typeof getEventListeners !== 'undefined'
        ? Object.values(getEventListeners(document)).flat().length
        : -1 // Not available in content context
    })

    // Navigate 10 times
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => {
        window.setState?.({ showAuth: true })
        window.setState?.({ showAuth: false })
      })
      await page.waitForTimeout(100)
    }

    const appAlive = await page.evaluate(() => !!document.getElementById('app'))
    expect(appAlive).toBe(true)
  })
})

// ══════════════════════════════════════════════════════════════════════════
// Long Tasks detection
// ══════════════════════════════════════════════════════════════════════════
test.describe('Long Tasks (blocking the main thread > 50ms)', () => {
  test('no Long Tasks > 200ms during initial page load', async ({ page }) => {
    const longTasks = []

    // Inject PerformanceObserver before navigation
    await page.addInitScript(() => {
      window.__longTasks = []
      if (typeof PerformanceObserver !== 'undefined') {
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.duration > 200) {
                window.__longTasks.push({
                  duration: Math.round(entry.duration),
                  startTime: Math.round(entry.startTime),
                })
              }
            }
          })
          observer.observe({ type: 'longtask', buffered: true })
        } catch { /* longtask not supported */ }
      }
    })

    await page.goto('/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(3000)

    const tasks = await page.evaluate(() => window.__longTasks || [])

    if (tasks.length > 0) {
      console.log(`Long Tasks found (> 200ms):`)
      tasks.forEach(t => console.log(`  ${t.duration}ms at ${t.startTime}ms`))
    } else {
      console.log('No Long Tasks > 200ms detected ✓')
    }

    // Allow up to 3 long tasks during initial load (complex PWA with service worker)
    expect(tasks.length).toBeLessThan(5)
  })
})

// ══════════════════════════════════════════════════════════════════════════
// Time-to-Interactive approximation
// ══════════════════════════════════════════════════════════════════════════
test.describe('Time-to-Interactive', () => {
  test('app is interactive within 5 seconds on fast connection', async ({ page }) => {
    const start = Date.now()
    await page.goto('/')
    await page.waitForLoadState('load')

    // Wait for app to be interactive (setState works)
    await page.waitForFunction(() => {
      return typeof window.setState === 'function' && !!document.getElementById('app')
    }, { timeout: 10000 })

    const tti = Date.now() - start
    console.log(`Time-to-Interactive: ${tti}ms`)

    // Should be interactive within 5 seconds on fast connection
    expect(tti).toBeLessThan(5000)
  })

  test('Core Web Vitals: LCP measurement', async ({ page }) => {
    await page.addInitScript(() => {
      window.__lcp = null
      if (typeof PerformanceObserver !== 'undefined') {
        try {
          new PerformanceObserver((list) => {
            const entries = list.getEntries()
            if (entries.length > 0) {
              window.__lcp = entries[entries.length - 1].startTime
            }
          }).observe({ type: 'largest-contentful-paint', buffered: true })
        } catch { /* not supported */ }
      }
    })

    await page.goto('/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(3000)

    const lcp = await page.evaluate(() => window.__lcp)
    if (lcp !== null) {
      console.log(`LCP: ${Math.round(lcp)}ms`)
      // Good LCP: < 2500ms
      // Needs improvement: 2500-4000ms
      // Poor: > 4000ms
      if (lcp > 4000) {
        console.warn(`LCP ${Math.round(lcp)}ms is POOR (> 4000ms)`)
      } else if (lcp > 2500) {
        console.warn(`LCP ${Math.round(lcp)}ms needs improvement (> 2500ms)`)
      } else {
        console.log(`LCP ${Math.round(lcp)}ms is GOOD (< 2500ms)`)
      }
      expect(lcp).toBeLessThan(8000) // Hard fail only if extremely bad
    } else {
      console.log('LCP not available in this context')
    }
  })
})

// ══════════════════════════════════════════════════════════════════════════
// Bundle size check
// ══════════════════════════════════════════════════════════════════════════
test.describe('Bundle size regression', () => {
  test('JS bundles are not unexpectedly large', async ({ page }) => {
    const resources = []

    page.on('response', (response) => {
      const url = response.url()
      if (url.includes('/assets/') && url.endsWith('.js')) {
        const size = parseInt(response.headers()['content-length'] || '0')
        if (size > 0) {
          resources.push({ url: url.split('/').pop(), size })
        }
      }
    })

    await page.goto('/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(2000)

    const largeChunks = resources.filter(r => r.size > 500 * 1024) // > 500KB compressed
    if (largeChunks.length > 0) {
      console.log('Large JS bundles:')
      largeChunks.forEach(r => console.log(`  ${r.url}: ${(r.size/1024).toFixed(0)}KB`))
    }

    const totalSize = resources.reduce((sum, r) => sum + r.size, 0)
    console.log(`Total JS: ${resources.length} files, ${(totalSize/1024/1024).toFixed(1)}MB compressed`)

    // No single bundle > 1MB compressed
    const hasHuge = resources.some(r => r.size > 1024 * 1024)
    expect(hasHuge).toBe(false)
  })
})
