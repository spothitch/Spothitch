/**
 * Challenges.js tests — renderChallengesModal + renderChallengeCard
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({
    showChallenges: true,
    lang: 'fr',
    challengeTab: 'weekly',
    checkins: 5,
    spotsCreated: 2,
    reviewsGiven: 3,
    messagesSent: 10,
    spotsViewed: 25,
    photosAdded: 1,
    helpfulMessages: 2,
    countriesVisited: 4,
  })),
}))
vi.mock('../../src/data/challenges.js', () => ({
  getActiveChallenges: vi.fn(() => ({
    weekly: [
      { id: 'w1', name: 'Check-in 5x', nameEn: 'Check-in 5 times', description: 'Desc', descriptionEn: 'Desc EN', icon: '🔥', type: 'checkins', current: 3, target: 5, progress: 0.6, points: 50, xp: 25, completed: false },
    ],
    monthly: [
      { id: 'm1', name: 'Crée 5 spots', nameEn: 'Create 5 spots', description: 'Desc', icon: '📍', type: 'spots', current: 2, target: 5, progress: 0.4, points: 200, xp: 100, completed: false },
    ],
    annual: [],
  })),
}))

import { renderChallengesModal, renderChallengeCard } from '../../src/components/modals/Challenges.js'
import { getState } from '../../src/stores/state.js'

const defaultState = {
  showChallenges: true,
  lang: 'fr',
  challengeTab: 'weekly',
  checkins: 5,
  spotsCreated: 2,
  reviewsGiven: 3,
  messagesSent: 10,
  spotsViewed: 25,
  photosAdded: 1,
  helpfulMessages: 2,
  countriesVisited: 4,
}

const mockChallenge = {
  id: 'c1', name: 'Test', nameEn: 'Test EN', description: 'Desc', descriptionEn: 'Desc EN',
  icon: '🎯', type: 'checkins', current: 3, target: 10, progress: 0.3,
  points: 50, xp: 25, completed: false,
}

describe('renderChallengesModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getState.mockReturnValue({ ...defaultState })
  })

  it('returns empty string when showChallenges is false', () => {
    getState.mockReturnValue({ showChallenges: false })
    expect(renderChallengesModal()).toBe('')
  })

  it('renders modal HTML when showChallenges is true', () => {
    const html = renderChallengesModal()
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(100)
  })

  it('renders weekly tab content by default', () => {
    const html = renderChallengesModal()
    expect(html).toContain('Check-in 5x')
  })

  it('renders monthly tab when challengeTab is monthly', () => {
    getState.mockReturnValue({
      showChallenges: true, lang: 'fr', challengeTab: 'monthly',
      checkins: 0, spotsCreated: 0, reviewsGiven: 0, messagesSent: 0,
      spotsViewed: 0, photosAdded: 0, helpfulMessages: 0, countriesVisited: 0,
    })
    const html = renderChallengesModal()
    expect(html).toContain('Crée 5 spots')
  })

  it('renders challenge cards with progress', () => {
    const html = renderChallengesModal()
    expect(html).toContain('3/5') // current/target
  })
})

describe('renderChallengeCard', () => {
  it('renders challenge card HTML', () => {
    const html = renderChallengeCard(mockChallenge, 'fr', 'weekly')
    expect(html).toContain('challenge-card')
    expect(html).toContain('Test')
  })

  it('renders EN name when lang is en and nameEn exists', () => {
    const html = renderChallengeCard(mockChallenge, 'en', 'weekly')
    expect(html).toContain('Test EN')
  })

  it('renders progress percentage', () => {
    const html = renderChallengeCard(mockChallenge, 'fr', 'weekly')
    expect(html).toContain('30%')
  })

  it('renders points and XP', () => {
    const html = renderChallengeCard(mockChallenge, 'fr', 'weekly')
    expect(html).toContain('+50 pts')
    expect(html).toContain('+25 XP')
  })

  it('renders action button when not completed', () => {
    const html = renderChallengeCard(mockChallenge, 'fr', 'weekly')
    expect(html).toContain('<button')
  })

  it('renders completed state without action button', () => {
    const completed = { ...mockChallenge, completed: true }
    const html = renderChallengeCard(completed, 'fr', 'weekly')
    expect(html).toContain('opacity-60')
    expect(html).toContain('✓')
  })

  it('renders monthly type with purple gradient', () => {
    const html = renderChallengeCard(mockChallenge, 'fr', 'monthly')
    expect(html).toContain('purple')
  })

  it('renders annual type with amber gradient', () => {
    const html = renderChallengeCard(mockChallenge, 'fr', 'annual')
    expect(html).toContain('amber')
  })

  it('caps progress at 100%', () => {
    const overProgress = { ...mockChallenge, progress: 1.5 }
    const html = renderChallengeCard(overProgress, 'fr', 'weekly')
    expect(html).toContain('100%')
  })
})
