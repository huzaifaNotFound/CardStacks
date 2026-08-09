/**
 * 1-bit toolbar icons drawn on a 16x16 pixel grid, classic Macintosh style.
 * Simple, bold, recognizable at a glance. `currentColor` for inversion.
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

/** Pointing hand — the browse/interact tool (like Decker's hand). */
export const IconInteract = (_: P) =>
  svg(
    <>
      {px(7, 1, 2, 1)}
      {px(6, 2, 4, 1)}
      {px(6, 3, 4, 1)}
      {px(6, 4, 4, 1)}
      {px(5, 5, 5, 1)}
      {px(5, 6, 5, 1)}
      {px(4, 7, 6, 1)}
      {px(4, 8, 6, 1)}
      {px(5, 9, 7, 1)}
      {px(6, 10, 8, 1)}
      {px(7, 11, 8, 1)}
      {px(8, 12, 7, 1)}
      {px(7, 13, 7, 1)}
      {px(3, 9, 1, 1)}
    </>,
  )

/** Arrow cursor — move/select widgets. */
export const IconWidgets = (_: P) =>
  svg(
    <>
      {px(2, 2, 1, 1)}
      {px(2, 3, 2, 1)}
      {px(3, 4, 2, 1)}
      {px(4, 5, 2, 1)}
      {px(5, 6, 2, 1)}
      {px(6, 7, 2, 1)}
      {px(6, 8, 1, 1)}
      {px(5, 9, 1, 1)}
      {px(4, 10, 1, 1)}
      {px(4, 11, 1, 1)}
      {px(6, 11, 1, 1)}
      {px(7, 12, 1, 1)}
      {px(8, 13, 1, 1)}
      {px(5, 12, 1, 1)}
    </>,
  )

/** Marquee selection — four corner brackets. */
export const IconSelect = (_: P) =>
  svg(
    <>
      {px(2, 2, 4, 1)}
      {px(11, 2, 4, 1)}
      {px(2, 13, 4, 1)}
      {px(11, 13, 4, 1)}
      {px(2, 2, 1, 4)}
      {px(2, 11, 1, 4)}
      {px(14, 2, 1, 4)}
      {px(14, 11, 1, 4)}
    </>,
  )

/** Pencil — diagonal. */
export const IconPencil = (_: P) =>
  svg(
    <>
      {px(1, 12, 2, 1)}
      {px(2, 11, 2, 1)}
      {px(3, 10, 2, 1)}
      {px(4, 9, 2, 1)}
      {px(5, 8, 2, 1)}
      {px(6, 7, 2, 1)}
      {px(7, 6, 2, 1)}
      {px(8, 5, 2, 1)}
      {px(9, 4, 2, 1)}
      {px(10, 3, 2, 1)}
      {px(11, 2, 2, 1)}
      {px(12, 1, 2, 1)}
      {px(1, 13, 1, 1)}
      {px(2, 12, 1, 1)}
    </>,
  )

/** Eraser — rounded block. */
export const IconEraser = (_: P) =>
  svg(
    <>
      {px(2, 3, 12, 1)}
      {px(2, 3, 1, 10)}
      {px(13, 3, 1, 10)}
      {px(2, 12, 12, 1)}
      {px(4, 6, 8, 1)}
      {px(4, 7, 8, 1)}
      {px(4, 8, 8, 1)}
    </>,
  )

/** Straight line. */
export const IconLine = (_: P) =>
  svg(
    <>
      {px(2, 13, 1, 1)}
      {px(3, 12, 1, 1)}
      {px(4, 11, 1, 1)}
      {px(5, 10, 1, 1)}
      {px(6, 9, 1, 1)}
      {px(7, 8, 1, 1)}
      {px(8, 7, 1, 1)}
      {px(9, 6, 1, 1)}
      {px(10, 5, 1, 1)}
      {px(11, 4, 1, 1)}
      {px(12, 3, 1, 1)}
      {px(13, 2, 1, 1)}
      {px(2, 12, 1, 1)}
      {px(13, 1, 1, 1)}
    </>,
  )

/** Rectangle outline. */
export const IconBox = (_: P) =>
  svg(
    <>
      {px(2, 3, 12, 1)}
      {px(2, 12, 12, 1)}
      {px(2, 3, 1, 10)}
      {px(13, 3, 1, 10)}
    </>,
  )

/** Filled rectangle. */
export const IconBoxFilled = (_: P) => svg(px(2, 3, 12, 10))

/** Oval outline. */
export const IconOval = (_: P) =>
  svg(
    <>
      {px(5, 3, 6, 1)}
      {px(3, 4, 10, 1)}
      {px(2, 5, 1, 6)}
      {px(13, 5, 1, 6)}
      {px(3, 11, 10, 1)}
      {px(5, 12, 6, 1)}
    </>,
  )

