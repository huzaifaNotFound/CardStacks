/**
 * 1-bit toolbar icons, 20x20 pixel grid. Bold, simple, recognizable at a glance,
 * in the classic Macintosh tool-palette style. `currentColor` for inversion.
 */

type P = { className?: string }

const svg = (children: React.ReactNode, key?: string) => (
  <svg key={key} viewBox="0 0 20 20" shapeRendering="crispEdges" fill="currentColor">
    {children}
  </svg>
)

const px = (x: number, y: number, w = 1, h = 1, k?: string) => (
  <rect key={k ?? `${x}-${y}-${w}-${h}`} x={x} y={y} width={w} height={h} />
)

/** Arrow cursor — the Widgets / select tool. */
export const IconWidgets = (_: P) =>
  svg(
    <>
      {px(3, 3, 1, 1)}
      {px(3, 4, 2, 1)}
      {px(4, 5, 2, 1)}
      {px(5, 6, 2, 1)}
      {px(6, 7, 2, 1)}
      {px(7, 8, 2, 1)}
      {px(7, 9, 1, 1)}
      {px(8, 9, 1, 1)}
      {px(6, 10, 1, 1)}
      {px(7, 10, 1, 1)}
      {px(5, 11, 1, 1)}
      {px(6, 11, 1, 1)}
      {px(6, 12, 1, 1)}
      {px(7, 12, 1, 1)}
      {px(8, 13, 1, 1)}
      {px(9, 13, 1, 1)}
      {px(10, 14, 1, 1)}
    </>,
  )

/** Pointing hand — the Interact tool. */
export const IconInteract = (_: P) =>
  svg(
    <>
      {px(9, 2, 2, 1)}
      {px(8, 3, 4, 1)}
      {px(8, 4, 4, 1)}
      {px(8, 5, 4, 1)}
      {px(7, 6, 5, 1)}
      {px(7, 7, 5, 1)}
      {px(6, 8, 6, 1)}
      {px(6, 9, 6, 1)}
      {px(7, 10, 7, 1)}
      {px(8, 11, 7, 1)}
      {px(9, 12, 7, 1)}
      {px(9, 13, 6, 1)}
      {px(8, 14, 6, 1)}
      {px(4, 9, 1, 1)}
    </>,
  )

/** Pencil — diagonal. */
export const IconPencil = (_: P) =>
  svg(
    <>
      {px(2, 15, 2, 1)}
      {px(3, 14, 2, 1)}
      {px(4, 13, 2, 1)}
      {px(5, 12, 2, 1)}
      {px(6, 11, 2, 1)}
      {px(7, 10, 2, 1)}
      {px(8, 9, 2, 1)}
      {px(9, 8, 2, 1)}
      {px(10, 7, 2, 1)}
      {px(11, 6, 2, 1)}
      {px(12, 5, 2, 1)}
      {px(13, 4, 2, 1)}
      {px(14, 3, 2, 1)}
      {px(15, 2, 2, 1)}
      {px(2, 16, 1, 1)}
      {px(15, 2, 1, 1)}
      {px(16, 1, 1, 1)}
      {px(16, 3, 2, 1)}
    </>,
  )

/** Eraser — rounded block. */
export const IconEraser = (_: P) =>
  svg(
    <>
      {px(3, 5, 14, 1)}
      {px(3, 16, 14, 1)}
      {px(3, 5, 1, 12)}
      {px(16, 5, 1, 12)}
      {px(6, 9, 8, 1)}
      {px(6, 10, 8, 1)}
      {px(6, 11, 8, 1)}
    </>,
  )

/** Straight line. */
export const IconLine = (_: P) =>
  svg(
    <>
      {px(3, 16, 1, 1)}
      {px(4, 15, 1, 1)}
      {px(5, 14, 1, 1)}
      {px(6, 13, 1, 1)}
      {px(7, 12, 1, 1)}
      {px(8, 11, 1, 1)}
      {px(9, 10, 1, 1)}
      {px(10, 9, 1, 1)}
      {px(11, 8, 1, 1)}
      {px(12, 7, 1, 1)}
      {px(13, 6, 1, 1)}
      {px(14, 5, 1, 1)}
      {px(15, 4, 1, 1)}
      {px(16, 3, 1, 1)}
      {px(3, 15, 1, 1)}
      {px(16, 2, 1, 1)}
    </>,
  )

/** Rectangle outline. */
export const IconBox = (_: P) =>
  svg(
    <>
      {px(3, 5, 14, 1)}
      {px(3, 16, 14, 1)}
      {px(3, 5, 1, 12)}
      {px(16, 5, 1, 12)}
    </>,
  )

/** Oval outline. */
export const IconOval = (_: P) =>
  svg(
    <>
      {px(6, 4, 8, 1)}
      {px(4, 5, 12, 1)}
      {px(3, 6, 1, 8)}
      {px(16, 6, 1, 8)}
      {px(4, 14, 12, 1)}
      {px(6, 15, 8, 1)}
    </>,
  )

/** Text tool — bold T. */
export const IconText = (_: P) =>
  svg(
    <>
      {px(6, 3, 8, 2)}
      {px(9, 5, 2, 11)}
      {px(7, 16, 6, 1)}
    </>,
  )

