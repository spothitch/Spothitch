/**
 * Landing Page, Feedback Panel, and Contact Form Handlers
 * Carousel navigation, language switching, PWA install from landing
 */

import { escapeHTML } from '../utils/sanitize.js'
import { installPWA } from '../utils/pwa.js'
import { FEATURES_DATA } from '../data/featuresData.js'
import { getAllUserVotes } from '../services/featureVotes.js'
import { subscribe } from '../stores/state.js'

// Landing page dismiss handler — cookie consent is now handled by CookieBanner after carousel
window.dismissLanding = () => {
  const t = window.t
  // Guard: must be logged in to dismiss landing
  if (!window.getState().isLoggedIn) {
    const section = document.getElementById('landing-auth-section')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
      window.showToast(t('landingMustConnect'), 'error')
      return
    }
  }
  localStorage.setItem('spothitch_landing_v2', '1')
  window.setState({ showLanding: false })
}

window.closeLanding = () => {
  localStorage.setItem('spothitch_landing_v2', '1')
  window.setState({ showLanding: false })
}

// Toggle a hidden checkbox (visual is handled by renderToggle's onclick)
// Used by Landing cookies and Guardian notification toggles
window.toggleFormToggle = (checkboxId) => {
  const cb = document.getElementById(checkboxId)
  if (cb) cb.checked = !cb.checked
}

// Skip button in landing carousel → jump to slide 5 (auth)
window.skipToLandingAuth = () => {
  // Jump to code slide (index 5) — user must enter code first
  const alphaOk = localStorage.getItem('spothitch_alpha_code') === 'ok'
  const targetSlide = alphaOk ? 6 : 5 // last slide or code slide
  const slideWidth = 100 / 7
  const track = document.getElementById('landing-track')
  const dots = document.querySelectorAll('.landing-dot')
  const nextBtn = document.getElementById('landing-next')
  if (track) {
    track.style.transform = `translateX(-${targetSlide * slideWidth}%)`
    dots.forEach((d, j) => {
      d.className = j === targetSlide
        ? 'landing-dot w-6 h-2 rounded-full bg-primary-400 transition-colors duration-200'
        : 'landing-dot w-2 h-2 rounded-full bg-white/20 transition-colors duration-200'
    })
    if (nextBtn) nextBtn.style.display = 'none'
  }
}

// Change language from the onboarding carousel without page reload
window.changeLandingLanguage = async (langCode) => {
  // Load translations for new language
  const { setLanguage: setLangI18n } = await import('../i18n/index.js')
  await setLangI18n(langCode)
  // Persist to localStorage
  try {
    const stored = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
    stored.lang = langCode
    localStorage.setItem('spothitch_v4_state', JSON.stringify(stored))
  } catch { /* no-op */ }
  // Remove the preserved landing so it gets rebuilt with new translations
  const landing = document.getElementById('landing-page')
  if (landing) landing.remove()
  // Re-render (setState with lang triggers render, landing is rebuilt fresh)
  window.setState({ lang: langCode })
}

// Landing carousel next slide — stub until initLandingCarousel() overrides with real implementation.
// Must exist early so onclick="landingNext()" in landing HTML doesn't throw before carousel init.
if (!window.landingNext) window.landingNext = () => {}

window.installFromLanding = async () => {
  const t = window.t
  let installed = false
  try { installed = await installPWA() } catch { /* PWA not supported */ }
  const btn = document.getElementById('landing-install-btn')
  if (installed && btn) {
    btn.textContent = `icon('circle-check', 'w-4 h-4 inline mr-1') + ' ' + (t('appInstalled') || 'Application installée !'}`
    btn.style.background = '#22c55e'
    btn.disabled = true
    // Close after showing success
    setTimeout(() => {
      localStorage.setItem('spothitch_landing_v2', '1')
      window.setState({ showLanding: false })
    }, 1500)
  } else {
    // PWA not available — show manual install instructions popup
    _showInstallInstructions(t)
  }
}

