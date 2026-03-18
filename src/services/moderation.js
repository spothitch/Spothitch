/**
 * Moderation Service
 * Advanced reporting and content moderation
 */

import { getState, setState } from '../stores/state.js';
import { showToast } from './notifications.js';
import { t } from '../i18n/index.js';
import { icon } from '../utils/icons.js'

// Report types - labels are now translated dynamically
export const REPORT_TYPES = {
  SPOT: {
    MISPLACED: { id: 'misplaced', labelKey: 'reportMisplaced', icon: 'map-pin-off', severity: 'medium' },
    INACCURATE: { id: 'inaccurate', labelKey: 'reportInaccurate', icon: 'circle-alert', severity: 'medium' },
    DANGEROUS: { id: 'dangerous', labelKey: 'reportDangerous', icon: 'skull', severity: 'high' },
    INAPPROPRIATE: { id: 'inappropriate', labelKey: 'reportInappropriate', icon: 'ban', severity: 'high' },
    DUPLICATE: { id: 'duplicate', labelKey: 'reportDuplicate', icon: 'copy', severity: 'low' },
    CLOSED: { id: 'closed', labelKey: 'reportClosed', icon: 'lock', severity: 'medium' },
    OTHER: { id: 'other', labelKey: 'reportOther', icon: 'info', severity: 'low' },
  },
  USER: {
    SPAM: { id: 'spam', labelKey: 'reportSpam', icon: 'megaphone', severity: 'medium' },
    HARASSMENT: { id: 'harassment', labelKey: 'reportHarassment', icon: 'user-x', severity: 'high' },
    FAKE: { id: 'fake', labelKey: 'reportFakeProfile', icon: 'scan-eye', severity: 'medium' },
    INAPPROPRIATE: { id: 'inappropriate', labelKey: 'reportInappropriate', icon: 'ban', severity: 'high' },
    OTHER: { id: 'other', labelKey: 'reportOther', icon: 'info', severity: 'low' },
  },
  MESSAGE: {
    SPAM: { id: 'spam', labelKey: 'reportSpam', icon: 'megaphone', severity: 'medium' },
    HARASSMENT: { id: 'harassment', labelKey: 'reportHarassment', icon: 'frown', severity: 'high' },
    HATE: { id: 'hate', labelKey: 'reportHate', icon: 'flame', severity: 'critical' },
    INAPPROPRIATE: { id: 'inappropriate', labelKey: 'reportInappropriate', icon: 'ban', severity: 'high' },
    OTHER: { id: 'other', labelKey: 'reportOther', icon: 'info', severity: 'low' },
  },
};

// Get translated label for report reason
function getReasonLabel(reason) {
  return t(reason.labelKey) || reason.labelKey;
}

// Severity levels
export const SEVERITY_LEVELS = {
  low: { color: 'text-slate-400', bg: 'bg-slate-500/20', priority: 1 },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/20', priority: 2 },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/20', priority: 3 },
  critical: { color: 'text-danger-400', bg: 'bg-danger-500/20', priority: 4 },
};

/**
 * Submit a report
 * @param {string} type - 'spot', 'user', or 'message'
 * @param {string} targetId - ID of the reported item
 * @param {string} reason - Report reason ID
 * @param {Object} details - Additional details
 */
