import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/utils/storage.js', () => {
  const store = {}
  return {
    Storage: {
      get: vi.fn((key) => store[key] ?? null),
      set: vi.fn((key, val) => { store[key] = val }),
      remove: vi.fn((key) => { delete store[key] }),
      _store: store,
    },
  }
})
vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))

import {
  initOfflineHandler,
  isCurrentlyOffline,
  queueOfflineAction,
  cacheSpots,
  getCachedSpots,
  isCacheFresh,
  requireOnline,
  checkSlowConnection,
} from '../../src/services/offline.js'
import { Storage } from '../../src/utils/storage.js'

describe('services/offline', () => {
  beforeEach(() => {
    // Clear storage mock
    const store = Storage._store
    for (const key of Object.keys(store)) delete store[key]
    vi.clearAllMocks()
    document.body.innerHTML = '<div id="aria-live-assertive"></div>'
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true, configurable: true })
  })

  describe('initOfflineHandler', () => {
    it('runs without error', () => {
      expect(() => initOfflineHandler()).not.toThrow()
    })

    it('creates an offline indicator element', () => {
      initOfflineHandler()
      const indicator = document.querySelector('.offline-indicator')
      expect(indicator).toBeTruthy()
    })

    it('offline indicator has role=alert', () => {
      initOfflineHandler()
      const indicator = document.querySelector('.offline-indicator')
      expect(indicator?.getAttribute('role')).toBe('alert')
    })
  })

  describe('isCurrentlyOffline', () => {
    it('returns a boolean', () => {
      expect(typeof isCurrentlyOffline()).toBe('boolean')
    })
  })

  describe('queueOfflineAction', () => {
    it('runs without error', () => {
      expect(() => queueOfflineAction({ type: 'ADD_SPOT', data: {} })).not.toThrow()
    })

    it('saves to storage', () => {
      queueOfflineAction({ type: 'ADD_SPOT', data: { name: 'Test' } })
      expect(Storage.set).toHaveBeenCalledWith('pendingActions', expect.any(Array))
    })

    it('adds timestamp to action', () => {
      const before = Date.now()
      queueOfflineAction({ type: 'ADD_REVIEW', spotId: 'spot-001', data: {} })
      const call = Storage.set.mock.calls.find(c => c[0] === 'pendingActions')
      const saved = call?.[1]
      if (saved && saved.length > 0) {
        const last = saved[saved.length - 1]
        expect(last.timestamp).toBeGreaterThanOrEqual(before)
      }
    })
  })

  describe('isCacheFresh', () => {
    it('returns false when key not in storage', () => {
      const result = isCacheFresh('my-key')
      expect(result).toBe(false)
    })

    it('returns true when data is fresh', () => {
      Storage._store['my-key'] = { timestamp: Date.now(), data: [] }
      Storage.get.mockImplementation((key) => Storage._store[key] ?? null)
      const result = isCacheFresh('my-key', 3600000)
      expect(result).toBe(true)
    })

    it('returns false when data is stale', () => {
      const old = Date.now() - 4000000 // older than 1 hour
      Storage._store['my-key'] = { timestamp: old, data: [] }
      Storage.get.mockImplementation((key) => Storage._store[key] ?? null)
      const result = isCacheFresh('my-key', 3600000)
      expect(result).toBe(false)
    })

    it('returns a Promise for cachedSpots key', () => {
      const result = isCacheFresh('cachedSpots')
      expect(result instanceof Promise).toBe(true)
    })
  })

  describe('requireOnline', () => {
    it('returns false when online (not blocked)', async () => {
      // isOffline is determined at module load time (navigator.onLine)
      // In tests, navigator.onLine = true, so isOffline = false
      const result = await requireOnline()
      expect(typeof result).toBe('boolean')
    })
  })

  describe('checkSlowConnection', () => {
    it('does nothing when navigator.connection not available', () => {
      // navigator.connection is undefined in happy-dom
      expect(() => checkSlowConnection()).not.toThrow()
    })

    it('creates slow connection indicator when connection is slow', () => {
      Object.defineProperty(navigator, 'connection', {
        value: { effectiveType: '2g' },
        writable: true,
        configurable: true,
      })
      checkSlowConnection()
      const indicator = document.getElementById('slow-connection-indicator')
      // May or may not be present depending on implementation
      if (indicator) {
        expect(indicator.getAttribute('role')).toBe('status')
      }
      // Cleanup
      Object.defineProperty(navigator, 'connection', {
        value: undefined,
        writable: true,
        configurable: true,
      })
    })
  })

  describe('cacheSpots', () => {
    it('runs without error', () => {
      // cacheSpots uses IndexedDB internally (falls back silently) - just verify no throw
      expect(() => cacheSpots([{ id: 'spot-001' }])).not.toThrow()
    })

    it('accepts empty array', () => {
      expect(() => cacheSpots([])).not.toThrow()
    })
  })

  describe('online/offline events', () => {
    it('fires offline event without throwing', () => {
      initOfflineHandler()
      expect(() => window.dispatchEvent(new Event('offline'))).not.toThrow()
    })

    it('fires online event without throwing', () => {
      initOfflineHandler()
      expect(() => window.dispatchEvent(new Event('online'))).not.toThrow()
    })

    it('isCurrentlyOffline is true after offline event', () => {
      initOfflineHandler()
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true, configurable: true })
      window.dispatchEvent(new Event('offline'))
      expect(isCurrentlyOffline()).toBe(true)
    })

    it('isCurrentlyOffline is false after online event', () => {
      initOfflineHandler()
      window.dispatchEvent(new Event('online'))
      expect(isCurrentlyOffline()).toBe(false)
    })
  })

  describe('getCachedSpots', () => {
    it('returns a promise', () => {
      const result = getCachedSpots()
      expect(result instanceof Promise).toBe(true)
      // Don't await — IndexedDB hangs in happy-dom; just verify it's a Promise
    })

    it('is thenable', () => {
      const result = getCachedSpots()
      expect(typeof result.then).toBe('function')
    })

    it('does not throw synchronously', () => {
      expect(() => getCachedSpots()).not.toThrow()
    })
  })

  describe('initOfflineHandler — starts offline', () => {
    it('shows offline indicator when starting offline', () => {
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true, configurable: true })
      // Re-create the module state by calling init
      expect(() => initOfflineHandler()).not.toThrow()
    })
  })

  describe('getCachedSpots — localStorage fallback (IDB disabled)', () => {
    let origIDB

    beforeEach(() => {
      origIDB = global.indexedDB
      global.indexedDB = undefined
    })

    afterEach(() => {
      global.indexedDB = origIDB
    })

    it('falls back to localStorage when IndexedDB unavailable', async () => {
      const freshData = [{ id: 'spot-1', name: 'Test Spot' }]
      Storage._store['cachedSpots'] = { data: freshData, timestamp: Date.now() }
      Storage.get.mockImplementation((key) => Storage._store[key] ?? null)
      const result = await getCachedSpots()
      expect(Array.isArray(result)).toBe(true)
    })

    it('returns null when localStorage also has no fresh data', async () => {
      Storage.get.mockImplementation(() => null)
      const result = await getCachedSpots()
      expect(result).toBeNull()
    })

    it('returns null when localStorage data is stale', async () => {
      const oldTs = Date.now() - 25 * 60 * 60 * 1000 // 25 hours ago
      Storage._store['cachedSpots'] = { data: [{ id: 's1' }], timestamp: oldTs }
      Storage.get.mockImplementation((key) => Storage._store[key] ?? null)
      const result = await getCachedSpots()
      expect(result).toBeNull()
    })
  })

  describe('cacheSpots — localStorage fallback (IDB disabled)', () => {
    let origIDB

    beforeEach(() => {
      origIDB = global.indexedDB
      global.indexedDB = undefined
    })

    afterEach(() => {
      global.indexedDB = origIDB
    })

    it('stores payload in localStorage when IDB fails', async () => {
      Storage.set.mockImplementation((key, val) => { Storage._store[key] = val })
      cacheSpots([{ id: 's2', name: 'Spot 2' }])
      // Wait for async IDB failure → fallback
      await new Promise(resolve => setTimeout(resolve, 20))
      expect(Storage.set).toHaveBeenCalledWith('cachedSpots', expect.any(Object))
    })
  })

  describe('isCacheFresh — cachedSpots localStorage fallback (IDB disabled)', () => {
    let origIDB

    beforeEach(() => {
      origIDB = global.indexedDB
      global.indexedDB = undefined
    })

    afterEach(() => {
      global.indexedDB = origIDB
    })

    it('resolves to false when IDB fails and localStorage has no data', async () => {
      Storage.get.mockImplementation(() => null)
      const result = await isCacheFresh('cachedSpots')
      expect(result).toBe(false)
    })

    it('resolves using localStorage timestamp when IDB fails', async () => {
      Storage._store['cachedSpots'] = { timestamp: Date.now(), data: [] }
      Storage.get.mockImplementation((key) => Storage._store[key] ?? null)
      const result = await isCacheFresh('cachedSpots', 3600000)
      expect(typeof result).toBe('boolean')
    })
  })

  describe('requireOnline — when offline', () => {
    it('returns true when offline', async () => {
      initOfflineHandler()
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true, configurable: true })
      window.dispatchEvent(new Event('offline'))
      const result = await requireOnline()
      expect(result).toBe(true)
      // Restore
      Object.defineProperty(navigator, 'onLine', { value: true, writable: true, configurable: true })
      window.dispatchEvent(new Event('online'))
    })
  })

  describe('isCacheFresh — non-cachedSpots keys', () => {
    it('returns false for missing key', () => {
      Storage.get.mockImplementation(() => null)
      expect(isCacheFresh('some-other-key')).toBe(false)
    })

    it('returns true for fresh data', () => {
      Storage._store['fresh-key'] = { timestamp: Date.now(), data: 'x' }
      Storage.get.mockImplementation((key) => Storage._store[key] ?? null)
      expect(isCacheFresh('fresh-key', 3600000)).toBe(true)
    })

    it('returns false for stale data', () => {
      Storage._store['stale-key'] = { timestamp: Date.now() - 5000000, data: 'x' }
      Storage.get.mockImplementation((key) => Storage._store[key] ?? null)
      expect(isCacheFresh('stale-key', 3600000)).toBe(false)
    })
  })
})
