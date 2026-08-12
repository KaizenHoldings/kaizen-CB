import type { Metadata } from 'next'
import React from 'react'

import { PublicationsBrowser } from '@/components/sections/PublicationsBrowser'
import { EmptyState } from '@/components/ui/EmptyState'
import { publicationService } from '@/modules/publications/services/publication.service'

export const metadata: Metadata = {
  title: 'Publicaciones',
  description:
    'Newsletters, material de cumplimiento normativo y actualizaciones del mercado de valores publicadas por Kaizen Casa de Bolsa.',
  openGraph: {
    title: 'Publicaciones · Kaizen Casa de Bolsa',
    description:
      'Newsletters, material de cumplimiento normativo y actualizaciones del mercado de valores.',
    url: '/publicaciones',
  },
}

export default async function PublicationsPage() {
  const [publications, availableTypes] = await Promise.all([
    publicationService.listLatest(),
    publicationService.availableTypes(),
  ])

  return (
    <div className="bg-white">
      <div className="kcb-container py-16 lg:py-24">
        <header className="max-w-3xl">
          <h1 className="text-[clamp(2rem,1.6rem+2vw,3rem)] font-bold text-navy">Publicaciones</h1>
          <p className="kcb-measure mt-5 text-[1.0625rem] leading-relaxed text-muted">
            Newsletters, material de cumplimiento normativo y actualizaciones del mercado de valores
            venezolano e internacional.
          </p>
        </header>

        <div className="mt-12">
          {publications.length === 0 ? (
            <EmptyState
              icon="doc"
              title="Todavía no hay publicaciones"
              description="En cuanto publiquemos la primera aparecerá aquí, con su fecha y su tipo."
            />
          ) : (
            <PublicationsBrowser publications={publications} availableTypes={availableTypes} />
          )}
        </div>
      </div>
    </div>
  )
}
