'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import React, { useId, useMemo, useState } from 'react'

import { DocumentRow } from '@/components/ui/DocumentRow'
import { EmptyState } from '@/components/ui/EmptyState'
import { Icon } from '@/components/ui/Icon'
import {
  DOCUMENT_CATEGORY_DESCRIPTIONS,
  DOCUMENT_CATEGORY_LABELS,
  type DocumentCategory,
  type FinancialStatementArchive,
  type PublicDocument,
} from '@/modules/documents/domain/document'

type Props = {
  archive: FinancialStatementArchive
  institutional: PublicDocument[]
  compliance: PublicDocument[]
  reference: PublicDocument[]
}

const TAB_ORDER: DocumentCategory[] = [
  'financial-statement',
  'institutional',
  'compliance',
  'reference',
]

const SHORT_LABELS: Record<DocumentCategory, string> = {
  'financial-statement': 'Estados financieros',
  institutional: 'Institucional',
  compliance: 'Cumplimiento',
  reference: 'Referencia',
}

const ALL_YEARS = 'todos'

/**
 * Consulta estructurada de documentos.
 *
 * Pestañas por tipo de documentación y, dentro de los estados financieros,
 * filtro por año y búsqueda por título. Nada se precarga: los archivos solo se
 * piden cuando alguien pulsa su enlace.
 */
