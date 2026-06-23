import { test, expect } from '@playwright/test'

/**
 * Toggle handlers — REAL flip effect (Brique 2).
 * Each test triggers the toggle and verifies the underlying value really flipped
 * (app state / spotFormData / localStorage), not just that the handler exists.
 */
test.describe('Toggle handlers', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem('spothitch_welcomed', 'true')
        localStorage.setItem('spothitch_age_verified', 'true')
        localStorage.setItem('spothitch_cookie_consent', 'true')
        localStorage.setItem('spothitch_landing_seen', 'true')
      } catch { /* ignore */ }
    })
    await page.goto('/', { waitUntil: 'load', timeout: 30000 }).catch(() => {})
    await page.waitForFunction(() => typeof window.setState === 'function' && typeof window.getState === 'function', { timeout: 15000 })
  })

  async function expectFlip(page, fn, flag, opts = {}) {
    // poll until the real (non-stub) handler is loaded, then verify it flips the flag
    return page.waitForFunction(async ({ fn, flag }) => {
      if (typeof window[fn] !== 'function') return false
      const before = !!window.getState()[flag]
      await window[fn]()
      const after = !!window.getState()[flag]
      return after !== before
    }, { fn, flag }, { timeout: 12000, ...opts }).then(() => true).catch(() => false)
  }

  test('toggleMapLegend flips showMapLegend', async ({ page }) => {
    expect(await expectFlip(page, 'toggleMapLegend', 'showMapLegend')).toBe(true)
  })

  test('toggleVerifiedFilter flips filterVerifiedOnly', async ({ page }) => {
    expect(await expectFlip(page, 'toggleVerifiedFilter', 'filterVerifiedOnly')).toBe(true)
  })

  test('toggleAutoOfflineDownload flips offlineAutoDownloadEnabled', async ({ page }) => {
    expect(await expectFlip(page, 'toggleAutoOfflineDownload', 'offlineAutoDownloadEnabled')).toBe(true)
  })

  test('toggleAccessibility flips a setting and persists it to localStorage', async ({ page }) => {
    const r = await page.evaluate(async () => {
      const before = !!window.getState().bigText
      await window.toggleAccessibility('bigText')
      return {
        flipped: !!window.getState().bigText !== before,
        stored: localStorage.getItem('spothitch_big_text'),
      }
    })
    expect(r.flipped).toBe(true)
    expect(['0', '1']).toContain(r.stored)
  })

  test('toggleAmenity flips a spot-form tag', async ({ page }) => {
    // toggleAmenity lives in the lazy AddSpot module — open it so the real handler installs.
    await page.evaluate(() => window.setState({ showAddSpot: true }))
    await page.waitForFunction(() => typeof window.toggleAmenity === 'function', { timeout: 15000 })
    const r = await page.evaluate(async () => {
      window.spotFormData = window.spotFormData || { tags: {} }
      window.spotFormData.tags = {}
      window.toggleAmenity('shelter')
      const on = window.spotFormData.tags.shelter
      window.toggleAmenity('shelter')
      const off = window.spotFormData.tags.shelter
      return { on, off }
    })
    expect(r.on).toBe(true)
    expect(r.off).toBe(false)
  })
})
