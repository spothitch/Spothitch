/**
 * Sentry Error Monitoring Service
 * Tracks errors and performance in production
 */

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || ''

let Sentry = null;

/**
 * Initialize Sentry
 */
export async function initSentry() {
  if (!SENTRY_DSN || typeof window === 'undefined') {
    console.warn('Sentry DSN not configured, skipping initialization');
    return false;
  }

  try {
    // Dynamically import Sentry to reduce bundle size
    const SentryModule = await import('@sentry/browser');
    Sentry = SentryModule;

    Sentry.init({
      dsn: SENTRY_DSN,
      environment: import.meta.env.MODE || 'development',
      release: `spothitch@${import.meta.env.VITE_APP_VERSION || '2.0.0'}`,

      // Performance monitoring — low rate to reduce volume
      tracesSampleRate: 0.02, // 2% of transactions

      // Session replay — only on errors, not random sessions
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0.5,

      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],

      // Filter out common non-errors and known third-party library issues
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
        'Non-Error exception captured',
        'Non-Error promise rejection captured',
        /^Network Error$/,
        /^Failed to fetch$/,
        /^Load failed$/,
        /^NetworkError/,
        /^AbortError/,
        /^TimeoutError/,
        /^Loading chunk \d+ failed/,
        /^Importing a module script failed/,
        // MapLibre GL: eval() for styles, WebGL context lost, tile loading
        /Content Security Policy/,
        /unsafe-eval/,
        /WebGL/,
        /Failed to initialize WebGL/,
        /context lost/i,
        // Firebase Messaging not supported on some browsers
        /messaging\/unsupported-browser/,
        /unsupported-browser/,
        // Service Worker registration failures (old browsers, incognito)
        /ServiceWorker/,
        /service worker/i,
        // Browser extensions injecting errors
        /moz-extension/,
        /chrome-extension/,
        /safari-extension/,
        // Common browser/extension noise
        /Script error\.?$/,
        /Permission denied/,
        /NotAllowedError/,
        /SecurityError/,
      ],

      // Before sending error — aggressive filtering to reduce noise
      beforeSend(event, hint) {
        // Don't send errors in development
        if (import.meta.env.DEV) return null

        const msg = hint?.originalException?.message
          || event?.exception?.values?.[0]?.value || ''
        const stack = hint?.originalException?.stack || ''

        // Drop CSP + Firebase Messaging errors
        if (msg.includes('Content Security Policy')
          || msg.includes('unsafe-eval')
          || msg.includes('unsupported-browser')) return null

        // Drop network/fetch errors (user offline, slow connection)
        if (msg.includes('Failed to fetch')
          || msg.includes('Load failed')
          || msg.includes('NetworkError')
          || msg.includes('Network request failed')
          || msg.includes('AbortError')
          || msg.includes('TimeoutError')) return null

        // Drop errors from browser extensions
        if (stack.includes('chrome-extension://')
          || stack.includes('moz-extension://')
          || stack.includes('safari-extension://')) return null

        // Drop generic "Script error" (cross-origin, no useful info)
        if (msg === 'Script error.' || msg === 'Script error') return null

        // Drop MapLibre/WebGL errors (device limitations, not bugs)
        if (msg.includes('WebGL') || msg.includes('context lost')
          || msg.includes('Failed to initialize')) return null

        // Drop SecurityError (private browsing, cross-origin)
        if (msg.includes('SecurityError')
          || msg.includes('The operation is insecure')) return null

        // Rate-limit: max 5 errors per minute
        const now = Date.now()
        if (!window._sentryTimestamps) window._sentryTimestamps = []
        window._sentryTimestamps = window._sentryTimestamps.filter(
          ts => now - ts < 60000
        )
        if (window._sentryTimestamps.length >= 5) return null
        window._sentryTimestamps.push(now)

        // Add extra context
        event.tags = {
          ...event.tags,
          theme: document.body?.classList?.contains('light-theme')
            ? 'light' : 'dark',
          online: navigator.onLine,
          pwa: window.matchMedia?.('(display-mode: standalone)')
            ?.matches,
        }

        return event
      },
    });

    return true;
  } catch (error) {
    console.error('Sentry initialization failed:', error);
    return false;
  }
}

/**
 * Capture an exception
 */
export function captureException(error, context = {}) {
  if (!Sentry) {
    console.error('Error (Sentry not initialized):', error);
    return;
  }

  Sentry.withScope((scope) => {
    Object.entries(context).forEach(([key, value]) => {
      scope.setExtra(key, value);
    });
    Sentry.captureException(error);
  });
}

/**
 * Capture a message
 */
export function captureMessage(message, level = 'info', context = {}) {
  if (!Sentry) {
    return;
  }

  Sentry.withScope((scope) => {
    Object.entries(context).forEach(([key, value]) => {
      scope.setExtra(key, value);
    });
    Sentry.captureMessage(message, level);
  });
}

/**
 * Set user context
 */
export function setUser(user) {
  if (!Sentry) return;

  if (user) {
    Sentry.setUser({
      id: user.uid,
      email: user.email,
      username: user.displayName,
    });
  } else {
    Sentry.setUser(null);
  }
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(message, category = 'default', level = 'info', data = {}) {
  if (!Sentry) return;

  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Start a performance transaction
 */
export function startTransaction(name, op = 'navigation') {
  if (!Sentry) return null;

  return Sentry.startTransaction({
    name,
    op,
  });
}

/**
 * Global error handler setup
 */
export function setupGlobalErrorHandlers() {
  // Unhandled errors
  window.onerror = (message, source, lineno, colno, error) => {
    captureException(error || new Error(message), {
      source,
      lineno,
      colno,
    });
    return false;
  };

  // Unhandled promise rejections
  window.onunhandledrejection = (event) => {
    captureException(event.reason || new Error('Unhandled rejection'), {
      type: 'unhandledrejection',
    });
  };

}

export default {
  initSentry,
  captureException,
  captureMessage,
  setUser,
  addBreadcrumb,
  startTransaction,
  setupGlobalErrorHandlers,
};
