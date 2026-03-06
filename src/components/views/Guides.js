/**
 * Guides View Component
 * 6 sections: Getting Started, By Country, Safety, Useful Phrases, Events, Legality
 * Accessible from: Map overlay, Profile, SOS
 */

import { t } from '../../i18n/index.js'
import { countryGuides, getGuideByCode, getUniversalPhrases } from '../../data/guides.js'
import { icon } from '../../utils/icons.js'
import { renderSearchInput } from '../../utils/searchInput.js'
import { renderTipVoteButtons, renderSuggestionForm } from '../../services/feedbackService.js'
import { GUIDE_CATEGORIES, getUserGuideTips, submitGuideTip, deleteUserGuideTip } from '../../services/communityGuideService.js'
import { getCurrentUser } from '../../services/firebase.js'
import { escapeHTML, escapeJSString } from '../../utils/sanitize.js'

/* eslint-disable no-unused-vars -- static data kept for future reference */
const ETIQUETTE_DATA = {
  FR: {
    greeting: 'Poignée de main ferme. Entre amis, bises sur les joues (1 à 4 selon la région).',
    hitchhiking: 'Les Français sont souvent curieux, ils aiment converser. Un peu de français est très apprécié.',
    tipping: 'Pas obligatoire, mais laisser des pièces au café ou 5–10 % au restaurant est bien vu.',
    dos: ['Dire bonjour en entrant dans une boutique', 'Vouvoyer les inconnus', 'Apprécier la gastronomie locale'],
    donts: ['Couper la file', 'Parler fort dans les transports', 'Oublier de dire merci'],
  },
  DE: {
    greeting: 'Poignée de main franche au premier contact. Pas de bises entre inconnus.',
    hitchhiking: 'Les Allemands sont ponctuels et directs. Un itinéraire clair aide à obtenir un trajet.',
    tipping: 'Arrondir à l\'euro supérieur ou laisser 5–10 %. Dire le montant total au serveur.',
    dos: ['Être ponctuel', 'Séparer les déchets (poubelles colorées)', 'Respecter le silence le dimanche'],
    donts: ['Traverser au rouge même sans voiture', 'Parler fort inutilement', 'Ignorer les règles locales'],
  },
  ES: {
    greeting: 'Deux bises sur les joues pour tout le monde (même les hommes entre eux dans certaines régions).',
    hitchhiking: 'Les Espagnols sont chaleureux. Montrez de la joie et de l\'enthousiasme.',
    tipping: '5–10 % dans les restaurants, arrondir au café. Pas toujours attendu.',
    dos: ['Dîner tard (21h–23h)', 'Saluer chaque personne individuellement', 'Apprécier la sieste locale'],
    donts: ['Se plaindre de la chaleur', 'Manger en marchant dans les villes historiques', 'Être trop formel'],
  },
  IT: {
    greeting: 'Deux bises sur les joues. Poignée de main en contexte professionnel.',
    hitchhiking: 'Italiens expressifs et généreux. Sourire et gestes sont universels ici.',
    tipping: 'Non obligatoire mais apprécié : 1–2 € au café, 10 % au restaurant si content.',
    dos: ['Apprécier la nourriture locale', 'Être bien habillé en visite d\'église', 'Saluer en entrant'],
    donts: ['Commander un cappuccino après 11h (selon les puristes)', 'Toucher les fruits au marché', 'Se presser'],
  },
  PT: {
    greeting: 'Deux bises (femmes), poignée de main (hommes). Contact chaleureux.',
    hitchhiking: 'Les Portugais sont mélancoliques et hospitaliers. La saudade est dans l\'air.',
    tipping: 'Non obligatoire, mais laisser quelques pièces est apprécié.',
    dos: ['Apprécier le fado', 'Goûter les pastéis de nata', 'Être patient et calme'],
    donts: ['Comparer le Portugal à l\'Espagne', 'Parler espagnol si vous savez un peu de portugais', 'Se précipiter'],
  },
  NL: {
    greeting: 'Poignée de main ou trois bises (alternées). Très directs et informels.',
    hitchhiking: 'Les Néerlandais sont pragmatiques et anglophones. Soyez direct sur votre destination.',
    tipping: 'Optionnel, arrondir ou 5–10 % si le service est bon.',
    dos: ['Faire du vélo (respecter les pistes cyclables)', 'Être direct', 'Être à l\'heure'],
    donts: ['Bloquer une piste cyclable', 'Être indirect ou trop poli (perçu comme suspect)', 'Laisser votre vélo mal attaché'],
  },
  BE: {
    greeting: 'Une bise au nord (Flandre), trois au sud (Wallonie). Poignée de main formelle.',
    hitchhiking: 'Belges discrets et accueillants. L\'humour belge est subtil et apprécié.',
    tipping: 'Service inclus légalement mais un extra (5–10 %) est toujours bienvenu.',
    dos: ['Apprécier la bière et les moules-frites', 'Respecter la division linguistique', 'Parler lentement'],
    donts: ['Confondre belge et français', 'Prendre parti dans les disputes linguistiques', 'Être pressé'],
  },
  PL: {
    greeting: 'Poignée de main ferme. Les hommes baisent parfois la main des femmes.',
    hitchhiking: 'Les Polonais sont hospitaliers et fiers. Quelques mots de polonais font des miracles.',
    tipping: '10–15 % dans les restaurants. Pas toujours attendu.',
    dos: ['Enlever ses chaussures chez l\'hôte', 'Apporter un cadeau si invité', 'Apprécier le bigos et le pierogi'],
    donts: ['Refuser de la nourriture chez quelqu\'un', 'Débuter une conversation sur la guerre', 'Oublier de dire "smacznego" (bon appétit)'],
  },
  CZ: {
    greeting: 'Poignée de main. Contacts physiques réservés aux proches.',
    hitchhiking: 'Les Tchèques sont réservés mais ouverts une fois le contact établi.',
    tipping: '10 % dans les restaurants. Dire le montant total à la caisse.',
    dos: ['Enlever ses chaussures chez l\'hôte', 'Porter un toast avant de boire', 'Apprécier la bière locale'],
    donts: ['Parler fort dans les espaces publics', 'Refuser un verre offert', 'Confondre tchèque et slovaque'],
  },
  HR: {
    greeting: 'Deux bises entre amis. Poignée de main entre hommes.',
    hitchhiking: 'Les Croates sont chaleureux avec les visiteurs. Complimenter le pays aide beaucoup.',
    tipping: '10 % dans les restaurants si satisfait.',
    dos: ['Saluer en croate (dobar dan)', 'Apprécier le café et les conversations longues', 'Respecter les sites naturels'],
    donts: ['Nager dans des zones interdites', 'Sous-évaluer la beauté du pays', 'Oublier de négocier parfois'],
  },
  RO: {
    greeting: 'Poignée de main ou bises entre proches. Le "tu" est vite adopté.',
    hitchhiking: 'L\'auto-stop est très courant en Roumanie. Les gens s\'attendent parfois à être payés (negotiated ride).',
    tipping: '10 % dans les restaurants. Souvent attendu.',
    dos: ['Accepter l\'hospitalité avec grâce', 'Apprécier la cuisine (sarmale, mici)', 'Apprendre "mulțumesc" (merci)'],
    donts: ['Refuser la nourriture offerte', 'Ignorer les anciens', 'Photographier des gens sans permission'],
  },
  HU: {
    greeting: 'Poignée de main. Les Hongrois peuvent sembler réservés au début.',
    hitchhiking: 'Moins commun qu\'avant mais faisable. Être clair sur sa destination.',
    tipping: '10–15 % dans les restaurants. Dire le montant total avant de rendre la monnaie.',
    dos: ['Apprécier le goulasch et les bains thermaux', 'Apprendre "köszönöm" (merci)', 'Être patient'],
    donts: ['Confondre hongrois et autre langue slave', 'Refuser une invitation à manger', 'Parler fort en public'],
  },
  AT: {
    greeting: 'Poignée de main ferme. Formels avec les inconnus (Herr/Frau + nom).',
    hitchhiking: 'Moins répandu qu\'en Allemagne. Stations-service et aires d\'autoroute conseillées.',
    tipping: 'Arrondir ou laisser 5–10 %. Dire le montant total au serveur.',
    dos: ['Respecter le calme (surtout le dimanche)', 'Apprécier la musique classique', 'Être poli et formel'],
    donts: ['Négliger les salutations formelles', 'Faire du bruit la nuit', 'Critiquer la famille impériale'],
  },
  SE: {
    greeting: 'Poignée de main. Pas de bises. Les Suédois respectent l\'espace personnel.',
    hitchhiking: 'Rare mais possible. Soyez patient et très visible.',
    tipping: 'Optionnel, 10–15 % si service excellent.',
    dos: ['Respecter la file d\'attente (la queue est sacrée)', 'Parler à voix basse', 'Apprécier la nature (Allemensrätten)'],
    donts: ['S\'asseoir à côté de quelqu\'un si d\'autres places libres', 'Être trop intrusif', 'Négliger l\'environnement'],
  },
  NO: {
    greeting: 'Poignée de main directe. Très informels une fois le contact établi.',
    hitchhiking: 'Très sûr et pratiqué. Les Norvégiens aident volontiers les voyageurs.',
    tipping: '10–15 % dans les restaurants si apprécié. Pas toujours attendu.',
    dos: ['Respecter la nature (laisser sans trace)', 'Apprécier le silence', 'Être autosuffisant en randonnée'],
    donts: ['Jeter des déchets en nature', 'Sous-estimer la météo', 'Parler trop de politique'],
  },
  GB: {
    greeting: 'Poignée de main. Les bises sont rares sauf entre amis proches.',
    hitchhiking: 'Moins commun qu\'avant. Soyez bien habillé et ayez l\'air fiable.',
    tipping: '10–12.5 % dans les restaurants (parfois inclus). Arrondir dans les pubs.',
    dos: ['Faire la queue sans se plaindre', 'S\'excuser souvent (même sans raison)', 'Parler de la météo'],
    donts: ['Pousser dans une file', 'Être trop direct (perçu comme impoli)', 'Parler fort dans les transports'],
  },
  IE: {
    greeting: 'Poignée de main ou hochement de tête. Très chaleureux et informels.',
    hitchhiking: 'Encore pratiqué surtout en zones rurales. Irlandais très serviables.',
    tipping: '10–15 % dans les restaurants. Pas attendu dans les pubs.',
    dos: ['Apprécier le pub et les sessions de musique', 'Participer aux conversations', 'Rire de soi-même'],
    donts: ['Parler de politique nord-irlandaise avec inconnus', 'Confondre irlandais et britannique', 'Refuser un verre offert'],
  },
  US: {
    greeting: 'Poignée de main ferme et sourire. "How are you?" est une formule, pas une vraie question.',
    hitchhiking: 'Légal dans la plupart des États mais perçu comme inhabituel. Soyez rassurant et clair.',
    tipping: 'Obligatoire de fait : 15–20 % dans les restaurants, taxis, hôtels. Ne pas tiper est un affront.',
    dos: ['Sourire et être amical', 'Respecter les files', 'Dire "please" et "thank you"'],
    donts: ['Parler de politique ou de religion d\'emblée', 'Négliger le pourboire', 'Envahir l\'espace personnel'],
  },
  CA: {
    greeting: 'Poignée de main. Au Québec, deux bises entre proches. Très informels partout.',
    hitchhiking: 'Légal mais moins courant dans les grandes villes. Campagne et Québec plus favorables.',
    tipping: '15–20 % dans les restaurants. Similaire aux États-Unis.',
    dos: ['Être respectueux des deux langues (EN/FR au Québec)', 'Apprécier la nature', 'S\'excuser facilement'],
    donts: ['Confondre canadien et américain', 'Ignorer le français au Québec', 'Sous-estimer les hivers'],
  },
  AU: {
    greeting: 'Poignée de main décontractée. Très informels, "mate" est universel.',
    hitchhiking: 'Légal mais en déclin. Dans les zones reculées (Outback), c\'est encore pratiqué.',
    tipping: 'Non obligatoire, pas attendu. Laisser quelque chose si service exceptionnel.',
    dos: ['Respect de la culture aborigène', 'Apprécier l\'humour local (auto-dérision)', 'Être décontracté'],
    donts: ['Se plaindre de la chaleur', 'Nager sans vérifier les zones (méduses, requins)', 'Négliger la crème solaire'],
  },
}

