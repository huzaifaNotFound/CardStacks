import { useEffect, useRef, useState } from 'react'
import { useStore } from '../app/store'
import '../runtime/runtime.standalone.js'

interface RuntimeHandle {
  unmount: () => void
  goToCard: (id: string) => void
  getState: () => {
    stack: { cards: { id: string }[] }
    currentCardId: string
  }
}

declare global {
  interface Window {
    CardStacksRuntime?: {
      mount: (root: HTMLElement, stack: unknown, opts?: Record<string, unknown>) => RuntimeHandle
    }
  }
}

export default function RunMode() {
  const stack = useStore((s) => s.stack)
  const setView = useStore((s) => s.setView)
  const hostRef = useRef<HTMLDivElement>(null)
  const rtRef = useRef<RuntimeHandle | null>(null)
  const [count, setCount] = useState({ i: 1, n: 1 })

  useEffect(() => {
    if (!hostRef.current || !window.CardStacksRuntime) return
    const rt = window.CardStacksRuntime.mount(hostRef.current, stack, {
      onChange: (state: { stack: { cards: unknown[] }; currentCardId: string }) => {
        const i = state.stack.cards.findIndex((c) => (c as { id: string }).id === state.currentCardId)
        setCount({ i: Math.max(0, i) + 1, n: state.stack.cards.length })
      },
    })
    rtRef.current = rt
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setView('editor')
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      rt.unmount()
      document.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const go = (d: number) => {
    const state = rtRef.current?.getState()
    if (!state) return
    const i = state.stack.cards.findIndex((c) => c.id === state.currentCardId)
    const next = state.stack.cards[Math.min(state.stack.cards.length - 1, Math.max(0, i + d))]
    rtRef.current?.goToCard(next.id)
  }

  return (
    <div className="run-root col">
      <div className="run-bar">
        <button className="run-close" onClick={() => setView('home')} title="Close and return Home" aria-label="Close">
          ×
        </button>
        <span className="run-name nowrap" title={stack.name}>
          {stack.name}
        </span>
        <span className="toolbar-sep" />
        {count.n > 1 && (
          <>
            <button className="btn btn-sm" onClick={() => go(-1)} aria-label="Previous card">
              ◀
            </button>
            <span className="run-count">
              {count.i} / {count.n}
            </span>
            <button className="btn btn-sm" onClick={() => go(1)} aria-label="Next card">
              ▶
            </button>
          </>
        )}
        <span className="run-spacer" />
        <button className="btn btn-sm" onClick={() => setView('editor')}>
          ⏹ Edit (Esc)
        </button>
      </div>
      <div className="run-stage desk">
        <div ref={hostRef} className="run-host" />
      </div>
    </div>
  )
}
