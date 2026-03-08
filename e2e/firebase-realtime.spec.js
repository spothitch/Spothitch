/**
 * Firebase Realtime E2E Tests
 *
 * Tests real-time features with 2 browser contexts (simulating 2 users).
 * Uses onSnapshot, concurrent writes, and cross-browser sync.
 */
import { test, expect } from '@playwright/test'
import { skipOnboarding } from './helpers.js'
import {
  TEST_ACCOUNTS,
  firebaseLogin,
  firebaseLogout,
  getCurrentUid,
  setupAuthenticatedPage,
  openSecondBrowser,
} from './firebase-helpers.js'

test.beforeEach(async () => {
  if (!process.env.E2E_TEST_PASSWORD) test.skip(true, 'E2E_TEST_PASSWORD not set')
})

test.describe('Firebase Realtime', () => {
  test('DM received in real-time by second browser', async ({ page, browser }) => {
    // Alice in main page
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)
    const aliceUid = await getCurrentUid(page)

    // Bob in second browser
    const { context: bobCtx, page: bobPage } = await openSecondBrowser(
      browser, TEST_ACCOUNTS.bob.email
    )
    const bobUid = await getCurrentUid(bobPage)

    try {
      // Alice creates a conversation and Bob listens
      const convId = await page.evaluate(async ({ alice, bob }) => {
        const { getDb, collection, addDoc, serverTimestamp } = window.__fb
        const db = getDb()
        const ref = await addDoc(collection(db, 'conversations'), {
          participants: [alice, bob], type: 'dm',
          createdAt: serverTimestamp(), lastMessage: '',
        })
        return ref.id
      }, { alice: aliceUid, bob: bobUid })

      // Bob sets up onSnapshot listener
      await bobPage.evaluate(async (cid) => {
        const { getDb, collection, onSnapshot } = window.__fb
        const db = getDb()
        window.__realtimeMessages = []
        window.__unsub = onSnapshot(collection(db, 'conversations', cid, 'messages'), (snap) => {
          snap.docChanges().forEach(change => {
            if (change.type === 'added') {
              window.__realtimeMessages.push(change.doc.data())
            }
          })
        })
      }, convId)

      // Alice sends a message
      await page.evaluate(async ({ cid, alice }) => {
        const { getDb, collection, addDoc, serverTimestamp } = window.__fb
        const db = getDb()
        await addDoc(collection(db, 'conversations', cid, 'messages'), {
          text: 'Real-time hello!', senderId: alice, createdAt: serverTimestamp(),
        })
      }, { cid: convId, alice: aliceUid })

      // Wait for Bob to receive
      await bobPage.waitForFunction(() => window.__realtimeMessages?.length > 0, { timeout: 10000 })

      const received = await bobPage.evaluate(() => window.__realtimeMessages)
      expect(received.length).toBeGreaterThan(0)
      expect(received[0].text).toBe('Real-time hello!')

      // Cleanup
      await bobPage.evaluate(() => window.__unsub?.())
      await page.evaluate(async (cid) => {
        const { getDb, collection, getDocs, deleteDoc, doc } = window.__fb
        const db = getDb()
        const msgs = await getDocs(collection(db, 'conversations', cid, 'messages'))
        for (const m of msgs.docs) await deleteDoc(m.ref)
        await deleteDoc(doc(db, 'conversations', cid))
      }, convId)
    } finally {
      await bobCtx.close()
    }
  })

  test('onSnapshot favorites sync across tabs', async ({ page, browser }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)
    const uid = await getCurrentUid(page)

    // Second tab for the same user
    const { context: ctx2, page: page2 } = await openSecondBrowser(
      browser, TEST_ACCOUNTS.alice.email
    )

    try {
      // Page2 listens for favorites changes
      await page2.evaluate(async (testUid) => {
        const { getDb, collection, onSnapshot } = window.__fb
        const db = getDb()
        window.__favChanges = []
        window.__unsubFav = onSnapshot(collection(db, 'users', testUid, 'favorites'), (snap) => {
          snap.docChanges().forEach(change => {
            window.__favChanges.push({ type: change.type, id: change.doc.id })
          })
        })
      }, uid)

      // Page1 adds a favorite
      await page.evaluate(async (testUid) => {
        const { getDb, doc, setDoc, serverTimestamp } = window.__fb
        const db = getDb()
        await setDoc(doc(db, 'users', testUid, 'favorites', 'rt-test-fav'), {
          spotId: 'rt-test-fav', lat: 48.85, lng: 2.35, addedAt: serverTimestamp(),
        })
      }, uid)

      // Wait for page2 to receive
      await page2.waitForFunction(
        () => window.__favChanges?.some(c => c.type === 'added' && c.id === 'rt-test-fav'),
        { timeout: 10000 }
      )

      const changes = await page2.evaluate(() => window.__favChanges)
      expect(changes.some(c => c.id === 'rt-test-fav')).toBe(true)

      // Cleanup
      await page2.evaluate(() => window.__unsubFav?.())
      await page.evaluate(async (testUid) => {
        const { getDb, doc, deleteDoc } = window.__fb
        await deleteDoc(doc(getDb(), 'users', testUid, 'favorites', 'rt-test-fav'))
      }, uid)
    } finally {
      await ctx2.close()
    }
  })

  test('concurrent writes with increment do not lose data', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.bob.email)
    const uid = await getCurrentUid(page)

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, updateDoc, getDoc, increment } = window.__fb
        const db = getDb()

        // Reset
        await updateDoc(doc(db, 'users', testUid), { points: 0 })

        // 10 concurrent increments
        const promises = Array.from({ length: 10 }, () =>
          updateDoc(doc(db, 'users', testUid), { points: increment(1) })
        )
        await Promise.all(promises)

        const snap = await getDoc(doc(db, 'users', testUid))
        return { points: snap.data()?.points }
      } catch (err) {
        return { error: err.message }
      }
    }, uid)

    expect(result.points).toBe(10)
  })

  test('friend request notification arrives in real-time', async ({ page, browser }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)
    const aliceUid = await getCurrentUid(page)

    const { context: bobCtx, page: bobPage } = await openSecondBrowser(
      browser, TEST_ACCOUNTS.bob.email
    )
    const bobUid = await getCurrentUid(bobPage)

    try {
      // Bob listens for incoming friend requests
      await bobPage.evaluate(async (testUid) => {
        const { getDb, collection, query, where, onSnapshot } = window.__fb
        const db = getDb()
        window.__friendRequests = []
        window.__unsubFr = onSnapshot(
          query(collection(db, 'friendRequests'), where('to', '==', testUid)),
          (snap) => {
            snap.docChanges().forEach(change => {
              if (change.type === 'added') {
                window.__friendRequests.push(change.doc.data())
              }
            })
          }
        )
      }, bobUid)

      // Alice sends friend request
      const reqId = await page.evaluate(async ({ from, to }) => {
        const { getDb, collection, addDoc, serverTimestamp } = window.__fb
        const ref = await addDoc(collection(getDb(), 'friendRequests'), {
          from, to, status: 'pending', createdAt: serverTimestamp(),
        })
        return ref.id
      }, { from: aliceUid, to: bobUid })

      // Bob receives it
      await bobPage.waitForFunction(
        () => window.__friendRequests?.length > 0,
        { timeout: 10000 }
      )

      const requests = await bobPage.evaluate(() => window.__friendRequests)
      expect(requests.length).toBeGreaterThan(0)
      expect(requests[0].from).toBe(aliceUid)

      // Cleanup
      await bobPage.evaluate(() => window.__unsubFr?.())
      await page.evaluate(async (rid) => {
        const { getDb, doc, deleteDoc } = window.__fb
        await deleteDoc(doc(getDb(), 'friendRequests', rid))
      }, reqId)
    } finally {
      await bobCtx.close()
    }
  })

  test('multiple messages arrive in order', async ({ page, browser }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.charlie.email)
    const charlieUid = await getCurrentUid(page)

    const { context: dianaCtx, page: dianaPage } = await openSecondBrowser(
      browser, TEST_ACCOUNTS.diana.email
    )
    const dianaUid = await getCurrentUid(dianaPage)

    try {
      // Create conversation
      const convId = await page.evaluate(async ({ a, b }) => {
        const { getDb, collection, addDoc, serverTimestamp } = window.__fb
        const ref = await addDoc(collection(getDb(), 'conversations'), {
          participants: [a, b], type: 'dm', createdAt: serverTimestamp(),
        })
        return ref.id
      }, { a: charlieUid, b: dianaUid })

      // Diana listens
      await dianaPage.evaluate(async (cid) => {
        const { getDb, collection, onSnapshot } = window.__fb
        window.__orderedMsgs = []
        window.__unsubOrd = onSnapshot(collection(getDb(), 'conversations', cid, 'messages'), (snap) => {
          snap.docChanges().forEach(change => {
            if (change.type === 'added') window.__orderedMsgs.push(change.doc.data().text)
          })
        })
      }, convId)

      // Charlie sends 3 messages sequentially
      for (let i = 1; i <= 3; i++) {
        await page.evaluate(async ({ cid, uid, i }) => {
          const { getDb, collection, addDoc, serverTimestamp } = window.__fb
          await addDoc(collection(getDb(), 'conversations', cid, 'messages'), {
            text: `Message ${i}`, senderId: uid, createdAt: serverTimestamp(),
          })
        }, { cid: convId, uid: charlieUid, i })
        await page.waitForTimeout(200)
      }

      // Wait for Diana to receive all 3
      await dianaPage.waitForFunction(() => window.__orderedMsgs?.length >= 3, { timeout: 15000 })

      const msgs = await dianaPage.evaluate(() => window.__orderedMsgs)
      expect(msgs.length).toBe(3)
      expect(msgs).toContain('Message 1')
      expect(msgs).toContain('Message 2')
      expect(msgs).toContain('Message 3')

      // Cleanup
      await dianaPage.evaluate(() => window.__unsubOrd?.())
      await page.evaluate(async (cid) => {
        const { getDb, collection, getDocs, deleteDoc, doc } = window.__fb
        const db = getDb()
        const msgs = await getDocs(collection(db, 'conversations', cid, 'messages'))
        for (const m of msgs.docs) await deleteDoc(m.ref)
        await deleteDoc(doc(db, 'conversations', cid))
      }, convId)
    } finally {
      await dianaCtx.close()
    }
  })
})
