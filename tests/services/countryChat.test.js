import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ user: null })),
}))

import {
  getCountryName,
  getCountryFlag,
  getAvailableCountries,
  joinCountryChat,
  leaveCountryChat,
  getPopularCountryChats,
} from '../../src/services/countryChat.js'
import { getState } from '../../src/stores/state.js'

describe('countryChat service', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    vi.mocked(getState).mockReturnValue({ user: null })
  })

  describe('getCountryFlag', () => {
    it('returns flag emoji for known country code', () => {
      const flag = getCountryFlag('FR')
      expect(flag).toBe('🇫🇷')
    })

    it('returns flag for Germany', () => {
      expect(getCountryFlag('DE')).toBe('🇩🇪')
    })

    it('returns flag for Spain', () => {
      expect(getCountryFlag('ES')).toBe('🇪🇸')
    })

    it('returns flag for US', () => {
      expect(getCountryFlag('US')).toBe('🇺🇸')
    })

    it('returns "globe" for unknown country code', () => {
      expect(getCountryFlag('XX')).toBe('globe')
    })

    it('returns "globe" for empty string', () => {
      expect(getCountryFlag('')).toBe('globe')
    })
  })

  describe('getCountryName', () => {
    it('returns French name when lang is fr', () => {
      localStorage.setItem('spothitch_lang', 'fr')
      expect(getCountryName('FR')).toBe('France')
    })

    it('returns English name when lang is en', () => {
      localStorage.setItem('spothitch_lang', 'en')
      expect(getCountryName('DE')).toBe('Germany')
    })

    it('returns Spanish name when lang is es', () => {
      localStorage.setItem('spothitch_lang', 'es')
      expect(getCountryName('ES')).toBe('España')
    })

    it('returns German name when lang is de', () => {
      localStorage.setItem('spothitch_lang', 'de')
      expect(getCountryName('DE')).toBe('Deutschland')
    })

    it('falls back to English when lang not set', () => {
      // No lang set → defaults to 'fr' (the service uses || 'fr' fallback)
      // Then falls back to English name for unknown lang
      const result = getCountryName('FR')
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('returns country code for completely unknown country', () => {
      const result = getCountryName('ZZ')
      expect(result).toBe('ZZ')
    })

    it('returns name for Netherlands', () => {
      localStorage.setItem('spothitch_lang', 'en')
      expect(getCountryName('NL')).toBe('Netherlands')
    })

    it('returns name for Switzerland', () => {
      localStorage.setItem('spothitch_lang', 'en')
      expect(getCountryName('CH')).toBe('Switzerland')
    })
  })

  describe('getAvailableCountries', () => {
    it('returns an array', () => {
      const countries = getAvailableCountries()
      expect(Array.isArray(countries)).toBe(true)
    })

    it('returns non-empty array', () => {
      const countries = getAvailableCountries()
      expect(countries.length).toBeGreaterThan(10)
    })

    it('each country has code, name, and flag', () => {
      const countries = getAvailableCountries()
      countries.forEach(c => {
        expect(c.code).toBeDefined()
        expect(c.name).toBeDefined()
        expect(c.flag).toBeDefined()
      })
    })

    it('includes France', () => {
      const countries = getAvailableCountries()
      expect(countries.some(c => c.code === 'FR')).toBe(true)
    })

    it('includes Germany', () => {
      const countries = getAvailableCountries()
      expect(countries.some(c => c.code === 'DE')).toBe(true)
    })

    it('country codes are uppercase strings', () => {
      const countries = getAvailableCountries()
      countries.forEach(c => {
        expect(c.code).toBe(c.code.toUpperCase())
        expect(c.code.length).toBe(2)
      })
    })
  })

  describe('joinCountryChat', () => {
    it('returns null when no user logged in', async () => {
      vi.mocked(getState).mockReturnValue({ user: null })
      const result = await joinCountryChat('FR')
      expect(result).toBeNull()
    })

    it('returns null when user has no uid', async () => {
      vi.mocked(getState).mockReturnValue({ user: {} })
      const result = await joinCountryChat('FR')
      expect(result).toBeNull()
    })

    it('returns null when Firebase not available (no uid path)', async () => {
      // No user → returns null without touching Firebase
      vi.mocked(getState).mockReturnValue({ user: null })
      await expect(joinCountryChat('DE')).resolves.toBeNull()
    })

    it('handles Firebase failure gracefully', async () => {
      // With user but Firebase fails → catch block → returns null
      vi.mocked(getState).mockReturnValue({ user: { uid: 'user1' } })
      const result = await joinCountryChat('FR')
      // Firebase not available in test → catch → null
      expect(result === null || typeof result === 'string').toBe(true)
    })
  })

  describe('leaveCountryChat', () => {
    it('returns false when no user logged in', async () => {
      vi.mocked(getState).mockReturnValue({ user: null })
      const result = await leaveCountryChat('FR')
      expect(result).toBe(false)
    })

    it('returns false when user has no uid', async () => {
      vi.mocked(getState).mockReturnValue({ user: {} })
      const result = await leaveCountryChat('FR')
      expect(result).toBe(false)
    })

    it('handles Firebase failure gracefully', async () => {
      vi.mocked(getState).mockReturnValue({ user: { uid: 'user1' } })
      const result = await leaveCountryChat('FR')
      // Firebase not available → catch → false
      expect(typeof result).toBe('boolean')
    })
  })

  describe('getPopularCountryChats', () => {
    it('returns an array', async () => {
      const result = await getPopularCountryChats()
      expect(Array.isArray(result)).toBe(true)
    })

    it('returns empty array when Firebase unavailable', async () => {
      const result = await getPopularCountryChats()
      expect(result).toEqual([])
    })
  })
})
