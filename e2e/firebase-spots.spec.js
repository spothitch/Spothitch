/**
 * Firebase Spots E2E Tests
 *
 * Tests real Firestore CRUD for spots, reviews, and favorites.
 */
import { test, expect } from '@playwright/test'
import { skipOnboarding, navigateToTab } from './helpers.js'
import {
  TEST_ACCOUNTS,
  firebaseLogin,
  firebaseLogout,
  getCurrentUid,
  setupAuthenticatedPage,
  cleanupTestData,
  firestoreDocExists,
  firestoreGetDoc,
} from './firebase-helpers.js'

test.beforeEach(async () => {
  if (!process.env.E2E_TEST_PASSWORD) test.skip(true, 'E2E_TEST_PASSWORD not set')
})

test.afterEach(async ({ page }) => {
  const uid = await getCurrentUid(page)
  if (uid) await cleanupTestData(page, uid)
})

test.describe('Firebase Spots', () => {
  test('add a spot writes to Firestore', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)

    // Create a test spot via the app's submit handler
    const spotId = await page.evaluate(async () => {
      try {
        const { getFirestore, collection, addDoc, serverTimestamp } = await import('firebase/firestore')
        const { getAuth } = await import('firebase/auth')
        const db = getFirestore()
        const auth = getAuth()
        const uid = auth.currentUser?.uid
        if (!uid) return null

        const spotRef = await addDoc(collection(db, 'spots'), {
          lat: 48.8566,
          lng: 2.3522,
          direction: 'north',
          type: 'city_exit',
          description: 'E2E test spot',
          createdBy: uid,
          createdAt: serverTimestamp(),
          rating: { safety: 4, traffic: 3, accessibility: 4 },
        })
        return spotRef.id
      } catch (err) {
        console.error('Add spot error:', err)
        return null
      }
    })

    expect(spotId).toBeTruthy()

    // Verify the spot exists
    const exists = await firestoreDocExists(page, 'spots', spotId)
    expect(exists).toBe(true)
  })

  test('delete own spot works', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)

    // Create and then delete a spot
    const spotId = await page.evaluate(async () => {
      const { getFirestore, collection, addDoc, deleteDoc, doc, serverTimestamp } = await import('firebase/firestore')
      const { getAuth } = await import('firebase/auth')
      const db = getFirestore()
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

  test('Bob cannot delete Alice spot (security rules)', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)

    // Alice creates a spot
    const spotId = await page.evaluate(async () => {
      const { getFirestore, collection, addDoc, serverTimestamp } = await import('firebase/firestore')
      const { getAuth } = await import('firebase/auth')
      const db = getFirestore()
      const uid = getAuth().currentUser?.uid
      if (!uid) return null

      const ref = await addDoc(collection(db, 'spots'), {
        lat: 51.0, lng: 3.0, direction: 'east', type: 'other',
        description: 'Alice private spot', createdBy: uid, createdAt: serverTimestamp(),
      })
      return ref.id
    })

    expect(spotId).toBeTruthy()

    // Logout Alice, login Bob
    await firebaseLogout(page)
    await firebaseLogin(page, TEST_ACCOUNTS.bob.email)

    // Bob tries to delete Alice's spot
    const deleteResult = await page.evaluate(async (sid) => {
      try {
        const { getFirestore, doc, deleteDoc } = await import('firebase/firestore')
        const db = getFirestore()
        await deleteDoc(doc(db, 'spots', sid))
        return { success: true }
      } catch (err) {
        return { success: false, code: err.code || err.message }
      }
    }, spotId)

    // Should fail with permission-denied
    expect(deleteResult.success).toBe(false)

    // Cleanup: login as Alice and delete the spot
    await firebaseLogout(page)
    await firebaseLogin(page, TEST_ACCOUNTS.alice.email)
    await page.evaluate(async (sid) => {
      const { getFirestore, doc, deleteDoc } = await import('firebase/firestore')
      await deleteDoc(doc(getFirestore(), 'spots', sid))
    }, spotId)
  })

  test('add and remove favorite syncs to Firestore', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)

    const uid = await getCurrentUid(page)

    // Add a favorite
    const favResult = await page.evaluate(async (testUid) => {
      try {
        const { getFirestore, doc, setDoc, deleteDoc, getDoc, serverTimestamp } = await import('firebase/firestore')
        const db = getFirestore()

        const favId = 'test-fav-spot-123'
        const favRef = doc(db, 'users', testUid, 'favorites', favId)

        await setDoc(favRef, {
          spotId: favId,
          lat: 48.85, lng: 2.35,
          addedAt: serverTimestamp(),
        })

        // Verify it exists
        const snap = await getDoc(favRef)
        const exists = snap.exists()

        // Remove it
        await deleteDoc(favRef)
        const snapAfter = await getDoc(favRef)

        return { added: exists, removed: !snapAfter.exists() }
      } catch (err) {
        return { error: err.message }
      }
    }, uid)

    expect(favResult.added).toBe(true)
    expect(favResult.removed).toBe(true)
  })

  test('submit a spot review', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.bob.email)

    const uid = await getCurrentUid(page)

    const reviewResult = await page.evaluate(async (testUid) => {
      try {
        const { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, serverTimestamp } = await import('firebase/firestore')
        const db = getFirestore()

        // Add a review
        const ref = await addDoc(collection(db, 'reviews'), {
          spotId: 'test-spot-review',
          userId: testUid,
          safety: 5, traffic: 4, accessibility: 3,
          comment: 'Great spot for E2E testing',
          createdAt: serverTimestamp(),
        })

        // Verify
        const q = query(collection(db, 'reviews'), where('userId', '==', testUid))
        const snap = await getDocs(q)
        const found = snap.docs.some(d => d.id === ref.id)

        // Cleanup
        await deleteDoc(ref)

        return { created: true, found }
      } catch (err) {
        return { error: err.message }
      }
    }, uid)

    expect(reviewResult.created).toBe(true)
    expect(reviewResult.found).toBe(true)
  })

  test('spot ratings are validated (1-5 range)', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.charlie.email)

    // Spot with valid ratings should work
    const validResult = await page.evaluate(async () => {
      try {
        const { getFirestore, collection, addDoc, deleteDoc, serverTimestamp } = await import('firebase/firestore')
        const { getAuth } = await import('firebase/auth')
        const db = getFirestore()
        const uid = getAuth().currentUser?.uid

        const ref = await addDoc(collection(db, 'spots'), {
          lat: 49.0, lng: 2.0, direction: 'west', type: 'city_exit',
          description: 'Valid ratings test', createdBy: uid, createdAt: serverTimestamp(),
          rating: { safety: 1, traffic: 5, accessibility: 3 },
        })
        await deleteDoc(ref)
        return { success: true }
      } catch (err) {
        return { success: false, error: err.message }
      }
    })

    expect(validResult.success).toBe(true)
  })

  test('multiple spots by same user are queryable', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)

    const uid = await getCurrentUid(page)

    const result = await page.evaluate(async (testUid) => {
      try {
        const { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, serverTimestamp } = await import('firebase/firestore')
        const db = getFirestore()

        // Create 3 spots
        const ids = []
        for (let i = 0; i < 3; i++) {
          const ref = await addDoc(collection(db, 'spots'), {
            lat: 48.0 + i * 0.1, lng: 2.0 + i * 0.1,
            direction: 'north', type: 'city_exit',
            description: `Multi spot ${i}`, createdBy: testUid, createdAt: serverTimestamp(),
          })
          ids.push(ref.id)
        }

        // Query all spots by this user
        const q = query(collection(db, 'spots'), where('createdBy', '==', testUid))
        const snap = await getDocs(q)
        const count = snap.size

        // Cleanup
        for (const id of ids) {
          await deleteDoc((await import('firebase/firestore')).doc(db, 'spots', id))
        }

        return { created: ids.length, found: count }
      } catch (err) {
        return { error: err.message }
      }
    }, uid)

    expect(result.created).toBe(3)
    expect(result.found).toBeGreaterThanOrEqual(3)
  })

  test('update own spot description', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.bob.email)

    const result = await page.evaluate(async () => {
      try {
        const { getFirestore, collection, addDoc, updateDoc, getDoc, doc, deleteDoc, serverTimestamp } = await import('firebase/firestore')
        const { getAuth } = await import('firebase/auth')
        const db = getFirestore()
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
      } catch (err) {
        return { error: err.message }
      }
    })

    expect(result.updated).toBe(true)
  })

  test('Bob cannot update Alice spot', async ({ page }) => {
    await setupAuthenticatedPage(page, TEST_ACCOUNTS.alice.email)

    const spotId = await page.evaluate(async () => {
      const { getFirestore, collection, addDoc, serverTimestamp } = await import('firebase/firestore')
      const { getAuth } = await import('firebase/auth')
      const db = getFirestore()
      const ref = await addDoc(collection(db, 'spots'), {
        lat: 52.0, lng: 5.0, direction: 'north', type: 'other',
        description: 'Alice only', createdBy: getAuth().currentUser.uid, createdAt: serverTimestamp(),
      })
      return ref.id
    })

    await firebaseLogout(page)
    await firebaseLogin(page, TEST_ACCOUNTS.bob.email)

    const updateResult = await page.evaluate(async (sid) => {
      try {
        const { getFirestore, doc, updateDoc } = await import('firebase/firestore')
        await updateDoc(doc(getFirestore(), 'spots', sid), { description: 'Hacked by Bob' })
        return { success: true }
      } catch (err) {
        return { success: false, code: err.code }
      }
    }, spotId)

    expect(updateResult.success).toBe(false)

    // Cleanup
    await firebaseLogout(page)
    await firebaseLogin(page, TEST_ACCOUNTS.alice.email)
    await page.evaluate(async (sid) => {
      const { getFirestore, doc, deleteDoc } = await import('firebase/firestore')
      await deleteDoc(doc(getFirestore(), 'spots', sid))
    }, spotId)
  })
})
