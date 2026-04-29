import { describe, it, expect } from 'vitest'

import { icon, brandIcon, spinnerIcon, renderAvatar, DEFAULT_AVATAR_ICON } from '../../src/utils/icons.js'

describe('icons', () => {
  describe('icon()', () => {
    it('returns SVG for known icon', () => {
      const result = icon('map-pin')
      expect(result).toContain('<svg')
      expect(result).toContain('</svg>')
    })

    it('returns empty string for unknown icon', () => {
      expect(icon('nonexistent-icon-xyz')).toBe('')
    })

    it('applies custom CSS class', () => {
      const result = icon('map-pin', 'w-5 h-5 text-red-500')
      expect(result).toContain('w-5 h-5 text-red-500')
    })

    it('uses default size of 20', () => {
      const result = icon('map-pin')
      expect(result).toContain('width="20"')
      expect(result).toContain('height="20"')
    })

    it('respects custom size', () => {
      const result = icon('map-pin', '', 32)
      expect(result).toContain('width="32"')
      expect(result).toContain('height="32"')
    })

    it('includes aria-hidden for accessibility', () => {
      const result = icon('map-pin')
      expect(result).toContain('aria-hidden="true"')
    })

    it('handles common icons without error', () => {
      const commonIcons = [
        'map-pin', 'check', 'x', 'plus', 'minus', 'search',
        'home', 'user', 'heart', 'star', 'settings', 'trash-2',
        'arrow-left', 'arrow-right', 'shield-check', 'globe',
      ]
      commonIcons.forEach(name => {
        const result = icon(name)
        expect(result).toContain('<svg')
      })
    })
  })

  describe('brandIcon()', () => {
    it('returns empty string for unknown brand', () => {
      expect(brandIcon('nonexistent-brand')).toBe('')
    })

    it('returns SVG for known brand (if any)', () => {
      // Test with common brands
      const facebook = brandIcon('facebook')
      // May or may not exist depending on config
      if (facebook) {
        expect(facebook).toContain('<svg')
      }
    })
  })

  describe('spinnerIcon()', () => {
    it('returns spinning icon', () => {
      const result = spinnerIcon()
      expect(result).toContain('animate-spin')
      expect(result).toContain('<svg')
    })

    it('applies custom class', () => {
      const result = spinnerIcon('text-white')
      expect(result).toContain('text-white')
    })
  })

  describe('renderAvatar()', () => {
    it('renders thumbs-up for null avatar', () => {
      const result = renderAvatar(null)
      expect(result).toContain('<svg')
      expect(result).toContain('text-amber-400')
    })

    it('renders icon for Lucide icon name', () => {
      const result = renderAvatar('globe')
      expect(result).toContain('<svg')
    })

    it('renders emoji for legacy emoji avatar', () => {
      const result = renderAvatar('A')
      expect(result).toContain('A')
    })

    it('renders thumbs-up for thumbs-up emoji', () => {
      const result = renderAvatar('thumbs-up')
      expect(result).toContain('<svg')
    })
  })

  describe('DEFAULT_AVATAR_ICON', () => {
    it('is thumbs-up', () => {
      expect(DEFAULT_AVATAR_ICON).toBe('thumbs-up')
    })
  })
})
