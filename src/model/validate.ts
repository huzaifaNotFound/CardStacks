import type { Action, Card, EventHandler, Stack, Widget } from './types'
import { STACK_SCHEMA } from './types'
import { WIDGETS, isWidgetType } from '../widgets/registry'
import { PATTERN_IDS } from '../styles/patterns'
import { CARD_H, CARD_W, newId } from './factories'

/**
 * Coercing validator. Never throws on recoverable problems: it repairs.
 *
 * Used by:
 *   - .stack import
 *   - exported-HTML import
 *   - premade stack loading (a safety net during authoring)
 *   - future AI generation (identical gate, no separate path)
 */

export interface ValidationResult {
  stack: Stack
  warnings: string[]
}

export class StackFormatError extends Error {}

const ACTION_TYPES = new Set<Action['type']>([
  'goToCard',
  'goBack',
  'showMessage',
  'changeText',
  'setValue',
  'setVisibility',
  'openUrl',
])

const EVENT_NAMES = new Set<EventHandler['event']>(['click', 'change', 'submit', 'load'])

const num = (v: unknown, fallback: number): number => {
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : fallback
}

const str = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback)

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

function validateActions(raw: unknown, cardIds: Set<string>, warn: (m: string) => void): Action[] {
  if (!Array.isArray(raw)) return []
  const out: Action[] = []

  for (const a of raw) {
    if (!a || typeof a !== 'object') continue
    const t = (a as { type?: unknown }).type
    if (typeof t !== 'string' || !ACTION_TYPES.has(t as Action['type'])) {
      warn(`Dropped unknown action "${String(t)}"`)
      continue
    }
    const o = a as Record<string, unknown>

    switch (t as Action['type']) {
      case 'goToCard': {
        const cardId = str(o.cardId)
        if (!cardIds.has(cardId)) {
          warn(`Action goToCard pointed at missing card "${cardId}"`)
          continue
        }
        out.push({ type: 'goToCard', cardId })
        break
      }
      case 'goBack':
        out.push({ type: 'goBack' })
        break
      case 'showMessage':
        out.push({ type: 'showMessage', message: str(o.message) })
        break
      case 'changeText':
        out.push({ type: 'changeText', targetId: str(o.targetId), text: str(o.text) })
        break
      case 'setValue': {
        const value = typeof o.value === 'number' ? o.value : str(o.value)
        out.push({ type: 'setValue', name: str(o.name), value })
        break
      }
      case 'setVisibility':
        out.push({
          type: 'setVisibility',
          targetId: str(o.targetId),
          visible: o.visible !== false,
        })
        break
      case 'openUrl':
        out.push({ type: 'openUrl', url: str(o.url) })
        break
    }
  }

  return out
}

function validateEvents(
  raw: unknown,
  allowed: Set<EventHandler['event']>,
  cardIds: Set<string>,
  warn: (m: string) => void,
): EventHandler[] {
  if (!Array.isArray(raw)) return []
  const out: EventHandler[] = []
  for (const e of raw) {
    if (!e || typeof e !== 'object') continue
    const name = (e as { event?: unknown }).event
    if (typeof name !== 'string' || !EVENT_NAMES.has(name as EventHandler['event'])) continue
    if (allowed.size && !allowed.has(name as EventHandler['event'])) {
      warn(`Dropped unsupported event "${name}"`)
      continue
    }
    const actions = validateActions((e as { actions?: unknown }).actions, cardIds, warn)
    if (actions.length) out.push({ event: name as EventHandler['event'], actions })
  }
  return out
}

