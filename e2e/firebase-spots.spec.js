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

  let context, page, aliceUid, bobUid, isFallback

  test.beforeAll(async ({ browser }) => {
    if (!process.env.E2E_TEST_PASSWORD) return
    ;({ context, page, uid: aliceUid } = await initFirebasePage(browser, TEST_ACCOUNTS.alice.email))
    isFallback = aliceUid?.startsWith('ci-ci-') || false
    if (!isFallback) bobUid = await getUidByEmail(page, TEST_ACCOUNTS.bob.email)
  })

  test.afterAll(async () => {
    if (aliceUid && page && !isFallback) await cleanupTestData(page, aliceUid)
    await context?.close()
  })

  test.beforeEach(() => {
    test.skip(!!isFallback, 'Firebase emulator not reachable from browser build')
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
          description: 'E2E test spot', creatorId: uid, createdAt: serverTimestamp(),
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

  test('delete own spot works (no community engagement)', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    // Creator can delete their own spot that has NO reviews/validations from others.
    // A freshly created spot starts at validationCount: 1, testCount: 1, totalReviews: 0.
    const spotId = await page.evaluate(async () => {
      const { getDb, getAuth, collection, addDoc, deleteDoc, doc, serverTimestamp } = window.__fb
      const db = getDb()
      const uid = getAuth().currentUser?.uid
      if (!uid) return null
      const ref = await addDoc(collection(db, 'spots'), {
        lat: 50.0, lng: 4.0, direction: 'south', type: 'highway',
        description: 'E2E delete test', creatorId: uid, createdAt: serverTimestamp(),
        validationCount: 1, testCount: 1, totalReviews: 0,
      })
      await deleteDoc(doc(db, 'spots', ref.id))
      return ref.id
    })

    expect(spotId).toBeTruthy()
    const exists = await firestoreDocExists(page, 'spots', spotId)
    expect(exists).toBe(false)
  })

  test('creator CANNOT delete own spot once community has engaged', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    // Once OTHER users have validated/reviewed the spot it becomes permanent
    // community data — even the creator can no longer delete it.
    const result = await page.evaluate(async () => {
      const { getDb, getAuth, collection, addDoc, deleteDoc, doc, serverTimestamp } = window.__fb
      const db = getDb()
      const uid = getAuth().currentUser?.uid
      if (!uid) return { error: 'no-uid' }
      const ref = await addDoc(collection(db, 'spots'), {
        lat: 50.1, lng: 4.1, direction: 'south', type: 'highway',
        description: 'E2E engaged spot', creatorId: uid, createdAt: serverTimestamp(),
        validationCount: 5, testCount: 3, totalReviews: 2,
      })
      try {
        await deleteDoc(doc(db, 'spots', ref.id))
        return { id: ref.id, denied: false }
      } catch {
        return { id: ref.id, denied: true }
      }
    })

    expect(result.denied).toBe(true)
    // Spot still exists (cleanup handled by global test teardown / admin)
    const exists = await firestoreDocExists(page, 'spots', result.id)
    expect(exists).toBe(true)
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
        const { getDb, collection, addDoc, getDocs, deleteDoc, serverTimestamp } = window.__fb
        const db = getDb()
        // Create a temp spot first
        const spotRef = await addDoc(collection(db, 'spots'), {
          lat: 48.86, lng: 2.36, creatorId: testUid, createdAt: serverTimestamp(),
        })
        // Add a review as subcollection of the spot
        const ref = await addDoc(collection(db, 'spots', spotRef.id, 'reviews'), {
          userId: testUid, userName: 'Alice Test',
          safety: 5, traffic: 4, accessibility: 3,
          comment: 'Great spot for E2E testing', createdAt: serverTimestamp(),
        })
        const snap = await getDocs(collection(db, 'spots', spotRef.id, 'reviews'))
        const found = snap.docs.some(d => d.id === ref.id)
        // Cleanup
        for (const d of snap.docs) await deleteDoc(d.ref)
        await deleteDoc(spotRef)
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
          description: 'Valid ratings test', creatorId: uid, createdAt: serverTimestamp(),
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
            description: `Multi spot ${i}`, creatorId: testUid, createdAt: serverTimestamp(),
          })
          ids.push(ref.id)
        }
        const q = query(collection(db, 'spots'), where('creatorId', '==', testUid))
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
          description: 'Before update', creatorId: uid, createdAt: serverTimestamp(),
        })
        await updateDoc(doc(db, 'spots', ref.id), { description: 'After update' })
        // Retry polling for Firestore eventual consistency
        let desc
        for (let i = 0; i < 5; i++) {
          const snap = await getDoc(doc(db, 'spots', ref.id))
          desc = snap.data()?.description
          if (desc === 'After update') break
          await new Promise(r => setTimeout(r, 500))
        }
        await deleteDoc(doc(db, 'spots', ref.id))
        return { updated: desc === 'After update' }
      } catch (err) { return { error: err.message } }
    })

    expect(result.updated).toBe(true)
  })

  test('spot validation (check-in) writes to subcollection', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } = window.__fb
        const db = getDb()
        const spotRef = await addDoc(collection(db, 'spots'), {
          lat: 48.87, lng: 2.37, creatorId: testUid, createdAt: serverTimestamp(),
        })
        const valRef = await addDoc(collection(db, 'spots', spotRef.id, 'validations'), {
          userId: testUid, timestamp: serverTimestamp(), validationCount: 1,
        })
        const snap = await getDocs(collection(db, 'spots', spotRef.id, 'validations'))
        const count = snap.size
        for (const d of snap.docs) await deleteDoc(d.ref)
        await deleteDoc(doc(db, 'spots', spotRef.id))
        return { count, hasValidation: count >= 1 }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.hasValidation).toBe(true)
  })

  test('spot comment writes to subcollection', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } = window.__fb
        const db = getDb()
        const spotRef = await addDoc(collection(db, 'spots'), {
          lat: 48.88, lng: 2.38, creatorId: testUid, createdAt: serverTimestamp(),
        })
        await addDoc(collection(db, 'spots', spotRef.id, 'comments'), {
          userId: testUid, text: 'E2E comment test', spotId: spotRef.id, createdAt: serverTimestamp(),
        })
        const snap = await getDocs(collection(db, 'spots', spotRef.id, 'comments'))
        const text = snap.docs[0]?.data()?.text
        for (const d of snap.docs) await deleteDoc(d.ref)
        await deleteDoc(doc(db, 'spots', spotRef.id))
        return { count: snap.size, text }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.count).toBe(1)
    expect(result.text).toBe('E2E comment test')
  })

  test('report spot creates report document', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, collection, addDoc, serverTimestamp } = window.__fb
        const db = getDb()
        const ref = await addDoc(collection(db, 'reports'), {
          type: 'spot', spotId: 'e2e-fake-spot', userId: testUid,
          reason: 'E2E test report', details: 'Testing report flow', createdAt: serverTimestamp(),
        })
        // reports are write-only (allow read: if false), so just verify addDoc succeeded
        return { created: !!ref.id }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.created).toBe(true)
  })

  test('upload spot photo to Firebase Storage', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getDb, collection, addDoc, deleteDoc, serverTimestamp,
                getStorage, ref, uploadString, getDownloadURL } = window.__fb
        const db = getDb()

        // Create a temp spot
        const spotRef = await addDoc(collection(db, 'spots'), {
          lat: 48.89, lng: 2.39, creatorId: testUid, createdAt: serverTimestamp(),
        })

        // Create a tiny 1x1 red pixel PNG as base64
        const base64Img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='

        const storage = getStorage()
        const path = `spots/${spotRef.id}/${testUid}_${Date.now()}.png`
        const storageRef = ref(storage, path)
        const snapshot = await uploadString(storageRef, base64Img, 'data_url')
        const downloadURL = await getDownloadURL(snapshot.ref)

        // Cleanup spot (storage file left as orphan — no delete API from client for security)
        await deleteDoc(spotRef)

        return {
          uploaded: !!downloadURL,
          urlValid: downloadURL.includes('firebasestorage.googleapis.com') || downloadURL.includes('storage.googleapis.com'),
          path,
        }
      } catch (err) { return { error: err.message } }
    }, aliceUid)

    expect(result.error).toBeFalsy()
    expect(result.uploaded).toBe(true)
    expect(result.urlValid).toBe(true)
  })

  test('Bob cannot delete Alice spot (security rules)', async () => {
    test.skip(!process.env.E2E_TEST_PASSWORD, 'E2E_TEST_PASSWORD not set')

    // Alice creates a spot
    const spotId = await page.evaluate(async () => {
      const { getDb, getAuth, collection, addDoc, serverTimestamp } = window.__fb
      const ref = await addDoc(collection(getDb(), 'spots'), {
        lat: 51.0, lng: 3.0, direction: 'east', type: 'other',
        description: 'Alice private spot', creatorId: getAuth().currentUser.uid,
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