export async function submitReport(type, targetId, reason, details = {}) {
  const state = getState();
  const userId = state.user?.uid || 'anonymous';

  // Check for duplicate reports
  const recentReports = state.userReports || [];
  const duplicateReport = recentReports.find(r =>
    r.type === type && r.targetId === targetId && r.reason === reason &&
    Date.now() - new Date(r.timestamp).getTime() < 24 * 60 * 60 * 1000 // 24 hours
  );

  if (duplicateReport) {
    showToast(t('reportAlreadyReported') || 'Tu as déjà signalé cet élément', 'warning');
    return false;
  }

  // Get report type info
  const reportTypeMap = {
    spot: REPORT_TYPES.SPOT,
    user: REPORT_TYPES.USER,
    message: REPORT_TYPES.MESSAGE,
  };
  const reasonInfo = reportTypeMap[type]?.[(reason || '').toUpperCase()] || { severity: 'low' };

  // Create report
  const report = {
    id: generateReportId(),
    type,
    targetId,
    reason,
    severity: reasonInfo.severity,
    details: {
      description: details.description || '',
      screenshots: details.screenshots || [],
      additionalInfo: details.additionalInfo || '',
    },
    reporter: {
      id: userId,
      username: state.username || 'Anonyme',
      trustScore: state.trustScore || 50,
    },
    status: 'pending',
    timestamp: new Date().toISOString(),
    votes: 1, // Reporter's vote
  };

  // Save report to state (in production, this would go to Firebase)
  const reports = state.reports || [];
  reports.push(report);

  // Track user's reports
  const userReports = state.userReports || [];
  userReports.push({
    type,
    targetId,
    reason,
    timestamp: report.timestamp,
  });

  setState({
    reports,
    userReports,
  });

  // Persist to Firebase (auth required)
  try {
    const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
    const { db, auth } = await import('./firebase.js')
    if (!auth.currentUser) throw new Error('Not authenticated')

    const firestoreReport = {
      type: type,
      targetId: targetId,
      reason: reason,
      severity: reasonInfo.severity,
      description: details.description || '',
      reporterId: userId,
      reporterName: state.username || 'Anonyme',
      status: 'pending',
      createdAt: serverTimestamp(),
    }

    // Include suggested coordinates for misplaced reports
    if (reason === 'misplaced' && details.suggestedLat && details.suggestedLng) {
      firestoreReport.suggestedLat = details.suggestedLat
      firestoreReport.suggestedLng = details.suggestedLng
    }

    await addDoc(collection(db, 'reports'), firestoreReport)

    // If spot report, increment report counter on the spot
    if (type === 'spot' || type === 'SPOT') {
      const { updateDoc, doc, increment } = await import('firebase/firestore')
      await updateDoc(doc(db, 'spots', targetId), {
        reports: increment(1),
      }).catch(() => {}) // Spot may not exist in Firestore (Hitchwiki import)
    }
  } catch (err) {
    console.error('Failed to persist report to Firebase:', err)
    // Don't block — local state is saved, Firebase is best-effort
  }

  // Apply automatic actions for high severity
  if (reasonInfo.severity === 'critical' || reasonInfo.severity === 'high') {
    await handleHighSeverityReport(report);
  }

  showToast(t('reportSubmitted') || 'Signalement envoyé. Merci pour ta vigilance !', 'success');

  return report;
}

/**
 * Handle high severity reports automatically
 */
async function handleHighSeverityReport(report) {
  const state = getState();

  if (report.type === 'spot') {
    // Mark spot as under review
    const spots = state.spots.map(s => {
      if (s.id.toString() === report.targetId.toString()) {
        return {
          ...s,
          underReview: true,
          reviewReason: report.reason,
        };
      }
      return s;
    });
    setState({ spots });
  }

}

/**
 * Vote on an existing report (community moderation)
 * @param {string} reportId - Report ID
 * @param {boolean} agree - Whether user agrees with the report
 */
export async function voteOnReport(reportId, agree) {
  const state = getState();
  const reports = state.reports || [];

  const reportIndex = reports.findIndex(r => r.id === reportId);
  if (reportIndex === -1) return false;

  const report = reports[reportIndex];

  // Check if user already voted
  const userId = state.user?.uid || 'anonymous';
  const voters = report.voters || [];

  if (voters.includes(userId)) {
    showToast(t('reportAlreadyVoted') || 'Tu as déjà voté sur ce signalement', 'warning');
    return false;
  }

  // Update vote count
  report.votes += agree ? 1 : -1;
  report.voters = [...voters, userId];

  // Check if report should be auto-resolved
  if (report.votes >= 5) {
    report.status = 'confirmed';
    await handleConfirmedReport(report);
  } else if (report.votes <= -3) {
    report.status = 'dismissed';
  }

  reports[reportIndex] = report;
  setState({ reports });

  showToast(agree ? (t('reportVoteRecorded') || 'Vote enregistré') : (t('reportThanks') || 'Merci pour ton avis'), 'success');

  return true;
}

/**
 * Handle confirmed report (enough community votes)
 */
async function handleConfirmedReport(report) {
  const state = getState();

  if (report.type === 'spot') {
    // Apply penalties based on reason
    const spots = state.spots.map(s => {
      if (s.id.toString() === report.targetId.toString()) {
        switch (report.reason) {
          case 'dangerous':
            return { ...s, verificationStatus: 'dangerous', hidden: true };
          case 'closed':
            return { ...s, status: 'closed', verificationStatus: 'needs_update' };
          case 'inappropriate':
            return { ...s, hidden: true };
          default:
            return { ...s, verificationStatus: 'disputed' };
        }
      }
      return s;
    });
    setState({ spots });
  }

  showToast(t('reportConfirmed') || 'Le signalement a été confirmé par la communauté', 'info');
}

/**
 * Get reports for an item
 */
export function getReportsForItem(type, targetId) {
  const state = getState();
  return (state.reports || []).filter(r =>
    r.type === type && r.targetId.toString() === targetId.toString()
  );
}

/**
 * Check if item is under review
 */
export function isUnderReview(type, targetId) {
  const reports = getReportsForItem(type, targetId);
  return reports.some(r => r.status === 'pending' && ['high', 'critical'].includes(r.severity));
}

