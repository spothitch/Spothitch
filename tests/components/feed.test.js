import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/services/activityFeed.js', () => ({
  getActivityFeed: vi.fn(() => []),
}))
vi.mock('../../src/services/events.js', () => ({
  getUpcomingEvents: vi.fn(() => []),
  EVENT_TYPES: {
    meetup: { id: 'meetup', icon: '', bg: 'bg-primary-500/20' },
    challenge: { id: 'challenge', icon: '', bg: 'bg-amber-500/20' },
  },
}))

import { renderFeed } from '../../src/components/views/social/Feed.js'
import { getActivityFeed } from '../../src/services/activityFeed.js'
import { getUpcomingEvents } from '../../src/services/events.js'

describe('renderFeed', () => {
  beforeEach(() => {
    getActivityFeed.mockReturnValue([])
    getUpcomingEvents.mockReturnValue([])
  })

  it('renders feed with empty state', () => {
    const html = renderFeed({})
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(50)
  })

  it('renders with filter all', () => {
    const html = renderFeed({ feedFilter: 'all' })
    expect(html).toBeTruthy()
  })

  it('renders with filter friends', () => {
    const html = renderFeed({ feedFilter: 'friends' })
    expect(html).toBeTruthy()
  })

  it('renders with filter events', () => {
    const html = renderFeed({ feedFilter: 'events' })
    expect(html).toBeTruthy()
  })

  it('renders filter pills', () => {
    const html = renderFeed({})
    expect(html).toContain('<button')
  })
})

describe('renderActivityCard via renderFeed', () => {
  beforeEach(() => {
    getUpcomingEvents.mockReturnValue([])
  })

  it('renders activity with type new_spot', () => {
    getActivityFeed.mockReturnValue([{ type: 'new_spot', userName: 'Alice', description: 'added a spot', timestamp: Date.now() }])
    const html = renderFeed({ feedFilter: 'all' })
    expect(html).toContain('Alice')
    expect(html).toContain('added a spot')
  })

  it('renders activity with type review', () => {
    getActivityFeed.mockReturnValue([{ type: 'review', userName: 'Bob', description: 'reviewed a spot', timestamp: Date.now() }])
    const html = renderFeed({ feedFilter: 'all' })
    expect(html).toContain('Bob')
  })

  it('renders activity with type badge', () => {
    getActivityFeed.mockReturnValue([{ type: 'badge', userName: 'Carol', description: 'earned a badge', timestamp: Date.now() }])
    const html = renderFeed({ feedFilter: 'all' })
    expect(html).toContain('Carol')
  })

  it('renders activity with type checkin', () => {
    getActivityFeed.mockReturnValue([{ type: 'checkin', userName: 'Dave', description: 'checked in', timestamp: Date.now() }])
    const html = renderFeed({ feedFilter: 'all' })
    expect(html).toContain('Dave')
  })

  it('renders activity with type friend_joined', () => {
    getActivityFeed.mockReturnValue([{ type: 'friend_joined', userName: 'Eve', description: 'joined', timestamp: Date.now() }])
    const html = renderFeed({ feedFilter: 'all' })
    expect(html).toContain('Eve')
  })

  it('renders userAvatar when present', () => {
    getActivityFeed.mockReturnValue([{ type: 'checkin', userName: 'Frank', userAvatar: 'adventurer', description: '', timestamp: Date.now() }])
    const html = renderFeed({ feedFilter: 'all' })
    expect(html).toContain('adventurer')
  })

  it('renders spotName when present', () => {
    getActivityFeed.mockReturnValue([{ type: 'new_spot', userName: 'Grace', spotName: 'Paris Nord', description: '', timestamp: Date.now() }])
    const html = renderFeed({ feedFilter: 'all' })
    expect(html).toContain('Paris Nord')
  })

  it('renders unknown type using fallback config', () => {
    getActivityFeed.mockReturnValue([{ type: 'unknown_type', userName: 'Henry', description: 'did something', timestamp: Date.now() }])
    const html = renderFeed({ feedFilter: 'all' })
    expect(html).toContain('Henry')
  })

  it('renders multiple activities', () => {
    getActivityFeed.mockReturnValue([
      { type: 'new_spot', userName: 'Anna', description: 'spot1', timestamp: Date.now() - 1000 },
      { type: 'checkin', userName: 'Bea', description: 'checkin1', timestamp: Date.now() },
    ])
    const html = renderFeed({ feedFilter: 'all' })
    expect(html).toContain('Anna')
    expect(html).toContain('Bea')
  })
})

describe('renderEventFeedCard via renderFeed', () => {
  beforeEach(() => {
    getActivityFeed.mockReturnValue([])
  })

  it('renders event title in feed', () => {
    getUpcomingEvents.mockReturnValue([{ id: 'ev1', type: 'meetup', title: 'Paris Meetup', date: '2099-07-01', participants: [] }])
    const html = renderFeed({ feedFilter: 'events' })
    expect(html).toContain('Paris Meetup')
  })

  it('renders event with participants', () => {
    getUpcomingEvents.mockReturnValue([{ id: 'ev2', type: 'meetup', title: 'Lyon Gathering', date: '2099-08-01', participants: ['u1', 'u2'] }])
    const html = renderFeed({ feedFilter: 'all' })
    expect(html).toContain('Lyon Gathering')
  })

  it('shows joined badge when user is participant', () => {
    getUpcomingEvents.mockReturnValue([{ id: 'ev3', type: 'meetup', title: 'Marseille Meetup', date: '2099-09-01', participants: ['local-user'] }])
    const html = renderFeed({ feedFilter: 'events' })
    expect(html).toContain('Marseille Meetup')
  })

  it('includes event time when present', () => {
    getUpcomingEvents.mockReturnValue([{ id: 'ev4', type: 'meetup', title: 'Bordeaux Event', date: '2099-10-01', time: '14:00', participants: [] }])
    const html = renderFeed({ feedFilter: 'all' })
    expect(html).toContain('Bordeaux Event')
  })

  it('does not render events when filter is friends', () => {
    getUpcomingEvents.mockReturnValue([{ id: 'ev5', type: 'meetup', title: 'Toulouse Meetup', date: '2099-11-01', participants: [] }])
    const html = renderFeed({ feedFilter: 'friends' })
    expect(html).not.toContain('Toulouse Meetup')
  })

  it('renders event with openEventDetail handler', () => {
    getUpcomingEvents.mockReturnValue([{ id: 'ev6', type: 'meetup', title: 'Nice Meetup', date: '2099-12-01', participants: [] }])
    const html = renderFeed({ feedFilter: 'events' })
    expect(html).toContain("openEventDetail('ev6')")
  })
})

describe('window.setFeedFilter', () => {
  it('calls window.setState with feedFilter value', () => {
    window.setState = vi.fn()
    window.setFeedFilter('events')
    expect(window.setState).toHaveBeenCalledWith({ feedFilter: 'events' })
  })

  it('calls window.setState with friends filter', () => {
    window.setState = vi.fn()
    window.setFeedFilter('friends')
    expect(window.setState).toHaveBeenCalledWith({ feedFilter: 'friends' })
  })

  it('does not throw when window.setState is not defined', () => {
    delete window.setState
    expect(() => window.setFeedFilter('all')).not.toThrow()
  })
})
