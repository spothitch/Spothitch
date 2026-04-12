/**
 * Firebase Service
 * Handles authentication, Firestore database, and storage
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
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
  updateProfile,
  connectAuthEmulator
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
  disableNetwork,
  runTransaction,
  connectFirestoreEmulator
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadString,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import { getMessaging, getToken, onMessage, deleteToken } from 'firebase/messaging';

// ==================== CLIENT-SIDE WRITE RATE LIMITER ====================

/**
 * Simple in-memory rate limiter for Firestore write operations.
 * Tracks timestamps per operation type and rejects if limit exceeded.
 * @param {string} opName - operation identifier (e.g. 'addSpot')
 * @param {number} maxPerMinute - max allowed writes per 60s window
 * @returns {{ allowed: boolean }} - whether the write is allowed
 */
const _rateLimitBuckets = {}
function checkWriteRateLimit(opName, maxPerMinute) {
  const now = Date.now()
  const windowMs = 60_000
  if (!_rateLimitBuckets[opName]) _rateLimitBuckets[opName] = []
  // Purge entries older than 60s + cap bucket size to prevent memory growth
  _rateLimitBuckets[opName] = _rateLimitBuckets[opName].filter((ts) => now - ts < windowMs)
  if (_rateLimitBuckets[opName].length > 500) _rateLimitBuckets[opName] = _rateLimitBuckets[opName].slice(-maxPerMinute)
  if (_rateLimitBuckets[opName].length >= maxPerMinute) {
    console.warn(`Rate limit exceeded for ${opName}: ${maxPerMinute}/min`)
    return { allowed: false }
  }
  _rateLimitBuckets[opName].push(now)
  return { allowed: true }
}

// ==================== RETRY WRAPPER FOR NETWORK ERRORS ====================

/**
 * Retry a function with exponential backoff on network errors.
 * @param {Function} fn - async function to call
 * @param {number} maxAttempts - max retry attempts (default 3)
 * @returns {Promise<*>} result of fn()
 */
