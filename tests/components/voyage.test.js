import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/components/views/Travel.js', () => ({}))
vi.mock('../../src/services/hostelRecommendations.js', () => ({ getHostelRecommendations: vi.fn(() => []) }))

import { renderVoyage } from '../../src/components/views/Voyage.js'
import { mockTrips } from '../mocks/mockSpots.js'

const mockGuideCountries = [
  { code: 'fr', name: 'France', flag: '🇫🇷', spotCount: 45, avgWait: 18, tips: ['Bon pays pour l\'autostop'] },
  { code: 'de', name: 'Germany', flag: '🇩🇪', spotCount: 23, avgWait: 22, tips: ['Préférer les aires d\'autoroute'] },
  { code: 'es', name: 'Spain', flag: '🇪🇸', spotCount: 31, avgWait: 30, tips: [] },
]

describe('renderVoyage', () => {
  it('renders guides tab by default', () => {
    const html = renderVoyage({})
    expect(html).toContain('setVoyageSubTab')
    expect(html.length).toBeGreaterThan(100)
  })

  it('renders guides tab with country list', () => {
    const html = renderVoyage({ voyageSubTab: 'guides', guideCountries: mockGuideCountries })
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(100)
  })

  it('renders guides tab with search query', () => {
    const html = renderVoyage({
      voyageSubTab: 'guides',
      guideCountries: mockGuideCountries,
      guideSearch: 'France',
    })
    expect(html).toBeTruthy()
  })

  it('renders guides tab with selected country', () => {
    const html = renderVoyage({
      voyageSubTab: 'guides',
      guideCountries: mockGuideCountries,
      selectedGuideCountry: 'fr',
    })
    expect(html).toBeTruthy()
  })

  it('renders journal tab with real trips', () => {
    const html = renderVoyage({ voyageSubTab: 'journal', trips: mockTrips })
    expect(html).toBeTruthy()
  })

  it('renders journal tab empty', () => {
    const html = renderVoyage({ voyageSubTab: 'journal', trips: [] })
    expect(html).toBeTruthy()
  })

  it('redirects voyage subtab to guides', () => {
    const html = renderVoyage({ voyageSubTab: 'voyage' })
    expect(html).toBeTruthy()
  })

  it('renders sub-tabs bar with both tabs', () => {
    const html = renderVoyage({})
    expect(html).toContain("setVoyageSubTab('guides')")
    expect(html).toContain("setVoyageSubTab('journal')")
  })

  it('renders guides tab with empty countries', () => {
    const html = renderVoyage({ voyageSubTab: 'guides', guideCountries: [] })
    expect(html).toBeTruthy()
  })

  it('renders guides tab loading state', () => {
    const html = renderVoyage({ voyageSubTab: 'guides', guidesLoading: true })
    expect(html).toBeTruthy()
  })
})
