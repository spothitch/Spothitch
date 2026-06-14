/**
 * Auth Modal Component
 * Login and registration with social providers + progressive auth gate
 */

import { t } from '../../i18n/index.js'
import { icon } from '../../utils/icons.js'
import { ADMIN_EMAILS } from '../../utils/constants.js'

export function renderAuth(state) {
  const reason = state.showAuthReason || null
  const isSignUp = state.authMode === 'register'

  return `
    <div
      class="fixed inset-0 z-[110] flex items-center justify-center p-4"
      onclick="closeAuth()"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
     tabindex="0">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true"></div>

      <!-- Modal -->
      <div
        class="relative modal-panel rounded-3xl w-full max-w-md overflow-hidden slide-up max-h-[90vh] overflow-y-auto"
        onclick="event.stopPropagation()">
        <!-- Close -->
        <button
          onclick="closeAuth()"
          class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="${t('close') || 'Close'}"
          type="button"
        >
          ${icon('x', 'w-5 h-5')}
        </button>

        <!-- Header -->
        <div class="px-6 pt-4 pb-3 text-center">
          <div class="flex justify-center mb-2" aria-hidden="true">${icon("thumbs-up", "w-8 h-8 text-amber-400")}</div>
          <h2 id="auth-modal-title" class="text-xl font-bold gradient-text">
            ${isSignUp ? t('signUpTitle') : t('signInTitle')}
          </h2>
          ${reason ? `
            <p class="mt-2 text-sm text-amber-400/90 bg-amber-500/10 rounded-xl px-4 py-2 inline-block">
              ${reason}
            </p>
          ` : ''}
        </div>

        <!-- Social Login Buttons — hidden during alpha (email only) -->
        <!-- Google + Facebook will be enabled when app is on stores -->

        <!-- Tabs -->
        <div class="flex mx-6 mb-4 rounded-xl bg-white/5 p-1" role="tablist" aria-label="${t('authMode') || 'Authentication mode'}">
          <button
            onclick="setAuthMode('login')"
            class="flex-1 py-2 text-center text-sm rounded-lg transition-colors ${!isSignUp ? 'bg-primary-500/20 text-primary-400 font-medium' : 'text-slate-400 hover:text-white'}"
            data-mode="login"
            id="auth-tab-login"
            role="tab"
            aria-selected="${!isSignUp}"
            aria-controls="auth-form"
            type="button"
          >
            ${t('signInButton')}
          </button>
          <button
            onclick="setAuthMode('register')"
            class="flex-1 py-2 text-center text-sm rounded-lg transition-colors ${isSignUp ? 'bg-primary-500/20 text-primary-400 font-medium' : 'text-slate-400 hover:text-white'}"
            data-mode="register"
            id="auth-tab-register"
            role="tab"
            aria-selected="${isSignUp}"
            aria-controls="auth-form"
            type="button"
          >
            ${t('signUpButton')}
          </button>
        </div>

        <!-- Form -->
        <div class="px-6 pb-4" role="tabpanel" id="auth-form-panel">
          <form id="auth-form" onsubmit="handleAuth(event)" class="space-y-4" aria-label="${t('loginForm') || 'Login form'}">
            <!-- First Name + Last Name (Register only) -->
            ${isSignUp ? `
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label for="auth-firstname" class="text-sm text-slate-400 block mb-1.5">${t('firstName')} <span class="text-red-400">*</span></label>
                  <input
                    type="text"
                    id="auth-firstname"
                    name="firstname"
                    class="input-modern"
                    placeholder="${t('firstNamePlaceholder')}"
                    maxlength="30"
                    minlength="2"
                    required
                    autocomplete="given-name"
                    aria-required="true"
                  />
                </div>
                <div>
                  <label for="auth-lastname" class="text-sm text-slate-400 block mb-1.5">${t('lastName')} <span class="text-red-400">*</span></label>
                  <input
                    type="text"
                    id="auth-lastname"
                    name="lastname"
                    class="input-modern"
                    placeholder="${t('lastNamePlaceholder')}"
                    maxlength="30"
                    minlength="2"
                    required
                    autocomplete="family-name"
                    aria-required="true"
                  />
                </div>
              </div>
            ` : ''}

            <!-- Email -->
            <div>
              <label for="auth-email" class="text-sm text-slate-400 block mb-1.5">${t('emailPlaceholder')}</label>
              <input
                type="email"
                id="auth-email"
                name="email"
                class="input-modern"
                placeholder="${t('emailPlaceholder')}"
                required
                autocomplete="email"
                aria-required="true"
              />
            </div>

            <!-- Password -->
            <div>
              <label for="auth-password" class="text-sm text-slate-400 block mb-1.5">${t('passwordPlaceholder')}</label>
              <input
                type="password"
                id="auth-password"
                name="password"
                class="input-modern"
                placeholder="${t('passwordPlaceholder')}"
                required
                minlength="6"
                autocomplete="${isSignUp ? 'new-password' : 'current-password'}"
                aria-required="true"
                aria-describedby="password-hint"
              />
              ${isSignUp ? `<p id="password-hint" class="text-[10px] text-slate-500 mt-1.5 leading-relaxed">${t('passwordRules') || 'Min. 6 caracteres, 1 majuscule, 1 chiffre'}</p>` : `<span id="password-hint" class="sr-only">${t('weakPassword')}</span>`}
            </div>

            <!-- Confirm Password (Register only) -->
            ${isSignUp ? `
              <div>
                <label for="auth-password-confirm" class="text-sm text-slate-400 block mb-1.5">${t('confirmPassword')}</label>
                <input
                  type="password"
                  id="auth-password-confirm"
                  name="password-confirm"
                  class="input-modern"
                  placeholder="${t('confirmPassword')}"
                  minlength="6"
                  autocomplete="new-password"
                  required
                  aria-required="true"
                />
              </div>
            ` : ''}

            <!-- Birth Year (Register only) -->
            ${isSignUp ? `
              <div>
                <label for="auth-birthyear" class="text-sm text-slate-400 block mb-1.5">${t('birthYear')} <span class="text-red-400">*</span></label>
                <input
                  type="number"
                  id="auth-birthyear"
                  name="birthyear"
                  class="input-modern"
                  placeholder="${t('birthYearPlaceholder')}"
                  min="1920"
                  max="${new Date().getFullYear() - 16}"
                  required
                  inputmode="numeric"
                  aria-required="true"
                />
              </div>
            ` : ''}

            <!-- Gender (Register only) -->
            ${isSignUp ? `
              <div>
                <label for="auth-gender" class="text-sm text-slate-400 block mb-1.5">${t('gender')}</label>
                <select id="auth-gender" name="gender" class="input-modern">
                  <option value="">${t('genderPreferNotToSay')}</option>
                  <option value="female">${t('genderFemale')}</option>
                  <option value="male">${t('genderMale')}</option>
                  <option value="non-binary">${t('genderNonBinary')}</option>
                </select>
              </div>
            ` : ''}

            <!-- @Pseudo — optional (Register only) -->
            ${isSignUp ? `
              <div>
                <label for="auth-pseudo" class="text-sm text-slate-400 block mb-1.5">${t('usernameLabel')}</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">@</span>
                  <input
                    type="text"
                    id="auth-pseudo"
                    name="pseudo"
                    class="input-modern pl-8"
                    placeholder="${t('usernamePlaceholder')}"
                    maxlength="20"
                    minlength="3"
                    autocomplete="username"
                    aria-describedby="pseudo-status"
                    oninput="checkUsernameField(this.value)"
                  />
                </div>
                <div id="pseudo-status" class="text-xs mt-1 h-4" aria-live="polite"></div>
                <p class="text-[10px] text-slate-500 mt-0.5">${t('usernameOptionalHint')}</p>
              </div>
            ` : ''}

            <!-- Forgot Password (Login only) -->
            ${!isSignUp ? `
              <div class="text-right">
                <button
                  type="button"
                  onclick="handleForgotPassword()"
                  class="text-primary-400 text-sm hover:underline"
                >
                  ${t('forgotPassword')}
                </button>
              </div>
            ` : ''}

            <!-- Error message area -->
            <div id="auth-error-msg" class="hidden text-red-400 text-sm text-center py-2 px-3 bg-red-500/10 rounded-xl"></div>

            <!-- Submit -->
            <button
              type="submit"
              class="btn btn-primary w-full"
              id="auth-submit-btn"
            >
              <span id="auth-submit-text">${isSignUp ? t('signUpButton') : t('signInButton')}</span>
            </button>
          </form>

          <!-- Switch mode text -->
          <p class="text-center text-sm text-slate-400 mt-4">
            ${isSignUp ? t('switchToSignIn') : t('switchToSignUp')}
            <button
              type="button"
              onclick="setAuthMode('${isSignUp ? 'login' : 'register'}')"
              class="text-primary-400 hover:underline ml-1 font-medium"
            >
              ${isSignUp ? t('signInButton') : t('signUpButton')}
            </button>
          </p>

          <!-- Skip / Continue without account -->
          <div class="text-center mt-3 pb-4">
            <button
              type="button"
              onclick="closeAuth()"
              class="text-slate-400 text-sm hover:text-slate-200 transition-colors underline underline-offset-2"
            >
              ${t('continueWithoutAccount')}
            </button>
          </div>
        </div>

        <!-- Admin auto-detected by email, no demo button needed -->
      </div>
    </div>
  `
}

