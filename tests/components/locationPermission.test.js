import { describe, it, expect } from 'vitest'
import { renderLocationPermission } from '../../src/components/modals/LocationPermission.js'

describe('renderLocationPermission', () => {
  it('renders location permission modal', () => {
    const html = renderLocationPermission({})
    expect(html).toContain('role="dialog"')
    expect(html).toContain('location-modal-title')
  })

  it('renders with aria attributes', () => {
    const html = renderLocationPermission({})
    expect(html).toContain('aria-modal="true"')
    expect(html).toContain('aria-labelledby')
    expect(html).toContain('aria-describedby')
  })

  it('renders action buttons', () => {
    const html = renderLocationPermission({})
    expect(html).toContain('<button')
    expect(html.length).toBeGreaterThan(200)
  })

  it('renders without state argument', () => {
    const html = renderLocationPermission()
    expect(html).toBeTruthy()
  })
})
