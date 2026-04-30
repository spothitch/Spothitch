import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/utils/share.js', () => ({
  share: vi.fn().mockResolvedValue({ success: true }),
  shareSpot: vi.fn().mockResolvedValue({ success: true }),
  shareBadge: vi.fn().mockResolvedValue({ success: true }),
  shareStats: vi.fn().mockResolvedValue({ success: true }),
  shareApp: vi.fn().mockResolvedValue({ success: true }),
}))
vi.mock('../../src/services/shareCard.js', () => ({
  showShareModal: vi.fn(),
}))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
}))

await import('../../src/handlers/sharing.js')

describe('sharing handlers', () => {
  it('shareSpot handler exists', () => {
    expect(typeof window.shareSpot).toBe('function')
  })
  it('shareBadge handler exists', () => {
    expect(typeof window.shareBadge).toBe('function')
  })
  it('shareStats handler exists', () => {
    expect(typeof window.shareStats).toBe('function')
  })
  it('shareApp handler exists', () => {
    expect(typeof window.shareApp).toBe('function')
  })
  it('openShareCard handler exists', () => {
    expect(typeof window.openShareCard).toBe('function')
  })
})
