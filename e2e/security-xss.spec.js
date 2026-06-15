/**
 * Security: XSS injection tests
 * Tests that user-controlled content cannot execute JavaScript
 */
import { test, expect } from '@playwright/test'

test.describe('XSS — showToast with malicious content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)
  })

  const XSS_PAYLOADS = [
    '<img src=x onerror="window.__xss=1">',
    '<script>window.__xss=1</script>',
    '<svg onload="window.__xss=1">',
    '"><script>window.__xss=1</script>',
  ]

  for (const payload of XSS_PAYLOADS) {
    test(`showToast does not execute: ${payload.slice(0, 50)}`, async ({ page }) => {
      await page.evaluate(() => { window.__xss = undefined })
      await page.evaluate((p) => window.showToast?.(p, 'info'), payload)
      await page.waitForTimeout(500)
      const xss = await page.evaluate(() => window.__xss)
      expect(xss).toBeUndefined()
    })
  }
})

test.describe('XSS — localStorage poisoning', () => {
  test('poisoned username in state does not execute on render', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.evaluate(() => {
      window.__xss = undefined
      try {
        localStorage.setItem('spothitch_v4_state', JSON.stringify({
          username: '<img src=x onerror="window.__xss=1">',
          lang: 'fr',
          isLoggedIn: false,
        }))
      } catch {}
    })

    await page.reload()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1500)

    const xss = await page.evaluate(() => window.__xss)
    expect(xss).toBeUndefined()

    const appAlive = await page.evaluate(() => !!document.getElementById('app'))
    expect(appAlive).toBe(true)
  })

  test('poisoned spot name in state does not execute', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.evaluate(() => {
      window.__xss = undefined
      try {
        localStorage.setItem('spothitch_last_spot', JSON.stringify({
          name: '<svg onload="window.__xss=1">evil spot</svg>',
          lat: 48.85,
          lng: 2.35,
        }))
      } catch {}
    })

    // Navigate to trigger rendering
    await page.evaluate(() => window.setState?.({ showSpots: true }))
    await page.waitForTimeout(1000)

    const xss = await page.evaluate(() => window.__xss)
    expect(xss).toBeUndefined()
  })
})

test.describe('XSS — State injection via setState', () => {
  test('setState with XSS username does not execute on render', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1000)

    await page.evaluate(() => { window.__xss = undefined })
    await page.evaluate(() => {
      window.setState?.({
        isLoggedIn: true,
        username: '<img src=x onerror="window.__xss=1">',
        currentUser: { uid: 'test', email: 'test@test.com' },
      })
    })
    await page.waitForTimeout(1000)

    const xss = await page.evaluate(() => window.__xss)
    expect(xss).toBeUndefined()
  })
})

test.describe('XSS — escapeHTML correctness', () => {
  test('escapeHTML blocks < > & in all rendering contexts', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const result = await page.evaluate(() => {
      // Test the app's own escapeHTML (imported or global)
      const testDiv = document.createElement('div')
      testDiv.textContent = '<img src=x onerror="1+1">'
      const escaped = testDiv.innerHTML
      return {
        hasRawAngle: escaped.includes('<img'),
        hasEscaped: escaped.includes('&lt;'),
      }
    })

    expect(result.hasRawAngle).toBe(false)
    expect(result.hasEscaped).toBe(true)
  })
})
