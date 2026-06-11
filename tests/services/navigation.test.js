import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ isOnline: true })),
  setState: vi.fn(),
}))
vi.mock('../../src/services/notifications.js', () => ({
  showToast: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))

import {
  startNavigation,
  formatDistance,
  formatDuration,
  getDirectionIcon,
  openExternalNavigation,
  stopNavigation,
} from '../../src/services/navigation.js'
import { setState, getState } from '../../src/stores/state.js'
import { showToast } from '../../src/services/notifications.js'

describe('services/navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
  })

  describe('formatDistance', () => {
    it('formats meters under 1000 as "X m"', () => {
      expect(formatDistance(500)).toBe('500 m')
      expect(formatDistance(1)).toBe('1 m')
      expect(formatDistance(999)).toBe('999 m')
    })

    it('formats 1000+ meters as km with 1 decimal', () => {
      expect(formatDistance(1000)).toBe('1.0 km')
      expect(formatDistance(1500)).toBe('1.5 km')
      expect(formatDistance(10000)).toBe('10.0 km')
    })

    it('rounds meters correctly', () => {
      expect(formatDistance(500.6)).toBe('501 m')
    })
  })

  describe('formatDuration', () => {
    it('returns lessThanOneMin key for under 60 seconds', () => {
      const result = formatDuration(30)
      expect(result).toBeTruthy()
    })

    it('formats minutes for 1-59 minutes', () => {
      expect(formatDuration(60)).toBe('1 min')
      expect(formatDuration(90)).toBe('2 min')
      expect(formatDuration(3540)).toBe('59 min')
    })

    it('formats hours and minutes for 1+ hours', () => {
      expect(formatDuration(3600)).toBe('1h')
      expect(formatDuration(3660)).toBe('1h 1min')
      expect(formatDuration(7200)).toBe('2h')
      expect(formatDuration(7260)).toBe('2h 1min')
      expect(formatDuration(5400)).toBe('1h 30min')
    })
  })

  describe('getDirectionIcon', () => {
    it('returns corner-up-left for left turn', () => {
      expect(getDirectionIcon('turn', 'left')).toBe('corner-up-left')
      expect(getDirectionIcon('turn', 'sharp left')).toBe('corner-up-left')
    })

    it('returns corner-up-right for right turn', () => {
      expect(getDirectionIcon('turn', 'right')).toBe('corner-up-right')
    })

    it('returns arrow-up for continue', () => {
      expect(getDirectionIcon('continue')).toBe('arrow-up')
    })

    it('returns git-merge for merge', () => {
      expect(getDirectionIcon('merge')).toBe('git-merge')
    })

    it('returns rotate-cw for roundabout', () => {
      expect(getDirectionIcon('roundabout')).toBe('rotate-cw')
      expect(getDirectionIcon('rotary')).toBe('rotate-cw')
    })

    it('returns map-pin for depart', () => {
      expect(getDirectionIcon('depart')).toBe('map-pin')
    })

    it('returns flag for arrive', () => {
      expect(getDirectionIcon('arrive')).toBe('flag')
    })

    it('returns arrow-up for unknown maneuver type', () => {
      expect(getDirectionIcon('unknown-type')).toBe('arrow-up')
      expect(getDirectionIcon()).toBe('arrow-up')
    })
  })

  describe('openExternalNavigation', () => {
    it('runs without error for valid coords', () => {
      expect(() => openExternalNavigation(48.8, 2.3, 'Paris')).not.toThrow()
    })

    it('creates a link element', () => {
      const createElementSpy = vi.spyOn(document, 'createElement')
      openExternalNavigation(48.8, 2.3)
      const linkCalls = createElementSpy.mock.calls.filter(c => c[0] === 'a')
      expect(linkCalls.length).toBeGreaterThan(0)
    })

    it('works for different coordinate values', () => {
      expect(() => openExternalNavigation(51.5, -0.1, 'London')).not.toThrow()
      expect(() => openExternalNavigation(40.4, -3.7, 'Madrid')).not.toThrow()
    })
  })

  describe('stopNavigation', () => {
    it('runs without error', () => {
      expect(() => stopNavigation()).not.toThrow()
    })
  })

  describe('global handlers registered', () => {
    it('window.stopNavigation is defined', () => {
      expect(typeof window.stopNavigation).toBe('function')
    })

    it('window.openExternalNavigation is defined', () => {
      expect(typeof window.openExternalNavigation).toBe('function')
    })

    it('window.startNavigation is defined', () => {
      expect(typeof window.startNavigation).toBe('function')
    })
  })

  describe('startNavigation', () => {
    const mockOSRMResponse = {
      code: 'Ok',
      routes: [{
        distance: 5000,
        duration: 600,
        geometry: { type: 'LineString', coordinates: [] },
        legs: [{
          steps: [
            {
              maneuver: { type: 'depart', modifier: '' },
              name: 'Main Street',
              distance: 2000,
              duration: 240,
              geometry: { coordinates: [[2.3, 48.8]] },
            },
            {
              maneuver: { type: 'arrive', modifier: '' },
              name: '',
              distance: 0,
              duration: 0,
              geometry: { coordinates: [[2.35, 48.85]] },
            },
          ],
        }],
      }],
    }

    beforeEach(() => {
      vi.clearAllMocks()
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockOSRMResponse,
      })
      global.navigator.geolocation = {
        getCurrentPosition: vi.fn((resolve) => resolve({
          coords: { latitude: 48.8, longitude: 2.3 },
        })),
        watchPosition: vi.fn(() => 42),
        clearWatch: vi.fn(),
      }
    })

    it('returns false when geolocation is not available', async () => {
      global.navigator.geolocation = undefined
      const result = await startNavigation(48.9, 2.4, 'Destination')
      expect(result).toBe(false)
      expect(showToast).toHaveBeenCalledWith(expect.any(String), 'error')
    })

    it('returns true and calls setState when route is found', async () => {
      const result = await startNavigation(48.9, 2.4, 'Paris')
      expect(result).toBe(true)
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ navigationActive: true })
      )
    })

    it('calls setState with destination name', async () => {
      await startNavigation(48.9, 2.4, 'Lyon')
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({
          navigationDestination: expect.objectContaining({ name: 'Lyon' }),
        })
      )
    })

    it('calls setState with route distance and duration', async () => {
      await startNavigation(48.9, 2.4)
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({
          navigationDistance: 5000,
          navigationDuration: 600,
        })
      )
    })

    it('returns false when route calculation fails (fetch error)', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('network error'))
      const result = await startNavigation(48.9, 2.4, 'Nowhere')
      expect(result).toBe(false)
      expect(showToast).toHaveBeenCalledWith(expect.any(String), 'error')
    })

    it('returns false when OSRM returns no routes', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ code: 'Ok', routes: [] }),
      })
      const result = await startNavigation(48.9, 2.4)
      expect(result).toBe(false)
    })

    it('returns false when OSRM response is not ok', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: false })
      const result = await startNavigation(48.9, 2.4)
      expect(result).toBe(false)
    })

    it('starts geolocation watch on success', async () => {
      await startNavigation(48.9, 2.4)
      expect(navigator.geolocation.watchPosition).toHaveBeenCalled()
    })

    it('shows success toast on successful navigation start', async () => {
      await startNavigation(48.9, 2.4, 'Destination')
      expect(showToast).toHaveBeenCalledWith(expect.any(String), 'success')
    })

    it('uses default destination name when not provided', async () => {
      const result = await startNavigation(48.9, 2.4)
      expect(result).toBe(true)
    })
  })

  describe('stopNavigation (with active watch)', () => {
    it('calls clearWatch when there is an active watchId', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          code: 'Ok',
          routes: [{
            distance: 1000, duration: 120,
            geometry: {},
            legs: [{ steps: [{ maneuver: { type: 'depart', modifier: '' }, name: 'Rue', distance: 1000, duration: 120, geometry: { coordinates: [[2.3, 48.8]] } }] }],
          }],
        }),
      })
      global.navigator.geolocation = {
        getCurrentPosition: vi.fn((resolve) => resolve({ coords: { latitude: 48.8, longitude: 2.3 } })),
        watchPosition: vi.fn(() => 99),
        clearWatch: vi.fn(),
      }
      await startNavigation(48.9, 2.4)
      stopNavigation()
      expect(navigator.geolocation.clearWatch).toHaveBeenCalledWith(99)
    })

    it('calls setState with navigationActive=false', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          code: 'Ok',
          routes: [{
            distance: 1000, duration: 120,
            geometry: {},
            legs: [{ steps: [{ maneuver: { type: 'depart', modifier: '' }, name: 'Rue', distance: 1000, duration: 120, geometry: { coordinates: [[2.3, 48.8]] } }] }],
          }],
        }),
      })
      global.navigator.geolocation = {
        getCurrentPosition: vi.fn((resolve) => resolve({ coords: { latitude: 48.8, longitude: 2.3 } })),
        watchPosition: vi.fn(() => 88),
        clearWatch: vi.fn(),
      }
      await startNavigation(48.9, 2.4)
      vi.clearAllMocks()
      stopNavigation()
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ navigationActive: false })
      )
    })
  })
})
