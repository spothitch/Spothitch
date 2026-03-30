/**
 * Companion Mode Modal — Guardian v1 Redesign
 * 5 screens: Intro, Main (tabs: Guardian + Config), Active, Guardian View, Alert View
 *
 * Features:
 * - SMS channel toggle (#22)
 * - GPS breadcrumb timeline (#24)
 * - Safe arrival notification toggle (#25)
 * - Departure notification toggle (#26)
 * - Battery level display (#27)
 * - ETA estimation (#28)
 * - Check-in reminder (handled in service) (#29)
 * - Trusted contacts circle (#30)
 * - Trip history (#31)
 */

import { t } from '../../i18n/index.js'
import { icon } from '../../utils/icons.js'
import { escapeHTML } from '../../utils/sanitize.js'
import { getState } from '../../stores/state.js'
import {
  getCompanionState,
  getTimeUntilNextCheckIn,
  isCheckInOverdue,
  loadTripHistory,
  getETAInfo,
  getBatteryLevel,
} from '../../services/companion.js'

// Track which screen/tab is active
let _currentScreen = null // null = auto-detect, 'intro', 'main', 'active', 'guardian', 'alert'
let _currentTab = 0 // 0 = Guardian, 1 = Config
let _batteryPct = null
let _batteryDisplayDone = false

// In-app edit overlay state (replaces native prompt())
let _editOverlay = null // null | { field, label, value, inputType, placeholder, maxLength }

/**
 * Render the Companion Mode modal
 */
export function renderCompanionModal(_state) {
  const companion = getCompanionState()
  const active = companion.active

  // Check auto-expiration (8 hours max)
  if (active && companion.tripStart) {
    const elapsed = Date.now() - companion.tripStart
    const maxDuration = 8 * 60 * 60 * 1000
    if (elapsed > maxDuration) {
      import('../../services/companion.js').then(m => m.stopCompanionMode?.())
      return ''
    }
  }

  // Determine screen — respect _currentScreen if set (e.g. user clicked Configure)
  let screen = _currentScreen
  if (!screen) {
    if (active && isCheckInOverdue() && !companion.alertSent) {
      screen = 'alert'
    } else if (active) {
      screen = 'active'
    } else {
      // Show intro only on first ever open (no guardian configured AND no explicit navigation)
      const hasGuardian = !!companion.guardian?.name
      screen = hasGuardian ? 'main' : 'intro'
    }
  }

  // Check if location consent was given this session
  const consentGiven =
    typeof sessionStorage !== 'undefined' &&
    sessionStorage.getItem('spothitch_companion_consent')

  // Show consent screen if not yet consented this session and not already active
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
      content = renderMainScreen(companion)
      break
    case 'active':
      content = renderActiveScreen(companion)
      break
    case 'guardian':
      content = renderGuardianScreen(companion)
      break
    case 'alert':
      content = renderAlertScreen(companion)
      break
    default:
      content = renderIntroScreen()
  }

  return `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      onclick="closeCompanionModal()"
      role="dialog"
      aria-modal="true"
      aria-labelledby="companion-modal-title"
      tabindex="0">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true"></div>
      <div
        class="relative bg-dark-primary border border-white/5 rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden slide-up flex flex-col"
        onclick="event.stopPropagation()"
      >
        ${content}
      </div>
    </div>
  `
}

// ─── SCREEN 1: INTRO ───

