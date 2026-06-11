import { describe, it, expect, vi, beforeEach } from 'vitest'

import { validateImage, THUMBNAIL_SIZES, compressImage, generateThumbnail } from '../../src/utils/imageOptimizer.js'

// Mock canvas for tests that use it
const mockCtx = {
  imageSmoothingEnabled: false,
  imageSmoothingQuality: '',
  drawImage: vi.fn(),
}
const mockCanvas = {
  width: 0,
  height: 0,
  getContext: vi.fn(() => mockCtx),
  toDataURL: vi.fn(() => 'data:image/jpeg;base64,test123'),
  toBlob: vi.fn((cb) => cb(new Blob(['img'], { type: 'image/jpeg' }))),
}

function setupCanvasMock() {
  const orig = document.createElement.bind(document)
  vi.spyOn(document, 'createElement').mockImplementation((tag) => {
    if (tag === 'canvas') return mockCanvas
    return orig(tag)
  })
  // Auto-trigger Image onload
  global.Image = class {
    constructor() {
      this.width = 100
      this.height = 75
      this.crossOrigin = null
      this.onload = null
      this.onerror = null
    }
    set src(_val) {
      setTimeout(() => this.onload?.(), 0)
    }
  }
}

function restoreCanvasMock() {
  vi.restoreAllMocks()
}

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

describe('compressImage', () => {
  beforeEach(() => {
    setupCanvasMock()
    vi.clearAllMocks()
  })

  afterEach(() => {
    restoreCanvasMock()
  })

  it('resolves with dataUrl and blob for string source', async () => {
    const result = await compressImage('data:image/jpeg;base64,test')
    expect(result.dataUrl).toBeDefined()
    expect(result.blob).toBeDefined()
    expect(result.width).toBeDefined()
    expect(result.height).toBeDefined()
  })

  it('uses default quality and format', async () => {
    const result = await compressImage('data:image/jpeg;base64,test')
    expect(result.format).toBe('image/jpeg')
  })

  it('accepts custom options', async () => {
    const result = await compressImage('data:image/jpeg;base64,test', {
      maxWidth: 100, maxHeight: 100, quality: 0.7, format: 'image/webp',
    })
    expect(result.format).toBe('image/webp')
  })

  it('returns size from blob', async () => {
    const result = await compressImage('data:image/jpeg;base64,test')
    expect(typeof result.size).toBe('number')
  })
})

describe('generateThumbnail', () => {
  beforeEach(() => {
    setupCanvasMock()
    vi.clearAllMocks()
  })

  afterEach(() => {
    restoreCanvasMock()
  })

  it('resolves with dataUrl and blob for string source', async () => {
    const result = await generateThumbnail('https://example.com/img.jpg', 'small')
    expect(result.dataUrl).toBeDefined()
    expect(result.blob).toBeDefined()
  })

  it('uses medium preset by default', async () => {
    const result = await generateThumbnail('https://example.com/img2.jpg')
    expect(result.width).toBe(256)
    expect(result.height).toBe(256)
  })

  it('uses correct dimensions for profile preset', async () => {
    const result = await generateThumbnail('https://example.com/img3.jpg', 'profile')
    expect(result.width).toBe(96)
    expect(result.height).toBe(96)
  })

  it('returns cached result on second call with same key', async () => {
    const url = 'https://example.com/cached-img.jpg'
    await generateThumbnail(url, 'card')
    const createElementSpy = document.createElement
    const callCount = createElementSpy.mock.calls.length
    await generateThumbnail(url, 'card')
    // Second call uses cache, no new canvas created
    expect(createElementSpy.mock.calls.length).toBe(callCount)
  })
})
