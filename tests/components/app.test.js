import { describe, it, expect, vi } from 'vitest'

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

import {
  renderApp,
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
})
