import { describe, it, expect, beforeEach, vi } from 'vitest'

import {
  canRequest,
  recordRequest,
  withRateLimit,
  getWaitTime,
  getRateLimitStats,
  resetRateLimit,
  resetAllRateLimits,
} from '../../src/utils/clientRateLimit.js'

describe('clientRateLimit', () => {
  beforeEach(() => {
    resetAllRateLimits()
  })

  describe('canRequest', () => {
    it('allows first request', () => {
      expect(canRequest('test', { max: 3, windowMs: 1000 })).toBe(true)
    })

    it('allows requests up to limit', () => {
      const limit = { max: 3, windowMs: 60000 }
      recordRequest('test', limit)
      recordRequest('test', limit)
      expect(canRequest('test', limit)).toBe(true)
    })

    it('blocks after limit reached', () => {
      const limit = { max: 2, windowMs: 60000 }
      recordRequest('test', limit)
      recordRequest('test', limit)
      expect(canRequest('test', limit)).toBe(false)
    })

    it('uses default limits for known keys', () => {
      // nominatim has max: 1
      expect(canRequest('nominatim')).toBe(true)
      recordRequest('nominatim')
      expect(canRequest('nominatim')).toBe(false)
    })

    it('uses general default for unknown keys', () => {
      expect(canRequest('unknown_service')).toBe(true)
    })
  })

  describe('recordRequest', () => {
    it('returns true when under limit', () => {
      expect(recordRequest('test', { max: 3, windowMs: 60000 })).toBe(true)
    })

    it('returns false when at limit', () => {
      const limit = { max: 1, windowMs: 60000 }
      recordRequest('test', limit)
      expect(recordRequest('test', limit)).toBe(false)
    })

    it('consumes a slot', () => {
      const limit = { max: 2, windowMs: 60000 }
      recordRequest('test', limit) // 1/2
      expect(canRequest('test', limit)).toBe(true) // 1/2, can do 1 more
      recordRequest('test', limit) // 2/2
      expect(canRequest('test', limit)).toBe(false) // full
    })
  })

  describe('withRateLimit', () => {
    it('calls the function when under limit', async () => {
      const fn = vi.fn().mockResolvedValue('result')
      const limited = withRateLimit('test', fn, { max: 5, windowMs: 60000 })
      const result = await limited('arg1')
      expect(fn).toHaveBeenCalledWith('arg1')
      expect(result).toBe('result')
    })

    it('returns null when rate limited', async () => {
      const fn = vi.fn().mockResolvedValue('result')
      const limit = { max: 1, windowMs: 60000 }
      const limited = withRateLimit('test', fn, limit)
      await limited() // consumes 1
      const result = await limited() // blocked
      expect(result).toBeNull()
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('passes all arguments to wrapped function', async () => {
      const fn = vi.fn().mockResolvedValue(42)
      const limited = withRateLimit('test', fn, { max: 5, windowMs: 60000 })
      await limited('a', 'b', 'c')
      expect(fn).toHaveBeenCalledWith('a', 'b', 'c')
    })
  })

  describe('getWaitTime', () => {
    it('returns 0 for unknown key', () => {
      expect(getWaitTime('unknown')).toBe(0)
    })

    it('returns 0 when under limit', () => {
      const limit = { max: 5, windowMs: 60000 }
      recordRequest('test', limit)
      expect(getWaitTime('test', limit)).toBe(0)
    })

    it('returns positive ms when at limit', () => {
      const limit = { max: 1, windowMs: 60000 }
      recordRequest('test', limit)
      const wait = getWaitTime('test', limit)
      expect(wait).toBeGreaterThan(0)
      expect(wait).toBeLessThanOrEqual(60000)
    })
  })

  describe('getRateLimitStats', () => {
    it('returns empty stats initially', () => {
      const stats = getRateLimitStats()
      expect(Object.keys(stats).length).toBe(0)
    })

    it('tracks usage after requests', () => {
      const limit = { max: 5, windowMs: 60000 }
      recordRequest('test', limit)
      recordRequest('test', limit)
      const stats = getRateLimitStats()
      expect(stats.test).toBeDefined()
      expect(stats.test.used).toBe(2)
      // Stats uses DEFAULT_LIMITS for the key, not the custom limit
      expect(stats.test.max).toBeGreaterThan(0)
    })
  })

  describe('resetRateLimit', () => {
    it('clears a specific key', () => {
      const limit = { max: 1, windowMs: 60000 }
      recordRequest('test', limit)
      expect(canRequest('test', limit)).toBe(false)
      resetRateLimit('test')
      expect(canRequest('test', limit)).toBe(true)
    })

    it('does not affect other keys', () => {
      const limit = { max: 1, windowMs: 60000 }
      recordRequest('a', limit)
      recordRequest('b', limit)
      resetRateLimit('a')
      expect(canRequest('a', limit)).toBe(true)
      expect(canRequest('b', limit)).toBe(false)
    })
  })

  describe('resetAllRateLimits', () => {
    it('clears all keys', () => {
      const limit = { max: 1, windowMs: 60000 }
      recordRequest('a', limit)
      recordRequest('b', limit)
      resetAllRateLimits()
      expect(canRequest('a', limit)).toBe(true)
      expect(canRequest('b', limit)).toBe(true)
    })
  })
})
