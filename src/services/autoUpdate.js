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
  const t = window.t || ((k) => k)
  const CHECK_INTERVAL = 120_000 // 2 minutes (was 10 — faster updates)
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

    // App is visible: show update banner instead of auto-reloading
    showUpdateBanner()
  }

  function showUpdateBanner() {
    if (document.getElementById('update-banner')) return
    const overlay = document.createElement('div')
    overlay.id = 'update-banner'
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#0f1520;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;text-align:center'
    overlay.innerHTML = `
      <div style="width:80px;height:80px;background:rgba(245,158,11,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:24px">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M12 2v10l4 4"/><circle cx="12" cy="12" r="10"/></svg>
      </div>
      <h2 style="font-size:22px;font-weight:700;color:#e2e8f0;margin-bottom:8px">${t('updateAvailable') || 'Mise à jour disponible'}</h2>
      <p style="font-size:14px;color:#94a3b8;margin-bottom:32px;max-width:280px;line-height:1.5">
        ${t('updateDescription') || 'Une nouvelle version de SpotHitch est prête. Mets à jour pour profiter des dernières améliorations.'}
      </p>
      <button onclick="window.__forceUpdate()" id="update-btn" style="background:#f59e0b;color:#0f1520;border:none;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;width:100%;max-width:280px">
        ${t('updateNow') || 'Mettre à jour'}
      </button>
      <p style="font-size:11px;color:#475569;margin-top:16px">${t('updateAutomatic') || 'Ça ne prend qu\'une seconde'}</p>
    `
    document.body.appendChild(overlay)
  }

  window.__forceUpdate = async () => {
    const btn = document.querySelector('#update-banner button')
    if (btn) btn.textContent = '...'
    await clearCachesAndReload()
  }

  async function clearCachesAndReload() {
    // Anti-loop: if we've reloaded more than 2 times in 30 seconds, stop
    const reloadKey = 'spothitch_reload_count'
    const reloadTimeKey = 'spothitch_reload_time'
    const now = Date.now()
    const lastReloadTime = parseInt(sessionStorage.getItem(reloadTimeKey) || '0', 10)
    const reloadCount = parseInt(sessionStorage.getItem(reloadKey) || '0', 10)
    if (now - lastReloadTime < 30000 && reloadCount >= 2) {
      console.warn('[AutoUpdate] Reload loop detected, stopping')
      return // Stop the loop
    }
    sessionStorage.setItem(reloadKey, String(now - lastReloadTime < 30000 ? reloadCount + 1 : 1))
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
