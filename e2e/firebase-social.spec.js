/**
 * Firebase Social E2E Tests
 *
 * Tests friend requests, DMs, groups with real Firestore.
 * Uses shared session (Alice logged in) with UIDs looked up via Firestore.
 */
import { test, expect } from '@playwright/test'
import {
  TEST_ACCOUNTS,
  programmaticLogin,
  programmaticLogout,
  getCurrentUid,
  cleanupTestData,
  getUidByEmail,
  initFirebasePage,
} from './firebase-helpers.js'

test.describe('Firebase Social', () => {
  test.describe.configure({ mode: 'serial' })

  let context, page, aliceUid, bobUid, charlieUid

  test.beforeAll(async ({ browser }) => {
    if (!process.env.E2E_TEST_PASSWORD) return
    ;({ context, page, uid: aliceUid } = await initFirebasePage(browser, TEST_ACCOUNTS.alice.email))
    bobUid = await getUidByEmail(page, TEST_ACCOUNTS.bob.email)
    charlieUid = await getUidByEmail(page, TEST_ACCOUNTS.charlie.email)
  })

  test.afterAll(async () => {
    if (aliceUid && page) await cleanupTestData(page, aliceUid)
    await context?.close()
  })

  test('send friend request writes to Firestore', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async ({ from, to }) => {
      try {
        const { getDb, collection, addDoc, getDocs, query, where, deleteDoc, serverTimestamp } = window.__fb
        const db = getDb()
        const ref = await addDoc(collection(db, 'friendRequests'), {
          from, to, status: 'pending', createdAt: serverTimestamp(),
        })
        const q = query(collection(db, 'friendRequests'), where('from', '==', from), where('to', '==', to))
        const snap = await getDocs(q)
        await deleteDoc(ref)
        return { sent: true, found: snap.size > 0 }
      } catch (err) { return { error: err.message } }
    }, { from: aliceUid, to: bobUid })

    expect(result.sent).toBe(true)
    expect(result.found).toBe(true)
  })

  test('accept friend request updates status', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async ({ from, to }) => {
      try {
        const { getDb, collection, addDoc, updateDoc, getDoc, deleteDoc, serverTimestamp } = window.__fb
        const db = getDb()
        const ref = await addDoc(collection(db, 'friendRequests'), {
          from, to, status: 'pending', createdAt: serverTimestamp(),
        })
        await updateDoc(ref, { status: 'accepted' })
        const snap = await getDoc(ref)
        const status = snap.data()?.status
        await deleteDoc(ref)
        return { accepted: status === 'accepted' }
      } catch (err) { return { error: err.message } }
    }, { from: aliceUid, to: bobUid })

    expect(result.accepted).toBe(true)
  })

  test('reject friend request updates status', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async ({ from, to }) => {
      try {
        const { getDb, collection, addDoc, updateDoc, getDoc, deleteDoc, serverTimestamp } = window.__fb
        const db = getDb()
        const ref = await addDoc(collection(db, 'friendRequests'), {
          from, to, status: 'pending', createdAt: serverTimestamp(),
        })
        await updateDoc(ref, { status: 'rejected' })
        const snap = await getDoc(ref)
        const status = snap.data()?.status
        await deleteDoc(ref)
        return { rejected: status === 'rejected' }
      } catch (err) { return { error: err.message } }
    }, { from: aliceUid, to: charlieUid })

    expect(result.rejected).toBe(true)
  })

  test('send DM creates conversation and message', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async ({ alice, bob }) => {
      try {
        const { getDb, collection, addDoc, getDocs, deleteDoc, serverTimestamp } = window.__fb
        const db = getDb()
        const convRef = await addDoc(collection(db, 'conversations'), {
          participants: [alice, bob], type: 'dm',
          createdAt: serverTimestamp(), lastMessage: 'Hello from E2E test', lastMessageAt: serverTimestamp(),
        })
        const msgRef = await addDoc(collection(db, 'conversations', convRef.id, 'messages'), {
          text: 'Hello from E2E test', senderId: alice, createdAt: serverTimestamp(),
        })
        const msgsSnap = await getDocs(collection(db, 'conversations', convRef.id, 'messages'))
        const msgCount = msgsSnap.size
        for (const m of msgsSnap.docs) await deleteDoc(m.ref)
        await deleteDoc(convRef)
        return { convCreated: true, msgCount }
      } catch (err) { return { error: err.message } }
    }, { alice: aliceUid, bob: bobUid })

    expect(result.convCreated).toBe(true)
    expect(result.msgCount).toBe(1)
  })

  test('Charlie cannot read Alice-Bob DM (security)', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    // Alice creates DM
    const convId = await page.evaluate(async ({ alice, bob }) => {
      const { getDb, collection, addDoc, serverTimestamp } = window.__fb
      const ref = await addDoc(collection(getDb(), 'conversations'), {
        participants: [alice, bob], type: 'dm',
        createdAt: serverTimestamp(), lastMessage: 'Private message',
      })
      await addDoc(collection(getDb(), 'conversations', ref.id, 'messages'), {
        text: 'Secret message', senderId: alice, createdAt: serverTimestamp(),
      })
      return ref.id
    }, { alice: aliceUid, bob: bobUid })

    // Switch to Charlie
    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.charlie.email)

    const readResult = await page.evaluate(async (cid) => {
      try {
        const { getDb, doc, getDoc, collection, getDocs } = window.__fb
        const convSnap = await getDoc(doc(getDb(), 'conversations', cid))
        const msgsSnap = await getDocs(collection(getDb(), 'conversations', cid, 'messages'))
        return { canReadConv: convSnap.exists(), msgCount: msgsSnap.size }
      } catch (err) { return { error: err.code || err.message, blocked: true } }
    }, convId)

    expect(readResult.blocked === true || readResult.msgCount === 0).toBeTruthy()

    // Switch back to Alice and cleanup
    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.alice.email)
    await page.evaluate(async (cid) => {
      const { getDb, collection, getDocs, deleteDoc, doc } = window.__fb
      const msgsSnap = await getDocs(collection(getDb(), 'conversations', cid, 'messages'))
      for (const m of msgsSnap.docs) await deleteDoc(m.ref)
      await deleteDoc(doc(getDb(), 'conversations', cid))
    }, convId)
  })

  test('create and delete a group', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (uid) => {
      try {
        const { getDb, collection, addDoc, deleteDoc, getDoc, doc, serverTimestamp } = window.__fb
        const db = getDb()
        const ref = await addDoc(collection(db, 'groups'), {
          name: 'E2E Test Group', createdBy: uid,
          members: [uid], admins: [uid], createdAt: serverTimestamp(),
        })
        const snap = await getDoc(doc(db, 'groups', ref.id))
        const name = snap.data()?.name
        await deleteDoc(doc(db, 'groups', ref.id))
        return { created: snap.exists(), name }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.created).toBe(true)
    expect(result.name).toBe('E2E Test Group')
  })

  test('add member to group', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async ({ alice, bob }) => {
      try {
        const { getDb, collection, addDoc, updateDoc, getDoc, doc, deleteDoc, arrayUnion, serverTimestamp } = window.__fb
        const db = getDb()
        const ref = await addDoc(collection(db, 'groups'), {
          name: 'Members Test', createdBy: alice,
          members: [alice], admins: [alice], createdAt: serverTimestamp(),
        })
        await updateDoc(doc(db, 'groups', ref.id), { members: arrayUnion(bob) })
        const snap = await getDoc(doc(db, 'groups', ref.id))
        const members = snap.data()?.members || []
        await deleteDoc(doc(db, 'groups', ref.id))
        return { hasBob: members.includes(bob), memberCount: members.length }
      } catch (err) { return { error: err.message } }
    }, { alice: aliceUid, bob: bobUid })

    expect(result.hasBob).toBe(true)
    expect(result.memberCount).toBe(2)
  })

  test('group message writes correctly', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (uid) => {
      try {
        const { getDb, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } = window.__fb
        const db = getDb()
        const groupRef = await addDoc(collection(db, 'groups'), {
          name: 'Msg Test', createdBy: uid,
          members: [uid], admins: [uid], createdAt: serverTimestamp(),
        })
        await addDoc(collection(db, 'groups', groupRef.id, 'messages'), {
          text: 'Hello group!', senderId: uid, createdAt: serverTimestamp(),
        })
        const msgsSnap = await getDocs(collection(db, 'groups', groupRef.id, 'messages'))
        const firstMsg = msgsSnap.docs[0]?.data()?.text
        for (const m of msgsSnap.docs) await deleteDoc(m.ref)
        await deleteDoc(doc(db, 'groups', groupRef.id))
        return { count: msgsSnap.size, text: firstMsg }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.count).toBe(1)
    expect(result.text).toBe('Hello group!')
  })

  test('leave group removes member', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async ({ alice, bob }) => {
      try {
        const { getDb, collection, addDoc, updateDoc, getDoc, doc, deleteDoc, arrayRemove, serverTimestamp } = window.__fb
        const db = getDb()
        const ref = await addDoc(collection(db, 'groups'), {
          name: 'Leave Test', createdBy: alice,
          members: [alice, bob], admins: [alice], createdAt: serverTimestamp(),
        })
        await updateDoc(doc(db, 'groups', ref.id), { members: arrayRemove(bob) })
        const snap = await getDoc(doc(db, 'groups', ref.id))
        const members = snap.data()?.members || []
        await deleteDoc(doc(db, 'groups', ref.id))
        return { hasBob: members.includes(bob), memberCount: members.length }
      } catch (err) { return { error: err.message } }
    }, { alice: aliceUid, bob: bobUid })

    expect(result.hasBob).toBe(false)
    expect(result.memberCount).toBe(1)
  })

  test('share spot location creates share record', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async ({ alice, bob }) => {
      try {
        const { getDb, collection, addDoc, deleteDoc, getDocs, serverTimestamp } = window.__fb
        const db = getDb()
        const convRef = await addDoc(collection(db, 'conversations'), {
          participants: [alice, bob], type: 'dm', createdAt: serverTimestamp(),
        })
        await addDoc(collection(db, 'conversations', convRef.id, 'messages'), {
          text: '', senderId: alice, createdAt: serverTimestamp(),
          type: 'spot_share', spotData: { lat: 48.85, lng: 2.35, name: 'Paris spot' },
        })
        const msgsSnap = await getDocs(collection(db, 'conversations', convRef.id, 'messages'))
        const shareMsg = msgsSnap.docs.find(d => d.data().type === 'spot_share')
        for (const m of msgsSnap.docs) await deleteDoc(m.ref)
        await deleteDoc(convRef)
        return { shared: !!shareMsg, spotName: shareMsg?.data()?.spotData?.name }
      } catch (err) { return { error: err.message } }
    }, { alice: aliceUid, bob: bobUid })

    expect(result.shared).toBe(true)
    expect(result.spotName).toBe('Paris spot')
  })
})
