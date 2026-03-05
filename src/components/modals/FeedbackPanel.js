/**
 * Feedback Panel — Side sliding panel showing all features with unified voting
 * Uses FEATURES_DATA from featuresData.js (single source of truth)
 * Clicking any feature opens FeatureIntroModal with 3-choice voting
 */

import { setState } from '../../stores/state.js'
import { t } from '../../i18n/index.js'
import { escapeHTML, escapeJSString } from '../../utils/sanitize.js'
import { FEATURES_DATA } from '../../data/featuresData.js'
import { getUserVote, getAllUserVotes } from '../../services/featureVotes.js'

// ==================== TAB MAPPING ====================
// Map featuresData IDs to feedback tabs

const FEATURE_TAB_MAP = {
  'carte': 'carte', 'stations': 'carte', 'add-spot': 'carte', 'hors-ligne': 'carte',
  'itineraire': 'carte', 'radar': 'carte', 'notif-spot': 'carte', 'villes': 'carte',
  'carnet': 'voyage', 'stats': 'voyage', 'classements': 'voyage', 'niveaux': 'voyage',
  'conseils': 'voyage', 'defis': 'voyage', 'quiz': 'voyage', 'guides': 'voyage',
  'auberges': 'voyage', 'evenements': 'voyage',
  'amis': 'social', 'chat': 'social', 'compagnon': 'social', 'activite-amis': 'social',
  'avis-profils': 'social',
  'profil': 'profil', 'dons': 'profil', 'score-confiance': 'profil',
  'sos': 'securite', 'gardien': 'securite',
}

const TABS = [
  { id: 'carte', emoji: '🗺️', labelKey: 'fbTabCarte' },
  { id: 'voyage', emoji: '🧭', labelKey: 'fbTabVoyage' },
  { id: 'social', emoji: '👥', labelKey: 'fbTabSocial' },
  { id: 'profil', emoji: '👤', labelKey: 'fbTabProfil' },
  { id: 'securite', emoji: '🛡️', labelKey: 'fbTabSecurite' },
]

// Vote type to display info
const VOTE_DISPLAY = {
  essential: { emoji: '🔥', color: '#ef4444' },
  useful: { emoji: '👍', color: '#f59e0b' },
  notUrgent: { emoji: '🤷', color: '#6b7280' },
}

// ==================== RENDER HELPERS ====================

function renderFeatureItem(feat) {
  const userVote = getUserVote(feat.id)
  const hasVoted = !!userVote

  const statusTag = feat.status === 'available'
    ? `<span style="font-size:10px;font-weight:700;padding:1px 6px;border-radius:6px;background:rgba(34,197,94,0.12);color:#22c55e">${escapeHTML(t('fbStatusAvailable') || 'Dispo')}</span>`
    : `<span style="font-size:10px;font-weight:700;padding:1px 6px;border-radius:6px;background:rgba(245,158,11,0.12);color:#f59e0b">${escapeHTML(t('fbStatusComing') || 'Bientôt')}</span>`

  const voteTag = hasVoted
    ? `<span style="font-size:10px;padding:1px 6px;border-radius:6px;background:${VOTE_DISPLAY[userVote.vote]?.color || '#6b7280'}20;color:${VOTE_DISPLAY[userVote.vote]?.color || '#6b7280'}">${VOTE_DISPLAY[userVote.vote]?.emoji || ''} ${escapeHTML(t('fbVoted') || 'Voté')}</span>`
    : ''

  const checkStyle = hasVoted
    ? 'border:2px solid #22c55e;background:rgba(34,197,94,0.15);color:#22c55e'
    : 'border:2px solid rgba(255,255,255,0.1)'

  return `
    <div class="flex items-center gap-2.5 px-4 py-2.5 cursor-pointer transition-colors relative"
      style="border-bottom:1px solid rgba(255,255,255,0.03)"
      onclick="showFeatureIntro('${escapeJSString(feat.id)}')" role="button" tabindex="0">
      <div class="text-xl w-9 h-9 flex items-center justify-center rounded-[10px] shrink-0" style="background:rgba(255,255,255,0.04)">${feat.emoji}</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1.5 text-[13px] font-semibold">${escapeHTML(feat.title)} ${statusTag}</div>
        <div class="flex items-center gap-1.5 mt-0.5">${voteTag}</div>
      </div>
      ${!hasVoted ? '<div class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-soft shrink-0" style="margin-right:4px"></div>' : ''}
      <div class="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 text-[11px] transition-all" style="${checkStyle}">${hasVoted ? '✓' : ''}</div>
    </div>
  `
}

// ==================== MAIN PANEL ====================

