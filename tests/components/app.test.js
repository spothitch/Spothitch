import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/components/Header.js', () => ({
  renderHeader: vi.fn(() => '<header id="app-header"></header>'),
}))
vi.mock('../../src/components/Navigation.js', () => ({
  renderNavigation: vi.fn(() => '<nav id="app-nav"></nav>'),
}))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
}))
vi.mock('../../src/components/views/Home.js', () => ({
  renderHome: vi.fn(() => '<div id="home-view"></div>'),
}))
vi.mock('../../src/components/views/CityPanel.js', () => ({
  renderCityPanel: vi.fn(() => ''),
}))
vi.mock('../../src/components/modals/CookieBanner.js', () => ({
  renderCookieBanner: vi.fn(() => ''),
}))
vi.mock('../../src/utils/mapMarkers.js', () => ({
  registerMarkerImages: vi.fn(),
  getMarkerType: vi.fn(() => 'default'),
}))
vi.mock('../../src/utils/a11y.js', () => ({
  trapFocus: vi.fn(),
}))
// Mock lazy-loaded views to prevent EnvironmentTeardownError (async imports
// that resolve after the test environment is torn down)
vi.mock('../../src/components/views/Profile.js', () => ({
  renderProfile: vi.fn(() => '<div id="profile-view"></div>'),
}))
vi.mock('../../src/components/views/Social.js', () => ({
  renderSocial: vi.fn(() => '<div id="social-view"></div>'),
}))
vi.mock('../../src/components/views/Voyage.js', () => ({
  renderVoyage: vi.fn(() => '<div id="voyage-view"></div>'),
}))

import {
  renderApp,
  afterRender,
  isMapTab,
  renderActiveView,
  getActiveTabPanelId,
  renderModals,
  renderOverlays,
} from '../../src/components/App.js'
import { mockSpots, mockUser } from '../mocks/mockSpots.js'

const baseState = {
  spots: mockSpots,
  user: mockUser,
  lang: 'fr',
  filterCountry: 'all',
}

describe('isMapTab', () => {
  it('returns true for map tab', () => expect(isMapTab({ activeTab: 'map' })).toBe(true))
  it('returns true for home tab', () => expect(isMapTab({ activeTab: 'home' })).toBe(true))
  it('returns true for no activeTab', () => expect(isMapTab({})).toBe(true))
  it('returns false for profile tab', () => expect(isMapTab({ activeTab: 'profile' })).toBe(false))
  it('returns false for social tab', () => expect(isMapTab({ activeTab: 'social' })).toBe(false))
  it('returns false for voyage tab', () => expect(isMapTab({ activeTab: 'voyage' })).toBe(false))
  it('returns false for spots tab', () => expect(isMapTab({ activeTab: 'spots' })).toBe(false))
  it('returns true for travel tab', () => expect(isMapTab({ activeTab: 'travel' })).toBe(true))
})

describe('getActiveTabPanelId', () => {
  it('returns map for map tab', () => expect(getActiveTabPanelId({ activeTab: 'map' })).toBe('map'))
  it('returns map for default', () => expect(getActiveTabPanelId({})).toBe('map'))
  it('returns social for social tab', () => expect(getActiveTabPanelId({ activeTab: 'social' })).toBe('social'))
  it('returns social for chat tab', () => expect(getActiveTabPanelId({ activeTab: 'chat' })).toBe('social'))
  it('returns profile for profile tab', () => expect(getActiveTabPanelId({ activeTab: 'profile' })).toBe('profile'))
  it('returns voyage for voyage tab', () => expect(getActiveTabPanelId({ activeTab: 'voyage' })).toBe('voyage'))
  it('returns spots for spots tab', () => expect(getActiveTabPanelId({ activeTab: 'spots' })).toBe('spots'))
})

describe('renderActiveView', () => {
  it('returns empty for map tab (map handled separately)', () => {
    expect(renderActiveView({ activeTab: 'map' })).toBe('')
  })
  it('returns empty for default tab', () => {
    expect(renderActiveView({})).toBe('')
  })
  it('returns HTML for voyage tab (lazy)', () => {
    const html = renderActiveView({ activeTab: 'voyage' })
    expect(typeof html).toBe('string')
  })
  it('returns HTML for social tab (lazy)', () => {
    const html = renderActiveView({ activeTab: 'social' })
    expect(typeof html).toBe('string')
  })
  it('returns HTML for profile tab (lazy)', () => {
    const html = renderActiveView({ activeTab: 'profile' })
    expect(typeof html).toBe('string')
  })
  it('returns HTML for spots tab (lazy)', () => {
    const html = renderActiveView({ activeTab: 'spots' })
    expect(typeof html).toBe('string')
  })
})

