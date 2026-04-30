import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))
vi.mock('../../src/utils/sanitize.js', () => ({ escapeHTML: vi.fn((s) => s || '') }))
vi.mock('../../src/utils/spotDestinations.js', () => ({ getDestinationsDisplay: vi.fn(() => '') }))
vi.mock('../../src/services/spotFreshness.js', () => ({
  getSpotFreshness: vi.fn(() => ({ color: 'blue', icon: 'map-pin', labelKey: 'recent', isCertified: false, isStation: false })),
  renderFreshnessBadge: vi.fn(() => ''),
}))
vi.mock('../../src/services/verification.js', () => ({
  getSpotVerification: vi.fn(() => ({ status: 'unverified', totalVotes: 0 })),
  getStatusBadge: vi.fn(() => ({ icon: 'check', color: '', bg: '', label: '' })),
}))
vi.mock('../../src/utils/dateHelpers.js', () => ({
  getTimeAgo: vi.fn(() => ''),
  renderFreshnessIndicator: vi.fn(() => ''),
}))

import { renderSpotCard } from '../../src/components/SpotCard.js'

describe('SpotCard', () => {
  it('exports renderSpotCard function', () => {
    expect(typeof renderSpotCard).toBe('function')
  })
  it('renders HTML with spot name', () => {
    const html = renderSpotCard({ id: 1, from: 'Paris', to: 'Lyon' })
    expect(typeof html).toBe('string')
    expect(html).toContain('Paris')
  })
  it('renders compact variant', () => {
    const html = renderSpotCard({ id: 1, from: 'Berlin' }, 'compact')
    expect(html).toContain('Berlin')
  })
  it('includes aria-label', () => {
    const html = renderSpotCard({ id: 1, from: 'Spot', to: 'Dest' })
    expect(html).toContain('aria-label')
  })
  it('handles spot without photo', () => {
    const html = renderSpotCard({ id: 1, from: 'A', to: 'B' })
    expect(html).toContain('map-pin')
  })
})
