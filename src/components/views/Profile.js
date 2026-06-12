/**
 * Profile View Component
 * Instagram-style profile with 3 sub-tabs: Profil, Roadmap, Réglages
 */

import { t } from '../../i18n/index.js'
import './ProfileDemos.js' // Interactive demo overlays for Prochainement features

// ==================== FIRESTORE PROFILE SYNC ====================

/**
 * Sync a subset of profile fields to Firestore (if user is logged in).
 * Silently fails when offline or not authenticated — localStorage is always the fallback.
 * @param {Object} fields - e.g. { bio: '...', socialLinks: {...}, languages: [...] }
 */
async function syncProfileToFirestore(fields) {
 try {
 const { getCurrentUser, updateUserProfile } = await import('../../services/firebase.js')
 const user = getCurrentUser()
 if (user) {
 await updateUserProfile(user.uid, fields)
 }
 } catch (e) { console.warn('[Profile] sync failed:', e?.message) }
}

// ==================== LANGUAGE + COUNTRY MAPS ====================
import { renderProfileSubTabs, renderProfilTab, renderRoadmapTab, renderReglagesTab, renderVersionReset, renderLanguagePickerModal, renderLanguageLevelModal } from './profileRender.js'
export function renderProfile(state) {
 const subTab = state.profileSubTab || 'profil'

 return `
 <div class="flex flex-col min-h-[calc(100vh-140px)] pb-28 overflow-x-hidden">
 ${renderProfileSubTabs(subTab)}
 <div class="p-4 space-y-4 flex-1">
 ${subTab === 'profil' ? renderProfilTab(state) : ''}
 ${subTab === 'progression' ? renderRoadmapTab(state) : ''}
 ${subTab === 'reglages' ? `${renderReglagesTab(state)}${renderVersionReset()}` : ''}
 </div></div>
 ${state.showLanguagePicker ? renderLanguagePickerModal(state) : ''}
 ${state.showLanguageLevelPicker ? renderLanguageLevelModal(state) : ''}
 `
}

// ==================== GLOBAL HANDLERS ====================

window.setProfileSubTab = (tab) => {
 window.setState?.({ profileSubTab: tab })
}

window.toggleSettingsSection = (sectionId) => {
 const state = window.getState?.() || {}
 const current = state.settingsOpenSection
 window.setState?.({ settingsOpenSection: current === sectionId ? null : sectionId })
}

// toggleProfileSection removed — profile info displayed directly, no accordion

// startTutorial is defined in main.js (canonical owner — includes tab change + step action)

// handleLogout — canonical in authIdentity.js (includes subscription cleanup)

// setLanguage is defined in main.js (single source of truth)

// toggleTheme — canonical in main.js (Profile.js is lazy-loaded)

// shareMyProfile — stub if Social.js not yet loaded
if (!window.shareMyProfile) {
 window.shareMyProfile = () => {
  if (navigator.share) {
   navigator.share({ title: 'SpotHitch', url: window.location.href }).catch(() => {})
  } else {
   window.showToast?.(t('shareCopied') || 'Lien copié !', 'success')
  }
 }
}

