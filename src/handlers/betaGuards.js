/**
 * Feature Intro Wrappers + Beta Guards
 * Must be imported AFTER all other handlers are defined
 */

// ==================== FEATURE INTRO FIRST-CLICK WRAPPERS ====================
// Show glassmorphism intro on the first use of a feature (then never again)
// Must be set up AFTER all handlers are defined

;(function setupFeatureIntroWrappers() {
  // Si l'utilisateur a déjà des données (username ou points), il est existant
  // → marquer toutes les features comme vues pour ne pas lui montrer les intros
  try {
    const saved = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
    const isExisting = (saved.points > 0 || saved.username) && !localStorage.getItem('spothitch_feature_seen')
    if (isExisting) {
      const seen = {}
      ;['carte','stations','add-spot','profil','amis','chat','carnet','stats','classements','niveaux','conseils','dons','hors-ligne','sos','compagnon','notif-spot','activite-amis','defis','score-confiance','avis-profils','itineraire','radar','quiz','guides','gardien','evenements','auberges'].forEach(id => { seen[id] = Date.now() })
      localStorage.setItem('spothitch_feature_seen', JSON.stringify(seen))
    }
  } catch { /* ignore */ }

  // Available features (add-spot, guides, social) are NOT wrapped
  // They open directly — users vote from the Feedback panel
  // Beta features are wrapped by setupBetaGuards below
  // Beta features are wrapped by setupBetaGuards below
})()

// ==================== BETA GUARDS ====================
// Sur staging/main (VITE_SHOW_BETA absent) : les features beta affichent
// TOUJOURS la fenêtre glassmorphism au lieu de s'ouvrir.
// Sur dev (VITE_SHOW_BETA=true) : les features beta s'ouvrent normalement.
// RÈGLE ABSOLUE : ce bloc doit rester APRÈS setupFeatureIntroWrappers
// pour override les wrappers first-click. Le handler real NE S'OUVRE JAMAIS
// sur staging/main — la fenêtre intro le remplace complètement.

;(function setupBetaGuards() {
  if (import.meta.env.VITE_SHOW_BETA) return // dev : comportement normal

  const guard = (featureId) => () => window.showFeatureIntro?.(featureId)
  const noop = () => {}

  // — GAMIFICATION (tout en beta) —
  window.openBadges = guard('niveaux')
  window.openStats = guard('stats')
  if (!window.openLeaderboard) window.openLeaderboard = guard('classements')
  window.openChallenges = guard('defis')
  window.openQuiz = guard('quiz')
  window.openShop = guard('niveaux')
  window.openDailyReward = guard('niveaux')
  window.openTitles = guard('niveaux')
  window.openMyRewards = guard('niveaux')
  window.openTeamChallenges = guard('defis')
  window.openCreateTeam = guard('defis')
  window.openChallengesHub = guard('defis')
  if (!window.openProgressionStats) window.openProgressionStats = guard('niveaux')
  window.claimDailyReward = noop
  window.openBadgePopup = noop
  if (!window.closeBadges) window.closeBadges = noop
  if (!window.closeChallenges) window.closeChallenges = noop
  if (!window.closeShop) window.closeShop = noop
  if (!window.closeDailyReward) window.closeDailyReward = noop
  if (!window.closeTitles) window.closeTitles = noop
  // openLeaderboard est aussi override via guard ci-dessus (ligne 2948)

  // — SOS (beta) — guard only if not already defined by sos.js
  window.openSOS = guard('sos')
  if (!window.closeSOS) window.closeSOS = noop
  if (!window.shareSOSLocation) window.shareSOSLocation = noop
  if (!window.markSafe) window.markSafe = noop
  if (!window.triggerSOS) window.triggerSOS = noop
  if (!window.shareSOSLink) window.shareSOSLink = noop
  if (!window.addEmergencyContact) window.addEmergencyContact = guard('sos')
  if (!window.removeEmergencyContact) window.removeEmergencyContact = noop

  // — COMPAGNON (beta) —
  window.showCompanionModal = guard('compagnon')
  window.openCompanion = guard('compagnon')
  window.startCompanion = guard('compagnon')
  window.stopCompanion = noop
  window.closeCompanionModal = noop
  window.closeCompanion = noop
  window.companionCheckIn = guard('compagnon')
  window.companionSendAlert = guard('compagnon')

  // — CHAT PAR ZONE (beta) — intercept changeTab('chat')
  const _origChangeTabBeta = window.changeTab
  window.changeTab = (tab, ...args) => {
    if (tab === 'chat') return window.showFeatureIntro?.('chat')
    return _origChangeTabBeta?.(tab, ...args)
  }

  // — PANNEAUX VILLE (beta) —
  window.openCityPanel = guard('villes')

  // — PLANIFICATEUR ITINÉRAIRE (beta) —
  window.openTripPlanner = guard('itineraire')

  // — RADAR / AMIS SUR CARTE (beta) —
  window.toggleNearbyFriends = guard('radar')
  window.openNearbyFriends = guard('radar')
  window.closeNearbyFriends = noop

  // — ÉVÉNEMENTS (beta) — intercept setSocialTab('evenements')
  const _origSetSocialTab = window.setSocialTab
  if (!window.setSocialTab) window.setSocialTab = (tab, ...args) => {
    if (tab === 'evenements') return window.showFeatureIntro?.('evenements')
    return _origSetSocialTab?.(tab, ...args)
  }

  // — VÉRIFICATION IDENTITÉ (beta) —
  window.openIdentityVerification = guard('score-confiance')
  window.showIdentityVerification = guard('score-confiance')
  window.startIdentityVerification = noop
  if (!window.closeIdentityVerification) window.closeIdentityVerification = noop

  // — FAQ (beta) —
  window.openFAQ = guard('score-confiance')
  window.closeFAQ = noop

  // — GROUPES DE CONVERSATION (beta) —
  if (!window.openGroupConversation) window.openGroupConversation = guard('chat')
  if (!window.openCreateGroupConversation) window.openCreateGroupConversation = guard('chat')
  if (!window.closeCreateGroupConversation) window.closeCreateGroupConversation = noop
  if (!window.createGroupConversation) window.createGroupConversation = noop
  if (!window.leaveGroupConversation) window.leaveGroupConversation = noop
  if (!window.addMemberToGroupConversation) window.addMemberToGroupConversation = noop
  if (!window.sendGroupConversationMessage) window.sendGroupConversationMessage = noop

  // — PERSONNALISATION PROFIL — edit is live, customization (frames/titles) is beta
  // openProfileCustomization NOT guarded — profile editing works

  // — RÉFÉRENCES DE VOYAGE (beta) —
  if (!window.openReferences) window.openReferences = guard('score-confiance')
  if (!window.closeReferences) window.closeReferences = noop
})()
