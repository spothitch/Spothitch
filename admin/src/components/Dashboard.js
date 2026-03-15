/**
 * Dashboard Component — KPIs, Sentry errors, recent activity, cleanup card
 */

import { loadDashboardStats, loadRecentActivity, isTestUser, isTestSpot } from '../services/stats.js'
import { loadSentryIssues } from '../services/sentry.js'
import { loadAllSpots, loadAllUsers } from '../services/stats.js'
import { deleteDocument } from '../services/firebase.js'

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
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8" id="kpi-cards">
        <div class="card p-5 text-center">
          <div class="text-3xl font-bold text-primary-400" id="kpi-users"><span class="spinner"></span></div>
          <div class="text-sm text-slate-400 mt-1">Utilisateurs reels</div>
        </div>
        <div class="card p-5 text-center">
          <div class="text-3xl font-bold text-slate-400" id="kpi-hitchwiki"><span class="spinner"></span></div>
          <div class="text-sm text-slate-400 mt-1">Spots Hitchwiki</div>
          <div class="text-xs text-slate-500 mt-0.5" id="kpi-hitchwiki-countries"></div>
        </div>
        <div class="card p-5 text-center">
          <div class="text-3xl font-bold text-emerald-400" id="kpi-spots"><span class="spinner"></span></div>
          <div class="text-sm text-slate-400 mt-1">Spots communautaires</div>
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
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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

      <!-- Cleanup section -->
      <div class="card p-5" id="cleanup-section">
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-display text-base font-bold text-slate-400">Donnees de test</h2>
          <span class="text-xs text-slate-500">CI/E2E</span>
        </div>
        <div class="flex items-center gap-4 flex-wrap">
          <span class="text-sm text-slate-300" id="cleanup-summary"><span class="spinner"></span></span>
          <button id="cleanup-btn" class="btn-danger text-xs py-1.5 px-4" disabled>Nettoyer</button>
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
      document.getElementById('kpi-hitchwiki').textContent = stats.spotCountHitchwiki.toLocaleString('fr-FR')
      const countriesEl = document.getElementById('kpi-hitchwiki-countries')
      if (countriesEl) countriesEl.textContent = stats.hitchwikiCountries + ' pays'
      document.getElementById('kpi-spots').textContent = stats.spotCountFirebase.toLocaleString('fr-FR')
      document.getElementById('kpi-pending').textContent = stats.pendingTipsCount.toLocaleString('fr-FR')

      // Update cleanup summary
      const summaryEl = document.getElementById('cleanup-summary')
      const cleanBtn = document.getElementById('cleanup-btn')
      if (summaryEl) {
        summaryEl.textContent = `${stats.testUserCount} compte${stats.testUserCount > 1 ? 's' : ''} de test, ${stats.testSpotCount} spot${stats.testSpotCount > 1 ? 's' : ''} de test`
      }
      if (cleanBtn) {
        cleanBtn.disabled = stats.testUserCount === 0 && stats.testSpotCount === 0
      }
    })
    .catch((err) => {
      console.error('Failed to load stats:', err)
      document.getElementById('kpi-users').textContent = '?'
      document.getElementById('kpi-hitchwiki').textContent = '?'
      document.getElementById('kpi-spots').textContent = '?'
      document.getElementById('kpi-pending').textContent = '?'
      const summaryEl = document.getElementById('cleanup-summary')
      if (summaryEl) summaryEl.textContent = 'Erreur de chargement'
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

  // Cleanup button
  const cleanBtn = document.getElementById('cleanup-btn')
  if (cleanBtn) cleanBtn.addEventListener('click', runCleanup)
}

async function runCleanup() {
  const btn = document.getElementById('cleanup-btn')
  if (!btn) return

  try {
    const [allUsers, allSpots] = await Promise.all([loadAllUsers(), loadAllSpots()])
    const testUsers = allUsers.filter((u) => isTestUser(u))
    const testSpots = allSpots.filter((s) => isTestSpot(s))
    const total = testUsers.length + testSpots.length

    if (total === 0) {
      window.__showToast?.('Rien a nettoyer, tout est propre', 'info')
      return
    }

    if (!confirm(`Supprimer ${testUsers.length} compte(s) de test et ${testSpots.length} spot(s) de test ?`)) return

    btn.disabled = true
    btn.textContent = '...'

    let deleted = 0
    for (const u of testUsers) {
      try {
        await deleteDocument('users', u.id)
        deleted++
      } catch (err) {
        console.error('Failed to delete test user:', err)
      }
    }
    for (const s of testSpots) {
      try {
        await deleteDocument('spots', s.id)
        deleted++
      } catch (err) {
        console.error('Failed to delete test spot:', err)
      }
    }

    btn.disabled = false
    btn.textContent = 'Nettoyer'

    const summaryEl = document.getElementById('cleanup-summary')
    if (summaryEl) summaryEl.textContent = '0 compte de test, 0 spot de test'
    btn.disabled = true

    window.__showToast?.(`${deleted} element(s) de test supprime(s)`, 'success')
  } catch (err) {
    console.error('Cleanup error:', err)
    btn.disabled = false
    btn.textContent = 'Nettoyer'
    window.__showToast?.('Erreur lors du nettoyage', 'error')
  }
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
