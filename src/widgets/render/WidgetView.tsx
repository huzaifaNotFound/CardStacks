import type { Widget } from '../../model/types'
import { patternStyle } from '../../styles/patterns'
import type { PatternId } from '../../styles/patterns'

/**
 * Renders a widget's content in the EDITOR (non-interactive surface).
 *
 * The standalone runtime has its own vanilla-DOM renderer with the same visual
 * rules (shared `widgets.css`). Keep the two visually consistent.
 */

function num(p: Record<string, unknown>, key: string, fb: number): number {
  const v = p[key]
  return typeof v === 'number' && Number.isFinite(v) ? v : fb
}

function str(p: Record<string, unknown>, key: string, fb = ''): string {
  const v = p[key]
  return typeof v === 'string' ? v : fb
}

function TextWidget({ p }: { p: Record<string, unknown> }) {
  return (
    <div
      className="w-text"
      style={{
        fontSize: num(p, 'fontSize', 16),
        textAlign: (p.align as React.CSSProperties['textAlign']) || 'left',
        fontWeight: p.bold ? 700 : 400,
        fontStyle: p.italic ? 'italic' : 'normal',
      }}
    >
      {str(p, 'content', 'Text')}
    </div>
  )
}

function FieldWidget({ p }: { p: Record<string, unknown> }) {
  const value = str(p, 'content', '')
  return (
    <div
      className="w-field"
      style={{
        fontSize: num(p, 'fontSize', 13),
        whiteSpace: p.multiline ? 'pre-wrap' : 'nowrap',
        overflow: p.multiline ? 'auto' : 'hidden',
      }}
    >
      {value || <span style={{ opacity: 0.45 }}>{str(p, 'placeholder', '')}</span>}
    </div>
  )
}

function ButtonWidget({ p }: { p: Record<string, unknown> }) {
  const style = str(p, 'style', 'classic')
  return (
    <div
      className={`w-button${style === 'default' ? ' is-default' : ''}${style === 'plain' ? ' is-plain' : ''}${style === 'invisible' ? ' is-invisible' : ''}${p.enabled === false ? ' is-disabled' : ''}`}
      style={{ fontSize: num(p, 'fontSize', 12) }}
    >
      {str(p, 'label', 'Button')}
    </div>
  )
}

function ImageWidget({ p }: { p: Record<string, unknown> }) {
  const src = str(p, 'src', '')
  const fit = str(p, 'fit', 'contain')
  return (
    <div className={`w-image${p.border ? ' has-border' : ''}${src ? '' : ' empty'} fit-${fit}`}>
      {src && <img src={src} alt="" />}
    </div>
  )
}

function ShapeWidget({ p }: { p: Record<string, unknown> }) {
  const kind = str(p, 'shape', 'rect')
  const filled = Boolean(p.filled)
  const stroke = num(p, 'strokeWidth', 1)
  const fill = p.fill as PatternId

  const base: React.CSSProperties = {
    width: '100%',
    height: '100%',
    border: '1px solid var(--black)',
    ...(filled ? patternStyle(fill) : {}),
  }
  if (stroke !== 1) {
    base.boxShadow = `0 0 0 ${stroke - 1}px var(--black)`
  }

  if (kind === 'line') {
    return (
      <svg width="100%" height="100%" style={{ display: 'block' }}>
        <line
          x1="0"
          y1="100%"
          x2="100%"
          y2="0"
          stroke="#000"
          strokeWidth={Math.max(1, stroke)}
          shapeRendering="crispEdges"
        />
      </svg>
    )
  }

  if (kind === 'oval') {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '1px solid var(--black)',
          ...(filled ? patternStyle(fill) : {}),
        }}
      />
    )
  }

  return <div style={base} />
}

function SliderWidget({ p }: { p: Record<string, unknown> }) {
  const min = num(p, 'min', 0)
  const max = num(p, 'max', 100)
  const value = Math.max(min, Math.min(max, num(p, 'value', min)))
  return (
    <div className="w-slider">
      <input type="range" min={min} max={max} value={value} disabled readOnly />
    </div>
  )
}

function CanvasWidget() {
  return (
    <div className="w-canvas has-border">
      <div style={{ padding: 4, opacity: 0.45, fontSize: 11 }}>canvas</div>
    </div>
  )
}

function GridWidget({ p }: { p: Record<string, unknown> }) {
  const rows = Math.max(1, Math.round(num(p, 'rows', 3)))
  const cols = Math.max(1, Math.round(num(p, 'cols', 3)))
  const headers = Boolean(p.headers)
  const raw = str(p, 'data', '').trim()
  const grid = raw
    .split(/\n/)
    .map((l) => l.split(',').map((c) => c.trim()))
    .slice(0, rows)

  const cells: string[][] = []
  for (let r = 0; r < rows; r++) {
    cells[r] = []
    for (let c = 0; c < cols; c++) {
      cells[r][c] = grid[r]?.[c] ?? ''
    }
  }

  return (
    <div className="w-grid">
      <table>
        {headers && (
          <thead>
            <tr>
              {cells[0].map((c, i) => (
                <th key={i}>{c}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {cells.slice(headers ? 1 : 0).map((row, r) => (
            <tr key={r}>
              {row.map((c, i) => (
                <td key={i} className={r % 2 ? 'is-odd' : ''}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function WidgetView({ widget }: { widget: Widget }) {
  const { type, props, visible } = widget
  return (
    <div
      className={`w w-${type}`}
      data-widget-id={widget.id}
      data-widget-type={type}
      style={{
        left: widget.x,
        top: widget.y,
        width: widget.w,
        height: widget.h,
        visibility: visible ? 'visible' : 'hidden',
      }}
    >
      {type === 'text' && <TextWidget p={props} />}
      {type === 'field' && <FieldWidget p={props} />}
      {type === 'button' && <ButtonWidget p={props} />}
      {type === 'image' && <ImageWidget p={props} />}
      {type === 'shape' && <ShapeWidget p={props} />}
      {type === 'slider' && <SliderWidget p={props} />}
      {type === 'canvas' && <CanvasWidget />}
      {type === 'grid' && <GridWidget p={props} />}
    </div>
  )
}