// --- Change username handler ---
window.openChangeUsername = async () => {
 const { showInputOverlay } = await import('../../utils/inputOverlay.js')
 const { getState, setState } = await import('../../stores/state.js')
 const state = getState()

 // Check cooldown (60 days)
 const lastChange = state.lastUsernameChange || 0
 const cooldownDays = 60
 const elapsed = (Date.now() - lastChange) / (1000 * 60 * 60 * 24)
 if (lastChange && elapsed < cooldownDays) {
  const remaining = Math.ceil(cooldownDays - elapsed)
  window.showToast?.((t('usernameCooldown') || 'Tu pourras changer ton pseudo dans {days} jours').replace('{days}', remaining), 'warning')
  return
 }

 const newPseudo = await showInputOverlay({
  title: t('changeUsername'),
  value: state.username || '',
  placeholder: t('usernamePlaceholder'),
  maxLength: 20,
 })
 if (!newPseudo || newPseudo.trim() === state.username) return
 const pseudo = newPseudo.toLowerCase().trim()

 try {
  const fb = await import('../../services/firebase.js')
  const validation = fb.validateUsername(pseudo)
  if (!validation.valid) {
   window.showToast?.(t(validation.errorKey), 'error')
   return
  }
  const { available } = await fb.checkUsernameAvailability(pseudo)
  if (!available) {
   window.showToast?.(t('usernameTaken'), 'error')
   return
  }
  const user = fb.getCurrentUser()
  if (!user) return
  await fb.reserveUsername(pseudo, user.uid)
  setState({ username: pseudo, lastUsernameChange: Date.now() })
  syncProfileToFirestore({ username: pseudo })
  window.showToast?.(t('profileSaved'), 'success')
  window._forceRender?.()
 } catch (err) {
  window.showToast?.(t('usernameError') || 'Erreur', 'error')
 }
}

// --- Social links edit handler ---
window.editSocialLinks = async () => {
 const { showInputOverlay } = await import('../../utils/inputOverlay.js')
 const current = JSON.parse(localStorage.getItem('spothitch_social_links') || '{}')
 const networks = ['Instagram', 'TikTok', 'Snapchat', 'Twitter/X']
 for (const net of networks) {
  const val = await showInputOverlay({
   title: net,
   value: current[net] || '',
   placeholder: `@${t('yourUsername') || 'ton pseudo'} ${net}`,
   maxLength: 50,
  })
  if (val === null) break // cancelled
  if (val.trim()) current[net] = val.trim()
  else delete current[net]
 }
 localStorage.setItem('spothitch_social_links', JSON.stringify(current))
 syncProfileToFirestore({ socialLinks: current })
 window.showToast?.(t('profileSaved'), 'success')
 window._forceRender?.()
}

// --- Load reviews count from Firestore ---
window._loadMyReviewsCount = async () => {
 try {
  const fb = await import('../../services/firebase.js')
  const user = fb.getCurrentUser()
  if (!user) return
  const { collection, getDocs, query, where } = await import('firebase/firestore')
  const db = fb.getDb()
  if (!db) return
  const q = query(collection(db, 'reviews'), where('authorId', '==', user.uid))
  const snap = await getDocs(q)
  const { setState } = await import('../../stores/state.js')
  setState({ myReviewsCount: snap.size })
 } catch { /* offline */ }
}
// Auto-load on profile tab
setTimeout(() => window._loadMyReviewsCount?.(), 2000)

window.toggleNotifications = () => {
 const state = window.getState?.() || {}
 window.setState?.({ notifications: state.notifications === false ? true : false })
 window.showToast?.(
 state.notifications === false ? (t('notificationsEnabled') || 'Notifications activées') : (t('notificationsDisabled') || 'Notifications désactivées'),
 'info'
 )
}

window.toggleProximityAlertsSetting = () => {
 /* not yet implemented */
}

window.openComingSoonProximity = () => {
 /* not yet implemented */
}

window.closeComingSoonProximity = () => {
 // No-op, kept for backward compat
}

window.editAvatar = () => {
 window.setState?.({ showWelcome: true })
}

// --- Account management handlers ---
window.openEditName = async () => {
 const { showInputOverlay } = await import('../../utils/inputOverlay.js')
 const { getState, setState } = await import('../../stores/state.js')
 const state = getState()
 const currentFirst = state.firstName || state.user?.displayName?.split(' ')[0] || ''
 const currentLast = state.lastName || ''
 const newFirst = await showInputOverlay({
  title: t('firstName'),
  value: currentFirst,
  placeholder: t('firstNamePlaceholder'),
  maxLength: 30,
 })
 if (newFirst === null) return
 const newLast = await showInputOverlay({
  title: t('lastName'),
  value: currentLast,
  placeholder: t('lastNamePlaceholder'),
  maxLength: 30,
 })
 if (newLast === null) return
 const first = newFirst.trim()
 const last = newLast.trim()
 if (first.length < 2 || last.length < 2) {
  window.showToast?.(t('firstNameRequired'), 'error')
  return
 }
 setState({ firstName: first, lastName: last })
 syncProfileToFirestore({ firstName: first, lastName: last, displayName: `${first} ${last.charAt(0)}.` })
 window.showToast?.(t('nameUpdated'), 'success')
 window._forceRender?.()
}

