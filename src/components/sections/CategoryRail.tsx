import React from 'react'

import { ActionButton } from '@/components/ui/ActionButton'

/** Máximo de piezas por carril. Un carril es una muestra, no un catálogo: el
 *  listado completo vive en su propia página. */
export const RAIL_LIMIT = 5

type CategoryRailProps = {
  title: string
  description?: string
  /** Destino del «Ver más». */
  href: string
  /** Etiqueta accesible del carril, para lectores de pantalla. */
  label: string
  /** Cuántas piezas hay en total, para decir si el carril es una muestra. */
  total: number
  children: React.ReactNode
}

/**
 * Carril horizontal de una categoría.
 *
 * El desplazamiento es nativo —`overflow-x` con anclaje de scroll—, sin
 * biblioteca ni JavaScript: el navegador ya resuelve rueda, arrastre táctil y
 * teclado, y así el carril funciona igual si el script falla.
 *
 * La lista conserva su semántica de lista; lo que cambia es su disposición. El
 * `tabindex` en el contenedor es lo que permite recorrerlo con el teclado, que
 * es un requisito cuando un contenedor desplazable no tiene foco propio.
 */
export const CategoryRail: React.FC<CategoryRailProps> = ({
  title,
  description,
  href,
  label,
  total,
  children,
}) => (
  <section aria-label={label} className="min-w-0">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.35rem,1.15rem+1vw,1.875rem)] font-light text-navy">
          {title}
        </h3>
        {description ? (
          <p className="kcb-measure mt-2 text-[0.9375rem] leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </div>
    </div>

    {/* El carril sangra hasta el borde de la pantalla y recupera el relleno del
        contenedor por dentro: así la última tarjeta no queda cortada contra un
        margen, sino contra el propio borde. */}
    <div className="mt-6 -mx-[clamp(1.25rem,4vw,3rem)]">
      <ul
        className="kcb-rail gap-4 px-[clamp(1.25rem,4vw,3rem)] pb-4"
        tabIndex={0}
        aria-label={`${label}: desplazamiento horizontal`}
      >
        {children}
      </ul>
    </div>

    <div className="mt-2 flex items-center gap-4">
      <ActionButton href={href} surface="light" emphasis="secondary">
        Ver más
      </ActionButton>
      {total > RAIL_LIMIT ? (
        <p className="text-[0.875rem] text-muted">
          Mostrando {RAIL_LIMIT} de {total}
        </p>
      ) : null}
    </div>
  </section>
)
