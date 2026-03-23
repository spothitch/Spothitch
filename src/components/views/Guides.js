/**
 * Guides View Component
 * 6 sections: Getting Started, By Country, Safety, Useful Phrases, Events, Legality
 * Accessible from: Map overlay, Profile, SOS
 */

import { t } from '../../i18n/index.js'
import { countryGuides, getGuideByCode, getUniversalPhrases, initGuideSections } from '../../data/guides.js'
import { clearGuideSectionsCache } from '../../data/guideSectionsLoader.js'
import { icon } from '../../utils/icons.js'
import { renderSearchInput } from '../../utils/searchInput.js'
import { renderTipVoteButtons, renderSuggestionForm } from '../../services/feedbackService.js'
import { GUIDE_CATEGORIES, getUserGuideTips, submitGuideTip, deleteUserGuideTip, loadCommunityPendingCounts, getCommunityPendingCounts, loadPublicGuideTips } from '../../services/communityGuideService.js'
import { getCurrentUser } from '../../services/firebase.js'
import { escapeHTML, escapeJSString } from '../../utils/sanitize.js'
import { getState } from '../../stores/state.js'

/**
 * Returns the localized country name for a guide.
 * Uses nameEn for non-French languages (en/es/de).
 */
function getGuideName(guide) {
  const lang = getState()?.lang || 'fr'
  if (lang === 'es' && guide.nameEs) return guide.nameEs
  if (lang === 'de' && guide.nameDe) return guide.nameDe
  if (lang !== 'fr' && guide.nameEn) return guide.nameEn
  return guide.name
}

function getGuideLegalityText(guide) {
  const lang = getState()?.lang || 'fr'
  if (lang !== 'fr' && guide.legalityTextEn) return guide.legalityTextEn
  return guide.legalityText || ''
}


const GUIDE_SECTIONS = [
  { id: 'start', icon: 'compass', color: 'amber', labelKey: 'guideStart', fallback: 'Débuter' },
  { id: 'countries', icon: 'globe', color: 'primary', labelKey: 'guideCountries', fallback: 'Par pays' },
  { id: 'safety', icon: 'shield', color: 'emerald', labelKey: 'guideSafety', fallback: 'Sécurité' },
]

// Track if sections are loaded for current language
let _guideSectionsLoaded = false
let _currentGuideCode = ''
let _guideSectionsLang = null

export async function ensureGuideSectionsLoaded() {
  const lang = window.getState?.()?.lang || 'fr'
  if (_guideSectionsLoaded && _guideSectionsLang === lang) return
  clearGuideSectionsCache()
  _communityTipsCache = {}
  await initGuideSections()
  _guideSectionsLoaded = true
  _guideSectionsLang = lang
}

// Auto-load on first render and re-render when done
let _guideSectionsInitStarted = false

export function renderGuides(state) {
  const activeSection = state.guideSection || 'start'
  const selectedGuide = state.selectedCountryGuide ? getGuideByCode(state.selectedCountryGuide) : null

  // Trigger async load of guide sections (language-aware)
  const currentLang = state.lang || 'fr'
  if (!_guideSectionsInitStarted || _guideSectionsLang !== currentLang) {
    _guideSectionsInitStarted = true
    ensureGuideSectionsLoaded().then(() => {
      // Re-render only if we're still on guides tab
      const s = window.getState?.()
      if (s?.activeTab === 'voyage' || s?.selectedCountryGuide) {
        window.setState?.({ _guideSectionsReady: Date.now() })
      }
    }).catch(() => {
      // Silent fallback: sections stay empty, guide shows "no data" message
      _guideSectionsInitStarted = false
    })
  }

  if (selectedGuide) {
    return renderCountryDetail(selectedGuide)
  }

  return `
    <div class="space-y-4">
      ${state.pendingGuideCountry ? renderPendingTipBanner(state.pendingGuideCountry) : ''}

      <!-- Section tabs -->
      <div class="grid grid-cols-3 gap-2">
        ${GUIDE_SECTIONS.map(s => `
          <button
            onclick="setGuideSection('${s.id}')"
            class="flex flex-col items-center gap-2 p-3 rounded-xl font-medium text-xs transition-colors ${
              activeSection === s.id
                ? `bg-${s.color}-500 text-white shadow-lg`
                : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }"
          >
            <div class="w-10 h-10 rounded-xl ${
              activeSection === s.id
                ? 'bg-white/20'
                : `bg-${s.color}-500/20`
            } flex items-center justify-center">
              ${icon(s.icon, `w-5 h-5 ${activeSection === s.id ? 'text-white' : `text-${s.color}-400`}`)}
            </div>
            <span class="text-center leading-tight text-sm">${t(s.labelKey) || s.fallback}</span>
          </button>
        `).join('')}
      </div>

      <!-- Pending guide tip form (shown when user just created a spot) -->
      ${state.pendingGuideCountry && activeSection === 'start' ? renderGuideTipForm(state.pendingGuideCountry) : ''}

      <!-- Section content -->
      ${renderSection(activeSection, state)}
    </div>
  `
}

function renderPendingTipBanner(country) {
  const flag = country.flag || ''
  const name = getGuideName(country) || country.code
  return `
    <div class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30">
      <span class="text-2xl">${flag}</span>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-emerald-300">${t('guidePendingTipBanner') || 'Partage tes conseils sur'} ${name}</p>
        <p class="text-xs text-emerald-400/70">${t('guideNudgeBtn') || 'Partager mes conseils'}</p>
      </div>
      <span class="w-2.5 h-2.5 bg-red-500 rounded-full shrink-0"></span>
    </div>
  `
}

function renderGuideTipForm(country) {
  // Redirect to the new country detail view
  const code = country.code || ''
  return `
    <div class="card p-4 space-y-3 border border-emerald-500/20">
      <div class="flex items-center gap-2">
        ${icon('book-open', 'w-5 h-5 text-emerald-400')}
        <h3 class="font-bold text-sm">${country.flag || ''} ${escapeHTML(getGuideName(country) || code)}</h3>
      </div>
      <p class="text-sm text-slate-400">${t('guideNudgeText')?.replace('[pays]', escapeHTML(getGuideName(country) || ''))?.replace('[country]', escapeHTML(getGuideName(country) || '')) || 'Partage tes conseils pour ce pays !'}</p>
      <button
        onclick="selectGuide('${escapeJSString(code)}')"
        class="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
      >
        ${icon('book-open', 'w-4 h-4')}
        ${t('guideNudgeBtn') || 'Partager mes conseils'}
      </button>
    </div>
  `
}

