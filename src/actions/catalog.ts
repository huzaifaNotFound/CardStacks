import type { Action } from '../model/types'

/**
 * Metadata that drives the action editor's dropdowns and fields.
 * One canonical definition of every user-facing behavior — used by the
 * editor UI, the runtime interpreter, and future AI generation.
 */

export type ActionFieldKind = 'card' | 'widget' | 'text' | 'bool' | 'var'

export interface ActionFieldDef {
  /** Property key on the Action object. */
  key: string
  label: string
  kind: ActionFieldKind
}

export interface ActionMeta {
  type: Action['type']
  label: string
  fields: ActionFieldDef[]
  /** Build a fresh action of this type with sensible defaults. */
  create: () => Action
}

export const ACTION_CATALOG: ActionMeta[] = [
  {
    type: 'goToCard',
    label: 'Go to Card',
    fields: [{ key: 'cardId', label: 'Target', kind: 'card' }],
    create: () => ({ type: 'goToCard', cardId: '' }),
  },
  {
    type: 'goBack',
    label: 'Go Back',
    fields: [],
    create: () => ({ type: 'goBack' }),
  },
  {
    type: 'showMessage',
    label: 'Show Message',
    fields: [{ key: 'message', label: 'Message', kind: 'text' }],
    create: () => ({ type: 'showMessage', message: 'Hello!' }),
  },
  {
    type: 'changeText',
    label: 'Change Text',
    fields: [
      { key: 'targetId', label: 'Target', kind: 'widget' },
      { key: 'text', label: 'Text', kind: 'text' },
    ],
    create: () => ({ type: 'changeText', targetId: '', text: '' }),
  },
  {
    type: 'setValue',
    label: 'Set Value',
    fields: [
      { key: 'name', label: 'Variable', kind: 'var' },
      { key: 'value', label: 'Value', kind: 'text' },
    ],
    create: () => ({ type: 'setValue', name: 'score', value: 0 }),
  },
  {
    type: 'setVisibility',
    label: 'Set Visibility',
    fields: [
      { key: 'targetId', label: 'Target', kind: 'widget' },
      { key: 'visible', label: 'Show', kind: 'bool' },
    ],
    create: () => ({ type: 'setVisibility', targetId: '', visible: false }),
  },
  {
    type: 'openUrl',
    label: 'Open URL',
    fields: [{ key: 'url', label: 'URL', kind: 'text' }],
    create: () => ({ type: 'openUrl', url: 'https://' }),
  },
]

export const ACTION_BY_TYPE = new Map(ACTION_CATALOG.map((a) => [a.type, a]))

export function actionMeta(type: Action['type']): ActionMeta {
  return ACTION_BY_TYPE.get(type) ?? ACTION_CATALOG[0]
}
