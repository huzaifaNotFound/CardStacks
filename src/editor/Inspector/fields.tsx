import { PATTERNS, patternStyle } from '../../styles/patterns'
import type { PatternId } from '../../styles/patterns'

/** Exactly five field kinds. Anything weirder gets a bespoke component. */

export function TextField({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      className="field"
      value={value}
      placeholder={placeholder}
      spellCheck={false}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export function TextArea({
  value,
  onChange,
  rows = 3,
}: {
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <textarea
      className="field"
      rows={rows}
      value={value}
      spellCheck={false}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export function NumberField({
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
}) {
  const clamp = (n: number) => {
    let v = n
    if (min !== undefined) v = Math.max(min, v)
    if (max !== undefined) v = Math.min(max, v)
    return v
  }
  const bump = (d: number) => onChange(clamp(Math.round((value + d * step) * 100) / 100))

  return (
    <div className="stepper">
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const n = Number(e.target.value)
          if (Number.isFinite(n)) onChange(clamp(n))
        }}
      />
      <div className="stepper-btns">
        <button className="stepper-btn" onClick={() => bump(1)} tabIndex={-1} aria-label="Increase">
          <svg width="7" height="4" viewBox="0 0 7 4" shapeRendering="crispEdges" fill="currentColor">
            <path d="M3.5 0 L7 4 L0 4 Z" />
          </svg>
        </button>
        <button className="stepper-btn" onClick={() => bump(-1)} tabIndex={-1} aria-label="Decrease">
          <svg width="7" height="4" viewBox="0 0 7 4" shapeRendering="crispEdges" fill="currentColor">
            <path d="M0 0 L7 0 L3.5 4 Z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export function SelectField({
  value,
  onChange,
  options,
}: {
  value: string | number
  onChange: (v: string) => void
  options: { label: string; value: string | number }[]
}) {
  return (
    <select className="field" value={String(value)} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={String(o.value)} value={String(o.value)}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

export function CheckField({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
}) {
  return (
    <label className="checkbox">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  )
}

export function PatternField({
  value,
  onChange,
}: {
  value: PatternId
  onChange: (v: PatternId) => void
}) {
  return (
    <div className="pattern-grid">
      {PATTERNS.map((p) => (
        <button
          key={p.id}
          className={`pattern-swatch${p.id === value ? ' is-on' : ''}`}
          style={patternStyle(p.id)}
          title={p.label}
          onClick={() => onChange(p.id)}
          aria-label={p.label}
        />
      ))}
    </div>
  )
}
