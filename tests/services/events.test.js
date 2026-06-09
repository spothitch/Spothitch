import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({
    user: { uid: 'user1', displayName: 'Test' },
    username: 'TestUser',
    avatar: 'thumbs-up',
    isLoggedIn: true,
  })),
  setState: vi.fn(),
}))

vi.mock('../../src/services/notifications.js', () => ({
  showToast: vi.fn(),
}))

vi.mock('../../src/i18n/index.js', () => ({
  t: vi.fn((key) => key),
}))

import {
  createEvent,
  getUpcomingEvents,
  getPastEvents,
  getEventById,
  joinEvent,
  leaveEvent,
  postEventComment,
  reactToComment,
  EVENT_TYPES,
} from '../../src/services/events.js'

// Storage keys used by events.js (Storage module uses spothitch_v4_ prefix + JSON.stringify)
const PREFIX = 'spothitch_v4_'
function setStorage(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value))
}
function clearStorage(key) {
  localStorage.removeItem(PREFIX + key)
}

// Set account as old enough (>24h) for createEvent to work
function setAccountOldEnough() {
  setStorage('spothitch_account_created', new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString())
}

function storeEvents(events) {
  setStorage('spothitch_events', events)
}

describe('Events Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('EVENT_TYPES', () => {
    it('defines meetup type', () => {
      expect(EVENT_TYPES.meetup).toBeDefined()
      expect(EVENT_TYPES.meetup.id).toBe('meetup')
    })

    it('defines group_departure type', () => {
      expect(EVENT_TYPES.group_departure).toBeDefined()
    })

    it('defines hostel_party type', () => {
      expect(EVENT_TYPES.hostel_party).toBeDefined()
    })

    it('defines tips_exchange type', () => {
      expect(EVENT_TYPES.tips_exchange).toBeDefined()
    })

    it('each type has iconName, color, bg properties', () => {
      for (const type of Object.values(EVENT_TYPES)) {
        expect(type.iconName).toBeDefined()
        expect(type.color).toBeDefined()
        expect(type.bg).toBeDefined()
      }
    })
  })

  describe('createEvent - validation', () => {
    it('rejects missing title', () => {
      const result = createEvent({ type: 'meetup', date: '2026-05-01' })
      expect(result.success).toBe(false)
      expect(result.error).toBe('missing_title')
    })

    it('rejects empty title', () => {
      const result = createEvent({ title: '   ', type: 'meetup', date: '2026-05-01' })
      expect(result.success).toBe(false)
      expect(result.error).toBe('missing_title')
    })

    it('rejects title over 200 chars', () => {
      const result = createEvent({ title: 'a'.repeat(201), type: 'meetup', date: '2026-05-01' })
      expect(result.success).toBe(false)
      expect(result.error).toBe('title_too_long')
    })

    it('rejects description over 5000 chars', () => {
      const result = createEvent({ title: 'Test', type: 'meetup', date: '2026-05-01', description: 'a'.repeat(5001) })
      expect(result.success).toBe(false)
      expect(result.error).toBe('description_too_long')
    })

    it('rejects invalid type', () => {
      const result = createEvent({ title: 'Test', type: 'invalid', date: '2026-05-01' })
      expect(result.success).toBe(false)
      expect(result.error).toBe('invalid_type')
    })

    it('rejects missing date', () => {
      const result = createEvent({ title: 'Test', type: 'meetup' })
      expect(result.success).toBe(false)
      expect(result.error).toBe('missing_date')
    })

    it('rejects account too new', () => {
      // No account_created date set → new account
      const result = createEvent({ title: 'Test', type: 'meetup', date: '2026-07-01' })
      expect(result.success).toBe(false)
      expect(result.error).toBe('account_too_new')
    })
  })

  describe('createEvent - success', () => {
    beforeEach(() => {
      setAccountOldEnough()
    })

    it('returns success=true with valid data', () => {
      const result = createEvent({ title: 'Paris Meetup', type: 'meetup', date: '2099-07-01' })
      expect(result.success).toBe(true)
    })

    it('returns event object with id', () => {
      const result = createEvent({ title: 'Meetup', type: 'meetup', date: '2099-07-01' })
      expect(result.event).toBeDefined()
      expect(result.event.id).toMatch(/^event_/)
    })

    it('event has correct title', () => {
      const result = createEvent({ title: '  Berlin Trip  ', type: 'meetup', date: '2099-07-01' })
      expect(result.event.title).toBe('Berlin Trip')
    })

    it('event has correct type', () => {
      const result = createEvent({ title: 'Test', type: 'group_departure', date: '2099-07-01' })
      expect(result.event.type).toBe('group_departure')
    })

    it('event has participants array with creator', () => {
      const result = createEvent({ title: 'Test', type: 'meetup', date: '2099-07-01' })
      expect(result.event.participants).toContain('user1')
    })

    it('event persists to storage', () => {
      createEvent({ title: 'Test Event', type: 'meetup', date: '2099-07-01' })
      const upcoming = getUpcomingEvents()
      expect(upcoming.some(e => e.title === 'Test Event')).toBe(true)
    })
  })

  describe('getUpcomingEvents', () => {
    it('returns empty array when no events', () => {
      const result = getUpcomingEvents()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(0)
    })

    it('returns only future events', () => {
      const pastDate = '2020-01-01'
      const futureDate = '2099-12-31'
      storeEvents([
        { id: '1', date: pastDate, title: 'Past', type: 'meetup' },
        { id: '2', date: futureDate, title: 'Future', type: 'meetup' },
      ])
      const result = getUpcomingEvents()
      expect(result.length).toBe(1)
      expect(result[0].title).toBe('Future')
    })

    it('sorts by date ascending', () => {
      storeEvents([
        { id: '1', date: '2099-12-31', title: 'Later', type: 'meetup' },
        { id: '2', date: '2099-07-01', title: 'Sooner', type: 'meetup' },
      ])
      const result = getUpcomingEvents()
      expect(result[0].title).toBe('Sooner')
      expect(result[1].title).toBe('Later')
    })

    it('filters by type when provided', () => {
      storeEvents([
        { id: '1', date: '2099-07-01', title: 'Meetup1', type: 'meetup' },
        { id: '2', date: '2099-07-01', title: 'Party1', type: 'hostel_party' },
      ])
      const result = getUpcomingEvents({ type: 'meetup' })
      expect(result.length).toBe(1)
      expect(result[0].type).toBe('meetup')
    })

    it('filters by visibility when provided', () => {
      storeEvents([
        { id: '1', date: '2099-07-01', title: 'Public', type: 'meetup', visibility: 'public' },
        { id: '2', date: '2099-07-01', title: 'Private', type: 'meetup', visibility: 'private' },
      ])
      const result = getUpcomingEvents({ visibility: 'public' })
      expect(result.length).toBe(1)
      expect(result[0].title).toBe('Public')
    })
  })

  describe('getPastEvents', () => {
    it('returns empty array when no events', () => {
      expect(getPastEvents()).toEqual([])
    })

    it('returns only past events', () => {
      storeEvents([
        { id: '1', date: '2020-01-01', title: 'Past', type: 'meetup' },
        { id: '2', date: '2099-12-31', title: 'Future', type: 'meetup' },
      ])
      const result = getPastEvents()
      expect(result.length).toBe(1)
      expect(result[0].title).toBe('Past')
    })

    it('sorts by date descending (most recent first)', () => {
      storeEvents([
        { id: '1', date: '2019-01-01', title: 'Older', type: 'meetup' },
        { id: '2', date: '2023-01-01', title: 'Newer', type: 'meetup' },
      ])
      const result = getPastEvents()
      expect(result[0].title).toBe('Newer')
    })
  })

  describe('getEventById', () => {
    it('returns null for unknown event', () => {
      expect(getEventById('nonexistent')).toBeNull()
    })

    it('returns the event when found', () => {
      storeEvents([{ id: 'event_abc', date: '2099-07-01', title: 'Found', type: 'meetup' }])
      const event = getEventById('event_abc')
      expect(event).not.toBeNull()
      expect(event.title).toBe('Found')
    })

    it('returns null when storage is empty', () => {
      expect(getEventById('anything')).toBeNull()
    })
  })

  describe('joinEvent', () => {
    it('returns error for unknown event', () => {
      const result = joinEvent('nonexistent')
      expect(result.success).toBe(false)
      expect(result.error).toBe('event_not_found')
    })

    it('returns error when already joined', () => {
      storeEvents([{
        id: 'ev1',
        date: '2099-07-01',
        type: 'meetup',
        participants: ['user1'],
        participantNames: {},
        participantAvatars: {},
      }])
      const result = joinEvent('ev1')
      expect(result.success).toBe(false)
      expect(result.error).toBe('already_joined')
    })

    it('joins successfully when not already a participant', () => {
      storeEvents([{
        id: 'ev2',
        date: '2099-07-01',
        type: 'meetup',
        participants: ['other-user'],
        participantNames: {},
        participantAvatars: {},
      }])
      const result = joinEvent('ev2')
      expect(result.success).toBe(true)
    })

    it('adds user to participants after joining', () => {
      storeEvents([{
        id: 'ev3',
        date: '2099-07-01',
        type: 'meetup',
        participants: ['other-user'],
        participantNames: {},
        participantAvatars: {},
      }])
      joinEvent('ev3')
      const event = getEventById('ev3')
      expect(event.participants).toContain('user1')
    })
  })

  describe('leaveEvent', () => {
    it('returns error for unknown event', () => {
      const result = leaveEvent('nonexistent')
      expect(result.success).toBe(false)
      expect(result.error).toBe('event_not_found')
    })

    it('returns error when creator tries to leave', () => {
      storeEvents([{
        id: 'ev1',
        date: '2099-07-01',
        type: 'meetup',
        creatorId: 'user1',
        participants: ['user1'],
        participantNames: {},
        participantAvatars: {},
      }])
      const result = leaveEvent('ev1')
      expect(result.success).toBe(false)
      expect(result.error).toBe('creator_cannot_leave')
    })

    it('leaves successfully as non-creator participant', () => {
      storeEvents([{
        id: 'ev2',
        date: '2099-07-01',
        type: 'meetup',
        creatorId: 'other-user',
        participants: ['other-user', 'user1'],
        participantNames: { 'user1': 'TestUser' },
        participantAvatars: { 'user1': 'thumbs-up' },
      }])
      const result = leaveEvent('ev2')
      expect(result.success).toBe(true)
    })

    it('removes user from participants after leaving', () => {
      storeEvents([{
        id: 'ev3',
        date: '2099-07-01',
        type: 'meetup',
        creatorId: 'other-user',
        participants: ['other-user', 'user1'],
        participantNames: { 'user1': 'TestUser' },
        participantAvatars: {},
      }])
      leaveEvent('ev3')
      const event = getEventById('ev3')
      expect(event.participants).not.toContain('user1')
    })
  })

  describe('postEventComment', () => {
    it('rejects empty text', () => {
      const result = postEventComment('event1', '')
      expect(result.success).toBe(false)
      expect(result.error).toBe('empty_comment')
    })

    it('rejects text over 5000 chars', () => {
      const result = postEventComment('event1', 'a'.repeat(5001))
      expect(result.success).toBe(false)
      expect(result.error).toBe('comment_too_long')
    })
  })

  describe('reactToComment', () => {
    it('rejects invalid emoji (too long)', () => {
      const result = reactToComment('event1', 'comment1', 'toolongemoji')
      expect(result.success).toBe(false)
    })
  })

  it('module imports without error', () => {
    expect(EVENT_TYPES).toBeDefined()
    expect(typeof createEvent).toBe('function')
    expect(typeof getUpcomingEvents).toBe('function')
    expect(typeof joinEvent).toBe('function')
  })
})
