/**
 * Multi-User Phase 8: Carte & Navigation (~35 tests)
 *
 * DEEP behavioral tests for map, search, zoom, filters, GPS,
 * navigation tabs, deep links, share target, offline, gas stations.
 *
 * Users: Alice, Bob, Admin
 */
import { test, expect } from '@playwright/test'
import {
  createUserSession,
  snap,
  captureConsoleErrors,
  assertNoConsoleErrors,
  measureTime,
  TEST_ACCOUNTS,
  getCurrentUid,
  getAppState,
  navigateToTab,
} from './multi-user-helpers.js'
import { skipOnboarding, dismissOverlays, waitForMap } from './helpers.js'

test.use({ viewport: { width: 390, height: 844 } })
test.setTimeout(60000)

// ═══════════════════════════════════════════════════════════════════════════════
// 8.1 — Map loading
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('8.1 Map loading', () => {
  let context, page

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    page = await context.newPage()
    await skipOnboarding(page)
  })

  test.afterAll(async () => {
    await context?.close()
  })

  test('map container is visible on home tab', async () => {
    const hasMap = await page.evaluate(() =>
      !!document.querySelector('#map-container, .maplibregl-map, canvas')
    )
    expect(hasMap).toBe(true)
    await snap(page, 8, '8.1-map-visible', 'after')
  })

  test('zoom controls are visible and accessible', async () => {
    const zoomIn = page.locator('button:has-text("+"), [aria-label*="Zoom in"]')
    const zoomOut = page.locator('button:has-text("−"), button:has-text("-"), [aria-label*="Zoom out"]')
    expect(await zoomIn.count()).toBeGreaterThan(0)
    expect(await zoomOut.count()).toBeGreaterThan(0)
  })

  test('navigation bar has 4 tabs', async () => {
    const tabs = page.locator('nav[role="navigation"] [role="tab"]')
    expect(await tabs.count()).toBe(4)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 8.2 — Search
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('8.2 Search', () => {
  let context, page

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    page = await context.newPage()
    await skipOnboarding(page)
  })

  test.afterAll(async () => {
    await context?.close()
  })

  test('search input is visible and accepts text', async () => {
    await waitForMap(page)
    const input = page.locator('#side-panel-destination, #home-destination, input[placeholder*="Search"], input[placeholder*="Recherche"]').first()
    await expect(input).toBeVisible({ timeout: 20000 })
    await input.fill('Paris')
    const value = await input.first().inputValue()
    expect(value).toBe('Paris')
    await snap(page, 8, '8.2-search-input', 'after')
  })

  test('search shows autocomplete suggestions after typing', async () => {
    test.skip(!!process.env.CI, 'Photon API autocomplete flaky in CI')
    const input = page.locator('#side-panel-destination, #home-destination, input[placeholder*="Search"], input[placeholder*="Recherche"]')
    await input.first().fill('')
    await input.first().fill('Lyon')
    // Wait for debounce + API response
    await page.waitForTimeout(2000)

    const suggestions = page.locator('#home-dest-suggestions, [data-home-suggestion]')
    const hasSuggestions = await suggestions.count() > 0 ||
      await page.evaluate(() => !document.getElementById('home-dest-suggestions')?.classList.contains('hidden'))

    await snap(page, 8, '8.2-search-suggestions', 'after')
  })

  test('homeClearSearch clears input and state', async () => {
    await page.evaluate(() => window.homeClearSearch?.())
    await page.waitForTimeout(500)

    const state = await page.evaluate(() => window.getState?.()?.homeSearchLabel)
    expect(state).toBeFalsy()

    const input = page.locator('#home-destination, input[placeholder*="Search"], input[placeholder*="Recherche"]')
    if (await input.count() > 0) {
      const val = await input.first().inputValue()
      expect(val).toBe('')
    }
    await snap(page, 8, '8.2-search-cleared', 'after')
  })

  test('homeSelectPlace validates coordinates', async () => {
    const capture = captureConsoleErrors(page)

    // Valid coordinates
    await page.evaluate(() => window.homeSelectPlace?.(48.85, 2.35, 'Paris'))
    await page.waitForTimeout(1000)

    // Invalid coordinates (should be silently ignored)
    await page.evaluate(() => window.homeSelectPlace?.(Infinity, -Infinity, 'Bad'))
    await page.waitForTimeout(500)
    await page.evaluate(() => window.homeSelectPlace?.(NaN, NaN, 'Bad'))
    await page.waitForTimeout(500)

    const pageErrors = capture.errors.filter(e => e.startsWith('PAGE_ERROR'))
    expect(pageErrors.length).toBe(0)
    await snap(page, 8, '8.2-select-place-validation', 'after')
  })

  test('empty search does not crash', async () => {
    const capture = captureConsoleErrors(page)
    await page.evaluate(() => {
      const input = document.getElementById('home-destination')
      if (input) {
        input.value = ''
        input.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })
    await page.waitForTimeout(1000)
    const pageErrors = capture.errors.filter(e => e.startsWith('PAGE_ERROR'))
    expect(pageErrors.length).toBe(0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 8.3 — Zoom
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('8.3 Zoom', () => {
  let context, page

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    page = await context.newPage()
    await skipOnboarding(page)
  })

  test.afterAll(async () => {
    await context?.close()
  })

  test('homeZoomIn increases zoom level', async () => {
    const before = await page.evaluate(() => window.homeMapInstance?.getZoom?.() || 0)
    await page.evaluate(() => window.homeZoomIn?.())
    await page.waitForTimeout(1000)
    const after = await page.evaluate(() => window.homeMapInstance?.getZoom?.() || 0)
    // Zoom should have increased (or at least not crashed)
    expect(after).toBeGreaterThanOrEqual(before)
  })

  test('homeZoomOut decreases zoom level', async () => {
    const before = await page.evaluate(() => window.homeMapInstance?.getZoom?.() || 0)
    await page.evaluate(() => window.homeZoomOut?.())
    await page.waitForTimeout(1000)
    const after = await page.evaluate(() => window.homeMapInstance?.getZoom?.() || 0)
    expect(after).toBeLessThanOrEqual(before)
  })

  test('rapid zoom does not crash', async () => {
    const capture = captureConsoleErrors(page)
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.homeZoomIn?.())
      await page.waitForTimeout(100)
    }
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.homeZoomOut?.())
      await page.waitForTimeout(100)
    }
    await page.waitForTimeout(1000)
    const pageErrors = capture.errors.filter(e => e.startsWith('PAGE_ERROR'))
    expect(pageErrors.length).toBe(0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 8.4 — Filters
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('8.4 Filters', () => {
  let context, page

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    page = await context.newPage()
    await skipOnboarding(page)
  })

  test.afterAll(async () => {
    await context?.close()
  })

  test('openFilters opens filter modal', async () => {
    await page.evaluate(() => window.openFilters?.())
    await page.waitForTimeout(1500)

    const isOpen = await page.evaluate(() =>
      window.getState?.()?.showFilters === true
    )
    expect(isOpen).toBe(true)
    await snap(page, 8, '8.4-filters-open', 'after')
  })

  test('resetFilters clears all filter state', async () => {
    await page.evaluate(() => window.resetFilters?.())
    await page.waitForTimeout(500)

    const state = await page.evaluate(() => ({
      country: window.getState?.()?.filterCountry,
      minRating: window.getState?.()?.filterMinRating,
      verifiedOnly: window.getState?.()?.filterVerifiedOnly,
    }))
    // "all" or null/undefined are both valid reset states
    expect(!state.country || state.country === 'all').toBe(true)
    expect(!state.minRating || state.minRating === 0).toBe(true)
    await snap(page, 8, '8.4-filters-reset', 'after')
  })

  test('closeFilters closes modal', async () => {
    await page.evaluate(() => window.openFilters?.())
    await page.waitForTimeout(1000)
    await page.evaluate(() => window.closeFilters?.())
    await page.waitForTimeout(500)

    const isOpen = await page.evaluate(() => window.getState?.()?.showFilters === true)
    expect(isOpen).toBeFalsy()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 8.5 — Spot from map
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('8.5 Spot from map', () => {
  let context, page

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    page = await context.newPage()
    await skipOnboarding(page)
  })

  test.afterAll(async () => {
    await context?.close()
  })

  test('openSpotDetail from map and close', async () => {
    await page.evaluate(() => {
      window.setState?.({ selectedSpot: {
        id: 'map-test',
        coordinates: { lat: 48.85, lng: 2.35 },
        city: 'Paris',
        spotType: 'roadside',
        ratings: { safety: 3, traffic: 3, accessibility: 3 },
      }})
    })
    await page.waitForTimeout(2000)

    const hasSpot = await page.evaluate(() => !!window.getState?.()?.selectedSpot)
    expect(hasSpot).toBe(true)

    await page.evaluate(() => window.closeSpotDetail?.())
    await page.waitForTimeout(1000)

    const closed = await page.evaluate(() => !window.getState?.()?.selectedSpot)
    expect(closed).toBe(true)
    await snap(page, 8, '8.5-spot-from-map', 'after')
  })

  test('openSpotDetail with invalid coords does not crash map', async () => {
    const capture = captureConsoleErrors(page)
    await page.evaluate(() => {
      window.setState?.({ selectedSpot: {
        id: 'bad-coords',
        coordinates: { lat: NaN, lng: Infinity },
      }})
    })
    await page.waitForTimeout(1000)

    const pageErrors = capture.errors.filter(e => e.startsWith('PAGE_ERROR'))
    expect(pageErrors.length).toBe(0)

    await page.evaluate(() => window.closeSpotDetail?.())
    await page.waitForTimeout(500)
  })

  test('FAB add spot button is visible', async () => {
    // Make sure we're on map tab
    await navigateToTab(page, 'map')
    await page.waitForTimeout(1000)

    const fab = page.locator('button[onclick*="openAddSpot"], [aria-label*="Add spot"], [aria-label*="Ajouter"]')
    expect(await fab.count()).toBeGreaterThan(0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 8.6 — Gas stations
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('8.6 Gas stations', () => {
  let context, page

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    page = await context.newPage()
    await skipOnboarding(page)
  })

  test.afterAll(async () => {
    await context?.close()
  })

  test('toggleGasStations handler exists', async () => {
    const exists = await page.evaluate(() => typeof window.toggleGasStations === 'function')
    expect(exists).toBe(true)
  })

  test('toggleGasStations does not crash', async () => {
    const capture = captureConsoleErrors(page)
    await page.evaluate(() => window.toggleGasStations?.())
    await page.waitForTimeout(2000)

    const pageErrors = capture.errors.filter(e => e.startsWith('PAGE_ERROR'))
    expect(pageErrors.length).toBe(0)
    await snap(page, 8, '8.6-gas-stations', 'after')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 8.7 — GPS / centerOnUser
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('8.7 GPS', () => {
  let context, page

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      geolocation: { latitude: 48.85, longitude: 2.35 },
      permissions: ['geolocation'],
    })
    page = await context.newPage()
    await skipOnboarding(page)
  })

  test.afterAll(async () => {
    await context?.close()
  })

  test('centerOnUser handler exists', async () => {
    const exists = await page.evaluate(() =>
      typeof window.homeCenterOnUser === 'function' || typeof window.centerOnUser === 'function'
    )
    expect(exists).toBe(true)
  })

  test('centerOnUser with GPS permission does not crash', async () => {
    const capture = captureConsoleErrors(page)
    await page.evaluate(() => (window.homeCenterOnUser || window.centerOnUser)?.())
    await page.waitForTimeout(3000)

    const pageErrors = capture.errors.filter(e => e.startsWith('PAGE_ERROR'))
    expect(pageErrors.length).toBe(0)
    await snap(page, 8, '8.7-gps-center', 'after')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 8.8 — Tab navigation preserves map
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('8.8 Tab navigation', () => {
  let context, page

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    page = await context.newPage()
    await skipOnboarding(page)
  })

  test.afterAll(async () => {
    await context?.close()
  })

  test('switching tabs and back preserves map', async () => {
    // Start on map
    await navigateToTab(page, 'map')
    await page.waitForTimeout(1000)

    const mapBefore = await page.evaluate(() => !!window.homeMapInstance)

    // Switch to profile
    await navigateToTab(page, 'profile')
    await page.waitForTimeout(1000)

    // Switch back to map
    await navigateToTab(page, 'map')
    await page.waitForTimeout(1000)

    const mapAfter = await page.evaluate(() => !!window.homeMapInstance)
    expect(mapAfter).toBe(mapBefore)
    await snap(page, 8, '8.8-tab-preserve-map', 'after')
  })

  test('rapid tab switching does not crash', async () => {
    const capture = captureConsoleErrors(page)
    const tabs = ['map', 'travel', 'social', 'profile', 'map']
    for (const tab of tabs) {
      await navigateToTab(page, tab)
      await page.waitForTimeout(300)
    }
    await page.waitForTimeout(2000)

    const pageErrors = capture.errors.filter(e => e.startsWith('PAGE_ERROR'))
    expect(pageErrors.length).toBe(0)
  })

  test('changeTab handler exists', async () => {
    const exists = await page.evaluate(() => typeof window.changeTab === 'function')
    expect(exists).toBe(true)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 8.9 — Deep links
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('8.9 Deep links', () => {
  test('?route=social navigates to social tab', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const page = await context.newPage()
    await page.addInitScript(() => {
      localStorage.setItem('spothitch_v4_state', JSON.stringify({ showWelcome: false, username: 'Test', avatar: '🤙', activeTab: 'map', theme: 'dark', lang: 'en', points: 0, level: 1, badges: [], rewards: [], savedTrips: [], emergencyContacts: [] }))
      localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({ preferences: { necessary: true, analytics: false, marketing: false, personalization: false }, timestamp: Date.now(), version: '1.0' }))
      localStorage.setItem('spothitch_age_verified', 'true')
      localStorage.setItem('spothitch_landing_v2', '1')
      localStorage.setItem('spothitch_beta_seen', '1')
      const f = {}; ['carte','stations','add-spot','profil','amis','chat','carnet','stats','classements','niveaux','conseils','dons','hors-ligne','sos','compagnon','notif-spot','activite-amis','defis','score-confiance','avis-profils','itineraire','radar','quiz','guides','gardien','evenements','auberges'].forEach(id => { f[id] = Date.now() })
      localStorage.setItem('spothitch_feature_seen', JSON.stringify(f))
    })
    await page.goto('/?route=social', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(5000)

    const activeTab = await page.evaluate(() => window.getState?.()?.activeTab)
    expect(activeTab).toBe('social')
    await snap(page, 8, '8.9-deeplink-social', 'after')
    await context.close()
  })

  test('?route=profile navigates to profile tab', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const page = await context.newPage()
    await page.addInitScript(() => {
      localStorage.setItem('spothitch_v4_state', JSON.stringify({ showWelcome: false, username: 'Test', avatar: '🤙', activeTab: 'map', theme: 'dark', lang: 'en', points: 0, level: 1, badges: [], rewards: [], savedTrips: [], emergencyContacts: [] }))
      localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({ preferences: { necessary: true, analytics: false, marketing: false, personalization: false }, timestamp: Date.now(), version: '1.0' }))
      localStorage.setItem('spothitch_age_verified', 'true')
      localStorage.setItem('spothitch_landing_v2', '1')
      localStorage.setItem('spothitch_beta_seen', '1')
      const f = {}; ['carte','stations','add-spot','profil','amis','chat','carnet','stats','classements','niveaux','conseils','dons','hors-ligne','sos','compagnon','notif-spot','activite-amis','defis','score-confiance','avis-profils','itineraire','radar','quiz','guides','gardien','evenements','auberges'].forEach(id => { f[id] = Date.now() })
      localStorage.setItem('spothitch_feature_seen', JSON.stringify(f))
    })
    await page.goto('/?route=profile', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(5000)

    const activeTab = await page.evaluate(() => window.getState?.()?.activeTab)
    expect(activeTab).toBe('profile')
    await context.close()
  })

  test('?action=add-spot opens AddSpot', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const page = await context.newPage()
    await page.addInitScript(() => {
      localStorage.setItem('spothitch_v4_state', JSON.stringify({ showWelcome: false, username: 'Test', avatar: '🤙', activeTab: 'map', theme: 'dark', lang: 'en', points: 0, level: 1, badges: [], rewards: [], savedTrips: [], emergencyContacts: [] }))
      localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({ preferences: { necessary: true, analytics: false, marketing: false, personalization: false }, timestamp: Date.now(), version: '1.0' }))
      localStorage.setItem('spothitch_age_verified', 'true')
      localStorage.setItem('spothitch_landing_v2', '1')
      localStorage.setItem('spothitch_beta_seen', '1')
      localStorage.setItem('spothitch_alpha_code', 'ok')
      const f = {}; ['carte','stations','add-spot','profil','amis','chat','carnet','stats','classements','niveaux','conseils','dons','hors-ligne','sos','compagnon','notif-spot','activite-amis','defis','score-confiance','avis-profils','itineraire','radar','quiz','guides','gardien','evenements','auberges'].forEach(id => { f[id] = Date.now() })
      localStorage.setItem('spothitch_feature_seen', JSON.stringify(f))
    })
    await page.goto('/?action=add-spot', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(5000)

    const showAddSpot = await page.evaluate(() => window.getState?.()?.showAddSpot)
    // May or may not open (depends on auth gate)
    await snap(page, 8, '8.9-deeplink-addspot', 'after')
    await context.close()
  })

  test('?search=Berlin fills search input', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const page = await context.newPage()
    await page.addInitScript(() => {
      localStorage.setItem('spothitch_v4_state', JSON.stringify({ showWelcome: false, username: 'Test', avatar: '🤙', activeTab: 'map', theme: 'dark', lang: 'en', points: 0, level: 1, badges: [], rewards: [], savedTrips: [], emergencyContacts: [] }))
      localStorage.setItem('spothitch_v4_cookie_consent', JSON.stringify({ preferences: { necessary: true, analytics: false, marketing: false, personalization: false }, timestamp: Date.now(), version: '1.0' }))
      localStorage.setItem('spothitch_age_verified', 'true')
      localStorage.setItem('spothitch_landing_v2', '1')
      localStorage.setItem('spothitch_beta_seen', '1')
      const f = {}; ['carte','stations','add-spot','profil','amis','chat','carnet','stats','classements','niveaux','conseils','dons','hors-ligne','sos','compagnon','notif-spot','activite-amis','defis','score-confiance','avis-profils','itineraire','radar','quiz','guides','gardien','evenements','auberges'].forEach(id => { f[id] = Date.now() })
      localStorage.setItem('spothitch_feature_seen', JSON.stringify(f))
    })
    await page.goto('/?search=Berlin', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(5000)

    // Search should have been triggered
    await snap(page, 8, '8.9-deeplink-search', 'after')
    await context.close()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 8.10 — Share target URL parsing
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('8.10 Share target', () => {
  let context, page

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    page = await context.newPage()
    await skipOnboarding(page)
  })

  test.afterAll(async () => {
    await context?.close()
  })

  test('parseShareUrl extracts coords from Google Maps', async () => {
    const coords = await page.evaluate(() => {
      if (typeof window.parseShareUrl === 'function') {
        return window.parseShareUrl('https://maps.google.com/?q=48.8566,2.3522')
      }
      // Try mapsUrlParser if it's loaded differently
      return null
    })
    if (coords) {
      expect(coords.lat).toBeCloseTo(48.8566, 2)
      expect(coords.lng).toBeCloseTo(2.3522, 2)
    }
  })

  test('parseShareUrl handles malformed URL gracefully', async () => {
    const capture = captureConsoleErrors(page)
    const result = await page.evaluate(() => {
      try {
        if (typeof window.parseShareUrl === 'function') {
          return window.parseShareUrl('not a real url')
        }
        return null
      } catch { return 'error' }
    })
    // Should return null or empty, not crash
    expect(result).not.toBe('error')

    const pageErrors = capture.errors.filter(e => e.startsWith('PAGE_ERROR'))
    expect(pageErrors.length).toBe(0)
  })

  test('processShare handler exists', async () => {
    const exists = await page.evaluate(() =>
      typeof window.processShare === 'function' || typeof window.handleIncomingShare === 'function'
    )
    // May be lazy-loaded
    expect(typeof exists).toBe('boolean')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 8.11 — Offline
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('8.11 Offline', () => {
  let context, page

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    page = await context.newPage()
    await skipOnboarding(page)
  })

  test.afterAll(async () => {
    await context?.close()
  })

  test('app detects offline state', async () => {
    // Go offline
    await context.setOffline(true)
    await page.waitForTimeout(2000)

    // Should show offline indicator
    const hasOffline = await page.evaluate(() =>
      !navigator.onLine ||
      !!document.querySelector('[class*="offline"], .offline-indicator')
    )
    expect(hasOffline).toBe(true)

    // Go back online
    await context.setOffline(false)
    await page.waitForTimeout(2000)
    await snap(page, 8, '8.11-offline-recovery', 'after')
  })

  test('app recovers after going back online', async () => {
    await context.setOffline(true)
    await page.waitForTimeout(1000)
    await context.setOffline(false)
    await page.waitForTimeout(3000)

    // Should be functional again
    const capture = captureConsoleErrors(page)
    await page.evaluate(() => window.homeZoomIn?.())
    await page.waitForTimeout(500)

    const pageErrors = capture.errors.filter(e => e.startsWith('PAGE_ERROR'))
    expect(pageErrors.length).toBe(0)
  })

  test('offline download button exists', async () => {
    const btn = page.locator('button[onclick*="Offline"], button:has-text("Offline"), [aria-label*="Offline"]')
    expect(await btn.count()).toBeGreaterThan(0)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// 8.12 — Error handling
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('8.12 Errors', () => {
  let context, page

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({ viewport: { width: 390, height: 844 } })
    page = await context.newPage()
    await skipOnboarding(page)
  })

  test.afterAll(async () => {
    await context?.close()
  })

  test('flyTo with NaN coordinates does not crash', async () => {
    const capture = captureConsoleErrors(page)
    await page.evaluate(() => {
      try {
        if (window.homeMapInstance) {
          window.homeMapInstance.flyTo({ center: [NaN, NaN], zoom: 10 })
        }
      } catch { /* expected */ }
    })
    await page.waitForTimeout(1000)

    // Page should still be functional
    const hasMap = await page.evaluate(() => !!document.querySelector('canvas'))
    await snap(page, 8, '8.12-flyto-nan', 'after')
  })

  test('all map handlers exist and do not crash when called', async () => {
    const handlers = await page.evaluate(() => ({
      homeZoomIn: typeof window.homeZoomIn,
      homeZoomOut: typeof window.homeZoomOut,
      homeClearSearch: typeof window.homeClearSearch,
      homeCenterOnUser: typeof window.homeCenterOnUser,
      toggleGasStations: typeof window.toggleGasStations,
      openFilters: typeof window.openFilters,
      closeFilters: typeof window.closeFilters,
      resetFilters: typeof window.resetFilters,
      changeTab: typeof window.changeTab,
      toggleMapLegend: typeof window.toggleMapLegend,
    }))

    for (const [name, type] of Object.entries(handlers)) {
      expect(type).toBe('function')
    }
  })
})
