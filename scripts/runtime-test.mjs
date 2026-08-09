// Functional smoke test for runtime.standalone.js with a minimal DOM stub.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

class NodeStub {
  constructor(tag) {
    this.tag = tag
    this.children = []
    this.className = ''
    this.style = {}
    this._text = ''
    this.attrs = {}
    this.listeners = {}
    this.value = ''
    this.readOnly = false
    this.placeholder = ''
    this.parentNode = null
  }
  set textContent(v) {
    this._text = String(v)
    if (String(v) === '') this.children = []
  }
  get textContent() { return this._text }
  appendChild(c) { c.parentNode = this; this.children.push(c); return c }
  remove() {
    if (this.parentNode) {
      const i = this.parentNode.children.indexOf(this)
      if (i >= 0) this.parentNode.children.splice(i, 1)
    }
  }
  addEventListener(t, fn) { (this.listeners[t] = this.listeners[t] || []).push(fn) }
  setAttribute(k, v) { this.attrs[k] = v }
  setAttributeNS(_n, k, v) { this.attrs[k] = v }
  setPointerCapture() {}
  click() {}
  getContext() { return null }
  getBoundingClientRect() { return { left: 0, top: 0, width: 0, height: 0 } }
  querySelector() { return null }
  focus() {}
  toDataURL() { return 'data:image/png;base64,AAA' }
}

const document = {
  createElement: (tag) => new NodeStub(tag),
  createElementNS: (_ns, tag) => new NodeStub(tag),
  body: new NodeStub('body'),
}

globalThis.window = { open: () => {} }
globalThis.document = document

const src = readFileSync(
  fileURLToPath(new URL('../src/runtime/runtime.standalone.js', import.meta.url)),
  'utf8',
)
eval(src)

if (!globalThis.window.CardStacksRuntime) throw new Error('runtime did not attach to window')

const stack = {
  schema: 'cardstacks/1',
  id: 's1',
  name: 'Test',
  size: { w: 200, h: 100 },
  variables: { name: 'Ada' },
  cards: [
    {
      id: 'c1',
      name: 'Home',
      background: 'white',
      events: [],
      widgets: [
        { id: 'w1', type: 'text', x: 10, y: 10, w: 100, h: 20, visible: true, props: { content: 'Hi {{name}}', fontSize: 14, align: 'left', bold: false, italic: false }, events: [] },
        { id: 'w2', type: 'button', x: 10, y: 40, w: 80, h: 24, visible: true, props: { label: 'Go', style: 'classic', fontSize: 12, enabled: true }, events: [{ event: 'click', actions: [{ type: 'goToCard', cardId: 'c2' }] }] },
      ],
    },
    {
      id: 'c2',
      name: 'Two',
      background: 'white',
      events: [],
      widgets: [
        { id: 'w3', type: 'text', x: 10, y: 10, w: 100, h: 20, visible: true, props: { content: 'Card two', fontSize: 14, align: 'left', bold: false, italic: false }, events: [] },
      ],
    },
  ],
}

const root = new NodeStub('div')
const rt = globalThis.window.CardStacksRuntime.mount(root, stack, {})

const card = root.children[0]
if (!card) throw new Error('no card rendered')
const widgets = card.children.filter((c) => String(c.className).includes('w-'))
if (widgets.length !== 2) throw new Error(`expected 2 widgets, got ${widgets.length}`)

const textInner = widgets.find((w) => String(w.className).includes('w-text')).children[0]
if (textInner._text !== 'Hi Ada') throw new Error(`interpolation failed: "${textInner._text}"`)

const btnInner = widgets.find((w) => String(w.className).includes('w-button')).children[0]
if (!btnInner.listeners.click) throw new Error('button has no click handler')
btnInner.listeners.click[0]()
if (rt.getState().currentCardId !== 'c2') throw new Error('goToCard did not navigate')

console.log('RUNTIME TEST OK (render, interpolation, goToCard)')

const stack2 = JSON.parse(JSON.stringify(stack))
stack2.cards[0].widgets[1].events = [
  { event: 'click', actions: [{ type: 'showMessage', message: 'Hello {{name}}' }] },
]
const root2 = new NodeStub('div')
globalThis.window.CardStacksRuntime.mount(root2, stack2, {})
const btn2 = root2.children[0].children
  .find((w) => String(w.className).includes('w-button'))
  .children[0]
btn2.listeners.click[0]()
const modal = document.body.children.find((c) => String(c.className).includes('cs-modal'))
if (!modal) throw new Error('no modal rendered')
const modalText = modal.children[0].children[0]._text
if (modalText !== 'Hello Ada') throw new Error(`modal interpolation failed: "${modalText}"`)
console.log('MODAL TEST OK (showMessage + interpolation)')

const stack3 = JSON.parse(JSON.stringify(stack))
stack3.cards[0].widgets[1].events = [
  { event: 'click', actions: [{ type: 'setValue', name: 'score', value: '{{name}}!' }, { type: 'changeText', targetId: 'w1', text: 'Score: {{score}}' }] },
]
const root3 = new NodeStub('div')
const rt3 = globalThis.window.CardStacksRuntime.mount(root3, stack3, {})
const btn3 = root3.children[0].children
  .find((w) => String(w.className).includes('w-button'))
  .children[0]
