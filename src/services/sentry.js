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

      // Performance monitoring
      tracesSampleRate: 0.1, // 10% of transactions

      // Session replay (optional)
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,

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
        'Non-Error exception captured',
        'Non-Error promise rejection captured',
        /^Network Error$/,
        /^Loading chunk \d+ failed/,
        // MapLibre GL uses eval() for style expression compilation — harmless, can't be fixed in our code
        /Content Security Policy/,
        /unsafe-eval/,
        // Firebase Messaging not supported on some browsers (old Android, Firefox) — non-critical
        /messaging\/unsupported-browser/,
        /unsupported-browser/,
      ],

      // Before sending error
      beforeSend(event, hint) {
        // Don't send errors in development
        if (import.meta.env.DEV) {
          return null;
        }

        // Secondary filter: drop CSP + Firebase Messaging errors even if ignoreErrors misses them
        const msg = hint?.originalException?.message || event?.exception?.values?.[0]?.value || ''
        if (msg.includes('Content Security Policy') || msg.includes('unsafe-eval')) return null
        if (msg.includes('unsupported-browser')) return null

        // Add extra context
        event.tags = {
          ...event.tags,
          theme: document.body.classList.contains('light-theme') ? 'light' : 'dark',
          online: navigator.onLine,
          pwa: window.matchMedia('(display-mode: standalone)').matches,
        };

        return event;
      },
    });

    return true;
  } catch (error) {
    console.error('❌ Sentry initialization failed:', error);
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
