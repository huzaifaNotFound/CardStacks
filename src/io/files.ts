/** Open/save project files and import exported HTML back into the editor. */

function pickFile(accept: string): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.onchange = () => {
      const f = input.files?.[0]
      if (!f) return resolve(null)
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result ?? ''))
      reader.onerror = () => resolve(null)
      reader.readAsText(f)
    }
    input.oncancel = () => resolve(null)
    input.click()
  })
}

/** Pick a .stack / .json file, returning its raw text (or null if cancelled). */
export function pickStackFile(): Promise<string | null> {
  return pickFile('.stack,.json,application/json')
}

/** Pick an HTML file (exported CardStacks app), returning its raw text. */
export function pickHtmlFile(): Promise<string | null> {
  return pickFile('.html,.htm,text/html')
}

/**
 * Locate the Stack JSON embedded in one of our exported HTML files.
 * Only recognizes files with the `cardstacks-data` marker — never scrapes
 * arbitrary external pages.
 */
export function extractEmbeddedStack(html: string): string | null {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const node = doc.getElementById('cardstacks-data')
    if (node && node.textContent) return node.textContent
  } catch {
    /* fall through to regex */
  }
  const m = html.match(/<script[^>]+id=["']cardstacks-data["'][^>]*>([\s\S]*?)<\/script>/i)
  return m ? m[1] : null
}
