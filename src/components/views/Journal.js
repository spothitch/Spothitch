/**
 * Journal / Trip Diary Component
 * Renders trip list, trip detail (timeline), add leg, expenses, day notes, stats
 * CSS copied from mockup v1-final.html — DO NOT translate to Tailwind
 */

import { t } from '../../i18n/index.js'
import { icon } from '../../utils/icons.js'
import { escapeHTML } from '../../utils/sanitize.js'
import { getState } from '../../stores/state.js'
import {
  getTrips, getTrip, getLegsByDay, getTripStats,
  EXPENSE_CATEGORIES,
} from '../../services/tripJournal.js'

// Transport config: icon name, label key, color class
const TRANSPORTS = {
  hitchhike: { icon: 'thumbs-up', label: 'Autostop', color: '#22c55e', bg: 'rgba(34,197,94,.1)' },
  walk:      { icon: 'footprints', label: 'Marche',   color: '#3b82f6', bg: 'rgba(59,130,246,.1)' },
  bus:       { icon: 'bus',        label: 'Bus',       color: '#8b5cf6', bg: 'rgba(139,92,246,.1)' },
  train:     { icon: 'train',      label: 'Train',     color: '#f59e0b', bg: 'rgba(245,158,11,.1)' },
  plane:     { icon: 'plane',      label: 'Avion',     color: '#ec4899', bg: 'rgba(236,72,153,.1)' },
  boat:      { icon: 'ship',       label: 'Bateau',    color: '#06b6d4', bg: 'rgba(6,182,212,.1)' },
  bike:      { icon: 'bike',       label: 'Vélo',      color: '#14b8a6', bg: 'rgba(20,184,166,.1)' },
  car:       { icon: 'car',        label: 'Voiture',   color: '#f97316', bg: 'rgba(249,115,22,.1)' },
  other:     { icon: 'package',    label: 'Autre',     color: '#64748b', bg: 'rgba(100,116,139,.1)' },
}

const EXPENSE_ICONS = {
  transport: { icon: 'route', color: '#8b5cf6', bg: 'rgba(139,92,246,.1)', label: 'Transport', hint: 'Bus, train, taxi, péage...' },
  lodging:   { icon: 'bed', color: '#3b82f6', bg: 'rgba(59,130,246,.1)', label: 'Logement', hint: 'Hôtel, hostel, camping...' },
  food:      { icon: 'coffee', color: '#f59e0b', bg: 'rgba(245,158,11,.1)', label: 'Nourriture', hint: 'Restos, courses, snacks...' },
  leisure:   { icon: 'sparkles', color: '#ec4899', bg: 'rgba(236,72,153,.1)', label: 'Loisirs', hint: 'Visites, activités, sorties...' },
  logistics: { icon: 'package', color: '#06b6d4', bg: 'rgba(6,182,212,.1)', label: 'Logistique', hint: 'SIM, lessive, pharmacie...' },
  other:     { icon: 'coins', color: '#64748b', bg: 'rgba(100,116,139,.1)', label: 'Autres', hint: 'Souvenirs, dons, imprévus...' },
}

/**
 * Main render function — dispatches to the right view
 */
