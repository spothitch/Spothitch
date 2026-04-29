import { describe, it, expect } from 'vitest'

import {
  haversine,
  batchDistances,
  findNearest,
  spotsInRadius,
  getGeoInfo,
} from '../../src/utils/wasmGeo.js'

describe('wasmGeo (JS fallback)', () => {
  describe('haversine', () => {
    it('returns 0 for same point', () => {
      expect(haversine(48.8566, 2.3522, 48.8566, 2.3522)).toBe(0)
    })

    it('Paris to Lyon is ~390km', () => {
      const dist = haversine(48.8566, 2.3522, 45.764, 4.8357)
      expect(dist).toBeGreaterThan(380)
      expect(dist).toBeLessThan(400)
    })

    it('Paris to Berlin is ~878km', () => {
      const dist = haversine(48.8566, 2.3522, 52.52, 13.405)
      expect(dist).toBeGreaterThan(850)
      expect(dist).toBeLessThan(900)
    })

    it('handles negative coordinates', () => {
      const dist = haversine(0, 0, 0, 180)
      expect(dist).toBeGreaterThan(20000) // half Earth circumference
    })

    it('short distance (~1km)', () => {
      // ~1km shift in lat at equator
      const dist = haversine(0, 0, 0.009, 0)
      expect(dist).toBeGreaterThan(0.9)
      expect(dist).toBeLessThan(1.1)
    })
  })

  describe('batchDistances', () => {
    it('returns distances for array of points', () => {
      const points = [
        { lat: 45.764, lng: 4.8357 }, // Lyon
        { lat: 52.52, lng: 13.405 },  // Berlin
      ]
      const dists = batchDistances(48.8566, 2.3522, points)
      expect(dists.length).toBe(2)
      expect(dists[0]).toBeGreaterThan(380)  // Paris-Lyon
      expect(dists[1]).toBeGreaterThan(850)  // Paris-Berlin
    })

    it('handles empty array', () => {
      const dists = batchDistances(48.8566, 2.3522, [])
      expect(dists.length).toBe(0)
    })

    it('handles missing coords', () => {
      const dists = batchDistances(0, 0, [{ lat: 0, lng: 0 }])
      expect(dists[0]).toBe(0)
    })
  })

  describe('findNearest', () => {
    const spots = [
      { id: 1, lat: 45.764, lng: 4.8357 },   // Lyon ~390km
      { id: 2, lat: 52.52, lng: 13.405 },     // Berlin ~878km
      { id: 3, lat: 48.57, lng: 7.75 },       // Strasbourg ~400km
      { id: 4, lat: 43.296, lng: 5.369 },     // Marseille ~660km
    ]

    it('returns nearest N spots', () => {
      const nearest = findNearest(48.8566, 2.3522, spots, 2)
      expect(nearest.length).toBe(2)
      // Lyon should be nearest
      expect(nearest[0].spot.id).toBe(1)
    })

    it('includes distance in results', () => {
      const nearest = findNearest(48.8566, 2.3522, spots, 1)
      expect(nearest[0].distance).toBeDefined()
      expect(nearest[0].distance).toBeGreaterThan(0)
    })

    it('handles N larger than spots count', () => {
      const nearest = findNearest(48.8566, 2.3522, spots, 100)
      expect(nearest.length).toBe(4)
    })

    it('handles spots with coordinates object', () => {
      const coordSpots = [
        { id: 1, coordinates: { lat: 45.764, lng: 4.8357 } },
      ]
      const nearest = findNearest(48.8566, 2.3522, coordSpots, 1)
      expect(nearest.length).toBe(1)
      expect(nearest[0].distance).toBeGreaterThan(380)
    })
  })

  describe('spotsInRadius', () => {
    const spots = [
      { id: 1, lat: 48.86, lng: 2.35 },   // ~1km from center
      { id: 2, lat: 45.764, lng: 4.836 },  // Lyon ~390km
      { id: 3, lat: 48.87, lng: 2.36 },    // ~2km from center
    ]

    it('filters spots within radius', () => {
      const result = spotsInRadius(48.8566, 2.3522, spots, 10)
      expect(result.length).toBe(2) // only nearby spots
      expect(result.map(s => s.id)).toContain(1)
      expect(result.map(s => s.id)).toContain(3)
    })

    it('returns all spots with large radius', () => {
      const result = spotsInRadius(48.8566, 2.3522, spots, 1000)
      expect(result.length).toBe(3)
    })

    it('returns no spots with tiny radius', () => {
      const result = spotsInRadius(48.8566, 2.3522, spots, 0.001)
      expect(result.length).toBe(0)
    })

    it('results are sorted by distance', () => {
      const result = spotsInRadius(48.8566, 2.3522, spots, 1000)
      for (let i = 1; i < result.length; i++) {
        expect(result[i]._distance).toBeGreaterThanOrEqual(result[i - 1]._distance)
      }
    })
  })

  describe('getGeoInfo', () => {
    it('returns backend info', () => {
      const info = getGeoInfo()
      expect(info.backend).toBe('javascript') // WASM not available in test
      expect(info.wasmReady).toBe(false)
    })
  })
})
