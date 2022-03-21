import { describe, expect, it } from 'vitest'

import { applyPatches, calculatePatch, diff } from '../src'
import { input, output } from './fixture'

describe('should', () => {
  it('exported', () => {
    const delta = diff(input, output)
    const patches = calculatePatch(delta)
    const applied = applyPatches(input, patches)
    // expect(applied.output).toMatchSnapshot()
    expect(applied.output).equal(output)
  })
})
