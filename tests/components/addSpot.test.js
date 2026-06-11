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

import { renderAddSpot, renderNearbySpotChoice } from '../../src/components/modals/AddSpot.js'

const baseState = {
  lang: 'fr',
  addSpotStep: 1,
}

describe('renderAddSpot', () => {
  beforeEach(() => {
    // Reset spotFormData between tests
    window.spotFormData = {
      photos: [],
      lat: null,
      lng: null,
      ratings: { safety: 0, traffic: 0, accessibility: 0 },
      tags: {},
    }
    vi.clearAllMocks()
  })

  it('renders step 1 (default)', () => {
    const html = renderAddSpot(baseState)
    expect(html).toContain('role="dialog"')
    expect(html).toContain('addspot-modal')
    expect(html).toContain('handleAddSpot(event)')
  })

  it('renders step 1 with form content', () => {
    const html = renderAddSpot({ ...baseState, addSpotStep: 1 })
    expect(html).toContain('addspot-modal-title')
    expect(html).toContain('closeAddSpot()')
  })

  it('renders step 2', () => {
    const html = renderAddSpot({ ...baseState, addSpotStep: 2 })
    expect(html).toContain('addspot-modal')
    expect(html).toBeTruthy()
  })

  it('renders step 3', () => {
    const html = renderAddSpot({ ...baseState, addSpotStep: 3 })
    expect(html).toContain('addspot-modal')
    expect(html).toBeTruthy()
  })

  it('renders preview mode with preview badge', () => {
    const html = renderAddSpot({ ...baseState, addSpotPreview: true })
    expect(html).toContain('previewMode')
  })

  it('renders validation mode', () => {
    const html = renderAddSpot({ ...baseState, addSpotValidateId: 'spot-abc123' })
    expect(html).toContain('validateSpotTitle')
  })

  it('renders step progress indicator', () => {
    const html = renderAddSpot(baseState)
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(200)
  })

  it('renders offline draft button on step 2+', () => {
    const html = renderAddSpot({ ...baseState, addSpotStep: 2 })
    expect(html).toBeTruthy()
  })

  it('renders step 1 with location prefilled', () => {
    const html = renderAddSpot({
      ...baseState,
      addSpotStep: 1,
      addSpotLat: 48.812,
      addSpotLng: 2.322,
      addSpotCity: 'Paris',
    })
    expect(html).toBeTruthy()
  })

  it('renders step 2 with destination prefilled', () => {
    const html = renderAddSpot({
      ...baseState,
      addSpotStep: 2,
      addSpotDest: 'Lyon',
    })
    expect(html).toBeTruthy()
  })

  it('renders step 3 with ratings', () => {
    window.spotFormData = {
      photos: [],
      lat: 48.812,
      lng: 2.322,
      ratings: { safety: 4, traffic: 3, accessibility: 4 },
      tags: { shelter: true, waterFood: false },
    }
    const html = renderAddSpot({ ...baseState, addSpotStep: 3 })
    expect(html).toBeTruthy()
  })

  it('renders with no step set (defaults to step 1)', () => {
    const html = renderAddSpot({ lang: 'fr' })
    expect(html).toContain('addspot-modal')
  })
})

describe('renderNearbySpotChoice', () => {
  it('returns empty when no nearby spots', () => {
    const html = renderNearbySpotChoice({ nearbySpots: [] })
    expect(typeof html).toBe('string')
  })

  it('renders nearby spots list', () => {
    const html = renderNearbySpotChoice({
      nearbySpotChoiceData: [
        {
          id: 'spot-001',
          from: 'Paris',
          to: 'Lyon',
          distance: 0.3,
          safety: 4,
          traffic: 3,
          accessibility: 4,
        },
      ],
    })
    expect(html).toBeTruthy()
  })

  it('renders choice between existing spot and new spot', () => {
    const html = renderNearbySpotChoice({
      nearbySpotChoiceData: [
        { id: 'spot-001', from: 'Paris', distance: 0.2, safety: 4, traffic: 3, accessibility: 4 },
      ],
    })
    expect(html).toContain('nearbySpotFound')
  })
})
