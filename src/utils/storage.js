/**
 * Storage utilities for localStorage with fallback
 */

const STORAGE_PREFIX = 'spothitch_v4_';

export const Storage = {
  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @returns {any} Parsed value or null
   */
  get(key) {
    try {
      const data = localStorage.getItem(STORAGE_PREFIX + key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn(`Storage.get error for ${key}:`, e);
      return null;
    }
  },

  /**
   * Set item in localStorage with QuotaExceededError handling
   * On quota error: clears old/large entries (analytics, cache), then retries
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @returns {boolean} Success status
   */
  set(key, value) {
    try {
      // lgtm[js/clear-text-storage-of-sensitive-data]
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.warn(`Storage.set quota exceeded for ${key}, clearing old data...`);
        try {
          // Remove non-essential entries: analytics, cache, history, old session data
          const evictPatterns = ['_cache', '_history', 'analytics', '_old', '_backup', '_tmp']
          const allKeys = Object.keys(localStorage)
          // Sort by value size descending to free most space first
          const candidates = allKeys
            .filter(k => evictPatterns.some(p => k.includes(p)))
            .sort((a, b) => (localStorage.getItem(b) || '').length - (localStorage.getItem(a) || '').length)
          for (const k of candidates) {
            localStorage.removeItem(k)
          }
          // Retry the write
          localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
          return true;
        } catch {
          console.warn(`Storage.set still full after cleanup for ${key}`);
          return false;
        }
      }
      if (e.name === 'SecurityError') {
        console.warn(`Storage disabled (private browsing mode?)`)
      } else {
        console.warn(`Storage.set error for ${key}:`, e)
      }
      return false;
    }
  },

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  remove(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
      return true;
    } catch (e) {
      console.warn(`Storage.remove error for ${key}:`, e);
      return false;
    }
  },

  /**
   * Clear all SpotHitch data from localStorage
   */
  clear() {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
      return true;
    } catch (e) {
      console.warn('Storage.clear error:', e);
      return false;
    }
  },

  /**
   * Get current localStorage usage in KB
   * @returns {number} Usage in KB (all keys, not just SpotHitch-prefixed)
   */
  getUsage() {
    try {
      let totalBytes = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        totalBytes += (key.length + (value ? value.length : 0)) * 2; // UTF-16 = 2 bytes per char
      }
      return Math.round(totalBytes / 1024);
    } catch {
      return 0;
    }
  },
};

/**
 * Safe localStorage.setItem wrapper with QuotaExceeded protection.
 * Use this for direct localStorage calls (not prefixed with spothitch_v4_).
 * @param {string} key - Full localStorage key
 * @param {string} value - Value to store (already stringified)
 * @returns {boolean} Success status
 */
export function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.warn(`localStorage quota exceeded for ${key}, clearing old data...`)
      // Try to free space by removing non-essential cached data
      try {
        Object.keys(localStorage)
          .filter(k => k.includes('_cache') || k.includes('_history'))
          .forEach(k => localStorage.removeItem(k))
        localStorage.setItem(key, value)
        return true
      } catch {
        console.error(`localStorage still full after cleanup for ${key}`)
      }
    }
    return false
  }
}
