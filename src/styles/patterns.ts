/**
 * 8x8 1-bit fill patterns, in the spirit of the classic Macintosh pattern palette.
 * Each pattern is 8 rows; each row is an 8-bit mask where bit 7 is the leftmost pixel.
 * A set bit paints ink (black); a clear bit leaves paper (white).
 *
 * Single source of truth: the editor, the runtime and the HTML exporter all
 * derive their CSS from this table.
 */

export type PatternId =
  | 'white'
  | 'light1'
  | 'light2'
  | 'dither25'
  | 'dither50'
  | 'dither75'
  | 'black'
  | 'hlines'
  | 'vlines'
  | 'grid'
  | 'diagL'
  | 'diagR'
  | 'crosshatch'
  | 'stipple'
  | 'brick'
  | 'weave'

export interface Pattern {
  id: PatternId
  label: string
  rows: number[]
}

export const PATTERNS: Pattern[] = [
  { id: 'white', label: 'White', rows: [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00] },
  { id: 'light1', label: 'Light', rows: [0x88, 0x00, 0x22, 0x00, 0x88, 0x00, 0x22, 0x00] },
  { id: 'light2', label: 'Sparse', rows: [0x80, 0x00, 0x08, 0x00, 0x80, 0x00, 0x08, 0x00] },
  { id: 'dither25', label: '25%', rows: [0x88, 0x22, 0x88, 0x22, 0x88, 0x22, 0x88, 0x22] },
  { id: 'dither50', label: '50%', rows: [0xaa, 0x55, 0xaa, 0x55, 0xaa, 0x55, 0xaa, 0x55] },
  { id: 'dither75', label: '75%', rows: [0x77, 0xdd, 0x77, 0xdd, 0x77, 0xdd, 0x77, 0xdd] },
  { id: 'black', label: 'Black', rows: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff] },
  { id: 'hlines', label: 'Lines —', rows: [0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00] },
  { id: 'vlines', label: 'Lines |', rows: [0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11] },
  { id: 'grid', label: 'Grid', rows: [0xff, 0x11, 0x11, 0x11, 0xff, 0x11, 0x11, 0x11] },
  { id: 'diagL', label: 'Diag \\', rows: [0x80, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01] },
  { id: 'diagR', label: 'Diag /', rows: [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80] },
  { id: 'crosshatch', label: 'Hatch', rows: [0x81, 0x42, 0x24, 0x18, 0x18, 0x24, 0x42, 0x81] },
  { id: 'stipple', label: 'Stipple', rows: [0x40, 0x04, 0x10, 0x81, 0x08, 0x40, 0x02, 0x20] },
  { id: 'brick', label: 'Brick', rows: [0xff, 0x88, 0x88, 0x88, 0xff, 0x08, 0x08, 0x08] },
  { id: 'weave', label: 'Weave', rows: [0xf0, 0xf0, 0xf0, 0xf0, 0x0f, 0x0f, 0x0f, 0x0f] },
]

export const PATTERN_IDS = PATTERNS.map((p) => p.id)

const byId = new Map(PATTERNS.map((p) => [p.id, p]))

export function getPattern(id: PatternId): Pattern {
  return byId.get(id) ?? PATTERNS[0]
}

/** Build an inline SVG data URI rendering one 8x8 tile of the pattern. */
export function patternDataUri(id: PatternId, ink = '#000', paper = '#fff'): string {
  const p = getPattern(id)
  let rects = ''
  for (let y = 0; y < 8; y++) {
    const row = p.rows[y]
    let x = 0
    while (x < 8) {
      if (row & (0x80 >> x)) {
        let run = 1
        while (x + run < 8 && row & (0x80 >> (x + run))) run++
        rects += `<rect x="${x}" y="${y}" width="${run}" height="1"/>`
        x += run
      } else {
        x++
      }
    }
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" shape-rendering="crispEdges">` +
    `<rect width="8" height="8" fill="${paper}"/>` +
    `<g fill="${ink}">${rects}</g>` +
    `</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

/** CSS declarations that paint an element with a pattern. */
export function patternStyle(id: PatternId): {
  backgroundImage: string
  backgroundRepeat: string
  backgroundSize: string
} {
  return {
    backgroundImage: patternDataUri(id),
    backgroundRepeat: 'repeat',
    backgroundSize: '8px 8px',
  }
}

/**
 * Emit `.pat-<id>` rules for every pattern.
 * Used by the app stylesheet and inlined verbatim into exported HTML.
 */
export function patternCssRules(): string {
  return PATTERNS.map(
    (p) =>
      `.pat-${p.id}{background-image:${patternDataUri(p.id)};background-repeat:repeat;background-size:8px 8px;}`,
  ).join('\n')
}
