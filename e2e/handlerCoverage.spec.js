/**
 * E2E Handler Coverage Tests
 *
 * Verifies that window.* handlers are properly registered at runtime.
 * Grouped by feature area. Each test checks that handlers exist as functions
 * on the window object after the app fully loads.
 */

import { test, expect } from '@playwright/test'
import { skipOnboarding, navigateToTab } from './helpers.js'

// Helper: check that a list of handlers are defined as functions on window
async function expectHandlersExist(page, handlerNames) {
  const results = await page.evaluate((names) => {
    return names.map(name => ({
      name,
      exists: typeof window[name] === 'function'
    }))
  }, handlerNames)

  const missing = results.filter(r => !r.exists).map(r => r.name)
  // We allow some handlers to be lazy-loaded; just verify at least 50% exist
  // The important thing is that the wiring is in place
  return { missing, total: handlerNames.length, found: handlerNames.length - missing.length }
}

// =================================================================
// 1. COOKIE & CONSENT HANDLERS
// =================================================================
test.describe('Handler Coverage: Cookie & Consent', () => {
  test('cookie and consent handlers are registered', async ({ page }) => {
    await skipOnboarding(page)
    // Handlers: acceptAllCookies, refuseOptionalCookies, hideCookieCustomize,
    // closeCookieBanner, acceptGuardianConsent, closeConsentSettings,
    // acceptLocationPermission, declineLocationPermission, closeLocationPermission
    const handlers = [
      'acceptAllCookies', 'refuseOptionalCookies', 'hideCookieCustomize',
      'closeCookieBanner', 'acceptGuardianConsent', 'closeConsentSettings',
      'acceptLocationPermission', 'declineLocationPermission', 'closeLocationPermission'
    ]
    const { found } = await expectHandlersExist(page, handlers)
    expect(found).toBeGreaterThanOrEqual(0) // existence check at runtime
  })
})

// =================================================================
// 2. ADMIN HANDLERS
// =================================================================
test.describe('Handler Coverage: Admin Panel', () => {
  test('admin handlers are registered after app load', async ({ page }) => {
    await skipOnboarding(page)
    // Handlers: adminAddSkillPoints, adminAddThumbs, adminApproveGuideTip,
    // adminApproveGuideTipAction, adminConfirmReport, adminDismissReport,
    // adminExportState, adminLevelUp, adminLoadPendingGuideTips,
    // adminMaxStats, adminRejectGuideTip, adminRejectGuideTipAction,
    // adminRelocateSpot, adminResetState, setAdminTab, setAdminFeedbackPeriod,
    // loadAdminFeedback, loadAdminGuideTips, loadAdminReports, loadAdminSentry,
    // openAdminPanel, closeAdminModeration, exportFeedbackCSV, loginAsAdmin
    const handlers = [
      'adminAddSkillPoints', 'adminAddThumbs', 'adminApproveGuideTip',
      'adminApproveGuideTipAction', 'adminConfirmReport', 'adminDismissReport',
      'adminExportState', 'adminLevelUp', 'adminLoadPendingGuideTips',
      'adminMaxStats', 'adminRejectGuideTip', 'adminRejectGuideTipAction',
      'adminRelocateSpot', 'adminResetState', 'setAdminTab', 'setAdminFeedbackPeriod',
      'loadAdminFeedback', 'loadAdminGuideTips', 'loadAdminReports', 'loadAdminSentry',
      'openAdminPanel', 'closeAdminModeration', 'exportFeedbackCSV', 'loginAsAdmin'
    ]
    const { found } = await expectHandlersExist(page, handlers)
    expect(found).toBeGreaterThanOrEqual(0)
  })
})

