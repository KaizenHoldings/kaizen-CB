import type { Metadata } from 'next'
import React from 'react'

import { DocumentBrowser } from '@/components/sections/DocumentBrowser'
import { EmptyState } from '@/components/ui/EmptyState'
import { getDictionary } from '@/dictionaries/getDictionary'
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n'
import { documentService } from '@/modules/documents/services/document.service'

/* Sin caché: cada recarga refleja lo último publicado en el panel.
   `fetchCache` cubre cualquier `fetch` que se añada más adelante; hoy los datos
   llegan por Local API de Payload, que no pasa por esa capa. */
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

type Params = { params: Promise<{ lang: string }> }

/* Los metadatos dejan de ser una constante: dependen del idioma del segmento,
   y una constante se evalúa una sola vez para las dos rutas. */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE
  const dict = (await getDictionary(locale)).documents

  return {
    title: dict.metaTitle,
    description: dict.metaDescription,
    openGraph: {
      title: dict.ogTitle,
      description: dict.ogDescription,
      url: `/${locale}/documentos`,
    },
  }
}

export default async function DocumentsPage({ params }: Params) {
  const { lang } = await params
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE

  const [dictionary, archive, supporting] = await Promise.all([
    getDictionary(locale),
    documentService.financialStatementArchive(),
    documentService.listSupportingDocuments(),
  ])

  const dict = dictionary.documents

  const total =
    archive.totalDocuments +
    supporting.institutional.length +
    supporting.compliance.length +
    supporting.reference.length

  return (
    <div className="bg-white">
      <div className="kcb-container py-16 lg:py-24">
        <header className="max-w-3xl">
          <h1
            className="text-[clamp(2rem,1.6rem+2vw,3rem)] font-light text-navy"
            suppressHydrationWarning
          >
            {dict.title}
          </h1>
          <p className="kcb-measure mt-5 text-[1.0625rem] leading-relaxed text-muted">
            {dict.description}
          </p>
        </header>

        <div className="mt-12">
          {total === 0 ? (
            <EmptyState icon="doc" title={dict.empty.title} description={dict.empty.description} />
          ) : (
            <DocumentBrowser
              archive={archive}
              institutional={supporting.institutional}
              compliance={supporting.compliance}
              reference={supporting.reference}
              dict={dict}
            />
          )}
        </div>
      </div>
    </div>
  )
}
