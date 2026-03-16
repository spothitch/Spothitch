/**
 * Offline Download & Country Bubble Handlers
 * Download country data for offline use, manage offline storage
 */

import { icon } from '../utils/icons.js'

// ==================== COUNTRY BUBBLE HANDLERS ====================

window.loadCountryOnMap = async (code) => {
  const t = window.t
  try {
    const { loadCountrySpots } = await import('../services/spotLoader.js')
    await loadCountrySpots(code)
    // Refresh map spots source if map is active
    if (window.homeMapInstance) {
      const source = window.homeMapInstance.getSource('home-spots')
      if (source) {
        // Trigger a moveend to reload spots on map
        window.homeMapInstance.fire('moveend')
      }
    }
    if (window._refreshCountryBubbles) window._refreshCountryBubbles()
    // Close any open popup
    const popups = document.querySelectorAll('.maplibregl-popup')
    popups.forEach(p => p.remove())
  } catch (e) {
    window.showToast(t('downloadFailed') || 'Échec du chargement', 'error')
  }
}

window.downloadCountryFromBubble = async (code, name) => {
  const t = window.t
  const btn = document.getElementById(`bubble-download-${code}`)
  const ring = document.getElementById(`bubble-ring-${code}`)
  const pctLabel = document.getElementById(`bubble-ring-pct-${code}`)
  if (btn) {
    btn.disabled = true
    btn.innerHTML = `${icon('loader-circle', 'w-4 h-4 animate-spin')} ${t('downloadingCountry') || 'Téléchargement...'}`
  }
  const flagEl = document.getElementById(`bubble-flag-${code}`)
  if (pctLabel) pctLabel.style.display = 'flex'
  if (flagEl) flagEl.style.opacity = '0.2'
  try {
    const { downloadCountrySpots } = await import('../services/offlineDownload.js')
    const result = await downloadCountrySpots(code, (progress) => {
      if (btn) btn.innerHTML = `${icon('loader-circle', 'w-4 h-4 animate-spin')} ${progress}%`
      // Animate the glow ring (circumference = 157)
      if (ring) ring.style.strokeDashoffset = 157 * (1 - progress / 100)
      if (pctLabel) pctLabel.textContent = `${progress}%`
    })
    if (result.success) {
      // Fill ring completely
      if (ring) ring.style.strokeDashoffset = '0'
      if (pctLabel) pctLabel.textContent = '\u2713'
      if (flagEl) flagEl.style.opacity = '1'
      window.showToast(`${name} ${t('countryDownloaded') || 'téléchargé'}`, 'success')
      if (window._refreshCountryBubbles) window._refreshCountryBubbles()
      // Update button to "downloaded" state
      if (btn) {
        btn.disabled = true
        btn.className = 'w-full px-3 py-2 rounded-xl bg-green-500/20 text-green-400 text-sm font-medium flex items-center justify-center gap-2'
        btn.innerHTML = `${icon('check', 'w-4 h-4')} ${t('countryDownloaded') || 'Téléchargé'}`
      }
    } else {
      window.showToast(t('downloadFailed') || 'Échec du téléchargement', 'error')
      if (ring) ring.style.strokeDashoffset = '157'
      if (pctLabel) pctLabel.style.display = 'none'
      if (flagEl) flagEl.style.opacity = '1'
      if (btn) { btn.disabled = false; btn.innerHTML = `${icon('download', 'w-4 h-4')} ${t('downloadOffline') || 'Télécharger'}` }
    }
  } catch (e) {
    window.showToast(t('downloadFailed') || 'Échec du téléchargement', 'error')
    if (ring) ring.style.strokeDashoffset = '157'
    if (pctLabel) pctLabel.style.display = 'none'
    if (flagEl) flagEl.style.opacity = '1'
    if (btn) { btn.disabled = false; btn.innerHTML = `${icon('download', 'w-4 h-4')} ${t('downloadOffline') || 'Télécharger'}` }
  }
}

// ==================== OFFLINE DOWNLOAD HANDLERS ====================

