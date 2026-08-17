'use client'

import * as React from 'react'
import { useEffect, useRef } from 'react'

type Vec = { x: number; y: number }
const vec = (x: number, y: number): Vec => ({ x, y })
const vecAdd = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y })
const vecSub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y })
const vecMult = (a: Vec, s: number): Vec => ({ x: a.x * s, y: a.y * s })
const vecLerp = (a: Vec, b: Vec, t: number): Vec => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
})
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (v: number, mn: number, mx: number) => Math.max(mn, Math.min(mx, v))
const map = (v: number, a: number, b: number, c: number, d: number) => ((v - a) / (b - a)) * (d - c) + c

function toRGB(str: string): { r: number; g: number; b: number } {
  if (str) {
    const m = str.match(/rgba?\(([^)]+)\)/)
    if (m) {
      const p = m[1].split(',').map((s) => parseFloat(s))
      return { r: p[0] || 0, g: p[1] || 0, b: p[2] || 0 }
    }
    const hex = str.replace('#', '')
    if (hex.length >= 6)
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      }
    if (hex.length === 3)
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
      }
  }
  return { r: 10, g: 10, b: 10 }
}

interface CanvasState {
  width: number
  height: number
  dpr: number
  isVisible: boolean
  isPageVisible: boolean
  animationId: number
}

type CanvasWithStart = HTMLCanvasElement & { __canvasStart?: () => void }

function useCanvasAnimation({
  onSetup,
  onDraw,
}: {
  onSetup?: (ctx: CanvasRenderingContext2D, state: CanvasState) => void
  onDraw: (ctx: CanvasRenderingContext2D, state: CanvasState) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef<CanvasState>({
    width: 0,
    height: 0,
    dpr: 1,
    isVisible: true,
    isPageVisible: true,
    animationId: 0,
  })

  const onDrawRef = useRef(onDraw)
  const onSetupRef = useRef(onSetup)
  useEffect(() => {
    onDrawRef.current = onDraw
    onSetupRef.current = onSetup
  })

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    // `alpha: true` permite que el lienzo se apoye sobre lo que haya detrás
    // (foto, capa de color) en lugar de taparlo con un fondo opaco.
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const st = stateRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const setup = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = container.getBoundingClientRect()
      st.width = rect.width
      st.height = rect.height
      st.dpr = dpr
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const loop = () => {
      onDrawRef.current(ctx, st)
      st.animationId = requestAnimationFrame(loop)
    }

    const start = () => {
      if (st.animationId || !st.isVisible || !st.isPageVisible) return
      // Compromiso de accesibilidad de PRODUCT.md: con movimiento reducido se
      // pinta un solo cuadro estático en vez de sostener el bucle continuo.
      if (reducedMotion) {
        onDrawRef.current(ctx, st)
        return
      }
      st.animationId = requestAnimationFrame(loop)
    }

    const stop = () => {
      if (st.animationId) {
        cancelAnimationFrame(st.animationId)
        st.animationId = 0
      }
    }

    setup()
    onSetupRef.current?.(ctx, st)
    start()

    let debTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(debTimer)
      debTimer = setTimeout(() => {
        stop()
        setup()
        start()
      }, 100)
    }

    const onPageVis = () => {
      st.isPageVisible = document.visibilityState === 'visible'
      st.isPageVisible ? start() : stop()
    }

    const io = new IntersectionObserver(
      (entries) => {
        st.isVisible = entries[0]?.isIntersecting ?? true
        st.isVisible && st.isPageVisible ? start() : stop()
      },
      { threshold: 0 },
    )

    io.observe(container)
    window.addEventListener('resize', onResize, { passive: true })
    document.addEventListener('visibilitychange', onPageVis)

    return () => {
      stop()
      clearTimeout(debTimer)
      io.disconnect()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onPageVis)
    }
  }, [])

  return { containerRef, canvasRef, stateRef }
}

type ReactiveLinesProps = {
  /** `'transparent'` deja ver lo que haya detrás del lienzo. */
  backgroundColor?: string
  lineColor?: string
  lineWidth?: number
  minLines?: number
  maxLines?: number
  fade?: boolean
  fadeIntensity?: number
  style?: React.CSSProperties
}

/**
 * Campo de líneas (Originkit "Reactive Lines"), reescrito sobre canvas 2D.
 *
 * A diferencia del original: arranca a pintar de inmediato en vez de esperar
 * el primer `mousemove`, admite fondo transparente para apoyarse sobre una
 * imagen, y respeta `prefers-reduced-motion` pintando un cuadro estático.
 */
