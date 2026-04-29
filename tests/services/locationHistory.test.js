import { describe, it, expect } from 'vitest'

import {
  distanceMeters,
  CHECK_IN_RADIUS_M,
  VALIDATION_RADIUS_M,
  MAX_AGE_MS,
} from '../../src/services/locationHistory.js'

describe('locationHistory', () => {
  describe('distanceMeters (Haversine)', () => {
    it('returns 0 for same point', () => {
      expect(distanceMeters(48.8566, 2.3522, 48.8566, 2.3522)).toBe(0)
    })

    it('calculates short distance correctly (~111m per 0.001 lat)', () => {
      const dist = distanceMeters(48.8566, 2.3522, 48.8576, 2.3522)
      expect(dist).toBeGreaterThan(100)
      expect(dist).toBeLessThan(120)
    })

    it('Paris to Lyon is ~390km', () => {
      const dist = distanceMeters(48.8566, 2.3522, 45.764, 4.8357)
      const km = dist / 1000
      expect(km).toBeGreaterThan(380)
      expect(km).toBeLessThan(400)
    })

    it('Paris to Berlin is ~878km', () => {
      const dist = distanceMeters(48.8566, 2.3522, 52.5200, 13.4050)
      const km = dist / 1000
      expect(km).toBeGreaterThan(850)
      expect(km).toBeLessThan(900)
    })

    it('handles negative coordinates', () => {
      // New York to Buenos Aires
      const dist = distanceMeters(40.7128, -74.0060, -34.6037, -58.3816)
      const km = dist / 1000
      expect(km).toBeGreaterThan(8000)
      expect(km).toBeLessThan(9000)
    })

    it('handles crossing 180th meridian', () => {
      const dist = distanceMeters(0, 179, 0, -179)
      const km = dist / 1000
      expect(km).toBeGreaterThan(200)
      expect(km).toBeLessThan(250)
    })
  })

  describe('constants', () => {
    it('CHECK_IN_RADIUS_M is 500', () => {
      expect(CHECK_IN_RADIUS_M).toBe(500)
    })

    it('VALIDATION_RADIUS_M is 2000', () => {
      expect(VALIDATION_RADIUS_M).toBe(2000)
    })

    it('MAX_AGE_MS is 24 hours', () => {
      expect(MAX_AGE_MS).toBe(24 * 60 * 60 * 1000)
    })
  })
})
