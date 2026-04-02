/**
 * LoadingIndicator - Indicateur de chargement global humoristique
 * Affiche des messages amusants liés à l'autostop pendant le chargement
 */

import { t } from '../i18n/index.js'
import { icon } from '../utils/icons.js'

// Messages de chargement (liés à l'autostop) — Lucide icons (Rule #24)
function getLoadingMessages() {
  return [
    { text: t('loadingThumbUp') || 'Pouce en l\'air...', iconHtml: icon('thumbs-up', 'w-5 h-5') },
    { text: t('loadingSearchCar') || 'On cherche une voiture...', iconHtml: icon('car', 'w-5 h-5') },
    { text: t('loadingNegotiation') || 'Négociation avec le conducteur...', iconHtml: icon('handshake', 'w-5 h-5') },
    { text: t('loadingKarma') || 'Vérification du karma routier...', iconHtml: icon('sparkles', 'w-5 h-5') },
    { text: t('loadingDistance') || 'Calcul de la distance...', iconHtml: icon('map', 'w-5 h-5') },
    { text: t('loadingTreasureMap') || 'Consultation de la carte...', iconHtml: icon('scroll', 'w-5 h-5') },
    { text: t('loadingEngine') || 'Démarrage du moteur...', iconHtml: icon('key', 'w-5 h-5') },
    { text: t('loadingRoadside') || 'Attente sur le bord de la route...', iconHtml: icon('road', 'w-5 h-5') },
    { text: t('loadingGoodVibes') || 'Chargement des bonnes ondes...', iconHtml: icon('waves', 'w-5 h-5') },
    { text: t('loadingBackpack') || 'Préparation du sac à dos...', iconHtml: icon('backpack', 'w-5 h-5') },
    { text: t('loadingSigns') || 'Lecture des panneaux...', iconHtml: icon('sign-post', 'w-5 h-5') },
    { text: t('loadingWeather') || 'Vérification de la météo...', iconHtml: icon('sun', 'w-5 h-5') },
    { text: t('loadingThumbWarmup') || 'Échauffement du pouce...', iconHtml: icon('zap', 'w-5 h-5') },
    { text: t('loadingUniverse') || 'Synchronisation avec l\'univers...', iconHtml: icon('orbit', 'w-5 h-5') },
    { text: t('loadingStars') || 'Alignement des étoiles...', iconHtml: icon('star', 'w-5 h-5') },
  ]
}

// État du loader
const loaderState = {
  isVisible: false,
  mode: 'spinner', // 'bar' ou 'spinner'
  message: null,
  messageIndex: 0,
  intervalId: null,
  progress: 0,
}

/**
 * Obtenir un message aléatoire
 */
function getRandomMessage() {
  const messages = getLoadingMessages()
  const index = Math.floor(Math.random() * messages.length)
  return messages[index]
}

/**
 * Obtenir le prochain message (rotation)
 */
function getNextMessage() {
  const messages = getLoadingMessages()
  loaderState.messageIndex = (loaderState.messageIndex + 1) % messages.length
  return messages[loaderState.messageIndex]
}

/**
 * Créer le conteneur du loader s'il n'existe pas
 */
function ensureLoaderContainer() {
  let container = document.getElementById('global-loader')
  if (!container) {
    container = document.createElement('div')
    container.id = 'global-loader'
    container.setAttribute('role', 'alert')
    container.setAttribute('aria-live', 'polite')
    container.setAttribute('aria-busy', 'true')
    document.body.appendChild(container)
  }
  return container
}

/**
 * Rendu de la barre de chargement (style YouTube)
 */
function renderProgressBar() {
  return `
    <div class="loading-bar-container">
      <div class="loading-bar" style="width: ${loaderState.progress}%"></div>
    </div>
  `
}

/**
 * Rendu du spinner avec message
 */
function renderSpinner() {
  const msg = loaderState.message || getRandomMessage()
  return `
    <div class="loading-overlay">
      <div class="loading-content">
        <div class="loading-thumb-container">
          <div class="loading-thumb">${msg.iconHtml || icon('thumbs-up', 'w-5 h-5')}</div>
          <div class="loading-ripple"></div>
          <div class="loading-ripple loading-ripple-delayed"></div>
        </div>
        <p class="loading-message">${msg.text}</p>
        <div class="loading-dots">
          <span class="loading-dot"></span>
          <span class="loading-dot"></span>
          <span class="loading-dot"></span>
        </div>
      </div>
    </div>
  `
}

/**
 * Mettre à jour le rendu
 */
