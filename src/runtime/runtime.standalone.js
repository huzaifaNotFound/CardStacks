/**
 * CardStacks standalone runtime.
 *
 * Plain JavaScript, zero dependencies, self-contained. Renders a Stack JSON
 * into a DOM node and executes its declarative actions.
 *
 * Used two ways (never two implementations):
 *   1. Run mode in the editor — loaded as a side-effect module, uses
 *      `window.CardStacksRuntime`.
 *   2. Standalone HTML export — this file's source is inlined verbatim via
 *      Vite `?raw`, so it must stay dependency-free.
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

  var TOKEN = /\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g

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
        var dl = el('button', 'cs-clear cs-save', '\u2b07')
        dl.title = 'Save image'
        dl.addEventListener('click', function (e) {
          e.stopPropagation()
          saveDataUrl(src, (state.stack.name || 'card') + '-image.png')
        })
        node.appendChild(dl)
      }
    } else if (p.upload) {
      var up = el('button', 'w-image-upload', '\u002b  Upload Photo')
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

    var clear = el('button', 'cs-clear', '\u00d7')
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
      .split(/\n/)
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
