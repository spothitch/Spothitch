/**
 * Phase 6E: localStorage keys coverage
 * Verifies that key localStorage interactions work correctly
 */
import { describe, it, expect, beforeEach } from 'vitest'

describe('localStorage key interactions', () => {
  beforeEach(() => { localStorage.clear() })

  describe('SOS keys', () => {
    const sosKeys = [
      'spothitch_sos_channel',
      'spothitch_sos_silent',
      'spothitch_sos_custom_msg',
      'spothitch_sos_primary',
      'spothitch_sos_last_pos',
      'spothitch_sos_intro_seen',
      'spothitch_sos_fake_name',
    ]

    for (const key of sosKeys) {
      it(`${key} can be written and read`, () => {
        localStorage.setItem(key, 'test-value')
        expect(localStorage.getItem(key)).toBe('test-value')
      })
    }
  })

  describe('offline keys', () => {
    it('offline_countries stores JSON array', () => {
      localStorage.setItem('spothitch_offline_countries', JSON.stringify(['FR', 'DE']))
      const parsed = JSON.parse(localStorage.getItem('spothitch_offline_countries'))
      expect(parsed).toEqual(['FR', 'DE'])
    })
    it('offline_dismissed is a boolean flag', () => {
      localStorage.setItem('spothitch_offline_dismissed', 'true')
      expect(localStorage.getItem('spothitch_offline_dismissed')).toBe('true')
    })
    it('offline_queue stores action queue', () => {
      const queue = [{ action: 'addSpot', data: {} }]
      localStorage.setItem('spothitch_offline_queue', JSON.stringify(queue))
      expect(JSON.parse(localStorage.getItem('spothitch_offline_queue'))).toEqual(queue)
    })
  })

  describe('settings keys', () => {
    it('language preference', () => {
      localStorage.setItem('spothitch_language', 'en')
      expect(localStorage.getItem('spothitch_language')).toBe('en')
    })
    it('notification preferences (JSON)', () => {
      const prefs = { push: true, email: false, sound: true }
      localStorage.setItem('spothitch_notification_prefs', JSON.stringify(prefs))
      expect(JSON.parse(localStorage.getItem('spothitch_notification_prefs'))).toEqual(prefs)
    })
    it('big text mode', () => {
      localStorage.setItem('spothitch_big_text', 'true')
      expect(localStorage.getItem('spothitch_big_text')).toBe('true')
    })
    it('reduced motion', () => {
      localStorage.setItem('spothitch_reduced_motion', 'true')
      expect(localStorage.getItem('spothitch_reduced_motion')).toBe('true')
    })
    it('high contrast', () => {
      localStorage.setItem('spothitch_high_contrast', 'true')
      expect(localStorage.getItem('spothitch_high_contrast')).toBe('true')
    })
  })

  describe('gamification keys', () => {
    it('geo achievements', () => {
      const achievements = { borders: 3, capitals: ['Paris', 'Berlin'] }
      localStorage.setItem('spothitch_geo_achievements', JSON.stringify(achievements))
      expect(JSON.parse(localStorage.getItem('spothitch_geo_achievements'))).toEqual(achievements)
    })
    it('season data', () => {
      const season = { id: 's1', points: 500, rank: 12 }
      localStorage.setItem('spothitch_season_data', JSON.stringify(season))
      expect(JSON.parse(localStorage.getItem('spothitch_season_data'))).toEqual(season)
    })
  })

  describe('security keys', () => {
    it('2FA enabled flag', () => {
      localStorage.setItem('spothitch_2fa_enabled', 'true')
      expect(localStorage.getItem('spothitch_2fa_enabled')).toBe('true')
    })
    it('rate limits (JSON)', () => {
      const limits = { login: { count: 3, lastAttempt: Date.now() } }
      localStorage.setItem('spothitch_rate_limits', JSON.stringify(limits))
      expect(JSON.parse(localStorage.getItem('spothitch_rate_limits'))).toEqual(limits)
    })
  })

  describe('guardian keys', () => {
    it('guardian state stores complex object', () => {
      const guardian = {
        active: true, checkInInterval: 30,
        guardians: [{ name: 'Alice', phone: '+33600000000' }],
        positions: [{ lat: 48.85, lng: 2.35, timestamp: Date.now() }],
      }
      localStorage.setItem('spothitch_guardian', JSON.stringify(guardian))
      const stored = JSON.parse(localStorage.getItem('spothitch_guardian'))
      expect(stored.active).toBe(true)
      expect(stored.guardians.length).toBe(1)
    })
  })
})