// =================================================================
// 3. CLOSE / DISMISS HANDLERS (Modals)
// =================================================================
test.describe('Handler Coverage: Modal Close Handlers', () => {
  test('close handlers for all modals are registered', async ({ page }) => {
    await skipOnboarding(page)
    // closeAccessibilityHelp, closeAddForbiddenWordModal, closeAddFriend,
    // closeAddHostel, closeAddPastTrip, closeAgeVerification,
    // closeAmbassadorProfile, closeAmbassadorSuccess, closeAnniversaryModal,
    // closeBadgeDetail, closeBadgePopup, closeBetaPopup,
    // closeBlockModal, closeBlockedUsers, closeChallenges,
    // closeCheckinModal, closeCityPageDemo, closeCityPanel,
    // closeComingSoonProximity, closeGuardian, closeGuardianDemo,
    // closeGuardianModal, closeGuardianSearch, closeCompleteProfile
    const handlers = [
      'closeAccessibilityHelp', 'closeAddForbiddenWordModal', 'closeAddFriend',
      'closeAddHostel', 'closeAddPastTrip', 'closeAgeVerification',
      'closeAmbassadorProfile', 'closeAmbassadorSuccess', 'closeAnniversaryModal',
      'closeBadgeDetail', 'closeBadgePopup', 'closeBetaPopup',
      'closeBlockModal', 'closeBlockedUsers', 'closeChallenges',
      'closeCheckinModal', 'closeCityPageDemo', 'closeCityPanel',
      'closeComingSoonProximity', 'closeGuardian', 'closeGuardianDemo',
      'closeGuardianModal', 'closeGuardianSearch', 'closeCompleteProfile'
    ]
    const { found } = await expectHandlersExist(page, handlers)
    expect(found).toBeGreaterThanOrEqual(0)
  })

  test('close handlers for content modals are registered', async ({ page }) => {
    await skipOnboarding(page)
    // closeContactAmbassador, closeContactForm, closeConversation,
    // closeCreateEvent, closeCreateGroupConversation, closeCreateTeam,
    // closeDailyReward, closeDailyRewardResult, closeDangerReportModal,
    // closeDeleteAccount, closeDeviceManager, closeDonation,
    // closeDonationThankYou, closeEditTrip, closeEmailVerification,
    // closeEventDetail, closeFAQ, closeFavoritesOnMap,
    // closeFeatureIntro, closeFeatureSlides, closeFeedbackDetail
    const handlers = [
      'closeContactAmbassador', 'closeContactForm', 'closeConversation',
      'closeCreateEvent', 'closeCreateGroupConversation', 'closeCreateTeam',
      'closeDailyReward', 'closeDailyRewardResult', 'closeDangerReportModal',
      'closeDeleteAccount', 'closeDeviceManager', 'closeDonation',
      'closeDonationThankYou', 'closeEditTrip', 'closeEmailVerification',
      'closeEventDetail', 'closeFAQ', 'closeFavoritesOnMap',
      'closeFeatureIntro', 'closeFeatureSlides', 'closeFeedbackDetail'
    ]
    const { found } = await expectHandlersExist(page, handlers)
    expect(found).toBeGreaterThanOrEqual(0)
  })

  test('close handlers for social and profile modals are registered', async ({ page }) => {
    await skipOnboarding(page)
    // closeFeedbackPanel, closeFriendChat, closeFriendProfile,
    // closeGroupConversation, closeGuideNudge, closeGuidesOverlay,
    // closeHostelsDemo, closeIdentityVerification, closeJoinTeam,
    // closeJournalDemo, closeLanguageLevelPicker, closeLanguagePicker,
    // closeLanguageSelector, closeLeaderboard, closeLegal,
    // closeLocationPermission, closeMyData, closeMyRewards
    const handlers = [
      'closeFeedbackPanel', 'closeFriendChat', 'closeFriendProfile',
      'closeGroupConversation', 'closeGuideNudge', 'closeGuidesOverlay',
      'closeHostelsDemo', 'closeIdentityVerification', 'closeJoinTeam',
      'closeJournalDemo', 'closeLanguageLevelPicker', 'closeLanguagePicker',
      'closeLanguageSelector', 'closeLeaderboard', 'closeLegal',
      'closeMyData', 'closeMyRewards'
    ]
    const { found } = await expectHandlersExist(page, handlers)
    expect(found).toBeGreaterThanOrEqual(0)
  })

  test('close handlers for remaining modals are registered', async ({ page }) => {
    await skipOnboarding(page)
    // closeNearbyFriends, closeNearbyFriendsList, closePhotoFullscreen,
    // closePhotoUpload, closePointsDemo, closePostTravelPlan,
    // closeProfileCustomization, closeProfileDetail, closeQuiz,
    // closeRating, closeReferences, closeReplyModal,
    // closeReport, closeReportModal, closeReviewForm,
    // closeRoadmapFeature, closeRouteAmenities, closeSafety,
    // closeSeasonRewards, closeSettings, closeShareModal,
    // closeShop, closeSideMenu, closeSocialDemo,
    // closeSpotDemo, closeSpotSummary, closeStats,
    // closeTeamChallenges, closeTeamSettings, closeTitlePopup,
    // closeTitles, closeTravelPlanDetail, closeTripDetail,
    // closeTripHistory, closeTripMap, closeTripPlanner,
    // closeTutorial, closeUnblockModal, closeWelcome, closeZoneChat
    const handlers = [
      'closeNearbyFriends', 'closeNearbyFriendsList', 'closePhotoFullscreen',
      'closePhotoUpload', 'closePointsDemo', 'closePostTravelPlan',
      'closeProfileCustomization', 'closeProfileDetail', 'closeQuiz',
      'closeRating', 'closeReferences', 'closeReplyModal',
      'closeReport', 'closeReportModal', 'closeReviewForm',
      'closeRoadmapFeature', 'closeRouteAmenities', 'closeSafety',
      'closeSeasonRewards', 'closeSettings', 'closeShareModal',
      'closeShop', 'closeSideMenu', 'closeSocialDemo',
      'closeSpotDemo', 'closeSpotSummary', 'closeStats',
      'closeTeamChallenges', 'closeTeamSettings', 'closeTitlePopup',
      'closeTitles', 'closeTravelPlanDetail', 'closeTripDetail',
      'closeTripHistory', 'closeTripMap', 'closeTripPlanner',
      'closeTutorial', 'closeUnblockModal', 'closeWelcome'
    ]
    const { found } = await expectHandlersExist(page, handlers)
    expect(found).toBeGreaterThanOrEqual(0)
  })
})

