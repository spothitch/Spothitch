/**
 * Functional E2E Tests — PROFIL, ADMIN, LEGAL, OFFLINE, DIVERS
 * REAL tests: navigate to tabs, verify content, batch handler checks
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
  await page.waitForFunction(() => typeof window.setState === 'function', { timeout: 45000 }).catch(() => {})
  await page.evaluate(() => {
    localStorage.setItem('spothitch_landing_v2', '1')
    window.setState?.({
      showWelcome: false, showLanding: false, showAgeVerification: false, showCookieBanner: false,
      isLoggedIn: true, user: { uid: 'test-uid', displayName: 'TestUser', email: 'antoine.v.ville@gmail.com' },
      username: 'testuser', isAdmin: true,
    })
  })
  await page.waitForTimeout(2000)
}

async function setupProfile(page) {
  await setup(page)
  await page.evaluate(() => window.changeTab?.('profile'))
  await page.waitForTimeout(2000)
}

// ==================== PROFIL ====================

test.describe('Profil — Fonctionnel', () => {
  test('Profile tab charge avec contenu', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => window.getState?.()?.activeTab)).toBe('profile')
    expect(await page.evaluate(() => (document.getElementById('app')?.innerText || '').length)).toBeGreaterThan(50)
  })

  test('Sous-onglets profil fonctionnent', async ({ page }) => {
    await setupProfile(page)
    await page.evaluate(() => window.setProfileSubTab?.('reglages'))
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.profileSubTab)).toBe('reglages')
  })

  test('openDeleteAccount ouvre et closeDeleteAccount ferme', async ({ page }) => {
    await setupProfile(page)
    await page.evaluate(() => window.openDeleteAccount?.())
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => window.getState?.()?.showDeleteAccount)).toBe(true)
    await page.evaluate(() => window.closeDeleteAccount?.())
    expect(await page.evaluate(() => window.getState?.()?.showDeleteAccount)).toBe(false)
  })

  test('Tous les 30 handlers profil existent après navigation', async ({ page }) => {
    await setupProfile(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'editBio', 'saveBio', 'editLanguages', 'editSocialLinks',
      'uploadProfilePhoto', 'removeProfilePhoto', 'selectProfilePhoto',
      'saveProfileEdits', 'setMainProfilePhoto', 'addProfilePhoto',
      'openChangePassword', 'openChangeEmail', 'openChangeUsername', 'openEditName',
      'openPhotoManager', 'openExportData', 'openAppealForm', 'openEditPersonalInfo',
      'sortMySpots', 'openMySpots', 'openMyValidations', 'openMyCountries',
      'closeProfileDetail', 'togglePrivacy', 'toggleNotifications', 'togglePushNotifications',
      'openDeleteAccount', 'closeDeleteAccount', 'requestAccountDeletion',
      'shareMyProfile', 'openAddPastTrip',
    ])
    expect(missing).toEqual([])
  })

  test('Handlers review profil existent', async ({ page }) => {
    await setupProfile(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'openWriteReview', 'cancelWriteReview', 'submitProfileReview', 'loadMyProfileReviews',
    ])
    expect(missing).toEqual([])
  })

  test('Handlers langue picker existent', async ({ page }) => {
    await setupProfile(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'closeLanguagePicker', 'langPickerFilter', 'selectLanguageFromPicker',
      'selectLanguageLevel', 'closeLanguageLevelPicker', 'removeLanguage', 'cycleLanguageLevel',
    ])
    expect(missing).toEqual([])
  })

  test('Handlers settings sections existent', async ({ page }) => {
    await setupProfile(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'toggleSettingsSection', 'toggleAccessibility', 'setThemeMode',
    ])
    expect(missing).toEqual([])
  })
})

// ==================== ADMIN ====================

test.describe('Admin — Fonctionnel', () => {
  test('openAdminPanel ouvre, closeAdminPanel ferme', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openAdminPanel?.())
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.showAdminPanel)).toBe(true)
    await page.evaluate(() => window.closeAdminPanel?.())
    expect(await page.evaluate(() => window.getState?.()?.showAdminPanel)).toBe(false)
  })

  test('Tous les 15 handlers admin existent', async ({ page }) => {
    await setup(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'openAdminPanel', 'closeAdminPanel', 'setAdminTab',
      'loadAdminFeedback', 'setAdminFeedbackPeriod', 'exportFeedbackCSV',
      'loadAdminReports', 'adminConfirmReport', 'adminDismissReport',
      'adminRelocateSpot', 'setAdminReportFilter', 'setAdminReportStatusFilter',
      'adminViewSpot', 'loadAdminSentry',
      'loadAdminGuideTips', 'adminApproveGuideTipAction', 'adminRejectGuideTipAction',
      'loadAdminIdVerifications', 'adminApproveIdVerification', 'adminRejectIdVerification',
    ])
    expect(missing).toEqual([])
  })
})

// ==================== LEGAL ====================

test.describe('Legal — Fonctionnel', () => {
  test('showLegalPage privacy affiche du contenu', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.showLegalPage?.('privacy'))
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => document.body.innerText.length)).toBeGreaterThan(200)
  })

  test('openMyData ouvre, closeMyData ferme', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openMyData?.())
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => window.getState?.()?.showMyData)).toBe(true)
    await page.evaluate(() => window.closeMyData?.())
    expect(await page.evaluate(() => window.getState?.()?.showMyData)).toBe(false)
  })

  test('Handlers legal/cookies existent', async ({ page }) => {
    await setup(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'showLegalPage', 'closeLegal', 'openMyData', 'closeMyData', 'downloadMyData',
      'openConsentSettings', 'acceptAllCookies', 'refuseOptionalCookies',
      'showCookieCustomize', 'hideCookieCustomize', 'saveCustomCookiePreferences',
    ])
    expect(missing).toEqual([])
  })
})

// ==================== OFFLINE ====================

test.describe('Offline — Fonctionnel', () => {
  test('Handlers offline existent', async ({ page }) => {
    await setup(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'downloadCountryOffline', 'deleteOfflineCountry', 'downloadCountryForOffline',
      'getOfflineStorageInfo', 'clearAllOfflineData', 'toggleAutoOfflineDownload',
      'openOfflinePanel', 'closeOfflinePanel',
    ])
    expect(missing).toEqual([])
  })
})

// ==================== PWA & INSTALL ====================

test.describe('PWA — Fonctionnel', () => {
  test('Handlers PWA existent', async ({ page }) => {
    await setup(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'showInstallBanner', 'dismissInstallBanner', 'installPWA',
    ])
    expect(missing).toEqual([])
  })
})

// ==================== SHARING ====================

test.describe('Sharing — Fonctionnel', () => {
  test('Handlers partage existent', async ({ page }) => {
    await setup(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'shareSpot', 'shareBadge', 'shareStats', 'shareApp', 'shareMyProfile',
      'copyFriendLink', 'openShareCard', 'shareLink', 'generateShareUrl',
    ])
    expect(missing).toEqual([])
  })
})

// ==================== AMBASSADEURS ====================

test.describe('Ambassadeurs — Fonctionnel', () => {
  test('Handlers ambassadeurs existent', async ({ page }) => {
    await setup(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'registerAmbassador', 'searchAmbassadors', 'contactAmbassador',
      'unregisterAmbassador', 'updateAmbassadorAvailability',
      'searchAmbassadorsByCity', 'sendAmbassadorMessage',
    ])
    expect(missing).toEqual([])
  })
})

// ==================== IDENTITY VERIFICATION ====================

test.describe('Identity — Fonctionnel', () => {
  test('openIdentityVerification ouvre, close ferme', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openIdentityVerification?.())
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.showIdentityVerification)).toBe(true)
    await page.evaluate(() => window.closeIdentityVerification?.())
    expect(await page.evaluate(() => window.getState?.()?.showIdentityVerification)).toBe(false)
  })

  test('Handlers identity existent', async ({ page }) => {
    await setup(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'openIdentityVerification', 'closeIdentityVerification',
      'startIdentityVerification', 'startVerificationStep',
      'submitVerificationPhotos', 'getTrustLevel', 'getTrustBadge', 'getUserTrustScore',
      'showTrustDetails', 'showIdentityVerification',
    ])
    expect(missing).toEqual([])
  })
})

// ==================== FAQ ====================

test.describe('FAQ — Fonctionnel', () => {
  test('openFAQ ne crash pas', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openFAQ?.())
    await page.waitForTimeout(500)
    const state = await page.evaluate(() => window.getState?.())
    expect(state?.showFAQ).toBe(true)
  })

  test('Handlers FAQ existent', async ({ page }) => {
    await setup(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'openFAQ', 'closeFAQ', 'toggleFAQItem', 'scrollToFAQCategory',
      'filterFAQ', 'clearFAQSearch', 'searchFAQ', 'getFAQQuestionById',
    ])
    expect(missing).toEqual([])
  })
})

// ==================== DIVERS ====================

test.describe('Divers — Fonctionnel', () => {
  test('showToast affiche un toast visible', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.showToast?.('Test OK', 'success'))
    await page.waitForTimeout(300)
    const toast = await page.evaluate(() => {
      const el = document.querySelector('[class*="toast"]')
      return el ? el.textContent : ''
    })
    expect(toast).toContain('Test OK')
  })

  test('Handlers navigation existent', async ({ page }) => {
    await setup(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'changeTab', 'goBack', 'openFullMap', 'setViewMode', 'flyToCity',
      'openProfile', 'openEditProfile', 'planTrip', 'clearTrip',
      'openGuides', 'openChallengesHub', 'centerOnUser',
      'srAnnounce', 'showAccessibilityHelp', 'closeAccessibilityHelp',
    ])
    expect(missing).toEqual([])
  })

  test('Handlers loading/animations existent', async ({ page }) => {
    await setup(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'showLoading', 'hideLoading', 'setLoadingMessage', 'setLoadingProgress',
      'isLoading', 'withLoading',
      'showSuccessAnimation', 'showErrorAnimation',
      'launchConfetti', 'launchConfettiBurst', 'playSound',
    ])
    expect(missing).toEqual([])
  })

  test('Handlers location/proximity existent', async ({ page }) => {
    await setup(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'acceptLocationPermission', 'declineLocationPermission', 'closeLocationPermission',
      'quickValidateSpot', 'quickReportSpot', 'dismissProximityAlert', 'initProximityNotify',
      'toggleNearbyFriends', 'openNearbyFriends', 'closeNearbyFriends',
      'setNotificationRadius', 'toggleNearbyFriendsList', 'closeNearbyFriendsList',
      'toggleLocationSharing', 'showFriendOnMap',
      'toggleProximityAlerts', 'setProximityRadius',
    ])
    expect(missing).toEqual([])
  })

  test('Handlers navigation apps existent', async ({ page }) => {
    await setup(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'startSpotNavigation', 'stopNavigation', 'openExternalNavigation',
      'showNavigationPicker', 'openInNavigationApp',
      'selectNavigationApp', 'closeNavigationPicker',
    ])
    expect(missing).toEqual([])
  })

  test('Handlers divers existent', async ({ page }) => {
    await setup(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'resetApp', 'compressImage', 'generateThumbnail', 'validateImage',
      'loadModal', 'preloadModals', 'clearFormDraft',
      'openContactForm', 'closeContactForm', 'submitContactForm',
      'openBugReport', 'openChangelog', 'openRoadmap', 'openHelpCenter',
      'showFeatureIntro', 'closeFeatureIntro',
      'openFeedbackPanel', 'closeFeedbackPanel', 'setFeedbackTab',
      'openFeedbackDetail', 'closeFeedbackDetail', 'submitFeedback',
      'openCityPanel', 'closeCityPanel', 'selectCityRoute', 'viewCitySpotsOnMap',
      'loadCountryOnMap', 'downloadCountryFromBubble',
      'nearbySpotChooseCreate', 'nearbySpotChooseValidate', 'closeNearbySpotChoice',
      'submitIntroVote', 'selectIntroVote',
    ])
    expect(missing).toEqual([])
  })

  test('Handlers landing existent', async ({ page }) => {
    await setup(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'dismissLanding', 'installFromLanding', 'installPWAFromLanding',
      'landingNext', 'skipToLandingAuth', 'closeLanding', 'changeLandingLanguage',
      'validateAlphaCode',
    ])
    expect(missing).toEqual([])
  })

  test('Handlers feature slides existent', async ({ page }) => {
    await setup(page)
    const missing = await page.evaluate((hs) => hs.filter(h => typeof window[h] !== 'function'), [
      'openFeatureSlides', 'closeFeatureSlides',
      'featureSlidesNext', 'featureSlidesPrev',
      'openFeedbackOnFeature', 'selectFeatureOpinion', 'submitFeatureOpinion',
      'featureIntroCTA', 'featureIntroBetaCTA',
    ])
    expect(missing).toEqual([])
  })
})
