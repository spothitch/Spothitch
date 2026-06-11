/**
 * Auth.js window handler + requireAuth tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn(() => '<svg></svg>') }))
vi.mock('../../src/utils/constants.js', () => ({ ADMIN_EMAILS: ['admin@spothitch.com'] }))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ isLoggedIn: false, authMode: 'login' })),
  setState: vi.fn(),
}))
vi.mock('../../src/services/notifications.js', () => ({
  showSuccess: vi.fn(), showError: vi.fn(), showToast: vi.fn(),
}))
vi.mock('../../src/services/firebase.js', () => ({
  initializeFirebase: vi.fn(),
  resetPassword: vi.fn(() => Promise.resolve({ success: true })),
  signInWithGoogle: vi.fn(() => Promise.resolve({})),
  validateUsername: vi.fn((u) => {
    if (!u || u.length < 3) return { valid: false, errorKey: 'usernameTooShort' }
    if (!/^[a-z0-9._]+$/.test(u)) return { valid: false, errorKey: 'usernameInvalidChars' }
    return { valid: true, errorKey: null }
  }),
  checkUsernameAvailability: vi.fn(() => Promise.resolve({ available: true })),
}))

import { renderAuth, renderCompleteProfile, requireAuth } from '../../src/components/modals/Auth.js'
import { getState, setState } from '../../src/stores/state.js'

describe('requireAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getState.mockReturnValue({ isLoggedIn: false })
  })

  it('calls callback immediately when logged in', async () => {
    getState.mockReturnValue({ isLoggedIn: true })
    const cb = vi.fn()
    requireAuth('addSpot', cb)
    await new Promise(r => setTimeout(r, 10))
    expect(cb).toHaveBeenCalled()
  })

  it('shows auth modal when not logged in', async () => {
    getState.mockReturnValue({ isLoggedIn: false })
    requireAuth('addSpot', vi.fn())
    await new Promise(r => setTimeout(r, 10))
    expect(setState).toHaveBeenCalledWith(expect.objectContaining({ showAuth: true }))
  })

  it('sets correct reason for addSpot', async () => {
    getState.mockReturnValue({ isLoggedIn: false })
    requireAuth('addSpot')
    await new Promise(r => setTimeout(r, 10))
    expect(setState).toHaveBeenCalledWith(expect.objectContaining({
      authPendingAction: 'addSpot',
    }))
  })

  it('sets correct reason for sos', async () => {
    getState.mockReturnValue({ isLoggedIn: false })
    requireAuth('sos')
    await new Promise(r => setTimeout(r, 10))
    expect(setState).toHaveBeenCalledWith(expect.objectContaining({
      authPendingAction: 'sos',
    }))
  })

  it('works without callback', async () => {
    getState.mockReturnValue({ isLoggedIn: false })
    expect(() => requireAuth('guardian')).not.toThrow()
    await new Promise(r => setTimeout(r, 10))
  })

  it('sets unknown action with generic reason', async () => {
    getState.mockReturnValue({ isLoggedIn: false })
    requireAuth('someUnknownAction')
    await new Promise(r => setTimeout(r, 10))
    expect(setState).toHaveBeenCalledWith(expect.objectContaining({
      authPendingAction: 'someUnknownAction',
    }))
  })
})

describe('Auth renderAuth — additional branches', () => {
  it('renders with phone auth type', () => {
    const html = renderAuth({ authType: 'phone' })
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(100)
  })

  it('renders register with all optional fields', () => {
    const html = renderAuth({ authMode: 'register', authType: 'email' })
    expect(html).toContain('auth-firstname')
    expect(html).toContain('auth-lastname')
    expect(html).toContain('auth-birthyear')
  })

  it('renders login with empty reason', () => {
    const html = renderAuth({ authMode: 'login', showAuthReason: '' })
    expect(html).toContain('auth-email')
  })

  it('renders with social action reason', () => {
    const html = renderAuth({ showAuthReason: 'Pour accéder au chat, connecte-toi' })
    expect(html).toContain('Pour accéder au chat')
  })

  it('renders complete profile with no displayName (space-separated fallback)', () => {
    const html = renderCompleteProfile({ user: { displayName: 'Jean' } })
    expect(html).toContain('Jean')
  })

  it('renders complete profile with hyphenated name', () => {
    const html = renderCompleteProfile({ user: { displayName: 'Marie-Alice Dupont' } })
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(100)
  })
})

describe('Auth window handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = `
      <div id="app">
        <input id="auth-email" value="">
        <input id="auth-password" value="">
        <div id="auth-error-msg" class="hidden"></div>
        <button id="auth-submit-btn"></button>
        <div id="pseudo-status"></div>
      </div>
    `
    window._forceRender = vi.fn()
    window.showToast = vi.fn()
  })

  it('window.closeAuth is a function', () => {
    expect(typeof window.closeAuth).toBe('function')
    expect(() => window.closeAuth()).not.toThrow()
  })

  it('checkUsernameField with empty value clears status', () => {
    const status = document.getElementById('pseudo-status')
    window.checkUsernameField('')
    expect(status.textContent).toBe('')
  })

  it('checkUsernameField with short username shows error', async () => {
    const status = document.getElementById('pseudo-status')
    window.checkUsernameField('ab')
    await new Promise(r => setTimeout(r, 50))
    expect(status.textContent).toBeTruthy()
  })

  it('checkUsernameField with valid username schedules check', () => {
    expect(() => window.checkUsernameField('validusername')).not.toThrow()
  })

  it('checkUsernameField with forbidden chars shows error', async () => {
    const status = document.getElementById('pseudo-status')
    window.checkUsernameField('user@name!')
    await new Promise(r => setTimeout(r, 50))
    expect(status.textContent).toBeTruthy()
  })

  it('handleForgotPassword with no email does not crash', async () => {
    document.getElementById('auth-email').value = ''
    await expect(window.handleForgotPassword()).resolves.toBeUndefined()
  })
})

