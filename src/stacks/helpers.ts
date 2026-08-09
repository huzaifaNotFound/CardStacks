import { newCard, newWidget } from '../model/factories'
import type { Action, Card, EventHandler, Stack, Widget, WidgetType } from '../model/types'
import { STACK_SCHEMA } from '../model/types'
import type { PatternId } from '../styles/patterns'

/**
 * Tiny authoring helpers so premade stacks read like a script, not JSON soup.
 * They produce the exact same canonical model a user builds by hand.
 */

export function widget(
  type: WidgetType,
  props: Record<string, unknown>,
  x: number,
  y: number,
  w: number,
  h: number,
  opts: { name?: string; visible?: boolean; events?: EventHandler[] } = {},
): Widget {
  const wg = newWidget(type)
  Object.assign(wg.props, props)
  wg.x = x
  wg.y = y
  wg.w = w
  wg.h = h
  if (opts.name) wg.name = opts.name
  if (opts.visible === false) wg.visible = false
  if (opts.events) wg.events = opts.events
  return wg
}

export function text(
  content: string,
  x: number,
  y: number,
  w: number,
  h: number,
  props: Partial<Record<string, unknown>> = {},
): Widget {
  return widget('text', { content, fontSize: 16, align: 'left', bold: false, italic: false, ...props }, x, y, w, h)
}

export function button(
  label: string,
  x: number,
  y: number,
  w: number,
  h: number,
  actions: Action[] = [],
  props: Partial<Record<string, unknown>> = {},
  opts: { name?: string; visible?: boolean } = {},
): Widget {
  return widget(
    'button',
    { label, style: 'classic', fontSize: 12, enabled: true, ...props },
    x,
    y,
    w,
    h,
    { name: opts.name, visible: opts.visible === false ? false : undefined, events: [{ event: 'click', actions }] },
  )
}

export function field(
  x: number,
  y: number,
  w: number,
  h: number,
  props: Partial<Record<string, unknown>> = {},
): Widget {
  return widget('field', { content: '', placeholder: 'Type here…', multiline: false, editable: true, fontSize: 13, ...props }, x, y, w, h)
}

export function image(
  src: string,
  x: number,
  y: number,
  w: number,
  h: number,
  props: Partial<Record<string, unknown>> = {},
): Widget {
  return widget('image', { src, fit: 'contain', border: true, upload: false, bind: '', ...props }, x, y, w, h)
}

export function slider(
  x: number,
  y: number,
  w: number,
  h: number,
  props: Partial<Record<string, unknown>> = {},
): Widget {
  return widget('slider', { min: 0, max: 100, step: 1, value: 50, bind: '', ...props }, x, y, w, h)
}

export function canvas(
  x: number,
  y: number,
  w: number,
  h: number,
  props: Partial<Record<string, unknown>> = {},
): Widget {
  return widget('canvas', { brush: 2, border: true, ...props }, x, y, w, h)
}

export function shape(
  shape: string,
  x: number,
  y: number,
  w: number,
  h: number,
  props: Partial<Record<string, unknown>> = {},
): Widget {
  return widget('shape', { shape, fill: 'white', filled: false, strokeWidth: 1, ...props }, x, y, w, h)
}

export function card(name: string, widgets: Widget[], background: PatternId = 'white', id?: string): Card {
  const c = newCard(name)
  if (id) c.id = id
  c.background = background
  c.widgets = widgets
  return c
}

export function stack(name: string, cards: Card[], variables: Record<string, string | number> = {}): Stack {
  const now = new Date().toISOString()
  return {
    schema: STACK_SCHEMA,
    id: `ex_${name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
    name,
    size: { w: 640, h: 400 },
    variables,
    cards,
    meta: { createdAt: now, updatedAt: now, version: 1 },
  }
}

/* ---- actions ---- */

export const goto = (cardId: string): Action => ({ type: 'goToCard', cardId })
export const back = (): Action => ({ type: 'goBack' })
export const msg = (message: string): Action => ({ type: 'showMessage', message })
export const setVar = (name: string, value: string | number): Action => ({ type: 'setValue', name, value })
export const changeText = (targetId: string, t: string): Action => ({ type: 'changeText', targetId, text: t })
export const show = (targetId: string, visible: boolean): Action => ({ type: 'setVisibility', targetId, visible })
export const openUrl = (url: string): Action => ({ type: 'openUrl', url })

/** A page title + top rule, used on most example cards. */
export function header(title: string, bg: 'white' | 'black' = 'white'): Widget[] {
  const isBlack = bg === 'black'
  const t = text(title, 40, 28, 560, 32, {
    fontSize: 24,
    bold: true,
    align: 'center',
  })
  if (isBlack) {
    t.props.content = title
  }
  const rule = shape('rect', 40, 66, 560, 1)
  return [t, rule]
}
