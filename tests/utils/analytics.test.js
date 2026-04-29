import { describe, it, expect, beforeEach, vi } from 'vitest'

import {
  trackEvent,
  getUsageHeatmap,
  getTopFeatures,
  getSessionStats,
  trackTabChange,
  trackModalOpen,
  trackAction,
  clearAnalytics,
} from '../../src/utils/analytics.js'

const STORAGE_KEY = 'spothitch_analytics'

describe('analytics', () => {
  beforeEach(() => {
    localStorage.clear()
    // Reset the module's internal sessionId so getSessionId() starts fresh
    sessionStorage.clear?.()
    vi.clearAllMocks()
  })

  describe('trackEvent', () => {
    it('stores an event in localStorage', () => {
      trackEvent('spots', 'view', 'map')
      const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      expect(events.length).toBe(1)
      expect(events[0].c).toBe('spots')
      expect(events[0].a).toBe('view')
      expect(events[0].l).toBe('map')
    })

    it('stores a timestamp on each event', () => {
      const before = Date.now()
      trackEvent('test', 'action')
      const after = Date.now()
      const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      expect(events[0].t).toBeGreaterThanOrEqual(before)
      expect(events[0].t).toBeLessThanOrEqual(after)
    })

    it('stores a session ID on each event', () => {
      trackEvent('test', 'action')
      const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      expect(events[0].s).toBeTruthy()
    })

    it('accumulates multiple events', () => {
      trackEvent('spots', 'view')
      trackEvent('spots', 'create')
      trackEvent('social', 'share')
      const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      expect(events.length).toBe(3)
    })

    it('uses empty string when label is omitted', () => {
      trackEvent('modal', 'open')
      const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      expect(events[0].l).toBe('')
    })

    it('keeps label when provided', () => {
      trackEvent('navigation', 'tab', 'home')
      const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      expect(events[0].l).toBe('home')
    })

    it('trims to last 500 events', () => {
      // Fill with 502 events
      for (let i = 0; i < 502; i++) {
        trackEvent('cat', 'act', `label-${i}`)
      }
      const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      expect(events.length).toBe(500)
      // The oldest events should have been dropped
      expect(events[0].l).toBe('label-2')
    })

    it('does not throw when localStorage is unavailable', () => {
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => { throw new Error('Storage full') })
      expect(() => trackEvent('test', 'fail')).not.toThrow()
      localStorage.setItem = originalSetItem
    })
  })

  describe('clearAnalytics', () => {
    it('removes all stored events', () => {
      trackEvent('spots', 'view')
      trackEvent('social', 'share')
      clearAnalytics()
      const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      expect(events.length).toBe(0)
    })

    it('does not throw when there is nothing to clear', () => {
      expect(() => clearAnalytics()).not.toThrow()
    })
  })

  describe('getUsageHeatmap', () => {
    it('returns empty object when no events', () => {
      const heatmap = getUsageHeatmap(7)
      expect(heatmap).toEqual({})
    })

    it('groups events by category and action', () => {
      trackEvent('spots', 'view')
      trackEvent('spots', 'view')
      trackEvent('spots', 'create')
      trackEvent('social', 'share')
      const heatmap = getUsageHeatmap(7)
      expect(heatmap['spots']['view']).toBe(2)
      expect(heatmap['spots']['create']).toBe(1)
      expect(heatmap['social']['share']).toBe(1)
    })

    it('includes label in action key when label is non-empty', () => {
      trackEvent('navigation', 'tab', 'map')
      const heatmap = getUsageHeatmap(7)
      expect(heatmap['navigation']['tab:map']).toBe(1)
    })

    it('uses plain action key when label is empty', () => {
      trackEvent('modal', 'open', '')
      const heatmap = getUsageHeatmap(7)
      expect(heatmap['modal']['open']).toBe(1)
    })

    it('filters out events older than specified days', () => {
      // Manually inject an old event
      const oldEvent = { c: 'old', a: 'action', l: '', t: Date.now() - 10 * 24 * 60 * 60 * 1000, s: 'sess1' }
      localStorage.setItem(STORAGE_KEY, JSON.stringify([oldEvent]))
      const heatmap = getUsageHeatmap(7)
      expect(heatmap['old']).toBeUndefined()
    })

    it('includes events within the day range', () => {
      const recentEvent = { c: 'recent', a: 'action', l: '', t: Date.now() - 5 * 24 * 60 * 60 * 1000, s: 'sess1' }
      localStorage.setItem(STORAGE_KEY, JSON.stringify([recentEvent]))
      const heatmap = getUsageHeatmap(7)
      expect(heatmap['recent']['action']).toBe(1)
    })

    it('counts multiple events with same key correctly', () => {
      for (let i = 0; i < 5; i++) {
        trackEvent('gamification', 'badge_earned', 'first_vote')
      }
      const heatmap = getUsageHeatmap(7)
      expect(heatmap['gamification']['badge_earned:first_vote']).toBe(5)
    })
  })

  describe('getTopFeatures', () => {
    it('returns empty array when no events', () => {
      const top = getTopFeatures()
      expect(top).toEqual([])
    })

    it('returns features sorted by count descending', () => {
      for (let i = 0; i < 5; i++) trackEvent('spots', 'view')
      for (let i = 0; i < 2; i++) trackEvent('social', 'share')
      trackEvent('modal', 'open')
      const top = getTopFeatures(10)
      expect(top[0].count).toBeGreaterThanOrEqual(top[1].count)
      expect(top[1].count).toBeGreaterThanOrEqual(top[2].count)
    })

    it('returns at most n features', () => {
      for (let i = 0; i < 20; i++) {
        trackEvent(`cat${i}`, `act${i}`)
      }
      const top = getTopFeatures(5)
      expect(top.length).toBeLessThanOrEqual(5)
    })

    it('returns feature as "category/action" string', () => {
      trackEvent('spots', 'create')
      const top = getTopFeatures(10)
      expect(top[0].feature).toBe('spots/create')
    })

    it('includes count property for each feature', () => {
      trackEvent('gamification', 'level_up')
      const top = getTopFeatures(10)
      expect(typeof top[0].count).toBe('number')
      expect(top[0].count).toBeGreaterThan(0)
    })

    it('default n=10 limits to 10 results', () => {
      for (let i = 0; i < 15; i++) trackEvent(`c${i}`, `a${i}`)
      const top = getTopFeatures()
      expect(top.length).toBeLessThanOrEqual(10)
    })
  })

  describe('getSessionStats', () => {
    it('returns totalEvents of 0 when no events', () => {
      const stats = getSessionStats()
      expect(stats.totalEvents).toBe(0)
    })

    it('counts total events correctly', () => {
      trackEvent('a', 'b')
      trackEvent('c', 'd')
      trackEvent('e', 'f')
      const stats = getSessionStats()
      expect(stats.totalEvents).toBe(3)
    })

    it('counts unique sessions', () => {
      // Inject events from different sessions
      const events = [
        { c: 'a', a: 'b', l: '', t: Date.now(), s: 'sess1' },
        { c: 'a', a: 'b', l: '', t: Date.now(), s: 'sess2' },
        { c: 'a', a: 'b', l: '', t: Date.now(), s: 'sess1' },
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
      const stats = getSessionStats()
      expect(stats.totalSessions).toBe(2)
    })

    it('returns currentSession as a string', () => {
      const stats = getSessionStats()
      expect(typeof stats.currentSession).toBe('string')
      expect(stats.currentSession).toBeTruthy()
    })

    it('returns sessionDuration >= 0', () => {
      const stats = getSessionStats()
      expect(stats.sessionDuration).toBeGreaterThanOrEqual(0)
    })

    it('keeps the same session ID across calls', () => {
      const s1 = getSessionStats().currentSession
      const s2 = getSessionStats().currentSession
      expect(s1).toBe(s2)
    })
  })

  describe('trackTabChange', () => {
    it('stores navigation/tab event with tab as label', () => {
      trackTabChange('map')
      const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      expect(events[0].c).toBe('navigation')
      expect(events[0].a).toBe('tab')
      expect(events[0].l).toBe('map')
    })

    it('works for any tab name', () => {
      trackTabChange('profile')
      const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      expect(events[0].l).toBe('profile')
    })
  })

  describe('trackModalOpen', () => {
    it('stores modal/open event with modal name as label', () => {
      trackModalOpen('auth')
      const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      expect(events[0].c).toBe('modal')
      expect(events[0].a).toBe('open')
      expect(events[0].l).toBe('auth')
    })
  })

  describe('trackAction', () => {
    it('stores action category event', () => {
      trackAction('share', 'spot')
      const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      expect(events[0].c).toBe('action')
      expect(events[0].a).toBe('share')
      expect(events[0].l).toBe('spot')
    })

    it('works without label', () => {
      trackAction('refresh')
      const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      expect(events[0].a).toBe('refresh')
    })
  })
})
