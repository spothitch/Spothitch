import { describe, it, expect, vi, beforeEach } from 'vitest'

import {
  lazyImg,
  observeImage,
  observeAllLazyImages,
  destroyLazyObserver,
} from '../../src/utils/lazyImages.js'

describe('lazyImages', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  describe('lazyImg', () => {
    it('returns an img HTML string', () => {
      const html = lazyImg('/img/spot.jpg', 'A spot', 'rounded-xl', '400', '300')
      expect(html).toContain('<img')
      expect(html).toContain('data-src="/img/spot.jpg"')
      expect(html).toContain('alt="A spot"')
      expect(html).toContain('class="lazy rounded-xl"')
    })

    it('includes width and height when provided', () => {
      const html = lazyImg('/img/test.jpg', 'Test', 'my-class', '200', '150')
      expect(html).toContain('width="200"')
      expect(html).toContain('height="150"')
    })

    it('omits explicit img width/height attrs when not provided', () => {
      const html = lazyImg('/img/test.jpg', 'Test')
      // The img tag should not have width="" or height="" as standalone attributes
      // (the placeholder SVG inline contains width="1" but that is inside the src)
      expect(html).not.toContain('width="" ')
      expect(html).not.toContain('height="" ')
    })

    it('has lazy loading attribute', () => {
      const html = lazyImg('/img/test.jpg', 'Test')
      expect(html).toContain('loading="lazy"')
    })

    it('uses placeholder as initial src', () => {
      const html = lazyImg('/img/test.jpg', 'Test')
      expect(html).toContain('data:image/svg+xml')
    })

    it('has class="lazy" by default', () => {
      const html = lazyImg('/img/test.jpg', 'Test')
      expect(html).toContain('class="lazy "')
    })
  })

  describe('observeImage', () => {
    it('runs without error on a real image element', () => {
      const img = document.createElement('img')
      img.setAttribute('data-src', '/img/test.jpg')
      document.body.appendChild(img)
      expect(() => observeImage(img)).not.toThrow()
    })

    it('runs without error on img without data-src', () => {
      const img = document.createElement('img')
      document.body.appendChild(img)
      expect(() => observeImage(img)).not.toThrow()
    })
  })

  describe('observeAllLazyImages', () => {
    it('runs without error', () => {
      document.body.innerHTML = '<img class="lazy" data-src="/img/a.jpg" alt="a"><img class="lazy" data-src="/img/b.jpg" alt="b">'
      expect(() => observeAllLazyImages()).not.toThrow()
    })

    it('handles empty document', () => {
      document.body.innerHTML = ''
      expect(() => observeAllLazyImages()).not.toThrow()
    })
  })

  describe('destroyLazyObserver', () => {
    it('runs without error', () => {
      expect(() => destroyLazyObserver()).not.toThrow()
    })

    it('can be called multiple times', () => {
      destroyLazyObserver()
      destroyLazyObserver()
    })
  })
})
