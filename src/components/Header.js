/**
 * Header Component — Translucent glassmorphism
 */

import { t } from '../i18n/index.js'
import { icon } from '../utils/icons.js'
import { isGuardianActive, getTimeUntilNextCheckIn } from '../services/guardian.js'

export function renderHeader(state) {
  const guardianActive = isGuardianActive()

  return `
    <header class="fixed top-0 left-0 right-0 z-40 px-5 py-4 bg-dark-primary/60 backdrop-blur-xl border-b border-white/5" role="banner">
      <div class="flex items-center justify-between max-w-7xl mx-auto">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <img src="logo.png" alt="SpotHitch" class="w-9 h-9 rounded-xl object-cover" />
          <h1 class="font-display text-xl font-bold gradient-text">${t('appName')}</h1>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Admin Button (only for admins) -->
          ${state.isAdmin ? `
          <button
            onclick="openAdminPanel()"
            class="relative w-11 h-11 rounded-full bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 hover:scale-105 transition-colors flex items-center justify-center"
            aria-label="${t('adminPanel') || 'Panneau Admin'}"
            title="${t('adminPanel') || 'Panneau Admin'}"
          >
            ${icon('shield', 'w-5 h-5')}
            ${(state.adminReportsData || []).filter(r => r.status === 'pending').length > 0 ? `<span class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">${(state.adminReportsData || []).filter(r => r.status === 'pending').length}</span>` : ''}
          </button>
          ` : ''}
          <!-- Guardian Button -->
          ${guardianActive ? (() => {
            const secs = getTimeUntilNextCheckIn()
            const overdue = secs < 0
            const absSecs = Math.abs(secs)
            const mins = Math.floor(absSecs / 60)
            const sec = absSecs % 60
            const timeStr = `${overdue ? '-' : ''}${String(mins).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
            return `
            <button
              id="guardian-header-btn"
              onpointerdown="guardianBtnDown()"
              onpointerup="guardianBtnUp()"
              onpointerleave="guardianBtnCancel()"
              oncontextmenu="return false"
              class="flex items-center gap-1.5 px-2.5 py-2 rounded-full ${overdue ? 'bg-danger-500 shadow-danger-500/30 animate-pulse-subtle' : 'bg-emerald-500 shadow-emerald-500/30'} text-white font-bold text-xs shadow-lg hover:scale-105 transition-colors select-none touch-none"
              aria-label="${t('guardianActiveBtnHint') || 'Appuyer : check-in · Maintenir 2s : arrêter'}"
              title="${t('guardianActiveBtnHint') || 'Appuyer : check-in · Maintenir 2s : arrêter'}"
            >
              ${icon('shield', 'w-4 h-4')}
              <span class="tabular-nums">${timeStr}</span>
            </button>
            `
          })() : `
          <button
            onclick="showGuardianModal()"
            class="w-11 h-11 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 hover:scale-105 transition-colors flex items-center justify-center"
            aria-label="${t('guardianMode') || 'Mode Compagnon'}"
            title="${t('guardianMode') || 'Mode Compagnon'}"
          >
            ${icon('shield', 'w-5 h-5')}
          </button>
          `}
          <!-- SOS Button - Always visible, prominent -->
          <button
            onclick="openSOS()"
            class="flex items-center gap-1.5 px-4 py-3 rounded-full bg-danger-600 text-white font-bold text-xs shadow-lg shadow-danger-600/30 hover:bg-danger-700 hover:scale-105 transition-colors animate-pulse-subtle min-h-[44px]"
            aria-label="Mode urgence SOS. Partager ma position"
            title="Mode urgence SOS"
          >
            ${icon('triangle-alert', 'w-5 h-5')}
            <span>SOS</span>
          </button>
        </div>
      </div>

      <!-- Online/Offline indicator -->
      ${!state.isOnline ? `
        <div class="absolute bottom-0 left-0 right-0 bg-warning-500/20 text-warning-400 text-xs text-center py-1" role="status" aria-live="polite">
          ${icon('wifi-off', 'w-5 h-5 mr-1')}
          <span>${t('offlineMode') || 'Mode hors-ligne'}</span>
        </div>
      ` : ''}
    </header>
  `
}

export default { renderHeader }
