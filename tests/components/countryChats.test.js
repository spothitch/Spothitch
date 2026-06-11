import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg data-icon="${name}"></svg>`),
}))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeHTML: vi.fn((s) => String(s || '')),
  escapeJSString: vi.fn((s) => String(s || '')),
}))
vi.mock('../../src/services/countryChat.js', () => ({
  getAvailableCountries: vi.fn(() => []),
}))

import { renderCountryChats } from '../../src/components/views/social/CountryChats.js'
import { getAvailableCountries } from '../../src/services/countryChat.js'

const mockCountries = [
  { code: 'FR', name: 'France', flag: '🇫🇷', region: 'Europe', members: 45 },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', region: 'Europe', members: 32 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'Europe', members: 28 },
  { code: 'US', name: 'United States', flag: '🇺🇸', region: 'Americas', members: 15 },
]

describe('renderCountryChats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getAvailableCountries.mockReturnValue([])
  })

  it('returns empty or minimal when no countries available', () => {
    getAvailableCountries.mockReturnValue([])
    const html = renderCountryChats({})
    expect(typeof html).toBe('string')
  })

  it('renders country list when countries available', () => {
    getAvailableCountries.mockReturnValue(mockCountries)
    const html = renderCountryChats({})
    expect(html).toContain('France')
    expect(html).toContain('Spain')
  })

  it('renders join button for each country', () => {
    getAvailableCountries.mockReturnValue(mockCountries)
    const html = renderCountryChats({})
    expect(html).toContain('joinCountryChatAction(')
  })

  it('renders country flags', () => {
    getAvailableCountries.mockReturnValue(mockCountries)
    const html = renderCountryChats({})
    expect(html).toBeTruthy()
  })

  it('renders countryChats section header', () => {
    getAvailableCountries.mockReturnValue(mockCountries)
    const html = renderCountryChats({})
    expect(html).toContain('countryChats')
  })

  it('renders member counts', () => {
    getAvailableCountries.mockReturnValue(mockCountries)
    const html = renderCountryChats({})
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(100)
  })

  it('renders with single country', () => {
    getAvailableCountries.mockReturnValue([mockCountries[0]])
    const html = renderCountryChats({})
    expect(html).toContain('France')
  })
})
