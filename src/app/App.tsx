import { useMemo, useState } from 'react'
import Editor from '../editor/Editor'
import type { MenuCommands } from '../editor/MenuBar'
import HomeScreen from '../home/HomeScreen'
import RunMode from '../runtime/RunMode'
import Dialog from '../ui/Dialog'
import { downloadFile } from '../export/download'
import { exportStack } from '../export/exportHtml'
import { extractEmbeddedStack, pickHtmlFile, pickStackFile } from '../io/files'
import { saveStackToLocal } from '../io/persist'
import { useAutosave } from '../io/useAutosave'
import { StackFormatError, validateStack } from '../model/validate'
import { useShortcuts } from './shortcuts'
import { useStore } from './store'

function saveNow(): void {
  const s = useStore.getState()
  saveStackToLocal(s.stack)
  s.markSaved()
  downloadFile(`${s.stack.name || 'stack'}.stack`, JSON.stringify(s.stack, null, 2), 'application/json')
}

export default function App() {
  useAutosave()
  useShortcuts({
    onSaveStack: () => useStore.getState().view === 'editor' && saveNow(),
    onExportHtml: () => useStore.getState().view === 'editor' && exportStack(useStore.getState().stack),
    onNewStack: () => {
      newStack()
      setView('editor')
    },
  })
  const view = useStore((s) => s.view)
  const setView = useStore((s) => s.setView)
  const newStack = useStore((s) => s.newStack)
  const runtimeMessage = useStore((s) => s.runtimeMessage)
  const clearRuntimeMessage = useStore((s) => s.setRuntimeMessage)
  const [dialog, setDialog] = useState<{ title: string; body: string } | null>(null)

  const showError = (title: string, e: unknown) => {
    const body = e instanceof StackFormatError ? e.message : e instanceof Error ? e.message : String(e)
    setDialog({ title, body })
  }

  const cmd: MenuCommands = useMemo(() => {
    const onSaveStack = () => {
      const s = useStore.getState()
      saveStackToLocal(s.stack)
      s.markSaved()
      downloadFile(`${s.stack.name || 'stack'}.stack`, JSON.stringify(s.stack, null, 2), 'application/json')
    }

    const onOpenStack = async () => {
      const text = await pickStackFile()
      if (text == null) return
      try {
        const { stack, warnings } = validateStack(JSON.parse(text))
        useStore.getState().loadStack(stack)
        if (warnings.length) {
          setDialog({ title: 'Opened with warnings', body: warnings.slice(0, 8).join('\n') })
        }
      } catch (e) {
        showError('Open Stack failed', e)
      }
    }

    const onImportHtml = async () => {
      const text = await pickHtmlFile()
      if (text == null) return
      const json = extractEmbeddedStack(text)
      if (!json) {
        setDialog({
          title: 'Import failed',
          body: 'This HTML file does not contain a CardStacks stack. Only files exported by CardStacks can be imported.',
        })
        return
      }
      try {
        const { stack, warnings } = validateStack(JSON.parse(json))
        useStore.getState().loadStack(stack)
        if (warnings.length) {
          setDialog({ title: 'Opened with warnings', body: warnings.slice(0, 8).join('\n') })
        }
      } catch (e) {
        showError('Import HTML failed', e)
      }
    }

    return {
      onNewStack: newStack,
      onOpenStack,
      onImportHtml,
      onSaveStack,
      onExportHtml: () => exportStack(useStore.getState().stack),
      onRun: () => setView('run'),
      onGoHome: () => {
        const s = useStore.getState()
        if (s.view === 'editor' && s.dirty) saveStackToLocal(s.stack)
        setView('home')
      },
      onAbout: () =>
        setDialog({
          title: 'About CardStacks',
          body: 'CardStacks v0.1\n\nA modern HyperCard inspired software.\nMake stacks. Play them. Export them.',
        }),
    }
  }, [newStack, setView])

  return (
    <div className="app-root">
      {view === 'home' ? (
        <HomeScreen cmd={cmd} />
      ) : view === 'run' ? (
        <RunMode />
      ) : (
        <Editor cmd={cmd} />
      )}
      {dialog && (
        <Dialog title={dialog.title} onClose={() => setDialog(null)}>
          {dialog.body}
        </Dialog>
      )}
      {runtimeMessage != null && (
        <Dialog title="Message" onClose={() => clearRuntimeMessage(null)}>
          {runtimeMessage}
        </Dialog>
      )}
    </div>
  )
}
