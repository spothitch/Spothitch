/**
 * Hostel recommendation handlers
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

window.t = vi.fn((k) => k)
window.showToast = vi.fn()
window._appInternals = {
  scheduleRender: vi.fn((fn) => fn()),
  render: vi.fn(),
}

vi.mock('../../src/services/hostelRecommendations.js', () => ({
  renderAddHostelForm: vi.fn(() => '<div>Hostel Form</div>'),
  addRecommendation: vi.fn(() => true),
  upvoteRecommendation: vi.fn(() => true),
  switchHostelCategory: vi.fn(),
}))

import '../../src/handlers/hostel.js'

describe('window.openAddHostel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
  })

  it('creates hostel-modal in DOM', async () => {
    await window.openAddHostel('Paris')
    expect(document.getElementById('hostel-modal')).toBeTruthy()
  })

  it('replaces existing modal', async () => {
    document.body.innerHTML = '<div id="hostel-modal"><p>Old</p></div>'
    await window.openAddHostel('Lyon')
    const modals = document.querySelectorAll('#hostel-modal')
    expect(modals.length).toBe(1)
  })

  it('calls renderAddHostelForm with city', async () => {
    const { renderAddHostelForm } = await import('../../src/services/hostelRecommendations.js')
    await window.openAddHostel('Berlin')
    expect(renderAddHostelForm).toHaveBeenCalledWith('Berlin')
  })
})

describe('window.closeAddHostel', () => {
  beforeEach(() => { document.body.innerHTML = '' })

  it('removes hostel-modal from DOM', () => {
    document.body.innerHTML = '<div id="hostel-modal"></div>'
    window.closeAddHostel()
    expect(document.getElementById('hostel-modal')).toBeNull()
  })

  it('does not throw when modal absent', () => {
    expect(() => window.closeAddHostel()).not.toThrow()
  })
})

describe('window.setHostelCategory', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="selected-category" value="" />
      <button class="category-btn" data-category="budget">Budget</button>
      <button class="category-btn" data-category="party">Party</button>
    `
  })

  it('sets the value of selected-category input', () => {
    window.setHostelCategory('budget')
    expect(document.getElementById('selected-category').value).toBe('budget')
  })

  it('applies active class to selected category button', () => {
    window.setHostelCategory('budget')
    const budgetBtn = document.querySelector('[data-category="budget"]')
    expect(budgetBtn.className).toContain('border-primary-500')
  })

  it('applies inactive class to other buttons (no active border)', () => {
    window.setHostelCategory('budget')
    const partyBtn = document.querySelector('[data-category="party"]')
    // Inactive buttons have hover:border-primary-500 but NOT border-2 border-primary-500
    expect(partyBtn.className).not.toContain('border-2 border-primary-500')
  })

  it('does not throw when input absent', () => {
    document.body.innerHTML = ''
    expect(() => window.setHostelCategory('budget')).not.toThrow()
  })
})

describe('window.submitHostelRec', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
    window.submitHostelRec._busy = false
  })

  it('shows toast when hostel name is empty', async () => {
    document.body.innerHTML = '<input id="hostel-name" value="" /><input id="selected-category" value="budget" />'
    await window.submitHostelRec('Paris')
    expect(window.showToast).toHaveBeenCalled()
  })

  it('shows toast when category is empty', async () => {
    document.body.innerHTML = '<input id="hostel-name" value="My Hostel" /><input id="selected-category" value="" />'
    await window.submitHostelRec('Paris')
    expect(window.showToast).toHaveBeenCalled()
  })

  it('calls addRecommendation when form is valid', async () => {
    document.body.innerHTML = '<input id="hostel-name" value="Cool Hostel" /><input id="selected-category" value="budget" />'
    const { addRecommendation } = await import('../../src/services/hostelRecommendations.js')
    await window.submitHostelRec('Paris')
    expect(addRecommendation).toHaveBeenCalledWith('Paris', 'Cool Hostel', 'budget')
  })

  it('does not submit when busy', async () => {
    window.submitHostelRec._busy = true
    document.body.innerHTML = '<input id="hostel-name" value="Hostel" /><input id="selected-category" value="budget" />'
    const { addRecommendation } = await import('../../src/services/hostelRecommendations.js')
    await window.submitHostelRec('Paris')
    expect(addRecommendation).not.toHaveBeenCalled()
  })
})

describe('window.upvoteHostel', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('calls upvoteRecommendation with city and name', async () => {
    const { upvoteRecommendation } = await import('../../src/services/hostelRecommendations.js')
    await window.upvoteHostel('Paris', 'Cool Hostel')
    expect(upvoteRecommendation).toHaveBeenCalledWith('Paris', 'Cool Hostel')
  })

  it('does not throw', async () => {
    await expect(window.upvoteHostel('Lyon', 'My Hostel')).resolves.not.toThrow()
  })
})

describe('window.switchHostelCategory', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('calls switchHostelCategory service', async () => {
    const { switchHostelCategory } = await import('../../src/services/hostelRecommendations.js')
    await window.switchHostelCategory('party', 'Berlin')
    expect(switchHostelCategory).toHaveBeenCalledWith('party', 'Berlin')
  })
})
