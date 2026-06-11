import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => null),
  collection: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(() => Promise.resolve()),
  deleteDoc: vi.fn(() => Promise.resolve()),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  onSnapshot: vi.fn(() => () => {}),
}))
vi.mock('firebase/app', () => ({
  getApps: vi.fn(() => []),
  getApp: vi.fn(() => ({})),
}))
vi.mock('../../src/services/firebase.js', () => ({
  getCurrentUser: vi.fn(() => null),
}))

import {
  addFavorite,
  removeFavorite,
  isFavorite,
  unsubscribeFavorites,
  subscribeFavorites,
} from '../../src/services/favorites.js'

const FAVORITES_KEY = 'spothitch_favorites'

describe('favorites service', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('isFavorite', () => {
    it('returns false when no favorites stored', () => {
      expect(isFavorite('spot-001')).toBe(false)
    })

    it('returns true when spot is in localStorage', () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(['spot-001', 'spot-002']))
      expect(isFavorite('spot-001')).toBe(true)
    })

    it('returns false when spot is not in list', () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(['spot-002']))
      expect(isFavorite('spot-001')).toBe(false)
    })

    it('handles numeric spotId by coercing to string', () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(['42']))
      expect(isFavorite(42)).toBe(true)
    })

    it('handles corrupted localStorage gracefully', () => {
      localStorage.setItem(FAVORITES_KEY, 'invalid-json')
      expect(isFavorite('spot-001')).toBe(false)
    })
  })

  describe('addFavorite', () => {
    it('adds spot to localStorage', async () => {
      await addFavorite('spot-001')
      const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
      expect(stored).toContain('spot-001')
    })

    it('does not duplicate existing favorites', async () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(['spot-001']))
      await addFavorite('spot-001')
      const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
      expect(stored.filter(id => id === 'spot-001').length).toBe(1)
    })

    it('adds multiple different spots', async () => {
      await addFavorite('spot-001')
      await addFavorite('spot-002')
      const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
      expect(stored).toContain('spot-001')
      expect(stored).toContain('spot-002')
    })

    it('makes isFavorite return true after adding', async () => {
      await addFavorite('spot-abc')
      expect(isFavorite('spot-abc')).toBe(true)
    })
  })

  describe('removeFavorite', () => {
    it('removes spot from localStorage', async () => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(['spot-001', 'spot-002']))
      await removeFavorite('spot-001')
      const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
      expect(stored).not.toContain('spot-001')
      expect(stored).toContain('spot-002')
    })

    it('makes isFavorite return false after removing', async () => {
      await addFavorite('spot-xyz')
      expect(isFavorite('spot-xyz')).toBe(true)
      await removeFavorite('spot-xyz')
      expect(isFavorite('spot-xyz')).toBe(false)
    })

    it('does not throw when removing non-existent spot', async () => {
      await expect(removeFavorite('spot-not-there')).resolves.not.toThrow()
    })
  })

  describe('subscribeFavorites', () => {
    it('does nothing when no Firebase (getApps returns [])', () => {
      expect(() => subscribeFavorites('user-123')).not.toThrow()
    })

    it('does nothing when uid is null', () => {
      expect(() => subscribeFavorites(null)).not.toThrow()
    })
  })

  describe('unsubscribeFavorites', () => {
    it('runs without error', () => {
      expect(() => unsubscribeFavorites()).not.toThrow()
    })
  })
})
