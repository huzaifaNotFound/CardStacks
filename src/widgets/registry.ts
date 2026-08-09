import type { WidgetType, WidgetTypeInfo } from '../model/types'

/**
 * The widget registry is the single source of truth for:
 *   - the widget palette / Card menu
 *   - default props on creation
 *   - which properties the inspector exposes (and therefore which actually work)
 *   - which events a widget can fire
 *   - validation of imported / AI-generated stacks
 *
 * Rule: if a property is not listed here, the inspector must not show it.
 */

const ALIGN_OPTIONS = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
]

const FIT_OPTIONS = [
  { label: 'Contain', value: 'contain' },
  { label: 'Cover', value: 'cover' },
  { label: 'Stretch', value: 'fill' },
]

export const WIDGETS: Record<WidgetType, WidgetTypeInfo> = {
  text: {
    type: 'text',
    label: 'Text',
    size: { w: 160, h: 24 },
    canResize: true,
    events: ['click'],
    fields: [
      { key: 'content', label: 'Text', kind: 'textarea', default: 'Text' },
      { key: 'fontSize', label: 'Size', kind: 'number', default: 16 },
      { key: 'align', label: 'Align', kind: 'select', default: 'left', options: ALIGN_OPTIONS },
      { key: 'bold', label: 'Bold', kind: 'checkbox', default: false },
      { key: 'italic', label: 'Italic', kind: 'checkbox', default: false },
    ],
  },

  field: {
    type: 'field',
    label: 'Field',
    size: { w: 200, h: 28 },
    canResize: true,
    events: ['change', 'submit'],
    fields: [
      { key: 'content', label: 'Value', kind: 'textarea', default: '' },
      { key: 'placeholder', label: 'Hint', kind: 'text', default: 'Type here…' },
      { key: 'bind', label: 'Bind', kind: 'text', default: '' },
      { key: 'multiline', label: 'Multi', kind: 'checkbox', default: false },
      { key: 'editable', label: 'Edit', kind: 'checkbox', default: true },
      { key: 'fontSize', label: 'Size', kind: 'number', default: 13 },
    ],
  },

  button: {
    type: 'button',
    label: 'Button',
    size: { w: 120, h: 28 },
    canResize: true,
    events: ['click'],
    fields: [
      { key: 'label', label: 'Label', kind: 'text', default: 'Button' },
      {
        key: 'style',
        label: 'Style',
        kind: 'select',
        default: 'classic',
        options: [
          { label: 'Classic', value: 'classic' },
          { label: 'Default', value: 'default' },
          { label: 'Plain', value: 'plain' },
          { label: 'Invisible', value: 'invisible' },
        ],
      },
      { key: 'fontSize', label: 'Size', kind: 'number', default: 12 },
      { key: 'enabled', label: 'Enabled', kind: 'checkbox', default: true },
    ],
  },

  image: {
    type: 'image',
    label: 'Image',
    size: { w: 160, h: 120 },
    canResize: true,
    events: ['click'],
    fields: [
      { key: 'src', label: 'Source', kind: 'text', default: '' },
      { key: 'fit', label: 'Fit', kind: 'select', default: 'contain', options: FIT_OPTIONS },
      { key: 'border', label: 'Border', kind: 'checkbox', default: true },
      { key: 'upload', label: 'Upload', kind: 'checkbox', default: false },
      { key: 'bind', label: 'Bind', kind: 'text', default: '' },
    ],
  },

  shape: {
    type: 'shape',
    label: 'Shape',
    size: { w: 120, h: 80 },
    canResize: true,
    events: ['click'],
    fields: [
      {
        key: 'shape',
        label: 'Kind',
        kind: 'select',
        default: 'rect',
        options: [
          { label: 'Rectangle', value: 'rect' },
          { label: 'Oval', value: 'oval' },
          { label: 'Line', value: 'line' },
        ],
      },
      { key: 'fill', label: 'Fill', kind: 'pattern', default: 'white' },
      { key: 'filled', label: 'Filled', kind: 'checkbox', default: false },
      { key: 'strokeWidth', label: 'Stroke', kind: 'number', default: 1 },
    ],
  },

  slider: {
    type: 'slider',
    label: 'Slider',
    size: { w: 180, h: 24 },
    canResize: true,
    events: ['change'],
    fields: [
      { key: 'min', label: 'Min', kind: 'number', default: 0 },
      { key: 'max', label: 'Max', kind: 'number', default: 100 },
      { key: 'step', label: 'Step', kind: 'number', default: 1 },
      { key: 'value', label: 'Value', kind: 'number', default: 50 },
      { key: 'bind', label: 'Bind', kind: 'text', default: '' },
    ],
  },

  canvas: {
    type: 'canvas',
    label: 'Canvas',
    size: { w: 240, h: 180 },
    canResize: true,
    events: [],
    fields: [
      { key: 'brush', label: 'Brush', kind: 'number', default: 2 },
      { key: 'border', label: 'Border', kind: 'checkbox', default: true },
    ],
  },

  grid: {
    type: 'grid',
    label: 'Grid',
    size: { w: 260, h: 120 },
    canResize: true,
    events: [],
    fields: [
      { key: 'rows', label: 'Rows', kind: 'number', default: 3 },
      { key: 'cols', label: 'Cols', kind: 'number', default: 3 },
      { key: 'headers', label: 'Header', kind: 'checkbox', default: true },
      { key: 'data', label: 'Cells', kind: 'textarea', default: 'A,B,C\n1,2,3\n4,5,6' },
    ],
  },
}

/** Order shown in the widget palette and Card menu. */
export const PALETTE_ORDER: WidgetType[] = [
  'text',
  'button',
  'field',
  'image',
  'slider',
  'canvas',
  'grid',
]

export const WIDGET_TYPES = Object.keys(WIDGETS) as WidgetType[]

export function isWidgetType(v: unknown): v is WidgetType {
  return typeof v === 'string' && v in WIDGETS
}

/** Human label for a widget instance, used by action target dropdowns. */
export function widgetDisplayName(w: { id: string; type: WidgetType; name?: string }): string {
  if (w.name && w.name.trim()) return w.name
  return `${WIDGETS[w.type].label} ${w.id.slice(-4)}`
}
