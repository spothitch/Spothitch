/**
 * FeatureSlides — Full-screen emotional slides for "coming soon" features
 * Style: dark overlay, amber gradient, progress bar, swipe + keyboard navigation
 * Each feature has 4-7 content slides + 1 CTA slide
 */

import { t } from '../../i18n/index.js'
import { escapeHTML } from '../../utils/sanitize.js'

// ==================== SLIDES DATA ====================

function getSlidesData(featureId) {
  const ctaSlide = {
    emoji: '🗺️',
    color: '#f59e0b',
    title: t('featureSlidesCTATitle') || "C'est toi qui décides la suite.",
    subtitle: t('featureSlidesCTASubtitle') || "On construit ça en ce moment. Ton feedback sur cette démo influence directement ce qu'on intègre.",
    type: 'cta',
    items: [
      { icon: '💬', text: t('featureSlidesCTAItem1') || "Dis-nous ce que tu veux → bouton Avis" },
      { icon: '🔨', text: t('featureSlidesCTAItem2') || "On intègre tes idées dans le développement" },
      { icon: '🎉', text: t('featureSlidesCTAItem3') || "Tu obtiens l'accès en premier" },
    ],
  }

  const slides = {
    'guardian-mode': [
      {
        emoji: '💭',
        color: '#6366f1',
        title: t('guardianSlide1Title') || "Tu t'es déjà demandé comment rassurer ceux que tu laisses ?",
        subtitle: t('guardianSlide1Sub') || "Chaque départ en stop, quelqu'un attend de tes nouvelles.",
        hint: t('swipeHint') || "Glisse pour continuer →",
      },
      {
        emoji: '🌙',
        color: '#8b5cf6',
        title: t('guardianSlide2Title') || "23h47. Maman attend.",
        subtitle: t('guardianSlide2Sub') || "Elle ne dort pas. Elle regarde son téléphone.",
        quote: '"Chaque fois que ma fille part en stop, je passe la nuit à regarder mon téléphone." · Maman d\'une autostoppeuse',
      },
      {
        emoji: '😌',
        color: '#4ade80',
        title: t('guardianSlide3Title') || "Avec Mode Gardien elle sait.",
        subtitle: t('guardianSlide3Sub') || "Ta position en direct. Tes check-ins. Ta batterie.",
        card: {
          items: [
            { icon: '📍', label: 'Position', value: 'A62 · Bordeaux' },
            { icon: '✅', label: 'Check-in', value: 'Il y a 12 min' },
            { icon: '🔋', label: 'Batterie', value: '78%' },
          ],
        },
      },
      {
        emoji: '📳',
        color: '#f59e0b',
        title: t('guardianSlide4Title') || "Le check-in toutes les 30 min",
        subtitle: t('guardianSlide4Sub') || "Un bouton. Une pression. Tout le monde sait que ça va.",
        checkins: ['14h32 ✅', '15h04 ✅', '15h38 ✅'],
      },
      {
        emoji: '⚠️',
        color: '#ef4444',
        title: t('guardianSlide5Title') || "Et si tu ne réponds plus ?",
        subtitle: t('guardianSlide5Sub') || "Alerte automatique. Tes gardiens sont prévenus.",
        timeline: [
          { icon: '⏱️', text: 'Timer de 30 min sans réponse' },
          { icon: '📲', text: 'Alerte push à tous tes gardiens' },
          { icon: '📍', text: 'Dernière position partagée' },
        ],
      },
      {
        emoji: '💛',
        color: '#f59e0b',
        title: t('guardianSlide6Title') || "Tout le monde y gagne",
        subtitle: t('guardianSlide6Sub') || "Tu voyages librement. Tes proches dorment tranquilles.",
        grid: [
          { emoji: '🧭', label: 'Toi', desc: 'Voyage libre' },
          { emoji: '👨‍👩‍👧', label: 'Eux', desc: 'Dorment' },
          { emoji: '📍', label: 'Position', desc: 'En direct' },
          { emoji: '🆘', label: 'SOS', desc: 'En 1 tap' },
        ],
      },
      ctaSlide,
    ],

    'journal': [
      {
        emoji: '📖',
        color: '#6366f1',
        title: t('journalSlide1Title') || "Tes lifts méritent d'être racontés",
        subtitle: t('journalSlide1Sub') || "Chaque pouce levé, une histoire. Chaque stop, un souvenir.",
        hint: t('swipeHint') || "Glisse pour continuer →",
      },
      {
        emoji: '✍️',
        color: '#8b5cf6',
        title: t('journalSlide2Title') || "Chaque lift, une histoire",
        subtitle: t('journalSlide2Sub') || "Enregistré automatiquement depuis ta position.",
        card: {
          items: [
            { icon: '🚗', label: 'Conducteur', value: 'Farmer Jean-Paul' },
            { icon: '🛣️', label: 'Trajet', value: '47 km · 28 min' },
            { icon: '⭐', label: 'Anecdote', value: 'Parlé de fromages' },
          ],
        },
      },
      {
        emoji: '🗺️',
        color: '#4ade80',
        title: t('journalSlide3Title') || "Ta carte du monde se dessine",
        subtitle: t('journalSlide3Sub') || "Chaque itinéraire tracé. Chaque pays coloré. Ta vie sur la carte.",
      },
      {
        emoji: '👥',
        color: '#f59e0b',
        title: t('journalSlide4Title') || "Inspire la communauté",
        subtitle: t('journalSlide4Sub') || "Partage tes routes. D'autres autostoppeurs les suivront.",
      },
      ctaSlide,
    ],

    'hostels': [
      {
        emoji: '🏨',
        color: '#6366f1',
        title: t('hostelsSlide1Title') || "Fini de chercher pendant 2h",
        subtitle: t('hostelsSlide1Sub') || "Les meilleures auberges choisies par des autostoppeurs, pour des autostoppeurs.",
        hint: t('swipeHint') || "Glisse pour continuer →",
      },
      {
        emoji: '💰',
        color: '#4ade80',
        title: t('hostelsSlide2Title') || "Recommandé par la communauté",
        subtitle: t('hostelsSlide2Sub') || "Pas des avis de touristes. Des avis d'autostoppeurs qui font les mêmes trajets que toi.",
      },
      {
        emoji: '🏷️',
        color: '#f59e0b',
        title: t('hostelsSlide3Title') || "Filtres qui te ressemblent",
        subtitle: t('hostelsSlide3Sub') || "Festif, Calme, Budget, Social. Trouve ton style en un tap.",
        tags: ['🎉 Festif', '🤫 Calme', '💸 Budget', '🤝 Social'],
      },
      {
        emoji: '🎫',
        color: '#ec4899',
        title: t('hostelsSlide4Title') || "-15% avec tes points SpotHitch",
        subtitle: t('hostelsSlide4Sub') || "Tes contributions à la communauté te rapportent des réductions concrètes.",
      },
      ctaSlide,
    ],

    'city-pages': [
      {
        emoji: '🏙️',
        color: '#6366f1',
        title: t('cityPagesSlide1Title') || "Chaque ville a ses secrets",
        subtitle: t('cityPagesSlide1Sub') || "Les vrais spots d'autostop. Pas les arrêts de bus de Google Maps.",
        hint: t('swipeHint') || "Glisse pour continuer →",
      },
      {
        emoji: '📊',
        color: '#4ade80',
        title: t('cityPagesSlide2Title') || "Spots par direction, temps d'attente réels",
        subtitle: t('cityPagesSlide2Sub') || "Vers Paris : 12 min en moyenne. Vers Lyon : 8 min. Données de la communauté.",
      },
      {
        emoji: '⚖️',
        color: '#f59e0b',
        title: t('cityPagesSlide3Title') || "Lois locales et conseils pratiques",
        subtitle: t('cityPagesSlide3Sub') || "Est-ce légal de faire du stop ici ? Quelle police patrouille ? La communauté le sait.",
      },
      {
        emoji: '🤝',
        color: '#8b5cf6',
        title: t('cityPagesSlide4Title') || "Enrichie par la communauté",
        subtitle: t('cityPagesSlide4Sub') || "Chaque autostoppeur qui passe ajoute ses infos. La ville devient plus précise.",
      },
      ctaSlide,
    ],

    'leagues': [
      {
        emoji: '🏆',
        color: '#f59e0b',
        title: t('leaguesSlide1Title') || "Ta route compte",
        subtitle: t('leaguesSlide1Sub') || "Chaque spot créé, chaque validation, chaque check-in, ça compte vraiment.",
        hint: t('swipeHint') || "Glisse pour continuer →",
      },
      {
        emoji: '📍',
        color: '#4ade80',
        title: t('leaguesSlide2Title') || "Points pour chaque spot créé ou validé",
        subtitle: t('leaguesSlide2Sub') || "Tu améliores la carte pour tout le monde. La communauté te le rend.",
      },
      {
        emoji: '🌍',
        color: '#6366f1',
        title: t('leaguesSlide3Title') || "Classement pays, Europe et mondial",
        subtitle: t('leaguesSlide3Sub') || "Meilleur autostoppeur de Belgique ? De l'Europe ? Du monde ? C'est toi qui décides.",
      },
      ctaSlide,
    ],

    'groups-races': [
      {
        emoji: '🎉',
        color: '#ec4899',
        title: t('groupsSlide1Title') || "L'auto-stop, c'est encore mieux ensemble",
        subtitle: t('groupsSlide1Sub') || "Organise, compète, retrouve-toi.",
        hint: t('swipeHint') || "Glisse pour continuer →",
      },
      {
        emoji: '🏁',
        color: '#f59e0b',
        title: t('groupsSlide2Title') || "Organise une course, invite tes potes",
        subtitle: t('groupsSlide2Sub') || "Même départ, même arrivée, le premier à trouver un lift gagne. Classement live.",
      },
      {
        emoji: '📍',
        color: '#4ade80',
        title: t('groupsSlide3Title') || "Retrouve les autostoppeurs près de toi",
        subtitle: t('groupsSlide3Sub') || "Quelqu'un sur le même spot ? Faites du co-voiturage communautaire.",
      },
      ctaSlide,
    ],

    'events': [
      {
        emoji: '📅',
        color: '#6366f1',
        title: t('eventsSlide1Title') || "Rencontre la communauté en vrai",
        subtitle: t('eventsSlide1Sub') || "Meetups, festivals, rassemblements d'autostoppeurs.",
        hint: t('swipeHint') || "Glisse pour continuer →",
      },
      {
        emoji: '🗺️',
        color: '#4ade80',
        title: t('eventsSlide2Title') || "Événements près de toi",
        subtitle: t('eventsSlide2Sub') || "Filtres par ville, date, type. Trouve ton prochain rassemblement.",
      },
      {
        emoji: '👋',
        color: '#f59e0b',
        title: t('eventsSlide3Title') || "Crée ton propre événement",
        subtitle: t('eventsSlide3Sub') || "Un meetup, une sortie, une course. Invite la communauté.",
      },
      ctaSlide,
    ],

    'thumbs-partners': [
      {
        emoji: '👍',
        color: '#f59e0b',
        title: t('thumbsSlide1Title') || "Voyage mieux, dépense moins",
        subtitle: t('thumbsSlide1Sub') || "Tes contributions à SpotHitch te rapportent des vrais avantages.",
        hint: t('swipeHint') || "Glisse pour continuer →",
      },
      {
        emoji: '🎒',
        color: '#4ade80',
        title: t('thumbsSlide2Title') || "Tes points te donnent des avantages",
        subtitle: t('thumbsSlide2Sub') || "Gagne des points en créant des spots, en validant, en aidant la communauté.",
      },
      {
        emoji: '🏷️',
        color: '#6366f1',
        title: t('thumbsSlide3Title') || "Hostelworld, Patagonia, iOverlander...",
        subtitle: t('thumbsSlide3Sub') || "Des partenaires qui comprennent le voyage slow. Des réductions qui ont du sens.",
        tags: ['🏨 Hostelworld', '🧥 Patagonia', '🏕️ iOverlander'],
      },
      ctaSlide,
    ],

    'tech-improvements': [
      {
        emoji: '🚀',
        color: '#6366f1',
        title: t('techSlide1Title') || "L'app que vous méritez",
        subtitle: t('techSlide1Sub') || "Plus rapide, plus fiable, plus belle. Toujours.",
        hint: t('swipeHint') || "Glisse pour continuer →",
      },
      {
        emoji: '⚡',
        color: '#f59e0b',
        title: t('techSlide2Title') || "Plus rapide, plus fiable",
        subtitle: t('techSlide2Sub') || "Carte qui se charge en 0.5s. Spots disponibles même sans internet.",
      },
      ctaSlide,
    ],
  }

  return slides[featureId] || null
}

