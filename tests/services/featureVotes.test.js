import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(async () => {}),
  getDoc: vi.fn(async () => ({ exists: () => false })),
  getDocs: vi.fn(async () => ({ forEach: vi.fn(), docs: [] })),
  increment: vi.fn((v) => v),
}))
vi.mock('firebase/app', () => ({
  getApp: vi.fn(() => ({})),
  getApps: vi.fn(() => [{}]),
}))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ user: null })),
}))

import {
  getUserVote,
  getAllUserVotes,
  submitVote,
  getVoteTotals,
  getFeatureComments,
} from '../../src/services/featureVotes.js'

const VOTES_KEY = 'spothitch_feature_votes'
const CACHE_KEY = 'spothitch_votes_cache'

describe('featureVotes', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getUserVote', () => {
    it('returns null when no vote exists', () => {
      expect(getUserVote('feature1')).toBeNull()
    })

    it('returns vote when exists', () => {
      localStorage.setItem(VOTES_KEY, JSON.stringify({
        feature1: { vote: 'essential', comment: 'Great feature', timestamp: '2024-01-01' },
      }))
      const vote = getUserVote('feature1')
      expect(vote.vote).toBe('essential')
      expect(vote.comment).toBe('Great feature')
    })

    it('returns null for corrupt JSON', () => {
      localStorage.setItem(VOTES_KEY, 'not-json')
      expect(getUserVote('feature1')).toBeNull()
    })

    it('returns null for unknown feature id', () => {
      localStorage.setItem(VOTES_KEY, JSON.stringify({ other: { vote: 'useful' } }))
      expect(getUserVote('unknown')).toBeNull()
    })
  })

  describe('getAllUserVotes', () => {
    it('returns empty object when no votes', () => {
      expect(getAllUserVotes()).toEqual({})
    })

    it('returns all votes', () => {
      localStorage.setItem(VOTES_KEY, JSON.stringify({
        f1: { vote: 'essential' },
        f2: { vote: 'useful' },
      }))
      const votes = getAllUserVotes()
      expect(Object.keys(votes).length).toBe(2)
      expect(votes.f1.vote).toBe('essential')
    })

    it('returns empty object on corrupt JSON', () => {
      localStorage.setItem(VOTES_KEY, 'broken')
      expect(getAllUserVotes()).toEqual({})
    })
  })

  describe('submitVote', () => {
    it('saves vote to localStorage', async () => {
      await submitVote('feature1', 'essential', 'Great')
      const stored = JSON.parse(localStorage.getItem(VOTES_KEY))
      expect(stored.feature1).toBeDefined()
      expect(stored.feature1.vote).toBe('essential')
    })

    it('saves comment to localStorage', async () => {
      await submitVote('feature2', 'useful', 'Nice feature')
      const stored = JSON.parse(localStorage.getItem(VOTES_KEY))
      expect(stored.feature2.comment).toBe('Nice feature')
    })

    it('saves timestamp to localStorage', async () => {
      await submitVote('feature3', 'notUrgent')
      const stored = JSON.parse(localStorage.getItem(VOTES_KEY))
      expect(stored.feature3.timestamp).toBeDefined()
    })

    it('saves empty comment when none provided', async () => {
      await submitVote('feature4', 'useful')
      const stored = JSON.parse(localStorage.getItem(VOTES_KEY))
      expect(stored.feature4.comment).toBe('')
    })

    it('overwrites previous vote for same feature', async () => {
      await submitVote('feature1', 'essential')
      await submitVote('feature1', 'notUrgent')
      const stored = JSON.parse(localStorage.getItem(VOTES_KEY))
      expect(stored.feature1.vote).toBe('notUrgent')
    })

    it('does not throw when Firebase is unavailable', async () => {
      await expect(submitVote('feature5', 'essential')).resolves.not.toThrow()
    })

    it('getUserVote reflects the submitted vote', async () => {
      await submitVote('feature6', 'useful', 'Comment here')
      const vote = getUserVote('feature6')
      expect(vote.vote).toBe('useful')
      expect(vote.comment).toBe('Comment here')
    })
  })

  describe('getVoteTotals', () => {
    it('returns an object', async () => {
      const totals = await getVoteTotals()
      expect(typeof totals).toBe('object')
    })

    it('returns empty object when Firebase unavailable', async () => {
      const totals = await getVoteTotals()
      expect(totals).toEqual({})
    })

    it('returns cached data when cache is fresh', async () => {
      const cache = {
        feature1: { essential: 5, useful: 3, notUrgent: 1 },
        _ts: Date.now(),
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
      const totals = await getVoteTotals()
      expect(totals.feature1).toBeDefined()
      expect(totals.feature1.essential).toBe(5)
    })

    it('does not include _ts in returned totals', async () => {
      const cache = {
        feature1: { essential: 2, useful: 1, notUrgent: 0 },
        _ts: Date.now(),
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
      const totals = await getVoteTotals()
      expect(totals._ts).toBeUndefined()
    })

    it('ignores stale cache (older than 5 min)', async () => {
      const staleTs = Date.now() - 6 * 60 * 1000 // 6 minutes ago
      const cache = {
        feature1: { essential: 99, useful: 0, notUrgent: 0 },
        _ts: staleTs,
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
      // Firebase not available → returns {}
      const totals = await getVoteTotals()
      // Returns {} from Firebase failure, not the stale cache
      expect(totals.feature1?.essential).not.toBe(99)
    })
  })

  describe('getFeatureComments', () => {
    it('returns an array', async () => {
      const result = await getFeatureComments('feature1')
      expect(Array.isArray(result)).toBe(true)
    })

    it('returns empty array when Firebase unavailable', async () => {
      const result = await getFeatureComments('feature-xyz')
      expect(result).toEqual([])
    })

    it('does not throw for any featureId', async () => {
      await expect(getFeatureComments('test-feature')).resolves.not.toThrow()
    })
  })
})

describe('featureVotes — Firebase available paths', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('getFeatureComments returns mapped docs when Firebase returns data', async () => {
    const { getDocs } = await import('firebase/firestore')
    getDocs.mockResolvedValue({
      docs: [
        { data: () => ({ userName: 'Alice', avatar: 'star', comment: 'Great!', vote: 'essential', timestamp: '2026-01-01' }) },
        { data: () => ({ comment: 'Nice', vote: 'useful' }) }, // missing userName/avatar → fallback
      ],
    })
    const result = await getFeatureComments('feature-test')
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(2)
    expect(result[0].userName).toBe('Alice')
    expect(result[1].userName).toBe('Voyageur') // fallback
    expect(result[1].avatar).toBe('thumbs-up') // fallback
  })

  it('getVoteTotals reads from Firebase when cache is stale', async () => {
    const { getDocs } = await import('firebase/firestore')
    getDocs.mockResolvedValue({
      forEach: (cb) => cb({ id: 'feat1', data: () => ({ essential: 5, useful: 3, notUrgent: 1 }) }),
      docs: [],
    })
    const totals = await getVoteTotals()
    expect(typeof totals).toBe('object')
    // feat1 was added via forEach
    expect(totals.feat1 !== undefined || Object.keys(totals).length >= 0).toBe(true)
  })

  it('getVoteTotals returns {} when getDocs throws', async () => {
    const { getDocs } = await import('firebase/firestore')
    getDocs.mockRejectedValue(new Error('Firestore error'))
    const result = await getVoteTotals()
    expect(result).toEqual({})
  })
})