/**
 * Complete Profile Modal — shown after Google sign-in (first time)
 * Asks for @pseudo + birthYear + gender
 */
export function renderCompleteProfile(_state) {
  // Pre-fill from Google displayName if available
  const googleName = _state?.currentUser?.displayName || _state?.user?.displayName || ''
  const parts = googleName.split(' ')
  const prefillFirst = parts[0] || ''
  const prefillLast = parts.length > 1 ? parts.slice(1).join(' ') : ''
  return `
    <div
      class="fixed inset-0 z-[110] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="complete-profile-title"
      tabindex="0">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true"></div>
      <div
        class="relative modal-panel rounded-3xl w-full max-w-md overflow-hidden slide-up max-h-[90vh] overflow-y-auto"
        onclick="event.stopPropagation()">
        <div class="p-6 pb-4 text-center">
          <div class="flex justify-center mb-3" aria-hidden="true">${icon("hand", "w-10 h-10 text-amber-400")}</div>
          <h2 id="complete-profile-title" class="text-2xl font-bold gradient-text">
            ${t('completeYourProfile')}
          </h2>
          <p class="mt-2 text-sm text-slate-400">${t('completeProfileDesc')}</p>
        </div>

        <form id="complete-profile-form" onsubmit="submitCompleteProfile(event)" class="px-6 pb-6 space-y-4">
          <!-- First Name + Last Name -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="cp-firstname" class="text-sm text-slate-400 block mb-1.5">${t('firstName')} <span class="text-red-400">*</span></label>
              <input
                type="text"
                id="cp-firstname"
                name="firstname"
                class="input-modern"
                placeholder="${t('firstNamePlaceholder')}"
                value="${prefillFirst}"
                maxlength="30"
                minlength="2"
                required
                autocomplete="given-name"
                aria-required="true"
              />
            </div>
            <div>
              <label for="cp-lastname" class="text-sm text-slate-400 block mb-1.5">${t('lastName')} <span class="text-red-400">*</span></label>
              <input
                type="text"
                id="cp-lastname"
                name="lastname"
                class="input-modern"
                placeholder="${t('lastNamePlaceholder')}"
                value="${prefillLast}"
                maxlength="30"
                minlength="2"
                required
                autocomplete="family-name"
                aria-required="true"
              />
            </div>
          </div>

          <!-- @Pseudo — optional -->
          <div>
            <label for="cp-pseudo" class="text-sm text-slate-400 block mb-1.5">${t('usernameLabel')}</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">@</span>
              <input
                type="text"
                id="cp-pseudo"
                name="pseudo"
                class="input-modern pl-8"
                placeholder="${t('usernamePlaceholder')}"
                maxlength="20"
                minlength="3"
                autocomplete="username"
                aria-describedby="cp-pseudo-status"
                oninput="checkUsernameField(this.value)"
              />
            </div>
            <div id="cp-pseudo-status" class="text-xs mt-1 h-4" aria-live="polite"></div>
            <p class="text-[10px] text-slate-500 mt-0.5">${t('usernameOptionalHint')}</p>
          </div>

          <!-- Birth Year -->
          <div>
            <label for="cp-birthyear" class="text-sm text-slate-400 block mb-1.5">${t('birthYear')} <span class="text-red-400">*</span></label>
            <input
              type="number"
              id="cp-birthyear"
              name="birthyear"
              class="input-modern"
              placeholder="${t('birthYearPlaceholder')}"
              min="1920"
              max="${new Date().getFullYear() - 16}"
              required
              inputmode="numeric"
              aria-required="true"
            />
          </div>

          <!-- Gender -->
          <div>
            <label for="cp-gender" class="text-sm text-slate-400 block mb-1.5">${t('gender')}</label>
            <select id="cp-gender" name="gender" class="input-modern">
              <option value="">${t('genderPreferNotToSay')}</option>
              <option value="female">${t('genderFemale')}</option>
              <option value="male">${t('genderMale')}</option>
              <option value="non-binary">${t('genderNonBinary')}</option>
            </select>
          </div>

          <!-- Error -->
          <div id="cp-error-msg" class="hidden text-red-400 text-sm text-center py-2 px-3 bg-red-500/10 rounded-xl"></div>

          <!-- Submit -->
          <button type="submit" class="btn btn-primary w-full" id="cp-submit-btn">
            <span id="cp-submit-text">${t('letsGo')}</span>
          </button>
        </form>
      </div>
    </div>
  `
}

