import { describe, it, expect, beforeEach, vi } from 'vitest'

// closeModals.js uses `const setState = (s) => window.setState(s)`
// So we need to set window.setState before import
const mockSetState = vi.fn()
window.setState = mockSetState

await import('../../src/handlers/closeModals.js')

describe('closeModals handlers', () => {
  beforeEach(() => { mockSetState.mockClear() })

  const closeTests = [
    ['closeFavoritesOnMap', { showFavoritesOnMap: false, filterFavorites: false }],
    ['closeTitlePopup', { showTitlePopup: false, newTitle: null }],
    ['closeSeasonRewards', { showSeasonRewards: false }],
    ['closeAnniversaryModal', { showAnniversaryModal: false }],
    ['closeAmbassadorSuccess', { showAmbassadorSuccess: false }],
    ['closeReviewForm', { showReviewForm: false, reviewSpotId: null }],
    ['closeLanguageSelector', { showLanguageSelector: false }],
    ['closeSideMenu', { showSideMenu: false }],
    ['closeSafety', { showSafety: false }],
    ['closeLegal', { showLegal: false }],
    ['closeNearbyFriends', { showNearbyFriends: false }],
    ['closeTripHistory', { showTripHistory: false }],
    ['closeGuidesOverlay', { showGuidesOverlay: false }],
    ['closeDangerReportModal', { showDangerReport: false }],
    ['closeCookieBanner', { showCookieBanner: false }],
  ]

  for (const [handler, expectedState] of closeTests) {
    it(`${handler} calls setState with correct values`, () => {
      window[handler]?.()
      expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining(expectedState))
    })
  }
})
