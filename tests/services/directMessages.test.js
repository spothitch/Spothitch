import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock firebase
vi.mock('../../src/services/firebase.js', () => ({
  getCurrentUser: vi.fn(() => ({ uid: 'user1', displayName: 'Test' })),
  db: {},
  initializeFirebase: vi.fn(),
  containsProfanity: vi.fn(() => false),
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

  describe('getConversationId', () => {
    it('returns deterministic ID regardless of order', async () => {
      const { getConversationId } = await import('../../src/services/directMessages.js')
      const id1 = getConversationId('userA', 'userB')
      const id2 = getConversationId('userB', 'userA')
      expect(id1).toBe(id2)
    })

    it('returns string containing dm separator', async () => {
      const { getConversationId } = await import('../../src/services/directMessages.js')
      const id = getConversationId('user1', 'user2')
      expect(id).toContain('_dm_')
    })

    it('sorts participants alphabetically', async () => {
      const { getConversationId } = await import('../../src/services/directMessages.js')
      const id = getConversationId('zz-user', 'aa-user')
      expect(id.startsWith('aa-user')).toBe(true)
    })
  })

  describe('getConversationMessages', () => {
    it('returns an array', async () => {
      const { getConversationMessages } = await import('../../src/services/directMessages.js')
      const messages = getConversationMessages('user2')
      expect(Array.isArray(messages)).toBe(true)
    })

    it('returns empty array for unknown recipient', async () => {
      const { getConversationMessages } = await import('../../src/services/directMessages.js')
      const messages = getConversationMessages('nonexistent-user')
      expect(messages).toEqual([])
    })
  })

  describe('getConversationsList', () => {
    it('returns an array', async () => {
      const { getConversationsList } = await import('../../src/services/directMessages.js')
      const list = getConversationsList()
      expect(Array.isArray(list)).toBe(true)
    })

    it('returns empty array initially', async () => {
      const { getConversationsList } = await import('../../src/services/directMessages.js')
      const list = getConversationsList()
      expect(list.length).toBe(0)
    })
  })

  describe('getUnreadCount', () => {
    it('returns a number', async () => {
      const { getUnreadCount } = await import('../../src/services/directMessages.js')
      const count = getUnreadCount('user2')
      expect(typeof count).toBe('number')
    })

    it('returns 0 for unknown conversation', async () => {
      const { getUnreadCount } = await import('../../src/services/directMessages.js')
      expect(getUnreadCount('nobody')).toBe(0)
    })
  })

  describe('getTotalUnreadCount', () => {
    it('returns a number', async () => {
      const { getTotalUnreadCount } = await import('../../src/services/directMessages.js')
      const count = getTotalUnreadCount()
      expect(typeof count).toBe('number')
    })

    it('returns 0 when no conversations', async () => {
      const { getTotalUnreadCount } = await import('../../src/services/directMessages.js')
      expect(getTotalUnreadCount()).toBe(0)
    })
  })

  describe('subscribeToAllConversations', () => {
    it('returns undefined when uid is null (no db)', async () => {
      const { subscribeToAllConversations } = await import('../../src/services/directMessages.js')
      const result = subscribeToAllConversations(null)
      expect(result).toBeUndefined()
    })

    it('runs without error', async () => {
      const { subscribeToAllConversations } = await import('../../src/services/directMessages.js')
      expect(() => subscribeToAllConversations(null)).not.toThrow()
    })
  })

  describe('unsubscribeFromAllConversations', () => {
    it('runs without error', async () => {
      const { unsubscribeFromAllConversations } = await import('../../src/services/directMessages.js')
      expect(() => unsubscribeFromAllConversations()).not.toThrow()
    })

    it('can be called multiple times', async () => {
      const { unsubscribeFromAllConversations } = await import('../../src/services/directMessages.js')
      expect(() => {
        unsubscribeFromAllConversations()
        unsubscribeFromAllConversations()
      }).not.toThrow()
    })
  })

  describe('unsubscribeFromConversation', () => {
    it('runs without error for unknown recipient', async () => {
      const { unsubscribeFromConversation } = await import('../../src/services/directMessages.js')
      expect(() => unsubscribeFromConversation('unknown')).not.toThrow()
    })
  })

  describe('sendDirectMessage — additional cases', () => {
    it('rejects self-message (sender === recipient)', async () => {
      const { sendDirectMessage } = await import('../../src/services/directMessages.js')
      // user1 is mocked as current user, sending to 'user1'
      const result = await sendDirectMessage('user1', 'Hello self')
      expect(result.success).toBe(false)
    })

    it('handles message with special characters', async () => {
      const { sendDirectMessage } = await import('../../src/services/directMessages.js')
      const result = await sendDirectMessage('user2', 'Hello <world> & "test"')
      // Either success or error (no db), but should not throw
      expect(typeof result.success).toBe('boolean')
    })
  })
})
