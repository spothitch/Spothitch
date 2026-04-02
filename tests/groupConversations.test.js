/**
 * Tests — Group Conversations Service (Firebase)
 * Mock Firestore en mémoire via vi.hoisted()
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// ==================== HOISTED MOCKS ====================

const {
  firestoreDB,
  mockAddDoc,
  mockUpdateDoc,
  mockGetDocs,
} = vi.hoisted(() => {
  const firestoreDB = {}

  const mockAddDoc = vi.fn(async (collRef, data) => {
    const id = `doc_${Date.now()}_${Math.floor(Math.random() * 10000)}`
    const path = (collRef._collectionPath || 'items') + '/' + id
    firestoreDB[path] = { ...data }
    return { id }
  })

  const mockUpdateDoc = vi.fn(async (ref, data) => {
    const current = firestoreDB[ref._path] || {}
    Object.entries(data).forEach(([key, val]) => {
      if (key.includes('.')) {
        const parts = key.split('.')
        let obj = current
        for (let i = 0; i < parts.length - 1; i++) {
          if (!obj[parts[i]]) obj[parts[i]] = {}
          obj = obj[parts[i]]
        }
        obj[parts[parts.length - 1]] = val
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

  return { firestoreDB, mockAddDoc, mockUpdateDoc, mockGetDocs }
})

// ==================== MOCKS MODULES ====================

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => 'mock-db'),
  collection: vi.fn((db, ...parts) => ({ _collectionPath: parts.join('/') })),
  doc: vi.fn((db, ...parts) => {
    const path = typeof db === 'string' && db !== 'mock-db'
      ? [db, ...parts].join('/')
      : parts.join('/')
    return { _path: path }
  }),
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
  getDocs: mockGetDocs,
  query: vi.fn((ref, ...c) => ({ ...ref, _constraints: c })),
  where: vi.fn(() => ({})),
  orderBy: vi.fn(() => ({})),
  limit: vi.fn(() => ({})),
  onSnapshot: vi.fn(() => vi.fn()),
  serverTimestamp: vi.fn(() => '2026-03-04T00:00:00Z'),
  arrayUnion: vi.fn((...vals) => vals),
  arrayRemove: vi.fn((...vals) => vals),
}))

vi.mock('firebase/app', () => ({
  getApps: vi.fn(() => ['mock-app']),
  getApp: vi.fn(() => 'mock-app'),
}))

let mockState = {
  user: { uid: 'user_alice', displayName: 'Alice Test' },
  username: 'alice',
  avatar: 'thumbs-up',
  friends: [
    { id: 'user_bob', name: 'Bob Test', avatar: 'backpack', online: true },
    { id: 'user_carol', name: 'Carol Test', avatar: 'flower', online: false },
  ],
  groupConversations: [],
}

vi.mock('../src/stores/state.js', () => ({
  getState: vi.fn(() => mockState),
  setState: vi.fn((updates) => {
    mockState = { ...mockState, ...updates }
  }),
}))

vi.mock('../src/i18n/index.js', () => ({
  t: vi.fn((k) => k),
}))

// ==================== IMPORT ====================

import {
  createGroupConversation,
  sendGroupConversationMessage,
  getGroupConversationMessages,
  getGroupConversationsList,
  addMemberToGroupConversation,
  leaveGroupConversation,
  subscribeToGroupConversation,
  subscribeToAllGroupConversations,
  unsubscribeFromGroupConversation,
  unsubscribeFromAllGroupConversations,
} from '../src/services/groupConversations.js'

// ==================== HELPERS ====================

const UID_ALICE = 'user_alice'
const UID_BOB = 'user_bob'
const UID_CAROL = 'user_carol'

beforeEach(() => {
  Object.keys(firestoreDB).forEach((k) => delete firestoreDB[k])
  vi.clearAllMocks()
  mockState = {
    user: { uid: UID_ALICE, displayName: 'Alice Test' },
    username: 'alice',
    avatar: 'thumbs-up',
    friends: [
      { id: UID_BOB, name: 'Bob Test', avatar: 'backpack', online: true },
      { id: UID_CAROL, name: 'Carol Test', avatar: 'flower', online: false },
    ],
    groupConversations: [],
  }
  mockAddDoc.mockImplementation(async (collRef, data) => {
    const id = `doc_${Date.now()}_${Math.floor(Math.random() * 10000)}`
    const path = (collRef._collectionPath || 'items') + '/' + id
    firestoreDB[path] = { ...data }
    return { id }
  })
  mockUpdateDoc.mockImplementation(async (ref, data) => {
    const current = firestoreDB[ref._path] || {}
    Object.entries(data).forEach(([key, val]) => {
      if (key.includes('.')) {
        const parts = key.split('.')
        let obj = current
        for (let i = 0; i < parts.length - 1; i++) {
          if (!obj[parts[i]]) obj[parts[i]] = {}
          obj = obj[parts[i]]
        }
        obj[parts[parts.length - 1]] = val
      } else {
        current[key] = val
      }
    })
    firestoreDB[ref._path] = current
  })
})

// ==================== TESTS ====================

describe('GroupConversations — getters', () => {
  it('getGroupConversationMessages retourne [] si pas de cache', () => {
    const msgs = getGroupConversationMessages('group_123')
    expect(Array.isArray(msgs)).toBe(true)
    expect(msgs.length).toBe(0)
  })

  it('getGroupConversationsList retourne [] si state vide', () => {
    const list = getGroupConversationsList()
    expect(Array.isArray(list)).toBe(true)
    expect(list.length).toBe(0)
  })

  it('getGroupConversationsList retourne les groupes du state', () => {
    mockState.groupConversations = [{ id: 'g1', name: 'Test' }]
    const list = getGroupConversationsList()
    expect(list.length).toBe(1)
    expect(list[0].id).toBe('g1')
  })
})

describe('GroupConversations — createGroupConversation', () => {
  it('retourne not_authenticated si pas connecté', async () => {
    mockState.user = null
    const r = await createGroupConversation('Mon groupe', [UID_BOB])
    expect(r.success).toBe(false)
    expect(r.error).toBe('not_authenticated')
  })

  it('retourne empty_name si nom vide', async () => {
    const r = await createGroupConversation('', [UID_BOB])
    expect(r.success).toBe(false)
    expect(r.error).toBe('empty_name')
  })

  it('retourne empty_name si nom = espaces', async () => {
    const r = await createGroupConversation('   ', [UID_BOB])
    expect(r.success).toBe(false)
    expect(r.error).toBe('empty_name')
  })

  it('retourne no_members si tableau vide', async () => {
    const r = await createGroupConversation('Mon groupe', [])
    expect(r.success).toBe(false)
    expect(r.error).toBe('no_members')
  })

  it('crée le groupe avec 1 ami et inclut le créateur', async () => {
    const r = await createGroupConversation('Berlin Trip', [UID_BOB])
    expect(r.success).toBe(true)
    expect(r.groupId).toBeDefined()
    expect(mockAddDoc).toHaveBeenCalledOnce()

    const [collRef, data] = mockAddDoc.mock.calls[0]
    expect(collRef._collectionPath).toBe('groupConversations')
    expect(data.name).toBe('Berlin Trip')
    expect(data.members).toContain(UID_ALICE)
    expect(data.members).toContain(UID_BOB)
    expect(data.creator).toBe(UID_ALICE)
    expect(data.icon).toBe('users')
  })

  it('crée le groupe avec plusieurs amis', async () => {
    const r = await createGroupConversation('Road Trip', [UID_BOB, UID_CAROL])
    expect(r.success).toBe(true)
    const [, data] = mockAddDoc.mock.calls[0]
    expect(data.members).toHaveLength(3) // alice + bob + carol
    expect(data.members).toContain(UID_CAROL)
  })

  it('remplit memberProfiles avec les données des amis', async () => {
    await createGroupConversation('Friends', [UID_BOB])
    const [, data] = mockAddDoc.mock.calls[0]
    expect(data.memberProfiles[UID_ALICE]).toBeDefined()
    expect(data.memberProfiles[UID_BOB]?.name).toBe('Bob Test')
    expect(data.memberProfiles[UID_BOB]?.avatar).toBe('backpack')
  })

  it('déduplique les membres si créateur est dans la liste', async () => {
    const r = await createGroupConversation('Test', [UID_ALICE, UID_BOB])
    expect(r.success).toBe(true)
    const [, data] = mockAddDoc.mock.calls[0]
    // Alice ne doit apparaître qu'une fois
    const aliceCount = data.members.filter(m => m === UID_ALICE).length
    expect(aliceCount).toBe(1)
  })

  it('accepte un icon personnalisé', async () => {
    await createGroupConversation('Road Trip', [UID_BOB], 'car')
    const [, data] = mockAddDoc.mock.calls[0]
    expect(data.icon).toBe('car')
  })
})

describe('GroupConversations — sendGroupConversationMessage', () => {
  it('retourne not_authenticated si pas connecté', async () => {
    mockState.user = null
    const r = await sendGroupConversationMessage('group_123', 'Salut !')
    expect(r.success).toBe(false)
    expect(r.error).toBe('not_authenticated')
  })

  it('retourne empty_message si texte vide', async () => {
    const r = await sendGroupConversationMessage('group_123', '')
    expect(r.success).toBe(false)
    expect(r.error).toBe('empty_message')
  })

  it('retourne empty_message si texte = espaces', async () => {
    const r = await sendGroupConversationMessage('group_123', '   ')
    expect(r.success).toBe(false)
    expect(r.error).toBe('empty_message')
  })

  it('envoie un message dans la subcollection messages', async () => {
    const r = await sendGroupConversationMessage('group_123', 'Salut tout le monde !')
    expect(r.success).toBe(true)
    expect(mockAddDoc).toHaveBeenCalledOnce()

    const [collRef, data] = mockAddDoc.mock.calls[0]
    expect(collRef._collectionPath).toBe('groupConversations/group_123/messages')
    expect(data.text).toBe('Salut tout le monde !')
    expect(data.senderId).toBe(UID_ALICE)
    expect(data.senderName).toBe('Alice Test')
    expect(data.type).toBe('text')
  })

  it('met à jour les métadonnées du groupe (updateDoc)', async () => {
    await sendGroupConversationMessage('group_123', 'Hello !')
    expect(mockUpdateDoc).toHaveBeenCalledOnce()

    const [ref, data] = mockUpdateDoc.mock.calls[0]
    expect(ref._path).toBe('groupConversations/group_123')
    expect(data.lastMessage.text).toBe('Hello !')
    expect(data.lastMessage.senderId).toBe(UID_ALICE)
    expect(data.lastMessage.senderName).toBe('Alice Test')
  })
})

describe('GroupConversations — addMemberToGroupConversation', () => {
  it('retourne not_authenticated si pas connecté', async () => {
    mockState.user = null
    const r = await addMemberToGroupConversation('group_123', UID_BOB)
    expect(r.success).toBe(false)
    expect(r.error).toBe('not_authenticated')
  })

  it('ajoute un membre avec arrayUnion', async () => {
    const r = await addMemberToGroupConversation('group_123', UID_CAROL)
    expect(r.success).toBe(true)
    expect(mockUpdateDoc).toHaveBeenCalledOnce()

    const [ref, data] = mockUpdateDoc.mock.calls[0]
    expect(ref._path).toBe('groupConversations/group_123')
    expect(data.members).toBeDefined() // arrayUnion result
    // Le profil du membre doit être inclus (Carol est dans les amis)
    expect(data[`memberProfiles.${UID_CAROL}`]).toBeDefined()
    expect(data[`memberProfiles.${UID_CAROL}`].name).toBe('Carol Test')
  })

  it('ajoute un membre sans profil si non-ami', async () => {
    const r = await addMemberToGroupConversation('group_123', 'user_unknown')
    expect(r.success).toBe(true)
    // Pas de memberProfile pour un inconnu
    const [, data] = mockUpdateDoc.mock.calls[0]
    expect(data[`memberProfiles.user_unknown`]).toBeUndefined()
  })
})

describe('GroupConversations — leaveGroupConversation', () => {
  it('retourne not_authenticated si pas connecté', async () => {
    mockState.user = null
    const r = await leaveGroupConversation('group_123')
    expect(r.success).toBe(false)
    expect(r.error).toBe('not_authenticated')
  })

  it('retire l\'utilisateur avec arrayRemove et nettoie le state', async () => {
    mockState.groupConversations = [{ id: 'group_123', name: 'Test' }, { id: 'group_456', name: 'Autre' }]
    const { setState } = await import('../src/stores/state.js')

    const r = await leaveGroupConversation('group_123')
    expect(r.success).toBe(true)
    expect(mockUpdateDoc).toHaveBeenCalledOnce()

    const [ref, data] = mockUpdateDoc.mock.calls[0]
    expect(ref._path).toBe('groupConversations/group_123')
    expect(data.members).toBeDefined() // arrayRemove result

    // Vérifie que setState a été appelé pour supprimer le groupe du state
    expect(setState).toHaveBeenCalled()
    const lastCall = setState.mock.calls[setState.mock.calls.length - 1][0]
    expect(lastCall.groupConversations.find(g => g.id === 'group_123')).toBeUndefined()
    expect(lastCall.groupConversations.find(g => g.id === 'group_456')).toBeDefined()
  })
})

describe('GroupConversations — subscriptions', () => {
  it('subscribeToGroupConversation retourne une fonction unsubscribe', () => {
    const unsub = subscribeToGroupConversation('group_123')
    expect(typeof unsub).toBe('function')
  })

  it('subscribeToAllGroupConversations ne crash pas sans DB', () => {
    expect(() => subscribeToAllGroupConversations(UID_ALICE)).not.toThrow()
  })

  it('unsubscribeFromGroupConversation ne crash pas', () => {
    expect(() => unsubscribeFromGroupConversation('group_123')).not.toThrow()
  })

  it('unsubscribeFromAllGroupConversations ne crash pas', () => {
    expect(() => unsubscribeFromAllGroupConversations()).not.toThrow()
  })
})
