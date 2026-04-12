/**
 * Journal / Trip Diary Component
 * Renders trip list, trip detail (timeline), add leg, expenses, day notes, stats
 * Matches mockup v1-final.html pixel-perfect
 */

import { t } from '../../i18n/index.js'
import { icon } from '../../utils/icons.js'
import { escapeHTML, escapeJSString } from '../../utils/sanitize.js'
import { getState } from '../../stores/state.js'
import {
  getTrips, getTrip, getLegsByDay, getTripStats,
  EXPENSE_CATEGORIES,
} from '../../services/tripJournal.js'

// Transport config: icon name, label, color
// Transport labels use i18n — called as functions to get current language
const TRANSPORTS = {
  hitchhike: { icon: 'thumbs-up', label: () => t('transportHitchhike') || 'Autostop', color: '#22c55e', bg: 'rgba(34,197,94,.1)', line: 'rgba(34,197,94,.2)' },
  walk:      { icon: 'footprints', label: () => t('transportWalk') || 'Walk',        color: '#3b82f6', bg: 'rgba(59,130,246,.1)', line: 'rgba(59,130,246,.2)' },
  bus:       { icon: 'bus',        label: () => t('transportBus') || 'Bus',           color: '#8b5cf6', bg: 'rgba(139,92,246,.1)', line: 'rgba(139,92,246,.2)' },
  train:     { icon: 'train',      label: () => t('transportTrain') || 'Train',       color: '#f59e0b', bg: 'rgba(245,158,11,.1)', line: 'rgba(245,158,11,.2)' },
  plane:     { icon: 'plane',      label: () => t('transportPlane') || 'Plane',       color: '#ec4899', bg: 'rgba(236,72,153,.1)', line: 'rgba(236,72,153,.2)' },
  boat:      { icon: 'ship',       label: () => t('transportBoat') || 'Boat',         color: '#06b6d4', bg: 'rgba(6,182,212,.1)', line: 'rgba(6,182,212,.2)' },
  bike:      { icon: 'bike',       label: () => t('transportBike') || 'Bike',         color: '#14b8a6', bg: 'rgba(20,184,166,.1)', line: 'rgba(20,184,166,.2)' },
  car:       { icon: 'car',        label: () => t('transportCar') || 'Car',           color: '#f97316', bg: 'rgba(249,115,22,.1)', line: 'rgba(249,115,22,.2)' },
  other:     { icon: 'package',    label: () => t('transportOther') || 'Other',       color: '#64748b', bg: 'rgba(100,116,139,.1)', line: 'rgba(100,116,139,.15)' },
}

const EXPENSE_ICONS = {
  transport: { icon: 'route', color: '#8b5cf6', bg: 'rgba(139,92,246,.1)', label: () => t('expenseTransport') || 'Transport', hint: () => t('expenseTransportHint') || 'Bus, train, taxi...' },
  lodging:   { icon: 'bed', color: '#3b82f6', bg: 'rgba(59,130,246,.1)', label: () => t('expenseLodging') || 'Lodging', hint: () => t('expenseLodgingHint') || 'Hotel, hostel, camping...' },
  food:      { icon: 'coffee', color: '#f59e0b', bg: 'rgba(245,158,11,.1)', label: () => t('expenseFood') || 'Food', hint: () => t('expenseFoodHint') || 'Restaurants, groceries...' },
  leisure:   { icon: 'sparkles', color: '#ec4899', bg: 'rgba(236,72,153,.1)', label: () => t('expenseLeisure') || 'Leisure', hint: () => t('expenseLeisureHint') || 'Activities, visits...' },
  logistics: { icon: 'package', color: '#06b6d4', bg: 'rgba(6,182,212,.1)', label: () => t('expenseLogistics') || 'Logistics', hint: () => t('expenseLogisticsHint') || 'SIM, laundry, pharmacy...' },
  other:     { icon: 'coins', color: '#64748b', bg: 'rgba(100,116,139,.1)', label: () => t('expenseOther') || 'Other', hint: () => t('expenseOtherHint') || 'Souvenirs, tips...' },
}

// Inject CSS for pseudo-classes (hover, focus, transitions, accordion)
let _cssInjected = false
function _injectCSS() {
  if (_cssInjected || typeof document === 'undefined') return
  _cssInjected = true
  const style = document.createElement('style')
  style.textContent = `
    .j-trip-card:active{transform:scale(0.98)}
    .j-trip-card{transition:transform .15s}
    .j-add-leg:hover,.j-photo-add:hover{border-color:#f59e0b!important;color:#f59e0b!important}
    .j-input:focus{outline:none;border-color:#f59e0b!important}
    .j-input::placeholder{color:#475569}
    .j-tp-opt{transition:all .15s}
    .j-day-expenses .j-exp-body{display:none}
    .j-day-expenses.open .j-exp-body{display:block}
    .j-day-expenses.open .j-exp-header{border-bottom:1px solid rgba(255,255,255,.04)}
    .j-chevron{transition:transform .2s}
    .j-day-expenses.open .j-chevron{transform:rotate(180deg)}
    .j-spot-btn:hover{opacity:.8}
  `
  document.head.appendChild(style)
}

/** Format a date string (YYYY-MM-DD) to human-readable */
function _fmtDate(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString(getState().lang || 'fr', { day: 'numeric', month: 'short' })
  } catch { return dateStr }
}

