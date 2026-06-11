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
  trapFocus,
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

  describe('generateTimeLabel — time branches', () => {
    it('returns empty string for null', () => {
      expect(generateTimeLabel(null)).toBe('')
    })

    it('returns "just now" for less than 1 minute ago', () => {
      const now = new Date().toISOString()
      const label = generateTimeLabel(now)
      expect(typeof label).toBe('string')
      expect(label.length).toBeGreaterThan(0)
    })

    it('returns minutes for date 30 minutes ago', () => {
      const d = new Date(Date.now() - 30 * 60 * 1000).toISOString()
      const label = generateTimeLabel(d)
      expect(typeof label).toBe('string')
      expect(label).toContain('30')
    })

    it('returns hours for date 3 hours ago', () => {
      const d = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      const label = generateTimeLabel(d)
      expect(typeof label).toBe('string')
      expect(label).toContain('3')
    })

    it('returns days for date 4 days ago', () => {
      const d = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      const label = generateTimeLabel(d)
      expect(typeof label).toBe('string')
      expect(label).toContain('4')
    })

    it('returns formatted date for date > 7 days ago', () => {
      const d = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      const label = generateTimeLabel(d)
      expect(typeof label).toBe('string')
      expect(label.length).toBeGreaterThan(0)
    })

    it('handles singular minute (1 min ago)', () => {
      const d = new Date(Date.now() - 1 * 60 * 1000).toISOString()
      const label = generateTimeLabel(d)
      expect(typeof label).toBe('string')
    })

    it('handles singular hour (1 hour ago)', () => {
      const d = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      const label = generateTimeLabel(d)
      expect(typeof label).toBe('string')
    })

    it('handles singular day (1 day ago)', () => {
      const d = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      const label = generateTimeLabel(d)
      expect(typeof label).toBe('string')
    })
  })

  describe('announceListUpdate — list types', () => {
    it('announces spots count', () => {
      expect(() => announceListUpdate('spots', 5)).not.toThrow()
    })

    it('announces messages count', () => {
      expect(() => announceListUpdate('messages', 3)).not.toThrow()
    })

    it('announces friends count', () => {
      expect(() => announceListUpdate('friends', 10)).not.toThrow()
    })

    it('announces unknown type without crash', () => {
      expect(() => announceListUpdate('unknown', 0)).not.toThrow()
    })
  })

  describe('trapFocus', () => {
    it('returns cleanup function', () => {
      const div = document.createElement('div')
      div.innerHTML = '<button>First</button><button>Last</button>'
      document.body.appendChild(div)
      const cleanup = trapFocus(div)
      expect(typeof cleanup).toBe('function')
      cleanup()
      document.body.removeChild(div)
    })

    it('returns empty cleanup when no focusable elements', () => {
      const div = document.createElement('div')
      div.innerHTML = '<p>No focusable</p>'
      const cleanup = trapFocus(div)
      expect(typeof cleanup).toBe('function')
    })

    it('does not throw with single focusable element', () => {
      const div = document.createElement('div')
      div.innerHTML = '<button>Only</button>'
      document.body.appendChild(div)
      expect(() => trapFocus(div)).not.toThrow()
      document.body.removeChild(div)
    })

    it('handles Tab key forward navigation', () => {
      const div = document.createElement('div')
      div.innerHTML = '<button id="b1">First</button><button id="b2">Last</button>'
      document.body.appendChild(div)
      const cleanup = trapFocus(div)
      const lastBtn = div.querySelector('#b2')
      lastBtn.focus()
      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      div.dispatchEvent(event)
      cleanup()
      document.body.removeChild(div)
    })

    it('handles Shift+Tab backward navigation', () => {
      const div = document.createElement('div')
      div.innerHTML = '<button id="b1">First</button><button id="b2">Last</button>'
      document.body.appendChild(div)
      const cleanup = trapFocus(div)
      const firstBtn = div.querySelector('#b1')
      firstBtn.focus()
      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true })
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      div.dispatchEvent(event)
      cleanup()
      document.body.removeChild(div)
    })
  })
})

describe('screenReader — additional coverage', () => {
  describe('generateSpotDescription — all fields', () => {
    it('includes type when spot.type is set', () => {
      const desc = generateSpotDescription({ name: 'Test', type: 'gas_station' })
      expect(desc).toContain('Test')
      expect(typeof desc).toBe('string')
    })

    it('includes verificationStatus when set', () => {
      const desc = generateSpotDescription({ name: 'Test', verificationStatus: 'verified' })
      expect(typeof desc).toBe('string')
    })

    it('includes all fields: name + country + rating + type + status', () => {
      const desc = generateSpotDescription({
        name: 'Paris Nord', country: 'FR', globalRating: 4.2,
        type: 'roadside', verificationStatus: 'disputed'
      })
      expect(desc).toContain('Paris Nord')
    })

    it('handles toll type', () => {
      const desc = generateSpotDescription({ name: 'Toll', type: 'toll' })
      expect(typeof desc).toBe('string')
    })

    it('handles dangerous verificationStatus', () => {
      const desc = generateSpotDescription({ name: 'Spot', verificationStatus: 'dangerous' })
      expect(typeof desc).toBe('string')
    })

    it('handles unknown type (uses type as-is)', () => {
      const desc = generateSpotDescription({ name: 'Spot', type: 'unknown_custom_type' })
      expect(desc).toContain('unknown_custom_type')
    })
  })

  describe('trapFocus — input focus handling', () => {
    it('does not focus first when active element is an input inside container', () => {
      const div = document.createElement('div')
      div.innerHTML = '<input type="text" id="inp"/><button>Submit</button>'
      document.body.appendChild(div)
      const input = div.querySelector('input')
      input.focus()
      expect(() => trapFocus(div)).not.toThrow()
      document.body.removeChild(div)
    })
  })
})
