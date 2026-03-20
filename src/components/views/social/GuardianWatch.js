/**
 * Guardian Watch Component
 * Displays friends who are currently in Guardian mode.
 * Shows their position, status, and time since last check-in.
 * Design: V7 Timeline style, consistent with Companion.js
 */

import { t } from '../../../i18n/index.js'
import { icon } from '../../../utils/icons.js'
import { escapeHTML } from '../../../utils/sanitize.js'
import {
  getActiveGuardianTimers,
  getTimeSinceCheckIn,
  isTimerOverdue,
  getTripDuration,
} from '../../../services/guardianWatch.js'

/**
 * Render the guardian watch section (for Social tab)
 * @returns {string} HTML
 */
export function renderGuardianWatch() {
  const timers = getActiveGuardianTimers()

  if (timers.length === 0) return ''

  return `
    <div class="mb-4">
      <div class="flex items-center gap-2 mb-3 px-1">
        <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
        <span class="text-sm font-bold text-slate-200">${escapeHTML(t('friendsOnTrip') || 'Amis en trajet')}</span>
        <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">${timers.length}</span>
      </div>
      ${timers.map(timer => renderTimerCard(timer)).join('')}
    </div>
  `
}

/**
 * Render a single friend's guardian timer card
 */
function renderTimerCard(timer) {
  const overdue = isTimerOverdue(timer)
  const timeSince = getTimeSinceCheckIn(timer)
  const duration = getTripDuration(timer)
  const initial = (timer.userName || '?')[0].toUpperCase()
  const borderClass = overdue
    ? 'border-red-500/30'
    : 'border-white/[0.06]'
  const statusBg = overdue
    ? 'bg-red-500/10 text-red-400'
    : 'bg-emerald-500/10 text-emerald-400'
  const statusText = overdue
    ? (t('checkInOverdue') || 'En retard')
    : (t('onTrip') || 'En route')

  const lat = timer.lastPosition?.lat
  const lng = timer.lastPosition?.lng
  const positionText = lat && lng
    ? `${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`
    : (t('positionUnknown') || 'Position inconnue')

  return `
    <div class="bg-slate-800/80 border ${borderClass} rounded-2xl p-4 mb-3 transition-colors">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-sm font-bold text-dark-primary shrink-0">${escapeHTML(initial)}</div>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-bold text-slate-200 truncate">${escapeHTML(timer.userName || 'Voyageur')}</div>
          <div class="text-[11px] text-slate-500">${timer.destination ? escapeHTML(t('towards') || 'Vers') + ' ' + escapeHTML(timer.destination) : escapeHTML(t('onTheRoad') || 'Sur la route')}</div>
        </div>
        <span class="text-[10px] font-semibold px-2.5 py-1 rounded-full ${statusBg} flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-current ${overdue ? 'animate-pulse' : ''}"></span>
          ${escapeHTML(statusText)}
        </span>
      </div>

      <!-- Stats -->
      <div class="flex gap-0 bg-slate-900/50 rounded-xl overflow-hidden mb-3">
        <div class="flex-1 py-2.5 px-2 text-center border-r border-white/[0.04]">
          <div class="text-xs font-bold text-slate-200">${escapeHTML(timeSince)}</div>
          <div class="text-[10px] text-slate-500 uppercase tracking-wider">${escapeHTML(t('lastCheckIn') || 'Dernier signe')}</div>
        </div>
        <div class="flex-1 py-2.5 px-2 text-center border-r border-white/[0.04]">
          <div class="text-xs font-bold text-slate-200">${escapeHTML(duration)}</div>
          <div class="text-[10px] text-slate-500 uppercase tracking-wider">${escapeHTML(t('tripDuration') || 'En route')}</div>
        </div>
        <div class="flex-1 py-2.5 px-2 text-center">
          <div class="text-xs font-bold text-slate-200">${timer.checkInIntervalMinutes || 30} min</div>
          <div class="text-[10px] text-slate-500 uppercase tracking-wider">${escapeHTML(t('interval') || 'Intervalle')}</div>
        </div>
      </div>

      <!-- Position -->
      <div class="flex items-center gap-2 mb-3 px-1">
        <span class="text-slate-400">${icon('map-pin', 'w-3.5 h-3.5')}</span>
        <span class="text-[11px] text-slate-400">${escapeHTML(positionText)}</span>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button onclick="openGuardianChat('${escapeHTML(timer.userId)}')" class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-700/50 border border-white/[0.06] text-sm font-medium text-slate-300 transition-colors">
          ${icon('send', 'w-4 h-4')} ${escapeHTML(t('message') || 'Message')}
        </button>
        <button onclick="callGuardianFriend('${escapeHTML(timer.userId)}')" class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-700/50 border border-white/[0.06] text-sm font-medium text-slate-300 transition-colors">
          ${icon('phone', 'w-4 h-4')} ${escapeHTML(t('call') || 'Appeler')}
        </button>
      </div>

      ${overdue ? `
        <!-- Overdue alert -->
        <div class="mt-3 flex items-center gap-2 p-3 rounded-xl bg-red-500/[0.08] border border-red-500/20">
          <span class="text-red-400">${icon('alert-triangle', 'w-4 h-4')}</span>
          <span class="text-[11px] text-red-300 font-medium">${escapeHTML(t('checkInMissedGuardian') || 'Pas de nouvelles depuis le dernier check-in prévu')}</span>
        </div>
      ` : ''}
    </div>
  `
}

// Register handlers
window.openGuardianChat = async (userId) => {
  if (!userId) return
  window.openDirectMessage?.(userId)
}

window.callGuardianFriend = async (userId) => {
  // Open the friend's profile to find their contact info
  window.showFriendProfile?.(userId)
}
