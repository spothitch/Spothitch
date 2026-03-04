/**
 * FeatureIntroModal — Glassmorphism intro card shown on first use of a feature
 * Also used by FeedbackPanel & Roadmap when user clicks a feature
 *
 * Usage:
 *   window.showFeatureIntro('carte')
 *   window.closeFeatureIntro()
 *
 * Design based on design-mockups/coming-soon-final.html
 */

import { FEATURES_MAP } from '../../data/featuresData.js'
import { markFeatureSeen } from '../../services/featureIntro.js'
import { escapeHTML } from '../../utils/sanitize.js'
import { t } from '../../i18n/index.js'

// ==================== REACTIONS ====================

const REACTIONS = [
  { type: 'like', emoji: '👍', label: 'Utile', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  { type: 'love', emoji: '❤️', label: 'J\'adore', color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
  { type: 'idea', emoji: '💡', label: 'Idée', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { type: 'bug', emoji: '🐛', label: 'Bug', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  { type: 'question', emoji: '❓', label: 'Question', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
]

const REACTIONS_KEY = 'spothitch_intro_reactions'

function getReactions(featureId) {
  try {
    return JSON.parse(localStorage.getItem(REACTIONS_KEY) || '{}')[featureId] || []
  } catch { return [] }
}

function saveReactions(featureId, reactions) {
  try {
    const all = JSON.parse(localStorage.getItem(REACTIONS_KEY) || '{}')
    all[featureId] = reactions
    localStorage.setItem(REACTIONS_KEY, JSON.stringify(all))
  } catch { /* ignore */ }
}

async function syncReactionToFirebase(featureId, reactions) {
  try {
    const { getState } = await import('../../stores/state.js')
    const state = getState()
    if (!state.user?.uid) return
    const { getFirestore, doc, setDoc } = await import('firebase/firestore')
    const { getApp } = await import('firebase/app')
    const db = getFirestore(getApp())
    await setDoc(doc(db, 'introReactions', `${state.user.uid}_${featureId}`), {
      featureId,
      reactions,
      userId: state.user.uid,
      timestamp: new Date().toISOString(),
    }, { merge: true })
  } catch { /* Firebase not critical */ }
}

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
            <p style="font-size:0.64rem;font-weight:700;color:#fff;margin-bottom:3px">${escapeHTML(item.title)}</p>
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
  const { id, emoji, title, status, color, badge, content, tags, btnLabel } = feature
  const selectedReactions = getReactions(id)
  const badgeStyle = status === 'available'
    ? 'color:#10b981;border-color:#10b981'
    : `color:${color};border-color:${color}`

  const tagsHTML = tags.length > 0 ? `
    <div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin-bottom:14px">
      ${tags.map(tag => `<span style="font-size:0.58rem;padding:3px 7px;border-radius:10px;background:rgba(255,255,255,0.08);color:#94a3b8;border:1px solid rgba(255,255,255,0.08)">${escapeHTML(tag)}</span>`).join('')}
    </div>
  ` : ''

  const reactionsHTML = REACTIONS.map(r => {
    const isSel = selectedReactions.includes(r.type)
    const style = isSel
      ? `border:2px solid ${r.color};background:${r.bg};`
      : 'border:2px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);'
    return `
      <button
        class="intro-reaction-btn"
        data-reaction="${r.type}"
        data-featureid="${id}"
        aria-pressed="${isSel}"
        style="flex:1;padding:8px 4px;border-radius:10px;cursor:pointer;text-align:center;transition:all 0.15s;color:#fff;${style}">
        <span style="font-size:1.1rem;display:block">${r.emoji}</span>
        <span style="font-size:0.55rem;display:block;margin-top:2px;color:#94a3b8">${escapeHTML(r.label)}</span>
      </button>
    `
  }).join('')

  const btnStyle = status === 'available'
    ? `background:linear-gradient(135deg,${color},${color}cc)`
    : `background:linear-gradient(135deg,${color},${color}cc)`

  const btnOnclick = status === 'available'
    ? `featureIntroCTA('${id}')`
    : `featureIntroBetaCTA('${id}')`

  return `
    <div id="feature-intro-overlay"
      style="position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,0.75);backdrop-filter:blur(4px)"
      role="dialog" aria-modal="true" aria-labelledby="fi-title"
      onclick="if(event.target===this)closeFeatureIntro()">

      <div style="position:relative;width:100%;max-width:320px;background:rgba(8,9,15,0.95);border-radius:28px;overflow:hidden;box-shadow:0 0 0 1px rgba(255,255,255,0.07),0 24px 60px rgba(0,0,0,0.9)">

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

          <!-- Title -->
          <h2 id="fi-title" style="color:#fff;font-size:0.88rem;font-weight:700;line-height:1.3;margin-bottom:7px">${escapeHTML(title)}</h2>

          <!-- Dynamic content -->
          ${renderContent(content, color)}

          <!-- Tags -->
          ${tagsHTML}

          <!-- Divider -->
          <div style="height:1px;background:rgba(255,255,255,0.08);margin:10px 0 12px"></div>

          <!-- Reactions row -->
          <p style="font-size:0.6rem;color:#64748b;margin-bottom:8px;text-align:left">${escapeHTML(t('fbReactTitle') || 'Ton ressenti')}</p>
          <div style="display:flex;gap:4px;margin-bottom:12px">
            ${reactionsHTML}
          </div>

          <!-- CTA Button -->
          <button onclick="${btnOnclick}"
            style="width:100%;padding:11px;border-radius:14px;font-size:0.78rem;font-weight:600;border:none;cursor:pointer;color:#fff;${btnStyle}">
            ${escapeHTML(btnLabel)}
          </button>
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

// Toggle reaction on a feature card (updates DOM directly, no full re-render)
window.toggleIntroReaction = (type, featureId) => {
  const reactions = getReactions(featureId)
  const idx = reactions.indexOf(type)
  if (idx >= 0) {
    reactions.splice(idx, 1)
  } else {
    reactions.push(type)
  }
  saveReactions(featureId, reactions)
  syncReactionToFirebase(featureId, reactions)

  // Update button styles directly
  const overlay = document.getElementById('feature-intro-overlay')
  if (!overlay) return
  overlay.querySelectorAll('.intro-reaction-btn').forEach(btn => {
    const bType = btn.dataset.reaction
    const r = REACTIONS.find(rx => rx.type === bType)
    if (!r) return
    const isSel = reactions.includes(bType)
    btn.style.border = isSel ? `2px solid ${r.color}` : '2px solid rgba(255,255,255,0.06)'
    btn.style.background = isSel ? r.bg : 'rgba(255,255,255,0.02)'
    btn.setAttribute('aria-pressed', String(isSel))
  })
}

// Keyboard close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.getElementById('feature-intro-overlay')) {
    window.closeFeatureIntro()
  }
})

// Delegate reaction clicks (buttons are created dynamically)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.intro-reaction-btn')
  if (!btn) return
  const { reaction, featureid } = btn.dataset
  if (reaction && featureid) {
    window.toggleIntroReaction(reaction, featureid)
  }
})
