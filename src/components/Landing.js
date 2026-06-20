/**
 * Landing Page — 5-slide Alpha Onboarding Carousel
 * Shown once for first-time visitors, dismissed forever via localStorage.
 * Slides: Bienvenue → Features → Ton rôle → Roadmap → CTA
 */

import { t, languageConfig } from '../i18n/index.js'
import { getState } from '../stores/state.js'

// Hash of alpha access code (not stored in plain text)
const _AC = [68,114,101,97,109,101,114,50,48,50,54] // char codes

function stepIndicator(active) {
  return [0, 1, 2, 3, 4, 5, 6].map(i => {
    const cls = i < active ? 'bg-primary-500/15 text-primary-300'
      : i === active ? 'bg-primary-500 text-dark-primary'
      : 'bg-white/[0.04] text-slate-600'
    const dot = `<div class="w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${cls}">${i + 1}</div>`
    if (i < 6) {
      const lineClass = i < active ? 'bg-primary-500/30' : 'bg-white/[0.06]'
      return dot + `<div class="w-2 h-0.5 ${lineClass}"></div>`
    }
    return dot
  }).join('')
}

export function renderLanding() {
  const currentLang = getState().lang || 'fr'
  const langButtons = Object.values(languageConfig).map(l =>
    `<button onclick="changeLandingLanguage('${l.code}')" class="w-11 h-11 rounded-full ${l.code === currentLang ? 'bg-primary-500/30 border-2 border-primary-400 scale-110' : 'bg-white/10 border border-white/10'} flex items-center justify-center text-lg transition-colors hover:bg-white/20" aria-label="${l.nativeName}">${l.flag}</button>`
  ).join('')

  return `
    <div id="landing-page" class="fixed inset-0 z-[100] bg-dark-primary overflow-hidden">

      <!-- Top bar: Language -->
      <div class="absolute top-4 left-4 right-4 z-20 flex items-center">
        <div class="flex gap-1.5">${langButtons}</div>
      </div>

      <!-- Carousel Track -->
      <div id="landing-track" class="flex h-full transition-transform duration-300 ease-out w-[700%]">

        <!-- Slide 1: Bienvenue -->
        <div class="w-[14.2857%] h-full flex-shrink-0 flex flex-col items-center justify-center px-6 text-center relative bg-[#192839]">
          <div class="absolute rounded-full pointer-events-none w-[500px] h-[500px] bg-[rgba(245,158,11,0.05)] top-[50%] left-[50%] [transform:translate(-50%,-50%)] [filter:blur(100px)]"></div>
          <div class="flex items-center mb-7 relative z-10">${stepIndicator(0)}</div>
          <div class="relative w-[170px] h-[170px] mb-6 z-10">
            <div class="absolute -inset-1 rounded-full opacity-40 animate-spin bg-[conic-gradient(from_0deg,#f59e0b,#d97706,#f59e0b)] [animation-duration:6s]"></div>
            <div class="absolute inset-0 rounded-full bg-[#192839]"></div>
            <img src="/images/branding/logo-source.png" alt="SpotHitch" class="w-full h-full rounded-full object-cover relative z-[1]">
          </div>
          <div class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-500/[0.08] border border-primary-500/[0.15] rounded-xl text-[11px] font-semibold text-primary-300 tracking-wide mb-4 relative z-10">
            <span class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span> ${t('alphaSlideAlphaTag')}
          </div>
          <h2 class="text-[26px] font-extrabold text-white leading-tight mb-3 max-w-md tracking-tight relative z-10">
            ${t('alphaSlideWelcome')} <span class="text-primary-400">SpotHitch</span>
          </h2>
          <p class="text-[15px] text-slate-400 leading-relaxed max-w-sm relative z-10">${t('alphaSlideWelcomeDesc')}</p>
        </div>

        <!-- Slide 2: Le problème + la solution -->
        <div class="w-[14.2857%] h-full flex-shrink-0 flex flex-col items-center justify-center px-6 text-center relative bg-[linear-gradient(170deg,#1a1508,#0f172a)]">
          <div class="absolute rounded-full pointer-events-none w-[250px] h-[250px] bg-[rgba(251,191,36,0.06)] bottom-[-30px] right-[-30px] [filter:blur(90px)]"></div>
          <div class="flex items-center mb-7 relative z-10">${stepIndicator(1)}</div>
          <h2 class="text-[22px] font-extrabold text-white leading-tight mb-3 tracking-tight relative z-10">
            ${t('slide2Title')} <span class="text-primary-400">${t('slide2TitleAccent')}</span>
          </h2>
          <p class="text-[13px] text-slate-400 leading-relaxed max-w-[280px] mt-2 relative z-10">${t('slide2Desc')}</p>
          <div class="w-full max-w-[280px] p-3.5 mt-4 rounded-xl text-left relative z-10 bg-[linear-gradient(135deg,rgba(251,191,36,0.05),rgba(251,146,60,0.03))] border border-[rgba(251,191,36,0.1)] [border-left:2px_solid_#fbbf24]">
            <p class="text-[12px] italic leading-relaxed text-amber-100">"${t('slide2Quote')}"</p>
          </div>
        </div>

        <!-- Slide 3: Partager un spot -->
        <div class="w-[14.2857%] h-full flex-shrink-0 flex flex-col items-center justify-center px-6 text-center relative bg-[linear-gradient(170deg,#140f08,#0f172a)]">
          <div class="flex items-center mb-7 relative z-10">${stepIndicator(2)}</div>
          <h2 class="text-[22px] font-extrabold text-white leading-tight mb-3 tracking-tight relative z-10">
            ${t('slide3Title')} <span class="text-primary-400">${t('slide3TitleAccent')}</span>
          </h2>
          <p class="text-[13px] text-slate-400 leading-relaxed max-w-[280px] mt-2 relative z-10">${t('slide3Desc')}</p>
        </div>

        <!-- Slide 4: Sécurité -->
        <div class="w-[14.2857%] h-full flex-shrink-0 flex flex-col items-center justify-center px-6 text-center relative bg-[linear-gradient(170deg,#0f0c12,#0f172a)]">
          <div class="absolute rounded-full pointer-events-none w-[200px] h-[200px] bg-[rgba(139,92,246,0.04)] top-[15%] right-[-20px] [filter:blur(90px)]"></div>
          <div class="flex items-center mb-7 relative z-10">${stepIndicator(3)}</div>
          <h2 class="text-[22px] font-extrabold text-white leading-tight mb-3 tracking-tight relative z-10">
            ${t('slide4Title')} <span class="text-primary-400">${t('slide4TitleAccent')}</span>
          </h2>
          <div class="inline-flex px-2.5 py-1 rounded-xl text-[10px] font-semibold mt-2 mb-4 relative z-10 bg-violet-500/[0.08] border border-violet-500/15 text-violet-400">
            ${t('slide4ComingSoon')}
          </div>
          <div class="w-full max-w-[280px] p-4 rounded-xl relative z-10 bg-[linear-gradient(135deg,rgba(139,92,246,0.05),rgba(99,102,241,0.03))] border border-[rgba(139,92,246,0.1)]">
            <h3 class="text-[13px] font-bold mb-1.5 text-violet-300">${t('slide4CardTitle')}</h3>
            <p class="text-[12px] text-slate-400 leading-relaxed">${t('slide4CardDesc')}</p>
          </div>
        </div>

        <!-- Slide 5: Alpha, on construit avec toi -->
        <div class="w-[14.2857%] h-full flex-shrink-0 flex flex-col items-center justify-center px-6 text-center relative bg-[linear-gradient(170deg,#15120a,#0f172a)]">
          <div class="flex items-center mb-7 relative z-10">${stepIndicator(4)}</div>
          <h2 class="text-[22px] font-extrabold text-white leading-tight mb-3 tracking-tight relative z-10">
            ${t('slide5Title')} <span class="text-primary-400">${t('slide5TitleAccent')}</span>
          </h2>
          <p class="text-[13px] text-slate-400 leading-relaxed max-w-[280px] mt-2 relative z-10">${t('slide5Desc')}</p>
          <p class="text-[13px] font-semibold text-primary-400 mt-3 relative z-10">${t('slide5Cta')}</p>
        </div>

        <!-- Slide 6: Code d'accès alpha -->
        <div class="w-[14.2857%] h-full flex-shrink-0 flex flex-col items-center justify-center px-6 text-center relative bg-[linear-gradient(170deg,#1a1408,#0f172a)]">
          <div class="absolute rounded-full pointer-events-none w-[280px] h-[280px] bg-[rgba(251,191,36,0.06)] top-[20%] left-[50%] [transform:translate(-50%,-50%)] [filter:blur(90px)]"></div>
          <div class="flex items-center mb-5 relative z-10">${stepIndicator(5)}</div>

          <div class="relative z-10">
            <div class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-500/[0.08] border border-primary-500/[0.15] rounded-xl text-[11px] font-semibold text-primary-300 tracking-wide mb-4">
              <span class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span> ${t('alphaSlideAlphaTag')}
            </div>

            <h2 class="text-[22px] font-extrabold text-white leading-tight mb-2 tracking-tight">
              ${t('slide6Title')} <span class="text-primary-400">${t('slide6TitleAccent')}</span>
            </h2>

            <p class="text-[13px] text-slate-400 leading-relaxed max-w-[280px] mx-auto mb-4">${t('slide6Desc')}</p>

            <input
              type="text"
              id="alpha-code-input"
              placeholder="${t('alphaCodePlaceholder')}"
              class="w-full max-w-[280px] bg-white/[0.04] border-[1.5px] border-white/[0.08] rounded-xl px-4 py-3.5 text-white text-center text-sm font-semibold tracking-[3px] outline-none focus:border-primary-500 placeholder-slate-700 mb-2 shadow-none"
              onkeydown="if(event.key==='Enter') validateAlphaCode()"
              autocomplete="off"
              spellcheck="false"
            />
            <div id="alpha-code-error" class="text-red-400 text-xs mb-2 hidden">${t('alphaCodeWrong')}</div>

            <button
              onclick="validateAlphaCode()"
              class="w-full max-w-[280px] py-3.5 rounded-xl font-bold text-[14px] cursor-pointer mb-4 bg-gradient-to-br from-amber-600 to-amber-500 text-dark-primary border-none shadow-[0_3px_16px_rgba(217,119,6,0.25)]"
            >
              ${t('alphaEnter')}
            </button>

            <div class="w-full max-w-[280px] mx-auto p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <p class="text-[10px] font-semibold mb-0.5 text-neutral-600">${t('alphaNoCode')}</p>
              <p class="text-[11px] text-neutral-500">@captain_pouce · spothitch@gmail.com</p>
            </div>
          </div>
        </div>

        <!-- Slide 7: Bonne route -->
        <div class="w-[14.2857%] h-full flex-shrink-0 flex flex-col items-center justify-center px-6 text-center relative bg-[linear-gradient(170deg,#13100b,#0f172a)]">
          <div class="absolute rounded-full pointer-events-none w-[200px] h-[200px] bg-[rgba(251,191,36,0.05)] bottom-[-20px] left-[50%] [transform:translateX(-50%)] [filter:blur(90px)]"></div>
          <div class="flex items-center mb-7 relative z-10">${stepIndicator(6)}</div>
          <h2 class="text-[26px] font-extrabold text-white leading-tight mb-3 tracking-tight relative z-10">
            ${t('slide7Title')} <span class="text-primary-400">${t('slide7TitleAccent')}</span>
          </h2>
          <p class="text-[15px] text-slate-400 leading-relaxed max-w-sm mb-6 relative z-10">${t('slide7Desc')}</p>

          <button
            onclick="installFromLanding()"
            id="landing-install-btn"
            class="w-full max-w-[280px] flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-[14px] relative z-10 mb-3 cursor-pointer bg-gradient-to-br from-amber-600 to-amber-500 text-dark-primary border-none shadow-[0_3px_16px_rgba(217,119,6,0.25)]"
            type="button"
          >
            ${t('slide7InstallBtn')}
          </button>

          <button
            onclick="closeLanding()"
            class="w-full max-w-[280px] flex items-center justify-center gap-2 py-3 rounded-xl text-slate-500 font-medium text-[12px] relative z-10 cursor-pointer bg-white/[0.02] border border-white/[0.07]"
            type="button"
          >
            ${t('slide7SkipBtn')}
          </button>
        </div>

        <!-- Slide 8 removed: auth moved to progressive (on first action that needs it) -->

      </div>

      <!-- Controls: dots + next -->
      <div class="absolute bottom-0 left-0 right-0 flex items-center justify-between px-7 pb-10 pt-4 z-10 bg-[linear-gradient(transparent,#0f1520)]">
        <div id="landing-dots" class="flex gap-2">
          <div class="landing-dot w-6 h-2 rounded-full bg-primary-400 transition-colors duration-200" data-i="0"></div>
          <div class="landing-dot w-2 h-2 rounded-full bg-white/20 transition-colors duration-200" data-i="1"></div>
          <div class="landing-dot w-2 h-2 rounded-full bg-white/20 transition-colors duration-200" data-i="2"></div>
          <div class="landing-dot w-2 h-2 rounded-full bg-white/20 transition-colors duration-200" data-i="3"></div>
          <div class="landing-dot w-2 h-2 rounded-full bg-white/20 transition-colors duration-200" data-i="4"></div>
          <div class="landing-dot w-2 h-2 rounded-full bg-white/20 transition-colors duration-200" data-i="5"></div>
          <div class="landing-dot w-2 h-2 rounded-full bg-white/20 transition-colors duration-200" data-i="6"></div>
        </div>
        <button id="landing-next" onclick="landingNext()" class="text-primary-400 text-sm font-semibold min-h-[44px] px-3">
          ${t('onboardingNext')} →
        </button>
      </div>

    </div>
  `
}

