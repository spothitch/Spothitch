import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn(k => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn(() => '<svg></svg>') }))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeHTML: vi.fn(s => s),
  escapeJSString: vi.fn(s => s),
}))

describe('DeleteAccount Component', () => {
  it('module imports without error', async () => {
    const mod = await import('../../src/components/modals/DeleteAccount.js')
    expect(mod).toBeDefined()
    expect(typeof mod.renderDeleteAccountModal).toBe('function')
  })

  it('renders modal with warning text', async () => {
    const { renderDeleteAccountModal } = await import('../../src/components/modals/DeleteAccount.js')
    const html = renderDeleteAccountModal({ isLoggedIn: true, user: { uid: 'test' } })
    expect(html).toBeTruthy()
    expect(typeof html).toBe('string')
    expect(html.length).toBeGreaterThan(100)
  })

  it('contains close button', async () => {
    const { renderDeleteAccountModal } = await import('../../src/components/modals/DeleteAccount.js')
    const html = renderDeleteAccountModal({ isLoggedIn: true, user: { uid: 'test' } })
    expect(html).toContain('closeDeleteAccount')
  })
})
