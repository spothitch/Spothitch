import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({
    user: { uid: 'user1', displayName: 'Test' },
    isLoggedIn: true,
    level: 5,
    spotsCreated: 3,
    reviewsGiven: 5,
  })),
  setState: vi.fn(),
}))

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn(k => k) }))
vi.mock('../../src/services/notifications.js', () => ({ showToast: vi.fn() }))

describe('Ambassadors Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('module imports without error', async () => {
    const mod = await import('../../src/services/ambassadors.js')
    expect(mod).toBeDefined()
    expect(typeof mod.registerAsAmbassador).toBe('function')
    expect(typeof mod.isEligibleForAmbassador).toBe('function')
  })

  it('registerAsAmbassador rejects missing fields', async () => {
    const { registerAsAmbassador } = await import('../../src/services/ambassadors.js')
    expect(() => registerAsAmbassador({ city: 'Paris' })).toThrow()
  })

  it('registerAsAmbassador rejects bio over 500 chars', async () => {
    const { registerAsAmbassador } = await import('../../src/services/ambassadors.js')
    expect(() => registerAsAmbassador({
      city: 'Paris', country: 'FR', bio: 'a'.repeat(501),
    })).toThrow()
  })

  it('registerAsAmbassador rejects city over 100 chars', async () => {
    const { registerAsAmbassador } = await import('../../src/services/ambassadors.js')
    expect(() => registerAsAmbassador({
      city: 'a'.repeat(101), country: 'FR', bio: 'Test bio',
    })).toThrow()
  })
})