// Auth mode state (kept for backward compat with inline handlers in other modals)
window.authMode = 'login'

window.setAuthMode = (mode) => {
  import('../../stores/state.js').then(({ setState }) => {
    setState({ authMode: mode })
    window._forceRender?.()
  })
}

window.handleAuth = async (event) => {
  event.preventDefault()

  const email = document.getElementById('auth-email')?.value.trim()
  const password = document.getElementById('auth-password')?.value
  const submitBtn = document.getElementById('auth-submit-btn')
  const errorDiv = document.getElementById('auth-error-msg')
  const { icon: iconFn } = await import('../../utils/icons.js')

  if (!email || !password) return

  // Client-side brute force protection
  if (!window._authFailCount) window._authFailCount = { count: 0, lockedUntil: 0 }
  if (Date.now() < window._authFailCount.lockedUntil) {
    const mins = Math.ceil((window._authFailCount.lockedUntil - Date.now()) / 60000)
    if (errorDiv) { errorDiv.textContent = t('tooManyAttempts')?.replace('{min}', mins) || `Too many attempts. Try again in ${mins} min.`; errorDiv.classList.remove('hidden') }
    return
  }

  // Hide previous errors
  if (errorDiv) {
    errorDiv.classList.add('hidden')
    errorDiv.textContent = ''
  }

  // Show loading
  if (submitBtn) {
    submitBtn.disabled = true
    submitBtn.innerHTML = iconFn('loader-circle', 'w-5 h-5 animate-spin')
  }

  try {
    const fb = await import('../../services/firebase.js')
    const { showSuccess, showError } = await import('../../services/notifications.js')
    const { setState, getState } = await import('../../stores/state.js')

    fb.initializeFirebase()

    let result
    const { authMode } = getState()

    if (authMode === 'register') {
      const confirmPassword = document.getElementById('auth-password-confirm')?.value
      const firstNameVal = document.getElementById('auth-firstname')?.value?.trim()
      const lastNameVal = document.getElementById('auth-lastname')?.value?.trim()
      const pseudo = document.getElementById('auth-pseudo')?.value?.toLowerCase().trim() || null
      const birthYearStr = document.getElementById('auth-birthyear')?.value
      const gender = document.getElementById('auth-gender')?.value || ''
      const displayName = firstNameVal ? `${firstNameVal} ${(lastNameVal || '').charAt(0)}.` : (t('defaultDisplayName') || 'Hitchhiker')

      // Validate first name + last name
      if (!firstNameVal || firstNameVal.length < 2) {
        if (errorDiv) { errorDiv.textContent = t('firstNameRequired'); errorDiv.classList.remove('hidden') }
        return
      }
      if (!lastNameVal || lastNameVal.length < 2) {
        if (errorDiv) { errorDiv.textContent = t('lastNameRequired'); errorDiv.classList.remove('hidden') }
        return
      }

      // Validate @pseudo only if provided (optional)
      if (pseudo) {
        const pseudoValidation = fb.validateUsername(pseudo)
        if (!pseudoValidation.valid) {
          if (errorDiv) { errorDiv.textContent = t(pseudoValidation.errorKey); errorDiv.classList.remove('hidden') }
          return
        }
      }

      // Enforce password rules: min 6 chars, 1 uppercase, 1 digit
      if (password.length < 6 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
        if (errorDiv) { errorDiv.textContent = t('passwordRequirementsError'); errorDiv.classList.remove('hidden') }
        return
      }

      if (password !== confirmPassword) {
        if (errorDiv) {
          errorDiv.textContent = t('passwordMismatch')
          errorDiv.classList.remove('hidden')
        }
        return
      }

      // Validate birth year
      const birthYear = parseInt(birthYearStr, 10)
      const currentYear = new Date().getFullYear()
      if (!birthYear || birthYear < 1920 || birthYear > currentYear - 16) {
        if (errorDiv) {
          errorDiv.textContent = currentYear - birthYear < 16 ? t('birthYearTooYoung') : t('birthYearInvalid')
          errorDiv.classList.remove('hidden')
        }
        return
      }
      if (currentYear - birthYear < 16) {
        if (errorDiv) {
          errorDiv.textContent = t('birthYearTooYoung')
          errorDiv.classList.remove('hidden')
        }
        return
      }

      // Check username availability before creating account (only if pseudo provided)
      if (pseudo) {
        if (submitBtn) submitBtn.innerHTML = `${iconFn('loader-circle', 'w-5 h-5 animate-spin')} ${t('checkingUsername') || 'Vérification...'}`
        const { available: usernameAvailable } = await fb.checkUsernameAvailability(pseudo)
        if (!usernameAvailable) {
          if (errorDiv) { errorDiv.textContent = t('usernameTaken') || '@' + pseudo + ' est déjà utilisé'; errorDiv.classList.remove('hidden') }
          if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = t('createAccount') || 'Créer mon compte' }
          return
        }
      }

      // Store registration data temporarily for profile creation
      window._pendingRegistrationData = {
        username: pseudo, firstName: firstNameVal,
        lastName: lastNameVal, birthYear, gender: gender || null,
      }

      if (submitBtn) submitBtn.innerHTML = `${iconFn('loader-circle', 'w-5 h-5 animate-spin')} ${t('creatingAccount') || 'Création du compte...'}`
      result = await fb.signUp(email, password, displayName)

      // Reserve username after account creation (only if pseudo provided)
      if (result.success && result.user && pseudo) {
        const reserved = await fb.reserveUsername(pseudo, result.user.uid)
        if (!reserved.success && reserved.error === 'taken') {
          // Race condition: pseudo claimed between check and creation
          // Don't block the account — just continue without the pseudo
          window._pendingRegistrationData.username = null
          if (errorDiv) { errorDiv.textContent = (t('usernameTaken') || 'Pseudo pris') + '. ' + (t('continueWithoutPseudo') || 'Compte créé sans pseudo.'); errorDiv.classList.remove('hidden') }
        }
      }
    } else {
      result = await fb.signIn(email, password)
    }

    if (result.success) {
      const user = result.user
      // Reset brute force counter on success
      if (window._authFailCount) window._authFailCount = { count: 0, lockedUntil: 0 }
      // Block page reloads for 15s after auth (SW update, version.json)
      window._authJustCompleted = Date.now()
      // Create/update Firestore profile
      await fb.createOrUpdateUserProfile(user)
      // Hydrate localStorage with Firestore profile data
      fb.hydrateLocalProfileFromFirestore(user.uid).catch(() => {})

      // Set full user state directly (onAuthStateChanged listener in main.js
      // will also fire, but we set state here for immediate UI feedback)
      const { actions: stateActions } = await import('../../stores/state.js')
      stateActions.setUser(user)

      showSuccess(authMode === 'register' ? (t('accountCreated') || 'Account created!') : (t('loginSuccess') || 'Login successful!'))

      // Auto-dismiss landing if it was showing (connexion obligatoire)
      const wasOnLanding = getState().showLanding

      // Execute pending action if any
      const { authPendingAction } = getState()
      // Persist firstName/lastName from registration data
      const regData = window._pendingRegistrationData || {}
      setState({
        showAuth: false,
        authPendingAction: null,
        showAuthReason: null,
        currentUser: user,
        isAdmin: ADMIN_EMAILS.includes(user.email?.toLowerCase()),
        ...(regData.firstName ? { firstName: regData.firstName } : {}),
        ...(regData.lastName ? { lastName: regData.lastName } : {}),
        ...(regData.username ? { username: regData.username } : {}),
        ...(regData.birthYear ? { birthYear: regData.birthYear } : {}),
        ...(regData.gender ? { gender: regData.gender } : {}),
        userProfile: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        ...(wasOnLanding ? { showLanding: false } : {}),
      })
      if (wasOnLanding) {
        try { localStorage.setItem('spothitch_landing_v2', '1') } catch { /* no-op */ }
      }
      if (authPendingAction) {
        executePendingAction(authPendingAction)
      }
    } else {
      window._pendingRegistrationData = null
      // Track failed attempts for brute force protection
      if (window._authFailCount) {
        window._authFailCount.count++
        if (window._authFailCount.count >= 5) {
          window._authFailCount.lockedUntil = Date.now() + 15 * 60 * 1000 // 15 min lock
          window._authFailCount.count = 0
        }
      }
      const msg = getAuthErrorMessage(result.error)
      if (errorDiv) {
        errorDiv.textContent = msg
        errorDiv.classList.remove('hidden')
      }
      showError(msg)
    }
  } catch (error) {
    window._pendingRegistrationData = null
    console.error('Auth error:', error)
    const { showError } = await import('../../services/notifications.js')
    const detail = getAuthErrorMessage(error?.code || error?.message || error)
    if (errorDiv) {
      errorDiv.textContent = detail
      errorDiv.classList.remove('hidden')
    }
    showError(detail)
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false
      const { getState } = await import('../../stores/state.js')
      const { authMode } = getState()
      submitBtn.innerHTML = `<span id="auth-submit-text">${authMode === 'register' ? t('signUpButton') : t('signInButton')}</span>`
    }
  }
}