// ==================== STATIC DATA: VISA INFO (#77) ====================
const VISA_DATA = {
  FR: { eu: 'free', us: 'free', duration: '90 jours (Schengen)', onArrival: false },
  DE: { eu: 'free', us: 'free', duration: '90 jours (Schengen)', onArrival: false },
  ES: { eu: 'free', us: 'free', duration: '90 jours (Schengen)', onArrival: false },
  IT: { eu: 'free', us: 'free', duration: '90 jours (Schengen)', onArrival: false },
  PT: { eu: 'free', us: 'free', duration: '90 jours (Schengen)', onArrival: false },
  NL: { eu: 'free', us: 'free', duration: '90 jours (Schengen)', onArrival: false },
  BE: { eu: 'free', us: 'free', duration: '90 jours (Schengen)', onArrival: false },
  PL: { eu: 'free', us: 'free', duration: '90 jours (Schengen)', onArrival: false },
  CZ: { eu: 'free', us: 'free', duration: '90 jours (Schengen)', onArrival: false },
  HR: { eu: 'free', us: 'free', duration: '90 jours (Schengen)', onArrival: false },
  RO: { eu: 'free', us: '90 jours', duration: '90 jours', onArrival: true },
  HU: { eu: 'free', us: 'free', duration: '90 jours (Schengen)', onArrival: false },
  AT: { eu: 'free', us: 'free', duration: '90 jours (Schengen)', onArrival: false },
  SE: { eu: 'free', us: 'free', duration: '90 jours (Schengen)', onArrival: false },
  NO: { eu: 'free', us: 'free', duration: '90 jours (Schengen)', onArrival: false },
  GB: { eu: 'free (ETA req.)', us: 'free (ETA req.)', duration: '6 mois', onArrival: false },
  IE: { eu: 'free', us: 'free (90 j)', duration: '90 jours', onArrival: false },
  US: { eu: 'ESTA (72h)', us: 'Citoyens', duration: '90 jours (ESTA)', onArrival: false },
  CA: { eu: 'AVE (eTA)', us: 'free', duration: '6 mois', onArrival: false },
  AU: { eu: 'ETA/eVisitor', us: 'ETA', duration: '3 mois', onArrival: false },
}

