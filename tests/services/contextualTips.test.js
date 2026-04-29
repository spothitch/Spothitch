import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/utils/storage.js', () => {
  const store = {}
  return {
    Storage: {
      get: vi.fn((key) => store[key] || null),
      set: vi.fn((key, value) => { store[key] = value }),
      remove: vi.fn((key) => { delete store[key] }),
      _store: store,
      _clear: () => { Object.keys(store).forEach(k => delete store[k]) },
    },
  }
})

vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg>${name}</svg>`),
}))
vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))

import {
  TIPS,
  getSeenTips,
  hasTipBeenSeen,
  markTipSeen,
  shouldShowTip,
  showTip,
  getCurrentTip,
  dismissTip,
  getTipsProgress,
} from '../../src/services/contextualTips.js'
import { Storage } from '../../src/utils/storage.js'

describe('contextualTips', () => {
  beforeEach(() => {
    Storage._clear()
    // Reset current tip state by dismissing
    while (getCurrentTip()) dismissTip()
  })

  describe('TIPS', () => {
    it('defines 8 tips', () => {
      expect(Object.keys(TIPS).length).toBe(8)
    })

    it('each tip has id, message, icon, color', () => {
      Object.values(TIPS).forEach(tip => {
        expect(tip.id).toBeDefined()
        expect(tip.message).toBeDefined()
        expect(tip.icon).toBeDefined()
        expect(tip.color).toBeDefined()
      })
    })
  })

  describe('getSeenTips', () => {
    it('returns empty array initially', () => {
      expect(getSeenTips()).toEqual([])
    })

    it('returns stored seen tips', () => {
      Storage.set('contextual_tips_seen', ['first_checkin'])
      expect(getSeenTips()).toEqual(['first_checkin'])
    })
  })

  describe('hasTipBeenSeen', () => {
    it('returns false for unseen tip', () => {
      expect(hasTipBeenSeen('first_checkin')).toBe(false)
    })

    it('returns true for seen tip', () => {
      markTipSeen('first_checkin')
      expect(hasTipBeenSeen('first_checkin')).toBe(true)
    })
  })

  describe('markTipSeen', () => {
    it('marks a tip as seen', () => {
      markTipSeen('first_checkin')
      expect(getSeenTips()).toContain('first_checkin')
    })

    it('does not duplicate seen tips', () => {
      markTipSeen('first_checkin')
      markTipSeen('first_checkin')
      expect(getSeenTips().filter(t => t === 'first_checkin').length).toBe(1)
    })

    it('can mark multiple tips', () => {
      markTipSeen('first_checkin')
      markTipSeen('first_badge')
      expect(getSeenTips()).toContain('first_checkin')
      expect(getSeenTips()).toContain('first_badge')
    })
  })

  describe('shouldShowTip', () => {
    it('returns true for unseen tip', () => {
      expect(shouldShowTip('first_checkin')).toBe(true)
    })

    it('returns false for seen tip', () => {
      markTipSeen('first_checkin')
      expect(shouldShowTip('first_checkin')).toBe(false)
    })
  })

  describe('showTip', () => {
    it('returns true for unseen tip', () => {
      expect(showTip('first_checkin')).toBe(true)
    })

    it('returns false for already seen tip', () => {
      markTipSeen('first_checkin')
      expect(showTip('first_checkin')).toBe(false)
    })

    it('returns false for unknown tip id', () => {
      expect(showTip('nonexistent')).toBe(false)
    })

    it('sets current tip', () => {
      showTip('first_checkin')
      const current = getCurrentTip()
      expect(current).toBeDefined()
      expect(current.id).toBe('first_checkin')
    })
  })

  describe('dismissTip', () => {
    it('marks current tip as seen', () => {
      showTip('first_checkin')
      dismissTip()
      expect(hasTipBeenSeen('first_checkin')).toBe(true)
    })

    it('clears current tip', () => {
      showTip('first_checkin')
      dismissTip()
      expect(getCurrentTip()).toBeNull()
    })

    it('no-op when no current tip', () => {
      dismissTip() // should not throw
    })
  })

  describe('getTipsProgress', () => {
    it('returns correct initial progress', () => {
      const progress = getTipsProgress()
      expect(progress.seen).toBe(0)
      expect(progress.total).toBe(8)
      expect(progress.remaining).toBe(8)
      expect(progress.percentage).toBe(0)
    })

    it('updates after seeing tips', () => {
      markTipSeen('first_checkin')
      markTipSeen('first_badge')
      const progress = getTipsProgress()
      expect(progress.seen).toBe(2)
      expect(progress.remaining).toBe(6)
      expect(progress.percentage).toBe(25)
    })
  })
})
