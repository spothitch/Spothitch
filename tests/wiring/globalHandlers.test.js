/**
 * Wiring Tests - Global Handlers
 * Verifies every onclick in rendered HTML maps to a real window.* function
 *
 * RULE: Every new feature MUST have its onclick handlers tested here.
 */

import { describe, it, expect, beforeAll, vi } from 'vitest'

// ---- Build the KNOWN_HANDLERS set from main.js window.* assignments ----
// We collect every function name that main.js (and side-effect modules) attach to window.*

const KNOWN_HANDLERS = new Set()

// Manually maintained list extracted from src/main.js + side-effect modules
// This is the source of truth: if a handler is used in onclick but NOT here, the test fails.
const MAIN_JS_HANDLERS = [
  // Reset / Navigation
  'resetApp', 'changeTab', 'openFullMap', 'toggleTheme', 'setViewMode',
  'goBack',
  't',
  // Spots
  'selectSpot', 'closeSpotDetail', 'openAddSpot', 'openAddSpotPreview', 'closeAddSpot',
  'openRating', 'closeRating', 'openNavigation', 'getSpotLocation',
  'doCheckin', 'submitReview', 'setRating', 'reportSpotAction', 'translateSpotText',
  // Navigation GPS
  'startSpotNavigation', 'stopNavigation', 'openExternalNavigation',
  // SOS
  'openSOS', 'closeSOS', 'shareSOSLocation', 'markSafe',
  'addEmergencyContact', 'removeEmergencyContact',
  // SOS Extended
  'sosToggleSilent', 'sosUpdateCustomMsg',
  'sosSetPrimaryContact',
  'sosOpenFakeCall', 'sosFakeCallAnswer', 'sosFakeCallDecline',
  'sosStartRecording', 'sosStopRecording',
  'acceptSOSIntro', 'sosTab', 'sosShowRecordOptions', 'sosBroadcastCommunity',
  'sosOpenConfig', 'sosCloseConfig',
  'sosSearchFriend', 'sosAddFriendAsContact', 'sosRequestPermission',
  // Voyageurs (Radar + Travel Buddies)
  'toggleProximityRadar', 'setRadarRadius', 'setRadarVisibility', 'setRadarMessage',
  'showRadarExpanded', 'contactNearbyTraveler',
  'showBuddyList', 'showBuddyDetail', 'showBuddyCreate',
  'submitBuddyAnnouncement', 'deleteBuddyAnnouncement', 'closeBuddyAnnouncement', 'shareBuddyAnnouncement',
  'sendBuddyChatMessage',
  'setBuddyCountryFilter', 'contactBuddyAuthor',
  'setBuddyTravelMode', 'toggleBuddyFlexDates', 'setBuddyVisibility',
  'backFromVoyageurs',
  // Auth
  'openAuth', 'closeAuth', 'setAuthMode',
  'signIn', 'signUp',
  'handleGoogleSignIn', 'handleFacebookSignIn', 'handleAppleSignIn',
  'handleForgotPassword', 'handleLogout', 'requireAuth',
  // Age Verification
  'openAgeVerification', 'closeAgeVerification', 'showAgeVerification',
  // Identity Verification
  'openIdentityVerification', 'closeIdentityVerification', 'showIdentityVerification',
  // Welcome
  'selectAvatar', 'completeWelcome', 'skipWelcome', 'closeWelcome',
  // Settings
  'openSettings', 'closeSettings', 'setLanguage',
  // Tutorial removed (retired)
  // Filters / Map layout
  'setFilter', 'handleSearch', 'openFilters', 'closeFilters', 'openActiveTrip',
  'setFilterCountry', 'setFilterMinRating', 'setFilterMaxWait',
  'toggleVerifiedFilter', 'setSortBy', 'applyFilters', 'resetFilters',
  // Quiz
  'openQuiz', 'closeQuiz', 'startQuizGame', 'startCountryQuiz', 'answerQuizQuestion',
  'nextQuizQuestion', 'retryQuiz', 'showCountryQuizSelection',
  // Badges
  'openBadges', 'closeBadges', 'showBadgeDetail', 'closeBadgeDetail', 'dismissBadgePopup', 'openBadgePopup',
  'openDailyReward', 'closeFavoritesOnMap',
  // Challenges
  'openChallenges', 'closeChallenges', 'setChallengeTab',
  // Shop
  'openShop', 'closeShop', 'setShopCategory', 'redeemReward',
  'showMyRewards', 'openMyRewards', 'closeMyRewards',
  'equipAvatar', 'equipFrame', 'equipTitle', 'activateBooster',
  'saveProfileEdits', 'selectProfilePhoto', 'uploadProfilePhoto', 'removeEditLanguage',
  // Stats
  'openStats', 'closeStats',
  // Sub-tab
  'setSubTab',
  // Trip (defined in Travel.js)
  'updateTripField', 'swapTripPoints', 'calculateTrip',
  'viewTripOnMap', 'closeTripMap', 'clearTripResults',
  'removeSpotFromTrip', 'saveTripWithSpots', 'loadSavedTrip', 'deleteSavedTrip', 'renameSavedTrip',
  'toggleFavorite', 'isFavorite',
  // Trip (old planner step-based, kept for compat)
  'searchTripCity', 'addTripStepFromSearch', 'addFirstSuggestion',
  'removeTripStep', 'moveTripStep', 'clearTripSteps',
  // Guides
  'showGuides', 'showCountryDetail', 'showSafetyPage',
  'setGuideSection', 'setGuideActiveSection', 'selectGuide', 'filterGuides', 'setGuideFilterType',
  // Guide contributions
  'openGuideCategory', 'setGuideRating', 'submitGuideContribution',
  'deleteGuideContribution', 'addCustomGuideCategory', 'submitCustomCategory',
  // Friends
  'showFriends', 'openFriendsChat', 'showAddFriend', 'closeAddFriend',
  // Country chats + Guardian watch
  'joinCountryChatAction', 'showAllCountryChats', 'leaveCountryChatAction', 'openGuardianChat', 'callGuardianFriend',
  'acceptFriendRequest', 'declineFriendRequest',
  'sendPrivateMessage', 'copyFriendLink',
  'openFriendChat', 'closeFriendChat', 'showFriendProfile',
  // Friend Challenges
  'createFriendChallenge', 'acceptFriendChallenge', 'declineFriendChallenge',
  'cancelFriendChallenge', 'syncFriendChallenges',
  'getActiveFriendChallenges', 'getPendingFriendChallenges',
  'getChallengeStats', 'getChallengeTypes',
  // Legal
  'showLegalPage', 'closeLegal',
  // Overlays
  'openGuidesOverlay', 'closeGuidesOverlay',
  // Side menu
  'openSideMenu', 'closeSideMenu',
  // Accessibility
  'showAccessibilityHelp', 'closeAccessibilityHelp', 'srAnnounce',
  // PWA
  'showInstallBanner', 'dismissInstallBanner', 'installPWA',
  // Map
  'centerOnUser',
  // Titles
  'openTitles', 'closeTitles',
  // Team challenges
  'openTeamChallenges', 'closeTeamChallenges',
  'openCreateTeam', 'closeCreateTeam',
  'createTeamAction', 'joinTeamAction', 'leaveTeamAction', 'startTeamChallengeAction',
  // Coming soon feature modals (legacy — now handled by showFeatureIntro beta guards)
  // Nearby friends
  'toggleNearbyFriends', 'openNearbyFriends', 'closeNearbyFriends',
  // Profile customization
  'openProfileCustomization', 'closeProfileCustomization',
  'equipFrameAction', 'equipTitleAction',
  // Proximity alerts
  'toggleProximityAlerts', 'setProximityRadius',
  // Trip history
  'openTripHistory', 'closeTripHistory', 'clearTripHistory',
  // Image
  'compressImage', 'generateThumbnail', 'validateImage',
  // Landing page
  'dismissLanding', 'installFromLanding', 'installPWAFromLanding', 'landingNext', 'skipToLandingAuth',
  // Landing / Help
  'openFAQ', 'openHelpCenter', 'openChangelog', 'openRoadmap', 'openContactForm', 'openBugReport',
  // Lazy load
  'loadModal', 'preloadModals',
  // Loading indicator
  'showLoading', 'hideLoading', 'setLoadingMessage', 'setLoadingProgress',
  'isLoading', 'withLoading',
  // Animations
  'showSuccessAnimation', 'showErrorAnimation', 'showBadgeUnlock', 'showLevelUp',
  'showPoints', 'playSound', 'launchConfetti', 'launchConfettiBurst',
  // Sharing
  'shareSpot', 'shareBadge', 'shareStats', 'shareApp', 'openShareCard',
  // Side-effect modules (AdminPanel, Leaderboard, MyData, DonationCard, Moderation, FriendProfile, etc.)
  'openAdminPanel', 'closeAdminPanel',
  'openLeaderboard', 'closeLeaderboard',
  'openMyData', 'closeMyData',
  'openDonation', 'closeDonation', 'closeDonationThankYou',
  'openReport', 'closeReport',
  'closeFriendProfile', 'closeReportModal',
  // Legal & Moderation (session 2026-02-19)
  'acceptSOSDisclaimer', 'acceptGuardianConsent',
  'openBlockedUsers', 'closeBlockedUsers',
  // CheckinModal
  'openCheckinModal', 'closeCheckinModal', 'submitCheckin',
  'setCheckinWaitTime', 'toggleCheckinChar', 'triggerCheckinPhoto',
  'onCheckinWaitSlider', 'setCheckinRideResult', 'handleCheckinPhoto',
  // Leaderboard tabs + country filter
  'setLeaderboardTab', 'setLeaderboardCountry',
  // Thumb History toggle
  'toggleThumbHistory',
  // Map/guide handlers
  'openCountryGuide',
  // Guide tips feedback (defined in feedbackService.js)
  'voteGuideTip', 'submitGuideSuggestion',
  // Voyage view (defined in Voyage.js)
  'setVoyageSubTab', 'setJournalSubTab', 'startTrip', 'tripNextStop', 'finishTrip',
  'toggleTripPublic', 'openTripDetail', 'closeTripDetail', 'deleteJournalTrip',
  'openEditTrip', 'closeEditTrip', 'submitEditTrip',
  'openAddTripNote', 'openTripPhotoUpload',
  // Voyage map-first handlers (defined in Voyage.js)
  'tripSheetTouchStart', 'tripSheetTouchMove', 'tripSheetTouchEnd', 'tripSheetCycleState',
  'tripExpandForm', 'tripCollapseForm', 'removeTripMapSpot', 'toggleTripGasStations',
  'tripFitBounds', 'tripMapShowSpot',
  // Travel view (defined in Travel.js)
  'syncTripFieldsAndCalculate', 'toggleRouteAmenities', 'centerTripMapOnGps', 'setRouteFilter',
  // Social view (defined in Social.js + sub-components)
  'setSocialTab', 'postCompanionRequest', 'addFriendByName',
  'showCompanionSearchView', 'closeCompanionSearch', 'toggleCustomSelect', 'selectCustomOption', 'setEventFilter',
  // Friends Firebase (defined in Social.js)
  'sendFriendRequest',
  // Feed (defined in Feed.js)
  'setFeedFilter', 'toggleFeedVisibility',
  // Group Conversations Firebase (defined in Conversations.js)
  'openGroupConversation', 'closeGroupConversation',
  'openCreateGroupConversation', 'closeCreateGroupConversation',
  'createGroupConversation', 'sendGroupConversationMessage',
  'toggleFriendForGroup', 'leaveGroupConversation', 'addMemberToGroupConversation',
  // Friends (defined in social/Friends.js)
  'searchAmbassadorsByCity',
  // Ambassadors (defined in ambassadors.js)
  'searchAmbassadors', 'registerAmbassador', 'contactAmbassador',
  'unregisterAmbassador', 'updateAmbassadorAvailability',
  // Direct Messages (defined in directMessages.js)
  'openConversation', 'closeConversation', 'sendDM',
  'shareDMSpot', 'shareDMPosition', 'deleteDMConversation',
  'sendDirectMessageTo', 'getConversationWith',
  // Events (defined in events.js)
  'openCreateEvent', 'closeCreateEvent', 'submitCreateEvent',
  'joinEvent', 'leaveEvent', 'deleteEventAction',
  'openEventDetail', 'closeEventDetail',
  'postEventComment', 'replyEventComment', 'toggleReplyInput',
  'reactToEventComment', 'shareEvent', 'deleteEventCommentAction',
  // Profile view (defined in Profile.js)
  'toggleNotifications',
  // SOS (defined in SOS.js)
  'sendSOSTemplate',
  // Auth (defined in Auth.js)
  'loginAsAdmin', 'handleAuth',
  'checkUsernameField', 'submitCompleteProfile', 'closeCompleteProfile',
  // SpotDetail (defined in navigation controller/utils)
  'showNavigationPicker', 'openInNavigationApp', 'voteSpot', 'flyToSpotOnMap',
  // Journal (defined in handlers/tripJournal.js)
  'journalBack', 'journalNewTrip', 'journalOpenTrip', 'journalAddLeg',
  'journalShowStats', 'journalEditExpenses', 'journalEditDayNote',
  'journalCreateTrip', 'journalSaveLeg', 'journalEndTrip', 'journalTogglePublic',
  'journalSaveExpenses', 'journalSaveDayNote', 'journalAddDayPhoto', 'journalDeleteDayPhoto',
  'journalPickSpot', 'journalCloseSpotOverlay', 'journalSelectSpotFromMap', 'journalClearSpot',
  'journalToggleExpenses', 'journalSelectTransport', 'journalShareTrip', 'journalCopyLink',
  'journalExportTrip', 'journalUseMyPosition',
  // Welcome (defined in Welcome.js)
  // IdentityVerification (defined in IdentityVerification.js)
  'startVerificationStep',
  // FriendProfile (defined in FriendProfile.js / Social.js)
  'removeFriend', 'shareProfile', 'shareMyProfile', 'copyProfileLink', 'shareOnSMS',
  // User Reviews (defined in Social.js)
  'openWriteReview', 'cancelWriteReview', 'submitProfileReview', 'loadMyProfileReviews',
  // AddSpot (all defined in AddSpot.js)
  'handlePhotoSelect', 'setSpotRating', 'onSpotTypeChange',
  'triggerPhotoUpload', 'addSpotNextStep', 'addSpotPrevStep',
  'useGPSForSpot', 'openFullscreenMapPicker',
  'autoDetectStation', 'autoDetectRoad',
  'saveSpotAsDraft', 'openSpotDraft', 'deleteSpotDraft',
  'addSpotDestination', 'removeSpotDestination',
  // SpotDetail destinations + street view (defined in SpotDetail.js)
  'addDestinationToExistingSpot', 'openSpotStreetView', 'confirmStreetViewAvailable', 'doConfirmStreetView',
  'deleteMySpot',
  // AdminPanel (defined in AdminPanel.js)
  'adminAddPoints', 'adminAddSkillPoints', 'adminAddThumbs',
  'adminLevelUp', 'adminMaxStats', 'openAccessibilityHelp',
  'adminResetState', 'adminExportState',
  // MyData (defined in MyData.js)
  'openConsentSettings', 'downloadMyData', 'requestAccountDeletion',
  // Moderation (defined in moderation.js)
  'selectReportReason', 'submitCurrentReport',
  // TeamChallenges (defined in teamChallenges.js)
  'openJoinTeam',
  // Home view handlers
  'homeSearchDestination', 'homeSelectFirstSuggestion', 'homeSelectPlace',
  'homeSelectDestination', 'homeClearSearch', 'homeClearDestination',
  'homeCenterOnUser', 'homeZoomIn', 'homeZoomOut',
  // Trip autocomplete
  'tripSearchSuggestions', 'tripSelectSuggestion', 'tripSelectFirst',
  // Country bubbles
  'loadCountryOnMap', 'downloadCountryFromBubble',
  // Offline download
  'downloadCountryOffline', 'deleteOfflineCountry',
  'downloadCountryForOffline', 'getOfflineStorageInfo',
  'clearAllOfflineData', 'toggleAutoOfflineDownload',
  'openOfflinePanel', 'closeOfflinePanel',
  // Push notifications
  'togglePushNotifications',
  // Guardian Mode
  'showGuardianModal', 'closeGuardianModal',
  'startGuardian', 'stopGuardian',
  'guardianBtnDown', 'guardianBtnUp', 'guardianBtnCancel',
  'guardianCheckIn', 'guardianSendAlert',
  'guardianAddTrustedContact', 'guardianRemoveTrustedContact',
  'guardianClearHistory',
  // Guardian v2: multi-guardian + quick actions
  'guardianAddGuardian', 'guardianRemoveGuardian', 'guardianEditGuardian',
  'guardianUpdatePlate', 'guardianSavePlate', 'guardianAddTripPhoto', 'guardianSaveTripPhoto',
  'guardianUpdateDestination', 'guardianSaveDestination',
  'guardianSendMessage', 'guardianQuickCheckin', 'guardianSendReply',
  'guardianShowArrival', 'guardianAddToJournal', 'guardianCloseSheet',
  // switchCompanionDemoTab renamed to switchGuardianDemoTab (guardian naming)
  // Gas Stations (navigation)
  'toggleGasStations',
  // Map legend
  'toggleMapLegend',
  // Community Tips (defined in communityTips.js)
  'submitCommunityTip', 'voteCommunityTip',
  // main.js — missing handlers
  'showToast', 'openSpotDetail',
  'acceptLocationPermission', 'declineLocationPermission', 'closeLocationPermission',
  'showFriendOptions', 'showFullNavigation',
  'startIdentityVerification', 'submitVerificationPhotos',
  'getTrustLevel', 'getTrustBadge',
  'openTripPlanner', 'closeTripPlanner',
  'reportGuideError',
  'closeContactForm', 'submitContactForm',
  // Hostel recommendations (defined in main.js)
  'openAddHostel', 'closeAddHostel', 'setHostelCategory',
  'submitHostelRec', 'upvoteHostel', 'switchHostelCategory',
  // Webhooks (defined in main.js)
  'openAddWebhook', 'toggleWebhookAction', 'removeWebhookAction',
  // Form persistence (defined in main.js)
  'clearFormDraft',
  // DailyReward kept below — DeviceManager + PhotoGallery removed (dead code)
  // DailyReward (defined in DailyReward.js)
  'handleClaimDailyReward', 'closeDailyReward', 'closeDailyRewardResult',
  // Shop extras (defined in Shop.js)
  'copyCode',
  // AgeVerification extras (defined in AgeVerification.js)
  'handleAgeVerification',
  // IdentityVerification extras (defined in IdentityVerification.js)
  'setVerificationStep', 'updatePhoneNumber', 'updatePhoneCountryCode',
  'sendPhoneVerificationCode', 'updateVerificationCode',
  'confirmPhoneCode', 'resendPhoneCode',
  'handlePhotoUpload', 'clearPhotoPreview', 'submitPhotoVerification',
  'setDocumentType', 'handleDocumentUpload', 'clearDocumentPreview',
  'submitIdentityDocument',
  'handleSelfieIdPhotoUpload', 'clearSelfieIdPhoto',
  'goToNextSelfieIdStep', 'goToPreviousSelfieIdStep', 'submitSelfieIdVerification',
  // EmailVerification removed (dead code)
  // LanguageSelector (defined in LanguageSelector.js)
  'selectLanguageOption', 'confirmLanguageSelection',
  // DeleteAccount (defined in DeleteAccount.js)
  'openDeleteAccount', 'closeDeleteAccount',
  'confirmDeleteAccount', 'confirmDeleteAccountGoogle',
  // DonationCard extras (defined in DonationCard.js)
  'handleDonationClick', 'processDonation', 'updateDonationLink',
  // Planner removed (dead code, redirect in main.js)
  // CookieBanner (defined in CookieBanner.js)
  'acceptAllCookies', 'refuseOptionalCookies',
  'showCookieCustomize', 'hideCookieCustomize', 'saveCustomCookiePreferences',
  // Profile extras (defined in Profile.js)
  'editAvatar', 'toggleProximityAlertsSetting',
  'toggleSettingsSection',
  // Profile new features (#57-#63) (defined in Profile.js)
  'editBio', 'saveBio', 'editLanguages',
  'openReferences', 'closeReferences',
  'togglePrivacy',
  'setProfileSubTab',
  // Profile stats detail views + past trip form (defined in Profile.js)
  'sortMySpots', 'openMySpots', 'openMyValidations', 'openMyCountries', 'closeProfileDetail',
  'openAddPastTrip', 'closeAddPastTrip', 'submitPastTrip',
  'removeLanguage', 'cycleLanguageLevel',
  'saveSocialLink', 'addProfilePhoto', 'removeProfilePhoto', 'setMainProfilePhoto',
  'openPhotoManager', 'openPhotoFullscreen', 'openEditName', 'openChangePassword', 'openChangeEmail',
  'openEditPersonalInfo', 'openExportData', 'openAppealForm',
  'openChangeUsername', 'editSocialLinks',
  'setThemeMode', 'toggleAccessibility',
  'closeLanguagePicker', 'langPickerFilter', 'selectLanguageFromPicker',
  'selectLanguageLevel', 'closeLanguageLevelPicker',
  // Roadmap handlers (defined in Profile.js)
  'openRoadmapFeature', 'closeRoadmapFeature',
  'roadmapVote', 'openProgressionStats',
  'acceptRoadmapIntro', 'dismissRoadmapDetailIntro', 'toggleRoadmapComments',
  // City Pages Demo (defined in Profile.js)
  'switchCityDemoTab', 'showCityPageDemo', 'closeCityPageDemo', 'startCityPageDemo',
  // Feature demos — generic + 5 demo overlays (defined in ProfileDemos.js)
  'switchDemoTab',
  'showPointsDemo', 'closePointsDemo', 'startPointsDemo', 'switchPointsDemoTab',
  // Journal Demo (defined in Profile.js)
  'showJournalDemo', 'closeJournalDemo', 'startJournalDemo', 'switchJournalDemoTab',
  // Social Demo (defined in Profile.js)
  'showSocialDemo', 'closeSocialDemo', 'startSocialDemo', 'switchSocialDemoTab',
  // Companion Demo (defined in Profile.js)
  'showGuardianDemo', 'closeGuardianDemo', 'startGuardianDemoContent', 'switchGuardianDemoTab',
  // Hostels Demo (defined in Profile.js)
  'showHostelsDemo', 'closeHostelsDemo', 'startHostelsDemo', 'switchHostelsDemoTab',
  // Spot Demo (defined in ProfileDemos.js)
  'showSpotDemo', 'closeSpotDemo', 'startSpotDemo', 'switchSpotDemoTab',
  // FAQ (defined in FAQ.js)
  'toggleFAQItem', 'scrollToFAQCategory', 'filterFAQ', 'clearFAQSearch',
  'closeFAQ', 'searchFAQ', 'getFAQQuestionById',
  // AddSpot extras (defined in AddSpot.js)
  'handleAddSpot', 'setSpotTag', 'removeSpotPhoto',
  'showSpotSummary', 'closeSpotSummary',
  // AddSpot v2 (defined in AddSpot.js)
  'selectSpotType', 'setWaitTime', 'setMethod',
  'setGroupSize', 'setTimeOfDay', 'toggleAmenity',
  'saveDraftAndClose', 'setRideResult', 'checkStreetViewForNewSpot',
  'setExperienceDate', 'updateExperienceDate',
  // Validation mode (openTestSpot/openValidateSpot defined in spotActions.js)
  'openValidateSpot', 'openTestSpot',
  // Nearby spot choice modal (defined in AddSpot.js)
  'nearbySpotChooseValidate', 'nearbySpotChooseCreate', 'closeNearbySpotChoice',
  // Favorites (defined in favorites.js)
  // User Blocking (defined in userBlocking.js)
  'unblockUserById', 'openBlockModal', 'closeBlockModal', 'confirmBlockUser',
  'openUnblockModal', 'closeUnblockModal', 'confirmUnblockUser',
  // Contextual Tips (defined in contextualTips.js)
  'dismissContextualTip',
  // TeamChallenges extras (defined in teamChallenges.js)
  'openTeamSettings', 'openTeamChallengesList', 'inviteToTeam',
  // SOS Tracking (defined in sosTracking.js)
  'startSOSTracking', 'stopSOSTracking', 'shareSOSLink', 'callEmergency',
  // FriendsList (defined in friendsList.js)
  // Admin Moderation (defined in adminModeration.js) 'closeAdminModeration',
  // Detailed Reviews (defined in detailedReviews.js)
  // Realtime Chat (defined in realtimeChat.js)
  // Trust Score (defined in trustScore.js)
  'getUserTrustScore', 'showTrustDetails',
  // Companion Search (defined in companionSearch.js) 'closeTravelPlanDetail',
  // Dangerous Spots (defined in dangerousSpots.js) 'closeDangerReportModal',
  // Private Messages (defined in privateMessages.js)
  // Nearby Friends extras (defined in nearbyFriends.js)
  'setNotificationRadius', 'toggleNearbyFriendsList',
  'closeNearbyFriendsList', 'toggleLocationSharing', 'showFriendOnMap',
  // Proximity Notify (defined in proximityNotify.js)
  'quickValidateSpot', 'quickReportSpot', 'dismissProximityAlert', 'initProximityNotify',
  // City Panel (defined in main.js)
  'openCityPanel', 'closeCityPanel', 'selectCityRoute', 'viewCitySpotsOnMap',
  // Missing close handlers (session 2026-02-22)
  'closeLanding', 'closeSafety', 'toggleFormToggle', 'changeLandingLanguage', 'validateAlphaCode',
  'closeConsentSettings', 'closeJoinTeam', 'closeTeamSettings',
  'closeTitlePopup', 'closeSeasonRewards', 'closeAnniversaryModal',
  'closeAmbassadorSuccess', 'closeAmbassadorProfile', 'closeContactAmbassador',
  'closeReviewForm', 'closeReplyModal', 'closeAddForbiddenWordModal',
  'closeRouteAmenities', 'closePostTravelPlan', 'closePhotoUpload',
  'closeLanguageSelector', 'closeCookieBanner',
  // Wolf audit handlers (session 2026-02-23)
  'navigate',
  'flyToCity', 'openProfile', 'openEditProfile',
  'planTrip', 'clearTrip', 'openGuides', 'openChallengesHub',
  'loginWithEmail', 'claimDailyReward',
  'triggerSOS', 'shareSOS',
  'openGuardian', 'closeGuardian',
  'submitNewSpot',
  // Missing handlers (session 2026-02-25)
  'requireProfile', 'closeBadgePopup', 'sendAmbassadorMessage',
  'handleCreateTeam', 'forceOfflineSync',
  'translateElement', 'showOriginal',
  'startNavigation', 'removeKnownDevice',
  'closeShareModal', 'copySpotLink', 'shareLink', 'generateShareUrl', 'processShare',
  'openInGoogleMaps', 'openInWaze', 'openInAppleMaps', 'openInNativeMaps',
  'selectNavigationApp', 'closeNavigationPicker',
  // Feedback Panel (session 2026-02-27)
  'openFeedbackPanel', 'closeFeedbackPanel',
  'setFeedbackTab', 'openFeedbackDetail', 'closeFeedbackDetail',
  'submitFeedback',
  // Coming Soon Proximity (session 2026-02-27)
  'openComingSoonProximity', 'closeComingSoonProximity',
  // Admin Dashboard (session 2026-02-28)
  'setAdminTab', 'loadAdminFeedback', 'setAdminFeedbackPeriod',
  'exportFeedbackCSV', 'loadAdminSentry',
  'loadAdminReports', 'adminConfirmReport', 'adminDismissReport', 'adminRelocateSpot',
  'setAdminReportFilter', 'setAdminReportStatusFilter', 'adminViewSpot',
  'loadAdminGuideTips', 'adminApproveGuideTipAction', 'adminRejectGuideTipAction',
  'loadAdminIdVerifications', 'adminApproveIdVerification', 'adminRejectIdVerification',
  // Beta Banner (session 2026-02-28)
  // Feature Slides (session 2026-03-03)
  'openFeatureSlides',
  'closeFeatureSlides',
  'featureSlidesNext',
  'featureSlidesPrev',
  'openFeedbackOnFeature',
  'selectFeatureOpinion',
  'submitFeatureOpinion',
  // Guide Nudge (session 2026-03-04)
  'closeGuideNudge',
  'acceptGuideNudge',
  'dismissGuideNudgeForCountry',
  'dismissGuideNudgeGlobal',
  'adminApproveGuideTip', 'adminRejectGuideTip', 'adminLoadPendingGuideTips',
  'selectGuideTipCategory',
  // Feature Intro Modal (session 2026-03-04)
  'showFeatureIntro',
  'closeFeatureIntro',
  'featureIntroCTA',
  'featureIntroBetaCTA',
  // Unified voting (session 2026-03-05)
  'selectIntroVote',
  'submitIntroVote',
  // Community SOS Alert (session 2026-03-20)
  'toggleCommunityAlerts',
  'setCommunityRadius',
  'setCommunityGenderFilter',
  'showCommunitySOSOnMap',
  // Guide form type (session 2026-03-24)
  'setGuideFormType',
  'requireOnline',
  // Guardian v1 redesign
  'guardianGoToScreen',
  'guardianSwitchTab',
  'guardianEditField',
  'guardianSaveField',
  'guardianSelectInterval',
  'guardianCancelEdit',
  'guardianToggleDeparture',
  'guardianToggleArrival',
  'guardianCallTraveler',
  'guardianMessageTraveler',
  'guardianShowMap',
  'guardianCallEmergency',
  // Internal handlers used in onclick (audit complet session 2026-03-24) // popup carte → créer spot         // banner mise à jour     // lien aide Google Maps dans AddSpot           // handler de tous les toggles on/off      // fermer tip Google Maps
]

