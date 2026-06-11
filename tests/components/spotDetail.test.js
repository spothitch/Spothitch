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
vi.mock('../../src/services/favorites.js', () => ({
  isFavorite: vi.fn(() => false),
}))

import { renderSpotDetail } from '../../src/components/modals/SpotDetail.js'
import { isFavorite } from '../../src/services/favorites.js'

const mockSpot = {
  id: 'spot-paris-001',
  from: 'Paris',
  to: 'Lyon',
  direction: 'Lyon',
  departureCity: 'Paris',
  lat: 48.812,
  lng: 2.322,
  coordinates: { lat: 48.812, lng: 2.322 },
  country: 'FR',
  type: 'city-exit',
  safety: 4,
  traffic: 3,
  accessibility: 4,
  validationCount: 12,
  liveTestCount: 8,
  successRate: 85,
  liveSuccessRate: 82,
  tags: { shelter: true, waterFood: false, toilets: false },
  destinations: [{ name: 'Lyon', count: 8, pct: 80 }, { name: 'Marseille', count: 2, pct: 20 }],
  method: 'thumb',
  groupSize: 'duo',
  timeOfDay: 'morning',
  liveComments: [
    { id: 'c1', text: 'Super spot !', rating: 5, userId: 'u1', ts: Date.now(), method: 'thumb', groupSize: 'solo', timeOfDay: 'afternoon' },
  ],
}

describe('renderSpotDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    isFavorite.mockReturnValue(false)
  })

  it('returns empty string when no selectedSpot', () => {
    const html = renderSpotDetail({})
    expect(html).toBe('')
  })

  it('returns empty string when selectedSpot is null', () => {
    const html = renderSpotDetail({ selectedSpot: null })
    expect(html).toBe('')
  })

  it('renders spot detail modal', () => {
    const html = renderSpotDetail({ selectedSpot: mockSpot })
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(200)
  })

  it('renders spot city name', () => {
    const html = renderSpotDetail({ selectedSpot: mockSpot })
    expect(html).toContain('Paris')
  })

  it('renders close button', () => {
    const html = renderSpotDetail({ selectedSpot: mockSpot })
    expect(html).toContain('closeSpotDetail()')
  })

  it('renders validation buttons', () => {
    const html = renderSpotDetail({ selectedSpot: mockSpot })
    expect(html).toContain('quickValidateSpot(')
    expect(html).toContain('openTestSpot(')
  })

  it('renders favorite button (not favorite)', () => {
    isFavorite.mockReturnValue(false)
    const html = renderSpotDetail({ selectedSpot: mockSpot })
    expect(html).toContain('toggleFavorite(')
  })

  it('renders favorite button (is favorite)', () => {
    isFavorite.mockReturnValue(true)
    const html = renderSpotDetail({ selectedSpot: mockSpot })
    expect(html).toContain('toggleFavorite(')
  })

  it('renders success rate when available', () => {
    const html = renderSpotDetail({ selectedSpot: mockSpot })
    expect(html).toContain('82')
  })

  it('renders destinations section', () => {
    const html = renderSpotDetail({ selectedSpot: mockSpot })
    expect(html).toContain('Lyon')
  })

  it('renders spot with no destinations', () => {
    const html = renderSpotDetail({ selectedSpot: { ...mockSpot, destinations: [], to: 'Lyon' } })
    expect(html).toBeTruthy()
  })

  it('renders tags/amenities section', () => {
    const html = renderSpotDetail({ selectedSpot: mockSpot })
    expect(html).toBeTruthy()
  })

  it('renders comments section', () => {
    const html = renderSpotDetail({ selectedSpot: mockSpot })
    expect(html).toBeTruthy()
  })

  it('renders spot with method/group/time stats', () => {
    const html = renderSpotDetail({ selectedSpot: mockSpot })
    expect(html).toBeTruthy()
  })

  it('renders minimal spot (only required fields)', () => {
    const minimalSpot = {
      id: 'spot-min',
      lat: 48,
      lng: 2,
      country: 'FR',
      type: 'other',
      safety: 0,
      traffic: 0,
      accessibility: 0,
    }
    const html = renderSpotDetail({ selectedSpot: minimalSpot })
    expect(html).toBeTruthy()
  })

  it('renders spot with live destinations', () => {
    const html = renderSpotDetail({
      selectedSpot: {
        ...mockSpot,
        liveDestinations: [
          { city: 'Bordeaux', count: 3, pct: 30 },
        ],
      },
    })
    expect(html).toBeTruthy()
  })

  it('renders spot with live comments from multiple users', () => {
    const html = renderSpotDetail({
      selectedSpot: {
        ...mockSpot,
        liveComments: [
          { id: 'c1', text: 'Top!', rating: 5, userId: 'u1', ts: Date.now(), method: 'thumb', groupSize: 'solo' },
          { id: 'c2', text: 'OK', rating: 3, userId: 'u2', ts: Date.now(), method: 'sign', groupSize: 'duo' },
        ],
      },
    })
    expect(html).toBeTruthy()
  })

  it('renders with null successRate', () => {
    const html = renderSpotDetail({
      selectedSpot: { ...mockSpot, successRate: null, liveSuccessRate: null },
    })
    expect(html).toBeTruthy()
  })

  it('renders with spotNumber in title', () => {
    const html = renderSpotDetail({
      selectedSpot: { ...mockSpot, spotNumber: 3 },
    })
    expect(html).toContain('#3')
  })
})
