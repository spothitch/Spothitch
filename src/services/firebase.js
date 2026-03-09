/**
 * Firebase Service
 * Handles authentication, Firestore database, and storage
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithCredential,
  getRedirectResult,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider,
  deleteUser,
  updateProfile
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  setDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
  increment,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL
} from 'firebase/storage';
import { getMessaging, getToken, onMessage, deleteToken } from 'firebase/messaging';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;
let messaging;

export function initializeFirebase() {
  try {
    // Avoid re-initializing if already done
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Initialize messaging only in fully supported browsers
    // Requires: serviceWorker + PushManager + Notification + indexedDB + fetch
    // Some browsers (Firefox, old Android WebView) pass these checks but still fail
    // Wrapped in its own try/catch so a messaging failure doesn't break auth/db
    try {
      if (
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window &&
        'indexedDB' in window &&
        'fetch' in window &&
        navigator.serviceWorker !== undefined
      ) {
        messaging = getMessaging(app);
      }
    } catch (e) {
      // messaging/unsupported-browser is expected on some browsers — silently ignore
      if (!e?.code?.includes('unsupported-browser') && !e?.message?.includes('unsupported-browser')) {
        console.warn('Firebase Messaging init failed:', e?.message);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    return false;
  }
}

// ==================== AUTHENTICATION ====================

/**
 * Sign up with email and password
 */
export async function signUp(email, password, displayName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.code };
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.code };
  }
}

/**
 * Load Google Identity Services (GIS) script dynamically.
 * Returns a promise that resolves when the script is ready.
 */
let _gisLoaded = false
function loadGIS() {
  return new Promise((resolve, reject) => {
    if (_gisLoaded && window.google?.accounts?.id) return resolve()
    if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
      // Script tag exists, wait for it
      const check = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(check)
          _gisLoaded = true
          resolve()
        }
      }, 100)
      setTimeout(() => { clearInterval(check); reject(new Error('gis-timeout')) }, 5000)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = () => { _gisLoaded = true; resolve() }
    script.onerror = () => reject(new Error('gis-load-failed'))
    document.head.appendChild(script)
  })
}

// Google OAuth Client ID (from Firebase Console → Authentication → Sign-in method → Google)
const GOOGLE_CLIENT_ID = '314974309234-eh794g3edfe35h8r7eom2q0i092c5h35.apps.googleusercontent.com'

/**
 * Sign in with Google using Google Identity Services (GIS).
 *
 * Why GIS instead of Firebase signInWithPopup?
 * - signInWithPopup opens spothitch.firebaseapp.com/__/auth/handler first,
 *   which shows a visible Firebase loading page before redirecting to Google.
 * - GIS shows the native Google account picker directly — no intermediate page.
 * - The ID token from GIS is passed to Firebase via signInWithCredential.
 * - Fallback to signInWithPopup if GIS fails (script blocked, One Tap dismissed).
 */
export async function signInWithGoogle() {
  try {
    window._authInProgress = true

    // Try Google Identity Services first (native picker, no Firebase page)
    try {
      await loadGIS()

      const idToken = await new Promise((resolve, reject) => {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response.credential) {
              resolve(response.credential)
            } else {
              reject(new Error('no-credential'))
            }
          },
          auto_select: false,
          cancel_on_tap_outside: false,
        })

        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            reject(new Error('prompt-not-displayed'))
          } else if (notification.isSkippedMoment()) {
            reject(new Error('prompt-skipped'))
          }
          // If displayed, the callback above will fire when user picks account
        })
      })

      // Got ID token from Google — sign into Firebase with it
      const credential = GoogleAuthProvider.credential(idToken)
      const result = await signInWithCredential(auth, credential)
      window._authInProgress = false
      if (result?.user) {
        return { success: true, user: result.user }
      }
      return { success: false, error: 'no-user' }
    } catch (gisError) {
      // GIS unavailable — fallback to Firebase popup
      console.warn('GIS fallback to popup:', gisError.message)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      window._authInProgress = false
      if (result?.user) {
        return { success: true, user: result.user }
      }
      return { success: false, error: 'no-user' }
    }
  } catch (error) {
    window._authInProgress = false
    return { success: false, error: error.code || error.message }
  }
}

/**
 * Check for pending redirect result after a signInWithRedirect.
 * Must be called once on app startup — as early as possible.
 * Returns { success, user } if a redirect completed, or null if none pending.
 */
export async function checkRedirectResult() {
  try {
    // Block auto-reload while we're processing a redirect result
    // (the page just navigated back from Google — don't reload it again)
    window._authInProgress = true
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      sessionStorage.removeItem('spothitch_auth_redirect')
      return { success: true, user: result.user };
    }
    return null;
  } catch (error) {
    sessionStorage.removeItem('spothitch_auth_redirect')
    return { success: false, error: error.code };
  } finally {
    window._authInProgress = false
  }
}

