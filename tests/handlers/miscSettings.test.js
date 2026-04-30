import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
}))
vi.mock('../../src/services/notifications.js', () => ({ showToast: vi.fn() }))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/formPersistence.js', () => ({ clearDraft: vi.fn() }))
vi.mock('../../src/services/firebase.js', () => ({
  getCurrentUser: vi.fn(() => null), db: null,
}))

await import('../../src/handlers/miscSettings.js')

describe('miscSettings handlers', () => {
  it('clearFormDraft is a function', () => {
    expect(typeof window.clearFormDraft).toBe('function')
  })
  it('togglePushNotifications is a function', () => {
    expect(typeof window.togglePushNotifications).toBe('function')
  })
  it('openAddWebhook is a function', () => {
    expect(typeof window.openAddWebhook).toBe('function')
  })
})
