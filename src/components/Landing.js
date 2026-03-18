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
    `<button onclick="changeLandingLanguage('${l.code}')" class="w-10 h-10 rounded-full ${l.code === currentLang ? 'bg-primary-500/30 border-2 border-primary-400 scale-110' : 'bg-white/10 border border-white/10'} flex items-center justify-center text-lg transition-colors hover:bg-white/20" aria-label="${l.nativeName}">${l.flag}</button>`
  ).join('')

  return `
    <div id="landing-page" class="fixed inset-0 z-[100] bg-dark-primary overflow-hidden">

      <!-- Top bar: Language -->
      <div class="absolute top-4 left-4 right-4 z-20 flex items-center">
        <div class="flex gap-1.5">${langButtons}</div>
      </div>

      <!-- Carousel Track -->
      <div id="landing-track" class="flex h-full transition-transform duration-300 ease-out" style="width:700%">

        <!-- Slide 1: Bienvenue -->
        <div class="w-[14.2857%] h-full flex-shrink-0 flex flex-col items-center justify-center px-6 text-center relative" style="background:#192839">
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
        <div class="w-[14.2857%] h-full flex-shrink-0 flex flex-col items-center justify-center px-6 text-center relative" style="background:linear-gradient(180deg,#101722,#0f1520)">
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
            <p class="text-[11px] text-slate-500 mt-1.5 leading-relaxed text-left italic">${t('alphaSlideHitchwikiNote')}</p>
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
        <div class="w-[14.2857%] h-full flex-shrink-0 flex flex-col items-center justify-center px-6 text-center relative" style="background:linear-gradient(180deg,#121a28,#0f1520)">
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
        <div class="w-[14.2857%] h-full flex-shrink-0 flex flex-col items-center justify-center px-6 text-center relative" style="background:linear-gradient(180deg,#111825,#0f1520)">
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

        <!-- Slide 5: Hitchwiki timeline -->
        <div class="w-[14.2857%] h-full flex-shrink-0 flex flex-col items-center justify-center px-6 text-center relative" style="background:linear-gradient(180deg,#0f1722,#0f1520)">
          <div class="absolute rounded-full pointer-events-none" style="width:300px;height:300px;background:rgba(245,158,11,0.05);top:50%;left:50%;transform:translate(-50%,-50%);filter:blur(100px)"></div>
          <div class="flex items-center mb-7 relative z-10">${stepIndicator(4)}</div>

          <h2 class="text-[22px] font-extrabold text-white leading-tight mb-5 tracking-tight relative z-10">
            ${t('hwSlideTitle')} <span class="text-primary-400">${t('hwSlideTitleAccent')}</span>
          </h2>

          <div class="w-full max-w-[280px] relative z-10 text-left">
            <div class="flex gap-3 items-start mb-5">
              <div class="flex flex-col items-center gap-1 shrink-0">
                <div class="w-[10px] h-[10px] bg-slate-600 rounded-full"></div>
                <div class="w-[2px] h-10 bg-white/[0.06]"></div>
              </div>
              <div>
                <div class="text-[12px] text-slate-500 font-semibold">${t('hwSlidePhase1Title')}</div>
                <div class="text-[11px] text-slate-600 leading-relaxed mt-1">${t('hwSlidePhase1Desc')}</div>
              </div>
            </div>
            <div class="flex gap-3 items-start mb-5">
              <div class="flex flex-col items-center gap-1 shrink-0">
                <div class="w-[10px] h-[10px] bg-primary-500 rounded-full" style="box-shadow:0 0 8px rgba(245,158,11,0.4)"></div>
                <div class="w-[2px] h-10 bg-primary-500/20"></div>
              </div>
              <div>
                <div class="text-[12px] text-primary-400 font-semibold">${t('hwSlidePhase2Title')}</div>
                <div class="text-[11px] text-slate-400 leading-relaxed mt-1">${t('hwSlidePhase2Desc')}</div>
              </div>
            </div>
            <div class="flex gap-3 items-start">
              <div class="flex flex-col items-center shrink-0">
                <div class="w-[10px] h-[10px] bg-emerald-400 rounded-full" style="box-shadow:0 0 8px rgba(74,222,128,0.4)"></div>
              </div>
              <div>
                <div class="text-[12px] text-emerald-400 font-semibold">${t('hwSlidePhase3Title')}</div>
                <div class="text-[11px] text-slate-400 leading-relaxed mt-1">${t('hwSlidePhase3Desc')}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Slide 6: Code d'accès alpha -->
        <div class="w-[14.2857%] h-full flex-shrink-0 flex flex-col items-center justify-center px-6 text-center relative" style="background:linear-gradient(180deg,#0f1722,#0f1520)">
          <div class="absolute rounded-full pointer-events-none" style="width:400px;height:400px;background:rgba(245,158,11,0.05);top:40%;left:50%;transform:translate(-50%,-50%);filter:blur(100px)"></div>
          <div class="flex items-center mb-5 relative z-10">${stepIndicator(5)}</div>

          <div class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-500/[0.08] border border-primary-500/[0.15] rounded-xl text-[11px] font-semibold text-primary-300 tracking-wide mb-4 relative z-10">
            <span class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span> ${t('alphaPrivate') || 'ALPHA PRIVÉE'}
          </div>

          <span class="text-5xl mb-3 relative z-10">🤙</span>

          <h2 class="text-[22px] font-extrabold text-white leading-tight mb-2 tracking-tight relative z-10">
            ${t('alphaJoinTitle') || 'Rejoins les'} <span class="text-primary-400">${t('alphaJoinAccent') || 'premiers'}</span>
          </h2>

          <p class="text-[13px] text-slate-400 leading-relaxed max-w-[290px] mb-5 relative z-10">
            ${t('alphaJoinDesc') || "On construit SpotHitch avec une poignée de testeurs. Chaque retour compte. Entre ton code pour accéder à l'app."}
          </p>

          <input
            type="text"
            id="alpha-code-input"
            placeholder="${t('alphaCodePlaceholder') || "Code d'accès"}"
            class="w-full max-w-[300px] bg-white/[0.06] border-2 border-white/10 rounded-xl px-4 py-3.5 text-white text-center text-base font-semibold tracking-widest outline-none focus:border-primary-500 placeholder-slate-600 mb-2 relative z-10"
            onkeydown="if(event.key==='Enter') validateAlphaCode()"
            autocomplete="off"
            spellcheck="false"
          />
          <div id="alpha-code-error" class="text-red-400 text-xs mb-2 hidden relative z-10">${t('alphaCodeWrong') || 'Code incorrect'}</div>

          <button
            onclick="validateAlphaCode()"
            class="w-full max-w-[300px] py-3.5 rounded-xl font-bold text-[15px] cursor-pointer relative z-10 mb-4"
            style="background:linear-gradient(135deg,#f59e0b,#fb923c);color:#0f1520;border:none;box-shadow:0 4px 20px rgba(245,158,11,0.3)"
          >
            ${t('alphaEnter') || "Accéder à l'app"}
          </button>

          <div class="w-full max-w-[300px] p-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl relative z-10">
            <p class="text-[11px] text-slate-500 font-semibold mb-2">${t('alphaNoCode') || "PAS ENCORE DE CODE ?"}</p>
            <p class="text-[12px] text-slate-400 leading-relaxed mb-3">
              ${t('alphaNoCodeDesc') || "Contacte-nous pour devenir alpha testeur. Ton avis a un vrai impact sur l'app."}
            </p>
            <div class="flex gap-2">
              <a href="https://instagram.com/captain_pouce" target="_blank" rel="noopener noreferrer"
                class="flex-1 flex items-center justify-center gap-1.5 py-2 bg-pink-500/10 border border-pink-500/20 rounded-lg text-pink-400 text-[11px] font-semibold no-underline">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
                @captain_pouce
              </a>
              <a href="mailto:spothitch@gmail.com"
                class="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-[11px] font-semibold no-underline">
                ✉️ Email
              </a>
            </div>
          </div>
        </div>

        <!-- Slide 7: Installer l'app -->
        <div class="w-[14.2857%] h-full flex-shrink-0 flex flex-col items-center justify-center px-6 text-center relative" style="background:linear-gradient(180deg,#131b2a,#0f1520)">
          <div class="absolute rounded-full pointer-events-none" style="width:400px;height:400px;background:rgba(245,158,11,0.06);top:40%;left:50%;transform:translate(-50%,-50%);filter:blur(100px)"></div>
          <div class="flex items-center mb-7 relative z-10">${stepIndicator(6)}</div>
          <span class="text-5xl mb-4 relative z-10">📲</span>
          <h2 class="text-[26px] font-extrabold text-white leading-tight mb-3 tracking-tight relative z-10">
            ${t('installTitle')}
          </h2>
          <p class="text-[15px] text-slate-400 leading-relaxed max-w-sm mb-6 relative z-10">${t('installDesc')}</p>

          <button
            onclick="installFromLanding()"
            id="landing-install-btn"
            class="w-full max-w-[320px] flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-[16px] relative z-10 mb-3 cursor-pointer"
            style="background:linear-gradient(135deg,#f59e0b,#fb923c);color:#0f1520;border:none;box-shadow:0 4px 20px rgba(245,158,11,0.4)"
            type="button"
          >
            📲 ${t('installBtn')}
          </button>

          <button
            onclick="closeLanding()"
            class="w-full max-w-[320px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-slate-400 font-medium text-[14px] relative z-10"
            type="button"
          >
            ${t('skipBtn') || 'Start exploring'}
          </button>
        </div>

        <!-- Slide 8 removed: auth moved to progressive (on first action that needs it) -->

      </div>

      <!-- Controls: dots + next -->
      <div class="absolute bottom-0 left-0 right-0 flex items-center justify-between px-7 pb-10 pt-4 z-10" style="background:linear-gradient(transparent,#0f1520)">
        <div id="landing-dots" class="flex gap-2">
          <div class="landing-dot w-6 h-2 rounded-full bg-primary-400 transition-colors duration-200" data-i="0"></div>
          <div class="landing-dot w-2 h-2 rounded-full bg-white/20 transition-colors duration-200" data-i="1"></div>
          <div class="landing-dot w-2 h-2 rounded-full bg-white/20 transition-colors duration-200" data-i="2"></div>
          <div class="landing-dot w-2 h-2 rounded-full bg-white/20 transition-colors duration-200" data-i="3"></div>
          <div class="landing-dot w-2 h-2 rounded-full bg-white/20 transition-colors duration-200" data-i="4"></div>
          <div class="landing-dot w-2 h-2 rounded-full bg-white/20 transition-colors duration-200" data-i="5"></div>
          <div class="landing-dot w-2 h-2 rounded-full bg-white/20 transition-colors duration-200" data-i="6"></div>
        </div>
        <button id="landing-next" onclick="landingNext()" class="text-primary-400 text-sm font-semibold">
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
