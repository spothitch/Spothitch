/**
 * Guardian Mode Modal — Guardian v2 Redesign
 * Screens: Intro, Config (main), Active (timeline), Guardian View, Alert, Overdue, Arrival
 *
 * Features:
 * - Multi-guardian support (up to 5)
 * - Timeline with chat messages, events, photos
 * - Quick actions: plate, photo, destination
 * - Bottom sheets for quick action input
 * - Overdue screen with pulsing red ring
 * - Arrival screen with trip summary
 */

import { t } from '../../i18n/index.js'
import { getState } from '../../stores/state.js'
import {
  getGuardianState,
  isCheckInOverdue,
  getBatteryLevel,
  subscribeToGuardianChat,
  unsubscribeGuardianChat,
} from '../../services/guardian.js'

import {
  renderIntroScreen, renderMainScreen,
  renderActiveScreen, renderGuardianScreen,
  renderAlertScreen, renderOverdueScreen, renderArrivalScreen,
  renderBottomSheet,
} from './guardianRender.js'

// Track which screen is active
let _currentScreen = null // null = auto-detect, 'intro', 'main', 'active', 'guardian', 'alert', 'overdue', 'arrival'
// _currentTab removed in v2 (single screen config)
let _batteryPct = null
let _batteryDisplayDone = false

// In-app edit overlay state (replaces native prompt())
let _editOverlay = null // null | { field, label, value, inputType, placeholder, maxLength }

// Bottom sheet state
let _guardianSheet = null // null | 'plate' | 'photo' | 'destination'


export function renderGuardianModal(_state) {
  const guardianState = getGuardianState()
  const active = guardianState.active

  // Check auto-expiration (8 hours max)
  if (active && guardianState.tripStart) {
    const elapsed = Date.now() - guardianState.tripStart
    const maxDuration = 8 * 60 * 60 * 1000
    if (elapsed > maxDuration) {
      import('../../services/guardian.js').then(m => m.stopGuardianMode?.())
      return ''
    }
  }

  // Note: _guardianSheet is set directly by handlers in this file (not from global state)

  // Determine screen — respect _currentScreen if set
  let screen = _currentScreen
  if (!screen) {
    if (active && isCheckInOverdue() && !guardianState.alertSent) {
      screen = 'overdue'
    } else if (active) {
      screen = 'active'
    } else {
      const gs = guardianState
      const hasGuardian = (gs.guardians && gs.guardians.length > 0) || !!gs.guardian?.name
      screen = hasGuardian ? 'main' : 'intro'
    }
  }

  // Show consent screen if not yet consented this session and not already active
  const consentGiven =
    typeof sessionStorage !== 'undefined' &&
    sessionStorage.getItem('spothitch_guardian_consent')
  if (!active && !consentGiven && screen === 'intro') {
    // Keep intro but add consent acceptance on the CTA
  }

  // eslint-disable-next-line no-useless-assignment
  let content = ''
  switch (screen) {
    case 'intro':
      content = renderIntroScreen()
      break
    case 'main':
      content = renderMainScreen(guardianState, _editOverlay)
      break
    case 'active':
      content = renderActiveScreen(guardianState, _batteryPct)
      break
    case 'guardian':
      content = renderGuardianScreen(guardianState)
      break
    case 'alert':
      content = renderAlertScreen(guardianState, _batteryPct)
      break
    case 'overdue':
      content = renderOverdueScreen(guardianState)
      break
    case 'arrival':
      content = renderArrivalScreen(guardianState)
      break
    default:
      content = renderIntroScreen()
  }

  // Bottom sheet overlay
  const sheetHTML = _guardianSheet ? renderBottomSheet(guardianState, _guardianSheet) : ''

  return `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      onclick="closeGuardianModal()"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guardian-modal-title"
      tabindex="0">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true"></div>
      <div
        class="relative bg-dark-primary border border-white/5 rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden slide-up flex flex-col"
        onclick="event.stopPropagation()"
      >
        ${content}
        ${sheetHTML}
      </div>
    </div>
  `
}
/** Accept consent and go to main screen */
window.acceptGuardianConsent = () => {
  sessionStorage.setItem('spothitch_guardian_consent', '1')
  _currentScreen = 'main'
  window._forceRender?.()
}

/** Navigate between guardian screens */
window.guardianGoToScreen = (screen) => {
  _currentScreen = screen
  if (screen === 'main') {
    try { sessionStorage.setItem('spothitch_guardian_consent', '1') } catch { /* ignore */ }
  }
  window._forceRender?.()
}

