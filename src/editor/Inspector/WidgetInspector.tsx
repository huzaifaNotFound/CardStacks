import { useStore } from '../../app/store'
import type { Widget } from '../../model/types'
import { WIDGETS } from '../../widgets/registry'
import { IconCopy, IconDown, IconTrash, IconUp } from '../icons'
import ActionEditor from './ActionEditor'
import {
  CheckField,
  NumberField,
  PatternField,
  SelectField,
  TextArea,
  TextField,
} from './fields'
import type { PatternId } from '../../styles/patterns'

export default function WidgetInspector({ widget }: { widget: Widget }) {
  const updateWidget = useStore((s) => s.updateWidget)
  const updateWidgetProp = useStore((s) => s.updateWidgetProp)
  const deleteWidget = useStore((s) => s.deleteWidget)
  const duplicateWidget = useStore((s) => s.duplicateWidget)
  const raiseWidget = useStore((s) => s.raiseWidget)
  const size = useStore((s) => s.stack.size)

  const info = WIDGETS[widget.type]

  return (
    <>
      <div className="section-bar row" style={{ justifyContent: 'space-between' }}>
        <span>{info.label}</span>
        <span style={{ opacity: 0.7 }}>{widget.id.slice(-4)}</span>
      </div>

      <div className="insp-group">
        <div className="insp-row">
          <label>Name</label>
          <TextField
            value={widget.name ?? ''}
            placeholder={`${info.label} ${widget.id.slice(-4)}`}
            onChange={(v) => updateWidget(widget.id, { name: v || undefined })}
          />
        </div>
      </div>

      <div className="section-bar">Properties</div>
      <div className="insp-group">
        {info.fields.map((f) => {
          const value = widget.props[f.key]
          switch (f.kind) {
            case 'text':
              return (
                <div className="insp-row" key={f.key}>
                  <label>{f.label}</label>
                  <TextField
                    value={String(value ?? '')}
                    onChange={(v) => updateWidgetProp(widget.id, f.key, v)}
                  />
                </div>
              )
            case 'textarea':
              return (
                <div className="insp-stack" key={f.key}>
                  <label className="insp-label">{f.label}</label>
                  <TextArea
                    value={String(value ?? '')}
                    onChange={(v) => updateWidgetProp(widget.id, f.key, v)}
                  />
                </div>
              )
            case 'number':
              return (
                <div className="insp-row" key={f.key}>
                  <label>{f.label}</label>
                  <NumberField
                    value={Number(value ?? 0)}
                    onChange={(v) => updateWidgetProp(widget.id, f.key, v)}
                  />
                </div>
              )
            case 'select':
              return (
                <div className="insp-row" key={f.key}>
                  <label>{f.label}</label>
                  <SelectField
                    value={String(value ?? '')}
                    options={f.options ?? []}
                    onChange={(v) => updateWidgetProp(widget.id, f.key, v)}
                  />
                </div>
              )
            case 'checkbox':
              return (
                <CheckField
                  key={f.key}
                  checked={Boolean(value)}
                  label={f.label}
                  onChange={(v) => updateWidgetProp(widget.id, f.key, v)}
                />
              )
            case 'pattern':
              return (
                <div className="insp-stack" key={f.key}>
                  <label className="insp-label">{f.label}</label>
                  <PatternField
                    value={(value as PatternId) ?? 'white'}
                    onChange={(v) => updateWidgetProp(widget.id, f.key, v)}
                  />
                </div>
              )
            default:
              return null
          }
        })}
      </div>

      <div className="section-bar">Position</div>
      <div className="insp-group">
        <div className="insp-pair">
          <div className="insp-row">
            <label>X</label>
            <NumberField
              value={widget.x}
              min={-size.w}
              max={size.w}
              onChange={(v) => updateWidget(widget.id, { x: Math.round(v) })}
            />
          </div>
          <div className="insp-row">
            <label>Y</label>
            <NumberField
              value={widget.y}
              min={-size.h}
              max={size.h}
              onChange={(v) => updateWidget(widget.id, { y: Math.round(v) })}
            />
          </div>
        </div>
        <div className="insp-pair">
          <div className="insp-row">
            <label>W</label>
            <NumberField
              value={widget.w}
              min={4}
              max={size.w}
              onChange={(v) => updateWidget(widget.id, { w: Math.round(v) })}
            />
          </div>
          <div className="insp-row">
            <label>H</label>
            <NumberField
              value={widget.h}
              min={4}
              max={size.h}
              onChange={(v) => updateWidget(widget.id, { h: Math.round(v) })}
            />
          </div>
        </div>
        <CheckField
          checked={widget.visible}
          label="Visible"
          onChange={(v) => updateWidget(widget.id, { visible: v })}
        />
      </div>

      <div className="insp-group row" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <button
          className="btn btn-sm has-tip"
          onClick={() => raiseWidget(widget.id, 1)}
          aria-label="Bring forward"
        >
          <IconUp />
          <span className="tip">Bring forward</span>
        </button>
        <button
          className="btn btn-sm has-tip"
          onClick={() => raiseWidget(widget.id, -1)}
          aria-label="Send backward"
        >
          <IconDown />
          <span className="tip">Send backward</span>
        </button>
        <button
          className="btn btn-sm has-tip"
          onClick={() => duplicateWidget(widget.id)}
          aria-label="Duplicate"
        >
          <IconCopy />
          <span className="tip">Duplicate</span>
        </button>
        <button
          className="btn btn-sm has-tip"
          onClick={() => deleteWidget(widget.id)}
          aria-label="Delete"
        >
          <IconTrash />
          <span className="tip">Delete</span>
        </button>
      </div>

      {info.events.length > 0 && (
        <>
          <div className="section-bar">Actions</div>
          {info.events.map((ev) => (
            <ActionEditor key={ev} widget={widget} event={ev} />
          ))}
        </>
      )}
    </>
  )
}