window.openChangePassword = async () => {
 const { showInputOverlay } = await import('../../utils/inputOverlay.js')
 const currentPwd = await showInputOverlay({
  title: t('currentPassword'),
  placeholder: '...',
  type: 'password',
 })
 if (!currentPwd) return
 const newPwd = await showInputOverlay({
  title: t('newPassword'),
  placeholder: t('passwordRules'),
  type: 'password',
 })
 if (!newPwd) return
 if (!/[A-Z]/.test(newPwd) || !/\d/.test(newPwd) || newPwd.length < 6) {
  window.showToast?.(t('passwordRequirementsError'), 'error')
  return
 }
 const confirmPwd = await showInputOverlay({
  title: t('confirmNewPassword'),
  placeholder: '...',
  type: 'password',
 })
 if (newPwd !== confirmPwd) {
  window.showToast?.(t('passwordMismatch'), 'error')
  return
 }
 try {
  const fb = await import('../../services/firebase.js')
  const user = fb.getCurrentUser()
  if (!user) return
  // Re-authenticate then update
  const { EmailAuthProvider, reauthenticateWithCredential, updatePassword } = await import('firebase/auth')
  const cred = EmailAuthProvider.credential(user.email, currentPwd)
  await reauthenticateWithCredential(user, cred)
  await updatePassword(user, newPwd)
  window.showToast?.(t('passwordChanged'), 'success')
 } catch (err) {
  window.showToast?.(err.code === 'auth/wrong-password' ? t('passwordCurrentWrong') : (t('authError') || 'Error'), 'error')
 }
}

window.openChangeEmail = async () => {
 const { showInputOverlay } = await import('../../utils/inputOverlay.js')
 const newEmail = await showInputOverlay({
  title: t('newEmail'),
  placeholder: 'email@example.com',
  type: 'email',
 })
 if (!newEmail) return
 try {
  const fb = await import('../../services/firebase.js')
  const user = fb.getCurrentUser()
  if (!user) return
  const { verifyBeforeUpdateEmail } = await import('firebase/auth')
  await verifyBeforeUpdateEmail(user, newEmail)
  window.showToast?.(t('emailChanged'), 'success')
 } catch (err) {
  window.showToast?.(err.message || t('authError'), 'error')
 }
}

window.openEditPersonalInfo = async () => {
 const { showInputOverlay } = await import('../../utils/inputOverlay.js')
 const { getState, setState } = await import('../../stores/state.js')
 const state = getState()

 // Edit birth year
 const newYear = await showInputOverlay({
  title: t('editBirthYear'),
  value: state.birthYear ? String(state.birthYear) : '',
  placeholder: t('birthYearPlaceholder'),
  inputmode: 'numeric',
 })
 if (newYear === null) return
 const year = parseInt(newYear, 10)
 const currentYear = new Date().getFullYear()
 if (!year || year < 1920 || year > currentYear - 16) {
  window.showToast?.(t('birthYearInvalid'), 'error')
  return
 }

 // Edit gender
 const genderOptions = [
  t('genderPreferNotToSay') || 'Prefer not to say',
  t('genderFemale') || 'Female',
  t('genderMale') || 'Male',
  t('genderNonBinary') || 'Non-binary',
 ]
 const genderValues = ['', 'female', 'male', 'non-binary']
 const currentGenderIdx = genderValues.indexOf(state.gender || '')
 const newGender = await showInputOverlay({
  title: t('editGender'),
  value: genderOptions[currentGenderIdx >= 0 ? currentGenderIdx : 0],
  placeholder: t('editGender'),
  options: genderOptions,
 })
 const genderIdx = newGender ? genderOptions.indexOf(newGender) : -1
 const gender = genderIdx >= 0 ? genderValues[genderIdx] : (state.gender || '')

 setState({ birthYear: year, gender })
 syncProfileToFirestore({ birthYear: year, gender })
 window.showToast?.(t('birthYearUpdated'), 'success')
 window._forceRender?.()
}

