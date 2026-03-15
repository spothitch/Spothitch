/**
 * Unified Moderation Component — V1 Clean design
 * Shows ALL items needing admin decision:
 * - Guide tips (from guideTips collection, status == 'pending')
 * - Spot reports (from reports collection)
 * - User reports (from reports collection)
 *
 * Section tabs: Tout | Guides | Signalements spots | Signalements utilisateurs
 */

import {
  loadPendingTips,
  approveTip,
  rejectTip,
} from '../services/guides.js'
import { getReports, updateDocument } from '../services/firebase.js'

function escapeHTML(str) {
  const div = document.createElement('div')
  div.textContent = str || ''
  return div.innerHTML
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  try {
    const d = dateStr.toDate ? dateStr.toDate() : new Date(dateStr)
    const now = Date.now()
    const diff = now - d.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'maintenant'
    if (mins < 60) return `il y a ${mins}min`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `il y a ${hours}h`
    const days = Math.floor(hours / 24)
    if (days === 1) return 'hier'
    return `il y a ${days}j`
  } catch {
    return ''
  }
}

const CATEGORY_LABELS = {
  hitchhiking: "Facilité de l'auto-stop",
  safety: 'Sécurité',
  laws: 'Lois et légalité',
  language: 'Langue et communication',
  budget: 'Budget et coûts',
  culture: 'Culture locale',
  transport: 'Transports alternatifs',
}

function categoryLabel(cat) {
  if (!cat) return ''
  if (cat.startsWith('custom_')) return cat.replace('custom_', '')
  return CATEGORY_LABELS[cat] || cat
}

const SEVERITY_LABELS = {
  dangerous: 'Dangereux',
  misplaced: 'Mal placé',
  inaccurate: 'Inexact',
  inappropriate: 'Inapproprié',
  duplicate: 'Doublon',
  closed: 'Fermé',
  spam: 'Spam',
  harassment: 'Harcèlement',
  fake: 'Faux profil',
  hate: 'Haine',
  other: 'Autre',
}

const SEVERITY_ICONS = {
  dangerous: '⚠️',
  misplaced: '📍',
  inappropriate: '🚫',
  closed: '🔒',
  spam: '📢',
  harassment: '👤',
  fake: '🎭',
  other: '❓',
}

let currentFilter = 'all'
let guideTips = null
let reports = null

export function renderModeration() {
  return `
    <div class="page-title">Modération</div>

    <!-- Tabs -->
    <div class="section-tabs" id="mod-tabs">
      <button class="tab ${currentFilter === 'all' ? 'active' : ''}" data-mod-filter="all">
        Tout <span class="badge" id="count-all">...</span>
      </button>
      <button class="tab ${currentFilter === 'guides' ? 'active' : ''}" data-mod-filter="guides">
        Guides <span class="badge" id="count-guides">...</span>
      </button>
      <button class="tab ${currentFilter === 'spot-reports' ? 'active' : ''}" data-mod-filter="spot-reports">
        Signalements spots <span class="badge" id="count-spot-reports">...</span>
      </button>
      <button class="tab ${currentFilter === 'user-reports' ? 'active' : ''}" data-mod-filter="user-reports">
        Signalements utilisateurs <span class="badge" id="count-user-reports">...</span>
      </button>
    </div>

    <!-- Content -->
    <div class="card" style="padding:0;" id="mod-content">
      <div style="text-align:center;padding:32px;"><span class="spinner"></span></div>
    </div>
  `
}

export async function bindModerationEvents() {
  // Tab clicks
  document.querySelectorAll('[data-mod-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.modFilter
      document.querySelectorAll('[data-mod-filter]').forEach((b) => {
        b.classList.toggle('active', b.dataset.modFilter === currentFilter)
      })
      renderItems()
    })
  })

  // Load data
  await loadAllData()
}

async function loadAllData() {
  const el = document.getElementById('mod-content')
  if (el) el.innerHTML = '<div style="text-align:center;padding:32px;"><span class="spinner"></span></div>'

  try {
    const [tips, reps] = await Promise.all([
      loadPendingTips().catch(() => []),
      getReports().catch(() => []),
    ])

    guideTips = tips || []
    reports = reps || []

    // Filter reports by type
    const pendingReports = reports.filter((r) => !r.status || r.status === 'pending')
    const spotReports = pendingReports.filter((r) => r.type === 'spot')
    const userReports = pendingReports.filter((r) => r.type === 'user' || r.type === 'message')
    const totalCount = guideTips.length + spotReports.length + userReports.length

    // Update counts
    updateCount('count-all', totalCount)
    updateCount('count-guides', guideTips.length)
    updateCount('count-spot-reports', spotReports.length)
    updateCount('count-user-reports', userReports.length)

    // Update nav badge
    if (window.__updatePendingBadge) {
      window.__updatePendingBadge(totalCount)
    }

    renderItems()
  } catch (err) {
    console.error('Failed to load moderation data:', err)
    if (el) el.innerHTML = '<div style="text-align:center;padding:32px;font-size:13px;color:#f87171;">Erreur de chargement</div>'
  }
}

