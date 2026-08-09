import type { Stack } from '../model/types'
import { button, card, stack, text, goto } from './helpers'

/**
 * Choose Your Own Adventure — a straight branching narrative.
 * No inventory or conditional logic (per the approved scope): pure goToCard.
 */
export function adventureStack(): Stack {
  const title = card('Title', [
    text('THE LOST LIGHTHOUSE', 40, 60, 560, 48, { fontSize: 28, bold: true, align: 'center' }),
    text('A small adventure.', 40, 120, 560, 20, { fontSize: 14, align: 'center' }),
    button('BEGIN', 250, 220, 140, 40, [goto('intro')], { style: 'default', fontSize: 14 }),
    text('CardStacks example', 40, 360, 560, 16, { fontSize: 10, align: 'center' }),
  ], 'white', 'title')

  const intro = card('The Coast', [
    text('You walk a cliff path at dusk. Below, the tide is coming in fast. The old lighthouse is dark, its door ajar.', 60, 60, 520, 90, { fontSize: 15 }),
    button('Enter the lighthouse', 90, 200, 200, 40, [goto('hall')]),
    button('Follow the path down to the boats', 350, 200, 200, 40, [goto('boats')]),
  ], 'white', 'intro')

  const hall = card('The Hall', [
    text('Inside, a spiral stair climbs into shadow. A note on a table reads: "The lamp must be lit by midnight."', 60, 60, 520, 90, { fontSize: 15 }),
    button('Climb the stairs', 90, 200, 200, 40, [goto('lamp')]),
    button('Search the table', 350, 200, 200, 40, [goto('table')]),
  ], 'white', 'hall')

  const table = card('The Note', [
    text('Under the note is a key marked "LAMP". You pocket it. Something creaks overhead.', 60, 60, 520, 90, { fontSize: 15 }),
    button('Climb the stairs', 90, 200, 200, 40, [goto('lamp')]),
    button('Go back outside', 350, 200, 200, 40, [goto('boats')]),
  ], 'white', 'table')

  const lamp = card('The Lamp Room', [
    text('The great lamp is cold. You try the switch — nothing. It needs a key.', 60, 60, 520, 90, { fontSize: 15 }),
    button('Use the key', 90, 200, 200, 40, [goto('light')]),
    button('Climb down to the hall', 350, 200, 200, 40, [goto('hall')]),
  ], 'white', 'lamp')

  const light = card('Lit', [
    text('The key turns. The lens bursts into a blazing white beam over the black sea. A small ship answers with a long whistle of thanks.', 60, 60, 520, 110, { fontSize: 15 }),
    button('Climb down to the boats', 250, 220, 200, 40, [goto('dawn')]),
  ], 'white', 'light')

  const dawn = card('Dawn', [
    text('By morning the sea is calm. In the daylight the lighthouse looks ordinary — a white tower with a red door, humming softly.', 60, 60, 520, 90, { fontSize: 15 }),
    button('The End — play again', 250, 220, 200, 40, [goto('title')], { style: 'default' }),
  ], 'white', 'dawn')

  const boats = card('The Boats', [
    text('The tide is coming in and the boats are already straining at their ropes. Behind you, the lighthouse waits, unlit.', 60, 60, 520, 90, { fontSize: 15 }),
    button('Go back to the lighthouse', 90, 200, 200, 40, [goto('hall')]),
    button('Take a boat and row out', 350, 200, 200, 40, [goto('lost')]),
  ], 'white', 'boats')

  const lost = card('Lost', [
    text('The sea swallows you into grey fog. There is no lamp to guide you home.', 60, 60, 520, 70, { fontSize: 15 }),
    button('Start over', 250, 220, 200, 40, [goto('title')]),
  ], 'white', 'lost')

  return stack('The Lost Lighthouse', [title, intro, hall, table, lamp, light, boats, lost, dawn])
}
