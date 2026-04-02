/**
 * FeatureIntroModal — Feature detail card with 3-choice community voting
 * Replaces the old glassmorphism 5-reaction system with:
 *   🔥 Essentiel / 👍 Utile / 🤷 Pas urgent + comment + send
 *
 * All votes sync to Firebase via featureVotes.js service
 *
 * Usage:
 *   window.showFeatureIntro('carte')
 *   window.closeFeatureIntro()
 */

import { FEATURES_MAP } from '../../data/featuresData.js'
import { markFeatureSeen } from '../../services/featureIntro.js'
import { getUserVote, submitVote } from '../../services/featureVotes.js'
import { escapeHTML } from '../../utils/sanitize.js'
import { icon } from '../../utils/icons.js'
import { t } from '../../i18n/index.js'

// ==================== EMOJI → ICON CONVERTER ====================
const FEATURE_EMOJI_MAP = {
  '🗺️': 'map', '⛽': 'fuel', '📍': 'map-pin', '👤': 'user', '🤝': 'handshake',
  '💬': 'message-circle', '📔': 'notebook-pen', '📊': 'bar-chart-3', '🏆': 'trophy',
  '📈': 'trending-up', '💡': 'lightbulb', '💛': 'heart', '📴': 'wifi-off',
  '🚨': 'siren', '🧑‍🤝‍🧑': 'users', '🔔': 'bell', '👥': 'users', '🥇': 'medal',
  '📡': 'radio', '🧭': 'compass', '🎤': 'mic', '📚': 'book-open', '🛡️': 'shield-check',
  '🎉': 'party-popper', '🏨': 'building', '🏙️': 'building-2',
  '🔥': 'flame', '👍': 'thumbs-up', '🤷': 'help-circle', '❤️': 'heart',
  '✅': 'circle-check', '🛠️': 'wrench',
}
function featureIcon(emoji, size = 'w-5 h-5') {
  const name = FEATURE_EMOJI_MAP[emoji]
  if (name) return icon(name, `${size} text-current`)
  return `<span class="${size}">${emoji}</span>`
}

// ==================== VOTE CHOICES ====================

