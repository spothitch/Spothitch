/**
 * App Component — Layout with sidebar + content area
 */

export function renderApp(currentPage) {
  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: '📊' },
    { id: 'guides', label: 'Moderation Guides', icon: '📚' },
    { id: 'users', label: 'Utilisateurs', icon: '👤' },
  ]

  const navHtml = navItems
    .map(
      (item) => `
    <a href="#"
      data-nav="${item.id}"
      class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
        currentPage === item.id ? 'nav-active font-semibold' : 'text-slate-400 hover:text-white hover:bg-white/5'
      }">
      <span class="text-lg">${item.icon}</span>
      <span class="sidebar-label">${item.label}</span>
    </a>`
    )
    .join('')

  return `
    <!-- Mobile Header -->
    <div class="lg:hidden fixed top-0 left-0 right-0 z-50 bg-dark-primary/90 backdrop-blur-sm border-b border-white/5 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-xl">🛡️</span>
        <span class="font-display font-bold text-primary-400">Admin</span>
      </div>
      <button id="mobile-menu-btn" class="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5">
        <svg class="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>

    <!-- Sidebar -->
    <aside id="sidebar" class="fixed left-0 top-0 bottom-0 w-64 bg-dark-secondary border-r border-white/5 z-40 transform -translate-x-full lg:translate-x-0 transition-transform">
      <div class="p-5 border-b border-white/5">
        <div class="flex items-center gap-3">
          <span class="text-2xl">🛡️</span>
          <div>
            <h2 class="font-display font-bold text-primary-400">SpotHitch</h2>
            <p class="text-xs text-slate-500">Admin Dashboard</p>
          </div>
        </div>
      </div>
      <nav class="p-3 flex flex-col gap-1">
        ${navHtml}
      </nav>
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
        <button id="logout-btn" class="w-full text-left px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-2">
          <span>🚪</span>
          <span class="sidebar-label">Deconnexion</span>
        </button>
        <a href="https://spothitch.com" target="_blank" rel="noopener"
          class="w-full text-left px-4 py-2 text-xs text-slate-500 hover:text-slate-300 rounded-lg flex items-center gap-2 mt-1">
          <span>🌍</span>
          <span class="sidebar-label">spothitch.com</span>
        </a>
      </div>
    </aside>

    <!-- Sidebar overlay (mobile) -->
    <div id="sidebar-overlay" class="fixed inset-0 bg-black/50 z-30 hidden lg:hidden"></div>

    <!-- Main Content -->
    <main id="main-content" class="lg:ml-64 pt-14 lg:pt-0 min-h-screen">
      <!-- Content injected here -->
    </main>
  `
}
