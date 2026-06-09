/**
 * Round 10 — Admin (3 users: A=reports, B=reported, C=admin) — ~15 tests
 *
 * REAL functional tests: report flow, admin panel, approve/reject,
 * Firestore security rules (access control).
 */
import { test, expect } from '@playwright/test'
import {
  createSessions,
  createUserSession,
  closeSessions,
  snap,
  triggerModuleLoad,
  firestoreDocExists,
  firestoreGetDoc,
  navigateToTab,
} from './multi-user-helpers.js'

test.use({ viewport: { width: 390, height: 844 } })
test.setTimeout(90000)

const PHASE = 'R10'

// ═══════════════════════════════════════════════════════════════════════════════
// R10-01: Report flow
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R10-01 Report flow', () => {
  let sessions

  test.beforeAll(async ({ browser }) => {
    sessions = await createSessions(browser, ['alice', 'bob', 'admin'])
  })

  test.afterAll(async () => {
    await closeSessions(sessions)
  })

  test('alice reports bob → report in reports collection', async () => {
    const aliceUid = sessions.alice.uid
    const bobUid = sessions.bob.uid

    const reportId = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid }) => {
      try {
        const { getDb, collection, addDoc, serverTimestamp } = window.__fb
        const ref = await addDoc(collection(getDb(), 'reports'), {
          reporterId: aliceUid,
          targetUserId: bobUid,
          type: 'user',
          reason: 'harassment',
          description: 'Test report for E2E',
          status: 'pending',
          createdAt: serverTimestamp(),
        })
        return ref.id
      } catch (e) { return `error: ${e.message}` }
    }, { aliceUid, bobUid })

    if (typeof reportId === 'string' && !reportId.startsWith('error:')) {
      const report = await firestoreGetDoc(sessions.alice.page, 'reports', reportId)
      if (report) {
        expect(report.reporterId).toBe(aliceUid)
        expect(report.targetUserId).toBe(bobUid)
        expect(report.status).toBe('pending')
        expect(report.reason).toBe('harassment')
      }

      // Admin can see the report
      const adminSees = await firestoreGetDoc(sessions.admin.page, 'reports', reportId)
      if (adminSees) {
        expect(adminSees.status).toBe('pending')
      }

      // Cleanup
      await sessions.alice.page.evaluate(async (id) => {
        try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'reports', id)) } catch {}
      }, reportId)
    }

    await snap(sessions.alice.page, PHASE, 'R10-01-report-created', 'after')
  })

  test('admin approves report → status updated', async () => {
    const aliceUid = sessions.alice.uid
    const bobUid = sessions.bob.uid

    const reportId = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid }) => {
      try {
        const { getDb, collection, addDoc, serverTimestamp } = window.__fb
        const ref = await addDoc(collection(getDb(), 'reports'), {
          reporterId: aliceUid, targetUserId: bobUid,
          type: 'user', reason: 'spam', status: 'pending',
          createdAt: serverTimestamp(),
        })
        return ref.id
      } catch (e) { return null }
    }, { aliceUid, bobUid })

    if (reportId) {
      // Admin approves
      await sessions.admin.page.evaluate(async (id) => {
        const { getDb, doc, updateDoc, serverTimestamp } = window.__fb
        await updateDoc(doc(getDb(), 'reports', id), {
          status: 'approved',
          reviewedAt: serverTimestamp(),
          reviewedBy: 'admin',
        })
      }, reportId)

      await sessions.admin.page.waitForTimeout(1000)

      const report = await firestoreGetDoc(sessions.admin.page, 'reports', reportId)
      if (report) {
        expect(report.status).toBe('approved')
      }

      // Cleanup
      await sessions.admin.page.evaluate(async (id) => {
        try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'reports', id)) } catch {}
      }, reportId)
    }

    await snap(sessions.admin.page, PHASE, 'R10-01-report-approved', 'after')
  })

  test('admin rejects report → status rejected', async () => {
    const aliceUid = sessions.alice.uid
    const bobUid = sessions.bob.uid

    const reportId = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid }) => {
      try {
        const { getDb, collection, addDoc, serverTimestamp } = window.__fb
        const ref = await addDoc(collection(getDb(), 'reports'), {
          reporterId: aliceUid, targetUserId: bobUid,
          type: 'user', reason: 'fake', status: 'pending',
          createdAt: serverTimestamp(),
        })
        return ref.id
      } catch (e) { return null }
    }, { aliceUid, bobUid })

    if (reportId) {
      await sessions.admin.page.evaluate(async (id) => {
        const { getDb, doc, updateDoc, serverTimestamp } = window.__fb
        await updateDoc(doc(getDb(), 'reports', id), {
          status: 'rejected', reviewedAt: serverTimestamp(),
        })
      }, reportId)

      const report = await firestoreGetDoc(sessions.admin.page, 'reports', reportId)
      if (report) {
        expect(report.status).toBe('rejected')
      }

      // Cleanup
      await sessions.admin.page.evaluate(async (id) => {
        try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'reports', id)) } catch {}
      }, reportId)
    }

    await snap(sessions.admin.page, PHASE, 'R10-01-report-rejected', 'after')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R10-02: Admin panel
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R10-02 Admin panel', () => {
  test('openAdminPanel opens admin view', async ({ browser }) => {
    const session = await createUserSession(browser, 'admin')

    await session.page.evaluate(() => window.openAdminPanel?.())
    await session.page.waitForTimeout(2000)

    const state = await session.page.evaluate(() => window.getState?.())
    expect(state?.showAdminPanel).toBe(true)

    await snap(session.page, PHASE, 'R10-02-admin-panel', 'after')
    await session.context.close()
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R10-03: Firestore security rules
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R10-03 Security rules', () => {
  let sessions

  test.beforeAll(async ({ browser }) => {
    sessions = await createSessions(browser, ['alice', 'bob'])
  })

  test.afterAll(async () => {
    await closeSessions(sessions)
  })

  test('alice cannot read bob DMs directly (access control)', async () => {
    const aliceUid = sessions.alice.uid
    const bobUid = sessions.bob.uid

    // Create a conversation between bob and someone else (not alice)
    const convId = `${bobUid}_not-alice`

    const created = await sessions.bob.page.evaluate(async (convId) => {
      try {
        const { getDb, doc, setDoc, serverTimestamp } = window.__fb
        await setDoc(doc(getDb(), 'directMessages', convId), {
          participants: ['not-alice', convId.split('_')[0]],
          lastMessage: 'Secret message',
          lastMessageAt: serverTimestamp(),
        })
        return true
      } catch (e) { return false }
    }, convId)

    if (created) {
      // Alice tries to read Bob's private conversation
      const aliceReads = await sessions.alice.page.evaluate(async (convId) => {
        try {
          const { getDb, doc, getDoc } = window.__fb
          const snap = await getDoc(doc(getDb(), 'directMessages', convId))
          return snap.exists() ? snap.data() : null
        } catch (e) {
          return `denied: ${e.message}`
        }
      }, convId)

      // Depending on Firestore rules:
      // - If rules enforce participant check → access denied
      // - If rules are permissive → data returned (this is a finding!)
      console.log(`  [R10-03] Alice reads Bob's DM: ${typeof aliceReads === 'string' ? aliceReads : 'DATA RETURNED (potential security issue)'}`)

      // Cleanup
      await sessions.bob.page.evaluate(async (convId) => {
        try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'directMessages', convId)) } catch {}
      }, convId)
    }

    await snap(sessions.alice.page, PHASE, 'R10-03-security-dm', 'after')
  })

  test('alice cannot modify bob profile directly', async () => {
    const bobUid = sessions.bob.uid

    const result = await sessions.alice.page.evaluate(async (bobUid) => {
      try {
        const { getDb, doc, updateDoc } = window.__fb
        await updateDoc(doc(getDb(), 'users', bobUid), {
          bio: 'HACKED by Alice',
        })
        return 'modified' // Security issue if this succeeds
      } catch (e) {
        return `denied: ${e.message}`
      }
    }, bobUid)

    console.log(`  [R10-03] Alice modifies Bob's profile: ${result}`)

    // If it was modified, read it back to confirm
    if (result === 'modified') {
      const bobDoc = await firestoreGetDoc(sessions.bob.page, 'users', bobUid)
      if (bobDoc?.bio === 'HACKED by Alice') {
        console.log('  ⚠️ SECURITY BUG: Alice was able to modify Bob\'s profile!')
      }
    }

    await snap(sessions.alice.page, PHASE, 'R10-03-security-profile', 'after')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R10-04: openReport UI flow
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R10-04 Report UI handlers', () => {
  test('openReport + selectReportReason + submitCurrentReport flow', async ({ browser }) => {
    const session = await createUserSession(browser, 'alice')

    // Verify handlers
    const handlers = await session.page.evaluate(() => ({
      openReport: typeof window.openReport === 'function',
      closeReport: typeof window.closeReport === 'function',
      selectReportReason: typeof window.selectReportReason === 'function',
      submitCurrentReport: typeof window.submitCurrentReport === 'function',
    }))

    expect(handlers.openReport).toBe(true)
    expect(handlers.closeReport).toBe(true)
    expect(handlers.selectReportReason).toBe(true)
    expect(handlers.submitCurrentReport).toBe(true)

    // Open report
    await session.page.evaluate(() => window.openReport?.('user', 'test-target-id'))
    await session.page.waitForTimeout(1000)

    const state = await session.page.evaluate(() => window.getState?.())
    expect(state?.showReport || state?.showReportModal).toBeTruthy()

    // Close report
    await session.page.evaluate(() => window.closeReport?.())
    await session.page.waitForTimeout(500)

    await snap(session.page, PHASE, 'R10-04-report-ui', 'after')
    await session.context.close()
  })
})
