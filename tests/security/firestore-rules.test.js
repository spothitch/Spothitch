/**
 * Firestore Security Rules — Exhaustive tests
 * Tests every permission boundary using Firebase Emulator
 *
 * Requires: firebase emulators:start --only auth,firestore
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing'
import { readFileSync } from 'fs'
import { resolve } from 'path'

let testEnv

const PROJECT_ID = 'spothitch-test-rules'
const ALICE_UID = 'alice-uid-001'
const BOB_UID = 'bob-uid-002'
const ADMIN_EMAIL = 'ci-admin@spothitch.com'

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8'),
      host: 'localhost',
      port: 8080,
    },
  })
})

afterAll(async () => {
  await testEnv?.cleanup()
})

// ── Helper: get Firestore as a specific user ──────────────────────────────
const asUser = (uid, email) => testEnv.authenticatedContext(uid, email ? { email } : {}).firestore()
const asAnon = () => testEnv.unauthenticatedContext().firestore()

// ══════════════════════════════════════════════════════════════════════════
// SPOTS collection
// ══════════════════════════════════════════════════════════════════════════
describe('Firestore Rules — /spots/{spotId}', () => {
  const spotData = {
    lat: 48.85,
    lng: 2.35,
    createdAt: new Date(),
    type: 'city_exit',
    createdBy: ALICE_UID,
  }

  it('unauthenticated user CAN read spots', async () => {
    const db = asAnon()
    await assertSucceeds(db.collection('spots').limit(5).get())
  })

  it('unauthenticated user CANNOT create spot', async () => {
    const db = asAnon()
    await assertFails(db.collection('spots').add(spotData))
  })

  it('authenticated user CAN create spot with required fields', async () => {
    const db = asUser(ALICE_UID)
    await assertSucceeds(db.collection('spots').add(spotData))
  })

  it('authenticated user CANNOT create spot without lat', async () => {
    const db = asUser(ALICE_UID)
    await assertFails(db.collection('spots').add({ lng: 2.35, createdAt: new Date() }))
  })

  it('authenticated user CANNOT create spot without lng', async () => {
    const db = asUser(ALICE_UID)
    await assertFails(db.collection('spots').add({ lat: 48.85, createdAt: new Date() }))
  })

  it('authenticated user CAN update spot validation fields only', async () => {
    // First create a spot
    const db = asUser(ALICE_UID)
    const ref = await db.collection('spots').add(spotData)
    const bobDb = asUser(BOB_UID)
    await assertSucceeds(
      bobDb.collection('spots').doc(ref.id).update({
        validationCount: 1,
        lastValidatedAt: new Date(),
      })
    )
  })

  it('authenticated user CANNOT change spot lat/lng (immutable core data)', async () => {
    const db = asUser(ALICE_UID)
    const ref = await db.collection('spots').add(spotData)
    const bobDb = asUser(BOB_UID)
    await assertFails(
      bobDb.collection('spots').doc(ref.id).update({ lat: 99.0, lng: 99.0 })
    )
  })

  it('non-admin CANNOT delete spot', async () => {
    const db = asUser(ALICE_UID)
    const ref = await db.collection('spots').add(spotData)
    const bobDb = asUser(BOB_UID)
    await assertFails(bobDb.collection('spots').doc(ref.id).delete())
  })
})

// ══════════════════════════════════════════════════════════════════════════
// USERS collection — IDOR tests
// ══════════════════════════════════════════════════════════════════════════
describe('Firestore Rules — /users/{userId} — IDOR', () => {
  const profileData = {
    username: 'alice',
    createdAt: new Date(),
    email: 'alice@test.com',
  }

  it('authenticated user CAN read another user profile', async () => {
    // Set up Alice's profile
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().collection('users').doc(ALICE_UID).set(profileData)
    })
    const bobDb = asUser(BOB_UID)
    await assertSucceeds(bobDb.collection('users').doc(ALICE_UID).get())
  })

  it('unauthenticated user CANNOT read user profiles', async () => {
    const db = asAnon()
    await assertFails(db.collection('users').doc(ALICE_UID).get())
  })

  it('user CAN update own profile', async () => {
    const db = asUser(ALICE_UID)
    await assertSucceeds(
      db.collection('users').doc(ALICE_UID).set({ username: 'alice2', updatedAt: new Date() }, { merge: true })
    )
  })

  it('user CANNOT update another user profile (IDOR)', async () => {
    const bobDb = asUser(BOB_UID)
    await assertFails(
      bobDb.collection('users').doc(ALICE_UID).update({ username: 'hacked' })
    )
  })

  it('user CANNOT delete any user profile', async () => {
    const db = asUser(BOB_UID)
    await assertFails(db.collection('users').doc(ALICE_UID).delete())
    await assertFails(db.collection('users').doc(BOB_UID).delete())
  })
})

// ══════════════════════════════════════════════════════════════════════════
// SPOT REVIEWS — IDOR tests
// ══════════════════════════════════════════════════════════════════════════
describe('Firestore Rules — /spots/{spotId}/reviews — IDOR', () => {
  let spotRef

  beforeAll(async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      spotRef = await ctx.firestore().collection('spots').add({
        lat: 48.85, lng: 2.35, createdAt: new Date(),
      })
    })
  })

  it('user CAN create review for own UID (reviewId = uid)', async () => {
    const db = asUser(ALICE_UID)
    await assertSucceeds(
      db.collection('spots').doc(spotRef.id)
        .collection('reviews').doc(ALICE_UID)
        .set({ userId: ALICE_UID, rating: 5, createdAt: new Date() })
    )
  })

  it('user CANNOT create review with mismatched userId', async () => {
    const db = asUser(BOB_UID)
    await assertFails(
      db.collection('spots').doc(spotRef.id)
        .collection('reviews').doc(BOB_UID)
        .set({ userId: ALICE_UID, rating: 3, createdAt: new Date() }) // claims to be Alice
    )
  })

  it('user CANNOT delete another user review (IDOR)', async () => {
    // Alice already has a review
    const bobDb = asUser(BOB_UID)
    await assertFails(
      bobDb.collection('spots').doc(spotRef.id)
        .collection('reviews').doc(ALICE_UID)
        .delete()
    )
  })

  it('user CAN delete own review', async () => {
    const aliceDb = asUser(ALICE_UID)
    // Ensure Alice's review exists
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().collection('spots').doc(spotRef.id)
        .collection('reviews').doc(ALICE_UID)
        .set({ userId: ALICE_UID, rating: 5, createdAt: new Date() })
    })
    await assertSucceeds(
      aliceDb.collection('spots').doc(spotRef.id)
        .collection('reviews').doc(ALICE_UID)
        .delete()
    )
  })
})
