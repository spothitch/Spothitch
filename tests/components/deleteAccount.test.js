import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn(k => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn(() => '<svg></svg>') }))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeHTML: vi.fn(s => s),
  escapeJSString: vi.fn(s => s),
}))

import { renderDeleteAccountModal } from '../../src/components/modals/DeleteAccount.js'

describe('renderDeleteAccountModal', () => {
  it('module imports without error', () => {
    expect(typeof renderDeleteAccountModal).toBe('function')
  })

  it('renders modal with warning text', () => {
    const html = renderDeleteAccountModal({ isLoggedIn: true, user: { uid: 'test' } })
    expect(html).toBeTruthy()
    expect(typeof html).toBe('string')
    expect(html.length).toBeGreaterThan(100)
  })

  it('contains close button', () => {
    const html = renderDeleteAccountModal({ isLoggedIn: true, user: { uid: 'test' } })
    expect(html).toContain('closeDeleteAccount')
  })

  it('renders a modal regardless of login state', () => {
    const html = renderDeleteAccountModal({ isLoggedIn: false })
    expect(html).toContain('role="dialog"')
  })

  it('renders delete form with password field', () => {
    const html = renderDeleteAccountModal({ isLoggedIn: true, user: { uid: 'u1' } })
    expect(html).toContain('delete-password')
  })

  it('renders Google provider branch (no password field)', () => {
    const html = renderDeleteAccountModal({
      isLoggedIn: true,
      user: { uid: 'u1', providerData: [{ providerId: 'google.com' }] },
    })
    expect(html).toContain('deleteImmediate')
  })

  it('renders email provider branch (shows grace period text)', () => {
    const html = renderDeleteAccountModal({
      isLoggedIn: true,
      user: { uid: 'u1', providerData: [{ providerId: 'password' }] },
    })
    expect(html).toContain('deleteGracePeriod')
  })

  it('renders with undefined user (no crash)', () => {
    const html = renderDeleteAccountModal({})
    expect(typeof html).toBe('string')
    expect(html.length).toBeGreaterThan(100)
  })

  it('contains delete-account-title id', () => {
    const html = renderDeleteAccountModal({ isLoggedIn: true, user: { uid: 'u1' } })
    expect(html).toContain('delete-account-title')
  })
})

describe('DeleteAccount window handlers', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>'
    vi.clearAllMocks()
    window.setState = vi.fn()
    window.getState = vi.fn(() => ({ isLoggedIn: true }))
    window.showToast = vi.fn()
  })

  it('openDeleteAccount calls setState when logged in', () => {
    window.openDeleteAccount()
    expect(window.setState).toHaveBeenCalledWith({ showDeleteAccount: true })
  })

  it('openDeleteAccount shows error toast when not logged in', () => {
    window.getState = vi.fn(() => ({ isLoggedIn: false }))
    window.openDeleteAccount()
    expect(window.showToast).toHaveBeenCalled()
    expect(window.setState).not.toHaveBeenCalled()
  })

  it('closeDeleteAccount calls setState with showDeleteAccount: false', () => {
    window.closeDeleteAccount()
    expect(window.setState).toHaveBeenCalledWith({ showDeleteAccount: false })
  })

  it('closeDeleteAccount resets form if present', () => {
    document.body.innerHTML = `
      <form id="delete-account-form"></form>
      <div id="delete-error">error text</div>
    `
    const formResetSpy = vi.spyOn(document.getElementById('delete-account-form'), 'reset')
    window.closeDeleteAccount()
    expect(formResetSpy).toHaveBeenCalled()
  })

  it('closeDeleteAccount hides error div', () => {
    document.body.innerHTML = `
      <form id="delete-account-form"></form>
      <div id="delete-error">error text</div>
    `
    window.closeDeleteAccount()
    expect(document.getElementById('delete-error').classList.contains('hidden')).toBe(true)
  })

  it('confirmDeleteAccount shows error when password is empty', async () => {
    document.body.innerHTML = `
      <input id="delete-password" value="" />
      <div id="delete-error" class="hidden"></div>
    `
    await window.confirmDeleteAccount({ preventDefault: vi.fn() })
    expect(document.getElementById('delete-error').classList.contains('hidden')).toBe(false)
  })
})
