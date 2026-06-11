/**
 * Leaderboard.js tests — renderLeaderboardModal + window handlers
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn(() => '<svg></svg>') }))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ showLeaderboard: false, leaderboardTab: 'weekly', leaderboardCountry: 'all' })),
  setState: vi.fn(),
}))
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
}))
vi.mock('firebase/app', () => ({
  getApps: vi.fn(() => []),
  getApp: vi.fn(),
}))

import { renderLeaderboardModal } from '../../src/components/modals/Leaderboard.js'
import { setState, getState } from '../../src/stores/state.js'

describe('renderLeaderboardModal', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renders leaderboard modal HTML', () => {
    getState.mockReturnValue({ showLeaderboard: true, leaderboardTab: 'weekly', leaderboardCountry: 'all', leaderboardData: null })
    const html = renderLeaderboardModal()
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(50)
  })

  it('returns empty when showLeaderboard is false', () => {
    getState.mockReturnValue({ showLeaderboard: false })
    const html = renderLeaderboardModal()
    expect(html).toBe('')
  })

  it('renders loading state when leaderboardData is null', () => {
    getState.mockReturnValue({ showLeaderboard: true, leaderboardTab: 'weekly', leaderboardData: null, leaderboardCountry: 'all' })
    const html = renderLeaderboardModal()
    expect(html).toContain('loading')
  })

  it('renders leaderboard entries when data is present', () => {
    getState.mockReturnValue({
      showLeaderboard: true,
      leaderboardTab: 'weekly',
      leaderboardCountry: 'all',
      leaderboardData: [
        { uid: 'u1', username: 'Alice', avatar: 'thumbs-up', points: 500, seasonPoints: 100, country: 'FR', rank: 1 }
      ]
    })
    const html = renderLeaderboardModal()
    expect(html).toContain('Alice')
  })
})

describe('Leaderboard window handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getState.mockReturnValue({ leaderboardTab: 'weekly', leaderboardCountry: 'all' })
  })

  it('closeLeaderboard calls setState with showLeaderboard: false', () => {
    window.closeLeaderboard()
    expect(setState).toHaveBeenCalledWith({ showLeaderboard: false })
  })

  it('setLeaderboardCountry calls setState with the country', () => {
    window.setLeaderboardCountry('FR')
    expect(setState).toHaveBeenCalledWith({ leaderboardCountry: 'FR' })
  })

  it('setLeaderboardTab calls setState with leaderboardTab', () => {
    window.setLeaderboardTab('allTime')
    expect(setState).toHaveBeenCalledWith(expect.objectContaining({ leaderboardTab: 'allTime' }))
  })

  it('openLeaderboard calls setState with showLeaderboard: true', () => {
    window.openLeaderboard()
    expect(setState).toHaveBeenCalledWith(expect.objectContaining({ showLeaderboard: true }))
  })
})
