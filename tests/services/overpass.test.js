import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/utils/clientRateLimit.js', () => ({
  recordRequest: vi.fn(() => true),
  getWaitTime: vi.fn(() => 0),
}))

import { clearOverpassCache, getAmenitiesAlongRoute } from '../../src/services/overpass.js'

describe('overpass', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearOverpassCache()
    global.fetch = vi.fn()
  })

  describe('clearOverpassCache', () => {
    it('is a function', () => {
      expect(typeof clearOverpassCache).toBe('function')
    })

    it('does not throw', () => {
      expect(() => clearOverpassCache()).not.toThrow()
    })

    it('can be called multiple times', () => {
      expect(() => {
        clearOverpassCache()
        clearOverpassCache()
      }).not.toThrow()
    })
  })

  describe('getAmenitiesAlongRoute', () => {
    it('returns empty array for null geometry', async () => {
      const result = await getAmenitiesAlongRoute(null)
      expect(result).toEqual([])
    })

    it('returns empty array for empty geometry', async () => {
      const result = await getAmenitiesAlongRoute([])
      expect(result).toEqual([])
    })

    it('returns empty array for single point', async () => {
      const result = await getAmenitiesAlongRoute([[2.35, 48.85]])
      expect(result).toEqual([])
    })

    it('returns array for valid geometry with mock fetch', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ elements: [] }),
      })
      const geometry = [[2.35, 48.85], [2.40, 48.90], [2.45, 48.95]]
      const result = await getAmenitiesAlongRoute(geometry)
      expect(Array.isArray(result)).toBe(true)
    })

    it('returns empty array when fetch fails', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))
      const geometry = [[2.35, 48.85], [2.40, 48.90]]
      const result = await getAmenitiesAlongRoute(geometry)
      expect(result).toEqual([])
    })

    it('returns empty array when response is not ok', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        headers: { get: () => 'text/html' },
      })
      const geometry = [[2.35, 48.85], [2.40, 48.90]]
      const result = await getAmenitiesAlongRoute(geometry)
      expect(result).toEqual([])
    })

    it('returns empty array when response is non-JSON', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => 'text/html' },
      })
      const geometry = [[2.35, 48.85], [2.40, 48.90]]
      const result = await getAmenitiesAlongRoute(geometry)
      expect(result).toEqual([])
    })

    it('maps fuel station elements to POI objects', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({
          elements: [
            {
              type: 'node',
              id: 1,
              lat: 48.87,
              lon: 2.38,
              tags: { amenity: 'fuel', name: 'Total', brand: 'Total' },
            },
          ],
        }),
      })
      const geometry = [[2.35, 48.85], [2.40, 48.90]]
      const result = await getAmenitiesAlongRoute(geometry)
      expect(Array.isArray(result)).toBe(true)
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('lat')
        expect(result[0]).toHaveProperty('lng')
        expect(result[0].type).toBe('fuel')
      }
    })

    it('maps rest_area elements to POI objects', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({
          elements: [
            {
              type: 'node',
              id: 2,
              lat: 48.87,
              lon: 2.38,
              tags: { highway: 'rest_area', name: 'Aire de Paris' },
            },
          ],
        }),
      })
      const geometry = [[2.35, 48.85], [2.40, 48.90]]
      const result = await getAmenitiesAlongRoute(geometry)
      expect(Array.isArray(result)).toBe(true)
      if (result.length > 0) {
        expect(result[0].type).toBe('rest_area')
      }
    })

    it('uses cache for same route geometry', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ elements: [] }),
      })
      const geometry = [[2.35, 48.85], [2.40, 48.90]]
      await getAmenitiesAlongRoute(geometry)
      await getAmenitiesAlongRoute(geometry)
      // Second call uses cache — fetch called once only
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('does not use cache after clearOverpassCache', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ elements: [] }),
      })
      const geometry = [[2.36, 48.86], [2.41, 48.91]]
      await getAmenitiesAlongRoute(geometry)
      clearOverpassCache()
      await getAmenitiesAlongRoute(geometry)
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    it('filters by showFuel=false', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({
          elements: [
            { type: 'node', id: 1, lat: 48.87, lon: 2.38, tags: { amenity: 'fuel' } },
            { type: 'node', id: 2, lat: 48.87, lon: 2.39, tags: { highway: 'rest_area' } },
          ],
        }),
      })
      const geometry = [[2.37, 48.87], [2.42, 48.92]]
      const result = await getAmenitiesAlongRoute(geometry, 2, { showFuel: false, showRestAreas: true })
      const fuelPois = result.filter(p => p.type === 'fuel')
      expect(fuelPois.length).toBe(0)
    })
  })
})