function updateRender() {
  const container = ensureLoaderContainer()
  if (loaderState.isVisible) {
    container.innerHTML = loaderState.mode === 'bar' ? renderProgressBar() : renderSpinner()
    container.classList.add('visible')
  } else {
    container.classList.remove('visible')
    container.classList.add('hiding')
    setTimeout(() => {
      container.classList.remove('hiding')
      container.innerHTML = ''
    }, 300)
  }
}

/**
 * Démarrer la rotation des messages
 */
function startMessageRotation() {
  if (loaderState.intervalId) return
  loaderState.intervalId = setInterval(() => {
    if (loaderState.isVisible && loaderState.mode === 'spinner') {
      loaderState.message = getNextMessage()
      updateRender()
    }
  }, 2500) // Change toutes les 2.5 secondes
}

/**
 * Arrêter la rotation des messages
 */
function stopMessageRotation() {
  if (loaderState.intervalId) {
    clearInterval(loaderState.intervalId)
    loaderState.intervalId = null
  }
}

/**
 * Afficher le loader
 * @param {Object} options - Options du loader
 * @param {string} options.mode - 'bar' ou 'spinner' (default: 'spinner')
 * @param {string} options.message - Message personnalisé (optionnel)
 */
export function showLoading(options = {}) {
  const { mode = 'spinner', message = null } = options

  loaderState.isVisible = true
  loaderState.mode = mode
  loaderState.message = message ? { text: message, iconHtml: icon('thumbs-up', 'w-5 h-5') } : getRandomMessage()
  loaderState.progress = mode === 'bar' ? 10 : 0

  updateRender()

  if (mode === 'spinner') {
    startMessageRotation()
  } else if (mode === 'bar') {
    // Animation de progression simulée
    animateProgressBar()
  }
}

/**
 * Animer la barre de progression
 */
function animateProgressBar() {
  const animate = () => {
    if (!loaderState.isVisible || loaderState.mode !== 'bar') return

    // Progression rapide au début, ralentit vers la fin
    if (loaderState.progress < 30) {
      loaderState.progress += Math.random() * 10
    } else if (loaderState.progress < 60) {
      loaderState.progress += Math.random() * 5
    } else if (loaderState.progress < 85) {
      loaderState.progress += Math.random() * 2
    }

    // Ne jamais dépasser 90% tant que hideLoading n'est pas appelé
    loaderState.progress = Math.min(loaderState.progress, 90)

    updateRender()

    if (loaderState.isVisible) {
      setTimeout(animate, 200 + Math.random() * 300)
    }
  }
  animate()
}

/**
 * Masquer le loader
 * @param {Object} options - Options
 * @param {boolean} options.success - Animation de succès (pour la barre)
 */
export function hideLoading(options = {}) {
  const { success = true } = options

  if (loaderState.mode === 'bar' && success) {
    // Compléter la barre avant de masquer
    loaderState.progress = 100
    updateRender()
    setTimeout(() => {
      loaderState.isVisible = false
      loaderState.progress = 0
      stopMessageRotation()
      updateRender()
    }, 200)
  } else {
    loaderState.isVisible = false
    loaderState.progress = 0
    stopMessageRotation()
    updateRender()
  }
}

/**
 * Mettre à jour le message du loader
 * @param {string} message - Nouveau message
 */
export function setLoadingMessage(message) {
  if (loaderState.isVisible) {
    loaderState.message = { text: message, iconHtml: icon('thumbs-up', 'w-5 h-5') }
    updateRender()
  }
}

/**
 * Mettre à jour la progression de la barre
 * @param {number} progress - Valeur entre 0 et 100
 */
export function setLoadingProgress(progress) {
  if (loaderState.isVisible && loaderState.mode === 'bar') {
    loaderState.progress = Math.min(Math.max(progress, 0), 100)
    updateRender()
  }
}

/**
 * Vérifier si le loader est visible
 */
export function isLoading() {
  return loaderState.isVisible
}

/**
 * Wrapper pour exécuter une fonction async avec loading
 * @param {Function} asyncFn - Fonction asynchrone à exécuter
 * @param {Object} options - Options du loader
 * @returns {Promise} - Résultat de la fonction
 */
export async function withLoading(asyncFn, options = {}) {
  showLoading(options)
  try {
    const result = await asyncFn()
    hideLoading({ success: true })
    return result
  } catch (error) {
    hideLoading({ success: false })
    throw error
  }
}

export default {
  showLoading,
  hideLoading,
  setLoadingMessage,
  setLoadingProgress,
  isLoading,
  withLoading,
}
