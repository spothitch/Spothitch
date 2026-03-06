/**
 * Tests for tutorial component (retired — stubs only)
 */

import { describe, it, expect } from 'vitest'
import { renderTutorial, tutorialSteps, cleanupTutorialTargets, executeStepAction } from '../src/components/modals/Tutorial.js'

describe('Tutorial Component (retired)', () => {
  it('renderTutorial returns empty string', () => {
    expect(renderTutorial()).toBe('')
  })

  it('tutorialSteps is empty array', () => {
    expect(Array.isArray(tutorialSteps)).toBe(true)
    expect(tutorialSteps.length).toBe(0)
  })

  it('cleanupTutorialTargets does not throw', () => {
    expect(() => cleanupTutorialTargets()).not.toThrow()
  })

  it('executeStepAction does not throw', () => {
    expect(() => executeStepAction(0)).not.toThrow()
  })
})
