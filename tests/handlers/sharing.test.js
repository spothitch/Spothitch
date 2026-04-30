import { describe, it, expect, vi } from 'vitest'

const mockShareSpot = vi.fn().mockResolvedValue({ success: true })
const mockShareBadge = vi.fn().mockResolvedValue({ success: true })
const mockShareStats = vi.fn().mockResolvedValue({ success: true })
const mockShareApp = vi.fn().mockResolvedValue({ success: true })

vi.mock('../../src/utils/share.js', () => ({
  share: vi.fn().mockResolvedValue({ success: true }),
  shareSpot: (...args) => mockShareSpot(...args),
  shareBadge: (...args) => mockShareBadge(...args),
  shareStats: (...args) => mockShareStats(...args),
  shareApp: (...args) => mockShareApp(...args),
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
  it('shareSpot calls the share utility with spot data', async () => {
    await window.shareSpot({ id: 42, from: 'Paris' })
    expect(mockShareSpot).toHaveBeenCalledWith({ id: 42, from: 'Paris' })
  })
  it('shareBadge calls the share utility with badge data', async () => {
    await window.shareBadge({ name: 'Explorer', icon: 'globe' })
    expect(mockShareBadge).toHaveBeenCalledWith({ name: 'Explorer', icon: 'globe' })
  })
  it('shareStats calls the share utility with stats', async () => {
    await window.shareStats({ checkins: 10, level: 3 })
    expect(mockShareStats).toHaveBeenCalledWith({ checkins: 10, level: 3 })
  })
  it('shareApp calls the share utility', async () => {
    await window.shareApp()
    expect(mockShareApp).toHaveBeenCalled()
  })
})
