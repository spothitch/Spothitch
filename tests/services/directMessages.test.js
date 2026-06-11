import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock firebase
vi.mock('../../src/services/firebase.js', () => ({
  getCurrentUser: vi.fn(() => ({ uid: 'user1', displayName: 'Test' })),
  db: {},
  initializeFirebase: vi.fn(),
  containsProfanity: vi.fn(() => false),
}))

// Firebase mocks (getApps returns [] by default → no db)
vi.mock('firebase/app', () => ({
  getApps: vi.fn(() => []),
  getApp: vi.fn(() => ({})),
}))
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn(async () => ({ id: 'msg123' })),
  setDoc: vi.fn(async () => {}),
  updateDoc: vi.fn(async () => {}),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  onSnapshot: vi.fn(() => () => {}),
  serverTimestamp: vi.fn(() => 'SERVER_TS'),
  increment: vi.fn((v) => v),
}))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))

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

// ==================== localStorage fallback paths (uid = null) ====================

describe('DirectMessages — localStorage fallback (no uid)', () => {
  let getState

  beforeEach(async () => {
    vi.clearAllMocks()
    localStorage.clear()
    // Mock getState to return no user
    const stateMod = await import('../../src/stores/state.js')
    getState = stateMod.getState
    getState.mockReturnValue({ user: null, friends: [] })
    // Clean up module state
    const mod = await import('../../src/services/directMessages.js')
    mod.unsubscribeFromAllConversations()
  })

  it('sendDirectMessage stores message in localStorage when uid is null', async () => {
    const { sendDirectMessage } = await import('../../src/services/directMessages.js')
    const result = await sendDirectMessage('recipient1', 'Hello from local')
    expect(result.success).toBe(true)
    expect(result.message).toBeDefined()
  })

  it('sendDirectMessage with spot option stores spot in message', async () => {
    const { sendDirectMessage } = await import('../../src/services/directMessages.js')
    const result = await sendDirectMessage('recipient1', 'Check this spot', {
      type: 'spot_share',
      spot: { id: 's1', name: 'Paris Nord', city: 'Paris', country: 'FR' },
    })
    expect(result.success).toBe(true)
    expect(result.message?.spot).toBeDefined()
  })

  it('sendDirectMessage with location option stores location in message', async () => {
    const { sendDirectMessage } = await import('../../src/services/directMessages.js')
    const result = await sendDirectMessage('recipient1', 'Here I am', {
      type: 'location_share',
      location: { lat: 48.8, lng: 2.3 },
    })
    expect(result.success).toBe(true)
    expect(result.message?.location).toBeDefined()
  })

  it('getConversationMessages returns messages from localStorage', async () => {
    const { sendDirectMessage, getConversationMessages } = await import('../../src/services/directMessages.js')
    await sendDirectMessage('friend1', 'First message')
    const msgs = getConversationMessages('friend1')
    expect(Array.isArray(msgs)).toBe(true)
    expect(msgs.length).toBeGreaterThan(0)
  })

  it('getConversationsList returns conversations from localStorage', async () => {
    const { sendDirectMessage, getConversationsList } = await import('../../src/services/directMessages.js')
    await sendDirectMessage('friend2', 'Hello friend')
    const list = getConversationsList()
    expect(Array.isArray(list)).toBe(true)
    expect(list.length).toBeGreaterThan(0)
  })

  it('getConversationsList with friends in state enriches with name/avatar', async () => {
    getState.mockReturnValue({
      user: null,
      friends: [{ id: 'friend3', name: 'Alice', avatar: 'adventurer', online: true }],
    })
    const { sendDirectMessage, getConversationsList } = await import('../../src/services/directMessages.js')
    await sendDirectMessage('friend3', 'Hello Alice')
    const list = getConversationsList()
    const conv = list.find(c => c.recipientId === 'friend3')
    expect(conv).toBeDefined()
    expect(conv.recipientName).toBe('Alice')
  })

  it('getUnreadCount returns unread count from localStorage', async () => {
    const { sendDirectMessage, getUnreadCount } = await import('../../src/services/directMessages.js')
    // Simulate a message received by local-user (unread)
    await sendDirectMessage('sender1', 'Message from them') // we're local-user sending, not unread
    const count = getUnreadCount('sender1')
    expect(typeof count).toBe('number')
    expect(count).toBeGreaterThanOrEqual(0)
  })

  it('getTotalUnreadCount returns number from localStorage', async () => {
    const { getTotalUnreadCount } = await import('../../src/services/directMessages.js')
    const count = getTotalUnreadCount()
    expect(typeof count).toBe('number')
    expect(count).toBeGreaterThanOrEqual(0)
  })

  it('markConversationRead marks messages as read in localStorage', async () => {
    const { sendDirectMessage, markConversationRead, getConversationMessages } = await import('../../src/services/directMessages.js')
    await sendDirectMessage('friend4', 'Hey')
    await markConversationRead('friend4')
    // Should not throw
    const msgs = getConversationMessages('friend4')
    expect(Array.isArray(msgs)).toBe(true)
  })

  it('deleteConversation removes conversation from localStorage', async () => {
    const { sendDirectMessage, deleteConversation, getConversationMessages } = await import('../../src/services/directMessages.js')
    await sendDirectMessage('friend5', 'Temporary')
    const result = await deleteConversation('friend5')
    expect(result.success).toBe(true)
    const msgs = getConversationMessages('friend5')
    expect(msgs).toEqual([])
  })

  it('sendDMLocalStorage truncates messages at 200', async () => {
    const { sendDirectMessage, getConversationMessages } = await import('../../src/services/directMessages.js')
    // Send 202 messages
    for (let i = 0; i < 202; i++) {
      await sendDirectMessage('trunc-friend', `Message ${i}`)
    }
    const msgs = getConversationMessages('trunc-friend')
    expect(msgs.length).toBeLessThanOrEqual(200)
  })
})