function renderSection(section, _state) {
  switch (section) {
    case 'start': return renderStartSection()
    case 'countries': return renderCountriesSection()
    case 'safety': return renderSafetySection()
    case 'phrases': return renderPhrasesSection()
    case 'events': return renderEventsSection()
    case 'legality': return renderLegalitySection()
    default: return renderStartSection()
  }
}

// ==================== DÉBUTER ====================
function renderStartSection() {
  const tips = [
    { icon: 'map-pin', title: t('guideStartSpot') || 'Choisir son spot', desc: t('guideStartSpotDesc') || 'Sortie de ville, station-service, aire de péage. Là où les voitures ralentissent et peuvent s\'arrêter en sécurité.' },
    { icon: 'pen-tool', title: t('guideStartSign') || 'Le panneau', desc: t('guideStartSignDesc') || 'Un carton avec la destination en gros. Privilégiez les villes intermédiaires connues plutôt que la destination finale.' },
    { icon: 'smile', title: t('guideStartAttitude') || 'L\'attitude', desc: t('guideStartAttitudeDesc') || 'Sourire, contact visuel, apparence soignée. Enlevez lunettes de soleil et capuche pour inspirer confiance.' },
    { icon: 'briefcase', title: t('guideStartGear') || 'L\'équipement', desc: t('guideStartGearDesc') || 'Un sac pas trop gros, de l\'eau, des snacks, un chargeur, une lampe frontale et une carte papier en backup.' },
    { icon: 'clock', title: t('guideStartTiming') || 'Le timing', desc: t('guideStartTimingDesc') || 'Partez tôt le matin (7-9h). Évitez la nuit et le dimanche quand le trafic est faible.' },
    { icon: 'shield', title: t('guideStartSafety') || 'La sécurité', desc: t('guideStartSafetyDesc') || 'Faites confiance à votre instinct. Partagez votre position avec un proche. N\'hésitez jamais à refuser un trajet.' },
  ]

  return `
    <div class="space-y-3">
      <div class="card p-4 bg-amber-500/10 border-amber-500/20">
        <h3 class="font-bold text-lg mb-1">${t('guideStartTitle') || 'Prêt à lever le pouce ?'}</h3>
        <p class="text-sm text-slate-400">${t('guideStartIntro') || 'Les bases de l\'auto-stop pour les débutants comme les confirmés.'}</p>
      </div>
      ${tips.map((tip, i) => `
        <div class="card p-4">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              ${icon(tip.icon, 'w-5 h-5 text-amber-400')}
            </div>
            <div class="flex-1">
              <div class="font-medium mb-1">${tip.title}</div>
              <p class="text-sm text-slate-400 leading-relaxed">${tip.desc}</p>
              ${renderTipVoteButtons('start', i)}
            </div>
          </div>
        </div>
      `).join('')}

      ${renderSuggestionForm('start')}
    </div>
  `
}

// ==================== PAR PAYS ====================

// Country center coordinates for proximity sorting
const COUNTRY_CENTERS = {
  // Europe
  FR: [46.6, 2.3], DE: [51.2, 10.4], ES: [40.4, -3.7], IT: [41.9, 12.5],
  NL: [52.1, 5.3], BE: [50.5, 4.5], PT: [39.4, -8.2], AT: [47.5, 13.2],
  CH: [46.8, 8.2], GB: [51.5, -0.1], IE: [53.4, -8.2], PL: [51.9, 19.1],
  CZ: [49.8, 15.5], SE: [60.1, 18.6], NO: [60.5, 8.5], DK: [56.3, 9.5],
  FI: [61.9, 25.7], HR: [45.1, 15.2], GR: [39.1, 21.8], RO: [45.9, 24.9],
  HU: [47.2, 19.5], SK: [48.7, 19.7], SI: [46.1, 15.0], BG: [42.7, 25.5],
  LT: [55.2, 23.9], LV: [56.9, 24.1], EE: [58.6, 25.0], LU: [49.8, 6.1],
  RS: [44.0, 21.0], BA: [43.9, 17.7], ME: [42.7, 19.4], MK: [41.5, 22.0],
  AL: [41.3, 20.2], IS: [64.9, -18.1], BY: [53.9, 27.6], MD: [47.0, 28.9],
  UA: [48.4, 31.2], XK: [42.6, 20.9],
  // Middle East / Caucasus
  TR: [39.9, 32.9], GE: [42.3, 43.4], AM: [40.1, 44.5], IL: [31.0, 34.9],
  IR: [32.4, 53.7], JO: [31.2, 36.8], OM: [21.5, 55.9], LB: [33.9, 35.5],
  // Africa
  MA: [31.8, -7.1], TN: [34.0, 9.0], EG: [26.8, 30.8], SN: [14.5, -14.5],
  GH: [7.9, -1.0], KE: [-0.5, 37.9], ET: [9.1, 40.5], TZ: [-6.4, 34.9],
  UG: [1.4, 32.3], RW: [-1.9, 29.9], MW: [-13.3, 34.3], ZA: [-30.6, 22.9],
  NA: [-22.6, 17.1],
  // Americas
  US: [37.1, -95.7], CA: [56.1, -106.3], MX: [23.6, -102.5], CU: [21.5, -80.0],
  GT: [15.8, -90.2], CR: [10.0, -84.2], PA: [8.5, -80.8], CO: [4.6, -74.3],
  EC: [-1.8, -78.2], PE: [-9.2, -75.0], BO: [-16.3, -63.6], BR: [-14.2, -51.9],
  CL: [-35.7, -71.5], AR: [-38.4, -63.6], UY: [-32.5, -55.8],
  // Asia
  TH: [15.9, 100.9], IN: [20.6, 78.9], NP: [28.4, 84.1], LK: [7.9, 80.8],
  VN: [14.1, 108.3], LA: [19.9, 102.5], KH: [12.6, 105.0], MM: [19.8, 96.1],
  JP: [36.2, 138.3], KR: [35.9, 127.8], TW: [23.7, 121.0], PH: [12.9, 121.8],
  ID: [-0.8, 113.9], MY: [4.2, 101.9], MN: [46.9, 103.8], PK: [30.4, 69.3],
  KZ: [48.0, 68.0], KG: [41.2, 74.8], UZ: [41.4, 64.6], TJ: [38.9, 71.3],
  // Oceania
  NZ: [-41.3, 174.8], AU: [-25.3, 133.8],
}

