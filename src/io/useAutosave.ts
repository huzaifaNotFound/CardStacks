import { useEffect } from 'react'
import { useStore } from '../app/store'
import { saveStackToLocal } from './persist'

const DELAY = 800

/**
 * Debounced autosave. Saves whenever the stack is dirty; marks it clean after
 * a successful write so the menu bar shows "Saved HH:MM".
 */
export function useAutosave(): void {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const unsub = useStore.subscribe((state) => {
      if (!state.dirty) return
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        const s = useStore.getState()
        const ok = saveStackToLocal(s.stack)
        if (ok) s.markSaved()
      }, DELAY)
    })
    return () => {
      if (timer) clearTimeout(timer)
      unsub()
    }
  }, [])
}
