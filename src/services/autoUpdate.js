/**
 * Auto-Update System v4 — ZERO RELOAD
 *
 * RÈGLE ABSOLUE : JAMAIS de reload automatique.
 * Une PWA ne recharge JAMAIS la page pendant que l'utilisateur l'utilise.
 *
 * Stratégie :
 * - Le service worker (via vite-plugin-pwa) se met à jour en arrière-plan
 * - La nouvelle version est activée au prochain lancement de l'app
 * - Aucun polling, aucun timer, aucun fetch périodique
 * - Les seuls reload autorisés sont ceux déclenchés MANUELLEMENT par l'utilisateur
 *   (bouton "Réessayer", "Réinitialiser", etc.)
 */

// Flags used by other modules to guard manual reload buttons
window._authInProgress = false
window._authJustCompleted = 0
window._shareInProgress = false

/**
 * No-op — kept for backward compatibility with main.js import.
 * The service worker handles updates automatically via skipWaiting + clientsClaim.
 */
export function startVersionCheck() {
  // Nothing to do. The SW update cycle is:
  // 1. Browser checks for SW updates on navigation + visibilitychange (main.js)
  // 2. New SW installs in background, calls skipWaiting
  // 3. New SW activates on next app open (or next navigation)
  // 4. User gets new code without any reload during their session
}