// Beta features: prioritize what to build
const VOTE_CHOICES_BETA = [
  { type: 'essential', iconName: 'flame', labelKey: 'voteEssential', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  { type: 'useful', iconName: 'thumbs-up', labelKey: 'voteUseful', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { type: 'notUrgent', iconName: 'help-circle', labelKey: 'voteNotUrgent', color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
]

// Available features: quality feedback
const VOTE_CHOICES_AVAILABLE = [
  { type: 'love', iconName: 'heart', labelKey: 'voteLove', color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  { type: 'works', iconName: 'circle-check', labelKey: 'voteWorks', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  { type: 'improve', iconName: 'wrench', labelKey: 'voteImprove', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
]

// All vote types for lookup
const ALL_VOTE_CHOICES = [...VOTE_CHOICES_BETA, ...VOTE_CHOICES_AVAILABLE]

// ==================== CONTENT RENDERER ====================

function renderContent(content, color) {
  return content.map(c => {
    switch (c.type) {
      case 'scenario':
        return `<div class="bg-black/30 rounded-[10px] px-2.5 py-2 mb-[11px] text-left border-l-2" style="border-left-color:${color}">
          <p class="text-[0.63rem] text-slate-300 leading-[1.4] italic">${escapeHTML(c.text)}</p>
        </div>`

      case 'quote':
        return `<p class="text-[0.66rem] text-gray-500 italic leading-[1.4] mb-2.5">${escapeHTML(c.text)}</p>`

      case 'sub':
        return `<p class="text-[0.68rem] text-slate-400 leading-[1.45] mb-3">${escapeHTML(c.text)}</p>`

      case 'steps':
        return `<div class="text-left mb-3 flex flex-col gap-1.5">
          ${c.items.map((step, i) => `
            <div class="flex gap-2 items-start">
              <div class="w-[18px] h-[18px] rounded-full shrink-0 mt-px flex items-center justify-center text-[0.55rem] font-bold text-white" style="background:${c.color}">${i + 1}</div>
              <span class="text-[0.65rem] text-slate-400 leading-[1.4]">${escapeHTML(step)}</span>
            </div>
          `).join('')}
        </div>`

      case 'highlight':
        return `<div class="bg-white/[0.06] rounded-[10px] px-2.5 py-2 mb-[11px] text-left">
          <p class="text-[0.64rem] font-bold text-white mb-0.5">${escapeHTML(c.title)}</p>
          <p class="text-[0.6rem] text-slate-400 leading-[1.4]">${escapeHTML(c.desc)}</p>
        </div>`

      case 'highlights':
        return c.items.map(item => `
          <div class="bg-white/[0.06] rounded-[10px] px-2.5 py-2 mb-2 text-left">
            <p class="text-[0.64rem] font-bold text-white mb-0.5">${item.emoji ? featureIcon(item.emoji, 'w-3 h-3 inline') + ' ' : ''}${escapeHTML(item.title)}</p>
            <p class="text-[0.6rem] text-slate-400 leading-[1.4]">${escapeHTML(item.desc)}</p>
          </div>
        `).join('')

      case 'persona':
        return `<div class="flex items-center gap-2 mb-[11px]">
          <div class="w-[30px] h-[30px] rounded-full bg-white/[0.08] flex items-center justify-center text-[0.9rem] shrink-0">${c.avatar}</div>
          <p class="text-[0.6rem] text-slate-400 leading-[1.35] text-left"><span class="text-white font-semibold">${escapeHTML(c.name)}</span><br>${escapeHTML(c.desc)}</p>
        </div>`

      default:
        return ''
    }
  }).join('')
}

// ==================== MODAL HTML ====================

function buildModalHTML(feature) {
  const { id, emoji, name, title, status, color, badge, content, tags } = feature
  const existingVote = getUserVote(id)
  const selectedVote = existingVote?.vote || null

  const tagsHTML = tags && tags.length > 0 ? `
    <div class="flex flex-wrap gap-1 justify-center mb-3.5">
      ${tags.map(tag => `<span class="text-[0.58rem] px-[7px] py-[3px] rounded-[10px] bg-white/[0.08] text-slate-400 border border-white/[0.08]">${escapeHTML(tag)}</span>`).join('')}
    </div>
  ` : ''

  const badgeStyle = status === 'available'
    ? 'color:#10b981;border-color:#10b981'
    : `color:${color};border-color:${color}`

  // Vote buttons — different for available vs beta
  const voteChoices = status === 'available' ? VOTE_CHOICES_AVAILABLE : VOTE_CHOICES_BETA
  const voteBtnsHTML = voteChoices.map(v => {
    const isSel = selectedVote === v.type
    const style = isSel
      ? `border:2px solid ${v.color};background:${v.bg};`
      : 'border:2px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);'
    return `
      <button
        class="intro-vote-btn flex-1 py-2 px-1 rounded-[10px] cursor-pointer text-center transition-all duration-150 text-white"
        data-vote="${v.type}"
        data-featureid="${id}"
        aria-pressed="${isSel}"
        style="${style}">
        <span class="block">${icon(v.iconName, 'w-5 h-5 mx-auto')}</span>
        <span class="text-[0.55rem] block mt-0.5 text-slate-400">${escapeHTML(t(v.labelKey) || v.type)}</span>
      </button>
    `
  }).join('')

  // Comment area (pre-filled if existing)
  const commentValue = existingVote?.comment || ''
  const commentDisplay = 'block'

  return `
    <div id="feature-intro-overlay"
      class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog" aria-modal="true" aria-labelledby="fi-title"
      onclick="if(event.target===this)closeFeatureIntro()">

      <div class="relative w-full max-w-[320px] max-h-[90vh] overflow-y-auto bg-[rgba(8,9,15,0.95)] rounded-[28px] shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_24px_60px_rgba(0,0,0,0.9)]">

        <!-- Glow background -->
        <div class="absolute w-[220px] h-[220px] rounded-full blur-[60px] opacity-25 top-0 left-1/2 -translate-x-1/2 pointer-events-none" style="background:${color}"></div>

        <!-- Close button -->
        <button onclick="closeFeatureIntro()"
          class="absolute top-3 right-3 z-[2] w-7 h-7 rounded-full bg-white/10 border-none cursor-pointer text-white text-xs flex items-center justify-center"
          aria-label="${escapeHTML(t('close') || 'Fermer')}">✕</button>

        <!-- Card content -->
        <div class="relative z-[1] pt-5 px-4 pb-4 text-center">

          <!-- Icon -->
          <div class="w-[52px] h-[52px] rounded-[15px] flex items-center justify-center mx-auto mb-2.5 text-2xl border border-white/10 bg-white/5">
            ${emoji}
          </div>

          <!-- Badge -->
          <span class="inline-block text-[0.58rem] font-bold tracking-widest uppercase px-2 py-[3px] rounded-full mb-2 border" style="${badgeStyle}">${escapeHTML(badge)}</span>

          <!-- Name (function name) -->
          <h2 id="fi-title" class="text-white text-base font-extrabold leading-[1.3] mb-1">${escapeHTML(name || title)}</h2>

          <!-- Subtitle (tagline) -->
          ${name && title !== name ? `<p class="text-[0.72rem] text-slate-400 leading-[1.4] mb-[7px]">${escapeHTML(title)}</p>` : ''}

          <!-- Dynamic content -->
          ${renderContent(content, color)}

          <!-- Tags -->
          ${tagsHTML}

          <!-- Divider -->
          <div class="h-px bg-white/[0.08] my-2.5 mb-3"></div>

          <!-- Vote section -->
          <p class="text-[0.6rem] text-slate-500 mb-2 text-left">${escapeHTML(status === 'available' ? (t('voteTitleAvailable') || 'Ton avis sur cette feature :') : (t('voteTitle') || 'Cette feature pour toi :'))}</p>
          <div class="flex gap-1 mb-2">
            ${voteBtnsHTML}
          </div>

          <!-- Comment (visible after selecting a vote) -->
          <div id="intro-comment-area" style="display:${commentDisplay}">
            <textarea id="intro-vote-comment" rows="2"
              placeholder="${escapeHTML(t('voteCommentPlaceholder') || 'Un avis ? (optionnel)')}"
              class="intro-vote-textarea w-full px-2.5 py-2 rounded-[10px] text-[0.7rem] text-white resize-none bg-white/[0.08] border border-white/15 font-sans mb-2"
              maxlength="300">${escapeHTML(commentValue)}</textarea>
            <button onclick="submitIntroVote('${id}')"
              id="intro-submit-btn"
              class="w-full py-2.5 rounded-[14px] text-xs font-semibold border-none cursor-pointer text-white bg-gradient-to-br from-amber-500 to-amber-600 transition-opacity duration-150">
              ${escapeHTML(t('voteSend') || 'Envoyer mon vote')}
            </button>
          </div>

        </div>
      </div>
    </div>
  `
}

// ==================== WINDOW HANDLERS ====================

window.showFeatureIntro = (featureId) => {
  const feature = FEATURES_MAP[featureId]
  if (!feature) return

  // Remove any existing overlay
  document.getElementById('feature-intro-overlay')?.remove()

  // Re-attach global listeners (removed on close to prevent leaks)
  document.removeEventListener('keydown', _featureIntroKeydown)
  document.removeEventListener('click', _featureIntroClick)
  document.addEventListener('keydown', _featureIntroKeydown)
  document.addEventListener('click', _featureIntroClick)

  const el = document.createElement('div')
  el.innerHTML = buildModalHTML(feature)
  const overlay = el.firstElementChild
  document.body.appendChild(overlay)

  // Trap focus on close button
  setTimeout(() => overlay.querySelector('button')?.focus(), 50)
}

window.closeFeatureIntro = () => {
  document.getElementById('feature-intro-overlay')?.remove()
  // Remove global listeners to prevent memory leaks; re-attached on next show
  cleanupFeatureIntroListeners()
}

window.featureIntroCTA = (featureId) => {
  const feature = FEATURES_MAP[featureId]
  if (!feature) return

  markFeatureSeen(featureId)
  window.closeFeatureIntro()

  // Call the action handler
  if (feature.btnAction) {
    if (feature.btnArg !== undefined) {
      window[feature.btnAction]?.(feature.btnArg)
    } else {
      window[feature.btnAction]?.()
    }
  }
}

window.featureIntroBetaCTA = (_featureId) => {
  window.closeFeatureIntro()
  setTimeout(() => {
    window.openFeedbackPanel?.()
  }, 200)
}

// Select a vote choice (single select — updates DOM directly)
window.selectIntroVote = (voteType, _featureId) => {
  const overlay = document.getElementById('feature-intro-overlay')
  if (!overlay) return

  // Update button styles
  overlay.querySelectorAll('.intro-vote-btn').forEach(btn => {
    const bType = btn.dataset.vote
    const v = ALL_VOTE_CHOICES.find(vc => vc.type === bType)
    if (!v) return
    const isSel = bType === voteType
    btn.style.border = isSel ? `2px solid ${v.color}` : '2px solid rgba(255,255,255,0.06)'
    btn.style.background = isSel ? v.bg : 'rgba(255,255,255,0.02)'
    btn.setAttribute('aria-pressed', String(isSel))
  })

  // Show comment area
  const commentArea = overlay.querySelector('#intro-comment-area')
  if (commentArea) commentArea.style.display = 'block'

  // Store selected vote type in a data attribute
  overlay.dataset.selectedVote = voteType
}

// Submit the vote + comment via featureVotes.js
window.submitIntroVote = async (featureId) => {
  const overlay = document.getElementById('feature-intro-overlay')
  if (!overlay) return

  const voteType = overlay.dataset.selectedVote
  if (!voteType) return

  const comment = overlay.querySelector('#intro-vote-comment')?.value || ''

  // Submit to Firebase via featureVotes service
  await submitVote(featureId, voteType, comment)

  // Visual feedback
  const btn = overlay.querySelector('#intro-submit-btn')
  if (btn) {
    btn.textContent = '✓ ' + (t('voteSent') || 'Merci !')
    btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)'
  }

  if (window.showToast) {
    window.showToast(t('voteSent') || 'Merci pour ton vote !', 'success')
  }

  // Close after 1.2s
  setTimeout(() => {
    window.closeFeatureIntro()
    if (window._forceRender) window._forceRender()
  }, 1200)
}

// Named handlers for cleanup
function _featureIntroKeydown(e) {
  if (e.key === 'Escape' && document.getElementById('feature-intro-overlay')) {
    window.closeFeatureIntro()
  }
}

function _featureIntroClick(e) {
  const btn = e.target.closest('.intro-vote-btn')
  if (!btn) return
  const { vote, featureid } = btn.dataset
  if (vote && featureid) {
    window.selectIntroVote(vote, featureid)
  }
}

// Listeners are registered on modal open (showFeatureIntro) and removed on close
// to prevent memory leaks from persistent global listeners

/**
 * Cleanup global event listeners (call when modal is no longer needed)
 */
export function cleanupFeatureIntroListeners() {
  document.removeEventListener('keydown', _featureIntroKeydown)
  document.removeEventListener('click', _featureIntroClick)
}
