import { describe, it, expect, vi } from 'vitest'

const mockSetState = vi.fn()
window.setState = mockSetState
window.getState = vi.fn(() => ({ user: null }))

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ user: null })),
  setState: (...args) => mockSetState(...args),
}))
vi.mock('../../src/services/notifications.js', () => ({ showToast: vi.fn() }))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))
vi.mock('../../src/services/firebase.js', () => ({
  getCurrentUser: vi.fn(() => null), db: null,
}))

await import('../../src/handlers/authIdentity.js')

describe('authIdentity handlers', () => {
  it('openAuth is a function', () => {
    expect(typeof window.openAuth).toBe('function')
  })
  it('requireAuth is a function', () => {
    expect(typeof window.requireAuth).toBe('function')
  })
  it('openAgeVerification is a function', () => {
    expect(typeof window.openAgeVerification).toBe('function')
  })
  it('closeAgeVerification is a function', () => {
    expect(typeof window.closeAgeVerification).toBe('function')
  })
  it('getTrustLevel is a function', () => {
    expect(typeof window.getTrustLevel).toBe('function')
  })
})