/**
 * Sign in with Facebook
 */
export async function signInWithFacebook() {
  try {
    const provider = new FacebookAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return { success: true, user: result.user }
  } catch (error) {
    return { success: false, error: error.code }
  }
}

/**
 * Sign in with Apple
 */
export async function signInWithApple() {
  try {
    const provider = new OAuthProvider('apple.com')
    provider.addScope('email')
    provider.addScope('name')
    const result = await signInWithPopup(auth, provider)
    return { success: true, user: result.user }
  } catch (error) {
    return { success: false, error: error.code }
  }
}

/**
 * Create or update user profile in Firestore on sign-in
 * Called after every successful auth (social or email)
 * @param {Object} user - Firebase Auth user object
 */
export async function createOrUpdateUserProfile(user) {
  if (!user || !db) return { success: false }
  try {
    const userDocRef = doc(db, 'users', user.uid)
    const snapshot = await getDoc(userDocRef)

    if (snapshot.exists()) {
      // Existing user — update last login
      const updates = {
        lastLoginAt: serverTimestamp(),
        displayName: user.displayName || snapshot.data().displayName,
        photoURL: user.photoURL || snapshot.data().photoURL,
      }
      // If pending registration data (from social login post-auth), merge it
      if (window._pendingRegistrationData) {
        const reg = window._pendingRegistrationData
        if (reg.birthYear && !snapshot.data().birthYear) updates.birthYear = reg.birthYear
        if (reg.gender && !snapshot.data().gender) updates.gender = reg.gender
        if (reg.username && !snapshot.data().username) updates.username = reg.username
        window._pendingRegistrationData = null
      }
      await updateDoc(userDocRef, updates)
      const profile = snapshot.data()
      return { success: true, profile, isNew: false, hasUsername: !!profile.username }
    } else {
      // New user — create profile
      const reg = window._pendingRegistrationData || {}
      const profile = {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || 'Hitchhiker',
        photoURL: user.photoURL || null,
        username: reg.username || null,
        birthYear: reg.birthYear || null,
        gender: reg.gender || null,
        verifiedPhone: null,
        verifiedIdentity: false,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        points: 0,
        level: 1,
        badges: [],
        rewards: [],
        spotsCreated: 0,
        checkins: 0,
        reviewsGiven: 0,
      }
      window._pendingRegistrationData = null
      await setDoc(userDocRef, profile)
      return { success: true, profile, isNew: true, hasUsername: !!reg.username }
    }
  } catch (error) {
    console.error('Error creating/updating user profile:', error)
    return { success: false, error }
  }
}

/**
 * Sign out
 */
export async function logOut() {
  try {
    // Clean up FCM tokens before signing out
    await deleteFCMTokens()
    await signOut(auth)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.code }
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.code };
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get current user
 */
export function getCurrentUser() {
  return auth?.currentUser;
}

// ==================== FIRESTORE - SPOTS ====================

/**
 * Get all spots
 */
