'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import React, { useMemo, useState } from 'react'

import { Icon, type IconName } from '@/components/ui/Icon'

export type ProductTrack = 'person' | 'company'

export type Product = {
  icon: IconName
  title: string
  description: string
  tracks: ProductTrack[]
}

type Filter = 'all' | ProductTrack

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: 'all', label: 'Todo el portafolio' },
  { value: 'person', label: 'Para personas' },
  { value: 'company', label: 'Para empresas' },
]

const TRACK_LABELS: Record<ProductTrack, string> = {
  person: 'Personas',
  company: 'Empresas',
}

/**
 * Listado filtrable de productos.
 *
 * Los filtros son controles especializados (`role="tab"`-like con botones y
 * `aria-pressed`), no Action Buttons. El recuento se anuncia por región viva
 * para que el cambio de filtro sea perceptible sin ver la lista.
 */
export const ProductList: React.FC<{ products: Product[] }> = ({ products }) => {
  const [filter, setFilter] = useState<Filter>('all')
  const prefersReducedMotion = useReducedMotion()

  const visible = useMemo(
    () => (filter === 'all' ? products : products.filter((p) => p.tracks.includes(filter))),
    [products, filter],
  )

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar productos">
        {FILTERS.map((option) => {
          const active = filter === option.value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(option.value)}
              className={[
                'min-h-11 rounded-full px-4 font-[family-name:var(--font-display)] text-[0.9375rem] font-semibold transition-colors duration-200',
                active
                  ? 'bg-navy text-white'
                  : 'bg-white text-navy hover:bg-tint-2',
              ].join(' ')}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      <p className="kcb-visually-hidden" role="status">
        {visible.length} {visible.length === 1 ? 'producto disponible' : 'productos disponibles'} en
        este filtro.
      </p>

      <ul className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((product) => (
            <motion.li
              key={product.title}
              layout={!prefersReducedMotion}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="kcb-hairline flex flex-col gap-3 py-7"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="kcb-chip" data-size="sm">
                  <Icon name={product.icon} className="size-5" />
                </span>
                {/* La pertenencia se enuncia con texto, nunca solo con color. */}
                <span className="text-xs font-medium text-muted">
                  {product.tracks.map((track) => TRACK_LABELS[track]).join(' · ')}
                </span>
              </span>
              <h3 className="font-[family-name:var(--font-display)] text-[1.0625rem] font-semibold text-navy">
                {product.title}
              </h3>
              <p className="text-[0.9375rem] leading-relaxed text-muted">{product.description}</p>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
