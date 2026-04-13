/**
 * App Component — V1 Clean Layout: fixed sidebar 220px + main content
 */

export function renderApp(currentPage, pendingCount = 0) {
  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: '📊' },
    { id: 'spots', label: 'Spots', icon: '📍' },
    { id: 'moderation', label: 'Modération', icon: '⚖️', badge: pendingCount },
    { id: 'users', label: 'Utilisateurs', icon: '👤' },
    { id: 'identity', label: 'Identité', icon: '🪪' },
  ]

  const navHtml = navItems
    .map((item) => {
      const isActive = currentPage === item.id
      const badgeHtml =
        item.badge && item.badge > 0
          ? `<span class="nav-badge">${item.badge}</span>`
          : ''
      return `
      <div class="nav-item ${isActive ? 'active' : ''}" data-nav="${item.id}">
        ${item.icon} ${item.label} ${badgeHtml}
      </div>`
    })
    .join('')

  return `
    <div class="layout">
      <nav class="sidebar">
        <h2>🛡️ SpotHitch</h2>
        <div class="sub">Admin Dashboard</div>
        ${navHtml}
        <div class="sidebar-bottom">
          <a href="https://spothitch.com" target="_blank" rel="noopener">🌍 spothitch.com</a>
          <button class="sidebar-link" id="logout-btn">🚪 Deconnexion</button>
        </div>
      </nav>
      <div class="main" id="main-content">
        <!-- Content injected here -->
      </div>
    </div>
  `
}
