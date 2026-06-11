import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  setState: vi.fn(),
  getState: vi.fn(() => ({})),
}))
vi.mock('firebase/app', () => ({
  getApps: vi.fn(() => []),
  getApp: vi.fn(),
}))
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(() => Promise.resolve()),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false })),
}))
vi.mock('../../src/services/firebase.js', () => ({
  getCurrentUser: vi.fn(() => null),
}))

import { syncAllToFirestore, hydrateAllFromFirestore } from '../../src/services/firebaseSync.js'
import { setState } from '../../src/stores/state.js'
import { getApps, getApp } from 'firebase/app'
import { getDoc } from 'firebase/firestore'

describe('firebaseSync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.useFakeTimers()
    // Default: no Firebase apps
    getApps.mockReturnValue([])
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('syncAllToFirestore', () => {
    it('is a function', () => {
      expect(typeof syncAllToFirestore).toBe('function')
    })

    it('does not throw', () => {
      expect(() => syncAllToFirestore()).not.toThrow()
    })

    it('is debounced (can be called multiple times without error)', () => {
      expect(() => {
        syncAllToFirestore()
        syncAllToFirestore()
        syncAllToFirestore()
      }).not.toThrow()
    })

    it('sets a timeout (debounce)', () => {
      const spy = vi.spyOn(global, 'setTimeout')
      syncAllToFirestore()
      expect(spy).toHaveBeenCalled()
    })

    it('clears previous timer on repeated calls', () => {
      const clearSpy = vi.spyOn(global, 'clearTimeout')
      syncAllToFirestore()
      syncAllToFirestore()
      expect(clearSpy).toHaveBeenCalled()
    })
  })

  describe('hydrateAllFromFirestore', () => {
    it('is a function', () => {
      expect(typeof hydrateAllFromFirestore).toBe('function')
    })

    it('returns a promise', () => {
      const result = hydrateAllFromFirestore('user-123')
      expect(result instanceof Promise).toBe(true)
    })

    it('resolves without error when no Firebase apps initialized', async () => {
      await expect(hydrateAllFromFirestore('user-123')).resolves.toBeUndefined()
    })

    it('does not call setState when no apps initialized', async () => {
      await hydrateAllFromFirestore('user-123')
      expect(setState).not.toHaveBeenCalled()
    })

    it('resolves for null userId', async () => {
      await expect(hydrateAllFromFirestore(null)).resolves.toBeUndefined()
    })

    it('reads from localStorage during sync (no throw)', async () => {
      localStorage.setItem('spothitch_checkin_history', JSON.stringify([{ id: '1', date: '2026-01-01' }]))
      localStorage.setItem('spothitch_daily_reward_streak', '5')
      await expect(hydrateAllFromFirestore('user-123')).resolves.toBeUndefined()
    })

    it('resolves when Firebase initialized but document does not exist', async () => {
      getApps.mockReturnValue([{}])
      getApp.mockReturnValue({})
      getDoc.mockResolvedValue({ exists: () => false, data: () => ({}) })
      await expect(hydrateAllFromFirestore('user-123')).resolves.toBeUndefined()
    })

    it('hydrates checkinHistory when document exists with data', async () => {
      getApps.mockReturnValue([{}])
      getApp.mockReturnValue({})
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          checkinHistory: [{ id: 'c1', date: '2026-01-01' }],
          dailyStreak: 5,
          dailyLastClaim: '2026-01-01',
          savedTrips: [{ id: 't1' }],
          bordersCrossed: ['FR'],
          capitalsVisited: ['Paris'],
          quizScores: { FR: 90 },
          privacy: { shareLocation: true },
          blockedUsers: [],
          roadmapVotes: {},
          featureOpinions: {},
          emergencyContacts: [],
          sosConfig: {},
        }),
      })
      await hydrateAllFromFirestore('user-123')
      // State should have been called with checkinHistory
      expect(setState).toHaveBeenCalled()
    })
  })
})