// ==================== GIS OVERLAY INIT ====================

let _gisOverlayReady = false

/**
 * Called by afterRender when the Auth modal is visible.
 * Sets up a transparent GIS button overlay on top of the Google button.
 * When GIS works: user clicks → goes directly to Google (no Firebase page).
 * When GIS fails: user clicks → falls through to handleGoogleSignIn (signInWithPopup).
 */
export function initAuthAfterRender() {
  if (_gisOverlayReady) return
  const overlay = document.getElementById('gis-overlay')
  if (!overlay) return

  import('../../services/firebase.js').then(fb => {
    fb.initializeFirebase()
    fb.setupGISOverlay(overlay, (result) => {
      // GIS callback: Google returned a result (success or error)
      _handleGoogleResult(result)
    })
    _gisOverlayReady = true
  }).catch(() => {
    // GIS script failed to load — Google button falls through to handleGoogleSignIn (popup)
    console.warn('[Auth] GIS overlay setup failed — using popup fallback')
  })
}

/**
 * Handle Google sign-in result (shared between GIS overlay and signInWithPopup fallback).
 */
async function _handleGoogleResult(result) {
  const btn = document.getElementById('auth-google-btn')
  try {
    const fb = await import('../../services/firebase.js')
    const { getState, setState } = await import('../../stores/state.js')

    if (result?.success && result.user) {
      const user = result.user
      window._authJustCompleted = Date.now()
      const wasOnLanding = getState().showLanding

      setState({
        currentUser: user,
        isLoggedIn: true,
        user,
        showAuth: false,
        showAuthReason: null,
        isAdmin: ADMIN_EMAILS.includes(user.email?.toLowerCase()),
        userProfile: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        ...(wasOnLanding ? { showLanding: false } : {}),
      })

      if (wasOnLanding) {
        try { localStorage.setItem('spothitch_landing_v2', '1') } catch { /* no-op */ }
      }

      const profileResult = await fb.createOrUpdateUserProfile(user).catch(() => ({ success: false }))
      fb.hydrateLocalProfileFromFirestore(user.uid).catch(() => {})

      const needsProfile = profileResult?.isNew || !profileResult?.hasUsername
      if (needsProfile) {
        setState({ showCompleteProfile: true })
      } else {
        import('../../services/gamification.js').then(m => m.loadPointsFromFirestore?.(user.uid)).catch(() => {})
        const { authPendingAction } = getState()
        if (authPendingAction === 'addSpot') setTimeout(() => window.openAddSpot?.(), 300)
        else if (authPendingAction === 'submitSpot') setTimeout(() => window.showSpotSummary?.(), 300)
        else if (authPendingAction === 'sos') setTimeout(() => window.openSOS?.(), 300)
        else if (authPendingAction === 'guardian') setTimeout(() => window.showGuardianModal?.(), 300)
        else if (authPendingAction === 'social') setTimeout(() => setState({ activeTab: 'social' }), 300)
        else if (authPendingAction === 'tripPlanner') setTimeout(() => window.openTripPlanner?.(), 300)
      }
    } else if (result?.error === 'auth/popup-closed-by-user') {
      // User cancelled — restore button
      if (btn) { btn.disabled = false; btn.style.opacity = '1' }
    } else if (result?.error) {
      if (btn) { btn.disabled = false; btn.style.opacity = '1' }
      const { showError } = await import('../../services/notifications.js')
      showError(t('authError') || 'Erreur de connexion: ' + result.error)
    }
  } catch (error) {
    console.error('Google sign in error:', error)
    if (btn) { btn.disabled = false; btn.style.opacity = '1' }
    const { showError } = await import('../../services/notifications.js')
    showError(t('authError') || 'Erreur de connexion')
  }
}

