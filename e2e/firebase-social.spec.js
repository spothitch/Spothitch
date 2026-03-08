/**
 * Firebase Social E2E Tests
 *
 * Tests friend requests, DMs, groups, and social features with real Firestore.
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
  cleanupTestData,
} from './firebase-helpers.js'

test.beforeEach(async () => {
  if (!process.env.E2E_TEST_PASSWORD) test.skip(true, 'E2E_TEST_PASSWORD not set')
})

test.describe('Firebase Social', () => {
  test('send friend request writes to Firestore', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)
    const aliceUid = await getCurrentUid(page)

    // Get Bob's UID by logging in briefly
    await firebaseLogout(page)
    await firebaseLogin(page, TEST_ACCOUNTS.bob.email)
    const bobUid = await getCurrentUid(page)
    await firebaseLogout(page)

    // Login as Alice and send request
    await firebaseLogin(page, TEST_ACCOUNTS.alice.email)

    const result = await page.evaluate(async ({ from, to }) => {
      try {
        const { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, serverTimestamp } = await import('firebase/firestore')
        const db = getFirestore()

        const ref = await addDoc(collection(db, 'friendRequests'), {
          from, to, status: 'pending', createdAt: serverTimestamp(),
        })

        // Verify
        const q = query(collection(db, 'friendRequests'), where('from', '==', from), where('to', '==', to))
        const snap = await getDocs(q)
        const found = snap.size > 0

        // Cleanup
        await deleteDoc(ref)
        return { sent: true, found }
      } catch (err) {
        return { error: err.message }
      }
    }, { from: aliceUid, to: bobUid })

    expect(result.sent).toBe(true)
    expect(result.found).toBe(true)
  })

  test('accept friend request updates status', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)
    const aliceUid = await getCurrentUid(page)

    await firebaseLogout(page)
    await firebaseLogin(page, TEST_ACCOUNTS.bob.email)
    const bobUid = await getCurrentUid(page)
    await firebaseLogout(page)

    await firebaseLogin(page, TEST_ACCOUNTS.alice.email)

    const result = await page.evaluate(async ({ from, to }) => {
      try {
        const { getFirestore, collection, addDoc, updateDoc, getDoc, doc, deleteDoc, serverTimestamp } = await import('firebase/firestore')
        const db = getFirestore()

        // Send request
        const ref = await addDoc(collection(db, 'friendRequests'), {
          from, to, status: 'pending', createdAt: serverTimestamp(),
        })

        // Accept it
        await updateDoc(ref, { status: 'accepted' })

        const snap = await getDoc(ref)
        const status = snap.data()?.status

        // Cleanup
        await deleteDoc(ref)
        return { accepted: status === 'accepted' }
      } catch (err) {
        return { error: err.message }
      }
    }, { from: aliceUid, to: bobUid })

    expect(result.accepted).toBe(true)
  })

  test('send DM creates conversation and message', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)
    const aliceUid = await getCurrentUid(page)

    await firebaseLogout(page)
    await firebaseLogin(page, TEST_ACCOUNTS.bob.email)
    const bobUid = await getCurrentUid(page)
    await firebaseLogout(page)

    await firebaseLogin(page, TEST_ACCOUNTS.alice.email)

    const result = await page.evaluate(async ({ alice, bob }) => {
      try {
        const { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc, serverTimestamp } = await import('firebase/firestore')
        const db = getFirestore()

        // Create conversation
        const convRef = await addDoc(collection(db, 'conversations'), {
          participants: [alice, bob],
          type: 'dm',
          createdAt: serverTimestamp(),
          lastMessage: 'Hello from E2E test',
          lastMessageAt: serverTimestamp(),
        })

        // Add message
        const msgRef = await addDoc(collection(db, 'conversations', convRef.id, 'messages'), {
          text: 'Hello from E2E test',
          senderId: alice,
          createdAt: serverTimestamp(),
        })

        // Verify
        const msgsSnap = await getDocs(collection(db, 'conversations', convRef.id, 'messages'))
        const msgCount = msgsSnap.size

        // Cleanup
        for (const m of msgsSnap.docs) await deleteDoc(m.ref)
        await deleteDoc(convRef)

        return { convCreated: true, msgCount }
      } catch (err) {
        return { error: err.message }
      }
    }, { alice: aliceUid, bob: bobUid })

    expect(result.convCreated).toBe(true)
    expect(result.msgCount).toBe(1)
  })

  test('Charlie cannot read Alice-Bob DM (security)', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)
    const aliceUid = await getCurrentUid(page)

    await firebaseLogout(page)
    await firebaseLogin(page, TEST_ACCOUNTS.bob.email)
    const bobUid = await getCurrentUid(page)
    await firebaseLogout(page)

    // Alice creates a DM with Bob
    await firebaseLogin(page, TEST_ACCOUNTS.alice.email)
    const convId = await page.evaluate(async ({ alice, bob }) => {
      const { getFirestore, collection, addDoc, serverTimestamp } = await import('firebase/firestore')
      const db = getFirestore()
      const ref = await addDoc(collection(db, 'conversations'), {
        participants: [alice, bob], type: 'dm',
        createdAt: serverTimestamp(), lastMessage: 'Private message',
      })
      await addDoc(collection(db, 'conversations', ref.id, 'messages'), {
        text: 'Secret message', senderId: alice, createdAt: serverTimestamp(),
      })
      return ref.id
    }, { alice: aliceUid, bob: bobUid })

    await firebaseLogout(page)

    // Charlie tries to read
    await firebaseLogin(page, TEST_ACCOUNTS.charlie.email)

    const readResult = await page.evaluate(async (cid) => {
      try {
        const { getFirestore, doc, getDoc, collection, getDocs } = await import('firebase/firestore')
        const db = getFirestore()

        // Try to read conversation doc
        const convSnap = await getDoc(doc(db, 'conversations', cid))
        // Try to read messages
        const msgsSnap = await getDocs(collection(db, 'conversations', cid, 'messages'))

        return { canReadConv: convSnap.exists(), msgCount: msgsSnap.size }
      } catch (err) {
        return { error: err.code || err.message, blocked: true }
      }
    }, convId)

    // If security rules work, Charlie should be blocked
    // Note: depends on Firestore rules being configured
    expect(readResult.blocked === true || readResult.msgCount === 0).toBeTruthy()

    // Cleanup: login as Alice
    await firebaseLogout(page)
    await firebaseLogin(page, TEST_ACCOUNTS.alice.email)
    await page.evaluate(async (cid) => {
      const { getFirestore, collection, getDocs, deleteDoc, doc } = await import('firebase/firestore')
      const db = getFirestore()
      const msgsSnap = await getDocs(collection(db, 'conversations', cid, 'messages'))
      for (const m of msgsSnap.docs) await deleteDoc(m.ref)
      await deleteDoc(doc(db, 'conversations', cid))
    }, convId)
  })

  test('create and delete a group', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)
    const aliceUid = await getCurrentUid(page)

    const result = await page.evaluate(async (uid) => {
      try {
        const { getFirestore, collection, addDoc, deleteDoc, getDoc, doc, serverTimestamp } = await import('firebase/firestore')
        const db = getFirestore()

        const ref = await addDoc(collection(db, 'groups'), {
          name: 'E2E Test Group',
          createdBy: uid,
          members: [uid],
          admins: [uid],
          createdAt: serverTimestamp(),
        })

        const snap = await getDoc(doc(db, 'groups', ref.id))
        const exists = snap.exists()
        const name = snap.data()?.name

        await deleteDoc(doc(db, 'groups', ref.id))
        return { created: exists, name }
      } catch (err) {
        return { error: err.message }
      }
    }, aliceUid)

    expect(result.created).toBe(true)
    expect(result.name).toBe('E2E Test Group')
  })

  test('add member to group', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)
    const aliceUid = await getCurrentUid(page)

    await firebaseLogout(page)
    await firebaseLogin(page, TEST_ACCOUNTS.bob.email)
    const bobUid = await getCurrentUid(page)
    await firebaseLogout(page)

    await firebaseLogin(page, TEST_ACCOUNTS.alice.email)

    const result = await page.evaluate(async ({ alice, bob }) => {
      try {
        const { getFirestore, collection, addDoc, updateDoc, getDoc, doc, deleteDoc, arrayUnion, serverTimestamp } = await import('firebase/firestore')
        const db = getFirestore()

        const ref = await addDoc(collection(db, 'groups'), {
          name: 'Members Test', createdBy: alice,
          members: [alice], admins: [alice], createdAt: serverTimestamp(),
        })

        await updateDoc(doc(db, 'groups', ref.id), { members: arrayUnion(bob) })

        const snap = await getDoc(doc(db, 'groups', ref.id))
        const members = snap.data()?.members || []
        const hasBob = members.includes(bob)

        await deleteDoc(doc(db, 'groups', ref.id))
        return { hasBob, memberCount: members.length }
      } catch (err) {
        return { error: err.message }
      }
    }, { alice: aliceUid, bob: bobUid })

    expect(result.hasBob).toBe(true)
    expect(result.memberCount).toBe(2)
  })

  test('group message writes correctly', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)
    const aliceUid = await getCurrentUid(page)

    const result = await page.evaluate(async (uid) => {
      try {
        const { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } = await import('firebase/firestore')
        const db = getFirestore()

        // Create group
        const groupRef = await addDoc(collection(db, 'groups'), {
          name: 'Msg Test', createdBy: uid,
          members: [uid], admins: [uid], createdAt: serverTimestamp(),
        })

        // Add message
        await addDoc(collection(db, 'groups', groupRef.id, 'messages'), {
          text: 'Hello group!', senderId: uid, createdAt: serverTimestamp(),
        })

        const msgsSnap = await getDocs(collection(db, 'groups', groupRef.id, 'messages'))
        const count = msgsSnap.size
        const firstMsg = msgsSnap.docs[0]?.data()?.text

        // Cleanup
        for (const m of msgsSnap.docs) await deleteDoc(m.ref)
        await deleteDoc(doc(db, 'groups', groupRef.id))

        return { count, text: firstMsg }
      } catch (err) {
        return { error: err.message }
      }
    }, aliceUid)

    expect(result.count).toBe(1)
    expect(result.text).toBe('Hello group!')
  })

  test('leave group removes member', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)
    const aliceUid = await getCurrentUid(page)

    await firebaseLogout(page)
    await firebaseLogin(page, TEST_ACCOUNTS.bob.email)
    const bobUid = await getCurrentUid(page)
    await firebaseLogout(page)

    await firebaseLogin(page, TEST_ACCOUNTS.alice.email)

    const result = await page.evaluate(async ({ alice, bob }) => {
      try {
        const { getFirestore, collection, addDoc, updateDoc, getDoc, doc, deleteDoc, arrayUnion, arrayRemove, serverTimestamp } = await import('firebase/firestore')
        const db = getFirestore()

        const ref = await addDoc(collection(db, 'groups'), {
          name: 'Leave Test', createdBy: alice,
          members: [alice, bob], admins: [alice], createdAt: serverTimestamp(),
        })

        // Bob leaves
        await updateDoc(doc(db, 'groups', ref.id), { members: arrayRemove(bob) })

        const snap = await getDoc(doc(db, 'groups', ref.id))
        const members = snap.data()?.members || []

        await deleteDoc(doc(db, 'groups', ref.id))
        return { hasBob: members.includes(bob), memberCount: members.length }
      } catch (err) {
        return { error: err.message }
      }
    }, { alice: aliceUid, bob: bobUid })

    expect(result.hasBob).toBe(false)
    expect(result.memberCount).toBe(1)
  })

  test('reject friend request updates status', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)
    const aliceUid = await getCurrentUid(page)

    await firebaseLogout(page)
    await firebaseLogin(page, TEST_ACCOUNTS.charlie.email)
    const charlieUid = await getCurrentUid(page)
    await firebaseLogout(page)

    await firebaseLogin(page, TEST_ACCOUNTS.alice.email)

    const result = await page.evaluate(async ({ from, to }) => {
      try {
        const { getFirestore, collection, addDoc, updateDoc, getDoc, deleteDoc, serverTimestamp } = await import('firebase/firestore')
        const db = getFirestore()

        const ref = await addDoc(collection(db, 'friendRequests'), {
          from, to, status: 'pending', createdAt: serverTimestamp(),
        })

        await updateDoc(ref, { status: 'rejected' })
        const snap = await getDoc(ref)
        const status = snap.data()?.status

        await deleteDoc(ref)
        return { rejected: status === 'rejected' }
      } catch (err) {
        return { error: err.message }
      }
    }, { from: aliceUid, to: charlieUid })

    expect(result.rejected).toBe(true)
  })

  test('share spot location creates share record', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)
    const aliceUid = await getCurrentUid(page)

    await firebaseLogout(page)
    await firebaseLogin(page, TEST_ACCOUNTS.bob.email)
    const bobUid = await getCurrentUid(page)
    await firebaseLogout(page)

    await firebaseLogin(page, TEST_ACCOUNTS.alice.email)

    const result = await page.evaluate(async ({ alice, bob }) => {
      try {
        const { getFirestore, collection, addDoc, deleteDoc, serverTimestamp } = await import('firebase/firestore')
        const db = getFirestore()

        // Create a share in the conversation
        const convRef = await addDoc(collection(db, 'conversations'), {
          participants: [alice, bob], type: 'dm', createdAt: serverTimestamp(),
        })

        const msgRef = await addDoc(collection(db, 'conversations', convRef.id, 'messages'), {
          text: '', senderId: alice, createdAt: serverTimestamp(),
          type: 'spot_share', spotData: { lat: 48.85, lng: 2.35, name: 'Paris spot' },
        })

        const { getDocs } = await import('firebase/firestore')
        const msgsSnap = await getDocs(collection(db, 'conversations', convRef.id, 'messages'))
        const shareMsg = msgsSnap.docs.find(d => d.data().type === 'spot_share')

        // Cleanup
        for (const m of msgsSnap.docs) await deleteDoc(m.ref)
        await deleteDoc(convRef)

        return { shared: !!shareMsg, spotName: shareMsg?.data()?.spotData?.name }
      } catch (err) {
        return { error: err.message }
      }
    }, { alice: aliceUid, bob: bobUid })

    expect(result.shared).toBe(true)
    expect(result.spotName).toBe('Paris spot')
  })
})
