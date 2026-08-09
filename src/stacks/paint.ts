import type { Stack } from '../model/types'
import { button, canvas, card, stack, text, setVar, show } from './helpers'

/**
 * Paint — a Canvas widget plus brush-size buttons.
 * Brush size flows through a variable (`{{brush}}`); the selected size is
 * highlighted by toggling a small marker under the active button (setVisibility).
 */
export function paintStack(): Stack {
  const brush = (label: string, x: number, w: number, size: number, mark: string, others: string[]) => {
    const actions: ReturnType<typeof setVar>[] = [setVar('brush', size), show(mark, true)]
    for (const o of others) actions.push(show(o, false))
    return button(label, x, 310, w, 26, actions)
  }

  const pick = card(
    'Paint',
    [
      text('PAINT', 60, 28, 520, 30, { fontSize: 24, bold: true, align: 'center' }),
      canvas(60, 68, 520, 226, { brush: '{{brush}}', border: true }),

      text('Brush', 60, 314, 60, 16, { fontSize: 12 }),
      brush('Thin', 128, 66, 1, 'brush-thin', ['brush-medium', 'brush-thick']),
      brush('Medium', 202, 80, 3, 'brush-medium', ['brush-thin', 'brush-thick']),
      brush('Thick', 290, 66, 6, 'brush-thick', ['brush-thin', 'brush-medium']),

      text('▼', 126, 336, 70, 14, { fontSize: 12, align: 'center' }, { name: 'brush-thin', visible: false }),
      text('▼', 200, 336, 84, 14, { fontSize: 12, align: 'center' }, { name: 'brush-medium', visible: false }),
      text('▼', 288, 336, 70, 14, { fontSize: 12, align: 'center' }, { name: 'brush-thick', visible: false }),

      text('The × in the corner clears the canvas.', 60, 362, 520, 18, { fontSize: 11, align: 'center' }),
    ],
    'white',
    'paint',
  )

  return stack('Paint', [pick], { brush: 2 })
}
