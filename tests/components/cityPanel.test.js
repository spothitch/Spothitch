import { describe, it, expect } from 'vitest'
import { renderCityPanel } from '../../src/components/views/CityPanel.js'

describe('renderCityPanel', () => {
  it('returns empty string when no cityData', () => {
    expect(renderCityPanel({})).toBe('')
    expect(renderCityPanel({ cityData: null })).toBe('')
  })

  it('renders basic city panel', () => {
    const html = renderCityPanel({
      cityData: { name: 'Paris', countryName: 'France', country: 'fr', spotCount: 12, avgWait: 15, avgRating: 4.2, routesList: [] }
    })
    expect(html).toContain('Paris')
    expect(html).toContain('12 spots')
    expect(html).toContain('15 min')
    expect(html).toContain('role="dialog"')
  })

  it('renders city without optional fields', () => {
    const html = renderCityPanel({
      cityData: { name: 'Lyon', spotCount: 0, routesList: [] }
    })
    expect(html).toContain('Lyon')
    expect(html).toContain('0 spots')
  })

  it('renders routes list when routes present', () => {
    const html = renderCityPanel({
      cityData: {
        name: 'Lyon', country: 'fr', slug: 'lyon',
        routesList: [
          { slug: 'paris', spotCount: 5, avgWait: 10 },
          { slug: 'marseille', spotCount: 3, avgWait: 0 },
        ]
      }
    })
    expect(html).toContain('selectCityRoute')
    expect(html).toContain('5 spots')
  })

  it('renders up to 10 routes', () => {
    const routes = Array.from({ length: 15 }, (_, i) => ({ slug: `city-${i}`, spotCount: i, avgWait: 0 }))
    const html = renderCityPanel({ cityData: { name: 'Big', slug: 'big', routesList: routes } })
    expect(html.match(/selectCityRoute/g)?.length).toBeLessThanOrEqual(10)
  })

  it('renders country guide button when countryCode present', () => {
    const html = renderCityPanel({
      cityData: { name: 'Madrid', countryName: 'Espagne', country: 'es', routesList: [] }
    })
    expect(html).toContain("openCountryGuide('es')")
  })
})
