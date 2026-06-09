import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
}))

import {
  announce,
  announceAction,
  announceViewChange,
  announceListUpdate,
  announceLoading,
  announceError,
  announceNotification,
  generateSpotDescription,
  generateRatingLabel,
  generateTimeLabel,
  getFirstFocusable,
  getAllFocusable,
  renderAccessibilityHelp,
} from '../../src/services/screenReader.js'

describe('screenReader', () => {
  describe('announce', () => {
    it('does not throw', () => {
      expect(() => announce('Test message')).not.toThrow()
    })
  })

  describe('announceAction', () => {
    it('does not throw', () => {
      expect(() => announceAction('save', true)).not.toThrow()
      expect(() => announceAction('delete', false, 'error reason')).not.toThrow()
    })
  })

  describe('announceViewChange', () => {
    it('does not throw', () => {
      expect(() => announceViewChange('profile')).not.toThrow()
    })
  })

  describe('announceListUpdate', () => {
    it('does not throw', () => {
      expect(() => announceListUpdate('spots', 42)).not.toThrow()
    })
  })

  describe('announceLoading', () => {
    it('does not throw', () => {
      expect(() => announceLoading(true, 'spots')).not.toThrow()
      expect(() => announceLoading(false)).not.toThrow()
    })
  })

  describe('announceError', () => {
    it('does not throw', () => {
      expect(() => announceError('Network error')).not.toThrow()
    })
  })

  describe('announceNotification', () => {
    it('does not throw', () => {
      expect(() => announceNotification('Title', 'Body text')).not.toThrow()
    })
  })

  describe('generateSpotDescription', () => {
    it('generates description for a spot', () => {
      const desc = generateSpotDescription({
        from: 'Paris Nord',
        to: 'Lyon',
        globalRating: 4.5,
        avgWaitTime: 15,
        country: 'FR',
      })
      expect(typeof desc).toBe('string')
      expect(desc.length).toBeGreaterThan(0)
      expect(desc).toContain('4.5') // rating included
    })
    it('handles minimal spot', () => {
      const desc = generateSpotDescription({ from: 'Spot' })
      expect(typeof desc).toBe('string')
      expect(desc.length).toBeGreaterThan(0)
    })
    it('throws on null input (missing null guard)', () => {
      // Note: source has no null guard — this documents current behavior
      expect(() => generateSpotDescription(null)).toThrow()
    })
  })

  describe('generateRatingLabel', () => {
    it('generates label for rating', () => {
      const label = generateRatingLabel(4.5)
      expect(label).toContain('4.5')
    })
    it('handles 0 rating', () => {
      const label = generateRatingLabel(0)
      expect(typeof label).toBe('string')
    })
  })

  describe('generateTimeLabel', () => {
    it('generates label for recent date', () => {
      const label = generateTimeLabel(new Date().toISOString())
      expect(typeof label).toBe('string')
      expect(label.length).toBeGreaterThan(0)
    })
    it('handles null date', () => {
      const label = generateTimeLabel(null)
      expect(typeof label).toBe('string')
    })
  })

  describe('getFirstFocusable', () => {
    it('returns null for empty container', () => {
      const div = document.createElement('div')
      expect(getFirstFocusable(div)).toBeNull()
    })
    it('finds button in container', () => {
      const div = document.createElement('div')
      const btn = document.createElement('button')
      div.appendChild(btn)
      expect(getFirstFocusable(div)).toBe(btn)
    })
  })

  describe('getAllFocusable', () => {
    it('returns empty for empty container', () => {
      const div = document.createElement('div')
      expect(getAllFocusable(div).length).toBe(0)
    })
    it('finds all focusable elements', () => {
      const div = document.createElement('div')
      div.innerHTML = '<button>A</button><input type="text"><a href="#">Link</a>'
      expect(getAllFocusable(div).length).toBe(3)
    })
  })

  describe('renderAccessibilityHelp', () => {
    it('returns empty string when showAccessibilityHelp is false', () => {
      expect(renderAccessibilityHelp({ showAccessibilityHelp: false })).toBe('')
    })

    it('returns empty string when state is empty', () => {
      expect(renderAccessibilityHelp({})).toBe('')
    })

    it('returns HTML string when showAccessibilityHelp is true', () => {
      const html = renderAccessibilityHelp({ showAccessibilityHelp: true })
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(100)
    })

    it('contains role="dialog"', () => {
      const html = renderAccessibilityHelp({ showAccessibilityHelp: true })
      expect(html).toContain('role="dialog"')
    })

    it('contains aria-modal="true"', () => {
      const html = renderAccessibilityHelp({ showAccessibilityHelp: true })
      expect(html).toContain('aria-modal="true"')
    })

    it('contains keyboard shortcuts section', () => {
      const html = renderAccessibilityHelp({ showAccessibilityHelp: true })
      expect(html).toContain('sr.keyboardShortcuts')
    })

    it('contains closeAccessibilityHelp handler', () => {
      const html = renderAccessibilityHelp({ showAccessibilityHelp: true })
      expect(html).toContain('closeAccessibilityHelp()')
    })

    it('contains navigation section with Alt+H shortcut', () => {
      const html = renderAccessibilityHelp({ showAccessibilityHelp: true })
      expect(html).toContain('Alt + H')
    })

    it('contains tips section', () => {
      const html = renderAccessibilityHelp({ showAccessibilityHelp: true })
      expect(html).toContain('sr.tips')
    })

    it('contains close button with sr.close key', () => {
      const html = renderAccessibilityHelp({ showAccessibilityHelp: true })
      expect(html).toContain('sr.close')
    })
  })

  describe('window.closeAccessibilityHelp', () => {
    it('is defined as a global function', () => {
      expect(typeof window.closeAccessibilityHelp).toBe('function')
    })

    it('runs without throwing', () => {
      expect(() => window.closeAccessibilityHelp()).not.toThrow()
    })

    it('can be called multiple times without error', () => {
      expect(() => {
        window.closeAccessibilityHelp()
        window.closeAccessibilityHelp()
      }).not.toThrow()
    })
  })
})
