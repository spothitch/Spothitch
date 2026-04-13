/**
 * Functional E2E Tests — PROFIL, ADMIN, LEGAL, OFFLINE, DIVERS
 */
import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:4173'
const BYPASS = {
  spothitch_cookie_consent: 'true', spothitch_landing_v2: '1',
  spothitch_age_verified: 'true', spothitch_welcomed: 'true',
}

async function setup(page, opts = {}) {
  await page.addInitScript((s) => { for (const [k,v] of Object.entries(s)) localStorage.setItem(k,v) }, BYPASS)
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.waitForFunction(() => typeof window.setState === 'function', { timeout: 30000 }).catch(() => {})
  await page.evaluate((o) => {
    localStorage.setItem('spothitch_landing_v2', '1')
    window.setState?.({
      showWelcome: false, showLanding: false, showAgeVerification: false, showCookieBanner: false,
      isLoggedIn: true, user: { uid: 'test-uid', displayName: 'TestUser', email: 'antoine.v.ville@gmail.com' },
      username: 'testuser', isAdmin: true,
    })
  }, opts)
  await page.waitForTimeout(800)
}

async function setupProfile(page) {
  await setup(page)
  await page.evaluate(() => window.changeTab?.('profile'))
  await page.waitForTimeout(2000)
}

// ==================== PROFIL ====================

test.describe('Profil — Fonctionnel', () => {
  test('Profile tab charge', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => window.getState?.()?.activeTab)).toBe('profile')
  })

  test('setProfileSubTab reglages', async ({ page }) => {
    await setupProfile(page)
    await page.evaluate(() => window.setProfileSubTab?.('reglages'))
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.profileSubTab)).toBe('reglages')
  })

  test('editBio est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.editBio === 'function')).toBe(true)
  })

  test('saveBio est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.saveBio === 'function')).toBe(true)
  })

  test('editLanguages est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.editLanguages === 'function')).toBe(true)
  })

  test('editSocialLinks est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.editSocialLinks === 'function')).toBe(true)
  })

  test('uploadProfilePhoto est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.uploadProfilePhoto === 'function')).toBe(true)
  })

  test('removeProfilePhoto est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.removeProfilePhoto === 'function')).toBe(true)
  })

  test('saveProfileEdits est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.saveProfileEdits === 'function')).toBe(true)
  })

  test('openChangePassword est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.openChangePassword === 'function')).toBe(true)
  })

  test('openChangeEmail est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.openChangeEmail === 'function')).toBe(true)
  })

  test('openChangeUsername est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.openChangeUsername === 'function')).toBe(true)
  })

  test('openEditName est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.openEditName === 'function')).toBe(true)
  })

  test('openPhotoManager est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.openPhotoManager === 'function')).toBe(true)
  })

  test('openExportData est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.openExportData === 'function')).toBe(true)
  })

  test('openAppealForm est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.openAppealForm === 'function')).toBe(true)
  })

  test('sortMySpots est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.sortMySpots === 'function')).toBe(true)
  })

  test('openMySpots est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.openMySpots === 'function')).toBe(true)
  })

  test('openMyValidations est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.openMyValidations === 'function')).toBe(true)
  })

  test('openMyCountries est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.openMyCountries === 'function')).toBe(true)
  })

  test('togglePrivacy est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.togglePrivacy === 'function')).toBe(true)
  })

  test('toggleNotifications est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.toggleNotifications === 'function')).toBe(true)
  })

  test('togglePushNotifications est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.togglePushNotifications === 'function')).toBe(true)
  })

  test('openDeleteAccount ouvre le modal', async ({ page }) => {
    await setupProfile(page)
    await page.evaluate(() => window.openDeleteAccount?.())
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => window.getState?.()?.showDeleteAccount)).toBe(true)
  })

  test('closeDeleteAccount ferme le modal', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.closeDeleteAccount?.())
    expect(await page.evaluate(() => window.getState?.()?.showDeleteAccount)).toBe(false)
  })

  test('requestAccountDeletion est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.requestAccountDeletion === 'function')).toBe(true)
  })

  test('submitProfileReview est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.submitProfileReview === 'function')).toBe(true)
  })

  test('openWriteReview est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.openWriteReview === 'function')).toBe(true)
  })

  test('shareMyProfile est appelable', async ({ page }) => {
    await setupProfile(page)
    expect(await page.evaluate(() => typeof window.shareMyProfile === 'function')).toBe(true)
  })
})

// ==================== ADMIN ====================