export function renderFeedbackPanel(state) {
  const activeTab = state.feedbackActiveTab || 'carte'
  const detailId = state.feedbackDetailFeature

  // Legacy detail view redirect → show FeatureIntroModal instead
  if (detailId) {
    setTimeout(() => {
      window.showFeatureIntro?.(detailId)
      setState({ feedbackDetailFeature: null })
    }, 50)
  }

  const allVotes = getAllUserVotes()
  const votedIds = Object.keys(allVotes)
  const total = FEATURES_DATA.length
  const done = FEATURES_DATA.filter(f => votedIds.includes(f.id)).length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  // Filter features by active tab
  const tabFeatures = FEATURES_DATA.filter(f => FEATURE_TAB_MAP[f.id] === activeTab)
  const available = tabFeatures.filter(f => f.status === 'available')
  const beta = tabFeatures.filter(f => f.status === 'beta')

  return `
    <div class="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="fb-panel-title">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="if(event.target===this)closeFeedbackPanel()" aria-hidden="true"></div>
      <div class="absolute top-0 right-0 bottom-0 w-[88%] max-w-md overflow-hidden flex flex-col shadow-2xl slide-panel-in" style="z-index:50;background:#1e293b">

        <!-- Header -->
        <div class="shrink-0 relative" style="padding:54px 16px 12px;background:linear-gradient(135deg,rgba(99,102,241,0.12),rgba(168,85,247,0.08))">
          <button onclick="closeFeedbackPanel()" class="absolute right-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-base" style="top:50px;background:rgba(255,255,255,0.1)" aria-label="${escapeHTML(t('close') || 'Fermer')}">✕</button>
          <h2 id="fb-panel-title" class="text-lg font-extrabold">${escapeHTML(t('fbTitle') || 'Aide & Feedback')}</h2>
          <p class="text-xs mt-0.5" style="color:#94a3b8">${escapeHTML(t('fbSubtitle') || 'Vote pour les features que tu veux !')}</p>
          <div class="flex items-center gap-2 mt-2.5">
            <div class="flex-1 h-1 rounded-sm overflow-hidden" style="background:rgba(255,255,255,0.1)">
              <div class="h-full rounded-sm transition-all duration-500" style="width:${pct}%;background:linear-gradient(90deg,#22c55e,#10b981)"></div>
            </div>
            <span class="text-[11px] font-semibold whitespace-nowrap" style="color:#94a3b8">${done}/${total} ${escapeHTML(t('fbProgressText') || 'votes')}</span>
          </div>
        </div>

        <!-- Tab pills -->
        <div class="flex gap-1.5 px-4 py-3 overflow-x-auto shrink-0" style="-webkit-overflow-scrolling:touch">
          ${TABS.map(tab => {
            const isActive = tab.id === activeTab
            const tabFeats = FEATURES_DATA.filter(f => FEATURE_TAB_MAP[f.id] === tab.id)
            const allTabVoted = tabFeats.every(f => votedIds.includes(f.id))
            const hasUnvoted = tabFeats.some(f => !votedIds.includes(f.id))
            const selStyle = isActive
              ? 'background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.3);color:#f59e0b'
              : 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:#94a3b8'
            return `
              <button onclick="setFeedbackTab('${tab.id}')"
                class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 relative transition-all cursor-pointer"
                style="${selStyle}"
                aria-pressed="${isActive}">
                ${tab.emoji} ${escapeHTML(t(tab.labelKey) || tab.id)}
                ${hasUnvoted && !allTabVoted ? '<span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-soft"></span>' : ''}
                ${allTabVoted ? '<span class="text-[10px]">✓</span>' : ''}
              </button>
            `
          }).join('')}
        </div>

        <!-- Feature list -->
        <div class="flex-1 overflow-y-auto pb-5">
          ${available.length > 0 ? `
            <div class="text-[10px] font-bold uppercase tracking-widest px-4 pt-3 pb-1.5" style="color:#64748b;letter-spacing:1.5px">✅ ${escapeHTML(t('fbSectionAvailable') || 'Disponible')}</div>
            ${available.map(feat => renderFeatureItem(feat)).join('')}
          ` : ''}
          ${beta.length > 0 ? `
            <div class="text-[10px] font-bold uppercase tracking-widest px-4 pt-3 pb-1.5" style="color:#64748b;letter-spacing:1.5px">🔜 ${escapeHTML(t('fbSectionComing') || 'À venir')}</div>
            ${beta.map(feat => renderFeatureItem(feat)).join('')}
          ` : ''}
        </div>
      </div>
    </div>
  `
}

// ==================== HANDLERS ====================

window.setFeedbackTab = (tab) => {
  setState({ feedbackActiveTab: tab })
}

window.openFeedbackDetail = (featureId) => {
  // Redirect to FeatureIntroModal
  window.showFeatureIntro?.(featureId)
}

window.closeFeedbackDetail = () => {
  setState({ feedbackDetailFeature: null })
}

// Legacy redirect — old submitFeedback opens FeatureIntro
window.submitFeedback = (featureId) => {
  window.showFeatureIntro?.(featureId)
}
