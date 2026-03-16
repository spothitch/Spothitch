/**
 * SpotHitch Admin Dashboard — Entry Point
 * Firebase init, auth gate, router
 * V1 Clean design
 */

import './styles/main.css'
import { onAuthChange, logOut } from './services/firebase.js'
import { isAdmin } from './services/auth.js'
import { renderLogin, bindLoginEvents } from './components/Login.js'
import { renderApp } from './components/App.js'
import { renderDashboard, bindDashboardEvents } from './components/Dashboard.js'
import {
  renderModeration,
  bindModerationEvents,
  resetModerationCache,
} from './components/Moderation.js'
import { renderUserList, bindUserListEvents, resetUserListCache } from './components/UserList.js'
import { renderSpotList, bindSpotListEvents, resetSpotListCache } from './components/SpotList.js'

const appEl = document.getElementById('app')
let currentPage = 'dashboard'
let currentUser = null
let pendingCount = 0

// Toast helper
window.__showToast = function (message, type = 'info') {
  const existing = document.querySelector('.toast')
  if (existing) existing.remove()

  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  toast.textContent = message
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 3000)
}

// Pending badge update helper (called from Dashboard and Moderation)
window.__updatePendingBadge = function (count) {
  pendingCount = count || 0
  const badge = document.querySelector('[data-nav="moderation"] .nav-badge')
  if (badge) {
    badge.textContent = pendingCount
    badge.style.display = pendingCount > 0 ? '' : 'none'
  }
}

// Router
function navigate(page) {
  currentPage = page
  resetModerationCache()
  resetUserListCache()
  resetSpotListCache()
  renderPage()
}

// Make navigate global for components
window.__navigate = navigate

function renderPage() {
  if (!currentUser) {
    appEl.innerHTML = renderLogin()
    bindLoginEvents()
    return
  }

  if (!isAdmin(currentUser)) {
    appEl.innerHTML = `
      <div class="login-container">
        <div class="login-card">
          <div class="login-icon">🚫</div>
          <h1 class="login-title" style="color:#f87171;">Accès refusé</h1>
          <p class="login-subtitle">Ce compte n'a pas les droits administrateur.</p>
          <p class="denied-email">${currentUser.email || ''}</p>
          <button id="denied-logout" class="btn-secondary" style="width:100%;padding:10px;">Se déconnecter</button>
        </div>
      </div>
    `
    document.getElementById('denied-logout')?.addEventListener('click', async () => {
      await logOut()
    })
    return
  }

  // Render app layout with sidebar
  appEl.innerHTML = renderApp(currentPage, pendingCount)

  // Inject page content
  const mainContent = document.getElementById('main-content')
  if (!mainContent) return

  try {
    switch (currentPage) {
      case 'dashboard':
        mainContent.innerHTML = renderDashboard()
        bindDashboardEvents()
        break
      case 'spots':
        mainContent.innerHTML = renderSpotList()
        bindSpotListEvents()
        break
      case 'moderation':
        mainContent.innerHTML = renderModeration()
        bindModerationEvents()
        break
      case 'users':
        mainContent.innerHTML = renderUserList()
        bindUserListEvents()
        break
      default:
        mainContent.innerHTML = renderDashboard()
        bindDashboardEvents()
    }
  } catch (err) {
    console.error('Error rendering page:', err)
    mainContent.innerHTML = '<div style="text-align:center;padding:32px;font-size:13px;color:#f87171;">Erreur de chargement</div>'
  }

  // Bind navigation (event delegation)
  bindNavigation()

  // Bind logout
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await logOut()
  })
}

function bindNavigation() {
  document.body.addEventListener('click', (e) => {
    const navItem = e.target.closest('[data-nav]')
    if (!navItem) return
    e.preventDefault()
    const page = navItem.dataset.nav
    if (page && page !== currentPage) {
      navigate(page)
    }
  })
}

// Auth state listener
onAuthChange((user) => {
  currentUser = user
  renderPage()
})