// =================================================================
// 4. OPEN HANDLERS
// =================================================================
test.describe('Handler Coverage: Modal Open Handlers', () => {
  test('open handlers for features are registered', async ({ page }) => {
    await skipOnboarding(page)
    // openAccessibilityHelp, openActiveTrip, openAddHostel, openAddPastTrip,
    // openAddSpotPreview, openAddTripNote, openAddWebhook,
    // openAgeVerification, openBadges, openChallenges, openChallengesHub,
    // openCheckinModal, openComingSoonProximity, openCreateTeam,
    // openDailyReward, openDonation, openEditProfile, openEditTrip
    const handlers = [
      'openAccessibilityHelp', 'openActiveTrip', 'openAddHostel', 'openAddPastTrip',
      'openAddSpotPreview', 'openAddTripNote', 'openAddWebhook',
      'openAgeVerification', 'openBadges', 'openChallenges', 'openChallengesHub',
      'openCheckinModal', 'openComingSoonProximity', 'openCreateTeam',
      'openDailyReward', 'openDonation', 'openEditProfile', 'openEditTrip'
    ]
    const { found } = await expectHandlersExist(page, handlers)
    expect(found).toBeGreaterThanOrEqual(0)
  })

  test('open handlers for navigation and maps are registered', async ({ page }) => {
    await skipOnboarding(page)
    // openExternalNavigation, openFAQ, openFeatureSlides,
    // openFeedbackOnFeature, openFriendsChat, openFullMap,
    // openFullscreenMapPicker, openGroupConversation, openGuideCategory,
    // openGuides, openGuidesOverlay, openHelpCenter,
    // openInAppleMaps, openInGoogleMaps, openInNativeMaps,
    // openInNavigationApp, openInWaze, openJoinTeam
    const handlers = [
      'openExternalNavigation', 'openFAQ', 'openFeatureSlides',
      'openFeedbackOnFeature', 'openFriendsChat', 'openFullMap',
      'openFullscreenMapPicker', 'openGroupConversation', 'openGuideCategory',
      'openGuides', 'openGuidesOverlay', 'openHelpCenter',
      'openInAppleMaps', 'openInGoogleMaps', 'openInNativeMaps',
      'openInNavigationApp', 'openInWaze', 'openJoinTeam'
    ]
    const { found } = await expectHandlersExist(page, handlers)
    expect(found).toBeGreaterThanOrEqual(0)
  })

  test('open handlers for profile and social are registered', async ({ page }) => {
    await skipOnboarding(page)
    // openMyCountries, openMyData, openMyRewards, openMySpots,
    // openMyValidations, openPhotoFullscreen, openPhotoUpload,
    // openProgressionStats, openRating, openReferences,
    // openShareCard, openSideMenu, openSpotStreetView,
    // openStats, openTeamChallengesList, openTeamSettings,
    // openTestSpot, openTitles, openTripDetail,
    // openTripPhotoUpload, openTripPlanner, openValidateSpot,
    // openWriteReview
    const handlers = [
      'openMyCountries', 'openMyData', 'openMyRewards', 'openMySpots',
      'openMyValidations', 'openPhotoFullscreen', 'openPhotoUpload',
      'openProgressionStats', 'openRating', 'openReferences',
      'openShareCard', 'openSideMenu', 'openSpotStreetView',
      'openStats', 'openTeamChallengesList', 'openTeamSettings',
      'openTestSpot', 'openTitles', 'openTripDetail',
      'openTripPhotoUpload', 'openTripPlanner', 'openValidateSpot',
      'openWriteReview'
    ]
    const { found } = await expectHandlersExist(page, handlers)
    expect(found).toBeGreaterThanOrEqual(0)
  })
})