btn3.listeners.click[0]()
const newText = root3.children[0].children
  .find((w) => String(w.className).includes('w-text'))
  .children[0]._text
if (newText !== 'Score: Ada!') throw new Error(`setValue/changeText chain failed: "${newText}"`)
console.log('ACTIONS TEST OK (setValue -> changeText chain)')

// setVisibility by NAME + field bind (the To-Do mechanism)
const stack4 = {
  schema: 'cardstacks/1', id: 's4', name: 'Todo', size: { w: 200, h: 100 }, variables: {},
  cards: [{
    id: 'c1', name: 'Todo', background: 'white', events: [],
    widgets: [
      { id: 'w1', type: 'button', name: 'open', x: 0, y: 0, w: 90, h: 24, visible: true, props: { label: '▢ task', style: 'classic', fontSize: 12, enabled: true }, events: [{ event: 'click', actions: [{ type: 'setVisibility', targetId: 'open', visible: false }, { type: 'setVisibility', targetId: 'done', visible: true }] }] },
      { id: 'w2', type: 'button', name: 'done', x: 0, y: 0, w: 90, h: 24, visible: false, props: { label: '☑ task', style: 'classic', fontSize: 12, enabled: true }, events: [{ event: 'click', actions: [{ type: 'setVisibility', targetId: 'done', visible: false }, { type: 'setVisibility', targetId: 'open', visible: true }] }] },
      { id: 'w3', type: 'field', x: 0, y: 40, w: 100, h: 24, visible: true, props: { content: '', placeholder: '', multiline: false, editable: true, fontSize: 13, bind: 'note' }, events: [] },
    ],
  }],
}
const root4 = new NodeStub('div')
const rt4 = globalThis.window.CardStacksRuntime.mount(root4, stack4, {})
const btnOpen = root4.children[0].children.find((w) => String(w.className).includes('w-button')).children[0]
btnOpen.listeners.click[0]()
const after = root4.children[0].children.filter((w) => String(w.className).includes('w-button'))
const states = after.map((w) => w.style.visibility)
if (JSON.stringify(states) !== JSON.stringify(['hidden', 'visible'])) {
  throw new Error(`setVisibility by name failed: ${JSON.stringify(states)}`)
}
const fieldEl = root4.children[0].children.find((w) => String(w.className).includes('w-field')).children[0]
fieldEl.value = 'buy milk'
fieldEl.listeners.input[0]()
const noteVal = rt4.getState().vars.note
if (noteVal !== 'buy milk') throw new Error(`field bind failed: ${noteVal}`)
console.log('VISIBILITY/BIND TEST OK (setVisibility by name + field.bind)')

// Image upload: click "Upload Photo" -> widget.src + bind var updated, card re-renders
{
  const createdInputs = []
  const origCreate = document.createElement
  document.createElement = function (tag) {
    const n = origCreate(tag)
    if (tag === 'input') createdInputs.push(n)
    return n
  }
  class FakeImage2 {
    constructor() { this._src = ''; this.width = 40; this.height = 30 }
    set src(v) { this._src = v; if (this.onload) this.onload() }
    get src() { return this._src }
  }
  class FakeFileReader {
    readAsDataURL() { this.result = 'data:image/png;base64,FAKEPHOTO'; if (this.onload) this.onload() }
  }
  globalThis.Image = FakeImage2
  globalThis.FileReader = FakeFileReader

  const stack5 = {
    schema: 'cardstacks/1', id: 's5', name: 'Bday', size: { w: 200, h: 100 }, variables: { photo: '' },
    cards: [{
      id: 'c1', name: 'Form', background: 'white', events: [], widgets: [
        { id: 'w1', type: 'image', x: 20, y: 20, w: 120, h: 80, visible: true, props: { src: '{{photo}}', fit: 'contain', border: true, upload: true, bind: 'photo' }, events: [] },
      ],
    }],
  }
  const root5 = new NodeStub('div')
  const rt5 = globalThis.window.CardStacksRuntime.mount(root5, stack5, {})
  const imgWrap = root5.children[0].children.find((w) => String(w.className).includes('w-image'))
  const imgInner = imgWrap.children[0]
  if (!String(imgInner.className).includes('w-image')) throw new Error('image inner not rendered')
  const upBtn = imgInner.children[0]
  if (!String(upBtn.className).includes('w-image-upload')) throw new Error('upload button not rendered')
  upBtn.listeners.click[0]({ stopPropagation() {} })
  const input = createdInputs.find((i) => i.type === 'file')
  if (!input) throw new Error('file input not created')
  input.files = [{ name: 'photo.png', size: 100 }]
  input.onchange()
  if (rt5.getState().vars.photo !== 'data:image/png;base64,FAKEPHOTO') {
    throw new Error(`photo var not set: ${rt5.getState().vars.photo}`)
  }
  const widgetSrc = rt5.getState().stack.cards[0].widgets[0].props.src
  if (widgetSrc !== 'data:image/png;base64,FAKEPHOTO') throw new Error('widget src not set')
  const imgInDom = root5.children[0].children
    .find((w) => String(w.className).includes('w-image'))
    .children[0].children.some((c) => c.tag === 'img')
  if (!imgInDom) throw new Error('re-render did not show the image')
  console.log('UPLOAD TEST OK (image upload -> bind var + re-render)')
  document.createElement = origCreate
}

console.log('ALL RUNTIME TESTS PASSED')
