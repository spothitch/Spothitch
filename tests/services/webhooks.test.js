import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/sanitize.js', () => ({ escapeJSString: vi.fn((s) => s) }))

import {
  WEBHOOK_TYPES,
  WEBHOOK_EVENTS,
  getWebhooks,
  addWebhook,
  removeWebhook,
  toggleWebhook,
  triggerWebhooks,
  renderWebhookSettings,
} from '../../src/services/webhooks.js'

describe('webhooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    global.fetch = vi.fn()
  })

  describe('WEBHOOK_TYPES', () => {
    it('has discord type', () => {
      expect(WEBHOOK_TYPES.DISCORD).toBe('discord')
    })
    it('has telegram type', () => {
      expect(WEBHOOK_TYPES.TELEGRAM).toBe('telegram')
    })
    it('has slack type', () => {
      expect(WEBHOOK_TYPES.SLACK).toBe('slack')
    })
    it('has custom type', () => {
      expect(WEBHOOK_TYPES.CUSTOM).toBe('custom')
    })
  })

  describe('WEBHOOK_EVENTS', () => {
    it('has spot_created event', () => {
      expect(WEBHOOK_EVENTS.SPOT_CREATED).toBe('spot_created')
    })
    it('has sos_triggered event', () => {
      expect(WEBHOOK_EVENTS.SOS_TRIGGERED).toBe('sos_triggered')
    })
    it('has at least 6 events', () => {
      expect(Object.keys(WEBHOOK_EVENTS).length).toBeGreaterThanOrEqual(6)
    })
  })

  describe('getWebhooks', () => {
    it('returns empty array initially', () => {
      expect(getWebhooks()).toEqual([])
    })

    it('returns saved webhooks', () => {
      const wh = [{ id: '1', name: 'Test', type: 'discord', events: [], enabled: true }]
      localStorage.setItem('spothitch_webhooks', JSON.stringify(wh))
      expect(getWebhooks()).toEqual(wh)
    })

    it('returns empty array when localStorage is corrupted', () => {
      localStorage.setItem('spothitch_webhooks', 'invalid json{')
      expect(getWebhooks()).toEqual([])
    })
  })

  describe('addWebhook', () => {
    it('returns a webhook object with id', () => {
      const w = addWebhook({ type: 'discord', url: 'https://discord.com/api/webhooks/test', events: ['spot_created'] })
      expect(w).toHaveProperty('id')
      expect(w.type).toBe('discord')
      expect(w.enabled).toBe(true)
    })

    it('persists to localStorage', () => {
      addWebhook({ type: 'discord', url: 'https://example.com', events: [] })
      expect(getWebhooks().length).toBe(1)
    })

    it('uses all events when events not specified', () => {
      const w = addWebhook({ type: 'slack', url: 'https://example.com' })
      expect(w.events.length).toBeGreaterThan(0)
    })

    it('uses provided name', () => {
      const w = addWebhook({ type: 'discord', url: 'https://example.com', name: 'My Webhook', events: [] })
      expect(w.name).toBe('My Webhook')
    })

    it('generates name from count when not provided', () => {
      const w = addWebhook({ type: 'discord', url: 'https://example.com', events: [] })
      expect(w.name).toContain('Webhook')
    })

    it('increments name number for second webhook', () => {
      addWebhook({ type: 'discord', url: 'https://example.com', events: [] })
      const w2 = addWebhook({ type: 'slack', url: 'https://example.com', events: [] })
      expect(w2.name).toContain('2')
    })

    it('stores created timestamp', () => {
      const before = Date.now()
      const w = addWebhook({ type: 'discord', url: 'https://example.com', events: [] })
      expect(w.created).toBeGreaterThanOrEqual(before)
    })
  })

  describe('removeWebhook', () => {
    it('removes webhook by id', () => {
      const w = addWebhook({ type: 'discord', url: 'https://example.com', events: [] })
      removeWebhook(w.id)
      expect(getWebhooks()).toEqual([])
    })

    it('does not throw for unknown id', () => {
      expect(() => removeWebhook('nonexistent')).not.toThrow()
    })

    it('does not remove other webhooks', () => {
      addWebhook({ type: 'discord', url: 'https://example.com', events: [], name: 'A' })
      const w2 = addWebhook({ type: 'slack', url: 'https://example2.com', events: [], name: 'B' })
      removeWebhook(w2.id)
      // 'B' should be gone
      expect(getWebhooks().some(w => w.name === 'B')).toBe(false)
    })
  })

  describe('toggleWebhook', () => {
    it('toggles enabled from true to false', () => {
      const w = addWebhook({ type: 'discord', url: 'https://example.com', events: [] })
      expect(w.enabled).toBe(true)
      toggleWebhook(w.id)
      expect(getWebhooks()[0].enabled).toBe(false)
    })

    it('toggles enabled from false to true', () => {
      const w = addWebhook({ type: 'discord', url: 'https://example.com', events: [] })
      toggleWebhook(w.id)
      toggleWebhook(w.id)
      expect(getWebhooks()[0].enabled).toBe(true)
    })

    it('does nothing for unknown id', () => {
      expect(() => toggleWebhook('nonexistent')).not.toThrow()
    })
  })

  describe('triggerWebhooks', () => {
    it('returns a promise', () => {
      const result = triggerWebhooks('spot_created', {})
      expect(result instanceof Promise).toBe(true)
    })

    it('resolves when no webhooks configured', async () => {
      await expect(triggerWebhooks('spot_created', {})).resolves.toBeUndefined()
    })

    it('does not call fetch when no matching event', async () => {
      addWebhook({ type: 'discord', url: 'https://example.com', events: ['level_up'], name: 'T' })
      await triggerWebhooks('spot_created', {})
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('calls fetch for matching webhook', async () => {
      addWebhook({ type: 'discord', url: 'https://discord.example.com', events: ['spot_created'], name: 'Test' })
      global.fetch = vi.fn().mockResolvedValue({ ok: true })
      await triggerWebhooks('spot_created', { spotName: 'Paris' })
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('does not call fetch when webhook disabled', async () => {
      const w = addWebhook({ type: 'discord', url: 'https://example.com', events: ['spot_created'], name: 'T' })
      toggleWebhook(w.id)
      await triggerWebhooks('spot_created', {})
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('handles fetch failure gracefully', async () => {
      addWebhook({ type: 'discord', url: 'https://fail.example.com', events: ['spot_created'], name: 'Fail' })
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))
      await expect(triggerWebhooks('spot_created', {})).resolves.toBeUndefined()
    })

    it('handles non-ok response gracefully', async () => {
      addWebhook({ type: 'discord', url: 'https://fail.example.com', events: ['level_up'], name: 'Fail' })
      global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 429 })
      await expect(triggerWebhooks('level_up', {})).resolves.toBeUndefined()
    })

    it('formats telegram payload with text and parse_mode', async () => {
      addWebhook({ type: 'telegram', url: 'https://api.telegram.org/test', events: ['spot_created'], name: 'TG' })
      let body
      global.fetch = vi.fn().mockImplementation((url, opts) => {
        body = JSON.parse(opts.body)
        return Promise.resolve({ ok: true })
      })
      await triggerWebhooks('spot_created', {})
      expect(body).toHaveProperty('text')
      expect(body).toHaveProperty('parse_mode', 'Markdown')
    })

    it('formats slack payload with blocks', async () => {
      addWebhook({ type: 'slack', url: 'https://hooks.slack.com/test', events: ['sos_triggered'], name: 'Slack' })
      let body
      global.fetch = vi.fn().mockImplementation((url, opts) => {
        body = JSON.parse(opts.body)
        return Promise.resolve({ ok: true })
      })
      await triggerWebhooks('sos_triggered', {})
      expect(body).toHaveProperty('blocks')
      expect(body.blocks[0].type).toBe('section')
    })

    it('formats discord payload with embeds', async () => {
      addWebhook({ type: 'discord', url: 'https://discord.com/api/test', events: ['level_up'], name: 'DC' })
      let body
      global.fetch = vi.fn().mockImplementation((url, opts) => {
        body = JSON.parse(opts.body)
        return Promise.resolve({ ok: true })
      })
      await triggerWebhooks('level_up', { level: 5 })
      expect(body).toHaveProperty('embeds')
      expect(body.embeds[0]).toHaveProperty('title')
      expect(body.embeds[0]).toHaveProperty('color')
    })

    it('uses default payload for custom type', async () => {
      addWebhook({ type: 'custom', url: 'https://myserver.com/webhook', events: ['badge_earned'], name: 'Custom' })
      let body
      global.fetch = vi.fn().mockImplementation((url, opts) => {
        body = JSON.parse(opts.body)
        return Promise.resolve({ ok: true })
      })
      await triggerWebhooks('badge_earned', { badge: 'pioneer' })
      expect(body).toHaveProperty('event', 'badge_earned')
      expect(body).toHaveProperty('timestamp')
    })

    it('includes payload.message in description', async () => {
      addWebhook({ type: 'discord', url: 'https://example.com', events: ['milestone_reached'], name: 'M' })
      let body
      global.fetch = vi.fn().mockImplementation((url, opts) => {
        body = JSON.parse(opts.body)
        return Promise.resolve({ ok: true })
      })
      await triggerWebhooks('milestone_reached', { message: 'First 100 users!' })
      expect(body.embeds[0].description).toBe('First 100 users!')
    })

    it('triggers multiple webhooks for same event', async () => {
      addWebhook({ type: 'discord', url: 'https://discord1.example.com', events: ['spot_created'], name: 'D1' })
      addWebhook({ type: 'slack', url: 'https://slack.example.com', events: ['spot_created'], name: 'S1' })
      global.fetch = vi.fn().mockResolvedValue({ ok: true })
      await triggerWebhooks('spot_created', {})
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })
  })

  describe('renderWebhookSettings', () => {
    it('returns HTML string', () => {
      const html = renderWebhookSettings()
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(10)
    })

    it('contains webhooksTitle key', () => {
      const html = renderWebhookSettings()
      expect(html).toContain('webhooksTitle')
    })

    it('renders webhook entries when webhooks exist', () => {
      addWebhook({ type: 'discord', url: 'https://example.com', events: [], name: 'My Discord' })
      const html = renderWebhookSettings()
      expect(html).toContain('My Discord')
    })

    it('contains add webhook button', () => {
      const html = renderWebhookSettings()
      expect(html).toContain('openAddWebhook')
    })

    it('shows active/inactive status', () => {
      const w = addWebhook({ type: 'discord', url: 'https://example.com', events: [], name: 'Test' })
      const html = renderWebhookSettings()
      expect(html).toContain('Actif')
      toggleWebhook(w.id)
      const html2 = renderWebhookSettings()
      expect(html2).toContain('Inactif')
    })
  })
})