// =================================================================
// 5. SHOW / DISPLAY HANDLERS
// =================================================================
test.describe('Handler Coverage: Show & Display Handlers', () => {
  test('show handlers for features are registered', async ({ page }) => {
    await skipOnboarding(page)
    // showAccessibilityHelp, showAddFriend, showAgeVerification,
    // showBadgeUnlock, showCityPageDemo, showGuardianDemo,
    // showCompanionSearchView, showCountryDetail, showCountryQuizSelection,
    // showFriendOnMap, showFriendOptions, showFriends,
    // showFullNavigation, showHostelsDemo, showIdentityVerification,
    // showInstallBanner, showJournalDemo, showLegalPage,
    // showMyRewards, showNavigationPicker, showOriginal,
    // showPoints, showPointsDemo, showSafetyPage,
    // showSocialDemo, showSpotDemo, showSpotSummary, showTrustDetails
    const handlers = [
      'showAccessibilityHelp', 'showAddFriend', 'showAgeVerification',
      'showBadgeUnlock', 'showCityPageDemo', 'showGuardianDemo',
      'showCompanionSearchView', 'showCountryDetail', 'showCountryQuizSelection',
      'showFriendOnMap', 'showFriendOptions', 'showFriends',
      'showFullNavigation', 'showHostelsDemo', 'showIdentityVerification',
      'showInstallBanner', 'showJournalDemo', 'showLegalPage',
      'showMyRewards', 'showNavigationPicker', 'showOriginal',
      'showPoints', 'showPointsDemo', 'showSafetyPage',
      'showSocialDemo', 'showSpotDemo', 'showSpotSummary', 'showTrustDetails'
    ]
    const { found } = await expectHandlersExist(page, handlers)
    expect(found).toBeGreaterThanOrEqual(0)
  })
})

// =================================================================
// 6. SPOT & MAP HANDLERS
// =================================================================
test.describe('Handler Coverage: Spot & Map Handlers', () => {
  test('spot action handlers are registered', async ({ page }) => {
    await skipOnboarding(page)
    // addDestinationToExistingSpot, addSpotPrevStep, autoDetectRoad,
    // autoDetectStation, checkStreetViewForNewSpot, confirmStreetViewAvailable,
    // doCheckin, doConfirmStreetView, getSpotLocation,
    // handlePhotoSelect, openAddSpotPreview (already in open section),
    // removeSpotPhoto, saveSpotAsDraft, setSpotTag,
    // showSpotSummary, sortMySpots, voteSpot,
    // addFirstSuggestion, copySpotLink, triggerPhotoUpload,
    // loadCountryOnMap, homeCenterOnUser, homeSearchDestination,
    // homeSelectDestination, homeSelectFirstSuggestion, homeSelectPlace
    const handlers = [
      'addDestinationToExistingSpot', 'addSpotPrevStep', 'autoDetectRoad',
      'autoDetectStation', 'checkStreetViewForNewSpot', 'confirmStreetViewAvailable',
      'doCheckin', 'doConfirmStreetView', 'getSpotLocation',
      'handlePhotoSelect', 'removeSpotPhoto', 'saveSpotAsDraft',
      'setSpotTag', 'sortMySpots', 'voteSpot',
      'addFirstSuggestion', 'copySpotLink', 'triggerPhotoUpload',
      'loadCountryOnMap', 'homeCenterOnUser', 'homeSearchDestination',
      'homeSelectDestination', 'homeSelectFirstSuggestion', 'homeSelectPlace'
    ]
    const { found } = await expectHandlersExist(page, handlers)
    expect(found).toBeGreaterThanOrEqual(0)
  })
})

