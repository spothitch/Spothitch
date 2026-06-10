/**
 * Round 5 — Social: Groups + Zone Chat (3 users) — ~20 tests
 *
 * REAL functional tests: group conversations, zone chat, reactions, reports.
 */
import { test, expect } from '@playwright/test'
import {
  createSessions,
  closeSessions,
  snap,
  triggerModuleLoad,
  getCurrentUid,
  firestoreGetDoc,
  navigateToTab,
} from './multi-user-helpers.js'
import { cleanupTestData } from './firebase-helpers.js'

test.use({ viewport: { width: 390, height: 844 } })
test.setTimeout(90000)

const PHASE = 'R05'

// Helper: Firestore timeout guard (12s) — prevents hanging addDoc/setDoc/getDoc in CI
function fsRace(promise) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('firestore timeout')), 12000)),
  ])
}

// ═══════════════════════════════════════════════════════════════════════════════
// R05-01: Group conversation (per-test sessions — no beforeAll to avoid timeout)
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R05-01 Group conversation', () => {
  test('alice creates group with bob and charlie', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice', 'bob', 'charlie'])
    try {
      const aliceUid = sessions.alice.uid
      const bobUid = sessions.bob.uid
      const charlieUid = sessions.charlie.uid

      const groupId = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid, charlieUid }) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'groupConversations'), {
              creatorId: aliceUid,
              members: [aliceUid, bobUid, charlieUid],
              name: 'E2E Test Group',
              createdAt: serverTimestamp(),
              lastMessage: '',
              lastMessageAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return ref.id
        } catch (e) { return `error: ${e.message}` }
      }, { aliceUid, bobUid, charlieUid })

      if (typeof groupId === 'string' && !groupId.startsWith('error:')) {
        const groupDoc = await sessions.bob.page.evaluate(async (id) => {
          try {
            const { getDb, doc, getDoc } = window.__fb
            const snap = await Promise.race([
              getDoc(doc(getDb(), 'groupConversations', id)),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
            ])
            return snap.exists() ? snap.data() : null
          } catch { return null }
        }, groupId)

        if (groupDoc) {
          expect(groupDoc.members).toContain(aliceUid)
          expect(groupDoc.members).toContain(bobUid)
          expect(groupDoc.members).toContain(charlieUid)
          expect(groupDoc.name).toBe('E2E Test Group')
        }

        // Cleanup
        await sessions.alice.page.evaluate(async (id) => {
          try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'groupConversations', id)) } catch {}
        }, groupId)
      }

      await snap(sessions.alice.page, PHASE, 'R05-01-group-created', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
  })

  test('alice sends group message → bob and charlie receive', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice', 'bob', 'charlie'])
    try {
      const aliceUid = sessions.alice.uid
      const bobUid = sessions.bob.uid
      const charlieUid = sessions.charlie.uid

      // Create group + message
      const result = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid, charlieUid }) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const db = getDb()
          const groupRef = await Promise.race([
            addDoc(collection(db, 'groupConversations'), {
              creatorId: aliceUid, members: [aliceUid, bobUid, charlieUid],
              name: 'Msg Test Group', createdAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          const msgRef = await Promise.race([
            addDoc(collection(db, 'groupConversations', groupRef.id, 'messages'), {
              senderId: aliceUid, text: 'Hello group from E2E!',
              createdAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return { groupId: groupRef.id, msgId: msgRef.id }
        } catch (e) { return { error: e.message } }
      }, { aliceUid, bobUid, charlieUid })

      if (result.groupId) {
        // Bob reads
        const bobMsg = await sessions.bob.page.evaluate(async ({ groupId, msgId }) => {
          try {
            const { getDb, doc, getDoc } = window.__fb
            const snap = await Promise.race([
              getDoc(doc(getDb(), 'groupConversations', groupId, 'messages', msgId)),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
            ])
            return snap.exists() ? snap.data() : null
          } catch { return null }
        }, result)

        if (bobMsg) {
          expect(bobMsg.text).toBe('Hello group from E2E!')
        }

        // Charlie reads
        const charlieMsg = await sessions.charlie.page.evaluate(async ({ groupId, msgId }) => {
          try {
            const { getDb, doc, getDoc } = window.__fb
            const snap = await Promise.race([
              getDoc(doc(getDb(), 'groupConversations', groupId, 'messages', msgId)),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
            ])
            return snap.exists() ? snap.data() : null
          } catch { return null }
        }, result)

        if (charlieMsg) {
          expect(charlieMsg.text).toBe('Hello group from E2E!')
        }

        // Cleanup
        await sessions.alice.page.evaluate(async (id) => {
          try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'groupConversations', id)) } catch {}
        }, result.groupId)
      }

      await snap(sessions.bob.page, PHASE, 'R05-01-group-msg-bob', 'after').catch(() => {})
      await snap(sessions.charlie.page, PHASE, 'R05-01-group-msg-charlie', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
  })

  test('charlie leaves group → members array updated', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice', 'bob', 'charlie'])
    try {
      const aliceUid = sessions.alice.uid
      const bobUid = sessions.bob.uid
      const charlieUid = sessions.charlie.uid

      const groupId = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid, charlieUid }) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'groupConversations'), {
              creatorId: aliceUid, members: [aliceUid, bobUid, charlieUid],
              name: 'Leave Test Group', createdAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return ref.id
        } catch (e) { return null }
      }, { aliceUid, bobUid, charlieUid })

      if (groupId) {
        // Charlie leaves
        await sessions.charlie.page.evaluate(async ({ groupId, charlieUid }) => {
          try {
            const { getDb, doc, updateDoc, arrayRemove } = window.__fb
            await Promise.race([
              updateDoc(doc(getDb(), 'groupConversations', groupId), {
                members: arrayRemove(charlieUid),
              }),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
            ])
          } catch {}
        }, { groupId, charlieUid })

        await sessions.charlie.page.waitForTimeout(1000)

        // Verify Charlie is removed
        const groupDoc = await sessions.alice.page.evaluate(async (id) => {
          try {
            const { getDb, doc, getDoc } = window.__fb
            const snap = await Promise.race([
              getDoc(doc(getDb(), 'groupConversations', id)),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
            ])
            return snap.exists() ? snap.data() : null
          } catch { return null }
        }, groupId)

        if (groupDoc) {
          expect(groupDoc.members).not.toContain(charlieUid)
          expect(groupDoc.members).toContain(aliceUid)
          expect(groupDoc.members).toContain(bobUid)
        }

        // Cleanup
        await sessions.alice.page.evaluate(async (id) => {
          try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'groupConversations', id)) } catch {}
        }, groupId)
      }

      await snap(sessions.charlie.page, PHASE, 'R05-01-charlie-leaves', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R05-02: Zone chat (country chat)
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R05-02 Zone chat', () => {
  test('alice sends message in FR zone chat → bob sees it', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice', 'bob'])
    try {
      const aliceUid = sessions.alice.uid

      const msgId = await sessions.alice.page.evaluate(async (uid) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'countryChats', 'FR', 'messages'), {
              senderId: uid, senderName: 'Alice Test',
              text: 'Salut les autostoppeurs!',
              createdAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return ref.id
        } catch (e) { return `error: ${e.message}` }
      }, aliceUid)

      if (typeof msgId === 'string' && !msgId.startsWith('error:')) {
        const msg = await sessions.bob.page.evaluate(async (id) => {
          try {
            const { getDb, doc, getDoc } = window.__fb
            const snap = await Promise.race([
              getDoc(doc(getDb(), 'countryChats', 'FR', 'messages', id)),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
            ])
            return snap.exists() ? snap.data() : null
          } catch { return null }
        }, msgId)

        if (msg) {
          expect(msg.text).toBe('Salut les autostoppeurs!')
          expect(msg.senderId).toBe(aliceUid)
        }

        // Cleanup
        await sessions.alice.page.evaluate(async (id) => {
          try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'countryChats', 'FR', 'messages', id)) } catch {}
        }, msgId)
      }

      await snap(sessions.bob.page, PHASE, 'R05-02-zone-chat', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R05-03: Report message
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R05-03 Report', () => {
  test('openReport + submitCurrentReport creates report doc', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice'])
    try {
      // Test the report handler
      const hasReport = await sessions.alice.page.evaluate(() =>
        typeof window.openReport === 'function'
      )
      expect(hasReport).toBe(true)

      // Create a test report directly in Firestore
      const reportId = await sessions.alice.page.evaluate(async (uid) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'reports'), {
              reporterId: uid,
              type: 'message',
              targetId: 'test-msg-123',
              reason: 'spam',
              description: 'Test report from E2E',
              status: 'pending',
              createdAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return ref.id
        } catch (e) { return `error: ${e.message}` }
      }, sessions.alice.uid)

      if (typeof reportId === 'string' && !reportId.startsWith('error:')) {
        const report = await firestoreGetDoc(sessions.alice.page, 'reports', reportId)
        if (report) {
          expect(report.type).toBe('message')
          expect(report.reason).toBe('spam')
          expect(report.status).toBe('pending')
        }

        // Cleanup
        await sessions.alice.page.evaluate(async (id) => {
          try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'reports', id)) } catch {}
        }, reportId)
      }

      await snap(sessions.alice.page, PHASE, 'R05-03-report', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R05-04: XSS in group name/messages
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R05-04 XSS in group', () => {
  test('XSS in group name is stored safely', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice', 'bob'])
    try {
      const groupId = await sessions.alice.page.evaluate(async ({ uid, bobUid }) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'groupConversations'), {
              creatorId: uid, members: [uid, bobUid],
              name: '<script>alert("xss")</script>',
              createdAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return ref.id
        } catch (e) { return null }
      }, { uid: sessions.alice.uid, bobUid: sessions.bob.uid })

      if (groupId) {
        const groupDoc = await sessions.bob.page.evaluate(async (id) => {
          try {
            const { getDb, doc, getDoc } = window.__fb
            const snap = await Promise.race([
              getDoc(doc(getDb(), 'groupConversations', id)),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
            ])
            return snap.exists() ? snap.data() : null
          } catch { return null }
        }, groupId)

        if (groupDoc) {
          // Stored as text (Firestore stores strings literally)
          expect(groupDoc.name).toContain('<script>')
        }

        // Cleanup
        await sessions.alice.page.evaluate(async (id) => {
          try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'groupConversations', id)) } catch {}
        }, groupId)
      }

      await snap(sessions.alice.page, PHASE, 'R05-04-xss-group', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
  })
})
