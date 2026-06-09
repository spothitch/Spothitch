import { describe, it, expect, beforeEach } from 'vitest'

import {
  getUserVote,
  getAllUserVotes,
  submitVote,
  getVoteTotals,
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
})
