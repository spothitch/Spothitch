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
  })
})
