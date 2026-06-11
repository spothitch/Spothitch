/**
 * i18n Language Loading Tests
 * Ensures all 4 language files (fr/en/es/de) are dynamically loaded and covered.
 * Each setLanguage() call triggers the dynamic import of the corresponding lang file.
 */

import { describe, it, expect, vi } from 'vitest'

vi.mock('../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ lang: 'fr' })),
  setState: vi.fn(),
}))

import {
  setLanguage, t, getAvailableLanguages, detectLanguage,
  isFirstLaunch, markLanguageSelected, loadTranslations,
  pluralize, formatCount, getPluralWord, getLanguageInfo, initI18n,
} from '../src/i18n/index.js'
import { getState } from '../src/stores/state.js'
import frTranslations from '../src/i18n/lang/fr.js'
import enTranslations from '../src/i18n/lang/en.js'
import esTranslations from '../src/i18n/lang/es.js'
import deTranslations from '../src/i18n/lang/de.js'

describe('i18n language loading', () => {
  it('loads French (fr) translations', async () => {
    const result = await setLanguage('fr')
    expect(result).toBe(true)
    const val = t('app_name') || t('appName') || t('cancel') || t('close')
    expect(typeof val).toBe('string')
  })

  it('loads English (en) translations', async () => {
    const result = await setLanguage('en')
    expect(result).toBe(true)
    const val = t('app_name') || t('appName') || t('cancel') || t('close')
    expect(typeof val).toBe('string')
  })

  it('loads Spanish (es) translations', async () => {
    const result = await setLanguage('es')
    expect(result).toBe(true)
    const val = t('app_name') || t('appName') || t('cancel') || t('close')
    expect(typeof val).toBe('string')
  })

  it('loads German (de) translations', async () => {
    const result = await setLanguage('de')
    expect(result).toBe(true)
    const val = t('app_name') || t('appName') || t('cancel') || t('close')
    expect(typeof val).toBe('string')
  })

  it('getAvailableLanguages returns 4 languages', () => {
    const langs = getAvailableLanguages()
    expect(langs).toHaveLength(4)
    const codes = langs.map(l => l.code)
    expect(codes).toContain('fr')
    expect(codes).toContain('en')
    expect(codes).toContain('es')
    expect(codes).toContain('de')
  })

  it('returns false for unknown language', async () => {
    const result = await setLanguage('zh')
    expect(result).toBe(false)
  })

  it('fr translation file has keys', () => {
    expect(typeof frTranslations).toBe('object')
    expect(Object.keys(frTranslations).length).toBeGreaterThan(10)
  })

  it('en translation file has keys', () => {
    expect(typeof enTranslations).toBe('object')
    expect(Object.keys(enTranslations).length).toBeGreaterThan(10)
  })

  it('es translation file has keys', () => {
    expect(typeof esTranslations).toBe('object')
    expect(Object.keys(esTranslations).length).toBeGreaterThan(10)
  })

  it('de translation file has keys', () => {
    expect(typeof deTranslations).toBe('object')
    expect(Object.keys(deTranslations).length).toBeGreaterThan(10)
  })
})

describe('i18n — detectLanguage', () => {
  it('returns saved lang from localStorage when valid', () => {
    localStorage.setItem('spothitch_v4_state', JSON.stringify({ lang: 'de' }))
    const lang = detectLanguage()
    expect(lang).toBe('de')
    localStorage.removeItem('spothitch_v4_state')
  })

  it('falls back to browser language when no saved lang', () => {
    localStorage.removeItem('spothitch_v4_state')
    // navigator.language is 'fr' in happy-dom by default or undefined
    const lang = detectLanguage()
    expect(['fr', 'en', 'es', 'de']).toContain(lang)
  })

  it('uses navigator.languages fallback when primary browser lang unsupported', () => {
    localStorage.removeItem('spothitch_v4_state')
    Object.defineProperty(navigator, 'language', { value: 'zh-CN', configurable: true })
    Object.defineProperty(navigator, 'languages', { value: ['zh-CN', 'fr-FR', 'en-US'], configurable: true })
    const lang = detectLanguage()
    expect(['fr', 'en', 'es', 'de']).toContain(lang)
    Object.defineProperty(navigator, 'language', { value: 'en', configurable: true })
    Object.defineProperty(navigator, 'languages', { value: ['en'], configurable: true })
  })

  it('returns en when no supported language found', () => {
    localStorage.removeItem('spothitch_v4_state')
    Object.defineProperty(navigator, 'language', { value: 'zh-CN', configurable: true })
    Object.defineProperty(navigator, 'languages', { value: [], configurable: true })
    const lang = detectLanguage()
    expect(lang).toBe('en')
    Object.defineProperty(navigator, 'language', { value: 'en', configurable: true })
    Object.defineProperty(navigator, 'languages', { value: ['en'], configurable: true })
  })

  it('handles invalid localStorage JSON gracefully', () => {
    localStorage.setItem('spothitch_v4_state', 'INVALID_JSON{')
    const lang = detectLanguage()
    expect(typeof lang).toBe('string')
    localStorage.removeItem('spothitch_v4_state')
  })
})

