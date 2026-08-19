'use client'

import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import Image from 'next/image'
import React, { useRef } from 'react'

import { usePrefersReducedMotion } from '@/components/ui/useReducedMotion'

/**
 * Fotografía de la sección, que se asienta desde la izquierda conforme entra en
 * pantalla.
 *
 * El efecto lo gobierna la posición del scroll, no una duración fija: sigue la
 * velocidad y el sentido del desplazamiento, y retrocede si el visitante sube.
 * El muelle sobre el progreso es lo que evita que el movimiento se sienta atado
 * al píxel exacto de la rueda.
 *
 * Se usa `usePrefersReducedMotion` del proyecto en lugar del `useReducedMotion`
 * de Motion: aquel devuelve `null` en el servidor y el valor real en el
 * cliente, que es justo la discrepancia que ya provocó un aviso de hidratación
 * en la cabecera.
 */
export const PitchImage: React.FC<{ src: string; className?: string }> = ({ src, className }) => {
  const wrapRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start end', 'center 65%'],
  })
  const progress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 42,
    restDelta: 0.001,
  })
  const x = useTransform(progress, [0, 1], ['-45%', '0%'])
  const opacity = useTransform(progress, [0, 1], [0, 1])

  return (
    /* `overflow-hidden` recorta el recorrido: la fotografía parte desplazada un
       45 % a la izquierda y sin él asomaría fuera de su columna. */
    <div ref={wrapRef} className={['relative overflow-hidden', className].filter(Boolean).join(' ')}>
      <motion.div
        data-scroll-media
        className="absolute inset-0"
        style={reduced ? undefined : { x, opacity }}
      >
        <Image
          src={src}
          alt=""
          aria-hidden="true"
          fill
          sizes="(min-width: 64rem) 40vw, 100vw"
          className="object-cover"
        />
      </motion.div>
    </div>
  )
}
