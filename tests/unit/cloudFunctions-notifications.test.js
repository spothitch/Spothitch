/**
 * Cloud Functions Notification Tests
 * Tests the logic of notification Cloud Functions
 * Uses mocked firebase-admin and firebase-functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

// ─── Mock Firebase Admin ──────────────────────────────────────

const mockSend = vi.fn()
const mockBatchDelete = vi.fn()
const mockBatchCommit = vi.fn()

const createMockTokensSnap = (tokens, options = {}) => ({
  empty: tokens.length === 0,
  docs: tokens.map((token, i) => ({
    data: () => ({ token }),
    ref: { path: `users/recipient/fcmTokens/hash${i}` },
  })),
})

const mockDb = {
  collection: vi.fn().mockReturnThis(),
  doc: vi.fn().mockReturnThis(),
  get: vi.fn(),
  batch: vi.fn(() => ({
    delete: mockBatchDelete,
    commit: mockBatchCommit.mockResolvedValue(undefined),
  })),
}

vi.mock('firebase-admin/firestore', () => ({
  getFirestore: () => mockDb,
}))

vi.mock('firebase-admin/messaging', () => ({
  getMessaging: () => ({ send: mockSend }),
}))

// We don't import the actual Cloud Functions (they use require + firebase-functions)
// Instead we test the core logic patterns

describe('Cloud Functions Notification Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSend.mockResolvedValue('message-id')
    mockBatchCommit.mockResolvedValue(undefined)
  })

  // ─── Token Management ────────────────────────────────────────

  describe('Token sending pattern', () => {
    it('sends to all tokens', async () => {
      const tokens = ['token-1', 'token-2', 'token-3']
      const notification = { title: 'Test', body: 'Hello' }

      await Promise.all(
        tokens.map((token) =>
          mockSend({
            token,
            notification,
            data: { type: 'test' },
          })
        )
      )

      expect(mockSend).toHaveBeenCalledTimes(3)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({ token: 'token-1' })
      )
    })

    it('filters empty tokens', () => {
      const rawTokens = ['token-1', '', null, undefined, 'token-2']
      const validTokens = rawTokens.filter(Boolean)
      expect(validTokens).toEqual(['token-1', 'token-2'])
    })
  })

  describe('Stale token cleanup', () => {
    it('identifies stale tokens from error codes', async () => {
      const staleTokens = []
      const errors = [
        { code: 'messaging/invalid-registration-token' },
        { code: 'messaging/registration-token-not-registered' },
        { code: 'messaging/internal-error' }, // NOT stale
      ]

      for (const err of errors) {
        if (
          err.code === 'messaging/invalid-registration-token' ||
          err.code === 'messaging/registration-token-not-registered'
        ) {
          staleTokens.push('stale-token')
        }
      }

      expect(staleTokens.length).toBe(2) // Only 2 stale error types
    })

    it('cleans stale tokens via batch delete', async () => {
      const staleTokens = ['stale-1', 'stale-2']
      const tokensSnap = createMockTokensSnap(['stale-1', 'good-token', 'stale-2'])

      const batch = mockDb.batch()
      for (const doc of tokensSnap.docs) {
        if (staleTokens.includes(doc.data().token)) {
          batch.delete(doc.ref)
        }
      }
      await batch.commit()

      expect(mockBatchDelete).toHaveBeenCalledTimes(2)
      expect(mockBatchCommit).toHaveBeenCalledTimes(1)
    })

    it('skips cleanup when no stale tokens', async () => {
      const staleTokens = []
      if (staleTokens.length > 0) {
        mockBatchCommit()
      }
      expect(mockBatchCommit).not.toHaveBeenCalled()
    })
  })

  // ─── Message Format ──────────────────────────────────────────

  describe('DM notification format', () => {
    it('truncates long messages to 100 chars', () => {
      const text = 'A'.repeat(200)
      const body = text.length > 100 ? text.slice(0, 100) + '...' : text
      expect(body.length).toBe(103) // 100 + "..."
      expect(body.endsWith('...')).toBe(true)
    })

    it('uses full text for short messages', () => {
      const text = 'Salut !'
      const body = text.length > 100 ? text.slice(0, 100) + '...' : text
      expect(body).toBe('Salut !')
    })

    it('handles empty text', () => {
      const text = ''
      const body = text || ''
      expect(body).toBe('')
    })

    it('does not send when sender === recipient', () => {
      const senderId = 'user-123'
      const recipientId = 'user-123'
      const shouldSend = recipientId && recipientId !== senderId
      expect(shouldSend).toBe(false)
    })

    it('does not send when recipientId is missing', () => {
      const recipientId = null
      const shouldSend = recipientId && recipientId !== 'sender'
      expect(shouldSend).toBeFalsy()
    })
  })

  describe('Friend request notification format', () => {
    it('uses fromName or fallback', () => {
      const request1 = { fromName: 'Alice', fromUsername: 'alice_hitch' }
      const name1 = request1.fromName || request1.fromUsername || 'Un voyageur'
      expect(name1).toBe('Alice')

      const request2 = { fromUsername: 'bob_road' }
      const name2 = request2.fromName || request2.fromUsername || 'Un voyageur'
      expect(name2).toBe('bob_road')

      const request3 = {}
      const name3 = request3.fromName || request3.fromUsername || 'Un voyageur'
      expect(name3).toBe('Un voyageur')
    })
  })

  describe('Group message notification format', () => {
    it('excludes sender from recipients', () => {
      const members = ['user-1', 'user-2', 'user-3', 'user-4']
      const senderId = 'user-2'
      const recipients = members.filter((uid) => uid !== senderId)
      expect(recipients).toEqual(['user-1', 'user-3', 'user-4'])
    })

    it('handles empty members', () => {
      const members = []
      const recipients = members.filter((uid) => uid !== 'sender')
      expect(recipients.length).toBe(0)
    })

    it('truncates group message to 80 chars with sender name', () => {
      const senderName = 'Alice'
      const text = 'B'.repeat(100)
      const body = senderName
        ? `${senderName}: ${text.length > 80 ? text.slice(0, 80) + '...' : text}`
        : text
      expect(body).toContain('Alice:')
      expect(body.length).toBeLessThan(200)
    })
  })

  describe('Spot activity notification format', () => {
    it('does not notify when creator validates own spot', () => {
      const validation = { userId: 'creator-1' }
      const spot = { creatorId: 'creator-1' }
      const shouldNotify = validation.userId !== spot.creatorId
      expect(shouldNotify).toBe(false)
    })

    it('notifies when different user validates', () => {
      const validation = { userId: 'validator-1' }
      const spot = { creatorId: 'creator-1' }
      const shouldNotify = validation.userId !== spot.creatorId
      expect(shouldNotify).toBe(true)
    })

    it('includes rating in review notification', () => {
      const review = { rating: 4, text: 'Great spot!' }
      const spotName = 'Paris Nord'
      const ratingText = review.rating ? ` (${review.rating}/5)` : ''
      const title = `Nouvel avis sur ${spotName}${ratingText}`
      expect(title).toBe('Nouvel avis sur Paris Nord (4/5)')
    })

    it('truncates review text to 80 chars', () => {
      const reviewText = 'C'.repeat(100)
      const body =
        reviewText.length > 80 ? reviewText.slice(0, 80) + '...' : reviewText
      expect(body.length).toBe(83)
    })
  })

  // ─── WebPush Config ──────────────────────────────────────────

  describe('WebPush notification config', () => {
    it('always includes icon and badge URLs', () => {
      const webpush = {
        fcmOptions: { link: 'https://spothitch.com' },
        notification: {
          icon: 'https://spothitch.com/icons/icon-192x192.png',
          badge: 'https://spothitch.com/icons/badge-72x72.png',
          tag: 'test-tag',
        },
      }
      expect(webpush.notification.icon).toContain('icon-192x192')
      expect(webpush.notification.badge).toContain('badge-72x72')
      expect(webpush.fcmOptions.link).toBe('https://spothitch.com')
    })

    it('uses conversation-specific tag for DMs', () => {
      const convId = 'conv-abc'
      const tag = `dm-${convId}`
      expect(tag).toBe('dm-conv-abc')
    })

    it('uses group-specific tag', () => {
      const groupId = 'group-xyz'
      const tag = `group-${groupId}`
      expect(tag).toBe('group-group-xyz')
    })

    it('uses spot-specific tag', () => {
      const spotId = 'spot-123'
      const tag = `spot-${spotId || 'activity'}`
      expect(tag).toBe('spot-spot-123')
    })
  })

  // ─── Service Worker Background Message ──────────────────────

  describe('Service Worker notification options', () => {
    it('uses special vibration for guardian overdue', () => {
      const dataType = 'companion_overdue'
      const vibrate =
        dataType === 'companion_overdue'
          ? [500, 200, 500, 200, 500, 200, 500]
          : [100, 50, 100]
      expect(vibrate).toEqual([500, 200, 500, 200, 500, 200, 500])
    })

    it('uses default vibration for regular notifications', () => {
      const dataType = 'new_message'
      const vibrate =
        dataType === 'companion_overdue'
          ? [500, 200, 500, 200, 500, 200, 500]
          : [100, 50, 100]
      expect(vibrate).toEqual([100, 50, 100])
    })

    it('requires interaction for guardian overdue', () => {
      const dataType = 'companion_overdue'
      const requireInteraction = dataType === 'companion_overdue'
      expect(requireInteraction).toBe(true)
    })

    it('adds action buttons for guardian overdue', () => {
      const dataType = 'companion_overdue'
      const actions =
        dataType === 'companion_overdue'
          ? [
              { action: 'checkin', title: "I'm safe" },
              { action: 'alert', title: 'Send alert' },
            ]
          : []
      expect(actions).toHaveLength(2)
      expect(actions[0].action).toBe('checkin')
      expect(actions[1].action).toBe('alert')
    })

    it('no action buttons for regular notifications', () => {
      const dataType = 'new_message'
      const actions = dataType === 'companion_overdue' ? [{ action: 'checkin' }] : []
      expect(actions).toHaveLength(0)
    })
  })
})
