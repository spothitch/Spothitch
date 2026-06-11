import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg data-icon="${name}"></svg>`),
}))

import { renderCustomSelect } from '../../src/utils/customSelect.js'

describe('renderCustomSelect', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  const options = [
    { value: 'solo', text: 'Solo' },
    { value: 'duo', text: 'Duo' },
    { value: 'group', text: 'Groupe' },
  ]

  it('renders HTML string', () => {
    const html = renderCustomSelect({ id: 'test-sel', options, label: 'Choisir' })
    expect(typeof html).toBe('string')
    expect(html).toBeTruthy()
  })

  it('includes the hidden input with selected value', () => {
    const html = renderCustomSelect({ id: 'my-select', options, value: 'duo' })
    expect(html).toContain('id="my-select"')
    expect(html).toContain('value="duo"')
  })

  it('defaults to first option when value not found', () => {
    const html = renderCustomSelect({ id: 'sel', options, value: 'nonexistent' })
    expect(html).toContain('value="solo"')
  })

  it('renders the label when provided', () => {
    const html = renderCustomSelect({ id: 'sel', options, label: 'Taille du groupe' })
    expect(html).toContain('Taille du groupe')
  })

  it('renders no label when omitted', () => {
    const html = renderCustomSelect({ id: 'sel', options })
    expect(html).not.toContain('<label')
  })

  it('renders all options as buttons', () => {
    const html = renderCustomSelect({ id: 'sel', options })
    expect(html).toContain('Solo')
    expect(html).toContain('Duo')
    expect(html).toContain('Groupe')
  })

  it('includes toggleCustomSelect handler', () => {
    const html = renderCustomSelect({ id: 'sel', options })
    expect(html).toContain('toggleCustomSelect(')
  })

  it('includes selectCustomOption handler', () => {
    const html = renderCustomSelect({ id: 'sel', options })
    expect(html).toContain('selectCustomOption(')
  })

  it('includes role=listbox on button', () => {
    const html = renderCustomSelect({ id: 'sel', options })
    expect(html).toContain('role="listbox"')
  })

  it('applies className to wrapper', () => {
    const html = renderCustomSelect({ id: 'sel', options, className: 'my-custom-class' })
    expect(html).toContain('my-custom-class')
  })

  it('handles empty options array gracefully', () => {
    const html = renderCustomSelect({ id: 'sel', options: [] })
    expect(typeof html).toBe('string')
  })

  it('renders menu element with correct id', () => {
    const html = renderCustomSelect({ id: 'test-sel', options })
    expect(html).toContain('id="test-sel-menu"')
  })

  describe('global handlers', () => {
    it('window.toggleCustomSelect is defined', () => {
      expect(typeof window.toggleCustomSelect).toBe('function')
    })

    it('window.selectCustomOption is defined', () => {
      expect(typeof window.selectCustomOption).toBe('function')
    })

    it('toggleCustomSelect works with real DOM', () => {
      document.body.innerHTML = `
        <div>
          <button id="sel-btn" aria-expanded="false"></button>
          <div id="sel-menu" class="custom-select-menu hidden"></div>
        </div>
      `
      window.toggleCustomSelect('sel')
      const menu = document.getElementById('sel-menu')
      expect(menu.classList.contains('hidden')).toBe(false)
    })

    it('selectCustomOption updates hidden input and label', () => {
      document.body.innerHTML = `
        <input type="hidden" id="sel2" value="solo" />
        <span id="sel2-label">Solo</span>
        <div id="sel2-menu" class="custom-select-menu"></div>
        <button id="sel2-btn" aria-expanded="true"></button>
      `
      window.selectCustomOption('sel2', 'duo', 'Duo')
      expect(document.getElementById('sel2').value).toBe('duo')
      expect(document.getElementById('sel2-label').textContent).toBe('Duo')
    })
  })
})