// Reset GIS overlay flag when auth modal closes
const _origCloseAuth = window.closeAuth
window.closeAuth = () => {
  _gisOverlayReady = false
  _origCloseAuth?.()
}

window.handleGoogleSignIn = async () => {
  // Fallback: called when GIS overlay is not available (script blocked, GIS not loaded).
  // Uses signInWithPopup (desktop) or signInWithRedirect (mobile).
  const btn = document.getElementById('auth-google-btn')
  try {
    const fb = await import('../../services/firebase.js')
    const { getState } = await import('../../stores/state.js')

    fb.initializeFirebase()

    // Show loading state
    if (btn) {
      btn.disabled = true
      btn.style.opacity = '0.6'
      btn.textContent = t('loading') || 'Connexion...'
    }

    // Save pending action before potential redirect (survives page reload)
    const { authPendingAction } = getState()
    if (authPendingAction) {
      sessionStorage.setItem('spothitch_auth_pending_action', authPendingAction)
    }

    const result = await fb.signInWithGoogle()
    // redirect-in-progress means page will reload, don't process result
    if (result?.error === 'redirect-in-progress') return
    await _handleGoogleResult(result)
  } catch (error) {
    console.error('Google sign in error:', error)
    if (btn) { btn.disabled = false; btn.style.opacity = '1' }
    const { showError } = await import('../../services/notifications.js')
    showError(t('authError') || 'Erreur de connexion')
  }
}

