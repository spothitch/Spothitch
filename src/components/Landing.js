/**
 * Landing Page — 5-slide Alpha Onboarding Carousel
 * Shown once for first-time visitors, dismissed forever via localStorage.
 * Slides: Bienvenue → Features → Ton rôle → Roadmap → CTA
 */

import { t, languageConfig } from '../i18n/index.js'
import { getState } from '../stores/state.js'

function stepIndicator(active) {
  return [0, 1, 2, 3, 4].map(i => {
    const cls = i < active ? 'bg-primary-500/15 text-primary-300'
      : i === active ? 'bg-primary-500 text-dark-primary'
      : 'bg-white/[0.04] text-slate-600'
    const dot = `<div class="w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${cls}">${i + 1}</div>`
    if (i < 4) {
      const lineClass = i < active ? 'bg-primary-500/30' : 'bg-white/[0.06]'
      return dot + `<div class="w-6 h-0.5 ${lineClass}"></div>`
    }
    return dot
  }).join('')
}

export function renderLanding() {
  const currentLang = getState().lang || 'fr'
  const langButtons = Object.values(languageConfig).map(l =>
    `<button onclick="changeLandingLanguage('${l.code}')" class="w-10 h-10 rounded-full ${l.code === currentLang ? 'bg-primary-500/30 border-2 border-primary-400 scale-110' : 'bg-white/10 border border-white/10'} flex items-center justify-center text-lg transition-colors hover:bg-white/20" aria-label="${l.nativeName}">${l.flag}</button>`
  ).join('')

  return `
    <div id="landing-page" class="fixed inset-0 z-[100] bg-dark-primary overflow-hidden">

      <!-- Top bar: Language + Skip -->
      <div class="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        <div class="flex gap-1.5">${langButtons}</div>
        <button onclick="skipToLandingAuth()" class="px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-full text-slate-500 text-[13px] font-medium">${t('alphaSlideSkip')}</button>
      </div>

      <!-- Carousel Track -->
      <div id="landing-track" class="flex h-full transition-transform duration-300 ease-out" style="width:500%">

        <!-- Slide 1: Bienvenue -->
        <div class="w-[20%] h-full flex-shrink-0 flex flex-col items-center justify-center px-6 text-center relative" style="background:#192839">
          <div class="absolute rounded-full pointer-events-none" style="width:500px;height:500px;background:rgba(245,158,11,0.05);top:50%;left:50%;transform:translate(-50%,-50%);filter:blur(100px)"></div>
          <div class="flex items-center mb-7 relative z-10">${stepIndicator(0)}</div>
          <div class="relative w-[170px] h-[170px] mb-6 z-10">
            <div class="absolute -inset-1 rounded-full opacity-40 animate-spin" style="background:conic-gradient(from 0deg,#f59e0b,#d97706,#f59e0b);animation-duration:6s"></div>
            <div class="absolute inset-0 rounded-full" style="background:#192839"></div>
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

        <!-- Slide 2: L'app en un coup d'œil -->
        <div class="w-[20%] h-full flex-shrink-0 flex flex-col items-center justify-center px-6 text-center relative" style="background:linear-gradient(180deg,#101722,#0f1520)">
          <div class="absolute rounded-full pointer-events-none" style="width:350px;height:350px;background:rgba(245,158,11,0.04);bottom:-80px;left:-80px;filter:blur(100px)"></div>
          <div class="flex items-center mb-7 relative z-10">${stepIndicator(1)}</div>
          <h2 class="text-[26px] font-extrabold text-white leading-tight mb-5 tracking-tight relative z-10">
            ${t('alphaSlideOverview')} <span class="text-primary-400">${t('alphaSlideOverviewAccent')}</span>
          </h2>

          <div class="w-full max-w-[340px] p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl mb-3 relative z-10">
            <div class="flex items-center gap-3 text-left">
              <span class="text-[28px] shrink-0">📍</span>
              <span class="text-[17px] font-bold text-slate-200">${t('alphaSlideFeatureMap')}</span>
            </div>
            <p class="text-[13px] text-slate-400 mt-1.5 leading-relaxed text-left">${t('alphaSlideFeatureMapDesc')}</p>
          </div>

          <div class="w-full max-w-[340px] p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl mb-3 relative z-10">
            <div class="flex items-center gap-3 text-left">
              <span class="text-[28px] shrink-0">📖</span>
              <span class="text-[17px] font-bold text-slate-200">${t('alphaSlideFeatureGuides')}</span>
            </div>
            <p class="text-[13px] text-slate-400 mt-1.5 leading-relaxed text-left">${t('alphaSlideFeatureGuidesDesc')}</p>
          </div>

          <div class="w-full max-w-[340px] p-5 bg-transparent border border-white/[0.06] border-dashed rounded-2xl opacity-50 relative z-10">
            <div class="flex items-center gap-3 text-left">
              <span class="text-[28px] shrink-0">✨</span>
              <span class="text-[17px] font-bold text-slate-200">${t('alphaSlideFeatureMore')}</span>
            </div>
            <p class="text-[13px] text-slate-400 mt-1.5 leading-relaxed text-left">${t('alphaSlideFeatureMoreDesc')}</p>
          </div>
        </div>

        <!-- Slide 3: Ton rôle -->
        <div class="w-[20%] h-full flex-shrink-0 flex flex-col items-center justify-center px-6 text-center relative" style="background:linear-gradient(180deg,#121a28,#0f1520)">
          <div class="absolute rounded-full pointer-events-none" style="width:300px;height:300px;background:rgba(245,158,11,0.05);top:30%;right:-60px;filter:blur(100px)"></div>
          <div class="flex items-center mb-7 relative z-10">${stepIndicator(2)}</div>
          <h2 class="text-[26px] font-extrabold text-white leading-tight mb-5 tracking-tight relative z-10">
            ${t('alphaSlideRoleTitle')} <span class="text-primary-400">${t('alphaSlideRoleAccent')}</span>
          </h2>

          <div class="w-full max-w-[340px] relative z-10">
            <div class="flex items-start gap-3 py-3.5 border-b border-white/[0.04] text-left">
              <div class="w-6 h-6 rounded-md border-2 border-primary-500/25 shrink-0 mt-0.5"></div>
              <div>
                <div class="text-[15px] font-semibold text-slate-200">${t('alphaSlideRoleSpots')}</div>
                <div class="text-[12px] text-slate-500 mt-1 leading-relaxed">${t('alphaSlideRoleSpotsDesc')}</div>
              </div>
            </div>
            <div class="flex items-start gap-3 py-3.5 border-b border-white/[0.04] text-left">
              <div class="w-6 h-6 rounded-md border-2 border-primary-500/25 shrink-0 mt-0.5"></div>
              <div>
                <div class="text-[15px] font-semibold text-slate-200">${t('alphaSlideRoleTips')}</div>
                <div class="text-[12px] text-slate-500 mt-1 leading-relaxed">${t('alphaSlideRoleTipsDesc')}</div>
              </div>
            </div>
            <div class="flex items-start gap-3 py-3.5 text-left">
              <div class="w-6 h-6 rounded-md border-2 border-primary-500/25 shrink-0 mt-0.5"></div>
              <div>
                <div class="text-[15px] font-semibold text-slate-200">${t('alphaSlideRoleFeedback')}</div>
                <div class="text-[12px] text-slate-500 mt-1 leading-relaxed">${t('alphaSlideRoleFeedbackDesc')}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Slide 4: Roadmap -->
        <div class="w-[20%] h-full flex-shrink-0 flex flex-col items-center justify-center px-6 text-center relative" style="background:linear-gradient(180deg,#111825,#0f1520)">
          <div class="absolute rounded-full pointer-events-none" style="width:350px;height:350px;background:rgba(245,158,11,0.04);bottom:-60px;left:-60px;filter:blur(100px)"></div>
          <div class="flex items-center mb-7 relative z-10">${stepIndicator(3)}</div>
          <h2 class="text-[26px] font-extrabold text-white leading-tight mb-3 tracking-tight relative z-10">
            ${t('alphaSlideRoadmapTitle')} <span class="text-primary-400">${t('alphaSlideRoadmapAccent')}</span>
          </h2>
          <p class="text-[15px] text-slate-400 mb-4 relative z-10">${t('alphaSlideRoadmapDesc')}</p>

          <div class="w-full max-w-[340px] relative z-10">
            <div class="flex items-center gap-2.5 py-1.5">
              <span class="text-[13px] w-[100px] shrink-0 text-slate-300">📍 ${t('map')}</span>
              <div class="flex-1 h-[5px] rounded-full bg-white/[0.04] overflow-hidden"><div class="h-full w-full rounded-full" style="background:linear-gradient(90deg,#f59e0b,#fbbf24)"></div></div>
              <span class="text-[10px] font-semibold w-[52px] text-right text-primary-300">${t('alphaSlideReady')}</span>
            </div>
            <div class="flex items-center gap-2.5 py-1.5">
              <span class="text-[13px] w-[100px] shrink-0 text-slate-300">📖 ${t('alphaSlideRoadmapGuides')}</span>
              <div class="flex-1 h-[5px] rounded-full bg-white/[0.04] overflow-hidden"><div class="h-full w-full rounded-full" style="background:linear-gradient(90deg,#f59e0b,#fbbf24)"></div></div>
              <span class="text-[10px] font-semibold w-[52px] text-right text-primary-300">${t('alphaSlideReady')}</span>
            </div>
            <div class="flex items-center gap-2.5 py-1.5">
              <span class="text-[13px] w-[100px] shrink-0 text-slate-300">👥 Social</span>
              <div class="flex-1 h-[5px] rounded-full bg-white/[0.04] overflow-hidden"><div class="h-full w-full rounded-full" style="background:linear-gradient(90deg,#f59e0b,#fbbf24)"></div></div>
              <span class="text-[10px] font-semibold w-[52px] text-right text-primary-300">${t('alphaSlideReady')}</span>
            </div>

            <div class="h-px bg-white/[0.04] my-1.5"></div>

            <div class="flex items-center gap-2.5 py-1.5">
              <span class="text-[13px] w-[100px] shrink-0 text-slate-600">🛡️ SOS</span>
              <div class="flex-1 h-[5px] rounded-full bg-white/[0.04] overflow-hidden"><div class="h-full rounded-full bg-slate-700" style="width:40%"></div></div>
              <span class="text-[10px] font-semibold w-[52px] text-right text-slate-600">${t('alphaSlideInProgress')}</span>
            </div>
            <div class="flex items-center gap-2.5 py-1.5">
              <span class="text-[13px] w-[100px] shrink-0 text-slate-600">🗺️ ${t('alphaSlideRoadmapRoute')}</span>
              <div class="flex-1 h-[5px] rounded-full bg-white/[0.04] overflow-hidden"><div class="h-full rounded-full bg-slate-700" style="width:15%"></div></div>
              <span class="text-[10px] font-semibold w-[52px] text-right text-slate-600">${t('alphaSlidePlanned')}</span>
            </div>
            <div class="flex items-center gap-2.5 py-1.5">
              <span class="text-[13px] w-[100px] shrink-0 text-slate-600">🏠 ${t('alphaSlideRoadmapHostels')}</span>
              <div class="flex-1 h-[5px] rounded-full bg-white/[0.04] overflow-hidden"><div class="h-full rounded-full bg-slate-700" style="width:10%"></div></div>
              <span class="text-[10px] font-semibold w-[52px] text-right text-slate-600">${t('alphaSlidePlanned')}</span>
            </div>
            <div class="flex items-center gap-2.5 py-1.5">
              <span class="text-[13px] w-[100px] shrink-0 text-slate-600">📅 ${t('alphaSlideRoadmapEvents')}</span>
              <div class="flex-1 h-[5px] rounded-full bg-white/[0.04] overflow-hidden"><div class="h-full rounded-full bg-slate-700" style="width:5%"></div></div>
              <span class="text-[10px] font-semibold w-[52px] text-right text-slate-600">${t('alphaSlidePlanned')}</span>
            </div>
          </div>
        </div>

        <!-- Slide 5: Connexion obligatoire -->
        <div class="w-[20%] h-full flex-shrink-0 flex flex-col items-center justify-center px-6 text-center relative" style="background:linear-gradient(180deg,#161e2e,#0f1520)">
          <div class="absolute rounded-full pointer-events-none" style="width:500px;height:500px;background:rgba(245,158,11,0.07);top:50%;left:50%;transform:translate(-50%,-50%);filter:blur(100px)"></div>
          <div class="flex items-center mb-7 relative z-10">${stepIndicator(4)}</div>
          <span class="text-5xl mb-4 relative z-10">🔐</span>
          <h2 class="text-[26px] font-extrabold text-white leading-tight mb-3 tracking-tight relative z-10">
            ${t('landingAuthTitle')}
          </h2>
          <p class="text-[15px] text-slate-400 leading-relaxed max-w-sm mb-6 relative z-10">${t('landingAuthDesc')}</p>

          <!-- Google Sign-In -->
          <button
            onclick="handleGoogleSignIn()"
            class="w-full max-w-[320px] flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white text-slate-900 font-semibold text-[16px] relative z-10 mb-3"
            style="box-shadow:0 4px 20px rgba(255,255,255,0.1)"
            type="button"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            ${t('landingAuthGoogle')}
          </button>

          <!-- Email Sign-In -->
          <button
            onclick="openAuth(); setAuthMode('login')"
            class="w-full max-w-[320px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-slate-300 font-medium text-[14px] relative z-10"
            type="button"
          >
            ✉️ ${t('landingAuthEmail')}
          </button>

          <p class="mt-5 text-[12px] text-slate-500 max-w-xs relative z-10">
            ${t('landingLegalNotice')}
            <a href="javascript:void(0)" onclick="showLegalPage('cgu')" class="text-primary-400/70 hover:underline">${t('termsOfService')}</a>
            ${t('and')}
            <a href="javascript:void(0)" onclick="showLegalPage('privacy')" class="text-primary-400/70 hover:underline">${t('privacyPolicy')}</a>.
          </p>
        </div>

      </div>

      <!-- Controls: dots + next -->
      <div class="absolute bottom-0 left-0 right-0 flex items-center justify-between px-7 pb-10 pt-4 z-10" style="background:linear-gradient(transparent,#0f1520)">
        <div id="landing-dots" class="flex gap-2">
          <div class="landing-dot w-6 h-2 rounded-full bg-primary-400 transition-colors duration-200" data-i="0"></div>
          <div class="landing-dot w-2 h-2 rounded-full bg-white/20 transition-colors duration-200" data-i="1"></div>
          <div class="landing-dot w-2 h-2 rounded-full bg-white/20 transition-colors duration-200" data-i="2"></div>
          <div class="landing-dot w-2 h-2 rounded-full bg-white/20 transition-colors duration-200" data-i="3"></div>
          <div class="landing-dot w-2 h-2 rounded-full bg-white/20 transition-colors duration-200" data-i="4"></div>
        </div>
        <button id="landing-next" onclick="landingNext()" class="text-primary-400 text-sm font-semibold">
          ${t('onboardingNext')} →
        </button>
      </div>

    </div>
  `
}

const TOTAL_SLIDES = 5
const SLIDE_WIDTH = 100 / TOTAL_SLIDES // 20%

export function initLandingCarousel() {
  let current = 0
  const track = document.getElementById('landing-track')
  const dots = document.querySelectorAll('.landing-dot')
  const nextBtn = document.getElementById('landing-next')
  if (!track || !dots.length) return

  function goTo(i) {
    current = Math.max(0, Math.min(i, TOTAL_SLIDES - 1))
    track.style.transform = `translateX(-${current * SLIDE_WIDTH}%)`
    dots.forEach((d, j) => {
      d.className = j === current
        ? 'landing-dot w-6 h-2 rounded-full bg-primary-400 transition-colors duration-200'
        : 'landing-dot w-2 h-2 rounded-full bg-white/20 transition-colors duration-200'
    })
    if (nextBtn) nextBtn.style.display = current === TOTAL_SLIDES - 1 ? 'none' : ''
  }

  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.i)))
  window.landingNext = () => goTo(current + 1)

  let tx = 0
  track.addEventListener('touchstart', e => { tx = e.touches[0].clientX }, { passive: true })
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx
    if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1))
  })
}

export default { renderLanding, initLandingCarousel }
