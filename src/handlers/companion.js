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

  const name = nameEl?.value?.trim()
  const phone = phoneEl?.value?.trim()
  const interval = parseInt(intervalEl?.value || '30', 10)
  const destination = destEl?.value?.trim() || ''
  const notifyOnDeparture = notifyDepartureEl ? notifyDepartureEl.checked : true
  const notifyOnArrival = notifyArrivalEl ? notifyArrivalEl.checked : true

  if (!name || !phone) {
    window.showToast(t('guardianRequired') || 'Remplis le nom et le numéro de ton gardien.', 'warning')
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

  startCompanionMode({ name, phone }, interval, {
    trustedContacts,
    destination,
    notifyOnDeparture,
    notifyOnArrival,
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
