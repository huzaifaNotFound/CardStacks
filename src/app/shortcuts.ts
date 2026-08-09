import { useEffect } from 'react'
import { useStore, type Tool } from './store'

interface ShortcutCommands {
  onSaveStack: () => void
  onExportHtml: () => void
  onNewStack: () => void
}

const TOOL_DIGITS: Record<string, Tool> = {
  '1': 'interact',
  '2': 'widgets',
  '3': 'select',
  '4': 'pencil',
  '5': 'eraser',
  '6': 'line',
  '7': 'box',
  '8': 'boxFilled',
  '9': 'oval',
  '0': 'ovalFilled',
}

/** Global keyboard shortcuts. Never hijack while the user is typing. */
export function useShortcuts(cmd: ShortcutCommands): void {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      const typing =
        !!t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.tagName === 'SELECT' ||
          t.isContentEditable)
      const ctrl = e.ctrlKey || e.metaKey
      const state = useStore.getState()
      const key = e.key.toLowerCase()

      if (ctrl && key === 'z') {
        if (!typing) {
          e.preventDefault()
          if (e.shiftKey) state.redo()
          else state.undo()
        }
        return
      }
      if (ctrl && key === 'y') {
        e.preventDefault()
        state.redo()
        return
      }
      if (ctrl && key === 's') {
        e.preventDefault()
        cmd.onSaveStack()
        return
      }
      if (ctrl && key === 'e') {
        e.preventDefault()
        cmd.onExportHtml()
        return
      }
      if (ctrl && key === 'n') {
        e.preventDefault()
        cmd.onNewStack()
        return
      }

      if (state.view !== 'editor' || typing) return

      if (ctrl && key === 'd') {
        e.preventDefault()
        if (state.selectedWidgetId) state.duplicateWidget(state.selectedWidgetId)
        return
      }
      if (e.key === 'Delete') {
        if (state.selectedWidgetId) {
          e.preventDefault()
          state.deleteWidget(state.selectedWidgetId)
        }
        return
      }

      const tool = TOOL_DIGITS[e.key]
      if (tool) {
        state.setTool(tool)
        return
      }
      if (key === 't') {
        state.setTool('text')
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [cmd])
}
