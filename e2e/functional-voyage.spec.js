/**
 * Functional E2E Tests — VOYAGE, JOURNAL & GUIDES
 * REAL tests: navigate, verify content, batch handler checks
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

async function setupVoyage(page) {
  await setup(page)
  await page.evaluate(() => window.changeTab?.('voyage'))
  await page.waitForTimeout(2000)
}

test.describe('Voyage — Fonctionnel', () => {
  test('Onglet voyage charge avec contenu', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => window.getState?.()?.activeTab)).toBe('voyage')
    expect(await page.evaluate(() => (document.getElementById('app')?.innerText || '').length)).toBeGreaterThan(50)
  })

  test('Sous-onglets fonctionnent', async ({ page }) => {
    await setupVoyage(page)
    for (const sub of ['voyage', 'guides', 'journal']) {
      await page.evaluate((s) => window.setVoyageSubTab?.(s), sub)
      await page.waitForTimeout(500)
      expect(await page.evaluate(() => window.getState?.()?.voyageSubTab)).toBe(sub)
    }
  })

  test('Tous les 18 handlers trip planner existent', async ({ page }) => {
    await setupVoyage(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'calculateTrip', 'clearTripResults', 'saveTripWithSpots', 'loadSavedTrip',
      'deleteSavedTrip', 'renameSavedTrip', 'swapTripPoints', 'viewTripOnMap',
      'closeTripMap', 'syncTripFieldsAndCalculate', 'toggleTripGasStations',
      'centerTripMapOnGps', 'setRouteFilter', 'tripExpandForm', 'tripCollapseForm',
      'tripFitBounds', 'tripSheetCycleState', 'tripMapShowSpot',
    ])
    expect(missing).toEqual([])
  })

  test('Handlers voyage de base existent', async ({ page }) => {
    await setupVoyage(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'startTrip', 'finishTrip', 'tripNextStop', 'toggleTripPublic',
      'openTripDetail', 'closeTripDetail', 'deleteJournalTrip',
      'openEditTrip', 'closeEditTrip', 'submitEditTrip',
    ])
    expect(missing).toEqual([])
  })
})

test.describe('Journal — Fonctionnel', () => {
  test('Tous les 24 handlers journal existent', async ({ page }) => {
    await setupVoyage(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'journalNewTrip', 'journalCreateTrip', 'journalOpenTrip', 'journalAddLeg',
      'journalSaveLeg', 'journalEndTrip', 'journalTogglePublic',
      'journalExportTrip', 'journalShareTrip', 'journalCopyLink',
      'journalAddDayPhoto', 'journalDeleteDayPhoto',
      'journalEditExpenses', 'journalSaveExpenses',
      'journalEditDayNote', 'journalSaveDayNote',
      'journalPickSpot', 'journalSelectTransport',
      'journalUseMyPosition', 'journalBack', 'journalShowStats',
      'journalToggleExpenses', 'journalSelectSpotFromMap', 'journalClearSpot',
    ])
    expect(missing).toEqual([])
  })
})

test.describe('Guides — Fonctionnel', () => {
  test('showGuides navigue vers les guides', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.showGuides?.())
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.activeTab)).toBe('voyage')
  })

  test('showCountryDetail FR sélectionne la France', async ({ page }) => {
    await setupVoyage(page)
    await page.evaluate(() => window.showCountryDetail?.('FR'))
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => window.getState?.()?.selectedCountryCode)).toBe('FR')
  })

  test('Tous les 15 handlers guides existent', async ({ page }) => {
    await setupVoyage(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'showGuides', 'showCountryDetail', 'showSafetyPage',
      'selectGuide', 'filterGuides', 'setGuideActiveSection', 'setGuideFilterType',
      'openGuideCategory', 'setGuideRating', 'submitGuideContribution',
      'reportGuideError', 'submitGuideSuggestion',
      'submitCommunityTip', 'voteCommunityTip', 'voteGuideTip',
    ])
    expect(missing).toEqual([])
  })

  test('Guide nudge handlers existent', async ({ page }) => {
    await setup(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'closeGuideNudge', 'acceptGuideNudge', 'dismissGuideNudgeForCountry', 'dismissGuideNudgeGlobal',
    ])
    expect(missing).toEqual([])
  })
})
