/**
 * Auth, Identity Verification, and Welcome/Profile handlers
 */

// Auth handlers
window.openAuth = (reason) => {
  const updates = { showAuth: true }
  if (reason) updates.showAuthReason = reason
  window.setState(updates)
}

// Auth stubs — overridden by Auth.js when lazy-loaded
// These ensure onclick handlers work even before Auth.js finishes loading
if (!window.setAuthMode) {
  window.setAuthMode = (mode) => {
    window.setState({ authMode: mode })
    window._forceRender?.()
  }
}
if (!window.signIn) {
  const _stubSignIn = async () => {
    try {
      await import('../components/modals/Auth.js')
      // Auth.js defines window.signIn — call it if it replaced the stub
      if (window.signIn !== _stubSignIn) window.signIn()
    } catch { /* no-op */ }
  }
  window.signIn = _stubSignIn
}
if (!window.signUp) {
  const _stubSignUp = async () => {
    try {
      await import('../components/modals/Auth.js')
      if (window.signUp !== _stubSignUp) window.signUp()
    } catch { /* no-op */ }
  }
  window.signUp = _stubSignUp
}
if (!window.closeAuth) {
  window.closeAuth = () => window.setState({ showAuth: false, authPendingAction: null, showAuthReason: null })
}
// setAuthMode — canonical in Auth.js
// Email login/signup is handled by Auth.js via window.handleAuth (with executePendingAction)
// Social auth handlers are defined in Auth.js (handleGoogleSignIn, handleAppleSignIn, handleFacebookSignIn)
// Fallback registrations in case Auth.js hasn't loaded yet
if (!window.handleGoogleSignIn) {
  window.handleGoogleSignIn = async () => {
    const { getFirebase } = window._appInternals
    const t = window.t
    // Google Sign-In uses redirect (not popup) to avoid COOP issues.
    // The page navigates to Google, then comes back.
    // checkRedirectResult() handles the result on return.
    try {
      const fb = await getFirebase()
      fb.initializeFirebase()

      // Save pending action so it survives the redirect
      const pendingAction = window.getState().authPendingAction
      if (pendingAction) {
        sessionStorage.setItem('spothitch_auth_pending_action', pendingAction)
      }

      // This navigates the page away to Google
      await fb.signInWithGoogle()
    } catch (e) {
      console.error('Google sign in error:', e)
      window.showToast(t('googleLoginError') || 'Google login error', 'error')
    }
  }
}
// Facebook/Apple sign-in — hidden until configured (Facebook needs Dev App, Apple needs $99/yr account)
if (!window.handleFacebookSignIn) {
  window.handleFacebookSignIn = async () => { /* not yet configured */ }
}
if (!window.handleAppleSignIn) {
  window.handleAppleSignIn = async () => { /* not yet configured */ }
}
// Auth fallbacks — overridden by Auth.js/Profile.js when loaded
if (!window.handleForgotPassword) {
  window.handleForgotPassword = async () => {
    const { getFirebase } = window._appInternals
    const t = window.t
    const email = document.querySelector('[name="email"]')?.value || document.getElementById('auth-email')?.value
    if (!email) { window.showToast(t('enterEmailFirst') || 'Enter your email first', 'warning'); return }
    // Validate email format before sending
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) { window.showToast(t('invalidEmail') || 'Invalid email format', 'warning'); return }
    const fb = await getFirebase()
    fb.initializeFirebase()
    const result = await fb.resetPassword(email)
    if (result.success) window.showToast(t('resetEmailSent') || 'Password reset email sent!', 'success')
    else window.showToast(t('sendError') || 'Error sending email', 'error')
  }
}
if (!window.handleLogout) {
  window.handleLogout = async () => {
    const { actions, getFirebase } = window._appInternals
    // Cleanup Firebase subscriptions before logout
    try {
      const [friendsModule, dmModule, gcModule] = await Promise.all([
        import('../services/friends.js'),
        import('../services/directMessages.js'),
        import('../services/groupConversations.js'),
      ])
      friendsModule.unsubscribeFriendsList()
      dmModule.unsubscribeFromAllConversations()
      gcModule.unsubscribeFromAllGroupConversations()
    } catch { /* non-bloquant */ }
    const fb = await getFirebase()
    await fb.logOut()
    actions.setUser(null)
    window.setState({ currentUser: null, userProfile: null, isAdmin: false, isLoggedIn: false })
    window.showToast?.(window.t('logoutSuccess') || 'Déconnexion réussie', 'success')
  }
}
// Progressive Auth Gate — exposed globally
window.requireAuth = (actionName) => {
  const t = window.t
  const { isLoggedIn } = window.getState()
  if (isLoggedIn) return true

  const reasonMap = {
    addSpot: t('authRequiredAddSpot'),
    submitSpot: t('authRequiredAddSpot'),
    validateSpot: t('authRequiredAddSpot'),
    saveFavorite: t('authRequiredFavorite'),
    sos: t('authRequiredSOS'),
    guardian: t('authRequiredGuardian'),
    social: t('authRequiredSocial'),
    tripPlanner: t('authRequiredSocial'),
    checkin: t('authRequiredAddSpot'),
  }
  window.setState({
    showAuth: true,
    authPendingAction: actionName,
    showAuthReason: reasonMap[actionName] || t('loginRequired'),
  })
  // Auto-clear pending action after 5 minutes (prevents stale state)
  setTimeout(() => {
    const current = window.getState?.()?.authPendingAction
    if (current === actionName) {
      window.setState?.({ authPendingAction: null })
    }
  }, 5 * 60 * 1000)
  return false
}

