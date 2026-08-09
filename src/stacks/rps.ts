import type { Stack } from '../model/types'
import { button, card, stack, text, goto } from './helpers'

/**
 * Rock Paper Scissors — two-player pass-and-play.
 * No CPU, no score (per the approved scope). Because there is no conditional
 * logic, each possible P1 pick has its own "Player 2's turn" card.
 */
const CHOICES = ['Rock', 'Paper', 'Scissors'] as const
const C = CHOICES.map((c) => c.toLowerCase())

export function rpsStack(): Stack {
  const cards = [
    card(
      'Rules',
      [
        text('ROCK · PAPER · SCISSORS', 60, 40, 520, 36, { fontSize: 24, bold: true, align: 'center' }),
        text(
          'Two players, one device. Pass it back and forth.\nRock beats Scissors · Paper beats Rock · Scissors beats Paper.',
          60,
          100,
          520,
          70,
          { fontSize: 14, align: 'center' },
        ),
        button('START  →', 250, 240, 140, 40, [goto('p1')], { style: 'default', fontSize: 14 }),
      ],
      'white',
      'rules',
    ),
    card(
      'Player 1',
      [
        text('PLAYER 1 — CHOOSE', 60, 50, 520, 32, { fontSize: 20, bold: true, align: 'center' }),
        ...CHOICES.map((c, i) => button(c, 80 + i * 180, 180, 140, 44, [goto(`p1-${C[i]}`)], { fontSize: 15 })),
      ],
      'white',
      'p1',
    ),
  ]

  for (const p1 of CHOICES) {
    const pc = p1.toLowerCase()
    cards.push(
      card(
        `P1 ${p1}`,
        [
          text(`PLAYER 1 chose ${p1.toUpperCase()}.`, 60, 70, 520, 32, { fontSize: 18, bold: true, align: 'center' }),
          text('Now pass the device to PLAYER 2 — no peeking!', 60, 130, 520, 40, { fontSize: 14, align: 'center' }),
          button("PLAYER 2's TURN  →", 250, 240, 200, 40, [goto(`p2-${pc}`)], { style: 'default', fontSize: 14 }),
        ],
        'white',
        `p1-${pc}`,
      ),
    )

    cards.push(
      card(
        `P2 vs ${p1}`,
        [
          text(`PLAYER 1 played ${p1.toUpperCase()}.`, 60, 50, 520, 28, { fontSize: 16, align: 'center' }),
          text('PLAYER 2 — CHOOSE', 60, 90, 520, 32, { fontSize: 20, bold: true, align: 'center' }),
          ...CHOICES.map((c, i) => button(c, 80 + i * 180, 190, 140, 44, [goto(`result-${pc}-${C[i]}`)], { fontSize: 15 })),
        ],
        'white',
        `p2-${pc}`,
      ),
    )
  }

  const winners: Record<string, string> = {
    'rock-rock': "It's a DRAW!",
    'rock-paper': 'PAPER wins!',
    'rock-scissors': 'ROCK wins!',
    'paper-rock': 'PAPER wins!',
    'paper-paper': "It's a DRAW!",
    'paper-scissors': 'SCISSORS wins!',
    'scissors-rock': 'ROCK wins!',
    'scissors-paper': 'SCISSORS wins!',
    'scissors-scissors': "It's a DRAW!",
  }

  for (const p1 of CHOICES) {
    for (const p2 of CHOICES) {
      const key = `${p1.toLowerCase()}-${p2.toLowerCase()}`
      cards.push(
        card(
          `Result ${p1} vs ${p2}`,
          [
            text(`Player 1: ${p1}  ·  Player 2: ${p2}\n${winners[key]}`, 60, 90, 520, 80, {
              fontSize: 18,
              bold: true,
              align: 'center',
            }),
            text('Shake hands. Be a good sport.', 60, 180, 520, 20, { fontSize: 12, align: 'center' }),
            button('Rematch', 150, 260, 150, 40, [goto('p1')]),
            button('New players', 340, 260, 150, 40, [goto('rules')]),
          ],
          'white',
          `result-${key}`,
        ),
      )
    }
  }

  return stack('Rock Paper Scissors', cards)
}
