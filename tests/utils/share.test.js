import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeJSString: vi.fn((s) => s),
}))

import { share, shareSpot, shareBadge, shareStats, shareApp } from '../../src/utils/share.js'

describe('share', () => {
  beforeEach(() => {
    // Reset navigator.share
    global.navigator.share = undefined
  })

  describe('share()', () => {
    it('falls back to modal when no Web Share API', async () => {
      const result = await share({ title: 'Test', text: 'Hello', url: 'https://example.com' })
      expect(result.success).toBe(true)
      expect(result.method).toBe('modal')
    })

    it('uses native share when available', async () => {
      global.navigator.share = vi.fn().mockResolvedValue(undefined)
      const result = await share({ title: 'Test', text: 'Hello', url: 'https://example.com' })
      expect(result.success).toBe(true)
      expect(result.method).toBe('native')
      expect(global.navigator.share).toHaveBeenCalledWith({
        title: 'Test',
        text: 'Hello',
        url: 'https://example.com',
      })
    })

    it('handles user cancellation', async () => {
      const abortError = new Error('User cancelled')
      abortError.name = 'AbortError'
      global.navigator.share = vi.fn().mockRejectedValue(abortError)
      const result = await share({ title: 'Test', text: 'Hello', url: 'https://example.com' })
      expect(result.success).toBe(false)
      expect(result.reason).toBe('cancelled')
    })
  })

  describe('shareSpot()', () => {
    it('creates share data from spot', async () => {
      global.navigator.share = vi.fn().mockResolvedValue(undefined)
      await shareSpot({ id: 42, from: 'Berlin Nord', globalRating: 4.5 })
      const callArgs = global.navigator.share.mock.calls[0][0]
      expect(callArgs.title).toContain('Berlin Nord')
      expect(callArgs.url).toContain('spot=42')
    })

    it('handles spot without name', async () => {
      global.navigator.share = vi.fn().mockResolvedValue(undefined)
      await shareSpot({ id: 1 })
      const callArgs = global.navigator.share.mock.calls[0][0]
      expect(callArgs.title).toContain('Spot')
    })
  })

  describe('shareBadge()', () => {
    it('creates share data from badge', async () => {
      global.navigator.share = vi.fn().mockResolvedValue(undefined)
      await shareBadge({ name: 'Explorer', icon: 'globe', description: 'Visit 5 countries' })
      const callArgs = global.navigator.share.mock.calls[0][0]
      expect(callArgs.title).toContain('Explorer')
    })
  })

  describe('shareStats()', () => {
    it('creates share data from stats', async () => {
      global.navigator.share = vi.fn().mockResolvedValue(undefined)
      await shareStats({ checkins: 10, spotsCreated: 5, level: 3 })
      const callArgs = global.navigator.share.mock.calls[0][0]
      expect(callArgs.text).toContain('10')
      expect(callArgs.text).toContain('5')
    })
  })

  describe('shareApp()', () => {
    it('creates app share data', async () => {
      global.navigator.share = vi.fn().mockResolvedValue(undefined)
      await shareApp()
      const callArgs = global.navigator.share.mock.calls[0][0]
      expect(callArgs.url).toContain('spothitch.com')
    })
  })
})