/** Switch tab in main screen (v2: no-op, kept for backward compat) */
window.guardianSwitchTab = (_index) => {
  _currentScreen = 'main'
  window._forceRender?.()
}

/** Edit config fields — opens in-app overlay instead of native prompt() */
window.guardianEditField = async (field) => {
  const { getGuardianState: gcs } = await import('../../services/guardian.js')
  const state = gcs()

  const fieldConfig = {
    guardian: {
      label: t('guardianLabel') || 'Gardien',
      value: state.guardian?.name || '',
      phone: state.guardian?.phone || '',
      inputType: 'text',
      placeholder: t('guardianNamePrompt') || 'Nom du gardien',
    },
    interval: {
      label: t('guardianCheckinInterval') || 'Intervalle check-in',
      value: String(state.checkInInterval || 30),
      inputType: 'number',
      placeholder: '30',
    },
    destination: {
      label: t('guardianDestination') || 'Destination',
      value: state.destination || '',
      inputType: 'text',
      placeholder: t('guardianDestPrompt') || 'Destination',
    },
    licensePlate: {
      label: t('licensePlateLabel') || 'Plaque',
      value: state.licensePlate || '',
      inputType: 'text',
      placeholder: 'AB-123-CD',
      maxLength: 15,
    },
    customMessage: {
      label: t('customMessageLabel') || 'Message',
      value: state.customMessage || '',
      inputType: 'text',
      placeholder: t('customMessagePrompt') || 'Message a envoyer avec les alertes',
      maxLength: 200,
    },
    tripPhoto: {
      label: t('driverPhoto') || 'Photo conducteur',
      value: '',
      inputType: 'text',
      placeholder: '',
    },
  }

  const config = fieldConfig[field]
  if (!config) return

  // For tripPhoto, open the photo sheet instead of overlay
  if (field === 'tripPhoto') {
    _guardianSheet = 'photo'
    _currentScreen = 'main'
    window._forceRender?.()
    return
  }

  // For interval, use a picker instead of a text input
  if (field === 'interval') {
    _editOverlay = { field, ...config, inputType: 'select' }
    _currentScreen = 'main'
    window._forceRender?.()
    return
  }

  _editOverlay = { field, ...config }
  _currentScreen = 'main'
  window._forceRender?.()

  requestAnimationFrame(() => {
    const input = document.getElementById('guardian-edit-input')
    if (input) {
      input.focus()
      if (input.setSelectionRange && input.value) {
        input.setSelectionRange(input.value.length, input.value.length)
      }
    }
  })
}

/** Select interval from the preset list — saves and closes immediately */
window.guardianSelectInterval = async (minutes) => {
  const { getGuardianState: gcs } = await import('../../services/guardian.js')
  const state = gcs()
  state.checkInInterval = minutes
  try {
    localStorage.setItem('spothitch_guardian', JSON.stringify(state)) // lgtm[js/clear-text-storage-of-sensitive-data]
  } catch { /* ignore */ }
  _editOverlay = null
  window._forceRender?.()
}

/** Save the edited field from in-app overlay */
window.guardianSaveField = async () => {
  if (!_editOverlay) return
  const { getGuardianState: gcs } = await import('../../services/guardian.js')
  const state = gcs()
  const input = document.getElementById('guardian-edit-input')
  const val = input?.value?.trim() || ''

  if (_editOverlay.field === 'guardian') {
    if (!val) {
      window.showToast?.(t('guardianNameRequired') || 'Remplis le nom de ton gardien.', 'warning')
      return
    }
    const phoneInput = document.getElementById('guardian-edit-phone')
    const phone = phoneInput?.value?.trim()?.replace(/[^0-9+]/g, '') || ''
    const GUARDIAN_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#06b6d4', '#a855f7']
    const idx = _editOverlay._guardianIndex
    if (!Array.isArray(state.guardians)) state.guardians = []
    if (idx === -1 || idx === undefined) {
      // Add new guardian
      if (state.guardians.length < 5) {
        const color = GUARDIAN_COLORS[state.guardians.length] || '#64748b'
        state.guardians.push({ name: val, phone, color })
      }
    } else if (idx >= 0 && idx < state.guardians.length) {
      // Edit existing guardian
      state.guardians[idx] = { ...state.guardians[idx], name: val, phone }
    }
    // Keep backward compat: mirror first guardian
    state.guardian = state.guardians.length > 0
      ? { name: state.guardians[0].name, phone: state.guardians[0].phone || '' }
      : { name: val, phone }
  } else if (_editOverlay.field === 'interval') {
    const num = parseInt(val, 10)
    if (!num || num < 5) {
      window.showToast?.('Min. 5 min', 'warning')
      return
    }
    state.checkInInterval = num
  } else if (_editOverlay.field === 'destination') {
    state.destination = val
  } else if (_editOverlay.field === 'licensePlate') {
    state.licensePlate = val.toUpperCase()
  } else if (_editOverlay.field === 'customMessage') {
    state.customMessage = val
  }

  try {
    localStorage.setItem('spothitch_guardian', JSON.stringify(state)) // lgtm[js/clear-text-storage-of-sensitive-data]
  } catch { /* ignore */ }

  _editOverlay = null
  window._forceRender?.()
}

