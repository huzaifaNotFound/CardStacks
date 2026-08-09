import type { Card, Stack } from '../model/types'
import { button, card, stack, text, show } from './helpers'

/**
 * To-Do — 8 tasks. Each task is two twin buttons toggled with setVisibility
 * (▢ / ☑). The only way to get a toggle without conditionals.
 */
const TASKS = [
  'Send the invites',
  'Water the plants',
  'Call the lighthouse keeper',
  'Finish the demo stack',
  'Bake a cake',
  'Sharpen the pencils',
  'Export the birthday card',
  'Stretch',
]

export function todoStack(): Stack {
  const widgets = [
    text('TO-DO', 60, 30, 520, 32, { fontSize: 26, bold: true, align: 'center' }),
    text('Click a box to check a task off.', 60, 64, 520, 18, { fontSize: 12, align: 'center' }),
  ]

  const cards: Card[] = [card('To-Do', widgets)]

  TASKS.forEach((task, i) => {
    const openId = `todo-${i}-open`
    const doneId = `todo-${i}-done`
    const y = 96 + i * 34

    cards[0].widgets.push(
      button(`▢  ${task}`, 80, y, 480, 28, [show(openId, false), show(doneId, true)], {}, { name: openId }),
      button(`☑  ${task}`, 80, y, 480, 28, [show(doneId, false), show(openId, true)], {}, {
        name: doneId,
        visible: false,
      }),
    )
  })

  cards[0].widgets.push(
    text('All checkboxes are ordinary Buttons — see how they work in the editor.', 60, 372, 520, 16, {
      fontSize: 10,
      align: 'center',
    }),
  )

  return stack('To-Do', cards)
}
