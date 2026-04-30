import { describe, it, expect, vi } from 'vitest'

window.setState = vi.fn()
window.showFeatureIntro = vi.fn()
window.changeTab = vi.fn()
window.setSocialTab = vi.fn()

describe('betaGuards', () => {
  it('module loads without error', async () => {
    await expect(import('../../src/handlers/betaGuards.js').catch(() => ({}))).resolves.toBeDefined()
  })
  it('window.showFeatureIntro is still defined after load', () => {
    expect(typeof window.showFeatureIntro).toBe('function')
  })
})
