import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockTrips } from '../mocks/mockSpots.js'

vi.mock('../../src/services/tripJournal.js', () => ({
  getTrips: vi.fn(() => mockTrips),
  getTrip: vi.fn((id) => mockTrips.find(t => t.id === id) || null),
  getLegsByDay: vi.fn(() => [
    { date: '2026-03-01', legs: [mockTrips[0].legs[0]] }
  ]),
  getTripStats: vi.fn(() => ({
    totalDays: 7,
    totalDistance: 465,
    legCount: 1,
    rides: 1,
    hitchhikeLegs: 1,
    totalWait: 25,
    successRate: 100,
    totalExpenses: 12.5,
    estimatedSavings: 45,
    expByCategory: { food: 12.5, transport: 0, accommodation: 0, activity: 0, other: 0 },
  })),
  EXPENSE_CATEGORIES: ['food', 'transport', 'accommodation', 'activity', 'other'],
}))

import { renderJournal } from '../../src/components/views/Journal.js'

const baseState = {
  trips: mockTrips,
  user: { uid: 'user-abc123', username: 'TestUser' },
}

describe('renderJournal', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
  })

  it('renders trip list with real trips', () => {
    const html = renderJournal({ ...baseState, journalView: 'list' })
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(50)
  })

  it('renders empty trip list', () => {
    const html = renderJournal({ ...baseState, trips: [], journalView: 'list' })
    expect(html).toBeTruthy()
  })

  it('renders new-trip form', () => {
    const html = renderJournal({ ...baseState, journalView: 'new-trip' })
    expect(html).toBeTruthy()
    expect(html).toContain('<button')
  })

  it('renders trip detail with real trip', () => {
    const html = renderJournal({ ...baseState, journalView: 'detail', journalTripId: 'trip-1' })
    expect(html).toBeTruthy()
  })

  it('renders trip detail without valid tripId', () => {
    const html = renderJournal({ ...baseState, journalView: 'detail', journalTripId: 'nonexistent' })
    expect(html).toBeTruthy()
  })

  it('renders add-leg form', () => {
    const html = renderJournal({ ...baseState, journalView: 'add-leg', journalTripId: 'trip-1' })
    expect(html).toBeTruthy()
    expect(html).toContain('<button')
  })

  it('renders expenses view with real data', () => {
    const html = renderJournal({ ...baseState, journalView: 'expenses', journalTripId: 'trip-1' })
    expect(html).toBeTruthy()
  })

  it('renders day-note view', () => {
    const html = renderJournal({ ...baseState, journalView: 'day-note', journalTripId: 'trip-1', journalSelectedDay: '2026-03-01' })
    expect(html).toBeTruthy()
  })

  it('renders trip stats with real data', () => {
    const html = renderJournal({ ...baseState, journalView: 'stats', journalTripId: 'trip-1' })
    expect(html).toBeTruthy()
  })

  it('renders spot overlay with real spot data', () => {
    const html = renderJournal({
      ...baseState,
      journalSpotOverlay: { id: 's1', name: 'Test spot', lat: 48.8, lng: 2.3, from: 'Paris', to: 'Lyon' }
    })
    expect(html).toBeTruthy()
  })

  it('renders public trip view with legs', () => {
    const html = renderJournal({
      publicTripView: { ...mockTrips[0], legs: mockTrips[0].legs }
    })
    expect(html).toBeTruthy()
  })

  it('renders default view (list) when view unknown', () => {
    const html = renderJournal({ ...baseState, journalView: 'unknown-view' })
    expect(html).toBeTruthy()
  })
})