// ==================== USERNAME CHECK ====================

let _usernameCheckTimer = null

window.checkUsernameField = (value) => {
  const v = value.toLowerCase().trim()

  // Find the status div (works for both auth form and complete profile form)
  const statusDiv = document.getElementById('pseudo-status') || document.getElementById('cp-pseudo-status')
  if (!statusDiv) return

  // Clear previous timer
  if (_usernameCheckTimer) clearTimeout(_usernameCheckTimer)

  if (!v) {
    statusDiv.textContent = ''
    statusDiv.className = 'text-xs mt-1 h-4'
    return
  }

  // Client-side validation first
  import('../../services/firebase.js').then(({ validateUsername }) => {
    const result = validateUsername(v)
    if (!result.valid) {
      statusDiv.textContent = t(result.errorKey)
      statusDiv.className = 'text-xs mt-1 h-4 text-red-400'
      return
    }

    // Show "checking..." and debounce the Firestore check
    statusDiv.textContent = t('usernameChecking')
    statusDiv.className = 'text-xs mt-1 h-4 text-slate-400'

    _usernameCheckTimer = setTimeout(async () => {
      try {
        const fb = await import('../../services/firebase.js')
        fb.initializeFirebase()
        const { available } = await fb.checkUsernameAvailability(v)
      // Only update if the input hasn't changed
      const currentInput = document.getElementById('auth-pseudo') || document.getElementById('cp-pseudo')
      if (currentInput && currentInput.value.toLowerCase().trim() === v) {
        if (available) {
          statusDiv.textContent = t('usernameAvailable')
          statusDiv.className = 'text-xs mt-1 h-4 text-emerald-400'
        } else {
          statusDiv.textContent = t('usernameTaken')
          statusDiv.className = 'text-xs mt-1 h-4 text-red-400'
        }
      }
      } catch {
        // Firestore unavailable — show as available (will be checked at submit)
        statusDiv.textContent = ''
        statusDiv.className = 'text-xs mt-1 h-4'
      }
    }, 1000) // 1s debounce (rate-limit Firestore reads)
  })
}

// ==================== COMPLETE PROFILE (after Google sign-in) ====================

