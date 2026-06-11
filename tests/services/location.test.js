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
    safeSetItem: vi.fn(),
  }
})

import {
  getLocationPermissionChoice,
  saveLocationPermissionChoice,
  handleDeclineLocationPermission,
  handleAcceptLocationPermission,
  stopWatchingLocation,
  watchUserLocation,
  resetLocationPermission,
  getDistanceKm,
} from '../../src/services/location.js'
import { Storage } from '../../src/utils/storage.js'

describe('location service', () => {
  beforeEach(() => {
    // Reset the mock store
    const store = Storage._store
    for (const key of Object.keys(store)) delete store[key]
    vi.clearAllMocks()
    window.setState = vi.fn()
  })

  describe('getLocationPermissionChoice', () => {
    it('returns "unknown" when no choice stored', () => {
      const result = getLocationPermissionChoice()
      expect(result).toBe('unknown')
    })

    it('returns "granted" after saving granted choice', () => {
      saveLocationPermissionChoice('granted')
      const result = getLocationPermissionChoice()
      expect(result).toBe('granted')
    })

    it('returns "denied" when recently declined', () => {
      saveLocationPermissionChoice('denied')
      const result = getLocationPermissionChoice()
      expect(result).toBe('denied')
    })

    it('returns "unknown" when denied choice is older than 30 days', () => {
      const thirtyOneDaysAgo = Date.now() - 31 * 24 * 60 * 60 * 1000
      // Directly set the store to simulate old denial
      Storage._store['location_permission_choice'] = 'denied'
      Storage._store['location_permission_date'] = thirtyOneDaysAgo
      const result = getLocationPermissionChoice()
      expect(result).toBe('unknown')
    })
  })

  describe('saveLocationPermissionChoice', () => {
    it('saves "granted" choice', () => {
      saveLocationPermissionChoice('granted')
      expect(Storage._store['location_permission_choice']).toBe('granted')
    })

    it('saves "denied" choice', () => {
      saveLocationPermissionChoice('denied')
      expect(Storage._store['location_permission_choice']).toBe('denied')
    })

    it('saves timestamp alongside choice', () => {
      const before = Date.now()
      saveLocationPermissionChoice('granted')
      const storedDate = Storage._store['location_permission_date']
      expect(storedDate).toBeGreaterThanOrEqual(before)
    })

    it('updates state via window.setState', () => {
      saveLocationPermissionChoice('granted')
      expect(window.setState).toHaveBeenCalledWith({ locationPermissionChoice: 'granted' })
    })
  })

  describe('handleDeclineLocationPermission', () => {
    it('runs without error', () => {
      expect(() => handleDeclineLocationPermission()).not.toThrow()
    })

    it('saves denied choice', () => {
      handleDeclineLocationPermission()
      expect(Storage._store['location_permission_choice']).toBe('denied')
    })
  })

  describe('stopWatchingLocation', () => {
    it('runs without error when watchId is null', () => {
      expect(() => stopWatchingLocation(null)).not.toThrow()
    })

    it('runs without error when watchId is undefined', () => {
      expect(() => stopWatchingLocation(undefined)).not.toThrow()
    })

    it('runs without error with a numeric watchId', () => {
      // In happy-dom, navigator.geolocation may not be available
      expect(() => stopWatchingLocation(42)).not.toThrow()
    })
  })

  describe('resetLocationPermission', () => {
    it('runs without error', () => {
      window.setState = vi.fn()
      expect(() => resetLocationPermission()).not.toThrow()
    })

    it('removes location permission from storage', () => {
      saveLocationPermissionChoice('granted')
      expect(Storage._store['location_permission_choice']).toBe('granted')
      window.setState = vi.fn()
      resetLocationPermission()
      expect(Storage.remove).toHaveBeenCalledWith('location_permission_choice')
    })
  })

  describe('watchUserLocation', () => {
    it('returns null when navigator.geolocation is not available', () => {
      const originalGeo = navigator.geolocation
      Object.defineProperty(navigator, 'geolocation', { value: undefined, writable: true, configurable: true })
      const result = watchUserLocation(vi.fn())
      expect(result).toBeNull()
      Object.defineProperty(navigator, 'geolocation', { value: originalGeo, writable: true, configurable: true })
    })

    it('returns null when permission is not granted', () => {
      // Storage has no choice stored → 'unknown'
      const result = watchUserLocation(vi.fn())
      expect(result).toBeNull()
    })

    it('returns null when permission is denied', () => {
      saveLocationPermissionChoice('denied')
      const result = watchUserLocation(vi.fn())
      expect(result).toBeNull()
    })

    it('calls watchPosition when permission is granted', () => {
      saveLocationPermissionChoice('granted')
      const mockWatchId = 42
      const mockGeo = { watchPosition: vi.fn(() => mockWatchId), clearWatch: vi.fn() }
      Object.defineProperty(navigator, 'geolocation', { value: mockGeo, writable: true, configurable: true })
      const result = watchUserLocation(vi.fn())
      expect(mockGeo.watchPosition).toHaveBeenCalled()
      expect(result).toBe(mockWatchId)
    })
  })

  describe('handleDeclineLocationPermission with onError callback', () => {
    it('calls onError callback when set', () => {
      const onError = vi.fn()
      window._locationPermissionCallbacks = { onError }
      handleDeclineLocationPermission()
      expect(onError).toHaveBeenCalled()
    })

    it('cleans up callbacks after decline', () => {
      window._locationPermissionCallbacks = { onError: vi.fn() }
      handleDeclineLocationPermission()
      expect(window._locationPermissionCallbacks).toBeUndefined()
    })
  })

  describe('handleAcceptLocationPermission', () => {
    it('returns a promise', () => {
      const mockGeo = { getCurrentPosition: vi.fn((ok) => ok({ coords: { latitude: 48.85, longitude: 2.35, accuracy: 10 }, timestamp: Date.now() })) }
      Object.defineProperty(navigator, 'geolocation', { value: mockGeo, writable: true, configurable: true })
      const result = handleAcceptLocationPermission()
      expect(result instanceof Promise).toBe(true)
    })

    it('resolves when getCurrentPosition succeeds', async () => {
      const mockGeo = { getCurrentPosition: vi.fn((ok) => ok({ coords: { latitude: 48.85, longitude: 2.35, accuracy: 10 }, timestamp: Date.now() })) }
      Object.defineProperty(navigator, 'geolocation', { value: mockGeo, writable: true, configurable: true })
      await expect(handleAcceptLocationPermission()).resolves.toBeDefined()
    })
  })

  describe('getDistanceKm', () => {
    it('is a function (alias of haversineKm)', () => {
      expect(typeof getDistanceKm).toBe('function')
    })

    it('returns 0 for same coordinates', () => {
      expect(getDistanceKm(48.8566, 2.3522, 48.8566, 2.3522)).toBe(0)
    })

    it('returns positive distance for different coordinates', () => {
      const dist = getDistanceKm(48.8566, 2.3522, 45.764, 4.8357)
      expect(dist).toBeGreaterThan(300)
      expect(dist).toBeLessThan(450)
    })
  })
})
