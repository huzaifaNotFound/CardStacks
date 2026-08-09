import { useEffect, useRef, useState } from 'react'
import { useStore } from '../app/store'
import type { Widget } from '../model/types'
import { newWidget } from '../model/factories'
import { editorContext } from '../actions/editorContext'
import { dispatchEvent } from '../actions/run'
import { patternStyle } from '../styles/patterns'
import WidgetView from '../widgets/render/WidgetView'
import { toolInfo } from './tools/types'

type DragState =
  | { mode: 'move'; id: string; sx: number; sy: number; rx: number; ry: number; rw: number; rh: number }
  | { mode: 'resize'; id: string; sx: number; sy: number; rx: number; ry: number; rw: number; rh: number }
  | { mode: 'shape'; shape: 'rect' | 'oval' | 'line'; filled: boolean; x0: number; y0: number; cx: number; cy: number }
  | { mode: 'marquee'; x0: number; y0: number; cx: number; cy: number }
  | { mode: 'draw'; lx: number; ly: number; size: number; erase: boolean }

interface Preview {
  x: number
  y: number
  w: number
  h: number
  filled: boolean
  marquee: boolean
}

const SNAP = 8
const MIN = 8

const snap = (v: number) => Math.round(v / SNAP) * SNAP
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

export default function CardCanvas() {
  const size = useStore((s) => s.stack.size)
  const card = useStore((s) => s.stack.cards.find((c) => c.id === s.currentCardId))
  const showGrid = useStore((s) => s.showGrid)
  const tool = useStore((s) => s.tool)
  const snapToGrid = useStore((s) => s.snapToGrid)
  const selectedWidgetId = useStore((s) => s.selectedWidgetId)
  const selectWidget = useStore((s) => s.selectWidget)
  const setTool = useStore((s) => s.setTool)
  const updateWidget = useStore((s) => s.updateWidget)
  const insertWidget = useStore((s) => s.insertWidget)
  const setCardDrawing = useStore((s) => s.setCardDrawing)
  const commit = useStore((s) => s.commit)

  const surfaceRef = useRef<HTMLDivElement>(null)
  const drawRef = useRef<HTMLCanvasElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const [preview, setPreview] = useState<Preview | null>(null)

  const info = toolInfo(tool)

  // Load drawing layer whenever card or its drawing changes.
  useEffect(() => {
    const ctx = drawRef.current?.getContext('2d')
    if (!ctx) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, size.w, size.h)
    if (card?.drawing) {
      const img = new Image()
      img.onload = () => {
        if (drawRef.current) {
          const c = drawRef.current.getContext('2d')
          c?.drawImage(img, 0, 0)
        }
      }
      img.src = card.drawing
    }
  }, [card?.id, size.w, size.h, card?.drawing])

  if (!card) return <div className="canvas-wrap desk" />

  const toLocal = (e: React.PointerEvent) => {
    const r = surfaceRef.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const hitWidget = (px: number, py: number): Widget | null => {
    for (let i = card.widgets.length - 1; i >= 0; i--) {
      const w = card.widgets[i]
      if (px >= w.x && px <= w.x + w.w && py >= w.y && py <= w.y + w.h) return w
    }
    return null
  }

  const nearSE = (px: number, py: number, w: Widget): boolean => {
    if (w.id !== selectedWidgetId) return false
    return px >= w.x + w.w - 8 && px <= w.x + w.w + 8 && py >= w.y + w.h - 8 && py <= w.y + w.h + 8
  }

  const stamp = (d: Extract<DragState, { mode: 'draw' }>, x: number, y: number) => {
    const ctx = drawRef.current?.getContext('2d')
    if (!ctx) return
    ctx.save()
    ctx.globalCompositeOperation = d.erase ? 'destination-out' : 'source-over'
    ctx.fillStyle = '#000'
    const steps = Math.max(1, Math.ceil(Math.hypot(x - d.lx, y - d.ly)))
    for (let i = 1; i <= steps; i++) {
      const px = Math.round(d.lx + ((x - d.lx) * i) / steps)
      const py = Math.round(d.ly + ((y - d.ly) * i) / steps)
      ctx.fillRect(px - d.size / 2, py - d.size / 2, d.size, d.size)
    }
    ctx.restore()
    d.lx = x
    d.ly = y
  }

  const onDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    const { x, y } = toLocal(e)
    surfaceRef.current?.setPointerCapture(e.pointerId)

    if (!info) return

    if (info.raster) {
      commit()
      dragRef.current = {
        mode: 'draw',
        lx: x,
        ly: y,
        size: tool === 'eraser' ? 4 : 1,
        erase: tool === 'eraser',
      }
      stamp(dragRef.current, x, y)
      return
    }

    if (info.shape) {
      dragRef.current = {
        mode: 'shape',
        shape: info.shape,
        filled: Boolean(info.filled),
        x0: x,
        y0: y,
        cx: x,
        cy: y,
      }
      setPreview({ x, y, w: 0, h: 0, filled: Boolean(info.filled), marquee: false })
      return
    }

    if (tool === 'text') {
      let tx = snapToGrid ? snap(x) : Math.round(x)
      let ty = snapToGrid ? snap(y) : Math.round(y)
      tx = clamp(tx, 0, size.w - 16)
      ty = clamp(ty, 0, size.h - 12)
      insertWidget(newWidget('text', tx, ty))
      setTool('widgets')
      return
    }

    if (tool === 'select') {
      dragRef.current = { mode: 'marquee', x0: x, y0: y, cx: x, cy: y }
      setPreview({ x, y, w: 0, h: 0, filled: false, marquee: true })
      return
    }

    if (tool === 'interact') {
      const hit = hitWidget(x, y)
      if (hit) dispatchEvent(hit, 'click', editorContext())
      return
    }

    // widgets tool
    const sel = card.widgets.find((w) => w.id === selectedWidgetId)
    if (sel && nearSE(x, y, sel)) {
      commit()
      dragRef.current = {
        mode: 'resize',
        id: sel.id,
        sx: x,
        sy: y,
        rx: sel.x,
        ry: sel.y,
        rw: sel.w,
        rh: sel.h,
      }
      return
    }

    const hit = hitWidget(x, y)
    if (hit) {
      if (hit.id !== selectedWidgetId) selectWidget(hit.id)
      commit()
      dragRef.current = {
        mode: 'move',
        id: hit.id,
        sx: x,
        sy: y,
        rx: hit.x,
        ry: hit.y,
        rw: hit.w,
        rh: hit.h,
      }
    } else {
      selectWidget(null)
    }
  }

  const onMove = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d) return
    const { x, y } = toLocal(e)

    switch (d.mode) {
      case 'draw': {
        stamp(d, x, y)
        break
      }
      case 'move': {
        let nx = d.rx + (x - d.sx)
        let ny = d.ry + (y - d.sy)
        if (snapToGrid) {
          nx = snap(nx)
          ny = snap(ny)
        }
        nx = clamp(nx, 0, size.w - d.rw)
        ny = clamp(ny, 0, size.h - d.rh)
        updateWidget(d.id, { x: nx, y: ny }, { transient: true })
        break
      }
      case 'resize': {
        let nw = d.rw + (x - d.sx)
        let nh = d.rh + (y - d.sy)
        if (snapToGrid) {
          nw = snap(nw)
          nh = snap(nh)
        }
        nw = clamp(nw, MIN, size.w - d.rx)
        nh = clamp(nh, MIN, size.h - d.ry)
        updateWidget(d.id, { w: nw, h: nh }, { transient: true })
        break
      }
      case 'shape':
      case 'marquee': {
        d.cx = x
        d.cy = y
        const nx = Math.min(d.x0, x)
        const ny = Math.min(d.y0, y)
        let nw = Math.abs(x - d.x0)
        let nh = Math.abs(y - d.y0)
        if (d.mode === 'shape' && snapToGrid) {
          nw = Math.max(MIN, snap(nw))
          nh = Math.max(MIN, snap(nh))
        }
        setPreview({
          x: nx,
          y: ny,
          w: nw,
          h: nh,
          filled: d.mode === 'shape' && d.filled,
          marquee: d.mode === 'marquee',
        })
        break
      }
    }
  }

  const onUp = (_e: React.PointerEvent) => {
    const d = dragRef.current
    dragRef.current = null
    setPreview(null)
    if (!d) return

    switch (d.mode) {
      case 'draw': {
        const canvas = drawRef.current
        if (canvas && card?.drawing !== canvas.toDataURL()) {
          setCardDrawing(card.id, canvas.toDataURL())
        }
        break
      }
      case 'shape': {
        const w = newWidget('shape')
        w.x = Math.min(d.x0, d.cx)
        w.y = Math.min(d.y0, d.cy)
        w.w = Math.max(MIN, Math.abs(d.cx - d.x0))
        w.h = Math.max(MIN, Math.abs(d.cy - d.y0))
        if (snapToGrid) {
          w.x = snap(w.x)
          w.y = snap(w.y)
          w.w = Math.max(MIN, snap(w.w))
          w.h = Math.max(MIN, snap(w.h))
        }
        w.props.shape = d.shape
        w.props.filled = d.filled
        insertWidget(w)
        setTool('widgets')
        break
      }
      case 'marquee': {
        const px = Math.min(d.x0, d.cx)
        const py = Math.min(d.y0, d.cy)
        const pw = Math.abs(d.cx - d.x0)
        const ph = Math.abs(d.cy - d.y0)
        const hits = card.widgets.filter(
          (w) => px < w.x + w.w && px + pw > w.x && py < w.y + w.h && py + ph > w.y,
        )
        if (hits.length) selectWidget(hits[hits.length - 1].id)
        else selectWidget(null)
        break
      }
    }
  }

  const selected = card.widgets.find((w) => w.id === selectedWidgetId) ?? null
  const crosshair = Boolean(info?.raster || info?.shape)

  return (
    <div className="canvas-wrap desk">
      <div
        ref={surfaceRef}
        className={`card-surface edit-mode card-pointer${crosshair ? ' crosshair' : ''}${tool === 'interact' ? ' interact' : ''}`}
        style={{ width: size.w, height: size.h, ...patternStyle(card.background) }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
      >
        <canvas
          ref={drawRef}
          className="card-layer drawing-canvas"
          width={size.w}
          height={size.h}
        />

        <div className="card-layer card-widgets">
          {card.widgets.map((w) => (
            <WidgetView key={w.id} widget={w} />
          ))}
        </div>

        {showGrid && <div className="card-layer card-grid" />}

        {selected && (
          <div
            className="sel-overlay"
            style={{ left: selected.x, top: selected.y, width: selected.w, height: selected.h }}
          >
            <span className="sel-tag">
              {selected.name || selected.type} {selected.id.slice(-4)}
            </span>
            <span className="sel-handle" />
          </div>
        )}

        {preview && (
          <div
            className={`drag-preview${preview.filled ? ' filled' : ''}${preview.marquee ? ' marquee' : ''}`}
            style={{ left: preview.x, top: preview.y, width: preview.w, height: preview.h }}
          />
        )}
      </div>
    </div>
  )
}
