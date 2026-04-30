import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
}))
vi.mock('../../src/services/notifications.js', () => ({ showToast: vi.fn() }))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((key) => key) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((name) => `<svg>${name}</svg>`) }))

import { REPORT_TYPES, SEVERITY_LEVELS } from '../../src/services/moderation.js'

describe('moderation', () => {
  describe('REPORT_TYPES', () => {
    it('SPOT has 7 reason types with correct IDs', () => {
      const ids = Object.values(REPORT_TYPES.SPOT).map(r => r.id)
      expect(ids).toContain('misplaced')
      expect(ids).toContain('dangerous')
      expect(ids).toContain('duplicate')
      expect(ids).toContain('closed')
      expect(ids).toContain('other')
      expect(ids.length).toBe(7)
    })

    it('USER has 5 reason types with correct IDs', () => {
      const ids = Object.values(REPORT_TYPES.USER).map(r => r.id)
      expect(ids).toContain('spam')
      expect(ids).toContain('harassment')
      expect(ids).toContain('fake')
      expect(ids.length).toBe(5)
    })

    it('MESSAGE has 5 reason types including hate with critical severity', () => {
      const ids = Object.values(REPORT_TYPES.MESSAGE).map(r => r.id)
      expect(ids).toContain('hate')
      expect(REPORT_TYPES.MESSAGE.HATE.severity).toBe('critical')
      expect(ids.length).toBe(5)
    })

    it('DANGEROUS spots have high severity', () => {
      expect(REPORT_TYPES.SPOT.DANGEROUS.severity).toBe('high')
    })

    it('DUPLICATE spots have low severity', () => {
      expect(REPORT_TYPES.SPOT.DUPLICATE.severity).toBe('low')
    })

    it('HARASSMENT has high severity for both user and message', () => {
      expect(REPORT_TYPES.USER.HARASSMENT.severity).toBe('high')
      expect(REPORT_TYPES.MESSAGE.HARASSMENT.severity).toBe('high')
    })

    it('every reason has an icon name that is a non-empty string', () => {
      const allReasons = [
        ...Object.values(REPORT_TYPES.SPOT),
        ...Object.values(REPORT_TYPES.USER),
        ...Object.values(REPORT_TYPES.MESSAGE),
      ]
      allReasons.forEach(r => {
        expect(typeof r.icon).toBe('string')
        expect(r.icon.length).toBeGreaterThan(0)
      })
    })

    it('every reason has a labelKey for i18n', () => {
      const allReasons = [
        ...Object.values(REPORT_TYPES.SPOT),
        ...Object.values(REPORT_TYPES.USER),
        ...Object.values(REPORT_TYPES.MESSAGE),
      ]
      allReasons.forEach(r => {
        expect(typeof r.labelKey).toBe('string')
        expect(r.labelKey.startsWith('report')).toBe(true)
      })
    })
  })

  describe('SEVERITY_LEVELS', () => {
    it('has exactly 4 levels', () => {
      expect(Object.keys(SEVERITY_LEVELS).length).toBe(4)
    })

    it('priorities are 1, 2, 3, 4', () => {
      expect(SEVERITY_LEVELS.low.priority).toBe(1)
      expect(SEVERITY_LEVELS.medium.priority).toBe(2)
      expect(SEVERITY_LEVELS.high.priority).toBe(3)
      expect(SEVERITY_LEVELS.critical.priority).toBe(4)
    })

    it('colors contain tailwind color classes', () => {
      expect(SEVERITY_LEVELS.low.color).toContain('text-')
      expect(SEVERITY_LEVELS.critical.color).toContain('text-')
    })

    it('bg contains tailwind bg classes', () => {
      expect(SEVERITY_LEVELS.low.bg).toContain('bg-')
      expect(SEVERITY_LEVELS.critical.bg).toContain('bg-')
    })
  })
})
