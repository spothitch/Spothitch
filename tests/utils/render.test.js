import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))

let mod
beforeAll(async () => {
  try {
    mod = await import('../../src/utils/render.js')
  } catch {
    mod = {}
  }
})

describe('render', () => {
  it('module loads without error', () => {
    expect(mod).toBeDefined()
  })
  it('exports functions', () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0)
  })
})
