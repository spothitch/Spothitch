/**
 * Gamification Handlers
 * Quiz, badges, daily rewards, challenges, shop, stats
 */

// Quiz handlers (lazy-loaded)
window.openQuiz = () => window.setState({ showQuiz: true })
window.closeQuiz = () => window.setState({
  showQuiz: false, quizActive: false, quizResult: null, quizCountryCode: null, quizShowExplanation: false
})
window.startQuizGame = async () => {
  const { startQuiz } = await import('../services/quiz.js')
  await startQuiz()
}
window.startCountryQuiz = async (countryCode) => {
  const { startQuiz } = await import('../services/quiz.js')
  await startQuiz(countryCode)
}
window.answerQuizQuestion = async (answerIndex) => {
  const { answerQuestion } = await import('../services/quiz.js')
  answerQuestion(answerIndex)
}
window.nextQuizQuestion = async () => {
  const { nextQuizQuestion } = await import('../services/quiz.js')
  nextQuizQuestion()
}
window.retryQuiz = async () => {
  const { startQuiz } = await import('../services/quiz.js')
  await startQuiz()
}
window.showCountryQuizSelection = () => {
  window.setState({ quizActive: false, quizResult: null, quizCountryCode: null, quizShowExplanation: false });
};

// Badge handlers
window.openBadges = () => window.setState({ showBadges: true });
window.closeBadges = () => window.setState({ showBadges: false });
window.showBadgeDetail = (badgeId) => window.setState({ showBadgeDetail: true, selectedBadgeId: badgeId });
window.closeBadgeDetail = () => window.setState({ showBadgeDetail: false, selectedBadgeId: null });
window.dismissBadgePopup = () => window.setState({ showBadgePopup: false, newBadge: null });
window.closeBadgePopup = () => window.setState({ showBadgePopup: false, newBadge: null });
window.openBadgePopup = (badge) => window.setState({ showBadgePopup: true, newBadge: badge });

// Daily reward
window.openDailyReward = () => window.setState({ showDailyReward: true });
// closeDailyReward — canonical in DailyReward.js
// closeDailyRewardResult — canonical in DailyReward.js

// Challenge handlers
window.openChallenges = () => window.setState({ showChallenges: true });
window.closeChallenges = () => window.setState({ showChallenges: false });
window.setChallengeTab = (tab) => window.setState({ challengeTab: tab });

// Thumb History toggle
window.toggleThumbHistory = () => {
  const s = window.getState();
  window.setState({ showThumbHistory: !s.showThumbHistory });
};

// Shop handlers
window.openShop = () => window.setState({ showShop: true });
window.closeShop = () => window.setState({ showShop: false });
window.setShopCategory = (category) => window.setState({ shopCategory: category });
// redeemReward — canonical in Shop.js
window.showMyRewards = () => window.setState({ showShop: false, showMyRewards: true });
window.openMyRewards = () => window.setState({ showShop: false, showMyRewards: true });
window.closeMyRewards = () => window.setState({ showMyRewards: false });
window.equipAvatar = (avatar) => {
  window.setState({ avatar });
};
// equipFrame — canonical in profileCustomization.js
// equipTitle — canonical in profileCustomization.js
window.activateBooster = (_boosterId) => {
  // Activate booster logic
};

// Stats handlers
window.openStats = () => window.setState({ showStats: true });
window.closeStats = () => window.setState({ showStats: false });

// Friend Challenges handlers (#157) — lazy-loaded
window.createFriendChallenge = async (friendId, typeId, target = null, durationDays = 7) => {
  const { trackPageView } = await import('../utils/seo.js')
  const { createChallenge } = await import('../services/friendChallenges.js')
  const challenge = createChallenge(friendId, typeId, target, durationDays)
  if (challenge) {
    trackPageView('/action/challenge_created')
  }
}

window.acceptFriendChallenge = async (challengeId) => {
  const { trackPageView } = await import('../utils/seo.js')
  const { acceptChallenge } = await import('../services/friendChallenges.js')
  const success = acceptChallenge(challengeId)
  if (success) {
    trackPageView('/action/challenge_accepted')
  }
}

window.declineFriendChallenge = async (challengeId) => {
  const { trackPageView } = await import('../utils/seo.js')
  const { declineChallenge } = await import('../services/friendChallenges.js')
  const success = declineChallenge(challengeId)
  if (success) {
    trackPageView('/action/challenge_declined')
  }
}

