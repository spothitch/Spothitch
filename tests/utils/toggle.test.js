import { describe, it, expect } from 'vitest'

import { renderToggle, renderToggleCompact } from '../../src/utils/toggle.js'

describe('toggle', () => {
  describe('renderToggle', () => {
    it('returns HTML button element', () => {
      const html = renderToggle(false, "toggleTheme()", 'Theme')
      expect(html).toContain('<button')
      expect(html).toContain('role="switch"')
    })

    it('sets aria-checked=false when off', () => {
      const html = renderToggle(false, "fn()", 'Label')
      expect(html).toContain('aria-checked="false"')
    })

    it('sets aria-checked=true when on', () => {
      const html = renderToggle(true, "fn()", 'Label')
      expect(html).toContain('aria-checked="true"')
    })

    it('adds toggle-on class when on', () => {
      const html = renderToggle(true, "fn()", 'Label')
      expect(html).toContain('toggle-on')
    })

    it('does not add toggle-on class when off', () => {
      const html = renderToggle(false, "fn()", 'Label')
      expect(html).not.toContain('toggle-on')
    })

    it('includes aria-label', () => {
      const html = renderToggle(false, "fn()", 'Dark mode')
      expect(html).toContain('aria-label="Dark mode"')
    })

    it('escapes HTML in label', () => {
      const html = renderToggle(false, "fn()", '<script>xss</script>')
      expect(html).not.toContain('<script>')
      expect(html).toContain('&lt;script')
    })

    it('has toggle thumb', () => {
      const html = renderToggle(true, "fn()", 'test')
      expect(html).toContain('spothitch-toggle-thumb')
    })
  })

  describe('renderToggleCompact', () => {
    it('returns compact toggle HTML', () => {
      const html = renderToggleCompact(false, "fn()", 'Compact')
      expect(html).toContain('spothitch-toggle-compact')
    })

    it('behaves same as regular toggle for state', () => {
      const onHtml = renderToggleCompact(true, "fn()", 'test')
      expect(onHtml).toContain('toggle-on')
      expect(onHtml).toContain('aria-checked="true"')

      const offHtml = renderToggleCompact(false, "fn()", 'test')
      expect(offHtml).not.toContain('toggle-on')
    })
  })
})
