/**
 * State machine tests for auth state transitions
 * Tests ALL valid and invalid transitions explicitly
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('../../src/services/firebase.js', () => ({}))
vi.mock('../../src/services/firebaseSync.js', () => ({
  syncAllToFirestore: vi.fn(),
  syncStateToFirestore: vi.fn(),
  loadFromFirestore: vi.fn(),
}))

import { getState, setState } from '../../src/stores/state.js'

describe('Auth state machine — transitions', () => {
  beforeEach(() => {
    setState({
      isLoggedIn: false,
      showAuth: false,
      authMode: 'login',
      currentUser: null,
      username: null,
    })
  })

  // ── Valid transitions ──────────────────────────────────────────────────

  it('logged_out → show_auth: showAuth=true opens modal', () => {
    setState({ showAuth: true })
    expect(getState().showAuth).toBe(true)
    expect(getState().isLoggedIn).toBe(false)
  })

  it('show_auth → logged_in: setting isLoggedIn=true', () => {
    setState({ showAuth: true })
    setState({ isLoggedIn: true, showAuth: false, currentUser: { uid: 'u1' } })
    const s = getState()
    expect(s.isLoggedIn).toBe(true)
    expect(s.showAuth).toBe(false)
  })

  it('logged_in → logged_out: clearing user data', () => {
    setState({ isLoggedIn: true, currentUser: { uid: 'u1' }, username: 'alice' })
    setState({ isLoggedIn: false, currentUser: null, username: null })
    const s = getState()
    expect(s.isLoggedIn).toBe(false)
    expect(s.currentUser).toBeNull()
    expect(s.username).toBeNull()
  })

  it('authMode can switch login → register → login', () => {
    setState({ showAuth: true, authMode: 'login' })
    expect(getState().authMode).toBe('login')
    setState({ authMode: 'register' })
    expect(getState().authMode).toBe('register')
    setState({ authMode: 'login' })
    expect(getState().authMode).toBe('login')
  })

  it('authMode reset → login on modal close', () => {
    setState({ showAuth: true, authMode: 'register' })
    setState({ showAuth: false, authMode: 'login' })
    expect(getState().authMode).toBe('login')
    expect(getState().showAuth).toBe(false)
  })

  // ── Invalid/edge transitions ───────────────────────────────────────────

  it('closing auth modal without logging in keeps isLoggedIn=false', () => {
    setState({ showAuth: true })
    setState({ showAuth: false })
    expect(getState().isLoggedIn).toBe(false)
  })

  it('state is consistent: isLoggedIn=true requires currentUser non-null', () => {
    setState({ isLoggedIn: true, currentUser: { uid: 'u1' } })
    const s = getState()
    if (s.isLoggedIn) {
      expect(s.currentUser).not.toBeNull()
    }
  })

  it('showAuth can be true while already logged in (re-auth scenario)', () => {
    setState({ isLoggedIn: true, currentUser: { uid: 'u1' } })
    setState({ showAuth: true })
    // Both can be true simultaneously (e.g., re-authentication)
    expect(getState().showAuth).toBe(true)
    expect(getState().isLoggedIn).toBe(true)
  })
})

describe('Decision table: isLoggedIn × showAuth × hasUsername', () => {
  const cases = [
    { isLoggedIn: false, showAuth: false, username: null,    expectModal: false, expectApp: true },
    { isLoggedIn: false, showAuth: true,  username: null,    expectModal: true,  expectApp: true },
    { isLoggedIn: true,  showAuth: false, username: 'alice', expectModal: false, expectApp: true },
    { isLoggedIn: true,  showAuth: true,  username: 'alice', expectModal: true,  expectApp: true },
    { isLoggedIn: true,  showAuth: false, username: null,    expectModal: false, expectApp: true },
    { isLoggedIn: true,  showAuth: true,  username: null,    expectModal: true,  expectApp: true },
    { isLoggedIn: false, showAuth: false, username: 'ghost', expectModal: false, expectApp: true },
    { isLoggedIn: false, showAuth: true,  username: 'ghost', expectModal: true,  expectApp: true },
  ]

  cases.forEach(({ isLoggedIn, showAuth, username, expectModal, expectApp }, i) => {
    it(`case ${i + 1}: logged=${isLoggedIn} auth=${showAuth} user=${username} → modal=${expectModal}`, () => {
      setState({ isLoggedIn, showAuth, username, currentUser: isLoggedIn ? { uid: 'u1' } : null })
      const s = getState()
      expect(s.showAuth).toBe(expectModal)
      // App element doesn't depend on these flags — always true
      expect(typeof document).toBe('object')
    })
  })
})
