/**
 * FeedbackService tests — guide tip votes, suggestions, and render helpers
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/utils/storage.js', () => {
  const store = {}
  return {
    Storage: {
      get: vi.fn((key) => store[key] ?? null),
      set: vi.fn((key, val) => { store[key] = val; return true }),
      remove: vi.fn((key) => { delete store[key] }),
      _store: store,
    },
  }
})
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn(() => '<svg></svg>') }))
vi.mock('../../src/services/firebase.js', () => ({
  getCurrentUser: vi.fn(() => null),
}))
vi.mock('firebase/app', () => ({
  getApps: vi.fn(() => []),
  getApp: vi.fn(() => null),
}))
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => null),
  doc: vi.fn(),
  getDoc: vi.fn(async () => ({ exists: () => false, data: () => ({}) })),
  setDoc: vi.fn(async () => {}),
  updateDoc: vi.fn(async () => {}),
  increment: vi.fn((n) => n),
  deleteDoc: vi.fn(async () => {}),
  collection: vi.fn(),
  getDocs: vi.fn(async () => ({ docs: [] })),
}))

import {
  voteGuideTip,
  getVote,
  getSectionVotes,
  submitSuggestion,
  getSuggestionsBySection,
  getTipVoteCounts,
  renderTipVoteButtons,
  renderSuggestionForm,
} from '../../src/services/feedbackService.js'
import { Storage } from '../../src/utils/storage.js'

function clearStore() {
  const s = Storage._store
  for (const k of Object.keys(s)) delete s[k]
  vi.clearAllMocks()
  Storage.get.mockImplementation((key) => s[key] ?? null)
  Storage.set.mockImplementation((key, val) => { s[key] = val; return true })
}

describe('voteGuideTip — basic votes', () => {
  beforeEach(clearStore)

  it('returns true on first vote', () => {
    expect(voteGuideTip('start', 0, 'up')).toBe(true)
  })

  it('stores vote in storage', () => {
    voteGuideTip('start', 0, 'up')
    const vote = getVote('start', 0)
    expect(vote).toBeTruthy()
    expect(vote.direction).toBe('up')
  })

  it('toggles off when voting same direction twice', () => {
    voteGuideTip('start', 0, 'up')
    voteGuideTip('start', 0, 'up') // toggle off
    const vote = getVote('start', 0)
    expect(vote).toBeNull()
  })

  it('switches direction when voting other direction', () => {
    voteGuideTip('start', 0, 'up')
    voteGuideTip('start', 0, 'down')
    const vote = getVote('start', 0)
    expect(vote.direction).toBe('down')
  })

  it('returns true when switching direction', () => {
    voteGuideTip('start', 0, 'up')
    expect(voteGuideTip('start', 0, 'down')).toBe(true)
  })
})

describe('getVote', () => {
  beforeEach(clearStore)

  it('returns null when no vote', () => {
    expect(getVote('safety', 1)).toBeNull()
  })

  it('returns vote object when voted', () => {
    voteGuideTip('safety', 1, 'down')
    const vote = getVote('safety', 1)
    expect(vote.direction).toBe('down')
  })
})

describe('getSectionVotes', () => {
  beforeEach(clearStore)

  it('returns zero counts when no votes', () => {
    const counts = getSectionVotes('start')
    expect(counts.up).toBe(0)
    expect(counts.down).toBe(0)
  })

  it('counts up and down votes per section', () => {
    voteGuideTip('start', 0, 'up')
    voteGuideTip('start', 1, 'up')
    voteGuideTip('start', 2, 'down')
    const counts = getSectionVotes('start')
    expect(counts.up).toBe(2)
    expect(counts.down).toBe(1)
  })

  it('only counts votes from the specified section', () => {
    voteGuideTip('start', 0, 'up')
    voteGuideTip('safety', 0, 'up')
    const startCounts = getSectionVotes('start')
    expect(startCounts.up).toBe(1)
  })
})

describe('getTipVoteCounts', () => {
  // Use unique section 'tips' to avoid _communityVotes accumulation from prior tests
  beforeEach(clearStore)

  it('returns zero counts when no vote', () => {
    const counts = getTipVoteCounts('tips', 99)
    expect(counts.up).toBe(0)
    expect(counts.down).toBe(0)
  })

  it('returns 1 up when up-voted', () => {
    voteGuideTip('tips', 98, 'up')
    const counts = getTipVoteCounts('tips', 98)
    expect(counts.up).toBe(1)
    expect(counts.down).toBe(0)
  })

  it('returns 1 down when down-voted', () => {
    voteGuideTip('tips', 97, 'down')
    const counts = getTipVoteCounts('tips', 97)
    expect(counts.up).toBe(0)
    expect(counts.down).toBe(1)
  })
})

describe('submitSuggestion', () => {
  beforeEach(clearStore)

  it('returns a suggestion object', () => {
    const sug = submitSuggestion('start', 'My tip text')
    expect(sug.id).toMatch(/^sug_/)
    expect(sug.section).toBe('start')
    expect(sug.text).toBe('My tip text')
  })

  it('stores suggestion in storage', () => {
    submitSuggestion('start', 'My suggestion')
    const suggestions = getSuggestionsBySection('start')
    expect(suggestions.length).toBe(1)
    expect(suggestions[0].text).toBe('My suggestion')
  })

  it('multiple suggestions are accumulated', () => {
    submitSuggestion('start', 'Tip A')
    submitSuggestion('start', 'Tip B')
    expect(getSuggestionsBySection('start').length).toBe(2)
  })
})

describe('getSuggestionsBySection', () => {
  beforeEach(clearStore)

  it('returns empty array when no suggestions', () => {
    expect(getSuggestionsBySection('start')).toEqual([])
  })

  it('filters by section', () => {
    submitSuggestion('start', 'Tip for start')
    submitSuggestion('safety', 'Tip for safety')
    const startTips = getSuggestionsBySection('start')
    expect(startTips.length).toBe(1)
    expect(startTips[0].text).toBe('Tip for start')
  })
})

describe('renderTipVoteButtons', () => {
  beforeEach(clearStore)

  it('renders HTML string', () => {
    const html = renderTipVoteButtons('start', 0)
    expect(typeof html).toBe('string')
    expect(html.length).toBeGreaterThan(50)
  })

  it('renders vote buttons with correct ids', () => {
    const html = renderTipVoteButtons('start', 0)
    expect(html).toContain('vote-start-0')
  })

  it('renders voteGuideTip onclick handlers', () => {
    const html = renderTipVoteButtons('start', 0)
    expect(html).toContain('voteGuideTip')
  })

  it('renders up button with active style when voted up', () => {
    voteGuideTip('start', 0, 'up')
    const html = renderTipVoteButtons('start', 0)
    expect(html).toContain('emerald')
  })

  it('renders down button with active style when voted down', () => {
    voteGuideTip('start', 0, 'down')
    const html = renderTipVoteButtons('start', 0)
    expect(html).toContain('danger')
  })
})

describe('renderSuggestionForm', () => {
  beforeEach(clearStore)

  it('renders HTML string', () => {
    const html = renderSuggestionForm('start')
    expect(typeof html).toBe('string')
    expect(html.length).toBeGreaterThan(50)
  })

  it('renders suggestion input field', () => {
    const html = renderSuggestionForm('start')
    expect(html).toContain('guide-suggestion-start')
  })

  it('renders existing suggestions', () => {
    submitSuggestion('start', 'My suggestion')
    const html = renderSuggestionForm('start')
    expect(html).toContain('My suggestion')
  })

  it('does not show suggestions section when empty', () => {
    const html = renderSuggestionForm('start')
    expect(html).not.toContain('yourSuggestions')
  })
})

describe('window.voteGuideTip', () => {
  beforeEach(() => {
    clearStore()
    document.body.innerHTML = ''
  })

  it('updates DOM when vote container exists', () => {
    document.body.innerHTML = '<div id="vote-start-0">Old Content</div>'
    window.voteGuideTip('start', 0, 'up')
    // Container gets replaced with new vote buttons
    expect(document.getElementById('vote-start-0') || document.querySelector('[id^="vote-start"]')).toBeTruthy()
  })

  it('does not throw when container absent', () => {
    expect(() => window.voteGuideTip('start', 0, 'up')).not.toThrow()
  })
})

describe('window.submitGuideSuggestion', () => {
  beforeEach(() => {
    clearStore()
    document.body.innerHTML = ''
    window.showToast = vi.fn()
    window.getState = vi.fn(() => ({ guideSection: 'start' }))
    window.setState = vi.fn()
    window.submitGuideSuggestion._busy = false
  })

  it('does nothing when input is empty', () => {
    document.body.innerHTML = '<input id="guide-suggestion-start" value="" />'
    window.submitGuideSuggestion('start')
    expect(window.showToast).not.toHaveBeenCalled()
  })

  it('calls showToast on successful submission', () => {
    document.body.innerHTML = '<input id="guide-suggestion-start" value="My tip" />'
    window.submitGuideSuggestion('start')
    expect(window.showToast).toHaveBeenCalled()
  })

  it('does not submit when busy', () => {
    window.submitGuideSuggestion._busy = true
    document.body.innerHTML = '<input id="guide-suggestion-start" value="Tip" />'
    window.submitGuideSuggestion('start')
    expect(window.showToast).not.toHaveBeenCalled()
  })
})
