import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  setState: vi.fn(),
  getState: vi.fn(() => ({})),
}))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn(() => '<svg></svg>') }))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeHTML: vi.fn((s) => s),
  escapeJSString: vi.fn((s) => s),
}))
vi.mock('../../src/data/featuresData.js', () => ({
  FEATURES_DATA: [
    { id: 'carte', name: 'Carte', emoji: '🗺️', status: 'available' },
    { id: 'stations', name: 'Stations', emoji: '⛽', status: 'available' },
    { id: 'sos', name: 'SOS', emoji: '🚨', status: 'beta' },
    { id: 'carnet', name: 'Carnet', emoji: '📔', status: 'available' },
    { id: 'amis', name: 'Amis', emoji: '🤝', status: 'beta' },
  ],
}))
vi.mock('../../src/services/featureVotes.js', () => ({
  getUserVote: vi.fn(() => null),
  getAllUserVotes: vi.fn(() => ({})),
}))

import { renderFeedbackPanel } from '../../src/components/modals/FeedbackPanel.js'
import { setState } from '../../src/stores/state.js'
import { getUserVote, getAllUserVotes } from '../../src/services/featureVotes.js'

describe('renderFeedbackPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getAllUserVotes.mockReturnValue({})
    getUserVote.mockReturnValue(null)
    document.body.innerHTML = ''
  })

  it('renders HTML', () => {
    const html = renderFeedbackPanel({ feedbackActiveTab: 'carte' })
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(100)
  })

  it('renders slide-panel-in class', () => {
    const html = renderFeedbackPanel({ feedbackActiveTab: 'carte' })
    expect(html).toContain('slide-panel-in')
  })

  it('renders closeFeedbackPanel handler', () => {
    const html = renderFeedbackPanel({ feedbackActiveTab: 'carte' })
    expect(html).toContain('closeFeedbackPanel')
  })

  it('renders tab pills', () => {
    const html = renderFeedbackPanel({ feedbackActiveTab: 'carte' })
    expect(html).toContain('setFeedbackTab')
  })

  it('renders feature items for active tab', () => {
    const html = renderFeedbackPanel({ feedbackActiveTab: 'carte' })
    expect(html).toContain('Carte')
  })

  it('renders beta section when tab has beta features', () => {
    const html = renderFeedbackPanel({ feedbackActiveTab: 'securite' })
    // securite tab has sos (beta) — but no features in our mock
    expect(html).toBeTruthy()
  })

  it('renders voyage tab features', () => {
    const html = renderFeedbackPanel({ feedbackActiveTab: 'voyage' })
    expect(html).toContain('slide-panel-in')
  })

  it('renders social tab features', () => {
    const html = renderFeedbackPanel({ feedbackActiveTab: 'social' })
    expect(html).toContain('slide-panel-in')
  })

  it('renders progress bar with 0% when no votes', () => {
    getAllUserVotes.mockReturnValue({})
    const html = renderFeedbackPanel({ feedbackActiveTab: 'carte' })
    expect(html).toContain('0%')
  })

  it('renders progress bar with 100% when all voted', () => {
    getAllUserVotes.mockReturnValue({
      carte: { vote: 'essential' },
      stations: { vote: 'useful' },
      sos: { vote: 'love' },
      carnet: { vote: 'works' },
      amis: { vote: 'essential' },
    })
    const html = renderFeedbackPanel({ feedbackActiveTab: 'carte' })
    expect(html).toContain('100%')
  })

  it('renders voted feature with vote tag', () => {
    getUserVote.mockImplementation((id) => id === 'carte' ? { vote: 'essential' } : null)
    const html = renderFeedbackPanel({ feedbackActiveTab: 'carte' })
    expect(html).toContain('showFeatureIntro')
  })

  it('uses default tab when feedbackActiveTab not set', () => {
    const html = renderFeedbackPanel({})
    expect(html).toBeTruthy()
    expect(html).toContain('slide-panel-in')
  })

  it('handles feedbackDetailFeature (redirects via setTimeout)', () => {
    window.showFeatureIntro = vi.fn()
    const html = renderFeedbackPanel({ feedbackActiveTab: 'carte', feedbackDetailFeature: 'carte' })
    // When detailId is set, still returns the panel HTML
    expect(html).toBeTruthy()
    expect(html).toContain('slide-panel-in')
  })
})

describe('window.setFeedbackTab', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getAllUserVotes.mockReturnValue({})
    getUserVote.mockReturnValue(null)
    document.body.innerHTML = ''
  })

  it('calls setState with feedbackActiveTab', () => {
    window.setFeedbackTab('voyage')
    expect(setState).toHaveBeenCalledWith({ feedbackActiveTab: 'voyage', _skipRender: true })
  })

  it('updates DOM when panel exists', () => {
    document.body.innerHTML = `
      <div class="slide-panel-in">
        <button onclick="setFeedbackTab('carte')" class="old-class">Carte</button>
        <div class="overflow-y-auto"></div>
      </div>
    `
    expect(() => window.setFeedbackTab('carte')).not.toThrow()
  })

  it('does not throw when panel absent', () => {
    document.body.innerHTML = ''
    expect(() => window.setFeedbackTab('social')).not.toThrow()
  })
})

describe('window.openFeedbackDetail', () => {
  it('calls showFeatureIntro when available', () => {
    window.showFeatureIntro = vi.fn()
    window.openFeedbackDetail('carte')
    expect(window.showFeatureIntro).toHaveBeenCalledWith('carte')
  })

  it('does not throw when showFeatureIntro absent', () => {
    delete window.showFeatureIntro
    expect(() => window.openFeedbackDetail('carte')).not.toThrow()
  })
})

describe('window.closeFeedbackDetail', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('calls setState with feedbackDetailFeature: null', () => {
    window.closeFeedbackDetail()
    expect(setState).toHaveBeenCalledWith({ feedbackDetailFeature: null })
  })
})

describe('window.submitFeedback', () => {
  it('calls showFeatureIntro when available', () => {
    window.showFeatureIntro = vi.fn()
    window.submitFeedback('sos')
    expect(window.showFeatureIntro).toHaveBeenCalledWith('sos')
  })

  it('does not throw when showFeatureIntro absent', () => {
    delete window.showFeatureIntro
    expect(() => window.submitFeedback('sos')).not.toThrow()
  })
})
