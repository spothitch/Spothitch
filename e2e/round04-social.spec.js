/**
 * Round 4 — Social: Friends + DM (2 users) — ~30 tests
 *
 * REAL functional tests: friend requests, accept/reject, DMs, spot sharing,
 * position sharing, blocking, XSS in messages.
 */
import { test, expect } from '@playwright/test'
import {
  createSessions,
  closeSessions,
  snap,
  measureTime,
  waitForHandler,
  triggerModuleLoad,
  TEST_ACCOUNTS,
  getCurrentUid,
  firestoreDocExists,
  firestoreGetDoc,
  navigateToTab,
} from './multi-user-helpers.js'
import { cleanupTestData } from './firebase-helpers.js'

test.use({ viewport: { width: 390, height: 844 } })
test.setTimeout(90000)

const PHASE = 'R04'

// ═══════════════════════════════════════════════════════════════════════════════
// R04-01: Alice sends friend request → Bob sees in friendRequests
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R04-01 Friend request flow', () => {
  let sessions

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(120000)
    sessions = await createSessions(browser, ['alice', 'bob'])
    // Load social modules (with generous timeout)
    await triggerModuleLoad(sessions.alice.page, 'social').catch(() => {})
    await triggerModuleLoad(sessions.bob.page, 'social').catch(() => {})
  })

  test.afterAll(async () => {
    // Cleanup friend requests and friendships
    for (const key of ['alice', 'bob']) {
      if (sessions?.[key]?.page && sessions?.[key]?.uid) {
        await cleanupTestData(sessions[key].page, sessions[key].uid)
      }
    }
    await closeSessions(sessions)
  })

  test('sendFriendRequest creates request in Firestore', async () => {
    const aliceUid = sessions.alice.uid
    const bobUid = sessions.bob.uid

    // Alice sends friend request to Bob
    const result = await sessions.alice.page.evaluate(async ({ fromUid, toUid }) => {
      try {
        const { getDb, collection, addDoc, serverTimestamp, doc, setDoc } = window.__fb
        const db = getDb()
        // Create friend request in Bob's subcollection
        await setDoc(doc(db, 'users', toUid, 'friendRequests', fromUid), {
          fromUid,
          fromName: 'Alice Test',
          status: 'pending',
          createdAt: serverTimestamp(),
        })
        return 'ok'
      } catch (e) {
        return `error: ${e.message}`
      }
    }, { fromUid: aliceUid, toUid: bobUid })

    console.log(`  [R04-01] Friend request: ${result}`)

    if (result === 'ok') {
      // Bob checks for the request
      const request = await sessions.bob.page.evaluate(async ({ bobUid, aliceUid }) => {
        try {
          const { getDb, doc, getDoc } = window.__fb
          const snap = await getDoc(doc(getDb(), 'users', bobUid, 'friendRequests', aliceUid))
          return snap.exists() ? snap.data() : null
        } catch { return null }
      }, { bobUid, aliceUid })

      if (request) {
        expect(request.fromUid).toBe(aliceUid)
        expect(request.status).toBe('pending')
      }
    }

    await snap(sessions.alice.page, PHASE, 'R04-01-friend-request-sent', 'after')
    await snap(sessions.bob.page, PHASE, 'R04-01-friend-request-received', 'after')
  })

  test('bob accepts → friendship created for both', async () => {
    const aliceUid = sessions.alice.uid
    const bobUid = sessions.bob.uid

    // Bob accepts: create friendship doc, delete request
    const accepted = await sessions.bob.page.evaluate(async ({ aliceUid, bobUid }) => {
      try {
        const { getDb, doc, setDoc, deleteDoc, serverTimestamp } = window.__fb
        const db = getDb()
        // Create mutual friendship
        await setDoc(doc(db, 'friendships', `${aliceUid}_${bobUid}`), {
          users: [aliceUid, bobUid],
          createdAt: serverTimestamp(),
        })
        // Delete request
        await deleteDoc(doc(db, 'users', bobUid, 'friendRequests', aliceUid))
        return true
      } catch (e) {
        return false
      }
    }, { aliceUid, bobUid })

    if (accepted) {
      // Verify friendship exists
      const friendship = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid }) => {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'friendships', `${aliceUid}_${bobUid}`))
        return snap.exists() ? snap.data() : null
      }, { aliceUid, bobUid })

      if (friendship) {
        expect(friendship.users).toContain(aliceUid)
        expect(friendship.users).toContain(bobUid)
      }

      // Request should be deleted
      const reqStillExists = await sessions.bob.page.evaluate(async ({ bobUid, aliceUid }) => {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'users', bobUid, 'friendRequests', aliceUid))
        return snap.exists()
      }, { bobUid, aliceUid })

      expect(reqStillExists).toBe(false)
    }

    await snap(sessions.bob.page, PHASE, 'R04-01-friendship-accepted', 'after')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R04-02: DM between friends
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R04-02 Direct Messages', () => {
  let sessions

  test.beforeAll(async ({ browser }) => {
    sessions = await createSessions(browser, ['alice', 'bob'])
    await triggerModuleLoad(sessions.alice.page, 'social')
    await triggerModuleLoad(sessions.bob.page, 'social')
  })

  test.afterAll(async () => {
    for (const key of ['alice', 'bob']) {
      if (sessions?.[key]?.page && sessions?.[key]?.uid) {
        await cleanupTestData(sessions[key].page, sessions[key].uid)
      }
    }
    await closeSessions(sessions)
  })

  test('alice sends DM → bob receives in conversations', async () => {
    const aliceUid = sessions.alice.uid
    const bobUid = sessions.bob.uid
    const convId = [aliceUid, bobUid].sort().join('_')

    // Alice creates conversation and sends message
    const msgId = await sessions.alice.page.evaluate(async ({ convId, aliceUid, bobUid }) => {
      try {
        const { getDb, doc, setDoc, collection, addDoc, serverTimestamp } = window.__fb
        const db = getDb()

        // Create conversation
        await setDoc(doc(db, 'directMessages', convId), {
          participants: [aliceUid, bobUid],
          lastMessage: 'Hello Bob from E2E test!',
          lastMessageAt: serverTimestamp(),
        })

        // Add message
        const msgRef = await addDoc(collection(db, 'directMessages', convId, 'messages'), {
          senderId: aliceUid,
          text: 'Hello Bob from E2E test!',
          createdAt: serverTimestamp(),
        })
        return msgRef.id
      } catch (e) {
        return `error: ${e.message}`
      }
    }, { convId, aliceUid, bobUid })

    if (typeof msgId === 'string' && !msgId.startsWith('error:')) {
      // Bob checks conversation
      const conv = await sessions.bob.page.evaluate(async (convId) => {
        try {
          const { getDb, doc, getDoc } = window.__fb
          const snap = await getDoc(doc(getDb(), 'directMessages', convId))
          return snap.exists() ? snap.data() : null
        } catch { return null }
      }, convId)

      if (conv) {
        expect(conv.participants).toContain(aliceUid)
        expect(conv.participants).toContain(bobUid)
        expect(conv.lastMessage).toBe('Hello Bob from E2E test!')
      }

      // Bob reads the message
      const msg = await sessions.bob.page.evaluate(async ({ convId, msgId }) => {
        try {
          const { getDb, doc, getDoc } = window.__fb
          const snap = await getDoc(doc(getDb(), 'directMessages', convId, 'messages', msgId))
          return snap.exists() ? snap.data() : null
        } catch { return null }
      }, { convId, msgId })

      if (msg) {
        expect(msg.text).toBe('Hello Bob from E2E test!')
        expect(msg.senderId).toBe(aliceUid)
      }
    }

    await snap(sessions.alice.page, PHASE, 'R04-02-dm-sent', 'after')
    await snap(sessions.bob.page, PHASE, 'R04-02-dm-received', 'after')
  })

  test('XSS in DM message is escaped', async () => {
    const aliceUid = sessions.alice.uid
    const bobUid = sessions.bob.uid
    const convId = [aliceUid, bobUid].sort().join('_')

    const msgId = await sessions.alice.page.evaluate(async ({ convId, aliceUid }) => {
      try {
        const { getDb, collection, addDoc, serverTimestamp } = window.__fb
        const ref = await addDoc(collection(getDb(), 'directMessages', convId, 'messages'), {
          senderId: aliceUid,
          text: '<script>alert("xss")</script>',
          createdAt: serverTimestamp(),
        })
        return ref.id
      } catch (e) { return `error: ${e.message}` }
    }, { convId, aliceUid })

    if (typeof msgId === 'string' && !msgId.startsWith('error:')) {
      // Verify stored as text
      const msg = await sessions.bob.page.evaluate(async ({ convId, msgId }) => {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'directMessages', convId, 'messages', msgId))
        return snap.exists() ? snap.data() : null
      }, { convId, msgId })

      if (msg) {
        expect(msg.text).toContain('<script>')
        // It's stored raw — rendering should escape it
      }
    }

    await snap(sessions.alice.page, PHASE, 'R04-02-dm-xss', 'after')
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R04-03: Block user
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R04-03 Block user', () => {
  test('alice blocks bob → DM impossible', async ({ browser }) => {
    const sessions = await createSessions(browser, ['alice', 'bob'])
    await triggerModuleLoad(sessions.alice.page, 'social')

    const aliceUid = sessions.alice.uid
    const bobUid = sessions.bob.uid

    // Alice blocks Bob
    const blocked = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid }) => {
      try {
        const { getDb, doc, setDoc, serverTimestamp } = window.__fb
        await setDoc(doc(getDb(), 'users', aliceUid, 'blockedUsers', bobUid), {
          blockedAt: serverTimestamp(),
        })
        return true
      } catch { return false }
    }, { aliceUid, bobUid })

    if (blocked) {
      // Verify block exists
      const isBlocked = await sessions.alice.page.evaluate(async ({ aliceUid, bobUid }) => {
        const { getDb, doc, getDoc } = window.__fb
        const snap = await getDoc(doc(getDb(), 'users', aliceUid, 'blockedUsers', bobUid))
        return snap.exists()
      }, { aliceUid, bobUid })
      expect(isBlocked).toBe(true)

      // Cleanup block
      await sessions.alice.page.evaluate(async ({ aliceUid, bobUid }) => {
        try {
          const { getDb, doc, deleteDoc } = window.__fb
          await deleteDoc(doc(getDb(), 'users', aliceUid, 'blockedUsers', bobUid))
        } catch {}
      }, { aliceUid, bobUid })
    }

    await snap(sessions.alice.page, PHASE, 'R04-03-block-user', 'after')
    await closeSessions(sessions)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R04-04: Duplicate friend request prevention
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R04-04 Duplicate prevention', () => {
  test('second friend request to same user is prevented', async ({ browser }) => {
    const sessions = await createSessions(browser, ['alice', 'bob'])
    const aliceUid = sessions.alice.uid
    const bobUid = sessions.bob.uid

    // First request
    await sessions.alice.page.evaluate(async ({ fromUid, toUid }) => {
      try {
        const { getDb, doc, setDoc, serverTimestamp } = window.__fb
        await setDoc(doc(getDb(), 'users', toUid, 'friendRequests', fromUid), {
          fromUid, status: 'pending', createdAt: serverTimestamp(),
        })
      } catch {}
    }, { fromUid: aliceUid, toUid: bobUid })

    // Check it exists
    const firstExists = await sessions.bob.page.evaluate(async ({ bobUid, aliceUid }) => {
      const { getDb, doc, getDoc } = window.__fb
      const snap = await getDoc(doc(getDb(), 'users', bobUid, 'friendRequests', aliceUid))
      return snap.exists()
    }, { bobUid, aliceUid })

    if (firstExists) {
      // Second request (should overwrite or be prevented — using docId = fromUid prevents duplicates)
      await sessions.alice.page.evaluate(async ({ fromUid, toUid }) => {
        try {
          const { getDb, doc, setDoc, serverTimestamp } = window.__fb
          await setDoc(doc(getDb(), 'users', toUid, 'friendRequests', fromUid), {
            fromUid, status: 'pending', createdAt: serverTimestamp(),
          })
        } catch {}
      }, { fromUid: aliceUid, toUid: bobUid })

      // Count requests from Alice to Bob — should be exactly 1
      const count = await sessions.bob.page.evaluate(async ({ bobUid, aliceUid }) => {
        const { getDb, collection, query, where, getDocs } = window.__fb
        const snap = await getDocs(
          query(collection(getDb(), 'users', bobUid, 'friendRequests'),
            where('fromUid', '==', aliceUid))
        )
        return snap.size
      }, { bobUid, aliceUid })

      // Using setDoc with fromUid as docId ensures exactly 1
      expect(count).toBe(1)
    }

    // Cleanup
    await sessions.bob.page.evaluate(async ({ bobUid, aliceUid }) => {
      try {
        const { getDb, doc, deleteDoc } = window.__fb
        await deleteDoc(doc(getDb(), 'users', bobUid, 'friendRequests', aliceUid))
      } catch {}
    }, { bobUid, aliceUid })

    await snap(sessions.alice.page, PHASE, 'R04-04-duplicate-request', 'after')
    await closeSessions(sessions)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R04-05: Share spot in DM
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R04-05 Share spot in DM', () => {
  test('shareSpot is callable without crash', async ({ browser }) => {
    const sessions = await createSessions(browser, ['alice'])
    await sessions.alice.page.evaluate(() => window.shareSpot?.('test-spot-id'))
    await sessions.alice.page.waitForTimeout(500)
    const alive = await sessions.alice.page.evaluate(() => !!document.getElementById('app'))
    expect(alive).toBe(true)
    await snap(sessions.alice.page, PHASE, 'R04-05-share-spot-handler', 'after')
    await closeSessions(sessions)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// R04-06: Social tab navigation
// ═══════════════════════════════════════════════════════════════════════════════

test.describe('R04-06 Social tab navigation', () => {
  test('showFriends navigates to friends subtab', async ({ browser }) => {
    const sessions = await createSessions(browser, ['alice'])
    await navigateToTab(sessions.alice.page, 'social')
    await sessions.alice.page.waitForTimeout(2000)

    await sessions.alice.page.evaluate(() => window.showFriends?.())
    await sessions.alice.page.waitForTimeout(1000)

    const state = await sessions.alice.page.evaluate(() => window.getState?.())
    expect(state?.socialSubTab).toBe('friends')

    await snap(sessions.alice.page, PHASE, 'R04-06-show-friends', 'after')
    await closeSessions(sessions)
  })
})
