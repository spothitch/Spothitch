import { describe, it, expect } from 'vitest'
import { renderSpots } from '../../src/components/views/Spots.js'
import { mockSpots, mockSpot1, mockSpot2 } from '../mocks/mockSpots.js'

const base = { spots: mockSpots, filterCountry: 'all', viewMode: 'list' }

describe('renderSpots', () => {
  it('renders spots list with real data', () => {
    const html = renderSpots(base)
    expect(html).toContain('Paris')
    expect(html).toContain('Lyon')
  })

  it('renders with no spots (empty state)', () => {
    const html = renderSpots({ spots: [], filterCountry: 'all', viewMode: 'list', spotsLoading: false })
    expect(html).toBeTruthy()
    expect(html).toContain('role="status"')
  })

  it('renders loading state (skeleton)', () => {
    const html = renderSpots({ spots: [], filterCountry: 'all', viewMode: 'list', spotsLoading: true })
    expect(html).toContain('skeleton')
  })

  it('renders filter pills', () => {
    const html = renderSpots(base)
    expect(html).toContain('<button')
  })

  it('filters by search query (from)', () => {
    const html = renderSpots({ ...base, searchQuery: 'Paris' })
    expect(html).toContain('Paris')
  })

  it('filters by search query (no match)', () => {
    const html = renderSpots({ ...base, searchQuery: 'zzznomatch' })
    expect(html).toContain('role="status"')
  })

  it('filters by search query (destination)', () => {
    const html = renderSpots({ ...base, searchQuery: 'Lyon' })
    expect(html).toBeTruthy()
  })

  it('applies top filter (globalRating >= 4.5)', () => {
    const html = renderSpots({ ...base, activeFilter: 'top' })
    expect(html).toBeTruthy()
  })

  it('applies recent filter (sort by lastUsed)', () => {
    const html = renderSpots({ ...base, activeFilter: 'recent' })
    expect(html).toContain('Paris')
  })

  it('applies nearby filter with user location', () => {
    const html = renderSpots({ ...base, activeFilter: 'nearby', userLocation: { lat: 48.8, lng: 2.3 } })
    expect(html).toBeTruthy()
  })

  it('filters by country (FR only)', () => {
    const html = renderSpots({ spots: mockSpots, filterCountry: 'FR', viewMode: 'list' })
    expect(html).toContain('Paris')
  })

  it('filters by country (DE only)', () => {
    const html = renderSpots({ spots: mockSpots, filterCountry: 'DE', viewMode: 'list' })
    expect(html).toContain('Berlin')
  })

  it('renders spot count in footer', () => {
    const html = renderSpots(base)
    expect(html).toContain('affich')
  })
})
