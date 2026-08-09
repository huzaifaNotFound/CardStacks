import { writeFileSync } from 'node:fs'
import { getTestHtml, makeTestStackJson } from '../dist-export-test/export-test.mjs'

const html = getTestHtml()
writeFileSync(new URL('../dist/test-export.html', import.meta.url), html)

const checks = {
  'has doctype': html.startsWith('<!doctype html>'),
  'has data script': html.includes('id="cardstacks-data"'),
  'has runtime': html.includes('window.CardStacksRuntime'),
  'has mount call': html.includes('CardStacksRuntime.mount'),
  'has patterns css': html.includes('.pat-white'),
  'has widgets css': html.includes('.w-button'),
  'has embedded font': html.includes('font/woff2'),
  'json escaping (no raw </script in data)':
    !/<script type="application\/json" id="cardstacks-data">([\s\S]*?)<\/script>/.exec(html)?.[1]?.includes('</script>'),
}

const json = html.match(/<script type="application\/json" id="cardstacks-data">([\s\S]*?)<\/script>/)?.[1]
const parsed = json ? JSON.parse(json) : null
const expected = JSON.parse(makeTestStackJson())
const stripIds = (s) => JSON.stringify(s, (k, v) => (k === 'id' ? '' : v))
checks['embedded JSON parses'] = !!parsed
checks['embedded stack name'] = parsed?.name === 'Export Test'
checks['round-trip cards match'] = stripIds(parsed?.cards) === stripIds(expected.cards)
checks['round-trip widgets match'] =
  stripIds(parsed?.cards?.[0]?.widgets) === stripIds(expected.cards[0].widgets)

let ok = true
for (const [k, v] of Object.entries(checks)) {
  console.log(`${v ? 'PASS' : 'FAIL'}  ${k}`)
  if (!v) ok = false
}
console.log(ok ? '\nEXPORT PIPELINE OK' : '\nEXPORT PIPELINE FAILED')
process.exit(ok ? 0 : 1)
