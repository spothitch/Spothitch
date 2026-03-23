/**
 * Conversations Component
 * Unified DMs + travel group chats sorted by last message
 */

import { t } from '../../../i18n/index.js'
import { icon } from '../../../utils/icons.js'
import { renderEmptyState } from '../../EmptyState.js'
import { escapeHTML } from '../../../utils/sanitize.js'
import { formatTime, formatRelativeTime } from '../../../utils/formatters.js'
import { renderSkeletonChatList } from '../../ui/Skeleton.js'
import { getConversationsList, getConversationMessages } from '../../../services/directMessages.js'
import { getGroupConversationMessages } from '../../../services/groupConversations.js'

export function renderConversations(state) {
  // If DM conversation is open
  if (state.activeDMConversation) {
    return renderDMChat(state, state.activeDMConversation)
  }

  // If Firebase group conversation is open
  if (state.activeGroupConversation) {
    return renderFirebaseGroupChat(state, state.activeGroupConversation)
  }

  // Show create group conversation modal overlay
  if (state.showCreateGroupConversation) {
    return renderCreateGroupConversationForm(state)
  }

  return renderConversationList(state)
}

function renderConversationList(state) {
  const dmConversations = getConversationsList()
  const fbGroups = state.groupConversations || []

  // Build unified list
  const allConversations = []

  // DMs
  dmConversations.forEach(conv => {
    allConversations.push({
      type: 'dm',
      id: conv.recipientId,
      name: conv.recipientName,
      avatar: conv.recipientAvatar || '🤙',
      lastMessage: conv.lastMessage,
      lastMessageTime: conv.lastMessageTime,
      unreadCount: conv.unreadCount,
      online: conv.online,
      isGroup: false,
    })
  })

  // Firebase group conversations
  fbGroups.forEach(group => {
    allConversations.push({
      type: 'fbgroup',
      id: group.id,
      name: group.name,
      avatar: group.icon || '👥',
      lastMessage: group.lastMessage?.text || t('noMessagesYet'),
      lastMessageTime: group.updatedAt,
      unreadCount: 0,
      online: false,
      isGroup: true,
      memberCount: Array.isArray(group.members) ? group.members.length : 0,
    })
  })

  // Sort by most recent
  allConversations.sort((a, b) => {
    if (!a.lastMessageTime) return 1
    if (!b.lastMessageTime) return -1
    return new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
  })

  if (state.chatLoading) {
    return `<div class="flex-1 overflow-y-auto p-4 space-y-3">${renderSkeletonChatList(6)}</div>`
  }

  return `
    <div class="flex-1 overflow-y-auto">
      <!-- Conversation list -->
      ${allConversations.length > 0 ? `
        ${allConversations.map(conv => `
          <button
            onclick="${conv.type === 'fbgroup' ? `openGroupConversation('${conv.id}')` : `openConversation('${conv.id}')`}"
            class="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-white/5"
          >
            <div class="relative shrink-0">
              <span class="text-3xl">${conv.avatar}</span>
              ${conv.isGroup ? `
                <span class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500/80 text-white text-[10px] flex items-center justify-center">${conv.memberCount}</span>
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
          class="card p-3 w-full text-left border-dashed border-2 border-emerald-500/30 hover:border-emerald-500/60 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center">
              ${icon('users', 'w-5 h-5 text-emerald-400')}
            </div>
            <div class="text-sm text-slate-300">${t('newGroupConversation')}</div>
          </div>
        </button>
      </div>

      ${allConversations.length === 0 ? renderEmptyState('conversations') : ''}
    </div>
  `
}

// --- DM Chat View (moved from Social.js) ---
function renderDMChat(state, recipientId) {
  const messages = getConversationMessages(recipientId)
  const friends = state.friends || []
  const friend = friends.find(f => f.id === recipientId)
  const recipientName = friend?.name || t('traveler')
  const recipientAvatar = friend?.avatar || '🤙'
  const isOnline = friend?.online || false

  return `
    <!-- Header -->
    <div class="p-3 bg-dark-secondary/50 flex items-center gap-3">
      <button onclick="closeConversation()" class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white" aria-label="${t('back')}">
        ${icon('arrow-left', 'w-5 h-5')}
      </button>
      <div class="relative">
        <span class="text-2xl">${recipientAvatar}</span>
        ${isOnline ? `<span class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-dark-secondary bg-emerald-500"></span>` : ''}
      </div>
      <div class="flex-1 min-w-0 cursor-pointer" role="button" tabindex="0" onclick="showFriendProfile('${recipientId}')">
        <div class="font-medium text-sm">${escapeHTML(recipientName)}</div>
        <div class="text-xs text-slate-400">${isOnline ? t('online') : t('offline')}</div>
      </div>
      <button onclick="shareDMSpot('${recipientId}')" class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white" aria-label="${t('shareSpot')}" title="${t('shareSpot')}">
        ${icon('map-pin', 'w-4 h-4')}
      </button>
      <button onclick="shareDMPosition('${recipientId}')" class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white" aria-label="${t('sharePosition')}" title="${t('sharePosition')}">
        ${icon('locate', 'w-4 h-4')}
      </button>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto p-4 space-y-3" id="dm-messages" role="log" aria-live="polite">
      ${messages.length > 0
    ? messages.slice(-50).map(msg => renderDMMessage(msg, state)).join('')
    : `
          <div class="text-center py-12">
            <span class="text-4xl mb-4 block">💬</span>
            <p class="text-slate-400 text-sm">${t('startConversation')}</p>
          </div>
        `}
    </div>

    <!-- Input -->
    <div class="p-3 glass-dark">
      <form class="flex gap-2" onsubmit="event.preventDefault(); sendDM('${recipientId}');">
        <input
          type="text"
          class="input-field flex-1"
          placeholder="${t('messageTo')} ${escapeHTML(recipientName)}..."
          id="dm-input"
          autocomplete="off"
          aria-label="${t('writeMessage')}"
        />
        <button type="submit" class="btn-primary px-4" aria-label="${t('send')}">
          ${icon('send', 'w-5 h-5')}
        </button>
      </form>
    </div>
  `
}

function renderDMMessage(msg, state) {
  const isSent = msg.senderId === (state.user?.uid || 'local-user')

  let content = `<p class="text-sm text-white">${escapeHTML(msg.text || '')}</p>`

  if (msg.type === 'spot_share' && msg.spot) {
    content = `
      <div class="bg-white/10 rounded-xl p-2 mb-1">
        <div class="flex items-center gap-2">
          ${icon('map-pin', 'w-4 h-4 text-primary-400')}
          <div>
            <div class="text-sm font-medium text-white">${escapeHTML(msg.spot.name || '')}</div>
            <div class="text-xs text-slate-400">${escapeHTML(msg.spot.city || '')}, ${escapeHTML(msg.spot.country || '')}</div>
          </div>
        </div>
      </div>
      <p class="text-sm text-white">${escapeHTML(msg.text || '')}</p>
    `
  } else if (msg.type === 'location_share' && msg.location) {
    content = `
      <div class="bg-white/10 rounded-xl p-2 mb-1">
        <div class="flex items-center gap-2">
          ${icon('locate', 'w-4 h-4 text-emerald-400')}
          <div class="text-sm text-white">${escapeHTML(msg.location.address || t('sharedPosition'))}</div>
        </div>
      </div>
      <p class="text-sm text-white">${escapeHTML(msg.text || '')}</p>
    `
  }

  return `
    <div class="flex ${isSent ? 'justify-end' : 'justify-start'}">
      <div class="max-w-[80%] ${isSent ? 'bg-primary-500/20' : 'bg-white/5'} rounded-2xl px-4 py-2 ${isSent ? 'rounded-br-md' : 'rounded-bl-md'}">
        ${!isSent ? `
          <div class="flex items-center gap-2 mb-1">
            <span class="text-sm">${msg.senderAvatar || '🤙'}</span>
            <span class="text-xs font-medium text-primary-400">${escapeHTML(msg.senderName || t('traveler'))}</span>
          </div>
        ` : ''}
        ${content}
        <time class="text-xs text-slate-400 mt-1 block ${isSent ? 'text-right' : ''}">
          ${formatTime(msg.createdAt)}
        </time>
      </div>
    </div>
  `
}

// --- Firebase Group Conversation Chat View ---
function renderFirebaseGroupChat(state, groupId) {
  const group = (state.groupConversations || []).find(g => g.id === groupId)
  if (!group) return ''

  const messages = getGroupConversationMessages(groupId)
  const memberCount = Array.isArray(group.members) ? group.members.length : 0
  const memberProfiles = group.memberProfiles || {}

  return `
    <!-- Header -->
    <div class="p-3 bg-dark-secondary/50 flex items-center gap-3">
      <button onclick="closeGroupConversation()" class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white" aria-label="${t('back')}">
        ${icon('arrow-left', 'w-5 h-5')}
      </button>
      <span class="text-2xl">${group.icon || '👥'}</span>
      <div class="flex-1 min-w-0">
        <div class="font-medium text-sm truncate">${escapeHTML(group.name)}</div>
        <div class="text-xs text-slate-400">${memberCount} ${t('members')}</div>
      </div>
      <button onclick="leaveGroupConversation('${groupId}')" class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-danger-400 transition-colors" aria-label="${t('leaveGroup')}" title="${t('leaveGroup')}">
        ${icon('log-out', 'w-4 h-4')}
      </button>
    </div>

    <!-- Members chips -->
    <div class="px-4 py-2 flex gap-1.5 overflow-x-auto border-b border-white/5 scrollbar-hide">
      ${Object.entries(memberProfiles).map(([_uid, p]) => `
        <span class="shrink-0 flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 text-xs text-slate-300">
          <span>${p.avatar || '🤙'}</span>
          <span class="max-w-[80px] truncate">${escapeHTML(p.name || t('traveler'))}</span>
        </span>
      `).join('')}
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto p-4 space-y-3" id="fb-group-chat-messages" role="log" aria-live="polite">
      ${messages.length > 0
    ? messages.slice(-50).map(msg => renderFBGroupMessage(msg, state)).join('')
    : `
          <div class="text-center py-12">
            <span class="text-4xl mb-4 block">👥</span>
            <p class="text-slate-400 text-sm">${t('startConversation')}</p>
          </div>
        `}
    </div>

    <!-- Input -->
    <div class="p-3 glass-dark">
      <form class="flex gap-2" onsubmit="event.preventDefault(); sendGroupConversationMessage('${groupId}');">
        <input
          type="text"
          class="input-field flex-1"
          placeholder="${t('typeMessage')}..."
          id="group-conv-input"
          autocomplete="off"
          aria-label="${t('typeMessage')}"
        />
        <button type="submit" class="btn-primary px-4" aria-label="${t('send')}">
          ${icon('send', 'w-5 h-5')}
        </button>
      </form>
    </div>
  `
}

function renderFBGroupMessage(msg, state) {
  const isSent = msg.senderId === (state.user?.uid || 'local-user')

  return `
    <div class="flex ${isSent ? 'justify-end' : 'justify-start'}">
      <div class="max-w-[80%] ${isSent ? 'bg-primary-500/20' : 'bg-white/5'} rounded-2xl px-4 py-2 ${isSent ? 'rounded-br-md' : 'rounded-bl-md'}">
        ${!isSent ? `
          <div class="flex items-center gap-2 mb-1">
            <span class="text-sm">${msg.senderAvatar || '🤙'}</span>
            <span class="text-xs font-medium text-emerald-400">${escapeHTML(msg.senderName || t('traveler'))}</span>
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

// --- Create Group Conversation Form ---
function renderCreateGroupConversationForm(state) {
  const friends = state.friends || []
  const selected = state.groupConversationSelectedFriends || []
  const loading = state.groupConversationLoading || false

  return `
    <div class="flex-1 overflow-y-auto">
      <!-- Header -->
      <div class="p-3 bg-dark-secondary/50 flex items-center gap-3">
        <button onclick="closeCreateGroupConversation()" class="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white" aria-label="${t('back')}">
          ${icon('arrow-left', 'w-5 h-5')}
        </button>
        <h2 class="font-semibold text-sm flex items-center gap-2">
          ${icon('users', 'w-4 h-4 text-emerald-400')}
          ${t('createGroupConversation')}
        </h2>
      </div>

      <div class="p-4 space-y-4">
        <!-- Group name -->
        <div>
          <label class="text-xs text-slate-400 mb-1 block">${t('groupName')} *</label>
          <input
            type="text"
            id="group-conv-name"
            class="input-field w-full"
            placeholder="${t('groupNamePlaceholder')}"
            maxlength="50"
          />
        </div>

        <!-- Friend selection -->
        <div>
          <label class="text-xs text-slate-400 mb-2 block">
            ${t('selectFriends')}
            ${selected.length > 0 ? `<span class="ml-1 text-emerald-400">(${selected.length} ${t('selected') || 'sélectionnés'})</span>` : ''}
          </label>
          ${friends.length === 0 ? `
            <div class="text-center py-6">
              <span class="text-3xl mb-2 block">👥</span>
              <p class="text-sm text-slate-400">${t('noFriendsYet')}</p>
            </div>
          ` : `
            <div class="space-y-1">
              ${friends.map(friend => {
    const isSelected = selected.includes(friend.id)
    return `
                  <button
                    onclick="toggleFriendForGroup('${friend.id}')"
                    class="w-full flex items-center gap-3 p-2.5 rounded-xl transition-colors ${isSelected ? 'bg-emerald-500/15 border border-emerald-500/30' : 'hover:bg-white/5'}"
                  >
                    <div class="relative shrink-0">
                      <span class="text-2xl">${friend.avatar || '🤙'}</span>
                      ${isSelected ? `
                        <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                          ${icon('check', 'w-2.5 h-2.5 text-white')}
                        </span>
                      ` : ''}
                    </div>
                    <div class="flex-1 text-left min-w-0">
                      <div class="text-sm font-medium truncate">${escapeHTML(friend.name)}</div>
                      <div class="text-xs text-slate-400">${friend.online ? t('online') : t('offline')}</div>
                    </div>
                    <div class="w-5 h-5 rounded-full border-2 ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-500'} flex items-center justify-center shrink-0">
                      ${isSelected ? icon('check', 'w-3 h-3 text-white') : ''}
                    </div>
                  </button>
                `
  }).join('')}
            </div>
          `}
        </div>

        <!-- Create button -->
        <button
          onclick="createGroupConversation()"
          class="w-full py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 ${loading ? 'opacity-70 pointer-events-none' : ''}"
          ${loading ? 'disabled' : ''}
        >
          ${loading
    ? `<span class="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>`
    : icon('users', 'w-5 h-5')}
          ${loading ? t('loading') : t('createGroupConversation')}
        </button>
      </div>
    </div>
  `
}

// Global handlers
window.openGroupConversation = (groupId) => {
  const { subscribeToGroupConversation } = window._gcModule || {}
  if (subscribeToGroupConversation) {
    subscribeToGroupConversation(groupId)
  } else {
    import('../../../services/groupConversations.js').then(m => {
      window._gcModule = m
      m.subscribeToGroupConversation(groupId)
    })
  }
  window.setState?.({ activeGroupConversation: groupId, socialSubTab: 'conversations' })
}

window.closeGroupConversation = () => {
  window.setState?.({ activeGroupConversation: null })
}

window.openCreateGroupConversation = () => {
  window.setState?.({ showCreateGroupConversation: true, groupConversationSelectedFriends: [], socialSubTab: 'conversations' })
}

window.closeCreateGroupConversation = () => {
  window.setState?.({ showCreateGroupConversation: false, groupConversationSelectedFriends: [] })
}

window.toggleFriendForGroup = async (friendId) => {
  const { getState, setState } = await import('../../../stores/state.js')
  const selected = getState().groupConversationSelectedFriends || []
  if (selected.includes(friendId)) {
    setState({ groupConversationSelectedFriends: selected.filter(id => id !== friendId) })
  } else {
    setState({ groupConversationSelectedFriends: [...selected, friendId] })
  }
}

window.createGroupConversation = async () => {
  if (window.createGroupConversation._busy) return
  window.createGroupConversation._busy = true
  setTimeout(() => { window.createGroupConversation._busy = false }, 2000)
  const { t: tFn } = await import('../../../i18n/index.js')
  const { getState, setState } = await import('../../../stores/state.js')
  const state = getState()

  if (!state.isLoggedIn) { window.requireAuth?.('social'); return }

  const name = document.getElementById('group-conv-name')?.value?.trim()
  const selected = state.groupConversationSelectedFriends || []

  if (!name) { window.showToast?.(tFn('enterGroupName'), 'warning'); return }
  if (selected.length === 0) { window.showToast?.(tFn('selectAtLeastOneFriend'), 'warning'); return }

  setState({ groupConversationLoading: true })
  try {
    const { createGroupConversation: create } = await import('../../../services/groupConversations.js')
    const result = await create(name, selected)
    if (result.success) {
      setState({
        showCreateGroupConversation: false,
        groupConversationSelectedFriends: [],
        groupConversationLoading: false,
        activeGroupConversation: result.groupId,
      })
      window.showToast?.(tFn('groupCreated'), 'success')
    } else {
      setState({ groupConversationLoading: false })
      window.showToast?.(tFn('errorOccurred') || 'Error', 'error')
    }
  } catch {
    setState({ groupConversationLoading: false })
    window.showToast?.(tFn('errorOccurred') || 'Error', 'error')
  }
}

window.sendGroupConversationMessage = async (groupId) => {
  const input = document.getElementById('group-conv-input')
  const text = input?.value?.trim()
  if (!text) return
  input.value = ''

  try {
    const { sendGroupConversationMessage: send } = await import('../../../services/groupConversations.js')
    await send(groupId, text)
    setTimeout(() => {
      const el = document.getElementById('fb-group-chat-messages')
      if (el) el.scrollTop = el.scrollHeight
    }, 50)
  } catch {
    window.showToast?.((await import('../../../i18n/index.js')).t('conversationError') || 'Action impossible. Vérifie ta connexion.', 'error')
  }
}

window.leaveGroupConversation = async (groupId) => {
  if (!confirm((await import('../../../i18n/index.js')).t('leaveGroup') + ' ?')) return
  try {
    const { leaveGroupConversation: leave } = await import('../../../services/groupConversations.js')
    const result = await leave(groupId)
    if (result.success) {
      window.setState?.({ activeGroupConversation: null })
      window.showToast?.((await import('../../../i18n/index.js')).t('leftGroup'), 'info')
    }
  } catch {
    window.showToast?.((await import('../../../i18n/index.js')).t('conversationError') || 'Action impossible. Vérifie ta connexion.', 'error')
  }
}

window.addMemberToGroupConversation = async (groupId, userId) => {
  try {
    const { addMemberToGroupConversation: add } = await import('../../../services/groupConversations.js')
    const { t: tFn } = await import('../../../i18n/index.js')
    const result = await add(groupId, userId)
    window.showToast?.(result.success ? tFn('memberAdded') : (tFn('conversationError') || 'Action impossible.'), result.success ? 'success' : 'error')
  } catch {
    window.showToast?.((await import('../../../i18n/index.js')).t('conversationError') || 'Action impossible. Vérifie ta connexion.', 'error')
  }
}

export default { renderConversations }
