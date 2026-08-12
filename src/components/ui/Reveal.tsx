'use client'

import { motion, useReducedMotion } from 'motion/react'
import React from 'react'

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

/**
 * Entrada de sección.
 *
 * El estado oculto NO se renderiza en el servidor: lo aplica `globals.css`
 * únicamente cuando el script previo al pintado marca `data-motion="on"` en la
 * raíz, es decir, solo si hay JavaScript y el sistema no pide movimiento
 * reducido. Así, si la animación no puede ejecutarse —sin JS, con movimiento
 * reducido, o si la hidratación falla—, el contenido queda visible en lugar de
 * desaparecer. Motion parte del valor que la hoja de estilos dejó puesto.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  className,
  delay = 0,
  motionStyle = 'up',
  trigger = 'view',
  as = 'div',
}) => {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }

  const Component = motion[as]

  const transition = {
    duration: 0.55,
    delay,
    // Ease-out exponencial: rápido al entrar, asentado al final.
    ease: [0.16, 1, 0.3, 1] as const,
  }

  if (trigger === 'mount') {
    return (
      <Component
        className={className}
        data-reveal={motionStyle}
        animate={{ opacity: 1, y: 0 }}
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -80px 0px' }}
      transition={transition}
    >
      {children}
    </Component>
  )
}