function renderIntroScreen() {
  const features = [
    {
      icon: 'user-check',
      color: '#22c55e',
      bg: 'rgba(34,197,94,.08)',
      title: t('guardianFeatureTrusted') || 'Gardien de confiance',
      desc: t('guardianFeatureTrustedDesc') || 'Choisis qui te surveille (1 à 5 contacts)',
    },
    {
      icon: 'clock',
      color: '#3b82f6',
      bg: 'rgba(59,130,246,.08)',
      title: t('guardianFeatureCheckin') || 'Check-in automatique',
      desc: t('guardianFeatureCheckinDesc') || "L'app te demande si tout va bien. Pas de réponse = alerte",
    },
    {
      icon: 'map-pin',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,.08)',
      title: t('guardianFeaturePosition') || 'Position en direct',
      desc: t('guardianFeaturePositionDesc') || 'Ton gardien voit ta position sur la carte SpotHitch',
    },
    {
      icon: 'bell',
      color: '#f43f5e',
      bg: 'rgba(244,63,94,.08)',
      title: t('guardianFeatureAlert') || 'Alerte automatique',
      desc: t('guardianFeatureAlertDesc') || 'Notification push si tu ne reponds pas',
    },
    {
      icon: 'wifi-off',
      color: '#8b5cf6',
      bg: 'rgba(139,92,246,.08)',
      title: t('guardianFeatureOffline') || 'Fonctionne hors ligne',
      desc: t('guardianFeatureOfflineDesc') || 'Même sans réseau, ton gardien est prévenu',
    },
  ]

  return `
    <div class="p-6 flex flex-col items-center text-center">
      <!-- Close button -->
      <div class="w-full flex justify-end mb-2">
        <button onclick="closeCompanionModal()" class="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center" type="button" aria-label="${t('close') || 'Fermer'}">
          ${icon('x', 'w-3.5 h-3.5 text-slate-400')}
        </button>
      </div>

      <!-- Icon -->
      <div class="w-14 h-14 rounded-full bg-emerald-500/[0.06] border-[1.5px] border-emerald-500/[0.12] flex items-center justify-center mb-4">
        ${icon('shield-check', 'w-6 h-6 text-emerald-500')}
      </div>

      <h2 id="companion-modal-title" class="text-lg font-extrabold text-slate-200 mb-1">
        ${t('guardianModeTitle') || 'Mode Guardian'}
      </h2>
      <p class="text-[13px] text-slate-400 leading-relaxed max-w-[280px]">
        ${t('guardianModeDesc') || 'Un proche suit ton trajet en temps réel. Si tu ne reponds plus, il est alerté automatiquement.'}
      </p>

      <!-- Features -->
      <div class="w-full text-left mt-5 space-y-2.5">
        ${features.map(f => `
          <div class="flex items-start gap-3">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style="background:${f.bg}">
              <span style="color:${f.color}">${icon(f.icon, 'w-3.5 h-3.5')}</span>
            </div>
            <div>
              <div class="text-[13px] font-semibold text-slate-200">${f.title}</div>
              <div class="text-[11px] text-slate-500 leading-snug">${f.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- CTA -->
      <button
        onclick="guardianGoToScreen('main')"
        class="w-full mt-5 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[15px] transition-colors flex items-center justify-center gap-2"
      >
        ${icon('settings', 'w-[18px] h-[18px]')}
        ${t('guardianConfigure') || 'Configurer'}
      </button>
      <button onclick="closeCompanionModal()" class="text-[13px] text-slate-500 mt-2 py-1">${t('later') || 'Plus tard'}</button>
    </div>
  `
}

// ─── SCREEN 2: MAIN (2 tabs) ───

function renderMainScreen(companion) {
  const tab0Active = _currentTab === 0
  const tab1Active = _currentTab === 1

  return `
    <!-- Header -->
    <div class="px-5 py-3 flex items-center gap-2 border-b border-white/5">
      <div class="w-7 h-7 rounded-full flex items-center justify-center" style="background:rgba(34,197,94,.08)">
        ${icon('shield-check', 'w-3.5 h-3.5 text-emerald-500')}
      </div>
      <h2 id="companion-modal-title" class="text-[15px] font-extrabold text-white flex-1">Guardian</h2>
      <button onclick="closeCompanionModal()" class="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center" aria-label="${t('close') || 'Close'}">
        ${icon('x', 'w-3.5 h-3.5 text-slate-400')}
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-white/[0.06] px-5">
      <button onclick="guardianSwitchTab(0)" class="flex-1 py-2.5 text-center text-[11px] font-semibold flex items-center justify-center gap-1 border-b-2 transition-colors ${tab0Active ? 'text-emerald-500 border-emerald-500' : 'text-slate-500 border-transparent'}">
        ${icon('shield', 'w-3 h-3')} Guardian
      </button>
      <button onclick="guardianSwitchTab(1)" class="flex-1 py-2.5 text-center text-[11px] font-semibold flex items-center justify-center gap-1 border-b-2 transition-colors ${tab1Active ? 'text-emerald-500 border-emerald-500' : 'text-slate-500 border-transparent'}">
        ${icon('settings', 'w-3 h-3')} Config
      </button>
    </div>

    <!-- Tab 0: Guardian -->
    <div class="${tab0Active ? 'block' : 'hidden'} flex-1 overflow-y-auto p-4">
      ${renderGuardianTab(companion)}
    </div>

    <!-- Tab 1: Config -->
    <div class="${tab1Active ? 'block' : 'hidden'} flex-1 overflow-y-auto p-4">
      ${renderConfigTab(companion)}
    </div>
  `
}

function renderGuardianTab(companion) {
  const guardianName = companion.guardian?.name || ''
  const guardianPhone = companion.guardian?.phone || ''
  const interval = companion.checkInInterval || 30
  const destination = companion.destination || ''
  const licensePlate = companion.licensePlate || ''
  const customMessage = companion.customMessage || ''

  // Alert type label
  const alertType = guardianPhone ? 'Push + SMS' : 'Push'

  // Tiles data
  const tiles = [
    {
      borderColor: '#22c55e',
      bgColor: 'rgba(34,197,94,.1)',
      iconName: 'user-check',
      iconColor: '#22c55e',
      label: t('myGuardian') || 'Mon gardien',
      sub: guardianName ? `${escapeHTML(guardianName)}` : (t('notConfigured') || 'Non configure'),
    },
    {
      borderColor: '#3b82f6',
      bgColor: 'rgba(59,130,246,.1)',
      iconName: 'clock',
      iconColor: '#3b82f6',
      label: 'Check-in',
      sub: t('every') ? `${t('every')} ${interval} min` : `Toutes les ${interval} min`,
    },
    {
      borderColor: '#f59e0b',
      bgColor: 'rgba(245,158,11,.1)',
      iconName: 'map-pin',
      iconColor: '#f59e0b',
      label: t('companionDestination') || 'Destination',
      sub: destination ? escapeHTML(destination) : (t('notDefined') || 'Non defini'),
    },
    {
      borderColor: '#8b5cf6',
      bgColor: 'rgba(139,92,246,.1)',
      iconName: 'bell',
      iconColor: '#8b5cf6',
      label: t('alerts') || 'Alertes',
      sub: alertType,
    },
  ]

  // Add license plate tile if configured
  if (licensePlate) {
    tiles.push({
      borderColor: '#06b6d4',
      bgColor: 'rgba(6,182,212,.1)',
      iconName: 'car',
      iconColor: '#06b6d4',
      label: t('licensePlateLabel') || 'Plaque',
      sub: escapeHTML(licensePlate),
    })
  }

  return `
    <!-- 2x2 Grid -->
    <div class="grid grid-cols-2 gap-2 mb-3">
      ${tiles.map(tile => `
        <div class="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 text-center cursor-pointer active:scale-[0.96] active:bg-white/[0.08] transition-all"
          style="border-left:3px solid ${tile.borderColor}">
          <div class="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style="background:${tile.bgColor}">
            <span style="color:${tile.iconColor}">${icon(tile.iconName, 'w-[18px] h-[18px]')}</span>
          </div>
          <div class="text-xs font-semibold text-slate-200">${tile.label}</div>
          <div class="text-[9px] text-slate-500 mt-0.5">${tile.sub}</div>
        </div>
      `).join('')}
    </div>

    <!-- Hidden form fields for startCompanion handler -->
    <input type="hidden" id="companion-guardian-name" value="${escapeHTML(guardianName)}" />
    <input type="hidden" id="companion-guardian-phone" value="${escapeHTML(guardianPhone)}" />
    <input type="hidden" id="companion-interval" value="${interval}" />
    <input type="hidden" id="companion-destination" value="${escapeHTML(destination)}" />
    <input type="hidden" id="companion-notify-departure" ${companion.notifyOnDeparture !== false ? 'checked' : ''} />
    <input type="hidden" id="companion-notify-arrival" ${companion.notifyOnArrival !== false ? 'checked' : ''} />
    <input type="hidden" id="companion-license-plate" value="${escapeHTML(licensePlate)}" />
    <input type="hidden" id="companion-custom-message" value="${escapeHTML(customMessage)}" />

    <!-- Start button -->
    <button
      onclick="startCompanion()"
      class="w-full py-3 rounded-xl text-emerald-300 font-bold text-sm flex items-center justify-center gap-2 active:border-emerald-500 transition-all"
      style="background:rgba(34,197,94,.08);border:1.5px solid rgba(34,197,94,.2)"
    >
      ${icon('play', 'w-[18px] h-[18px] text-emerald-500')}
      ${t('companionStartTrip') || 'Demarrer mon trajet'}
    </button>
    <p class="text-[10px] text-slate-600 text-center mt-1.5">
      ${t('companionStartInfo') || 'Ton gardien sera notifie et suivra ta position'}
    </p>

    <!-- Trip history -->
    ${loadTripHistory().length > 0 ? renderTripHistory(loadTripHistory()) : ''}
  `
}

function renderConfigTab(companion) {
  // If edit overlay is active, show it instead of config list
  if (_editOverlay) return renderEditOverlay()

  const guardianName = companion.guardian?.name || ''
  const guardianPhone = companion.guardian?.phone || ''
  const interval = companion.checkInInterval || 30
  const destination = companion.destination || ''
  const licensePlate = companion.licensePlate || ''
  const customMessage = companion.customMessage || ''

  return `
    <div class="space-y-1.5">
      <!-- Guardian -->
      ${configRow('#22c55e', 'user-check', t('guardianLabel') || 'Gardien', t('guardianConfigDesc') || 'Qui recevra tes alertes', guardianName ? `${escapeHTML(guardianName)}${guardianPhone ? ' · ' + escapeHTML(guardianPhone) : ''} \u2713` : (t('notConfigured') || 'Non configure'), guardianName ? '#22c55e' : '#64748b', "guardianEditField('guardian')")}

      <!-- Interval -->
      ${configRow('#3b82f6', 'clock', t('guardianCheckinInterval') || 'Intervalle check-in', t('guardianCheckinIntervalDesc') || 'Delai entre chaque verification', `${interval} min`, '#60a5fa', "guardianEditField('interval')")}

      <!-- Destination -->
      ${configRow('#f59e0b', 'map-pin', t('companionDestination') || 'Destination', t('guardianDestDesc') || 'Ou tu vas (optionnel)', destination ? escapeHTML(destination) : (t('notDefined') || 'Non defini'), destination ? '#f59e0b' : '#64748b', "guardianEditField('destination')")}

      <!-- License plate -->
      ${configRow('#06b6d4', 'car', t('licensePlateLabel') || 'Plaque', t('licensePlateDesc') || 'Incluse dans les alertes', licensePlate ? escapeHTML(licensePlate) : (t('notDefined') || 'Non defini'), licensePlate ? '#06b6d4' : '#64748b', "guardianEditField('licensePlate')")}

      <!-- Custom message -->
      ${configRow('#f43f5e', 'message-square', t('customMessageLabel') || 'Message', t('customMessageDesc') || 'Message envoye avec les alertes', customMessage ? `${escapeHTML(customMessage.substring(0, 25))}${customMessage.length > 25 ? '...' : ''}` : (t('notDefined') || 'Non defini'), customMessage ? '#f43f5e' : '#64748b', "guardianEditField('customMessage')")}

      <!-- Departure toggle -->
      ${configRow('#06b6d4', 'bell', t('notifyOnDeparture') || 'Notif. depart', t('guardianDepartDesc') || 'Prevenir quand tu pars', companion.notifyOnDeparture !== false ? (t('enabled') || 'Active') : (t('disabled') || 'Desactive'), companion.notifyOnDeparture !== false ? '#22c55e' : '#64748b', 'guardianToggleDeparture()')}

      <!-- Arrival toggle -->
      ${configRow('#a855f7', 'flag', t('notifyOnArrival') || 'Notif. arrivee', t('guardianArrivalDesc') || 'Prevenir quand tu arrives', companion.notifyOnArrival !== false ? (t('enabled') || 'Active') : (t('disabled') || 'Desactive'), companion.notifyOnArrival !== false ? '#22c55e' : '#64748b', 'guardianToggleArrival()')}

      <!-- Battery (always on) -->
      ${configRow('#ec4899', 'zap', t('guardianBatteryAlert') || 'Alerte batterie', t('guardianBatteryAlertDesc') || 'Prevenir sous 15%', t('enabled') || 'Active', '#22c55e', null)}
    </div>
  `
}

/** Reusable config row */
function configRow(borderColor, iconName, title, desc, value, valueColor, action) {
  return `
    <div class="flex items-center gap-3 p-3 rounded-xl cursor-pointer active:bg-white/[0.06] transition-colors"
      style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-left:3px solid ${borderColor}"
      ${action ? `onclick="${action}"` : ''} role="button" tabindex="0">
      <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background:${borderColor}15">
        <span style="color:${borderColor}">${icon(iconName, 'w-3.5 h-3.5')}</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-xs font-semibold text-slate-200">${title}</div>
        <div class="text-[10px] text-slate-500">${desc}</div>
      </div>
      <div class="text-[11px] font-semibold shrink-0 max-w-[100px] truncate" style="color:${valueColor}">${value}</div>
      ${action ? `<span class="text-slate-600">${icon('chevron-right', 'w-3 h-3')}</span>` : ''}
    </div>
  `
}

/** In-app edit overlay (replaces native prompt()) */
function renderEditOverlay() {
  if (!_editOverlay) return ''
  const { field, label, value, inputType, placeholder, maxLength } = _editOverlay
  const isTextarea = field === 'customMessage'
  const escapedValue = escapeHTML(value || '')

  return `
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-center gap-2 mb-4">
        <button onclick="guardianCancelEdit()" class="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center" type="button" aria-label="${t('back') || 'Retour'}">
          ${icon('arrow-left', 'w-4 h-4 text-slate-400')}
        </button>
        <h3 class="text-sm font-bold text-slate-200 flex-1">${label}</h3>
      </div>

      <!-- Input -->
      ${isTextarea ? `
        <textarea
          id="guardian-edit-input"
          class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1)"
          placeholder="${placeholder || ''}"
          rows="3"
          ${maxLength ? `maxlength="${maxLength}"` : ''}
        >${escapedValue}</textarea>
      ` : `
        <input
          id="guardian-edit-input"
          type="${inputType || 'text'}"
          class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1)"
          value="${escapedValue}"
          placeholder="${placeholder || ''}"
          ${inputType === 'number' ? 'min="5" max="120"' : ''}
          ${maxLength ? `maxlength="${maxLength}"` : ''}
          autocomplete="off"
        />
      `}
      ${field === 'interval' ? `<p class="text-[10px] text-slate-500 mt-1.5 px-1">5 ${t('to') || 'a'} 120 ${t('minutes') || 'minutes'}</p>` : ''}
      ${field === 'guardian' ? `
        <input
          id="guardian-edit-phone"
          type="tel"
          class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 mt-2"
          style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1)"
          value="${escapeHTML(_editOverlay.phone || '')}"
          placeholder="${t('guardianPhoneOptionalPrompt') || 'Telephone (optionnel)'}"
          autocomplete="off"
        />
      ` : ''}

      <!-- Buttons -->
      <div class="flex gap-2 mt-4">
        <button
          onclick="guardianCancelEdit()"
          class="flex-1 py-3 rounded-xl text-slate-400 font-semibold text-sm transition-colors"
          style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)"
        >
          ${t('cancel') || 'Annuler'}
        </button>
        <button
          onclick="guardianSaveField()"
          class="flex-1 py-3 rounded-xl text-white font-bold text-sm transition-colors"
          style="background:rgba(34,197,94,.15);border:1px solid rgba(34,197,94,.3)"
        >
          ${icon('circle-check', 'w-4 h-4 inline-block mr-1')}
          ${t('save') || 'Enregistrer'}
        </button>
      </div>
    </div>
  `
}

// ─── SCREEN 3: ACTIVE ───

function renderActiveScreen(companion) {
  const secondsRemaining = getTimeUntilNextCheckIn()
  const overdue = secondsRemaining < 0
  const absSeconds = Math.abs(secondsRemaining)
  const minutes = Math.floor(absSeconds / 60)
  const seconds = absSeconds % 60

  const timerText = `${overdue ? '+' : ''}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  // Trip duration
  const tripMs = companion.tripStart ? Date.now() - companion.tripStart : 0
  const tripMinutes = Math.floor(tripMs / 60_000)
  const tripHours = Math.floor(tripMinutes / 60)
  const tripMins = tripMinutes % 60
  const durationText = tripHours > 0 ? `${tripHours}h${String(tripMins).padStart(2, '0')}` : `${tripMins}min`

  // ETA
  const etaInfo = getETAInfo(companion)
  const etaText = etaInfo.etaMinutes !== null
    ? (etaInfo.etaMinutes < 60 ? `~${etaInfo.etaMinutes} min` : `~${Math.floor(etaInfo.etaMinutes / 60)}h${String(etaInfo.etaMinutes % 60).padStart(2, '0')}`)
    : ''

  // Positions
  const positions = companion.positions || []
  const lastPos = positions.length > 0 ? positions[positions.length - 1] : null
  const posText = lastPos ? `${lastPos.lat.toFixed(2)}, ${lastPos.lng.toFixed(2)}` : ''

  // Battery
  const battText = _batteryPct !== null ? `${_batteryPct}%` : ''

  // Ring class
  const isWarning = !overdue && secondsRemaining < 180
  const ringBorder = overdue
    ? 'border-red-500/50 animate-pulse'
    : isWarning
      ? 'border-amber-500/40'
      : 'border-emerald-500/25'
  const timerColor = overdue ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-white'

  const guardianName = companion.guardian?.name || ''

  return `
    <!-- Header -->
    <div class="px-5 py-3 flex items-center gap-2" style="border-bottom:1px solid rgba(34,197,94,.15)">
      <div class="w-7 h-7 rounded-full flex items-center justify-center" style="background:rgba(34,197,94,.15)">
        ${icon('shield-check', 'w-3.5 h-3.5 text-emerald-500')}
      </div>
      <h2 id="companion-modal-title" class="text-[15px] font-extrabold text-emerald-500 flex-1">
        ${t('guardianActive') || 'Guardian actif'}
      </h2>
      <button onclick="closeCompanionModal()" class="w-7 h-7 rounded-full flex items-center justify-center" style="background:rgba(239,68,68,.08)" aria-label="${t('close') || 'Close'}">
        ${icon('square', 'w-3.5 h-3.5 text-red-500')}
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto flex flex-col items-center px-4 py-4">
      <!-- Timer ring -->
      <div class="w-[130px] h-[130px] rounded-full border-[5px] ${ringBorder} flex flex-col items-center justify-center my-6">
        <div class="text-[2rem] font-extrabold ${timerColor} leading-none">${timerText}</div>
        <div class="text-[10px] text-slate-500">${overdue ? (t('companionOverdueLabel') || 'en retard') : (t('nextCheckIn') || 'prochain check-in')}</div>
      </div>

      <!-- I'm fine button -->
      <button
        onclick="companionCheckIn()"
        class="w-4/5 max-w-[260px] py-3 bg-emerald-500 rounded-full text-white font-bold text-sm flex items-center justify-center gap-2 mx-auto mb-4 active:opacity-90 transition-all"
      >
        ${icon('circle-check', 'w-[18px] h-[18px]')}
        ${t('imSafe') || 'Je vais bien'}
      </button>

      <!-- Stats -->
      <div class="w-full flex justify-around py-3 rounded-xl mb-3"
        style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05)">
        <div class="text-center">
          <div class="text-sm font-bold text-emerald-400" id="companion-battery-row">${battText ? `\u{1F50B} ${battText}` : '\u{1F50B}'}</div>
          <div class="text-[8px] text-slate-500 uppercase">${t('batteryLevel') || 'Batterie'}</div>
        </div>
        <div class="text-center">
          <div class="text-sm font-bold text-white">${posText ? `\u{1F4CD} ${posText}` : '\u{1F4CD}'}</div>
          <div class="text-[8px] text-slate-500 uppercase">${t('positions') || 'Position'}</div>
        </div>
        <div class="text-center">
          <div class="text-sm font-bold text-amber-400">${etaText || '...'}</div>
          <div class="text-[8px] text-slate-500 uppercase">ETA</div>
        </div>
        <div class="text-center">
          <div class="text-sm font-bold text-white">${durationText}</div>
          <div class="text-[8px] text-slate-500 uppercase">${t('tripDuration') || 'Duree'}</div>
        </div>
      </div>

      <!-- Guardian info bar -->
      <div class="w-full py-2 px-3 rounded-lg text-center mb-3"
        style="background:rgba(34,197,94,.04);border:1px solid rgba(34,197,94,.1)">
        <div class="text-[11px] text-emerald-500 font-semibold">
          \u{1F6E1}\uFE0F ${guardianName ? `${escapeHTML(guardianName)} ${t('guardianWatching') || 'surveille ton trajet'}` : (t('guardianActiveInfo') || 'Guardian actif')}
        </div>
        <div class="text-[9px] text-slate-500">
          ${t('lastCheckInAgo') || 'Dernier check-in il y a'} ${companion.lastCheckIn ? formatTimeAgo(companion.lastCheckIn) : '...'}
        </div>
      </div>

      <!-- Stop button -->
      <button
        onclick="stopCompanion()"
        class="w-full py-2.5 rounded-xl text-red-400 font-semibold text-xs flex items-center justify-center gap-1.5 mt-3"
        style="background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.15)"
      >
        ${icon('square', 'w-3.5 h-3.5')}
        ${t('stopTrip') || 'Arreter'}
      </button>
    </div>
  `
}

