import type { Action, Stack, Widget } from '../model/types'
import { button, card, image, stack, text, goto } from './helpers'
import { BOATS_ART, COAST_ART, HALL_ART, LAMP_ART, LIGHTHOUSE_ART, LOST_ART } from './art'

/**
 * Choose Your Own Adventure — a straight branching narrative.
 * No inventory or conditional logic (per the approved scope): pure goToCard.
 * Each scene card pairs a story with a 1-bit pixel-art illustration.
 */

interface Choice {
  label: string
  target: string
}

/** A body card: story text + scene art on top, choices below. */
function story(paragraph: string, art: string, choices: Choice[]): Widget[] {
  const widgets: Widget[] = [
    text(paragraph, 46, 42, 356, 152, { fontSize: 14 }),
    image(art, 414, 36, 200, 168, { border: false, fit: 'contain' }),
  ]
  const n = choices.length
  choices.forEach((c, i) => {
    const x = n === 1 ? 250 : 90 + i * 220
    widgets.push(button(c.label, x, 236, 200, 42, [goto(c.target)], { fontSize: 13 }))
  })
  return widgets
}

export function adventureStack(): Stack {
  const title = card('Title', [
    image(LIGHTHOUSE_ART, 274, 28, 92, 138, { border: false, fit: 'contain' }),
    text('THE LOST LIGHTHOUSE', 40, 168, 560, 38, { fontSize: 24, bold: true, align: 'center' }),
    text('A small adventure.', 40, 210, 560, 20, { fontSize: 13, align: 'center' }),
    button('BEGIN', 250, 248, 140, 42, [goto('intro')], { style: 'default', fontSize: 14 }),
    text('CardStacks example', 40, 356, 560, 18, { fontSize: 10, align: 'center' }),
  ], 'white', 'title')

  const intro = card('The Coast', [
    ...story('You walk a cliff path at dusk. Below, the tide is coming in fast. The old lighthouse is dark, its door ajar.', COAST_ART, [
      { label: 'Enter the lighthouse', target: 'hall' },
      { label: 'Follow the path to the boats', target: 'boats' },
    ]),
  ], 'white', 'intro')

  const hall = card('The Hall', [
    ...story('Inside, a spiral stair climbs into shadow. A note on a table reads: "The lamp must be lit by midnight."', HALL_ART, [
      { label: 'Climb the stairs', target: 'lamp' },
      { label: 'Search the table', target: 'table' },
    ]),
  ], 'white', 'hall')

  const table = card('The Note', [
    ...story('Under the note is a key marked "LAMP". You pocket it. Something creaks overhead.', HALL_ART, [
      { label: 'Climb the stairs', target: 'lamp' },
      { label: 'Go back outside', target: 'boats' },
    ]),
  ], 'white', 'table')

  const lamp = card('The Lamp Room', [
    ...story('The great lamp is cold. You try the switch — nothing. It needs a key.', LAMP_ART, [
      { label: 'Use the key', target: 'light' },
      { label: 'Climb down to the hall', target: 'hall' },
    ]),
  ], 'white', 'lamp')

  const light = card('Lit', [
    ...story('The key turns. The lens bursts into a blazing white beam over the black sea. A small ship answers with a long whistle of thanks.', LAMP_ART, [
      { label: 'Climb down to the boats', target: 'dawn' },
    ]),
  ], 'white', 'light')

  const dawn = card('Dawn', [
    ...story('By morning the sea is calm. In the daylight the lighthouse looks ordinary — a white tower with a red door, humming softly.', COAST_ART, [
      { label: 'The End — play again', target: 'title' },
    ]),
  ], 'white', 'dawn')

  const boats = card('The Boats', [
    ...story('The tide is coming in and the boats are already straining at their ropes. Behind you, the lighthouse waits, unlit.', BOATS_ART, [
      { label: 'Go back to the lighthouse', target: 'hall' },
      { label: 'Take a boat and row out', target: 'lost' },
    ]),
  ], 'white', 'boats')

  const lost = card('Lost', [
    ...story('The sea swallows you into grey fog. There is no lamp to guide you home.', LOST_ART, [
      { label: 'Start over', target: 'title' },
    ]),
  ], 'white', 'lost')

  return stack('The Lost Lighthouse', [title, intro, hall, table, lamp, light, boats, lost, dawn])
}

export type { Action }
