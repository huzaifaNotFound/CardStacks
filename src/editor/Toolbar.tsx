import { useStore } from '../app/store'
import { IconExport, IconRedo, IconRun, IconUndo } from './icons'
import { TOOLS, TOOL_GROUPS } from './tools/types'

interface Props {
  onRun: () => void
  onExport: () => void
}

export default function Toolbar({ onRun, onExport }: Props) {
  const tool = useStore((s) => s.tool)
  const setTool = useStore((s) => s.setTool)
  const undo = useStore((s) => s.undo)
  const redo = useStore((s) => s.redo)
  const canUndo = useStore((s) => s.past.length > 0)
  const canRedo = useStore((s) => s.future.length > 0)

  return (
    <div className="toolbar">
      {TOOLS.map((t) => {
        const Icon = t.icon
        return (
          <span key={t.id} style={{ display: 'contents' }}>
            <button
              className={`tool has-tip${tool === t.id ? ' is-on' : ''}`}
              onClick={() => setTool(t.id)}
              aria-pressed={tool === t.id}
              aria-label={t.label}
            >
              <Icon />
              <span className="tip">
                {t.label}
                {t.key ? ` (${t.key.toUpperCase()})` : ''}
              </span>
            </button>
            {TOOL_GROUPS.includes(t.id) && <span className="toolbar-sep" />}
          </span>
        )
      })}

      <span className="toolbar-spacer" />

      <button className="tool has-tip" onClick={undo} disabled={!canUndo} aria-label="Undo">
        <IconUndo />
        <span className="tip">Undo (Ctrl+Z)</span>
      </button>
      <button className="tool has-tip" onClick={redo} disabled={!canRedo} aria-label="Redo">
        <IconRedo />
        <span className="tip">Redo (Ctrl+Y)</span>
      </button>

      <span className="toolbar-sep" />

      <button className="btn btn-default toolbar-cta" onClick={onRun}>
        <span className="cta-icon">
          <IconRun />
        </span>
        RUN
      </button>
      <button className="btn toolbar-cta" onClick={onExport}>
        <span className="cta-icon">
          <IconExport />
        </span>
        EXPORT
      </button>
    </div>
  )
}
