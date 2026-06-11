/**
 * Filters.js tests — getFilteredSpots pure function + applyFilters/resetFilters
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn(() => '<svg></svg>') }))
vi.mock('../../src/utils/geo.js', () => ({
  haversineKm: vi.fn((lat1, lng1, lat2, lng2) => Math.abs(lat1 - lat2) + Math.abs(lng1 - lng2)),
}))
vi.mock('../../src/utils/toggle.js', () => ({
  renderToggle: vi.fn(() => '<div class="toggle"></div>'),
}))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ showFilters: false, filterMinRating: 0, filterMaxWait: 999, filterVerifiedOnly: false })),
  setState: vi.fn(),
}))

import { getFilteredSpots, applyFilters, resetFilters } from '../../src/components/modals/Filters.js'
import { setState } from '../../src/stores/state.js'

const spots = [
  { id: 'a', country: 'FR', globalRating: 4.5, avgWaitTime: 15, verified: true, from: 'Paris', to: 'Lyon', description: 'Great spot', coordinates: { lat: 48.8, lng: 2.3 } },
  { id: 'b', country: 'DE', globalRating: 3.0, avgWaitTime: 45, verified: false, from: 'Berlin', to: 'Hamburg', description: 'OK spot', coordinates: { lat: 52.5, lng: 13.4 } },
  { id: 'c', country: 'FR', globalRating: 2.0, avgWaitTime: 90, verified: false, from: 'Lyon', to: 'Nice', description: 'Bad spot', coordinates: { lat: 45.7, lng: 4.8 } },
]

describe('getFilteredSpots', () => {
  it('returns all spots when no filters applied', () => {
    const result = getFilteredSpots([...spots], {})
    expect(result).toHaveLength(3)
  })

  it('filters by country', () => {
    const result = getFilteredSpots([...spots], { filterCountry: 'FR' })
    expect(result).toHaveLength(2)
    expect(result.every(s => s.country === 'FR')).toBe(true)
  })

  it('returns all when filterCountry is "all"', () => {
    const result = getFilteredSpots([...spots], { filterCountry: 'all' })
    expect(result).toHaveLength(3)
  })

  it('filters by minimum rating', () => {
    const result = getFilteredSpots([...spots], { filterMinRating: 3.5 })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('a')
  })

  it('filters by max wait time', () => {
    const result = getFilteredSpots([...spots], { filterMaxWait: 30 })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('a')
  })

  it('filters by verified only', () => {
    const result = getFilteredSpots([...spots], { filterVerifiedOnly: true })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('a')
  })

  it('filters by search query matching from field', () => {
    const result = getFilteredSpots([...spots], { searchQuery: 'paris' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('a')
  })

  it('filters by search query matching description', () => {
    const result = getFilteredSpots([...spots], { searchQuery: 'great' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('a')
  })

  it('sorts by rating descending by default', () => {
    const result = getFilteredSpots([...spots], { sortBy: 'rating' })
    expect(result[0].globalRating).toBe(4.5)
    expect(result[2].globalRating).toBe(2.0)
  })

  it('sorts by popular (checkins)', () => {
    const spotsWithCheckins = [
      { ...spots[0], checkins: 5 },
      { ...spots[1], checkins: 100 },
    ]
    const result = getFilteredSpots(spotsWithCheckins, { sortBy: 'popular' })
    expect(result[0].checkins).toBe(100)
  })

  it('sorts by recent (lastUsed)', () => {
    const spotsWithDates = [
      { ...spots[0], lastUsed: '2024-01-01' },
      { ...spots[1], lastUsed: '2025-01-01' },
    ]
    const result = getFilteredSpots(spotsWithDates, { sortBy: 'recent' })
    expect(result[0].lastUsed).toBe('2025-01-01')
  })

  it('sorts by distance when userLocation provided', () => {
    const spotsWithCoords = [
      { ...spots[0], coordinates: { lat: 48.8, lng: 2.3 } }, // close to 48.0, 2.0
      { ...spots[1], coordinates: { lat: 52.5, lng: 13.4 } }, // far from 48.0, 2.0
    ]
    const result = getFilteredSpots(spotsWithCoords, {
      sortBy: 'distance',
      userLocation: { lat: 48.0, lng: 2.0 },
    })
    expect(result[0].id).toBe('a')
  })

  it('combines multiple filters', () => {
    const result = getFilteredSpots([...spots], { filterCountry: 'FR', filterMinRating: 4 })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('a')
  })

  it('returns empty array when nothing matches', () => {
    const result = getFilteredSpots([...spots], { filterCountry: 'JP' })
    expect(result).toHaveLength(0)
  })

  it('uses cache for same inputs', () => {
    const s = [{ ...spots[0] }]
    const r1 = getFilteredSpots(s, { filterCountry: 'FR' })
    const r2 = getFilteredSpots(s, { filterCountry: 'FR' })
    expect(r1).toBe(r2) // same reference = cache hit
  })
})

describe('applyFilters', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('calls setState with showFilters: false', () => {
    window._refreshMapSpots = undefined
    applyFilters()
    expect(setState).toHaveBeenCalledWith({ showFilters: false })
  })

  it('calls _refreshMapSpots if present', () => {
    window._refreshMapSpots = vi.fn()
    applyFilters()
    expect(window._refreshMapSpots).toHaveBeenCalled()
    window._refreshMapSpots = undefined
  })
})

describe('resetFilters', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('resets all filter state', () => {
    window._refreshMapSpots = undefined
    resetFilters()
    expect(setState).toHaveBeenCalledWith({
      filterCountry: 'all',
      filterMinRating: 0,
      filterMaxWait: 999,
      filterVerifiedOnly: false,
      sortBy: 'rating',
    })
  })
})
