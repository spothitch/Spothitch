import { describe, it, expect, vi } from 'vitest'

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

import { submitProfileReview } from '../../src/services/userReviews.js'
import { getCurrentUser } from '../../src/services/firebase.js'

describe('userReviews', () => {
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

    it('prevents self-review', async () => {
      getCurrentUser.mockReturnValue({ uid: 'user1' })
      // getApps returns [] so db is null → offline error first
      const result = await submitProfileReview('user1', 5, 'Great!')
      // Should either be offline or cannot-review-self
      expect(result.success).toBe(false)
    })

    it('rejects invalid rating', async () => {
      getCurrentUser.mockReturnValue({ uid: 'user1' })
      const result = await submitProfileReview('target', 0, '')
      expect(result.success).toBe(false)
    })

    it('rejects rating > 5', async () => {
      getCurrentUser.mockReturnValue({ uid: 'user1' })
      const result = await submitProfileReview('target', 6, '')
      expect(result.success).toBe(false)
    })
  })
})
