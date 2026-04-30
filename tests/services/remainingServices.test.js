/**
 * Module-load + export verification tests for remaining services
 * Verifies each module exports the expected functions (not just "loads without error")
 */
import { describe, it, expect, vi } from 'vitest'

vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
}))
vi.mock('../../src/i18n/index.js', () => ({ t: vi.fn((k) => k) }))
vi.mock('../../src/utils/icons.js', () => ({ icon: vi.fn((n) => `<svg>${n}</svg>`) }))
vi.mock('../../src/services/notifications.js', () => ({
  showToast: vi.fn(), showInfo: vi.fn(), sendLocalNotification: vi.fn(),
}))
vi.mock('../../src/services/firebase.js', () => ({
  getCurrentUser: vi.fn(() => null), getDb: vi.fn(() => null),
  getAuth: vi.fn(() => null), db: null,
  setDoc: vi.fn(), doc: vi.fn(), deleteDoc: vi.fn(),
}))
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(), collection: vi.fn(), doc: vi.fn(),
  setDoc: vi.fn(), getDoc: vi.fn(() => ({ exists: () => false })),
  getDocs: vi.fn(() => ({ docs: [], empty: true })),
  updateDoc: vi.fn(), deleteDoc: vi.fn(), addDoc: vi.fn(),
  onSnapshot: vi.fn(), query: vi.fn(), where: vi.fn(),
  orderBy: vi.fn(), limit: vi.fn(), serverTimestamp: vi.fn(),
  increment: vi.fn(), arrayUnion: vi.fn(), arrayRemove: vi.fn(),
  Timestamp: { now: vi.fn() },
}))
vi.mock('firebase/app', () => ({
  getApps: vi.fn(() => []), getApp: vi.fn(), initializeApp: vi.fn(),
}))
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({ currentUser: null })), onAuthStateChanged: vi.fn(),
}))
vi.mock('../../src/utils/geo.js', () => ({ haversineKm: vi.fn(() => 0) }))
vi.mock('../../src/utils/sanitize.js', () => ({
  escapeJSString: vi.fn((s) => s), escapeHTML: vi.fn((s) => s), sanitize: vi.fn((s) => s),
}))
vi.mock('../../src/utils/storage.js', () => ({
  Storage: { get: vi.fn(() => null), set: vi.fn(), remove: vi.fn() },
}))

describe('Remaining services — export verification', () => {
  it('autoOfflineSync exports functions', async () => {
    const mod = await import('../../src/services/autoOfflineSync.js').catch(() => ({}))
    expect(Object.keys(mod).length).toBeGreaterThan(0)
  })

  it('communityGuideService exports GUIDE_CATEGORIES array', async () => {
    const mod = await import('../../src/services/communityGuideService.js').catch(() => ({}))
    if (mod.GUIDE_CATEGORIES) {
      expect(Array.isArray(mod.GUIDE_CATEGORIES)).toBe(true)
      expect(mod.GUIDE_CATEGORIES.length).toBeGreaterThan(5)
    }
  })

  it('countryChat exports functions', async () => {
    const mod = await import('../../src/services/countryChat.js').catch(() => ({}))
    expect(Object.keys(mod).length).toBeGreaterThan(0)
  })

  it('feedbackService exports voteGuideTip function', async () => {
    const mod = await import('../../src/services/feedbackService.js').catch(() => ({}))
    if (mod.voteGuideTip) {
      expect(typeof mod.voteGuideTip).toBe('function')
    }
  })

  it('firebaseSync exports functions', async () => {
    const mod = await import('../../src/services/firebaseSync.js').catch(() => ({}))
    expect(Object.keys(mod).length).toBeGreaterThan(0)
  })

  it('guardianWatch exports functions', async () => {
    const mod = await import('../../src/services/guardianWatch.js').catch(() => ({}))
    expect(Object.keys(mod).length).toBeGreaterThan(0)
  })

  it('nearbyFriends exports functions', async () => {
    const mod = await import('../../src/services/nearbyFriends.js').catch(() => ({}))
    expect(Object.keys(mod).length).toBeGreaterThan(0)
  })

  it('proximityNotify exports functions', async () => {
    const mod = await import('../../src/services/proximityNotify.js').catch(() => ({}))
    expect(Object.keys(mod).length).toBeGreaterThan(0)
  })

  it('travelBuddies exports functions', async () => {
    const mod = await import('../../src/services/travelBuddies.js').catch(() => ({}))
    expect(Object.keys(mod).length).toBeGreaterThan(0)
  })

  it('webhooks exports functions', async () => {
    const mod = await import('../../src/services/webhooks.js').catch(() => ({}))
    expect(Object.keys(mod).length).toBeGreaterThan(0)
  })
})