/** Cancel edit overlay */
window.guardianCancelEdit = () => {
  _editOverlay = null
  window._forceRender?.()
}

/** Toggle departure notification */
window.guardianToggleDeparture = async () => {
  const { getGuardianState: gcs } = await import('../../services/guardian.js')
  const state = gcs()
  state.notifyOnDeparture = !(state.notifyOnDeparture !== false)
  try {
    localStorage.setItem('spothitch_guardian', JSON.stringify(state)) // lgtm[js/clear-text-storage-of-sensitive-data]
  } catch { /* ignore */ }
  window._forceRender?.()
}

/** Toggle arrival notification */
window.guardianToggleArrival = async () => {
  const { getGuardianState: gcs } = await import('../../services/guardian.js')
  const state = gcs()
  state.notifyOnArrival = !(state.notifyOnArrival !== false)
  try {
    localStorage.setItem('spothitch_guardian', JSON.stringify(state)) // lgtm[js/clear-text-storage-of-sensitive-data]
  } catch { /* ignore */ }
  window._forceRender?.()
}

/** Guardian action: call traveler */
window.guardianCallTraveler = () => {
  const state = getGuardianState()
  const phone = state.travelerPhone
  if (phone) {
    window.open(`tel:${phone}`, '_self')
  } else {
    import('../../services/notifications.js').then(n => n.showToast(
      t('noTravelerPhone') || 'Numero du voyageur non disponible', 'warning'
    ))
  }
}

/** Guardian action: message traveler */
window.guardianMessageTraveler = () => {
  const state = getGuardianState()
  const phone = state.travelerPhone
  if (phone) {
    window.open(`sms:${phone}`, '_self')
  } else {
    import('../../services/notifications.js').then(n => n.showToast(
      t('noTravelerPhone') || 'Numero du voyageur non disponible', 'warning'
    ))
  }
}

/** Guardian action: show on map */
window.guardianShowMap = () => {
  const state = getGuardianState()
  const positions = state.positions || []
  const lastPos = positions.length > 0 ? positions[positions.length - 1] : null
  if (lastPos) {
    window.open(`https://www.google.com/maps?q=${lastPos.lat},${lastPos.lng}`, '_blank')
  }
}

/** Guardian action: call emergency */
window.guardianCallEmergency = () => {
  window.open('tel:112', '_self')
}

/** Add a trusted contact to the saved guardian state */
window.guardianAddTrustedContact = async () => {
  const nameEl = document.getElementById('guardian-tc-name')
  const phoneEl = document.getElementById('guardian-tc-phone')
  const name = nameEl?.value?.trim() || ''
  const phone = phoneEl?.value?.trim() || ''

  if (!phone) {
    const { showToast } = await import('../../services/notifications.js')
    showToast(t('fillPhoneNumber') || 'Enter a phone number', 'warning')
    return
  }

  const { getGuardianState: gcs } = await import('../../services/guardian.js')
  const state = gcs()
  const contacts = Array.isArray(state.trustedContacts) ? state.trustedContacts : []

  if (contacts.length >= 5) {
    const { showToast } = await import('../../services/notifications.js')
    showToast(t('trustedContactsMaxReached') || 'Maximum 5 contacts', 'warning')
    return
  }

  contacts.push({ name, phone: phone.replace(/[^0-9+]/g, '') })
  state.trustedContacts = contacts

  try {
    localStorage.setItem('spothitch_guardian', JSON.stringify(state)) // lgtm[js/clear-text-storage-of-sensitive-data] — trusted contacts, local device only, declared in RGPD registry
  } catch {
    // ignore
  }

  if (nameEl) nameEl.value = ''
  if (phoneEl) phoneEl.value = ''

  window.setState?.({ showGuardianModal: true })
}

/** Remove a trusted contact by index */
window.guardianRemoveTrustedContact = async (index) => {
  const { getGuardianState: gcs } = await import('../../services/guardian.js')
  const state = gcs()
  const contacts = Array.isArray(state.trustedContacts) ? [...state.trustedContacts] : []
  contacts.splice(index, 1)
  state.trustedContacts = contacts

  try {
    localStorage.setItem('spothitch_guardian', JSON.stringify(state)) // lgtm[js/clear-text-storage-of-sensitive-data] — trusted contacts, local device only
  } catch {
    // ignore
  }

  window.setState?.({ showGuardianModal: true })
}

