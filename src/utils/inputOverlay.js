/**
 * In-app input overlay — replaces native prompt() with styled dark theme overlay.
 *
 * Usage:
 *   const value = await showInputOverlay({ title: 'Nom', value: 'current', placeholder: 'Tape ici' })
 *   if (value !== null) { ... } // null = cancelled
 */

import { t } from '../i18n/index.js'
import { icon } from './icons.js'
import { escapeHTML } from './sanitize.js'

/**
 * Show an in-app input overlay and return a Promise<string|null>.
 * Resolves with the trimmed input value, or null if cancelled.
 *
 * @param {object} options
 * @param {string} options.title - Overlay title
 * @param {string} [options.value] - Pre-filled value
 * @param {string} [options.placeholder] - Input placeholder
 * @param {string} [options.inputType] - 'text' | 'tel' | 'number' | 'url'
 * @param {boolean} [options.multiline] - Use textarea instead of input
 * @param {number} [options.maxLength] - Max characters
 * @param {string} [options.description] - Small description below title
 * @param {string} [options.confirmLabel] - Custom confirm button label
 * @param {string} [options.confirmColor] - Custom confirm button color (default emerald)
 * @returns {Promise<string|null>}
 */
export function showInputOverlay(options = {}) {
  return new Promise((resolve) => {
    const {
      title = '',
      value = '',
      placeholder = '',
      inputType = 'text',
      multiline = false,
      maxLength,
      description = '',
      confirmLabel,
      confirmColor = 'emerald',
    } = options

    // Remove any existing overlay
    const existing = document.getElementById('spothitch-input-overlay')
    if (existing) existing.remove()

    const escapedValue = escapeHTML(value)
    const colorMap = {
      emerald: { bg: 'rgba(34,197,94,.15)', border: 'rgba(34,197,94,.3)' },
      red: { bg: 'rgba(239,68,68,.15)', border: 'rgba(239,68,68,.3)' },
    }
    const btnStyle = colorMap[confirmColor] || colorMap.emerald

    const overlay = document.createElement('div')
    overlay.id = 'spothitch-input-overlay'
    overlay.className = 'fixed inset-0 z-[60] flex items-center justify-center p-4'
    overlay.innerHTML = `
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" data-overlay-bg></div>
      <div class="relative bg-[#1a1d23] border border-white/10 rounded-2xl w-full max-w-sm p-5 slide-up" onclick="event.stopPropagation()">
        <!-- Title -->
        <h3 class="text-[15px] font-bold text-slate-200 mb-1">${escapeHTML(title)}</h3>
        ${description ? `<p class="text-[11px] text-slate-500 mb-3">${escapeHTML(description)}</p>` : '<div class="mb-3"></div>'}

        <!-- Input -->
        ${multiline ? `
          <textarea
            id="spothitch-overlay-input"
            class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
            style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1)"
            placeholder="${escapeHTML(placeholder)}"
            rows="3"
            ${maxLength ? `maxlength="${maxLength}"` : ''}
          >${escapedValue}</textarea>
        ` : `
          <input
            id="spothitch-overlay-input"
            type="${inputType}"
            class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1)"
            value="${escapedValue}"
            placeholder="${escapeHTML(placeholder)}"
            ${inputType === 'number' ? 'inputmode="numeric"' : ''}
            ${maxLength ? `maxlength="${maxLength}"` : ''}
            autocomplete="off"
          />
        `}
        ${maxLength ? `<p class="text-[9px] text-slate-600 mt-1 text-right">${t('maxChars') || 'max'} ${maxLength}</p>` : ''}

        <!-- Buttons -->
        <div class="flex gap-2 mt-4">
          <button
            data-overlay-cancel
            class="flex-1 py-3 rounded-xl text-slate-400 font-semibold text-sm transition-colors active:bg-white/[0.08]"
            style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08)"
          >
            ${t('cancel') || 'Annuler'}
          </button>
          <button
            data-overlay-confirm
            class="flex-1 py-3 rounded-xl text-white font-bold text-sm transition-colors active:opacity-80"
            style="background:${btnStyle.bg};border:1px solid ${btnStyle.border}"
          >
            ${icon('circle-check', 'w-4 h-4 inline-block mr-1')}
            ${confirmLabel || t('save') || 'OK'}
          </button>
        </div>
      </div>
    `

    document.body.appendChild(overlay)

    const input = document.getElementById('spothitch-overlay-input')
    const cleanup = () => {
      overlay.remove()
    }

    // Focus + cursor at end
    requestAnimationFrame(() => {
      if (input) {
        input.focus()
        if (input.setSelectionRange && input.value) {
          input.setSelectionRange(input.value.length, input.value.length)
        }
      }
    })

    // Cancel
    const cancel = () => { cleanup(); resolve(null) }
    overlay.querySelector('[data-overlay-bg]').addEventListener('click', cancel)
    overlay.querySelector('[data-overlay-cancel]').addEventListener('click', cancel)

    // Confirm
    const confirm = () => {
      const val = input?.value?.trim() ?? ''
      cleanup()
      resolve(val)
    }
    overlay.querySelector('[data-overlay-confirm]').addEventListener('click', confirm)

    // Enter = confirm, Escape = cancel
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !multiline) {
        e.preventDefault()
        confirm()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        cancel()
      }
    })
  })
}
