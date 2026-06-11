/**
 * Stats.js tests — renderStatsModal branches including mini chart and countries
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn(() => '<svg></svg>') }))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ showStats: false })),
}))
vi.mock('../../src/data/vip-levels.js', () => ({
  getVipProgress: vi.fn(() => ({ level: 'gold', percent: 65, nextLevel: 'platinum', pointsNeeded: 350 })),
  getLeagueProgress: vi.fn(() => ({ league: 'silver', percent: 40, nextLeague: 'gold', pointsNeeded: 200 })),
}))
vi.mock('../../src/services/gamification.js', () => ({
  getGamificationSummary: vi.fn(() => ({
    level: 5,
    xp: 750,
    xpToNextLevel: 250,
    points: 1500,
    checkins: 10,
    spotsCreated: 3,
    reviewsGiven: 5,
    badges: [{ id: 'b1', name: 'Hitchhiker', icon: 'star', unlocked: true }],
    challenges: [],
    leagueRank: 12,
    vipLevel: { name: 'Gold', icon: '⭐', color: '#F0A830', image: null },
    nextVip: { name: 'Platinum' },
    pointsToNextVip: 500,
    league: { name: 'Silver', icon: '🥈', color: '#C0C0C0', image: null },
    leaguePoints: 200,
    pointsToNextLeague: 300,
  })),
}))
vi.mock('../../src/services/statsCalculator.js', () => ({
  calculateTravelStats: vi.fn(() => ({
    totalCheckins: 10,
    totalDistanceKm: 3500,
    countriesCount: 4,
    countries: ['FR', 'DE', 'ES', 'IT'],
    spotsUsedCount: 8,
    totalRides: 12,
    avgWaitMinutes: 18,
    longestRideKm: 450,
    distanceComparison: { emoji: '✈️', text: 'Paris to Tokyo' },
    favoriteDay: { emoji: '📅', day: 'Saturday' },
  })),
  formatWaitDuration: vi.fn((m) => `${m}min`),
  formatDistanceKm: vi.fn((d) => `${d} km`),
  getCountryFlag: vi.fn((c) => `🏳️`),
  getProgressionData: vi.fn(() => [
    { month: 'Jan', monthKey: '2026-01', checkins: 2, distance: 300 },
    { month: 'Fév', monthKey: '2026-02', checkins: 0, distance: 0 },
    { month: 'Mar', monthKey: '2026-03', checkins: 5, distance: 800 },
    { month: 'Avr', monthKey: '2026-04', checkins: 3, distance: 500 },
    { month: 'Mai', monthKey: '2026-05', checkins: 0, distance: 0 },
    { month: 'Juin', monthKey: '2026-06', checkins: 1, distance: 100 },
  ]),
}))

import { renderStatsModal } from '../../src/components/modals/Stats.js'
import { getState } from '../../src/stores/state.js'
import { calculateTravelStats, getProgressionData } from '../../src/services/statsCalculator.js'

describe('renderStatsModal — visibility gate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getState.mockReturnValue({ showStats: false })
  })

  it('returns empty string when showStats is false', () => {
    expect(renderStatsModal()).toBe('')
  })
})

describe('renderStatsModal — full state', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getState.mockReturnValue({ showStats: true, points: 1500, seasonPoints: 200 })
  })

  it('renders modal HTML', () => {
    const html = renderStatsModal()
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(200)
  })

  it('renders stats-modal class', () => {
    const html = renderStatsModal()
    expect(html).toContain('stats-modal')
  })

  it('renders close button', () => {
    const html = renderStatsModal()
    expect(html).toContain('closeStats')
  })

  it('renders country flags when countries are present', () => {
    const html = renderStatsModal()
    expect(html).toContain('🏳️')
  })

  it('renders mini chart when progression has check-ins', () => {
    const html = renderStatsModal()
    expect(html).toContain('Progression')
  })

  it('renders checkin count', () => {
    const html = renderStatsModal()
    expect(html).toContain('10') // totalCheckins
  })
})

describe('renderStatsModal — no progression data', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getState.mockReturnValue({ showStats: true, points: 0, seasonPoints: 0 })
    getProgressionData.mockReturnValue([
      { month: 'Jan', monthKey: '2026-01', checkins: 0, distance: 0 },
      { month: 'Fév', monthKey: '2026-02', checkins: 0, distance: 0 },
    ])
  })

  it('skips mini chart section when no check-ins', () => {
    const html = renderStatsModal()
    expect(html).toBeTruthy()
    // Still renders without crashing
    expect(html).toContain('stats-modal')
  })
})

describe('renderStatsModal — no country data', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getState.mockReturnValue({ showStats: true, points: 100, seasonPoints: 50 })
    calculateTravelStats.mockReturnValue({
      totalCheckins: 2,
      totalDistanceKm: 100,
      countriesCount: 0,
      countries: [],
      spotsUsedCount: 1,
      totalRides: 2,
      avgWaitMinutes: 10,
      longestRideKm: 50,
      distanceComparison: { emoji: '🚗', text: 'Short trip' },
      favoriteDay: { emoji: '📅', day: 'Monday' },
    })
  })

  it('renders without country flags section', () => {
    const html = renderStatsModal()
    expect(html).toBeTruthy()
    expect(html).toContain('stats-modal')
  })
})
