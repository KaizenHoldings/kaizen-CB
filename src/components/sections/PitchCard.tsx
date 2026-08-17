'use client'

import React, { useRef } from 'react'

import { usePrefersReducedMotion } from '@/components/ui/useReducedMotion'

type PitchCardProps = {
  video: string
  /** Voltea el vídeo, para orientar la escalera. Va por propiedad y no fijo en
   *  el componente porque las dos tarjetas comparten este mismo bloque. */
  flipVideo?: boolean
  /** Panel de texto. Llega como `children` para que siga renderizándose en el
   *  servidor: el cliente solo aporta el gesto, no el marcado. Así el botón
   *  «Comenzar» no pasa por aquí ni se altera. */
  children: React.ReactNode
}

/**
 * Tarjeta de ruta: texto a la izquierda, vídeo a la derecha.
 *
 * El vídeo sustituye por completo a la fotografía. En reposo está detenido en
 * su primer fotograma; el fragmento `#t=0.001` de la fuente es lo que hace que
 * ese fotograma se vea. Sin él, y sin imagen de respaldo, `preload="metadata"`
 * dejaría la caja en negro hasta la primera reproducción: el navegador conoce
 * las dimensiones, pero no ha decodificado ningún fotograma que pintar.
 *
 * Los manejadores viven en la tarjeta entera, no en el vídeo, de modo que
 * señalar el texto o el botón también lo pone en marcha.
 *
 * Al salir vuelve a `currentTime = 0` en lugar de quedarse donde estaba: el
 * reposo es siempre la misma imagen, no un fotograma cualquiera.
 *
 * Con movimiento reducido no se registra ningún manejador: el vídeo se queda en
 * el primer fotograma y no se reproduce nunca.
 */
export const PitchCard: React.FC<PitchCardProps> = ({ video, flipVideo = false, children }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduced = usePrefersReducedMotion()

  const onMouseEnter = () => {
    const node = videoRef.current
    if (!node) return
    // `play()` devuelve una promesa que rechaza si el gesto se interrumpe
    // —salir antes de que arranque—; no es un error que deba propagarse.
    void node.play().catch(() => {})
  }

  const onMouseLeave = () => {
    const node = videoRef.current
    if (!node) return
    node.pause()
    node.currentTime = 0
  }

  return (
    <li
      className="group relative grid grid-cols-1 bg-[#0e2d41] transition-shadow duration-300 ease-[var(--ease-kcb)] hover:shadow-[var(--shadow-soft)] has-[a:focus-visible]:shadow-[var(--shadow-soft)] sm:grid-cols-[minmax(0,1fr)_44%]"
      {...(reduced ? {} : { onMouseEnter, onMouseLeave })}
    >
      {children}

      {/* Decorativa: el título ya nombra la ruta. En una sola columna el medio
          no hereda el alto de la fila, así que toma proporción. */}
      <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto sm:min-h-52">
        <video
          ref={videoRef}
          /* El fragmento fuerza a decodificar y pintar el primer fotograma. */
          src={`${video}#t=0.001`}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          /* Fuera del flujo, igual que la imagen a la que sustituye. Dentro del
             flujo, un elemento reemplazado impone su proporción intrínseca y
             estira la fila: la tarjeta pasaba de 297 a 460 px de alto. Así el
             alto lo sigue marcando la columna de texto.
             El volteo va en el propio `video`: el difuminado y la tarjeta
             comparten envoltorio y no deben voltearse con él. */
          className={[
            'absolute inset-0 size-full object-cover',
            flipVideo ? '-scale-x-100' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />

        {/* Difuminado hacia el texto: disuelve la costura entre las dos
            columnas en lugar de dejar un corte recto. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#0e2d41] to-transparent"
        />
      </div>
    </li>
  )
}
