/**
 * Dashboard Component — KPIs, Sentry errors, recent activity
 */

import { loadDashboardStats, loadRecentActivity } from '../services/stats.js'
import { loadSentryIssues } from '../services/sentry.js'

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
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return String(dateStr).slice(0, 16)
  }
}

export function renderDashboard() {
  return `
    <div class="p-6 max-w-6xl mx-auto">
      <h1 class="font-display text-2xl font-bold mb-6 text-primary-400">Tableau de bord</h1>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" id="kpi-cards">
        <div class="card p-5 text-center">
          <div class="text-3xl font-bold text-primary-400" id="kpi-users"><span class="spinner"></span></div>
          <div class="text-sm text-slate-400 mt-1">Utilisateurs</div>
        </div>
        <div class="card p-5 text-center">
          <div class="text-3xl font-bold text-emerald-400" id="kpi-spots"><span class="spinner"></span></div>
          <div class="text-sm text-slate-400 mt-1">Spots</div>
        </div>
        <div class="card p-5 text-center">
          <div class="text-3xl font-bold text-amber-400" id="kpi-pending"><span class="spinner"></span></div>
          <div class="text-sm text-slate-400 mt-1">Tips en attente</div>
        </div>
      </div>

      <!-- Sentry Errors -->
      <div class="card p-5 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-display text-lg font-bold text-danger-400">Erreurs Sentry</h2>
          <button id="refresh-sentry" class="btn-secondary text-xs py-1 px-3">Rafraichir</button>
        </div>
        <div id="sentry-list">
          <div class="text-center py-4"><span class="spinner"></span></div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Users -->
        <div class="card p-5">
          <h2 class="font-display text-lg font-bold text-purple-400 mb-4">Derniers utilisateurs</h2>
          <div id="recent-users">
            <div class="text-center py-4"><span class="spinner"></span></div>
          </div>
        </div>

        <!-- Recent Spots -->
        <div class="card p-5">
          <h2 class="font-display text-lg font-bold text-emerald-400 mb-4">Derniers spots</h2>
          <div id="recent-spots">
            <div class="text-center py-4"><span class="spinner"></span></div>
          </div>
        </div>
      </div>
    </div>
  `
}

export async function bindDashboardEvents() {
  // Load KPIs
  loadDashboardStats()
    .then((stats) => {
      document.getElementById('kpi-users').textContent = stats.userCount.toLocaleString('fr-FR')
      document.getElementById('kpi-spots').textContent = stats.spotCount.toLocaleString('fr-FR')
      document.getElementById('kpi-pending').textContent = stats.pendingTipsCount.toLocaleString('fr-FR')
    })
    .catch((err) => {
      console.error('Failed to load stats:', err)
      document.getElementById('kpi-users').textContent = '?'
      document.getElementById('kpi-spots').textContent = '?'
      document.getElementById('kpi-pending').textContent = '?'
    })

  // Load Sentry
  loadAndRenderSentry()

  // Load recent activity
  loadRecentActivity()
    .then(({ recentUsers, recentSpots }) => {
      renderRecentUsers(recentUsers)
      renderRecentSpots(recentSpots)
    })
    .catch((err) => {
      console.error('Failed to load activity:', err)
      const usersEl = document.getElementById('recent-users')
      const spotsEl = document.getElementById('recent-spots')
      if (usersEl) usersEl.innerHTML = '<p class="text-slate-500 text-sm">Erreur de chargement</p>'
      if (spotsEl) spotsEl.innerHTML = '<p class="text-slate-500 text-sm">Erreur de chargement</p>'
    })

  // Refresh sentry button
  const btn = document.getElementById('refresh-sentry')
  if (btn) btn.addEventListener('click', loadAndRenderSentry)
}

async function loadAndRenderSentry() {
  const el = document.getElementById('sentry-list')
  if (!el) return
  el.innerHTML = '<div class="text-center py-4"><span class="spinner"></span></div>'

  try {
    const issues = await loadSentryIssues()
    if (issues.length === 0) {
      el.innerHTML = '<p class="text-emerald-400 text-center py-4">Aucune erreur ouverte</p>'
      return
    }

    el.innerHTML = issues
      .slice(0, 15)
      .map((issue) => {
        const dateStr = formatDate(issue.created_at)
        const title = escapeHTML(issue.title || 'Sans titre')
        return `
        <div class="py-3 border-b border-white/5 last:border-0">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <p class="text-sm text-slate-200 truncate">${title}</p>
              <p class="text-xs text-slate-500 mt-0.5">#${issue.number} · ${dateStr}</p>
            </div>
            ${issue.html_url ? `<a href="${escapeHTML(issue.html_url)}" target="_blank" rel="noopener" class="text-xs text-primary-400 hover:underline whitespace-nowrap">Voir</a>` : ''}
          </div>
        </div>`
      })
      .join('')
  } catch (err) {
    console.error('Sentry load error:', err)
    el.innerHTML = '<p class="text-danger-400 text-sm">Erreur de chargement</p>'
  }
}

function renderRecentUsers(users) {
  const el = document.getElementById('recent-users')
  if (!el) return

  if (!users || users.length === 0) {
    el.innerHTML = '<p class="text-slate-500 text-sm">Aucun utilisateur recent</p>'
    return
  }

  el.innerHTML = users
    .map((u) => {
      const name = escapeHTML(u.username || u.displayName || u.email || 'Anonyme')
      const date = formatDate(u.lastLogin || u.createdAt)
      return `
      <div class="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
        <span class="text-sm text-slate-200">${name}</span>
        <span class="text-xs text-slate-500">${date}</span>
      </div>`
    })
    .join('')
}

function renderRecentSpots(spots) {
  const el = document.getElementById('recent-spots')
  if (!el) return

  if (!spots || spots.length === 0) {
    el.innerHTML = '<p class="text-slate-500 text-sm">Aucun spot recent</p>'
    return
  }

  el.innerHTML = spots
    .map((s) => {
      const title = escapeHTML(s.title || s.city || `${(s.lat || 0).toFixed(2)}, ${(s.lng || 0).toFixed(2)}`)
      const date = formatDate(s.createdAt)
      const country = escapeHTML(s.country || s.countryCode || '')
      return `
      <div class="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
        <div>
          <span class="text-sm text-slate-200">${title}</span>
          ${country ? `<span class="text-xs text-slate-500 ml-2">${country}</span>` : ''}
        </div>
        <span class="text-xs text-slate-500">${date}</span>
      </div>`
    })
    .join('')
}
