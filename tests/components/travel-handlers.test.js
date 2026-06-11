/**
 * Travel.js window handler tests
 * Covers: setSubTab, selectGuide, filterGuides, updateTripField,
 *         swapTripPoints, closeTripMap, clearTripResults, removeSpotFromTrip,
 *         renderTravel (trip map branch)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn(() => '<svg></svg>') }))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeHTML: vi.fn((s) => String(s ?? '')),
  escapeJSString: vi.fn((s) => String(s ?? '')),
}))
vi.mock('../../src/utils/geo.js', () => ({
  haversineKm: vi.fn(() => 0),
}))
vi.mock('../../src/utils/toggle.js', () => ({
  renderToggle: vi.fn(() => '<div class="toggle"></div>'),
}))
vi.mock('../../src/utils/searchInput.js', () => ({
  renderSearchInput: vi.fn(() => '<input type="text" />'),
}))
vi.mock('../../src/utils/tripFilters.js', () => ({
  applyTripFilter: vi.fn(),
}))
vi.mock('../../src/data/guides.js', () => ({
  countryGuides: [],
  getGuideByCode: vi.fn(() => null),
}))
vi.mock('../../src/services/communityTips.js', () => ({
  renderCommunityTips: vi.fn(() => ''),
}))
vi.mock('../../src/services/hostelRecommendations.js', () => ({
  renderHostelSection: vi.fn(() => ''),
}))
vi.mock('../../src/services/favorites.js', () => ({
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
  isFavorite: vi.fn(() => false),
}))

import { renderTravel } from '../../src/components/views/Travel.js'

describe('renderTravel — trip map branch', () => {
  it('returns trip map view HTML when showTripMap + tripResults', () => {
    const html = renderTravel({
      showTripMap: true,
      tripResults: { from: 'Paris', to: 'Lyon', distance: 465, estimatedTime: '4h30', spots: [] },
    })
    expect(html).toContain('trip-map')
    expect(html).toContain('closeTripMap')
  })

  it('shows spot count in trip map view', () => {
    const html = renderTravel({
      showTripMap: true,
      tripResults: {
        from: 'Paris', to: 'Lyon', distance: 465, estimatedTime: '4h30',
        spots: [{ id: 'a' }, { id: 'b' }],
      },
    })
    expect(html).toContain('2')
  })

  it('returns guides view when showTripMap is false', () => {
    const html = renderTravel({ showTripMap: false, tripResults: null })
    expect(html).not.toContain('trip-map')
  })
})

describe('Travel window handlers', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>'
    vi.clearAllMocks()
    window.setState = vi.fn()
    window.getState = vi.fn(() => ({}))
    window.showToast = vi.fn()
    window._tripMapCleanup = null
  })

  it('setSubTab calls setState with activeSubTab', () => {
    window.setSubTab('guides')
    expect(window.setState).toHaveBeenCalledWith({ activeSubTab: 'guides' })
  })

  it('selectGuide calls setState with selectedCountryGuide', () => {
    window.selectGuide('FR')
    expect(window.setState).toHaveBeenCalledWith({ selectedCountryGuide: 'FR' })
  })

  it('filterGuides shows cards matching query', () => {
    document.body.innerHTML = `
      <div class="guide-card" data-country="france"></div>
      <div class="guide-card" data-country="germany"></div>
    `
    window.filterGuides('franc')
    const cards = document.querySelectorAll('.guide-card')
    expect(cards[0].style.display).toBe('')
    expect(cards[1].style.display).toBe('none')
  })

  it('filterGuides with empty query shows all cards', () => {
    document.body.innerHTML = `
      <div class="guide-card" data-country="france"></div>
      <div class="guide-card" data-country="germany"></div>
    `
    window.filterGuides('')
    const cards = document.querySelectorAll('.guide-card')
    expect(cards[0].style.display).toBe('')
    expect(cards[1].style.display).toBe('')
  })

  it('updateTripField("from") calls setState with tripFrom', () => {
    window.updateTripField('from', 'Paris')
    expect(window.setState).toHaveBeenCalledWith({ tripFrom: 'Paris' })
  })

  it('updateTripField("to") calls setState with tripTo', () => {
    window.updateTripField('to', 'Lyon')
    expect(window.setState).toHaveBeenCalledWith({ tripTo: 'Lyon' })
  })

  it('swapTripPoints swaps from/to input values', () => {
    document.body.innerHTML = `
      <input id="trip-from" value="Paris" />
      <input id="trip-to" value="Lyon" />
    `
    window.swapTripPoints()
    expect(document.getElementById('trip-from').value).toBe('Lyon')
    expect(document.getElementById('trip-to').value).toBe('Paris')
  })

  it('swapTripPoints works when inputs are missing (no crash)', () => {
    document.body.innerHTML = '<div></div>'
    expect(() => window.swapTripPoints()).not.toThrow()
  })

  it('closeTripMap calls setState with showTripMap: false', () => {
    window.closeTripMap()
    expect(window.setState).toHaveBeenCalledWith(
      expect.objectContaining({ showTripMap: false, tripFormCollapsed: false })
    )
  })

  it('closeTripMap calls _tripMapCleanup if present', () => {
    window._tripMapCleanup = vi.fn()
    window.closeTripMap()
    expect(window._tripMapCleanup).toHaveBeenCalled()
  })

  it('clearTripResults calls setState with tripResults: null', () => {
    window.clearTripResults()
    expect(window.setState).toHaveBeenCalledWith(
      expect.objectContaining({ tripResults: null, showTripMap: false })
    )
  })

  it('removeSpotFromTrip filters out the spot by ID', () => {
    const spots = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
    window.getState = vi.fn(() => ({ tripResults: { from: 'X', to: 'Y', spots } }))
    window.removeSpotFromTrip('b')
    expect(window.setState).toHaveBeenCalledWith({
      tripResults: expect.objectContaining({ spots: [{ id: 'a' }, { id: 'c' }] }),
    })
  })

  it('removeSpotFromTrip does nothing when no tripResults', () => {
    window.getState = vi.fn(() => ({}))
    window.removeSpotFromTrip('x')
    expect(window.setState).not.toHaveBeenCalled()
  })

  it('viewTripOnMap calls setState with showTripMap: true when results exist', () => {
    window.getState = vi.fn(() => ({ tripResults: { from: 'A', to: 'B', spots: [] } }))
    window.viewTripOnMap()
    expect(window.setState).toHaveBeenCalledWith({ showTripMap: true })
  })

  it('viewTripOnMap does nothing when no tripResults', () => {
    window.getState = vi.fn(() => ({}))
    window.viewTripOnMap()
    expect(window.setState).not.toHaveBeenCalled()
  })

  it('isFavorite delegates to favorites service', () => {
    const result = window.isFavorite('spot-1')
    expect(result).toBe(false)
  })
})
