import { useEffect, useRef, useState } from 'react'
import { useStore } from '../app/store'
import type { MenuCommands } from '../editor/MenuBar'
import { deleteStackFromLocal, loadIndex, loadStackFromLocal, type IndexEntry } from '../io/persist'
import { EXAMPLES, type Example } from '../stacks/examples'
import { validateStack } from '../model/validate'
import { IconCard } from '../editor/icons'
import { EXAMPLE_ICONS } from './icons'

interface Props {
  cmd: MenuCommands
}

export default function HomeScreen({ cmd }: Props) {
  const loadStack = useStore((s) => s.loadStack)
  const setView = useStore((s) => s.setView)
  const newStack = useStore((s) => s.newStack)

  const [open, setOpen] = useState<string | null>(null)
  const [saved, setSaved] = useState<IndexEntry[]>([])
  const [notice, setNotice] = useState<string | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSaved(loadIndex())
  }, [])

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

  /** Your saved stacks open in the editor, ready to edit. */
  const openStack = (s: ReturnType<typeof loadStackFromLocal>) => {
    if (!s) {
      setNotice('This stack could not be read from local storage.')
      return
    }
    const { stack } = validateStack(s)
    loadStack(stack)
    setView('editor')
  }

  /** Example stacks open as standalone mini-apps, straight into Run mode. */
  const openExample = (ex: Example) => {
    loadStack(ex.make())
    setView('run')
  }

  const newStackAndGo = () => {
    newStack()
    setView('editor')
  }

  const remove = (id: string) => {
    deleteStackFromLocal(id)
    setSaved(loadIndex())
  }

  const fileMenu = [
    { label: 'New Stack', shortcut: 'Ctrl+N', run: newStackAndGo },
    { label: 'Open Stack…', shortcut: 'Ctrl+O', run: cmd.onOpenStack },
    { label: 'Import HTML…', run: cmd.onImportHtml },
    { sep: true } as const,
    { label: 'About CardStacks', run: cmd.onAbout },
  ]

  const menus: Record<string, { label?: string; shortcut?: string; sep?: true; run?: () => void }[]> = {
    File: fileMenu,
  }

  const row = (item: { label?: string; shortcut?: string; sep?: true; run?: () => void }, i: number) =>
    item.sep ? (
      <div key={i} className="menu-sep" />
    ) : (
      <button
        key={i}
        className="menu-row"
        onClick={() => {
          setOpen(null)
          item.run?.()
        }}
      >
        <span className="menu-check" />
        <span className="menu-label">{item.label}</span>
        {item.shortcut && <span className="menu-shortcut">{item.shortcut}</span>}
      </button>
    )

  const fmt = (iso: string) => {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  return (
    <div className="app-window home-window col">
      <div className="menubar" ref={barRef}>
        <button className="menubar-title home-btn" onClick={() => setView('home')} title="Home">
          <img className="menubar-logo" src="/logo/cardstacks-wordmark.png" alt="CardStacks" />
        </button>

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
            {open === name && <div className="menu-dropdown">{menus[name].map(row)}</div>}
          </div>
        ))}

        <span className="menubar-spacer" />
        <span className="menubar-version">v0.1</span>
      </div>

      <div className="home-body">
        <div className="home-logo">
          <img
            className="home-logo-img"
            src="/logo/cardstacks-logo.png"
            alt="CardStacks — a modern hypercard inspired software"
          />
        </div>

        <div className="home-divider" />

        {notice && <div className="home-notice">{notice}</div>}

        <div className="home-section">
          <div className="home-section-label">Your Stacks</div>
          {saved.length === 0 ? (
            <div className="home-empty muted">
              No stacks yet. Play an example below, or start a new one.
            </div>
          ) : (
            <div className="home-tiles">
              {saved.map((e) => (
                <button key={e.id} className="home-tile saved" onClick={() => openStack(loadStackFromLocal(e.id))}>
                  <span className="home-tile-icon">
                    <IconCard />
                  </span>
                  <span className="home-tile-label nowrap" title={e.name}>
                    {e.name}
                  </span>
                  <span className="home-tile-date">{fmt(e.updatedAt)}</span>
                  <span
                    className="home-tile-del"
                    role="button"
                    title="Delete"
                    onClick={(ev) => {
                      ev.stopPropagation()
                      remove(e.id)
                    }}
                  >
                    ×
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="home-divider" />

        <div className="home-section">
          <div className="home-section-label">Examples — play them</div>
          <div className="home-tiles">
            {EXAMPLES.map((ex) => {
              const Icon = EXAMPLE_ICONS[ex.id] ?? null
              return (
                <button
                  key={ex.id}
                  className="home-tile"
                  onClick={() => openExample(ex)}
                  title={`Play ${ex.label}`}
                >
                  <span className="home-tile-icon">{Icon && <Icon />}</span>
                  <span className="home-tile-label">{ex.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="home-actions">
          <button className="btn btn-round home-action" onClick={newStackAndGo}>
            NEW STACK
          </button>
          <button className="btn btn-round home-action" onClick={cmd.onOpenStack}>
            OPEN STACK
          </button>
        </div>

        <div className="home-version">the everything machine</div>
      </div>
    </div>
  )
}