// ─── SCREEN 4: GUARDIAN VIEW ───

function renderGuardianScreen(companion) {
  // This screen is for when the user is acting as a guardian watching someone else
  // Uses getActiveGuardianTimers from guardianWatch service
  const guardianName = companion.guardian?.name || 'Voyageur'
  const destination = companion.destination || ''

  const tripMs = companion.tripStart ? Date.now() - companion.tripStart : 0
  const tripMinutes = Math.floor(tripMs / 60_000)
  const tripHours = Math.floor(tripMinutes / 60)
  const tripMins = tripMinutes % 60

  const initial = (guardianName)[0].toUpperCase()

  return `
    <!-- Header -->
    <div class="px-5 py-3 flex items-center gap-2 border-b border-white/5">
      <div class="w-7 h-7 rounded-full flex items-center justify-center" style="background:rgba(245,158,11,.08)">
        ${icon('eye', 'w-3.5 h-3.5 text-amber-500')}
      </div>
      <h2 id="companion-modal-title" class="text-[15px] font-extrabold text-white flex-1">
        ${t('trackingOf') || 'Suivi de'} ${escapeHTML(guardianName)}
      </h2>
      <button onclick="guardianGoToScreen('main')" class="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center" aria-label="${t('close') || 'Close'}">
        ${icon('x', 'w-3.5 h-3.5 text-slate-400')}
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-4">
      <!-- Map placeholder -->
      <div class="w-full h-[180px] rounded-xl mb-3 flex items-center justify-center relative overflow-hidden"
        style="background:linear-gradient(135deg,#1a2332,#0f1520)">
        <div class="absolute inset-0" style="background:radial-gradient(circle at 60% 40%,rgba(34,197,94,.12) 0%,transparent 50%)"></div>
        <span class="text-slate-600 text-[11px] z-10">
          \u{1F4CD} ${t('realtimeMap') || 'Carte temps reel'} ${destination ? `\u00B7 ${escapeHTML(destination)}` : ''}
        </span>
      </div>

      <!-- Traveler card -->
      <div class="rounded-xl p-3 mb-2" style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-[#0f1117]"
            style="background:linear-gradient(135deg,#f59e0b,#d97706)">${escapeHTML(initial)}</div>
          <div class="text-[13px] font-bold text-white flex-1">${escapeHTML(guardianName)}</div>
          <div class="text-[9px] flex items-center gap-1 text-emerald-400">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${t('onTrip') || 'En route'}
          </div>
        </div>
        <!-- Metrics -->
        <div class="grid grid-cols-3 gap-1 mt-2">
          <div class="text-center py-1.5 rounded" style="background:rgba(255,255,255,.02)">
            <div class="text-xs font-bold text-emerald-400">\u2713 ${companion.lastCheckIn ? formatTimeAgo(companion.lastCheckIn) : '...'}</div>
            <div class="text-[8px] text-slate-500">Check-in</div>
          </div>
          <div class="text-center py-1.5 rounded" style="background:rgba(255,255,255,.02)">
            <div class="text-xs font-bold text-white">\u{1F50B} ${_batteryPct !== null ? `${_batteryPct}%` : '...'}</div>
            <div class="text-[8px] text-slate-500">${t('batteryLevel') || 'Batterie'}</div>
          </div>
          <div class="text-center py-1.5 rounded" style="background:rgba(255,255,255,.02)">
            <div class="text-xs font-bold text-amber-400">~${tripHours > 0 ? `${tripHours}h${String(tripMins).padStart(2, '0')}` : `${tripMins}min`}</div>
            <div class="text-[8px] text-slate-500">${t('arrival') || 'Arrivee'}</div>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="mt-2">
        <div class="text-[11px] font-semibold text-slate-300 mb-1.5">\u{1F4CD} ${t('timeline') || 'Historique'}</div>
        ${renderTimelineEvents(companion)}
      </div>

      <!-- Action buttons -->
      <div class="flex gap-1.5 mt-3">
        <button onclick="guardianCallTraveler()" class="flex-1 py-2.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1" style="background:rgba(59,130,246,.08);color:#60a5fa;border:none">
          ${icon('phone', 'w-3 h-3')} ${t('call') || 'Appeler'}
        </button>
        <button onclick="guardianMessageTraveler()" class="flex-1 py-2.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1" style="background:rgba(34,197,94,.08);color:#22c55e;border:none">
          ${icon('message-circle', 'w-3 h-3')} ${t('message') || 'Message'}
        </button>
        <button onclick="guardianShowMap()" class="flex-1 py-2.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1" style="background:rgba(245,158,11,.08);color:#f59e0b;border:none">
          ${icon('map', 'w-3 h-3')} ${t('map') || 'Carte'}
        </button>
      </div>
    </div>
  `
}

