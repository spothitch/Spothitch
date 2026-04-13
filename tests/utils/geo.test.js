import { describe, it, expect } from 'vitest'
import { haversineKm } from '../../src/utils/geo.js'

describe('Geo Utils', () => {
  describe('haversineKm', () => {
    it('returns 0 for same point', () => {
      expect(haversineKm(48.85, 2.35, 48.85, 2.35)).toBe(0)
    })

    it('calculates Paris → Lyon ~390km', () => {
      const d = haversineKm(48.8566, 2.3522, 45.7640, 4.8357)
      expect(d).toBeGreaterThan(380)
      expect(d).toBeLessThan(400)
    })

    it('calculates Paris → Berlin ~878km', () => {
      const d = haversineKm(48.8566, 2.3522, 52.5200, 13.4050)
      expect(d).toBeGreaterThan(850)
      expect(d).toBeLessThan(900)
    })

    it('handles negative coordinates', () => {
      // Buenos Aires → Sydney
      const d = haversineKm(-34.6037, -58.3816, -33.8688, 151.2093)
      expect(d).toBeGreaterThan(11000)
      expect(d).toBeLessThan(12500)
    })
  })
})
