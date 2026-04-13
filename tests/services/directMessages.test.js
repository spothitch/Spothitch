import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock firebase
vi.mock('../../src/services/firebase.js', () => ({
  getCurrentUser: vi.fn(() => ({ uid: 'user1', displayName: 'Test' })),
  db: {},
  initializeFirebase: vi.fn(),
}))

// Mock state
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({
    user: { uid: 'user1', displayName: 'Test' },
    isLoggedIn: true,
    username: 'testuser',
  })),
  setState: vi.fn(),
}))

// Mock notifications
vi.mock('../../src/services/notifications.js', () => ({
  showToast: vi.fn(),
}))

describe('DirectMessages Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('module exports sendDirectMessage', async () => {
    const mod = await import('../../src/services/directMessages.js')
    expect(mod).toBeDefined()
    expect(typeof mod.sendDirectMessage).toBe('function')
  })

  it('sendDirectMessage rejects empty text', async () => {
    const { sendDirectMessage } = await import('../../src/services/directMessages.js')
    const result = await sendDirectMessage('user2', '')
    expect(result.success).toBe(false)
    expect(result.error).toBe('empty_message')
  })

  it('sendDirectMessage rejects null text', async () => {
    const { sendDirectMessage } = await import('../../src/services/directMessages.js')
    const result = await sendDirectMessage('user2', null)
    expect(result.success).toBe(false)
  })

  it('sendDirectMessage rejects text over 10000 chars', async () => {
    const { sendDirectMessage } = await import('../../src/services/directMessages.js')
    const longText = 'a'.repeat(10001)
    const result = await sendDirectMessage('user2', longText)
    expect(result.success).toBe(false)
    expect(result.error).toBe('message_too_long')
  })

  it('sendDirectMessage rejects no recipient', async () => {
    const { sendDirectMessage } = await import('../../src/services/directMessages.js')
    const result = await sendDirectMessage('', 'hello')
    expect(result.success).toBe(false)
    expect(result.error).toBe('no_recipient')
  })

  it('exports exist', async () => {
    const mod = await import('../../src/services/directMessages.js')
    // Module should have key functions
    expect(mod).toBeDefined()
  })
})
