import type { Tool } from '../../app/store'
import {
  IconBox,
  IconEraser,
  IconInteract,
  IconLine,
  IconOval,
  IconPencil,
  IconText,
  IconWidgets,
} from '../icons'

export interface ToolInfo {
  id: Tool
  label: string
  icon: (p: { className?: string }) => JSX.Element
  /** Keyboard shortcut digit. */
  key?: string
  /** Draws onto the raster drawing layer. */
  raster?: boolean
  /** Creates a shape widget by dragging. */
  shape?: 'line' | 'rect' | 'oval'
}

/**
 * Only implemented tools appear here.
 *
 * Fill / outline are PROPERTIES of a shape (set in the inspector), not separate
 * tools — so there are no Filled Box / Filled Oval tools. Lasso, Flood, Polygon,
 * Zoom and Hand are deliberately absent (never faked).
 */
export const TOOLS: ToolInfo[] = [
  { id: 'widgets', label: 'Widgets', icon: IconWidgets, key: '1' },
  { id: 'interact', label: 'Interact', icon: IconInteract, key: '2' },
  { id: 'pencil', label: 'Pencil', icon: IconPencil, key: '3', raster: true },
  { id: 'eraser', label: 'Eraser', icon: IconEraser, key: '4', raster: true },
  { id: 'line', label: 'Line', icon: IconLine, key: '5', shape: 'line' },
  { id: 'box', label: 'Box', icon: IconBox, key: '6', shape: 'rect' },
  { id: 'oval', label: 'Oval', icon: IconOval, key: '7', shape: 'oval' },
  { id: 'text', label: 'Text', icon: IconText, key: 't' },
]

/** Visual separators in the toolbar, placed after these tool ids. */
export const TOOL_GROUPS: Tool[] = ['interact', 'eraser', 'oval']

export const TOOL_BY_ID = new Map(TOOLS.map((t) => [t.id, t]))

export function toolInfo(id: Tool): ToolInfo | undefined {
  return TOOL_BY_ID.get(id)
}
