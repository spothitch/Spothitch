/**
 * Tests — Friends Service (Firebase)
 * Mock Firestore en mémoire via vi.hoisted()
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// ==================== HOISTED MOCKS (évalués AVANT vi.mock) ====================

const { firestoreDB, mockGetDoc, mockSetDoc, mockDeleteDoc, mockGetDocs, mockWriteBatch } =
  vi.hoisted(() => {
    const firestoreDB = {}

    function makeRef(path) {
      return { _path: path, _id: path.split('/').pop() }
    }

    const mockGetDoc = vi.fn(async (ref) => ({
      exists: () => !!firestoreDB[ref._path],
      data: () => firestoreDB[ref._path] || null,
      id: ref._id,
    }))

    const mockSetDoc = vi.fn(async (ref, data) => {
      firestoreDB[ref._path] = { ...data }
    })

    const mockDeleteDoc = vi.fn(async (ref) => {
      delete firestoreDB[ref._path]
    })

    const mockGetDocs = vi.fn(async (q) => {
      const prefix = (q._collectionPath || '') + '/'
      const docs = Object.entries(firestoreDB)
        .filter(([p]) => p.startsWith(prefix) && !p.slice(prefix.length).includes('/'))
        .map(([path, data]) => ({
          id: path.split('/').pop(),
          data: () => data,
          exists: () => true,
        }))
      return { docs, size: docs.length }
    })

    const mockWriteBatch = vi.fn(() => {
      const ops = []
      return {
        set(ref, data) { ops.push({ type: 'set', path: ref._path, data }); return this },
        delete(ref) { ops.push({ type: 'delete', path: ref._path }); return this },
        async commit() {
          ops.forEach((op) => {
            if (op.type === 'set') firestoreDB[op.path] = { ...op.data }
            else delete firestoreDB[op.path]
          })
          ops.length = 0
        },
      }
    })

    return { firestoreDB, mockGetDoc, mockSetDoc, mockDeleteDoc, mockGetDocs, mockWriteBatch }
  })

// ==================== MOCKS DES MODULES ====================

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => 'mock-db'),
  collection: vi.fn((db, ...parts) => ({ _collectionPath: parts.join('/') })),
  doc: vi.fn((db, ...parts) => {
    const path = (typeof db === 'string' && db !== 'mock-db')
      ? [db, ...parts].join('/')
      : parts.join('/')
    return { _path: path, _id: path.split('/').pop() }
  }),
  getDoc: mockGetDoc,
  getDocs: mockGetDocs,
  setDoc: mockSetDoc,
  deleteDoc: mockDeleteDoc,
  writeBatch: mockWriteBatch,
  query: vi.fn((ref, ...c) => ({ ...ref, _constraints: c })),
  where: vi.fn(() => ({})),
  limit: vi.fn(() => ({})),
  serverTimestamp: vi.fn(() => new Date().toISOString()),
  onSnapshot: vi.fn(),
}))

vi.mock('firebase/app', () => ({
  getApps: vi.fn(() => ['mock-app']),
  getApp: vi.fn(() => 'mock-app'),
}))

vi.mock('../src/stores/state.js', () => ({
  getState: vi.fn(() => ({})),
  setState: vi.fn(),
}))

vi.mock('../src/i18n/index.js', () => ({
  t: vi.fn((k) => k),
}))

let mockCurrentUser = null
vi.mock('../src/services/firebase.js', () => ({
  getCurrentUser: vi.fn(() => mockCurrentUser),
}))

// ==================== IMPORT ====================

import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
} from '../src/services/friends.js'

// ==================== HELPERS ====================

const UID1 = 'user_alice'
const UID2 = 'user_bob'

beforeEach(() => {
  Object.keys(firestoreDB).forEach((k) => delete firestoreDB[k])
  vi.clearAllMocks()
  mockCurrentUser = null

  // Réinitialiser les implémentations après clearAllMocks
  mockGetDoc.mockImplementation(async (ref) => ({
    exists: () => !!firestoreDB[ref._path],
    data: () => firestoreDB[ref._path] || null,
    id: ref._id,
  }))
  mockSetDoc.mockImplementation(async (ref, data) => {
    firestoreDB[ref._path] = { ...data }
  })
  mockDeleteDoc.mockImplementation(async (ref) => {
    delete firestoreDB[ref._path]
  })
  mockGetDocs.mockImplementation(async (q) => {
    const prefix = (q._collectionPath || '') + '/'
    const docs = Object.entries(firestoreDB)
      .filter(([p]) => p.startsWith(prefix) && !p.slice(prefix.length).includes('/'))
      .map(([path, data]) => ({
        id: path.split('/').pop(),
        data: () => data,
        exists: () => true,
      }))
    return { docs, size: docs.length }
  })
  mockWriteBatch.mockImplementation(() => {
    const ops = []
    return {
      set(ref, data) { ops.push({ type: 'set', path: ref._path, data }); return this },
      delete(ref) { ops.push({ type: 'delete', path: ref._path }); return this },
      async commit() {
        ops.forEach((op) => {
          if (op.type === 'set') firestoreDB[op.path] = { ...op.data }
          else delete firestoreDB[op.path]
        })
      },
    }
  })
})

// ==================== TESTS ====================

describe('Friends — sendFriendRequest', () => {
  it('retourne not_authenticated si non connecté', async () => {
    mockCurrentUser = null
    const r = await sendFriendRequest(UID2)
    expect(r.success).toBe(false)
    expect(r.error).toBe('not_authenticated')
  })

  it('retourne cannot_add_self si même UID', async () => {
    mockCurrentUser = { uid: UID1, displayName: 'Alice' }
    const r = await sendFriendRequest(UID1)
    expect(r.success).toBe(false)
    expect(r.error).toBe('cannot_add_self')
  })

  it('retourne already_friends si relation existe', async () => {
    mockCurrentUser = { uid: UID1, displayName: 'Alice' }
    firestoreDB[`users/${UID1}/friends/${UID2}`] = { id: UID2 }
    const r = await sendFriendRequest(UID2)
    expect(r.success).toBe(false)
    expect(r.error).toBe('already_friends')
  })

  it('retourne request_already_sent si demande existe', async () => {
    mockCurrentUser = { uid: UID1, displayName: 'Alice' }
    firestoreDB[`users/${UID2}/friendRequests/${UID1}`] = { fromUserId: UID1 }
    const r = await sendFriendRequest(UID2)
    expect(r.success).toBe(false)
    expect(r.error).toBe('request_already_sent')
  })

  it('crée la demande dans friendRequests du destinataire', async () => {
    mockCurrentUser = { uid: UID1, displayName: 'Alice', photoURL: null }
    const r = await sendFriendRequest(UID2)
    expect(r.success).toBe(true)
    expect(mockSetDoc).toHaveBeenCalledWith(
      expect.objectContaining({ _path: `users/${UID2}/friendRequests/${UID1}` }),
      expect.objectContaining({ fromUserId: UID1, name: 'Alice' })
    )
  })
})

describe('Friends — acceptFriendRequest', () => {
  beforeEach(() => {
    mockCurrentUser = { uid: UID2, displayName: 'Bob', photoURL: null }
    firestoreDB[`users/${UID2}/friendRequests/${UID1}`] = {
      id: UID1, fromUserId: UID1, name: 'Alice', avatar: '🤙',
    }
  })

  it('retourne not_authenticated si non connecté', async () => {
    mockCurrentUser = null
    const r = await acceptFriendRequest(UID1)
    expect(r.success).toBe(false)
    expect(r.error).toBe('not_authenticated')
  })

  it('retourne request_not_found si demande introuvable', async () => {
    const r = await acceptFriendRequest('unknown')
    expect(r.success).toBe(false)
    expect(r.error).toBe('request_not_found')
  })

  it('crée la relation d\'amitié DES DEUX CÔTÉS', async () => {
    const r = await acceptFriendRequest(UID1)
    expect(r.success).toBe(true)
    // Bob a Alice dans ses amis
    expect(firestoreDB[`users/${UID2}/friends/${UID1}`]).toBeDefined()
    expect(firestoreDB[`users/${UID2}/friends/${UID1}`].id).toBe(UID1)
    // Alice a Bob dans ses amis
    expect(firestoreDB[`users/${UID1}/friends/${UID2}`]).toBeDefined()
    expect(firestoreDB[`users/${UID1}/friends/${UID2}`].id).toBe(UID2)
  })

  it('supprime la demande après acceptation', async () => {
    expect(firestoreDB[`users/${UID2}/friendRequests/${UID1}`]).toBeDefined()
    await acceptFriendRequest(UID1)
    expect(firestoreDB[`users/${UID2}/friendRequests/${UID1}`]).toBeUndefined()
  })
})

describe('Friends — declineFriendRequest', () => {
  beforeEach(() => {
    mockCurrentUser = { uid: UID2, displayName: 'Bob' }
    firestoreDB[`users/${UID2}/friendRequests/${UID1}`] = { fromUserId: UID1 }
  })

  it('retourne not_authenticated si non connecté', async () => {
    mockCurrentUser = null
    const r = await declineFriendRequest(UID1)
    expect(r.success).toBe(false)
  })

  it('supprime la demande', async () => {
    const r = await declineFriendRequest(UID1)
    expect(r.success).toBe(true)
    expect(mockDeleteDoc).toHaveBeenCalledWith(
      expect.objectContaining({ _path: `users/${UID2}/friendRequests/${UID1}` })
    )
  })
})

describe('Friends — removeFriend', () => {
  beforeEach(() => {
    mockCurrentUser = { uid: UID1, displayName: 'Alice' }
    firestoreDB[`users/${UID1}/friends/${UID2}`] = { id: UID2 }
    firestoreDB[`users/${UID2}/friends/${UID1}`] = { id: UID1 }
  })

  it('retourne not_authenticated si non connecté', async () => {
    mockCurrentUser = null
    const r = await removeFriend(UID2)
    expect(r.success).toBe(false)
  })

  it('supprime l\'ami des DEUX côtés via batch', async () => {
    const r = await removeFriend(UID2)
    expect(r.success).toBe(true)
    expect(firestoreDB[`users/${UID1}/friends/${UID2}`]).toBeUndefined()
    expect(firestoreDB[`users/${UID2}/friends/${UID1}`]).toBeUndefined()
  })
})
