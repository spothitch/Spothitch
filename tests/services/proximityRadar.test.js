import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/services/firebase.js', () => ({ getCurrentUser: vi.fn(() => null), db: null }))

import {
  getRadarSettings, saveRadarSettings,
  isRadarInCooldown, getRemainingCooldownMinutes,
  formatRadarDistance,
} from '../../src/services/proximityRadar.js'

describe('proximityRadar', () => {
  beforeEach(() => { localStorage.clear() })

  describe('getRadarSettings', () => {
    it('returns defaults when nothing stored', () => {
      const s = getRadarSettings()
      expect(s).toBeDefined()
      expect(typeof s.enabled).toBe('boolean')
    })
    it('merges stored settings with defaults', () => {
      localStorage.setItem('spothitch_proximity_radar', JSON.stringify({ enabled: true }))
      const s = getRadarSettings()
      expect(s.enabled).toBe(true)
    })
    it('handles corrupt JSON', () => {
      localStorage.setItem('spothitch_proximity_radar', 'bad')
      const s = getRadarSettings()
      expect(s).toBeDefined()
    })
  })

  describe('saveRadarSettings', () => {
    it('saves and returns updated settings', () => {
      const result = saveRadarSettings({ enabled: true })
      expect(result.enabled).toBe(true)
      const stored = JSON.parse(localStorage.getItem('spothitch_proximity_radar'))
      expect(stored.enabled).toBe(true)
    })
    it('merges with existing', () => {
      saveRadarSettings({ enabled: true })
      saveRadarSettings({ radius: 50 })
      const s = getRadarSettings()
      expect(s.enabled).toBe(true)
      expect(s.radius).toBe(50)
    })
  })

  describe('isRadarInCooldown', () => {
    it('returns false with no cooldown', () => {
      expect(isRadarInCooldown()).toBe(false)
    })
    it('returns true during cooldown', () => {
      saveRadarSettings({ cooldownUntil: Date.now() + 60000 })
      expect(isRadarInCooldown()).toBe(true)
    })
    it('returns false after cooldown expired', () => {
      saveRadarSettings({ cooldownUntil: Date.now() - 1000 })
      expect(isRadarInCooldown()).toBe(false)
    })
  })

  describe('getRemainingCooldownMinutes', () => {
    it('returns 0 when no cooldown', () => {
      expect(getRemainingCooldownMinutes()).toBe(0)
    })
    it('returns positive minutes during cooldown', () => {
      saveRadarSettings({ cooldownUntil: Date.now() + 5 * 60000 })
      const mins = getRemainingCooldownMinutes()
      expect(mins).toBeGreaterThan(0)
      expect(mins).toBeLessThanOrEqual(5)
    })
  })

  describe('formatRadarDistance', () => {
    it('returns null for very short distances', () => {
      expect(formatRadarDistance(0.1)).toBeNull()
    })
    it('returns rounded km for larger distances', () => {
      expect(formatRadarDistance(15.7)).toBe(16)
    })
    it('returns integer', () => {
      expect(formatRadarDistance(42.3)).toBe(42)
    })
  })
})
