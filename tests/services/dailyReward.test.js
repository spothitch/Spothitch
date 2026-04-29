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
})
