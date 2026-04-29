import { describe, it, expect, vi } from 'vitest'

// cityRoutes only depends on haversineKm from geo.js — no mocking needed
import {
  slugify,
  findNearbySpots,
  buildCityInfo,
  buildCityDataFromMap,
} from '../../src/services/cityRoutes.js'

// Sample spot data
const makeSpot = (id, lat, lon, opts = {}) => ({
  id,
  lat,
  lon,
  rating: opts.rating || 0,
  wait: opts.wait || 0,
  destLat: opts.destLat || null,
  destLon: opts.destLon || null,
  country: opts.country || 'FR',
  ...opts,
})

describe('cityRoutes', () => {
  describe('slugify', () => {
    it('lowercases the string', () => {
      expect(slugify('Paris')).toBe('paris')
    })

    it('replaces spaces with hyphens', () => {
      expect(slugify('New York')).toBe('new-york')
    })

    it('removes accents', () => {
      expect(slugify('Île-de-France')).toBe('ile-de-france')
    })

    it('removes special characters', () => {
      expect(slugify('Köln (Cologne)')).toBe('koln-cologne')
    })

    it('trims leading and trailing hyphens', () => {
      expect(slugify('--test--')).toBe('test')
    })

    it('handles multiple consecutive spaces/special chars', () => {
      expect(slugify('Saint   Étienne')).toBe('saint-etienne')
    })

    it('handles empty string', () => {
      expect(slugify('')).toBe('')
    })

    it('handles already clean slug', () => {
      expect(slugify('bordeaux')).toBe('bordeaux')
    })

    it('handles numbers', () => {
      expect(slugify('Lyon 3')).toBe('lyon-3')
    })

    it('handles full country names with accents', () => {
      expect(slugify('Île-de-France')).toBe('ile-de-france')
      expect(slugify('España')).toBe('espana')
    })
  })

  describe('findNearbySpots', () => {
    // Paris coords
    const LAT = 48.8566
    const LNG = 2.3522

    const spots = [
      makeSpot('p1', 48.85, 2.35),           // ~0.7 km — within 30 km
      makeSpot('p2', 48.9, 2.5),             // ~13 km — within 30 km
      makeSpot('p3', 51.5, -0.12),           // London — ~340 km away
      makeSpot('p4', 49.0, 2.0),             // ~18 km away
      makeSpot('p5', 50.0, 3.0),             // ~131 km away — outside 30 km
    ]

    it('returns only spots within the default radius (30 km)', () => {
      const result = findNearbySpots(spots, LAT, LNG)
      const ids = result.map(s => s.id)
      expect(ids).toContain('p1')
      expect(ids).toContain('p2')
      expect(ids).not.toContain('p3')
      expect(ids).not.toContain('p5')
    })

    it('returns fewer spots with a smaller radius', () => {
      const result = findNearbySpots(spots, LAT, LNG, 5)
      expect(result.length).toBeLessThan(3)
      expect(result.map(s => s.id)).toContain('p1')
    })

    it('returns all spots with a very large radius', () => {
      const result = findNearbySpots(spots, LAT, LNG, 10000)
      expect(result.length).toBe(spots.length)
    })

    it('returns empty array when no spots match radius', () => {
      const result = findNearbySpots(spots, LAT, LNG, 0.1)
      expect(result).toEqual([])
    })

    it('handles spots with coordinates in nested object format', () => {
      const nestedSpots = [
        { id: 'n1', coordinates: { lat: 48.85, lng: 2.35 }, rating: 0, wait: 0 },
      ]
      const result = findNearbySpots(nestedSpots, LAT, LNG, 30)
      expect(result.map(s => s.id)).toContain('n1')
    })

    it('skips spots with no coordinates', () => {
      const missingCoords = [
        { id: 'bad1' },
        { id: 'bad2', lat: null, lon: null },
        makeSpot('good', 48.85, 2.35),
      ]
      const result = findNearbySpots(missingCoords, LAT, LNG, 30)
      expect(result.map(s => s.id)).toEqual(['good'])
    })

    it('returns empty array for empty spots list', () => {
      expect(findNearbySpots([], LAT, LNG)).toEqual([])
    })

    it('handles lng field in addition to lon', () => {
      const lngSpot = [{ id: 's1', lat: 48.85, lng: 2.35 }]
      const result = findNearbySpots(lngSpot, LAT, LNG, 30)
      expect(result.length).toBe(1)
    })
  })

  describe('buildCityInfo', () => {
    const allSpots = [
      makeSpot('s1', 48.85, 2.35, { wait: 10, rating: 4, destLat: 43.3, destLon: 5.4 }), // Marseille dir
      makeSpot('s2', 48.86, 2.34, { wait: 20, rating: 3, destLat: 43.3, destLon: 5.4 }), // same direction
      makeSpot('s3', 48.90, 2.50, { wait: 5, rating: 5, destLat: 47.2, destLon: -1.5 }),  // Nantes dir
      makeSpot('s4', 51.50, -0.12),                                                         // London — far away
    ]

    it('returns city name and slug', () => {
      const result = buildCityInfo(allSpots, 'Paris', 48.8566, 2.3522, 'FR', 'France')
      expect(result.name).toBe('Paris')
      expect(result.slug).toBe('paris')
    })

    it('returns country info', () => {
      const result = buildCityInfo(allSpots, 'Paris', 48.8566, 2.3522, 'FR', 'France')
      expect(result.country).toBe('FR')
      expect(result.countryName).toBe('France')
    })

    it('counts only nearby spots', () => {
      const result = buildCityInfo(allSpots, 'Paris', 48.8566, 2.3522, 'FR', 'France')
      // s1, s2, s3 are within 30 km. s4 (London) is not.
      expect(result.spotCount).toBe(3)
    })

    it('computes average wait time from nearby spots', () => {
      const result = buildCityInfo(allSpots, 'Paris', 48.8566, 2.3522, 'FR', 'France')
      // waits: 10, 20, 5 → avg = round(35/3) = 12
      expect(result.avgWait).toBe(12)
    })

    it('computes average rating from nearby spots', () => {
      const result = buildCityInfo(allSpots, 'Paris', 48.8566, 2.3522, 'FR', 'France')
      // ratings: 4, 3, 5 → avg = 4.0
      expect(result.avgRating).toBe(4)
    })

    it('groups spots into routes by direction', () => {
      const result = buildCityInfo(allSpots, 'Paris', 48.8566, 2.3522, 'FR', 'France')
      // s1+s2 go toward ~same destination (Marseille), s3 goes toward Nantes
      expect(result.routesList.length).toBeGreaterThanOrEqual(1)
    })

    it('routes are sorted by spotCount descending', () => {
      const result = buildCityInfo(allSpots, 'Paris', 48.8566, 2.3522, 'FR', 'France')
      for (let i = 0; i < result.routesList.length - 1; i++) {
        expect(result.routesList[i].spotCount).toBeGreaterThanOrEqual(result.routesList[i + 1].spotCount)
      }
    })

    it('returns empty routesList when no spots have destinations', () => {
      const noDestSpots = [makeSpot('x1', 48.85, 2.35, { destLat: null, destLon: null })]
      const result = buildCityInfo(noDestSpots, 'Paris', 48.8566, 2.3522, 'FR', 'France')
      expect(result.routesList).toEqual([])
    })

    it('lat/lng are set correctly', () => {
      const result = buildCityInfo(allSpots, 'Paris', 48.8566, 2.3522, 'FR', 'France')
      expect(result.lat).toBe(48.8566)
      expect(result.lng).toBe(2.3522)
    })

    it('returns avgWait=0 when no spots have wait data', () => {
      const noWaitSpots = [makeSpot('w1', 48.85, 2.35, { wait: 0 })]
      const result = buildCityInfo(noWaitSpots, 'Paris', 48.8566, 2.3522)
      expect(result.avgWait).toBe(0)
    })

    it('handles empty countryCode gracefully', () => {
      const result = buildCityInfo(allSpots, 'Unknown City', 48.8566, 2.3522, null, null)
      expect(result.country).toBe('')
      expect(result.countryName).toBe('')
    })
  })

  describe('buildCityDataFromMap', () => {
    const spots = [
      { id: 's1', lat: 48.9, lon: 2.3, wait: 15, rating: 4, country: 'FR' },
      { id: 's2', lat: 48.9, lon: 2.3, wait: 25, rating: 3, country: 'FR' },
      { id: 's3', lat: 43.3, lon: 5.4, wait: 10, rating: 5, country: 'FR' },
    ]

    const cityMap = {
      '48.9_2.3': 'Paris',
      '43.3_5.4': 'Marseille',
    }

    it('returns cities keyed by slug', () => {
      const result = buildCityDataFromMap(spots, cityMap)
      expect(result['paris']).toBeDefined()
      expect(result['marseille']).toBeDefined()
    })

    it('groups spots by city', () => {
      const result = buildCityDataFromMap(spots, cityMap)
      expect(result['paris'].spots.length).toBe(2)
      expect(result['marseille'].spots.length).toBe(1)
    })

    it('computes spotCount for each city', () => {
      const result = buildCityDataFromMap(spots, cityMap)
      expect(result['paris'].spotCount).toBe(2)
      expect(result['marseille'].spotCount).toBe(1)
    })

    it('computes avgWait for each city', () => {
      const result = buildCityDataFromMap(spots, cityMap)
      // Paris: (15+25)/2 = 20
      expect(result['paris'].avgWait).toBe(20)
      // Marseille: 10
      expect(result['marseille'].avgWait).toBe(10)
    })

    it('computes avgRating for each city', () => {
      const result = buildCityDataFromMap(spots, cityMap)
      // Paris: (4+3)/2 = 3.5
      expect(result['paris'].avgRating).toBe(3.5)
    })

    it('skips spots not in cityMap', () => {
      const extraSpot = [{ id: 'orphan', lat: 1.0, lon: 1.0, wait: 5, rating: 2, country: 'XX' }]
      const result = buildCityDataFromMap(extraSpot, cityMap)
      expect(Object.keys(result).length).toBe(0)
    })

    it('skips spots with missing coordinates', () => {
      const badSpots = [{ id: 'bad', wait: 5, rating: 2 }]
      const result = buildCityDataFromMap(badSpots, cityMap)
      expect(Object.keys(result).length).toBe(0)
    })

    it('stores city lat/lng from first encountered spot', () => {
      const result = buildCityDataFromMap(spots, cityMap)
      expect(result['paris'].lat).toBeDefined()
      expect(result['paris'].lng).toBeDefined()
    })

    it('returns empty object for empty spots array', () => {
      const result = buildCityDataFromMap([], cityMap)
      expect(result).toEqual({})
    })

    it('handles spots with lng instead of lon', () => {
      const lngSpots = [{ id: 's1', lat: 48.9, lng: 2.3, wait: 5, rating: 3, country: 'FR' }]
      const result = buildCityDataFromMap(lngSpots, cityMap)
      expect(result['paris']).toBeDefined()
    })

    it('handles spots with nested coordinates', () => {
      const nestedSpots = [{ id: 's1', coordinates: { lat: 48.9, lng: 2.3 }, wait: 5, rating: 3, country: 'FR' }]
      const result = buildCityDataFromMap(nestedSpots, cityMap)
      expect(result['paris']).toBeDefined()
    })
  })
})
