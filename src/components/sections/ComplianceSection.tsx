import Link from 'next/link'
import React from 'react'

import { EmptyState } from '@/components/ui/EmptyState'
import { Icon } from '@/components/ui/Icon'
import { PublicationCard } from '@/components/ui/PublicationCard'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { PublicationSummary } from '@/modules/publications/domain/publication'

/**
 * Cumplimiento normativo y publicaciones.
 *
 * Muestra el material editorial publicado desde Payload. Los documentos de
 * referencia y los manuales descargables se consultan en la pestaña
 * «Referencia» del bloque de información financiera, para no duplicar la misma
 * lista en dos lugares.
 */
export const ComplianceSection: React.FC<{ publications: PublicationSummary[] }> = ({
  publications,
}) => (
  <section id="cumplimiento" className="kcb-section bg-white" aria-labelledby="cumplimiento-titulo">
    <div className="kcb-container">
      <SectionHeading
        id="cumplimiento-titulo"
        title="Cumplimiento y publicaciones"
        description="Publicamos contenido regulatorio del mercado de valores venezolano e internacional, junto con nuestras actualizaciones de mercado y newsletters."
        aside={
          publications.length > 0 ? (
            <Link
              href="/publicaciones"
              className="inline-flex min-h-11 items-center gap-2 font-[family-name:var(--font-display)] text-[0.9375rem] font-semibold text-blue hover:text-navy"
            >
              Ver todas las publicaciones
              <Icon name="arrowRight" className="size-4" />
            </Link>
          ) : undefined
        }
      />

      <div className="mt-12">
        {publications.length === 0 ? (
          <Reveal>
            <EmptyState
              icon="doc"
              title="Todavía no hay publicaciones"
              description="Aquí aparecerán las circulares, los análisis de mercado y los newsletters en cuanto se publiquen desde el panel."
            />
          </Reveal>
        ) : (
          <Reveal>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {publications.map((publication) => (
                <li key={publication.id} className="h-full">
                  <PublicationCard publication={publication} />
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>

      <Reveal className="mt-10">
        <p className="flex items-start gap-2.5 rounded-[12px] bg-tint px-4 py-3.5 text-sm text-navy">
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