window.submitCompleteProfile = async (event) => {
  event.preventDefault()

  const firstNameInput = document.getElementById('cp-firstname')
  const lastNameInput = document.getElementById('cp-lastname')
  const pseudoInput = document.getElementById('cp-pseudo')
  const birthYearInput = document.getElementById('cp-birthyear')
  const genderInput = document.getElementById('cp-gender')
  const errorDiv = document.getElementById('cp-error-msg')
  const submitBtn = document.getElementById('cp-submit-btn')

  const firstNameVal = firstNameInput?.value?.trim()
  const lastNameVal = lastNameInput?.value?.trim()
  const pseudo = pseudoInput?.value?.toLowerCase().trim() || null
  const birthYearStr = birthYearInput?.value
  const gender = genderInput?.value || ''

  // Validate first name + last name
  if (!firstNameVal || firstNameVal.length < 2) {
    if (errorDiv) { errorDiv.textContent = t('firstNameRequired'); errorDiv.classList.remove('hidden') }
    return
  }
  if (!lastNameVal || lastNameVal.length < 2) {
    if (errorDiv) { errorDiv.textContent = t('lastNameRequired'); errorDiv.classList.remove('hidden') }
    return
  }

  // Hide previous errors
  if (errorDiv) { errorDiv.classList.add('hidden'); errorDiv.textContent = '' }

  // Validate username only if provided
  const fb = await import('../../services/firebase.js')
  if (pseudo) {
    const validation = fb.validateUsername(pseudo)
    if (!validation.valid) {
      if (errorDiv) { errorDiv.textContent = t(validation.errorKey); errorDiv.classList.remove('hidden') }
      return
    }
  }

  // Validate birth year
  const birthYear = parseInt(birthYearStr, 10)
  const currentYear = new Date().getFullYear()
  if (!birthYear || birthYear < 1920 || birthYear > currentYear) {
    if (errorDiv) { errorDiv.textContent = t('birthYearInvalid'); errorDiv.classList.remove('hidden') }
    return
  }
  if (currentYear - birthYear < 16) {
    if (errorDiv) { errorDiv.textContent = t('birthYearTooYoung'); errorDiv.classList.remove('hidden') }
    return
  }

  // Show loading
  if (submitBtn) {
    submitBtn.disabled = true
    const { icon: iconFn } = await import('../../utils/icons.js')
    submitBtn.innerHTML = iconFn('loader-circle', 'w-5 h-5 animate-spin')
  }

  try {
    fb.initializeFirebase()

    // Check username availability only if provided
    if (pseudo) {
      const { available } = await fb.checkUsernameAvailability(pseudo)
      if (!available) {
        if (errorDiv) { errorDiv.textContent = t('usernameTaken'); errorDiv.classList.remove('hidden') }
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = `<span id="cp-submit-text">${t('letsGo')}</span>` }
        return
      }
    }

    // Get current user
    const user = fb.getCurrentUser()
    if (!user) return

    // Reserve username if provided
    if (pseudo) {
      const reserveResult = await fb.reserveUsername(pseudo, user.uid)
      if (!reserveResult.success) {
        if (errorDiv) { errorDiv.textContent = t('usernameTaken'); errorDiv.classList.remove('hidden') }
        return
      }
    }

    const displayName = `${firstNameVal} ${lastNameVal.charAt(0)}.`

    // Update profile with name + birthYear + gender
    await fb.updateUserProfile(user.uid, {
      firstName: firstNameVal,
      lastName: lastNameVal,
      displayName,
      ...(pseudo ? { username: pseudo } : {}),
      birthYear,
      gender: gender || null,
    })

    // Update local state
    const { setState } = await import('../../stores/state.js')
    setState({
      showCompleteProfile: false,
      firstName: firstNameVal,
      lastName: lastNameVal,
      ...(pseudo ? { username: pseudo } : {}),
    })

    const { showSuccess } = await import('../../services/notifications.js')
    showSuccess(t('accountCreated') || 'Profile complete!')
  } catch (error) {
    console.error('Complete profile error:', error)
    if (errorDiv) { errorDiv.textContent = t('authError'); errorDiv.classList.remove('hidden') }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false
      submitBtn.innerHTML = `<span id="cp-submit-text">${t('letsGo')}</span>`
    }
  }
}

window.closeCompleteProfile = async () => {
  const { setState } = await import('../../stores/state.js')
  setState({ showCompleteProfile: false })
}

// Apple Sign-In removed (requires $99/yr Apple Developer account)
// Facebook Sign-In hidden (requires Facebook Developer App setup)
// To re-enable: create Facebook App at developers.facebook.com, add App ID/Secret in Firebase Console

window.handleAppleSignIn = async () => {
  /* not yet configured — requires Apple Developer account */
}

window.handleFacebookSignIn = async () => {
  /* not yet configured — requires Facebook Developer App */
}

window.handleForgotPassword = async () => {
  const email = document.getElementById('auth-email')?.value.trim()

  if (!email) {
    const { showError } = await import('../../services/notifications.js')
    showError(t('enterEmailFirst') || 'Enter your email first')
    return
  }

  try {
    const fb = await import('../../services/firebase.js')
    const { showSuccess, showError } = await import('../../services/notifications.js')

    fb.initializeFirebase()
    const result = await fb.resetPassword(email)

    if (result.success) {
      showSuccess(t('passwordResetSent'))
    } else {
      showError(getAuthErrorMessage(result.error))
    }
  } catch (error) {
    console.error('Password reset error:', error)
    const { showError } = await import('../../services/notifications.js')
    showError(t('errorNetwork') || 'Erreur réseau. Réessaie.')
  }
}

/**
 * Login as admin without Firebase (demo mode)
 * Protected: only available in beta/dev builds
 */
