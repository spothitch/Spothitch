import { describe, it, expect } from 'vitest'

describe('Confetti Utils', () => {
  it('imports without error', async () => {
    const mod = await import('../../src/utils/confetti.js')
    expect(mod).toBeDefined()
  })

  it('has launchConfetti function', async () => {
    const mod = await import('../../src/utils/confetti.js')
    expect(typeof mod.launchConfetti).toBe('function')
  })

  it('launchConfetti does not throw', async () => {
    const { launchConfetti } = await import('../../src/utils/confetti.js')
    expect(() => launchConfetti()).not.toThrow()
  })
})
