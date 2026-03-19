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
import { t } from '../../i18n/index.js'

// ==================== VOTE CHOICES ====================

// Beta features: prioritize what to build
const VOTE_CHOICES_BETA = [
  { type: 'essential', emoji: '🔥', labelKey: 'voteEssential', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  { type: 'useful', emoji: '👍', labelKey: 'voteUseful', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { type: 'notUrgent', emoji: '🤷', labelKey: 'voteNotUrgent', color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
]

// Available features: quality feedback
const VOTE_CHOICES_AVAILABLE = [
  { type: 'love', emoji: '❤️', labelKey: 'voteLove', color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  { type: 'works', emoji: '✅', labelKey: 'voteWorks', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  { type: 'improve', emoji: '🛠️', labelKey: 'voteImprove', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
]

// All vote types for lookup
const ALL_VOTE_CHOICES = [...VOTE_CHOICES_BETA, ...VOTE_CHOICES_AVAILABLE]

// ==================== CONTENT RENDERER ====================

function renderContent(content, color) {
  return content.map(c => {
    switch (c.type) {
      case 'scenario':
        return `<div style="background:rgba(0,0,0,0.3);border-radius:10px;padding:8px 10px;margin-bottom:11px;text-align:left;border-left:2px solid ${color}">
          <p style="font-size:0.63rem;color:#cbd5e1;line-height:1.4;font-style:italic">${escapeHTML(c.text)}</p>
        </div>`

      case 'quote':
        return `<p style="font-size:0.66rem;color:#6b7280;font-style:italic;line-height:1.4;margin-bottom:10px">${escapeHTML(c.text)}</p>`

      case 'sub':
        return `<p style="font-size:0.68rem;color:#94a3b8;line-height:1.45;margin-bottom:12px">${escapeHTML(c.text)}</p>`

      case 'steps':
        return `<div style="text-align:left;margin-bottom:12px;display:flex;flex-direction:column;gap:6px">
          ${c.items.map((step, i) => `
            <div style="display:flex;gap:8px;align-items:flex-start">
              <div style="width:18px;height:18px;border-radius:50%;flex-shrink:0;margin-top:1px;display:flex;align-items:center;justify-content:center;font-size:0.55rem;font-weight:700;color:#fff;background:${c.color}">${i + 1}</div>
              <span style="font-size:0.65rem;color:#94a3b8;line-height:1.4">${escapeHTML(step)}</span>
            </div>
          `).join('')}
        </div>`

      case 'highlight':
        return `<div style="background:rgba(255,255,255,0.06);border-radius:10px;padding:8px 10px;margin-bottom:11px;text-align:left">
          <p style="font-size:0.64rem;font-weight:700;color:#fff;margin-bottom:3px">${escapeHTML(c.title)}</p>
          <p style="font-size:0.6rem;color:#94a3b8;line-height:1.4">${escapeHTML(c.desc)}</p>
        </div>`

      case 'highlights':
        return c.items.map(item => `
          <div style="background:rgba(255,255,255,0.06);border-radius:10px;padding:8px 10px;margin-bottom:8px;text-align:left">
            <p style="font-size:0.64rem;font-weight:700;color:#fff;margin-bottom:3px">${item.emoji ? item.emoji + ' ' : ''}${escapeHTML(item.title)}</p>
            <p style="font-size:0.6rem;color:#94a3b8;line-height:1.4">${escapeHTML(item.desc)}</p>
          </div>
        `).join('')

      case 'persona':
        return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:11px">
          <div style="width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:0.9rem;flex-shrink:0">${c.avatar}</div>
          <p style="font-size:0.6rem;color:#94a3b8;line-height:1.35;text-align:left"><span style="color:#fff;font-weight:600">${escapeHTML(c.name)}</span><br>${escapeHTML(c.desc)}</p>
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
    <div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin-bottom:14px">
      ${tags.map(tag => `<span style="font-size:0.58rem;padding:3px 7px;border-radius:10px;background:rgba(255,255,255,0.08);color:#94a3b8;border:1px solid rgba(255,255,255,0.08)">${escapeHTML(tag)}</span>`).join('')}
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
        class="intro-vote-btn"
        data-vote="${v.type}"
        data-featureid="${id}"
        aria-pressed="${isSel}"
        style="flex:1;padding:8px 4px;border-radius:10px;cursor:pointer;text-align:center;transition:all 0.15s;color:#fff;${style}">
        <span style="font-size:1.1rem;display:block">${v.emoji}</span>
        <span style="font-size:0.55rem;display:block;margin-top:2px;color:#94a3b8">${escapeHTML(t(v.labelKey) || v.type)}</span>
      </button>
    `
  }).join('')

  // Comment area (pre-filled if existing)
  const commentValue = existingVote?.comment || ''
  const commentDisplay = 'block'

  return `
    <div id="feature-intro-overlay"
      style="position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,0.75);backdrop-filter:blur(4px)"
      role="dialog" aria-modal="true" aria-labelledby="fi-title"
      onclick="if(event.target===this)closeFeatureIntro()">

      <div style="position:relative;width:100%;max-width:320px;max-height:90vh;overflow-y:auto;background:rgba(8,9,15,0.95);border-radius:28px;box-shadow:0 0 0 1px rgba(255,255,255,0.07),0 24px 60px rgba(0,0,0,0.9)">

        <!-- Glow background -->
        <div style="position:absolute;width:220px;height:220px;border-radius:50%;filter:blur(60px);opacity:0.25;top:0;left:50%;transform:translateX(-50%);pointer-events:none;background:${color}"></div>

        <!-- Close button -->
        <button onclick="closeFeatureIntro()"
          style="position:absolute;top:12px;right:12px;z-index:2;width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.1);border:none;cursor:pointer;color:#fff;font-size:0.75rem;display:flex;align-items:center;justify-content:center"
          aria-label="${escapeHTML(t('close') || 'Fermer')}">✕</button>

        <!-- Card content -->
        <div style="position:relative;z-index:1;padding:20px 16px 16px;text-align:center">

          <!-- Icon -->
          <div style="width:52px;height:52px;border-radius:15px;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;font-size:1.5rem;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05)">
            ${emoji}
          </div>

          <!-- Badge -->
          <span style="display:inline-block;font-size:0.58rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:3px 8px;border-radius:20px;margin-bottom:8px;border:1px solid;${badgeStyle}">${escapeHTML(badge)}</span>

          <!-- Name (function name) -->
          <h2 id="fi-title" style="color:#fff;font-size:1rem;font-weight:800;line-height:1.3;margin-bottom:4px">${escapeHTML(name || title)}</h2>

          <!-- Subtitle (tagline) -->
          ${name && title !== name ? `<p style="font-size:0.72rem;color:#94a3b8;line-height:1.4;margin-bottom:7px">${escapeHTML(title)}</p>` : ''}

          <!-- Dynamic content -->
          ${renderContent(content, color)}

          <!-- Tags -->
          ${tagsHTML}

          <!-- Divider -->
          <div style="height:1px;background:rgba(255,255,255,0.08);margin:10px 0 12px"></div>

          <!-- Vote section -->
          <p style="font-size:0.6rem;color:#64748b;margin-bottom:8px;text-align:left">${escapeHTML(status === 'available' ? (t('voteTitleAvailable') || 'Ton avis sur cette feature :') : (t('voteTitle') || 'Cette feature pour toi :'))}</p>
          <div style="display:flex;gap:4px;margin-bottom:8px">
            ${voteBtnsHTML}
          </div>

          <!-- Comment (visible after selecting a vote) -->
          <div id="intro-comment-area" style="display:${commentDisplay}">
            <textarea id="intro-vote-comment" rows="2"
              placeholder="${escapeHTML(t('voteCommentPlaceholder') || 'Un avis ? (optionnel)')}"
              class="intro-vote-textarea"
              style="width:100%;padding:8px 10px;border-radius:10px;font-size:0.7rem;color:#fff;resize:none;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);font-family:inherit;margin-bottom:8px"
              maxlength="300">${escapeHTML(commentValue)}</textarea>
            <button onclick="submitIntroVote('${id}')"
              id="intro-submit-btn"
              style="width:100%;padding:10px;border-radius:14px;font-size:0.75rem;font-weight:600;border:none;cursor:pointer;color:#fff;background:linear-gradient(135deg,#f59e0b,#d97706);transition:opacity 0.15s">
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

  const el = document.createElement('div')
  el.innerHTML = buildModalHTML(feature)
  const overlay = el.firstElementChild
  document.body.appendChild(overlay)

  // Trap focus on close button
  setTimeout(() => overlay.querySelector('button')?.focus(), 50)
}

window.closeFeatureIntro = () => {
  document.getElementById('feature-intro-overlay')?.remove()
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

// Keyboard close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.getElementById('feature-intro-overlay')) {
    window.closeFeatureIntro()
  }
})

// Delegate vote button clicks
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.intro-vote-btn')
  if (!btn) return
  const { vote, featureid } = btn.dataset
  if (vote && featureid) {
    window.selectIntroVote(vote, featureid)
  }
})