function validateWidget(
  raw: unknown,
  size: { w: number; h: number },
  cardIds: Set<string>,
  warn: (m: string) => void,
): Widget | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>

  if (!isWidgetType(o.type)) {
    warn(`Dropped widget of unknown type "${String(o.type)}"`)
    return null
  }
  const info = WIDGETS[o.type]

  const w = clamp(num(o.w, info.size.w), 4, size.w)
  const h = clamp(num(o.h, info.size.h), 4, size.h)
  const x = clamp(num(o.x, 0), -size.w, size.w)
  const y = clamp(num(o.y, 0), -size.h, size.h)

  const props: Record<string, unknown> = {}
  const incoming = (o.props && typeof o.props === 'object' ? o.props : {}) as Record<string, unknown>
  for (const f of info.fields) {
    const v = incoming[f.key]
    if (v === undefined) {
      props[f.key] = f.default
      continue
    }
    switch (f.kind) {
      case 'number':
        props[f.key] = num(v, f.default as number)
        break
      case 'checkbox':
        props[f.key] = Boolean(v)
        break
      case 'pattern':
        props[f.key] = PATTERN_IDS.includes(v as never) ? v : f.default
        break
      case 'select':
        props[f.key] = f.options?.some((op) => op.value === v) ? v : f.default
        break
      default:
        props[f.key] = typeof v === 'string' ? v : String(v ?? '')
    }
  }

  return {
    id: str(o.id) || newId('w'),
    type: o.type,
    name: typeof o.name === 'string' && o.name.trim() ? o.name : undefined,
    x,
    y,
    w,
    h,
    visible: o.visible !== false,
    props,
    events: validateEvents(o.events, new Set(info.events), cardIds, warn),
  }
}

function validateCard(
  raw: unknown,
  size: { w: number; h: number },
  cardIds: Set<string>,
  index: number,
  warn: (m: string) => void,
): Card {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const widgets: Widget[] = []
  if (Array.isArray(o.widgets)) {
    for (const rw of o.widgets) {
      const w = validateWidget(rw, size, cardIds, warn)
      if (w) widgets.push(w)
    }
  }

  const background = PATTERN_IDS.includes(o.background as never)
    ? (o.background as Card['background'])
    : 'white'

  const drawing = typeof o.drawing === 'string' && o.drawing.startsWith('data:image/')
    ? o.drawing
    : undefined

  return {
    id: str(o.id) || newId('c'),
    name: str(o.name) || `Card ${index + 1}`,
    background,
    drawing,
    widgets,
    events: validateEvents(o.events, new Set(['load']), cardIds, warn),
  }
}

/** Parse + repair an unknown value into a valid Stack. Throws only if unusable. */
export function validateStack(raw: unknown): ValidationResult {
  const warnings: string[] = []
  const warn = (m: string) => {
    if (warnings.length < 40) warnings.push(m)
  }

  if (!raw || typeof raw !== 'object') {
    throw new StackFormatError('This file does not contain a CardStacks stack.')
  }
  const o = raw as Record<string, unknown>

  if (typeof o.schema !== 'string' || !o.schema.startsWith('cardstacks/')) {
    throw new StackFormatError('Missing or unrecognised CardStacks schema marker.')
  }
  if (o.schema !== STACK_SCHEMA) {
    warn(`Stack was made with schema "${o.schema}"; opened as ${STACK_SCHEMA}.`)
  }
  if (!Array.isArray(o.cards) || o.cards.length === 0) {
    throw new StackFormatError('Stack contains no cards.')
  }

  const size = {
    w: clamp(num((o.size as { w?: unknown })?.w, CARD_W), 120, 2000),
    h: clamp(num((o.size as { h?: unknown })?.h, CARD_H), 120, 2000),
  }

  // First pass: collect card ids so goToCard targets can be checked.
  const rawCards = o.cards as unknown[]
  const ids: string[] = []
  const seen = new Set<string>()
  for (const rc of rawCards) {
    let id = str((rc as Record<string, unknown>)?.id)
    if (!id || seen.has(id)) id = newId('c')
    seen.add(id)
    ids.push(id)
  }
  const cardIds = new Set(ids)

  const cards: Card[] = rawCards.map((rc, i) => {
    const card = validateCard(rc, size, cardIds, i, warn)
    card.id = ids[i]
    return card
  })

  const variables: Record<string, string | number> = {}
  if (o.variables && typeof o.variables === 'object') {
    for (const [k, v] of Object.entries(o.variables as Record<string, unknown>)) {
      if (typeof v === 'number' || typeof v === 'string') variables[k] = v
    }
  }

  const meta = (o.meta && typeof o.meta === 'object' ? o.meta : {}) as Record<string, unknown>
  const now = new Date().toISOString()

  const stack: Stack = {
    schema: STACK_SCHEMA,
    id: str(o.id) || newId('s'),
    name: str(o.name) || 'Untitled Stack',
    size,
    variables,
    cards,
    meta: {
      createdAt: str(meta.createdAt) || now,
      updatedAt: now,
      version: 1,
    },
  }

  return { stack, warnings }
}
