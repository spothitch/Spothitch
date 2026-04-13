import { describe, it, expect } from 'vitest'
import { formatTime, formatRelativeTime } from '../../src/utils/formatters.js'

describe('Formatters Utils', () => {
  describe('formatTime', () => {
    it('formats a date', () => {
      const result = formatTime(new Date('2026-01-15T10:30:00'))
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('handles null', () => {
      const result = formatTime(null)
      expect(typeof result).toBe('string')
    })
  })

  describe('formatRelativeTime', () => {
    it('returns a string', () => {
      const result = formatRelativeTime(new Date())
      expect(typeof result).toBe('string')
    })

    it('handles past dates', () => {
      const past = new Date(Date.now() - 3600000)
      const result = formatRelativeTime(past)
      expect(typeof result).toBe('string')
    })

    it('handles string dates', () => {
      const result = formatRelativeTime('2026-01-01')
      expect(typeof result).toBe('string')
    })
  })
})
