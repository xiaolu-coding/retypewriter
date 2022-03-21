import { describe, expect, it } from 'vitest'

import { applyPatches, calculatePatch, diff } from '../src'

const input = `
import { describe, expect, it } from 'vitest'
import { one } from '../src'

describe('should', () => {
  it('exported', () => {
    expect(one).toEqual(1)
  })
})
`

const output = `
import { describe, expect, it } from 'vitest'


describe('should', () => {
  it('one', () => {
    expect(one).toEqual(1)
    expect(two).toEqual(2)
  })
})
`

describe('should', () => {
  it('exported', () => {
    const delta = diff(input, output)
    const patches = calculatePatch(delta)
    const applied = applyPatches(input, patches)
    // expect(applied.output).toMatchSnapshot()
    expect(applied.output).equal(output)
  })
})