// ==================== STATIC DATA: CURRENCY INFO (#78) ====================
const CURRENCY_DATA = {
  FR: { name: 'Euro', symbol: '€', rateEUR: 1, rateUSD: 1.08, payment: ['cash', 'card', 'mobile'], budget: '30–50 €/jour' },
  DE: { name: 'Euro', symbol: '€', rateEUR: 1, rateUSD: 1.08, payment: ['cash', 'card', 'mobile'], budget: '25–45 €/jour' },
  ES: { name: 'Euro', symbol: '€', rateEUR: 1, rateUSD: 1.08, payment: ['cash', 'card', 'mobile'], budget: '20–40 €/jour' },
  IT: { name: 'Euro', symbol: '€', rateEUR: 1, rateUSD: 1.08, payment: ['cash', 'card', 'mobile'], budget: '25–45 €/jour' },
  PT: { name: 'Euro', symbol: '€', rateEUR: 1, rateUSD: 1.08, payment: ['cash', 'card', 'mobile'], budget: '20–35 €/jour' },
  NL: { name: 'Euro', symbol: '€', rateEUR: 1, rateUSD: 1.08, payment: ['card', 'mobile', 'cash'], budget: '30–55 €/jour' },
  BE: { name: 'Euro', symbol: '€', rateEUR: 1, rateUSD: 1.08, payment: ['cash', 'card', 'mobile'], budget: '30–50 €/jour' },
  PL: { name: 'Zloty polonais', symbol: 'PLN', rateEUR: 0.23, rateUSD: 0.25, payment: ['cash', 'card', 'mobile'], budget: '15–30 €/jour' },
  CZ: { name: 'Couronne tchèque', symbol: 'CZK', rateEUR: 0.041, rateUSD: 0.044, payment: ['cash', 'card', 'mobile'], budget: '15–30 €/jour' },
  HR: { name: 'Euro', symbol: '€', rateEUR: 1, rateUSD: 1.08, payment: ['cash', 'card', 'mobile'], budget: '25–45 €/jour' },
  RO: { name: 'Leu roumain', symbol: 'RON', rateEUR: 0.2, rateUSD: 0.22, payment: ['cash', 'card', 'mobile'], budget: '15–25 €/jour' },
  HU: { name: 'Forint hongrois', symbol: 'HUF', rateEUR: 0.0026, rateUSD: 0.0028, payment: ['cash', 'card', 'mobile'], budget: '15–30 €/jour' },
  AT: { name: 'Euro', symbol: '€', rateEUR: 1, rateUSD: 1.08, payment: ['cash', 'card', 'mobile'], budget: '30–55 €/jour' },
  SE: { name: 'Couronne suédoise', symbol: 'SEK', rateEUR: 0.088, rateUSD: 0.095, payment: ['card', 'mobile', 'cash'], budget: '35–60 €/jour' },
  NO: { name: 'Couronne norvégienne', symbol: 'NOK', rateEUR: 0.086, rateUSD: 0.093, payment: ['card', 'mobile', 'cash'], budget: '50–90 €/jour' },
  GB: { name: 'Livre sterling', symbol: '£', rateEUR: 1.17, rateUSD: 1.27, payment: ['card', 'mobile', 'cash'], budget: '40–70 €/jour' },
  IE: { name: 'Euro', symbol: '€', rateEUR: 1, rateUSD: 1.08, payment: ['card', 'mobile', 'cash'], budget: '35–60 €/jour' },
  US: { name: 'Dollar US', symbol: '$', rateEUR: 0.93, rateUSD: 1, payment: ['card', 'mobile', 'cash'], budget: '40–80 €/jour' },
  CA: { name: 'Dollar canadien', symbol: 'CAD', rateEUR: 0.68, rateUSD: 0.74, payment: ['card', 'mobile', 'cash'], budget: '35–65 €/jour' },
  AU: { name: 'Dollar australien', symbol: 'AUD', rateEUR: 0.59, rateUSD: 0.64, payment: ['card', 'mobile', 'cash'], budget: '40–70 €/jour' },
}
/* eslint-enable no-unused-vars */

