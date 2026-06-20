/**
 * Guardian Render Functions
 * Screen renders extracted from Guardian.js to reduce file size.
 */

import { t } from '../../i18n/index.js'
import { icon } from '../../utils/icons.js'
import { escapeHTML } from '../../utils/sanitize.js'
import { getState } from '../../stores/state.js'
import { lng2tile, lat2tile } from '../../data/countryBounds.js'
import {
  getTimeUntilNextCheckIn,
  loadTripHistory,
  getETAInfo,
  getTripEvents,
  getTripPhoto,
} from '../../services/guardian.js'
import { getChatMessages } from '../../services/guardianWatch.js'

/** Format check-in interval in minutes to human-readable string */
export function formatInterval(minutes) {
  if (minutes < 60) return `${minutes} ${t('minutes') || 'minutes'}`
  if (minutes < 1440) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    const hLabel = h === 1 ? (t('hour') || 'heure') : (t('hours') || 'heures')
    return m > 0 ? `${h} ${hLabel} ${m} min` : `${h} ${hLabel}`
  }
  const d = Math.floor(minutes / 1440)
  const dLabel = d === 1 ? (t('day') || 'jour') : (t('days') || 'jours')
  return `${d} ${dLabel}`
}

/** Preset interval options for the selector */
const INTERVAL_OPTIONS = [
  { value: 15, label: () => '15 min' },
  { value: 30, label: () => '30 min' },
  { value: 45, label: () => '45 min' },
  { value: 60, label: () => `1 ${t('hour') || 'heure'}` },
  { value: 120, label: () => `2 ${t('hours') || 'heures'}` },
  { value: 180, label: () => `3 ${t('hours') || 'heures'}` },
  { value: 360, label: () => `6 ${t('hours') || 'heures'}` },
  { value: 720, label: () => `12 ${t('hours') || 'heures'}` },
  { value: 1440, label: () => `1 ${t('day') || 'jour'}` },
  { value: 2880, label: () => `2 ${t('days') || 'jours'}` },
]

// Color helpers
const COLOR_MAP = {
  '#22c55e': { bg: 'rgba(34,197,94,.1)', border: 'rgba(34,197,94,.2)', dark: '#16a34a' },
  '#3b82f6': { bg: 'rgba(59,130,246,.1)', border: 'rgba(59,130,246,.2)', dark: '#2563eb' },
  '#f59e0b': { bg: 'rgba(245,158,11,.1)', border: 'rgba(245,158,11,.2)', dark: '#d97706' },
  '#06b6d4': { bg: 'rgba(6,182,212,.1)', border: 'rgba(6,182,212,.2)', dark: '#0891b2' },
  '#a855f7': { bg: 'rgba(168,85,247,.1)', border: 'rgba(168,85,247,.2)', dark: '#7c3aed' },
}

export function colorInfo(hex) {
  return COLOR_MAP[hex] || { bg: 'rgba(100,116,139,.1)', border: 'rgba(100,116,139,.2)', dark: '#475569' }
}

/**
 * Render the Guardian Mode modal
 */


// ─── SCREEN 1: INTRO (KEPT AS-IS) ───

export function renderIntroScreen() {
  const features = [
    {
      icon: 'user-check',
      color: '#22c55e',
      bg: 'rgba(34,197,94,.08)',
      title: t('guardianFeatureTrusted') || 'Gardien de confiance',
      desc: t('guardianFeatureTrustedDesc') || 'Choisis qui te surveille (1 a 5 contacts)',
    },
    {
      icon: 'clock',
      color: '#3b82f6',
      bg: 'rgba(59,130,246,.08)',
      title: t('guardianFeatureCheckin') || 'Check-in automatique',
      desc: t('guardianFeatureCheckinDesc') || "L'app te demande si tout va bien. Pas de reponse = alerte",
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
      desc: t('guardianFeatureOfflineDesc') || 'Meme sans reseau, ton gardien est prevenu',
    },
  ]

  return `
    <div class="p-6 flex flex-col items-center text-center">
      <!-- Close button -->
      <div class="w-full flex justify-end mb-2">
        <button onclick="closeGuardianModal()" class="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center" type="button" aria-label="${t('close') || 'Fermer'}">
          ${icon('x', 'w-3.5 h-3.5 text-slate-400')}
        </button>
      </div>

      <!-- Icon -->
      <div class="w-14 h-14 rounded-full bg-emerald-500/[0.06] border-[1.5px] border-emerald-500/[0.12] flex items-center justify-center mb-4">
        ${icon('shield-check', 'w-6 h-6 text-emerald-500')}
      </div>

      <h2 id="guardian-modal-title" class="text-lg font-extrabold text-slate-200 mb-1">
        ${t('guardianModeTitle') || 'Mode Guardian'}
      </h2>
      <p class="text-[13px] text-slate-400 leading-relaxed max-w-[280px]">
        ${t('guardianModeDesc') || 'Un proche suit ton trajet en temps reel. Si tu ne reponds plus, il est alerte automatiquement.'}
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
      <button onclick="closeGuardianModal()" class="text-[13px] text-slate-500 mt-2 py-1">${t('later') || 'Plus tard'}</button>
    </div>
  `
}

// ─── SCREEN 2: CONFIG (v2 single scrollable) ───

