import type { Patch } from './types'

export function* createAnimator(input: string, patches: Patch[]) {
  let output = input
  let cursor = 0
  for (const patch of patches) {
    if (patch.type === 'insert') {
      cursor = patch.from
      const head = output.slice(0, patch.from)
      const tail = output.slice(patch.from)
      let selection = ''
      for (const char of patch.text) {
        selection += char
        yield {
          cursor: cursor + selection.length,
          output: head + selection + tail,
        }
      }
      // 将两边取出来然后加进去
      output = head + patch.text + tail
    }
    else if (patch.type === 'removal') {
      cursor = patch.from - patch.length
      const head = output.slice(0, patch.from - patch.length)
      const tail = output.slice(patch.from)
      const selection = output.slice(patch.from - patch.length, patch.from)
      for (let i = selection.length; i >= 0; i--) {
        yield {
          cursor: cursor + i,
          output: head + selection.slice(0, i) + tail,
        }
      }
      // 取出要删除的前面的和后面的加起来
      output = head + tail
    }
  }
  return { output, cursor }
}
