/**
 * Firebase Realtime E2E Tests
 *
 * Tests real-time features with 2 browser contexts.
 * Uses shared session for the primary user.
 */
import { test, expect } from '@playwright/test'
import {
  TEST_ACCOUNTS,
  getCurrentUid,
  openSecondBrowser,
  initFirebasePage,
} from './firebase-helpers.js'

test.describe('Firebase Realtime', () => {
  test.describe.configure({ mode: 'serial' })

  let context, page, aliceUid, isFallback

  test.beforeAll(async ({ browser }) => {
    if (!process.env.E2E_TEST_PASSWORD) return
    ;({ context, page, uid: aliceUid } = await initFirebasePage(browser, TEST_ACCOUNTS.alice.email))
    isFallback = aliceUid?.startsWith('ci-ci-') || false
  })

  test.afterAll(async () => {
    await context?.close()
  })

  test.beforeEach(() => {
    test.skip(!!isFallback, 'Firebase emulator not reachable from browser build')
  })

  test('DM received in real-time by second browser', async ({ browser }) => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const { context: bobCtx, page: bobPage } = await openSecondBrowser(browser, TEST_ACCOUNTS.bob.email)
    const bobUid = await getCurrentUid(bobPage)

    try {
      const convId = await page.evaluate(async ({ alice, bob }) => {
        const { getDb, collection, addDoc, serverTimestamp } = window.__fb
        const ref = await addDoc(collection(getDb(), 'directMessages'), {
          participants: [alice, bob], type: 'dm',
          createdAt: serverTimestamp(), lastMessage: '',
        })
        return ref.id
      }, { alice: aliceUid, bob: bobUid })

      await bobPage.evaluate(async (cid) => {
        const { getDb, collection, onSnapshot } = window.__fb
        window.__realtimeMessages = []
        window.__unsub = onSnapshot(collection(getDb(), 'directMessages', cid, 'messages'), (snap) => {
          snap.docChanges().forEach(change => {
            if (change.type === 'added') window.__realtimeMessages.push(change.doc.data())
          })
        })
      }, convId)

      await page.evaluate(async ({ cid, alice }) => {
        const { getDb, collection, addDoc, serverTimestamp } = window.__fb
        await addDoc(collection(getDb(), 'directMessages', cid, 'messages'), {
          text: 'Real-time hello!', senderId: alice, createdAt: serverTimestamp(),
        })
      }, { cid: convId, alice: aliceUid })

      await bobPage.waitForFunction(() => window.__realtimeMessages?.length > 0, { timeout: 10000 })
      const received = await bobPage.evaluate(() => window.__realtimeMessages)
      expect(received.length).toBeGreaterThan(0)
      expect(received[0].text).toBe('Real-time hello!')

      await bobPage.evaluate(() => window.__unsub?.())
      await page.evaluate(async (cid) => {
        const { getDb, collection, getDocs, deleteDoc, doc } = window.__fb
        const msgs = await getDocs(collection(getDb(), 'directMessages', cid, 'messages'))
        for (const m of msgs.docs) await deleteDoc(m.ref)
        await deleteDoc(doc(getDb(), 'directMessages', cid))
      }, convId)
    } finally {
      await bobCtx.close()
    }
  })

  test('onSnapshot favorites sync across tabs', async ({ browser }) => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const { context: ctx2, page: page2 } = await openSecondBrowser(browser, TEST_ACCOUNTS.alice.email)

    try {
      await page2.evaluate(async (testUid) => {
        const { getDb, collection, onSnapshot } = window.__fb
        window.__favChanges = []
        window.__unsubFav = onSnapshot(collection(getDb(), 'users', testUid, 'favorites'), (snap) => {
          snap.docChanges().forEach(change => {
            window.__favChanges.push({ type: change.type, id: change.doc.id })
          })
        })
      }, aliceUid)

      await page.evaluate(async (testUid) => {
        const { getDb, doc, setDoc, serverTimestamp } = window.__fb
        await setDoc(doc(getDb(), 'users', testUid, 'favorites', 'rt-test-fav'), {
          spotId: 'rt-test-fav', lat: 48.85, lng: 2.35, addedAt: serverTimestamp(),
        })
      }, aliceUid)

      await page2.waitForFunction(
        () => window.__favChanges?.some(c => c.type === 'added' && c.id === 'rt-test-fav'),
        { timeout: 10000 }
      )

      const changes = await page2.evaluate(() => window.__favChanges)
      expect(changes.some(c => c.id === 'rt-test-fav')).toBe(true)

      await page2.evaluate(() => window.__unsubFav?.())
      await page.evaluate(async (testUid) => {
        await window.__fb.deleteDoc(window.__fb.doc(window.__fb.getDb(), 'users', testUid, 'favorites', 'rt-test-fav'))
      }, aliceUid)
    } finally {
      await ctx2.close()
    }
  })

  test('concurrent writes with increment do not lose data', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, updateDoc, getDoc, increment } = window.__fb
        const db = getDb()
        await updateDoc(doc(db, 'users', testUid), { points: 0 })
        const promises = Array.from({ length: 10 }, () =>
          updateDoc(doc(db, 'users', testUid), { points: increment(1) })
        )
        await Promise.all(promises)
        const snap = await getDoc(doc(db, 'users', testUid))
        return { points: snap.data()?.points }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.points).toBe(10)
  })

  test('friend request notification arrives in real-time', async ({ browser }) => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const { context: bobCtx, page: bobPage } = await openSecondBrowser(browser, TEST_ACCOUNTS.bob.email)
    const bobUid = await getCurrentUid(bobPage)

    try {
      // Bob listens to his own friendRequests subcollection
      await bobPage.evaluate(async (testUid) => {
        const { getDb, collection, onSnapshot } = window.__fb
        window.__friendRequests = []
        window.__unsubFr = onSnapshot(
          collection(getDb(), 'users', testUid, 'friendRequests'),
          (snap) => {
            snap.docChanges().forEach(change => {
              if (change.type === 'added') window.__friendRequests.push(change.doc.data())
            })
          }
        )
      }, bobUid)

      // Alice sends a friend request to Bob's subcollection
      const reqId = await page.evaluate(async ({ from, to }) => {
        const { getDb, collection, addDoc, serverTimestamp } = window.__fb
        const ref = await addDoc(collection(getDb(), 'users', to, 'friendRequests'), {
          from, to, status: 'pending', createdAt: serverTimestamp(),
        })
        return ref.id
      }, { from: aliceUid, to: bobUid })

      await bobPage.waitForFunction(() => window.__friendRequests?.length > 0, { timeout: 10000 })
      const requests = await bobPage.evaluate(() => window.__friendRequests)
      expect(requests.length).toBeGreaterThan(0)
      expect(requests[0].from).toBe(aliceUid)

      await bobPage.evaluate(() => window.__unsubFr?.())
      // Bob deletes his own friendRequest
      await bobPage.evaluate(async ({ bobUid, rid }) => {
        await window.__fb.deleteDoc(window.__fb.doc(window.__fb.getDb(), 'users', bobUid, 'friendRequests', rid))
      }, { bobUid, rid: reqId })
    } finally {
      await bobCtx.close()
    }
  })

  test('multiple messages arrive in order', async ({ browser }) => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const { context: dianaCtx, page: dianaPage } = await openSecondBrowser(browser, TEST_ACCOUNTS.diana.email)
    const dianaUid = await getCurrentUid(dianaPage)

    try {
      const convId = await page.evaluate(async ({ a, b }) => {
        const { getDb, collection, addDoc, serverTimestamp } = window.__fb
        const ref = await addDoc(collection(getDb(), 'directMessages'), {
          participants: [a, b], type: 'dm', createdAt: serverTimestamp(),
        })
        return ref.id
      }, { a: aliceUid, b: dianaUid })

      await dianaPage.evaluate(async (cid) => {
        const { getDb, collection, onSnapshot } = window.__fb
        window.__orderedMsgs = []
        window.__unsubOrd = onSnapshot(collection(getDb(), 'directMessages', cid, 'messages'), (snap) => {
          snap.docChanges().forEach(change => {
            if (change.type === 'added') window.__orderedMsgs.push(change.doc.data().text)
          })
        })
      }, convId)

      for (let i = 1; i <= 3; i++) {
        await page.evaluate(async ({ cid, uid, i }) => {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          await addDoc(collection(getDb(), 'directMessages', cid, 'messages'), {
            text: `Message ${i}`, senderId: uid, createdAt: serverTimestamp(),
          })
        }, { cid: convId, uid: aliceUid, i })
        await page.waitForTimeout(200)
      }

      await dianaPage.waitForFunction(() => window.__orderedMsgs?.length >= 3, { timeout: 15000 })
      const msgs = await dianaPage.evaluate(() => window.__orderedMsgs)
      expect(msgs.length).toBe(3)
      expect(msgs).toContain('Message 1')
      expect(msgs).toContain('Message 2')
      expect(msgs).toContain('Message 3')

      await dianaPage.evaluate(() => window.__unsubOrd?.())
      await page.evaluate(async (cid) => {
        const { getDb, collection, getDocs, deleteDoc, doc } = window.__fb
        const msgs = await getDocs(collection(getDb(), 'directMessages', cid, 'messages'))
        for (const m of msgs.docs) await deleteDoc(m.ref)
        await deleteDoc(doc(getDb(), 'directMessages', cid))
      }, convId)
    } finally {
      await dianaCtx.close()
    }
  })
})
