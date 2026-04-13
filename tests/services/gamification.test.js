import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ points: 0, level: 1, badges: [], streak: 0, checkins: 0 })),
  setState: vi.fn(),
}))
vi.mock('../../src/services/notifications.js', () => ({ showToast: vi.fn() }))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn(k => k) }))

describe('Gamification Service', () => {
  beforeEach(() => { localStorage.clear(); vi.clearAllMocks() })

  it('imports without error', async () => {
    const mod = await import('../../src/services/gamification.js')
    expect(mod).toBeDefined()
  })

  it('has addPoints function', async () => {
    const mod = await import('../../src/services/gamification.js')
    expect(typeof mod.addPoints).toBe('function')
  })

  it('has updateLeague function', async () => {
    const mod = await import('../../src/services/gamification.js')
    expect(typeof mod.updateLeague).toBe('function')
  })

  it('has getLeagueInfo function', async () => {
    const mod = await import('../../src/services/gamification.js')
    expect(typeof mod.getLeagueInfo).toBe('function')
  })
})