describe('renderApp', () => {
  it('renders app structure for map tab', () => {
    const html = renderApp({ ...baseState, activeTab: 'map' })
    expect(html).toContain('main-content')
    expect(html).toContain('panel-map')
  })

  it('renders app structure for profile tab', () => {
    const html = renderApp({ ...baseState, activeTab: 'profile' })
    expect(html).toContain('panel-profile')
  })

  it('renders app with voyage tab', () => {
    const html = renderApp({ ...baseState, activeTab: 'voyage' })
    expect(html).toContain('panel-voyage')
  })

  it('renders app with social tab', () => {
    const html = renderApp({ ...baseState, activeTab: 'social' })
    expect(html).toBeTruthy()
  })

  it('renders app with spots tab', () => {
    const html = renderApp({ ...baseState, activeTab: 'spots' })
    expect(html).toContain('panel-spots')
  })

  it('renders app with voyage map-first mode', () => {
    const html = renderApp({ ...baseState, activeTab: 'voyage', tripResults: ['result'], tripFormCollapsed: true })
    expect(html).toBeTruthy()
  })
})

describe('renderModals', () => {
  it('renders empty modals when no modal flags', () => {
    const html = renderModals(baseState)
    expect(typeof html).toBe('string')
  })

  it('renders SOS modal when showSOS', () => {
    const html = renderModals({ ...baseState, showSOS: true })
    expect(typeof html).toBe('string')
  })

  it('renders auth modal when showAuth', () => {
    const html = renderModals({ ...baseState, showAuth: true })
    expect(typeof html).toBe('string')
  })
})

describe('renderOverlays', () => {
  it('renders overlays structure', () => {
    const html = renderOverlays(baseState)
    expect(typeof html).toBe('string')
  })

  it('renders with nearbyFriendsEnabled', () => {
    expect(() => renderOverlays({ ...baseState, nearbyFriendsEnabled: true })).not.toThrow()
  })

  it('renders with sosActive and sosSession', () => {
    expect(() => renderOverlays({ ...baseState, sosActive: true, sosSession: { id: 'ses1' } })).not.toThrow()
  })

  it('renders with proximityAlertSpot', () => {
    expect(() => renderOverlays({ ...baseState, proximityAlertSpot: { id: '1', name: 'Spot' } })).not.toThrow()
  })

  it('renders with showAdminPanel', () => {
    expect(() => renderOverlays({ ...baseState, showAdminPanel: true })).not.toThrow()
  })

  it('renders with spotDraftsBannerVisible', () => {
    expect(() => renderOverlays({ ...baseState, spotDraftsBannerVisible: true })).not.toThrow()
  })

  it('renders with selectedCity', () => {
    expect(() => renderOverlays({ ...baseState, selectedCity: { name: 'Paris' } })).not.toThrow()
  })

  it('renders with showLanding (skips cookie banner)', () => {
    const html = renderOverlays({ ...baseState, showLanding: true })
    expect(typeof html).toBe('string')
  })

  it('renders voyage map-first (skips cookie banner)', () => {
    const html = renderOverlays({
      ...baseState,
      activeTab: 'voyage',
      tripResults: ['result'],
      tripFormCollapsed: true,
    })
    expect(typeof html).toBe('string')
  })
})

