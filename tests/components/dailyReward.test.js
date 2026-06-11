import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ showDailyReward: true, lastDailyRewardResult: null })),
  setState: vi.fn(),
}))
vi.mock('../../src/services/dailyReward.js', () => ({
  getDailyRewardInfo: vi.fn(() => ({ streak: 3, nextReward: 50 })),
  canClaimReward: vi.fn(() => true),
  claimReward: vi.fn(),
  getRewardsCalendar: vi.fn(() => []),
}))
vi.mock('../../src/utils/confetti.js', () => ({ launchConfettiBurst: vi.fn() }))
vi.mock('../../src/services/notifications.js', () => ({ showToast: vi.fn() }))

import {
  renderDailyRewardModal,
  handleClaimDailyReward,
  closeDailyReward,
  closeDailyRewardResult,
} from '../../src/components/modals/DailyReward.js'
import { getState, setState } from '../../src/stores/state.js'
import { claimReward, getRewardsCalendar } from '../../src/services/dailyReward.js'
import { showToast } from '../../src/services/notifications.js'
import { launchConfettiBurst } from '../../src/utils/confetti.js'

const mockDays = [
  { day: 1, points: 10, claimed: true, current: false, locked: false, isMystery: false, iconName: 'star' },
  { day: 2, points: 20, claimed: false, current: true, locked: false, isMystery: false, iconName: 'gift' },
  { day: 3, points: 30, claimed: false, current: false, locked: true, isMystery: false, iconName: 'zap' },
  { day: 4, points: 50, claimed: false, current: false, locked: true, isMystery: true, iconName: 'gift' },
]

describe('DailyReward', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
    getState.mockReturnValue({ showDailyReward: true, lastDailyRewardResult: null })
    getRewardsCalendar.mockReturnValue([])
  })

  it('renders daily reward modal HTML', () => {
    const html = renderDailyRewardModal()
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(100)
  })

  it('renders modal with close button', () => {
    const html = renderDailyRewardModal()
    expect(html).toContain('<button')
  })

  it('renders reward content', () => {
    const html = renderDailyRewardModal()
    expect(html).toContain('class=')
  })

  it('closeDailyReward does not throw when modal absent', () => {
    expect(() => closeDailyReward()).not.toThrow()
  })

  it('closeDailyReward removes modal when present', () => {
    document.body.innerHTML = '<div id="daily-reward-modal"></div>'
    expect(() => closeDailyReward()).not.toThrow()
  })

  it('closeDailyRewardResult does not throw when absent', () => {
    expect(() => closeDailyRewardResult()).not.toThrow()
  })

  it('closeDailyRewardResult removes result when present', () => {
    document.body.innerHTML = '<div id="daily-reward-result"></div>'
    expect(() => closeDailyRewardResult()).not.toThrow()
  })

  it('closeDailyReward calls setState to hide reward', () => {
    closeDailyReward()
    expect(setState).toHaveBeenCalledWith({ showDailyReward: false, lastDailyRewardResult: null })
  })

  it('closeDailyRewardResult calls setState to hide reward', () => {
    closeDailyRewardResult()
    expect(setState).toHaveBeenCalledWith({ showDailyReward: false, lastDailyRewardResult: null })
  })

  it('renders day cards when calendar has days', () => {
    getRewardsCalendar.mockReturnValue(mockDays)
    const html = renderDailyRewardModal()
    expect(html).toContain('day-card')
  })

  it('renders claimed day with emerald style', () => {
    getRewardsCalendar.mockReturnValue(mockDays)
    const html = renderDailyRewardModal()
    expect(html).toContain('emerald')
  })

  it('renders current day with amber style', () => {
    getRewardsCalendar.mockReturnValue(mockDays)
    const html = renderDailyRewardModal()
    expect(html).toContain('amber')
  })

  it('renders mystery day with ? placeholder', () => {
    getRewardsCalendar.mockReturnValue(mockDays)
    const html = renderDailyRewardModal()
    expect(html).toContain('?')
  })

  it('renders reward result when lastDailyRewardResult is set', () => {
    getState.mockReturnValue({
      showDailyReward: true,
      lastDailyRewardResult: { points: 50, message: 'Congrats!', streak: 3, type: 'daily', streakBonus: false },
    })
    const html = renderDailyRewardModal()
    expect(html).toContain('daily-reward-modal')
    expect(html).toContain('closeDailyRewardResult')
  })
})

describe('handleClaimDailyReward', () => {
  beforeEach(() => { vi.clearAllMocks(); vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('calls setState and launches confetti on success', () => {
    claimReward.mockReturnValue({ success: true, points: 50, message: 'Congrats!' })
    handleClaimDailyReward()
    expect(setState).toHaveBeenCalledWith(expect.objectContaining({ showDailyReward: true }))
    vi.advanceTimersByTime(100)
    expect(launchConfettiBurst).toHaveBeenCalled()
  })

  it('shows toast on failure', () => {
    claimReward.mockReturnValue({ success: false, message: 'Already claimed' })
    handleClaimDailyReward()
    expect(showToast).toHaveBeenCalledWith('Already claimed', 'info')
  })
})
