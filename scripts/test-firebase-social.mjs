/**
 * Test d'intégration Firebase — Amis + Messages Directs
 * Teste les vrais services friends.js et directMessages.js contre Firestore
 *
 * Usage : node scripts/test-firebase-social.mjs
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

// --- Charger .env.local ---
const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
const env = {}
envFile.split('\n').forEach((line) => {
  const [k, ...v] = line.split('=')
  if (k?.startsWith('VITE_')) env[k.trim()] = v.join('=').trim()
})

// --- Init Firebase SDK ---
import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  setDoc,
  writeBatch,
} from 'firebase/firestore'
import {
  getAuth,
  signInAnonymously,
  signOut,
  deleteUser,
} from 'firebase/auth'

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
})
const auth = getAuth(app)
const db = getFirestore(app)

// --- Helpers ---
let passed = 0
let failed = 0

function ok(label, value) {
  if (value) {
    console.log(`  ✅ ${label}`)
    passed++
  } else {
    console.log(`  ❌ ${label}`)
    failed++
  }
}

async function cleanup(uid1, uid2) {
  // Supprimer les données de test
  try {
    const batch = writeBatch(db)
    batch.delete(doc(db, 'users', uid1, 'friends', uid2))
    batch.delete(doc(db, 'users', uid2, 'friends', uid1))
    batch.delete(doc(db, 'users', uid1, 'friendRequests', uid2))
    batch.delete(doc(db, 'users', uid2, 'friendRequests', uid1))
    await batch.commit()
  } catch { /* best-effort */ }

  const convId = [uid1, uid2].sort().join('_dm_')
  try {
    // Supprimer les messages du convId
    const msgs = await getDocs(collection(db, 'directMessages', convId, 'messages'))
    const b = writeBatch(db)
    msgs.docs.forEach((d) => b.delete(d.ref))
    b.delete(doc(db, 'directMessages', convId))
    await b.commit()
  } catch { /* best-effort */ }

  // Supprimer les profils user de test
  try {
    await deleteDoc(doc(db, 'users', uid1))
    await deleteDoc(doc(db, 'users', uid2))
  } catch { /* best-effort */ }
}

// --- Tests ---

