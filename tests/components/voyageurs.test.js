import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg data-icon="${name}"></svg>`),
}))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeHTML: vi.fn((s) => String(s || '')),
  escapeJSString: vi.fn((s) => String(s || '')),
}))
vi.mock('../../src/services/proximityRadar.js', () => ({
  getRadarSettings: vi.fn(() => ({ enabled: false, radius: 10, visibility: 'all' })),
  getRemainingCooldownMinutes: vi.fn(() => 0),
  isRadarInCooldown: vi.fn(() => false),
}))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
}))

import { renderVoyageurs } from '../../src/components/views/social/Voyageurs.js'
import { getRadarSettings, isRadarInCooldown } from '../../src/services/proximityRadar.js'

const baseState = {
  lang: 'fr',
  user: { uid: 'user-abc', username: 'TestUser' },
}

const mockBuddy = {
  id: 'buddy-001',
  userId: 'user-xyz',
  userName: 'Alice',
  from: 'Paris',
  to: 'Barcelona',
  departureDate: new Date(Date.now() + 86400000).toISOString(),
  country: 'FR',
  languages: ['fr', 'en'],
  gender: 'female',
  description: 'Première fois en stop !',
  createdAt: Date.now() - 3600000,
}

describe('renderVoyageurs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getRadarSettings.mockReturnValue({ enabled: false, radius: 10, visibility: 'all' })
    isRadarInCooldown.mockReturnValue(false)
  })

  it('renders combined view by default', () => {
    const html = renderVoyageurs(baseState)
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(50)
  })

  it('renders combined view with explicit view state', () => {
    const html = renderVoyageurs({ ...baseState, voyageursView: 'combined' })
    expect(html).toContain('showRadarExpanded()')
  })

  it('renders radar expanded view', () => {
    const html = renderVoyageurs({ ...baseState, voyageursView: 'radar' })
    expect(html).toBeTruthy()
  })

  it('renders radar active when radar is on', () => {
    getRadarSettings.mockReturnValue({ enabled: true, radius: 10, visibility: 'all' })
    const html = renderVoyageurs({ ...baseState, voyageursView: 'radar' })
    expect(html).toBeTruthy()
  })

  it('renders radar with nearby travelers', () => {
    getRadarSettings.mockReturnValue({ enabled: true, radius: 10, visibility: 'all' })
    const html = renderVoyageurs({
      ...baseState,
      voyageursView: 'radar',
      nearbyTravelers: [
        { uid: 'u1', username: 'Bob', distance: 2.5, avatar: null, gender: 'male' },
      ],
    })
    expect(html).toBeTruthy()
  })

  it('renders buddy list view', () => {
    const html = renderVoyageurs({ ...baseState, voyageursView: 'buddyList' })
    expect(html).toBeTruthy()
  })

  it('renders buddy list with buddies', () => {
    const html = renderVoyageurs({
      ...baseState,
      voyageursView: 'buddyList',
      travelBuddies: [mockBuddy],
    })
    expect(html).toContain('Alice')
  })

  it('renders buddy list with country filter', () => {
    const html = renderVoyageurs({
      ...baseState,
      voyageursView: 'buddyList',
      travelBuddies: [mockBuddy],
      buddyCountryFilter: 'FR',
    })
    expect(html).toBeTruthy()
  })

  it('renders buddy create view', () => {
    const html = renderVoyageurs({ ...baseState, voyageursView: 'create' })
    expect(html).toBeTruthy()
  })

  it('renders buddy create with prefilled form data', () => {
    const html = renderVoyageurs({
      ...baseState,
      voyageursView: 'create',
      buddyFormData: { from: 'Paris', to: 'Barcelona', gender: 'female' },
    })
    expect(html).toBeTruthy()
  })

  it('renders buddy detail view with buddy data', () => {
    const html = renderVoyageurs({
      ...baseState,
      voyageursView: 'buddyDetail',
      selectedBuddyDetail: mockBuddy,
    })
    expect(html).toContain('Alice')
  })

  it('renders buddy detail own announcement (own buddy)', () => {
    const html = renderVoyageurs({
      ...baseState,
      voyageursView: 'buddyDetail',
      user: { uid: 'user-xyz' },
      selectedBuddyDetail: mockBuddy,
    })
    expect(html).toBeTruthy()
  })

  it('renders buddy detail fallback when no buddy selected', () => {
    const html = renderVoyageurs({ ...baseState, voyageursView: 'buddyDetail', selectedBuddyDetail: null })
    // Falls back to combined view
    expect(html).toBeTruthy()
  })

  it('renders combined view with radar ON', () => {
    getRadarSettings.mockReturnValue({ enabled: true, radius: 10, visibility: 'all' })
    const html = renderVoyageurs(baseState)
    expect(html).toContain('toggleProximityRadar()')
  })

  it('renders combined with travel buddies list', () => {
    const html = renderVoyageurs({
      ...baseState,
      travelBuddies: [mockBuddy],
    })
    expect(html).toBeTruthy()
  })

  it('renders cooldown state when radar in cooldown', () => {
    isRadarInCooldown.mockReturnValue(true)
    const html = renderVoyageurs({ ...baseState, voyageursView: 'radar' })
    expect(html).toBeTruthy()
  })
})
