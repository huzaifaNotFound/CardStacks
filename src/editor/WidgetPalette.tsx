import { useStore } from '../app/store'
import { PALETTE_ORDER, WIDGETS } from '../widgets/registry'

export default function WidgetPalette() {
  const addWidget = useStore((s) => s.addWidget)
  const setTool = useStore((s) => s.setTool)

  return (
    <div className="palette">
      <span className="palette-label">Widgets</span>
      <div className="toolbar-sep" />
      {PALETTE_ORDER.map((type) => (
        <button
          key={type}
          className="btn palette-btn"
          onClick={() => {
            setTool('widgets')
            addWidget(type)
          }}
        >
          {WIDGETS[type].label}
        </button>
      ))}
      <span className="toolbar-spacer" />
      <span className="palette-hint muted">Click a widget to place it on the card</span>
    </div>
  )
}
