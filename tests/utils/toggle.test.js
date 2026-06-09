import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn(() => '<svg></svg>'),
}))

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

  describe('window._toggleExec', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      vi.clearAllMocks()
    })

    it('is defined as a function on window', () => {
      expect(typeof window._toggleExec).toBe('function')
    })

    it('does nothing when called with null', () => {
      expect(() => window._toggleExec(null)).not.toThrow()
    })

    it('does nothing when called with element missing classList', () => {
      expect(() => window._toggleExec({})).not.toThrow()
    })

    it('toggles toggle-on class from off to on', () => {
      const html = renderToggle(false, '_dummyFn()', 'test')
      document.body.innerHTML = html
      const el = document.querySelector('button')
      expect(el.classList.contains('toggle-on')).toBe(false)
      window._toggleExec(el)
      expect(el.classList.contains('toggle-on')).toBe(true)
    })

    it('toggles toggle-on class from on to off', () => {
      const html = renderToggle(true, '_dummyFn()', 'test')
      document.body.innerHTML = html
      const el = document.querySelector('button')
      expect(el.classList.contains('toggle-on')).toBe(true)
      window._toggleExec(el)
      expect(el.classList.contains('toggle-on')).toBe(false)
    })

    it('sets aria-checked to true when toggling on', () => {
      const html = renderToggle(false, '_dummyFn()', 'test')
      document.body.innerHTML = html
      const el = document.querySelector('button')
      window._toggleExec(el)
      expect(el.getAttribute('aria-checked')).toBe('true')
    })

    it('sets aria-checked to false when toggling off', () => {
      const html = renderToggle(true, '_dummyFn()', 'test')
      document.body.innerHTML = html
      const el = document.querySelector('button')
      window._toggleExec(el)
      expect(el.getAttribute('aria-checked')).toBe('false')
    })

    it('calls the registered window handler after 30ms', async () => {
      const mockFn = vi.fn()
      window._toggleTestHandler = mockFn
      const html = renderToggle(false, '_toggleTestHandler()', 'test')
      document.body.innerHTML = html
      const el = document.querySelector('button')
      window._toggleExec(el)
      await new Promise(r => setTimeout(r, 50))
      expect(mockFn).toHaveBeenCalled()
      delete window._toggleTestHandler
    })

    it('calls handler with string argument', async () => {
      const mockFn = vi.fn()
      window._toggleTestArgFn = mockFn
      const html = renderToggle(false, "_toggleTestArgFn('myArg')", 'test')
      document.body.innerHTML = html
      const el = document.querySelector('button')
      window._toggleExec(el)
      await new Promise(r => setTimeout(r, 50))
      expect(mockFn).toHaveBeenCalledWith('myArg')
      delete window._toggleTestArgFn
    })

    it('calls handler with boolean argument true', async () => {
      const mockFn = vi.fn()
      window._toggleBoolFn = mockFn
      const html = renderToggle(false, '_toggleBoolFn(true)', 'test')
      document.body.innerHTML = html
      const el = document.querySelector('button')
      window._toggleExec(el)
      await new Promise(r => setTimeout(r, 50))
      expect(mockFn).toHaveBeenCalledWith(true)
      delete window._toggleBoolFn
    })

    it('calls handler with number argument', async () => {
      const mockFn = vi.fn()
      window._toggleNumFn = mockFn
      const html = renderToggle(false, '_toggleNumFn(42)', 'test')
      document.body.innerHTML = html
      const el = document.querySelector('button')
      window._toggleExec(el)
      await new Promise(r => setTimeout(r, 50))
      expect(mockFn).toHaveBeenCalledWith(42)
      delete window._toggleNumFn
    })

    it('does not throw when handler function is not on window', () => {
      const html = renderToggle(false, '_nonExistentHandlerXYZ()', 'test')
      document.body.innerHTML = html
      const el = document.querySelector('button')
      expect(() => window._toggleExec(el)).not.toThrow()
    })
  })
})