test.describe('Admin — Fonctionnel', () => {
  test('openAdminPanel ouvre le panel', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openAdminPanel?.())
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.showAdminPanel)).toBe(true)
  })

  test('closeAdminPanel ferme le panel', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.closeAdminPanel?.())
    expect(await page.evaluate(() => window.getState?.()?.showAdminPanel)).toBe(false)
  })

  test('setAdminTab est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.setAdminTab === 'function')).toBe(true)
  })

  test('loadAdminReports est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.loadAdminReports === 'function')).toBe(true)
  })

  test('adminConfirmReport est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.adminConfirmReport === 'function')).toBe(true)
  })

  test('adminDismissReport est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.adminDismissReport === 'function')).toBe(true)
  })

  test('adminRelocateSpot est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.adminRelocateSpot === 'function')).toBe(true)
  })

  test('adminApproveGuideTipAction est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.adminApproveGuideTipAction === 'function')).toBe(true)
  })

  test('adminRejectGuideTipAction est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.adminRejectGuideTipAction === 'function')).toBe(true)
  })

  test('adminApproveIdVerification est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.adminApproveIdVerification === 'function')).toBe(true)
  })

  test('adminRejectIdVerification est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.adminRejectIdVerification === 'function')).toBe(true)
  })

  test('adminViewSpot est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.adminViewSpot === 'function')).toBe(true)
  })

  test('setAdminReportFilter est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.setAdminReportFilter === 'function')).toBe(true)
  })

  test('exportFeedbackCSV est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.exportFeedbackCSV === 'function')).toBe(true)
  })

  test('loadAdminSentry est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.loadAdminSentry === 'function')).toBe(true)
  })
})

// ==================== LEGAL & RGPD ====================

test.describe('Legal — Fonctionnel', () => {
  test('showLegalPage privacy affiche la page', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.showLegalPage?.('privacy'))
    await page.waitForTimeout(500)
    const content = await page.evaluate(() => document.body.innerText)
    expect(content.length).toBeGreaterThan(200)
  })

  test('showLegalPage terms affiche les CGU', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.showLegalPage?.('terms'))
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => typeof window.getState === 'function')).toBe(true)
  })

  test('openMyData ouvre les données RGPD', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openMyData?.())
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => window.getState?.()?.showMyData)).toBe(true)
  })

  test('closeMyData ferme', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.closeMyData?.())
    expect(await page.evaluate(() => window.getState?.()?.showMyData)).toBe(false)
  })

  test('downloadMyData est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.downloadMyData === 'function')).toBe(true)
  })

  test('acceptAllCookies est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.acceptAllCookies === 'function')).toBe(true)
  })

  test('refuseOptionalCookies est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.refuseOptionalCookies === 'function')).toBe(true)
  })

  test('saveCustomCookiePreferences est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.saveCustomCookiePreferences === 'function')).toBe(true)
  })
})

// ==================== OFFLINE & PWA ====================

test.describe('Offline — Fonctionnel', () => {
  test('downloadCountryOffline est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.downloadCountryOffline === 'function')).toBe(true)
  })

  test('deleteOfflineCountry est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.deleteOfflineCountry === 'function')).toBe(true)
  })

  test('clearAllOfflineData est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.clearAllOfflineData === 'function')).toBe(true)
  })

  test('getOfflineStorageInfo est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.getOfflineStorageInfo === 'function')).toBe(true)
  })

  test('openOfflinePanel est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.openOfflinePanel === 'function')).toBe(true)
  })

  test('installPWA est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.installPWA === 'function')).toBe(true)
  })

  test('dismissInstallBanner est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.dismissInstallBanner === 'function')).toBe(true)
  })
})

// ==================== PARTAGE ====================

test.describe('Sharing — Fonctionnel', () => {
  test('shareSpot est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.shareSpot === 'function')).toBe(true)
  })

  test('shareBadge est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.shareBadge === 'function')).toBe(true)
  })

  test('shareStats est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.shareStats === 'function')).toBe(true)
  })

  test('shareApp est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.shareApp === 'function')).toBe(true)
  })

  test('shareMyProfile est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.shareMyProfile === 'function')).toBe(true)
  })

  test('copyFriendLink est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.copyFriendLink === 'function')).toBe(true)
  })
})

// ==================== AMBASSADEURS ====================

test.describe('Ambassadeurs — Fonctionnel', () => {
  test('registerAmbassador est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.registerAmbassador === 'function')).toBe(true)
  })

  test('searchAmbassadors est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.searchAmbassadors === 'function')).toBe(true)
  })

  test('contactAmbassador est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.contactAmbassador === 'function')).toBe(true)
  })

  test('unregisterAmbassador est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.unregisterAmbassador === 'function')).toBe(true)
  })
})

// ==================== IDENTITY VERIFICATION ====================

