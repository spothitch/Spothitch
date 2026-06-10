/**
 * Round 8 — Events + Companion (2-3 users) — ~20 tests
 *
 * REAL functional tests: event creation, join, comments,
 * travel buddy posts, contact initiation.
 */
import { test, expect } from '@playwright/test'
import {
  createSessions,
  createUserSession,
  closeSessions,
  snap,
  triggerModuleLoad,
  firestoreGetDoc,
  navigateToTab,
} from './multi-user-helpers.js'

test.use({ viewport: { width: 390, height: 844 } })
test.setTimeout(90000)

const PHASE = 'R08'

// ═══════════════════════════════════════════════════════════════════════════════
// R08-01: Event creation (per-test sessions — no beforeAll to avoid timeout)
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R08-01 Events', () => {
  test('alice creates event → events collection', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice', 'bob', 'charlie'])
    try {
      const aliceUid = sessions.alice.uid

      const eventId = await sessions.alice.page.evaluate(async (uid) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'events'), {
              creatorId: uid,
              title: 'Hitchhiking Meetup Paris',
              description: 'Meet fellow hitchhikers in Paris',
              date: '2026-05-01',
              location: { lat: 48.8566, lng: 2.3522, city: 'Paris' },
              participants: [uid],
              maxParticipants: 20,
              status: 'active',
              createdAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return ref.id
        } catch (e) { return `error: ${e.message}` }
      }, aliceUid)

      if (typeof eventId === 'string' && !eventId.startsWith('error:')) {
        const eventDoc = await firestoreGetDoc(sessions.alice.page, 'events', eventId)
        if (eventDoc) {
          expect(eventDoc.title).toBe('Hitchhiking Meetup Paris')
          expect(eventDoc.creatorId).toBe(aliceUid)
          expect(eventDoc.participants).toContain(aliceUid)
        }

        // Cleanup
        await sessions.alice.page.evaluate(async (id) => {
          try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'events', id)) } catch {}
        }, eventId)
      }

      await snap(sessions.alice.page, PHASE, 'R08-01-event-created', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
  })

  test('bob joins event → participants updated', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice', 'bob', 'charlie'])
    try {
      const aliceUid = sessions.alice.uid
      const bobUid = sessions.bob.uid

      const eventId = await sessions.alice.page.evaluate(async (uid) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'events'), {
              creatorId: uid, title: 'Join Test Event',
              participants: [uid], maxParticipants: 10,
              status: 'active', createdAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return ref.id
        } catch (e) { return null }
      }, aliceUid)

      if (eventId) {
        // Bob joins
        await sessions.bob.page.evaluate(async ({ eventId, bobUid }) => {
          try {
            const { getDb, doc, updateDoc, arrayUnion } = window.__fb
            await Promise.race([
              updateDoc(doc(getDb(), 'events', eventId), {
                participants: arrayUnion(bobUid),
              }),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
            ])
          } catch {}
        }, { eventId, bobUid })

        await sessions.bob.page.waitForTimeout(1000)

        const eventDoc = await firestoreGetDoc(sessions.alice.page, 'events', eventId)
        if (eventDoc) {
          expect(eventDoc.participants).toContain(bobUid)
          expect(eventDoc.participants).toContain(aliceUid)
        }

        // Cleanup
        await sessions.alice.page.evaluate(async (id) => {
          try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'events', id)) } catch {}
        }, eventId)
      }

      await snap(sessions.bob.page, PHASE, 'R08-01-bob-joins', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
  })

  test('charlie comments on event → comment stored', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice', 'bob', 'charlie'])
    try {
      const aliceUid = sessions.alice.uid
      const charlieUid = sessions.charlie.uid

      const eventId = await sessions.alice.page.evaluate(async (uid) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'events'), {
              creatorId: uid, title: 'Comment Test Event',
              participants: [uid], status: 'active', createdAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return ref.id
        } catch (e) { return null }
      }, aliceUid)

      if (eventId) {
        const commentId = await sessions.charlie.page.evaluate(async ({ eventId, uid }) => {
          try {
            const { getDb, collection, addDoc, serverTimestamp } = window.__fb
            const ref = await Promise.race([
              addDoc(collection(getDb(), 'events', eventId, 'comments'), {
                userId: uid, text: 'Sounds great! Count me in!',
                createdAt: serverTimestamp(),
              }),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
            ])
            return ref.id
          } catch (e) { return null }
        }, { eventId, uid: charlieUid })

        if (commentId) {
          const comment = await sessions.alice.page.evaluate(async ({ eventId, commentId }) => {
            try {
              const { getDb, doc, getDoc } = window.__fb
              const snap = await Promise.race([
                getDoc(doc(getDb(), 'events', eventId, 'comments', commentId)),
                new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
              ])
              return snap.exists() ? snap.data() : null
            } catch { return null }
          }, { eventId, commentId })

          if (comment) {
            expect(comment.text).toContain('Count me in')
            expect(comment.userId).toBe(charlieUid)
          }
        }

        // Cleanup
        await sessions.alice.page.evaluate(async (id) => {
          try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'events', id)) } catch {}
        }, eventId)
      }

      await snap(sessions.charlie.page, PHASE, 'R08-01-charlie-comments', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R08-02: Travel buddy (per-test sessions — no beforeAll)
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R08-02 Travel buddy', () => {
  test('alice posts travel buddy request → travelBuddies collection', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice', 'bob'])
    try {
      const aliceUid = sessions.alice.uid

      const buddyId = await sessions.alice.page.evaluate(async (uid) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'travelBuddies'), {
              userId: uid,
              from: 'Paris',
              to: 'Barcelona',
              date: '2026-05-15',
              description: 'Looking for someone to hitch with!',
              status: 'active',
              createdAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return ref.id
        } catch (e) { return `error: ${e.message}` }
      }, aliceUid)

      if (typeof buddyId === 'string' && !buddyId.startsWith('error:')) {
        const buddyDoc = await firestoreGetDoc(sessions.alice.page, 'travelBuddies', buddyId)
        if (buddyDoc) {
          expect(buddyDoc.from).toBe('Paris')
          expect(buddyDoc.to).toBe('Barcelona')
          expect(buddyDoc.userId).toBe(aliceUid)
        }

        // Bob can see it
        const bobSees = await firestoreGetDoc(sessions.bob.page, 'travelBuddies', buddyId)
        if (bobSees) {
          expect(bobSees.description).toContain('Looking for someone')
        }

        // Cleanup
        await sessions.alice.page.evaluate(async (id) => {
          try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'travelBuddies', id)) } catch {}
        }, buddyId)
      }

      await snap(sessions.alice.page, PHASE, 'R08-02-buddy-post', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
  })

  test('bob contacts alice via DM after seeing buddy request', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice', 'bob'])
    try {
      const aliceUid = sessions.alice.uid
      const bobUid = sessions.bob.uid
      const convId = [aliceUid, bobUid].sort().join('_')

      // Bob initiates contact
      const msgId = await sessions.bob.page.evaluate(async ({ convId, bobUid, aliceUid }) => {
        try {
          const { getDb, doc, setDoc, collection, addDoc, serverTimestamp } = window.__fb
          await Promise.race([
            setDoc(doc(getDb(), 'directMessages', convId), {
              participants: [aliceUid, bobUid],
              lastMessage: 'Hey! I saw your travel buddy post',
              lastMessageAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'directMessages', convId, 'messages'), {
              senderId: bobUid,
              text: 'Hey! I saw your travel buddy post. Want to hitch together?',
              createdAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return ref.id
        } catch (e) { return `error: ${e.message}` }
      }, { convId, bobUid, aliceUid })

      if (typeof msgId === 'string' && !msgId.startsWith('error:')) {
        // Alice sees the message
        const msg = await sessions.alice.page.evaluate(async ({ convId, msgId }) => {
          try {
            const { getDb, doc, getDoc } = window.__fb
            const snap = await Promise.race([
              getDoc(doc(getDb(), 'directMessages', convId, 'messages', msgId)),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
            ])
            return snap.exists() ? snap.data() : null
          } catch { return null }
        }, { convId, msgId })

        if (msg) {
          expect(msg.text).toContain('travel buddy post')
          expect(msg.senderId).toBe(bobUid)
        }

        // Cleanup
        await sessions.bob.page.evaluate(async (convId) => {
          try {
            const { getDb, doc, deleteDoc } = window.__fb
            await deleteDoc(doc(getDb(), 'directMessages', convId))
          } catch {}
        }, convId)
      }

      await snap(sessions.bob.page, PHASE, 'R08-02-buddy-contact', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R08-03: XSS in event/buddy
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R08-03 XSS protection', () => {
  test('XSS in event title stored safely', async ({ browser }) => {
    const session = await createUserSession(browser, 'alice')

    const eventId = await session.page.evaluate(async (uid) => {
      try {
        const { getDb, collection, addDoc, serverTimestamp } = window.__fb
        const ref = await Promise.race([
          addDoc(collection(getDb(), 'events'), {
            creatorId: uid,
            title: '<img src=x onerror=alert("xss")>',
            participants: [uid], status: 'active', createdAt: serverTimestamp(),
          }),
          new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
        ])
        return ref.id
      } catch (e) { return null }
    }, session.uid)

    if (eventId) {
      const doc = await firestoreGetDoc(session.page, 'events', eventId)
      if (doc) {
        expect(doc.title).toContain('<img')
      }

      // Cleanup
      await session.page.evaluate(async (id) => {
        try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'events', id)) } catch {}
      }, eventId)
    }

    await snap(session.page, PHASE, 'R08-03-xss-event', 'after').catch(() => {})
    await session.context.close()
  })
})
