/**
 * Leaderboard Modal Component
 * Weekly and monthly rankings with country filter and monthly rewards
 */

import { getState, setState } from '../../stores/state.js';
import { t } from '../../i18n/index.js';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { getApps, getApp } from 'firebase/app';

// Cache leaderboard data to avoid excessive Firestore reads
let _cache = { data: null, tab: null, ts: 0 }
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function fetchLeaderboardData(tab) {
  // Return cache if fresh and same tab
  if (_cache.data && _cache.tab === tab && Date.now() - _cache.ts < CACHE_TTL) {
    return _cache.data
  }

  if (!getApps().length) return []

  try {
    const db = getFirestore(getApp())
    const sortField = tab === 'allTime' ? 'points' : 'seasonPoints'
    const q = query(collection(db, 'users'), orderBy(sortField, 'desc'), limit(20))
    const snap = await getDocs(q)

    const data = snap.docs
      .map((d, i) => {
        const p = d.data()
        return {
          id: i + 1,
          uid: d.id,
          username: p.username || p.displayName || (t('defaultDisplayName') || 'Hitchhiker'),
          avatar: p.avatar || '👍',
          points: tab === 'allTime' ? (p.points || 0) : (p.seasonPoints || 0),
          level: p.level || 1,
          country: p.country || '',
        }
      })
      .filter(u => u.points > 0)

    _cache = { data, tab, ts: Date.now() }
    return data
  } catch {
    return []
  }
}

const countryFlags = {
  FR: '🇫🇷', DE: '🇩🇪', NL: '🇳🇱', ES: '🇪🇸', IT: '🇮🇹',
  BE: '🇧🇪', PT: '🇵🇹', AT: '🇦🇹', CH: '🇨🇭', PL: '🇵🇱',
};

const countryNames = {
  FR: 'France', DE: 'Deutschland', NL: 'Nederland', ES: 'España', IT: 'Italia',
  BE: 'Belgique', PT: 'Portugal', AT: 'Österreich', CH: 'Schweiz', PL: 'Polska',
};

/**
 * Get unique countries from leaderboard data
 */
function getAvailableCountries(data) {
  const countries = new Set();
  for (const user of data) {
    if (user.country) countries.add(user.country);
  }
  return [...countries].sort();
}

/**
 * Render leaderboard modal
 */
