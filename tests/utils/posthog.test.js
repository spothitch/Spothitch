import { describe, it, expect, vi, beforeEach } from 'vitest'

import {
  setConsent,
  capture,
  capturePageView,
  identify,
  reset,
  isFeatureEnabled,
  getFeatureFlag,
  reloadFeatureFlags,
  spotEvents,
  socialEvents,
  gamificationEvents,
} from '../../src/utils/posthog.js'

describe('posthog analytics', () => {
  beforeEach(() => {
    localStorage.clear()
    delete window.posthog
  })

  describe('setConsent', () => {
    it('saves true consent to localStorage', () => {
      setConsent(true)
      expect(localStorage.getItem('spothitch_analytics_consent')).toBe('true')
    })

    it('saves false consent to localStorage', () => {
      setConsent(false)
      expect(localStorage.getItem('spothitch_analytics_consent')).toBe('false')
    })

    it('calls opt_out_capturing when revoking consent with posthog loaded', () => {
      window.posthog = { opt_out_capturing: vi.fn() }
      setConsent(false)
      expect(window.posthog.opt_out_capturing).toHaveBeenCalled()
    })
  })

  describe('capture', () => {
    it('does nothing without consent', () => {
      capture('test_event', { foo: 'bar' })
      // No error thrown, posthog not called
    })

    it('queues event when consent given but posthog not initialized', () => {
      setConsent(true)
      // With consent but no posthog instance, it should queue without error
      expect(() => capture('test_event', { foo: 'bar' })).not.toThrow()
    })

    it('calls posthog.capture when posthog is initialized', () => {
      localStorage.setItem('spothitch_analytics_consent', 'true')
      window.posthog = { capture: vi.fn() }
      capture('test_event', { foo: 'bar' })
      expect(window.posthog.capture).toHaveBeenCalledWith('test_event', { foo: 'bar' })
    })
  })

  describe('capturePageView', () => {
    it('does not throw when called', () => {
      expect(() => capturePageView('home')).not.toThrow()
    })

    it('calls posthog with $pageview event when consent given', () => {
      localStorage.setItem('spothitch_analytics_consent', 'true')
      window.posthog = { capture: vi.fn() }
      capturePageView('spots')
      expect(window.posthog.capture).toHaveBeenCalledWith('$pageview', expect.objectContaining({ page: 'spots' }))
    })
  })

  describe('identify', () => {
    it('does nothing without consent', () => {
      window.posthog = { identify: vi.fn() }
      identify('user-123', { name: 'Alice' })
      expect(window.posthog.identify).not.toHaveBeenCalled()
    })

    it('calls posthog.identify with consent', () => {
      localStorage.setItem('spothitch_analytics_consent', 'true')
      window.posthog = { identify: vi.fn() }
      identify('user-123', { name: 'Alice' })
      expect(window.posthog.identify).toHaveBeenCalledWith('user-123', { name: 'Alice' })
    })
  })

  describe('reset', () => {
    it('does nothing when posthog not loaded', () => {
      expect(() => reset()).not.toThrow()
    })

    it('calls posthog.reset when loaded', () => {
      window.posthog = { reset: vi.fn() }
      reset()
      expect(window.posthog.reset).toHaveBeenCalled()
    })
  })

  describe('isFeatureEnabled', () => {
    it('returns false when posthog not loaded', () => {
      expect(isFeatureEnabled('my-flag')).toBe(false)
    })

    it('calls posthog.isFeatureEnabled when loaded', () => {
      window.posthog = { isFeatureEnabled: vi.fn(() => true) }
      const result = isFeatureEnabled('my-flag')
      expect(window.posthog.isFeatureEnabled).toHaveBeenCalledWith('my-flag')
      expect(result).toBe(true)
    })
  })

  describe('getFeatureFlag', () => {
    it('returns undefined when posthog not loaded', () => {
      expect(getFeatureFlag('my-flag')).toBeUndefined()
    })

    it('returns flag value when posthog loaded', () => {
      window.posthog = { getFeatureFlag: vi.fn(() => 'variant-a') }
      expect(getFeatureFlag('my-flag')).toBe('variant-a')
    })
  })

  describe('reloadFeatureFlags', () => {
    it('does nothing when posthog not loaded', () => {
      expect(() => reloadFeatureFlags()).not.toThrow()
    })

    it('calls posthog.reloadFeatureFlags when loaded', () => {
      window.posthog = { reloadFeatureFlags: vi.fn() }
      reloadFeatureFlags()
      expect(window.posthog.reloadFeatureFlags).toHaveBeenCalled()
    })
  })

  describe('spotEvents shortcuts', () => {
    beforeEach(() => {
      localStorage.setItem('spothitch_analytics_consent', 'true')
      window.posthog = { capture: vi.fn() }
    })

    it('spotEvents.created fires spot_created', () => {
      spotEvents.created('spot-001')
      expect(window.posthog.capture).toHaveBeenCalledWith('spot_created', { spotId: 'spot-001' })
    })

    it('spotEvents.viewed fires spot_viewed', () => {
      spotEvents.viewed('spot-001')
      expect(window.posthog.capture).toHaveBeenCalledWith('spot_viewed', { spotId: 'spot-001' })
    })

    it('spotEvents.checkedIn fires spot_checkin', () => {
      spotEvents.checkedIn('spot-001')
      expect(window.posthog.capture).toHaveBeenCalledWith('spot_checkin', { spotId: 'spot-001' })
    })

    it('spotEvents.shared fires spot_shared', () => {
      spotEvents.shared('spot-001', 'whatsapp')
      expect(window.posthog.capture).toHaveBeenCalledWith('spot_shared', { spotId: 'spot-001', method: 'whatsapp' })
    })

    it('spotEvents.favorited fires spot_favorited', () => {
      spotEvents.favorited('spot-001')
      expect(window.posthog.capture).toHaveBeenCalledWith('spot_favorited', { spotId: 'spot-001' })
    })
  })

  describe('socialEvents shortcuts', () => {
    beforeEach(() => {
      localStorage.setItem('spothitch_analytics_consent', 'true')
      window.posthog = { capture: vi.fn() }
    })

    it('socialEvents.messageSent fires message_sent', () => {
      socialEvents.messageSent('dm')
      expect(window.posthog.capture).toHaveBeenCalledWith('message_sent', { type: 'dm' })
    })

    it('socialEvents.friendAdded fires friend_added', () => {
      socialEvents.friendAdded()
      expect(window.posthog.capture).toHaveBeenCalledWith('friend_added', {})
    })

    it('socialEvents.groupJoined fires group_joined', () => {
      socialEvents.groupJoined('group-fr')
      expect(window.posthog.capture).toHaveBeenCalledWith('group_joined', { groupId: 'group-fr' })
    })
  })

  describe('gamificationEvents shortcuts', () => {
    beforeEach(() => {
      localStorage.setItem('spothitch_analytics_consent', 'true')
      window.posthog = { capture: vi.fn() }
    })

    it('gamificationEvents.levelUp fires level_up', () => {
      gamificationEvents.levelUp(3)
      expect(window.posthog.capture).toHaveBeenCalledWith('level_up', { level: 3 })
    })

    it('gamificationEvents.badgeEarned fires badge_earned', () => {
      gamificationEvents.badgeEarned('first-spot')
      expect(window.posthog.capture).toHaveBeenCalledWith('badge_earned', { badgeId: 'first-spot' })
    })

    it('gamificationEvents.rewardRedeemed fires reward_redeemed', () => {
      gamificationEvents.rewardRedeemed('hostel-discount')
      expect(window.posthog.capture).toHaveBeenCalledWith('reward_redeemed', { rewardId: 'hostel-discount' })
    })
  })
})
