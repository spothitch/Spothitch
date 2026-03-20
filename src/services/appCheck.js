/**
 * Firebase App Check
 * Blocks requests that don't come from the real SpotHitch app.
 * Uses reCAPTCHA Enterprise for web apps.
 *
 * Setup required in Firebase Console:
 * 1. Go to App Check > Apps > Web
 * 2. Register the app with reCAPTCHA Enterprise
 * 3. Get the site key and set it below
 */

const RECAPTCHA_SITE_KEY = '' // Set after Firebase Console setup

/**
 * Initialize App Check (call at app startup)
 */
export async function initAppCheck() {
  if (!RECAPTCHA_SITE_KEY) {
    console.log('[AppCheck] No site key configured, skipping')
    return
  }

  try {
    const { initializeAppCheck, ReCaptchaEnterpriseProvider } = await import('firebase/app-check')
    const { getApp } = await import('firebase/app')

    // In dev mode, use debug token
    if (import.meta.env.DEV) {
      // @ts-ignore
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true
    }

    initializeAppCheck(getApp(), {
      provider: new ReCaptchaEnterpriseProvider(RECAPTCHA_SITE_KEY),
      isTokenAutoRefreshEnabled: true,
    })

    console.log('[AppCheck] Initialized')
  } catch (err) {
    console.warn('[AppCheck] Failed to init:', err.message)
  }
}
