import { describe, it, expect, beforeEach, vi } from 'vitest'

import {
  isFeatureSeen,
  markFeatureSeen,
  getSeenCount,
} from '../../src/services/featureIntro.js'

const STORAGE_KEY = 'spothitch_feature_seen'

describe('featureIntro', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('isFeatureSeen', () => {
    it('returns false when localStorage is empty', () => {
      expect(isFeatureSeen('onboarding')).toBe(false)
    })

    it('returns false for an unseen feature ID', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 'other-feature': Date.now() }))
      expect(isFeatureSeen('unseen-feature')).toBe(false)
    })

    it('returns true for a feature that has been marked seen', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 'guardian': Date.now() }))
      expect(isFeatureSeen('guardian')).toBe(true)
    })

    it('returns false when localStorage contains invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'not-json{{')
      expect(isFeatureSeen('anything')).toBe(false)
    })

    it('is case-sensitive for feature IDs', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 'sos': Date.now() }))
      expect(isFeatureSeen('SOS')).toBe(false)
      expect(isFeatureSeen('sos')).toBe(true)
    })
  })

  describe('markFeatureSeen', () => {
    it('persists the feature as seen in localStorage', () => {
      markFeatureSeen('radar')
      expect(isFeatureSeen('radar')).toBe(true)
    })

    it('stores a numeric timestamp', () => {
      const before = Date.now()
      markFeatureSeen('onboarding')
      const after = Date.now()
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
      expect(typeof stored['onboarding']).toBe('number')
      expect(stored['onboarding']).toBeGreaterThanOrEqual(before)
      expect(stored['onboarding']).toBeLessThanOrEqual(after)
    })

    it('does not overwrite other existing seen features', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 'existing': 12345 }))
      markFeatureSeen('new-feature')
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
      expect(stored['existing']).toBe(12345)
      expect(stored['new-feature']).toBeDefined()
    })

    it('marking same feature twice updates the timestamp', () => {
      markFeatureSeen('sos')
      const firstTs = JSON.parse(localStorage.getItem(STORAGE_KEY))['sos']
      markFeatureSeen('sos')
      const secondTs = JSON.parse(localStorage.getItem(STORAGE_KEY))['sos']
      expect(secondTs).toBeGreaterThanOrEqual(firstTs)
    })

    it('does not throw when localStorage contains invalid JSON', () => {
      localStorage.setItem(STORAGE_KEY, 'corrupted')
      expect(() => markFeatureSeen('recovery')).not.toThrow()
    })
  })

  describe('getSeenCount', () => {
    it('returns 0 when nothing has been seen', () => {
      expect(getSeenCount()).toBe(0)
    })

    it('returns correct count after marking features', () => {
      markFeatureSeen('f1')
      markFeatureSeen('f2')
      markFeatureSeen('f3')
      expect(getSeenCount()).toBe(3)
    })

    it('does not double-count same feature', () => {
      markFeatureSeen('dup')
      markFeatureSeen('dup')
      expect(getSeenCount()).toBe(1)
    })

    it('returns 0 when localStorage is corrupted', () => {
      localStorage.setItem(STORAGE_KEY, 'bad-json')
      expect(getSeenCount()).toBe(0)
    })

    it('counts features accurately from pre-existing data', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        'feature-a': 111,
        'feature-b': 222,
      }))
      expect(getSeenCount()).toBe(2)
    })
  })

  describe('integration: mark then check', () => {
    it('full flow: unseen → mark → seen → count', () => {
      expect(isFeatureSeen('flow-test')).toBe(false)
      expect(getSeenCount()).toBe(0)
      markFeatureSeen('flow-test')
      expect(isFeatureSeen('flow-test')).toBe(true)
      expect(getSeenCount()).toBe(1)
    })

    it('multiple features tracked independently', () => {
      markFeatureSeen('alpha')
      markFeatureSeen('beta')
      expect(isFeatureSeen('alpha')).toBe(true)
      expect(isFeatureSeen('beta')).toBe(true)
      expect(isFeatureSeen('gamma')).toBe(false)
      expect(getSeenCount()).toBe(2)
    })
  })
})
