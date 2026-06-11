/**
 * Voyage.js window handler tests — sync handlers and early-return branches
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
vi.mock('../../src/utils/storage.js', () => ({
  Storage: { get: vi.fn(() => null), set: vi.fn() },
  safeSetItem: vi.fn(),
}))
vi.mock('../../src/utils/tripFilters.js', () => ({
  applyTripFilter: vi.fn((spots) => spots),
  countByFilter: vi.fn(() => ({})),
}))
vi.mock('../../src/components/EmptyState.js', () => ({
  renderEmptyState: vi.fn(() => '<div class="empty"></div>'),
}))
vi.mock('../../src/components/views/Guides.js', () => ({
  renderGuides: vi.fn(() => '<div class="guides"></div>'),
  renderCountryDetail: vi.fn(() => '<div class="country-detail"></div>'),
  renderSafety: vi.fn(() => '<div class="safety"></div>'),
  ensureGuideSectionsLoaded: vi.fn(() => Promise.resolve()),
}))
vi.mock('../../src/components/views/Travel.js', () => ({
  renderTravel: vi.fn(() => '<div class="travel"></div>'),
}))

import '../../src/components/views/Voyage.js'

describe('Voyage sync handlers', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>'
    localStorage.clear()
    vi.clearAllMocks()
    window.setState = vi.fn()
    window.getState = vi.fn(() => ({}))
    window.showToast = vi.fn()
  })

  it('setVoyageSubTab calls setState with voyageSubTab', () => {
    window.setVoyageSubTab('guides')
    expect(window.setState).toHaveBeenCalledWith({ voyageSubTab: 'guides' })
  })

  it('setJournalSubTab calls setState with journalSubTab', () => {
    window.setJournalSubTab('mes-voyages')
    expect(window.setState).toHaveBeenCalledWith({ journalSubTab: 'mes-voyages' })
  })

  it('openTripDetail sets tripDetailIndex', () => {
    window.openTripDetail(2)
    expect(window.setState).toHaveBeenCalledWith({ tripDetailIndex: 2 })
  })

  it('closeTripDetail clears tripDetailIndex', () => {
    window.closeTripDetail()
    expect(window.setState).toHaveBeenCalledWith({ tripDetailIndex: null })
  })

  it('openEditTrip sets editTripIndex', () => {
    window.openEditTrip(1)
    expect(window.setState).toHaveBeenCalledWith({ editTripIndex: 1 })
  })

  it('closeEditTrip clears editTripIndex', () => {
    window.closeEditTrip()
    expect(window.setState).toHaveBeenCalledWith({ editTripIndex: null })
  })

  it('tripExpandForm calls setState with tripFormCollapsed: false', () => {
    window.tripExpandForm()
    expect(window.setState).toHaveBeenCalledWith({ tripFormCollapsed: false })
  })

  it('tripCollapseForm calls setState with tripFormCollapsed: true', () => {
    window.tripCollapseForm()
    expect(window.setState).toHaveBeenCalledWith({ tripFormCollapsed: true })
  })

  it('removeTripMapSpot adds spotId to tripRemovedSpots', () => {
    window.getState = vi.fn(() => ({ tripRemovedSpots: ['a'] }))
    window.removeTripMapSpot('b')
    expect(window.setState).toHaveBeenCalledWith({ tripRemovedSpots: ['a', 'b'] })
  })

  it('startTrip shows toast when no tripData available', () => {
    window.getState = vi.fn(() => ({ tripResults: null }))
    window.startTrip()
    expect(window.showToast).toHaveBeenCalled()
  })

  it('tripNextStop does nothing when no active trip', () => {
    localStorage.removeItem('spothitch_active_trip')
    window.tripNextStop()
    expect(window.setState).not.toHaveBeenCalled()
  })

  it('finishTrip does nothing when no active trip', () => {
    localStorage.removeItem('spothitch_active_trip')
    window.finishTrip()
    expect(window.showToast).not.toHaveBeenCalled()
  })

  it('tripSheetCycleState does nothing when no sheet element', () => {
    document.body.innerHTML = '<div id="app"></div>'
    expect(() => window.tripSheetCycleState()).not.toThrow()
  })

  it('tripSheetCycleState cycles collapsed → half → full → collapsed', () => {
    document.body.innerHTML = `<div id="trip-bottom-sheet" data-sheet-state="collapsed"></div>`
    window.tripSheetCycleState()
    const sheet = document.getElementById('trip-bottom-sheet')
    // After cycle from 'collapsed', it goes to 'half'
    expect(sheet.dataset.sheetState).toBe('half')
  })

  it('toggleTripGasStations toggles off when already showing', () => {
    window.getState = vi.fn(() => ({ tripShowGasStations: true }))
    window.toggleTripGasStations()
    expect(window.setState).toHaveBeenCalledWith({ tripShowGasStations: false })
  })
})