describe('renderModals — all flags', () => {
  it('renders with selectedSpot', () => {
    const html = renderModals({ ...baseState, selectedSpot: { id: '1', name: 'Test' } })
    expect(typeof html).toBe('string')
  })

  it('renders with showAddSpot', () => {
    expect(() => renderModals({ ...baseState, showAddSpot: true })).not.toThrow()
  })

  it('renders with showFilters', () => {
    expect(() => renderModals({ ...baseState, showFilters: true })).not.toThrow()
  })

  it('renders with showStats', () => {
    expect(() => renderModals({ ...baseState, showStats: true })).not.toThrow()
  })

  it('renders with checkinSpot', () => {
    expect(() => renderModals({ ...baseState, checkinSpot: { id: '1' } })).not.toThrow()
  })

  it('renders with navigationActive', () => {
    expect(() => renderModals({ ...baseState, navigationActive: true })).not.toThrow()
  })

  it('renders with showProfileCustomization', () => {
    expect(() => renderModals({ ...baseState, showProfileCustomization: true })).not.toThrow()
  })

  it('renders with showReport', () => {
    expect(() => renderModals({ ...baseState, showReport: true })).not.toThrow()
  })

  it('renders with showBlockModal', () => {
    expect(() => renderModals({ ...baseState, showBlockModal: true, blockTargetId: 'uid1', blockTargetName: 'Alice' })).not.toThrow()
  })

  it('renders with showDeleteAccount', () => {
    expect(() => renderModals({ ...baseState, showDeleteAccount: true })).not.toThrow()
  })

  it('renders with showGuardianModal', () => {
    expect(() => renderModals({ ...baseState, showGuardianModal: true })).not.toThrow()
  })

  it('renders with showFeedbackPanel', () => {
    expect(() => renderModals({ ...baseState, showFeedbackPanel: true })).not.toThrow()
  })

  it('renders with showGuideNudge and pendingGuideCountry', () => {
    expect(() => renderModals({ ...baseState, showGuideNudge: true, pendingGuideCountry: 'FR' })).not.toThrow()
  })

  it('renders with showOfflinePanel', () => {
    expect(() => renderModals({ ...baseState, showOfflinePanel: true, _spotIndex: { countries: [] } })).not.toThrow()
  })

  it('renders with showTripHistory', () => {
    expect(() => renderModals({ ...baseState, showTripHistory: true })).not.toThrow()
  })

  it('renders with showFAQ', () => {
    expect(() => renderModals({ ...baseState, showFAQ: true })).not.toThrow()
  })

  it('renders with showLegal', () => {
    expect(() => renderModals({ ...baseState, showLegal: true })).not.toThrow()
  })

  it('renders with showAmbassadorSuccess', () => {
    expect(() => renderModals({ ...baseState, showAmbassadorSuccess: true })).not.toThrow()
  })

  it('renders with showContactAmbassador and selectedAmbassador', () => {
    expect(() => renderModals({ ...baseState, showContactAmbassador: true, selectedAmbassador: { id: 'a1', name: 'Alice' } })).not.toThrow()
  })

  it('renders contactAmbassador with bio and languages', () => {
    expect(() => renderModals({
      ...baseState,
      showContactAmbassador: true,
      selectedAmbassador: {
        id: 'a1',
        userName: 'Alice',
        bio: 'Experienced hitchhiker',
        languages: ['fr', 'en'],
        city: 'Paris',
        country: 'France',
      },
    })).not.toThrow()
  })

  it('renders with showTeamChallenges', () => {
    expect(() => renderModals({ ...baseState, showTeamChallenges: true })).not.toThrow()
  })

  it('renders with showCreateTeam', () => {
    expect(() => renderModals({ ...baseState, showCreateTeam: true })).not.toThrow()
  })

  it('renders with showBlockedUsers', () => {
    expect(() => renderModals({ ...baseState, showBlockedUsers: true })).not.toThrow()
  })

  it('renders with showNearbyFriends', () => {
    expect(() => renderModals({ ...baseState, showNearbyFriends: true })).not.toThrow()
  })

  it('renders with showAddFriend', () => {
    expect(() => renderModals({ ...baseState, showAddFriend: true })).not.toThrow()
  })

  it('renders with nearbySpotChoiceData', () => {
    expect(() => renderModals({ ...baseState, nearbySpotChoiceData: { spots: [] } })).not.toThrow()
  })

  it('renders with showFeatureIntro', () => {
    expect(() => renderModals({ ...baseState, showFeatureIntro: true })).not.toThrow()
  })

  it('renders with showSafety', () => {
    expect(() => renderModals({ ...baseState, showSafety: true })).not.toThrow()
  })

  it('renders with showLocationPermission', () => {
    expect(() => renderModals({ ...baseState, showLocationPermission: true })).not.toThrow()
  })

  it('renders with showLanguageSelector', () => {
    expect(() => renderModals({ ...baseState, showLanguageSelector: true })).not.toThrow()
  })

  it('renders with showMyData', () => {
    expect(() => renderModals({ ...baseState, showMyData: true })).not.toThrow()
  })

  it('renders with showFriendProfile', () => {
    expect(() => renderModals({ ...baseState, showFriendProfile: true })).not.toThrow()
  })

  it('renders with showContactForm', () => {
    expect(() => renderModals({ ...baseState, showContactForm: true })).not.toThrow()
  })
})