/** Filled oval. */
export const IconOvalFilled = (_: P) =>
  svg(
    <>
      {px(5, 3, 6, 1)}
      {px(3, 4, 10, 1)}
      {px(2, 5, 12, 6)}
      {px(3, 11, 10, 1)}
      {px(5, 12, 6, 1)}
    </>,
  )

/** Text tool — serif T. */
export const IconText = (_: P) =>
  svg(
    <>
      {px(4, 2, 8, 2)}
      {px(7, 4, 2, 9)}
      {px(5, 13, 6, 1)}
    </>,
  )

/** Undo — left-returning arrow. */
export const IconUndo = (_: P) =>
  svg(
    <>
      {px(9, 2, 5, 1)}
      {px(5, 3, 9, 1)}
      {px(4, 4, 1, 1)}
      {px(14, 4, 1, 1)}
      {px(3, 5, 1, 1)}
      {px(14, 5, 1, 1)}
      {px(3, 6, 1, 1)}
      {px(14, 6, 1, 1)}
      {px(3, 7, 2, 1)}
      {px(14, 7, 1, 1)}
      {px(2, 8, 2, 1)}
      {px(1, 9, 2, 1)}
    </>,
  )

/** Redo — right-returning arrow. */
export const IconRedo = (_: P) =>
  svg(
    <>
      {px(2, 2, 5, 1)}
      {px(2, 3, 9, 1)}
      {px(1, 4, 1, 1)}
      {px(11, 4, 1, 1)}
      {px(1, 5, 1, 1)}
      {px(12, 5, 1, 1)}
      {px(1, 6, 1, 1)}
      {px(12, 6, 1, 1)}
      {px(1, 7, 1, 1)}
      {px(11, 7, 2, 1)}
      {px(12, 8, 2, 1)}
      {px(13, 9, 2, 1)}
    </>,
  )

/** Run — filled play triangle. */
export const IconRun = (_: P) =>
  svg(
    <>
      {px(4, 3, 1, 10)}
      {px(5, 4, 1, 8)}
      {px(6, 5, 1, 6)}
      {px(7, 6, 1, 4)}
      {px(8, 7, 1, 2)}
      {px(9, 8, 1, 1)}
    </>,
  )

/** Stop — filled square. */
export const IconStop = (_: P) => svg(px(3, 3, 10, 10))

/** Export — arrow leaving a tray. */
export const IconExport = (_: P) =>
  svg(
    <>
      {px(2, 6, 12, 7)}
      {px(7, 1, 2, 4)}
      {px(5, 3, 1, 1)}
      {px(6, 2, 1, 1)}
      {px(9, 2, 1, 1)}
      {px(10, 3, 1, 1)}
      {px(6, 7, 4, 1)}
      {px(3, 10, 10, 1)}
    </>,
  )

/** Card — used for the stack list. */
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

/** A small stack of cards — the CardStacks mark. */
export const IconLogo = (_: P) =>
  svg(
    <>
      {px(6, 1, 8, 1)}
      {px(6, 1, 1, 9)}
      {px(13, 1, 1, 9)}
      {px(6, 9, 8, 1)}
      {px(3, 4, 10, 1)}
      {px(3, 4, 1, 9)}
      {px(12, 4, 1, 9)}
      {px(3, 12, 10, 1)}
      {px(5, 7, 5, 1)}
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
      {px(5, 1, 6, 1)}
      {px(3, 3, 10, 1)}
      {px(3, 4, 1, 1)}
      {px(12, 4, 1, 1)}
      {px(4, 5, 1, 8)}
      {px(11, 5, 1, 8)}
      {px(4, 12, 8, 1)}
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

/** Close box (✕) for the mini-app title bar. */
export const IconClose = (_: P) =>
  svg(
    <>
      {px(3, 3, 2, 1)}
      {px(3, 4, 1, 1)}
      {px(11, 3, 2, 1)}
      {px(12, 4, 1, 1)}
      {px(3, 11, 1, 1)}
      {px(4, 12, 2, 1)}
      {px(12, 11, 1, 1)}
      {px(11, 12, 2, 1)}
      {px(6, 5, 1, 1)}
      {px(7, 6, 2, 2)}
      {px(9, 9, 1, 1)}
      {px(8, 10, 2, 2)}
      {px(6, 9, 1, 1)}
      {px(9, 6, 1, 1)}
      {px(5, 8, 1, 1)}
      {px(10, 7, 1, 1)}
    </>,
  )
