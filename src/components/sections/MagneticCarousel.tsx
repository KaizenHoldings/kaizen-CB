'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import styles from './MagneticCarousel.module.css'

export type MagneticItem = {
  title: string
  description: string
  /** Ruta pública de la imagen. Temporal: se sustituye sin tocar el componente. */
  image: string
}

/* Medidas de la referencia. No se ajustan: definen el comportamiento. */
const COLLAPSED_WIDTH = 130
const HOVER_WIDTH = 260
const COLLAPSED_HEIGHT = 400
const HOVER_HEIGHT = 470
const OPEN_SIZE = 560
const GAP = 8 
const INFLUENCE = 200
const BLUR = 2
const DURATION = 0.3
const EASE = 'ease-in-out'
/** Interpolación por frame del bucle continuo. */
const LERP = 0.2
/** Holgura antes de tomar el gesto como arrastre y no como pulsación. */
const DRAG_THRESHOLD = 6
const TRACK_EASE = `transform ${DURATION}s ${EASE}`

/* En el servidor no hay medición que hacer, así que allí se usa el efecto
   normal; en el cliente el de disposición, que corre antes de pintar. Es lo
   que quita el retraso al abrir. */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const OPEN_EASE = [
  `width ${DURATION}s ${EASE}`,
  `height ${DURATION}s ${EASE}`,
  `filter ${DURATION}s ${EASE}`,
  `opacity ${DURATION}s ${EASE}`,
].join(', ')

/**
 * Carrusel magnético: una fila de barras que se agrandan según la cercanía del
 * cursor, al modo del dock de macOS. La barra bajo el puntero crece más y sus
 * vecinas van cediendo por distancia. Al pulsar una, se abre como un cuadrado
 * y el resto se desenfoca.
 *
 * El aumento por proximidad lo mueve un bucle continuo de `requestAnimationFrame`
 * —sin transición CSS— para que siga al cursor sin retraso; la apertura y el
 * cierre sí usan transición.
 *
 * El bucle escribe el ancho y el alto directamente en el DOM. Pasarlos por el
 * estado de React obligaría a reconciliar las nueve tarjetas y sus imágenes en
 * cada frame, que es justo lo que hacía que la franja fuese a tirones. El
 * cálculo y los tiempos son los mismos; solo cambia por dónde llega el valor.
 */
