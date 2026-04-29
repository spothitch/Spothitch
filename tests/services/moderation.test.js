import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
}))
vi.mock('../../src/services/notifications.js', () => ({
  showToast: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg>${name}</svg>`),
}))

import { REPORT_TYPES, SEVERITY_LEVELS } from '../../src/services/moderation.js'

describe('moderation', () => {
  describe('REPORT_TYPES', () => {
    it('has SPOT, USER, and MESSAGE categories', () => {
      expect(REPORT_TYPES.SPOT).toBeDefined()
      expect(REPORT_TYPES.USER).toBeDefined()
      expect(REPORT_TYPES.MESSAGE).toBeDefined()
    })

    it('SPOT has expected reason types', () => {
      expect(REPORT_TYPES.SPOT.MISPLACED).toBeDefined()
      expect(REPORT_TYPES.SPOT.DANGEROUS).toBeDefined()
      expect(REPORT_TYPES.SPOT.DUPLICATE).toBeDefined()
      expect(REPORT_TYPES.SPOT.OTHER).toBeDefined()
    })

    it('USER has expected reason types', () => {
      expect(REPORT_TYPES.USER.SPAM).toBeDefined()
      expect(REPORT_TYPES.USER.HARASSMENT).toBeDefined()
      expect(REPORT_TYPES.USER.FAKE).toBeDefined()
    })

    it('MESSAGE has hate speech category', () => {
      expect(REPORT_TYPES.MESSAGE.HATE).toBeDefined()
      expect(REPORT_TYPES.MESSAGE.HATE.severity).toBe('critical')
    })

    it('each reason has id, labelKey, icon, severity', () => {
      const allReasons = [
        ...Object.values(REPORT_TYPES.SPOT),
        ...Object.values(REPORT_TYPES.USER),
        ...Object.values(REPORT_TYPES.MESSAGE),
      ]
      allReasons.forEach(r => {
        expect(r.id).toBeDefined()
        expect(r.labelKey).toBeDefined()
        expect(r.icon).toBeDefined()
        expect(r.severity).toBeDefined()
      })
    })

    it('severity values are valid', () => {
      const validSeverities = ['low', 'medium', 'high', 'critical']
      const allReasons = [
        ...Object.values(REPORT_TYPES.SPOT),
        ...Object.values(REPORT_TYPES.USER),
        ...Object.values(REPORT_TYPES.MESSAGE),
      ]
      allReasons.forEach(r => {
        expect(validSeverities).toContain(r.severity)
      })
    })
  })

  describe('SEVERITY_LEVELS', () => {
    it('defines all severity levels', () => {
      expect(SEVERITY_LEVELS.low).toBeDefined()
      expect(SEVERITY_LEVELS.medium).toBeDefined()
      expect(SEVERITY_LEVELS.high).toBeDefined()
      expect(SEVERITY_LEVELS.critical).toBeDefined()
    })

    it('priorities increase with severity', () => {
      expect(SEVERITY_LEVELS.low.priority).toBeLessThan(SEVERITY_LEVELS.medium.priority)
      expect(SEVERITY_LEVELS.medium.priority).toBeLessThan(SEVERITY_LEVELS.high.priority)
      expect(SEVERITY_LEVELS.high.priority).toBeLessThan(SEVERITY_LEVELS.critical.priority)
    })

    it('each level has color, bg, priority', () => {
      Object.values(SEVERITY_LEVELS).forEach(level => {
        expect(level.color).toBeDefined()
        expect(level.bg).toBeDefined()
        expect(level.priority).toBeDefined()
      })
    })
  })
})
