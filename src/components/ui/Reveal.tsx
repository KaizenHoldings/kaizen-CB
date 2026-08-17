'use client'

import { motion } from 'motion/react'
import React, { useEffect, useState } from 'react'

type RevealProps = {
  children: React.ReactNode
  className?: string
  /** Retardo en segundos. Se mantiene corto: escalonar de más retrasa la lectura. */
  delay?: number
  /** `up` sube desde abajo; `none` solo funde. */
  motionStyle?: 'up' | 'none'
  /**
   * `view` espera a que el elemento entre en pantalla. `mount` anima al cargar
   * y es obligatorio en el primer viewport: allí el contenido ya está a la
   * vista, y condicionarlo a un evento de scroll lo dejaría invisible para
   * quien no se desplaza.
   */
  trigger?: 'view' | 'mount'
  as?: 'div' | 'section' | 'article' | 'li' | 'header' | 'aside'
}

/** Recorrido vertical de la entrada. Contenido a propósito: es un movimiento
 *  institucional, no un rebote. */
const TRAVEL = 30

const TRANSITION = { duration: 0.6, ease: 'easeOut' as const }

/**
 * Entrada de sección. Único componente de entrada del sitio: las secciones no
 * declaran su propia animación, la piden a este.
 *
 * El estado inicial lo declara Motion, no la hoja de estilos, porque necesita
 * conocer el punto de partida en el montaje para poder interpolarlo; si se le
 * entrega después, solo anima la opacidad y el desplazamiento no ocurre.
 *
 * Ese `initial` también viaja en el HTML del servidor, así que `globals.css`
 * lo deshace mientras el script previo al pintado no haya marcado la raíz: sin
 * JavaScript el contenido se lee entero y en su sitio.
 *
 * Con movimiento reducido queda solo el fundido, sin recorrido vertical.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  className,
  delay = 0,
  motionStyle = 'up',
  trigger = 'view',
  as = 'div',
}) => {
  /* Arranca en `false` porque es lo único que el servidor puede saber; el
     primer render del cliente coincide con el HTML servido y el valor real se
     establece al montar, sin aviso de hidratación. */
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  const Component = motion[as]

  // Sin recorrido cuando se pide movimiento reducido o cuando la variante es
  // un fundido puro.
  const travel = reduceMotion || motionStyle === 'none' ? 0 : TRAVEL
  const hidden = { opacity: 0, y: travel }
  const shown = { opacity: 1, y: 0 }
  const transition = { ...TRANSITION, delay }

  if (trigger === 'mount') {
    return (
      <Component
        className={className}
        data-reveal={motionStyle}
        initial={hidden}
        animate={shown}
        transition={transition}
      >
        {children}
      </Component>
    )
  }

  return (
    <Component
      className={className}
      data-reveal={motionStyle}
      initial={hidden}
      whileInView={shown}
      /* `once: false`: la entrada se repite cada vez que la sección vuelve a
         pantalla.
         Sin margen negativo a propósito. Recortar la zona de disparo —un
         `-10% 0px`, por ejemplo— funciona mientras la animación ocurre una sola
         vez, pero repitiéndola vuelve a ocultar lo que ya está en pantalla: un
         bloque apoyado en la franja superior o inferior de la ventana queda
         fuera del área recortada y se desvanece a la vista. Medido: el CTA de
         productos a 830 px de una ventana de 900 caía en esa banda y se
         quedaba en opacidad 0. Con el área completa, nada visible se oculta. */
      viewport={{ once: false }}
      transition={transition}
    >
      {children}
    </Component>
  )
}
