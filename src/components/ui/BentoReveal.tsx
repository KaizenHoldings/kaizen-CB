'use client'

import React, { useEffect, useRef } from 'react'

type BentoRevealProps = {
  children: React.ReactNode
  className?: string
  /** Retardo entre pieza y pieza, en milisegundos. */
  stagger?: number
}

/**
 * Entrada del bento: cada celda entra desde el lado más cercano hasta encajar.
 *
 * La dirección no viene escrita en el marcado, se mide. En cada entrada se
 * compara el centro de la celda con el centro de la rejilla: la que está a la
 * izquierda llega desde la izquierda y la de la derecha desde la derecha. Al
 * calcularlo en el momento, el gesto sigue siendo correcto cuando la rejilla se
 * recoloca —tres columnas, dos o una— sin tener que duplicar el reparto en JS.
 *
 * El escalonado va en orden de lectura, que es como se lee un bento: las piezas
 * van cayendo de arriba abajo hasta cerrarlo.
 *
 * Se repite cada vez que la sección vuelve a pantalla, igual que el titular, y
 * se rearma solo cuando ha salido por completo. El estado oculto lo pone
 * `globals.css` bajo `html[data-motion='on']`: sin JavaScript o con movimiento
 * reducido las celdas nunca llegan a ocultarse.
 */
export const BentoReveal: React.FC<BentoRevealProps> = ({
  children,
  className,
  stagger = 70,
}) => {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cells = Array.from(list.children).filter(
      (node): node is HTMLElement => node instanceof HTMLElement,
    )

    const place = () => {
      const bounds = list.getBoundingClientRect()
      const middle = bounds.left + bounds.width / 2

      cells.forEach((cell, index) => {
        const box = cell.getBoundingClientRect()
        // Apiladas en una sola columna todas comparten centro, así que medir no
        // distingue nada: ahí alternan, para que el bloque siga armándose desde
        // los dos lados en vez de desfilar entero desde la izquierda.
        const stacked = box.width > bounds.width - 4
        const fromLeft = stacked ? index % 2 === 0 : box.left + box.width / 2 < middle
        cell.style.setProperty('--bento-from', fromLeft ? '-1' : '1')
        cell.style.setProperty('--bento-delay', `${index * stagger}ms`)
      })
    }

    /* Las direcciones se colocan ya en el montaje, y de nuevo si la rejilla
       cambia de reparto. Sin esto, la primera entrada las escribiría en el
       mismo bloque que `data-in` y el navegador interpolaría desde la posición
       que tenía pintada —la izquierda por defecto— en vez de desde el lado que
       le toca. */
    place()

    const resizeObserver = new ResizeObserver(() => {
      if (!list.dataset.in) place()
    })
    resizeObserver.observe(list)

    let armed = true

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return

        if (!entry.isIntersecting) {
          // Rearmar solo cuando ha salido del todo, para que un desplazamiento
          // corto dentro de la propia sección no rehaga el bento a media vista.
          if (entry.intersectionRatio === 0) {
            armed = true
            delete list.dataset.in
          }
          return
        }

        if (!armed || entry.intersectionRatio < 0.1) return
        armed = false
        place()
        // Volcado de estilo: obliga a fijar la posición de partida antes de
        // encender la transición, para que interpole desde el lado correcto.
        void list.offsetWidth
        list.dataset.in = 'true'
      },
      { threshold: [0, 0.1] },
    )

    observer.observe(list)

    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
    }
  }, [stagger])

  return (
    <ul ref={listRef} data-bento className={className}>
      {children}
    </ul>
  )
}
