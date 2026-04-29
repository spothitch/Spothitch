import { describe, it, expect } from 'vitest'

import { validateImage, THUMBNAIL_SIZES } from '../../src/utils/imageOptimizer.js'

describe('imageOptimizer', () => {
  describe('THUMBNAIL_SIZES', () => {
    it('defines expected size presets', () => {
      expect(THUMBNAIL_SIZES.small).toEqual({ width: 128, height: 128 })
      expect(THUMBNAIL_SIZES.medium).toEqual({ width: 256, height: 256 })
      expect(THUMBNAIL_SIZES.card).toEqual({ width: 256, height: 192 })
      expect(THUMBNAIL_SIZES.profile).toEqual({ width: 96, height: 96 })
      expect(THUMBNAIL_SIZES.spot).toEqual({ width: 400, height: 300 })
    })
  })

  describe('validateImage', () => {
    it('rejects null file', () => {
      const result = validateImage(null)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Aucun fichier')
    })

    it('rejects undefined file', () => {
      const result = validateImage(undefined)
      expect(result.valid).toBe(false)
    })

    it('accepts JPEG', () => {
      const file = { type: 'image/jpeg', size: 1000 }
      expect(validateImage(file).valid).toBe(true)
    })

    it('accepts PNG', () => {
      const file = { type: 'image/png', size: 1000 }
      expect(validateImage(file).valid).toBe(true)
    })

    it('accepts WebP', () => {
      const file = { type: 'image/webp', size: 1000 }
      expect(validateImage(file).valid).toBe(true)
    })

    it('accepts GIF', () => {
      const file = { type: 'image/gif', size: 1000 }
      expect(validateImage(file).valid).toBe(true)
    })

    it('rejects unsupported format', () => {
      const file = { type: 'image/bmp', size: 1000 }
      const result = validateImage(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Format non supporté')
    })

    it('rejects files > 5MB', () => {
      const file = { type: 'image/jpeg', size: 6 * 1024 * 1024 }
      const result = validateImage(file)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('trop volumineux')
    })

    it('accepts file at exactly 5MB', () => {
      const file = { type: 'image/jpeg', size: 5 * 1024 * 1024 }
      expect(validateImage(file).valid).toBe(true)
    })

    it('rejects non-image types', () => {
      const file = { type: 'application/pdf', size: 1000 }
      expect(validateImage(file).valid).toBe(false)
    })
  })
})
