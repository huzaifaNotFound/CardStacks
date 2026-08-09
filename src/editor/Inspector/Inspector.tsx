import { useStore } from '../../app/store'
import CardInspector from './CardInspector'
import WidgetInspector from './WidgetInspector'

export default function Inspector() {
  const selectedWidgetId = useStore((s) => s.selectedWidgetId)
  const card = useStore((s) => s.stack.cards.find((c) => c.id === s.currentCardId))
  const widget = useStore((s) =>
    s.selectedWidgetId
      ? (s.stack.cards.find((c) => c.id === s.currentCardId)?.widgets.find(
          (w) => w.id === s.selectedWidgetId,
        ) ?? null)
      : null,
  )

  return (
    <div className="inspector col">
      {selectedWidgetId && widget ? (
        <WidgetInspector widget={widget} />
      ) : card ? (
        <CardInspector card={card} />
      ) : null}
    </div>
  )
}
