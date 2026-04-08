/**
 * Journal / Trip Diary Component
 * Renders trip list, trip detail (timeline), add leg, expenses, day notes, stats
 * Matches mockup v1-final.html pixel-perfect
 */

import { t } from '../../i18n/index.js'
import { icon } from '../../utils/icons.js'
import { escapeHTML } from '../../utils/sanitize.js'
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
    <div style="margin:-16px;margin-bottom:0">
      <!-- Header -->
      <div style="padding:12px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.06)">
        <button onclick="journalBack()" style="background:none;border:none;color:#94a3b8;cursor:pointer;padding:4px">${icon('arrow-left', 'w-5 h-5')}</button>
        <h1 style="font-size:16px;font-weight:700;flex:1;display:flex;align-items:center;gap:8px"><span style="color:#f59e0b">${icon('notebook', 'w-5 h-5')}</span> ${t('myTrips') || 'Mes Voyages'}</h1>
        <button onclick="journalNewTrip()" style="background:#f59e0b;color:#0f1520;border:none;border-radius:10px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:4px">
          ${icon('plus', 'w-3.5 h-3.5')} ${t('new') || 'Nouveau'}
        </button>
      </div>

      ${active ? `
        <div style="padding:16px 16px 8px;font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:1px">${t('inProgress') || 'En cours'}</div>
        ${_renderTripCard(active, true)}
      ` : ''}

      ${completed.length > 0 ? `
        <div style="padding:16px 16px 8px;font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:1px">${t('completed') || 'Terminés'}</div>
        ${completed.map(trip => _renderTripCard(trip, false)).join('')}
      ` : ''}

      ${trips.length === 0 ? `
        <div style="text-align:center;padding:60px 20px;color:#475569">
          <div style="margin-bottom:12px">${icon('route', 'w-10 h-10')}</div>
          <div style="font-size:15px;font-weight:600;color:#94a3b8;margin-bottom:6px">${t('noTripsYet') || 'Aucun voyage'}</div>
          <div style="font-size:12px">${t('startFirstTrip') || 'Commence ton premier voyage pour garder un souvenir de chaque étape'}</div>
        </div>
      ` : ''}

      <div style="height:80px"></div>
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
    <div onclick="journalOpenTrip('${trip.id}')" class="j-trip-card" style="margin:8px 16px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden;cursor:pointer" role="button" tabindex="0">
      <div style="height:130px;position:relative;overflow:hidden">
        <div style="position:absolute;inset:0;background:linear-gradient(135deg,${g[0].split(':')[1]},${g[1].split(':')[1]})"></div>
        ${trip.coverPhoto ? `<img src="${escapeHTML(trip.coverPhoto)}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0" alt="">` : ''}
        <div style="position:absolute;bottom:0;left:0;right:0;padding:12px 16px;background:linear-gradient(transparent,rgba(0,0,0,.6))">
          <span style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:600;${isActive ? 'background:rgba(34,197,94,.15);color:#22c55e' : 'background:rgba(100,116,139,.15);color:#94a3b8'}">
            ${icon(isActive ? 'route' : 'flag', 'w-3 h-3')} ${isActive ? (t('inProgress') || 'En cours') : (t('completed') || 'Terminé')}
          </span>
          <div style="font-size:17px;font-weight:800">${escapeHTML(trip.title || (t('untitledTrip') || 'Voyage sans titre'))}</div>
          <div style="font-size:11px;color:#94a3b8;margin-top:2px">${dateLabel}</div>
        </div>
      </div>
      <div style="display:flex">
        <div style="flex:1;text-align:center;padding:10px 6px;border-right:1px solid rgba(255,255,255,.05)"><div style="font-size:15px;font-weight:700;color:#f59e0b">${stats?.totalKm || 0}</div><div style="font-size:9px;color:#64748b;text-transform:uppercase;margin-top:2px">km</div></div>
        <div style="flex:1;text-align:center;padding:10px 6px;border-right:1px solid rgba(255,255,255,.05)"><div style="font-size:15px;font-weight:700;color:#f59e0b">${stats?.rides || 0}</div><div style="font-size:9px;color:#64748b;text-transform:uppercase;margin-top:2px">rides</div></div>
        <div style="flex:1;text-align:center;padding:10px 6px;border-right:1px solid rgba(255,255,255,.05)"><div style="font-size:15px;font-weight:700;color:#f59e0b">${stats?.totalWaitMin || 0}</div><div style="font-size:9px;color:#64748b;text-transform:uppercase;margin-top:2px">min att.</div></div>
        <div style="flex:1;text-align:center;padding:10px 6px"><div style="font-size:15px;font-weight:700;color:#f59e0b">${stats?.countries || 0}</div><div style="font-size:9px;color:#64748b;text-transform:uppercase;margin-top:2px">${t('countries') || 'pays'}</div></div>
      </div>
    </div>
  `
}

// ==================== NEW TRIP ====================

function renderNewTrip() {
  const today = new Date().toISOString().slice(0, 10)
  return `
    <div style="margin:-16px;padding:20px">
      <div style="padding:0 0 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.06);margin-bottom:20px">
        <button onclick="journalBack()" style="background:none;border:none;color:#94a3b8;cursor:pointer">${icon('arrow-left', 'w-5 h-5')}</button>
        <h1 style="font-size:16px;font-weight:700;flex:1">${t('newTrip') || 'Nouveau voyage'}</h1>
      </div>
      <div style="text-align:center;margin-bottom:24px">
        <span style="color:#f59e0b">${icon('route', 'w-6 h-6')}</span>
        <p style="font-size:13px;color:#94a3b8;margin-top:8px">${t('tripTitleAutoGenerated') || 'Le titre se génère automatiquement à partir de tes étapes'}</p>
      </div>
      <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:6px;font-weight:500">${icon('calendar', 'w-3.5 h-3.5')} ${t('departureDate') || 'Date de départ'}</label>
      <input id="journal-start-date" type="date" value="${today}" class="j-input" style="width:100%;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:14px;margin-bottom:20px">
      <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:6px;font-weight:500">${icon('pencil', 'w-3.5 h-3.5')} ${t('titleOptional') || 'Titre (optionnel)'}</label>
      <input id="journal-trip-title" type="text" placeholder="${t('autoTitlePlaceholder') || 'Auto : Première ville \u2192 Dernière ville'}" class="j-input" style="width:100%;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:14px;margin-bottom:30px">
      <button onclick="journalCreateTrip()" style="width:100%;padding:14px;border-radius:12px;background:#22c55e;color:#fff;font-size:15px;font-weight:700;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">
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
    <div style="margin:-16px;margin-bottom:0">
      <!-- Header -->
      <div style="padding:12px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.06)">
        <button onclick="journalBack()" style="background:none;border:none;color:#94a3b8;cursor:pointer">${icon('arrow-left', 'w-5 h-5')}</button>
        <h1 style="font-size:16px;font-weight:700;flex:1">${escapeHTML(trip.title || (t('untitledTrip') || 'Voyage'))}</h1>
        <button onclick="journalAddLeg('${trip.id}')" style="background:#f59e0b;color:#0f1520;border:none;border-radius:10px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:4px">
          ${icon('plus', 'w-3.5 h-3.5')} ${t('leg') || 'Étape'}
        </button>
      </div>

      <!-- Meta -->
      <div style="padding:12px 16px">
        <div style="font-size:12px;color:#64748b;display:flex;align-items:center;gap:6px">
          ${icon('calendar', 'w-3.5 h-3.5')} ${_fmtDate(trip.startDate)}${trip.endDate ? ` \u2192 ${_fmtDate(trip.endDate)}` : ''}
          <span style="margin:0 4px">\u00B7</span>
          ${icon('globe', 'w-3.5 h-3.5')} ${flags || `${stats?.countries || 0} ${t('countries') || 'pays'}`}
        </div>
      </div>

      <!-- Mini-map -->
      ${days.length > 0 && trip.legs.length > 0 ? _renderMiniMap(trip) : ''}

      <!-- Days -->
      ${days.length === 0 ? `
        <div style="text-align:center;padding:40px 20px;color:#475569">
          <div style="margin-bottom:8px">${icon('plus', 'w-8 h-8')}</div>
          <div style="font-size:13px">${t('addFirstLeg') || 'Ajoute ta première étape pour commencer la timeline'}</div>
        </div>
      ` : days.map(day => _renderDay(trip, day)).join('')}

      <!-- Add leg button -->
      <div onclick="journalAddLeg('${trip.id}')" class="j-add-leg" style="margin:4px 16px 20px;padding:12px;border:2px dashed rgba(255,255,255,.08);border-radius:12px;text-align:center;color:#64748b;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px" role="button" tabindex="0">
        ${icon('plus', 'w-4 h-4')} ${t('addLeg') || 'Ajouter une étape'}
      </div>

      ${trip.status === 'active' ? `
        <!-- Public toggle -->
        <div style="margin:0 16px 12px;padding:12px 14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:12px;display:flex;align-items:center;gap:10px">
          <span style="color:#3b82f6">${icon('globe', 'w-4 h-4')}</span>
          <div style="flex:1">
            <div style="font-size:13px;font-weight:600">${t('publicTrip') || 'Voyage public'}</div>
            <div style="font-size:10px;color:#64748b">${t('publicTripDesc') || 'Visible par la communauté SpotHitch'}</div>
          </div>
          <button onclick="journalTogglePublic('${trip.id}')" style="width:44px;height:24px;border-radius:12px;background:${trip.isPublic ? 'rgba(34,197,94,.3)' : 'rgba(100,116,139,.3)'};position:relative;cursor:pointer;border:none;transition:background .2s">
            <div style="width:20px;height:20px;border-radius:50%;background:${trip.isPublic ? '#22c55e' : '#64748b'};position:absolute;top:2px;${trip.isPublic ? 'right:2px' : 'left:2px'};transition:all .2s;box-shadow:0 1px 3px rgba(0,0,0,.3)"></div>
          </button>
        </div>

        <!-- End trip -->
        <div style="text-align:center;padding:0 16px 16px">
          <button onclick="journalEndTrip('${trip.id}')" style="width:100%;padding:12px;border-radius:10px;background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.2);color:#f59e0b;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">
            ${icon('flag', 'w-4 h-4')} ${t('endTrip') || 'Terminer le voyage'}
          </button>
        </div>
      ` : `
        <div style="padding:0 16px 16px">
          <button onclick="journalShowStats('${trip.id}')" style="width:100%;padding:12px;border-radius:10px;background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.2);color:#f59e0b;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">
            ${icon('trophy', 'w-4 h-4')} ${t('viewStats') || 'Voir le récap'}
          </button>
        </div>
      `}

      <!-- Bottom stats bar -->
      ${stats && stats.totalKm > 0 ? `
        <div style="position:sticky;bottom:0;background:rgba(15,21,32,.95);backdrop-filter:blur(12px);border-top:1px solid rgba(255,255,255,.06);padding:10px 16px;display:flex;justify-content:space-around">
          <div style="text-align:center"><div style="font-size:13px;font-weight:700;color:#22c55e">${stats.hitchKm}</div><div style="font-size:9px;color:#64748b;text-transform:uppercase">km stop</div></div>
          <div style="text-align:center"><div style="font-size:13px;font-weight:700;color:#8b5cf6">${stats.paidKm}</div><div style="font-size:9px;color:#64748b;text-transform:uppercase">km payés</div></div>
          <div style="text-align:center"><div style="font-size:13px;font-weight:700;color:#f59e0b">${stats.totalWaitMin}</div><div style="font-size:9px;color:#64748b;text-transform:uppercase">min att.</div></div>
          <div style="text-align:center"><div style="font-size:13px;font-weight:700">${stats.totalExpenses > 0 ? stats.totalExpenses + '€' : '0€'}</div><div style="font-size:9px;color:#64748b;text-transform:uppercase">${t('spent') || 'dépensé'}</div></div>
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
    <div style="margin:0 16px 16px;height:150px;border-radius:14px;background:linear-gradient(135deg,#1a2332,#0f1520);border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;overflow:hidden">
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
    <div style="padding:0 16px 8px">
      <!-- Day header -->
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding:6px 0">
        <div style="font-size:13px;font-weight:700">${t('day') || 'Jour'} ${dayNumber}</div>
        <div style="font-size:11px;color:#64748b">${dateStr}</div>
        <div style="flex:1;height:1px;background:rgba(255,255,255,.06)"></div>
      </div>

      <!-- Day photo -->
      ${photo
        ? `<div style="margin:-4px 0 10px 36px;width:calc(100% - 36px);height:160px;border-radius:12px;overflow:hidden;position:relative"><img src="${escapeHTML(photo)}" style="width:100%;height:100%;object-fit:cover" alt=""><button onclick="journalDeleteDayPhoto('${trip.id}','${date}')" style="position:absolute;top:6px;right:6px;width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,.6);border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center" aria-label="${t('removePhoto') || 'Supprimer'}">${icon('x', 'w-4 h-4')}</button></div>`
        : `<div onclick="journalAddDayPhoto('${trip.id}','${date}')" class="j-photo-add" style="margin:-4px 0 10px 36px;width:calc(100% - 36px);height:48px;border:2px dashed rgba(255,255,255,.08);border-radius:12px;display:flex;align-items:center;justify-content:center;gap:6px;color:#475569;font-size:12px;cursor:pointer" role="button" tabindex="0">${icon('camera', 'w-4 h-4')} ${t('addDayPhoto') || 'Ajouter la photo du jour'}</div>`
      }

      <!-- Day note -->
      ${note
        ? `<div style="margin:-4px 0 10px 36px;width:calc(100% - 36px);padding:10px 12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;font-size:12px;color:#94a3b8;line-height:1.5;font-style:italic">"${escapeHTML(note)}"</div>`
        : `<div onclick="journalEditDayNote('${trip.id}','${date}')" style="margin:-4px 0 10px 36px;width:calc(100% - 36px);padding:10px 12px;background:rgba(245,158,11,.04);border:1px dashed rgba(245,158,11,.2);border-radius:10px;font-size:12px;color:#f59e0b;cursor:pointer;display:flex;align-items:center;gap:6px" role="button" tabindex="0">${icon('pencil', 'w-3.5 h-3.5')} ${t('writeDayNote') || 'Écrire la note du jour'}</div>`
      }

      <!-- Legs -->
      ${legs.map((leg, i) => _renderLeg(leg, i === legs.length - 1)).join('')}
    </div>

    <!-- Day expenses accordion -->
    <div class="j-day-expenses" style="margin:4px 16px 12px 52px;width:calc(100% - 68px);background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);border-radius:10px;overflow:hidden">
      <div class="j-exp-header" onclick="journalToggleExpenses(this)" style="padding:8px 12px;display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;color:#64748b" role="button" tabindex="0">
        ${icon('coins', 'w-3.5 h-3.5')} ${t('dayExpenses') || 'Dépenses du jour'}
        <span style="margin-left:auto;font-weight:600;color:#f59e0b">${dayTotal > 0 ? dayTotal + ' €' : '0 €'}</span>
        <button onclick="event.stopPropagation();journalEditExpenses('${trip.id}','${date}')" style="background:none;border:none;color:#64748b;cursor:pointer;padding:4px">${icon('pencil', 'w-3 h-3')}</button>
        <span class="j-chevron">${icon('chevron-down', 'w-3.5 h-3.5')}</span>
      </div>
      <div class="j-exp-body" style="padding:6px 12px 10px">
        ${dayTotal > 0
          ? EXPENSE_CATEGORIES.map(cat => {
              const cfg = EXPENSE_ICONS[cat] || EXPENSE_ICONS.other
              const val = expenses[cat] || 0
              return `<div style="display:flex;align-items:center;gap:8px;padding:5px 0;font-size:11px"><span style="color:#64748b;width:16px;text-align:center">${icon(cfg.icon, 'w-3.5 h-3.5')}</span><span style="color:#94a3b8;flex:1">${cfg.label()}</span><span style="color:#e2e8f0;font-weight:600">${val} €</span></div>`
            }).join('')
          : `<div style="font-size:11px;color:#475569;text-align:center;padding:8px 0">${t('noExpenses') || 'Aucune dépense enregistrée'}</div>`
        }
      </div>
    </div>
  `
}

