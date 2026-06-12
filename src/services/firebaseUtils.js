/**
 * Firebase Utilities
 * Pure utility functions that do not depend on Firebase instances (auth, db, storage).
 * Extracted from firebase.js to reduce file size and improve testability.
 */

// ==================== CLIENT-SIDE WRITE RATE LIMITER ====================

/**
 * Simple in-memory rate limiter for Firestore write operations.
 * Tracks timestamps per operation type and rejects if limit exceeded.
 * @param {string} opName - operation identifier (e.g. 'addSpot')
 * @param {number} maxPerMinute - max allowed writes per 60s window
 * @returns {{ allowed: boolean }} - whether the write is allowed
 */
const _rateLimitBuckets = {}
export function checkWriteRateLimit(opName, maxPerMinute) {
  const now = Date.now()
  const windowMs = 60_000
  if (!_rateLimitBuckets[opName]) _rateLimitBuckets[opName] = []
  // Purge entries older than 60s + cap bucket size to prevent memory growth
  _rateLimitBuckets[opName] = _rateLimitBuckets[opName].filter((ts) => now - ts < windowMs)
  if (_rateLimitBuckets[opName].length > 500) _rateLimitBuckets[opName] = _rateLimitBuckets[opName].slice(-maxPerMinute)
  if (_rateLimitBuckets[opName].length >= maxPerMinute) {
    console.warn(`Rate limit exceeded for ${opName}: ${maxPerMinute}/min`)
    return { allowed: false }
  }
  _rateLimitBuckets[opName].push(now)
  return { allowed: true }
}

// ==================== RETRY WRAPPER FOR NETWORK ERRORS ====================

/**
 * Retry a function with exponential backoff on network errors.
 * @param {Function} fn - async function to call
 * @param {number} maxAttempts - max retry attempts (default 3)
 * @returns {Promise<*>} result of fn()
 */
export async function withRetry(fn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      const isNetworkError =
        error?.code === 'unavailable' ||
        error?.code === 'network-request-failed' ||
        error?.message?.includes('network') ||
        error?.message?.includes('Failed to fetch')
      if (!isNetworkError || attempt >= maxAttempts) {
        throw error
      }
      const delay = Math.pow(2, attempt - 1) * 1000 // 1s, 2s, 4s
      console.warn(`[withRetry] Attempt ${attempt}/${maxAttempts} failed, retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

// ==================== USERNAME SYSTEM ====================

// Basic profanity filter — common offensive words in EN/FR/ES/DE
export const PROFANITY_LIST = [
  'fuck', 'shit', 'ass', 'bitch', 'dick', 'cock', 'pussy', 'nigger', 'faggot',
  'merde', 'putain', 'connard', 'connasse', 'salope', 'enculer', 'nique',
  'puta', 'mierda', 'coño', 'joder', 'cabron',
  'scheiße', 'scheisse', 'arschloch', 'hurensohn', 'fotze', 'wichser',
  'admin', 'spothitch', 'moderator', 'support', 'system', 'root',
]

/**
 * Check if text contains profanity. Used for usernames, spot names, reviews, messages.
 * @param {string} text
 * @returns {boolean} true if profanity detected
 */
export function containsProfanity(text) {
  if (!text) return false
  const lower = text.toLowerCase().replace(/[._\-\s]/g, '')
  return PROFANITY_LIST.some(w => lower.includes(w))
}

/**
 * Validate username format (client-side, before Firestore check)
 * Rules: 3-20 chars, lowercase alphanumeric + _ + ., no start/end with . or _
 * @param {string} username
 * @returns {{ valid: boolean, errorKey: string|null }}
 */
export function validateUsername(username) {
  if (!username) return { valid: false, errorKey: 'usernameRequired' }
  const u = username.toLowerCase().trim()
  if (u.length < 3) return { valid: false, errorKey: 'usernameTooShort' }
  if (u.length > 20) return { valid: false, errorKey: 'usernameTooLong' }
  if (!/^[a-z0-9._]+$/.test(u)) return { valid: false, errorKey: 'usernameInvalidChars' }
  if (/^[._]|[._]$/.test(u)) return { valid: false, errorKey: 'usernameInvalidFormat' }
  if (/[.]{2}|[_]{2}/.test(u)) return { valid: false, errorKey: 'usernameInvalidFormat' }
  // Profanity check
  const lower = u.replace(/[._]/g, '')
  if (PROFANITY_LIST.some(w => lower.includes(w))) return { valid: false, errorKey: 'usernameProfanity' }
  return { valid: true, errorKey: null }
}
