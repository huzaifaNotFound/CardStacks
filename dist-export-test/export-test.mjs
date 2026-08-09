const s = [
  { id: "white", label: "White", rows: [0, 0, 0, 0, 0, 0, 0, 0] },
  { id: "light1", label: "Light", rows: [136, 0, 34, 0, 136, 0, 34, 0] },
  { id: "light2", label: "Sparse", rows: [128, 0, 8, 0, 128, 0, 8, 0] },
  { id: "dither25", label: "25%", rows: [136, 34, 136, 34, 136, 34, 136, 34] },
  { id: "dither50", label: "50%", rows: [170, 85, 170, 85, 170, 85, 170, 85] },
  { id: "dither75", label: "75%", rows: [119, 221, 119, 221, 119, 221, 119, 221] },
  { id: "black", label: "Black", rows: [255, 255, 255, 255, 255, 255, 255, 255] },
  { id: "hlines", label: "Lines —", rows: [255, 0, 0, 0, 255, 0, 0, 0] },
  { id: "vlines", label: "Lines |", rows: [17, 17, 17, 17, 17, 17, 17, 17] },
  { id: "grid", label: "Grid", rows: [255, 17, 17, 17, 255, 17, 17, 17] },
  { id: "diagL", label: "Diag \\", rows: [128, 64, 32, 16, 8, 4, 2, 1] },
  { id: "diagR", label: "Diag /", rows: [1, 2, 4, 8, 16, 32, 64, 128] },
  { id: "crosshatch", label: "Hatch", rows: [129, 66, 36, 24, 24, 36, 66, 129] },
  { id: "stipple", label: "Stipple", rows: [64, 4, 16, 129, 8, 64, 2, 32] },
  { id: "brick", label: "Brick", rows: [255, 136, 136, 136, 255, 8, 8, 8] },
  { id: "weave", label: "Weave", rows: [240, 240, 240, 240, 15, 15, 15, 15] }
];
s.map((e) => e.id);
const f = new Map(s.map((e) => [e.id, e]));
function v(e) {
  return f.get(e) ?? s[0];
}
function x(e, n = "#000", t = "#fff") {
  const r = v(e);
  let d = "";
  for (let a = 0; a < 8; a++) {
    const p = r.rows[a];
    let i = 0;
    for (; i < 8; )
      if (p & 128 >> i) {
        let l = 1;
        for (; i + l < 8 && p & 128 >> i + l; ) l++;
        d += `<rect x="${i}" y="${a}" width="${l}" height="1"/>`, i += l;
      } else
        i++;
  }
  const c = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" shape-rendering="crispEdges"><rect width="8" height="8" fill="${t}"/><g fill="${n}">${d}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(c)}")`;
}
function b() {
  return s.map(
    (e) => `.pat-${e.id}{background-image:${x(e.id)};background-repeat:repeat;background-size:8px 8px;}`
  ).join(`
`);
}
function h(e) {
  return `
