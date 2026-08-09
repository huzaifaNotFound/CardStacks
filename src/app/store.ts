import { create } from 'zustand'
import type { Action, Card, EventHandler, Stack, Widget, WidgetType } from '../model/types'
import {
  CARD_H,
  CARD_W,
  cloneStack,
  duplicateCard,
  duplicateWidget,
  newCard,
  newStack,
  newWidget,
} from '../model/factories'

export type View = 'home' | 'editor' | 'run'

export type Tool =
  | 'interact'
  | 'widgets'
  | 'select'
  | 'pencil'
  | 'eraser'
  | 'line'
  | 'box'
  | 'boxFilled'
  | 'oval'
  | 'ovalFilled'
  | 'text'

const HISTORY_LIMIT = 40

interface EditorState {
  view: View
  stack: Stack
  currentCardId: string
  selectedWidgetId: string | null
  tool: Tool
  showGrid: boolean
  snapToGrid: boolean
  dirty: boolean
  lastSavedAt: string | null

  past: Stack[]
  future: Stack[]

  /** Runtime variable state, live during interact/run. Never persisted. */
  runtimeVars: Record<string, string | number>
  /** Runtime card navigation history (drives goBack). Never persisted. */
  navHistory: string[]
  /** Modal message shown via the showMessage action. */
  runtimeMessage: string | null
}

interface EditorActions {
  setView: (v: View) => void
  setTool: (t: Tool) => void
  toggleGrid: () => void
  toggleSnap: () => void

  loadStack: (s: Stack, opts?: { markSaved?: boolean }) => void
  newStack: () => void
  renameStack: (name: string) => void
  markSaved: () => void

  selectCard: (cardId: string) => void
  addCard: () => void
  deleteCard: (cardId: string) => void
  renameCard: (cardId: string, name: string) => void
  moveCard: (cardId: string, delta: number) => void
  duplicateCard: (cardId: string) => void
  setCardBackground: (cardId: string, background: Card['background']) => void
  setCardDrawing: (cardId: string, drawing: string | undefined) => void

  selectWidget: (id: string | null) => void
  addWidget: (type: WidgetType, at?: { x: number; y: number }) => string
  insertWidget: (widget: Widget) => string
  updateWidget: (id: string, patch: Partial<Widget>, opts?: { transient?: boolean }) => void
  updateWidgetProp: (id: string, key: string, value: unknown) => void
  deleteWidget: (id: string) => void
  duplicateWidget: (id: string) => void
  raiseWidget: (id: string, delta: number) => void

  setWidgetEvents: (id: string, events: EventHandler[]) => void
  setEventActions: (id: string, event: EventHandler['event'], actions: Action[]) => void

  commit: () => void
  undo: () => void
  redo: () => void

  setRuntimeVar: (name: string, value: string | number) => void
  resetRuntimeVars: () => void
  setRuntimeMessage: (message: string | null) => void
  runtimeGoToCard: (cardId: string) => void
  runtimeGoBack: () => void
  runtimeSetWidgetProp: (id: string, key: string, value: unknown) => void

  currentCard: () => Card
  selectedWidget: () => Widget | null
}

export type Store = EditorState & EditorActions

const initial = newStack()

/** Snapshot the current stack into the undo history. */
function pushHistory(state: EditorState): Partial<EditorState> {
  const past = [...state.past, cloneStack(state.stack)]
  if (past.length > HISTORY_LIMIT) past.shift()
  return { past, future: [] }
}

function touch(stack: Stack): Stack {
  stack.meta.updatedAt = new Date().toISOString()
  return stack
}

