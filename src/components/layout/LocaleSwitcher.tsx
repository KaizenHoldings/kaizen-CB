'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { LOCALES, stripLocale, type Locale } from '@/lib/i18n'

import styles from './SiteHeader.module.css'

/** Etiqueta visible de cada idioma. Dos letras, no la bandera: una bandera
 *  nombra un país, no una lengua, y el castellano de este sitio no es el de
 *  ninguna bandera en concreto. Cada nombre va en su propio idioma —así lo
 *  reconoce quien todavía no puede leer el otro—. */
const LABELS: Record<Locale, { short: string; full: string }> = {
  es: { short: 'ES', full: 'Español' },
  en: { short: 'EN', full: 'English' },
}

/**
 * Cambio de idioma: dos enlaces a la misma página en el otro idioma.
 *
 * Son enlaces reales, no un desplegable ni un botón con `router.push`, porque
 * cada idioma es una URL distinta y navegable: se puede abrir en otra pestaña,
 * copiar y compartir, y los buscadores la siguen. `hreflang` declara a qué
 * lleva cada uno.
 *
 * El destino es la ruta actual con el prefijo sustituido, de modo que cambiar
 * de idioma conserva la página en la que se está en lugar de devolver a la
 * portada.
 */
export const LocaleSwitcher: React.FC<{ locale: Locale; label: string }> = ({ locale, label }) => {
  const neutral = stripLocale(usePathname())
  const target = (next: Locale) => `/${next}${neutral === '/' ? '' : neutral}`

  return (
    <div className={styles.langGroup} role="group" aria-label={label}>
      {LOCALES.map((option) => {
        const active = option === locale
        return (
          <Link
            key={option}
            href={target(option)}
            hrefLang={option}
            className={styles.langOption}
            data-active={active ? 'true' : undefined}
            /* El idioma vigente no es un destino: se marca como página actual
               para que un lector de pantalla lo anuncie y no lo ofrezca como
               si llevara a otro sitio. */
            aria-current={active ? 'true' : undefined}
          >
            <span aria-hidden="true">{LABELS[option].short}</span>
            <span className="kcb-visually-hidden">{LABELS[option].full}</span>
          </Link>
        )
      })}
    </div>
  )
}
