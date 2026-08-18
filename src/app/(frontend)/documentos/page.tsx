import type { Metadata } from 'next'
import React from 'react'

import { DocumentBrowser } from '@/components/sections/DocumentBrowser'
import { EmptyState } from '@/components/ui/EmptyState'
import { documentService } from '@/modules/documents/services/document.service'

/* Sin caché: cada recarga refleja lo último publicado en el panel.
   `fetchCache` cubre cualquier `fetch` que se añada más adelante; hoy los datos
   llegan por Local API de Payload, que no pasa por esa capa. */
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export const metadata: Metadata = {
  title: 'Documentos',
  description:
    'Estados financieros, documentación institucional, material de cumplimiento y textos de referencia de Kaizen Casa de Bolsa.',
  openGraph: {
    title: 'Documentos · Kaizen Casa de Bolsa',
    description:
      'Estados financieros y documentación institucional publicados conforme a los requerimientos del regulador.',
    url: '/documentos',
  },
}

export default async function DocumentsPage() {
  const [archive, supporting] = await Promise.all([
    documentService.financialStatementArchive(),
    documentService.listSupportingDocuments(),
  ])

  const total =
    archive.totalDocuments +
    supporting.institutional.length +
    supporting.compliance.length +
    supporting.reference.length

  return (
    <div className="bg-white">
      <div className="kcb-container py-16 lg:py-24">
        <header className="max-w-3xl">
          <h1 className="text-[clamp(2rem,1.6rem+2vw,3rem)] font-light text-navy">Documentos</h1>
          <p className="kcb-measure mt-5 text-[1.0625rem] leading-relaxed text-muted">
            Documentación institucional y estados financieros conforme a los requerimientos de la
            Superintendencia Nacional de Valores. Cada archivo indica su periodo, su formato y su
            tamaño real, y ninguno se enlaza si no existe.
          </p>
        </header>

        <div className="mt-12">
          {total === 0 ? (
            <EmptyState
              icon="doc"
              title="Todavía no hay documentos publicados"
              description="En cuanto se publique el primero desde el panel aparecerá aquí, con su periodo y su formato."
            />
          ) : (
            <DocumentBrowser
              archive={archive}
              institutional={supporting.institutional}
              compliance={supporting.compliance}
              reference={supporting.reference}
            />
          )}
        </div>
      </div>
    </div>
  )
}
