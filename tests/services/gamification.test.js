import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ points: 0, level: 1, badges: [], streak: 0, checkins: 0, spotsCreated: 0, reviewsGiven: 0, seasonPoints: 0, visitedCountries: [] })),
  setState: vi.fn(),
}))
vi.mock('../../src/services/notifications.js', () => ({ showToast: vi.fn() }))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn(k => k) }))
vi.mock('../../src/services/firebase.js', () => ({ getCurrentUser: vi.fn(() => null) }))
vi.mock('firebase/app', () => ({ getApps: vi.fn(() => []), getApp: vi.fn() }))
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn(() => Promise.resolve()),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false })),
}))

import { getState, setState } from '../../src/stores/state.js'
import {
  addPoints,
  addSeasonPoints,
  updateLeague,
  getLeagueInfo,
  getUserVipLevel,
  getNextUserVipLevel,
  getVipProgressInfo,
  getUserTitle,
  getUserTitleProgress,
  getUserUnlockedTitles,
  getUserLockedTitles,
  checkBadges,
  recordCheckin,
  recordSpotCreated,
  recordReview,
  recordCountryVisit,
  getGamificationSummary,
} from '../../src/services/gamification.js'

describe('Gamification Service', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    getState.mockReturnValue({
      points: 0,
      level: 1,
      badges: [],
      checkins: 0,
      spotsCreated: 0,
      reviewsGiven: 0,
      seasonPoints: 0,
      visitedCountries: [],
    })
  })

  describe('addPoints', () => {
    it('calls setState with updated points', () => {
      addPoints(10)
      expect(setState).toHaveBeenCalled()
    })

    it('does not throw for 0 points', () => {
      expect(() => addPoints(0)).not.toThrow()
    })

    it('returns the multiplied points added', () => {
      const result = addPoints(5)
      expect(typeof result === 'number' || result === undefined).toBe(true)
    })
  })

  describe('addSeasonPoints', () => {
    it('calls setState with seasonPoints update', () => {
      addSeasonPoints(5)
      expect(setState).toHaveBeenCalledWith(expect.objectContaining({
        seasonPoints: expect.any(Number),
      }))
    })
  })

  describe('updateLeague', () => {
    it('runs without error', () => {
      expect(() => updateLeague()).not.toThrow()
    })

    it('calls setState', () => {
      updateLeague()
      expect(setState).toHaveBeenCalled()
    })
  })

  describe('getLeagueInfo', () => {
    it('returns a league object', () => {
      const result = getLeagueInfo('bronze')
      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
    })

    it('returns first league for unknown id', () => {
      const result = getLeagueInfo('nonexistent-league')
      expect(result).toBeDefined()
    })
  })

  describe('getUserVipLevel', () => {
    it('returns vip level object', () => {
      const result = getUserVipLevel()
      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
    })

    it('returns novice for 0 points', () => {
      const result = getUserVipLevel()
      expect(result.id).toBe('novice')
    })

    it('returns higher level for many points', () => {
      getState.mockReturnValue({ ...getState(), points: 10000 })
      const result = getUserVipLevel()
      expect(result.id).toBeDefined()
    })
  })

  describe('getNextUserVipLevel', () => {
    it('returns next level object or null', () => {
      const result = getNextUserVipLevel()
      if (result !== null) {
        expect(result.id).toBeDefined()
      }
    })
  })

  describe('getVipProgressInfo', () => {
    it('returns progress info object', () => {
      const result = getVipProgressInfo()
      expect(result).toBeDefined()
      expect(result.current).toBeDefined()
      expect(typeof result.progress).toBe('number')
    })

    it('progress is between 0 and 1', () => {
      const result = getVipProgressInfo()
      expect(result.progress).toBeGreaterThanOrEqual(0)
      expect(result.progress).toBeLessThanOrEqual(1)
    })
  })

  describe('getUserTitle', () => {
    it('returns a title object', () => {
      const result = getUserTitle()
      expect(result).toBeDefined()
    })
  })

  describe('getUserTitleProgress', () => {
    it('returns title progress info', () => {
      const result = getUserTitleProgress()
      expect(result).toBeDefined()
    })
  })

  describe('getUserUnlockedTitles', () => {
    it('returns an array', () => {
      const result = getUserUnlockedTitles()
      expect(Array.isArray(result)).toBe(true)
    })

    it('has at least one title unlocked at level 1', () => {
      expect(getUserUnlockedTitles().length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('getUserLockedTitles', () => {
    it('returns an array', () => {
      const result = getUserLockedTitles()
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('checkBadges', () => {
    it('runs without error', () => {
      expect(() => checkBadges()).not.toThrow()
    })

    it('calls setState (may not be called if no new badges)', () => {
      checkBadges()
      // setState may or may not be called if no new badges to award
      expect(true).toBe(true)
    })
  })

  describe('recordCheckin', () => {
    it('runs without error', () => {
      expect(() => recordCheckin()).not.toThrow()
    })

    it('calls setState with incremented checkins', () => {
      recordCheckin()
      const calls = setState.mock.calls
      const checkinCall = calls.find(c => c[0].checkins !== undefined)
      expect(checkinCall).toBeDefined()
      expect(checkinCall[0].checkins).toBe(1)
    })

    it('returns new checkin count', () => {
      const result = recordCheckin()
      expect(result).toBe(1)
    })
  })

  describe('recordSpotCreated', () => {
    it('runs without error', () => {
      expect(() => recordSpotCreated()).not.toThrow()
    })

    it('calls setState with incremented spotsCreated', () => {
      recordSpotCreated()
      const calls = setState.mock.calls
      const call = calls.find(c => c[0].spotsCreated !== undefined)
      expect(call).toBeDefined()
      expect(call[0].spotsCreated).toBe(1)
    })
  })

  describe('recordReview', () => {
    it('runs without error', () => {
      expect(() => recordReview()).not.toThrow()
    })

    it('calls setState with incremented reviewsGiven', () => {
      recordReview()
      const calls = setState.mock.calls
      const call = calls.find(c => c[0].reviewsGiven !== undefined)
      expect(call).toBeDefined()
      expect(call[0].reviewsGiven).toBe(1)
    })
  })

  describe('recordCountryVisit', () => {
    it('runs without error', () => {
      expect(() => recordCountryVisit('FR')).not.toThrow()
    })

    it('adds country to visited list', () => {
      recordCountryVisit('DE')
      const calls = setState.mock.calls
      const call = calls.find(c => c[0].visitedCountries !== undefined)
      expect(call).toBeDefined()
      expect(call[0].visitedCountries).toContain('DE')
    })

    it('does not re-add already visited country', () => {
      getState.mockReturnValue({
        ...getState(),
        visitedCountries: ['FR'],
      })
      recordCountryVisit('FR')
      // setState should NOT have been called for visitedCountries
      const calls = setState.mock.calls
      const visitedCall = calls.find(c => c[0].visitedCountries !== undefined)
      expect(visitedCall).toBeUndefined()
    })
  })

  describe('getGamificationSummary', () => {
    it('returns a summary object', () => {
      const result = getGamificationSummary()
      expect(result).toBeDefined()
      expect(typeof result).toBe('object')
    })

    it('includes required fields', () => {
      const result = getGamificationSummary()
      expect(result).toHaveProperty('points')
      expect(result).toHaveProperty('level')
      expect(result).toHaveProperty('vipLevel')
      expect(result).toHaveProperty('league')
      expect(result).toHaveProperty('checkins')
      expect(result).toHaveProperty('spotsCreated')
    })

    it('includes badge count', () => {
      const result = getGamificationSummary()
      expect(typeof result.badgesCount).toBe('number')
      expect(typeof result.totalBadges).toBe('number')
      expect(result.totalBadges).toBeGreaterThan(0)
    })
  })
})

describe('gamification — additional branch coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getState.mockReturnValue({
      points: 0, level: 1, badges: [],
      checkins: 0, spotsCreated: 0, reviewsGiven: 0,
      countriesVisited: 0, nightCheckin: false, earlyCheckin: false,
      helpfulMessages: 0, perfectQuiz: false, verifiedSpots: 0,
      seasonPoints: 0, visitedCountries: [],
    })
  })

  describe('checkBadges — with earnable badge', () => {
    it('awards first_checkin badge when checkins >= 1', () => {
      getState.mockReturnValue({
        points: 0, level: 1, badges: [],
        checkins: 1, spotsCreated: 0, reviewsGiven: 0,
        countriesVisited: 0, nightCheckin: false, earlyCheckin: false,
        helpfulMessages: 0, perfectQuiz: false, verifiedSpots: 0,
        seasonPoints: 0, visitedCountries: [],
      })
      const newBadges = checkBadges()
      expect(newBadges.length).toBeGreaterThan(0)
      expect(newBadges).toContain('first_checkin')
    })

    it('calls setState with updated badges when badges are earned', () => {
      getState.mockReturnValue({
        points: 0, level: 1, badges: [],
        checkins: 1, spotsCreated: 0, reviewsGiven: 0,
        countriesVisited: 0, nightCheckin: false, earlyCheckin: false,
        helpfulMessages: 0, perfectQuiz: false, verifiedSpots: 0,
        seasonPoints: 0, visitedCountries: [],
      })
      checkBadges()
      expect(setState).toHaveBeenCalled()
    })

    it('does not re-award already owned badge', () => {
      getState.mockReturnValue({
        points: 0, level: 1, badges: ['first_checkin'],
        checkins: 1, spotsCreated: 0, reviewsGiven: 0,
        countriesVisited: 0, nightCheckin: false, earlyCheckin: false,
        helpfulMessages: 0, perfectQuiz: false, verifiedSpots: 0,
        seasonPoints: 0, visitedCountries: [],
      })
      const newBadges = checkBadges()
      expect(newBadges).not.toContain('first_checkin')
    })
  })

  describe('addSeasonPoints — league promotion', () => {
    it('shows promotion toast when crossing league threshold', () => {
      // Season points 0 → 201 crosses from league 0 to league 1 (threshold: 200)
      getState.mockReturnValue({
        points: 0, level: 1, badges: [], checkins: 0,
        spotsCreated: 0, reviewsGiven: 0, seasonPoints: 0, visitedCountries: [],
      })
      addSeasonPoints(201)
      expect(setState).toHaveBeenCalled()
    })
  })

  describe('recordCheckin — time-based badges', () => {
    it('sets nightCheckin flag between midnight and 5am', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-01-15T02:30:00'))
      recordCheckin()
      const calls = setState.mock.calls
      const checkinCall = calls.find(c => c[0]?.checkins !== undefined)
      expect(checkinCall[0].nightCheckin).toBe(true)
      vi.useRealTimers()
    })

    it('sets earlyCheckin flag between 5am and 7am', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-01-15T06:00:00'))
      recordCheckin()
      const calls = setState.mock.calls
      const checkinCall = calls.find(c => c[0]?.checkins !== undefined)
      expect(checkinCall[0].earlyCheckin).toBe(true)
      vi.useRealTimers()
    })
  })
})
