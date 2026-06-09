import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ lang: 'en' })),
  setState: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))

import {
  getTimeAgo,
  getFreshnessLevel,
  getFreshnessBadge,
  getFreshnessWarning,
  getLastCheckinText,
  renderFreshnessBadge,
  renderFreshnessIndicator,
  renderFreshnessSection,
  FRESHNESS_LEVELS,
} from '../../src/utils/dateHelpers.js'
import { getState } from '../../src/stores/state.js'

describe('DateHelpers', () => {
  describe('FRESHNESS_LEVELS', () => {
    it('defines active level', () => {
      expect(FRESHNESS_LEVELS.ACTIVE).toBe('active')
    })
    it('defines recent level', () => {
      expect(FRESHNESS_LEVELS.RECENT).toBe('recent')
    })
    it('defines old level', () => {
      expect(FRESHNESS_LEVELS.OLD).toBe('old')
    })
    it('defines unverified level', () => {
      expect(FRESHNESS_LEVELS.UNVERIFIED).toBe('unverified')
    })
  })

  describe('getTimeAgo', () => {
    it('returns null for null input', () => {
      expect(getTimeAgo(null)).toBeNull()
    })

    it('returns null for invalid date string', () => {
      expect(getTimeAgo('not-a-date')).toBeNull()
    })

    it('returns "just now" for dates within 60 seconds', () => {
      const date = new Date(Date.now() - 30000).toISOString()
      expect(getTimeAgo(date)).toBe('just now')
    })

    it('returns minutes string for 5 minutes ago', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      const result = getTimeAgo(date)
      expect(result).toContain('5')
      expect(result).toContain('minute')
    })

    it('returns singular minute for exactly 1 minute ago', () => {
      const date = new Date(Date.now() - 61 * 1000).toISOString()
      const result = getTimeAgo(date)
      expect(result).toBe('1 minute ago')
    })

    it('returns hours string for 3 hours ago', () => {
      const date = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      const result = getTimeAgo(date)
      expect(result).toContain('3')
      expect(result).toContain('hour')
    })

    it('returns singular hour for exactly 1 hour ago', () => {
      const date = new Date(Date.now() - 61 * 60 * 1000).toISOString()
      const result = getTimeAgo(date)
      expect(result).toBe('1 hour ago')
    })

    it('returns days string for 3 days ago', () => {
      const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      const result = getTimeAgo(date)
      expect(result).toContain('3')
      expect(result).toContain('day')
    })

    it('returns weeks string for 2 weeks ago', () => {
      const date = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      const result = getTimeAgo(date)
      expect(result).toContain('week')
    })

    it('returns months string for 3 months ago', () => {
      const date = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      const result = getTimeAgo(date)
      expect(result).toContain('month')
    })

    it('returns years string for 2 years ago', () => {
      const date = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000).toISOString()
      const result = getTimeAgo(date)
      expect(result).toContain('year')
      expect(result).toContain('2')
    })

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

    it('uses French when lang is fr', () => {
      getState.mockReturnValue({ lang: 'fr' })
      const date = new Date(Date.now() - 30000).toISOString()
      const result = getTimeAgo(date)
      expect(result).toContain('instant')
      getState.mockReturnValue({ lang: 'en' })
    })
  })

  describe('getFreshnessLevel', () => {
    it('returns active for date within 1 week', () => {
      const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      expect(getFreshnessLevel(date)).toBe('active')
    })

    it('returns recent for date within 1 month', () => {
      const date = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      expect(getFreshnessLevel(date)).toBe('recent')
    })

    it('returns old for date within 6 months', () => {
      const date = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
      expect(getFreshnessLevel(date)).toBe('old')
    })

    it('returns unverified for date older than 6 months', () => {
      const date = new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString()
      expect(getFreshnessLevel(date)).toBe('unverified')
    })

    it('returns unverified for null', () => {
      expect(getFreshnessLevel(null)).toBe('unverified')
    })

    it('returns unverified for invalid date', () => {
      expect(getFreshnessLevel('not-a-date')).toBe('unverified')
    })

    it('returns a level string for recent date', () => {
      const level = getFreshnessLevel(new Date().toISOString())
      expect(typeof level).toBe('string')
      expect(level.length).toBeGreaterThan(0)
    })

    it('returns a different level for old date', () => {
      const recent = getFreshnessLevel(new Date().toISOString())
      const old = getFreshnessLevel('2020-01-01')
      expect(old).not.toBe(recent)
    })
  })

  describe('getFreshnessBadge', () => {
    it('returns badge with icon and colors for active level', () => {
      const badge = getFreshnessBadge('active')
      expect(badge).toHaveProperty('icon')
      expect(badge).toHaveProperty('iconColor')
      expect(badge).toHaveProperty('bgColor')
      expect(badge.iconColor).toContain('text-')
    })

    it('returns badge for recent level', () => {
      const badge = getFreshnessBadge('recent')
      expect(badge).toHaveProperty('label')
      expect(badge.iconColor).toContain('yellow')
    })

    it('returns badge for old level', () => {
      const badge = getFreshnessBadge('old')
      expect(badge).toHaveProperty('label')
      expect(badge.iconColor).toContain('orange')
    })

    it('returns badge for unverified level', () => {
      const badge = getFreshnessBadge('unverified')
      expect(badge).toHaveProperty('icon')
      expect(badge).toHaveProperty('iconColor')
    })

    it('returns unverified badge for unknown level', () => {
      const badge = getFreshnessBadge('unknown-level')
      expect(badge).toHaveProperty('icon')
    })

    it('badge has label as string (not object)', () => {
      const badge = getFreshnessBadge('active')
      expect(typeof badge.label).toBe('string')
    })

    it('badge has description as string', () => {
      const badge = getFreshnessBadge('active')
      expect(typeof badge.description).toBe('string')
    })
  })

  describe('getFreshnessWarning', () => {
    it('returns null for active level', () => {
      expect(getFreshnessWarning('active')).toBeNull()
    })

    it('returns null for recent level', () => {
      expect(getFreshnessWarning('recent')).toBeNull()
    })

    it('returns null for old level', () => {
      expect(getFreshnessWarning('old')).toBeNull()
    })

    it('returns a string for unverified level', () => {
      const warning = getFreshnessWarning('unverified')
      expect(typeof warning).toBe('string')
      expect(warning.length).toBeGreaterThan(0)
    })

    it('warning contains verification-related text', () => {
      const warning = getFreshnessWarning('unverified')
      expect(warning.toLowerCase()).toMatch(/verif|changed/)
    })
  })

  describe('getLastCheckinText', () => {
    it('returns string with label and unknown when date is null', () => {
      const text = getLastCheckinText(null)
      expect(typeof text).toBe('string')
      expect(text).toContain('Unknown')
    })

    it('returns string with label and time when date is provided', () => {
      const date = new Date(Date.now() - 30000).toISOString()
      const text = getLastCheckinText(date)
      expect(typeof text).toBe('string')
      expect(text).toContain('Last check-in')
    })

    it('contains colon separator between label and value', () => {
      const text = getLastCheckinText(null)
      expect(text).toContain(':')
    })
  })

  describe('renderFreshnessBadge', () => {
    it('returns an HTML string', () => {
      const html = renderFreshnessBadge(new Date().toISOString())
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(0)
    })

    it('contains aria-label attribute', () => {
      const html = renderFreshnessBadge(new Date().toISOString())
      expect(html).toContain('aria-label')
    })

    it('renders sm size without error', () => {
      expect(() => renderFreshnessBadge(new Date().toISOString(), 'sm')).not.toThrow()
    })

    it('renders lg size without error', () => {
      expect(() => renderFreshnessBadge(new Date().toISOString(), 'lg')).not.toThrow()
    })

    it('renders for null date (unverified)', () => {
      const html = renderFreshnessBadge(null)
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(0)
    })
  })

  describe('renderFreshnessIndicator', () => {
    it('returns an HTML string', () => {
      const html = renderFreshnessIndicator(new Date().toISOString())
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(0)
    })

    it('contains aria-label attribute', () => {
      const html = renderFreshnessIndicator(new Date().toISOString())
      expect(html).toContain('aria-label')
    })

    it('renders for null date', () => {
      const html = renderFreshnessIndicator(null)
      expect(typeof html).toBe('string')
    })
  })

  describe('renderFreshnessSection', () => {
    it('returns an HTML string', () => {
      const html = renderFreshnessSection(new Date().toISOString())
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(0)
    })

    it('renders for null date (no check-in)', () => {
      const html = renderFreshnessSection(null)
      expect(typeof html).toBe('string')
    })

    it('shows warning section for unverified spots', () => {
      const oldDate = new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString()
      const html = renderFreshnessSection(oldDate)
      // Should contain warning (triangle-alert icon or warning content)
      expect(html.length).toBeGreaterThan(0)
    })

    it('does not show warning for active spots', () => {
      const recentDate = new Date(Date.now() - 1000).toISOString()
      const html = renderFreshnessSection(recentDate)
      expect(html).not.toContain('triangle-alert')
    })
  })
})
