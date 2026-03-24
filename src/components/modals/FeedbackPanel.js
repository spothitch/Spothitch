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
  love: { emoji: '❤️', color: '#ec4899' },
  works: { emoji: '✅', color: '#22c55e' },
  improve: { emoji: '🛠️', color: '#f59e0b' },
}

// ==================== RENDER HELPERS ====================

function renderFeatureItem(feat) {
  const userVote = getUserVote(feat.id)
  const hasVoted = !!userVote

  const statusTag = feat.status === 'available'
    ? `<span class="text-[10px] font-bold px-1.5 py-px rounded-md bg-emerald-500/12 text-emerald-500">${escapeHTML(t('fbStatusAvailable') || 'Dispo')}</span>`
    : `<span class="text-[10px] font-bold px-1.5 py-px rounded-md bg-amber-500/12 text-amber-500">${escapeHTML(t('fbStatusComing') || 'Bientôt')}</span>`

  const voteTag = hasVoted
    ? `<span class="text-[10px] px-1.5 py-px rounded-md" style="background:${VOTE_DISPLAY[userVote.vote]?.color || '#6b7280'}20;color:${VOTE_DISPLAY[userVote.vote]?.color || '#6b7280'}">${VOTE_DISPLAY[userVote.vote]?.emoji || ''} ${escapeHTML(t('fbVoted') || 'Voté')}</span>`
    : ''

  const checkClass = hasVoted
    ? 'border-2 border-emerald-500 bg-emerald-500/15 text-emerald-500'
    : 'border-2 border-white/10'

  return `
    <div class="flex items-center gap-2.5 px-4 py-2.5 cursor-pointer transition-colors relative border-b border-white/[0.03]"
      onclick="showFeatureIntro('${escapeJSString(feat.id)}')" role="button" tabindex="0">
      <div class="text-xl w-9 h-9 flex items-center justify-center rounded-[10px] shrink-0 bg-white/[0.04]">${feat.emoji}</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1.5 text-[13px] font-semibold">${escapeHTML(feat.name || feat.title)} ${statusTag}</div>
        <div class="flex items-center gap-1.5 mt-0.5">${voteTag}</div>
      </div>
      ${!hasVoted ? '<div class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-soft shrink-0 mr-1"></div>' : ''}
      <div class="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 text-[11px] transition-all ${checkClass}">${hasVoted ? '✓' : ''}</div>
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
      <div class="absolute top-0 right-0 bottom-0 w-[88%] max-w-md overflow-hidden flex flex-col shadow-2xl slide-panel-in z-50 bg-slate-800">

        <!-- Header -->
        <div class="shrink-0 relative pt-[54px] px-4 pb-3 bg-gradient-to-br from-indigo-500/12 to-purple-500/8">
          <button onclick="closeFeedbackPanel()" class="absolute right-3 top-[50px] w-8 h-8 rounded-full flex items-center justify-center text-white text-base bg-white/10" aria-label="${escapeHTML(t('close') || 'Fermer')}">✕</button>
          <h2 id="fb-panel-title" class="text-lg font-extrabold">${escapeHTML(t('fbTitle') || 'Aide & Feedback')}</h2>
          <p class="text-xs mt-0.5 text-slate-400">${escapeHTML(t('fbSubtitle') || 'Vote pour les features que tu veux !')}</p>
          <div class="flex items-center gap-2 mt-2.5">
            <div class="flex-1 h-1 rounded-sm overflow-hidden bg-white/10">
              <div class="h-full rounded-sm transition-all duration-500 bg-gradient-to-r from-emerald-500 to-emerald-600" style="width:${pct}%"></div>
            </div>
            <span class="text-[11px] font-semibold whitespace-nowrap text-slate-400">${done}/${total} ${escapeHTML(t('fbProgressText') || 'votes')}</span>
          </div>
        </div>

        <!-- Tab pills -->
        <div class="flex gap-1.5 pl-4 pr-8 py-3 overflow-x-auto shrink-0 scrollbar-none">
          ${TABS.map(tab => {
            const isActive = tab.id === activeTab
            const tabFeats = FEATURES_DATA.filter(f => FEATURE_TAB_MAP[f.id] === tab.id)
            const allTabVoted = tabFeats.every(f => votedIds.includes(f.id))
            const hasUnvoted = tabFeats.some(f => !votedIds.includes(f.id))
            const selClass = isActive
              ? 'bg-amber-500/12 border border-amber-500/30 text-amber-500'
              : 'bg-white/[0.04] border border-white/[0.08] text-slate-400'
            return `
              <button onclick="setFeedbackTab('${tab.id}')"
                class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 relative transition-all cursor-pointer ${selClass}"
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
            <div class="text-[10px] font-bold uppercase tracking-[1.5px] px-4 pt-3 pb-1.5 text-slate-500">✅ ${escapeHTML(t('fbSectionAvailable') || 'Disponible')}</div>
            ${available.map(feat => renderFeatureItem(feat)).join('')}
          ` : ''}
          ${beta.length > 0 ? `
            <div class="text-[10px] font-bold uppercase tracking-[1.5px] px-4 pt-3 pb-1.5 text-slate-500">🔜 ${escapeHTML(t('fbSectionComing') || 'À venir')}</div>
            ${beta.map(feat => renderFeatureItem(feat)).join('')}
          ` : ''}
        </div>
      </div>
    </div>
  `
}

