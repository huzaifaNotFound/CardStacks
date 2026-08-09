import type { Stack } from '../model/types'

/**
 * Local persistence via localStorage. No accounts, no backend.
 *
 *   index  -> cardstacks:index              (list of {id,name,updatedAt})
 *   stack  -> cardstacks:stack:<id>         (full canonical Stack JSON)
 */

export interface IndexEntry {
  id: string
  name: string
  updatedAt: string
}

const INDEX_KEY = 'cardstacks:index'
const PREFIX = 'cardstacks:stack:'

export function loadIndex(): IndexEntry[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw) as unknown
    if (!Array.isArray(arr)) return []
    return arr.filter(
      (e): e is IndexEntry =>
        !!e && typeof e === 'object' && typeof (e as IndexEntry).id === 'string',
    )
  } catch {
    return []
  }
}

function writeIndex(entries: IndexEntry[]): void {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(entries))
  } catch {
    /* storage full — fail silently; saveStack callers report */
  }
}

/** Persist a stack and move it to the top of the index. Returns false on quota failure. */
export function saveStackToLocal(stack: Stack): boolean {
  try {
    localStorage.setItem(PREFIX + stack.id, JSON.stringify(stack))
  } catch {
    return false
  }
  const idx = loadIndex().filter((e) => e.id !== stack.id)
  idx.unshift({ id: stack.id, name: stack.name, updatedAt: stack.meta.updatedAt })
  writeIndex(idx)
  return true
}

export function loadStackFromLocal(id: string): Stack | null {
  try {
    const raw = localStorage.getItem(PREFIX + id)
    if (!raw) return null
    return JSON.parse(raw) as Stack
  } catch {
    return null
  }
}

export function deleteStackFromLocal(id: string): void {
  try {
    localStorage.removeItem(PREFIX + id)
  } catch {
    /* ignore */
  }
  writeIndex(loadIndex().filter((e) => e.id !== id))
}