export function renderJournal(state) {
  const view = state.journalView || 'list'
  const tripId = state.journalTripId

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
        <span style="color:#f59e0b">${icon('notebook', 'w-5 h-5')}</span>
        <h2 style="font-size:16px;font-weight:700;flex:1">${t('myTrips') || 'Mes Voyages'}</h2>
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
    </div>
  `
}

function _renderTripCard(trip, isActive) {
  const stats = getTripStats(trip)
  const gradients = [
    '--c1:#1a3328;--c2:#0f2018',
    '--c1:#2a1a3a;--c2:#1a1025',
    '--c1:#3a2a1a;--c2:#251a0f',
    '--c1:#1a2a3a;--c2:#0f1825',
  ]
  const gradient = gradients[Math.abs(trip.id.charCodeAt(5)) % gradients.length]

  return `
    <div onclick="journalOpenTrip('${trip.id}')" style="margin:8px 16px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden;cursor:pointer">
      <div style="height:120px;position:relative;overflow:hidden">
        <div style="position:absolute;inset:0;background:linear-gradient(135deg,var(${gradient.split(';')[0]}),var(${gradient.split(';')[1]}))"></div>
        ${trip.coverPhoto ? `<img src="${escapeHTML(trip.coverPhoto)}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0" alt="">` : ''}
        <div style="position:absolute;bottom:0;left:0;right:0;padding:12px 16px;background:linear-gradient(transparent,rgba(0,0,0,.6))">
          <span style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:600;${
            isActive
              ? 'background:rgba(34,197,94,.15);color:#22c55e'
              : 'background:rgba(100,116,139,.15);color:#94a3b8'
          }">
            ${icon(isActive ? 'route' : 'flag', 'w-3 h-3')} ${isActive ? (t('inProgress') || 'En cours') : (t('completed') || 'Terminé')}
          </span>
          <div style="font-size:17px;font-weight:800;margin-top:4px">${escapeHTML(trip.title || (t('untitledTrip') || 'Voyage sans titre'))}</div>
          <div style="font-size:11px;color:#94a3b8;margin-top:2px">${trip.startDate}${trip.endDate ? ` → ${trip.endDate}` : ` → ${t('today') || "aujourd'hui"}`}</div>
        </div>
      </div>
      <div style="display:flex">
        <div style="flex:1;text-align:center;padding:10px 6px;border-right:1px solid rgba(255,255,255,.05)">
          <div style="font-size:15px;font-weight:700;color:#f59e0b">${stats?.totalKm || 0}</div>
          <div style="font-size:9px;color:#64748b;text-transform:uppercase;margin-top:2px">km</div>
        </div>
        <div style="flex:1;text-align:center;padding:10px 6px;border-right:1px solid rgba(255,255,255,.05)">
          <div style="font-size:15px;font-weight:700;color:#f59e0b">${stats?.rides || 0}</div>
          <div style="font-size:9px;color:#64748b;text-transform:uppercase;margin-top:2px">rides</div>
        </div>
        <div style="flex:1;text-align:center;padding:10px 6px;border-right:1px solid rgba(255,255,255,.05)">
          <div style="font-size:15px;font-weight:700;color:#f59e0b">${stats?.totalWaitMin || 0}</div>
          <div style="font-size:9px;color:#64748b;text-transform:uppercase;margin-top:2px">min att.</div>
        </div>
        <div style="flex:1;text-align:center;padding:10px 6px">
          <div style="font-size:15px;font-weight:700;color:#f59e0b">${stats?.countries || 0}</div>
          <div style="font-size:9px;color:#64748b;text-transform:uppercase;margin-top:2px">${t('countries') || 'pays'}</div>
        </div>
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
        <h2 style="font-size:16px;font-weight:700;flex:1">${t('newTrip') || 'Nouveau voyage'}</h2>
      </div>

      <div style="text-align:center;margin-bottom:24px">
        <span style="color:#f59e0b">${icon('route', 'w-6 h-6')}</span>
        <p style="font-size:13px;color:#94a3b8;margin-top:8px">${t('tripTitleAutoGenerated') || 'Le titre se génère automatiquement à partir de tes étapes'}</p>
      </div>

      <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:6px;font-weight:500">${icon('calendar', 'w-3.5 h-3.5')} ${t('departureDate') || 'Date de départ'}</label>
      <input id="journal-start-date" type="date" value="${today}" style="width:100%;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:14px;margin-bottom:20px">

      <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:6px;font-weight:500">${icon('pencil', 'w-3.5 h-3.5')} ${t('titleOptional') || 'Titre (optionnel)'}</label>
      <input id="journal-trip-title" type="text" placeholder="${t('autoTitlePlaceholder') || 'Auto : Première ville → Dernière ville'}" style="width:100%;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:14px;margin-bottom:30px">

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

  return `
    <div style="margin:-16px;margin-bottom:0">
      <!-- Header -->
      <div style="padding:12px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.06)">
        <button onclick="journalBack()" style="background:none;border:none;color:#94a3b8;cursor:pointer">${icon('arrow-left', 'w-5 h-5')}</button>
        <h2 style="font-size:16px;font-weight:700;flex:1">${escapeHTML(trip.title || (t('untitledTrip') || 'Voyage'))}</h2>
        <button onclick="journalAddLeg('${trip.id}')" style="background:#f59e0b;color:#0f1520;border:none;border-radius:10px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:4px">
          ${icon('plus', 'w-3.5 h-3.5')} ${t('leg') || 'Étape'}
        </button>
      </div>

      <!-- Meta -->
      <div style="padding:12px 16px">
        <div style="font-size:12px;color:#64748b;display:flex;align-items:center;gap:6px">
          ${icon('calendar', 'w-3.5 h-3.5')} ${trip.startDate}${trip.endDate ? ` → ${trip.endDate}` : ''}
          <span style="margin:0 4px">·</span>
          ${icon('globe', 'w-3.5 h-3.5')} ${stats?.countries || 0} ${t('countries') || 'pays'}
        </div>
      </div>

      <!-- Days -->
      ${days.length === 0 ? `
        <div style="text-align:center;padding:40px 20px;color:#475569">
          <div style="margin-bottom:8px">${icon('plus', 'w-8 h-8')}</div>
          <div style="font-size:13px">${t('addFirstLeg') || 'Ajoute ta première étape pour commencer la timeline'}</div>
        </div>
      ` : days.map(day => _renderDay(trip, day)).join('')}

      <!-- Add leg button -->
      <div onclick="journalAddLeg('${trip.id}')" style="margin:4px 16px 12px;padding:12px;border:2px dashed rgba(255,255,255,.08);border-radius:12px;text-align:center;color:#64748b;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">
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
        <div style="padding:0 16px 16px">
          <button onclick="journalEndTrip('${trip.id}')" style="width:100%;padding:12px;border-radius:10px;background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.2);color:#f59e0b;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">
            ${icon('flag', 'w-4 h-4')} ${t('endTrip') || 'Terminer le voyage'}
          </button>
        </div>
      ` : `
        <!-- View stats -->
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

function _renderDay(trip, day) {
  const { date, dayNumber, legs } = day
  const note = trip.dayNotes?.[date]
  const photo = trip.dayPhotos?.[date]
  const expenses = trip.dayExpenses?.[date] || {}
  const dayTotal = Object.entries(expenses).reduce((s, [k, v]) => k === 'currency' ? s : s + (v || 0), 0)
  const dateStr = new Date(date + 'T12:00:00').toLocaleDateString(getState().lang || 'fr', { day: 'numeric', month: 'short' })

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
        ? `<div style="margin:0 0 10px 36px;width:calc(100% - 36px);height:160px;border-radius:12px;overflow:hidden"><img src="${escapeHTML(photo)}" style="width:100%;height:100%;object-fit:cover" alt=""></div>`
        : `<div onclick="journalAddDayPhoto('${trip.id}','${date}')" style="margin:0 0 10px 36px;width:calc(100% - 36px);height:48px;border:2px dashed rgba(255,255,255,.08);border-radius:12px;display:flex;align-items:center;justify-content:center;gap:6px;color:#475569;font-size:12px;cursor:pointer">${icon('camera', 'w-4 h-4')} ${t('addDayPhoto') || 'Ajouter la photo du jour'}</div>`
      }

      <!-- Day note -->
      ${note
        ? `<div style="margin:0 0 10px 36px;width:calc(100% - 36px);padding:10px 12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;font-size:12px;color:#94a3b8;line-height:1.5;font-style:italic">"${escapeHTML(note)}"</div>`
        : `<div onclick="journalEditDayNote('${trip.id}','${date}')" style="margin:0 0 10px 36px;width:calc(100% - 36px);padding:10px 12px;background:rgba(245,158,11,.04);border:1px dashed rgba(245,158,11,.2);border-radius:10px;font-size:12px;color:#f59e0b;cursor:pointer;display:flex;align-items:center;gap:6px">${icon('pencil', 'w-3.5 h-3.5')} ${t('writeDayNote') || 'Écrire la note du jour'}</div>`
      }

      <!-- Legs -->
      ${legs.map((leg, i) => _renderLeg(leg, i === legs.length - 1)).join('')}

      <!-- Day expenses -->
      <div style="margin:4px 0 10px 36px;width:calc(100% - 36px);background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);border-radius:10px;overflow:hidden">
        <div onclick="journalEditExpenses('${trip.id}','${date}')" style="padding:8px 12px;display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;color:#64748b">
          ${icon('coins', 'w-3.5 h-3.5')} ${t('dayExpenses') || 'Dépenses du jour'}
          <span style="margin-left:auto;font-weight:600;color:#f59e0b">${dayTotal > 0 ? dayTotal + ' €' : '0 €'}</span>
          ${icon('pencil', 'w-3 h-3')}
        </div>
      </div>
    </div>
  `
}