function updateCount(id, count) {
  const el = document.getElementById(id)
  if (el) el.textContent = count
}

function renderItems() {
  const el = document.getElementById('mod-content')
  if (!el) return

  const pendingReports = (reports || []).filter((r) => !r.status || r.status === 'pending')
  const spotReports = pendingReports.filter((r) => r.type === 'spot')
  const userReports = pendingReports.filter((r) => r.type === 'user' || r.type === 'message')

  let items = []

  if (currentFilter === 'all' || currentFilter === 'guides') {
    items = items.concat((guideTips || []).map((tip) => ({ kind: 'guide', data: tip })))
  }
  if (currentFilter === 'all' || currentFilter === 'spot-reports') {
    items = items.concat(spotReports.map((r) => ({ kind: 'spot-report', data: r })))
  }
  if (currentFilter === 'all' || currentFilter === 'user-reports') {
    items = items.concat(userReports.map((r) => ({ kind: 'user-report', data: r })))
  }

  if (items.length === 0) {
    el.innerHTML = '<div style="text-align:center;padding:32px;font-size:13px;color:#64748b;">Aucun élément en attente</div>'
    return
  }

  el.innerHTML = items.map((item) => renderModItem(item)).join('')

  // Bind action buttons
  bindActionButtons(el)
}

function renderModItem({ kind, data }) {
  if (kind === 'guide') {
    return renderGuideTip(data)
  } else if (kind === 'spot-report') {
    return renderSpotReport(data)
  } else {
    return renderUserReport(data)
  }
}

function renderGuideTip(tip) {
  const country = escapeHTML((tip.countryCode || '').toUpperCase())
  const cat = escapeHTML(categoryLabel(tip.category))
  const text = escapeHTML(tip.text || '')
  const author = escapeHTML(tip.username || 'Anonyme')
  const time = timeAgo(tip.createdAt)

  return `
    <div class="mod-item">
      <div class="mod-icon guide">📚</div>
      <div class="mod-content">
        <div>
          <span class="tag tag-guide">Conseil guide</span>
          ${country ? `<span class="tag tag-country">${country}</span>` : ''}
          ${cat ? `<span class="slate" style="font-size:12px;">${cat}</span>` : ''}
        </div>
        <div class="mod-text">${text || '<em style="color:#64748b;">Pas de texte</em>'}</div>
        <div class="mod-meta">Par ${author} · ${time}</div>
        <div class="mod-actions">
          <button class="btn btn-approve" data-action="approve-tip" data-id="${escapeHTML(tip.id)}">✓ Approuver</button>
          <button class="btn btn-reject" data-action="reject-tip" data-id="${escapeHTML(tip.id)}">✕ Rejeter</button>
        </div>
      </div>
    </div>`
}

function renderSpotReport(report) {
  const reason = report.reason || 'other'
  const reasonLabel = escapeHTML(SEVERITY_LABELS[reason] || reason)
  const severity = report.severity || 'medium'
  const icon = SEVERITY_ICONS[reason] || '⚠️'
  const text = escapeHTML(report.details?.description || report.description || '')
  const spotName = escapeHTML(report.spotName || report.spotId || 'Spot inconnu')
  const reporter = escapeHTML(report.reporter?.username || report.reporterName || 'Anonyme')
  const time = timeAgo(report.createdAt || report.timestamp)

  return `
    <div class="mod-item">
      <div class="mod-icon report">${icon}</div>
      <div class="mod-content">
        <div>
          <span class="tag tag-spot">Signalement spot</span>
          <span class="tag tag-severity-${severity}">${reasonLabel}</span>
        </div>
        <div class="mod-text">${text || '<em style="color:#64748b;">Pas de détails</em>'}</div>
        <div class="mod-meta">Spot: ${spotName} · Signalé par ${reporter} · ${time}</div>
        <div class="mod-actions">
          <button class="btn btn-approve" data-action="confirm-report" data-id="${escapeHTML(report.id)}">✓ Confirmer</button>
          <button class="btn btn-reject" data-action="reject-report" data-id="${escapeHTML(report.id)}">✕ Rejeter</button>
          ${report.spotId ? `<button class="btn btn-detail" data-action="view-spot" data-spot-id="${escapeHTML(report.spotId)}">Voir le spot</button>` : ''}
        </div>
      </div>
    </div>`
}

