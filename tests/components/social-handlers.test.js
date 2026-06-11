/**
 * Social.js window handler tests — sync handlers + early-return branches
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn(() => '<svg></svg>') }))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeHTML: vi.fn((s) => String(s ?? '')),
  escapeJSString: vi.fn((s) => String(s ?? '')),
}))
vi.mock('../../src/utils/searchInput.js', () => ({
  renderSearchInput: vi.fn(() => '<input type="text" />'),
}))
vi.mock('../../src/utils/customSelect.js', () => ({
  renderCustomSelect: vi.fn(() => '<select></select>'),
}))
vi.mock('../../src/utils/formatters.js', () => ({
  formatRelativeTime: vi.fn(() => '1h'),
  formatEventDate: vi.fn(() => '01/01/2026'),
}))
vi.mock('../../src/components/EmptyState.js', () => ({
  renderEmptyState: vi.fn(() => '<div class="empty"></div>'),
}))
vi.mock('../../src/components/views/social/Conversations.js', () => ({
  renderConversations: vi.fn(() => '<div class="conversations"></div>'),
}))
vi.mock('../../src/components/views/social/Voyageurs.js', () => ({
  renderVoyageurs: vi.fn(() => '<div class="voyageurs"></div>'),
}))
vi.mock('../../src/components/views/social/GuardianWatch.js', () => ({
  renderGuardianWatch: vi.fn(() => '<div class="guardian-watch"></div>'),
}))
vi.mock('../../src/components/views/social/CountryChats.js', () => ({
  renderCountryChats: vi.fn(() => '<div class="country-chats"></div>'),
}))
vi.mock('../../src/components/ui/Skeleton.js', () => ({
  renderSkeletonChatList: vi.fn(() => '<div class="skeleton"></div>'),
}))
vi.mock('../../src/services/directMessages.js', () => ({
  getConversationsList: vi.fn(() => []),
  sendDirectMessage: vi.fn(() => Promise.resolve({ success: true })),
}))
vi.mock('../../src/services/events.js', () => ({
  getUpcomingEvents: vi.fn(() => []),
  getEventComments: vi.fn(() => []),
  EVENT_TYPES: [],
}))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ isLoggedIn: true, user: { uid: 'u1' }, username: 'Alice' })),
  setState: vi.fn(),
}))
vi.mock('../../src/services/firebase.js', () => ({
  getUserProfile: vi.fn(() => Promise.resolve({ success: false })),
}))

import '../../src/components/views/Social.js'

describe('Social sync handlers', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>'
    vi.clearAllMocks()
    window.setState = vi.fn()
    window.getState = vi.fn(() => ({ isLoggedIn: true, user: { uid: 'u1' }, username: 'Alice' }))
    window.showToast = vi.fn()
    window.requireAuth = vi.fn()
    window.requireOnline = vi.fn(() => true)
    // Reset busy flags
    if (window.sendFriendRequest) window.sendFriendRequest._busy = false
    if (window.submitProfileReview) window.submitProfileReview._busy = false
  })

  it('setSocialTab calls setState with socialSubTab', () => {
    window.setSocialTab('evenements')
    expect(window.setState).toHaveBeenCalledWith({ socialSubTab: 'evenements' })
  })

  it('setEventFilter calls setState with eventFilter', () => {
    window.setEventFilter('upcoming')
    expect(window.setState).toHaveBeenCalledWith({ eventFilter: 'upcoming' })
  })

  it('showCompanionSearchView calls setState with showCompanionSearch: true', () => {
    window.showCompanionSearchView()
    expect(window.setState).toHaveBeenCalledWith({ showCompanionSearch: true })
  })

  it('closeCompanionSearch calls setState with showCompanionSearch: false', () => {
    window.closeCompanionSearch()
    expect(window.setState).toHaveBeenCalledWith({ showCompanionSearch: false })
  })

  it('openFriendChat sets socialSubTab + activeDMConversation', () => {
    window.openFriendChat('friend-123')
    expect(window.setState).toHaveBeenCalledWith({
      socialSubTab: 'messagerie',
      activeDMConversation: 'friend-123',
    })
  })

  it('closeFriendChat sets activeDMConversation: null', () => {
    window.closeFriendChat()
    expect(window.setState).toHaveBeenCalledWith({ activeDMConversation: null })
  })

  it('showAddFriend sets socialSubTab: messagerie', () => {
    window.showAddFriend()
    expect(window.setState).toHaveBeenCalledWith({ socialSubTab: 'messagerie' })
  })

  it('openWriteReview calls setState with showWriteReview + reviewTargetUid', () => {
    window.openWriteReview('user-456')
    expect(window.setState).toHaveBeenCalledWith({ showWriteReview: true, reviewTargetUid: 'user-456' })
  })

  it('cancelWriteReview clears showWriteReview', () => {
    window.cancelWriteReview()
    expect(window.setState).toHaveBeenCalledWith({ showWriteReview: false, reviewTargetUid: null })
  })
})

describe('Social async early-return handlers', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>'
    vi.clearAllMocks()
    window.setState = vi.fn()
    window.getState = vi.fn(() => ({}))
    window.showToast = vi.fn()
    window.requireAuth = vi.fn()
    window.requireOnline = vi.fn(() => true)
    if (window.sendFriendRequest) window.sendFriendRequest._busy = false
    if (window.submitProfileReview) window.submitProfileReview._busy = false
  })

  it('postCompanionRequest shows toast when from/to are empty', async () => {
    document.body.innerHTML = `
      <input id="companion-from" value="" />
      <input id="companion-to" value="" />
    `
    await window.postCompanionRequest()
    expect(window.showToast).toHaveBeenCalledWith('fillFromTo', 'warning')
  })

  it('sendPrivateMessage does nothing when input is empty', async () => {
    document.body.innerHTML = `<input id="private-chat-input" value="" />`
    await window.sendPrivateMessage('friend-123')
    expect(window.showToast).not.toHaveBeenCalled()
  })

  it('loadMyProfileReviews does nothing when no user uid', async () => {
    window.getState = vi.fn(() => ({ user: null }))
    await window.loadMyProfileReviews()
    expect(window.setState).not.toHaveBeenCalled()
  })

  it('submitProfileReview does nothing when no comment', async () => {
    window.submitProfileReview._busy = false
    await window.submitProfileReview('uid-x', '')
    // busy flag reset, no toast since it returns early
    expect(window.showToast).not.toHaveBeenCalled()
  })

  it('submitProfileReview skips when already busy', async () => {
    window.submitProfileReview._busy = true
    await window.submitProfileReview('uid-x', 'great traveler')
    expect(window.showToast).not.toHaveBeenCalled()
    window.submitProfileReview._busy = false
  })

  it('showFriendProfile clears previous data before showing new', async () => {
    await window.showFriendProfile('friend-999')
    // First call clears, second call sets
    expect(window.setState).toHaveBeenCalledWith(expect.objectContaining({
      showFriendProfile: false,
      selectedFriendProfileId: null,
    }))
    expect(window.setState).toHaveBeenCalledWith(expect.objectContaining({
      showFriendProfile: true,
      selectedFriendProfileId: 'friend-999',
    }))
  })
})
