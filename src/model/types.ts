/**
 * CardStacks canonical data model.
 *
 * Every representation flows through these types:
 *   editor  -> Stack (zustand store)
 *   runtime -> Stack (renders it)
 *   AI      -> Stack (generates it)
 *   .stack  -> Serialized Stack JSON
 *   export  -> Stack JSON embedded in standalone HTML
 *
 * There is exactly ONE model. Do not create parallel shapes.
 */

import type { PatternId } from '../styles/patterns'

export const STACK_SCHEMA = 'cardstacks/1'

export interface Vec2 {
  w: number
  h: number
}

/** Widget types that exist in the system. */
export type WidgetType =
  | 'text'
  | 'field'
  | 'button'
  | 'image'
  | 'shape'
  | 'slider'
  | 'canvas'
  | 'grid'

/** A declarative action. These are the ONLY user-facing behaviors. */
export type Action =
  | { type: 'goToCard'; cardId: string }
  | { type: 'goBack' }
  | { type: 'showMessage'; message: string }
  | { type: 'changeText'; targetId: string; text: string }
  | { type: 'setValue'; name: string; value: string | number }
  | { type: 'setVisibility'; targetId: string; visible: boolean }
  | { type: 'openUrl'; url: string }

export interface EventHandler {
  event: 'click' | 'change' | 'submit' | 'load'
  actions: Action[]
}

export interface Widget {
  id: string
  type: WidgetType
  name?: string
  x: number
  y: number
  w: number
  h: number
  visible: boolean
  /** Type-specific flat props. See DEFAULT_PROPS in widgets/registry. */
  props: Record<string, unknown>
  events: EventHandler[]
}

export interface Card {
  id: string
  name: string
  background: PatternId
  /** PNG dataURL of the freehand drawing layer. Omitted when untouched. */
  drawing?: string
  widgets: Widget[]
  events: EventHandler[]
}

export interface Stack {
  schema: typeof STACK_SCHEMA
  id: string
  name: string
  size: { w: number; h: number }
  variables: Record<string, string | number>
  cards: Card[]
  meta: {
    createdAt: string
    updatedAt: string
    version: 1
  }
}

/** Widget props shape, per type. Properties the inspector exposes. */
export interface WidgetPropSpec {
  key: string
  label: string
  kind: 'text' | 'number' | 'select' | 'checkbox' | 'pattern' | 'textarea'
  default: unknown
  options?: { label: string; value: string | number }[]
}

/** Static metadata about a widget type, driving the editor + palette + validation. */
export interface WidgetTypeInfo {
  type: WidgetType
  label: string
  /** Default size on creation. */
  size: { w: number; h: number }
  /** Props relevant to the inspector. Keep small! */
  fields: WidgetPropSpec[]
  /** Events the widget can expose. */
  events: Array<EventHandler['event']>
  canResize: boolean
}