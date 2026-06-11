import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
}))

import { renderAdminPanel } from '../../src/components/modals/AdminPanel.js'

const base = { adminActiveTab: 'feedback' }

const mockFeedbacks = [
  { id: 'f1', userId: 'u1', featureId: 'create-spot', rating: 5, comment: 'Super!', ts: Date.now() },
  { id: 'f2', userId: 'u2', featureId: 'search-city', rating: 3, comment: 'OK', ts: Date.now() - 86400000 },
]

const mockReports = [
  { id: 'r1', type: 'spam', spotId: 's1', userId: 'u1', ts: Date.now(), status: 'pending' },
  { id: 'r2', type: 'inappropriate', spotId: 's2', userId: 'u2', ts: Date.now(), status: 'resolved' },
]

const mockGuideTips = [
  { id: 'gt1', country: 'FR', userId: 'u1', text: 'Bons endroits à Paris.', ts: Date.now(), status: 'pending' },
]

const mockSentryErrors = [
  { id: 'e1', title: 'TypeError in renderSpot', count: 5, ts: Date.now() },
]

const mockIdRequests = [
  { id: 'ir1', userId: 'u1', documentType: 'passport', status: 'pending', ts: Date.now() },
]

describe('renderAdminPanel', () => {
  it('renders feedback tab (default)', () => {
    const html = renderAdminPanel(base)
    expect(html).toContain('role="dialog"')
    expect(html).toContain('Panneau Admin')
  })

  it('renders feedback tab with data', () => {
    const html = renderAdminPanel({ ...base, adminActiveTab: 'feedback', feedbacks: mockFeedbacks })
    expect(html).toBeTruthy()
  })

  it('renders feedback tab empty', () => {
    const html = renderAdminPanel({ ...base, adminActiveTab: 'feedback', feedbacks: [] })
    expect(html).toBeTruthy()
  })

  it('renders reports tab with data', () => {
    const html = renderAdminPanel({ ...base, adminActiveTab: 'reports', reports: mockReports })
    expect(html).toBeTruthy()
  })

  it('renders reports tab empty', () => {
    const html = renderAdminPanel({ ...base, adminActiveTab: 'reports', reports: [] })
    expect(html).toBeTruthy()
  })

  it('renders reports tab with filter', () => {
    const html = renderAdminPanel({
      ...base,
      adminActiveTab: 'reports',
      reports: mockReports,
      reportsFilter: 'pending',
    })
    expect(html).toBeTruthy()
  })

  it('renders guideTips tab with data', () => {
    const html = renderAdminPanel({ ...base, adminActiveTab: 'guideTips', pendingGuideTips: mockGuideTips })
    expect(html).toBeTruthy()
  })

  it('renders guideTips tab empty', () => {
    const html = renderAdminPanel({ ...base, adminActiveTab: 'guideTips', pendingGuideTips: [] })
    expect(html).toBeTruthy()
  })

  it('renders sentry tab with errors', () => {
    const html = renderAdminPanel({ ...base, adminActiveTab: 'sentry', sentryErrors: mockSentryErrors })
    expect(html).toBeTruthy()
  })

  it('renders sentry tab empty', () => {
    const html = renderAdminPanel({ ...base, adminActiveTab: 'sentry', sentryErrors: [] })
    expect(html).toBeTruthy()
  })

  it('renders tools tab', () => {
    const html = renderAdminPanel({ ...base, adminActiveTab: 'tools' })
    expect(html).toBeTruthy()
  })

  it('renders idVerify tab with requests', () => {
    const html = renderAdminPanel({ ...base, adminActiveTab: 'idVerify', idVerifyRequests: mockIdRequests })
    expect(html).toBeTruthy()
  })

  it('renders idVerify tab empty', () => {
    const html = renderAdminPanel({ ...base, adminActiveTab: 'idVerify', idVerifyRequests: [] })
    expect(html).toBeTruthy()
  })

  it('renders tab navigation buttons', () => {
    const html = renderAdminPanel(base)
    expect(html).toContain("setAdminTab('feedback')")
    expect(html).toContain("setAdminTab('reports')")
    expect(html).toContain("setAdminTab('tools')")
  })
})
