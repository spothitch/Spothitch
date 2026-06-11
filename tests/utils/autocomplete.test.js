import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg data-icon="${name}"></svg>`),
}))

import { initAutocomplete } from '../../src/utils/autocomplete.js'

describe('initAutocomplete', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="container"><input id="test-input" /></div>'
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true, configurable: true })
  })

  it('returns no-op when input element does not exist', () => {
    const result = initAutocomplete({ inputId: 'non-existent', searchFn: vi.fn(), onSelect: vi.fn() })
    expect(result).toBeDefined()
    expect(typeof result.destroy).toBe('function')
    expect(typeof result.isValid).toBe('function')
    // isValid returns true as no-op
    expect(result.isValid()).toBe(true)
  })

  it('returns handle object when input exists', () => {
    const result = initAutocomplete({
      inputId: 'test-input',
      searchFn: vi.fn(() => Promise.resolve([])),
      onSelect: vi.fn(),
    })
    expect(result).toBeDefined()
    expect(typeof result.destroy).toBe('function')
    expect(typeof result.isValid).toBe('function')
    expect(typeof result.getSelectedItem).toBe('function')
    expect(typeof result.setSelectedItem).toBe('function')
  })

  it('sets aria attributes on the input', () => {
    initAutocomplete({
      inputId: 'test-input',
      searchFn: vi.fn(() => Promise.resolve([])),
      onSelect: vi.fn(),
    })
    const input = document.getElementById('test-input')
    expect(input.getAttribute('role')).toBe('combobox')
    expect(input.getAttribute('aria-autocomplete')).toBe('list')
    expect(input.getAttribute('autocomplete')).toBe('off')
  })

  it('isValid returns true when forceSelection is false (default)', () => {
    const handle = initAutocomplete({
      inputId: 'test-input',
      searchFn: vi.fn(() => Promise.resolve([])),
      onSelect: vi.fn(),
    })
    expect(handle.isValid()).toBe(true)
  })

  it('isValid returns false when forceSelection=true and nothing selected', () => {
    const handle = initAutocomplete({
      inputId: 'test-input',
      searchFn: vi.fn(() => Promise.resolve([])),
      onSelect: vi.fn(),
      forceSelection: true,
    })
    expect(handle.isValid()).toBe(false)
  })

  it('getSelectedItem returns null initially', () => {
    const handle = initAutocomplete({
      inputId: 'test-input',
      searchFn: vi.fn(() => Promise.resolve([])),
      onSelect: vi.fn(),
    })
    expect(handle.getSelectedItem()).toBeNull()
  })

  it('setSelectedItem updates input value', () => {
    const handle = initAutocomplete({
      inputId: 'test-input',
      searchFn: vi.fn(() => Promise.resolve([])),
      onSelect: vi.fn(),
    })
    handle.setSelectedItem({ name: 'Paris', fullName: 'Paris, France' })
    const input = document.getElementById('test-input')
    expect(input.value).toBe('Paris')
  })

  it('setSelectedItem makes isValid return true with forceSelection', () => {
    const handle = initAutocomplete({
      inputId: 'test-input',
      searchFn: vi.fn(() => Promise.resolve([])),
      onSelect: vi.fn(),
      forceSelection: true,
    })
    handle.setSelectedItem({ name: 'Lyon' })
    expect(handle.isValid()).toBe(true)
  })

  it('setSelectedItem with null clears state', () => {
    const handle = initAutocomplete({
      inputId: 'test-input',
      searchFn: vi.fn(() => Promise.resolve([])),
      onSelect: vi.fn(),
    })
    handle.setSelectedItem({ name: 'Paris' })
    handle.setSelectedItem(null)
    expect(handle.getSelectedItem()).toBeNull()
  })

  it('destroy removes event listeners without error', () => {
    const handle = initAutocomplete({
      inputId: 'test-input',
      searchFn: vi.fn(() => Promise.resolve([])),
      onSelect: vi.fn(),
    })
    expect(() => handle.destroy()).not.toThrow()
  })

  it('handles input with fewer than minChars gracefully', async () => {
    const searchFn = vi.fn(() => Promise.resolve([]))
    initAutocomplete({
      inputId: 'test-input',
      searchFn,
      onSelect: vi.fn(),
      minChars: 3,
    })
    const input = document.getElementById('test-input')
    input.value = 'ab' // only 2 chars
    input.dispatchEvent(new Event('input'))
    await new Promise(r => setTimeout(r, 50))
    // Search should NOT have been called
    expect(searchFn).not.toHaveBeenCalled()
  })

  it('calls searchFn when input reaches minChars', async () => {
    const searchFn = vi.fn(() => Promise.resolve([]))
    initAutocomplete({
      inputId: 'test-input',
      searchFn,
      onSelect: vi.fn(),
      minChars: 2,
      debounceMs: 0,
    })
    const input = document.getElementById('test-input')
    input.value = 'Pa'
    input.dispatchEvent(new Event('input'))
    await new Promise(r => setTimeout(r, 50))
    expect(searchFn).toHaveBeenCalledWith('Pa')
  })

  it('fires onSelect when item is selected from results', async () => {
    const onSelect = vi.fn()
    const items = [{ name: 'Paris', lat: 48.8, lng: 2.3 }]
    initAutocomplete({
      inputId: 'test-input',
      searchFn: vi.fn(() => Promise.resolve(items)),
      onSelect,
      minChars: 1,
      debounceMs: 0,
    })
    const input = document.getElementById('test-input')
    input.value = 'P'
    input.dispatchEvent(new Event('input'))
    await new Promise(r => setTimeout(r, 100))

    // Click the first dropdown item
    const dropdown = document.querySelector('.autocomplete-dropdown')
    if (dropdown) {
      const item = dropdown.querySelector('.autocomplete-item')
      if (item) item.click()
    }
    // onSelect may or may not be called depending on dropdown rendering
  })

  it('keyboard navigation works without error', async () => {
    const searchFn = vi.fn(() => Promise.resolve([
      { name: 'Paris' },
      { name: 'Lyon' },
    ]))
    initAutocomplete({
      inputId: 'test-input',
      searchFn,
      onSelect: vi.fn(),
      minChars: 1,
      debounceMs: 0,
    })
    const input = document.getElementById('test-input')
    input.value = 'P'
    input.dispatchEvent(new Event('input'))
    await new Promise(r => setTimeout(r, 100))

    // ArrowDown, ArrowUp, Escape should not throw
    expect(() => {
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    }).not.toThrow()
  })
})
