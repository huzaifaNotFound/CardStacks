import { useEffect, type ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  onClose: () => void
  confirmLabel?: string
  onConfirm?: () => void
  cancelLabel?: string
}

export default function Dialog({
  title,
  children,
  onClose,
  confirmLabel = 'OK',
  onConfirm,
  cancelLabel,
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Enter') (onConfirm ?? onClose)()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, onConfirm])

  return (
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <div className="dialog" onMouseDown={(e) => e.stopPropagation()} role="dialog">
        <div className="dialog-title">{title}</div>
        <div className="dialog-body">{children}</div>
        <div className="dialog-actions">
          {cancelLabel && (
            <button className="btn btn-round" onClick={onClose}>
              {cancelLabel}
            </button>
          )}
          <button
            className="btn btn-default"
            autoFocus
            onClick={() => {
              onConfirm?.()
              onClose()
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
