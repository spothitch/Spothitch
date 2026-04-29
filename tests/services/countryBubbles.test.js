import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))

vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg>${name}</svg>`),
}))

vi.mock('../../src/utils/sanitize.js', () => ({
  escapeJSString: vi.fn((s) => s),
}))

import {
  buildCountryBubblesGeoJSON,
  setBubbleLayersVisibility,
  setSpotLayersVisibility,
} from '../../src/services/countryBubbles.js'

const COUNTRY_CENTERS = {
  FR: { lat: 46.2, lon: 2.2 },
  DE: { lat: 51.2, lon: 10.5 },
  ES: { lat: 40.4, lon: -3.7 },
}

const INDEX_DATA = {
  countries: [
    { code: 'FR', count: 120 },
    { code: 'DE', count: 85 },
    { code: 'ES', count: 60 },
  ],
}

describe('countryBubbles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('buildCountryBubblesGeoJSON', () => {
    it('returns empty FeatureCollection when indexData is null', () => {
      const result = buildCountryBubblesGeoJSON(null, COUNTRY_CENTERS)
      expect(result.type).toBe('FeatureCollection')
      expect(result.features).toEqual([])
    })

    it('returns empty FeatureCollection when indexData has no countries', () => {
      const result = buildCountryBubblesGeoJSON({}, COUNTRY_CENTERS)
      expect(result.type).toBe('FeatureCollection')
      expect(result.features).toEqual([])
    })

    it('returns empty FeatureCollection when indexData is undefined', () => {
      const result = buildCountryBubblesGeoJSON(undefined, COUNTRY_CENTERS)
      expect(result.type).toBe('FeatureCollection')
      expect(result.features).toEqual([])
    })

    it('builds correct number of features', () => {
      const result = buildCountryBubblesGeoJSON(INDEX_DATA, COUNTRY_CENTERS)
      expect(result.features.length).toBe(3)
    })

    it('skips countries with no center data', () => {
      const indexWithUnknown = {
        countries: [
          { code: 'FR', count: 10 },
          { code: 'XX', count: 5 }, // no center for XX
        ],
      }
      const result = buildCountryBubblesGeoJSON(indexWithUnknown, COUNTRY_CENTERS)
      expect(result.features.length).toBe(1)
      expect(result.features[0].properties.code).toBe('FR')
    })

    it('sets correct geometry type and coordinates', () => {
      const result = buildCountryBubblesGeoJSON(INDEX_DATA, COUNTRY_CENTERS)
      const frFeature = result.features.find(f => f.properties.code === 'FR')
      expect(frFeature.geometry.type).toBe('Point')
      expect(frFeature.geometry.coordinates[0]).toBe(2.2) // lon
      expect(frFeature.geometry.coordinates[1]).toBe(46.2) // lat
    })

    it('sets correct spot count in properties', () => {
      const result = buildCountryBubblesGeoJSON(INDEX_DATA, COUNTRY_CENTERS)
      const frFeature = result.features.find(f => f.properties.code === 'FR')
      expect(frFeature.properties.spotCount).toBe(120)
      expect(frFeature.properties.label).toBe('120')
    })

    it('marks downloaded countries correctly', () => {
      const downloaded = new Set(['FR'])
      const result = buildCountryBubblesGeoJSON(INDEX_DATA, COUNTRY_CENTERS, downloaded)
      const frFeature = result.features.find(f => f.properties.code === 'FR')
      const deFeature = result.features.find(f => f.properties.code === 'DE')
      expect(frFeature.properties.isDownloaded).toBe(1)
      expect(deFeature.properties.isDownloaded).toBe(0)
    })

    it('marks loaded countries correctly', () => {
      const loaded = new Set(['DE'])
      const result = buildCountryBubblesGeoJSON(INDEX_DATA, COUNTRY_CENTERS, new Set(), loaded)
      const deFeature = result.features.find(f => f.properties.code === 'DE')
      const frFeature = result.features.find(f => f.properties.code === 'FR')
      expect(deFeature.properties.isLoaded).toBe(1)
      expect(frFeature.properties.isLoaded).toBe(0)
    })

    it('uses locations field when count is not available', () => {
      const indexWithLocations = {
        countries: [{ code: 'FR', locations: 55 }],
      }
      const result = buildCountryBubblesGeoJSON(indexWithLocations, COUNTRY_CENTERS)
      expect(result.features[0].properties.spotCount).toBe(55)
      expect(result.features[0].properties.label).toBe('55')
    })

    it('returns 0 spotCount when neither count nor locations is set', () => {
      const indexNoCount = {
        countries: [{ code: 'FR' }],
      }
      const result = buildCountryBubblesGeoJSON(indexNoCount, COUNTRY_CENTERS)
      expect(result.features[0].properties.spotCount).toBe(0)
    })

    it('output is a valid GeoJSON FeatureCollection', () => {
      const result = buildCountryBubblesGeoJSON(INDEX_DATA, COUNTRY_CENTERS)
      expect(result.type).toBe('FeatureCollection')
      expect(Array.isArray(result.features)).toBe(true)
      for (const f of result.features) {
        expect(f.type).toBe('Feature')
        expect(f.geometry).toBeDefined()
        expect(f.properties).toBeDefined()
      }
    })

    it('works with empty countries array', () => {
      const result = buildCountryBubblesGeoJSON({ countries: [] }, COUNTRY_CENTERS)
      expect(result.features).toEqual([])
    })

    it('uses default empty Sets when not provided', () => {
      const result = buildCountryBubblesGeoJSON(INDEX_DATA, COUNTRY_CENTERS)
      const frFeature = result.features.find(f => f.properties.code === 'FR')
      expect(frFeature.properties.isDownloaded).toBe(0)
      expect(frFeature.properties.isLoaded).toBe(0)
    })
  })

  describe('setBubbleLayersVisibility', () => {
    it('calls setLayoutProperty for all bubble layers when visible', () => {
      const mockMap = {
        getLayer: vi.fn(() => true),
        setLayoutProperty: vi.fn(),
      }
      setBubbleLayersVisibility(mockMap, true)
      expect(mockMap.setLayoutProperty).toHaveBeenCalledTimes(5)
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith('country-bubble-clusters', 'visibility', 'visible')
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith('country-bubble-circles', 'visibility', 'visible')
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith('country-bubble-labels', 'visibility', 'visible')
    })

    it('sets visibility to none when visible=false', () => {
      const mockMap = {
        getLayer: vi.fn(() => true),
        setLayoutProperty: vi.fn(),
      }
      setBubbleLayersVisibility(mockMap, false)
      const calls = mockMap.setLayoutProperty.mock.calls
      expect(calls.every(c => c[2] === 'none')).toBe(true)
    })

    it('skips layers that do not exist on the map', () => {
      const mockMap = {
        getLayer: vi.fn((id) => id === 'country-bubble-circles'),
        setLayoutProperty: vi.fn(),
      }
      setBubbleLayersVisibility(mockMap, true)
      // Only one layer exists
      expect(mockMap.setLayoutProperty).toHaveBeenCalledTimes(1)
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith('country-bubble-circles', 'visibility', 'visible')
    })
  })

  describe('setSpotLayersVisibility', () => {
    it('calls setLayoutProperty for all spot layers when visible', () => {
      const mockMap = {
        getLayer: vi.fn(() => true),
        setLayoutProperty: vi.fn(),
      }
      setSpotLayersVisibility(mockMap, true)
      expect(mockMap.setLayoutProperty).toHaveBeenCalledTimes(3)
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith('home-clusters', 'visibility', 'visible')
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith('home-cluster-count', 'visibility', 'visible')
      expect(mockMap.setLayoutProperty).toHaveBeenCalledWith('home-spot-points', 'visibility', 'visible')
    })

    it('sets visibility to none when visible=false', () => {
      const mockMap = {
        getLayer: vi.fn(() => true),
        setLayoutProperty: vi.fn(),
      }
      setSpotLayersVisibility(mockMap, false)
      const calls = mockMap.setLayoutProperty.mock.calls
      expect(calls.every(c => c[2] === 'none')).toBe(true)
    })

    it('skips missing spot layers', () => {
      const mockMap = {
        getLayer: vi.fn(() => false),
        setLayoutProperty: vi.fn(),
      }
      setSpotLayersVisibility(mockMap, true)
      expect(mockMap.setLayoutProperty).not.toHaveBeenCalled()
    })
  })
})