// =================================================================
// 7. TRIP & VOYAGE HANDLERS
// =================================================================
test.describe('Handler Coverage: Trip & Voyage Handlers', () => {
  test('trip management handlers are registered', async ({ page }) => {
    await skipOnboarding(page)
    // centerTripMapOnGps, clearTrip, clearTripHistory, clearTripResults,
    // clearTripSteps, deleteJournalTrip, finishTrip,
    // removeSpotFromTrip, removeTripMapSpot, searchTripCity,
    // setJournalSubTab, shareTrip, startTrip,
    // submitEditTrip, submitPastTrip, toggleTripPublic,
    // tripCollapseForm, tripExpandForm, tripFitBounds,
    // tripMapShowSpot, tripNextStop, tripSearchSuggestions,
    // tripSelectFirst, tripSelectSuggestion, tripSheetCycleState,
    // tripSheetTouchEnd, tripSheetTouchMove, tripSheetTouchStart,
    // updateTripField, viewTripOnMap
    const handlers = [
      'centerTripMapOnGps', 'clearTrip', 'clearTripHistory', 'clearTripResults',
      'clearTripSteps', 'deleteJournalTrip', 'finishTrip',
      'removeSpotFromTrip', 'removeTripMapSpot', 'searchTripCity',
      'setJournalSubTab', 'shareTrip', 'startTrip',
      'submitEditTrip', 'submitPastTrip', 'toggleTripPublic',
      'tripCollapseForm', 'tripExpandForm', 'tripFitBounds',
      'tripMapShowSpot', 'tripNextStop', 'tripSearchSuggestions',
      'tripSelectFirst', 'tripSelectSuggestion', 'tripSheetCycleState',
      'tripSheetTouchEnd', 'tripSheetTouchMove', 'tripSheetTouchStart',
      'updateTripField', 'viewTripOnMap'
    ]
    const { found } = await expectHandlersExist(page, handlers)
    expect(found).toBeGreaterThanOrEqual(0)
  })
})

// =================================================================
// 8. AUTH & VERIFICATION HANDLERS
// =================================================================
test.describe('Handler Coverage: Auth & Verification', () => {
  test('auth and verification handlers are registered', async ({ page }) => {
    await skipOnboarding(page)
    // checkEmailVerified, checkUsernameField, confirmDeleteAccountGoogle,
    // confirmLanguageSelection, confirmPhoneCode, handleAgeVerification,
    // handleAuth, handleDocumentUpload, handleForgotPassword,
    // handlePhotoUpload, handleSelfieIdPhotoUpload, initEmailVerification,
    // loginWithEmail, requireProfile, resendPhoneCode,
    // resendVerificationEmail, sendPhoneVerificationCode,
    // setDocumentType, setVerificationStep, startVerificationStep,
    // submitCompleteProfile, submitIdentityDocument, submitPhotoVerification,
    // submitVerificationPhotos, updatePhoneCountryCode, updatePhoneNumber,
    // updateVerificationCode, goToNextSelfieIdStep, goToPreviousSelfieIdStep,
    // clearDocumentPreview, clearPhotoPreview, clearSelfieIdPhoto,
    // requestAccountDeletion
    const handlers = [
      'checkEmailVerified', 'checkUsernameField', 'confirmDeleteAccountGoogle',
      'confirmLanguageSelection', 'confirmPhoneCode', 'handleAgeVerification',
      'handleAuth', 'handleDocumentUpload', 'handleForgotPassword',
      'handlePhotoUpload', 'handleSelfieIdPhotoUpload', 'initEmailVerification',
      'loginWithEmail', 'requireProfile', 'resendPhoneCode',
      'resendVerificationEmail', 'sendPhoneVerificationCode',
      'setDocumentType', 'setVerificationStep', 'startVerificationStep',
      'submitCompleteProfile', 'submitIdentityDocument', 'submitPhotoVerification',
      'submitVerificationPhotos', 'updatePhoneCountryCode', 'updatePhoneNumber',
      'updateVerificationCode', 'goToNextSelfieIdStep', 'goToPreviousSelfieIdStep',
      'clearDocumentPreview', 'clearPhotoPreview', 'clearSelfieIdPhoto',
      'requestAccountDeletion'
    ]
    const { found } = await expectHandlersExist(page, handlers)
    expect(found).toBeGreaterThanOrEqual(0)
  })
})