window.cancelFriendChallenge = async (challengeId) => {
  const { trackPageView } = await import('../utils/seo.js')
  const { cancelChallenge } = await import('../services/friendChallenges.js')
  const success = cancelChallenge(challengeId)
  if (success) {
    trackPageView('/action/challenge_cancelled')
  }
}

window.syncFriendChallenges = async () => {
  const { syncChallengeProgress } = await import('../services/friendChallenges.js')
  syncChallengeProgress()
}

window.getActiveFriendChallenges = async () => {
  const { getActiveChallenges } = await import('../services/friendChallenges.js')
  return getActiveChallenges()
}
window.getPendingFriendChallenges = async () => {
  const { getPendingChallenges } = await import('../services/friendChallenges.js')
  return getPendingChallenges()
}
window.getChallengeStats = async () => {
  const { getChallengeStats } = await import('../services/friendChallenges.js')
  return getChallengeStats()
}
window.getChallengeTypes = async () => {
  const { getChallengeTypes } = await import('../services/friendChallenges.js')
  return getChallengeTypes()
}

// Team challenges handlers — STUBS (canonical here, teamChallenges.js removed its duplicate)
window.openTeamChallenges = () => window.setState({ showTeamChallenges: true })
window.closeTeamChallenges = () => window.setState({ showTeamChallenges: false })
window.openCreateTeam = () => window.setState({ showCreateTeam: true })
window.closeCreateTeam = () => window.setState({ showCreateTeam: false })
window.handleCreateTeam = async () => {
  const t = window.t
  const nameInput = document.getElementById('create-team-name')
  const descInput = document.getElementById('create-team-desc')
  const avatarInput = document.getElementById('create-team-avatar')
  const name = nameInput?.value?.trim()
  if (!name) {
    window.showToast(t('teamNameRequired') || 'Le nom de l\'équipe est obligatoire', 'error')
    nameInput?.focus()
    return
  }
  const { createTeam } = await import('../services/teamChallenges.js')
  const team = createTeam({ name, description: descInput?.value?.trim() || '', avatar: avatarInput?.value || 'users' })
  if (team) window.setState({ showCreateTeam: false })
}
window.createTeamAction = async (...args) => {
  const { createTeam } = await import('../services/teamChallenges.js')
  return createTeam(...args)
}
window.joinTeamAction = async (...args) => {
  const { joinTeam } = await import('../services/teamChallenges.js')
  return joinTeam(...args)
}
window.leaveTeamAction = async (...args) => {
  const { leaveTeam } = await import('../services/teamChallenges.js')
  return leaveTeam(...args)
}
window.startTeamChallengeAction = async (...args) => {
  const { startTeamChallenge } = await import('../services/teamChallenges.js')
  return startTeamChallenge(...args)
}

// Profile customization handlers — STUBS
window.openProfileCustomization = () => window.setState({ showProfileCustomization: true })
window.closeProfileCustomization = () => window.setState({ showProfileCustomization: false })
window.equipFrameAction = async (...args) => {
  const { equipFrame } = await import('../services/profileCustomization.js')
  return equipFrame(...args)
}
window.equipTitleAction = async (...args) => {
  const { equipTitle } = await import('../services/profileCustomization.js')
  return equipTitle(...args)
}

// Animation handlers (global) — lazy-loaded
window.showSuccessAnimation = async (...args) => {
  const { showSuccessAnimation } = await import('../utils/animations.js')
  showSuccessAnimation(...args)
}
window.showErrorAnimation = async (...args) => {
  const { showErrorAnimation } = await import('../utils/animations.js')
  showErrorAnimation(...args)
}
window.showBadgeUnlock = async (...args) => {
  const { showBadgeUnlockAnimation } = await import('../utils/animations.js')
  showBadgeUnlockAnimation(...args)
}
window.showLevelUp = async (...args) => {
  const { showLevelUpAnimation } = await import('../utils/animations.js')
  showLevelUpAnimation(...args)
}
window.showPoints = async (...args) => {
  const { showPointsAnimation } = await import('../utils/animations.js')
  showPointsAnimation(...args)
}
window.playSound = async (...args) => {
  const { playSound } = await import('../utils/animations.js')
  playSound(...args)
}
window.launchConfetti = async (...args) => {
  const { launchConfetti } = await import('../utils/confetti.js')
  launchConfetti(...args)
}
window.launchConfettiBurst = async (...args) => {
  const { launchConfettiBurst } = await import('../utils/confetti.js')
  launchConfettiBurst(...args)
}
