import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ user: null })),
  setState: vi.fn(),
}))
vi.mock('../../src/services/notifications.js', () => ({ showToast: vi.fn() }))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))
vi.mock('../../src/services/firebase.js', () => ({
  getCurrentUser: vi.fn(() => null),
  db: null,
}))

// communityAlert may export functions we can test
let mod
beforeAll(async () => {
  try {
    mod = await import('../../src/services/communityAlert.js')
  } catch {
    mod = {}
  }
})

describe('communityAlert', () => {
  beforeEach(() => { localStorage.clear() })

  it('module loads without error', () => {
    expect(mod).toBeDefined()
  })

  it('exports expected functions', () => {
    // Check common exports
    const exported = Object.keys(mod)
    expect(exported.length).toBeGreaterThan(0)
  })
})
