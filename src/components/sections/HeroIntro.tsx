'use client'

import { motion } from 'motion/react'
import React from 'react'

import { usePrefersReducedMotion } from '@/components/ui/useReducedMotion'
import { heroTransition } from '@/lib/hero-choreography'

type HeroIntroProps = {
  /** Botonera del hero. Llega como `children` para que siga renderizándose en
   *  el servidor: el cliente solo aporta el movimiento, no el marcado. */
  actions: React.ReactNode
  className?: string
}

/**
 * Pasos 3 y 4 de la coreografía: el titular entra en dos tiempos y la botonera
 * acompaña a la segunda mitad.
 *
 * El titular sigue siendo un solo párrafo. Las dos mitades van en `span` de
 * bloque en lugar de separarse con `<br>` porque cada una necesita su propia
 * transformación, y un salto de línea no se puede animar. La semántica no
 * cambia: un párrafo, dos líneas.
 */
export const HeroIntro: React.FC<HeroIntroProps> = ({ actions, className }) => {
  const reduced = usePrefersReducedMotion()

  // Con movimiento reducido no hay recorrido ni escalonado: solo el fundido.
  const hidden = reduced ? { opacity: 0 } : { opacity: 0, y: 20 }
  const shown = reduced ? { opacity: 1 } : { opacity: 1, y: 0 }

  return (
    <div className={className} data-hero>
      <p className="kcb-measure font-[family-name:var(--font-display)] text-[clamp(2.25rem,1.6rem+3.1vw,3.75rem)] leading-[1.06] font-extralight text-white">
        <motion.span
          className="block"
          initial={hidden}
          animate={shown}
          transition={heroTransition('titleFirst', reduced)}
        >
          Invertir con visión
        </motion.span>
        {/* Separador explícito: al partir el titular en dos bloques, el `<br>`
            que antes los separaba desapareció y el texto accesible quedaba
            pegado —«visióncrecer»—. Visualmente no cambia nada, porque los dos
            tramos son de bloque. */}
        {' '}
        <motion.span
          className="block"
          initial={hidden}
          animate={shown}
          transition={heroTransition('titleSecond', reduced)}
        >
          crecer con confianza
        </motion.span>
      </p>

      <motion.div
        className="mt-10 flex flex-wrap gap-4"
        initial={hidden}
        animate={shown}
        transition={heroTransition('titleSecond', reduced)}
      >
        {actions}
      </motion.div>
    </div>
  )
}