function getDistanceToCountry(countryCode, userLat, userLng) {
  const center = COUNTRY_CENTERS[countryCode]
  if (!center || !userLat) return 99999
  const dLat = center[0] - userLat
  const dLng = center[1] - userLng
  return Math.sqrt(dLat * dLat + dLng * dLng)
}

function renderCountriesSection() {
  const state = window.getState?.() || {}
  const userLat = state.userLat || state.lat
  const userLng = state.userLng || state.lng

  const sortedGuides = [...countryGuides].sort((a, b) => {
    if (userLat && userLng) {
      return getDistanceToCountry(a.code, userLat, userLng) - getDistanceToCountry(b.code, userLat, userLng)
    }
    return a.difficulty - b.difficulty
  })
  const pendingCounts = getCommunityPendingCounts()

  // Trigger async load of community pending counts (re-renders when ready)
  if (!Object.keys(pendingCounts).length) {
    loadCommunityPendingCounts().then(counts => {
      if (Object.keys(counts).length > 0) {
        // Force re-render by toggling a dummy state value
        const state = window.getState?.() || {}
        window.setState?.({ _guidePendingLoaded: (state._guidePendingLoaded || 0) + 1 })
      }
    })
  }

  return `
    <div class="space-y-3">
      ${renderSearchInput({
        placeholder: t('searchCountry') || 'Rechercher un pays...',
        ariaLabel: t('searchCountry') || 'Rechercher un pays',
        oninput: 'filterGuides(this.value)',
        inputClass: 'input-field w-full',
        paddingLeft: 'pl-10',
      })}

      <div id="guides-list" class="grid grid-cols-2 gap-3">
        ${sortedGuides.map(guide => {
          const contribCount = getUserGuideTips(guide.code).length
          const communityPending = pendingCounts[guide.code] || 0
          return `
          <button
            onclick="selectGuide('${guide.code}')"
            class="card p-4 text-left hover:border-primary-500/50 transition-colors guide-card"
            data-country="${guide.name.toLowerCase()} ${(guide.nameEn || '').toLowerCase()}"
          >
            <div class="flex items-center gap-3 mb-2">
              <span class="text-3xl">${guide.flag}</span>
              <div>
                <div class="font-bold">${getGuideName(guide)}</div>
                ${contribCount > 0
                  ? `<div class="text-xs text-emerald-400">${contribCount}/${GUIDE_CATEGORIES.length} ${icon('check', 'w-3 h-3 inline')}</div>`
                  : communityPending > 0
                    ? `<div class="text-xs text-amber-400">${icon('clock', 'w-3 h-3 inline mr-1')}${communityPending === 1
                        ? (t('guideCommunityPending1') || '1 contribution en attente de validation')
                        : (t('guideCommunityPending') || '{count} contribution(s) en attente de validation').replace('{count}', communityPending)
                      }</div>`
                    : `<div class="text-xs text-slate-500">${t('guideNoContribution') || 'Pas encore de contribution'}</div>`
                }
              </div>
            </div>
          </button>
          `
        }).join('')}
      </div>
    </div>
  `
}

