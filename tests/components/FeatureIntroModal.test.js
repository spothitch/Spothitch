import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))
vi.mock('../../src/services/featureIntro.js', () => ({
  isFeatureSeen: vi.fn(() => false),
  markFeatureSeen: vi.fn(),
}))

await import('../../src/components/modals/FeatureIntroModal.js')

describe('FeatureIntroModal', () => {
  it('showFeatureIntro is registered on window', () => {
    expect(typeof window.showFeatureIntro).toBe('function')
  })
  it('closeFeatureIntro is registered on window', () => {
    expect(typeof window.closeFeatureIntro).toBe('function')
  })
  it('featureIntroCTA is registered on window', () => {
    expect(typeof window.featureIntroCTA).toBe('function')
  })
  it('submitIntroVote is registered on window', () => {
    expect(typeof window.submitIntroVote).toBe('function')
  })
  it('selectIntroVote is registered on window', () => {
    expect(typeof window.selectIntroVote).toBe('function')
  })
})
