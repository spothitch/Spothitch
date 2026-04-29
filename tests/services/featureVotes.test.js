import { describe, it, expect, beforeEach } from 'vitest'

import {
  getUserVote,
  getAllUserVotes,
} from '../../src/services/featureVotes.js'

describe('featureVotes', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('getUserVote', () => {
    it('returns null when no vote exists', () => {
      expect(getUserVote('feature1')).toBeNull()
    })

    it('returns vote when exists', () => {
      localStorage.setItem('spothitch_feature_votes', JSON.stringify({
        feature1: { vote: 'essential', comment: 'Great feature', timestamp: '2024-01-01' },
      }))
      const vote = getUserVote('feature1')
      expect(vote.vote).toBe('essential')
      expect(vote.comment).toBe('Great feature')
    })

    it('returns null for corrupt JSON', () => {
      localStorage.setItem('spothitch_feature_votes', 'not-json')
      expect(getUserVote('feature1')).toBeNull()
    })
  })

  describe('getAllUserVotes', () => {
    it('returns empty object when no votes', () => {
      expect(getAllUserVotes()).toEqual({})
    })

    it('returns all votes', () => {
      localStorage.setItem('spothitch_feature_votes', JSON.stringify({
        f1: { vote: 'essential' },
        f2: { vote: 'useful' },
      }))
      const votes = getAllUserVotes()
      expect(Object.keys(votes).length).toBe(2)
      expect(votes.f1.vote).toBe('essential')
    })

    it('returns empty object on corrupt JSON', () => {
      localStorage.setItem('spothitch_feature_votes', 'broken')
      expect(getAllUserVotes()).toEqual({})
    })
  })
})
