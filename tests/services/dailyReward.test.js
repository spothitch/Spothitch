import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({
    dailyRewardStreak: 0,
    lastDailyRewardClaim: null,
    dailyRewardProtection: false,
    dailyRewardsHistory: [],
  })),
  setState: vi.fn(),
}))

vi.mock('../../src/services/notifications.js', () => ({
  showToast: vi.fn(),
}))

vi.mock('../../src/services/gamification.js', () => ({
  addPoints: vi.fn(),
  addSeasonPoints: vi.fn(),
}))

vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))

import {
  DAILY_REWARDS,
  getDailyRewardInfo,
  canClaimReward,
  claimReward,
  getRewardsCalendar,
} from '../../src/services/dailyReward.js'
import { getState } from '../../src/stores/state.js'

describe('dailyReward', () => {
  beforeEach(() => {
    getState.mockReturnValue({
      dailyRewardStreak: 0,
      lastDailyRewardClaim: null,
      dailyRewardProtection: false,
      dailyRewardsHistory: [],
    })
  })

  describe('DAILY_REWARDS', () => {
    it('defines 7 days', () => {
      expect(DAILY_REWARDS.length).toBe(7)
    })

    it('day 7 is mystery reward', () => {
      const day7 = DAILY_REWARDS.find(r => r.day === 7)
      expect(day7.isMystery).toBe(true)
      expect(day7.points).toBeNull()
    })

    it('points increase each day (except day 7)', () => {
      for (let i = 0; i < 5; i++) {
        expect(DAILY_REWARDS[i + 1].points).toBeGreaterThan(DAILY_REWARDS[i].points)
      }
    })
  })

  describe('getDailyRewardInfo', () => {
    it('returns initial state', () => {
      const info = getDailyRewardInfo()
      expect(info.currentDay).toBe(1)
      expect(info.totalStreak).toBe(0)
      expect(info.claimedToday).toBe(false)
      expect(info.streakBroken).toBe(false)
    })

    it('detects claimed today', () => {
      getState.mockReturnValue({
        dailyRewardStreak: 1,
        lastDailyRewardClaim: new Date().toISOString(),
        dailyRewardProtection: false,
        dailyRewardsHistory: [],
      })
      const info = getDailyRewardInfo()
      expect(info.claimedToday).toBe(true)
    })

    it('detects broken streak', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString()
      getState.mockReturnValue({
        dailyRewardStreak: 3,
        lastDailyRewardClaim: twoDaysAgo,
        dailyRewardProtection: false,
        dailyRewardsHistory: [],
      })
      const info = getDailyRewardInfo()
      expect(info.streakBroken).toBe(true)
    })

    it('streak not broken if claimed yesterday', () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString()
      getState.mockReturnValue({
        dailyRewardStreak: 3,
        lastDailyRewardClaim: yesterday,
        dailyRewardProtection: false,
        dailyRewardsHistory: [],
      })
      const info = getDailyRewardInfo()
      expect(info.streakBroken).toBe(false)
    })

    it('cycles day back to 1 after 7', () => {
      getState.mockReturnValue({
        dailyRewardStreak: 7,
        lastDailyRewardClaim: null,
        dailyRewardProtection: false,
        dailyRewardsHistory: [],
      })
      const info = getDailyRewardInfo()
      expect(info.currentDay).toBe(1) // 7 % 7 + 1 = 1
    })
  })

  describe('canClaimReward', () => {
    it('returns true when not claimed today', () => {
      expect(canClaimReward()).toBe(true)
    })

    it('returns false when already claimed today', () => {
      getState.mockReturnValue({
        dailyRewardStreak: 1,
        lastDailyRewardClaim: new Date().toISOString(),
        dailyRewardProtection: false,
        dailyRewardsHistory: [],
      })
      expect(canClaimReward()).toBe(false)
    })
  })

  describe('claimReward', () => {
    it('returns success false when already claimed today', () => {
      getState.mockReturnValue({
        dailyRewardStreak: 1,
        lastDailyRewardClaim: new Date().toISOString(),
        dailyRewardProtection: false,
        dailyRewardsHistory: [],
      })
      const result = claimReward()
      expect(result.success).toBe(false)
    })

    it('returns success true on fresh claim', () => {
      getState.mockReturnValue({
        dailyRewardStreak: 0,
        lastDailyRewardClaim: null,
        dailyRewardProtection: false,
        dailyRewardsHistory: [],
        badges: [],
      })
      const result = claimReward()
      expect(result.success).toBe(true)
    })

    it('returns points earned', () => {
      getState.mockReturnValue({
        dailyRewardStreak: 0,
        lastDailyRewardClaim: null,
        dailyRewardProtection: false,
        dailyRewardsHistory: [],
        badges: [],
      })
      const result = claimReward()
      expect(typeof result.points).toBe('number')
      expect(result.points).toBeGreaterThan(0)
    })

    it('returns day 1 on first claim', () => {
      getState.mockReturnValue({
        dailyRewardStreak: 0,
        lastDailyRewardClaim: null,
        dailyRewardProtection: false,
        dailyRewardsHistory: [],
        badges: [],
      })
      const result = claimReward()
      expect(result.day).toBe(1)
    })

    it('increments streak on consecutive claim', () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString()
      getState.mockReturnValue({
        dailyRewardStreak: 1,
        lastDailyRewardClaim: yesterday,
        dailyRewardProtection: false,
        dailyRewardsHistory: [],
        badges: [],
      })
      const result = claimReward()
      expect(result.success).toBe(true)
      expect(result.newStreak).toBe(2)
    })

    it('resets streak when broken without protection', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString()
      getState.mockReturnValue({
        dailyRewardStreak: 5,
        lastDailyRewardClaim: twoDaysAgo,
        dailyRewardProtection: false,
        dailyRewardsHistory: [],
        badges: [],
      })
      const result = claimReward()
      expect(result.newStreak).toBe(1)
    })
  })

  describe('getRewardsCalendar', () => {
    it('returns array of 7 rewards', () => {
      const calendar = getRewardsCalendar()
      expect(Array.isArray(calendar)).toBe(true)
      expect(calendar.length).toBe(7)
    })

    it('each item has claimed, current, locked fields', () => {
      const calendar = getRewardsCalendar()
      calendar.forEach(item => {
        expect('claimed' in item).toBe(true)
        expect('current' in item).toBe(true)
        expect('locked' in item).toBe(true)
      })
    })

    it('day 1 is current when streak=0', () => {
      const calendar = getRewardsCalendar()
      const day1 = calendar.find(r => r.day === 1)
      expect(day1.current).toBe(true)
    })
  })
})