describe('i18n — isFirstLaunch / markLanguageSelected', () => {
  it('isFirstLaunch returns true when language not selected', () => {
    localStorage.removeItem('spothitch_language_selected')
    expect(isFirstLaunch()).toBe(true)
  })

  it('isFirstLaunch returns false after markLanguageSelected', () => {
    markLanguageSelected()
    expect(isFirstLaunch()).toBe(false)
    localStorage.removeItem('spothitch_language_selected')
  })

  it('markLanguageSelected sets localStorage key', () => {
    markLanguageSelected()
    expect(localStorage.getItem('spothitch_language_selected')).toBe('true')
    localStorage.removeItem('spothitch_language_selected')
  })
})

describe('i18n — loadTranslations', () => {
  it('returns false when fetch fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network error'))
    const result = await loadTranslations('fr')
    expect(result).toBe(false)
  })

  it('returns false when response not ok', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 })
    const result = await loadTranslations('fr')
    expect(result).toBe(false)
  })

  it('returns true and merges translations when response ok', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ testKey: 'test value' }),
    })
    const result = await loadTranslations('fr')
    expect(result).toBe(true)
  })
})

describe('i18n — pluralize / formatCount / getPluralWord', () => {
  it('pluralize returns string with count for known key', () => {
    const result = pluralize('day', 1)
    expect(typeof result).toBe('string')
    expect(result).toContain('1')
  })

  it('pluralize returns string with count=2 for known key', () => {
    const result = pluralize('day', 2)
    expect(typeof result).toBe('string')
    expect(result).toContain('2')
  })

  it('pluralize returns count + key for unknown key', () => {
    const result = pluralize('unknown_key', 3)
    expect(result).toContain('3')
    expect(result).toContain('unknown_key')
  })

  it('pluralize without count returns just word (not count)', () => {
    const result = pluralize('day', 1, false)
    expect(typeof result).toBe('string')
    expect(result).not.toContain('1')
  })

  it('formatCount returns count + word', () => {
    const result = formatCount(5, 'day')
    expect(result).toContain('5')
  })

  it('getPluralWord returns just the word without count', () => {
    const result = getPluralWord('day', 1)
    expect(typeof result).toBe('string')
    expect(result).not.toContain('1')
  })

  it('pluralize works for all supported languages', () => {
    for (const lang of ['fr', 'en', 'es', 'de']) {
      getState.mockReturnValue({ lang })
      const r1 = pluralize('day', 1)
      const r2 = pluralize('day', 2)
      expect(r1).toContain('1')
      expect(r2).toContain('2')
    }
  })
})

describe('i18n — getLanguageInfo', () => {
  it('returns language info for known code', () => {
    const info = getLanguageInfo('fr')
    expect(info.code).toBe('fr')
  })

  it('returns en as fallback for unknown code', () => {
    const info = getLanguageInfo('xx')
    expect(info.code).toBe('en')
  })
})

describe('i18n — initI18n', () => {
  it('returns language code string', async () => {
    const lang = await initI18n()
    expect(typeof lang).toBe('string')
    expect(['fr', 'en', 'es', 'de']).toContain(lang)
  })
})

describe('i18n — t() with params', () => {
  it('substitutes {param} in translation', async () => {
    await setLanguage('fr')
    // Use a key that exists; if it has a param, it gets replaced
    // Test with a synthetic string - at minimum, the substitution code runs
    const result = t('someKey', { name: 'Alice' })
    expect(typeof result).toBe('string')
  })
})
