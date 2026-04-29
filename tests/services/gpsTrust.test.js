import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock firebase.js before importing
vi.mock('../../src/services/firebase.js', () => ({
  getCurrentUser: vi.fn(() => null),
  db: null,
}))

// Mock locationHistory.js
vi.mock('../../src/services/locationHistory.js', () => ({
  verifyProximity: vi.fn(),
}))

import {
  updateTrustCounters,
  getTrustRatio,
  isValidationTrusted,
  checkGpsForAction,
} from '../../src/services/gpsTrust.js'

describe('gpsTrust', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getTrustRatio', () => {
    it('returns 1 during grace period (< 3 validations)', () => {
      expect(getTrustRatio()).toBe(1)
    })

    it('returns 1 with 2 GPS validations (still in grace)', () => {
      localStorage.setItem('spothitch_validation_gps_count', '2')
      expect(getTrustRatio()).toBe(1)
    })

    it('calculates ratio after grace period', () => {
      localStorage.setItem('spothitch_validation_gps_count', '2')
      localStorage.setItem('spothitch_validation_nogps_count', '2')
      expect(getTrustRatio()).toBe(0.5)
    })

    it('returns 1 when all GPS-verified', () => {
      localStorage.setItem('spothitch_validation_gps_count', '5')
      localStorage.setItem('spothitch_validation_nogps_count', '0')
      expect(getTrustRatio()).toBe(1)
    })

    it('returns 0 when none GPS-verified (past grace)', () => {
      localStorage.setItem('spothitch_validation_gps_count', '0')
      localStorage.setItem('spothitch_validation_nogps_count', '5')
      expect(getTrustRatio()).toBe(0)
    })

    it('returns correct ratio for 1 GPS / 2 noGPS', () => {
      localStorage.setItem('spothitch_validation_gps_count', '1')
      localStorage.setItem('spothitch_validation_nogps_count', '2')
      expect(getTrustRatio()).toBeCloseTo(0.333, 2)
    })
  })

  describe('updateTrustCounters', () => {
    it('increments GPS count when gpsVerified=true', () => {
      updateTrustCounters(true)
      expect(localStorage.getItem('spothitch_validation_gps_count')).toBe('1')
    })

    it('increments noGPS count when gpsVerified=false', () => {
      updateTrustCounters(false)
      expect(localStorage.getItem('spothitch_validation_nogps_count')).toBe('1')
    })

    it('increments from existing value', () => {
      localStorage.setItem('spothitch_validation_gps_count', '3')
      updateTrustCounters(true)
      expect(localStorage.getItem('spothitch_validation_gps_count')).toBe('4')
    })

    it('handles both counters independently', () => {
      updateTrustCounters(true)
      updateTrustCounters(true)
      updateTrustCounters(false)
      expect(localStorage.getItem('spothitch_validation_gps_count')).toBe('2')
      expect(localStorage.getItem('spothitch_validation_nogps_count')).toBe('1')
    })
  })

  describe('isValidationTrusted', () => {
    it('returns true during grace period', () => {
      expect(isValidationTrusted()).toBe(true)
    })

    it('returns true when ratio >= 0.33', () => {
      localStorage.setItem('spothitch_validation_gps_count', '2')
      localStorage.setItem('spothitch_validation_nogps_count', '2')
      // ratio = 0.5 >= 0.33
      expect(isValidationTrusted()).toBe(true)
    })

    it('returns false when ratio < 0.33', () => {
      localStorage.setItem('spothitch_validation_gps_count', '1')
      localStorage.setItem('spothitch_validation_nogps_count', '5')
      // ratio = 1/6 = 0.166 < 0.33
      expect(isValidationTrusted()).toBe(false)
    })

    it('returns true at exactly 33% boundary', () => {
      localStorage.setItem('spothitch_validation_gps_count', '1')
      localStorage.setItem('spothitch_validation_nogps_count', '2')
      // ratio = 1/3 = 0.333... >= 0.33
      expect(isValidationTrusted()).toBe(true)
    })
  })

  describe('checkGpsForAction', () => {
    it('returns proceed:true with gpsVerified:false when no coords', async () => {
      const result = await checkGpsForAction(null, null)
      expect(result.proceed).toBe(true)
      expect(result.gpsVerified).toBe(false)
      expect(result.gpsDistance).toBeNull()
    })

    it('returns proceed:true with gpsVerified:false when lat=0', async () => {
      const result = await checkGpsForAction(0, 0)
      expect(result.proceed).toBe(true)
      expect(result.gpsVerified).toBe(false)
    })

    it('returns gpsVerified:true when proximity is allowed', async () => {
      const { verifyProximity } = await import('../../src/services/locationHistory.js')
      verifyProximity.mockResolvedValue({ allowed: true, closestM: 50 })

      const result = await checkGpsForAction(48.8566, 2.3522)
      expect(result.proceed).toBe(true)
      expect(result.gpsVerified).toBe(true)
      expect(result.gpsDistance).toBe(50)
    })
  })
})
