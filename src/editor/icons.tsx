/**
 * 1-bit toolbar icons drawn on a 16x16 pixel grid.
 * `currentColor` so they invert with the button state.
 */

type P = { className?: string }

const svg = (children: React.ReactNode, key?: string) => (
  <svg key={key} viewBox="0 0 16 16" shapeRendering="crispEdges" fill="currentColor">
    {children}
  </svg>
)

const px = (x: number, y: number, w = 1, h = 1, k?: string) => (
  <rect key={k ?? `${x}-${y}-${w}-${h}`} x={x} y={y} width={w} height={h} />
)

export const IconInteract = (_: P) =>
  svg(
    <>
      {px(6, 1, 2, 8)}
      {px(5, 3, 1, 6)}
      {px(8, 4, 1, 5)}
      {px(9, 5, 1, 4)}
      {px(10, 6, 1, 3)}
      {px(4, 8, 7, 5)}
      {px(3, 9, 1, 3)}
      {px(5, 13, 5, 1)}
    </>,
  )

export const IconWidgets = (_: P) =>
  svg(
    <>
      {px(1, 2, 8, 1)}
      {px(1, 2, 1, 6)}
      {px(1, 8, 8, 1)}
      {px(9, 2, 1, 7)}
      {px(6, 6, 9, 1)}
      {px(6, 6, 1, 7)}
      {px(6, 13, 9, 1)}
      {px(14, 6, 1, 8)}
    </>,
  )

export const IconSelect = (_: P) =>
  svg(
    <>
      {[1, 3, 5, 7, 9, 11, 13].map((x) => px(x, 2, 1, 1, `t${x}`))}
      {[1, 3, 5, 7, 9, 11, 13].map((x) => px(x, 13, 1, 1, `b${x}`))}
      {[3, 5, 7, 9, 11].map((y) => px(2, y, 1, 1, `l${y}`))}
      {[3, 5, 7, 9, 11].map((y) => px(13, y, 1, 1, `r${y}`))}
    </>,
  )

export const IconPencil = (_: P) =>
  svg(
    <>
      {px(10, 1, 3, 1)}
      {px(9, 2, 4, 1)}
      {px(8, 3, 4, 1)}
      {px(7, 4, 4, 1)}
      {px(6, 5, 4, 1)}
      {px(5, 6, 4, 1)}
      {px(4, 7, 4, 1)}
      {px(3, 8, 4, 1)}
      {px(2, 9, 4, 1)}
      {px(2, 10, 3, 1)}
      {px(2, 11, 2, 1)}
      {px(1, 12, 2, 1)}
      {px(1, 13, 1, 1)}
    </>,
  )

export const IconEraser = (_: P) =>
  svg(
    <>
      {px(6, 2, 7, 1)}
      {px(5, 3, 1, 1)}
      {px(13, 3, 1, 1)}
      {px(4, 4, 1, 1)}
      {px(13, 4, 1, 1)}
      {px(3, 5, 1, 1)}
      {px(12, 5, 1, 1)}
      {px(2, 6, 1, 1)}
      {px(11, 6, 1, 1)}
      {px(2, 7, 10, 1)}
      {px(2, 8, 10, 1)}
      {px(2, 9, 10, 1)}
      {px(2, 10, 10, 1)}
      {px(1, 12, 14, 1)}
    </>,
  )

export const IconLine = (_: P) =>
  svg(
    <>
      {px(2, 12, 2, 2)}
      {px(4, 10, 2, 2)}
      {px(6, 8, 2, 2)}
      {px(8, 6, 2, 2)}
      {px(10, 4, 2, 2)}
      {px(12, 2, 2, 2)}
    </>,
  )

export const IconBox = (_: P) =>
  svg(
    <>
      {px(2, 3, 12, 1)}
      {px(2, 12, 12, 1)}
      {px(2, 3, 1, 10)}
      {px(13, 3, 1, 10)}
    </>,
  )

export const IconBoxFilled = (_: P) => svg(px(2, 3, 12, 10))

export const IconOval = (_: P) =>
  svg(
    <>
      {px(5, 3, 6, 1)}
      {px(5, 12, 6, 1)}
      {px(3, 5, 1, 6)}
      {px(12, 5, 1, 6)}
      {px(4, 4, 1, 1)}
      {px(11, 4, 1, 1)}
      {px(4, 11, 1, 1)}
      {px(11, 11, 1, 1)}
    </>,
  )

