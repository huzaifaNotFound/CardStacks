import { useStore } from '../app/store'
import type { RuntimeContext } from './run'

/**
 * Store-backed context for editor Interact mode.
 * Shares `runAction` semantics with Run mode and the exported runtime.
 */
export function editorContext(): RuntimeContext {
  const s = useStore.getState()
  return {
    variables: s.runtimeVars,
    getVariable: (n) => s.runtimeVars[n],
    setVariable: (n, v) => s.setRuntimeVar(n, String(v)),
    getWidget: (id) =>
      s.stack.cards
        .find((c) => c.id === s.currentCardId)
        ?.widgets.find((w) => w.id === id || (w.name && w.name === id)) ?? null,
    setWidgetProp: (id, key, value) => s.runtimeSetWidgetProp(id, key, value),
    goToCard: (cardId) => s.runtimeGoToCard(cardId),
    goBack: () => s.runtimeGoBack(),
    showMessage: (message) => s.setRuntimeMessage(message),
    openUrl: (url) => window.open(url, '_blank', 'noopener'),
  }
}
