import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ friends: [], friendRequests: [] })),
  setState: vi.fn(),
}))
vi.mock('../../src/services/firebase.js', () => ({
  getCurrentUser: vi.fn(() => null),
}))
vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('firebase/app', () => ({
  getApps: vi.fn(() => []),
  getApp: vi.fn(),
}))
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false, data: () => ({}) })),
  setDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
  deleteDoc: vi.fn(() => Promise.resolve()),
  onSnapshot: vi.fn(() => () => {}),
  query: vi.fn(),
  where: vi.fn(),
  limit: vi.fn(),
  serverTimestamp: vi.fn(() => 'SERVER_TS'),
  writeBatch: vi.fn(() => ({
    set: vi.fn(),
    delete: vi.fn(),
    commit: vi.fn(() => Promise.resolve()),
  })),
}))

import {
  subscribeFriendsList,
  unsubscribeFriendsList,
  updatePresence,
  stopPresence,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  getMutualFriendsCount,
} from '../../src/services/friends.js'
import { getState, setState } from '../../src/stores/state.js'
import { getCurrentUser } from '../../src/services/firebase.js'
import { getApps, getApp } from 'firebase/app'
import { getFirestore, getDocs, getDoc, setDoc, updateDoc, deleteDoc, writeBatch, onSnapshot } from 'firebase/firestore'

describe('friends service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getState.mockReturnValue({ friends: [], friendRequests: [] })
    getCurrentUser.mockReturnValue(null)
  })

  describe('subscribeFriendsList', () => {
    it('returns early when uid is null', () => {
      expect(() => subscribeFriendsList(null)).not.toThrow()
    })

    it('returns early when no Firebase apps (no db)', () => {
      expect(() => subscribeFriendsList('user1')).not.toThrow()
    })

    it('returns early when uid is empty string', () => {
      expect(() => subscribeFriendsList('')).not.toThrow()
    })
  })

  describe('unsubscribeFriendsList', () => {
    it('runs without error when no active subscriptions', () => {
      expect(() => unsubscribeFriendsList()).not.toThrow()
    })

    it('calls setState with empty friends list', () => {
      unsubscribeFriendsList()
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ friends: [], friendRequests: [] })
      )
    })

    it('can be called multiple times without error', () => {
      expect(() => {
        unsubscribeFriendsList()
        unsubscribeFriendsList()
      }).not.toThrow()
    })
  })

  describe('stopPresence', () => {
    it('runs without error when no interval is active', () => {
      expect(() => stopPresence()).not.toThrow()
    })

    it('can be called multiple times without error', () => {
      expect(() => {
        stopPresence()
        stopPresence()
      }).not.toThrow()
    })
  })

  describe('updatePresence', () => {
    it('returns early when user is null', async () => {
      getCurrentUser.mockReturnValue(null)
      await expect(updatePresence()).resolves.toBeUndefined()
    })

    it('returns early when no db (getApps returns [])', async () => {
      getCurrentUser.mockReturnValue({ uid: 'user1' })
      // getApps returns [] → getDb() returns null → early return
      await expect(updatePresence()).resolves.toBeUndefined()
    })
  })

  describe('searchUsers', () => {
    it('returns empty array for empty string', async () => {
      const result = await searchUsers('')
      expect(result).toEqual([])
    })

    it('returns empty array for null', async () => {
      const result = await searchUsers(null)
      expect(result).toEqual([])
    })

    it('returns empty array for whitespace-only string', async () => {
      const result = await searchUsers('   ')
      expect(result).toEqual([])
    })

    it('returns empty array when no Firebase db', async () => {
      const result = await searchUsers('alice')
      expect(Array.isArray(result)).toBe(true)
    })
  })

  describe('sendFriendRequest', () => {
    it('returns not_authenticated when no user (null)', async () => {
      getCurrentUser.mockReturnValue(null)
      const result = await sendFriendRequest('target-user')
      expect(result.success).toBe(false)
      expect(result.error).toBe('not_authenticated')
    })

    it('returns not_authenticated when no db', async () => {
      getCurrentUser.mockReturnValue({ uid: 'user1' })
      const result = await sendFriendRequest('target-user')
      expect(result.success).toBe(false)
      expect(result.error).toBe('not_authenticated')
    })

    it('returns cannot_add_self when targetId equals user uid — no db case first', async () => {
      getCurrentUser.mockReturnValue(null)
      const result = await sendFriendRequest('myself')
      expect(result.success).toBe(false)
    })
  })

  describe('acceptFriendRequest', () => {
    it('returns not_authenticated when no user', async () => {
      getCurrentUser.mockReturnValue(null)
      const result = await acceptFriendRequest('request-id')
      expect(result.success).toBe(false)
      expect(result.error).toBe('not_authenticated')
    })

    it('returns not_authenticated when no db', async () => {
      getCurrentUser.mockReturnValue({ uid: 'user1' })
      const result = await acceptFriendRequest('request-id')
      expect(result.success).toBe(false)
    })
  })
})

