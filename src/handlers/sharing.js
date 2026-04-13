/**
 * Share Handlers
 * Global share actions (spots, badges, stats, app).
 * Extracted from main.js.
 */

import { getState } from '../stores/state.js'

window.shareSpot = async (...args) => {
  const { shareSpot } = await import('../utils/share.js')
  shareSpot(...args)
}
window.shareBadge = async (...args) => {
  const { shareBadge } = await import('../utils/share.js')
  shareBadge(...args)
}
window.shareStats = async (...args) => {
  const { shareStats } = await import('../utils/share.js')
  shareStats(...args)
}
window.shareApp = async (...args) => {
  const { shareApp } = await import('../utils/share.js')
  shareApp(...args)
}
window.openShareCard = async () => {
  const state = getState()
  const spot = state.selectedSpot
  if (!spot) return
  const { showShareModal } = await import('../services/shareCard.js')
  showShareModal(spot)
}