/**
 * Generate unique report ID
 */
function generateReportId() {
  return `report_${Date.now()}_${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;
}

/**
 * Render report modal
 */
export function renderReportModal(state) {
  if (!state.showReport) return '';

  const { reportType } = state;
  const safeReportType = (reportType || 'spot').toUpperCase();
  const reportTypes = REPORT_TYPES[safeReportType] || REPORT_TYPES.SPOT;
  const isMisplaced = state.selectedReportReason === 'misplaced'

  return `
    <div
      class="report-modal fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center"
      onclick="if(event.target===this)closeReport()"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div class="modal-panel w-full sm:max-w-md max-h-[90vh] sm:rounded-2xl overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-orange-500 to-red-500 p-6">
          <div class="flex justify-between items-start">
            <div>
              <h2 id="report-modal-title" class="text-xl font-bold text-white">${t('reportTitle') || 'Signaler'}</h2>
              <p class="text-white/80 text-sm">${t('reportSubtitle') || 'Aide-nous à garder la communauté sûre'}</p>
            </div>
            <button onclick="closeReport()" class="p-2 bg-white/20 rounded-full text-white" aria-label="${t('close') || 'Fermer'}">
              ${icon('x', 'w-5 h-5')}
            </button>
          </div>
        </div>

        <!-- Report reasons -->
        <div class="p-4 overflow-y-auto max-h-[60vh]" id="report-scroll-area">
          <p class="text-sm text-slate-400 mb-4">${t('reportWhy') || 'Pourquoi signales-tu cet élément ?'}</p>

          <div class="space-y-2">
            ${Object.entries(reportTypes).map(([_key, reason]) => `
              <button
                onclick="selectReportReason('${reason.id}')"
                class="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left flex items-center gap-3 ${state.selectedReportReason === reason.id ? 'ring-2 ring-primary-500 bg-primary-500/10' : ''}"
              >
                <div class="w-10 h-10 rounded-xl ${SEVERITY_LEVELS[reason.severity].bg} flex items-center justify-center">
                  ${icon(reason.icon, `w-5 h-5 ${SEVERITY_LEVELS[reason.severity].color}`)}
                </div>
                <div class="flex-1">
                  <div class="font-medium">${getReasonLabel(reason)}</div>
                  <div class="text-xs ${SEVERITY_LEVELS[reason.severity].color}">
                    ${t('reportPriority') || 'Priorité'} ${reason.severity === 'low' ? (t('reportPriorityLow') || 'basse') : reason.severity === 'medium' ? (t('reportPriorityMedium') || 'moyenne') : (t('reportPriorityHigh') || 'haute')}
                  </div>
                </div>
                ${state.selectedReportReason === reason.id ? icon('check', 'w-5 h-5 text-primary-400') : ''}
              </button>
            `).join('')}
          </div>

          ${isMisplaced ? `
          <!-- Mini-map for misplaced reports -->
          <div class="mt-4" id="report-misplaced-wrapper">
            <label class="block text-sm text-slate-400 mb-2">${t('reportMisplacedHint') || 'Place le pin bleu au bon endroit'}</label>
            <div id="report-misplaced-map" style="width:100%;height:200px;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.1)"></div>
            <div id="report-misplaced-coords" class="text-xs text-slate-500 mt-1"></div>
          </div>
          ` : ''}

          ${state.selectedReportReason ? `
          <!-- Details textarea -->
          <div class="mt-4">
            <label class="block text-sm text-slate-400 mb-2">${t('reportDetailsLabel') || 'Détails supplémentaires (optionnel)'}</label>
            <textarea id="report-details" class="input-modern h-24 resize-none"
              placeholder="${t('reportDetailsPlaceholder') || 'Décris le problème en détail...'}"></textarea>
          </div>
          ` : ''}
        </div>

        <!-- Submit button -->
        <div class="p-4 border-t border-white/10">
          <button
            onclick="submitCurrentReport()"
            class="btn btn-danger w-full"
            ${!state.selectedReportReason ? 'disabled' : ''}
          >
            ${icon('flag', 'w-5 h-5 mr-2')}
            ${t('reportSubmitButton') || 'Envoyer le signalement'}
          </button>
          <p class="text-xs text-slate-400 text-center mt-2">
            ${t('reportWarning') || 'Les faux signalements peuvent entraîner des sanctions'}
          </p>
        </div>
      </div>
    </div>
  `;
}

// Global handlers
window.openReport = (type, targetId) => {
  setState({
    showReport: true,
    reportType: type,
    reportTargetId: targetId,
    selectedReportReason: null,
  });
};

window.closeReport = () => {
  _selectedReportReason = null
  _suggestedCoords = null
  _misplacedMarker = null
  if (_misplacedMapInstance) {
    _misplacedMapInstance.remove()
    _misplacedMapInstance = null
  }
  setState({
    showReport: false,
    reportType: null,
    reportTargetId: null,
    selectedReportReason: null,
  })
}

// Local state for report reason
let _selectedReportReason = null

window.selectReportReason = (reason) => {
  _selectedReportReason = reason
  // Destroy existing map instance before re-render
  if (_misplacedMapInstance) {
    _misplacedMapInstance.remove()
    _misplacedMapInstance = null
  }
  _misplacedMarker = null
  // setState triggers render → map container is in HTML when reason === 'misplaced'
  setState({ selectedReportReason: reason })

  // Initialize misplaced map after render
  if (reason === 'misplaced') {
    setTimeout(() => initMisplacedMap(), 150)
  }

  // Scroll to show the map/details
  setTimeout(() => {
    const scrollArea = document.getElementById('report-scroll-area')
    if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight
  }, 200)
}

// Mini-map for "misplaced" reports
let _misplacedMarker = null
let _suggestedCoords = null
let _misplacedMapInstance = null

async function initMisplacedMap() {
  const container = document.getElementById('report-misplaced-map')
  if (!container) return
  // Already initialized on this DOM element
  if (container.dataset.init) return
  container.dataset.init = '1'

  const maplibregl = (await import('maplibre-gl')).default

  // Verify container still exists after async import
  if (!document.getElementById('report-misplaced-map')) return

  // Get current spot coordinates
  const state = getState()
  const spot = state.selectedSpot
  const lat = spot?.coordinates?.lat || spot?.lat || 48.85
  const lng = spot?.coordinates?.lng || spot?.lon || 2.35

  _misplacedMapInstance = new maplibregl.Map({
    container,
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [lng, lat],
    zoom: 15,
    attributionControl: false,
  })

  // Show current spot position (red, fixed)
  const currentEl = document.createElement('div')
  currentEl.style.cssText = 'width:14px;height:14px;background:#ef4444;border:2px solid white;border-radius:50%;opacity:0.6'
  new maplibregl.Marker({ element: currentEl })
    .setLngLat([lng, lat])
    .addTo(_misplacedMapInstance)

  // Draggable blue marker for suggested position
  const suggestEl = document.createElement('div')
  suggestEl.style.cssText = 'width:20px;height:20px;background:#3b82f6;border:3px solid white;border-radius:50%;cursor:grab;box-shadow:0 2px 8px rgba(0,0,0,0.3)'
  _misplacedMarker = new maplibregl.Marker({ element: suggestEl, draggable: true })
    .setLngLat([lng + 0.001, lat + 0.001])
    .addTo(_misplacedMapInstance)

  _suggestedCoords = { lat: lat + 0.001, lng: lng + 0.001 }

  const updateCoords = (lat, lng) => {
    _suggestedCoords = { lat, lng }
    const coordsDiv = document.getElementById('report-misplaced-coords')
    if (coordsDiv) {
      coordsDiv.textContent = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
    }
  }

  _misplacedMarker.on('dragend', () => {
    const pos = _misplacedMarker.getLngLat()
    updateCoords(pos.lat, pos.lng)
  })

  // Also allow click on map to move marker
  _misplacedMapInstance.on('click', (e) => {
    _misplacedMarker.setLngLat([e.lngLat.lng, e.lngLat.lat])
    updateCoords(e.lngLat.lat, e.lngLat.lng)
  })
}

window.submitCurrentReport = async () => {
  const state = getState()
  const reason = _selectedReportReason || state.selectedReportReason
  const details = document.getElementById('report-details')?.value || ''

  if (!reason) {
    showToast(t('reportSelectReason') || 'Sélectionne une raison', 'error')
    return
  }

  const reportDetails = { description: details }

  // Include suggested coordinates for misplaced reports
  if (reason === 'misplaced' && _suggestedCoords) {
    reportDetails.suggestedLat = _suggestedCoords.lat
    reportDetails.suggestedLng = _suggestedCoords.lng
    reportDetails.additionalInfo = `Suggested location: ${_suggestedCoords.lat.toFixed(5)}, ${_suggestedCoords.lng.toFixed(5)}`
  }

  const result = await submitReport(
    state.reportType,
    state.reportTargetId,
    reason,
    reportDetails,
  )

  if (result) {
    _suggestedCoords = null
    _misplacedMarker = null
    window.closeReport()
  }
}

export default {
  REPORT_TYPES,
  SEVERITY_LEVELS,
  submitReport,
  voteOnReport,
  getReportsForItem,
  isUnderReview,
  renderReportModal,
};
