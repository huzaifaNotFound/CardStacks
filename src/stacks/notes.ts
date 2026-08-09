import type { Stack } from '../model/types'
import { button, card, field, stack, text, goto } from './helpers'

/**
 * Notes — one card per note. Fields bind straight into variables, so each
 * note is live while the stack runs. Use the editor to save the stack.
 */
export function notesStack(): Stack {
  const notes = [
    { id: 'g', title: 'Groceries', start: 'Milk\nEggs\nBread' },
    { id: 'i', title: 'Ideas', start: 'A stack that writes itself…' },
    { id: 's', title: 'Schedule', start: 'Monday: demo day' },
  ]

  const homeWidgets = [
    text('NOTES', 60, 40, 520, 36, { fontSize: 26, bold: true, align: 'center' }),
    ...notes.map((n, i) =>
      button(n.title, 100, 120 + i * 60, 440, 44, [goto(n.id)], { fontSize: 14 }),
    ),
    text('Edits save to variables while running. Save the stack in the editor to keep them.', 60, 340, 520, 30, { fontSize: 10, align: 'center' }),
  ]
  const home = card('Home', homeWidgets, 'white', 'home')

  const noteCards = notes.map((n, i) => {
    const prev = notes[(i - 1 + notes.length) % notes.length]
    const next = notes[(i + 1) % notes.length]
    return card(n.title, [
      text(`${n.title.toUpperCase()}`, 60, 30, 520, 28, { fontSize: 20, bold: true, align: 'center' }),
      field(60, 70, 520, 220, { bind: n.id, multiline: true, content: n.start, placeholder: 'Write…' }),
      button('◀ ' + prev.title, 60, 320, 180, 36, [goto(prev.id)]),
      button('Home', 250, 320, 140, 36, [goto('home')]),
      button(next.title + ' ▶', 400, 320, 180, 36, [goto(next.id)]),
    ], 'white', n.id)
  })

  return stack('Notes', [home, ...noteCards], {
    g: notes[0].start,
    i: notes[1].start,
    s: notes[2].start,
  })
}
