import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))

import { showLoading, hideLoading, isLoading, setLoadingMessage, setLoadingProgress } from '../../src/components/LoadingIndicator.js'

describe('LoadingIndicator', () => {
  it('showLoading sets loading state', () => {
    showLoading()
    expect(isLoading()).toBe(true)
    hideLoading()
  })

  it('hideLoading is a function', () => {
    expect(typeof hideLoading).toBe('function')
  })

  it('setLoadingMessage does not throw', () => {
    showLoading()
    expect(() => setLoadingMessage('Loading spots...')).not.toThrow()
    hideLoading()
  })

  it('setLoadingProgress does not throw', () => {
    showLoading({ mode: 'bar' })
    expect(() => setLoadingProgress(50)).not.toThrow()
    hideLoading()
  })

  it('showLoading with bar mode sets loading', () => {
    showLoading({ mode: 'bar', message: 'Downloading...' })
    expect(isLoading()).toBe(true)
    hideLoading()
  })
})
