import { t } from '../i18n/index.js'
import { icon } from '../utils/icons.js'

/**
 * EmptyState Component — reusable across the entire app
 * Shows emoji + message + description + CTA button
 * All text via i18n (4 languages)
 */

const emptyStates = {
  conversations: {
    emoji: '💬',
    messageKey: 'emptyConversations',
    descKey: 'emptyConversationsDesc',
    buttonKey: 'addFriend',
    buttonAction: "showAddFriend()",
    buttonIcon: 'user-plus',
  },
  friends: {
    emoji: '🚗',
    messageKey: 'emptyFriends',
    descKey: 'emptyFriendsDesc',
    buttonKey: 'addFriend',
    buttonAction: "showAddFriend()",
    buttonIcon: 'user-plus',
  },
  feed: {
    emoji: '📰',
    messageKey: 'emptyFeed',
    descKey: 'emptyFeedDesc',
    buttonKey: 'addFriend',
    buttonAction: "setSocialTab('friends')",
    buttonIcon: 'user-plus',
  },
  events: {
    emoji: '📅',
    messageKey: 'emptyEvents',
    descKey: 'emptyEventsDesc',
    buttonKey: 'emptyEventsBtn',
    buttonAction: "openCreateEvent()",
    buttonIcon: 'plus',
  },
  companion: {
    emoji: '🤝',
    messageKey: 'emptyCompanion',
    descKey: 'emptyCompanionDesc',
    buttonKey: null,
    buttonAction: null,
    buttonIcon: null,
  },
  trips: {
    emoji: '🗺️',
    messageKey: 'emptyTrips',
    descKey: 'emptyTripsDesc',
    buttonKey: 'emptyTripsBtn',
    buttonAction: "changeTab('voyage')",
    buttonIcon: 'route',
  },
  pastTrips: {
    emoji: '📔',
    messageKey: 'emptyPastTrips',
    descKey: 'emptyPastTripsDesc',
    buttonKey: 'emptyPastTripsBtn',
    buttonAction: "openAddPastTrip()",
    buttonIcon: 'plus',
  },
  friendTrips: {
    emoji: '👥',
    messageKey: 'emptyFriendTrips',
    descKey: 'emptyFriendTripsDesc',
    buttonKey: null,
    buttonAction: null,
    buttonIcon: null,
  },
  spots: {
    emoji: '📍',
    messageKey: 'emptySpots',
    descKey: 'emptySpotsDesc',
    buttonKey: 'emptySpotsBtn',
    buttonAction: "openAddSpot()",
    buttonIcon: 'plus',
  },
  mySpots: {
    emoji: '📍',
    messageKey: 'emptyMySpots',
    descKey: 'emptyMySpotsDesc',
    buttonKey: 'emptySpotsBtn',
    buttonAction: "closeProfileDetail(); setTimeout(openAddSpot, 100)",
    buttonIcon: 'plus',
  },
  favorites: {
    emoji: '⭐',
    messageKey: 'emptyFavorites',
    descKey: 'emptyFavoritesDesc',
    buttonKey: 'emptyFavoritesBtn',
    buttonAction: "changeTab('map')",
    buttonIcon: 'map-pinned',
  },
  badges: {
    emoji: '🏆',
    messageKey: 'emptyBadges',
    descKey: 'emptyBadgesDesc',
    buttonKey: 'emptyBadgesBtn',
    buttonAction: "changeTab('voyage')",
    buttonIcon: 'medal',
  },
  references: {
    emoji: '✍️',
    messageKey: 'emptyReferences',
    descKey: 'emptyReferencesDesc',
    buttonKey: null,
    buttonAction: null,
    buttonIcon: null,
  },
  chat: {
    emoji: '👋',
    messageKey: 'emptyChatMessages',
    descKey: 'emptyChatMessagesDesc',
    buttonKey: null,
    buttonAction: null,
    buttonIcon: null,
  },
}

/**
 * Renders a consistent empty state with emoji + message + description + CTA
 * @param {string} type - The type of empty state
 * @param {Object} [opts] - Options
 * @param {boolean} [opts.compact] - Smaller padding for inline sections
 * @returns {string} HTML string
 */
export function renderEmptyState(type, opts = {}) {
  const state = emptyStates[type]

  if (!state) {
    return `
      <div class="text-center py-8">
        <span class="text-4xl mb-3 block">🤷</span>
        <p class="text-sm text-slate-400">${t('nothingHere')}</p>
      </div>
    `
  }

  const py = opts.compact ? 'py-6' : 'py-12'
  const emojiSize = opts.compact ? 'text-4xl mb-3' : 'text-5xl mb-4'
  const msgSize = opts.compact ? 'text-sm' : 'text-base'

  const buttonHtml = state.buttonKey && state.buttonAction ? `
    <button onclick="${state.buttonAction}"
      class="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold hover:scale-105 transition-transform mt-4">
      ${icon(state.buttonIcon, 'w-4 h-4')}
      ${t(state.buttonKey)}
    </button>
  ` : ''

  return `
    <div class="text-center ${py} px-4">
      <span class="${emojiSize} block">${state.emoji}</span>
      <p class="text-slate-300 ${msgSize} font-medium mb-1 max-w-xs mx-auto">
        ${t(state.messageKey)}
      </p>
      <p class="text-xs text-slate-500 max-w-xs mx-auto">
        ${t(state.descKey)}
      </p>
      ${buttonHtml}
    </div>
  `
}

export function getEmptyStateTypes() {
  return Object.keys(emptyStates)
}

export default { renderEmptyState, getEmptyStateTypes }
