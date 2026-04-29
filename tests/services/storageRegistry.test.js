import { describe, it, expect, beforeEach } from 'vitest'

import {
  DataCategory,
  STORAGE_KEYS,
  getAllRegisteredKeys,
  getKeysByCategory,
  getSensitiveKeys,
  clearAllUserData,
  exportAllUserData,
  getStorageStats,
} from '../../src/services/storageRegistry.js'

describe('storageRegistry', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('DataCategory', () => {
    it('has all expected categories', () => {
      expect(DataCategory.PERSONAL).toBe('personal')
      expect(DataCategory.ACTIVITY).toBe('activity')
      expect(DataCategory.SOCIAL).toBe('social')
      expect(DataCategory.GAMIFICATION).toBe('gamification')
      expect(DataCategory.SETTINGS).toBe('settings')
      expect(DataCategory.SECURITY).toBe('security')
      expect(DataCategory.ANALYTICS).toBe('analytics')
      expect(DataCategory.CACHE).toBe('cache')
      expect(DataCategory.MODERATION).toBe('moderation')
      expect(DataCategory.MONETIZATION).toBe('monetization')
    })
  })

  describe('STORAGE_KEYS', () => {
    it('is a non-empty array', () => {
      expect(Array.isArray(STORAGE_KEYS)).toBe(true)
      expect(STORAGE_KEYS.length).toBeGreaterThan(50)
    })

    it('every entry has key and description', () => {
      STORAGE_KEYS.forEach(entry => {
        expect(entry.key).toBeDefined()
        expect(entry.description).toBeDefined()
      })
    })

    it('most entries have a category', () => {
      const withCategory = STORAGE_KEYS.filter(e => e.category)
      expect(withCategory.length).toBeGreaterThan(STORAGE_KEYS.length * 0.95)
    })

    it('all keys start with spothitch_', () => {
      STORAGE_KEYS.forEach(entry => {
        expect(entry.key.startsWith('spothitch_')).toBe(true)
      })
    })
  })

  describe('getAllRegisteredKeys', () => {
    it('returns array of strings', () => {
      const keys = getAllRegisteredKeys()
      expect(Array.isArray(keys)).toBe(true)
      keys.forEach(k => expect(typeof k).toBe('string'))
    })

    it('has same length as STORAGE_KEYS', () => {
      expect(getAllRegisteredKeys().length).toBe(STORAGE_KEYS.length)
    })
  })

  describe('getKeysByCategory', () => {
    it('returns only keys of the given category', () => {
      const securityKeys = getKeysByCategory('security')
      expect(securityKeys.length).toBeGreaterThan(0)
      securityKeys.forEach(entry => {
        expect(entry.category).toBe('security')
      })
    })

    it('returns empty array for unknown category', () => {
      expect(getKeysByCategory('unknown')).toEqual([])
    })

    it('personal category includes user data', () => {
      const personal = getKeysByCategory('personal')
      const keys = personal.map(e => e.key)
      expect(keys).toContain('spothitch_user')
    })
  })

  describe('getSensitiveKeys', () => {
    it('returns only sensitive entries', () => {
      const sensitive = getSensitiveKeys()
      expect(sensitive.length).toBeGreaterThan(0)
      sensitive.forEach(entry => {
        expect(entry.sensitive).toBe(true)
      })
    })

    it('includes known sensitive keys', () => {
      const keys = getSensitiveKeys().map(e => e.key)
      expect(keys).toContain('spothitch_user')
      expect(keys).toContain('spothitch_2fa_enabled')
    })
  })

  describe('clearAllUserData', () => {
    it('clears registered keys', () => {
      localStorage.setItem('spothitch_user', 'alice')
      localStorage.setItem('spothitch_friends', '[]')
      const result = clearAllUserData()
      expect(result.cleared).toBeGreaterThan(0)
      expect(localStorage.getItem('spothitch_user')).toBeNull()
      expect(localStorage.getItem('spothitch_friends')).toBeNull()
    })

    it('clears dynamic spothitch_ keys', () => {
      localStorage.setItem('spothitch_tracked_foo', 'bar')
      localStorage.setItem('spothitch_offline_FR', 'data')
      clearAllUserData()
      expect(localStorage.getItem('spothitch_tracked_foo')).toBeNull()
      expect(localStorage.getItem('spothitch_offline_FR')).toBeNull()
    })

    it('does not clear non-spothitch keys', () => {
      localStorage.setItem('other_app_key', 'value')
      clearAllUserData()
      expect(localStorage.getItem('other_app_key')).toBe('value')
    })

    it('returns result object with cleared count', () => {
      localStorage.setItem('spothitch_user', 'test')
      const result = clearAllUserData()
      expect(result).toHaveProperty('cleared')
      expect(result).toHaveProperty('errors')
      expect(Array.isArray(result.errors)).toBe(true)
    })
  })

  describe('exportAllUserData', () => {
    it('returns empty object when no data', () => {
      const exported = exportAllUserData()
      expect(typeof exported).toBe('object')
    })

    it('exports data categorized by category', () => {
      localStorage.setItem('spothitch_user', JSON.stringify({ name: 'Alice' }))
      const exported = exportAllUserData()
      expect(exported.personal).toBeDefined()
      expect(exported.personal.spothitch_user).toEqual({ name: 'Alice' })
    })

    it('handles non-JSON values', () => {
      localStorage.setItem('spothitch_welcomed', 'true')
      const exported = exportAllUserData()
      // Should not throw
      expect(exported).toBeDefined()
    })

    it('includes dynamic keys in "other"', () => {
      localStorage.setItem('spothitch_custom_xyz', 'value')
      const exported = exportAllUserData()
      expect(exported.other).toBeDefined()
      expect(exported.other.spothitch_custom_xyz).toBe('value')
    })
  })

  describe('getStorageStats', () => {
    it('returns stats structure', () => {
      const stats = getStorageStats()
      expect(stats).toHaveProperty('totalKeys')
      expect(stats).toHaveProperty('totalBytes')
      expect(stats).toHaveProperty('totalKB')
      expect(stats).toHaveProperty('byCategory')
    })

    it('counts bytes for stored keys', () => {
      localStorage.setItem('spothitch_user', JSON.stringify({ name: 'Alice' }))
      const stats = getStorageStats()
      expect(stats.totalBytes).toBeGreaterThan(0)
    })

    it('categorizes storage by category', () => {
      localStorage.setItem('spothitch_user', 'test')
      localStorage.setItem('spothitch_friends', '[]')
      const stats = getStorageStats()
      expect(Object.keys(stats.byCategory).length).toBeGreaterThan(0)
    })
  })
})
