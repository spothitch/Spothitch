import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/utils/storage.js', () => {
  const store = {}
  return {
    Storage: {
      get: vi.fn((key) => store[key] || null),
      set: vi.fn((key, value) => { store[key] = value }),
      _store: store,
      _clear: () => { Object.keys(store).forEach(k => delete store[k]) },
    },
  }
})

vi.mock('../../src/utils/geo.js', () => ({
  haversineKm: vi.fn((lat1, lng1, lat2, lng2) => {
    // Simple distance approximation for tests
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }),
}))

import {
  recordLocation,
  getLocationHistory,
  wasNearLocation,
  isCurrentlyNear,
  checkProximity,
} from '../../src/services/proximityVerification.js'
import { Storage } from '../../src/utils/storage.js'

describe('proximityVerification', () => {
  beforeEach(() => {
    Storage._clear()
  })

  describe('recordLocation', () => {
    it('records a valid location', () => {
      recordLocation({ lat: 48.8566, lng: 2.3522 })
      const history = getLocationHistory()
      expect(history.length).toBe(1)
      expect(history[0].lat).toBe(48.8566)
      expect(history[0].lng).toBe(2.3522)
    })

    it('ignores null/undefined location', () => {
      recordLocation(null)
      recordLocation(undefined)
      recordLocation({})
      expect(getLocationHistory().length).toBe(0)
    })

    it('adds timestamp', () => {
      recordLocation({ lat: 48.85, lng: 2.35 })
      const entry = getLocationHistory()[0]
      expect(entry.t).toBeDefined()
      expect(entry.t).toBeGreaterThan(0)
    })

    it('deduplicates very close locations', () => {
      recordLocation({ lat: 48.8566, lng: 2.3522 })
      recordLocation({ lat: 48.8567, lng: 2.3523 }) // <100m, <5min
      expect(getLocationHistory().length).toBe(1)
    })

    it('records different locations', () => {
      recordLocation({ lat: 48.8566, lng: 2.3522 }) // Paris
      recordLocation({ lat: 45.764, lng: 4.8357 })  // Lyon
      expect(getLocationHistory().length).toBe(2)
    })
  })

  describe('getLocationHistory', () => {
    it('returns empty array when no history', () => {
      expect(getLocationHistory()).toEqual([])
    })
  })

  describe('wasNearLocation', () => {
    it('returns false when no history', () => {
      const result = wasNearLocation(48.85, 2.35)
      expect(result.nearby).toBe(false)
      expect(result.closestKm).toBeNull()
    })

    it('returns false for null coords', () => {
      expect(wasNearLocation(null, null).nearby).toBe(false)
    })

    it('returns true when within radius', () => {
      recordLocation({ lat: 48.856, lng: 2.352 })
      const result = wasNearLocation(48.857, 2.353) // ~100m
      expect(result.nearby).toBe(true)
      expect(result.closestKm).toBeLessThan(5)
    })

    it('returns false when too far', () => {
      recordLocation({ lat: 48.856, lng: 2.352 }) // Paris
      const result = wasNearLocation(45.764, 4.836) // Lyon
      expect(result.nearby).toBe(false)
    })

    it('respects custom radius', () => {
      recordLocation({ lat: 48.856, lng: 2.352 })
      const result = wasNearLocation(48.856, 2.352, 0.001) // tiny radius
      expect(result.nearby).toBe(true)
    })
  })

  describe('isCurrentlyNear', () => {
    it('returns false when no user location', () => {
      const result = isCurrentlyNear(48.85, 2.35, null)
      expect(result.nearby).toBe(false)
      expect(result.distanceKm).toBeNull()
    })

    it('returns true when within 5km', () => {
      const result = isCurrentlyNear(
        48.856, 2.352,
        { lat: 48.857, lng: 2.353 }
      )
      expect(result.nearby).toBe(true)
    })

    it('returns false when far away', () => {
      const result = isCurrentlyNear(
        48.856, 2.352,
        { lat: 45.764, lng: 4.836 }
      )
      expect(result.nearby).toBe(false)
      expect(result.distanceKm).toBeGreaterThan(5)
    })
  })

  describe('checkProximity', () => {
    it('allows when no coordinates on spot', () => {
      const result = checkProximity(null, null, null)
      expect(result.allowed).toBe(true)
      expect(result.reason).toBe('no_coordinates')
    })

    it('allows when no GPS available', () => {
      const result = checkProximity(48.85, 2.35, null)
      expect(result.allowed).toBe(true)
      expect(result.reason).toBe('no_gps')
    })

    it('allows when current position is near', () => {
      const result = checkProximity(
        48.856, 2.352,
        { lat: 48.857, lng: 2.353 }
      )
      expect(result.allowed).toBe(true)
      expect(result.reason).toBe('current')
    })

    it('allows when history shows nearby', () => {
      recordLocation({ lat: 48.856, lng: 2.352 })
      const result = checkProximity(48.857, 2.353, null)
      expect(result.allowed).toBe(true)
      expect(result.reason).toBe('history')
    })

    it('denies when too far', () => {
      const result = checkProximity(
        48.856, 2.352,
        { lat: 45.764, lng: 4.836 } // Lyon
      )
      expect(result.allowed).toBe(false)
      expect(result.reason).toBe('too_far')
    })
  })
})