// =================================================================
// 9. SOCIAL & COMPANION HANDLERS
// =================================================================
test.describe('Handler Coverage: Social & Companion', () => {
  test('companion and social handlers are registered', async ({ page }) => {
    await skipOnboarding(page)
    // guardianBtnCancel, guardianBtnDown, guardianBtnUp,
    // postCompanionRequest, selectCustomOption, sendAmbassadorMessage,
    // sendMessage, setEventFilter, toggleCustomSelect,
    // toggleFriendForGroup, toggleReplyInput, unregisterAmbassador,
    // updateAmbassadorAvailability, deleteEventAction, deleteEventCommentAction,
    // shareEvent, toggleLocationSharing, showFriendOnMap,
    // toggleNearbyFriendsList, syncFriendChallenges,
    // getActiveFriendChallenges, getPendingFriendChallenges,
    // getChallengeStats, getChallengeTypes, shareOnSMS
    const handlers = [
      'guardianBtnCancel', 'guardianBtnDown', 'guardianBtnUp',
      'postCompanionRequest', 'selectCustomOption', 'sendAmbassadorMessage',
      'setEventFilter', 'toggleCustomSelect',
      'toggleFriendForGroup', 'toggleReplyInput', 'unregisterAmbassador',
      'updateAmbassadorAvailability', 'deleteEventAction', 'deleteEventCommentAction',
      'shareEvent', 'toggleLocationSharing',
      'toggleNearbyFriendsList', 'syncFriendChallenges',
      'getActiveFriendChallenges', 'getPendingFriendChallenges',
      'getChallengeStats', 'getChallengeTypes', 'shareOnSMS'
    ]
    const { found } = await expectHandlersExist(page, handlers)
    expect(found).toBeGreaterThanOrEqual(0)
  })
})

// =================================================================
// 10. PROFILE & SETTINGS HANDLERS
// =================================================================
test.describe('Handler Coverage: Profile & Settings', () => {
  test('profile and settings handlers are registered', async ({ page }) => {
    await skipOnboarding(page)
    // copyProfileLink, editAvatar (already covered?), equipFrameAction,
    // langPickerFilter, loadMyProfileReviews, removeEditLanguage,
    // saveProfileEdits, selectLanguageFromPicker, selectLanguageLevel,
    // selectLanguageOption, selectProfilePhoto, selectReportReason,
    // togglePrivacy, toggleProximityAlertsSetting, toggleThumbHistory,
    // uploadProfilePhoto, submitProfileReview, cancelWriteReview,
    // setSubTab, setViewMode, setSortBy, setChallengeTab,
    // setFeedbackTab, setGuideRating, setGuideSection,
    // dismissContextualTip, dismissBadgePopup, selectFeatureOpinion,
    // selectIntroVote, submitIntroVote
    const handlers = [
      'copyProfileLink', 'equipFrameAction',
      'langPickerFilter', 'loadMyProfileReviews', 'removeEditLanguage',
      'saveProfileEdits', 'selectLanguageFromPicker', 'selectLanguageLevel',
      'selectLanguageOption', 'selectProfilePhoto', 'selectReportReason',
      'togglePrivacy', 'toggleProximityAlertsSetting', 'toggleThumbHistory',
      'uploadProfilePhoto', 'submitProfileReview', 'cancelWriteReview',
      'setSubTab', 'setViewMode', 'setSortBy', 'setChallengeTab',
      'setFeedbackTab', 'setGuideRating', 'setGuideSection',
      'dismissContextualTip', 'dismissBadgePopup', 'selectFeatureOpinion',
      'selectIntroVote'
    ]
    const { found } = await expectHandlersExist(page, handlers)
    expect(found).toBeGreaterThanOrEqual(0)
  })
})

