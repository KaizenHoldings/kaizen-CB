'use client'

import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { ActionButton } from '@/components/ui/ActionButton'
import { Icon } from '@/components/ui/Icon'
import { Logo } from '@/components/ui/Logo'
import { useActiveNav } from '@/components/layout/useActiveNav'
import { heroTransition } from '@/lib/hero-choreography'
import { DESKTOP_NAV_LINKS, NAV_LINKS } from '@/lib/site'

import styles from './SiteHeader.module.css'

/** Desplazamiento a partir del cual el navbar adopta su superficie blanca. */
const SCROLL_THRESHOLD = 40

export const SiteHeader: React.FC = () => {
  // Ambos estados arrancan en `false` porque es lo único que el servidor puede
  // saber: no conoce el desplazamiento ni la preferencia de movimiento. El
  // primer render del cliente coincide con el HTML servido y los valores
  // reales se establecen al montar, sin parpadeo ni aviso de hidratación.
  const [scrolled, setScrolled] = useState(false)
  /* La cabecera transparente existe para el hero oscuro de la portada. En
     cualquier otra página el contenido arranca claro, y dejarla transparente
     pintaba la navegación en blanco sobre fondo claro: ilegible hasta
     desplazarse. Fuera de la portada nace ya sólida. */
  const isLanding = usePathname() === '/'
  const activeHref = useActiveNav()
  const [reduceMotion, setReduceMotion] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const read = () => {
      frame = 0
      // Solo se actualiza el estado cuando cruza el umbral, no en cada evento.
      setScrolled((current) => {
        const next = window.scrollY > SCROLL_THRESHOLD
        return next === current ? current : next
      })
    }

    // El scroll se lee dentro de un frame: el listener pasivo nunca bloquea
    // el desplazamiento ni provoca un cálculo de estilo por evento.
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(read)
    }

    const syncMotion = () => setReduceMotion(reduceQuery.matches)

    // Una carga o recarga en una posición distinta de cero llega ya asentada.
    read()
    syncMotion()

    window.addEventListener('scroll', onScroll, { passive: true })
    reduceQuery.addEventListener('change', syncMotion)

    return () => {
      window.removeEventListener('scroll', onScroll)
      reduceQuery.removeEventListener('change', syncMotion)
      if (frame) cancelAnimationFrame(frame)
    }
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

  // Con el panel abierto el navbar también adopta su superficie blanca: el
  // panel es blanco, así que sobre él el logo claro y el icono blanco no se
  // leerían. El estado del panel no depende del desplazamiento.
  const solid = scrolled || menuOpen || !isLanding

  return (
    /* Paso 2 de la coreografía del primer viewport: la cabecera cae en su
       sitio tras el campo interactivo. Se anima el `header` entero, no la capa
       `.surface`: esa ya tiene su propia transición ligada al desplazamiento y
       encadenarles la misma propiedad las haría pelear. Como transformaciones
       distintas sobre elementos distintos, se componen sin interferir. */
    <motion.header
      className={ "font-inter " +styles.header}
      data-scrolled={solid ? 'true' : undefined}
      data-hero
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: '-100%' }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={heroTransition('header', reduceMotion)}
    >
      {/* Superficie blanca: capa propia detrás del contenido. Entra deslizando
          desde arriba y ganando opacidad; con movimiento reducido solo funde. */}
      <motion.div
        className={styles.surface}
        aria-hidden="true"
        initial={false}
        animate={{
          opacity: solid ? 1 : 0,
          // Con movimiento reducido no hay deslizamiento: solo cambia el color.
          y: reduceMotion || solid ? '0%' : '-100%',
        }}
        transition={
          reduceMotion
            ? { duration: 0.2, ease: 'linear' }
            : { duration: 0.42, ease: [0.16, 1, 0.3, 1] }
        }
      />

      <div className={styles.inner}>
        <Link href="/#inicio" className={styles.brand} aria-label="Kaizen Casa de Bolsa, ir al inicio">
          {/* Las dos versiones oficiales conviven y se funden. Ninguna se
              recolorea: sobre el hero manda la clara, sobre blanco la oscura. */}
          <Logo
            variant="dark"
            className={`${styles.logo} ${styles.logoDark}`}
            priority
            decorative
          />
          <Logo
            variant="light"
            className={`${styles.logo} ${styles.logoLight}`}
            priority
            decorative
          />
        </Link>

        <nav className={styles.nav} aria-label="Navegación principal">
          <ul className={styles.menu}>
            {DESKTOP_NAV_LINKS.map((link) => {
              const active = activeHref === link.href
              return (
                <li key={link.href} className={styles.navItem}>
                  {/* Pastilla continua: un único nodo compartido por todos los
                      enlaces. `layoutId` hace que Motion la desplace de uno a
                      otro en lugar de fundir dos elementos distintos, que es lo
                      que da la sensación de que se desliza.

                      El muelle sustituye a la curva fija porque posición y
                      anchura se resuelven por separado: entre etiquetas de
                      distinto ancho —«Mercado» y «Información financiera» se
                      llevan cien píxeles— la caja se estira mientras viaja y se
                      recompone al llegar. Amortiguación 20 sobre rigidez 200 da
                      una relación de 0,71: rebasa apenas el destino y se asienta
                      enseguida. Subirla mataría el estiramiento; bajarla lo
                      volvería un rebote de dibujos animados.

                      Con movimiento reducido se renderiza sin `layoutId`: el
                      cambio es instantáneo, sin recorrido ni deformación. */}
                  {active ? (
                    <motion.span
                      aria-hidden="true"
                      className={`${styles.navPill} bg-[#1f558b]`}
                      {...(reduceMotion
                        ? {}
                        : {
                            layoutId: 'active-nav-indicator',
                            transition: {
                              type: 'spring' as const,
                              stiffness: 200,
                              damping: 20,
                              mass: 1,
                            },
                          })}
                    />
                  ) : null}
                  <Link
                    href={link.href}
                    className={styles.link}
                    aria-current={active ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className={styles.actions}>
          {/* El envoltorio decide la visibilidad: aplicar la clase del módulo
              directamente al botón la dejaría a merced del orden de la hoja de
              estilos frente al `display` global de `.kcb-action`. */}
          {/* Mismo botón, misma posición y mismo nodo: solo cambia la variante
              de superficie, que BUTTON_SYSTEM.md resuelve con `data-surface`.
              No se remonta, así que su animación no se reinicia. */}
          <span className={styles.ctaWrap}>
            <ActionButton
              href="/#registro"
              surface={solid ? 'light' : 'dark'}
              emphasis="primary"
              className="kcb-action--navy-hover"
            >
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
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
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
              initial={reduceMotion ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: 24 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <ul className={styles.panelMenu}>
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={styles.panelLink}
                      data-active={activeHref === link.href ? 'true' : undefined}
                      aria-current={activeHref === link.href ? 'page' : undefined}
                      onClick={closeMenu}
                    >
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
    </motion.header>
  )
}