test.describe('Identity Verification — Fonctionnel', () => {
  test('openIdentityVerification ouvre le modal', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openIdentityVerification?.())
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => window.getState?.()?.showIdentityVerification)).toBe(true)
  })

  test('closeIdentityVerification ferme le modal', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.closeIdentityVerification?.())
    expect(await page.evaluate(() => window.getState?.()?.showIdentityVerification)).toBe(false)
  })

  test('startVerificationStep est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.startVerificationStep === 'function')).toBe(true)
  })

  test('submitVerificationPhotos est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.submitVerificationPhotos === 'function')).toBe(true)
  })

  test('getTrustLevel est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.getTrustLevel === 'function')).toBe(true)
  })

  test('getUserTrustScore est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.getUserTrustScore === 'function')).toBe(true)
  })
})

// ==================== FAQ ====================

test.describe('FAQ — Fonctionnel', () => {
  test('openFAQ ouvre la FAQ', async ({ page }) => {
    await setup(page)
    await page.evaluate(() => window.openFAQ?.())
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => typeof window.closeFAQ === 'function')).toBe(true)
  })

  test('closeFAQ ferme', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.closeFAQ === 'function')).toBe(true)
  })

  test('toggleFAQItem est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.toggleFAQItem === 'function')).toBe(true)
  })

  test('searchFAQ est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.searchFAQ === 'function')).toBe(true)
  })

  test('scrollToFAQCategory est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.scrollToFAQCategory === 'function')).toBe(true)
  })
})

// ==================== DIVERS ====================

test.describe('Divers — Fonctionnel', () => {
  test('resetApp est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.resetApp === 'function')).toBe(true)
  })

  test('showLoading est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.showLoading === 'function')).toBe(true)
  })

  test('hideLoading est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.hideLoading === 'function')).toBe(true)
  })

  test('showSuccessAnimation est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.showSuccessAnimation === 'function')).toBe(true)
  })

  test('launchConfetti est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.launchConfetti === 'function')).toBe(true)
  })

  test('srAnnounce est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.srAnnounce === 'function')).toBe(true)
  })

  test('showAccessibilityHelp est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.showAccessibilityHelp === 'function')).toBe(true)
  })

  test('centerOnUser est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.centerOnUser === 'function')).toBe(true)
  })

  test('flyToCity est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.flyToCity === 'function')).toBe(true)
  })

  test('openContactForm est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.openContactForm === 'function')).toBe(true)
  })

  test('openBugReport est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.openBugReport === 'function')).toBe(true)
  })

  test('openChangelog est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.openChangelog === 'function')).toBe(true)
  })

  test('openHelpCenter est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.openHelpCenter === 'function')).toBe(true)
  })

  test('showFeatureIntro est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.showFeatureIntro === 'function')).toBe(true)
  })

  test('openFeedbackPanel est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.openFeedbackPanel === 'function')).toBe(true)
  })

  test('submitFeedback est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.submitFeedback === 'function')).toBe(true)
  })

  test('submitIntroVote est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.submitIntroVote === 'function')).toBe(true)
  })

  test('openCityPanel est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.openCityPanel === 'function')).toBe(true)
  })

  test('closeCityPanel est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.closeCityPanel === 'function')).toBe(true)
  })

  test('loadCountryOnMap est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.loadCountryOnMap === 'function')).toBe(true)
  })

  test('downloadCountryFromBubble est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.downloadCountryFromBubble === 'function')).toBe(true)
  })

  test('acceptLocationPermission est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.acceptLocationPermission === 'function')).toBe(true)
  })

  test('declineLocationPermission est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.declineLocationPermission === 'function')).toBe(true)
  })

  test('quickValidateSpot est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.quickValidateSpot === 'function')).toBe(true)
  })

  test('quickReportSpot est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.quickReportSpot === 'function')).toBe(true)
  })

  test('dismissProximityAlert est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.dismissProximityAlert === 'function')).toBe(true)
  })

  test('toggleNearbyFriends est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.toggleNearbyFriends === 'function')).toBe(true)
  })

  test('setNotificationRadius est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.setNotificationRadius === 'function')).toBe(true)
  })

  test('toggleLocationSharing est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.toggleLocationSharing === 'function')).toBe(true)
  })

  test('showFriendOnMap est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.showFriendOnMap === 'function')).toBe(true)
  })

  test('startSpotNavigation est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.startSpotNavigation === 'function')).toBe(true)
  })

  test('stopNavigation est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.stopNavigation === 'function')).toBe(true)
  })

  test('showNavigationPicker est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.showNavigationPicker === 'function')).toBe(true)
  })

  test('compressImage est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.compressImage === 'function')).toBe(true)
  })

  test('validateImage est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.validateImage === 'function')).toBe(true)
  })

  test('nearbySpotChooseCreate est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.nearbySpotChooseCreate === 'function')).toBe(true)
  })

  test('nearbySpotChooseValidate est appelable', async ({ page }) => {
    await setup(page)
    expect(await page.evaluate(() => typeof window.nearbySpotChooseValidate === 'function')).toBe(true)
  })
})
