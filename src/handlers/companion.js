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
window.showCompanionModal = () => window.setState({ showCompanionModal: true })
window.closeCompanionModal = () => window.setState({ showCompanionModal: false })

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
  if (!_companionLongFired) window.companionCheckIn()
}
window.companionBtnCancel = () => {
  if (_companionPressTimer) {
    clearTimeout(_companionPressTimer)
    _companionPressTimer = null
  }
}
window.startCompanion = () => {
  const t = window.t
  const { scheduleRender } = window._appInternals

  // Read config from localStorage (reliable) — hidden DOM inputs may not be rendered
  let saved = {}
  try {
    saved = JSON.parse(localStorage.getItem('spothitch_companion') || '{}')
  } catch { /* ignore */ }

  const name = saved.guardian?.name?.trim() || ''
  const phone = saved.guardian?.phone?.trim() || ''
  const interval = saved.checkInInterval || 30
  const destination = saved.destination || ''
  const notifyOnDeparture = saved.notifyOnDeparture !== false
  const notifyOnArrival = saved.notifyOnArrival !== false
  const licensePlate = saved.licensePlate || ''
  const customMessage = saved.customMessage || ''
  const trustedContacts = Array.isArray(saved.trustedContacts) ? saved.trustedContacts : []

  if (!name) {
    window.showToast(t('guardianNameRequired') || 'Remplis le nom de ton gardien.', 'warning')
    return
  }

  // Store traveler's own phone (from profile or first emergency contact)
  // so the guardian can call/message the traveler
  let travelerPhone = ''
  try {
    const state = window.getState?.() || {}
    travelerPhone = state.userPhone || ''
    if (!travelerPhone && state.emergencyContacts?.length > 0) {
      travelerPhone = state.emergencyContacts[0].phone || ''
    }
  } catch { /* ignore */ }

  startCompanionMode({ name, phone }, interval, {
    trustedContacts,
    destination,
    notifyOnDeparture,
    notifyOnArrival,
    travelerPhone,
    licensePlate,
    customMessage,
  })
  onCompanionOverdue(() => {
    window.setState({ showCompanionModal: true })
  })
  window.showToast(t('companionStarted') || 'Mode compagnon activé !', 'success')
  // Reset screen to null so auto-detection picks up active state
  window.guardianGoToScreen?.(null)
  // Re-render to show active view
  scheduleRender(() => window._appInternals.render())
}
window.stopCompanion = () => {
  const t = window.t
  stopCompanionMode()
  window.showToast(t('companionStopped') || 'Mode compagnon désactivé.', 'info')
  window.setState({ showCompanionModal: false })
}
window.companionCheckIn = () => {
  const t = window.t
  const { scheduleRender } = window._appInternals
  companionCheckInFn()
  window.showToast(t('companionCheckedIn') || 'Check-in enregistré !', 'success')
  // Re-render to update timer
  scheduleRender(() => window._appInternals.render())
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