/** Clear trip history */
window.guardianClearHistory = async () => {
  const { clearTripHistory } = await import('../../services/guardian.js')
  clearTripHistory()
  window.setState?.({ showGuardianModal: true })
}

// ─── V2 HANDLERS ───

/** Close bottom sheet */
window.guardianCloseSheet = () => {
  _guardianSheet = null
  window._forceRender?.()
}

/** Open plate sheet */
window.guardianUpdatePlate = () => {
  _guardianSheet = 'plate'
  window._forceRender?.()
  requestAnimationFrame(() => {
    document.getElementById('guardian-sheet-plate')?.focus()
  })
}

/** Save plate from sheet */
window.guardianSavePlate = async () => {
  const input = document.getElementById('guardian-sheet-plate')
  const val = input?.value?.trim()?.toUpperCase() || ''
  if (!val) return
  const { getGuardianState: gcs, addTripEvent } = await import('../../services/guardian.js')
  const state = gcs()
  const isNew = !!state.licensePlate && state.licensePlate !== val
  state.licensePlate = val
  try {
    localStorage.setItem('spothitch_guardian', JSON.stringify(state)) // lgtm[js/clear-text-storage-of-sensitive-data]
  } catch { /* ignore */ }
  if (state.active) {
    addTripEvent('vehicle', { plate: val, isNew })
  }
  _guardianSheet = null
  window._forceRender?.()
}

/** Open photo sheet */
window.guardianAddTripPhoto = () => {
  _guardianSheet = 'photo'
  window._forceRender?.()
}

/** Save trip photo from sheet — opens native camera, compresses, syncs to Firestore */
window.guardianSaveTripPhoto = async () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.capture = 'environment' // Open rear camera directly on mobile
  input.onchange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      // Resize to max 800px, quality 0.6 (keep under 200KB for Firestore)
      const { compressImage } = await import('../../utils/image.js')
      const base64 = await compressImage(file, 800, 0.6)
      const { setTripPhoto, addTripEvent, syncTripPhotoToFirestore } = await import('../../services/guardian.js')

      // Save locally
      setTripPhoto(base64)
      addTripEvent('photo', { hasPhoto: true })

      // Sync to Firestore so guardian sees the photo in real-time
      syncTripPhotoToFirestore(base64)

      window.showToast?.(window.t?.('photoSaved') || 'Photo saved', 'success')
    } catch (err) {
      console.warn('[Guardian] Photo error:', err.message)
      window.showToast?.(window.t?.('photoError') || 'Photo error', 'error')
    }
    _guardianSheet = null
    window._forceRender?.()
  }
  input.click()
}

/** Open destination sheet */
window.guardianUpdateDestination = () => {
  _guardianSheet = 'destination'
  window._forceRender?.()
  requestAnimationFrame(() => {
    document.getElementById('guardian-sheet-dest')?.focus()
  })
}

/** Save destination from sheet */
window.guardianSaveDestination = async () => {
  const input = document.getElementById('guardian-sheet-dest')
  const val = input?.value?.trim() || ''
  if (!val) return
  const { getGuardianState: gcs, addTripEvent } = await import('../../services/guardian.js')
  const state = gcs()
  state.destination = val
  try {
    localStorage.setItem('spothitch_guardian', JSON.stringify(state)) // lgtm[js/clear-text-storage-of-sensitive-data]
  } catch { /* ignore */ }
  if (state.active) {
    addTripEvent('destination', { destination: val })
  }
  _guardianSheet = null
  window._forceRender?.()
}

/** Send message from active screen compose bar */
window.guardianSendMessage = async () => {
  const input = document.getElementById('guardian-message-input')
  const text = input?.value?.trim() || ''
  if (!text) return
  const { sendGuardianMessage } = await import('../../services/guardian.js')
  await sendGuardianMessage(text)
  if (input) input.value = ''
  window._forceRender?.()
  requestAnimationFrame(() => {
    const tl = document.getElementById('guardian-timeline')
    if (tl) tl.scrollTop = tl.scrollHeight
  })
}

/** Quick check-in from compose bar */
window.guardianQuickCheckin = async () => {
  const { checkIn, addTripEvent } = await import('../../services/guardian.js')
  checkIn()
  addTripEvent('checkin', {})
  window._forceRender?.()
  requestAnimationFrame(() => {
    const tl = document.getElementById('guardian-timeline')
    if (tl) tl.scrollTop = tl.scrollHeight
  })
}