function _fmtDateLong(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString(getState().lang || 'fr', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch { return dateStr }
}

/** Format duration in minutes to "1h05" or "38 min" */
function _fmtDuration(min) {
  if (!min) return ''
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`
}

/** Day count between two dates */
function _dayCount(start, end) {
  if (!start) return 0
  const s = new Date(start + 'T12:00:00')
  const e = end ? new Date(end + 'T12:00:00') : new Date()
  return Math.max(1, Math.round((e - s) / 86400000) + 1)
}

/**
 * Main render function
 */
export function renderJournal(state) {
  _injectCSS()

  // Public trip view (read-only, no auth required)
  if (state.publicTripView) {
    return renderPublicTrip(state.publicTripView)
  }

  const view = state.journalView || 'list'
  const tripId = state.journalTripId

  // Spot overlay (full-screen, shown on top)
  if (state.journalSpotOverlay) {
    return renderSpotOverlay(state.journalSpotOverlay)
  }

  switch (view) {
    case 'list': return renderTripList(state)
    case 'detail': return renderTripDetail(state, tripId)
    case 'new-trip': return renderNewTrip()
    case 'add-leg': return renderAddLeg(state, tripId)
    case 'expenses': return renderEditExpenses(state, tripId)
    case 'day-note': return renderEditDayNote(state, tripId)
    case 'stats': return renderTripStats(state, tripId)
    default: return renderTripList(state)
  }
}

// ==================== TRIP LIST ====================

function renderTripList(_state) {
  const trips = getTrips()
  const active = trips.find(t => t.status === 'active')
  const completed = trips.filter(t => t.status === 'completed')

  return `
    <div class="-m-4 mb-0">
      <!-- Header -->
      <div class="px-4 py-3 flex items-center gap-3 border-b border-white/[0.06]">
        <button onclick="journalBack()" class="bg-transparent border-none text-slate-400 cursor-pointer p-1">${icon('arrow-left', 'w-5 h-5')}</button>
        <h1 class="text-base font-bold flex-1 flex items-center gap-2"><span class="text-amber-500">${icon('notebook', 'w-5 h-5')}</span> ${t('myTrips') || 'Mes Voyages'}</h1>
        <button onclick="journalNewTrip()" class="bg-amber-500 text-[#0f1520] border-none rounded-[10px] px-3.5 py-2 text-xs font-bold cursor-pointer flex items-center gap-1">
          ${icon('plus', 'w-3.5 h-3.5')} ${t('new') || 'Nouveau'}
        </button>
      </div>

      ${active ? `
        <div class="px-4 pt-4 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-[1px]">${t('inProgress') || 'En cours'}</div>
        ${_renderTripCard(active, true)}
      ` : ''}

      ${completed.length > 0 ? `
        <div class="px-4 pt-4 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-[1px]">${t('completed') || 'Terminés'}</div>
        ${completed.map(trip => _renderTripCard(trip, false)).join('')}
      ` : ''}

      ${trips.length === 0 ? `
        <div class="text-center px-5 py-[60px] text-slate-600">
          <div class="mb-3">${icon('route', 'w-10 h-10')}</div>
          <div class="text-[15px] font-semibold text-slate-400 mb-1.5">${t('noTripsYet') || 'Aucun voyage'}</div>
          <div class="text-xs">${t('startFirstTrip') || 'Commence ton premier voyage pour garder un souvenir de chaque étape'}</div>
        </div>
      ` : ''}

      <div class="h-20"></div>
    </div>
  `
}

function _renderTripCard(trip, isActive) {
  const stats = getTripStats(trip)
  const gradients = ['--c1:#1a3328;--c2:#0f2018', '--c1:#2a1a3a;--c2:#1a1025', '--c1:#3a2a1a;--c2:#251a0f', '--c1:#1a2a3a;--c2:#0f1825']
  const gi = Math.abs((trip.id || '').charCodeAt(5) || 0) % gradients.length
  const g = gradients[gi].split(';')
  const days = _dayCount(trip.startDate, trip.endDate)
  const dateLabel = `${_fmtDate(trip.startDate)} \u2192 ${trip.endDate ? _fmtDate(trip.endDate) : (t('today') || "aujourd'hui")} \u00B7 ${days} ${t('days') || 'jours'}`

  return `
    <div onclick="journalOpenTrip('${trip.id}')" class="j-trip-card mx-4 my-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden cursor-pointer" role="button" tabindex="0">
      <div class="h-[130px] relative overflow-hidden">
        <div style="position:absolute;inset:0;background:linear-gradient(135deg,${g[0].split(':')[1]},${g[1].split(':')[1]})"></div>
        ${trip.coverPhoto ? `<img src="${escapeHTML(trip.coverPhoto)}" class="w-full h-full object-cover absolute inset-0" alt="">` : ''}
        <div class="absolute bottom-0 left-0 right-0 bg-[linear-gradient(transparent,rgba(0,0,0,.6))] px-4 py-3">
          <span class="inline-flex items-center gap-1 px-2 py-[3px] rounded-md text-[10px] font-semibold" style="${isActive ? 'background:rgba(34,197,94,.15);color:#22c55e' : 'background:rgba(100,116,139,.15);color:#94a3b8'}">
            ${icon(isActive ? 'route' : 'flag', 'w-3 h-3')} ${isActive ? (t('inProgress') || 'En cours') : (t('completed') || 'Terminé')}
          </span>
          <div class="text-[17px] font-extrabold">${escapeHTML(trip.title || (t('untitledTrip') || 'Voyage sans titre'))}</div>
          <div class="text-[11px] text-slate-400 mt-0.5">${dateLabel}</div>
        </div>
      </div>
      <div class="flex">
        <div class="flex-1 text-center py-2.5 px-1.5 border-r border-white/[0.05]"><div class="text-[15px] font-bold text-amber-500">${stats?.totalKm || 0}</div><div class="text-[9px] text-slate-500 uppercase mt-0.5">km</div></div>
        <div class="flex-1 text-center py-2.5 px-1.5 border-r border-white/[0.05]"><div class="text-[15px] font-bold text-amber-500">${stats?.rides || 0}</div><div class="text-[9px] text-slate-500 uppercase mt-0.5">rides</div></div>
        <div class="flex-1 text-center py-2.5 px-1.5 border-r border-white/[0.05]"><div class="text-[15px] font-bold text-amber-500">${stats?.totalWaitMin || 0}</div><div class="text-[9px] text-slate-500 uppercase mt-0.5">min att.</div></div>
        <div class="flex-1 text-center py-2.5 px-1.5"><div class="text-[15px] font-bold text-amber-500">${stats?.countries || 0}</div><div class="text-[9px] text-slate-500 uppercase mt-0.5">${t('countries') || 'pays'}</div></div>
      </div>
    </div>
  `
}

// ==================== NEW TRIP ====================

function renderNewTrip() {
  const today = new Date().toISOString().slice(0, 10)
  return `
    <div class="-m-4 p-5">
      <div class="pb-4 flex items-center gap-3 border-b border-white/[0.06] mb-5">
        <button onclick="journalBack()" class="bg-transparent border-none text-slate-400 cursor-pointer">${icon('arrow-left', 'w-5 h-5')}</button>
        <h1 class="text-base font-bold flex-1">${t('newTrip') || 'Nouveau voyage'}</h1>
      </div>
      <div class="text-center mb-6">
        <span class="text-amber-500">${icon('route', 'w-6 h-6')}</span>
        <p class="text-[13px] text-slate-400 mt-2">${t('tripTitleAutoGenerated') || 'Le titre se génère automatiquement à partir de tes étapes'}</p>
      </div>
      <label class="text-xs text-slate-400 block mb-1.5 font-medium">${icon('calendar', 'w-3.5 h-3.5')} ${t('departureDate') || 'Date de départ'}</label>
      <input id="journal-start-date" type="date" value="${today}" class="j-input w-full px-3.5 py-3 rounded-[10px] bg-white/[0.06] border border-white/10 text-white text-sm mb-5">
      <label class="text-xs text-slate-400 block mb-1.5 font-medium">${icon('pencil', 'w-3.5 h-3.5')} ${t('titleOptional') || 'Titre (optionnel)'}</label>
      <input id="journal-trip-title" type="text" placeholder="${t('autoTitlePlaceholder') || 'Auto : Première ville \u2192 Dernière ville'}" class="j-input w-full px-3.5 py-3 rounded-[10px] bg-white/[0.06] border border-white/10 text-white text-sm mb-[30px]">
      <button onclick="journalCreateTrip()" class="w-full py-3.5 rounded-xl bg-emerald-500 text-white text-[15px] font-bold border-none cursor-pointer flex items-center justify-center gap-1.5">
        ${icon('route', 'w-5 h-5')} ${t('startTrip') || 'Commencer le voyage'}
      </button>
    </div>
  `
}

// ==================== TRIP DETAIL (TIMELINE) ====================

function renderTripDetail(state, tripId) {
  const trip = getTrip(tripId)
  if (!trip) return renderTripList(state)
  const days = getLegsByDay(trip)
  const stats = getTripStats(trip)
  const flags = stats?.countryFlags?.join(' ') || ''

  return `
    <div class="-m-4 mb-0">
      <!-- Header -->
      <div class="px-4 py-3 flex items-center gap-3 border-b border-white/[0.06]">
        <button onclick="journalBack()" class="bg-transparent border-none text-slate-400 cursor-pointer">${icon('arrow-left', 'w-5 h-5')}</button>
        <h1 class="text-base font-bold flex-1">${escapeHTML(trip.title || (t('untitledTrip') || 'Voyage'))}</h1>
        <button onclick="journalAddLeg('${trip.id}')" class="bg-amber-500 text-[#0f1520] border-none rounded-[10px] px-3.5 py-2 text-xs font-bold cursor-pointer flex items-center gap-1">
          ${icon('plus', 'w-3.5 h-3.5')} ${t('leg') || 'Étape'}
        </button>
      </div>

      <!-- Meta -->
      <div class="px-4 py-3">
        <div class="text-xs text-slate-500 flex items-center gap-1.5">
          ${icon('calendar', 'w-3.5 h-3.5')} ${_fmtDate(trip.startDate)}${trip.endDate ? ` \u2192 ${_fmtDate(trip.endDate)}` : ''}
          <span class="mx-1">\u00B7</span>
          ${icon('globe', 'w-3.5 h-3.5')} ${flags || `${stats?.countries || 0} ${t('countries') || 'pays'}`}
        </div>
      </div>

      <!-- Mini-map -->
      ${days.length > 0 && trip.legs.length > 0 ? _renderMiniMap(trip) : ''}

      <!-- Days -->
      ${days.length === 0 ? `
        <div class="text-center px-5 py-10 text-slate-600">
          <div class="mb-2">${icon('plus', 'w-8 h-8')}</div>
          <div class="text-[13px]">${t('addFirstLeg') || 'Ajoute ta première étape pour commencer la timeline'}</div>
        </div>
      ` : days.map(day => _renderDay(trip, day)).join('')}

      <!-- Add leg button -->
      <div onclick="journalAddLeg('${trip.id}')" class="j-add-leg mx-4 mt-1 mb-5 p-3 border-2 border-dashed border-white/[0.08] rounded-xl text-center text-slate-500 text-[13px] cursor-pointer flex items-center justify-center gap-1.5" role="button" tabindex="0">
        ${icon('plus', 'w-4 h-4')} ${t('addLeg') || 'Ajouter une étape'}
      </div>

      ${trip.status === 'active' ? `
        <!-- Public toggle -->
        <div class="mx-4 mb-3 px-3.5 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center gap-2.5">
          <span class="text-blue-500">${icon('globe', 'w-4 h-4')}</span>
          <div class="flex-1">
            <div class="text-[13px] font-semibold">${t('publicTrip') || 'Voyage public'}</div>
            <div class="text-[10px] text-slate-500">${t('publicTripDesc') || 'Visible par la communauté SpotHitch'}</div>
          </div>
          <button onclick="journalTogglePublic('${trip.id}')" class="border-none cursor-pointer transition-colors duration-200" style="width:44px;height:24px;border-radius:12px;background:${trip.isPublic ? 'rgba(34,197,94,.3)' : 'rgba(100,116,139,.3)'};position:relative">
            <div style="width:20px;height:20px;border-radius:50%;background:${trip.isPublic ? '#22c55e' : '#64748b'};position:absolute;top:2px;${trip.isPublic ? 'right:2px' : 'left:2px'};transition:all .2s;box-shadow:0 1px 3px rgba(0,0,0,.3)"></div>
          </button>
        </div>

        <!-- End trip -->
        <div class="text-center px-4 pb-4">
          <button onclick="journalEndTrip('${trip.id}')" class="w-full p-3 rounded-[10px] bg-[rgba(245,158,11,.1)] border border-[rgba(245,158,11,.2)] text-amber-500 text-[13px] font-semibold cursor-pointer flex items-center justify-center gap-1.5">
            ${icon('flag', 'w-4 h-4')} ${t('endTrip') || 'Terminer le voyage'}
          </button>
        </div>
      ` : `
        <div class="px-4 pb-4">
          <button onclick="journalShowStats('${trip.id}')" class="w-full p-3 rounded-[10px] bg-[rgba(245,158,11,.1)] border border-[rgba(245,158,11,.2)] text-amber-500 text-[13px] font-semibold cursor-pointer flex items-center justify-center gap-1.5">
            ${icon('trophy', 'w-4 h-4')} ${t('viewStats') || 'Voir le récap'}
          </button>
        </div>
      `}

      <!-- Bottom stats bar -->
      ${stats && stats.totalKm > 0 ? `
        <div class="sticky bottom-0 bg-[rgba(15,21,32,.95)] backdrop-blur-[12px] border-t border-white/[0.06] px-4 py-2.5 flex justify-around">
          <div class="text-center"><div class="text-[13px] font-bold text-emerald-500">${stats.hitchKm}</div><div class="text-[9px] text-slate-500 uppercase">km stop</div></div>
          <div class="text-center"><div class="text-[13px] font-bold text-[#8b5cf6]">${stats.paidKm}</div><div class="text-[9px] text-slate-500 uppercase">km payés</div></div>
          <div class="text-center"><div class="text-[13px] font-bold text-amber-500">${stats.totalWaitMin}</div><div class="text-[9px] text-slate-500 uppercase">min att.</div></div>
          <div class="text-center"><div class="text-[13px] font-bold">${stats.totalExpenses > 0 ? stats.totalExpenses + '€' : '0€'}</div><div class="text-[9px] text-slate-500 uppercase">${t('spent') || 'dépensé'}</div></div>
        </div>
      ` : ''}
    </div>
  `
}

/** SVG mini-map of the route */
function _renderMiniMap(trip) {
  const stops = []
  trip.legs.forEach(l => {
    if (stops.length === 0 && l.departure?.name) stops.push({ name: l.departure.name, color: TRANSPORTS[l.transport]?.color || '#64748b' })
    if (l.arrival?.name) stops.push({ name: l.arrival.name, color: TRANSPORTS[l.transport]?.color || '#64748b' })
  })
  if (stops.length < 2) return ''
  const w = 340, h = 120, pad = 30
  const step = (w - pad * 2) / (stops.length - 1)
  const points = stops.map((s, i) => ({ x: pad + i * step, y: h / 2 + Math.sin(i * 1.2) * 25 - 10, ...s }))
  // Bezier path
  let path = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const cpx = (points[i - 1].x + points[i].x) / 2
    path += ` Q ${cpx} ${points[i - 1].y - 15}, ${points[i].x} ${points[i].y}`
  }
  return `
    <div class="mx-4 mb-4 h-[150px] rounded-[14px] bg-[linear-gradient(135deg,#1a2332,#0f1520)] border border-white/[0.08] flex items-center justify-center overflow-hidden">
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <path d="${path}" fill="none" stroke="rgba(245,158,11,.3)" stroke-width="2" stroke-dasharray="6 4"/>
        ${points.map((p, i) => `
          <circle cx="${p.x}" cy="${p.y}" r="${i === 0 || i === points.length - 1 ? 5 : 4}" fill="${p.color}" stroke="#0f1520" stroke-width="2"/>
          ${i === 0 || i === points.length - 1 ? `<text x="${p.x - 10}" y="${p.y + (i === 0 ? 18 : -10)}" fill="#64748b" font-size="8" font-family="system-ui">${escapeHTML(p.name.split(',')[0].slice(0, 12))}</text>` : ''}
        `).join('')}
      </svg>
    </div>
  `
}

function _renderDay(trip, day) {
  const { date, dayNumber, legs } = day
  const note = trip.dayNotes?.[date]
  const photo = trip.dayPhotos?.[date]
  const expenses = trip.dayExpenses?.[date] || {}
  const dayTotal = Object.entries(expenses).reduce((s, [k, v]) => k === 'currency' ? s : s + (v || 0), 0)
  const dateStr = _fmtDate(date)

  return `
    <div class="px-4 pb-2">
      <!-- Day header -->
      <div class="flex items-center gap-2 mb-2.5 py-1.5">
        <div class="text-[13px] font-bold">${t('day') || 'Jour'} ${dayNumber}</div>
        <div class="text-[11px] text-slate-500">${dateStr}</div>
        <div class="flex-1 h-px bg-white/[0.06]"></div>
      </div>

      <!-- Day photo -->
      ${photo
        ? `<div class="-mt-1 mb-2.5 ml-9 w-[calc(100%-36px)] h-40 rounded-xl overflow-hidden relative"><img src="${escapeHTML(photo)}" class="w-full h-full object-cover" alt=""><button onclick="journalDeleteDayPhoto('${trip.id}','${date}')" class="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 border-none text-white cursor-pointer flex items-center justify-center" aria-label="${t('removePhoto') || 'Supprimer'}">${icon('x', 'w-4 h-4')}</button></div>`
        : `<div onclick="journalAddDayPhoto('${trip.id}','${date}')" class="j-photo-add -mt-1 mb-2.5 ml-9 w-[calc(100%-36px)] h-12 border-2 border-dashed border-white/[0.08] rounded-xl flex items-center justify-center gap-1.5 text-slate-600 text-xs cursor-pointer" role="button" tabindex="0">${icon('camera', 'w-4 h-4')} ${t('addDayPhoto') || 'Ajouter la photo du jour'}</div>`
      }

      <!-- Day note -->
      ${note
        ? `<div class="-mt-1 mb-2.5 ml-9 w-[calc(100%-36px)] px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-[10px] text-xs text-slate-400 leading-relaxed italic">"${escapeHTML(note)}"</div>`
        : `<div onclick="journalEditDayNote('${trip.id}','${date}')" class="-mt-1 mb-2.5 ml-9 w-[calc(100%-36px)] px-3 py-2.5 bg-[rgba(245,158,11,.04)] border border-dashed border-[rgba(245,158,11,.2)] rounded-[10px] text-xs text-amber-500 cursor-pointer flex items-center gap-1.5" role="button" tabindex="0">${icon('pencil', 'w-3.5 h-3.5')} ${t('writeDayNote') || 'Écrire la note du jour'}</div>`
      }

      <!-- Legs -->
      ${legs.map((leg, i) => _renderLeg(leg, i === legs.length - 1)).join('')}
    </div>

    <!-- Day expenses accordion -->
    <div class="j-day-expenses ml-[52px] mx-4 mb-3 w-[calc(100%-68px)] bg-white/[0.02] border border-white/[0.06] rounded-[10px] overflow-hidden">
      <div class="j-exp-header px-3 py-2 flex items-center gap-1.5 cursor-pointer text-xs text-slate-500" onclick="journalToggleExpenses(this)" role="button" tabindex="0">
        ${icon('coins', 'w-3.5 h-3.5')} ${t('dayExpenses') || 'Dépenses du jour'}
        <span class="ml-auto font-semibold text-amber-500">${dayTotal > 0 ? dayTotal + ' €' : '0 €'}</span>
        <button onclick="event.stopPropagation();journalEditExpenses('${trip.id}','${date}')" class="bg-transparent border-none text-slate-500 cursor-pointer p-1">${icon('pencil', 'w-3 h-3')}</button>
        <span class="j-chevron">${icon('chevron-down', 'w-3.5 h-3.5')}</span>
      </div>
      <div class="j-exp-body px-3 pt-1.5 pb-2.5">
        ${dayTotal > 0
          ? EXPENSE_CATEGORIES.map(cat => {
              const cfg = EXPENSE_ICONS[cat] || EXPENSE_ICONS.other
              const val = expenses[cat] || 0
              return `<div class="flex items-center gap-2 py-[5px] text-[11px]"><span class="text-slate-500 w-4 text-center">${icon(cfg.icon, 'w-3.5 h-3.5')}</span><span class="text-slate-400 flex-1">${cfg.label()}</span><span class="text-slate-200 font-semibold">${val} €</span></div>`
            }).join('')
          : `<div class="text-[11px] text-slate-600 text-center py-2">${t('noExpenses') || 'Aucune dépense enregistrée'}</div>`
        }
      </div>
    </div>
  `
}

function _renderLeg(leg, isLast) {
  const tp = TRANSPORTS[leg.transport] || TRANSPORTS.other
  const isPaid = ['bus', 'train', 'plane', 'boat', 'car'].includes(leg.transport)
  return `
    <div class="flex gap-3 mb-0.5">
      <div class="w-6 flex flex-col items-center pt-0.5">
        <div class="w-2.5 h-2.5 rounded-full shrink-0" style="background:${tp.color};box-shadow:0 0 6px ${tp.color}40"></div>
        ${isLast ? '' : `<div class="w-0.5 flex-1 min-h-[16px]" style="background:${tp.line}"></div>`}
      </div>
      <div class="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 mb-1.5">
        <div class="flex items-center gap-[5px] mb-1" style="color:${tp.color}">
          ${icon(tp.icon, 'w-3.5 h-3.5')}
          <span class="text-[10px] font-bold uppercase tracking-[.5px]">${tp.label()}</span>
        </div>
        <div class="text-[13px] font-semibold">
          ${escapeHTML(leg.departure?.name || '?')}
          <span class="text-slate-600 mx-[3px]">${icon('arrow-right', 'w-3 h-3')}</span>
          ${escapeHTML(leg.arrival?.name || '?')}
        </div>
        <div class="flex flex-wrap gap-2 mt-[5px] text-[11px] text-slate-500">
          ${leg.distanceKm ? `<span class="flex items-center gap-[3px]">${icon('ruler', 'w-3 h-3')} ${leg.distanceKm} km</span>` : ''}
          ${isPaid && leg.price ? `<span class="flex items-center gap-[3px]">${icon('coins', 'w-3 h-3')} ${leg.price} €</span>` : ''}
          ${leg.waitMinutes ? `<span class="flex items-center gap-[3px]">${icon('clock', 'w-3 h-3')} ${leg.waitMinutes} min att.</span>` : ''}
          ${leg.rideDuration ? `<span class="flex items-center gap-[3px]">${icon('car', 'w-3 h-3')} ${_fmtDuration(leg.rideDuration)}</span>` : ''}
        </div>
        ${leg.note ? `<div class="text-[11px] text-slate-400 mt-1.5 italic leading-[1.4] pl-2 border-l-2 border-white/[0.06]">"${escapeHTML(leg.note)}"</div>` : ''}
        ${leg.spotId ? `<div onclick="openSpotDetail('${escapeHTML(leg.spotId)}')" role="button" tabindex="0" class="inline-flex items-center gap-1 mt-1.5 px-2 py-1 rounded-md text-[10px] cursor-pointer" style="background:${leg.spotCreated ? 'rgba(245,158,11,.06)' : 'rgba(34,197,94,.06)'};border:1px solid ${leg.spotCreated ? 'rgba(245,158,11,.12)' : 'rgba(34,197,94,.12)'};color:${leg.spotCreated ? '#f59e0b' : '#22c55e'}">${icon(leg.spotCreated ? 'plus' : 'map-pin', 'w-3 h-3')} ${leg.spotCreated ? (t('spotCreated') || 'Spot créé') + ' : ' : ''}${escapeHTML(leg.spotName || '')} ${icon('external-link', 'w-2.5 h-2.5')}</div>` : ''}
      </div>
    </div>
  `
}

// ==================== ADD LEG ====================

function renderAddLeg(state, tripId) {
  const selectedTransport = state.journalTransport || 'hitchhike'
  const isHitch = selectedTransport === 'hitchhike'
  const isPaid = ['bus', 'train', 'plane', 'boat', 'car'].includes(selectedTransport)
  const spotSelected = window._journalSelectedSpotName || null

  return `
    <div class="-m-4 p-4">
      <div class="pb-4 flex items-center gap-3 border-b border-white/[0.06] mb-4">
        <button onclick="journalBack()" class="bg-transparent border-none text-slate-400 cursor-pointer">${icon('arrow-left', 'w-5 h-5')}</button>
        <h1 class="text-base font-bold flex-1">${t('newLeg') || 'Nouvelle étape'}</h1>
      </div>

      <!-- Transport picker -->
      <label class="text-xs text-slate-400 block mb-2.5 font-medium">${t('transportMode') || 'Mode de transport'}</label>
      <div class="grid grid-cols-3 gap-2 mb-[18px]">
        ${Object.entries(TRANSPORTS).map(([key, tp]) => `
          <button onclick="journalSelectTransport('${key}')" class="j-tp-opt flex flex-col items-center gap-1 px-1.5 py-3 rounded-[10px] cursor-pointer" aria-label="${tp.label()}" role="radio" aria-checked="${selectedTransport === key}"
            style="background:${selectedTransport === key ? tp.bg : 'rgba(255,255,255,.04)'};border:2px solid ${selectedTransport === key ? tp.color : 'transparent'}">
            <div class="w-7 h-7 rounded-full flex items-center justify-center" style="color:${selectedTransport === key ? tp.color : '#94a3b8'}">${icon(tp.icon, 'w-5 h-5')}</div>
            <span class="text-[10px] font-semibold" style="color:${selectedTransport === key ? tp.color : '#94a3b8'}">${tp.label()}</span>
          </button>
        `).join('')}
      </div>

      ${isHitch ? `
        <!-- Spot picker (hitchhike only) -->
        <div class="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3.5 mb-[18px]">
          <div class="text-xs font-semibold text-emerald-500 mb-2 flex items-center gap-[5px]">${icon('map-pin', 'w-3.5 h-3.5')} ${t('linkSpot') || 'Lier à un spot SpotHitch'}</div>
          <div class="flex gap-2">
            <button onclick="journalPickSpot('use')" class="j-spot-btn flex-1 p-2.5 rounded-lg bg-[rgba(34,197,94,.1)] text-emerald-500 text-xs font-semibold cursor-pointer border-none flex items-center justify-center gap-1">${icon('map-pin', 'w-3.5 h-3.5')} ${t('existingSpot') || 'Spot existant'}</button>
            <button onclick="journalPickSpot('new')" class="j-spot-btn flex-1 p-2.5 rounded-lg bg-[rgba(245,158,11,.1)] text-amber-500 text-xs font-semibold cursor-pointer border-none flex items-center justify-center gap-1">${icon('plus', 'w-3.5 h-3.5')} ${t('createSpot') || 'Créer un spot'}</button>
          </div>
          ${spotSelected ? `
            <div class="mt-2.5 px-2.5 py-2 bg-[rgba(34,197,94,.06)] border border-[rgba(34,197,94,.12)] rounded-lg text-xs text-emerald-500 flex items-center gap-1.5">
              ${icon('map-pin', 'w-3.5 h-3.5')}
              <span>${escapeHTML(spotSelected)}</span>
              <button onclick="journalClearSpot()" class="ml-auto bg-transparent border-none text-slate-500 cursor-pointer p-0.5">${icon('x', 'w-3.5 h-3.5')}</button>
            </div>
          ` : ''}
          ${window._journalSpotWaitMinutes ? `
            <div class="mt-2 px-3 py-2.5 bg-[rgba(34,197,94,.04)] border border-[rgba(34,197,94,.1)] rounded-[10px]">
              <div class="text-[11px] text-emerald-500 font-semibold mb-1 flex items-center gap-1">${icon('clock', 'w-3 h-3')} ${t('spotAutoInfo') || 'Infos récupérées du spot'}</div>
              <div class="text-xs text-slate-400">${t('waitTime') || 'Attente'} : <strong class="text-slate-200">${window._journalSpotWaitMinutes} min</strong></div>
            </div>
          ` : ''}
        </div>

        <!-- Wait time (hitchhike) -->
        <label class="text-xs text-slate-400 block mb-1.5 font-medium">${icon('clock', 'w-3.5 h-3.5')} ${t('waitTime') || "Temps d'attente"} (min)</label>
        <input id="journal-wait-time" type="number" placeholder="0" value="${window._journalSpotWaitMinutes || ''}" class="j-input w-full px-3.5 py-3 rounded-[10px] bg-white/[0.06] border border-white/10 text-white text-sm mb-3.5" inputmode="numeric">
      ` : ''}

      <!-- Departure -->
      <label class="text-xs text-slate-400 block mb-1.5 font-medium">${icon('map-pin', 'w-3.5 h-3.5')} ${t('departure') || 'Départ'}</label>
      <div class="flex gap-1.5 mb-3.5">
        <input id="journal-departure" type="text" placeholder="${t('searchCity') || 'Rechercher une ville...'}" class="j-input flex-1 px-3.5 py-3 rounded-[10px] bg-white/[0.06] border border-white/10 text-white text-sm">
        <button onclick="journalUseMyPosition('departure')" class="px-3 py-2.5 rounded-[10px] bg-[rgba(59,130,246,.1)] border border-[rgba(59,130,246,.2)] text-blue-500 cursor-pointer flex items-center gap-1 text-[11px] font-semibold whitespace-nowrap" aria-label="${t('useMyPosition') || 'Ma position'}">${icon('navigation', 'w-3.5 h-3.5')} GPS</button>
      </div>

      <!-- Arrival -->
      <label class="text-xs text-slate-400 block mb-1.5 font-medium">${icon('flag', 'w-3.5 h-3.5')} ${t('arrival') || 'Arrivée'}</label>
      <input id="journal-arrival" type="text" placeholder="${t('searchCity') || 'Rechercher une ville...'}" class="j-input w-full px-3.5 py-3 rounded-[10px] bg-white/[0.06] border border-white/10 text-white text-sm mb-3.5">

      <!-- Auto distance -->
      <div class="flex items-center gap-1.5 px-3 py-2 bg-white/[0.03] rounded-lg mb-3.5 text-xs text-slate-500">
        ${icon('ruler', 'w-3.5 h-3.5')} ${t('distance') || 'Distance'} : <strong class="text-slate-200">${t('autoCalculated') || 'calculée automatiquement'}</strong>
      </div>

      ${isPaid ? `
        <!-- Price (paid transport only) -->
        <label class="text-xs text-slate-400 block mb-1.5 font-medium">${icon('coins', 'w-3.5 h-3.5')} ${t('price') || 'Prix'} (€)</label>
        <input id="journal-price" type="number" placeholder="0" class="j-input w-full px-3.5 py-3 rounded-[10px] bg-white/[0.06] border border-white/10 text-white text-sm mb-3.5" inputmode="decimal" step="0.01">
      ` : ''}

      <!-- Ride duration -->
      <label class="text-xs text-slate-400 block mb-1.5 font-medium">${icon('car', 'w-3.5 h-3.5')} ${t('rideDuration') || 'Durée du trajet'} (min)</label>
      <input id="journal-duration" type="number" placeholder="0" class="j-input w-full px-3.5 py-3 rounded-[10px] bg-white/[0.06] border border-white/10 text-white text-sm mb-3.5" inputmode="numeric">

      <!-- Note (optional) -->
      <label class="text-xs text-slate-400 block mb-1.5 font-medium">${icon('pencil', 'w-3.5 h-3.5')} ${t('noteOptional') || 'Note (optionnel)'}</label>
      <textarea id="journal-note" placeholder="${t('shareExperience') || 'Raconte ton expérience...'}" rows="2" class="j-input w-full px-3.5 py-3 rounded-[10px] bg-white/[0.06] border border-white/10 text-white text-sm resize-none mb-3.5"></textarea>

      <!-- Required indicator -->
      <div class="text-[10px] text-slate-600 mb-4 flex items-center gap-1">
        ${icon('circle-alert', 'w-3 h-3')} ${t('requiredFields') || 'Transport, départ et arrivée sont obligatoires. Le reste est optionnel.'}
      </div>

      <button onclick="journalSaveLeg('${escapeJSString(tripId)}')" class="w-full py-3.5 rounded-xl bg-emerald-500 text-white text-[15px] font-bold border-none cursor-pointer flex items-center justify-center gap-1.5">
        ${icon('plus', 'w-5 h-5')} ${t('addThisLeg') || 'Ajouter cette étape'}
      </button>
    </div>
  `
}

// ==================== SPOT OVERLAY ====================

function renderSpotOverlay(mode) {
  const title = mode === 'new' ? (t('createSpot') || 'Créer un spot') : (t('chooseSpot') || 'Choisir un spot')
  const selectedSpot = getState().journalSelectedSpotFromMap
  return `
    <div class="fixed inset-0 bg-dark-primary z-50 flex flex-col -m-4">
      <div class="px-4 py-3 flex items-center gap-3 bg-[rgba(15,21,32,.95)] z-[2]">
        <button onclick="journalCloseSpotOverlay()" class="bg-transparent border-none text-slate-400 cursor-pointer" aria-label="${t('back')}">${icon('arrow-left', 'w-5 h-5')}</button>
        <h3 class="flex-1 text-[15px] font-bold">${title}</h3>
      </div>
      <!-- Map container — MapLibre will mount here -->
      <div id="journal-spot-map" class="flex-1 relative">
        <div class="absolute inset-0 flex items-center justify-center text-slate-600 text-[13px]">
          <div class="text-center">
            ${icon('loader-circle', 'w-8 h-8 animate-spin')}
            <p class="mt-2 text-xs">${t('loadingMap') || 'Chargement de la carte...'}</p>
          </div>
        </div>
      </div>
      ${selectedSpot ? `
      <div class="px-4 py-2.5 bg-[rgba(34,197,94,.08)] border-t border-[rgba(34,197,94,.2)] flex items-center gap-2">
        ${icon('map-pin', 'w-4 h-4 text-emerald-400')}
        <span class="text-[13px] text-emerald-500 font-semibold flex-1">${escapeHTML(selectedSpot.name || selectedSpot.id)}</span>
        <button onclick="journalClearSpot()" class="bg-transparent border-none text-slate-500 cursor-pointer">${icon('x', 'w-4 h-4')}</button>
      </div>
      ` : `
      <div class="px-4 py-2.5 bg-[rgba(15,21,32,.95)] text-center">
        <p class="text-xs text-slate-600">${t('spotMapTap') || 'Tape sur un spot pour le sélectionner'}</p>
      </div>
      `}
      <div class="px-4 py-3 bg-[rgba(15,21,32,.95)]">
        ${mode === 'new' ? `
        <button onclick="journalCloseSpotOverlay(); openAddSpot()" class="w-full py-3.5 rounded-xl bg-amber-500 text-[#0f1520] text-[15px] font-bold border-none cursor-pointer flex items-center justify-center gap-1.5">
          ${icon('plus', 'w-5 h-5')} ${t('createSpot') || 'Créer un spot'}
        </button>
        ` : `
        <button onclick="journalSelectSpotFromMap()" ${selectedSpot ? '' : 'disabled'} class="w-full py-3.5 rounded-xl text-white text-[15px] font-bold border-none cursor-pointer flex items-center justify-center gap-1.5" style="background:${selectedSpot ? '#22c55e' : '#334155'};opacity:${selectedSpot ? '1' : '.5'}">
          ${icon('map-pin', 'w-5 h-5')} ${t('selectSpot') || 'Sélectionner ce spot'}
        </button>
        `}
      </div>
    </div>
  `
}

// ==================== EDIT EXPENSES ====================

function renderEditExpenses(state, tripId) {
  const trip = getTrip(tripId)
  if (!trip) return renderTripList(state)
  const date = state.journalDate || new Date().toISOString().slice(0, 10)
  const existing = trip.dayExpenses?.[date] || {}
  const dateStr = _fmtDateLong(date)
  const dayNumber = getLegsByDay(trip).findIndex(d => d.date === date) + 1
  const dayTotal = EXPENSE_CATEGORIES.reduce((s, cat) => s + (parseFloat(existing[cat]) || 0), 0)

  return `
    <div class="-m-4 p-4">
      <div class="pb-4 flex items-center gap-3 border-b border-white/[0.06] mb-4">
        <button onclick="journalBack()" class="bg-transparent border-none text-slate-400 cursor-pointer">${icon('arrow-left', 'w-5 h-5')}</button>
        <h1 class="text-base font-bold flex-1">${t('expenses') || 'Dépenses'} \u00B7 ${t('day') || 'Jour'} ${dayNumber || '?'}</h1>
      </div>

      <div class="text-center mb-5">
        <div class="text-[11px] text-slate-500">${dateStr}</div>
        <div class="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 bg-[rgba(59,130,246,.08)] border border-[rgba(59,130,246,.15)] rounded-lg">
          <span class="text-blue-500">${icon('globe', 'w-3.5 h-3.5')}</span>
          <span class="text-[11px] text-blue-500 font-semibold">${t('autoCurrency') || 'Devise auto du pays'}</span>
        </div>
        <div class="text-[10px] text-slate-600 mt-1.5">${t('allOptional') || 'Tous les montants sont optionnels'}</div>
      </div>

      ${EXPENSE_CATEGORIES.map((cat, i) => {
        const cfg = EXPENSE_ICONS[cat] || EXPENSE_ICONS.other
        const val = existing[cat] || ''
        const isLast = i === EXPENSE_CATEGORIES.length - 1
        return `
          <div class="flex items-center gap-2.5 py-2.5 ${isLast ? '' : 'border-b border-white/[0.04]'}">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style="background:${cfg.bg};color:${cfg.color}">${icon(cfg.icon, 'w-4 h-4')}</div>
            <div class="flex-1">
              <div class="text-[13px] font-semibold">${cfg.label()}</div>
              <div class="text-[10px] text-slate-600">${cfg.hint()}</div>
            </div>
            <input id="exp-${cat}" type="number" placeholder="0" value="${val}" class="j-input w-20 px-2.5 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-white text-sm text-right font-semibold">
            <span class="text-[13px] text-slate-500 font-semibold">€</span>
          </div>
        `
      }).join('')}

      <!-- Day total -->
      <div class="flex justify-between items-center mt-4 px-3.5 py-3 bg-[rgba(245,158,11,.06)] border border-[rgba(245,158,11,.12)] rounded-[10px]">
        <span class="text-[13px] font-semibold text-amber-500">${t('dayTotal') || 'Total du jour'}</span>
        <span class="text-lg font-extrabold text-amber-500">${dayTotal > 0 ? dayTotal + ' €' : '0 €'}</span>
      </div>

      <button onclick="journalSaveExpenses('${escapeJSString(tripId)}','${escapeJSString(date)}')" class="w-full mt-5 py-3.5 rounded-xl bg-emerald-500 text-white text-[15px] font-bold border-none cursor-pointer flex items-center justify-center gap-1.5">
        ${icon('coins', 'w-5 h-5')} ${t('saveExpenses') || 'Enregistrer les dépenses'}
      </button>
    </div>
  `
}

// ==================== EDIT DAY NOTE ====================

function renderEditDayNote(state, tripId) {
  const trip = getTrip(tripId)
  if (!trip) return renderTripList(state)
  const date = state.journalDate || new Date().toISOString().slice(0, 10)
  const existing = trip.dayNotes?.[date] || ''
  const dayNumber = getLegsByDay(trip).findIndex(d => d.date === date) + 1
  const dateStr = _fmtDateLong(date)

  return `
    <div class="-m-4 p-4">
      <div class="pb-4 flex items-center gap-3 border-b border-white/[0.06] mb-4">
        <button onclick="journalBack()" class="bg-transparent border-none text-slate-400 cursor-pointer">${icon('arrow-left', 'w-5 h-5')}</button>
        <h1 class="text-base font-bold flex-1">${t('dayNote') || 'Note du jour'} \u00B7 ${t('day') || 'Jour'} ${dayNumber || '?'}</h1>
      </div>

      <div class="text-center mb-4">
        <div class="text-[11px] text-slate-500">${dateStr}</div>
      </div>

      <label class="text-xs text-slate-400 block mb-1.5 font-medium">${icon('pencil', 'w-3.5 h-3.5')} ${t('daySummary') || 'Résumé de la journée'}</label>
      <textarea id="journal-day-note" rows="5" placeholder="${t('dayNotePromptLong') || "Comment s'est passée cette journée ? Qu'est-ce qui t'a marqué ?"}" class="j-input w-full px-3.5 py-3 rounded-[10px] bg-white/[0.06] border border-white/10 text-white text-sm resize-none leading-relaxed mb-2">${escapeHTML(existing)}</textarea>

      <div class="text-[10px] text-amber-500 mb-5 flex items-center gap-1">
        ${icon('circle-alert', 'w-3 h-3')} ${t('dayNoteRequired') || 'La note du jour est obligatoire pour garder un souvenir de chaque journée'}
      </div>

      <button onclick="journalSaveDayNote('${escapeJSString(tripId)}','${escapeJSString(date)}')" class="w-full py-3.5 rounded-xl bg-emerald-500 text-white text-[15px] font-bold border-none cursor-pointer flex items-center justify-center gap-1.5">
        ${icon('pencil', 'w-5 h-5')} ${t('saveNote') || 'Enregistrer la note'}
      </button>
    </div>
  `
}

// ==================== STATS ====================

function renderTripStats(state, tripId) {
  const trip = getTrip(tripId)
  if (!trip) return renderTripList(state)
  const stats = getTripStats(trip)
  if (!stats) return renderTripDetail(state, tripId)
  const flags = stats.countryFlags?.join(' ') || ''

  // Per-transport ratio legend
  const ratioLegend = Object.entries(stats.transportBreakdown || {})
    .filter(([, km]) => km > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([tp, km]) => {
      const cfg = TRANSPORTS[tp] || TRANSPORTS.other
      const pct = stats.totalKm > 0 ? Math.round((km / stats.totalKm) * 100) : 0
      return { tp, pct, color: cfg.color, label: cfg.label(), icon: cfg.icon }
    })

  return `
    <div class="-m-4 p-4 text-center">
      <div class="pb-4 flex items-center gap-3 border-b border-white/[0.06] mb-5">
        <button onclick="journalOpenTrip('${escapeJSString(tripId)}')" class="bg-transparent border-none text-slate-400 cursor-pointer">${icon('arrow-left', 'w-5 h-5')}</button>
        <h1 class="text-base font-bold flex-1">${t('tripRecap') || 'Récap du voyage'}</h1>
      </div>

      <span class="text-amber-500">${icon('trophy', 'w-6 h-6')}</span>
      <h2 class="text-xl font-extrabold mt-3 mb-0.5">${escapeHTML(trip.title || '')}</h2>
      <p class="text-slate-500 text-xs mb-6">${stats.days} ${t('days') || 'jours'} \u00B7 ${_fmtDate(trip.startDate)}${trip.endDate ? ` au ${_fmtDate(trip.endDate)}` : ''}</p>

      <!-- Stat cards -->
      <div class="grid grid-cols-2 gap-2.5 mb-5">
        <div class="bg-[rgba(34,197,94,.08)] border border-white/[0.08] rounded-[14px] p-4"><div class="text-[28px] font-extrabold text-emerald-500">${stats.hitchKm}</div><div class="text-[11px] text-slate-500 mt-1">${t('kmHitchhike') || 'km en autostop'}</div></div>
        <div class="bg-[rgba(139,92,246,.08)] border border-white/[0.08] rounded-[14px] p-4"><div class="text-[28px] font-extrabold text-[#8b5cf6]">${stats.paidKm}</div><div class="text-[11px] text-slate-500 mt-1">${t('kmTransport') || 'km en transport'}</div></div>
        <div class="bg-[rgba(245,158,11,.08)] border border-white/[0.08] rounded-[14px] p-4"><div class="text-[28px] font-extrabold text-amber-500">${stats.rides}</div><div class="text-[11px] text-slate-500 mt-1">${t('ridesObtained') || 'rides obtenus'}</div></div>
        <div class="bg-[rgba(59,130,246,.08)] border border-white/[0.08] rounded-[14px] p-4"><div class="text-[28px] font-extrabold text-blue-500">${stats.totalWaitMin}</div><div class="text-[11px] text-slate-500 mt-1">${t('minWaiting') || "min d'attente"}</div></div>
      </div>

      <!-- Advanced stats -->
      <div class="grid grid-cols-3 gap-2 mb-4">
        <div class="bg-white/[0.04] rounded-[10px] p-2.5 text-center"><div class="text-base font-bold text-slate-200">${stats.avgWaitMin}</div><div class="text-[9px] text-slate-500">${t('avgWaitMin') || 'min moy. attente'}</div></div>
        <div class="bg-white/[0.04] rounded-[10px] p-2.5 text-center"><div class="text-base font-bold text-slate-200">${stats.budgetPerDay}</div><div class="text-[9px] text-slate-500">${t('budgetPerDay') || '\u20AC/jour'}</div></div>
        <div class="bg-white/[0.04] rounded-[10px] p-2.5 text-center"><div class="text-base font-bold text-slate-200">${stats.avgSpeed || '?'}</div><div class="text-[9px] text-slate-500">${t('avgSpeedKmh') || 'km/h moy.'}</div></div>
      </div>

      <!-- Ratio bar -->
      ${stats.totalKm > 0 ? `
        <div class="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-3.5 mb-4">
          <div class="text-xs font-semibold mb-2">${t('breakdown') || 'Répartition du trajet'}</div>
          <div class="h-3 rounded-md overflow-hidden flex">
            ${ratioLegend.map(r => `<div style="width:${r.pct}%;background:${r.color}"></div>`).join('')}
          </div>
          <div class="flex justify-between text-[10px] text-slate-400 mt-1.5">
            ${ratioLegend.slice(0, 4).map(r => `<span class="flex items-center gap-0.5">${r.tp === 'hitchhike' ? icon('thumbs-up', 'w-3 h-3') : ''} ${r.pct}% ${r.label.toLowerCase()}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Country + spots -->
      <div class="flex gap-2 mb-4">
        <div class="flex-1 bg-white/[0.04] rounded-xl p-2.5 text-center">
          <div class="text-lg">${flags || icon('globe', 'w-5 h-5 text-slate-400')}</div>
          <div class="text-[10px] text-slate-500 mt-[3px]">${stats.countries} ${t('countries') || 'pays'}</div>
        </div>
        <div class="flex-1 bg-white/[0.04] rounded-xl p-2.5 text-center">
          <div class="text-base font-bold text-emerald-500">${stats.spotsUsed}</div>
          <div class="text-[10px] text-slate-500 mt-[3px]">${t('spotsUsed') || 'spots utilisés'}</div>
        </div>
        <div class="flex-1 bg-white/[0.04] rounded-xl p-2.5 text-center">
          <div class="text-base font-bold text-amber-500">${stats.spotsCreated}</div>
          <div class="text-[10px] text-slate-500 mt-[3px]">${t('spotsCreated') || 'spots créés'}</div>
        </div>
      </div>

      <!-- Budget breakdown -->
      <div class="bg-white/[0.04] border border-white/[0.08] rounded-[14px] p-3.5 mb-4 text-left">
        <div class="flex items-center justify-center gap-2 mb-2.5">
          <span class="text-xs font-semibold">${t('totalBudget') || 'Budget total'} : ${stats.totalExpenses} €</span>
          <select id="stats-currency" class="bg-white/[0.08] border border-white/[0.12] rounded-md text-amber-500 px-1.5 py-[3px] text-[11px] font-semibold">
            <option selected>EUR €</option><option>USD $</option><option>GBP £</option><option>CHF</option><option>MAD</option><option>THB \u0E3F</option><option>JPY ¥</option><option>BRL R$</option>
          </select>
        </div>
        ${EXPENSE_CATEGORIES.map(cat => {
          const cfg = EXPENSE_ICONS[cat] || EXPENSE_ICONS.other
          const val = stats.expByCategory[cat] || 0
          return `<div class="flex items-center gap-2 py-[5px] text-[11px]"><span style="color:${cfg.color}">${icon(cfg.icon, 'w-3.5 h-3.5')}</span><span class="text-slate-400 flex-1">${cfg.label()}</span><span class="text-slate-200 font-semibold">${val} €</span></div>`
        }).join('')}
      </div>

      <!-- Savings -->
      ${stats.estimatedSavings > 0 ? `
        <div class="text-[13px] text-slate-400 bg-[rgba(34,197,94,.06)] rounded-[10px] p-3 mb-4">
          <span class="text-emerald-500">${icon('sparkles', 'w-3.5 h-3.5')}</span>
          ${t('savedApprox') || 'Tu as économisé environ'} <strong class="text-emerald-500">~${stats.estimatedSavings} €</strong> ${t('thankToHitchhikingFull') || "grâce à l'autostop par rapport au même trajet en bus/train."}
        </div>
      ` : ''}

      <!-- Public link -->
      ${trip.isPublic ? `
        <div class="bg-[rgba(59,130,246,.06)] border border-[rgba(59,130,246,.15)] rounded-xl p-3 mb-4 text-left">
          <div class="text-xs font-semibold text-blue-500 mb-1.5 flex items-center gap-1">${icon('globe', 'w-3.5 h-3.5')} ${t('publicTrip') || 'Voyage public'}</div>
          <div class="flex items-center gap-1.5">
            <div class="flex-1 px-2.5 py-2 bg-white/[0.06] rounded-md text-[11px] text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap">spothitch.com/trip/${trip.id.slice(5, 13)}</div>
            <button onclick="journalCopyLink('${trip.id}')" class="bg-blue-500 text-white border-none rounded-md px-3 py-2 text-[11px] font-semibold cursor-pointer whitespace-nowrap">${t('copy') || 'Copier'}</button>
          </div>
          <div class="text-[10px] text-slate-600 mt-1.5">${t('publicTripExplain') || 'Les autres voyageurs peuvent voir ton itinéraire et s\'en inspirer'}</div>
        </div>
      ` : ''}

      <!-- Share + Export buttons -->
      <button onclick="journalShareTrip('${trip.id}')" class="w-full py-3.5 rounded-xl bg-amber-500 text-[#0f1520] text-[15px] font-bold border-none cursor-pointer mb-2 flex items-center justify-center gap-1.5">
        ${icon('share', 'w-5 h-5')} ${t('shareTrip') || 'Partager mon voyage'}
      </button>
      <button onclick="journalExportTrip('${trip.id}')" class="w-full p-3 rounded-xl bg-white/[0.06] text-slate-400 text-[13px] font-semibold border-none cursor-pointer mb-2 flex items-center justify-center gap-1.5">
        ${icon('download', 'w-4 h-4')} ${t('exportTrip') || 'Exporter (JSON)'}
      </button>
      <button onclick="journalBack()" class="w-full p-3 rounded-xl bg-white/[0.06] text-slate-400 text-[13px] font-semibold border-none cursor-pointer">
        ${t('backToTrips') || 'Retour à mes voyages'}
      </button>
    </div>
  `
}

// ==================== PUBLIC TRIP (read-only) ====================

function renderPublicTrip(trip) {
  const stats = getTripStats(trip)
  const days = _dayCount(trip.startDate, trip.endDate)
  const legsByDay = getLegsByDay(trip)

  return `
    <div class="-m-4 p-4 max-w-[600px] mx-auto">
      <!-- Header -->
      <div class="text-center pt-5 pb-4 border-b border-white/[0.06] mb-5">
        <div class="text-[10px] text-slate-500 uppercase tracking-[1px] mb-2">${t('publicTrip') || 'Voyage public'}</div>
        <h1 class="text-[22px] font-extrabold mb-1">${escapeHTML(trip.title || (t('untitledTrip') || 'Voyage'))}</h1>
        <p class="text-slate-400 text-[13px]">${t('by') || 'par'} ${escapeHTML(trip.userName || t('traveler'))}</p>
        <p class="text-slate-500 text-xs mt-1">${_fmtDate(trip.startDate)} \u2192 ${trip.endDate ? _fmtDate(trip.endDate) : (t('today') || "aujourd'hui")} \u00B7 ${days} ${t('days') || 'jours'}</p>
      </div>

      <!-- Stats -->
      ${stats ? `
      <div class="grid grid-cols-4 gap-2 mb-5">
        <div class="bg-[rgba(34,197,94,.08)] rounded-xl p-3 text-center"><div class="text-xl font-extrabold text-emerald-500">${stats.totalKm}</div><div class="text-[9px] text-slate-500">km</div></div>
        <div class="bg-[rgba(245,158,11,.08)] rounded-xl p-3 text-center"><div class="text-xl font-extrabold text-amber-500">${stats.rides}</div><div class="text-[9px] text-slate-500">rides</div></div>
        <div class="bg-[rgba(59,130,246,.08)] rounded-xl p-3 text-center"><div class="text-xl font-extrabold text-blue-500">${stats.totalWaitMin}</div><div class="text-[9px] text-slate-500">min</div></div>
        <div class="bg-[rgba(139,92,246,.08)] rounded-xl p-3 text-center"><div class="text-xl font-extrabold text-[#8b5cf6]">${stats.countries}</div><div class="text-[9px] text-slate-500">${t('countries') || 'pays'}</div></div>
      </div>
      ` : ''}

      <!-- Timeline -->
      ${legsByDay.map(day => `
        <div class="mb-4">
          <div class="text-[13px] font-bold mb-2">${t('day') || 'Jour'} ${day.dayNumber} \u00B7 ${_fmtDate(day.date)}</div>
          ${day.legs.map(leg => {
            const tp = TRANSPORTS[leg.transport] || TRANSPORTS.other
            return `
              <div class="flex gap-2.5 mb-2 px-3 py-2 bg-white/[0.04] rounded-[10px]">
                <div class="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style="background:${tp.bg};color:${tp.color}">${icon(tp.icon, 'w-4 h-4')}</div>
                <div class="flex-1 min-w-0">
                  <div class="text-[13px] font-semibold">${escapeHTML(leg.departure?.name || '?')} \u2192 ${escapeHTML(leg.arrival?.name || '?')}</div>
                  <div class="text-[11px] text-slate-400 flex gap-2 mt-0.5">
                    ${leg.distanceKm ? `<span>${leg.distanceKm} km</span>` : ''}
                    ${leg.waitMinutes ? `<span>${leg.waitMinutes} min ${t('wait') || 'attente'}</span>` : ''}
                  </div>
                  ${leg.note ? `<div class="text-[11px] text-slate-400 italic mt-1">"${escapeHTML(leg.note)}"</div>` : ''}
                </div>
              </div>
            `
          }).join('')}
          ${trip.dayNotes?.[day.date] ? `<div class="text-xs text-slate-400 px-3 py-2 bg-[rgba(59,130,246,.04)] rounded-lg leading-relaxed">${escapeHTML(trip.dayNotes[day.date])}</div>` : ''}
        </div>
      `).join('')}

      <!-- Footer -->
      <div class="text-center pt-5 pb-5 border-t border-white/[0.06] mt-4">
        <p class="text-xs text-slate-500 mb-2">${t('sharedViaSpotHitch') || 'Partagé via SpotHitch'}</p>
        <a href="/" class="text-amber-500 text-[13px] font-semibold no-underline">${t('discoverSpotHitch') || 'Découvrir SpotHitch'} \u2192</a>
      </div>
    </div>
  `
}

export default { renderJournal }
