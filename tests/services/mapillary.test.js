import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock fetch for Mapillary API
global.fetch = vi.fn().mockResolvedValue({ ok: false, json: () => Promise.resolve({}) })

import { isMapillaryConfigured, clearMapillaryCache, fetchMapillaryPhotos } from '../../src/services/mapillary.js'

describe('mapillary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearMapillaryCache()
  })

  describe('isMapillaryConfigured', () => {
    it('returns boolean', () => {
      const result = isMapillaryConfigured()
      expect(typeof result).toBe('boolean')
    })

    it('returns false when no token set (test environment)', () => {
      // In test env, VITE_MAPILLARY_TOKEN is not set
      expect(isMapillaryConfigured()).toBe(false)
    })
  })

  describe('clearMapillaryCache', () => {
    it('does not throw', () => {
      expect(() => clearMapillaryCache()).not.toThrow()
    })

    it('can be called multiple times safely', () => {
      expect(() => {
        clearMapillaryCache()
        clearMapillaryCache()
      }).not.toThrow()
    })
  })

  describe('fetchMapillaryPhotos', () => {
    it('returns empty array when no token configured', async () => {
      // No token in test env → returns [] immediately
      const result = await fetchMapillaryPhotos(48.8566, 2.3522)
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })

    it('does not call fetch when no token', async () => {
      fetch.mockClear()
      await fetchMapillaryPhotos(48.8566, 2.3522)
      // fetch should NOT be called because no token
      expect(fetch).not.toHaveBeenCalled()
    })

    it('accepts custom radius parameter', async () => {
      const result = await fetchMapillaryPhotos(48.8566, 2.3522, 200)
      expect(Array.isArray(result)).toBe(true)
    })

    it('accepts custom limit parameter', async () => {
      const result = await fetchMapillaryPhotos(48.8566, 2.3522, 100, 5)
      expect(Array.isArray(result)).toBe(true)
    })

    it('runs without error for any coordinates', async () => {
      await expect(fetchMapillaryPhotos(0, 0)).resolves.not.toThrow()
    })
  })
})
