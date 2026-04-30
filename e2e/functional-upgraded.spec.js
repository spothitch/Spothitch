/**
 * Phase 2: Upgraded functional tests
 * Each test verifies REAL state/DOM changes, not just "no crash"
 */
import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:4173'
const BYPASS = {
  spothitch_cookie_consent: 'true', spothitch_landing_v2: '1',
  spothitch_age_verified: 'true', spothitch_welcomed: 'true', spothitch_sos_intro_seen: '1',
}

async function setup(page, opts = {}) {
  await page.addInitScript((s) => { for (const [k,v] of Object.entries(s)) localStorage.setItem(k,v) }, BYPASS)
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForFunction(() => typeof window.setState === 'function', { timeout: 30000 }).catch(() => {})
  await page.evaluate((o) => {
    localStorage.setItem('spothitch_landing_v2', '1')
    window.setState?.({
      showWelcome: false, showLanding: false, showAgeVerification: false, showCookieBanner: false,
      isLoggedIn: o.loggedIn !== false,
      user: o.loggedIn !== false ? { uid: 'test-uid', displayName: 'TestUser', email: 'test@test.com' } : null,
      username: 'testuser', isAdmin: true,
      emergencyContacts: [{ name: 'Contact1', phone: '+33600000000' }],
      friends: [{ id: 'f1', name: 'Alice', avatar: 'thumbs-up' }],
    })
  }, opts)
  await page.waitForTimeout(800)
}

// ==================== G1: CLOSE → verify state reset ====================

test.describe('Close handlers — real state verification', () => {
  const closeTests = [
    ['closeFavoritesOnMap', { showFavoritesOnMap: true, filterFavorites: true }, { showFavoritesOnMap: false, filterFavorites: false }],
    ['closeReviewForm', { showReviewForm: true, reviewSpotId: 42 }, { showReviewForm: false }],
    ['closeLanguageSelector', { showLanguageSelector: true }, { showLanguageSelector: false }],
    ['closeSideMenu', { showSideMenu: true }, { showSideMenu: false }],
    ['closeSafety', { showSafety: true }, { showSafety: false }],
    ['closeLegal', { showLegal: true }, { showLegal: false }],
    ['closeNearbyFriends', { showNearbyFriends: true }, { showNearbyFriends: false }],
    ['closeTripHistory', { showTripHistory: true }, { showTripHistory: false }],
    ['closeGuidesOverlay', { showGuidesOverlay: true }, { showGuidesOverlay: false }],
    ['closeDangerReportModal', { showDangerReport: true }, { showDangerReport: false }],
  ]

  for (const [handler, setBefore, verifyAfter] of closeTests) {
    test(`${handler} resets state correctly`, async ({ page }) => {
      await setup(page)
      await page.evaluate(({ s }) => window.setState?.(s), { s: setBefore })
      await page.waitForTimeout(200)
      await page.evaluate((h) => window[h]?.(), handler)
      await page.waitForTimeout(300)
      for (const [key, expectedVal] of Object.entries(verifyAfter)) {
        const actual = await page.evaluate(({ k }) => window.getState?.()?.[k], { k: key })
        expect(actual).toBe(expectedVal)
      }
    })
  }
})

// ==================== G2: OPEN/SHOW → verify state set ====================

test.describe('Open handlers — verify state is set', () => {
  test('openFilters sets showFilters=true', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openFilters?.())
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => window.getState?.()?.showFilters)).toBe(true)
  })

  test('openSOS sets showSOS=true', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openSOS?.())
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => window.getState?.()?.showSOS)).toBe(true)
  })

  test('openDeleteAccount sets showDeleteAccount=true', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.changeTab?.('profile'))
    await page.waitForTimeout(1500)
    await page.evaluate(() => window.openDeleteAccount?.())
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => window.getState?.()?.showDeleteAccount)).toBe(true)
  })

  test('openAdminPanel sets showAdminPanel=true', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openAdminPanel?.())
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => window.getState?.()?.showAdminPanel)).toBe(true)
  })

  test('openContactForm sets showContactForm=true', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openContactForm?.())
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => window.getState?.()?.showContactForm)).toBe(true)
  })
})

// ==================== G3: TOGGLE → verify state flips ====================

