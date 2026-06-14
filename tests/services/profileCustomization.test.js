import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({
    profileFrame: 'default',
    profileTitle: 'hitchhiker',
    unlockedFrames: ['default'],
    unlockedTitles: ['hitchhiker'],
  })),
  setState: vi.fn(),
}))
vi.mock('../../src/services/notifications.js', () => ({ showToast: vi.fn(), showError: vi.fn(), showSuccess: vi.fn() }))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))
vi.mock('../../src/utils/sanitize.js', () => ({ escapeHTML: vi.fn((s) => s) }))
vi.mock('../../src/services/firebase.js', () => ({
  getCurrentUser: vi.fn(() => null),
  updateUserProfile: vi.fn(),
  initializeFirebase: vi.fn(),
  getDb: vi.fn(() => null),
}))

import {
  PROFILE_FRAMES,
  PROFILE_TITLES,
  AVATAR_BORDERS,
  RARITY_COLORS,
  getUnlockedFrames,
  getUnlockedTitles,
  getCurrentFrame,
  getCurrentTitle,
  getCurrencyForCountry,
  checkUnlocks,
  equipFrame,
  equipTitle,
  unlockFrame,
  unlockTitle,
  renderAvatarWithFrame,
  renderTitleBadge,
  renderCustomizationModal,
} from '../../src/services/profileCustomization.js'
import { getState, setState } from '../../src/stores/state.js'

