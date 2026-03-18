import { describe, it, expect, vi } from 'vitest'

// Mock i18n and state before importing
vi.mock('../src/i18n/index.js', () => ({
  t: (key) => ({ justNow: 'now', daysShort: 'd' }[key] || key),
}))
vi.mock('../src/stores/state.js', () => ({
  getState: () => ({ lang: 'en' }),
}))

import { formatTime, formatRelativeTime, formatEventDate } from '../src/utils/formatters.js'

describe('formatTime', () => {
  it('returns empty for falsy', () => {
    expect(formatTime(null)).toBe('')
    expect(formatTime(undefined)).toBe('')
    expect(formatTime(0)).toBe('')
  })

  it('formats Date object', () => {
    const d = new Date('2026-01-15T14:30:00')
    const result = formatTime(d)
    expect(result).toMatch(/14:30/)
  })

  it('formats Firestore timestamp with toDate()', () => {
    const ts = { toDate: () => new Date('2026-01-15T08:15:00') }
    const result = formatTime(ts)
    expect(result).toMatch(/08:15/)
  })
})

describe('formatRelativeTime', () => {
  it('returns empty for falsy', () => {
    expect(formatRelativeTime(null)).toBe('')
    expect(formatRelativeTime('')).toBe('')
  })

  it('returns "now" for recent time', () => {
    const now = new Date().toISOString()
    expect(formatRelativeTime(now)).toBe('now')
  })

  it('returns minutes for <60min', () => {
    const d = new Date(Date.now() - 5 * 60000).toISOString()
    expect(formatRelativeTime(d)).toBe('5m')
  })

  it('returns hours for <24h', () => {
    const d = new Date(Date.now() - 3 * 3600000).toISOString()
    expect(formatRelativeTime(d)).toBe('3h')
  })

  it('returns days for <7d', () => {
    const d = new Date(Date.now() - 2 * 86400000).toISOString()
    expect(formatRelativeTime(d)).toBe('2d')
  })

  it('returns date for >7d', () => {
    const d = new Date(Date.now() - 10 * 86400000).toISOString()
    const result = formatRelativeTime(d)
    expect(result).not.toBe('')
    expect(result).not.toMatch(/^\d+[mhd]$/)
  })

  it('handles invalid date gracefully', () => {
    // new Date('not-a-date') returns Invalid Date (NaN), not an exception
    const result = formatRelativeTime('not-a-date')
    expect(typeof result).toBe('string')
  })
})

describe('formatEventDate', () => {
  it('returns empty for falsy', () => {
    expect(formatEventDate(null)).toBe('')
    expect(formatEventDate('')).toBe('')
  })

  it('formats valid date', () => {
    const result = formatEventDate('2026-03-15')
    expect(result).toMatch(/15/)
    expect(result).toMatch(/Mar|mars/i)
  })
})
