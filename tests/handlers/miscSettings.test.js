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

window._appInternals = { scheduleRender: vi.fn((fn) => fn?.()), render: vi.fn() }

await import('../../src/handlers/miscSettings.js')

describe('miscSettings handlers', () => {
  it('clearFormDraft calls scheduleRender after clearing', async () => {
    await window.clearFormDraft?.('addSpot')
    expect(window._appInternals.scheduleRender).toHaveBeenCalled()
  })
  it('togglePushNotifications is callable', async () => {
    try { await window.togglePushNotifications?.() } catch {}
    expect(typeof window.togglePushNotifications).toBe('function')
  })
  it('openAddWebhook is callable', async () => {
    try { await window.openAddWebhook?.() } catch {}
    expect(typeof window.openAddWebhook).toBe('function')
  })
})
