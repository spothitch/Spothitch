/**
 * Companion Mode Modal
 * Safety feature: set a guardian, start a trip, check in periodically.
 * If check-in is missed, alert guardian with last known position.
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
 *
 * V7 "Timeline" design
 */

import { t } from '../../i18n/index.js'
import { icon } from '../../utils/icons.js'
import { escapeHTML } from '../../utils/sanitize.js'
import { renderToggle } from '../../utils/toggle.js'
import { getState } from '../../stores/state.js'
import {
  getCompanionState,
  getTimeUntilNextCheckIn,
  isCheckInOverdue,
  loadTripHistory,
  getETAInfo,
} from '../../services/companion.js'

/**
 * Render the Companion Mode modal
 * Includes per-session location consent (legal requirement)
 */
export function renderCompanionModal(_state) {
  const companion = getCompanionState()
  const active = companion.active

  // Check if location consent was given this session
  const consentGiven =
    typeof sessionStorage !== 'undefined' &&
    sessionStorage.getItem('spothitch_companion_consent')

  // Check auto-expiration (8 hours max)
  if (active && companion.tripStart) {
    const elapsed = Date.now() - companion.tripStart
    const maxDuration = 8 * 60 * 60 * 1000 // 8 hours
    if (elapsed > maxDuration) {
      import('../../services/companion.js').then(m => m.stopCompanionMode?.())
      return ''
    }
  }

  // Show consent screen if not yet consented this session and not already active
  if (!active && !consentGiven) {
    return renderConsentScreen()
  }

  return `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      onclick="closeCompanionModal()"
      role="dialog"
      aria-modal="true"
      aria-labelledby="companion-modal-title"
     tabindex="0">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true"></div>

      <!-- Modal -->
      <div
        class="relative bg-dark-primary border border-white/10 rounded-3xl
          w-full max-w-md max-h-[90vh] overflow-y-auto slide-up"
        onclick="event.stopPropagation()"
      >
        ${active ? renderActiveView(companion) : renderSetupView(companion)}
      </div>

      <!-- Overdue Alert Overlay -->
      ${active && isCheckInOverdue() && !companion.alertSent ? renderAlertOverlay(companion) : ''}
    </div>
  `
}

/**
 * Per-session consent screen for location sharing
 */
function renderConsentScreen() {
  return `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      onclick="closeCompanionModal()"
      role="dialog"
      aria-modal="true"
      aria-labelledby="companion-consent-title"
     tabindex="0">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true"></div>
      <div
        class="relative bg-dark-primary border border-emerald-500/30 rounded-3xl w-full max-w-md slide-up"
        onclick="event.stopPropagation()"
      >
        <div class="p-8 text-center">
          <div class="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            ${icon('map-pin', 'w-8 h-8 text-emerald-400')}
          </div>
          <h2 id="companion-consent-title" class="text-xl font-bold text-white mb-4">
            ${t('companionConsentTitle') || 'Location sharing consent'}
          </h2>
          <div class="text-sm text-slate-300 text-left space-y-3 mb-5">
            <p>${t('companionConsentText1') || 'Companion mode will share your real-time GPS position with your chosen guardian contact.'}</p>
            <p>${t('companionConsentText2') || 'Your location will be shared only during the active trip and will automatically stop after 8 hours maximum.'}</p>
            <p>${t('companionConsentText3') || 'You can stop sharing at any time. Your location history is never sold or shared with third parties.'}</p>
          </div>

          <!-- Coming soon section -->
          <div class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-5 text-left">
            <div class="flex items-center gap-2 mb-2">
              ${icon('rocket', 'w-4 h-4 text-emerald-400')}
              <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider">${t('companionComingSoon') || 'Coming soon'}</span>
            </div>
            <ul class="text-xs text-slate-300 space-y-1.5">
              <li class="flex items-start gap-2">
                ${icon('bell', 'w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0')}
                <span>${t('companionFuturePush') || 'Your guardian receives automatic push notifications'}</span>
              </li>
              <li class="flex items-start gap-2">
                ${icon('map', 'w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0')}
                <span>${t('companionFutureLive') || 'Guardian sees your live position on the SpotHitch map'}</span>
              </li>
              <li class="flex items-start gap-2">
                ${icon('message-circle', 'w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0')}
                <span>${t('companionFutureSMS') || 'Automatic SMS alerts to your guardian'}</span>
              </li>
            </ul>
          </div>

          <button
            onclick="acceptCompanionConsent()"
            class="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg transition-colors mb-3"
          >
            ${t('companionConsentAccept') || 'I agree, continue'}
          </button>
          <button
            onclick="closeCompanionModal()"
            class="w-full py-3 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 transition-colors text-sm"
          >
            ${t('cancel') || 'Cancel'}
          </button>
        </div>
        <button
          onclick="closeCompanionModal()"
          class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          aria-label="${t('close') || 'Close'}"
        >
          ${icon('x', 'w-5 h-5')}
        </button>
      </div>
    </div>
  `
}

