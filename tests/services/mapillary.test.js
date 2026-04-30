import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock fetch for Mapillary API
global.fetch = vi.fn().mockResolvedValue({ ok: false, json: () => Promise.resolve({}) })

import { isMapillaryConfigured, clearMapillaryCache } from '../../src/services/mapillary.js'

describe('mapillary', () => {
  describe('isMapillaryConfigured', () => {
    it('returns boolean', () => {
      const result = isMapillaryConfigured()
      expect(typeof result).toBe('boolean')
    })
  })

  describe('clearMapillaryCache', () => {
    it('does not throw', () => {
      expect(() => clearMapillaryCache()).not.toThrow()
    })
  })
})
