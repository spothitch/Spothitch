/**
 * Tests — Direct Messages Service (Firebase)
 * Mock Firestore en mémoire via vi.hoisted()
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// ==================== HOISTED MOCKS ====================

const { firestoreDB, mockAddDoc, mockSetDoc, mockUpdateDoc, mockGetDocs, mockGetDoc } =
  vi.hoisted(() => {
    const firestoreDB = {}

    const mockAddDoc = vi.fn(async (collRef, data) => {
      const id = `msg_${Date.now()}`
      const path = (collRef._collectionPath || 'msgs') + '/' + id
      firestoreDB[path] = { ...data }
      return { id }
    })

    const mockSetDoc = vi.fn(async (ref, data, options) => {
      if (options?.merge) {
        firestoreDB[ref._path] = { ...(firestoreDB[ref._path] || {}), ...data }
      } else {
        firestoreDB[ref._path] = { ...data }
      }
    })

    const mockUpdateDoc = vi.fn(async (ref, data) => {
      const current = firestoreDB[ref._path] || {}
      Object.entries(data).forEach(([key, val]) => {
        if (key.includes('.')) {
          const [obj, field] = key.split('.')
          if (!current[obj]) current[obj] = {}
          current[obj][field] = typeof val === 'number' ? (current[obj][field] || 0) + val : val
        } else {
          current[key] = val
        }
      })
      firestoreDB[ref._path] = current
    })

    const mockGetDocs = vi.fn(async (q) => {
      const prefix = (q._collectionPath || '') + '/'
      const docs = Object.entries(firestoreDB)
        .filter(([p]) => p.startsWith(prefix) && !p.slice(prefix.length).includes('/'))
        .map(([path, data]) => ({ id: path.split('/').pop(), data: () => data }))
      return { docs, size: docs.length }
    })

    const mockGetDoc = vi.fn(async (ref) => ({
      exists: () => !!firestoreDB[ref._path],
      data: () => firestoreDB[ref._path] || null,
    }))

    return { firestoreDB, mockAddDoc, mockSetDoc, mockUpdateDoc, mockGetDocs, mockGetDoc }
  })

// ==================== MOCKS MODULES ====================

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => 'mock-db'),
  collection: vi.fn((db, ...parts) => ({ _collectionPath: parts.join('/') })),
  doc: vi.fn((db, ...parts) => {
    const path = (typeof db === 'string' && db !== 'mock-db')
      ? [db, ...parts].join('/')
      : parts.join('/')
    return { _path: path, _id: path.split('/').pop() }
  }),
  addDoc: mockAddDoc,
  setDoc: mockSetDoc,
  updateDoc: mockUpdateDoc,
  getDocs: mockGetDocs,
  getDoc: mockGetDoc,
  query: vi.fn((ref, ...c) => ({ ...ref, _constraints: c })),
  where: vi.fn(() => ({})),
  limit: vi.fn(() => ({})),
  orderBy: vi.fn(() => ({})),
  serverTimestamp: vi.fn(() => '2026-03-04T00:00:00Z'),
  increment: vi.fn((n) => n),
  arrayUnion: vi.fn((...args) => args),
  arrayRemove: vi.fn((...args) => args),
  onSnapshot: vi.fn(() => vi.fn()),
  writeBatch: vi.fn(),
  deleteDoc: vi.fn(),
  enableNetwork: vi.fn(),
  disableNetwork: vi.fn(),
  runTransaction: vi.fn(),
  setDoc: mockSetDoc,
}))

vi.mock('firebase/app', () => ({
  getApps: vi.fn(() => ['mock-app']),
  getApp: vi.fn(() => 'mock-app'),
}))

let mockState = {
  user: { uid: 'user_alice', displayName: 'Alice' },
  username: 'alice',
  avatar: '🤙',
  friends: [],
}

vi.mock('../src/stores/state.js', () => ({
  getState: vi.fn(() => mockState),
  setState: vi.fn(),
}))

vi.mock('../src/i18n/index.js', () => ({
  t: vi.fn((k) => k),
}))

const { mockStorageGet, mockStorageSet } = vi.hoisted(() => ({
  mockStorageGet: vi.fn(() => null),
  mockStorageSet: vi.fn(),
}))

vi.mock('../src/utils/storage.js', () => ({
  Storage: {
    get: mockStorageGet,
    set: mockStorageSet,
  },
}))

// ==================== IMPORT ====================

import {
  sendDirectMessage,
  getConversationMessages,
  getConversationsList,
  markConversationRead,
  getUnreadCount,
  getTotalUnreadCount,
  getConversationId,
} from '../src/services/directMessages.js'

// ==================== HELPERS ====================

const UID_ALICE = 'user_alice'
const UID_BOB = 'user_bob'

beforeEach(() => {
  Object.keys(firestoreDB).forEach((k) => delete firestoreDB[k])
  vi.clearAllMocks()
  mockState = {
    user: { uid: UID_ALICE, displayName: 'Alice' },
    username: 'alice',
    avatar: '🤙',
    friends: [],
  }
  mockStorageGet.mockReturnValue(null)

  // Réinitialiser les implémentations
  mockAddDoc.mockImplementation(async (collRef, data) => {
    const id = `msg_${Date.now()}`
    const path = (collRef._collectionPath || 'msgs') + '/' + id
    firestoreDB[path] = { ...data }
    return { id }
  })
  mockSetDoc.mockImplementation(async (ref, data, options) => {
    if (options?.merge) {
      firestoreDB[ref._path] = { ...(firestoreDB[ref._path] || {}), ...data }
    } else {
      firestoreDB[ref._path] = { ...data }
    }
  })
  mockUpdateDoc.mockImplementation(async (ref, data) => {
    const current = firestoreDB[ref._path] || {}
    Object.entries(data).forEach(([key, val]) => {
      if (key.includes('.')) {
        const [obj, field] = key.split('.')
        if (!current[obj]) current[obj] = {}
        current[obj][field] = typeof val === 'number' ? (current[obj][field] || 0) + val : val
      } else {
        current[key] = val
      }
    })
    firestoreDB[ref._path] = current
  })
  mockGetDoc.mockImplementation(async (ref) => ({
    exists: () => !!firestoreDB[ref._path],
    data: () => firestoreDB[ref._path] || null,
  }))
})

// ==================== TESTS ====================

describe('DirectMessages — getConversationId', () => {
  it('génère un ID déterministe (UIDs triés)', () => {
    const a = getConversationId('aaa', 'zzz')
    const b = getConversationId('zzz', 'aaa')
    expect(a).toBe(b)
    expect(a).toBe('aaa_dm_zzz')
  })

  it('contient les deux UIDs séparés par _dm_', () => {
    const id = getConversationId(UID_ALICE, UID_BOB)
    expect(id).toContain('_dm_')
    expect(id).toContain(UID_ALICE)
    expect(id).toContain(UID_BOB)
  })

  it('est symétrique : (A, B) === (B, A)', () => {
    expect(getConversationId(UID_ALICE, UID_BOB)).toBe(
      getConversationId(UID_BOB, UID_ALICE)
    )
  })
})

describe('DirectMessages — sendDirectMessage (Firestore)', () => {
  it('retourne no_recipient si recipientId vide', async () => {
    const r = await sendDirectMessage('', 'Bonjour')
    expect(r.success).toBe(false)
    expect(r.error).toBe('no_recipient')
  })

  it('retourne empty_message si texte vide', async () => {
    const r = await sendDirectMessage(UID_BOB, '')
    expect(r.success).toBe(false)
    expect(r.error).toBe('empty_message')
  })

  it('retourne empty_message si texte = espaces', async () => {
    const r = await sendDirectMessage(UID_BOB, '   ')
    expect(r.success).toBe(false)
    expect(r.error).toBe('empty_message')
  })

  it('envoie le message dans la subcollection Firestore', async () => {
    const r = await sendDirectMessage(UID_BOB, 'Salut Bob !')
    expect(r.success).toBe(true)
    expect(mockAddDoc).toHaveBeenCalledOnce()

    const [collRef, msgData] = mockAddDoc.mock.calls[0]
    const convId = getConversationId(UID_ALICE, UID_BOB)
    expect(collRef._collectionPath).toBe(`directMessages/${convId}/messages`)
    expect(msgData.text).toBe('Salut Bob !')
    expect(msgData.senderId).toBe(UID_ALICE)
    expect(msgData.recipientId).toBe(UID_BOB)
    expect(msgData.type).toBe('text')
    expect(msgData.read).toBe(false)
  })

  it('crée les métadonnées de conversation (setDoc + merge)', async () => {
    await sendDirectMessage(UID_BOB, 'Coucou')
    expect(mockSetDoc).toHaveBeenCalledOnce()
    const [, convData, options] = mockSetDoc.mock.calls[0]
    expect(convData.participants).toContain(UID_ALICE)
    expect(convData.participants).toContain(UID_BOB)
    expect(convData.lastMessage.text).toBe('Coucou')
    expect(convData.lastMessage.senderId).toBe(UID_ALICE)
    expect(options?.merge).toBe(true)
  })

  it('incrémente le compteur non-lu du destinataire', async () => {
    await sendDirectMessage(UID_BOB, 'Test unread')
    expect(mockUpdateDoc).toHaveBeenCalledOnce()
    const [, updateData] = mockUpdateDoc.mock.calls[0]
    expect(updateData[`unread.${UID_BOB}`]).toBeDefined()
  })

  it('envoie un spot_share avec les données spot', async () => {
    const spot = { id: 's1', name: 'Spot Paris', city: 'Paris', country: 'FR', rating: 4 }
    const r = await sendDirectMessage(UID_BOB, 'Check !', { type: 'spot_share', spot })
    expect(r.success).toBe(true)
    const [, msgData] = mockAddDoc.mock.calls[0]
    expect(msgData.type).toBe('spot_share')
    expect(msgData.spot.name).toBe('Spot Paris')
    expect(msgData.spot.city).toBe('Paris')
  })

  it('envoie un location_share avec les coordonnées', async () => {
    const loc = { lat: 48.8566, lng: 2.3522, address: 'Paris' }
    const r = await sendDirectMessage(UID_BOB, 'Ma position', { type: 'location_share', location: loc })
    expect(r.success).toBe(true)
    const [, msgData] = mockAddDoc.mock.calls[0]
    expect(msgData.type).toBe('location_share')
    expect(msgData.location.lat).toBe(48.8566)
  })
})

describe('DirectMessages — sendDirectMessage (localStorage fallback)', () => {
  beforeEach(() => {
    mockState = { user: null, username: 'alice', avatar: '🤙', friends: [] }
    mockStorageGet.mockReturnValue({})
  })

  it('utilise localStorage si non connecté', async () => {
    const r = await sendDirectMessage(UID_BOB, 'Offline message')
    expect(r.success).toBe(true)
    expect(mockAddDoc).not.toHaveBeenCalled()
    expect(r.message.text).toBe('Offline message')
    expect(r.message.senderId).toBe('local-user')
  })

  it('stocke le message dans localStorage (Storage.set appelé)', async () => {
    await sendDirectMessage(UID_BOB, 'Persisté localement')
    expect(mockStorageSet).toHaveBeenCalled()
  })

  it('retourne toujours no_recipient si recipientId vide', async () => {
    const r = await sendDirectMessage('', 'Test')
    expect(r.success).toBe(false)
    expect(r.error).toBe('no_recipient')
  })
})

describe('DirectMessages — getConversationMessages', () => {
  it('retourne un tableau vide si pas de cache', () => {
    const msgs = getConversationMessages(UID_BOB)
    expect(Array.isArray(msgs)).toBe(true)
    expect(msgs.length).toBe(0)
  })
})

describe('DirectMessages — getConversationsList', () => {
  it('retourne un tableau (peut être vide)', () => {
    const list = getConversationsList()
    expect(Array.isArray(list)).toBe(true)
  })
})

describe('DirectMessages — markConversationRead', () => {
  it('appelle updateDoc avec unread.uid = 0', async () => {
    const convId = getConversationId(UID_ALICE, UID_BOB)
    firestoreDB[`directMessages/${convId}`] = {
      participants: [UID_ALICE, UID_BOB],
      unread: { [UID_ALICE]: 3 },
    }

    await markConversationRead(UID_BOB)

    expect(mockUpdateDoc).toHaveBeenCalledWith(
      expect.objectContaining({ _path: `directMessages/${convId}` }),
      expect.objectContaining({ [`unread.${UID_ALICE}`]: 0 })
    )
  })
})

describe('DirectMessages — getUnreadCount + getTotalUnreadCount', () => {
  it('getUnreadCount retourne 0 si pas de cache', () => {
    expect(getUnreadCount(UID_BOB)).toBe(0)
  })

  it('getTotalUnreadCount retourne 0 si cache vide', () => {
    expect(getTotalUnreadCount()).toBe(0)
  })
})
