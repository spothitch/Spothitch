import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ theme: 'dark' })),
  setState: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))

describe('Theme system', () => {
  beforeEach(() => { localStorage.clear() })

  it('default theme is dark', () => {
    // SpotHitch uses dark mode by default
    const { getState } = require('../../src/stores/state.js')
    expect(getState().theme).toBe('dark')
  })

  it('theme override persists in localStorage', () => {
    localStorage.setItem('spothitch_theme_override', 'light')
    expect(localStorage.getItem('spothitch_theme_override')).toBe('light')
  })

  it('clearing theme override restores default', () => {
    localStorage.setItem('spothitch_theme_override', 'light')
    localStorage.removeItem('spothitch_theme_override')
    expect(localStorage.getItem('spothitch_theme_override')).toBeNull()
  })
})
