import { describe, it, expect } from 'vitest'

import {
  getErrorMessage,
  getFormattedError,
  getErrorType,
  isRecoverableError,
  getRetryMessage,
} from '../../src/utils/errorMessages.js'

describe('errorMessages', () => {
  describe('getErrorMessage', () => {
    it('returns default for null/undefined', () => {
      expect(getErrorMessage(null).message).toBeDefined()
      expect(getErrorMessage(undefined).message).toBeDefined()
    })

    it('returns network message for NETWORK_OFFLINE', () => {
      const msg = getErrorMessage('NETWORK_OFFLINE')
      expect(msg.type).toBe('warning')
      expect(msg.message).toContain('connexion')
    })

    it('returns 404 message for NOT_FOUND', () => {
      const msg = getErrorMessage('NOT_FOUND')
      expect(msg.type).toBe('warning')
    })

    it('returns server message for 500', () => {
      const msg = getErrorMessage('500')
      expect(msg.type).toBe('error')
    })

    it('handles Firebase auth errors', () => {
      expect(getErrorMessage('auth/invalid-email').message).toContain('email')
      expect(getErrorMessage('auth/wrong-password').message).toContain('passe')
      expect(getErrorMessage('auth/user-not-found').message).toContain('compte')
    })

    it('handles partial match for 404 in string', () => {
      const msg = getErrorMessage('HTTP 404 error')
      expect(msg.message).toContain('existe pas')
    })

    it('handles partial match for network errors', () => {
      const msg = getErrorMessage('network disconnected')
      expect(msg.type).toBe('warning')
    })

    it('handles partial match for offline', () => {
      const msg = getErrorMessage('device is offline')
      expect(msg.type).toBe('warning')
    })

    it('returns default for unknown error', () => {
      const msg = getErrorMessage('TOTALLY_UNKNOWN_ERROR_XYZ')
      expect(msg.message).toBeDefined()
      expect(msg.type).toBeDefined()
    })
  })

  describe('getFormattedError', () => {
    it('returns string with message', () => {
      const result = getFormattedError('NETWORK_OFFLINE')
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('getErrorType', () => {
    it('returns warning for network errors', () => {
      expect(getErrorType('NETWORK_OFFLINE')).toBe('warning')
    })

    it('returns error for server errors', () => {
      expect(getErrorType('SERVER_ERROR')).toBe('error')
    })

    it('returns info for popup closed', () => {
      expect(getErrorType('auth/popup-closed-by-user')).toBe('info')
    })
  })

  describe('isRecoverableError', () => {
    it('returns true for network errors', () => {
      expect(isRecoverableError('NETWORK_OFFLINE')).toBe(true)
    })

    it('returns true for auth errors', () => {
      expect(isRecoverableError('auth/wrong-password')).toBe(true)
    })

    it('returns false for disabled account', () => {
      expect(isRecoverableError('auth/user-disabled')).toBe(false)
    })

    it('returns false for operation not allowed', () => {
      expect(isRecoverableError('auth/operation-not-allowed')).toBe(false)
    })
  })

  describe('getRetryMessage', () => {
    it('returns null for non-recoverable errors', () => {
      expect(getRetryMessage('auth/user-disabled')).toBeNull()
    })

    it('returns retry message for server errors', () => {
      const msg = getRetryMessage('SERVER_ERROR')
      expect(msg).toContain('Reessaie')
    })

    it('returns null for warning-type errors', () => {
      expect(getRetryMessage('NETWORK_OFFLINE')).toBeNull()
    })
  })
})
