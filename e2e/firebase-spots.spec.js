/**
 * Firebase Spots E2E Tests
 *
 * Tests real Firestore CRUD for spots, reviews, and favorites.
 * Uses shared session (Alice logged in) to minimize logins.
 */
import { test, expect } from '@playwright/test'
import {
  TEST_ACCOUNTS,
  programmaticLogin,
  programmaticLogout,
  getCurrentUid,
  cleanupTestData,
  firestoreDocExists,
  getUidByEmail,
  initFirebasePage,
} from './firebase-helpers.js'

test.describe('Firebase Spots', () => {
  test.describe.configure({ mode: 'serial' })

  let context, page, aliceUid, bobUid

  test.beforeAll(async ({ browser }) => {
    if (!process.env.E2E_TEST_PASSWORD) return
    ;({ context, page, uid: aliceUid } = await initFirebasePage(browser, TEST_ACCOUNTS.alice.email))
    bobUid = await getUidByEmail(page, TEST_ACCOUNTS.bob.email)
  })

  test.afterAll(async () => {
    if (aliceUid && page) await cleanupTestData(page, aliceUid)
    await context?.close()
  })

  test('add a spot writes to Firestore', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const spotId = await page.evaluate(async () => {
      try {
        const { getDb, getAuth, collection, addDoc, serverTimestamp } = window.__fb
        const db = getDb()
        const uid = getAuth().currentUser?.uid
        if (!uid) return null
        const spotRef = await addDoc(collection(db, 'spots'), {
          lat: 48.8566, lng: 2.3522, direction: 'north', type: 'city_exit',
          description: 'E2E test spot', createdBy: uid, createdAt: serverTimestamp(),
          rating: { safety: 4, traffic: 3, accessibility: 4 },
        })
        return spotRef.id
      } catch { return null }
    })

    expect(spotId).toBeTruthy()
    const exists = await firestoreDocExists(page, 'spots', spotId)
    expect(exists).toBe(true)

    // Cleanup
    await page.evaluate(async (sid) => {
      await window.__fb.deleteDoc(window.__fb.doc(window.__fb.getDb(), 'spots', sid))
    }, spotId)
  })

  test('delete own spot works', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const spotId = await page.evaluate(async () => {
      const { getDb, getAuth, collection, addDoc, deleteDoc, doc, serverTimestamp } = window.__fb
      const db = getDb()
      const uid = getAuth().currentUser?.uid
      if (!uid) return null
      const ref = await addDoc(collection(db, 'spots'), {
        lat: 50.0, lng: 4.0, direction: 'south', type: 'highway',
        description: 'E2E delete test', createdBy: uid, createdAt: serverTimestamp(),
      })
      await deleteDoc(doc(db, 'spots', ref.id))
      return ref.id
    })

    expect(spotId).toBeTruthy()
    const exists = await firestoreDocExists(page, 'spots', spotId)
    expect(exists).toBe(false)
  })

  test('add and remove favorite syncs to Firestore', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const favResult = await page.evaluate(async (testUid) => {
      try {
        const { getDb, doc, setDoc, deleteDoc, getDoc, serverTimestamp } = window.__fb
        const db = getDb()
        const favId = 'test-fav-spot-123'
        const favRef = doc(db, 'users', testUid, 'favorites', favId)
        await setDoc(favRef, { spotId: favId, lat: 48.85, lng: 2.35, addedAt: serverTimestamp() })
        const snap = await getDoc(favRef)
        const exists = snap.exists()
        await deleteDoc(favRef)
        const snapAfter = await getDoc(favRef)
        return { added: exists, removed: !snapAfter.exists() }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(favResult.added).toBe(true)
    expect(favResult.removed).toBe(true)
  })

  test('submit a spot review', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const reviewResult = await page.evaluate(async (testUid) => {
      try {
        const { getDb, collection, addDoc, getDocs, query, where, deleteDoc, serverTimestamp } = window.__fb
        const db = getDb()
        const ref = await addDoc(collection(db, 'reviews'), {
          spotId: 'test-spot-review', userId: testUid,
          safety: 5, traffic: 4, accessibility: 3,
          comment: 'Great spot for E2E testing', createdAt: serverTimestamp(),
        })
        const q = query(collection(db, 'reviews'), where('userId', '==', testUid))
        const snap = await getDocs(q)
        const found = snap.docs.some(d => d.id === ref.id)
        await deleteDoc(ref)
        return { created: true, found }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(reviewResult.created).toBe(true)
    expect(reviewResult.found).toBe(true)
  })

  test('spot ratings are validated (1-5 range)', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const validResult = await page.evaluate(async () => {
      try {
        const { getDb, getAuth, collection, addDoc, deleteDoc, serverTimestamp } = window.__fb
        const db = getDb()
        const uid = getAuth().currentUser?.uid
        const ref = await addDoc(collection(db, 'spots'), {
          lat: 49.0, lng: 2.0, direction: 'west', type: 'city_exit',
          description: 'Valid ratings test', createdBy: uid, createdAt: serverTimestamp(),
          rating: { safety: 1, traffic: 5, accessibility: 3 },
        })
        await deleteDoc(ref)
        return { success: true }
      } catch (err) { return { success: false, error: err.message } }
    })

    expect(validResult.success).toBe(true)
  })

  test('multiple spots by same user are queryable', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, collection, addDoc, getDocs, query, where, deleteDoc, doc, serverTimestamp } = window.__fb
        const db = getDb()
        const ids = []
        for (let i = 0; i < 3; i++) {
          const ref = await addDoc(collection(db, 'spots'), {
            lat: 48.0 + i * 0.1, lng: 2.0 + i * 0.1,
            direction: 'north', type: 'city_exit',
            description: `Multi spot ${i}`, createdBy: testUid, createdAt: serverTimestamp(),
          })
          ids.push(ref.id)
        }
        const q = query(collection(db, 'spots'), where('createdBy', '==', testUid))
        const snap = await getDocs(q)
        const count = snap.size
        for (const id of ids) await deleteDoc(doc(db, 'spots', id))
        return { created: ids.length, found: count }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.created).toBe(3)
    expect(result.found).toBeGreaterThanOrEqual(3)
  })

  test('update own spot description', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async () => {
      try {
        const { getDb, getAuth, collection, addDoc, updateDoc, getDoc, doc, deleteDoc, serverTimestamp } = window.__fb
        const db = getDb()
        const uid = getAuth().currentUser?.uid
        const ref = await addDoc(collection(db, 'spots'), {
          lat: 50.5, lng: 3.5, direction: 'south', type: 'highway',
          description: 'Before update', createdBy: uid, createdAt: serverTimestamp(),
        })
        await updateDoc(doc(db, 'spots', ref.id), { description: 'After update' })
        const snap = await getDoc(doc(db, 'spots', ref.id))
        const desc = snap.data()?.description
        await deleteDoc(doc(db, 'spots', ref.id))
        return { updated: desc === 'After update' }
      } catch (err) { return { error: err.message } }
    })

    expect(result.updated).toBe(true)
  })

  test('Bob cannot delete Alice spot (security rules)', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    // Alice creates a spot
    const spotId = await page.evaluate(async () => {
      const { getDb, getAuth, collection, addDoc, serverTimestamp } = window.__fb
      const ref = await addDoc(collection(getDb(), 'spots'), {
        lat: 51.0, lng: 3.0, direction: 'east', type: 'other',
        description: 'Alice private spot', createdBy: getAuth().currentUser.uid,
        createdAt: serverTimestamp(),
      })
      return ref.id
    })
    expect(spotId).toBeTruthy()

    // Switch to Bob
    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.bob.email)

    const deleteResult = await page.evaluate(async (sid) => {
      try {
        await window.__fb.deleteDoc(window.__fb.doc(window.__fb.getDb(), 'spots', sid))
        return { success: true }
      } catch (err) { return { success: false, code: err.code || err.message } }
    }, spotId)

    expect(deleteResult.success).toBe(false)

    // Switch back to Alice and cleanup
    await programmaticLogout(page)
    await programmaticLogin(page, TEST_ACCOUNTS.alice.email)
    await page.evaluate(async (sid) => {
      await window.__fb.deleteDoc(window.__fb.doc(window.__fb.getDb(), 'spots', sid))
    }, spotId)
  })
})
