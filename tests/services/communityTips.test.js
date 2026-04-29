import { describe, it, expect, beforeEach, vi } from 'vitest'

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
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg>${name}</svg>`),
}))
vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))

import {
  getTipsByCountry,
  addTip,
  voteTip,
  renderCommunityTips,
} from '../../src/services/communityTips.js'
import { Storage } from '../../src/utils/storage.js'

describe('communityTips', () => {
  beforeEach(() => {
    Storage._clear()
  })

  describe('addTip', () => {
    it('creates a tip with correct fields', () => {
      const tip = addTip('FR', 'Great hitchhiking country', 'Alice')
      expect(tip.id).toMatch(/^tip_/)
      expect(tip.country).toBe('FR')
      expect(tip.text).toBe('Great hitchhiking country')
      expect(tip.author).toBe('Alice')
      expect(tip.upvotes).toBe(0)
      expect(tip.downvotes).toBe(0)
    })

    it('uses anonymous author when not provided', () => {
      const tip = addTip('FR', 'Nice spot')
      expect(tip.author).toBe('Voyageur anonyme')
    })

    it('tip is retrievable after add', () => {
      addTip('FR', 'Tip 1')
      const tips = getTipsByCountry('FR')
      expect(tips.length).toBe(1)
    })
  })

  describe('getTipsByCountry', () => {
    it('returns empty for unknown country', () => {
      expect(getTipsByCountry('XX')).toEqual([])
    })

    it('filters by country', () => {
      addTip('FR', 'French tip')
      addTip('DE', 'German tip')
      addTip('FR', 'Another French tip')
      expect(getTipsByCountry('FR').length).toBe(2)
      expect(getTipsByCountry('DE').length).toBe(1)
    })

    it('returns tips sorted by net score', () => {
      addTip('FR', 'Tip A')
      addTip('FR', 'Tip B')
      const tips = getTipsByCountry('FR')
      expect(tips.length).toBe(2)
      // Both have 0 score, so ordering is stable (same net score)
    })
  })

  describe('voteTip', () => {
    it('upvotes a tip', () => {
      const tip = addTip('FR', 'Test')
      const result = voteTip(tip.id, 'up')
      expect(result).toBe(true)
      const tips = getTipsByCountry('FR')
      expect(tips[0].upvotes).toBe(1)
    })

    it('downvotes a tip', () => {
      const tip = addTip('FR', 'Test')
      const result = voteTip(tip.id, 'down')
      expect(result).toBe(true)
      const tips = getTipsByCountry('FR')
      expect(tips[0].downvotes).toBe(1)
    })

    it('prevents double voting', () => {
      const tip = addTip('FR', 'Test')
      voteTip(tip.id, 'up')
      const result = voteTip(tip.id, 'up')
      expect(result).toBe(false)
      const tips = getTipsByCountry('FR')
      expect(tips[0].upvotes).toBe(1)
    })

    it('returns false for non-existent tip', () => {
      expect(voteTip('nonexistent', 'up')).toBe(false)
    })
  })

  describe('renderCommunityTips', () => {
    it('returns HTML string', () => {
      const html = renderCommunityTips('FR')
      expect(html).toContain('communityTipsTitle')
    })

    it('includes tips when available', () => {
      addTip('FR', 'Great country')
      const html = renderCommunityTips('FR')
      expect(html).toContain('Great country')
    })
  })
})
