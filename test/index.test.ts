import { describe, expect, it } from 'vitest'
import type { Diff } from 'diff-match-patch'
import { diff_match_patch as DMP } from 'diff-match-patch'

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
interface InsertPatch {
  type: 'insert'
  from: number
  text: string
}

interface RemovalPatch {
  type: 'removal'
  from: number
  length: number
}

// 集合类型
type Patch = InsertPatch | RemovalPatch

// 将增加修改转换为 patches对象数组，根据type属性得知是增加还是删除
function calculatePatch(diff: Diff[]): Patch[] {
  const patches: Patch[] = []
  // 指针，记录位置
  let index = 0
  for (const change of diff) {
    // change[0] -1是删除， 0是没变，1是增加
    if (change[0] === 0) {
      // 如果没变，指针移动到这句话的最后
      index += change[1].length
      continue
    }
    else if (change[0] === -1) {
      const length = change[1].length
      patches.push({
        type: 'removal',
        from: index + length, // 删除要加上删除的长度
        length,
      })
    }
    else if (change[0] === 1) {
      patches.push({
        type: 'insert',
        from: index,
        text: change[1],
      })
      // 加了之后，指针要移动
      index += change[1].length
    }
    else {
      throw new Error('error')
    }
  }
  return patches
}
// 通过遍历patches的对象数组，执行相应的操作，得到最终结果
function applyPatches(input: string, patches: Patch[]) {
  let output = input
  for (const patch of patches) {
    if (patch.type === 'insert') {
      // 将两边取出来然后加进去
      output = output.slice(0, patch.from) + patch.text + output.slice(patch.from)
    }
    else if (patch.type === 'removal') {
      // 取出要删除的前面的和后面的加起来
      output = output.slice(0, patch.from - patch.length) + output.slice(patch.from)
    }
  }
  return { output }
}

// diff对比文本 返回change数组，数组内部也是数组，索引0为 -1 0 1，索引1为相应内容
function diff(a: string, b: string): Diff[] {
  const differ = new DMP()
  const delta = differ.diff_main(a, b)
  differ.diff_cleanupSemantic(delta)
  return delta
}

describe('should', () => {
  it('exported', () => {
    const delta = diff(input, output)
    const patches = calculatePatch(delta)
    const applied = applyPatches(input, patches)
    // expect(applied.output).toMatchSnapshot()
    expect(applied.output).equal(output)
  })
})
