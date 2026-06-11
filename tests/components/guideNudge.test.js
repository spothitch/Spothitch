import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn(() => '<svg></svg>') }))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
}))

import { renderGuideNudge } from '../../src/components/modals/GuideNudge.js'
import { getState, setState } from '../../src/stores/state.js'

describe('renderGuideNudge', () => {
  it('returns empty string when showGuideNudge is false', () => {
    expect(renderGuideNudge({})).toBe('')
    expect(renderGuideNudge({ showGuideNudge: false })).toBe('')
  })

  it('returns empty string when no pendingGuideCountry', () => {
    expect(renderGuideNudge({ showGuideNudge: true })).toBe('')
  })

  it('renders nudge with country name', () => {
    const html = renderGuideNudge({
      showGuideNudge: true,
      pendingGuideCountry: { name: 'France', code: 'fr', flag: '🇫🇷' }
    })
    expect(html).toContain('France')
    expect(html.length).toBeGreaterThan(50)
  })

  it('renders nudge with fallback to country code', () => {
    const html = renderGuideNudge({
      showGuideNudge: true,
      pendingGuideCountry: { code: 'de' }
    })
    expect(html).toContain('de')
    expect(html.length).toBeGreaterThan(50)
  })

  it('renders action buttons', () => {
    const html = renderGuideNudge({
      showGuideNudge: true,
      pendingGuideCountry: { name: 'Spain', code: 'es', flag: '🇪🇸' }
    })
    expect(html).toContain('<button')
  })
})

describe('GuideNudge window handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getState.mockReturnValue({ pendingGuideCountry: { code: 'fr', name: 'France' } })
    localStorage.clear()
    window.changeTab = vi.fn()
  })

  it('closeGuideNudge calls setState with showGuideNudge: false', async () => {
    await window.closeGuideNudge()
    expect(setState).toHaveBeenCalledWith({ showGuideNudge: false })
  })

  it('dismissGuideNudgeForCountry saves code to localStorage', async () => {
    await window.dismissGuideNudgeForCountry('de')
    const stored = JSON.parse(localStorage.getItem('spothitch_guide_nudge_countries') || '[]')
    expect(stored).toContain('fr') // used getState().pendingGuideCountry.code
  })

  it('dismissGuideNudgeForCountry uses param when no state country', async () => {
    getState.mockReturnValue({ pendingGuideCountry: null })
    await window.dismissGuideNudgeForCountry('es')
    const stored = JSON.parse(localStorage.getItem('spothitch_guide_nudge_countries') || '[]')
    expect(stored).toContain('es')
  })

  it('dismissGuideNudgeForCountry calls setState to hide nudge', async () => {
    await window.dismissGuideNudgeForCountry('de')
    expect(setState).toHaveBeenCalledWith({ showGuideNudge: false, pendingGuideCountry: null })
  })

  it('dismissGuideNudgeGlobal sets localStorage flag', async () => {
    await window.dismissGuideNudgeGlobal()
    expect(localStorage.getItem('spothitch_guide_nudge_seen')).toBe('1')
  })

  it('dismissGuideNudgeGlobal calls setState to hide nudge', async () => {
    await window.dismissGuideNudgeGlobal()
    expect(setState).toHaveBeenCalledWith({ showGuideNudge: false, pendingGuideCountry: null })
  })

  it('acceptGuideNudge calls setState with voyage tab + guide section', async () => {
    getState.mockReturnValue({ pendingGuideCountry: { code: 'fr' } })
    await window.acceptGuideNudge()
    expect(setState).toHaveBeenCalledWith(expect.objectContaining({
      showGuideNudge: false,
      activeTab: 'voyage',
      guideSection: 'countries',
      selectedCountryGuide: 'fr',
    }))
  })

  it('acceptGuideNudge calls changeTab with voyage', async () => {
    getState.mockReturnValue({ pendingGuideCountry: null })
    await window.acceptGuideNudge()
    expect(window.changeTab).toHaveBeenCalledWith('voyage')
  })
})