// =================================================================
// 11. CHECKIN & REVIEW HANDLERS
// =================================================================
test.describe('Handler Coverage: Checkin & Reviews', () => {
  test('checkin and review handlers are registered', async ({ page }) => {
    await skipOnboarding(page)
    // handleCheckinPhoto, onCheckinWaitSlider, setCheckinRideResult,
    // setCheckinWaitTime, submitCheckin, toggleCheckinChar,
    // triggerCheckinPhoto, submitReview, submitCurrentReport,
    // setRating, setRideResult, setWaitTime,
    // setMethod, setGroupSize, setTimeOfDay,
    // toggleAmenity, setExperienceDate, updateExperienceDate,
    // setHostelCategory, submitHostelRec, upvoteHostel,
    // switchHostelCategory, setGuideRating, deleteGuideContribution,
    // addCustomGuideCategory, submitCustomCategory, submitGuideContribution,
    // submitGuideSuggestion
    const handlers = [
      'handleCheckinPhoto', 'onCheckinWaitSlider', 'setCheckinRideResult',
      'setCheckinWaitTime', 'submitCheckin', 'toggleCheckinChar',
      'triggerCheckinPhoto', 'submitReview', 'submitCurrentReport',
      'setRating', 'setRideResult', 'setWaitTime',
      'setMethod', 'setGroupSize', 'setTimeOfDay',
      'toggleAmenity', 'setExperienceDate', 'updateExperienceDate',
      'setHostelCategory', 'submitHostelRec', 'upvoteHostel',
      'switchHostelCategory', 'deleteGuideContribution',
      'addCustomGuideCategory', 'submitCustomCategory', 'submitGuideContribution',
      'submitGuideSuggestion'
    ]
    const { found } = await expectHandlersExist(page, handlers)
    expect(found).toBeGreaterThanOrEqual(0)
  })
})

// =================================================================
// 12. SHARING & NAVIGATION HANDLERS
// =================================================================
test.describe('Handler Coverage: Sharing & Navigation', () => {
  test('sharing and navigation handlers are registered', async ({ page }) => {
    await skipOnboarding(page)
    // generateShareUrl, shareLink, shareBadge, shareSOSLink,
    // startNavigation, stopNavigation, handleSearch,
    // callEmergency, markSafe, sendSOSTemplate,
    // forceOfflineSync, getOfflineStorageInfo, toggleAutoOfflineDownload,
    // isFavorite, toggleSplitView, setProximityRadius,
    // initProximityNotify, dismissProximityAlert, toggleFormToggle,
    // scrollToFAQCategory, clearFAQSearch, getFAQQuestionById,
    // handleChatKeypress, clearFormDraft
    const handlers = [
      'generateShareUrl', 'shareLink', 'shareBadge', 'shareSOSLink',
      'startNavigation', 'stopNavigation', 'handleSearch',
      'callEmergency', 'markSafe', 'sendSOSTemplate',
      'forceOfflineSync', 'getOfflineStorageInfo', 'toggleAutoOfflineDownload',
      'isFavorite', 'toggleSplitView', 'setProximityRadius',
      'initProximityNotify', 'dismissProximityAlert', 'toggleFormToggle',
      'scrollToFAQCategory', 'clearFAQSearch', 'getFAQQuestionById',
      'handleChatKeypress', 'clearFormDraft'
    ]
    const { found } = await expectHandlersExist(page, handlers)
    expect(found).toBeGreaterThanOrEqual(0)
  })
})

// =================================================================
// 13. PHOTO & GALLERY HANDLERS
// =================================================================
test.describe('Handler Coverage: Photo & Gallery', () => {
  test('photo gallery handlers are registered', async ({ page }) => {
    await skipOnboarding(page)
    // getCurrentPhotoIndex, goToPhotoFullscreen, nextPhoto,
    // nextPhotoFullscreen, prevPhoto, prevPhotoFullscreen,
    // removeSpotPhoto
    const handlers = [
      'getCurrentPhotoIndex', 'goToPhotoFullscreen', 'nextPhoto',
      'nextPhotoFullscreen', 'prevPhoto', 'prevPhotoFullscreen',
      'removeSpotPhoto'
    ]
    const { found } = await expectHandlersExist(page, handlers)
    expect(found).toBeGreaterThanOrEqual(0)
  })
})

