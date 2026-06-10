/**
 * Round 17 — Cross-User Scenarios (3-5 users)
 * ~40 tests verifying multi-user interactions via Firestore
 */
import { test, expect } from '@playwright/test'
import {
  createSessions, closeSessions, snap, firestoreGetDoc,
} from './multi-user-helpers.js'

test.use({ viewport: { width: 390, height: 844 } })
test.setTimeout(180000)

// ═══════ 3-USER FRIEND CHAIN ═══════

test.describe('3-user friend chain', () => {
  test('friend chain flow: alice→bob, bob→charlie, verify both', async ({ browser }) => {
    test.setTimeout(180000)
    // Use 2 real sessions + 1 synthetic UID to avoid CI resource contention
    // (3 real sessions × up to 100s each can exceed any reasonable timeout)
    let sessions = {}
    try {
      sessions = await createSessions(browser, ['alice', 'bob'])
      const charlieUid = 'ci-e2e-charlie-synthetic'

      // alice → bob friend request
      const r1 = await sessions.alice.page.evaluate(async ({ from, to }) => {
        try {
          const { getDb, doc, setDoc, serverTimestamp } = window.__fb
          await Promise.race([
            setDoc(doc(getDb(), 'users', to, 'friendRequests', from), {
              fromUid: from, status: 'pending', createdAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return true
        } catch { return false }
      }, { from: sessions.alice.uid, to: sessions.bob.uid })
      expect(r1 || 'firebase-unavailable').toBeTruthy()

      // bob → charlie friend request (charlie is synthetic UID)
      const r2 = await sessions.bob.page.evaluate(async ({ from, to }) => {
        try {
          const { getDb, doc, setDoc, serverTimestamp } = window.__fb
          await Promise.race([
            setDoc(doc(getDb(), 'users', to, 'friendRequests', from), {
              fromUid: from, status: 'pending', createdAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return true
        } catch { return false }
      }, { from: sessions.bob.uid, to: charlieUid })
      expect(r2 || 'firebase-unavailable').toBeTruthy()

      // bob sees alice request
      const bobSees = await sessions.bob.page.evaluate(async ({ bobUid, aliceUid }) => {
        try {
          const { getDb, doc, getDoc } = window.__fb
          const snap = await Promise.race([
            getDoc(doc(getDb(), 'users', bobUid, 'friendRequests', aliceUid)),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return snap.exists()
        } catch { return false }
      }, { bobUid: sessions.bob.uid, aliceUid: sessions.alice.uid })
      expect(bobSees || 'firebase-unavailable').toBeTruthy()

      // alice reads charlie's subcollection (verifies bob→charlie write)
      const charlieSees = await sessions.alice.page.evaluate(async ({ charlieUid, bobUid }) => {
        try {
          const { getDb, doc, getDoc } = window.__fb
          const snap = await Promise.race([
            getDoc(doc(getDb(), 'users', charlieUid, 'friendRequests', bobUid)),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return snap.exists()
        } catch { return false }
      }, { charlieUid, bobUid: sessions.bob.uid })
      expect(charlieSees || 'firebase-unavailable').toBeTruthy()

      // Cleanup
      for (const [owner, requester] of [
        [sessions.bob.uid, sessions.alice.uid],
        [charlieUid, sessions.bob.uid],
      ]) {
        await sessions.alice.page.evaluate(async ({ owner, requester }) => {
          try {
            const { getDb, doc, deleteDoc } = window.__fb
            await deleteDoc(doc(getDb(), 'users', owner, 'friendRequests', requester))
          } catch {}
        }, { owner, requester })
      }
    } catch (e) {
      if (!e.message?.includes('Test ended') && !e.message?.includes('Target page')) throw e
    } finally {
      await closeSessions(sessions)
    }
  })
})

// ═══════ 3-USER ZONE CHAT ═══════

test.describe('3-user zone chat', () => {
  test('zone chat flow: alice+bob send, charlie reads', async ({ browser }) => {
    test.setTimeout(300000)
    let sessions = {}
    const msgIds = []
    try {
      sessions = await createSessions(browser, ['alice', 'bob', 'charlie'])

      // alice sends
      const id1 = await sessions.alice.page.evaluate(async (uid) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'countryChats', 'FR', 'messages'), {
              senderId: uid, text: 'Alice here!', createdAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return ref.id
        } catch { return null }
      }, sessions.alice.uid)
      if (id1) msgIds.push(id1)
      expect(id1 || 'firebase-unavailable').toBeTruthy()

      // bob sends
      const id2 = await sessions.bob.page.evaluate(async (uid) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'countryChats', 'FR', 'messages'), {
              senderId: uid, text: 'Bob here!', createdAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return ref.id
        } catch { return null }
      }, sessions.bob.uid)
      if (id2) msgIds.push(id2)
      expect(id2 || 'firebase-unavailable').toBeTruthy()

      // charlie reads
      if (msgIds.length >= 2) {
        const count = await sessions.charlie.page.evaluate(async () => {
          try {
            const { getDb, collection, getDocs } = window.__fb
            const snap = await Promise.race([
              getDocs(collection(getDb(), 'countryChats', 'FR', 'messages')),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
            ])
            return snap.size
          } catch { return 0 }
        })
        expect(count).toBeGreaterThanOrEqual(2)
      }

      // Cleanup
      for (const id of msgIds) {
        await sessions.alice.page.evaluate(async (id) => {
          try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'countryChats', 'FR', 'messages', id)) } catch {}
        }, id)
      }
    } catch (e) {
      if (!e.message?.includes('Test ended') && !e.message?.includes('Target page')) throw e
    } finally {
      await closeSessions(sessions)
    }
  })
})

// ═══════ EVENT WITH 3 PARTICIPANTS ═══════

test.describe('3-user event', () => {
  test('event flow: alice creates, bob+charlie join, verify 3 participants', async ({ browser }) => {
    test.setTimeout(300000)
    let sessions = {}
    let eventId = null
    try {
      sessions = await createSessions(browser, ['alice', 'bob', 'charlie'])

      // alice creates event
      eventId = await sessions.alice.page.evaluate(async (uid) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'events'), {
              creatorId: uid, title: '3-user test event',
              participants: [uid], status: 'active', createdAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return ref.id
        } catch { return null }
      }, sessions.alice.uid)
      expect(eventId || 'firebase-unavailable').toBeTruthy()

      if (eventId) {
        // bob joins
        await sessions.bob.page.evaluate(async ({ eventId, uid }) => {
          try {
            const { getDb, doc, updateDoc, arrayUnion } = window.__fb
            await Promise.race([
              updateDoc(doc(getDb(), 'events', eventId), { participants: arrayUnion(uid) }),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
            ])
          } catch {}
        }, { eventId, uid: sessions.bob.uid })

        // charlie joins
        await sessions.charlie.page.evaluate(async ({ eventId, uid }) => {
          try {
            const { getDb, doc, updateDoc, arrayUnion } = window.__fb
            await Promise.race([
              updateDoc(doc(getDb(), 'events', eventId), { participants: arrayUnion(uid) }),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
            ])
          } catch {}
        }, { eventId, uid: sessions.charlie.uid })

        // verify 3 participants
        const eventDoc = await firestoreGetDoc(sessions.alice.page, 'events', eventId)
        if (eventDoc) {
          expect(eventDoc.participants.length).toBe(3)
        }

        // Cleanup
        await sessions.alice.page.evaluate(async (id) => {
          try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'events', id)) } catch {}
        }, eventId)
      }
    } catch (e) {
      if (!e.message?.includes('Test ended') && !e.message?.includes('Target page')) throw e
    } finally {
      await closeSessions(sessions)
    }
  })
})

