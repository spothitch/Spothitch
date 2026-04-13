/**
 * Functional E2E Tests — VOYAGE, JOURNAL & GUIDES
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
  await page.waitForTimeout(1500)
}

// ==================== VOYAGE ====================

test.describe('Voyage — Fonctionnel', () => {
  test('setVoyageSubTab voyage affiche le planificateur', async ({ page }) => {
    await setupVoyage(page)
    await page.evaluate(() => window.setVoyageSubTab?.('voyage'))
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.voyageSubTab)).toBe('voyage')
  })

  test('setVoyageSubTab guides affiche les guides', async ({ page }) => {
    await setupVoyage(page)
    await page.evaluate(() => window.setVoyageSubTab?.('guides'))
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.voyageSubTab)).toBe('guides')
  })

  test('setVoyageSubTab journal affiche le journal', async ({ page }) => {
    await setupVoyage(page)
    await page.evaluate(() => window.setVoyageSubTab?.('journal'))
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.voyageSubTab)).toBe('journal')
  })

  test('calculateTrip est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.calculateTrip === 'function')).toBe(true)
  })

  test('clearTripResults est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.clearTripResults === 'function')).toBe(true)
  })

  test('saveTripWithSpots est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.saveTripWithSpots === 'function')).toBe(true)
  })

  test('swapTripPoints est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.swapTripPoints === 'function')).toBe(true)
  })

  test('viewTripOnMap est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.viewTripOnMap === 'function')).toBe(true)
  })

  test('closeTripMap est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.closeTripMap === 'function')).toBe(true)
  })

  test('syncTripFieldsAndCalculate est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.syncTripFieldsAndCalculate === 'function')).toBe(true)
  })

  test('toggleTripGasStations est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.toggleTripGasStations === 'function')).toBe(true)
  })

  test('tripExpandForm est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.tripExpandForm === 'function')).toBe(true)
  })

  test('tripCollapseForm est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.tripCollapseForm === 'function')).toBe(true)
  })

  test('tripFitBounds est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.tripFitBounds === 'function')).toBe(true)
  })

  test('tripSheetCycleState est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.tripSheetCycleState === 'function')).toBe(true)
  })

  test('startTrip est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.startTrip === 'function')).toBe(true)
  })

  test('finishTrip est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.finishTrip === 'function')).toBe(true)
  })

  test('setRouteFilter est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.setRouteFilter === 'function')).toBe(true)
  })
})

// ==================== JOURNAL ====================

test.describe('Journal — Fonctionnel', () => {
  test('journalNewTrip est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.journalNewTrip === 'function')).toBe(true)
  })

  test('journalCreateTrip est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.journalCreateTrip === 'function')).toBe(true)
  })

  test('journalOpenTrip est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.journalOpenTrip === 'function')).toBe(true)
  })

  test('journalAddLeg est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.journalAddLeg === 'function')).toBe(true)
  })

  test('journalSaveLeg est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.journalSaveLeg === 'function')).toBe(true)
  })

  test('journalEndTrip est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.journalEndTrip === 'function')).toBe(true)
  })

  test('journalTogglePublic est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.journalTogglePublic === 'function')).toBe(true)
  })

  test('journalExportTrip est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.journalExportTrip === 'function')).toBe(true)
  })

  test('journalShareTrip est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.journalShareTrip === 'function')).toBe(true)
  })

  test('journalAddDayPhoto est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.journalAddDayPhoto === 'function')).toBe(true)
  })

  test('journalEditExpenses est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.journalEditExpenses === 'function')).toBe(true)
  })

  test('journalEditDayNote est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.journalEditDayNote === 'function')).toBe(true)
  })

  test('journalPickSpot est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.journalPickSpot === 'function')).toBe(true)
  })

  test('journalSelectTransport est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.journalSelectTransport === 'function')).toBe(true)
  })

  test('journalUseMyPosition est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.journalUseMyPosition === 'function')).toBe(true)
  })

  test('journalBack est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.journalBack === 'function')).toBe(true)
  })

  test('journalShowStats est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.journalShowStats === 'function')).toBe(true)
  })

  test('journalCopyLink est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.journalCopyLink === 'function')).toBe(true)
  })
})

// ==================== GUIDES ====================

test.describe('Guides — Fonctionnel', () => {
  test('showGuides navigue vers les guides', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.showGuides?.())
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.activeTab)).toBe('voyage')
  })

  test('showCountryDetail affiche un pays', async ({ page }) => {
    await setupVoyage(page)
    await page.evaluate(() => window.showCountryDetail?.('FR'))
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => window.getState?.()?.selectedCountryCode)).toBe('FR')
  })

  test('selectGuide est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.selectGuide === 'function')).toBe(true)
  })

  test('setGuideActiveSection est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.setGuideActiveSection === 'function')).toBe(true)
  })

  test('setGuideFilterType est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.setGuideFilterType === 'function')).toBe(true)
  })

  test('submitGuideContribution est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.submitGuideContribution === 'function')).toBe(true)
  })

  test('voteGuideTip est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.voteGuideTip === 'function')).toBe(true)
  })

  test('reportGuideError est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.reportGuideError === 'function')).toBe(true)
  })

  test('submitGuideSuggestion est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.submitGuideSuggestion === 'function')).toBe(true)
  })

  test('openGuideCategory est appelable', async ({ page }) => {
    await setupVoyage(page)
    expect(await page.evaluate(() => typeof window.openGuideCategory === 'function')).toBe(true)
  })

  test('submitCommunityTip est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.submitCommunityTip === 'function')).toBe(true)
  })

  test('voteCommunityTip est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.voteCommunityTip === 'function')).toBe(true)
  })
})
