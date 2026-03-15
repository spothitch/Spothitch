/**
 * SpotHitch Admin Dashboard — Entry Point
 * Firebase init, auth gate, router
 */

import './styles/main.css'
import { onAuthChange, logOut } from './services/firebase.js'
import { isAdmin } from './services/auth.js'
import { renderLogin, bindLoginEvents } from './components/Login.js'
import { renderApp } from './components/App.js'
import { renderDashboard, bindDashboardEvents } from './components/Dashboard.js'
import {
  renderGuideModeration,
  bindGuideModerationEvents,
  resetGuideModerationCache,
} from './components/GuideModeration.js'
import { renderUserList, bindUserListEvents, resetUserListCache } from './components/UserList.js'
import { resetCleanupCache } from './components/Cleanup.js'

const appEl = document.getElementById('app')
let currentPage = 'dashboard'
let currentUser = null

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

// Router
function navigate(page) {
  currentPage = page
  resetGuideModerationCache()
  resetUserListCache()
  resetCleanupCache()
  renderPage()
}

// Make navigate global for debugging
window.__navigate = navigate

function renderPage() {
  if (!currentUser) {
    appEl.innerHTML = renderLogin()
    bindLoginEvents()
    return
  }

  if (!isAdmin(currentUser)) {
    appEl.innerHTML = `
      <div class="min-h-screen flex items-center justify-center p-4">
        <div class="card p-8 max-w-sm w-full text-center">
          <div class="text-5xl mb-4">🚫</div>
          <h1 class="font-display text-xl font-bold mb-2 text-danger-400">Acces refuse</h1>
          <p class="text-slate-400 text-sm mb-4">Ce compte n'a pas les droits administrateur.</p>
          <p class="text-xs text-slate-500 mb-6">${currentUser.email || ''}</p>
          <button id="denied-logout" class="btn-secondary w-full py-2">Se deconnecter</button>
        </div>
      </div>
    `
    document.getElementById('denied-logout')?.addEventListener('click', async () => {
      await logOut()
    })
    return
  }

  // Render app layout
  appEl.innerHTML = renderApp(currentPage)

  // Inject page content
  const mainContent = document.getElementById('main-content')
  if (!mainContent) return

  try {
    switch (currentPage) {
      case 'dashboard':
        mainContent.innerHTML = renderDashboard()
        bindDashboardEvents()
        break
      case 'guides':
        mainContent.innerHTML = renderGuideModeration()
        bindGuideModerationEvents()
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
    mainContent.innerHTML = '<p class="text-danger-400 p-8">Erreur de chargement</p>'
  }

  // Bind navigation — use event delegation on the sidebar for reliability
  bindNavigation()

  // Bind logout
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await logOut()
  })

  // Mobile menu
  const menuBtn = document.getElementById('mobile-menu-btn')
  const sidebar = document.getElementById('sidebar')
  const overlay = document.getElementById('sidebar-overlay')

  if (menuBtn && sidebar && overlay) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('-translate-x-full')
      overlay.classList.toggle('hidden')
    })
    overlay.addEventListener('click', closeMobileSidebar)
  }
}

function bindNavigation() {
  // Use event delegation on document body for maximum reliability
  document.body.addEventListener('click', (e) => {
    const navLink = e.target.closest('[data-nav]')
    if (!navLink) return
    e.preventDefault()
    const page = navLink.dataset.nav
    if (page && page !== currentPage) {
      navigate(page)
    }
    closeMobileSidebar()
  })
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar')
  const overlay = document.getElementById('sidebar-overlay')
  if (sidebar) sidebar.classList.add('-translate-x-full')
  if (overlay) overlay.classList.add('hidden')
}

// Auth state listener
onAuthChange((user) => {
  currentUser = user
  renderPage()
})
