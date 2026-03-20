/**
 * Firebase App Check
 * Blocks requests that don't come from the real SpotHitch app.
 * Uses reCAPTCHA Enterprise for web apps.
 *
 * Setup:
 * 1. Go to Firebase Console > App Check > Apps > Web
 * 2. Register with reCAPTCHA Enterprise
 * 3. Copy the site key to VITE_RECAPTCHA_SITE_KEY in .env
 * 4. For CI bots: register debug tokens in Firebase Console > App Check > Debug tokens
 *
 * Our CI bots (ci-alice, ci-bob, etc.) use debug tokens so they bypass App Check.
 * External attackers cannot get a valid token.
 */

/**
 * Initialize App Check (call at app startup)
 */
export async function initAppCheck() {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY
  if (!siteKey) {
    // Not configured yet, skip silently
    return
  }

  try {
    const { initializeAppCheck, ReCaptchaEnterpriseProvider } = await import('firebase/app-check')
    const { getApp } = await import('firebase/app')

    // In dev/CI mode: use debug token (bypasses reCAPTCHA)
    // Register the debug token in Firebase Console > App Check > Debug tokens
    if (import.meta.env.DEV || import.meta.env.VITE_APPCHECK_DEBUG === 'true') {
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_APPCHECK_DEBUG_TOKEN || true
    }

    initializeAppCheck(getApp(), {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      isTokenAutoRefreshEnabled: true,
    })

    console.log('[AppCheck] Initialized')
  } catch (err) {
    console.warn('[AppCheck] Failed to init:', err.message)
  }
}
