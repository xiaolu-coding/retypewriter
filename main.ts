// import _TypeIt from 'typeit'
import { calculatePatch, createAnimator, diff } from './src'

// const TypeIt = _TypeIt as any

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

typingEl.textContent = ''

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function start() {
  // 备份，闭包保存
  const _input = input
  const patches = calculatePatch(diff(_input, output))
  const animator = createAnimator(_input, patches)

  for (const result of animator) {
    typingEl.textContent = result.output
    await sleep(Math.random() * 60 + 30)
  }
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
