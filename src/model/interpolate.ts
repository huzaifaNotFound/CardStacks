/**
 * The entire data-binding layer: `{{name}}` in any text prop resolves
 * against the runtime variable bag. No expressions, no logic.
 *
 * Shared verbatim (in spirit) by the editor renderer and the standalone runtime.
 */

const TOKEN = /\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g

export function interpolate(
  text: unknown,
  vars: Record<string, string | number> | undefined,
): string {
  const s = text == null ? '' : String(text)
  if (!vars || s.indexOf('{{') === -1) return s
  return s.replace(TOKEN, (_m, name: string) => {
    const v = vars[name]
    return v === undefined || v === null ? '' : String(v)
  })
}

/** Variable names referenced by a piece of text. */
export function referencedVars(text: unknown): string[] {
  const s = text == null ? '' : String(text)
  const out: string[] = []
  for (const m of s.matchAll(TOKEN)) out.push(m[1])
  return out
}
