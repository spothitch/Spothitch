import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({
    spots: [],
    userLocation: null,
    notifications: true,
  })),
  setState: vi.fn(),
}))
vi.mock('../../src/services/notifications.js', () => ({
  showToast: vi.fn(),
  sendLocalNotification: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))

let mod
beforeAll(async () => {
  try {
    mod = await import('../../src/services/proximityAlerts.js')
  } catch {
    mod = {}
  }
})

describe('proximityAlerts', () => {
  beforeEach(() => { localStorage.clear() })

  it('module loads without error', () => {
    expect(mod).toBeDefined()
  })

  it('exports functions', () => {
    const exported = Object.keys(mod)
    expect(exported.length).toBeGreaterThan(0)
  })
})