// ==================== HANDLERS ====================

window.setFeedbackTab = (tab) => {
  // Update state silently (no full re-render — avoids flash)
  setState({ feedbackActiveTab: tab, _skipRender: true })
  // Update DOM directly for instant tab switch
  _updateFeedbackTabDOM(tab)
}

function _updateFeedbackTabDOM(activeTab) {
  const panel = document.querySelector('.slide-panel-in')
  if (!panel) return

  // Update tab pills (active state)
  const pills = panel.querySelectorAll('[onclick*=setFeedbackTab]')
  for (const pill of pills) {
    const match = pill.getAttribute('onclick')?.match(/setFeedbackTab\('(\w+)'\)/)
    if (!match) continue
    const isActive = match[1] === activeTab
    pill.className = pill.className
      .replace(/bg-amber-500\/12 border border-amber-500\/30 text-amber-500/g, '')
      .replace(/bg-white\/\[0\.04\] border border-white\/\[0\.08\] text-slate-400/g, '')
    pill.classList.add(...(isActive
      ? ['bg-amber-500/12', 'border', 'border-amber-500/30', 'text-amber-500']
      : ['bg-white/[0.04]', 'border', 'border-white/[0.08]', 'text-slate-400']))
    pill.setAttribute('aria-pressed', String(isActive))
  }

  // Update feature list
  const listContainer = panel.querySelector('.overflow-y-auto')
  if (!listContainer) return

  const tabFeatures = FEATURES_DATA.filter(f => FEATURE_TAB_MAP[f.id] === activeTab)
  const available = tabFeatures.filter(f => f.status === 'available')
  const beta = tabFeatures.filter(f => f.status === 'beta')

  let html = ''
  if (available.length > 0) {
    html += `<div class="text-[10px] font-bold uppercase tracking-[1.5px] px-4 pt-3 pb-1.5 text-slate-500">✅ ${escapeHTML(t('fbSectionAvailable') || 'Disponible')}</div>`
    html += available.map(feat => renderFeatureItem(feat)).join('')
  }
  if (beta.length > 0) {
    html += `<div class="text-[10px] font-bold uppercase tracking-[1.5px] px-4 pt-3 pb-1.5 text-slate-500">🔜 ${escapeHTML(t('fbSectionComing') || 'À venir')}</div>`
    html += beta.map(feat => renderFeatureItem(feat)).join('')
  }
  listContainer.innerHTML = html
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
