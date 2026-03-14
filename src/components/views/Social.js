/**
 * Social View Component — SMS Style
 * 2 tabs: Messagerie | Événements
 * Orchestrator that delegates to sub-components
 */

import { t } from '../../i18n/index.js'
import { icon } from '../../utils/icons.js'
import { renderEmptyState } from '../EmptyState.js'
import { renderSearchInput } from '../../utils/searchInput.js'
// renderToggle removed — proximity radar is now "coming soon"
import { escapeHTML } from '../../utils/sanitize.js'
import { renderCustomSelect } from '../../utils/customSelect.js'
import { formatTime, formatRelativeTime, formatEventDate } from '../../utils/formatters.js'
import { renderConversations } from './social/Conversations.js'
import { renderSkeletonChatList } from '../ui/Skeleton.js'
import { getConversationsList } from '../../services/directMessages.js'
import { getUpcomingEvents, getEventComments, EVENT_TYPES } from '../../services/events.js'
import { getActivityFeed } from '../../services/activityFeed.js'

// Handler for feed visibility toggle (used in radar section onclick)
window.toggleFeedVisibility = async () => {
  const { getState, setState } = await import('../../stores/state.js')
  const { t } = await import('../../i18n/index.js')
  const state = getState()
  const newVal = !state.shareLocationWithFriends
  setState({ shareLocationWithFriends: newVal })
  window.showToast?.(
    newVal ? t('nowVisible') : t('nowInvisible'),
    'info'
  )
}

// ==================== MAIN RENDER ====================

export function renderSocial(state) {
  const mainTab = state.socialSubTab || 'messagerie'

  // Zone chat overlay (full-screen)
  if (state.showZoneChat) {
    return renderZoneChatOverlay(state)
  }

  // Event detail overlay
  if (state.selectedEvent) {
    return renderEventDetail(state, state.selectedEvent)
  }

  // Event create form
  if (state.showCreateEvent) {
    return renderCreateEventForm()
  }

  // Active DM or group conversation → full-screen chat
  if (state.activeDMConversation || state.activeGroupConversation) {
    return `
      <div class="flex flex-col h-[calc(100vh-140px)]">
        ${renderConversations(state)}
      </div>
    `
  }

  // Create group conversation form
  if (state.showCreateGroupConversation) {
    return `
      <div class="flex flex-col h-[calc(100vh-140px)]">
        ${renderConversations(state)}
      </div>
    `
  }

  // Companion search sub-view
  if (state.showCompanionSearch) {
    return `
      <div class="flex flex-col h-[calc(100vh-140px)]">
        ${renderSocialTabs(mainTab, state)}
        ${renderCompanionSearch(state)}
      </div>
    `
  }

  return `
    <div class="flex flex-col h-[calc(100vh-140px)]">
      ${renderSocialTabs(mainTab, state)}
      ${mainTab === 'evenements'
    ? renderEvenementsTab(state)
    : renderMessagerieTab(state)}
    </div>
  `
}

// ==================== TAB BAR ====================

function renderSocialTabs(activeTab, state) {
  const tabs = [
    {
      id: 'messagerie',
      icon: 'message-circle',
      label: t('socialMessaging') || 'Messagerie',
      badge: state.unreadDMCount || 0,
    },
    {
      id: 'evenements',
      icon: 'calendar',
      label: t('socialEvents') || 'Événements',
      badge: 0,
    },
  ]
  // Normalize legacy tab values
  const currentTab = (activeTab === 'conversations' || activeTab === 'friends' || activeTab === 'feed' || activeTab === 'companion')
    ? 'messagerie'
    : activeTab

  return `
    <div class="flex bg-dark-secondary/50 border-b border-white/5">
      ${tabs.map(tab => `
        <button
          onclick="setSocialTab('${tab.id}')"
          class="flex-1 py-3 px-2 font-medium text-sm transition-colors relative border-b-2 ${
      currentTab === tab.id
        ? 'border-primary-500 text-primary-400'
        : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
    }"
        >
          ${icon(tab.icon, 'w-4 h-4 mr-1 inline-block')}
          ${tab.label}
          ${tab.badge > 0 ? `
            <span class="absolute top-1 right-2 w-5 h-5 bg-danger-500 rounded-full text-xs flex items-center justify-center text-white">
              ${tab.badge}
            </span>
          ` : ''}
        </button>
      `).join('')}
    </div>
  `
}

// ==================== TAB 1: MESSAGERIE (SMS Style) ====================