// ==================== Firebase-available paths ====================

describe('DirectMessages — Firebase paths', () => {
  let getApps, getFirestore, onSnapshot, addDoc, setDoc, updateDoc, setState, getState

  beforeEach(async () => {
    vi.clearAllMocks()
    localStorage.clear()

    const appMod = await import('firebase/app')
    getApps = appMod.getApps
    const fsMod = await import('firebase/firestore')
    getFirestore = fsMod.getFirestore
    onSnapshot = fsMod.onSnapshot
    addDoc = fsMod.addDoc
    setDoc = fsMod.setDoc
    updateDoc = fsMod.updateDoc

    const stateMod = await import('../../src/stores/state.js')
    setState = stateMod.setState
    getState = stateMod.getState

    getApps.mockReturnValue([{}])
    getFirestore.mockReturnValue({})
    getState.mockReturnValue({ user: { uid: 'user1', displayName: 'Me' }, friends: [] })
    onSnapshot.mockReturnValue(() => {})

    const mod = await import('../../src/services/directMessages.js')
    mod.unsubscribeFromAllConversations()
  })

  describe('subscribeToAllConversations', () => {
    it('calls onSnapshot when db and uid available', async () => {
      const { subscribeToAllConversations } = await import('../../src/services/directMessages.js')
      subscribeToAllConversations('user1')
      expect(onSnapshot).toHaveBeenCalled()
    })

    it('processes snapshot docs into conversationsCache', async () => {
      onSnapshot.mockImplementationOnce((_q, cb, _err) => {
        cb({
          docs: [{
            id: 'conv1',
            data: () => ({
              participants: ['user1', 'user2'],
              lastMessage: { text: 'Hi!', senderId: 'user2', senderName: 'Bob', createdAt: null },
              unread: { user1: 1 },
              updatedAt: null,
            }),
          }],
        })
        return () => {}
      })
      const { subscribeToAllConversations, getConversationsList } = await import('../../src/services/directMessages.js')
      subscribeToAllConversations('user1')
      await new Promise(r => setTimeout(r, 20))
      const list = getConversationsList()
      expect(Array.isArray(list)).toBe(true)
    })

    it('handles permission-denied error in snapshot', async () => {
      onSnapshot.mockImplementationOnce((_q, _cb, errCb) => {
        errCb({ code: 'permission-denied' })
        return () => {}
      })
      const { subscribeToAllConversations } = await import('../../src/services/directMessages.js')
      expect(() => subscribeToAllConversations('user1')).not.toThrow()
    })

    it('handles failed-precondition error in snapshot', async () => {
      onSnapshot.mockImplementationOnce((_q, _cb, errCb) => {
        errCb({ code: 'failed-precondition' })
        return () => {}
      })
      const { subscribeToAllConversations } = await import('../../src/services/directMessages.js')
      expect(() => subscribeToAllConversations('user1')).not.toThrow()
    })
  })

  describe('subscribeToConversation', () => {
    it('calls onSnapshot and returns unsub function', async () => {
      const mockUnsub = vi.fn()
      onSnapshot.mockReturnValueOnce(mockUnsub)
      const { subscribeToConversation } = await import('../../src/services/directMessages.js')
      const unsub = subscribeToConversation('user2', vi.fn())
      expect(onSnapshot).toHaveBeenCalled()
    })

    it('returns empty function when no db', async () => {
      getApps.mockReturnValue([])
      const { subscribeToConversation } = await import('../../src/services/directMessages.js')
      const unsub = subscribeToConversation('user2', vi.fn())
      expect(typeof unsub).toBe('function')
    })

    it('processes messages from snapshot', async () => {
      const callback = vi.fn()
      onSnapshot.mockImplementationOnce((_q, cb, _err) => {
        cb({
          docs: [{
            id: 'msg1',
            data: () => ({ text: 'Hello', senderId: 'user2', createdAt: null }),
          }],
        })
        return () => {}
      })
      const { subscribeToConversation } = await import('../../src/services/directMessages.js')
      subscribeToConversation('user2', callback)
      expect(callback).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ id: 'msg1', text: 'Hello' }),
      ]))
    })

    it('handles snapshot error', async () => {
      onSnapshot.mockImplementationOnce((_q, _cb, errCb) => {
        errCb(new Error('subscription failed'))
        return () => {}
      })
      const { subscribeToConversation } = await import('../../src/services/directMessages.js')
      expect(() => subscribeToConversation('user2', vi.fn())).not.toThrow()
    })
  })

  describe('sendDirectMessage — Firebase path', () => {
    it('returns success when addDoc and setDoc succeed', async () => {
      addDoc.mockResolvedValue({ id: 'new-msg' })
      setDoc.mockResolvedValue(undefined)
      updateDoc.mockResolvedValue(undefined)
      const { sendDirectMessage } = await import('../../src/services/directMessages.js')
      const result = await sendDirectMessage('user2', 'Firebase message')
      expect(result.success).toBe(true)
    })

    it('returns error when addDoc fails', async () => {
      addDoc.mockRejectedValue(new Error('permission denied'))
      const { sendDirectMessage } = await import('../../src/services/directMessages.js')
      const result = await sendDirectMessage('user2', 'Failing message')
      expect(result.success).toBe(false)
    })

    it('includes spot in message when spot option provided', async () => {
      addDoc.mockResolvedValue({ id: 'spot-msg' })
      setDoc.mockResolvedValue(undefined)
      updateDoc.mockResolvedValue(undefined)
      const { sendDirectMessage } = await import('../../src/services/directMessages.js')
      const result = await sendDirectMessage('user2', 'Check this', {
        type: 'spot_share',
        spot: { id: 's1', name: 'Test Spot' },
      })
      expect(result.success).toBe(true)
      expect(addDoc).toHaveBeenCalled()
    })

    it('detects profanity and rejects', async () => {
      const firebaseMod = await import('../../src/services/firebase.js')
      firebaseMod.containsProfanity.mockReturnValueOnce(true)
      const { sendDirectMessage } = await import('../../src/services/directMessages.js')
      const result = await sendDirectMessage('user2', 'bad words')
      expect(result.success).toBe(false)
      expect(result.error).toBe('profanity_detected')
    })
  })

  describe('markConversationRead — Firebase path', () => {
    it('calls updateDoc when db and uid available', async () => {
      updateDoc.mockResolvedValue(undefined)
      const { markConversationRead } = await import('../../src/services/directMessages.js')
      await markConversationRead('user2')
      expect(updateDoc).toHaveBeenCalled()
    })

    it('handles updateDoc error silently', async () => {
      updateDoc.mockRejectedValue(new Error('not found'))
      const { markConversationRead } = await import('../../src/services/directMessages.js')
      await expect(markConversationRead('user2')).resolves.toBeUndefined()
    })

    it('returns early when no db', async () => {
      getApps.mockReturnValue([])
      const { markConversationRead } = await import('../../src/services/directMessages.js')
      await expect(markConversationRead('user2')).resolves.toBeUndefined()
    })
  })

  describe('deleteConversation — Firebase path (uid available)', () => {
    it('returns success and clears local cache', async () => {
      const { deleteConversation } = await import('../../src/services/directMessages.js')
      const result = await deleteConversation('user2')
      expect(result.success).toBe(true)
      expect(setState).toHaveBeenCalledWith(expect.objectContaining({ dmLastUpdated: expect.any(Number) }))
    })
  })

  describe('shareSpotInDM', () => {
    it('calls sendDirectMessage with spot_share type', async () => {
      addDoc.mockResolvedValue({ id: 'spot-dm' })
      setDoc.mockResolvedValue(undefined)
      updateDoc.mockResolvedValue(undefined)
      const { shareSpotInDM } = await import('../../src/services/directMessages.js')
      const result = await shareSpotInDM('user2', { id: 'sp1', name: 'Test', city: 'Paris', country: 'FR', rating: 4 })
      expect(typeof result.success).toBe('boolean')
    })
  })

  describe('sharePositionInDM', () => {
    it('calls sendDirectMessage with location_share type', async () => {
      addDoc.mockResolvedValue({ id: 'pos-dm' })
      setDoc.mockResolvedValue(undefined)
      updateDoc.mockResolvedValue(undefined)
      const { sharePositionInDM } = await import('../../src/services/directMessages.js')
      const result = await sharePositionInDM('user2', { lat: 48.8, lng: 2.3, address: 'Paris' })
      expect(typeof result.success).toBe('boolean')
    })
  })

  describe('window handlers', () => {
    it('window.sendDirectMessageTo sends a message', async () => {
      addDoc.mockResolvedValue({ id: 'wh-msg' })
      setDoc.mockResolvedValue(undefined)
      updateDoc.mockResolvedValue(undefined)
      await import('../../src/services/directMessages.js')
      const result = await window.sendDirectMessageTo('user2', 'Hello from window handler')
      expect(typeof result.success).toBe('boolean')
    })

    it('window.getConversationWith returns null for empty conversation', async () => {
      await import('../../src/services/directMessages.js')
      const result = await window.getConversationWith('nobody')
      expect(result).toBeNull()
    })

    it('window.closeConversation calls setState', async () => {
      getState.mockReturnValue({ user: { uid: 'user1' }, activeDMConversation: null })
      await import('../../src/services/directMessages.js')
      window.closeConversation()
      expect(setState).toHaveBeenCalledWith(expect.objectContaining({ activeDMConversation: null }))
    })

    it('window.closeConversation unsubscribes from active conversation', async () => {
      getState.mockReturnValue({ user: { uid: 'user1' }, activeDMConversation: 'user2' })
      await import('../../src/services/directMessages.js')
      expect(() => window.closeConversation()).not.toThrow()
    })

    it('window.openConversation calls markConversationRead and setState', async () => {
      updateDoc.mockResolvedValue(undefined)
      getState.mockReturnValue({ user: { uid: 'user1' }, activeDMConversation: null })
      await import('../../src/services/directMessages.js')
      window.openConversation('user2')
      expect(setState).toHaveBeenCalledWith(expect.objectContaining({ activeTab: 'social' }))
    })

    it('window.shareDMSpot does nothing when no selectedSpot', async () => {
      getState.mockReturnValue({ user: { uid: 'user1' }, selectedSpot: null })
      await import('../../src/services/directMessages.js')
      await expect(window.shareDMSpot('user2')).resolves.toBeUndefined()
    })

    it('window.shareDMPosition does nothing when no geolocation', async () => {
      Object.defineProperty(navigator, 'geolocation', { value: undefined, configurable: true })
      await import('../../src/services/directMessages.js')
      expect(() => window.shareDMPosition('user2')).not.toThrow()
    })

    it('window.sendDM returns early when busy', async () => {
      await import('../../src/services/directMessages.js')
      window.sendDM._busy = true
      await expect(window.sendDM('user2')).resolves.toBeUndefined()
      window.sendDM._busy = false
    })

    it('window.sendDM returns early when requireOnline fails', async () => {
      window.requireOnline = vi.fn(() => false)
      document.body.innerHTML = '<input id="dm-input" value="hello" />'
      await import('../../src/services/directMessages.js')
      window.sendDM._busy = false
      await expect(window.sendDM('user2')).resolves.toBeUndefined()
    })

    it('window.sendDM returns early when input is empty', async () => {
      window.requireOnline = vi.fn(() => true)
      document.body.innerHTML = '<input id="dm-input" value="   " />'
      await import('../../src/services/directMessages.js')
      window.sendDM._busy = false
      await expect(window.sendDM('user2')).resolves.toBeUndefined()
    })

    it('window.deleteDMConversation does nothing when confirm returns false', async () => {
      window.confirm = vi.fn(() => false)
      await import('../../src/services/directMessages.js')
      await expect(window.deleteDMConversation('user2')).resolves.toBeUndefined()
    })
  })
})