/** Undo — left-returning arrow. */
export const IconUndo = (_: P) =>
  svg(
    <>
      {px(12, 3, 5, 1)}
      {px(7, 4, 10, 1)}
      {px(6, 5, 1, 1)}
      {px(17, 5, 1, 1)}
      {px(5, 6, 1, 1)}
      {px(17, 6, 1, 1)}
      {px(5, 7, 1, 1)}
      {px(17, 7, 1, 1)}
      {px(5, 8, 2, 1)}
      {px(17, 8, 1, 1)}
      {px(4, 9, 2, 1)}
      {px(3, 10, 2, 1)}
      {px(2, 11, 2, 1)}
    </>,
  )

/** Redo — right-returning arrow. */
export const IconRedo = (_: P) =>
  svg(
    <>
      {px(3, 3, 5, 1)}
      {px(3, 4, 10, 1)}
      {px(2, 5, 1, 1)}
      {px(13, 5, 1, 1)}
      {px(2, 6, 1, 1)}
      {px(14, 6, 1, 1)}
      {px(2, 7, 1, 1)}
      {px(14, 7, 1, 1)}
      {px(2, 8, 1, 1)}
      {px(13, 8, 2, 1)}
      {px(14, 9, 2, 1)}
      {px(15, 10, 2, 1)}
      {px(16, 11, 2, 1)}
    </>,
  )

/** Run — filled play triangle. */
export const IconRun = (_: P) =>
  svg(
    <>
      {px(7, 5, 1, 12)}
      {px(8, 6, 1, 10)}
      {px(9, 7, 1, 8)}
      {px(10, 8, 1, 6)}
      {px(11, 9, 1, 4)}
      {px(12, 10, 1, 2)}
      {px(13, 11, 1, 1)}
    </>,
  )

/** Export — arrow leaving a tray. */
export const IconExport = (_: P) =>
  svg(
    <>
      {px(9, 2, 2, 6)}
      {px(7, 4, 1, 1)}
      {px(8, 3, 1, 1)}
      {px(10, 3, 1, 1)}
      {px(11, 4, 1, 1)}
      {px(7, 8, 6, 1)}
      {px(4, 12, 12, 1)}
      {px(4, 12, 1, 5)}
      {px(16, 12, 1, 5)}
      {px(4, 16, 12, 1)}
    </>,
  )

/** Card — used for the stack list. */
export const IconCard = (_: P) =>
  svg(
    <>
      {px(3, 3, 14, 1)}
      {px(3, 17, 14, 1)}
      {px(3, 3, 1, 15)}
      {px(16, 3, 1, 15)}
      {px(6, 7, 8, 1)}
      {px(6, 9, 8, 1)}
      {px(6, 11, 6, 1)}
    </>,
  )

/** A small stack of cards — the CardStacks mark. */
export const IconLogo = (_: P) =>
  svg(
    <>
      {px(8, 1, 9, 1)}
      {px(8, 1, 1, 10)}
      {px(16, 1, 1, 10)}
      {px(8, 10, 9, 1)}
      {px(4, 5, 12, 1)}
      {px(4, 5, 1, 11)}
      {px(15, 5, 1, 11)}
      {px(4, 15, 12, 1)}
      {px(6, 8, 6, 1)}
    </>,
  )

export const IconPlus = (_: P) =>
  svg(
    <>
      {px(9, 3, 2, 14)}
      {px(3, 9, 14, 2)}
    </>,
  )

export const IconTrash = (_: P) =>
  svg(
    <>
      {px(7, 2, 6, 1)}
      {px(4, 5, 12, 1)}
      {px(4, 6, 1, 1)}
      {px(15, 6, 1, 1)}
      {px(5, 7, 1, 10)}
      {px(14, 7, 1, 10)}
      {px(5, 16, 10, 1)}
    </>,
  )

export const IconCopy = (_: P) =>
  svg(
    <>
      {px(3, 3, 10, 1)}
      {px(3, 3, 1, 11)}
      {px(3, 13, 10, 1)}
      {px(12, 3, 1, 11)}
      {px(7, 7, 10, 1)}
      {px(7, 7, 1, 11)}
      {px(7, 17, 10, 1)}
      {px(16, 7, 1, 11)}
    </>,
  )

export const IconUp = (_: P) =>
  svg(
    <>
      {px(9, 3, 2, 14)}
      {px(8, 5, 1, 1)}
      {px(7, 6, 1, 1)}
      {px(6, 7, 1, 1)}
      {px(12, 5, 1, 1)}
      {px(13, 6, 1, 1)}
      {px(14, 7, 1, 1)}
    </>,
  )

export const IconDown = (_: P) =>
  svg(
    <>
      {px(9, 3, 2, 14)}
      {px(8, 14, 1, 1)}
      {px(7, 13, 1, 1)}
      {px(6, 12, 1, 1)}
      {px(12, 14, 1, 1)}
      {px(13, 13, 1, 1)}
      {px(14, 12, 1, 1)}
    </>,
  )

/** Close box (×). */
export const IconClose = (_: P) =>
  svg(
    <>
      {px(3, 3, 2, 1)}
      {px(3, 4, 1, 1)}
      {px(15, 3, 2, 1)}
      {px(16, 4, 1, 1)}
      {px(3, 15, 1, 1)}
      {px(4, 16, 2, 1)}
      {px(15, 16, 2, 1)}
      {px(16, 15, 1, 1)}
      {px(7, 7, 1, 1)}
      {px(8, 8, 4, 4)}
      {px(12, 12, 1, 1)}
      {px(6, 9, 1, 1)}
      {px(9, 6, 1, 1)}
      {px(10, 13, 1, 1)}
      {px(13, 10, 1, 1)}
    </>,
  )
