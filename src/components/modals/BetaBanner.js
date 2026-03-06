/**
 * Alpha Banner + Welcome Popup
 * - Small persistent banner at top: "Version alpha"
 * - First-visit popup explaining the alpha + where to give feedback
 * - localStorage key: spothitch_beta_seen (popup shown once only)
 */

import { t } from '../../i18n/index.js'

const BETA_SEEN_KEY = 'spothitch_beta_seen'

function hasSeen() {
  return localStorage.getItem(BETA_SEEN_KEY) === '1'
}

/**
 * Render the alpha banner (small top banner) + popup if first visit
 */
export function renderBetaBanner() {
  const showPopup = !hasSeen()

  const banner = `
    <div id="beta-banner"
      class="fixed top-0 left-0 right-0 z-40 text-center py-1 text-xs font-bold"
      style="background: linear-gradient(90deg, #f59e0b, #fb923c); color: #000">
      ${t('betaBannerText') || 'Version alpha. Aide-nous \u00e0 am\u00e9liorer SpotHitch !'}
    </div>`

  if (!showPopup) return banner

  const popup = `
    <div id="alpha-welcome-overlay" class="fixed inset-0 z-50 flex items-center justify-center p-4"
      onclick="closeBetaPopup()" role="dialog" aria-modal="true" tabindex="0">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true"></div>
      <div id="beta-popup-card" class="relative rounded-2xl max-w-sm w-full p-6 shadow-2xl"
        style="background: #0f172a; border: 2px solid #f59e0b; box-shadow: 0 0 30px rgba(245,158,11,0.25), 0 0 60px rgba(245,158,11,0.1)"
        onclick="event.stopPropagation()">

        <!-- Header -->
        <div class="text-center mb-5">
          <div class="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
            style="background: linear-gradient(180deg, #fbbf24, #f59e0b)">
            <span class="text-2xl font-black text-black">A</span>
          </div>
          <h2 class="text-xl font-bold text-white mb-2">
            ${t('betaPopupTitle') || 'Bienvenue sur SpotHitch'}
          </h2>
          <div class="inline-block px-3 py-1 rounded-full text-xs font-bold"
            style="background: linear-gradient(90deg, #f59e0b, #fb923c); color: #000">
            ${t('betaPopupBadge') || 'VERSION ALPHA'}
          </div>
        </div>

        <!-- Explanation -->
        <div class="mb-5">
          <p class="text-sm text-slate-200 leading-relaxed">
            ${t('betaPopupExplain') || 'Tu fais partie des tout premiers testeurs. L\'app est encore jeune et contient pas mal de bugs. C\'est normal, on construit ensemble.'}
          </p>
        </div>

        <!-- Feedback card -->
        <div class="p-4 mb-5 rounded-xl" style="background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.25)">
          <p class="text-sm font-bold text-amber-400 mb-2">
            ${t('betaPopupFeedbackTitle') || 'Ton avis compte'}
          </p>
          <p class="text-xs text-slate-300 mb-3">
            ${t('betaPopupFeedbackDesc') || 'Chaque bug que tu signales nous aide \u00e0 am\u00e9liorer l\'app.'}
          </p>
          <div class="space-y-1.5">
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
              <span class="text-xs text-slate-300">${t('betaPopupBugs') || 'Signaler un bug'}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
              <span class="text-xs text-slate-300">${t('betaPopupIdeas') || 'Proposer une id\u00e9e'}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
              <span class="text-xs text-slate-300">${t('betaPopupLike') || 'Dire ce que tu aimes'}</span>
            </div>
          </div>
          <p class="text-[11px] text-slate-400 mt-3">
            ${t('betaPopupFeedbackHint') || 'Bouton "Avis" sur le c\u00f4t\u00e9 gauche'}
          </p>
        </div>

        <!-- CTA -->
        <button onclick="closeBetaPopup()"
          class="w-full py-3 rounded-xl font-bold text-black text-sm cursor-pointer"
          style="background: linear-gradient(90deg, #f59e0b, #fb923c)">
          ${t('betaPopupCTA') || 'C\'est parti, je teste !'}
        </button>
      </div>
    </div>`

  return banner + popup
}

// ==================== HANDLERS ====================

window.closeBetaPopup = () => {
  localStorage.setItem(BETA_SEEN_KEY, '1')
  const overlay = document.getElementById('alpha-welcome-overlay')
  if (overlay) overlay.remove()
}

export default { renderBetaBanner }
