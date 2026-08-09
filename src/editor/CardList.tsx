import { useState } from 'react'
import { useStore } from '../app/store'
import { IconCopy, IconDown, IconPlus, IconTrash, IconUp } from './icons'

export default function CardList() {
  const cards = useStore((s) => s.stack.cards)
  const stackName = useStore((s) => s.stack.name)
  const currentCardId = useStore((s) => s.currentCardId)
  const selectCard = useStore((s) => s.selectCard)
  const addCard = useStore((s) => s.addCard)
  const deleteCard = useStore((s) => s.deleteCard)
  const moveCard = useStore((s) => s.moveCard)
  const duplicateCard = useStore((s) => s.duplicateCard)
  const renameCard = useStore((s) => s.renameCard)
  const renameStack = useStore((s) => s.renameStack)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  const commitRename = () => {
    if (editingId && draft.trim()) renameCard(editingId, draft.trim())
    setEditingId(null)
  }

  const index = cards.findIndex((c) => c.id === currentCardId)

  return (
    <div className="rail col">
      <div className="section-bar">Stack</div>
      <div className="pad">
        <input
          className="field"
          value={stackName}
          onChange={(e) => renameStack(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div className="section-bar">Cards</div>
      <div className="fill scroll">
        {cards.map((card, i) => {
          const on = card.id === currentCardId
          return (
            <div key={card.id} className="rail-item">
              {editingId === card.id ? (
                <input
                  className="field"
                  style={{ margin: '1px 4px', width: 'calc(100% - 8px)' }}
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitRename()
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                />
              ) : (
                <button
                  className={`list-row${on ? ' is-on' : ''}`}
                  onClick={() => selectCard(card.id)}
                  onDoubleClick={() => {
                    setEditingId(card.id)
                    setDraft(card.name)
                  }}
                  title={card.name}
                >
                  <span className="list-num">{i + 1}</span>
                  <span className="list-name">{card.name}</span>
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="rail-tools row">
        <button
          className="btn btn-sm has-tip"
          onClick={() => duplicateCard(currentCardId)}
          aria-label="Duplicate card"
        >
          <IconCopy />
          <span className="tip">Duplicate</span>
        </button>
        <button
          className="btn btn-sm has-tip"
          onClick={() => moveCard(currentCardId, -1)}
          disabled={index <= 0}
          aria-label="Move card up"
        >
          <IconUp />
          <span className="tip">Move up</span>
        </button>
        <button
          className="btn btn-sm has-tip"
          onClick={() => moveCard(currentCardId, 1)}
          disabled={index < 0 || index >= cards.length - 1}
          aria-label="Move card down"
        >
          <IconDown />
          <span className="tip">Move down</span>
        </button>
        <button
          className="btn btn-sm has-tip"
          onClick={() => deleteCard(currentCardId)}
          disabled={cards.length <= 1}
          aria-label="Delete card"
        >
          <IconTrash />
          <span className="tip">Delete</span>
        </button>
      </div>

      <button className="btn rail-new" onClick={addCard}>
        <IconPlus />
        New Card
      </button>
    </div>
  )
}