describe('profileCustomization', () => {
  describe('PROFILE_FRAMES', () => {
    it('has at least 5 frames', () => {
      expect(Object.keys(PROFILE_FRAMES).length).toBeGreaterThanOrEqual(5)
    })
    it('each frame has id, rarity, unlockMethod', () => {
      Object.values(PROFILE_FRAMES).forEach(f => {
        expect(f.id).toBeDefined()
        expect(f.rarity).toBeDefined()
        expect(f.unlockMethod).toBeDefined()
      })
    })
    it('default frame exists', () => {
      expect(PROFILE_FRAMES.default).toBeDefined()
      expect(PROFILE_FRAMES.default.rarity).toBe('common')
    })
  })

  describe('PROFILE_TITLES', () => {
    it('has at least 5 titles', () => {
      expect(Object.keys(PROFILE_TITLES).length).toBeGreaterThanOrEqual(5)
    })
    it('default title is hitchhiker', () => {
      expect(PROFILE_TITLES.hitchhiker).toBeDefined()
    })
  })

  describe('getUnlockedFrames', () => {
    it('returns array from state', () => {
      const frames = getUnlockedFrames()
      expect(Array.isArray(frames)).toBe(true)
      expect(frames).toContain('default')
    })
  })

  describe('getUnlockedTitles', () => {
    it('returns array from state', () => {
      const titles = getUnlockedTitles()
      expect(Array.isArray(titles)).toBe(true)
    })
  })

  describe('getCurrentFrame', () => {
    it('returns current frame id', () => {
      expect(getCurrentFrame()).toBe('default')
    })
  })

  describe('getCurrentTitle', () => {
    it('returns current title id', () => {
      expect(getCurrentTitle()).toBe('hitchhiker')
    })
  })

  describe('checkUnlocks', () => {
    it('does not throw with valid stats', () => {
      expect(() => checkUnlocks({
        level: 10,
        friendsCount: 15,
        spotsCreated: 20,
        totalDistance: 1000,
        countriesCount: 5,
        reviewsCount: 50,
        trustScore: 90,
        accountAgeDays: 400,
      })).not.toThrow()
    })

    it('does not throw with empty stats', () => {
      expect(() => checkUnlocks({})).not.toThrow()
    })

    it('unlocks explorer frame when level >= 5', () => {
      getState.mockReturnValue({
        unlockedFrames: ['default'],
        unlockedTitles: ['hitchhiker'],
      })
      checkUnlocks({ level: 5, friendsCount: 0, trustScore: 0, countriesCount: 0, accountAgeDays: 0, reviewsCount: 0, spotsCreated: 0, totalDistance: 0 })
      expect(setState).toHaveBeenCalled()
    })

    it('unlocks pathfinder title when spotsCreated >= 5', () => {
      getState.mockReturnValue({
        unlockedFrames: ['default'],
        unlockedTitles: ['hitchhiker'],
      })
      checkUnlocks({ level: 0, friendsCount: 0, trustScore: 0, countriesCount: 0, accountAgeDays: 0, reviewsCount: 0, spotsCreated: 5, totalDistance: 0 })
      expect(setState).toHaveBeenCalled()
    })
  })

  describe('AVATAR_BORDERS', () => {
    it('is an object', () => {
      expect(typeof AVATAR_BORDERS).toBe('object')
      expect(AVATAR_BORDERS).not.toBeNull()
    })

    it('has at least 2 border styles', () => {
      expect(Object.keys(AVATAR_BORDERS).length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('RARITY_COLORS', () => {
    it('is an object', () => {
      expect(typeof RARITY_COLORS).toBe('object')
      expect(RARITY_COLORS).not.toBeNull()
    })

    it('has common rarity', () => {
      expect(RARITY_COLORS.common).toBeDefined()
    })

    it('has rare rarity', () => {
      expect(RARITY_COLORS.rare).toBeDefined()
    })

    it('each rarity has text and bg properties', () => {
      Object.values(RARITY_COLORS).forEach(r => {
        expect(typeof r.text).toBe('string')
        expect(typeof r.bg).toBe('string')
      })
    })
  })

  describe('equipFrame', () => {
    it('returns false when frame is not unlocked', () => {
      getState.mockReturnValue({ unlockedFrames: ['default'], unlockedTitles: ['hitchhiker'] })
      const result = equipFrame('explorer')
      expect(result).toBe(false)
    })

    it('returns true when frame is unlocked', () => {
      getState.mockReturnValue({ unlockedFrames: ['default', 'explorer'], unlockedTitles: ['hitchhiker'] })
      const result = equipFrame('explorer')
      expect(result).toBe(true)
    })

    it('calls setState when equipping valid frame', () => {
      getState.mockReturnValue({ unlockedFrames: ['default', 'explorer'], unlockedTitles: ['hitchhiker'] })
      equipFrame('explorer')
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ equippedFrame: 'explorer' })
      )
    })

    it('equips default frame successfully', () => {
      getState.mockReturnValue({ unlockedFrames: ['default'] })
      const result = equipFrame('default')
      expect(result).toBe(true)
    })
  })

  describe('equipTitle', () => {
    it('returns false when title is not unlocked', () => {
      getState.mockReturnValue({ unlockedTitles: ['hitchhiker'], unlockedFrames: ['default'] })
      const result = equipTitle('pathfinder')
      expect(result).toBe(false)
    })

    it('returns true when title is unlocked', () => {
      getState.mockReturnValue({ unlockedTitles: ['hitchhiker', 'pathfinder'], unlockedFrames: ['default'] })
      const result = equipTitle('pathfinder')
      expect(result).toBe(true)
    })

    it('calls setState when equipping valid title', () => {
      getState.mockReturnValue({ unlockedTitles: ['hitchhiker', 'guide'], unlockedFrames: ['default'] })
      equipTitle('guide')
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ equippedTitle: 'guide' })
      )
    })
  })

  describe('unlockFrame', () => {
    it('does not throw', () => {
      getState.mockReturnValue({ unlockedFrames: ['default'] })
      expect(() => unlockFrame('explorer')).not.toThrow()
    })

    it('calls setState with updated frames list', () => {
      getState.mockReturnValue({ unlockedFrames: ['default'] })
      unlockFrame('explorer')
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ unlockedFrames: expect.arrayContaining(['default', 'explorer']) })
      )
    })

    it('does not add duplicate frames', () => {
      getState.mockReturnValue({ unlockedFrames: ['default', 'explorer'] })
      unlockFrame('explorer')
      // Already unlocked — no toast, no setState
      expect(setState).not.toHaveBeenCalled()
    })
  })

  describe('unlockTitle', () => {
    it('does not throw', () => {
      getState.mockReturnValue({ unlockedTitles: ['hitchhiker'] })
      expect(() => unlockTitle('pathfinder')).not.toThrow()
    })

    it('calls setState with updated titles list', () => {
      getState.mockReturnValue({ unlockedTitles: ['hitchhiker'] })
      unlockTitle('pathfinder')
      expect(setState).toHaveBeenCalledWith(
        expect.objectContaining({ unlockedTitles: expect.arrayContaining(['hitchhiker', 'pathfinder']) })
      )
    })
  })

  describe('renderAvatarWithFrame', () => {
    it('returns an HTML string', () => {
      const html = renderAvatarWithFrame()
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(20)
    })

    it('contains the avatar value', () => {
      const html = renderAvatarWithFrame({ avatar: 'thumbs-up' })
      expect(html).toContain('thumbs-up')
    })

    it('accepts different sizes', () => {
      const sm = renderAvatarWithFrame({ size: 'sm' })
      const lg = renderAvatarWithFrame({ size: 'lg' })
      expect(sm).toContain('w-10 h-10')
      expect(lg).toContain('w-24 h-24')
    })

    it('uses default frame when not specified', () => {
      const html = renderAvatarWithFrame({})
      expect(typeof html).toBe('string')
    })

    it('handles unknown frame gracefully', () => {
      const html = renderAvatarWithFrame({ frameId: 'nonexistent' })
      expect(typeof html).toBe('string')
    })
  })

  describe('renderTitleBadge', () => {
    it('returns an HTML string', () => {
      const html = renderTitleBadge()
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(10)
    })

    it('contains span element', () => {
      const html = renderTitleBadge('hitchhiker')
      expect(html).toContain('span')
    })

    it('handles unknown title gracefully', () => {
      const html = renderTitleBadge('nonexistent_title')
      expect(typeof html).toBe('string')
    })

    it('uses hitchhiker as default title', () => {
      getState.mockReturnValue({ equippedTitle: 'hitchhiker', unlockedTitles: ['hitchhiker'] })
      const html = renderTitleBadge()
      expect(html).toContain('span')
    })
  })

  describe('renderCustomizationModal', () => {
    beforeEach(() => {
      getState.mockReturnValue({
        equippedFrame: 'default',
        equippedTitle: 'hitchhiker',
        unlockedFrames: ['default'],
        unlockedTitles: ['hitchhiker'],
        showProfileCustomization: false,
      })
    })

    it('returns empty string when showProfileCustomization is false', () => {
      const html = renderCustomizationModal({ showProfileCustomization: false })
      expect(html).toBe('')
    })

    it('returns HTML string when showProfileCustomization is true', () => {
      const html = renderCustomizationModal({
        showProfileCustomization: true,
        username: 'testuser',
        bio: 'My bio',
        user: null,
        userProfile: null,
        avatar: '👍',
      })
      expect(typeof html).toBe('string')
      expect(html.length).toBeGreaterThan(100)
    })

    it('contains dialog role', () => {
      const html = renderCustomizationModal({
        showProfileCustomization: true,
        username: 'alice',
        bio: '',
        user: null,
      })
      expect(html).toContain('role="dialog"')
    })

    it('contains username input', () => {
      const html = renderCustomizationModal({
        showProfileCustomization: true,
        username: 'alice',
        bio: '',
        user: null,
      })
      expect(html).toContain('edit-username')
    })

    it('contains bio textarea', () => {
      const html = renderCustomizationModal({
        showProfileCustomization: true,
        username: '',
        bio: 'Hello world',
        user: null,
      })
      expect(html).toContain('edit-bio')
    })

    it('contains save button', () => {
      const html = renderCustomizationModal({
        showProfileCustomization: true,
        username: 'user1',
        bio: '',
        user: null,
      })
      expect(html).toContain('saveProfileEdits')
    })

    it('shows photo URL when user has photoURL', () => {
      const html = renderCustomizationModal({
        showProfileCustomization: true,
        username: 'user1',
        bio: '',
        user: { photoURL: 'https://example.com/photo.jpg' },
      })
      expect(html).toContain('example.com/photo.jpg')
    })

    it('handles locked username change (< 60 days)', () => {
      // Set last change to 10 days ago
      localStorage.setItem('spothitch_last_username_change', String(Date.now() - 10 * 24 * 60 * 60 * 1000))
      const html = renderCustomizationModal({
        showProfileCustomization: true,
        username: 'user1',
        bio: '',
        user: null,
      })
      expect(typeof html).toBe('string')
      expect(html).toContain('edit-username')
      localStorage.removeItem('spothitch_last_username_change')
    })

    it('handles unlocked username change (> 60 days)', () => {
      localStorage.setItem('spothitch_last_username_change', String(Date.now() - 70 * 24 * 60 * 60 * 1000))
      const html = renderCustomizationModal({
        showProfileCustomization: true,
        username: 'user1',
        bio: '',
        user: null,
      })
      expect(typeof html).toBe('string')
      localStorage.removeItem('spothitch_last_username_change')
    })

    it('renders gallery photos when available', () => {
      localStorage.setItem('spothitch_gallery', JSON.stringify([
        'https://example.com/img1.jpg',
        'https://example.com/img2.jpg',
      ]))
      const html = renderCustomizationModal({
        showProfileCustomization: true,
        username: 'user1',
        bio: '',
        user: null,
      })
      expect(html).toContain('selectProfilePhoto')
      localStorage.removeItem('spothitch_gallery')
    })

    it('renders languages when available', () => {
      localStorage.setItem('spothitch_languages', JSON.stringify([
        { name: 'French', flag: '🇫🇷' },
        { name: 'English', flag: '🇬🇧' },
      ]))
      const html = renderCustomizationModal({
        showProfileCustomization: true,
        username: 'user1',
        bio: '',
        user: null,
      })
      expect(html).toContain('removeEditLanguage')
      localStorage.removeItem('spothitch_languages')
    })

    it('handles null/undefined state gracefully', () => {
      expect(() => renderCustomizationModal({ showProfileCustomization: true })).not.toThrow()
    })
  })

  describe('window.removeEditLanguage', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it('removes language at given index from localStorage', () => {
      localStorage.setItem('spothitch_languages', JSON.stringify([
        { name: 'French', flag: '🇫🇷' },
        { name: 'Spanish', flag: '🇪🇸' },
        { name: 'German', flag: '🇩🇪' },
      ]))
      window.removeEditLanguage(1) // Remove Spanish
      const langs = JSON.parse(localStorage.getItem('spothitch_languages'))
      expect(langs).toHaveLength(2)
      expect(langs[0].name).toBe('French')
      expect(langs[1].name).toBe('German')
    })

    it('does not throw for empty language list', () => {
      localStorage.setItem('spothitch_languages', JSON.stringify([]))
      expect(() => window.removeEditLanguage(0)).not.toThrow()
    })

    it('does not throw when localStorage is empty', () => {
      expect(() => window.removeEditLanguage(0)).not.toThrow()
    })

    it('calls setState to trigger re-render', () => {
      localStorage.setItem('spothitch_languages', JSON.stringify([{ name: 'French' }]))
      window.removeEditLanguage(0)
      expect(setState).toHaveBeenCalled()
    })
  })

  describe('window.saveProfileEdits', () => {
    beforeEach(() => {
      document.body.innerHTML = ''
      vi.clearAllMocks()
      localStorage.clear()
    })

    it('is defined as a function', () => {
      expect(typeof window.saveProfileEdits).toBe('function')
    })

    it('does not throw when called with no DOM elements (invalid username path)', async () => {
      await expect(window.saveProfileEdits()).resolves.toBeUndefined()
    })

    it('does not throw when called with short username in DOM', async () => {
      document.body.innerHTML = '<input id="edit-username" value="ab"><textarea id="edit-bio">bio</textarea>'
      await expect(window.saveProfileEdits()).resolves.toBeUndefined()
    })

    it('takes the valid-username branch when username is long enough', async () => {
      getState.mockReturnValue({ username: 'alice123', showProfileCustomization: true })
      document.body.innerHTML = '<input id="edit-username" value="alice123"><textarea id="edit-bio">my bio</textarea>'
      await expect(window.saveProfileEdits()).resolves.toBeUndefined()
    })

    it('handles username cooldown when lastChange is recent', async () => {
      getState.mockReturnValue({ username: 'old_name', showProfileCustomization: true })
      localStorage.setItem('spothitch_last_username_change', String(Date.now() - 5 * 24 * 60 * 60 * 1000))
      document.body.innerHTML = '<input id="edit-username" value="newname"><textarea id="edit-bio">bio</textarea>'
      await expect(window.saveProfileEdits()).resolves.toBeUndefined()
      localStorage.removeItem('spothitch_last_username_change')
    })

    it('handles username change when cooldown is past', async () => {
      getState.mockReturnValue({ username: 'old_name', showProfileCustomization: true })
      localStorage.setItem('spothitch_last_username_change', String(Date.now() - 70 * 24 * 60 * 60 * 1000))
      document.body.innerHTML = '<input id="edit-username" value="newname"><textarea id="edit-bio">bio</textarea>'
      await expect(window.saveProfileEdits()).resolves.toBeUndefined()
      localStorage.removeItem('spothitch_last_username_change')
    })

    it('handles no lastChange in localStorage (first time)', async () => {
      getState.mockReturnValue({ username: 'old_name', showProfileCustomization: true })
      document.body.innerHTML = '<input id="edit-username" value="newname"><textarea id="edit-bio">bio</textarea>'
      await expect(window.saveProfileEdits()).resolves.toBeUndefined()
    })
  })

  describe('window.uploadProfilePhoto', () => {
    it('is defined as a function', () => {
      expect(typeof window.uploadProfilePhoto).toBe('function')
    })

    it('does not throw when called', () => {
      expect(() => window.uploadProfilePhoto()).not.toThrow()
    })

    it('creates a file input element', () => {
      const createSpy = vi.spyOn(document, 'createElement')
      window.uploadProfilePhoto()
      const inputCalls = createSpy.mock.calls.filter(c => c[0] === 'input')
      expect(inputCalls.length).toBeGreaterThan(0)
      createSpy.mockRestore()
    })
  })

  describe('window.equipFrame / window.equipTitle (global handlers)', () => {
    it('window.equipFrame is defined', () => {
      expect(typeof window.equipFrame).toBe('function')
    })

    it('window.equipTitle is defined', () => {
      expect(typeof window.equipTitle).toBe('function')
    })
  })
})
