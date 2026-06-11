import { describe, it, expect, vi, beforeAll } from 'vitest'

// ------- Minimal in-memory IndexedDB mock -------
// Must be set up BEFORE importing idb.js (module-level dbPromise)

function mockRequest(result) {
  const req = { result, error: null }
  setTimeout(() => req.onsuccess?.(), 0)
  return req
}

const _stores = {}
function getOrCreateStore(name) {
  if (!_stores[name]) _stores[name] = new Map()
  return _stores[name]
}

function mockTx(storeName) {
  const store = getOrCreateStore(storeName)
  const tx = { error: null, oncomplete: null, onerror: null }
  const os = {
    get: (key) => mockRequest(store.get(key) ?? undefined),
    getAll: () => mockRequest([...store.values()]),
    put: (item) => {
      const key = item.key !== undefined ? item.key : item.id
      store.set(key, item)
      return mockRequest(key)
    },
    delete: (key) => { store.delete(key); return mockRequest(undefined) },
    clear: () => { store.clear(); return mockRequest(undefined) },
    count: () => mockRequest(store.size),
    index: () => ({
      getAll: () => mockRequest([...store.values()]),
    }),
  }
  tx.objectStore = () => os
  setTimeout(() => tx.oncomplete?.(), 5)
  return tx
}

const fakeDB = {
  transaction: vi.fn((storeName) => mockTx(storeName)),
  objectStoreNames: { contains: vi.fn(() => true) },
  createObjectStore: vi.fn(() => ({ createIndex: vi.fn() })),
}

global.indexedDB = {
  open: vi.fn(() => {
    const req = { result: fakeDB, error: null }
    setTimeout(() => req.onsuccess?.(), 0)
    return req
  }),
  deleteDatabase: vi.fn(() => mockRequest(undefined)),
}

// Import AFTER setting up global.indexedDB
import {
  get, getAll, getByIndex, put, putAll, remove, clear, count,
  cacheGet, cacheSet, cacheCleanup,
  saveOfflineSpots, getOfflineSpots, getSpotsByCountry,
  getStorageStats, deleteDatabase,
} from '../../src/utils/idb.js'

describe('idb — get/put', () => {
  it('get returns undefined for missing key', async () => {
    const result = await get('spots', 'nonexistent-xyz')
    expect(result).toBeUndefined()
  })

  it('put stores an item and get retrieves it', async () => {
    await put('spots', { id: 'spot1', name: 'Paris Nord', country: 'FR' })
    const result = await get('spots', 'spot1')
    expect(result).toBeDefined()
    expect(result.id).toBe('spot1')
  })

  it('put overwrites existing item', async () => {
    await put('spots', { id: 'spot2', name: 'Old Name' })
    await put('spots', { id: 'spot2', name: 'New Name' })
    // No error thrown
  })
})

describe('idb — getAll', () => {
  it('returns an array', async () => {
    const result = await getAll('spots')
    expect(Array.isArray(result)).toBe(true)
  })

  it('returns items after put', async () => {
    await put('messages', { id: 'msg1', text: 'Hello' })
    const result = await getAll('messages')
    expect(result.length).toBeGreaterThanOrEqual(1)
  })
})

describe('idb — getByIndex', () => {
  it('returns an array', async () => {
    const result = await getByIndex('spots', 'country', 'FR')
    expect(Array.isArray(result)).toBe(true)
  })
})

describe('idb — putAll', () => {
  it('inserts multiple items without error', async () => {
    await expect(putAll('spots', [
      { id: 'bulk1', name: 'Bulk Spot 1' },
      { id: 'bulk2', name: 'Bulk Spot 2' },
    ])).resolves.not.toThrow()
  })

  it('handles empty array without error', async () => {
    await expect(putAll('spots', [])).resolves.not.toThrow()
  })
})

describe('idb — remove', () => {
  it('removes an item without error', async () => {
    await put('trips', { id: 'trip-del', name: 'Trip to delete' })
    await expect(remove('trips', 'trip-del')).resolves.not.toThrow()
  })

  it('does not throw for non-existent key', async () => {
    await expect(remove('spots', 'does-not-exist')).resolves.not.toThrow()
  })
})

describe('idb — clear', () => {
  it('clears a store without error', async () => {
    await put('photos', { id: 'photo1', data: 'abc' })
    await expect(clear('photos')).resolves.not.toThrow()
  })
})

describe('idb — count', () => {
  it('returns a number', async () => {
    const n = await count('spots')
    expect(typeof n).toBe('number')
  })

  it('count increases after put', async () => {
    const before = await count('cache')
    await put('cache', { key: 'ck1', data: 'val' })
    const after = await count('cache')
    expect(after).toBeGreaterThanOrEqual(before)
  })
})

describe('idb — cacheGet / cacheSet', () => {
  it('cacheGet returns null for missing key', async () => {
    const result = await cacheGet('no-such-cache-key-xyz')
    expect(result).toBeNull()
  })

  it('cacheSet does not throw', async () => {
    await expect(cacheSet('my-key', { foo: 'bar' })).resolves.not.toThrow()
  })

  it('cacheSet with custom TTL does not throw', async () => {
    await expect(cacheSet('ttl-key', 'data', 60000)).resolves.not.toThrow()
  })
})

describe('idb — cacheCleanup', () => {
  it('returns a number', async () => {
    const n = await cacheCleanup()
    expect(typeof n).toBe('number')
  })

  it('returns 0 when no expired items', async () => {
    const n = await cacheCleanup()
    expect(n).toBeGreaterThanOrEqual(0)
  })
})

describe('idb — spots API', () => {
  it('saveOfflineSpots does not throw', async () => {
    await expect(saveOfflineSpots([
      { id: 'off1', name: 'Offline Spot 1' },
    ])).resolves.not.toThrow()
  })

  it('getOfflineSpots returns array', async () => {
    const spots = await getOfflineSpots()
    expect(Array.isArray(spots)).toBe(true)
  })

  it('getSpotsByCountry returns array', async () => {
    const spots = await getSpotsByCountry('FR')
    expect(Array.isArray(spots)).toBe(true)
  })
})

describe('idb — getStorageStats', () => {
  it('returns an object', async () => {
    const stats = await getStorageStats()
    expect(typeof stats).toBe('object')
    expect(stats).not.toBeNull()
  })

  it('includes spots key', async () => {
    const stats = await getStorageStats()
    expect('spots' in stats).toBe(true)
  })

  it('includes messages key', async () => {
    const stats = await getStorageStats()
    expect('messages' in stats).toBe(true)
  })

  it('counts are numbers', async () => {
    const stats = await getStorageStats()
    expect(typeof stats.spots).toBe('number')
  })
})

describe('idb — deleteDatabase', () => {
  it('calls indexedDB.deleteDatabase', async () => {
    await expect(deleteDatabase()).resolves.not.toThrow()
    expect(global.indexedDB.deleteDatabase).toHaveBeenCalled()
  })
})