export const DocumentBrowser: React.FC<Props> = ({
  archive,
  institutional,
  compliance,
  reference,
}) => {
  const [active, setActive] = useState<DocumentCategory>('financial-statement')
  const [year, setYear] = useState<string>(ALL_YEARS)
  const [query, setQuery] = useState('')
  const prefersReducedMotion = useReducedMotion()
  const searchId = useId()

  const byCategory: Record<DocumentCategory, PublicDocument[]> = useMemo(
    () => ({
      'financial-statement': archive.years.flatMap((group) => group.documents),
      institutional,
      compliance,
      reference,
    }),
    [archive, institutional, compliance, reference],
  )

  const counts = useMemo(
    () =>
      TAB_ORDER.reduce<Record<string, number>>((acc, category) => {
        acc[category] = byCategory[category].length
        return acc
      }, {}),
    [byCategory],
  )

  const normalizedQuery = query.trim().toLowerCase()

  const filteredYears = useMemo(() => {
    const groups =
      year === ALL_YEARS
        ? archive.years
        : archive.years.filter((group) => String(group.year) === year)

    if (!normalizedQuery) return groups

    return groups
      .map((group) => ({
        ...group,
        documents: group.documents.filter((document) =>
          `${document.title} ${document.description ?? ''}`.toLowerCase().includes(normalizedQuery),
        ),
      }))
      .filter((group) => group.documents.length > 0)
  }, [archive.years, year, normalizedQuery])

  const financialResultCount = filteredYears.reduce(
    (total, group) => total + group.documents.length,
    0,
  )

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }

  return (
    <div>
      {/* Navegación por tipo. En móvil se desplaza horizontalmente dentro de su
          propio contenedor, sin arrastrar la página. */}
      <div className="-mx-[clamp(1.25rem,4vw,3rem)] overflow-x-auto px-[clamp(1.25rem,4vw,3rem)] pb-1">
        <div
          role="tablist"
          aria-label="Tipo de documentación"
          className="flex w-max min-w-full gap-1 rounded-full bg-white p-1"
        >
          {TAB_ORDER.map((category) => {
            const selected = active === category
            return (
              <button
                key={category}
                type="button"
                role="tab"
                id={`doc-tab-${category}`}
                aria-selected={selected}
                aria-controls={`doc-panel-${category}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(category)}
                className={[
                  'flex min-h-11 items-center gap-2 rounded-full px-4 font-[family-name:var(--font-display)] text-[0.9375rem] font-semibold whitespace-nowrap transition-colors duration-200',
                  selected ? 'bg-navy text-white' : 'text-navy hover:bg-tint',
                ].join(' ')}
              >
                {SHORT_LABELS[category]}
                <span
                  className={[
                    'rounded-full px-2 py-0.5 text-xs font-semibold',
                    selected ? 'bg-white/18 text-white' : 'bg-tint text-muted',
                  ].join(' ')}
                >
                  {counts[category] ?? 0}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            role="tabpanel"
            id={`doc-panel-${active}`}
            aria-labelledby={`doc-tab-${active}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={transition}
          >
            <p className="kcb-measure text-[0.9375rem] leading-relaxed text-muted">
              {DOCUMENT_CATEGORY_DESCRIPTIONS[active]}
            </p>

            {active === 'financial-statement' ? (
              <>
                {archive.totalDocuments > 0 ? (
                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="w-full sm:max-w-xs">
                      <label
                        htmlFor={searchId}
                        className="block font-[family-name:var(--font-display)] text-sm font-semibold text-navy"
                      >
                        Buscar por periodo o título
                      </label>
                      <div className="relative mt-2">
                        <Icon
                          name="search"
                          className="pointer-events-none absolute start-3.5 top-1/2 size-[1.125rem] -translate-y-1/2 text-muted"
                        />
                        <input
                          id={searchId}
                          type="search"
                          value={query}
                          onChange={(event) => setQuery(event.target.value)}
                          placeholder="Ejemplo: abril"
                          className="min-h-11 w-full rounded-full border border-line bg-white ps-11 pe-4 text-[0.9375rem] text-ink placeholder:text-muted focus-visible:border-blue"
                        />
                      </div>
                    </div>

                    {archive.availableYears.length > 1 ? (
                      <div
                        className="flex flex-wrap gap-2"
                        role="group"
                        aria-label="Filtrar estados financieros por año"
                      >
                        {[ALL_YEARS, ...archive.availableYears.map(String)].map((value) => {
                          const selected = year === value
                          return (
                            <button
                              key={value}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => setYear(value)}
                              className={[
                                'min-h-11 rounded-full px-4 font-[family-name:var(--font-display)] text-[0.9375rem] font-semibold transition-colors duration-200',
                                selected
                                  ? 'bg-blue text-white'
                                  : 'bg-white text-navy hover:bg-tint',
                              ].join(' ')}
                            >
                              {value === ALL_YEARS ? 'Todos los años' : value}
                            </button>
                          )
                        })}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <p className="kcb-visually-hidden" role="status">
                  {financialResultCount}{' '}
                  {financialResultCount === 1 ? 'documento encontrado' : 'documentos encontrados'}.
                </p>

                {archive.totalDocuments === 0 ? (
                  <div className="mt-8">
                    <EmptyState
                      icon="chart"
                      title="Aún no hay estados financieros publicados"
                      description="En cuanto se publique el primer periodo aparecerá aquí, ordenado del más reciente al más antiguo."
                    />
                  </div>
                ) : filteredYears.length === 0 ? (
                  <div className="mt-8">
                    <EmptyState
                      live
                      icon="search"
                      title="Ningún documento coincide con tu búsqueda"
                      description="Prueba con otro periodo o quita los filtros para ver todos los estados financieros."
                    />
                  </div>
                ) : (
                  <div className="mt-8 space-y-10">
                    {filteredYears.map((group) => (
                      <section key={group.year} aria-labelledby={`ejercicio-${group.year}`}>
                        <h3
                          id={`ejercicio-${group.year}`}
                          className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.08em] text-muted uppercase"
                        >
                          Ejercicio {group.year}
                        </h3>
                        <ul className="mt-3">
                          {group.documents.map((document) => (
                            <DocumentRow key={document.id} document={document} />
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="mt-8">
                {byCategory[active].length === 0 ? (
                  <EmptyState
                    icon="doc"
                    title={`Aún no hay ${DOCUMENT_CATEGORY_LABELS[active].toLowerCase()} publicada`}
                    description="Publicaremos aquí los documentos en cuanto estén disponibles."
                  />
                ) : (
                  <ul>
                    {byCategory[active].map((document) => (
                      <DocumentRow key={document.id} document={document} />
                    ))}
                  </ul>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