window.downloadCountryOffline = async (code, name) => {
  const t = window.t
  // Disable button
  const btn = document.getElementById(`dl-btn-${code}`) || document.getElementById(`offline-download-${code}`)
  if (btn) {
    btn.disabled = true
    btn.style.opacity = '0.5'
  }

  // Show progress panel if in settings
  const progressEl = document.getElementById('offline-dl-progress')
  const labelEl = document.getElementById('offline-dl-label')
  const pctEl = document.getElementById('offline-dl-pct')
  const barEl = document.getElementById('offline-dl-bar')
  const phaseEl = document.getElementById('offline-dl-phase')
  if (progressEl) progressEl.classList.remove('hidden')
  if (labelEl) labelEl.textContent = `${name}...`

  const phases = [
    t('offlinePhaseSpots') || 'Spots...',
    t('offlinePhaseSpots') || 'Spots...',
    t('offlinePhaseTiles') || 'Carte...',
    t('offlinePhaseStations') || 'Stations-service...',
    t('offlinePhaseDone') || 'Finalisation...',
  ]

  try {
    const { downloadCountrySpots } = await import('../services/offlineDownload.js')
    const result = await downloadCountrySpots(code, (progress) => {
      if (pctEl) pctEl.textContent = `${progress}%`
      if (barEl) barEl.style.width = `${progress}%`
      if (phaseEl) {
        if (progress < 30) phaseEl.textContent = phases[1]
        else if (progress < 70) phaseEl.textContent = phases[2]
        else if (progress < 95) phaseEl.textContent = phases[3]
        else phaseEl.textContent = phases[4]
      }
    })
    if (result.success) {
      window.showToast(`${name} ${t('countryDownloaded') || 'téléchargé'}`, 'success')
      // Refresh the settings view to show new country in list
      window.setState({ profileSubTab: 'reglages' })
    } else {
      window.showToast(t('downloadFailed') || 'Échec du téléchargement', 'error')
      if (btn) { btn.disabled = false; btn.style.opacity = '1' }
    }
  } catch (e) {
    console.error('Offline download error:', e)
    window.showToast(t('downloadError') || 'Erreur lors du téléchargement', 'error')
    if (btn) { btn.disabled = false; btn.style.opacity = '1' }
  }
  // Hide progress
  if (progressEl) progressEl.classList.add('hidden')
}

window.deleteOfflineCountry = async (code) => {
  const t = window.t
  try {
    const { deleteOfflineCountry } = await import('../services/offlineDownload.js')
    await deleteOfflineCountry(code)
    window.showToast(t('offlineDataDeleted') || 'Données offline supprimées', 'success')
    if (window._refreshCountryBubbles) window._refreshCountryBubbles()
    window._forceRender?.()
  } catch (e) {
    window.showToast(t('deletionError') || 'Erreur lors de la suppression', 'error')
  }
}

window.downloadCountryForOffline = async (code) => {
  const t = window.t
  try {
    window.setState({ offlineDownloadingCountry: code, offlineDownloadProgress: 0 })
    const { downloadCountrySpots } = await import('../services/offlineDownload.js')
    const result = await downloadCountrySpots(code, (progress) => {
      window.setState({ offlineDownloadProgress: progress })
    })
    window.setState({ offlineDownloadingCountry: null, offlineDownloadProgress: 0 })
    if (result.success) {
      window.showToast(t('downloadComplete') || 'Téléchargement terminé', 'success')
      if (window._refreshCountryBubbles) window._refreshCountryBubbles()
    } else {
      window.showToast(t('downloadFailed') || 'Échec du téléchargement', 'error')
    }
  } catch (e) {
    window.setState({ offlineDownloadingCountry: null, offlineDownloadProgress: 0 })
    window.showToast(t('downloadFailed') || 'Échec du téléchargement', 'error')
  }
}

window.getOfflineStorageInfo = async () => {
  const { getOfflineStorageInfo } = await import('../services/offlineDownload.js')
  return getOfflineStorageInfo()
}

window.clearAllOfflineData = async () => {
  const t = window.t
  const { scheduleRender } = window._appInternals
  try {
    const { clearOfflineData } = await import('../services/autoOfflineSync.js')
    await clearOfflineData()
    window.showToast(t('offlineDataCleared') || 'Données hors-ligne supprimées', 'success')
    if (window._refreshCountryBubbles) window._refreshCountryBubbles()
    scheduleRender(() => window._appInternals.render())
  } catch (e) {
    window.showToast(t('deletionError') || 'Erreur lors de la suppression', 'error')
  }
}

window.toggleAutoOfflineDownload = () => {
  const current = window.getState().offlineAutoDownloadEnabled
  window.setState({ offlineAutoDownloadEnabled: !current })
}
