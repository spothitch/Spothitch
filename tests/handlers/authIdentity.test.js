import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSetState = vi.fn()
window.setState = mockSetState
window.getState = vi.fn(() => ({ user: null }))
window.t = vi.fn((k) => k)

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
  beforeEach(() => { mockSetState.mockClear() })

  it('openAuth calls setState with showAuth=true', () => {
    window.openAuth?.()
    expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({ showAuth: true }))
  })
  it('openAgeVerification calls setState with showAgeVerification=true', () => {
    window.openAgeVerification?.()
    expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({ showAgeVerification: true }))
  })
  it('closeAgeVerification calls setState with showAgeVerification=false', () => {
    window.closeAgeVerification?.()
    expect(mockSetState).toHaveBeenCalledWith({ showAgeVerification: false })
  })
  it('getTrustLevel returns a numeric level', () => {
    const level = window.getTrustLevel?.()
    expect(typeof level).toBe('number')
    expect(level).toBeGreaterThanOrEqual(0)
  })
  it('requireAuth opens auth modal when not logged in', () => {
    mockSetState.mockClear()
    window.requireAuth?.('test')
    expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({ showAuth: true }))
  })
})
