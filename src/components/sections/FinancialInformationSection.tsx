import React from 'react'

import { CategoryRail, RAIL_LIMIT } from '@/components/sections/CategoryRail'
import { DocumentRow } from '@/components/ui/DocumentRow'
import { EmptyState } from '@/components/ui/EmptyState'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import {
  DOCUMENT_CATEGORY_DESCRIPTIONS,
  DOCUMENT_CATEGORY_LABELS,
  type DocumentCategory,
  type FinancialStatementArchive,
  type PublicDocument,
} from '@/modules/documents/domain/document'

/**
 * Información financiera y documentos.
 *
 * En la portada cada categoría se recorre en un carril horizontal con sus cinco
 * documentos más recientes. La consulta completa —con su filtro por año en los
 * estados financieros— vive en `/documentos`: aquí se muestra una selección.
 *
 * Los estados financieros llegan agrupados por año; el carril los aplana para
 * quedarse con los más recientes, que es lo que interesa en una vista de paso.
 */
export const FinancialInformationSection: React.FC<{
  archive: FinancialStatementArchive
  supporting: Record<DocumentCategory, PublicDocument[]>
}> = ({ archive, supporting }) => {
  const financialStatements = archive.years.flatMap((group) => group.documents)

  const groups = (
    [
      { category: 'financial-statement', items: financialStatements },
      { category: 'institutional', items: supporting.institutional },
      { category: 'compliance', items: supporting.compliance },
      { category: 'reference', items: supporting.reference },
    ] satisfies Array<{ category: DocumentCategory; items: PublicDocument[] }>
  ).filter((group) => group.items.length > 0)

  return (
    <section
      id="informacion-financiera"
      className="kcb-section bg-pearl"
      aria-labelledby="informacion-financiera-titulo"
    >
      <Reveal className="kcb-container">
        {/* Segundo peso focal de la página: la documentación pública es la
            evidencia sobre la que descansa la tesis, y su escala lo dice. */}
        <SectionHeading
          id="informacion-financiera-titulo"
          size="lead"
          title="Información financiera y documentos"
          description="Documentación institucional y estados financieros conforme a los requerimientos del regulador. Cada archivo indica su periodo, su formato y su tamaño real, y ninguno se enlaza si no existe."
        />

        <div className="mt-12">
          {groups.length === 0 ? (
            <EmptyState
              icon="doc"
              title="Todavía no hay documentos publicados"
              description="Aquí aparecerán los estados financieros y la documentación institucional en cuanto se publiquen desde el panel."
            />
          ) : (
            <div className="flex flex-col gap-16">
              {groups.map((group) => (
                <CategoryRail
                  key={group.category}
                  title={DOCUMENT_CATEGORY_LABELS[group.category]}
                  description={DOCUMENT_CATEGORY_DESCRIPTIONS[group.category]}
                  label={DOCUMENT_CATEGORY_LABELS[group.category]}
                  href="/documentos"
                  total={group.items.length}
                >
                  {group.items.slice(0, RAIL_LIMIT).map((document) => (
                    <li
                      key={document.id}
                      className="kcb-rail-item w-[min(22rem,82vw)] rounded-2xl border border-line bg-white px-5"
                    >
                      <DocumentRow document={document} />
                    </li>
                  ))}
                </CategoryRail>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  )
}
