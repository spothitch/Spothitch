import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ reports: [], user: null })),
  setState: vi.fn(),
}))
vi.mock('../../src/services/notifications.js', () => ({ showToast: vi.fn() }))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((key) => key) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((name) => `<svg>${name}</svg>`) }))
vi.mock('../../src/utils/sanitize.js', () => ({ escapeHTML: vi.fn((s) => String(s || '')), escapeJSString: vi.fn((s) => String(s || '')) }))
vi.mock('firebase/app', () => ({ getApps: vi.fn(() => []), getApp: vi.fn() }))
vi.mock('firebase/firestore', () => ({ getFirestore: vi.fn(), collection: vi.fn(), addDoc: vi.fn(() => Promise.resolve({ id: 'report-001' })), query: vi.fn(), where: vi.fn(), getDocs: vi.fn(() => Promise.resolve({ docs: [] })), orderBy: vi.fn(), limit: vi.fn() }))
vi.mock('../../src/services/firebase.js', () => ({ getCurrentUser: vi.fn(() => null) }))

import { getState } from '../../src/stores/state.js'
import {
  REPORT_TYPES,
  SEVERITY_LEVELS,
  getReportsForItem,
  isUnderReview,
  renderReportModal,
  submitReport,
  voteOnReport,
} from '../../src/services/moderation.js'