// ─── SCREEN 5: ALERT ───

function renderAlertScreen(companion) {
  const guardianName = companion.guardian?.name || 'Voyageur'
  const initial = (guardianName)[0].toUpperCase()
  const positions = companion.positions || []
  const lastPos = positions.length > 0 ? positions[positions.length - 1] : null

  // Time since last check-in
  const overdueSeconds = Math.abs(getTimeUntilNextCheckIn())
  const overdueMin = Math.floor(overdueSeconds / 60)

  const lastCheckInTime = companion.lastCheckIn
    ? new Date(companion.lastCheckIn).toLocaleTimeString(getState().lang || 'fr', { hour: '2-digit', minute: '2-digit' })
    : ''

  return `
    <!-- Header -->
    <div class="px-5 py-3 flex items-center gap-2" style="border-bottom:1px solid rgba(239,68,68,.2)">
      <div class="w-7 h-7 rounded-full flex items-center justify-center" style="background:rgba(239,68,68,.1)">
        ${icon('triangle-alert', 'w-3.5 h-3.5 text-red-500')}
      </div>
      <h2 id="companion-modal-title" class="text-[15px] font-extrabold text-red-500 flex-1">
        ${t('alert') || 'Alerte'} !
      </h2>
      <button onclick="guardianGoToScreen('active')" class="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center" aria-label="${t('close') || 'Close'}">
        ${icon('x', 'w-3.5 h-3.5 text-slate-400')}
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-4">
      <!-- Red map -->
      <div class="w-full h-[180px] rounded-xl mb-3 flex items-center justify-center relative overflow-hidden"
        style="background:linear-gradient(135deg,#1a2332,#0f1520);border:2px solid rgba(239,68,68,.3)">
        <div class="absolute inset-0" style="background:radial-gradient(circle at 60% 40%,rgba(239,68,68,.12) 0%,transparent 50%)"></div>
        <span class="text-red-400 text-[11px] z-10">\u26A0\uFE0F ${t('lastKnownPosition') || 'Dernière position connue'}</span>
      </div>

      <!-- Alert card -->
      <div class="rounded-xl p-3 mb-2" style="background:rgba(239,68,68,.03);border:1px solid rgba(239,68,68,.2)">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-[#0f1117]"
            style="background:linear-gradient(135deg,#ef4444,#dc2626)">${escapeHTML(initial)}</div>
          <div class="text-[13px] font-bold text-white flex-1">${escapeHTML(guardianName)}</div>
          <div class="text-[9px] flex items-center gap-1 text-red-400">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> ${t('noResponse') || 'Pas de réponse'}
          </div>
        </div>
        <!-- Metrics -->
        <div class="grid grid-cols-3 gap-1 mt-2">
          <div class="text-center py-1.5 rounded" style="background:rgba(255,255,255,.02)">
            <div class="text-xs font-bold text-red-400">\u26A0\uFE0F ${overdueMin} min</div>
            <div class="text-[8px] text-slate-500">${t('noResponse') || 'Sans reponse'}</div>
          </div>
          <div class="text-center py-1.5 rounded" style="background:rgba(255,255,255,.02)">
            <div class="text-xs font-bold text-white">\u{1F50B} ${_batteryPct !== null ? `${_batteryPct}%` : '...'}</div>
            <div class="text-[8px] text-slate-500">${t('batteryLevel') || 'Batterie'}</div>
          </div>
          <div class="text-center py-1.5 rounded" style="background:rgba(255,255,255,.02)">
            <div class="text-xs font-bold text-white">${lastCheckInTime}</div>
            <div class="text-[8px] text-slate-500">${t('lastSignal') || 'Dernier signal'}</div>
          </div>
        </div>
      </div>

      <!-- Alert info box -->
      <div class="py-2.5 px-3 rounded-xl mb-2" style="background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.15)">
        <div class="text-[11px] font-bold text-red-400 mb-1">\u26A0\uFE0F ${t('missedCheckIn') || 'Check-in manque'}</div>
        <div class="text-[10px] text-slate-400 leading-relaxed">
          ${t('missedCheckInDetail') || `Pas de réponse depuis ${overdueMin} minutes.`}
          ${lastPos ? `${t('lastPosition') || 'Dernière position'}: ${lastPos.lat.toFixed(4)}, ${lastPos.lng.toFixed(4)}` : ''}
        </div>
      </div>

      <!-- Call + SMS buttons -->
      <div class="flex gap-1.5 mb-2">
        <button onclick="guardianCallTraveler()" class="flex-[2] py-2.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1" style="background:rgba(239,68,68,.1);color:#f87171;border:none">
          ${icon('phone', 'w-3 h-3')} ${t('callNow') || 'Appeler maintenant'}
        </button>
        <button onclick="guardianMessageTraveler()" class="flex-1 py-2.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1" style="background:rgba(34,197,94,.08);color:#22c55e;border:none">
          ${icon('message-circle', 'w-3 h-3')} SMS
        </button>
      </div>

      <!-- Emergency button -->
      <button onclick="guardianCallEmergency()" class="w-full py-2.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 mt-1"
        style="background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.2);color:#f59e0b">
        ${icon('phone-call', 'w-3 h-3')} ${t('emergency112') || 'Urgences (112)'}
      </button>
    </div>
  `
}

