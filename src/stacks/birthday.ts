import type { Stack } from '../model/types'
import { button, card, field, image, stack, text, goto, msg, setVar } from './helpers'
import { CAKE_ART } from './art'

/**
 * Birthday Card Maker.
 *
 * Collects a name, message, date and optional photo, then shows an animated
 * greeting card. Pure declarative: field `bind` + `{{var}}` + goToCard.
 */
export function birthdayStack(): Stack {
  const photoVar = 'photo'

  const form = card('Make a Card', [
    text('BIRTHDAY CARD MAKER', 60, 30, 520, 36, { fontSize: 26, bold: true, align: 'center' }),
    text('Fill in the details, then press Make Card.', 60, 72, 520, 20, { fontSize: 13, align: 'center' }),

    text('Name', 90, 108, 80, 16, { fontSize: 12 }),
    field(180, 104, 340, 26, { bind: 'name', placeholder: 'Who is it for?' }),

    text('Message', 90, 140, 80, 16, { fontSize: 12 }),
    field(180, 136, 340, 64, { bind: 'message', multiline: true, placeholder: 'Write something nice…' }),

    text('Date', 90, 212, 80, 16, { fontSize: 12 }),
    field(180, 208, 340, 26, { bind: 'date', placeholder: 'e.g. August 8' }),

    text('Photo (optional)', 90, 244, 120, 16, { fontSize: 12 }),
    image('{{' + photoVar + '}}', 180, 240, 160, 110, {
      upload: true,
      border: true,
      fit: 'contain',
      bind: photoVar,
    }),

    button('MAKE CARD  →', 300, 320, 200, 40, [goto('card')], {
      style: 'default',
      fontSize: 14,
    }),
  ], 'white', 'form')

  const cardView = card('Card', [
    image(CAKE_ART, 244, 20, 152, 100, { border: false, fit: 'contain' }),
    text('Happy Birthday, {{name}}!', 40, 124, 560, 40, { fontSize: 28, bold: true, align: 'center' }),
    image('{{' + photoVar + '}}', 220, 168, 200, 110, { border: true, fit: 'contain' }),
    text('{{message}}', 60, 292, 520, 28, { fontSize: 14, align: 'center' }),
    text('celebrated on {{date}}', 60, 322, 520, 18, { fontSize: 12, align: 'center' }),

    button('CONFETTI!', 160, 354, 140, 30, [setVar('confetti', '1'), msg('🎉 🎉 🎉\nHave a wonderful day!')]),
    button('Back', 340, 354, 140, 30, [goto('form')]),
  ], 'white', 'card')

  return stack('Birthday Card Maker', [form, cardView], { name: '', message: '', date: '', photo: '' })
}