export function renderMainScreen(guardianState, editOverlay) {
  // If edit overlay is active, show it
  if (editOverlay) {
    return `
      <div class="px-5 py-3 flex items-center gap-2 border-b border-white/5">
        <div class="w-7 h-7 rounded-full flex items-center justify-center bg-[rgba(34,197,94,.08)]">
          ${icon('shield-check', 'w-3.5 h-3.5 text-emerald-500')}
        </div>
        <h2 id="guardian-modal-title" class="text-[15px] font-extrabold text-white flex-1">${t('guardianModeTitle') || 'Mode Gardien'}</h2>
        <button onclick="closeGuardianModal()" class="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center" aria-label="${t('close') || 'Fermer'}">
          ${icon('x', 'w-3.5 h-3.5 text-slate-400')}
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-4">
        ${renderEditOverlay(editOverlay)}
      </div>
    `
  }

  const guardians = guardianState.guardians || []
  const guardianCount = guardians.length
  const remaining = 5 - guardianCount
  const interval = guardianState.checkInInterval || 30
  const destination = guardianState.destination || ''
  const licensePlate = guardianState.licensePlate || ''
  const customMessage = guardianState.customMessage || ''
  const tripPhoto = getTripPhoto()

  // Guardian names for tip box
  const guardianNames = guardians.map(g => escapeHTML(g.name)).join(', ')

  return `
    <!-- Header -->
    <div class="px-5 py-3 flex items-center gap-2 border-b border-white/5">
      <div class="w-7 h-7 rounded-full flex items-center justify-center bg-[rgba(34,197,94,.08)]">
        ${icon('shield-check', 'w-3.5 h-3.5 text-emerald-500')}
      </div>
      <h2 id="guardian-modal-title" class="text-[15px] font-extrabold text-white flex-1">${t('guardianModeTitle') || 'Mode Gardien'}</h2>
      <button onclick="closeGuardianModal()" class="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center" aria-label="${t('close') || 'Fermer'}">
        ${icon('x', 'w-3.5 h-3.5 text-slate-400')}
      </button>
    </div>

    <!-- Scrollable content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Guardians section -->
      <div class="px-4 pt-4">
        <div class="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          ${t('myGuardians') || 'Mes gardiens'} (${guardianCount}/5)
        </div>
        <div class="rounded-2xl overflow-hidden bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.06)]">
          ${guardians.map((g, i) => {
            const ci = colorInfo(g.color || '#22c55e')
            const label = i === 0
              ? (t('mainGuardian') || 'Gardien principal')
              : (t('guardian') || 'Gardien')
            const val = g.phone
              ? `${escapeHTML(g.name)} (${escapeHTML(g.phone)})`
              : escapeHTML(g.name)
            return `
              <div class="flex items-center gap-3 px-4 py-3 cursor-pointer active:bg-white/[0.02] transition-colors border-b border-b-[rgba(255,255,255,.03)]"
               
                onclick="guardianEditGuardian(${i})" role="button" tabindex="0">
                <div class="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center shrink-0" style="background:${ci.bg};color:${g.color || '#22c55e'}">
                  ${icon('user', 'w-[18px] h-[18px]')}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-[11px] font-semibold text-slate-500">${label}</div>
                  <div class="text-[13px] font-bold text-white mt-0.5 truncate">${val}</div>
                </div>
                <span class="text-slate-700">${icon('chevron-right', 'w-3.5 h-3.5')}</span>
              </div>
            `
          }).join('')}
          ${remaining > 0 ? `
            <div class="flex items-center justify-center gap-1.5 px-4 py-3 cursor-pointer text-slate-500 text-xs font-semibold active:bg-white/[0.02] transition-colors"
              onclick="guardianAddGuardian()" role="button" tabindex="0">
              ${icon('plus', 'w-3.5 h-3.5')}
              ${t('addGuardian') || 'Ajouter un gardien'} (${remaining} ${t('remaining') || 'restants'})
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Config section -->
      <div class="px-4 pt-4">
        <div class="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          ${t('tripConfig') || 'Configuration du voyage'}
        </div>
        <div class="rounded-2xl overflow-hidden bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.06)]">
          <!-- Check-in interval -->
          ${cfgRow('clock', '#3b82f6', t('guardianCheckinInterval') || 'Check-in toutes les', formatInterval(interval), "guardianEditField('interval')")}
          <!-- Destination -->
          ${cfgRow('map-pin', '#f59e0b', t('guardianDestination') || 'Destination', destination ? escapeHTML(destination) : '', "guardianEditField('destination')")}
          <!-- Plate -->
          ${cfgRow('car', '#06b6d4', t('licensePlateLabel') || 'Plaque du vehicule', licensePlate ? escapeHTML(licensePlate) : '', "guardianEditField('licensePlate')")}
          <!-- Photo -->
          ${cfgRow('camera', '#a855f7', t('driverPhoto') || 'Photo conducteur', tripPhoto ? (t('photoTaken') || 'Photo prise') : '', "guardianEditField('tripPhoto')")}
          <!-- Custom message -->
          ${cfgRow('message-square', '#ef4444', t('customMessageLabel') || 'Message personnalise', customMessage ? escapeHTML(customMessage.substring(0, 30)) + (customMessage.length > 30 ? '...' : '') : '', "guardianEditField('customMessage')")}
        </div>
      </div>

      <!-- Start button -->
      <div class="px-4 pt-4 pb-2">
        <button
          onclick="startGuardian()"
          class="w-full py-[15px] rounded-2xl text-white text-[15px] font-extrabold flex items-center justify-center gap-2.5 bg-[linear-gradient(135deg,#22c55e,#16a34a)] shadow-[0_4px_24px_rgba(34,197,94,.3)]"
         >
          ${icon('play', 'w-[18px] h-[18px]')}
          ${t('guardianStartTrip') || 'Demarrer mon voyage'}
        </button>
      </div>

      <!-- Tip box -->
      ${guardianNames ? `
        <div class="mx-4 mb-4 mt-2 flex gap-2.5 items-start p-3 rounded-xl text-[11px] leading-relaxed text-slate-400 bg-[rgba(245,158,11,.04)] border border-[rgba(245,158,11,.1)]"
         >
          <span class="shrink-0 mt-0.5 text-[#f59e0b]">${icon('info', 'w-3.5 h-3.5')}</span>
          <div>${guardianNames} ${t('guardianTipWillBeNotified') || 'recevront ta position et seront alertes si tu ne fais pas ton check-in a temps.'}</div>
        </div>
      ` : ''}

      <!-- Trip history -->
      ${loadTripHistory().length > 0 ? `<div class="px-4 pb-4">${renderTripHistory(loadTripHistory())}</div>` : ''}
    </div>
  `
}

/** Config row helper for the config card */
function cfgRow(iconName, color, label, value, action) {
  const ci = colorInfo(color) || { bg: `${color}15` }
  const isEmpty = !value
  const displayVal = isEmpty ? (t('optional') || 'Optionnel') : value
  return `
    <div class="flex items-center gap-3 px-4 py-3 cursor-pointer active:bg-white/[0.02] transition-colors border-b border-b-[rgba(255,255,255,.03)]"
     
      ${action ? `onclick="${action}"` : ''} role="button" tabindex="0">
      <div class="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center shrink-0" style="background:${ci.bg};color:${color}">
        ${icon(iconName, 'w-[18px] h-[18px]')}
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-[11px] font-semibold text-slate-500">${label}</div>
        <div class="text-[13px] font-bold mt-0.5 truncate ${isEmpty ? 'text-slate-600 italic font-normal' : 'text-white'}">${displayVal}</div>
      </div>
      <span class="text-slate-700">${icon('chevron-right', 'w-3.5 h-3.5')}</span>
    </div>
  `
}

/** In-app edit overlay (replaces native prompt()) — KEPT AS-IS */
export function renderEditOverlay(editOverlay) {
  if (!editOverlay) return ''
  const { field, label, value, inputType, placeholder, maxLength } = editOverlay
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
      ${inputType === 'select' ? `
        <div class="flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto">
          ${INTERVAL_OPTIONS.map(opt => {
            const isActive = String(opt.value) === value
            return `
              <button
                onclick="guardianSelectInterval(${opt.value})"
                class="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-slate-300'}"
                style="background:${isActive ? 'rgba(34,197,94,.15);border:2px solid rgba(34,197,94,.4)' : 'rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06)'}"
              >
                <span>${opt.label()}</span>
                ${isActive ? icon('check', 'w-4 h-4 text-emerald-400') : ''}
              </button>
            `
          }).join('')}
        </div>
      ` : isTextarea ? `
        <textarea
          id="guardian-edit-input"
          class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-[rgba(255,255,255,.06)] border border-[rgba(255,255,255,.1)]"
         
          placeholder="${placeholder || ''}"
          rows="3"
          ${maxLength ? `maxlength="${maxLength}"` : ''}
        >${escapedValue}</textarea>
      ` : `
        <input
          id="guardian-edit-input"
          type="${inputType || 'text'}"
          class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-[rgba(255,255,255,.06)] border border-[rgba(255,255,255,.1)]"
         
          value="${escapedValue}"
          placeholder="${placeholder || ''}"
          ${maxLength ? `maxlength="${maxLength}"` : ''}
          autocomplete="off"
        />
      `}
      ${field === 'guardian' ? `
        <input
          id="guardian-edit-phone"
          type="tel"
          class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 mt-2 bg-[rgba(255,255,255,.06)] border border-[rgba(255,255,255,.1)]"
         
          value="${escapeHTML(editOverlay.phone || '')}"
          placeholder="${t('guardianPhoneOptionalPrompt') || 'Telephone (optionnel)'}"
          autocomplete="off"
        />
      ` : ''}

      <!-- Buttons (hidden for interval selector — tap selects directly) -->
      ${inputType !== 'select' ? `
        <div class="flex gap-2 mt-4">
          <button
            onclick="guardianCancelEdit()"
            class="flex-1 py-3 rounded-xl text-slate-400 font-semibold text-sm transition-colors bg-[rgba(255,255,255,.04)] border border-[rgba(255,255,255,.08)]"
           
          >
            ${t('cancel') || 'Annuler'}
          </button>
          <button
            onclick="guardianSaveField()"
            class="flex-1 py-3 rounded-xl text-white font-bold text-sm transition-colors bg-[rgba(34,197,94,.15)] border border-[rgba(34,197,94,.3)]"
           
          >
            ${icon('circle-check', 'w-4 h-4 inline-block mr-1')}
            ${t('save') || 'Enregistrer'}
          </button>
        </div>
      ` : ''}
    </div>
  `
}

