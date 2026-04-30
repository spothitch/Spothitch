import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))

import { getTimeAgo, getFreshnessLevel, getFreshnessBadge } from '../../src/utils/dateHelpers.js'

describe('DateHelpers', () => {
  describe('getTimeAgo', () => {
    it('returns a string for recent date', () => {
      const result = getTimeAgo(new Date().toISOString())
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('returns a string for old date', () => {
      const result = getTimeAgo('2020-01-01')
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('returns something for null', () => {
      const result = getTimeAgo(null)
      // May return null, empty string, or a default string
      expect(result !== undefined).toBe(true)
    })
  })

  describe('getFreshnessLevel', () => {
    it('returns a level string for recent date', () => {
      const level = getFreshnessLevel(new Date().toISOString())
      expect(typeof level).toBe('string')
      expect(level.length).toBeGreaterThan(0)
    })

    it('returns a different level for old date', () => {
      const recent = getFreshnessLevel(new Date().toISOString())
      const old = getFreshnessLevel('2020-01-01')
      expect(typeof old).toBe('string')
      // Old date should get a different (worse) level than recent
      expect(old).not.toBe(recent)
    })

    it('returns unverified for null', () => {
      const level = getFreshnessLevel(null)
      expect(level).toBe('unverified')
    })
  })

  describe('getFreshnessBadge', () => {
    it('returns badge object with icon and colors for active level', () => {
      const badge = getFreshnessBadge('active')
      expect(badge).toHaveProperty('icon')
      expect(badge).toHaveProperty('iconColor')
      expect(badge).toHaveProperty('bgColor')
      expect(badge.iconColor).toContain('text-')
    })

    it('returns badge object for unverified level', () => {
      const badge = getFreshnessBadge('unverified')
      expect(badge).toHaveProperty('icon')
      expect(badge).toHaveProperty('iconColor')
    })
  })
})