window.loginAsAdmin = async () => {
  if (!import.meta.env.VITE_SHOW_BETA) {
    console.warn('loginAsAdmin is only available in beta builds')
    return
  }
  try {
    const { setState, getState } = await import('../../stores/state.js')
    const { showSuccess } = await import('../../services/notifications.js')

    const { authPendingAction } = getState()

    setState({
      isLoggedIn: true,
      user: {
        uid: 'admin-demo-001',
        email: 'admin@spothitch.com',
        displayName: 'Admin SpotHitch',
        photoURL: null,
        isAdmin: true,
      },
      currentUser: {
        uid: 'admin-demo-001',
        email: 'admin@spothitch.com',
        displayName: 'Admin SpotHitch',
        photoURL: null,
      },
      userProfile: {
        uid: 'admin-demo-001',
        email: 'admin@spothitch.com',
        displayName: 'Admin SpotHitch',
        photoURL: null,
        verifiedPhone: null,
        verifiedIdentity: true,
        createdAt: new Date().toISOString(),
      },
      username: 'Admin',
      avatar: 'crown',
      level: 1,
      points: 0,
      seasonPoints: 0,
      vipLevel: '',
      checkins: 0,
      spotsCreated: 0,
      reviewsGiven: 0,
      totalDistance: 0,
      totalRides: 0,
      visitedCountries: [],
      badges: [],
      ownedRewards: [],
      showAuth: false,
      showWelcome: false,
      authPendingAction: null,
      showAuthReason: null,
    })

    showSuccess(t('adminLoginSuccess') || "Logged in as Admin!")

    if (authPendingAction) {
      executePendingAction(authPendingAction)
    }
  } catch (error) {
    console.error('Admin login error:', error)
    const { showError } = await import('../../services/notifications.js')
    showError(t('authError') || 'Erreur de connexion')
  }
}

/**
 * Execute a pending action after successful authentication
 * @param {string} actionName - Name of the action to execute
 */
function executePendingAction(actionName) {
  setTimeout(() => {
    const actionMap = {
      addSpot: () => window.openAddSpot?.(),
      submitSpot: () => window.showSpotSummary?.(),
      validateSpot: () => window.openTestSpot?.(),
      saveFavorite: () => {}, // handled by the calling code
      sos: () => window.openSOS?.(),
      guardian: () => window.showGuardianModal?.(),
      social: () => {
        import('../../stores/state.js').then(({ setState }) => {
          setState({ activeTab: 'social' })
        })
      },
      tripPlanner: () => window.openTripPlanner?.(),
      checkin: () => {}, // handled by the calling code
    }
    const fn = actionMap[actionName]
    if (fn) fn()
  }, 300)
}

function getAuthErrorMessage(error) {
  const code = typeof error === 'string' ? error : error?.code
  const messages = {
    'auth/email-already-in-use': t('emailInUse') || 'Cet email est déjà utilisé. Essaie de te connecter.',
    'auth/invalid-email': t('invalidEmail') || 'Email invalide. Vérifie le format.',
    'auth/user-not-found': t('userNotFound') || 'Aucun compte avec cet email.',
    'auth/wrong-password': t('wrongPassword') || 'Mot de passe incorrect.',
    'auth/weak-password': t('weakPassword') || 'Mot de passe trop faible (6 caractères minimum).',
    'auth/invalid-credential': t('authErrorPassword') || 'Email ou mot de passe incorrect.',
    'auth/too-many-requests': t('authErrorTooMany') || 'Trop de tentatives. Réessaie dans quelques minutes.',
    'auth/popup-closed-by-user': t('authErrorPopupClosed') || 'Connexion annulée.',
    'auth/network-request-failed': t('errorNetwork') || 'Pas de connexion. Vérifie ton réseau.',
    'auth/internal-error': t('errorNetwork') || 'Erreur réseau. Réessaie.',
    'auth/operation-not-allowed': 'Méthode de connexion désactivée. Contacte le support.',
    'auth/password-does-not-meet-requirements': t('passwordRequirementsError') || 'Le mot de passe doit contenir au moins 6 caracteres, 1 majuscule et 1 chiffre.',
    'auth/missing-password': 'Mot de passe requis.',
    'auth/missing-email': 'Email requis.',
    'username/taken': t('usernameTaken') || 'Ce pseudo est déjà pris.',
  }
  return messages[code] || (code ? `Erreur: ${code}` : t('authError') || 'Erreur inconnue. Réessaie.')
}

/**
 * Progressive Auth Gate
 * If user is logged in, execute action immediately.
 * If not, show auth modal with a contextual reason, then execute after auth.
 * @param {string} actionName - e.g. 'addSpot', 'sos', 'guardian'
 * @param {Function} [callback] - optional immediate callback if logged in
 */
export function requireAuth(actionName, callback) {
  import('../../stores/state.js').then(({ getState, setState }) => {
    const { isLoggedIn } = getState()

    if (isLoggedIn) {
      if (callback) callback()
      return
    }

    // Map action names to contextual reason messages
    const reasonMap = {
      addSpot: t('authRequiredAddSpot'),
      validateSpot: t('authRequiredAddSpot'),
      saveFavorite: t('authRequiredFavorite'),
      sos: t('authRequiredSOS'),
      guardian: t('authRequiredGuardian'),
      social: t('authRequiredSocial'),
      tripPlanner: t('authRequiredSocial'),
      checkin: t('authRequiredAddSpot'),
    }

    setState({
      showAuth: true,
      authPendingAction: actionName,
      showAuthReason: reasonMap[actionName] || t('loginRequired'),
    })
  })
}

// requireAuth — canonical in main.js (synchronous return value needed by callers)

export default { renderAuth }
