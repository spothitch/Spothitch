import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))
vi.mock('../../src/utils/icons.js', () => ({
  icon: vi.fn((name) => `<svg data-icon="${name}"></svg>`),
}))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeHTML: vi.fn((s) => String(s || '')),
  escapeJSString: vi.fn((s) => String(s || '')),
}))
vi.mock('../../src/services/communityAlert.js', () => ({
  getCommunityAlertSettings: vi.fn(() => ({
    receiveAlerts: true,
    radius: 10,
  })),
}))

import { renderSOS } from '../../src/components/modals/SOS.js'

describe('renderSOS', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders intro screen when intro not yet seen', () => {
    // localStorage is clear → intro not seen
    const html = renderSOS({})
    expect(html).toContain('role="dialog"')
    expect(html).toContain('acceptSOSIntro()')
    expect(html).toContain('sosPrepareTitle')
  })

  it('renders main SOS modal when intro has been seen', () => {
    localStorage.setItem('spothitch_sos_intro_seen', '1')
    const html = renderSOS({})
    expect(html).toContain('role="alertdialog"')
    expect(html).toContain('sos-modal-title')
    expect(html).toContain('closeSOS()')
  })

  it('renders main modal with emergency contacts', () => {
    localStorage.setItem('spothitch_sos_intro_seen', '1')
    const html = renderSOS({
      emergencyContacts: [
        { name: 'Maman', phone: '+33600000000' },
        { name: 'Paul', phone: '+33611111111' },
      ],
    })
    expect(html).toContain('role="alertdialog"')
    expect(html).toContain('Maman')
  })

  it('renders main modal with no contacts', () => {
    localStorage.setItem('spothitch_sos_intro_seen', '1')
    const html = renderSOS({ emergencyContacts: [] })
    expect(html).toContain('sosNoContacts')
  })

  it('renders alerts tab and config tab buttons', () => {
    localStorage.setItem('spothitch_sos_intro_seen', '1')
    const html = renderSOS({})
    expect(html).toContain('sosTab(0)')
    expect(html).toContain('sosTab(1)')
  })

  it('renders SOS share location button', () => {
    localStorage.setItem('spothitch_sos_intro_seen', '1')
    const html = renderSOS({})
    expect(html).toContain('shareSOSLocation()')
  })

  it('renders fake call button', () => {
    localStorage.setItem('spothitch_sos_intro_seen', '1')
    const html = renderSOS({})
    expect(html).toContain('sosOpenFakeCall()')
  })

  it('renders intro with all feature rows', () => {
    const html = renderSOS({})
    expect(html).toContain('sosFakeCall')
    expect(html).toContain('sosTripleAlert')
    expect(html).toContain('sosCommunity')
    expect(html).toContain('sosEvidence')
    expect(html).toContain('sosEmergency')
  })

  it('renders config section when intro seen', () => {
    localStorage.setItem('spothitch_sos_intro_seen', '1')
    const html = renderSOS({})
    expect(html).toContain('sosTabConfig')
  })

  it('renders recording button in main modal', () => {
    localStorage.setItem('spothitch_sos_intro_seen', '1')
    const html = renderSOS({})
    expect(html).toContain("sosStartRecording('audio')")
  })
})
