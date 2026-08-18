import Link from 'next/link'
import React from 'react'

import { CategoryRail, RAIL_LIMIT } from '@/components/sections/CategoryRail'
import { EmptyState } from '@/components/ui/EmptyState'
import { Icon } from '@/components/ui/Icon'
import { PublicationCard } from '@/components/ui/PublicationCard'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import {
  PUBLICATION_TYPE_LABELS,
  PUBLICATION_TYPES,
  type PublicationSummary,
} from '@/modules/publications/domain/publication'

/**
 * Cumplimiento normativo y publicaciones.
 *
 * En la portada el material se agrupa por tipo y cada grupo se recorre en un
 * carril horizontal con sus cinco entradas más recientes. El listado completo
 * vive en `/publicaciones`: aquí se muestra una selección, no un catálogo.
 *
 * Los documentos de referencia y los manuales descargables se consultan en la
 * sección de información financiera, para no duplicar la misma lista.
 */
export const ComplianceSection: React.FC<{ publications: PublicationSummary[] }> = ({
  publications,
}) => {
  // Agrupación en memoria: la consulta ya trae lo publicado y ordenado, así que
  // no hace falta una petición por tipo.
  const byType = PUBLICATION_TYPES.map((type) => ({
    type,
    items: publications.filter((publication) => publication.type === type),
  })).filter((group) => group.items.length > 0)

  return (
    <section
      id="cumplimiento"
      className="kcb-section bg-white"
      aria-labelledby="cumplimiento-titulo"
    >
      <div className="kcb-container">
        <SectionHeading
          id="cumplimiento-titulo"
          title="Cumplimiento y publicaciones"
          description="Publicamos contenido regulatorio del mercado de valores venezolano e internacional, junto con nuestras actualizaciones de mercado y newsletters."
        />

        <div className="mt-12">
          {byType.length === 0 ? (
            <Reveal>
              <EmptyState
                icon="doc"
                title="Todavía no hay publicaciones"
                description="Aquí aparecerán las circulares, los análisis de mercado y los newsletters en cuanto se publiquen desde el panel."
              />
            </Reveal>
          ) : (
            <div className="flex flex-col gap-16">
              {byType.map((group) => (
                <Reveal key={group.type}>
                  <CategoryRail
                    title={PUBLICATION_TYPE_LABELS[group.type]}
                    label={`Publicaciones de tipo ${PUBLICATION_TYPE_LABELS[group.type]}`}
                    href="/publicaciones"
                    total={group.items.length}
                  >
                    {group.items.slice(0, RAIL_LIMIT).map((publication) => (
                      <li
                        key={publication.id}
                        className="kcb-rail-item w-[min(20rem,78vw)]"
                      >
                        <PublicationCard publication={publication} />
                      </li>
                    ))}
                  </CategoryRail>
                </Reveal>
              ))}
            </div>
          )}
        </div>

        <Reveal className="mt-12">
          <p className="flex items-start gap-2 rounded-xl bg-tint px-4 py-3.5 text-sm text-navy">
            <Icon name="info" className="mt-0.5 size-4 shrink-0 text-blue" />
            <span>
              ¿Buscas normativa, manuales o el código de gobierno corporativo? Están en la pestaña{' '}
              <Link href="/#informacion-financiera" className="kcb-link">
                Referencia
              </Link>{' '}
              de la información financiera.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