function _renderLeg(leg, isLast) {
  const tp = TRANSPORTS[leg.transport] || TRANSPORTS.other
  return `
    <div style="display:flex;gap:12px;margin-bottom:2px">
      <div style="width:24px;display:flex;flex-direction:column;align-items:center;padding-top:2px">
        <div style="width:10px;height:10px;border-radius:50%;background:${tp.color};box-shadow:0 0 6px ${tp.color}40;flex-shrink:0"></div>
        ${isLast ? '' : `<div style="width:2px;flex:1;min-height:16px;background:${tp.bg}"></div>`}
      </div>
      <div style="flex:1;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:10px 12px;margin-bottom:6px">
        <div style="display:flex;align-items:center;gap:5px;margin-bottom:4px;color:${tp.color}">
          ${icon(tp.icon, 'w-3.5 h-3.5')}
          <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px">${tp.label}</span>
        </div>
        <div style="font-size:13px;font-weight:600">
          ${escapeHTML(leg.departure?.name || '?')}
          <span style="color:#475569;margin:0 3px">${icon('arrow-right', 'w-3 h-3')}</span>
          ${escapeHTML(leg.arrival?.name || '?')}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:5px;font-size:11px;color:#64748b">
          ${leg.distanceKm ? `<span style="display:flex;align-items:center;gap:3px">${icon('ruler', 'w-3 h-3')} ${leg.distanceKm} km</span>` : ''}
          ${leg.waitMinutes ? `<span style="display:flex;align-items:center;gap:3px">${icon('clock', 'w-3 h-3')} ${leg.waitMinutes} min att.</span>` : ''}
        </div>
        ${leg.note ? `<div style="font-size:11px;color:#94a3b8;margin-top:6px;font-style:italic;line-height:1.4;padding-left:8px;border-left:2px solid rgba(255,255,255,.06)">"${escapeHTML(leg.note)}"</div>` : ''}
        ${leg.spotId ? `<div style="display:inline-flex;align-items:center;gap:4px;margin-top:6px;padding:4px 8px;background:${leg.spotCreated ? 'rgba(245,158,11,.06)' : 'rgba(34,197,94,.06)'};border:1px solid ${leg.spotCreated ? 'rgba(245,158,11,.12)' : 'rgba(34,197,94,.12)'};border-radius:6px;font-size:10px;color:${leg.spotCreated ? '#f59e0b' : '#22c55e'};cursor:pointer">${icon(leg.spotCreated ? 'plus' : 'map-pin', 'w-3 h-3')} ${leg.spotCreated ? (t('spotCreated') || 'Spot créé') : ''} ${escapeHTML(leg.spotName || '')}</div>` : ''}
      </div>
    </div>
  `
}

