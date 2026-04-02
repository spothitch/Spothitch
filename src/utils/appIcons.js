/**
 * App Icons — Centralized icon mapping for SpotHitch
 *
 * RULE: NEVER use emojis in the UI. Use appIcon() instead.
 * Only exception: country flags (🇫🇷 🇪🇸) which have no Lucide equivalent.
 *
 * Usage:
 *   import { appIcon } from '../utils/appIcons.js'
 *   appIcon('spot')           → map-pin icon, default color (currentColor)
 *   appIcon('spot', 'danger') → map-pin icon, red
 *   appIcon('spot', 'muted')  → map-pin icon, muted gray
 *
 * All icons inherit parent text color by default (currentColor).
 * Use a color variant only when semantic meaning is needed.
 */

import { icon } from './icons.js'

// ═══════════════════════════════════════════════════════════
// COLOR VARIANTS
// ═══════════════════════════════════════════════════════════
const COLORS = {
  default: '',                          // inherits from parent (currentColor)
  brand:   'text-[#F0A830]',           // SpotHitch gold
  success: 'text-emerald-400',         // green — success, active, safe
  danger:  'text-red-400',             // red — error, danger, SOS
  warning: 'text-amber-400',           // amber — warning, attention
  info:    'text-blue-400',            // blue — info, social, globe
  muted:   'text-slate-400',           // gray — inactive, secondary
  purple:  'text-purple-400',          // purple — group, social
  pink:    'text-pink-400',            // pink — plane, love
  teal:    'text-teal-400',            // teal — bike, eco
  orange:  'text-orange-400',          // orange — car, flame
}

// ═══════════════════════════════════════════════════════════
// ICON MAP — every concept in the app mapped to a Lucide icon
// ═══════════════════════════════════════════════════════════
const ICON_MAP = {
  // ── Navigation & Core ──
  map:            'map-pinned',
  voyage:         'compass',
  social:         'users',
  profile:        'user',
  search:         'search',
  settings:       'settings',
  back:           'arrow-left',
  close:          'x',
  menu:           'menu',

  // ── Spots & Map ──
  spot:           'map-pin',
  addSpot:        'plus-circle',
  spotVerified:   'badge-check',
  spotDanger:     'skull',
  spotClosed:     'lock',
  spotWarning:    'alert-triangle',
  gasStation:     'fuel',
  location:       'map-pin',
  direction:      'navigation',
  route:          'route',
  distance:       'ruler',

  // ── Transport ──
  hitchhike:      'thumbs-up',
  walk:           'footprints',
  bus:            'bus',
  train:          'train-front',
  plane:          'plane',
  boat:           'ship',
  bike:           'bike',
  car:            'car',
  carFront:       'car-front',

  // ── Safety & Guardian ──
  guardian:        'shield-check',
  shield:         'shield',
  sos:            'siren',
  emergency:      'phone-call',
  alert:          'alert-triangle',
  safe:           'circle-check',
  checkin:        'circle-check',
  timer:          'timer',
  battery:        'battery-medium',
  recording:      'mic',
  fakeCall:       'phone-incoming',

  // ── Social ──
  chat:           'message-circle',
  message:        'message-square',
  send:           'send',
  friend:         'user-plus',
  friends:        'users',
  group:          'users',
  handshake:      'handshake',
  globe:          'globe',
  reaction:       'smile-plus',

  // ── Interactions ──
  thumbsUp:       'thumbs-up',
  thumbsDown:     'thumbs-down',
  heart:          'heart',
  star:           'star',
  flame:          'flame',
  vote:           'vote',
  share:          'share',
  bookmark:       'bookmark',
  favorite:       'heart',
  report:         'flag',

  // ── Content & Media ──
  photo:          'camera',
  image:          'image',
  video:          'video',
  audio:          'mic',
  edit:           'pencil',
  note:           'pencil',
  notebook:       'notebook-pen',
  book:           'book-open',
  guide:          'book-open',
  calendar:       'calendar',
  clock:          'clock',
  link:           'link',

  // ── Gamification ──
  trophy:         'trophy',
  medal:          'medal',
  badge:          'award',
  crown:          'crown',
  gem:            'gem',
  target:         'crosshair',
  challenge:      'crosshair',
  gift:           'gift',
  reward:         'gift',
  sparkles:       'sparkles',
  zap:            'zap',
  rocket:         'rocket',
  level:          'trending-up',
  points:         'coins',
  leaderboard:    'bar-chart-3',
  stats:          'bar-chart-3',

  // ── Profile & Identity ──
  user:           'user',
  userCheck:      'user-check',
  avatar:         'user',
  idCard:         'id-card',
  verified:       'badge-check',
  languages:      'languages',
  bio:            'text',

  // ── Status & Feedback ──
  success:        'circle-check',
  error:          'circle-x',
  warning:        'alert-triangle',
  info:           'info',
  tip:            'lightbulb',
  idea:           'lightbulb',
  question:       'help-circle',
  loading:        'loader-circle',
  offline:        'wifi-off',
  online:         'wifi',

  // ── Commerce & Budget ──
  money:          'coins',
  wallet:         'wallet',
  discount:       'percent',
  price:          'tag',
  accommodation:  'bed',
  hostel:         'building',
  camping:        'tent',
  food:           'utensils',
  coffee:         'coffee',
  shopping:       'shopping-bag',
  insurance:      'shield',

  // ── Misc ──
  sun:            'sun',
  moon:           'moon',
  cloud:          'cloud',
  download:       'download',
  upload:         'upload',
  copy:           'copy',
  trash:          'trash-2',
  filter:         'sliders-horizontal',
  sort:           'arrow-up-down',
  expand:         'maximize-2',
  collapse:       'minimize-2',
  external:       'external-link',
  eye:            'eye',
  eyeOff:         'eye-off',
  lock:           'lock',
  unlock:         'unlock',
  bell:           'bell',
  bellOff:        'bell-off',
  celebration:    'party-popper',
  event:          'calendar-days',
  flag:           'flag',
  pin:            'pin',
  compass:        'compass',
  explorer:       'compass',
  scale:          'scale',
  log:            'scroll-text',
  refresh:        'refresh-cw',
  help:           'help-circle',
  feedback:       'message-square-text',
  donate:         'heart-handshake',
}

// ═══════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════

/**
 * Render an app icon by concept name.
 *
 * @param {string} name - Concept name (e.g. 'spot', 'guardian', 'chat')
 * @param {string} [color='default'] - Color variant (see COLORS object)
 * @param {string} [size='w-5 h-5'] - Tailwind size classes
 * @returns {string} SVG HTML string
 */
export function appIcon(name, color = 'default', size = 'w-5 h-5') {
  const lucideName = ICON_MAP[name] || name
  const colorCls = COLORS[color] || ''
  return icon(lucideName, `${size} ${colorCls}`.trim())
}

/**
 * Get just the Lucide icon name for a concept.
 * Useful when you need to pass the icon name to another function.
 */
export function getIconName(name) {
  return ICON_MAP[name] || name
}

/**
 * Get all available color variants.
 */
export function getColors() {
  return { ...COLORS }
}

export default { appIcon, getIconName, getColors, ICON_MAP, COLORS }