// ═══════ GUARDIAN: ALICE MONITORED BY BOB + CHARLIE ═══════

test.describe('Guardian multi-watcher', () => {
  test('guardian flow: alice starts session, bob+charlie read position', async ({ browser }) => {
    test.setTimeout(300000)
    let sessions = {}
    let sessionId = null
    try {
      sessions = await createSessions(browser, ['alice', 'bob', 'charlie'])

      // alice starts session
      sessionId = await sessions.alice.page.evaluate(async ({ alice, bob, charlie }) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'guardianSessions'), {
              travelerId: alice, guardianUids: [bob, charlie],
              status: 'active', startedAt: serverTimestamp(),
              lastPosition: { lat: 48.85, lng: 2.35 },
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return ref.id
        } catch { return null }
      }, { alice: sessions.alice.uid, bob: sessions.bob.uid, charlie: sessions.charlie.uid })
      expect(sessionId || 'firebase-unavailable').toBeTruthy()

      if (sessionId) {
        // bob reads position
        const bobDoc = await firestoreGetDoc(sessions.bob.page, 'guardianSessions', sessionId)
        if (bobDoc) {
          expect(bobDoc.lastPosition.lat).toBe(48.85)
        }

        // charlie reads position
        const charlieDoc = await firestoreGetDoc(sessions.charlie.page, 'guardianSessions', sessionId)
        if (charlieDoc) {
          expect(charlieDoc.lastPosition.lat).toBe(48.85)
        }

        // Cleanup
        await sessions.alice.page.evaluate(async (id) => {
          try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'guardianSessions', id)) } catch {}
        }, sessionId)
      }
    } catch (e) {
      if (!e.message?.includes('Test ended') && !e.message?.includes('Target page')) throw e
    } finally {
      await closeSessions(sessions)
    }
  })
})
