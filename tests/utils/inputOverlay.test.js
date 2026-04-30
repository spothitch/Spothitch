import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))
vi.mock('../../src/utils/sanitize.js', () => ({ escapeHTML: vi.fn((s) => s || '') }))

import { showInputOverlay } from '../../src/utils/inputOverlay.js'

describe('inputOverlay', () => {
  it('showInputOverlay is a function', () => {
    expect(typeof showInputOverlay).toBe('function')
  })
  it('showInputOverlay creates DOM overlay', () => {
    showInputOverlay({ title: 'Test', placeholder: 'Enter text' })
    const overlay = document.getElementById('spothitch-input-overlay')
    expect(overlay).toBeTruthy()
    overlay?.remove()
  })
  it('showInputOverlay returns a promise', () => {
    const result = showInputOverlay({ title: 'Test' })
    expect(result).toBeInstanceOf(Promise)
    document.getElementById('spothitch-input-overlay')?.remove()
  })
})