function renderMessagerieTab(state) {
  const friends = state.friends || []
  const onlineFriends = friends.filter(f => f.online)
  const friendRequests = state.friendRequests || []
  const dmConversations = getConversationsList()
  const fbGroups = state.groupConversations || []

  // Build unified conversation list
  const allConversations = []
  dmConversations.forEach(conv => {
    allConversations.push({
      type: 'dm', id: conv.recipientId, name: conv.recipientName,
      avatar: conv.recipientAvatar || '🤙', lastMessage: conv.lastMessage,
      lastMessageTime: conv.lastMessageTime, unreadCount: conv.unreadCount,
      online: conv.online, isGroup: false,
    })
  })
  fbGroups.forEach(group => {
    allConversations.push({
      type: 'fbgroup', id: group.id, name: group.name,
      avatar: group.icon || '👥', lastMessage: group.lastMessage?.text || t('noMessagesYet'),
      lastMessageTime: group.updatedAt, unreadCount: 0,
      online: false, isGroup: true,
      memberCount: Array.isArray(group.members) ? group.members.length : 0,
    })
  })
  allConversations.sort((a, b) => {
    if (!a.lastMessageTime) return 1
    if (!b.lastMessageTime) return -1
    return new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
  })

  if (state.chatLoading) {
    return `<div class="flex-1 overflow-y-auto p-4 space-y-3">${renderSkeletonChatList(6)}</div>`
  }

  return `
    <div class="flex-1 overflow-y-auto relative">
      <!-- Search bar -->
      <div class="px-4 pt-3 pb-2">
        ${renderSearchInput({
          id: 'social-search',
          placeholder: t('searchConversations') || 'Rechercher...',
          ariaLabel: t('searchConversations') || 'Rechercher',
          inputClass: 'input-field w-full text-sm',
          paddingLeft: 'pl-10',
        })}
      </div>

      <!-- Online friends story circles -->
      ${onlineFriends.length > 0 || friends.length > 0 ? `
        <div class="flex gap-3 px-4 py-2 overflow-x-auto scrollbar-none">
          <!-- Add friend circle -->
          <button
            onclick="showAddFriend()"
            class="shrink-0 flex flex-col items-center gap-1"
          >
            <div class="w-14 h-14 rounded-full border-2 border-dashed border-slate-500 flex items-center justify-center">
              ${icon('user-plus', 'w-5 h-5 text-slate-400')}
            </div>
            <span class="text-[10px] text-slate-400 w-14 text-center truncate">${t('addFriend') || 'Ajouter'}</span>
          </button>
          ${friends.slice(0, 12).map(f => `
            <button
              onclick="openConversation('${f.id}')"
              class="shrink-0 flex flex-col items-center gap-1"
            >
              <div class="relative">
                <div class="w-14 h-14 rounded-full ${f.online ? 'bg-gradient-to-br from-primary-400 to-amber-500 p-[2px]' : 'bg-white/10 p-[2px]'}">
                  <div class="w-full h-full rounded-full bg-dark-primary flex items-center justify-center text-2xl">
                    ${f.avatar || '🤙'}
                  </div>
                </div>
                ${f.online ? `<span class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-dark-primary bg-emerald-500"></span>` : ''}
              </div>
              <span class="text-[10px] ${f.online ? 'text-white' : 'text-slate-400'} w-14 text-center truncate">${escapeHTML(f.name || '')}</span>
            </button>
          `).join('')}
        </div>
      ` : ''}

      <!-- Friend requests -->
      ${friendRequests.length > 0 ? `
        <div class="px-4 pb-2">
          <div class="card p-3 border-primary-500/30 bg-primary-500/5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                ${icon('user-plus', 'w-4 h-4 text-primary-400')}
                <span class="text-sm font-medium">${t('friendRequests')} (${friendRequests.length})</span>
              </div>
              <button onclick="showAddFriend()" class="text-xs text-primary-400">${t('viewAll') || 'Voir'}</button>
            </div>
            <div class="flex gap-2 mt-2 overflow-x-auto scrollbar-none">
              ${friendRequests.slice(0, 3).map(req => `
                <div class="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5">
                  <span class="text-lg">${req.avatar || '🤙'}</span>
                  <span class="text-xs font-medium truncate max-w-[80px]">${escapeHTML(req.name || '')}</span>
                  <button onclick="acceptFriendRequest('${req.id}')" class="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center" aria-label="${t('accept')}">
                    ${icon('check', 'w-3 h-3')}
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Zone chat rooms card -->
      <div class="px-4 pb-2">
        <button
          onclick="openZoneChat()"
          class="card p-3 w-full text-left bg-gradient-to-r from-primary-500/10 to-amber-500/10 border-primary-500/20 hover:border-primary-500/40 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-lg">
              💬
            </div>
            <div class="flex-1">
              <div class="font-medium text-sm">${t('zoneChatRooms')}</div>
              <div class="text-xs text-slate-400">${t('zoneChatRoomsDesc')}</div>
            </div>
            ${icon('chevron-right', 'w-4 h-4 text-slate-400')}
          </div>
        </button>
      </div>

      <!-- Companion travel search card -->
      <div class="px-4 pb-2">
        <button
          onclick="showCompanionSearchView()"
          class="card p-3 w-full text-left bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-lg">
              🤝
            </div>
            <div class="flex-1">
              <div class="font-medium text-sm">${t('lookingForCompanion')}</div>
              <div class="text-xs text-slate-400">${t('companionDesc')}</div>
            </div>
            ${icon('chevron-right', 'w-4 h-4 text-slate-400')}
          </div>
        </button>
      </div>

      <!-- Conversation list -->
      ${allConversations.length > 0 ? `
        <div class="px-4 pb-1">
          <h4 class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">${t('socialConversations') || 'Messages'}</h4>
        </div>
        ${allConversations.map(conv => `
          <button
            onclick="${conv.type === 'fbgroup' ? `openGroupConversation('${conv.id}')` : `openConversation('${conv.id}')`}"
            class="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-white/5"
          >
            <div class="relative shrink-0">
              <span class="text-3xl">${conv.avatar}</span>
              ${conv.isGroup ? `
                <span class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${conv.type === 'fbgroup' ? 'bg-emerald-500/80' : 'bg-purple-500/80'} text-white text-[10px] flex items-center justify-center">${conv.memberCount}</span>
              ` : conv.online ? `
                <span class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-dark-primary bg-emerald-500"></span>
              ` : ''}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <span class="font-medium text-sm truncate">${escapeHTML(conv.name)}</span>
                  ${conv.isGroup ? `<span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">${t('group')}</span>` : ''}
                </div>
                <time class="text-xs text-slate-400 shrink-0 ml-2">${formatRelativeTime(conv.lastMessageTime)}</time>
              </div>
              <div class="flex items-center justify-between mt-0.5">
                <p class="text-xs text-slate-400 truncate">${escapeHTML(conv.lastMessage || '')}</p>
                ${conv.unreadCount > 0 ? `
                  <span class="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center shrink-0 ml-2">${conv.unreadCount}</span>
                ` : ''}
              </div>
            </div>
          </button>
        `).join('')}
      ` : ''}

      <!-- Create group button -->
      <div class="px-4 py-3">
        <button
          onclick="openCreateGroupConversation()"
          class="card p-3 w-full text-left border border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center">
              ${icon('users', 'w-5 h-5 text-emerald-400')}
            </div>
            <div class="text-sm text-slate-300">${t('newGroupConversation')}</div>
          </div>
        </button>
      </div>

      ${allConversations.length === 0 && friends.length === 0 ? renderEmptyState('conversations') : ''}

      <!-- FAB: New message -->
      <button
        onclick="showAddFriend()"
        class="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/30 flex items-center justify-center hover:bg-primary-600 hover:scale-110 transition-colors z-30"
        aria-label="${t('newMessage') || 'Nouveau message'}"
      >
        ${icon('plus', 'w-6 h-6')}
      </button>
    </div>
  `
}

// ==================== TAB 2: ÉVÉNEMENTS ====================

function renderEvenementsTab(state) {
  const eventFilter = state.eventFilter || 'all'
  const allEvents = getUpcomingEvents()
  const userId = state.user?.uid || 'local-user'
  // Filter events
  let filteredEvents = allEvents
  if (eventFilter === 'mine') {
    filteredEvents = allEvents.filter(e => e.participants?.includes(userId) || e.creatorId === userId)
  }

  // Activity feed (for the feed items mixed in)
  const activities = getActivityFeed('all').slice(0, 5)

  return `
    <div class="flex-1 overflow-y-auto relative">
      <!-- Proximity Radar — coming soon -->
      <div class="mx-4 mt-3 mb-2">
        <button onclick="openComingSoonRadar()" class="card p-3 border-white/10 opacity-75 w-full text-left">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                ${icon('radar', 'w-5 h-5 text-slate-400')}
              </div>
              <div>
                <div class="text-sm font-medium">${t('proximityRadar')}</div>
                <div class="text-xs text-slate-400">${t('comingSoon') || 'Bientot disponible'}</div>
              </div>
            </div>
            <span class="text-xs text-amber-400">${icon('chevron-right', 'w-4 h-4')}</span>
          </div>
        </button>
      </div>

      <!-- Filter pills -->
      <div class="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-none">
        ${renderEventFilter('all', eventFilter, t('feedAll') || 'Tous')}
        ${renderEventFilter('nearby', eventFilter, t('feedNearby') || 'Près de moi')}
        ${renderEventFilter('mine', eventFilter, t('myEvents') || 'Mes événements')}
      </div>

      <!-- Events list -->
      <div class="px-4 py-2 space-y-3">
        ${filteredEvents.length > 0 ? filteredEvents.map(event => renderEventCard(event, state)).join('') : ''}

        ${activities.length > 0 && eventFilter === 'all' ? `
          <div class="pt-2">
            <h4 class="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">${t('recentActivity') || 'Activité récente'}</h4>
            ${activities.map(activity => renderActivityCard(activity)).join('')}
          </div>
        ` : ''}

        ${filteredEvents.length === 0 && (eventFilter !== 'all' || activities.length === 0) ? renderEmptyState('events') : ''}
      </div>

      <!-- FAB: Create event -->
      <button
        onclick="openCreateEvent()"
        class="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/30 flex items-center justify-center hover:bg-primary-600 hover:scale-110 transition-colors z-30"
        aria-label="${t('createEvent') || 'Créer un événement'}"
      >
        ${icon('calendar-plus', 'w-6 h-6')}
      </button>
    </div>
  `
}

function renderEventFilter(id, active, label) {
  return `
    <button
      onclick="setEventFilter('${id}')"
      class="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
    active === id
      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
      : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'
  }"
    >
      ${label}
    </button>
  `
}

function renderEventCard(event, state) {
  const typeInfo = EVENT_TYPES[event.type] || EVENT_TYPES.meetup
  const participantCount = event.participants?.length || 0
  const userId = state.user?.uid || 'local-user'
  const isParticipant = event.participants?.includes(userId)

  return `
    <button
      onclick="openEventDetail('${event.id}')"
      class="card p-4 w-full text-left hover:border-primary-500/50 transition-colors"
    >
      <div class="flex items-start gap-3">
        <div class="w-12 h-12 rounded-xl ${typeInfo.bg} flex items-center justify-center shrink-0">
          <span class="text-2xl">${typeInfo.icon}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <div class="font-bold text-sm truncate">${escapeHTML(event.title || '')}</div>
            ${isParticipant ? `<span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs shrink-0">${t('joined')}</span>` : ''}
          </div>
          <div class="text-xs text-slate-400">
            ${icon('calendar', 'w-3 h-3 inline-block mr-1')}
            ${formatEventDate(event.date)}${event.time ? ` ${t('at')} ${event.time}` : ''}
          </div>
          ${event.location ? `
            <div class="text-xs text-slate-400 mt-0.5">
              ${icon('map-pin', 'w-3 h-3 inline-block mr-1')}
              ${escapeHTML(event.location)}
            </div>
          ` : ''}
          <div class="flex items-center gap-3 mt-1.5">
            <span class="text-xs text-slate-400">
              ${icon('users', 'w-3 h-3 inline-block mr-1')}
              ${participantCount} ${t('participants')}
            </span>
          </div>
        </div>
      </div>
    </button>
  `
}

function renderActivityCard(activity) {
  const typeConfig = {
    new_spot: { icon: 'map-pin', color: 'text-primary-400', bg: 'bg-primary-500/10' },
    review: { icon: 'star', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    badge: { icon: 'award', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    checkin: { icon: 'map-pin', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    friend_joined: { icon: 'user-plus', color: 'text-primary-400', bg: 'bg-primary-500/10' },
  }
  const cfg = typeConfig[activity.type] || typeConfig.checkin

  return `
    <div class="card p-3 mb-2">
      <div class="flex items-start gap-3">
        <div class="w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center shrink-0">
          ${activity.userAvatar ? `<span class="text-base">${activity.userAvatar}</span>` : icon(cfg.icon, `w-4 h-4 ${cfg.color}`)}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm">
            <span class="font-medium">${escapeHTML(activity.userName || t('traveler'))}</span>
            <span class="text-slate-400"> ${escapeHTML(activity.description || '')}</span>
          </p>
          <time class="text-xs text-slate-400 mt-0.5 block">${formatRelativeTime(activity.timestamp)}</time>
        </div>
      </div>
    </div>
  `
}

// ==================== ZONE CHAT OVERLAY ====================

function renderZoneChatOverlay(state) {
  const rooms = [
    { id: 'general', name: t('general'), icon: '💬' },
    { id: 'europe', name: t('europe'), icon: '🇪🇺' },
    { id: 'help', name: t('help'), icon: '❓' },
    { id: 'meetups', name: t('meetups'), icon: '🤝' },
    { id: 'routes', name: t('routes'), icon: '🛣️' },
  ]

  const currentRoom = state.chatRoom || 'general'
  const messages = (state.messages || []).filter(m => !m.room || m.room === currentRoom)

  return `
    <div class="flex flex-col h-[calc(100vh-140px)]">
      <div class="p-3 bg-dark-secondary/50 flex items-center gap-3">
        <button onclick="closeZoneChat()" class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white" aria-label="${t('back')}">
          ${icon('arrow-left', 'w-5 h-5')}
        </button>
        <div class="flex-1">
          <div class="font-medium text-sm">${t('zoneChatRooms')}</div>
        </div>
      </div>

      <div class="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-none">
        ${rooms.map(room => `
          <button
            onclick="setChatRoom('${room.id}')"
            class="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
      currentRoom === room.id
        ? 'bg-primary-500 text-white'
        : 'bg-white/5 text-slate-400 hover:bg-white/10'
    }"
          >
            <span>${room.icon}</span> ${room.name}
          </button>
        `).join('')}
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-3" id="chat-messages" role="log" aria-live="polite">
        ${state.chatLoading
    ? renderSkeletonChatList(6)
    : messages.length > 0
      ? messages.slice(-50).map(msg => renderZoneMessage(msg, state)).join('')
      : renderEmptyState('chat', { compact: true })}
      </div>

      <div class="p-3 glass-dark">
        <form class="flex gap-2" onsubmit="event.preventDefault(); sendMessage('${currentRoom}');">
          <input
            type="text"
            class="input-field flex-1"
            placeholder="${t('typeMessage')}"
            id="chat-input"
            autocomplete="off"
            aria-label="${t('typeMessage')}"
          />
          <button type="submit" class="btn-primary px-4" aria-label="${t('send')}">
            ${icon('send', 'w-5 h-5')}
          </button>
        </form>
      </div>
    </div>
  `
}

function renderZoneMessage(msg, state) {
  const isSent = msg.userId === (state.user?.uid || 'local-user')
  return `
    <div class="flex ${isSent ? 'justify-end' : 'justify-start'}">
      <div class="max-w-[80%] ${isSent ? 'bg-primary-500/20' : 'bg-white/5'} rounded-2xl px-4 py-2 ${isSent ? 'rounded-br-md' : 'rounded-bl-md'}">
        ${!isSent ? `
          <div class="flex items-center gap-2 mb-1">
            <span class="text-sm">${escapeHTML(msg.userAvatar || '🤙')}</span>
            <span class="text-xs font-medium text-primary-400">${escapeHTML(msg.userName || '')}</span>
          </div>
        ` : ''}
        <p class="text-sm text-white">${escapeHTML(msg.text || '')}</p>
        <time class="text-xs text-slate-400 mt-1 block ${isSent ? 'text-right' : ''}">
          ${formatTime(msg.createdAt)}
        </time>
      </div>
    </div>
  `
}

// ==================== COMPANION SEARCH ====================

function renderCompanionSearch(state) {
  return `
    <div class="flex-1 overflow-y-auto p-5 space-y-5">
      <button onclick="closeCompanionSearch()" class="flex items-center gap-2 text-sm text-slate-400 hover:text-white">
        ${icon('arrow-left', 'w-4 h-4')} ${t('back')}
      </button>

      <div class="card p-5 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
        <h3 class="font-bold mb-3 flex items-center gap-2">
          ${icon('compass', 'w-5 h-5 text-emerald-400')}
          ${t('lookingForCompanion')}
        </h3>
        <p class="text-sm text-slate-400 mb-4">${t('companionDesc')}</p>
        <div class="space-y-4">
          <!-- From / To -->
          <div class="flex gap-2">
            <div class="flex-1">
              <label class="text-xs text-slate-400 mb-1 block">${t('companionFrom') || 'Départ'} *</label>
              <input type="text" id="companion-from" class="input-field w-full" placeholder="${t('companionFromPlaceholder') || 'Ville de départ'}" />
            </div>
            <div class="flex-1">
              <label class="text-xs text-slate-400 mb-1 block">${t('companionTo') || 'Arrivée'} *</label>
              <input type="text" id="companion-to" class="input-field w-full" placeholder="${t('companionToPlaceholder') || 'Destination'}" />
            </div>
          </div>
          <!-- Date -->
          <div>
            <label class="text-xs text-slate-400 mb-1 block">${t('companionDepartureDate') || 'Date de départ'}</label>
            <input type="date" id="companion-date" class="input-field w-full" min="${new Date().toISOString().split('T')[0]}" />
          </div>
          <!-- Duration + People -->
          <div class="flex gap-2">
            ${renderCustomSelect({
              id: 'companion-duration',
              label: t('companionDuration') || 'Durée',
              value: 'flexible',
              className: 'flex-1',
              options: [
                { value: 'flexible', text: t('companionDurationFlexible') || 'On verra \u{1F937}' },
                { value: '1d', text: `1 ${t('day') || 'jour'}` },
                { value: '2d', text: `2 ${t('days') || 'jours'}` },
                { value: '3d', text: `3 ${t('days') || 'jours'}` },
                { value: '1w', text: `1 ${t('week') || 'semaine'}` },
                { value: '2w', text: `2 ${t('weeks') || 'semaines'}` },
                { value: '1m', text: `1 ${t('month') || 'mois'}` },
                { value: '2m', text: `2+ ${t('months') || 'mois'}` },
              ],
            })}
            ${renderCustomSelect({
              id: 'companion-people',
              label: t('companionPeopleLabel') || 'Nombre de personnes',
              value: 'any',
              className: 'flex-1',
              options: [
                { value: 'any', text: t('companionPeopleAny') || 'Peu importe' },
                { value: '1', text: `1 ${t('person') || 'personne'}` },
                { value: '2', text: `2 ${t('people') || 'personnes'}` },
                { value: '3', text: `3 ${t('people') || 'personnes'}` },
              ],
            })}
          </div>
          <!-- Gender -->
          ${renderCustomSelect({
            id: 'companion-gender',
            label: t('companionGenderLabel') || 'Genre préféré',
            value: 'any',
            options: [
              { value: 'any', text: t('companionGenderAny') || 'Peu importe' },
              { value: 'female', text: t('companionGenderFemale') || 'Femme' },
              { value: 'male', text: t('companionGenderMale') || 'Homme' },
            ],
          })}
          <!-- Description -->
          <div>
            <label class="text-xs text-slate-400 mb-1 block">${t('companionDescLabel') || 'Description'}</label>
            <textarea id="companion-desc" class="input-field w-full" rows="2"
              placeholder="${t('companionDescPlaceholder') || 'Décris ton voyage, ce que tu recherches...'}"
              maxlength="300"></textarea>
          </div>
          <!-- Publish -->
          <button onclick="postCompanionRequest()" class="btn-primary w-full py-3">
            ${icon('send', 'w-5 h-5 mr-1')}
            ${t('publish')}
          </button>
        </div>
      </div>

      ${renderCompanionRequests(state)}
    </div>
  `
}

function renderCompanionRequests(state) {
  const requests = state.companionRequests || []
  if (requests.length === 0) {
    return renderEmptyState('companion', { compact: true })
  }

  const durationLabels = {
    flexible: t('companionDurationFlexible') || 'On verra \u{1F937}',
    '1d': `1 ${t('day') || 'jour'}`, '2d': `2 ${t('days') || 'jours'}`, '3d': `3 ${t('days') || 'jours'}`,
    '1w': `1 ${t('week') || 'semaine'}`, '2w': `2 ${t('weeks') || 'semaines'}`,
    '1m': `1 ${t('month') || 'mois'}`, '2m': `2+ ${t('months') || 'mois'}`,
  }
  const genderLabels = {
    female: t('companionGenderFemale') || 'Femme',
    male: t('companionGenderMale') || 'Homme',
    any: t('companionGenderAny') || 'Peu importe',
  }

  return `
    <div class="space-y-3">
      <h4 class="font-bold text-sm text-slate-400">${t('activeRequests')}</h4>
      ${requests.map(req => `
        <div class="card p-4">
          <!-- Profile header (clickable) -->
          <button onclick="showFriendProfile('${escapeHTML(req.userId)}')" class="flex items-center gap-3 mb-3 w-full text-left">
            <span class="text-2xl">${req.avatar || '🤙'}</span>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm truncate">${escapeHTML(req.name || '')}</div>
              <div class="text-xs text-slate-400">${formatRelativeTime(req.createdAt)}</div>
            </div>
            ${icon('chevron-right', 'w-4 h-4 text-slate-500')}
          </button>
          <!-- Route -->
          <div class="flex items-center gap-2 text-sm">
            ${icon('map-pin', 'w-4 h-4 text-primary-400')}
            <span class="text-slate-300 font-medium">${escapeHTML(req.from || '')} → ${escapeHTML(req.to || '')}</span>
          </div>
          <!-- Details row -->
          <div class="flex flex-wrap gap-2 mt-2">
            ${req.date ? `
              <span class="inline-flex items-center gap-1 text-xs bg-white/5 px-2 py-1 rounded-lg">
                ${icon('calendar', 'w-3.5 h-3.5 text-amber-400')}
                ${formatEventDate(req.date)}
              </span>
            ` : ''}
            ${req.duration ? `
              <span class="inline-flex items-center gap-1 text-xs bg-white/5 px-2 py-1 rounded-lg">
                ${icon('clock', 'w-3.5 h-3.5 text-blue-400')}
                ${durationLabels[req.duration] || req.duration}
              </span>
            ` : ''}
            ${req.people && req.people !== 'any' ? `
              <span class="inline-flex items-center gap-1 text-xs bg-white/5 px-2 py-1 rounded-lg">
                ${icon('users', 'w-3.5 h-3.5 text-emerald-400')}
                ${req.people} ${Number(req.people) > 1 ? (t('people') || 'pers.') : (t('person') || 'pers.')}
              </span>
            ` : ''}
            ${req.gender && req.gender !== 'any' ? `
              <span class="inline-flex items-center gap-1 text-xs bg-white/5 px-2 py-1 rounded-lg">
                ${icon('user', 'w-3.5 h-3.5 text-purple-400')}
                ${genderLabels[req.gender] || req.gender}
              </span>
            ` : ''}
          </div>
          <!-- Description -->
          ${req.description ? `
            <p class="text-sm text-slate-400 mt-2">${escapeHTML(req.description)}</p>
          ` : ''}
          <!-- Contact button -->
          <button onclick="openConversation('${escapeHTML(req.userId)}')" class="mt-3 w-full btn-primary text-sm py-2">
            ${icon('message-circle', 'w-4 h-4 mr-1')}
            ${t('contactTraveler')}
          </button>
        </div>
      `).join('')}
    </div>
  `
}

// ==================== EVENT DETAIL (overlay) ====================

function renderEventDetail(state, event) {
  const typeInfo = EVENT_TYPES[event.type] || EVENT_TYPES.meetup
  const userId = state.user?.uid || 'local-user'
  const isParticipant = event.participants?.includes(userId)
  const isCreator = event.creatorId === userId
  const participantCount = event.participants?.length || 0
  const comments = getEventComments(event.id)
  const topComments = comments.filter(c => !c.replyToId)
  const replies = comments.filter(c => c.replyToId)

  return `
    <div class="flex flex-col h-[calc(100vh-140px)]">
      <div class="flex-1 overflow-y-auto">
        <div class="p-3 bg-dark-secondary/50 flex items-center gap-3">
          <button onclick="closeEventDetail()" class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white" aria-label="${t('back')}">
            ${icon('arrow-left', 'w-5 h-5')}
          </button>
          <div class="flex-1"><div class="font-medium text-sm">${t('eventDetail')}</div></div>
          <button onclick="shareEvent('${event.id}')" class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white" aria-label="${t('share')}">
            ${icon('share-2', 'w-5 h-5')}
          </button>
          ${isCreator ? `
            <button onclick="deleteEventAction('${event.id}')" class="w-9 h-9 rounded-full bg-danger-500/10 flex items-center justify-center text-danger-400 hover:bg-danger-500/20" aria-label="${t('deleteEvent')}">
              ${icon('trash', 'w-5 h-5')}
            </button>
          ` : ''}
        </div>

        <div class="p-5 space-y-4 overflow-x-hidden">
          <div class="card p-5">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-14 h-14 rounded-xl ${typeInfo.bg} flex items-center justify-center">
                <span class="text-3xl">${typeInfo.icon}</span>
              </div>
              <div class="flex-1">
                <h2 class="text-lg font-bold">${escapeHTML(event.title || '')}</h2>
                <div class="text-sm ${typeInfo.color}">${t('eventType_' + event.type) || event.type}</div>
              </div>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex items-center gap-2 text-slate-300">${icon('calendar', 'w-5 h-5 text-slate-400')} ${formatEventDate(event.date)}${event.time ? ` ${t('at')} ${event.time}` : ''}</div>
              ${event.location ? `<div class="flex items-center gap-2 text-slate-300">${icon('map-pin', 'w-5 h-5 text-slate-400')} ${escapeHTML(event.location)}</div>` : ''}
              <div class="flex items-center gap-2 text-slate-300">${icon('users', 'w-5 h-5 text-slate-400')} ${participantCount} ${t('participants')}</div>
              <div class="flex items-center gap-2 text-slate-300">${icon('user', 'w-5 h-5 text-slate-400')} ${t('createdBy')} ${event.creatorAvatar || '🤙'} ${escapeHTML(event.creatorName || '')}</div>
            </div>
            ${event.description ? `<div class="mt-3 pt-3 border-t border-white/10"><p class="text-sm text-slate-300">${escapeHTML(event.description)}</p></div>` : ''}
          </div>

          <div>
            ${isParticipant && !isCreator ? `
              <button onclick="leaveEvent('${event.id}')" class="w-full py-3 rounded-xl bg-danger-500/20 text-danger-400 font-medium hover:bg-danger-500/30 transition-colors">
                ${icon('log-out', 'w-5 h-5 mr-2')} ${t('leaveEvent')}
              </button>
            ` : !isParticipant ? `
              <button onclick="joinEvent('${event.id}')" class="w-full py-3 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors">
                ${icon('user-plus', 'w-5 h-5 mr-2')} ${t('joinEvent')}
              </button>
            ` : `
              <div class="w-full py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-medium text-center">
                ${icon('check', 'w-5 h-5 mr-2')} ${t('youAreOrganizer')}
              </div>
            `}
          </div>

          <div class="card p-5">
            <h3 class="font-bold text-sm mb-4 flex items-center gap-2">
              ${icon('messages-square', 'w-5 h-5 text-primary-400')}
              ${t('commentWall')} (${comments.length})
            </h3>
            <div class="flex gap-2 mb-4">
              <input type="text" class="input-field flex-1" placeholder="${t('writeComment')}" id="event-comment-input" autocomplete="off" onkeydown="if(event.key==='Enter') postEventComment('${event.id}')" />
              <button onclick="postEventComment('${event.id}')" class="btn-primary px-4" aria-label="${t('send')}">
                ${icon('send', 'w-5 h-5')}
              </button>
            </div>
            <div class="space-y-3">
              ${topComments.length > 0
    ? topComments.map(c => renderEventComment(c, replies, event.id, userId)).join('')
    : `<p class="text-slate-400 text-sm text-center py-4">${t('noCommentsYet')}</p>`}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

function renderEventComment(comment, allReplies, eventId, userId) {
  const isAuthor = comment.userId === userId
  const commentReplies = allReplies.filter(r => r.replyToId === comment.id)
  const reactionEmojis = ['👍', '❤️', '😂', '🤙']

  const reactionDisplay = Object.entries(comment.reactions || {})
    .filter(([, users]) => users.length > 0)
    .map(([emoji, users]) => `
      <button onclick="reactToEventComment('${eventId}', '${comment.id}', '${emoji}')" class="px-2 py-0.5 rounded-full text-xs ${users.includes(userId) ? 'bg-primary-500/30 text-primary-300' : 'bg-white/10 text-slate-400'} hover:bg-white/20 transition-colors">
        ${emoji} ${users.length}
      </button>
    `).join('')

  return `
    <div class="bg-white/5 rounded-xl p-3">
      <div class="flex items-start gap-2">
        <span class="text-xl shrink-0">${comment.userAvatar || '🤙'}</span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-medium text-sm">${escapeHTML(comment.userName || '')}</span>
            <time class="text-xs text-slate-400">${formatRelativeTime(comment.createdAt)}</time>
            ${isAuthor ? `
              <button onclick="deleteEventCommentAction('${eventId}', '${comment.id}')" class="text-xs text-slate-400 hover:text-danger-400 ml-auto" aria-label="${t('deleteComment')}">
                ${icon('trash', 'w-4 h-4')}
              </button>
            ` : ''}
          </div>
          <p class="text-sm text-slate-300 mt-1">${escapeHTML(comment.text || '')}</p>
          <div class="flex items-center gap-1 mt-2 flex-wrap">
            ${reactionDisplay}
            ${reactionEmojis.map(emoji => `
              <button onclick="reactToEventComment('${eventId}', '${comment.id}', '${emoji}')" class="px-1.5 py-0.5 rounded-full text-xs bg-white/5 text-slate-400 hover:bg-white/10 transition-colors" title="${emoji}">
                ${emoji}
              </button>
            `).join('')}
            <button onclick="toggleReplyInput('${comment.id}')" class="px-2 py-0.5 rounded-full text-xs bg-white/5 text-slate-400 hover:bg-white/10 transition-colors ml-1">
              ${icon('reply', 'w-4 h-4 mr-1')} ${t('reply')}
            </button>
          </div>
          ${commentReplies.length > 0 ? `
            <div class="mt-2 pl-3 border-l-2 border-white/10 space-y-2">
              ${commentReplies.map(reply => `
                <div class="flex items-start gap-2">
                  <span class="text-sm shrink-0">${reply.userAvatar || '🤙'}</span>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-xs">${escapeHTML(reply.userName || '')}</span>
                      <time class="text-xs text-slate-400">${formatRelativeTime(reply.createdAt)}</time>
                    </div>
                    <p class="text-xs text-slate-300 mt-0.5">${escapeHTML(reply.text || '')}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
          <div id="reply-section-${comment.id}" class="hidden mt-2">
            <div class="flex gap-2">
              <input type="text" class="input-field flex-1 text-sm" placeholder="${t('writeReply')}" id="reply-input-${comment.id}" onkeydown="if(event.key==='Enter') replyEventComment('${eventId}', '${comment.id}')" />
              <button onclick="replyEventComment('${eventId}', '${comment.id}')" class="btn-primary px-3 text-sm" aria-label="${t('send')}">
                ${icon('reply', 'w-4 h-4')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

function renderCreateEventForm() {
  const today = new Date().toISOString().split('T')[0]

  return `
    <div class="flex flex-col h-[calc(100vh-140px)]">
      <div class="flex-1 overflow-y-auto p-5 space-y-4">
        <div class="flex items-center gap-3 mb-2">
          <button onclick="closeCreateEvent()" class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white" aria-label="${t('back')}">
            ${icon('arrow-left', 'w-5 h-5')}
          </button>
          <h2 class="text-lg font-bold flex items-center gap-2">
            ${icon('calendar-plus', 'w-5 h-5 text-primary-400')}
            ${t('createEvent')}
          </h2>
        </div>
        <div class="space-y-4">
          <div>
            <label class="text-sm text-slate-400 mb-1 block">${t('eventTitle')} *</label>
            <input type="text" id="event-title" class="input-field w-full" placeholder="${t('eventTitlePlaceholder')}" maxlength="80" />
          </div>
          <div>
            <label class="text-sm text-slate-400 mb-1 block">${t('eventType')} *</label>
            <select id="event-type" class="input-field w-full">
              <option value="meetup">${EVENT_TYPES.meetup.icon} ${t('eventType_meetup')}</option>
              <option value="group_departure">${EVENT_TYPES.group_departure.icon} ${t('eventType_group_departure')}</option>
              <option value="hostel_party">${EVENT_TYPES.hostel_party.icon} ${t('eventType_hostel_party')}</option>
              <option value="tips_exchange">${EVENT_TYPES.tips_exchange.icon} ${t('eventType_tips_exchange')}</option>
            </select>
          </div>
          <div>
            <label class="text-sm text-slate-400 mb-1 block">${t('eventLocation')}</label>
            <input type="text" id="event-location" class="input-field w-full" placeholder="${t('eventLocationPlaceholder')}" />
          </div>
          <div class="flex gap-3">
            <div class="flex-1">
              <label class="text-sm text-slate-400 mb-1 block">${t('eventDate')} *</label>
              <input type="date" id="event-date" class="input-field w-full" min="${today}" />
            </div>
            <div class="flex-1">
              <label class="text-sm text-slate-400 mb-1 block">${t('eventTime')}</label>
              <input type="time" id="event-time" class="input-field w-full" />
            </div>
          </div>
          <div>
            <label class="text-sm text-slate-400 mb-1 block">${t('eventDescription')}</label>
            <textarea id="event-description" class="input-field w-full h-24 resize-none" placeholder="${t('eventDescriptionPlaceholder')}" maxlength="500"></textarea>
          </div>
          <button onclick="submitCreateEvent()" class="w-full py-3 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors">
            ${icon('calendar-plus', 'w-5 h-5 mr-2')}
            ${t('publishEvent')}
          </button>
        </div>
      </div>
    </div>
  `
}

// ==================== GLOBAL HANDLERS ====================

window.setSocialTab = (tab) => {
  window.setState?.({ socialSubTab: tab })
}

window.setEventFilter = (filter) => {
  window.setState?.({ eventFilter: filter })
}

window.showCompanionSearchView = () => {
  window.setState?.({ showCompanionSearch: true })
}

window.closeCompanionSearch = () => {
  window.setState?.({ showCompanionSearch: false })
}

window.postCompanionRequest = async () => {
  const from = document.getElementById('companion-from')?.value?.trim()
  const to = document.getElementById('companion-to')?.value?.trim()
  const date = document.getElementById('companion-date')?.value
  const duration = document.getElementById('companion-duration')?.value
  const people = document.getElementById('companion-people')?.value
  const gender = document.getElementById('companion-gender')?.value
  const description = document.getElementById('companion-desc')?.value?.trim()

  if (!from || !to) {
    window.showToast?.(t('fillFromTo'), 'warning')
    return
  }

  const { getState, setState } = await import('../../stores/state.js')
  const state = getState()
  const requests = state.companionRequests || []
  const newReq = {
    id: `comp_${Date.now()}`,
    userId: state.user?.uid || 'local-user',
    name: state.username || t('traveler'),
    avatar: state.avatar || '🤙',
    from,
    to,
    date: date || null,
    duration: duration || null,
    people: people || 'any',
    gender: gender || 'any',
    description: description || null,
    createdAt: new Date().toISOString(),
  }

  setState({ companionRequests: [newReq, ...requests], showCompanionSearch: false })
  window.showToast?.(t('companionRequestPosted'), 'success')
}

window.openFriendChat = (friendId) => {
  window.setState?.({ socialSubTab: 'messagerie', activeDMConversation: friendId })
}

window.closeFriendChat = () => {
  window.setState?.({ activeDMConversation: null })
}

window.sendMessage = async (room) => {
  const input = document.getElementById('chat-input')
  if (!input?.value.trim()) return

  const text = input.value.trim()
  input.value = ''

  const { getState, setState } = await import('../../stores/state.js')
  const state = getState()
  const messages = state.messages || []

  const newMsg = {
    id: Date.now().toString(),
    room: room || 'general',
    text,
    userName: state.username || t('traveler'),
    userAvatar: state.avatar || '🤙',
    userId: state.user?.uid || 'local-user',
    createdAt: new Date().toISOString(),
  }

  const updatedMessages = [...messages, newMsg]
  setState({ messages: updatedMessages })

  try {
    localStorage.setItem('spothitch_messages', JSON.stringify(updatedMessages.slice(-100)))
  } catch { /* quota exceeded */ }

  try {
    const { sendChatMessage } = await import('../../services/firebase.js')
    await sendChatMessage(room, text)
  } catch (err) {
    console.error('Chat send failed:', err)
    window.showToast?.(t('messageSendFailed') || 'Message non envoyé. Vérifie ta connexion.', 'error')
  }

  setTimeout(() => {
    const chatEl = document.getElementById('chat-messages')
    if (chatEl) chatEl.scrollTop = chatEl.scrollHeight
  }, 50)
}

window.sendPrivateMessage = async (friendId) => {
  const input = document.getElementById('private-chat-input')
  if (!input?.value.trim()) return

  const text = input.value.trim()
  input.value = ''

  const { getState, setState } = await import('../../stores/state.js')
  const state = getState()
  const privateMessages = state.privateMessages || {}
  const friendMsgs = privateMessages[friendId] || []

  const newMsg = {
    id: Date.now().toString(),
    text,
    userName: state.username || t('me'),
    userAvatar: state.avatar || '🤙',
    userId: state.user?.uid || 'local-user',
    createdAt: new Date().toISOString(),
  }

  const updatedFriendMsgs = [...friendMsgs, newMsg]
  const updatedPrivateMessages = { ...privateMessages, [friendId]: updatedFriendMsgs }
  setState({ privateMessages: updatedPrivateMessages })

  try {
    localStorage.setItem('spothitch_private_messages', JSON.stringify(updatedPrivateMessages))
  } catch { /* quota exceeded */ }

  setTimeout(() => {
    const chatEl = document.getElementById('private-messages')
    if (chatEl) chatEl.scrollTop = chatEl.scrollHeight
  }, 50)
}

window.acceptFriendRequest = async (requestId) => {
  const { getState } = await import('../../stores/state.js')
  const state = getState()
  if (!state.isLoggedIn) {
    window.requireAuth?.('social')
    return
  }
  try {
    const { acceptFriendRequest } = await import('../../services/friends.js')
    const result = await acceptFriendRequest(requestId)
    if (result.success) {
      window.showSuccess?.(t('friendAdded'))
      try {
        const { triggerFriendAddedTip } = await import('../../services/contextualTips.js')
        triggerFriendAddedTip()
      } catch { /* no-op */ }
    } else {
      window.showToast?.(t('errorOccurred') || 'Error', 'error')
    }
  } catch {
    window.showToast?.(t('errorOccurred') || 'Error', 'error')
  }
}

window.declineFriendRequest = async (requestId) => {
  const { getState } = await import('../../stores/state.js')
  const state = getState()
  if (!state.isLoggedIn) {
    window.requireAuth?.('social')
    return
  }
  try {
    const { declineFriendRequest } = await import('../../services/friends.js')
    await declineFriendRequest(requestId)
  } catch { /* no-op */ }
  window.showToast?.(t('requestDeclined') || 'Request declined', 'info')
}

window.showAddFriend = () => {
  window.setState?.({ socialSubTab: 'messagerie' })
  setTimeout(
    () =>
      document.getElementById('friend-search')?.focus() ||
      document.getElementById('social-search')?.focus(),
    100
  )
}

window.addFriendByName = async () => {
  const input = document.getElementById('friend-search') || document.getElementById('social-search')
  const name = input?.value?.trim()
  if (!name) {
    window.showToast?.(t('enterTravelerName'), 'warning')
    return
  }

  const { getState, setState } = await import('../../stores/state.js')
  const state = getState()

  if (!state.isLoggedIn) {
    window.requireAuth?.('social')
    return
  }

  // Search real users in Firestore
  setState({ friendSearchLoading: true, friendSearchResults: null })
  try {
    const { searchUsers } = await import('../../services/friends.js')
    const results = await searchUsers(name)
    if (results.length === 0) {
      window.showToast?.(t('noUsersFound') || 'Aucun utilisateur trouvé', 'warning')
      setState({ friendSearchLoading: false, friendSearchResults: null })
    } else {
      setState({ friendSearchLoading: false, friendSearchResults: results })
    }
  } catch {
    setState({ friendSearchLoading: false, friendSearchResults: null })
    window.showToast?.(t('errorOccurred') || 'Error', 'error')
  }
}

window.sendFriendRequest = async (targetUserId) => {
  const { getState, setState } = await import('../../stores/state.js')
  const state = getState()
  if (!state.isLoggedIn) {
    window.requireAuth?.('social')
    return
  }
  try {
    const { sendFriendRequest } = await import('../../services/friends.js')
    const result = await sendFriendRequest(targetUserId)
    if (result.success) {
      window.showToast?.(t('friendRequestSent') || 'Demande envoyée !', 'success')
    } else if (result.error === 'already_friends') {
      window.showToast?.(t('alreadyFriend') || 'Déjà ami', 'warning')
    } else if (result.error === 'request_already_sent') {
      window.showToast?.(t('requestAlreadySent') || 'Demande déjà envoyée', 'warning')
    } else {
      window.showToast?.(t('errorOccurred') || 'Error', 'error')
    }
    setState({ friendSearchResults: null })
    const input = document.getElementById('friend-search')
    if (input) input.value = ''
  } catch (err) {
    console.error('Friend request failed:', err)
    window.showToast?.(t('errorNetwork') || 'Erreur réseau. Réessaie.', 'error')
  }
}

window.removeFriend = async (friendId) => {
  const { getState } = await import('../../stores/state.js')
  const state = getState()
  if (!state.isLoggedIn) return

  try {
    const { removeFriend } = await import('../../services/friends.js')
    await removeFriend(friendId)
  } catch { /* no-op — state updated by onSnapshot */ }
  window.showToast?.(t('friendRemoved'), 'info')
}

window.showFriendProfile = async (friendId) => {
  window.setState?.({
    showFriendProfile: true,
    selectedFriendProfileId: friendId,
    friendProfileSocialLinks: null,
    profileReviews: null,
    guestProfile: null,
  })
  try {
    const { getUserProfile } = await import('../../services/firebase.js')
    const result = await getUserProfile(friendId)
    if (result.success && result.profile) {
      const p = result.profile
      if (result.profile?.socialLinks) {
        window.setState?.({ friendProfileSocialLinks: result.profile.socialLinks })
      }
      // Build guestProfile for non-friends
      const state = window.getState?.() || {}
      const isFriend = (state.friends || []).some(f => f.id === friendId)
      if (!isFriend) {
        window.setState?.({ guestProfile: {
          id: friendId,
          name: p.username || p.displayName || 'Hitchhiker',
          avatar: p.avatar || '🤙',
          level: p.level || 1,
          points: p.points || 0,
          spotsCreated: p.spotsCreated || 0,
          checkins: p.checkins || 0,
          badges: p.badges || [],
          verificationLevel: p.verificationLevel || 0,
          trustScore: p.reviewCount > 0 ? Math.round((p.reviewRatingTotal || 0) / p.reviewCount * 2) : 0,
          reviewCount: p.reviewCount || 0,
          countriesVisited: (p.countriesVisited || []).length || p.countriesCount || 0,
        }})
      }
    }
  } catch { /* offline or not found */ }
  // Load reviews async
  try {
    const { loadProfileReviews } = await import('../../services/userReviews.js')
    const reviews = await loadProfileReviews(friendId)
    window.setState?.({ profileReviews: reviews })
  } catch { window.setState?.({ profileReviews: [] }) }
}

window.openWriteReview = (targetUid) => {
  window.setState?.({ showWriteReview: true, reviewTargetUid: targetUid })
}

window.cancelWriteReview = () => {
  window.setState?.({ showWriteReview: false, reviewTargetUid: null })
}

window.submitProfileReview = async (targetUid, comment) => {
  if (!targetUid || !comment?.trim()) return
  try {
    const { submitProfileReview } = await import('../../services/userReviews.js')
    const result = await submitProfileReview(targetUid, null, comment)
    if (result.success) {
      window.showToast?.(t('reviewSubmitted') || 'Avis envoyé !', 'success')
      window.setState?.({ showWriteReview: false, reviewTargetUid: null })
      // Reload reviews
      const { loadProfileReviews } = await import('../../services/userReviews.js')
      const reviews = await loadProfileReviews(targetUid)
      window.setState?.({ profileReviews: reviews })
    } else {
      window.showToast?.(t('reviewError') || 'Erreur lors de l\'envoi', 'error')
    }
  } catch (e) {
    console.error('submitProfileReview error:', e)
    window.showToast?.(t('reviewError') || 'Erreur lors de l\'envoi', 'error')
  }
}

window.shareMyProfile = () => {
  const state = window.getState?.() || {}
  import('../../services/shareCard.js').then(m => {
    m.shareProfileModal(state.user?.uid || '', state.username || '', state.avatar || '🤙')
  })
}

window.shareProfile = (uid, name, avatar) => {
  import('../../services/shareCard.js').then(m => {
    m.shareProfileModal(uid, name, avatar)
  })
}

window.loadMyProfileReviews = async () => {
  const state = window.getState?.() || {}
  if (!state.user?.uid) return
  try {
    const { loadProfileReviews } = await import('../../services/userReviews.js')
    const reviews = await loadProfileReviews(state.user.uid)
    window.setState?.({ myProfileReviews: reviews })
  } catch { window.setState?.({ myProfileReviews: [] }) }
}

export default { renderSocial }
