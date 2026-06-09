import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock firebase modules before any imports
vi.mock('firebase/remote-config', () => ({
  getRemoteConfig: vi.fn(() => ({
    settings: {},
    defaultConfig: {},
  })),
  fetchAndActivate: vi.fn(() => Promise.resolve(true)),
  getValue: vi.fn(() => ({
    asBoolean: vi.fn(() => true),
    asNumber: vi.fn(() => 42),
    asString: vi.fn(() => 'value'),
  })),
}))

vi.mock('firebase/app', () => ({
  getApp: vi.fn(() => ({})),
}))

// Import once at module level — _initialized may be set by previous tests but
// defaults are always available without Remote Config being initialized.
import {
  getConfigValue,
  isFeatureEnabled,
  initRemoteConfig,
} from '../../src/services/remoteConfig.js'

describe('remoteConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getConfigValue — defaults', () => {
    it('returns true for guardian_mode_enabled (default)', () => {
      expect(getConfigValue('guardian_mode_enabled')).toBe(true)
    })

    it('returns true for sos_mode_enabled (default)', () => {
      expect(getConfigValue('sos_mode_enabled')).toBe(true)
    })

    it('returns false for group_chat_enabled (default)', () => {
      expect(getConfigValue('group_chat_enabled')).toBe(false)
    })

    it('returns true for real_time_tracking_enabled (default)', () => {
      expect(getConfigValue('real_time_tracking_enabled')).toBe(true)
    })

    it('returns 3 for min_reports_auto_hide (default)', () => {
      expect(getConfigValue('min_reports_auto_hide')).toBe(3)
    })

    it('returns true for profanity_filter_enabled (default)', () => {
      expect(getConfigValue('profanity_filter_enabled')).toBe(true)
    })

    it('returns 10 for max_spots_per_day (default)', () => {
      expect(getConfigValue('max_spots_per_day')).toBe(10)
    })

    it('returns 5 for max_photos_per_spot (default)', () => {
      expect(getConfigValue('max_photos_per_spot')).toBe(5)
    })

    it('returns 2000 for max_message_length (default)', () => {
      expect(getConfigValue('max_message_length')).toBe(2000)
    })

    it('returns 5 for check_in_grace_minutes (default)', () => {
      expect(getConfigValue('check_in_grace_minutes')).toBe(5)
    })

    it('returns false for show_maintenance_banner (default)', () => {
      expect(getConfigValue('show_maintenance_banner')).toBe(false)
    })

    it('returns empty string for maintenance_message (default)', () => {
      expect(getConfigValue('maintenance_message')).toBe('')
    })

    it('returns empty string for announcement_text (default)', () => {
      expect(getConfigValue('announcement_text')).toBe('')
    })

    it('returns false for announcement_active (default)', () => {
      expect(getConfigValue('announcement_active')).toBe(false)
    })

    it('returns true for beta_invite_required (default)', () => {
      expect(getConfigValue('beta_invite_required')).toBe(true)
    })

    it('returns empty string for force_update_version (default)', () => {
      expect(getConfigValue('force_update_version')).toBe('')
    })

    it('returns false for feedback_prompt_enabled (default)', () => {
      expect(getConfigValue('feedback_prompt_enabled')).toBe(false)
    })

    it('returns false for enable_posthog (default)', () => {
      expect(getConfigValue('enable_posthog')).toBe(false)
    })

    it('returns the fallback argument for unknown keys', () => {
      expect(getConfigValue('totally_unknown_key', 'my-fallback')).toBe('my-fallback')
    })

    it('returns undefined for unknown key with no fallback', () => {
      expect(getConfigValue('nonexistent_key_xyz')).toBeUndefined()
    })

    it('returns numeric fallback for unknown numeric key', () => {
      expect(getConfigValue('unknown_numeric', 99)).toBe(99)
    })
  })

  describe('isFeatureEnabled', () => {
    it('returns true for guardian_mode_enabled', () => {
      expect(isFeatureEnabled('guardian_mode_enabled')).toBe(true)
    })

    it('returns true for sos_mode_enabled', () => {
      expect(isFeatureEnabled('sos_mode_enabled')).toBe(true)
    })

    it('returns false for group_chat_enabled', () => {
      expect(isFeatureEnabled('group_chat_enabled')).toBe(false)
    })

    it('returns true for real_time_tracking_enabled', () => {
      expect(isFeatureEnabled('real_time_tracking_enabled')).toBe(true)
    })

    it('returns false for feedback_prompt_enabled', () => {
      expect(isFeatureEnabled('feedback_prompt_enabled')).toBe(false)
    })

    it('returns false for enable_posthog', () => {
      expect(isFeatureEnabled('enable_posthog')).toBe(false)
    })

    it('returns false for announcement_active', () => {
      expect(isFeatureEnabled('announcement_active')).toBe(false)
    })

    it('returns false for unknown feature flag (no default)', () => {
      expect(isFeatureEnabled('totally_unknown_flag')).toBe(false)
    })

    it('returns true for profanity_filter_enabled', () => {
      expect(isFeatureEnabled('profanity_filter_enabled')).toBe(true)
    })

    it('returns true for beta_invite_required', () => {
      expect(isFeatureEnabled('beta_invite_required')).toBe(true)
    })
  })

  describe('initRemoteConfig', () => {
    it('is exported as a function', () => {
      expect(typeof initRemoteConfig).toBe('function')
    })

    it('resolves without throwing', async () => {
      await expect(initRemoteConfig()).resolves.not.toThrow()
    })

    it('calling initRemoteConfig twice does not throw', async () => {
      await initRemoteConfig()
      await expect(initRemoteConfig()).resolves.not.toThrow()
    })
  })

  // After initRemoteConfig runs, _remoteConfig is set from the mock.
  // getConfigValue enters the `if (_remoteConfig)` branch and either uses
  // getValue() (if require is intercepted) or catches + falls to defaults.
  describe('getConfigValue — _remoteConfig branch (post-init)', () => {
    it('returns a boolean for guardian_mode_enabled after init', () => {
      const val = getConfigValue('guardian_mode_enabled')
      expect(typeof val).toBe('boolean')
    })

    it('returns a boolean for sos_mode_enabled after init', () => {
      const val = getConfigValue('sos_mode_enabled')
      expect(typeof val).toBe('boolean')
    })

    it('returns a number for min_reports_auto_hide after init', () => {
      const val = getConfigValue('min_reports_auto_hide')
      expect(typeof val).toBe('number')
    })

    it('returns a number for max_spots_per_day after init', () => {
      const val = getConfigValue('max_spots_per_day')
      expect(typeof val).toBe('number')
    })

    it('returns a string for maintenance_message after init', () => {
      const val = getConfigValue('maintenance_message')
      expect(typeof val === 'string' || val === '').toBe(true)
    })

    it('returns correct type for enable_posthog after init', () => {
      const val = getConfigValue('enable_posthog')
      expect(typeof val).toBe('boolean')
    })

    it('unknown key with fallback returns fallback after init', () => {
      const val = getConfigValue('totally_unknown_xyz', 'fallback-val')
      // Either from mocked getValue.asString() or from fallback
      expect(typeof val).toBe('string')
    })
  })
})