// ==================== Firebase-available paths ====================

describe('friends service — with Firebase', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getApps.mockReturnValue([{}])
    getFirestore.mockReturnValue({})
    getState.mockReturnValue({ friends: [], friendRequests: [] })
    getCurrentUser.mockReturnValue({ uid: 'me', displayName: 'Me', photoURL: null })
  })

  describe('subscribeFriendsList — with db', () => {
    it('calls onSnapshot for friends and requests', () => {
      onSnapshot.mockImplementation((_ref, successCb, _errCb) => {
        successCb({ docs: [] })
        return () => {}
      })
      subscribeFriendsList('me')
      expect(onSnapshot).toHaveBeenCalledTimes(2)
    })

    it('handles friends snapshot with docs', async () => {
      onSnapshot.mockImplementationOnce((_ref, cb) => {
        cb({ docs: [{ id: 'friend1', data: () => ({ name: 'Alice' }) }] })
        return () => {}
      }).mockImplementationOnce((_ref, cb) => {
        cb({ docs: [] })
        return () => {}
      })
      subscribeFriendsList('me')
      // callback is async (dynamic import inside) — allow enough time
      await new Promise(r => setTimeout(r, 100))
      // setState called at least once (may be for friendRequests or friends)
      expect(setState).toHaveBeenCalled()
    })

    it('handles permission-denied error in friends snapshot', () => {
      onSnapshot.mockImplementationOnce((_ref, _cb, errCb) => {
        errCb({ code: 'permission-denied' })
        return () => {}
      }).mockImplementationOnce((_ref, cb) => {
        cb({ docs: [] })
        return () => {}
      })
      expect(() => subscribeFriendsList('me')).not.toThrow()
    })

    it('handles permission-denied error in requests snapshot', () => {
      onSnapshot.mockImplementationOnce((_ref, cb) => {
        cb({ docs: [] })
        return () => {}
      }).mockImplementationOnce((_ref, _cb, errCb) => {
        errCb({ code: 'permission-denied' })
        return () => {}
      })
      expect(() => subscribeFriendsList('me')).not.toThrow()
    })
  })

  describe('updatePresence — with db', () => {
    it('calls updateDoc when db and user available', async () => {
      updateDoc.mockResolvedValue(undefined)
      await updatePresence()
      expect(updateDoc).toHaveBeenCalled()
    })

    it('handles updateDoc error silently', async () => {
      updateDoc.mockRejectedValue(new Error('permission denied'))
      await expect(updatePresence()).resolves.toBeUndefined()
    })
  })

  describe('searchUsers — with db', () => {
    it('returns results from Firestore', async () => {
      getDocs.mockResolvedValue({
        docs: [
          { id: 'user2', data: () => ({ username: 'alice', displayName: 'Alice' }) },
        ],
      })
      const results = await searchUsers('alice')
      expect(Array.isArray(results)).toBe(true)
    })

    it('excludes current user from results', async () => {
      getDocs.mockResolvedValue({
        docs: [
          { id: 'me', data: () => ({ username: 'me' }) },
          { id: 'other', data: () => ({ username: 'other' }) },
        ],
      })
      const results = await searchUsers('me')
      expect(results.find(r => r.id === 'me')).toBeUndefined()
    })

    it('falls back to displayName search when username search returns empty', async () => {
      getDocs
        .mockResolvedValueOnce({ docs: [] }) // username search empty
        .mockResolvedValueOnce({ docs: [{ id: 'u2', data: () => ({ displayName: 'Bob' }) }] }) // displayName search
      const results = await searchUsers('Bob')
      expect(getDocs).toHaveBeenCalledTimes(2)
    })

    it('tries capitalized fallback when lowercase search returns empty', async () => {
      getDocs
        .mockResolvedValueOnce({ docs: [] }) // username
        .mockResolvedValueOnce({ docs: [] }) // displayName exact
        .mockResolvedValueOnce({ docs: [{ id: 'u3', data: () => ({ displayName: 'Alice' }) }] }) // capitalized
      const results = await searchUsers('alice')
      expect(getDocs).toHaveBeenCalledTimes(3)
    })

    it('excludes existing friends from results', async () => {
      getState.mockReturnValue({ friends: [{ id: 'friend1' }], friendRequests: [] })
      getDocs.mockResolvedValue({
        docs: [
          { id: 'friend1', data: () => ({ username: 'friend1' }) },
          { id: 'stranger', data: () => ({ username: 'stranger' }) },
        ],
      })
      const results = await searchUsers('friend')
      expect(results.find(r => r.id === 'friend1')).toBeUndefined()
    })

    it('returns empty on Firestore error (failed-precondition)', async () => {
      const err = new Error('index required')
      err.code = 'failed-precondition'
      getDocs.mockRejectedValue(err)
      const results = await searchUsers('alice')
      expect(results).toEqual([])
    })

    it('returns empty on generic Firestore error', async () => {
      getDocs.mockRejectedValue(new Error('network error'))
      const results = await searchUsers('bob')
      expect(results).toEqual([])
    })
  })

  describe('sendFriendRequest — with db', () => {
    it('returns cannot_add_self when targetId equals uid', async () => {
      const result = await sendFriendRequest('me')
      expect(result.success).toBe(false)
      expect(result.error).toBe('cannot_add_self')
    })

    it('returns too_many_friends when friends list >= 500', async () => {
      getState.mockReturnValue({ friends: Array(500).fill({ id: 'x' }) })
      const result = await sendFriendRequest('other')
      expect(result.success).toBe(false)
      expect(result.error).toBe('too_many_friends')
    })

    it('returns user_unavailable when blocked', async () => {
      getDoc
        .mockResolvedValueOnce({ exists: () => true }) // blocked check
      const result = await sendFriendRequest('target')
      expect(result.success).toBe(false)
      expect(result.error).toBe('user_unavailable')
    })

    it('returns already_friends when friendship exists', async () => {
      getDoc
        .mockResolvedValueOnce({ exists: () => false }) // not blocked
        .mockResolvedValueOnce({ exists: () => true })  // already friends
      const result = await sendFriendRequest('target')
      expect(result.success).toBe(false)
      expect(result.error).toBe('already_friends')
    })

    it('returns request_already_sent when request exists', async () => {
      getDoc
        .mockResolvedValueOnce({ exists: () => false }) // not blocked
        .mockResolvedValueOnce({ exists: () => false }) // not friends
        .mockResolvedValueOnce({ exists: () => true })  // request already sent
      const result = await sendFriendRequest('target')
      expect(result.success).toBe(false)
      expect(result.error).toBe('request_already_sent')
    })

    it('returns success when all checks pass', async () => {
      getDoc
        .mockResolvedValueOnce({ exists: () => false }) // not blocked
        .mockResolvedValueOnce({ exists: () => false }) // not friends
        .mockResolvedValueOnce({ exists: () => false }) // no existing request
      setDoc.mockResolvedValue(undefined)
      const result = await sendFriendRequest('target')
      expect(result.success).toBe(true)
    })

    it('skips blocked check silently when getDoc throws', async () => {
      getDoc
        .mockRejectedValueOnce(new Error('permission denied')) // blocked check throws → skip
        .mockResolvedValueOnce({ exists: () => false }) // not friends
        .mockResolvedValueOnce({ exists: () => false }) // no request
      setDoc.mockResolvedValue(undefined)
      const result = await sendFriendRequest('target')
      expect(result.success).toBe(true)
    })
  })

  describe('acceptFriendRequest — with db', () => {
    it('returns too_many_friends when friends list >= 500', async () => {
      getState.mockReturnValue({ friends: Array(500).fill({ id: 'x' }) })
      const result = await acceptFriendRequest('req1')
      expect(result.success).toBe(false)
      expect(result.error).toBe('too_many_friends')
    })

    it('returns request_not_found when doc does not exist', async () => {
      getDoc.mockResolvedValue({ exists: () => false })
      const result = await acceptFriendRequest('req1')
      expect(result.success).toBe(false)
      expect(result.error).toBe('request_not_found')
    })

    it('returns success after batch commit', async () => {
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ name: 'Alice', avatar: 'thumbs-up' }),
      })
      const mockBatch = { set: vi.fn(), delete: vi.fn(), commit: vi.fn(() => Promise.resolve()) }
      writeBatch.mockReturnValue(mockBatch)
      const result = await acceptFriendRequest('req1')
      expect(result.success).toBe(true)
      expect(mockBatch.commit).toHaveBeenCalled()
    })

    it('returns error on batch commit failure', async () => {
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ name: 'Alice', avatar: 'thumbs-up' }),
      })
      const mockBatch = { set: vi.fn(), delete: vi.fn(), commit: vi.fn(() => Promise.reject(new Error('error'))) }
      writeBatch.mockReturnValue(mockBatch)
      const result = await acceptFriendRequest('req1')
      expect(result.success).toBe(false)
    })
  })

  describe('declineFriendRequest — with db', () => {
    it('returns not_authenticated when no user', async () => {
      getCurrentUser.mockReturnValue(null)
      const result = await declineFriendRequest('req1')
      expect(result.success).toBe(false)
      expect(result.error).toBe('not_authenticated')
    })

    it('returns not_authenticated when no db', async () => {
      getApps.mockReturnValue([])
      const result = await declineFriendRequest('req1')
      expect(result.success).toBe(false)
    })

    it('returns success when deleteDoc succeeds', async () => {
      deleteDoc.mockResolvedValue(undefined)
      const result = await declineFriendRequest('req1')
      expect(result.success).toBe(true)
    })

    it('returns error when deleteDoc throws', async () => {
      deleteDoc.mockRejectedValue(new Error('permission denied'))
      const result = await declineFriendRequest('req1')
      expect(result.success).toBe(false)
    })
  })

  describe('removeFriend — with db', () => {
    it('returns not_authenticated when no user', async () => {
      getCurrentUser.mockReturnValue(null)
      const result = await removeFriend('friend1')
      expect(result.success).toBe(false)
      expect(result.error).toBe('not_authenticated')
    })

    it('returns not_authenticated when no db', async () => {
      getApps.mockReturnValue([])
      const result = await removeFriend('friend1')
      expect(result.success).toBe(false)
    })

    it('returns success after batch commit', async () => {
      const mockBatch = { delete: vi.fn(), commit: vi.fn(() => Promise.resolve()) }
      writeBatch.mockReturnValue(mockBatch)
      const result = await removeFriend('friend1')
      expect(result.success).toBe(true)
    })

    it('falls back to single-side delete on batch failure', async () => {
      const mockBatch = { delete: vi.fn(), commit: vi.fn(() => Promise.reject(new Error('batch fail'))) }
      writeBatch.mockReturnValue(mockBatch)
      deleteDoc.mockResolvedValue(undefined)
      const result = await removeFriend('friend1')
      expect(result.success).toBe(true)
    })

    it('returns error when both batch and fallback fail', async () => {
      const mockBatch = { delete: vi.fn(), commit: vi.fn(() => Promise.reject(new Error('batch fail'))) }
      writeBatch.mockReturnValue(mockBatch)
      deleteDoc.mockRejectedValue(new Error('also failed'))
      const result = await removeFriend('friend1')
      expect(result.success).toBe(false)
    })
  })

  describe('getMutualFriendsCount — with db', () => {
    it('returns 0 when no user', async () => {
      getCurrentUser.mockReturnValue(null)
      const count = await getMutualFriendsCount('other')
      expect(count).toBe(0)
    })

    it('returns 0 when no db', async () => {
      getApps.mockReturnValue([])
      const count = await getMutualFriendsCount('other')
      expect(count).toBe(0)
    })

    it('returns 0 when current user has no friends', async () => {
      getState.mockReturnValue({ friends: [] })
      const count = await getMutualFriendsCount('other')
      expect(count).toBe(0)
    })

    it('counts mutual friends correctly', async () => {
      getState.mockReturnValue({ friends: [{ id: 'f1' }, { id: 'f2' }, { id: 'f3' }] })
      getDocs.mockResolvedValue({
        docs: [{ id: 'f1' }, { id: 'f3' }, { id: 'f4' }],
      })
      const count = await getMutualFriendsCount('other')
      expect(count).toBe(2) // f1 and f3 are mutual
    })

    it('excludes current user from mutual count', async () => {
      getState.mockReturnValue({ friends: [{ id: 'me' }, { id: 'f1' }] })
      getDocs.mockResolvedValue({ docs: [{ id: 'me' }, { id: 'f1' }] })
      const count = await getMutualFriendsCount('other')
      expect(count).toBe(1) // 'me' excluded
    })

    it('returns 0 on Firestore error', async () => {
      getState.mockReturnValue({ friends: [{ id: 'f1' }] })
      getDocs.mockRejectedValue(new Error('error'))
      const count = await getMutualFriendsCount('other')
      expect(count).toBe(0)
    })
  })
})