/**
 * Setup view — V7 Timeline design
 * Guardian selection, destination, interval buttons, then start trip
 */
function renderSetupView(companion) {
  const history = loadTripHistory()
  const contacts = Array.isArray(companion.trustedContacts) ? companion.trustedContacts : []
  const currentInterval = companion.checkInInterval || 30

  return `
    <!-- Header -->
    <div class="p-6 pb-0">
      <div class="flex items-center justify-between mb-1">
        <h2 id="companion-modal-title" class="text-base font-bold text-white flex items-center gap-2">
          ${icon('shield', 'w-4 h-4 text-amber-400')}
          ${t('companionMode') || 'Guardian Mode'}
        </h2>
        <button
          onclick="closeCompanionModal()"
          class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="${t('close') || 'Close'}"
        >
          ${icon('x', 'w-4 h-4 text-white')}
        </button>
      </div>
      <p class="text-xs text-slate-400 mb-4">
        ${t('companionExplanation') || 'Your guardians will watch over you during your hitchhiking trip.'}
      </p>
    </div>

    <!-- Content -->
    <div class="px-5 pb-5 space-y-4">

      <!-- === DESTINATION === -->
      <div>
        <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5" for="companion-destination">
          ${t('companionDestination') || 'Destination'}
        </label>
        <input
          type="text"
          id="companion-destination"
          class="w-full px-3.5 py-3 rounded-xl bg-slate-800/80 border border-white/[0.06] text-white placeholder-slate-500 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-colors"
          placeholder="${t('companionDestinationPlaceholder') || 'e.g. Paris, Lyon...'}"
          value="${escapeHTML(companion.destination || '')}"
          aria-label="${t('companionDestination') || 'Destination'}"
        />
      </div>

      <!-- === GUARDIAN SELECTION === -->
      <div>
        <h3 class="text-[13px] font-bold text-white flex items-center gap-2 mb-3">
          ${icon('users', 'w-3.5 h-3.5 text-amber-400')}
          ${t('guardianTitle') || 'Select your guardians'}
        </h3>

        <!-- Primary guardian -->
        <div class="space-y-2 mb-3">
          <div class="flex items-center gap-3 bg-slate-800/80 rounded-xl px-3.5 py-3">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-sm font-bold text-dark-primary shrink-0">
              ${escapeHTML((companion.guardian?.name || '?')[0].toUpperCase())}
            </div>
            <div class="flex-1 min-w-0">
              <input
                type="text"
                id="companion-guardian-name"
                class="block w-full bg-transparent text-sm font-semibold text-white placeholder-slate-500 focus:outline-none"
                placeholder="${t('guardianName') || 'Guardian name'}"
                value="${escapeHTML(companion.guardian?.name || '')}"
                aria-label="${t('guardianName') || 'Guardian name'}"
              />
              <input
                type="tel"
                id="companion-guardian-phone"
                class="block w-full bg-transparent text-xs text-slate-400 placeholder-slate-600 focus:outline-none mt-0.5"
                placeholder="+33 6 12 34 56 78"
                value="${companion.guardian?.phone || ''}"
                aria-label="${t('guardianPhone') || 'Guardian phone'}"
              />
            </div>
            <div class="w-5 h-5 rounded-full bg-emerald-500 border-2 border-emerald-500 flex items-center justify-center shrink-0">
              ${icon('check', 'w-3 h-3 text-white')}
            </div>
          </div>
        </div>

        <!-- Trusted contacts list -->
        ${contacts.length > 0 ? `
          <div class="space-y-2 mb-3">
            ${contacts.map((c, i) => `
              <div class="flex items-center gap-3 bg-slate-800/80 rounded-xl px-3.5 py-3">
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  ${escapeHTML((c.name || '?')[0].toUpperCase())}
                </div>
                <div class="flex-1 min-w-0">
                  <span class="block text-sm font-semibold text-white truncate">${escapeHTML(c.name || '?')}</span>
                  <span class="block text-xs text-slate-400">${escapeHTML(c.phone || '')}</span>
                </div>
                <button
                  onclick="companionRemoveTrustedContact(${i})"
                  class="w-5 h-5 rounded-full bg-emerald-500 border-2 border-emerald-500 flex items-center justify-center shrink-0 hover:bg-red-500 hover:border-red-500 transition-colors"
                  aria-label="${t('remove') || 'Remove'}"
                >
                  ${icon('check', 'w-3 h-3 text-white')}
                </button>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Add trusted contact -->
        ${contacts.length < 5 ? `
          <div class="flex gap-2">
            <input
              type="text"
              id="companion-tc-name"
              class="flex-1 px-3 py-2.5 rounded-xl bg-slate-800/80 border border-white/[0.06] text-white placeholder-slate-500 text-xs focus:border-amber-500 transition-colors"
              placeholder="${t('contactName') || 'Name'}"
              aria-label="${t('contactName') || 'Contact name'}"
            />
            <input
              type="tel"
              id="companion-tc-phone"
              class="flex-1 px-3 py-2.5 rounded-xl bg-slate-800/80 border border-white/[0.06] text-white placeholder-slate-500 text-xs focus:border-amber-500 transition-colors"
              placeholder="+33 6..."
              aria-label="${t('guardianPhone') || 'Phone'}"
            />
            <button
              onclick="companionAddTrustedContact()"
              class="px-3 py-2.5 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
              aria-label="${t('add') || 'Add'}"
            >
              ${icon('plus', 'w-4 h-4')}
            </button>
          </div>
        ` : `
          <p class="text-xs text-amber-400">${t('trustedContactsMaxReached') || 'Maximum 5 contacts reached'}</p>
        `}
      </div>

      <!-- === CHECK-IN INTERVAL (pill buttons) === -->
      <div>
        <label class="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          ${t('checkInInterval') || 'Check-in interval'}
        </label>
        <div class="flex gap-2">
          ${[15, 30, 45, 60].map(val => `
            <button
              onclick="document.querySelectorAll('[data-interval-btn]').forEach(b=>{b.classList.remove('bg-amber-500','text-dark-primary','border-amber-500/30');b.classList.add('bg-slate-800/80','text-slate-300','border-white/[0.06]')});this.classList.remove('bg-slate-800/80','text-slate-300','border-white/[0.06]');this.classList.add('bg-amber-500','text-dark-primary','border-amber-500/30');document.getElementById('companion-interval').value='${val}'"
              data-interval-btn
              class="flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${val === currentInterval ? 'bg-amber-500 text-dark-primary border-amber-500/30' : 'bg-slate-800/80 text-slate-300 border-white/[0.06]'}"
            >
              ${val < 60 ? `${val}min` : `1h`}
            </button>
          `).join('')}
        </div>
        <input type="hidden" id="companion-interval" value="${currentInterval}" />
      </div>

      <!-- === NOTIFICATIONS TOGGLES === -->
      <div class="bg-slate-800/50 rounded-xl p-3.5 border border-white/[0.06] space-y-3">
        <h3 class="text-xs font-semibold text-slate-300 flex items-center gap-2">
          ${icon('bell', 'w-3.5 h-3.5 text-amber-400')}
          ${t('companionNotifications') || 'Automatic notifications'}
        </h3>

        <!-- Departure toggle (#26) -->
        <label class="flex items-center justify-between cursor-pointer">
          <div>
            <span class="text-xs text-white">${t('notifyOnDeparture') || 'Notify guardian on departure'}</span>
            <p class="text-[10px] text-slate-500">${t('notifyOnDepartureDesc') || 'Sends "I am starting my trip" on start'}</p>
          </div>
          <input type="checkbox" id="companion-notify-departure" class="hidden" ${companion.notifyOnDeparture !== false ? 'checked' : ''}>
          ${renderToggle(companion.notifyOnDeparture !== false, "toggleFormToggle('companion-notify-departure')", t('notifyOnDeparture') || 'Notify guardian on departure')}
        </label>

        <!-- Arrival toggle (#25) -->
        <label class="flex items-center justify-between cursor-pointer">
          <div>
            <span class="text-xs text-white">${t('notifyOnArrival') || 'Notify guardian on arrival'}</span>
            <p class="text-[10px] text-slate-500">${t('notifyOnArrivalDesc') || 'Sends "I arrived safely" on stop'}</p>
          </div>
          <input type="checkbox" id="companion-notify-arrival" class="hidden" ${companion.notifyOnArrival !== false ? 'checked' : ''}>
          ${renderToggle(companion.notifyOnArrival !== false, "toggleFormToggle('companion-notify-arrival')", t('notifyOnArrival') || 'Notify guardian on arrival')}
        </label>
      </div>

      <!-- === PUSH NOTIFICATION INFO === -->
      <div class="bg-amber-500/10 rounded-xl p-3 border border-amber-500/20">
        <div class="flex items-center gap-2 mb-1">
          ${icon('bell', 'w-3.5 h-3.5 text-amber-400')}
          <span class="text-xs font-semibold text-amber-400">${t('companionPushOnly') || 'Push notifications'}</span>
        </div>
        <p class="text-[10px] text-slate-400 leading-relaxed">
          ${t('companionPushOnlyDesc') || 'Alerts are sent via push notifications in the app. Your guardian receives instant alerts even abroad, with no SMS cost.'}
        </p>
      </div>

      <!-- Start Trip Button -->
      <button
        onclick="startCompanion()"
        class="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-dark-primary font-bold text-sm flex items-center justify-center gap-2.5 transition-colors active:scale-95"
        aria-label="${t('startTrip') || 'Start trip'}"
      >
        ${icon('shield', 'w-5 h-5')}
        ${t('companionActivate') || 'Activate Guardian'}
      </button>

      <!-- === TRIP HISTORY (#31) === -->
      ${history.length > 0 ? renderTripHistory(history) : ''}
    </div>
  `
}

/**
 * Active view — V7 Timeline design
 * Timer card at top, timeline events, action buttons at bottom
 */
function renderActiveView(companion) {
  const secondsRemaining = getTimeUntilNextCheckIn()
  const overdue = secondsRemaining < 0
  const absSeconds = Math.abs(secondsRemaining)
  const minutes = Math.floor(absSeconds / 60)
  const seconds = absSeconds % 60

  // Trip duration
  const tripMs = companion.tripStart ? Date.now() - companion.tripStart : 0
  const tripMinutes = Math.floor(tripMs / 60_000)
  const tripHours = Math.floor(tripMinutes / 60)
  const tripMins = tripMinutes % 60

  // Positions array
  const positions = companion.positions || []

  // Timer circle progress (0 to 1)
  const totalSeconds = companion.checkInInterval * 60
  const elapsed = totalSeconds - secondsRemaining
  const progress = overdue ? 1 : Math.min(elapsed / totalSeconds, 1)

  // ETA
  const etaInfo = getETAInfo(companion)

  // Contacts count (primary guardian + trusted contacts with phone)
  const extraContacts = Array.isArray(companion.trustedContacts)
    ? companion.trustedContacts.filter(c => c?.phone).length
    : 0
  const contactsCount = 1 + extraContacts

  // Status badge
  const isWarning = !overdue && secondsRemaining < 180 // < 3 min
  const badgeColor = overdue ? 'bg-red-500/10 text-red-400' : isWarning ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
  const badgeLabel = overdue
    ? (t('companionOverdue') || 'Check-in missed')
    : isWarning
      ? (t('companionWarning') || 'Check-in soon')
      : (t('companionSafe') || 'Safe')
  const badgeDotColor = overdue ? 'bg-red-400' : isWarning ? 'bg-amber-400' : 'bg-emerald-400'

  const lang = getState().lang || 'fr'

  return `
    <!-- Close button -->
    <button
      onclick="closeCompanionModal()"
      class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
      aria-label="${t('close') || 'Close'}"
    >
      ${icon('x', 'w-4 h-4 text-white')}
    </button>

    <!-- Content -->
    <div class="p-5 space-y-4">
      <!-- Timer Card -->
      <div class="bg-slate-800/80 rounded-2xl p-5 text-center border ${overdue ? 'border-red-500/30' : 'border-amber-500/15'}">
        <h2 id="companion-modal-title" class="sr-only">${t('companionActive') || 'Companion Mode active'}</h2>
        <div class="text-4xl font-extrabold ${overdue ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-white'} leading-none">
          ${overdue ? '+' : ''}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}
        </div>
        <div class="text-[11px] text-slate-500 uppercase tracking-wider mt-1">
          ${overdue ? (t('companionOverdueLabel') || 'Overdue') : (t('checkInReminder') || 'Next check-in')}
        </div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold mt-2 ${badgeColor}">
          <span class="w-1.5 h-1.5 rounded-full ${badgeDotColor}"></span>
          ${badgeLabel}
        </div>
      </div>

      <!-- Timeline -->
      <div class="relative pl-7">
        <!-- Vertical line -->
        <div class="absolute left-2 top-0 bottom-0 w-0.5 bg-white/[0.06]" aria-hidden="true"></div>

        <!-- Trip start event -->
        <div class="relative mb-3">
          <div class="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-emerald-500 z-10" aria-hidden="true"></div>
          <div class="bg-slate-800/80 rounded-xl p-3">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[13px] font-bold text-white flex items-center gap-1.5">
                ${icon('shield', 'w-3.5 h-3.5 text-amber-400')}
                ${t('tripStarted') || 'Trip started'}
              </span>
              <span class="text-[10px] text-slate-500">
                ${companion.tripStart ? new Date(companion.tripStart).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' }) : ''}
              </span>
            </div>
            <p class="text-xs text-slate-400">
              ${companion.destination ? `→ ${escapeHTML(companion.destination)}. ` : ''}${t('guardianName') || 'Guardian'}: ${escapeHTML(companion.guardian?.name || '?')}${contactsCount > 1 ? ` +${contactsCount - 1}` : ''}
            </p>
          </div>
        </div>

        <!-- Check-in events (from positions/check-ins) -->
        ${(companion.checkInsCount || 0) > 0 ? `
          ${Array.from({ length: Math.min(companion.checkInsCount || 0, 5) }, (_, i) => {
            const checkInNum = (companion.checkInsCount || 0) - i
            const isCurrent = i === 0
            return `
              <div class="relative mb-3">
                <div class="absolute ${isCurrent ? '-left-[22px] top-1 w-4 h-4' : '-left-5 top-1.5 w-3 h-3'} rounded-full ${isCurrent ? 'bg-amber-500 border-2 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]' : 'bg-emerald-500 border-2 border-emerald-500'} z-10" aria-hidden="true"></div>
                <div class="bg-slate-800/80 rounded-xl p-3 ${isCurrent ? 'border border-amber-500/20' : ''}">
                  <div class="flex items-center justify-between mb-0.5">
                    <span class="text-[13px] font-bold text-white flex items-center gap-1.5">
                      ${icon('check', 'w-3.5 h-3.5 text-amber-400')}
                      Check-in ${checkInNum}
                    </span>
                  </div>
                  <p class="text-xs text-slate-400">${t('imSafe') || "I'm safe"}</p>
                </div>
              </div>
            `
          }).join('')}
        ` : ''}

        <!-- Map position card -->
        ${positions.length > 0 ? `
          <div class="relative mb-3">
            <div class="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-emerald-500 z-10" aria-hidden="true"></div>
            <div class="bg-slate-800/80 rounded-xl p-3">
              <div class="flex items-center justify-between mb-2">
                <span class="text-[13px] font-bold text-white flex items-center gap-1.5">
                  ${icon('map-pin', 'w-3.5 h-3.5 text-amber-400')}
                  ${t('positions') || 'Position'}
                </span>
                <span class="text-[10px] text-slate-500">
                  ${new Date(positions[positions.length - 1].timestamp).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div class="w-full h-[80px] rounded-lg bg-slate-900/80 relative overflow-hidden">
                <div class="absolute inset-0 opacity-5" style="background-image: linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px); background-size: 24px 24px;"></div>
                <div class="absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full bg-amber-500 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(245,158,11,0.4)]"></div>
                <div class="absolute bottom-1.5 left-2.5 text-[10px] text-slate-500 flex items-center gap-1">
                  ${icon('map-pin', 'w-3 h-3')}
                  ${positions[positions.length - 1].lat.toFixed(4)}, ${positions[positions.length - 1].lng.toFixed(4)}
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Stats card -->
        <div class="relative mb-3">
          <div class="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-slate-600 border-2 border-slate-600 z-10" aria-hidden="true"></div>
          <div class="bg-slate-800/80 rounded-xl overflow-hidden">
            <div class="flex divide-x divide-white/[0.04]">
              <div class="flex-1 py-3 px-2 text-center">
                <div class="text-sm font-extrabold text-white">
                  ${tripHours > 0 ? `${tripHours}h${String(tripMins).padStart(2, '0')}` : `${tripMins}min`}
                </div>
                <div class="text-[9px] text-slate-500 uppercase tracking-wider">${t('tripDuration') || 'Duration'}</div>
              </div>
              <div class="flex-1 py-3 px-2 text-center">
                <div class="text-sm font-extrabold text-white">${companion.checkInsCount || 0}</div>
                <div class="text-[9px] text-slate-500 uppercase tracking-wider">${t('checkInsCount') || 'Check-ins'}</div>
              </div>
              <div class="flex-1 py-3 px-2 text-center" id="companion-battery-row">
                <div class="text-sm font-extrabold text-white">${companion.checkInInterval}min</div>
                <div class="text-[9px] text-slate-500 uppercase tracking-wider">${t('checkInInterval') || 'Interval'}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ETA card -->
        ${etaInfo.speedKmh !== null ? `
          <div class="relative mb-3">
            <div class="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-slate-600 border-2 border-slate-600 z-10" aria-hidden="true"></div>
            <div class="bg-slate-800/80 rounded-xl p-3">
              <div class="flex items-center gap-2 mb-1">
                ${icon('navigation', 'w-3.5 h-3.5 text-amber-400')}
                <span class="text-xs font-medium text-slate-300">${t('etaTitle') || 'Speed & ETA'}</span>
              </div>
              <div class="flex items-center gap-3 text-xs">
                <span class="text-white font-bold">${Math.round(etaInfo.speedKmh)} km/h</span>
                ${etaInfo.etaMinutes !== null ? `
                  <span class="text-slate-600">|</span>
                  <span class="text-slate-300">${t('etaLabel') || 'ETA'}: <span class="text-amber-400 font-bold">
                    ${etaInfo.etaMinutes < 60
                      ? `${etaInfo.etaMinutes}min`
                      : `${Math.floor(etaInfo.etaMinutes / 60)}h${String(etaInfo.etaMinutes % 60).padStart(2, '0')}`
                    }
                  </span></span>
                ` : ''}
                ${etaInfo.distanceKm !== null ? `
                  <span class="text-slate-600">|</span>
                  <span class="text-slate-400">${etaInfo.distanceKm.toFixed(1)} km</span>
                ` : ''}
              </div>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Action buttons -->
      <div class="space-y-2.5">
        <!-- Check-in Button -->
        <button
          onclick="companionCheckIn()"
          class="w-full py-4 rounded-xl ${overdue ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30 animate-pulse' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'} ${overdue ? 'text-white' : 'text-dark-primary'} font-bold text-base flex items-center justify-center gap-2.5 transition-colors shadow-lg active:scale-95"
          aria-label="${t('imSafe') || "I'm safe"}"
        >
          ${icon('check', 'w-5 h-5')}
          ${overdue ? (t('imSafe') || "I'm safe") : (t('companionCheckInNow') || 'Check-in now')}
        </button>

        <!-- SOS + Stop row -->
        <div class="flex gap-2.5">
          <button
            onclick="companionSendAlert()"
            class="flex-1 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"
            aria-label="SOS"
          >
            ${icon('triangle-alert', 'w-4 h-4')}
            SOS
          </button>
          <button
            onclick="stopCompanion()"
            class="flex-1 py-3 rounded-xl bg-slate-800/80 border border-white/[0.06] text-slate-300 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-700/80 transition-colors"
            aria-label="${t('stopTrip') || 'Stop trip'}"
          >
            ${icon('circle-stop', 'w-4 h-4')}
            ${t('stopTrip') || 'Stop trip'}
          </button>
        </div>
      </div>
    </div>
  `
}

/**
 * GPS breadcrumb timeline — last 10 positions (#24)
 */
function renderBreadcrumbTimeline(positions) {
  const lang = getState().lang || 'fr'
  const trail = positions.slice(-10).reverse() // newest first

  return `
    <div class="bg-white/5 rounded-xl p-4 border border-white/10">
      <div class="flex items-center gap-2 mb-3">
        ${icon('route', 'w-4 h-4 text-emerald-400')}
        <span class="text-sm font-medium text-slate-300">${t('breadcrumbTrail') || 'GPS trail'}</span>
        <span class="text-xs text-slate-500 ml-auto">${positions.length} ${t('positions') || 'positions'}</span>
      </div>
      <div class="space-y-2 max-h-40 overflow-y-auto">
        ${trail.map((pos, i) => `
          <div class="flex items-center gap-3 ${i === 0 ? 'opacity-100' : 'opacity-60'}">
            <div class="flex-shrink-0 w-2 h-2 rounded-full ${i === 0 ? 'bg-emerald-400' : 'bg-slate-500'}"></div>
            <div class="flex-1 min-w-0">
              <span class="text-xs text-slate-400 font-mono">
                ${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}
              </span>
            </div>
            <span class="text-xs text-slate-500 flex-shrink-0">
              ${new Date(pos.timestamp).toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

/**
 * Trip history section (#31)
 */
function renderTripHistory(history) {
  const lang = getState().lang || 'fr'
  const shown = history.slice(0, 5)

  return `
    <details class="group bg-slate-800/50 rounded-xl border border-white/[0.06]">
      <summary class="flex items-center justify-between p-3.5 cursor-pointer list-none select-none">
        <span class="text-xs font-semibold text-slate-300 flex items-center gap-2">
          ${icon('history', 'w-3.5 h-3.5 text-slate-400')}
          ${t('pastTrips') || 'Past trips'} <span class="text-slate-500">(${history.length})</span>
        </span>
        <span class="text-slate-400 group-open:rotate-180 transition-transform">
          ${icon('chevron-down', 'w-3.5 h-3.5')}
        </span>
      </summary>
      <div class="px-3.5 pb-3.5 space-y-2">
        ${shown.map(trip => {
          const start = new Date(trip.startTime)
          const durationMs = (trip.endTime || Date.now()) - trip.startTime
          const totalMin = Math.floor(durationMs / 60_000)
          const h = Math.floor(totalMin / 60)
          const m = totalMin % 60
          const dur = h > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${m}min`

          return `
            <div class="bg-slate-800/80 rounded-xl p-3 border border-white/[0.04]">
              <div class="flex items-center justify-between mb-1">
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
                <span>${icon('map-pin', 'w-3 h-3 inline')} ${(trip.positions || []).length}</span>
              </div>
            </div>
          `
        }).join('')}
        ${history.length > 5 ? `<p class="text-xs text-slate-500 text-center">${t('andMoreTrips') || `+${history.length - 5} more trips`}</p>` : ''}
        <button
          onclick="companionClearHistory()"
          class="w-full mt-2 py-2 text-xs text-slate-500 hover:text-red-400 transition-colors text-center"
        >
          ${t('clearHistory') || 'Clear history'}
        </button>
      </div>
    </details>
  `
}

/**
 * Alert overlay — shown when check-in is overdue
 * V7 design: SOS pulsing circle + timeline + action buttons
 */
function renderAlertOverlay(companion) {
  const contactsCount = 1 + (Array.isArray(companion.trustedContacts) ? companion.trustedContacts.filter(c => c?.phone).length : 0)

  return `
    <div class="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-red-900/95 backdrop-blur-xl"
      role="alertdialog" aria-modal="true" aria-labelledby="companion-alert-title"
      onclick="event.stopPropagation()">
      <div class="text-center max-w-sm w-full">
        <!-- Pulsing icon -->
        <div class="w-24 h-24 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-6 animate-pulse">
          <div class="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
            ${icon('triangle-alert', 'w-8 h-8 text-white')}
          </div>
        </div>

        <h2 id="companion-alert-title" class="text-2xl font-extrabold text-white mb-2">
          ${t('areYouOk') || 'Are you OK?'}
        </h2>
        <p class="text-sm text-red-200 mb-8">
          ${t('missedCheckIn') || "You didn't check in on time."}
        </p>

        <!-- I'm fine -->
        <button
          onclick="companionCheckIn()"
          class="w-full py-4 rounded-xl bg-emerald-500 text-white font-bold text-lg mb-3 flex items-center justify-center gap-3 active:scale-95 transition-colors"
          aria-label="${t('imSafe') || "I'm safe"}"
        >
          ${icon('check', 'w-6 h-6')}
          ${t('imSafe') || "I'm safe"}
        </button>

        <!-- Send Alert -->
        <button
          onclick="companionSendAlert()"
          class="w-full py-4 rounded-xl bg-red-500 text-white font-bold text-lg flex items-center justify-center gap-3 active:scale-95 transition-colors"
          aria-label="${t('sendAlertTo') || 'Send alert to'} ${escapeHTML(companion.guardian?.name || '')}"
        >
          ${icon('send', 'w-6 h-6')}
          ${t('sendAlertTo') || 'Send alert to'} ${escapeHTML(companion.guardian?.name || '')}
          ${contactsCount > 1 ? `+${contactsCount - 1}` : ''}
        </button>
      </div>
    </div>
  `
}

// ---- Global handlers ----

/** Accept consent and show setup */
window.acceptCompanionConsent = () => {
  sessionStorage.setItem('spothitch_companion_consent', '1')
  // Force re-render — setState({showCompanionModal:true}) is a no-op if already true
  window._forceRender?.()
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

  // Re-render
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

  const { getBatteryLevel } = await import('../../services/companion.js')
  const level = await getBatteryLevel()

  if (level === null) return

  const pct = Math.round(level * 100)
  const isLow = pct <= 15
  const color = isLow ? 'text-red-400' : pct <= 30 ? 'text-amber-400' : 'text-emerald-400'

  el.innerHTML = `
    <div class="text-sm font-extrabold ${color}">${pct}%</div>
    <div class="text-[9px] text-slate-500 uppercase tracking-wider">${t('batteryLevel') || 'Battery'}</div>
  `
}

// Init companion battery display after render
// Called from afterRender in App.js instead of using a global MutationObserver
let _batteryDisplayDone = false
export function initCompanionAfterRender(isVisible) {
  if (isVisible) {
    const el = document.getElementById('companion-battery-row')
    if (el && !_batteryDisplayDone) {
      _batteryDisplayDone = true
      updateBatteryDisplay()
    }
  } else {
    // Reset flag when modal closes
    _batteryDisplayDone = false
  }
}

export default { renderCompanionModal }