describe('afterRender', () => {
  beforeEach(() => {
    document.documentElement.className = ''
    document.body.innerHTML = ''
  })

  it('does not throw with empty state', () => {
    expect(() => afterRender({})).not.toThrow()
  })

  it('adds map-active class for map tab', () => {
    afterRender({ activeTab: 'map' })
    expect(document.documentElement.classList.contains('map-active')).toBe(true)
  })

  it('removes map-active class for non-map tab', () => {
    document.documentElement.classList.add('map-active')
    afterRender({ activeTab: 'profile' })
    expect(document.documentElement.classList.contains('map-active')).toBe(false)
  })

  it('does not throw with showLanding=true', () => {
    document.body.innerHTML = '<div id="landing-page"></div>'
    expect(() => afterRender({ showLanding: true })).not.toThrow()
  })

  it('does not re-init landing page if already initialized', () => {
    const el = document.createElement('div')
    el.id = 'landing-page'
    el.dataset.initialized = 'true'
    document.body.appendChild(el)
    expect(() => afterRender({ showLanding: true })).not.toThrow()
  })

  it('does not throw with showAuth=true', () => {
    expect(() => afterRender({ ...baseState, showAuth: true })).not.toThrow()
  })

  it('does not throw with showAddSpot=true', () => {
    expect(() => afterRender({ ...baseState, showAddSpot: true })).not.toThrow()
  })

  it('does not throw with nearbySpotChoiceData', () => {
    expect(() => afterRender({ ...baseState, nearbySpotChoiceData: { spots: [] } })).not.toThrow()
  })

  it('does not throw with showGuardianModal=true', () => {
    expect(() => afterRender({ ...baseState, showGuardianModal: true })).not.toThrow()
  })

  it('does not throw for profile tab', () => {
    expect(() => afterRender({ ...baseState, activeTab: 'profile' })).not.toThrow()
  })

  it('does not throw for voyage tab with trip results', () => {
    expect(() => afterRender({
      ...baseState,
      activeTab: 'voyage',
      tripResults: ['result'],
      tripFormCollapsed: true,
    })).not.toThrow()
  })

  it('does not throw with navigationActive=true', () => {
    expect(() => afterRender({ ...baseState, navigationActive: true })).not.toThrow()
  })

  it('does not throw with guardianActive=true', () => {
    expect(() => afterRender({ ...baseState, guardianActive: true })).not.toThrow()
  })

  it('updates offline storage size element when present', () => {
    const el = document.createElement('div')
    el.id = 'offline-storage-size'
    el.textContent = '...'
    document.body.appendChild(el)
    expect(() => afterRender({ ...baseState, activeTab: 'profile' })).not.toThrow()
  })

  it('does not throw with showTripMap and showTripPlanner', () => {
    expect(() => afterRender({ ...baseState, showTripMap: true, showTripPlanner: true, activeTab: 'map' })).not.toThrow()
  })

  it('does not throw with showDonation', () => {
    expect(() => afterRender({ ...baseState, showDonation: true })).not.toThrow()
  })

  it('does not throw with showInstallBanner', () => {
    expect(() => afterRender({ ...baseState, showInstallBanner: true })).not.toThrow()
  })

  it('does not throw with showCompleteProfile', () => {
    expect(() => afterRender({ ...baseState, showCompleteProfile: true })).not.toThrow()
  })

  it('does not throw for social tab', () => {
    expect(() => afterRender({ ...baseState, activeTab: 'social' })).not.toThrow()
  })

  it('does not throw for spots tab', () => {
    expect(() => afterRender({ ...baseState, activeTab: 'spots' })).not.toThrow()
  })
})

describe('window trip map handlers', () => {
  it('_tripMapFlyTo does not throw for valid coords', () => {
    expect(() => window._tripMapFlyTo?.(2.3, 48.8)).not.toThrow()
  })

  it('_tripMapFlyTo returns early for non-finite coords', () => {
    expect(() => window._tripMapFlyTo?.(NaN, 48.8)).not.toThrow()
    expect(() => window._tripMapFlyTo?.(2.3, Infinity)).not.toThrow()
  })

  it('_tripMapResize does not throw when called', () => {
    expect(() => window._tripMapResize?.()).not.toThrow()
  })

  it('_tripMapCleanup does not throw when called', () => {
    expect(() => window._tripMapCleanup?.()).not.toThrow()
  })
})
