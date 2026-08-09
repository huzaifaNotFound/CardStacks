/**
 * Small 1-bit Mac-style icons for the Home launcher tiles.
 * 16x16 pixel grid, drawn with rects. `currentColor` not needed — fixed black.
 */

const P = (x: number, y: number, w = 1, h = 1) => (
  <rect key={`${x}-${y}-${w}-${h}`} x={x} y={y} width={w} height={h} />
)

const svg = (children: React.ReactNode) => (
  <svg viewBox="0 0 16 16" shapeRendering="crispEdges" fill="#000">
    {children}
  </svg>
)

/** Birthday cake. */
export const IconCake = () =>
  svg(
    <>
      {P(2, 11, 12, 3)}
      {P(3, 8, 10, 3)}
      {P(4, 7, 8, 1)}
      {P(4, 5, 1, 2)}
      {P(8, 5, 1, 2)}
      {P(11, 5, 1, 2)}
      {P(4, 4, 2, 1)}
      {P(8, 4, 2, 1)}
      {P(11, 4, 2, 1)}
    </>,
  )

/** Paper plane — choose your own adventure. */
export const IconPlane = () =>
  svg(
    <>
      {P(2, 9, 1, 2)}
      {P(3, 8, 1, 3)}
      {P(4, 7, 1, 3)}
      {P(5, 6, 1, 3)}
      {P(6, 5, 1, 3)}
      {P(7, 4, 1, 3)}
      {P(8, 3, 1, 4)}
      {P(9, 2, 1, 5)}
      {P(10, 3, 1, 5)}
      {P(11, 4, 1, 4)}
      {P(12, 5, 1, 3)}
      {P(7, 7, 1, 2)}
      {P(8, 9, 1, 2)}
      {P(6, 10, 3, 1)}
      {P(5, 11, 2, 1)}
    </>,
  )

/** Notes pad. */
export const IconNotes = () =>
  svg(
    <>
      {P(3, 2, 10, 1)}
      {P(3, 2, 1, 12)}
      {P(3, 13, 10, 1)}
      {P(12, 2, 1, 12)}
      {P(5, 5, 6, 1)}
      {P(5, 7, 6, 1)}
      {P(5, 9, 6, 1)}
      {P(5, 11, 4, 1)}
    </>,
  )

/** Paint palette. */
export const IconPalette = () =>
  svg(
    <>
      {P(2, 4, 1, 8)}
      {P(3, 3, 1, 10)}
      {P(4, 2, 7, 1)}
      {P(11, 3, 1, 2)}
      {P(12, 4, 1, 1)}
      {P(4, 12, 4, 1)}
      {P(8, 11, 1, 2)}
      {P(9, 10, 1, 1)}
      {P(11, 2, 2, 1)}
      {P(12, 3, 2, 1)}
      {P(13, 4, 1, 2)}
      {P(13, 6, 1, 2)}
      {P(12, 8, 1, 1)}
      {P(10, 9, 1, 1)}
      {P(6, 6, 2, 2)}
    </>,
  )

/** Checklist. */
export const IconTodo = () =>
  svg(
    <>
      {P(2, 3, 12, 1)}
      {P(2, 3, 1, 10)}
      {P(2, 12, 12, 1)}
      {P(13, 3, 1, 10)}
      {P(4, 6, 1, 1)}
      {P(5, 7, 1, 1)}
      {P(6, 6, 1, 1)}
      {P(8, 5, 5, 1)}
      {P(4, 10, 1, 1)}
      {P(5, 11, 1, 1)}
      {P(6, 10, 1, 1)}
      {P(8, 9, 5, 1)}
    </>,
  )

/** Folder / portfolio. */
export const IconFolder = () =>
  svg(
    <>
      {P(1, 4, 3, 1)}
      {P(1, 4, 1, 9)}
      {P(14, 4, 1, 9)}
      {P(1, 12, 14, 1)}
      {P(3, 5, 3, 1)}
      {P(5, 6, 9, 1)}
      {P(3, 5, 1, 7)}
      {P(4, 5, 1, 7)}
      {P(5, 6, 1, 6)}
      {P(13, 6, 1, 6)}
      {P(6, 6, 7, 1)}
    </>,
  )

/** Rock / Paper / Scissors. */
export const IconRps = () =>
  svg(
    <>
      {P(2, 6, 3, 1)}
      {P(3, 5, 1, 2)}
      {P(4, 7, 2, 3)}
      {P(3, 10, 2, 3)}
      {P(2, 11, 1, 2)}
      {P(4, 13, 4, 1)}
      {P(7, 3, 3, 3)}
      {P(9, 6, 2, 4)}
      {P(10, 4, 3, 3)}
      {P(12, 7, 2, 3)}
      {P(11, 10, 3, 3)}
      {P(13, 12, 2, 1)}
      {P(6, 11, 3, 3)}
    </>,
  )

export const EXAMPLE_ICONS: Record<string, () => React.JSX.Element> = {
  birthday: IconCake,
  adventure: IconPlane,
  rps: IconRps,
  notes: IconNotes,
  paint: IconPalette,
  todo: IconTodo,
  portfolio: IconFolder,
}
