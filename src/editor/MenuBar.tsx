import { useEffect, useRef, useState } from 'react'
import { useStore } from '../app/store'
import { PALETTE_ORDER, WIDGETS } from '../widgets/registry'
import { TOOLS } from './tools/types'

export interface MenuCommands {
  onNewStack: () => void
  onOpenStack: () => void
  onImportHtml: () => void
  onSaveStack: () => void
  onExportHtml: () => void
  onRun: () => void
  onGoHome: () => void
  onAbout: () => void
}

interface MenuItem {
  label?: string
  shortcut?: string
  checked?: boolean
  disabled?: boolean
  sep?: true
  run?: () => void
}

export default function MenuBar({ cmd }: { cmd: MenuCommands }) {
  const [open, setOpen] = useState<string | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  const stack = useStore((s) => s.stack)
  const dirty = useStore((s) => s.dirty)
  const lastSavedAt = useStore((s) => s.lastSavedAt)
  const tool = useStore((s) => s.tool)
  const setTool = useStore((s) => s.setTool)
  const undo = useStore((s) => s.undo)
  const redo = useStore((s) => s.redo)
  const canUndo = useStore((s) => s.past.length > 0)
  const canRedo = useStore((s) => s.future.length > 0)
  const addWidget = useStore((s) => s.addWidget)
  const addCard = useStore((s) => s.addCard)
  const deleteCard = useStore((s) => s.deleteCard)
  const duplicateCardFn = useStore((s) => s.duplicateCard)
  const currentCardId = useStore((s) => s.currentCardId)
  const selectedWidgetId = useStore((s) => s.selectedWidgetId)
  const deleteWidget = useStore((s) => s.deleteWidget)
  const duplicateWidget = useStore((s) => s.duplicateWidget)
  const cardCount = useStore((s) => s.stack.cards.length)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpen(null)
    }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  const menus: Record<string, MenuItem[]> = {
    File: [
      { label: 'New Stack', shortcut: 'Ctrl+N', run: cmd.onNewStack },
      { label: 'Open Stack…', shortcut: 'Ctrl+O', run: cmd.onOpenStack },
      { label: 'Import HTML…', run: cmd.onImportHtml },
      { sep: true },
      { label: 'Save Stack', shortcut: 'Ctrl+S', run: cmd.onSaveStack },
      { label: 'Export HTML…', shortcut: 'Ctrl+E', run: cmd.onExportHtml },
      { sep: true },
      { label: 'Home', run: cmd.onGoHome },
    ],
    Edit: [
      { label: 'Undo', shortcut: 'Ctrl+Z', disabled: !canUndo, run: undo },
      { label: 'Redo', shortcut: 'Ctrl+Y', disabled: !canRedo, run: redo },
      { sep: true },
      {
        label: 'Duplicate Widget',
        shortcut: 'Ctrl+D',
        disabled: !selectedWidgetId,
        run: () => selectedWidgetId && duplicateWidget(selectedWidgetId),
      },
      {
        label: 'Delete Widget',
        shortcut: 'Del',
        disabled: !selectedWidgetId,
        run: () => selectedWidgetId && deleteWidget(selectedWidgetId),
      },
    ],
    Card: [
      ...PALETTE_ORDER.map((t) => ({
        label: `New ${WIDGETS[t].label}`,
        run: () => addWidget(t),
      })),
      { sep: true },
      { label: 'New Card', run: addCard },
      { label: 'Duplicate Card', run: () => duplicateCardFn(currentCardId) },
      {
        label: 'Delete Card',
        disabled: cardCount <= 1,
        run: () => deleteCard(currentCardId),
      },
    ],
    Tool: [
      ...TOOLS.slice(0, 2).map((t) => ({
        label: t.label,
        checked: tool === t.id,
        run: () => setTool(t.id),
      })),
      { sep: true },
      ...TOOLS.slice(2).map((t) => ({
        label: t.label,
        checked: tool === t.id,
        run: () => setTool(t.id),
      })),
    ],
    Help: [
      { label: 'About CardStacks', run: cmd.onAbout },
      { sep: true },
      { label: 'Run Stack', shortcut: 'Ctrl+R', run: cmd.onRun },
    ],
  }

  const saveLabel = dirty
    ? '● unsaved'
    : lastSavedAt
      ? `Saved ${new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : 'Saved'

  return (
    <div className="menubar" ref={barRef}>
      <span className="menubar-title">CardStacks</span>

      {Object.keys(menus).map((name) => (
        <div key={name} style={{ position: 'relative', display: 'flex' }}>
          <button
            className={`menubar-item${open === name ? ' is-open' : ''}`}
            onMouseDown={(e) => {
              e.preventDefault()
              setOpen(open === name ? null : name)
            }}
            onMouseEnter={() => open && setOpen(name)}
          >
            {name}
          </button>

          {open === name && (
            <div className="menu-dropdown" style={{ left: 0 }}>
              {menus[name].map((item, i) =>
                item.sep ? (
                  <div key={i} className="menu-sep" />
                ) : (
                  <button
                    key={i}
                    className="menu-row"
                    disabled={item.disabled}
                    onClick={() => {
                      setOpen(null)
                      item.run?.()
                    }}
                  >
                    <span className="menu-check">{item.checked ? '✓' : ''}</span>
                    <span className="menu-label">{item.label}</span>
                    {item.shortcut && <span className="menu-shortcut">{item.shortcut}</span>}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      ))}

      <span className="menubar-spacer" />
      <span className="menubar-status nowrap" title={stack.name}>
        {saveLabel}
      </span>
      <span className="menubar-version">v0.1</span>
    </div>
  )
}