async function withRetry(fn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      const isNetworkError =
        error?.code === 'unavailable' ||
        error?.code === 'network-request-failed' ||
        error?.message?.includes('network') ||
        error?.message?.includes('Failed to fetch')
      if (!isNetworkError || attempt >= maxAttempts) {
        throw error
      }
      const delay = Math.pow(2, attempt - 1) * 1000 // 1s, 2s, 4s
      console.warn(`[withRetry] Attempt ${attempt}/${maxAttempts} failed, retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

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

export function getFirebaseAuth() { return auth }
export function getDb() { return db }

export function initializeFirebase() {
  try {
    // Avoid re-initializing if already done
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    // Ensure session persists across page reloads and browser restarts
    setPersistence(auth, browserLocalPersistence).catch(() => {})
    // Force Firebase Auth language to match the app's language (FR/EN/ES/DE)
    try {
      const savedState = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
      const lang = savedState.lang || navigator.language?.substring(0, 2) || 'en'
      const supported = ['fr', 'en', 'es', 'de']
      auth.languageCode = supported.includes(lang) ? lang : 'en'
    } catch { auth.languageCode = 'en' }
    db = getFirestore(app);
    storage = getStorage(app);

    // Connect to Firebase Emulators in CI/test mode (zero cost, local only)
    if (import.meta.env.VITE_FIREBASE_EMULATOR === 'true') {
      try {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
        connectFirestoreEmulator(db, '127.0.0.1', 8080)
        console.log('[Firebase] Connected to local emulators (Auth:9099, Firestore:8080)')
      } catch (e) {
        console.warn('[Firebase] Emulator connection failed:', e?.message)
      }
    }

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
    console.error('Firebase initialization failed:', error);
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
let _gisLoadPromise = null
function loadGIS() {
  if (_gisLoaded && window.google?.accounts?.id) return Promise.resolve()
  if (_gisLoadPromise) return _gisLoadPromise
  _gisLoadPromise = new Promise((resolve, reject) => {
    if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
      // Script tag exists, wait for it
      const check = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(check)
          _gisLoaded = true
          _gisLoadPromise = null
          resolve()
        }
      }, 100)
      setTimeout(() => { clearInterval(check); _gisLoadPromise = null; reject(new Error('gis-timeout')) }, 5000)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = () => { _gisLoaded = true; _gisLoadPromise = null; resolve() }
    script.onerror = () => { _gisLoadPromise = null; reject(new Error('gis-load-failed')) }
    document.head.appendChild(script)
  })
  return _gisLoadPromise
}

// Google OAuth Client ID (from Firebase Console → Authentication → Sign-in method → Google)
const GOOGLE_CLIENT_ID = '314974309234-eh794g3edfe35h8r7eom2q0i092c5h35.apps.googleusercontent.com'

/**
 * Setup GIS invisible overlay button on top of a visible Google sign-in button.
 * When GIS loads, the overlay captures clicks → opens Google popup directly
 * (no Firebase intermediate page). If GIS fails to load, nothing happens
 * and the regular onclick handler fires instead (signInWithGoogle fallback).
 *
 * @param {HTMLElement} overlayContainer - positioned absolutely over the button
 * @param {function} onResult - called with { success, user } or { success: false, error }
 */
export function setupGISOverlay(overlayContainer, onResult) {
  if (!overlayContainer) return
  loadGIS().then(() => {
    // Force GIS language to match app language
    const gisLocale = auth?.languageCode || 'en'
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      locale: gisLocale,
      callback: async (response) => {
        if (!response.credential) {
          onResult({ success: false, error: 'no-credential' })
          return
        }
        try {
          window._authInProgress = true
          const credential = GoogleAuthProvider.credential(response.credential)
          const result = await signInWithCredential(auth, credential)
          window._authInProgress = false
          if (result?.user) {
            onResult({ success: true, user: result.user })
          } else {
            onResult({ success: false, error: 'no-user' })
          }
        } catch (e) {
          window._authInProgress = false
          onResult({ success: false, error: e.code || e.message })
        }
      },
      auto_select: false,
    })

    // Render the real Google button into the overlay container
    window.google.accounts.id.renderButton(overlayContainer, {
      type: 'standard',
      theme: 'filled_black',
      size: 'large',
      width: Math.max(overlayContainer.offsetWidth, 300),
      text: 'continue_with',
    })

    // Make the rendered GIS iframe cover the overlay container (transparent)
    // The user sees our styled button but clicks the real Google button
    requestAnimationFrame(() => {
      const iframe = overlayContainer.querySelector('iframe')
      if (iframe) {
        iframe.style.width = '100%'
        iframe.style.height = '100%'
        iframe.style.opacity = '0.01'
        iframe.style.position = 'absolute'
        iframe.style.top = '0'
        iframe.style.left = '0'
        // GIS iframe rendered — enable pointer events so clicks hit the real Google button
        overlayContainer.style.pointerEvents = 'auto'
      }
      // Also make the container div from GIS fill the space
      const gisDiv = overlayContainer.firstElementChild
      if (gisDiv) {
        gisDiv.style.width = '100%'
        gisDiv.style.height = '100%'
        gisDiv.style.position = 'absolute'
        gisDiv.style.top = '0'
        gisDiv.style.left = '0'
      }
    })
  }).catch(() => {
    // GIS unavailable — overlay stays pointer-events:none, clicks fall through to button onclick
  })
}

/**
 * Sign in with Google using Firebase signInWithPopup (desktop) or signInWithRedirect (mobile).
 *
 * This is the FALLBACK method, used when GIS overlay is not available
 * (script blocked, GIS not loaded). It briefly shows a Firebase
 * intermediate page before redirecting to Google.
 *
 * On mobile, popups are frequently blocked by browsers, so we use
 * signInWithRedirect instead. The result is picked up on app restart
 * via checkRedirectResult().
 */
export async function signInWithGoogle() {
  try {
    window._authInProgress = true
    const provider = new GoogleAuthProvider()

    // Mobile: use redirect (popups are unreliable on mobile browsers)
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    if (isMobile) {
      sessionStorage.setItem('spothitch_auth_redirect', '1')
      const { signInWithRedirect } = await import('firebase/auth')
      await signInWithRedirect(auth, provider)
      // Page will reload — result handled by checkRedirectResult() on next load
      return { success: false, error: 'redirect-in-progress' }
    }

    // Desktop: use popup
    const result = await signInWithPopup(auth, provider)
    window._authInProgress = false
    if (result?.user) {
      return { success: true, user: result.user }
    }
    return { success: false, error: 'no-user' }
  } catch (error) {
    window._authInProgress = false
    // If popup was blocked, try redirect as fallback
    if (error.code === 'auth/popup-blocked') {
      try {
        sessionStorage.setItem('spothitch_auth_redirect', '1')
        const { signInWithRedirect } = await import('firebase/auth')
        await signInWithRedirect(auth, new GoogleAuthProvider())
        return { success: false, error: 'redirect-in-progress' }
      } catch { /* redirect also failed */ }
    }
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
        displayName: user.displayName || snapshot.data().displayName || null,
        photoURL: user.photoURL || snapshot.data().photoURL || null,
      }
      // If pending registration data (from social login post-auth), merge it
      if (window._pendingRegistrationData) {
        const reg = window._pendingRegistrationData
        if (reg.firstName && !snapshot.data().firstName) updates.firstName = reg.firstName
        if (reg.lastName && !snapshot.data().lastName) updates.lastName = reg.lastName
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
      // Get user's app language for welcome email
      let userLang = 'en'
      try {
        const s = JSON.parse(localStorage.getItem('spothitch_v4_state') || '{}')
        userLang = s.lang || navigator.language?.substring(0, 2) || 'en'
      } catch { /* ignore */ }

      const profile = {
        uid: user.uid,
        email: user.email || null,
        firstName: reg.firstName || (user.displayName ? user.displayName.split(' ')[0] : null),
        lastName: reg.lastName || (user.displayName && user.displayName.split(' ').length > 1 ? user.displayName.split(' ').slice(1).join(' ') : null),
        displayName: reg.firstName ? `${reg.firstName} ${(reg.lastName || '').charAt(0)}.` : (user.displayName || 'Autostoppeur'),
        photoURL: user.photoURL || null,
        username: reg.username || null,
        birthYear: reg.birthYear || null,
        gender: reg.gender || null,
        lang: userLang,
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
 * Get spots created by a specific user
 */
export async function getUserSpots(userId) {
  try {
    const spotsRef = collection(db, 'spots')
    // Simple query on creatorId only (no composite index needed), sort client-side
    const q = query(spotsRef, where('creatorId', '==', userId), limit(50))
    const snapshot = await getDocs(q)
    const spots = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    // Sort by createdAt desc client-side
    spots.sort((a, b) => {
      const ta = a.createdAt?.toDate?.() || a.createdAt || 0
      const tb = b.createdAt?.toDate?.() || b.createdAt || 0
      return tb - ta
    })
    return spots
  } catch (error) {
    console.error('Error fetching user spots:', error)
    return []
  }
}

/**
 * Get a single spot by ID from Firestore
 */
export async function getSpotById(spotId) {
  try {
    const spotRef = doc(db, 'spots', spotId)
    const snap = await getDoc(spotRef)
    if (snap.exists()) return { id: snap.id, ...snap.data() }
    return null
  } catch {
    return null
  }
}

/**
 * Add a new spot
 */
const SPOT_ALLOWED_FIELDS = [
  // Location
  'lat', 'lng', 'coordinates', 'country', 'countryName', 'departureCity',
  'departureCityCoords', 'directionCity', 'directionCityCoords',
  'locationName', 'roadNumber', 'positionSource', 'city',
  // Spot info
  'type', 'spotType', 'stationName', 'direction', 'directionLat', 'directionLng',
  'from', 'to', 'fromCity', 'destinations',
  // Experience
  'method', 'groupSize', 'timeOfDay', 'waitTime', 'avgWaitTime',
  'rideResult', 'season',
  // Ratings & tags
  'ratings', 'globalRating', 'safety', 'traffic', 'accessibility',
  'tags', 'description', 'tips',
  // Media
  'photos', 'photoUrl', 'photoURL', 'hasPhoto',
  // Meta
  'name', 'cityNumber', 'dataSource', 'experienceDate',
]

/**
 * Convert experienceDate {year, month, day?} to ISO string.
 * Falls back to current date if invalid.
 */
function experienceDateToISO(expDate) {
  if (!expDate || !expDate.year || !expDate.month) return new Date().toISOString()
  const day = expDate.day || 15 // mid-month if no day specified
  const d = new Date(expDate.year, expDate.month - 1, day, 12, 0, 0)
  if (isNaN(d.getTime())) return new Date().toISOString()
  return d.toISOString()
}

export async function addSpot(spotData) {
  try {
    if (!checkWriteRateLimit('addSpot', 5).allowed) {
      return { success: false, error: 'rate_limit_exceeded' }
    }
    // Profanity check on user-submitted text fields
    const textToCheck = [spotData.name, spotData.description, spotData.tips].filter(Boolean).join(' ')
    if (containsProfanity(textToCheck)) {
      return { success: false, error: 'profanity_detected' }
    }
    const user = getCurrentUser();
    const safeData = {}
    for (const key of SPOT_ALLOWED_FIELDS) {
      if (spotData[key] !== undefined) safeData[key] = spotData[key]
    }
    // Flatten coordinates if nested (for backward compat with queries)
    if (safeData.coordinates && !safeData.lat) {
      safeData.lat = safeData.coordinates.lat
      safeData.lng = safeData.coordinates.lng
    }
    // Flatten ratings to top-level (for backward compat with queries)
    if (safeData.ratings) {
      if (!safeData.safety) safeData.safety = safeData.ratings.safety || 0
      if (!safeData.traffic) safeData.traffic = safeData.ratings.traffic || 0
      if (!safeData.accessibility) safeData.accessibility = safeData.ratings.accessibility || 0
    }
    const spotsRef = collection(db, 'spots');
    const docRef = await withRetry(() => addDoc(spotsRef, {
      ...safeData,
      creatorId: user?.uid || 'anonymous',
      creator: user?.displayName || 'Anonyme',
      createdAt: serverTimestamp(),
      totalReviews: 0,
      checkins: 0,
      verified: false,
      validationCount: 1,
      testCount: 1,
      lastValidated: experienceDateToISO(safeData.experienceDate),
      lastTested: experienceDateToISO(safeData.experienceDate),
      lastValidatedBy: user?.displayName || user?.email?.split('@')[0] || 'Anonyme',
      lastTestedBy: user?.displayName || user?.email?.split('@')[0] || 'Anonyme',
      // GPS verification at creation
      ...(spotData.gpsVerified ? {
        lastGpsVerified: new Date().toISOString(),
        lastGpsVerifiedBy: user?.displayName || user?.email?.split('@')[0] || 'Anonyme',
        lastGpsDistance: spotData.gpsDistance || 0,
      } : {}),
    }));
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
    // Filter to allowed fields only (same pattern as addSpot)
    const safeUpdates = {}
    for (const key of SPOT_ALLOWED_FIELDS) {
      if (updates[key] !== undefined) safeUpdates[key] = updates[key]
    }
    // Also allow counter/meta fields that authenticated users can update
    const COUNTER_FIELDS = [
      'validationCount', 'testCount', 'averageRating', 'totalRatings',
      'totalReviews', 'checkins', 'verified', 'reports',
      'lastValidatedAt', 'lastTestedAt', 'lastValidated', 'lastTested',
      'lastValidatedBy', 'lastTestedBy', 'userValidations',
      'streetViewVerified', 'streetViewVerifiedBy', 'streetViewVerifiedAt',
    ]
    for (const key of COUNTER_FIELDS) {
      if (updates[key] !== undefined) safeUpdates[key] = updates[key]
    }
    const spotRef = doc(db, 'spots', spotId);
    await withRetry(() => updateDoc(spotRef, {
      ...safeUpdates,
      updatedAt: serverTimestamp()
    }));
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

    // Re-check auth right before write (prevent race condition)
    const freshUser = getCurrentUser()
    if (!freshUser) return { success: false, error: 'auth_expired' }

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
    if (!checkWriteRateLimit('addReview', 10).allowed) {
      return { success: false, error: 'rate_limit_exceeded' }
    }
    // Profanity check on review text
    if (containsProfanity(reviewData.text || reviewData.comment)) {
      return { success: false, error: 'profanity_detected' }
    }
    const user = getCurrentUser();
    const REVIEW_ALLOWED_FIELDS = ['text', 'rating', 'comment', 'safety', 'traffic', 'accessibility', 'waitTime', 'photos']
    const safeReviewData = {}
    for (const key of REVIEW_ALLOWED_FIELDS) {
      if (reviewData[key] !== undefined) safeReviewData[key] = reviewData[key]
    }
    const reviewsRef = collection(db, 'spots', spotId, 'reviews');
    await withRetry(() => addDoc(reviewsRef, {
      ...safeReviewData,
      userId: user?.uid || 'anonymous',
      userName: user?.displayName || 'Anonyme',
      createdAt: serverTimestamp()
    }));
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

// ==================== STORAGE ====================

/**
 * Upload image to Firebase Storage
 */
export async function uploadImage(base64Data, path) {
  try {
    const storageRef = ref(storage, path);
    // Convert base64 data URL to Blob for more efficient upload (less memory than base64 string)
    const response = await fetch(base64Data);
    const blob = await response.blob();
    const snapshot = await uploadBytes(storageRef, blob);
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
 * Check if text contains profanity. Used for usernames, spot names, reviews, messages.
 * @param {string} text
 * @returns {boolean} true if profanity detected
 */
export function containsProfanity(text) {
  if (!text) return false
  const lower = text.toLowerCase().replace(/[._\-\s]/g, '')
  return PROFANITY_LIST.some(w => lower.includes(w))
}

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

    // Use a transaction for atomic check + claim (prevents race conditions)
    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(docRef)

      if (snapshot.exists()) {
        // Already taken
        if (snapshot.data().uid === uid) return // Same user re-claiming — no-op
        throw new Error('taken')
      }

      transaction.set(docRef, {
        uid,
        username: u,
        createdAt: serverTimestamp(),
      })
    })

    // Also update the user's profile with the username (outside transaction — non-critical)
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, { username: u }).catch(async () => {
      // Profile may not exist yet — create it
      await setDoc(userRef, { username: u }, { merge: true })
    })

    return { success: true }
  } catch (error) {
    if (error.message === 'taken') return { success: false, error: 'taken' }
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
export async function quickValidateSpot(spotId, options = {}) {
  try {
    const user = getCurrentUser()
    if (!user) return { success: false, error: 'not_authenticated' }

    const sid = String(spotId)
    const spotRef = doc(db, 'spots', sid)
    const { increment } = await import('firebase/firestore')
    const userName = user.displayName || user.email?.split('@')[0] || 'Anonyme'

    // Ensure spot document exists (re-check auth before write)
    try {
      if (!getCurrentUser()) return { success: false, error: 'auth_expired' }
      const spotSnap = await getDoc(spotRef)
      if (!spotSnap.exists()) {
        await setDoc(spotRef, { createdAt: serverTimestamp(), validationCount: 0 })
      }
    } catch (e) { console.warn('[firebase] non-blocking error:', e?.code || e?.message) }

    // Build update — include GPS verification if available
    const update = {
      validationCount: increment(1),
      lastValidated: new Date().toISOString(),
      lastValidatedBy: userName,
    }
    if (options.gpsVerified) {
      update.lastGpsVerified = new Date().toISOString()
      update.lastGpsVerifiedBy = userName
      update.lastGpsDistance = options.gpsDistance || 0
    }

    try {
      await updateDoc(spotRef, update)
    } catch {
      try {
        await setDoc(spotRef, {
          validationCount: 1,
          lastValidated: new Date().toISOString(),
          lastValidatedBy: userName,
        }, { merge: true })
      } catch (e) { console.warn('[firebase] non-blocking error:', e?.code || e?.message) }
    }

    // Log the validation
    const validationsRef = collection(db, 'spots', sid, 'validations')
    await addDoc(validationsRef, {
      type: 'quick_validate',
      userId: user.uid,
      userName,
      createdAt: serverTimestamp(),
      gpsVerified: !!options.gpsVerified,
      gpsDistance: options.gpsDistance || null,
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
// saveSpotToFirebase removed — use addSpot() instead (same validation + rate limiting)

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
    // Convert base64 data URL to Blob for more efficient upload (less memory than base64 string)
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const snapshot = await uploadBytes(storageRef, blob);
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
      lastValidatedBy: user?.displayName || user?.email?.split('@')[0] || 'Anonyme',
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
    if (!checkWriteRateLimit('addValidation', 20).allowed) {
      return { success: false, error: 'rate_limit_exceeded' }
    }
    const user = getCurrentUser()
    const spotId = String(data.spotId)

    // Ensure the spot document exists in Firestore
    const spotRef = doc(db, 'spots', spotId)
    const { increment } = await import('firebase/firestore')
    try {
      const spotSnap = await getDoc(spotRef)
      if (!spotSnap.exists()) {
        await setDoc(spotRef, {
          createdAt: serverTimestamp(),
          testCount: 0,
          checkins: 0,
          validationCount: 0,
        })
      }
    } catch (e) { console.warn('[firebase] non-blocking error:', e?.code || e?.message) }

    // Add validation to subcollection
    const validationsRef = collection(db, 'spots', spotId, 'validations')
    await withRetry(() => addDoc(validationsRef, {
      ...data,
      userId: user?.uid || 'anonymous',
      userName: user?.displayName || 'Anonyme',
      createdAt: serverTimestamp(),
    }))

    // Update spot stats — increment testCount (full experience) + checkins
    const expISO = experienceDateToISO(data.experienceDate)
    const expDate = expISO.split('T')[0]
    const userName = user?.displayName || user?.email?.split('@')[0] || 'Anonyme'
    const update = {
      testCount: increment(1),
      checkins: increment(1),
    }
    // Only update lastTested if this experience is more recent than the existing one
    let shouldUpdateDate = true
    try {
      const spotSnap = await getDoc(spotRef)
      if (spotSnap.exists()) {
        const currentLast = spotSnap.data().lastTested
        if (currentLast && new Date(expISO) < new Date(currentLast)) {
          shouldUpdateDate = false
        }
      }
    } catch (e) { console.warn('[firebase] non-blocking error:', e?.code || e?.message) }
    if (shouldUpdateDate) {
      update.lastTested = expISO
      update.lastTestedBy = userName
      update.lastUsed = expDate
    }
    // GPS verification badge on the spot
    if (data.gpsVerified) {
      update.lastGpsVerified = new Date().toISOString()
      update.lastGpsVerifiedBy = userName
      update.lastGpsDistance = data.gpsDistance || 0
    }
    try {
      await updateDoc(spotRef, update)
    } catch {
      try {
        await setDoc(spotRef, {
          testCount: 1,
          checkins: 1,
          lastTested: expISO,
          lastTestedBy: userName,
        }, { merge: true })
      } catch (e) { console.warn('[firebase] non-blocking error:', e?.code || e?.message) }
    }

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
    if (!user) throw new Error('Not authenticated')
    // Write to 'validations' subcollection (same collection spotLiveData reads from)
    const validationsRef = collection(db, 'spots', comment.spotId, 'validations');

    // Check for duplicate review by this user
    const { query: fbQuery, where, getDocs: fbGetDocs } = await import('firebase/firestore')
    const dupQ = fbQuery(validationsRef, where('userId', '==', user.uid))
    const dupSnap = await fbGetDocs(dupQ)
    const hasTextReview = dupSnap.docs.some(d => d.data().text?.length > 0)
    if (hasTextReview) {
      return { success: false, error: 'duplicate', message: 'Already reviewed' }
    }

    const commentData = {
      text: comment.text,
      rating: comment.rating || null,
      safety: comment.rating || null,
      userId: user.uid,
      userName: user.displayName || 'Anonyme',
      userAvatar: user.photoURL || 'thumbs-up',
      type: 'review',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(validationsRef, commentData);

    // Update spot review count
    const spotRef = doc(db, 'spots', comment.spotId);
    const { increment } = await import('firebase/firestore');
    await updateDoc(spotRef, {
      totalReviews: increment(1),
    }).catch(() => {})

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving comment:', error);
    return { success: false, error: error.message || error };
  }
}

/**
 * Report a spot
 * @param {string} spotId - Spot ID
 * @param {string} reason - Report reason
 * @param {string} details - Additional details
 */
export async function reportSpot(
  spotId,
  reason,
  details = '',
  suggestedCoords = null,
) {
  try {
    const user = getCurrentUser()
    const reportsRef = collection(db, 'reports')

    const reportData = {
      type: 'spot',
      spotId,
      targetId: spotId,
      reason,
      description:
        typeof details === 'string' ? details : (details.description || ''),
      reporterId: user?.uid || 'anonymous',
      reporterName: user?.displayName || 'Anonyme',
      status: 'pending',
      createdAt: serverTimestamp(),
    }

    // Include suggested coordinates for misplaced reports
    if (suggestedCoords) {
      reportData.suggestedLat = suggestedCoords.lat
      reportData.suggestedLng = suggestedCoords.lng
    }

    await addDoc(reportsRef, reportData)

    // Increment spot report count
    const spotRef = doc(db, 'spots', spotId)
    await updateDoc(spotRef, {
      reports: increment(1),
    })

    return { success: true }
  } catch (error) {
    console.error('Error reporting spot:', error)
    return { success: false, error }
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
const PROFILE_ALLOWED_FIELDS = [
  'username', 'displayName', 'firstName', 'lastName', 'birthYear', 'gender',
  'bio', 'avatar', 'photoURL', 'profilePhotos', 'languages', 'socialLinks', 'photos',
  'country', 'title', 'equippedBadge', 'equippedFrame', 'equippedTitle',
  // points, seasonPoints, level, badges, league, isVIP → server-only (prevent client manipulation)
  'theme', 'lang', 'lastSeen',
  'deletionScheduledAt', 'deletionRequested',
]

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

    // First name + last name
    if (p.firstName || p.lastName) {
      try {
        const { setState } = await import('../stores/state.js')
        setState({
          ...(p.firstName ? { firstName: p.firstName } : {}),
          ...(p.lastName ? { lastName: p.lastName } : {}),
          ...(p.username ? { username: p.username } : {}),
          ...(p.birthYear ? { birthYear: p.birthYear } : {}),
          ...(p.gender ? { gender: p.gender } : {}),
        })
      } catch { /* state not available */ }
    }

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
 * Delete all user data from Firestore (GDPR compliant)
 * Best-effort: continues on individual failures, logs count of deleted docs
 * @param {string} userId - User ID
 */
async function deleteUserData(userId) {
  let totalDeleted = 0

  // Helper: delete all docs in a subcollection under users/{uid}
  async function deleteSubcollection(subName) {
    try {
      const snap = await getDocs(collection(db, 'users', userId, subName))
      const batch = writeBatch(db)
      snap.docs.forEach((d) => batch.delete(d.ref))
      if (snap.size > 0) {
        await batch.commit()
        totalDeleted += snap.size
      }
    } catch (err) {
      console.error(`deleteUserData: failed to delete subcollection ${subName}:`, err)
    }
  }

  // Helper: delete docs in a top-level collection matching a field
  async function deleteByField(collectionName, fieldName, value) {
    try {
      const snap = await getDocs(
        query(collection(db, collectionName), where(fieldName, '==', value))
      )
      const batch = writeBatch(db)
      snap.docs.forEach((d) => batch.delete(d.ref))
      if (snap.size > 0) {
        await batch.commit()
        totalDeleted += snap.size
      }
    } catch (err) {
      console.error(`deleteUserData: failed to delete from ${collectionName}:`, err)
    }
  }

  try {
    // 1. Delete user profile document
    try {
      await deleteDoc(doc(db, 'users', userId))
      totalDeleted += 1
    } catch (err) {
      console.error('deleteUserData: failed to delete user profile:', err)
    }

    // 2. Delete subcollections under users/{uid}
    const subcollections = [
      'friends',
      'friendRequests',
      'favorites',
      'trips',
      'syncData',
      'fcmTokens',
      'guideVotes',
    ]
    await Promise.all(subcollections.map((sub) => deleteSubcollection(sub)))

    // 3. Delete username reservation(s)
    try {
      const usernameSnap = await getDocs(
        query(collection(db, 'usernames'), where('uid', '==', userId))
      )
      const batch = writeBatch(db)
      usernameSnap.docs.forEach((d) => batch.delete(d.ref))
      if (usernameSnap.size > 0) {
        await batch.commit()
        totalDeleted += usernameSnap.size
      }
    } catch (err) {
      console.error('deleteUserData: failed to delete username reservations:', err)
    }

    // 4. Delete user's spots
    await deleteByField('spots', 'creatorId', userId)

    // 5. Delete from top-level collections with userId field
    const userIdCollections = [
      'roadmap_votes',
      'roadmap_comments',
      'featureUserVotes',
      'featureOpinions',
      'guideTips',
      'id_verifications',
      'feedback',
    ]
    await Promise.all(userIdCollections.map((c) => deleteByField(c, 'userId', userId)))

    // 6. Delete reports filed by user
    await deleteByField('reports', 'reporterUid', userId)

    // 6b. Delete hostel recommendations by user
    await deleteByField('hostel_recs', 'userId', userId)

    // 6c. Delete guide reports by user
    await deleteByField('guide_reports', 'userId', userId)

    // 6d. Delete top-level guideVotes by user
    await deleteByField('guideVotes', 'oddsUserId', userId)

    // 6e. Delete userReviews: reviews OF this user + reviews BY this user
    try {
      // Delete the entire reviews subcollection for reviews OF this user
      const reviewsOfUser = await getDocs(collection(db, 'userReviews', userId, 'reviews'))
      if (reviewsOfUser.size > 0) {
        const batch = writeBatch(db)
        reviewsOfUser.docs.forEach((d) => batch.delete(d.ref))
        await batch.commit()
        totalDeleted += reviewsOfUser.size
      }
      // Delete the parent doc
      await deleteDoc(doc(db, 'userReviews', userId)).catch(() => {})
    } catch (err) {
      console.error('deleteUserData: failed to delete userReviews:', err)
    }

    // 7. Handle directMessages conversations
    try {
      const dmSnap = await getDocs(
        query(
          collection(db, 'directMessages'),
          where('participants', 'array-contains', userId)
        )
      )
      for (const dmDoc of dmSnap.docs) {
        try {
          const data = dmDoc.data()
          const participants = data.participants || []
          if (participants.length <= 2) {
            // 2-person conversation: delete entirely
            await deleteDoc(dmDoc.ref)
            totalDeleted += 1
          } else {
            // Multi-participant: remove user from participants
            await updateDoc(dmDoc.ref, {
              participants: arrayRemove(userId),
            })
          }
        } catch (err) {
          console.error('deleteUserData: failed to handle DM conversation:', err)
        }
      }
    } catch (err) {
      console.error('deleteUserData: failed to query directMessages:', err)
    }

    // 8. Handle groupConversations (remove user from members, delete if creator)
    try {
      const gcSnap = await getDocs(
        query(
          collection(db, 'groupConversations'),
          where('members', 'array-contains', userId)
        )
      )
      for (const gcDoc of gcSnap.docs) {
        try {
          const data = gcDoc.data()
          if (data.creator === userId) {
            // User created this group — delete it
            await deleteDoc(gcDoc.ref)
            totalDeleted += 1
          } else {
            // Remove user from members
            await updateDoc(gcDoc.ref, {
              members: arrayRemove(userId),
            })
          }
        } catch (err) {
          console.error('deleteUserData: failed to handle group conversation:', err)
        }
      }
    } catch (err) {
      console.error('deleteUserData: failed to query groupConversations:', err)
    }

    console.log(`deleteUserData: deleted ${totalDeleted} documents for user ${userId}`)
    return { success: true, deletedCount: totalDeleted }
  } catch (error) {
    console.error('Error deleting user data:', error)
    console.log(`deleteUserData: deleted ${totalDeleted} documents before failure for user ${userId}`)
    return { success: false, error, deletedCount: totalDeleted }
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
    ref, uploadString, uploadBytes, getDownloadURL,
    uploadImage, uploadPhotoToFirebase,
  }
}
