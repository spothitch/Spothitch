/**
 * Gamification handlers — quiz, badges, challenges, shop, stats, animations
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Set up window.setState and window.getState before import
const mockSetState = vi.fn()
const mockGetState = vi.fn(() => ({ showThumbHistory: false }))
window.setState = mockSetState
window.getState = mockGetState
window.t = vi.fn((k) => k)
window.showToast = vi.fn()

vi.mock('../../src/services/quiz.js', () => ({
  startQuiz: vi.fn().mockResolvedValue({}),
  answerQuestion: vi.fn(),
  nextQuizQuestion: vi.fn(),
}))
vi.mock('../../src/services/friendChallenges.js', () => ({
  createChallenge: vi.fn(() => ({ id: 'c1' })),
  acceptChallenge: vi.fn(() => true),
  declineChallenge: vi.fn(() => true),
  cancelChallenge: vi.fn(() => true),
  syncChallengeProgress: vi.fn(),
  getActiveChallenges: vi.fn(() => []),
  getPendingChallenges: vi.fn(() => []),
  getChallengeStats: vi.fn(() => ({})),
  getChallengeTypes: vi.fn(() => []),
}))
vi.mock('../../src/services/teamChallenges.js', () => ({
  createTeam: vi.fn(() => ({ id: 't1' })),
  joinTeam: vi.fn(),
  leaveTeam: vi.fn(),
  startTeamChallenge: vi.fn(),
}))
vi.mock('../../src/services/profileCustomization.js', () => ({
  equipFrame: vi.fn(),
  equipTitle: vi.fn(),
}))
vi.mock('../../src/utils/animations.js', () => ({
  showSuccessAnimation: vi.fn(),
  showErrorAnimation: vi.fn(),
  showBadgeUnlockAnimation: vi.fn(),
  showLevelUpAnimation: vi.fn(),
  showPointsAnimation: vi.fn(),
  playSound: vi.fn(),
}))
vi.mock('../../src/utils/confetti.js', () => ({
  launchConfetti: vi.fn(),
  launchConfettiBurst: vi.fn(),
}))
vi.mock('../../src/utils/seo.js', () => ({
  trackPageView: vi.fn(),
}))

// Import the handler file as side-effect to register all window.* handlers
import '../../src/handlers/gamification.js'

describe('gamification handlers — quiz', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('openQuiz calls setState with showQuiz: true', () => {
    window.openQuiz()
    expect(mockSetState).toHaveBeenCalledWith({ showQuiz: true })
  })

  it('closeQuiz calls setState to reset quiz state', () => {
    window.closeQuiz()
    expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
      showQuiz: false,
      quizActive: false,
    }))
  })

  it('startQuizGame calls startQuiz', async () => {
    const { startQuiz } = await import('../../src/services/quiz.js')
    await window.startQuizGame()
    expect(startQuiz).toHaveBeenCalled()
  })

  it('startCountryQuiz calls startQuiz with countryCode', async () => {
    const { startQuiz } = await import('../../src/services/quiz.js')
    await window.startCountryQuiz('FR')
    expect(startQuiz).toHaveBeenCalledWith('FR')
  })

  it('answerQuizQuestion calls answerQuestion', async () => {
    const { answerQuestion } = await import('../../src/services/quiz.js')
    await window.answerQuizQuestion(2)
    expect(answerQuestion).toHaveBeenCalledWith(2)
  })

  it('nextQuizQuestion calls nextQuizQuestion service', async () => {
    const { nextQuizQuestion } = await import('../../src/services/quiz.js')
    await window.nextQuizQuestion()
    expect(nextQuizQuestion).toHaveBeenCalled()
  })

  it('retryQuiz calls startQuiz', async () => {
    const { startQuiz } = await import('../../src/services/quiz.js')
    await window.retryQuiz()
    expect(startQuiz).toHaveBeenCalled()
  })

  it('showCountryQuizSelection resets quiz state', () => {
    window.showCountryQuizSelection()
    expect(mockSetState).toHaveBeenCalledWith(expect.objectContaining({
      quizActive: false,
      quizResult: null,
    }))
  })
})

describe('gamification handlers — badges', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('openBadges calls setState with showBadges: true', () => {
    window.openBadges()
    expect(mockSetState).toHaveBeenCalledWith({ showBadges: true })
  })

  it('closeBadges calls setState with showBadges: false', () => {
    window.closeBadges()
    expect(mockSetState).toHaveBeenCalledWith({ showBadges: false })
  })

  it('showBadgeDetail sets showBadgeDetail and selectedBadgeId', () => {
    window.showBadgeDetail('badge123')
    expect(mockSetState).toHaveBeenCalledWith({ showBadgeDetail: true, selectedBadgeId: 'badge123' })
  })

  it('closeBadgeDetail clears badge detail', () => {
    window.closeBadgeDetail()
    expect(mockSetState).toHaveBeenCalledWith({ showBadgeDetail: false, selectedBadgeId: null })
  })

  it('dismissBadgePopup clears popup', () => {
    window.dismissBadgePopup()
    expect(mockSetState).toHaveBeenCalledWith({ showBadgePopup: false, newBadge: null })
  })

  it('closeBadgePopup clears popup', () => {
    window.closeBadgePopup()
    expect(mockSetState).toHaveBeenCalledWith({ showBadgePopup: false, newBadge: null })
  })

  it('openBadgePopup sets badge popup with badge data', () => {
    const badge = { id: 'b1', name: 'Pioneer' }
    window.openBadgePopup(badge)
    expect(mockSetState).toHaveBeenCalledWith({ showBadgePopup: true, newBadge: badge })
  })
})

describe('gamification handlers — daily reward & challenges', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('openDailyReward calls setState with showDailyReward: true', () => {
    window.openDailyReward()
    expect(mockSetState).toHaveBeenCalledWith({ showDailyReward: true })
  })

  it('openChallenges calls setState with showChallenges: true', () => {
    window.openChallenges()
    expect(mockSetState).toHaveBeenCalledWith({ showChallenges: true })
  })

  it('closeChallenges calls setState with showChallenges: false', () => {
    window.closeChallenges()
    expect(mockSetState).toHaveBeenCalledWith({ showChallenges: false })
  })

  it('setChallengeTab sets challengeTab', () => {
    window.setChallengeTab('weekly')
    expect(mockSetState).toHaveBeenCalledWith({ challengeTab: 'weekly' })
  })

  it('toggleThumbHistory toggles showThumbHistory', () => {
    mockGetState.mockReturnValue({ showThumbHistory: false })
    window.toggleThumbHistory()
    expect(mockSetState).toHaveBeenCalledWith({ showThumbHistory: true })
  })

  it('toggleThumbHistory from true to false', () => {
    mockGetState.mockReturnValue({ showThumbHistory: true })
    window.toggleThumbHistory()
    expect(mockSetState).toHaveBeenCalledWith({ showThumbHistory: false })
  })
})

describe('gamification handlers — shop', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('openShop calls setState with showShop: true', () => {
    window.openShop()
    expect(mockSetState).toHaveBeenCalledWith({ showShop: true })
  })

  it('closeShop calls setState with showShop: false', () => {
    window.closeShop()
    expect(mockSetState).toHaveBeenCalledWith({ showShop: false })
  })

  it('setShopCategory sets shopCategory', () => {
    window.setShopCategory('avatars')
    expect(mockSetState).toHaveBeenCalledWith({ shopCategory: 'avatars' })
  })

  it('showMyRewards navigates to rewards', () => {
    window.showMyRewards()
    expect(mockSetState).toHaveBeenCalledWith({ showShop: false, showMyRewards: true })
  })

  it('openMyRewards opens rewards', () => {
    window.openMyRewards()
    expect(mockSetState).toHaveBeenCalledWith({ showShop: false, showMyRewards: true })
  })

  it('closeMyRewards closes rewards', () => {
    window.closeMyRewards()
    expect(mockSetState).toHaveBeenCalledWith({ showMyRewards: false })
  })

  it('equipAvatar sets avatar in state', () => {
    window.equipAvatar('avatar_pirate')
    expect(mockSetState).toHaveBeenCalledWith({ avatar: 'avatar_pirate' })
  })

  it('activateBooster does not throw', () => {
    expect(() => window.activateBooster('booster_xp')).not.toThrow()
  })
})

describe('gamification handlers — stats', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('openStats calls setState with showStats: true', () => {
    window.openStats()
    expect(mockSetState).toHaveBeenCalledWith({ showStats: true })
  })

  it('closeStats calls setState with showStats: false', () => {
    window.closeStats()
    expect(mockSetState).toHaveBeenCalledWith({ showStats: false })
  })
})

describe('gamification handlers — friend challenges', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('createFriendChallenge calls createChallenge and does not throw', async () => {
    const { createChallenge } = await import('../../src/services/friendChallenges.js')
    await window.createFriendChallenge('friend1', 'checkins', 10, 7)
    expect(createChallenge).toHaveBeenCalledWith('friend1', 'checkins', 10, 7)
  })

  it('acceptFriendChallenge calls acceptChallenge', async () => {
    const { acceptChallenge } = await import('../../src/services/friendChallenges.js')
    await window.acceptFriendChallenge('ch1')
    expect(acceptChallenge).toHaveBeenCalledWith('ch1')
  })

  it('declineFriendChallenge calls declineChallenge', async () => {
    const { declineChallenge } = await import('../../src/services/friendChallenges.js')
    await window.declineFriendChallenge('ch1')
    expect(declineChallenge).toHaveBeenCalledWith('ch1')
  })

  it('cancelFriendChallenge calls cancelChallenge', async () => {
    const { cancelChallenge } = await import('../../src/services/friendChallenges.js')
    await window.cancelFriendChallenge('ch1')
    expect(cancelChallenge).toHaveBeenCalledWith('ch1')
  })

  it('syncFriendChallenges calls syncChallengeProgress', async () => {
    const { syncChallengeProgress } = await import('../../src/services/friendChallenges.js')
    await window.syncFriendChallenges()
    expect(syncChallengeProgress).toHaveBeenCalled()
  })

  it('getActiveFriendChallenges returns challenges', async () => {
    const result = await window.getActiveFriendChallenges()
    expect(Array.isArray(result)).toBe(true)
  })

  it('getPendingFriendChallenges returns challenges', async () => {
    const result = await window.getPendingFriendChallenges()
    expect(Array.isArray(result)).toBe(true)
  })

  it('getChallengeStats returns stats object', async () => {
    const result = await window.getChallengeStats()
    expect(typeof result).toBe('object')
  })

  it('getChallengeTypes returns types', async () => {
    const result = await window.getChallengeTypes()
    expect(Array.isArray(result)).toBe(true)
  })
})

describe('gamification handlers — team challenges', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('openTeamChallenges calls setState', () => {
    window.openTeamChallenges()
    expect(mockSetState).toHaveBeenCalledWith({ showTeamChallenges: true })
  })

  it('closeTeamChallenges calls setState', () => {
    window.closeTeamChallenges()
    expect(mockSetState).toHaveBeenCalledWith({ showTeamChallenges: false })
  })

  it('openCreateTeam calls setState', () => {
    window.openCreateTeam()
    expect(mockSetState).toHaveBeenCalledWith({ showCreateTeam: true })
  })

  it('closeCreateTeam calls setState', () => {
    window.closeCreateTeam()
    expect(mockSetState).toHaveBeenCalledWith({ showCreateTeam: false })
  })

  it('handleCreateTeam shows error when name is empty', async () => {
    document.body.innerHTML = '<input id="create-team-name" value="" />'
    await window.handleCreateTeam()
    expect(window.showToast).toHaveBeenCalled()
  })

  it('handleCreateTeam calls createTeam when name provided', async () => {
    document.body.innerHTML = '<input id="create-team-name" value="My Team" /><input id="create-team-desc" value="desc" /><input id="create-team-avatar" value="users" />'
    const { createTeam } = await import('../../src/services/teamChallenges.js')
    await window.handleCreateTeam()
    expect(createTeam).toHaveBeenCalledWith(expect.objectContaining({ name: 'My Team' }))
  })

  it('createTeamAction calls createTeam', async () => {
    const { createTeam } = await import('../../src/services/teamChallenges.js')
    await window.createTeamAction({ name: 'Team A' })
    expect(createTeam).toHaveBeenCalled()
  })

  it('joinTeamAction calls joinTeam', async () => {
    const { joinTeam } = await import('../../src/services/teamChallenges.js')
    await window.joinTeamAction('t1')
    expect(joinTeam).toHaveBeenCalled()
  })

  it('leaveTeamAction calls leaveTeam', async () => {
    const { leaveTeam } = await import('../../src/services/teamChallenges.js')
    await window.leaveTeamAction('t1')
    expect(leaveTeam).toHaveBeenCalled()
  })

  it('startTeamChallengeAction calls startTeamChallenge', async () => {
    const { startTeamChallenge } = await import('../../src/services/teamChallenges.js')
    await window.startTeamChallengeAction('t1', 'spots', 20)
    expect(startTeamChallenge).toHaveBeenCalled()
  })
})

describe('gamification handlers — profile customization', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('openProfileCustomization calls setState', () => {
    window.openProfileCustomization()
    expect(mockSetState).toHaveBeenCalledWith({ showProfileCustomization: true })
  })

  it('closeProfileCustomization calls setState', () => {
    window.closeProfileCustomization()
    expect(mockSetState).toHaveBeenCalledWith({ showProfileCustomization: false })
  })

  it('equipFrameAction calls equipFrame', async () => {
    const { equipFrame } = await import('../../src/services/profileCustomization.js')
    await window.equipFrameAction('frame_gold')
    expect(equipFrame).toHaveBeenCalledWith('frame_gold')
  })

  it('equipTitleAction calls equipTitle', async () => {
    const { equipTitle } = await import('../../src/services/profileCustomization.js')
    await window.equipTitleAction('title_pro')
    expect(equipTitle).toHaveBeenCalledWith('title_pro')
  })
})

describe('gamification handlers — animations', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('showSuccessAnimation calls animations module', async () => {
    const { showSuccessAnimation } = await import('../../src/utils/animations.js')
    await window.showSuccessAnimation('check-in')
    expect(showSuccessAnimation).toHaveBeenCalled()
  })

  it('showErrorAnimation calls animations module', async () => {
    const { showErrorAnimation } = await import('../../src/utils/animations.js')
    await window.showErrorAnimation('network')
    expect(showErrorAnimation).toHaveBeenCalled()
  })

  it('showBadgeUnlock calls showBadgeUnlockAnimation', async () => {
    const { showBadgeUnlockAnimation } = await import('../../src/utils/animations.js')
    await window.showBadgeUnlock({ id: 'b1', name: 'Pioneer' })
    expect(showBadgeUnlockAnimation).toHaveBeenCalled()
  })

  it('showLevelUp calls showLevelUpAnimation', async () => {
    const { showLevelUpAnimation } = await import('../../src/utils/animations.js')
    await window.showLevelUp(5)
    expect(showLevelUpAnimation).toHaveBeenCalled()
  })

  it('showPoints calls showPointsAnimation', async () => {
    const { showPointsAnimation } = await import('../../src/utils/animations.js')
    await window.showPoints(50)
    expect(showPointsAnimation).toHaveBeenCalled()
  })

  it('playSound calls playSound from animations', async () => {
    const { playSound } = await import('../../src/utils/animations.js')
    await window.playSound('badge')
    expect(playSound).toHaveBeenCalled()
  })

  it('launchConfetti calls confetti module', async () => {
    const { launchConfetti } = await import('../../src/utils/confetti.js')
    await window.launchConfetti()
    expect(launchConfetti).toHaveBeenCalled()
  })

  it('launchConfettiBurst calls confettiBurst module', async () => {
    const { launchConfettiBurst } = await import('../../src/utils/confetti.js')
    await window.launchConfettiBurst()
    expect(launchConfettiBurst).toHaveBeenCalled()
  })
})