function _renderLeg(leg, isLast) {
  const tp = TRANSPORTS[leg.transport] || TRANSPORTS.other
  const isPaid = ['bus', 'train', 'plane', 'boat', 'car'].includes(leg.transport)
  return `
    <div style="display:flex;gap:12px;margin-bottom:2px">
      <div style="width:24px;display:flex;flex-direction:column;align-items:center;padding-top:2px">
        <div style="width:10px;height:10px;border-radius:50%;background:${tp.color};box-shadow:0 0 6px ${tp.color}40;flex-shrink:0"></div>
        ${isLast ? '' : `<div style="width:2px;flex:1;min-height:16px;background:${tp.line}"></div>`}
      </div>
      <div style="flex:1;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:10px 12px;margin-bottom:6px">
        <div style="display:flex;align-items:center;gap:5px;margin-bottom:4px;color:${tp.color}">
          ${icon(tp.icon, 'w-3.5 h-3.5')}
          <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px">${tp.label()}</span>
        </div>
        <div style="font-size:13px;font-weight:600">
          ${escapeHTML(leg.departure?.name || '?')}
          <span style="color:#475569;margin:0 3px">${icon('arrow-right', 'w-3 h-3')}</span>
          ${escapeHTML(leg.arrival?.name || '?')}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:5px;font-size:11px;color:#64748b">
          ${leg.distanceKm ? `<span style="display:flex;align-items:center;gap:3px">${icon('ruler', 'w-3 h-3')} ${leg.distanceKm} km</span>` : ''}
          ${isPaid && leg.price ? `<span style="display:flex;align-items:center;gap:3px">${icon('coins', 'w-3 h-3')} ${leg.price} €</span>` : ''}
          ${leg.waitMinutes ? `<span style="display:flex;align-items:center;gap:3px">${icon('clock', 'w-3 h-3')} ${leg.waitMinutes} min att.</span>` : ''}
          ${leg.rideDuration ? `<span style="display:flex;align-items:center;gap:3px">${icon('car', 'w-3 h-3')} ${_fmtDuration(leg.rideDuration)}</span>` : ''}
        </div>
        ${leg.note ? `<div style="font-size:11px;color:#94a3b8;margin-top:6px;font-style:italic;line-height:1.4;padding-left:8px;border-left:2px solid rgba(255,255,255,.06)">"${escapeHTML(leg.note)}"</div>` : ''}
        ${leg.spotId ? `<div onclick="openSpotDetail('${escapeHTML(leg.spotId)}')" role="button" tabindex="0" style="display:inline-flex;align-items:center;gap:4px;margin-top:6px;padding:4px 8px;background:${leg.spotCreated ? 'rgba(245,158,11,.06)' : 'rgba(34,197,94,.06)'};border:1px solid ${leg.spotCreated ? 'rgba(245,158,11,.12)' : 'rgba(34,197,94,.12)'};border-radius:6px;font-size:10px;color:${leg.spotCreated ? '#f59e0b' : '#22c55e'};cursor:pointer">${icon(leg.spotCreated ? 'plus' : 'map-pin', 'w-3 h-3')} ${leg.spotCreated ? (t('spotCreated') || 'Spot créé') + ' : ' : ''}${escapeHTML(leg.spotName || '')} ${icon('external-link', 'w-2.5 h-2.5')}</div>` : ''}
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
    <div style="margin:-16px;padding:16px">
      <div style="padding:0 0 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.06);margin-bottom:16px">
        <button onclick="journalBack()" style="background:none;border:none;color:#94a3b8;cursor:pointer">${icon('arrow-left', 'w-5 h-5')}</button>
        <h1 style="font-size:16px;font-weight:700;flex:1">${t('newLeg') || 'Nouvelle étape'}</h1>
      </div>

      <!-- Transport picker -->
      <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:10px;font-weight:500">${t('transportMode') || 'Mode de transport'}</label>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:18px">
        ${Object.entries(TRANSPORTS).map(([key, tp]) => `
          <button onclick="journalSelectTransport('${key}')" class="j-tp-opt" aria-label="${tp.label()}" role="radio" aria-checked="${selectedTransport === key}"
            style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 6px;border-radius:10px;background:${selectedTransport === key ? tp.bg : 'rgba(255,255,255,.04)'};border:2px solid ${selectedTransport === key ? tp.color : 'transparent'};cursor:pointer">
            <div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:${selectedTransport === key ? tp.color : '#94a3b8'}">${icon(tp.icon, 'w-5 h-5')}</div>
            <span style="font-size:10px;font-weight:600;color:${selectedTransport === key ? tp.color : '#94a3b8'}">${tp.label()}</span>
          </button>
        `).join('')}
      </div>

      ${isHitch ? `
        <!-- Spot picker (hitchhike only) -->
        <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:14px;margin-bottom:18px">
          <div style="font-size:12px;font-weight:600;color:#22c55e;margin-bottom:8px;display:flex;align-items:center;gap:5px">${icon('map-pin', 'w-3.5 h-3.5')} ${t('linkSpot') || 'Lier à un spot SpotHitch'}</div>
          <div style="display:flex;gap:8px">
            <button onclick="journalPickSpot('use')" class="j-spot-btn" style="flex:1;padding:10px;border-radius:8px;background:rgba(34,197,94,.1);color:#22c55e;font-size:12px;font-weight:600;cursor:pointer;border:none;display:flex;align-items:center;justify-content:center;gap:4px">${icon('map-pin', 'w-3.5 h-3.5')} ${t('existingSpot') || 'Spot existant'}</button>
            <button onclick="journalPickSpot('new')" class="j-spot-btn" style="flex:1;padding:10px;border-radius:8px;background:rgba(245,158,11,.1);color:#f59e0b;font-size:12px;font-weight:600;cursor:pointer;border:none;display:flex;align-items:center;justify-content:center;gap:4px">${icon('plus', 'w-3.5 h-3.5')} ${t('createSpot') || 'Créer un spot'}</button>
          </div>
          ${spotSelected ? `
            <div style="margin-top:10px;padding:8px 10px;background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.12);border-radius:8px;font-size:12px;color:#22c55e;display:flex;align-items:center;gap:6px">
              ${icon('map-pin', 'w-3.5 h-3.5')}
              <span>${escapeHTML(spotSelected)}</span>
              <button onclick="journalClearSpot()" style="margin-left:auto;background:none;border:none;color:#64748b;cursor:pointer;padding:2px">${icon('x', 'w-3.5 h-3.5')}</button>
            </div>
          ` : ''}
          ${window._journalSpotWaitMinutes ? `
            <div style="margin-top:8px;padding:10px 12px;background:rgba(34,197,94,.04);border:1px solid rgba(34,197,94,.1);border-radius:10px">
              <div style="font-size:11px;color:#22c55e;font-weight:600;margin-bottom:4px;display:flex;align-items:center;gap:4px">${icon('clock', 'w-3 h-3')} ${t('spotAutoInfo') || 'Infos récupérées du spot'}</div>
              <div style="font-size:12px;color:#94a3b8">${t('waitTime') || 'Attente'} : <strong style="color:#e2e8f0">${window._journalSpotWaitMinutes} min</strong></div>
            </div>
          ` : ''}
        </div>

        <!-- Wait time (hitchhike) -->
        <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:6px;font-weight:500">${icon('clock', 'w-3.5 h-3.5')} ${t('waitTime') || "Temps d'attente"} (min)</label>
        <input id="journal-wait-time" type="number" placeholder="0" value="${window._journalSpotWaitMinutes || ''}" class="j-input" style="width:100%;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:14px;margin-bottom:14px" inputmode="numeric">
      ` : ''}

      <!-- Departure -->
      <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:6px;font-weight:500">${icon('map-pin', 'w-3.5 h-3.5')} ${t('departure') || 'Départ'}</label>
      <div style="display:flex;gap:6px;margin-bottom:14px">
        <input id="journal-departure" type="text" placeholder="${t('searchCity') || 'Rechercher une ville...'}" class="j-input" style="flex:1;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:14px">
        <button onclick="journalUseMyPosition('departure')" style="padding:10px 12px;border-radius:10px;background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.2);color:#3b82f6;cursor:pointer;display:flex;align-items:center;gap:4px;font-size:11px;font-weight:600;white-space:nowrap" aria-label="${t('useMyPosition') || 'Ma position'}">${icon('navigation', 'w-3.5 h-3.5')} GPS</button>
      </div>

      <!-- Arrival -->
      <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:6px;font-weight:500">${icon('flag', 'w-3.5 h-3.5')} ${t('arrival') || 'Arrivée'}</label>
      <input id="journal-arrival" type="text" placeholder="${t('searchCity') || 'Rechercher une ville...'}" class="j-input" style="width:100%;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:14px;margin-bottom:14px">

      <!-- Auto distance -->
      <div style="display:flex;align-items:center;gap:6px;padding:8px 12px;background:rgba(255,255,255,.03);border-radius:8px;margin-bottom:14px;font-size:12px;color:#64748b">
        ${icon('ruler', 'w-3.5 h-3.5')} ${t('distance') || 'Distance'} : <strong style="color:#e2e8f0">${t('autoCalculated') || 'calculée automatiquement'}</strong>
      </div>

      ${isPaid ? `
        <!-- Price (paid transport only) -->
        <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:6px;font-weight:500">${icon('coins', 'w-3.5 h-3.5')} ${t('price') || 'Prix'} (€)</label>
        <input id="journal-price" type="number" placeholder="0" class="j-input" style="width:100%;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:14px;margin-bottom:14px" inputmode="decimal" step="0.01">
      ` : ''}

      <!-- Ride duration -->
      <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:6px;font-weight:500">${icon('car', 'w-3.5 h-3.5')} ${t('rideDuration') || 'Durée du trajet'} (min)</label>
      <input id="journal-duration" type="number" placeholder="0" class="j-input" style="width:100%;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:14px;margin-bottom:14px" inputmode="numeric">

      <!-- Note (optional) -->
      <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:6px;font-weight:500">${icon('pencil', 'w-3.5 h-3.5')} ${t('noteOptional') || 'Note (optionnel)'}</label>
      <textarea id="journal-note" placeholder="${t('shareExperience') || 'Raconte ton expérience...'}" rows="2" class="j-input" style="width:100%;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:14px;resize:none;margin-bottom:14px"></textarea>

      <!-- Required indicator -->
      <div style="font-size:10px;color:#475569;margin-bottom:16px;display:flex;align-items:center;gap:4px">
        ${icon('circle-alert', 'w-3 h-3')} ${t('requiredFields') || 'Transport, départ et arrivée sont obligatoires. Le reste est optionnel.'}
      </div>

      <button onclick="journalSaveLeg('${tripId}')" style="width:100%;padding:14px;border-radius:12px;background:#22c55e;color:#fff;font-size:15px;font-weight:700;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">
        ${icon('plus', 'w-5 h-5')} ${t('addThisLeg') || 'Ajouter cette étape'}
      </button>
    </div>
  `
}

