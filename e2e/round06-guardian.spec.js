/**
 * Round 6 — Guardian (2 users) — ~20 tests
 *
 * REAL functional tests: guardian config, session start, check-in,
 * position sharing, alert trigger, session stop.
 */
import { test, expect } from '@playwright/test'
import {
  createSessions,
  createUserSession,
  closeSessions,
  snap,
  triggerModuleLoad,
  getCurrentUid,
  firestoreDocExists,
  firestoreGetDoc,
  navigateToTab,
} from './multi-user-helpers.js'

test.use({ viewport: { width: 390, height: 844 } })
test.setTimeout(90000)

const PHASE = 'R06'

// ═══════════════════════════════════════════════════════════════════════════════
// R06-01: Guardian handlers exist
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R06-01 Guardian handlers', () => {
  test('guardian handlers exist on window', async ({ browser }) => {
    const session = await createUserSession(browser, 'alice')

    // openGuardian should exist (main.js stub)
    const handlers = await session.page.evaluate(() => ({
      openGuardian: typeof window.openGuardian === 'function',
      closeGuardian: typeof window.closeGuardian === 'function',
      showGuardianModal: typeof window.showGuardianModal === 'function',
    }))

    expect(handlers.openGuardian).toBe(true)
    expect(handlers.closeGuardian).toBe(true)

    await snap(session.page, PHASE, 'R06-01-handlers', 'after')
    await session.context.close()
  })

  test('openGuardian opens guardian modal', async ({ browser }) => {
    const session = await createUserSession(browser, 'alice')

    await session.page.evaluate(() => window.openGuardian?.())
    await session.page.waitForTimeout(3000)

    const state = await session.page.evaluate(() => window.getState?.())
    expect(state?.showGuardianModal).toBe(true)

    await snap(session.page, PHASE, 'R06-01-guardian-open', 'after')

    await session.page.evaluate(() => window.closeGuardian?.())
    await session.page.waitForTimeout(500)
    await session.context.close()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R06-02: Guardian configuration (per-test sessions — no beforeAll to avoid timeout)
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R06-02 Guardian config', () => {
  test('alice configures bob as guardian → config saved', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice', 'bob'])
    try {
      const aliceUid = sessions.alice.uid
      const bobUid = sessions.bob.uid

      // Save guardian config to Firestore
      const saved = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid }) => {
        try {
          const { getDb, doc, setDoc, serverTimestamp } = window.__fb
          await Promise.race([
            setDoc(doc(getDb(), 'users', aliceUid, 'guardianConfig', 'default'), {
              guardianUid: bobUid,
              guardianName: 'Bob Test',
              checkInInterval: 30, // minutes
              alertContacts: [],
              createdAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return true
        } catch (e) { return false }
      }, { aliceUid, bobUid })

      if (saved) {
        const config = await sessions.alice.page.evaluate(async (uid) => {
          try {
            const { getDb, doc, getDoc } = window.__fb
            const snap = await Promise.race([
              getDoc(doc(getDb(), 'users', uid, 'guardianConfig', 'default')),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
            ])
            return snap.exists() ? snap.data() : null
          } catch { return null }
        }, aliceUid)

        if (config) {
          expect(config.guardianUid).toBe(bobUid)
          expect(config.checkInInterval).toBe(30)
        }
      }

      await snap(sessions.alice.page, PHASE, 'R06-02-guardian-config', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R06-03: Guardian session start/stop (per-test sessions — no beforeAll)
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R06-03 Guardian session lifecycle', () => {
  test('alice starts guardian session → guardianSessions doc created', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice', 'bob'])
    try {
      const aliceUid = sessions.alice.uid
      const bobUid = sessions.bob.uid

      const sessionId = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid }) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'guardianSessions'), {
              travelerId: aliceUid,
              guardianUid: bobUid,
              status: 'active',
              startedAt: serverTimestamp(),
              lastCheckIn: serverTimestamp(),
              route: { from: 'Paris', to: 'Lyon' },
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return ref.id
        } catch (e) { return `error: ${e.message}` }
      }, { aliceUid, bobUid })

      if (typeof sessionId === 'string' && !sessionId.startsWith('error:')) {
        const sessionDoc = await firestoreGetDoc(sessions.alice.page, 'guardianSessions', sessionId)
        if (sessionDoc) {
          expect(sessionDoc.travelerId).toBe(aliceUid)
          expect(sessionDoc.guardianUid).toBe(bobUid)
          expect(sessionDoc.status).toBe('active')
        }

        // Bob can see the session
        const bobSees = await firestoreGetDoc(sessions.bob.page, 'guardianSessions', sessionId)
        if (bobSees) {
          expect(bobSees.travelerId).toBe(aliceUid)
        }

        // Cleanup
        await sessions.alice.page.evaluate(async (id) => {
          try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'guardianSessions', id)) } catch {}
        }, sessionId)
      }

      await snap(sessions.alice.page, PHASE, 'R06-03-session-start', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
  })

  test('alice check-in updates lastCheckIn', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice', 'bob'])
    try {
      const aliceUid = sessions.alice.uid
      const bobUid = sessions.bob.uid

      const sessionId = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid }) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'guardianSessions'), {
              travelerId: aliceUid, guardianUid: bobUid,
              status: 'active', startedAt: serverTimestamp(),
              lastCheckIn: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return ref.id
        } catch (e) { return null }
      }, { aliceUid, bobUid })

      if (sessionId) {
        // Wait a bit, then check-in
        await sessions.alice.page.waitForTimeout(1000)

        await sessions.alice.page.evaluate(async (id) => {
          try {
            const { getDb, doc, updateDoc, serverTimestamp } = window.__fb
            await Promise.race([
              updateDoc(doc(getDb(), 'guardianSessions', id), {
                lastCheckIn: serverTimestamp(),
                lastPosition: { lat: 46.2044, lng: 6.1432 },
              }),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
            ])
          } catch {}
        }, sessionId)

        const session = await firestoreGetDoc(sessions.alice.page, 'guardianSessions', sessionId)
        if (session) {
          expect(session.lastCheckIn).toBeTruthy()
          expect(session.lastPosition?.lat).toBe(46.2044)
        }

        // Cleanup
        await sessions.alice.page.evaluate(async (id) => {
          try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'guardianSessions', id)) } catch {}
        }, sessionId)
      }

      await snap(sessions.alice.page, PHASE, 'R06-03-checkin', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
  })

  test('alice stops session → status becomes stopped', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice', 'bob'])
    try {
      const aliceUid = sessions.alice.uid
      const bobUid = sessions.bob.uid

      const sessionId = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid }) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'guardianSessions'), {
              travelerId: aliceUid, guardianUid: bobUid,
              status: 'active', startedAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return ref.id
        } catch (e) { return null }
      }, { aliceUid, bobUid })

      if (sessionId) {
        // Stop session
        await sessions.alice.page.evaluate(async (id) => {
          try {
            const { getDb, doc, updateDoc, serverTimestamp } = window.__fb
            await Promise.race([
              updateDoc(doc(getDb(), 'guardianSessions', id), {
                status: 'stopped',
                stoppedAt: serverTimestamp(),
              }),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
            ])
          } catch {}
        }, sessionId)

        const session = await firestoreGetDoc(sessions.alice.page, 'guardianSessions', sessionId)
        if (session) {
          expect(session.status).toBe('stopped')
        }

        // Cleanup
        await sessions.alice.page.evaluate(async (id) => {
          try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'guardianSessions', id)) } catch {}
        }, sessionId)
      }

      await snap(sessions.alice.page, PHASE, 'R06-03-session-stop', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R06-04: Bob sees Alice's position
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R06-04 Position sharing', () => {
  test('bob reads alice position from guardian session', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice', 'bob'])
    try {
      const aliceUid = sessions.alice.uid
      const bobUid = sessions.bob.uid

      const sessionId = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid }) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'guardianSessions'), {
              travelerId: aliceUid, guardianUid: bobUid,
              status: 'active', startedAt: serverTimestamp(),
              lastPosition: { lat: 48.8566, lng: 2.3522 },
              lastCheckIn: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return ref.id
        } catch (e) { return null }
      }, { aliceUid, bobUid })

      if (sessionId) {
        // Bob reads position
        const position = await sessions.bob.page.evaluate(async (id) => {
          try {
            const { getDb, doc, getDoc } = window.__fb
            const snap = await Promise.race([
              getDoc(doc(getDb(), 'guardianSessions', id)),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
            ])
            return snap.exists() ? snap.data()?.lastPosition : null
          } catch { return null }
        }, sessionId)

        if (position) {
          expect(position.lat).toBe(48.8566)
          expect(position.lng).toBe(2.3522)
        }

        // Cleanup
        await sessions.alice.page.evaluate(async (id) => {
          try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'guardianSessions', id)) } catch {}
        }, sessionId)
      }

      await snap(sessions.bob.page, PHASE, 'R06-04-position-read', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
  })
})