// ==================== RENDER ====================

function renderSlideContent(slide, featureId) {
  if (slide.type === 'cta') {
    return `
      <div class="flex flex-col items-center text-center px-6 pt-4 pb-2">
        <div class="text-5xl mb-5">${slide.emoji}</div>
        <h2 class="text-2xl font-extrabold mb-3 leading-tight" style="color:#f59e0b">${escapeHTML(slide.title)}</h2>
        <p class="text-sm leading-relaxed mb-6" style="color:#94a3b8">${escapeHTML(slide.subtitle)}</p>
        <div class="w-full space-y-3 mb-6">
          ${(slide.items || []).map(item => `
            <div class="flex items-center gap-3 p-3 rounded-xl text-left" style="background:rgba(255,255,255,0.05)">
              <span class="text-xl shrink-0">${item.icon}</span>
              <span class="text-sm" style="color:#e2e8f0">${escapeHTML(item.text)}</span>
            </div>
          `).join('')}
        </div>
        <button onclick="openFeedbackOnFeature('${featureId}')"
          class="w-full py-4 rounded-2xl font-extrabold text-base cursor-pointer"
          style="background:linear-gradient(135deg,#f59e0b,#fb923c);color:#0f1520;border:none;box-shadow:0 4px 20px rgba(245,158,11,0.4)">
          ${escapeHTML(t('featureAvisBtn') || '💬 Donner mon avis sur cette feature')}
        </button>
      </div>
    `
  }

  let extra = ''

  if (slide.hint) {
    extra += `<p class="text-xs mt-4 animate-pulse" style="color:#64748b">${escapeHTML(slide.hint)}</p>`
  }

  if (slide.quote) {
    extra += `
      <div class="mt-4 p-4 rounded-xl text-sm italic leading-relaxed" style="background:rgba(255,255,255,0.05);color:#94a3b8;border-left:3px solid ${slide.color || '#f59e0b'}">
        ${escapeHTML(slide.quote)}
      </div>
    `
  }

  if (slide.card) {
    extra += `
      <div class="mt-4 rounded-xl overflow-hidden" style="background:rgba(255,255,255,0.05)">
        ${slide.card.items.map(item => `
          <div class="flex items-center gap-3 px-4 py-3" style="border-bottom:1px solid rgba(255,255,255,0.05)">
            <span class="text-lg shrink-0">${item.icon}</span>
            <span class="text-xs" style="color:#64748b;min-width:70px">${escapeHTML(item.label)}</span>
            <span class="text-sm font-semibold" style="color:#e2e8f0">${escapeHTML(item.value)}</span>
          </div>
        `).join('')}
      </div>
    `
  }

  if (slide.checkins) {
    extra += `
      <div class="mt-4 flex gap-2 flex-wrap">
        ${slide.checkins.map(c => `
          <div class="px-3 py-2 rounded-xl text-sm font-semibold" style="background:rgba(74,222,128,0.1);color:#4ade80">${escapeHTML(c)}</div>
        `).join('')}
      </div>
    `
  }

  if (slide.timeline) {
    extra += `
      <div class="mt-4 space-y-3">
        ${slide.timeline.map((item, i) => `
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0" style="background:rgba(239,68,68,0.15)">${item.icon}</div>
            ${i < slide.timeline.length - 1 ? '' : ''}
            <span class="text-sm" style="color:#e2e8f0">${escapeHTML(item.text)}</span>
          </div>
        `).join('')}
      </div>
    `
  }

  if (slide.grid) {
    extra += `
      <div class="mt-4 grid grid-cols-2 gap-2">
        ${slide.grid.map(item => `
          <div class="p-3 rounded-xl text-center" style="background:rgba(255,255,255,0.05)">
            <div class="text-2xl mb-1">${item.emoji}</div>
            <div class="text-xs font-bold" style="color:#e2e8f0">${escapeHTML(item.label)}</div>
            <div class="text-[10px]" style="color:#64748b">${escapeHTML(item.desc)}</div>
          </div>
        `).join('')}
      </div>
    `
  }

  if (slide.tags) {
    extra += `
      <div class="mt-4 flex flex-wrap gap-2">
        ${slide.tags.map(tag => `
          <span class="px-3 py-1.5 rounded-full text-sm font-semibold" style="background:rgba(245,158,11,0.15);color:#f59e0b">${escapeHTML(tag)}</span>
        `).join('')}
      </div>
    `
  }

  return `
    <div class="flex flex-col items-center text-center px-6 pt-4 pb-2">
      <div class="text-5xl mb-5">${slide.emoji}</div>
      <h2 class="text-2xl font-extrabold mb-3 leading-tight" style="color:${escapeHTML(slide.color || '#f59e0b')}">${escapeHTML(slide.title)}</h2>
      <p class="text-sm leading-relaxed" style="color:#94a3b8">${escapeHTML(slide.subtitle)}</p>
      ${extra}
    </div>
  `
}

