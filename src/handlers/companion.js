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
  const nameEl = document.getElementById('companion-guardian-name')
  const phoneEl = document.getElementById('companion-guardian-phone')
  const intervalEl = document.getElementById('companion-interval')
  const destEl = document.getElementById('companion-destination')
  const notifyDepartureEl = document.getElementById('companion-notify-departure')
  const notifyArrivalEl = document.getElementById('companion-notify-arrival')
  const plateEl = document.getElementById('companion-license-plate')
  const msgEl = document.getElementById('companion-custom-message')

  const name = nameEl?.value?.trim()
  const phone = phoneEl?.value?.trim()
  const interval = parseInt(intervalEl?.value || '30', 10)
  const destination = destEl?.value?.trim() || ''
  const notifyOnDeparture = notifyDepartureEl ? notifyDepartureEl.checked : true
  const notifyOnArrival = notifyArrivalEl ? notifyArrivalEl.checked : true
  const licensePlate = plateEl?.value?.trim() || ''
  const customMessage = msgEl?.value?.trim() || ''

  if (!name) {
    window.showToast(t('guardianNameRequired') || 'Remplis le nom de ton gardien.', 'warning')
    return
  }

  // Collect trusted contacts from saved state (added via companionAddTrustedContact)
  let trustedContacts = []
  try {
    const raw = localStorage.getItem('spothitch_companion')
    if (raw) {
      const parsed = JSON.parse(raw)
      trustedContacts = Array.isArray(parsed.trustedContacts) ? parsed.trustedContacts : []
    }
  } catch {
    // ignore
  }

  // Store traveler's own phone (from profile or first emergency contact)
  // so the guardian can call/message the traveler
  let travelerPhone = ''
  try {
    const state = window.getState?.() || {}
    // Try profile phone first
    travelerPhone = state.userPhone || ''
    // Fallback to first emergency contact phone
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
