import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ nearbyFriendsEnabled: false, nearbyFriends: [], nearbyNotifications: [] })),
  setState: vi.fn(),
}))
vi.mock('../../src/services/notifications.js', () => ({
  showToast: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg data-icon="${name}"></svg>`),
}))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeJSString: vi.fn((s) => s || ''),
}))
vi.mock('../../src/utils/geo.js', () => ({
  haversineKm: vi.fn(() => 5),
}))

import { getState, setState } from '../../src/stores/state.js'
import {
  stopNearbyFriendsTracking,
  toggleNearbyFriends,
  setNotificationRadius,
  markNotificationRead,
  getUnreadCount,
  renderNearbyFriendsWidget,
  renderNearbyFriendsList,
  renderNearbyFriendsSettings,
} from '../../src/services/nearbyFriends.js'

describe('nearbyFriends service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getState.mockReturnValue({
      nearbyFriendsEnabled: false,
      nearbyFriends: [],
      nearbyNotifications: [],
    })
  })

  describe('stopNearbyFriendsTracking', () => {
    it('runs without error', () => {
      expect(() => stopNearbyFriendsTracking()).not.toThrow()
    })

    it('runs without error when called twice', () => {
      stopNearbyFriendsTracking()
      expect(() => stopNearbyFriendsTracking()).not.toThrow()
    })
  })

  describe('toggleNearbyFriends', () => {
    it('calls setState with enabled=false', () => {
      toggleNearbyFriends(false)
      expect(setState).toHaveBeenCalledWith({ nearbyFriendsEnabled: false })
    })

    it('calls setState with enabled=true', () => {
      toggleNearbyFriends(true)
      expect(setState).toHaveBeenCalledWith({ nearbyFriendsEnabled: true })
    })

    it('runs without error for enabled=false', () => {
      expect(() => toggleNearbyFriends(false)).not.toThrow()
    })

    it('runs without error for enabled=true', () => {
      expect(() => toggleNearbyFriends(true)).not.toThrow()
    })
  })

  describe('setNotificationRadius', () => {
    it('calls setState with the radius', () => {
      setNotificationRadius(30)
      expect(setState).toHaveBeenCalledWith({ nearbyFriendsRadius: 30 })
    })

    it('accepts various radius values', () => {
      expect(() => setNotificationRadius(5)).not.toThrow()
      expect(() => setNotificationRadius(100)).not.toThrow()
    })
  })

  describe('markNotificationRead', () => {
    it('runs without error when no notifications', () => {
      getState.mockReturnValue({ nearbyNotifications: [] })
      expect(() => markNotificationRead('notif-1')).not.toThrow()
    })

    it('marks the matching notification as read', () => {
      getState.mockReturnValue({
        nearbyNotifications: [
          { id: 'notif-1', read: false },
          { id: 'notif-2', read: false },
        ],
      })
      markNotificationRead('notif-1')
      expect(setState).toHaveBeenCalledWith({
        nearbyNotifications: [
          { id: 'notif-1', read: true },
          { id: 'notif-2', read: false },
        ],
      })
    })

    it('does not modify other notifications', () => {
      getState.mockReturnValue({
        nearbyNotifications: [{ id: 'other', read: false }],
      })
      markNotificationRead('notif-1')
      expect(setState).toHaveBeenCalledWith({
        nearbyNotifications: [{ id: 'other', read: false }],
      })
    })
  })

  describe('getUnreadCount', () => {
    it('returns 0 when no notifications', () => {
      getState.mockReturnValue({ nearbyNotifications: [] })
      expect(getUnreadCount()).toBe(0)
    })

    it('returns 0 when all notifications are read', () => {
      getState.mockReturnValue({
        nearbyNotifications: [
          { id: '1', read: true },
          { id: '2', read: true },
        ],
      })
      expect(getUnreadCount()).toBe(0)
    })

    it('counts unread notifications', () => {
      getState.mockReturnValue({
        nearbyNotifications: [
          { id: '1', read: false },
          { id: '2', read: true },
          { id: '3', read: false },
        ],
      })
      expect(getUnreadCount()).toBe(2)
    })

    it('handles undefined nearbyNotifications', () => {
      getState.mockReturnValue({})
      expect(getUnreadCount()).toBe(0)
    })
  })

  describe('renderNearbyFriendsWidget', () => {
    it('returns empty string when disabled', () => {
      const html = renderNearbyFriendsWidget({
        nearbyFriendsEnabled: false,
        nearbyFriends: [{ id: '1' }],
      })
      expect(html).toBe('')
    })

    it('returns empty string when no friends nearby', () => {
      const html = renderNearbyFriendsWidget({
        nearbyFriendsEnabled: true,
        nearbyFriends: [],
      })
      expect(html).toBe('')
    })

    it('returns HTML when enabled and friends are nearby', () => {
      const html = renderNearbyFriendsWidget({
        nearbyFriendsEnabled: true,
        nearbyFriends: [{ id: '1', displayName: 'Alice' }],
      })
      expect(typeof html).toBe('string')
      expect(html).toContain('nearby-friends-widget')
      expect(html).toContain('toggleNearbyFriendsList()')
    })

    it('shows friend count in badge', () => {
      const html = renderNearbyFriendsWidget({
        nearbyFriendsEnabled: true,
        nearbyFriends: [{ id: '1' }, { id: '2' }, { id: '3' }],
      })
      expect(html).toContain('3')
    })
  })

  describe('renderNearbyFriendsList', () => {
    it('returns empty string when showNearbyFriends is false', () => {
      expect(renderNearbyFriendsList({ showNearbyFriends: false })).toBe('')
    })

    it('returns HTML when showNearbyFriends is true', () => {
      const html = renderNearbyFriendsList({
        showNearbyFriends: true,
        nearbyFriends: [],
      })
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(50)
    })

    it('includes closeNearbyFriendsList handler', () => {
      const html = renderNearbyFriendsList({
        showNearbyFriends: true,
        nearbyFriends: [],
      })
      expect(html).toContain('closeNearbyFriendsList()')
    })

    it('shows friend count in header', () => {
      const html = renderNearbyFriendsList({
        showNearbyFriends: true,
        nearbyFriends: [{ id: '1' }, { id: '2' }],
      })
      expect(html).toContain('2')
    })
  })

  describe('renderNearbyFriendsSettings', () => {
    it('returns an HTML string', () => {
      const html = renderNearbyFriendsSettings({
        nearbyFriendsEnabled: false,
        nearbyFriendsRadius: 50,
        nearbyNotifications: [],
      })
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(50)
    })

    it('runs without error', () => {
      expect(() => renderNearbyFriendsSettings({
        nearbyFriendsEnabled: true,
        nearbyFriendsRadius: 30,
        nearbyNotifications: [{ id: '1', read: false, message: 'test' }],
      })).not.toThrow()
    })

    it('renders radius select when nearbyFriendsEnabled=true', () => {
      const html = renderNearbyFriendsSettings({
        nearbyFriendsEnabled: true,
        nearbyFriendsRadius: 25,
        nearbyNotifications: [],
      })
      expect(html).toContain('setNotificationRadius')
    })

    it('marks selected radius option', () => {
      const html = renderNearbyFriendsSettings({
        nearbyFriendsEnabled: true,
        nearbyFriendsRadius: 10,
        nearbyNotifications: [],
      })
      expect(html).toContain('value="10"')
    })
  })

  describe('renderNearbyFriendsList with friends', () => {
    it('renders friend items when friends exist', () => {
      const html = renderNearbyFriendsList({
        showNearbyFriends: true,
        nearbyFriends: [
          { id: '1', userId: 'user1', username: 'Alice', distance: 3 },
        ],
      })
      expect(html).toContain('Alice')
    })

    it('renders openFriendChat handler for each friend', () => {
      const html = renderNearbyFriendsList({
        showNearbyFriends: true,
        nearbyFriends: [
          { id: '1', userId: 'user1', username: 'Bob', distance: 5 },
        ],
      })
      expect(html).toContain("openFriendChat('user1')")
    })
  })

  describe('window.toggleNearbyFriendsList', () => {
    it('calls setState to toggle showNearbyFriends', () => {
      getState.mockReturnValue({ showNearbyFriends: false })
      window.toggleNearbyFriendsList()
      expect(setState).toHaveBeenCalledWith({ showNearbyFriends: true })
    })

    it('closes when already open', () => {
      getState.mockReturnValue({ showNearbyFriends: true })
      window.toggleNearbyFriendsList()
      expect(setState).toHaveBeenCalledWith({ showNearbyFriends: false })
    })
  })

  describe('window.closeNearbyFriendsList', () => {
    it('calls setState with showNearbyFriends: false', () => {
      window.closeNearbyFriendsList()
      expect(setState).toHaveBeenCalledWith({ showNearbyFriends: false })
    })
  })

  describe('window.toggleLocationSharing', () => {
    it('calls setState to enable sharing when disabled', () => {
      getState.mockReturnValue({ shareLocationWithFriends: false })
      window.toggleLocationSharing()
      expect(setState).toHaveBeenCalledWith({ shareLocationWithFriends: true })
    })

    it('calls setState to disable sharing when enabled', () => {
      getState.mockReturnValue({ shareLocationWithFriends: true })
      window.toggleLocationSharing()
      expect(setState).toHaveBeenCalledWith({ shareLocationWithFriends: false })
    })
  })
})

describe('nearbyFriends — additional coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initNearbyFriendsTracking', () => {
    it('starts tracking when nearbyFriendsEnabled is true', () => {
      getState.mockReturnValue({
        nearbyFriendsEnabled: true, nearbyFriends: [], nearbyNotifications: [],
        friendsLocations: [], shareLocationWithFriends: false,
      })
      Object.defineProperty(navigator, 'geolocation', {
        value: {
          watchPosition: vi.fn(() => 99),
          clearWatch: vi.fn(),
        },
        configurable: true, writable: true,
      })
      const { initNearbyFriendsTracking } = require('../../src/services/nearbyFriends.js')
      expect(() => initNearbyFriendsTracking()).not.toThrow()
    })

    it('does not start tracking when disabled', () => {
      getState.mockReturnValue({ nearbyFriendsEnabled: false, nearbyFriends: [], nearbyNotifications: [] })
      const { initNearbyFriendsTracking } = require('../../src/services/nearbyFriends.js')
      expect(() => initNearbyFriendsTracking()).not.toThrow()
    })
  })

  describe('checkNearbyFriends via geolocation mock', () => {
    it('detects nearby friends from state', async () => {
      // Setup state with a nearby friend
      getState.mockReturnValue({
        nearbyFriendsEnabled: true,
        nearbyFriends: [],
        nearbyNotifications: [],
        friendsLocations: [
          { userId: 'friend1', username: 'Alice', avatar: 'star',
            lat: 48.857, lng: 2.352, lastUpdate: Date.now() }
        ],
        nearbyFriendsRadius: 50, // 50km radius
        user: { uid: 'me' },
        shareLocationWithFriends: false,
      })

      // Mock geolocation watchPosition to immediately trigger success
      let capturedSuccess = null
      Object.defineProperty(navigator, 'geolocation', {
        value: {
          watchPosition: vi.fn((success) => { capturedSuccess = success; return 1 }),
          clearWatch: vi.fn(),
          getCurrentPosition: vi.fn((success) => success({ coords: { latitude: 48.8566, longitude: 2.3522, accuracy: 5 } })),
        },
        configurable: true, writable: true,
      })

      // Call start tracking
      const { initNearbyFriendsTracking } = await import('../../src/services/nearbyFriends.js')
      initNearbyFriendsTracking()

      // Trigger position callback if available
      if (capturedSuccess) {
        capturedSuccess({ coords: { latitude: 48.8566, longitude: 2.3522, accuracy: 5 } })
      }

      expect(setState).toHaveBeenCalled()
    })
  })
})