function buildOverlayHTML(featureId, slides) {
  return `
    <div class="fixed inset-0 flex items-end justify-center" style="z-index:200;background:rgba(0,0,0,0.92)" onclick="if(event.target===this)closeFeatureSlides()" aria-modal="true" role="dialog">
      <div class="w-full max-w-md flex flex-col" style="height:90vh;background:#050510;border-radius:24px 24px 0 0;overflow:hidden;position:relative">

        <!-- Progress bar -->
        <div id="fs-progress-bar" class="absolute top-0 left-0 h-[3px] transition-all duration-400" style="background:linear-gradient(90deg,#f59e0b,#fb923c);width:${Math.round(100 / slides.length)}%;border-radius:0 2px 2px 0"></div>

        <!-- Close button -->
        <button onclick="closeFeatureSlides()" class="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-base" style="z-index:10;background:rgba(255,255,255,0.08);color:#94a3b8;border:none;cursor:pointer" aria-label="Fermer">✕</button>

        <!-- Dots -->
        <div class="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5" style="z-index:10">
          ${slides.map((_, i) => `
            <div id="fs-dot-${i}" class="rounded-full transition-all duration-300" style="width:${i === 0 ? '20px' : '6px'};height:6px;background:${i === 0 ? '#f59e0b' : 'rgba(255,255,255,0.2)'}"></div>
          `).join('')}
        </div>

        <!-- Slides container -->
        <div id="fs-slides-container" class="flex-1 overflow-hidden relative" style="margin-top:36px">
          ${slides.map((slide, i) => `
            <div id="fs-slide-${i}" class="absolute inset-0 overflow-y-auto transition-all duration-400" style="opacity:${i === 0 ? 1 : 0};transform:translateX(${i === 0 ? '0' : '100%'})">
              <div class="min-h-full flex flex-col justify-center py-4">
                ${renderSlideContent(slide, featureId)}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Nav buttons (prev / next) — hidden on CTA slide -->
        <div id="fs-nav" class="px-6 pb-6 pt-2 flex gap-3 shrink-0">
          <button id="fs-prev-btn" onclick="featureSlidesPrev()" class="flex-1 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-opacity" style="background:rgba(255,255,255,0.06);color:#94a3b8;border:none;display:none" aria-label="Précédent">← Précédent</button>
          <button id="fs-next-btn" onclick="featureSlidesNext()" class="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer" style="background:rgba(245,158,11,0.15);color:#f59e0b;border:1px solid rgba(245,158,11,0.3)" aria-label="Suivant">Suivant →</button>
        </div>
      </div>
    </div>
  `
}

// ==================== INTERACTION ====================

let _currentSlideIdx = 0
let _totalSlides = 0
let _touchStartX = 0

function updateSlideUI(idx) {
  const total = _totalSlides

  // Update progress bar
  const bar = document.getElementById('fs-progress-bar')
  if (bar) bar.style.width = `${Math.round(((idx + 1) / total) * 100)}%`

  // Update dots
  for (let i = 0; i < total; i++) {
    const dot = document.getElementById(`fs-dot-${i}`)
    if (dot) {
      dot.style.width = i === idx ? '20px' : '6px'
      dot.style.background = i === idx ? '#f59e0b' : 'rgba(255,255,255,0.2)'
    }
  }

  // Update slides visibility
  for (let i = 0; i < total; i++) {
    const slide = document.getElementById(`fs-slide-${i}`)
    if (!slide) continue
    if (i === idx) {
      slide.style.opacity = '1'
      slide.style.transform = 'translateX(0)'
    } else if (i < idx) {
      slide.style.opacity = '0'
      slide.style.transform = 'translateX(-100%)'
    } else {
      slide.style.opacity = '0'
      slide.style.transform = 'translateX(100%)'
    }
  }

  // Update nav buttons
  const prevBtn = document.getElementById('fs-prev-btn')
  const nextBtn = document.getElementById('fs-next-btn')
  const isLast = idx === total - 1

  if (prevBtn) prevBtn.style.display = idx === 0 ? 'none' : 'block'
  if (nextBtn) {
    if (isLast) {
      // On CTA slide, hide the next button (CTA has its own button)
      nextBtn.style.display = 'none'
    } else {
      nextBtn.style.display = 'block'
    }
  }
}

function initSlidesInteraction(featureId, totalSlides) {
  _currentSlideIdx = 0
  _totalSlides = totalSlides

  const overlay = document.getElementById('feature-slides-overlay')
  if (!overlay) return

  // Touch swipe support
  overlay.addEventListener('touchstart', (e) => {
    _touchStartX = e.touches[0].clientX
  }, { passive: true })

  overlay.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - _touchStartX
    if (Math.abs(dx) > 50) {
      if (dx < 0) window.featureSlidesNext()
      else window.featureSlidesPrev()
    }
  }, { passive: true })

  // Keyboard navigation
  const keyHandler = (e) => {
    if (!document.getElementById('feature-slides-overlay')) {
      document.removeEventListener('keydown', keyHandler)
      return
    }
    if (e.key === 'ArrowRight') window.featureSlidesNext()
    if (e.key === 'ArrowLeft') window.featureSlidesPrev()
    if (e.key === 'Escape') window.closeFeatureSlides()
  }
  document.addEventListener('keydown', keyHandler)
}

// ==================== WINDOW HANDLERS ====================

window.openFeatureSlides = (featureId) => {
  document.getElementById('feature-slides-overlay')?.remove()
  const slides = getSlidesData(featureId)
  if (!slides) return
  const el = document.createElement('div')
  el.id = 'feature-slides-overlay'
  el.innerHTML = buildOverlayHTML(featureId, slides)
  document.body.appendChild(el)
  initSlidesInteraction(featureId, slides.length)
}

window.closeFeatureSlides = () => {
  document.getElementById('feature-slides-overlay')?.remove()
}

window.featureSlidesNext = () => {
  if (_currentSlideIdx < _totalSlides - 1) {
    _currentSlideIdx++
    updateSlideUI(_currentSlideIdx)
  }
}

window.featureSlidesPrev = () => {
  if (_currentSlideIdx > 0) {
    _currentSlideIdx--
    updateSlideUI(_currentSlideIdx)
  }
}

window.openFeedbackOnFeature = (featureId) => {
  window.closeFeatureSlides()
  window.openFeedbackPanel?.()
  setTimeout(() => {
    window.openFeedbackDetail?.(featureId)
  }, 300)
}

window.selectFeatureOpinion = (featureId, opinion) => {
  try {
    const opinions = JSON.parse(localStorage.getItem('spothitch_feature_opinions') || '{}')
    const existing = opinions[featureId] || {}
    opinions[featureId] = { ...existing, opinion, ts: new Date().toISOString() }
    localStorage.setItem('spothitch_feature_opinions', JSON.stringify(opinions))
    import('../../services/firebaseSync.js').then(m => m.syncAllToFirestore()).catch(() => {})
  } catch { /* ignore */ }

  // Show textarea if 'detail' opinion selected
  const textarea = document.getElementById('feature-opinion-comment')
  if (textarea) {
    textarea.style.display = opinion === 'detail' ? 'block' : 'none'
  }

  // Highlight selected button
  const btns = document.querySelectorAll('[data-opinion-btn]')
  btns.forEach(btn => {
    const isSelected = btn.getAttribute('data-opinion-btn') === opinion
    btn.style.border = isSelected ? '2px solid #f59e0b' : '2px solid rgba(255,255,255,0.06)'
    btn.style.background = isSelected ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.02)'
  })
}

window.submitFeatureOpinion = async (featureId) => {
  try {
    const comment = document.getElementById('feature-opinion-comment')?.value || ''
    const opinions = JSON.parse(localStorage.getItem('spothitch_feature_opinions') || '{}')
    const existing = opinions[featureId] || {}
    opinions[featureId] = { ...existing, comment, ts: new Date().toISOString() }
    localStorage.setItem('spothitch_feature_opinions', JSON.stringify(opinions))
    import('../../services/firebaseSync.js').then(m => m.syncAllToFirestore()).catch(() => {})

    // Try to save to Firebase (requires auth)
    if (existing.opinion) {
      try {
        const { getAuth } = await import('firebase/auth')
        const { getApp } = await import('firebase/app')
        const auth = getAuth(getApp())
        const user = auth.currentUser
        if (user) {
          const { getFirestore, collection, addDoc } = await import('firebase/firestore')
          const db = getFirestore(getApp())
          await addDoc(collection(db, 'featureOpinions'), {
            featureId,
            opinion: existing.opinion,
            comment,
            userId: user.uid,
            timestamp: new Date().toISOString(),
          })
        }
      } catch { /* Firebase not required */ }
    }

    if (window.showToast) {
      window.showToast(t('fbThanks') || 'Merci !', 'success')
    }
    // Close detail
    window.closeFeedbackDetail?.()
  } catch { /* ignore */ }
}

export { }
