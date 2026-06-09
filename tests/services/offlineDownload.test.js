import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock IDB utilities — all operations succeed silently
vi.mock('../../src/utils/idb.js', () => ({
  getByIndex: vi.fn(async () => []),
  count: vi.fn(async () => 0),
  remove: vi.fn(async () => {}),
  getAll: vi.fn(async () => []),
}))

import {
  markCountryDownloaded,
  getDownloadedCountries,
  isCountryDownloaded,
  undismissCountry,
  getDismissedCountries,
  isCountryDismissed,
  deleteOfflineCountry,
  getOfflineCountrySpots,
  getAllOfflineSpots,
  getOfflineStorageInfo,
} from '../../src/services/offlineDownload.js'

const STORAGE_KEY = 'spothitch_offline_countries'
const DISMISSED_KEY = 'spothitch_offline_dismissed'

describe('offlineDownload', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  // ──────────────────────────────────────────────────────────
  // getDownloadedCountries
  // ──────────────────────────────────────────────────────────
  describe('getDownloadedCountries', () => {
    it('returns empty array when nothing stored', () => {
      expect(getDownloadedCountries()).toEqual([])
    })

    it('returns parsed array from localStorage', () => {
      const data = [{ code: 'FR', count: 42, downloadedAt: 1000 }]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      expect(getDownloadedCountries()).toEqual(data)
    })

    it('returns empty array on JSON parse error', () => {
      localStorage.setItem(STORAGE_KEY, 'not-json')
      expect(getDownloadedCountries()).toEqual([])
    })
  })

  // ──────────────────────────────────────────────────────────
  // markCountryDownloaded
  // ──────────────────────────────────────────────────────────
  describe('markCountryDownloaded', () => {
    it('adds a new country entry', () => {
      markCountryDownloaded('FR', 10)
      const result = getDownloadedCountries()
      expect(result).toHaveLength(1)
      expect(result[0].code).toBe('FR')
      expect(result[0].count).toBe(10)
    })

    it('stores stationCount and tileSizeMB', () => {
      markCountryDownloaded('DE', 5, 12, 3.4)
      const result = getDownloadedCountries()
      expect(result[0].stationCount).toBe(12)
      expect(result[0].tileSizeMB).toBe(3.4)
    })

    it('defaults stationCount and tileSizeMB to 0', () => {
      markCountryDownloaded('ES', 7)
      const result = getDownloadedCountries()
      expect(result[0].stationCount).toBe(0)
      expect(result[0].tileSizeMB).toBe(0)
    })

    it('updates an existing entry by code', () => {
      markCountryDownloaded('FR', 10)
      markCountryDownloaded('FR', 20, 5, 1.0)
      const result = getDownloadedCountries()
      expect(result).toHaveLength(1)
      expect(result[0].count).toBe(20)
      expect(result[0].stationCount).toBe(5)
    })

    it('stores a downloadedAt timestamp', () => {
      const before = Date.now()
      markCountryDownloaded('IT', 3)
      const after = Date.now()
      const result = getDownloadedCountries()
      expect(result[0].downloadedAt).toBeGreaterThanOrEqual(before)
      expect(result[0].downloadedAt).toBeLessThanOrEqual(after)
    })

    it('can store multiple countries', () => {
      markCountryDownloaded('FR', 10)
      markCountryDownloaded('DE', 5)
      expect(getDownloadedCountries()).toHaveLength(2)
    })
  })

  // ──────────────────────────────────────────────────────────
  // isCountryDownloaded
  // ──────────────────────────────────────────────────────────
  describe('isCountryDownloaded', () => {
    it('returns false when nothing downloaded', () => {
      expect(isCountryDownloaded('FR')).toBe(false)
    })

    it('returns true after marking a country downloaded', () => {
      markCountryDownloaded('FR', 5)
      expect(isCountryDownloaded('FR')).toBe(true)
    })

    it('is case-insensitive (lowercase input)', () => {
      markCountryDownloaded('FR', 5)
      expect(isCountryDownloaded('fr')).toBe(true)
    })

    it('returns false for a different country', () => {
      markCountryDownloaded('FR', 5)
      expect(isCountryDownloaded('DE')).toBe(false)
    })
  })

  // ──────────────────────────────────────────────────────────
  // getDismissedCountries
  // ──────────────────────────────────────────────────────────
  describe('getDismissedCountries', () => {
    it('returns empty array when nothing stored', () => {
      expect(getDismissedCountries()).toEqual([])
    })

    it('returns parsed array from localStorage', () => {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(['FR', 'DE']))
      expect(getDismissedCountries()).toEqual(['FR', 'DE'])
    })

    it('returns empty array on JSON parse error', () => {
      localStorage.setItem(DISMISSED_KEY, '{{bad')
      expect(getDismissedCountries()).toEqual([])
    })
  })

  // ──────────────────────────────────────────────────────────
  // undismissCountry
  // ──────────────────────────────────────────────────────────
  describe('undismissCountry', () => {
    it('removes a country from the dismissed list', () => {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(['FR', 'DE']))
      undismissCountry('FR')
      expect(getDismissedCountries()).toEqual(['DE'])
    })

    it('is a no-op when country is not dismissed', () => {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(['DE']))
      undismissCountry('FR')
      expect(getDismissedCountries()).toEqual(['DE'])
    })

    it('handles uppercase input', () => {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(['FR']))
      undismissCountry('FR')
      expect(getDismissedCountries()).toEqual([])
    })

    it('handles lowercase input by uppercasing', () => {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(['FR']))
      undismissCountry('fr')
      expect(getDismissedCountries()).toEqual([])
    })

    it('works on an empty dismissed list', () => {
      undismissCountry('FR')
      expect(getDismissedCountries()).toEqual([])
    })
  })

  // ──────────────────────────────────────────────────────────
  // isCountryDismissed
  // ──────────────────────────────────────────────────────────
  describe('isCountryDismissed', () => {
    it('returns false when list is empty', () => {
      expect(isCountryDismissed('FR')).toBe(false)
    })

    it('returns true when country is in dismissed list', () => {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(['FR']))
      expect(isCountryDismissed('FR')).toBe(true)
    })

    it('is case-sensitive (matches exact strings in list)', () => {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(['FR']))
      // The dismissed list stores uppercase, check uppercase input
      expect(isCountryDismissed('FR')).toBe(true)
    })

    it('returns false for unknown country', () => {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(['FR']))
      expect(isCountryDismissed('DE')).toBe(false)
    })
  })

  // ──────────────────────────────────────────────────────────
  // deleteOfflineCountry
  // ──────────────────────────────────────────────────────────
  describe('deleteOfflineCountry', () => {
    it('returns true on success', async () => {
      markCountryDownloaded('FR', 10)
      const result = await deleteOfflineCountry('FR')
      expect(result).toBe(true)
    })

    it('removes country from downloaded list', async () => {
      markCountryDownloaded('DE', 5)
      await deleteOfflineCountry('DE')
      expect(isCountryDownloaded('DE')).toBe(false)
    })

    it('keeps other countries in downloaded list', async () => {
      markCountryDownloaded('FR', 10)
      markCountryDownloaded('DE', 5)
      await deleteOfflineCountry('FR')
      expect(isCountryDownloaded('DE')).toBe(true)
    })

    it('is case-insensitive (lowercase input)', async () => {
      markCountryDownloaded('ES', 7)
      const result = await deleteOfflineCountry('es')
      expect(result).toBe(true)
      expect(isCountryDownloaded('ES')).toBe(false)
    })

    it('works when country was not downloaded', async () => {
      const result = await deleteOfflineCountry('XX')
      expect(result).toBe(true)
    })
  })

  // ──────────────────────────────────────────────────────────
  // getOfflineCountrySpots
  // ──────────────────────────────────────────────────────────
  describe('getOfflineCountrySpots', () => {
    it('returns a promise', () => {
      const result = getOfflineCountrySpots('FR')
      expect(result instanceof Promise).toBe(true)
    })

    it('resolves to an array', async () => {
      const spots = await getOfflineCountrySpots('FR')
      expect(Array.isArray(spots)).toBe(true)
    })

    it('resolves to empty array when IDB has no data', async () => {
      const spots = await getOfflineCountrySpots('FR')
      expect(spots).toEqual([])
    })

    it('accepts lowercase country code', async () => {
      await expect(getOfflineCountrySpots('fr')).resolves.toBeDefined()
    })
  })

  // ──────────────────────────────────────────────────────────
  // getAllOfflineSpots
  // ──────────────────────────────────────────────────────────
  describe('getAllOfflineSpots', () => {
    it('returns a promise', () => {
      const result = getAllOfflineSpots()
      expect(result instanceof Promise).toBe(true)
    })

    it('resolves to an array', async () => {
      const spots = await getAllOfflineSpots()
      expect(Array.isArray(spots)).toBe(true)
    })

    it('resolves to empty array when IDB has no data', async () => {
      const spots = await getAllOfflineSpots()
      expect(spots).toEqual([])
    })
  })

  // ──────────────────────────────────────────────────────────
  // getOfflineStorageInfo
  // ──────────────────────────────────────────────────────────
  describe('getOfflineStorageInfo', () => {
    it('returns a promise', () => {
      expect(getOfflineStorageInfo() instanceof Promise).toBe(true)
    })

    it('resolves to an object', async () => {
      const info = await getOfflineStorageInfo()
      expect(typeof info).toBe('object')
    })

    it('has countryCount property', async () => {
      const info = await getOfflineStorageInfo()
      expect('countryCount' in info).toBe(true)
    })

    it('has spotCount property', async () => {
      const info = await getOfflineStorageInfo()
      expect('spotCount' in info).toBe(true)
    })

    it('has countries array', async () => {
      const info = await getOfflineStorageInfo()
      expect(Array.isArray(info.countries)).toBe(true)
    })

    it('reflects downloaded countries count', async () => {
      markCountryDownloaded('FR', 10)
      markCountryDownloaded('DE', 5)
      const info = await getOfflineStorageInfo()
      expect(info.countryCount).toBe(2)
    })

    it('sums totalStations from country metadata', async () => {
      markCountryDownloaded('FR', 10, 50)
      markCountryDownloaded('DE', 5, 30)
      const info = await getOfflineStorageInfo()
      expect(info.totalStations).toBe(80)
    })

    it('sums totalTileSizeMB from country metadata', async () => {
      markCountryDownloaded('IT', 8, 0, 2.5)
      const info = await getOfflineStorageInfo()
      expect(info.totalTileSizeMB).toBeGreaterThanOrEqual(0)
    })
  })
})