function _showInstallInstructions(t) {
  // Remove existing popup if any
  document.getElementById('install-instructions-popup')?.remove()
  const popup = document.createElement('div')
  popup.id = 'install-instructions-popup'
  popup.className = 'fixed bottom-[120px] left-4 right-4 z-[999] animate-slide-up'
  popup.innerHTML = `
    <div class="bg-dark-primary/[0.97] backdrop-blur border border-white/10 rounded-2xl p-4 shadow-2xl">
      <div class="flex items-center justify-between mb-3">
        <span class="text-amber-400 font-bold text-sm">${t('manualInstallTitle') || 'Installation manuelle'}</span>
        <button onclick="this.closest('#install-instructions-popup').remove()" class="text-slate-500 text-xl bg-transparent border-none cursor-pointer" aria-label="${t('close') || 'Close'}">×</button>
      </div>
      <div class="flex flex-col gap-2.5">
        <div class="flex items-start gap-2.5">
          <div class="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0">1</div>
          <p class="text-[13px] text-slate-300 m-0">${t('installStep1') || 'Ouvre le <strong class="text-white">menu du navigateur</strong> (⋮ ou ⋯)'}</p>
        </div>
        <div class="flex items-start gap-2.5">
          <div class="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0">2</div>
          <p class="text-[13px] text-slate-300 m-0">${t('installStep2') || 'Choisis <strong class="text-white">"Ajouter à l\'écran d\'accueil"</strong>'}</p>
        </div>
        <div class="flex items-start gap-2.5">
          <div class="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center shrink-0">3</div>
          <p class="text-[13px] text-slate-300 m-0">${t('installStep3') || 'Confirme en appuyant sur <strong class="text-white">"Installer"</strong>'}</p>
        </div>
      </div>
      <button onclick="this.closest('#install-instructions-popup').remove();closeLanding()" class="w-full mt-3.5 py-2.5 rounded-[10px] bg-slate-500/20 text-slate-400 text-[13px] border-none cursor-pointer">${t('understood') || "J'ai compris"}</button>
    </div>`
  document.body.appendChild(popup)
}

window.installPWAFromLanding = () => {
  const t = window.t
  localStorage.setItem('spothitch_landing_v2', '1')
  window.setState({ showLanding: false })
  // Trigger PWA install prompt
  setTimeout(() => {
    try {
      installPWA()
    } catch (e) {
      window.showToast(t('addToHomeScreen') || 'Ajoutez SpotHitch depuis le menu de votre navigateur', 'info')
    }
  }, 300)
}

// Landing page & help handlers
window.openFAQ = () => {
  window.setState({ showFAQ: true, faqSearchQuery: '' });
};
window.closeFAQ = () => {
  window.setState({ showFAQ: false, faqSearchQuery: '' });
};
window.openHelpCenter = () => {
  window.setState({ showFAQ: true, faqSearchQuery: '' });
};
window.openChangelog = () => {
  window.setState({ showFeedbackPanel: true });
};
window.openRoadmap = () => {
  window.setState({ showFeedbackPanel: true });
};
window.openBugReport = () => {
  window.setState({ showContactForm: true });
};

// Feedback Panel
window.openFeedbackPanel = () => window.setState({ showFeedbackPanel: true })
window.closeFeedbackPanel = () => window.setState({ showFeedbackPanel: false, feedbackDetailFeature: null })