// ==================== ADD LEG ====================

function renderAddLeg(state, tripId) {
  const selectedTransport = state.journalTransport || 'hitchhike'
  const isHitch = selectedTransport === 'hitchhike'
  // isPaid used for future price field
  void(['bus', 'train', 'plane', 'boat', 'car'].includes(selectedTransport))

  return `
    <div style="margin:-16px;padding:16px">
      <!-- Header -->
      <div style="padding:0 0 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.06);margin-bottom:16px">
        <button onclick="journalBack()" style="background:none;border:none;color:#94a3b8;cursor:pointer">${icon('arrow-left', 'w-5 h-5')}</button>
        <h2 style="font-size:16px;font-weight:700;flex:1">${t('newLeg') || 'Nouvelle étape'}</h2>
      </div>

      <!-- Transport picker -->
      <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:10px;font-weight:500">${t('transportMode') || 'Mode de transport'}</label>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:18px">
        ${Object.entries(TRANSPORTS).map(([key, tp]) => `
          <button onclick="journalSelectTransport('${key}')"
            style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 6px;border-radius:10px;background:${selectedTransport === key ? tp.bg : 'rgba(255,255,255,.04)'};border:2px solid ${selectedTransport === key ? tp.color : 'transparent'};cursor:pointer;transition:all .15s">
            <span style="color:${selectedTransport === key ? tp.color : '#94a3b8'}">${icon(tp.icon, 'w-5 h-5')}</span>
            <span style="font-size:10px;font-weight:600;color:${selectedTransport === key ? tp.color : '#94a3b8'}">${tp.label}</span>
          </button>
        `).join('')}
      </div>

      ${isHitch ? `
        <!-- Spot picker -->
        <div id="journal-spot-section" style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:14px;margin-bottom:18px">
          <div style="font-size:12px;font-weight:600;color:#22c55e;margin-bottom:8px;display:flex;align-items:center;gap:5px">${icon('map-pin', 'w-3.5 h-3.5')} ${t('linkSpot') || 'Lier à un spot SpotHitch'}</div>
          <div style="display:flex;gap:8px">
            <button onclick="journalPickSpot('use')" style="flex:1;padding:10px;border-radius:8px;background:rgba(34,197,94,.1);color:#22c55e;font-size:12px;font-weight:600;cursor:pointer;border:none;display:flex;align-items:center;justify-content:center;gap:4px">${icon('map-pin', 'w-3.5 h-3.5')} ${t('existingSpot') || 'Spot existant'}</button>
            <button onclick="journalPickSpot('new')" style="flex:1;padding:10px;border-radius:8px;background:rgba(245,158,11,.1);color:#f59e0b;font-size:12px;font-weight:600;cursor:pointer;border:none;display:flex;align-items:center;justify-content:center;gap:4px">${icon('plus', 'w-3.5 h-3.5')} ${t('createSpot') || 'Créer un spot'}</button>
          </div>
        </div>
      ` : ''}

      <!-- Departure -->
      <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:6px;font-weight:500">${icon('map-pin', 'w-3.5 h-3.5')} ${t('departure') || 'Départ'}</label>
      <input id="journal-departure" type="text" placeholder="${t('searchCity') || 'Rechercher une ville...'}" style="width:100%;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:14px;margin-bottom:14px">

      <!-- Arrival -->
      <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:6px;font-weight:500">${icon('flag', 'w-3.5 h-3.5')} ${t('arrival') || 'Arrivée'}</label>
      <input id="journal-arrival" type="text" placeholder="${t('searchCity') || 'Rechercher une ville...'}" style="width:100%;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:14px;margin-bottom:14px">

      <!-- Auto distance -->
      <div style="display:flex;align-items:center;gap:6px;padding:8px 12px;background:rgba(255,255,255,.03);border-radius:8px;margin-bottom:14px;font-size:12px;color:#64748b">
        ${icon('ruler', 'w-3.5 h-3.5')} ${t('distance') || 'Distance'} : <strong style="color:#e2e8f0">${t('autoCalculated') || 'calculée automatiquement'}</strong>
      </div>

      <!-- Note (optional) -->
      <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:6px;font-weight:500">${icon('pencil', 'w-3.5 h-3.5')} ${t('noteOptional') || 'Note (optionnel)'}</label>
      <textarea id="journal-note" placeholder="${t('shareExperience') || 'Raconte ton expérience...'}" rows="2" style="width:100%;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:14px;resize:none;margin-bottom:14px"></textarea>

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

// ==================== EDIT EXPENSES ====================

function renderEditExpenses(state, tripId) {
  const trip = getTrip(tripId)
  if (!trip) return renderTripList(state)
  const date = state.journalDate || new Date().toISOString().slice(0, 10)
  const existing = trip.dayExpenses?.[date] || {}
  const dateStr = new Date(date + 'T12:00:00').toLocaleDateString(getState().lang || 'fr', { day: 'numeric', month: 'long', year: 'numeric' })
  const dayNumber = getLegsByDay(trip).findIndex(d => d.date === date) + 1

  return `
    <div style="margin:-16px;padding:16px">
      <div style="padding:0 0 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.06);margin-bottom:16px">
        <button onclick="journalBack()" style="background:none;border:none;color:#94a3b8;cursor:pointer">${icon('arrow-left', 'w-5 h-5')}</button>
        <h2 style="font-size:16px;font-weight:700;flex:1">${t('expenses') || 'Dépenses'} · ${t('day') || 'Jour'} ${dayNumber || '?'}</h2>
      </div>

      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:11px;color:#64748b">${dateStr}</div>
        <div style="display:inline-flex;align-items:center;gap:6px;margin-top:6px;padding:4px 10px;background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.15);border-radius:8px">
          <span style="color:#3b82f6">${icon('globe', 'w-3.5 h-3.5')}</span>
          <span style="font-size:11px;color:#3b82f6;font-weight:600">${t('autoCurrency') || 'Devise auto du pays'}</span>
        </div>
        <div style="font-size:10px;color:#475569;margin-top:6px">${t('allOptional') || 'Tous les montants sont optionnels'}</div>
      </div>

      ${EXPENSE_CATEGORIES.map(cat => {
        const cfg = EXPENSE_ICONS[cat]
        const val = existing[cat] || ''
        return `
          <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.04)">
            <div style="width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:${cfg.bg};color:${cfg.color};flex-shrink:0">${icon(cfg.icon, 'w-4 h-4')}</div>
            <div style="flex:1">
              <div style="font-size:13px;font-weight:600">${cfg.label}</div>
              <div style="font-size:10px;color:#475569">${cfg.hint}</div>
            </div>
            <input id="exp-${cat}" type="number" placeholder="0" value="${val}" style="width:80px;padding:8px 10px;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:14px;text-align:right;font-weight:600">
            <span style="font-size:13px;color:#64748b;font-weight:600">€</span>
          </div>
        `
      }).join('')}

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

  return `
    <div style="margin:-16px;padding:16px">
      <div style="padding:0 0 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.06);margin-bottom:16px">
        <button onclick="journalBack()" style="background:none;border:none;color:#94a3b8;cursor:pointer">${icon('arrow-left', 'w-5 h-5')}</button>
        <h2 style="font-size:16px;font-weight:700;flex:1">${t('dayNote') || 'Note du jour'} · ${t('day') || 'Jour'} ${dayNumber || '?'}</h2>
      </div>

      <label style="font-size:12px;color:#94a3b8;display:block;margin-bottom:6px;font-weight:500">${icon('pencil', 'w-3.5 h-3.5')} ${t('daySummary') || 'Résumé de la journée'}</label>
      <textarea id="journal-day-note" rows="6" placeholder="${t('dayNotePrompt') || 'Raconte ta journée...'}" style="width:100%;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:14px;resize:none;line-height:1.5;margin-bottom:8px">${escapeHTML(existing)}</textarea>

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

  return `
    <div style="margin:-16px;padding:16px;text-align:center">
      <div style="padding:0 0 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.06);margin-bottom:20px">
        <button onclick="journalOpenTrip('${tripId}')" style="background:none;border:none;color:#94a3b8;cursor:pointer">${icon('arrow-left', 'w-5 h-5')}</button>
        <h2 style="font-size:16px;font-weight:700;flex:1">${t('tripRecap') || 'Récap du voyage'}</h2>
      </div>

      <span style="color:#f59e0b">${icon('trophy', 'w-6 h-6')}</span>
      <h3 style="font-size:20px;font-weight:800;margin:12px 0 2px">${escapeHTML(trip.title || '')}</h3>
      <p style="color:#64748b;font-size:12px;margin-bottom:24px">${stats.days} ${t('days') || 'jours'} · ${trip.startDate}${trip.endDate ? ` → ${trip.endDate}` : ''}</p>

      <!-- Stat cards -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px">
        <div style="background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.15);border-radius:14px;padding:16px"><div style="font-size:28px;font-weight:800;color:#22c55e">${stats.hitchKm}</div><div style="font-size:11px;color:#64748b;margin-top:4px">km en autostop</div></div>
        <div style="background:rgba(139,92,246,.08);border:1px solid rgba(139,92,246,.15);border-radius:14px;padding:16px"><div style="font-size:28px;font-weight:800;color:#8b5cf6">${stats.paidKm}</div><div style="font-size:11px;color:#64748b;margin-top:4px">km en transport</div></div>
        <div style="background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.15);border-radius:14px;padding:16px"><div style="font-size:28px;font-weight:800;color:#f59e0b">${stats.rides}</div><div style="font-size:11px;color:#64748b;margin-top:4px">rides obtenus</div></div>
        <div style="background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.15);border-radius:14px;padding:16px"><div style="font-size:28px;font-weight:800;color:#3b82f6">${stats.totalWaitMin}</div><div style="font-size:11px;color:#64748b;margin-top:4px">min d'attente</div></div>
      </div>

      <!-- Ratio bar -->
      ${stats.totalKm > 0 ? `
        <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px;margin-bottom:16px">
          <div style="font-size:12px;font-weight:600;margin-bottom:8px">${t('breakdown') || 'Répartition du trajet'}</div>
          <div style="height:12px;border-radius:6px;overflow:hidden;display:flex">
            <div style="width:${stats.transportRatio.hitchhike}%;background:#22c55e"></div>
            <div style="width:${stats.transportRatio.paid}%;background:#8b5cf6"></div>
            <div style="width:${stats.transportRatio.walk}%;background:#3b82f6"></div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;margin-top:6px">
            <span>${icon('thumbs-up', 'w-3 h-3')} ${stats.transportRatio.hitchhike}% stop</span>
            <span>${stats.transportRatio.paid}% payé</span>
            <span>${stats.transportRatio.walk}% marche</span>
          </div>
        </div>
      ` : ''}

      <!-- Budget with currency selector -->
      ${stats.totalExpenses > 0 ? `
        <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px;margin-bottom:16px;text-align:left">
          <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:10px">
            <span style="font-size:12px;font-weight:600">${t('totalBudget') || 'Budget total'} : ${stats.totalExpenses} €</span>
            <select id="stats-currency" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:6px;color:#f59e0b;padding:3px 6px;font-size:11px;font-weight:600">
              <option selected>EUR €</option><option>USD $</option><option>GBP £</option><option>CHF</option><option>MAD</option><option>THB ฿</option>
            </select>
          </div>
          ${Object.entries(stats.expByCategory).filter(([, v]) => v > 0).map(([cat, val]) => {
            const cfg = EXPENSE_ICONS[cat] || EXPENSE_ICONS.other
            return `<div style="display:flex;align-items:center;gap:8px;padding:5px 0;font-size:11px"><span style="color:${cfg.color}">${icon(cfg.icon, 'w-3.5 h-3.5')}</span><span style="color:#94a3b8;flex:1">${cfg.label}</span><span style="color:#e2e8f0;font-weight:600">${val} €</span></div>`
          }).join('')}
        </div>
      ` : ''}

      <!-- Savings -->
      ${stats.estimatedSavings > 0 ? `
        <div style="font-size:13px;color:#94a3b8;background:rgba(34,197,94,.06);border-radius:10px;padding:12px;margin-bottom:16px">
          ${icon('sparkles', 'w-3.5 h-3.5')} ${t('savedApprox') || 'Tu as économisé environ'} <strong style="color:#22c55e">~${stats.estimatedSavings} €</strong> ${t('thankToHitchhiking') || "grâce à l'autostop"}
        </div>
      ` : ''}

      <!-- Public link -->
      ${trip.isPublic ? `
        <div style="background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.15);border-radius:12px;padding:12px;margin-bottom:16px;text-align:left">
          <div style="font-size:12px;font-weight:600;color:#3b82f6;margin-bottom:6px;display:flex;align-items:center;gap:4px">${icon('globe', 'w-3.5 h-3.5')} ${t('publicTrip') || 'Voyage public'}</div>
          <div style="display:flex;align-items:center;gap:6px">
            <div style="flex:1;padding:8px 10px;background:rgba(255,255,255,.06);border-radius:6px;font-size:11px;color:#94a3b8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">spothitch.com/trip/${trip.id.slice(5, 13)}</div>
            <button onclick="journalCopyLink('${trip.id}')" style="background:#3b82f6;color:#fff;border:none;border-radius:6px;padding:8px 12px;font-size:11px;font-weight:600;cursor:pointer">${t('copy') || 'Copier'}</button>
          </div>
        </div>
      ` : ''}

      <!-- Share button -->
      <button onclick="journalShareTrip('${trip.id}')" style="width:100%;padding:14px;border-radius:12px;background:#f59e0b;color:#0f1520;font-size:15px;font-weight:700;border:none;cursor:pointer;margin-bottom:8px;display:flex;align-items:center;justify-content:center;gap:6px">
        ${icon('share-2', 'w-5 h-5')} ${t('shareTrip') || 'Partager mon voyage'}
      </button>
      <button onclick="journalBack()" style="width:100%;padding:12px;border-radius:12px;background:rgba(255,255,255,.06);color:#94a3b8;font-size:13px;font-weight:600;border:none;cursor:pointer">
        ${t('backToTrips') || 'Retour à mes voyages'}
      </button>
    </div>
  `
}

export default { renderJournal }
