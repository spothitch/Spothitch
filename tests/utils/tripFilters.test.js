import { describe, it, expect } from 'vitest'

import { applyTripFilter, countByFilter } from '../../src/utils/tripFilters.js'

const SPOTS = [
  { id: 1, spotType: 'Station service', globalRating: 5, avgWaitTime: 10, userValidations: 3, description: 'Great station spot' },
  { id: 2, spotType: 'Sortie de ville', globalRating: 3, avgWaitTime: 25, userValidations: 0, description: 'Exit near shelter / abri' },
  { id: 3, spotType: 'Bord de route', globalRating: 4.5, avgWaitTime: 15, userValidations: 1, description: 'Nice road spot', lastUsed: new Date().toISOString() },
  { id: 4, spotType: 'Autre', globalRating: 2, avgWaitTime: 45, userValidations: 0, description: 'Random spot', lastUsed: '2020-01-01' },
  { id: 5, spotType: 'Station essence', globalRating: 4, avgWaitTime: 20, verified: true, description: 'Covered parking with roof' },
]

describe('tripFilters', () => {
  describe('applyTripFilter', () => {
    it('returns all spots for "all" filter', () => {
      expect(applyTripFilter(SPOTS, 'all')).toEqual(SPOTS)
    })

    it('returns all spots for null filter', () => {
      expect(applyTripFilter(SPOTS, null)).toEqual(SPOTS)
    })

    it('returns all spots for undefined filter', () => {
      expect(applyTripFilter(SPOTS, undefined)).toEqual(SPOTS)
    })

    it('filters by station type', () => {
      const result = applyTripFilter(SPOTS, 'station')
      expect(result.length).toBe(2) // spots 1 (Station service), 5 (Station essence)
      result.forEach(s => {
        expect(
          s.spotType.toLowerCase().includes('station') ||
          s.description.toLowerCase().includes('station')
        ).toBe(true)
      })
    })

    it('filters by rating >= 4', () => {
      const result = applyTripFilter(SPOTS, 'rating4')
      expect(result.length).toBe(3) // spots 1(5), 3(4.5), 5(4)
      result.forEach(s => expect(s.globalRating).toBeGreaterThanOrEqual(4))
    })

    it('filters by wait time <= 20', () => {
      const result = applyTripFilter(SPOTS, 'wait20')
      expect(result.length).toBe(3) // spots 1(10), 3(15), 5(20)
      result.forEach(s => expect(s.avgWaitTime).toBeLessThanOrEqual(20))
    })

    it('filters verified spots', () => {
      const result = applyTripFilter(SPOTS, 'verified')
      expect(result.length).toBe(3) // spots 1(3 validations), 3(1 validation), 5(verified=true)
    })

    it('filters recent spots (used in last year)', () => {
      const result = applyTripFilter(SPOTS, 'recent')
      expect(result.length).toBe(1) // spot 3 (lastUsed = today)
    })

    it('filters shelter spots', () => {
      const result = applyTripFilter(SPOTS, 'shelter')
      expect(result.length).toBe(2) // spot 2 (abri), spot 5 (roof)
    })

    it('returns all spots for unknown filter', () => {
      expect(applyTripFilter(SPOTS, 'nonexistent')).toEqual(SPOTS)
    })

    it('handles empty spots array', () => {
      expect(applyTripFilter([], 'station')).toEqual([])
    })
  })

  describe('countByFilter', () => {
    it('returns counts for all filters', () => {
      const counts = countByFilter(SPOTS)
      expect(counts.all).toBe(5)
      expect(counts.station).toBe(2)
      expect(counts.rating4).toBe(3)
      expect(counts.wait20).toBe(3)
      expect(counts.verified).toBe(3)
      expect(counts.recent).toBe(1)
      expect(counts.shelter).toBe(2)
    })

    it('returns all zeros for empty array', () => {
      const counts = countByFilter([])
      Object.values(counts).forEach(v => expect(v).toBe(0))
    })
  })
})
