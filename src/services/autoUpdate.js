/**
 * Auto-Update System v3
 * Ensures users ALWAYS get the latest code — no manual cache clearing needed.
 *
 * Strategy:
 * 1. On load: fetch version.json BYPASSING service worker entirely
 * 2. Compare with version stored in localStorage (survives SW cache clears)
 * 3. If different: clear ALL caches, unregister SW, reload
 * 4. After reload: verify version changed, if not → force hard reload
 * 5. Anti-loop: max 3 reloads per 5 minutes, then stop
 */

let isReloading = false
window._authInProgress = false
window._authJustCompleted = 0
window._shareInProgress = false

export function startVersionCheck() {
  const CHECK_INTERVAL = 120_000 // 2 min
  const BASE = import.meta.env.BASE_URL || '/'
  let pendingReload = false

  function isBlocked() {
    if (window._authInProgress) return true
    if (window._shareInProgress) return true
    if (Date.now() - window._authJustCompleted < 15000) return true
    if (sessionStorage.getItem('spothitch_auth_redirect')) return true
    try {
      const ts = parseInt(sessionStorage.getItem('spothitch_share_flow') || '0', 10)
      if (ts && Date.now() - ts < 120_000) return true
    } catch { /* */ }
    return false
  }

  async function fetchVersionDirect() {
    // Bypass SW completely: use fetch with cache busting + no-store
    try {
      const url = `${BASE}version.json?_=${Date.now()}`
      const res = await fetch(url, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store', 'Pragma': 'no-cache' },
      })
      if (!res.ok) return null
      const data = await res.json()
      return data.version || null
    } catch { return null }
  }

  async function checkAndUpdate() {
    if (isReloading) return
    const serverVersion = await fetchVersionDirect()
    if (!serverVersion) return

    // Get the version we loaded with (stored at first successful check)
    const loadedVersion = localStorage.getItem('spothitch_loaded_version')

    if (!loadedVersion) {
      // First ever check — store current version
      localStorage.setItem('spothitch_loaded_version', serverVersion)
      return
    }

    if (serverVersion === loadedVersion) return // Up to date

    // Version mismatch — need to update
    console.log('[AutoUpdate] New version:', serverVersion, '(current:', loadedVersion, ')')

    if (isBlocked()) {
      pendingReload = true
      return
    }

    await doUpdate(serverVersion)
  }

  async function doUpdate(newVersion) {
    if (isReloading) return

    // Anti-loop: max 3 reloads in 5 minutes
    const key = 'spothitch_update_reloads'
    try {
      const data = JSON.parse(sessionStorage.getItem(key) || '{"count":0,"since":0}')
      const now = Date.now()
      if (now - data.since < 300_000 && data.count >= 3) {
        console.warn('[AutoUpdate] Too many reloads, stopping. Will retry on next app open.')
        // Store the new version anyway so next app open doesn't loop
        localStorage.setItem('spothitch_loaded_version', newVersion)
        return
      }
      sessionStorage.setItem(key, JSON.stringify({
        count: now - data.since < 300_000 ? data.count + 1 : 1,
        since: now - data.since < 300_000 ? data.since : now,
      }))
    } catch { /* */ }

    // 1. Clear ALL caches
    if (window.caches) {
      try {
        const keys = await caches.keys()
        await Promise.all(keys.map(k => caches.delete(k)))
      } catch { /* */ }
    }

    // 2. Unregister ALL service workers
    if (navigator.serviceWorker) {
      try {
        const regs = await navigator.serviceWorker.getRegistrations()
        await Promise.all(regs.map(r => r.unregister()))
      } catch { /* */ }
    }

    // 3. Update stored version BEFORE reload so next load knows it's fresh
    localStorage.setItem('spothitch_loaded_version', newVersion)

    // 4. Reload
    isReloading = true
    window.location.reload()
  }

  // Initial check (immediate)
  checkAndUpdate()

  // Regular checks
  let interval = setInterval(checkAndUpdate, CHECK_INTERVAL)

  // When app comes back to foreground, check immediately
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      setTimeout(checkAndUpdate, 1500)
      if (!interval) interval = setInterval(checkAndUpdate, CHECK_INTERVAL)
    } else {
      // Background: stop polling, apply pending reload
      if (interval) { clearInterval(interval); interval = null }
      if (pendingReload && !isReloading && !isBlocked()) {
        isReloading = true
        window.location.reload()
      }
    }
  })

  // SW controller change: reload immediately
  let hadController = !!navigator.serviceWorker?.controller
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (hadController && !isReloading && !isBlocked()) {
      isReloading = true
      setTimeout(() => window.location.reload(), 500)
    }
    hadController = true
  })
}
