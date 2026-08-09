import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

class NodeStub {
  constructor(tag) {
    this.tag = tag
    this.children = []
    this.className = ''
    this.style = {}
    this._text = ''
    this.listeners = {}
    this.value = ''
    this.placeholder = ''
    this.readOnly = false
    this.parentNode = null
  }
  set textContent(v) { this._text = String(v) }
  get textContent() { return this._text }
  appendChild(c) { c.parentNode = this; this.children.push(c); return c }
  remove() {
    if (this.parentNode) {
      const i = this.parentNode.children.indexOf(this)
      if (i >= 0) this.parentNode.children.splice(i, 1)
    }
  }
  addEventListener(t, fn) { (this.listeners[t] = this.listeners[t] || []).push(fn) }
  setAttribute() {}
  setAttributeNS() {}
  setPointerCapture() {}
  getContext() { return null }
  getBoundingClientRect() { return { left: 0, top: 0, width: 0, height: 0 } }
  querySelector() { return null }
  focus() {}
  toDataURL() { return 'x' }
}

globalThis.window = { open: () => {} }
globalThis.document = {
  createElement: (t) => new NodeStub(t),
  createElementNS: (_n, t) => new NodeStub(t),
}

let src = readFileSync(
  fileURLToPath(new URL('../src/runtime/runtime.standalone.js', import.meta.url)),
  'utf8',
)
src = src.replace('ctxOf = ctx', 'ctxOf = ctx; globalThis.__d1 = typeof ctxOf;')
src = src.replace(
  "dispatchEvent(widget, 'click', ctxOf(state))",
  "globalThis.__d2 = typeof ctxOf; dispatchEvent(widget, 'click', ctxOf(state))",
)

await import('data:text/javascript;base64,' + Buffer.from(src).toString('base64'))

console.log('typeof ctxOf at mount assign =', globalThis.__d1)

const stack = {
  schema: 'cardstacks/1', id: 's', name: 'x', size: { w: 100, h: 100 }, variables: {},
  cards: [
    { id: 'c1', name: 'a', background: 'white', events: [], widgets: [
      { id: 'w1', type: 'button', x: 0, y: 0, w: 50, h: 20, visible: true, props: { label: 'Go', style: 'classic', fontSize: 12, enabled: true }, events: [{ event: 'click', actions: [{ type: 'goBack' }] }] },
    ] },
  ],
}
const root = new NodeStub('div')
const rt = globalThis.window.CardStacksRuntime.mount(root, stack, {})
const btn = root.children[0].children.find((w) => String(w.className).includes('w-button')).children[0]
console.log('typeof ctxOf at click =', globalThis.__d2)
btn.listeners.click[0]()
console.log('CLICK OK')
