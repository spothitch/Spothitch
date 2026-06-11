import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg data-icon="${name}"></svg>`),
}))
vi.mock('../../src/utils/constants.js', () => ({
  ADMIN_EMAILS: ['admin@spothitch.com'],
}))

import { renderAuth, renderCompleteProfile } from '../../src/components/modals/Auth.js'

describe('renderAuth', () => {
  it('renders login modal (default)', () => {
    const html = renderAuth({})
    expect(html).toContain('role="dialog"')
    expect(html).toContain('closeAuth()')
    expect(html).toContain('auth-modal-title')
    expect(html).toContain('handleAuth(event)')
  })

  it('renders login mode tabs', () => {
    const html = renderAuth({ authMode: 'login' })
    expect(html).toContain("setAuthMode('login')")
    expect(html).toContain("setAuthMode('register')")
    expect(html).toContain('auth-email')
    expect(html).toContain('auth-password')
  })

  it('renders register mode with extra fields', () => {
    const html = renderAuth({ authMode: 'register' })
    expect(html).toContain('auth-firstname')
    expect(html).toContain('auth-lastname')
    expect(html).toContain('auth-email')
    expect(html).toContain('auth-password')
  })

  it('shows auth reason when provided', () => {
    const html = renderAuth({ showAuthReason: 'Pour ajouter un spot, connecte-toi' })
    expect(html).toContain('Pour ajouter un spot')
  })

  it('does not show reason section when no reason', () => {
    const html = renderAuth({})
    expect(html).not.toContain('text-amber-400/90')
  })

  it('renders form with submit handler', () => {
    const html = renderAuth({})
    expect(html).toContain('onsubmit="handleAuth(event)"')
    expect(html).toContain('id="auth-form"')
  })

  it('renders close button', () => {
    const html = renderAuth({})
    expect(html).toContain('onclick="closeAuth()"')
  })

  it('renders register mode with terms checkbox', () => {
    const html = renderAuth({ authMode: 'register' })
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(200)
  })

  it('renders login with forgot password link', () => {
    const html = renderAuth({ authMode: 'login' })
    expect(html).toContain('forgotPassword')
  })
})

describe('renderCompleteProfile', () => {
  it('renders complete profile form', () => {
    const html = renderCompleteProfile({})
    expect(html).toContain('role="dialog"')
    expect(html).toContain('submitCompleteProfile(event)')
    expect(html).toContain('cp-firstname')
    expect(html).toContain('cp-lastname')
  })

  it('prefills name from user displayName', () => {
    const html = renderCompleteProfile({ user: { displayName: 'Jean Dupont' } })
    expect(html).toContain('Jean')
    expect(html).toContain('Dupont')
  })

  it('prefills from currentUser displayName', () => {
    const html = renderCompleteProfile({ currentUser: { displayName: 'Alice Martin' } })
    expect(html).toContain('Alice')
    expect(html).toContain('Martin')
  })

  it('renders empty without user', () => {
    const html = renderCompleteProfile({})
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(100)
  })

  it('renders birthyear and pseudo fields', () => {
    const html = renderCompleteProfile({})
    expect(html).toContain('cp-birthyear')
    expect(html).toContain('cp-pseudo')
  })
})
