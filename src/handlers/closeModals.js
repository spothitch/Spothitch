/**
 * Close Modal Handlers
 * One-liner setState handlers for closing modals/overlays.
 * Extracted from main.js to reduce its size.
 */

const setState = (s) => window.setState(s)

// Simple close handlers (setState only)
window.closeFavoritesOnMap = () => setState({ showFavoritesOnMap: false, filterFavorites: false })
window.closeTitlePopup = () => setState({ showTitlePopup: false, newTitle: null })
window.closeSeasonRewards = () => setState({ showSeasonRewards: false })
window.closeAnniversaryModal = () => setState({ showAnniversaryModal: false })
window.closeAmbassadorSuccess = () => setState({ showAmbassadorSuccess: false })
window.closeAmbassadorProfile = () => setState({ showAmbassadorProfile: false })
window.closeContactAmbassador = () => setState({ showContactAmbassador: false })
window.closeReviewForm = () => setState({ showReviewForm: false, reviewSpotId: null })
window.closeReplyModal = () => setState({ showReplyModal: false, replyToReviewId: null })
window.closeAddForbiddenWordModal = () => setState({ showAddForbiddenWordModal: false })
window.closeRouteAmenities = () => setState({ showRouteAmenities: false, routeAmenities: [] })
window.closePostTravelPlan = () => setState({ showPostTravelPlan: false })
window.closePhotoUpload = () => setState({ showPhotoUpload: false, photoUploadSpotId: null })
window.closeAdminModeration = () => setState({ showAdminModeration: false })
window.closeTravelPlanDetail = () => setState({ showTravelPlanDetail: false, selectedTravelPlan: null })
window.closeLanguageSelector = () => setState({ showLanguageSelector: false })
window.closeCookieBanner = () => setState({ showCookieBanner: false })
window.closeReportModal = () => window.closeReport?.()
window.closeDangerReportModal = () => setState({ showDangerReport: false })
window.closeGuidesOverlay = () => setState({ showGuidesOverlay: false })
window.closeSafety = () => setState({ showSafety: false })
window.closeLegal = () => setState({ showLegal: false })
window.closeSideMenu = () => setState({ showSideMenu: false })
window.closeNearbyFriends = () => setState({ showNearbyFriends: false })
window.closeTripHistory = () => setState({ showTripHistory: false })
