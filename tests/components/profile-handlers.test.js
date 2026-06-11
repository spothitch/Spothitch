/**
 * Profile.js window handler tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn(() => '<svg></svg>') }))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeHTML: vi.fn((s) => String(s ?? '')),
  escapeJSString: vi.fn((s) => String(s ?? '')),
}))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})), setState: vi.fn(),
}))
vi.mock('../../src/components/ui/DonationCard.js', () => ({
  renderDonationCard: vi.fn(() => '<div></div>'),
}))
vi.mock('../../src/services/trustScore.js', () => ({
  renderVerifiedCheckmark: vi.fn(() => ''),
  getUserTrustScore: vi.fn(() => ({ score: 85, level: 'trusted', badges: [] })),
}))
vi.mock('../../src/components/EmptyState.js', () => ({
  renderEmptyState: vi.fn(() => '<div class="empty"></div>'),
}))
vi.mock('../../src/utils/toggle.js', () => ({
  renderToggle: vi.fn((id, val) => `<button class="toggle" data-id="${id}">${val}</button>`),
}))
vi.mock('../../src/data/featuresData.js', () => ({
  FEATURES_DATA: [{ id: 'f1', title: 'Guardian', category: 'safety', votes: 10, status: 'live' }],
}))
vi.mock('../../src/services/featureVotes.js', () => ({
  getVoteTotals: vi.fn(() => ({ f1: 10 })),
  getFeatureComments: vi.fn(() => []),
}))
vi.mock('../../src/services/spotFreshness.js', () => ({
  getSpotFreshness: vi.fn(() => ({ color: 'green', labelKey: 'fresh', icon: 'circle-check', isCertified: false })),
}))
vi.mock('../../src/components/views/ProfileDemos.js', () => ({}))
vi.mock('../../src/services/firebaseSync.js', () => ({
  syncAllToFirestore: vi.fn(() => Promise.resolve()),
  syncProfileToFirestore: vi.fn(() => Promise.resolve()),
}))
vi.mock('../../src/utils/inputOverlay.js', () => ({
  showInputOverlay: vi.fn(() => Promise.resolve(null)),
}))
vi.mock('../../src/services/notifications.js', () => ({
  showSuccess: vi.fn(), showError: vi.fn(), showToast: vi.fn(),
}))

// Import as side effect to register window.* handlers
import '../../src/components/views/Profile.js'

describe('Profile window handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = '<div id="app"></div>'
    window.getState = vi.fn(() => ({}))
    window.setState = vi.fn()
    window.showToast = vi.fn()
    window._forceRender = vi.fn()
    localStorage.clear()
  })

  it('setProfileSubTab calls setState with tab', () => {
    window.setProfileSubTab('reglages')
    expect(window.setState).toHaveBeenCalledWith({ profileSubTab: 'reglages' })
  })

  it('setProfileSubTab("profil") works', () => {
    window.setProfileSubTab('profil')
    expect(window.setState).toHaveBeenCalledWith({ profileSubTab: 'profil' })
  })

  it('setProfileSubTab("progression") works', () => {
    window.setProfileSubTab('progression')
    expect(window.setState).toHaveBeenCalledWith({ profileSubTab: 'progression' })
  })

  it('toggleSettingsSection opens section when closed', () => {
    window.getState.mockReturnValue({ settingsOpenSection: null })
    window.toggleSettingsSection('privacy')
    expect(window.setState).toHaveBeenCalledWith({ settingsOpenSection: 'privacy' })
  })

  it('toggleSettingsSection closes section when already open', () => {
    window.getState.mockReturnValue({ settingsOpenSection: 'privacy' })
    window.toggleSettingsSection('privacy')
    expect(window.setState).toHaveBeenCalledWith({ settingsOpenSection: null })
  })

  it('toggleSettingsSection switches to different section', () => {
    window.getState.mockReturnValue({ settingsOpenSection: 'privacy' })
    window.toggleSettingsSection('account')
    expect(window.setState).toHaveBeenCalledWith({ settingsOpenSection: 'account' })
  })

  it('toggleNotifications toggles from undefined to true', () => {
    window.getState.mockReturnValue({})
    window.toggleNotifications()
    expect(window.setState).toHaveBeenCalled()
    expect(window.showToast).toHaveBeenCalled()
  })

  it('toggleNotifications toggles from false to true', () => {
    window.getState.mockReturnValue({ notifications: false })
    window.toggleNotifications()
    expect(window.setState).toHaveBeenCalled()
  })

  it('toggleProximityAlertsSetting does not crash', () => {
    expect(() => window.toggleProximityAlertsSetting()).not.toThrow()
  })

  it('openComingSoonProximity does not crash', () => {
    expect(() => window.openComingSoonProximity()).not.toThrow()
  })

  it('closeComingSoonProximity does not crash', () => {
    expect(() => window.closeComingSoonProximity()).not.toThrow()
  })

  it('editAvatar sets showWelcome', () => {
    window.editAvatar()
    expect(window.setState).toHaveBeenCalledWith({ showWelcome: true })
  })

  it('closeLanguagePicker calls setState', () => {
    window.closeLanguagePicker()
    expect(window.setState).toHaveBeenCalledWith({ showLanguagePicker: false })
  })

  it('langPickerFilter updates search query', () => {
    window.langPickerFilter('fr')
    expect(window.setState).toHaveBeenCalledWith({ langPickerSearch: 'fr' })
  })

  it('langPickerFilter with empty string', () => {
    window.langPickerFilter('')
    expect(window.setState).toHaveBeenCalledWith({ langPickerSearch: '' })
  })

  it('selectLanguageFromPicker sets state', () => {
    window.selectLanguageFromPicker('Français')
    expect(window.setState).toHaveBeenCalledWith(expect.objectContaining({
      showLanguagePicker: false,
      langPickerSelectedName: 'Français',
    }))
  })

  it('closeLanguageLevelPicker calls setState', () => {
    window.closeLanguageLevelPicker()
    expect(window.setState).toHaveBeenCalledWith({ showLanguageLevelPicker: false })
  })

  it('removeLanguage with empty localStorage does not crash', () => {
    localStorage.setItem('spothitch_languages', '[]')
    expect(() => window.removeLanguage(0)).not.toThrow()
  })

  it('removeLanguage removes entry at index', () => {
    localStorage.setItem('spothitch_languages', JSON.stringify([
      { name: 'Français', flag: '🇫🇷', level: 'natif' },
      { name: 'English', flag: '🇬🇧', level: 'courant' },
    ]))
    window.removeLanguage(0)
    const stored = JSON.parse(localStorage.getItem('spothitch_languages'))
    expect(stored.length).toBe(1)
  })

  it('selectLanguageLevel with no selected name returns early', () => {
    window.getState.mockReturnValue({ langPickerSelectedName: '' })
    expect(() => window.selectLanguageLevel('courant')).not.toThrow()
  })

  it('selectLanguageLevel saves language to localStorage', () => {
    window.getState.mockReturnValue({ langPickerSelectedName: 'Français' })
    localStorage.setItem('spothitch_languages', '[]')
    window.selectLanguageLevel('courant')
    const stored = JSON.parse(localStorage.getItem('spothitch_languages'))
    expect(stored.length).toBe(1)
    expect(stored[0].name).toBe('Français')
    expect(stored[0].level).toBe('courant')
  })

  it('toggleRoadmapComments calls setState', () => {
    window.getState.mockReturnValue({ openRoadmapFeature: null })
    window.toggleRoadmapComments('f1')
    expect(window._forceRender).toHaveBeenCalled()
  })

  it('openBlockedUsers sets showBlockedUsers: true', () => {
    window.openBlockedUsers()
    expect(window.setState).toHaveBeenCalledWith({ showBlockedUsers: true })
  })

  it('closeBlockedUsers sets showBlockedUsers: false', () => {
    window.closeBlockedUsers()
    expect(window.setState).toHaveBeenCalledWith({ showBlockedUsers: false })
  })

  it('editLanguages sets showLanguagePicker: true', () => {
    window.editLanguages()
    expect(window.setState).toHaveBeenCalledWith({ showLanguagePicker: true, langPickerSearch: '' })
  })

  it('openReferences does not throw', () => {
    expect(() => window.openReferences()).not.toThrow()
  })

  it('closeReferences does not throw', () => {
    expect(() => window.closeReferences()).not.toThrow()
  })

  it('openMySpots sets profileDetailView: spots', () => {
    window.openMySpots()
    expect(window.setState).toHaveBeenCalledWith({ profileDetailView: 'spots' })
  })

  it('openMyValidations sets profileDetailView: validations', () => {
    window.openMyValidations()
    expect(window.setState).toHaveBeenCalledWith({ profileDetailView: 'validations' })
  })

  it('openMyCountries sets profileDetailView: countries', () => {
    window.openMyCountries()
    expect(window.setState).toHaveBeenCalledWith({ profileDetailView: 'countries' })
  })

  it('closeProfileDetail clears profileDetailView', () => {
    window.closeProfileDetail()
    expect(window.setState).toHaveBeenCalledWith({ profileDetailView: null })
  })

  it('cycleLanguageLevel cycles debutant → courant', () => {
    localStorage.setItem('spothitch_languages', JSON.stringify([
      { name: 'Français', flag: '🇫🇷', level: 'debutant' },
    ]))
    window.cycleLanguageLevel(0)
    const stored = JSON.parse(localStorage.getItem('spothitch_languages'))
    expect(stored[0].level).toBe('courant')
  })

  it('cycleLanguageLevel wraps natif → debutant', () => {
    localStorage.setItem('spothitch_languages', JSON.stringify([
      { name: 'Français', flag: '🇫🇷', level: 'natif' },
    ]))
    window.cycleLanguageLevel(0)
    const stored = JSON.parse(localStorage.getItem('spothitch_languages'))
    expect(stored[0].level).toBe('debutant')
  })

  it('saveSocialLink saves valid network to localStorage', () => {
    window.saveSocialLink('instagram', 'myhandle')
    const stored = JSON.parse(localStorage.getItem('spothitch_social_links'))
    expect(stored.instagram).toBe('myhandle')
  })

  it('saveSocialLink ignores unknown network', () => {
    localStorage.removeItem('spothitch_social_links')
    window.saveSocialLink('unknown_app', 'test')
    expect(localStorage.getItem('spothitch_social_links')).toBeNull()
  })

  it('saveSocialLink strips dangerous chars', () => {
    window.saveSocialLink('twitter', '<script>alert(1)</script>')
    const stored = JSON.parse(localStorage.getItem('spothitch_social_links'))
    expect(stored.twitter).not.toContain('<')
    expect(stored.twitter).not.toContain('>')
  })

  it('togglePrivacy toggles a key from true to false', () => {
    localStorage.setItem('spothitch_privacy', JSON.stringify({ showToNonFriends: true, showLocationHistory: false, showTravelStats: true }))
    window.togglePrivacy('showToNonFriends')
    const stored = JSON.parse(localStorage.getItem('spothitch_privacy'))
    expect(stored.showToNonFriends).toBe(false)
  })

  it('togglePrivacy uses defaults when localStorage is empty', () => {
    localStorage.removeItem('spothitch_privacy')
    expect(() => window.togglePrivacy('showLocationHistory')).not.toThrow()
    const stored = JSON.parse(localStorage.getItem('spothitch_privacy'))
    expect(typeof stored.showLocationHistory).toBe('boolean')
  })

  it('openPhotoManager does not throw', () => {
    expect(() => window.openPhotoManager()).not.toThrow()
  })
})
