import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({
    user: { uid: 'u1', displayName: 'TestUser' },
    username: 'testuser',
    avatar: 'thumbs-up',
    points: 100,
  })),
  setState: vi.fn(),
}))
vi.mock('../../src/services/notifications.js', () => ({ showToast: vi.fn() }))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))
vi.mock('../../src/services/gamification.js', () => ({
  addPoints: vi.fn(),
  addSeasonPoints: vi.fn(),
}))

import {
  createTeam,
  joinTeam,
  leaveTeam,
  getTeamLeaderboard,
  startTeamChallenge,
  contributeToChallenge,
  renderTeamDashboard,
  TEAM_CHALLENGE_TYPES,
  TEAM_CHALLENGES,
} from '../../src/services/teamChallenges.js'
import { getState, setState } from '../../src/stores/state.js'
import { showToast } from '../../src/services/notifications.js'

describe('teamChallenges', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    getState.mockReturnValue({
      user: { uid: 'u1', displayName: 'TestUser' },
      username: 'testuser',
      avatar: 'thumbs-up',
      points: 100,
      teams: [],
      myTeamId: null,
    })
  })

  describe('TEAM_CHALLENGE_TYPES', () => {
    it('is an object', () => {
      expect(typeof TEAM_CHALLENGE_TYPES).toBe('object')
    })

    it('has COLLECTIVE_DISTANCE type', () => {
      expect(TEAM_CHALLENGE_TYPES.COLLECTIVE_DISTANCE).toBeDefined()
    })

    it('has SPOT_VALIDATION type', () => {
      expect(TEAM_CHALLENGE_TYPES.SPOT_VALIDATION).toBeDefined()
    })

    it('has at least 4 challenge types', () => {
      expect(Object.keys(TEAM_CHALLENGE_TYPES).length).toBeGreaterThanOrEqual(4)
    })

    it('each type has id, name, icon', () => {
      Object.values(TEAM_CHALLENGE_TYPES).forEach(type => {
        expect(type.id).toBeDefined()
        expect(type.icon).toBeDefined()
      })
    })
  })

  describe('TEAM_CHALLENGES', () => {
    it('is an array', () => {
      expect(Array.isArray(TEAM_CHALLENGES)).toBe(true)
    })

    it('has at least 2 challenges', () => {
      expect(TEAM_CHALLENGES.length).toBeGreaterThanOrEqual(2)
    })

    it('each challenge has id, type, target, rewards', () => {
      TEAM_CHALLENGES.forEach(c => {
        expect(c.id).toBeDefined()
        expect(c.type).toBeDefined()
        expect(c.target).toBeGreaterThan(0)
        expect(c.rewards).toBeDefined()
      })
    })
  })

  describe('createTeam', () => {
    it('creates a team with required fields', () => {
      const team = createTeam({ name: 'Road Warriors' })
      expect(team).toBeTruthy()
      expect(team.name).toBe('Road Warriors')
      expect(team.members.length).toBe(1)
    })

    it('returns null when no user uid', () => {
      getState.mockReturnValue({ user: null, teams: [] })
      expect(createTeam({ name: 'Test' })).toBeNull()
    })

    it('shows toast when no user uid', () => {
      getState.mockReturnValue({ user: null, teams: [] })
      createTeam({ name: 'Test' })
      expect(showToast).toHaveBeenCalled()
    })

    it('sets creator as team leader', () => {
      const team = createTeam({ name: 'Leader Test' })
      expect(team.leader).toBe('u1')
    })

    it('initializes stats object', () => {
      const team = createTeam({ name: 'Stats Test' })
      expect(team.stats).toBeDefined()
      expect(team.stats.totalDistance).toBe(0)
    })

    it('initializes empty activeChallenges', () => {
      const team = createTeam({ name: 'Challenges Test' })
      expect(Array.isArray(team.activeChallenges)).toBe(true)
      expect(team.activeChallenges.length).toBe(0)
    })

    it('uses provided avatar', () => {
      const team = createTeam({ name: 'Avatar Test', avatar: 'star' })
      expect(team.avatar).toBe('star')
    })

    it('defaults avatar to "users"', () => {
      const team = createTeam({ name: 'Default Avatar' })
      expect(team.avatar).toBe('users')
    })

    it('calls setState', () => {
      createTeam({ name: 'State Test' })
      expect(setState).toHaveBeenCalled()
    })

    it('shows success toast', () => {
      createTeam({ name: 'Toast Test' })
      expect(showToast).toHaveBeenCalled()
    })
  })

  describe('joinTeam', () => {
    it('returns false for non-existent team', () => {
      expect(joinTeam('nonexistent')).toBe(false)
    })

    it('returns false when no user', () => {
      getState.mockReturnValue({ user: null, teams: [] })
      expect(joinTeam('team_1')).toBe(false)
    })

    it('shows toast when no user', () => {
      getState.mockReturnValue({ user: null, teams: [] })
      joinTeam('team_1')
      expect(showToast).toHaveBeenCalled()
    })

    it('returns false when team not found in teams array', () => {
      getState.mockReturnValue({
        user: { uid: 'u1' },
        teams: [{ id: 't2', members: ['u2'], leader: 'u2', name: 'Other' }],
      })
      expect(joinTeam('t1')).toBe(false)
    })

    it('returns false when user already member', () => {
      getState.mockReturnValue({
        user: { uid: 'u1' },
        teams: [{ id: 't1', members: ['u1'], leader: 'u1', name: 'Test' }],
      })
      expect(joinTeam('t1')).toBe(false)
    })

    it('shows toast when already member', () => {
      getState.mockReturnValue({
        user: { uid: 'u1' },
        teams: [{ id: 't1', members: ['u1'], leader: 'u1', name: 'Test' }],
      })
      joinTeam('t1')
      expect(showToast).toHaveBeenCalled()
    })

    it('returns false when team is full (10 members)', () => {
      getState.mockReturnValue({
        user: { uid: 'u1' },
        teams: [{
          id: 't1',
          members: ['u2','u3','u4','u5','u6','u7','u8','u9','u10','u11'],
          leader: 'u2',
          name: 'Full',
        }],
      })
      expect(joinTeam('t1')).toBe(false)
    })

    it('returns true when successfully joining', () => {
      getState.mockReturnValue({
        user: { uid: 'u1' },
        teams: [{ id: 't1', members: ['u2'], leader: 'u2', name: 'Open Team' }],
        myTeamId: null,
      })
      expect(joinTeam('t1')).toBe(true)
    })

    it('calls setState on successful join', () => {
      getState.mockReturnValue({
        user: { uid: 'u1' },
        teams: [{ id: 't1', members: ['u2'], leader: 'u2', name: 'Open' }],
      })
      joinTeam('t1')
      expect(setState).toHaveBeenCalled()
    })
  })

  describe('leaveTeam', () => {
    it('does not throw when no team', () => {
      expect(() => leaveTeam()).not.toThrow()
    })

    it('returns false when no myTeamId', () => {
      getState.mockReturnValue({ user: { uid: 'u1' }, myTeamId: null, teams: [] })
      expect(leaveTeam()).toBe(false)
    })

    it('shows toast when not in any team', () => {
      getState.mockReturnValue({ user: { uid: 'u1' }, myTeamId: null, teams: [] })
      leaveTeam()
      expect(showToast).toHaveBeenCalled()
    })

    it('returns false when team not found in teams array', () => {
      getState.mockReturnValue({
        user: { uid: 'u1' },
        myTeamId: 'ghost-team',
        teams: [],
      })
      expect(leaveTeam()).toBe(false)
    })

    it('returns true when successfully leaving', () => {
      getState.mockReturnValue({
        user: { uid: 'u1' },
        myTeamId: 't1',
        teams: [{
          id: 't1',
          members: ['u1', 'u2'],
          leader: 'u1',
          name: 'Test Team',
          activeChallenges: [],
          completedChallenges: [],
        }],
      })
      expect(leaveTeam()).toBe(true)
    })

    it('calls setState on successful leave', () => {
      getState.mockReturnValue({
        user: { uid: 'u1' },
        myTeamId: 't1',
        teams: [{
          id: 't1',
          members: ['u1'],
          leader: 'u1',
          name: 'Solo Team',
          activeChallenges: [],
          completedChallenges: [],
        }],
      })
      leaveTeam()
      expect(setState).toHaveBeenCalled()
    })
  })

  describe('startTeamChallenge', () => {
    it('returns false when not in a team', () => {
      getState.mockReturnValue({ user: { uid: 'u1' }, myTeamId: null, teams: [] })
      expect(startTeamChallenge('team_1')).toBe(false)
    })

    it('shows toast when not in a team', () => {
      getState.mockReturnValue({ user: { uid: 'u1' }, myTeamId: null, teams: [] })
      startTeamChallenge('team_1')
      expect(showToast).toHaveBeenCalled()
    })

    it('returns false for unknown challenge id', () => {
      getState.mockReturnValue({
        user: { uid: 'u1' },
        myTeamId: 't1',
        teams: [{
          id: 't1',
          members: ['u1','u2','u3'],
          leader: 'u1',
          activeChallenges: [],
          completedChallenges: [],
        }],
      })
      expect(startTeamChallenge('nonexistent')).toBe(false)
    })

    it('returns false when team not found', () => {
      getState.mockReturnValue({
        user: { uid: 'u1' },
        myTeamId: 'ghost',
        teams: [],
      })
      expect(startTeamChallenge('team_1')).toBe(false)
    })

    it('returns false when not enough members', () => {
      // TEAM_CHALLENGES[0] requires minMembers: 3
      getState.mockReturnValue({
        user: { uid: 'u1' },
        myTeamId: 't1',
        teams: [{
          id: 't1',
          members: ['u1'], // only 1 member, need 3
          leader: 'u1',
          activeChallenges: [],
        }],
      })
      expect(startTeamChallenge('team_1')).toBe(false)
    })
  })

  describe('contributeToChallenge', () => {
    it('returns false when not in a team', () => {
      getState.mockReturnValue({ user: { uid: 'u1' }, myTeamId: null, teams: [] })
      expect(contributeToChallenge('c1', 10)).toBe(false)
    })

    it('returns false when no userId', () => {
      getState.mockReturnValue({ user: null, myTeamId: null, teams: [] })
      expect(contributeToChallenge('c1', 10)).toBe(false)
    })

    it('returns false when team not found', () => {
      getState.mockReturnValue({
        user: { uid: 'u1' },
        myTeamId: 'ghost',
        teams: [],
      })
      expect(contributeToChallenge('c1', 10)).toBe(false)
    })

    it('returns false when challenge not active', () => {
      getState.mockReturnValue({
        user: { uid: 'u1' },
        myTeamId: 't1',
        teams: [{
          id: 't1',
          members: ['u1'],
          activeChallenges: [],
        }],
      })
      expect(contributeToChallenge('nonexistent', 10)).toBe(false)
    })

    it('returns true when contributing to active challenge', () => {
      getState.mockReturnValue({
        user: { uid: 'u1' },
        myTeamId: 't1',
        teams: [{
          id: 't1',
          members: ['u1'],
          activeChallenges: [{
            id: 'active_c1',
            progress: 0,
            target: 100,
            contributions: {},
          }],
          completedChallenges: [],
        }],
      })
      expect(contributeToChallenge('active_c1', 10)).toBe(true)
    })

    it('calls setState on contribution', () => {
      getState.mockReturnValue({
        user: { uid: 'u1' },
        myTeamId: 't1',
        teams: [{
          id: 't1',
          members: ['u1'],
          activeChallenges: [{
            id: 'active_c2',
            progress: 50,
            target: 200,
            contributions: {},
          }],
          completedChallenges: [],
        }],
      })
      contributeToChallenge('active_c2', 20)
      expect(setState).toHaveBeenCalled()
    })
  })

  describe('getTeamLeaderboard', () => {
    it('returns array', () => {
      const lb = getTeamLeaderboard()
      expect(Array.isArray(lb)).toBe(true)
    })

    it('returns empty array when no teams', () => {
      getState.mockReturnValue({ teams: [] })
      expect(getTeamLeaderboard()).toEqual([])
    })

    it('returns team entries with score', () => {
      getState.mockReturnValue({
        teams: [{
          id: 't1',
          name: 'Warriors',
          avatar: 'star',
          members: ['u1', 'u2'],
          stats: { totalDistance: 500 },
          completedChallenges: [{}],
        }],
      })
      const lb = getTeamLeaderboard()
      expect(lb.length).toBe(1)
      expect(lb[0].name).toBe('Warriors')
      expect(lb[0].score).toBeGreaterThan(0)
    })
  })

  describe('renderTeamDashboard', () => {
    it('returns HTML string', () => {
      const html = renderTeamDashboard({ currentTeam: null })
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(50)
    })

    it('renders no-team state when currentTeam is null', () => {
      const html = renderTeamDashboard({ currentTeam: null })
      expect(html).toContain('openCreateTeam()')
    })

    it('renders no-team state includes available challenges', () => {
      const html = renderTeamDashboard({ currentTeam: null })
      expect(html).toContain('teamAvailableChallenges')
    })

    it('renders team dashboard when currentTeam is set', () => {
      const state = {
        currentTeam: {
          id: 't1',
          name: 'Road Warriors',
          avatar: 'star',
          members: ['u1', 'u2'],
          leader: 'u1',
          stats: { totalDistance: 1000, spotsValidated: 5, countriesVisited: ['FR', 'DE'], photosShared: 3 },
          activeChallenges: [],
          completedChallenges: [],
        },
      }
      const html = renderTeamDashboard(state)
      expect(html).toContain('Road Warriors')
    })

    it('shows team stats when team exists', () => {
      const state = {
        currentTeam: {
          id: 't1',
          name: 'Explorers',
          avatar: 'globe',
          members: ['u1'],
          leader: 'u1',
          stats: { totalDistance: 500, spotsValidated: 10, countriesVisited: ['FR'], photosShared: 0 },
          activeChallenges: [],
          completedChallenges: [{}],
        },
      }
      const html = renderTeamDashboard(state)
      expect(html).toContain('teamStatKmTraveled')
    })

    it('renders active challenges when present', () => {
      const state = {
        currentTeam: {
          id: 't1',
          name: 'Challengers',
          avatar: 'flag',
          members: ['u1', 'u2'],
          leader: 'u1',
          stats: { totalDistance: 0, spotsValidated: 0, countriesVisited: [], photosShared: 0 },
          activeChallenges: [{
            id: 'c1',
            type: 'collective_distance',
            name: 'Distance Challenge',
            description: 'Travel far',
            progress: 50,
            target: 100,
            unit: 'km',
            rewards: { points: 500 },
          }],
          completedChallenges: [],
        },
      }
      const html = renderTeamDashboard(state)
      expect(html).toContain('Distance Challenge')
    })

    it('shows no-challenges message when activeChallenges is empty', () => {
      const state = {
        currentTeam: {
          id: 't1',
          name: 'New Team',
          avatar: 'users',
          members: ['u1'],
          leader: 'u1',
          stats: { totalDistance: 0, spotsValidated: 0, countriesVisited: [], photosShared: 0 },
          activeChallenges: [],
          completedChallenges: [],
        },
      }
      const html = renderTeamDashboard(state)
      expect(html).toContain('teamNoActiveChallenges')
    })
  })

  describe('window team handlers', () => {
    it('window.closeJoinTeam calls setState', () => {
      expect(typeof window.closeJoinTeam).toBe('function')
      window.closeJoinTeam()
      expect(setState).toHaveBeenCalledWith({ showJoinTeam: false })
    })

    it('window.closeTeamSettings calls setState', () => {
      expect(typeof window.closeTeamSettings).toBe('function')
      window.closeTeamSettings()
      expect(setState).toHaveBeenCalledWith({ showTeamSettings: false })
    })

    it('window.openTeamChallengesList calls setState', () => {
      expect(typeof window.openTeamChallengesList).toBe('function')
      window.openTeamChallengesList()
      expect(setState).toHaveBeenCalledWith({ showTeamChallenges: true })
    })

    it('window.openJoinTeam runs without error', () => {
      expect(typeof window.openJoinTeam).toBe('function')
      expect(() => window.openJoinTeam()).not.toThrow()
    })

    it('window.openTeamSettings runs without error', () => {
      expect(typeof window.openTeamSettings).toBe('function')
      expect(() => window.openTeamSettings()).not.toThrow()
    })

    it('window.inviteToTeam runs without error when no team', () => {
      getState.mockReturnValue({ user: { uid: 'u1' }, myTeamId: null })
      expect(() => window.inviteToTeam()).not.toThrow()
    })

    it('window.inviteToTeam runs without error when in a team', () => {
      getState.mockReturnValue({ user: { uid: 'u1' }, myTeamId: 't1' })
      expect(() => window.inviteToTeam()).not.toThrow()
    })
  })
})
