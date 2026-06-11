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
  formatDistance,
  formatDuration,
  getDirectionIcon,
  openExternalNavigation,
  stopNavigation,
} from '../../src/services/navigation.js'

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
  })
})
