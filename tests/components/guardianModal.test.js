import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGuardianState = {
  active: false,
  guardians: [],
  guardian: null,
  tripStart: null,
  alertSent: false,
  destination: 'Lyon',
  interval: 30,
  mode: 'standard',
  checkIns: [],
  events: [],
}

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
}))
vi.mock('../../src/services/guardian.js', () => ({
  getGuardianState: vi.fn(() => ({ ...mockGuardianState })),
  getTimeUntilNextCheckIn: vi.fn(() => 25),
  isCheckInOverdue: vi.fn(() => false),
  loadTripHistory: vi.fn(() => []),
  getETAInfo: vi.fn(() => ({ eta: null, confidence: 0 })),
  getBatteryLevel: vi.fn(() => null),
  getTripEvents: vi.fn(() => []),
  getTripPhoto: vi.fn(() => null),
  subscribeToGuardianChat: vi.fn(),
  unsubscribeGuardianChat: vi.fn(),
  stopGuardianMode: vi.fn(),
}))
vi.mock('../../src/services/guardianWatch.js', () => ({
  getChatMessages: vi.fn(() => []),
}))

import { renderGuardianModal } from '../../src/components/modals/Guardian.js'
import { getGuardianState, isCheckInOverdue } from '../../src/services/guardian.js'

describe('renderGuardianModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getGuardianState.mockReturnValue({ ...mockGuardianState })
    isCheckInOverdue.mockReturnValue(false)
  })

  it('renders intro screen (no active, no guardians)', () => {
    getGuardianState.mockReturnValue({ active: false, guardians: [], guardian: null })
    const html = renderGuardianModal({})
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(50)
  })

  it('renders main screen (no active, has guardians)', () => {
    getGuardianState.mockReturnValue({
      active: false,
      guardians: [{ name: 'Alice', phone: '+33600000000', color: '#22c55e' }],
      guardian: null,
      destination: 'Lyon',
      interval: 30,
    })
    const html = renderGuardianModal({})
    expect(html).toBeTruthy()
  })

  it('renders main screen (has legacy guardian)', () => {
    getGuardianState.mockReturnValue({
      active: false,
      guardians: [],
      guardian: { name: 'Bob', phone: '+33611111111' },
      destination: 'Paris',
      interval: 60,
    })
    const html = renderGuardianModal({})
    expect(html).toBeTruthy()
  })

  it('renders active screen (trip in progress)', () => {
    getGuardianState.mockReturnValue({
      ...mockGuardianState,
      active: true,
      tripStart: Date.now() - 30 * 60 * 1000,
      guardians: [{ name: 'Alice', phone: '+33600000000', color: '#22c55e' }],
      destination: 'Lyon',
      interval: 30,
    })
    isCheckInOverdue.mockReturnValue(false)
    const html = renderGuardianModal({})
    expect(html).toBeTruthy()
  })

  it('renders overdue screen (missed check-in)', () => {
    getGuardianState.mockReturnValue({
      ...mockGuardianState,
      active: true,
      tripStart: Date.now() - 90 * 60 * 1000,
      alertSent: false,
      guardians: [{ name: 'Alice', phone: '+33600000000', color: '#22c55e' }],
    })
    isCheckInOverdue.mockReturnValue(true)
    const html = renderGuardianModal({})
    expect(html).toBeTruthy()
  })

  it('returns empty string for expired trips (>8h)', () => {
    getGuardianState.mockReturnValue({
      ...mockGuardianState,
      active: true,
      tripStart: Date.now() - 9 * 60 * 60 * 1000, // 9 hours ago
    })
    const html = renderGuardianModal({})
    expect(html).toBe('')
  })

  it('renders main screen with multiple guardians', () => {
    getGuardianState.mockReturnValue({
      active: false,
      guardians: [
        { name: 'Alice', phone: '+33600000000', color: '#22c55e' },
        { name: 'Bob', phone: '+33611111111', color: '#3b82f6' },
        { name: 'Charlie', phone: '+33622222222', color: '#f59e0b' },
      ],
      destination: 'Marseille',
      interval: 45,
    })
    const html = renderGuardianModal({})
    expect(html).toBeTruthy()
  })
})