// Draggable Feedback Side Button
export function initDraggableFeedbackBtn() {
  const t = window.t
  const STORAGE_KEY = 'spothitch_fb_btn_y'
  const btn = document.createElement('button')
  btn.id = 'fb-side-btn'
  btn.setAttribute('aria-label', t('fbSideTab') || 'Avis')
  btn.innerHTML = `<span class="fb-badge" id="fb-badge"></span><span class="fb-label">${escapeHTML(t('fbSideTab') || 'Avis')}</span>`

  // Styles — amber on dark, darker amber on light for visibility
  const isLight = document.documentElement.classList.contains('light-theme')
  Object.assign(btn.style, {
    position: 'fixed', left: '0', zIndex: '30',
    padding: '10px 12px', border: 'none', cursor: 'grab',
    background: isLight ? 'linear-gradient(180deg, #d97706, #b45309)' : 'linear-gradient(180deg, #fbbf24, #f59e0b)',
    color: '#fff', borderRadius: '0 12px 12px 0',
    boxShadow: isLight ? '2px 0 15px rgba(180,83,9,0.4)' : '2px 0 15px rgba(245,158,11,0.3)',
    writingMode: 'vertical-rl', letterSpacing: '1px',
    touchAction: 'none', userSelect: 'none',
    transition: 'opacity 0.2s',
    minWidth: '44px',
    overflow: 'visible',
  })

  // Restore saved Y position or default to 45%
  const savedY = localStorage.getItem(STORAGE_KEY)
  const initialTop = savedY ? parseInt(savedY, 10) : Math.round(window.innerHeight * 0.45)
  btn.style.top = initialTop + 'px'

  // Pulse dot style
  const style = document.createElement('style')
  style.textContent = `
    #fb-side-btn .fb-badge { position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;border-radius:9px;background:#b91c1c;color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 4px;box-shadow:0 0 6px rgba(185,28,28,0.6);animation:fbBadgePop 0.3s ease-out }
    #fb-side-btn .fb-badge:empty { display:none }
    #fb-side-btn .fb-label { font-size:11px;font-weight:700;letter-spacing:1.5px }
    @keyframes fbBadgePop { from{transform:scale(0)} to{transform:scale(1)} }
  `
  document.head.appendChild(style)
  document.body.appendChild(btn)

  // Drag state
  let isDragging = false
  let startY = 0
  let startTop = 0
  let hasMoved = false

  function onMove(e) {
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const delta = clientY - startY
    if (Math.abs(delta) > 4) hasMoved = true
    const newTop = Math.max(60, Math.min(window.innerHeight - 80, startTop + delta))
    btn.style.top = newTop + 'px'
  }

  function onEnd() {
    if (!isDragging) return
    isDragging = false
    btn.style.cursor = 'grab'
    btn.style.transition = 'opacity 0.2s'
    // Remove move/end listeners when drag ends
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('touchend', onEnd)
    document.removeEventListener('mouseup', onEnd)
    // Save position
    localStorage.setItem(STORAGE_KEY, parseInt(btn.style.top, 10))
    // If not dragged, open panel
    if (!hasMoved) window.openFeedbackPanel()
  }

  function onStart(e) {
    isDragging = true
    hasMoved = false
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    startY = clientY
    startTop = parseInt(btn.style.top, 10) || initialTop
    btn.style.cursor = 'grabbing'
    btn.style.transition = 'none'
    // Attach move/end listeners only while dragging
    document.addEventListener('touchmove', onMove, { passive: false })
    document.addEventListener('mousemove', onMove)
    document.addEventListener('touchend', onEnd)
    document.addEventListener('mouseup', onEnd)
    e.preventDefault()
  }

  btn.addEventListener('touchstart', onStart, { passive: false })
  btn.addEventListener('mousedown', onStart)

  // Badge counter: show number of unvoted features
  function updateFeedbackBadge() {
    const badge = document.getElementById('fb-badge')
    if (!badge) return
    const votedCount = Object.keys(getAllUserVotes()).length
    const remaining = FEATURES_DATA.length - votedCount
    badge.textContent = remaining > 0 ? remaining : ''
  }

  // Visibility + theme: hide during SOS, landing, feedback panel open
  subscribe((state) => {
    const hidden = state.showSOS || state.showLanding || state.showFeedbackPanel
    btn.style.display = hidden ? 'none' : ''
    // Update badge when panel closes (user may have voted)
    if (!state.showFeedbackPanel) updateFeedbackBadge()
    // Update colors on theme change
    const light = document.documentElement.classList.contains('light-theme')
    btn.style.background = light ? 'linear-gradient(180deg, #d97706, #b45309)' : 'linear-gradient(180deg, #fbbf24, #f59e0b)'
    btn.style.boxShadow = light ? '2px 0 15px rgba(180,83,9,0.4)' : '2px 0 15px rgba(245,158,11,0.3)'
  })
  // Initial visibility check
  const s = window.getState()
  btn.style.display = (s.showSOS || s.showLanding || s.showFeedbackPanel) ? 'none' : ''
  updateFeedbackBadge()
}

// Contact Form handlers
window.openContactForm = () => {
  window.setState({ showContactForm: true });
};
window.closeContactForm = () => {
  window.setState({ showContactForm: false });
};
window.submitContactForm = async (event) => {
  const { handleContactFormSubmit } = await import('../components/modals/ContactForm.js');
  handleContactFormSubmit(event);
};
