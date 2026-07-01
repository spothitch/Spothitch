/**
 * OSRM/Nominatim parsing coverage — exercises the response mapping, address-field
 * fallbacks, importance sort, dedup and error branches of the search helpers with
 * rich mocked Nominatim payloads. Pure/deterministic (fetch mocked).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  searchLocation,
  searchCities,
  searchCountries,
  reverseGeocode,
  clearCache,
} from '../../src/services/osrm.js'

const okJson = (payload) => ({ ok: true, json: () => Promise.resolve(payload) })

describe('osrm parsing branches', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearCache()
  })

  describe('searchLocation', () => {
    it('maps address fallbacks, sorts by importance, adds country and dedups', async () => {
      global.fetch = vi.fn().mockResolvedValue(okJson([
        { display_name: 'Lyon, Rhône, France', lat: '45.75', lon: '4.85', type: 'city', importance: 0.5, address: { city: 'Lyon', country: 'France', country_code: 'fr' } },
        { display_name: 'Lyon (doublon)', lat: '45.75', lon: '4.85', type: 'city', importance: 0.9, address: { town: 'Lyon', country: 'France', country_code: 'fr' } },
        { display_name: 'Petitbourg, France', lat: '46.10', lon: '5.10', type: 'village', importance: 0.3, address: { village: 'Petitbourg', country: 'France', country_code: 'fr' } },
      ]))

      const results = await searchLocation('Lyon')
      // Highest importance first (0.9), and the duplicate Lyon at same rounded coords is removed
      expect(results[0].name).toBe('Lyon, France')
      expect(results[0].countryCode).toBe('FR')
      expect(results.filter(r => r.name.startsWith('Lyon')).length).toBe(1)
      // village fallback survives (distinct coords)
      expect(results.some(r => r.name === 'Petitbourg, France')).toBe(true)
    })

    it('falls back to display_name when no address, and omits country when absent', async () => {
      global.fetch = vi.fn().mockResolvedValue(okJson([
        { display_name: 'Nowhere Town, Somewhere', lat: '10', lon: '20', type: 'hamlet' },
      ]))
      const results = await searchLocation('Nowhere')
      expect(results[0].name).toBe('Nowhere Town')
      expect(results[0].countryCode).toBe('')
    })

    it('returns empty array when the response is not ok', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 429, json: () => Promise.resolve([]) })
      expect(await searchLocation('Paris')).toEqual([])
    })
  })

  describe('searchCities', () => {
    it('returns empty for short queries', async () => {
      expect(await searchCities('a')).toEqual([])
    })

    it('adds the countrycodes filter to the URL and maps results', async () => {
      global.fetch = vi.fn().mockResolvedValue(okJson([
        { display_name: 'Berlin, DE', lat: '52.52', lon: '13.40', importance: 0.8, address: { city: 'Berlin', country: 'Deutschland', country_code: 'de' } },
      ]))
      const results = await searchCities('Berlin', { countryCode: 'DE' })
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('countrycodes=de'),
        expect.any(Object),
      )
      expect(results[0].name).toBe('Berlin')
      expect(results[0].fullName).toBe('Berlin, Deutschland')
      expect(results[0].countryCode).toBe('DE')
    })

    it('returns empty array on network error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('boom'))
      expect(await searchCities('Berlin')).toEqual([])
    })
  })

  describe('searchCountries', () => {
    it('returns empty for short queries', async () => {
      expect(await searchCountries('f')).toEqual([])
    })

    it('maps country name/code and drops entries without a country code', async () => {
      global.fetch = vi.fn().mockResolvedValue(okJson([
        { display_name: 'France', lat: '46.0', lon: '2.0', address: { country: 'France', country_code: 'fr' } },
        { display_name: 'Spain, Europe', lat: '40.0', lon: '-3.0' }, // no code → filtered out
      ]))
      const results = await searchCountries('Fr')
      expect(results).toHaveLength(1)
      expect(results[0]).toMatchObject({ name: 'France', code: 'FR' })
    })

    it('returns empty array when response not ok', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve([]) })
      expect(await searchCountries('France')).toEqual([])
    })
  })

  describe('reverseGeocode', () => {
    it('maps address fallbacks and uppercases the country code', async () => {
      global.fetch = vi.fn().mockResolvedValue(okJson({
        display_name: 'Somewhere, France',
        address: { town: 'Petitville', country: 'France', country_code: 'fr' },
      }))
      const res = await reverseGeocode(45, 4)
      expect(res).toMatchObject({ city: 'Petitville', country: 'France', countryCode: 'FR' })
    })

    it('returns null when response not ok', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve({}) })
      expect(await reverseGeocode(45, 4)).toBe(null)
    })
  })
})