export async function getSpots() {
  try {
    const spotsRef = collection(db, 'spots');
    const q = query(spotsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching spots:', error);
    return [];
  }
}

/**
 * Add a new spot
 */
const SPOT_ALLOWED_FIELDS = ['lat', 'lng', 'type', 'direction', 'directionLat', 'directionLng', 'safety', 'traffic', 'accessibility', 'description', 'photos', 'photoURL', 'country', 'city', 'departureCity', 'departureCityCoords', 'waitTime', 'rideResult', 'tips', 'name', 'positionSource']

export async function addSpot(spotData) {
  try {
    const user = getCurrentUser();
    const safeData = {}
    for (const key of SPOT_ALLOWED_FIELDS) {
      if (spotData[key] !== undefined) safeData[key] = spotData[key]
    }
    const spotsRef = collection(db, 'spots');
    const docRef = await addDoc(spotsRef, {
      ...safeData,
      creatorId: user?.uid || 'anonymous',
      creator: user?.displayName || 'Anonyme',
      createdAt: serverTimestamp(),
      totalReviews: 0,
      checkins: 0,
      verified: false,
      validationCount: 0,
      testCount: 0,
      lastValidated: null,
      lastTested: null,
      lastValidatedBy: null,
      lastTestedBy: null,
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding spot:', error);
    return { success: false, error };
  }
}

/**
 * Update a spot
 */
export async function updateSpot(spotId, updates) {
  try {
    const spotRef = doc(db, 'spots', spotId);
    await updateDoc(spotRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating spot:', error);
    return { success: false, error };
  }
}

/**
 * Add a destination to an existing spot
 * Uses arrayUnion to atomically append to the destinations array
 */
export async function addDestinationToSpot(spotId, destination) {
  try {
    const user = getCurrentUser();
    if (!user) return { success: false, error: 'auth_required' };

    const entry = {
      city: destination.city,
      coords: destination.coords || null,
      method: destination.method || null,
      waitTime: destination.waitTime || null,
      addedBy: user.uid,
      addedByName: user.displayName || 'Anonyme',
      addedAt: new Date().toISOString(),
    };

    const spotRef = doc(db, 'spots', spotId);
    await updateDoc(spotRef, {
      destinations: arrayUnion(entry),
      updatedAt: serverTimestamp()
    });
    return { success: true, entry };
  } catch (error) {
    console.error('Error adding destination:', error);
    return { success: false, error };
  }
}

/**
 * Add a review to a spot
 */
export async function addReview(spotId, reviewData) {
  try {
    const user = getCurrentUser();
    const REVIEW_ALLOWED_FIELDS = ['text', 'rating', 'comment', 'safety', 'traffic', 'accessibility', 'waitTime', 'photos']
    const safeReviewData = {}
    for (const key of REVIEW_ALLOWED_FIELDS) {
      if (reviewData[key] !== undefined) safeReviewData[key] = reviewData[key]
    }
    const reviewsRef = collection(db, 'spots', spotId, 'reviews');
    await addDoc(reviewsRef, {
      ...safeReviewData,
      userId: user?.uid || 'anonymous',
      userName: user?.displayName || 'Anonyme',
      createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error adding review:', error);
    return { success: false, error };
  }
}

/**
 * Get reviews for a spot
 */
export async function getReviews(spotId) {
  try {
    const reviewsRef = collection(db, 'spots', spotId, 'reviews');
    const q = query(reviewsRef, orderBy('createdAt', 'desc'), limit(20));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

// ==================== FIRESTORE - CHAT ====================

/**
 * Subscribe to chat messages
 */
export function subscribeToChatRoom(room, callback) {
  const messagesRef = collection(db, 'chat', room, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(50));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages.reverse());
  });
}

/**
 * Send a chat message
 */
export async function sendChatMessage(room, text) {
  try {
    const user = getCurrentUser();
    const safeText = (text || '').slice(0, 2000)
    const messagesRef = collection(db, 'chat', room, 'messages');
    await addDoc(messagesRef, {
      text: safeText,
      userId: user?.uid || 'anonymous',
      userName: user?.displayName || 'Anonyme',
      userAvatar: '🤙',
      createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error };
  }
}

// ==================== STORAGE ====================

/**
 * Upload image to Firebase Storage
 */
export async function uploadImage(base64Data, path) {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadString(storageRef, base64Data, 'data_url');
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { success: false, error };
  }
}

// ==================== PUSH NOTIFICATIONS ====================

const VAPID_KEY = 'BI4zCgg_GlFWZy93j7G7zv_ewoai_NIYZahiYsIjhL-LYGdxpN9wOBOtvvmakAYNBSqC12F9w_A-Ykhhp1SxWmc'

/**
 * Request notification permission and get FCM token
 */
export async function requestNotificationPermission() {
  try {
    if (!messaging) {
      return null
    }

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') {
      return null
    }

    const token = await getToken(messaging, { vapidKey: VAPID_KEY })
    return token
  } catch (error) {
    console.error('Error getting FCM token:', error)
    return null
  }
}

/**
 * Save FCM token to Firestore for the current user
 * Stored at users/{uid}/fcmTokens/{tokenHash}
 * @param {string} token - FCM token
 */
export async function saveFCMToken(token) {
  try {
    const user = getCurrentUser()
    if (!user || !token || !db) return false

    const tokenHash = await hashToken(token)
    const tokenRef = doc(db, 'users', user.uid, 'fcmTokens', tokenHash)

    await setDoc(tokenRef, {
      token,
      createdAt: serverTimestamp(),
      lastRefresh: serverTimestamp(),
      userAgent: navigator.userAgent,
      platform: navigator.platform || 'unknown',
    })

    return true
  } catch (error) {
    console.error('Error saving FCM token:', error)
    return false
  }
}

/**
 * Delete all FCM tokens for the current user (on logout)
 */
export async function deleteFCMTokens() {
  try {
    const user = getCurrentUser()
    if (!user || !db) return false

    // Delete the current device token from FCM
    if (messaging) {
      try {
        await deleteToken(messaging)
      } catch {
        // Token may already be invalid
      }
    }

    // Delete all tokens from Firestore
    const tokensRef = collection(db, 'users', user.uid, 'fcmTokens')
    const snapshot = await getDocs(tokensRef)
    if (!snapshot.empty) {
      const batch = writeBatch(db)
      snapshot.docs.forEach((d) => batch.delete(d.ref))
      await batch.commit()
    }

    return true
  } catch (error) {
    console.error('Error deleting FCM tokens:', error)
    return false
  }
}

/**
 * Hash a token string to use as document ID
 * @param {string} token - FCM token
 * @returns {string} hex hash
 */
async function hashToken(token) {
  if (crypto.subtle) {
    const data = new TextEncoder().encode(token)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 32)
  }
  // Fallback: simple hash
  let hash = 0
  for (let i = 0; i < token.length; i++) {
    hash = ((hash << 5) - hash) + token.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString(16).padStart(8, '0')
}

/**
 * Listen for foreground messages
 */
export function onForegroundMessage(callback) {
  if (!messaging) return () => {}
  return onMessage(messaging, callback)
}

// ==================== USERNAME SYSTEM ====================

// Basic profanity filter — common offensive words in EN/FR/ES/DE
const PROFANITY_LIST = [
  'fuck', 'shit', 'ass', 'bitch', 'dick', 'cock', 'pussy', 'nigger', 'faggot',
  'merde', 'putain', 'connard', 'connasse', 'salope', 'enculer', 'nique',
  'puta', 'mierda', 'coño', 'joder', 'cabron',
  'scheiße', 'scheisse', 'arschloch', 'hurensohn', 'fotze', 'wichser',
  'admin', 'spothitch', 'moderator', 'support', 'system', 'root',
]

/**
 * Validate username format (client-side, before Firestore check)
 * Rules: 3-20 chars, lowercase alphanumeric + _ + ., no start/end with . or _
 * @param {string} username
 * @returns {{ valid: boolean, errorKey: string|null }}
 */
export function validateUsername(username) {
  if (!username) return { valid: false, errorKey: 'usernameRequired' }
  const u = username.toLowerCase().trim()
  if (u.length < 3) return { valid: false, errorKey: 'usernameTooShort' }
  if (u.length > 20) return { valid: false, errorKey: 'usernameTooLong' }
  if (!/^[a-z0-9._]+$/.test(u)) return { valid: false, errorKey: 'usernameInvalidChars' }
  if (/^[._]|[._]$/.test(u)) return { valid: false, errorKey: 'usernameInvalidFormat' }
  if (/[.]{2}|[_]{2}/.test(u)) return { valid: false, errorKey: 'usernameInvalidFormat' }
  // Profanity check
  const lower = u.replace(/[._]/g, '')
  if (PROFANITY_LIST.some(w => lower.includes(w))) return { valid: false, errorKey: 'usernameProfanity' }
  return { valid: true, errorKey: null }
}

/**
 * Check if a username is available in Firestore
 * Uses `usernames/{lowercase}` document for O(1) uniqueness check
 * @param {string} username
 * @returns {Promise<boolean>}
 */
export async function checkUsernameAvailability(username) {
  if (!db) return { available: true, error: null } // optimistic if DB not ready
  try {
    const u = username.toLowerCase().trim()
    const docRef = doc(db, 'usernames', u)
    const snapshot = await getDoc(docRef)
    return { available: !snapshot.exists(), error: null }
  } catch (error) {
    console.error('Error checking username:', error)
    // If we can't check (permissions, network), assume available.
    // reserveUsername will do the real atomic check on account creation.
    return { available: true, error: error.code || 'check_failed' }
  }
}

/**
 * Reserve a username for a user (atomic: check + claim)
 * Creates `usernames/{lowercase}` with the user's UID
 * @param {string} username - The desired username
 * @param {string} uid - User ID
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function reserveUsername(username, uid) {
  if (!db) return { success: false, error: 'no_db' }
  try {
    const u = username.toLowerCase().trim()
    const docRef = doc(db, 'usernames', u)
    const snapshot = await getDoc(docRef)

    if (snapshot.exists()) {
      // Already taken (race condition check)
      if (snapshot.data().uid === uid) return { success: true } // Same user re-claiming
      return { success: false, error: 'taken' }
    }

    await setDoc(docRef, {
      uid,
      username: u,
      createdAt: serverTimestamp(),
    })

    // Also update the user's profile with the username
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, { username: u }).catch(async () => {
      // Profile may not exist yet — create it
      await setDoc(userRef, { username: u }, { merge: true })
    })

    return { success: true }
  } catch (error) {
    console.error('Error reserving username:', error)
    return { success: false, error: error.code || 'unknown' }
  }
}

/**
 * Release a username (for changing username later)
 * @param {string} oldUsername
 * @returns {Promise<boolean>}
 */
export async function releaseUsername(oldUsername) {
  if (!db || !oldUsername) return false
  try {
    const u = oldUsername.toLowerCase().trim()
    const { deleteDoc: delDoc } = await import('firebase/firestore')
    await delDoc(doc(db, 'usernames', u))
    return true
  } catch (error) {
    console.error('Error releasing username:', error)
    return false
  }
}

// ==================== QUICK VALIDATE (spot exists) ====================

/**
 * Quick validate a spot (1 tap — confirms spot exists, no stop made)
 * Increments validationCount + updates lastValidated
 * @param {string} spotId - Spot ID
 */
export async function quickValidateSpot(spotId) {
  try {
    const user = getCurrentUser()
    if (!user) return { success: false, error: 'not_authenticated' }

    const spotRef = doc(db, 'spots', String(spotId))
    const { increment } = await import('firebase/firestore')
    await updateDoc(spotRef, {
      validationCount: increment(1),
      lastValidated: new Date().toISOString(),
      lastValidatedBy: user.uid,
    }).catch(() => {}) // May fail if spot is from Hitchmap (not in Firestore)

    // Log the validation
    const validationsRef = collection(db, 'spots', String(spotId), 'validations')
    await addDoc(validationsRef, {
      type: 'quick_validate',
      userId: user.uid,
      userName: user.displayName || 'Anonyme',
      createdAt: serverTimestamp(),
    }).catch(() => {})

    return { success: true }
  } catch (error) {
    console.error('Error quick validating spot:', error)
    return { success: false, error }
  }
}

// ==================== ENHANCED SPOT OPERATIONS ====================

/**
 * Load all spots from Firebase
 */
export async function loadSpotsFromFirebase() {
  try {
    const spotsRef = collection(db, 'spots');
    const q = query(spotsRef, orderBy('createdAt', 'desc'), limit(200));
    const snapshot = await getDocs(q);
    return {
      success: true,
      spots: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    };
  } catch (error) {
    console.error('Error loading spots from Firebase:', error);
    return { success: false, error, spots: [] };
  }
}

/**
 * Save a spot to Firebase
 * @param {Object} spot - Spot data
 */
export async function saveSpotToFirebase(spot) {
  try {
    const user = getCurrentUser();
    const spotsRef = collection(db, 'spots');

    const spotData = {
      ...spot,
      creatorId: user?.uid || 'anonymous',
      creator: user?.displayName || 'Anonyme',
      creatorAvatar: user?.photoURL || '🤙',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      totalReviews: 0,
      checkins: 0,
      verified: false,
      reports: 0,
    };

    const docRef = await addDoc(spotsRef, spotData);
    return { success: true, id: docRef.id, spot: { ...spotData, id: docRef.id } };
  } catch (error) {
    console.error('Error saving spot:', error);
    return { success: false, error };
  }
}

/**
 * Upload a photo to Firebase Storage
 * @param {string} dataUrl - Base64 data URL of the image
 * @param {string} spotId - Spot ID for the photo path
 */
export async function uploadPhotoToFirebase(dataUrl, spotId) {
  try {
    const user = getCurrentUser();
    const timestamp = Date.now();
    const path = `spots/${spotId}/${user?.uid || 'anon'}_${timestamp}.jpg`;

    const storageRef = ref(storage, path);
    const snapshot = await uploadString(storageRef, dataUrl, 'data_url');
    const downloadURL = await getDownloadURL(snapshot.ref);

    return { success: true, url: downloadURL, path };
  } catch (error) {
    console.error('Error uploading photo:', error);
    return { success: false, error };
  }
}

/**
 * Save a validation (check-in) to Firebase
 * @param {string} spotId - Spot ID
 * @param {string} userId - User ID
 */
export async function saveValidationToFirebase(spotId, userId) {
  try {
    const user = getCurrentUser();
    const validationsRef = collection(db, 'spots', spotId, 'validations');

    await addDoc(validationsRef, {
      userId: user?.uid || userId || 'anonymous',
      userName: user?.displayName || 'Anonyme',
      validatedAt: serverTimestamp(),
    });

    // Increment spot validationCount + checkins
    const spotRef = doc(db, 'spots', spotId);
    const { increment } = await import('firebase/firestore');
    await updateDoc(spotRef, {
      validationCount: increment(1),
      checkins: increment(1),
      lastValidated: new Date().toISOString(),
      lastValidatedBy: user?.uid || userId || 'anonymous',
      lastUsed: new Date().toISOString().split('T')[0],
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving validation:', error);
    return { success: false, error };
  }
}

/**
 * Add a structured validation (community data) to a spot
 * Stores complete experience data: waitTime, method, group, timeOfDay, etc.
 * @param {Object} data - Validation data with spotId
 */
export async function addValidation(data) {
  try {
    const user = getCurrentUser()
    const spotId = String(data.spotId)
    const validationsRef = collection(db, 'spots', spotId, 'validations')

    await addDoc(validationsRef, {
      ...data,
      userId: user?.uid || 'anonymous',
      userName: user?.displayName || 'Anonyme',
      createdAt: serverTimestamp(),
    })

    // Update spot stats — increment testCount (full experience) + checkins
    const spotRef = doc(db, 'spots', spotId)
    const { increment } = await import('firebase/firestore')
    await updateDoc(spotRef, {
      testCount: increment(1),
      checkins: increment(1),
      lastTested: new Date().toISOString(),
      lastTestedBy: user?.uid || 'anonymous',
      lastUsed: new Date().toISOString().split('T')[0],
    }).catch(() => {}) // May fail if spot is from Hitchmap (not in Firestore)

    return { success: true }
  } catch (error) {
    console.error('Error adding validation:', error)
    return { success: false, error }
  }
}

/**
 * Save a comment to Firebase
 * @param {Object} comment - Comment data {spotId, text, rating}
 */
export async function saveCommentToFirebase(comment) {
  try {
    const user = getCurrentUser();
    const commentsRef = collection(db, 'spots', comment.spotId, 'comments');

    const commentData = {
      text: comment.text,
      rating: comment.rating || null,
      userId: user?.uid || 'anonymous',
      userName: user?.displayName || 'Anonyme',
      userAvatar: user?.photoURL || '🤙',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(commentsRef, commentData);

    // Update spot review count if rating provided
    if (comment.rating) {
      const spotRef = doc(db, 'spots', comment.spotId);
      const { increment } = await import('firebase/firestore');
      await updateDoc(spotRef, {
        totalReviews: increment(1),
      });
    }

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving comment:', error);
    return { success: false, error };
  }
}

/**
 * Report a spot
 * @param {string} spotId - Spot ID
 * @param {string} reason - Report reason
 * @param {string} details - Additional details
 */
export async function reportSpot(spotId, reason, details = '') {
  try {
    const user = getCurrentUser();
    const reportsRef = collection(db, 'reports');

    await addDoc(reportsRef, {
      spotId,
      reason,
      details,
      reporterId: user?.uid || 'anonymous',
      reporterName: user?.displayName || 'Anonyme',
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    // Increment spot report count
    const spotRef = doc(db, 'spots', spotId);
    const { increment } = await import('firebase/firestore');
    await updateDoc(spotRef, {
      reports: increment(1),
    });

    return { success: true };
  } catch (error) {
    console.error('Error reporting spot:', error);
    return { success: false, error };
  }
}

/**
 * Handle successful authentication
 * @param {Object} user - Firebase user object
 * @param {boolean} isNew - Whether this is a new user
 */
export async function handleAuthSuccess(user, isNew = false) {
  try {
    const userDocRef = doc(db, 'users', user.uid);

    if (isNew) {
      // Create user profile
      await updateDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Utilisateur',
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        points: 0,
        level: 1,
        badges: [],
        rewards: [],
      }).catch(async () => {
        // Document doesn't exist, create it
        const { setDoc } = await import('firebase/firestore');
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Utilisateur',
          photoURL: user.photoURL || null,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          points: 0,
          level: 1,
          badges: [],
          rewards: [],
        });
      });
    } else {
      // Update last login
      await updateDoc(userDocRef, {
        lastLoginAt: serverTimestamp(),
      }).catch(() => {
        // Ignore if user doc doesn't exist yet
      });
    }

    return { success: true, user };
  } catch (error) {
    console.error('Error handling auth success:', error);
    return { success: false, error };
  }
}

/**
 * Get user profile from Firestore
 * @param {string} userId - User ID
 */
export async function getUserProfile(userId) {
  try {
    const { getDoc } = await import('firebase/firestore');
    const userDocRef = doc(db, 'users', userId);
    const snapshot = await getDoc(userDocRef);

    if (snapshot.exists()) {
      return { success: true, profile: snapshot.data() };
    }
    return { success: false, profile: null };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error };
  }
}

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updates - Profile updates
 */
const PROFILE_ALLOWED_FIELDS = ['username', 'displayName', 'bio', 'avatar', 'photoURL', 'languages', 'socialLinks', 'photos', 'country', 'title', 'equippedBadge', 'equippedFrame', 'equippedTitle', 'points', 'seasonPoints', 'level', 'badges', 'league', 'isVIP', 'theme', 'lang', 'lastSeen']

export async function updateUserProfile(userId, updates) {
  try {
    const safeUpdates = {}
    for (const key of PROFILE_ALLOWED_FIELDS) {
      if (updates[key] !== undefined) safeUpdates[key] = updates[key]
    }
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      ...safeUpdates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error };
  }
}

/**
 * Hydrate localStorage with profile data from Firestore (on login).
 * Merges Firestore data into local storage without overwriting local-only fields.
 * @param {string} userId - User ID
 */
export async function hydrateLocalProfileFromFirestore(userId) {
  try {
    const result = await getUserProfile(userId)
    if (!result.success || !result.profile) return

    const p = result.profile

    // Bio
    if (p.bio) {
      localStorage.setItem('spothitch_bio', p.bio)
    }

    // Social links
    if (p.socialLinks && typeof p.socialLinks === 'object') {
      const local = JSON.parse(localStorage.getItem('spothitch_social_links') || '{}')
      // Merge: Firestore wins for non-empty values, keep local-only ones
      const merged = { ...local, ...p.socialLinks }
      localStorage.setItem('spothitch_social_links', JSON.stringify(merged))
    }

    // Languages
    if (Array.isArray(p.languages) && p.languages.length > 0) {
      localStorage.setItem('spothitch_languages', JSON.stringify(p.languages))
    }
  } catch {
    // Silent fail — localStorage remains source of truth when offline
  }
}

// ==================== DELETE USER ACCOUNT ====================

/**
 * Delete user account with password confirmation
 * @param {string} password - User's password for re-authentication
 */
export async function deleteUserAccount(password) {
  try {
    const user = getCurrentUser();
    if (!user) {
      return { success: false, error: 'auth/user-not-found' };
    }

    // Re-authenticate user before deletion (required by Firebase)
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);

    // Delete user data from Firestore
    await deleteUserData(user.uid);

    // Delete the Firebase Auth user
    await deleteUser(user);

    return { success: true };
  } catch (error) {
    console.error('Error deleting user account:', error);
    return { success: false, error: error.code || 'unknown' };
  }
}

/**
 * Delete user account for Google-authenticated users
 * Requires re-authentication with Google popup
 */
export async function deleteUserAccountGoogle() {
  try {
    const user = getCurrentUser();
    if (!user) {
      return { success: false, error: 'auth/user-not-found' };
    }

    // Re-authenticate with Google
    const provider = new GoogleAuthProvider();
    await reauthenticateWithPopup(user, provider);

    // Delete user data from Firestore
    await deleteUserData(user.uid);

    // Delete the Firebase Auth user
    await deleteUser(user);
    return { success: true };
  } catch (error) {
    console.error('Error deleting user account:', error);
    return { success: false, error: error.code || 'unknown' };
  }
}

/**
 * Delete all user data from Firestore
 * @param {string} userId - User ID
 */
async function deleteUserData(userId) {
  try {
    const batch = writeBatch(db);

    // Delete user profile document
    const userDocRef = doc(db, 'users', userId);
    batch.delete(userDocRef);

    // Find and delete user's spots
    const spotsRef = collection(db, 'spots');
    const spotsQuery = query(spotsRef, where('creatorId', '==', userId));
    const spotsSnapshot = await getDocs(spotsQuery);

    spotsSnapshot.docs.forEach((spotDoc) => {
      batch.delete(spotDoc.ref);
    });

    // Find and delete user's chat messages (optional - mark as deleted instead)
    // This is a simplified version - in production you might want to anonymize instead

    // Commit the batch
    await batch.commit();

    return { success: true };
  } catch (error) {
    console.error('Error deleting user data:', error);
    // Continue with account deletion even if data deletion partially fails
    return { success: false, error };
  }
}

// ==================== ROADMAP VOTES & COMMENTS ====================

/**
 * Vote on a roadmap feature (up/down). One vote per user per feature.
 * Uses document ID = `${featureId}_${userId}` for upsert.
 */
export async function setRoadmapVote(featureId, vote) {
  try {
    const user = getCurrentUser()
    if (!user) return { success: false, error: 'not_authenticated' }
    const voteId = `${featureId}_${user.uid}`
    const voteRef = doc(db, 'roadmap_votes', voteId)
    const existing = await getDoc(voteRef)

    if (existing.exists() && existing.data().vote === vote) {
      // Toggle off — same vote again removes it
      const { deleteDoc } = await import('firebase/firestore')
      await deleteDoc(voteRef)
      return { success: true, action: 'removed' }
    }

    await setDoc(voteRef, {
      featureId,
      userId: user.uid,
      vote,
      updatedAt: serverTimestamp(),
    })
    return { success: true, action: 'set' }
  } catch (error) {
    console.error('Error setting roadmap vote:', error)
    return { success: false, error }
  }
}

/**
 * Get all votes for all roadmap features.
 * Returns { featureId: { up: N, down: N }, ... } + myVotes: { featureId: 'up'|'down' }
 */
export async function getRoadmapVotes() {
  try {
    const votesRef = collection(db, 'roadmap_votes')
    const snapshot = await getDocs(votesRef)
    const counts = {}
    const myVotes = {}
    const user = getCurrentUser()
    const uid = user?.uid

    snapshot.docs.forEach(d => {
      const data = d.data()
      const fid = data.featureId
      if (!counts[fid]) counts[fid] = { up: 0, down: 0 }
      if (data.vote === 'up') counts[fid].up++
      if (data.vote === 'down') counts[fid].down++
      if (uid && data.userId === uid) myVotes[fid] = data.vote
    })

    return { success: true, counts, myVotes }
  } catch (error) {
    console.error('Error getting roadmap votes:', error)
    return { success: false, counts: {}, myVotes: {} }
  }
}

/**
 * Add a comment to a roadmap feature.
 */
export async function addRoadmapComment(featureId, text) {
  try {
    const user = getCurrentUser()
    if (!user) return { success: false, error: 'not_authenticated' }

    const commentsRef = collection(db, 'roadmap_comments')
    await addDoc(commentsRef, {
      featureId,
      userId: user.uid,
      username: user.displayName || 'Anonyme',
      text: text.slice(0, 500),
      createdAt: serverTimestamp(),
    })
    return { success: true }
  } catch (error) {
    console.error('Error adding roadmap comment:', error)
    return { success: false, error }
  }
}

/**
 * Get all comments for a specific feature, ordered by date.
 */
export async function getRoadmapComments(featureId) {
  try {
    const commentsRef = collection(db, 'roadmap_comments')
    const q = query(commentsRef, where('featureId', '==', featureId), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    const comments = snapshot.docs.map(d => {
      const data = d.data()
      return {
        id: d.id,
        featureId: data.featureId,
        username: data.username || 'Anonyme',
        text: data.text,
        date: data.createdAt?.toDate?.()?.toLocaleDateString?.() || '',
      }
    })
    return { success: true, comments }
  } catch (error) {
    console.error('Error getting roadmap comments:', error)
    return { success: false, comments: [] }
  }
}

/**
 * Get comment counts for all features (for list view).
 */
export async function getRoadmapCommentCounts() {
  try {
    const commentsRef = collection(db, 'roadmap_comments')
    const snapshot = await getDocs(commentsRef)
    const counts = {}
    snapshot.docs.forEach(d => {
      const fid = d.data().featureId
      counts[fid] = (counts[fid] || 0) + 1
    })
    return { success: true, counts }
  } catch (error) {
    console.error('Error getting roadmap comment counts:', error)
    return { success: false, counts: {} }
  }
}

// ==================== TRIPS CRUD ====================

/**
 * Save or overwrite a trip in Firestore for a given user.
 */
export async function saveTrip(uid, trip) {
  try {
    const tripRef = doc(db, 'users', uid, 'trips', trip.id)
    await setDoc(tripRef, { ...trip, updatedAt: new Date().toISOString() })
    return { success: true }
  } catch (error) {
    console.error('saveTrip error:', error)
    return { success: false, error }
  }
}

/**
 * Get all trips for a user, ordered by savedAt desc.
 */
export async function getUserTrips(uid) {
  try {
    const tripsRef = collection(db, 'users', uid, 'trips')
    const q = query(tripsRef, orderBy('savedAt', 'desc'))
    const snapshot = await getDocs(q)
    return { success: true, trips: snapshot.docs.map(d => d.data()) }
  } catch (error) {
    console.error('getUserTrips error:', error)
    return { success: false, trips: [] }
  }
}

/**
 * Update specific fields of a trip.
 */
export async function updateTrip(uid, tripId, fields) {
  try {
    const tripRef = doc(db, 'users', uid, 'trips', tripId)
    await updateDoc(tripRef, { ...fields, updatedAt: new Date().toISOString() })
    return { success: true }
  } catch (error) {
    console.error('updateTrip error:', error)
    return { success: false, error }
  }
}

/**
 * Delete a trip from Firestore.
 */
export async function deleteTrip(uid, tripId) {
  try {
    const tripRef = doc(db, 'users', uid, 'trips', tripId)
    await deleteDoc(tripRef)
    return { success: true }
  } catch (error) {
    console.error('deleteTrip error:', error)
    return { success: false, error }
  }
}

// Export instances for advanced usage
export { app, auth, db, storage, messaging };

// E2E test bridge — exposes Firebase primitives for Playwright tests.
// In production builds, dynamic import('firebase/firestore') fails because
// bare module specifiers are bundled. This bridge makes Firestore/Auth
// functions accessible via window.__fb after initializeFirebase() is called.
if (typeof window !== 'undefined') {
  window.__fb = {
    getDb: () => db,
    getAuth: () => auth,
    initializeFirebase,
    // Firestore functions
    collection, doc, addDoc, updateDoc, deleteDoc, getDocs, getDoc,
    query, where, orderBy, limit, onSnapshot, serverTimestamp,
    setDoc, writeBatch, arrayUnion, arrayRemove, increment,
    enableNetwork, disableNetwork,
    // Auth functions
    signIn, signUp, logOut,
    signInWithGoogle, signInWithFacebook,
    createOrUpdateUserProfile, hydrateLocalProfileFromFirestore,
    reserveUsername, validateUsername, checkUsernameAvailability,
    // Storage functions
    getStorage: () => storage,
    ref, uploadString, getDownloadURL,
    uploadImage, uploadPhotoToFirebase,
  }
}