// ─── SCREEN 3: ACTIVE (v2 Timeline) ───

export function renderActiveScreen(guardianState, batteryPct) {
  const secondsRemaining = getTimeUntilNextCheckIn()
  const overdue = secondsRemaining < 0
  const absSeconds = Math.abs(secondsRemaining)
  const minutes = Math.floor(absSeconds / 60)
  const seconds = absSeconds % 60
  const timerText = `${overdue ? '+' : ''}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  // Timer pill class
  const isWarning = !overdue && secondsRemaining < 180
  const pillBg = overdue ? 'rgba(239,68,68,.12)' : isWarning ? 'rgba(245,158,11,.1)' : 'rgba(34,197,94,.1)'
  const pillColor = overdue ? '#ef4444' : isWarning ? '#f59e0b' : '#22c55e'

  // Trip duration
  const tripMs = guardianState.tripStart ? Date.now() - guardianState.tripStart : 0
  const tripMinutes = Math.floor(tripMs / 60_000)
  const tripHours = Math.floor(tripMinutes / 60)
  const tripMins = tripMinutes % 60
  const durationText = tripHours > 0 ? `${tripHours}h${String(tripMins).padStart(2, '0')}` : `${tripMins}min`

  // ETA
  const etaInfo = getETAInfo(guardianState)
  const etaText = etaInfo.etaMinutes !== null
    ? (etaInfo.etaMinutes < 60 ? `~${etaInfo.etaMinutes}min` : `~${Math.floor(etaInfo.etaMinutes / 60)}h${String(etaInfo.etaMinutes % 60).padStart(2, '0')}`)
    : '...'

  // Battery
  const battText = batteryPct !== null ? `${batteryPct}%` : '...'
  const battColor = batteryPct !== null && batteryPct <= 15 ? '#ef4444' : batteryPct !== null && batteryPct <= 30 ? '#f59e0b' : '#22c55e'

  // Check-in count from events
  const events = getTripEvents()
  const checkInCount = events.filter(e => e.type === 'checkin').length

  // Guardians
  const guardians = guardianState.guardians || []

  // Destination / origin
  const destination = guardianState.destination || ''
  const headerTitle = destination ? `${t('trip') || 'Trajet'} → ${escapeHTML(destination)}` : (t('tripActive') || 'Voyage en cours')

  return `
    <!-- Header -->
    <div class="px-4 py-3 flex items-center gap-2.5 shrink-0 border-b border-b-[rgba(34,197,94,.12)] bg-[rgba(15,21,32,.95)]">
      <button onclick="guardianGoToScreen('main')" class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[rgba(255,255,255,.06)]" aria-label="${t('back') || 'Retour'}">
        ${icon('chevron-left', 'w-3.5 h-3.5 text-slate-400')}
      </button>
      <div class="flex-1 min-w-0">
        <h2 id="guardian-modal-title" class="text-sm font-extrabold text-white truncate">${headerTitle}</h2>
        <div class="text-[10px] text-slate-500 mt-0.5">${t('onTheRoadSince') || 'En route depuis'} ${durationText}</div>
      </div>
      <div class="shrink-0 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[13px] font-extrabold" style="background:${pillBg};color:${pillColor}">
        <span class="w-[7px] h-[7px] rounded-full" style="background:${pillColor};animation:pulse 2s infinite"></span>
        ${timerText}
      </div>
    </div>

    <!-- Stats strip -->
    <div class="flex shrink-0 border-b border-b-[rgba(255,255,255,.06)] py-[8px] px-[16px]">
      <div class="flex-1 text-center">
        <div class="text-[13px] font-extrabold text-[#22c55e]">${durationText}</div>
        <div class="text-[10px] text-slate-600 uppercase tracking-wide mt-0.5">${t('onRoute') || 'en route'}</div>
      </div>
      <div class="flex-1 text-center">
        <div class="text-[13px] font-extrabold text-white">${checkInCount}</div>
        <div class="text-[10px] text-slate-600 uppercase tracking-wide mt-0.5">check-ins</div>
      </div>
      <div class="flex-1 text-center">
        <div class="text-[13px] font-extrabold" id="guardian-battery-row" style="color:${battColor}">${battText}</div>
        <div class="text-[10px] text-slate-600 uppercase tracking-wide mt-0.5">${t('batteryLevel') || 'batterie'}</div>
      </div>
      <div class="flex-1 text-center">
        <div class="text-[13px] font-extrabold text-[#3b82f6]">${etaText}</div>
        <div class="text-[10px] text-slate-600 uppercase tracking-wide mt-0.5">ETA</div>
      </div>
    </div>

    <!-- Guardians bar -->
    ${guardians.length > 0 ? `
      <div class="flex items-center gap-1.5 shrink-0 overflow-x-auto py-[8px] px-[16px] border-b border-b-[rgba(255,255,255,.06)]">
        <span class="text-[10px] text-slate-500 shrink-0">${t('guardians') || 'Gardiens'} :</span>
        ${guardians.map(g => {
          const ci = colorInfo(g.color || '#22c55e')
          const initial = (g.name || '?')[0].toUpperCase()
          return `
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white shrink-0 relative"
              style="background:linear-gradient(135deg,${g.color || '#22c55e'},${ci.dark})">
              ${escapeHTML(initial)}
              <span class="absolute -bottom-px -right-px w-2 h-2 rounded-full border-2 bg-[#22c55e] border-[#0f1520]"></span>
            </div>
          `
        }).join('')}
      </div>
    ` : ''}

    <!-- Timeline -->
    <div class="flex-1 overflow-y-auto relative pt-[12px] px-[16px] pb-[8px]" id="guardian-timeline">
      <div class="absolute left-[29px] top-3 bottom-2 w-[2px] bg-[rgba(255,255,255,.04)]"></div>
      ${renderTimelineV2(events, guardians)}
    </div>

    <!-- Compose bar -->
    <div class="shrink-0 pt-[8px] px-[12px] pb-[12px] bg-[rgba(15,21,32,.95)] [backdrop-filter:blur(20px)] border-t border-t-[rgba(255,255,255,.06)]">
      <!-- Quick actions -->
      <div class="flex gap-1.5 mb-2">
        <button onclick="guardianUpdatePlate()" class="h-9 px-3 rounded-[10px] flex items-center gap-1.5 text-[11px] font-semibold bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.06)] text-[#06b6d4]">
          ${icon('car', 'w-3.5 h-3.5')} ${t('plate') || 'Plaque'}
        </button>
        <button onclick="guardianAddTripPhoto()" class="h-9 px-3 rounded-[10px] flex items-center gap-1.5 text-[11px] font-semibold bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.06)] text-[#a855f7]">
          ${icon('camera', 'w-3.5 h-3.5')} ${t('photo') || 'Photo'}
        </button>
        <button onclick="guardianUpdateDestination()" class="h-9 px-3 rounded-[10px] flex items-center gap-1.5 text-[11px] font-semibold bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.06)] text-[#f59e0b]">
          ${icon('map-pin', 'w-3.5 h-3.5')} ${t('guardianDestination') || 'Destination'}
        </button>
      </div>
      <!-- Message row -->
      <div class="flex gap-2 items-center">
        <input type="text" id="guardian-message-input" class="flex-1 px-3.5 py-2.5 rounded-xl text-[13px] text-white placeholder-slate-600 focus:outline-none bg-[rgba(255,255,255,.04)] border border-[rgba(255,255,255,.06)]"
         
          placeholder="${t('writeMessage') || 'Ecrire un message...'}" />
        <button onclick="guardianSendMessage()" class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#22c55e]">
          ${icon('send', 'w-3.5 h-3.5 text-white')}
        </button>
        <button onclick="guardianQuickCheckin()" class="px-4 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0 text-[13px] font-extrabold text-white bg-[#22c55e]">
          ${icon('check', 'w-3.5 h-3.5')} OK
        </button>
      </div>
    </div>
  `
}

/** Render v2 timeline from trip events */
export function renderTimelineV2(events, _guardians) {
  if (events.length === 0) {
    return `<div class="text-center text-[11px] text-slate-600 py-8">${t('noEventsYet') || 'Aucun evenement pour le moment.'}</div>`
  }

  const lang = getState().lang || 'fr'
  return events.map(evt => {
    const ts = new Date(evt.timestamp).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })
    const d = evt.data || {}

    switch (evt.type) {
      case 'departure': {
        const dest = d.destination || ''
        return timelineEvent(ts, 'green', 'play', t('departure') || 'Depart',
          `${t('tripStartedTowards') || 'Voyage demarre vers'} ${dest ? escapeHTML(dest) : '...'}`,
          dest ? tagHTML('#f59e0b', 'map-pin', escapeHTML(dest)) : '')
      }
      case 'checkin':
        return timelineEvent(ts, 'green', 'check', 'Check-in', t('imSafe') || 'Je vais bien', '')
      case 'vehicle': {
        const plate = d.plate || d.licensePlate || ''
        const isNew = d.isNew
        return timelineEvent(ts, 'cyan', 'car',
          t('vehicle') || 'Vehicule',
          isNew ? (t('newVehicle') || 'Nouveau vehicule') : (t('plateRegistered') || 'Plaque enregistree'),
          plate ? tagHTML('#06b6d4', 'car', escapeHTML(plate)) : '')
      }
      case 'photo': {
        const tripPhoto = getTripPhoto()
        const photoContent = tripPhoto
          ? `<img src="${tripPhoto}" alt="${t('driverPhoto') || 'Photo conducteur'}" class="w-full h-[120px] rounded-[10px] mt-1.5 object-cover" />`
          : `<div class="w-full h-[90px] rounded-[10px] flex items-center justify-center mt-1.5 text-[11px] gap-1.5 bg-[rgba(255,255,255,.02)] border border-[rgba(255,255,255,.06)] text-[#475569]">
              ${icon('camera', 'w-[18px] h-[18px]')} ${t('driverPhoto') || 'Photo avec le conducteur'}
            </div>`
        return timelineEvent(ts, 'purple', 'camera',
          t('photo') || 'Photo',
          t('photoShared') || 'Photo partagee',
          photoContent)
      }
      case 'destination': {
        const newDest = d.destination || ''
        return timelineEvent(ts, 'amber', 'map-pin',
          t('update') || 'Mise a jour',
          t('destinationChanged') || 'Destination changee',
          newDest ? tagHTML('#f59e0b', 'map-pin', escapeHTML(newDest)) : '')
      }
      case 'message': {
        const sender = d.sender || ''
        const senderColor = d.senderColor || '#22c55e'
        const ci = colorInfo(senderColor)
        const initial = sender ? sender[0].toUpperCase() : '?'
        const text = d.text || ''
        return `
          <div class="flex gap-2.5 mb-3 relative">
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white shrink-0 z-[1]"
              style="background:linear-gradient(135deg,${senderColor},${ci.dark})">
              ${escapeHTML(initial)}
            </div>
            <div class="flex-1 min-w-0 rounded-xl px-3 py-2.5" style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-left:3px solid ${senderColor}">
              <div class="text-[10px] font-bold" style="color:${senderColor}">${escapeHTML(sender)}</div>
              <div class="flex items-center gap-1.5 mt-0.5 mb-1">
                <span class="text-[10px] font-semibold text-slate-600">${ts}</span>
              </div>
              <div class="text-[13px] leading-relaxed text-slate-200">${escapeHTML(text)}</div>
            </div>
          </div>
        `
      }
      case 'arrival':
        return timelineEvent(ts, 'green', 'flag', t('arrival') || 'Arrivee', t('arrivedSafely') || 'Bien arrive !', '')
      default:
        return timelineEvent(ts, 'green', 'circle', evt.type, d.text ? escapeHTML(d.text) : '', '')
    }
  }).join('')
}

/** Single timeline event node */
function timelineEvent(ts, colorClass, iconName, badgeText, message, extra) {
  const colors = {
    green: { bg: 'rgba(34,197,94,.1)', border: 'rgba(34,197,94,.2)', text: '#22c55e', badgeBg: 'rgba(34,197,94,.1)' },
    cyan: { bg: 'rgba(6,182,212,.1)', border: 'rgba(6,182,212,.2)', text: '#06b6d4', badgeBg: 'rgba(6,182,212,.1)' },
    purple: { bg: 'rgba(168,85,247,.1)', border: 'rgba(168,85,247,.2)', text: '#a855f7', badgeBg: 'rgba(168,85,247,.1)' },
    amber: { bg: 'rgba(245,158,11,.1)', border: 'rgba(245,158,11,.2)', text: '#f59e0b', badgeBg: 'rgba(245,158,11,.1)' },
    red: { bg: 'rgba(239,68,68,.1)', border: 'rgba(239,68,68,.2)', text: '#ef4444', badgeBg: 'rgba(239,68,68,.1)' },
  }
  const c = colors[colorClass] || colors.green

  return `
    <div class="flex gap-2.5 mb-3 relative">
      <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-[1]"
        style="background:${c.bg};border:2px solid ${c.border};color:${c.text}">
        ${icon(iconName, 'w-3 h-3')}
      </div>
      <div class="flex-1 min-w-0 rounded-xl px-3 py-2.5 bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.06)]">
        <div class="flex items-center gap-1.5 mb-1">
          <span class="text-[10px] font-semibold text-slate-600">${ts}</span>
          <span class="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md" style="background:${c.badgeBg};color:${c.text}">${badgeText}</span>
        </div>
        <div class="text-[13px] leading-relaxed text-slate-200">${message}</div>
        ${extra}
      </div>
    </div>
  `
}

/** Colored tag helper */
function tagHTML(color, iconName, text) {
  return `
    <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold mt-1.5"
      style="background:${color}0F;border:1px solid ${color}1F;color:${color}">
      ${icon(iconName, 'w-3 h-3')} ${text}
    </div>
  `
}

// ─── SCREEN 4: GUARDIAN VIEW ───

export function renderGuardianScreen(guardianState) {
  // Use real-time data from guardianWatch (Firestore) if available
  const watchedTimers = getState().watchedGuardianTimers || []
  const watchedTimer = watchedTimers[0] || null // First active timer

  // Prefer Firestore data over local state
  const guardianName = watchedTimer?.userName || guardianState.guardian?.name || 'Voyageur'
  const destination = watchedTimer?.destination || guardianState.destination || ''
  const lastCheckIn = watchedTimer?.lastCheckIn || guardianState.lastCheckIn || 0
  const tripStart = watchedTimer?.tripStart || guardianState.tripStart || 0
  const lastPos = watchedTimer?.lastPosition || null
  const isOverdue = lastCheckIn && watchedTimer?.checkInIntervalMinutes
    ? Date.now() > lastCheckIn + watchedTimer.checkInIntervalMinutes * 60_000
    : false

  const tripMs = tripStart ? Date.now() - tripStart : 0
  const tripMinutes = Math.floor(tripMs / 60_000)
  const tripHours = Math.floor(tripMinutes / 60)
  const tripMins = tripMinutes % 60
  const initial = (guardianName)[0]?.toUpperCase() || '?'

  // Map: show static map image or link if position available
  const mapContent = lastPos?.lat && lastPos?.lng
    ? `<a href="https://www.google.com/maps?q=${lastPos.lat},${lastPos.lng}" target="_blank" rel="noopener"
        class="block w-full h-[180px] rounded-xl mb-3 relative overflow-hidden bg-dark-secondary/50 border border-white/5">
        <img src="https://tile.openstreetmap.org/14/${lng2tile(lastPos.lng, 14)}/${lat2tile(lastPos.lat, 14)}.png"
          alt="${t('seeOnMap') || 'See on map'}" class="w-full h-full object-cover opacity-60" onerror="this.style.display='none'">
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
            ${icon('map-pin', 'w-3.5 h-3.5')} ${t('seeOnMap') || 'See on map'}
          </div>
        </div>
        <div class="absolute bottom-2 left-2 text-[10px] text-white/70 bg-black/50 px-2 py-0.5 rounded">
          ${lastPos.lat.toFixed(5)}, ${lastPos.lng.toFixed(5)}
        </div>
      </a>`
    : `<div class="w-full h-[120px] rounded-xl mb-3 flex items-center justify-center bg-dark-secondary/30 border border-white/5">
        <span class="text-slate-500 text-[11px]">
          ${icon('map-pin', 'w-3 h-3 inline')} ${t('waitingForPosition') || 'Waiting for position...'}
        </span>
      </div>`

  const statusColor = isOverdue ? 'text-red-400' : 'text-emerald-400'
  const statusDot = isOverdue ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
  const statusText = isOverdue ? (t('overdueAlert') || 'Overdue!') : (t('onTrip') || 'En route')

  return `
    <!-- Header -->
    <div class="px-5 py-3 flex items-center gap-2 border-b border-white/5">
      <div class="w-7 h-7 rounded-full flex items-center justify-center bg-amber-500/10">
        ${icon('eye', 'w-3.5 h-3.5 text-amber-500')}
      </div>
      <h2 id="guardian-modal-title" class="text-[15px] font-extrabold text-white flex-1">
        ${t('trackingOf') || 'Tracking'} ${escapeHTML(guardianName)}
      </h2>
      <button onclick="guardianGoToScreen('main')" class="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center" aria-label="${t('close') || 'Close'}">
        ${icon('x', 'w-3.5 h-3.5 text-slate-400')}
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-4">
      <!-- Live map / position -->
      ${mapContent}

      <!-- Traveler card -->
      <div class="rounded-xl p-3 mb-2 bg-white/[0.03] border border-white/[0.06]">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-dark-primary bg-gradient-to-br from-amber-500 to-amber-600">${escapeHTML(initial)}</div>
          <div class="text-[13px] font-bold text-white flex-1">${escapeHTML(guardianName)}</div>
          <div class="text-[10px] flex items-center gap-1 ${statusColor}">
            <span class="w-1.5 h-1.5 rounded-full ${statusDot}"></span> ${statusText}
          </div>
        </div>
        <div class="grid grid-cols-3 gap-1 mt-2">
          <div class="text-center py-1.5 rounded bg-white/[0.02]">
            <div class="text-xs font-bold ${isOverdue ? 'text-red-400' : 'text-emerald-400'}">${icon('check', 'w-3 h-3 inline')} ${lastCheckIn ? formatTimeAgo(lastCheckIn) : '...'}</div>
            <div class="text-[10px] text-slate-500">Check-in</div>
          </div>
          <div class="text-center py-1.5 rounded bg-white/[0.02]">
            <div class="text-xs font-bold text-white">${icon('clock', 'w-3 h-3 inline')} ${tripHours > 0 ? `${tripHours}h${String(tripMins).padStart(2, '0')}` : `${tripMins}min`}</div>
            <div class="text-[10px] text-slate-500">${t('duration') || 'Duration'}</div>
          </div>
          <div class="text-center py-1.5 rounded bg-white/[0.02]">
            <div class="text-xs font-bold text-amber-400">${destination ? escapeHTML(destination.slice(0, 15)) : '...'}</div>
            <div class="text-[10px] text-slate-500">${t('guardianDestination') || 'Dest.'}</div>
          </div>
        </div>
      </div>

      ${isOverdue ? `
        <div class="rounded-xl p-3 mb-2 bg-red-600/10 border border-red-500/20">
          <div class="text-red-400 text-[12px] font-bold flex items-center gap-1.5">
            ${icon('alert-triangle', 'w-4 h-4')}
            ${t('guardianOverdueWarning') || 'This traveler has missed their check-in!'}
          </div>
          <div class="mt-2 flex gap-2">
            ${lastPos?.lat ? `<a href="https://www.google.com/maps?q=${lastPos.lat},${lastPos.lng}" target="_blank" class="flex-1 py-2 rounded-xl bg-red-600 text-white text-[11px] font-bold text-center no-underline">${t('seePosition') || 'See position'}</a>` : ''}
            <a href="tel:112" class="flex-1 py-2 rounded-xl bg-white/10 text-red-400 text-[11px] font-bold text-center no-underline">112</a>
          </div>
        </div>
      ` : ''}

      <!-- Action buttons -->
      <div class="flex gap-1.5 mt-3">
        ${lastPos?.lat ? `
          <a href="https://www.google.com/maps?q=${lastPos.lat},${lastPos.lng}" target="_blank" class="flex-1 py-2.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 bg-amber-500/10 text-amber-400 no-underline">
            ${icon('map', 'w-3 h-3')} ${t('map') || 'Map'}
          </a>
        ` : ''}
        <a href="tel:112" class="flex-1 py-2.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 bg-red-500/10 text-red-400 no-underline">
          ${icon('phone', 'w-3 h-3')} 112
        </a>
      </div>

      ${!watchedTimer ? `
        <div class="text-center py-4 text-slate-500 text-xs">
          ${icon('wifi-off', 'w-4 h-4 inline mr-1')} ${t('noActiveSession') || 'No active session found. The traveler may not have started Guardian mode yet.'}
        </div>
      ` : ''}

      <!-- Real-time chat messages from Firestore -->
      ${watchedTimer ? renderGuardianChatMessages(watchedTimer.id) : ''}
    </div>

    <!-- Compose bar for guardian to reply -->
    ${watchedTimer ? `
      <div class="shrink-0 pt-[8px] px-[12px] pb-[12px] bg-[rgba(15,21,32,.95)] [backdrop-filter:blur(20px)] border-t border-t-[rgba(255,255,255,.06)]">
        <div class="flex gap-2 items-center">
          <input type="text" id="guardian-reply-input" class="flex-1 px-3.5 py-2.5 rounded-xl text-[13px] text-white placeholder-slate-600 focus:outline-none bg-[rgba(255,255,255,.04)] border border-[rgba(255,255,255,.06)]"
           
            placeholder="${t('writeMessage') || 'Write a message...'}" />
          <button onclick="guardianSendReply()" class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#f59e0b]">
            ${icon('send', 'w-3.5 h-3.5 text-white')}
          </button>
        </div>
      </div>
    ` : ''}
  `
}

/** Render chat messages for the guardian view */
export function renderGuardianChatMessages(travelerId) {
  const messages = getChatMessages(travelerId)
  if (messages.length === 0) return ''

  const lang = getState().lang || 'fr'
  const myUid = getState().user?.uid || ''

  return `
    <div class="mt-3">
      <div class="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
        ${icon('message-circle', 'w-3 h-3 inline')} ${t('chatMessages') || 'Messages'} (${messages.length})
      </div>
      <div class="space-y-1.5 max-h-[200px] overflow-y-auto" id="guardian-chat-scroll">
        ${messages.map(msg => {
          const ts = new Date(msg.createdAt).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })
          const isMe = msg.senderId === myUid
          const senderColor = isMe ? '#f59e0b' : '#22c55e'
          const initial = (msg.senderName || '?')[0].toUpperCase()

          if (msg.type === 'photo' && msg.photoUrl) {
            return `
              <div class="flex gap-2 ${isMe ? 'flex-row-reverse' : ''}">
                <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style="background:${senderColor}">${escapeHTML(initial)}</div>
                <div class="max-w-[75%] rounded-xl overflow-hidden bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.06)]">
                  <img src="${msg.photoUrl}" alt="Photo" class="w-full h-[100px] object-cover" />
                  <div class="px-2 py-1 text-[10px] text-slate-500">${ts}</div>
                </div>
              </div>
            `
          }

          return `
            <div class="flex gap-2 ${isMe ? 'flex-row-reverse' : ''}">
              <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style="background:${senderColor}">${escapeHTML(initial)}</div>
              <div class="max-w-[75%] rounded-xl px-3 py-2" style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)${isMe ? ';border-right:3px solid ' + senderColor : ';border-left:3px solid ' + senderColor}">
                <div class="text-[10px] font-bold" style="color:${senderColor}">${escapeHTML(msg.senderName || '?')}</div>
                <div class="text-[12px] text-slate-200 mt-0.5">${escapeHTML(msg.text)}</div>
                <div class="text-[10px] text-slate-600 mt-0.5">${ts}</div>
              </div>
            </div>
          `
        }).join('')}
      </div>
    </div>
  `
}

// ─── SCREEN 5: ALERT ───

export function renderAlertScreen(guardianState, batteryPct) {
  const guardianName = guardianState.guardian?.name || 'Voyageur'
  const initial = (guardianName)[0].toUpperCase()
  const positions = guardianState.positions || []
  const lastPos = positions.length > 0 ? positions[positions.length - 1] : null

  const overdueSeconds = Math.abs(getTimeUntilNextCheckIn())
  const overdueMin = Math.floor(overdueSeconds / 60)

  const lastCheckInTime = guardianState.lastCheckIn
    ? new Date(guardianState.lastCheckIn).toLocaleTimeString(getState().lang || 'fr', { hour: '2-digit', minute: '2-digit' })
    : ''

  return `
    <!-- Header -->
    <div class="px-5 py-3 flex items-center gap-2 border-b border-b-[rgba(239,68,68,.2)]">
      <div class="w-7 h-7 rounded-full flex items-center justify-center bg-[rgba(239,68,68,.1)]">
        ${icon('triangle-alert', 'w-3.5 h-3.5 text-red-500')}
      </div>
      <h2 id="guardian-modal-title" class="text-[15px] font-extrabold text-red-500 flex-1">
        ${t('alert') || 'Alerte'} !
      </h2>
      <button onclick="guardianGoToScreen('active')" class="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center" aria-label="${t('close') || 'Close'}">
        ${icon('x', 'w-3.5 h-3.5 text-slate-400')}
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-4">
      <!-- Red map -->
      <div class="w-full h-[180px] rounded-xl mb-3 flex items-center justify-center relative overflow-hidden bg-[linear-gradient(135deg,#1a2332,#0f1520)] border-[2px] border-[rgba(239,68,68,.3)]"
       >
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(239,68,68,.12)_0%,transparent_50%)]"></div>
        <span class="text-red-400 text-[11px] z-10">${icon('triangle-alert', 'w-3 h-3 inline')} ${t('lastKnownPosition') || 'Derniere position connue'}</span>
      </div>

      <!-- Alert card -->
      <div class="rounded-xl p-3 mb-2 bg-[rgba(239,68,68,.03)] border border-[rgba(239,68,68,.2)]">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-[#0f1117] bg-[linear-gradient(135deg,#ef4444,#dc2626)]"
           >${escapeHTML(initial)}</div>
          <div class="text-[13px] font-bold text-white flex-1">${escapeHTML(guardianName)}</div>
          <div class="text-[10px] flex items-center gap-1 text-red-400">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> ${t('noResponse') || 'Pas de reponse'}
          </div>
        </div>
        <div class="grid grid-cols-3 gap-1 mt-2">
          <div class="text-center py-1.5 rounded bg-[rgba(255,255,255,.02)]">
            <div class="text-xs font-bold text-red-400">${icon('triangle-alert', 'w-3 h-3 inline')} ${overdueMin} min</div>
            <div class="text-[10px] text-slate-500">${t('noResponse') || 'Sans reponse'}</div>
          </div>
          <div class="text-center py-1.5 rounded bg-[rgba(255,255,255,.02)]">
            <div class="text-xs font-bold text-white">${icon('zap', 'w-3 h-3 inline')} ${batteryPct !== null ? `${batteryPct}%` : '...'}</div>
            <div class="text-[10px] text-slate-500">${t('batteryLevel') || 'Batterie'}</div>
          </div>
          <div class="text-center py-1.5 rounded bg-[rgba(255,255,255,.02)]">
            <div class="text-xs font-bold text-white">${lastCheckInTime}</div>
            <div class="text-[10px] text-slate-500">${t('lastSignal') || 'Dernier signal'}</div>
          </div>
        </div>
      </div>

      <!-- Alert info box -->
      <div class="py-2.5 px-3 rounded-xl mb-2 bg-[rgba(239,68,68,.06)] border border-[rgba(239,68,68,.15)]">
        <div class="text-[11px] font-bold text-red-400 mb-1">${icon('triangle-alert', 'w-3 h-3 inline')} ${t('missedCheckIn') || 'Check-in manque'}</div>
        <div class="text-[10px] text-slate-400 leading-relaxed">
          ${t('missedCheckInDetail') || `Pas de reponse depuis ${overdueMin} minutes.`}
          ${lastPos ? `${t('lastPosition') || 'Derniere position'}: ${lastPos.lat.toFixed(4)}, ${lastPos.lng.toFixed(4)}` : ''}
        </div>
      </div>

      <!-- Call + SMS buttons -->
      <div class="flex gap-1.5 mb-2">
        <button onclick="guardianCallTraveler()" class="flex-[2] py-2.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 bg-[rgba(239,68,68,.1)] text-[#f87171] border-0">
          ${icon('phone', 'w-3 h-3')} ${t('callNow') || 'Appeler maintenant'}
        </button>
        <button onclick="guardianMessageTraveler()" class="flex-1 py-2.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 bg-[rgba(34,197,94,.08)] text-[#22c55e] border-0">
          ${icon('message-circle', 'w-3 h-3')} SMS
        </button>
      </div>

      <!-- Emergency button -->
      <button onclick="guardianCallEmergency()" class="w-full py-2.5 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 mt-1 bg-[rgba(245,158,11,.08)] border border-[rgba(245,158,11,.2)] text-[#f59e0b]"
       >
        ${icon('phone-call', 'w-3 h-3')} ${t('emergency112') || 'Urgences (112)'}
      </button>
    </div>
  `
}

// ─── SCREEN 6: OVERDUE (voyageur) ───

export function renderOverdueScreen(_guardianState) {
  const secondsRemaining = getTimeUntilNextCheckIn()
  const absSeconds = Math.abs(secondsRemaining)
  const minutes = Math.floor(absSeconds / 60)
  const seconds = absSeconds % 60
  const timerText = `+${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return `
    <!-- Header -->
    <div class="px-4 py-3 flex items-center gap-2.5 shrink-0 border-b border-b-[rgba(239,68,68,.2)] bg-[rgba(15,21,32,.95)]">
      <button onclick="guardianGoToScreen('active')" class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[rgba(255,255,255,.06)]" aria-label="${t('back') || 'Retour'}">
        ${icon('chevron-left', 'w-3.5 h-3.5 text-slate-400')}
      </button>
      <div class="flex-1 min-w-0">
        <h2 id="guardian-modal-title" class="text-sm font-extrabold text-[#ef4444]">${t('checkInLate') || 'Check-in en retard'}</h2>
      </div>
      <div class="shrink-0 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[13px] font-extrabold bg-[rgba(239,68,68,.12)] text-[#ef4444]">
        <span class="w-[7px] h-[7px] rounded-full bg-[#ef4444] [animation:pulse_2s_infinite]"></span>
        ${timerText}
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col items-center justify-center px-6 py-8">
      <!-- Pulsing red ring -->
      <div class="w-[140px] h-[140px] rounded-full flex flex-col items-center justify-center mb-5 border-[5px] border-[rgba(239,68,68,.4)] [animation:pulseBorderRing_1.5s_infinite]"
       >
        <div class="text-4xl font-extrabold text-[#ef4444]">${timerText}</div>
        <div class="text-[10px] mt-1 text-[#ef4444] opacity-[.7]">${t('late') || 'en retard'}</div>
      </div>

      <!-- Warning text -->
      <div class="text-center text-xs text-slate-400 leading-relaxed mb-6">
        ${t('guardiansWillBeAlerted') || 'Tes gardiens seront'} <strong class="text-red-400">${t('alertedAutomatically') || 'alertes automatiquement'}</strong> ${t('inFiveMinutes') || 'dans 5 minutes si tu ne fais pas ton check-in.'}
      </div>

      <!-- Big check-in button -->
      <button onclick="guardianCheckIn()" class="w-4/5 max-w-[280px] py-4 rounded-2xl text-white text-base font-extrabold flex items-center justify-center gap-2 mb-4 bg-[#22c55e] shadow-[0_4px_24px_rgba(34,197,94,.3)]"
       >
        ${icon('check', 'w-5 h-5')}
        ${t('imSafe') || 'Je vais bien'}
      </button>

      <!-- Emergency button -->
      <button onclick="guardianCallEmergency()" class="w-4/5 max-w-[280px] py-3 rounded-xl flex items-center justify-center gap-1.5 text-[13px] font-bold bg-[rgba(239,68,68,.08)] border border-[rgba(239,68,68,.2)] text-[#ef4444]"
       >
        ${icon('phone-call', 'w-3.5 h-3.5')}
        ${t('callEmergency112') || 'Appeler les urgences (112)'}
      </button>
    </div>

    <style>
      @keyframes pulseBorderRing {
        0%, 100% { border-color: rgba(239,68,68,.4); }
        50% { border-color: rgba(239,68,68,.15); }
      }
    </style>
  `
}

// ─── SCREEN 7: ARRIVAL ───

export function renderArrivalScreen(guardianState) {
  // Trip stats
  const tripMs = guardianState.tripStart ? Date.now() - guardianState.tripStart : 0
  const tripMinutes = Math.floor(tripMs / 60_000)
  const tripHours = Math.floor(tripMinutes / 60)
  const tripMins = tripMinutes % 60
  const durationText = tripHours > 0 ? `${tripHours}h${String(tripMins).padStart(2, '0')}` : `${tripMins}min`

  const events = getTripEvents()
  const checkInCount = events.filter(e => e.type === 'checkin').length
  const vehicleCount = events.filter(e => e.type === 'vehicle').length

  // Distance (rough estimate from positions)
  const positions = guardianState.positions || []
  let distKm = 0
  for (let i = 1; i < positions.length; i++) {
    const dx = (positions[i].lat - positions[i - 1].lat) * 111
    const dy = (positions[i].lng - positions[i - 1].lng) * 111 * Math.cos(positions[i].lat * Math.PI / 180)
    distKm += Math.sqrt(dx * dx + dy * dy)
  }
  const distText = distKm > 1 ? `${Math.round(distKm)} km` : '...'

  // Guardian names
  const guardians = guardianState.guardians || []
  const guardianNames = guardians.map(g => escapeHTML(g.name)).join(', ')

  return `
    <!-- Header -->
    <div class="px-5 py-3 flex items-center justify-center shrink-0 border-b border-b-[rgba(34,197,94,.15)]">
      <h2 id="guardian-modal-title" class="text-[14px] font-extrabold text-[#22c55e]">${t('tripFinished') || 'Voyage termine'}</h2>
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col items-center justify-center px-6 py-6 text-center">
      <!-- Animated checkmark -->
      <div class="w-20 h-20 rounded-full flex items-center justify-center mb-5 bg-[rgba(34,197,94,.1)] border-[3px] border-[rgba(34,197,94,.3)] [animation:scaleCheckIn_.4s_ease]"
       >
        <span class="text-[#22c55e]">${icon('check', 'w-9 h-9')}</span>
      </div>

      <div class="text-[22px] font-extrabold text-white mb-1.5">${t('arrivedSafely') || 'Bien arrive !'}</div>
      <div class="text-xs text-slate-500 mb-6">${t('guardiansNotifiedArrival') || 'Tes gardiens ont ete notifies de ton arrivee.'}</div>

      <!-- Summary grid -->
      <div class="grid grid-cols-2 gap-2 w-full mb-5">
        <div class="rounded-xl py-3 text-center bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.06)]">
          <div class="text-lg font-extrabold text-[#22c55e]">${durationText}</div>
          <div class="text-[10px] text-slate-600 uppercase mt-0.5">${t('duration') || 'duree'}</div>
        </div>
        <div class="rounded-xl py-3 text-center bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.06)]">
          <div class="text-lg font-extrabold text-[#3b82f6]">${distText}</div>
          <div class="text-[10px] text-slate-600 uppercase mt-0.5">${t('distance') || 'distance'}</div>
        </div>
        <div class="rounded-xl py-3 text-center bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.06)]">
          <div class="text-lg font-extrabold text-[#f59e0b]">${checkInCount}</div>
          <div class="text-[10px] text-slate-600 uppercase mt-0.5">check-ins</div>
        </div>
        <div class="rounded-xl py-3 text-center bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.06)]">
          <div class="text-lg font-extrabold text-[#06b6d4]">${vehicleCount}</div>
          <div class="text-[10px] text-slate-600 uppercase mt-0.5">${t('vehicles') || 'vehicules'}</div>
        </div>
      </div>

      <!-- Sent confirmation -->
      ${guardianNames ? `
        <div class="flex items-center justify-center gap-1.5 px-4 py-2 rounded-[10px] mb-4 text-[11px] font-semibold bg-[rgba(34,197,94,.06)] border border-[rgba(34,197,94,.12)] text-[#22c55e]"
         >
          ${icon('check', 'w-3 h-3')} ${t('confirmationSentTo') || 'Confirmation envoyee a'} ${guardianNames}
        </div>
      ` : ''}

      <!-- Add to journal -->
      <button onclick="guardianAddToJournal()" class="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold mb-2.5 bg-[rgba(59,130,246,.1)] border border-[rgba(59,130,246,.2)] text-[#3b82f6]"
       >
        ${icon('book', 'w-3.5 h-3.5')} ${t('addToJournal') || 'Ajouter au journal'}
      </button>

      <!-- Close -->
      <button onclick="closeGuardianModal()" class="w-full py-3.5 rounded-xl flex items-center justify-center text-[13px] font-semibold text-slate-500 bg-[rgba(255,255,255,.04)] border border-[rgba(255,255,255,.06)]"
       >
        ${t('close') || 'Fermer'}
      </button>
    </div>

    <style>
      @keyframes scaleCheckIn {
        from { transform: scale(0); }
        to { transform: scale(1); }
      }
    </style>
  `
}

// ─── BOTTOM SHEETS ───

export function renderBottomSheet(guardianState, guardianSheet) {
  const sheetType = guardianSheet
  let sheetContent = ''

  if (sheetType === 'plate') {
    const currentPlate = guardianState.licensePlate || ''
    sheetContent = `
      <div class="w-9 h-1 rounded bg-white/10 mx-auto mb-4"></div>
      <div class="flex items-center gap-2 text-[15px] font-extrabold text-white mb-1">
        <span class="text-[#06b6d4]">${icon('car', 'w-[18px] h-[18px]')}</span>
        ${t('licensePlateLabel') || 'Plaque du vehicule'}
      </div>
      <div class="text-[11px] text-slate-500 mb-4">${t('plateSheetDesc') || 'Note la plaque du vehicule dans lequel tu montes.'}</div>
      ${currentPlate ? `
        <div class="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-[11px] text-slate-500 mb-3 bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.06)]"
         >
          ${icon('history', 'w-3 h-3')} ${t('previousPlate') || 'Plaque precedente'}
          <span class="ml-auto font-bold text-slate-400 tracking-wider">${escapeHTML(currentPlate)}</span>
        </div>
      ` : ''}
      <input type="text" id="guardian-sheet-plate" class="w-full px-4 py-3 rounded-xl text-xl font-bold text-center tracking-widest uppercase text-white placeholder-slate-600 mb-2.5 focus:outline-none bg-[rgba(255,255,255,.04)] border border-[rgba(255,255,255,.1)]"
       
        placeholder="${t('plateExample') || 'AB-123-CD'}" maxlength="12" />
      <div class="flex gap-2 mt-2">
        <button onclick="guardianCloseSheet()" class="flex-1 py-3 rounded-xl text-slate-400 font-bold text-[13px] border border-[rgba(255,255,255,.08)]"
         >${t('cancel') || 'Annuler'}</button>
        <button onclick="guardianSavePlate()" class="flex-[2] py-3 rounded-xl text-white font-extrabold text-[13px] bg-[linear-gradient(135deg,#06b6d4,#0891b2)]"
         >
          ${icon('check', 'w-3.5 h-3.5 inline')} ${t('save') || 'Enregistrer'}
        </button>
      </div>
    `
  } else if (sheetType === 'photo') {
    sheetContent = `
      <div class="w-9 h-1 rounded bg-white/10 mx-auto mb-4"></div>
      <div class="flex items-center gap-2 text-[15px] font-extrabold text-white mb-1">
        <span class="text-[#a855f7]">${icon('camera', 'w-[18px] h-[18px]')}</span>
        ${t('driverPhoto') || 'Photo avec le conducteur'}
      </div>
      <div class="text-[11px] text-slate-500 mb-4">${t('photoSheetDesc') || 'Partagee avec tes gardiens. Supprimee automatiquement apres le voyage.'}</div>
      <div class="w-full h-[140px] rounded-xl flex flex-col items-center justify-center gap-2 mb-3 bg-[rgba(255,255,255,.02)] border border-[rgba(255,255,255,.06)] text-[#475569]">
        <div class="w-12 h-12 rounded-full flex items-center justify-center bg-[rgba(168,85,247,.1)] text-[#a855f7]">
          ${icon('camera', 'w-6 h-6')}
        </div>
        <span class="text-xs">${t('tapToTakePhoto') || 'Appuyer pour prendre une photo'}</span>
      </div>
      <div class="flex items-center gap-1.5 text-[10px] text-slate-600 mb-3.5">
        ${icon('lock', 'w-3 h-3')} ${t('autoDeleteAfterTrip') || 'Supprimee automatiquement a la fin du voyage'}
      </div>
      <div class="flex gap-2">
        <button onclick="guardianCloseSheet()" class="flex-1 py-3 rounded-xl text-slate-400 font-bold text-[13px] border border-[rgba(255,255,255,.08)]"
         >${t('cancel') || 'Annuler'}</button>
        <button onclick="guardianSaveTripPhoto()" class="flex-[2] py-3 rounded-xl text-white font-extrabold text-[13px] bg-[linear-gradient(135deg,#a855f7,#7c3aed)]"
         >
          ${icon('camera', 'w-3.5 h-3.5 inline')} ${t('takePhoto') || 'Prendre la photo'}
        </button>
      </div>
    `
  } else if (sheetType === 'destination') {
    const currentDest = guardianState.destination || ''
    sheetContent = `
      <div class="w-9 h-1 rounded bg-white/10 mx-auto mb-4"></div>
      <div class="flex items-center gap-2 text-[15px] font-extrabold text-white mb-1">
        <span class="text-[#f59e0b]">${icon('map-pin', 'w-[18px] h-[18px]')}</span>
        ${t('guardianDestination') || 'Destination'}
      </div>
      <div class="text-[11px] text-slate-500 mb-4">${t('destSheetDesc') || 'Change ta destination si ton trajet a evolue.'}</div>
      ${currentDest ? `
        <div class="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-[11px] text-slate-500 mb-3 bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.06)]"
         >
          ${icon('map-pin', 'w-3 h-3')} ${t('current') || 'Actuelle'}
          <span class="ml-auto font-bold text-slate-400">${escapeHTML(currentDest)}</span>
        </div>
      ` : ''}
      <input type="text" id="guardian-sheet-dest" class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-600 mb-3 focus:outline-none bg-[rgba(255,255,255,.04)] border border-[rgba(255,255,255,.1)]"
       
        placeholder="${t('newDestination') || 'Nouvelle destination...'}" />
      <div class="flex gap-2">
        <button onclick="guardianCloseSheet()" class="flex-1 py-3 rounded-xl text-slate-400 font-bold text-[13px] border border-[rgba(255,255,255,.08)]"
         >${t('cancel') || 'Annuler'}</button>
        <button onclick="guardianSaveDestination()" class="flex-[2] py-3 rounded-xl text-white font-extrabold text-[13px] bg-[linear-gradient(135deg,#f59e0b,#d97706)]"
         >
          ${icon('check', 'w-3.5 h-3.5 inline')} ${t('save') || 'Enregistrer'}
        </button>
      </div>
    `
  }

  return `
    <div class="absolute inset-0 z-50 flex items-end" onclick="guardianCloseSheet()" role="button" tabindex="0">
      <div class="absolute inset-0 bg-[rgba(0,0,0,.6)]"></div>
      <div class="relative w-full rounded-t-[20px] px-4 pt-5 pb-7 bg-[#161b28] [animation:sheetSlideUp_.25s_ease]" onclick="event.stopPropagation()" role="button" tabindex="0">
        ${sheetContent}
      </div>
    </div>
    <style>
      @keyframes sheetSlideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      }
    </style>
  `
}

// ─── HELPERS ───

export function renderTimelineEvents(guardianState) {
  const positions = guardianState.positions || []
  const events = []

  if (guardianState.lastCheckIn) {
    events.push({
      color: '#22c55e',
      time: new Date(guardianState.lastCheckIn).toLocaleTimeString(getState().lang || 'fr', { hour: '2-digit', minute: '2-digit' }),
      text: `Check-in OK ${icon('check', 'w-3 h-3 inline')}`,
    })
  }

  if (positions.length > 0) {
    const last = positions[positions.length - 1]
    events.push({
      color: '#3b82f6',
      time: new Date(last.timestamp).toLocaleTimeString(getState().lang || 'fr', { hour: '2-digit', minute: '2-digit' }),
      text: `${last.lat.toFixed(2)}, ${last.lng.toFixed(2)}`,
    })
  }

  if (guardianState.tripStart) {
    events.push({
      color: '#f59e0b',
      time: new Date(guardianState.tripStart).toLocaleTimeString(getState().lang || 'fr', { hour: '2-digit', minute: '2-digit' }),
      text: guardianState.destination ? `${t('departureFrom') || 'Depart vers'} ${escapeHTML(guardianState.destination)}` : (t('tripStarted') || 'Depart'),
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

export function renderTripHistory(history) {
  const lang = getState().lang || 'fr'
  const shown = history.slice(0, 5)

  return `
    <details class="group mt-4 rounded-xl bg-[rgba(255,255,255,.02)] border border-[rgba(255,255,255,.06)]">
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
            <div class="rounded-lg p-2.5 bg-[rgba(255,255,255,.03)] border border-[rgba(255,255,255,.04)]">
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
          onclick="guardianClearHistory()"
          class="w-full mt-1 py-2 text-xs text-slate-500 hover:text-red-400 transition-colors text-center"
        >
          ${t('clearHistory') || 'Clear history'}
        </button>
      </div>
    </details>
  `
}

export function formatTimeAgo(timestamp) {
  const diff = Date.now() - timestamp
  const min = Math.floor(diff / 60_000)
  if (min < 1) return t('justNow') || 'maintenant'
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  return `${h}h${String(min % 60).padStart(2, '0')}`
}

// ─── GLOBAL HANDLERS ───