export const ReactiveLines: React.FC<ReactiveLinesProps> = ({
  style,
  backgroundColor = 'rgb(10, 10, 10)',
  lineColor = 'rgba(255, 255, 255, 1)',
  lineWidth = 0.5,
  minLines = 108,
  maxLines = 15,
  fade = false,
  fadeIntensity = 15,
}) => {
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const cfgRef = useRef({ linesNum: 40, bias: 0.5 })
  const isTransparent = backgroundColor === 'transparent'

  const { containerRef, canvasRef, stateRef } = useCanvasAnimation({
    onSetup: (e, t) => {
      mouseRef.current.targetX = t.width / 2
      mouseRef.current.targetY = t.height / 2
      mouseRef.current.x = t.width / 2
      mouseRef.current.y = t.height / 2
    },

    onDraw: (e, t) => {
      const { width: r, height: n } = t
      const a = mouseRef.current
      const o = cfgRef.current

      a.x = a.x + (a.targetX - a.x) * 0.05
      a.y = a.y + (a.targetY - a.y) * 0.1

      if (isTransparent) {
        e.clearRect(0, 0, r, n)
      } else {
        e.fillStyle = backgroundColor
        e.fillRect(0, 0, r, n)
      }

      e.save()
      e.translate(r / 2, n / 2)

      const s = r < 500
      const u = s ? 0.8 * n : 0
      const d = s ? 1.5 : 0.7

      const c = vec(r, -(1.1 * n) + u)
      const f = vec(0, 2 * n)
      const g = vec(-r, -n + u)

      const lo = Math.min(minLines, maxLines)
      const hi = Math.max(minLines, maxLines)
      const h = clamp(map(a.y, 0, n, lo, hi), lo, hi)
      o.linesNum = lerp(o.linesNum, h, 0.1)

      const b = clamp(map(a.x, 0, r, 0.6, 0.4), 0.4, 0.6)
      o.bias = lerp(o.bias, b, 0.05)

      e.strokeStyle = lineColor
      e.lineWidth = lineWidth

      for (let t = 0; t < o.linesNum; t++) {
        const r = t / (o.linesNum - 1)

        const lineEnd = vec(lerp(f.x, g.x, 1 - r * r), lerp(f.y, g.y, 1 - r * r))

        const l = vecAdd(vecMult(c, 0.5), vecMult(lineEnd, 0.5))

        const dispTarget = vecMult(vecAdd(f, l), 0.5)
        ;(function (
          e: CanvasRenderingContext2D,
          t: Vec,
          r: Vec,
          n: Vec,
          l: number,
          a: number,
        ) {
          const o = vecLerp(t, r, 0.5)
          const s = vecSub(n, o)

          e.beginPath()
          for (let n = 0; n <= 50; n++) {
            const o = n / 50
            const u = vecLerp(t, r, o)
            const d = 2 * Math.pow(o, a * (1 - l) * 2) * Math.pow(1 - o, a * l * 2)
            const cv = vecAdd(u, vecMult(s, d))
            n === 0 ? e.moveTo(cv.x, cv.y) : e.lineTo(cv.x, cv.y)
          }
          e.stroke()
        })(e, c, lineEnd, dispTarget, o.bias, d)
      }

      e.restore()

      if (fade) {
        // Sobre fondo transparente el degradado no puede pintar el color del
        // fondo (taparía la imagen de atrás): borra las líneas hacia los
        // bordes con `destination-out`, donde el alfa manda cuánto se quita.
        const bg = toRGB(backgroundColor)
        const rgba = (alpha: number) =>
          isTransparent ? `rgba(0, 0, 0, ${alpha})` : `rgba(${bg.r}, ${bg.g}, ${bg.b}, ${alpha})`
        const inner = clamp(map(fadeIntensity, 1, 50, 0.82, 0.25), 0.25, 0.82)
        const maxA = clamp(map(fadeIntensity, 1, 50, 0.35, 0.9), 0.35, 0.9)
        e.save()
        if (isTransparent) e.globalCompositeOperation = 'destination-out'
        const y = r / 2
        const v = n / 2
        const x = Math.max(r, n) / 2
        e.translate(y, v)
        e.scale(r / (2 * x), n / (2 * x))
        const grad = e.createRadialGradient(0, 0, 0, 0, 0, x)
        grad.addColorStop(0, rgba(0))
        grad.addColorStop(inner, rgba(0))
        grad.addColorStop(lerp(inner, 1, 0.5), rgba(maxA * 0.3))
        grad.addColorStop(lerp(inner, 1, 0.8), rgba(maxA * 0.7))
        grad.addColorStop(1, rgba(maxA))
        e.fillStyle = grad
        e.fillRect(-x, -x, 2 * x, 2 * x)
        e.restore()
      }
    },
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let rect = container.getBoundingClientRect()

    const onMouseMove = (ev: MouseEvent) => {
      if (!stateRef.current.isVisible) return
      mouseRef.current.targetX = ev.clientX - rect.left
      mouseRef.current.targetY = ev.clientY - rect.top
    }

    let resizeFrame = 0
    const onScroll = () => {
      resizeFrame ||
        (resizeFrame = requestAnimationFrame(() => {
          rect = container.getBoundingClientRect()
          resizeFrame = 0
        }))
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      if (resizeFrame) cancelAnimationFrame(resizeFrame)
    }
  }, [containerRef, stateRef])

  return (
    <div
      ref={containerRef}
      style={{
        ...style,
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <canvas
        ref={canvasRef as React.RefObject<CanvasWithStart>}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}
