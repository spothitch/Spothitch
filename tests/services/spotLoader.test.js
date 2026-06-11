import { describe, it, expect } from 'vitest'

import {
  getCountryCenters,
  loadSpotIndex,
  loadCountrySpots,
  loadSpotsInBounds,
  loadSpotsInRadius,
  getAllLoadedSpots,
  getLoadedCountries,
  getLoadedCountryCodes,
} from '../../src/services/spotLoader.js'

describe('spotLoader', () => {
  describe('getCountryCenters', () => {
    it('returns an object with country codes as keys', () => {
      const centers = getCountryCenters()
      expect(typeof centers).toBe('object')
      expect(centers).not.toBeNull()
    })

    it('includes France (FR)', () => {
      const centers = getCountryCenters()
      expect(centers.FR).toBeDefined()
      expect(centers.FR.lat).toBeCloseTo(46.6, 0)
      expect(centers.FR.lon).toBeCloseTo(2.2, 0)
    })

    it('includes Germany (DE)', () => {
      const centers = getCountryCenters()
      expect(centers.DE).toBeDefined()
      expect(centers.DE.lat).toBeCloseTo(51.2, 0)
    })

    it('includes Spain (ES)', () => {
      const centers = getCountryCenters()
      expect(centers.ES).toBeDefined()
    })

    it('includes US', () => {
      const centers = getCountryCenters()
      expect(centers.US).toBeDefined()
    })

    it('has valid lat/lon for all entries', () => {
      const centers = getCountryCenters()
      for (const [code, center] of Object.entries(centers)) {
        expect(typeof center.lat).toBe('number'), `${code} missing lat`
        expect(typeof center.lon).toBe('number'), `${code} missing lon`
        expect(center.lat).toBeGreaterThanOrEqual(-90)
        expect(center.lat).toBeLessThanOrEqual(90)
        expect(center.lon).toBeGreaterThanOrEqual(-180)
        expect(center.lon).toBeLessThanOrEqual(180)
      }
    })

    it('has 30+ country entries', () => {
      const centers = getCountryCenters()
      expect(Object.keys(centers).length).toBeGreaterThan(30)
    })
  })

  describe('stub functions (community-only mode)', () => {
    it('loadSpotIndex returns null', async () => {
      const result = await loadSpotIndex()
      expect(result).toBeNull()
    })

    it('loadCountrySpots returns empty array', async () => {
      const result = await loadCountrySpots('FR')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })

    it('loadSpotsInBounds returns empty array', async () => {
      const result = await loadSpotsInBounds({ north: 50, south: 48, east: 3, west: 2 })
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })

    it('loadSpotsInRadius returns empty array', async () => {
      const result = await loadSpotsInRadius(48.8, 2.3, 10)
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })

    it('getAllLoadedSpots returns empty array', () => {
      const result = getAllLoadedSpots()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })

    it('getLoadedCountries returns empty array', () => {
      const result = getLoadedCountries()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })

    it('getLoadedCountryCodes returns empty Set', () => {
      const result = getLoadedCountryCodes()
      expect(result instanceof Set).toBe(true)
      expect(result.size).toBe(0)
    })
  })
})
