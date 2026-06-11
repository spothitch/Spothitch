import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg data-icon="${name}"></svg>`),
}))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeHTML: vi.fn((s) => String(s || '')),
}))
vi.mock('../../src/services/guardianWatch.js', () => ({
  getActiveGuardianTimers: vi.fn(() => []),
  getTimeSinceCheckIn: vi.fn(() => 1200),
  isTimerOverdue: vi.fn(() => false),
  getTripDuration: vi.fn(() => 3600),
}))

import { renderGuardianWatch } from '../../src/components/views/social/GuardianWatch.js'
import { getActiveGuardianTimers, isTimerOverdue } from '../../src/services/guardianWatch.js'

const mockTimer = {
  id: 'timer-001',
  userId: 'user-xyz',
  userName: 'Alice',
  destination: 'Lyon',
  interval: 30,
  tripStart: Date.now() - 30 * 60 * 1000,
  lastCheckIn: Date.now() - 20 * 60 * 1000,
  avatar: null,
  color: '#22c55e',
}

describe('renderGuardianWatch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getActiveGuardianTimers.mockReturnValue([])
    isTimerOverdue.mockReturnValue(false)
  })

  it('returns empty string when no active guardian timers', () => {
    getActiveGuardianTimers.mockReturnValue([])
    const html = renderGuardianWatch()
    expect(html).toBe('')
  })

  it('renders section when there are active timers', () => {
    getActiveGuardianTimers.mockReturnValue([mockTimer])
    const html = renderGuardianWatch()
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(50)
  })

  it('renders friend name in timer section', () => {
    getActiveGuardianTimers.mockReturnValue([mockTimer])
    const html = renderGuardianWatch()
    expect(html).toContain('Alice')
  })

  it('renders destination in timer section', () => {
    getActiveGuardianTimers.mockReturnValue([mockTimer])
    const html = renderGuardianWatch()
    expect(html).toContain('Lyon')
  })

  it('renders overdue state when check-in missed', () => {
    isTimerOverdue.mockReturnValue(true)
    getActiveGuardianTimers.mockReturnValue([mockTimer])
    const html = renderGuardianWatch()
    expect(html).toBeTruthy()
  })

  it('renders multiple timers', () => {
    getActiveGuardianTimers.mockReturnValue([
      mockTimer,
      { ...mockTimer, id: 'timer-002', userId: 'user-aaa', userName: 'Bob', destination: 'Marseille' },
    ])
    const html = renderGuardianWatch()
    expect(html).toContain('Alice')
    expect(html).toContain('Bob')
  })
})
