'use client'

import { motion } from 'motion/react'
import React from 'react'

import { ReactiveLines } from '@/components/sections/ReactiveLines'
import { usePrefersReducedMotion } from '@/components/ui/useReducedMotion'
import { heroTransition } from '@/lib/hero-choreography'

/**
 * Paso 1 de la coreografía: el campo de líneas se forma desde la derecha.
 *
 * El recorte (`clip-path`) es lo que hace que el campo *aparezca* en lugar de
 * limitarse a deslizarse: la lámina se descubre de derecha a izquierda mientras
 * el propio contenido recorre sus últimos píxeles. Ambos se animan a la vez
 * porque por separado se lee como dos gestos encadenados.
 *
 * Nota: la referencia hablaba de un elemento gráfico «a la derecha» del hero.
 * Este hero no lo tiene —su composición es una sola columna con el campo a
 * sangre—, así que el paso se aplica al único componente interactivo que
 * existe, conservando la dirección del gesto.
 */
export const HeroField: React.FC = () => {
  const reduced = usePrefersReducedMotion()

  return (
    <motion.div
      aria-hidden="true"
      data-hero
      className="pointer-events-none absolute inset-0 overflow-hidden"
      initial={
        reduced ? { opacity: 0 } : { opacity: 0, x: 50, clipPath: 'inset(0 0 0 100%)' }
      }
      animate={reduced ? { opacity: 1 } : { opacity: 1, x: 0, clipPath: 'inset(0 0 0 0%)' }}
      transition={heroTransition('field', reduced)}
    >
      <ReactiveLines
        backgroundColor="transparent"
        lineColor="rgba(255, 255, 255, 0.18)"
        lineWidth={0.75}
        minLines={20}
        maxLines={46}
        fade
        fadeIntensity={22}
      />
    </motion.div>
  )
}
