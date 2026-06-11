import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/services/favorites.js', () => ({
  addFavorite: vi.fn(),
  removeFavorite: vi.fn(),
  isFavorite: vi.fn(() => false),
}))

import { renderTravel, renderGuides } from '../../src/components/views/Travel.js'

const baseState = {
  lang: 'fr',
  filterCountry: 'all',
  spots: [],
}

const mockRouteResult = {
  from: 'Paris',
  to: 'Lyon',
  fromLat: 48.8, fromLng: 2.3,
  toLat: 45.7, toLng: 4.8,
  distance: 465,
  duration: 270,
  legs: [
    { from: 'Paris', to: 'Lyon', distance: 465, type: 'hitchhike', spots: [] }
  ],
}

describe('renderTravel', () => {
  it('renders travel form (empty state)', () => {
    const html = renderTravel(baseState)
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(50)
  })

  it('renders travel form with from/to prefilled', () => {
    const html = renderTravel({ ...baseState, travelFrom: 'Paris', travelTo: 'Lyon' })
    expect(html).toBeTruthy()
  })

  it('renders trip results when tripResults set', () => {
    const html = renderTravel({ ...baseState, tripResults: [mockRouteResult] })
    expect(html).toBeTruthy()
  })

  it('renders travel with loading state', () => {
    const html = renderTravel({ ...baseState, tripLoading: true })
    expect(html).toBeTruthy()
  })

  it('renders travel with collapsed form (map first mode)', () => {
    const html = renderTravel({
      ...baseState,
      tripResults: [mockRouteResult],
      tripFormCollapsed: true,
    })
    expect(html).toBeTruthy()
  })

  it('renders travel with no results (empty search)', () => {
    const html = renderTravel({ ...baseState, tripResults: [] })
    expect(html).toBeTruthy()
  })

  it('renders with multiple trip results', () => {
    const html = renderTravel({
      ...baseState,
      tripResults: [mockRouteResult, { ...mockRouteResult, distance: 480 }],
    })
    expect(html).toBeTruthy()
  })
})

describe('renderGuides', () => {
  it('renders guides with empty state', () => {
    const html = renderGuides(baseState)
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(50)
  })

  it('renders guides with country selected', () => {
    const html = renderGuides({ ...baseState, selectedGuideCountry: 'fr' })
    expect(html).toBeTruthy()
  })

  it('renders guides with search query', () => {
    const html = renderGuides({ ...baseState, guideSearch: 'France' })
    expect(html).toBeTruthy()
  })

  it('renders guides with selected guide', () => {
    const html = renderGuides(baseState, {
      country: 'fr', title: 'Autostop en France', difficulty: 2, bestMonths: [5, 6, 7, 8, 9],
      sections: [], tips: [], laws: 'Légal', contact: '', currency: 'EUR',
      emergencyNumbers: { police: '17', ambulance: '15', fire: '18' },
    })
    expect(html).toBeTruthy()
  })
})
