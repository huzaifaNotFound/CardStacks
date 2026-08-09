import type { Stack } from '../model/types'
import { button, canvas, card, stack, text, setVar } from './helpers'

/**
 * Paint — a Canvas widget plus brush-size buttons.
 * Brush size flows through a variable (`{{brush}}`), the built-in ✕ clears.
 */
export function paintStack(): Stack {
  const pick = card('Paint', [
    text('PAINT', 60, 30, 520, 32, { fontSize: 26, bold: true, align: 'center' }),
    canvas(60, 80, 520, 240, { brush: '{{brush}}', border: true }),
    text('Brush', 60, 332, 60, 16, { fontSize: 12 }),
    button('Thin', 130, 328, 70, 26, [setVar('brush', 1)]),
    button('Medium', 210, 328, 80, 26, [setVar('brush', 3)]),
    button('Thick', 300, 328, 70, 26, [setVar('brush', 6)]),
    text('✕ in the corner wipes the canvas.', 420, 334, 160, 20, { fontSize: 10 }),
  ])

  return stack('Paint', [pick], { brush: 2 })
}
