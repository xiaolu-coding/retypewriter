export interface InsertPatch {
  type: 'insert'
  from: number
  text: string
}

export interface RemovalPatch {
  type: 'removal'
  from: number
  length: number
}

// 集合类型
export type Patch = InsertPatch | RemovalPatch