// ─── HELPERS ───

function renderTimelineEvents(companion) {
  const positions = companion.positions || []
  const events = []

  // Last check-in
  if (companion.lastCheckIn) {
    events.push({
      color: '#22c55e',
      time: new Date(companion.lastCheckIn).toLocaleTimeString(getState().lang || 'fr', { hour: '2-digit', minute: '2-digit' }),
      text: 'Check-in OK \u2713',
    })
  }

  // Last position
  if (positions.length > 0) {
    const last = positions[positions.length - 1]
    events.push({
      color: '#3b82f6',
      time: new Date(last.timestamp).toLocaleTimeString(getState().lang || 'fr', { hour: '2-digit', minute: '2-digit' }),
      text: `${last.lat.toFixed(2)}, ${last.lng.toFixed(2)}`,
    })
  }

  // Trip start
  if (companion.tripStart) {
    events.push({
      color: '#f59e0b',
      time: new Date(companion.tripStart).toLocaleTimeString(getState().lang || 'fr', { hour: '2-digit', minute: '2-digit' }),
      text: companion.destination ? `${t('departureFrom') || 'Depart vers'} ${escapeHTML(companion.destination)}` : (t('tripStarted') || 'Depart'),
    })
  }

  if (events.length === 0) return ''

  return events.map(ev => `
    <div class="flex items-start gap-2 py-1 text-[10px] text-slate-500">
      <span class="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style="background:${ev.color}"></span>
      <span class="text-slate-400 min-w-[35px]">${ev.time}</span>
      <span>${ev.text}</span>
    </div>
  `).join('')
}

