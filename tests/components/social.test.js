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
vi.mock('../../src/utils/searchInput.js', () => ({
  renderSearchInput: vi.fn(() => '<input id="social-search" />'),
}))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeHTML: vi.fn((s) => String(s || '')),
  escapeJSString: vi.fn((s) => String(s || '')),
}))
vi.mock('../../src/utils/customSelect.js', () => ({
  renderCustomSelect: vi.fn(() => '<select></select>'),
}))
vi.mock('../../src/utils/formatters.js', () => ({
  formatRelativeTime: vi.fn(() => 'il y a 5 min'),
  formatEventDate: vi.fn(() => '01/06/2026'),
}))
vi.mock('../../src/components/views/social/Conversations.js', () => ({
  renderConversations: vi.fn(() => '<div class="conversations"></div>'),
}))
vi.mock('../../src/components/views/social/Voyageurs.js', () => ({
  renderVoyageurs: vi.fn(() => '<div class="voyageurs"></div>'),
}))
vi.mock('../../src/components/views/social/GuardianWatch.js', () => ({
  renderGuardianWatch: vi.fn(() => '<div class="guardian-watch"></div>'),
}))
vi.mock('../../src/components/views/social/CountryChats.js', () => ({
  renderCountryChats: vi.fn(() => '<div class="country-chats"></div>'),
}))
vi.mock('../../src/components/ui/Skeleton.js', () => ({
  renderSkeletonChatList: vi.fn((n) => `<div class="skeleton" data-count="${n}"></div>`),
}))
vi.mock('../../src/services/directMessages.js', () => ({
  getConversationsList: vi.fn(() => []),
}))
vi.mock('../../src/services/events.js', () => ({
  getUpcomingEvents: vi.fn(() => []),
  getEventComments: vi.fn(() => []),
  EVENT_TYPES: {
    meetup: { icon: '[meetup]', label: 'Meetup' },
    group_departure: { icon: '[group]', label: 'Départ groupé' },
    hostel_party: { icon: '[party]', label: 'Soirée hostel' },
    tips_exchange: { icon: '[tips]', label: 'Échange de bons plans' },
  },
}))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
}))

import { renderSocial } from '../../src/components/views/Social.js'
import { getConversationsList } from '../../src/services/directMessages.js'
import { getUpcomingEvents } from '../../src/services/events.js'

const baseState = { lang: 'fr' }

describe('renderSocial', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getConversationsList.mockReturnValue([])
    getUpcomingEvents.mockReturnValue([])
  })

  it('renders messagerie tab (default)', () => {
    const html = renderSocial(baseState)
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(50)
    expect(html).toContain("setSocialTab('messagerie')")
  })

  it('renders voyageurs tab', () => {
    const html = renderSocial({ ...baseState, socialSubTab: 'voyageurs' })
    expect(html).toContain("setSocialTab('voyageurs')")
    expect(html).toContain('voyageurs')
  })

  it('renders evenements tab', () => {
    const html = renderSocial({ ...baseState, socialSubTab: 'evenements' })
    expect(html).toContain("setSocialTab('evenements')")
  })

  it('renders active DM conversation (full screen)', () => {
    const html = renderSocial({ ...baseState, activeDMConversation: 'user-abc' })
    expect(html).toContain('conversations')
  })

  it('renders active group conversation (full screen)', () => {
    const html = renderSocial({ ...baseState, activeGroupConversation: 'group-123' })
    expect(html).toContain('conversations')
  })

  it('renders create event form', () => {
    const html = renderSocial({ ...baseState, showCreateEvent: true })
    expect(html).toBeTruthy()
  })

  it('renders companion search sub-view', () => {
    const html = renderSocial({ ...baseState, showCompanionSearch: true })
    expect(html).toBeTruthy()
  })

  it('renders create group conversation form', () => {
    const html = renderSocial({ ...baseState, showCreateGroupConversation: true })
    expect(html).toContain('conversations')
  })

  it('renders loading skeleton when chatLoading', () => {
    const html = renderSocial({ ...baseState, chatLoading: true })
    expect(html).toContain('skeleton')
  })

  it('renders with friends (online and offline)', () => {
    const html = renderSocial({
      ...baseState,
      friends: [
        { id: 'f1', name: 'Alice', online: true, avatar: null },
        { id: 'f2', name: 'Bob', online: false, avatar: null },
      ],
    })
    expect(html).toContain('openConversation(')
  })

  it('renders with unread DM badge', () => {
    const html = renderSocial({ ...baseState, unreadDMCount: 3 })
    expect(html).toContain('3')
  })

  it('renders conversations from directMessages service', () => {
    getConversationsList.mockReturnValue([
      {
        recipientId: 'user-1',
        recipientName: 'Alice',
        recipientAvatar: null,
        lastMessage: 'Bonjour !',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 2,
        online: true,
      },
    ])
    const html = renderSocial(baseState)
    expect(html).toBeTruthy()
  })

  it('renders with group conversations', () => {
    const html = renderSocial({
      ...baseState,
      groupConversations: [
        { id: 'g1', name: 'SpotHitch FR', members: ['u1', 'u2'], lastMessage: { text: 'Salut !' }, updatedAt: Date.now() },
      ],
    })
    expect(html).toBeTruthy()
  })

  it('renders friend requests badge', () => {
    const html = renderSocial({
      ...baseState,
      friendRequests: [{ id: 'req-1', from: 'user-x' }],
    })
    expect(html).toBeTruthy()
  })

  it('renders selected event detail', () => {
    const html = renderSocial({
      ...baseState,
      selectedEvent: { id: 'evt-1', title: 'Meetup Paris', type: 'meetup', date: Date.now() },
    })
    expect(html).toBeTruthy()
  })

  it('renders evenements tab with events', () => {
    getUpcomingEvents.mockReturnValue([
      { id: 'e1', title: 'Meetup Lyon', type: 'meetup', date: Date.now(), attendees: ['u1'] },
    ])
    const html = renderSocial({ ...baseState, socialSubTab: 'evenements' })
    expect(html).toBeTruthy()
  })
})
