'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import React, { useMemo, useState } from 'react'

import { EmptyState } from '@/components/ui/EmptyState'
import { PublicationCard } from '@/components/ui/PublicationCard'
import {
  PUBLICATION_TYPE_LABELS,
  type PublicationSummary,
  type PublicationType,
} from '@/modules/publications/domain/publication'

type Filter = 'all' | PublicationType

export const PublicationsBrowser: React.FC<{
  publications: PublicationSummary[]
  availableTypes: PublicationType[]
}> = ({ publications, availableTypes }) => {
  const [filter, setFilter] = useState<Filter>('all')
  const prefersReducedMotion = useReducedMotion()

  const visible = useMemo(
    () =>
      filter === 'all'
        ? publications
        : publications.filter((publication) => publication.type === filter),
    [publications, filter],
  )

  const options: Array<{ value: Filter; label: string }> = [
    { value: 'all', label: 'Todas' },
    ...availableTypes.map((type) => ({ value: type, label: PUBLICATION_TYPE_LABELS[type] })),
  ]

  return (
    <div>
      {options.length > 2 ? (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar publicaciones por tipo">
          {options.map((option) => {
            const active = filter === option.value
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(option.value)}
                className={[
                  'min-h-11 rounded-full px-4 font-[family-name:var(--font-display)] text-[0.9375rem] font-semibold transition-colors duration-200',
                  active ? 'bg-navy text-white' : 'bg-tint text-navy hover:bg-tint-2',
                ].join(' ')}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      ) : null}

      <p className="kcb-visually-hidden" role="status">
        {visible.length} {visible.length === 1 ? 'publicación' : 'publicaciones'} en este filtro.
      </p>

      {visible.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            live
            icon="search"
            title="No hay publicaciones de este tipo"
            description="Elige otro filtro para ver el resto del material publicado."
          />
        </div>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((publication) => (
              <motion.li
                key={publication.id}
                layout={!prefersReducedMotion}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <PublicationCard publication={publication} headingLevel={2} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}
