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
  removeGuardian as removeGuardianFn,
  addTripEvent,
  setTripPhoto,
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
  // Reset screen to null so auto-detection picks up active state — single render only
  window.guardianGoToScreen?.(null)
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

// ─── Guardian v2: Multi-guardian management ───

window.guardianAddGuardian = () => {
  // Opens the edit overlay for a new guardian (handled in Companion.js)
  window.setState?.({ _guardianEditIndex: -1 })
  window._forceRender?.()
}

window.guardianRemoveGuardian = (index) => {
  removeGuardianFn(index)
  window.showToast(window.t?.('guardianRemoved') || 'Gardien supprime.', 'info')
  window._forceRender?.()
}

window.guardianEditGuardian = (index) => {
  window.setState?.({ _guardianEditIndex: index })
  window._forceRender?.()
}

// ─── Guardian v2: Quick actions during trip ───

window.guardianUpdatePlate = () => {
  // Opens plate bottom sheet (handled in Companion.js via state flag)
  window.setState?.({ _guardianSheet: 'plate' })
  window._forceRender?.()
}

window.guardianSavePlate = (plate) => {
  if (!plate?.trim()) return
  try {
    const saved = JSON.parse(localStorage.getItem('spothitch_companion') || '{}')
    saved.licensePlate = plate.trim().toUpperCase()
    localStorage.setItem('spothitch_companion', JSON.stringify(saved))
  } catch { /* */ }
  addTripEvent('vehicle', { plate: plate.trim().toUpperCase() })
  window.setState?.({ _guardianSheet: null })
  window._forceRender?.()
}

window.guardianAddTripPhoto = () => {
  window.setState?.({ _guardianSheet: 'photo' })
  window._forceRender?.()
}

window.guardianSaveTripPhoto = (dataUrl) => {
  if (!dataUrl) return
  setTripPhoto(dataUrl)
  window.setState?.({ _guardianSheet: null })
  window._forceRender?.()
}

window.guardianUpdateDestination = () => {
  window.setState?.({ _guardianSheet: 'dest' })
  window._forceRender?.()
}

window.guardianSaveDestination = (dest) => {
  if (!dest?.trim()) return
  try {
    const saved = JSON.parse(localStorage.getItem('spothitch_companion') || '{}')
    saved.destination = dest.trim()
    localStorage.setItem('spothitch_companion', JSON.stringify(saved))
  } catch { /* */ }
  addTripEvent('destination', { destination: dest.trim() })
  window.setState?.({ _guardianSheet: null })
  window._forceRender?.()
}

window.guardianSendMessage = () => {
  const input = document.getElementById('guardian-chat-input')
  if (!input) return
  const text = input.value.trim()
  if (!text) return
  input.value = ''

  // Get current user info
  const state = window.getState?.() || {}
  const senderName = state.username || 'Moi'

  addTripEvent('message', { text, sender: senderName, senderColor: '#f59e0b' })
  window._forceRender?.()

  // Scroll timeline to bottom
  setTimeout(() => {
    const tl = document.getElementById('guardian-timeline')
    if (tl) tl.scrollTop = tl.scrollHeight
  }, 50)
}

window.guardianQuickCheckin = () => {
  companionCheckInFn()
  window.showToast(window.t?.('companionCheckedIn') || 'Check-in !', 'success')
  window._forceRender?.()
}

// ─── Guardian v2: Arrival screen ───

window.guardianShowArrival = () => {
  window.guardianGoToScreen?.('arrival')
}

window.guardianAddToJournal = () => {
  window.closeCompanionModal?.()
  window.setState?.({ activeTab: 'voyage', voyageSubTab: 'journal' })
}
