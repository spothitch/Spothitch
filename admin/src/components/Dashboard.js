/**
 * Dashboard Component — V1 Clean design
 * KPIs (4 cards), Sentry errors + activity (two-col), cleanup bar
 */

import { loadDashboardStats, loadRecentActivity, isTestUser, isRealUser, isRealSpot, loadAllSpots, loadAllUsers } from '../services/stats.js'
import { loadSentryIssues } from '../services/sentry.js'
import { deleteDocument, loadAllDocs } from '../services/firebase.js'

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
    return String(dateStr).slice(0, 16)
  }
}

export function renderDashboard() {
  return `
    <div class="page-title">Tableau de bord</div>

    <!-- KPI Cards -->
    <div class="kpi-grid" id="kpi-cards">
      <div class="kpi">
        <div class="kpi-value green" id="kpi-users"><span class="spinner"></span></div>
        <div class="kpi-label">Utilisateurs réels <span class="help-tip" title="Comptes créés par de vrais utilisateurs via l'app. Les comptes de test automatisés ne sont pas comptés.">?</span></div>
      </div>
      <div class="kpi">
        <div class="kpi-value slate" id="kpi-hitchwiki"><span class="spinner"></span></div>
        <div class="kpi-label">Spots Hitchwiki <span class="help-tip" title="Spots importés de la base Hitchwiki (ancienne communauté d'auto-stoppeurs). Ce sont des données historiques, pas créées par tes utilisateurs.">?</span></div>
        <div class="kpi-sub" id="kpi-hitchwiki-countries"></div>
      </div>
      <div class="kpi">
        <div class="kpi-value blue" id="kpi-spots"><span class="spinner"></span></div>
        <div class="kpi-label">Spots communautaires <span class="help-tip" title="Spots créés par les utilisateurs de SpotHitch via le bouton Ajouter un spot dans l'app.">?</span></div>
      </div>
      <div class="kpi">
        <div class="kpi-value amber" id="kpi-pending"><span class="spinner"></span></div>
        <div class="kpi-label">En attente de modération <span class="help-tip" title="Conseils de guides et signalements qui attendent ta décision avant d'être visibles ou traités.">?</span></div>
      </div>
    </div>

    <!-- Two-column: Sentry + Activity -->
    <div class="two-col">
      <div class="card">
        <div class="card-title red">Erreurs Sentry <span class="help-tip" title="Bugs détectés automatiquement quand un utilisateur rencontre un problème dans l'app. Les erreurs critiques doivent être corrigées rapidement.">?</span></div>
        <div id="sentry-list">
          <div style="text-align:center;padding:16px;"><span class="spinner"></span></div>
        </div>
      </div>
      <div class="card">
        <div class="card-title purple">Dernière activité</div>
        <div id="activity-list">
          <div style="text-align:center;padding:16px;"><span class="spinner"></span></div>
        </div>
      </div>
    </div>

    <!-- Cleanup bar -->
    <div class="cleanup-bar" id="cleanup-section">
      <span class="cleanup-text" id="cleanup-summary"><span class="spinner"></span></span>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-reject" id="cleanup-all-btn" disabled>Tout nettoyer</button>
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

      // Store pending count for nav badge update
      if (window.__updatePendingBadge) {
        window.__updatePendingBadge(stats.pendingTipsCount)
      }

      // Update cleanup summary
      const summaryEl = document.getElementById('cleanup-summary')
      const totalTest = stats.testUserCount + stats.testSpotCount + stats.testReportCount
      if (summaryEl) {
        summaryEl.textContent = `🧹 ${stats.testUserCount} comptes · ${stats.testSpotCount} spots · ${stats.testReportCount} signalements de test`
      }
      const cleanAllBtn = document.getElementById('cleanup-all-btn')
      if (cleanAllBtn) cleanAllBtn.disabled = totalTest === 0
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
      renderActivity(recentUsers, recentSpots)
    })
    .catch((err) => {
      console.error('Failed to load activity:', err)
      const el = document.getElementById('activity-list')
      if (el) el.innerHTML = '<div style="text-align:center;padding:8px;font-size:12px;color:#64748b;">Erreur de chargement</div>'
    })

  // Cleanup button
  const cleanAllBtn = document.getElementById('cleanup-all-btn')
  if (cleanAllBtn) cleanAllBtn.addEventListener('click', runCleanupAll)
}

async function runCleanupAll() {
  const btn = document.getElementById('cleanup-all-btn')
  if (!btn) return

  try {
    const [allUsers, allSpots, allReports] = await Promise.all([
      loadAllUsers(),
      loadAllSpots(),
      loadAllDocs('reports').catch(() => []),
    ])
    const realUsers = allUsers.filter((u) => isRealUser(u))
    const testUsers = allUsers.filter((u) => isTestUser(u))
    const realUserIds = realUsers.map((u) => u.id)
    const testSpots = allSpots.filter((s) => !isRealSpot(s, realUserIds))
    const testReports = allReports // all reports are from tests for now

    const totalTest = testUsers.length + testSpots.length + testReports.length
    if (totalTest === 0) {
      window.__showToast?.('Rien a nettoyer, tout est propre', 'info')
      return
    }

    if (!confirm(`Tout nettoyer ?\n\nSupprime :\n· ${testSpots.length} spots de test\n· ${testUsers.length} comptes de test\n· ${testReports.length} signalements de test\n\nAucune donnée de vrai utilisateur ne sera touchée.\nCette action est irréversible.`)) return

    btn.disabled = true
    btn.textContent = 'Nettoyage en cours...'

    let deleted = 0
    for (const s of testSpots) {
      try { await deleteDocument('spots', s.id); deleted++ } catch (err) { console.error('Failed:', err) }
    }
    for (const u of testUsers) {
      try { await deleteDocument('users', u.id); deleted++ } catch (err) { console.error('Failed:', err) }
    }
    for (const r of testReports) {
      try { await deleteDocument('reports', r.id); deleted++ } catch (err) { console.error('Failed:', err) }
    }

    btn.disabled = true
    btn.textContent = 'Tout nettoyer'
    const summaryEl = document.getElementById('cleanup-summary')
    if (summaryEl) summaryEl.textContent = '🧹 0 comptes · 0 spots · 0 signalements de test'

    window.__showToast?.(`${deleted} éléments de test supprimés`, 'success')
  } catch (err) {
    console.error('Cleanup error:', err)
    btn.disabled = false
    btn.textContent = 'Tout nettoyer'
    window.__showToast?.('Erreur lors du nettoyage', 'error')
  }
}

async function loadAndRenderSentry() {
  const el = document.getElementById('sentry-list')
  if (!el) return
  el.innerHTML = '<div style="text-align:center;padding:16px;"><span class="spinner"></span></div>'

  try {
    const issues = await loadSentryIssues()
    if (issues.length === 0) {
      el.innerHTML = '<div style="text-align:center;padding:8px;font-size:12px;color:#64748b;">Aucune erreur critique</div>'
      return
    }

    el.innerHTML = issues
      .slice(0, 10)
      .map((issue) => {
        const title = escapeHTML(issue.title || 'Sans titre')
        const date = timeAgo(issue.created_at)
        const linkHtml = issue.html_url
          ? `<a href="${escapeHTML(issue.html_url)}" target="_blank" rel="noopener" class="sentry-link">Voir</a>`
          : ''
        return `
        <div class="sentry-item">
          <span class="sentry-title">${title}</span>
          <span class="sentry-date">${date}</span>
          ${linkHtml}
        </div>`
      })
      .join('')
  } catch (err) {
    console.error('Sentry load error:', err)
    el.innerHTML = '<div style="text-align:center;padding:8px;font-size:12px;color:#f87171;">Erreur de chargement Sentry</div>'
  }
}

function renderActivity(recentUsers, recentSpots) {
  const el = document.getElementById('activity-list')
  if (!el) return

  // Merge users and spots into a single activity list, sorted by time
  const activities = []

  if (recentUsers) {
    recentUsers.slice(0, 5).forEach((u) => {
      const name = escapeHTML(u.username || u.displayName || u.email || 'Anonyme')
      const date = u.lastLogin || u.createdAt
      activities.push({
        text: `${name} s'est connecté`,
        date,
        time: timeAgo(date),
      })
    })
  }

  if (recentSpots) {
    recentSpots.slice(0, 5).forEach((s) => {
      const title = escapeHTML(s.title || s.city || 'Spot')
      const country = s.country || s.countryCode || ''
      const date = s.createdAt
      activities.push({
        text: `Nouveau spot : ${title}${country ? ' (' + escapeHTML(country) + ')' : ''}`,
        date,
        time: timeAgo(date),
      })
    })
  }

  // Sort by date descending
  activities.sort((a, b) => {
    const da = a.date?.toDate ? a.date.toDate().getTime() : new Date(a.date || 0).getTime()
    const db = b.date?.toDate ? b.date.toDate().getTime() : new Date(b.date || 0).getTime()
    return db - da
  })

  if (activities.length === 0) {
    el.innerHTML = '<div style="text-align:center;padding:8px;font-size:12px;color:#64748b;">Aucune activité récente</div>'
    return
  }

  el.innerHTML = activities
    .slice(0, 8)
    .map(
      (a) => `
      <div class="activity-item">
        <span>${a.text}</span>
        <span class="slate">${a.time}</span>
      </div>`
    )
    .join('')
}
