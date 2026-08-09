import CardCanvas from './CardCanvas'
import CardList from './CardList'
import Inspector from './Inspector/Inspector'
import MenuBar from './MenuBar'
import type { MenuCommands } from './MenuBar'
import Toolbar from './Toolbar'
import WidgetPalette from './WidgetPalette'

export default function Editor({ cmd }: { cmd: MenuCommands }) {
  return (
    <div className="app-window editor-window col">
      <MenuBar cmd={cmd} />
      <Toolbar onRun={cmd.onRun} onExport={cmd.onExportHtml} />

      <div className="editor-body">
        <CardList />
        <CardCanvas />
        <Inspector />
      </div>

      <WidgetPalette />
    </div>
  )
}