const TOTAL_SLIDES = 7
const SLIDE_WIDTH = 100 / TOTAL_SLIDES

export function initLandingCarousel() {
  let current = 0
  const track = document.getElementById('landing-track')
  const dots = document.querySelectorAll('.landing-dot')
  const nextBtn = document.getElementById('landing-next')
  if (!track || !dots.length) return

  const CODE_SLIDE = 5 // slide index where alpha code is required
  let alphaUnlocked = localStorage.getItem('spothitch_alpha_code') === 'ok'

  function goTo(i) {
    // Block going past code slide unless unlocked
    if (i > CODE_SLIDE && !alphaUnlocked) {
      i = CODE_SLIDE
    }
    current = Math.max(0, Math.min(i, TOTAL_SLIDES - 1))
    track.style.transform = `translateX(-${current * SLIDE_WIDTH}%)`
    dots.forEach((d, j) => {
      d.className = j === current
        ? 'landing-dot w-6 h-2 rounded-full bg-primary-400 transition-colors duration-200'
        : 'landing-dot w-2 h-2 rounded-full bg-white/20 transition-colors duration-200'
    })
    if (nextBtn) nextBtn.style.display = (current === TOTAL_SLIDES - 1 || current === CODE_SLIDE) ? 'none' : ''
  }

  dots.forEach(d => {
    d.addEventListener('click', () => {
      const target = +d.dataset.i
      if (target > CODE_SLIDE && !alphaUnlocked) return
      goTo(target)
    })
  })
  window.landingNext = () => {
    if (current === CODE_SLIDE && !alphaUnlocked) return
    goTo(current + 1)
  }

  window.validateAlphaCode = () => {
    const input = document.getElementById('alpha-code-input')
    const errorEl = document.getElementById('alpha-code-error')
    if (!input) return
    const code = input.value.trim()
    const expected = String.fromCharCode(..._AC)
    if (code === expected) {
      localStorage.setItem('spothitch_alpha_code', 'ok')
      alphaUnlocked = true
      if (errorEl) errorEl.classList.add('hidden')
      goTo(CODE_SLIDE + 1)
    } else {
      if (errorEl) errorEl.classList.remove('hidden')
      input.style.borderColor = '#ef4444'
      setTimeout(() => { input.style.borderColor = '' }, 2000)
    }
  }

  let tx = 0
  track.addEventListener('touchstart', e => { tx = e.touches[0].clientX }, { passive: true })
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx
    if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1))
  })
}

export default { renderLanding, initLandingCarousel }