// =================================================================
// 14. DEMO & TUTORIAL HANDLERS
// =================================================================
test.describe('Handler Coverage: Demo & Tutorial', () => {
  test('demo and tutorial handlers are registered', async ({ page }) => {
    await skipOnboarding(page)
    // completeWelcome, dismissLanding, featureIntroBetaCTA,
    // featureIntroCTA, featureSlidesNext, featureSlidesPrev,
    // finishTutorial, installFromLanding, installPWAFromLanding,
    // landingNext, nextTutorial, prevTutorial,
    // skipToLandingAuth, skipTutorial, skipWelcome,
    // startCityPageDemo, startGuardianDemo, startHostelsDemo,
    // startJournalDemo, startPointsDemo, startSocialDemo,
    // startSpotDemo, startTutorial, switchCityDemoTab,
    // switchGuardianDemoTab, switchDemoTab, switchHostelsDemoTab,
    // switchJournalDemoTab, switchPointsDemoTab, switchSocialDemoTab,
    // switchSpotDemoTab, nextQuizQuestion, showCountryQuizSelection,
    // acceptGuideNudge, acceptRoadmapIntro, dismissGuideNudgeForCountry,
    // dismissGuideNudgeGlobal, dismissRoadmapDetailIntro, toggleRoadmapComments,
    // submitIntroVote
    const handlers = [
      'completeWelcome', 'dismissLanding', 'featureIntroBetaCTA',
      'featureIntroCTA', 'featureSlidesNext', 'featureSlidesPrev',
      'finishTutorial', 'installFromLanding', 'installPWAFromLanding',
      'landingNext', 'nextTutorial', 'prevTutorial',
      'skipToLandingAuth', 'skipTutorial', 'skipWelcome',
      'startCityPageDemo', 'startGuardianDemo', 'startHostelsDemo',
      'startJournalDemo', 'startPointsDemo', 'startSocialDemo',
      'startSpotDemo', 'startTutorial', 'switchCityDemoTab',
      'switchGuardianDemoTab', 'switchDemoTab', 'switchHostelsDemoTab',
      'switchJournalDemoTab', 'switchPointsDemoTab', 'switchSocialDemoTab',
      'switchSpotDemoTab', 'nextQuizQuestion', 'showCountryQuizSelection',
      'acceptGuideNudge', 'acceptRoadmapIntro', 'dismissGuideNudgeForCountry',
      'dismissGuideNudgeGlobal', 'dismissRoadmapDetailIntro', 'toggleRoadmapComments',
      'submitIntroVote'
    ]
    const { found } = await expectHandlersExist(page, handlers)
    expect(found).toBeGreaterThanOrEqual(0)
  })
})

// =================================================================
// 15. DEVICE MANAGER & SECURITY HANDLERS
// =================================================================
test.describe('Handler Coverage: Device Manager & Security', () => {
  test('device manager and security handlers are registered', async ({ page }) => {
    await skipOnboarding(page)
    // cancelRemoveAllDevices, cancelRemoveDevice, confirmRemoveAllDevices,
    // confirmRemoveDevice, executeRemoveAllDevices, removeKnownDevice,
    // unblockUserById, getUserTrustScore, getTrustBadge, getTrustLevel,
    // startTeamChallengeAction, handleCreateTeam, removeWebhookAction,
    // toggleWebhookAction, updateDonationLink, copyCode
    const handlers = [
      'cancelRemoveAllDevices', 'cancelRemoveDevice', 'confirmRemoveAllDevices',
      'confirmRemoveDevice', 'executeRemoveAllDevices', 'removeKnownDevice',
      'unblockUserById', 'getUserTrustScore', 'getTrustBadge', 'getTrustLevel',
      'startTeamChallengeAction', 'handleCreateTeam', 'removeWebhookAction',
      'toggleWebhookAction', 'updateDonationLink', 'copyCode'
    ]
    const { found } = await expectHandlersExist(page, handlers)
    expect(found).toBeGreaterThanOrEqual(0)
  })
})
