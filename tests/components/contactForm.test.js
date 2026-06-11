import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn(() => '<svg></svg>') }))

import { renderContactFormModal, handleContactFormSubmit } from '../../src/components/modals/ContactForm.js'

describe('renderContactFormModal', () => {
  it('renders contact form HTML', () => {
    const html = renderContactFormModal()
    expect(html).toBeTruthy()
    expect(html.length).toBeGreaterThan(100)
  })

  it('renders with form element', () => {
    const html = renderContactFormModal()
    expect(html).toContain('<form')
  })

  it('renders close button', () => {
    const html = renderContactFormModal()
    expect(html).toContain('<button')
  })

  it('renders subject and message fields', () => {
    const html = renderContactFormModal()
    expect(html.toLowerCase()).toMatch(/subject|sujet|message|email/)
  })

  it('has onsubmit handler', () => {
    const html = renderContactFormModal()
    expect(html).toContain('submitContactForm')
  })
})

describe('handleContactFormSubmit', () => {
  let mockEvent

  beforeEach(() => {
    mockEvent = { preventDefault: vi.fn() }
    document.body.innerHTML = `
      <form id="contact-form">
        <input id="contact-name" value="Alice" />
        <input id="contact-email" value="alice@example.com" />
        <select id="contact-subject"><option value="general">General</option></select>
        <textarea id="contact-message">Hello world</textarea>
        <button id="contact-submit-btn">Send</button>
      </form>
    `
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls event.preventDefault()', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: true }))
    await handleContactFormSubmit(mockEvent)
    expect(mockEvent.preventDefault).toHaveBeenCalled()
  })

  it('returns early when form is missing', async () => {
    document.body.innerHTML = ''
    global.fetch = vi.fn()
    await handleContactFormSubmit(mockEvent)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('returns early when name is empty', async () => {
    document.getElementById('contact-name').value = ''
    global.fetch = vi.fn()
    await handleContactFormSubmit(mockEvent)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('returns early when email is empty', async () => {
    document.getElementById('contact-email').value = ''
    global.fetch = vi.fn()
    await handleContactFormSubmit(mockEvent)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('returns early when message is empty', async () => {
    document.getElementById('contact-message').value = ''
    global.fetch = vi.fn()
    await handleContactFormSubmit(mockEvent)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('sends POST to Formspree endpoint on valid form', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: true }))
    await handleContactFormSubmit(mockEvent)
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('formspree.io'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('shows error UI when fetch throws', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('network error')))
    await handleContactFormSubmit(mockEvent)
    const errorDiv = document.querySelector('.contact-error')
    expect(errorDiv).not.toBeNull()
  })

  it('re-enables submit button on error', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('fail')))
    const btn = document.getElementById('contact-submit-btn')
    await handleContactFormSubmit(mockEvent)
    expect(btn.disabled).toBe(false)
  })
})