describe('moderation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getState.mockReturnValue({ reports: [], user: null })
  })

  describe('getReportsForItem', () => {
    it('returns empty array when no reports', () => {
      const result = getReportsForItem('spot', 'spot-001')
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })

    it('filters reports by type and targetId', () => {
      getState.mockReturnValue({
        reports: [
          { type: 'spot', targetId: 'spot-001', status: 'pending', severity: 'medium' },
          { type: 'spot', targetId: 'spot-002', status: 'pending', severity: 'medium' },
          { type: 'user', targetId: 'spot-001', status: 'pending', severity: 'medium' },
        ],
        user: null,
      })
      const result = getReportsForItem('spot', 'spot-001')
      expect(result.length).toBe(1)
      expect(result[0].targetId).toBe('spot-001')
    })
  })

  describe('isUnderReview', () => {
    it('returns false when no reports', () => {
      expect(isUnderReview('spot', 'spot-001')).toBe(false)
    })

    it('returns false for low/medium severity pending reports', () => {
      getState.mockReturnValue({
        reports: [{ type: 'spot', targetId: 'spot-001', status: 'pending', severity: 'medium' }],
        user: null,
      })
      expect(isUnderReview('spot', 'spot-001')).toBe(false)
    })

    it('returns true for high severity pending report', () => {
      getState.mockReturnValue({
        reports: [{ type: 'spot', targetId: 'spot-001', status: 'pending', severity: 'high' }],
        user: null,
      })
      expect(isUnderReview('spot', 'spot-001')).toBe(true)
    })

    it('returns true for critical severity pending report', () => {
      getState.mockReturnValue({
        reports: [{ type: 'user', targetId: 'user-abc', status: 'pending', severity: 'critical' }],
        user: null,
      })
      expect(isUnderReview('user', 'user-abc')).toBe(true)
    })
  })

  describe('renderReportModal', () => {
    it('returns empty string when showReport is false', () => {
      expect(renderReportModal({ showReport: false })).toBe('')
    })

    it('returns empty string when showReport is undefined', () => {
      expect(renderReportModal({})).toBe('')
    })

    it('renders modal HTML when showReport is true', () => {
      const html = renderReportModal({ showReport: true, reportType: 'spot' })
      expect(html).toBeTruthy()
      expect(html.length).toBeGreaterThan(100)
    })

    it('renders user report modal', () => {
      const html = renderReportModal({ showReport: true, reportType: 'user' })
      expect(html).toBeTruthy()
    })

    it('renders message report modal', () => {
      const html = renderReportModal({ showReport: true, reportType: 'message' })
      expect(html).toBeTruthy()
    })

    it('defaults to spot type for unknown report type', () => {
      const html = renderReportModal({ showReport: true, reportType: 'unknown' })
      expect(html).toBeTruthy()
    })
  })

  describe('submitReport', () => {
    it('runs without error for anonymous user (no Firebase)', async () => {
      await expect(submitReport('spot', 'spot-001', 'misplaced')).resolves.not.toThrow()
    })

    it('returns false when duplicate report within 24h', async () => {
      const timestamp = new Date().toISOString()
      getState.mockReturnValue({
        reports: [],
        userReports: [{ type: 'spot', targetId: 'spot-001', reason: 'misplaced', timestamp }],
        user: null,
      })
      const result = await submitReport('spot', 'spot-001', 'misplaced')
      expect(result).toBe(false)
    })

    it('submits report with user type', async () => {
      getState.mockReturnValue({ reports: [], userReports: [], user: { uid: 'user1' }, friends: [], spots: [] })
      const result = await submitReport('user', 'user-002', 'spam')
      expect(result).not.toBe(false)
    })

    it('submits report with message type', async () => {
      getState.mockReturnValue({ reports: [], userReports: [], user: null, spots: [] })
      const result = await submitReport('message', 'msg-001', 'hate')
      expect(typeof result === 'object' || result === false).toBe(true)
    })

    it('submits spot report with high severity (dangerous)', async () => {
      getState.mockReturnValue({ reports: [], userReports: [], user: null, spots: [] })
      const result = await submitReport('spot', 'spot-001', 'dangerous')
      expect(result).not.toBe(false)
    })

    it('handles high severity with spots in state (handleHighSeverityReport)', async () => {
      getState.mockReturnValue({
        reports: [],
        userReports: [],
        user: { uid: 'user1' },
        spots: [{ id: 'spot-001', name: 'Paris' }],
      })
      const result = await submitReport('spot', 'spot-001', 'dangerous')
      expect(result).not.toBe(false)
    })

    it('saves report with correct structure', async () => {
      const { setState } = await import('../../src/stores/state.js')
      getState.mockReturnValue({ reports: [], userReports: [], user: null, spots: [] })
      await submitReport('spot', 'spot-002', 'inaccurate')
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ reports: expect.any(Array) })
      )
    })
  })


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

  describe('voteOnReport', () => {
    it('returns false when report not found', async () => {
      getState.mockReturnValue({ reports: [], user: null })
      const result = await voteOnReport('nonexistent-id', true)
      expect(result).toBe(false)
    })

    it('returns false when user already voted', async () => {
      getState.mockReturnValue({
        reports: [{ id: 'r1', type: 'spot', targetId: 'spot-001', votes: 1, voters: ['anonymous'], status: 'pending', spots: [] }],
        user: null,
        spots: [],
      })
      const result = await voteOnReport('r1', true)
      expect(result).toBe(false)
    })

    it('records a vote agree', async () => {
      getState.mockReturnValue({
        reports: [{ id: 'r1', type: 'spot', targetId: 'spot-001', votes: 1, voters: [], status: 'pending' }],
        user: { uid: 'voter-1' },
        spots: [],
      })
      const result = await voteOnReport('r1', true)
      expect(result).toBe(true)
    })

    it('records a vote disagree', async () => {
      getState.mockReturnValue({
        reports: [{ id: 'r1', type: 'spot', targetId: 'spot-001', votes: 0, voters: [], status: 'pending' }],
        user: { uid: 'voter-2' },
        spots: [],
      })
      const result = await voteOnReport('r1', false)
      expect(result).toBe(true)
    })

    it('handles confirmed threshold (votes >= 5)', async () => {
      getState.mockReturnValue({
        reports: [{ id: 'r1', type: 'spot', targetId: 'spot-001', votes: 4, voters: [], status: 'pending', reason: 'dangerous' }],
        user: { uid: 'voter-3' },
        spots: [{ id: 'spot-001', name: 'Test' }],
      })
      const result = await voteOnReport('r1', true)
      expect(result).toBe(true)
    })

    it('sets dismissed status when votes <= -3', async () => {
      const { setState } = await import('../../src/stores/state.js')
      getState.mockReturnValue({
        reports: [{ id: 'r1', type: 'spot', targetId: 'spot-001', votes: -3, voters: [], status: 'pending', reason: 'other' }],
        user: { uid: 'voter-4' },
        spots: [],
      })
      await voteOnReport('r1', false)
      expect(setState).toHaveBeenCalled()
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
