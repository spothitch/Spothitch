import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({
    profileFrame: 'default',
    profileTitle: 'hitchhiker',
    unlockedFrames: ['default'],
    unlockedTitles: ['hitchhiker'],
  })),
  setState: vi.fn(),
}))
vi.mock('../../src/services/notifications.js', () => ({ showToast: vi.fn() }))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))
vi.mock('../../src/utils/sanitize.js', () => ({ escapeHTML: vi.fn((s) => s) }))

import {
  PROFILE_FRAMES,
  PROFILE_TITLES,
  getUnlockedFrames,
  getUnlockedTitles,
  getCurrentFrame,
  getCurrentTitle,
  getCurrencyForCountry,
  checkUnlocks,
} from '../../src/services/profileCustomization.js'
import { getState } from '../../src/stores/state.js'

describe('profileCustomization', () => {
  describe('PROFILE_FRAMES', () => {
    it('has at least 5 frames', () => {
      expect(Object.keys(PROFILE_FRAMES).length).toBeGreaterThanOrEqual(5)
    })
    it('each frame has id, rarity, unlockMethod', () => {
      Object.values(PROFILE_FRAMES).forEach(f => {
        expect(f.id).toBeDefined()
        expect(f.rarity).toBeDefined()
        expect(f.unlockMethod).toBeDefined()
      })
    })
    it('default frame exists', () => {
      expect(PROFILE_FRAMES.default).toBeDefined()
      expect(PROFILE_FRAMES.default.rarity).toBe('common')
    })
  })

  describe('PROFILE_TITLES', () => {
    it('has at least 5 titles', () => {
      expect(Object.keys(PROFILE_TITLES).length).toBeGreaterThanOrEqual(5)
    })
    it('default title is hitchhiker', () => {
      expect(PROFILE_TITLES.hitchhiker).toBeDefined()
    })
  })

  describe('getUnlockedFrames', () => {
    it('returns array from state', () => {
      const frames = getUnlockedFrames()
      expect(Array.isArray(frames)).toBe(true)
      expect(frames).toContain('default')
    })
  })

  describe('getUnlockedTitles', () => {
    it('returns array from state', () => {
      const titles = getUnlockedTitles()
      expect(Array.isArray(titles)).toBe(true)
    })
  })

  describe('getCurrentFrame', () => {
    it('returns current frame id', () => {
      expect(getCurrentFrame()).toBe('default')
    })
  })

  describe('getCurrentTitle', () => {
    it('returns current title id', () => {
      expect(getCurrentTitle()).toBe('hitchhiker')
    })
  })

  describe('checkUnlocks', () => {
    it('does not throw with valid stats', () => {
      expect(() => checkUnlocks({
        level: 10,
        friendsCount: 15,
        spotsCreated: 20,
        totalDistance: 1000,
        countriesCount: 5,
        reviewsCount: 50,
        trustScore: 90,
        accountAgeDays: 400,
      })).not.toThrow()
    })
    it('does not throw with empty stats', () => {
      expect(() => checkUnlocks({})).not.toThrow()
    })
  })
})
