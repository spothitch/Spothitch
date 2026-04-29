import { describe, it, expect } from 'vitest'

import {
  sanitize,
  escapeHTML,
  escapeJSString,
  sanitizeInput,
} from '../../src/utils/sanitize.js'

describe('sanitize', () => {
  describe('sanitize()', () => {
    it('returns empty string for null/undefined', () => {
      expect(sanitize(null)).toBe('')
      expect(sanitize(undefined)).toBe('')
      expect(sanitize('')).toBe('')
    })

    it('returns empty string for non-string', () => {
      expect(sanitize(42)).toBe('')
      expect(sanitize({})).toBe('')
    })

    it('keeps safe HTML', () => {
      const result = sanitize('<b>hello</b>')
      expect(result).toContain('<b>')
      expect(result).toContain('hello')
    })

    it('strips script tags (XSS)', () => {
      const result = sanitize('<script>alert("xss")</script>')
      expect(result).not.toContain('script')
      expect(result).not.toContain('alert')
    })

    it('strips onclick attributes', () => {
      const result = sanitize('<button onclick="alert(1)">Click</button>')
      expect(result).not.toContain('onclick')
    })

    it('strips onerror attributes', () => {
      const result = sanitize('<img onerror="alert(1)" src="x">')
      expect(result).not.toContain('onerror')
    })

    it('keeps allowed attributes', () => {
      const result = sanitize('<a href="https://example.com" class="link">Link</a>')
      expect(result).toContain('href')
      expect(result).toContain('class')
    })

    it('keeps SVG elements', () => {
      const result = sanitize('<svg><path d="M0 0"></path></svg>')
      expect(result).toContain('svg')
      expect(result).toContain('path')
    })
  })

  describe('escapeHTML', () => {
    it('returns empty string for null/undefined', () => {
      expect(escapeHTML(null)).toBe('')
      expect(escapeHTML(undefined)).toBe('')
    })

    it('escapes < and >', () => {
      const result = escapeHTML('<script>')
      expect(result).toContain('&lt;')
      expect(result).toContain('&gt;')
    })

    it('escapes & ampersand', () => {
      expect(escapeHTML('A & B')).toContain('&amp;')
    })

    it('keeps plain text unchanged', () => {
      expect(escapeHTML('Hello World')).toBe('Hello World')
    })

    it('handles quotes (textContent does not escape quotes)', () => {
      const result = escapeHTML('"quoted"')
      // textContent + innerHTML preserves quotes as-is (no XSS risk in text)
      expect(result).toContain('quoted')
    })
  })

  describe('escapeJSString', () => {
    it('returns empty for null/undefined', () => {
      expect(escapeJSString(null)).toBe('')
      expect(escapeJSString(undefined)).toBe('')
      expect(escapeJSString('')).toBe('')
    })

    it('escapes single quotes', () => {
      expect(escapeJSString("it's")).toContain('&#39;')
    })

    it('escapes double quotes', () => {
      expect(escapeJSString('say "hello"')).toContain('&quot;')
    })

    it('escapes < and >', () => {
      expect(escapeJSString('<script>')).toContain('&lt;')
      expect(escapeJSString('<script>')).toContain('&gt;')
    })

    it('escapes backslashes', () => {
      expect(escapeJSString('path\\to')).toContain('\\\\')
    })

    it('escapes ampersand', () => {
      expect(escapeJSString('A & B')).toContain('&amp;')
    })

    it('handles complex XSS attempts', () => {
      const result = escapeJSString("');alert('xss")
      expect(result).not.toContain("')")
      expect(result).toContain('&#39;')
    })
  })

  describe('sanitizeInput', () => {
    it('returns empty for null/undefined', () => {
      expect(sanitizeInput(null)).toBe('')
      expect(sanitizeInput(undefined)).toBe('')
    })

    it('trims whitespace', () => {
      const result = sanitizeInput('  hello  ')
      expect(result).toBe('hello')
    })

    it('escapes HTML in input', () => {
      const result = sanitizeInput('<script>alert("xss")</script>')
      expect(result).not.toContain('<script>')
    })
  })
})