function renderUserReport(report) {
  const reason = report.reason || 'other'
  const reasonLabel = escapeHTML(SEVERITY_LABELS[reason] || reason)
  const severity = report.severity || 'medium'
  const text = escapeHTML(report.details?.description || report.description || '')
  const targetUser = escapeHTML(report.targetUsername || report.targetId || 'Utilisateur inconnu')
  const reporter = escapeHTML(report.reporter?.username || report.reporterName || 'Anonyme')
  const time = timeAgo(report.createdAt || report.timestamp)

  return `
    <div class="mod-item">
      <div class="mod-icon user-report">👤</div>
      <div class="mod-content">
        <div>
          <span class="tag tag-user">Signalement utilisateur</span>
          <span class="tag tag-severity-${severity}">${reasonLabel}</span>
        </div>
        <div class="mod-text">${text || '<em style="color:#64748b;">Pas de détails</em>'}</div>
        <div class="mod-meta">Utilisateur: ${targetUser} · Signalé par ${reporter} · ${time}</div>
        <div class="mod-actions">
          <button class="btn btn-reject" data-action="ban-user" data-id="${escapeHTML(report.id)}" data-target="${escapeHTML(report.targetId || '')}">🚫 Bannir l'utilisateur</button>
          ${report.targetId ? `<button class="btn btn-detail" data-action="view-profile" data-target="${escapeHTML(report.targetId)}">Voir le profil</button>` : ''}
          <button class="btn btn-approve" data-action="reject-report" data-id="${escapeHTML(report.id)}">✕ Rejeter le signalement</button>
        </div>
      </div>
    </div>`
}

function bindActionButtons(container) {
  // Approve guide tip
  container.querySelectorAll('[data-action="approve-tip"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const tipId = btn.dataset.id
      btn.disabled = true
      btn.textContent = '...'
      try {
        await approveTip(tipId)
        guideTips = (guideTips || []).filter((t) => t.id !== tipId)
        window.__showToast?.('Conseil approuvé', 'success')
        refreshCounts()
        renderItems()
      } catch (err) {
        console.error('Approve error:', err)
        window.__showToast?.('Erreur', 'error')
        btn.disabled = false
        btn.textContent = '✓ Approuver'
      }
    })
  })

  // Reject guide tip
  container.querySelectorAll('[data-action="reject-tip"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const tipId = btn.dataset.id
      btn.disabled = true
      btn.textContent = '...'
      try {
        await rejectTip(tipId)
        guideTips = (guideTips || []).filter((t) => t.id !== tipId)
        window.__showToast?.('Conseil rejeté', 'success')
        refreshCounts()
        renderItems()
      } catch (err) {
        console.error('Reject error:', err)
        window.__showToast?.('Erreur', 'error')
        btn.disabled = false
        btn.textContent = '✕ Rejeter'
      }
    })
  })

  // Confirm spot report
  container.querySelectorAll('[data-action="confirm-report"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const reportId = btn.dataset.id
      btn.disabled = true
      btn.textContent = '...'
      try {
        await updateDocument('reports', reportId, {
          status: 'confirmed',
          moderatedAt: new Date().toISOString(),
        })
        reports = (reports || []).map((r) => r.id === reportId ? { ...r, status: 'confirmed' } : r)
        window.__showToast?.('Signalement confirmé', 'success')
        refreshCounts()
        renderItems()
      } catch (err) {
        console.error('Confirm report error:', err)
        window.__showToast?.('Erreur', 'error')
        btn.disabled = false
        btn.textContent = '✓ Confirmer'
      }
    })
  })

  // Reject report
  container.querySelectorAll('[data-action="reject-report"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const reportId = btn.dataset.id
      btn.disabled = true
      btn.textContent = '...'
      try {
        await updateDocument('reports', reportId, {
          status: 'dismissed',
          moderatedAt: new Date().toISOString(),
        })
        reports = (reports || []).map((r) => r.id === reportId ? { ...r, status: 'dismissed' } : r)
        window.__showToast?.('Signalement rejeté', 'success')
        refreshCounts()
        renderItems()
      } catch (err) {
        console.error('Reject report error:', err)
        window.__showToast?.('Erreur', 'error')
        btn.disabled = false
        btn.textContent = '✕ Rejeter'
      }
    })
  })

  // Ban user
  container.querySelectorAll('[data-action="ban-user"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.__showToast?.('Fonction de bannissement pas encore implémentée', 'info')
    })
  })

  // View spot
  container.querySelectorAll('[data-action="view-spot"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const spotId = btn.dataset.spotId
      window.open(`https://spothitch.com/#spot=${spotId}`, '_blank')
    })
  })

  // View profile
  container.querySelectorAll('[data-action="view-profile"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target
      // Navigate to users page (could be improved with deep linking)
      window.__navigate?.('users')
    })
  })
}

function refreshCounts() {
  const pendingReports = (reports || []).filter((r) => !r.status || r.status === 'pending')
  const spotReports = pendingReports.filter((r) => r.type === 'spot')
  const userReports = pendingReports.filter((r) => r.type === 'user' || r.type === 'message')
  const totalCount = (guideTips || []).length + spotReports.length + userReports.length

  updateCount('count-all', totalCount)
  updateCount('count-guides', (guideTips || []).length)
  updateCount('count-spot-reports', spotReports.length)
  updateCount('count-user-reports', userReports.length)

  // Update nav badge
  if (window.__updatePendingBadge) {
    window.__updatePendingBadge(totalCount)
  }
}

export function resetModerationCache() {
  guideTips = null
  reports = null
  currentFilter = 'all'
}