// ==================== SÉCURITÉ ====================
function renderSafetySection() {
  const rules = [
    { icon: 'eye', color: 'emerald', title: t('guideSafetyTrust') || 'Faites confiance à votre instinct', desc: t('guideSafetyTrustDesc') || 'Si quelque chose ne va pas, refusez le trajet. Mieux vaut attendre que monter dans une voiture suspecte.' },
    { icon: 'map-pin', color: 'primary', title: t('guideSafetyPosition') || 'Partagez votre position', desc: t('guideSafetyPositionDesc') || 'Utilisez le mode compagnon de SpotHitch pour partager votre trajet en temps réel avec vos proches.' },
    { icon: 'phone', color: 'danger', title: t('guideSafetyPhone') || 'Téléphone chargé', desc: t('guideSafetyPhoneDesc') || 'Gardez toujours votre téléphone chargé. Emportez une batterie externe. Notez les numéros d\'urgence.' },
    { icon: 'users', color: 'purple', title: t('guideSafetyGroup') || 'Voyagez à deux', desc: t('guideSafetyGroupDesc') || 'Voyager en binôme est plus sûr, surtout pour les débutants et la nuit. Utilisez SpotHitch pour trouver un compagnon.' },
    { icon: 'moon', color: 'amber', title: t('guideSafetyNight') || 'Évitez la nuit', desc: t('guideSafetyNightDesc') || 'L\'auto-stop de nuit est déconseillé. Si vous êtes coincé, trouvez un endroit sûr pour dormir.' },
    { icon: 'car', color: 'blue', title: t('guideSafetyCar') || 'Montez informé', desc: t('guideSafetyCarDesc') || 'Avant de monter : vérifiez la plaque, le visage du conducteur, demandez où il va. Gardez votre sac accessible.' },
  ]

  const womenTips = [
    t('guideSafetyWomen1') || 'Privilégiez les familles et les couples',
    t('guideSafetyWomen2') || 'Voyagez en binôme quand possible',
    t('guideSafetyWomen3') || 'Faites semblant d\'appeler quelqu\'un si mal à l\'aise',
    t('guideSafetyWomen4') || 'Ayez un numéro d\'urgence en raccourci',
  ]

  return `
    <div class="space-y-3">
      <div class="card p-4 bg-emerald-500/10 border-emerald-500/20">
        <h3 class="font-bold text-lg mb-1">${t('guideSafetyTitle') || 'Voyager en sécurité'}</h3>
        <p class="text-sm text-slate-400">${t('guideSafetyIntro') || 'Les règles d\'or pour un auto-stop serein.'}</p>
      </div>
      ${rules.map((r, i) => `
        <div class="card p-4">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-${r.color}-500/20 flex items-center justify-center shrink-0">
              ${icon(r.icon, `w-5 h-5 text-${r.color}-400`)}
            </div>
            <div class="flex-1">
              <div class="font-medium mb-1">${r.title}</div>
              <p class="text-sm text-slate-400 leading-relaxed">${r.desc}</p>
              ${renderTipVoteButtons('safety', i)}
            </div>
          </div>
        </div>
      `).join('')}

      <!-- Women safety -->
      <div class="card p-4 border-purple-500/20">
        <h4 class="font-medium mb-3 flex items-center gap-2">
          ${icon('heart', 'w-5 h-5 text-purple-400')}
          ${t('guideSafetyWomenTitle') || 'Conseils pour les femmes'}
        </h4>
        <div class="space-y-2">
          ${womenTips.map(tip => `
            <div class="flex items-start gap-2 text-sm">
              ${icon('check', 'w-4 h-4 text-purple-400 mt-0.5 shrink-0')}
              <span class="text-slate-400">${tip}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- SOS reminder -->
      <button onclick="openSOS()" class="card p-4 w-full text-left bg-danger-500/10 border-danger-500/30 hover:bg-danger-500/20 transition-colors">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-danger-500/30 flex items-center justify-center">
            ${icon('triangle-alert', 'w-5 h-5 text-danger-400')}
          </div>
          <div>
            <div class="font-medium text-danger-400">${t('guideSafetySOS') || 'En cas d\'urgence'}</div>
            <p class="text-sm text-slate-400">${t('guideSafetySOSDesc') || 'Le bouton SOS est toujours en haut de l\'écran.'}</p>
          </div>
        </div>
      </button>

      <!-- Checklist -->
      <div class="card p-4">
        <h4 class="font-medium mb-3 flex items-center gap-2">
          ${icon('clipboard-list', 'w-5 h-5 text-amber-400')}
          ${t('guideChecklist') || 'Checklist avant de partir'}
        </h4>
        <div class="space-y-2">
          ${[
    t('guideCheckItem1') || 'Téléphone chargé + batterie externe',
    t('guideCheckItem2') || 'Eau et snacks',
    t('guideCheckItem3') || 'Panneau et feutre',
    t('guideCheckItem4') || 'Contacts d\'urgence notés',
    t('guideCheckItem5') || 'Carte papier en backup',
    t('guideCheckItem6') || 'Copie des documents d\'identité',
  ].map(item => `
            <div class="flex items-center gap-2 text-sm">
              ${icon('square', 'w-4 h-4 text-slate-400 shrink-0')}
              <span class="text-slate-400">${item}</span>
            </div>
          `).join('')}
        </div>
      </div>

      ${renderSuggestionForm('safety')}
    </div>
  `
}

// ==================== PHRASES UTILES ====================
function renderPhrasesSection() {
  const lang = window.getState?.()?.lang || 'fr'
  const isEn = lang === 'en'

  return `
    <div class="space-y-3">
      <div class="card p-4 bg-purple-500/10 border-purple-500/20">
        <h3 class="font-bold text-lg mb-1">${t('guidePhrasesTitle') || 'Phrases utiles'}</h3>
        <p class="text-sm text-slate-400">${t('guidePhrasesIntro') || '5 phrases essentielles pour l\'auto-stop, traduites dans chaque langue.'}</p>
      </div>
      ${countryGuides.map(guide => {
        const phrases = getUniversalPhrases(guide.code)
        return `
        <div class="card p-4">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl">${guide.flag}</span>
            <span class="font-bold">${getGuideName(guide)}</span>
          </div>
          <div class="space-y-2">
            ${phrases.map(p => `
              <div class="p-2.5 rounded-xl bg-white/5">
                <div class="font-medium text-sm text-purple-300">"${p.local}"</div>
                <div class="text-xs text-slate-400 mt-1">${isEn ? p.meaningEn : p.meaning}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `}).join('')}
    </div>
  `
}

// ==================== ÉVÉNEMENTS ====================
function renderEventsSection() {
  const countriesWithEvents = countryGuides.filter(g => g.events && g.events.length > 0)
  const lang = window.getState?.()?.lang || 'fr'
  const isEn = lang === 'en'

  return `
    <div class="space-y-3">
      <div class="card p-4 bg-pink-500/10 border-pink-500/20">
        <h3 class="font-bold text-lg mb-1">${t('guideEventsTitle') || 'Événements & Festivals'}</h3>
        <p class="text-sm text-slate-400">${t('guideEventsIntro') || 'Les événements qui impactent le trafic et les opportunités de trajet.'}</p>
      </div>
      ${countriesWithEvents.map(guide => `
        <div class="card p-4">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl">${guide.flag}</span>
            <span class="font-bold">${getGuideName(guide)}</span>
          </div>
          <div class="space-y-2">
            ${guide.events.map(event => {
    const eventName = (isEn && event.nameEn) ? event.nameEn : event.name
    const eventDate = (isEn && event.dateEn) ? event.dateEn : event.date
    const eventDesc = (isEn && event.descriptionEn) ? event.descriptionEn : event.description
    const typeColor = event.type === 'festival' ? 'text-pink-400 bg-pink-500/20' : event.type === 'gathering' ? 'text-cyan-400 bg-cyan-500/20' : 'text-amber-400 bg-amber-500/20'
    return `
              <div class="flex items-start gap-3 p-2.5 rounded-xl bg-white/5">
                <div class="shrink-0 w-8 h-8 rounded-full ${typeColor} flex items-center justify-center">
                  ${icon(event.type === 'festival' ? 'music' : event.type === 'gathering' ? 'users' : 'flag', 'w-4 h-4')}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-sm">${eventName}</span>
                    <span class="text-xs text-slate-400">${eventDate}</span>
                  </div>
                  <p class="text-xs text-slate-400 mt-0.5">${eventDesc}</p>
                </div>
              </div>
            `
  }).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `
}

// ==================== LÉGALITÉ ====================
function renderLegalitySection() {
  const sortedByLegality = [...countryGuides].sort((a, b) => {
    const order = { legal: 0, mostly_legal: 1, gray: 2, restricted: 3 }
    return (order[a.legality] || 2) - (order[b.legality] || 2)
  })

  const legalityColors = {
    legal: 'text-emerald-400 bg-emerald-500/20',
    mostly_legal: 'text-primary-400 bg-primary-500/20',
    varies: 'text-amber-400 bg-amber-500/20',
    gray: 'text-amber-400 bg-amber-500/20',
    restricted: 'text-danger-400 bg-danger-500/20',
  }

  const legalityLabels = {
    legal: t('legalityLegal') || 'Légal',
    mostly_legal: t('legalityMostlyLegal') || 'Quasi légal',
    varies: t('legalityVaries') || 'Variable',
    gray: t('legalityGray') || 'Zone grise',
    restricted: t('legalityRestricted') || 'Restreint',
  }

  return `
    <div class="space-y-3">
      <div class="card p-4 bg-blue-500/10 border-blue-500/20">
        <h3 class="font-bold text-lg mb-1">${t('guideLegalityTitle') || 'Légalité par pays'}</h3>
        <p class="text-sm text-slate-400">${t('guideLegalityIntro') || 'Le statut légal de l\'auto-stop varie selon les pays.'}</p>
      </div>

      <div class="flex flex-wrap gap-2 text-xs">
        <span class="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">${legalityLabels.legal}</span>
        <span class="flex items-center gap-1 px-2 py-1 rounded-full bg-primary-500/20 text-primary-400">${legalityLabels.mostly_legal}</span>
        <span class="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">${legalityLabels.gray}</span>
        <span class="flex items-center gap-1 px-2 py-1 rounded-full bg-danger-500/20 text-danger-400">${legalityLabels.restricted}</span>
      </div>

      ${sortedByLegality.map(guide => `
        <button onclick="selectGuide('${guide.code}')" class="card p-4 w-full text-left hover:border-primary-500/50 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl">${guide.flag}</span>
              <div>
                <div class="font-medium">${getGuideName(guide)}</div>
                <div class="text-xs text-slate-400 mt-0.5 line-clamp-1">${getGuideLegalityText(guide)}</div>
              </div>
            </div>
            <span class="px-2 py-1 rounded-full text-xs font-medium shrink-0 ${legalityColors[guide.legality] || legalityColors.gray}">
              ${legalityLabels[guide.legality] || legalityLabels.gray}
            </span>
          </div>
        </button>
      `).join('')}
    </div>
  `
}

// ==================== COUNTRY DETAIL (v17 — Social Feed Design) ====================

/** Render a structured content block from guide sections data */
function renderGuideBlock(block) {
  switch (block.type) {
    case 'text':
      return `<p class="text-sm text-slate-300 leading-relaxed mb-1.5">${escapeHTML(block.text)}</p>`
    case 'sub':
      return `<p class="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mt-3 mb-1">${escapeHTML(block.title)}</p>`
    case 'rule':
      return `<div class="flex gap-2 py-1"><span class="text-sm shrink-0 mt-0.5">${block.icon}</span><p class="text-sm text-slate-300 leading-relaxed">${escapeHTML(block.text)}</p></div>`
    case 'tip':
      return `<div class="px-3 py-2 bg-amber-500/5 border-l-[3px] border-amber-500 rounded-r-lg mt-2 text-sm text-amber-400 leading-relaxed">${escapeHTML(block.text)}</div>`
    case 'warn':
      return `<div class="px-3 py-2 bg-red-500/5 border-l-[3px] border-red-500 rounded-r-lg mt-2 text-sm text-red-400 leading-relaxed">${escapeHTML(block.text)}</div>`
    case 'info':
      return `<div class="px-3 py-2 bg-blue-500/5 border-l-[3px] border-blue-500 rounded-r-lg mt-2 text-sm text-blue-400 leading-relaxed">${escapeHTML(block.text)}</div>`
    case 'kv':
      return (block.items || []).map(item =>
        `<div class="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
          <span class="text-sm text-slate-400">${escapeHTML(item.k)}</span>
          <span class="text-sm font-semibold ${item.color === 'green' ? 'text-emerald-400' : item.color === 'red' ? 'text-red-400' : item.color === 'amber' ? 'text-amber-400' : 'text-white'}">${escapeHTML(item.v)}</span>
        </div>`
      ).join('')
    case 'phrase':
      return (block.items || []).map(item =>
        `<div class="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
          <span class="text-sm font-semibold text-amber-400">"${escapeHTML(item.local)}"</span>
          <span class="text-xs text-slate-500 ml-2 shrink-0">${escapeHTML(item.meaning)}</span>
        </div>`
      ).join('')
    case 'transport':
      return (block.items || []).map(item =>
        `<div class="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
          <span class="text-lg">${item.emoji}</span>
          <div class="flex-1 min-w-0">
            <span class="text-sm font-medium">${escapeHTML(item.name)}</span>
            ${item.detail ? `<br><span class="text-xs text-slate-500">${escapeHTML(item.detail)}</span>` : ''}
          </div>
          <span class="text-sm text-emerald-400 font-medium shrink-0">${escapeHTML(item.price)}</span>
        </div>`
      ).join('')
    case 'event':
      return (block.items || []).map(item =>
        `<div class="flex gap-3 py-1.5 border-b border-white/5 last:border-0">
          <div class="bg-amber-500/10 rounded px-1.5 py-0.5 text-center shrink-0">
            <div class="text-[10px] text-amber-500 uppercase font-semibold">${escapeHTML(item.month)}</div>
            <div class="text-sm font-extrabold text-amber-500">${escapeHTML(item.day)}</div>
          </div>
          <div>
            <div class="text-sm font-semibold">${escapeHTML(item.name)}</div>
            <div class="text-xs text-slate-500">${escapeHTML(item.desc)}</div>
          </div>
        </div>`
      ).join('')
    case 'season':
      return `<div class="flex gap-0.5 my-2">${(block.months || []).map(m =>
        `<div class="flex-1 text-center py-1 rounded text-[10px] font-semibold ${
          m.level === 'great' ? 'bg-emerald-500/20 text-emerald-400'
          : m.level === 'good' ? 'bg-emerald-500/10 text-emerald-400'
          : m.level === 'ok' ? 'bg-amber-500/10 text-amber-400'
          : 'bg-red-500/10 text-red-400'
        }">${escapeHTML(m.name)}</div>`
      ).join('')}</div>`
    default:
      return ''
  }
}

/** Render a full section's pinned content */
function renderGuideSectionPinned(sectionData, cat) {
  if (!sectionData || !sectionData.blocks) return ''
  return `
    <div class="p-4 bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/15 rounded-2xl mb-3 relative">
      <div class="absolute top-3 right-3 text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full font-semibold">📌 ${t('guideOfficialBadge') || 'Guide'}</div>
      <h3 class="text-base font-extrabold mb-2 flex items-center gap-2">
        <span class="text-lg">${cat.emoji}</span>
        ${escapeHTML(t(cat.labelKey) || cat.fallback)}
      </h3>
      ${sectionData.blocks.map(renderGuideBlock).join('')}
    </div>
  `
}

/** Render filter chips for community posts */
function renderGuideFilterChips(sectionData, _countryCode, _catId) {
  const types = sectionData?.filterTypes || ['q', 'c']
  const chipDefs = {
    q: { label: `❓ ${t('guideChipQuestions') || 'Questions'}`, cls: 'q' },
    c: { label: `💡 ${t('guideChipTips') || 'Conseils'}`, cls: 'c' },
    a: { label: `⚠️ ${t('guideChipAlerts') || 'Alertes'}`, cls: 'a' },
    b: { label: `🎯 ${t('guideChipDeals') || 'Bons plans'}`, cls: 'b' },
  }
  return `
    <div class="flex gap-1.5 overflow-x-auto scrollbar-none py-1 sticky top-0 z-10 bg-[#0f1117]">
      <span class="px-3 py-1.5 rounded-full text-xs font-semibold border border-amber-500/25 text-amber-500 bg-amber-500/5 cursor-pointer shrink-0">${t('guideChipAll') || 'Tout'} <span class="text-[10px] opacity-70">0</span></span>
      ${types.map(tp => {
        const d = chipDefs[tp]
        return d ? `<span class="guide-chip-${d.cls} px-3 py-1.5 rounded-full text-xs font-semibold border border-white/8 text-slate-500 bg-white/2 cursor-pointer shrink-0">${d.label} <span class="text-[10px] opacity-70">0</span></span>` : ''
      }).join('')}
    </div>
  `
}

/** Render the empty community state */
function renderGuideEmptyForum(catId) {
  const emojis = { laws: '💬', hitchhiking: '🗺️', safety: '🛡️', women: '💪', language: '🗣️', budget: '💶', sleep: '🏕️', transport: '🚌', season: '📅', culture: '🎭' }
  const messages = {
    laws: t('guideForumLaws') || 'Partage ton expérience avec les lois !',
    hitchhiking: t('guideForumHitchhiking') || 'Partage tes astuces pour trouver des trajets !',
    safety: t('guideForumSafety') || 'Un conseil sécurité à partager ?',
    women: t('guideForumWomen') || 'Ton expérience compte. Aide d\'autres voyageuses !',
    language: t('guideForumLanguage') || 'Partage une phrase qui t\'a aidé !',
    budget: t('guideForumBudget') || 'Un bon plan budget à partager ?',
    sleep: t('guideForumSleep') || 'Partage tes spots pour dormir !',
    transport: t('guideForumTransport') || 'Un transport pas cher à recommander ?',
    season: t('guideForumSeason') || 'Une expérience saisonnière à partager ?',
    culture: t('guideForumCulture') || 'Une rencontre marquante à raconter ?',
  }
  return `
    <div class="text-center py-6">
      <div class="text-3xl mb-2 opacity-60">${emojis[catId] || '💬'}</div>
      <p class="text-sm text-slate-500 mb-3">${t('guideNoContribution') || 'Aucune contribution pour le moment.'}<br>${escapeHTML(messages[catId] || '')}</p>
      <button onclick="openGuideCategory('${escapeJSString(_currentGuideCode || '')}', '${escapeJSString(catId)}')" class="inline-block px-4 py-2 bg-blue-500 text-white rounded-full text-xs font-semibold cursor-pointer">+ ${t('guideContribute') || 'Contribuer'}</button>
    </div>
  `
}

export function renderCountryDetail(guideOrCode) {
  const guide = typeof guideOrCode === 'string' ? getGuideByCode(guideOrCode) : guideOrCode
  if (!guide) return ''

  const state = window.getState?.() || {}
  const openCategory = state.guideOpenCategory || null
  const userTips = getUserGuideTips(guide.code)
  const activeSection = state.guideActiveSection || GUIDE_CATEGORIES[0]?.id || 'laws'

  // Store for the empty forum contribute button
  _currentGuideCode = guide.code

  const activeCat = GUIDE_CATEGORIES.find(c => c.id === activeSection) || GUIDE_CATEGORIES[0]
  const sectionData = guide.sections?.[activeSection]

  return `
    <div class="flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
        <button onclick="selectGuide(null)" class="text-slate-400 hover:text-white text-sm">←</button>
        <span class="text-xl">${guide.flag}</span>
        <h1 class="text-sm font-extrabold flex-1">${escapeHTML(getGuideName(guide))}</h1>
        ${guide.legality === 'legal' ? '<span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">✓ ' + (t('guideLegal') || 'Légal') + '</span>' : ''}
      </div>

      <!-- Stories nav -->
      <div class="flex gap-2 px-3 py-2.5 overflow-x-auto scrollbar-none border-b border-white/5">
        ${GUIDE_CATEGORIES.map(cat => `
          <button
            onclick="setGuideActiveSection('${cat.id}')"
            class="flex flex-col items-center gap-1 min-w-[44px] shrink-0"
          >
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
              activeSection === cat.id
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-white/10'
            }">
              ${cat.emoji}
            </div>
            <span class="text-[10px] ${activeSection === cat.id ? 'text-amber-500 font-semibold' : 'text-slate-500'} whitespace-nowrap">${(t(cat.labelKey) || cat.fallback).split(' ')[0]}</span>
          </button>
        `).join('')}
      </div>

      <!-- Section content (scrollable) -->
      <div class="flex-1 overflow-y-auto px-4 py-3" id="guide-section-feed">
        <!-- Pinned description -->
        ${sectionData ? renderGuideSectionPinned(sectionData, activeCat) : `
          <div class="p-4 bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/15 rounded-2xl mb-3">
            <h3 class="text-base font-extrabold mb-2 flex items-center gap-2">
              <span class="text-lg">${activeCat.emoji}</span>
              ${escapeHTML(t(activeCat.labelKey) || activeCat.fallback)}
            </h3>
            <p class="text-sm text-slate-400">${t('guideNoData') || 'Pas encore de données pour cette section. Les contributions de la communauté aideront à la remplir.'}</p>
          </div>
        `}

        <!-- Filter chips -->
        ${renderGuideFilterChips(sectionData, guide.code, activeSection)}

        <!-- Community posts (from Firebase) -->
        ${renderCommunityTipsByCategory(guide.code, activeSection, state)}

        <!-- Inline form (if this category is open) -->
        ${openCategory === activeSection ? renderGuideCategoryForm(guide.code, openCategory, userTips) : ''}
      </div>

      <!-- Compose bar -->
      <div class="flex items-center gap-2 px-4 py-2.5 bg-white/2 border-t border-white/5">
        <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs text-slate-500 shrink-0">?</div>
        <button
          onclick="openGuideCategory('${escapeJSString(guide.code)}', '${escapeJSString(activeSection)}')"
          class="flex-1 bg-white/5 border border-white/8 rounded-full px-4 py-2 text-sm text-slate-500 text-left cursor-pointer"
        >
          ${t('guideTipCTA') || 'Partage ton expérience...'}
        </button>
        <button
          onclick="openGuideCategory('${escapeJSString(guide.code)}', '${escapeJSString(activeSection)}')"
          class="px-3 py-2 bg-blue-500 rounded-full text-xs text-white font-semibold cursor-pointer"
        >
          ${t('guideTipSubmit') || 'Publier'}
        </button>
      </div>
    </div>
  `
}

/** Render community tips filtered by category */
function renderCommunityTipsByCategory(countryCode, categoryId, _state) {
  const tips = _communityTipsCache[countryCode]
  const currentUser = getCurrentUser()

  // Trigger async load if not cached
  if (!tips) {
    loadPublicGuideTips(countryCode).then(loaded => {
      const othersTips = loaded.filter(tip =>
        tip.status === 'approved' && (!currentUser || tip.userId !== currentUser.uid)
      )
      _communityTipsCache[countryCode] = othersTips
      if (othersTips.length > 0) {
        const s = window.getState?.() || {}
        window.setState?.({ _communityTipsLoaded: (s._communityTipsLoaded || 0) + 1 })
      }
    })
  }

  // Filter by current category
  const catTips = (tips || []).filter(tip => tip.category === categoryId)

  if (catTips.length === 0) {
    return renderGuideEmptyForum(categoryId)
  }

  return catTips.map(tip => `
    <div class="p-3 bg-white/2 border border-white/5 rounded-xl mb-2 border-l-[3px] ${
      tip.category === categoryId ? 'border-l-blue-500' : 'border-l-transparent'
    }">
      <div class="flex items-center gap-2 mb-1">
        <div class="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
          ${escapeHTML((tip.username || 'A').slice(0, 2).toUpperCase())}
        </div>
        <span class="text-xs font-semibold flex-1">${escapeHTML(tip.username || t('guideAnonymous') || 'Anonyme')}</span>
        <span class="text-[10px] text-slate-500">${tip.createdAt ? new Date(tip.createdAt).toLocaleDateString() : ''}</span>
      </div>
      <p class="text-sm leading-relaxed mb-1">${escapeHTML(tip.text)}</p>
      <div class="flex items-center gap-3 text-xs text-slate-500">
        <span class="cursor-pointer">👍 ${tip.upvotes || 0}</span>
        <span class="cursor-pointer">💬 0</span>
      </div>
    </div>
  `).join('')
}

// ==================== COMMUNITY TIPS SECTION ====================

// Cache for community tips per country
let _communityTipsCache = {}

// Render safety page (kept for backward compatibility)
export function renderSafety() {
  return renderSafetySection()
}

// ==================== CONTRIBUTION FORM HELPERS ====================



function renderGuideCategoryForm(countryCode, categoryId, userTips) {
  const cat = GUIDE_CATEGORIES.find(c => c.id === categoryId)
  if (!cat) return ''
  const existing = userTips.find(tip => tip.category === categoryId)
  const text = existing?.text ?? ''
  const selectedType = window._guideFormType || existing?.type || 'c'

  const typeOptions = [
    { id: 'q', emoji: '❓', label: t('guideChipQuestions') || 'Question', color: 'blue' },
    { id: 'c', emoji: '💡', label: t('guideChipTips') || 'Conseil', color: 'emerald' },
    { id: 'a', emoji: '⚠️', label: t('guideChipAlerts') || 'Alerte', color: 'red' },
    { id: 'b', emoji: '🎯', label: t('guideChipDeals') || 'Bon plan', color: 'amber' },
  ]

  return `
    <div class="mt-2 mb-3 rounded-2xl overflow-hidden border border-white/8 bg-gradient-to-b from-white/3 to-transparent">
      <!-- Header -->
      <div class="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <div class="flex items-center gap-1.5">
          <span class="text-sm">${cat.emoji}</span>
          <span class="text-xs font-semibold">${t(cat.labelKey) || cat.fallback}</span>
        </div>
        <button onclick="openGuideCategory('${escapeJSString(countryCode)}', null)" class="text-slate-500 hover:text-white p-1">
          ${icon('x', 'w-3.5 h-3.5')}
        </button>
      </div>

      <!-- Type selector -->
      <div class="flex gap-1.5 px-3 py-2">
        ${typeOptions.map(tp => `
          <button
            onclick="setGuideFormType('${tp.id}')"
            class="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
              selectedType === tp.id
                ? `bg-${tp.color}-500/15 text-${tp.color}-400 border border-${tp.color}-500/30`
                : 'bg-white/3 text-slate-500 border border-white/5 hover:bg-white/5'
            }"
          >
            ${tp.emoji} ${tp.label}
          </button>
        `).join('')}
      </div>

      <!-- Text input -->
      <div class="px-3 pb-2">
        <textarea
          id="guide-contrib-text"
          class="w-full bg-white/3 border border-white/8 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-blue-500/40"
          rows="2"
          placeholder="${selectedType === 'q' ? (t('guideAskPlaceholder') || 'Pose ta question...') : (t('guideTipPlaceholder') || 'Ton conseil pour les voyageurs...')}"
          maxlength="500"
        >${escapeHTML(text)}</textarea>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between px-3 py-2 border-t border-white/5">
        <span class="text-[10px] text-slate-600"><span id="guide-contrib-char-count">${text.length}</span>/500</span>
        <div class="flex gap-2">
          ${existing ? `
            <button
              onclick="deleteGuideContribution('${escapeJSString(existing.id)}')"
              class="px-3 py-1.5 rounded-full text-xs text-red-400 hover:bg-red-500/10 transition-colors"
            >
              ${t('delete') || 'Supprimer'}
            </button>
          ` : ''}
          <button
            onclick="submitGuideContribution()"
            class="px-4 py-1.5 rounded-full bg-blue-500 text-white text-xs font-semibold hover:bg-blue-400 transition-colors"
          >
            ${existing ? (t('guideUpdateContrib') || 'Mettre à jour') : (t('guideTipSubmit') || 'Publier')}
          </button>
        </div>
      </div>
    </div>
  `
}

// ==================== GLOBAL HANDLERS ====================
window.setGuideSection = (section) => {
  window.setState?.({ guideSection: section })
}

window.setGuideActiveSection = (sectionId) => {
  window.setState?.({ guideActiveSection: sectionId, guideOpenCategory: null })
  // Scroll feed to top
  setTimeout(() => {
    const feed = document.getElementById('guide-section-feed')
    if (feed) feed.scrollTop = 0
  }, 50)
}
// selectGuide and filterGuides are defined in Travel.js (authoritative source)

// Track form rating in memory (not state, to avoid re-render on each star click)
window._guideFormRating = 0
window._guideFormType = 'c'

window.setGuideFormType = (type) => {
  window._guideFormType = type
  const state = window.getState?.() || {}
  window.setState?.({ selectedCountryGuide: state.selectedCountryGuide })
}

window.openGuideCategory = (countryCode, categoryId) => {
  window._guideFormRating = 0
  window._guideFormType = 'c'
  // Load existing rating if available
  if (categoryId) {
    const tips = getUserGuideTips(countryCode)
    const existing = tips.find(t => t.category === categoryId)
    if (existing) window._guideFormRating = existing.rating
  }
  window.setState?.({ guideOpenCategory: categoryId, guideCustomCategoryOpen: false })
}

window.setGuideRating = (categoryId, rating) => {
  window._guideFormRating = rating
  // Update stars visually without full re-render
  const state = window.getState?.() || {}
  window.setState?.({ selectedCountryGuide: state.selectedCountryGuide })
}

window.submitGuideContribution = async () => {
  if (window.submitGuideContribution._busy) return
  window.submitGuideContribution._busy = true
  setTimeout(() => { window.submitGuideContribution._busy = false }, 2000)
  const { showError, showSuccess } = await import('../../services/notifications.js')
  const user = getCurrentUser()
  if (!user) {
    showError(t('guideLoginRequired') || 'Connecte-toi pour contribuer')
    window.openAuth?.()
    return
  }

  const state = window.getState?.() || {}
  const countryCode = state.selectedCountryGuide
  const category = state.guideOpenCategory
  if (!countryCode || !category) return

  // Check if this category requires a star rating
  const cat = GUIDE_CATEGORIES.find(c => c.id === category)
  const rating = window._guideFormRating
  if (cat?.ratingEnabled && (!rating || rating < 1)) {
    showError(t('guideYourRating') || 'Choisis une note')
    return
  }

  const text = document.getElementById('guide-contrib-text')?.value?.trim() || ''

  const contribType = window._guideFormType || 'c'
  const ratingVal = cat?.ratingEnabled ? rating : 0
  const result = await submitGuideTip({
    countryCode, category, type: contribType, rating: ratingVal, text,
  })
  if (result.success) {
    showSuccess(t('guideContribSaved') || 'Contribution enregistrée !')
    window._guideFormRating = 0
    window._guideFormType = 'c'
    window.setState?.({ guideOpenCategory: null, pendingGuideCountry: null })
  } else {
    showError(t('guideLoginRequired') || 'Connecte-toi pour contribuer')
  }
}

window.deleteGuideContribution = async (docId) => {
  const { showSuccess } = await import('../../services/notifications.js')
  const result = await deleteUserGuideTip(docId)
  if (result.success) {
    showSuccess(t('guideContribDeleted') || 'Contribution supprimée')
    const state = window.getState?.() || {}
    window.setState?.({ selectedCountryGuide: state.selectedCountryGuide, guideOpenCategory: null })
  }
}

window.addCustomGuideCategory = (_countryCode) => {
  const user = getCurrentUser()
  if (!user) {
    import('../../services/notifications.js').then(n => n.showError(t('guideLoginRequired') || 'Connecte-toi pour contribuer'))
    window.openAuth?.()
    return
  }
  window._guideFormRating = 0
  window.setState?.({ guideCustomCategoryOpen: true, guideOpenCategory: null })
}

window.submitCustomCategory = async () => {
  const { showError, showSuccess } = await import('../../services/notifications.js')
  const user = getCurrentUser()
  if (!user) {
    showError(t('guideLoginRequired') || 'Connecte-toi pour contribuer')
    return
  }

  const state = window.getState?.() || {}
  const countryCode = state.selectedCountryGuide
  if (!countryCode) return

  const name = document.getElementById('guide-custom-name')?.value?.trim()
  if (!name) {
    showError(t('guideCustomCategoryName') || 'Donne un nom à ta catégorie')
    return
  }

  const rating = window._guideFormRating
  if (!rating || rating < 1) {
    showError(t('guideYourRating') || 'Choisis une note')
    return
  }

  const text = document.getElementById('guide-custom-text')?.value?.trim() || ''

  const result = await submitGuideTip({
    countryCode,
    category: `custom_${name}`,
    rating,
    text,
    customCategory: true,
    customCategoryName: name,
  })

  if (result.success) {
    showSuccess(t('guideContribSaved') || 'Contribution enregistrée !')
    window._guideFormRating = 0
    window.setState?.({ guideCustomCategoryOpen: false })
  }
}

// Keep old handler names working (backward compat for tests)
window.selectGuideTipCategory = (_cat) => {
  // Legacy — no-op (replaced by openGuideCategory)
}

// Char counter for guide contribution textarea
document.addEventListener('input', (e) => {
  if (e.target.id === 'guide-contrib-text') {
    const count = document.getElementById('guide-contrib-char-count')
    if (count) count.textContent = e.target.value.length
  }
  if (e.target.id === 'guide-custom-text') {
    const count = document.getElementById('guide-custom-char-count')
    if (count) count.textContent = e.target.value.length
  }
})

// Alias removed per rule #8b (no aliases)

// Admin: approve/reject guide tips
window.adminApproveGuideTip = async (tipId) => {
  const { approveGuideTip } = await import('../../services/communityGuideService.js')
  return approveGuideTip(tipId)
}
window.adminRejectGuideTip = async (tipId) => {
  const { rejectGuideTip } = await import('../../services/communityGuideService.js')
  return rejectGuideTip(tipId)
}
window.adminLoadPendingGuideTips = async () => {
  const { loadPendingGuideTips } = await import('../../services/communityGuideService.js')
  return loadPendingGuideTips()
}

export default { renderGuides, renderCountryDetail, renderSafety }
