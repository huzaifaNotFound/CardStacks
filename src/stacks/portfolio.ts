import type { Stack } from '../model/types'
import { button, card, field, stack, text, goto } from './helpers'

/**
 * Portfolio — a tiny 3-card personal site. Uses the same generic widgets.
 */
export function portfolioStack(): Stack {
  const home = card('Home', [
    text('HELLO, I AM', 60, 50, 520, 28, { fontSize: 18, align: 'center' }),
    text('A. MAKER', 60, 80, 520, 52, { fontSize: 40, bold: true, align: 'center' }),
    text('Builder of small delightful things.', 60, 140, 520, 20, { fontSize: 14, align: 'center' }),
    button('About  →', 130, 220, 180, 40, [goto('about')]),
    button('Contact  →', 330, 220, 180, 40, [goto('contact')]),
  ], 'white', 'home')

  const about = card('About', [
    text('ABOUT', 60, 40, 520, 28, { fontSize: 22, bold: true, align: 'center' }),
    text('I build small interactive stacks: little programs with cards, buttons and a story to tell. My favourite stack is a birthday card that draws its own confetti.', 60, 90, 520, 120, { fontSize: 15 }),
    button('◀ Home', 240, 260, 160, 36, [goto('home')]),
  ], 'white', 'about')

  const contact = card('Contact', [
    text('CONTACT', 60, 40, 520, 28, { fontSize: 22, bold: true, align: 'center' }),
    field(60, 90, 520, 36, { bind: 'email', placeholder: 'your@email.com', fontSize: 13 }),
    text('Made with CardStacks — a modern HyperCard inspired software.', 60, 160, 520, 40, { fontSize: 11, align: 'center' }),
    button('◀ Home', 240, 240, 160, 36, [goto('home')]),
  ], 'white', 'contact')

  return stack('Portfolio', [home, about, contact], { email: '' })
}
