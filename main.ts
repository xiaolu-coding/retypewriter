import _TypeIt from 'typeit'
import { calculatePatch, diff } from './src'

const TypeIt = _TypeIt as any

const inputEl = document.querySelector('#input') as HTMLTextAreaElement
const outputEl = document.querySelector('#output') as HTMLTextAreaElement
const typingEl = document.querySelector('#typing') as HTMLParagraphElement

let input = `
import { describe, expect, it } from 'vitest'
import { one } from '../src'

describe('should', () => {
  it('exported', () => {
    expect(one).toEqual(1)
  })
})
`

let output = `
import { describe, expect, it } from 'vitest'


describe('should', () => {
  it('one', () => {
    expect(one).toEqual(1)
    expect(two).toEqual(2)
  })
})
`

inputEl.value = input
outputEl.value = output

inputEl.addEventListener('input', debounce(() => {
  input = inputEl.value
  start()
}))

outputEl.addEventListener('input', debounce(() => {
  output = outputEl.value
  start()
}))

let typeit: any

typingEl.textContent = ''

function start() {
  if (typeit)
    typeit.reset()

  typeit = new TypeIt(typingEl, {
    speed: 50,
    startDelay: 900,
  })

  const patches = calculatePatch(diff(input, output))
  // const typingEl.value = applyPatches(input, patches)
  typeit
    .type(input, { instant: true })

  for (const patch of patches) {
    // typeit
    //   .pause(800)
    if (patch.type === 'insert') {
      typeit
        .move(null, { to: 'START', instant: true })
        .move(patch.from, { instant: true })
        .type(patch.text, { delay: 300 })
    }
    else {
      typeit
        .move(null, { to: 'START', instant: true })
        .move(patch.from, { instant: true })
        .delete(patch.length)
    }
  }
  typeit.go()
}

start()

function debounce(fn: Function, delay = 500) {
  let timer: any
  return function() {
    if (timer)
      clearTimeout(timer)

    timer = setTimeout(() => {
      // eslint-disable-next-line prefer-rest-params
      fn.apply(this, arguments)
      timer = null
    }, delay)
  }
}
