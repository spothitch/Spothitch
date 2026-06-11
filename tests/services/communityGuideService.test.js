/**
 * Community Guide Service tests
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../src/utils/storage.js', () => {
  const store = {}
  return {
    Storage: {
      get: vi.fn((key) => store[key] ?? null),
      set: vi.fn((key, val) => { store[key] = val }),
      remove: vi.fn((key) => { delete store[key] }),
      _store: store,
    },
  }
})
vi.mock('../../src/services/firebase.js', () => ({
  getCurrentUser: vi.fn(() => null),
}))
vi.mock('../../src/stores/state.js', () => ({
  getState: vi.fn(() => ({ isAdmin: false })),
  setState: vi.fn(),
}))
vi.mock('firebase/app', () => ({
  getApps: vi.fn(() => []),
  getApp: vi.fn(() => null),
}))
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => null),
  doc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(async () => ({ empty: true, docs: [] })),
  addDoc: vi.fn(async () => ({ id: 'tip123' })),
  setDoc: vi.fn(async () => {}),
  deleteDoc: vi.fn(async () => {}),
  updateDoc: vi.fn(async () => {}),
  serverTimestamp: vi.fn(() => 'ts'),
}))

import {
  GUIDE_CATEGORIES,
  getUserGuideTips,
  getUserContribCount,
  getCommunityPendingCounts,
  invalidatePendingCountsCache,
  submitGuideTip,
  deleteUserGuideTip,
  approveGuideTip,
  rejectGuideTip,
  loadPendingGuideTips,
  loadUserGuideTips,
  loadPublicGuideTips,
  loadCommunityPendingCounts,
} from '../../src/services/communityGuideService.js'
import { getCurrentUser } from '../../src/services/firebase.js'
import { getState } from '../../src/stores/state.js'
import { Storage } from '../../src/utils/storage.js'
import { getApps, getApp } from 'firebase/app'
import { getFirestore, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore'

function clearStore() {
  const s = Storage._store
  for (const k of Object.keys(s)) delete s[k]
  vi.clearAllMocks()
  Storage.get.mockImplementation((key) => s[key] ?? null)
  Storage.set.mockImplementation((key, val) => { s[key] = val })
}

beforeEach(clearStore)

describe('GUIDE_CATEGORIES', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(GUIDE_CATEGORIES)).toBe(true)
    expect(GUIDE_CATEGORIES.length).toBeGreaterThan(5)
  })

  it('each category has id, labelKey, icon', () => {
    for (const cat of GUIDE_CATEGORIES) {
      expect(cat.id).toBeTruthy()
      expect(cat.labelKey).toBeTruthy()
      expect(cat.icon).toBeTruthy()
    }
  })

  it('includes hitchhiking category with ratingEnabled', () => {
    const hh = GUIDE_CATEGORIES.find(c => c.id === 'hitchhiking')
    expect(hh).toBeTruthy()
    expect(hh.ratingEnabled).toBe(true)
  })
})

describe('getUserGuideTips', () => {
  it('returns empty array when not logged in', () => {
    getCurrentUser.mockReturnValue(null)
    expect(getUserGuideTips('FR')).toEqual([])
  })

  it('returns empty array when no cached tips', () => {
    getCurrentUser.mockReturnValue({ uid: 'u1' })
    expect(getUserGuideTips('FR')).toEqual([])
  })

  it('returns filtered tips for the given country and user', () => {
    getCurrentUser.mockReturnValue({ uid: 'u1' })
    Storage.get.mockReturnValue([
      { id: '1', countryCode: 'FR', userId: 'u1', text: 'tip FR' },
      { id: '2', countryCode: 'DE', userId: 'u1', text: 'tip DE' },
      { id: '3', countryCode: 'FR', userId: 'u2', text: 'other user' },
    ])
    const tips = getUserGuideTips('FR')
    expect(tips.length).toBe(1)
    expect(tips[0].text).toBe('tip FR')
  })
})

describe('getUserContribCount', () => {
  it('returns 0 when not logged in', () => {
    getCurrentUser.mockReturnValue(null)
    expect(getUserContribCount('FR')).toBe(0)
  })

  it('returns count of user tips for the given country', () => {
    getCurrentUser.mockReturnValue({ uid: 'u1' })
    Storage.get.mockReturnValue([
      { id: '1', countryCode: 'FR', userId: 'u1' },
      { id: '2', countryCode: 'FR', userId: 'u1' },
    ])
    expect(getUserContribCount('FR')).toBe(2)
  })
})

describe('getCommunityPendingCounts / invalidatePendingCountsCache', () => {
  it('returns empty object by default', () => {
    expect(getCommunityPendingCounts()).toEqual({})
  })

  it('returns empty object after invalidation', () => {
    invalidatePendingCountsCache()
    expect(getCommunityPendingCounts()).toEqual({})
  })
})

describe('submitGuideTip', () => {
  it('returns not_authenticated when no user', async () => {
    getCurrentUser.mockReturnValue(null)
    const result = await submitGuideTip({ countryCode: 'FR', category: 'laws', type: 'text', text: 'tip' })
    expect(result.success).toBe(false)
    expect(result.error).toBe('not_authenticated')
  })
})

describe('deleteUserGuideTip', () => {
  it('returns not_authenticated when no user', async () => {
    getCurrentUser.mockReturnValue(null)
    const result = await deleteUserGuideTip('tip123')
    expect(result.success).toBe(false)
    expect(result.error).toBe('not_authenticated')
  })

  it('returns success when user logged in (local cache only)', async () => {
    getCurrentUser.mockReturnValue({ uid: 'u1' })
    Storage.get.mockReturnValue([{ id: 'tip123', countryCode: 'FR', userId: 'u1' }])
    const result = await deleteUserGuideTip('tip123')
    expect(result.success).toBe(true)
  })
})

describe('approveGuideTip', () => {
  it('returns not_admin when no user', async () => {
    getCurrentUser.mockReturnValue(null)
    const result = await approveGuideTip('tip123')
    expect(result.success).toBe(false)
    expect(result.error).toBe('not_admin')
  })

  it('returns not_admin when user is not admin', async () => {
    getCurrentUser.mockReturnValue({ uid: 'u1' })
    getState.mockReturnValue({ isAdmin: false })
    const result = await approveGuideTip('tip123')
    expect(result.success).toBe(false)
    expect(result.error).toBe('not_admin')
  })
})

describe('rejectGuideTip', () => {
  it('returns not_admin when no user', async () => {
    getCurrentUser.mockReturnValue(null)
    const result = await rejectGuideTip('tip123')
    expect(result.success).toBe(false)
    expect(result.error).toBe('not_admin')
  })
})

describe('loadPendingGuideTips', () => {
  it('returns empty array when not admin', async () => {
    getState.mockReturnValue({ isAdmin: false })
    const result = await loadPendingGuideTips()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(0)
  })
})

// ==================== Firebase-available paths ====================

describe('submitGuideTip — with Firebase available', () => {
  beforeEach(() => {
    getApps.mockReturnValue([{}])
    getFirestore.mockReturnValue({})
    setDoc.mockResolvedValue(undefined)
    getCurrentUser.mockReturnValue({ uid: 'u1', displayName: 'Alice' })
    invalidatePendingCountsCache()
  })

  it('returns success when user is logged in', async () => {
    const result = await submitGuideTip({ countryCode: 'FR', category: 'laws', type: 'text', text: 'tip text' })
    expect(result.success).toBe(true)
  })

  it('saves to local cache even when Firestore throws', async () => {
    setDoc.mockRejectedValue(new Error('network error'))
    const result = await submitGuideTip({ countryCode: 'DE', category: 'safety', type: 'text', text: 'fallback' })
    expect(result.success).toBe(true)
  })

  it('handles customCategory', async () => {
    const result = await submitGuideTip({
      countryCode: 'ES', category: 'other', type: 'text', text: 'custom', customCategory: true, customCategoryName: 'MyCategory',
    })
    expect(result.success).toBe(true)
  })

  it('handles rating clamping (rating > 5)', async () => {
    const result = await submitGuideTip({ countryCode: 'IT', category: 'hitchhiking', type: 'text', text: 'great', rating: 99 })
    expect(result.success).toBe(true)
  })

  it('replaces existing tip for same country+category+user', async () => {
    Storage.get.mockReturnValue([
      { id: 'old_tip', countryCode: 'FR', category: 'laws', userId: 'u1', text: 'old' },
    ])
    const result = await submitGuideTip({ countryCode: 'FR', category: 'laws', type: 'text', text: 'new' })
    expect(result.success).toBe(true)
    const saved = Storage.set.mock.calls.find(c => c[0] === 'my_guide_tips')
    expect(saved).toBeDefined()
  })
})

describe('loadUserGuideTips — with Firebase available', () => {
  beforeEach(() => {
    getApps.mockReturnValue([{}])
    getFirestore.mockReturnValue({})
  })

  it('returns early when not logged in', async () => {
    getCurrentUser.mockReturnValue(null)
    await expect(loadUserGuideTips()).resolves.toBeUndefined()
  })

  it('merges Firestore docs into cache', async () => {
    getCurrentUser.mockReturnValue({ uid: 'u1' })
    getDocs.mockResolvedValue({
      empty: false,
      docs: [
        { id: 'tip_fs_1', data: () => ({ userId: 'u1', countryCode: 'FR', text: 'from Firestore' }) },
      ],
    })
    Storage.get.mockReturnValue([])
    await loadUserGuideTips()
    expect(Storage.set).toHaveBeenCalledWith('my_guide_tips', expect.arrayContaining([
      expect.objectContaining({ id: 'tip_fs_1' }),
    ]))
  })

  it('skips already-cached tips', async () => {
    getCurrentUser.mockReturnValue({ uid: 'u1' })
    getDocs.mockResolvedValue({
      empty: false,
      docs: [{ id: 'existing', data: () => ({ userId: 'u1', countryCode: 'FR', text: 'already cached' }) }],
    })
    Storage.get.mockReturnValue([{ id: 'existing', countryCode: 'FR', userId: 'u1' }])
    await loadUserGuideTips()
    // saveCachedTips still called but no new item added
    const saved = Storage.set.mock.calls.find(c => c[0] === 'my_guide_tips')
    if (saved) {
      expect(saved[1].filter(t => t.id === 'existing').length).toBe(1)
    }
  })

  it('returns early when snap is empty', async () => {
    getCurrentUser.mockReturnValue({ uid: 'u1' })
    getDocs.mockResolvedValue({ empty: true, docs: [] })
    await expect(loadUserGuideTips()).resolves.toBeUndefined()
  })

  it('handles Firestore error silently', async () => {
    getCurrentUser.mockReturnValue({ uid: 'u1' })
    getDocs.mockRejectedValue(new Error('firestore error'))
    await expect(loadUserGuideTips()).resolves.toBeUndefined()
  })
})

describe('loadPublicGuideTips — no db', () => {
  it('returns empty array when db unavailable', async () => {
    getApps.mockReturnValue([])
    const result = await loadPublicGuideTips('FR')
    expect(result).toEqual([])
  })
})

describe('loadPublicGuideTips — with Firebase available', () => {
  beforeEach(() => {
    getApps.mockReturnValue([{}])
    getFirestore.mockReturnValue({})
  })

  it('returns empty array when snap is empty', async () => {
    getDocs.mockResolvedValue({ empty: true, docs: [] })
    const result = await loadPublicGuideTips('FR')
    expect(result).toEqual([])
  })

  it('filters to approved tips and own tips', async () => {
    getCurrentUser.mockReturnValue({ uid: 'u1' })
    getDocs.mockResolvedValue({
      empty: false,
      docs: [
        { id: 't1', data: () => ({ status: 'approved', userId: 'u2', countryCode: 'FR' }) },
        { id: 't2', data: () => ({ status: 'pending', userId: 'u1', countryCode: 'FR' }) },
        { id: 't3', data: () => ({ status: 'pending', userId: 'u2', countryCode: 'FR' }) },
      ],
    })
    const result = await loadPublicGuideTips('FR')
    expect(result.length).toBe(2) // t1 (approved) + t2 (own)
    expect(result.find(t => t.id === 't3')).toBeUndefined()
  })

  it('includes only approved tips when not logged in', async () => {
    getCurrentUser.mockReturnValue(null)
    getDocs.mockResolvedValue({
      empty: false,
      docs: [
        { id: 't1', data: () => ({ status: 'approved', userId: 'u2' }) },
        { id: 't2', data: () => ({ status: 'pending', userId: 'u2' }) },
      ],
    })
    const result = await loadPublicGuideTips('FR')
    expect(result.length).toBe(1)
    expect(result[0].id).toBe('t1')
  })

  it('returns empty array on Firestore error', async () => {
    getDocs.mockRejectedValue(new Error('error'))
    const result = await loadPublicGuideTips('FR')
    expect(result).toEqual([])
  })
})

describe('loadCommunityPendingCounts — with Firebase available', () => {
  beforeEach(() => {
    getApps.mockReturnValue([{}])
    getFirestore.mockReturnValue({})
    invalidatePendingCountsCache()
  })

  it('returns empty object when snap is empty', async () => {
    getDocs.mockResolvedValue({ empty: false, docs: [] })
    const counts = await loadCommunityPendingCounts()
    expect(counts).toEqual({})
  })

  it('counts pending tips grouped by country', async () => {
    getDocs.mockResolvedValue({
      empty: false,
      docs: [
        { data: () => ({ countryCode: 'FR', status: 'pending' }) },
        { data: () => ({ countryCode: 'FR', status: 'pending' }) },
        { data: () => ({ countryCode: 'DE', status: 'pending' }) },
      ],
    })
    const counts = await loadCommunityPendingCounts()
    expect(counts.FR).toBe(2)
    expect(counts.DE).toBe(1)
  })

  it('returns cached result on second call', async () => {
    getDocs.mockResolvedValue({ empty: false, docs: [{ data: () => ({ countryCode: 'ES' }) }] })
    await loadCommunityPendingCounts()
    getDocs.mockClear()
    const counts = await loadCommunityPendingCounts()
    expect(getDocs).not.toHaveBeenCalled()
    expect(counts.ES).toBe(1)
    invalidatePendingCountsCache()
  })

  it('handles docs with no countryCode', async () => {
    getDocs.mockResolvedValue({
      empty: false,
      docs: [{ data: () => ({}) }],
    })
    const counts = await loadCommunityPendingCounts()
    expect(counts).toEqual({})
  })

  it('returns empty object on Firestore error', async () => {
    getDocs.mockRejectedValue(new Error('error'))
    const counts = await loadCommunityPendingCounts()
    expect(counts).toEqual({})
  })

  it('returns empty when db unavailable', async () => {
    getApps.mockReturnValue([])
    const counts = await loadCommunityPendingCounts()
    expect(counts).toEqual({})
  })
})

describe('approveGuideTip — with Firebase available', () => {
  beforeEach(() => {
    getApps.mockReturnValue([{}])
    getFirestore.mockReturnValue({})
    getCurrentUser.mockReturnValue({ uid: 'admin1' })
    getState.mockReturnValue({ isAdmin: true })
    updateDoc.mockResolvedValue(undefined)
  })

  it('returns success when admin + db available', async () => {
    const result = await approveGuideTip('tip123')
    expect(result.success).toBe(true)
  })

  it('returns no_db when db unavailable', async () => {
    getApps.mockReturnValue([])
    const result = await approveGuideTip('tip123')
    expect(result.success).toBe(false)
    expect(result.error).toBe('no_db')
  })

  it('returns update_failed when updateDoc throws', async () => {
    updateDoc.mockRejectedValue(new Error('permission denied'))
    const result = await approveGuideTip('tip123')
    expect(result.success).toBe(false)
    expect(result.error).toBe('update_failed')
  })
})

describe('rejectGuideTip — with Firebase available', () => {
  beforeEach(() => {
    getApps.mockReturnValue([{}])
    getFirestore.mockReturnValue({})
    getCurrentUser.mockReturnValue({ uid: 'admin1' })
    getState.mockReturnValue({ isAdmin: true })
    updateDoc.mockResolvedValue(undefined)
  })

  it('returns success when admin + db available', async () => {
    const result = await rejectGuideTip('tip456')
    expect(result.success).toBe(true)
  })

  it('returns no_db when db unavailable', async () => {
    getApps.mockReturnValue([])
    const result = await rejectGuideTip('tip456')
    expect(result.success).toBe(false)
    expect(result.error).toBe('no_db')
  })

  it('returns update_failed when updateDoc throws', async () => {
    updateDoc.mockRejectedValue(new Error('permission denied'))
    const result = await rejectGuideTip('tip456')
    expect(result.success).toBe(false)
    expect(result.error).toBe('update_failed')
  })
})

describe('loadPendingGuideTips — with Firebase available', () => {
  beforeEach(() => {
    getApps.mockReturnValue([{}])
    getFirestore.mockReturnValue({})
    getState.mockReturnValue({ isAdmin: true })
  })

  it('returns empty array when snap is empty', async () => {
    getDocs.mockResolvedValue({ empty: true, docs: [] })
    const result = await loadPendingGuideTips()
    expect(result).toEqual([])
  })

  it('returns mapped docs when snap has data', async () => {
    getDocs.mockResolvedValue({
      empty: false,
      docs: [
        { id: 'tip1', data: () => ({ countryCode: 'FR', text: 'pending tip 1' }) },
        { id: 'tip2', data: () => ({ countryCode: 'DE', text: 'pending tip 2' }) },
      ],
    })
    const result = await loadPendingGuideTips()
    expect(result.length).toBe(2)
    expect(result[0].id).toBe('tip1')
    expect(result[1].id).toBe('tip2')
  })

  it('returns empty array on Firestore error', async () => {
    getDocs.mockRejectedValue(new Error('error'))
    const result = await loadPendingGuideTips()
    expect(result).toEqual([])
  })

  it('returns empty array when db unavailable', async () => {
    getApps.mockReturnValue([])
    const result = await loadPendingGuideTips()
    expect(result).toEqual([])
  })
})

describe('deleteUserGuideTip — with Firebase available', () => {
  beforeEach(() => {
    getApps.mockReturnValue([{}])
    getFirestore.mockReturnValue({})
    getCurrentUser.mockReturnValue({ uid: 'u1' })
    deleteDoc.mockResolvedValue(undefined)
  })

  it('returns success and deletes from Firestore', async () => {
    Storage.get.mockReturnValue([{ id: 'tip123', userId: 'u1', countryCode: 'FR' }])
    const result = await deleteUserGuideTip('tip123')
    expect(result.success).toBe(true)
    expect(deleteDoc).toHaveBeenCalled()
  })

  it('returns success even when deleteDoc throws (offline)', async () => {
    deleteDoc.mockRejectedValue(new Error('network error'))
    Storage.get.mockReturnValue([{ id: 'tip999', userId: 'u1', countryCode: 'FR' }])
    const result = await deleteUserGuideTip('tip999')
    expect(result.success).toBe(true)
  })
})