test.describe('Toggle handlers — verify state flips', () => {
  test('toggleVerifiedFilter flips filterVerifiedOnly', async ({ page }) => {
    await setup(page)
    const before = await page.evaluate(() => window.getState?.()?.filterVerifiedOnly)
    await page.evaluate(() => window.toggleVerifiedFilter?.())
    await page.waitForTimeout(200)
    const after = await page.evaluate(() => window.getState?.()?.filterVerifiedOnly)
    expect(after).toBe(!before)
  })
})

// ==================== G4: SET/UPDATE → verify state value ====================

test.describe('Set handlers — verify value in state', () => {
  test('setFilterCountry sets filterCountry', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.setFilterCountry?.('FR'))
    await page.waitForTimeout(200)
    expect(await page.evaluate(() => window.getState?.()?.filterCountry)).toBe('FR')
  })

  test('setFilterMinRating sets filterMinRating', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.setFilterMinRating?.(4))
    await page.waitForTimeout(200)
    expect(await page.evaluate(() => window.getState?.()?.filterMinRating)).toBe(4)
  })

  test('setSortBy sets sortBy', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.setSortBy?.('rating'))
    await page.waitForTimeout(200)
    expect(await page.evaluate(() => window.getState?.()?.sortBy)).toBe('rating')
  })

  test('setAdminTab sets adminTab', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openAdminPanel?.())
    await page.waitForTimeout(500)
    await page.evaluate(() => window.setAdminTab?.('spots'))
    await page.waitForTimeout(200)
    expect(await page.evaluate(() => window.getState?.()?.adminTab)).toBe('spots')
  })
})

// ==================== G5: NAVIGATION → verify tab change ====================

test.describe('Navigation — verify tab changes', () => {
  test('changeTab to profile', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.changeTab?.('profile'))
    await page.waitForTimeout(1500)
    expect(await page.evaluate(() => window.getState?.()?.activeTab)).toBe('profile')
    // Verify DOM has profile content
    const text = await page.evaluate(() => document.getElementById('app')?.innerText || '')
    expect(text.length).toBeGreaterThan(50)
  })

  test('changeTab to social', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.changeTab?.('social'))
    await page.waitForTimeout(1500)
    expect(await page.evaluate(() => window.getState?.()?.activeTab)).toBe('social')
  })

  test('changeTab to voyage', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.changeTab?.('voyage'))
    await page.waitForTimeout(1500)
    expect(await page.evaluate(() => window.getState?.()?.activeTab)).toBe('voyage')
  })

  test('setVoyageSubTab switches sub-tab', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.changeTab?.('voyage'))
    await page.waitForTimeout(1500)
    await page.evaluate(() => window.setVoyageSubTab?.('journal'))
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.voyageSubTab)).toBe('journal')
  })

  test('setProfileSubTab switches sub-tab', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.changeTab?.('profile'))
    await page.waitForTimeout(1500)
    await page.evaluate(() => window.setProfileSubTab?.('reglages'))
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.profileSubTab)).toBe('reglages')
  })

  test('setSocialTab switches social sub-tab', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.changeTab?.('social'))
    await page.waitForTimeout(1500)
    await page.evaluate(() => window.setSocialTab?.('friends'))
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.socialTab)).toBe('friends')
  })
})

// ==================== G6: COMBINED open+close ====================

test.describe('Open then close — full cycle', () => {
  const cycles = [
    ['openFilters', 'closeFilters', 'showFilters'],
    ['openDeleteAccount', 'closeDeleteAccount', 'showDeleteAccount'],
    ['openContactForm', 'closeContactForm', 'showContactForm'],
    ['openSOS', 'closeSOS', 'showSOS'],
  ]

  for (const [open, close, stateKey] of cycles) {
    test(`${open} → ${close} full cycle`, async ({ page }) => {
      await setup(page)
      // Some handlers need profile tab
      if (open === 'openDeleteAccount') {
        await page.evaluate(() => window.changeTab?.('profile'))
        await page.waitForTimeout(1500)
      }
      await page.evaluate((h) => window[h]?.(), open)
      await page.waitForTimeout(500)
      expect(await page.evaluate(({ k }) => window.getState?.()?.[k], { k: stateKey })).toBe(true)
      await page.evaluate((h) => window[h]?.(), close)
      await page.waitForTimeout(300)
      expect(await page.evaluate(({ k }) => window.getState?.()?.[k], { k: stateKey })).toBe(false)
    })
  }
})
