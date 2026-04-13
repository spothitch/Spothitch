import { describe, it, expect, vi } from 'vitest'
import { detectPlatform, openInGoogleMaps, openInWaze } from '../../src/utils/navigation.js'

describe('Navigation Utils', () => {
  describe('detectPlatform', () => {
    it('returns platform object', () => {
      const p = detectPlatform()
      expect(p).toHaveProperty('isIOS')
      expect(p).toHaveProperty('isAndroid')
      expect(p).toHaveProperty('isDesktop')
    })
  })

  describe('openInGoogleMaps', () => {
    it('rejects invalid coordinates', () => {
      expect(openInGoogleMaps(NaN, 2.35)).toBe(false)
      expect(openInGoogleMaps(48.85, NaN)).toBe(false)
      expect(openInGoogleMaps(Infinity, 2.35)).toBe(false)
      expect(openInGoogleMaps(-91, 2.35)).toBe(false)
      expect(openInGoogleMaps(48.85, 181)).toBe(false)
    })

    it('accepts valid coordinates', () => {
      const spy = vi.spyOn(window, 'open').mockImplementation(() => null)
      const result = openInGoogleMaps(48.85, 2.35, 'Paris')
      expect(result).toBe(true)
      spy.mockRestore()
    })
  })

  describe('openInWaze', () => {
    it('rejects invalid coordinates', () => {
      expect(openInWaze(NaN, 2.35)).toBe(false)
      expect(openInWaze(48.85, -181)).toBe(false)
    })

    it('accepts valid coordinates', () => {
      const spy = vi.spyOn(window, 'open').mockImplementation(() => null)
      const result = openInWaze(48.85, 2.35)
      expect(result).toBe(true)
      spy.mockRestore()
    })
  })
})
