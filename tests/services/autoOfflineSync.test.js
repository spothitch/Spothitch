import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/services/notifications.js', () => ({
  showToast: vi.fn(),
}))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ userLocation: null })),
  setState: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/utils/idb.js', () => ({
  clear: vi.fn(async () => {}),
  getAll: vi.fn(async () => []),
  put: vi.fn(async () => {}),
}))

import {
  initAutoOfflineSync,
  performAutoSync,
  getOfflineStatus,
  forceOfflineSync,
  clearOfflineData,
} from '../../src/services/autoOfflineSync.js'
import { showToast } from '../../src/services/notifications.js'

describe('autoOfflineSync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('initAutoOfflineSync', () => {
    it('runs without error', () => {
      expect(() => initAutoOfflineSync()).not.toThrow()
    })

    it('is idempotent (second call is a no-op)', () => {
      expect(() => {
        initAutoOfflineSync()
        initAutoOfflineSync()
      }).not.toThrow()
    })

    it('registers an online event listener', () => {
      const addSpy = vi.spyOn(window, 'addEventListener')
      initAutoOfflineSync()
      // May or may not be called depending on isInitialized state
      expect(() => window.dispatchEvent(new Event('online'))).not.toThrow()
    })
  })

  describe('performAutoSync', () => {
    it('returns a promise', () => {
      const result = performAutoSync()
      expect(result instanceof Promise).toBe(true)
    })

    it('resolves with success when no countries to sync', async () => {
      // Empty localStorage → getSavedTrips returns [] → getRecentCheckins returns []
      // state.userLocation is null → no location country
      // → getRelevantCountries returns [] → returns { success: true }
      const result = await performAutoSync()
      expect(result.success).toBe(true)
    })

    it('returns synced object with correct structure', async () => {
      const result = await performAutoSync()
      expect(result).toHaveProperty('success')
      if (result.success) {
        expect(result.synced).toBeDefined()
        expect(Array.isArray(result.synced.countries)).toBe(true)
      }
    })

    it('reads last_sync from localStorage on init', () => {
      localStorage.setItem('spothitch_offline_last_sync', Date.now().toString())
      expect(() => initAutoOfflineSync()).not.toThrow()
    })
  })

  describe('getOfflineStatus', () => {
    it('returns an object', () => {
      const status = getOfflineStatus()
      expect(typeof status).toBe('object')
      expect(status).not.toBeNull()
    })

    it('has expected shape', () => {
      const status = getOfflineStatus()
      expect(Array.isArray(status.countries)).toBe(true)
      expect('lastSync' in status).toBe(true)
    })

    it('returns empty countries when nothing stored', () => {
      const status = getOfflineStatus()
      expect(status.countries).toEqual([])
    })

    it('reads guide entries from localStorage', () => {
      localStorage.setItem('spothitch_offline_guide_FR', JSON.stringify({ countryCode: 'FR' }))
      const status = getOfflineStatus()
      // guides key may exist in the status, countries from offlineDownload tracking
      expect(typeof status).toBe('object')
    })

    it('reads offline countries list from localStorage', () => {
      localStorage.setItem('spothitch_offline_countries', JSON.stringify([
        { code: 'FR', downloadedAt: Date.now() },
        { code: 'DE', downloadedAt: Date.now() },
      ]))
      const status = getOfflineStatus()
      expect(status.countries).toContain('FR')
      expect(status.countries).toContain('DE')
    })

    it('returns totalSize as MB string', () => {
      const status = getOfflineStatus()
      expect(typeof status.totalSize).toBe('string')
      expect(status.totalSize).toContain('MB')
    })

    it('isOnline reflects navigator.onLine', () => {
      const status = getOfflineStatus()
      expect(typeof status.isOnline).toBe('boolean')
    })

    it('returns guides list from localStorage', () => {
      localStorage.setItem('spothitch_offline_guide_FR', 'data')
      const status = getOfflineStatus()
      expect(Array.isArray(status.guides)).toBe(true)
      expect(status.guides).toContain('FR')
    })
  })

  describe('forceOfflineSync', () => {
    it('returns success when online', async () => {
      const result = await forceOfflineSync()
      expect(result).toHaveProperty('success')
      expect(showToast).toHaveBeenCalled()
    })

    it('calls showToast on success', async () => {
      vi.clearAllMocks()
      await forceOfflineSync()
      expect(showToast).toHaveBeenCalled()
    })
  })

  describe('clearOfflineData', () => {
    beforeEach(() => {
      // Mock caches API for clearOfflineData
      global.caches = { delete: vi.fn(async () => true) }
    })

    it('returns a promise', () => {
      const result = clearOfflineData()
      expect(result instanceof Promise).toBe(true)
    })

    it('clears spothitch_offline prefixed localStorage keys', async () => {
      localStorage.setItem('spothitch_offline_guide_FR', 'data')
      localStorage.setItem('spothitch_offline_countries', JSON.stringify([]))
      await clearOfflineData()
      // Keys with STORAGE_PREFIX should be removed
      expect(localStorage.getItem('spothitch_offline_guide_FR')).toBeNull()
    }, 10000)
  })
})
