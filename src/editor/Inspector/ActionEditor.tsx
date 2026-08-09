import { useStore } from '../../app/store'
import { ACTION_CATALOG, actionMeta, type ActionFieldDef } from '../../actions/catalog'
import type { Action, EventHandler, Widget } from '../../model/types'
import { widgetDisplayName } from '../../widgets/registry'
import { CheckField, SelectField, TextField } from './fields'

interface Props {
  widget: Widget
  event: EventHandler['event']
}

export default function ActionEditor({ widget, event }: Props) {
  const stack = useStore((s) => s.stack)
  const currentCard = useStore((s) => s.stack.cards.find((c) => c.id === s.currentCardId))
  const setEventActions = useStore((s) => s.setEventActions)

  const cardWidgets = currentCard?.widgets ?? []
  const handler = widget.events?.find((e) => e.event === event)
  const actions = handler?.actions ?? []

  const fieldOptions = (f: ActionFieldDef): { label: string; value: string }[] => {
    if (f.kind === 'card') return stack.cards.map((c) => ({ label: c.name, value: c.id }))
    if (f.kind === 'widget') return cardWidgets.map((w) => ({ label: widgetDisplayName(w), value: w.id }))
    return []
  }

  /** Fill empty required targets (cards/widgets) with the first available. */
  const fillDefaults = (a: Action): Action => {
    for (const f of actionMeta(a.type).fields) {
      const v = (a as Record<string, unknown>)[f.key]
      if (v === '' || v === undefined) {
        const opts = fieldOptions(f)
        if (opts.length) (a as Record<string, unknown>)[f.key] = opts[0].value
      }
    }
    return a
  }

  const setActions = (next: Action[]) => setEventActions(widget.id, event, next)

  const replaceType = (i: number, type: Action['type']) => {
    const next = [...actions]
    next[i] = fillDefaults(actionMeta(type).create())
    setActions(next)
  }

  const patch = (i: number, key: string, value: unknown) => {
    const next = actions.map((a, j) => (j === i ? ({ ...a, [key]: value } as Action) : a))
    setActions(next)
  }

  const remove = (i: number) => setActions(actions.filter((_, j) => j !== i))

  const add = () => setActions([...actions, fillDefaults(ACTION_CATALOG[0].create())])

  const renderField = (a: Action, f: ActionFieldDef, i: number) => {
    const value = (a as Record<string, unknown>)[f.key]
    const opts = fieldOptions(f)

    switch (f.kind) {
      case 'card':
      case 'widget':
        return (
          <SelectField
            value={String(value ?? '')}
            options={opts}
            onChange={(v) => patch(i, f.key, v)}
          />
        )
      case 'bool':
        return (
          <CheckField
            checked={Boolean(value)}
            label={f.label}
            onChange={(v) => patch(i, f.key, v)}
          />
        )
      default:
        return (
          <TextField value={String(value ?? '')} onChange={(v) => patch(i, f.key, v)} />
        )
    }
  }

  return (
    <div className="action-section">
      <div className="action-header row">
        <span className="action-event">ON {event.toUpperCase()}</span>
        <button className="btn btn-sm" onClick={add}>
          + Add Action
        </button>
      </div>

      {actions.length === 0 && (
        <div className="action-empty muted">No actions — this widget does nothing yet.</div>
      )}

      {actions.map((a, i) => {
        const meta = actionMeta(a.type)
        return (
          <div key={i} className="action-row">
            <div className="action-top">
              <SelectField
                value={a.type}
                options={ACTION_CATALOG.map((m) => ({ label: m.label, value: m.type }))}
                onChange={(v) => replaceType(i, v as Action['type'])}
              />
              <button className="btn btn-sm action-del" onClick={() => remove(i)}>
                ✕
              </button>
            </div>
            {meta.fields.map((f) => (
              <div className="action-field" key={f.key}>
                <label>{f.label}</label>
                {renderField(a, f, i)}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
