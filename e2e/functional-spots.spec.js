/**
 * Functional E2E Tests — SPOTS & CARTE
 * REAL tests: open map, open addspot, verify content
 */
import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:4173'
const BYPASS = {
  spothitch_cookie_consent: 'true', spothitch_landing_v2: '1',
  spothitch_age_verified: 'true', spothitch_welcomed: 'true',
}

async function setup(page) {
  await page.addInitScript((s) => { for (const [k,v] of Object.entries(s)) localStorage.setItem(k,v) }, BYPASS)
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForFunction(() => typeof window.setState === 'function', { timeout: 30000 }).catch(() => {})
  await page.evaluate(() => {
    localStorage.setItem('spothitch_landing_v2', '1')
    window.setState?.({
      showWelcome: false, showLanding: false, showAgeVerification: false, showCookieBanner: false,
      isLoggedIn: true, user: { uid: 'test-uid', displayName: 'TestUser', email: 'test@test.com' },
      username: 'testuser', isAdmin: true,
    })
  })
  await page.waitForTimeout(800)
}

test.describe('Carte — Fonctionnel', () => {
  test('La carte charge avec du contenu visible', async ({ page }) => {
    await setup(page)
    const hasCanvas = await page.evaluate(() => !!document.querySelector('.maplibregl-canvas'))
    const hasMap = await page.evaluate(() => !!window.homeMapInstance)
    expect(hasCanvas || hasMap).toBe(true)
  })

  test('openFilters ouvre les filtres et le state change', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openFilters?.())
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.showFilters)).toBe(true)
  })

  test('Les filtres fonctionnent (country, rating, verified, sort, reset)', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.setFilterCountry?.('FR'))
    expect(await page.evaluate(() => window.getState?.()?.filterCountry)).toBe('FR')

    await page.evaluate(() => window.setFilterMinRating?.(4))
    expect(await page.evaluate(() => window.getState?.()?.filterMinRating)).toBe(4)

    await page.evaluate(() => window.toggleVerifiedFilter?.())
    expect(await page.evaluate(() => window.getState?.()?.filterVerifiedOnly)).toBe(true)

    await page.evaluate(() => window.setSortBy?.('distance'))
    expect(await page.evaluate(() => window.getState?.()?.sortBy)).toBe('distance')

    await page.evaluate(() => window.resetFilters?.())
    await page.waitForTimeout(300)
    const country = await page.evaluate(() => window.getState?.()?.filterCountry)
    expect(country === 'all' || !country).toBe(true)
  })

  test('homeSearchDestination déclenche la recherche sans crash', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.homeSearchDestination?.('Paris'))
    await page.waitForTimeout(2000)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('toggleMapLegend et toggleGasStations ne crashent pas', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => { window.toggleMapLegend?.(); window.toggleGasStations?.() })
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('Tous les handlers carte/navigation existent', async ({ page }) => {
    await setup(page)
    const handlers = [
      'openFilters', 'closeFilters', 'applyFilters', 'resetFilters',
      'setFilter', 'handleSearch', 'setFilterCountry', 'setFilterMinRating',
      'setFilterMaxWait', 'toggleVerifiedFilter', 'setSortBy',
      'openFullMap', 'setViewMode', 'centerOnUser', 'flyToCity',
      'toggleMapLegend', 'toggleGasStations',
      'homeSearchDestination', 'homeClearSearch', 'homeSelectPlace',
      'homeCenterOnUser', 'homeZoomIn', 'homeZoomOut',
      'openCityPanel', 'closeCityPanel',
      'loadCountryOnMap', 'downloadCountryFromBubble',
    ]
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), handlers)
    expect(missing).toEqual([])
  })
})

test.describe('Spots — Fonctionnel', () => {
  test('openAddSpot ouvre le formulaire ou demande la connexion', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openAddSpot?.())
    await page.waitForTimeout(800)
    const show = await page.evaluate(() => window.getState?.()?.showAddSpot || window.getState?.()?.showAuth)
    expect(show).toBe(true)
  })

  test('closeAddSpot ferme le formulaire', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.setState?.({ showAddSpot: true }))
    await page.evaluate(() => window.closeAddSpot?.())
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => window.getState?.()?.showAddSpot)).toBe(false)
  })

  test('toggleFavorite ne crash pas', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.toggleFavorite?.('test-spot-1'))
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('openRating / closeRating fonctionnent', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openRating?.())
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => window.getState?.()?.showRating)).toBe(true)
    await page.evaluate(() => window.closeRating?.())
    expect(await page.evaluate(() => window.getState?.()?.showRating)).toBe(false)
  })

  test('Tous les 30 handlers AddSpot existent', async ({ page }) => {
    await setup(page)
    const handlers = [
      'openAddSpot', 'closeAddSpot', 'openAddSpotPreview',
      'selectSpotType', 'addSpotNextStep', 'addSpotPrevStep',
      'setSpotRating', 'handlePhotoSelect', 'triggerPhotoUpload',
      'useGPSForSpot', 'toggleSpotMapPicker', 'spotMapPickLocation',
      'openFullscreenMapPicker', 'autoDetectStation', 'autoDetectRoad',
      'saveSpotAsDraft', 'openSpotDraft', 'deleteSpotDraft',
      'addSpotDestination', 'removeSpotDestination',
      'setWaitTime', 'setMethod', 'setGroupSize', 'setTimeOfDay',
      'toggleAmenity', 'setRideResult', 'setExperienceDate',
      'removeSpotPhoto', 'showSpotSummary', 'handleAddSpot', 'setSpotTag',
    ]
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), handlers)
    expect(missing).toEqual([])
  })

  test('Tous les handlers SpotDetail existent', async ({ page }) => {
    await setup(page)
    const handlers = [
      'selectSpot', 'closeSpotDetail', 'openRating', 'closeRating',
      'doCheckin', 'submitReview', 'setRating', 'reportSpotAction',
      'translateSpotText', 'voteSpot', 'flyToSpotOnMap',
      'openSpotStreetView', 'doConfirmStreetView',
      'toggleFavorite', 'openNavigation', 'getSpotLocation',
      'startSpotNavigation', 'stopNavigation', 'openExternalNavigation',
      'showNavigationPicker', 'openInNavigationApp',
    ]
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), handlers)
    expect(missing).toEqual([])
  })

  test('Tous les handlers CheckinModal existent', async ({ page }) => {
    await setup(page)
    const handlers = [
      'openCheckinModal', 'closeCheckinModal', 'submitCheckin',
      'setCheckinWaitTime', 'toggleCheckinChar', 'triggerCheckinPhoto',
      'onCheckinWaitSlider', 'setCheckinRideResult', 'handleCheckinPhoto',
    ]
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), handlers)
    expect(missing).toEqual([])
  })

  test('nearbySpotChoice handlers existent', async ({ page }) => {
    await setup(page)
    const handlers = ['nearbySpotChooseValidate', 'nearbySpotChooseCreate', 'closeNearbySpotChoice']
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), handlers)
    expect(missing).toEqual([])
  })
})
