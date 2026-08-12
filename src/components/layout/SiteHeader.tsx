'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { ActionButton } from '@/components/ui/ActionButton'
import { Icon } from '@/components/ui/Icon'
import { Logo } from '@/components/ui/Logo'
import { DESKTOP_NAV_LINKS, NAV_LINKS } from '@/lib/site'

import styles from './SiteHeader.module.css'

export const SiteHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    burgerRef.current?.focus()
  }, [])

  // Escape cierra el menú y el foco vuelve al control que lo abrió.
  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }

    document.addEventListener('keydown', onKeyDown)
    // Se bloquea el scroll del fondo mientras el panel está abierto.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // El foco entra en el panel para que el teclado no quede detrás.
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen, closeMenu])

  return (
    <header className={styles.header} data-scrolled={scrolled ? 'true' : undefined}>
      <div className={styles.inner}>
        <Link href="/#inicio" className={styles.brand} aria-label="Kaizen Casa de Bolsa, ir al inicio">
          <Logo variant="dark" className={styles.logo} priority decorative />
        </Link>

        <nav className={styles.nav} aria-label="Navegación principal">
          <ul className={styles.menu}>
            {DESKTOP_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          {/* El envoltorio decide la visibilidad: aplicar la clase del módulo
              directamente al botón la dejaría a merced del orden de la hoja de
              estilos frente al `display` global de `.kcb-action`. */}
          <span className={styles.ctaWrap}>
            <ActionButton href="/#registro" surface="light" emphasis="primary">
              Abre tu cuenta
            </ActionButton>
          </span>

          <button
            ref={burgerRef}
            type="button"
            className={styles.burger}
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} className={styles.burgerIcon} />
            <span className="kcb-visually-hidden">{menuOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.div
              className={styles.overlay}
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
              aria-hidden="true"
            />
            <motion.div
              ref={panelRef}
              id="menu-movil"
              className={styles.panel}
              role="dialog"
              aria-modal="true"
              aria-label="Menú de navegación"
              initial={prefersReducedMotion ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, x: 24 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <ul className={styles.panelMenu}>
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.panelLink} onClick={closeMenu}>
                      {link.label}
                      <Icon name="arrowRight" className={styles.panelArrow} />
                    </Link>
                  </li>
                ))}
              </ul>

              <div className={styles.panelFoot}>
                <ActionButton
                  href="/#registro"
                  surface="light"
                  emphasis="primary"
                  fullWidth
                  onClick={closeMenu}
                >
                  Abre tu cuenta
                </ActionButton>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
