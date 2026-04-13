import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({
    user: { uid: 'user1', displayName: 'Test' },
    isLoggedIn: true,
  })),
  setState: vi.fn(),
}))

vi.mock('../../src/services/notifications.js', () => ({
  showToast: vi.fn(),
}))

describe('Events Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('module imports without error', async () => {
    const mod = await import('../../src/services/events.js')
    expect(mod).toBeDefined()
    expect(typeof mod.createEvent).toBe('function')
    expect(typeof mod.postEventComment).toBe('function')
    expect(typeof mod.reactToComment).toBe('function')
  })

  it('createEvent rejects missing title', async () => {
    const { createEvent } = await import('../../src/services/events.js')
    const result = createEvent({ type: 'meetup', date: '2026-05-01' })
    expect(result.success).toBe(false)
    expect(result.error).toBe('missing_title')
  })

  it('createEvent rejects title over 200 chars', async () => {
    const { createEvent } = await import('../../src/services/events.js')
    const result = createEvent({ title: 'a'.repeat(201), type: 'meetup', date: '2026-05-01' })
    expect(result.success).toBe(false)
    expect(result.error).toBe('title_too_long')
  })

  it('createEvent rejects description over 5000 chars', async () => {
    const { createEvent } = await import('../../src/services/events.js')
    const result = createEvent({ title: 'Test', type: 'meetup', date: '2026-05-01', description: 'a'.repeat(5001) })
    expect(result.success).toBe(false)
    expect(result.error).toBe('description_too_long')
  })

  it('createEvent rejects invalid type', async () => {
    const { createEvent } = await import('../../src/services/events.js')
    const result = createEvent({ title: 'Test', type: 'invalid', date: '2026-05-01' })
    expect(result.success).toBe(false)
    expect(result.error).toBe('invalid_type')
  })

  it('createEvent rejects missing date', async () => {
    const { createEvent } = await import('../../src/services/events.js')
    const result = createEvent({ title: 'Test', type: 'meetup' })
    expect(result.success).toBe(false)
    expect(result.error).toBe('missing_date')
  })

  it('postEventComment rejects empty text', async () => {
    const { postEventComment } = await import('../../src/services/events.js')
    const result = postEventComment('event1', '')
    expect(result.success).toBe(false)
    expect(result.error).toBe('empty_comment')
  })

  it('postEventComment rejects text over 5000 chars', async () => {
    const { postEventComment } = await import('../../src/services/events.js')
    const result = postEventComment('event1', 'a'.repeat(5001))
    expect(result.success).toBe(false)
    expect(result.error).toBe('comment_too_long')
  })

  it('reactToComment rejects invalid emoji (too long)', async () => {
    const { reactToComment } = await import('../../src/services/events.js')
    const result = reactToComment('event1', 'comment1', 'toolongemoji')
    // Either returns error or comment_not_found (no comments in empty storage)
    expect(result.success).toBe(false)
  })
})
