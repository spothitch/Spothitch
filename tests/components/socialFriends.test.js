import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg data-icon="${name}"></svg>`),
}))
vi.mock('../../src/utils/searchInput.js', () => ({
  renderSearchInput: vi.fn(() => '<input id="friend-search" />'),
}))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeHTML: vi.fn((s) => String(s || '')),
  escapeJSString: vi.fn((s) => String(s || '')),
}))
vi.mock('../../src/services/identityVerification.js', () => ({
  getTrustBadge: vi.fn(() => ''),
}))
vi.mock('../../src/services/ambassadors.js', () => ({
  getAmbassadors: vi.fn(() => []),
  searchAmbassadors: vi.fn(() => []),
}))

import { renderFriends } from '../../src/components/views/social/Friends.js'
import { getAmbassadors, searchAmbassadors } from '../../src/services/ambassadors.js'

const baseState = { lang: 'fr', user: { uid: 'user-abc', username: 'TestUser' } }

const mockFriends = [
  { id: 'f1', name: 'Alice Martin', online: true, avatar: null, points: 200, level: 3 },
  { id: 'f2', name: 'Bob Dupont', online: false, avatar: null, points: 80, level: 1 },
]

const mockAmbassadors = [
  { uid: 'amb-1', username: 'Ambassador1', country: 'FR', photoURL: null, points: 500, level: 5, verified: true },
]

describe('renderFriends', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getAmbassadors.mockReturnValue([])
    searchAmbassadors.mockReturnValue([])
  })

  it('renders empty friends list', () => {
    const html = renderFriends(baseState)
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(50)
  })

  it('renders friend search input', () => {
    const html = renderFriends(baseState)
    expect(html).toContain('friend-search')
  })

  it('renders add friend button', () => {
    const html = renderFriends(baseState)
    expect(html).toContain('addFriendByName()')
  })

  it('renders friends list with online/offline status', () => {
    const html = renderFriends({ ...baseState, friends: mockFriends })
    expect(html).toContain('Alice Martin')
    expect(html).toContain('Bob Dupont')
  })

  it('renders friend requests when pending', () => {
    const html = renderFriends({
      ...baseState,
      friendRequests: [
        { id: 'req-1', fromUserId: 'user-x', fromName: 'Charlie', fromAvatar: null },
      ],
    })
    expect(html).toBeTruthy()
  })

  it('renders search results when friendSearchResults is set', () => {
    const html = renderFriends({
      ...baseState,
      friendSearchResults: [
        { uid: 'found-1', username: 'FoundUser', photoURL: null, points: 100, level: 2 },
      ],
    })
    expect(html).toContain('FoundUser')
  })

  it('renders empty search results message', () => {
    const html = renderFriends({ ...baseState, friendSearchResults: [] })
    expect(html).toContain('noUsersFound')
  })

  it('renders loading state during friend search', () => {
    const html = renderFriends({ ...baseState, friendSearchLoading: true })
    expect(html).toContain('animate-spin')
  })

  it('renders ambassadors section', () => {
    getAmbassadors.mockReturnValue(mockAmbassadors)
    const html = renderFriends({ ...baseState })
    expect(html).toBeTruthy()
  })

  it('renders ambassador search results', () => {
    searchAmbassadors.mockReturnValue(mockAmbassadors)
    const html = renderFriends({
      ...baseState,
      ambassadorSearchQuery: 'France',
    })
    expect(html).toBeTruthy()
  })

  it('renders with null friendSearchResults (no search yet)', () => {
    const html = renderFriends({ ...baseState, friendSearchResults: null })
    expect(html).toBeTruthy()
  })

  it('renders multiple friends with open conversation buttons', () => {
    const html = renderFriends({ ...baseState, friends: mockFriends })
    expect(html).toContain('openConversation(')
  })

  it('renders friend profile button', () => {
    const html = renderFriends({ ...baseState, friends: mockFriends })
    expect(html).toContain('showFriendProfile(')
  })
})
