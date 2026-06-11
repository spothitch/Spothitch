import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg data-icon="${name}"></svg>`),
}))
vi.mock('../../src/services/guardian.js', () => ({
  isGuardianActive: vi.fn(() => false),
  getTimeUntilNextCheckIn: vi.fn(() => 1500),
}))

import { renderHeader } from '../../src/components/Header.js'
import { isGuardianActive, getTimeUntilNextCheckIn } from '../../src/services/guardian.js'

describe('renderHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    isGuardianActive.mockReturnValue(false)
    getTimeUntilNextCheckIn.mockReturnValue(1500)
  })

  it('renders basic header structure', () => {
    const html = renderHeader({})
    expect(html).toContain('role="banner"')
    expect(html).toContain('logo.png')
    expect(html).toContain('openSOS()')
    expect(html).toContain('SOS')
  })

  it('renders guardian button (inactive)', () => {
    const html = renderHeader({})
    expect(html).toContain('showGuardianModal()')
  })

  it('renders admin button when isAdmin true', () => {
    const html = renderHeader({ isAdmin: true })
    expect(html).toContain('openAdminPanel()')
  })

  it('does not render admin button when not admin', () => {
    const html = renderHeader({ isAdmin: false })
    expect(html).not.toContain('openAdminPanel()')
  })

  it('renders admin badge with pending report count', () => {
    const html = renderHeader({
      isAdmin: true,
      adminReportsData: [
        { id: 'r1', status: 'pending' },
        { id: 'r2', status: 'resolved' },
      ],
    })
    expect(html).toContain('openAdminPanel()')
    expect(html).toContain('1')
  })

  it('renders offline indicator when isOnline is false', () => {
    const html = renderHeader({ isOnline: false })
    expect(html).toContain('offlineMode')
  })

  it('does not render offline indicator when online', () => {
    const html = renderHeader({ isOnline: true })
    expect(html).not.toContain('offlineMode')
  })

  it('renders guardian active button with countdown', () => {
    isGuardianActive.mockReturnValue(true)
    getTimeUntilNextCheckIn.mockReturnValue(1500) // 25 minutes
    const html = renderHeader({})
    expect(html).toContain('guardian-header-btn')
    expect(html).toContain('guardianBtnDown()')
    expect(html).toContain('25:00')
  })

  it('renders overdue guardian button when time negative', () => {
    isGuardianActive.mockReturnValue(true)
    getTimeUntilNextCheckIn.mockReturnValue(-300) // -5 minutes overdue
    const html = renderHeader({})
    expect(html).toContain('guardian-header-btn')
    expect(html).toContain('-05:00')
    expect(html).toContain('animate-pulse-subtle')
  })

  it('renders SOS button always', () => {
    const html = renderHeader({})
    expect(html).toContain('openSOS()')
  })

  it('renders header with admin + guardian active + offline', () => {
    isGuardianActive.mockReturnValue(true)
    getTimeUntilNextCheckIn.mockReturnValue(900)
    const html = renderHeader({ isAdmin: true, isOnline: false })
    expect(html).toContain('openAdminPanel()')
    expect(html).toContain('guardian-header-btn')
    expect(html).toContain('offlineMode')
  })
})
