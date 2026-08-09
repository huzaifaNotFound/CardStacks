import { interpolate } from '../model/interpolate'
import type { Action, EventHandler, Widget } from '../model/types'

/**
 * The ONE action interpreter.
 *
 * Semantics are identical everywhere; only the context adapter differs:
 *   - editor Interact mode supplies a store-backed context
 *   - Run mode and exported HTML supply a DOM-backed context
 *
 * There is no separate action engine for the runtime or for AI output.
 */

export interface RuntimeContext {
  /** Live variable bag. */
  variables: Record<string, string | number>
  getVariable: (name: string) => string | number | undefined
  setVariable: (name: string, value: string | number) => void
  getWidget: (id: string) => Widget | null
  setWidgetProp: (id: string, key: string, value: unknown) => void
  goToCard: (cardId: string) => void
  goBack: () => void
  showMessage: (message: string) => void
  openUrl: (url: string) => void
}

export function runAction(action: Action, ctx: RuntimeContext): void {
  const vars = ctx.variables
  switch (action.type) {
    case 'goToCard':
      ctx.goToCard(action.cardId)
      break
    case 'goBack':
      ctx.goBack()
      break
    case 'showMessage':
      ctx.showMessage(interpolate(action.message, vars))
      break
    case 'changeText':
      ctx.setWidgetProp(action.targetId, 'content', interpolate(action.text, vars))
      break
    case 'setValue':
      ctx.setVariable(action.name, interpolate(String(action.value), vars))
      break
    case 'setVisibility':
      ctx.setWidgetProp(action.targetId, 'visible', action.visible)
      break
    case 'openUrl':
      ctx.openUrl(interpolate(action.url, vars))
      break
  }
}

export function runActions(actions: Action[] | undefined, ctx: RuntimeContext): void {
  if (!actions) return
  for (const a of actions) runAction(a, ctx)
}

/** Fire the event handler (if any) on a widget. */
export function dispatchEvent(
  widget: Widget,
  event: EventHandler['event'],
  ctx: RuntimeContext,
): void {
  const handler = widget.events?.find((e) => e.event === event)
  if (handler) runActions(handler.actions, ctx)
}