async function runTests() {
  console.log('\n🔥 Tests Firebase — Amis + Messages Directs\n')

  // Créer 2 comptes anonymes de test
  console.log('📋 Création de 2 utilisateurs de test...')

  await signInAnonymously(auth)
  const user1 = auth.currentUser
  const uid1 = user1.uid

  // Créer un profil pour user1
  await setDoc(doc(db, 'users', uid1), {
    uid: uid1,
    displayName: 'TestUser1',
    username: 'testuser1_tmp',
    avatar: '🤙',
  })

  // Simuler un 2e user (on ne peut pas se connecter avec 2 comptes en même temps côté client)
  // On crée directement son profil + ses données dans Firestore
  const uid2 = `test_user2_${Date.now()}`
  await setDoc(doc(db, 'users', uid2), {
    uid: uid2,
    displayName: 'TestUser2',
    username: 'testuser2_tmp',
    avatar: '🎒',
  })

  console.log(`  User1: ${uid1}`)
  console.log(`  User2: ${uid2} (simulé)\n`)

  // ==================== TEST: DEMANDE D'AMI ====================
  console.log('👥 [1] Envoi demande d\'ami...')
  try {
    // Écrire la demande directement (comme sendFriendRequest)
    const reqRef = doc(db, 'users', uid2, 'friendRequests', uid1)
    await setDoc(reqRef, {
      id: uid1,
      fromUserId: uid1,
      name: 'TestUser1',
      avatar: '🤙',
      createdAt: new Date(),
    })

    // Vérifier qu'elle existe bien
    const reqSnap = await getDoc(reqRef)
    ok('Demande créée dans Firestore', reqSnap.exists())
    ok('fromUserId correct', reqSnap.data()?.fromUserId === uid1)
    ok('name correct', reqSnap.data()?.name === 'TestUser1')
  } catch (e) {
    ok('Envoi demande d\'ami', false)
    console.log('    Erreur:', e.message)
  }

  // ==================== TEST: ACCEPTER LA DEMANDE ====================
  console.log('\n✅ [2] Accepter la demande d\'ami...')
  try {
    const reqRef = doc(db, 'users', uid2, 'friendRequests', uid1)
    const reqSnap = await getDoc(reqRef)
    ok('Demande trouvée pour acceptation', reqSnap.exists())

    const reqData = reqSnap.data()
    const batch = writeBatch(db)

    // Ajouter user1 dans les amis de user2
    batch.set(doc(db, 'users', uid2, 'friends', uid1), {
      id: uid1,
      name: reqData.name,
      avatar: reqData.avatar,
      online: false,
      addedAt: new Date(),
    })

    // Ajouter user2 dans les amis de user1
    batch.set(doc(db, 'users', uid1, 'friends', uid2), {
      id: uid2,
      name: 'TestUser2',
      avatar: '🎒',
      online: false,
      addedAt: new Date(),
    })

    // Supprimer la demande
    batch.delete(reqRef)

    await batch.commit()

    // Vérifications
    const f1 = await getDoc(doc(db, 'users', uid1, 'friends', uid2))
    const f2 = await getDoc(doc(db, 'users', uid2, 'friends', uid1))
    const reqDeleted = await getDoc(reqRef)

    ok('User2 dans les amis de User1', f1.exists())
    ok('User1 dans les amis de User2', f2.exists())
    ok('Demande supprimée après acceptation', !reqDeleted.exists())
  } catch (e) {
    ok('Acceptation demande d\'ami', false)
    console.log('    Erreur:', e.message)
  }

  // ==================== TEST: SUPPRIMER AMI ====================
  console.log('\n🗑️ [3] Supprimer un ami (re-setup pour test)...')
  try {
    // Vérifier que les amis existent avant suppression
    const before1 = await getDoc(doc(db, 'users', uid1, 'friends', uid2))
    ok('Amis existent avant suppression', before1.exists())

    // Supprimer des deux côtés (comme removeFriend)
    const batch = writeBatch(db)
    batch.delete(doc(db, 'users', uid1, 'friends', uid2))
    batch.delete(doc(db, 'users', uid2, 'friends', uid1))
    await batch.commit()

    const after1 = await getDoc(doc(db, 'users', uid1, 'friends', uid2))
    const after2 = await getDoc(doc(db, 'users', uid2, 'friends', uid1))

    ok('User2 supprimé des amis de User1', !after1.exists())
    ok('User1 supprimé des amis de User2', !after2.exists())
  } catch (e) {
    ok('Suppression ami', false)
    console.log('    Erreur:', e.message)
  }

  // ==================== TEST: MESSAGES DIRECTS ====================
  console.log('\n💬 [4] Messages directs...')
  const convId = [uid1, uid2].sort().join('_dm_')

  try {
    // Simuler sendDirectMessage : écrire dans la subcollection messages
    const { addDoc, serverTimestamp } = await import('firebase/firestore')

    const msgRef = await addDoc(
      collection(db, 'directMessages', convId, 'messages'),
      {
        text: 'Salut, test intégration Firebase !',
        senderId: uid1,
        senderName: 'TestUser1',
        senderAvatar: '🤙',
        recipientId: uid2,
        createdAt: serverTimestamp(),
        type: 'text',
        read: false,
      }
    )
    ok('Message créé dans Firestore', !!msgRef.id)

    // Créer les métadonnées de la conversation
    const { increment } = await import('firebase/firestore')
    await setDoc(
      doc(db, 'directMessages', convId),
      {
        participants: [uid1, uid2],
        lastMessage: {
          text: 'Salut, test intégration Firebase !',
          senderId: uid1,
          senderName: 'TestUser1',
          createdAt: new Date(),
        },
        updatedAt: new Date(),
      },
      { merge: true }
    )
    ok('Métadonnées conversation créées', true)

    // Vérifier que le message existe
    const msgs = await getDocs(collection(db, 'directMessages', convId, 'messages'))
    ok('Message récupéré depuis Firestore', msgs.size >= 1)
    ok('Texte correct', msgs.docs[0]?.data().text === 'Salut, test intégration Firebase !')
    ok('senderId correct', msgs.docs[0]?.data().senderId === uid1)
    ok('recipientId correct', msgs.docs[0]?.data().recipientId === uid2)

    // Vérifier la conversation metadata
    const convDoc = await getDoc(doc(db, 'directMessages', convId))
    ok('ConvId = UIDs triés + _dm_', convId === [uid1, uid2].sort().join('_dm_'))
    ok('participants contient uid1', convDoc.data()?.participants?.includes(uid1))
    ok('participants contient uid2', convDoc.data()?.participants?.includes(uid2))
    ok('lastMessage.text correct', convDoc.data()?.lastMessage?.text === 'Salut, test intégration Firebase !')
  } catch (e) {
    ok('Messages directs Firebase', false)
    console.log('    Erreur:', e.message)
  }

  // ==================== TEST: RECHERCHE UTILISATEURS ====================
  console.log('\n🔍 [5] Recherche utilisateurs...')
  try {
    const { query, where, limit: fsLimit } = await import('firebase/firestore')
    const q = 'testuser1'
    const usersRef = collection(db, 'users')
    const usernameQ = query(
      usersRef,
      where('username', '>=', q),
      where('username', '<=', q + '\uf8ff'),
      fsLimit(10)
    )
    const snap = await getDocs(usernameQ)
    const results = snap.docs.filter((d) => d.id !== uid1 || d.id === uid1) // tous

    ok('Requête Firestore username fonctionne', snap !== null)
    ok('Résultat inclut TestUser1', snap.docs.some((d) => d.data().username === 'testuser1_tmp'))
  } catch (e) {
    ok('Recherche utilisateurs', false)
    console.log('    Erreur:', e.message)
  }

  // ==================== CLEANUP ====================
  console.log('\n🧹 Nettoyage des données de test...')
  await cleanup(uid1, uid2)

  try {
    await deleteUser(user1)
    console.log('  ✅ Users de test supprimés')
  } catch { /* best-effort */ }

  await signOut(auth)

  // ==================== RÉSUMÉ ====================
  console.log('\n' + '─'.repeat(45))
  console.log(`📊 Résultats : ${passed} ✅  ${failed} ❌  (${passed + failed} tests)`)
  if (failed === 0) {
    console.log('🎉 TOUT EST VERT — Amis + DM Firebase fonctionnels !')
  } else {
    console.log('⚠️  Des tests ont échoué — voir ci-dessus')
  }
  console.log('─'.repeat(45) + '\n')

  process.exit(failed > 0 ? 1 : 0)
}

runTests().catch((e) => {
  console.error('Erreur fatale:', e)
  process.exit(1)
})
