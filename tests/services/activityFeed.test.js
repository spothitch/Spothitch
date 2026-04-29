import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({
    friends: [],
    userLocation: null,
    user: null,
  })),
}))

vi.mock('../../src/utils/storage.js', () => {
  const store = {}
  return {
    Storage: {
      get: vi.fn((key) => store[key] || null),
      set: vi.fn((key, value) => { store[key] = value }),
      _store: store,
      _clear: () => { Object.keys(store).forEach(k => delete store[k]) },
    },
  }
})

vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))

vi.mock('../../src/services/firebase.js', () => ({
  getDb: vi.fn(() => null),
  setDoc: vi.fn(),
  doc: vi.fn(),
}))

import { getActivityFeed, addActivity, generateSampleActivities } from '../../src/services/activityFeed.js'
import { getState } from '../../src/stores/state.js'
import { Storage } from '../../src/utils/storage.js'

describe('activityFeed', () => {
  beforeEach(() => {
    Storage._clear()
    vi.clearAllMocks()
  })

  describe('addActivity', () => {
    it('adds an activity with id and timestamp', () => {
      const result = addActivity({ type: 'new_spot', userId: 'u1' })
      expect(result.id).toMatch(/^activity_/)
      expect(result.timestamp).toBeDefined()
      expect(result.type).toBe('new_spot')
    })

    it('activity is retrievable after add', () => {
      addActivity({ type: 'new_spot', userId: 'u1' })
      const feed = getActivityFeed()
      expect(feed.length).toBe(1)
      expect(feed[0].type).toBe('new_spot')
    })

    it('newest first ordering', () => {
      addActivity({ type: 'new_spot', userId: 'u1' })
      addActivity({ type: 'review', userId: 'u2' })
      const feed = getActivityFeed()
      expect(feed[0].type).toBe('review')
      expect(feed[1].type).toBe('new_spot')
    })

    it('limits to 100 activities', () => {
      for (let i = 0; i < 110; i++) {
        addActivity({ type: 'new_spot', userId: `u${i}` })
      }
      const feed = getActivityFeed()
      expect(feed.length).toBe(100)
    })
  })

  describe('getActivityFeed', () => {
    it('returns empty array when no activities', () => {
      expect(getActivityFeed()).toEqual([])
    })

    it('filter "all" returns everything', () => {
      addActivity({ type: 'new_spot', userId: 'u1' })
      addActivity({ type: 'event_created', userId: 'u2' })
      expect(getActivityFeed('all').length).toBe(2)
    })

    it('filter "friends" returns only friend activities', () => {
      getState.mockReturnValue({
        friends: [{ id: 'friend1' }],
        userLocation: null,
        user: null,
      })
      addActivity({ type: 'new_spot', userId: 'friend1' })
      addActivity({ type: 'new_spot', userId: 'stranger' })
      const filtered = getActivityFeed('friends')
      expect(filtered.length).toBe(1)
      expect(filtered[0].userId).toBe('friend1')
    })

    it('filter "events" returns only event activities', () => {
      addActivity({ type: 'new_spot', userId: 'u1' })
      addActivity({ type: 'event_created', userId: 'u2' })
      addActivity({ type: 'event_joined', userId: 'u3' })
      const filtered = getActivityFeed('events')
      expect(filtered.length).toBe(2)
    })

    it('filter "nearby" returns activities within 50km', () => {
      getState.mockReturnValue({
        friends: [],
        userLocation: { lat: 48.8566, lng: 2.3522 }, // Paris
        user: null,
      })
      addActivity({ type: 'new_spot', userId: 'u1', location: { lat: 48.86, lng: 2.35 } }) // ~500m
      addActivity({ type: 'new_spot', userId: 'u2', location: { lat: 52.52, lng: 13.40 } }) // Berlin, far
      addActivity({ type: 'new_spot', userId: 'u3' }) // no location
      const filtered = getActivityFeed('nearby')
      expect(filtered.length).toBe(1)
      expect(filtered[0].userId).toBe('u1')
    })

    it('filter "nearby" returns empty when no user location', () => {
      getState.mockReturnValue({
        friends: [],
        userLocation: null,
        user: null,
      })
      addActivity({ type: 'new_spot', userId: 'u1', location: { lat: 48.86, lng: 2.35 } })
      expect(getActivityFeed('nearby')).toEqual([])
    })

    it('unknown filter returns all', () => {
      addActivity({ type: 'new_spot', userId: 'u1' })
      expect(getActivityFeed('unknown').length).toBe(1)
    })
  })

  describe('generateSampleActivities', () => {
    it('returns an array of sample activities', () => {
      const samples = generateSampleActivities()
      expect(Array.isArray(samples)).toBe(true)
      expect(samples.length).toBeGreaterThan(0)
    })

    it('each sample has required fields', () => {
      const samples = generateSampleActivities()
      samples.forEach(s => {
        expect(s.type).toBeDefined()
        expect(s.userId).toBeDefined()
        expect(s.userName).toBeDefined()
        expect(s.timestamp).toBeDefined()
      })
    })

    it('samples have diverse types', () => {
      const samples = generateSampleActivities()
      const types = new Set(samples.map(s => s.type))
      expect(types.size).toBeGreaterThan(3)
    })
  })
})
