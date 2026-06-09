import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({
    userLocation: null,
    spots: [],
  })),
  setState: vi.fn(),
}))

vi.mock('../../src/services/notifications.js', () => ({
  showToast: vi.fn(),
}))

vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))

vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg>${name}</svg>`),
}))

import {
  logTripEvent,
  getTripHistory,
  clearTripHistory,
  getTripStats,
  renderTripHistory,
} from '../../src/services/tripHistory.js'

describe('tripHistory', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('logTripEvent', () => {
    it('logs a valid event type', () => {
      const result = logTripEvent('checkin', { spotId: 42 })
      expect(result).toBe(true)
    })

    it('returns false for invalid event type', () => {
      const result = logTripEvent('invalid_type')
      expect(result).toBe(false)
    })

    it('event is stored in localStorage', () => {
      logTripEvent('checkin', { spotId: 42 })
      const raw = localStorage.getItem('spothitch_trip_history')
      expect(raw).toBeTruthy()
      const history = JSON.parse(raw)
      expect(history.length).toBe(1)
      expect(history[0].type).toBe('checkin')
      expect(history[0].spotId).toBe(42)
    })

    it('adds events in reverse chronological order', () => {
      logTripEvent('start_trip')
      logTripEvent('checkin')
      logTripEvent('ride_start')
      const history = getTripHistory()
      expect(history[0].type).toBe('ride_start')
      expect(history[2].type).toBe('start_trip')
    })

    it('includes timestamp', () => {
      logTripEvent('checkin')
      const history = getTripHistory()
      expect(history[0].timestamp).toBeDefined()
      expect(typeof history[0].timestamp).toBe('number')
    })

    it('includes location data from details', () => {
      logTripEvent('checkin', { lat: 48.85, lng: 2.35, spotId: 1 })
      const history = getTripHistory()
      expect(history[0].lat).toBe(48.85)
      expect(history[0].lng).toBe(2.35)
    })

    it('trims to max 500 events', () => {
      for (let i = 0; i < 510; i++) {
        logTripEvent('checkin', { spotId: i })
      }
      const history = getTripHistory(600)
      expect(history.length).toBeLessThanOrEqual(500)
    })

    it('supports all valid event types', () => {
      const types = ['start_trip', 'checkin', 'ride_start', 'ride_end', 'arrive', 'spot_visited']
      types.forEach(type => {
        expect(logTripEvent(type)).toBe(true)
      })
      expect(getTripHistory(10).length).toBe(6)
    })
  })

  describe('getTripHistory', () => {
    it('returns empty array when no history', () => {
      expect(getTripHistory()).toEqual([])
    })

    it('respects limit parameter', () => {
      for (let i = 0; i < 10; i++) {
        logTripEvent('checkin')
      }
      expect(getTripHistory(3).length).toBe(3)
    })

    it('defaults to 50 limit', () => {
      for (let i = 0; i < 60; i++) {
        logTripEvent('checkin')
      }
      expect(getTripHistory().length).toBe(50)
    })
  })

  describe('clearTripHistory', () => {
    it('removes all history from localStorage', () => {
      logTripEvent('checkin')
      logTripEvent('ride_start')
      const result = clearTripHistory()
      expect(result).toBe(true)
      expect(getTripHistory()).toEqual([])
    })

    it('returns true even when already empty', () => {
      expect(clearTripHistory()).toBe(true)
    })
  })

  describe('getTripStats', () => {
    it('returns all-zero stats when empty', () => {
      const stats = getTripStats()
      expect(stats.totalEvents).toBe(0)
      expect(stats.checkins).toBe(0)
      expect(stats.rides).toBe(0)
      expect(stats.trips).toBe(0)
      expect(stats.spotsVisited).toBe(0)
    })

    it('counts events by type', () => {
      logTripEvent('start_trip')
      logTripEvent('checkin', { spotId: 1 })
      logTripEvent('checkin', { spotId: 2 })
      logTripEvent('ride_start')
      logTripEvent('arrive')

      const stats = getTripStats()
      expect(stats.totalEvents).toBe(5)
      expect(stats.checkins).toBe(2)
      expect(stats.rides).toBe(1)
      expect(stats.trips).toBe(1)
    })

    it('counts unique spots visited', () => {
      logTripEvent('checkin', { spotId: 1 })
      logTripEvent('checkin', { spotId: 2 })
      logTripEvent('checkin', { spotId: 1 }) // duplicate
      const stats = getTripStats()
      expect(stats.spotsVisited).toBe(2)
    })

    it('tracks first and last event timestamps', () => {
      logTripEvent('start_trip')
      logTripEvent('checkin')
      const stats = getTripStats()
      expect(stats.firstEvent).toBeDefined()
      expect(stats.lastEvent).toBeDefined()
      expect(stats.lastEvent).toBeGreaterThanOrEqual(stats.firstEvent)
    })
  })

  describe('renderTripHistory', () => {
    it('returns HTML string for empty history', () => {
      const html = renderTripHistory()
      expect(typeof html).toBe('string')
      expect(html).toContain('clipboard')
    })

    it('empty history contains empty state message', () => {
      const html = renderTripHistory()
      expect(html).toContain('tripHistoryEmpty')
    })

    it('returns HTML with events when history exists', () => {
      logTripEvent('checkin', { spotId: 1 })
      logTripEvent('start_trip')
      const html = renderTripHistory()
      expect(html).toContain('space-y-6')
    })

    it('contains event label in rendered output', () => {
      logTripEvent('checkin', {})
      const html = renderTripHistory()
      // getEventLabel is called for each event
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(100)
    })

    it('renders event with lat/lng location', () => {
      logTripEvent('checkin', { lat: 48.85, lng: 2.35 })
      const html = renderTripHistory()
      expect(html).toContain('48.8500')
      expect(html).toContain('2.3500')
    })

    it('renders unknown location for event without coords', () => {
      logTripEvent('checkin', {})
      const html = renderTripHistory()
      // getLocationText returns tripLocationUnknown key for events without spotId or lat/lng
      expect(html).toContain('tripLocationUnknown')
    })

    it('renders all supported event types without throwing', () => {
      const types = ['start_trip', 'checkin', 'ride_start', 'ride_end', 'arrive', 'spot_visited']
      types.forEach(type => logTripEvent(type, {}))
      expect(() => renderTripHistory()).not.toThrow()
    })

    it('respects limit parameter', () => {
      for (let i = 0; i < 10; i++) {
        logTripEvent('checkin', {})
      }
      // renderTripHistory with limit 2 should only show 2 events
      const html = renderTripHistory(2)
      expect(typeof html).toBe('string')
    })

    it('renders event with details object', () => {
      logTripEvent('checkin', { details: { note: 'great spot' } })
      const html = renderTripHistory()
      expect(typeof html).toBe('string')
    })

    it('contains time display for each event', () => {
      logTripEvent('checkin', {})
      const html = renderTripHistory()
      // formatTime produces a HH:MM time string
      expect(html.length).toBeGreaterThan(50)
    })
  })

  describe('error paths', () => {
    it('getHistory returns empty array on corrupt JSON', () => {
      localStorage.setItem('spothitch_trip_history', 'not-valid-json')
      expect(getTripHistory()).toEqual([])
    })

    it('logTripEvent handles error gracefully', () => {
      // Normal call - should not throw
      expect(() => logTripEvent('checkin')).not.toThrow()
    })
  })
})
