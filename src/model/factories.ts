import { nanoid } from 'nanoid'
import type { Card, EventHandler, Stack, Widget, WidgetType } from './types'
import { STACK_SCHEMA } from './types'
import { WIDGETS } from '../widgets/registry'

export const CARD_W = 640
export const CARD_H = 400

export const newId = (prefix: string) => `${prefix}_${nanoid(8)}`

export function newWidget(type: WidgetType, x = 0, y = 0): Widget {
  const info = WIDGETS[type]
  const props: Record<string, unknown> = {}
  for (const f of info.fields) props[f.key] = f.default

  const events: EventHandler[] = []

  return {
    id: newId('w'),
    type,
    x: Math.round(x),
    y: Math.round(y),
    w: info.size.w,
    h: info.size.h,
    visible: true,
    props,
    events,
  }
}

export function newCard(name = 'Card'): Card {
  return {
    id: newId('c'),
    name,
    background: 'white',
    widgets: [],
    events: [],
  }
}

export function newStack(name = 'Untitled Stack'): Stack {
  const now = new Date().toISOString()
  return {
    schema: STACK_SCHEMA,
    id: newId('s'),
    name,
    size: { w: CARD_W, h: CARD_H },
    variables: {},
    cards: [newCard('Home')],
    meta: { createdAt: now, updatedAt: now, version: 1 },
  }
}

/** Deep clone via JSON: the model is pure data by design. */
export function cloneStack(stack: Stack): Stack {
  return JSON.parse(JSON.stringify(stack)) as Stack
}

/** Duplicate a card, giving fresh ids to the card and all its widgets. */
export function duplicateCard(card: Card): Card {
  const copy: Card = JSON.parse(JSON.stringify(card))
  copy.id = newId('c')
  copy.name = `${card.name} copy`
  copy.widgets = copy.widgets.map((w) => ({ ...w, id: newId('w') }))
  return copy
}

export function duplicateWidget(widget: Widget): Widget {
  const copy: Widget = JSON.parse(JSON.stringify(widget))
  copy.id = newId('w')
  copy.x += 8
  copy.y += 8
  return copy
}
