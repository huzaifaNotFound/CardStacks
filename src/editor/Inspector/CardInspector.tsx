import { useStore } from '../../app/store'
import type { Card } from '../../model/types'
import { CheckField, NumberField, PatternField, TextField } from './fields'

export default function CardInspector({ card }: { card: Card }) {
  const renameCard = useStore((s) => s.renameCard)
  const setCardBackground = useStore((s) => s.setCardBackground)
  const size = useStore((s) => s.stack.size)
  const showGrid = useStore((s) => s.showGrid)
  const snapToGrid = useStore((s) => s.snapToGrid)
  const toggleGrid = useStore((s) => s.toggleGrid)
  const toggleSnap = useStore((s) => s.toggleSnap)
  const cardIndex = useStore((s) => s.stack.cards.findIndex((c) => c.id === card.id))
  const cardCount = useStore((s) => s.stack.cards.length)
  const setCardDrawing = useStore((s) => s.setCardDrawing)

  return (
    <>
      <div className="section-bar">Card</div>

      <div className="insp-group">
        <div className="insp-row">
          <label>Name</label>
          <TextField value={card.name} onChange={(v) => renameCard(card.id, v)} />
        </div>
        <div className="insp-row">
          <label>Order</label>
          <span className="muted">
            {cardIndex + 1} of {cardCount}
          </span>
        </div>
      </div>

      <div className="section-bar">Background</div>
      <div className="insp-group">
        <PatternField value={card.background} onChange={(v) => setCardBackground(card.id, v)} />
        {card.drawing && (
          <button className="btn" onClick={() => setCardDrawing(card.id, undefined)}>
            Clear Drawing
          </button>
        )}
      </div>

      <div className="section-bar">Size</div>
      <div className="insp-group">
        <div className="insp-pair">
          <div className="insp-row">
            <label>W</label>
            <NumberField value={size.w} onChange={() => {}} />
          </div>
          <div className="insp-row">
            <label>H</label>
            <NumberField value={size.h} onChange={() => {}} />
          </div>
        </div>
        <span className="muted">Card size is fixed for the whole stack.</span>
      </div>

      <div className="section-bar">Grid</div>
      <div className="insp-group">
        <CheckField checked={showGrid} onChange={toggleGrid} label="Show Grid" />
        <CheckField checked={snapToGrid} onChange={toggleSnap} label="Snap to Grid" />
      </div>
    </>
  )
}
