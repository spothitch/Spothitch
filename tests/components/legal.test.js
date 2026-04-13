import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn(k => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn(() => '<svg></svg>') }))

describe('Legal Component', () => {
  it('module imports without error', async () => {
    const mod = await import('../../src/components/views/Legal.js')
    expect(mod).toBeDefined()
  })

  it('renderLegalPage returns HTML string', async () => {
    const { renderLegalPage } = await import('../../src/components/views/Legal.js')
    const html = renderLegalPage('privacy')
    expect(typeof html).toBe('string')
    expect(html.length).toBeGreaterThan(100)
  })

  it('renderLegalPage handles terms', async () => {
    const { renderLegalPage } = await import('../../src/components/views/Legal.js')
    const html = renderLegalPage('terms')
    expect(typeof html).toBe('string')
    expect(html.length).toBeGreaterThan(100)
  })

  it('renderLegalPage handles cookies', async () => {
    const { renderLegalPage } = await import('../../src/components/views/Legal.js')
    const html = renderLegalPage('cookies')
    expect(typeof html).toBe('string')
  })
})