export const IconOvalFilled = (_: P) =>
  svg(
    <>
      {px(5, 3, 6, 1)}
      {px(4, 4, 8, 1)}
      {px(3, 5, 10, 6)}
      {px(4, 11, 8, 1)}
      {px(5, 12, 6, 1)}
    </>,
  )

export const IconText = (_: P) =>
  svg(
    <>
      {px(2, 2, 12, 2)}
      {px(7, 4, 2, 9)}
      {px(4, 13, 8, 1)}
    </>,
  )

export const IconUndo = (_: P) =>
  svg(
    <>
      {px(2, 7, 1, 1)}
      {px(3, 6, 1, 1)}
      {px(3, 8, 1, 1)}
      {px(4, 5, 1, 1)}
      {px(4, 9, 1, 1)}
      {px(2, 7, 8, 1)}
      {px(10, 8, 1, 1)}
      {px(11, 9, 1, 3)}
      {px(3, 12, 9, 1)}
    </>,
  )

export const IconRedo = (_: P) =>
  svg(
    <>
      {px(13, 7, 1, 1)}
      {px(12, 6, 1, 1)}
      {px(12, 8, 1, 1)}
      {px(11, 5, 1, 1)}
      {px(11, 9, 1, 1)}
      {px(6, 7, 8, 1)}
      {px(5, 8, 1, 1)}
      {px(4, 9, 1, 3)}
      {px(4, 12, 9, 1)}
    </>,
  )

export const IconRun = (_: P) =>
  svg(
    <>
      {px(4, 2, 1, 12)}
      {px(5, 3, 1, 10)}
      {px(6, 4, 1, 8)}
      {px(7, 5, 1, 6)}
      {px(8, 6, 1, 4)}
      {px(9, 7, 1, 2)}
    </>,
  )

export const IconStop = (_: P) => svg(px(3, 3, 10, 10))

export const IconExport = (_: P) =>
  svg(
    <>
      {px(7, 1, 2, 8)}
      {px(5, 3, 1, 1)}
      {px(6, 2, 1, 1)}
      {px(9, 2, 1, 1)}
      {px(10, 3, 1, 1)}
      {px(2, 9, 1, 5)}
      {px(13, 9, 1, 5)}
      {px(2, 13, 12, 1)}
    </>,
  )

export const IconCard = (_: P) =>
  svg(
    <>
      {px(2, 2, 12, 1)}
      {px(2, 13, 12, 1)}
      {px(2, 2, 1, 12)}
      {px(13, 2, 1, 12)}
      {px(4, 5, 8, 1)}
      {px(4, 7, 8, 1)}
      {px(4, 9, 5, 1)}
    </>,
  )

export const IconPlus = (_: P) =>
  svg(
    <>
      {px(7, 3, 2, 10)}
      {px(3, 7, 10, 2)}
    </>,
  )

export const IconTrash = (_: P) =>
  svg(
    <>
      {px(6, 1, 4, 1)}
      {px(2, 3, 12, 1)}
      {px(4, 5, 1, 9)}
      {px(7, 5, 1, 9)}
      {px(10, 5, 1, 9)}
      {px(3, 13, 10, 1)}
    </>,
  )

export const IconCopy = (_: P) =>
  svg(
    <>
      {px(2, 2, 8, 1)}
      {px(2, 2, 1, 9)}
      {px(2, 10, 8, 1)}
      {px(9, 2, 1, 9)}
      {px(6, 5, 8, 1)}
      {px(6, 5, 1, 9)}
      {px(6, 13, 8, 1)}
      {px(13, 5, 1, 9)}
    </>,
  )

export const IconUp = (_: P) =>
  svg(
    <>
      {px(7, 3, 2, 10)}
      {px(6, 5, 1, 1)}
      {px(5, 6, 1, 1)}
      {px(4, 7, 1, 1)}
      {px(9, 5, 1, 1)}
      {px(10, 6, 1, 1)}
      {px(11, 7, 1, 1)}
    </>,
  )

export const IconDown = (_: P) =>
  svg(
    <>
      {px(7, 3, 2, 10)}
      {px(6, 10, 1, 1)}
      {px(5, 9, 1, 1)}
      {px(4, 8, 1, 1)}
      {px(9, 10, 1, 1)}
      {px(10, 9, 1, 1)}
      {px(11, 8, 1, 1)}
    </>,
  )
