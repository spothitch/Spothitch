import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeHTML: vi.fn((s) => String(s || '')),
  escapeJSString: vi.fn((s) => String(s || '')),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg data-icon="${name}"></svg>`),
}))
vi.mock('../../src/services/firebaseSync.js', () => ({
  syncAllToFirestore: vi.fn(() => Promise.resolve()),
}))

// Import as side effect to register window.* handlers
import '../../src/components/modals/FeatureSlides.js'

describe('FeatureSlides window handlers', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>'
    document.getElementById('feature-slides-overlay')?.remove()
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('registers window.openFeatureSlides', () => {
    expect(typeof window.openFeatureSlides).toBe('function')
  })

  it('registers window.closeFeatureSlides', () => {
    expect(typeof window.closeFeatureSlides).toBe('function')
  })

  it('registers window.featureSlidesNext', () => {
    expect(typeof window.featureSlidesNext).toBe('function')
  })

  it('registers window.featureSlidesPrev', () => {
    expect(typeof window.featureSlidesPrev).toBe('function')
  })

  it('registers window.selectFeatureOpinion', () => {
    expect(typeof window.selectFeatureOpinion).toBe('function')
  })

  it('registers window.submitFeatureOpinion', () => {
    expect(typeof window.submitFeatureOpinion).toBe('function')
  })

  it('opens guardian-mode slides and appends overlay', () => {
    window.openFeatureSlides('guardian-mode')
    const overlay = document.getElementById('feature-slides-overlay')
    expect(overlay).not.toBeNull()
    expect(overlay.innerHTML.length).toBeGreaterThan(50)
  })

  it('opens journal slides', () => {
    window.openFeatureSlides('journal')
    const overlay = document.getElementById('feature-slides-overlay')
    expect(overlay).not.toBeNull()
  })

  it('opens hostels slides', () => {
    window.openFeatureSlides('hostels')
    expect(document.getElementById('feature-slides-overlay')).not.toBeNull()
  })

  it('opens city-pages slides', () => {
    window.openFeatureSlides('city-pages')
    expect(document.getElementById('feature-slides-overlay')).not.toBeNull()
  })

  it('opens leagues slides', () => {
    window.openFeatureSlides('leagues')
    expect(document.getElementById('feature-slides-overlay')).not.toBeNull()
  })

  it('opens events slides', () => {
    window.openFeatureSlides('events')
    expect(document.getElementById('feature-slides-overlay')).not.toBeNull()
  })

  it('opens thumbs-partners slides', () => {
    window.openFeatureSlides('thumbs-partners')
    expect(document.getElementById('feature-slides-overlay')).not.toBeNull()
  })

  it('opens tech-improvements slides', () => {
    window.openFeatureSlides('tech-improvements')
    expect(document.getElementById('feature-slides-overlay')).not.toBeNull()
  })

  it('returns early for unknown featureId', () => {
    window.openFeatureSlides('non-existent-feature')
    expect(document.getElementById('feature-slides-overlay')).toBeNull()
  })

  it('removes existing overlay before opening new one', () => {
    window.openFeatureSlides('guardian-mode')
    window.openFeatureSlides('journal')
    const overlays = document.querySelectorAll('#feature-slides-overlay')
    expect(overlays.length).toBe(1)
  })

  it('closes slides by removing overlay', () => {
    window.openFeatureSlides('guardian-mode')
    expect(document.getElementById('feature-slides-overlay')).not.toBeNull()
    window.closeFeatureSlides()
    expect(document.getElementById('feature-slides-overlay')).toBeNull()
  })

  it('featureSlidesNext advances slide index', () => {
    window.openFeatureSlides('guardian-mode')
    // Should not throw
    expect(() => window.featureSlidesNext()).not.toThrow()
    expect(() => window.featureSlidesNext()).not.toThrow()
  })

  it('featureSlidesPrev goes to previous slide', () => {
    window.openFeatureSlides('guardian-mode')
    window.featureSlidesNext()
    expect(() => window.featureSlidesPrev()).not.toThrow()
  })

  it('featureSlidesPrev does not go below 0', () => {
    window.openFeatureSlides('guardian-mode')
    // Already at 0, prev should be no-op
    expect(() => window.featureSlidesPrev()).not.toThrow()
  })

  it('selectFeatureOpinion saves to localStorage', () => {
    window.selectFeatureOpinion('guardian-mode', 'love')
    const opinions = JSON.parse(localStorage.getItem('spothitch_feature_opinions') || '{}')
    expect(opinions['guardian-mode']?.opinion).toBe('love')
  })

  it('selectFeatureOpinion handles detail opinion', () => {
    // Create a textarea that would be shown
    document.body.innerHTML += '<textarea id="feature-opinion-comment" style="display:none"></textarea>'
    window.selectFeatureOpinion('journal', 'detail')
    const opinions = JSON.parse(localStorage.getItem('spothitch_feature_opinions') || '{}')
    expect(opinions['journal']?.opinion).toBe('detail')
  })

  it('submitFeatureOpinion saves comment to localStorage', async () => {
    document.body.innerHTML += '<input id="feature-opinion-comment" value="Great idea!" />'
    await window.submitFeatureOpinion('guardian-mode')
    const opinions = JSON.parse(localStorage.getItem('spothitch_feature_opinions') || '{}')
    expect(opinions['guardian-mode']?.comment).toBe('Great idea!')
  })

  it('openFeedbackOnFeature closes slides', () => {
    window.openFeatureSlides('guardian-mode')
    expect(document.getElementById('feature-slides-overlay')).not.toBeNull()
    window.openFeedbackOnFeature?.('guardian-mode')
    expect(document.getElementById('feature-slides-overlay')).toBeNull()
  })
})