const GUIDE_SECTIONS = [
  { id: 'start', icon: 'compass', color: 'amber', labelKey: 'guideStart', fallback: 'Débuter' },
  { id: 'countries', icon: 'globe', color: 'primary', labelKey: 'guideCountries', fallback: 'Par pays' },
  { id: 'safety', icon: 'shield', color: 'emerald', labelKey: 'guideSafety', fallback: 'Sécurité' },
]

export function renderGuides(state) {
  const activeSection = state.guideSection || 'start'
  const selectedGuide = state.selectedCountryGuide ? getGuideByCode(state.selectedCountryGuide) : null

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
  const name = country.name || country.code
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
        <h3 class="font-bold text-sm">${country.flag || ''} ${escapeHTML(country.name || code)}</h3>
      </div>
      <p class="text-sm text-slate-400">${t('guideNudgeText')?.replace('[pays]', escapeHTML(country.name || ''))?.replace('[country]', escapeHTML(country.name || '')) || 'Partage tes conseils pour ce pays !'}</p>
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
function renderCountriesSection() {
  const sortedGuides = [...countryGuides].sort((a, b) => a.difficulty - b.difficulty)

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
          return `
          <button
            onclick="selectGuide('${guide.code}')"
            class="card p-4 text-left hover:border-primary-500/50 transition-colors guide-card"
            data-country="${guide.name.toLowerCase()} ${(guide.nameEn || '').toLowerCase()}"
          >
            <div class="flex items-center gap-3 mb-2">
              <span class="text-3xl">${guide.flag}</span>
              <div>
                <div class="font-bold">${guide.name}</div>
                ${contribCount > 0
                  ? `<div class="text-xs text-emerald-400">${contribCount}/8 ${icon('check', 'w-3 h-3 inline')}</div>`
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
            <span class="font-bold">${guide.name}</span>
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
            <span class="font-bold">${guide.name}</span>
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
    gray: 'text-amber-400 bg-amber-500/20',
    restricted: 'text-danger-400 bg-danger-500/20',
  }

  const legalityLabels = {
    legal: t('legalityLegal') || 'Légal',
    mostly_legal: t('legalityMostlyLegal') || 'Quasi légal',
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
                <div class="font-medium">${guide.name}</div>
                <div class="text-xs text-slate-400 mt-0.5 line-clamp-1">${guide.legalityText}</div>
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

// ==================== COUNTRY DETAIL ====================
export function renderCountryDetail(guideOrCode) {
  const guide = typeof guideOrCode === 'string' ? getGuideByCode(guideOrCode) : guideOrCode
  if (!guide) return ''

  const state = window.getState?.() || {}
  const openCategory = state.guideOpenCategory || null
  const userTips = getUserGuideTips(guide.code)
  const contribCount = userTips.length

  return `
    <div class="space-y-4">
      <button
        onclick="selectGuide(null)"
        class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        ${icon('arrow-left', 'w-5 h-5')}
        ${t('backToGuides') || 'Retour aux guides'}
      </button>

      <!-- Header -->
      <div class="card p-5 text-center">
        <span class="text-5xl mb-3 block">${guide.flag}</span>
        <h2 class="text-xl font-bold mb-1">${escapeHTML(guide.name)}</h2>
        <p class="text-sm text-slate-400">
          ${contribCount > 0
            ? `${contribCount}/8 ${t('guideContribCount') || 'catégories contribuées'}`
            : (t('guideNoContribution') || 'Aucune contribution. Sois le premier !')
          }
        </p>
      </div>

      <!-- Category grid -->
      <div class="grid grid-cols-2 gap-3">
        ${GUIDE_CATEGORIES.map(cat => {
          const userTip = userTips.find(tip => tip.category === cat.id)
          const isOpen = openCategory === cat.id
          return `
            <button
              onclick="openGuideCategory('${escapeJSString(guide.code)}', '${cat.id}')"
              class="card p-3 text-left transition-all ${isOpen ? 'border-primary-500/50 bg-primary-500/10' : 'hover:border-white/20'}"
            >
              <div class="flex items-center gap-2 mb-1.5">
                <div class="w-8 h-8 rounded-lg ${userTip ? 'bg-emerald-500/20' : 'bg-white/10'} flex items-center justify-center">
                  ${icon(cat.icon, `w-4 h-4 ${userTip ? 'text-emerald-400' : 'text-slate-400'}`)}
                </div>
                <span class="text-xs font-medium leading-tight">${t(cat.labelKey) || cat.fallback}</span>
              </div>
              ${userTip ? `
                <div class="flex items-center gap-0.5 mb-1">
                  ${renderStarsStatic(userTip.rating)}
                </div>
                <p class="text-xs text-slate-400 line-clamp-2">${escapeHTML(userTip.text)}</p>
              ` : `
                <p class="text-xs text-slate-500">${t('guideYourRating') || 'Tap pour noter'}</p>
              `}
            </button>
          `
        }).join('')}
      </div>

      <!-- Add custom category button -->
      <button
        onclick="addCustomGuideCategory('${escapeJSString(guide.code)}')"
        class="w-full card p-3 flex items-center justify-center gap-2 text-sm text-primary-400 hover:bg-primary-500/10 transition-colors"
      >
        ${icon('plus', 'w-4 h-4')}
        ${t('guideAddCategory') || 'Ajouter une catégorie'}
      </button>

      <!-- Custom categories already contributed -->
      ${userTips.filter(tip => tip.customCategory).map(tip => `
        <div class="card p-3">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-medium">${escapeHTML(tip.customCategoryName || tip.category)}</span>
            <button onclick="deleteGuideContribution('${escapeJSString(tip.id)}')" class="text-xs text-danger-400 hover:text-danger-300">
              ${icon('trash-2', 'w-3.5 h-3.5')}
            </button>
          </div>
          <div class="flex items-center gap-0.5 mb-1">${renderStarsStatic(tip.rating)}</div>
          <p class="text-xs text-slate-400">${escapeHTML(tip.text)}</p>
        </div>
      `).join('')}

      <!-- Inline form (if a category is open) -->
      ${openCategory ? renderGuideCategoryForm(guide.code, openCategory, userTips) : ''}

      <!-- Custom category form -->
      ${state.guideCustomCategoryOpen ? renderCustomCategoryForm(guide.code) : ''}

      <!-- Bottom padding -->
      <div class="h-8"></div>
    </div>
  `
}

// Render safety page (kept for backward compatibility)
export function renderSafety() {
  return renderSafetySection()
}

// ==================== CONTRIBUTION FORM HELPERS ====================

function renderStarsStatic(rating) {
  return Array.from({ length: 5 }, (_, i) =>
    `<span class="text-sm ${i < rating ? 'text-amber-400' : 'text-slate-600'}">★</span>`
  ).join('')
}

function renderStarRating(currentRating, categoryId) {
  return `
    <div class="flex items-center gap-1" role="radiogroup" aria-label="${t('guideYourRating') || 'Ta note'}">
      ${Array.from({ length: 5 }, (_, i) => {
        const star = i + 1
        const active = star <= currentRating
        return `
          <button
            type="button"
            onclick="setGuideRating('${escapeJSString(categoryId)}', ${star})"
            class="text-2xl transition-transform hover:scale-125 ${active ? 'text-amber-400' : 'text-slate-600 hover:text-amber-300'}"
            aria-label="${star}/5"
          >★</button>
        `
      }).join('')}
    </div>
  `
}

function renderGuideCategoryForm(countryCode, categoryId, userTips) {
  const cat = GUIDE_CATEGORIES.find(c => c.id === categoryId)
  if (!cat) return ''
  const existing = userTips.find(tip => tip.category === categoryId)
  const rating = window._guideFormRating ?? existing?.rating ?? 0
  const text = existing?.text ?? ''

  return `
    <div class="card p-4 space-y-3 border border-primary-500/30 bg-primary-500/5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          ${icon(cat.icon, 'w-5 h-5 text-primary-400')}
          <h3 class="font-medium text-sm">${t(cat.labelKey) || cat.fallback}</h3>
        </div>
        <button onclick="openGuideCategory('${escapeJSString(countryCode)}', null)" class="text-slate-400 hover:text-white">
          ${icon('x', 'w-4 h-4')}
        </button>
      </div>

      <!-- Star rating -->
      ${renderStarRating(rating, categoryId)}

      <!-- Text -->
      <div>
        <textarea
          id="guide-contrib-text"
          class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-primary-500/50"
          rows="3"
          placeholder="${t('guideTipPlaceholder') || 'Ton conseil pour les voyageurs...'}"
          maxlength="500"
        >${escapeHTML(text)}</textarea>
        <p class="text-xs text-slate-500 mt-1 text-right"><span id="guide-contrib-char-count">${text.length}</span>/500</p>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          onclick="submitGuideContribution()"
          class="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
        >
          ${icon('send', 'w-4 h-4')}
          ${existing ? (t('guideUpdateContrib') || 'Mettre à jour') : (t('guideTipSubmit') || 'Envoyer')}
        </button>
        ${existing ? `
          <button
            onclick="deleteGuideContribution('${escapeJSString(existing.id)}')"
            class="px-4 py-2.5 rounded-xl bg-danger-500/20 text-danger-400 hover:bg-danger-500/30 text-sm transition-colors"
          >
            ${icon('trash-2', 'w-4 h-4')}
          </button>
        ` : ''}
      </div>
    </div>
  `
}

function renderCustomCategoryForm(_countryCode) {
  const rating = window._guideFormRating ?? 0
  return `
    <div class="card p-4 space-y-3 border border-amber-500/30 bg-amber-500/5">
      <div class="flex items-center justify-between">
        <h3 class="font-medium text-sm flex items-center gap-2">
          ${icon('plus', 'w-4 h-4 text-amber-400')}
          ${t('guideAddCategory') || 'Ajouter une catégorie'}
        </h3>
        <button onclick="window.setState?.({guideCustomCategoryOpen:false})" class="text-slate-400 hover:text-white">
          ${icon('x', 'w-4 h-4')}
        </button>
      </div>

      <!-- Custom name -->
      <input
        type="text"
        id="guide-custom-name"
        class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
        placeholder="${t('guideCustomCategoryName') || 'Nom de la catégorie...'}"
        maxlength="50"
      />

      <!-- Star rating -->
      ${renderStarRating(rating, 'custom')}

      <!-- Text -->
      <div>
        <textarea
          id="guide-custom-text"
          class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-amber-500/50"
          rows="3"
          placeholder="${t('guideTipPlaceholder') || 'Ton conseil pour les voyageurs...'}"
          maxlength="500"
        ></textarea>
        <p class="text-xs text-slate-500 mt-1 text-right"><span id="guide-custom-char-count">0</span>/500</p>
      </div>

      <!-- Submit -->
      <button
        onclick="submitCustomCategory()"
        class="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
      >
        ${icon('send', 'w-4 h-4')}
        ${t('guideTipSubmit') || 'Envoyer'}
      </button>
    </div>
  `
}

// ==================== GLOBAL HANDLERS ====================
window.setGuideSection = (section) => {
  window.setState?.({ guideSection: section })
}
// selectGuide and filterGuides are defined in Travel.js (authoritative source)

// Track form rating in memory (not state, to avoid re-render on each star click)
window._guideFormRating = 0

window.openGuideCategory = (countryCode, categoryId) => {
  window._guideFormRating = 0
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

  const rating = window._guideFormRating
  if (!rating || rating < 1) {
    showError(t('guideYourRating') || 'Choisis une note')
    return
  }

  const text = document.getElementById('guide-contrib-text')?.value?.trim() || ''

  const result = await submitGuideTip({ countryCode, category, rating, text })
  if (result.success) {
    showSuccess(t('guideContribSaved') || 'Contribution enregistrée !')
    window._guideFormRating = 0
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

window.submitGuideTip = window.submitGuideContribution

export default { renderGuides, renderCountryDetail, renderSafety }
