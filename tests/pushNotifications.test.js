/**
 * Push Notifications Service Tests
 * Tests for src/services/pushNotifications.js
 * Covers: opt-in flow, config persistence, token management,
 *         foreground listener, proximity, nudge banner, settings UI
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// Mock firebase.js
const mockRequestPermission = vi.fn()
const mockOnForegroundMessage = vi.fn()

vi.mock('../src/services/firebase.js', () => ({
  requestNotificationPermission: (...args) => mockRequestPermission(...args),
  onForegroundMessage: (...args) => mockOnForegroundMessage(...args),
  saveFCMToken: vi.fn().mockResolvedValue(true),
  deleteFCMTokens: vi.fn().mockResolvedValue(true),
}))

vi.mock('../src/utils/toggle.js', () => ({
  renderToggle: (enabled, onclick, label) =>
    `<button data-enabled="${enabled}" onclick="${onclick}">${label}</button>`,
}))

vi.mock('../src/i18n/index.js', () => ({
  t: (key) => key,
}))

import {
  isPushEnabled,
  hasBeenAsked,
  enablePushNotifications,
  disablePushNotifications,
  getFCMToken,
  startForegroundListener,
  stopForegroundListener,
  showProximityNotification,
  renderPushSettings,
  initPushNotifications,
  nudgePushNotifications,
} from '../src/services/pushNotifications.js'

describe('Push Notifications Service', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    // Clean up DOM
    document.body.innerHTML = ''
    // Reset window handlers
    delete window._acceptPushNudge
    delete window._dismissPushNudge
    delete window.showToast
    delete window.selectSpot
    // Mock Notification API
    global.Notification = class {
      constructor(title, options) {
        this.title = title
        this.options = options
      }
      close() {}
    }
    global.Notification.permission = 'default'
    global.Notification.requestPermission = vi.fn().mockResolvedValue('granted')
    // Mock PushManager
    window.PushManager = {}
  })

  afterEach(() => {
    delete global.Notification
    delete window.PushManager
  })

  // ─── Config Persistence ──────────────────────────────────────

  describe('isPushEnabled', () => {
    it('returns false by default (no config)', () => {
      expect(isPushEnabled()).toBe(false)
    })

    it('returns true when config says enabled', () => {
      localStorage.setItem(
        'spothitch_push_config',
        JSON.stringify({ enabled: true, asked: true })
      )
      expect(isPushEnabled()).toBe(true)
    })

    it('returns false when config says disabled', () => {
      localStorage.setItem(
        'spothitch_push_config',
        JSON.stringify({ enabled: false, asked: true })
      )
      expect(isPushEnabled()).toBe(false)
    })

    it('returns false for corrupted JSON', () => {
      localStorage.setItem('spothitch_push_config', '{bad json')
      expect(isPushEnabled()).toBe(false)
    })
  })

  describe('hasBeenAsked', () => {
    it('returns false by default', () => {
      expect(hasBeenAsked()).toBe(false)
    })

    it('returns true after being asked', () => {
      localStorage.setItem(
        'spothitch_push_config',
        JSON.stringify({ asked: true })
      )
      expect(hasBeenAsked()).toBe(true)
    })
  })

  // ─── Enable / Disable Flow ──────────────────────────────────

  describe('enablePushNotifications', () => {
    it('returns success with token when permission granted', async () => {
      mockRequestPermission.mockResolvedValue('fake-fcm-token-abc123')

      const result = await enablePushNotifications()

      expect(result).toEqual({ success: true, token: 'fake-fcm-token-abc123' })
      expect(isPushEnabled()).toBe(true)
      expect(hasBeenAsked()).toBe(true)
      expect(getFCMToken()).toBe('fake-fcm-token-abc123')
    })

    it('returns failure when permission denied (null token)', async () => {
      mockRequestPermission.mockResolvedValue(null)

      const result = await enablePushNotifications()

      expect(result).toEqual({ success: false, token: null })
      expect(isPushEnabled()).toBe(false)
      expect(hasBeenAsked()).toBe(true)
      expect(getFCMToken()).toBeNull()
    })

    it('returns failure on error', async () => {
      mockRequestPermission.mockRejectedValue(new Error('FCM init failed'))

      const result = await enablePushNotifications()

      expect(result).toEqual({ success: false, token: null })
    })

    it('saves enabledAt timestamp on success', async () => {
      mockRequestPermission.mockResolvedValue('token-123')

      await enablePushNotifications()

      const config = JSON.parse(localStorage.getItem('spothitch_push_config'))
      expect(config.enabledAt).toBeGreaterThan(0)
    })

    it('saves deniedAt timestamp on denial', async () => {
      mockRequestPermission.mockResolvedValue(null)

      await enablePushNotifications()

      const config = JSON.parse(localStorage.getItem('spothitch_push_config'))
      expect(config.deniedAt).toBeGreaterThan(0)
    })

    it('starts foreground listener on success', async () => {
      mockRequestPermission.mockResolvedValue('token-xyz')

      await enablePushNotifications()

      expect(mockOnForegroundMessage).toHaveBeenCalled()
    })
  })

  describe('disablePushNotifications', () => {
    it('sets config to disabled and removes token', async () => {
      // First enable
      mockRequestPermission.mockResolvedValue('token-to-remove')
      await enablePushNotifications()
      expect(isPushEnabled()).toBe(true)
      expect(getFCMToken()).toBe('token-to-remove')

      // Then disable
      disablePushNotifications()

      expect(isPushEnabled()).toBe(false)
      expect(hasBeenAsked()).toBe(true)
      expect(getFCMToken()).toBeNull()
    })

    it('saves disabledAt timestamp', () => {
      disablePushNotifications()

      const config = JSON.parse(localStorage.getItem('spothitch_push_config'))
      expect(config.disabledAt).toBeGreaterThan(0)
    })
  })

  // ─── Token Management ───────────────────────────────────────

  describe('getFCMToken', () => {
    it('returns null when no token stored', () => {
      expect(getFCMToken()).toBeNull()
    })

    it('returns stored token', () => {
      localStorage.setItem('spothitch_fcm_token', 'my-stored-token')
      expect(getFCMToken()).toBe('my-stored-token')
    })
  })

  // ─── Foreground Listener ────────────────────────────────────

  describe('startForegroundListener', () => {
    it('does nothing when push is not enabled', () => {
      startForegroundListener()
      expect(mockOnForegroundMessage).not.toHaveBeenCalled()
    })

    it('registers listener when push is enabled', () => {
      localStorage.setItem(
        'spothitch_push_config',
        JSON.stringify({ enabled: true })
      )
      startForegroundListener()
      expect(mockOnForegroundMessage).toHaveBeenCalledWith(expect.any(Function))
    })

    it('foreground callback shows toast for regular messages', () => {
      localStorage.setItem(
        'spothitch_push_config',
        JSON.stringify({ enabled: true })
      )
      window.showToast = vi.fn()

      startForegroundListener()
      const callback = mockOnForegroundMessage.mock.calls[0][0]

      callback({
        notification: { title: 'Hello', body: 'Test message', data: {} },
      })

      expect(window.showToast).toHaveBeenCalledWith(
        'Hello: Test message',
        'info'
      )
    })

    it('foreground callback handles proximity_alert type', () => {
      localStorage.setItem(
        'spothitch_push_config',
        JSON.stringify({ enabled: true })
      )
      window.showToast = vi.fn()
      global.Notification.permission = 'granted'

      startForegroundListener()
      const callback = mockOnForegroundMessage.mock.calls[0][0]

      callback({
        notification: {
          title: 'Proximity',
          body: 'Near you',
          data: { type: 'proximity_alert', username: 'Alice', distance: '2' },
        },
      })

      expect(window.showToast).toHaveBeenCalled()
    })
  })

  // ─── initPushNotifications ──────────────────────────────────

  describe('initPushNotifications', () => {
    it('starts foreground listener when already enabled', async () => {
      localStorage.setItem(
        'spothitch_push_config',
        JSON.stringify({ enabled: true, enabledAt: Date.now() })
      )
      await initPushNotifications()
      expect(mockOnForegroundMessage).toHaveBeenCalled()
    })

    it('does nothing when not enabled', async () => {
      await initPushNotifications()
      expect(mockOnForegroundMessage).not.toHaveBeenCalled()
    })
  })

  // ─── stopForegroundListener ─────────────────────────────────

  describe('stopForegroundListener', () => {
    it('calls the unsubscribe function', () => {
      const mockUnsub = vi.fn()
      mockOnForegroundMessage.mockReturnValue(mockUnsub)

      localStorage.setItem(
        'spothitch_push_config',
        JSON.stringify({ enabled: true })
      )
      startForegroundListener()
      expect(mockOnForegroundMessage).toHaveBeenCalled()

      stopForegroundListener()
      expect(mockUnsub).toHaveBeenCalled()
    })

    it('does not throw when no listener registered', () => {
      expect(() => stopForegroundListener()).not.toThrow()
    })

    it('prevents duplicate listeners', () => {
      const mockUnsub1 = vi.fn()
      const mockUnsub2 = vi.fn()
      mockOnForegroundMessage
        .mockReturnValueOnce(mockUnsub1)
        .mockReturnValueOnce(mockUnsub2)

      localStorage.setItem(
        'spothitch_push_config',
        JSON.stringify({ enabled: true })
      )

      startForegroundListener() // registers listener 1
      startForegroundListener() // should unsub 1, register listener 2

      expect(mockUnsub1).toHaveBeenCalled() // listener 1 was unsubscribed
      expect(mockOnForegroundMessage).toHaveBeenCalledTimes(2)
    })
  })

  describe('disablePushNotifications stops listener', () => {
    it('calls stopForegroundListener on disable', () => {
      const mockUnsub = vi.fn()
      mockOnForegroundMessage.mockReturnValue(mockUnsub)

      localStorage.setItem(
        'spothitch_push_config',
        JSON.stringify({ enabled: true })
      )
      startForegroundListener()

      disablePushNotifications()
      expect(mockUnsub).toHaveBeenCalled()
    })
  })

  // ─── Proximity Notifications ────────────────────────────────

  describe('showProximityNotification', () => {
    it('does nothing when push is not enabled', () => {
      window.showToast = vi.fn()
      showProximityNotification({ username: 'Bob', distance: 1.5 })
      expect(window.showToast).not.toHaveBeenCalled()
    })

    it('shows toast when push is enabled', () => {
      localStorage.setItem(
        'spothitch_push_config',
        JSON.stringify({ enabled: true })
      )
      window.showToast = vi.fn()

      showProximityNotification({ username: 'Bob', distance: 1.5 })

      expect(window.showToast).toHaveBeenCalledWith(
        'Bob est à 1.5km de toi',
        'info'
      )
    })

    it('uses default text when username is missing', () => {
      localStorage.setItem(
        'spothitch_push_config',
        JSON.stringify({ enabled: true })
      )
      window.showToast = vi.fn()

      showProximityNotification({ distance: 0.8 })

      expect(window.showToast).toHaveBeenCalledWith(
        expect.stringContaining('0.8km'),
        'info'
      )
    })
  })

  // ─── Settings UI ────────────────────────────────────────────

  describe('renderPushSettings', () => {
    it('renders HTML with toggle', () => {
      const html = renderPushSettings()
      expect(html).toContain('togglePushNotifications()')
      expect(html).toContain('pushNotificationsTitle')
    })

    it('shows "enabled" state correctly', () => {
      localStorage.setItem(
        'spothitch_push_config',
        JSON.stringify({ enabled: true, asked: true })
      )
      const html = renderPushSettings()
      expect(html).toContain('data-enabled="true"')
      expect(html).toContain('pushEnabled')
    })

    it('shows "disabled" state for asked-but-denied user', () => {
      localStorage.setItem(
        'spothitch_push_config',
        JSON.stringify({ enabled: false, asked: true })
      )
      const html = renderPushSettings()
      expect(html).toContain('data-enabled="false"')
      expect(html).toContain('pushDisabled')
    })

    it('shows description for never-asked user', () => {
      const html = renderPushSettings()
      expect(html).toContain('data-enabled="false"')
      expect(html).toContain('pushDescription')
    })
  })

  // ─── Nudge Banner ───────────────────────────────────────────

  describe('nudgePushNotifications', () => {
    it('shows a banner in the DOM', () => {
      nudgePushNotifications('guardian')
      const banner = document.getElementById('push-nudge-banner')
      expect(banner).not.toBeNull()
      expect(banner.innerHTML).toContain('pushNudgeGuardian')
    })

    it('shows message context banner', () => {
      nudgePushNotifications('message')
      const banner = document.getElementById('push-nudge-banner')
      expect(banner.innerHTML).toContain('pushNudgeMessage')
    })

    it('does NOT show if push is already enabled', () => {
      localStorage.setItem(
        'spothitch_push_config',
        JSON.stringify({ enabled: true, asked: true })
      )
      nudgePushNotifications('guardian')
      expect(document.getElementById('push-nudge-banner')).toBeNull()
    })

    it('does NOT show if already asked (denied)', () => {
      localStorage.setItem(
        'spothitch_push_config',
        JSON.stringify({ enabled: false, asked: true })
      )
      nudgePushNotifications('guardian')
      expect(document.getElementById('push-nudge-banner')).toBeNull()
    })

    it('does NOT show if nudge was dismissed', () => {
      localStorage.setItem('spothitch_push_nudge_dismissed', Date.now().toString())
      nudgePushNotifications('guardian')
      expect(document.getElementById('push-nudge-banner')).toBeNull()
    })

    it('does NOT show if browser does not support notifications', () => {
      delete global.Notification
      nudgePushNotifications('guardian')
      expect(document.getElementById('push-nudge-banner')).toBeNull()
    })

    it('does NOT show if PushManager not available', () => {
      delete window.PushManager
      nudgePushNotifications('guardian')
      expect(document.getElementById('push-nudge-banner')).toBeNull()
    })

    it('replaces existing banner if one exists', () => {
      nudgePushNotifications('guardian')
      nudgePushNotifications('message')
      const banners = document.querySelectorAll('#push-nudge-banner')
      expect(banners.length).toBe(1)
      expect(banners[0].innerHTML).toContain('pushNudgeMessage')
    })

    it('dismiss handler removes banner and saves to localStorage', () => {
      nudgePushNotifications('guardian')
      expect(document.getElementById('push-nudge-banner')).not.toBeNull()

      window._dismissPushNudge()

      expect(document.getElementById('push-nudge-banner')).toBeNull()
      expect(localStorage.getItem('spothitch_push_nudge_dismissed')).not.toBeNull()
    })

    it('accept handler removes banner and calls togglePushNotifications', () => {
      window.togglePushNotifications = vi.fn()
      nudgePushNotifications('guardian')

      window._acceptPushNudge()

      expect(document.getElementById('push-nudge-banner')).toBeNull()
      expect(window.togglePushNotifications).toHaveBeenCalled()
    })

    it('auto-dismisses after 15 seconds', () => {
      vi.useFakeTimers()
      nudgePushNotifications('guardian')
      expect(document.getElementById('push-nudge-banner')).not.toBeNull()

      vi.advanceTimersByTime(15000)
      expect(document.getElementById('push-nudge-banner')).toBeNull()
      vi.useRealTimers()
    })

    it('defaults to guardian context for unknown context', () => {
      nudgePushNotifications('unknown_context')
      const banner = document.getElementById('push-nudge-banner')
      expect(banner.innerHTML).toContain('pushNudgeGuardian')
    })
  })

  // ─── Full Flow Integration ──────────────────────────────────

  describe('full opt-in → disable flow', () => {
    it('goes through the complete lifecycle', async () => {
      // Step 1: not enabled
      expect(isPushEnabled()).toBe(false)
      expect(hasBeenAsked()).toBe(false)
      expect(getFCMToken()).toBeNull()

      // Step 2: nudge appears
      nudgePushNotifications('guardian')
      expect(document.getElementById('push-nudge-banner')).not.toBeNull()

      // Step 3: user enables
      mockRequestPermission.mockResolvedValue('lifecycle-token')
      const result = await enablePushNotifications()
      expect(result.success).toBe(true)
      expect(isPushEnabled()).toBe(true)
      expect(getFCMToken()).toBe('lifecycle-token')

      // Step 4: nudge won't appear again
      nudgePushNotifications('message')
      // The existing banner from step 2 may still be there, but nudge should not recreate
      // Actually since push is enabled, it returns early

      // Step 5: user disables
      disablePushNotifications()
      expect(isPushEnabled()).toBe(false)
      expect(getFCMToken()).toBeNull()
      expect(hasBeenAsked()).toBe(true)

      // Step 6: nudge won't appear (already asked)
      document.getElementById('push-nudge-banner')?.remove()
      nudgePushNotifications('guardian')
      expect(document.getElementById('push-nudge-banner')).toBeNull()
    })
  })
})
