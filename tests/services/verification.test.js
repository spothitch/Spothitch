import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({
    user: null,
    spots: [],
    spotVotes: {},
    recentVotes: {},
  })),
  setState: vi.fn(),
}))

vi.mock('../../src/services/notifications.js', () => ({
  showToast: vi.fn(),
}))

vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))

vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg>${name}</svg>`),
}))

vi.mock('../../src/services/gamification.js', () => ({
  addPoints: vi.fn(),
  addSeasonPoints: vi.fn(),
}))

import {
  VOTE_TYPES,
  getSpotVerification,
  getStatusBadge,
  renderVerificationBadge,
  renderVoteButtons,
  submitVote,
} from '../../src/services/verification.js'
import { getState, setState } from '../../src/stores/state.js'
import { showToast } from '../../src/services/notifications.js'

describe('verification', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    getState.mockReturnValue({
      user: null,
      spots: [],
      spotVotes: {},
      recentVotes: {},
    })
  })

  describe('VOTE_TYPES', () => {
    it('defines all expected vote types', () => {
      expect(VOTE_TYPES.ACCURATE).toBe('accurate')
      expect(VOTE_TYPES.OUTDATED).toBe('outdated')
      expect(VOTE_TYPES.WRONG_LOCATION).toBe('wrong_location')
      expect(VOTE_TYPES.DANGEROUS).toBe('dangerous')
      expect(VOTE_TYPES.EXCELLENT).toBe('excellent')
    })

    it('has exactly 5 vote types', () => {
      expect(Object.keys(VOTE_TYPES).length).toBe(5)
    })
  })

  describe('getSpotVerification', () => {
    it('returns unverified defaults when spot has no votes', () => {
      getState.mockReturnValue({ spotVotes: {}, recentVotes: {}, user: null })
      const result = getSpotVerification('spot-1')
      expect(result.status).toBe('unverified')
      expect(result.score).toBe(0)
      expect(result.canVote).toBe(true)
      expect(result.comments).toEqual([])
    })

    it('returns correct vote counts when votes exist', () => {
      getState.mockReturnValue({
        spotVotes: {
          'spot-1': {
            accurate: 3,
            outdated: 1,
            wrong_location: 0,
            dangerous: 0,
            excellent: 2,
            total: 6,
            lastVote: '2026-01-01T00:00:00.000Z',
            comments: [],
          },
        },
        recentVotes: {},
        user: null,
      })
      const result = getSpotVerification('spot-1')
      expect(result.votes.accurate).toBe(3)
      expect(result.votes.excellent).toBe(2)
      expect(result.votes.outdated).toBe(1)
      expect(result.score).toBe(6)
    })

    it('returns canVote=false when user already voted today', () => {
      const todayStr = new Date().toDateString()
      getState.mockReturnValue({
        spotVotes: {
          'spot-1': {
            accurate: 2, outdated: 0, wrong_location: 0, dangerous: 0, excellent: 0,
            total: 2, lastVote: null, comments: [],
          },
        },
        recentVotes: { [`vote_spot-1_anonymous_${todayStr}`]: true },
        user: null,
      })
      const result = getSpotVerification('spot-1')
      expect(result.canVote).toBe(false)
    })

    it('returns canVote=true when user has not voted today', () => {
      const todayStr = new Date().toDateString()
      getState.mockReturnValue({
        spotVotes: {
          'spot-1': {
            accurate: 1, outdated: 0, wrong_location: 0, dangerous: 0, excellent: 0,
            total: 1, lastVote: null, comments: [],
          },
        },
        recentVotes: {},
        user: null,
      })
      const result = getSpotVerification('spot-1')
      expect(result.canVote).toBe(true)
    })

    it('includes comments from votes', () => {
      getState.mockReturnValue({
        spotVotes: {
          'spot-2': {
            accurate: 1, outdated: 0, wrong_location: 0, dangerous: 0, excellent: 0,
            total: 1, lastVote: null,
            comments: [{ text: 'Great spot!', type: 'accurate', userId: 'u1', timestamp: '2026-01-01T00:00:00.000Z' }],
          },
        },
        recentVotes: {},
        user: null,
      })
      const result = getSpotVerification('spot-2')
      expect(result.comments.length).toBe(1)
      expect(result.comments[0].text).toBe('Great spot!')
    })

    it('computes verified status when >= 3 votes and majority positive', () => {
      getState.mockReturnValue({
        spotVotes: {
          'spot-3': {
            accurate: 4, outdated: 1, wrong_location: 0, dangerous: 0, excellent: 0,
            total: 5, lastVote: null, comments: [],
          },
        },
        recentVotes: {},
        user: null,
      })
      const result = getSpotVerification('spot-3')
      // 4 accurate / 5 total = 80% positive → verified
      expect(result.status).toBe('verified')
    })

    it('computes dangerous status when dangerous votes exceed threshold', () => {
      getState.mockReturnValue({
        spotVotes: {
          'spot-4': {
            accurate: 1, outdated: 0, wrong_location: 0, dangerous: 3, excellent: 0,
            total: 4, lastVote: null, comments: [],
          },
        },
        recentVotes: {},
        user: null,
      })
      const result = getSpotVerification('spot-4')
      expect(result.status).toBe('dangerous')
    })
  })

  describe('getStatusBadge', () => {
    it('returns unverified badge for unknown status', () => {
      const badge = getStatusBadge('unknown_status')
      expect(badge.label).toBe('statusUnverified')
      expect(badge.icon).toBe('info')
    })

    it('returns verified badge', () => {
      const badge = getStatusBadge('verified')
      expect(badge.label).toBe('statusVerified')
      expect(badge.color).toContain('emerald')
      expect(badge.icon).toBe('circle-check')
    })

    it('returns excellent badge', () => {
      const badge = getStatusBadge('excellent')
      expect(badge.label).toBe('statusExcellent')
      expect(badge.icon).toBe('star')
    })

    it('returns dangerous badge', () => {
      const badge = getStatusBadge('dangerous')
      expect(badge.label).toBe('statusDangerous')
      expect(badge.icon).toBe('skull')
    })

    it('returns disputed badge', () => {
      const badge = getStatusBadge('disputed')
      expect(badge.label).toBe('statusDisputed')
      expect(badge.icon).toBe('triangle-alert')
    })

    it('returns needs_update badge', () => {
      const badge = getStatusBadge('needs_update')
      expect(badge.label).toBe('statusNeedsUpdate')
      expect(badge.icon).toBe('circle-alert')
    })

    it('returns mixed badge', () => {
      const badge = getStatusBadge('mixed')
      expect(badge.label).toBe('statusMixed')
      expect(badge.icon).toBe('scale')
    })

    it('each badge has bg and color properties', () => {
      for (const status of ['unverified', 'verified', 'excellent', 'needs_update', 'disputed', 'dangerous', 'mixed']) {
        const badge = getStatusBadge(status)
        expect(badge.bg).toBeTruthy()
        expect(badge.color).toBeTruthy()
        expect(badge.label).toBeTruthy()
        expect(badge.icon).toBeTruthy()
      }
    })
  })

  describe('renderVerificationBadge', () => {
    it('returns an HTML string', () => {
      getState.mockReturnValue({ spotVotes: {}, recentVotes: {}, user: null })
      const html = renderVerificationBadge('spot-1')
      expect(typeof html).toBe('string')
      expect(html).toContain('span')
    })

    it('includes spot score when votes exist', () => {
      getState.mockReturnValue({
        spotVotes: {
          'spot-1': {
            accurate: 5, outdated: 0, wrong_location: 0, dangerous: 0, excellent: 0,
            total: 5, lastVote: null, comments: [],
          },
        },
        recentVotes: {},
        user: null,
      })
      const html = renderVerificationBadge('spot-1')
      expect(html).toContain('5')
    })

    it('does not show score when no votes', () => {
      getState.mockReturnValue({ spotVotes: {}, recentVotes: {}, user: null })
      const html = renderVerificationBadge('spot-no-votes')
      // score === 0, should not include (0) label
      expect(html).not.toContain('(0)')
    })

    it('includes badge color class', () => {
      getState.mockReturnValue({ spotVotes: {}, recentVotes: {}, user: null })
      const html = renderVerificationBadge('spot-1')
      // unverified badge uses slate color
      expect(html).toContain('slate')
    })
  })

  describe('renderVoteButtons', () => {
    it('renders HTML for vote buttons', () => {
      getState.mockReturnValue({ spotVotes: {}, recentVotes: {}, user: null })
      const html = renderVoteButtons('spot-1')
      expect(html).toBeTruthy()
      expect(typeof html).toBe('string')
    })

    it('shows vote buttons when canVote=true', () => {
      getState.mockReturnValue({ spotVotes: {}, recentVotes: {}, user: null })
      const html = renderVoteButtons('spot-1')
      expect(html).toContain('vote-btn')
      expect(html).toContain("voteSpot('spot-1', 'accurate')")
      expect(html).toContain("voteSpot('spot-1', 'excellent')")
      expect(html).toContain("voteSpot('spot-1', 'outdated')")
      expect(html).toContain("voteSpot('spot-1', 'dangerous')")
    })

    it('includes spot ID in onclick handlers', () => {
      getState.mockReturnValue({ spotVotes: {}, recentVotes: {}, user: null })
      const html = renderVoteButtons('my-spot-42')
      expect(html).toContain("voteSpot('my-spot-42'")
    })
  })

  describe('submitVote', () => {
    it('returns false when user already voted today', async () => {
      const todayStr = new Date().toDateString()
      getState.mockReturnValue({
        user: { uid: 'user1' },
        spots: [],
        spotVotes: {},
        recentVotes: { [`vote_spot-1_user1_${todayStr}`]: true },
      })
      const result = await submitVote('spot-1', VOTE_TYPES.ACCURATE)
      expect(result).toBe(false)
      expect(showToast).toHaveBeenCalledWith(expect.any(String), 'warning')
    })

    it('returns true and calls setState on successful vote', async () => {
      getState.mockReturnValue({
        user: { uid: 'user1' },
        spots: [{ id: 'spot-1', name: 'Test Spot' }],
        spotVotes: {},
        recentVotes: {},
      })
      const result = await submitVote('spot-1', VOTE_TYPES.ACCURATE)
      expect(result).toBe(true)
      expect(setState).toHaveBeenCalled()
    })

    it('shows success toast on successful vote', async () => {
      getState.mockReturnValue({
        user: { uid: 'user1' },
        spots: [],
        spotVotes: {},
        recentVotes: {},
      })
      await submitVote('spot-1', VOTE_TYPES.ACCURATE)
      expect(showToast).toHaveBeenCalledWith(expect.any(String), 'success')
    })

    it('initializes vote counters for new spot', async () => {
      getState.mockReturnValue({
        user: null,
        spots: [],
        spotVotes: {},
        recentVotes: {},
      })
      await submitVote('new-spot', VOTE_TYPES.EXCELLENT)
      const call = setState.mock.calls[0][0]
      expect(call.spotVotes['new-spot']).toBeDefined()
      expect(call.spotVotes['new-spot'].excellent).toBe(1)
      expect(call.spotVotes['new-spot'].total).toBe(1)
    })

    it('stores trimmed comment when provided', async () => {
      getState.mockReturnValue({
        user: null,
        spots: [],
        spotVotes: {},
        recentVotes: {},
      })
      await submitVote('spot-1', VOTE_TYPES.ACCURATE, '  Great spot!  ')
      const call = setState.mock.calls[0][0]
      const comments = call.spotVotes['spot-1'].comments
      expect(comments.length).toBe(1)
      expect(comments[0].text).toBe('Great spot!')
    })

    it('does not store comment when empty', async () => {
      getState.mockReturnValue({
        user: null,
        spots: [],
        spotVotes: {},
        recentVotes: {},
      })
      await submitVote('spot-1', VOTE_TYPES.ACCURATE, '')
      const call = setState.mock.calls[0][0]
      expect(call.spotVotes['spot-1'].comments.length).toBe(0)
    })

    it('updates existing spot verificationStatus in spots array', async () => {
      getState.mockReturnValue({
        user: null,
        spots: [
          { id: 'spot-1', name: 'Test' },
          { id: 'spot-2', name: 'Other' },
        ],
        spotVotes: {},
        recentVotes: {},
      })
      await submitVote('spot-1', VOTE_TYPES.ACCURATE)
      const call = setState.mock.calls[0][0]
      const updatedSpot = call.spots.find(s => s.id === 'spot-1')
      expect(updatedSpot.verificationStatus).toBeDefined()
      expect(updatedSpot.verificationScore).toBeDefined()
    })
  })
})
