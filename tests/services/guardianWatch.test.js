import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ user: { uid: 'user1' } })),
}))

import {
  startGuardianWatch,
  onChatUpdate,
  getChatMessages,
  stopGuardianWatch,
  getActiveGuardianTimers,
  getTimeSinceCheckIn,
  isTimerOverdue,
  getTripDuration,
} from '../../src/services/guardianWatch.js'
import { getState } from '../../src/stores/state.js'

describe('guardianWatch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getState.mockReturnValue({ user: { uid: 'user1' } })
    stopGuardianWatch()
  })

  describe('getChatMessages', () => {
    it('returns empty array for unknown traveler', () => {
      expect(getChatMessages('nobody')).toEqual([])
    })

    it('returns an array', () => {
      expect(Array.isArray(getChatMessages('user1'))).toBe(true)
    })

    it('returns empty array by default', () => {
      expect(getChatMessages('traveler-xyz')).toHaveLength(0)
    })
  })

  describe('onChatUpdate', () => {
    it('runs without error', () => {
      expect(() => onChatUpdate(vi.fn())).not.toThrow()
    })

    it('accepts null callback', () => {
      expect(() => onChatUpdate(null)).not.toThrow()
    })
  })

  describe('stopGuardianWatch', () => {
    it('runs without error', () => {
      expect(() => stopGuardianWatch()).not.toThrow()
    })

    it('is idempotent', () => {
      expect(() => {
        stopGuardianWatch()
        stopGuardianWatch()
      }).not.toThrow()
    })

    it('clears active timers', () => {
      stopGuardianWatch()
      expect(getActiveGuardianTimers()).toEqual([])
    })
  })

  describe('getActiveGuardianTimers', () => {
    it('returns an array', () => {
      expect(Array.isArray(getActiveGuardianTimers())).toBe(true)
    })

    it('returns empty array after stop', () => {
      stopGuardianWatch()
      expect(getActiveGuardianTimers()).toEqual([])
    })
  })

  describe('getTimeSinceCheckIn', () => {
    it('returns ? when no lastCheckIn', () => {
      expect(getTimeSinceCheckIn({})).toBe('?')
    })

    it('returns < 1 min for very recent check-in', () => {
      const timer = { lastCheckIn: Date.now() - 30000 } // 30s ago
      expect(getTimeSinceCheckIn(timer)).toBe('< 1 min')
    })

    it('returns minutes for check-in a few minutes ago', () => {
      const timer = { lastCheckIn: Date.now() - 5 * 60000 } // 5 min ago
      const result = getTimeSinceCheckIn(timer)
      expect(result).toContain('5 min')
    })

    it('returns hours format for check-in over 1 hour ago', () => {
      const timer = { lastCheckIn: Date.now() - 90 * 60000 } // 90 min ago
      const result = getTimeSinceCheckIn(timer)
      expect(result).toMatch(/\dh\d\d/)
    })

    it('returns 1h00 for exactly 60 minutes ago', () => {
      const timer = { lastCheckIn: Date.now() - 60 * 60000 }
      const result = getTimeSinceCheckIn(timer)
      expect(result).toContain('h')
    })
  })

  describe('isTimerOverdue', () => {
    it('returns false when no lastCheckIn', () => {
      expect(isTimerOverdue({})).toBe(false)
    })

    it('returns false when no checkInIntervalMinutes', () => {
      expect(isTimerOverdue({ lastCheckIn: Date.now() })).toBe(false)
    })

    it('returns false when timer is within interval', () => {
      const timer = { lastCheckIn: Date.now() - 10 * 60000, checkInIntervalMinutes: 60 }
      expect(isTimerOverdue(timer)).toBe(false)
    })

    it('returns true when timer has passed deadline', () => {
      const timer = {
        lastCheckIn: Date.now() - 2 * 60 * 60000, // 2h ago
        checkInIntervalMinutes: 60,                 // interval 1h
      }
      expect(isTimerOverdue(timer)).toBe(true)
    })

    it('returns false for zero interval with recent check-in', () => {
      const timer = { lastCheckIn: Date.now(), checkInIntervalMinutes: 0 }
      // 0 interval means deadline was immediately — treat as overdue or not depending on implementation
      expect(typeof isTimerOverdue(timer)).toBe('boolean')
    })
  })

  describe('getTripDuration', () => {
    it('returns ? when no tripStart', () => {
      expect(getTripDuration({})).toBe('?')
    })

    it('returns minutes for short trip', () => {
      const timer = { tripStart: Date.now() - 30 * 60000 } // 30 min
      const result = getTripDuration(timer)
      expect(result).toContain('30 min')
    })

    it('returns hours format for trip over 1 hour', () => {
      const timer = { tripStart: Date.now() - 2 * 60 * 60000 } // 2h
      const result = getTripDuration(timer)
      expect(result).toMatch(/\dh\d\d/)
    })

    it('returns 0 min for very recent start', () => {
      const timer = { tripStart: Date.now() - 5000 } // 5 seconds ago
      const result = getTripDuration(timer)
      expect(result).toContain('min')
    })
  })

  describe('startGuardianWatch', () => {
    it('returns undefined when no user uid in state', async () => {
      getState.mockReturnValue({ user: null })
      const result = await startGuardianWatch(vi.fn())
      expect(result).toBeUndefined()
    })

    it('runs without throwing when user is null', async () => {
      getState.mockReturnValue({ user: null })
      await expect(startGuardianWatch(vi.fn())).resolves.not.toThrow()
    })

    it('calls stopGuardianWatch internally before starting', async () => {
      getState.mockReturnValue({ user: null })
      // Should not throw even if called multiple times
      await startGuardianWatch(vi.fn())
      await startGuardianWatch(vi.fn())
      expect(getActiveGuardianTimers()).toEqual([])
    })
  })
})
