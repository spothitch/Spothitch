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
  openSecondBrowser,
} from './firebase-helpers.js'

test.describe('Firebase Social', () => {
  test.describe.configure({ mode: 'serial' })

  let context, page, aliceUid, bobUid, charlieUid, isFallback

  test.beforeAll(async ({ browser }) => {
    if (!process.env.E2E_TEST_PASSWORD) return
    ;({ context, page, uid: aliceUid } = await initFirebasePage(browser, TEST_ACCOUNTS.alice.email))
    isFallback = aliceUid?.startsWith('ci-ci-') || false
    if (!isFallback) {
      bobUid = await getUidByEmail(page, TEST_ACCOUNTS.bob.email)
      charlieUid = await getUidByEmail(page, TEST_ACCOUNTS.charlie.email)
    }
  })

  test.afterAll(async () => {
    if (aliceUid && page && !isFallback) await cleanupTestData(page, aliceUid)
    await context?.close()
  })

  test.beforeEach(() => {
    test.skip(!!isFallback, 'Firebase emulator not reachable from browser build')
  })

  test('send friend request writes to Firestore', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async ({ from, to }) => {
      try {
        const { getDb, doc, setDoc, serverTimestamp } = window.__fb
        const db = getDb()
        // Write to recipient's friendRequests subcollection. Per firestore.rules the
        // doc id must equal the sender's uid and the data must carry fromUserId == sender.
        await setDoc(doc(db, 'users', to, 'friendRequests', from), {
          fromUserId: from, to, status: 'pending', createdAt: serverTimestamp(),
        })
        // setDoc succeeded = write worked. Alice can't read/delete Bob's subcollection (security rules)
        return { sent: true }
      } catch (err) { return { error: err.message } }
    }, { from: aliceUid, to: bobUid })

    expect(result.sent).toBe(true)
  })

  // friendRequests are immutable (rule: update=false) and a request can only be created
  // by its sender (doc id == sender uid, fromUserId == sender). So Bob must send it from
  // his own session; "accept" = create the mutual friendship + delete the request.
  test('accept friend request creates friendship and clears request', async ({ browser }) => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')
    test.skip(isFallback, 'Firebase emulator not reachable from browser build')

    const { context: bobCtx, page: bobPage } = await openSecondBrowser(browser, TEST_ACCOUNTS.bob.email)
    try {
      // Bob sends a friend request to Alice (rule: doc id = sender uid, fromUserId = sender)
      await bobPage.evaluate(async (aUid) => {
        const { getDb, doc, setDoc, getAuth, serverTimestamp } = window.__fb
        const me = getAuth().currentUser.uid
        await setDoc(doc(getDb(), 'users', aUid, 'friendRequests', me), {
          fromUserId: me, to: aUid, status: 'pending', createdAt: serverTimestamp(),
        })
      }, aliceUid)

      // Alice accepts: verify the request, create mutual friends, delete the request
      const result = await page.evaluate(async ({ aUid, bUid }) => {
        try {
          const { getDb, doc, setDoc, getDoc, deleteDoc, serverTimestamp } = window.__fb
          const db = getDb()
          const reqBefore = await getDoc(doc(db, 'users', aUid, 'friendRequests', bUid))
          await setDoc(doc(db, 'users', aUid, 'friends', bUid), { uid: bUid, since: serverTimestamp() })
          await setDoc(doc(db, 'users', bUid, 'friends', aUid), { uid: aUid, since: serverTimestamp() })
          await deleteDoc(doc(db, 'users', aUid, 'friendRequests', bUid))
          const reqAfter = await getDoc(doc(db, 'users', aUid, 'friendRequests', bUid))
          const friend = await getDoc(doc(db, 'users', aUid, 'friends', bUid))
          // cleanup friends
          try { await deleteDoc(doc(db, 'users', aUid, 'friends', bUid)) } catch { /* ignore */ }
          try { await deleteDoc(doc(db, 'users', bUid, 'friends', aUid)) } catch { /* ignore */ }
          return { hadRequest: reqBefore.exists(), friendCreated: friend.exists(), requestCleared: !reqAfter.exists() }
        } catch (err) { return { error: err.message } }
      }, { aUid: aliceUid, bUid: bobUid })

      expect(result.hadRequest).toBe(true)
      expect(result.friendCreated).toBe(true)
      expect(result.requestCleared).toBe(true)
    } finally {
      await bobCtx.close()
    }
  })

  test('reject friend request deletes the request', async ({ browser }) => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')
    test.skip(isFallback, 'Firebase emulator not reachable from browser build')

    const { context: bobCtx, page: bobPage } = await openSecondBrowser(browser, TEST_ACCOUNTS.bob.email)
    try {
      await bobPage.evaluate(async (aUid) => {
        const { getDb, doc, setDoc, getAuth, serverTimestamp } = window.__fb
        const me = getAuth().currentUser.uid
        await setDoc(doc(getDb(), 'users', aUid, 'friendRequests', me), {
          fromUserId: me, to: aUid, status: 'pending', createdAt: serverTimestamp(),
        })
      }, aliceUid)

      const result = await page.evaluate(async ({ aUid, bUid }) => {
        try {
          const { getDb, doc, getDoc, deleteDoc } = window.__fb
          const db = getDb()
          const before = await getDoc(doc(db, 'users', aUid, 'friendRequests', bUid))
          await deleteDoc(doc(db, 'users', aUid, 'friendRequests', bUid))
          const after = await getDoc(doc(db, 'users', aUid, 'friendRequests', bUid))
          return { hadRequest: before.exists(), rejected: !after.exists() }
        } catch (err) { return { error: err.message } }
      }, { aUid: aliceUid, bUid: bobUid })

      expect(result.hadRequest).toBe(true)
      expect(result.rejected).toBe(true)
    } finally {
      await bobCtx.close()
    }
  })

  test('send DM creates conversation and message', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async ({ alice, bob }) => {
      try {
        const { getDb, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } = window.__fb
        const db = getDb()
        // Use sorted uid pair as convId (app convention)
        const sorted = [alice, bob].sort()
        const convId = sorted.join('_dm_')
        await addDoc(collection(db, 'directMessages'), {
          participants: sorted, type: 'dm',
          createdAt: serverTimestamp(), lastMessage: 'Hello from E2E test', lastMessageAt: serverTimestamp(),
        }).catch(() => null) // May already exist

        // For E2E, use addDoc to create a new DM conv
        const convRef = await addDoc(collection(db, 'directMessages'), {
          participants: sorted, type: 'dm',
          createdAt: serverTimestamp(), lastMessage: 'Hello from E2E test',
        })
        const msgRef = await addDoc(collection(db, 'directMessages', convRef.id, 'messages'), {
          text: 'Hello from E2E test', senderId: alice, createdAt: serverTimestamp(),
        })
        const msgsSnap = await getDocs(collection(db, 'directMessages', convRef.id, 'messages'))
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
      const sorted = [alice, bob].sort()
      const ref = await addDoc(collection(getDb(), 'directMessages'), {
        participants: sorted, type: 'dm',
        createdAt: serverTimestamp(), lastMessage: 'Private message',
      })
      await addDoc(collection(getDb(), 'directMessages', ref.id, 'messages'), {
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
        const convSnap = await getDoc(doc(getDb(), 'directMessages', cid))
        const msgsSnap = await getDocs(collection(getDb(), 'directMessages', cid, 'messages'))
        return { canReadConv: convSnap.exists(), msgCount: msgsSnap.size }
      } catch (err) { return { error: err.code || err.message, blocked: true } }
    }, convId)

    expect(readResult.blocked === true || readResult.msgCount === 0).toBeTruthy()

    // Switch back to Alice and cleanup
    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.alice.email)
    await page.evaluate(async (cid) => {
      const { getDb, collection, getDocs, deleteDoc, doc } = window.__fb
      try {
        const msgsSnap = await getDocs(collection(getDb(), 'directMessages', cid, 'messages'))
        for (const m of msgsSnap.docs) await deleteDoc(m.ref)
        await deleteDoc(doc(getDb(), 'directMessages', cid))
      } catch {}
    }, convId)
  })

  test('create and delete a group', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (uid) => {
      try {
        const { getDb, collection, addDoc, deleteDoc, getDoc, doc, serverTimestamp } = window.__fb
        const db = getDb()
        const ref = await addDoc(collection(db, 'groupConversations'), {
          name: 'E2E Test Group', creator: uid,
          members: [uid], createdAt: serverTimestamp(),
        })
        const snap = await getDoc(doc(db, 'groupConversations', ref.id))
        const name = snap.data()?.name
        await deleteDoc(doc(db, 'groupConversations', ref.id))
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
        const ref = await addDoc(collection(db, 'groupConversations'), {
          name: 'Members Test', creator: alice,
          members: [alice], createdAt: serverTimestamp(),
        })
        await updateDoc(doc(db, 'groupConversations', ref.id), { members: arrayUnion(bob) })
        const snap = await getDoc(doc(db, 'groupConversations', ref.id))
        const members = snap.data()?.members || []
        await deleteDoc(doc(db, 'groupConversations', ref.id))
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
        const groupRef = await addDoc(collection(db, 'groupConversations'), {
          name: 'Msg Test', creator: uid,
          members: [uid], createdAt: serverTimestamp(),
        })
        await addDoc(collection(db, 'groupConversations', groupRef.id, 'messages'), {
          text: 'Hello group!', senderId: uid, createdAt: serverTimestamp(),
        })
        const msgsSnap = await getDocs(collection(db, 'groupConversations', groupRef.id, 'messages'))
        const firstMsg = msgsSnap.docs[0]?.data()?.text
        // Note: group messages cannot be deleted (security rules), just delete the group
        await deleteDoc(doc(db, 'groupConversations', groupRef.id))
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
        const ref = await addDoc(collection(db, 'groupConversations'), {
          name: 'Leave Test', creator: alice,
          members: [alice, bob], createdAt: serverTimestamp(),
        })
        await updateDoc(doc(db, 'groupConversations', ref.id), { members: arrayRemove(bob) })
        const snap = await getDoc(doc(db, 'groupConversations', ref.id))
        const members = snap.data()?.members || []
        await deleteDoc(doc(db, 'groupConversations', ref.id))
        return { hasBob: members.includes(bob), memberCount: members.length }
      } catch (err) { return { error: err.message } }
    }, { alice: aliceUid, bob: bobUid })

    expect(result.hasBob).toBe(false)
    expect(result.memberCount).toBe(1)
  })

  test('friends list bidirectional write', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async ({ alice, bob }) => {
      try {
        const { getDb, doc, setDoc, getDoc, deleteDoc, writeBatch, serverTimestamp } = window.__fb
        const db = getDb()
        const batch = writeBatch(db)
        batch.set(doc(db, 'users', alice, 'friends', bob), {
          name: 'Bob Test', addedAt: serverTimestamp(),
        })
        batch.set(doc(db, 'users', bob, 'friends', alice), {
          name: 'Alice Test', addedAt: serverTimestamp(),
        })
        await batch.commit()
        const aliceSnap = await getDoc(doc(db, 'users', alice, 'friends', bob))
        const hasFriend = aliceSnap.exists()
        await deleteDoc(doc(db, 'users', alice, 'friends', bob))
        return { hasFriend, name: aliceSnap.data()?.name }
      } catch (err) { return { error: err.message } }
    }, { alice: aliceUid, bob: bobUid })

    expect(result.hasFriend).toBe(true)
    expect(result.name).toBe('Bob Test')
  })

  test('user review write and read', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async ({ alice, bob }) => {
      try {
        const { getDb, doc, setDoc, getDoc, deleteDoc, serverTimestamp } = window.__fb
        const db = getDb()
        await setDoc(doc(db, 'userReviews', bob, 'reviews', alice), {
          rating: 5, comment: 'Great hitchhiker!', reviewerUid: alice, createdAt: serverTimestamp(),
        })
        const snap = await getDoc(doc(db, 'userReviews', bob, 'reviews', alice))
        const data = snap.data()
        await deleteDoc(doc(db, 'userReviews', bob, 'reviews', alice))
        return { exists: snap.exists(), rating: data?.rating, comment: data?.comment }
      } catch (err) { return { error: err.message } }
    }, { alice: aliceUid, bob: bobUid })

    expect(result.exists).toBe(true)
    expect(result.rating).toBe(5)
    expect(result.comment).toBe('Great hitchhiker!')
  })

  test('share spot location creates share record', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async ({ alice, bob }) => {
      try {
        const { getDb, collection, addDoc, deleteDoc, getDocs, serverTimestamp } = window.__fb
        const db = getDb()
        const sorted = [alice, bob].sort()
        const convRef = await addDoc(collection(db, 'directMessages'), {
          participants: sorted, type: 'dm', createdAt: serverTimestamp(),
        })
        await addDoc(collection(db, 'directMessages', convRef.id, 'messages'), {
          text: '', senderId: alice, createdAt: serverTimestamp(),
          type: 'spot_share', spotData: { lat: 48.85, lng: 2.35, name: 'Paris spot' },
        })
        const msgsSnap = await getDocs(collection(db, 'directMessages', convRef.id, 'messages'))
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
