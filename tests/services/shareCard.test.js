import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg>${name}</svg>`),
}))
vi.mock('../../src/utils/share.js', () => ({
  copyToClipboard: vi.fn(),
}))
vi.mock('../../src/services/notifications.js', () => ({
  showToast: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))

import { generateShareCard } from '../../src/services/shareCard.js'

describe('shareCard', () => {
  describe('generateShareCard', () => {
    it('returns empty string for null spot', () => {
      expect(generateShareCard(null)).toBe('')
    })

    it('returns HTML with spot name', () => {
      const html = generateShareCard({ name: 'Highway Exit A1', country: 'FR' })
      expect(html).toContain('Highway Exit A1')
    })

    it('uses "from" field when no name', () => {
      const html = generateShareCard({ from: 'Berlin Nord' })
      expect(html).toContain('Berlin Nord')
    })

    it('shows rating', () => {
      const html = generateShareCard({ name: 'Spot', globalRating: 4.5 })
      expect(html).toContain('4.5')
    })

    it('shows ? when no rating', () => {
      const html = generateShareCard({ name: 'Spot' })
      expect(html).toContain('?/5')
    })

    it('shows wait time', () => {
      const html = generateShareCard({ name: 'Spot', avgWaitTime: 15 })
      expect(html).toContain('15 min')
    })

    it('includes SpotHitch branding', () => {
      const html = generateShareCard({ name: 'Spot' })
      expect(html).toContain('SpotHitch')
    })

    it('includes country', () => {
      const html = generateShareCard({ name: 'Spot', country: 'Germany' })
      expect(html).toContain('Germany')
    })
  })
})
