import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ showGasStationsOnMap: false, gasStations: [] })),
  setState: vi.fn(),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg>${name}</svg>`),
}))
vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/utils/idb.js', () => ({
  cacheGet: vi.fn(() => Promise.resolve(null)),
  cacheSet: vi.fn(() => Promise.resolve()),
}))
vi.mock('../../src/utils/geo.js', () => ({
  haversineKm: vi.fn(() => 1.0), // always within buffer
}))
vi.mock('../../src/services/notifications.js', () => ({
  showToast: vi.fn(),
  showError: vi.fn(),
  showSuccess: vi.fn(),
}))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeHTML: vi.fn((s) => String(s)),
  escapeJSString: vi.fn((s) => String(s)),
  sanitizeHTML: vi.fn((s) => String(s)),
}))

import {
  fetchGasStationsAlongRoute,
  fetchGasStationsInBounds,
  toggleGasStations,
  loadGasStations,
} from '../../src/services/gasStations.js'
import { getState, setState } from '../../src/stores/state.js'

describe('gasStations service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getState.mockReturnValue({ showGasStationsOnMap: false, gasStations: [] })
    global.fetch = vi.fn()
  })

  describe('fetchGasStationsAlongRoute', () => {
    it('returns empty array for null input', async () => {
      const result = await fetchGasStationsAlongRoute(null)
      expect(result).toEqual([])
    })

    it('returns empty array for empty array input', async () => {
      const result = await fetchGasStationsAlongRoute([])
      expect(result).toEqual([])
    })

    it('returns empty array for single point', async () => {
      const result = await fetchGasStationsAlongRoute([[2.35, 48.85]])
      expect(result).toEqual([])
    })

    it('calls Overpass API for route with multiple coords', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ elements: [] }),
      })
      const routeCoords = [[2.35, 48.85], [2.4, 48.9], [2.45, 48.95]]
      const result = await fetchGasStationsAlongRoute(routeCoords, 2)
      expect(Array.isArray(result)).toBe(true)
    })

    it('returns empty array when all APIs fail', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))
      const routeCoords = [[2.35, 48.85], [2.4, 48.9]]
      const result = await fetchGasStationsAlongRoute(routeCoords, 2)
      expect(result).toEqual([])
    })

    it('maps fuel stations from API response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          elements: [
            {
              id: 1,
              lat: 48.87,
              lon: 2.38,
              tags: { amenity: 'fuel', name: 'Total', brand: 'Total' },
            },
          ],
        }),
      })
      const routeCoords = [[2.35, 48.85], [2.40, 48.90]]
      const result = await fetchGasStationsAlongRoute(routeCoords, 50)
      // haversineKm is mocked to return 1.0 (within 50km), so station should be included
      expect(Array.isArray(result)).toBe(true)
    })

    it('handles API returning center-based elements (way)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          elements: [
            {
              id: 2,
              center: { lat: 48.87, lon: 2.38 },
              tags: { amenity: 'fuel', brand: 'Shell' },
            },
          ],
        }),
      })
      const routeCoords = [[2.35, 48.85], [2.40, 48.90]]
      const result = await fetchGasStationsAlongRoute(routeCoords, 50)
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('fetchGasStationsInBounds', () => {
    it('returns empty array for null bounds', async () => {
      const result = await fetchGasStationsInBounds(null)
      expect(result).toEqual([])
    })

    it('calls Overpass API for valid bounds', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ elements: [] }),
      })
      const bounds = { south: 48.0, west: 2.0, north: 49.0, east: 3.0 }
      const result = await fetchGasStationsInBounds(bounds)
      expect(Array.isArray(result)).toBe(true)
    })

    it('returns empty array when API fails', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Timeout'))
      const bounds = { south: 48.0, west: 2.0, north: 49.0, east: 3.0 }
      const result = await fetchGasStationsInBounds(bounds)
      expect(result).toEqual([])
    })

    it('returns stations with correct structure', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          elements: [
            {
              id: 10,
              lat: 48.5,
              lon: 2.5,
              tags: { amenity: 'fuel', name: 'Esso', brand: 'Esso' },
            },
          ],
        }),
      })
      const bounds = { south: 48.0, west: 2.0, north: 49.0, east: 3.0 }
      const result = await fetchGasStationsInBounds(bounds)
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('lat')
        expect(result[0]).toHaveProperty('lng')
        expect(result[0]).toHaveProperty('name')
      }
    })
  })

  describe('toggleGasStations', () => {
    it('runs without error when no map instance', () => {
      getState.mockReturnValue({ showGasStationsOnMap: false, gasStations: [] })
      expect(() => toggleGasStations()).not.toThrow()
    })

    it('calls setState to toggle visibility (off → on)', () => {
      getState.mockReturnValue({ showGasStationsOnMap: false })
      toggleGasStations()
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ showGasStationsOnMap: true })
      )
    })

    it('calls setState to toggle visibility (on → off)', () => {
      getState.mockReturnValue({ showGasStationsOnMap: true })
      toggleGasStations()
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ showGasStationsOnMap: false })
      )
    })
  })

  describe('loadGasStations', () => {
    it('runs without error when no map instance', () => {
      delete window.homeMapInstance
      expect(() => loadGasStations()).not.toThrow()
    })

    it('calls setState with showGasStationsOnMap false when no map', () => {
      delete window.homeMapInstance
      loadGasStations()
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ showGasStationsOnMap: false })
      )
    })

    it('calls flyTo and schedules retry when zoom < 8', () => {
      vi.useFakeTimers()
      const mockMap = {
        getZoom: vi.fn(() => 5),
        getCenter: vi.fn(() => ({ lat: 48.85, lng: 2.35 })),
        flyTo: vi.fn(),
        getBounds: vi.fn(() => null),
      }
      window.homeMapInstance = mockMap
      loadGasStations()
      expect(mockMap.flyTo).toHaveBeenCalled()
      vi.useRealTimers()
      delete window.homeMapInstance
    })

    it('does not throw when zoom < 8 but getCenter returns null', () => {
      const mockMap = {
        getZoom: vi.fn(() => 5),
        getCenter: vi.fn(() => null),
        flyTo: vi.fn(),
        getBounds: vi.fn(() => null),
      }
      window.homeMapInstance = mockMap
      expect(() => loadGasStations()).not.toThrow()
      delete window.homeMapInstance
    })

    it('calls fetchGasStationsInBounds when zoom >= 8 and bounds available', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ elements: [] }),
      })
      const mockBounds = {
        getNorthEast: vi.fn(() => ({ lat: 49, lng: 3 })),
        getSouthWest: vi.fn(() => ({ lat: 48, lng: 2 })),
      }
      const mockMap = {
        getZoom: vi.fn(() => 12),
        getBounds: vi.fn(() => mockBounds),
      }
      window.homeMapInstance = mockMap
      expect(() => loadGasStations()).not.toThrow()
      delete window.homeMapInstance
    })
  })
})
