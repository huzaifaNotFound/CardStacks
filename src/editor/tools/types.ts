import type { Tool } from '../../app/store'
import {
  IconBox,
  IconBoxFilled,
  IconEraser,
  IconInteract,
  IconLine,
  IconOval,
  IconOvalFilled,
  IconPencil,
  IconSelect,
  IconText,
  IconWidgets,
} from '../icons'

export interface ToolInfo {
  id: Tool
  label: string
  icon: (p: { className?: string }) => JSX.Element
  /** Keyboard shortcut digit. */
  key?: string
  /** Tools that draw onto the raster drawing layer. */
  raster?: boolean
  /** Tools that create a shape widget by dragging. */
  shape?: 'line' | 'rect' | 'oval'
  filled?: boolean
}

/**
 * Only implemented tools appear here.
 * Lasso, Flood, Polygon, Zoom and Hand are deliberately absent (never faked).
 */
export const TOOLS: ToolInfo[] = [
  { id: 'interact', label: 'Interact', icon: IconInteract, key: '1' },
  { id: 'widgets', label: 'Widgets', icon: IconWidgets, key: '2' },
  { id: 'select', label: 'Select', icon: IconSelect, key: '3' },
  { id: 'pencil', label: 'Pencil', icon: IconPencil, key: '4', raster: true },
  { id: 'eraser', label: 'Eraser', icon: IconEraser, key: '5', raster: true },
  { id: 'line', label: 'Line', icon: IconLine, key: '6', shape: 'line' },
  { id: 'box', label: 'Box', icon: IconBox, key: '7', shape: 'rect' },
  { id: 'boxFilled', label: 'Filled Box', icon: IconBoxFilled, key: '8', shape: 'rect', filled: true },
  { id: 'oval', label: 'Oval', icon: IconOval, key: '9', shape: 'oval' },
  { id: 'ovalFilled', label: 'Filled Oval', icon: IconOvalFilled, key: '0', shape: 'oval', filled: true },
  { id: 'text', label: 'Text', icon: IconText, key: 't' },
]

/** Visual separators in the toolbar, after these tool ids. */
export const TOOL_GROUPS: Tool[] = ['widgets', 'select', 'eraser', 'ovalFilled']

export const TOOL_BY_ID = new Map(TOOLS.map((t) => [t.id, t]))

export function toolInfo(id: Tool): ToolInfo | undefined {
  return TOOL_BY_ID.get(id)
}
