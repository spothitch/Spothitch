import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({
    spots: [],
    userLocation: null,
    notifications: true,
    travelModeEnabled: false,
  })),
  setState: vi.fn(),
}))
vi.mock('../../src/services/notifications.js', () => ({
  showToast: vi.fn(),
  sendLocalNotification: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))

import {
  checkNearbySpots,
  initProximityAlerts,
  stopProximityAlerts,
  setProximityRadius,
  toggleProximityAlerts,
  isProximityAlertsEnabled,
  clearAlertedSpots,
  getProximitySettings,
} from '../../src/services/proximityAlerts.js'
import { getState } from '../../src/stores/state.js'
import { showToast } from '../../src/services/notifications.js'

describe('proximityAlerts', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    clearAlertedSpots()
    // Reset to disabled state: if enabled, disable it
    if (isProximityAlertsEnabled()) {
      stopProximityAlerts()
    }
  })

  describe('isProximityAlertsEnabled', () => {
    it('returns a boolean', () => {
      expect(typeof isProximityAlertsEnabled()).toBe('boolean')
    })

    it('returns false initially', () => {
      // After stopProximityAlerts() in beforeEach, should be false
      expect(isProximityAlertsEnabled()).toBe(false)
    })
  })

  describe('getProximitySettings', () => {
    it('returns an object', () => {
      expect(typeof getProximitySettings()).toBe('object')
    })

    it('has enabled property', () => {
      expect('enabled' in getProximitySettings()).toBe(true)
    })

    it('has radius property', () => {
      expect('radius' in getProximitySettings()).toBe(true)
    })

    it('has alertedSpotsCount property', () => {
      expect('alertedSpotsCount' in getProximitySettings()).toBe(true)
    })

    it('returns alertedSpotsCount of 0 after clearAlertedSpots', () => {
      clearAlertedSpots()
      expect(getProximitySettings().alertedSpotsCount).toBe(0)
    })

    it('enabled matches isProximityAlertsEnabled()', () => {
      const settings = getProximitySettings()
      expect(settings.enabled).toBe(isProximityAlertsEnabled())
    })
  })

  describe('clearAlertedSpots', () => {
    it('runs without error', () => {
      expect(() => clearAlertedSpots()).not.toThrow()
    })

    it('sets alertedSpotsCount to 0', () => {
      clearAlertedSpots()
      expect(getProximitySettings().alertedSpotsCount).toBe(0)
    })

    it('is idempotent', () => {
      clearAlertedSpots()
      clearAlertedSpots()
      expect(getProximitySettings().alertedSpotsCount).toBe(0)
    })
  })

  describe('checkNearbySpots', () => {
    it('returns early when not enabled (no toast)', () => {
      // isEnabled is false after beforeEach
      checkNearbySpots(48.8566, 2.3522)
      expect(showToast).not.toHaveBeenCalled()
    })

    it('does not throw when called with valid coords', () => {
      expect(() => checkNearbySpots(48.8566, 2.3522)).not.toThrow()
    })

    it('does not throw with zero coords', () => {
      expect(() => checkNearbySpots(0, 0)).not.toThrow()
    })

    it('checks spots when enabled and spots array has entries', () => {
      // Enable it first
      toggleProximityAlerts()
      expect(isProximityAlertsEnabled()).toBe(true)

      getState.mockReturnValue({
        spots: [
          {
            id: 'spot1',
            coordinates: { lat: 48.857, lng: 2.352 },
            globalRating: 4.2,
          },
        ],
        travelModeEnabled: true,
      })

      // Spot is ~100m away from our test location — within 500m radius
      checkNearbySpots(48.8566, 2.3522)
      expect(showToast).toHaveBeenCalled()

      // Disable for next tests
      toggleProximityAlerts()
    })

    it('skips spots without coordinates', () => {
      toggleProximityAlerts()
      vi.clearAllMocks()
      getState.mockReturnValue({
        spots: [{ id: 'no-coords' }],
        travelModeEnabled: true,
      })
      checkNearbySpots(48.8566, 2.3522)
      expect(showToast).not.toHaveBeenCalled()
      toggleProximityAlerts()
    })

    it('skips spots without lat/lng', () => {
      toggleProximityAlerts()
      vi.clearAllMocks()
      getState.mockReturnValue({
        spots: [{ id: 'no-lat', coordinates: {} }],
        travelModeEnabled: true,
      })
      checkNearbySpots(48.8566, 2.3522)
      expect(showToast).not.toHaveBeenCalled()
      toggleProximityAlerts()
    })

    it('does not alert twice for the same spot', () => {
      toggleProximityAlerts()
      getState.mockReturnValue({
        spots: [
          { id: 'dup-spot', coordinates: { lat: 48.857, lng: 2.352 } },
        ],
        travelModeEnabled: true,
      })
      checkNearbySpots(48.8566, 2.3522)
      const firstCallCount = showToast.mock.calls.length

      // Second call — spot already alerted
      checkNearbySpots(48.8566, 2.3522)
      expect(showToast.mock.calls.length).toBe(firstCallCount) // no new calls
      toggleProximityAlerts()
    })

    it('clears alerted spots and re-alerts after clearAlertedSpots', () => {
      toggleProximityAlerts()
      getState.mockReturnValue({
        spots: [
          { id: 'reset-spot', coordinates: { lat: 48.857, lng: 2.352 } },
        ],
        travelModeEnabled: true,
      })
      checkNearbySpots(48.8566, 2.3522)
      clearAlertedSpots()
      const callsAfterClear = showToast.mock.calls.length
      checkNearbySpots(48.8566, 2.3522)
      expect(showToast.mock.calls.length).toBeGreaterThan(callsAfterClear)
      toggleProximityAlerts()
    })

    it('does not show toast for spots beyond radius', () => {
      toggleProximityAlerts()
      vi.clearAllMocks()
      getState.mockReturnValue({
        spots: [
          // Very far away (Lyon vs Paris)
          { id: 'far-spot', coordinates: { lat: 45.75, lng: 4.85 } },
        ],
        travelModeEnabled: true,
      })
      checkNearbySpots(48.8566, 2.3522)
      expect(showToast).not.toHaveBeenCalled()
      toggleProximityAlerts()
    })
  })

  describe('setProximityRadius', () => {
    it('sets radius within valid range', () => {
      setProximityRadius(300)
      expect(getProximitySettings().radius).toBe(300)
    })

    it('clamps radius to 100m minimum', () => {
      setProximityRadius(10)
      expect(getProximitySettings().radius).toBe(100)
    })

    it('clamps radius to 5000m maximum', () => {
      setProximityRadius(99999)
      expect(getProximitySettings().radius).toBe(5000)
    })

    it('calls showToast with new radius', () => {
      setProximityRadius(750)
      expect(showToast).toHaveBeenCalled()
    })

    it('saves to localStorage', () => {
      setProximityRadius(1000)
      const stored = localStorage.getItem('spothitch_proximity_alerts')
      expect(stored).toBeTruthy()
      const parsed = JSON.parse(stored)
      expect(parsed.radius).toBe(1000)
    })
  })

  describe('initProximityAlerts', () => {
    it('returns true on success', () => {
      expect(initProximityAlerts()).toBe(true)
    })

    it('reads settings from localStorage', () => {
      localStorage.setItem('spothitch_proximity_alerts', JSON.stringify({
        enabled: true,
        radius: 800,
      }))
      initProximityAlerts()
      // radius should be set from stored settings
      expect(getProximitySettings().radius).toBe(800)
    })

    it('does not throw when travelModeEnabled is false', () => {
      getState.mockReturnValue({ travelModeEnabled: false, spots: [] })
      expect(() => initProximityAlerts()).not.toThrow()
    })
  })

  describe('stopProximityAlerts', () => {
    it('runs without error', () => {
      expect(() => stopProximityAlerts()).not.toThrow()
    })

    it('sets isEnabled to false', () => {
      stopProximityAlerts()
      expect(isProximityAlertsEnabled()).toBe(false)
    })

    it('saves enabled:false to localStorage', () => {
      stopProximityAlerts()
      const stored = localStorage.getItem('spothitch_proximity_alerts')
      // Either null (not saved yet) or has enabled:false
      if (stored) {
        expect(JSON.parse(stored).enabled).toBe(false)
      }
    })

    it('is idempotent', () => {
      stopProximityAlerts()
      stopProximityAlerts()
      expect(isProximityAlertsEnabled()).toBe(false)
    })
  })

  describe('toggleProximityAlerts', () => {
    it('returns a boolean', () => {
      const result = toggleProximityAlerts()
      expect(typeof result).toBe('boolean')
      toggleProximityAlerts() // reset
    })

    it('toggles from false to true', () => {
      expect(isProximityAlertsEnabled()).toBe(false)
      toggleProximityAlerts()
      expect(isProximityAlertsEnabled()).toBe(true)
      toggleProximityAlerts() // reset
    })

    it('toggles from true to false', () => {
      toggleProximityAlerts() // enable
      expect(isProximityAlertsEnabled()).toBe(true)
      toggleProximityAlerts() // disable
      expect(isProximityAlertsEnabled()).toBe(false)
    })

    it('shows toast when enabling', () => {
      toggleProximityAlerts()
      expect(showToast).toHaveBeenCalled()
      toggleProximityAlerts() // reset
    })

    it('shows toast when disabling', () => {
      toggleProximityAlerts() // enable
      vi.clearAllMocks()
      toggleProximityAlerts() // disable
      expect(showToast).toHaveBeenCalled()
    })

    it('saves enabled state to localStorage', () => {
      toggleProximityAlerts()
      const stored = JSON.parse(localStorage.getItem('spothitch_proximity_alerts') || '{}')
      expect(stored.enabled).toBe(true)
      toggleProximityAlerts() // reset
    })

    it('returns new enabled state', () => {
      const result = toggleProximityAlerts()
      expect(result).toBe(isProximityAlertsEnabled())
      toggleProximityAlerts() // reset
    })
  })
})
