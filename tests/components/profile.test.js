import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/components/ui/DonationCard.js', () => ({
  renderDonationCard: vi.fn(() => '<div class="donation-card"></div>'),
}))
vi.mock('../../src/services/trustScore.js', () => ({
  renderVerifiedCheckmark: vi.fn(() => ''),
  getUserTrustScore: vi.fn(() => ({ score: 85, level: 'trusted', badges: [] })),
}))
vi.mock('../../src/components/EmptyState.js', () => ({
  renderEmptyState: vi.fn(() => '<div class="empty-state"></div>'),
}))
vi.mock('../../src/utils/toggle.js', () => ({
  renderToggle: vi.fn((id, val) => `<button class="toggle" data-id="${id}">${val}</button>`),
}))
vi.mock('../../src/data/featuresData.js', () => ({
  FEATURES_DATA: [
    { id: 'f1', title: 'Guardian Mode', category: 'safety', votes: 45, status: 'live' },
    { id: 'f2', title: 'Trip Journal', category: 'planning', votes: 32, status: 'live' },
    { id: 'f3', title: 'Offline Maps', category: 'offline', votes: 28, status: 'planned' },
  ],
}))
vi.mock('../../src/services/featureVotes.js', () => ({
  getVoteTotals: vi.fn(() => ({ f1: 45, f2: 32, f3: 28 })),
  getFeatureComments: vi.fn(() => []),
}))
vi.mock('../../src/services/spotFreshness.js', () => ({
  getSpotFreshness: vi.fn(() => ({ color: 'green', labelKey: 'fresh', icon: 'circle-check', isCertified: false })),
}))
vi.mock('../../src/components/views/ProfileDemos.js', () => ({}))

import { renderProfile } from '../../src/components/views/Profile.js'
import { mockUser, mockSpots } from '../mocks/mockSpots.js'

const baseState = {
  user: mockUser,
  spots: mockSpots,
  lang: 'fr',
}

describe('renderProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders profil sub-tab (default)', () => {
    const html = renderProfile({ ...baseState, profileSubTab: 'profil' })
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(100)
  })

  it('renders profil tab without user (logged out)', () => {
    const html = renderProfile({ ...baseState, user: null, profileSubTab: 'profil' })
    expect(html).toBeTruthy()
  })

  it('renders reglages sub-tab (settings)', () => {
    const html = renderProfile({ ...baseState, profileSubTab: 'reglages' })
    expect(html).toBeTruthy()
  })

  it('renders progression sub-tab (roadmap)', () => {
    const html = renderProfile({ ...baseState, profileSubTab: 'progression' })
    expect(html).toBeTruthy()
  })

  it('renders default tab when no profileSubTab', () => {
    const html = renderProfile({ ...baseState })
    expect(html).toBeTruthy()
  })

  it('renders language picker modal when showLanguagePicker', () => {
    const html = renderProfile({ ...baseState, showLanguagePicker: true, langPickerSearch: '' })
    expect(html).toBeTruthy()
    expect(html).toContain('role="dialog"')
  })

  it('renders language picker with search filter', () => {
    const html = renderProfile({ ...baseState, showLanguagePicker: true, langPickerSearch: 'fr' })
    expect(html).toBeTruthy()
  })

  it('renders language level picker modal', () => {
    const html = renderProfile({ ...baseState, showLanguageLevelPicker: true, langPickerSelectedName: 'Français' })
    expect(html).toBeTruthy()
  })

  it('renders profil with spot history', () => {
    const html = renderProfile({
      ...baseState,
      profileSubTab: 'profil',
      userSpots: mockSpots,
    })
    expect(html).toBeTruthy()
  })

  it('renders settings with notification toggles', () => {
    const html = renderProfile({
      ...baseState,
      profileSubTab: 'reglages',
      notificationsEnabled: true,
      pushEnabled: false,
      darkMode: true,
    })
    expect(html).toBeTruthy()
  })
})