/** Show arrival screen */
window.guardianShowArrival = () => {
  _currentScreen = 'arrival'
  window._forceRender?.()
}

/** Add trip to journal from arrival screen */
window.guardianAddToJournal = () => {
  // Navigate to journal view
  window.showJournal?.()
  window.closeGuardianModal?.()
}

/** Edit guardian by index */
window.guardianEditGuardian = async (index) => {
  const { getGuardians: gg } = await import('../../services/guardian.js')
  const guardians = gg()
  const g = guardians[index]
  if (!g) return

  _editOverlay = {
    field: 'guardian',
    label: index === 0 ? (t('mainGuardian') || 'Gardien principal') : (t('guardian') || 'Gardien'),
    value: g.name,
    phone: g.phone || '',
    inputType: 'text',
    placeholder: t('guardianNamePrompt') || 'Nom du gardien',
    _guardianIndex: index,
  }
  _currentScreen = 'main'
  window._forceRender?.()

  requestAnimationFrame(() => {
    const input = document.getElementById('guardian-edit-input')
    if (input) {
      input.focus()
      if (input.setSelectionRange && input.value) {
        input.setSelectionRange(input.value.length, input.value.length)
      }
    }
  })
}

/** Add a new guardian */
window.guardianAddGuardian = () => {
  _editOverlay = {
    field: 'guardian',
    label: t('addGuardian') || 'Ajouter un gardien',
    value: '',
    phone: '',
    inputType: 'text',
    placeholder: t('guardianNamePrompt') || 'Nom du gardien',
    _guardianIndex: -1, // -1 = new
  }
  _currentScreen = 'main'
  window._forceRender?.()

  requestAnimationFrame(() => {
    document.getElementById('guardian-edit-input')?.focus()
  })
}

/** Remove a guardian by index */
window.guardianRemoveGuardian = async (index) => {
  const { removeGuardian } = await import('../../services/guardian.js')
  removeGuardian(index)
  window._forceRender?.()
}

/** Load and display battery level into the active view */
async function updateBatteryDisplay() {
  const el = document.getElementById('guardian-battery-row')
  if (!el) return

  const level = await getBatteryLevel()
  if (level === null) return

  _batteryPct = Math.round(level * 100)
  window._forceRender?.() // Re-render to show updated battery value
}

/** Guardian sends a reply message to the traveler */
window.guardianSendReply = async () => {
  const input = document.getElementById('guardian-reply-input')
  const text = input?.value?.trim() || ''
  if (!text) return

  const watchedTimers = getState().watchedGuardianTimers || []
  const travelerId = watchedTimers[0]?.id
  if (!travelerId) return

  const { sendGuardianReply } = await import('../../services/guardian.js')
  const ok = await sendGuardianReply(travelerId, text)
  if (ok) {
    if (input) input.value = ''
    window._forceRender?.()
    requestAnimationFrame(() => {
      const el = document.getElementById('guardian-chat-scroll')
      if (el) el.scrollTop = el.scrollHeight
    })
  } else {
    window.showToast?.(t('messageSendFailed') || 'Message failed to send', 'error')
  }
}

let _chatSubscribed = false

// Init guardian battery display + chat subscription after render
export function initGuardianAfterRender(isVisible) {
  if (isVisible) {
    const el = document.getElementById('guardian-battery-row')
    if (el && !_batteryDisplayDone) {
      _batteryDisplayDone = true
      updateBatteryDisplay()
    }
    // Scroll timeline to bottom
    requestAnimationFrame(() => {
      const tl = document.getElementById('guardian-timeline')
      if (tl) tl.scrollTop = tl.scrollHeight
      const chatScroll = document.getElementById('guardian-chat-scroll')
      if (chatScroll) chatScroll.scrollTop = chatScroll.scrollHeight
    })

    // Subscribe to real-time chat for traveler's own messages
    if (!_chatSubscribed) {
      _chatSubscribed = true
      import('../../services/firebase.js').then(({ getCurrentUser }) => {
        const user = getCurrentUser()
        if (user) {
          subscribeToGuardianChat(user.uid, (_msgs) => {
            // Firestore messages updated → re-render timeline
            window._forceRender?.()
          })
        }
      }).catch(() => { /* not logged in */ })
    }
  } else {
    _batteryDisplayDone = false
    _currentScreen = null
    _guardianSheet = null
    if (_chatSubscribed) {
      _chatSubscribed = false
      unsubscribeGuardianChat()
    }
  }
}

export default { renderGuardianModal }
