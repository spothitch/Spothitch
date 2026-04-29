import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({
    checkinHistory: [],
    spots: [],
  })),
}))

vi.mock('../../src/utils/storage.js', () => ({
  Storage: {
    get: vi.fn(() => null),
    set: vi.fn(),
  },
}))

import {
  getDistanceComparison,
  formatWaitDuration,
  formatDistanceKm,
  getCountryFlag,
  calculateTravelStats,
} from '../../src/services/statsCalculator.js'
import { getState } from '../../src/stores/state.js'

describe('statsCalculator', () => {
  beforeEach(() => {
    localStorage.clear()
    getState.mockReturnValue({
      checkinHistory: [],
      spots: [],
    })
  })

  describe('getDistanceComparison', () => {
    it('returns encouragement for < 50 km', () => {
      const result = getDistanceComparison(30)
      expect(result.iconName).toBe('footprints')
      expect(result.text).toContain('Continue')
    })

    it('returns null/encouragement for 0', () => {
      const result = getDistanceComparison(0)
      expect(result.text).toContain('Continue')
    })

    it('returns footprints for 100 km', () => {
      const result = getDistanceComparison(100)
      expect(result.km).toBe(100)
      expect(result.iconName).toBe('footprints')
    })

    it('returns Paris-Lyon for 300 km', () => {
      const result = getDistanceComparison(350)
      expect(result.km).toBe(300)
      expect(result.text).toContain('TGV')
    })

    it('returns highest matching for 5000 km', () => {
      const result = getDistanceComparison(5000)
      expect(result.km).toBe(4000)
    })

    it('returns globe for 40000+ km', () => {
      const result = getDistanceComparison(42000)
      expect(result.km).toBe(40000)
      expect(result.text).toContain('Terre')
    })
  })

  describe('formatWaitDuration', () => {
    it('returns "0 min" for 0', () => {
      expect(formatWaitDuration(0)).toBe('0 min')
    })

    it('returns "0 min" for null', () => {
      expect(formatWaitDuration(null)).toBe('0 min')
    })

    it('returns minutes only when < 60', () => {
      expect(formatWaitDuration(45)).toBe('45 min')
    })

    it('returns hours only when exact', () => {
      expect(formatWaitDuration(120)).toBe('2h')
    })

    it('returns hours and minutes when mixed', () => {
      expect(formatWaitDuration(90)).toBe('1h 30min')
    })

    it('handles large values', () => {
      expect(formatWaitDuration(300)).toBe('5h')
    })
  })

  describe('formatDistanceKm', () => {
    it('returns "0 km" for 0', () => {
      expect(formatDistanceKm(0)).toBe('0 km')
    })

    it('returns "0 km" for null', () => {
      expect(formatDistanceKm(null)).toBe('0 km')
    })

    it('returns meters for < 1 km', () => {
      expect(formatDistanceKm(0.5)).toBe('500 m')
    })

    it('returns rounded km for normal distances', () => {
      expect(formatDistanceKm(42.7)).toBe('43 km')
    })

    it('returns k km for >= 1000', () => {
      expect(formatDistanceKm(2500)).toBe('2.5k km')
    })
  })

  describe('getCountryFlag', () => {
    it('returns flag for valid 2-letter code', () => {
      const flag = getCountryFlag('FR')
      expect(flag).toBeTruthy()
      expect(flag.length).toBeGreaterThan(0)
    })

    it('returns empty string for invalid code', () => {
      expect(getCountryFlag('')).toBe('')
      expect(getCountryFlag(null)).toBe('')
      expect(getCountryFlag('ABC')).toBe('')
    })

    it('handles lowercase codes', () => {
      const flag = getCountryFlag('de')
      expect(flag).toBeTruthy()
    })

    it('returns different flags for different countries', () => {
      const fr = getCountryFlag('FR')
      const de = getCountryFlag('DE')
      expect(fr).not.toBe(de)
    })
  })

  describe('calculateTravelStats', () => {
    it('returns default stats when no history', () => {
      getState.mockReturnValue({
        checkinHistory: [],
        spots: [],
      })
      const stats = calculateTravelStats(true)
      expect(stats.totalRides).toBe(0)
      expect(stats.countriesCount).toBe(0)
      expect(stats.totalDistanceKm).toBe(0)
    })

    it('counts rides from checkin history', () => {
      getState.mockReturnValue({
        checkinHistory: [
          { spotId: 1, timestamp: Date.now() },
          { spotId: 2, timestamp: Date.now() },
        ],
        spots: [],
      })
      const stats = calculateTravelStats(true)
      expect(stats.totalRides).toBe(2)
    })

    it('counts countries visited', () => {
      getState.mockReturnValue({
        checkinHistory: [
          { spotId: 1, timestamp: Date.now(), spot: { id: 1, country: 'FR' } },
          { spotId: 2, timestamp: Date.now(), spot: { id: 2, country: 'DE' } },
          { spotId: 3, timestamp: Date.now(), spot: { id: 3, country: 'FR' } },
        ],
        spots: [],
      })
      const stats = calculateTravelStats(true)
      expect(stats.countriesCount).toBe(2)
      expect(stats.countries).toContain('FR')
      expect(stats.countries).toContain('DE')
    })

    it('calculates total distance from checkins', () => {
      getState.mockReturnValue({
        checkinHistory: [
          { spotId: 1, distance: 50000, timestamp: Date.now(), spot: { id: 1, country: 'FR' } },
          { spotId: 2, distance: 100000, timestamp: Date.now(), spot: { id: 2, country: 'FR' } },
        ],
        spots: [],
      })
      const stats = calculateTravelStats(true)
      expect(stats.totalDistanceKm).toBe(150) // 150000/1000 = 150km
    })

    it('calculates average wait time', () => {
      getState.mockReturnValue({
        checkinHistory: [
          { spotId: 1, waitTime: 0, timestamp: Date.now() }, // 3 min
          { spotId: 2, waitTime: 1, timestamp: Date.now() }, // 10 min
          { spotId: 3, waitTime: 2, timestamp: Date.now() }, // 22 min
        ],
        spots: [],
      })
      const stats = calculateTravelStats(true)
      expect(stats.totalWaitTimeMinutes).toBe(35) // 3+10+22
      expect(stats.avgWaitTimeMinutes).toBe(12) // round(35/3)
    })

    it('tracks checkins by month', () => {
      const now = new Date()
      const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      getState.mockReturnValue({
        checkinHistory: [
          { spotId: 1, timestamp: now.getTime(), distance: 5000 },
          { spotId: 2, timestamp: now.getTime(), distance: 10000 },
        ],
        spots: [],
      })
      const stats = calculateTravelStats(true)
      expect(stats.bestMonth).toBeTruthy()
    })

    it('uses state-level stats when no history', () => {
      getState.mockReturnValue({
        checkinHistory: [],
        spots: [],
        totalDistance: 100000,
        totalWaitTime: 60,
        checkins: 5,
        visitedCountries: ['FR', 'DE'],
      })
      const stats = calculateTravelStats(true)
      expect(stats.totalDistanceKm).toBe(100) // 100000/1000
      expect(stats.totalRides).toBe(5)
      expect(stats.countriesCount).toBe(2)
    })

    it('includes distance comparison', () => {
      getState.mockReturnValue({
        checkinHistory: [
          { spotId: 1, distance: 500000, timestamp: Date.now() },
        ],
        spots: [],
      })
      const stats = calculateTravelStats(true)
      expect(stats.distanceComparison).toBeDefined()
      // distanceComparison returns either {km, text} for matched or {iconName, text} for < 50
      expect(stats.distanceComparison.text).toBeDefined()
    })
  })
})