export function renderLeaderboardModal() {
  const state = getState();
  const { showLeaderboard, leaderboardTab = 'weekly', leaderboardCountry = 'all' } = state;

  if (!showLeaderboard) return '';

  // leaderboardData: null = loading, [] = empty, [...] = loaded
  const rawData = state.leaderboardData ?? null;
  const isLoading = rawData === null;
  const filteredData = isLoading ? [] : (leaderboardCountry === 'all'
    ? rawData
    : rawData.filter(u => u.country === leaderboardCountry));

  const availableCountries = isLoading ? [] : getAvailableCountries(rawData);

  // Compute user's rank in current list
  const currentUid = state.currentUser?.uid
  const userRankIdx = filteredData.findIndex(u => u.uid === currentUid)
  const userRank = userRankIdx >= 0 ? userRankIdx + 1 : null

  const currentUser = {
    username: state.username || 'Vous',
    avatar: state.avatar || '👍',
    points: state.points || 0,
    level: state.level || 1,
    rank: userRank,
  };

  return `
    <div class="leaderboard-modal fixed inset-0 bg-black/80 z-50 flex items-end sm:items-center justify-center"
         onclick="if(event.target===this)closeLeaderboard()"
         role="dialog"
         aria-modal="true"
         aria-labelledby="leaderboard-title">
      <div class="modal-panel w-full sm:max-w-lg max-h-[90vh] sm:rounded-2xl overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="bg-gradient-to-r from-amber-500 to-orange-500 p-8">
          <div class="flex justify-between items-start">
            <div>
              <h2 id="leaderboard-title" class="text-2xl font-bold text-white">${t('leaderboardTitle') || 'Leaderboard'}</h2>
              <p class="text-white/80">${t('leaderboardSubtitle') || 'Top hitchhikers'}</p>
            </div>
            <button onclick="closeLeaderboard()"
                    class="p-2 bg-white/20 rounded-full text-white hover:bg-white/30"
                    type="button"
                    aria-label="${t('close') || 'Close'}">
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <!-- Your Rank Card -->
          <div class="mt-4 p-4 bg-white/20 rounded-xl backdrop-blur">
            <div class="flex items-center gap-4">
              <div class="text-4xl">${currentUser.avatar}</div>
              <div class="flex-1">
                <div class="font-bold text-white">${currentUser.username}</div>
                <div class="text-white/70 text-sm">${t('levelN') || 'Level'} ${currentUser.level} • ${currentUser.points.toLocaleString()} 👍</div>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold text-white">${currentUser.rank ? `#${currentUser.rank}` : '—'}</div>
                <div class="text-white/70 text-xs">${t('yourRank') || 'Your rank'}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-white/10">
          <button onclick="setLeaderboardTab('weekly')"
                  class="flex-1 py-3 text-sm font-medium transition-colors
                         ${leaderboardTab === 'weekly' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400 hover:text-slate-300'}">
            ${t('thisWeek') || 'This week'}
          </button>
          <button onclick="setLeaderboardTab('monthly')"
                  class="flex-1 py-3 text-sm font-medium transition-colors
                         ${leaderboardTab === 'monthly' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400 hover:text-slate-300'}">
            ${t('thisMonth') || 'This month'}
          </button>
          <button onclick="setLeaderboardTab('allTime')"
                  class="flex-1 py-3 text-sm font-medium transition-colors
                         ${leaderboardTab === 'allTime' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-400 hover:text-slate-300'}">
            ${t('allTimeTab') || 'All-time'}
          </button>
        </div>

        <!-- Country Filter -->
        <div class="px-5 pt-3 pb-1">
          <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button onclick="setLeaderboardCountry('all')"
                    type="button"
                    class="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer
                           ${leaderboardCountry === 'all' ? 'bg-amber-500 text-white' : 'bg-white/10 text-slate-400 hover:bg-white/20'}">
              🌍 ${t('allCountries') || 'All'}
            </button>
            ${availableCountries.map(code => `
              <button onclick="setLeaderboardCountry('${code}')"
                      type="button"
                      class="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer
                             ${leaderboardCountry === code ? 'bg-amber-500 text-white' : 'bg-white/10 text-slate-400 hover:bg-white/20'}">
                ${countryFlags[code] || '🌍'} ${countryNames[code] || code}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Monthly Rewards Banner -->
        ${leaderboardTab === 'monthly' ? `
        <div class="mx-5 mt-2 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <div class="text-xs font-bold text-amber-400 mb-2">${t('monthlyRewards') || 'Monthly rewards'}</div>
          <div class="flex justify-between text-[10px]">
            <span class="text-amber-300">🥇 ${t('monthlyRewardGold') || '1st: Gold + 500 👍'}</span>
          </div>
          <div class="flex justify-between text-[10px] mt-0.5">
            <span class="text-slate-300">🥈 ${t('monthlyRewardSilver') || '2nd: Silver + 300 👍'}</span>
          </div>
          <div class="flex justify-between text-[10px] mt-0.5">
            <span class="text-orange-300">🥉 ${t('monthlyRewardBronze') || '3rd: Bronze + 100 👍'}</span>
          </div>
        </div>
        ` : ''}

        <!-- Leaderboard List -->
        <div class="flex-1 overflow-y-auto">
          ${isLoading ? `
          <div class="flex justify-center items-center py-16">
            <div class="text-center">
              <div class="text-4xl mb-3 animate-bounce">🏆</div>
              <div class="text-slate-400 text-sm">${t('loading') || 'Chargement...'}</div>
            </div>
          </div>
          ` : filteredData.length > 0 ? `
          <!-- Top 3 Podium -->
          <div class="flex justify-center items-end gap-4 p-8 bg-gradient-to-b from-dark-secondary/50 to-transparent">
            ${renderPodiumPlace(filteredData[1], 2, leaderboardTab === 'monthly')}
            ${renderPodiumPlace(filteredData[0], 1, leaderboardTab === 'monthly')}
            ${renderPodiumPlace(filteredData[2], 3, leaderboardTab === 'monthly')}
          </div>

          <!-- Rest of Leaderboard -->
          <div class="px-5 pb-5 space-y-3">
            ${filteredData.slice(3).map((user, index) => renderLeaderboardRow(user, index + 4)).join('')}
          </div>
          ` : `
          <div class="text-center text-slate-400 py-12">
            <div class="text-4xl mb-3">🌍</div>
            <div>${t('leaderboardEmpty') || 'Sois le premier à apparaître ici !'}</div>
          </div>
          `}
        </div>

        <!-- Footer Stats -->
        <div class="p-5 border-t border-white/10 bg-dark-secondary/50">
          <div class="flex justify-around text-center">
            <div>
              <div class="text-2xl font-bold text-amber-400">${isLoading ? '...' : filteredData.reduce((sum, u) => sum + u.points, 0).toLocaleString()}</div>
              <div class="text-xs text-slate-400">${t('totalPoints') || 'Pouces totaux'}</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-emerald-400">${isLoading ? '...' : `${filteredData.length}`}</div>
              <div class="text-xs text-slate-400">${t('participants') || 'Participants'}</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-purple-400">${isLoading || filteredData.length === 0 ? '—' : Math.max(...filteredData.map(u => u.level))}</div>
              <div class="text-xs text-slate-400">${t('bestLevel') || 'Best level'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render podium place (top 3) with optional monthly reward indicator
 */
function renderPodiumPlace(user, position, showReward = false) {
  if (!user) return '';

  const podiumStyles = {
    1: { height: 'h-28', medal: '🥇', bg: 'from-amber-500/30 to-amber-600/30', border: 'border-amber-500/50' },
    2: { height: 'h-24', medal: '🥈', bg: 'from-slate-400/30 to-slate-500/30', border: 'border-slate-400/50' },
    3: { height: 'h-20', medal: '🥉', bg: 'from-orange-700/30 to-orange-800/30', border: 'border-orange-700/50' },
  };

  const rewardThumbs = { 1: 500, 2: 300, 3: 100 };

  const style = podiumStyles[position];

  return `
    <div class="flex flex-col items-center ${position === 1 ? 'order-2' : position === 2 ? 'order-1' : 'order-3'}">
      <div class="text-3xl mb-2">${user.avatar}</div>
      <div class="text-white font-medium text-sm truncate max-w-20">${user.username}</div>
      <div class="text-slate-400 text-xs">${user.points.toLocaleString()} 👍</div>
      ${showReward ? `<div class="text-amber-400 text-[10px] font-bold mt-0.5">+${rewardThumbs[position]} 👍</div>` : ''}
      <div class="mt-2 w-20 ${style.height} rounded-t-lg bg-gradient-to-b ${style.bg} border-2 ${style.border} flex items-start justify-center pt-2">
        <span class="text-2xl">${style.medal}</span>
      </div>
    </div>
  `;
}

/**
 * Render leaderboard row (4th place and below)
 */
function renderLeaderboardRow(user, rank) {
  return `
    <div class="flex items-center gap-3 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
      <div class="w-8 text-center font-bold ${rank <= 10 ? 'text-amber-400' : 'text-slate-400'}">
        ${rank}
      </div>
      <div class="text-2xl">${user.avatar}</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span class="text-white font-medium truncate">${user.username}</span>
          <span class="text-sm">${countryFlags[user.country] || '🌍'}</span>
        </div>
        <div class="text-slate-400 text-xs">${t('levelShort') || 'Lv.'} ${user.level}</div>
      </div>
      <div class="text-right">
        <div class="text-amber-400 font-bold">${user.points.toLocaleString()}</div>
        <div class="text-slate-400 text-xs">👍</div>
      </div>
    </div>
  `;
}

// Global handlers
window.openLeaderboard = () => {
  setState({ showLeaderboard: true, leaderboardData: null });
  const tab = getState().leaderboardTab || 'weekly';
  fetchLeaderboardData(tab).then(data => setState({ leaderboardData: data }));
};
window.closeLeaderboard = () => setState({ showLeaderboard: false });
window.setLeaderboardTab = (tab) => {
  setState({ leaderboardTab: tab, leaderboardData: null });
  fetchLeaderboardData(tab).then(data => setState({ leaderboardData: data }));
};
window.setLeaderboardCountry = (country) => setState({ leaderboardCountry: country });

export default {
  renderLeaderboardModal,
};
