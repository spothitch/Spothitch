/**
 * Guardian Mode Handlers
 * Start, stop, check-in, alert for guardian safety mode
 */

import {
  startGuardianMode,
  stopGuardianMode,
  checkIn as guardianCheckInFn,
  sendAlert as guardianSendAlertFn,
  onOverdue as onGuardianOverdue,
} from '../services/guardian.js'

// Guardian Mode handlers
window.showGuardianModal = () => window.setState({ showGuardianModal: true, _guardianDismissed: false })
window.closeGuardianModal = () => {
  import('../services/guardian.js').then(m => m.unsubscribeGuardianChat()).catch(() => {})
  window.setState({ showGuardianModal: false, _guardianDismissed: true })
}

// Header guardian button: short press = check-in, hold 2s = stop
let _guardianPressTimer = null
let _guardianLongFired = false

window.guardianBtnDown = () => {
  _guardianLongFired = false
  _guardianPressTimer = setTimeout(() => {
    _guardianLongFired = true
    _guardianPressTimer = null
    window.stopGuardian()
  }, 2000)
}
window.guardianBtnUp = () => {
  if (_guardianPressTimer) {
    clearTimeout(_guardianPressTimer)
    _guardianPressTimer = null
  }
  // Short press: open the guardian modal (shows timeline + stop button)
  if (!_guardianLongFired) window.showGuardianModal()
}
window.guardianBtnCancel = () => {
  if (_guardianPressTimer) {
    clearTimeout(_guardianPressTimer)
    _guardianPressTimer = null
  }
}
window.startGuardian = () => {
  const t = window.t

  // Read config from localStorage (reliable)
  let saved = {}
  try {
    saved = JSON.parse(localStorage.getItem('spothitch_guardian') || '{}')
  } catch { /* ignore */ }

  // Use guardians array (v2) or fall back to single guardian (v1)
  const guardians = Array.isArray(saved.guardians) && saved.guardians.length > 0
    ? saved.guardians
    : (saved.guardian?.name ? [{ name: saved.guardian.name, phone: saved.guardian.phone || '', color: '#22c55e' }] : [])

  if (guardians.length === 0 || !guardians[0].name?.trim()) {
    window.showToast(t('guardianNameRequired') || 'Ajoute au moins un gardien.', 'warning')
    return
  }

  const interval = saved.checkInInterval || 30
  const destination = saved.destination || ''
  const notifyOnDeparture = saved.notifyOnDeparture !== false
  const notifyOnArrival = saved.notifyOnArrival !== false
  const licensePlate = saved.licensePlate || ''
  const customMessage = saved.customMessage || ''

  // Store traveler's own phone
  let travelerPhone = ''
  try {
    const state = window.getState?.() || {}
    travelerPhone = state.userPhone || ''
    if (!travelerPhone && state.emergencyContacts?.length > 0) {
      travelerPhone = state.emergencyContacts[0].phone || ''
    }
  } catch { /* ignore */ }

  // Start with primary guardian (backward compat) but pass all guardians in options
  startGuardianMode(guardians[0], interval, {
    trustedContacts: guardians.slice(1),
    destination,
    notifyOnDeparture,
    notifyOnArrival,
    travelerPhone,
    licensePlate,
    customMessage,
  })
  onGuardianOverdue(() => {
    // Only open modal if not already open (prevents render loop every 10s)
    const state = window.getState?.() || {}
    if (!state.showGuardianModal) {
      window.setState({ showGuardianModal: true })
    }
  })
  window.showToast(t('guardianStarted') || 'Mode compagnon activé !', 'success')
  // Force active screen (don't rely on auto-detection which may read stale state)
  window.guardianGoToScreen?.('active')

  // Nudge push notifications after Guardian activation (delayed to not overlap toast)
  setTimeout(async () => {
    try {
      const { nudgePushNotifications } = await import('../services/pushNotifications.js')
      nudgePushNotifications('guardian')
    } catch { /* optional */ }
  }, 2000)
}
window.stopGuardian = () => {
  const t = window.t
  const msg = t('guardianStopConfirm') || 'Arrêter le mode Guardian ? Ton gardien ne sera plus alerté.'
  if (!confirm(msg)) return
  stopGuardianMode()
  window.showToast(t('guardianStopped') || 'Mode Guardian désactivé.', 'info')
  window.guardianGoToScreen?.(null)
  window.setState({ showGuardianModal: false })
}
window.guardianCheckIn = () => {
  const t = window.t
  guardianCheckInFn()
  window.showToast(t('guardianCheckedIn') || 'Check-in enregistré !', 'success')
  // Update modal only (not full app) to avoid page flash
  window._forceRender?.()
}
window.guardianSendAlert = () => {
  const t = window.t
  const count = guardianSendAlertFn()
  if (count) {
    window.showToast(t('guardianAlertSent') || 'Alert sent via push notification!', 'success')
  } else {
    window.showToast(t('guardianNoContacts') || 'No contacts configured.', 'warning')
  }
}

// ─── Guardian v2 handlers ───
// guardianAddGuardian, guardianEditGuardian, guardianRemoveGuardian,
// guardianUpdatePlate, guardianSavePlate, guardianAddTripPhoto, guardianSaveTripPhoto,
// guardianUpdateDestination, guardianSaveDestination, guardianSendMessage,
// guardianQuickCheckin, guardianShowArrival, guardianAddToJournal
// → all defined in Guardian.js (they need access to local _guardianSheet, _editOverlay, _currentScreen)

