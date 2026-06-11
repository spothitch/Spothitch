import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn(() => '<svg></svg>') }))
vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((k) => k),
  getAvailableLanguages: vi.fn(() => [
    { code: 'fr', name: 'Français', nativeName: 'Français' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Español', nativeName: 'Español' },
    { code: 'de', name: 'Deutsch', nativeName: 'Deutsch' },
  ]),
  setLanguage: vi.fn(),
  detectLanguage: vi.fn(() => 'fr'),
  markLanguageSelected: vi.fn(),
}))
vi.mock('../../src/stores/state.js', () => ({ setState: vi.fn() }))

import { renderLanguageSelector } from '../../src/components/modals/LanguageSelector.js'

describe('renderLanguageSelector', () => {
  it('renders language selector HTML', () => {
    const html = renderLanguageSelector({})
    expect(html).toContain('class=')
    expect(html.length).toBeGreaterThan(100)
  })

  it('renders with null state', () => {
    const html = renderLanguageSelector(null)
    expect(html).toBeTruthy()
  })

  it('contains language option buttons', () => {
    const html = renderLanguageSelector({})
    expect(html).toContain('<button')
  })

  it('renders all 4 language options', () => {
    const html = renderLanguageSelector({})
    expect(html).toContain("data-lang=\"fr\"")
    expect(html).toContain("data-lang=\"en\"")
    expect(html).toContain("data-lang=\"es\"")
    expect(html).toContain("data-lang=\"de\"")
  })

  it('marks detected language as selected (aria-checked=true)', () => {
    const html = renderLanguageSelector({})
    // fr is detected, so it should have aria-checked="true"
    expect(html).toContain('aria-checked="true"')
  })

  it('marks non-detected languages as unselected', () => {
    const html = renderLanguageSelector({})
    // Other languages get aria-checked="false"
    const falseCount = (html.match(/aria-checked="false"/g) || []).length
    expect(falseCount).toBeGreaterThanOrEqual(3)
  })

  it('highlights detected language with border style', () => {
    const html = renderLanguageSelector({})
    expect(html).toContain('border-primary-500')
  })

  it('includes selectLanguageOption onclick handlers', () => {
    const html = renderLanguageSelector({})
    expect(html).toContain("selectLanguageOption('fr')")
    expect(html).toContain("selectLanguageOption('en')")
  })

  it('includes confirm button', () => {
    const html = renderLanguageSelector({})
    expect(html).toContain('confirmLanguage')
  })

  it('includes role=radiogroup for accessibility', () => {
    const html = renderLanguageSelector({})
    expect(html).toContain('role="radiogroup"')
  })
})

describe('window.selectLanguageOption', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button class="language-option border-white/10 bg-white/5" data-lang="fr" aria-checked="true"></button>
      <button class="language-option border-white/10 bg-white/5" data-lang="en" aria-checked="false"></button>
      <button class="language-option border-white/10 bg-white/5" data-lang="es" aria-checked="false"></button>
      <span class="confirm-text">Continue</span>
    `
  })

  it('sets window.selectedLanguageCode', () => {
    window.selectLanguageOption('en')
    expect(window.selectedLanguageCode).toBe('en')
  })

  it('sets aria-checked=true on selected language', () => {
    window.selectLanguageOption('en')
    const enBtn = document.querySelector('[data-lang="en"]')
    expect(enBtn.getAttribute('aria-checked')).toBe('true')
  })

  it('sets aria-checked=false on non-selected languages', () => {
    window.selectLanguageOption('en')
    const frBtn = document.querySelector('[data-lang="fr"]')
    expect(frBtn.getAttribute('aria-checked')).toBe('false')
  })

  it('adds border-primary-500 to selected button', () => {
    window.selectLanguageOption('es')
    const esBtn = document.querySelector('[data-lang="es"]')
    expect(esBtn.classList.contains('border-primary-500')).toBe(true)
  })

  it('removes border-primary-500 from deselected buttons', () => {
    // First select fr so it gets border-primary-500
    window.selectLanguageOption('fr')
    // Then switch to en
    window.selectLanguageOption('en')
    const frBtn = document.querySelector('[data-lang="fr"]')
    expect(frBtn.classList.contains('border-primary-500')).toBe(false)
  })

  it('updates .confirm-text content for fr', () => {
    window.selectLanguageOption('fr')
    expect(document.querySelector('.confirm-text').textContent).toBe('Continuer')
  })

  it('updates .confirm-text content for de', () => {
    window.selectLanguageOption('de')
    expect(document.querySelector('.confirm-text').textContent).toBe('Weiter')
  })

  it('does not throw when .confirm-text is absent', () => {
    document.body.innerHTML = `<button class="language-option" data-lang="en" aria-checked="false"></button>`
    expect(() => window.selectLanguageOption('en')).not.toThrow()
  })
})

describe('window.confirmLanguageSelection', () => {
  beforeEach(() => {
    localStorage.clear()
    window.selectedLanguageCode = 'fr'
  })

  it('does not throw', async () => {
    await expect(window.confirmLanguageSelection()).resolves.not.toThrow()
  })

  it('writes lang to localStorage spothitch_v4_state', async () => {
    window.selectedLanguageCode = 'de'
    await window.confirmLanguageSelection()
    const stored = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
    expect(stored.lang).toBe('de')
  })

  it('writes showLanguageSelector=false to localStorage', async () => {
    await window.confirmLanguageSelection()
    const stored = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
    expect(stored.showLanguageSelector).toBe(false)
  })

  it('falls back to en when selectedLanguageCode is not set', async () => {
    delete window.selectedLanguageCode
    await window.confirmLanguageSelection()
    const stored = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
    expect(stored.lang).toBe('en')
  })
})
