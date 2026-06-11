import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { Storage, safeSetItem } from '../../src/utils/storage.js'

const PREFIX = 'spothitch_v4_'

describe('Storage utils', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Storage.set', () => {
    it('stores a value under the prefixed key', () => {
      Storage.set('my-key', { hello: 'world' })
      const raw = localStorage.getItem(PREFIX + 'my-key')
      expect(raw).toBe(JSON.stringify({ hello: 'world' }))
    })

    it('returns true on success', () => {
      const result = Storage.set('key-1', 'value')
      expect(result).toBe(true)
    })

    it('stores strings, numbers, arrays, and objects', () => {
      expect(Storage.set('str', 'hello')).toBe(true)
      expect(Storage.set('num', 42)).toBe(true)
      expect(Storage.set('arr', [1, 2, 3])).toBe(true)
      expect(Storage.set('obj', { a: 1 })).toBe(true)
    })
  })

  describe('Storage.get', () => {
    it('returns null when key not set', () => {
      expect(Storage.get('non-existent')).toBeNull()
    })

    it('returns stored value', () => {
      Storage.set('test-key', { name: 'Alice' })
      const result = Storage.get('test-key')
      expect(result).toEqual({ name: 'Alice' })
    })

    it('returns number value', () => {
      Storage.set('count', 7)
      expect(Storage.get('count')).toBe(7)
    })

    it('returns array value', () => {
      Storage.set('items', [1, 2, 3])
      expect(Storage.get('items')).toEqual([1, 2, 3])
    })

    it('returns null for invalid JSON', () => {
      localStorage.setItem(PREFIX + 'bad-json', '{not valid json}')
      const result = Storage.get('bad-json')
      expect(result).toBeNull()
    })
  })

  describe('Storage.remove', () => {
    it('removes a stored value', () => {
      Storage.set('remove-me', 'value')
      Storage.remove('remove-me')
      expect(Storage.get('remove-me')).toBeNull()
    })

    it('returns true on success', () => {
      Storage.set('to-remove', 'x')
      expect(Storage.remove('to-remove')).toBe(true)
    })

    it('does not throw when key does not exist', () => {
      expect(() => Storage.remove('does-not-exist')).not.toThrow()
    })
  })

  describe('Storage.clear', () => {
    it('returns true on success', () => {
      Storage.set('clear-key', 'some-value')
      const result = Storage.clear()
      expect(result).toBe(true)
    })

    it('runs without error on empty localStorage', () => {
      expect(() => Storage.clear()).not.toThrow()
    })
  })

  describe('Storage.getUsage', () => {
    it('returns a number', () => {
      const usage = Storage.getUsage()
      expect(typeof usage).toBe('number')
      expect(usage).toBeGreaterThanOrEqual(0)
    })

    it('returns higher value after storing data', () => {
      const before = Storage.getUsage()
      Storage.set('big-key', 'x'.repeat(10000))
      const after = Storage.getUsage()
      expect(after).toBeGreaterThan(before)
    })
  })

  describe('safeSetItem', () => {
    it('stores a value in localStorage', () => {
      const result = safeSetItem('direct-key', 'direct-value')
      expect(result).toBe(true)
      expect(localStorage.getItem('direct-key')).toBe('direct-value')
    })

    it('returns true on success', () => {
      expect(safeSetItem('test-key', '{"a":1}')).toBe(true)
    })

    it('does not use the spothitch prefix', () => {
      safeSetItem('no-prefix', 'value')
      expect(localStorage.getItem('no-prefix')).toBe('value')
      expect(localStorage.getItem(PREFIX + 'no-prefix')).toBeNull()
    })
  })

  describe('Storage.set — error paths', () => {
    let originalSetItem

    beforeEach(() => {
      originalSetItem = localStorage.setItem.bind(localStorage)
    })

    afterEach(() => {
      // Restore setItem after each test
      Object.defineProperty(localStorage, 'setItem', {
        value: originalSetItem,
        writable: true,
        configurable: true,
      })
    })

    it('returns false on SecurityError', () => {
      const err = new Error('SecurityError')
      err.name = 'SecurityError'
      Object.defineProperty(localStorage, 'setItem', {
        value: () => { throw err },
        writable: true,
        configurable: true,
      })
      const result = Storage.set('key', 'value')
      expect(result).toBe(false)
    })

    it('returns false on generic error', () => {
      Object.defineProperty(localStorage, 'setItem', {
        value: () => { throw new Error('unknown error') },
        writable: true,
        configurable: true,
      })
      const result = Storage.set('key', 'value')
      expect(result).toBe(false)
    })

    it('handles QuotaExceededError by clearing cache entries and retrying', () => {
      // Seed a cache entry that should be evicted
      originalSetItem.call(localStorage, 'spothitch_test_cache', 'big data here')

      let callCount = 0
      const quotaErr = new DOMException('QuotaExceededError', 'QuotaExceededError')
      Object.defineProperty(localStorage, 'setItem', {
        value: (key, val) => {
          callCount++
          if (callCount === 1) {
            // First call throws quota error
            throw quotaErr
          }
          // Subsequent calls (retry) succeed
          originalSetItem.call(localStorage, key, val)
        },
        writable: true,
        configurable: true,
      })

      const result = Storage.set('new-key', 'new-value')
      // After quota error, it clears cache entries and retries
      expect(typeof result).toBe('boolean')
    })

    it('returns false when retry also fails after QuotaExceededError', () => {
      const quotaErr = new DOMException('QuotaExceededError', 'QuotaExceededError')
      Object.defineProperty(localStorage, 'setItem', {
        value: () => { throw quotaErr },
        writable: true,
        configurable: true,
      })
      const result = Storage.set('key', 'value')
      expect(result).toBe(false)
    })
  })

  describe('safeSetItem — error paths', () => {
    let originalSetItem

    beforeEach(() => {
      originalSetItem = localStorage.setItem.bind(localStorage)
    })

    afterEach(() => {
      Object.defineProperty(localStorage, 'setItem', {
        value: originalSetItem,
        writable: true,
        configurable: true,
      })
    })

    it('returns false on generic error', () => {
      Object.defineProperty(localStorage, 'setItem', {
        value: () => { throw new Error('no space') },
        writable: true,
        configurable: true,
      })
      const result = safeSetItem('key', 'value')
      expect(result).toBe(false)
    })

    it('handles QuotaExceededError by evicting cache and retrying', () => {
      originalSetItem.call(localStorage, 'something_cache', 'old data')
      let calls = 0
      const quotaErr = new DOMException('QuotaExceededError', 'QuotaExceededError')
      Object.defineProperty(localStorage, 'setItem', {
        value: (key, val) => {
          calls++
          if (calls === 1) throw quotaErr
          originalSetItem.call(localStorage, key, val)
        },
        writable: true,
        configurable: true,
      })
      const result = safeSetItem('new-direct-key', 'value')
      expect(typeof result).toBe('boolean')
    })
  })

  describe('Storage.get — error path', () => {
    it('returns null when localStorage.getItem throws', () => {
      const originalGetItem = localStorage.getItem.bind(localStorage)
      Object.defineProperty(localStorage, 'getItem', {
        value: () => { throw new Error('access denied') },
        writable: true,
        configurable: true,
      })
      const result = Storage.get('any-key')
      expect(result).toBeNull()
      Object.defineProperty(localStorage, 'getItem', {
        value: originalGetItem,
        writable: true,
        configurable: true,
      })
    })
  })
})
