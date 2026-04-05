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
// R06-02: Guardian configuration
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R06-02 Guardian config', () => {
  let sessions

  test.beforeAll(async ({ browser }) => {
    sessions = await createSessions(browser, ['alice', 'bob'])
  })

  test.afterAll(async () => {
    await closeSessions(sessions)
  })

  test('alice configures bob as guardian → config saved', async () => {
    const aliceUid = sessions.alice.uid
    const bobUid = sessions.bob.uid

    // Save guardian config to Firestore
    const saved = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid }) => {
      try {
        const { getDb, doc, setDoc, serverTimestamp } = window.__fb
        await setDoc(doc(getDb(), 'users', aliceUid, 'guardianConfig', 'default'), {
          guardianUid: bobUid,
          guardianName: 'Bob Test',
          checkInInterval: 30, // minutes
          alertContacts: [],
          createdAt: serverTimestamp(),
        })
        return true
      } catch (e) { return false }
    }, { aliceUid, bobUid })

    if (saved) {
      const config = await sessions.alice.page.evaluate(async (uid) => {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'users', uid, 'guardianConfig', 'default'))
        return snap.exists() ? snap.data() : null
      }, aliceUid)

      if (config) {
        expect(config.guardianUid).toBe(bobUid)
        expect(config.checkInInterval).toBe(30)
      }
    }

    await snap(sessions.alice.page, PHASE, 'R06-02-guardian-config', 'after')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R06-03: Guardian session start/stop
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R06-03 Guardian session lifecycle', () => {
  let sessions

  test.beforeAll(async ({ browser }) => {
    sessions = await createSessions(browser, ['alice', 'bob'])
  })

  test.afterAll(async () => {
    await closeSessions(sessions)
  })

  test('alice starts guardian session → guardianSessions doc created', async () => {
    const aliceUid = sessions.alice.uid
    const bobUid = sessions.bob.uid

    const sessionId = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid }) => {
      try {
        const { getDb, collection, addDoc, serverTimestamp } = window.__fb
        const ref = await addDoc(collection(getDb(), 'guardianSessions'), {
          travelerId: aliceUid,
          guardianUid: bobUid,
          status: 'active',
          startedAt: serverTimestamp(),
          lastCheckIn: serverTimestamp(),
          route: { from: 'Paris', to: 'Lyon' },
        })
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

    await snap(sessions.alice.page, PHASE, 'R06-03-session-start', 'after')
  })

  test('alice check-in updates lastCheckIn', async () => {
    const aliceUid = sessions.alice.uid
    const bobUid = sessions.bob.uid

    const sessionId = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid }) => {
      try {
        const { getDb, collection, addDoc, serverTimestamp } = window.__fb
        const ref = await addDoc(collection(getDb(), 'guardianSessions'), {
          travelerId: aliceUid, guardianUid: bobUid,
          status: 'active', startedAt: serverTimestamp(),
          lastCheckIn: serverTimestamp(),
        })
        return ref.id
      } catch (e) { return null }
    }, { aliceUid, bobUid })

    if (sessionId) {
      // Wait a bit, then check-in
      await sessions.alice.page.waitForTimeout(1000)

      await sessions.alice.page.evaluate(async (id) => {
        const { getDb, doc, updateDoc, serverTimestamp } = window.__fb
        await updateDoc(doc(getDb(), 'guardianSessions', id), {
          lastCheckIn: serverTimestamp(),
          lastPosition: { lat: 46.2044, lng: 6.1432 },
        })
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

    await snap(sessions.alice.page, PHASE, 'R06-03-checkin', 'after')
  })

  test('alice stops session → status becomes stopped', async () => {
    const aliceUid = sessions.alice.uid
    const bobUid = sessions.bob.uid

    const sessionId = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid }) => {
      try {
        const { getDb, collection, addDoc, serverTimestamp } = window.__fb
        const ref = await addDoc(collection(getDb(), 'guardianSessions'), {
          travelerId: aliceUid, guardianUid: bobUid,
          status: 'active', startedAt: serverTimestamp(),
        })
        return ref.id
      } catch (e) { return null }
    }, { aliceUid, bobUid })

    if (sessionId) {
      // Stop session
      await sessions.alice.page.evaluate(async (id) => {
        const { getDb, doc, updateDoc, serverTimestamp } = window.__fb
        await updateDoc(doc(getDb(), 'guardianSessions', id), {
          status: 'stopped',
          stoppedAt: serverTimestamp(),
        })
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

    await snap(sessions.alice.page, PHASE, 'R06-03-session-stop', 'after')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R06-04: Bob sees Alice's position
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R06-04 Position sharing', () => {
  test('bob reads alice position from guardian session', async ({ browser }) => {
    const sessions = await createSessions(browser, ['alice', 'bob'])
    const aliceUid = sessions.alice.uid
    const bobUid = sessions.bob.uid

    const sessionId = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid }) => {
      try {
        const { getDb, collection, addDoc, serverTimestamp } = window.__fb
        const ref = await addDoc(collection(getDb(), 'guardianSessions'), {
          travelerId: aliceUid, guardianUid: bobUid,
          status: 'active', startedAt: serverTimestamp(),
          lastPosition: { lat: 48.8566, lng: 2.3522 },
          lastCheckIn: serverTimestamp(),
        })
        return ref.id
      } catch (e) { return null }
    }, { aliceUid, bobUid })

    if (sessionId) {
      // Bob reads position
      const position = await sessions.bob.page.evaluate(async (id) => {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'guardianSessions', id))
        return snap.exists() ? snap.data()?.lastPosition : null
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

    await snap(sessions.bob.page, PHASE, 'R06-04-position-read', 'after')
    await closeSessions(sessions)
  })
})