// ==================== SPOT OVERLAY ====================

function renderSpotOverlay(mode) {
  const title = mode === 'new' ? (t('createSpot') || 'Créer un spot') : (t('chooseSpot') || 'Choisir un spot')
  return `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:50;display:flex;flex-direction:column;margin:-16px">
      <div style="padding:12px 16px;display:flex;align-items:center;gap:12px;background:rgba(15,21,32,.9)">
        <button onclick="journalCloseSpotOverlay()" style="background:none;border:none;color:#94a3b8;cursor:pointer">${icon('arrow-left', 'w-5 h-5')}</button>
        <h3 style="flex:1;font-size:15px;font-weight:700">${title}</h3>
      </div>
      <div style="flex:1;background:linear-gradient(135deg,#1a2332,#0f1520);display:flex;align-items:center;justify-content:center;color:#475569;font-size:13px">
        <div style="text-align:center">
          ${icon('map-pin', 'w-6 h-6')}
          <p style="margin-top:8px;font-size:12px">${t('spotMapInstruction') || 'Carte SpotHitch avec les spots autour de toi'}</p>
          <p style="font-size:11px;color:#475569;margin-top:4px">${t('spotMapTap') || 'Tape sur un spot pour le sélectionner'}</p>
        </div>
      </div>
      <div style="padding:16px;background:rgba(15,21,32,.95)">
        <button onclick="journalSelectSpotFromMap()" style="width:100%;padding:14px;border-radius:12px;background:#22c55e;color:#fff;font-size:15px;font-weight:700;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">
          ${icon('map-pin', 'w-5 h-5')} ${t('selectSpot') || 'Sélectionner ce spot'}
        </button>
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
    <div style="margin:-16px;padding:16px">
      <div style="padding:0 0 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.06);margin-bottom:16px">
        <button onclick="journalBack()" style="background:none;border:none;color:#94a3b8;cursor:pointer">${icon('arrow-left', 'w-5 h-5')}</button>
        <h1 style="font-size:16px;font-weight:700;flex:1">${t('expenses') || 'Dépenses'} \u00B7 ${t('day') || 'Jour'} ${dayNumber || '?'}</h1>
      </div>

      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:11px;color:#64748b">${dateStr}</div>
        <div style="display:inline-flex;align-items:center;gap:6px;margin-top:6px;padding:4px 10px;background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.15);border-radius:8px">
          <span style="color:#3b82f6">${icon('globe', 'w-3.5 h-3.5')}</span>
          <span style="font-size:11px;color:#3b82f6;font-weight:600">${t('autoCurrency') || 'Devise auto du pays'}</span>
        </div>
        <div style="font-size:10px;color:#475569;margin-top:6px">${t('allOptional') || 'Tous les montants sont optionnels'}</div>
      </div>

      ${EXPENSE_CATEGORIES.map((cat, i) => {
        const cfg = EXPENSE_ICONS[cat] || EXPENSE_ICONS.other
        const val = existing[cat] || ''
        const isLast = i === EXPENSE_CATEGORIES.length - 1
        return `
          <div style="display:flex;align-items:center;gap:10px;padding:10px 0;${isLast ? '' : 'border-bottom:1px solid rgba(255,255,255,.04)'}">
            <div style="width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:${cfg.bg};color:${cfg.color};flex-shrink:0">${icon(cfg.icon, 'w-4 h-4')}</div>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:600">${cfg.label()}</div>
              <div style="font-size:10px;color:#475569">${cfg.hint()}</div>
            </div>
            <input id="exp-${cat}" type="number" placeholder="0" value="${val}" class="j-input" style="width:80px;padding:8px 10px;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:14px;text-align:right;font-weight:600">
            <span style="font-size:13px;color:#64748b;font-weight:600">€</span>
          </div>
        `
      }).join('')}

      <!-- Day total -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding:12px 14px;background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.12);border-radius:10px">
        <span style="font-size:13px;font-weight:600;color:#f59e0b">${t('dayTotal') || 'Total du jour'}</span>
        <span style="font-size:18px;font-weight:800;color:#f59e0b">${dayTotal > 0 ? dayTotal + ' €' : '0 €'}</span>
      </div>

      <button onclick="journalSaveExpenses('${tripId}','${date}')" style="width:100%;margin-top:20px;padding:14px;border-radius:12px;background:#22c55e;color:#fff;font-size:15px;font-weight:700;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">
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
    <div style="margin:-16px;padding:16px">
      <div style="padding:0 0 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.06);margin-bottom:16px">
        <button onclick="journalBack()" style="background:none;border:none;color:#94a3b8;cursor:pointer">${icon('arrow-left', 'w-5 h-5')}</button>
        <h1 style="font-size:16px;font-weight:700;flex:1">${t('dayNote') || 'Note du jour'} \u00B7 ${t('day') || 'Jour'} ${dayNumber || '?'}</h1>
      </div>

      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:11px;color:#64748b">${dateStr}</div>
      </div>

      <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:6px;font-weight:500">${icon('pencil', 'w-3.5 h-3.5')} ${t('daySummary') || 'Résumé de la journée'}</label>
      <textarea id="journal-day-note" rows="5" placeholder="${t('dayNotePromptLong') || "Comment s'est passée cette journée ? Qu'est-ce qui t'a marqué ?"}" class="j-input" style="width:100%;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:14px;resize:none;line-height:1.5;margin-bottom:8px">${escapeHTML(existing)}</textarea>

      <div style="font-size:10px;color:#f59e0b;margin-bottom:20px;display:flex;align-items:center;gap:4px">
        ${icon('circle-alert', 'w-3 h-3')} ${t('dayNoteRequired') || 'La note du jour est obligatoire pour garder un souvenir de chaque journée'}
      </div>

      <button onclick="journalSaveDayNote('${tripId}','${date}')" style="width:100%;padding:14px;border-radius:12px;background:#22c55e;color:#fff;font-size:15px;font-weight:700;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">
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
    <div style="margin:-16px;padding:16px;text-align:center">
      <div style="padding:0 0 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.06);margin-bottom:20px">
        <button onclick="journalOpenTrip('${tripId}')" style="background:none;border:none;color:#94a3b8;cursor:pointer">${icon('arrow-left', 'w-5 h-5')}</button>
        <h1 style="font-size:16px;font-weight:700;flex:1">${t('tripRecap') || 'Récap du voyage'}</h1>
      </div>

      <span style="color:#f59e0b">${icon('trophy', 'w-6 h-6')}</span>
      <h2 style="font-size:20px;font-weight:800;margin:12px 0 2px">${escapeHTML(trip.title || '')}</h2>
      <p style="color:#64748b;font-size:12px;margin-bottom:24px">${stats.days} ${t('days') || 'jours'} \u00B7 ${_fmtDate(trip.startDate)}${trip.endDate ? ` au ${_fmtDate(trip.endDate)}` : ''}</p>

      <!-- Stat cards -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px">
        <div style="background:rgba(34,197,94,.08);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:16px"><div style="font-size:28px;font-weight:800;color:#22c55e">${stats.hitchKm}</div><div style="font-size:11px;color:#64748b;margin-top:4px">${t('kmHitchhike') || 'km en autostop'}</div></div>
        <div style="background:rgba(139,92,246,.08);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:16px"><div style="font-size:28px;font-weight:800;color:#8b5cf6">${stats.paidKm}</div><div style="font-size:11px;color:#64748b;margin-top:4px">${t('kmTransport') || 'km en transport'}</div></div>
        <div style="background:rgba(245,158,11,.08);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:16px"><div style="font-size:28px;font-weight:800;color:#f59e0b">${stats.rides}</div><div style="font-size:11px;color:#64748b;margin-top:4px">${t('ridesObtained') || 'rides obtenus'}</div></div>
        <div style="background:rgba(59,130,246,.08);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:16px"><div style="font-size:28px;font-weight:800;color:#3b82f6">${stats.totalWaitMin}</div><div style="font-size:11px;color:#64748b;margin-top:4px">${t('minWaiting') || "min d'attente"}</div></div>
      </div>

      <!-- Advanced stats -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px">
        <div style="background:rgba(255,255,255,.04);border-radius:10px;padding:10px;text-align:center"><div style="font-size:16px;font-weight:700;color:#e2e8f0">${stats.avgWaitMin}</div><div style="font-size:9px;color:#64748b">${t('avgWaitMin') || 'min moy. attente'}</div></div>
        <div style="background:rgba(255,255,255,.04);border-radius:10px;padding:10px;text-align:center"><div style="font-size:16px;font-weight:700;color:#e2e8f0">${stats.budgetPerDay}</div><div style="font-size:9px;color:#64748b">${t('budgetPerDay') || '\u20AC/jour'}</div></div>
        <div style="background:rgba(255,255,255,.04);border-radius:10px;padding:10px;text-align:center"><div style="font-size:16px;font-weight:700;color:#e2e8f0">${stats.avgSpeed || '?'}</div><div style="font-size:9px;color:#64748b">${t('avgSpeedKmh') || 'km/h moy.'}</div></div>
      </div>

      <!-- Ratio bar -->
      ${stats.totalKm > 0 ? `
        <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px;margin-bottom:16px">
          <div style="font-size:12px;font-weight:600;margin-bottom:8px">${t('breakdown') || 'Répartition du trajet'}</div>
          <div style="height:12px;border-radius:6px;overflow:hidden;display:flex">
            ${ratioLegend.map(r => `<div style="width:${r.pct}%;background:${r.color}"></div>`).join('')}
          </div>
          <div style="display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;margin-top:6px">
            ${ratioLegend.slice(0, 4).map(r => `<span style="display:flex;align-items:center;gap:2px">${r.tp === 'hitchhike' ? icon('thumbs-up', 'w-3 h-3') : ''} ${r.pct}% ${r.label.toLowerCase()}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Country + spots -->
      <div style="display:flex;gap:8px;margin-bottom:16px">
        <div style="flex:1;background:rgba(255,255,255,.04);border-radius:12px;padding:10px;text-align:center">
          <div style="font-size:18px">${flags || icon('globe', 'w-5 h-5 text-slate-400')}</div>
          <div style="font-size:10px;color:#64748b;margin-top:3px">${stats.countries} ${t('countries') || 'pays'}</div>
        </div>
        <div style="flex:1;background:rgba(255,255,255,.04);border-radius:12px;padding:10px;text-align:center">
          <div style="font-size:16px;font-weight:700;color:#22c55e">${stats.spotsUsed}</div>
          <div style="font-size:10px;color:#64748b;margin-top:3px">${t('spotsUsed') || 'spots utilisés'}</div>
        </div>
        <div style="flex:1;background:rgba(255,255,255,.04);border-radius:12px;padding:10px;text-align:center">
          <div style="font-size:16px;font-weight:700;color:#f59e0b">${stats.spotsCreated}</div>
          <div style="font-size:10px;color:#64748b;margin-top:3px">${t('spotsCreated') || 'spots créés'}</div>
        </div>
      </div>

      <!-- Budget breakdown -->
      <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px;margin-bottom:16px;text-align:left">
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:10px">
          <span style="font-size:12px;font-weight:600">${t('totalBudget') || 'Budget total'} : ${stats.totalExpenses} €</span>
          <select id="stats-currency" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:6px;color:#f59e0b;padding:3px 6px;font-size:11px;font-weight:600">
            <option selected>EUR €</option><option>USD $</option><option>GBP £</option><option>CHF</option><option>MAD</option><option>THB \u0E3F</option><option>JPY ¥</option><option>BRL R$</option>
          </select>
        </div>
        ${EXPENSE_CATEGORIES.map(cat => {
          const cfg = EXPENSE_ICONS[cat] || EXPENSE_ICONS.other
          const val = stats.expByCategory[cat] || 0
          return `<div style="display:flex;align-items:center;gap:8px;padding:5px 0;font-size:11px"><span style="color:${cfg.color}">${icon(cfg.icon, 'w-3.5 h-3.5')}</span><span style="color:#94a3b8;flex:1">${cfg.label()}</span><span style="color:#e2e8f0;font-weight:600">${val} €</span></div>`
        }).join('')}
      </div>

      <!-- Savings -->
      ${stats.estimatedSavings > 0 ? `
        <div style="font-size:13px;color:#94a3b8;background:rgba(34,197,94,.06);border-radius:10px;padding:12px;margin-bottom:16px">
          <span style="color:#22c55e">${icon('sparkles', 'w-3.5 h-3.5')}</span>
          ${t('savedApprox') || 'Tu as économisé environ'} <strong style="color:#22c55e">~${stats.estimatedSavings} €</strong> ${t('thankToHitchhikingFull') || "grâce à l'autostop par rapport au même trajet en bus/train."}
        </div>
      ` : ''}

      <!-- Public link -->
      ${trip.isPublic ? `
        <div style="background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.15);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left">
          <div style="font-size:12px;font-weight:600;color:#3b82f6;margin-bottom:6px;display:flex;align-items:center;gap:4px">${icon('globe', 'w-3.5 h-3.5')} ${t('publicTrip') || 'Voyage public'}</div>
          <div style="display:flex;align-items:center;gap:6px">
            <div style="flex:1;padding:8px 10px;background:rgba(255,255,255,.06);border-radius:6px;font-size:11px;color:#94a3b8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">spothitch.com/trip/${trip.id.slice(5, 13)}</div>
            <button onclick="journalCopyLink('${trip.id}')" style="background:#3b82f6;color:#fff;border:none;border-radius:6px;padding:8px 12px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap">${t('copy') || 'Copier'}</button>
          </div>
          <div style="font-size:10px;color:#475569;margin-top:6px">${t('publicTripExplain') || 'Les autres voyageurs peuvent voir ton itinéraire et s\'en inspirer'}</div>
        </div>
      ` : ''}

      <!-- Share + Export buttons -->
      <button onclick="journalShareTrip('${trip.id}')" style="width:100%;padding:14px;border-radius:12px;background:#f59e0b;color:#0f1520;font-size:15px;font-weight:700;border:none;cursor:pointer;margin-bottom:8px;display:flex;align-items:center;justify-content:center;gap:6px">
        ${icon('share', 'w-5 h-5')} ${t('shareTrip') || 'Partager mon voyage'}
      </button>
      <button onclick="journalExportTrip('${trip.id}')" style="width:100%;padding:12px;border-radius:12px;background:rgba(255,255,255,.06);color:#94a3b8;font-size:13px;font-weight:600;border:none;cursor:pointer;margin-bottom:8px;display:flex;align-items:center;justify-content:center;gap:6px">
        ${icon('download', 'w-4 h-4')} ${t('exportTrip') || 'Exporter (JSON)'}
      </button>
      <button onclick="journalBack()" style="width:100%;padding:12px;border-radius:12px;background:rgba(255,255,255,.06);color:#94a3b8;font-size:13px;font-weight:600;border:none;cursor:pointer">
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
    <div style="margin:-16px;padding:16px;max-width:600px;margin:0 auto">
      <!-- Header -->
      <div style="text-align:center;padding:20px 0 16px;border-bottom:1px solid rgba(255,255,255,.06);margin-bottom:20px">
        <div style="font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">${t('publicTrip') || 'Voyage public'}</div>
        <h1 style="font-size:22px;font-weight:800;margin-bottom:4px">${escapeHTML(trip.title || (t('untitledTrip') || 'Voyage'))}</h1>
        <p style="color:#94a3b8;font-size:13px">${t('by') || 'par'} ${escapeHTML(trip.userName || t('traveler'))}</p>
        <p style="color:#64748b;font-size:12px;margin-top:4px">${_fmtDate(trip.startDate)} \u2192 ${trip.endDate ? _fmtDate(trip.endDate) : (t('today') || "aujourd'hui")} \u00B7 ${days} ${t('days') || 'jours'}</p>
      </div>

      <!-- Stats -->
      ${stats ? `
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:20px">
        <div style="background:rgba(34,197,94,.08);border-radius:12px;padding:12px;text-align:center"><div style="font-size:20px;font-weight:800;color:#22c55e">${stats.totalKm}</div><div style="font-size:9px;color:#64748b">km</div></div>
        <div style="background:rgba(245,158,11,.08);border-radius:12px;padding:12px;text-align:center"><div style="font-size:20px;font-weight:800;color:#f59e0b">${stats.rides}</div><div style="font-size:9px;color:#64748b">rides</div></div>
        <div style="background:rgba(59,130,246,.08);border-radius:12px;padding:12px;text-align:center"><div style="font-size:20px;font-weight:800;color:#3b82f6">${stats.totalWaitMin}</div><div style="font-size:9px;color:#64748b">min</div></div>
        <div style="background:rgba(139,92,246,.08);border-radius:12px;padding:12px;text-align:center"><div style="font-size:20px;font-weight:800;color:#8b5cf6">${stats.countries}</div><div style="font-size:9px;color:#64748b">${t('countries') || 'pays'}</div></div>
      </div>
      ` : ''}

      <!-- Timeline -->
      ${legsByDay.map(day => `
        <div style="margin-bottom:16px">
          <div style="font-size:13px;font-weight:700;margin-bottom:8px">${t('day') || 'Jour'} ${day.dayNumber} \u00B7 ${_fmtDate(day.date)}</div>
          ${day.legs.map(leg => {
            const tp = TRANSPORTS[leg.transport] || TRANSPORTS.other
            return `
              <div style="display:flex;gap:10px;margin-bottom:8px;padding:8px 12px;background:rgba(255,255,255,.04);border-radius:10px">
                <div style="width:28px;height:28px;border-radius:50%;background:${tp.bg};display:flex;align-items:center;justify-content:center;color:${tp.color};flex-shrink:0">${icon(tp.icon, 'w-4 h-4')}</div>
                <div style="flex:1;min-width:0">
                  <div style="font-size:13px;font-weight:600">${escapeHTML(leg.departure?.name || '?')} \u2192 ${escapeHTML(leg.arrival?.name || '?')}</div>
                  <div style="font-size:11px;color:#94a3b8;display:flex;gap:8px;margin-top:2px">
                    ${leg.distanceKm ? `<span>${leg.distanceKm} km</span>` : ''}
                    ${leg.waitMinutes ? `<span>${leg.waitMinutes} min ${t('wait') || 'attente'}</span>` : ''}
                  </div>
                  ${leg.note ? `<div style="font-size:11px;color:#94a3b8;font-style:italic;margin-top:4px">"${escapeHTML(leg.note)}"</div>` : ''}
                </div>
              </div>
            `
          }).join('')}
          ${trip.dayNotes?.[day.date] ? `<div style="font-size:12px;color:#94a3b8;padding:8px 12px;background:rgba(59,130,246,.04);border-radius:8px;line-height:1.5">${escapeHTML(trip.dayNotes[day.date])}</div>` : ''}
        </div>
      `).join('')}

      <!-- Footer -->
      <div style="text-align:center;padding:20px 0;border-top:1px solid rgba(255,255,255,.06);margin-top:16px">
        <p style="font-size:12px;color:#64748b;margin-bottom:8px">${t('sharedViaSpotHitch') || 'Partagé via SpotHitch'}</p>
        <a href="/" style="color:#f59e0b;font-size:13px;font-weight:600;text-decoration:none">${t('discoverSpotHitch') || 'Découvrir SpotHitch'} \u2192</a>
      </div>
    </div>
  `
}

export default { renderJournal }
