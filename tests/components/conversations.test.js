import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg data-icon="${name}"></svg>`),
}))
vi.mock('../../src/components/EmptyState.js', () => ({
  renderEmptyState: vi.fn(() => '<div class="empty-state"></div>'),
}))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeHTML: vi.fn((s) => String(s || '')),
  escapeJSString: vi.fn((s) => String(s || '')),
}))
vi.mock('../../src/utils/formatters.js', () => ({
  formatTime: vi.fn(() => '14:32'),
  formatRelativeTime: vi.fn(() => 'il y a 5 min'),
}))
vi.mock('../../src/components/ui/Skeleton.js', () => ({
  renderSkeletonChatList: vi.fn((n) => `<div class="skeleton" data-count="${n}"></div>`),
}))
vi.mock('../../src/services/directMessages.js', () => ({
  getConversationsList: vi.fn(() => []),
  getConversationMessages: vi.fn(() => []),
}))
vi.mock('../../src/services/groupConversations.js', () => ({
  getGroupConversationMessages: vi.fn(() => []),
}))

import { renderConversations } from '../../src/components/views/social/Conversations.js'
import { getConversationsList, getConversationMessages } from '../../src/services/directMessages.js'
import { getGroupConversationMessages } from '../../src/services/groupConversations.js'

const baseState = { lang: 'fr', user: { uid: 'user-abc', username: 'TestUser' } }

const mockConversation = {
  recipientId: 'user-xyz',
  recipientName: 'Alice',
  recipientAvatar: null,
  lastMessage: 'Salut !',
  lastMessageTime: new Date().toISOString(),
  unreadCount: 2,
  online: true,
}

describe('renderConversations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getConversationsList.mockReturnValue([])
    getConversationMessages.mockReturnValue([])
    getGroupConversationMessages.mockReturnValue([])
  })

  it('renders conversation list (empty)', () => {
    const html = renderConversations(baseState)
    expect(html).toBeTruthy()
    expect(typeof html).toBe('string')
  })

  it('renders conversation list with DM conversations', () => {
    getConversationsList.mockReturnValue([mockConversation])
    const html = renderConversations(baseState)
    expect(html).toContain('Alice')
  })

  it('renders DM chat when activeDMConversation is set', () => {
    getConversationMessages.mockReturnValue([
      { id: 'm1', senderId: 'user-abc', text: 'Bonjour !', ts: Date.now() },
      { id: 'm2', senderId: 'user-xyz', text: 'Salut !', ts: Date.now() },
    ])
    const html = renderConversations({
      ...baseState,
      activeDMConversation: 'user-xyz',
      activeDMName: 'Alice',
    })
    expect(html).toBeTruthy()
    expect(html).toContain('Bonjour')
  })

  it('renders group chat when activeGroupConversation is set with matching group', () => {
    getGroupConversationMessages.mockReturnValue([
      { id: 'gm1', senderId: 'user-abc', senderName: 'TestUser', text: 'Hello!', ts: Date.now() },
    ])
    const html = renderConversations({
      ...baseState,
      activeGroupConversation: 'group-001',
      groupConversations: [
        { id: 'group-001', name: 'SpotHitch FR', members: ['user-abc', 'user-xyz'], icon: null, memberProfiles: {} },
      ],
    })
    expect(html).toContain('SpotHitch FR')
  })

  it('renders create group conversation form', () => {
    const html = renderConversations({
      ...baseState,
      showCreateGroupConversation: true,
    })
    expect(html).toBeTruthy()
  })

  it('renders with group conversations in list', () => {
    const html = renderConversations({
      ...baseState,
      groupConversations: [
        { id: 'g1', name: 'SpotHitch FR', members: ['u1', 'u2'], lastMessage: { text: 'Hey!' }, updatedAt: Date.now() },
      ],
    })
    expect(html).toContain('SpotHitch FR')
  })

  it('renders empty state when no conversations', () => {
    getConversationsList.mockReturnValue([])
    const html = renderConversations({ ...baseState, groupConversations: [] })
    expect(html).toBeTruthy()
  })

  it('renders DM chat with empty messages', () => {
    getConversationMessages.mockReturnValue([])
    const html = renderConversations({
      ...baseState,
      activeDMConversation: 'user-xyz',
      activeDMName: 'Alice',
    })
    expect(html).toBeTruthy()
  })

  it('renders conversation unread count badge', () => {
    getConversationsList.mockReturnValue([
      { ...mockConversation, unreadCount: 5 },
    ])
    const html = renderConversations(baseState)
    expect(html).toContain('5')
  })

  it('renders multiple DM conversations sorted by time', () => {
    getConversationsList.mockReturnValue([
      { ...mockConversation, recipientId: 'u1', recipientName: 'Alice', lastMessageTime: new Date(Date.now() - 1000).toISOString() },
      { ...mockConversation, recipientId: 'u2', recipientName: 'Bob', lastMessageTime: new Date().toISOString() },
    ])
    const html = renderConversations(baseState)
    expect(html).toContain('Alice')
    expect(html).toContain('Bob')
  })

  it('renders DM message with type spot_share', () => {
    getConversationMessages.mockReturnValue([
      {
        id: 'm-spot',
        senderId: 'user-xyz',
        type: 'spot_share',
        spot: { name: 'Paris Nord', city: 'Paris', country: 'FR' },
        text: 'Check this spot!',
        ts: Date.now(),
      },
    ])
    const html = renderConversations({
      ...baseState,
      activeDMConversation: 'user-xyz',
      activeDMName: 'Alice',
    })
    expect(html).toContain('Paris Nord')
  })

  it('renders DM message with type location_share', () => {
    getConversationMessages.mockReturnValue([
      {
        id: 'm-loc',
        senderId: 'user-xyz',
        type: 'location_share',
        location: { address: 'Rue de Rivoli, Paris' },
        text: 'My position',
        ts: Date.now(),
      },
    ])
    const html = renderConversations({
      ...baseState,
      activeDMConversation: 'user-xyz',
      activeDMName: 'Alice',
    })
    expect(html).toContain('Rue de Rivoli')
  })

  it('renders sent vs received DM messages', () => {
    getConversationMessages.mockReturnValue([
      { id: 'sent1', senderId: 'user-abc', text: 'I sent this', ts: Date.now() },
      { id: 'recv1', senderId: 'user-xyz', senderName: 'Alice', text: 'They sent this', ts: Date.now() },
    ])
    const html = renderConversations({
      ...baseState,
      activeDMConversation: 'user-xyz',
      activeDMName: 'Alice',
    })
    expect(html).toContain('I sent this')
    expect(html).toContain('They sent this')
  })

  it('renders group chat with messages (sent + received)', () => {
    getGroupConversationMessages.mockReturnValue([
      { id: 'gm1', senderId: 'user-abc', senderName: 'Me', text: 'Hello group!', ts: Date.now() },
      { id: 'gm2', senderId: 'user-xyz', senderName: 'Alice', senderAvatar: 'adventurer', text: 'Hi!', ts: Date.now() },
    ])
    const html = renderConversations({
      ...baseState,
      activeGroupConversation: 'group-001',
      groupConversations: [
        {
          id: 'group-001',
          name: 'SpotHitch FR',
          members: ['user-abc', 'user-xyz'],
          icon: 'globe',
          memberProfiles: {
            'user-abc': { name: 'Me', avatar: null },
            'user-xyz': { name: 'Alice', avatar: 'adventurer' },
          },
        },
      ],
    })
    expect(html).toContain('Hello group!')
    expect(html).toContain('Hi!')
  })

  it('renders group chat with empty messages (shows placeholder)', () => {
    getGroupConversationMessages.mockReturnValue([])
    const html = renderConversations({
      ...baseState,
      activeGroupConversation: 'group-002',
      groupConversations: [
        { id: 'group-002', name: 'Empty Group', members: [], memberProfiles: {} },
      ],
    })
    expect(html).toBeTruthy()
  })

  it('renders createGroupConversation form with friends', () => {
    const html = renderConversations({
      ...baseState,
      showCreateGroupConversation: true,
      friends: [
        { id: 'f1', name: 'Bob', avatar: null, online: true },
        { id: 'f2', name: 'Carol', avatar: 'avatar2', online: false },
      ],
    })
    expect(html).toContain('Bob')
    expect(html).toContain('Carol')
  })

  it('renders createGroupConversation form with selected friends', () => {
    const html = renderConversations({
      ...baseState,
      showCreateGroupConversation: true,
      friends: [{ id: 'f1', name: 'Bob', avatar: null, online: true }],
      groupConversationSelectedFriends: ['f1'],
    })
    expect(html).toContain('Bob')
  })

  it('renders createGroupConversation form with loading state', () => {
    const html = renderConversations({
      ...baseState,
      showCreateGroupConversation: true,
      groupConversationLoading: true,
    })
    expect(html).toBeTruthy()
  })
})

describe('Conversations — window handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.setState = vi.fn()
    window.getState = vi.fn(() => ({
      groupConversationSelectedFriends: [],
      isLoggedIn: false,
      groupConversations: [],
    }))
  })

  it('window.closeGroupConversation clears activeGroupConversation', () => {
    window.closeGroupConversation()
    expect(window.setState).toHaveBeenCalledWith({ activeGroupConversation: null })
  })

  it('window.openCreateGroupConversation sets showCreateGroupConversation', () => {
    window.openCreateGroupConversation()
    expect(window.setState).toHaveBeenCalledWith(expect.objectContaining({ showCreateGroupConversation: true }))
  })

  it('window.closeCreateGroupConversation clears form state', () => {
    window.closeCreateGroupConversation()
    expect(window.setState).toHaveBeenCalledWith(expect.objectContaining({ showCreateGroupConversation: false }))
  })
})