// Age Verification handlers (RGPD/GDPR)
window.openAgeVerification = () => {
  window.setState({ showAgeVerification: true });
  // Initialize the date input field on next render
  setTimeout(() => {
    const initAgeVerification = window.initAgeVerification;
    if (initAgeVerification) initAgeVerification();
  }, 100);
};
window.closeAgeVerification = () => window.setState({ showAgeVerification: false });
window.showAgeVerification = () => window.openAgeVerification();

// Identity Verification handlers (Security - Progressive Trust System 0-5)
window.openIdentityVerification = () => {
  // Reset modal state (use simple property, configurable for clean resets)
  const freshState = {
    currentStep: 'overview',
    phoneNumber: '',
    verificationCode: '',
    photoPreview: null,
    documentType: 'id_card',
    documentPreview: null,
    selfieIdStep: 1,
    selfiePhoto: null,
    idCardPhoto: null,
    selfieWithIdPhoto: null,
    isLoading: false,
    error: null,
  }
  window._ivState = freshState
  window.identityVerificationState = freshState
  window.setState({ showIdentityVerification: true })
};
// closeIdentityVerification — canonical in IdentityVerification.js
window.showIdentityVerification = () => window.openIdentityVerification();

// Identity Verification - New handlers for Selfie + ID flow
window.startIdentityVerification = () => {
  window.openIdentityVerification();
};

window.submitVerificationPhotos = async () => {
  const t = window.t
  const state = window.identityVerificationState;
  if (!state || !state.selfiePhoto || !state.idCardPhoto || !state.selfieWithIdPhoto) {
    window.showToast(t('photosRequired') || 'Toutes les photos sont requises', 'error');
    return;
  }

  const { uploadSelfieIdVerification } = await import('../services/identityVerification.js');
  const result = await uploadSelfieIdVerification({
    selfie: state.selfiePhoto,
    idCard: state.idCardPhoto,
    selfieWithId: state.selfieWithIdPhoto,
  });

  // Clear sensitive photos from memory immediately after upload
  state.selfiePhoto = null
  state.idCardPhoto = null
  state.selfieWithIdPhoto = null
  state.photoPreview = null
  state.documentPreview = null

  if (result.success) {
    window.showToast(t('photosSubmitted') || 'Photos soumises avec succes !', 'success');
    window.closeIdentityVerification();
  } else {
    window.showToast(t('submissionError') || 'Erreur lors de la soumission', 'error');
  }
};

window.getTrustLevel = () => {
  const state = window.getState();
  return state.trustLevel || state.verificationLevel || 0;
};

window.getTrustBadge = async (level = null) => {
  const { getTrustBadge } = await import('../services/identityVerification.js');
  return getTrustBadge(level);
};

// Welcome / Profile Setup handlers
window.selectAvatar = (avatar) => {
  window.setState({ selectedAvatar: avatar })
}
window.completeWelcome = () => {
  const t = window.t
  const usernameInput = document.getElementById('welcome-username')
  const username = usernameInput?.value.trim() || t('traveler') || 'Traveler'
  const { selectedAvatar, pendingProfileAction } = window.getState()
  window.setState({
    username,
    avatar: selectedAvatar || 'thumbs-up',
    showWelcome: false,
    pendingProfileAction: null,
  })
  // Resume the action that required a profile
  if (pendingProfileAction === 'addSpot') {
    setTimeout(() => window.openAddSpot?.(), 300)
  }
}
window.skipWelcome = () => {
  const t = window.t
  // Guard: must be logged in to dismiss landing
  if (!window.getState().isLoggedIn) {
    const section = document.getElementById('landing-auth-section')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
      window.showToast(t('landingMustConnect'), 'error')
      return
    }
  }
  window.setState({ showWelcome: false, pendingProfileAction: null })
}
window.closeWelcome = () => window.setState({ showWelcome: false, pendingProfileAction: null })
// Require profile before contributing — returns true if profile exists
window.requireProfile = (action) => {
  const state = window.getState()
  if (state.username) return true
  window.setState({ showWelcome: true, pendingProfileAction: action || null })
  return false
}