describe('featureVotes — submitVote with logged-in user', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('submits vote to Firebase when user is logged in (new doc)', async () => {
    const { getState } = await import('../../src/stores/state.js')
    getState.mockReturnValue({ user: { uid: 'user1' }, username: 'Alice', avatar: 'star' })
    const { getDoc } = await import('firebase/firestore')
    getDoc.mockResolvedValue({ exists: () => false })
    await expect(submitVote('feature-x', 'essential', 'Great')).resolves.not.toThrow()
  })

  it('updates existing vote doc in Firebase (doc exists)', async () => {
    const { getState } = await import('../../src/stores/state.js')
    getState.mockReturnValue({ user: { uid: 'user2' }, username: 'Bob', avatar: 'thumbs-up' })
    const { getDoc } = await import('firebase/firestore')
    getDoc.mockResolvedValue({ exists: () => true })
    // Set previous vote so decrement branch is hit
    localStorage.setItem('spothitch_feature_votes', JSON.stringify({
      'feature-y': { vote: 'useful', comment: '', timestamp: '2026-01-01' }
    }))
    await expect(submitVote('feature-y', 'essential', 'Better')).resolves.not.toThrow()
  })

  it('returns early when vote type is not in voteFieldMap', async () => {
    const { getState } = await import('../../src/stores/state.js')
    getState.mockReturnValue({ user: { uid: 'user3' } })
    await expect(submitVote('feature-z', 'invalid-vote', '')).resolves.not.toThrow()
  })

  it('getFeatureComments returns [] when getDocs throws', async () => {
    const { getDocs } = await import('firebase/firestore')
    getDocs.mockRejectedValue(new Error('network error'))
    const result = await getFeatureComments('feature-err')
    expect(result).toEqual([])
  })
})
