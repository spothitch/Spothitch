import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Firebase completely since userReviews uses it directly
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => null),
  collection: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(() => ({ exists: () => false })),
  getDocs: vi.fn(() => ({ docs: [], empty: true })),
  updateDoc: vi.fn(),
  increment: vi.fn((v) => v),
}))
vi.mock('firebase/app', () => ({
  getApps: vi.fn(() => []),
  getApp: vi.fn(),
}))
vi.mock('../../src/services/firebase.js', () => ({
  getCurrentUser: vi.fn(() => null),
}))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ username: 'TestUser', avatar: 'thumbs-up' })),
}))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))

import {
  submitProfileReview,
  loadProfileReviews,
  getMyReviewForUser,
} from '../../src/services/userReviews.js'
import { getCurrentUser } from '../../src/services/firebase.js'
import { getApps } from 'firebase/app'
import { getFirestore, getDocs, getDoc } from 'firebase/firestore'

describe('userReviews', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getCurrentUser.mockReturnValue(null)
  })

  describe('submitProfileReview', () => {
    it('returns error when offline (no db)', async () => {
      const result = await submitProfileReview('target-uid', 5, 'Great!')
      expect(result.success).toBe(false)
      expect(result.error).toBe('offline')
    })

    it('returns error when not logged in', async () => {
      getCurrentUser.mockReturnValue(null)
      const result = await submitProfileReview('target-uid', 5, 'Great!')
      expect(result.success).toBe(false)
    })

    it('prevents self-review (blocked by offline first)', async () => {
      getCurrentUser.mockReturnValue({ uid: 'user1' })
      const result = await submitProfileReview('user1', 5, 'Great!')
      expect(result.success).toBe(false)
    })

    it('rejects invalid rating (0)', async () => {
      getCurrentUser.mockReturnValue({ uid: 'user1' })
      const result = await submitProfileReview('target', 0, '')
      expect(result.success).toBe(false)
    })

    it('rejects rating > 5', async () => {
      getCurrentUser.mockReturnValue({ uid: 'user1' })
      const result = await submitProfileReview('target', 6, '')
      expect(result.success).toBe(false)
    })

    it('rejects null rating', async () => {
      getCurrentUser.mockReturnValue({ uid: 'user1' })
      const result = await submitProfileReview('target', null, 'comment')
      expect(result.success).toBe(false)
    })

    it('rejects negative rating', async () => {
      getCurrentUser.mockReturnValue({ uid: 'user1' })
      const result = await submitProfileReview('target', -1, 'comment')
      expect(result.success).toBe(false)
    })

    it('returns object with success property', async () => {
      const result = await submitProfileReview('target', 3, 'ok')
      expect(typeof result.success).toBe('boolean')
    })
  })

  describe('loadProfileReviews', () => {
    it('returns empty array when no db', async () => {
      const result = await loadProfileReviews('user-123')
      expect(Array.isArray(result)).toBe(true)
      expect(result).toEqual([])
    })

    it('returns empty array when uid is null', async () => {
      const result = await loadProfileReviews(null)
      expect(result).toEqual([])
    })

    it('returns empty array when uid is empty string', async () => {
      const result = await loadProfileReviews('')
      expect(result).toEqual([])
    })

    it('returns a promise', () => {
      const result = loadProfileReviews('user-123')
      expect(result instanceof Promise).toBe(true)
    })

    it('resolves to an array', async () => {
      const result = await loadProfileReviews('user-abc')
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('getMyReviewForUser', () => {
    it('returns null when no db', async () => {
      const result = await getMyReviewForUser('user-123')
      expect(result).toBeNull()
    })

    it('returns null when no current user', async () => {
      getCurrentUser.mockReturnValue(null)
      const result = await getMyReviewForUser('user-123')
      expect(result).toBeNull()
    })

    it('returns null when targetUid is null', async () => {
      getCurrentUser.mockReturnValue({ uid: 'user1' })
      const result = await getMyReviewForUser(null)
      expect(result).toBeNull()
    })

    it('returns null when targetUid is empty string', async () => {
      getCurrentUser.mockReturnValue({ uid: 'user1' })
      const result = await getMyReviewForUser('')
      expect(result).toBeNull()
    })

    it('returns a promise', () => {
      const result = getMyReviewForUser('user-123')
      expect(result instanceof Promise).toBe(true)
    })

    it('returns null when doc does not exist (Firebase available)', async () => {
      getApps.mockReturnValue([{}])
      getFirestore.mockReturnValue({})
      getCurrentUser.mockReturnValue({ uid: 'user1' })
      getDoc.mockResolvedValue({ exists: () => false })
      const result = await getMyReviewForUser('target-user')
      expect(result).toBeNull()
    })

    it('returns review data when doc exists', async () => {
      getApps.mockReturnValue([{}])
      getFirestore.mockReturnValue({})
      getCurrentUser.mockReturnValue({ uid: 'user1' })
      getDoc.mockResolvedValue({ exists: () => true, data: () => ({ rating: 4, comment: 'Nice' }) })
      const result = await getMyReviewForUser('target-user')
      expect(result).toEqual({ rating: 4, comment: 'Nice' })
    })
  })

  describe('loadProfileReviews with Firebase available', () => {
    it('returns reviews array when db is available', async () => {
      getApps.mockReturnValue([{}])
      getFirestore.mockReturnValue({})
      getDocs.mockResolvedValue({ docs: [], empty: true })
      const result = await loadProfileReviews('user-123')
      expect(Array.isArray(result)).toBe(true)
    })

    it('maps docs to data objects', async () => {
      getApps.mockReturnValue([{}])
      getFirestore.mockReturnValue({})
      getDocs.mockResolvedValue({
        docs: [
          { data: () => ({ rating: 5, comment: 'Excellent', createdAt: '2026-01-02' }) },
          { data: () => ({ rating: 3, comment: 'Ok', createdAt: '2026-01-01' }) },
        ],
      })
      const result = await loadProfileReviews('user-123')
      expect(result.length).toBe(2)
      expect(result[0].rating).toBe(5)
    })

    it('returns empty array when getDocs throws', async () => {
      getApps.mockReturnValue([{}])
      getFirestore.mockReturnValue({})
      getDocs.mockRejectedValue(new Error('Firestore error'))
      const result = await loadProfileReviews('user-123')
      expect(result).toEqual([])
    })
  })

  describe('submitProfileReview with Firebase available (db truthy)', () => {
    beforeEach(() => {
      getApps.mockReturnValue([{}])
      getFirestore.mockReturnValue({})
    })

    it('returns auth/not-logged-in when user is null', async () => {
      getCurrentUser.mockReturnValue(null)
      const result = await submitProfileReview('target', 5, 'Great')
      expect(result.success).toBe(false)
      expect(result.error).toBe('auth/not-logged-in')
    })

    it('returns cannot-review-self when uid matches', async () => {
      getCurrentUser.mockReturnValue({ uid: 'me' })
      const result = await submitProfileReview('me', 4, 'Nice')
      expect(result.success).toBe(false)
      expect(result.error).toBe('cannot-review-self')
    })

    it('returns invalid-rating for rating 0', async () => {
      getCurrentUser.mockReturnValue({ uid: 'user1' })
      const result = await submitProfileReview('target', 0, '')
      expect(result.success).toBe(false)
      expect(result.error).toBe('invalid-rating')
    })

    it('returns invalid-rating for rating 6', async () => {
      getCurrentUser.mockReturnValue({ uid: 'user1' })
      const result = await submitProfileReview('target', 6, '')
      expect(result.success).toBe(false)
      expect(result.error).toBe('invalid-rating')
    })

    it('succeeds on new review (no existing doc)', async () => {
      getCurrentUser.mockReturnValue({ uid: 'user1', displayName: 'Alice' })
      getDoc.mockResolvedValue({ exists: () => false, data: () => ({}) })
      const { setDoc } = await import('firebase/firestore')
      setDoc.mockResolvedValue(undefined)
      const { updateDoc } = await import('firebase/firestore')
      updateDoc.mockResolvedValue(undefined)
      const result = await submitProfileReview('target', 4, 'Great hitchhiker')
      expect(result.success).toBe(true)
    })

    it('succeeds on updated review (existing doc with old rating)', async () => {
      getCurrentUser.mockReturnValue({ uid: 'user1', displayName: 'Alice' })
      getDoc.mockResolvedValue({ exists: () => true, data: () => ({ rating: 3 }) })
      const { setDoc } = await import('firebase/firestore')
      setDoc.mockResolvedValue(undefined)
      const { updateDoc } = await import('firebase/firestore')
      updateDoc.mockResolvedValue(undefined)
      const result = await submitProfileReview('target', 5, 'Improved')
      expect(result.success).toBe(true)
    })

    it('returns success:false when Firestore throws', async () => {
      getCurrentUser.mockReturnValue({ uid: 'user1' })
      getDoc.mockRejectedValue(new Error('Firestore unavailable'))
      const result = await submitProfileReview('target', 4, 'Test')
      expect(result.success).toBe(false)
    })
  })

  describe('getMyReviewForUser — error path', () => {
    it('returns null when getDoc throws', async () => {
      getApps.mockReturnValue([{}])
      getFirestore.mockReturnValue({})
      getCurrentUser.mockReturnValue({ uid: 'user1' })
      getDoc.mockRejectedValue(new Error('Firestore error'))
      const result = await getMyReviewForUser('target')
      expect(result).toBeNull()
    })
  })
})
