/**
 * 1-bit Mac-style icon tiles for the Home launcher.
 * 16x16 pixel grid, bold fills, recognizable at ~20px display.
 */

const svg = (children: React.ReactNode) => (
  <svg viewBox="0 0 16 16" shapeRendering="crispEdges" fill="#000">
    {children}
  </svg>
)

const px = (x: number, y: number, w = 1, h = 1) => (
  <rect key={`${x}-${y}-${w}-${h}`} x={x} y={y} width={w} height={h} />
)

/** Birthday cake — bold. */
export const IconCake = () =>
  svg(
    <>
      {px(4, 11, 8, 3)}
      {px(3, 7, 10, 4)}
      {px(2, 4, 12, 3)}
      {px(4, 2, 2, 4)}
      {px(10, 2, 2, 4)}
      {px(4, 1, 2, 2)}
      {px(10, 1, 2, 2)}
    </>,
  )

/** Paper plane — the adventure stack. */
export const IconPlane = () =>
  svg(
    <>
      {px(8, 2, 1, 1)}
      {px(7, 3, 3, 1)}
      {px(6, 4, 5, 1)}
      {px(5, 5, 7, 1)}
      {px(5, 6, 7, 1)}
      {px(6, 7, 5, 1)}
      {px(3, 11, 6, 1)}
      {px(4, 10, 4, 1)}
      {px(5, 9, 2, 1)}
    </>,
  )

/** Rock — RPS icon. */
export const IconRps = () =>
  svg(
    <>
      {px(4, 4, 8, 2)}
      {px(3, 6, 10, 4)}
      {px(4, 10, 8, 2)}
      {px(6, 6, 4, 2)}
    </>,
  )

/** Notepad — clean lines. */
export const IconNotes = () =>
  svg(
    <>
      {px(3, 2, 10, 1)}
      {px(3, 2, 1, 11)}
      {px(12, 2, 1, 11)}
      {px(3, 12, 10, 1)}
      {px(5, 5, 6, 1)}
      {px(5, 7, 6, 1)}
      {px(5, 9, 4, 1)}
    </>,
  )

/** Paintbrush — a diagonal brush. */
export const IconPalette = () =>
  svg(
    <>
      {px(2, 12, 2, 1)}
      {px(3, 11, 2, 1)}
      {px(4, 10, 2, 1)}
      {px(5, 9, 2, 1)}
      {px(6, 8, 2, 1)}
      {px(7, 7, 2, 1)}
      {px(8, 6, 2, 1)}
      {px(9, 5, 2, 1)}
      {px(10, 4, 2, 1)}
      {px(11, 3, 2, 1)}
      {px(12, 2, 2, 2)}
    </>,
  )

/** Checklist — two rows with checkmarks. */
export const IconTodo = () =>
  svg(
    <>
      {px(3, 2, 12, 1)}
      {px(3, 2, 1, 11)}
      {px(13, 2, 1, 11)}
      {px(3, 12, 12, 1)}
      {px(5, 6, 1, 1)}
      {px(6, 7, 1, 1)}
      {px(7, 6, 1, 1)}
      {px(9, 5, 4, 1)}
      {px(5, 10, 1, 1)}
      {px(6, 11, 1, 1)}
      {px(7, 10, 1, 1)}
      {px(9, 9, 4, 1)}
    </>,
  )

/** Folder — portfolio icon. */
export const IconFolder = () =>
  svg(
    <>
      {px(2, 4, 12, 1)}
      {px(2, 4, 1, 10)}
      {px(13, 4, 1, 10)}
      {px(2, 13, 12, 1)}
      {px(4, 5, 1, 8)}
      {px(5, 7, 1, 1)}
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
