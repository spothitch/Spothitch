/**
 * User List Component — Clickable cards with expandable details
 * Shows ONLY real users (filters out ci-*@spothitch.com test accounts)
 */

import { getAllDocs, getDocsByField } from '../services/firebase.js'
import { isTestEmail } from '../services/stats.js'

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

function formatDateTime(dateStr) {
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

let allUsers = null
let searchQuery = ''
let expandedUserId = null
let userDetailsCache = {}

export function renderUserList() {
  return `
    <div class="p-6 max-w-6xl mx-auto">
      <h1 class="font-display text-2xl font-bold mb-6 text-primary-400">Utilisateurs</h1>

      <!-- Search -->
      <div class="mb-6">
        <input
          id="user-search"
          type="text"
          placeholder="Rechercher par nom ou email..."
          class="w-full sm:w-80 px-4 py-2.5 rounded-lg bg-dark-card border border-dark-border text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary-500"
          value="${escapeHTML(searchQuery)}"
        />
      </div>

      <!-- User count -->
      <div id="user-count" class="text-sm text-slate-400 mb-4"></div>

      <!-- User cards -->
      <div id="user-cards">
        <div class="text-center py-8"><span class="spinner"></span></div>
      </div>
    </div>
  `
}

function renderUserCards(users) {
  const container = document.getElementById('user-cards')
  const countEl = document.getElementById('user-count')
  if (!container) return

  if (!users || users.length === 0) {
    container.innerHTML = '<p class="text-slate-500 text-center py-8">Aucun utilisateur</p>'
    if (countEl) countEl.textContent = '0 utilisateur'
    return
  }

  if (countEl) countEl.textContent = `${users.length} utilisateur${users.length > 1 ? 's' : ''}`

  container.innerHTML = users
    .map((u) => {
      const uid = escapeHTML(u.id)
      const username = escapeHTML(u.username || u.displayName || '')
      const email = escapeHTML(u.email || '')
      const joined = formatDate(u.createdAt || u.joinedAt)
      const points = u.points || u.totalPoints || 0
      const level = u.level || 1
      const spotsCount = u.spotsCreated || u.spotCount || 0
      const avatarUrl = u.photoURL || u.avatarUrl || ''
      const isExpanded = expandedUserId === u.id

      const avatarHtml = avatarUrl
        ? `<img src="${escapeHTML(avatarUrl)}" alt="" class="w-10 h-10 rounded-full object-cover" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
        + `<div class="w-10 h-10 rounded-full bg-primary-500/20 items-center justify-center text-primary-400 font-bold text-sm" style="display:none">${(username || email || '?')[0].toUpperCase()}</div>`
        : `<div class="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-sm">${(username || email || '?')[0].toUpperCase()}</div>`

      return `
      <div class="card mb-3 overflow-hidden">
        <div class="p-4 cursor-pointer hover:bg-white/[0.02] transition-colors" data-user-toggle="${uid}">
          <div class="flex items-center gap-3">
            ${avatarHtml}
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-medium text-white text-sm">${username || '<span class="text-slate-500">Sans nom</span>'}</span>
                <span class="text-xs text-slate-500">${email}</span>
              </div>
              <div class="flex items-center gap-3 mt-1 text-xs text-slate-500">
                <span>${joined ? 'Inscrit ' + joined : ''}</span>
                <span class="text-primary-400 font-medium">${points} pts</span>
                <span class="text-emerald-400">${spotsCount} spot${spotsCount > 1 ? 's' : ''}</span>
                <span>Niv. ${level}</span>
              </div>
            </div>
            <svg class="w-5 h-5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>
        ${isExpanded ? `<div class="border-t border-white/5 p-4 bg-white/[0.01]" id="user-detail-${uid}"><div class="text-center py-4"><span class="spinner"></span></div></div>` : ''}
      </div>`
    })
    .join('')

  // Bind click handlers
  container.querySelectorAll('[data-user-toggle]').forEach((el) => {
    el.addEventListener('click', () => {
      const uid = el.dataset.userToggle
      if (expandedUserId === uid) {
        expandedUserId = null
      } else {
        expandedUserId = uid
      }
      renderUserCards(filterUsers())
      // If expanded, load details
      if (expandedUserId) {
        loadUserDetails(expandedUserId)
      }
    })
  })
}

async function loadUserDetails(uid) {
  const detailEl = document.getElementById(`user-detail-${uid}`)
  if (!detailEl) return

  // Use cache if available
  if (userDetailsCache[uid]) {
    renderUserDetail(detailEl, uid, userDetailsCache[uid])
    return
  }

  try {
    const [userSpots, userTips] = await Promise.all([
      getDocsByField('spots', 'creatorId', uid).catch(() => []),
      getDocsByField('guideTips', 'userId', uid).catch(() => []),
    ])

    userDetailsCache[uid] = { spots: userSpots, tips: userTips }
    renderUserDetail(detailEl, uid, userDetailsCache[uid])
  } catch (err) {
    console.error('Failed to load user details:', err)
    detailEl.innerHTML = '<p class="text-danger-400 text-sm">Erreur de chargement des details</p>'
  }
}

function renderUserDetail(el, uid, data) {
  const user = allUsers.find((u) => u.id === uid)
  if (!user) return

  const username = escapeHTML(user.username || user.displayName || 'Sans nom')
  const email = escapeHTML(user.email || '')
  const joined = formatDateTime(user.createdAt || user.joinedAt)
  const lastLogin = formatDateTime(user.lastLogin)
  const points = user.points || user.totalPoints || 0
  const level = user.level || 1
  const badges = user.badges || []
  const avatarUrl = user.photoURL || user.avatarUrl || ''

  const badgesHtml = badges.length > 0
    ? badges.map((b) => `<span class="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded">${escapeHTML(typeof b === 'string' ? b : b.name || b.id || '')}</span>`).join(' ')
    : '<span class="text-xs text-slate-600">Aucun badge</span>'

  const spotsHtml = data.spots.length > 0
    ? data.spots.map((s) => {
        const title = escapeHTML(s.title || s.city || `${(s.lat || 0).toFixed(2)}, ${(s.lng || 0).toFixed(2)}`)
        const country = escapeHTML(s.country || s.countryCode || '')
        const date = formatDate(s.createdAt)
        return `
        <div class="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
          <div class="flex items-center gap-2">
            <span class="text-sm text-slate-200">${title}</span>
            ${country ? `<span class="text-xs text-slate-500">${country}</span>` : ''}
          </div>
          <span class="text-xs text-slate-600">${date}</span>
        </div>`
      }).join('')
    : '<p class="text-xs text-slate-600">Aucun spot cree</p>'

  const tipsHtml = data.tips.length > 0
    ? data.tips.map((t) => {
        const text = escapeHTML((t.text || '').slice(0, 80))
        const status = t.status || 'pending'
        const statusColor = status === 'approved' ? 'text-emerald-400' : status === 'rejected' ? 'text-danger-400' : 'text-amber-400'
        return `
        <div class="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
          <span class="text-sm text-slate-200 truncate flex-1 mr-2">${text || 'Sans texte'}</span>
          <span class="text-xs ${statusColor}">${escapeHTML(status)}</span>
        </div>`
      }).join('')
    : '<p class="text-xs text-slate-600">Aucune contribution guide</p>'

  el.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <div>
        <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">Profil</div>
        <div class="text-sm text-slate-300 mb-1"><strong>Nom :</strong> ${username}</div>
        <div class="text-sm text-slate-300 mb-1"><strong>Email :</strong> ${email}</div>
        ${avatarUrl ? `<div class="text-sm text-slate-300 mb-1"><strong>Avatar :</strong> <img src="${escapeHTML(avatarUrl)}" class="w-8 h-8 rounded-full inline-block align-middle" onerror="this.style.display='none'"></div>` : ''}
      </div>
      <div>
        <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">Activite</div>
        <div class="text-sm text-slate-300 mb-1"><strong>Inscription :</strong> ${joined || 'Inconnue'}</div>
        <div class="text-sm text-slate-300 mb-1"><strong>Derniere connexion :</strong> ${lastLogin || 'Inconnue'}</div>
        <div class="text-sm text-slate-300 mb-1"><strong>Points :</strong> <span class="text-primary-400">${points}</span> · Niveau ${level}</div>
      </div>
    </div>

    <div class="mb-3">
      <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">Badges</div>
      <div class="flex flex-wrap gap-1">${badgesHtml}</div>
    </div>

    <div class="mb-3">
      <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">Spots crees (${data.spots.length})</div>
      <div class="max-h-40 overflow-y-auto">${spotsHtml}</div>
    </div>

    <div class="mb-3">
      <div class="text-xs text-slate-500 uppercase tracking-wide mb-1">Contributions guide (${data.tips.length})</div>
      <div class="max-h-40 overflow-y-auto">${tipsHtml}</div>
    </div>

    <div class="flex justify-end">
      <button class="text-xs text-danger-400 hover:text-danger-300 border border-danger-400/30 hover:border-danger-400 px-3 py-1.5 rounded transition-colors" data-ban-user="${escapeHTML(uid)}">
        Bannir
      </button>
    </div>
  `

  // Bind ban button (UI only, no action yet)
  el.querySelector('[data-ban-user]')?.addEventListener('click', (e) => {
    e.stopPropagation()
    window.__showToast?.('Fonction de bannissement pas encore implementee', 'info')
  })
}

function filterUsers() {
  if (!allUsers) return []
  if (!searchQuery) return allUsers

  const q = searchQuery.toLowerCase()
  return allUsers.filter((u) => {
    const name = (u.username || u.displayName || '').toLowerCase()
    const email = (u.email || '').toLowerCase()
    return name.includes(q) || email.includes(q)
  })
}

export async function bindUserListEvents() {
  // Search input
  const input = document.getElementById('user-search')
  if (input) {
    input.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim()
      expandedUserId = null
      renderUserCards(filterUsers())
    })
  }

  // Load users (filter out test accounts)
  try {
    const rawUsers = await getAllDocs('users', 'lastLogin', 500)
    allUsers = rawUsers.filter((u) => !isTestEmail(u.email))
    renderUserCards(filterUsers())
  } catch (err) {
    console.error('Failed to load users:', err)
    const container = document.getElementById('user-cards')
    if (container) {
      container.innerHTML = '<p class="text-danger-400 text-center py-8">Erreur de chargement</p>'
    }
  }
}

export function resetUserListCache() {
  allUsers = null
  searchQuery = ''
  expandedUserId = null
  userDetailsCache = {}
}
