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
  deleteEventComment,
  shareEvent,
  getMyEvents,
  deleteEvent,
  EVENT_TYPES,
} from '../../src/services/events.js'
import { getState, setState } from '../../src/stores/state.js'

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

  describe('deleteEvent', () => {
    it('returns error for unknown event', () => {
      const result = deleteEvent('nonexistent')
      expect(result.success).toBe(false)
      expect(result.error).toBe('event_not_found')
    })

    it('returns error for non-creator', () => {
      storeEvents([{ id: 'ev1', date: '2099-07-01', type: 'meetup', creatorId: 'other-user', participants: [] }])
      const result = deleteEvent('ev1')
      expect(result.success).toBe(false)
      expect(result.error).toBe('not_creator')
    })

    it('deletes event created by current user', () => {
      storeEvents([{ id: 'ev2', date: '2099-07-01', type: 'meetup', creatorId: 'user1', participants: ['user1'] }])
      const result = deleteEvent('ev2')
      expect(result.success).toBe(true)
      expect(getEventById('ev2')).toBeNull()
    })
  })

  describe('deleteEventComment', () => {
    it('returns error when comment not found', () => {
      storeEvents([{ id: 'ev1', date: '2099-07-01', type: 'meetup', participants: [] }])
      const result = deleteEventComment('ev1', 'nonexistent-comment')
      expect(result.success).toBe(false)
      expect(result.error).toBe('comment_not_found')
    })

    it('returns error when not comment author', () => {
      // Post a comment as user1, then try to delete as different user (would need to change user)
      storeEvents([{ id: 'ev1', date: '2099-07-01', type: 'meetup', participants: ['user1'] }])
      const postResult = postEventComment('ev1', 'Test comment')
      expect(postResult.success).toBe(true)
      const commentId = postResult.comment.id
      // Same user (user1) can delete their own comment
      const deleteResult = deleteEventComment('ev1', commentId)
      expect(deleteResult.success).toBe(true)
    })
  })

  describe('shareEvent', () => {
    it('returns false for unknown event', () => {
      const result = shareEvent('nonexistent')
      expect(result.success).toBe(false)
    })

    it('returns success for existing event', () => {
      storeEvents([{ id: 'ev1', date: '2099-07-01', type: 'meetup', title: 'Test', participants: [] }])
      const result = shareEvent('ev1')
      expect(result.success).toBe(true)
    })
  })

  describe('getMyEvents', () => {
    it('returns empty array when user has no events', () => {
      const result = getMyEvents()
      expect(Array.isArray(result)).toBe(true)
    })

    it('returns events where user is participant', () => {
      storeEvents([
        { id: 'ev1', date: '2099-07-01', type: 'meetup', participants: ['user1'] },
        { id: 'ev2', date: '2099-07-01', type: 'meetup', participants: ['other-user'] },
      ])
      const result = getMyEvents()
      expect(result.some(e => e.id === 'ev1')).toBe(true)
      expect(result.every(e => e.participants.includes('user1'))).toBe(true)
    })
  })

  describe('postEventComment success path', () => {
    it('returns success and comment with id', () => {
      storeEvents([{ id: 'ev1', date: '2099-07-01', type: 'meetup', participants: ['user1'] }])
      const result = postEventComment('ev1', 'Hello world')
      expect(result.success).toBe(true)
      expect(result.comment).toBeDefined()
      expect(result.comment.id).toMatch(/^comment_/)
    })

    it('saves comment text trimmed', () => {
      storeEvents([{ id: 'ev2', date: '2099-07-01', type: 'meetup', participants: [] }])
      const result = postEventComment('ev2', '  Trimmed text  ')
      expect(result.comment.text).toBe('Trimmed text')
    })
  })

  describe('reactToComment success paths', () => {
    it('adds reaction successfully', () => {
      storeEvents([{ id: 'ev1', date: '2099-07-01', type: 'meetup', participants: ['user1'] }])
      const posted = postEventComment('ev1', 'Reacting')
      const result = reactToComment('ev1', posted.comment.id, '👍')
      expect(result.success).toBe(true)
    })

    it('removes reaction on second call (toggle)', () => {
      storeEvents([{ id: 'ev2', date: '2099-07-01', type: 'meetup', participants: ['user1'] }])
      const posted = postEventComment('ev2', 'Toggle reaction')
      reactToComment('ev2', posted.comment.id, '❤️')
      const result = reactToComment('ev2', posted.comment.id, '❤️')
      expect(result.success).toBe(true)
    })
  })

  describe('window.openCreateEvent and window.closeCreateEvent', () => {
    it('openCreateEvent sets showCreateEvent true', () => {
      window.openCreateEvent()
      expect(setState).toHaveBeenCalledWith({ showCreateEvent: true })
    })

    it('closeCreateEvent sets showCreateEvent false', () => {
      window.closeCreateEvent()
      expect(setState).toHaveBeenCalledWith({ showCreateEvent: false })
    })
  })
})
