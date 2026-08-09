import type { Stack } from '../model/types'
import { downloadFile } from './download'
import { buildExportHtml, composeExportCss } from './template'
import runtimeSrc from '../runtime/runtime.standalone.js?raw'
import widgetsCss from '../styles/widgets.css?inline'
import silkscreen400 from '../assets/fonts/silkscreen-400.woff2?inline'
import silkscreen700 from '../assets/fonts/silkscreen-700.woff2?inline'

/** Build a fully standalone HTML application for a stack. */
export function buildExport(stack: Stack): string {
  // Escape "</script" so the embedded JSON can never break out of its tag.
  const stackJson = JSON.stringify(stack).replace(/</g, '\\u003c')

  const css = composeExportCss({ widgetsCss, font400: silkscreen400, font700: silkscreen700 })

  return buildExportHtml({
    title: `${stack.name} — CardStacks`,
    stackJson,
    runtimeSrc,
    css,
  })
}

/** Export + download a stack as standalone HTML. */
export function exportStack(stack: Stack): void {
  downloadFile(`${stack.name || 'stack'}.html`, buildExport(stack), 'text/html')
}
