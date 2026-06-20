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
import http from 'http'

// Check if Firestore emulator is running (CI unit test job does not start it)
const emulatorRunning = await new Promise(res => {
  const req = http.get({ hostname: 'localhost', port: 8080, path: '/', timeout: 1500 }, () => res(true))
  req.on('error', () => res(false))
  req.on('timeout', () => { req.destroy(); res(false) })
})

// In the dedicated CI security-rules job we set REQUIRE_FIRESTORE_EMULATOR=1.
// There, a missing emulator must FAIL loudly instead of silently skipping
// (a skipped security-rules suite is a false-green that hides IDOR regressions).
const requireEmulator = process.env.REQUIRE_FIRESTORE_EMULATOR === '1'

if (!emulatorRunning) {
  console.log('[firestore-rules] Firestore emulator not available — all tests skipped (set REQUIRE_FIRESTORE_EMULATOR=1 to enforce)')
}

describe('Firestore Rules — CI enforcement (no silent skip)', () => {
  it('Firestore emulator MUST be running when REQUIRE_FIRESTORE_EMULATOR=1', () => {
    // Passes in local/unit runs (no enforcement). Fails the dedicated CI job
    // if the emulator is down, so the 17 IDOR tests can never silently skip.
    if (requireEmulator) {
      expect(
        emulatorRunning,
        'REQUIRE_FIRESTORE_EMULATOR=1 but no Firestore emulator on :8080 — security rules would silently skip (false-green).',
      ).toBe(true)
    }
  })
})

let testEnv

const PROJECT_ID = 'spothitch-test-rules'
const ALICE_UID = 'alice-uid-001'
const BOB_UID = 'bob-uid-002'
const ADMIN_EMAIL = 'ci-admin@spothitch.com'

beforeAll(async () => {
  if (!emulatorRunning) return
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

  it.skipIf(!emulatorRunning)('unauthenticated user CAN read spots', async () => {
    const db = asAnon()
    await assertSucceeds(db.collection('spots').limit(5).get())
  })

  it.skipIf(!emulatorRunning)('unauthenticated user CANNOT create spot', async () => {
    const db = asAnon()
    await assertFails(db.collection('spots').add(spotData))
  })

  it.skipIf(!emulatorRunning)('authenticated user CAN create spot with required fields', async () => {
    const db = asUser(ALICE_UID)
    await assertSucceeds(db.collection('spots').add(spotData))
  })

  it.skipIf(!emulatorRunning)('authenticated user CANNOT create spot without lat', async () => {
    const db = asUser(ALICE_UID)
    await assertFails(db.collection('spots').add({ lng: 2.35, createdAt: new Date() }))
  })

  it.skipIf(!emulatorRunning)('authenticated user CANNOT create spot without lng', async () => {
    const db = asUser(ALICE_UID)
    await assertFails(db.collection('spots').add({ lat: 48.85, createdAt: new Date() }))
  })

  it.skipIf(!emulatorRunning)('authenticated user CAN update spot validation fields only', async () => {
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

  it.skipIf(!emulatorRunning)('authenticated user CANNOT change spot lat/lng (immutable core data)', async () => {
    const db = asUser(ALICE_UID)
    const ref = await db.collection('spots').add(spotData)
    const bobDb = asUser(BOB_UID)
    await assertFails(
      bobDb.collection('spots').doc(ref.id).update({ lat: 99.0, lng: 99.0 })
    )
  })

  it.skipIf(!emulatorRunning)('non-admin CANNOT delete spot', async () => {
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

  it.skipIf(!emulatorRunning)('authenticated user CAN read another user profile', async () => {
    // Set up Alice's profile
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await ctx.firestore().collection('users').doc(ALICE_UID).set(profileData)
    })
    const bobDb = asUser(BOB_UID)
    await assertSucceeds(bobDb.collection('users').doc(ALICE_UID).get())
  })

  it.skipIf(!emulatorRunning)('unauthenticated user CANNOT read user profiles', async () => {
    const db = asAnon()
    await assertFails(db.collection('users').doc(ALICE_UID).get())
  })

  it.skipIf(!emulatorRunning)('user CAN update own profile', async () => {
    const db = asUser(ALICE_UID)
    await assertSucceeds(
      db.collection('users').doc(ALICE_UID).set({ username: 'alice2', updatedAt: new Date() }, { merge: true })
    )
  })

  it.skipIf(!emulatorRunning)('user CANNOT update another user profile (IDOR)', async () => {
    const bobDb = asUser(BOB_UID)
    await assertFails(
      bobDb.collection('users').doc(ALICE_UID).update({ username: 'hacked' })
    )
  })

  it.skipIf(!emulatorRunning)('user CANNOT delete any user profile', async () => {
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

  it.skipIf(!emulatorRunning)('user CAN create review for own UID (reviewId = uid)', async () => {
    const db = asUser(ALICE_UID)
    await assertSucceeds(
      db.collection('spots').doc(spotRef.id)
        .collection('reviews').doc(ALICE_UID)
        .set({ userId: ALICE_UID, rating: 5, createdAt: new Date() })
    )
  })

  it.skipIf(!emulatorRunning)('user CANNOT create review with mismatched userId', async () => {
    const db = asUser(BOB_UID)
    await assertFails(
      db.collection('spots').doc(spotRef.id)
        .collection('reviews').doc(BOB_UID)
        .set({ userId: ALICE_UID, rating: 3, createdAt: new Date() }) // claims to be Alice
    )
  })

  it.skipIf(!emulatorRunning)('user CANNOT delete another user review (IDOR)', async () => {
    // Alice already has a review
    const bobDb = asUser(BOB_UID)
    await assertFails(
      bobDb.collection('spots').doc(spotRef.id)
        .collection('reviews').doc(ALICE_UID)
        .delete()
    )
  })

  it.skipIf(!emulatorRunning)('user CAN delete own review', async () => {
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
