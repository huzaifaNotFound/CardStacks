import { getTestHtml, makeTestStackJson } from '../dist-export-test/export-test.mjs'

const html = getTestHtml()
const json = html.match(/<script type="application\/json" id="cardstacks-data">([\s\S]*?)<\/script>/)[1]
const parsed = JSON.parse(json)
const exp = JSON.parse(makeTestStackJson())

console.log('parsed.id', parsed.id)
console.log('exp.id   ', exp.id)
console.log('parsed.cards[0].widgets[0]', JSON.stringify(parsed.cards[0].widgets[0]))
console.log('exp.cards[0].widgets[0]   ', JSON.stringify(exp.cards[0].widgets[0]))
console.log('parsed.widgets count', parsed.cards[0].widgets.length, 'exp', exp.cards[0].widgets.length)
