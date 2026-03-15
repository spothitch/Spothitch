/**
 * Guide Moderation Component — Approve/reject pending guide tips
 */

import {
  loadPendingTips,
  loadApprovedTips,
  loadRejectedTips,
  approveTip,
  rejectTip,
} from '../services/guides.js'

function escapeHTML(str) {
  const div = document.createElement('div')
  div.textContent = str || ''
  return div.innerHTML
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = dateStr.toDate ? dateStr.toDate() : new Date(dateStr)
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return String(dateStr).slice(0, 10)
  }
}

const CATEGORY_LABELS = {
  hitchhiking: "Facilite de l'auto-stop",
  safety: 'Securite',
  laws: 'Lois et legalite',
  language: 'Langue et communication',
  budget: 'Budget et couts',
  culture: 'Culture locale',
  transport: 'Transports alternatifs',
}

function categoryLabel(cat) {
  if (!cat) return ''
  if (cat.startsWith('custom_')) return cat.replace('custom_', '')
  return CATEGORY_LABELS[cat] || cat
}

function renderStars(rating) {
  if (!rating || rating === 0) return ''
  const stars = '★'.repeat(Math.min(5, rating)) + '☆'.repeat(Math.max(0, 5 - rating))
  return `<span class="text-primary-400 text-sm">${stars}</span>`
}

let currentTab = 'pending'
let tipsCache = { pending: null, approved: null, rejected: null }

export function renderGuideModeration() {
  return `
    <div class="p-6 max-w-6xl mx-auto">
      <h1 class="font-display text-2xl font-bold mb-6 text-primary-400">Moderation des guides</h1>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6">
        <button class="tab-btn ${currentTab === 'pending' ? 'active' : ''}" data-mod-tab="pending">
          En attente
          <span id="pending-count" class="ml-1 text-xs opacity-70"></span>
        </button>
        <button class="tab-btn ${currentTab === 'approved' ? 'active' : ''}" data-mod-tab="approved">
          Approuves
          <span id="approved-count" class="ml-1 text-xs opacity-70"></span>
        </button>
        <button class="tab-btn ${currentTab === 'rejected' ? 'active' : ''}" data-mod-tab="rejected">
          Rejetes
          <span id="rejected-count" class="ml-1 text-xs opacity-70"></span>
        </button>
      </div>

      <!-- Content -->
      <div id="moderation-content">
        <div class="text-center py-8"><span class="spinner"></span></div>
      </div>
    </div>
  `
}

function renderTipsList(tips, status) {
  if (!tips || tips.length === 0) {
    const messages = {
      pending: 'Aucun tip en attente de moderation',
      approved: 'Aucun tip approuve',
      rejected: 'Aucun tip rejete',
    }
    return `<p class="text-slate-500 text-center py-8">${messages[status] || 'Aucun resultat'}</p>`
  }

  return tips
    .map((tip) => {
      const country = escapeHTML(tip.countryCode || '').toUpperCase()
      const cat = categoryLabel(tip.category)
      const text = escapeHTML(tip.text || '')
      const author = escapeHTML(tip.username || 'Anonyme')
      const date = formatDate(tip.createdAt)
      const stars = renderStars(tip.rating)

      const actionButtons =
        status === 'pending'
          ? `
        <div class="flex gap-2 mt-3">
          <button class="btn-primary text-sm py-1.5 px-4" data-approve="${escapeHTML(tip.id)}">Approuver</button>
          <button class="btn-danger text-sm py-1.5 px-4" data-reject="${escapeHTML(tip.id)}">Rejeter</button>
        </div>`
          : status === 'approved'
            ? '<span class="text-xs text-emerald-400 mt-2 inline-block">Approuve</span>'
            : '<span class="text-xs text-danger-400 mt-2 inline-block">Rejete</span>'

      return `
      <div class="card p-4 mb-3">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap mb-2">
              <span class="text-xs font-bold bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded">${country}</span>
              <span class="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">${escapeHTML(cat)}</span>
              ${stars}
            </div>
            <p class="text-sm text-slate-200 mb-2">${text || '<em class="text-slate-500">Pas de texte</em>'}</p>
            <div class="flex items-center gap-3 text-xs text-slate-500">
              <span>${author}</span>
              <span>${date}</span>
            </div>
            ${actionButtons}
          </div>
        </div>
      </div>`
    })
    .join('')
}

export async function bindGuideModerationEvents() {
  // Tab clicks
  document.querySelectorAll('[data-mod-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentTab = btn.dataset.modTab
      // Re-render page header tabs
      document.querySelectorAll('[data-mod-tab]').forEach((b) => {
        b.classList.toggle('active', b.dataset.modTab === currentTab)
      })
      renderCurrentTab()
    })
  })

  // Load pending by default
  await renderCurrentTab()
}

async function renderCurrentTab() {
  const el = document.getElementById('moderation-content')
  if (!el) return

  el.innerHTML = '<div class="text-center py-8"><span class="spinner"></span></div>'

  try {
    let tips = tipsCache[currentTab]
    if (!tips) {
      if (currentTab === 'pending') tips = await loadPendingTips()
      else if (currentTab === 'approved') tips = await loadApprovedTips()
      else tips = await loadRejectedTips()
      tipsCache[currentTab] = tips
    }

    // Update counts
    const countEl = document.getElementById(`${currentTab}-count`)
    if (countEl) countEl.textContent = `(${tips.length})`

    el.innerHTML = renderTipsList(tips, currentTab)

    // Bind approve/reject buttons
    el.querySelectorAll('[data-approve]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const tipId = btn.dataset.approve
        btn.disabled = true
        btn.textContent = '...'
        try {
          await approveTip(tipId)
          // Remove from pending cache, invalidate approved cache
          tipsCache.pending = (tipsCache.pending || []).filter((t) => t.id !== tipId)
          tipsCache.approved = null
          window.__showToast?.('Tip approuve', 'success')
          renderCurrentTab()
        } catch (err) {
          console.error('Approve error:', err)
          window.__showToast?.('Erreur', 'error')
          btn.disabled = false
          btn.textContent = 'Approuver'
        }
      })
    })

    el.querySelectorAll('[data-reject]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const tipId = btn.dataset.reject
        btn.disabled = true
        btn.textContent = '...'
        try {
          await rejectTip(tipId)
          tipsCache.pending = (tipsCache.pending || []).filter((t) => t.id !== tipId)
          tipsCache.rejected = null
          window.__showToast?.('Tip rejete', 'success')
          renderCurrentTab()
        } catch (err) {
          console.error('Reject error:', err)
          window.__showToast?.('Erreur', 'error')
          btn.disabled = false
          btn.textContent = 'Rejeter'
        }
      })
    })
  } catch (err) {
    console.error('Load tips error:', err)
    el.innerHTML = '<p class="text-danger-400 text-center py-8">Erreur de chargement</p>'
  }
}

// Reset cache when navigating away
export function resetGuideModerationCache() {
  tipsCache = { pending: null, approved: null, rejected: null }
  currentTab = 'pending'
}