@font-face{font-family:'Silkscreen';font-weight:400;src:url("${e.font400}") format('woff2');}
@font-face{font-family:'Silkscreen';font-weight:700;src:url("${e.font700}") format('woff2');}
*{box-sizing:border-box}
html,body{height:100%;margin:0;background:#000}
body{font-family:'Silkscreen',monospace;color:#000;-webkit-font-smoothing:none;text-rendering:geometricPrecision}
#cs-root{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:32px;background:#000}
.cs-card{position:relative;border:1px solid #000;box-shadow:3px 3px 0 0 #000;flex:none;background:#fff}
.cs-card .w{position:absolute;font-family:'Silkscreen',monospace}
.cs-modal{position:fixed;inset:0;display:grid;place-items:center;background:rgba(0,0,0,.35);z-index:9999}
.cs-modal-box{background:#fff;border:2px solid #000;border-radius:0;box-shadow:3px 3px 0 0 #000;min-width:200px;max-width:340px;padding:12px;display:flex;flex-direction:column;align-items:center;gap:8px}
.cs-modal-text{font-size:12px;text-align:center;white-space:pre-wrap;word-break:break-word;max-height:180px;overflow:auto}
.cs-modal-box button{font-family:'Silkscreen',monospace;font-size:10px;background:#fff;color:#000;border:1px solid #000;border-radius:0;padding:4px 16px;box-shadow:2px 2px 0 0 #000;cursor:pointer}
.cs-modal-box button:hover{background:#000;color:#fff}
${b()}
${e.widgetsCss}
`;
}
const w = (e) => e.replace(/[<>&"]/g, (n) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[n]);
function m(e) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${w(e.title)}</title>
<style>${e.css}</style>
</head>
<body>
<div id="cs-root"></div>
<script type="application/json" id="cardstacks-data">${e.stackJson}<\/script>
<script>${e.runtimeSrc}<\/script>
<script>
(function () {
  var el = document.getElementById('cs-root')
  var raw = document.getElementById('cardstacks-data').textContent
  var stack = JSON.parse(raw)
  window.CardStacksRuntime.mount(el, stack, {})
})()
<\/script>
</body>
</html>`;
}
const k = `/**
 * CardStacks standalone runtime.
 *
 * Plain JavaScript, zero dependencies, self-contained. Renders a Stack JSON
 * into a DOM node and executes its declarative actions.
 *
 * Used two ways (never two implementations):
 *   1. Run mode in the editor — loaded as a side-effect module, uses
 *      \`window.CardStacksRuntime\`.
 *   2. Standalone HTML export — this file's source is inlined verbatim via
 *      Vite \`?raw\`, so it must stay dependency-free.
 *
 * Semantics must mirror src/actions/run.ts. Do not fork behavior here.
 */
;(function (global) {
  'use strict'

  // ---- patterns ----------------------------------------------------------

  var PATTERNS = {
    white: [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    light1: [0x88, 0x00, 0x22, 0x00, 0x88, 0x00, 0x22, 0x00],
    light2: [0x80, 0x00, 0x08, 0x00, 0x80, 0x00, 0x08, 0x00],
    dither25: [0x88, 0x22, 0x88, 0x22, 0x88, 0x22, 0x88, 0x22],
    dither50: [0xaa, 0x55, 0xaa, 0x55, 0xaa, 0x55, 0xaa, 0x55],
    dither75: [0x77, 0xdd, 0x77, 0xdd, 0x77, 0xdd, 0x77, 0xdd],
    black: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
    hlines: [0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00],
    vlines: [0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x11],
    grid: [0xff, 0x11, 0x11, 0x11, 0xff, 0x11, 0x11, 0x11],
    diagL: [0x80, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01],
    diagR: [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80],
    crosshatch: [0x81, 0x42, 0x24, 0x18, 0x18, 0x24, 0x42, 0x81],
    stipple: [0x40, 0x04, 0x10, 0x81, 0x08, 0x40, 0x02, 0x20],
    brick: [0xff, 0x88, 0x88, 0x88, 0xff, 0x08, 0x08, 0x08],
    weave: [0xf0, 0xf0, 0xf0, 0xf0, 0x0f, 0x0f, 0x0f, 0x0f],
  }

  function patternStyle(id) {
    var rows = PATTERNS[id]
    if (!rows) return { backgroundColor: '#fff' }
    var rects = ''
    for (var y = 0; y < 8; y++) {
      var row = rows[y]
      var x = 0
      while (x < 8) {
        if (row & (0x80 >> x)) {
          var run = 1
          while (x + run < 8 && row & (0x80 >> (x + run))) run++
          rects += '<rect x="' + x + '" y="' + y + '" width="' + run + '" height="1"/>'
          x += run
        } else {
          x++
        }
      }
    }
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" shape-rendering="crispEdges">' +
      '<rect width="8" height="8" fill="#fff"/>' +
      '<g fill="#000">' +
      rects +
      '</g></svg>'
    return {
      backgroundColor: '#fff',
      backgroundImage: 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")',
      backgroundRepeat: 'repeat',
      backgroundSize: '8px 8px',
    }
  }

  // ---- tiny helpers ------------------------------------------------------

  var TOKEN = /\\{\\{\\s*([A-Za-z_][A-Za-z0-9_]*)\\s*\\}\\}/g

  function interpolate(text, vars) {
    var s = text == null ? '' : String(text)
    if (!vars || s.indexOf('{{') === -1) return s
    return s.replace(TOKEN, function (_m, name) {
      var v = vars[name]
      return v === undefined || v === null ? '' : String(v)
    })
  }

  function num(v, fb) {
    var n = typeof v === 'number' ? v : Number(v)
    return Number.isFinite(n) ? n : fb
  }

  function str(v, fb) {
    return typeof v === 'string' ? v : fb
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v))
  }

  function el(tag, className, text) {
    var node = document.createElement(tag)
    if (className) node.className = className
    if (text !== undefined && text !== null) node.textContent = text
    return node
  }

  function applyStyle(node, style) {
    for (var k in style) node.style[k] = style[k]
  }

  // ---- actions (mirror of src/actions/run.ts) -----------------------------

  function runAction(action, ctx) {
    switch (action.type) {
      case 'goToCard':
        ctx.goToCard(action.cardId)
        break
      case 'goBack':
        ctx.goBack()
        break
      case 'showMessage':
        ctx.showMessage(interpolate(action.message, ctx.variables))
        break
      case 'changeText':
        ctx.setWidgetProp(action.targetId, 'content', interpolate(action.text, ctx.variables))
        break
      case 'setValue':
        ctx.setVariable(action.name, interpolate(String(action.value), ctx.variables))
        break
      case 'setVisibility':
        ctx.setWidgetProp(action.targetId, 'visible', action.visible)
        break
      case 'openUrl':
        ctx.openUrl(interpolate(action.url, ctx.variables))
        break
    }
  }

  function runActions(list, ctx) {
    if (!list) return
    for (var i = 0; i < list.length; i++) runAction(list[i], ctx)
  }

  function dispatchEvent(widget, event, ctx, opts) {
    var handler = null
    for (var i = 0; i < (widget.events || []).length; i++) {
      if (widget.events[i].event === event) handler = widget.events[i]
    }
    if (!handler) return
    runActions(handler.actions, ctx)
    if (!opts || !opts.noRender) ctx.render()
  }

  // ---- state -------------------------------------------------------------

  function findCard(state, id) {
    for (var i = 0; i < state.stack.cards.length; i++) {
      if (state.stack.cards[i].id === id) return state.stack.cards[i]
    }
    return null
  }

  function findWidget(card, id) {
    for (var i = 0; i < card.widgets.length; i++) {
      var w = card.widgets[i]
      if (w.id === id || (w.name && w.name === id)) return w
    }
    return null
  }

  // ---- widget builders ---------------------------------------------------

  function buildText(widget, state) {
    var p = widget.props
    var node = el('div', 'w-text')
    applyStyle(node, {
      fontSize: num(p.fontSize, 16) + 'px',
      textAlign: p.align || 'left',
      fontWeight: p.bold ? 700 : 400,
      fontStyle: p.italic ? 'italic' : 'normal',
    })
    node.textContent = interpolate(p.content, state.vars)
    return node
  }

  function buildField(widget, state, ctx) {
    var p = widget.props
    var value = state.fieldValues[widget.id]
    if (value === undefined) value = interpolate(p.content, state.vars)
    var input
    if (p.multiline) {
      input = el('textarea', 'w-field')
      input.value = value
    } else {
      input = el('input', 'w-field single')
      input.type = 'text'
      input.value = value
    }
    input.placeholder = str(p.placeholder, '')
    applyStyle(input, { fontSize: num(p.fontSize, 13) + 'px' })
    input.readOnly = p.editable === false
    var changed = function () {
      state.fieldValues[widget.id] = input.value
      if (p.bind) state.vars[p.bind] = input.value
    }
    input.addEventListener('input', changed)
    input.addEventListener('change', function () {
      changed()
      dispatchEvent(widget, 'change', ctx, { noRender: true })
    })
    return input
  }

  function buildButton(widget, state, ctx) {
    var p = widget.props
    var style = str(p.style, 'classic')
    var node = el('div', 'w-button')
    if (style === 'default') node.className += ' is-default'
    if (style === 'plain') node.className += ' is-plain'
    if (style === 'invisible') node.className += ' is-invisible'
    if (p.enabled === false) node.className += ' is-disabled'
    applyStyle(node, { fontSize: num(p.fontSize, 12) + 'px' })
    node.textContent = interpolate(p.label, state.vars)
    if (p.enabled !== false) {
      node.addEventListener('click', function () {
        dispatchEvent(widget, 'click', ctx)
      })
    }
    return node
  }

  function buildImage(widget, state, ctx) {
    var p = widget.props
    var src = interpolate(str(p.src, ''), state.vars)
    var fit = str(p.fit, 'contain')
    var node = el('div', 'w-image' + (p.border ? ' has-border' : '') + (src ? '' : ' empty') + ' fit-' + fit)
    if (src) {
      var img = el('img')
      img.src = src
      img.alt = ''
      node.appendChild(img)
      if (p.upload && src.indexOf('data:') === 0) {
        var dl = el('button', 'cs-clear cs-save', '\\u2b07')
        dl.title = 'Save image'
        dl.addEventListener('click', function (e) {
          e.stopPropagation()
          saveDataUrl(src, (state.stack.name || 'card') + '-image.png')
        })
        node.appendChild(dl)
      }
    } else if (p.upload) {
      var up = el('button', 'w-image-upload', '\\u002b  Upload Photo')
      up.title = 'Choose an image'
      up.addEventListener('click', function (e) {
        e.stopPropagation()
        uploadImage(widget, state, ctx)
      })
      node.appendChild(up)
    }
    return node
  }

  function saveDataUrl(dataUrl, filename) {
    var a = document.createElement('a')
    a.href = dataUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  function uploadImage(widget, state, ctx) {
    var input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = function () {
      var f = input.files && input.files[0]
      if (!f) return
      var reader = new FileReader()
      reader.onload = function () {
        downscale(reader.result, 800, function (out) {
          widget.props.src = out
          if (widget.props.bind) state.vars[widget.props.bind] = out
          ctx.render()
        })
      }
      reader.readAsDataURL(f)
    }
    input.click()
  }

  function downscale(dataUrl, max, done) {
    var img = new Image()
    img.onload = function () {
      var scale = Math.min(1, max / Math.max(img.width, img.height))
      if (scale >= 1) return done(dataUrl)
      var canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(img.width * scale))
      canvas.height = Math.max(1, Math.round(img.height * scale))
      var c = canvas.getContext('2d')
      if (!c) return done(dataUrl)
      c.drawImage(img, 0, 0, canvas.width, canvas.height)
      done(canvas.toDataURL('image/jpeg', 0.92))
    }
    img.onerror = function () {
      done(dataUrl)
    }
    img.src = dataUrl
  }

  function buildShape(widget, state) {
    var p = widget.props
    var kind = str(p.shape, 'rect')
    var filled = Boolean(p.filled)
    var stroke = num(p.strokeWidth, 1)
    var node
    if (kind === 'line') {
      var ns = 'http://www.w3.org/2000/svg'
      var svg = document.createElementNS(ns, 'svg')
      svg.setAttribute('width', '100%')
      svg.setAttribute('height', '100%')
      var line = document.createElementNS(ns, 'line')
      line.setAttribute('x1', '0')
      line.setAttribute('y1', '100%')
      line.setAttribute('x2', '100%')
      line.setAttribute('y2', '0')
      line.setAttribute('stroke', '#000')
      line.setAttribute('stroke-width', String(Math.max(1, stroke)))
      line.setAttribute('shape-rendering', 'crispEdges')
      svg.appendChild(line)
      return svg
    }
    if (kind === 'oval') {
      node = el('div')
      var oStyle = {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: '1px solid #000',
      }
      if (filled) Object.assign(oStyle, patternStyle(p.fill))
      applyStyle(node, oStyle)
      return node
    }
    node = el('div')
    var rStyle = {
      width: '100%',
      height: '100%',
      border: '1px solid #000',
    }
    if (filled) Object.assign(rStyle, patternStyle(p.fill))
    if (stroke !== 1) rStyle.boxShadow = '0 0 0 ' + (stroke - 1) + 'px #000'
    applyStyle(node, rStyle)
    return node
  }

  function buildSlider(widget, state, ctx) {
    var p = widget.props
    var wrap = el('div', 'w-slider')
    var input = el('input')
    input.type = 'range'
    input.min = num(p.min, 0)
    input.max = num(p.max, 100)
    input.step = num(p.step, 1)
    input.value = clamp(num(p.value, 0), num(p.min, 0), num(p.max, 100))
    input.addEventListener('change', function () {
      var v = Number(input.value)
      if (p.bind) state.vars[p.bind] = v
      dispatchEvent(widget, 'change', ctx, { noRender: true })
    })
    wrap.appendChild(input)
    return wrap
  }

  function buildCanvas(widget, state) {
    var p = widget.props
    var wrap = el('div', 'w-canvas' + (p.border ? ' has-border' : ''))
    var canvas = el('canvas')
    canvas.width = widget.w
    canvas.height = widget.h
    wrap.appendChild(canvas)
    if (state.canvasDrawings[widget.id]) {
      var img = new Image()
      img.onload = function () {
        var c = canvas.getContext('2d')
        if (c) c.drawImage(img, 0, 0)
      }
      img.src = state.canvasDrawings[widget.id]
    }
    var drawing = false
    var last = null
    var ctx = canvas.getContext('2d')
    var stamp = function (x, y) {
      if (!ctx) return
      var size = Math.max(1, num(interpolate(p.brush, state.vars), 2))
      if (last) {
        var steps = Math.max(1, Math.ceil(Math.hypot(x - last.x, y - last.y)))
        for (var i = 1; i <= steps; i++) {
          ctx.fillRect(
            Math.round(last.x + ((x - last.x) * i) / steps) - size / 2,
            Math.round(last.y + ((y - last.y) * i) / steps) - size / 2,
            size,
            size,
          )
        }
      } else {
        ctx.fillRect(x - size / 2, y - size / 2, size, size)
      }
      last = { x: x, y: y }
    }
    var pos = function (e) {
      var r = canvas.getBoundingClientRect()
      return {
        x: ((e.clientX - r.left) / r.width) * widget.w,
        y: ((e.clientY - r.top) / r.height) * widget.h,
      }
    }
    canvas.addEventListener('pointerdown', function (e) {
      drawing = true
      last = null
      canvas.setPointerCapture(e.pointerId)
      var pt = pos(e)
      stamp(pt.x, pt.y)
    })
    canvas.addEventListener('pointermove', function (e) {
      if (!drawing) return
      var pt = pos(e)
      stamp(pt.x, pt.y)
    })
    var end = function () {
      if (!drawing) return
      drawing = false
      last = null
      if (canvas) state.canvasDrawings[widget.id] = canvas.toDataURL()
    }
    canvas.addEventListener('pointerup', end)
    canvas.addEventListener('pointercancel', end)

    var clear = el('button', 'cs-clear', '\\u00d7')
    clear.title = 'Clear'
    clear.addEventListener('click', function (e) {
      e.stopPropagation()
      if (!ctx) return
      ctx.clearRect(0, 0, widget.w, widget.h)
      state.canvasDrawings[widget.id] = canvas.toDataURL()
    })
    wrap.appendChild(clear)
    return wrap
  }

  function buildGrid(widget) {
    var p = widget.props
    var rows = Math.max(1, Math.round(num(p.rows, 3)))
    var cols = Math.max(1, Math.round(num(p.cols, 3)))
    var headers = Boolean(p.headers)
    var grid = str(p.data, '')
      .trim()
      .split(/\\n/)
      .map(function (l) {
        return l.split(',').map(function (c) {
          return c.trim()
        })
      })
    var wrap = el('div', 'w-grid')
    var table = el('table')
    var bodyStart = headers ? 1 : 0
    if (headers) {
      var thead = el('thead')
      var hr = el('tr')
      for (var c = 0; c < cols; c++) {
        var th = el('th', null, (grid[0] || [])[c] || '')
        hr.appendChild(th)
      }
      thead.appendChild(hr)
      table.appendChild(thead)
    }
    var tbody = el('tbody')
    for (var r = bodyStart; r < rows + bodyStart; r++) {
      var tr = el('tr')
      for (var c2 = 0; c2 < cols; c2++) {
        var td = el('td', r % 2 ? 'is-odd' : '', (grid[r] || [])[c2] || '')
        tr.appendChild(td)
      }
      tbody.appendChild(tr)
    }
    table.appendChild(tbody)
    wrap.appendChild(table)
    return wrap
  }

  function buildWidget(widget, state, ctx) {
    var node = el('div', 'w w-' + widget.type)
    applyStyle(node, {
      left: widget.x + 'px',
      top: widget.y + 'px',
      width: widget.w + 'px',
      height: widget.h + 'px',
      visibility: widget.visible === false ? 'hidden' : 'visible',
    })
    var inner
    switch (widget.type) {
      case 'text':
        inner = buildText(widget, state)
        break
      case 'field':
        inner = buildField(widget, state, ctx)
        break
      case 'button':
        inner = buildButton(widget, state, ctx)
        break
      case 'image':
        inner = buildImage(widget, state, ctx)
        break
      case 'shape':
        inner = buildShape(widget, state)
        break
      case 'slider':
        inner = buildSlider(widget, state, ctx)
        break
      case 'canvas':
        inner = buildCanvas(widget, state)
        break
      case 'grid':
        inner = buildGrid(widget)
        break
      default:
        inner = el('div')
    }
    node.appendChild(inner)
    return node
  }

  // ---- render ------------------------------------------------------------

  function render(root, state, ctx) {
    var card = findCard(state, state.currentCardId)
    if (!card) return
    root.textContent = ''
    var surface = el('div', 'cs-card')
    applyStyle(surface, { width: state.stack.size.w + 'px', height: state.stack.size.h + 'px' })
    applyStyle(surface, patternStyle(card.background))
    for (var i = 0; i < card.widgets.length; i++) {
      surface.appendChild(buildWidget(card.widgets[i], state, ctx))
    }
    root.appendChild(surface)
    if (state.onChange) state.onChange(state)
  }

  function showMessageOverlay(root, message) {
    // Append to body so re-renders of the card never destroy the modal.
    var host = (typeof document !== 'undefined' && document.body) || root
    var backdrop = el('div', 'cs-modal')
    var box = el('div', 'cs-modal-box')
    var text = el('div', 'cs-modal-text', message)
    var ok = el('button', 'btn', 'OK')
    ok.addEventListener('click', function () {
      backdrop.remove()
    })
    box.appendChild(text)
    box.appendChild(ok)
    backdrop.appendChild(box)
    host.appendChild(backdrop)
  }

  // ---- mount -------------------------------------------------------------

  function mount(rootEl, stack, options) {
    if (!rootEl) throw new Error('CardStacks runtime: no root element')
    options = options || {}

    var state = {
      stack: JSON.parse(JSON.stringify(stack || {})),
      currentCardId: (stack && stack.cards && stack.cards[0] && stack.cards[0].id) || null,
      history: [],
      vars: Object.assign({}, (stack && stack.variables) || {}),
      fieldValues: {},
      canvasDrawings: {},
      onChange: options.onChange || null,
    }

    var ctx = {
      variables: state.vars,
      getVariable: function (n) {
        return state.vars[n]
      },
      setVariable: function (n, v) {
        state.vars[n] = v
      },
      getWidget: function (id) {
        var card = findCard(state, state.currentCardId)
        return card ? findWidget(card, id) : null
      },
      setWidgetProp: function (id, key, value) {
        var card = findCard(state, state.currentCardId)
        var w = card ? findWidget(card, id) : null
        if (!w) return
        if (key === 'visible') w.visible = value
        else w.props[key] = value
      },
      goToCard: function (cardId) {
        if (!findCard(state, cardId)) return
        state.history.push(state.currentCardId)
        state.currentCardId = cardId
        render(rootEl, state, ctx)
      },
      goBack: function () {
        if (!state.history.length) return
        state.currentCardId = state.history.pop()
        render(rootEl, state, ctx)
      },
      showMessage: function (msg) {
        showMessageOverlay(rootEl, msg)
      },
      openUrl: function (url) {
        window.open(url, '_blank', 'noopener')
      },
      render: function () {
        render(rootEl, state, ctx)
      },
    }
    render(rootEl, state, ctx)

    return {
      unmount: function () {
        rootEl.textContent = ''
      },
      goToCard: function (id) {
        ctx.goToCard(id)
      },
      goBack: function () {
        ctx.goBack()
      },
      getState: function () {
        return state
      },
    }
  }

  global.CardStacksRuntime = {
    version: '0.1',
    mount: mount,
  }
})(typeof window !== 'undefined' ? window : this)
`, y = `.w{position:absolute;overflow:hidden;font-family:var(--font-card, Geneva, Verdana, sans-serif)}.w-text{overflow:hidden;line-height:1.35;word-break:break-word}.w-field{background:var(--white);border:1px solid var(--black);padding:2px 4px;overflow:auto;white-space:pre-wrap;word-break:break-word;line-height:1.4;font-family:inherit;width:100%;height:100%;resize:none;box-sizing:border-box}.w-field.single{white-space:nowrap;overflow:hidden}.w-button{display:flex;align-items:center;justify-content:center;text-align:center;border-radius:8px;background:var(--white);border:1px solid var(--black);color:var(--black);font-family:inherit;cursor:default;-webkit-user-select:none;user-select:none;line-height:1.2;padding:0 6px;overflow:hidden}.w-button.is-default{box-shadow:0 0 0 1px var(--white),0 0 0 3px var(--black)}.w-button.is-plain{border-radius:0;border:0;border-bottom:1px solid var(--black)}.w-button.is-invisible{border-radius:0;border:0;background:transparent}.w-button.is-disabled{opacity:.4}.w-image{background:var(--white);overflow:hidden;position:relative}.w-image.has-border{border:1px solid var(--black)}.w-image img{width:100%;height:100%;display:block;image-rendering:pixelated}.w-image.fit-contain img{object-fit:contain}.w-image.fit-cover img{object-fit:cover}.w-image.fit-fill img{object-fit:fill}.w-image.empty{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' shape-rendering='crispEdges'%3E%3Crect width='8' height='8' fill='%23fff'/%3E%3Cg fill='%23000'%3E%3Crect x='0' y='0' width='1' height='1'/%3E%3Crect x='2' y='0' width='1' height='1'/%3E%3Crect x='4' y='0' width='1' height='1'/%3E%3Crect x='6' y='0' width='1' height='1'/%3E%3Crect x='1' y='1' width='1' height='1'/%3E%3Crect x='3' y='1' width='1' height='1'/%3E%3Crect x='5' y='1' width='1' height='1'/%3E%3Crect x='7' y='1' width='1' height='1'/%3E%3C/g%3E%3C/svg%3E");border:1px dashed var(--black)}.w-shape{overflow:hidden}.w-slider{display:flex;align-items:center;padding:0 4px;-webkit-user-select:none;user-select:none}.w-slider input[type=range]{width:100%;margin:0;accent-color:#000;background:transparent;cursor:default}.w-canvas{background:var(--white);position:relative}.w-canvas.has-border{border:1px solid var(--black)}.w-canvas canvas{width:100%;height:100%;display:block;touch-action:none;cursor:crosshair}.w-canvas .cs-clear,.w-image .cs-clear{position:absolute;top:2px;right:2px;width:16px;height:16px;display:flex;align-items:center;justify-content:center;background:var(--white);border:1px solid var(--black);color:var(--black);font-size:11px;line-height:1;padding:0;cursor:pointer;z-index:2}.w-canvas .cs-clear:hover,.w-image .cs-clear:hover{background:var(--black);color:var(--white)}.w-image-upload{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;align-items:center;justify-content:center;background:transparent;border:1px dashed var(--black);color:var(--black);font-family:var(--font-chrome);font-size:var(--fs-chrome-lg);letter-spacing:.06em;cursor:pointer;padding:0}.w-image-upload:hover{background:var(--black);color:var(--white)}.w-grid{background:var(--white);border:1px solid var(--black);overflow:auto}.w-grid table{width:100%;height:100%;border-collapse:collapse;table-layout:fixed}.w-grid th,.w-grid td{border:1px solid var(--black);padding:2px 4px;font-size:12px;line-height:1.3;vertical-align:top;overflow:hidden;word-break:break-word}.w-grid th{background:var(--black);color:var(--white);font-weight:400}.w-grid td.is-odd{background:var(--white)}`, A = "data:font/woff2;base64,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", S = "data:font/woff2;base64,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";
function C(e) {
  const n = JSON.stringify(e).replace(/</g, "\\u003c"), t = h({ widgetsCss: y, font400: A, font700: S });
  return m({
    title: `${e.name} — CardStacks`,
    stackJson: n,
    runtimeSrc: k,
    css: t
  });
}
let E = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", I = (e = 21) => {
  let n = "", t = crypto.getRandomValues(new Uint8Array(e |= 0));
  for (; e--; )
    n += E[t[e] & 63];
  return n;
};
const R = "cardstacks/1", M = [
  { label: "Left", value: "left" },
  { label: "Center", value: "center" },
  { label: "Right", value: "right" }
], B = [
  { label: "Contain", value: "contain" },
  { label: "Cover", value: "cover" },
  { label: "Stretch", value: "fill" }
], D = {
  text: {
    type: "text",
    label: "Text",
    size: { w: 160, h: 24 },
    canResize: !0,
    events: ["click"],
    fields: [
      { key: "content", label: "Text", kind: "textarea", default: "Text" },
      { key: "fontSize", label: "Size", kind: "number", default: 16 },
      { key: "align", label: "Align", kind: "select", default: "left", options: M },
      { key: "bold", label: "Bold", kind: "checkbox", default: !1 },
      { key: "italic", label: "Italic", kind: "checkbox", default: !1 }
    ]
  },
  field: {
    type: "field",
    label: "Field",
    size: { w: 200, h: 28 },
    canResize: !0,
    events: ["change", "submit"],
    fields: [
      { key: "content", label: "Value", kind: "textarea", default: "" },
      { key: "placeholder", label: "Hint", kind: "text", default: "Type here…" },
      { key: "bind", label: "Bind", kind: "text", default: "" },
      { key: "multiline", label: "Multi", kind: "checkbox", default: !1 },
      { key: "editable", label: "Edit", kind: "checkbox", default: !0 },
      { key: "fontSize", label: "Size", kind: "number", default: 13 }
    ]
  },
  button: {
    type: "button",
    label: "Button",
    size: { w: 120, h: 28 },
    canResize: !0,
    events: ["click"],
    fields: [
      { key: "label", label: "Label", kind: "text", default: "Button" },
      {
        key: "style",
        label: "Style",
        kind: "select",
        default: "classic",
        options: [
          { label: "Classic", value: "classic" },
          { label: "Default", value: "default" },
          { label: "Plain", value: "plain" },
          { label: "Invisible", value: "invisible" }
        ]
      },
      { key: "fontSize", label: "Size", kind: "number", default: 12 },
      { key: "enabled", label: "Enabled", kind: "checkbox", default: !0 }
    ]
  },
  image: {
    type: "image",
    label: "Image",
    size: { w: 160, h: 120 },
    canResize: !0,
    events: ["click"],
    fields: [
      { key: "src", label: "Source", kind: "text", default: "" },
      { key: "fit", label: "Fit", kind: "select", default: "contain", options: B },
      { key: "border", label: "Border", kind: "checkbox", default: !0 },
      { key: "upload", label: "Upload", kind: "checkbox", default: !1 },
      { key: "bind", label: "Bind", kind: "text", default: "" }
    ]
  },
  shape: {
    type: "shape",
    label: "Shape",
    size: { w: 120, h: 80 },
    canResize: !0,
    events: ["click"],
    fields: [
      {
        key: "shape",
        label: "Kind",
        kind: "select",
        default: "rect",
        options: [
          { label: "Rectangle", value: "rect" },
          { label: "Oval", value: "oval" },
          { label: "Line", value: "line" }
        ]
      },
      { key: "fill", label: "Fill", kind: "pattern", default: "white" },
      { key: "filled", label: "Filled", kind: "checkbox", default: !1 },
      { key: "strokeWidth", label: "Stroke", kind: "number", default: 1 }
    ]
  },
  slider: {
    type: "slider",
    label: "Slider",
    size: { w: 180, h: 24 },
    canResize: !0,
    events: ["change"],
    fields: [
      { key: "min", label: "Min", kind: "number", default: 0 },
      { key: "max", label: "Max", kind: "number", default: 100 },
      { key: "step", label: "Step", kind: "number", default: 1 },
      { key: "value", label: "Value", kind: "number", default: 50 },
      { key: "bind", label: "Bind", kind: "text", default: "" }
    ]
  },
  canvas: {
    type: "canvas",
    label: "Canvas",
    size: { w: 240, h: 180 },
    canResize: !0,
    events: [],
    fields: [
      { key: "brush", label: "Brush", kind: "number", default: 2 },
      { key: "border", label: "Border", kind: "checkbox", default: !0 }
    ]
  },
  grid: {
    type: "grid",
    label: "Grid",
    size: { w: 260, h: 120 },
    canResize: !0,
    events: [],
    fields: [
      { key: "rows", label: "Rows", kind: "number", default: 3 },
      { key: "cols", label: "Cols", kind: "number", default: 3 },
      { key: "headers", label: "Header", kind: "checkbox", default: !0 },
      { key: "data", label: "Cells", kind: "textarea", default: `A,B,C
1,2,3
4,5,6` }
    ]
  }
}, O = 640, V = 400, u = (e) => `${e}_${I(8)}`;
function o(e, n = 0, t = 0) {
  const r = D[e], d = {};
  for (const a of r.fields) d[a.key] = a.default;
  const c = [];
  return {
    id: u("w"),
    type: e,
    x: Math.round(n),
    y: Math.round(t),
    w: r.size.w,
    h: r.size.h,
    visible: !0,
    props: d,
    events: c
  };
}
function U(e = "Card") {
  return {
    id: u("c"),
    name: e,
    background: "white",
    widgets: [],
    events: []
  };
}
function g(e = "Untitled Stack") {
  const n = (/* @__PURE__ */ new Date()).toISOString();
  return {
    schema: R,
    id: u("s"),
    name: e,
    size: { w: O, h: V },
    variables: {},
    cards: [U("Home")],
    meta: { createdAt: n, updatedAt: n, version: 1 }
  };
}
function Z() {
  const e = g("Export Test");
  e.cards[0].name = "Home";
  const n = o("button");
  n.props.label = "Go Back", n.events = [{ event: "click", actions: [{ type: "goBack" }] }];
  const t = o("text");
  return t.props.content = "Hello {{name}}", e.variables = { name: "World" }, e.cards[0].widgets.push(n, t), JSON.stringify(e);
}
function z() {
  const e = g("Export Test");
  e.cards[0].name = "Home";
  const n = o("button");
  n.props.label = "Go Back", n.events = [{ event: "click", actions: [{ type: "goBack" }] }];
  const t = o("text");
  return t.props.content = "Hello {{name}}", e.variables = { name: "World" }, e.cards[0].widgets.push(n, t), C(e);
}
export {
  z as getTestHtml,
  Z as makeTestStackJson
};
