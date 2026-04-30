import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/utils/idb.js', () => ({
  cacheGet: vi.fn(() => null),
  cacheSet: vi.fn(),
}))

import { clearOverpassCache } from '../../src/services/overpass.js'

describe('overpass', () => {
  describe('clearOverpassCache', () => {
    it('is a function', () => {
      expect(typeof clearOverpassCache).toBe('function')
    })
    it('does not throw', () => {
      expect(() => clearOverpassCache()).not.toThrow()
    })
  })
})
