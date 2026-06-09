/**
 * GuideNudge Modal
 * Shown after a user creates a spot, inviting them to share travel tips for that country.
 * First-time only (controlled via localStorage spothitch_guide_nudge_seen).
 */

import { t } from '../../i18n/index.js'
import { icon } from '../../utils/icons.js'
import { escapeHTML } from '../../utils/sanitize.js'

export function renderGuideNudge(state) {
  if (!state.showGuideNudge || !state.pendingGuideCountry) return ''

  const country = state.pendingGuideCountry
  const countryName = escapeHTML(country.name || country.code)
  const countryFlag = escapeHTML(country.flag || '')

  const nudgeText = (t('guideNudgeText') || 'Tu as visité [pays]. Tu as des conseils pour les prochains voyageurs ?')
    .replace('[pays]', `${countryFlag} ${countryName}`)
    .replace('[country]', `${countryFlag} ${countryName}`)
    .replace('[Land]', `${countryFlag} ${countryName}`)
    .replace('[país]', `${countryFlag} ${countryName}`)

  return `
    <div
      class="fixed inset-0 z-50 flex items-end justify-center p-4"
      onclick="closeGuideNudge()"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-nudge-title"
      tabindex="0"
    >
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true"></div>
      <div
        class="relative modal-panel rounded-3xl w-full max-w-sm slide-up pb-safe"
        onclick="event.stopPropagation()"
      >
        <div class="p-6 space-y-4">
          <!-- Header -->
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-2xl">
                ${icon('book-open', 'w-6 h-6 text-emerald-400')}
              </div>
              <div>
                <h2 id="guide-nudge-title" class="text-lg font-bold">
                  ${escapeHTML(t('guideNudgeTitle') || 'Spot ajouté !')}
                </h2>
                <p class="text-xs text-emerald-400 font-medium">${countryFlag} ${countryName}</p>
              </div>
            </div>
            <button
              onclick="closeGuideNudge()"
              class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              aria-label="${escapeHTML(t('close') || 'Fermer')}"
            >
              ${icon('x', 'w-4 h-4')}
            </button>
          </div>

          <!-- Message -->
          <p class="text-sm text-slate-300 leading-relaxed">
            ${nudgeText}
          </p>

          <!-- Arrow indicator pointing toward Guides -->
          <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-500/10 border border-primary-500/20">
            ${icon('book-open', 'w-4 h-4 text-primary-400')}
            <span class="text-xs text-primary-300 font-medium">Guides</span>
            ${icon('arrow-right', 'w-4 h-4 text-primary-400')}
            <span class="text-xs text-slate-400">${escapeHTML(t('guideNudgeBtn') || 'Partager mes conseils')}</span>
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-2">
            <button
              onclick="acceptGuideNudge()"
              class="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              ${icon('book-open', 'w-4 h-4')}
              ${escapeHTML(t('guideNudgeBtn') || 'Partager mes conseils')}
            </button>
            <button
              onclick="closeGuideNudge()"
              class="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-medium text-sm transition-colors"
            >
              ${escapeHTML(t('guideNudgeLater') || 'Plus tard')}
            </button>
          </div>

          <!-- Don't show again — per-country or global -->
          <div class="pt-1 space-y-1.5">
            <button
              onclick="dismissGuideNudgeForCountry()"
              class="w-full text-[11px] text-slate-500 hover:text-slate-400 transition-colors py-1"
            >
              ${(t('guideNudgeDontShowCountry') || 'Ne plus afficher pour [pays]').replace('[pays]', countryName).replace('[country]', countryName).replace('[Land]', countryName).replace('[país]', countryName)}
            </button>
            <button
              onclick="dismissGuideNudgeGlobal()"
              class="w-full text-[10px] text-slate-600 hover:text-slate-500 transition-colors py-0.5"
            >
              ${escapeHTML(t('guideNudgeDontShow') || 'Ne plus afficher')}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
}

// ==================== HANDLERS ====================

window.closeGuideNudge = async () => {
  const { setState } = await import('../../stores/state.js')
  setState({ showGuideNudge: false })
}

// Dismiss for this specific country only — will re-appear for other countries
window.dismissGuideNudgeForCountry = async (countryCodeParam) => {
  const { getState, setState } = await import('../../stores/state.js')
  const code = getState().pendingGuideCountry?.code || countryCodeParam
  if (code) {
    try {
      const dismissed = JSON.parse(localStorage.getItem('spothitch_guide_nudge_countries') || '[]')
      if (!dismissed.includes(code)) dismissed.push(code)
      localStorage.setItem('spothitch_guide_nudge_countries', JSON.stringify(dismissed))
    } catch { /* no-op */ }
  }
  setState({ showGuideNudge: false, pendingGuideCountry: null })
}

// Dismiss globally — never show again for any country
window.dismissGuideNudgeGlobal = async () => {
  const { setState } = await import('../../stores/state.js')
  try { localStorage.setItem('spothitch_guide_nudge_seen', '1') } catch { /* no-op */ }
  setState({ showGuideNudge: false, pendingGuideCountry: null })
}

window.acceptGuideNudge = async () => {
  const { getState, setState } = await import('../../stores/state.js')
  const state = getState()
  const countryCode = state.pendingGuideCountry?.code || null
  setState({
    showGuideNudge: false,
    activeTab: 'voyage',
    activeSubTab: 'guides',
    guideSection: 'countries',
    selectedCountryGuide: countryCode,
  })
  window.changeTab?.('voyage')
}

export default { renderGuideNudge }