window.openAppealForm = async () => {
 const { showInputOverlay } = await import('../../utils/inputOverlay.js')
 // Select category
 const categories = [
  t('appealCatSpotRemoved'),
  t('appealCatAccountWarning'),
  t('appealCatAccountSuspended'),
  t('appealCatOther'),
 ]
 const catChoice = await showInputOverlay({
  title: t('appealCategory'),
  value: '',
  placeholder: t('appealCategory'),
  options: categories,
 })
 if (!catChoice) return
 // Get description
 const description = await showInputOverlay({
  title: t('appealDescription'),
  placeholder: t('appealDescription'),
  multiline: true,
  maxLength: 1000,
 })
 if (!description) return
 // Submit to Firestore
 try {
  const fb = await import('../../services/firebase.js')
  fb.initializeFirebase()
  const user = fb.getCurrentUser()
  if (!user) {
   window.showToast?.(t('loginRequired') || 'Connexion requise', 'warning')
   return
  }
  const { doc, setDoc, serverTimestamp, collection } = await import('firebase/firestore')
  const db = fb.getDb()
  if (db) {
   const appealRef = doc(collection(db, 'appeals'))
   await setDoc(appealRef, {
    userId: user.uid,
    userEmail: user.email,
    category: catChoice,
    description: description.trim(),
    status: 'pending',
    createdAt: serverTimestamp(),
   })
  }
  window.showToast?.(t('appealSubmitted'), 'success')
 } catch (err) {
  console.error('Appeal error:', err)
  window.showToast?.(t('authError') || 'Error', 'error')
 }
}

window.openExportData = async () => {
 const { getState } = await import('../../stores/state.js')
 const state = getState()
 const data = {
  profile: {
   firstName: state.firstName,
   lastName: state.lastName,
   email: state.user?.email,
   username: state.username,
   birthYear: state.birthYear,
   gender: state.gender,
   bio: localStorage.getItem('spothitch_bio') || '',
  },
  languages: JSON.parse(localStorage.getItem('spothitch_languages') || '[]'),
  favorites: JSON.parse(localStorage.getItem('spothitch_favorites') || '[]'),
  trips: JSON.parse(localStorage.getItem('spothitch_trip_history') || '[]'),
  checkins: JSON.parse(localStorage.getItem('spothitch_checkin_history') || '[]'),
  exportDate: new Date().toISOString(),
 }
 const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
 const url = URL.createObjectURL(blob)
 const a = document.createElement('a')
 a.href = url
 a.download = `spothitch-data-${new Date().toISOString().split('T')[0]}.json`
 a.click()
 URL.revokeObjectURL(url)
 window.showToast?.(t('dataExportReady'), 'success')
}

// --- Photo management handlers ---
window.openPhotoManager = () => {
 window.addProfilePhoto()
}