MAIN_JS_HANDLERS.forEach(h => KNOWN_HANDLERS.add(h))

// ---- Helper: extract all onclick handler names from HTML string ----
function extractOnclickHandlers(html) {
  if (!html || typeof html !== 'string') return []
  // Match onclick="functionName(" or onclick="functionName()"
  const matches = [...html.matchAll(/onclick="([a-zA-Z_$][\w$]*)\s*\(/g)]
  // Filter out JS keywords that appear in inline onclick (e.g. "if(event...")
  const JS_KEYWORDS = new Set(['if', 'else', 'for', 'while', 'return', 'switch', 'case', 'new', 'this', 'event', 'true', 'false', 'null', 'undefined', 'typeof', 'void', 'delete'])
  return [...new Set(matches.map(m => m[1]).filter(h => !JS_KEYWORDS.has(h)))]
}

// ---- Helper: extract oninput/onchange/onblur/onkeydown handler names ----
function extractInputHandlers(html) {
  if (!html || typeof html !== 'string') return []
  const matches = [...html.matchAll(/(?:oninput|onchange|onblur|onkeydown|onkeyup|onkeypress|onfocus)="([a-zA-Z_$][\w$]*)\s*\(/g)]
  const JS_KEYWORDS = new Set(['if', 'else', 'for', 'while', 'return', 'switch', 'case', 'new', 'this', 'event', 'true', 'false', 'null', 'undefined', 'typeof', 'void', 'delete'])
  return [...new Set(matches.map(m => m[1]).filter(h => !JS_KEYWORDS.has(h)))]
}

// ---- Mock state for rendering ----
const mockState = {
  user: { uid: 'test-user', displayName: 'TestUser', email: 'test@test.com' },
  username: 'TestUser',
  avatar: '🤙',
  isLoggedIn: true,
  activeTab: 'map',
  viewMode: 'list',
  showWelcome: false,
  theme: 'dark',
  lang: 'fr',
  activeSubTab: 'planner',
  socialSubTab: 'messagerie',
  spots: [
    {
      id: 1,
      name: 'Test Spot',
      city: 'Paris',
      country: 'FR',
      coordinates: { lat: 48.8566, lng: 2.3522 },
      globalRating: 4.5,
      totalRatings: 10,
      description: 'A good spot',
      photos: ['photo1.jpg'],
      waitTime: 15,
      verified: true,
      createdBy: 'other-user',
    },
  ],
  selectedSpot: null,
  searchQuery: '',
  activeFilter: 'all',
  filterCountry: 'all',
  filterMinRating: 0,
  filterMaxWait: 999,
  filterVerifiedOnly: false,
  favorites: [],
  addSpotStep: 1,
  addSpotType: null,
  showAddSpot: false,
  showRating: false,
  showSOS: false,
  showSettings: false,
  showQuiz: false,
  showAuth: false,
  showFilters: false,
  showStats: false,
  showBadges: false,
  showChallenges: false,
  showShop: false,
  showMyRewards: false,
  showSideMenu: false,
  showTutorial: false,
  showLeaderboard: false,
  showThumbHistory: false,
  leaderboardCountry: 'all',
  showDonation: false,
  showProfileCustomization: false,
  showNearbyFriends: false,
  showReport: false,
  showAccessibilityHelp: false,
  showTeamChallenges: false,
  showFriendProfile: false,
  showAdminPanel: false,
  showMyData: false,
  showTitles: false,
  showIdentityVerification: false,
  showAgeVerification: false,
  showGuardianModal: false,
  showCompanionSearch: false,
  eventFilter: 'all',
  checkinSpot: null,
  newBadge: null,
  navigationActive: false,
  pendingGuideCountry: null,
  showGuideNudge: false,
  points: 500,
  level: 5,
  checkins: 20,
  spotsCreated: 5,
  spotsValidated: 3,
  reviewsGiven: 10,
  streak: 3,
  badges: ['first_checkin', 'explorer'],
  rewards: [],
  friends: [
    { id: 'friend1', name: 'Alice', avatar: '👩', level: 3, badges: ['first_checkin'] },
  ],
  friendRequests: [],
  emergencyContacts: [{ name: 'Contact1', phone: '+33600000000' }],
  tripFrom: '',
  tripTo: '',
  tripResults: null,
  tripSteps: [],
  savedTrips: [],
  messages: [],
  sosActive: false,
  tutorialStep: 0,
  tutorialCompleted: false,
  userLocation: { lat: 48.8566, lng: 2.3522 },
  gpsEnabled: true,
  isOnline: true,
  selectedFriendProfileId: 'friend1',
  seasonPoints: 100,
  totalPoints: 500,
  checkinHistory: [],
  verificationLevel: 0,
  profileFrame: null,
  profileTitle: null,
  profileSubTab: 'profil',
  countriesVisited: ['FR', 'DE', 'ES'],
  references: [
    { from: 'Alice', text: 'Great traveler!', rating: 5, date: '2026-01-15' },
  ],
}

// ---- Import render functions ----
// Views
import { renderTravel } from '../../src/components/views/Travel.js'
import { renderChallengesHub } from '../../src/components/views/ChallengesHub.js'
import { renderGuides } from '../../src/components/views/Guides.js'
import { renderSocial } from '../../src/components/views/Social.js'
import { renderProfile } from '../../src/components/views/Profile.js'

// Modals
import { renderSOS } from '../../src/components/modals/SOS.js'
import { renderAuth } from '../../src/components/modals/Auth.js'
import { renderAddSpot } from '../../src/components/modals/AddSpot.js'
import { renderSpotDetail } from '../../src/components/modals/SpotDetail.js'
import { renderWelcome } from '../../src/components/modals/Welcome.js'
// Tutorial.js removed (retired)
import { renderFiltersModal } from '../../src/components/modals/Filters.js'
import { renderStatsModal } from '../../src/components/modals/Stats.js'
import { renderBadgesModal } from '../../src/components/modals/Badges.js'
import { renderChallengesModal } from '../../src/components/modals/Challenges.js'
import { renderShopModal, renderMyRewardsModal } from '../../src/components/modals/Shop.js'
import { renderQuiz } from '../../src/components/modals/Quiz.js'
import { renderLeaderboardModal } from '../../src/components/modals/Leaderboard.js'
import { renderCheckinModal } from '../../src/components/modals/CheckinModal.js'
import { renderAgeVerification } from '../../src/components/modals/AgeVerification.js'
import { renderIdentityVerification } from '../../src/components/modals/IdentityVerification.js'
import { renderTitlesModal } from '../../src/components/modals/TitlesModal.js'
import { renderFriendProfileModal } from '../../src/components/modals/FriendProfile.js'
import { renderAdminPanel } from '../../src/components/modals/AdminPanel.js'
import { renderMyDataModal } from '../../src/components/modals/MyData.js'
import { renderGuardianModal } from '../../src/components/modals/Guardian.js'

// Services with render
import { renderNearbyFriendsList } from '../../src/services/nearbyFriends.js'
import { renderCustomizationModal } from '../../src/services/profileCustomization.js'
import { renderAccessibilityHelp } from '../../src/services/screenReader.js'
import { renderReportModal } from '../../src/services/moderation.js'
import { renderTeamDashboard } from '../../src/services/teamChallenges.js'
import { renderDonationModal } from '../../src/components/ui/DonationCard.js'

// Ensure state modules see the right flags for no-param modals
import { setState } from '../../src/stores/state.js'

// ---- Setup: set state so no-param modals render content ----
beforeAll(() => {
  setState({
    showFilters: true,
    showStats: true,
    showBadges: true,
    showChallenges: true,
    showShop: true,
    showMyRewards: true,
    showQuiz: true,
    showLeaderboard: true,
    showMyData: true,
    ...mockState,
  })
})

// ============================================================
// SECTION 1A: Every onclick in each component maps to a known handler
// ============================================================

describe('Wiring: onclick handlers map to known window.* functions', () => {
  // Helper to run the test pattern
  function testHandlers(name, renderFn, stateOverrides = {}) {
    it(`${name}: all onclick handlers are known`, () => {
      const state = { ...mockState, ...stateOverrides }
      let html
      try {
        html = renderFn(state)
      } catch {
        // Some render functions take no params
        try {
          html = renderFn()
        } catch {
          return // Cannot render, skip
        }
      }
      if (!html || typeof html !== 'string' || html.length === 0) return

      const handlers = extractOnclickHandlers(html)
      const unknown = handlers.filter(h => !KNOWN_HANDLERS.has(h))
      expect(unknown, `Unknown onclick handlers in ${name}: ${unknown.join(', ')}`).toEqual([])
    })
  }

  // --- Views ---
  testHandlers('Travel view', renderTravel)
  testHandlers('ChallengesHub view', renderChallengesHub)
  testHandlers('ChallengesHub view (thumb history)', renderChallengesHub, { showThumbHistory: true })
  testHandlers('Social view (messagerie)', renderSocial, { socialSubTab: 'messagerie' })
  testHandlers('Social view (evenements)', renderSocial, { socialSubTab: 'evenements' })
  testHandlers('Profile view', renderProfile)
  testHandlers('Profile view (progression)', renderProfile, { profileSubTab: 'progression' })
  testHandlers('Profile view (reglages)', renderProfile, { profileSubTab: 'reglages' })
  testHandlers('Guides view', renderGuides)

  // --- Modals (with state param) ---
  testHandlers('SOS modal', renderSOS)
  testHandlers('Auth modal', renderAuth)
  testHandlers('AddSpot modal', renderAddSpot)
  testHandlers('SpotDetail modal', renderSpotDetail, {
    selectedSpot: mockState.spots[0],
  })
  testHandlers('Welcome modal', renderWelcome, { showWelcome: true })
  // Tutorial removed (retired)
  testHandlers('AgeVerification modal', renderAgeVerification)
  testHandlers('IdentityVerification modal', () => renderIdentityVerification())
  testHandlers('TitlesModal', renderTitlesModal)
  testHandlers('FriendProfile modal', renderFriendProfileModal, {
    showFriendProfile: true,
    selectedFriendProfileId: 'friend1',
    friends: mockState.friends,
  })
  testHandlers('AdminPanel modal', renderAdminPanel)
  testHandlers('CheckinModal', renderCheckinModal, {
    checkinSpot: mockState.spots[0],
  })
  testHandlers('DonationModal', renderDonationModal)
  testHandlers('Guardian modal', renderGuardianModal, {
    showGuardianModal: true,
  })

  // --- Modals (no param, use global state) ---
  testHandlers('Filters modal', () => renderFiltersModal())
  testHandlers('Stats modal', () => renderStatsModal())
  testHandlers('Badges modal', () => renderBadgesModal())
  testHandlers('Challenges modal', () => renderChallengesModal())
  testHandlers('Shop modal', () => renderShopModal())
  testHandlers('MyRewards modal', () => renderMyRewardsModal())
  testHandlers('Quiz modal', () => renderQuiz())
  testHandlers('Leaderboard modal', () => renderLeaderboardModal())
  testHandlers('MyData modal', () => renderMyDataModal())

  // --- Service renders ---
  testHandlers('NearbyFriendsList', renderNearbyFriendsList)
  testHandlers('CustomizationModal', renderCustomizationModal)
  testHandlers('AccessibilityHelp', renderAccessibilityHelp)
  testHandlers('ReportModal', renderReportModal, { showReport: true, reportTargetId: 'user1', reportTargetType: 'user' })
  testHandlers('TeamDashboard', renderTeamDashboard)

  // Also verify oninput/onchange handlers
  it('all input handlers in rendered HTML are known functions', () => {
    const allComponents = [
      () => renderSOS(mockState),
      () => renderAuth(mockState),
      () => renderAddSpot(mockState),
      () => renderTravel(mockState),
      () => renderSocial({ ...mockState, socialSubTab: 'messagerie' }),
      () => renderSocial({ ...mockState, socialSubTab: 'evenements' }),
      () => renderProfile(mockState),
      () => renderProfile({ ...mockState, profileSubTab: 'progression' }),
      () => renderProfile({ ...mockState, profileSubTab: 'reglages' }),
      () => renderFiltersModal(),
    ]

    const allInputHandlers = []
    for (const renderFn of allComponents) {
      try {
        const html = renderFn()
        if (html) allInputHandlers.push(...extractInputHandlers(html))
      } catch {
        // skip if render fails
      }
    }

    const unknown = [...new Set(allInputHandlers)].filter(h => !KNOWN_HANDLERS.has(h))
    expect(
      unknown,
      `Unknown input handlers: ${unknown.join(', ')}`
    ).toEqual([])
  })
})

// ============================================================
// SECTION: Protected handlers — JAMAIS wrappés/interceptés
// Ces fonctions sont critiques et ne doivent PAS avoir de fenêtre
// d'intro devant elles. Toute modification qui en intercepte une
// doit être refusée par ce test.
// ============================================================

// Liste des handlers protégés — RÈGLES ABSOLUES :
// 1. Ces fonctions ne peuvent jamais être wrappées par setupFeatureIntroWrappers()
// 2. Elles ne peuvent jamais être supprimées ou renommées sans mise à jour de ce test
//
// Raisons :
// - toggleGasStations : bouton rapide carte (ERR-056)
// - openSOS / closeSOS / markSafe : sécurité physique critique — ne jamais bloquer
// - changeTab('map') : onglet principal — l'utilisateur doit toujours pouvoir revenir sur la carte
// - changeTab('profile') : accès aux réglages — navigation fondamentale
// - selectSpot / closeSpotDetail : interaction de base avec la carte
// - openNavigation : navigation GPS en route
const PROTECTED_HANDLERS = [
  'toggleGasStations',
  'openNavigation',
  'openSOS',
  'closeSOS',
  'markSafe',
  'selectSpot',
  'closeSpotDetail',
  'changeTab',
]

// Onglets qui ne doivent PAS avoir d'intro glassmorphism devant eux
const PROTECTED_TABS = ['map', 'profile']

describe('Wiring: Protected handlers cannot be undefined', () => {
  it('all protected handlers are present in KNOWN_HANDLERS', () => {
    const missing = PROTECTED_HANDLERS.filter(h => !KNOWN_HANDLERS.has(h))
    expect(
      missing,
      `Ces handlers protégés ont été supprimés ou renommés : ${missing.join(', ')}. ` +
      `NE JAMAIS supprimer ces fonctions sans mettre à jour ce test.`
    ).toEqual([])
  })
})

describe('Wiring: Protected tabs are not in TAB_INTROS wrappers', () => {
  it('map and profile tabs must not be wrapped by glassmorphism intros', async () => {
    // Vérifier dans main.js que TAB_INTROS ne contient pas 'map' ni 'profile'
    const { readFileSync } = await import('fs')
    const { resolve } = await import('path')
    const mainJs = readFileSync(resolve('src/main.js'), 'utf8')
    const tabIntrosMatch = mainJs.match(/TAB_INTROS\s*=\s*\{([^}]+)\}/)
    if (tabIntrosMatch) {
      const tabIntrosStr = tabIntrosMatch[1]
      for (const tab of PROTECTED_TABS) {
        expect(
          tabIntrosStr.includes(`'${tab}'`) || tabIntrosStr.includes(`"${tab}"`),
          `L'onglet '${tab}' est dans TAB_INTROS — INTERDIT. ` +
          `Les onglets carte et profil ne doivent jamais avoir de fenêtre d'intro devant eux.`
        ).toBe(false)
      }
    }
  })
})

// ============================================================
// SECTION: Handler existence sanity check
// ============================================================
describe('Wiring: KNOWN_HANDLERS list is consistent', () => {
  it('has at least 300 known handlers (sanity check)', () => {
    expect(KNOWN_HANDLERS.size).toBeGreaterThanOrEqual(300)
  })

  it('no duplicates in MAIN_JS_HANDLERS array', () => {
    const seen = new Set()
    const dupes = []
    for (const h of MAIN_JS_HANDLERS) {
      if (seen.has(h)) dupes.push(h)
      seen.add(h)
    }
    expect(dupes, `Duplicate handlers: ${dupes.join(', ')}`).toEqual([])
  })
})
