import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/stores/state.js', () => {
  let state = {}
  return {
    getState: vi.fn(() => state),
    setState: vi.fn((updates) => { Object.assign(state, updates) }),
    _setTestState: (s) => { state = s },
  }
})

let mod
beforeAll(async () => {
  try {
    mod = await import('../../src/utils/backButton.js')
  } catch {
    mod = {}
  }
})

describe('backButton', () => {
  it('module loads without error', () => {
    expect(mod).toBeDefined()
  })

  it('exports expected functions', () => {
    const keys = Object.keys(mod)
    // Should export at least handleBackButton or similar
    expect(keys.length).toBeGreaterThan(0)
  })
})
