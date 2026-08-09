import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const gen = fileURLToPath(new URL('./gen/', import.meta.url))

function dataUri(file, mime) {
  const b64 = readFileSync(gen + file).toString('base64')
  return `data:${mime};base64,${b64}`
}

const art = `/**
 * 1-bit pixel-art images used inside premade stacks.
 * Generated artwork, converted to true 1-bit PNG and embedded as data URIs so
 * exported HTML stays a single self-contained file.
 */

export const CAKE_ART = '${dataUri('cake.png', 'image/png')}'
export const LIGHTHOUSE_ART = '${dataUri('lighthouse.png', 'image/png')}'
export const COAST_ART = '${dataUri('coast.png', 'image/png')}'
export const HALL_ART = '${dataUri('hall.png', 'image/png')}'
export const LAMP_ART = '${dataUri('lamp.png', 'image/png')}'
export const BOATS_ART = '${dataUri('boats.png', 'image/png')}'
export const LOST_ART = '${dataUri('lost.png', 'image/png')}'
`

const out = fileURLToPath(new URL('../src/stacks/art.ts', import.meta.url))
readFileSync // noop
const { writeFileSync } = await import('node:fs')
writeFileSync(out, art)
console.log('wrote src/stacks/art.ts')
console.log('data URI sizes (KB):', Math.round((readFileSync(out).length - 300) / 1024 * 10) / 10)
