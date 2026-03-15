/**
 * User List Component — Show registered users with search
 */

import { getAllDocs } from '../services/firebase.js'

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

let allUsers = null
let searchQuery = ''

export function renderUserList() {
  return `
    <div class="p-6 max-w-6xl mx-auto">
      <h1 class="font-display text-2xl font-bold mb-6 text-primary-400">Utilisateurs</h1>

      <!-- Search -->
      <div class="mb-6">
        <input
          id="user-search"
          type="text"
          placeholder="Rechercher par nom d'utilisateur..."
          class="w-full sm:w-80 px-4 py-2.5 rounded-lg bg-dark-card border border-dark-border text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary-500"
          value="${escapeHTML(searchQuery)}"
        />
      </div>

      <!-- User count -->
      <div id="user-count" class="text-sm text-slate-400 mb-4"></div>

      <!-- User table -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table id="user-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Inscription</th>
                <th>Derniere connexion</th>
                <th>Points</th>
                <th>Spots</th>
              </tr>
            </thead>
            <tbody id="user-tbody">
              <tr><td colspan="6" class="text-center py-8"><span class="spinner"></span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
}

function renderUserRows(users) {
  const tbody = document.getElementById('user-tbody')
  const countEl = document.getElementById('user-count')
  if (!tbody) return

  if (!users || users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-slate-500">Aucun utilisateur</td></tr>'
    if (countEl) countEl.textContent = '0 utilisateur'
    return
  }

  if (countEl) countEl.textContent = `${users.length} utilisateur${users.length > 1 ? 's' : ''}`

  tbody.innerHTML = users
    .map((u) => {
      const username = escapeHTML(u.username || u.displayName || '')
      const email = escapeHTML(u.email || '')
      const joined = formatDate(u.createdAt || u.joinedAt)
      const lastLogin = formatDate(u.lastLogin)
      const points = u.points || u.totalPoints || 0
      const spots = u.spotsCreated || u.spotCount || 0

      return `
      <tr>
        <td>
          <span class="font-medium text-white">${username || '<span class="text-slate-500">Sans nom</span>'}</span>
        </td>
        <td class="text-slate-400">${email}</td>
        <td>${joined}</td>
        <td>${lastLogin}</td>
        <td class="text-primary-400 font-medium">${points}</td>
        <td class="text-emerald-400 font-medium">${spots}</td>
      </tr>`
    })
    .join('')
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
      renderUserRows(filterUsers())
    })
  }

  // Load users
  try {
    allUsers = await getAllDocs('users', 'lastLogin', 500)
    renderUserRows(filterUsers())
  } catch (err) {
    console.error('Failed to load users:', err)
    const tbody = document.getElementById('user-tbody')
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-danger-400">Erreur de chargement</td></tr>'
    }
  }
}

export function resetUserListCache() {
  allUsers = null
  searchQuery = ''
}