export const MagneticCarousel: React.FC<{ items: MagneticItem[]; label: string }> = ({
  items,
  label,
}) => {
  const count = items.length
  const baseId = useId()
  const trackRef = useRef<HTMLUListElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const barsRef = useRef<(HTMLButtonElement | null)[]>([])

  const [open, setOpen] = useState<number | null>(null)
  const [closing, setClosing] = useState(false)
  // Ambos arrancan neutros: es lo único que el servidor puede saber.
  const [reduceMotion, setReduceMotion] = useState(false)
  /* Entrada de las tarjetas. La dispara la franja entera, no cada tarjeta:
     `.viewport` recorta en horizontal, así que una barra desplazada fuera del
     recorte no interseca aunque esté a la vista, y repitiendo la animación se
     quedaba invisible hasta volver a arrastrarla. Observando el contenedor, las
     nueve entran juntas y el recorte deja de importar. */
  const [entered, setEntered] = useState(false)
  const [openSize, setOpenSize] = useState(OPEN_SIZE)
  // Altura contraída real. Arranca en la de referencia, que es la que sirve el
  // servidor, y se ajusta a la banda disponible al montar.
  const [barHeight, setBarHeight] = useState(COLLAPSED_HEIGHT)
  const metricsRef = useRef({ collapsedHeight: COLLAPSED_HEIGHT, hoverHeight: HOVER_HEIGHT })

  const targetRef = useRef<number[]>(items.map(() => 0))
  const curRef = useRef<number[]>(items.map(() => 0))
  const loopRef = useRef(0)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const reduceRef = useRef(false)
  const openRef = useRef<number | null>(null)
  const pressedRef = useRef(false)
  const openSizeRef = useRef(OPEN_SIZE)
  const offsetRef = useRef(0)
  const dragRef = useRef<{
    index: number
    startX: number
    startOffset: number
    dragging: boolean
  } | null>(null)
  /* El manejador de `pointerup` vive en un efecto con dependencias estables;
     la referencia le da siempre la versión vigente de `toggle`. */
  const toggleRef = useRef<(index: number) => void>(() => {})

  useEffect(
    () => () => {
      cancelAnimationFrame(loopRef.current)
      clearTimeout(closeTimer.current)
    },
    [],
  )

  /* Preferencia de movimiento y tamaño máximo de la apertura: ambos se
     resuelven tras montar, nunca durante el render del servidor. */
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')

    const syncMotion = () => {
      reduceRef.current = query.matches
      setReduceMotion(query.matches)
    }

    /* El cuadrado abierto se mide contra la banda real que la sección cede a
       la franja, no contra la ventana: así nunca la desborda por mucho que
       cambie el alto disponible. */
    const syncSize = () => {
      const viewport = viewportRef.current
      if (!viewport) return
      const box = getComputedStyle(viewport)
      const band =
        viewport.clientHeight - parseFloat(box.paddingTop) - parseFloat(box.paddingBottom)
      if (band <= 0) return

      /* Las alturas se escalan a la banda conservando la proporción de la
         referencia (contraída : ampliada = 400 : 470), de modo que la franja
         llena el alto disponible en lugar de dejar aire muerto. */
      metricsRef.current = {
        collapsedHeight: band * (COLLAPSED_HEIGHT / HOVER_HEIGHT),
        hoverHeight: band,
      }
      setBarHeight(metricsRef.current.collapsedHeight)
      const next = Math.max(160, Math.min(window.innerWidth - 48, band))
      openSizeRef.current = next
      setOpenSize(next)
    }

    syncMotion()
    syncSize()
    query.addEventListener('change', syncMotion)

    // La banda cambia con el alto de la ventana, no solo con el ancho.
    const observer = new ResizeObserver(syncSize)
    if (viewportRef.current) observer.observe(viewportRef.current)

    /* La entrada se repite en cada visita. Se rearma solo cuando la franja ha
       salido por completo, para que un desplazamiento corto dentro de la propia
       sección no la relance a media vista. */
    const entrance = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) setEntered(true)
        else if (entry.intersectionRatio === 0) setEntered(false)
      },
      { threshold: [0, 0.2] },
    )
    if (viewportRef.current) entrance.observe(viewportRef.current)

    return () => {
      query.removeEventListener('change', syncMotion)
      observer.disconnect()
      entrance.disconnect()
    }
  }, [])

  /* Tamaños de los estados discretos. Al soltarlos, la barra vuelve al tamaño
     contraído que declara la hoja de estilos, que es también el que se sirve
     desde el servidor. */
  useIsomorphicLayoutEffect(() => {
    openRef.current = open
    if (open !== null) {
      // El bucle de la lupa cede el control del ancho y el alto.
      cancelAnimationFrame(loopRef.current)
      loopRef.current = 0
      targetRef.current = items.map(() => 0)
      curRef.current = items.map(() => 0)
    }
    /* React acaba de escribir la transición en el mismo commit. Leer una
       medida fuerza a que ese estilo quede registrado antes de cambiar el
       tamaño; sin esta lectura el navegador podría tomar ambos cambios como
       uno solo y saltar al tamaño final sin animar. */
    void barsRef.current[0]?.offsetWidth

    barsRef.current.forEach((bar, index) => {
      if (!bar) return
      if (open !== null && index === open) {
        bar.style.width = `${openSize}px`
        bar.style.height = `${openSize}px`
      } else {
        bar.style.width = ''
        bar.style.height = ''
      }
    })
  }, [open, openSize, items])

  const startLoop = useCallback(() => {
    if (loopRef.current) return
    const step = () => {
      // Con una tarjeta abierta manda el tamaño discreto: si el bucle siguiera
      // escribiendo, pisaría el cuadrado con el último valor de la lupa.
      if (openRef.current !== null) {
        loopRef.current = 0
        return
      }

      const tgt = targetRef.current
      const cur = curRef.current
      const bars = barsRef.current
      let moving = false

      for (let i = 0; i < cur.length; i++) {
        const d = (tgt[i] ?? 0) - cur[i]
        if (Math.abs(d) > 0.001) {
          cur[i] += d * LERP
          moving = true
        } else {
          cur[i] = tgt[i] ?? 0
        }

        const bar = bars[i]
        if (!bar) continue
        const f = cur[i]
        if (f === 0) {
          // Sin desviación: manda de nuevo el tamaño contraído del elemento.
          bar.style.width = ''
          bar.style.height = ''
        } else {
          const { collapsedHeight, hoverHeight } = metricsRef.current
          bar.style.width = `${COLLAPSED_WIDTH + (HOVER_WIDTH - COLLAPSED_WIDTH) * f}px`
          bar.style.height = `${collapsedHeight + (hoverHeight - collapsedHeight) * f}px`
        }
      }

      loopRef.current = moving ? requestAnimationFrame(step) : 0
    }
    loopRef.current = requestAnimationFrame(step)
  }, [])

  const setTargetFromCursor = useCallback(
    (clientX: number) => {
      const el = trackRef.current
      if (!el) return
      // Si la lista cambiara de longitud, los acumuladores se rehacen aquí: es
      // el único punto donde se leen, y evita un efecto que encadene renders.
      if (targetRef.current.length !== count) {
        targetRef.current = items.map(() => 0)
        curRef.current = items.map(() => 0)
      }
      const rect = el.getBoundingClientRect()
      const cx = clientX - rect.left
      const n = count
      // Centros de ranura del reparto contraído: estables, para que el pico
      // siga al cursor sin realimentarse del propio crecimiento.
      const totalBase = n * COLLAPSED_WIDTH + (n - 1) * GAP
      const startX = (rect.width - totalBase) / 2
      targetRef.current = items.map((_, i) => {
        const center = startX + i * (COLLAPSED_WIDTH + GAP) + COLLAPSED_WIDTH / 2
        const dist = Math.abs(cx - center)
        const f = Math.max(0, 1 - dist / INFLUENCE)
        return f * f * (3 - 2 * f) // caída smoothstep
      })
      startLoop()
    },
    [count, items, startLoop],
  )

  const clearTargets = useCallback(() => {
    targetRef.current = items.map(() => 0)
    startLoop()
  }, [items, startLoop])

  const close = useCallback(() => {
    targetRef.current = items.map(() => 0)
    curRef.current = items.map(() => 0)
    setClosing(true)
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setClosing(false), DURATION * 1000)
    setOpen(null)
  }, [items])

  /* Desplazamiento manual de la franja.
     `maxOffset` se calcula, no se mide: cuando hay una tarjeta abierta la fila
     mide distinto y este cálculo corre antes de que el navegador pinte los
     tamaños nuevos. */
  const maxOffset = useCallback(() => {
    const viewport = viewportRef.current
    const first = barsRef.current[0]
    if (!viewport || !first) return 0

    const startX = first.offsetLeft
    const openIndex = openRef.current
    const barsWidth =
      openIndex === null
        ? count * COLLAPSED_WIDTH
        : openSizeRef.current + (count - 1) * COLLAPSED_WIDTH
    const rowWidth = barsWidth + (count - 1) * GAP + startX * 2

    return Math.max(0, rowWidth - viewport.clientWidth)
  }, [count])

  const applyOffset = useCallback(
    (value: number, animate: boolean) => {
      const track = trackRef.current
      if (!track) return
      const clamped = Math.max(0, Math.min(value, maxOffset()))
      offsetRef.current = clamped
      track.style.transition = animate && !reduceRef.current ? TRACK_EASE : 'none'
      track.style.transform = `translateX(${-clamped}px)`
    },
    [maxOffset],
  )

  /* Al pulsar se congela la lupa y se anota la barra pulsada. La apertura se
     decide al soltar y solo si el puntero no se arrastró: así el mismo gesto
     sirve para abrir una tarjeta y para desplazar la franja, y el destino
     nunca depende de qué haya bajo el cursor al terminar. */
  const onPointerDown = (event: React.PointerEvent) => {
    pressedRef.current = true
    cancelAnimationFrame(loopRef.current)
    loopRef.current = 0
    targetRef.current = [...curRef.current]

    const button = (event.target as HTMLElement).closest('button')
    const index = button ? barsRef.current.indexOf(button as HTMLButtonElement) : -1

    dragRef.current = {
      index,
      startX: event.clientX,
      startOffset: offsetRef.current,
      dragging: false,
    }
  }

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current
      if (!drag) return

      const dx = event.clientX - drag.startX
      if (!drag.dragging && Math.abs(dx) > DRAG_THRESHOLD) drag.dragging = true
      // Sin transición mientras se arrastra: la franja debe seguir al dedo.
      if (drag.dragging) applyOffset(drag.startOffset - dx, false)
    }

    const onPointerUp = () => {
      const drag = dragRef.current
      dragRef.current = null
      pressedRef.current = false
      if (!drag) return
      // Pulsación limpia, sin arrastre: se abre la barra que se pulsó.
      if (!drag.dragging && drag.index >= 0) toggleRef.current(drag.index)
    }

    const cancel = () => {
      dragRef.current = null
      pressedRef.current = false
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', cancel)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', cancel)
    }
  }, [applyOffset])

  const onMove = (event: React.MouseEvent) => {
    // Con movimiento reducido no hay lupa: el bucle continuo no llega a arrancar.
    if (openRef.current !== null || reduceRef.current || pressedRef.current) return
    setTargetFromCursor(event.clientX)
  }

  const onLeave = () => {
    if (openRef.current !== null) return
    clearTargets()
  }

  /* Escape cierra la tarjeta abierta. El listener solo existe mientras hay algo
     abierto, y en el documento porque el foco puede estar fuera del carrusel
     si se cerró pulsando el fondo. */
  useEffect(() => {
    if (open === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  /* Al abrir, la fila crece más de lo que cabe. En lugar de dejar una barra de
     desplazamiento, es la propia pista la que se corre lo justo para que la
     tarjeta abierta entre en pantalla, y vuelve a su sitio al cerrar. El
     desplazamiento se calcula con los tamaños ya finales —el efecto de
     disposición los escribió antes— y se limita a lo que sobra por la derecha,
     de modo que nunca se descubre hueco en los extremos. */
  useIsomorphicLayoutEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    if (open === null) {
      applyOffset(0, true)
      return
    }

    const first = barsRef.current[0]
    if (!first) return

    /* La geometría se calcula, no se mide: este efecto corre antes de pintar,
       cuando las barras aún tienen el ancho contraído, así que leerlas daría
       un desbordamiento de cero y la pista no se movería. La posición de la
       primera barra sí es fiable —nada la precede— y el resto se deduce de los
       tamaños ya conocidos. */
    const startX = first.offsetLeft
    const cardLeft = startX + open * (COLLAPSED_WIDTH + GAP)
    applyOffset(cardLeft + openSize / 2 - viewport.clientWidth / 2, true)
  }, [open, openSize, applyOffset])

  // La apertura y el cierre sí se animan; el seguimiento del cursor, no.
  const barTransition = reduceMotion ? 'none' : open !== null || closing ? OPEN_EASE : 'none'

  const toggle = (index: number) => {
    if (open === index) close()
    else setOpen(index)
  }
  // Se refresca tras cada render, así el gesto global siempre llama a la
  // versión vigente.
  useEffect(() => {
    toggleRef.current = toggle
  })

  return (
    <div ref={viewportRef} className={styles.viewport}>
      {/* Fondo transparente: pulsar fuera cierra la tarjeta abierta. */}
      <div
        className={styles.backdrop}
        data-active={open !== null ? 'true' : undefined}
        onClick={close}
        aria-hidden="true"
      />

      <ul
        ref={trackRef}
        className={styles.track}
        aria-label={label}
        style={
          {
            minInlineSize: count * COLLAPSED_WIDTH + (count - 1) * GAP + 40,
            // La altura contraída viaja como variable para que la declare una
            // sola vez y la hoja de estilos la aplique a todas las barras.
            '--kcb-bar-height': `${barHeight}px`,
          } as React.CSSProperties
        }
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onPointerDown={onPointerDown}
      >
        {items.map((item, index) => {
          const isOpen = open === index
          const dimmed = open !== null && !isOpen
          const titleId = `${baseId}-t-${index}`
          const descriptionId = `${baseId}-d-${index}`

          /* Entrada escalonada: cada tarjeta cae desde arriba a su sitio.
             Anima el `li`, no la barra: el bucle magnético escribe ancho y alto
             en el `button`, y el desplazamiento de la franja lee `offsetLeft`,
             que las transformaciones no alteran. Así el gesto de entrada y la
             lupa no se pisan.
             Con movimiento reducido no se pasan propiedades de animación; la
             tarjeta se queda visible y en su sitio por la regla de
             `globals.css`, sin caída ni fundido.
             `once: false`: la caída se repite cada vez que la franja vuelve a
             pantalla, no solo la primera vez. */
          return (
            <motion.li
              key={item.title}
              className={styles.item}
              data-product-item
              {...(reduceMotion
                ? {}
                : {
                    initial: { opacity: 0, y: -40 },
                    animate: entered ? { opacity: 1, y: 0 } : { opacity: 0, y: -40 },
                    transition: {
                      duration: 0.5,
                      // El escalonado solo al entrar: al salir se recogen a la vez.
                      delay: entered ? index * 0.1 : 0,
                      ease: 'easeOut' as const,
                    },
                  })}
            >
              <button
                type="button"
                ref={(element) => {
                  barsRef.current[index] = element
                }}
                className={styles.bar}
                style={{
                  transition: barTransition,
                  filter: dimmed && !reduceMotion ? `blur(${BLUR}px)` : undefined,
                }}
                data-open={isOpen ? 'true' : undefined}
                data-dimmed={dimmed ? 'true' : undefined}
                aria-expanded={isOpen}
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                /* El puntero lo resuelve el gesto global: abre al soltar solo
                   si no hubo arrastre. Aquí queda el teclado, que no pasa por
                   `pointerdown` y se reconoce por `detail === 0`. */
                onClick={(event) => {
                  if (event.detail === 0) toggle(index)
                }}
              >
                {/* Imagen temporal y decorativa: el título ya nombra el producto. */}
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 48rem) 60vw, 500px"
                  className={styles.image}
                />

                <span className={styles.content}>
                  <span id={titleId} className={styles.title}>
                    {item.title}
                  </span>
                  {/* El envoltorio es el que se pliega; el texto de dentro
                      mantiene su alto natural. */}
                  <span className={styles.descriptionWrap}>
                    <span id={descriptionId} className={styles.description}>
                      {item.description}
                    </span>
                  </span>
                </span>
              </button>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
