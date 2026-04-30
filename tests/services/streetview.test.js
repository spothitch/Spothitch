import { describe, it, expect } from 'vitest'
import { getStreetViewUrl, calculateHeading } from '../../src/services/streetview.js'

describe('streetview', () => {
  describe('getStreetViewUrl', () => {
    it('returns a Google Maps URL', () => {
      const url = getStreetViewUrl(48.8566, 2.3522)
      expect(url).toContain('google.com/maps')
      expect(url).toContain('48.8566')
      expect(url).toContain('2.3522')
    })
    it('includes heading', () => {
      const url = getStreetViewUrl(48.85, 2.35, 90)
      expect(url).toContain('heading=90')
    })
    it('defaults heading to 0', () => {
      const url = getStreetViewUrl(48.85, 2.35)
      expect(url).toContain('heading=0')
    })
  })

  describe('calculateHeading', () => {
    it('north heading ~0', () => {
      const h = calculateHeading(48.85, 2.35, 49.85, 2.35)
      expect(h).toBeLessThan(5) // ~0 degrees north
    })
    it('east heading ~90', () => {
      const h = calculateHeading(48.85, 2.35, 48.85, 3.35)
      expect(h).toBeGreaterThan(80)
      expect(h).toBeLessThan(100)
    })
    it('south heading ~180', () => {
      const h = calculateHeading(48.85, 2.35, 47.85, 2.35)
      expect(h).toBeGreaterThan(170)
      expect(h).toBeLessThan(190)
    })
    it('returns value between 0 and 360', () => {
      const h = calculateHeading(0, 0, -10, -10)
      expect(h).toBeGreaterThanOrEqual(0)
      expect(h).toBeLessThan(360)
    })
  })
})