window.addProfilePhoto = () => {
 const input = document.createElement('input')
 input.type = 'file'
 input.accept = 'image/*'
 input.capture = 'environment'
 input.onchange = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  try {
   window.showToast?.(t('photoCompressing') || 'Optimisation...', 'info')
   const dataUrl = await compressProfilePhoto(file)
   const { getState, setState } = await import('../../stores/state.js')
   const photos = [...(getState().profilePhotos || [])]
   if (photos.length >= 6) {
    window.showToast?.((t('photoLimit') || 'Maximum {max} photos').replace('{max}', '6'), 'warning')
    return
   }
   photos.push(dataUrl)
   setState({ profilePhotos: photos })
   localStorage.setItem('spothitch_profile_photos', JSON.stringify(photos))
   // Always sync first photo as main profile photo
   syncProfileToFirestore({ profilePhotos: photos, photoURL: photos[0] })
   window.showToast?.(t('photoAdded'), 'success')
   window._forceRender?.()
  } catch (err) {
   window.showToast?.(err.message || 'Error', 'error')
  }
 }
 input.click()
}

window.removeProfilePhoto = async (index) => {
 const { getState, setState } = await import('../../stores/state.js')
 const photos = [...(getState().profilePhotos || [])]
 photos.splice(index, 1)
 setState({ profilePhotos: photos })
 localStorage.setItem('spothitch_profile_photos', JSON.stringify(photos))
 syncProfileToFirestore({ profilePhotos: photos, photoURL: photos[0] || null })
 window.showToast?.(t('photoRemoved'), 'success')
 window._forceRender?.()
}

window.setMainProfilePhoto = async (index) => {
 const { getState, setState } = await import('../../stores/state.js')
 const photos = [...(getState().profilePhotos || [])]
 const [photo] = photos.splice(index, 1)
 photos.unshift(photo)
 setState({ profilePhotos: photos })
 localStorage.setItem('spothitch_profile_photos', JSON.stringify(photos))
 syncProfileToFirestore({ profilePhotos: photos, photoURL: photos[0] })
 window.showToast?.(t('mainPhotoSet'), 'success')
 window._forceRender?.()
}

async function compressProfilePhoto(file) {
 return new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = (e) => {
   const img = new Image()
   img.onload = () => {
    const canvas = document.createElement('canvas')
    const maxSize = 400
    let w = img.width, h = img.height
    if (w > h) { if (w > maxSize) { h = h * maxSize / w; w = maxSize } }
    else { if (h > maxSize) { w = w * maxSize / h; h = maxSize } }
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, w, h)
    resolve(canvas.toDataURL('image/jpeg', 0.7))
   }
   img.onerror = () => reject(new Error('Invalid image'))
   img.src = e.target.result
  }
  reader.onerror = () => reject(new Error('Read error'))
  reader.readAsDataURL(file)
 })
}

window.openBlockedUsers = () => {
 window.setState?.({ showBlockedUsers: true })
}

window.closeBlockedUsers = () => {
 window.setState?.({ showBlockedUsers: false })
}

// --- Bio handlers (#61) ---
window.editBio = async () => {
 const { showInputOverlay } = await import('../../utils/inputOverlay.js')
 const current = localStorage.getItem('spothitch_bio') || ''
 const newBio = await showInputOverlay({
 title: t('editBioTitle') || 'Ta bio',
 subtitle: t('editBioDesc') || 'Présente-toi aux autres voyageurs',
 value: current,
 placeholder: t('bioPlaceholder') || 'Parle de toi en quelques mots...',
 multiline: true,
 maxLength: 200,
 showCharCount: true,
 })
 if (newBio === null) return
 const trimmed = newBio.trim().slice(0, 200)
 localStorage.setItem('spothitch_bio', trimmed)
 const { setState } = await import('../../stores/state.js')
 setState({ bio: trimmed })
 await syncProfileToFirestore({ bio: trimmed })
 window.showToast?.(t('bioSaved') || 'Bio enregistrée !', 'success')
 window._forceRender?.()
}

window.saveBio = async (text) => {
 const trimmed = (text || '').trim().slice(0, 200)
 localStorage.setItem('spothitch_bio', trimmed)
 const { setState } = await import('../../stores/state.js')
 setState({ bio: trimmed })
 await syncProfileToFirestore({ bio: trimmed })
 window.showToast?.(t('bioSaved') || 'Bio enregistrée !', 'success')
 window._forceRender?.()
}
export default { renderProfile }
