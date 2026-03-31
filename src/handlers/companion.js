/**
 * Companion Mode Handlers
 * Start, stop, check-in, alert for companion safety mode
 */

import {
  startCompanionMode,
  stopCompanionMode,
  checkIn as companionCheckInFn,
  sendAlert as companionSendAlertFn,
  onOverdue as onCompanionOverdue,
} from '../services/companion.js'

// Companion Mode handlers
window.showCompanionModal = () => window.setState({ showCompanionModal: true, _companionDismissed: false })
window.closeCompanionModal = () => window.setState({ showCompanionModal: false, _companionDismissed: true })

// Header companion button: short press = check-in, hold 2s = stop
let _companionPressTimer = null
let _companionLongFired = false

window.companionBtnDown = () => {
  _companionLongFired = false
  _companionPressTimer = setTimeout(() => {
    _companionLongFired = true
    _companionPressTimer = null
    window.stopCompanion()
  }, 2000)
}
window.companionBtnUp = () => {
  if (_companionPressTimer) {
    clearTimeout(_companionPressTimer)
    _companionPressTimer = null
  }
  // Short press: open the guardian modal (shows timeline + stop button)
  if (!_companionLongFired) window.showCompanionModal()
}
window.companionBtnCancel = () => {
  if (_companionPressTimer) {
    clearTimeout(_companionPressTimer)
    _companionPressTimer = null
  }
}
window.startCompanion = () => {
  const t = window.t

  // Read config from localStorage (reliable)
  let saved = {}
  try {
    saved = JSON.parse(localStorage.getItem('spothitch_companion') || '{}')
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
  startCompanionMode(guardians[0], interval, {
    trustedContacts: guardians.slice(1),
    destination,
    notifyOnDeparture,
    notifyOnArrival,
    travelerPhone,
    licensePlate,
    customMessage,
  })
  onCompanionOverdue(() => {
    // Only open modal if not already open (prevents render loop every 10s)
    const state = window.getState?.() || {}
    if (!state.showCompanionModal) {
      window.setState({ showCompanionModal: true })
    }
  })
  window.showToast(t('companionStarted') || 'Mode compagnon activé !', 'success')
  // Force active screen (don't rely on auto-detection which may read stale state)
  window.guardianGoToScreen?.('active')
}
window.stopCompanion = () => {
  const t = window.t
  stopCompanionMode()
  window.showToast(t('companionStopped') || 'Mode compagnon désactivé.', 'info')
  // Close modal and reset screen
  window.guardianGoToScreen?.(null)
  window.setState({ showCompanionModal: false })
}
window.companionCheckIn = () => {
  const t = window.t
  companionCheckInFn()
  window.showToast(t('companionCheckedIn') || 'Check-in enregistré !', 'success')
  // Update modal only (not full app) to avoid page flash
  window._forceRender?.()
}
window.companionSendAlert = () => {
  const t = window.t
  const count = companionSendAlertFn()
  if (count) {
    window.showToast(t('companionAlertSent') || 'Alert sent via push notification!', 'success')
  } else {
    window.showToast(t('companionNoContacts') || 'No contacts configured.', 'warning')
  }
}

// ─── Guardian v2 handlers ───
// guardianAddGuardian, guardianEditGuardian, guardianRemoveGuardian,
// guardianUpdatePlate, guardianSavePlate, guardianAddTripPhoto, guardianSaveTripPhoto,
// guardianUpdateDestination, guardianSaveDestination, guardianSendMessage,
// guardianQuickCheckin, guardianShowArrival, guardianAddToJournal
// → all defined in Companion.js (they need access to local _guardianSheet, _editOverlay, _currentScreen)