export const useStore = create<Store>((set, get) => ({
  view: 'home',
  stack: initial,
  currentCardId: initial.cards[0].id,
  selectedWidgetId: null,
  tool: 'widgets',
  showGrid: true,
  snapToGrid: true,
  dirty: false,
  lastSavedAt: null,
  past: [],
  future: [],
  runtimeVars: {},
  navHistory: [],
  runtimeMessage: null,

  setView: (view) => set({ view }),
  setTool: (tool) =>
    set((s) => ({
      tool,
      selectedWidgetId: tool === 'widgets' || tool === 'select' ? s.selectedWidgetId : null,
    })),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleSnap: () => set((s) => ({ snapToGrid: !s.snapToGrid })),

  loadStack: (s, opts) =>
    set({
      stack: cloneStack(s),
      currentCardId: s.cards[0]?.id ?? '',
      selectedWidgetId: null,
      past: [],
      future: [],
      dirty: !opts?.markSaved,
      lastSavedAt: opts?.markSaved ? new Date().toISOString() : null,
      runtimeVars: {},
      navHistory: [],
      runtimeMessage: null,
    }),

  newStack: () => {
    const s = newStack()
    get().loadStack(s)
  },

  renameStack: (name) =>
    set((state) => ({
      ...pushHistory(state),
      stack: touch({ ...state.stack, name }),
      dirty: true,
    })),

  markSaved: () => set({ dirty: false, lastSavedAt: new Date().toISOString() }),

  selectCard: (cardId) => set({ currentCardId: cardId, selectedWidgetId: null }),

  addCard: () =>
    set((state) => {
      const card = newCard(`Card ${state.stack.cards.length + 1}`)
      const cards = [...state.stack.cards, card]
      return {
        ...pushHistory(state),
        stack: touch({ ...state.stack, cards }),
        currentCardId: card.id,
        selectedWidgetId: null,
        dirty: true,
      }
    }),

  deleteCard: (cardId) =>
    set((state) => {
      if (state.stack.cards.length <= 1) return {}
      const idx = state.stack.cards.findIndex((c) => c.id === cardId)
      if (idx < 0) return {}
      const cards = state.stack.cards.filter((c) => c.id !== cardId)
      const nextId =
        state.currentCardId === cardId ? cards[Math.min(idx, cards.length - 1)].id : state.currentCardId
      return {
        ...pushHistory(state),
        stack: touch({ ...state.stack, cards }),
        currentCardId: nextId,
        selectedWidgetId: null,
        dirty: true,
      }
    }),

  renameCard: (cardId, name) =>
    set((state) => ({
      ...pushHistory(state),
      stack: touch({
        ...state.stack,
        cards: state.stack.cards.map((c) => (c.id === cardId ? { ...c, name } : c)),
      }),
      dirty: true,
    })),

  moveCard: (cardId, delta) =>
    set((state) => {
      const cards = [...state.stack.cards]
      const i = cards.findIndex((c) => c.id === cardId)
      const j = i + delta
      if (i < 0 || j < 0 || j >= cards.length) return {}
      ;[cards[i], cards[j]] = [cards[j], cards[i]]
      return {
        ...pushHistory(state),
        stack: touch({ ...state.stack, cards }),
        dirty: true,
      }
    }),

  duplicateCard: (cardId) =>
    set((state) => {
      const i = state.stack.cards.findIndex((c) => c.id === cardId)
      if (i < 0) return {}
      const copy = duplicateCard(state.stack.cards[i])
      const cards = [...state.stack.cards]
      cards.splice(i + 1, 0, copy)
      return {
        ...pushHistory(state),
        stack: touch({ ...state.stack, cards }),
        currentCardId: copy.id,
        selectedWidgetId: null,
        dirty: true,
      }
    }),

  setCardBackground: (cardId, background) =>
    set((state) => ({
      ...pushHistory(state),
      stack: touch({
        ...state.stack,
        cards: state.stack.cards.map((c) => (c.id === cardId ? { ...c, background } : c)),
      }),
      dirty: true,
    })),

  setCardDrawing: (cardId, drawing) =>
    set((state) => ({
      stack: touch({
        ...state.stack,
        cards: state.stack.cards.map((c) => (c.id === cardId ? { ...c, drawing } : c)),
      }),
      dirty: true,
    })),

  selectWidget: (id) => set({ selectedWidgetId: id }),

  addWidget: (type, at) => {
    const state = get()
    const card = state.stack.cards.find((c) => c.id === state.currentCardId)
    if (!card) return ''
    const w = newWidget(type)
    if (at) {
      w.x = at.x
      w.y = at.y
    } else {
      w.x = Math.round((state.stack.size.w - w.w) / 2)
      w.y = Math.round((state.stack.size.h - w.h) / 2)
      // offset if something already sits there
      const clash = card.widgets.some((o) => o.x === w.x && o.y === w.y)
      if (clash) {
        w.x += 12
        w.y += 12
      }
    }
    w.x = Math.max(0, Math.min(w.x, state.stack.size.w - w.w))
    w.y = Math.max(0, Math.min(w.y, state.stack.size.h - w.h))
    return get().insertWidget(w)
  },

  insertWidget: (widget) => {
    set((state) => ({
      ...pushHistory(state),
      stack: touch({
        ...state.stack,
        cards: state.stack.cards.map((c) =>
          c.id === state.currentCardId ? { ...c, widgets: [...c.widgets, widget] } : c,
        ),
      }),
      selectedWidgetId: widget.id,
      dirty: true,
    }))
    return widget.id
  },

  updateWidget: (id, patch, opts) =>
    set((state) => {
      const history = opts?.transient ? {} : pushHistory(state)
      return {
        ...history,
        stack: touch({
          ...state.stack,
          cards: state.stack.cards.map((c) =>
            c.id === state.currentCardId
              ? { ...c, widgets: c.widgets.map((w) => (w.id === id ? { ...w, ...patch } : w)) }
              : c,
          ),
        }),
        dirty: true,
      }
    }),

  updateWidgetProp: (id, key, value) =>
    set((state) => ({
      ...pushHistory(state),
      stack: touch({
        ...state.stack,
        cards: state.stack.cards.map((c) =>
          c.id === state.currentCardId
            ? {
                ...c,
                widgets: c.widgets.map((w) =>
                  w.id === id ? { ...w, props: { ...w.props, [key]: value } } : w,
                ),
              }
            : c,
        ),
      }),
      dirty: true,
    })),

  deleteWidget: (id) =>
    set((state) => ({
      ...pushHistory(state),
      stack: touch({
        ...state.stack,
        cards: state.stack.cards.map((c) =>
          c.id === state.currentCardId ? { ...c, widgets: c.widgets.filter((w) => w.id !== id) } : c,
        ),
      }),
      selectedWidgetId: state.selectedWidgetId === id ? null : state.selectedWidgetId,
      dirty: true,
    })),

  duplicateWidget: (id) => {
    const state = get()
    const card = state.stack.cards.find((c) => c.id === state.currentCardId)
    const w = card?.widgets.find((x) => x.id === id)
    if (!w) return
    get().insertWidget(duplicateWidget(w))
  },

  raiseWidget: (id, delta) =>
    set((state) => {
      const card = state.stack.cards.find((c) => c.id === state.currentCardId)
      if (!card) return {}
      const widgets = [...card.widgets]
      const i = widgets.findIndex((w) => w.id === id)
      const j = i + delta
      if (i < 0 || j < 0 || j >= widgets.length) return {}
      ;[widgets[i], widgets[j]] = [widgets[j], widgets[i]]
      return {
        ...pushHistory(state),
        stack: touch({
          ...state.stack,
          cards: state.stack.cards.map((c) => (c.id === card.id ? { ...c, widgets } : c)),
        }),
        dirty: true,
      }
    }),

  setWidgetEvents: (id, events) =>
    set((state) => ({
      ...pushHistory(state),
      stack: touch({
        ...state.stack,
        cards: state.stack.cards.map((c) =>
          c.id === state.currentCardId
            ? { ...c, widgets: c.widgets.map((w) => (w.id === id ? { ...w, events } : w)) }
            : c,
        ),
      }),
      dirty: true,
    })),

  setEventActions: (id, event, actions) => {
    const state = get()
    const card = state.stack.cards.find((c) => c.id === state.currentCardId)
    const w = card?.widgets.find((x) => x.id === id)
    if (!w) return
    const others = w.events.filter((e) => e.event !== event)
    const next: EventHandler[] = actions.length ? [...others, { event, actions }] : others
    get().setWidgetEvents(id, next)
  },

  commit: () => set((state) => ({ ...pushHistory(state) })),

  undo: () =>
    set((state) => {
      if (!state.past.length) return {}
      const past = [...state.past]
      const prev = past.pop()!
      return {
        past,
        future: [cloneStack(state.stack), ...state.future].slice(0, HISTORY_LIMIT),
        stack: prev,
        currentCardId: prev.cards.some((c) => c.id === state.currentCardId)
          ? state.currentCardId
          : prev.cards[0].id,
        selectedWidgetId: null,
        dirty: true,
      }
    }),

  redo: () =>
    set((state) => {
      if (!state.future.length) return {}
      const [next, ...rest] = state.future
      return {
        past: [...state.past, cloneStack(state.stack)].slice(-HISTORY_LIMIT),
        future: rest,
        stack: next,
        currentCardId: next.cards.some((c) => c.id === state.currentCardId)
          ? state.currentCardId
          : next.cards[0].id,
        selectedWidgetId: null,
        dirty: true,
      }
    }),

  setRuntimeVar: (name, value) =>
    set((state) => ({ runtimeVars: { ...state.runtimeVars, [name]: value } })),

  resetRuntimeVars: () => set((state) => ({ runtimeVars: { ...state.stack.variables } })),

  setRuntimeMessage: (message) => set({ runtimeMessage: message }),

  runtimeGoToCard: (cardId) =>
    set((state) =>
      state.stack.cards.some((c) => c.id === cardId)
        ? {
            navHistory: [...state.navHistory, state.currentCardId],
            currentCardId: cardId,
            selectedWidgetId: null,
          }
        : {},
    ),

  runtimeGoBack: () =>
    set((state) => {
      if (!state.navHistory.length) return {}
      const prev = state.navHistory[state.navHistory.length - 1]
      return {
        navHistory: state.navHistory.slice(0, -1),
        currentCardId: prev,
        selectedWidgetId: null,
      }
    }),

  runtimeSetWidgetProp: (id, key, value) =>
    set((state) => ({
      stack: touch({
        ...state.stack,
        cards: state.stack.cards.map((c) =>
          c.id === state.currentCardId
            ? {
                ...c,
                widgets: c.widgets.map((w) =>
                  w.id === id || (w.name && w.name === id)
                    ? { ...w, props: { ...w.props, [key]: value } }
                    : w,
                ),
              }
            : c,
        ),
      }),
    })),

  currentCard: () => {
    const s = get()
    return s.stack.cards.find((c) => c.id === s.currentCardId) ?? s.stack.cards[0]
  },

  selectedWidget: () => {
    const s = get()
    if (!s.selectedWidgetId) return null
    const card = s.stack.cards.find((c) => c.id === s.currentCardId)
    return card?.widgets.find((w) => w.id === s.selectedWidgetId) ?? null
  },
}))

export { CARD_W, CARD_H }
