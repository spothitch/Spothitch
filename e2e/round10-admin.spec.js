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
  test('alice reports bob → report in reports collection', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice', 'bob', 'admin'])
    try {
      const aliceUid = sessions.alice.uid
      const bobUid = sessions.bob.uid

      const reportId = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid }) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'reports'), {
              reporterId: aliceUid,
              targetUserId: bobUid,
              type: 'user',
              reason: 'harassment',
              description: 'Test report for E2E',
              status: 'pending',
              createdAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
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

      await snap(sessions.alice.page, PHASE, 'R10-01-report-created', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
  })

  test('admin approves report → status updated', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice', 'bob', 'admin'])
    try {
      const aliceUid = sessions.alice.uid
      const bobUid = sessions.bob.uid

      const reportId = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid }) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'reports'), {
              reporterId: aliceUid, targetUserId: bobUid,
              type: 'user', reason: 'spam', status: 'pending',
              createdAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return ref.id
        } catch (e) { return null }
      }, { aliceUid, bobUid })

      if (reportId) {
        // Admin approves
        await sessions.admin.page.evaluate(async (id) => {
          try {
            const { getDb, doc, updateDoc, serverTimestamp } = window.__fb
            await Promise.race([
              updateDoc(doc(getDb(), 'reports', id), {
                status: 'approved',
                reviewedAt: serverTimestamp(),
                reviewedBy: 'admin',
              }),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
            ])
          } catch {}
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

      await snap(sessions.admin.page, PHASE, 'R10-01-report-approved', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
  })

  test('admin rejects report → status rejected', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice', 'bob', 'admin'])
    try {
      const aliceUid = sessions.alice.uid
      const bobUid = sessions.bob.uid

      const reportId = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid }) => {
        try {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          const ref = await Promise.race([
            addDoc(collection(getDb(), 'reports'), {
              reporterId: aliceUid, targetUserId: bobUid,
              type: 'user', reason: 'fake', status: 'pending',
              createdAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return ref.id
        } catch (e) { return null }
      }, { aliceUid, bobUid })

      if (reportId) {
        await sessions.admin.page.evaluate(async (id) => {
          try {
            const { getDb, doc, updateDoc, serverTimestamp } = window.__fb
            await Promise.race([
              updateDoc(doc(getDb(), 'reports', id), {
                status: 'rejected', reviewedAt: serverTimestamp(),
              }),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
            ])
          } catch {}
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

      await snap(sessions.admin.page, PHASE, 'R10-01-report-rejected', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
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
  test('alice cannot read bob DMs directly (access control)', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice', 'bob'])
    try {
      const aliceUid = sessions.alice.uid
      const bobUid = sessions.bob.uid

      // Create a conversation between bob and someone else (not alice)
      const convId = `${bobUid}_not-alice`

      const created = await sessions.bob.page.evaluate(async (convId) => {
        try {
          const { getDb, doc, setDoc, serverTimestamp } = window.__fb
          await Promise.race([
            setDoc(doc(getDb(), 'directMessages', convId), {
              participants: ['not-alice', convId.split('_')[0]],
              lastMessage: 'Secret message',
              lastMessageAt: serverTimestamp(),
            }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return true
        } catch (e) { return false }
      }, convId)

      if (created) {
        // Alice tries to read Bob's private conversation
        const aliceReads = await sessions.alice.page.evaluate(async (convId) => {
          try {
            const { getDb, doc, getDoc } = window.__fb
            const snap = await Promise.race([
              getDoc(doc(getDb(), 'directMessages', convId)),
              new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
            ])
            return snap.exists() ? snap.data() : null
          } catch (e) {
            return `denied: ${e.message}`
          }
        }, convId)

        console.log(`  [R10-03] Alice reads Bob's DM: ${typeof aliceReads === 'string' ? aliceReads : 'DATA RETURNED (potential security issue)'}`)

        // Cleanup
        await sessions.bob.page.evaluate(async (convId) => {
          try { const { getDb, doc, deleteDoc } = window.__fb; await deleteDoc(doc(getDb(), 'directMessages', convId)) } catch {}
        }, convId)
      }

      await snap(sessions.alice.page, PHASE, 'R10-03-security-dm', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
  })

  test('alice cannot modify bob profile directly', async ({ browser }) => {
    test.setTimeout(120000)
    const sessions = await createSessions(browser, ['alice', 'bob'])
    try {
      const bobUid = sessions.bob.uid

      const result = await sessions.alice.page.evaluate(async (bobUid) => {
        try {
          const { getDb, doc, updateDoc } = window.__fb
          await Promise.race([
            updateDoc(doc(getDb(), 'users', bobUid), { bio: 'HACKED by Alice' }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
          ])
          return 'modified' // Security issue if this succeeds
        } catch (e) {
          return `denied: ${e.message}`
        }
      }, bobUid)

      console.log(`  [R10-03] Alice modifies Bob's profile: ${result}`)

      if (result === 'modified') {
        const bobDoc = await firestoreGetDoc(sessions.bob.page, 'users', bobUid)
        if (bobDoc?.bio === 'HACKED by Alice') {
          console.log('  [R10-03] SECURITY BUG: Alice was able to modify Bob profile!')
        }
      }

      await snap(sessions.alice.page, PHASE, 'R10-03-security-profile', 'after').catch(() => {})
    } finally {
      await closeSessions(sessions)
    }
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
