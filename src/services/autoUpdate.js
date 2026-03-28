/**
 * Auto-Update System
 * Ensures users ALWAYS get the latest code — no manual cache clearing needed.
 * Two mechanisms work together:
 * 1. version.json polling — detects new deployments
 * 2. SW update listener — detects when new Service Worker is ready
 */

let currentVersion = null
let isReloading = false
// Guard: block auto-reload while an auth popup is open (popup steals focus → visibilitychange → spurious reload)
window._authInProgress = false
// Guard: block auto-reload for 15 seconds after auth completes (SW update + version.json would reload during sign-in)
window._authJustCompleted = 0
// Guard: block auto-reload while a share is being processed (Google Maps share → AddSpot flow)
window._shareInProgress = false

export function startVersionCheck() {
  const CHECK_INTERVAL = 120_000 // 2 minutes
  const BASE = import.meta.env.BASE_URL || '/'
  let lastCheck = 0

  async function checkVersion() {
    if (isReloading) return
    // Debounce: don't check more than once per 30 seconds
    const now = Date.now()
    if (now - lastCheck < 30_000) return
    lastCheck = now
    try {
      const res = await fetch(`${BASE}version.json?t=${now}`, { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      if (!currentVersion) {
        currentVersion = data.version
        return
      }
      if (data.version !== currentVersion) {
        doReload()
      }
    } catch { /* offline or file missing — ignore */ }
  }

  let pendingReload = false

  function isShareFlowActive() {
    if (window._shareInProgress) return true
    try {
      const ts = parseInt(sessionStorage.getItem('spothitch_share_flow') || '0', 10)
      // Share flow is active for up to 120 seconds (user filling the AddSpot form)
      if (ts && Date.now() - ts < 120_000) return true
    } catch { /* no-op */ }
    return false
  }

  async function doReload() {
    if (isReloading) return
    // Never reload during an auth flow, share processing, or within 15s after auth completed
    if (window._authInProgress || isShareFlowActive() || sessionStorage.getItem('spothitch_auth_redirect') || (Date.now() - window._authJustCompleted < 15000)) {
      pendingReload = true
      return
    }

    // If app is in background, reload silently
    if (document.visibilityState === 'hidden') {
      await clearCachesAndReload()
      return
    }

    // App is visible: silently clear caches and reload (no blocking banner)
    await clearCachesAndReload()
  }

  async function clearCachesAndReload() {
    // Anti-loop: if we've reloaded more than 1 time in 60 seconds, stop
    const reloadKey = 'spothitch_reload_count'
    const reloadTimeKey = 'spothitch_reload_time'
    const now = Date.now()
    const lastReloadTime = parseInt(sessionStorage.getItem(reloadTimeKey) || '0', 10)
    const reloadCount = parseInt(sessionStorage.getItem(reloadKey) || '0', 10)
    if (now - lastReloadTime < 60000 && reloadCount >= 1) {
      console.warn('[AutoUpdate] Reload loop detected, stopping. User will get update on next visit.')
      return // Stop the loop — user gets update next time they open the app
    }
    sessionStorage.setItem(reloadKey, String(now - lastReloadTime < 60000 ? reloadCount + 1 : 1))
    sessionStorage.setItem(reloadTimeKey, String(now))

    // 1. Clear ALL caches (precache + runtime)
    if (window.caches) {
      try {
        const keys = await caches.keys()
        await Promise.all(keys.map(k => caches.delete(k)))
      } catch { /* ignore */ }
    }
    // 2. Unregister ALL service workers so the browser fetches fresh from server
    if (navigator.serviceWorker) {
      try {
        const regs = await navigator.serviceWorker.getRegistrations()
        await Promise.all(regs.map(r => r.unregister()))
      } catch { /* ignore */ }
    }
    isReloading = true
    window.location.reload()
  }

  // When user backgrounds the app, apply pending reload
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && pendingReload && !isReloading && !window._authInProgress && !isShareFlowActive() && !sessionStorage.getItem('spothitch_auth_redirect') && (Date.now() - window._authJustCompleted >= 15000)) {
      isReloading = true
      window.location.reload()
    }
  })

  // Initial check to store current version
  checkVersion()

  // Check regularly — pause when app is backgrounded to save network/battery
  let versionInterval = setInterval(checkVersion, CHECK_INTERVAL)

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // User came back — check immediately + restart interval
      setTimeout(checkVersion, 2000)
      if (!versionInterval) versionInterval = setInterval(checkVersion, CHECK_INTERVAL)
    } else {
      // App backgrounded — stop polling
      if (versionInterval) { clearInterval(versionInterval); versionInterval = null }
    }
  })

  // Reload when a NEW Service Worker takes control (not on first install)
  // On first visit, controller is null → skip. On update, controller changes → reload.
  let hadController = !!navigator.serviceWorker?.controller
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (hadController && !isReloading) {
      // Block reload if auth just completed or share in progress
      if (window._authInProgress || isShareFlowActive() || (Date.now() - window._authJustCompleted < 15000)) {
        pendingReload = true
        hadController = true
        return
      }
      // New SW activated — reload NOW so user gets latest version immediately
      isReloading = true
      /* silent update — no toast needed, page reloads immediately */
      setTimeout(() => window.location.reload(), 800)
    }
    hadController = true
  })
}
