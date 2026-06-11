import { describe, it, expect, vi, afterEach } from 'vitest'

import {
  distanceMeters,
  CHECK_IN_RADIUS_M,
  VALIDATION_RADIUS_M,
  MAX_AGE_MS,
  startLocationTracking,
  stopLocationTracking,
  verifyProximity,
} from '../../src/services/locationHistory.js'

describe('locationHistory', () => {
  describe('distanceMeters (Haversine)', () => {
    it('returns 0 for same point', () => {
      expect(distanceMeters(48.8566, 2.3522, 48.8566, 2.3522)).toBe(0)
    })

    it('calculates short distance correctly (~111m per 0.001 lat)', () => {
      const dist = distanceMeters(48.8566, 2.3522, 48.8576, 2.3522)
      expect(dist).toBeGreaterThan(100)
      expect(dist).toBeLessThan(120)
    })

    it('Paris to Lyon is ~390km', () => {
      const dist = distanceMeters(48.8566, 2.3522, 45.764, 4.8357)
      const km = dist / 1000
      expect(km).toBeGreaterThan(380)
      expect(km).toBeLessThan(400)
    })

    it('Paris to Berlin is ~878km', () => {
      const dist = distanceMeters(48.8566, 2.3522, 52.5200, 13.4050)
      const km = dist / 1000
      expect(km).toBeGreaterThan(850)
      expect(km).toBeLessThan(900)
    })

    it('handles negative coordinates', () => {
      // New York to Buenos Aires
      const dist = distanceMeters(40.7128, -74.0060, -34.6037, -58.3816)
      const km = dist / 1000
      expect(km).toBeGreaterThan(8000)
      expect(km).toBeLessThan(9000)
    })

    it('handles crossing 180th meridian', () => {
      const dist = distanceMeters(0, 179, 0, -179)
      const km = dist / 1000
      expect(km).toBeGreaterThan(200)
      expect(km).toBeLessThan(250)
    })
  })

  describe('constants', () => {
    it('CHECK_IN_RADIUS_M is 500', () => {
      expect(CHECK_IN_RADIUS_M).toBe(500)
    })

    it('VALIDATION_RADIUS_M is 2000', () => {
      expect(VALIDATION_RADIUS_M).toBe(2000)
    })

    it('MAX_AGE_MS is 24 hours', () => {
      expect(MAX_AGE_MS).toBe(24 * 60 * 60 * 1000)
    })
  })

  describe('startLocationTracking', () => {
    afterEach(() => {
      stopLocationTracking()
    })

    it('does nothing when geolocation is unavailable', () => {
      Object.defineProperty(navigator, 'geolocation', {
        value: null,
        configurable: true,
        writable: true,
      })
      expect(() => startLocationTracking()).not.toThrow()
    })

    it('calls watchPosition when geolocation is available', () => {
      const clearWatch = vi.fn()
      const watchPosition = vi.fn(() => 42)
      Object.defineProperty(navigator, 'geolocation', {
        value: { watchPosition, clearWatch },
        configurable: true,
        writable: true,
      })
      startLocationTracking()
      expect(watchPosition).toHaveBeenCalled()
    })

    it('does not call watchPosition again if already tracking', () => {
      const clearWatch = vi.fn()
      const watchPosition = vi.fn(() => 42)
      Object.defineProperty(navigator, 'geolocation', {
        value: { watchPosition, clearWatch },
        configurable: true,
        writable: true,
      })
      startLocationTracking()
      startLocationTracking() // second call is no-op
      expect(watchPosition).toHaveBeenCalledTimes(1)
    })
  })

  describe('stopLocationTracking', () => {
    it('runs without error when not tracking', () => {
      const clearWatch = vi.fn()
      Object.defineProperty(navigator, 'geolocation', {
        value: { watchPosition: vi.fn(() => 99), clearWatch },
        configurable: true,
        writable: true,
      })
      expect(() => stopLocationTracking()).not.toThrow()
      expect(clearWatch).not.toHaveBeenCalled()
    })

    it('calls clearWatch with the watchId when stopping active tracking', () => {
      const clearWatch = vi.fn()
      const watchPosition = vi.fn(() => 99)
      Object.defineProperty(navigator, 'geolocation', {
        value: { watchPosition, clearWatch },
        configurable: true,
        writable: true,
      })
      startLocationTracking()
      stopLocationTracking()
      expect(clearWatch).toHaveBeenCalledWith(99)
    })

    it('is safe to call multiple times', () => {
      const clearWatch = vi.fn()
      Object.defineProperty(navigator, 'geolocation', {
        value: { watchPosition: vi.fn(() => 1), clearWatch },
        configurable: true,
        writable: true,
      })
      stopLocationTracking()
      stopLocationTracking()
      expect(clearWatch).not.toHaveBeenCalled()
    })
  })

  describe('verifyProximity', () => {
    it('returns verified_on_spot when user is at the exact spot location', async () => {
      Object.defineProperty(navigator, 'geolocation', {
        value: {
          getCurrentPosition: vi.fn((success) => {
            success({ coords: { latitude: 48.8566, longitude: 2.3522, accuracy: 5 } })
          }),
        },
        configurable: true,
        writable: true,
      })
      const result = await verifyProximity(48.8566, 2.3522, 'checkin')
      expect(result.allowed).toBe(true)
      expect(result.confidence).toBe('verified_on_spot')
      expect(typeof result.closestM).toBe('number')
      expect(result.matchedAt).toBeDefined()
    })

    it('returns position_confirmed and allowed=true for validation within 2km', async () => {
      // User at 48.8566, spot ~1km away at 48.866
      Object.defineProperty(navigator, 'geolocation', {
        value: {
          getCurrentPosition: vi.fn((success) => {
            success({ coords: { latitude: 48.8566, longitude: 2.3522, accuracy: 10 } })
          }),
        },
        configurable: true,
        writable: true,
      })
      const result = await verifyProximity(48.866, 2.3522, 'validation')
      expect(result.allowed).toBe(true)
      expect(result.confidence).toBe('position_confirmed')
    })

    it('returns allowed=false for checkin when 500m-2km from spot', async () => {
      // User at 48.8566, spot ~1km away at 48.866
      Object.defineProperty(navigator, 'geolocation', {
        value: {
          getCurrentPosition: vi.fn((success) => {
            success({ coords: { latitude: 48.8566, longitude: 2.3522, accuracy: 10 } })
          }),
        },
        configurable: true,
        writable: true,
      })
      const result = await verifyProximity(48.866, 2.3522, 'checkin')
      expect(result.allowed).toBe(false)
      expect(result.confidence).toBe('position_confirmed')
    })

    it('result has closestM as rounded number', async () => {
      Object.defineProperty(navigator, 'geolocation', {
        value: {
          getCurrentPosition: vi.fn((success) => {
            success({ coords: { latitude: 48.8566, longitude: 2.3522, accuracy: 5 } })
          }),
        },
        configurable: true,
        writable: true,
      })
      const result = await verifyProximity(48.8566, 2.3522, 'checkin')
      expect(Number.isInteger(result.closestM)).toBe(true)
    })

    it('result has matchedAt as a timestamp', async () => {
      const before = Date.now()
      Object.defineProperty(navigator, 'geolocation', {
        value: {
          getCurrentPosition: vi.fn((success) => {
            success({ coords: { latitude: 48.8566, longitude: 2.3522, accuracy: 5 } })
          }),
        },
        configurable: true,
        writable: true,
      })
      const result = await verifyProximity(48.8566, 2.3522)
      expect(result.matchedAt).toBeGreaterThanOrEqual(before)
    })
  })
})

  describe('verifyProximity — no_history and too_far paths', () => {
    let origIDB
    beforeEach(() => { origIDB = global.indexedDB; global.indexedDB = undefined })
    afterEach(() => { global.indexedDB = origIDB })

    it('returns no_history when GPS unavailable and DB is empty', async () => {
      Object.defineProperty(navigator, 'geolocation', {
        value: {
          getCurrentPosition: vi.fn((_success, error) => {
            error(new Error('GPS denied'))
          }),
        },
        configurable: true, writable: true,
      })
      const result = await verifyProximity(48.8566, 2.3522, 'checkin')
      expect(result.allowed).toBe(false)
      expect(result.confidence).toBe('no_history')
      expect(result.closestM).toBeNull()
    })

    it('falls through to DB when user is >2km from spot', async () => {
      // User in Paris (48.8566), spot in Lyon (45.764) → dist > 2km
      Object.defineProperty(navigator, 'geolocation', {
        value: {
          getCurrentPosition: vi.fn((success) => {
            success({ coords: { latitude: 48.8566, longitude: 2.3522, accuracy: 10 } })
          }),
        },
        configurable: true, writable: true,
      })
      const result = await verifyProximity(45.764, 4.8357, 'checkin')
      // Falls through to DB (empty) → no_history
      expect(result.confidence).toBe('no_history')
    })

    it('startLocationTracking and stopLocationTracking do not throw', () => {
      Object.defineProperty(navigator, 'geolocation', {
        value: {
          watchPosition: vi.fn(() => 1),
          clearWatch: vi.fn(),
        },
        configurable: true, writable: true,
      })
      expect(() => startLocationTracking()).not.toThrow()
      expect(() => stopLocationTracking()).not.toThrow()
    })
  })
