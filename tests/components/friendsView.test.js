import { describe, it, expect } from 'vitest'
import {
  renderFriends,
  renderFriendsChat,
  renderAddFriendModal,
} from '../../src/components/views/Friends.js'
import { mockUser } from '../mocks/mockSpots.js'

const mockFriends = [
  { id: 'u1', name: 'Alice Martin', username: 'Alice', avatar: null, online: true, points: 120, level: 2 },
  { id: 'u2', name: 'Bob Dupont', username: 'Bob', avatar: null, online: false, points: 80, level: 1 },
]

const mockRequests = [
  { id: 'u3', name: 'Charlie Durand', username: 'Charlie', avatar: null, sentAt: new Date().toISOString() }
]

describe('renderFriends', () => {
  it('renders with empty state', () => {
    const html = renderFriends({ friends: [], friendRequests: [] })
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(50)
  })

  it('renders with friends list', () => {
    const html = renderFriends({ friends: mockFriends, friendRequests: [] })
    expect(html).toContain('Alice')
    expect(html).toContain('Bob')
  })

  it('renders with friend requests', () => {
    const html = renderFriends({ friends: [], friendRequests: mockRequests })
    expect(html).toContain('Charlie')
  })

  it('renders combined friends + requests', () => {
    const html = renderFriends({ friends: mockFriends, friendRequests: mockRequests })
    expect(html).toBeTruthy()
    expect(html).toContain('Alice')
    expect(html).toContain('Charlie')
  })

  it('renders online status', () => {
    const html = renderFriends({ friends: mockFriends, friendRequests: [] })
    expect(html).toBeTruthy()
  })

  it('renders with current user', () => {
    const html = renderFriends({ friends: mockFriends, friendRequests: [], user: mockUser })
    expect(html).toBeTruthy()
  })

  it('renders search state', () => {
    const html = renderFriends({ friends: mockFriends, friendRequests: [], friendSearch: 'Ali' })
    expect(html).toBeTruthy()
  })
})

describe('renderFriendsChat', () => {
  it('renders chat for existing friend', () => {
    const html = renderFriendsChat('u1', { friends: mockFriends, chatMessages: [] })
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(50)
  })

  it('renders chat without messages', () => {
    const html = renderFriendsChat('u1')
    expect(html).toBeTruthy()
  })

  it('renders chat with null friendId', () => {
    const html = renderFriendsChat(null)
    expect(html).toBeTruthy()
  })
})

describe('renderAddFriendModal', () => {
  it('renders add friend modal', () => {
    const html = renderAddFriendModal()
    expect(html).toBeTruthy()
    expect(html).toContain('<button')
  })

  it('renders with search state', () => {
    const html = renderAddFriendModal({ addFriendSearch: 'Alice', addFriendResults: mockFriends })
    expect(html).toBeTruthy()
  })
})
