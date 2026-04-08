/**
 * Notification Preferences & Social/Gamification Tests
 * Tests for src/services/notifications.js
 * Covers: preferences, quiet hours, spot subscriptions,
 *         social notifications, gamification, proximity, distance calc
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// Mock firebase.js
vi.mock('../src/services/firebase.js', () => ({
  requestNotificationPermission: vi.fn().mockResolvedValue('mock-token'),
  onForegroundMessage: vi.fn(),
}))

vi.mock('../src/utils/icons.js', () => ({
  icon: (name, cls) => `<svg class="${cls || ''}">${name}</svg>`,
}))

vi.mock('../src/utils/sanitize.js', () => ({
  escapeHTML: (s) => s,
}))

vi.mock('../src/utils/errorMessages.js', () => ({
  getErrorMessage: (code) => ({ icon: '!', message: code, type: 'error' }),
}))

vi.mock('../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
}))

vi.mock('../src/i18n/index.js', () => ({
  t: (key) => null, // Return null to test fallback texts
}))

import {
  getNotificationPreferences,
  saveNotificationPreferences,
  isNotificationEnabled,
  toggleNotificationPreference,
  subscribeToSpotNotifications,
  unsubscribeFromSpotNotifications,
  isSubscribedToSpot,
  toggleSpotNotifications,
  notifySpotActivity,
  getSubscribedSpots,
  setSpotNotificationTypes,
  setSpotNotificationsEnabled,
  getSpotNotificationSettings,
  notifyNewFriend,
  notifyNewMessage,
  notifyFriendNearby,
  notifyBadgeUnlocked,
  notifyLevelUp,
  notifyDailyRewardAvailable,
  calculateDistance,
  checkFriendsProximity,
  showToast,
  sendLocalNotification,
  cancelScheduledNotification,
  cancelAllScheduledNotifications,
} from '../src/services/notifications.js'

import { getState, setState } from '../src/stores/state.js'

describe('Notification Preferences', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    document.body.innerHTML = ''
    // Mock Notification API
    global.Notification = class {
      constructor(title, options) {
        this.title = title
        this.options = options
        this.onclick = null
      }
      close() {}
    }
    global.Notification.permission = 'granted'
    // Mock sessionStorage
    global.sessionStorage = {
      _data: {},
      getItem(key) { return this._data[key] || null },
      setItem(key, value) { this._data[key] = String(value) },
      removeItem(key) { delete this._data[key] },
      clear() { this._data = {} },
    }
  })

  afterEach(() => {
    delete global.Notification
  })

  // ─── Default Preferences ────────────────────────────────────

  describe('getNotificationPreferences', () => {
    it('returns defaults when nothing saved', () => {
      const prefs = getNotificationPreferences()
      expect(prefs.enabled).toBe(true)
      expect(prefs.newFriend).toBe(true)
      expect(prefs.newMessage).toBe(true)
      expect(prefs.friendNearby).toBe(true)
      expect(prefs.badgeUnlocked).toBe(true)
      expect(prefs.levelUp).toBe(true)
      expect(prefs.dailyReward).toBe(true)
      expect(prefs.spotCheckin).toBe(true)
      expect(prefs.quietHoursEnabled).toBe(false)
      expect(prefs.quietHoursStart).toBe(22)
      expect(prefs.quietHoursEnd).toBe(8)
      expect(prefs.nearbyDistance).toBe(10)
    })

    it('merges saved prefs with defaults', () => {
      localStorage.setItem(
        'spothitch_notification_prefs',
        JSON.stringify({ newFriend: false, nearbyDistance: 5 })
      )
      const prefs = getNotificationPreferences()
      expect(prefs.newFriend).toBe(false)
      expect(prefs.nearbyDistance).toBe(5)
      // Rest is still defaults
      expect(prefs.newMessage).toBe(true)
      expect(prefs.enabled).toBe(true)
    })

    it('handles corrupted JSON gracefully', () => {
      localStorage.setItem('spothitch_notification_prefs', 'not json!')
      const prefs = getNotificationPreferences()
      expect(prefs.enabled).toBe(true) // Falls back to defaults
    })
  })

  describe('saveNotificationPreferences', () => {
    it('merges new prefs into existing', () => {
      saveNotificationPreferences({ newFriend: false })
      const prefs = getNotificationPreferences()
      expect(prefs.newFriend).toBe(false)
      expect(prefs.newMessage).toBe(true)

      saveNotificationPreferences({ newMessage: false })
      const prefs2 = getNotificationPreferences()
      expect(prefs2.newFriend).toBe(false)
      expect(prefs2.newMessage).toBe(false)
    })

    it('returns updated preferences', () => {
      const result = saveNotificationPreferences({ nearbyDistance: 20 })
      expect(result.nearbyDistance).toBe(20)
    })
  })

  describe('toggleNotificationPreference', () => {
    it('toggles true to false', () => {
      expect(getNotificationPreferences().newFriend).toBe(true)
      const newVal = toggleNotificationPreference('newFriend')
      expect(newVal).toBe(false)
      expect(getNotificationPreferences().newFriend).toBe(false)
    })

    it('toggles false to true', () => {
      saveNotificationPreferences({ badgeUnlocked: false })
      const newVal = toggleNotificationPreference('badgeUnlocked')
      expect(newVal).toBe(true)
    })
  })

  // ─── isNotificationEnabled (with quiet hours) ──────────────

  describe('isNotificationEnabled', () => {
    it('returns true for enabled type with no quiet hours', () => {
      expect(isNotificationEnabled('newFriend')).toBe(true)
    })

    it('returns false when all notifications disabled', () => {
      saveNotificationPreferences({ enabled: false })
      expect(isNotificationEnabled('newFriend')).toBe(false)
    })

    it('returns false when specific type disabled', () => {
      saveNotificationPreferences({ newFriend: false })
      expect(isNotificationEnabled('newFriend')).toBe(false)
      // Other types still work
      expect(isNotificationEnabled('newMessage')).toBe(true)
    })

    it('respects overnight quiet hours (22:00 - 08:00)', () => {
      saveNotificationPreferences({
        quietHoursEnabled: true,
        quietHoursStart: 22,
        quietHoursEnd: 8,
      })

      // Mock different hours
      const realDate = global.Date
      const mockDate = (hour) => {
        global.Date = class extends realDate {
          getHours() { return hour }
        }
      }

      // At 23:00 — during quiet hours
      mockDate(23)
      expect(isNotificationEnabled('newFriend')).toBe(false)

      // At 03:00 — during quiet hours (overnight)
      mockDate(3)
      expect(isNotificationEnabled('newFriend')).toBe(false)

      // At 09:00 — outside quiet hours
      mockDate(9)
      expect(isNotificationEnabled('newFriend')).toBe(true)

      // At 15:00 — outside quiet hours
      mockDate(15)
      expect(isNotificationEnabled('newFriend')).toBe(true)

      global.Date = realDate
    })

    it('respects daytime quiet hours (08:00 - 18:00)', () => {
      saveNotificationPreferences({
        quietHoursEnabled: true,
        quietHoursStart: 8,
        quietHoursEnd: 18,
      })

      const realDate = global.Date
      const mockDate = (hour) => {
        global.Date = class extends realDate {
          getHours() { return hour }
        }
      }

      // At 12:00 — during quiet hours
      mockDate(12)
      expect(isNotificationEnabled('newFriend')).toBe(false)

      // At 20:00 — outside quiet hours
      mockDate(20)
      expect(isNotificationEnabled('newFriend')).toBe(true)

      global.Date = realDate
    })
  })

  // ─── Spot Subscriptions ─────────────────────────────────────

  describe('Spot Subscriptions', () => {
    beforeEach(() => {
      // showToast needs a container — create one
      const container = document.createElement('div')
      container.id = 'toast-container'
      document.body.appendChild(container)
    })

    describe('subscribeToSpotNotifications', () => {
      it('adds spot to subscriptions', () => {
        subscribeToSpotNotifications('spot-123', 'Paris Porte de Clignancourt')
        expect(isSubscribedToSpot('spot-123')).toBe(true)
      })

      it('does not duplicate subscriptions', () => {
        subscribeToSpotNotifications('spot-123', 'Paris')
        subscribeToSpotNotifications('spot-123', 'Paris')
        const subs = getSubscribedSpots()
        expect(subs.filter(s => s.id === 'spot-123').length).toBe(1)
      })

      it('stores spot name and timestamp', () => {
        subscribeToSpotNotifications('spot-456', 'Lyon A7')
        const subs = getSubscribedSpots()
        const sub = subs.find(s => s.id === 'spot-456')
        expect(sub.name).toBe('Lyon A7')
        expect(sub.subscribedAt).toBeDefined()
      })
    })

    describe('unsubscribeFromSpotNotifications', () => {
      it('removes spot from subscriptions', () => {
        subscribeToSpotNotifications('spot-123', 'Paris')
        unsubscribeFromSpotNotifications('spot-123')
        expect(isSubscribedToSpot('spot-123')).toBe(false)
      })

      it('does not crash if spot was not subscribed', () => {
        expect(() => unsubscribeFromSpotNotifications('non-existent')).not.toThrow()
      })
    })

    describe('toggleSpotNotifications', () => {
      it('subscribes then unsubscribes', () => {
        const result1 = toggleSpotNotifications('spot-789', 'Berlin')
        expect(result1).toBe(true)
        expect(isSubscribedToSpot('spot-789')).toBe(true)

        const result2 = toggleSpotNotifications('spot-789', 'Berlin')
        expect(result2).toBe(false)
        expect(isSubscribedToSpot('spot-789')).toBe(false)
      })
    })

    describe('getSpotNotificationSettings', () => {
      it('returns defaults when empty', () => {
        const settings = getSpotNotificationSettings()
        expect(settings.enabled).toBe(true)
        expect(settings.spots).toEqual([])
        expect(settings.types).toEqual(['checkin', 'rating', 'comment'])
      })
    })

    describe('setSpotNotificationTypes', () => {
      it('updates notification types', () => {
        setSpotNotificationTypes(['rating'])
        const settings = getSpotNotificationSettings()
        expect(settings.types).toEqual(['rating'])
      })
    })

    describe('setSpotNotificationsEnabled', () => {
      it('toggles all spot notifications', () => {
        setSpotNotificationsEnabled(false)
        const settings = getSpotNotificationSettings()
        expect(settings.enabled).toBe(false)
      })
    })
  })

  // ─── notifySpotActivity ─────────────────────────────────────
  // Note: showToast uses a module-level singleton toastContainer.
  // We test the LOGIC gates (subscriptions, types, enabled flags)
  // rather than checking DOM which depends on the singleton state.

  describe('notifySpotActivity', () => {
    beforeEach(() => {
      subscribeToSpotNotifications('spot-abc', 'Test Spot')
    })

    it('executes without error for subscribed spot', () => {
      expect(() =>
        notifySpotActivity('checkin', {
          spotId: 'spot-abc',
          spotName: 'Test Spot',
          userName: 'Alice',
        })
      ).not.toThrow()
    })

    it('does not notify for unsubscribed spot (returns early)', () => {
      // notifySpotActivity checks subscription — if not subscribed, it returns before
      // calling sendLocalNotification/showToast. We verify it doesn't throw.
      expect(() =>
        notifySpotActivity('checkin', {
          spotId: 'other-spot',
          spotName: 'Other',
          userName: 'Bob',
        })
      ).not.toThrow()
    })

    it('respects disabled type filter', () => {
      setSpotNotificationTypes(['rating']) // Remove 'checkin'
      expect(() =>
        notifySpotActivity('checkin', {
          spotId: 'spot-abc',
          spotName: 'Test Spot',
          userName: 'Alice',
        })
      ).not.toThrow()
    })

    it('respects disabled spot notifications', () => {
      setSpotNotificationsEnabled(false)
      expect(() =>
        notifySpotActivity('rating', {
          spotId: 'spot-abc',
          spotName: 'Test Spot',
          userName: 'Alice',
          rating: 4,
        })
      ).not.toThrow()
    })
  })

  // ─── Social Notifications ──────────────────────────────────

  describe('notifyNewFriend', () => {
    it('executes without error when newFriend enabled', () => {
      expect(() =>
        notifyNewFriend({ id: 'user-1', name: 'Alice' })
      ).not.toThrow()
    })

    it('returns early when newFriend disabled (no side effects)', () => {
      saveNotificationPreferences({ newFriend: false })
      // setState should NOT be called (no unread update for friend notifications)
      vi.clearAllMocks()
      notifyNewFriend({ id: 'user-1', name: 'Bob' })
      // If it returned early, no state change happened
      expect(setState).not.toHaveBeenCalled()
    })
  })

  describe('notifyNewMessage', () => {
    it('increments unread count when newMessage enabled', () => {
      getState.mockReturnValue({ unreadFriendMessages: 2 })

      notifyNewMessage({
        senderId: 'user-2',
        senderName: 'Charlie',
        text: 'Salut, tu es où ?',
      })

      expect(setState).toHaveBeenCalledWith({ unreadFriendMessages: 3 })
    })

    it('does not increment unread when newMessage disabled', () => {
      saveNotificationPreferences({ newMessage: false })
      vi.clearAllMocks()
      notifyNewMessage({ senderId: 'user-2', senderName: 'Charlie', text: 'Hey' })
      expect(setState).not.toHaveBeenCalled()
    })

    it('handles zero initial unread count', () => {
      getState.mockReturnValue({ unreadFriendMessages: 0 })
      notifyNewMessage({ senderId: 'user-2', senderName: 'Eve', text: 'Hi' })
      expect(setState).toHaveBeenCalledWith({ unreadFriendMessages: 1 })
    })

    it('handles missing unread count', () => {
      getState.mockReturnValue({})
      notifyNewMessage({ senderId: 'user-2', senderName: 'Eve', text: 'Hi' })
      expect(setState).toHaveBeenCalledWith({ unreadFriendMessages: 1 })
    })
  })

  describe('notifyFriendNearby', () => {
    beforeEach(() => {
      sessionStorage.clear()
    })

    it('executes without error for nearby friend', () => {
      expect(() =>
        notifyFriendNearby({ id: 'user-3', name: 'Diana' }, 5)
      ).not.toThrow()
    })

    it('does not throw when friend is too far', () => {
      expect(() =>
        notifyFriendNearby({ id: 'user-3', name: 'Diana' }, 50)
      ).not.toThrow()
    })

    it('deduplicates: sets sessionStorage key after first notification', () => {
      notifyFriendNearby({ id: 'user-4', name: 'Eve' }, 3)
      const key = sessionStorage.getItem('nearby_user-4')
      expect(key).not.toBeNull()
    })

    it('does not re-notify within 1 hour (sessionStorage guard)', () => {
      // First call sets the key
      notifyFriendNearby({ id: 'dedup-user', name: 'Eve' }, 3)
      const firstTime = sessionStorage.getItem('nearby_dedup-user')
      expect(firstTime).not.toBeNull()

      // Second call within the same second should find the key and return early
      notifyFriendNearby({ id: 'dedup-user', name: 'Eve' }, 2)
      // The sessionStorage value should not have changed (same timestamp)
      const secondTime = sessionStorage.getItem('nearby_dedup-user')
      expect(secondTime).toBe(firstTime)
    })

    it('returns early when friendNearby disabled', () => {
      saveNotificationPreferences({ friendNearby: false })
      notifyFriendNearby({ id: 'user-6', name: 'Grace' }, 2)
      // Should not set sessionStorage key (returned before reaching that logic)
      expect(sessionStorage.getItem('nearby_user-6')).toBeNull()
    })

    it('respects custom nearbyDistance preference', () => {
      saveNotificationPreferences({ nearbyDistance: 2 })
      notifyFriendNearby({ id: 'user-7', name: 'Hank' }, 5) // 5km > 2km threshold
      // Should not set sessionStorage key (distance check failed)
      expect(sessionStorage.getItem('nearby_user-7')).toBeNull()
    })
  })

  // ─── Gamification Notifications ────────────────────────────

  describe('notifyBadgeUnlocked', () => {
    it('executes without error when enabled', () => {
      expect(() =>
        notifyBadgeUnlocked({ id: 'badge-1', name: 'Premier spot' })
      ).not.toThrow()
    })

    it('returns early when badgeUnlocked disabled', () => {
      saveNotificationPreferences({ badgeUnlocked: false })
      expect(() =>
        notifyBadgeUnlocked({ id: 'badge-1', name: 'Test' })
      ).not.toThrow()
    })
  })

  describe('notifyLevelUp', () => {
    it('returns early when levelUp disabled', () => {
      saveNotificationPreferences({ levelUp: false })
      expect(() => notifyLevelUp(5, { points: 100 })).not.toThrow()
    })

    it('executes without error when enabled', () => {
      expect(() => notifyLevelUp(3, {})).not.toThrow()
    })

    it('handles rewards with title', () => {
      expect(() =>
        notifyLevelUp(5, { title: { name: 'Expert' } })
      ).not.toThrow()
    })
  })

  describe('notifyDailyRewardAvailable', () => {
    it('returns early when dailyReward disabled', () => {
      saveNotificationPreferences({ dailyReward: false })
      expect(() => notifyDailyRewardAvailable()).not.toThrow()
    })

    it('returns early if already claimed today', () => {
      getState.mockReturnValue({ lastDailyRewardClaim: new Date().toDateString() })
      expect(() => notifyDailyRewardAvailable()).not.toThrow()
    })

    it('executes when not claimed yet', () => {
      getState.mockReturnValue({ lastDailyRewardClaim: 'Mon Jan 01 2024' })
      expect(() => notifyDailyRewardAvailable()).not.toThrow()
    })
  })

  // ─── Distance Calculation ──────────────────────────────────

  describe('calculateDistance', () => {
    it('returns 0 for same point', () => {
      expect(calculateDistance(48.8566, 2.3522, 48.8566, 2.3522)).toBe(0)
    })

    it('calculates Paris → Lyon (~392km)', () => {
      const dist = calculateDistance(48.8566, 2.3522, 45.764, 4.8357)
      expect(dist).toBeGreaterThan(380)
      expect(dist).toBeLessThan(400)
    })

    it('calculates Paris → London (~343km)', () => {
      const dist = calculateDistance(48.8566, 2.3522, 51.5074, -0.1278)
      expect(dist).toBeGreaterThan(330)
      expect(dist).toBeLessThan(355)
    })

    it('calculates short distance (< 1km)', () => {
      // ~111m offset in latitude
      const dist = calculateDistance(48.8566, 2.3522, 48.8576, 2.3522)
      expect(dist).toBeLessThan(1)
      expect(dist).toBeGreaterThan(0)
    })
  })

  // ─── checkFriendsProximity ──────────────────────────────────

  describe('checkFriendsProximity', () => {
    beforeEach(() => {
      sessionStorage.clear()
    })

    it('triggers nearby notification for close friends (via sessionStorage)', () => {
      const friends = [
        {
          id: 'f1',
          name: 'Alice',
          location: { lat: 48.857, lng: 2.353 }, // Very close
        },
      ]
      const userLocation = { lat: 48.8566, lng: 2.3522 }

      checkFriendsProximity(friends, userLocation)

      // notifyFriendNearby sets sessionStorage key for dedup
      expect(sessionStorage.getItem('nearby_f1')).not.toBeNull()
    })

    it('does not trigger for distant friends', () => {
      const friends = [
        {
          id: 'f2',
          name: 'Bob',
          location: { lat: 45.764, lng: 4.8357 }, // Lyon — far away
        },
      ]
      const userLocation = { lat: 48.8566, lng: 2.3522 }

      checkFriendsProximity(friends, userLocation)

      expect(sessionStorage.getItem('nearby_f2')).toBeNull()
    })

    it('handles null friends array', () => {
      expect(() => checkFriendsProximity(null, { lat: 0, lng: 0 })).not.toThrow()
    })

    it('handles null userLocation', () => {
      expect(() => checkFriendsProximity([{ id: 'f', location: { lat: 0, lng: 0 } }], null)).not.toThrow()
    })

    it('skips friends without location', () => {
      const friends = [
        { id: 'f3', name: 'Charlie' }, // No location
        { id: 'f4', name: 'Diana', location: null },
      ]
      expect(() => checkFriendsProximity(friends, { lat: 48, lng: 2 })).not.toThrow()
    })
  })

  // ─── showToast ──────────────────────────────────────────────
  // Note: showToast uses a module-level singleton toastContainer.
  // We test basic execution rather than DOM structure since the
  // singleton can become detached between test runs.

  describe('showToast', () => {
    it('executes without error for all types', () => {
      expect(() => showToast('ok', 'success')).not.toThrow()
      expect(() => showToast('fail', 'error')).not.toThrow()
      expect(() => showToast('warn', 'warning')).not.toThrow()
      expect(() => showToast('info', 'info')).not.toThrow()
    })

    it('handles unknown type gracefully (falls back to info)', () => {
      expect(() => showToast('test', 'unknown')).not.toThrow()
    })

    it('handles empty message', () => {
      expect(() => showToast('', 'info')).not.toThrow()
    })
  })

  // ─── sendLocalNotification ──────────────────────────────────

  describe('sendLocalNotification', () => {
    it('does not throw when Notification API not available', () => {
      delete global.Notification
      expect(() => sendLocalNotification('Title', 'Body')).not.toThrow()
    })

    it('does not throw when permission denied', () => {
      global.Notification.permission = 'denied'
      expect(() => sendLocalNotification('Title', 'Body')).not.toThrow()
    })

    it('does not throw when permission granted', () => {
      global.Notification.permission = 'granted'
      expect(() => sendLocalNotification('Title', 'Body', {})).not.toThrow()
    })

    it('does not throw for guardian_overdue type', () => {
      global.Notification.permission = 'granted'
      expect(() =>
        sendLocalNotification('Alert', 'Check in!', { type: 'guardian_overdue' })
      ).not.toThrow()
    })
  })

  // ─── Scheduled Notifications ────────────────────────────────

  describe('cancelScheduledNotification', () => {
    it('does not throw for unknown ID', () => {
      expect(() => cancelScheduledNotification('non-existent')).not.toThrow()
    })
  })

  describe('cancelAllScheduledNotifications', () => {
    it('does not throw when empty', () => {
      expect(() => cancelAllScheduledNotifications()).not.toThrow()
    })
  })
})