function renderTripHistory(history) {
  const lang = getState().lang || 'fr'
  const shown = history.slice(0, 5)

  return `
    <details class="group mt-4 rounded-xl" style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06)">
      <summary class="flex items-center justify-between p-3 cursor-pointer list-none select-none">
        <span class="text-xs font-semibold text-slate-300 flex items-center gap-2">
          ${icon('history', 'w-3.5 h-3.5 text-slate-400')}
          ${t('pastTrips') || 'Past trips'} <span class="text-slate-500">(${history.length})</span>
        </span>
        <span class="text-slate-400 group-open:rotate-180 transition-transform">
          ${icon('chevron-down', 'w-3.5 h-3.5')}
        </span>
      </summary>
      <div class="px-3 pb-3 space-y-1.5">
        ${shown.map(trip => {
          const start = new Date(trip.startTime)
          const durationMs = (trip.endTime || Date.now()) - trip.startTime
          const totalMin = Math.floor(durationMs / 60_000)
          const h = Math.floor(totalMin / 60)
          const m = totalMin % 60
          const dur = h > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${m}min`

          return `
            <div class="rounded-lg p-2.5" style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.04)">
              <div class="flex items-center justify-between mb-0.5">
                <span class="text-xs font-medium text-white">
                  ${start.toLocaleDateString(lang, { day: '2-digit', month: 'short' })}
                  ${start.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span class="text-xs text-slate-400">${dur}</span>
              </div>
              <div class="flex items-center gap-3 text-xs text-slate-400">
                <span>${icon('shield', 'w-3 h-3 inline')} ${escapeHTML(trip.guardian?.name || '?')}</span>
                ${trip.destination ? `<span class="truncate max-w-[80px]">${escapeHTML(trip.destination)}</span>` : ''}
                <span>${icon('check', 'w-3 h-3 inline text-emerald-500')} ${trip.checkInsCount || 0}</span>
              </div>
            </div>
          `
        }).join('')}
        ${history.length > 5 ? `<p class="text-xs text-slate-500 text-center">${t('andMoreTrips') || `+${history.length - 5} more trips`}</p>` : ''}
        <button
          onclick="companionClearHistory()"
          class="w-full mt-1 py-2 text-xs text-slate-500 hover:text-red-400 transition-colors text-center"
        >
          ${t('clearHistory') || 'Clear history'}
        </button>
      </div>
    </details>
  `
}

function formatTimeAgo(timestamp) {
  const diff = Date.now() - timestamp
  const min = Math.floor(diff / 60_000)
  if (min < 1) return t('justNow') || 'maintenant'
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  return `${h}h${String(min % 60).padStart(2, '0')}`
}

// ─── GLOBAL HANDLERS ───

/** Accept consent and go to main screen */
window.acceptCompanionConsent = () => {
  sessionStorage.setItem('spothitch_companion_consent', '1')
  _currentScreen = 'main'
  window._forceRender?.()
}

/** Navigate between guardian screens */
window.guardianGoToScreen = (screen) => {
  _currentScreen = screen
  // Accept consent implicitly when moving to main
  if (screen === 'main') {
    try { sessionStorage.setItem('spothitch_companion_consent', '1') } catch { /* ignore */ }
  }
  // Force re-render without resetting _currentScreen through auto-detection
  window._forceRender?.()
}

/** Switch tab in main screen */
window.guardianSwitchTab = (index) => {
  _currentTab = index
  _currentScreen = 'main'
  window._forceRender?.()
}

/** Edit config fields — opens in-app overlay instead of native prompt() */
window.guardianEditField = async (field) => {
  const { getCompanionState: gcs } = await import('../../services/companion.js')
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
      label: t('companionDestination') || 'Destination',
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
  }

  const config = fieldConfig[field]
  if (!config) return

  _editOverlay = { field, ...config }
  _currentTab = 1 // ensure config tab is shown
  window._forceRender?.()

  // Auto-focus the input after render
  requestAnimationFrame(() => {
    const input = document.getElementById('guardian-edit-input')
    if (input) {
      input.focus()
      // Place cursor at end
      if (input.setSelectionRange && input.value) {
        input.setSelectionRange(input.value.length, input.value.length)
      }
    }
  })
}

/** Save the edited field from in-app overlay */
window.guardianSaveField = async () => {
  if (!_editOverlay) return
  const { getCompanionState: gcs } = await import('../../services/companion.js')
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
    state.guardian = { name: val, phone }
  } else if (_editOverlay.field === 'interval') {
    const num = parseInt(val, 10)
    if (!num || num < 5 || num > 120) {
      window.showToast?.('5 \u2013 120 min', 'warning')
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
    localStorage.setItem('spothitch_companion', JSON.stringify(state)) // lgtm[js/clear-text-storage-of-sensitive-data]
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
  const { getCompanionState: gcs } = await import('../../services/companion.js')
  const state = gcs()
  state.notifyOnDeparture = !(state.notifyOnDeparture !== false)
  try {
    localStorage.setItem('spothitch_companion', JSON.stringify(state)) // lgtm[js/clear-text-storage-of-sensitive-data]
  } catch { /* ignore */ }
  window._forceRender?.()
}

/** Toggle arrival notification */
window.guardianToggleArrival = async () => {
  const { getCompanionState: gcs } = await import('../../services/companion.js')
  const state = gcs()
  state.notifyOnArrival = !(state.notifyOnArrival !== false)
  try {
    localStorage.setItem('spothitch_companion', JSON.stringify(state)) // lgtm[js/clear-text-storage-of-sensitive-data]
  } catch { /* ignore */ }
  window._forceRender?.()
}

/** Guardian action: call traveler */
window.guardianCallTraveler = () => {
  const state = getCompanionState()
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
  const state = getCompanionState()
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
  const state = getCompanionState()
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

/** Add a trusted contact to the saved companion state */
window.companionAddTrustedContact = async () => {
  const nameEl = document.getElementById('companion-tc-name')
  const phoneEl = document.getElementById('companion-tc-phone')
  const name = nameEl?.value?.trim() || ''
  const phone = phoneEl?.value?.trim() || ''

  if (!phone) {
    const { showToast } = await import('../../services/notifications.js')
    showToast(t('fillPhoneNumber') || 'Enter a phone number', 'warning')
    return
  }

  const { getCompanionState: gcs } = await import('../../services/companion.js')
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
    localStorage.setItem('spothitch_companion', JSON.stringify(state)) // lgtm[js/clear-text-storage-of-sensitive-data] — trusted contacts, local device only, declared in RGPD registry
  } catch {
    // ignore
  }

  if (nameEl) nameEl.value = ''
  if (phoneEl) phoneEl.value = ''

  window.setState?.({ showCompanionModal: true })
}

/** Remove a trusted contact by index */
window.companionRemoveTrustedContact = async (index) => {
  const { getCompanionState: gcs } = await import('../../services/companion.js')
  const state = gcs()
  const contacts = Array.isArray(state.trustedContacts) ? [...state.trustedContacts] : []
  contacts.splice(index, 1)
  state.trustedContacts = contacts

  try {
    localStorage.setItem('spothitch_companion', JSON.stringify(state)) // lgtm[js/clear-text-storage-of-sensitive-data] — trusted contacts, local device only
  } catch {
    // ignore
  }

  window.setState?.({ showCompanionModal: true })
}

/** Clear trip history */
window.companionClearHistory = async () => {
  const { clearTripHistory } = await import('../../services/companion.js')
  clearTripHistory()
  window.setState?.({ showCompanionModal: true })
}

/** Load and display battery level into the active view */
async function updateBatteryDisplay() {
  const el = document.getElementById('companion-battery-row')
  if (!el) return

  const level = await getBatteryLevel()
  if (level === null) return

  _batteryPct = Math.round(level * 100)
  const isLow = _batteryPct <= 15
  const color = isLow ? 'text-red-400' : _batteryPct <= 30 ? 'text-amber-400' : 'text-emerald-400'

  el.innerHTML = `
    <div class="text-sm font-bold ${color}">\u{1F50B} ${_batteryPct}%</div>
    <div class="text-[8px] text-slate-500 uppercase">${t('batteryLevel') || 'Batterie'}</div>
  `
}

// Init companion battery display after render
export function initCompanionAfterRender(isVisible) {
  if (isVisible) {
    const el = document.getElementById('companion-battery-row')
    if (el && !_batteryDisplayDone) {
      _batteryDisplayDone = true
      updateBatteryDisplay()
    }
  } else {
    _batteryDisplayDone = false
    // Reset screen state when modal closes
    _currentScreen = null
    _currentTab = 0
  }
}

export default { renderCompanionModal }
